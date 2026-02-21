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