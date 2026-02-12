import React, { useState } from 'react';
import { DocumentTemplate } from '../types';
import { Search, FileText, CheckCircle, Smartphone, Layout, ArrowRight } from 'lucide-react';

interface DocumentsListProps {
  templates: DocumentTemplate[];
  onSelectTemplate: (template: DocumentTemplate) => void;
  userIsPremium?: boolean;
  t?: any;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  templates,
  onSelectTemplate,
  userIsPremium = false,
  t
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    // Show all templates but mark lock state if premium
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">{t?.documents?.allTemplates || 'Yeni Bir Doküman Oluştur'}</h2>
          <p className="text-blue-100 text-lg mb-6">
            Profesyonel şablonlardan birini seçerek raporlarınızı saniyeler içinde hazırlayın, PDF olarak indirin ve paylaşın.
          </p>
          
          {/* Search Bar Inside Hero */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t?.documents?.search || 'Şablon adı veya açıklama ara...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-slate-900 focus:ring-4 focus:ring-blue-500/30 focus:outline-none shadow-lg"
            />
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-full font-medium transition whitespace-nowrap text-sm border ${
            selectedCategory === null
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {t?.documents?.all || 'Tüm Şablonlar'}
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-medium transition whitespace-nowrap text-sm border ${
              selectedCategory === category
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
             <FileText className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-600 text-lg font-medium">{t?.documents?.noResults || 'Aradığınız kriterlere uygun şablon bulunamadı.'}</p>
          <button 
             onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
             className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
             Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => {
            const isLocked = template.isPremium && !userIsPremium;
            
            return (
              <div
                key={template.id}
                className={`bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full relative ${isLocked ? 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100' : ''}`}
                onClick={() => !isLocked && onSelectTemplate(template)}
              >
                {/* Banner Image / Color */}
                <div className={`h-32 w-full relative overflow-hidden ${isLocked ? 'bg-slate-100' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
                   {/* Create a dynamic pattern or icon based on ID */}
                   <div className="absolute inset-0 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform duration-500">
                      <Layout size={64} opacity={0.2} />
                   </div>
                   
                   {/* Premium Badge */}
                   {template.isPremium && (
                     <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                       PREMIUM
                     </div>
                   )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                     <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-wider">
                       {template.category}
                     </span>
                     <span className="text-slate-400 text-xs flex items-center gap-1">
                       <Smartphone size={12} /> Mobil Uyumlu
                     </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                    {template.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {template.description}
                  </p>
                  
                  {/* Footer Stats/Action */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                     <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Layout size={14} />
                        <span>{template.fields.length} Alan</span>
                     </div>
                     
                     <div className="flex items-center gap-1 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        {isLocked ? 'Yükselt' : 'Oluştur'} <ArrowRight size={16} />
                     </div>
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
