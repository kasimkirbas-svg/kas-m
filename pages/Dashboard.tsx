import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Factory, 
  Building2, 
  Pickaxe, 
  HardHat, 
  Zap, 
  Beaker, 
  Wallet,
  FileCheck, 
  ChevronRight,
  Archive,
  Shield,
  Award,
  FileText,
  Search,
  ArrowRight,
  ClipboardList,
  UserPlus,
  Megaphone,
  ArrowUpDown,
  Star,
  Crown,
  Gem
} from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';
import { PLANS } from '../constants';

interface DashboardProps {
  user: User;
  t: any;
  onNavigate: (view: string, params?: { category?: string, search?: string }) => void;
  onTemplateSelect: (template: DocumentTemplate) => void;
  templates: DocumentTemplate[];
  recentDocuments?: GeneratedDocument[];
  savedDocuments?: GeneratedDocument[];
}

const SECTORS = [
  { 
    id: 'factory', 
    name: 'FABRİKA', 
    icon: Factory, 
    image: '/sectors/factory.jpg',
    color: 'from-rose-500 to-red-600',
    docs: [
        'Üretim Takip Formu', 'Günlük Kalite Raporu', 'Makine Bakım Kartı', 'Vardiya Teslim Tutanağı',
        'İş Güvenliği Saha Denetim', 'Personel Performans Takibi', 'Hammadde Stok Kontrol', 'Atık Yönetim Formu',
        'Sevkiyat Planlama Listesi', 'Acil Durum Eylem Planı'
    ]
  },
  { 
    id: 'company', 
    name: 'KURUMSAL', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'from-blue-500 to-indigo-600',
    docs: [
        'Personel Özlük Dosyası', 'Yıllık İzin Planı', 'Satın Alma Talep Formu', 'Masraf Bildirim Formu',
        'Toplantı Tutanağı', 'Zimmet Tutanağı', 'Eğitim Katılım Formu', 'Müşteri Ziyaret Raporu',
        'Proje Durum Raporu', 'İş Seyahati Bildirim Formu'
    ]
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'from-amber-600 to-orange-700',
    docs: [
        'Günlük Ocak Raporu', 'Patlatma Tutanağı', 'Gaz Ölçüm Kayıtları', 'Havalandırma Raporu',
        'Yeraltı Tahkimat Kontrol', 'Vardiya Amiri Raporu', 'Ekipman Arıza Bildirim', 'Patlayıcı Madde Stok',
        'Su Tahliye Raporu', 'Kaza/Olay Bildirim Formu'
    ]
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'from-orange-500 to-red-500',
    docs: [
        'Şantiye Günlük Defteri', 'İş İskelesi Kontrol', 'Beton Döküm Tutanağı', 'Hakediş İcmal Tablosu',
        'Kalıp ve Demir Kontrol', 'İş Makinesi Operatör Formu', 'Taşeron Çalışma İzni', 'Yüksekte Çalışma İzni',
        'Malzeme Giriş Kontrol', 'Proje İlerleme Raporu'
    ]
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'from-amber-400 to-orange-500',
    docs: [
        'Trafo Bakım Formu', 'Sayaç Okuma Listesi', 'Kesinti Bildirim Formu', 'İletim Hattı Kontrol',
        'Pano Kontrol Çizelgesi', 'Jeneratör Test Raporu', 'Topraklama Ölçüm Raporu', 'Kablo Test Tutanağı',
        'Enerji Analiz Raporu', 'Arıza Müdahale Formu'
    ]
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'from-emerald-500 to-teal-600',
    docs: [
        'Laboratuvar Analiz Raporu', 'Kimyasal Stok Takip', 'MSDS Kontrol Formu', 'Atık Bertaraf Kaydı',
        'Numune Alma Formu', 'Reaktör Temizlik Kaydı', 'Kalibrasyon Takip Formu', 'PH Ölçüm Çizelgesi',
        'Dökülme Müdahale Raporu', 'Tank Seviye Kontrol'
    ]
  },
  { 
    id: 'small_business', 
    name: 'KOBİ', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'from-purple-500 to-violet-600',
    docs: [
        'Günlük Kasa Raporu', 'Veresiye Defteri', 'Müşteri Sipariş Formu', 'Fiyat Teklif Şablonu',
        'Stok Sayım Listesi', 'Cari Hesap Ekstresi', 'Tahsilat Makbuzu', 'Gider Pusulası',
        'Personel Devam Çizelgesi', 'Servis Formu'
    ]
  }
];

const ALL_DOCS = SECTORS.reduce<Array<{doc: string, sector: typeof SECTORS[0]}>>((acc, sector) => {
    return acc.concat(sector.docs.map(d => ({ doc: d, sector })));
}, []);

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onTemplateSelect, templates }) => {
  const [selectedSectorIds, setSelectedSectorIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'az'>('default');

  const displayDocs = useMemo(() => {
    let docs = [];
    if (selectedSectorIds.length > 0) {
        docs = ALL_DOCS.filter(d => selectedSectorIds.includes(d.sector.id));
    } else {
        docs = ALL_DOCS;
    }
    
    if (searchQuery) {
        docs = docs.filter(d => d.doc.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (sortBy === 'az') {
        docs.sort((a, b) => a.doc.localeCompare(b.doc));
    }
    
    return docs;
  }, [selectedSectorIds, searchQuery, sortBy]);

  const toggleSector = (id: string) => {
      setSelectedSectorIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDocumentClick = (docName: string, sectorId: string) => {
    const existingTemplate = templates.find(t => t.title.toLowerCase().includes(docName.toLowerCase()));
    if (existingTemplate) {
        onTemplateSelect(existingTemplate);
    } else {
        const sector = SECTORS.find(s => s.id === sectorId)!;
        let category = 'safety';
        if (sector.id === 'factory') category = 'production';
        if (sector.id === 'company') category = 'hr';

        const newTemplate: DocumentTemplate = {
            id: 'dynamic-' + Math.random().toString(36).substr(2, 9),
            title: docName,
            category: category,
            description: `${sector.name} sektörü için ${docName} şablonu.`,
            isPro: false,
            createdAt: new Date().toISOString(),
            content: [],
            tags: [sector.id, 'form']
        };
        onTemplateSelect(newTemplate);
    }
  };

  return (
    <div className='w-full min-h-screen bg-transparent relative text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30 pb-20'>
      
      <div className='flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 gap-6'>
        
        {/* HEADER */}
        <header className='flex items-center justify-center py-4'>
            <div className='flex flex-col items-center justify-center text-center'>
                 <h1 className='text-3xl md:text-5xl font-black tracking-tighter select-none'>
                    <span className='bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm'>
                        DOKÜMAN YÖNETİM MERKEZİ
                    </span>
                 </h1>
                 <span className='text-[10px] md:text-xs font-black tracking-[0.8em] uppercase text-slate-400 mt-2 border-b border-slate-600/50 pb-2 px-8'>
                        İŞ GÜVENLİĞİ PLATFORMU
                 </span>
            </div>
        </header>

        {/* 1. SECTORS CARDS ROW */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-2'>
            {SECTORS.map((sector) => {
                const isSelected = selectedSectorIds.includes(sector.id);
                return (
                    <motion.div 
                        key={sector.id}
                        onClick={() => toggleSector(sector.id)}
                        whileHover={{ y: -5 }}
                        className={`
                            relative h-28 md:h-32 rounded-xl overflow-hidden cursor-pointer group border transition-all duration-300
                            ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-slate-700/50 hover:border-slate-500'}
                        `}
                    >   
                        {/* Background Image & Overlay */}
                        <div className="absolute inset-0 bg-slate-900">
                             {/* Placeholder for images - using gradients if image fails to load, but assuming public/sectors/ exists */}
                             <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                        </div>
                        
                        <div className="relative h-full flex flex-col items-center justify-center z-10 p-2">
                             <div className={`
                                w-10 h-10 rounded-lg mb-2 flex items-center justify-center border border-white/10
                                backdrop-blur-sm bg-white/5 group-hover:bg-white/10 transition-colors
                             `}>
                                 <sector.icon size={20} className="text-white/90" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-wider text-white">
                                 {sector.name}
                             </span>
                        </div>
                        
                        {/* Active Indicator */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                        )}
                    </motion.div>
                )
            })}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            
            {/* LEFT: DOCUMENTS LIST (3 Columns) */}
            <div className='lg:col-span-3 flex flex-col gap-4'>
                
                {/* Section Header */}
                <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                             <Archive size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-200">
                                {selectedSectorIds.length > 0 ? `${selectedSectorIds.length} SEKTÖR SEÇİLDİ` : 'TÜM SEKTÖRLER'} 
                                <span className="text-slate-500 font-normal ml-2">DOKÜMANLARI</span>
                            </h2>
                            <p className="text-xs text-slate-500">Sistemde kayıtlı toplam {displayDocs.length} adet doküman listeleniyor.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                             <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Doküman ara..." 
                                className="h-9 pl-9 pr-3 rounded-lg bg-slate-900/50 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-500 w-48 transition-colors"
                             />
                         </div>
                         <button 
                            onClick={() => setSortBy(prev => prev === 'default' ? 'az' : 'default')}
                            className={`p-2 rounded-lg border border-slate-700 ${sortBy === 'az' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-900/50 text-slate-400'}`}
                         >
                             <ArrowUpDown size={16} />
                         </button>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <AnimatePresence>
                        {displayDocs.map((item, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={`${item.sector.id}-${item.doc}`}
                                onClick={() => handleDocumentClick(item.doc, item.sector.id)}
                                className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg overflow-hidden"
                            >
                                <div className="flex items-start gap-4">
                                     <div className={`p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 group-hover:border-slate-600 text-slate-400 group-hover:text-white transition-colors`}>
                                         <FileText size={18} />
                                     </div>
                                     <div className="flex-1 min-w-0 py-0.5">
                                         <h3 className="text-sm font-bold text-slate-200 group-hover:text-white truncate transition-colors">
                                             {item.doc}
                                         </h3>
                                         <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">
                                             {item.sector.name}
                                         </p>
                                     </div>
                                </div>
                                <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                     <ChevronRight className="text-amber-500" size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>

            {/* RIGHT: SIDEBAR (1 Column) */}
            <div className='lg:col-span-1 flex flex-col gap-4'>
                
                {/* 1. SERTİFİKA OLUŞTUR (Blue Banner) */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className='relative h-28 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden cursor-pointer shadow-lg shadow-blue-900/20 group'
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Award size={120} />
                    </div>
                    
                    <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                         <div className="bg-white/20 backdrop-blur-sm self-start px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-wider">
                             YENİ
                         </div>
                         <div className="flex items-end justify-between">
                             <div>
                                 <h3 className="text-xl font-black text-white leading-tight">SERTİFİKA<br/>OLUŞTUR</h3>
                                 <p className="text-[10px] text-blue-100/80 mt-1">Profesyonel şablonlar ile</p>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                 <Award size={20} />
                             </div>
                         </div>
                    </div>
                </motion.div>

                {/* 2. HIZLI İŞLEMLER (Orange Gradient Header + Grid) */}
                <div className='bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden'>
                     {/* Orange Header */}
                     <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 flex items-center justify-center gap-2 relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                         <Zap className="text-white relative z-10" fill="currentColor" size={16} />
                         <span className="text-sm font-black text-white uppercase tracking-widest relative z-10">HIZLI İŞLEMLER</span>
                     </div>

                     {/* Grid Content */}
                     <div className="p-3 grid grid-cols-2 gap-2">
                         {[
                            { label: 'TUTANAK TUT', icon: FileText, color: 'text-indigo-400' },
                            { label: 'GÜNLÜK RAPOR', icon: ClipboardList, color: 'text-emerald-400' },
                            { label: 'PERSONEL EKLE', icon: UserPlus, color: 'text-blue-400' },
                            { label: 'DUYURU YAP', icon: Megaphone, color: 'text-rose-400' },
                         ].map((btn, i) => (
                             <button key={i} className="flex flex-col items-center justify-center py-4 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group">
                                 <div className={`mb-2 ${btn.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                                     <btn.icon size={20} />
                                 </div>
                                 <span className="text-[9px] font-bold text-slate-400 group-hover:text-white text-center px-1">
                                     {btn.label}
                                 </span>
                             </button>
                         ))}
                     </div>
                </div>

                {/* 3. DOKÜMAN ARŞİVİ */}
                <button 
                    onClick={() => onNavigate('documents')}
                    className="h-20 bg-slate-800 rounded-2xl border border-slate-700 p-4 flex items-center justify-between hover:bg-slate-750 hover:border-slate-600 transition-all group shadow-lg"
                >
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                             <Archive size={20} />
                         </div>
                         <div className="text-left">
                             <div className="text-xs font-black text-slate-200">DÖKÜMAN ARŞİVİ</div>
                             <div className="text-[10px] text-slate-500">Tüm dosyalarınızı inceleyin</div>
                         </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                         <ArrowRight size={14} />
                     </div>
                </button>

            </div>
        </div>

        {/* 4. FOOTER: PACKAGES (Enhanced with Precious Stones & Visuals) */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center max-w-5xl mx-auto w-full pt-8'>
             {/* 1. SILVER */}
             <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 flex flex-col items-center justify-center p-6 h-[120px] group cursor-pointer overflow-hidden shadow-lg'
                >
                     <div className='absolute top-0 right-0 w-24 h-24 bg-slate-700/10 rounded-full blur-2xl'></div>
                     <Shield className='mb-2 text-slate-400' size={24} fill='currentColor' />
                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <span className='text-sm font-black text-slate-300 uppercase tracking-widest'>SILVER</span>
                     </div>
                     <div className='text-2xl font-black text-white mb-0.5 z-10'>100 TL</div>
                     <div className='text-[9px] text-slate-500 font-bold uppercase mb-2 z-10 tracking-wider'>TEMEL LİMİT</div>
                     <button className='w-full max-w-[100px] py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-300 z-10'>
                        SATIN AL
                     </button>
             </motion.div>

             {/* 2. GOLD */}
             <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='relative rounded-2xl bg-gradient-to-b from-amber-600 to-amber-700 border border-amber-500 flex flex-col items-center justify-center p-6 h-[140px] group cursor-pointer overflow-hidden shadow-xl shadow-amber-900/20 z-10'
                >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-800/80 text-amber-100 text-[9px] font-black px-3 py-0.5 rounded-b-lg border-b border-l border-r border-amber-500/50 flex items-center gap-1 shadow-sm">
                        <Star size={8} fill="currentColor" /> ÖNERİLEN <Star size={8} fill="currentColor" />
                     </div>
                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-10 mix-blend-overlay'></div>
                     <Crown className='mb-2 text-amber-100' size={32} fill='currentColor' />
                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <span className='text-xl font-black text-white uppercase tracking-widest drop-shadow-sm'>GOLD</span>
                     </div>
                     <div className='text-3xl font-black text-white mb-0.5 z-10 drop-shadow-sm'>175 TL</div>
                     <div className='text-[10px] text-amber-100/80 font-bold uppercase mb-3 z-10 tracking-wider'>2 KAT AVANTAJ</div>
                     <button className='w-full max-w-[120px] py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 border border-amber-400/50 text-xs font-bold text-white shadow-lg z-10'>
                        SATIN AL
                     </button>
             </motion.div>

             {/* 3. DIAMOND */}
             <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='relative rounded-2xl bg-gradient-to-b from-indigo-900 to-slate-900 border border-indigo-500/50 flex flex-col items-center justify-center p-6 h-[120px] group cursor-pointer overflow-hidden shadow-lg'
                >
                     <Gem className='mb-2 text-indigo-400' size={24} fill='currentColor' />
                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <span className='text-sm font-black text-indigo-300 uppercase tracking-widest'>DIAMOND</span>
                     </div>
                     <div className='text-2xl font-black text-white mb-0.5 z-10'>250 TL</div>
                     <div className='text-[9px] text-indigo-400/70 font-bold uppercase mb-2 z-10 tracking-wider'>SINIRSIZ LİMİT</div>
                     <button className='w-full max-w-[100px] py-1 rounded bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 z-10'>
                        SATIN AL
                     </button>
             </motion.div>
        </div>

      </div>
    </div>
  );
};
