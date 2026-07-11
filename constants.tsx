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
    fields: [
      { key: 'projeTuru', label: 'Proje Türü', type: 'select', options: ['Mekanik', 'Elektrik', 'İnşaat', 'Mimari'] },
      { key: 'mekanikTesisatTuru', label: 'Mekanik Tesisat Türü', type: 'text', dependsOn: { field: 'projeTuru', value: 'Mekanik' } },
      { key: 'gerilimHattiKapatesi', label: 'Gerilim Hattı Kapasitesi', type: 'text', dependsOn: { field: 'projeTuru', value: 'Elektrik' } },
      { key: 'insaatAlaniM2', label: 'İnşaat Alanı (m2)', type: 'text', dependsOn: { field: 'projeTuru', value: 'İnşaat' } },
      { key: 'katSayisi', label: 'Kat Sayısı', type: 'text', dependsOn: { field: 'projeTuru', value: 'Mimari' } }
    ]
  },
  
  // Gıda Fabrikaları
  {
    id: 'gida-1',
    title: 'Hijyen ve Sanitasyon Talimatı.docx',
    category: 'Gıda Fabrikaları',
    description: 'Gıda üretim alanları için hijyen talimatları.',
    isPremium: false,
    fileUrl: '/templates/Hijyen ve Sanitasyon Talimatı.docx',
    fields: [
      { key: 'birim', label: 'Birim', type: 'select', options: ['Üretim', 'Depo', 'Sevkiyat', 'Yemekhane'] },
      { key: 'uretimHattiNo', label: 'Üretim Hattı No', type: 'text', dependsOn: { field: 'birim', value: 'Üretim' } },
      { key: 'depoKapasitesiTon', label: 'Depo Kapasitesi (Ton)', type: 'text', dependsOn: { field: 'birim', value: 'Depo' } },
      { key: 'aracPlakasi', label: 'Sevkiyat Araç Plakası', type: 'text', dependsOn: { field: 'birim', value: 'Sevkiyat' } },
      { key: 'gunlukYemekKapasitesi', label: 'Günlük Yemek Kapasitesi', type: 'text', dependsOn: { field: 'birim', value: 'Yemekhane' } }
    ]
  },
  {
    id: 'gida-2',
    title: 'İş Yeri Hijyen ve Sanitasyon Talimatnamesi.docx',
    category: 'Gıda Fabrikaları',
    description: 'İş yeri genel hijyen ve sanitasyon talimatnamesi.',
    isPremium: false,
    fileUrl: '/templates/İş Yeri Hijyen ve Sanitasyon Talimatnamesi.docx',
    fields: [
      { key: 'isletmeTuru', label: 'İşletme Türü', type: 'select', options: ['Gıda İmalathanesi', 'Hazır Yemek (Catering)', 'Süt ve Süt Ürünleri', 'Et Dünyası'] },
      { key: 'imalatKategorisi', label: 'İmalat Kategorisi', type: 'text', dependsOn: { field: 'isletmeTuru', value: 'Gıda İmalathanesi' } },
      { key: 'gunlukPorsiyon', label: 'Günlük Üretim Porsiyon Sayısı', type: 'text', dependsOn: { field: 'isletmeTuru', value: 'Hazır Yemek (Catering)' } },
      { key: 'sutIslemeKapasitesiLt', label: 'Süt İşleme Kapasitesi (Lt)', type: 'text', dependsOn: { field: 'isletmeTuru', value: 'Süt ve Süt Ürünleri' } },
      { key: 'etTurleri', label: 'İşlenen Et Türleri', type: 'text', dependsOn: { field: 'isletmeTuru', value: 'Et Dünyası' } }
    ]
  },
  {
    id: 'gida-3',
    title: 'Soğuk Oda Çalışma Talimat.docx',
    category: 'Gıda Fabrikaları',
    description: 'Soğuk oda alanlarında güvenli çalışma talimatları.',
    isPremium: true,
    fileUrl: '/templates/Soğuk Oda Çalışma Talimat.docx',
    fields: [
      { key: 'depoTipi', label: 'Depo Tipi', type: 'select', options: ['Donuk Depo (-18)', 'Soğuk Depo (+4)'] },
      { key: 'sogutucuGazTuru', label: 'Soğutucu Gaz Türü', type: 'text', dependsOn: { field: 'depoTipi', value: 'Donuk Depo (-18)' } },
      { key: 'nemOrani', label: 'Hedeflenen Nem Oranı (%)', type: 'text', dependsOn: { field: 'depoTipi', value: 'Soğuk Depo (+4)' } }
    ]
  },

  // Hava Limanları
  {
    id: 'havalimani-1',
    title: 'Apron Güvenliği ve Yer Hizmetleri Talimatnamesi.docx',
    category: 'Hava Limanları',
    description: 'Apron ve yer hizmetlerinde güvenlik standartları.',
    isPremium: true,
    fileUrl: '/templates/Apron Güvenliği ve Yer Hizmetleri Talimatnamesi.docx',
    fields: [
      { key: 'aracTipi', label: 'Araç Tipi', type: 'select', options: ['Trainee', 'Bagaj Aracı', 'Merdiven Aracı', 'Otobüs'] },
      { key: 'traineeKapasitesi', label: 'Trainee Kapasitesi', type: 'text', dependsOn: { field: 'aracTipi', value: 'Trainee' } },
      { key: 'maxYukKapasitesi', label: 'Maksimum Yük Kapasitesi', type: 'text', dependsOn: { field: 'aracTipi', value: 'Bagaj Aracı' } },
      { key: 'maxErisimYuksekligi', label: 'Maksimum Erişim Yüksekliği', type: 'text', dependsOn: { field: 'aracTipi', value: 'Merdiven Aracı' } },
      { key: 'yolcuKapasitesi', label: 'Araç Yolcu Kapasitesi', type: 'text', dependsOn: { field: 'aracTipi', value: 'Otobüs' } }
    ]
  },

  // İnşaat ve Tersaneler
  {
    id: 'insaat-1',
    title: 'Çalışan Temsilcisi ve Destek Elemanı Atama Yazıları.docx',
    category: 'İnşaat ve Tersaneler',
    description: 'Çalışan temsilcisi atama ve bilgilendirme yazıları.',
    isPremium: false,
    fileUrl: '/templates/Çalışan Temsilcisi ve Destek Elemanı Atama Yazıları.docx',
    fields: [
      { key: 'temsilciTuru', label: 'Temsilci Türü', type: 'select', options: ['Baş Temsilci', 'Çalışan Temsilcisi', 'Destek Elemanı'] },
      { key: 'sorumluOlduguBolge', label: 'Sorumlu Olduğu Bölge', type: 'text', dependsOn: { field: 'temsilciTuru', value: 'Baş Temsilci' } },
      { key: 'temsilEttigiGrup', label: 'Temsil Ettiği Çalışan Grubu', type: 'text', dependsOn: { field: 'temsilciTuru', value: 'Çalışan Temsilcisi' } },
      { key: 'destekAlani', label: 'Destek Görevi (Yangın, İlkyardım vs.)', type: 'text', dependsOn: { field: 'temsilciTuru', value: 'Destek Elemanı' } }
    ]
  },

  // Kimya Fabrikası
  {
    id: 'kimya-1',
    title: 'patlamadan korunma dökümanı.docx',
    category: 'Kimya Fabrikası',
    description: 'Patlayıcı ortamlarda korunma stratejisi dokümanı.',
    isPremium: true,
    fileUrl: '/templates/patlamadan korunma dökümanı.docx',
    fields: [
      { key: 'tehlikeSinifi', label: 'Tehlike Sınıfı', type: 'select', options: ['Zone 0', 'Zone 1', 'Zone 2', 'Zone 20', 'Zone 21', 'Zone 22'] },
      { key: 'patlayiciGazTuru', label: 'Patlayıcı Gaz Türü', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 0' } },
      { key: 'maruziyetSuresiZone1', label: 'Tahmini Maruziyet Süresi', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 1' } },
      { key: 'havalandirmaSistemi', label: 'Kullanılan Havalandırma Sistemi', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 2' } },
      { key: 'tozCinsi', label: 'Patlayıcı Toz Cinsi', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 20' } },
      { key: 'tozYogunlugu', label: 'Toz Yoğunluğu (gr/m3)', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 21' } },
      { key: 'temizlikPeriyodu', label: 'Zone 22 Temizlik Periyodu', type: 'text', dependsOn: { field: 'tehlikeSinifi', value: 'Zone 22' } }
    ]
  },
  {
    id: 'kimya-2',
    title: 'LOTO Formu.docx',
    category: 'Kimya Fabrikası',
    description: 'Etiketleme kilitleme (LOTO) formu.',
    isPremium: true,
    fileUrl: '/templates/LOTO Formu.docx',
    fields: [
      { key: 'enerjiTuru', label: 'Enerji Türü', type: 'select', options: ['Elektrik', 'Mekanik', 'Hidrolik', 'Pnömatik'] },
      { key: 'voltajSeviyesi', label: 'Voltaj Seviyesi', type: 'text', dependsOn: { field: 'enerjiTuru', value: 'Elektrik' } },
      { key: 'kilitTuru', label: 'Mekanik Kilit Türü', type: 'text', dependsOn: { field: 'enerjiTuru', value: 'Mekanik' } },
      { key: 'maksimumBasincBar', label: 'Maksimum Basınç (Bar)', type: 'text', dependsOn: { field: 'enerjiTuru', value: 'Hidrolik' } },
      { key: 'havaHattiBasinci', label: 'Hava Hattı Basıncı', type: 'text', dependsOn: { field: 'enerjiTuru', value: 'Pnömatik' } }
    ]
  },

  // Liman İşletmeciliği
  {
    id: 'liman-1',
    title: 'Liman Operasyon Güvenlik Planı.docx',
    category: 'Liman İşletmeciliği',
    description: 'Liman operasyonlarında uyulması gereken güvenlik adımları.',
    isPremium: true,
    fileUrl: '/templates/Liman Operasyon Güvenlik Planı.docx',
    fields: [
      { key: 'operasyonTuru', label: 'Operasyon Türü', type: 'select', options: ['Konteyner Yükleme', 'Dökme Yük', 'Ro-Ro', 'Sıvı Yük'] },
      { key: 'konteynerBoyutu', label: 'Konteyner Boyutu (TEU)', type: 'text', dependsOn: { field: 'operasyonTuru', value: 'Konteyner Yükleme' } },
      { key: 'dokmeYukCinsi', label: 'Dökme Yük Cinsi', type: 'text', dependsOn: { field: 'operasyonTuru', value: 'Dökme Yük' } },
      { key: 'aracGirisSayisi', label: 'Tahmini Araç Giriş Sayısı', type: 'text', dependsOn: { field: 'operasyonTuru', value: 'Ro-Ro' } },
      { key: 'siviTehlikeSinifi', label: 'Sıvı Madde Tehlike Sınıfı', type: 'text', dependsOn: { field: 'operasyonTuru', value: 'Sıvı Yük' } }
    ]
  },

  // Lojistik ve Taşımacılık Yükleme Güvenliği
  {
    id: 'lojistik-1',
    title: '(Lashing) Talimatı ve Formu.docx',
    category: 'Lojistik ve Taşımacılık Yükleme Güvenliği',
    description: 'Yük sabitleme (lashing) uygulama talimatı.',
    isPremium: true,
    fileUrl: '/templates/(Lashing) Talimatı ve Formu.docx',
    fields: [
      { key: 'vasitaTipi', label: 'Vasıta Tipi', type: 'select', options: ['Kamyon', 'Tır', 'Gemi', 'Tren'] },
      { key: 'kamyonPlaka', label: 'Kamyon Plakası', type: 'text', dependsOn: { field: 'vasitaTipi', value: 'Kamyon' } },
      { key: 'dorseTipi', label: 'Dorse Tipi', type: 'text', dependsOn: { field: 'vasitaTipi', value: 'Tır' } },
      { key: 'gemiAdi', label: 'Gemi Adı', type: 'text', dependsOn: { field: 'vasitaTipi', value: 'Gemi' } },
      { key: 'vagonSayisi', label: 'Vagon Sayısı', type: 'text', dependsOn: { field: 'vasitaTipi', value: 'Tren' } }
    ]
  },

  // Maden İşletmeleri
  {
    id: 'maden-1',
    title: 'Maden Patlamadan Korunma.docx',
    category: 'Maden İşletmeleri',
    description: 'Madenlerde patlamadan korunma için temel doküman.',
    isPremium: true,
    fileUrl: '/templates/Maden Patlamadan Korunma.docx',
    fields: [
      { key: 'madenTipi', label: 'Maden Tipi', type: 'select', options: ['Yeraltı Kömür', 'Açık Ocak', 'Metalik Maden'] },
      { key: 'grizuOlcumPeriyodu', label: 'Grizu Ölçüm Periyodu', type: 'text', dependsOn: { field: 'madenTipi', value: 'Yeraltı Kömür' } },
      { key: 'patlatmaYontemi', label: 'Kullanılan Patlatma Yöntemi', type: 'text', dependsOn: { field: 'madenTipi', value: 'Açık Ocak' } },
      { key: 'cevherCinsi', label: 'Çıkarılan Cevher Cinsi', type: 'text', dependsOn: { field: 'madenTipi', value: 'Metalik Maden' } }
    ]
  },

  // Metal ve Döküm
  {
    id: 'metal-1',
    title: 'Sıcak Metal Transfer Talimatı.docx',
    category: 'Metal ve Döküm',
    description: 'Sıcak metal aktarımı için isg talimatları.',
    isPremium: true,
    fileUrl: '/templates/Sıcak Metal Transfer Talimatı.docx',
    fields: [
      { key: 'metalTuru', label: 'Metal Türü', type: 'select', options: ['Çelik', 'Demir', 'Alüminyum'] },
      { key: 'alasimTipi', label: 'Çelik Alaşım Tipi', type: 'text', dependsOn: { field: 'metalTuru', value: 'Çelik' } },
      { key: 'dokumDerecesi', label: 'Demir Döküm Derecesi', type: 'text', dependsOn: { field: 'metalTuru', value: 'Demir' } },
      { key: 'erimeSicakligi', label: 'Erime Sıcaklığı', type: 'text', dependsOn: { field: 'metalTuru', value: 'Alüminyum' } }
    ]
  },

  // Otel,Bina ve Hastaneler
  {
    id: 'otel-1',
    title: 'yangından korunma dökümanı.docx',
    category: 'Otel,Bina ve Hastaneler',
    description: 'Binalar ve tesisler için yangından korunma standartları.',
    isPremium: false,
    fileUrl: '/templates/yangından korunma dökümanı.docx',
    fields: [
      { key: 'yapiSinifi', label: 'Yapı Sınıfı', type: 'select', options: ['Endüstriyel Tesis', 'Ofis/İdari Bina', 'Depo'] },
      { key: 'tesisTehlikeSinifi', label: 'Tesis Tehlike Sınıfı', type: 'text', dependsOn: { field: 'yapiSinifi', value: 'Endüstriyel Tesis' } },
      { key: 'calisanKapasitesi', label: 'Ortalama Çalışan Sayısı', type: 'text', dependsOn: { field: 'yapiSinifi', value: 'Ofis/İdari Bina' } },
      { key: 'depolananMalzemeTuru', label: 'Depolanan Malzeme Türü', type: 'text', dependsOn: { field: 'yapiSinifi', value: 'Depo' } }
    ]
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
      { key: 'facilityType', label: 'Tesis Türü', type: 'select', options: ['RES', 'GES', 'HES', 'Termik'] },
      { key: 'turbinSayisi', label: 'Türbin Sayısı', type: 'text', dependsOn: { field: 'facilityType', value: 'RES' } },
      { key: 'panelAlani', label: 'Toplam Panel Alanı (m2)', type: 'text', dependsOn: { field: 'facilityType', value: 'GES' } },
      { key: 'barajKapasitesi', label: 'Baraj Su Kapasitesi', type: 'text', dependsOn: { field: 'facilityType', value: 'HES' } },
      { key: 'yakitTuru', label: 'Yakıt Türü', type: 'text', dependsOn: { field: 'facilityType', value: 'Termik' } }
    ]
  },
  {
    id: 'standart-2',
    title: 'ACİL DURUM ATAMA yazısı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Acil durum ekipleri atama formu.',
    isPremium: false,
    fileUrl: '/templates/ACİL DURUM ATAMA yazısı.docx',
    fields: [
      { key: 'ekipTuru', label: 'Ekip Türü', type: 'select', options: ['Söndürme Ekibi', 'Kurtarma Ekibi', 'Koruma Ekibi', 'İlk Yardım Ekibi'] },
      { key: 'yanginTupTipi', label: 'Sorumlu Olduğu Yangın Tüpü Türü', type: 'text', dependsOn: { field: 'ekipTuru', value: 'Söndürme Ekibi' } },
      { key: 'kurtarmaEkipmani', label: 'Tesis Edilmiş Kurtarma Ekipmanı', type: 'text', dependsOn: { field: 'ekipTuru', value: 'Kurtarma Ekibi' } },
      { key: 'koruyucuDonanim', label: 'Zimmetli Koruyucu Donanım', type: 'text', dependsOn: { field: 'ekipTuru', value: 'Koruma Ekibi' } },
      { key: 'ilkyardimSertifikaNo', label: 'İlk Yardım Sertifika No', type: 'text', dependsOn: { field: 'ekipTuru', value: 'İlk Yardım Ekibi' } }
    ]
  },
  {
    id: 'standart-3',
    title: 'İSG Kurul Tutanağı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'İSG kurulu toplantı tutanağı.',
    isPremium: false,
    fileUrl: '/templates/İSG Kurul Tutanağı.docx',
    fields: [
      { key: 'toplantiTuru', label: 'Toplantı Türü', type: 'select', options: ['Olağan', 'Olağanüstü'] },
      { key: 'periyotSikligi', label: 'Toplantı Periyodu', type: 'text', dependsOn: { field: 'toplantiTuru', value: 'Olağan' } },
      { key: 'acilGundemMaddesi', label: 'Acil Gündem Maddesi', type: 'textarea', dependsOn: { field: 'toplantiTuru', value: 'Olağanüstü' } }
    ]
  },
  {
    id: 'standart-4',
    title: 'İş Kazası ve Ramak Kala Bildirim Formu.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Ramak kala ve kaza bildirim şablonu.',
    isPremium: false,
    fileUrl: '/templates/İş Kazası ve Ramak Kala Bildirim Formu.docx',
    fields: [
      { key: 'olayTuru', label: 'Olay Türü', type: 'select', options: ['İş Kazası', 'Ramak Kala Olay'] },
      { key: 'yaralanmaDurumu', label: 'Yaralanma Durumu ve Bölgesi', type: 'text', dependsOn: { field: 'olayTuru', value: 'İş Kazası' } },
      { key: 'ramakKalaSebebi', label: 'Ramak Kala Oluş Sebebi', type: 'textarea', dependsOn: { field: 'olayTuru', value: 'Ramak Kala Olay' } }
    ]
  },
  {
    id: 'standart-5',
    title: 'Personel İSG İhtar ve Uyarı Tutanağı.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'Personel isg uyarı tutanağı.',
    isPremium: false,
    fileUrl: '/templates/Personel İSG İhtar ve Uyarı Tutanağı.docx',
    fields: [
      { key: 'uyariSebebi', label: 'Uyarı Sebebi', type: 'select', options: ['KKD Kullanmama', 'Talimatlara Uymama', 'Tehlikeli Davranış'] },
      { key: 'eksikKkdAdi', label: 'Eksik Olan KKD', type: 'text', dependsOn: { field: 'uyariSebebi', value: 'KKD Kullanmama' } },
      { key: 'ihlalEdilenTalimat', label: 'İhlal Edilen Talimat', type: 'text', dependsOn: { field: 'uyariSebebi', value: 'Talimatlara Uymama' } },
      { key: 'davranisAciklamasi', label: 'Tehlikeli Davranışın Açıklaması', type: 'textarea', dependsOn: { field: 'uyariSebebi', value: 'Tehlikeli Davranış' } }
    ]
  },
  {
    id: 'standart-6',
    title: 'temel iş sağlığı formu ve işe başlama eğitim formu.docx',
    category: 'STANDART DOKÜMANLAR',
    description: 'İşe giriş ve temel isg eğitim formu.',
    isPremium: false,
    fileUrl: '/templates/temel iş sağlığı formu ve işe başlama eğitim formu.docx',
    fields: [
      { key: 'egitimSeviyesi', label: 'Eğitim Seviyesi', type: 'select', options: ['Çok Tehlikeli (16 Saat)', 'Tehlikeli (12 Saat)', 'Az Tehlikeli (8 Saat)'] },
      { key: 'cokTehlikeliIcerikler', label: 'Çok Tehlikeli Eğitim İçerikleri', type: 'text', dependsOn: { field: 'egitimSeviyesi', value: 'Çok Tehlikeli (16 Saat)' } },
      { key: 'tehlikeliIcerikler', label: 'Tehlikeli Eğitim İçerikleri', type: 'text', dependsOn: { field: 'egitimSeviyesi', value: 'Tehlikeli (12 Saat)' } },
      { key: 'azTehlikeliIcerikler', label: 'Az Tehlikeli Eğitim İçerikleri', type: 'text', dependsOn: { field: 'egitimSeviyesi', value: 'Az Tehlikeli (8 Saat)' } }
    ]
  },

  // Şirketler (Ofis ve Küçük İşletmeler)
  {
    id: 'ofis-1',
    title: 'YUVAM Projesi - Nihai Devlet Strateji Belgesi (V4).docx',
    category: 'Şirketler (Ofis ve Küçük İşletmeler)',
    description: 'Örnek strateji ve raporlama belgesi.',
    isPremium: false,
    fileUrl: '/templates/YUVAM Projesi - Nihai Devlet Strateji Belgesi (V4).docx',
    fields: [
      { key: 'raporDonemi', label: 'Rapor Dönemi', type: 'select', options: ['1. Çeyrek', '2. Çeyrek', '3. Çeyrek', '4. Çeyrek', 'Yıllık'] },
      { key: 'q1Hedefleri', label: 'Q1 Gerçekleşen Hedefler', type: 'textarea', dependsOn: { field: 'raporDonemi', value: '1. Çeyrek' } },
      { key: 'q2Performansi', label: 'Q2 Performans Kriterleri', type: 'textarea', dependsOn: { field: 'raporDonemi', value: '2. Çeyrek' } },
      { key: 'q3ProjeDurumu', label: 'Q3 Proje İlerleme Durumu', type: 'textarea', dependsOn: { field: 'raporDonemi', value: '3. Çeyrek' } },
      { key: 'q4ButceSapanlari', label: 'Q4 Bütçe Sapanları ve Analizi', type: 'textarea', dependsOn: { field: 'raporDonemi', value: '4. Çeyrek' } },
      { key: 'YillikGenelDegerlendirme', label: 'Yıllık Genel Değerlendirme', type: 'textarea', dependsOn: { field: 'raporDonemi', value: 'Yıllık' } }
    ]
  },

  // Tarım, Hayvancılık ve Ormancılık
  {
    id: 'tarim-1',
    title: 'Orman Kesim ve Tomruklama Güvenlik Prosedürü.docx',
    category: 'Tarım, Hayvancılık ve Ormancılık',
    description: 'Orman işlerinde güvenlik talimatları.',
    isPremium: true,
    fileUrl: '/templates/Orman Kesim ve Tomruklama Güvenlik Prosedürü.docx',
    fields: [
      { key: 'araziDurumu', label: 'Arazi Durumu', type: 'select', options: ['Düz Arazi', 'Eğimli Arazi', 'Sarp Arazi'] },
      { key: 'isMakinasiTuru', label: 'Kullanılan İş Makinası Türü', type: 'text', dependsOn: { field: 'araziDurumu', value: 'Düz Arazi' } },
      { key: 'egimYuzdesi', label: 'Ortalama Eğim Yüzdesi', type: 'text', dependsOn: { field: 'araziDurumu', value: 'Eğimli Arazi' } },
      { key: 'halatliCekimSistemi', label: 'Kurulan Halatlı Çekim Sistemi Detayı', type: 'textarea', dependsOn: { field: 'araziDurumu', value: 'Sarp Arazi' } }
    ]
  },
  {
    id: 'tarim-2',
    title: 'Zirai İlaç (Pestisit) Kullanım ve Depolama Talimatı.docx',
    category: 'Tarım, Hayvancılık ve Ormancılık',
    description: 'Zirai ilaçların kullanımı ve depolanması hakkında talimat.',
    isPremium: true,
    fileUrl: '/templates/Zirai İlaç (Pestisit) Kullanım ve Depolama Talimatı.docx',
    fields: [
      { key: 'ilacSinifi', label: 'İlaç Sınıfı', type: 'select', options: ['Herbisit', 'İnsektisit', 'Fungisit'] },
      { key: 'yabanciOtCinsi', label: 'Hedef Yabancı Ot Cinsi', type: 'text', dependsOn: { field: 'ilacSinifi', value: 'Herbisit' } },
      { key: 'bocekTuru', label: 'Hedef Böcek Türü', type: 'text', dependsOn: { field: 'ilacSinifi', value: 'İnsektisit' } },
      { key: 'mantarHastaligi', label: 'Görülen Mantar Hastalığı', type: 'text', dependsOn: { field: 'ilacSinifi', value: 'Fungisit' } }
    ]
  },

  // Enerji Santralleri
  {
    id: 'enerji-1',
    title: '(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    category: 'Enerji Santralleri',
    description: 'Yüksek gerilim işletme sorumlusu atama belgesi.',
    isPremium: true,
    fileUrl: '/templates/(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx',
    fields: [
      { key: 'tesisTipi', label: 'Tesis Tipi', type: 'select', options: ['RES (Rüzgar Enerjisi)', 'GES (Güneş Enerjisi)', 'HES (Hidroelektrik)', 'Termik Santral'] },
      { key: 'ruzgarTurbinGucu', label: 'Toplam Türbin Gücü (MW)', type: 'text', dependsOn: { field: 'tesisTipi', value: 'RES (Rüzgar Enerjisi)' } },
      { key: 'gunesPanelKapasitesi', label: 'Kurulu Panel Gücü (MW)', type: 'text', dependsOn: { field: 'tesisTipi', value: 'GES (Güneş Enerjisi)' } },
      { key: 'barajTipi', label: 'Gölet/Baraj Tipi', type: 'text', dependsOn: { field: 'tesisTipi', value: 'HES (Hidroelektrik)' } },
      { key: 'komurTipiKazani', label: 'Kazanda Kullanılan Kömür Tipi', type: 'text', dependsOn: { field: 'tesisTipi', value: 'Termik Santral' } }
    ]
  },
  {
    id: 'enerji-2',
    title: 'EKAT Yetki Belgesi Takip Çizelgesi.docx',
    category: 'Enerji Santralleri',
    description: 'Elektrik kuvvetli akım tesisleri yetki belgesi takip şablonu.',
    isPremium: true,
    fileUrl: '/templates/EKAT Yetki Belgesi Takip Çizelgesi.docx',
    fields: [
      { key: 'gerilimSeviyesi', label: 'Gerilim Seviyesi', type: 'select', options: ['Alçak Gerilim (AG)', 'Yüksek Gerilim (YG)'] },
      { key: 'agSistemGerilimi', label: 'AG Sistem Gerilimi (V)', type: 'text', dependsOn: { field: 'gerilimSeviyesi', value: 'Alçak Gerilim (AG)' } },
      { key: 'ygSistemGerilimi', label: 'YG Sistem Gerilimi (kV)', type: 'text', dependsOn: { field: 'gerilimSeviyesi', value: 'Yüksek Gerilim (YG)' } }
    ]
  }
];