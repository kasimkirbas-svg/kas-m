/// <reference path="../vendor.d.ts" />
import React, { useState, useEffect, useRef } from "react";
import { DocumentField, DocumentTemplate } from "../types";
import { ArrowLeft, Check, ChevronDown, Download, FileText, Eye, Lightbulb, PencilLine, SlidersHorizontal, Upload } from "lucide-react";
import { renderAsync } from "docx-preview";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";
import { buildFieldSections, getDocumentTitle, getFieldGuidance, getFieldLabel, getSubFieldLabel, isFieldRequired, isFieldVisible } from "../services/documentFieldService";
import { reconcileFieldsWithDocx } from "../services/docxFieldService";

interface DocumentEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: () => void;
}

type ImageDimensions = { width: number; height: number };

const normalizeRiskKey = (key: string) => key.toLocaleLowerCase('tr-TR').replace(/[ı]/g, 'i').replace(/[^a-z0-9]/g, '');
const findRiskSubField = (options: string[] | undefined, patterns: RegExp[]) =>
  options?.find(option => patterns.some(pattern => pattern.test(normalizeRiskKey(option))));

const getRiskColumnGroups = (options: string[] | undefined) => ['', '1', '2'].flatMap(suffix => {
  const probability = findRiskSubField(options, [new RegExp(`^(?:olasilik|probability)${suffix}$`), ...(suffix ? [new RegExp(`^o${suffix}$`)] : [])]);
  const severity = findRiskSubField(options, [new RegExp(`^(?:siddet|severity)${suffix}$`), ...(suffix ? [new RegExp(`^s${suffix}$`)] : [])]);
  const frequency = findRiskSubField(options, [new RegExp(`^(?:frekans|frequency)${suffix}$`), ...(suffix ? [new RegExp(`^f${suffix}$`)] : [])]);
  const score = findRiskSubField(options, [new RegExp(`^risk(?:skoru|puani|puan)${suffix}$`), ...(suffix ? [new RegExp(`^rp${suffix}$`)] : [])]);
  const result = findRiskSubField(options, [new RegExp(`^risk(?:duzeyi|sonucu|sonuc)${suffix}$`), new RegExp(`^sonuc${suffix}$`), ...(suffix ? [new RegExp(`^result${suffix}$`)] : [/^result$/])]);
  return probability && severity && score ? [{ probability, severity, frequency, score, result }] : [];
});

const getCalculatedRiskResult = (score: number, usesFrequency: boolean) => {
  if (usesFrequency) {
    if (score >= 400) return 'Tolerans Dışı';
    if (score >= 200) return 'Yüksek Risk';
    if (score >= 70) return 'Önemli Risk';
    if (score >= 20) return 'Olası Risk';
    return 'Kabul Edilebilir Risk';
  }
  if (score >= 15) return 'Yüksek Risk';
  if (score >= 8) return 'Orta Risk';
  return 'Düşük Risk';
};

const fitWithin = ({ width, height }: ImageDimensions, maxWidth: number, maxHeight: number): [number, number] => {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return [Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale))];
};

const formatGuidanceValue = (field: DocumentField, value: any) => {
  if (field.type === 'image') return value ? 'Görsel seçildi' : '';
  if (!Array.isArray(value)) return String(value || '');
  if (!value.length) return '';
  const rows = value.slice(0, 3).map((row: Record<string, any>, index: number) => {
    const summary = Object.entries(row)
      .filter(([, entryValue]) => entryValue && !String(entryValue).startsWith('data:image/'))
      .slice(0, 4)
      .map(([key, entryValue]) => `${getSubFieldLabel(key)}: ${entryValue}`)
      .join(' · ');
    return `${index + 1}. ${summary || 'Satır eklendi, bilgileri bekliyor'}`;
  });
  if (value.length > rows.length) rows.push(`+ ${value.length - rows.length} satır daha`);
  return rows.join('\n');
};

const constrainImage = (file: File, maxPixels = 1600): Promise<{ dataUrl: string; dimensions: ImageDimensions }> => new Promise((resolve, reject) => {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    const scale = Math.min(maxPixels / image.naturalWidth, maxPixels / image.naturalHeight, 1);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);
    resolve({ dataUrl: canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88), dimensions: { width, height } });
  };
  image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Görsel okunamadı.')); };
  image.src = objectUrl;
});

const paginateOverflowingPreview = async (preview: HTMLDivElement) => {
  const measurementHost = document.createElement('div');
  measurementHost.style.cssText = 'position:fixed;left:-10000px;top:0;width:1200px;visibility:hidden;pointer-events:none;';
  measurementHost.appendChild(preview);
  document.body.appendChild(measurementHost);
  try {
    const sections = Array.from(preview.querySelectorAll<HTMLElement>('.docx-wrapper > section.docx'));
    const overflowing = sections.find(section => {
      const pageHeight = Number.parseFloat(getComputedStyle(section).minHeight);
      return pageHeight > 0 && section.scrollHeight > pageHeight + 2;
    });
    if (!overflowing) return;

    const isLandscape = overflowing.clientWidth > Number.parseFloat(getComputedStyle(overflowing).minHeight);
    const source = overflowing.cloneNode(true) as HTMLElement;
    source.style.padding = '0';
    source.style.width = 'auto';
    source.style.minHeight = '0';
    source.style.overflow = 'visible';
    const styles = Array.from(preview.querySelectorAll('style')).map(style => style.textContent || '').join('\n');
    const stylesheet = new Blob([`${styles}\n@page { size: A4 ${isLandscape ? 'landscape' : 'portrait'}; margin: 72pt; }\n.docx { padding: 0 !important; width: auto !important; min-height: 0 !important; overflow: visible !important; }\ntr, img { break-inside: avoid; }`], { type: 'text/css' });
    const stylesheetUrl = URL.createObjectURL(stylesheet);
    const pagedTarget = document.createElement('div');
    pagedTarget.className = 'docx-paged-preview';
    measurementHost.appendChild(pagedTarget);
    const { Previewer } = await import('pagedjs');
    try {
      await new Previewer().preview(source, [stylesheetUrl], pagedTarget);
      if (pagedTarget.querySelector('.pagedjs_page')) preview.replaceChildren(pagedTarget);
    } finally { URL.revokeObjectURL(stylesheetUrl); }
  } finally {
    measurementHost.remove();
  }
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onBack, onSave }) => {
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [documentFields, setDocumentFields] = useState<DocumentField[]>(template.fields);
  const [loading, setLoading] = useState(false);
  const [docxArrayBuffer, setDocxArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [originalPreviewBuffer, setOriginalPreviewBuffer] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [previewScale, setPreviewScale] = useState(1);
  const [previewWidth, setPreviewWidth] = useState(800);
  const [previewHeight, setPreviewHeight] = useState(1100);
  const [filterConfirmed, setFilterConfirmed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [bulkRowCounts, setBulkRowCounts] = useState<Record<string, number>>({});
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const previewRenderId = useRef(0);
  const imageDimensions = useRef(new Map<string, ImageDimensions>());
  const filterFields = documentFields.filter(field => field.type === 'select' && /^is/i.test(field.key) && !/liste$/i.test(field.key));
  const fieldSections = buildFieldSections(documentFields.filter(field => !filterFields.some(filter => filter.key === field.key)));
  const visibleSections = fieldSections.map(section => ({ ...section, fields: section.fields.filter(field => isFieldVisible(field, formData)) })).filter(section => section.fields.length > 0);
  const activeSectionId = visibleSections.find(section => openSections[section.id])?.id || visibleSections[0]?.id;
  const activeSectionIndex = Math.max(0, visibleSections.findIndex(section => section.id === activeSectionId));
  const activeSection = visibleSections[activeSectionIndex];
  const guidanceField = activeSection?.fields.find(field => field.key === focusedFieldKey) || activeSection?.fields[0];
  const fieldGuidance = guidanceField ? getFieldGuidance(guidanceField) : null;
  const guidanceValue = guidanceField ? formData[guidanceField.key] : '';
  const guidanceValueText = guidanceField ? formatGuidanceValue(guidanceField, guidanceValue) : '';
  const visibleFields = documentFields.filter(field => isFieldVisible(field, formData));
  const requiredFields = visibleFields.filter(isFieldRequired);
  const completedRequiredFields = requiredFields.filter(field => Array.isArray(formData[field.key]) ? formData[field.key].length > 0 : Boolean(formData[field.key])).length;
  const completionRate = requiredFields.length ? Math.round((completedRequiredFields / requiredFields.length) * 100) : 100;
  useEffect(() => {
    setLoadError(null);
    setDownloadError(null);
    setFilterConfirmed(false);
    setSelectedFilter("");
    setLoading(true);
    setOriginalPreviewBuffer(null);
    setDocumentFields(template.fields);
        const initialData: Record<string, any> = {};
    if (template.fields) {
      template.fields.forEach(field => {
          if (!(field.key in initialData)) initialData[field.key] = field.type === "date" ? new Date().toISOString().split("T")[0] : "";
      });
    }
    setFormData(initialData);
    const sections = buildFieldSections(template.fields);
    setOpenSections(Object.fromEntries(sections.map((section, index) => [section.id, index === 0])));

    if (template.fileUrl) {
      // fetch with cache-busting to bypass browser caching renamed .doc files
      fetch(template.fileUrl + "?v=" + new Date().getTime())
        .then(res => {
           if(!res.ok) throw new Error("Dosya bulunamadı veya erişilemiyor.");
           return res.arrayBuffer();
        })
        .then(buffer => {
          const reconciledFields = reconcileFieldsWithDocx(template.fields, buffer);
          const reconciledData = { ...initialData };
          reconciledFields.forEach(field => {
            if (field.type === 'list' && !Array.isArray(reconciledData[field.key])) reconciledData[field.key] = [];
            else if (!(field.key in reconciledData)) reconciledData[field.key] = field.type === 'date' ? new Date().toISOString().split('T')[0] : '';
          });
          setDocumentFields(reconciledFields);
          setFormData(reconciledData);
          const reconciledSections = buildFieldSections(reconciledFields);
          setOpenSections(Object.fromEntries(reconciledSections.map((section, index) => [section.id, index === 0])));
          setDocxArrayBuffer(buffer);
          setLoading(false);
          if (template.originalUrl) {
            void fetch(template.originalUrl).then(response => {
              if (!response.ok) throw new Error('Özgün belge bulunamadı.');
              return response.arrayBuffer();
            }).then(setOriginalPreviewBuffer).catch(error => console.warn('Özgün belge önizlemesi yüklenemedi:', error));
          }
        })
        .catch(err => {
          console.error("Doküman yüklenirken hata:", err);
          setLoading(false);
          setLoadError(template.fileUrl?.endsWith(".doc") 
            ? "Eski tip .doc dosyaları canlı önizlemeyi desteklemez. Lütfen dosyaları .docx formatına çevirerek sisteme yükleyin." 
            : "Dosya sunucudan yüklenemedi. Yolunu kontrol edin.");
        });
    }
  }, [template]);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;
    const updateScale = () => setPreviewScale(Math.min(1, Math.max(0.25, (viewport.clientWidth - 32) / previewWidth)));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [previewWidth, mobileView]);

  useEffect(() => {
    if (!docxArrayBuffer || !previewRef.current) return;
    const timeout = window.setTimeout(() => void updatePreview(docxArrayBuffer, formData), 180);
    return () => window.clearTimeout(timeout);
  }, [docxArrayBuffer, formData]);

  const updatePreview = async (buffer: ArrayBuffer, data: Record<string, any> | null) => {
    const renderId = ++previewRenderId.current;
    try {
      // ÖNEMLİ: ArrayBuffer her karakter girildiğinde yeniden kullanılıyor. 
      // PizZip orijinal buffer'ı modifiye ettiği için etiketler kayboluyordu. 
      // buffer.slice(0) ile klonlayarak her seferinde tertemiz bir docx kopyası ile çalışmasını sağlıyoruz!
      let previewBuffer = buffer.slice(0);
      if (data) {
      const zip = new PizZip(previewBuffer);
      
      const imageOptions = {
        centered: false,
        getImage(tagValue: string) {
          if (tagValue) {
             const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
             if(base64Regex.test(tagValue)) {
                const base64Data = tagValue.replace(base64Regex, "");
                let binaryString = window.atob(base64Data);
                let len = binaryString.length;
                let bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
             }
          }
          return new ArrayBuffer(0); // If no image, return empty buffer
        },
        getSize(_img: unknown, tagValue: string, tagName: string) {
          const dimensions = imageDimensions.current.get(tagValue) || { width: 4, height: 3 };
          return tagName.toLocaleLowerCase('tr-TR').includes('logo') ? fitWithin(dimensions, 150, 150) : fitWithin(dimensions, 220, 165);
        }
      };
      
      const imageModule = new ImageModule(imageOptions);
      
      const doc = new Docxtemplater(zip, { 
         paragraphLoop: true, 
         linebreaks: true,
         modules: [imageModule],
         nullGetter(part) { if (!part.module) { return ""; } if (part.module === "rawxml") { return ""; } return ""; }
      });
      const renderData = Object.fromEntries(Object.entries(data).map(([key, value]) => [
        key,
        value === 'true' ? true : value === 'false' ? false : value,
      ]));
      doc.render(renderData);

      previewBuffer = doc.getZip().generate({ type: "arraybuffer" });
      }
      const blob = new Blob([previewBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      
      if (previewRef.current) {
        const nextPreview = document.createElement('div');
        await renderAsync(blob, nextPreview, nextPreview, {
           className: "docx",
           inWrapper: true,
           ignoreWidth: false,
           ignoreHeight: false,
           ignoreFonts: false,
           breakPages: true,
           ignoreLastRenderedPageBreak: true,
           experimental: true,
           trimXmlDeclaration: true,
           useBase64URL: true,
        });
          try { await paginateOverflowingPreview(nextPreview); }
          catch (paginationError) { console.warn('A4 önizleme sayfalaması uygulanamadı:', paginationError); }
          if (renderId !== previewRenderId.current || !previewRef.current) return;
          previewRef.current.replaceChildren(...Array.from(nextPreview.childNodes));
          const renderedWidth = Math.max(1, previewRef.current.scrollWidth);
          setPreviewWidth(renderedWidth);
          setPreviewHeight(Math.max(1, previewRef.current.scrollHeight));
      }
    } catch (error: any) {
      console.log("Önizleme oluşturulurken veya değişken değiştirilirken hata:", error);
      setLoadError("Bu şablon okunamadı. Orijinal dosyanın bozuk veya eski (.doc) formatlı olmadığından emin olup tekrar deneyin. Detay: " + (error.message || "Bilinmiyor"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const image = await constrainImage(file);
      imageDimensions.current.set(image.dataUrl, image.dimensions);
      setFormData(prev => ({ ...prev, [fieldKey]: image.dataUrl }));
    } catch { setDownloadError('Görsel okunamadı. PNG veya JPG dosyası seçin.'); }
  };

  const getSequenceKey = (fieldKey: string) => documentFields.find(field => field.key === fieldKey)?.options?.find(option => /^(?:s[ıi]ra|s)?[\s_.-]*(?:no|numara|numarası)$/i.test(option));
  const renumberRows = (fieldKey: string, rows: Record<string, any>[]) => {
    const sequenceKey = getSequenceKey(fieldKey);
    return sequenceKey ? rows.map((row, index) => ({ ...row, [sequenceKey]: String(index + 1) })) : rows;
  };

  const handleListAdd = (fieldKey: string, count = 1) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: renumberRows(fieldKey, [...(prev[fieldKey] || []), ...Array.from({ length: count }, () => ({}))])
    }));
  };

  const handleListRemove = (fieldKey: string, index: number) => {
    setFormData(prev => {
      const newList = [...(prev[fieldKey] || [])];
      newList.splice(index, 1);
      return { ...prev, [fieldKey]: renumberRows(fieldKey, newList) };
    });
  };

  const handleListChange = (fieldKey: string, index: number, subKey: string, value: string) => {
    setFormData(prev => {
      const newList = [...(prev[fieldKey] || [])];
      const field = documentFields.find(item => item.key === fieldKey);
      const riskColumnGroups = getRiskColumnGroups(field?.options);
      const nextRow = { ...newList[index], [subKey]: value };
      riskColumnGroups.forEach(riskColumns => {
        const probability = Number(nextRow[riskColumns.probability]);
        const severity = Number(nextRow[riskColumns.severity]);
        const frequency = riskColumns.frequency ? Number(nextRow[riskColumns.frequency]) : 1;
        const hasInputs = Number.isFinite(probability) && Number.isFinite(severity) && Number.isFinite(frequency);
        const score = hasInputs ? probability * severity * frequency : 0;
        nextRow[riskColumns.score] = hasInputs ? String(Number(score.toFixed(2))) : '';
        if (riskColumns.result) nextRow[riskColumns.result] = hasInputs ? getCalculatedRiskResult(score, Boolean(riskColumns.frequency)) : '';
      });
      newList[index] = nextRow;
      return { ...prev, [fieldKey]: newList };
    });
  };

  const handleDownload = () => {
    if (!docxArrayBuffer) return;
    const missingRequired = visibleFields.filter(field => isFieldRequired(field) && (Array.isArray(formData[field.key]) ? formData[field.key].length === 0 : !formData[field.key]));
    if (missingRequired.length) {
      setDownloadError(`Lütfen zorunlu alanları doldurun: ${missingRequired.map(getFieldLabel).join(', ')}`);
      return;
    }
    setDownloadError(null);
    try {
      const zip = new PizZip(docxArrayBuffer);
      
      const imageOptions = {
        centered: false,
        getImage(tagValue: string) {
          if (tagValue) {
             const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
             if(base64Regex.test(tagValue)) {
                const base64Data = tagValue.replace(base64Regex, "");
                let binaryString = window.atob(base64Data);
                let len = binaryString.length;
                let bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
             }
          }
           return new ArrayBuffer(0);
        },
        getSize(_img: unknown, tagValue: string, tagName: string) {
          const dimensions = imageDimensions.current.get(tagValue) || { width: 4, height: 3 };
          return tagName.toLocaleLowerCase('tr-TR').includes('logo') ? fitWithin(dimensions, 150, 150) : fitWithin(dimensions, 220, 165);
        }
      };
      
      const imageModule = new ImageModule(imageOptions);

      const doc = new Docxtemplater(zip, { 
        paragraphLoop: true, 
        linebreaks: true,
        modules: [imageModule],
        nullGetter(part) { if (!part.module) { return ""; } if (part.module === "rawxml") { return ""; } return ""; }
      });
      
      doc.render(Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value === 'true' ? true : value === 'false' ? false : value])));

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      
      const documentTitle = getDocumentTitle(template.id, template.title);
      saveAs(out, `${documentTitle}_Doldurulmus.docx`);
      onSave();
    } catch (error) {
      console.error("İndirme Hatası", error);
      setDownloadError('Doküman oluşturulamadı. Alanları kontrol edip tekrar deneyin.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[100svh] lg:h-screen bg-[#16222a] lg:overflow-hidden text-slate-200">
      {!loading && filterFields.length > 0 && !filterConfirmed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d171d]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="document-filter-title">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#162a33] p-6 shadow-2xl sm:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400">Belge filtresi</p>
            <h2 id="document-filter-title" className="text-xl font-bold text-white">Hangi belge türüyle devam edilsin?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Seçiminize ait alanlar ve tablolar gösterilecek, diğer bölümler belgeye eklenmeyecek.</p>
            <div className="mt-6 grid gap-2">
              {filterFields.map(field => (
                <button key={field.key} type="button" onClick={() => setSelectedFilter(field.key)} className={`flex min-h-12 items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors ${selectedFilter === field.key ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300' : 'border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20'}`}>
                  {getFieldLabel(field)}
                  {selectedFilter === field.key && <Check size={17} />}
                </button>
              ))}
            </div>
            <button type="button" disabled={!selectedFilter} onClick={() => {
              setFormData(current => ({ ...current, ...Object.fromEntries(filterFields.map(field => [field.key, field.key === selectedFilter ? 'true' : 'false'])) }));
              setFilterConfirmed(true);
            }} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-md bg-yellow-400 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40">Seçimle Devam Et</button>
          </div>
        </div>
      )}
      <div className="lg:hidden sticky top-0 z-50 grid grid-cols-2 gap-1 p-2 bg-[#111b22]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <button onClick={() => setMobileView("form")} className={`min-h-11 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors sm:text-sm ${mobileView === "form" ? "bg-yellow-400 text-black" : "bg-white/5 text-slate-300"}`}><span className="flex h-5 w-5 items-center justify-center rounded bg-black/15 text-[10px]">1</span><SlidersHorizontal size={16} /> Bilgileri Gir</button>
        <button onClick={() => setMobileView("preview")} className={`min-h-11 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors sm:text-sm ${mobileView === "preview" ? "bg-yellow-400 text-black" : "bg-white/5 text-slate-300"}`}><span className="flex h-5 w-5 items-center justify-center rounded bg-black/15 text-[10px]">2</span><Eye size={16} /> Belgeyi Kontrol Et</button>
      </div>
      
      {/* SOL PANEL (Magic Variable Editörü) */}
      <div className={`${mobileView === "form" ? "flex" : "hidden"} lg:flex w-full lg:w-[58%] shrink-0 min-h-[calc(100svh-61px)] lg:h-full overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 pb-24 sm:pt-6 sm:pb-24 lg:py-8 bg-[#16222a] border-r border-white/5 relative z-10 custom-scrollbar shadow-2xl flex-col`}>
        {/* Glow effect on left panel */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <button onClick={onBack} className="mb-4 flex min-h-10 w-max items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-yellow-400 sm:mb-5">
          <ArrowLeft size={17} /> Belgelere dön
        </button>

        <div className="mb-5">
           <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-400">{template.category}</p>
           <h1 className="mb-2 text-2xl font-bold leading-snug text-white">
             {getDocumentTitle(template.id, template.title)}
           </h1>
           <div className="mt-4 flex items-center gap-3">
             <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-yellow-400 transition-all duration-300" style={{ width: `${completionRate}%` }} /></div>
             <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-slate-300">%{completionRate} zorunlu alan</span>
           </div>
        </div>
        
        <nav className="relative z-10 mb-4 grid grid-cols-2 gap-2 sm:flex" aria-label="Belge bölümleri">
          {visibleSections.map((section, sectionIndex) => {
            const isActive = section.id === activeSectionId;
            return <button key={section.id} type="button" onClick={() => setOpenSections({ [section.id]: true })} aria-current={isActive ? 'step' : undefined} className={`flex min-h-11 flex-1 items-center gap-2 rounded-md border px-3 text-left text-xs font-semibold transition-colors ${isActive ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-black ${isActive ? 'bg-black/15' : 'bg-white/5 text-yellow-400'}`}>{sectionIndex + 1}</span><span className="line-clamp-2">{section.title}</span></button>;
          })}
        </nav>

        <div className="flex-1 relative z-10">
          {visibleSections.map((section, sectionIndex) => {
            if (section.id !== activeSectionId) return null;
            const sectionFields = section.fields;
            return <section key={section.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
              <div className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-4 text-left">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-yellow-400/10 text-xs font-bold text-yellow-400">{sectionIndex + 1}</span>
                <span className="min-w-0 flex-1"><strong className="block text-sm font-semibold text-white">{section.title}</strong><span className="block truncate text-[11px] text-slate-500">{section.description}</span></span>
              </div>
              <div className="grid grid-cols-1 gap-5 px-4 py-5">
            {sectionFields.map(field => {
              const riskColumnGroups = field.type === 'list' ? getRiskColumnGroups(field.options) : [];
              const riskFactorFields = riskColumnGroups.flatMap(group => [group.probability, group.severity, group.frequency].filter(Boolean));
              const calculatedRiskFields = riskColumnGroups.flatMap(group => [group.score, group.result].filter(Boolean));
              const fieldRequired = isFieldRequired(field);
              return (
                <div key={field.key} className={`group rounded-md transition-shadow ${guidanceField?.key === field.key ? 'outline outline-1 outline-offset-4 outline-amber-300/20' : ''}`} onFocusCapture={() => setFocusedFieldKey(field.key)}>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-300 group-focus-within:text-yellow-400 transition-colors">
                    <span className="min-w-0 flex-1">{getFieldLabel(field)}</span>
                    <span className={`shrink-0 text-[9px] font-semibold uppercase ${fieldRequired ? 'text-yellow-400' : 'text-slate-600'}`}>{fieldRequired ? 'Zorunlu' : 'İsteğe bağlı'}</span>
                  </label>
                  {field.type === "image" && (
                    <div className="relative w-full">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field.key)} className="hidden" id={`logo-upload-${field.key}`} />
                       <label htmlFor={`logo-upload-${field.key}`} className="w-full flex items-center justify-between px-4 py-3.5 bg-[#1b3039] border border-white/10 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-all shadow-inner text-sm text-slate-400 group-focus-within:ring-1 focus-within:ring-yellow-500">
                          <span className="truncate flex-1">{formData[field.key] ? 'Görsel hazır' : 'PNG veya JPG seçin'}</span>
                          <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold"><Upload size={14} /> Gözat</span>
                       </label>
                    </div>
                  )}
                  {field.type === "text" && (
                    <input type="text" name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-[#1b3039] border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-left text-sm shadow-inner placeholder-slate-600" placeholder={field.placeholder || (fieldRequired ? "Bu bilgiyi yazın" : "Bilmiyorsanız boş bırakabilirsiniz")} />
                  )}
                  {field.type === "date" && (
                    <input type="date" name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-[#1b3039] border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm color-scheme-dark shadow-inner" />
                  )}
                  {field.type === "textarea" && (
                    <textarea name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} rows={5} dir="ltr" className="w-full px-4 py-3.5 bg-[#1b3039] border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-left text-sm leading-6 resize-y shadow-inner custom-scrollbar" placeholder={field.placeholder || (fieldRequired ? "Bu bilgiyi yazın" : "Bilmiyorsanız boş bırakabilirsiniz")} />
                  )}
                  {field.type === "select" && (
                    <select name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-[#1b3039] border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm shadow-inner text-slate-200">
                      <option value="">Seçiniz...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt === 'true' ? 'Göster' : opt === 'false' ? 'Gizle' : opt}</option>
                      ))}
                    </select>
                  )}
                  {field.type === "list" && (
                     <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-4">
                        {(formData[field.key] || []).map((item: any, idx: number) => (
                           <div key={idx} className="relative group border border-white/10 rounded-lg p-3 bg-black/40">
                              <button onClick={() => handleListRemove(field.key, idx)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 z-10 transition-colors bg-red-500/10 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs" title="Kaldır">X</button>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {field.options ? field.options.map(subFieldName => (
                                  <div key={subFieldName} className="sm:col-span-1">
                                    <label className="block text-[10px] text-slate-500 mb-1">{getSubFieldLabel(subFieldName)}</label>
                                    {field.optionTypes?.[subFieldName] === 'image' ? <>
                                      <input type="file" accept="image/*" onChange={event => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;
                                        void constrainImage(file).then(image => {
                                          imageDimensions.current.set(image.dataUrl, image.dimensions);
                                          handleListChange(field.key, idx, subFieldName, image.dataUrl);
                                        }).catch(() => setDownloadError('Görsel okunamadı. PNG veya JPG dosyası seçin.'));
                                      }} className="hidden" id={`${field.key}-${idx}-${subFieldName}`} />
                                      <label htmlFor={`${field.key}-${idx}-${subFieldName}`} className="flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded border border-white/10 bg-black/60 px-3 text-xs text-yellow-400 hover:border-yellow-500/50"><Upload size={13} />{item[subFieldName] ? 'Görsel hazır' : 'Görsel seç'}</label>
                                    </> : <input
                                      type={riskFactorFields.includes(subFieldName) ? 'number' : 'text'}
                                      min={riskFactorFields.includes(subFieldName) ? '0' : undefined}
                                      step={riskFactorFields.includes(subFieldName) ? 'any' : undefined}
                                      value={item[subFieldName] || ""}
                                      readOnly={subFieldName === getSequenceKey(field.key) || calculatedRiskFields.includes(subFieldName)}
                                      onChange={(e) => handleListChange(field.key, idx, subFieldName, e.target.value)}
                                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded focus:ring-1 focus:border-yellow-500/50 outline-none shadow-inner text-xs read-only:text-amber-300 read-only:cursor-not-allowed"
                                      placeholder={calculatedRiskFields.includes(subFieldName) ? 'Otomatik hesaplanır' : '...'}
                                    />}
                                  </div>
                                )) : (
                                  <div className="col-span-2">
                                     <input type="text" value={item['value'] || ""} onChange={(e) => handleListChange(field.key, idx, 'value', e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded focus:ring-1 focus:border-yellow-500/50 outline-none shadow-inner text-sm" placeholder="Değer giriniz..." />
                                  </div>
                                )}
                              </div>
                           </div>
                        ))}
                        <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-2">
                          <button onClick={() => handleListAdd(field.key, bulkRowCounts[field.key] || 1)} className="py-2 border border-dashed border-yellow-500/30 text-yellow-500/70 hover:text-yellow-500 hover:border-yellow-500/60 rounded-lg text-xs font-bold uppercase transition-colors">+ Satır Ekle</button>
                          <label className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 text-[10px] text-slate-400">Adet<input aria-label="Eklenecek satır adedi" type="number" min="1" max="200" value={bulkRowCounts[field.key] || 1} onChange={event => setBulkRowCounts(current => ({ ...current, [field.key]: Math.min(200, Math.max(1, Number(event.target.value) || 1)) }))} className="w-full bg-transparent text-right text-sm font-bold text-white outline-none" /></label>
                        </div>
                     </div>
                  )}
                </div>
              );
            })}
              </div>
              {visibleSections.length > 1 && <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-3">
                <button type="button" disabled={sectionIndex === 0} onClick={() => setOpenSections({ [visibleSections[sectionIndex - 1].id]: true })} className="min-h-10 px-3 text-xs font-semibold text-slate-400 hover:text-white disabled:invisible">Önceki bölüm</button>
                {sectionIndex < visibleSections.length - 1 ? <button type="button" onClick={() => setOpenSections({ [visibleSections[sectionIndex + 1].id]: true })} className="min-h-10 rounded-md bg-yellow-400 px-4 text-xs font-bold text-black hover:bg-yellow-300">Sonraki bölüm</button> : <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><Check size={15} /> Son bölüm</span>}
              </div>}
            </section>;
          })}
        </div>

        {/* Action Buttons Pinned to Bottom */}
        <div className="fixed lg:sticky bottom-0 inset-x-0 lg:inset-x-auto px-3 sm:px-6 lg:px-0 pt-3 mt-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-white/10 z-20 bg-[#16222a]/96 backdrop-blur-xl">
          {downloadError && <p role="alert" className="mb-3 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{downloadError}</p>}
          <button onClick={handleDownload} disabled={loading || !docxArrayBuffer} className="flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3.5 text-sm font-bold text-black hover:bg-yellow-300 active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Belge hazırlanıyor</> : <><Download size={18} /> Belgeyi Oluştur ve İndir</>}
          </button>
        </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME (Docx Preview) */}
      <div className={`${mobileView === "preview" ? "flex" : "hidden"} lg:flex w-full lg:w-[42%] min-h-[calc(100svh-61px)] lg:h-full bg-[#1a2b34] flex-col relative`}>
        <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#111b22]/90 px-4 py-3 sm:px-6">
          <div className="min-w-0"><strong className="block text-sm text-white">Belgede kontrol edin: {visibleSections[activeSectionIndex]?.title || 'Belge'}</strong><span className="block truncate text-[10px] text-slate-400 sm:text-xs">Soldaki alanı doldurun; değişiklik sağdaki belgeye otomatik işlenir.</span></div>
          <span className="shrink-0 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[9px] font-bold uppercase text-emerald-300">Canlı</span>
        </div>
        {guidanceField && fieldGuidance && <aside className="shrink-0 border-b border-white/10 bg-[#14242c] px-4 py-3 sm:px-6" aria-label="Alan asistanı">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1a2d36] shadow-sm">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-300/10 text-amber-300"><Lightbulb size={16} /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-white">{getFieldLabel(guidanceField)}</p><p className="text-[10px] text-slate-500">Alan asistanı</p></div>
              <span className={`rounded px-2 py-1 text-[9px] font-bold uppercase ${isFieldRequired(guidanceField) ? 'bg-amber-300 text-[#111b22]' : 'bg-white/5 text-slate-400'}`}>{isFieldRequired(guidanceField) ? 'Zorunlu' : 'İsteğe bağlı'}</span>
            </div>
            <div className="grid gap-px bg-white/[0.07] sm:grid-cols-2">
              <div className="bg-[#1a2d36] px-3 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-300">Nasıl doldurulur?</p><p className="mt-1 text-[11px] leading-5 text-slate-300">{fieldGuidance.instruction}</p><p className="mt-1.5 border-l-2 border-amber-300/40 pl-2 text-[10px] leading-4 text-slate-500">{fieldGuidance.example}</p></div>
              <div className="bg-[#1a2d36] px-3 py-3"><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cyan-300"><PencilLine size={12} /> Yazdığınız</p>{guidanceValueText ? <p className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-white custom-scrollbar">{guidanceValueText}</p> : <p className="mt-1 text-[11px] leading-5 text-slate-500">Soldaki alanı doldurduğunuzda içeriğiniz burada görünür.</p>}</div>
            </div>
          </div>
        </aside>}
        <div ref={previewViewportRef} className="relative flex-1 overflow-auto bg-[#52616a] p-4 custom-scrollbar sm:p-6">
          {loading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1b2d36]/90"><span className="flex items-center gap-3 text-sm font-semibold text-slate-200"><span className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-300/30 border-t-yellow-300" /> Belge hazırlanıyor</span></div>}
          {loadError ? <div className="mx-auto mt-12 max-w-sm rounded-md border border-red-400/20 bg-[#16222a] p-5 text-center text-sm leading-6 text-red-200">{loadError}</div> : <div className="mx-auto origin-top-left" style={{ width: previewWidth * previewScale, height: previewHeight * previewScale }}><div ref={previewRef} className="docx-live-preview origin-top-left text-black shadow-[0_18px_45px_rgba(0,0,0,0.32)]" style={{ width: previewWidth, minHeight: previewHeight, transform: `scale(${previewScale})` }} /></div>}
          {!loading && !loadError && !docxArrayBuffer && <div className="mx-auto mt-12 max-w-sm rounded-md border border-white/10 bg-[#16222a] p-5 text-center text-sm text-slate-300">Belge önizlemesi yüklenemedi.</div>}
          </div>
      </div>
    </div>
  );
};

