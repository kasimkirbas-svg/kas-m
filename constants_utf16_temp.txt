/* Replace constants completely to correct encoding */
import { DocumentTemplate, SubscriptionPlan } from './types';

export const APP_NAME = "İSG Zeyron";

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
    limit: "UNLIMITED",
    popular: true,
  }
];

export const MOCK_TEMPLATES: DocumentTemplate[] = [
{ id: '1', title: '(RES, GES, HES, Termik) Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı', category: 'Enerji Santralleri', fileUrl: '/templates/(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '2', title: 'Acil Durum Ekip Atama', category: 'Genel', fileUrl: '/templates/Acil_Durum_Ekip_Atama.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '3', title: 'Acil Durum Eylem Planı', category: 'Genel', fileUrl: '/templates/Acil_Durum_Eylem_Plani_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '4', title: 'Apron Güvenliği Talimatı', category: 'Havacılık', fileUrl: '/templates/Apron_Guvenligi_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '5', title: 'Çalışan Temsilcisi Atama', category: 'İnsan Kaynakları', fileUrl: '/templates/Calisan_Temsilcisi_Atama_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '6', title: 'Destek Elemanı Atama', category: 'İnsan Kaynakları', fileUrl: '/templates/Destek_Elemani_Atama_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '7', title: 'EKAT Yetki Belgesi Takip Çizelgesi', category: 'Enerji Santralleri', fileUrl: '/templates/EKAT_Yetki_Belgesi_Takip_Cizelgesi_Sablonu.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '8', title: 'Hijyen Sanitasyon Talimatı', category: 'Sağlık / Gıda', fileUrl: '/templates/Hijyen_Sanitasyon_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '9', title: 'İSG Kurul Tutanağı', category: 'Genel', fileUrl: '/templates/ISG_Kurul_Tutanagi_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '10', title: 'İşyeri Hijyen Sanitasyon Talimatı', category: 'Sağlık / Gıda', fileUrl: '/templates/Isyeri_Hijyen_Sanitasyon_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '11', title: 'Kaza Ramak Kala Bildirim', category: 'Genel', fileUrl: '/templates/Kaza_RamakKala_Bildirim_Detayli_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '12', title: 'Liman Operasyon Güvenlik Planı', category: 'Liman İşletmeleri', fileUrl: '/templates/Liman_Operasyon_Guvenlik_Plani_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '13', title: 'LOTO Formu', category: 'Endüstri', fileUrl: '/templates/LOTO_Formu_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '14', title: 'Maden PKD', category: 'Maden', fileUrl: '/templates/Maden_PKD_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '15', title: 'Orman Kesim Prosedürü', category: 'Orman / Tarım', fileUrl: '/templates/Orman_Kesim_Proseduru_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '16', title: 'Personel İSG İhtar', category: 'İnsan Kaynakları', fileUrl: '/templates/Personel_ISG_Ihtar_Detayli_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '17', title: 'Pestisit Talimatı', category: 'Orman / Tarım', fileUrl: '/templates/Pestisit_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '18', title: 'PKD', category: 'Genel', fileUrl: '/templates/PKD_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '19', title: 'Sıcak Metal Transfer Talimatı', category: 'Metal', fileUrl: '/templates/Sicak_Metal_Transfer_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '20', title: 'Soğuk Oda Talimatı', category: 'Genel', fileUrl: '/templates/Soguk_Oda_Talimati_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] },
{ id: '21', title: 'Yangından Korunma Dokümanı', category: 'Genel', fileUrl: '/templates/Yangindan_Korunma_Dokumani_Sablon.docx', fields: [{key: 'companyName', label: 'Firma Adı', type: 'text', required: true}, {key: 'date', label: 'Tarih', type: 'date'}] }
];
