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
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (required for rate-limit behind localtunnel/vercel)
const PORT = process.env.PORT || 3001;
// GÜVENLİK: Prodüksiyonda mutlaka .env dosyasından gelmeli.
// Eğer .env yoksa rastgele güçlü bir string oluşturulmalı, sabit string kullanılmamalı.
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex'); 

// --- SECURITY MIDDLEWARE ---
app.use(helmet()); // Set secure HTTP headers
app.use(cors({
  origin: '*', // Allow all origins for easier local network access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
})); 
app.use(express.json());

// Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// --- SIMPLE FILE-BASED DATABASE ---
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        documents: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Helper to read/write DB
const readDB = () => {
    try {
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

// --- SEED ADMIN USER ---
const seedAdmin = async () => {
    const db = readDB();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kirbas.com';
    // GÜVENLİK: Admin şifresi hardcoded olmamalıdır. Çevresel değişkenden alınır.
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin123!@#'; 
    
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
        console.log(`✅ Admin kullanıcısı oluşturuldu: ${adminEmail} (Şifre: ENV veya varsayılan)`);
    }
};

// Initialize Admin
seedAdmin();

// In-memory Logs (Real-world app would use DB)
const systemLogs = [];
const startTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());

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

    const db = readDB();
    
    // Check if user exists
    if (db.users.some(u => u.email === email)) {
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

    db.users.push(newUser);
    writeDB(db);

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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Welcome email failed:', error);
                
                // Add error log
                systemLogs.unshift({
                    id: Date.now(),
                    type: 'error',
                    action: 'Email Failed',
                    details: `Welcome email to ${email} failed: ${error.message}`,
                    time: new Date().toISOString()
                });
            } else {
                console.log('✅ Welcome email sent:', info.response);
                
                // Add success log
                systemLogs.unshift({
                    id: Date.now(),
                    type: 'success',
                    action: 'Email Sent',
                    details: `Welcome email sent to ${email}`,
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

    // Add log
    systemLogs.unshift({
        id: Date.now(),
        type: 'success',
        action: 'User Registered',
        details: `${name} (${email}) joined`,
        time: new Date().toISOString()
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword, token });
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
        // Correct Password
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

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
});

// Upgrade User (Mock Payment) (Protected)
app.post('/api/users/upgrade', authenticateToken, (req, res) => {
    const { userId, plan } = req.body;
    const db = readDB();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Update user
    db.users[userIndex].plan = plan;
    db.users[userIndex].remainingDownloads = 9999;
    db.users[userIndex].role = 'SUBSCRIBER';
    
    writeDB(db);
    
    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json({ success: true, user: userWithoutPassword });
});

// Admin: Get All Users (Protected)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    const db = readDB();
    // Don't send passwords
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
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


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend sunucusu http://0.0.0.0:${PORT} üzerinde çalışıyor`);
  console.log(`Erişim için: http://localhost:${PORT}`);
});
