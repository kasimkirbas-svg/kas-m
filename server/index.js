const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Register
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, companyName } = req.body;
    
    if (!name || !email || !password || !companyName) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
    }

    const db = readDB();
    
    // Check if user exists
    if (db.users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kullanımda.' });
    }

    const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password, // In production, hash this!
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

    // Add log
    systemLogs.unshift({
        id: Date.now(),
        type: 'success',
        action: 'User Registered',
        details: `${name} (${email}) joined`,
        time: new Date().toISOString()
    });

    res.json({ success: true, user: newUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const db = readDB();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        systemLogs.unshift({
            id: Date.now(),
            type: 'info',
            action: 'User Login',
            details: `${user.name} logged in`,
            time: new Date().toISOString()
        });
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
    }
});

// Upgrade User (Mock Payment)
app.post('/api/users/upgrade', (req, res) => {
    const { userId, plan } = req.body;
    const db = readDB();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Update user
    db.users[userIndex].plan = plan;
    db.users[userIndex].remainingDownloads = 9999;
    db.users[userIndex].role = 'SUBSCRIBER'; // Ensure they are subscriber
    
    writeDB(db);
    
    res.json({ success: true, user: db.users[userIndex] });
});

// Admin: Get All Users
app.get('/api/users', (req, res) => {
    // In a real app, verify admin token here
    const db = readDB();
    res.json(db.users);
});

// Admin: Update User
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const db = readDB();
    
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    db.users[index] = { ...db.users[index], ...updates };
    writeDB(db);
    
    res.json({ success: true, user: db.users[index] });
});

// Admin: Delete User
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    
    const filteredUsers = db.users.filter(u => u.id !== id);
    if (filteredUsers.length === db.users.length) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    db.users = filteredUsers;
    writeDB(db);
    
    res.json({ success: true });
});


// --- SYSTEM MONITORING ROUTES ---

app.get('/api/status', (req, res) => {
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

app.get('/api/logs', (req, res) => {
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


app.listen(PORT, () => {
  console.log(`Backend sunucusu http://localhost:${PORT} üzerinde çalışıyor`);
});
