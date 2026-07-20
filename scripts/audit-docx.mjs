import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import PizZip from 'pizzip';

const root = path.resolve('public/templates');

const collectDocx = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectDocx(fullPath) : entry.name.toLowerCase().endsWith('.docx') ? [fullPath] : [];
  }));
  return nested.flat();
};

const decodeXmlText = xml => xml
  .replace(/<w:tab\s*\/>/g, '\t')
  .replace(/<w:br\s*\/>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const inspectLoops = (text, file) => {
  const tags = [...text.matchAll(/\{([#/])([^{}]+)\}/g)];
  const stack = [];
  const errors = [];

  for (const match of tags) {
    const [, marker, rawName] = match;
    const name = rawName.trim();
    if (marker === '#') {
      stack.push({ name, end: match.index + match[0].length });
      continue;
    }
    const opening = stack.pop();
    if (!opening) errors.push(`kapanış etiketi açılmamış: ${name}`);
    else if (opening.name !== name) errors.push(`döngü sırası bozuk: ${opening.name} -> ${name}`);
    else if (!text.slice(opening.end, match.index).trim()) errors.push(`boş döngü: ${name}`);
  }

  for (const opening of stack) errors.push(`döngü kapatılmamış: ${opening.name}`);
  return errors.map(error => `${path.relative(root, file)}: ${error}`);
};

const files = await collectDocx(root);
const failures = [];
for (const file of files) {
  try {
    const zip = new PizZip(await readFile(file));
    const documentXml = zip.file('word/document.xml')?.asText();
    if (!documentXml) throw new Error('word/document.xml bulunamadı');
    failures.push(...inspectLoops(decodeXmlText(documentXml), file));
  } catch (error) {
    failures.push(`${path.relative(root, file)}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`DOCX denetimi başarısız (${failures.length} sorun):\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`DOCX denetimi başarılı: ${files.length} dosya okunabilir ve döngüler dengeli.`);
