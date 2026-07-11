import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Upload, Plus, Trash2, FileText, Download, Printer } from 'lucide-react';
import { generatePDF } from '../services/pdfService';
import { renderAsync } from 'docx-preview';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Dynamic Custom Clauses
  const [clauses, setClauses] = useState<CustomClause[]>([]);
  const [newClause, setNewClause] = useState('');

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
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
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: () => "",
        });

        const docData = { ...formData, clauses };
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
        console.error("Docxtemplater error:", error);
        setPreviewError(error.message || "Template processing failed");
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

      const newPhotos = files.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* LEFT PANE: ENTRYS */}
      <div className="w-1/2 h-full overflow-y-auto p-6 bg-white border-r">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Listeye Dön
        </button>
        <h1 className="text-2xl font-bold mb-6 text-slate-800">{template.title} <span className="text-sm font-normal text-slate-500">Düzenle</span></h1>
        
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
            {template.fields?.filter(f => !f.dependsOn || formData[f.dependsOn.field] === f.dependsOn.value).map(field => {
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
                  <div key={i} className="relative group aspect-square rounded-md overflow-hidden bg-slate-100 border">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
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
          <Button variant="outline" size="sm" onClick={onSave} loading={loading}>
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

