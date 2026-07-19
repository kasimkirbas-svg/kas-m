import React, { useState, useEffect, useRef } from "react";
import { DocumentTemplate } from "../types";
import { ArrowLeft, Save, Download, Printer, Settings2, FileText, CheckCircle2 } from "lucide-react";
import { renderAsync } from "docx-preview";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";

interface DocumentEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onBack, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [docxArrayBuffer, setDocxArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadError(null);
    const initialData: Record<string, any> = {};
    if (template.fields) {
      template.fields.forEach(field => {
         initialData[field.key] = field.type === "date" ? new Date().toISOString().split("T")[0] : "";
      });
    }
    setFormData(initialData);

    if (template.fileUrl) {
      fetch(template.fileUrl)
        .then(res => {
           if(!res.ok) throw new Error("Dosya bulunamadı veya erişilemiyor.");
           return res.arrayBuffer();
        })
        .then(buffer => {
          setDocxArrayBuffer(buffer);
        })
        .catch(err => {
          console.error("Doküman yüklenirken hata:", err);
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
      const zip = new PizZip(buffer);
      
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
      doc.setData(data);
      doc.render();

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
    } catch (error) {
      console.log("Önizleme oluşturulurken veya değişken değiştirilirken hata:", error);
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

  const handleDownload = () => {
    if (!docxArrayBuffer) return;
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
      
      doc.setData(formData);
      doc.render();

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      
      saveAs(out, `${template.title}_Doldurulmus.docx`);
      onSave(); // return to dashboard
    } catch (error) {
      console.error("İndirme Hatası", error);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden text-slate-200">
      
      {/* SOL PANEL (Magic Variable Editörü) */}
      <div className="w-1/2 shrink-0 h-full overflow-y-auto px-8 py-10 bg-zinc-950 border-r border-white/5 relative z-10 custom-scrollbar shadow-2xl flex flex-col">
        {/* Glow effect on left panel */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <button onClick={onBack} className="flex items-center w-max text-slate-400 hover:text-yellow-500 mb-8 transition-colors font-medium text-sm group">
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-yellow-500/10 flex items-center justify-center mr-3 transition-colors border border-white/5 group-hover:border-yellow-500/30">
            <ArrowLeft size={16} />
          </div>
          Geri Dön
        </button>

        <div className="mb-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Settings2 className="w-3 h-3" /> Magic Variable Motoru
           </div>
           <h1 className="text-2xl font-black mb-2 text-white tracking-tight leading-snug">
             {template.title}
           </h1>
           <p className="text-slate-400 text-xs leading-relaxed">
             Aşağıdaki alanları doldurduğunuz an DOCX önizlemesine anlık olarak yansıyacaktır.
           </p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-1 gap-5 relative z-10">
            {template.fields?.map(field => {
              return (
                <div key={field.key} className="group">
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide group-focus-within:text-yellow-500 transition-colors">
                    {field.label}
                  </label>
                  {field.type === "text" && field.key === "logo" && (
                    <div className="relative w-full">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field.key)} className="hidden" id={`logo-upload-${field.key}`} />
                       <label htmlFor={`logo-upload-${field.key}`} className="w-full flex items-center justify-between px-4 py-3.5 bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-all shadow-inner text-sm text-slate-400 group-focus-within:ring-1 focus-within:ring-yellow-500">
                          <span className="truncate flex-1">{formData[field.key] ? 'Logo Yüklendi ✅' : 'Logo Seçin...'}</span>
                          <span className="text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded">Gözat</span>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Pinned to Bottom */}
        <div className="pt-6 mt-6 border-t border-white/5 flex gap-4 relative z-10 bg-zinc-950">
          <button onClick={handleDownload} disabled={loading || !docxArrayBuffer} className="flex-1 px-4 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
             <Download size={18} /> Şablonu İndir
          </button>
        </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME (Docx Preview) */}
      <div className="w-1/2 h-full bg-zinc-900/50 flex flex-col relative">
        <div className="h-16 shrink-0 bg-transparent flex items-center justify-between px-8 absolute top-0 w-full z-10 pointer-events-none">
            <span className="px-4 py-2 border border-white/10 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Canlı Önizleme Aktif
            </span>
        </div>
        
        {/* Render Preview Area */}
        <div className="flex-1 w-full h-full overflow-y-auto p-12 lg:p-24 flex justify-center items-start custom-scrollbar bg-zinc-900/30">
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
             <div className="w-[800px] shrink-0 bg-white min-h-[1100px] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm pointer-events-none select-none">
                <div ref={previewRef} className="w-full h-full [&>.docx-wrapper]:bg-transparent [&>.docx-wrapper]:p-0" />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

