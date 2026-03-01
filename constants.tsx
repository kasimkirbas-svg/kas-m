import { DocumentTemplate, SubscriptionPlan, UserRole } from './types';

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

export const MOCK_TEMPLATES: DocumentTemplate[] = [
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
  role: UserRole.ADMIN,
  plan: SubscriptionPlan.YEARLY,
  remainingDownloads: 'UNLIMITED' as const,
  subscriptionStartDate: new Date().toISOString(),
  isActive: true
};
