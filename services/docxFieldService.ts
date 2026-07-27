import PizZip from 'pizzip';
import { DocumentField } from '../types';

interface DocxLoop {
  key: string;
  fields: string[];
}

const TAG_PATTERN = /\{([#/%])?([^{}<>]+)\}/g;

const inferFieldType = (key: string): DocumentField['type'] => {
  const normalized = key.toLocaleLowerCase('tr-TR');
  if (/(logo|foto|görsel|resim)/.test(normalized)) return 'image';
  if (/(tarih|date|tarihi)$/.test(normalized)) return 'date';
  if (/(açıklama|aciklama|değerlendirme|degerlendirme|detay|notlar|görüş)/.test(normalized)) return 'textarea';
  return 'text';
};

export const inferDocumentFieldsFromDocx = (buffer: ArrayBuffer): DocumentField[] => {
  const zip = new PizZip(buffer.slice(0));
  const documentXml = zip.file('word/document.xml')?.asText();
  if (!documentXml) throw new Error('DOCX içinde word/document.xml bulunamadı.');
  const documentText = documentXml.replace(/<[^>]+>/g, '');
  const tags = [...documentText.matchAll(TAG_PATTERN)].map(match => ({ marker: match[1] || '', key: match[2].trim() }));
  const loops = extractDocxLoops(buffer);
  const loopFieldKeys = new Set(loops.flatMap(loop => loop.fields.map(field => field.replace(/^%/, ''))));
  const scalarFields: DocumentField[] = tags.flatMap(tag => {
    const key = tag.key.replace(/^%/, '');
    if (tag.marker === '#' || tag.marker === '/' || loopFieldKeys.has(key)) return [];
    return [{ key, label: key, type: tag.marker === '%' ? 'image' : inferFieldType(key) }];
  }).filter((field, index, fields) => fields.findIndex(candidate => candidate.key === field.key) === index);
  const listFields: DocumentField[] = loops.map(loop => ({
    key: loop.key,
    label: loop.key,
    type: 'list',
    options: loop.fields.map(field => field.replace(/^%/, '')),
    optionTypes: Object.fromEntries(loop.fields.filter(field => field.startsWith('%')).map(field => [field.slice(1), 'image' as const])),
  }));
  return [...scalarFields, ...listFields];
};

export const extractDocxLoops = (buffer: ArrayBuffer): DocxLoop[] => {
  const zip = new PizZip(buffer.slice(0));
  const documentXml = zip.file('word/document.xml')?.asText();
  if (!documentXml) return [];
  const documentText = documentXml.replace(/<[^>]+>/g, '');

  const tags = [...documentText.matchAll(TAG_PATTERN)].map(match => ({
    marker: match[1] || '',
    key: match[2].trim(),
    index: match.index || 0,
  }));

  return tags.flatMap((tag, tagIndex) => {
    if (tag.marker !== '#') return [];
    const closingIndex = tags.findIndex((candidate, index) => index > tagIndex && candidate.marker === '/' && candidate.key === tag.key);
    if (closingIndex < 0) return [];
    const fields = tags
      .slice(tagIndex + 1, closingIndex)
      .filter(candidate => !candidate.marker || candidate.marker === '%')
      .map(candidate => candidate.key)
      .filter((key, index, all) => all.indexOf(key) === index);
    return fields.length ? [{ key: tag.key, fields }] : [];
  }).filter((loop, index, loops) => loops.findIndex(candidate => candidate.key === loop.key) === index);
};

export const reconcileFieldsWithDocx = (configuredFields: DocumentField[], buffer: ArrayBuffer): DocumentField[] => {
  const conditionalKeys = new Set(configuredFields.filter(field => field.type === 'select').map(field => field.key));
  const loops = extractDocxLoops(buffer).filter(loop => !conditionalKeys.has(loop.key));
  if (!loops.length) return configuredFields;

  const loopKeys = new Set(loops.flatMap(loop => loop.fields));
  const listFields: DocumentField[] = loops.map(loop => {
    const configured = configuredFields.find(field => field.key === loop.key && field.type === 'list');
    return {
      ...configured,
      key: loop.key,
      label: configured?.label || loop.key,
      type: 'list',
      options: loop.fields,
      optionTypes: {
        ...configured?.optionTypes,
        ...Object.fromEntries(loop.fields.filter(field => field.startsWith('%')).map(field => [field.slice(1), 'image' as const])),
      },
    };
  }).map(field => ({
    ...field,
    options: field.options?.map(option => option.replace(/^%/, '')),
  }));
  const scalarFields = configuredFields.filter(field => field.type !== 'list' && !loopKeys.has(field.key));
  return [...scalarFields, ...listFields];
};
