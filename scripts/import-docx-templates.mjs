import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import PizZip from 'pizzip';

const sourceRoot = path.resolve(process.argv[2] || '');
const targetRoot = path.resolve('public/templates');
const outputFile = path.resolve('generatedTemplates.ts');
const reportFile = path.resolve('docx-import-report.json');

if (!process.argv[2]) {
  console.error('Kullanım: node scripts/import-docx-templates.mjs <kaynak-klasör>');
  process.exit(1);
}

const collectDocx = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectDocx(fullPath);
    return entry.isFile() && entry.name.toLocaleLowerCase('tr-TR').endsWith('.docx') ? [fullPath] : [];
  }));
  return nested.flat();
};

const decodeXmlText = xml => xml
  .replace(/<w:tab\s*\/>/g, '\t')
  .replace(/<w:br\s*\/>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&');

const extractText = zip => Object.keys(zip.files)
  .filter(name => /^word\/(document|header\d*|footer\d*)\.xml$/i.test(name))
  .sort()
  .map(name => decodeXmlText(zip.file(name)?.asText() || ''))
  .join('\n');

const parseTags = text => [...text.matchAll(/\{([#/%])?([^{}<>]+)\}/g)].map(match => ({
  marker: match[1] || '',
  key: match[2].trim(),
})).filter(tag => /^[\p{L}_][\p{L}\p{N}_.-]*$/u.test(tag.key));

const unique = values => values.filter((value, index) => values.indexOf(value) === index);
const isCondition = key => !/Liste$/iu.test(key) && (/^is[A-ZİĞÜŞÖÇ0-9_]/u.test(key) || /^(var|goster|dahil|secili)[A-ZİĞÜŞÖÇ0-9_]/u.test(key));
const inferType = key => {
  const normalized = key.toLocaleLowerCase('tr-TR');
  if (/(tarih|date|tarihi)$/.test(normalized)) return 'date';
  if (/(aciklama|açıklama|degerlendirme|değerlendirme|detay|notlar|notu|ozet|özet|konusu|maddeler|tedbirler|faaliyet|gorus|görüş|talimat|prosedur|prosedür)/.test(normalized)) return 'textarea';
  return 'text';
};

const replaceAcrossTextRuns = (xml, before, after) => {
  const nodes = [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(match => ({
    start: match.index,
    end: match.index + match[0].length,
    full: match[0],
    text: match[1],
  }));
  const combined = nodes.map(node => node.text).join('');
  const matchIndex = combined.indexOf(before);
  if (matchIndex < 0) return { xml, replaced: false };

  const matchEnd = matchIndex + before.length;
  let offset = 0;
  let firstIndex = -1;
  let lastIndex = -1;
  for (let index = 0; index < nodes.length; index += 1) {
    const nodeEnd = offset + nodes[index].text.length;
    if (firstIndex < 0 && matchIndex < nodeEnd) firstIndex = index;
    if (matchEnd <= nodeEnd) { lastIndex = index; break; }
    offset = nodeEnd;
  }
  if (firstIndex < 0 || lastIndex < 0) return { xml, replaced: false };

  const beforeFirst = nodes.slice(0, firstIndex).reduce((sum, node) => sum + node.text.length, 0);
  const beforeLast = nodes.slice(0, lastIndex).reduce((sum, node) => sum + node.text.length, 0);
  const prefix = nodes[firstIndex].text.slice(0, matchIndex - beforeFirst);
  const suffix = nodes[lastIndex].text.slice(matchEnd - beforeLast);
  const replacements = new Map();
  replacements.set(firstIndex, `${prefix}${after}${firstIndex === lastIndex ? suffix : ''}`);
  for (let index = firstIndex + 1; index < lastIndex; index += 1) replacements.set(index, '');
  if (lastIndex !== firstIndex) replacements.set(lastIndex, suffix);

  let cursor = 0;
  let result = '';
  nodes.forEach((node, index) => {
    result += xml.slice(cursor, node.start);
    const nextText = replacements.has(index) ? replacements.get(index) : node.text;
    result += node.full.replace(node.text, nextText);
    cursor = node.end;
  });
  result += xml.slice(cursor);
  return { xml: result, replaced: true };
};

const repairTemplate = (buffer, relativePath) => {
  const repairs = {
    'Metal ve Döküm\\Termal Konfor Takip Formu.docx': [
      ['{#no}', '{no}'],
      ['{{bolum}', '{bolum}'],
    ],
    'STANDART DOKÜMANLAR\\Kapalı Alanda Çalışma Eğitimi ve İzin Formu.docx': [
      ['{kontrolMaddesi}', '{kontrolMaddesi}{/guvenlikTedbirleri}'],
      ['{cikisSaati}', '{cikisSaati}{/gorevliPersonel}'],
    ],
    'Enerji Santralleri\\EKAT_Yetki_Belgesi_Takip_Cizelgesi_Sablonu.docx': [
      ['{#personeller}', ''],
      ['{/personeller}', ''],
      ['{siraNo}', '{#personeller}{siraNo}'],
      ['{durum}', '{durum}{/personeller}'],
    ],
  };
  const replacements = repairs[relativePath];
  if (!replacements) return { buffer, repairs: [] };

  const zip = new PizZip(buffer);
  const applied = [];
  for (const name of Object.keys(zip.files).filter(entry => /^word\/.*\.xml$/i.test(entry))) {
    const entry = zip.file(name);
    if (!entry) continue;
    let xml = entry.asText();
    for (const [before, after] of replacements) {
      const result = replaceAcrossTextRuns(xml, before, after);
      if (!result.replaced) continue;
      xml = result.xml;
      applied.push(`${before} -> ${after}`);
    }
    zip.file(name, xml);
  }
  if (applied.length !== replacements.length) throw new Error(`Beklenen DOCX onarımı uygulanamadı: ${relativePath}`);
  return { buffer: zip.generate({ type: 'nodebuffer' }), repairs: applied };
};

const inspectTemplate = async file => {
  const relativePath = path.relative(sourceRoot, file);
  const parts = relativePath.split(path.sep);
  const category = parts[0];
  const title = path.basename(file, path.extname(file)).replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  const repaired = repairTemplate(await readFile(file), relativePath);
  const zip = new PizZip(repaired.buffer);
  const text = extractText(zip);
  const tags = parseTags(text);
  const opened = new Set(tags.filter(tag => tag.marker === '#').map(tag => tag.key));
  const closed = new Set(tags.filter(tag => tag.marker === '/').map(tag => tag.key));
  const unbalanced = [...opened].filter(key => !closed.has(key)).concat([...closed].filter(key => !opened.has(key)));
  if (unbalanced.length) throw new Error(`Dengesiz blok: ${unique(unbalanced).join(', ')}`);

  const blockKinds = new Map([...opened].map(key => [key, isCondition(key) ? 'condition' : 'list']));
  const listOptions = new Map([...blockKinds].filter(([, kind]) => kind === 'list').map(([key]) => [key, []]));
  const listOptionTypes = new Map([...blockKinds].filter(([, kind]) => kind === 'list').map(([key]) => [key, {}]));
  const stack = [];
  const fields = [];
  const seen = new Set();

  const addField = field => {
    if (seen.has(field.key)) return;
    seen.add(field.key);
    fields.push(field);
  };

  for (const tag of tags) {
    if (tag.marker === '#') {
      const kind = blockKinds.get(tag.key);
      stack.push({ key: tag.key, kind });
      if (kind === 'condition') addField({ key: tag.key, label: tag.key, type: 'select', options: ['true', 'false'] });
      else addField({ key: tag.key, label: tag.key, type: 'list', options: listOptions.get(tag.key) });
      continue;
    }
    if (tag.marker === '/') {
      const opening = stack.pop();
      if (!opening || opening.key !== tag.key) throw new Error(`Blok sırası bozuk: ${opening?.key || '-'} -> ${tag.key}`);
      continue;
    }

    const activeList = [...stack].reverse().find(block => block.kind === 'list');
    const key = tag.key.replace(/^%/, '');
    if (activeList) {
      const options = listOptions.get(activeList.key);
      if (options && !options.includes(key)) options.push(key);
      if (tag.marker === '%') listOptionTypes.get(activeList.key)[key] = 'image';
      continue;
    }
    addField({ key, label: key, type: tag.marker === '%' ? 'image' : inferType(key) });
  }

  fields.filter(field => field.type === 'list').forEach(field => {
    const optionTypes = listOptionTypes.get(field.key);
    if (optionTypes && Object.keys(optionTypes).length) field.optionTypes = optionTypes;
  });

  return {
    title,
    category,
    description: `${category} kategorisine ait düzenlenebilir İSG dokümanı.`,
    isPremium: false,
    fileUrl: encodeURI(`/templates/${parts.join('/')}`),
    fields,
    relativePath,
    tagCount: tags.length,
    images: fields.filter(field => field.type === 'image').map(field => field.key),
    conditions: fields.filter(field => field.type === 'select').map(field => field.key),
    lists: fields.filter(field => field.type === 'list').map(field => ({ key: field.key, columns: field.options })),
    repairs: repaired.repairs,
    buffer: repaired.buffer,
  };
};

const files = (await collectDocx(sourceRoot)).sort((left, right) => left.localeCompare(right, 'tr'));
if (!files.length) throw new Error(`Kaynak klasörde DOCX bulunamadı: ${sourceRoot}`);

const inspected = [];
const failures = [];
for (const file of files) {
  try {
    inspected.push(await inspectTemplate(file));
  } catch (error) {
    failures.push({ file: path.relative(sourceRoot, file), error: error.message });
  }
}

if (failures.length) {
  await writeFile(reportFile, JSON.stringify({ sourceRoot, total: files.length, failures }, null, 2));
  throw new Error(`${failures.length} DOCX analiz edilemedi. Ayrıntı: ${reportFile}`);
}

await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });
for (const template of inspected) {
  const destination = path.join(targetRoot, template.relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, template.buffer);
}

const templates = inspected.map((template, index) => ({
  id: `doc_${String(index + 1).padStart(3, '0')}`,
  title: template.title,
  category: template.category,
  description: template.description,
  isPremium: template.isPremium,
  fileUrl: template.fileUrl,
  fields: template.fields,
}));

const generatedSource = `import type { DocumentTemplate } from './types';\n\nexport const GENERATED_TEMPLATES: DocumentTemplate[] = ${JSON.stringify(templates, null, 2)};\n`;
await writeFile(outputFile, generatedSource);
await writeFile(reportFile, JSON.stringify({
  sourceRoot,
  total: inspected.length,
  fieldCount: inspected.reduce((sum, item) => sum + item.fields.length, 0),
  imageTemplates: inspected.filter(item => item.images.length).map(item => ({ file: item.relativePath, fields: item.images })),
  conditionalTemplates: inspected.filter(item => item.conditions.length).map(item => ({ file: item.relativePath, fields: item.conditions })),
  listTemplates: inspected.filter(item => item.lists.length).map(item => ({ file: item.relativePath, lists: item.lists })),
  repairedTemplates: inspected.filter(item => item.repairs.length).map(item => ({ file: item.relativePath, repairs: item.repairs })),
  emptyTemplates: inspected.filter(item => item.fields.length === 0).map(item => item.relativePath),
  failures: [],
}, null, 2));

console.log(`${inspected.length} DOCX aktarıldı; ${templates.reduce((sum, item) => sum + item.fields.length, 0)} panel alanı üretildi.`);