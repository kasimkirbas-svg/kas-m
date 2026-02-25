import React, { useState } from 'react';
import { GeneratedDocument, DocumentTemplate } from '../types';
import { FileText, Calendar, Trash2, Search, Eye, Edit, MoreVertical, Building2, Clock } from 'lucide-react';

interface MyDocumentsProps {
  documents: GeneratedDocument[];
  templates?: DocumentTemplate[]; // Optional to avoid breaking tests if any
  onEditDocument?: (doc: GeneratedDocument) => void;
  onPreviewDocument?: (doc: GeneratedDocument) => void;
  onDeleteDocument: (id: string) => void;
  t?: any;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({ 
  documents, 
  templates = [],
  onEditDocument,
  onPreviewDocument,
  onDeleteDocument,
  t 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredDocuments = documents.filter(doc => {
      const q = searchQuery.toLowerCase();
      // Safely handle missing templates or titles
      const template = templates.find(t => t.id === doc.templateId);
      const templateName = template?.title || String(doc.templateId || 'Bilinmiyor');
      
      const company = doc.companyName || '';
      const notes = doc.additionalNotes || '';

      return (
        company.toLowerCase().includes(q) ||
        templateName.toLowerCase().includes(q) ||
        notes.toLowerCase().includes(q)
      );
  });

  // Helper for consistent colors based on string
  const getColorForString = (str: string) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 
      'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in p-2">
       {/* Header Section */}
       <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{_t('myDocuments.title', 'Belgelerim')}</h1>
          <p className="text-slate-400 font-medium max-w-md">
            {_t('myDocuments.subtitle', 'Oluşturduğunuz tüm belgeleri buradan yönetebilir, düzenleyebilir veya silebilirsiniz.')}
          </p>
        </div>

        <div className="relative z-10 w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={_t('common.search', 'Belge ara...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-lg backdrop-blur-sm"
          />
        </div>
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl -ml-8 -mb-8 pointer-events-none"></div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredDocuments.map((doc) => {
              const template = templates.find(t => t.id === doc.templateId);
              const templateTitle = template?.title || doc.templateId;
              const colorClass = getColorForString(templateTitle);
              const date = new Date(doc.createdAt);

              return (
              <div key={doc.id} className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
                {/* Card Top / Color Strip */}
                <div className={`h-2 w-full ${colorClass}`}></div>

                <div className="p-6 flex flex-col h-full relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-white shadow-sm`}>
                         <FileText size={24} className="text-white drop-shadow-md" />
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 text-xs font-mono text-slate-400 dark:text-slate-500">
                        #{doc.id.slice(-4).toUpperCase()}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2" title={templateTitle}>
                    {templateTitle}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-4">
                     <Building2 size={14} />
                     <span className="truncate max-w-[150px]">{doc.companyName || 'İsimsiz Firma'}</span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-700/30 px-2.5 py-1.5 rounded-lg w-full">
                       <Clock size={14} />
                       <span>{date.toLocaleDateString('tr-TR')} • {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>

                  {/* Actions Overlay (Visible on Hover/Focus) */}
                  <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                     <button
                        onClick={() => onPreviewDocument?.(doc)}
                        className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-lg dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
                        title={_t('common.preview', 'Önizle')}
                     >
                        <Eye size={22} />
                     </button>
                     <button
                        onClick={() => onEditDocument?.(doc)}
                        className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-lg dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-600 dark:hover:text-white"
                        title={_t('common.edit', 'Düzenle')}
                     >
                        <Edit size={22} />
                     </button>
                     <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-lg dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                        title={_t('common.delete', 'Sil')}
                     >
                        <Trash2 size={22} />
                     </button>
                  </div>
                </div>
              </div>
            )})}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-full mb-4">
             <FileText className="text-slate-400 dark:text-slate-500" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{_t('myDocuments.noDocs', 'Henüz belge yok')}</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center mb-6">{_t('myDocuments.createFirst', 'Yeni bir belge oluşturmak için Şablonlar sayfasına gidin.')}</p>
        </div>
      )}
    </div>
  );
};
