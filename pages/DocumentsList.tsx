import React, { useState } from 'react';
import { DocumentTemplate } from '../types';
import { 
  Search, FileText, CheckCircle, Smartphone, Layout, ArrowRight
} from 'lucide-react';

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

  const getCategoryVisual = (cat: string) => {
      const normal = cat?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || '';
      
      // ISG & Güvenlik
      if (normal.includes('isg') || normal.includes('guvenlik') || normal.includes('acil')) 
          return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'; // Baret/İnşaat alanı
          
      // İK & Personel
      if (normal.includes('ik') || normal.includes('insan') || normal.includes('personel') || normal.includes('egitim')) 
          return 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop'; // Toplantı/Ekip
          
      // Muhasebe & Finans
      if (normal.includes('muhasebe') || normal.includes('finans') || normal.includes('fatura') || normal.includes('masraf')) 
          return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'; // Hesap makinesi/Grafik
          
      // Hukuk & Sözleşme
      if (normal.includes('hukuk') || normal.includes('sozlesme') || normal.includes('kvkk')) 
          return 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop'; // Adalet terazisi/Hukuk
          
      // Teknik & Bakım & İnşaat
      if (normal.includes('teknik') || normal.includes('bakim') || normal.includes('arac') || normal.includes('makine') || normal.includes('insaat') || normal.includes('santiye')) 
          return 'https://images.unsplash.com/photo-1581094794329-cd56b507d18b?q=80&w=600&auto=format&fit=crop'; // Mühendis/Blueprint
          
      // Kalite & Denetim
      if (normal.includes('kalite') || normal.includes('denetim') || normal.includes('anket')) 
          return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'; // İş planı/Analiz
          
      // Satış & Teklif
      if (normal.includes('satis') || normal.includes('teklif') || normal.includes('pazarlama')) 
          return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop'; // El sıkışma/Anlaşma
          
      // Genel Ofis
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'; // Modern Ofis
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
    <div className="w-full flex flex-col gap-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">{t?.documents?.allTemplates || 'Yeni Bir Doküman Oluştur'}</h2>
          <p className="text-blue-100 text-lg mb-6">
            Profesyonel şablonlardan birini seçerek raporlarınızı saniyeler içinde hazırlayın, PDF olarak indirin ve paylaşın.
          </p>
          
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredTemplates.map(template => {
            const isLocked = template.isPremium && !userIsPremium;
            const title = t?.templates?.[`t${template.id}_title`] || template.title;
            const desc = t?.templates?.[`t${template.id}_desc`] || template.description;
            const imageUrl = getCategoryVisual(template.category);
            
            return (
              <div
                key={template.id}
                className={`bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full relative ${isLocked ? 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100' : ''}`}
                onClick={() => !isLocked && onSelectTemplate(template)}
              >
                {/* Banner Image */}
                <div className="h-40 w-full relative overflow-hidden">
                   <img 
                      src={imageUrl} 
                      alt={template.category} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                   
                   {/* Overlay Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                   {/* Premium Badge */}
                   {template.isPremium && (
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-100 shadow-sm text-amber-500 text-[10px] font-bold flex items-center gap-1 z-10">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                       PRO
                     </div>
                   )}
                   
                   {/* Category Badge on Image */}
                   <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
                        {template.category}
                      </span>
                   </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col relative bg-white">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-slate-400 text-xs flex items-center gap-1">
                       <Smartphone size={12} /> Mobil Uyumlu
                     </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1" title={title}>
                    {title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                    {desc}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                     <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                        <Layout size={14} />
                        <span>{template.fields.length} Alan</span>
                     </div>
                     
                     <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
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

