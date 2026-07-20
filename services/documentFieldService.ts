import { DocumentField } from '../types';

const DOCUMENT_TITLES: Record<string, string> = {
  doc_1: 'Yüksek Gerilim İşletme Sorumluluğu Atama Yazısı',
  doc_2: 'EKAT Yetki Belgesi Takip Çizelgesi',
  doc_3: 'LOTO Formu',
  doc_5: 'Patlamadan Korunma Dokümanı',
  doc_7: 'Hijyen ve Sanitasyon Talimatı',
  doc_8: 'Soğuk Oda Talimatı',
  doc_9: 'Apron Güvenliği Talimatı',
  doc_10: 'Liman Operasyon Güvenlik Planı',
  doc_12: 'Yük Bağlama (Lashing) Talimatı',
  doc_13: 'Maden Patlamadan Korunma Dokümanı',
  doc_14: 'Sıcak Metal Transfer Talimatı',
  doc_15: 'Acil Durum Ekip Atama Formu',
  doc_16: 'Acil Durum Eylem Planı',
  doc_17: 'Çalışan Temsilcisi Atama Formu',
  doc_18: 'Destek Elemanı Atama Formu',
  doc_19: 'İSG Kurul Toplantı Tutanağı',
  doc_20: 'İşyeri Hijyen ve Sanitasyon Talimatı',
  doc_21: 'Kaza ve Ramak Kala Bildirim Formu',
  doc_22: 'Personel İSG İhtar Formu',
  doc_23: 'İSG Eğitim Sertifikası',
  doc_24: 'Yangından Korunma Dokümanı',
  doc_25: 'Orman Kesim Prosedürü',
  doc_26: 'Pestisit Uygulama Talimatı',
};

export const getDocumentTitle = (id: string, fallback: string) => DOCUMENT_TITLES[id] || fallback;

export interface FieldSection {
  id: string;
  title: string;
  description: string;
  fields: DocumentField[];
}

const EXACT_LABELS: Record<string, string> = {
  logo: 'Firma Logosu',
  companyName: 'Firma / İşveren Ünvanı',
  date: 'Düzenleme Tarihi',
  preparedBy: 'Hazırlayan Ad Soyad',
  dokumanNo: 'Doküman No',
  formNo: 'Form No',
  revizyonNo: 'Revizyon No',
  yayinTarihi: 'Yayın Tarihi',
  evrakNo: 'Evrak No',
  tcKimlikNo: 'T.C. Kimlik No',
  sgkSicilNo: 'SGK Sicil No',
  emoSicilNo: 'EMO Sicil No',
  smmTescilNo: 'SMM Tescil No',
  eicKodu: 'EIC Kodu',
  naceKodu: 'NACE Kodu',
  isyeriUnvani: 'İşyeri Ünvanı',
  isyeriAdresi: 'İşyeri Adresi',
  tesisAdi: 'Tesis Adı',
  tesisAdresi: 'Tesis Adresi',
  muhendisAdSoyad: 'Mühendis Ad Soyad',
  muhendisUnvan: 'Mühendis Ünvanı',
  muhendisIletisim: 'Mühendis İletişim Bilgisi',
  kuruluGuc: 'Kurulu Güç',
  gerilimSeviyesi: 'Gerilim Seviyesi',
  trafoMerkezi: 'Trafo Merkezi',
  gucTrafosu: 'Güç Trafosu',
  ogHucre: 'OG Hücre Bilgisi',
  katilimcilar: 'Katılımcılar',
  gundem: 'Gündem Maddeleri',
  kararlar: 'Alınan Kararlar',
  kararNo: 'Karar No',
  raportorAd: 'Raportör Ad Soyad',
  adSoyad: 'Ad Soyad',
  gorevi: 'Görevi',
  durum: 'Katılım Durumu',
  termin: 'Termin Tarihi',
  tehlikeSinifi: 'Tehlike Sınıfı',
  olayTarihiSaati: 'Olay Tarihi ve Saati',
  ogrenilmeTarihiSaati: 'Öğrenilme Tarihi ve Saati',
  olayYeri: 'Olay Yeri',
  isRES: 'Santral Türü: RES',
  isGES: 'Santral Türü: GES',
  isHES: 'Santral Türü: HES',
  isTermik: 'Santral Türü: Termik',
};

const WORDS: Record<string, string> = {
  ad: 'Ad', adi: 'Adı', adresi: 'Adresi', adSoyad: 'Ad Soyad', aciklama: 'Açıklama',
  belge: 'Belge', birim: 'Birim', calisan: 'Çalışan', firma: 'Firma', gorev: 'Görev',
  hazirlayan: 'Hazırlayan', iletisim: 'İletişim', imza: 'İmza', isyeri: 'İşyeri',
  kodu: 'Kodu', konum: 'Konum', muhendis: 'Mühendis', no: 'No', numarasi: 'Numarası',
  olay: 'Olay', personel: 'Personel', saat: 'Saat', sicil: 'Sicil', sorumlu: 'Sorumlu',
  tarih: 'Tarih', tarihi: 'Tarihi', telefon: 'Telefon', tesis: 'Tesis', unvan: 'Ünvan',
  unvani: 'Ünvanı', yetkili: 'Yetkili', yeri: 'Yeri',
};

export const getFieldLabel = (field: DocumentField) => {
  if (EXACT_LABELS[field.key]) return EXACT_LABELS[field.key];
  const words = field.key.replace(/([a-z0-9ğüşöçı])([A-ZİĞÜŞÖÇ])/g, '$1 $2').replace(/[_-]+/g, ' ').split(' ');
  return words.map((word, index) => {
    const normalized = word.charAt(0).toLowerCase() + word.slice(1);
    const translated = WORDS[normalized] || word;
    return index === 0 ? translated.charAt(0).toUpperCase() + translated.slice(1) : translated;
  }).join(' ');
};

export const getSubFieldLabel = (key: string) => getFieldLabel({ key, label: key, type: 'text' });

const resolveSection = (field: DocumentField) => {
  const key = field.key.toLocaleLowerCase('tr-TR');
  if (field.type === 'list') return 'lists';
  if (/(logo|dokuman|formno|revizyon|yayintarihi|evrakno|date$|tarih$)/.test(key)) return 'document';
  if (/(firma|isyeri|tesis|adres|telefon|vergi|sgk|nace)/.test(key)) return 'business';
  if (/(adsoyad|muhendis|personel|calisan|sorumlu|yetkili|hazirlayan|prepared|teblig|tebellug)/.test(key)) return 'people';
  return 'details';
};

const SECTION_META = {
  document: { title: 'Doküman Bilgileri', description: 'Form kimliği, tarih ve revizyon bilgileri' },
  business: { title: 'İşyeri ve Tesis', description: 'Firma, tesis ve iletişim bilgileri' },
  people: { title: 'Kişiler ve Yetkililer', description: 'Görevli, sorumlu ve onay bilgileri' },
  details: { title: 'Dokümana Özel Bilgiler', description: 'Bu şablona özgü teknik ve operasyonel alanlar' },
  lists: { title: 'Tablo ve Kayıtlar', description: 'İhtiyacınız kadar satır ekleyebileceğiniz kayıtlar' },
};

export const buildFieldSections = (fields: DocumentField[] = []): FieldSection[] => {
  const grouped = new Map<string, DocumentField[]>();
  fields.forEach(field => {
    const section = resolveSection(field);
    grouped.set(section, [...(grouped.get(section) || []), field]);
  });
  return Object.entries(SECTION_META).flatMap(([id, meta]) => {
    const sectionFields = grouped.get(id) || [];
    return sectionFields.length ? [{ id, ...meta, fields: sectionFields }] : [];
  });
};

export const isFieldVisible = (field: DocumentField, data: Record<string, unknown>) =>
  !field.dependsOn || String(data[field.dependsOn.field]) === field.dependsOn.value;
