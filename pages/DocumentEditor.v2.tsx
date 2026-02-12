import React, { useState, useRef } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, FileText, CheckCircle, Mail, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentEditorProps {
  template: DocumentTemplate;
  onClose?: () => void;
  onDocumentGenerated?: (document: GeneratedDocument) => void;
  userId?: string;
  userEmail?: string;
  companyName?: string;
  preparedBy?: string;
  t?: any;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  template,
  onClose,
  onDocumentGenerated,
  userId = '1',
  userEmail = '',
  companyName = '',
  preparedBy = '',
  t
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    companyName: companyName || '',
    preparedBy: preparedBy || '',
    date: new Date().toISOString().split('T')[0],
  });

  const [photos, setPhotos] = useState<DocumentPhoto[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  // Ref to the container holding all pages
  const printContainerRef = useRef<HTMLDivElement>(null);

  const maxPhotos = template.photoCapacity || 15;

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (photos.length >= maxPhotos) {
        alert(t?.editor?.maxPhotoError?.replace('{count}', maxPhotos) || `Maksimum ${maxPhotos} fotoğraf ekleyebilirsiniz!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random().toString(),
          base64,
          uploadedAt: new Date().toISOString()
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // --- Multi-Page PDF Generation Logic ---
  const handleGenerateDocument = async () => {
    if (!printContainerRef.current) return;
    
    setIsGenerating(true);
    setGenerationSuccess(false);

    try {
      // Find all page elements
      const pageElements = printContainerRef.current.querySelectorAll('.print-page');
      
      if (pageElements.length === 0) {
        throw new Error("No pages found to generate");
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page individually
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;
        
        // Capture the page with high quality
        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x scale for crisp text
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = 210; // A4 Width mm
        const imgHeight = 297; // A4 Height mm

        // Add page to PDF (skip first addPage call since PDF init creates one)
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }

      const pdfBase64 = pdf.output('datauristring');
      const fileName = `${template.title.replace(/\s+/g, '_')}-${formData.date}.pdf`;

      // Send Email
      if (sendEmail && userEmail) {
        try {
          const response = await fetch('/api/send-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              pdfBase64: pdfBase64,
              documentName: template.title
            })
          });
          
          if (!response.ok) {
            console.error('Email sending failed');
            alert('PDF oluşturuldu ancak e-posta gönderilemedi.');
          }
        } catch (error) {
          console.error('Email error:', error);
        }
      }

      // Download
      pdf.save(fileName);
      
      // Save Record
      const documentRecord: GeneratedDocument = {
        id: 'doc-' + Date.now(),
        userId,
        templateId: template.id,
        data: formData,
        photos: photos,
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        status: 'COMPLETED',
        companyName: formData.companyName,
        preparedBy: formData.preparedBy,
        additionalNotes
      };
      
      onDocumentGenerated?.(documentRecord);
      setGenerationSuccess(true);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- render helpers ---
  // Chunk photos into groups of 6 for separate A4 pages
  const photoChunks = [];
  for (let i = 0; i < photos.length; i += 6) {
    photoChunks.push(photos.slice(i, i + 6));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      
      {/* ---------------- LEFT: FORM INPUTS (Scrollable) ---------------- */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[350px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold">{template.title}</h2>
            <p className="text-blue-100 text-sm opacity-90">{template.description}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
              ✕
            </button>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Info */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
               <FileText size={16} /> {t?.editor?.documentInfo || 'Belge Bilgileri'}
             </h3>
             <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t?.editor?.firmName || 'Firma Adı'} *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Firma..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t?.editor?.preparedBy || 'Hazırlayan'} *</label>
                  <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="İsim Soyisim..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t?.editor?.date || 'Tarih'} *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
             </div>
          </div>

          {/* Fields */}
          {template.fields.length > 0 && (
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> {t?.editor?.templateFields || 'Şablon Alanları'}
              </h3>
              <div className="space-y-4">
                {template.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                <Plus size={16} /> {t?.editor?.notes || 'Ek Notlar'}
              </h3>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                placeholder={t?.editor?.addNotes || 'Varsa ek notlarınızı buraya girebilirsiniz...'}
              />
          </div>

          {/* Photo Management in Form */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex justify-between items-center">
                <span className="flex items-center gap-2"><Upload size={16} /> {t?.editor?.uploadPhotos || 'Fotoğraflar'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${photos.length >= maxPhotos ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {photos.length}/{maxPhotos}
                </span>
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                 {photos.map((photo) => (
                   <div key={photo.id} className="relative aspect-square rounded overflow-hidden group bg-white border border-slate-200 shadow-sm">
                     <img 
                      src={photo.base64} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPhotoPreview(photo.base64)}
                     />
                     <button 
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                      title="Sil"
                     >
                       <Trash2 size={12} />
                     </button>
                   </div>
                 ))}
                 
                 {photos.length < maxPhotos && (
                   <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded aspect-square cursor-pointer hover:bg-white hover:border-blue-400 transition group">
                      <Upload className="text-slate-400 group-hover:text-blue-500 mb-1" size={20} />
                      <span className="text-[10px] text-slate-500 group-hover:text-blue-600 text-center leading-tight">Fotoğraf<br/>Seç</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                   </label>
                 )}
              </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 shrink-0">
           <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="sendEmail" className="text-sm text-slate-700 cursor-pointer select-none flex items-center gap-2">
                 {t?.common?.emailMe || 'PDF dosyasını e-postama da gönder'} 
                 <span className="text-xs text-slate-400">({userEmail})</span>
              </label>
           </div>
           
           <button
              onClick={handleGenerateDocument}
              disabled={isGenerating || !formData.companyName}
              className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition shadow-md ${
                isGenerating 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : generationSuccess 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t?.editor?.preparing || 'Hazırlanıyor...'}
                </>
              ) : generationSuccess ? (
                <>
                  <CheckCircle size={20} />
                  {t?.editor?.photoSuccess || 'Oluşturuldu & İndirildi'}
                </>
              ) : (
                <>
                  <Download size={20} />
                  {t?.editor?.prepareDownload || 'Dokümanı Oluştur ve İndir'}
                </>
              )}
            </button>
        </div>
      </div>

      {/* ---------------- RIGHT: LIVE A4 PREVIEW ---------------- */}
      <div className="flex-2 bg-slate-800/80 p-6 rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-start relative w-full lg:w-auto overflow-y-auto">
          {/* Legend/Info Badge */}
          <div className="sticky top-0 z-10 mb-6 bg-black/70 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono border border-white/10 shadow-xl flex gap-3">
             <span className="flex items-center gap-1">📄 {t?.editor?.previewMode || 'A4 Önizleme Modu'}</span>
             <span className="opacity-50">|</span>
             <span className="flex items-center gap-1">📸 {photos.length} Fotoğraf</span>
             {photoChunks.length > 0 && <span className="text-yellow-400">({photoChunks.length} Ek Sayfa)</span>}
          </div>

          {/* The Wrapper for all Pages - used by function to grab contexts */}
          <div ref={printContainerRef} className="flex flex-col gap-8 pb-10 origin-top transform sm:scale-75 md:scale-90 xl:scale-100 transition-transform">
            
            {/* --- PAGE 1: TEXT CONTENT --- */}
            <div 
              className="print-page bg-white shadow-2xl relative"
              style={{ 
                width: '210mm', 
                height: '297mm', 
                padding: '15mm',
                boxSizing: 'border-box',
                color: '#1e293b',
                background: 'white' // Ensure white bg for PDF
              }}
            >
                {/* Header */}
                <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                   <div className="max-w-[70%]">
                      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-none mb-3">{template.title}</h1>
                      <p className="text-slate-500 text-sm font-medium leading-tight">{template.description}</p>
                   </div>
                   <div className="text-right">
                      <div className="bg-slate-100 px-4 py-3 rounded border border-slate-200 text-center min-w-[120px]">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Tarih</span>
                        <span className="block font-mono text-lg font-bold text-slate-900">{new Date(formData.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                   </div>
                </div>

                {/* Sub-Header Grid */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="bg-blue-50/50 p-4 border-l-4 border-blue-600 rounded-r-lg">
                      <span className="block text-[10px] text-blue-400 uppercase font-bold mb-1 tracking-wider">{t?.editor?.firmName}</span>
                      <p className="font-serif text-2xl font-bold text-slate-900 truncate">
                        {formData.companyName || '_________________'}
                      </p>
                   </div>
                   <div className="bg-indigo-50/50 p-4 border-l-4 border-indigo-600 rounded-r-lg">
                      <span className="block text-[10px] text-indigo-400 uppercase font-bold mb-1 tracking-wider">{t?.editor?.preparedBy}</span>
                      <p className="font-serif text-2xl font-bold text-slate-900 truncate">
                        {formData.preparedBy || '_________________'}
                      </p>
                   </div>
                </div>

                {/* Main Content Table - Fixed Layout for A4 Stability */}
                <div className="mb-8">
                   <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b-2 border-slate-800">
                          <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Alan</th>
                          <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Değer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {template.fields.map((field) => (
                          <tr key={field.key} className="group">
                             <td className="py-3 pr-4 text-sm font-bold text-slate-700 align-top group-hover:bg-slate-50/50 transition-colors">
                               {field.label}
                             </td>
                             <td className="py-3 text-sm text-slate-600 font-medium whitespace-pre-wrap align-top group-hover:bg-slate-50/50 transition-colors">
                               {formData[field.key] || '-'}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>

                {/* Notes Section - Grows until bottom of page */}
                {additionalNotes && (
                  <div className="mt-8 p-5 bg-yellow-50/60 border border-yellow-100 rounded-lg text-sm text-slate-700 relative">
                    <span className="absolute -top-3 left-4 bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded">
                      {t?.editor?.notes || 'EK NOTLAR'}
                    </span>
                    <p className="whitespace-pre-wrap leading-relaxed min-h-[60px]">{additionalNotes}</p>
                  </div>
                )}
                
                {/* Page 1 Footer */}
                <div className="absolute bottom-10 left-10 right-10 pt-4 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-400 font-mono uppercase tracking-widest">
                   <div>
                      <p>© {new Date().getFullYear()} Kırbaş Doküman Platformu</p>
                      <p>Doğrulanmış Rapor</p>
                   </div>
                   <div className="text-right">
                      <p>Page 1 / {1 + photoChunks.length}</p>
                      <p>{userId}</p>
                   </div>
                </div>
            </div>

            {/* --- EXTRA PAGES: PHOTOS (Dynamically Created) --- */}
            {photoChunks.map((chunk, pageIndex) => (
               <div 
                key={`photo-page-${pageIndex}`}
                className="print-page bg-white shadow-2xl relative flex flex-col"
                style={{ 
                  width: '210mm', 
                  height: '297mm', 
                  padding: '15mm',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                  {/* Photo Page Header */}
                  <div className="border-b-2 border-slate-200 pb-2 mb-6 flex justify-between items-end">
                     <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{pageIndex + 2}</span>
                        <span>Fotoğraf Raporu</span>
                     </h3>
                     <span className="text-xs text-slate-400 font-mono">Bölüm {pageIndex + 1}</span>
                  </div>

                  {/* 2x3 Grid for Photos (Max 6 per page) */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-8 flex-1 content-start">
                     {chunk.map((photo, pIdx) => (
                       <div key={photo.id} className="flex flex-col gap-2">
                          <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shadow-sm relative">
                             <img src={photo.base64} className="w-full h-full object-contain" alt="Report visual" />
                          </div>
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IMG_REF_{photo.id.slice(-4)}</span>
                             <span className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                {new Date(photo.uploadedAt).toLocaleTimeString()}
                             </span>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Photo Page Footer */}
                  <div className="absolute bottom-10 left-10 right-10 pt-4 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-400 font-mono uppercase tracking-widest">
                   <div>
                      <p>{template.title} - Görsel Ekleri</p>
                   </div>
                   <div className="text-right">
                      <p>Page {pageIndex + 2} / {1 + photoChunks.length}</p>
                   </div>
                </div>
              </div>
            ))}

          </div>
      </div>

       {/* Full Screen Photo Preview Modal */}
       {photoPreview && (
          <div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4 lg:p-12 cursor-zoom-out backdrop-blur-sm"
            onClick={() => setPhotoPreview(null)}
          >
             <img src={photoPreview} alt="Full Preview" className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10" />
             <div className="absolute top-6 right-6 text-white text-sm bg-white/10 px-3 py-1 rounded-full pointer-events-none">
                Kapatmak için tıklayın
             </div>
          </div>
        )}

    </div>
  );
};
