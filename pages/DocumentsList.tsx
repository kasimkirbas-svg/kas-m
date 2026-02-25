import React, { useState, useEffect } from 'react';
import { DocumentTemplate } from '../types';
import { 
  Search, FileText, CheckCircle, Smartphone, Layout, ArrowRight
} from 'lucide-react';

interface DocumentsListProps {
  templates: DocumentTemplate[];
  onSelectTemplate: (template: DocumentTemplate) => void;
  userIsPremium?: boolean;
  t?: any;
  initialCategory?: string | null;
  initialSearchQuery?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  templates,
  onSelectTemplate,
  userIsPremium = false,
  t,
  initialCategory = null,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  // Update effect when props change
  useEffect(() => {
    if (initialSearchQuery !== undefined) setSearchQuery(initialSearchQuery);
    if (initialCategory !== undefined) setSelectedCategory(initialCategory);
  }, [initialSearchQuery, initialCategory]);

  const getCategoryVisual = (cat: string) => {
      const normal = cat?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || '';
      
      // ISG & Güvenlik -> Kırmızı
      if (normal.includes('isg') || normal.includes('guvenlik') || normal.includes('acil')) 
          return { bg: 'bg-red-500', iconBg: 'bg-red-600' };
          
      // İK & Personel -> Yeşil
      if (normal.includes('ik') || normal.includes('insan') || normal.includes('personel') || normal.includes('egitim')) 
          return { bg: 'bg-emerald-500', iconBg: 'bg-emerald-600' };
          
      // Muhasebe & Finans -> Pembe
      if (normal.includes('muhasebe') || normal.includes('finans') || normal.includes('fatura') || normal.includes('masraf')) 
          return { bg: 'bg-pink-500', iconBg: 'bg-pink-600' };
          
      // Hukuk & Sözleşme -> Mor
      if (normal.includes('hukuk') || normal.includes('sozlesme') || normal.includes('kvkk')) 
          return { bg: 'bg-violet-500', iconBg: 'bg-violet-600' };
          
      // Teknik & Bakım & İnşaat -> Mavi
      if (normal.includes('teknik') || normal.includes('bakim') || normal.includes('arac') || normal.includes('makine') || normal.includes('insaat') || normal.includes('santiye')) 
          return { bg: 'bg-blue-600', iconBg: 'bg-blue-700' };
          
      // Kalite & Denetim -> Turuncu
      if (normal.includes('kalite') || normal.includes('denetim') || normal.includes('anket')) 
          return { bg: 'bg-orange-500', iconBg: 'bg-orange-600' };
          
      // Satış & Teklif -> Amber
      if (normal.includes('satis') || normal.includes('teklif') || normal.includes('pazarlama')) 
          return { bg: 'bg-amber-500', iconBg: 'bg-amber-600' };
          
      // Genel -> İndigo
      return { bg: 'bg-indigo-500', iconBg: 'bg-indigo-600' };
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const title = t?.templates?.[`t${template.id}_title`] || template.title;
    const desc = t?.templates?.[`t${template.id}_desc`] || template.description;

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in p-2">
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center md:text-left border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {t?.documents?.allTemplates || 'Yeni Bir Doküman Oluştur'}
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl font-medium">
            Profesyonel şablonlardan birini seçerek raporlarınızı saniyeler içinde hazırlayın, PDF olarak indirin ve paylaşın.
          </p>
          
          <div className="relative max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t?.documents?.search || 'Şablon adı veya açıklama ara...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 border border-slate-700/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-lg backdrop-blur-sm"
            />
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm border-2 ${
            selectedCategory === null
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-indigo-200 dark:hover:border-slate-700'
          }`}
        >
          {t?.documents?.all || 'Tüm Şablonlar'}
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm border-2 ${
              selectedCategory === category
                ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-full mb-4">
             <FileText className="text-slate-400 dark:text-slate-500" size={40} />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xl font-bold mb-2">{t?.documents?.noResults || 'Sonuç Bulunamadı'}</p>
          <p className="text-slate-400 mb-6">Aradığınız kriterlere uygun şablon mevcut değil.</p>
          <button 
             onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
             className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-colors"
          >
             Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredTemplates.map(template => {
            const isLocked = template.isPremium && !userIsPremium;
            const title = t?.templates?.[`t${template.id}_title`] || template.title;
            const desc = t?.templates?.[`t${template.id}_desc`] || template.description;
            const style = getCategoryVisual(template.category);
            
            return (
              <div
                key={template.id}
                className={`group relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-700 h-full flex flex-col ${isLocked ? 'grayscale-[0.8] opacity-80 hover:grayscale-0 hover:opacity-100' : 'hover:-translate-y-2'}`}
                onClick={() => !isLocked && onSelectTemplate(template)}
              >
                 {/* Top Decor Bar */}
                 <div className={`h-2 w-full ${style.bg}`}></div>

                 <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        {/* Icon Box */}
                        <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                            <FileText size={28} />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col gap-2 items-end">
                            {template.isPremium && (
                                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200 dark:border-amber-900/50">
                                PREMIUM
                                </span>
                            )}
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                {template.category}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                        {desc}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <Layout size={14} />
                            <span>{template.fields.length} Alan</span>
                         </div>
                         
                         <span className={`text-xs font-bold uppercase flex items-center gap-1 ${isLocked ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            {isLocked ? (
                                <>
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div> Kilitli
                                </>
                            ) : (
                                <>
                                Oluştur <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                         </span>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

