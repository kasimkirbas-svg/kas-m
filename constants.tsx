import { DocumentTemplate, SubscriptionPlan } from './types';

export const APP_NAME = "K�rba� Dok�man";

export const PLANS = [
  {
    id: SubscriptionPlan.MONTHLY,
    name: "Ayl�k Paket",
    price: "499 TL",
    period: "/ay",
    features: ["Ayl�k 30 Dok�man", "PDF ��kt�s�", "Temel �ablonlar", "E-posta Destek"],
    limit: 30,
  },
  {
    id: SubscriptionPlan.YEARLY,
    name: "Y�ll�k Pro",
    price: "4.999 TL",
    period: "/y�l",
    features: ["S�n�rs�z Dok�man", "T�m Premium �ablonlar", "�ncelikli Destek", "Fatura Entegrasyonu"],
    limit: 'UNLIMITED',
    popular: true,
  }
];

// 25-35 Document templates simulation
export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    "id": "doc_1",
    "title": "(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısııx",
    "category": "Enerji Santralleri",
    "description": "Bu doküman Enerji Santralleri kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Enerji Santralleri/(RES, GES, HES, Termik)Yüksek Gerilim İşletme Sorumluluğu Atama Yazısıı.docx",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_2",
    "title": "EKAT Yetki Belgesi Takip Cizelgesi Sablonux",
    "category": "Enerji Santralleri",
    "description": "Bu doküman Enerji Santralleri kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Enerji Santralleri/EKAT_Yetki_Belgesi_Takip_Cizelgesi_Sablonu.docx",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_3",
    "title": "LOTO Formu Sablon",
    "category": "Fabrikalar ve İmalathaneler",
    "description": "Bu doküman Fabrikalar ve İmalathaneler kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve İmalathaneler/LOTO_Formu_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_4",
    "title": "PKD Sablon",
    "category": "Fabrikalar ve İmalathaneler",
    "description": "Bu doküman Fabrikalar ve İmalathaneler kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve İmalathaneler/PKD_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_5",
    "title": "Hijyen Sanitasyon Talimati Sablon",
    "category": "Gıda Fabrikaları",
    "description": "Bu doküman Gıda Fabrikaları kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Gıda Fabrikaları/Hijyen_Sanitasyon_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_6",
    "title": "Soguk Oda Talimati Sablon",
    "category": "Gıda Fabrikaları",
    "description": "Bu doküman Gıda Fabrikaları kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Gıda Fabrikaları/Soguk_Oda_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_7",
    "title": "Apron Guvenligi Talimati Sablon",
    "category": "Hava Limanları",
    "description": "Bu doküman Hava Limanları kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Hava Limanları/Apron_Guvenligi_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_8",
    "title": "Liman Operasyon Guvenlik Plani Sablon",
    "category": "Liman İşletmeciliği",
    "description": "Bu doküman Liman İşletmeciliği kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Liman İşletmeciliği/Liman_Operasyon_Guvenlik_Plani_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_9",
    "title": "Lashing Talimati Sablon",
    "category": "Lojistik ve Taşımacılık Yükleme Güvenliği",
    "description": "Bu doküman Lojistik ve Taşımacılık Yükleme Güvenliği kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Lojistik ve Taşımacılık Yükleme Güvenliği/Lashing_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_10",
    "title": "Maden PKD Sablon",
    "category": "Maden İşletmeleri",
    "description": "Bu doküman Maden İşletmeleri kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Maden İşletmeleri/Maden_PKD_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_11",
    "title": "Sicak Metal Transfer Talimati Sablon",
    "category": "Metal ve Döküm",
    "description": "Bu doküman Metal ve Döküm kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Metal ve Döküm/Sicak_Metal_Transfer_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_12",
    "title": "Acil Durum Ekip Atama",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Acil_Durum_Ekip_Atama.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_13",
    "title": "Acil Durum Eylem Plani Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Acil_Durum_Eylem_Plani_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_14",
    "title": "Calisan Temsilcisi Atama Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Calisan_Temsilcisi_Atama_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_15",
    "title": "Destek Elemani Atama Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Destek_Elemani_Atama_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_16",
    "title": "ISG Kurul Tutanagi Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/ISG_Kurul_Tutanagi_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_17",
    "title": "Isyeri Hijyen Sanitasyon Talimati Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Isyeri_Hijyen_Sanitasyon_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_18",
    "title": "Kaza RamakKala Bildirim Detayli Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Kaza_RamakKala_Bildirim_Detayli_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_19",
    "title": "Personel ISG Ihtar Detayli Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Personel_ISG_Ihtar_Detayli_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_20",
    "title": "SERTİFİKA",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/SERTİFİKA.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_21",
    "title": "Yangindan Korunma Dokumani Sablon",
    "category": "STANDART DOKÜMANLAR",
    "description": "Bu doküman STANDART DOKÜMANLAR kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÜMANLAR/Yangindan_Korunma_Dokumani_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_22",
    "title": "Orman Kesim Proseduru Sablon",
    "category": "Tarım, Hayvancılık ve Ormancılık",
    "description": "Bu doküman Tarım, Hayvancılık ve Ormancılık kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Tarım, Hayvancılık ve Ormancılık/Orman_Kesim_Proseduru_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_23",
    "title": "Pestisit Talimati Sablon",
    "category": "Tarım, Hayvancılık ve Ormancılık",
    "description": "Bu doküman Tarım, Hayvancılık ve Ormancılık kategorisine ait otomatik tanımlanmış bir şablondur.",
    "isPremium": false,
    "fileUrl": "/templates/Tarım, Hayvancılık ve Ormancılık/Pestisit_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma Adı",
        "type": "text",
        "placeholder": "Kırbaş A.Ş."
      },
      {
        "key": "date",
        "label": "Tarih",
        "type": "date"
      }
    ]
  }
];
