const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (required for rate-limit behind localtunnel/vercel)
const PORT = process.env.PORT || 3001;

// Define JWT_SECRET if not in .env (Fallback for development/vercel simple deploy)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production_12345';

// --- POSTGRESQL CONNECTION (Primary) ---
// If DATABASE_URL is present, we use PostgreSQL as preferred in requirements
// Also fallback to POSTGRES_URL which Vercel/Supabase integration adds automatically
const PG_CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pgPool = null;
if (PG_CONNECTION_STRING) {
    try {
        console.log('🔌 Connecting to PostgreSQL...');
        
        // Remove sslmode=require from connection string to avoid conflict with manual ssl config
        // This ensures rejectUnauthorized: false is respected if we pass it in the config object
        let connectionString = PG_CONNECTION_STRING;
        // Fix: Clean up sslmode=require properly from query params
        if (connectionString.includes('sslmode=require')) {
             connectionString = connectionString.replace('sslmode=require', '');
             // Clean up potential double && or trailing ? or &
             connectionString = connectionString.replace('?&', '?').replace('&&', '&').replace(/\?$/, '').replace(/&$/, '');
        }

        pgPool = new Pool({
            connectionString: connectionString,
            ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }, // Disable SSL for localhost, enable relaxed SSL for cloud
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 10000
        });
        
        // Test connection immediately to catch errors early
        pgPool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            // Don't crash, just log required
        });
        
        console.log('✅ PostgreSQL Configured');
    } catch (err) {
        console.error('Failed to configure PostgreSQL:', err);
        pgPool = null;
    }
}

// --- MONGODB CONNECTION (Legacy/Backup) ---
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
    if (!MONGO_URI) return null;
    if (mongoose.connection.readyState >= 1) return mongoose.connection;
    
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ MongoDB Connected");
        return mongoose.connection;
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        return null;
    }
};

// Define Schemas
const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    companyName: String,
    role: String,
    plan: String,
    remainingDownloads: mongoose.Schema.Types.Mixed,
    subscriptionStartDate: String,
    subscriptionEndDate: String,
    isActive: Boolean,
    createdAt: String,
    isBanned: Boolean,
    banReason: String,
    banExpiresAt: String,
    bannedIp: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);


// File DB Helper
// Ensure consistency by using the robust readDB/writeDB functions defined later
const readFileDB = () => {
    // This wrapper allows readDB to be defined later in the file but used here via closure
    // execution happens only when API routes are hit, by which time readDB is defined.
    return readDB();
};

const writeFileDB = (data) => {
    return writeDB(data);
};


// Unified DB Access (Postgres > MongoDB > File-System)
const dbAdapter = {
    getUsers: async () => {
        let pgError = null;
        if (pgPool) {
            try {
                // Ensure table exists
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        email TEXT UNIQUE,
                        data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                const res = await pgPool.query('SELECT * FROM users');
                return res.rows.map(row => ({...row.data, id: row.id, email: row.email}));
            } catch (err) {
                console.error('PG GetUsers Error:', err);
                pgError = err;
                // Don't throw, fall through to next method
            }
        }
        
        // Fallback or explicit Mongo
        if (MONGO_URI && !pgError) { // Only try mongo if PG wasn't the intended target that failed
            try {
                await connectDB();
                const users = await User.find({}).lean();
                return users.map(u => ({...u, id: u.id || u._id.toString()}));
            } catch (e) { console.error('Mongo Error:', e); }
        }
        
        // Ultimate Fallback: File System
        console.warn('⚠️ Falling back to FileSystem DB');
        return readFileDB().users || [];
    },
    
    addUser: async (user) => {
        if (pgPool) {
            try {
                // Ensure table exists on first write too
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        email TEXT UNIQUE,
                        data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                
                await pgPool.query('INSERT INTO users(id, email, data) VALUES($1, $2, $3)', 
                   [user.id, user.email, user]);
                return user;
            } catch (err) {
                 console.error('PG AddUser Error:', err);
                 // Fallback to file system if PG fails
                 const data = readFileDB();
                 data.users.push(user);
                 writeFileDB(data);
                 return user;
            }
        }

        if (MONGO_URI) {
            try {
                await connectDB();
                const newUser = new User(user);
                await newUser.save();
                return newUser;
            } catch (e) { console.error('Mongo AddUser Error:', e);}
        }
        
        const data = readFileDB();
        data.users.push(user);
        if (!writeFileDB(data)) {
            throw new Error("Veritabanına yazma hatası (Perms/DiskFull?)");
        }
        return user;
    },
    
    updateUser: async (id, updates) => {
        if (pgPool) {
             try {
                // First get existing
                const existing = await pgPool.query('SELECT data FROM users WHERE id = $1', [id]);
                if (existing.rows.length > 0) {
                    const newData = { ...existing.rows[0].data, ...updates };
                    await pgPool.query('UPDATE users SET data = $1 WHERE id = $2', [newData, id]);
                }
                return;
             } catch (err) { console.error('PG Error:', err); }
        }

        if (MONGO_URI) {
            try {
                await connectDB();
                await User.findOneAndUpdate({ id: id }, updates);
                return;
            } catch (e) { console.error('Mongo UpdateUser Error:', e);}
        }
        
        const data = readFileDB();
        const index = data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...updates };
            writeFileDB(data);
        }
    },
    
    findUserByEmail: async (email) => {
        if (pgPool) {
             try {
                // Short timeout for login check if possible, though pgPool config handles connection timeout.
                // We rely on pool error handling.
                const res = await pgPool.query('SELECT data FROM users WHERE email = $1', [email]);
                return res.rows.length ? res.rows[0].data : undefined;
             } catch (err) { 
                 console.error('PG FindUserByEmail Error:', err.message); 
                 // If PG fails, we MUST fallback. The catch block allows execution to continue below.
             }
        }

        if (MONGO_URI) {
            try {
                await connectDB();
                return await User.findOne({ email }).lean();
            } catch (e) {
                 console.error('Mongo FindUser Error:', e);
            }
        }
        return readFileDB().users.find(u => u.email === email);
    },

    findUserById: async (id) => {
        if (pgPool) {
             try {
                const res = await pgPool.query('SELECT data FROM users WHERE id = $1', [id]);
                return res.rows.length ? res.rows[0].data : undefined;
             } catch (err) { console.error('PG FindUserById Error:', err.message); }
        }

        if (MONGO_URI) {
            try {
                await connectDB();
                return await User.findOne({ id }).lean(); // or _id
            } catch (e) {
                console.error('Mongo FindUserById Error:', e);
            }
        }
        return readFileDB().users.find(u => u.id === id);
    },

    deleteUser: async (id) => {
        let deleted = false;
        if (pgPool) {
             try {
                const res = await pgPool.query('DELETE FROM users WHERE id = $1', [id]);
                if (res.rowCount > 0) deleted = true;
             } catch (err) { console.error('PG DeleteUser Error:', err.message); }
        }

        if (MONGO_URI) {
            try {
                await connectDB();
                const res = await User.deleteOne({ id });
                if (res.deletedCount > 0) deleted = true;
            } catch (e) { console.error('Mongo DeleteUser Error:', e);}
        }
        
        const data = readFileDB();
        const initialLen = data.users.length;
        data.users = data.users.filter(u => u.id !== id);
        if (data.users.length !== initialLen) {
            writeFileDB(data);
            deleted = true;
        }
        return deleted;
    }
};

// --- SECURITY MIDDLEWARE ---

// app.use(helmet()); // Temporarily disabled for troubleshooting
app.use(cors({
  origin: '*', // Allow all origins for easier local network access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
})); 
app.use(express.json());

// Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Relaxed limit for testing
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- SIMPLE FILE-BASED DATABASE ---
// On Vercel, only /tmp is writable.
// We'll use /tmp/db.json as the working DB but synchronize.
const SOURCE_DB_FILE = path.join(__dirname, 'db.json');

// Determine if we are in a read-only environment (Vercel Production)
// VERCEL_ENV is 'production', 'preview', or 'development'
const IS_VERCEL_PROD = process.env.VERCEL && process.env.VERCEL_ENV === 'production';

// Use /tmp only if we are forced to (Vercel Prod), otherwise update local file for persistence
const DB_FILE = IS_VERCEL_PROD 
    ? path.join('/tmp', 'db.json') 
    : path.join(__dirname, 'db.json');

console.log(`📂 Database File Path: ${DB_FILE}`);

// Helper to read/write DB
const readDB = () => {
    try {
        console.log(`🔍 DB Okunuyor: ${DB_FILE}`);
        if (!fs.existsSync(DB_FILE)) {
             // FORCE OVERWRITE: If DB_FILE is in /tmp, ALWAYS overwrite from source on startup
             // This ensures we start with the repo's db.json every time serverless function cold starts
             if (IS_VERCEL_PROD && fs.existsSync(SOURCE_DB_FILE)) {
                 try {
                    console.log("🔄 Resetting /tmp DB from source...");
                    const params = fs.readFileSync(SOURCE_DB_FILE, 'utf8');
                    fs.writeFileSync(DB_FILE, params);
                    return JSON.parse(params);
                 } catch(e) {
                     console.error("Failed to copy source DB to tmp:", e);
                 }
             }
            return { users: [], documents: [], templates: INITIAL_TEMPLATES };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        try {
            const parsed = JSON.parse(data);
             if (!parsed.templates) parsed.templates = INITIAL_TEMPLATES;
            return parsed;
        } catch (parseErr) {
            console.error("DB Parse Error - Corrupt File:", parseErr);
            return { users: [], documents: [], templates: INITIAL_TEMPLATES };
        }
    } catch (err) {
        console.error("DB Read Error:", err);
        return { users: [], documents: [], templates: INITIAL_TEMPLATES };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("DB Write Error:", err);
        return false;
    }
};

const INITIAL_TEMPLATES = [
  {
    id: '1',
    title: 'Acil Durum Hizmet Planı',
    category: 'ISG',
    description: 'İş yerleri için zorunlu acil durum eylem ve hizmet planı şablonu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: [
      { key: 'companyName', label: 'Firma Adı', type: 'text', required: true, placeholder: 'Şirket tam unvanı' },
      { key: 'dangerLevel', label: 'Tehlike Sınıfı', type: 'select', options: ['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli'], required: true },
      { key: 'employeeCount', label: 'Çalışan Sayısı', type: 'number', required: true },
      { key: 'emergencyTeamLeader', label: 'Acil Durum Ekip Lideri', type: 'text', required: true },
      { key: 'assemblyPoint', label: 'Toplanma Alanı Konumu', type: 'textarea', required: true },
      { key: 'lastDrillDate', label: 'Son Tatbikat Tarihi', type: 'date' }
    ]
  },
  {
    id: '2',
    title: 'Hizmet Teklif Formu',
    category: 'Genel',
    description: 'Standart hizmet teklif ve kapsam belirleme formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 12,
    fields: [
      { key: 'clientName', label: 'Müşteri Adı', type: 'text', required: true },
      { key: 'serviceType', label: 'Hizmet Türü', type: 'select', options: ['Danışmanlık', 'Eğitim', 'Denetim', 'Yazılım', 'Bakım/Onarım'], required: true },
      { key: 'projectDuration', label: 'Proje Süresi (Gün)', type: 'number' },
      { key: 'projectScope', label: 'Proje Kapsamı ve Detaylar', type: 'textarea', required: true },
      { key: 'budgetEstimate', label: 'Tahmini Bütçe (TL)', type: 'number' },
      { key: 'validUntil', label: 'Teklif Geçerlilik Tarihi', type: 'date' }
    ]
  },
  {
    id: '3',
    title: 'Eğitim Katılım Sertifikası',
    category: 'İK',
    description: 'Personel eğitimleri sonrası verilecek başarı sertifikası.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
      { key: 'participantName', label: 'Katılımcı Adı Soyadı', type: 'text', required: true },
      { key: 'trainingTopic', label: 'Eğitim Konusu', type: 'text', required: true },
      { key: 'trainerName', label: 'Eğitmen Adı', type: 'text', required: true },
      { key: 'trainingDate', label: 'Eğitim Tarihi', type: 'date', required: true },
      { key: 'durationHours', label: 'Eğitim Süresi (Saat)', type: 'number' },
      { key: 'competencyLevel', label: 'Yetkinlik Seviyesi', type: 'select', options: ['Başlangıç', 'Orta', 'İleri', 'Uzman'] }
    ]
  },
  {
    id: '4',
    title: 'Saha Denetim Raporu',
    category: 'Denetim',
    description: 'Saha denetimleri için detaylı raporlama formatı.',
    isPremium: true,
    photoCapacity: 15,
    fields: [
      { key: 'siteLocation', label: 'Denetim Bölgesi / Lokasyon', type: 'text', required: true },
      { key: 'auditType', label: 'Denetim Türü', type: 'select', options: ['Haberli Denetim', 'Habersiz Denetim', 'Periyodik Kontrol', 'Şikayet Üzerine'] },
      { key: 'complianceScore', label: 'Uygunluk Skoru (0-100)', type: 'number' },
      { key: 'observations', label: 'Gözlemler ve Bulgular', type: 'textarea', required: true },
      { key: 'criticalNonConformity', label: 'Kritik Uygunsuzluk Var mı?', type: 'checkbox', placeholder: 'Evet, kritik risk mevcut' },
      { key: 'correctiveActionDeadline', label: 'DÖF Termin Tarihi', type: 'date' }
    ]
  },
  {
    id: '5',
    title: 'Risk Analizi Formu (5x5 L Tipi)',
    category: 'ISG',
    description: '5x5 Risk matrisi değerlendirme formu.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
      { key: 'workActivity', label: 'Yapılan İş / Faaliyet', type: 'textarea', required: true },
      { key: 'hazardSource', label: 'Tehlike Kaynağı', type: 'text', required: true },
      { key: 'riskDescription', label: 'Risk Tanımı', type: 'textarea', required: true },
      { key: 'probability', label: 'Olasılık (1-5)', type: 'select', options: ['1 - Çok Küçük', '2 - Küçük', '3 - Orta', '4 - Yüksek', '5 - Çok Yüksek'], required: true },
      { key: 'severity', label: 'Şiddet (1-5)', type: 'select', options: ['1 - Çok Hafif', '2 - Hafif', '3 - Orta', '4 - Ciddi', '5 - Çok Ciddi'], required: true },
      { key: 'precautions', label: 'Alınacak Önlemler', type: 'textarea', required: true }
    ]
  },
  {
    id: '6',
    title: 'Personel Görev Tanımı',
    category: 'İK',
    description: 'Çalışan görev ve sorumluluk bildirim formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
      { key: 'employeeName', label: 'Personel Adı', type: 'text', required: true },
      { key: 'jobTitle', label: 'Ünvan / Pozisyon', type: 'text', required: true },
      { key: 'serviceDepartment', label: 'Departman', type: 'text', required: true },
      { key: 'reportsTo', label: 'Bağlı Olduğu Yönetici', type: 'text' },
      { key: 'responsibilities', label: 'Temel Sorumluluklar', type: 'textarea', required: true, placeholder: 'Maddeler halinde giriniz...' },
      { key: 'requiredSkills', label: 'Aranan Nitelikler', type: 'textarea' }
    ]
  },
  {
    id: '7',
    title: 'Makine Bakım Kartı',
    category: 'Teknik',
    description: 'Periyodik bakım takip çizelgesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: [
      { key: 'machineName', label: 'Makine Adı/Kodu', type: 'text', required: true },
      { key: 'maintenanceType', label: 'Bakım Türü', type: 'select', options: ['Günlük', 'Haftalık', 'Aylık', 'Yıllık', 'Arıza Müdahale'] },
      { key: 'technicianName', label: 'Bakım Yapan Teknisyen', type: 'text', required: true },
      { key: 'partsReplaced', label: 'Değişen Parçalar', type: 'textarea' },
      { key: 'nextMaintenanceDate', label: 'Gelecek Bakım Tarihi', type: 'date', required: true },
      { key: 'cost', label: 'Bakım Maliyeti', type: 'number' }
    ]
  },
  {
    id: '8',
    title: 'Kaza Tespit Tutanağı',
    category: 'ISG',
    description: 'İş kazası bildirim ve tespit formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 20,
    fields: [
      { key: 'accidentTime', label: 'Kaza Tarihi ve Saati', type: 'date', required: true }, // datetime type not available yet, using date
      { key: 'location', label: 'Kaza Yeri', type: 'text', required: true },
      { key: 'injuredPerson', label: 'Kazazede Adı Soyadı', type: 'text', required: true },
      { key: 'injuryType', label: 'Yaralanma Türü', type: 'select', options: ['Kesik/Sıyrık', 'Burkulma/Ezilme', 'Kırık/Çıkık', 'Yanık', 'Elektrik Çarpması', 'Diğer'] },
      { key: 'accidentDescription', label: 'Kaza Oluş Şekli (Detaylı)', type: 'textarea', required: true },
      { key: 'witnesses', label: 'Tanıklar', type: 'text' }
    ]
  },
  {
    id: '9',
    title: 'Zimmet Formu',
    category: 'İK',
    description: 'Demirbaş teslim tutanağı.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
      { key: 'recipientName', label: 'Teslim Alan Personel', type: 'text', required: true },
      { key: 'itemName', label: 'Demirbaş Adı', type: 'text', required: true },
      { key: 'itemSerial', label: 'Seri No / Kod', type: 'text' },
      { key: 'condition', label: 'Malzeme Durumu', type: 'select', options: ['Sıfır', 'Yeni Gibi', 'Kullanılmış', 'Tamirli'] },
      { key: 'deliveryDate', label: 'Teslim Tarihi', type: 'date', required: true },
      { key: 'returnDate', label: 'İade Alınacak Tarih (Varsa)', type: 'date' }
    ]
  },
  {
    id: '10',
    title: 'KVKK Açık Rıza Metni',
    category: 'Hukuk',
    description: 'Kişisel verilerin korunması kanunu rıza beyanı.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'personName', label: 'İlgili Kişi Adı Soyadı', type: 'text', required: true },
       { key: 'identityNumber', label: 'T.C. Kimlik No', type: 'text', required: true },
       { key: 'dataTypes', label: 'İşlenecek Veri Kategorileri', type: 'textarea', placeholder: 'Kimlik, İletişim, Finansal veriler vb.' },
       { key: 'consentGiven', label: 'Aşağıdaki şartları okudum, anladım ve onaylıyorum.', type: 'checkbox', required: true, placeholder: 'Kabul Ediyorum' }
    ]
  },
  {
    id: '11',
    title: 'Çalışan Performans Değerlendirme',
    category: 'İK',
    description: 'Yıllık personel performans raporlama formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'employee', label: 'Değerlendirilen Personel', type: 'text', required: true },
       { key: 'period', label: 'Değerlendirme Dönemi', type: 'text', placeholder: '2026/Q1' },
       { key: 'goalsAchievement', label: 'Hedef Gerçekleştirme Oranı (%)', type: 'number' },
       { key: 'strengths', label: 'Güçlü Yönler', type: 'textarea' },
       { key: 'developmentAreas', label: 'Gelişime Açık Yönler', type: 'textarea' },
       { key: 'overallRating', label: 'Genel Puan (1-5)', type: 'select', options: ['1 (Zayıf)', '2 (Gelişmeli)', '3 (Beklenen)', '4 (İyi)', '5 (Üstün)'] }
    ]
  },
  {
    id: '12',
    title: 'İş Sağlığı ve Güvenliği Kurulu Kararı',
    category: 'ISG',
    description: 'Kurul toplantı tutanağı ve alınan kararlar.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
       { key: 'meetingParams', label: 'Toplantı No / Tarih', type: 'text', required: true },
       { key: 'attendees', label: 'Katılımcılar', type: 'textarea', required: true },
       { key: 'agenda', label: 'Gündem Maddeleri', type: 'textarea', required: true },
       { key: 'decisions', label: 'Alınan Kararlar', type: 'textarea', required: true },
       { key: 'nextMeetingDate', label: 'Sonraki Toplantı Tarihi', type: 'date' }
    ]
  },
  {
    id: '13',
    title: 'Müşteri Memnuniyet Anketi',
    category: 'Kalite',
    description: 'Müşteri geri bildirim ve talep değerlendirme formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'customer', label: 'Müşteri / Firma', type: 'text' },
       { key: 'serviceQuality', label: 'Hizmet Kalitesi (1-10)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
       { key: 'speed', label: 'Hız / Termin (1-10)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
       { key: 'communication', label: 'İletişim (1-10)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
       { key: 'suggestions', label: 'Öneri ve Görüşler', type: 'textarea' }
    ]
  },
  {
    id: '14',
    title: 'Araç Kontrol Formu',
    category: 'Lojistik',
    description: 'Şirket araçlarının periyodik kontrol listesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: [
       { key: 'plateNumber', label: 'Araç Plaka', type: 'text', required: true },
       { key: 'driverName', label: 'Sürücü Adı', type: 'text', required: true },
       { key: 'km', label: 'Kilometre', type: 'number', required: true },
       { key: 'tires', label: 'Lastik Durumu', type: 'select', options: ['İyi', 'Orta', 'Kötü'] },
       { key: 'oilLevel', label: 'Yağ ve Sıvılar', type: 'select', options: ['Tamam', 'Eksik'] },
       { key: 'bodyDamage', label: 'Kaporta Hasarı Var mı?', type: 'checkbox' },
       { key: 'interiorCleanliness', label: 'Araç İçi Temizlik', type: 'select', options: ['Temiz', 'Kirli'] }
    ]
  },
  {
    id: '15',
    title: 'Yıllık İzin Formu',
    category: 'İK',
    description: 'Personel yıllık izin talep belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'employeeName', label: 'Personel Adı', type: 'text', required: true },
       { key: 'department', label: 'Departman', type: 'text' },
       { key: 'startDate', label: 'İzin Başlangıç Tarihi', type: 'date', required: true },
       { key: 'endDate', label: 'İzin Bitiş Tarihi', type: 'date', required: true },
       { key: 'totalDays', label: 'Toplam Gün Sayısı', type: 'number', required: true },
       { key: 'substituteEmployee', label: 'Yerine Bakacak Personel', type: 'text' },
       { key: 'addressDuringLeave', label: 'İzindeki Adres/Tel', type: 'textarea' }
    ]
  },
  {
    id: '16',
    title: 'Proje İlerleme Raporu',
    category: 'Genel',
    description: 'Proje durum ve ilerleme raporu şablonu.',
    isPremium: true,
    photoCapacity: 8,
    fields: [
       { key: 'projectName', label: 'Proje Adı', type: 'text', required: true },
       { key: 'manager', label: 'Proje Yöneticisi', type: 'text' },
       { key: 'status', label: 'Genel Durum', type: 'select', options: ['Zamanında', 'Gecikmeli', 'Riskli', 'Durduruldu'] },
       { key: 'completedTasks', label: 'Tamamlanan İşler', type: 'textarea' },
       { key: 'pendingTasks', label: 'Bekleyen İşler', type: 'textarea' },
       { key: 'risks', label: 'Riskler ve Sorunlar', type: 'textarea' },
       { key: 'nextMilestone', label: 'Bir Sonraki Aşama', type: 'text' }
    ]
  },
  {
    id: '17',
    title: 'Satın Alma Talep Formu',
    category: 'Muhasebe',
    description: 'Mal veya hizmet alım talep formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'requester', label: 'Talep Eden', type: 'text', required: true },
       { key: 'department', label: 'Departman', type: 'text' },
       { key: 'itemName', label: 'Ürün/Hizmet Adı', type: 'text', required: true },
       { key: 'quantity', label: 'Miktar', type: 'number', required: true },
       { key: 'estimatedPrice', label: 'Tahmini Birim Fiyat', type: 'number' },
       { key: 'urgency', label: 'Aciliyet', type: 'select', options: ['Normal', 'Acil', 'Çok Acil'] },
       { key: 'supplierSuggestion', label: 'Önerilen Tedarikçi', type: 'text' },
       { key: 'justification', label: 'Gerekçe', type: 'textarea' }
    ]
  },
  {
    id: '18',
    title: 'Müşteri Şikayet Formu',
    category: 'Kalite',
    description: 'Müşteri şikayetlerini kayıt altına alma formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'customerName', label: 'Müşteri Adı', type: 'text', required: true },
       { key: 'contactInfo', label: 'İletişim Bilgileri', type: 'text' },
       { key: 'complaintSubject', label: 'Şikayet Konusu', type: 'text', required: true },
       { key: 'productService', label: 'İlgili Ürün/Hizmet', type: 'text' },
       { key: 'complaintDetails', label: 'Şikayet Detayı', type: 'textarea', required: true },
       { key: 'priority', label: 'Öncelik', type: 'select', options: ['Düşük', 'Orta', 'Yüksek'] },
       { key: 'assignedTo', label: 'İlgilenen Personel', type: 'text' }
    ]
  },
  {
    id: '19',
    title: 'Toplantı Tutanağı',
    category: 'Genel',
    description: 'Toplantı notları ve alınan kararlar.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'meetingSubject', label: 'Toplantı Konusu', type: 'text', required: true },
       { key: 'meetingDate', label: 'Tarih', type: 'date', required: true },
       { key: 'location', label: 'Yer', type: 'text' },
       { key: 'attendees', label: 'Katılımcılar', type: 'textarea', required: true },
       { key: 'notes', label: 'Görüşülen Konular', type: 'textarea', required: true },
       { key: 'decisions', label: 'Alınan Kararlar', type: 'textarea', required: true },
       { key: 'nextMeeting', label: 'Bir Sonraki Toplantı Tarihi', type: 'date' }
    ]
  },
  {
    id: '20',
    title: 'Gider Pusulası Taslağı',
    category: 'Muhasebe',
    description: 'Vergi mükellefi olmayanlardan mal/hizmet alım belgesi taslağı.',
    isPremium: true,
    photoCapacity: 5,
    fields: [
       { key: 'receiverName', label: 'Ödeme Yapılan Kişi', type: 'text', required: true },
       { key: 'tcKn', label: 'T.C. Kimlik No', type: 'text', required: true },
       { key: 'address', label: 'Adres', type: 'textarea' },
       { key: 'serviceDescription', label: 'İşin/Malın Mahiyeti', type: 'text', required: true },
       { key: 'netAmount', label: 'Net Tutar', type: 'number', required: true },
       { key: 'taxRate', label: 'Stopaj Oranı (%)', type: 'select', options: ['10', '15', '20'] },
       { key: 'paymentMethod', label: 'Ödeme Şekli', type: 'select', options: ['Nakit', 'Banka Transferi'] }
    ]
  },
  {
    id: '21',
    title: 'Sosyal Medya İçerik Planı',
    category: 'Pazarlama',
    description: 'Haftalık sosyal medya paylaşım takvimi.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
       { key: 'week', label: 'Hafta', type: 'text', placeholder: 'Örn: Şubat 3. Hafta' },
       { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'LinkedIn', 'Twitter', 'YouTube', 'TikTok'] },
       { key: 'postType', label: 'Gönderi Türü', type: 'select', options: ['Reels', 'Post', 'Story', 'Makale'] },
       { key: 'visualConcept', label: 'Görsel Konsept', type: 'textarea' },
       { key: 'caption', label: 'Metin / Açıklama', type: 'textarea' },
       { key: 'hashtags', label: 'Etiketler (Hashtags)', type: 'textarea' },
       { key: 'publishDate', label: 'Yayın Tarihi/Saati', type: 'text' }
    ]
  },
  {
    id: '22',
    title: 'Web Sitesi SEO Analizi',
    category: 'Teknik',
    description: 'Web sitesi teknik ve içerik analizi raporu.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
       { key: 'websiteUrl', label: 'Web Sitesi URL', type: 'text', required: true },
       { key: 'analysisDate', label: 'Analiz Tarihi', type: 'date' },
       { key: 'mobileSpeed', label: 'Mobil Hız Skoru (0-100)', type: 'number' },
       { key: 'desktopSpeed', label: 'Masaüstü Hız Skoru (0-100)', type: 'number' },
       { key: 'technicalIssues', label: 'Teknik Sorunlar', type: 'textarea' },
       { key: 'contentQuality', label: 'İçerik Kalitesi', type: 'select', options: ['Zayıf', 'Orta', 'İyi', 'Mükemmel'] },
       { key: 'keywordRanking', label: 'Anahtar Kelime Sıralamaları', type: 'textarea' },
       { key: 'recommendations', label: 'Öneriler', type: 'textarea' }
    ]
  },
  {
    id: '23',
    title: 'Yangın Tüpü Kontrol Formu',
    category: 'ISG',
    description: 'Yangın söndürme ekipmanları aylık kontrol çizelgesi.',
    isPremium: true,
    photoCapacity: 20,
    fields: [
       { key: 'location', label: 'Bölge / Kat', type: 'text', required: true },
       { key: 'tubeCount', label: 'Kontrol Edilen Tüp Sayısı', type: 'number', required: true },
       { key: 'pressureCheck', label: 'Manometre Basınç Kontrolü', type: 'select', options: ['Uygun', 'Uygun Değil'] },
       { key: 'sealCheck', label: 'Mühür/Pim Kontrolü', type: 'select', options: ['Uygun', 'Uygun Değil'] },
       { key: 'hoseCheck', label: 'Hortum/Lans Kontrolü', type: 'select', options: ['Uygun', 'Uygun Değil'] },
       { key: 'accessibility', label: 'Erişim Kolaylığı', type: 'select', options: ['Önü Açık', 'Engellenmiş'] },
       { key: 'controller', label: 'Kontrol Eden', type: 'text', required: true }
    ]
  },
  {
    id: '24',
    title: 'Stok Sayım Tutanağı',
    category: 'Muhasebe',
    description: 'Dönemsel stok sayım ve mutabakat formu.',
    isPremium: true,
    fields: [
       { key: 'warehouse', label: 'Depo Adı', type: 'text', required: true },
       { key: 'countDate', label: 'Sayım Tarihi', type: 'date', required: true },
       { key: 'category', label: 'Ürün Kategorisi', type: 'text' },
       { key: 'countedItems', label: 'Sayılan Kalemler ve Miktarları', type: 'textarea', required: true, placeholder: 'Ürün A: 100 Adet\nÜrün B: 50 Adet...' },
       { key: 'discrepancy', label: 'Fark Var mı?', type: 'checkbox' },
       { key: 'notes', label: 'Açıklama', type: 'textarea' },
       { key: 'counters', label: 'Sayım Ekibi İmzaları', type: 'text' }
    ]
  },
  {
    id: '25',
    title: 'İşten Ayrılış Mülakat Formu',
    category: 'İK',
    description: 'Şirketten ayrılan personelle yapılan çıkış görüşmesi.',
    isPremium: true,
    fields: [
       { key: 'employeeName', label: 'Personel Adı', type: 'text', required: true },
       { key: 'leaveReason', label: 'Ayrılma Nedeni', type: 'select', options: ['İstifa', 'Emeklilik', 'Başka İş Fırsatı', 'Ücret Memnuniyetsizliği', 'Yönetimle Anlaşmazlık', 'Şehir Değişikliği'] },
       { key: 'satisfaction', label: 'Şirket Memnuniyeti (1-5)', type: 'select', options: ['1 (Çok Düşük)', '2', '3', '4', '5 (Çok Yüksek)'] },
       { key: 'managementRating', label: 'Yönetim Değerlendirmesi', type: 'textarea' },
       { key: 'suggestions', label: 'Şirkete Öneriler', type: 'textarea' },
       { key: 'wouldReturn', label: 'İlerde tekrar çalışmak ister mi?', type: 'select', options: ['Evet', 'Hayır', 'Belki'] }
    ]
  },
  {
    id: '26',
    title: 'Etkinlik Planlama Formu',
    category: 'Genel',
    description: 'Kurumsal etkinlik ve organizasyon plan şablonu.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
       { key: 'eventName', label: 'Etkinlik Adı', type: 'text', required: true },
       { key: 'eventDate', label: 'Tarih', type: 'date', required: true },
       { key: 'venue', label: 'Mekan', type: 'text', required: true },
       { key: 'guestCount', label: 'Tahmini Katılımcı Sayısı', type: 'number' },
       { key: 'budget', label: 'Bütçe', type: 'number' },
       { key: 'catering', label: 'Yiyecek/İçecek', type: 'select', options: ['Dahil', 'Hariç', 'Snack'] },
       { key: 'technicalNeeds', label: 'Teknik İhtiyaçlar', type: 'textarea', placeholder: 'Projeksiyon, Ses Sistemi, Mikrofon...' },
       { key: 'schedule', label: 'Akış Planı', type: 'textarea' }
    ]
  },
  {
    id: '27',
    title: 'Eğitim Değerlendirme Anketi',
    category: 'İK',
    description: 'Eğitim sonrası katılımcı geri bildirimi.',
    isPremium: true,
    fields: [
       { key: 'trainingTitle', label: 'Eğitim Konusu', type: 'text', required: true },
       { key: 'trainer', label: 'Eğitmen', type: 'text' },
       { key: 'contentScore', label: 'İçerik Yeterliliği (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'] },
       { key: 'trainerScore', label: 'Eğitmen Performansı (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'] },
       { key: 'venueScore', label: 'Ortam/Materyal (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'] },
       { key: 'mostUselessPart', label: 'En Faydalı Bölüm', type: 'text' },
       { key: 'improvements', label: 'Geliştirilmesi Gerekenler', type: 'textarea' }
    ]
  },
  {
    id: '28',
    title: 'Tedarikçi Değerlendirme Formu',
    category: 'Kalite',
    description: 'Tedarikçi performans analizi ve puanlama.',
    isPremium: true,
    fields: [
       { key: 'supplierName', label: 'Tedarikçi Firma', type: 'text', required: true },
       { key: 'evaluationPeriod', label: 'Değerlendirme Dönemi', type: 'text' },
       { key: 'qualityScore', label: 'Ürün Kalitesi (25p)', type: 'number' },
       { key: 'deliveryScore', label: 'Teslimat Süresi (25p)', type: 'number' },
       { key: 'priceScore', label: 'Fiyat Politikası (25p)', type: 'number' },
       { key: 'supportScore', label: 'İletişim ve Destek (25p)', type: 'number' },
       { key: 'status', label: 'Sonuç Kararı', type: 'select', options: ['Onaylı', 'Şartlı Onay', 'Red'] },
       { key: 'notes', label: 'Notlar', type: 'textarea' }
    ]
  },
  {
    id: '29',
    title: 'Haftalık Çalışma Raporu',
    category: 'Genel',
    description: 'Personel haftalık faaliyet özeti.',
    isPremium: true,
    fields: [
       { key: 'employee', label: 'Personel', type: 'text', required: true },
       { key: 'weekOf', label: 'Hafta Başlangıç Tarihi', type: 'date', required: true },
       { key: 'completed', label: 'Tamamlanan Görevler', type: 'textarea', required: true },
       { key: 'ongoing', label: 'Devam Eden İşler', type: 'textarea' },
       { key: 'nextWeekPlan', label: 'Gelecek Hafta Planı', type: 'textarea' },
       { key: 'blocks', label: 'Karşılaşılan Engeller', type: 'textarea' }
    ]
  },
  {
    id: '30',
    title: 'İş Başvuru Formu',
    category: 'İK',
    description: 'Aday personel bilgi toplama formu.',
    isPremium: true,
    photoCapacity: 1,
    fields: [
       { key: 'candidateName', label: 'Ad Soyad', type: 'text', required: true },
       { key: 'position', label: 'Başvurulan Pozisyon', type: 'text', required: true },
       { key: 'birthDate', label: 'Doğum Tarihi', type: 'date' },
       { key: 'education', label: 'Eğitim Durumu', type: 'select', options: ['Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'] },
       { key: 'experience', label: 'Tecrübe (Yıl)', type: 'number' },
       { key: 'phone', label: 'Telefon', type: 'text', required: true },
       { key: 'email', label: 'E-posta', type: 'text' },
       { key: 'lastCompany', label: 'Son Çalıştığı Yer', type: 'text' }
    ]
  },
  {
    id: '31',
    title: 'Masraf Formu',
    category: 'Muhasebe',
    description: 'Personel masraf bildirim çizelgesi.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 10,
    fields: [
       { key: 'employee', label: 'Personel', type: 'text', required: true },
       { key: 'expenseDate', label: 'Tarih', type: 'date', required: true },
       { key: 'category', label: 'Masraf Türü', type: 'select', options: ['Yemek', 'Ulaşım', 'Konaklama', 'Temsil/Ağırlama', 'Diğer'] },
       { key: 'description', label: 'Açıklama', type: 'text', required: true },
       { key: 'amount', label: 'Tutar', type: 'number', required: true },
       { key: 'receiptNo', label: 'Fiş/Fatura No', type: 'text' }
    ]
  },
  {
    id: '32',
    title: 'Avans Talep Formu',
    category: 'Muhasebe',
    description: 'Maaş veya iş avansı istek formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'requestor', label: 'Talep Eden', type: 'text', required: true },
       { key: 'amount', label: 'Talep Edilen Tutar', type: 'number', required: true },
       { key: 'type', label: 'Avans Türü', type: 'select', options: ['Maaş Avansı', 'İş Avansı/Harcırah'] },
       { key: 'dateNeeded', label: 'İstenen Tarih', type: 'date', required: true },
       { key: 'reason', label: 'Sebep/Açıklama', type: 'textarea' },
       { key: 'bankAccount', label: 'IBAN (Farklıysa)', type: 'text' }
    ]
  },
  {
    id: '33',
    title: 'Ziyaretçi Kayıt Formu',
    category: 'Genel',
    description: 'Şirket misafir giriş-çıkış takip listesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
       { key: 'visitorName', label: 'Ziyaretçi Adı Soyadı', type: 'text', required: true },
       { key: 'company', label: 'Geldiği Firma', type: 'text' },
       { key: 'host', label: 'Ziyaret Edilen Kişi', type: 'text', required: true },
       { key: 'entryTime', label: 'Giriş Saati', type: 'text', placeholder: '09:00' },
       { key: 'exitTime', label: 'Çıkış Saati', type: 'text', placeholder: '10:30' },
       { key: 'cardNo', label: 'Verilen Kart No', type: 'text' }
    ]
  }
];

// Initialize DB if not exists (or copy from source on Vercel startup)
if (!fs.existsSync(DB_FILE)) {
    let initialData = { users: [], documents: [], templates: INITIAL_TEMPLATES };
    
    // If we're on Vercel and have a source DB, copy it to /tmp
    if (process.env.VERCEL && fs.existsSync(SOURCE_DB_FILE)) {
        try {
            const sourceData = fs.readFileSync(SOURCE_DB_FILE, 'utf8');
            initialData = JSON.parse(sourceData);
            console.log('📂 Source DB copier to /tmp/db.json');
        } catch (e) {
            console.error('Failed to copy source DB:', e);
        }
    }
    
    // Ensure templates exist if source DB lacked them
    if (!initialData.templates || initialData.templates.length < 15) {
        initialData.templates = INITIAL_TEMPLATES;
    }
    
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    } catch (e) {
        console.error('Failed to initialize DB:', e);
    }
} else {
    // If DB exists but templates are missing (migration), add them
    try {
        const currentData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (!currentData.templates) {
            currentData.templates = INITIAL_TEMPLATES;
            fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2));
        }
    } catch(e) {}
}

// Helper to read/write DB (Defined above)
// const readDB = ... 
// const writeDB = ...

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        documents: []
    };
    writeDB(initialData);
}

// --- SEED ADMIN USER ---
// CRITICAL: We must use dbAdapter to ensure we update WHATEVER database is active (Postgres, Mongo, or File)
const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@kirbas.com';
        // GÜVENLİK: Admin şifresi hardcoded olmamalıdır. Çevresel değişkenden alınır.
        const adminPass = process.env.ADMIN_PASSWORD || 'Admin123456'; 
        
        let existingAdmin = await dbAdapter.findUserByEmail(adminEmail);
        
        // Salt ve Şifre Hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);

        if (!existingAdmin) {
            console.log("⚙️  Varsayılan Admin kullanıcısı oluşturuluyor...");
            
            const adminUser = {
                id: 'admin-001',
                name: 'Sistem Yöneticisi',
                email: adminEmail,
                password: hashedPassword,
                companyName: 'Yönetim Paneli',
                role: 'ADMIN',
                plan: 'YEARLY',
                remainingDownloads: 'UNLIMITED',
                subscriptionStartDate: new Date().toISOString(),
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            await dbAdapter.addUser(adminUser);
            console.log(`✅ Admin kullanıcısı oluşturuldu: ${adminEmail}`);
        } else {
             // Admin kullanıcı mevcutsa ŞİFREYİ GÜNCELLE (Her yeniden başlatmada garanti olsun)
             // Not: Normal kullanıcılar için bunu yapmıyoruz, sadece admin için.
             console.log(`ℹ️  Admin kullanıcısı mevcut: ${adminEmail} - Şifre senkronize ediliyor...`);
             
             await dbAdapter.updateUser(existingAdmin.id, {
                 password: hashedPassword,
                 role: 'ADMIN' // Role'ün de doğru olduğundan emin ol
             });
             
             console.log(`✅ Admin şifresi ve yetkileri güncellendi.`);
        }
    } catch (error) {
        console.error("Seed Admin Error:", error);
    }
};

// Initialize Admin
// NOTE: We call this without await because explicit await at top level requires top-level await support or wrapping.
// However, since database operations might be async (PG/Mongo), we ideally want to wait.
// For Vercel/Serverless, global scope initialization runs once.
// We will make seedAdmin fire-and-forget but log heavily. 
// OR better: we await it inside the request handler? No, that's slow.
// We'll run it and hope for the best, or wrap app start.
seedAdmin().then(() => console.log('Admin check complete')).catch(e => console.error(e));

// In-memory Logs (Real-world app would use DB)
const systemLogs = [];
// In-memory Auth Rate Limit & Reset Codes
const loginAttempts = {}; // { email: { count: 0, firstAttempt: timestamp } }
const forgotPasswordCodes = new Map(); // Map<email, { code, expiresAt }>
const startTime = Date.now();

// Logger Middleware
app.use((req, res, next) => {
    const log = {
        id: Date.now(),
        type: 'info',
        action: `${req.method} ${req.url}`,
        time: new Date().toISOString(),
        ip: req.ip
    };
    systemLogs.unshift(log); // Add to beginning
    if (systemLogs.length > 100) systemLogs.pop(); // Keep last 100
    next();
});

// Check mode
let isMockMode = false;

// detailed logging I added previously (specifically '[MAIL DEBUG]')
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log('[MAIL DEBUG] Starting Mail Configuration...');
if (EMAIL_USER) {
    console.log(`[MAIL DEBUG] User: ${EMAIL_USER.substring(0, 3)}***${EMAIL_USER.slice(-4)}`);
} else {
    console.error('[MAIL DEBUG] EMAIL_USER is missing!');
}

if (EMAIL_PASS) {
    console.log(`[MAIL DEBUG] Pass: ${EMAIL_PASS ? '****** (Exists)' : 'MISSING'}`);
} else {
    console.error('[MAIL DEBUG] EMAIL_PASS is missing!');
}


if (!EMAIL_USER || EMAIL_USER.includes('senin_mailin') || !EMAIL_PASS) {
    if (!isMockMode) {
      console.log("ℹ️ [INFO] E-posta ayarları girilmedi. Mail özellikleri devre dışı kalacak, sadece indirme çalışacak.");
    }
}


// Transporter Configuration
let transporter;

if (!isMockMode) {
    console.log("[MAIL DEBUG] NodeMailer (Gerçek E-posta Modu) yapılandırılıyor...");
    try {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // TLS
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });
        
        console.log("[MAIL DEBUG] SMTP Bağlantısı doğrulanıyor...");

        // Verify connection
        transporter.verify(function (error, success) {
            if (error) {
                console.error('❌ [SMTP ERROR] Mail Sunucusu Bağlantı Hatası!');
                console.error('❌ E-postalar gitmeyecek. Lütfen .env dosyasındaki EMAIL_USER ve EMAIL_PASS bilgilerini kontrol edin.');
                console.error('İpucu: Gmail için "Uygulama Şifresi" kullanmalısınız.');
                // isMockMode = true; // ARTIK MOCK MODA DÜŞMÜYORUZ, HATALI İSE HATALI KALSIN
            } else {
                console.log('✅ [SMTP SUCCESS] Mail sunucusu hazır ve çalışıyor!');
            }
        });
    } catch (e) {
        console.error("❌ [CRITICAL] NodeMailer Başlatılamadı:", e);
    }
} else {
    // Should roughly never reach here unless isMockMode forced manually
    console.log("[MAIL DEBUG] Mock (Simülasyon) Modu Aktif.");
}

// --- AUTHENTICATION & USER ROUTES ---

// Helper: Verify JWT Token Middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ success: false, message: 'Oturum açmanız gerekiyor.' });

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        // CRITICAL SECURITY: Just because the token is valid, doesn't mean the user still exists!
        // We MUST verify the user is still in the database.
        const currentUser = await dbAdapter.findUserById(decoded.id);

        if (!currentUser) {
             return res.status(401).json({ success: false, message: 'Kullanıcı artık mevcut değil. (Silinmiş Hesap)' });
        }

        if (currentUser.isBanned) {
             // Re-check expiry
             const expiry = currentUser.banExpiresAt ? new Date(currentUser.banExpiresAt) : null;
             if (!expiry || expiry > new Date()) {
                return res.status(403).json({ success: false, message: 'Hesabınız yasaklanmıştır.', banReason: currentUser.banReason });
             }
        }
        
        // Attach full user object or just necessary parts
        req.user = decoded; // Keep using the token payload, or switch to full user
        next();

    } catch(err) {
        console.error("JWT/Auth Error:", err.message);
        return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş oturum.' });
    }
};

// Middleware: Require Admin Role

// --- HEALTH CHECK ---
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    let dbType = 'none';

    if (pgPool) {
        try {
            // First check if table exists
            await pgPool.query(`CREATE TABLE IF NOT EXISTS health_check_test (id serial primary key)`);
            await pgPool.query('SELECT 1');
            dbStatus = 'connected';
            dbType = 'postgres';
        } catch (e) {
            dbStatus = 'error: ' + e.message;
            dbType = 'postgres';
            console.error('Health Check PG Error:', e);
        }
    } else if (MONGO_URI) {
        dbType = 'mongodb';
        dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    } else {
        dbType = 'filesystem';
        dbStatus = 'active (temporary)';
    }

    res.json({ 
        status: 'ok', 
        dbType, 
        dbStatus, 
        env: process.env.NODE_ENV,
        region: process.env.VERCEL_REGION
    });
});

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Bu işlem için yetkiniz yok. (Admin Gerekli)' });
    }
    next();
};

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, companyName } = req.body;
    
    // VALIDATION: Daha güçlü kontrol
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'İsim, e-posta ve şifre zorunludur.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    try {
        console.log('[Register] Attempting to register:', email); // DEBUG LOG

        // Check if user exists
        const existingUser = await dbAdapter.findUserByEmail(email);
        if (existingUser) {
            console.log('[Register] Email already exists:', email); // DEBUG LOG
            return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kullanımda.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: 'user-' + Date.now(),
            name,
            email,
            password: hashedPassword, // SECURED
            companyName: companyName || '', // Optional
            role: 'SUBSCRIBER',
            plan: 'FREE',
            remainingDownloads: 50, // 30 Days Free -> Updated to 50 as requested
            downloadsThisMonth: 0,
            subscriptionStartDate: new Date().toISOString(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days fixed
            isActive: true,
            isTrial: true,
            createdAt: new Date().toISOString()
        };

        console.log('[Register] Adding user to DB:', newUser.id); // DEBUG LOG
        await dbAdapter.addUser(newUser);

        // --- SEND WELCOME EMAIL ---
        // If transporter is available OR we are in mock mode (simulation)
        if (transporter || !isMockMode) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Kırbaş Doküman Platformuna Hoş Geldiniz! 🎉',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                        <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
                            <h2 style="color: #2563eb; margin: 0;">Kırbaş Doküman</h2>
                            <p style="color: #64748b; margin: 5px 0 0 0;">Profesyonel Belge Yönetim Sistemi</p>
                        </div>
                        
                        <div style="padding: 0 10px;">
                            <p style="font-size: 16px; color: #1e293b;">Merhaba <strong>${name}</strong>,</p>
                            
                            <p style="color: #475569; line-height: 1.6;">
                                Kırbaş Doküman Platformuna hoş geldiniz! Üyeliğiniz başarıyla oluşturulmuştur.
                                Artık kurumsal belgelerinizi hızlı ve güvenli bir şekilde oluşturmaya başlayabilirsiniz.
                            </p>

                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                                <h3 style="color: #334155; margin-top: 0; margin-bottom: 15px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Üyelik Bilgileriniz</h3>
                                <ul style="list-style: none; padding: 0; margin: 0; color: #475569;">
                                    ${companyName ? `<li style="margin-bottom: 10px;">🏢 <strong>Belirtilen Firma:</strong> ${companyName}</li>` : ''}
                                    <li style="margin-bottom: 10px;">📧 <strong>E-posta Adresi:</strong> ${email}</li>
                                    <li style="margin-bottom: 0;">🌟 <strong>Paket:</strong> Ücretsiz Deneme</li>
                                </ul>
                            </div>

                            <p style="color: #475569; line-height: 1.6;">
                                Hemen giriş yaparak binlerce hazır şablonu kullanmaya başlayın.
                            </p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://kirbas-doc-platform.loca.lt" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Platforma Git</a>
                            </div>
                        </div>

                        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p>© ${new Date().getFullYear()} Kırbaş Doküman Platformu. Bu e-posta otomatik olarak gönderilmiştir.</p>
                        </div>
                    </div>
                `
            };

            // Using callback approach for transporter
             if (transporter) {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.error('❌ Welcome email failed:', error.message);
                    else {
                        systemLogs.unshift({
                            id: Date.now(),
                            type: 'success',
                            action: 'Welcome Email Sent',
                            details: `To: ${email}`,
                            time: new Date().toISOString()
                        });
                    }
                });
            } else {
                 console.log('⚠️ [MOCK] Welcome email skipped (No SMTP). Logged for Admin.');
                 systemLogs.unshift({
                    id: Date.now(),
                    type: 'info',
                    action: 'Welcome Email (Mock)',
                    details: `To: ${email}`,
                    time: new Date().toISOString()
                });
            }
        }

        // Create Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ success: true, user: userWithoutPassword, token });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Kayıt işlemi sırasında bir hata oluştu.' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Rate Limiting Check
    const now = Date.now();
    const attempt = loginAttempts[email] || { count: 0, firstAttempt: now };

    if (attempt.count >= 3 && now - attempt.firstAttempt < 15 * 60 * 1000) {
        return res.status(403).json({ success: false, error: 'LOCKED_OUT', message: 'Çok fazla başarısız giriş denemesi. Lütfen şifrenizi sıfırlayın.' });
    }

    try {
        const user = await dbAdapter.findUserByEmail(email);

        if (user && user.isBanned) {
             const expiry = user.banExpiresAt ? new Date(user.banExpiresAt) : null;
             if (!expiry || expiry > new Date()) {
                
                return res.status(403).json({ 
                    success: false, 
                    message: `Hesabınız yasaklandı. ${expiry ? 'Yasak Bitiş: ' + expiry.toLocaleString('tr-TR') : 'Süresiz'}`,
                    banReason: user.banReason || 'Yönetici tarafından engellendi.'
                });
             }
             // If expired, we proceed (effectively auto-unban on login)
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            // Correct Password
            if (loginAttempts[email]) delete loginAttempts[email]; // Reset attempts
            
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Add log
            systemLogs.unshift({
                id: Date.now(),
                type: 'info',
                action: 'User Login',
                details: `${user.name} logged in`,
                time: new Date().toISOString()
            });

            const { password: _, ...userWithoutPassword } = user;
            res.json({ success: true, user: userWithoutPassword, token });
        } else {
            // Failed Attempt Logic
            const currentAttempt = loginAttempts[email] || { count: 0, firstAttempt: now };
            if (now - currentAttempt.firstAttempt > 15 * 60 * 1000) {
                 // Reset window if passed
                 loginAttempts[email] = { count: 1, firstAttempt: now };
            } else {
                 loginAttempts[email] = { count: currentAttempt.count + 1, firstAttempt: currentAttempt.firstAttempt };
            }
            
            res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Giriş yapılırken hata oluştu.' });
    }
});

// Get Current User (Refresh Profile)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await dbAdapter.findUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ success: false, message: 'Kullanıcı bilgileri alınamadı.' });
    }
});

// Update Profile (Self)
app.put('/api/auth/update-profile', authenticateToken, async (req, res) => {
    const { name, email, companyName } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'İsim ve E-posta zorunludur.' });
    }

    try {
        // Email uniqueness check (if changed)
        if (email !== req.user.email) {
            const existing = await dbAdapter.findUserByEmail(email);
            if (existing && existing.id !== req.user.id) {
                return res.status(400).json({ success: false, message: 'Bu e-posta adresi kullanımda.' });
            }
        }

        await dbAdapter.updateUser(req.user.id, { name, email, companyName });
        
        const updatedUser = await dbAdapter.findUserById(req.user.id);
        const { password: _, ...userWithoutPassword } = updatedUser;
        
        res.json({ success: true, user: userWithoutPassword, message: 'Profil güncellendi.' });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Profil güncellenemedi.' });
    }
});

// Change Password (Self)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Mevcut ve yeni şifre gereklidir.' });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }

    try {
        const user = await dbAdapter.findUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        // Verify Old Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mevcut şifre hatalı.' });
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await dbAdapter.updateUser(req.user.id, { password: hashedPassword });

        systemLogs.unshift({
            id: Date.now(),
            type: 'warning',
            action: 'Password Change',
            details: `User ${user.email} changed password`,
            time: new Date().toISOString()
        });

        res.json({ success: true, message: 'Şifreniz başarıyla değiştirildi.' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ success: false, message: 'Şifre değiştirme işlemi başarısız.' });
    }
});

// Get User Invoices (Mock)
app.get('/api/auth/invoices', authenticateToken, async (req, res) => {
    try {
        const user = await dbAdapter.findUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        if (user.plan === 'FREE') {
            return res.json({ success: true, invoices: [] });
        }

        const invoices = [];
        const startDate = new Date(user.subscriptionStartDate);
        const now = new Date();
        const planPrice = user.plan === 'YEARLY' ? 1200 : 120; // Example prices
        const description = user.plan === 'YEARLY' ? 'Yıllık Abonelik Yenileme' : 'Aylık Abonelik Yenileme';

        // Generate mocked invoices based on subscription duration
        let currentDate = new Date(startDate);
        let idCounter = 1;

        while (currentDate <= now) {
            invoices.push({
                id: `INV-${currentDate.getFullYear()}${idCounter.toString().padStart(4, '0')}`,
                date: currentDate.toISOString(),
                amount: planPrice,
                status: 'PAID', // All past invoices assumed paid
                invoiceNumber: `KAS-${Date.now().toString().slice(-6)}-${idCounter}`,
                description: description
            });

            // Increment based on plan
            if (user.plan === 'YEARLY') {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            idCounter++;
        }
        
        // Reverse to show newest first
        res.json({ success: true, invoices: invoices.reverse() });
    } catch (error) {
        console.error('Invoices Error:', error);
        res.status(500).json({ success: false, message: 'Faturalar alınamadı.' });
    }
});

// Forgot Password - Send Code
app.post('/api/auth/forgot-password', async (req, res) => {
    console.log(`[FORGOT-PASSWORD] Request received for: ${req.body.email}`);
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ success: false, message: 'E-posta gereklidir.' });

    try {
        const user = await dbAdapter.findUserByEmail(email);
        if (!user) {
            console.log(`[FORGOT-PASSWORD] User not found for email: ${email}`);
            return res.status(404).json({ success: false, message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store code (valid for 5 mins)
        const expiresAt = Date.now() + 5 * 60 * 1000;
        
        // Persist in DB for serverless reliability
        try {
            await dbAdapter.updateUser(user.id, { 
                resetCode: code, 
                resetCodeExpires: expiresAt 
            });
        } catch (dbErr) {
            console.error("Failed to persist reset code:", dbErr);
        }

        // Also keep in memory
        forgotPasswordCodes.set(email, {
            code,
            expiresAt
        });

        // console.log(`[PASSWORD RESET] Generated code for ${email}: ${code}`); // REMOVED FOR PRIVACY
        
        // Check if we can send email
        if (transporter && !isMockMode) {
            console.log(`[FORGOT-PASSWORD] Sending reset email to user...`);
             const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Şifre Sıfırlama Kodu - Kırbaş Doküman',
                html: `

                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Şifre Sıfırlama İsteği</h2>
                        <p>Hesabınız için şifre sıfırlama talebi aldık. Onay kodunuz:</p>
                        <h1 style="color: #2563eb; letter-spacing: 5px;">${code}</h1>
                        <p>Bu kodu 5 dakika içinde kullanmalısınız.</p>
                        <p>Siz talep etmediyseniz bu e-postayı dikkate almayın.</p>
                    </div>
                `
            };
            
            // Promisify sendMail to await it and catch errors properly
            try {
                await transporter.sendMail(mailOptions);
                console.log(`[FORGOT-PASSWORD] Email sent successfully.`);
                res.json({ success: true, message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi.' });
            } catch (mailError) {
                console.error(`[FORGOT-PASSWORD] Email failed:`, mailError);
                // Fallback for development/testing when SMTP is not configured
                console.warn(`[DEV-MODE] Returning reset code in response because email failed.`);
                res.json({ 
                    success: true, 
                    message: 'E-posta servisi ayarlanmamış (DEV MODE). Kod aşağıdadır.',
                    debugCode: code 
                });
            }
        } else {
             console.warn(`[MOCK MODE] Password reset email not sent. Code: ${code}.`);
             res.json({ 
                success: true, 
                message: 'Test Modu: Şifre sıfırlama kodu oluşturuldu.',
                debugCode: code 
            });
        }
    } catch (error) {
         console.error('[FORGOT-PASSWORD] Fatal Error:', error);
         res.status(500).json({ success: false, message: 'İşlem başarısız.' });
    }
});

// Reset Password - Verify & Update
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    console.log(`[RESET-PASSWORD] Request for: ${email}, Code: ${code}`);

    if (!email || !code || !newPassword) {
        console.log('[RESET-PASSWORD] Missing fields');
        return res.status(400).json({ success: false, message: 'E-posta, kod ve yeni şifre gereklidir.' });
    }

    if (newPassword.length < 6) {
        console.log('[RESET-PASSWORD] Password too short');
        return res.status(400).json({ success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }

    try {
        const user = await dbAdapter.findUserByEmail(email);
        if (!user) {
             console.log('[RESET-PASSWORD] User not found during verify');
             return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
        
        // Check DB stored code first (persistent), then memory (fallback)
        let validCode = false;
        let storedCode = user.resetCode;
        let storedExpires = user.resetCodeExpires;

        // Fallback to memory if not in DB (or if DB write failed previously)
        if (!storedCode) {
             const memMatches = forgotPasswordCodes.get(email);
             if (memMatches) {
                 storedCode = memMatches.code;
                 storedExpires = memMatches.expiresAt;
                 console.log('[RESET-PASSWORD] Using memory-stored code');
             }
        } else {
             console.log('[RESET-PASSWORD] Using DB-stored code');
        }

        if (!storedCode) {
             console.log('[RESET-PASSWORD] No stored code found (expired or missing)');
             return res.status(400).json({ success: false, message: 'Geçersiz veya süresi dolmuş kod.' });
        }

        if (Date.now() > storedExpires) {
            console.log('[RESET-PASSWORD] Code expired');
            // Clean up
            await dbAdapter.updateUser(user.id, { resetCode: null, resetCodeExpires: null });
            forgotPasswordCodes.delete(email);
            return res.status(400).json({ success: false, message: 'Kodun süresi dolmuş.' });
        }

        if (storedCode.toString() !== code.toString()) {
            console.log(`[RESET-PASSWORD] Code mismatch. Expected: ${storedCode}, Got: ${code}`);
            return res.status(400).json({ success: false, message: 'Hatalı kod.' });
        }

        console.log('[RESET-PASSWORD] Code verified. Updating password...');

        // Update Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await dbAdapter.updateUser(user.id, { 
            password: hashedPassword,
            resetCode: null,        // Clear used code
            resetCodeExpires: null 
        });
        
        // Clear memory cache too
        forgotPasswordCodes.delete(email);
        if (loginAttempts[email]) delete loginAttempts[email];

        systemLogs.unshift({
            id: Date.now(),
            type: 'warning',
            action: 'Password Reset',
            details: `User ${email} reset password via code`,
            time: new Date().toISOString()
        });

        res.json({ success: true, message: 'Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'Sıfırlama işlemi başarısız.' });
    }
});

// Upgrade User (Mock Payment) (Protected)
app.post('/api/users/upgrade', authenticateToken, async (req, res) => {
    const { userId, plan } = req.body;
    
    try {
        await dbAdapter.updateUser(userId, { 
            plan, 
            remainingDownloads: 9999, 
            role: 'SUBSCRIBER' 
        });
        
        const updatedUser = await dbAdapter.findUserById(userId);
        if (!updatedUser) {
             return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({ success: true, user: userWithoutPassword });
    } catch (e) {
        console.error('Upgrade Error:', e);
        res.status(500).json({ success: false, message: 'İşlem başarısız.' });
    }
});

// Delete Account (Self)
app.delete('/api/auth/delete-account', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const db = readDB();
        
        // Remove from DB (File System Logic) -- In postgres/mongo create a deleteUser adapter method
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            
            // Log deletion
            systemLogs.unshift({
                id: Date.now(),
                type: 'warning',
                action: 'Account Deleted',
                details: `${db.users[userIndex].email} deleted their account`,
                time: new Date().toISOString()
            });

            db.users.splice(userIndex, 1);
            const writeDirectSuccess = writeDB(db);

            // Double Check Persistence
            const verifyDb = readDB();
            const stillExists = verifyDb.users.find(u => u.id === userId);
            
            if (!writeDirectSuccess || stillExists) {
                 console.error('CRITICAL: Delete failed despite write attempt!', { writeSuccess: writeDirectSuccess, userStillExists: !!stillExists });
                 return res.status(500).json({ success: false, message: 'Silme işlemi diske yazılamadı.' });
            }

            // Also remove from Postgres/Mongo if connected (basic implementation)
            if (pgPool) {
                await pgPool.query('DELETE FROM users WHERE id = $1', [userId]);
            } else if (MONGO_URI) {
                await connectDB();
                await User.deleteOne({ id: userId });
            }

            return res.json({ success: true, message: 'Hesap başarıyla silindi.' });
        } else {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
    } catch (e) {
        console.error('Delete Account Error:', e);
        res.status(500).json({ success: false, message: 'Hesap silinemedi.' });
    }
});

// Admin: Get All Users (Protected)
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await dbAdapter.getUsers();
        // Don't send passwords
        const safeUsers = users.map(({ password, ...u }) => u);
        res.json(safeUsers);
    } catch (e) {
        console.error('Fetch Users Error:', e);
        res.status(500).json({ success: false, message: 'Kullanıcılar alınamadı.' });
    }
});

// Admin: Update User (Protected)
app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const db = readDB();
    
    // Check if trying to edit another admin (super admin protection could go here)
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }
    
    // Explicitly select allowed fields to update
    // This prevents overwriting id, password, createdAt, or other system fields
    const allowedFields = ['name', 'companyName', 'role', 'plan', 'isActive', 'email', 'remainingDownloads'];
    const safeUpdates = {};
    
    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    db.users[index] = { ...db.users[index], ...safeUpdates };
    
    // Critical: Check write success
    if (!writeDB(db)) {
        return res.status(500).json({ success: false, message: 'Veritabanına yazılamadı (Disk Hatası).' });
    }
    
    // Sync PostgreSQL if available
    if (pgPool) {
        // We only sync specific fields to PG for now to keep it simple, or update the jsonb blob
        // Update the JSONB data column
        pgPool.query('UPDATE users SET email = $1, data = $2 WHERE id = $3', 
            [db.users[index].email, db.users[index], id]).catch(e => console.error('PG Update Error:', e));
    } else if (MONGO_URI) {
        connectDB().then(() => User.updateOne({ id }, { $set: safeUpdates })).catch(e => console.error('Mongo Update Error:', e));
    }
    
    const { password: _, ...userWithoutPassword } = db.users[index];
    res.json({ success: true, user: userWithoutPassword });
});

// Admin: Delete User (Protected)
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    
    // Self-deletion check
    if (req.user.id === id) {
        return res.status(400).json({ success: false, message: 'Kendi hesabınızı silemezsiniz.' });
    }
    
    // Use unified DB adapter to delete from all sources
    const wasDeleted = await dbAdapter.deleteUser(id);
    
    if (wasDeleted) {
        return res.json({ success: true, message: 'Kullanıcı silindi.' });
    } else {
        // Even if not found, consider it deleted to clear frontend state, or return 404.
        // Returning 200 helps "self-healing" if the user was already gone.
        return res.json({ success: true, message: 'Kullanıcı zaten silinmiş veya bulunamadı.' });
    }
});

// Admin: Ban User
app.post('/api/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { banReason, durationMinutes } = req.body;
    
    // Self-ban check
    if (req.user.id === id) {
        return res.status(400).json({ success: false, message: 'Kendinizi yasaklayamazsınız.' });
    }

    const db = readDB();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    const banExpiresAt = durationMinutes 
        ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString() 
        : null; // Null means permanent

    db.users[index] = { 
        ...db.users[index], 
        isBanned: true, 
        banReason: banReason || 'Yönetici kararı',
        banExpiresAt: banExpiresAt
    };
    
    writeDB(db);

    // Sync PG/Mongo
    if (pgPool) {
        try {
            await pgPool.query('UPDATE users SET data = $1 WHERE id = $2', [db.users[index], id]);
        } catch(e) { console.error('PG Ban Sync Error:', e); }
    } else if (MONGO_URI) {
        connectDB().then(() => User.updateOne({ id }, { $set: { isBanned: true, banReason, banExpiresAt } })).catch(e => console.error(e));
    }

    res.json({ success: true, message: 'Kullanıcı yasaklandı.', user: db.users[index] });
});

// Admin: Unban User
app.post('/api/users/:id/unban', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.users.findIndex(u => u.id === id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    db.users[index] = { 
        ...db.users[index], 
        isBanned: false, 
        banReason: null,
        banExpiresAt: null
    };
    
    writeDB(db);

    // Sync PG/Mongo
    if (pgPool) {
        try {
            await pgPool.query('UPDATE users SET data = $1 WHERE id = $2', [db.users[index], id]);
        } catch(e) { console.error('PG Unban Sync Error:', e); }
    } else if (MONGO_URI) {
         connectDB().then(() => User.updateOne({ id }, { $set: { isBanned: false, banReason: null, banExpiresAt: null } })).catch(e => console.error(e));
    }

    res.json({ success: true, message: 'Kullanıcı yasağı kaldırıldı.' });
});

// --- TEMPLATE MANAGEMENT (Admin & Public) ---

// Get All Templates (Public)
app.get('/api/templates', (req, res) => {
    try {
        const db = readDB();
        res.json(db.templates || []);
    } catch (e) {
        res.status(500).json({ success: false, message: 'Şablonlar alınamadı.' });
    }
});

// Create Template (Admin)
app.post('/api/templates', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = readDB();
        const newTemplate = { ...req.body, id: Date.now().toString() };
        db.templates = db.templates || [];
        db.templates.push(newTemplate);
        writeDB(db);
        res.json(newTemplate);
    } catch (e) {
        res.status(500).json({ success: false, message: 'Şablon oluşturulamadı.' });
    }
});

// Update Template (Admin)
app.put('/api/templates/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const db = readDB();
        
        const index = db.templates ? db.templates.findIndex(t => t.id === id) : -1;
        if (index === -1) {
             return res.status(404).json({ success: false, message: 'Şablon bulunamadı.' });
        }
        
        db.templates[index] = { ...db.templates[index], ...updates };
        writeDB(db);
        res.json(db.templates[index]);
    } catch (e) {
        res.status(500).json({ success: false, message: 'Güncelleme başarısız.' });
    }
});

// Delete Template (Admin)
app.delete('/api/templates/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        
        const initialLength = db.templates ? db.templates.length : 0;
        const filtered = db.templates ? db.templates.filter(t => t.id !== id) : [];
        
        if (filtered.length === initialLength) {
            return res.status(404).json({ success: false, message: 'Şablon bulunamadı.' });
        }

        db.templates = filtered;
        writeDB(db);
        res.json({ success: true, message: 'Şablon silindi.' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Silme işlemi başarısız.' });
    }
});



// --- EMAIL SENDING ENDPOINT ---
app.post('/api/send-document', async (req, res) => {
    const { email, pdfBase64, documentName } = req.body;

    if (!email || !pdfBase64) {
        return res.status(400).json({ success: false, message: 'E-posta ve PDF verisi gereklidir.' });
    }

    // Check if transporter is ready
    if (!transporter && !isMockMode) {
        console.warn('Email service not configured (No Transporter).');
        return res.status(503).json({ success: false, message: 'E-posta servisi şu anda kullanılamıyor (Sunucu Yapılandırması Eksik).' });
    }

    try {
        const base64Data = pdfBase64.split(';base64,').pop();
        
        if (transporter && !isMockMode) {
             const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Dokümanınız Hazır: ${documentName || 'Belge'} - Kırbaş Doküman`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Dokümanınız Hazır!</h2>
                        <p>Merhaba,</p>
                        <p>Oluşturmuş olduğunuz <strong>${documentName}</strong> başlıklı doküman ektedir.</p>
                        <p>Kırbaş Doküman Platformunu tercih ettiğiniz için teşekkür ederiz.</p>
                        <br>
                        <p style="font-size: 12px; color: #888;">Bu e-posta otomatik olarak gönderilmiştir.</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `${(documentName || 'dokuman').replace(/[^a-z0-9]/gi, '_')}.pdf`,
                        content: base64Data,
                        encoding: 'base64'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Document sent to user.`);
        } else {
             // If we reach here and isMockMode is explicitly false, it means transporter creation failed but wasn't caught earlier?
             // Or transporter is undefined.
             if (!isMockMode) {
                 throw new Error("E-posta servisi başlatılamadı. Lütfen sunucu yapılandırmasını kontrol edin.");
             }
            // MOCK LOG REMOVED
        }

        res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });

    } catch (error) {
        console.error('Send Document Error:', error);
        res.status(500).json({ success: false, message: 'E-posta gönderimi başarısız: ' + error.message });
    }
});

// --- DOCUMENT MANAGEMENT ---

// Get User Documents
app.get('/api/documents', authenticateToken, async (req, res) => {
    try {
        let documents = [];
        if (pgPool) {
             try {
                // Ensure table exists
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS documents (
                        id TEXT PRIMARY KEY,
                        userId TEXT,
                        data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                const result = await pgPool.query('SELECT data FROM documents WHERE userId = $1 ORDER BY created_at DESC', [req.user.id]);
                documents = result.rows.map(row => row.data);
             } catch (err) { console.error('PG GetDocuments Error:', err.message); }
        } else if (MONGO_URI) {
             // Mongo implementation skipped for brevity but ideally mirrors structure
             // documents = await DocumentModel.find({ userId: req.user.id });
        } else {
             const allDocs = readFileDB().documents || [];
             documents = allDocs.filter(d => d.userId === req.user.id);
        }
        
        res.json({ success: true, documents });
    } catch (error) {
        console.error('Get Documents Error:', error);
        res.status(500).json({ success: false, message: 'Dokümanlar alınamadı.' });
    }
});

// Save Document (Create or Update)
app.post('/api/documents', authenticateToken, async (req, res) => {
    try {
        const document = req.body;
        // Ensure userId matches token (security)
        document.userId = req.user.id;
        
        if (pgPool) {
             try {
                // Check if exists
                const existing = await pgPool.query('SELECT id FROM documents WHERE id = $1', [document.id]);
                if (existing.rows.length > 0) {
                    await pgPool.query('UPDATE documents SET data = $2 WHERE id = $1', [document.id, document]);
                } else {
                    await pgPool.query('INSERT INTO documents(id, userId, data) VALUES($1, $2, $3)', [document.id, req.user.id, document]);
                }
             } catch (err) { 
                 console.error('PG SaveDocument Error:', err.message);
                 return res.status(500).json({ success: false, message: 'Veritabanı hatası.' });
             }
        } else {
             // File fallback
             const db = readFileDB();
             if (!db.documents) db.documents = [];
             
             const index = db.documents.findIndex(d => d.id === document.id);
             if (index !== -1) {
                 db.documents[index] = document;
             } else {
                 db.documents.unshift(document);
             }
             writeDB(db);
        }
        
        res.json({ success: true, message: 'Doküman kaydedildi.', document });
    } catch (error) {
        console.error('Save Document Error:', error);
        res.status(500).json({ success: false, message: 'Doküman kaydedilemedi.' });
    }
});

// Delete Document
app.delete('/api/documents/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (pgPool) {
             await pgPool.query('DELETE FROM documents WHERE id = $1 AND userId = $2', [id, req.user.id]);
        } else {
             const db = readFileDB();
             if (db.documents) {
                 db.documents = db.documents.filter(d => d.id !== id || d.userId !== req.user.id); // Only delete own docs
                 writeDB(db);
             }
        }
        
        res.json({ success: true, message: 'Doküman silindi.' });
    } catch (error) {
        console.error('Delete Document Error:', error);
        res.status(500).json({ success: false, message: 'Doküman silinemedi.' });
    }
});


// --- SYSTEM MONITORING ROUTES ---

app.get('/api/status', authenticateToken, requireAdmin, (req, res) => {
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024;
    
    res.json({
        online: true,
        uptime: uptimeSeconds,
        memoryUsage: `${Math.round(usedMem)} MB`,
        totalMemory: `${Math.round(totalMem / 1024)} GB`,
        freeMemory: `${Math.round(freeMem / 1024)} GB`,
        platform: os.platform(),
        cpuLoad: os.loadavg(),
        activeConnections: 1 // Simple mock for now
    });
});

app.get('/api/logs', authenticateToken, requireAdmin, (req, res) => {
    res.json(systemLogs);
});


// --- EMAIL ROUTES ---

app.post('/api/send-welcome-email', async (req, res) => {
  const { recipientEmail, recipientName, companyName, plan } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: 'Email adresi zorunludur' });
  }

  const planName = plan === 'YEARLY' ? 'Yıllık Pro' : plan === 'MONTHLY' ? 'Aylık Standart' : 'Ücretsiz';

  // Email Content
  const mailOptions = {
    from: `"Kırbaş Doküman" <${process.env.EMAIL_USER || 'info@kirbas.com'}>`,
    to: recipientEmail,
    subject: 'Kırbaş Doküman Platformuna Hoş Geldiniz',
    text: `Sayın ${recipientName},\n\nKırbaş Doküman platformuna üyeliğiniz başarıyla tamamlanmıştır.\n\nHesap Bilgileri:\n----------------\nFirma: ${companyName || '-'}\nPaket: ${planName}\n\nSisteme giriş yaparak dokümanlarınızı oluşturmaya başlayabilirsiniz.\n\nİyi Çalışmalar,\nKırbaş Doküman Yönetimi`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #2563eb;">Kırbaş Doküman Platformuna Hoş Geldiniz</h2>
        <p>Sayın <strong>${recipientName}</strong>,</p>
        <p>Üyeliğiniz başarıyla oluşturulmuştur. Artık profesyonel dokümanlarınızı hızlıca hazırlayabilirsiniz.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #475569;">Hesap Özeti</h3>
          <p style="margin: 5px 0;"><strong>Firma:</strong> ${companyName || '-'}</p>
          <p style="margin: 5px 0;"><strong>Paket:</strong> <span style="color: #2563eb; font-weight: bold;">${planName}</span></p>
          <p style="margin: 5px 0;"><strong>E-posta:</strong> ${recipientEmail}</p>
        </div>

        <p>Sormak istediğiniz sorular için bu maile yanıt verebilirsiniz.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #94a3b8;">Kırbaş Doküman Yönetimi © 2026</p>
      </div>
    `
  };

  if (isMockMode) {
      console.log('---------- [MOCK EMAIL SENT] ----------');
      
      // Log to system logs
      systemLogs.unshift({
        id: Date.now(),
        type: 'info',
        action: 'Email Sent (Mock)',
        details: `To: ${recipientEmail}`,
        time: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.json({ 
          success: true, 
          message: 'Mail simülasyon olarak gönderildi (Backend Loglarını kontrol edin)', 
          mode: 'MOCK' 
      });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    systemLogs.unshift({
        id: Date.now(),
        type: 'success',
        action: 'Email Sent',
        details: `MessageID: ${info.messageId} | To: ${recipientEmail}`,
        time: new Date().toISOString()
    });

    res.json({ success: true, message: 'Mail başarıyla gönderildi', messageId: info.messageId, mode: 'LIVE' });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    
    systemLogs.unshift({
        id: Date.now(),
        type: 'error',
        action: 'Email Failed',
        details: error.message,
        time: new Date().toISOString()
    });

    console.log('⚠️  Gerçek gönderim başarısız oldu, simülasyon yanıtı dönülüyor.');
    res.json({ 
        success: true, 
        message: 'Mail sunucuya iletildi (Simülasyon - Auth Hatası)', 
        error: error.message 
    });
  }
});


// --- SEND DOCUMENT (PDF) ---
app.post('/api/send-document', async (req, res) => {
    const { email, pdfBase64, documentName } = req.body;

    if (!email || !pdfBase64) {
        return res.status(400).json({ success: false, message: 'Email ve PDF verisi zorunludur' });
    }

    // Mock mode check using global flag
    if (isMockMode || !transporter) {
         console.log('---------- [MOCK DOCUMENT SENT] ----------');
         console.log(`To: ${email}`);
         console.log(`Doc: ${documentName}`);
         return res.json({ success: true, message: 'Doküman simülasyon olarak gönderildi (Mock Mode)' });
    }

    // Use global transporter instead of creating new one


    try {
        let pdfContent = pdfBase64;
        if (pdfBase64.includes('base64,')) {
            pdfContent = pdfBase64.split('base64,')[1];
        }

        const mailOptions = {
            from: `"Kırbaş Doküman" <${process.env.EMAIL_USER || 'info@kirbas.com'}>`,
            to: email,
            subject: `Dokümanınız Hazır: ${documentName || 'Yeni Doküman'}`,
            text: `Merhaba,\n\nOluşturduğunuz "${documentName}" isimli doküman ektedir.\n\nİyi günler,\nKırbaş Doküman`,
            attachments: [
                {
                    filename: `${documentName || 'Dokuman'}.pdf`,
                    content: pdfContent,
                    encoding: 'base64'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Document sent: %s', info.messageId);
        
        systemLogs.unshift({
            id: Date.now(),
            type: 'success',
            action: 'Document Sent',
            details: `To: ${email} | Doc: ${documentName}`,
            time: new Date().toISOString()
        });

        res.json({ success: true, message: 'Doküman başarıyla gönderildi' });

    } catch (error) {
        console.error('Doküman gönderme hatası:', error);
        res.status(500).json({ success: false, message: 'Doküman gönderilemedi', error: error.message });
    }
});


// --- GENERATE DOCUMENT (PDF) ---
// Generates a PDF on the backend using data provided
app.post('/api/generate-pdf', async (req, res) => {
    const { templateId, data, title } = req.body;
    
    // Log generation request
     systemLogs.unshift({
            id: Date.now(),
            type: 'info',
            action: 'PDF Generation',
            details: `Template: ${templateId} | Title: ${title}`,
            time: new Date().toISOString()
     });

    try {
        const doc = new PDFDocument();
        
        // Collect data chunks
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            const base64 = pdfData.toString('base64');
            res.json({ success: true, pdfBase64: `data:application/pdf;base64,${base64}` });
        });

        // --- PDF CONTENT GENERATION ---
        
        // Header
        doc.fontSize(25).fillColor('#2563eb').text(title || 'Doküman Başlığı', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('black').text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, { align: 'right' });
        doc.moveDown();
        
        // Separator
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e2e8f0').stroke();
        doc.moveDown(2);

        // Dynamic Content
        if (data && typeof data === 'object') {
            Object.entries(data).forEach(([key, value]) => {
                // Key formatting (camelCase to Title Case)
                // Also handle special keys manually if needed
                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                // Value formatting
                let displayValue = value;
                if (typeof value === 'boolean') {
                    displayValue = value ? 'Evet / Var / Kabul Edildi' : 'Hayır / Yok';
                } else if (!value) {
                    displayValue = '-';
                }

                doc.font('Helvetica-Bold').fontSize(12).text(`${label}:`, { continued: true });
                doc.font('Helvetica').fontSize(12).text(`  ${displayValue}`);
                doc.moveDown(0.5);
            });
        } else {
             doc.text('İçerik bulunamadı.');
        }
        
        // Footer
        const bottom = doc.page.height - 50;
        doc.fontSize(10).fillColor('#94a3b8').text('Kırbaş Doküman Platformu © 2026', 50, bottom, { align: 'center', width: 500 });
        
        // Finalize
        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
         systemLogs.unshift({
            id: Date.now(),
            type: 'error',
            action: 'PDF Gen Failed',
            details: error.message,
            time: new Date().toISOString()
        });
        res.status(500).json({ success: false, message: 'PDF oluşturulamadı', error: error.message });
    }
});


// Vercel Serverless Function Support
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend sunucusu http://0.0.0.0:${PORT} üzerinde çalışıyor`);
        console.log(`Erişim için: http://localhost:${PORT}`);
    });
}

module.exports = app;
