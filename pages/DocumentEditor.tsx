import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, CheckCircle, Mail, AlertTriangle, ZoomIn, ArrowLeft } from 'lucide-react';
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
    ...initialData?.data
  });

  const [photos, setPhotos] = useState<DocumentPhoto[]>(initialData?.photos || []);
  const [additionalNotes, setAdditionalNotes] = useState(initialData?.additionalNotes || '');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  const printContainerRef = useRef<HTMLDivElement>(null);

  const maxPhotos = template.photoCapacity || 15;

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

  const handleGenerateDocument = async () => {
    if (!printContainerRef.current) return;
    
    if (sendEmail) {
        if (!userEmail) {
             alert(t?.editor?.emailMissing || 'E-posta adresi bulunamadı. Lütfen profilinizi güncelleyin.');
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

      if (sendEmail && userEmail) {
        try {
          const response = await fetchApi('/api/send-document', {
            method: 'POST',
            body: JSON.stringify({
              email: userEmail,
              pdfBase64: pdfBase64,
              documentName: template.title
            })
          });
          
          const result = await response.json();
          if (!response.ok || !result.success) {
            console.error('Email sending failed', result);
            alert(`E-posta gönderilemedi: ${result.message || 'Sunucu hatası'}.`);
          } else {
             console.log('Email sent successfully');
          }
        } catch (error) {
          console.error('Email network error:', error);
          alert('E-posta sunucusuna erişilemedi. İnternet bağlantınızı kontrol edin.');
        }
      }

      pdf.save(fileName);
      
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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-110px)] overflow-hidden">
      
       {!isReadOnly && (
       <div className="lg:flex-[3] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col min-w-[320px] border border-slate-200 order-1 relative z-10">
        <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Editör</h2>
            <p className="text-slate-500 text-xs font-medium">Doküman detaylarını giriniz</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full transition duration-200" title="Kapat">
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
          
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-4">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Genel Bilgiler</label>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <span className="text-xs font-medium text-slate-500 mb-1 block">{t?.editor?.firmName || 'Firma Adı'} <span className="text-red-500">*</span></span>
                   <input disabled={isReadOnly} type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" placeholder="Firma..." />
                </div>
                <div>
                    <span className="text-xs font-medium text-slate-500 mb-1 block">{t?.editor?.preparedBy || 'Hazırlayan'} <span className="text-red-500">*</span></span>
                   <input disabled={isReadOnly} type="text" name="preparedBy" value={formData.preparedBy} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" placeholder="İsim Soyisim..." />
                </div>
                <div className="md:col-span-2">
                    <span className="text-xs font-medium text-slate-500 mb-1 block">{t?.editor?.date || 'Tarih'} <span className="text-red-500">*</span></span>
                   <input disabled={isReadOnly} type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
                </div>
             </div>
          </div>

          {template.fields.length > 0 && (
             <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  {t?.editor?.fields || 'Doküman Alanları'}
                </label>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
              {template.fields.map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 flex items-center">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1" title="Zorunlu">*</span>}
                    </span>
                    
                    {field.type === 'textarea' ? (
                      <textarea 
                        disabled={isReadOnly} 
                        name={field.key} 
                        value={formData[field.key] || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-24 resize-y text-sm transition-shadow shadow-sm" 
                        placeholder={field.placeholder || `${field.label} giriniz...`} 
                      />
                    ) : field.type === 'select' ? (
                      <div className="relative">
                        <select
                          disabled={isReadOnly}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData(prev => ({...prev, [field.key]: e.target.value}))} 
                          className="w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm appearance-none cursor-pointer shadow-sm font-medium"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    ) : field.type === 'checkbox' ? (
                       <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition bg-slate-50/50">
                         <input 
                            disabled={isReadOnly}
                            type="checkbox"
                            name={field.key}
                            checked={!!formData[field.key]}
                            onChange={(e) => setFormData(prev => ({...prev, [field.key]: e.target.checked}))}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                         />
                         <span className="text-sm font-medium text-slate-700">{field.placeholder || field.label}</span>
                       </label>
                    ) : (
                      <input 
                        disabled={isReadOnly} 
                        type={field.type} 
                        name={field.key} 
                        value={formData[field.key] || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-shadow shadow-sm font-medium placeholder:font-normal placeholder:text-slate-400" 
                        placeholder={field.placeholder || `${field.label} giriniz...`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="w-1 h-4 bg-yellow-500 rounded-full"></div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ek Notlar</label>
              </div>
              <textarea disabled={isReadOnly} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-24 resize-none text-sm font-medium" placeholder="Varsa eklemek istediğiniz notlar..." />
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Fotoğraf Ekle</label>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${photos.length >= maxPhotos ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {photos.length}/{maxPhotos}
                </span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                 {photos.map((photo) => (
                   <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                     <img src={photo.base64} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition" onClick={() => setPhotoPreview(photo.base64)} />
                     {!isReadOnly && (
                     <button onClick={() => handleRemovePhoto(photo.id)} className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition shadow-sm z-10" title="Sil">
                       <Trash2 size={12} />
                     </button>
                     )}
                   </div>
                 ))}
                 {!isReadOnly && photos.length < maxPhotos && (
                   <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg aspect-square cursor-pointer hover:bg-blue-50 transition group bg-slate-50">
                      <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform mb-1">
                          <Plus className="text-slate-400 group-hover:text-blue-500" size={20} />
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider">Seç</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                   </label>
                 )}
              </div>
          </div>
        
          <div className="h-10"></div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white shrink-0 z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="relative flex items-center">
                <input disabled={isReadOnly} type="checkbox" id="sendEmail" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="peer w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer border-slate-300" />
              </div>
              <label htmlFor="sendEmail" className="text-sm font-bold text-slate-700 cursor-pointer select-none flex-1 flex items-center gap-2">
                 <Mail size={16} className={sendEmail ? 'text-blue-600' : 'text-slate-400'} />
                 <span>PDF'i E-posta ile Gönder</span>
                 <span className="text-xs font-normal text-slate-400 hidden sm:inline">({userEmail || 'Email yok'})</span>
              </label>
              {sendEmail && !userEmail && <AlertTriangle size={16} className="text-orange-500 animate-pulse" title="Mail adresi eksik" />}
           </div>
           
           <button onClick={handleGenerateDocument} disabled={isGenerating || !formData.companyName} className={`w-full py-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : generationSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-200'}`}>
              {isGenerating ? <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Lütfen Bekleyin...</> : generationSuccess ? <><CheckCircle size={20} /> Başarıyla Oluşturuldu</> : <><Download size={20} /> Dokümanı Oluştur</>}
            </button>
        </div>
      </div>
      )}

      <div className={`bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col relative order-2 border border-slate-700 ${isReadOnly ? 'lg:flex-[10] w-full' : 'lg:flex-[2] hidden lg:flex'}`}>
          {isReadOnly && onClose && (
            <button onClick={onClose} className="fixed top-24 right-8 z-[50] bg-white text-slate-800 px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition hover:scale-105 active:scale-95">
              ✕ Önizlemeyi Kapat
            </button>
          )}

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/80 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-mono border border-white/10 shadow-xl flex gap-3 whitespace-nowrap">
             <span className="flex items-center gap-1">📄 {t?.editor?.previewMode || 'Canlı Önizleme'}</span>
             <span className="opacity-50">|</span>
             <span className="flex items-center gap-1">📸 {photos.length} Foto</span>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-900/50 p-4 md:p-8 flex justify-center items-start">
            <div className={`transition-all duration-300 origin-top ${isReadOnly ? 'scale-100' : 'scale-[0.45] md:scale-[0.5] lg:scale-[0.45] xl:scale-[0.55] 2xl:scale-[0.65]'}`}>
              <div ref={printContainerRef} className="flex flex-col gap-10 shadow-2xl">
            
            <div className="print-page bg-white shadow-2xl relative" style={{ width: '210mm', height: '297mm', padding: '15mm', boxSizing: 'border-box', color: '#1e293b', background: 'white' }}>
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

                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="bg-blue-50/50 p-4 border-l-4 border-blue-600 rounded-r-lg">
                      <span className="block text-[10px] text-blue-400 uppercase font-bold mb-1 tracking-wider">{t?.editor?.firmName}</span>
                      <p className="font-serif text-2xl font-bold text-slate-900 truncate">{formData.companyName || '_________________'}</p>
                   </div>
                   <div className="bg-indigo-50/50 p-4 border-l-4 border-indigo-600 rounded-r-lg">
                      <span className="block text-[10px] text-indigo-400 uppercase font-bold mb-1 tracking-wider">{t?.editor?.preparedBy}</span>
                      <p className="font-serif text-2xl font-bold text-slate-900 truncate">{formData.preparedBy || '_________________'}</p>
                   </div>
                </div>

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
                             <td className="py-3 pr-4 text-sm font-bold text-slate-700 align-top group-hover:bg-slate-50/50 transition-colors">{field.label}</td>
                             <td className="py-3 text-sm text-slate-600 font-medium whitespace-pre-wrap align-top group-hover:bg-slate-50/50 transition-colors">
                                {field.type === 'checkbox' 
                                    ? (formData[field.key] ? (t?.common?.yes || 'Evet') : (t?.common?.no || 'Hayır')) 
                                    : (formData[field.key] || '-')}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>

                {additionalNotes && (
                  <div className="mt-8 p-5 bg-yellow-50/60 border border-yellow-100 rounded-lg text-sm text-slate-700 relative">
                    <span className="absolute -top-3 left-4 bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded">{t?.editor?.notes || 'EK NOTLAR'}</span>
                    <p className="whitespace-pre-wrap leading-relaxed min-h-[60px]">{additionalNotes}</p>
                  </div>
                )}
                
                <div className="absolute bottom-10 left-10 right-10 pt-4 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-400 font-mono uppercase tracking-widest">
                   <div>
                      <p>© {new Date().getFullYear()} Kırbaş Doküman Platformu</p>
                      <p>Doğrulanmış Rapor</p>
                   </div>
                   <div className="text-right"><p>Page 1 / {1 + photoChunks.length}</p><p>{userId}</p></div>
                </div>
            </div>

            {photoChunks.map((chunk, pageIndex) => (
               <div key={`photo-page-${pageIndex}`} className="print-page bg-white shadow-2xl relative flex flex-col" style={{ width: '210mm', height: '297mm', padding: '15mm', boxSizing: 'border-box', background: 'white' }}>
                  <div className="border-b-2 border-slate-200 pb-2 mb-6 flex justify-between items-end">
                     <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{pageIndex + 2}</span>
                        <span>Fotoğraf Raporu</span>
                     </h3>
                     <span className="text-xs text-slate-400 font-mono">Bölüm {pageIndex + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-8 flex-1 content-start">
                     {chunk.map((photo, pIdx) => (
                       <div key={photo.id} className="flex flex-col gap-2">
                          <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shadow-sm relative group">
                             <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30" style={{ backgroundImage: `url(${photo.base64})` }}></div>
                             <img src={photo.base64} className="absolute inset-0 w-full h-full object-contain z-10" alt="Report visual" />
                          </div>
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IMG_REF_{photo.id.slice(-4)}</span>
                             <span className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{new Date(photo.uploadedAt).toLocaleTimeString()}</span>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="absolute bottom-10 left-10 right-10 pt-4 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-400 font-mono uppercase tracking-widest">
                   <div><p>{template.title} - Görsel Ekleri</p></div>
                   <div className="text-right"><p>Page {pageIndex + 2} / {1 + photoChunks.length}</p></div>
                </div>
              </div>
            ))}
            
              </div>
            </div>
          </div>
      </div>
      
       {photoPreview && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4 lg:p-12 cursor-zoom-out backdrop-blur-sm" onClick={() => setPhotoPreview(null)}>
             <img src={photoPreview} alt="Full Preview" className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10" />
             <div className="absolute top-6 right-6 text-white text-sm bg-white/10 px-3 py-1 rounded-full pointer-events-none">Kapatmak için tıklayın</div>
          </div>
        )}
    </div>
  );
};
