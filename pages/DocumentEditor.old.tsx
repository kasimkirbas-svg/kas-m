import React, { useState, useRef } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, FileText, CheckCircle, Mail } from 'lucide-react';
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
  
  const documentRef = useRef<HTMLDivElement>(null);

  const maxPhotos = template.photoCapacity || 15;

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Photo upload handler
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

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Generate Real PDF
  const handleGenerateDocument = async () => {
    if (!documentRef.current) return;
    
    setIsGenerating(true);
    setGenerationSuccess(false);

    try {
      // 1. Generate Canvas from HTML
      const canvas = await html2canvas(documentRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // 2. Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page content
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBase64 = pdf.output('datauristring');
      const fileName = `${template.title.replace(/\s+/g, '_')}_${formData.date}.pdf`;

      // 3. Send Email if requested
      if (sendEmail && userEmail) {
        try {
          const response = await fetch('/api/send-document', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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

      // 4. Download PDF
      pdf.save(fileName);
      
      // 5. Save Record
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      
      {/* --- LEFT: FORM INPUTS --- */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
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
          
          {/* Section: Basic Info */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
               <FileText size={16} /> {t?.editor?.documentInfo || 'Belge Bilgileri'}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Section: Template Fields */}
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

          {/* Section: Notes */}
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

          {/* Section: Photos */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex justify-between items-center">
                <span className="flex items-center gap-2"><Upload size={16} /> {t?.editor?.uploadPhotos || 'Fotoğraflar'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${photos.length >= maxPhotos ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {photos.length}/{maxPhotos}
                </span>
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                  {t?.editor?.preparing || 'Oluşturuluyor...'}
                </>
              ) : generationSuccess ? (
                <>
                  <CheckCircle size={20} />
                  {t?.editor?.photoSuccess || 'Başarıyla Oluşturuldu'}
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

      {/* --- RIGHT: PREVIEW (Visual Feedback & Print Source) --- */}
      {/* Hidden usually on mobile, shown on desktop for feedback */}
      <div className="hidden lg:flex flex-col bg-slate-800/50 p-6 rounded-lg shadow-inner overflow-hidden flex-1 items-center justify-center relative">
          <div className="absolute top-4 left-6 text-white bg-black/50 px-3 py-1 rounded-full text-xs font-mono uppercase">
             Canlı Önizleme (A4)
          </div>

          <div className="overflow-y-auto max-h-full w-full flex justify-center custom-scrollbar">
             {/* The actual div to be screenshotted */}
             <div 
                ref={documentRef} 
                className="bg-white shadow-2xl origin-top transform scale-75 md:scale-90 xl:scale-100 transition-transform duration-300"
                style={{ 
                  width: '210mm', 
                  minHeight: '297mm', 
                  padding: '15mm',
                  boxSizing: 'border-box',
                  color: '#1e293b' // slate-800
                }}
             >
                {/* PDF Header */}
                <div className="border-b-4 border-slate-800 pb-6 mb-8 flex justify-between items-start">
                   <div className="max-w-[70%]">
                      <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900 leading-none mb-2">{template.title}</h1>
                      <p className="text-slate-500 text-sm leading-tight">{template.description}</p>
                   </div>
                   <div className="text-right">
                      <div className="bg-slate-100 px-3 py-2 rounded mb-2 inline-block">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold text-left">Tarih</span>
                        <span className="block font-mono font-bold text-slate-800">{new Date(formData.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                   </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                   <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">{t?.editor?.firmName || 'Firma Adı'}</span>
                      <p className="font-serif text-xl font-bold text-slate-900 border-b border-dotted border-slate-300 pb-1">
                        {formData.companyName || '_________________'}
                      </p>
                   </div>
                   <div className="border-l-4 border-indigo-500 pl-4 py-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">{t?.editor?.preparedBy || 'Hazırlayan'}</span>
                      <p className="font-serif text-xl font-bold text-slate-900 border-b border-dotted border-slate-300 pb-1">
                        {formData.preparedBy || '_________________'}
                      </p>
                   </div>
                </div>

                {/* Content Table Style for Fields */}
                <div className="mb-8">
                   <table className="w-full border-collapse">
                      <tbody>
                        {template.fields.map((field, idx) => (
                          <tr key={field.key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                             <td className="p-3 border-y border-slate-100 w-1/3 text-sm font-bold text-slate-600 align-top">
                               {field.label}
                             </td>
                             <td className="p-3 border-y border-slate-100 w-2/3 text-sm text-slate-800 whitespace-pre-wrap">
                               {formData[field.key] || '-'}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>

                {/* Notes */}
                {additionalNotes && (
                  <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded text-sm text-slate-800">
                    <span className="block text-[10px] text-yellow-600 uppercase font-bold mb-2">{t?.editor?.notes || 'NOTLAR'}</span>
                    <p className="whitespace-pre-wrap leading-relaxed">{additionalNotes}</p>
                  </div>
                )}

                {/* Photo Grid (2x2 or 3x3) */}
                {photos.length > 0 && (
                   <div className="mt-8 page-break-inside-avoid">
                      <h3 className="text-lg font-bold border-b-2 border-slate-200 pb-2 mb-4 text-slate-700 flex items-center gap-2">
                         <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">P</span> 
                         {t?.editor?.uploadPhotos || 'Fotoğraf Raporu'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                         {photos.map((photo, idx) => (
                            <div key={photo.id} className="border border-slate-200 p-2 rounded bg-white shadow-sm break-inside-avoid">
                               <div className="aspect-[4/3] bg-slate-100 mb-2 overflow-hidden rounded">
                                  <img src={photo.base64} className="w-full h-full object-contain" />
                               </div>
                               <p className="text-center text-[10px] text-slate-400 font-mono uppercase">Img #{idx + 1} - {new Date(photo.uploadedAt).toLocaleTimeString()}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
                
                {/* Footer */}
                <div className="mt-16 pt-6 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-400 font-mono">
                   <div>
                      <p>Kırbaş Doküman Platformu</p>
                      <p>{new Date().toLocaleString('tr-TR')}</p>
                   </div>
                   <div className="text-right">
                      <p>ID: {userId.slice(0,5).toUpperCase()}-{Date.now().toString(36).toUpperCase()}</p>
                      <p>Page 1/1</p>
                   </div>
                </div>

             </div>
          </div>
      </div>

       {/* Photo Preview Modal */}
       {photoPreview && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-8"
            onClick={() => setPhotoPreview(null)}
          >
             <img src={photoPreview} alt="Full Preview" className="max-w-full max-h-full rounded shadow-2xl" />
             <button className="absolute top-4 right-4 text-white hover:text-red-400">
               <Trash2 size={32} />
             </button>
          </div>
        )}

    </div>
  );
};
