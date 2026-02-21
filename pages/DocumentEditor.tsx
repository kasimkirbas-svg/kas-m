import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, CheckCircle, Mail, AlertTriangle, ZoomIn, ArrowLeft, Edit2, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchApi } from '../src/utils/api'; 

interface DocumentEditorProps {
  template: DocumentTemplate;
  onClose?: () => void;
  onDocumentGenerated?: (document: GeneratedDocument) => void;
  userId?: string;
  userEmail?: string;
  companyName?: string;
  preparedBy?: string;
  initialData?: GeneratedDocument; 
  isReadOnly?: boolean; 
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
  initialData,
  isReadOnly = false, 
  t
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    companyName: initialData?.companyName || companyName || '',
    preparedBy: initialData?.preparedBy || preparedBy || '',
    date: initialData?.data?.date || new Date().toISOString().split('T')[0],
    // Spread initialData first so we don't lose anything
    ...initialData?.data
  });

  // Re-initialize if initialData changes (e.g. when opening "Edit")
  useEffect(() => {
    if (initialData) {
        setFormData(prev => ({
            ...prev,
            ...initialData.data,
            companyName: initialData.companyName || prev.companyName,
            preparedBy: initialData.preparedBy || prev.preparedBy,
            date: initialData.data?.date || prev.date
        }));
        setPhotos(initialData.photos || []);
        setAdditionalNotes(initialData.additionalNotes || '');
    }
  }, [initialData]);

  const [photos, setPhotos] = useState<DocumentPhoto[]>(initialData?.photos || []);
  const [additionalNotes, setAdditionalNotes] = useState(initialData?.additionalNotes || '');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false); // Can be used for UI feedback
  
  const printContainerRef = useRef<HTMLDivElement>(null);

  const maxPhotos = template.photoCapacity || 15;

  const _t = (key: string, fallback: string) => {
    if (!t) return fallback;
    const parts = key.split('.');
    let val = t;
    for (const part of parts) {
      if (val === undefined || val === null) break;
      val = val[part];
    }
    return val || fallback;
  };

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

    Array.from(files).forEach((file: File) => {
      if (photos.length >= maxPhotos) {
        alert(_t('editor.maxPhotoError', 'Maksimum {count} fotoğraf ekleyebilirsiniz!').replace('{count}', maxPhotos));
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

  const handleGenerateDocument = async () => {
    if (!printContainerRef.current) return;
    
    if (sendEmail) {
        if (!userEmail) {
             alert(_t('editor.emailMissing', 'E-posta adresi bulunamadı. Lütfen profilinizi güncelleyin.'));
             setSendEmail(false);
             return; 
        }
    }

    setIsGenerating(true);
    setGenerationSuccess(false);

    try {
      const pageElements = printContainerRef.current.querySelectorAll('.print-page');
      
      if (pageElements.length === 0) {
        throw new Error("No pages found to generate");
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;
        
        // Use html2canvas
        // Ensure background is WHITE to avoid transparency issues in PDF
        const canvas = await html2canvas(pageEl, {
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.90);
        const imgWidth = 210; 
        const imgHeight = 297; 

        if (i > 0) pdf.addPage();
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }

      const pdfBase64 = pdf.output('datauristring');
      const fileName = `${template.title.replace(/\s+/g, '_')}-${formData.date}.pdf`;

      pdf.save(fileName);
      
      // Client-side "Send Email" Logic
      if (sendEmail) {
          const recipient = formData.email || userEmail || '';
          const subject = encodeURIComponent(`${template.title} - ${formData.companyName}`);
          const body = encodeURIComponent(`Merhaba,\n\n${template.title} dokümanı ektedir.\n\nFirma: ${formData.companyName}\nHazırlayan: ${formData.preparedBy}\n\n(Not: İndirilen PDF dosyasını lütfen bu maile ekleyiniz.)\n\nİyi çalışmalar.`);
          
          // Open default mail client
          window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
          
          // Inform user
          alert("Doküman indirildi.\n\nE-posta uygulamanız açıldı. Lütfen indirilen dosyayı maile EKLEYEREK gönderiniz.");
      }
      
      const documentRecord: GeneratedDocument = {
        id: initialData?.id || 'doc-' + Date.now(),
        userId,
        templateId: template.id,
        data: formData,
        photos: photos,
        createdAt: initialData?.createdAt || new Date().toISOString(),
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
      alert('PDF oluşturulurken bir hata oluştu: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Group photos into chunks of 6 for the print view
  const photoChunks = [];
  for (let i = 0; i < photos.length; i += 6) {
    photoChunks.push(photos.slice(i, i + 6));
  }

  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 h-[calc(100dvh-80px)] lg:h-[calc(100vh-110px)] overflow-hidden relative -mx-4 sm:mx-0 -mb-4 sm:mb-0">
      
       {/* Mobile Preview Toggle */}
       <div className="lg:hidden absolute bottom-20 right-4 z-50">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
          >
             {previewMode ? <Edit2 size={20} /> : <FileText size={20} />}
             <span className="text-sm font-bold">{previewMode ? 'Düzenle' : 'Önizle'}</span>
          </button>
       </div>

       {!isReadOnly && (
       <div className={`lg:flex-[3] bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden flex flex-col min-w-[320px] border border-slate-200 dark:border-slate-800 order-1 relative z-10 w-full lg:w-auto h-full ${previewMode ? 'hidden lg:flex' : 'flex'}`}>
        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{_t('editor.title', 'Editör')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{_t('editor.subtitle', 'Doküman detaylarını giriniz')}</p>
          </div>
          <div className="flex gap-2">
            {/* E-posta alanı */}
            <input 
              type="text" 
              placeholder="Alıcı E-posta (Opsiyonel)" 
              value={formData.email || ''} 
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none hidden sm:block w-48"
            />
            {onClose && (
            <button onClick={onClose} className="hover:bg-red-50 text-slate-400 hover:text-red-500 dark:hover:bg-red-900/20 p-2 rounded-full transition duration-200">
              <span className="sr-only">Kapat</span>
              ✕
            </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30">
          
          {/* General Info Section */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">{_t('editor.generalInfo', 'Genel Bilgiler')}</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{_t('common.date', 'Tarih')}</label>
                 <div className="relative">
                   <CalendarIcon className="absolute left-3 top-2.5 text-slate-400" size={16} />
                   <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 h-10 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-base sm:text-sm"
                  />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{_t('editor.companyName', 'Firma Adı')}</label>
                 <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={_t('editor.companyNamePlaceholder', 'Örn: ABC İnşaat Ltd. Şti.')}
                    className="w-full h-10 px-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm placeholder:text-slate-400"
                  />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{_t('editor.preparedBy', 'Hazırlayan')}</label>
                 <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleInputChange}
                    placeholder="Adınız Soyadınız"
                    className="w-full h-10 px-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm placeholder:text-slate-400"
                  />
               </div>
             </div>
          </div>

          {/* Dynamic Fields Section */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">{_t('editor.details', 'Detaylar')}</h3>
             <div className="grid gap-4">
                {template.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm"
                      />
                    ) : field.type === 'select' ? (
                       <select
                         name={field.key}
                         value={formData[field.key] || ''}
                         onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                         className="w-full h-10 px-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm"
                       >
                         <option value="">Seçiniz</option>
                         {field.options?.map((opt, i) => (
                           <option key={i} value={opt}>{opt}</option>
                         ))}
                       </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full h-10 px-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm"
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-1.5 mt-2">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{_t('editor.additionalNotes', 'Ek Notlar')}</label>
                   <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      placeholder={_t('editor.notesPlaceholder', 'Varsa eklemek istediğiniz notlar...')}
                      className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all text-base sm:text-sm"
                    />
                </div>
             </div>
          </div>

          {/* Photos Section */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">{_t('editor.photos', 'Fotoğraflar')}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${photos.length >= maxPhotos ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                   {photos.length} / {maxPhotos}
                </span>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
               {photos.map((photo) => (
                 <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900">
                    <img src={photo.base64} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                       <button 
                         onClick={() => setPhotoPreview(photo.base64)} 
                         className="p-1.5 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-md"
                       >
                         <ZoomIn size={16} />
                       </button>
                       <button 
                         onClick={() => handleRemovePhoto(photo.id)} 
                         className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 backdrop-blur-md"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
               ))}
               
               {photos.length < maxPhotos && (
                 <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Ekle</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                 </label>
               )}
             </div>
             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
               <AlertTriangle size={12} />
               {_t('editor.photoWarning', 'Maksimum {count} fotoğraf yüklenebilir.').replace('{count}', maxPhotos)}
             </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 shrink-0">
           
           <div className="flex items-center gap-2 sm:mr-auto">
              <input 
                type="checkbox" 
                id="sendEmailCheckbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="sendEmailCheckbox" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                 E-posta ile Gönder
              </label>
           </div>
           
           <button 
             onClick={handleGenerateDocument}
             disabled={isGenerating}
             className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
           >
             {isGenerating ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 {_t('editor.processing', 'İşleniyor...')}
               </>
             ) : (
               <>
                 <Download size={18} />
                 {_t('editor.createPDF', 'İndir & Paylaş')}
               </>
             )}
           </button>
        </div>
      </div>
      )}

      {/* Preview Section */}
      <div className={`lg:flex-[4] bg-slate-200 dark:bg-slate-900/50 rounded-xl overflow-hidden flex-col order-2 relative ${isReadOnly ? 'w-full flex-1 flex' : ''} ${previewMode ? 'flex' : 'hidden lg:flex'}`}>
         <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center shadow-md z-20 shrink-0">
            <div className="flex items-center gap-2">
               <span className="font-medium text-sm">{template.title} - {_t('common.preview', 'Önizleme')}</span>
            </div>
            {isReadOnly && onClose && (
               <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </button>
            )}
         </div>

         <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center custom-scrollbar bg-slate-500/10">
            {/* The A4 Container */}
            <div ref={printContainerRef} className="print-container bg-transparent transform origin-top scale-[0.35] xs:scale-[0.45] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-100 transition-transform duration-300">
               {/* PAGE 1: Main Content */}
               <div className="print-page bg-white text-black shadow-2xl relative mx-auto overflow-hidden" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>
                  
                  {/* Header */}
                  <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                    <div>
                         <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-800">{template.title}</h1>
                         <p className="text-sm text-slate-500 mt-1">{formData.companyName || _t('editor.companyName', 'Firma Adı')}</p>
                    </div>
                    <div className="text-right">
                         <div className="text-3xl font-bold text-indigo-600 opacity-20">LOGO</div>
                         <p className="text-xs text-slate-400 mt-1">{new Date(formData.date).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                     <div className="col-span-2 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{_t('editor.preparedBy', 'Hazırlayan')}</span>
                        <span className="font-semibold text-slate-800 text-lg">{formData.preparedBy || '-'}</span>
                     </div>
                     
                     {template.fields.map(field => (
                        <div key={field.key} className={`${field.type === 'textarea' ? 'col-span-2' : 'col-span-1'}`}>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{field.label}</span>
                           <div className="text-sm text-slate-800 border-b border-slate-200 pb-1 min-h-[1.5rem] break-words whitespace-pre-wrap">
                              {formData[field.key]}
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  {/* Additional Notes */}
                  {additionalNotes && (
                      <div className="mb-8">
                          <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase">{_t('editor.additionalNotes', 'Ek Notlar')}</h4>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{additionalNotes}</p>
                      </div>
                  )}

                  {/* Footer */}
                  <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pt-4 border-t border-slate-200">
                      <div className="text-center">
                          <p className="text-xs font-bold text-slate-400 mb-8">{_t('editor.customerSign', 'Müşteri İmza')}</p>
                          <div className="w-32 border-b border-slate-300"></div>
                      </div>
                      <div className="text-center">
                          <p className="text-xs font-bold text-slate-400 mb-8">{_t('editor.companySign', 'Firma Yetkilisi')}</p>
                          <div className="w-32 border-b border-slate-300"></div>
                      </div>
                  </div>
               </div>

               {/* PAGE 2+: Photo Appendices */}
               {photoChunks.map((chunk, pageIndex) => (
                  <div key={pageIndex} className="print-page bg-white text-black shadow-2xl relative mx-auto mt-8 overflow-hidden" style={{ width: '210mm', height: '297mm', padding: '15mm' }}>
                      <div className="border-b border-slate-200 pb-2 mb-6 flex justify-between items-center">
                         <h2 className="font-bold text-slate-700">{_t('editor.photoAppendix', 'Fotoğraf Eki')} - {pageIndex + 1}</h2>
                         <span className="text-xs text-slate-400">{formData.companyName} / {new Date(formData.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         {chunk.map((photo) => (
                            <div key={photo.id} className="aspect-[4/3] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-md relative">
                                <img src={photo.base64} className="w-full h-full object-contain" alt="Evidence" />
                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
                                   {new Date(photo.uploadedAt).toLocaleTimeString()}
                                </div>
                            </div>
                         ))}
                      </div>

                      <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="text-xs text-slate-300">Sayfa {pageIndex + 2}</span>
                      </div>
                  </div>
               ))}
               
            </div>
         </div>
      </div>

      {/* Photo Preview Modal */}
      {photoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in zoom-in duration-200" onClick={() => setPhotoPreview(null)}>
           <img src={photoPreview} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-2xl" />
           <button className="absolute top-4 right-4 text-white hover:text-slate-300 p-2">
             <span className="sr-only">Kapat</span>
             ✕
           </button>
        </div>
      )}

    </div>
  );
};

// Helper Icon for date input
const CalendarIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
