import React, { useState, useEffect, useRef } from 'react';
import { DocumentTemplate } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Save, Download, Printer } from 'lucide-react';
import { generatePDF } from '../services/pdfService';

interface DocumentEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onBack, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [rawHtml, setRawHtml] = useState<string>('');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Initialize form data based on template fields
  useEffect(() => {
    const initialData: Record<string, any> = {};
    if (template.fields) {
      template.fields.forEach(field => {
        if (field.type === 'select' && field.options && field.options.length > 0) {
          initialData[field.key] = field.options[0];
        } else if (field.type === 'date') {
          initialData[field.key] = new Date().toISOString().split('T')[0];
        } else {
          initialData[field.key] = '';
        }
      });
    }
    setFormData(initialData);
  }, [template]);

  // Fetch the Word HTML file as text
  useEffect(() => {
    if (template.fileUrl) {
      fetch(template.fileUrl)
        .then(res => res.text())
        .then(text => {
          setRawHtml(text);
        })
        .catch(err => console.error('Erişim hatası:', err));
    }
  }, [template.fileUrl]);

  // Update live preview whenever formData or loaded HTML changes
  useEffect(() => {
    if (!rawHtml) return;

    let updatedHtml = rawHtml;
    // Basic replacement for all {keys}
    Object.keys(formData).forEach(key => {
      // Regex escaping and replacement
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      updatedHtml = updatedHtml.replace(regex, formData[key] || '');
    });

    setPreviewHtml(updatedHtml);
  }, [formData, rawHtml]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    // As basic pdf service just simulated, we will trigger it
    await generatePDF({ formData }, template.title);
    setLoading(false);
    onSave();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(previewHtml);
      printWindow.document.close();
      printWindow.focus();
      // Allow fonts/images to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="flex h-screen bg-[#07090E] overflow-hidden text-slate-200">
      {/* LEFT PANE: FORM ENTRYS */}
      <div className="w-1/2 h-full overflow-y-auto px-8 py-10 bg-[#0A0C10] border-r border-white/10 shadow-2xl z-10 custom-scrollbar">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-orange-500 mb-8 transition-colors font-medium text-sm">
          <ArrowLeft className="mr-2" size={18} /> Geri Dön
        </button>
        <h1 className="text-2xl font-bold mb-8 text-white tracking-tight leading-snug">
          {template.title} <span className="text-sm font-medium text-orange-500 ml-2">[Düzenle]</span>
        </h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            {template.fields?.map(field => {
              return (
                <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
                  {field.type === 'text' && (
                    <input type="text" name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#13161F] border border-white/5 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500/50 outline-none transition-all text-sm" placeholder={field.placeholder || '...'} />
                  )}
                  {field.type === 'date' && (
                    <input type="date" name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#13161F] border border-white/5 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500/50 outline-none transition-all text-sm color-scheme-dark" />
                  )}
                  {field.type === 'textarea' && (
                    <textarea name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-[#13161F] border border-white/5 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500/50 outline-none transition-all text-sm resize-none" placeholder={field.placeholder} />
                  )}
                  {field.type === 'select' && (
                    <select name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#13161F] border border-white/5 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500/50 outline-none transition-all text-sm">
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-8 mt-4 border-t border-white/10 flex gap-4">
            <Button onClick={handleGenerate} className="flex-1 justify-center py-3.5 shadow-lg shadow-orange-500/20" disabled={loading}>
              {loading ? 'İşleniyor...' : <><Save size={18} className="mr-2" /> Kaydet</>}
            </Button>
            <Button onClick={handlePrint} variant="outline" className="px-6 py-3.5 border-white/10 hover:bg-white/5">
              <Printer size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: LIVE PREVIEW */}
      <div className="w-1/2 h-full bg-[#13161F] flex flex-col relative">
        <div className="h-14 bg-[#0A0C10] border-b border-white/5 flex items-center px-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Canlı Önizleme
            </span>
        </div>
        <div className="flex-1 overflow-hidden p-6 custom-scrollbar">
          <div className="h-full w-full bg-white shadow-2xl rounded-sm overflow-hidden">
            {previewHtml ? (
              <iframe
                title="Document Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Şablon Yükleniyor...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
