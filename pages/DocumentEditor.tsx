import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Upload, Plus, Trash2, FileText, Download, Printer } from 'lucide-react';
import { generatePDF } from '../services/pdfService';
import mammoth from 'mammoth';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

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
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    preparedBy: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Dynamic Custom Clauses
  const [clauses, setClauses] = useState<CustomClause[]>([]);
  const [newClause, setNewClause] = useState('');

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DOCX Content
  const [docHtml, setDocHtml] = useState<string | null>(null);

  useEffect(() => {
    if (template.fileUrl) {
       fetch(template.fileUrl)
         .then(res => res.arrayBuffer())
         .then(buffer => mammoth.convertToHtml({ arrayBuffer: buffer }))
         .then(result => setDocHtml(DOMPurify.sanitize(result.value)))
         .catch(err => console.error(err));
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Örn: XYZ Ltd. Şti." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hazırlayan Uzman</label>
              <input type="text" name="preparedBy" value={formData.preparedBy} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="İsim Soyisim" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama / Notlar</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Genel değerlendirme..." />
            </div>
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

        {/* Paper Container */}
        <div className="flex-1 p-8 flex justify-center">
          <div className="bg-white text-black shadow-2xl p-12 min-h-[1056px] w-[794px] max-w-full print:p-0 print:shadow-none print:w-full shrink-0 relative" id="pdf-content">
            
            {/* Header */}
            <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide break-words max-w-[400px]">
                  {template.title || 'Doküman Başlığı'}
                </h1>
                <p className="text-slate-500 mt-2">{template.category} Dokümanı</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{formData.companyName || 'Firma Adı'}</p>
                <p className="text-sm text-slate-500">{formData.date}</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              {docHtml ? (
                <div className="prose max-w-none text-sm text-slate-800">
                  {parse(docHtml)}
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Genel Bilgiler</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold text-slate-700">Hazırlayan:</span> {formData.preparedBy || '...'}</div>
                    <div><span className="font-semibold text-slate-700">Firma:</span> {formData.companyName || '...'}</div>
                    <div className="col-span-2">
                      <span className="font-semibold text-slate-700">Açıklama:</span>
                      <p className="mt-1 text-slate-600 whitespace-pre-wrap">{formData.description || "Açıklama yok."}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Clauses */}
            {clauses.length > 0 && (
              <div className="mb-8 break-inside-avoid">
                <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Ek Maddeler & Notlar</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                  {clauses.map(clause => <li key={clause.id}>{clause.text}</li>)}
                </ul>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div className="break-before-auto">
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-1">Saha Fotoğrafları</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-square border border-slate-200 rounded-lg overflow-hidden relative break-inside-avoid">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
