import { DocumentTemplate, SubscriptionPlan } from './types';

export const APP_NAME = "Kırbaş Doküman";

export const PLANS = [
  {
    id: SubscriptionPlan.MONTHLY,
    name: "Aylık Paket",
    price: "499 TL",
    period: "/ay",
    features: ["Aylık 30 Doküman", "PDF Çıktısı", "Temel Şablonlar", "E-posta Destek"],
    limit: 30,
  },
  {
    id: SubscriptionPlan.YEARLY,
    name: "Yıllık Pro",
    price: "4.999 TL",
    period: "/yıl",
    features: ["Sınırsız Doküman", "Tüm Premium Şablonlar", "Öncelikli Destek", "Fatura Entegrasyonu"],
    limit: 'UNLIMITED',
    popular: true,
  }
];

// 25-35 Document templates simulation
export const MOCK_TEMPLATES: DocumentTemplate[] = [
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
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '9',
    title: 'Zimmet Formu',
    category: 'İK',
    description: 'Demirbaş teslim tutanağı.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '10',
    title: 'KVKK Açık Rıza Metni',
    category: 'Hukuk',
    description: 'Kişisel verilerin korunması kanunu rıza beyanı.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '11',
    title: 'Çalışan Performans Değerlendirme',
    category: 'İK',
    description: 'Yıllık personel performans raporlama formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '12',
    title: 'Sağlık ve Güvenlik Yönetmeliği',
    category: 'ISG',
    description: 'Kurumsal sağlık ve güvenlik politika belgesi.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '13',
    title: 'Müşteri Memnuniyet Anketi',
    category: 'Kalite',
    description: 'Müşteri geri bildirim ve tahmini değerlendirme formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '14',
    title: 'Sertifikasyon Belgesi',
    category: 'Belgelendirme',
    description: 'ISO ve diğer standart sertifika şablonu.',
    isPremium: true,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '15',
    title: 'Eğitim Planı Şablonu',
    category: 'İK',
    description: 'Çalışanlar için yıllık eğitim programı planlama belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '16',
    title: 'Uyum İhlali Raporu',
    category: 'Hukuk',
    description: 'Mevzuat ve standartlara uyum denetimi sonuç raporu.',
    isPremium: true,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '17',
    title: 'Bakım ve Onarım Planı',
    category: 'Teknik',
    description: 'Ekipman bakım takvimi ve planlama belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '18',
    title: 'İş Sözleşmesi Şablonu',
    category: 'İK',
    description: 'Personel istihdam sözleşmesi standart formu.',
    isPremium: true,
    fields: []
  },
  {
    id: '19',
    title: 'Kütüphaneler ve Kategoriler',
    category: 'Arşiv',
    description: 'Belge sınıflandırma ve arşivleme kataloğu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '20',
    title: 'Bilgi Güvenliği Politikası',
    category: 'Güvenlik',
    description: 'Veri ve sistem güvenliği yönetim belgeleri.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '21',
    title: 'Kaynaklar Planlama Formu',
    category: 'Yönetim',
    description: 'Proje kaynakları tahsis ve planlama belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '22',
    title: 'Müşteri Hizmet Dosyası',
    category: 'Müşteri',
    description: 'Müşteri ilişkileri yönetimi döküman şablonu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '23',
    title: 'Kayıt Tutma Prosedürü',
    category: 'Yönetim',
    description: 'Kurumsal kayıt ve belge tutma prosesi belgesi.',
    isPremium: true,
    fields: []
  },
  {
    id: '24',
    title: 'İş Akışı Şeması',
    category: 'Yönetim',
    description: 'İş süreçleri ve akış diagramları oluşturma şablonu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '25',
    title: 'Proje Tamamlama Raporu',
    category: 'Yönetim',
    description: 'Tamamlanan proje sonuç ve değerlendirme belgesı.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '26',
    title: 'Tedarikçi Değerlendirme',
    category: 'Satın Alma',
    description: 'Tedarikçi seçim ve performans değerlendirme formu.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '27',
    title: 'Bütçe Planlama Şablonu',
    category: 'Finans',
    description: 'Yıllık bütçe tahminlemesi ve planlama belgesi.',
    isPremium: true,
    fields: []
  },
  {
    id: '28',
    title: 'İnsan Kaynakları İstatistikleri',
    category: 'İK',
    description: 'Personel hareketi ve demografik veriler raporu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '29',
    title: 'Çevresel Etki Değerlendirmesi',
    category: 'Çevre',
    description: 'Çevresel uyum ve etki analiz belgesi.',
    isPremium: true,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '30',
    title: 'Sicil Dosyası Şablonu',
    category: 'İK',
    description: 'Personel sicil ve kariyer dosyası belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    fields: []
  },
  {
    id: '31',
    title: 'Reklam ve Pazarlama Planı',
    category: 'Pazarlama',
    description: 'Yıllık reklam ve tanıtım stratejisi belgesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '32',
    title: 'Kalite Kontrol Raporu',
    category: 'Kalite',
    description: 'Ürün ve hizmet kalite denetim sonuçları belgesi.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 15,
    fields: []
  },
  {
    id: '33',
    title: 'Tehlike Analizi (HAZOP)',
    category: 'ISG',
    description: 'Tehlike ve işletilebilirlik analizi şablonu.',
    isPremium: true,
    photoCapacity: 10,
    fields: []
  },
  {
    id: '34',
    title: 'Yönetmelik Uygunluk Denetimi',
    category: 'Hukuk',
    description: 'Yasal ve yönetmelik mevzuat uyum denetim belgesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: []
  },
  {
    id: '35',
    title: 'Teklif ve Fiyatlandırma Formu',
    category: 'Satış',
    description: 'Müşteri teklifleri ve fiyatlandırma şablonu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 10,
    fields: []
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