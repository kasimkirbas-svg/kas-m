# ISG Zeyron Canliya Gecis ve Teslim Raporu

Tarih: 25 Temmuz 2026

## 1. Mevcut Durum

- Uygulama React 19 ve Vite ile uretilen bir web istemcisidir.
- Kimlik dogrulama, PostgreSQL verisi ve dokuman depolama Supabase uzerindedir.
- Uretim ortami icin yalnizca Vercel SPA yonlendirme ayari vardir; uygulamaya ait sunucu API'si bulunmamaktadir.
- Telefon numarasi kayit ve profil alanlarinda tutulmaktadir. SMS OTP, iki adimli dogrulama ve bildirim SMS'i henuz yoktur.
- Abonelik tablosu vardir ancak odeme oturumu, islem kaydi, iade ve webhook altyapisi yoktur. Odeme ekrani bilincli olarak pasiftir.
- Odeme veya SMS gizli anahtarlarini guvenle kullanacak bir backend katmani bulunmamaktadir.

Sonuc: Mevcut haliyle uygulama statik olarak yayinlanabilir; ancak guvenli tahsilat ve SMS dogrulamasi tamamlanmadan ticari canli kullanima hazir degildir.

## 2. Onerilen Hedef Mimari

Ilk canli surumde Supabase korunmalidir. Bu secenek veri ve kimlik dogrulama tasimasindan kaynaklanan kesinti riskini azaltir. Kendi Ubuntu VPS'imiz su bilesenleri calistirir:

1. Nginx: `isgzeyron.com` ve `www.isgzeyron.com` icin HTTPS, guvenlik basliklari ve ters vekil.
2. Web uygulamasi: Vite uretim ciktisi.
3. Backend API: kullanici oturumunu Supabase JWT ile dogrulayan Node.js servisi.
4. iyzico: odeme baslatma, sonuc sorgulama, webhook dogrulama, iptal/iade islemleri.
5. SMS saglayicisi: uyelik OTP'si, giris 2FA'si ve islemsel bildirimler.
6. Supabase: ilk fazda Auth, PostgreSQL ve Storage.

Gizli iyzico, SMS ve Supabase service-role anahtarlari sadece backend ortaminda tutulur. Tarayiciya yalnizca `VITE_SUPABASE_URL`, anon key ve herkese acik API adresi verilir.

## 3. Domain ve Sunucu Gecisi

### Sunucu on kosullari

- Ubuntu 24.04 LTS, en az 2 vCPU, 4 GB RAM ve 40 GB SSD
- SSH anahtariyla erisim; parola ile root girisi kapali
- Docker Engine ve Docker Compose
- UFW: yalnizca `22`, `80` ve `443`; SSH mumkunse sabit yonetici IP'siyle sinirli
- Otomatik guvenlik guncellemeleri, fail2ban, saat senkronizasyonu
- Gunluk yapilandirma/yedek kontrolu ve dis izleme

### DNS

- `A` kaydi: `isgzeyron.com` -> VPS IPv4 adresi
- `A` kaydi: `www.isgzeyron.com` -> VPS IPv4 adresi veya ana domaine `CNAME`
- IPv6 gercekten yapilandirilmadiysa `AAAA` kaydi eklenmemeli
- Gecis gununden 24 saat once TTL `300` saniyeye dusurulmeli
- E-posta gonderimi icin saglayicinin SPF, DKIM ve DMARC kayitlari eklenmeli

### HTTPS ve yonlendirme

- Let's Encrypt sertifikasi otomatik yenilenir.
- HTTP, HTTPS'e; `www` ise tek secilen ana domaine 301 ile yonlendirilir.
- SPA rotalari Nginx tarafinda `index.html` dosyasina duser.
- `/api/` istekleri yalnizca dahili backend konteynerine aktarilir.
- HSTS ancak HTTPS ve alt domainler dogrulandiktan sonra etkinlestirilir.

Supabase panelinde Site URL `https://isgzeyron.com` yapilmali; e-posta dogrulama ve sifre sifirlama izinli yonlendirmelerine ayni domain eklenmelidir.

## 4. Odeme Entegrasyonu: iyzico

Odeme plani istemciden gelen fiyatla olusturulmaz. Backend, istemciden yalnizca `MONTHLY` veya `YEARLY` plan kodu alir ve tutari sunucu tarafindaki katalogdan belirler.

### Gerekli akis

1. Kullanici oturumu backend tarafinda dogrulanir.
2. Backend benzersiz siparis ve odeme girisimi olusturur.
3. iyzico Checkout Form/3D Secure oturumu backend tarafinda acilir.
4. Kullanici iyzico odeme ekranina yonlendirilir veya guvenli formu acar.
5. Donus sayfasi tek basina basari sayilmaz. Backend sonucu iyzico API'sinden ve imzali bildirimden dogrular.
6. Ayni bildirim tekrar gelse bile abonelik yalnizca bir kez etkinlestirilir (idempotency).
7. Basarili odemeden sonra `subscriptions` guncellenir ve odeme kaydi degistirilemez denetim iziyle saklanir.
8. Basarisiz, iptal ve iade durumlari abonelige dogru yansitilir.

### Veritabani ekleri

- `payment_transactions`: kullanici, plan, tutar, para birimi, siparis no, saglayici referansi, durum, hata, zamanlar
- `payment_webhook_events`: olay kimligi, dogrulama durumu, islenme zamani; tekrar islemeyi engellemek icin benzersiz olay/referans
- `subscriptions`: baslangic, donem sonu, iptal zamani ve saglayici musteri/abonelik referansi
- Tutarlar ondalikli kayan sayi yerine kurus cinsinden tamsayi tutulmali

Kart numarasi, CVV veya tam kart verisi uygulama veritabanina ve loglara alinmaz. Uretim anahtarlari yalnizca iyzico canli hesap onayi tamamlandiktan sonra sunucuya eklenir.

## 5. Telefon ve SMS

Uc islev hedeflenmektedir: kayitta SMS dogrulama, giriste SMS 2FA ve odeme/abonelik bildirimleri.

### Guvenli OTP kurallari

- Numara E.164 biciminde saklanir: `+905XXXXXXXXX`.
- Kod en az 6 haneli, tek kullanimlik ve en fazla 3-5 dakika gecerlidir.
- Veritabaninda acik OTP degil, hash'i saklanir.
- Kullanici, telefon, IP ve cihaz bazli hiz siniri uygulanir.
- Kod deneme sayisi sinirlanir; yeniden gonderme bekleme suresi vardir.
- Telefon degisikligi yeni numaranin tekrar dogrulanmasini gerektirir.
- SMS 2FA icin kurtarma kodlari veya yonetici destek proseduru olmalidir.

### Kayit ve giris akisi

1. Kayit formu tamamlanir ve e-posta dogrulanir.
2. Telefon OTP'si gonderilir; basariyla girilince `phone_verified_at` yazilir.
3. 2FA etkin kullanicida parola dogrulandiktan sonra kisitli bir oturum/acilis belirteci uretilir.
4. OTP dogrulanmadan tam uygulama oturumu verilmez.
5. Odeme basarisi, yenileme, iptal ve odeme hatasi SMS'leri kuyruk uzerinden gonderilir; odeme webhook yaniti SMS beklemez.

SMS saglayicisi secilmeden canli kod tamamlanamaz. Saglayicinin kurumsal hesabi, baslik onayi, API bilgileri ve IYS/KVKK kapsami teslim on kosuludur.

## 6. Supabase'i Kendi Sunucuya Tasima Karari

### Ilk teslim icin karar: Supabase devam etsin

Avantajlari: daha hizli canliya gecis, daha az veri kaybi riski, mevcut Auth/RLS/Storage kodunun korunmasi ve kolay geri donus.

Dezavantajlari: dis servis bagimliligi ve Supabase kullanim maliyeti devam eder.

### Sonraki fazda tam tasima

Tam tasima istenirse PostgreSQL, kimlik dogrulama, nesne depolama, e-posta ve yedekleme ayri bir proje olarak ele alinmalidir. Supabase Auth kullanici sifrelerinin baska bir auth sistemine dogrudan tasinabilir oldugu varsayilmamalidir. Gecis; bakim penceresi, son veri senkronizasyonu, dosya checksum kontrolu, kullanici oturumu/sifre stratejisi ve geri donus plani gerektirir.

## 7. Uygulama Guvenligi ve Operasyon

- Yerel hesap/parola fallback'i uretim derlemesinde tamamen kapatilmali; Supabase ayarsizsa uygulama acik bir yapilandirma hatasi vermelidir.
- Vite yapilandirmasindaki Gemini anahtari tarayici paketine aktarilmamali. Kullanilmiyorsa kaldirilmali; kullanilacaksa backend'e tasinmalidir.
- Admin islemlerinin kritik bolumu yalnizca istemci kontrolune birakilmamali; service-role kullanan backend ve yetki dogrulamasi eklenmelidir.
- CORS yalnizca `https://isgzeyron.com` icin acilmali.
- Rate limit, istek boyutu siniri, guvenli HTTP basliklari ve yapilandirilmis loglama eklenmeli.
- Sentry DSN ve surum bilgisi uretimde tanimlanmali; odeme/SMS sirlarini ve kisisel verileri loglamamalidir.
- Supabase veritabani yedekleri ve dokuman depolama geri yukleme testi yapilmalidir.
- KVKK aydinlatma metni, acik riza gereksinimleri, mesafeli satis/on bilgilendirme, iptal-iade ve gizlilik metinleri hukuk kontrolunden gecmelidir.

## 8. Uygulama Sirasi

1. VPS ve SSH bilgileri teslim edilir; sunucu sertlestirilir.
2. Staging alt domaini acilir: `staging.isgzeyron.com`.
3. Docker, Nginx, backend saglik kontrolu ve CI/CD kurulur.
4. Supabase canli proje ayarlari, RLS ve yedekler dogrulanir.
5. iyzico sandbox entegrasyonu ve odeme veritabani migrasyonu tamamlanir.
6. SMS saglayicisi secilip sandbox/test entegrasyonu tamamlanir.
7. Uctan uca staging testleri ve guvenlik kontrolleri yapilir.
8. DNS canli sunucuya alinir; iyzico canli anahtarlari ve webhook adresi etkinlestirilir.
9. Izleme altinda dusuk tutarli gercek odeme, iade, SMS ve e-posta testi yapilir.
10. Kabul tutanagi, yonetici erisimleri, yedek ve geri donus proseduru teslim edilir.

## 9. Canliya Gecis Kabul Testleri

- Yeni bireysel ve OSGB kaydi, e-posta dogrulama, sifre sifirlama
- Telefon OTP: dogru/yanlis/suresi dolmus kod, yeniden gonderme ve hiz siniri
- SMS 2FA: normal giris, kurtarma ve telefon degisikligi
- Aylik/yillik odeme: basari, reddedilme, kullanici iptali, cift tiklama
- Geciken ve yinelenen webhook; aboneligin sadece bir kez etkinlesmesi
- Iade ve iptalin abonelik, kota, fatura gecmisi ve bildirimlere yansimasi
- Yetkisiz kullanicinin premium indirme ve admin API'lerine erisememesi
- Mobil/masaustu temel akislar, yenileme ve dogrudan URL acma
- VPS yeniden baslatma sonrasi otomatik acilis, HTTPS yenileme ve yedekten geri yukleme

## 10. Devam Etmek Icin Gerekenler

- VPS genel IP adresi, SSH kullanici adi ve SSH anahtar erisimi
- DNS'in yonetildigi firma/panel bilgisi ve kayit degistirme yetkisi
- iyzico sandbox API key, secret key ve merchant bilgileri (sohbetten gonderilmemeli; dogrudan sunucu secret/env alanina girilmeli)
- SMS saglayicisi secimi, onayli gonderici basligi ve API bilgileri
- Supabase canli proje URL'si, anon key; backend icin service-role key (yalnizca sunucuda)
- Uretim e-posta saglayicisi ve dogrulanmis gonderici domaini
- Firma unvani, vergi bilgileri, destek telefonu/e-postasi ve hukuk metinleri
- Aylik/yillik kesin fiyatlar, KDV dahil/haric durumu, iptal-iade ve kota kurallari

Bu girdiler olmadan domainin gercek DNS gecisi, canli tahsilat ve gercek SMS gonderimi tamamlanamaz. Anahtarlar kaynak koda veya Git deposuna yazilmamalidir.