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
    createdAt: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// File DB Helper
const readFileDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return { users: [], documents: [] };
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) { return { users: [], documents: [] }; }
};

const writeFileDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) { return false; }
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
        writeFileDB(data);
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
// We'll use /tmp/db.json as the working DB, but initialize it from the source db.json if available.
const SOURCE_DB_FILE = path.join(__dirname, 'db.json');
const DB_FILE = process.env.VERCEL 
    ? path.join('/tmp', 'db.json') 
    : path.join(__dirname, 'db.json');

// --- MOCK TEMPLATES (Initialize DB) ---
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
      { key: 'companyName', label: 'Firma Adı', type: 'text', required: true },
      { key: 'preparedBy', label: 'Hazırlayan', type: 'text', required: true },
      { key: 'date', label: 'Tarih', type: 'date', required: true }
    ]
  },
  {
    id: '2',
    title: 'Hizmet Şablonu Oluştur',
    category: 'Genel',
    description: 'Standart hizmet teklif ve kapsam belirleme formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '3',
    title: 'Eğitim Katılım Sertifikası',
    category: 'İK',
    description: 'Personel eğitimleri sonrası verilecek başarı sertifikası.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '4',
    title: 'Denetim Raporu',
    category: 'Denetim',
    description: 'Saha denetimleri için detaylı raporlama formatı.',
    isPremium: true,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '5',
    title: 'Risk Analizi Formu',
    category: 'ISG',
    description: '5x5 Risk matrisi değerlendirme formu.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '6',
    title: 'Personel Görev Tanımı',
    category: 'İK',
    description: 'Çalışan görev ve sorumluluk bildirim formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '7',
    title: 'Makine Bakım Kartı',
    category: 'Teknik',
    description: 'Periyodik bakım takip çizelgesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '8',
    title: 'Kaza Tespit Tutanağı',
    category: 'ISG',
    description: 'İş kazası bildirim ve tespit formu.',
    isPremium: true,
    photoCapacity: 20,
    fields: []
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
    if (!initialData.templates) {
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

// Helper to read/write DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
             // Re-try initialization logic if somehow deleted
             if (process.env.VERCEL && fs.existsSync(SOURCE_DB_FILE)) {
                 try {
                    const params = fs.readFileSync(SOURCE_DB_FILE, 'utf8');
                    fs.writeFileSync(DB_FILE, params);
                    return JSON.parse(params);
                 } catch(e) {}
             }
            return { users: [], documents: [], templates: INITIAL_TEMPLATES };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(data);
        if (!parsed.templates) parsed.templates = INITIAL_TEMPLATES;
        return parsed;
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
    console.warn("⚠️ [MAIL DEBUG] Geçerli mail bilgisi bulunamadı veya 'senin_mailin' içeriyor. Mock (Simülasyon) modu aktif.");
    isMockMode = true;
    
    // Add logic to log to internal system logs if needed (optional based on previous context)
    // but focusing on console output as requested.
}

// Transporter Configuration
let transporter;

if (!isMockMode) {
    console.log("[MAIL DEBUG] Attempting to configure Nodemailer with Gmail (SMTP)...");
    try {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });
        
        console.log("[MAIL DEBUG] Transporter created. Verifying connection...");

        // Verify connection
        transporter.verify(function (error, success) {
            if (error) {
                console.error('❌ [MAIL DEBUG] Connection Failed!');
                console.error(error); // Log full error object
                console.error('[MAIL DEBUG] Stack:', error.stack);
                
                console.warn('⚠️ [MAIL DEBUG] Falling back to Mock Mode due to verification failure.');
                isMockMode = true;
            } else {
                console.log('✅ [MAIL DEBUG] Server is ready to take our messages');
                isMockMode = false;
            }
        });
    } catch (e) {
        console.error("❌ [MAIL DEBUG] Critical Error initializing Nodemailer:", e);
        isMockMode = true;
    }
} else {
    console.log("[MAIL DEBUG] Skipping Nodemailer configuration (Mock Mode is ON)");
}

// --- AUTHENTICATION & USER ROUTES ---

// Helper: Verify JWT Token Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ success: false, message: 'Oturum açmanız gerekiyor.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT Error:", err.message);
            return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş oturum.' });
        }
        req.user = user;
        next();
    });
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
    if (!name || !email || !password || !companyName) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    try {
        // Check if user exists
        const existingUser = await dbAdapter.findUserByEmail(email);
        if (existingUser) {
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
            companyName,
            role: 'SUBSCRIBER',
            plan: 'FREE',
            remainingDownloads: 3,
            subscriptionStartDate: new Date().toISOString(),
            subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            createdAt: new Date().toISOString()
        };

        await dbAdapter.addUser(newUser);

        // --- SEND WELCOME EMAIL ---
        if (transporter && !isMockMode) {
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
                                    <li style="margin-bottom: 10px;">🏢 <strong>Belirtilen Firma:</strong> ${companyName}</li>
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
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.error('❌ Welcome email failed:', error);
                else console.log('✅ Welcome email sent:', info.response);
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

        console.log(`[PASSWORD RESET] Generated code for ${email}: ${code}`);
        
        // Check if we can send email
        if (transporter && !isMockMode) {
            console.log(`[FORGOT-PASSWORD] Attempting to send email to ${email}...`);
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
                const info = await transporter.sendMail(mailOptions);
                console.log(`[FORGOT-PASSWORD] Email sent successfully: ${info.messageId}`);
                console.log(`[FORGOT-PASSWORD] Server response: ${info.response}`);
            } catch (mailError) {
                console.error(`[FORGOT-PASSWORD] Email failed:`, mailError);
                
                systemLogs.push({
                    id: Date.now(),
                    type: 'error',
                    action: 'Email Send Failed',
                    details: `To: ${email}, Error: ${mailError.message}`,
                    time: new Date().toISOString()
                });
            }
        } else {
             console.warn(`[MOCK MODE] Password reset email not sent. Code: ${code}. Transporter: ${!!transporter}, isMockMode: ${isMockMode}`);
        }

        res.json({ success: true, message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi.' });
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
    
    // Prevent password overwrite if not intended (or handle separately)
    const { password, ...safeUpdates } = updates;

    db.users[index] = { ...db.users[index], ...safeUpdates };
    writeDB(db);
    
    const { password: _, ...userWithoutPassword } = db.users[index];
    res.json({ success: true, user: userWithoutPassword });
});

// Admin: Delete User (Protected)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    
    // Self-deletion check
    if (req.user.id === id) {
        return res.status(400).json({ success: false, message: 'Kendi hesabınızı silemezsiniz.' });
    }
    
    const initialLength = db.users.length;
    const filteredUsers = db.users.filter(u => u.id !== id);
    
    if (filteredUsers.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    db.users = filteredUsers;
    writeDB(db);
    
    res.json({ success: true, message: 'Kullanıcı silindi.' });
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
        const mailOptions = {
            from: `"Kırbaş Doküman" <${process.env.EMAIL_USER || 'info@kirbas.com'}>`,
            to: email,
            subject: `Dokümanınız Hazır: ${documentName || 'Yeni Doküman'}`,
            text: `Merhaba,\n\nOluşturduğunuz "${documentName}" isimli doküman ektedir.\n\nİyi günler,\nKırbaş Doküman`,
            attachments: [
                {
                    filename: `${documentName || 'Dokuman'}.pdf`,
                    content: pdfBase64.split('base64,')[1],
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
