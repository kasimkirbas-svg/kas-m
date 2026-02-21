import React, { useState } from 'react';
import { GeneratedDocument, DocumentTemplate } from '../types';
import { FileText, Calendar, Download, Trash2, Search, Eye, Edit } from 'lucide-react';

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
      const templateName = templates.find(t => t.id === doc.templateId)?.title || doc.templateId;
      return (
        doc.companyName?.toLowerCase().includes(q) ||
        templateName.toLowerCase().includes(q) ||
        (doc.additionalNotes && doc.additionalNotes.toLowerCase().includes(q))
      );
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{_t('myDocuments.title', 'Belgelerim')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{_t('myDocuments.subtitle', 'Oluşturduğunuz tüm belgeleri buradan yönetebilirsiniz.')}</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={_t('common.search', 'Ara...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">{_t('myDocuments.documentName', 'Belge Adı')}</th>
                  <th className="px-6 py-4">{_t('myDocuments.createdDate', 'Tarih')}</th>
                  <th className="px-6 py-4">{_t('myDocuments.company', 'Kişi/Firma')}</th>
                  <th className="px-6 py-4 text-right">{_t('common.actions', 'İşlemler')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredDocuments.map((doc) => {
                  const templateTitle = templates.find(t => t.id === doc.templateId)?.title || doc.templateId;
                  return (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[200px]" title={templateTitle}>
                             {templateTitle}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">#{doc.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                        <div className="flex flex-col">
                            <span>{new Date(doc.createdAt).toLocaleDateString("tr-TR")}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">
                      {doc.companyName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onPreviewDocument?.(doc)}
                          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title={_t('common.preview', 'Önizle')}
                        >
                          <Eye size={18} />
                        </button>
                        
                        <button 
                          onClick={() => onEditDocument?.(doc)}
                          className="p-2 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title={_t('common.edit', 'Düzenle')}
                        >
                          <Edit size={18} />
                        </button>

                        <button 
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={_t('common.delete', 'Sil')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
               <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">{_t('myDocuments.noDocs', 'Henüz belge oluşturmadınız')}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{_t('myDocuments.createFirst', 'Şablonlar sayfasından yeni bir belge oluşturarak başlayın.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
