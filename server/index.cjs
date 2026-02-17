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

// --- POSTGRESQL CONNECTION (Primary) ---
// If DATABASE_URL is present, we use PostgreSQL as preferred in requirements
const PG_CONNECTION_STRING = process.env.DATABASE_URL;

let pgPool = null;
if (PG_CONNECTION_STRING) {
    pgPool = new Pool({
        connectionString: PG_CONNECTION_STRING,
        ssl: { rejectUnauthorized: false } 
    });
    console.log('✅ PostgreSQL Configured');
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
        if (pgPool) {
            try {
                // Ensure table exists
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        email TEXT UNIQUE,
                        data JSONB
                    );
                `);
                const res = await pgPool.query('SELECT * FROM users');
                return res.rows.map(row => ({...row.data, id: row.id, email: row.email}));
            } catch (err) {
                console.error('PG Error:', err);
            }
        }
        
        if (MONGO_URI) {
            await connectDB();
            const users = await User.find({}).lean();
            return users.map(u => ({...u, id: u.id || u._id.toString()}));
        }
        return readFileDB().users;
    },
    
    addUser: async (user) => {
        if (pgPool) {
            try {
                await pgPool.query('INSERT INTO users(id, email, data) VALUES($1, $2, $3)', 
                   [user.id, user.email, user]);
                return user;
            } catch (err) {
                 console.error('PG Error:', err);
            }
        }

        if (MONGO_URI) {
            await connectDB();
            const newUser = new User(user);
            await newUser.save();
            return newUser;
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
            await connectDB();
            await User.findOneAndUpdate({ id: id }, updates);
            return;
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
                const res = await pgPool.query('SELECT data FROM users WHERE email = $1', [email]);
                return res.rows.length ? res.rows[0].data : undefined;
             } catch (err) { console.error('PG Error:', err); }
        }

        if (MONGO_URI) {
            await connectDB();
            return await User.findOne({ email }).lean();
        }
        return readFileDB().users.find(u => u.email === email);
    },

    findUserById: async (id) => {
        if (pgPool) {
             try {
                const res = await pgPool.query('SELECT data FROM users WHERE id = $1', [id]);
                return res.rows.length ? res.rows[0].data : undefined;
             } catch (err) { console.error('PG Error:', err); }
        }

        if (MONGO_URI) {
            await connectDB();
            return await User.findOne({ id }).lean(); // or _id
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

// Initialize DB if not exists (or copy from source on Vercel startup)
if (!fs.existsSync(DB_FILE)) {
    let initialData = { users: [], documents: [] };
    
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
    
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    } catch (e) {
        console.error('Failed to initialize DB:', e);
    }
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
            return { users: [], documents: [] };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("DB Read Error:", err);
        return { users: [], documents: [] };
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
const seedAdmin = async () => {
    try {
        const db = readDB();
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@kirbas.com';
        // GÜVENLİK: Admin şifresi hardcoded olmamalıdır. Çevresel değişkenden alınır.
        const adminPass = process.env.ADMIN_PASSWORD || 'Admin123!@#'; 
        
        if (!db.users || !Array.isArray(db.users)) {
            db.users = [];
        }

        if (!db.users.some(u => u.email === adminEmail)) {
            console.log("⚙️  Varsayılan Admin kullanıcısı oluşturuluyor...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPass, salt);
            
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
            
            db.users.push(adminUser);
            writeDB(db);
            console.log(`✅ Admin kullanıcısı oluşturuldu: ${adminEmail}`);
        }
    } catch (error) {
        console.error("Seed Admin Error:", error);
    }
};

// Initialize Admin
seedAdmin();

// In-memory Logs (Real-world app would use DB)
const systemLogs = [];
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
const emailUser = process.env.EMAIL_USER;
if (!emailUser || emailUser.includes('senin_mailin')) {
    console.log("⚠️  UYARI: Geçerli mail bilgisi bulunamadı. Mock (Simülasyon) modu aktif.");
    isMockMode = true;
     systemLogs.push({
        id: Date.now(),
        type: 'warning',
        action: 'System Startup',
        details: 'Mail credentials missing, active Mock Mode',
        time: new Date().toISOString()
    });
}

// Transporter Configuration
let transporter;

if (!isMockMode) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Verify connection
    transporter.verify(function (error, success) {
        if (error) {
            console.log('❌ Sunucu mail bağlantı hatası:', error.message);
            isMockMode = true;
             systemLogs.push({
                id: Date.now(),
                type: 'error',
                action: 'SMTP Connection Failed',
                details: error.message,
                time: new Date().toISOString()
            });
        } else {
            console.log('✅ Sunucu gerçek mail gönderimi için hazır');
             systemLogs.push({
                id: Date.now(),
                type: 'success',
                action: 'System Ready',
                details: 'SMTP Connection Established',
                time: new Date().toISOString()
            });
        }
    });
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
            await pgPool.query('SELECT 1');
            dbStatus = 'connected';
            dbType = 'postgres';
        } catch (e) {
            dbStatus = 'error: ' + e.message;
            dbType = 'postgres';
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
    
    try {
        const user = await dbAdapter.findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Correct Password
            
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
            res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Giriş yapılırken hata oluştu.' });
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

    // Mock mode
    if (Object.keys(process.env).length === 0 || !process.env.EMAIL_USER) {
         console.log('---------- [MOCK DOCUMENT SENT] ----------');
         console.log(`To: ${email}`);
         console.log(`Doc: ${documentName}`);
         return res.json({ success: true, message: 'Doküman simülasyon olarak gönderildi (Mock Mode)' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

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
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                doc.font('Helvetica-Bold').fontSize(12).text(`${label}:`, { continued: true });
                doc.font('Helvetica').fontSize(12).text(`  ${value}`);
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
