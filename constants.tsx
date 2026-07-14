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
      { key: 'turbinGucu', label: 'Türbin Gücü (MW)', type: 'text', dependsOn: { field: 'facilityType', value: 'RES' } },
      { key: 'panelKapasitesi', label: 'Panel Kapasitesi (MW)', type: 'text', dependsOn: { field: 'facilityType', value: 'GES' } },
      { key: 'barajTipi', label: 'Baraj Tipi', type: 'text', dependsOn: { field: 'facilityType', value: 'HES' } },
      { key: 'komurTipi', label: 'Kömür Tipi', type: 'text', dependsOn: { field: 'facilityType', value: 'Termik' } }
    ]
  }
];
