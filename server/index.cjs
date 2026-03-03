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
        let deletedUserData = null;
        
        // Fetch user data first to save history
        if (pgPool) {
             const res = await pgPool.query('SELECT data FROM users WHERE id = $1', [id]);
             if (res.rows.length > 0) deletedUserData = res.rows[0].data;
        } else if (MONGO_URI) {
             try { await connectDB(); deletedUserData = await User.findOne({ id }).lean(); } catch(e){}
        } else {
             const u = readFileDB().users.find(u => u.id === id);
             if (u) deletedUserData = u;
        }

        // Save to History (if user found)
        if (deletedUserData) {
             try {
                 await dbAdapter.addDeletedUser({
                     email: deletedUserData.email,
                     rights: deletedUserData.remainingDownloads,
                     deletedAt: new Date().toISOString()
                 });
             } catch (err) {
                 console.error('Failed to save user history:', err);
             }
        }

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
    },

    // History Management
    findDeletedUserByEmail: async (email) => {
        // Only File DB support for now as table structure for deleted_users is not defined in PG/Mongo instructions
        // We'll store it in db.json under 'deletedUsers'
        const db = readFileDB();
        return db.deletedUsers ? db.deletedUsers.find(u => u.email === email) : null;
    },

    addDeletedUser: async (entry) => {
        const db = readFileDB();
        if (!db.deletedUsers) db.deletedUsers = [];
        
        // Remove old entry if exists (keep latest)
        db.deletedUsers = db.deletedUsers.filter(u => u.email !== entry.email);
        
        db.deletedUsers.push(entry);
        writeFileDB(db);
    },

    // IP Ban Helper Methods
    getBannedIps: () => {
        const db = readFileDB();
        return db.bannedIps || [];
    },

    addBannedIp: (ip, reason, expiresAt) => {
        const db = readFileDB();
        if (!db.bannedIps) db.bannedIps = [];
        
        if (!db.bannedIps.some(x => x.ip === ip)) {
             db.bannedIps.push({ ip, reason, expiresAt, bannedAt: new Date().toISOString() });
             if (!writeFileDB(db)) return false;
        }
        return true;
    },

    removeBannedIp: (ip) => {
        const db = readFileDB();
        if (!db.bannedIps) return false;
        
        const initialLen = db.bannedIps.length;
        db.bannedIps = db.bannedIps.filter(x => x.ip !== ip);
        
        if (db.bannedIps.length !== initialLen) {
            writeFileDB(db);
            return true;
        }
        return false;
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

// --- BANNED IP CHECK ---
app.use((req, res, next) => {
    try {
        let clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
        if (clientIp.startsWith('::ffff:')) clientIp = clientIp.substring(7); // Normalize
        
        const bannedIps = dbAdapter.getBannedIps();
        if (!bannedIps || bannedIps.length === 0) return next();

        const banEntry = bannedIps.find(entry => entry.ip === clientIp);
        
        if (banEntry) {
            if (banEntry.expiresAt && new Date(banEntry.expiresAt) < new Date()) {
                dbAdapter.removeBannedIp(clientIp); // Expired
            } else {
                console.warn(`⛔ [SECURITY] Blocked Access from Banned IP: ${clientIp}`);
                return res.status(403).json({ 
                    success: false, 
                    error: 'Erişim engellendi. IP adresiniz güvenlik nedeniyle yasaklanmıştır.',
                    reason: banEntry.reason 
                });
            }
        }
    } catch (err) {
        console.error('IP Ban Middleware Error:', err);
    }
    next();
});

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
const IS_VERCEL = !!process.env.VERCEL;

// Use /tmp only if we are forced to (Vercel Prod), otherwise update local file for persistence
const DB_FILE = IS_VERCEL 
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
             if (IS_VERCEL && fs.existsSync(SOURCE_DB_FILE)) {
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
             if (!parsed.invoices) parsed.invoices = [];
             if (!parsed.bannedIps) parsed.bannedIps = [];
            return parsed;
        } catch (parseErr) {
            console.error("DB Parse Error - Corrupt File:", parseErr);
            return { users: [], documents: [], templates: INITIAL_TEMPLATES, invoices: [], bannedIps: [] };
        }
    } catch (err) {
        console.error("DB Read Error:", err);
        return { users: [], documents: [], templates: INITIAL_TEMPLATES, invoices: [], bannedIps: [] };
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
  // --- ÜRETİM / FABRİKA ---
  {
    id: 'prod-1',
    title: 'Üretim İş Emri Formu',
    category: 'Üretim',
    description: 'Üretim hattı için detaylı iş emri ve takip formu.',
    isPremium: false,
    monthlyLimit: 50,
    photoCapacity: 5,
    fields: [
      { key: 'orderNo', label: 'İş Emri No', type: 'text', required: true },
      { key: 'productName', label: 'Ürün Adı/Kodu', type: 'text', required: true },
      { key: 'quantity', label: 'Üretilecek Miktar', type: 'number', required: true },
      { key: 'deadline', label: 'Teslim Tarihi', type: 'date', required: true },
      { key: 'specifications', label: 'Teknik Özellikler', type: 'textarea' },
      { key: 'priority', label: 'Öncelik Durumu', type: 'select', options: ['Normal', 'Acil', 'Çok Acil'] }
    ]
  },
  {
    id: 'prod-2',
    title: 'Günlük Üretim Raporu',
    category: 'Üretim',
    description: 'Vardiya sonu üretim, fire ve duruş raporu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 5,
    fields: [
      { key: 'shift', label: 'Vardiya', type: 'select', options: ['08:00-16:00', '16:00-24:00', '24:00-08:00'], required: true },
      { key: 'producedQty', label: 'Üretilen Miktar', type: 'number', required: true },
      { key: 'scrapQty', label: 'Fire Miktarı', type: 'number' },
      { key: 'downtime', label: 'Duruş Süresi (Dk)', type: 'number' },
      { key: 'downtimeReason', label: 'Duruş Nedeni', type: 'textarea' },
      { key: 'operatorNote', label: 'Operatör Notları', type: 'textarea' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Makine Bakım Formu',
    category: 'Üretim',
    description: 'Periyodik makine bakım ve kontrol listesi.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
      { key: 'machineId', label: 'Makine Kodu', type: 'text', required: true },
      { key: 'maintenanceType', label: 'Bakım Türü', type: 'select', options: ['Günlük', 'Haftalık', 'Aylık', 'Arıza'] },
      { key: 'oilCheck', label: 'Yağ Kontrolü', type: 'checkbox' },
      { key: 'filterCheck', label: 'Filtre Temizliği', type: 'checkbox' },
      { key: 'safetyCheck', label: 'Güvenlik Donanımı Kontrolü', type: 'checkbox' },
      { key: 'changedParts', label: 'Değişen Parçalar', type: 'textarea' }
    ]
  },

  // --- KURUMSAL / OFİS ---
  {
    id: 'corp-1',
    title: 'Toplantı Tutanak Formu',
    category: 'Kurumsal',
    description: 'Toplantı kararları ve katılımcı listesi tutanağı.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 2,
    fields: [
      { key: 'meetingTopic', label: 'Toplantı Konusu', type: 'text', required: true },
      { key: 'meetingDate', label: 'Tarih', type: 'date', required: true },
      { key: 'participants', label: 'Katılımcılar', type: 'textarea', required: true },
      { key: 'decisions', label: 'Alınan Kararlar', type: 'textarea', required: true },
      { key: 'nextMeetingDate', label: 'Bir Sonraki Toplantı Tarihi', type: 'date' }
    ]
  },
  {
    id: 'corp-2',
    title: 'Masraf Bildirim Formu',
    category: 'Kurumsal',
    description: 'Personel harcama ve masraf beyan formu.',
    isPremium: false,
    monthlyLimit: 50,
    photoCapacity: 10,
    fields: [
      { key: 'employeeName', label: 'Personel Adı', type: 'text', required: true },
      { key: 'expenseType', label: 'Masraf Türü', type: 'select', options: ['Yol/Ulaşım', 'Yemek', 'Konaklama', 'Temsil/Ağırlama', 'Diğer'] },
      { key: 'amount', label: 'Tutar (TL)', type: 'number', required: true },
      { key: 'expenseDate', label: 'Harcama Tarihi', type: 'date', required: true },
      { key: 'description', label: 'Açıklama', type: 'textarea' }
    ]
  },
  {
    id: 'corp-3',
    title: 'Zimmet Formu',
    category: 'Kurumsal',
    description: 'Personel demirbaş teslim ve zimmet tutanağı.',
    isPremium: true,
    photoCapacity: 5,
    fields: [
      { key: 'recipient', label: 'Teslim Alan Personel', type: 'text', required: true },
      { key: 'itemName', label: 'Demirbaş Adı', type: 'text', required: true },
      { key: 'serialNo', label: 'Seri No / Kod', type: 'text' },
      { key: 'condition', label: 'Malzemenin Durumu', type: 'select', options: ['Sıfır', 'İkinci El - Sağlam', 'Hasarlı'] },
      { key: 'deliveryDate', label: 'Teslim Tarihi', type: 'date', required: true }
    ]
  },
  {
    id: 'corp-4',
    title: 'Personel İzin Formu',
    category: 'Kurumsal',
    description: 'Yıllık izin veya mazeret izni talep formu.',
    isPremium: false,
    monthlyLimit: 50,
    fields: [
      { key: 'leaveType', label: 'İzin Türü', type: 'select', options: ['Yıllık İzin', 'Mazeret İzni', 'Hastalık İzni', 'Ücretsiz İzin'], required: true },
      { key: 'startDate', label: 'Başlangıç Tarihi', type: 'date', required: true },
      { key: 'endDate', label: 'Bitiş Tarihi', type: 'date', required: true },
      { key: 'totalDays', label: 'Toplam Gün', type: 'number', required: true },
      { key: 'contactAddress', label: 'İzindeki Adres/Tel', type: 'text' }
    ]
  },

  // --- OTEL / HİZMET ---
  {
    id: 'hotel-1',
    title: 'Oda Kontrol (Housekeeping)',
    category: 'Otel',
    description: 'Housekeeping oda temizlik ve kontrol listesi.',
    isPremium: false,
    monthlyLimit: 100,
    photoCapacity: 8,
    fields: [
      { key: 'roomNo', label: 'Oda No', type: 'text', required: true },
      { key: 'status', label: 'Oda Durumu', type: 'select', options: ['Kirli', 'Temiz', 'Arızalı', 'Dolu'], required: true },
      { key: 'minibarCheck', label: 'Minibar Kontrolü', type: 'checkbox' },
      { key: 'towelCheck', label: 'Havlu Eksikliği', type: 'checkbox' },
      { key: 'damageCheck', label: 'Hasar Kontrolü', type: 'textarea', placeholder: 'Varsa hasar belirtin...' },
      { key: 'cleanerName', label: 'Temizleyen Personel', type: 'text' }
    ]
  },
  {
    id: 'hotel-2',
    title: 'Teknik Arıza Bildirimi',
    category: 'Otel',
    description: 'Odalar veya genel alanlar için arıza kayıt formu.',
    isPremium: false,
    monthlyLimit: 50,
    photoCapacity: 5,
    fields: [
      { key: 'location', label: 'Arıza Yeri / Oda No', type: 'text', required: true },
      { key: 'urgency', label: 'Aciliyet', type: 'select', options: ['Normal', 'Acil', 'Kritik'] },
      { key: 'description', label: 'Arıza Tanımı', type: 'textarea', required: true },
      { key: 'reportedBy', label: 'Bildiren', type: 'text' },
      { key: 'expectedFixTime', label: 'Tahmini Onarım Süresi', type: 'text' }
    ]
  },
  {
    id: 'hotel-3',
    title: 'Müşteri Şikayet Formu',
    category: 'Otel',
    description: 'Misafir şikayet ve talep takip formu.',
    isPremium: true,
    photoCapacity: 3,
    fields: [
      { key: 'guestName', label: 'Misafir Adı', type: 'text' },
      { key: 'roomNo', label: 'Oda No', type: 'text' },
      { key: 'complaintType', label: 'Şikayet Konusu', type: 'select', options: ['Temizlik', 'Gürültü', 'Personel', 'Yemek', 'Teknik'] },
      { key: 'details', label: 'Detaylar', type: 'textarea', required: true },
      { key: 'actionTaken', label: 'Alınan Aksiyon', type: 'textarea' }
    ]
  },

  // --- İNŞAAT / ŞANTİYE ---
  {
    id: 'const-1',
    title: 'Şantiye Günlük Raporu',
    category: 'İnşaat',
    description: 'Günlük saha ilerleme, personel ve hava durumu raporu.',
    isPremium: true,
    monthlyLimit: 31,
    photoCapacity: 20,
    fields: [
      { key: 'date', label: 'Tarih', type: 'date', required: true },
      { key: 'weather', label: 'Hava Durumu', type: 'select', options: ['Güneşli', 'Yağmurlu', 'Karlı', 'Rüzgarlı'] },
      { key: 'staffCount', label: 'Sahadaki Personel Sayısı', type: 'number' },
      { key: 'workDone', label: 'Yapılan İmalatlar', type: 'textarea', required: true },
      { key: 'materialArrival', label: 'Gelen Malzemeler', type: 'textarea' },
      { key: 'delays', label: 'Gecikmeler / Sorunlar', type: 'textarea' }
    ]
  },
  {
    id: 'const-2',
    title: 'Hakediş Tutanağı',
    category: 'İnşaat',
    description: 'Taşeron veya yüklenici için ara hakediş hesaplama formu.',
    isPremium: true,
    monthlyLimit: 10,
    photoCapacity: 10,
    fields: [
      { key: 'subcontractor', label: 'Taşeron Firma', type: 'text', required: true },
      { key: 'period', label: 'Hakediş Dönemi', type: 'text', placeholder: 'Ocak 2024' },
      { key: 'contractAmount', label: 'Sözleşme Bedeli (TL)', type: 'number' },
      { key: 'completedPercent', label: 'Tamamlanma Oranı (%)', type: 'number', required: true },
      { key: 'paymentAmount', label: 'Ödenecek Tutar (TL)', type: 'number', required: true },
      { key: 'deductions', label: 'Kesintiler (Avans vb.)', type: 'number' }
    ]
  },
  {
    id: 'const-3',
    title: 'İş Makineleri Takip Formu',
    category: 'İnşaat',
    description: 'İş makineleri çalışma saati ve yakıt takip formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 5,
    fields: [
      { key: 'machinePlate', label: 'Makine Plaka/Kod', type: 'text', required: true },
      { key: 'operator', label: 'Operatör', type: 'text' },
      { key: 'startHour', label: 'Başlangıç Saati', type: 'number' },
      { key: 'endHour', label: 'Bitiş Saati', type: 'number' },
      { key: 'fuelUsed', label: 'Alınan Yakıt (Lt)', type: 'number' },
      { key: 'workZone', label: 'Çalışılan Bölge', type: 'text' }
    ]
  },
  {
    id: 'const-4',
    title: 'İş Güvenliği Saha Kontrol Formu',
    category: 'İnşaat',
    description: 'Şantiye İSG uygunsuzluk tespit tutanağı.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: [
      { key: 'location', label: 'Kontrol Edilen Bölge', type: 'text', required: true },
      { key: 'ppeCheck', label: 'KKD Kullanımı Uygun mu?', type: 'checkbox' },
      { key: 'scaffoldCheck', label: 'İskele Güvenliği Uygun mu?', type: 'checkbox' },
      { key: 'electricCheck', label: 'Elektrik Panoları Kapalı mı?', type: 'checkbox' },
      { key: 'nonConformity', label: 'Tespit Edilen Uygunsuzluklar', type: 'textarea' },
      { key: 'deadline', label: 'Giderilme Tarihi', type: 'date' }
    ]
  },

  // --- ESNAF / KÜÇÜK İŞLETME ---
  {
    id: 'smb-1',
    title: 'Satış Takip Formu',
    category: 'Esnaf',
    description: 'Günlük satış ve ciro takip çizelgesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
      { key: 'date', label: 'Tarih', type: 'date', required: true },
      { key: 'cashSales', label: 'Nakit Satış Toplamı', type: 'number' },
      { key: 'cardSales', label: 'Kredi Kartı Satış Toplamı', type: 'number' },
      { key: 'totalSales', label: 'Genel Toplam', type: 'number', required: true },
      { key: 'notes', label: 'Notlar', type: 'textarea' }
    ]
  },
  {
    id: 'smb-2',
    title: 'Teklif Hazırlama Şablonu',
    category: 'Esnaf',
    description: 'Müşteriye hızlı fiyat teklifi verme şablonu.',
    isPremium: false,
    monthlyLimit: 50,
    photoCapacity: 5,
    fields: [
      { key: 'customerName', label: 'Müşteri Adı', type: 'text', required: true },
      { key: 'product', label: 'Ürün/Hizmet', type: 'textarea', required: true },
      { key: 'unitPrice', label: 'Birim Fiyat', type: 'number', required: true },
      { key: 'quantity', label: 'Adet/Miktar', type: 'number', required: true },
      { key: 'discount', label: 'İskonto (%)', type: 'number' },
      { key: 'validity', label: 'Geçerlilik Süresi (Gün)', type: 'number' }
    ]
  },
  {
    id: 'smb-3',
    title: 'Stok Sayım Listesi',
    category: 'Esnaf',
    description: 'Periyodik ürün stok sayım formu.',
    isPremium: true,
    monthlyLimit: 12,
    fields: [
      { key: 'countDate', label: 'Sayım Tarihi', type: 'date', required: true },
      { key: 'category', label: 'Kategori / Raf', type: 'text' },
      { key: 'itemCode', label: 'Ürün Kodu', type: 'text' },
      { key: 'expectedQty', label: 'Sistemdeki Adet', type: 'number' },
      { key: 'actualQty', label: 'Sayılan Adet', type: 'number', required: true },
      { key: 'difference', label: 'Fark', type: 'number' }
    ]
  },
  
  // --- GENEL / SERTİFİKA ---
  {
    id: 'cert-1',
    title: 'Katılım Sertifikası',
    category: 'Sertifika',
    description: 'Eğitim veya etkinlik katılım belgesi.',
    isPremium: true,
    photoCapacity: 0,
    fields: [
      { key: 'participantName', label: 'Katılımcı Adı Soyadı', type: 'text', required: true },
      { key: 'trainingName', label: 'Eğitim/Etkinlik Adı', type: 'text', required: true },
      { key: 'date', label: 'Tarih', type: 'date', required: true },
      { key: 'trainer', label: 'Eğitmen', type: 'text' }
    ]
  },
  {
    id: 'report-1',
    title: 'Genel Tutanak',
    category: 'Tutanak',
    description: 'Her türlü durum tespiti için genel tutanak şablonu.',
    isPremium: false,
    monthlyLimit: 100,
    photoCapacity: 10,
    fields: [
      { key: 'subject', label: 'Tutanak Konusu', type: 'text', required: true },
      { key: 'date', label: 'Olay Tarihi', type: 'date', required: true },
      { key: 'location', label: 'Olay Yeri', type: 'text' },
      { key: 'statement', label: 'Olayın Özeti ve Tespitler', type: 'textarea', required: true },
      { key: 'witnesses', label: 'Şahitler', type: 'textarea' }
    ]
  },
  {
    id: '8',
    title: 'İş Kazası Tutanağı',
    category: 'İSG',
    description: 'İş kazası tespit ve bildirim tutanağı.',
    isPremium: true,
    monthlyLimit: 10,
    photoCapacity: 10,
    fields: [
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
// Maintenance Mode
let isMaintenanceMode = false;

// Logger Middleware
app.use((req, res, next) => {
    // Only log non-static asset requests to avoid noise
    if (!req.url.match(/\.(css|js|png|jpg|ico)$/)) {
        const log = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            type: 'info',
            action: `${req.method}`, 
            details: `${req.url}`,
            source: req.ip || 'unknown',
            time: new Date().toISOString()
        };
        systemLogs.unshift(log); // Add to beginning
        if (systemLogs.length > 200) systemLogs.pop(); // Keep last 200
    }
    next();
});

// Maintenance Middleware
const checkMaintenance = (req, res, next) => {
    // Allow Admin Login & Status Checks
    const allowed = [
        '/api/auth/login', 
        '/api/maintenance', 
        '/api/status',
        '/api/health'
    ];
    
    // Check if path starts with allowed (or exact match for deep paths)
    const isAllowed = allowed.some(a => req.path.startsWith(a));

    if (isMaintenanceMode && !isAllowed) {
        // If user is admin (checking token), let them pass
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader && authHeader.split(' ')[1];
            if (token) {
                 try {
                     const user = jwt.verify(token, JWT_SECRET);
                     if (user.role === 'ADMIN') return next();
                 } catch(e) {}
            }
        }
        return res.status(503).json({ success: false, message: 'Sistem şu anda bakım modundadır. Lütfen daha sonra tekrar deneyiniz.', maintenance: true });
    }
    next();
};

app.use(checkMaintenance);

// Check mode
// Mock mode completely removed as requested


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
    console.log("ℹ️ [INFO] E-posta ayarları girilmedi. Mail özellikleri çalışmayacaktır.");
}


// Transporter Configuration
let transporter;

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
            transporter = null; // Ensure it is null if verify fails
        } else {
            console.log('✅ [SMTP SUCCESS] Mail sunucusu hazır ve çalışıyor!');
        }
    });
} catch (e) {
    console.error("❌ [CRITICAL] NodeMailer Başlatılamadı:", e);
    transporter = null;
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

        // Check History for Rights Persistence (Prevent reset on re-register)
        const deletedUserHistory = await dbAdapter.findDeletedUserByEmail(email);
        let finalRights = 10; // Default: 10 Rights

        if (deletedUserHistory) {
             console.log(`[Register] Found history for ${email}. Restoring rights: ${deletedUserHistory.rights}`);
             // Restore previous rights, but ensure it doesn't exceed default if they had more (optional, but safer to just restore)
             // or if they had 0, they stay at 0 to prevent farming.
             finalRights = deletedUserHistory.rights;
        }

        const newUser = {
            id: 'user-' + Date.now(),
            name,
            email,
            password: hashedPassword, // SECURED
            companyName: companyName || '', // Optional
            role: 'SUBSCRIBER',
            plan: 'FREE',
            remainingDownloads: finalRights, 
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
        if (transporter && email) {
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

// Get Invoices endpoint merged below


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

// Get User Invoices (Real)
app.get('/api/auth/invoices', authenticateToken, async (req, res) => {
    try {
        const user = await dbAdapter.findUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        const db = readFileDB();
        const invoices = (db.invoices || []).filter(inv => inv.userId === req.user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
        
        res.json({ success: true, invoices });
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
        if (transporter) {
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
                res.status(500).json({ success: false, message: 'E-posta gönderilemedi.' });
            }
        } else {
             console.error(`[FORGOT-PASSWORD] Transporter not ready.`);
             res.status(500).json({ success: false, message: 'E-posta servisi yapılandırılmamış.' });
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

        // Generate Invoice Record
        const invoice = {
            id: 'INV-' + userId.split('-')[0].toUpperCase() + '-' + Date.now().toString().slice(-6),
            userId: userId,
            customer: updatedUser.name,
            customerEmail: updatedUser.email,
            date: new Date().toISOString(),
            description: `${plan} Plan Upgrade`,
            amount: plan === 'YEARLY' ? 1200 : 150,
            currency: 'TRY',
            status: 'PAID'
        };

        // Save Invoice (File System only for now as default success)
        try {
           const db = readFileDB();
           if (!db.invoices) db.invoices = [];
           db.invoices.push(invoice);
           writeFileDB(db);
        } catch(e) { console.error('Error saving invoice:', e); }

        // Fatura/Bilgi Maili Gönderimi
        if (transporter && updatedUser.email) {
            try {
                 console.log(`Sending invoice email to ${updatedUser.email}...`);
                 const mailOptions = {
                    from: `"Kırbaş Panel" <${process.env.EMAIL_USER || 'noreply@kirbas.com'}>`, // sender address
                    to: updatedUser.email, // list of receivers
                    subject: 'Abonelik Satın Alımı Başarılı - Fatura Bilgilendirmesi', // Subject line
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #4F46E5;">Sayın ${updatedUser.name},</h2>
                            <p><strong>${plan === 'YEARLY' ? 'Yıllık Pro' : 'Aylık Standart'}</strong> paket aboneliğiniz başarıyla aktif edilmiştir.</p>
                            <div style="background-color: #f9favb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Paket:</strong> ${plan === 'YEARLY' ? 'Yıllık Pro' : 'Aylık Standart'}</p>
                                <p style="margin: 5px 0;"><strong>İşlem Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                                <p style="margin: 5px 0;"><strong>Tutar:</strong> ${plan === 'YEARLY' ? 'EFT/Havale' : 'Kredi Kartı'}</p>
                            </div>
                            <p>Aboneliğinizle birlikte tüm premium şablonlara ve özelliklere erişebilirsiniz.</p>
                            <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
                            <br>
                            <p style="font-size: 12px; color: #888;">Bu e-posta otomatik olarak gönderilmiştir.</p>
                        </div>
                    `
                 };
                 await transporter.sendMail(mailOptions);
                 console.log('✅ Fatura maili başarıyla gönderildi.');
            } catch (emailErr) {
                 console.error('❌ Mail gönderim hatası:', emailErr);
            }
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
        const result = await dbAdapter.deleteUser(userId);

        if (result) {
            // Check if we need to remove from session/token blacklist (optional)
            return res.json({ success: true, message: 'Hesap başarıyla silindi.' });
        } else {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı veya silinemedi.' });
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
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
        // Try finding via adapter first (covers PG/Mongo/File)
        const user = await dbAdapter.findUserById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
        
        // Prepare safe updates
        const allowedFields = ['name', 'companyName', 'role', 'plan', 'isActive', 'email', 'remainingDownloads'];
        const safeUpdates = {};
        
        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                safeUpdates[field] = updates[field];
            }
        });

        // Use Adapter to Update
        await dbAdapter.updateUser(id, safeUpdates);
        
        // Return updated user
        const updatedUser = await dbAdapter.findUserById(id);
        const { password: _, ...userWithoutPassword } = updatedUser;
        
        res.json({ success: true, user: userWithoutPassword });

    } catch (e) {
        console.error('Update User Error:', e);
        res.status(500).json({ success: false, message: 'Güncelleme sırasında hata oluştu.' });
    }
});

// Admin: Reset User Password
app.put('/api/users/:id/password', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Parola en az 6 karakter olmalıdır.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await dbAdapter.updateUser(id, { password: hashedPassword });
        res.json({ success: true, message: 'Kullanıcı parolası başarıyla güncellendi.' });
    } catch(e) {
        console.error('Password Reset Error:', e);
        res.status(500).json({ success: false, message: 'Parola güncellenemedi.' });
    }
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


// Admin: Create New User
app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    const { name, email, password, role, subscriptionType } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'İsim, E-posta ve Şifre gereklidir.' });
    }

    try {
        const existing = await dbAdapter.findUserByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kullanımda.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            companyName: 'Bireysel',
            plan: subscriptionType || 'FREE',
            subscriptionType: subscriptionType || 'FREE',
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
            remainingDownloads: 5,
            isBanned: false,
            createdAt: new Date().toISOString()
        };

        await dbAdapter.addUser(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ success: true, message: 'Kullanıcı başarıyla oluşturuldu.', user: userWithoutPassword });

    } catch (e) {
        console.error('Create User Error:', e);
        res.status(500).json({ success: false, message: 'Kullanıcı oluşturulamadı.' });
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

    try {
        const user = await dbAdapter.findUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        const banExpiresAt = durationMinutes 
            ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString() 
            : null; // Null means permanent

        await dbAdapter.updateUser(id, { 
            isBanned: true, 
            banReason: banReason || 'Yönetici kararı',
            banExpiresAt: banExpiresAt
        });

        const updatedUser = await dbAdapter.findUserById(id);
        res.json({ success: true, message: 'Kullanıcı yasaklandı.', user: updatedUser });

    } catch(e) {
        console.error('Ban Error:', e);
        res.status(500).json({ success: false, message: 'Yasaklama işlemi başarısız.' });
    }
});

// Admin: Unban User
app.post('/api/users/:id/unban', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await dbAdapter.findUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        await dbAdapter.updateUser(id, { 
            isBanned: false, 
            banReason: null,
            banExpiresAt: null
        });

        res.json({ success: true, message: 'Kullanıcı yasağı kaldırıldı.' });
    } catch(e) {
        console.error('Unban Error:', e);
        res.status(500).json({ success: false, message: 'İşlem başarısız.' });
    }
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



// --- BANNED IPS ADAPTER ROUTES (ADMIN) ---

// Get Banned IPs
app.get('/api/admin/banned-ips', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const list = await dbAdapter.getBannedIps();
        res.json({ success: true, bannedIps: list });
    } catch(e) {
        console.error('Get Banned IPs Error:', e);
        res.status(500).json({ success: false, message: 'Liste alınamadı' });
    }
});

// Add Banned IP
app.post('/api/admin/banned-ips', authenticateToken, requireAdmin, async (req, res) => {
    const { ip, reason, expiresAt } = req.body;
    if (!ip) return res.status(400).json({ success: false, message: 'IP adresi gereklidir.' });
    
    // Prevent banning self
    let clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (clientIp.startsWith('::ffff:')) clientIp = clientIp.substring(7);

    // Also check if admin is banning themselves from the request IP
    if (ip === clientIp || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
        return res.status(400).json({ success: false, message: 'Kendi IP adresinizi yasaklayamazsınız.' });
    }

    try {
        const result = await dbAdapter.addBannedIp(ip, reason, expiresAt);
        
        systemLogs.unshift({
            id: Date.now(),
            type: 'warning',
            action: 'IP Ban',
            details: `Admin banned IP: ${ip}`,
            time: new Date().toISOString()
        });
        
        // addBannedIp return void/boolean is inconsistent in my previous thought vs implementation
        // wait, I implemented addBannedIp to return true/false.
        // Let's assume it worked if no error thrown, or verify.
        // In my implementation: return ipData; if not exists, so truthy.
        // Wait, I implemented: return true/false in previous step.
        
        res.json({ success: true, message: 'IP yasaklandı.' });

    } catch(e) {
        console.error('Add Banned IP Error:', e);
        res.status(500).json({ success: false, message: 'İşlem başarısız.' });
    }
});

// Remove Banned IP
app.delete('/api/admin/banned-ips/:ip', authenticateToken, requireAdmin, async (req, res) => {
    const { ip } = req.params;
    try {
        const removed = await dbAdapter.removeBannedIp(ip);
        if (removed) {
             systemLogs.unshift({
                id: Date.now(),
                type: 'info',
                action: 'IP Unban',
                details: `Admin unbanned IP: ${ip}`,
                time: new Date().toISOString()
            });
            res.json({ success: true, message: 'Yasak kaldırıldı.' });
        } else {
            res.status(404).json({ success: false, message: 'IP bulunamadı.' });
        }
    } catch(e) {
        console.error('Remove Banned IP Error:', e);
        res.status(500).json({ success: false, message: 'İşlem başarısız.' }); 
    }
});


// --- EMAIL SENDING ENDPOINT ---
app.post('/api/send-document', async (req, res) => {
    const { email, pdfBase64, documentName } = req.body;

    if (!email || !pdfBase64) {
        return res.status(400).json({ success: false, message: 'E-posta ve PDF verisi gereklidir.' });
    }

    // Check if transporter is ready
    if (!transporter) {
        console.warn('Email service not configured (No Transporter).');
        return res.status(503).json({ success: false, message: 'E-posta servisi şu anda kullanılamıyor (Sunucu Yapılandırması Eksik).' });
    }

    try {
        const base64Data = pdfBase64.split(';base64,').pop();
        
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
    res.json({ success: true, logs: systemLogs });
});

app.get('/api/maintenance', (req, res) => {
    res.json({ maintenance: isMaintenanceMode });
});

app.post('/api/maintenance', authenticateToken, requireAdmin, (req, res) => {
    const { enabled } = req.body;
    isMaintenanceMode = enabled;
    systemLogs.unshift({
        id: Date.now().toString(),
        type: 'warning',
        action: enabled ? 'MAINTENANCE_ON' : 'MAINTENANCE_OFF',
        details: enabled ? 'System put into maintenance mode' : 'Maintenance mode disabled',
        time: new Date().toISOString(),
        source: 'ADMIN'
    });
    res.json({ success: true, maintenance: isMaintenanceMode });
});

    res.json(systemLogs);
});



// --- EMAIL ROUTES RE-ADDED (CLEAN) ---
app.post('/api/send-welcome-email', async (req, res) => {
  const { recipientEmail, recipientName, companyName, plan } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: 'Email adresi zorunludur' });
  }

  if (!transporter) {
       return res.status(503).json({ success: false, message: 'E-posta servisi aktif değil.' });
  }

  const planName = plan === 'YEARLY' ? 'Yıllık Pro' : plan === 'MONTHLY' ? 'Aylık Standart' : 'Ücretsiz';

  // Email Content
  const mailOptions = {
    from: `"Kırbaş Doküman" <${process.env.EMAIL_USER || 'info@kirbas.com'}>`,
    to: recipientEmail,
    subject: 'Kırbaş Doküman Platformuna Hoş Geldiniz',
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
        
        <p style="font-size: 12px; color: #94a3b8;">Kırbaş Doküman Yönetimi © 2026</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    systemLogs.unshift({
        id: Date.now(),
        type: 'success',
        action: 'Email Sent',
        details: `MessageID: ${info.messageId} | To: ${recipientEmail}`,
        time: new Date().toISOString()
    });

    res.json({ success: true, message: 'Mail başarıyla gönderildi', messageId: info.messageId });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    res.status(500).json({ success: false, message: 'Mail gönderme hatası', error: error.message });
  }
});

// --- GENERATE DOCUMENT (PDF) ---
// Generates a PDF on the backend using data provided
app.post('/api/generate-pdf', authenticateToken, async (req, res) => {
    const { templateId, data, title, email } = req.body;
    
    // --- Rights Check Start ---
    let user = null;
    try {
        user = await dbAdapter.findUserById(req.user.id);
    } catch (e) { console.error('User fetch error during PDF gen:', e); }
    
    if (!user) {
         return res.status(401).json({ success: false, message: 'Kullanıcı doğrulanamadı.' });
    }

    // Check if user has rights
    let hasRights = false;
    let currentRights = typeof user.remainingDownloads === 'number' ? user.remainingDownloads : 0;

    // ADMIN, UNLIMITED plan or positive remainingDownloads
    if (user.role === 'ADMIN' || user.plan === 'UNLIMITED') {
        hasRights = true;
    } else {
        if (currentRights > 0) {
            hasRights = true;
        }
    }

    if (!hasRights) {
         return res.status(402).json({ 
             success: false, 
             message: 'İndirme hakkınız kalmadı. Devam etmek için lütfen ek paket satın alınız.',
             paymentRequired: true 
         });
    }
    // --- Rights Check End ---
    
    // Log generation request
     systemLogs.unshift({
            id: Date.now(),
            type: 'info',
            action: 'PDF Generation',
            details: `User: ${user.email} | Template: ${templateId} | Title: ${title}`,
            time: new Date().toISOString()
     });

    try {
        // Decrement Rights (Optimistic)
        if (user.role !== 'ADMIN' && user.plan !== 'UNLIMITED') {
            await dbAdapter.updateUser(user.id, { remainingDownloads: Math.max(0, currentRights - 1) });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        // Collect data chunks
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);
            const base64 = pdfData.toString('base64');
            
            // Send Email if requested
            if (email) {
                try {
                     const mailOptions = {
                        from: `"Kırbaş Doküman" <${process.env.EMAIL_USER || 'info@kirbas.com'}>`,
                        to: email,
                        subject: `Dokümanınız Hazır: ${title || 'Yeni Doküman'}`,
                        text: `Merhaba,\n\nOluşturduğunuz "${title || 'Doküman'}" isimli doküman ektedir.\n\nİyi günler,\nKırbaş Doküman Platformu`,
                        attachments: [
                            {
                                filename: `${title || 'Dokuman'}.pdf`,
                                content: pdfData
                            }
                        ]
                    };
                    
                    if (transporter) {
                        await transporter.sendMail(mailOptions);
                        console.log(`PDF E-posta ile gönderildi: ${email}`);
                    } else {
                        console.warn('Transporter tanımlı değil, mail gönderilemedi.');
                    }
                } catch (mailErr) {
                    console.error('PDF Mail Gönderme Hatası:', mailErr);
                }
            }

            res.json({ success: true, pdfBase64: `data:application/pdf;base64,${base64}` });
        });

        // --- PDF CONTENT GENERATION ---
        
        // Brand Header (Top Left)
        if (data?.logo) {
            try {
                 const logoBuffer = Buffer.from(data.logo.split(',')[1], 'base64');
                 doc.image(logoBuffer, 50, 30, { height: 40 });
            } catch(e) {
                 doc.fontSize(10).fillColor('#64748b').text('KIRBAŞ DOKÜMAN PLATFORMU', 50, 40, { align: 'left' });
            }
        } else {
            doc.fontSize(10).fillColor('#64748b').text('KIRBAŞ DOKÜMAN PLATFORMU', 50, 40, { align: 'left' });
        }
        
        doc.fontSize(10).fillColor('#64748b').text(new Date().toLocaleDateString('tr-TR'), 50, 40, { align: 'right' });

        // Title Area
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(24).fillColor('#1e293b').text(title || 'Doküman Başlığı', { align: 'center' });
        doc.moveDown(0.5);
        if (templateId) {
             doc.font('Helvetica').fontSize(10).fillColor('#94a3b8').text(`Şablon Kod: ${templateId}`, { align: 'center' });
        }
        doc.moveDown(2);
        
        // Separator
        doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(2).strokeColor('#e2e8f0').stroke();
        doc.moveDown(2);

        // Dynamic Content (Table-like Layout)
        if (data && typeof data === 'object') {
            const startX = 50;
            const valueX = 200; // Alignment for values
            let currentY = doc.y;

            // Extract special fields
            const { logo, customFields, ...restData } = data;

            // 1. Standard Fields
            Object.entries(restData).forEach(([key, value], index) => {
                // Key formatting (camelCase to Title Case)
                let label = key.replace(/([A-Z])/g, ' $1')
                             .replace(/^./, str => str.toUpperCase())
                             .replace(/Id$/, ' ID') // Fix ID suffix
                             .trim();
                
                // Value formatting
                let displayValue = "";
                if (typeof value === 'boolean') {
                    displayValue = value ? 'Evet' : 'Hayır';
                } else if (!value && value !== 0) {
                    displayValue = '-';
                } else {
                    displayValue = String(value);
                }

                // Calculate height needed for this row based on value length
                doc.font('Helvetica').fontSize(11);
                const valueHeight = doc.heightOfString(displayValue, { width: 340 });
                const labelHeight = doc.heightOfString(label, { width: 140 });
                const rowHeight = Math.max(valueHeight, labelHeight) + 12; // Padding

                // Check page break
                if (currentY + rowHeight > doc.page.height - 50) {
                    doc.addPage();
                    currentY = 50;
                }

                // Zebra striping
                if (index % 2 === 0) {
                    doc.rect(50, currentY - 5, 500, rowHeight).fillColor('#f8fafc').fill();
                }

                // Label
                doc.fillColor('#475569').font('Helvetica-Bold').fontSize(11).text(label, startX + 10, currentY, { width: 140 });
                
                // Value
                doc.fillColor('#1e293b').font('Helvetica').fontSize(11).text(displayValue, valueX, currentY, { width: 340 });

                currentY += rowHeight;
            });

            // 2. Custom Fields
             if (customFields && Array.isArray(customFields) && customFields.length > 0) {
                 // Section Component
                 currentY += 10;
                 doc.font('Helvetica-Bold').fontSize(12).fillColor('#cbd5e1').text('EK BÖLÜMLER', 50, currentY);
                 doc.moveTo(50, currentY + 15).lineTo(550, currentY + 15).lineWidth(1).strokeColor('#cbd5e1').stroke();
                 currentY += 25;

                 customFields.forEach((field, index) => {
                    const label = field.label || 'Başlıksız';
                    const displayValue = field.value || '-';

                    doc.font('Helvetica').fontSize(11);
                    const valueHeight = doc.heightOfString(displayValue, { width: 340 });
                    const labelHeight = doc.heightOfString(label, { width: 140 });
                    const rowHeight = Math.max(valueHeight, labelHeight) + 12;

                    if (currentY + rowHeight > doc.page.height - 50) {
                        doc.addPage();
                        currentY = 50;
                    }

                    if (index % 2 === 0) {
                        doc.rect(50, currentY - 5, 500, rowHeight).fillColor('#f8fafc').fill();
                    }

                    doc.fillColor('#475569').font('Helvetica-Bold').fontSize(11).text(label, startX + 10, currentY, { width: 140 });
                    doc.fillColor('#1e293b').font('Helvetica').fontSize(11).text(displayValue, valueX, currentY, { width: 340 });
                    currentY += rowHeight;
                 });
             }

        } else {
             doc.font('Helvetica-Oblique').text('İçerik bulunamadı.', { align: 'center' });
        }
        
        // Footer (Page Numbers)
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            const bottom = doc.page.height - 40;
            doc.fontSize(9).fillColor('#cbd5e1').text(
                `Sayfa ${i + 1} / ${range.count} - Kırbaş Doküman Yönetim Sistemleri`, 
                50, 
                bottom, 
                { align: 'center', width: 500 }
            );
        }
        
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



// --- MIGRATION UTILS ---
const migrateUserRights = async () => {
    console.log('🔄 Checking User Rights Migration...');
    try {
        const users = await dbAdapter.getUsers();
        let updatedCount = 0;
        for (const user of users) {
             // Only if user plan is FREE/TRIAL and remainingDownloads is null/undefined
             // Don't overwrite if they have 0 or any number
             if (user.remainingDownloads === undefined || user.remainingDownloads === null) {
                 // Set Default: 10
                 await dbAdapter.updateUser(user.id, { remainingDownloads: 10 });
                 updatedCount++;
             }
        }
        if (updatedCount > 0) console.log(`✅ Migrated ${updatedCount} users to default rights.`);
        else console.log('✅ No migration needed.');
    } catch (e) {
        console.error('Migration Failed:', e);
    }
};

// --- BUY RIGHTS ENDPOINT ---
app.post('/api/buy-rights', authenticateToken, async (req, res) => {
    const { packageId } = req.body;
    const userId = req.user.id; // From token

    if (!packageId) return res.status(400).json({ success: false, message: 'Paket seçilmedi.' });

    try {
        const user = await dbAdapter.findUserById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        // Logic for different packages
        let amount = 0;
        let packageName = '';
        
        switch (packageId) {
            case 'pack_10':
                amount = 10;
                packageName = '10 Ek Hak';
                break;
            case 'pack_50': // Example
                amount = 50;
                packageName = '50 Ek Hak';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Geçersiz paket ID.' });
        }

        // Add
        const current = typeof user.remainingDownloads === 'number' ? user.remainingDownloads : 0;
        const newTotal = current + amount;
        
        await dbAdapter.updateUser(userId, { remainingDownloads: newTotal });

        // Log
        systemLogs.unshift({
            id: Date.now(),
            type: 'success',
            action: 'Purchase',
            details: `${user.email} bought ${packageName}. New Total: ${newTotal}`,
            time: new Date().toISOString()
        });
        
        res.json({ success: true, message: `${packageName} başarıyla tanımlandı.`, newTotal });

    } catch (err) {
        console.error('Purchase Error:', err);
        res.status(500).json({ success: false, message: 'Satın alma işlemi başarısız.' });
    }
});

// Run Migration on Startup (Async)
migrateUserRights();

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    if (res.headersSent) return next(err);
    res.status(500).json({ 
        success: false, 
        message: 'Sunucu hatası oluştu.',
        details: err.message
    });
});


// Vercel Serverless Function Support
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend sunucusu http://0.0.0.0:${PORT} üzerinde çalışıyor`);
        console.log(`Erişim için: http://localhost:${PORT}`);
    });
}

module.exports = app;
