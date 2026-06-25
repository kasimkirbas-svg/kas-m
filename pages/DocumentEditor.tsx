import React, { useState, useRef } from 'react';
import { DocumentTemplate } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Upload, Plus, Trash2, FileText, Download, CheckCircle, Printer } from 'lucide-react';
import { generatePDF } from '../services/pdfService';

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
  const [step, setStep] = useState<1 | 2>(1); // 1: Edit, 2: Preview
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
    setStep(2);
  };

  // Preview / Print View
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-[800px] flex flex-col">
        {/* Toolbar - No Print */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center no-print sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="font-semibold">Doküman Hazır</span>
          </div>
          <div className="flex space-x-3">
             <Button variant="secondary" size="sm" onClick={() => setStep(1)}>
               Düzenle
             </Button>
             <Button variant="primary" size="sm" onClick={() => window.print()}>
               <Printer className="mr-2" size={16} />
               Yazdır / PDF Kaydet
             </Button>
             <Button variant="outline" size="sm" onClick={onSave}>
               <Download className="mr-2" size={16} />
               Sisteme Kaydet
             </Button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="p-12 print:p-0 flex-1" id="pdf-content">
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">{template.title}</h1>
              <p className="text-slate-500 mt-2">{template.category} Dokümanı</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{formData.companyName}</p>
              <p className="text-sm text-slate-500">{formData.date}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Genel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-slate-700">Hazırlayan:</span> {formData.preparedBy}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Firma:</span> {formData.companyName}
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">Açıklama:</span>
                <p className="mt-1 text-slate-600 whitespace-pre-wrap">{formData.description || "Açıklama girilmedi."}</p>
              </div>
            </div>
          </div>

          {clauses.length > 0 && (
            <div className="mb-8 break-inside-avoid">
              <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Ek Maddeler & Notlar</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                {clauses.map(clause => (
                  <li key={clause.id}>{clause.text}</li>
                ))}
              </ul>
            </div>
          )}

          {photos.length > 0 && (
            <div className="break-before-auto">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-1">Saha Fotoğrafları</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="aspect-square border border-slate-200 rounded-lg overflow-hidden relative break-inside-avoid">
                     <img src={photo} alt={`Evidence ${index}`} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-1">
                       Foto #{index + 1}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between break-inside-avoid">
             <div className="text-center">
               <p className="mb-8 font-semibold">Hazırlayan</p>
               <div className="h-0.5 w-32 bg-slate-400 mx-auto"></div>
               <p className="mt-2 text-sm">{formData.preparedBy}</p>
             </div>
             <div className="text-center">
               <p className="mb-8 font-semibold">Onaylayan</p>
               <div className="h-0.5 w-32 bg-slate-400 mx-auto"></div>
               <p className="mt-2 text-sm">İmza / Kaşe</p>
             </div>
          </div>
          
          <div className="mt-12 text-center text-xs text-slate-400">
             Bu belge Kırbaş Doküman Sistemi altyapısı ile dijital olarak oluşturulmuştur.
          </div>
        </div>
      </div>
    );
  }

  // Edit View
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{template.title}</h2>
          <p className="text-slate-500">Doküman oluşturma sihirbazı</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <section>
          <div className="flex items-center mb-4 text-blue-600">
            <FileText className="mr-2" size={20} />
            <h3 className="text-lg font-semibold">Temel Bilgiler</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Firma Adı</label>
              <input 
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                type="text" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Örn: Kırbaş İnşaat A.Ş." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
              <input 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                type="date" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hazırlayan Kişi</label>
              <input 
                name="preparedBy"
                value={formData.preparedBy}
                onChange={handleInputChange}
                type="text" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Ad Soyad" 
              />
            </div>
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama / Kapsam</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3} 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Doküman ile ilgili genel notlar..." 
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section 2: Dynamic Items */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center text-blue-600">
                <Plus className="mr-2" size={20} />
                <h3 className="text-lg font-semibold">Ek Maddeler / Bulgular</h3>
             </div>
             <span className="text-xs text-slate-400">Örn: "Yangın tüpü eksik", "Zemin kaygan"</span>
          </div>
          
          <div className="space-y-3 mb-4">
            {clauses.map((clause) => (
              <div key={clause.id} className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-50 mr-3"></span>
                <span className="flex-1 text-sm text-slate-700">{clause.text}</span>
                <button onClick={() => removeClause(clause.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {clauses.length === 0 && <p className="text-sm text-slate-400 italic">Henüz madde eklenmedi.</p>}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={newClause}
              onChange={(e) => setNewClause(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addClause()}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Yeni madde yazın..." 
            />
            <Button onClick={addClause} variant="secondary">Ekle</Button>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section 3: Photos */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center text-blue-600">
                <Upload className="mr-2" size={20} />
                <h3 className="text-lg font-semibold">Fotoğraflar</h3>
             </div>
             <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
               {photos.length} / 15
             </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img src={photo} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removePhoto(index)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {photos.length < 15 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center aspect-square border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-400 hover:text-blue-500"
              >
                <Plus size={32} />
                <span className="text-xs mt-2 font-medium">Fotoğraf Ekle</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            className="hidden" 
            accept="image/*" 
            multiple 
          />
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <Button 
            onClick={handleGenerate} 
            size="lg" 
            className="w-full md:w-auto"
            isLoading={loading}
            disabled={!formData.companyName}
          >
            Dokümanı Hazırla
          </Button>
        </div>

      </div>
    </div>
  );
};