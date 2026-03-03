import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Calendar, Trash2, Search, Eye, Edit, MoreVertical, 
  Building2, Clock, Filter, ChevronDown, CheckCircle2, 
  AlertCircle, Download, FileCheck, FileClock, Printer, Share2,
  MoreHorizontal, ArrowUpRight, Plus
} from 'lucide-react';
import { GeneratedDocument, DocumentTemplate } from '../types';

interface MyDocumentsProps {
  documents: GeneratedDocument[];
  templates?: DocumentTemplate[];
  onEditDocument: (doc: GeneratedDocument) => void;
  onPreviewDocument: (doc: GeneratedDocument) => void;
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
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'COMPLETED' | 'DOWNLOADED'>('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- Helpers ---
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

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'COMPLETED': return { label: 'Tamamlandı', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
      case 'DOWNLOADED': return { label: 'İndirildi', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Download };
      case 'DRAFT': return { label: 'Taslak', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: FileClock };
      default: return { label: 'Bilinmiyor', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: AlertCircle };
    }
  };

  const getTemplateInfo = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return {
      title: template?.title || 'Bilinmeyen Şablon',
      category: template?.category || 'Genel',
      isPremium: template?.isPremium || false
    };
  };

  // --- Filtering & Sorting ---
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      // 1. Text Search
      const searchLower = searchQuery.toLowerCase();
      const template = templates.find(t => t.id === doc.templateId);
      const matchesSearch = 
        (doc.companyName || '').toLowerCase().includes(searchLower) ||
        (template?.title || '').toLowerCase().includes(searchLower) ||
        (doc.id || '').toLowerCase().includes(searchLower);

      // 2. Status Filter
      const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [documents, searchQuery, filterStatus, templates]);

  // --- Stats ---
  const stats = useMemo(() => {
    return {
      total: documents.length,
      completed: documents.filter(d => d.status === 'COMPLETED' || d.status === 'DOWNLOADED').length,
      drafts: documents.filter(d => d.status === 'DRAFT').length
    };
  }, [documents]);

  return (
    <div 
      className="min-h-screen pb-20 p-4 md:p-8 space-y-8 animate-fade-in" 
      onClick={() => setActiveMenuId(null)}
    >
      
      {/* 1. Header & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Title Card */}
        <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
           {/* Dynamic Background */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-1000" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

           <div className="relative z-10 space-y-4 text-center md:text-left w-full md:w-auto">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {_t('myDocuments.title', 'Belgelerim')}
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                {_t('myDocuments.subtitle', 'Tüm belgelerinizi tek bir yerden yönetin, düzenleyin ve paylaşın.')}
              </p>
              
              {/* Quick Stats Row */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                 <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                       <FileText size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Toplam</div>
                       <div className="text-2xl font-black text-white leading-none mt-1">{stats.total}</div>
                    </div>
                 </div>
                 <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                       <FileCheck size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Biten</div>
                       <div className="text-2xl font-black text-white leading-none mt-1">{stats.completed}</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Illustration / Decorative Element */}
           <div className="relative z-10 hidden lg:block pr-8">
              <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-3xl shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                              <FileText size={20} />
                          </div>
                          <div>
                              <div className="h-2 w-20 bg-slate-600 rounded-full mb-1.5" />
                              <div className="h-2 w-12 bg-slate-700 rounded-full" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-700/50 rounded-full" />
                          <div className="h-2 w-full bg-slate-700/50 rounded-full" />
                          <div className="h-2 w-2/3 bg-slate-700/50 rounded-full" />
                      </div>
                      <div className="absolute -right-3 -top-3 bg-emerald-500 text-white rounded-xl p-2 shadow-lg shadow-emerald-500/30">
                          <CheckCircle2 size={20} />
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Toolbar (Search & Filter) */}
      <div className="sticky top-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
         {/* Tabs */}
         <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl overflow-x-auto w-full md:w-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'COMPLETED', label: 'Tamamlanan' },
              { id: 'DRAFT', label: 'Taslaklar' },
              { id: 'DOWNLOADED', label: 'İndirilenler' }
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                     filterStatus === tab.id
                     ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md shadow-slate-200/50 dark:shadow-black/20'
                     : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Search Box */}
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
               type="text" 
               placeholder="Belge ara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 placeholder:font-medium"
            />
         </div>
      </div>

      {/* 3. Documents Grid */}
      {filteredDocs.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
               {filteredDocs.map((doc, idx) => {
                  const { title: templateTitle, category } = getTemplateInfo(doc.templateId);
                  const status = getStatusInfo(doc.status || 'DRAFT');
                  
                  return (
                     <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: idx * 0.05, type: "spring", stiffness: 100 }}
                        key={doc.id}
                        className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                     >
                        {/* Interactive Overlay for Quick Actions (Desktop) */}
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />

                        {/* Header: Date & Status */}
                        <div className="relative z-10 flex justify-between items-start mb-6">
                           <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border backdrop-blur-sm ${status.bg} ${status.color} ${status.border}`}>
                              <status.icon size={12} strokeWidth={3} />
                              {status.label}
                           </div>
                           
                           {/* Context Menu Trigger */}
                           <div className="relative">
                              <button 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                                 }}
                                 className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
                              >
                                 <MoreVertical size={18} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              <AnimatePresence>
                                 {activeMenuId === doc.id && (
                                    <motion.div 
                                       initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                       animate={{ opacity: 1, y: 0, scale: 1 }}
                                       exit={{ opacity: 0, scale: 0.9, opacity: 0 }}
                                       className="absolute right-0 top-10 z-50 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 overflow-hidden origin-top-right p-1.5"
                                    >
                                       <button onClick={(e) => { e.stopPropagation(); onPreviewDocument(doc); setActiveMenuId(null); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors">
                                          <Eye size={16} /> Önizle
                                       </button>
                                       <button onClick={(e) => { e.stopPropagation(); onEditDocument(doc); setActiveMenuId(null); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors">
                                          <Edit size={16} /> Düzenle
                                       </button>
                                       <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                                       <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuId(null); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors">
                                          <Trash2 size={16} /> Sil
                                       </button>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex-1 mb-6">
                           <div className="flex items-start gap-4 mb-5">
                              <div className="shrink-0 w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                 <FileText size={32} />
                              </div>
                              <div className="min-w-0 pt-1">
                                 <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1 line-clamp-2" title={templateTitle}>
                                    {templateTitle}
                                 </h3>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wide truncate">
                                    {category}
                                 </p>
                              </div>
                           </div>
                           
                           <div className="space-y-2.5">
                              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                 <Building2 size={14} className="shrink-0 text-slate-400" />
                                 <span className="truncate">{doc.companyName || 'Şirket Belirtilmemiş'}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                 <Clock size={14} className="shrink-0 text-slate-400" />
                                 <span className="truncate">
                                    {new Date(doc.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="relative z-10 flex gap-3 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                           <button 
                              onClick={() => onPreviewDocument(doc)}
                              className="flex-1 py-3 bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-400 text-white dark:text-slate-900 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-indigo-500/25"
                           >
                              <Eye size={16} /> Görüntüle
                           </button>
                           <button 
                              onClick={() => onEditDocument(doc)}
                              className="w-12 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-400 dark:text-slate-500 rounded-xl font-bold transition-all flex items-center justify-center active:scale-95"
                              title="Düzenle"
                           >
                              <Edit size={18} />
                           </button>
                        </div>
                     </motion.div>
                  );
               })}
            </AnimatePresence>
         </div>
      ) : (
         /* Empty State */
         <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
         >
            <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 relative group cursor-pointer border border-slate-200 dark:border-slate-800">
               <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-ping opacity-75" />
               <FileText size={64} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors duration-500" />
               
               <div className="absolute -right-2 -bottom-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white dark:border-slate-950 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
               </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
               {searchQuery ? 'Sonuç Bulunamadı' : 'Doküman Arşivi Boş'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8 font-medium text-lg leading-relaxed">
               {searchQuery 
                  ? `"${searchQuery}" araması için herhangi bir sonuç bulamadık. Lütfen farklı bir terim deneyin veya filtreleri temizleyin.` 
                  : 'Henüz profesyonel bir belge oluşturmadınız. Hemen bir şablon seçerek başlayın.'
               }
            </p>
         </motion.div>
      )}
    </div>
  );
};
