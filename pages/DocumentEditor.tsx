/// <reference path="../vendor.d.ts" />
import React, { useState, useEffect, useRef } from "react";
import { DocumentTemplate } from "../types";
import { ArrowLeft, Check, ChevronDown, Download, FileText, Eye, SlidersHorizontal, Upload } from "lucide-react";
import { renderAsync } from "docx-preview";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";
import { buildFieldSections, getDocumentTitle, getFieldLabel, getSubFieldLabel, isFieldVisible } from "../services/documentFieldService";

interface DocumentEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onBack, onSave }) => {
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [docxArrayBuffer, setDocxArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const fieldSections = buildFieldSections(template.fields);
  const visibleFields = template.fields.filter(field => isFieldVisible(field, formData));
  const completedFields = visibleFields.filter(field => Array.isArray(formData[field.key]) ? formData[field.key].length > 0 : Boolean(formData[field.key])).length;
  const completionRate = visibleFields.length ? Math.round((completedFields / visibleFields.length) * 100) : 100;

  useEffect(() => {
    setLoadError(null);
    setDownloadError(null);
    setLoading(true);
    const initialData: Record<string, any> = {};
    if (template.fields) {
      template.fields.forEach(field => {
         initialData[field.key] = field.type === "date" ? new Date().toISOString().split("T")[0] : "";
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
          setDocxArrayBuffer(buffer);
          setLoading(false);
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
    if (!docxArrayBuffer || !previewRef.current) return;
    updatePreview(docxArrayBuffer, formData);
  }, [docxArrayBuffer, formData]);

  const updatePreview = async (buffer: ArrayBuffer, data: Record<string, any>) => {
    try {
      // ÖNEMLİ: ArrayBuffer her karakter girildiğinde yeniden kullanılıyor. 
      // PizZip orijinal buffer'ı modifiye ettiği için etiketler kayboluyordu. 
      // buffer.slice(0) ile klonlayarak her seferinde tertemiz bir docx kopyası ile çalışmasını sağlıyoruz!
      const zip = new PizZip(buffer.slice(0));
      
      const imageOptions = {
        centered: false,
        getImage(tagValue: string, tagName: string) {
          if (tagName === "logo" && tagValue) {
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
        getSize(img: any, tagValue: string, tagName: string) {
          if (tagName === "logo") return [150, 150]; // Default logo size
          return [150, 150];
        }
      };
      
      const imageModule = new ImageModule(imageOptions);
      
      const doc = new Docxtemplater(zip, { 
         paragraphLoop: true, 
         linebreaks: true,
         modules: [imageModule],
         nullGetter(part) { if (!part.module) { return ""; } if (part.module === "rawxml") { return ""; } return ""; }
      });
      doc.render(data);

      const outBuffer = doc.getZip().generate({ type: "arraybuffer" });
      const blob = new Blob([outBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      
      if (previewRef.current) {
        // Clear previous content
        previewRef.current.innerHTML = "";
        await renderAsync(blob, previewRef.current, previewRef.current, {
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
      }
    } catch (error: any) {
      console.log("Önizleme oluşturulurken veya değişken değiştirilirken hata:", error);
      setLoadError("Bu şablon okunamadı. Orijinal dosyanın bozuk veya eski (.doc) formatlı olmadığından emin olup tekrar deneyin. Detay: " + (error.message || "Bilinmiyor"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldKey]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListAdd = (fieldKey: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: [...(prev[fieldKey] || []), {}]
    }));
  };

  const handleListRemove = (fieldKey: string, index: number) => {
    setFormData(prev => {
      const newList = [...(prev[fieldKey] || [])];
      newList.splice(index, 1);
      return { ...prev, [fieldKey]: newList };
    });
  };

  const handleListChange = (fieldKey: string, index: number, subKey: string, value: string) => {
    setFormData(prev => {
      const newList = [...(prev[fieldKey] || [])];
      newList[index] = { ...newList[index], [subKey]: value };
      return { ...prev, [fieldKey]: newList };
    });
  };

  const handleDownload = () => {
    if (!docxArrayBuffer) return;
    const missingRequired = visibleFields.filter(field => field.required && !formData[field.key]);
    if (missingRequired.length) {
      setDownloadError(`Lütfen zorunlu alanları doldurun: ${missingRequired.map(getFieldLabel).join(', ')}`);
      return;
    }
    setDownloadError(null);
    try {
      const zip = new PizZip(docxArrayBuffer);
      
      const imageOptions = {
        centered: false,
        getImage(tagValue: string, tagName: string) {
          if (tagName === "logo" && tagValue) {
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
        getSize(img: any, tagValue: string, tagName: string) {
          if (tagName === "logo") return [150, 150];
          return [150, 150];
        }
      };
      
      const imageModule = new ImageModule(imageOptions);

      const doc = new Docxtemplater(zip, { 
        paragraphLoop: true, 
        linebreaks: true,
        modules: [imageModule],
        nullGetter(part) { if (!part.module) { return ""; } if (part.module === "rawxml") { return ""; } return ""; }
      });
      
      doc.render(formData);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      
      const documentTitle = getDocumentTitle(template.id, template.title);
      saveAs(out, `${documentTitle}_Doldurulmus.docx`);
      const historyEntry = {
        id: crypto.randomUUID(),
        templateId: template.id,
        title: documentTitle,
        category: template.category,
        createdAt: new Date().toISOString(),
        fileName: `${documentTitle}_Doldurulmus.docx`
      };
      try {
        const history = JSON.parse(localStorage.getItem('isg_document_history') || '[]');
        localStorage.setItem('isg_document_history', JSON.stringify([historyEntry, ...history].slice(0, 100)));
      } catch {
        localStorage.setItem('isg_document_history', JSON.stringify([historyEntry]));
      }
      onSave(); // return to dashboard
    } catch (error) {
      console.error("İndirme Hatası", error);
      setDownloadError('Doküman oluşturulamadı. Alanları kontrol edip tekrar deneyin.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-zinc-950 lg:overflow-hidden text-slate-200">
      <div className="lg:hidden sticky top-0 z-50 grid grid-cols-2 gap-1 p-2 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => setMobileView("form")} className={`min-h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors ${mobileView === "form" ? "bg-yellow-500 text-black" : "bg-white/5 text-slate-300"}`}><SlidersHorizontal size={17} /> Alanlar</button>
        <button onClick={() => setMobileView("preview")} className={`min-h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors ${mobileView === "preview" ? "bg-yellow-500 text-black" : "bg-white/5 text-slate-300"}`}><Eye size={17} /> Önizleme</button>
      </div>
      
      {/* SOL PANEL (Magic Variable Editörü) */}
      <div className={`${mobileView === "form" ? "flex" : "hidden"} lg:flex w-full lg:w-1/2 shrink-0 min-h-[calc(100vh-61px)] lg:h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 bg-zinc-950 border-r border-white/5 relative z-10 custom-scrollbar shadow-2xl flex-col`}>
        {/* Glow effect on left panel */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <button onClick={onBack} className="flex items-center min-h-11 w-max text-slate-400 hover:text-yellow-500 mb-6 lg:mb-8 transition-colors font-medium text-sm group">
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-yellow-500/10 flex items-center justify-center mr-3 transition-colors border border-white/5 group-hover:border-yellow-500/30">
            <ArrowLeft size={16} />
          </div>
          Geri Dön
        </button>

        <div className="mb-6">
           <p className="text-yellow-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-3">{template.category}</p>
           <h1 className="text-2xl font-bold mb-2 text-white leading-snug">
             {getDocumentTitle(template.id, template.title)}
           </h1>
           <p className="text-slate-400 text-xs leading-relaxed">
             Bu dokümana ait alanları doldurun. Değişiklikler önizlemeye otomatik yansır.
           </p>
           <div className="mt-5 flex items-center gap-3">
             <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-yellow-400 transition-all duration-300" style={{ width: `${completionRate}%` }} /></div>
             <span className="text-xs font-semibold tabular-nums text-slate-300">%{completionRate}</span>
           </div>
        </div>
        
        <div className="space-y-3 flex-1 relative z-10">
          {fieldSections.map(section => {
            const sectionFields = section.fields.filter(field => isFieldVisible(field, formData));
            if (!sectionFields.length) return null;
            const isOpen = openSections[section.id];
            return <section key={section.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
              <button type="button" onClick={() => setOpenSections(current => ({ ...current, [section.id]: !isOpen }))} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-white/[0.035] transition-colors" aria-expanded={isOpen}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-yellow-400/10 text-xs font-bold text-yellow-400">{sectionFields.length}</span>
                <span className="min-w-0 flex-1"><strong className="block text-sm font-semibold text-white">{section.title}</strong><span className="block truncate text-[11px] text-slate-500">{section.description}</span></span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <div className="grid grid-cols-1 gap-5 border-t border-white/5 px-4 py-5">
            {sectionFields.map(field => {
              return (
                <div key={field.key} className="group">
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-300 group-focus-within:text-yellow-400 transition-colors">
                    {getFieldLabel(field)} {field.required && <span className="text-yellow-400" aria-label="zorunlu">*</span>}
                  </label>
                  {field.type === "text" && field.key === "logo" && (
                    <div className="relative w-full">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field.key)} className="hidden" id={`logo-upload-${field.key}`} />
                       <label htmlFor={`logo-upload-${field.key}`} className="w-full flex items-center justify-between px-4 py-3.5 bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-all shadow-inner text-sm text-slate-400 group-focus-within:ring-1 focus-within:ring-yellow-500">
                          <span className="truncate flex-1">{formData[field.key] ? 'Logo hazır' : 'PNG veya JPG seçin'}</span>
                          <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold"><Upload size={14} /> Gözat</span>
                       </label>
                    </div>
                  )}
                  {field.type === "text" && field.key !== "logo" && (
                    <input type="text" name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm shadow-inner placeholder-slate-600" placeholder={field.placeholder || "Veri giriniz..."} />
                  )}
                  {field.type === "date" && (
                    <input type="date" name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm color-scheme-dark shadow-inner" />
                  )}
                  {field.type === "textarea" && (
                    <textarea name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} rows={4} className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm resize-none shadow-inner custom-scrollbar" placeholder={field.placeholder || "Veri giriniz..."} />
                  )}
                  {field.type === "select" && (
                    <select name={field.key} value={formData[field.key] || ""} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500/50 outline-none transition-all text-sm shadow-inner text-slate-200">
                      <option value="">Seçiniz...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
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
                                    <input type="text" value={item[subFieldName] || ""} onChange={(e) => handleListChange(field.key, idx, subFieldName, e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded focus:ring-1 focus:border-yellow-500/50 outline-none shadow-inner text-xs" placeholder="..." />
                                  </div>
                                )) : (
                                  <div className="col-span-2">
                                     <input type="text" value={item['value'] || ""} onChange={(e) => handleListChange(field.key, idx, 'value', e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded focus:ring-1 focus:border-yellow-500/50 outline-none shadow-inner text-sm" placeholder="Değer giriniz..." />
                                  </div>
                                )}
                              </div>
                           </div>
                        ))}
                        <button onClick={() => handleListAdd(field.key)} className="w-full py-2 border border-dashed border-yellow-500/30 text-yellow-500/70 hover:text-yellow-500 hover:border-yellow-500/60 rounded-lg text-xs font-bold uppercase transition-colors">
                           + Yeni Ekle
                        </button>
                     </div>
                  )}
                </div>
              );
            })}
              </div>}
            </section>;
          })}
        </div>

        {/* Action Buttons Pinned to Bottom */}
        <div className="sticky bottom-0 pt-4 mt-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-white/5 relative z-10 bg-zinc-950">
          {downloadError && <p role="alert" className="mb-3 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{downloadError}</p>}
          <button onClick={handleDownload} disabled={loading || !docxArrayBuffer} className="flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3.5 text-sm font-bold text-black hover:bg-yellow-300 active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Şablon hazırlanıyor</> : <><Download size={18} /> Dokümanı Oluştur</>}
          </button>
        </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME (Docx Preview) */}
      <div className={`${mobileView === "preview" ? "flex" : "hidden"} lg:flex w-full lg:w-1/2 min-h-[calc(100vh-61px)] lg:h-full bg-zinc-900/50 flex-col relative`}>
        <div className="h-14 lg:h-16 shrink-0 bg-transparent flex items-center justify-between px-4 lg:px-8 absolute top-0 w-full z-10 pointer-events-none">
            <span className="px-3 lg:px-4 py-2 border border-white/10 rounded-full bg-black/70 backdrop-blur-md text-[10px] lg:text-xs font-semibold text-slate-300 uppercase tracking-wider lg:tracking-widest flex items-center gap-2 lg:gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Canlı Önizleme Aktif
            </span>
        </div>
        
        {/* Render Preview Area */}
        <div className="flex-1 w-full h-full overflow-auto px-4 pb-6 pt-20 lg:p-24 flex justify-start lg:justify-center items-start custom-scrollbar bg-zinc-900/30 overscroll-contain touch-pan-x touch-pan-y">
           {loadError ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-red-400 gap-4 max-w-sm text-center">
                 <FileText size={48} className="opacity-20" />
                 <p className="tracking-wide text-sm font-semibold">{loadError}</p>
                 <button onClick={onBack} className="mt-4 px-6 py-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider transition-all">Geri Dön</button>
              </div>
           ) : !docxArrayBuffer ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 animate-pulse gap-4">
                 <FileText size={48} className="opacity-20" />
                 <p className="tracking-widest uppercase text-xs font-bold">Şablon Yükleniyor...</p>
              </div>
           ) : (
             <div className="w-[800px] shrink-0 bg-white min-h-[1100px] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm pointer-events-none select-none" aria-label="Belge önizlemesi">
                <div ref={previewRef} className="w-full h-full [&>.docx-wrapper]:bg-transparent [&>.docx-wrapper]:p-0" />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

