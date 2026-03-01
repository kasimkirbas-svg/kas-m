import { DocumentTemplate, SubscriptionPlan } from './types';

export const APP_NAME = "Kırbaş Doküman";

export const PLANS = [
  {
    id: SubscriptionPlan.STANDART,
    name: "Standart Paket",
    price: "100 TL",
    period: "/ay",
    features: ["Standart Doküman Limiti", "PDF Çıktısı", "Temel Şablonlar"],
    limit: 100,
    color: "slate"
  },
  {
    id: SubscriptionPlan.GOLD,
    name: "Gold Paket",
    price: "175 TL",
    period: "/ay",
    features: ["2 Kat Doküman Limiti", "Tüm Şablonlar", "Öncelikli Destek"],
    limit: 200,
    popular: true,
    color: "amber"
  },
  {
    id: SubscriptionPlan.PREMIUM,
    name: "Premium Paket",
    price: "250 TL",
    period: "/ay",
    features: ["3 Kat Doküman Limiti", "Tüm Premium Şablonlar", "VIP Destek", "Fatura Entegrasyonu"],
    limit: 300,
    color: "indigo"
  }
];

export const EXTRA_PACKAGES = [
    { id: 'pack_10', name: '10 Ek İndirme Hakkı', rights: 10, price: 50 }, 
    { id: 'pack_50', name: '50 Ek İndirme Hakkı', rights: 50, price: 200 }
];

// 25-35 Document templates simulation
export const MOCK_TEMPLATES: DocumentTemplate[] = [
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
  },

  // --- YENİ EKLENEN FABRİKA ŞABLONLARI ---
  {
    id: 'fac-100',
    title: 'Üretim Takip Formu',
    category: 'Üretim',
    description: 'Günlük üretim adetleri ve makine performans takip çizelgesi.',
    isPremium: false,
    monthlyLimit: 100,
    fields: [
       { key: 'productCode', label: 'Ürün Kodu', type: 'text', required: true },
       { key: 'targetQty', label: 'Hedeflenen Adet', type: 'number', required: true },
       { key: 'actualQty', label: 'Gerçekleşen Adet', type: 'number', required: true },
       { key: 'scrap', label: 'Fire Adedi', type: 'number' },
       { key: 'efficiency', label: 'Verimlilik (%)', type: 'number' },
       { key: 'operator', label: 'Hattı Sorumlusu', type: 'text' }
    ]
  },
  {
    id: 'fac-101',
    title: 'Günlük Kalite Raporu',
    category: 'Kalite',
    description: 'Üretilen ürünlerin kalite kontrol sonuçları.',
    isPremium: true,
    photoCapacity: 5,
    fields: [
       { key: 'batchNo', label: 'Parti No', type: 'text', required: true },
       { key: 'sampleSize', label: 'Numune Sayısı', type: 'number', required: true },
       { key: 'defects', label: 'Hatalı Ürün Sayısı', type: 'number' },
       { key: 'visualCheck', label: 'Görsel Kontrol', type: 'select', options: ['Geçti', 'Kaldı', 'Şartlı Kabul'] },
       { key: 'dimensionCheck', label: 'Ölçüsel Kontrol', type: 'select', options: ['Uygun', 'Uygun Değil'] },
       { key: 'inspector', label: 'Kontrol Eden', type: 'text' }
    ]
  },
  {
    id: 'fac-102',
    title: 'Makine Bakım Kartı',
    category: 'Bakım',
    description: 'Makine bazlı periyodik bakım kayıt kartı.',
    isPremium: true,
    fields: [
       { key: 'machine', label: 'Makine Adı/No', type: 'text', required: true },
       { key: 'lastMaintenance', label: 'Son Bakım Tarihi', type: 'date' },
       { key: 'nextMaintenance', label: 'Gelecek Bakım Tarihi', type: 'date', required: true },
       { key: 'technician', label: 'Bakım Yapan Teknisyen', type: 'text' },
       { key: 'partsReplaced', label: 'Değişen Parçalar', type: 'textarea' }
    ]
  },
  {
    id: 'fac-103',
    title: 'Vardiya Teslim Tutanağı',
    category: 'Üretim',
    description: 'Vardiya değişimi sırasında işlerin devri için tutanak.',
    isPremium: false,
    fields: [
       { key: 'shift', label: 'Teslim Eden Vardiya', type: 'select', options: ['08-16', '16-24', '24-08'] },
       { key: 'deliverer', label: 'Teslim Eden', type: 'text', required: true },
       { key: 'receiver', label: 'Teslim Alan', type: 'text', required: true },
       { key: 'notes', label: 'Önemli Notlar / Arızalar', type: 'textarea', required: true },
       { key: 'pendingJobs', label: 'Tamamlanmayan İşler', type: 'textarea' }
    ]
  },
  {
    id: 'fac-104',
    title: 'Hammadde Giriş Formu',
    category: 'Depo',
    description: 'Depoya gelen hammaddelerin kontrol ve kayıt formu.',
    isPremium: false,
    fields: [
       { key: 'supplier', label: 'Tedarikçi Firma', type: 'text', required: true },
       { key: 'material', label: 'Malzeme Adı', type: 'text', required: true },
       { key: 'quantity', label: 'Miktar (Kg/Adet)', type: 'number', required: true },
       { key: 'invoiceNo', label: 'İrsaliye No', type: 'text' },
       { key: 'qualityStatus', label: 'Kalite Onayı', type: 'select', options: ['Onaylandı', 'Reddedildi', 'Karantina'] }
    ]
  },
  {
    id: 'fac-105',
    title: 'Sevkiyat Kontrol Listesi',
    category: 'Lojistik',
    description: 'Ürünlerin sevkiyat öncesi son kontrol listesi.',
    isPremium: true,
    fields: [
       { key: 'customer', label: 'Müşteri', type: 'text', required: true },
       { key: 'orderNo', label: 'Sipariş No', type: 'text' },
       { key: 'truckPlate', label: 'Araç Plaka', type: 'text' },
       { key: 'packagingCheck', label: 'Ambalaj Kontrolü', type: 'checkbox' },
       { key: 'labelCheck', label: 'Etiket Kontrolü', type: 'checkbox' },
       { key: 'quantityCheck', label: 'Miktar Doğrulaması', type: 'checkbox' }
    ]
  },
  {
    id: 'fac-106',
    title: 'Atık Takip Çizelgesi',
    category: 'Çevre',
    description: 'Tehlikeli ve tehlikesiz atıkların çıkış takibi.',
    isPremium: true,
    fields: [
       { key: 'wasteType', label: 'Atık Türü', type: 'select', options: ['Kağıt/Karton', 'Plastik', 'Metal', 'Tehlikeli Atık', 'Kimyasal'] },
       { key: 'quantity', label: 'Miktar (Kg)', type: 'number', required: true },
       { key: 'disposalMethod', label: 'Bertaraf Yöntemi', type: 'select', options: ['Geri Dönüşüm', 'Depolama', 'Yakma'] },
       { key: 'company', label: 'Teslim Alan Firma', type: 'text' }
    ]
  },
  {
    id: 'fac-107',
    title: 'Stok Sayım Raporu',
    category: 'Depo',
    description: 'Depo stoklarının fiziki sayım sonucu.',
    isPremium: false,
    fields: [
       { key: 'date', label: 'Sayım Tarihi', type: 'date', required: true },
       { key: 'warehouse', label: 'Depo Bölümü', type: 'text' },
       { key: 'countedBy', label: 'Sayan Personel', type: 'text', required: true },
       { key: 'variance', label: 'Sayım Farkları', type: 'textarea' },
       { key: 'approval', label: 'Depo Sorumlusu Onayı', type: 'checkbox' }
    ]
  },

  // --- YENİ EKLENEN KURUMSAL ŞABLONLARI ---
  {
    id: 'corp-100',
    title: 'Personel Özlük Dosyası',
    category: 'İK',
    description: 'Yeni personel evrak kontrol listesi.',
    isPremium: true,
    fields: [
       { key: 'employee', label: 'Personel Adı', type: 'text', required: true },
       { key: 'idCopy', label: 'Kimlik Fotokopisi', type: 'checkbox' },
       { key: 'diploma', label: 'Diploma', type: 'checkbox' },
       { key: 'healthReport', label: 'Sağlık Raporu', type: 'checkbox' },
       { key: 'criminalRecord', label: 'Adli Sicil Kaydı', type: 'checkbox' },
       { key: 'photos', label: 'Fotoğraf (4 Adet)', type: 'checkbox' }
    ]
  },
  {
    id: 'corp-101',
    title: 'Yıllık İzin Planı',
    category: 'İK',
    description: 'Departman bazlı yıllık izin planlama çizelgesi.',
    isPremium: false,
    fields: [
       { key: 'department', label: 'Departman', type: 'text', required: true },
       { key: 'year', label: 'Yıl', type: 'number', required: true },
       { key: 'employees', label: 'Personeller', type: 'textarea', placeholder: 'İsim - Tarih Aralığı şeklinde giriniz' },
       { key: 'managerApproval', label: 'Yönetici Onayı', type: 'checkbox' }
    ]
  },
  {
    id: 'corp-102',
    title: 'Toplantı Gündem Tutanağı',
    category: 'Yönetim',
    description: 'Toplantı öncesi belirlenen gündem maddeleri.',
    isPremium: false,
    fields: [
       { key: 'meetingTitle', label: 'Toplantı Başlığı', type: 'text', required: true },
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'agendaItems', label: 'Gündem Maddeleri', type: 'textarea', required: true },
       { key: 'presenter', label: 'Sunumu Yapacak Kişi', type: 'text' }
    ]
  },
  {
    id: 'corp-103',
    title: 'Demirbaş Zimmet Formu',
    category: 'İdari',
    description: 'Şirket eşyalarının personele teslim belgesi.',
    isPremium: false,
    fields: [
       { key: 'staff', label: 'Personel Adı', type: 'text', required: true },
       { key: 'item', label: 'Eşya / Cihaz', type: 'text', required: true },
       { key: 'serial', label: 'Seri No', type: 'text' },
       { key: 'deliveryDate', label: 'Teslim Tarihi', type: 'date', required: true },
       { key: 'condition', label: 'Durum', type: 'text', placeholder: 'Yeni / Kullanılmış' }
    ]
  },
  {
    id: 'corp-104',
    title: 'Performans Değerlendirme',
    category: 'İK',
    description: 'Dönemsel personel yetkinlik değerlendirme.',
    isPremium: true,
    fields: [
       { key: 'employee', label: 'Personel', type: 'text', required: true },
       { key: 'period', label: 'Dönem', type: 'text' },
       { key: 'competency', label: 'Yetkinlik Puanı', type: 'select', options: ['1', '2', '3', '4', '5'] },
       { key: 'goals', label: 'Hedef Tuturma', type: 'select', options: ['1', '2', '3', '4', '5'] },
       { key: 'comments', label: 'Yönetici Yorumu', type: 'textarea' }
    ]
  },
  {
    id: 'corp-105',
    title: 'Eğitim Katılım Formu',
    category: 'Eğitim',
    description: 'Düzenlenen eğitimlere katılan personel listesi.',
    isPremium: false,
    fields: [
       { key: 'trainingTopic', label: 'Eğitim Konusu', type: 'text', required: true },
       { key: 'educator', label: 'Eğitmen', type: 'text' },
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'participants', label: 'Katılımcı Listesi', type: 'textarea', required: true }
    ]
  },
  {
    id: 'corp-106',
    title: 'Görevlendirme Yazısı',
    category: 'İdari',
    description: 'Şehir dışı veya özel görev atama belgesi.',
    isPremium: false,
    fields: [
       { key: 'employee', label: 'Görevli Personel', type: 'text', required: true },
       { key: 'destination', label: 'Gidilecek Yer', type: 'text', required: true },
       { key: 'dates', label: 'Tarih Aralığı', type: 'text', required: true },
       { key: 'taskDescription', label: 'Görev Tanımı', type: 'textarea', required: true },
       { key: 'expenses', label: 'Harcırah / Avans', type: 'number' }
    ]
  },

  // --- YENİ EKLENEN MADEN ŞABLONLARI ---
  {
    id: 'mine-100',
    title: 'Günlük Ocak Raporu',
    category: 'Maden',
    description: 'Maden sahası günlük faaliyet raporu.',
    isPremium: true,
    fields: [
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'location', label: 'Çalışılan Ocak/Damar', type: 'text', required: true },
       { key: 'excavation', label: 'Kazı Miktarı (Ton)', type: 'number' },
       { key: 'waste', label: 'Pasa Miktarı (Ton)', type: 'number' },
       { key: 'weather', label: 'Hava Durumu', type: 'text' }
    ]
  },
  {
    id: 'mine-101',
    title: 'Patlatma Tutanağı',
    category: 'Maden',
    description: 'Dinamit patlatma işlemi kayıt ve güvenlik tutanağı.',
    isPremium: true,
    fields: [
       { key: 'time', label: 'Patlatma Saati', type: 'text', required: true },
       { key: 'explosiveAmount', label: 'Kullanılan Patlayıcı (Kg)', type: 'number', required: true },
       { key: 'holeCount', label: 'Delik Sayısı', type: 'number' },
       { key: 'safetyCheck', label: 'Çevre Güvenliği Alındı mı?', type: 'checkbox' },
       { key: 'responsible', label: 'Ateşleyici Uzman', type: 'text', required: true }
    ]
  },
  {
    id: 'mine-102',
    title: 'Gaz Ölçüm Kayıtları',
    category: 'İSG',
    description: 'Yeraltı/Yerüstü gaz ölçüm değerleri.',
    isPremium: true,
    fields: [
       { key: 'location', label: 'Ölçüm Yeri', type: 'text', required: true },
       { key: 'methane', label: 'Metan (CH4) %', type: 'number' },
       { key: 'oxygen', label: 'Oksijen (O2) %', type: 'number' },
       { key: 'co', label: 'Karbonmonoksit (CO) ppm', type: 'number' },
       { key: 'device', label: 'Ölçüm Cihazı Seri No', type: 'text' }
    ]
  },
  {
    id: 'mine-103',
    title: 'Havalandırma Raporu',
    category: 'Teknik',
    description: 'Maden havalandırma sistemi kontrol raporu.',
    isPremium: true,
    fields: [
       { key: 'fanStatus', label: 'Fan Durumu', type: 'select', options: ['Çalışıyor', 'Arızalı', 'Bakımda'] },
       { key: 'airflow', label: 'Hava Akım Hızı (m/s)', type: 'number', required: true },
       { key: 'temperature', label: 'Sıcaklık (°C)', type: 'number' },
       { key: 'technician', label: 'Ölçümü Yapan', type: 'text' }
    ]
  },
  {
    id: 'mine-104',
    title: 'Tahkimat Kontrol Formu',
    category: 'Güvenlik',
    description: 'Yeraltı tahkimat direkleri ve tavan kontrolü.',
    isPremium: true,
    fields: [
       { key: 'gallery', label: 'Galeri Adı', type: 'text', required: true },
       { key: 'supportType', label: 'Tahkimat Tipi', type: 'text' },
       { key: 'deformation', label: 'Deformasyon Var mı?', type: 'checkbox' },
       { key: 'action', label: 'Alınacak Önlem', type: 'textarea' }
    ]
  },
  {
    id: 'mine-105',
    title: 'Kişisel Koruyucu Zimmet',
    category: 'İSG',
    description: 'Baret, lamba, maske zimmet formu.',
    isPremium: false,
    fields: [
       { key: 'employee', label: 'Personel', type: 'text', required: true },
       { key: 'ppeList', label: 'Teslim Edilen KKD\'ler', type: 'textarea', placeholder: 'Baret, Çizme, Maske...' },
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'signature', label: 'Teslim Alan İmza', type: 'checkbox' }
    ]
  },
  {
    id: 'mine-106',
    title: 'Acil Durum Tatbikatı',
    category: 'İSG',
    description: 'Maden ocağı tahliye ve yangın tatbikat raporu.',
    isPremium: false,
    fields: [
       { key: 'drillType', label: 'Tatbikat Türü', type: 'select', options: ['Yangın', 'Göçük', 'Gaz Sızıntısı'] },
       { key: 'duration', label: 'Tahliye Süresi (Dk)', type: 'number' },
       { key: 'participants', label: 'Katılımcı Sayısı', type: 'number' },
       { key: 'success', label: 'Başarı Durumu', type: 'textarea' }
    ]
  },
  {
    id: 'mine-107',
    title: 'Vardiya Mühendis Raporu',
    category: 'Yönetim',
    description: 'Mühendis vardiya sonu genel değerlendirme.',
    isPremium: true,
    fields: [
       { key: 'shift', label: 'Vardiya', type: 'text' },
       { key: 'engineer', label: 'Mühendis Adı', type: 'text', required: true },
       { key: 'productionSummary', label: 'Üretim Özeti', type: 'textarea' },
       { key: 'safetyIssues', label: 'İSG Olayları', type: 'textarea' }
    ]
  },
  {
    id: 'mine-108',
    title: 'Dinamit Depo Kayıt',
    category: 'Depo',
    description: 'Patlayıcı madde depo giriş-çıkış defteri.',
    isPremium: true,
    fields: [
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'incoming', label: 'Gelen Miktar', type: 'number' },
       { key: 'outgoing', label: 'Çıkan Miktar', type: 'number' },
       { key: 'balance', label: 'Kalan Miktar', type: 'number', required: true },
       { key: 'officer', label: 'Depo Sorumlusu', type: 'text' }
    ]
  },
  {
    id: 'mine-109',
    title: 'Nakliye Sefer Fişi',
    category: 'Lojistik',
    description: 'Maden cevheri nakliye kamyonu takip fişi.',
    isPremium: false,
    fields: [
       { key: 'truck', label: 'Kamyon Plaka', type: 'text', required: true },
       { key: 'driver', label: 'Şoför', type: 'text' },
       { key: 'tonnage', label: 'Tonaj (Kant)', type: 'number', required: true },
       { key: 'destination', label: 'Döküm Yeri', type: 'text' },
       { key: 'time', label: 'Sefer Saati', type: 'text' }
    ]
  },

  // --- YENİ EKLENEN İNŞAAT ŞABLONLARI ---
  {
    id: 'cons-100',
    title: 'Şantiye Günlük Defteri',
    category: 'İnşaat',
    description: 'Resmi şantiye günlüğü sayfası.',
    isPremium: true,
    fields: [
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'weather', label: 'Hava Durumu', type: 'text' },
       { key: 'temp', label: 'Sıcaklık', type: 'text' },
       { key: 'personnel', label: 'Çalışan Personel Dökümü', type: 'textarea' },
       { key: 'machinery', label: 'Çalışan Makineler', type: 'textarea' },
       { key: 'workDone', label: 'Yapılan İmalatlar', type: 'textarea' }
    ]
  },
  {
    id: 'cons-101',
    title: 'İş İskelesi Kontrol',
    category: 'İSG',
    description: 'İskele kurulumu ve güvenliği kontrol formu.',
    isPremium: true,
    fields: [
       { key: 'scaffoldId', label: 'İskele Etiket No', type: 'text', required: true },
       { key: 'baseCheck', label: 'Taban Plakaları Sağlam mı?', type: 'checkbox' },
       { key: 'guardRail', label: 'Korkuluklar Tam mı?', type: 'checkbox' },
       { key: 'anchorage', label: 'Ankraj Bağlantıları Yapıldı mı?', type: 'checkbox' },
       { key: 'inspector', label: 'Kontrol Eden', type: 'text', required: true }
    ]
  },
  {
    id: 'cons-102',
    title: 'Beton Döküm Tutanağı',
    category: 'Kalite',
    description: 'Beton dökümü sırası ve numune alma tutanağı.',
    isPremium: false,
    fields: [
       { key: 'location', label: 'Döküm Yeri (Blok/Kat)', type: 'text', required: true },
       { key: 'concreteClass', label: 'Beton Sınıfı', type: 'text', required: true },
       { key: 'volume', label: 'Miktar (m3)', type: 'number' },
       { key: 'slump', label: 'Slump Değeri', type: 'text' },
       { key: 'sampleTaken', label: 'Numune Alındı mı?', type: 'checkbox' }
    ]
  },
  {
    id: 'cons-103',
    title: 'Hakediş İcmal Tablosu',
    category: 'Finans',
    description: 'Genel hakediş özeti ve kesintiler tablosu.',
    isPremium: true,
    fields: [
       { key: 'period', label: 'Hakediş No / Dönem', type: 'text', required: true },
       { key: 'grossAmount', label: 'Toplam Hakediş Tutarı', type: 'number', required: true },
       { key: 'advanceDed', label: 'Avans Kesintisi', type: 'number' },
       { key: 'guaranteeDed', label: 'Teminat Kesintisi', type: 'number' },
       { key: 'netPayable', label: 'Ödenecek Net Tutar', type: 'number', required: true }
    ]
  },
  {
    id: 'cons-104',
    title: 'Taşeron Sözleşme Eki',
    category: 'Hukuk',
    description: 'Alt yüklenici ek sözleşme maddeleri.',
    isPremium: false,
    fields: [
       { key: 'subcontractor', label: 'Taşeron Firma', type: 'text', required: true },
       { key: 'workScope', label: 'Ek İşin Tanımı', type: 'textarea', required: true },
       { key: 'price', label: 'Birim Fiyat / Tutar', type: 'number' },
       { key: 'duration', label: 'Ek Süre (Gün)', type: 'number' }
    ]
  },
  {
    id: 'cons-105',
    title: 'Malzeme Talep Fişi',
    category: 'Depo',
    description: 'Şantiye deposundan malzeme istek formu.',
    isPremium: false,
    fields: [
       { key: 'requestor', label: 'Talep Eden Usta/Formen', type: 'text', required: true },
       { key: 'material', label: 'Malzeme Cinsi', type: 'text', required: true },
       { key: 'quantity', label: 'Miktar', type: 'number', required: true },
       { key: 'urgency', label: 'Aciliyet', type: 'select', options: ['Hemen', 'Bugün', 'Yarın'] }
    ]
  },
  {
    id: 'cons-106',
    title: 'Elektrik Tesisat Kontrol',
    category: 'Mekanik',
    description: 'Geçici şantiye elektriği pano kontrolü.',
    isPremium: true,
    fields: [
       { key: 'panelLoc', label: 'Pano Konumu', type: 'text', required: true },
       { key: 'kakrCheck', label: 'Kaçak Akım Rölesi Testi', type: 'checkbox' },
       { key: 'cablesCheck', label: 'Kablolarda Hasar Var mı?', type: 'checkbox' },
       { key: 'grounding', label: 'Topraklama Mevcut mu?', type: 'checkbox' }
    ]
  },
  {
    id: 'cons-107',
    title: 'Vinç Periyodik Kontrol',
    category: 'Makine',
    description: 'Kule vinç günlük operatör kontrol listesi.',
    isPremium: true,
    fields: [
       { key: 'craneId', label: 'Vinç No', type: 'text' },
       { key: 'ropes', label: 'Halat Kontrolü', type: 'select', options: ['Sağlam', 'Yıpranmış'] },
       { key: 'brakes', label: 'Fren Testi', type: 'select', options: ['Başarılı', 'Başarısız'] },
       { key: 'limitSwitches', label: 'Switch Kontrolü', type: 'checkbox' }
    ]
  },
  {
    id: 'cons-108',
    title: 'İSG Kurul Tutanağı',
    category: 'İSG',
    description: 'Aylık şantiye İSG kurulu toplantı kararları.',
    isPremium: false,
    fields: [
       { key: 'date', label: 'Toplantı Tarihi', type: 'date', required: true },
       { key: 'attendees', label: 'Kurul Üyeleri', type: 'textarea' },
       { key: 'accidents', label: 'Geçen Ayki Kazalar', type: 'textarea' },
       { key: 'decisions', label: 'Alınan Önlemler', type: 'textarea', required: true }
    ]
  },
  {
    id: 'cons-109',
    title: 'Kazı İzni Formu',
    category: 'İSG',
    description: 'Derin kazı çalışmaları için izin belgesi.',
    isPremium: true,
    fields: [
       { key: 'area', label: 'Kazı Alanı', type: 'text', required: true },
       { key: 'depth', label: 'Kazı Derinliği (m)', type: 'number' },
       { key: 'shoring', label: 'İksa Yapıldı mı?', type: 'checkbox' },
       { key: 'utilityCheck', label: 'Altyapı Kontrolü (Elektrik/Su/Gaz)', type: 'checkbox' },
       { key: 'supervisor', label: 'İzni Veren Yetkili', type: 'text' }
    ]
  },

  // --- YENİ EKLENEN ENERJİ ŞABLONLARI ---
  {
    id: 'eng-100',
    title: 'Trafo Bakım Formu',
    category: 'Enerji',
    description: 'Yüksek gerilim trafosu bakım föyü.',
    isPremium: true,
    fields: [
       { key: 'trafoId', label: 'Trafo Kodu', type: 'text', required: true },
       { key: 'oilTemp', label: 'Yağ Sıcaklığı', type: 'number' },
       { key: 'pressure', label: 'Basınç Değeri', type: 'number' },
       { key: 'silicaGel', label: 'Silikajel Rengi', type: 'text' },
       { key: 'bushings', label: 'Buşing Temizliği', type: 'checkbox' }
    ]
  },
  {
    id: 'eng-101',
    title: 'Sayaç Okuma Listesi',
    category: 'Enerji',
    description: 'Aylık elektrik sayaç endeks takibi.',
    isPremium: false,
    fields: [
       { key: 'date', label: 'Okuma Tarihi', type: 'date' },
       { key: 'meterId', label: 'Sayaç Seri No', type: 'text' },
       { key: 't1', label: 'T1 Endeksi (Gündüz)', type: 'number' },
       { key: 't2', label: 'T2 Endeksi (Puant)', type: 'number' },
       { key: 't3', label: 'T3 Endeksi (Gece)', type: 'number' }
    ]
  },
  {
    id: 'eng-102',
    title: 'Kesinti Bildirim Formu',
    category: 'Enerji',
    description: 'Planlı veya plansız elektrik kesintisi duyurusu.',
    isPremium: false,
    fields: [
       { key: 'region', label: 'Etkilenen Bölge', type: 'text', required: true },
       { key: 'startTime', label: 'Başlangıç', type: 'datetime-local', required: true },
       { key: 'endTime', label: 'Bitiş (Tahmini)', type: 'datetime-local', required: true },
       { key: 'reason', label: 'Kesinti Sebebi', type: 'textarea' }
    ]
  },
  {
    id: 'eng-103',
    title: 'İletim Hattı Kontrol',
    category: 'Enerji',
    description: 'Elektrik nakil hattı fiziki kontrol raporu.',
    isPremium: true,
    fields: [
       { key: 'lineId', label: 'Hat Kodu', type: 'text' },
       { key: 'pylon', label: 'Direk No', type: 'text' },
       { key: 'insulators', label: 'İzolatör Durumu', type: 'text' },
       { key: 'sag', label: 'Sehim Kontrolü', type: 'select', options: ['Normal', 'Sarkma Var'] },
       { key: 'vegetation', label: 'Ağaç/Bitki Teması', type: 'checkbox' }
    ]
  },
  {
    id: 'eng-104',
    title: 'Termal Kamera Raporu',
    category: 'Bakım',
    description: 'Pano ve bağlantı noktaları ısınma kontrolü.',
    isPremium: true,
    fields: [
       { key: 'equipment', label: 'Ölçülen Ekipman', type: 'text', required: true },
       { key: 'maxTemp', label: 'Maksimum Sıcaklık (°C)', type: 'number', required: true },
       { key: 'refTemp', label: 'Referans Sıcaklık', type: 'number' },
       { key: 'deltaT', label: 'Sıcaklık Farkı', type: 'number' },
       { key: 'result', label: 'Sonuç', type: 'select', options: ['Normal', 'Riskli', 'Kritik'] }
    ]
  },
  {
    id: 'eng-105',
    title: 'Topraklama Ölçüm Raporu',
    category: 'Teknik',
    description: 'Yıllık topraklama direnci ölçüm tutanağı.',
    isPremium: true,
    fields: [
       { key: 'point', label: 'Ölçüm Noktası', type: 'text', required: true },
       { key: 'measuredValue', label: 'Ölçülen Değer (Ohm)', type: 'number', required: true },
       { key: 'limitValue', label: 'Sınır Değer', type: 'number' },
       { key: 'result', label: 'Uygunluk', type: 'select', options: ['Uygun', 'Uygun Değil'] },
       { key: 'device', label: 'Kullanılan Meger', type: 'text' }
    ]
  },
  {
    id: 'eng-106',
    title: 'Jeneratör Test Formu',
    category: 'Enerji',
    description: 'Jeneratör yük testi ve bakım formu.',
    isPremium: false,
    fields: [
       { key: 'genSet', label: 'Jeneratör', type: 'text' },
       { key: 'fuel', label: 'Yakıt Seviyesi (%)', type: 'number' },
       { key: 'battery', label: 'Akü Voltajı', type: 'number' },
       { key: 'runTime', label: 'Çalışma Süresi (Dk)', type: 'number' },
       { key: 'loadTest', label: 'Yükte Çalıştı mı?', type: 'checkbox' }
    ]
  },
  {
    id: 'eng-107',
    title: 'Panel Temizlik Kaydı',
    category: 'Bakım',
    description: 'Güneş paneli yıkama ve temizlik formu.',
    isPremium: false,
    fields: [
       { key: 'zone', label: 'Saha/Zone', type: 'text' },
       { key: 'method', label: 'Temizlik Yöntemi', type: 'select', options: ['Su+Fırça', 'Robot', 'Sadece Su'] },
       { key: 'team', label: 'Temizlik Ekibi', type: 'text' },
       { key: 'damage', label: 'Kırık Panel Tespiti', type: 'number' }
    ]
  },
  {
    id: 'eng-108',
    title: 'Yüksek Gerilim İzni',
    category: 'İSG',
    description: 'EKAT çalışma izin formu.',
    isPremium: true,
    fields: [
       { key: 'location', label: 'Çalışma Yeri', type: 'text', required: true },
       { key: 'ekatPerson', label: 'EKAT Belgesi Olan Personel', type: 'text', required: true },
       { key: 'energyCut', label: 'Enerji Kesildi mi?', type: 'checkbox' },
       { key: 'groundingDone', label: 'Mahalli Topraklama Yapıldı mı?', type: 'checkbox' },
       { key: 'supervisorSig', label: 'Sorumlu Mühendis Onayı', type: 'checkbox' }
    ]
  },
  {
    id: 'eng-109',
    title: 'Arıza Müdahale Raporu',
    category: 'Teknik',
    description: 'Elektrik arızalarına müdahale sonuç raporu.',
    isPremium: false,
    fields: [
       { key: 'faultTime', label: 'Arıza Bildirim Saati', type: 'text' },
       { key: 'interventionTime', label: 'Müdahale Saati', type: 'text' },
       { key: 'fixTime', label: 'Tamamlanma Saati', type: 'text' },
       { key: 'rootCause', label: 'Kök Neden', type: 'textarea' },
       { key: 'solution', label: 'Yapılan İşlem', type: 'textarea' }
    ]
  },

  // --- YENİ EKLENEN KİMYA ŞABLONLARI ---
  {
    id: 'chem-100',
    title: 'Laboratuvar Analiz Raporu',
    category: 'Kimya',
    description: 'Kimyasal analiz sonuç formu.',
    isPremium: true,
    fields: [
       { key: 'sampleId', label: 'Numune Kodu', type: 'text', required: true },
       { key: 'testType', label: 'Analiz Türü', type: 'text' },
       { key: 'ph', label: 'pH Değeri', type: 'number' },
       { key: 'viscosity', label: 'Viskozite', type: 'number' },
       { key: 'density', label: 'Yoğunluk', type: 'number' },
       { key: 'result', label: 'Analiz Sonucu', type: 'textarea' }
    ]
  },
  {
    id: 'chem-101',
    title: 'Kimyasal Stok Takip',
    category: 'Depo',
    description: 'Kimyasal madde envanter listesi.',
    isPremium: false,
    fields: [
       { key: 'chemicalName', label: 'Kimyasal Adı (IUPAC)', type: 'text', required: true },
       { key: 'casNo', label: 'CAS No', type: 'text' },
       { key: 'amount', label: 'Miktar (Kg/L)', type: 'number' },
       { key: 'expiry', label: 'Son Kullanma Tarihi', type: 'date' },
       { key: 'storageCondition', label: 'Saklama Koşulu', type: 'text' }
    ]
  },
  {
    id: 'chem-102',
    title: 'MSDS Kontrol Formu',
    category: 'İSG',
    description: 'Malzeme güvenlik bilgi formu kontrolü.',
    isPremium: true,
    fields: [
       { key: 'product', label: 'Ürün Adı', type: 'text' },
       { key: 'msdsDate', label: 'MSDS Tarihi', type: 'date' },
       { key: 'language', label: 'Dil (TR olmalı)', type: 'checkbox' },
       { key: 'hazardClass', label: 'Tehlike Sınıfı', type: 'text' },
       { key: 'availableInField', label: 'Sahada Mevcut mu?', type: 'checkbox' }
    ]
  },
  {
    id: 'chem-103',
    title: 'Atık Bertaraf Kaydı',
    category: 'Çevre',
    description: 'Kimyasal atıkların gönderim kaydı.',
    isPremium: true,
    fields: [
       { key: 'wasteCode', label: 'Atık Kodu', type: 'text', required: true },
       { key: 'volume', label: 'Miktar', type: 'number' },
       { key: 'transporter', label: 'Taşıyıcı Firma Lisans No', type: 'text' },
       { key: 'facility', label: 'Bertaraf Tesisi', type: 'text' }
    ]
  },
  {
    id: 'chem-104',
    title: 'Kalibrasyon Takip Formu',
    category: 'Laboratuvar',
    description: 'Laboratuvar cihazları kalibrasyon takibi.',
    isPremium: true,
    fields: [
       { key: 'device', label: 'Cihaz Adı', type: 'text', required: true },
       { key: 'serial', label: 'Seri No', type: 'text' },
       { key: 'calibDate', label: 'Kalibrasyon Tarihi', type: 'date' },
       { key: 'nextCalib', label: 'Gelecek Kalibrasyon', type: 'date', required: true },
       { key: 'status', label: 'Durum', type: 'select', options: ['Geçerli', 'Süresi Dolmuş'] }
    ]
  },
  {
    id: 'chem-105',
    title: 'Soğutma Suyu Analizi',
    category: 'Kimya',
    description: 'Kule suyu kimyasal değerleri.',
    isPremium: false,
    fields: [
       { key: 'conductivity', label: 'İletkenlik', type: 'number' },
       { key: 'hardness', label: 'Sertlik', type: 'number' },
       { key: 'chlorine', label: 'Klor Miktarı', type: 'number' },
       { key: 'inhibitor', label: 'İnhibitör Seviyesi', type: 'number' }
    ]
  },
  {
    id: 'chem-106',
    title: 'Reaktör Temizlik Formu',
    category: 'Üretim',
    description: 'Kimyasal reaktör yıkama onay formu.',
    isPremium: true,
    fields: [
       { key: 'reactorId', label: 'Reaktör No', type: 'text', required: true },
       { key: 'previousProduct', label: 'Önceki Ürün', type: 'text' },
       { key: 'cleaningAgent', label: 'Kullanılan Kimyasal', type: 'text' },
       { key: 'phCheck', label: 'Son Durulama pH', type: 'number' },
       { key: 'approval', label: 'Temizliği Onaylayan', type: 'text' }
    ]
  },
  {
    id: 'chem-107',
    title: 'Numune Etiketleme',
    category: 'Laboratuvar',
    description: 'Numune şişesi etiketi şablonu.',
    isPremium: false,
    fields: [
       { key: 'sampleName', label: 'Numune Adı', type: 'text', required: true },
       { key: 'date', label: 'Alınış Tarihi/Saati', type: 'datetime-local' },
       { key: 'source', label: 'Kaynağı', type: 'text' },
       { key: 'sampler', label: 'Numuneyi Alan', type: 'text' }
    ]
  },
  {
    id: 'chem-108',
    title: 'Biyolojik Risk Analizi',
    category: 'İSG',
    description: 'Biyolojik tehlike değerlendirme formu.',
    isPremium: true,
    fields: [
       { key: 'agent', label: 'Biyolojik Ajan', type: 'text' },
       { key: 'riskGroup', label: 'Risk Grubu (1-4)', type: 'select', options: ['1', '2', '3', '4'] },
       { key: 'exposureRoute', label: 'Maruziyet Yolu', type: 'text' },
       { key: 'precautions', label: 'Alınacak Önlemler', type: 'textarea' }
    ]
  },
  {
    id: 'chem-109',
    title: 'Dökülme Müdahale Planı',
    category: 'İSG',
    description: 'Kimyasal dökülme sonrası rapor.',
    isPremium: true,
    fields: [
       { key: 'chemical', label: 'Dökülen Madde', type: 'text' },
       { key: 'amount', label: 'Tahmini Miktar', type: 'text' },
       { key: 'area', label: 'Etkilenen Alan', type: 'text' },
       { key: 'kitUsed', label: 'Spill Kit Kullanıldı mı?', type: 'checkbox' },
       { key: 'cleanupMethod', label: 'Temizleme Yöntemi', type: 'textarea' }
    ]
  },

  // --- YENİ EKLENEN KÜÇÜK İŞLETME ŞABLONLARI ---
  {
    id: 'smb-100',
    title: 'Günlük Kasa Raporu',
    category: 'Muhasebe',
    description: 'Gün sonu kasa devir ve ciro özeti.',
    isPremium: false,
    fields: [
       { key: 'date', label: 'Tarih', type: 'date', required: true },
       { key: 'openingBalance', label: 'Devir (Açılış)', type: 'number' },
       { key: 'cashSales', label: 'Nakit Satış', type: 'number' },
       { key: 'cardSales', label: 'Kredi Kartı', type: 'number' },
       { key: 'expenses', label: 'Giderler', type: 'number' },
       { key: 'closingBalance', label: 'Kasa Kalan', type: 'number', required: true }
    ]
  },
  {
    id: 'smb-101',
    title: 'Veresiye Defteri',
    category: 'Muhasebe',
    description: 'Müşteri borç takip sayfası.',
    isPremium: false,
    fields: [
       { key: 'customer', label: 'Müşteri Adı', type: 'text', required: true },
       { key: 'product', label: 'Alınan Ürün', type: 'text' },
       { key: 'debt', label: 'Borç Tutarı', type: 'number', required: true },
       { key: 'paymentDate', label: 'Ödeme Sözü Tarihi', type: 'date' },
       { key: 'phone', label: 'Telefon', type: 'text' }
    ]
  },
  {
    id: 'smb-102',
    title: 'Müşteri Sipariş Formu',
    category: 'Satış',
    description: 'Sipariş detayları ve teslimat bilgileri.',
    isPremium: false,
    fields: [
       { key: 'customer', label: 'Müşteri', type: 'text', required: true },
       { key: 'orderDate', label: 'Sipariş Tarihi', type: 'date' },
       { key: 'items', label: 'Sipariş Listesi', type: 'textarea', required: true },
       { key: 'price', label: 'Toplam Tutar', type: 'number' },
       { key: 'deliveryAddress', label: 'Teslimat Adresi', type: 'textarea' }
    ]
  },
  {
    id: 'smb-103',
    title: 'Fiyat Teklif Şablonu',
    category: 'Satış',
    description: 'Profesyonel fiyat teklifi oluşturma.',
    isPremium: true,
    fields: [
       { key: 'to', label: 'Sayın', type: 'text' },
       { key: 'subject', label: 'Teklif Konusu', type: 'text' },
       { key: 'services', label: 'Hizmet/Ürün Detayı', type: 'textarea' },
       { key: 'total', label: 'Teklif Tutarı', type: 'number' },
       { key: 'validity', label: 'Geçerlilik', type: 'text', placeholder: '7 Gün' }
    ]
  },
  {
    id: 'smb-104',
    title: 'Stok Sayım Listesi',
    category: 'Depo',
    description: 'Mağaza veya depo stok sayım formu.',
    isPremium: false,
    fields: [
       { key: 'group', label: 'Ürün Grubu', type: 'text' },
       { key: 'item', label: 'Ürün Adı', type: 'text' },
       { key: 'shelf', label: 'Raf No', type: 'text' },
       { key: 'count', label: 'Sayılan Adet', type: 'number', required: true }
    ]
  },
  {
    id: 'smb-105',
    title: 'Personel Maaş Pusulası',
    category: 'İK',
    description: 'Aylık personel ödeme bilgilendirme yazısı.',
    isPremium: true,
    fields: [
       { key: 'employee', label: 'Personel', type: 'text', required: true },
       { key: 'period', label: 'Dönem (Ay/Yıl)', type: 'text' },
       { key: 'baseSalary', label: 'Net Maaş', type: 'number' },
       { key: 'bonus', label: 'Prim/Mesai', type: 'number' },
       { key: 'deduction', label: 'Kesinti/Avans', type: 'number' },
       { key: 'totalGiven', label: 'Ele Geçen Tutar', type: 'number', required: true }
    ]
  },
  {
    id: 'smb-106',
    title: 'Gider Pusulası',
    category: 'Muhasebe',
    description: 'Belgesiz harcamalar için gider makbuzu.',
    isPremium: false,
    fields: [
       { key: 'recipient', label: 'Ödenen Kişi', type: 'text' },
       { key: 'job', label: 'Yapılan İş', type: 'text' },
       { key: 'amount', label: 'Tutar', type: 'number' },
       { key: 'date', label: 'Tarih', type: 'date' }
    ]
  },
  {
    id: 'smb-107',
    title: 'Tahsilat Makbuzu',
    category: 'Muhasebe',
    description: 'Müşteriden alınan ödeme karşılığı makbuz.',
    isPremium: false,
    fields: [
       { key: 'payer', label: 'Ödeyen', type: 'text', required: true },
       { key: 'amountWord', label: 'Yazı ile Tutar', type: 'text' },
       { key: 'amount', label: 'Rakam ile', type: 'number' },
       { key: 'forWhat', label: 'Ödeme Nedeni', type: 'text' },
       { key: 'date', label: 'Tarih', type: 'date' }
    ]
  },
  {
    id: 'smb-108',
    title: 'İade Tutanağı',
    category: 'Satış',
    description: 'Satılan ürünün iade alınma belgesi.',
    isPremium: false,
    fields: [
       { key: 'customer', label: 'Müşteri', type: 'text' },
       { key: 'product', label: 'İade Edilen Ürün', type: 'text' },
       { key: 'reason', label: 'İade Nedeni', type: 'text' },
       { key: 'refundAmount', label: 'İade Tutarı', type: 'number' }
    ]
  },
  {
    id: 'smb-109',
    title: 'Garanti Belgesi Takip',
    category: 'Hizmet',
    description: 'Satılan ürünlerin garanti süreleri takibi.',
    isPremium: true,
    fields: [
       { key: 'product', label: 'Cihaz/Ürün', type: 'text' },
       { key: 'serial', label: 'Seri No', type: 'text' },
       { key: 'saleDate', label: 'Satış Tarihi', type: 'date' },
       { key: 'warrantyEnd', label: 'Garanti Bitiş', type: 'date' },
       { key: 'customer', label: 'Sahibi', type: 'text' }
    ]
  }
];

// Admin User Credentials
export const ADMIN_USER = {
  id: 'admin-001',
  name: 'Kürşat Kırbaş',
  email: 'admin@kirbas.com',
  password: 'Admin123456',
  companyName: 'Kırbaş Doküman Yazılımları',
  role: 'ADMIN',
  plan: 'YEARLY',
  remainingDownloads: 'UNLIMITED',
  subscriptionStartDate: new Date().toISOString(),
  isActive: true
};