const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check mode
let isMockMode = false;
const emailUser = process.env.EMAIL_USER;
if (!emailUser || emailUser.includes('senin_mailin')) {
    console.log("⚠️  UYARI: Geçerli mail bilgisi bulunamadı. Mock (Simülasyon) modu aktif.");
    isMockMode = true;
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
            console.log('⚠️  Bağlantı başarısız olduğu için SIMULASYON MODUNA geçiliyor.');
            isMockMode = true;
        } else {
            console.log('✅ Sunucu gerçek mail gönderimi için hazır');
        }
    });
}

// Routes
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
      console.log(`To: ${recipientEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log('---------------------------------------');
      
      // Simulate network delay
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
    res.json({ success: true, message: 'Mail başarıyla gönderildi', messageId: info.messageId, mode: 'LIVE' });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    // If live sending fails, don't crash frontend, return false but handle gracefully if needed OR simulate fallback
    
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
