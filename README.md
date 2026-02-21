<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Kırbaş Doküman Platformu

## Kurulum ve Çalıştırma

**Gereksinimler:**  Node.js v14+

1. Bağımlılıkları yükleyin:
   `npm install`

2. Ortam Değişkenlerini Ayarlayın (.env dosyası):
   Aşağıdaki değişkenleri `.env` dosyasına ekleyin. Eğer dosya yoksa oluşturun.

   ```env
   # Email Gönderimi İçin (Gmail Örneği)
   EMAIL_USER=sizin_email@gmail.com
   EMAIL_PASS=uygulama_sifresi_buraya # Google App Password kullanın
   
   # Veritabanı (Opsiyonel - Postgres/Mongo)
   # DATABASE_URL=...
   
   # JWT Güvenlik
   JWT_SECRET=gizli_anahtar_buraya
   ```

   > **Not:** Gmail kullanıyorsanız, normal şifreniz çalışmaz. Google Hesabı > Güvenlik > Uygulama Şifreleri bölümünden bir şifre oluşturmalısınız.
   > Eğer bu bilgiler girilmezse sistem **Simülasyon Modunda** çalışır (Loglara yazar ama mail atmaz).

3. Uygulamayı başlatın:
   `npm run dev`

## Özellikler
- Dinamik Doküman Şablonları (İSG, İK, Muhasebe vb.)
- PDF Oluşturma ve İndirme
- E-posta ile Paylaşım
- Mobil Uyumlu Arayüz
- Admin Paneli
