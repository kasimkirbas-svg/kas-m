import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, CheckCircle, Mail, AlertTriangle, ZoomIn, ArrowLeft, Edit2, FileText, Calendar, LucideIcon } from 'lucide-react';
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
    ...initialData?.data
  });

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
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // Mobile toggle
  
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
      // Use Backend Generation for Professional PDF
      const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth
          },
          body: JSON.stringify({
              templateId: template.id,
              title: template.title,
              data: { ...formData, date: formData.date }, // Flatten data for PDF
              email: sendEmail ? userEmail : undefined
          })
      });

      if (!response.ok) {
          throw new Error('Sunucu hatası: ' + response.statusText);
      }

      const result = await response.json();
      
      if (!result.success) {
          throw new Error(result.message || 'PDF oluşturulamadı');
      }

      // Download PDF
      const link = document.createElement('a');
      link.href = result.pdfBase64;
      link.download = `${template.title.replace(/\s+/g, '_')}-${formData.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (sendEmail) {
          alert("Doküman oluşturuldu ve e-posta adresinize gönderildi!");
      } else {
          alert("Doküman başarıyla oluşturuldu ve indirildi.");
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

  const photoChunks = [];
  for (let i = 0; i < photos.length; i += 6) {
    photoChunks.push(photos.slice(i, i + 6));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100dvh-6rem)] lg:h-[calc(100vh-2rem)] relative overflow-hidden">
      
       {/* Mobile Preview Toggle */}
       <div className="fixed lg:hidden bottom-24 right-6 z-50 safe-area-bottom">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-500/40 flex items-center justify-center transition-transform active:scale-95 hover:scale-105"
          >
             {previewMode ? <Edit2 size={24} /> : <FileText size={24} />}
          </button>
       </div>

       {/* Editor Panel */}
       {!isReadOnly && (
       <div className={`
         w-full lg:flex-[3] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl overflow-hidden flex flex-col border border-white/20 dark:border-slate-800 order-1 relative z-10 h-full
         ${previewMode ? 'hidden lg:flex' : 'flex'}
       `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 px-4 md:px-8 py-4 md:py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{_t('editor.title', 'Editör')}</h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium truncate">{template.title}</p>
          </div>
          <div className="flex gap-2 shrink-0">
             {onClose && (
                <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors active:scale-95">
                    <ArrowLeft className="text-slate-500 dark:text-slate-400" size={24} />
                </button>
             )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar scroll-smooth">
          
          {/* General Info Section */}
          <div className="space-y-4 md:space-y-6">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
                {_t('editor.generalInfo', 'Genel Bilgiler')}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div className="col-span-1">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{_t('common.date', 'Tarih')}</label>
                 <div className="relative group">
                   <Calendar className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                   <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none"
                  />
                 </div>
               </div>

               <div className="col-span-1">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{_t('editor.companyName', 'Firma Adı')}</label>
                 <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={_t('editor.companyNamePlaceholder', 'Örn: ABC İnşaat Ltd. Şti.')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none placeholder:text-slate-400"
                  />
               </div>

               <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{_t('editor.preparedBy', 'Hazırlayan')}</label>
                 <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleInputChange}
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none placeholder:text-slate-400"
                  />
               </div>
             </div>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Dynamic Fields Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                {_t('editor.details', 'Detaylar')}
             </div>

             <div className="grid gap-6">
                {template.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none resize-none"
                      />
                    ) : field.type === 'select' ? (
                       <div className="relative">
                           <select
                             name={field.key}
                             value={formData[field.key] || ''}
                             onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                             className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none appearance-none"
                           >
                             <option value="">Seçiniz</option>
                             {field.options?.map((opt, i) => (
                               <option key={i} value={opt}>{opt}</option>
                             ))}
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                       </div>
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none"
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{_t('editor.additionalNotes', 'Ek Notlar')}</label>
                   <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      placeholder={_t('editor.notesPlaceholder', 'Varsa eklemek istediğiniz notlar...')}
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium outline-none resize-none"
                    />
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Photos Section */}
          <div>
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    {_t('editor.photos', 'Fotoğraflar')}
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${photos.length >= maxPhotos ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                   {photos.length} / {maxPhotos}
                </span>
             </div>
             
             <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
               {photos.map((photo) => (
                 <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700">
                    <img src={photo.base64} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                       <button 
                         onClick={() => setPhotoPreview(photo.base64)} 
                         className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/40 transition-colors"
                       >
                         <ZoomIn size={18} />
                       </button>
                       <button 
                         onClick={() => handleRemovePhoto(photo.id)} 
                         className="p-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
               ))}
               
               {photos.length < maxPhotos && (
                 <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-sm">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Fotoğraf Ekle</span>
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
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center shrink-0 gap-4">
           
           <div className="w-full flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="sendEmailCheckbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="sendEmailCheckbox" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                     E-posta ile Paylaş
                  </label>
              </div>
              
              {sendEmail && (
                 <input 
                   type="email" 
                   placeholder="E-posta adresi..." 
                   value={formData.email || ''} 
                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                   className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none w-40 sm:w-56"
                 />
              )}
           </div>
           
           <button 
             onClick={handleGenerateDocument}
             disabled={isGenerating}
             className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
           >
             {isGenerating ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>{_t('editor.processing', 'İşleniyor...')}</span>
               </>
             ) : (
               <>
                 <Download size={20} />
                 <span>{_t('editor.createPDF', 'PDF İndir')}</span>
               </>
             )}
           </button>
        </div>
      </div>
      )}

      {/* Preview Section */}
      <div className={`lg:flex-[4] bg-slate-100 dark:bg-slate-900/50 rounded-3xl overflow-hidden flex-col order-2 relative border border-slate-200 dark:border-slate-800 ${isReadOnly ? 'w-full flex-1 flex' : ''} ${previewMode ? 'flex' : 'hidden lg:flex'}`}>
         {/* Preview Toolbar */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-xl z-20 flex items-center gap-4">
            <span className="font-bold text-sm tracking-wide">{_t('common.preview', 'ÖNİZLEME')}</span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="text-xs text-slate-300">{template.title}</span>
         </div>

         {isReadOnly && onClose && (
            <button onClick={onClose} className="absolute top-6 right-6 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all shadow-lg">
                <ArrowLeft size={24} />
            </button>
         )}

         <div className="flex-1 overflow-y-auto p-4 sm:p-10 flex items-start justify-center custom-scrollbar">
            {/* The Print Container */}
            <div ref={printContainerRef} className="print-container transform origin-top scale-[0.35] xs:scale-[0.45] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-100 transition-transform duration-300">
               {/* PAGE 1: Main Content */}
               <div className="print-page bg-white text-black shadow-2xl relative mx-auto overflow-hidden flex flex-col" style={{ width: '210mm', minHeight: '297mm', padding: template.backgroundImage ? '0' : '15mm' }}>
                  
                  {template.backgroundImage ? (
                        /* VISUAL TEMPLATE RENDERING (IMAGE BACKGROUND) */
                       <div className="relative w-full h-full">
                            <img 
                                src={template.backgroundImage} 
                                alt="Background" 
                                className="w-full h-full object-contain pointer-events-none block"
                            />
                            {template.fields.filter(f => f.position).map(field => {
                                // Calculate percentages for responsiveness within the A4 page container
                                const layoutW = template.layout?.width || 1;
                                const layoutH = template.layout?.height || 1;
                                
                                return (
                                    <div 
                                    key={field.key}
                                    style={{
                                        position: 'absolute',
                                        left: `${(field.position!.x / layoutW) * 100}%`,
                                        top: `${(field.position!.y / layoutH) * 100}%`,
                                        width: `${(field.position!.width / layoutW) * 100}%`,
                                        height: `${(field.position!.height / layoutH) * 100}%`,
                                        fontSize: '12px',
                                        // display: 'flex',
                                        // alignItems: 'center',
                                        whiteSpace: 'pre-wrap',
                                        overflow: 'hidden',
                                        lineHeight: '1.2',
                                        fontFamily: 'Arial, sans-serif' // Fallback font
                                    }}
                                    >
                                        {field.type === 'date' && formData[field.key] ? new Date(formData[field.key]).toLocaleDateString('tr-TR') : 
                                         formData[field.key]}
                                    </div>
                                );
                            })}
                        </div>
                  ) : template.content ? (
                      /* RICH HTML TEMPLATE RENDERING */
                      <div className="h-full flex flex-col justify-between">
                          <div 
                            className="rich-content-wrapper prose prose-sm max-w-none text-slate-900 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: (() => {
                                let content = template.content || '';
                                const safeData = {
                                    companyName: formData.companyName || '________________',
                                    preparedBy: formData.preparedBy || '________________',
                                    date: new Date(formData.date).toLocaleDateString('tr-TR'),
                                    email: formData.email || '',
                                    ...formData
                                };

                                // Standard Replacements
                                content = content.replace(/{{\s*companyName\s*}}/g, safeData.companyName);
                                content = content.replace(/{{\s*preparedBy\s*}}/g, safeData.preparedBy);
                                content = content.replace(/{{\s*date\s*}}/g, safeData.date);
                                content = content.replace(/{{\s*email\s*}}/g, safeData.email);

                                // Dynamic Field Replacements
                                template.fields.forEach(field => {
                                    const regex = new RegExp(`{{\\s*${field.key}\\s*}}`, 'g');
                                    // Handle line breaks for textareas
                                    let val = safeData[field.key] || `[${field.label}]`;
                                    if (field.type === 'textarea') {
                                        val = val.replace(/\n/g, '<br/>');
                                    }
                                    content = content.replace(regex, val);
                                });
                                return content;
                            })() }}
                          />
                          
                          {/* Optional: Append Additional Notes if not in HTML */}
                          {additionalNotes && (
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{_t('editor.additionalNotes', 'Ek Notlar')}</h4>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{additionalNotes}</p>
                            </div>
                          )}
                      </div>
                  ) : (
                    /* DEFAULT LEGACY GRID LAYOUT */
                    <>
                      {/* Header */}
                      <div className="flex border-b-2 border-slate-900 pb-5 mb-10 justify-between items-end">
                        <div className="flex-1">
                             <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-2">{template.title}</h1>
                             <div className="flex flex-col text-sm text-slate-600 font-medium">
                                <span>{formData.companyName || _t('editor.companyName', 'Firma Adı')}</span>
                                <span>{new Date(formData.date).toLocaleDateString("tr-TR")}</span>
                             </div>
                        </div>
                        {/* Dynamic Logo Placeholder if available */}
                         <div className="text-4xl font-black text-slate-100 tracking-tighter select-none">LOGO</div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
                         <div className="col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{_t('editor.preparedBy', 'Hazırlayan')}</span>
                            <span className="font-bold text-slate-900 text-xl">{formData.preparedBy || '-'}</span>
                         </div>
                         
                         {template.fields.map(field => (
                            <div key={field.key} className={`${field.type === 'textarea' ? 'col-span-2' : 'col-span-1'}`}>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">{field.label}</span>
                               <div className="text-sm font-medium text-slate-800 border-b border-slate-200 pb-2 min-h-[1.5rem] break-words whitespace-pre-wrap leading-relaxed">
                                  {formData[field.key]}
                               </div>
                            </div>
                         ))}
                      </div>
                      
                      {/* Additional Notes */}
                      {additionalNotes && (
                          <div className="mb-12 bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                              <h4 className="text-xs font-bold text-amber-800/70 uppercase tracking-widest mb-3">{_t('editor.additionalNotes', 'Ek Notlar')}</h4>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{additionalNotes}</p>
                          </div>
                      )}

                      {/* Footer */}
                      <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                          <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">{_t('editor.customerSign', 'Müşteri İmza')}</p>
                              <div className="w-40 border-b-2 border-slate-200"></div>
                          </div>
                          <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">{_t('editor.companySign', 'Firma Yetkilisi')}</p>
                              <div className="w-40 border-b-2 border-slate-200"></div>
                          </div>
                      </div>
                    </>
                  )}
               </div>

               {/* PAGE 2+: Photo Appendices */}
               {photoChunks.map((chunk, pageIndex) => (
                  <div key={pageIndex} className="print-page bg-white text-black shadow-2xl relative mx-auto mt-8 overflow-hidden" style={{ width: '210mm', height: '297mm', padding: '15mm' }}>
                      <div className="border-b-2 border-slate-100 pb-4 mb-8 flex justify-between items-end">
                         <div>
                            <h2 className="font-bold text-xl text-slate-800">{_t('editor.photoAppendix', 'Fotoğraf Eki')}</h2>
                            <p className="text-sm text-slate-400 font-medium mt-1">Sayfa {pageIndex + 1}</p>
                         </div>
                         <div className="text-right text-xs text-slate-400">
                            <p>{formData.companyName}</p>
                            <p>{new Date(formData.date).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                         {chunk.map((photo) => (
                            <div key={photo.id} className="aspect-[4/3] bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative shadow-sm">
                                <img src={photo.base64} className="w-full h-full object-contain" alt="Evidence" />
                                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-slate-600 text-[10px] px-2 py-1 rounded font-mono border border-slate-200 shadow-sm">
                                   {new Date(photo.uploadedAt).toLocaleTimeString()}
                                </div>
                            </div>
                         ))}
                      </div>

                      <div className="absolute bottom-8 left-0 right-0 text-center">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            {template.title} • {new Date().getFullYear()}
                          </span>
                      </div>
                  </div>
               ))}
               
            </div>
         </div>
      </div>

      {/* Photo Preview Modal */}
      {photoPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPhotoPreview(null)}>
           <img src={photoPreview} alt="Preview" className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-slate-800" />
           <button className="absolute top-6 right-6 text-white hover:text-slate-300 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
             <span className="sr-only">Kapat</span>
             <Trash2 className="rotate-45" size={24} />
           </button>
        </div>
      )}

    </div>
  );
};