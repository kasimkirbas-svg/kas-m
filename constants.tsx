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
  // Fabrikalar ve İmalathaneler
  {
    id: 'fabrikalar-1',
    title: 'PROJE TEKNİK ŞARTNAMESİ.docx',
    category: 'Fabrikalar ve İmalathaneler',
    description: 'Proje teknik şartname hazırlama dökümanı.',
    isPremium: true,
    fileUrl: '/templates/PROJE TEKNİK ŞARTNAMESİ.docx',
    fields: []
  },
  
  // Gıda Fabrikaları
  {
    id: 'gida-1',
    title: 'Hijyen ve Sanitasyon Talimatı.docx',
    category: 'Gıda Fabrikaları',
    description: 'Gıda üretim alanları için hijyen talimatları.',
    isPremium: false,
    fileUrl: '/templates/Hijyen ve Sanitasyon Talimatı.docx',
    fields: []
  },
  {
    id: 'gida-2',
    title: 'İş Yeri Hijyen ve Sanitasyon Talimatnamesi.docx',
    category: 'Gıda Fabrikaları',
    description: 'İş yeri genel hijyen ve sanitasyon talimatnamesi.',
    isPremium: false,
    fileUrl: '/templates/İş Yeri Hijyen ve Sanitasyon Talimatnamesi.docx',
    fields: []
  },
  {
    id: 'gida-3',
    title: 'Soğuk Oda Çalışma Talimat.docx',
    category: 'Gıda Fabrikaları',
    description: 'Soğuk oda alanlarında güvenli çalışma talimatları.',
    isPremium: true,
    fileUrl: '/templates/Soğuk Oda Çalışma Talimat.docx',
    fields: []
  },

  // Hava Limanları
  {
    id: 'havalimani-1',
    title: 'Apron Güvenliği ve Yer Hizmetleri Talimatnamesi.docx',
    category: 'Hava Limanları',
    description: 'Apron ve yer hizmetlerinde güvenlik standartları.',
    isPremium: true,
    fileUrl: '/templates/Apron Güvenliği ve Yer Hizmetleri Talimatnamesi.docx',
    fields: []
  },

  // İnşaat ve Tersaneler
  {
    id: 'insaat-1',
    title: 'Çalışan Temsilcisi ve Destek Elemanı Atama Yazıları.docx',
    category: 'İnşaat ve Tersaneler',
    description: 'Çalışan temsilcisi atama ve bilgilendirme yazıları.',
    isPremium: false,
    fileUrl: '/templates/Çalışan Temsilcisi ve Destek Elemanı Atama Yazıları.docx',
    fields: []
  },

  // Kimya Fabrikası
  {
    id: 'kimya-1',
    title: 'patlamadan korunma dökümanı.docx',
    category: 'Kimya Fabrikası',
    description: 'Patlayıcı ortamlarda korunma stratejisi dokümanı.',
    isPremium: true,
    fileUrl: '/templates/patlamadan korunma dökümanı.docx',
    fields: []
  },
  {
    id: 'kimya-2',
    title: 'LOTO Formu.docx',
    category: 'Kimya Fabrikası',
    description: 'Etiketleme kilitleme (LOTO) formu.',
    isPremium: true,
    fileUrl: '/templates/LOTO Formu.docx',
    fields: []
  },

  // Liman İşletmeciliği
  {
    id: 'liman-1',
    title: 'Liman Operasyon Güvenlik Planı.docx',
    category: 'Liman İşletmeciliği',
    description: 'Liman operasyonlarında uyulması gereken güvenlik adımları.',
    isPremium: true,
    fileUrl: '/templates/Liman Operasyon Güvenlik Planı.docx',
    fields: []
  },

  // Lojistik ve Taşımacılık Yükleme Güvenliği
  {
    id: 'lojistik-1',
    title: '(Lashing) Talimatı ve Formu.docx',
    category: 'Lojistik ve Taşımacılık Yükleme Güvenliği',
    description: 'Yük sabitleme (lashing) uygulama talimatı.',
    isPremium: true,
    fileUrl: '/templates/(Lashing) Talimatı ve Formu.docx',
    fields: []
  },

  // Maden İşletmeleri
  {
    id: 'maden-1',
    title: 'Maden Patlamadan Korunma.docx',
    category: 'Maden İşletmeleri',
    description: 'Madenlerde patlamadan korunma için temel doküman.',
    isPremium: true,
    fileUrl: '/templates/Maden Patlamadan Korunma.docx',
    fields: []
  },

  // Metal ve Döküm
  {
    id: 'metal-1',
    title: 'Sıcak Metal Transfer Talimatı.docx',
    category: 'Metal ve Döküm',
    description: 'Sıcak metal aktarımı için isg talimatları.',
    isPremium: true,
    fileUrl: '/templates/Sıcak Metal Transfer Talimatı.docx',
    fields: []
  },

  // Otel,Bina ve Hastaneler
  {
    id: 'otel-1',
    title: 'yangından korunma dökümanı.docx',
    category: 'Otel,Bina ve Hastaneler',
    description: 'Binalar ve tesisler için yangından korunma standartları.',
    isPremium: false,
    fileUrl: '/templates/yangından korunma dökümanı.docx',
    fields: []
  },

  // STANDART DOKÜMANLAR
  {
    id: 'standart-1',
    title: '(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Yüksek gerilim işletme sorumluluğu atama yazısı.',
    isPremium: true,
    fileUrl: '/templates/(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    fields: [
      { key: 'facilityType', label: 'Tesis Türü', type: 'select', options: ['RES (Rüzgar Enerjisi)', 'GES (Güneş Enerjisi)', 'HES (Hidroelektrik)', 'Termik Santral'] }
    ]
  },
  {
    id: 'standart-2',
    title: 'ACİL DURUM ATAMA yazısı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Acil durum ekipleri atama formu.',
    isPremium: false,
    fileUrl: '/templates/ACİL DURUM ATAMA yazısı.docx',
    fields: []
  },
  {
    id: 'standart-3',
    title: 'İSG Kurul Tutanağı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'İSG kurulu toplantı tutanağı.',
    isPremium: false,
    fileUrl: '/templates/İSG Kurul Tutanağı.docx',
    fields: []
  },
  {
    id: 'standart-4',
    title: 'İş Kazası ve Ramak Kala Bildirim Formu.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Ramak kala ve kaza bildirim şablonu.',
    isPremium: false,
    fileUrl: '/templates/İş Kazası ve Ramak Kala Bildirim Formu.docx',
    fields: []
  },
  {
    id: 'standart-5',
    title: 'Personel İSG İhtar ve Uyarı Tutanağı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Personel isg uyarı tutanağı.',
    isPremium: false,
    fileUrl: '/templates/Personel İSG İhtar ve Uyarı Tutanağı.docx',
    fields: []
  },
  {
    id: 'standart-6',
    title: 'temel iş sağlığı formu ve işe başlama eğitim formu.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'İşe giriş ve temel isg eğitim formu.',
    isPremium: false,
    fileUrl: '/templates/temel iş sağlığı formu ve işe başlama eğitim formu.docx',
    fields: []
  },

  // Şirketler (Ofis ve Küçük İşletmeler)
  {
    id: 'ofis-1',
    title: 'YUVAM Projesi - Nihai Devlet Strateji Belgesi (V4).docx',
    category: 'Şirketler (Ofis ve Küçük İşletmeler)',
    description: 'Örnek strateji ve raporlama belgesi.',
    isPremium: false,
    fileUrl: '/templates/YUVAM Projesi - Nihai Devlet Strateji Belgesi (V4).docx',
    fields: []
  },

  // Tarım, Hayvancılık ve Ormancılık
  {
    id: 'tarim-1',
    title: 'Orman Kesim ve Tomruklama Güvenlik Prosedürü.docx',
    category: 'Tarım, Hayvancılık ve Ormancılık',
    description: 'Orman işlerinde güvenlik talimatları.',
    isPremium: true,
    fileUrl: '/templates/Orman Kesim ve Tomruklama Güvenlik Prosedürü.docx',
    fields: []
  },
  {
    id: 'tarim-2',
    title: 'Zirai İlaç (Pestisit) Kullanım ve Depolama Talimatı.docx',
    category: 'Tarım, Hayvancılık ve Ormancılık',
    description: 'Zirai ilaçların kullanımı ve depolanması hakkında talimat.',
    isPremium: true,
    fileUrl: '/templates/Zirai İlaç (Pestisit) Kullanım ve Depolama Talimatı.docx',
    fields: []
  },

  // Enerji Santralleri
  {
    id: 'enerji-1',
    title: '(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    category: 'Enerji Santralleri',
    description: 'Yüksek gerilim işletme sorumlusu atama belgesi.',
    isPremium: true,
    fileUrl: '/templates/(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    fields: []
  },
  {
    id: 'enerji-2',
    title: 'EKAT Yetki Belgesi Takip Çizelgesi.docx',
    category: 'Enerji Santralleri',
    description: 'Elektrik kuvvetli akım tesisleri yetki belgesi takip şablonu.',
    isPremium: true,
    fileUrl: '/templates/EKAT Yetki Belgesi Takip Çizelgesi.docx',
    fields: []
  }
];