import PizZip from 'pizzip';
import { DocumentField } from '../types';

interface DocxLoop {
  key: string;
  fields: string[];
}

const TAG_PATTERN = /\{([#/])?([^{}<>]+)\}/g;

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
      .filter(candidate => !candidate.marker)
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
  const scalarFields = configuredFields.filter(field => field.type !== 'list' && !loopKeys.has(field.key));
  const listFields: DocumentField[] = loops.map(loop => ({
    key: loop.key,
    label: loop.key,
    type: 'list',
    options: loop.fields,
  }));
  return [...scalarFields, ...listFields];
};
