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
      { key: 'companyName', label: 'Firma Adı', type: 'text', required: true, placeholder: 'Şirket tam unvanı' },
      { key: 'dangerLevel', label: 'Tehlike Sınıfı', type: 'select', options: ['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli'], required: true },
      { key: 'employeeCount', label: 'Çalışan Sayısı', type: 'number', required: true },
      { key: 'emergencyTeamLeader', label: 'Acil Durum Ekip Lideri', type: 'text', required: true },
      { key: 'assemblyPoint', label: 'Toplanma Alanı Konumu', type: 'textarea', required: true },
      { key: 'lastDrillDate', label: 'Son Tatbikat Tarihi', type: 'date' }
    ]
  },
  {
    id: '2',
    title: 'Hizmet Teklif Formu',
    category: 'Genel',
    description: 'Standart hizmet teklif ve kapsam belirleme formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 12,
    fields: [
      { key: 'clientName', label: 'Müşteri Adı', type: 'text', required: true },
      { key: 'serviceType', label: 'Hizmet Türü', type: 'select', options: ['Danışmanlık', 'Eğitim', 'Denetim', 'Yazılım', 'Bakım/Onarım'], required: true },
      { key: 'projectDuration', label: 'Proje Süresi (Gün)', type: 'number' },
      { key: 'projectScope', label: 'Proje Kapsamı ve Detaylar', type: 'textarea', required: true },
      { key: 'budgetEstimate', label: 'Tahmini Bütçe (TL)', type: 'number' },
      { key: 'validUntil', label: 'Teklif Geçerlilik Tarihi', type: 'date' }
    ]
  },
  {
    id: '3',
    title: 'Eğitim Katılım Sertifikası',
    category: 'İK',
    description: 'Personel eğitimleri sonrası verilecek başarı sertifikası.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
      { key: 'participantName', label: 'Katılımcı Adı Soyadı', type: 'text', required: true },
      { key: 'trainingTopic', label: 'Eğitim Konusu', type: 'text', required: true },
      { key: 'trainerName', label: 'Eğitmen Adı', type: 'text', required: true },
      { key: 'trainingDate', label: 'Eğitim Tarihi', type: 'date', required: true },
      { key: 'durationHours', label: 'Eğitim Süresi (Saat)', type: 'number' },
      { key: 'competencyLevel', label: 'Yetkinlik Seviyesi', type: 'select', options: ['Başlangıç', 'Orta', 'İleri', 'Uzman'] }
    ]
  },
  {
    id: '4',
    title: 'Saha Denetim Raporu',
    category: 'Denetim',
    description: 'Saha denetimleri için detaylı raporlama formatı.',
    isPremium: true,
    photoCapacity: 15,
    fields: [
      { key: 'siteLocation', label: 'Denetim Bölgesi / Lokasyon', type: 'text', required: true },
      { key: 'auditType', label: 'Denetim Türü', type: 'select', options: ['Haberli Denetim', 'Habersiz Denetim', 'Periyodik Kontrol', 'Şikayet Üzerine'] },
      { key: 'complianceScore', label: 'Uygunluk Skoru (0-100)', type: 'number' },
      { key: 'observations', label: 'Gözlemler ve Bulgular', type: 'textarea', required: true },
      { key: 'criticalNonConformity', label: 'Kritik Uygunsuzluk Var mı?', type: 'checkbox', placeholder: 'Evet, kritik risk mevcut' },
      { key: 'correctiveActionDeadline', label: 'DÖF Termin Tarihi', type: 'date' }
    ]
  },
  {
    id: '5',
    title: 'Risk Analizi Formu (5x5 L Tipi)',
    category: 'ISG',
    description: '5x5 Risk matrisi değerlendirme formu.',
    isPremium: true,
    photoCapacity: 10,
    fields: [
      { key: 'workActivity', label: 'Yapılan İş / Faaliyet', type: 'textarea', required: true },
      { key: 'hazardSource', label: 'Tehlike Kaynağı', type: 'text', required: true },
      { key: 'riskDescription', label: 'Risk Tanımı', type: 'textarea', required: true },
      { key: 'probability', label: 'Olasılık (1-5)', type: 'select', options: ['1 - Çok Küçük', '2 - Küçük', '3 - Orta', '4 - Yüksek', '5 - Çok Yüksek'], required: true },
      { key: 'severity', label: 'Şiddet (1-5)', type: 'select', options: ['1 - Çok Hafif', '2 - Hafif', '3 - Orta', '4 - Ciddi', '5 - Çok Ciddi'], required: true },
      { key: 'precautions', label: 'Alınacak Önlemler', type: 'textarea', required: true }
    ]
  },
  {
    id: '6',
    title: 'Personel Görev Tanımı',
    category: 'İK',
    description: 'Çalışan görev ve sorumluluk bildirim formu.',
    isPremium: false,
    monthlyLimit: 30,
    fields: [
      { key: 'employeeName', label: 'Personel Adı', type: 'text', required: true },
      { key: 'jobTitle', label: 'Ünvan / Pozisyon', type: 'text', required: true },
      { key: 'serviceDepartment', label: 'Departman', type: 'text', required: true },
      { key: 'reportsTo', label: 'Bağlı Olduğu Yönetici', type: 'text' },
      { key: 'responsibilities', label: 'Temel Sorumluluklar', type: 'textarea', required: true, placeholder: 'Maddeler halinde giriniz...' },
      { key: 'requiredSkills', label: 'Aranan Nitelikler', type: 'textarea' }
    ]
  },
  {
    id: '7',
    title: 'Makine Bakım Kartı',
    category: 'Teknik',
    description: 'Periyodik bakım takip çizelgesi.',
    isPremium: true,
    photoCapacity: 12,
    fields: [
      { key: 'machineName', label: 'Makine Adı/Kodu', type: 'text', required: true },
      { key: 'maintenanceType', label: 'Bakım Türü', type: 'select', options: ['Günlük', 'Haftalık', 'Aylık', 'Yıllık', 'Arıza Müdahale'] },
      { key: 'technicianName', label: 'Bakım Yapan Teknisyen', type: 'text', required: true },
      { key: 'partsReplaced', label: 'Değişen Parçalar', type: 'textarea' },
      { key: 'nextMaintenanceDate', label: 'Gelecek Bakım Tarihi', type: 'date', required: true },
      { key: 'cost', label: 'Bakım Maliyeti', type: 'number' }
    ]
  },
  {
    id: '8',
    title: 'Kaza Tespit Tutanağı',
    category: 'ISG',
    description: 'İş kazası bildirim ve tespit formu.',
    isPremium: false,
    monthlyLimit: 30,
    photoCapacity: 20,
    fields: [
      { key: 'accidentTime', label: 'Kaza Tarihi ve Saati', type: 'date', required: true }, // datetime type not available yet, using date
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