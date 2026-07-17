import { DocumentTemplate, SubscriptionPlan } from './types';

export const APP_NAME = "İSG Zeyron";

export const PLANS = [
  {
    id: SubscriptionPlan.MONTHLY,
    name: "Aylï¿½k Paket",
    price: "499 TL",
    period: "/ay",
    features: ["Aylï¿½k 30 Dokï¿½man", "PDF ï¿½ï¿½ktï¿½sï¿½", "Temel ï¿½ablonlar", "E-posta Destek"],
    limit: 30,
  },
  {
    id: SubscriptionPlan.YEARLY,
    name: "Yï¿½llï¿½k Pro",
    price: "4.999 TL",
    period: "/yï¿½l",
    features: ["Sï¿½nï¿½rsï¿½z Dokï¿½man", "Tï¿½m Premium ï¿½ablonlar", "ï¿½ncelikli Destek", "Fatura Entegrasyonu"],
    limit: 'UNLIMITED',
    popular: true,
  }
];

// 25-35 Document templates simulation
export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    "id": "doc_1",
    "title": "(RES, GES, HES, Termik)YÃ¼ksek Gerilim Ä°ÅŸletme SorumluluÄŸu Atama YazÄ±sÄ±Ä±x",
    "category": "Enerji Santralleri",
    "description": "Bu dokÃ¼man Enerji Santralleri kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Enerji Santralleri/(RES, GES, HES, Termik)YÃ¼ksek Gerilim Ä°ÅŸletme SorumluluÄŸu Atama YazÄ±sÄ±Ä±.docx",
    "fields": [
      {
        "key": "Gp",
        "label": "Gp",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_2",
    "title": "EKAT Yetki Belgesi Takip Cizelgesi Sablonux",
    "category": "Enerji Santralleri",
    "description": "Bu dokÃ¼man Enerji Santralleri kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Enerji Santralleri/EKAT_Yetki_Belgesi_Takip_Cizelgesi_Sablonu.docx",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_3",
    "title": "LOTO Formu Sablon",
    "category": "Fabrikalar ve Ä°malathaneler",
    "description": "Bu dokÃ¼man Fabrikalar ve Ä°malathaneler kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve Ä°malathaneler/LOTO_Formu_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_4",
    "title": "LOTO Formu Sablon dosyalar",
    "category": "Fabrikalar ve Ä°malathaneler",
    "description": "Bu dokÃ¼man Fabrikalar ve Ä°malathaneler kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve Ä°malathaneler/LOTO_Formu_Sablon_dosyalar",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_5",
    "title": "PKD Sablon",
    "category": "Fabrikalar ve Ä°malathaneler",
    "description": "Bu dokÃ¼man Fabrikalar ve Ä°malathaneler kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve Ä°malathaneler/PKD_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_6",
    "title": "PKD Sablon dosyalar",
    "category": "Fabrikalar ve Ä°malathaneler",
    "description": "Bu dokÃ¼man Fabrikalar ve Ä°malathaneler kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Fabrikalar ve Ä°malathaneler/PKD_Sablon_dosyalar",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_7",
    "title": "Hijyen Sanitasyon Talimati Sablon",
    "category": "GÄ±da FabrikalarÄ±",
    "description": "Bu dokÃ¼man GÄ±da FabrikalarÄ± kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/GÄ±da FabrikalarÄ±/Hijyen_Sanitasyon_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_8",
    "title": "Soguk Oda Talimati Sablon",
    "category": "GÄ±da FabrikalarÄ±",
    "description": "Bu dokÃ¼man GÄ±da FabrikalarÄ± kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/GÄ±da FabrikalarÄ±/Soguk_Oda_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligEdenGorevi",
        "label": "tebligEdenGorevi",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugEdenGoreviSicil",
        "label": "tebellugEdenGoreviSicil",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_9",
    "title": "Apron Guvenligi Talimati Sablon",
    "category": "Hava LimanlarÄ±",
    "description": "Bu dokÃ¼man Hava LimanlarÄ± kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Hava LimanlarÄ±/Apron_Guvenligi_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_10",
    "title": "Liman Operasyon Guvenlik Plani Sablon",
    "category": "Liman Ä°ÅŸletmeciliÄŸi",
    "description": "Bu dokÃ¼man Liman Ä°ÅŸletmeciliÄŸi kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Liman Ä°ÅŸletmeciliÄŸi/Liman_Operasyon_Guvenlik_Plani_Sablon.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_11",
    "title": "Liman Operasyon Guvenlik Plani Sablon dosyalar",
    "category": "Liman Ä°ÅŸletmeciliÄŸi",
    "description": "Bu dokÃ¼man Liman Ä°ÅŸletmeciliÄŸi kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Liman Ä°ÅŸletmeciliÄŸi/Liman_Operasyon_Guvenlik_Plani_Sablon_dosyalar",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_12",
    "title": "Lashing Talimati Sablon",
    "category": "Lojistik ve TaÅŸÄ±macÄ±lÄ±k YÃ¼kleme GÃ¼venliÄŸi",
    "description": "Bu dokÃ¼man Lojistik ve TaÅŸÄ±macÄ±lÄ±k YÃ¼kleme GÃ¼venliÄŸi kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Lojistik ve TaÅŸÄ±macÄ±lÄ±k YÃ¼kleme GÃ¼venliÄŸi/Lashing_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNo",
        "label": "revizyonNo",
        "type": "text"
      },
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      },
      {
        "key": "kontrolTarihi",
        "label": "kontrolTarihi",
        "type": "date"
      },
      {
        "key": "seferNo",
        "label": "seferNo",
        "type": "text"
      },
      {
        "key": "aracPlakasi",
        "label": "aracPlakasi",
        "type": "text"
      },
      {
        "key": "dorseNo",
        "label": "dorseNo",
        "type": "text"
      },
      {
        "key": "surucuAdi",
        "label": "surucuAdi",
        "type": "text"
      },
      {
        "key": "konteynerNo",
        "label": "konteynerNo",
        "type": "text"
      },
      {
        "key": "yukCinsi",
        "label": "yukCinsi",
        "type": "text"
      },
      {
        "key": "toplamAgirlik",
        "label": "toplamAgirlik",
        "type": "text"
      },
      {
        "key": "yuklemeYeri",
        "label": "yuklemeYeri",
        "type": "text"
      },
      {
        "key": "bosaltmaYeri",
        "label": "bosaltmaYeri",
        "type": "text"
      },
      {
        "key": "kontrolMaddesi",
        "label": "kontrolMaddesi",
        "type": "text"
      },
      {
        "key": "evet",
        "label": "evet",
        "type": "text"
      },
      {
        "key": "hayir",
        "label": "hayir",
        "type": "text"
      },
      {
        "key": "ud",
        "label": "ud",
        "type": "text"
      },
      {
        "key": "aciklama",
        "label": "aciklama",
        "type": "text"
      },
      {
        "key": "yuklemeyiYapan",
        "label": "yuklemeyiYapan",
        "type": "text"
      },
      {
        "key": "yuklemeyiYapanGorevi",
        "label": "yuklemeyiYapanGorevi",
        "type": "text"
      },
      {
        "key": "kontrolEden",
        "label": "kontrolEden",
        "type": "text"
      },
      {
        "key": "kontrolEdenGorevi",
        "label": "kontrolEdenGorevi",
        "type": "text"
      },
      {
        "key": "onaylayan",
        "label": "onaylayan",
        "type": "text"
      },
      {
        "key": "onaylayanGorevi",
        "label": "onaylayanGorevi",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_13",
    "title": "Maden PKD Sablon",
    "category": "Maden Ä°ÅŸletmeleri",
    "description": "Bu dokÃ¼man Maden Ä°ÅŸletmeleri kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Maden Ä°ÅŸletmeleri/Maden_PKD_Sablon.doc",
    "fields": [
      {
        "key": "isletmeAdi",
        "label": "isletmeAdi",
        "type": "text"
      },
      {
        "key": "sgkSicilNo",
        "label": "sgkSicilNo",
        "type": "text"
      },
      {
        "key": "isyeriAdresi",
        "label": "isyeriAdresi",
        "type": "text"
      },
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNoTarihi",
        "label": "revizyonNoTarihi",
        "type": "date"
      },
      {
        "key": "hazirlayanAdSoyad",
        "label": "hazirlayanAdSoyad",
        "type": "text"
      },
      {
        "key": "onaylayanAdSoyad",
        "label": "onaylayanAdSoyad",
        "type": "text"
      },
      {
        "key": "revNo",
        "label": "revNo",
        "type": "text"
      },
      {
        "key": "revTarihi",
        "label": "revTarihi",
        "type": "date"
      },
      {
        "key": "revAciklama",
        "label": "revAciklama",
        "type": "text"
      },
      {
        "key": "revHazirlayan",
        "label": "revHazirlayan",
        "type": "text"
      },
      {
        "key": "revOnaylayan",
        "label": "revOnaylayan",
        "type": "text"
      },
      {
        "key": "faaliyetKonusu",
        "label": "faaliyetKonusu",
        "type": "text"
      },
      {
        "key": "uretimYontemi",
        "label": "uretimYontemi",
        "type": "text"
      },
      {
        "key": "calisanSayisi",
        "label": "calisanSayisi",
        "type": "text"
      },
      {
        "key": "vardiyaDuzeni",
        "label": "vardiyaDuzeni",
        "type": "text"
      },
      {
        "key": "ocakDerinligi",
        "label": "ocakDerinligi",
        "type": "text"
      },
      {
        "key": "havalandirmaSistemi",
        "label": "havalandirmaSistemi",
        "type": "text"
      },
      {
        "key": "metanIcerigi",
        "label": "metanIcerigi",
        "type": "text"
      },
      {
        "key": "komurTozuOzelligi",
        "label": "komurTozuOzelligi",
        "type": "text"
      },
      {
        "key": "zonNo",
        "label": "zonNo",
        "type": "text"
      },
      {
        "key": "alanEkipman",
        "label": "alanEkipman",
        "type": "text"
      },
      {
        "key": "yaniciMadde",
        "label": "yaniciMadde",
        "type": "text"
      },
      {
        "key": "salimDerecesi",
        "label": "salimDerecesi",
        "type": "text"
      },
      {
        "key": "zonTipi",
        "label": "zonTipi",
        "type": "text"
      },
      {
        "key": "zonAciklama",
        "label": "zonAciklama",
        "type": "text"
      },
      {
        "key": "riskNo",
        "label": "riskNo",
        "type": "text"
      },
      {
        "key": "tehlikeSenaryosu",
        "label": "tehlikeSenaryosu",
        "type": "text"
      },
      {
        "key": "mevcutDurum",
        "label": "mevcutDurum",
        "type": "text"
      },
      {
        "key": "olasilik",
        "label": "olasilik",
        "type": "text"
      },
      {
        "key": "siddet",
        "label": "siddet",
        "type": "text"
      },
      {
        "key": "riskSkoru",
        "label": "riskSkoru",
        "type": "text"
      },
      {
        "key": "alinacakOnlem",
        "label": "alinacakOnlem",
        "type": "text"
      },
      {
        "key": "kalanRisk",
        "label": "kalanRisk",
        "type": "text"
      },
      {
        "key": "hazirlayanGorevi",
        "label": "hazirlayanGorevi",
        "type": "text"
      },
      {
        "key": "kontrolEdenGorevi",
        "label": "kontrolEdenGorevi",
        "type": "text"
      },
      {
        "key": "onaylayanGorevi",
        "label": "onaylayanGorevi",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_14",
    "title": "Sicak Metal Transfer Talimati Sablon",
    "category": "Metal ve DÃ¶kÃ¼m",
    "description": "Bu dokÃ¼man Metal ve DÃ¶kÃ¼m kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/Metal ve DÃ¶kÃ¼m/Sicak_Metal_Transfer_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_15",
    "title": "Acil Durum Ekip Atama",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Acil_Durum_Ekip_Atama.doc",
    "fields": [
      {
        "key": "sirketIsmi",
        "label": "sirketIsmi",
        "type": "text"
      },
      {
        "key": "binaAdi",
        "label": "binaAdi",
        "type": "text"
      },
      {
        "key": "adSoyad",
        "label": "adSoyad",
        "type": "text"
      },
      {
        "key": "gorevi",
        "label": "gorevi",
        "type": "text"
      },
      {
        "key": "yetkiliIsim",
        "label": "yetkiliIsim",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_16",
    "title": "Acil Durum Eylem Plani Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Acil_Durum_Eylem_Plani_Sablon.doc",
    "fields": [
      {
        "key": "isyeriUnvani",
        "label": "isyeriUnvani",
        "type": "text"
      },
      {
        "key": "isyeriAdresi",
        "label": "isyeriAdresi",
        "type": "text"
      },
      {
        "key": "telefonFaks",
        "label": "telefonFaks",
        "type": "text"
      },
      {
        "key": "ePosta",
        "label": "ePosta",
        "type": "text"
      },
      {
        "key": "naceKodu",
        "label": "naceKodu",
        "type": "text"
      },
      {
        "key": "tehlikeSinifi",
        "label": "tehlikeSinifi",
        "type": "text"
      },
      {
        "key": "sgkSicilNo",
        "label": "sgkSicilNo",
        "type": "text"
      },
      {
        "key": "toplamCalisan",
        "label": "toplamCalisan",
        "type": "text"
      },
      {
        "key": "kadinCalisan",
        "label": "kadinCalisan",
        "type": "text"
      },
      {
        "key": "erkekCalisan",
        "label": "erkekCalisan",
        "type": "text"
      },
      {
        "key": "engelliCalisan",
        "label": "engelliCalisan",
        "type": "text"
      },
      {
        "key": "isverenVekili",
        "label": "isverenVekili",
        "type": "text"
      },
      {
        "key": "isgUzmani",
        "label": "isgUzmani",
        "type": "text"
      },
      {
        "key": "isyeriHekimi",
        "label": "isyeriHekimi",
        "type": "text"
      },
      {
        "key": "hazirlanmaTarihi",
        "label": "hazirlanmaTarihi",
        "type": "date"
      },
      {
        "key": "gecerlilikSuresi",
        "label": "gecerlilikSuresi",
        "type": "text"
      },
      {
        "key": "revizyonNoTarihi",
        "label": "revizyonNoTarihi",
        "type": "date"
      },
      {
        "key": "yapiSistemi",
        "label": "yapiSistemi",
        "type": "text"
      },
      {
        "key": "katSayisi",
        "label": "katSayisi",
        "type": "text"
      },
      {
        "key": "kullanimAlani",
        "label": "kullanimAlani",
        "type": "text"
      },
      {
        "key": "bolumlerBirimler",
        "label": "bolumlerBirimler",
        "type": "text"
      },
      {
        "key": "kacisYoluCikisSayisi",
        "label": "kacisYoluCikisSayisi",
        "type": "text"
      },
      {
        "key": "acilAydinlatma",
        "label": "acilAydinlatma",
        "type": "text"
      },
      {
        "key": "yanginAlgilama",
        "label": "yanginAlgilama",
        "type": "text"
      },
      {
        "key": "yanginSondurme",
        "label": "yanginSondurme",
        "type": "text"
      },
      {
        "key": "elektrikPanolari",
        "label": "elektrikPanolari",
        "type": "text"
      },
      {
        "key": "vanaNoktalari",
        "label": "vanaNoktalari",
        "type": "text"
      },
      {
        "key": "engelliDuzenlemeleri",
        "label": "engelliDuzenlemeleri",
        "type": "text"
      },
      {
        "key": "acilDurumTuru",
        "label": "acilDurumTuru",
        "type": "text"
      },
      {
        "key": "olasilik",
        "label": "olasilik",
        "type": "text"
      },
      {
        "key": "siddet",
        "label": "siddet",
        "type": "text"
      },
      {
        "key": "riskSkoru",
        "label": "riskSkoru",
        "type": "text"
      },
      {
        "key": "riskDuzeyi",
        "label": "riskDuzeyi",
        "type": "text"
      },
      {
        "key": "koordinatorAsilAd",
        "label": "koordinatorAsilAd",
        "type": "text"
      },
      {
        "key": "koordinatorAsilGorev",
        "label": "koordinatorAsilGorev",
        "type": "text"
      },
      {
        "key": "koordinatorAsilTel",
        "label": "koordinatorAsilTel",
        "type": "text"
      },
      {
        "key": "koordinatorYedekAd",
        "label": "koordinatorYedekAd",
        "type": "text"
      },
      {
        "key": "koordinatorYedekGorev",
        "label": "koordinatorYedekGorev",
        "type": "text"
      },
      {
        "key": "koordinatorYedekTel",
        "label": "koordinatorYedekTel",
        "type": "text"
      },
      {
        "key": "siraNo",
        "label": "siraNo",
        "type": "text"
      },
      {
        "key": "adSoyad",
        "label": "adSoyad",
        "type": "text"
      },
      {
        "key": "gorevUnvan",
        "label": "gorevUnvan",
        "type": "text"
      },
      {
        "key": "telefon",
        "label": "telefon",
        "type": "text"
      },
      {
        "key": "egitimTarihi",
        "label": "egitimTarihi",
        "type": "date"
      },
      {
        "key": "sertifikaBilgisi",
        "label": "sertifikaBilgisi",
        "type": "text"
      },
      {
        "key": "birincilToplanmaYeri",
        "label": "birincilToplanmaYeri",
        "type": "text"
      },
      {
        "key": "ikincilToplanmaYeri",
        "label": "ikincilToplanmaYeri",
        "type": "text"
      },
      {
        "key": "toplanmaSorumlusu",
        "label": "toplanmaSorumlusu",
        "type": "text"
      },
      {
        "key": "sayimYontemi",
        "label": "sayimYontemi",
        "type": "text"
      },
      {
        "key": "tabelaIsaretleme",
        "label": "tabelaIsaretleme",
        "type": "text"
      },
      {
        "key": "kurulusKisi",
        "label": "kurulusKisi",
        "type": "text"
      },
      {
        "key": "telefonNo",
        "label": "telefonNo",
        "type": "text"
      },
      {
        "key": "aciklama",
        "label": "aciklama",
        "type": "text"
      },
      {
        "key": "isgUzmaniAd",
        "label": "isgUzmaniAd",
        "type": "text"
      },
      {
        "key": "isgSertifikaNo",
        "label": "isgSertifikaNo",
        "type": "text"
      },
      {
        "key": "onayTarihi",
        "label": "onayTarihi",
        "type": "date"
      },
      {
        "key": "hekimAd",
        "label": "hekimAd",
        "type": "text"
      },
      {
        "key": "hekimDiplomaNo",
        "label": "hekimDiplomaNo",
        "type": "text"
      },
      {
        "key": "isverenAd",
        "label": "isverenAd",
        "type": "text"
      },
      {
        "key": "isverenUnvan",
        "label": "isverenUnvan",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_17",
    "title": "Calisan Temsilcisi Atama Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Calisan_Temsilcisi_Atama_Sablon.doc",
    "fields": [
      {
        "key": "sirketUnvani",
        "label": "sirketUnvani",
        "type": "text"
      },
      {
        "key": "evrakNo",
        "label": "evrakNo",
        "type": "text"
      },
      {
        "key": "tarih",
        "label": "tarih",
        "type": "date"
      },
      {
        "key": "temsilciAdSoyad",
        "label": "temsilciAdSoyad",
        "type": "text"
      },
      {
        "key": "tcKimlikNo",
        "label": "tcKimlikNo",
        "type": "text"
      },
      {
        "key": "sicilNo",
        "label": "sicilNo",
        "type": "text"
      },
      {
        "key": "gorevi",
        "label": "gorevi",
        "type": "text"
      },
      {
        "key": "isverenAdSoyad",
        "label": "isverenAdSoyad",
        "type": "text"
      },
      {
        "key": "isverenUnvan",
        "label": "isverenUnvan",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_18",
    "title": "Destek Elemani Atama Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Destek_Elemani_Atama_Sablon.doc",
    "fields": [
      {
        "key": "sirketUnvani",
        "label": "sirketUnvani",
        "type": "text"
      },
      {
        "key": "evrakNo",
        "label": "evrakNo",
        "type": "text"
      },
      {
        "key": "tarih",
        "label": "tarih",
        "type": "date"
      },
      {
        "key": "destekElemanAdSoyad",
        "label": "destekElemanAdSoyad",
        "type": "text"
      },
      {
        "key": "tcKimlikNo",
        "label": "tcKimlikNo",
        "type": "text"
      },
      {
        "key": "sicilNo",
        "label": "sicilNo",
        "type": "text"
      },
      {
        "key": "gorevi",
        "label": "gorevi",
        "type": "text"
      },
      {
        "key": "gorevAlani",
        "label": "gorevAlani",
        "type": "text"
      },
      {
        "key": "isverenAdSoyad",
        "label": "isverenAdSoyad",
        "type": "text"
      },
      {
        "key": "isverenUnvan",
        "label": "isverenUnvan",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_19",
    "title": "ISG Kurul Tutanagi Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/ISG_Kurul_Tutanagi_Sablon.doc",
    "fields": [
      {
        "key": "toplantiNo",
        "label": "toplantiNo",
        "type": "text"
      },
      {
        "key": "tarihSaat",
        "label": "tarihSaat",
        "type": "date"
      },
      {
        "key": "toplantiYeri",
        "label": "toplantiYeri",
        "type": "text"
      },
      {
        "key": "baskanAd",
        "label": "baskanAd",
        "type": "text"
      },
      {
        "key": "adSoyad",
        "label": "adSoyad",
        "type": "text"
      },
      {
        "key": "gorevi",
        "label": "gorevi",
        "type": "text"
      },
      {
        "key": "durum",
        "label": "durum",
        "type": "text"
      },
      {
        "key": "siraNo",
        "label": "siraNo",
        "type": "text"
      },
      {
        "key": "konu",
        "label": "konu",
        "type": "text"
      },
      {
        "key": "kararNo",
        "label": "kararNo",
        "type": "text"
      },
      {
        "key": "karar",
        "label": "karar",
        "type": "text"
      },
      {
        "key": "sorumlu",
        "label": "sorumlu",
        "type": "text"
      },
      {
        "key": "termin",
        "label": "termin",
        "type": "text"
      },
      {
        "key": "raportorAd",
        "label": "raportorAd",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_20",
    "title": "Isyeri Hijyen Sanitasyon Talimati Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Isyeri_Hijyen_Sanitasyon_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligEdenGorevi",
        "label": "tebligEdenGorevi",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugEdenGorevi",
        "label": "tebellugEdenGorevi",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_21",
    "title": "Kaza RamakKala Bildirim Detayli Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Kaza_RamakKala_Bildirim_Detayli_Sablon.doc",
    "fields": [
      {
        "key": "formNo",
        "label": "formNo",
        "type": "text"
      },
      {
        "key": "revizyonNo",
        "label": "revizyonNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "olaySiraNo",
        "label": "olaySiraNo",
        "type": "text"
      },
      {
        "key": "isyeriUnvani",
        "label": "isyeriUnvani",
        "type": "text"
      },
      {
        "key": "sgkSicilNo",
        "label": "sgkSicilNo",
        "type": "text"
      },
      {
        "key": "isyeriAdresi",
        "label": "isyeriAdresi",
        "type": "text"
      },
      {
        "key": "naceKodu",
        "label": "naceKodu",
        "type": "text"
      },
      {
        "key": "tehlikeSinifi",
        "label": "tehlikeSinifi",
        "type": "text"
      },
      {
        "key": "olayTarihiSaati",
        "label": "olayTarihiSaati",
        "type": "date"
      },
      {
        "key": "ogrenilmeTarihiSaati",
        "label": "ogrenilmeTarihiSaati",
        "type": "date"
      },
      {
        "key": "olayYeri",
        "label": "olayYeri",
        "type": "text"
      },
      {
        "key": "vardiya",
        "label": "vardiya",
        "type": "text"
      },
      {
        "key": "ortamKosullari",
        "label": "ortamKosullari",
        "type": "text"
      },
      {
        "key": "kazazedeAdSoyad",
        "label": "kazazedeAdSoyad",
        "type": "text"
      },
      {
        "key": "kazazedeTc",
        "label": "kazazedeTc",
        "type": "text"
      },
      {
        "key": "kazazedeDogumYasi",
        "label": "kazazedeDogumYasi",
        "type": "text"
      },
      {
        "key": "kazazedeGorevi",
        "label": "kazazedeGorevi",
        "type": "text"
      },
      {
        "key": "kazazedeIseGiris",
        "label": "kazazedeIseGiris",
        "type": "text"
      },
      {
        "key": "kazazedeKidem",
        "label": "kazazedeKidem",
        "type": "text"
      },
      {
        "key": "iseBaslamaEgitimi",
        "label": "iseBaslamaEgitimi",
        "type": "text"
      },
      {
        "key": "sonTemelIsgEgitimi",
        "label": "sonTemelIsgEgitimi",
        "type": "text"
      },
      {
        "key": "sonPeriyodikMuayene",
        "label": "sonPeriyodikMuayene",
        "type": "text"
      },
      {
        "key": "kkdDurumu",
        "label": "kkdDurumu",
        "type": "text"
      },
      {
        "key": "olayAnlatimi",
        "label": "olayAnlatimi",
        "type": "text"
      },
      {
        "key": "kazaTipi",
        "label": "kazaTipi",
        "type": "text"
      },
      {
        "key": "yaralanmaTuru",
        "label": "yaralanmaTuru",
        "type": "text"
      },
      {
        "key": "vucuttakiYeri",
        "label": "vucuttakiYeri",
        "type": "text"
      },
      {
        "key": "ilkMudahale",
        "label": "ilkMudahale",
        "type": "text"
      },
      {
        "key": "sevkDurumu",
        "label": "sevkDurumu",
        "type": "text"
      },
      {
        "key": "tibbiSonucIstirahat",
        "label": "tibbiSonucIstirahat",
        "type": "text"
      },
      {
        "key": "taniklar",
        "label": "taniklar",
        "type": "text"
      },
      {
        "key": "bildirimMercii",
        "label": "bildirimMercii",
        "type": "text"
      },
      {
        "key": "yasalSure",
        "label": "yasalSure",
        "type": "text"
      },
      {
        "key": "yapilanTarih",
        "label": "yapilanTarih",
        "type": "date"
      },
      {
        "key": "durum",
        "label": "durum",
        "type": "text"
      },
      {
        "key": "nedenSorusu",
        "label": "nedenSorusu",
        "type": "text"
      },
      {
        "key": "nedenCevabi",
        "label": "nedenCevabi",
        "type": "text"
      },
      {
        "key": "dofNo",
        "label": "dofNo",
        "type": "text"
      },
      {
        "key": "faaliyet",
        "label": "faaliyet",
        "type": "text"
      },
      {
        "key": "tur",
        "label": "tur",
        "type": "text"
      },
      {
        "key": "sorumlu",
        "label": "sorumlu",
        "type": "text"
      },
      {
        "key": "termin",
        "label": "termin",
        "type": "text"
      },
      {
        "key": "isgUzmaniAd",
        "label": "isgUzmaniAd",
        "type": "text"
      },
      {
        "key": "onayTarihi",
        "label": "onayTarihi",
        "type": "date"
      },
      {
        "key": "isyeriHekimiAd",
        "label": "isyeriHekimiAd",
        "type": "text"
      },
      {
        "key": "calisanTemsilcisiAd",
        "label": "calisanTemsilcisiAd",
        "type": "text"
      },
      {
        "key": "birimAmiriAd",
        "label": "birimAmiriAd",
        "type": "text"
      },
      {
        "key": "isverenAd",
        "label": "isverenAd",
        "type": "text"
      },
      {
        "key": "rkBildirimNo",
        "label": "rkBildirimNo",
        "type": "text"
      },
      {
        "key": "rkBildirimTarihiSaati",
        "label": "rkBildirimTarihiSaati",
        "type": "date"
      },
      {
        "key": "rkOlayTarihiSaati",
        "label": "rkOlayTarihiSaati",
        "type": "date"
      },
      {
        "key": "rkBildiren",
        "label": "rkBildiren",
        "type": "text"
      },
      {
        "key": "rkOlayYeri",
        "label": "rkOlayYeri",
        "type": "text"
      },
      {
        "key": "rkOlayTuru",
        "label": "rkOlayTuru",
        "type": "text"
      },
      {
        "key": "rkOlayAnlatimi",
        "label": "rkOlayAnlatimi",
        "type": "text"
      },
      {
        "key": "rkOlasiSonuc",
        "label": "rkOlasiSonuc",
        "type": "text"
      },
      {
        "key": "rkPotansiyelSiddet",
        "label": "rkPotansiyelSiddet",
        "type": "text"
      },
      {
        "key": "rkOlasilik",
        "label": "rkOlasilik",
        "type": "text"
      },
      {
        "key": "rkRiskOnceligi",
        "label": "rkRiskOnceligi",
        "type": "text"
      },
      {
        "key": "rkDofNo",
        "label": "rkDofNo",
        "type": "text"
      },
      {
        "key": "rkFaaliyet",
        "label": "rkFaaliyet",
        "type": "text"
      },
      {
        "key": "rkTur",
        "label": "rkTur",
        "type": "text"
      },
      {
        "key": "rkSorumlu",
        "label": "rkSorumlu",
        "type": "text"
      },
      {
        "key": "rkTermin",
        "label": "rkTermin",
        "type": "text"
      },
      {
        "key": "rkDurum",
        "label": "rkDurum",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_22",
    "title": "Personel ISG Ihtar Detayli Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Personel_ISG_Ihtar_Detayli_Sablon.doc",
    "fields": [
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNo",
        "label": "revizyonNo",
        "type": "text"
      },
      {
        "key": "isyeriUnvani",
        "label": "isyeriUnvani",
        "type": "text"
      },
      {
        "key": "sgkSicilNo",
        "label": "sgkSicilNo",
        "type": "text"
      },
      {
        "key": "isyeriAdresi",
        "label": "isyeriAdresi",
        "type": "text"
      },
      {
        "key": "tehlikeSinifi",
        "label": "tehlikeSinifi",
        "type": "text"
      },
      {
        "key": "isgKatipOsgb",
        "label": "isgKatipOsgb",
        "type": "text"
      },
      {
        "key": "personelAdSoyad",
        "label": "personelAdSoyad",
        "type": "text"
      },
      {
        "key": "personelTc",
        "label": "personelTc",
        "type": "text"
      },
      {
        "key": "personelSgkSicil",
        "label": "personelSgkSicil",
        "type": "text"
      },
      {
        "key": "personelGorevi",
        "label": "personelGorevi",
        "type": "text"
      },
      {
        "key": "personelBolumu",
        "label": "personelBolumu",
        "type": "text"
      },
      {
        "key": "personelIseGiris",
        "label": "personelIseGiris",
        "type": "text"
      },
      {
        "key": "uyariTarihiSaati",
        "label": "uyariTarihiSaati",
        "type": "date"
      },
      {
        "key": "kacinciUyari",
        "label": "kacinciUyari",
        "type": "text"
      },
      {
        "key": "oncekiUyariTarihi",
        "label": "oncekiUyariTarihi",
        "type": "date"
      },
      {
        "key": "uyariTuru",
        "label": "uyariTuru",
        "type": "text"
      },
      {
        "key": "yasalDayanak",
        "label": "yasalDayanak",
        "type": "text"
      },
      {
        "key": "olayTarihiSaati",
        "label": "olayTarihiSaati",
        "type": "date"
      },
      {
        "key": "olayYeri",
        "label": "olayYeri",
        "type": "text"
      },
      {
        "key": "uygunsuzluk1",
        "label": "uygunsuzluk1",
        "type": "text"
      },
      {
        "key": "uygunsuzluk2",
        "label": "uygunsuzluk2",
        "type": "text"
      },
      {
        "key": "uygunsuzluk3",
        "label": "uygunsuzluk3",
        "type": "text"
      },
      {
        "key": "personelSavunmasi",
        "label": "personelSavunmasi",
        "type": "text"
      },
      {
        "key": "isgUzmaniAd",
        "label": "isgUzmaniAd",
        "type": "text"
      },
      {
        "key": "isverenAd",
        "label": "isverenAd",
        "type": "text"
      },
      {
        "key": "tanikAd",
        "label": "tanikAd",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_23",
    "title": "SERTÄ°FÄ°KA",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/SERTÄ°FÄ°KA.doc",
    "fields": [
      {
        "key": "companyName",
        "label": "Firma AdÄ±",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_24",
    "title": "Yangindan Korunma Dokumani Sablon",
    "category": "STANDART DOKÃœMANLAR",
    "description": "Bu dokÃ¼man STANDART DOKÃœMANLAR kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/STANDART DOKÃœMANLAR/Yangindan_Korunma_Dokumani_Sablon.doc",
    "fields": [
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNoTarihi",
        "label": "revizyonNoTarihi",
        "type": "date"
      },
      {
        "key": "kapsamAlanlari",
        "label": "kapsamAlanlari",
        "type": "text"
      },
      {
        "key": "revNo",
        "label": "revNo",
        "type": "text"
      },
      {
        "key": "revTarihi",
        "label": "revTarihi",
        "type": "date"
      },
      {
        "key": "revOzeti",
        "label": "revOzeti",
        "type": "text"
      },
      {
        "key": "revHazirlayan",
        "label": "revHazirlayan",
        "type": "text"
      },
      {
        "key": "revOnaylayan",
        "label": "revOnaylayan",
        "type": "text"
      },
      {
        "key": "isyeriUnvani",
        "label": "isyeriUnvani",
        "type": "text"
      },
      {
        "key": "riskNo",
        "label": "riskNo",
        "type": "text"
      },
      {
        "key": "tehlikeKaynagi",
        "label": "tehlikeKaynagi",
        "type": "text"
      },
      {
        "key": "olasiTehlike",
        "label": "olasiTehlike",
        "type": "text"
      },
      {
        "key": "olasilik",
        "label": "olasilik",
        "type": "text"
      },
      {
        "key": "siddet",
        "label": "siddet",
        "type": "text"
      },
      {
        "key": "riskSkoru",
        "label": "riskSkoru",
        "type": "text"
      },
      {
        "key": "mevcutOnlem",
        "label": "mevcutOnlem",
        "type": "text"
      },
      {
        "key": "onerilenOnlem",
        "label": "onerilenOnlem",
        "type": "text"
      },
      {
        "key": "sistemNo",
        "label": "sistemNo",
        "type": "text"
      },
      {
        "key": "lokasyon",
        "label": "lokasyon",
        "type": "text"
      },
      {
        "key": "sistemTipi",
        "label": "sistemTipi",
        "type": "text"
      },
      {
        "key": "kapasiteAdet",
        "label": "kapasiteAdet",
        "type": "text"
      },
      {
        "key": "sonKontrol",
        "label": "sonKontrol",
        "type": "text"
      },
      {
        "key": "durum",
        "label": "durum",
        "type": "text"
      },
      {
        "key": "ekipAdi",
        "label": "ekipAdi",
        "type": "text"
      },
      {
        "key": "gorevTanimi",
        "label": "gorevTanimi",
        "type": "text"
      },
      {
        "key": "liderAsil",
        "label": "liderAsil",
        "type": "text"
      },
      {
        "key": "liderYedek",
        "label": "liderYedek",
        "type": "text"
      },
      {
        "key": "uyeSayisi",
        "label": "uyeSayisi",
        "type": "text"
      },
      {
        "key": "egitimAdi",
        "label": "egitimAdi",
        "type": "text"
      },
      {
        "key": "hedefKitle",
        "label": "hedefKitle",
        "type": "text"
      },
      {
        "key": "sure",
        "label": "sure",
        "type": "text"
      },
      {
        "key": "periyot",
        "label": "periyot",
        "type": "text"
      },
      {
        "key": "sorumlu",
        "label": "sorumlu",
        "type": "text"
      },
      {
        "key": "hazirlayanGorevi",
        "label": "hazirlayanGorevi",
        "type": "text"
      },
      {
        "key": "kontrolEdenGorevi",
        "label": "kontrolEdenGorevi",
        "type": "text"
      },
      {
        "key": "onaylayanGorevi",
        "label": "onaylayanGorevi",
        "type": "text"
      }
    ]
  },
  {
    "id": "doc_25",
    "title": "Orman Kesim Proseduru Sablon",
    "category": "TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k",
    "description": "Bu dokÃ¼man TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k/Orman_Kesim_Proseduru_Sablon.doc",
    "fields": [
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNo",
        "label": "revizyonNo",
        "type": "text"
      },
      {
        "key": "sayfaNo",
        "label": "sayfaNo",
        "type": "text"
      },
      {
        "key": "revNo",
        "label": "revNo",
        "type": "text"
      },
      {
        "key": "revTarihi",
        "label": "revTarihi",
        "type": "date"
      },
      {
        "key": "revAciklama",
        "label": "revAciklama",
        "type": "text"
      },
      {
        "key": "revHazirlayan",
        "label": "revHazirlayan",
        "type": "text"
      },
      {
        "key": "hazirlayanAdSoyad",
        "label": "hazirlayanAdSoyad",
        "type": "text"
      },
      {
        "key": "kontrolEdenAdSoyad",
        "label": "kontrolEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "onaylayanAdSoyad",
        "label": "onaylayanAdSoyad",
        "type": "text"
      },
      {
        "key": "siraNo",
        "label": "siraNo",
        "type": "text"
      },
      {
        "key": "kkdAdi",
        "label": "kkdAdi",
        "type": "text"
      },
      {
        "key": "ilgiliStandart",
        "label": "ilgiliStandart",
        "type": "text"
      },
      {
        "key": "kullanimZorunlulugu",
        "label": "kullanimZorunlulugu",
        "type": "text"
      },
      {
        "key": "kontrolDurumu",
        "label": "kontrolDurumu",
        "type": "text"
      },
      {
        "key": "kontrolMaddesi",
        "label": "kontrolMaddesi",
        "type": "text"
      },
      {
        "key": "evetDurumu",
        "label": "evetDurumu",
        "type": "text"
      },
      {
        "key": "hayirDurumu",
        "label": "hayirDurumu",
        "type": "text"
      },
      {
        "key": "aciklama",
        "label": "aciklama",
        "type": "text"
      },
      {
        "key": "kontrolYapanAd",
        "label": "kontrolYapanAd",
        "type": "text"
      },
      {
        "key": "kontrolTarihi",
        "label": "kontrolTarihi",
        "type": "date"
      }
    ]
  },
  {
    "id": "doc_26",
    "title": "Pestisit Talimati Sablon",
    "category": "TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k",
    "description": "Bu dokÃ¼man TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k kategorisive Ã¶zel Ä°SG Zeyron ÅŸablonudur.",
    "isPremium": false,
    "fileUrl": "/templates/TarÄ±m, HayvancÄ±lÄ±k ve OrmancÄ±lÄ±k/Pestisit_Talimati_Sablon.doc",
    "fields": [
      {
        "key": "dokumanNo",
        "label": "dokumanNo",
        "type": "text"
      },
      {
        "key": "yayinTarihi",
        "label": "yayinTarihi",
        "type": "date"
      },
      {
        "key": "revizyonNo",
        "label": "revizyonNo",
        "type": "text"
      },
      {
        "key": "sayfaNo",
        "label": "sayfaNo",
        "type": "text"
      },
      {
        "key": "tebligEdenAdSoyad",
        "label": "tebligEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebligTarihi",
        "label": "tebligTarihi",
        "type": "date"
      },
      {
        "key": "tebellugEdenAdSoyad",
        "label": "tebellugEdenAdSoyad",
        "type": "text"
      },
      {
        "key": "tebellugTarihi",
        "label": "tebellugTarihi",
        "type": "date"
      }
    ]
  }
];
