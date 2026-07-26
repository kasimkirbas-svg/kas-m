const ORIGINAL_DOCUMENT_IDS = new Set([
  'doc_001', 'doc_002', 'doc_007', 'doc_008', 'doc_010', 'doc_013',
  'doc_014', 'doc_035', 'doc_039', 'doc_046', 'doc_050', 'doc_059',
  'doc_060', 'doc_061', 'doc_062', 'doc_064', 'doc_065', 'doc_068',
  'doc_071', 'doc_074', 'doc_084', 'doc_086',
]);

export const getOriginalDocumentUrl = (templateId: string) => {
  return ORIGINAL_DOCUMENT_IDS.has(templateId) ? `/originals/${templateId}.docx` : undefined;
};
