import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Upload, Plus, Trash2, FileText, Download, Printer } from 'lucide-react';
import { generatePDF } from '../services/pdfService';
import { renderAsync } from 'docx-preview';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';

interface DocumentEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: () => void;
}

interface CustomClause {
  id: string;
  text: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onBack, onSave }) => {
  // Check if there are primary select fields
  const primarySelectFields = template.fields?.filter(
    (field) => field.type === 'select'
  ) || [];

  const [step, setStep] = useState<'preview' | 'selection' | 'editor'>('preview');

  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Dynamic Custom Clauses
  const [clauses, setClauses] = useState<CustomClause[]>([]);
  const [newClause, setNewClause] = useState('');

  // Photos
  const [photos, setPhotos] = useState<{ id: number, url: string, buffer: ArrayBuffer }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DOCX Content
  const previewRef = useRef<HTMLDivElement>(null);
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);

  // Reset form when template changes
  useEffect(() => {
    setFormData({
      companyName: '',
      preparedBy: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      // Pre-fill existing fields with default empty string or the first option
      ...(template.fields?.reduce((acc, field) => {
        if (field.type === 'select' && field.options && field.options.length > 0) {
          acc[field.key] = field.options[0];
        } else {
          acc[field.key] = '';
        }
        return acc;
      }, {} as Record<string, any>))
    });
    setClauses([]);
    setPhotos([]);
  }, [template]);

  // Fetch the template buffer once
  useEffect(() => {
    if (template.fileUrl) {
       fetch(template.fileUrl)
         .then(res => res.arrayBuffer())
         .then(buffer => setTemplateBuffer(buffer))
         .catch(err => console.error(err));
    }
  }, [template.fileUrl]);

  // Generate preview when buffer or formData changes
  useEffect(() => {
    if (!templateBuffer || !previewRef.current) return;

    const timer = setTimeout(() => {
      try {
        const zip = new PizZip(templateBuffer);
        
        let imageOptions = {
            centered: false,
            getImage: function(tagValue: string, tagName: string) {
                if (tagName === "logo" && photos.length > 0) {
                    return photos[0].buffer; // Return the first uploaded photo as logo
                }
                // Return 1x1 transparent png blank buffer if no logo uploaded
                return new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 8, 215, 99, 96, 0, 2, 0, 0, 5, 0, 1, 226, 38, 5, 155, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]).buffer;
            },
            getSize: function(img: any, tagValue: string, tagName: string) {
                return [150, 75]; // Width x height
            }
        };
        const imageModule = new ImageModule(imageOptions);
        
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: () => "",
          modules: [imageModule]
        });

        const docData: any = { ...formData, clauses };
        docData.logo = "logo"; // Trigger logo tag replacement
        
        template.fields?.filter(f => f.type === 'select').forEach(field => {
          field.options?.forEach(opt => {
            docData[`is${opt.replace(/[^a-zA-Z0-9]/g, '')}`] = (formData[field.key] === opt);
          });
        });

        doc.render(docData);

        const blob = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        setPreviewError(null);
        renderAsync(blob, previewRef.current!).catch(err => {
          console.error("Docx-preview error:", err);
          setPreviewError(err.message || "Preview rendering failed");
        });
      } catch (error: any) {
        console.error("Docxtemplater error object:", error);
        
        let errorMsg = error.message || "Bilinmeyen bir hata oluştu";
        
        // Docxtemplater exposes multiple errors via properties.errors
        if (error.properties && error.properties.errors instanceof Array) {
            errorMsg = error.properties.errors
              .map((e: any) => e.properties?.explanation || e.message)
              .join('\n');
        } else if (error.message) {
            errorMsg = error.message;
        } else {
            errorMsg = JSON.stringify(error);
        }

        setPreviewError(`Şablon İşleme Hatası:\n${errorMsg}`);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [templateBuffer, formData, clauses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addClause = () => {
    if (!newClause.trim()) return;
    setClauses([...clauses, { id: Date.now().toString(), text: newClause }]);
    setNewClause('');
  };

  const removeClause = (id: string) => {
    setClauses(clauses.filter(c => c.id !== id));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      
      if (photos.length + files.length > 15) {
        alert("En fazla 15 fotoğraf yükleyebilirsiniz.");
        return;
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
             const buffer = event.target.result as ArrayBuffer;
             const url = URL.createObjectURL(file);
             setPhotos(prev => [...prev, { id: Date.now() + Math.random(), url, buffer }]);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate Backend PDF Gen
    await generatePDF({ formData, clauses, photos }, template.title);
    setLoading(false);
  };

  if (step === 'preview') {
    return (
      <div className="h-[calc(100vh-2rem)] flex flex-col bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-slate-800/30 p-8 flex justify-center custom-scrollbar">
          <div className="w-full max-w-[800px] h-auto min-h-full">
            <div ref={previewRef} className="docx-preview-container h-full w-full bg-white text-black !p-12 shadow-2xl rounded-sm" />
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-6">
           <div className="bg-slate-800 border border-orange-500/30 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center">
              <h2 className="text-xl font-bold text-white mb-4">Şablon Önizleme</h2>
              <p className="text-slate-300 text-sm mb-8">Bu dokümanı düzenlemek ve kendi bilgilerinizi girmek için aşağıdaki butona tıklayın.</p>
              <Button 
                onClick={() => setStep(primarySelectFields.length > 0 ? 'selection' : 'editor')}
                size="lg"
                className="w-full shadow-orange-500/20 py-3"
              >
                Bu Şablonu Kullan / Düzenlemeye Başla
              </Button>
              <button 
                onClick={onBack}
                className="mt-6 text-slate-400 hover:text-white text-sm transition-colors"
              >
                Geri Dön
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (step === 'selection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 selection-overlay">
        <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 text-center">
            Varyasyon Seçimi
          </h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Lütfen dokümanın detayını belirleyin.</p>
          
          <div className="space-y-5 mb-8">
            {primarySelectFields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                <select
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
            <button 
              onClick={onBack}
              className="flex items-center text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="mr-2" size={16} /> Geri Dön
            </button>
            <Button variant="primary" onClick={() => setStep('editor')} className="px-6 py-2.5 shadow-lg shadow-orange-500/20">
              Devam Et
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* LEFT PANE: ENTRYS */}
      <div className="w-1/2 h-full overflow-y-auto px-8 py-10 bg-white border-r shadow-lg z-10">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors font-medium">
          <ArrowLeft className="mr-2" size={18} /> Listeye Dön
        </button>
        <h1 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">{template.title} <span className="text-base font-medium text-slate-400 ml-2">Düzenle</span></h1>
        
        <div className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Firma Adı</label>
              <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Örn: XYZ Ltd. Şti." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hazırlayan Uzman</label>
              <input type="text" name="preparedBy" value={formData.preparedBy || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="İsim Soyisim" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
              <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama / Notlar</label>
              <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Genel değerlendirme..." />
            </div>
            {template.fields?.filter(f => !f.dependsOn || (f.dependsOn && formData[f.dependsOn.field] === f.dependsOn.value)).map(field => {
              // Skip rendering these since they are hardcoded above
              if (['companyName', 'preparedBy', 'date', 'description'].includes(field.key)) return null;

              return (
                <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  {field.type === 'text' && (
                    <input type="text" name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder={field.placeholder} />
                  )}
                  {field.type === 'date' && (
                    <input type="date" name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  )}
                  {field.type === 'textarea' && (
                    <textarea name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder={field.placeholder} />
                  )}
                  {field.type === 'select' && (
                    <select name={field.key} value={formData[field.key] || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>

           {/* Clauses Section */}
           <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center"><FileText size={18} className="mr-2" /> Ek Maddeler</h3>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newClause} 
                onChange={(e) => setNewClause(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addClause()}
                placeholder="Yeni madde ekle..." 
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button type="button" onClick={addClause} variant="outline"><Plus size={18} /></Button>
            </div>
            
            <ul className="space-y-2">
              {clauses.map(clause => (
                <li key={clause.id} className="flex justify-between items-center group bg-slate-50 px-3 py-2 rounded-md hover:bg-slate-100">
                  <span className="text-sm text-slate-700">{clause.text}</span>
                  <button onClick={() => removeClause(clause.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Photos */}
          <div className="border-t pt-4 pb-12">
            <h3 className="font-semibold text-slate-800 mb-2 flex flex-col">
              <span>Saha Fotoğrafları</span>
              <span className="text-xs text-slate-500 font-normal">Maksimum 15 fotoğraf. Şu an: {photos.length}</span>
            </h3>
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mb-4" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2" size={18} /> Fotoğraf Ekle
            </Button>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative group aspect-square rounded-md overflow-hidden bg-slate-100 border">
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    >
                      <Trash2 className="text-white" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: LIVE PREVIEW */}
      <div className="w-1/2 h-full bg-slate-700 overflow-y-auto relative flex flex-col">
        {/* Actions Bar */}
        <div className="bg-slate-800 text-white p-3 flex justify-end space-x-3 shadow-md sticky top-0 z-20">
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2" size={16} /> Yazdır / PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onSave}>
             <Download className="mr-2" size={16} /> Kaydet
          </Button>
        </div>

        {/* Live Preview Container */}
        <div className="p-8 pb-32 flex-1 flex flex-col items-center">
          {previewError && (
             <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
               <strong>Önizleme Hatası: </strong> {previewError}
             </div>
          )}
          <div ref={previewRef} className="w-full bg-white shadow-xl min-h-[1056px]"></div>
        </div>
      </div>
    </div>
  );
};

