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
    id: 'enerji-1',
    title: '(RES, GES, HES, Termik) Yüksek Gerilim İşletme Sorumluluğu Atama Şablonu.docx',
    category: 'Enerji Santralleri',
    description: 'Yüksek gerilim işletme sorumlusu atama belgesi.',
    isPremium: true,
    fileUrl: '/templates/(RES, GES, HES, Termik) Yüksek Gerilim İşletme Sorumluluğu Atama Şablonu.docx',
    fields: [
      { key: 'facilityType', label: 'Tesis Türü', type: 'select', options: ['RES', 'GES', 'HES', 'Termik'] },
      { key: 'tesisAdi', label: 'Tesis Adı', type: 'text' },
      { key: 'tesisAdresi', label: 'Tesis Adresi', type: 'text' },
      { key: 'telefon', label: 'Telefon', type: 'text' },
      { key: 'eicKodu', label: 'EIC Kodu', type: 'text' },
      { key: 'evrakNo', label: 'Evrak No', type: 'text' },
      { key: 'muhendisAdSoyad', label: 'Mühendis Ad Soyad', type: 'text' },
      { key: 'muhendisUnvan', label: 'Mühendis Ünvanı', type: 'text' },
      { key: 'tcKimlikNo', label: 'TC Kimlik No', type: 'text' },
      { key: 'emoSicilNo', label: 'EMO Sicil No', type: 'text' },
      { key: 'smmTescilNo', label: 'SMM Tescil No', type: 'text' },
      { key: 'isletmeBelgeNo', label: 'İşletme Belge No', type: 'text' },
      { key: 'belgeGecerlilik', label: 'Belge Geçerlilik Tarihi', type: 'date' },
      { key: 'muhendisIletisim', label: 'Mühendis İletişim', type: 'text' },
      { key: 'kuruluGuc', label: 'Kurulu Güç', type: 'text' },
      { key: 'gerilimSeviyesi', label: 'Gerilim Seviyesi', type: 'text' },
      { key: 'trafoMerkezi', label: 'Trafo Merkezi', type: 'text' },
      { key: 'gucTrafosu', label: 'Güç Trafosu', type: 'text' },
      { key: 'ogHucre', label: 'OG Hücre', type: 'text' },
      { key: 'yetkiliUnvan', label: 'Yetkili Ünvanı', type: 'text' },
      { key: 'turbinGucu', label: 'Türbin Gücü (MW)', type: 'text', dependsOn: { field: 'facilityType', value: 'RES' } },
      { key: 'panelKapasitesi', label: 'Panel Kapasitesi (MW)', type: 'text', dependsOn: { field: 'facilityType', value: 'GES' } },
      { key: 'barajTipi', label: 'Baraj Tipi', type: 'text', dependsOn: { field: 'facilityType', value: 'HES' } },
      { key: 'komurTipi', label: 'Kömür Tipi', type: 'text', dependsOn: { field: 'facilityType', value: 'Termik' } }
    ]
  }
];
