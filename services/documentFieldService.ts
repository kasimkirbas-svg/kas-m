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
  siraNo: 'Sıra No',
  adSoyad: 'Ad Soyad',
  gorevi: 'Görevi',
  belgeNo: 'Belge No',
  belgeTuru: 'Belge Türü',
  kurum: 'Düzenleyen Kurum',
  duzenlenmeTarihi: 'Düzenlenme Tarihi',
  yenilemeTarihi: 'Yenileme Tarihi',
  durum: 'Durum',
  termin: 'Termin Tarihi',
  tehlikeSinifi: 'Tehlike Sınıfı',
  olayTarihiSaati: 'Olay Tarihi ve Saati',
  ogrenilmeTarihiSaati: 'Öğrenilme Tarihi ve Saati',
  olayYeri: 'Olay Yeri',
  isRES: 'Santral Türü: RES',
  isGES: 'Santral Türü: GES',
  isHES: 'Santral Türü: HES',
  isTermik: 'Santral Türü: Termik',
  isKULE: 'Kule Vinç Kontrol Formu',
  isKEPÇE: 'Kepçe Kontrol Formu',
  isİŞMAKİNESİ: 'İş Makinesi Kontrol Formu',
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

export const isFieldRequired = (field: DocumentField) => {
  if (field.required) return true;
  if (field.dependsOn || field.type === 'image' || field.type === 'select') return false;
  if (field.type === 'list') return true;
  const normalized = `${field.key} ${getFieldLabel(field)}`.toLocaleLowerCase('tr-TR').replace(/[._-]+/g, ' ');
  if (/revizyon|yenileme|yayın|yayin|telefon|iletişim|iletisim|e-?posta|email|kod|numara|\bno\b|sicil|tescil/.test(normalized)) return false;
  return /firma|işyeri|isyeri|tesis adı|tesis adi|ünvan|unvan|düzenleme tarihi|duzenleme tarihi|olay tarihi|olay tarihi saati|tarih$|hazırlayan|hazirlayan|yetkili|sorumlu|mühendis|muhendis|raportör|raportor|ad soyad|adsoyad/.test(normalized);
};

export interface FieldGuidance {
  instruction: string;
  example: string;
}

export const getFieldGuidance = (field: DocumentField): FieldGuidance => {
  const label = getFieldLabel(field);
  const normalized = `${field.key} ${label}`.toLocaleLowerCase('tr-TR');
  if (field.type === 'image') return { instruction: `${label} için okunaklı, kırpılmamış bir PNG veya JPG yükleyin.`, example: 'Örnek: Şirket logosu veya sahadan çekilmiş net fotoğraf' };
  if (field.type === 'date') return { instruction: `${label} bilgisini belgenin düzenlendiği veya olayın gerçekleştiği gerçek tarihe göre seçin.`, example: 'Örnek: 27.07.2026' };
  if (field.type === 'select') return { instruction: `${label} için durumunuza uyan tek seçeneği işaretleyin.`, example: `Seçenekler: ${field.options?.slice(0, 4).join(', ') || 'Listeden uygun değeri seçin'}` };
  if (field.type === 'list') {
    const columns = field.options?.slice(0, 5).map(getSubFieldLabel).join(', ');
    const isRiskTable = /risk|tehlike|olasılık|şiddet|frekans/.test(normalized);
    return isRiskTable
      ? { instruction: 'Her tehlikeyi ayrı satıra yazın; olasılık, şiddet ve varsa frekans değerlerini girin. Risk puanı ve sonucu otomatik hesaplanır.', example: columns ? `Doldurulacak başlıca sütunlar: ${columns}` : 'Örnek: Kaygan zemin, düşme, ıslak alanın yalıtılması' }
      : { instruction: `${label} tablosunda her kişi, olay veya kayıt için ayrı bir satır ekleyin.`, example: columns ? `Doldurulacak başlıca sütunlar: ${columns}` : 'Her kaydı kısa ve doğrulanabilir bilgilerle tamamlayın.' };
  }
  if (/adres|konum|olay yeri|tesis yeri/.test(normalized)) return { instruction: `${label} bilgisini il, ilçe, mahalle ve açık adres içerecek şekilde yazın.`, example: 'Örnek: Ataşehir Mah. Örnek Cad. No: 12, İstanbul' };
  if (/ünvan|unvan|firma|işyeri|isyeri|tesis adı|tesis adi/.test(normalized)) return { instruction: `${label} bilgisini resmi kayıtlarda geçtiği biçimiyle, kısaltmadan yazın.`, example: 'Örnek: Zeyron İş Sağlığı ve Güvenliği Ltd. Şti.' };
  if (/ad soyad|adsoyad|hazırlayan|hazirlayan|mühendis|muhendis|yetkili|sorumlu|raportör|raportor/.test(normalized)) return { instruction: `${label} için kişinin adını, soyadını ve gerekiyorsa görev veya ünvanını yazın.`, example: 'Örnek: Ayşe Yılmaz - B Sınıfı İş Güvenliği Uzmanı' };
  if (/telefon|iletişim|iletisim|e-?posta|email/.test(normalized)) return { instruction: `${label} bilgisini güncel ve ulaşılabilir olacak şekilde yazın.`, example: 'Örnek: 05xx xxx xx xx / uzman@firma.com' };
  if (/no|numara|kodu|sicil|tescil/.test(normalized)) return { instruction: `${label} değerini ilgili resmi kayıt veya belgeden aynen aktarın.`, example: field.placeholder || 'Örnek: İSG-FRM-001' };
  if (/açıklama|aciklama|olay|karar|gündem|gundem|tespit|önlem|onlem|faaliyet|talimat/.test(normalized) || field.type === 'textarea') return { instruction: `${label} alanında ne olduğunu, nerede olduğunu, kimleri etkilediğini ve alınacak aksiyonu kısa ve somut cümlelerle açıklayın.`, example: field.placeholder || 'Örnek: Üretim girişindeki ıslak zemin nedeniyle kayma riski tespit edildi; alan izole edilerek kaymaz kaplama uygulanacaktır.' };
  return { instruction: `${label} bilgisini belgedeki amaca uygun, güncel ve doğrulanabilir biçimde yazın.`, example: field.placeholder || `Örnek bir ${label.toLocaleLowerCase('tr-TR')} değeri girin.` };
};

export const buildFieldSections = (fields: DocumentField[] = []): FieldSection[] => {
  const sections: FieldSection[] = [];
  const firstListIndex = fields.findIndex(field => field.type === 'list');
  let scalarFields: DocumentField[] = [];
  let scalarStartIndex = 0;

  const flushScalars = () => {
    if (!scalarFields.length) return;
    const normalizedKeys = scalarFields.map(field => field.key.toLocaleLowerCase('tr-TR')).join(' ');
    const isAfterTables = firstListIndex >= 0 && scalarStartIndex > firstListIndex;
    const title = isAfterTables
      ? (/imza|onay|hazirlayan|hekim|isveren|adsoyad/.test(normalizedKeys) ? 'Kişiler ve İmzalar' : 'Sonuç ve Rapor Özeti')
      : scalarStartIndex === 0
        ? 'Belge ve İşyeri Bilgileri'
        : 'Değerlendirme Bilgileri';
    sections.push({
      id: `fields-${scalarStartIndex}`,
      title,
      description: `${scalarFields.length} bilgiyi belgedeki sırayla tamamlayın`,
      fields: scalarFields,
    });
    scalarFields = [];
  };

  fields.forEach((field, fieldIndex) => {
    if (field.type === 'list') {
      flushScalars();
      sections.push({
        id: `table-${field.key}`,
        title: getFieldLabel(field),
        description: `${field.options?.length || 1} sütunlu belge tablosunu doldurun`,
        fields: [field],
      });
      scalarStartIndex = fieldIndex + 1;
      return;
    }
    if (!scalarFields.length) scalarStartIndex = fieldIndex;
    scalarFields.push(field);
    if (scalarFields.length === 10 && (firstListIndex < 0 || fieldIndex < firstListIndex)) flushScalars();
  });
  flushScalars();
  return sections;
};

export const isFieldVisible = (field: DocumentField, data: Record<string, unknown>) =>
  !field.dependsOn || String(data[field.dependsOn.field]) === field.dependsOn.value;
