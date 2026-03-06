const fs = require('fs');

const dbPath = 'server/db.json';
const db = JSON.parse(fs.readFileSync(dbPath));
if (!db.templates.find(t => t.id === 'cv-101')) {
  db.templates.unshift({
    id: "cv-101",
    title: "CV Oluşturma",
    category: "İK",
    description: "Profesyonel bir formatta özgeçmiş (CV) oluşturma.",
    isPremium: false,
    fields: [
       { key: "fullName", label: "Ad Soyad", type: "text", required: true, placeholder: "Örn: Musa Kırbaş" },
       { key: "personalInfo", label: "Kişisel Bilgiler", type: "text", placeholder: "Örn: 10.01.1982 - Evli, 4 Çocuk" },
       { key: "address", label: "Adres", type: "textarea", required: true },
       { key: "phone", label: "Telefon", type: "text", required: true },
       { key: "email", label: "Mail", type: "email" },
       { key: "profile", label: "Profil / Hakkımda", type: "textarea", placeholder: "Kendinizi kısaca tanıtın..." },
       { key: "fieldExperience", label: "Saha ve Operasyon Deneyimi", type: "textarea" },
       { key: "coordExperience", label: "Koordinatörlük ve Organizasyon Görevleri", type: "textarea" },
       { key: "education", label: "Eğitim", type: "text", placeholder: "Örn: Lise Mezunu" },
       { key: "certificates", label: "Sertifika ve Belgeler", type: "textarea" },
       { key: "skills", label: "Yetkinlikler", type: "textarea" },
       { key: "workExperience", label: "İş Deneyimi", type: "textarea" }
    ],
    content: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #333;">
  <h1 style="text-align: center; color: #2C3E50; margin-bottom: 5px;">{{fullName}}</h1>
  <p style="text-align: center; margin-top: 0; color: #7F8C8D;">{{personalInfo}}</p>
  
  <div style="text-align: center; margin-bottom: 20px; font-size: 0.9em;">
    <p style="margin: 2px 0;"><strong>Adres:</strong> {{address}}</p>
    <p style="margin: 2px 0;"><strong>Telefon:</strong> {{phone}} | <strong>Mail:</strong> {{email}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">PROFİL</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{profile}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">SAHA VE OPERASYON DENEYİMİ</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{fieldExperience}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">KOORDİNATÖRLÜK VE ORGANİZASYON GÖREVLERİ</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{coordExperience}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">EĞİTİM</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{education}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">SERTİFİKA VE BELGELER</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{certificates}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">YETKİNLİKLER</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{skills}}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="border-bottom: 2px solid #2980B9; color: #2980B9; padding-bottom: 5px; margin-bottom: 10px;">İŞ DENEYİMİ</h3>
    <p style="margin: 0; white-space: pre-wrap;">{{workExperience}}</p>
  </div>
</div>`
  });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Template created in db.json');
} else {
  console.log('Template already exists in db.json');
}
