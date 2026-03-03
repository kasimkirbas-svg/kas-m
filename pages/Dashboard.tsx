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
  AlertTriangle,
  ChevronRight,
  Archive,
  Download,
  Shield,
  Star,
  Activity,
  Award,
  FileText,
  Search,
  ArrowRight,
  CheckCircle2,
  Users,
  Upload,
  FolderOpen,
  PieChart,
  ClipboardList,
  Heart,
  ArrowUpDown,
  Filter,
  UserPlus,
  Megaphone,
  Crown,
  Gem,
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
  onPurchase?: (plan: string) => void;
  templates: DocumentTemplate[];
  recentDocuments?: GeneratedDocument[];
  savedDocuments?: GeneratedDocument[];
}

// Enhanced Sector Data with 10 documents each
const SECTORS = [
  { 
    id: 'factory', 
    name: 'FABRİKA', 
    icon: Factory, 
    image: '/sectors/factory.jpg',
    color: 'from-rose-500 to-red-600',
    accent: 'text-rose-400',
    docs: [
        'Üretim Takip Formu', 
        'Günlük Kalite Raporu', 
        'Makine Bakım Kartı', 
        'Vardiya Teslim Tutanağı',
        'İş Güvenliği Saha Denetim',
        'Personel Performans Takibi',
        'Hammadde Stok Kontrol',
        'Atık Yönetim Formu',
        'Sevkiyat Planlama Listesi',
        'Acil Durum Eylem Planı'
    ]
  },
  { 
    id: 'company', 
    name: 'KURUMSAL', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'from-blue-500 to-indigo-600',
    accent: 'text-blue-400',
    docs: [
        'Personel Özlük Dosyası', 
        'Yıllık İzin Planı', 
        'Satın Alma Talep Formu', 
        'Masraf Bildirim Formu',
        'Toplantı Tutanağı',
        'Zimmet Tutanağı',
        'Eğitim Katılım Formu',
        'Müşteri Ziyaret Raporu',
        'Proje Durum Raporu',
        'İş Seyahati Bildirim Formu'
    ]
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'from-amber-600 to-orange-700',
    accent: 'text-amber-500', 
    docs: [
        'Günlük Ocak Raporu', 
        'Patlatma Tutanağı', 
        'Gaz Ölçüm Kayıtları', 
        'Havalandırma Raporu',
        'Yeraltı Tahkimat Kontrol',
        'Vardiya Amiri Raporu',
        'Ekipman Arıza Bildirim',
        'Patlayıcı Madde Stok',
        'Su Tahliye Raporu',
        'Kaza/Olay Bildirim Formu'
    ]
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'from-orange-500 to-red-500',
    accent: 'text-orange-400',
    docs: [
        'Şantiye Günlük Defteri', 
        'İş İskelesi Kontrol', 
        'Beton Döküm Tutanağı', 
        'Hakediş İcmal Tablosu',
        'Kalıp ve Demir Kontrol',
        'İş Makinesi Operatör Formu',
        'Taşeron Çalışma İzni',
        'Yüksekte Çalışma İzni',
        'Malzeme Giriş Kontrol',
        'Proje İlerleme Raporu'
    ]
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'from-amber-400 to-orange-500',
    accent: 'text-amber-600',
    docs: [
        'Trafo Bakım Formu', 
        'Sayaç Okuma Listesi', 
        'Kesinti Bildirim Formu', 
        'İletim Hattı Kontrol',
        'Pano Kontrol Çizelgesi',
        'Jeneratör Test Raporu',
        'Topraklama Ölçüm Raporu',
        'Kablo Test Tutanağı',
        'Enerji Analiz Raporu',
        'Arıza Müdahale Formu'
    ]
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-400',
    docs: [
        'Laboratuvar Analiz Raporu', 
        'Kimyasal Stok Takip', 
        'MSDS Kontrol Formu', 
        'Atık Bertaraf Kaydı',
        'Numune Alma Formu',
        'Reaktör Temizlik Kaydı',
        'Kalibrasyon Takip Formu',
        'PH Ölçüm Çizelgesi',
        'Dökülme Müdahale Raporu',
        'Tank Seviye Kontrol'
    ]
  },
  { 
    id: 'small_business', 
    name: 'KOBİ', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'from-purple-500 to-violet-600',
    accent: 'text-purple-400',
    docs: [
        'Günlük Kasa Raporu', 
        'Veresiye Defteri', 
        'Müşteri Sipariş Formu', 
        'Fiyat Teklif Şablonu',
        'Stok Sayım Listesi',
        'Cari Hesap Ekstresi',
        'Tahsilat Makbuzu',
        'Gider Pusulası',
        'Personel Devam Çizelgesi',
        'Servis Formu'
    ]
  }
];

// Flatten all docs for "All View"
const ALL_DOCS = SECTORS.reduce<Array<{doc: string, sector: typeof SECTORS[0]}>>((acc, sector) => {
    return acc.concat(sector.docs.map(d => ({ doc: d, sector })));
}, []);

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onTemplateSelect, templates, onPurchase }) => {
  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);
  const [selectedSectorIds, setSelectedSectorIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'favorites'>('default');

  const toggleFavorite = (docName: string) => {
      setFavorites(prev => 
          prev.includes(docName) ? prev.filter(f => f !== docName) : [...prev, docName]
      );
  };

  // Interaction Logic:
  // 1. Hover shows sector docs temporarily (if no selection? or overrides selection?)
  //    User said: "mouse hareket ettirince tüm dökümanlar gözüküyor" -> indicates hover is ephemeral.
  //    "tıkladığında o büyüklük kalsın" -> Click locks state.
  //    "birden fazla sektörde seçilebilsin" -> Multi-select.
  
  const currentSector = useMemo(() => {
      // If hovering, show that sector's info for the "Header" part or accent colors
      if (hoveredSectorId) return SECTORS.find(s => s.id === hoveredSectorId);
      // If one sector is selected, maybe show that context? 
      // User didn't specify header behavior for multi-select, lets default to standard or first selected.
      if (selectedSectorIds.length === 1) return SECTORS.find(s => s.id === selectedSectorIds[0]);
      return null;
  }, [hoveredSectorId, selectedSectorIds]);

  const displayDocs = useMemo(() => {
      let docs: Array<{doc: string, sector: typeof SECTORS[0]}> = [];

      // 1. Selector/Hover Context
      if (hoveredSectorId) {
          const s = SECTORS.find(sc => sc.id === hoveredSectorId);
          if (s) docs = s.docs.map(doc => ({ doc, sector: s }));
      }
      else if (selectedSectorIds.length > 0) {
           selectedSectorIds.forEach(id => {
               const s = SECTORS.find(sc => sc.id === id);
               if (s) {
                   s.docs.forEach(d => docs.push({ doc: d, sector: s }));
               }
           });
      }
      else {
          docs = ALL_DOCS; 
      }

      // 2. Filter by Search
      if (searchQuery) {
          docs = docs.filter(d => d.doc.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // 3. Sort
      if (sortBy === 'az') {
          docs = [...docs].sort((a, b) => a.doc.localeCompare(b.doc));
      } else if (sortBy === 'favorites') {
          docs = [...docs].sort((a, b) => {
              const aFav = favorites.includes(a.doc);
              const bFav = favorites.includes(b.doc);
              if (aFav && !bFav) return -1;
              if (!aFav && bFav) return 1;
              return 0;
          });
      }

      return docs;
  }, [hoveredSectorId, selectedSectorIds, searchQuery, sortBy, favorites]);

  const toggleSector = (id: string) => {
      setSelectedSectorIds(prev => {
          if (prev.includes(id)) {
              return prev.filter(item => item !== id);
          } else {
              return [...prev, id];
          }
      });
  };

  const handleDocumentClick = (docName: string, sectorId: string) => {
    // 1. Find existing template
    const existingTemplate = templates.find(t => t.title.toLowerCase().includes(docName.toLowerCase()));

    if (existingTemplate) {
        onTemplateSelect(existingTemplate);
    } else {
        // 2. Mock Template
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
    <div className='w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-transparent relative text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30 transition-colors duration-300 overflow-y-auto'>
      
      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full gap-5'>
        
        {/* 1. Header: LOGO ONLY (Left) & CENTER TITLE */}
        <header className='shrink-0 flex items-center justify-between py-2'>
            
            {/* Left: LOGO REMOVED */}
            <div className='w-1/4'></div>

            {/* Center: Title (High Contrast) */}
            <div className='flex-1 flex flex-col items-center justify-center text-center relative z-20'>
                 <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: 'backOut' }}
                    className="relative"
                 >
                    {/* Ambient Glow behind Title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[50px] rounded-full pointer-events-none"></div>

                    <h1 className='text-3xl md:text-5xl font-black tracking-tighter relative z-10 select-none'>
                        <span className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-indigo-100 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]'>
                            DOKÜMAN YÖNETİM MERKEZİ
                        </span>
                    </h1>
                 </motion.div>

                 <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: "auto", opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="relative mt-2 overflow-hidden"
                 >
                     <span className='text-[10px] md:text-xs font-black tracking-[0.8em] uppercase relative z-10 text-slate-600 dark:text-amber-200 drop-shadow-sm whitespace-nowrap px-4 py-1'>
                            İŞ GÜVENLİĞİ PLATFORMU
                     </span>
                     
                     {/* Decorative lines */}
                     <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400 dark:via-amber-500/50 to-transparent"></span>
                 </motion.div>
            </div>
            
            {/* Right: Balance */}
            <div className='w-1/4'></div>
        </header>

        {/* 2. Sectors Row: Animated & Detailed */}
        <div className='shrink-0 h-auto md:h-40 perspective-1000' onMouseLeave={() => setHoveredSectorId(null)}>
            <div className='flex overflow-x-auto snap-x md:grid md:grid-cols-7 gap-3 h-32 md:h-full pb-2 md:pb-0 px-1 md:px-0 scrollbar-hide'>
                {SECTORS.map((sector, index) => {
                    const isSelected = selectedSectorIds.includes(sector.id);
                    const isHovered = hoveredSectorId === sector.id;
                    const isActive = isSelected || isHovered;

                    return (
                        <motion.div 
                            key={sector.id}
                            whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setHoveredSectorId(sector.id)}
                            onClick={() => toggleSector(sector.id)}
                            className={`
                            relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-end overflow-hidden group shrink-0 w-[140px] md:w-auto snap-center
                            border transition-all duration-300
                            ${isActive 
                                ? 'border-2 border-slate-700 dark:border-white shadow-xl dark:shadow-[0_0_50px_rgba(255,255,255,0.5)] scale-105 -translate-y-2 z-20 ring-4 ring-slate-300 dark:ring-white/10' 
                                : 'border-slate-300 dark:border-white/5 shadow-md bg-white dark:bg-slate-800/40 hover:border-slate-500 dark:hover:border-white/30'}
                            `}
                        >   
                            {/* Background Image */}
                            <div 
                                className='absolute inset-0 bg-cover bg-center transition-transform duration-700'
                                style={{ 
                                    backgroundImage: `url(${sector.image})`,
                                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-slate-100/30 dark:bg-slate-900/30' : 'bg-slate-100/50 dark:bg-slate-900/60 group-hover:bg-slate-100/40 dark:group-hover:bg-slate-900/40'}`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-t ${sector.color} mix-blend-overlay opacity-40 transition-opacity ${isActive ? 'opacity-60' : 'group-hover:opacity-60'}`}></div>
                                <div className='absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent opacity-90'></div>
                            </div>
                            
                            {/* Content */}
                            <div className='relative z-10 p-4 w-full flex flex-col items-center transition-transform'>
                                <div className={`
                                    mb-2 p-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-md
                                    ${isActive ? 'bg-amber-500 text-slate-900 scale-110 rotate-3' : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white group-hover:bg-white dark:group-hover:bg-white/20'}
                                `}>
                                    <sector.icon size={20} className="drop-shadow-sm" />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest text-center transition-colors duration-300 drop-shadow-sm ${isActive ? 'text-slate-900 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                    {sector.name}
                                </span>
                                
                                {/* Hover/Selected Indicator */}
                                <div className={`h-0.5 w-8 mt-2 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-500 w-12' : 'bg-transparent group-hover:bg-slate-400 dark:group-hover:bg-white/50'}`}></div>
                            </div>
                            
                            {/* Selected Checkmark (Enhanced Animation) */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div 
                                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                        animate={{ 
                                            scale: 1, 
                                            rotate: 0, 
                                            opacity: 1,
                                            transition: { 
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20 
                                            } 
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className='absolute top-3 right-3 w-8 h-8 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(16,185,129,0.5)] z-30 ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                                    >
                                        <motion.div
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.3 }}
                                        >
                                            <CheckCircle2 size={18} strokeWidth={3} className="drop-shadow-md" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                )})}
            </div>
        </div>

        {/* 3. Main Content: Split Grid */}
        <div className='flex-1 md:min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-5 md:overflow-hidden pb-2'>
            
            {/* LEFT/CENTER: Dynamic Document List (Takes 3 cols on large screens) */}
            <div className='lg:col-span-3 flex flex-col h-[600px] md:h-full bg-white dark:bg-[#15171e]/80 backdrop-blur-xl rounded-2xl border border-slate-300 dark:border-white/5 relative overflow-hidden shadow-2xl transition-all duration-300 z-10'>
                
                {/* Panel Header */}
                <div className='p-5 border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/[0.02] flex items-center justify-between shrink-0 gap-4'>
                    <div className='flex items-center gap-4 flex-1 min-w-0'>
                        <div className={`w-12 h-12 shrink-0 rounded-lg bg-gradient-to-br border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors duration-500 ${currentSector ? 'from-white to-slate-100 dark:from-slate-800 dark:to-slate-900' : 'from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10'}`}>
                            {currentSector ? (
                                <currentSector.icon className={currentSector.accent} size={24} />
                            ) : (
                                <Archive className="text-amber-700 dark:text-amber-500" size={24} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className='text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 truncate'>
                                {currentSector ? currentSector.name : 'TÜM SEKTÖRLER'} <span className='text-slate-500 dark:text-slate-500 font-normal hidden sm:inline'>DOKÜMANLARI</span>
                            </h2>
                            <p className='text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5 tracking-wide truncate'>
                                {currentSector 
                                    ? `Bu sektör için önerilen ${currentSector.docs.length} adet doküman şablonu bulundu.`
                                    : `Sistemde kayıtlı toplam ${ALL_DOCS.length} adet doküman listeleniyor.`
                                }
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                         {/* Search Input */}
                         <div className={`relative transition-all duration-300 ${isSearchActive ? 'w-48 md:w-64' : 'w-10 md:w-10 overflow-hidden'} h-10`}>
                            <input 
                                type="text"
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Doküman ara..."
                                className={`
                                    w-full h-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 rounded-lg px-10 text-xs text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-bold shadow-inner
                                    ${isSearchActive ? 'opacity-100' : 'opacity-0'}
                                `}
                            />
                            <button 
                                onClick={() => setIsSearchActive(!isSearchActive)}
                                className='absolute left-0 top-0 w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10'
                            >
                                <Search size={18} />
                            </button>
                            {isSearchActive && searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className='absolute right-0 top-0 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors'
                                >
                                    <span className="text-xs">✕</span>
                                </button>
                            )}
                         </div>

                         {/* Sort Button */}
                         <div className="relative group/sort">
                            <button className='w-10 h-10 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-white/5 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm'>
                                <ArrowUpDown size={18} />
                            </button>
                            {/* Sort Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right scale-0 group-hover/sort:scale-100 transition-transform duration-200">
                                <button 
                                    onClick={() => setSortBy('default')}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between ${sortBy === 'default' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    Varsayılan
                                    {sortBy === 'default' && <CheckCircle2 size={12} />}
                                </button>
                                <button 
                                    onClick={() => setSortBy('az')}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between ${sortBy === 'az' ? 'text-amber-600 dark:text-amber-400 bg-slate-50 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    A-Z Sırala
                                    {sortBy === 'az' && <CheckCircle2 size={12} />}
                                </button>
                                <button 
                                    onClick={() => setSortBy('favorites')}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between ${sortBy === 'favorites' ? 'text-amber-600 dark:text-amber-400 bg-slate-50 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    Favoriler
                                    {sortBy === 'favorites' && <CheckCircle2 size={12} />}
                                </button>
                            </div>
                         </div>
                    </div>
                </div>

                {/* List Body */}
                <div className='flex-1 overflow-y-auto custom-scrollbar p-3 relative bg-white dark:bg-transparent'>
                    <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentSector ? currentSector.id : 'all'}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4"
                        >
                            {displayDocs.map((item, idx) => (
                                <motion.div 
                                    key={`${item.sector.id}-${idx}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    onClick={() => handleDocumentClick(item.doc, item.sector.id)}
                                    className='group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/80 hover:border-amber-500 dark:hover:border-amber-500/40 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-lg'
                                >
                                    {/* Hover Highlight Gradient */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>

                                    {/* Accent Bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${currentSector ? 'from-transparent via-slate-400 dark:via-slate-500 to-transparent' : 'from-transparent via-amber-500/50 to-transparent group-hover:via-amber-500'} transition-colors`}></div>
                                    
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                                        <FileText size={18} className='text-slate-600 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors' />
                                    </div>
                                    
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-xs font-black text-slate-900 dark:text-slate-300 truncate group-hover:text-amber-700 dark:group-hover:text-white transition-colors'>{item.doc}</h3>
                                        <div className='flex items-center gap-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity'>
                                            <span className='text-[9px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider'>{item.sector.name}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(item.doc);
                                            }}
                                            className={`
                                                w-7 h-7 rounded-full flex items-center justify-center transition-all z-20 
                                                ${favorites.includes(item.doc) 
                                                    ? 'text-rose-500 bg-rose-500/10 opacity-100' 
                                                    : 'text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100'}
                                            `}
                                            title="Favorilere Ekle"
                                        >
                                            <Heart size={14} fill={favorites.includes(item.doc) ? "currentColor" : "none"} />
                                        </button>

                                        <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-amber-500/50'>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT: Quick Actions & Archive (Sidebar) - Updated Layout */}
            <div className='lg:col-span-1 flex flex-col gap-4 overflow-hidden'>
                
                {/* 1. SERTİFİKA OLUŞTUR (Blue Button) - Main Action */}
                <motion.button 
                    whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className='group shrink-0 h-28 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-2 border-blue-400/30 relative overflow-hidden shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] flex items-center px-5 justify-between ring-4 ring-blue-500/10'
                >
                    <div className='absolute right-[-20%] top-[-50%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500'></div>
                    <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-10 mix-blend-overlay'></div>
                    
                    {/* Shiny Line Effect */}
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />

                    <div className='flex flex-col items-start z-10 gap-1'>
                        <span className='bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-amber-500/20 animate-pulse'>YENİ</span>
                        <span className='text-xl font-black text-white leading-none tracking-tight drop-shadow-md text-left'>SERTİFİKA<br/>OLUŞTUR</span>
                        <span className='text-[10px] text-blue-200 font-medium tracking-wide'>Profesyonel şablonlar ile</span>
                    </div>
                    <div className='w-16 h-16 relative z-10 drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                         <Award className="text-amber-300 w-full h-full filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" strokeWidth={1.5} />
                    </div>
                </motion.button>

                {/* 2. HIZLI İŞLEMLER (Grid 2x2) - Optimized Layout */}
                <div className='flex-1 bg-white dark:bg-[#15171e]/90 backdrop-blur rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col overflow-hidden shadow-lg relative group/panel transition-colors duration-300 min-h-[180px]'>
                    
                    {/* Header */}
                    <div className='bg-gradient-to-r from-amber-500 to-orange-600 p-2.5 flex items-center justify-center shrink-0 shadow-md z-10 relative overflow-hidden'>
                        <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
                        <Zap size={14} className="text-white mr-1.5 animate-bounce" fill="currentColor" />
                        <span className='text-white font-black text-xs tracking-widest uppercase text-shadow-sm'>HIZLI İŞLEMLER</span>
                    </div>

                    <div className='flex-1 p-2.5 grid grid-cols-2 auto-rows-fr gap-2.5 z-10'>
                        {/* Button 1 */}
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full h-full rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-1.5 group hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-300 relative overflow-hidden shadow-sm'
                        >   
                            <div className='w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm'>
                                <FileText size={16} />
                            </div>
                            <span className='text-[9px] font-black text-slate-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 text-center leading-tight transition-colors z-10'>TUTANAK<br/>TUT</span>
                        </motion.button>

                        {/* Button 2 */}
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full h-full rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-1.5 group hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-300 relative overflow-hidden shadow-sm'
                        >
                            <div className='w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm'>
                                <ClipboardList size={16} />
                            </div>
                            <span className='text-[9px] font-black text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 text-center leading-tight transition-colors z-10'>GÜNLÜK<br/>RAPOR</span>
                        </motion.button>

                        {/* Button 3 */}
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full h-full rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-1.5 group hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 relative overflow-hidden shadow-sm'
                        >
                            <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm'>
                                <UserPlus size={16} />
                            </div>
                            <span className='text-[9px] font-black text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 text-center leading-tight transition-colors z-10'>PERSONEL<br/>EKLE</span>
                        </motion.button>

                        {/* Button 4 */}
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full h-full rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-1.5 group hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all duration-300 relative overflow-hidden shadow-sm'
                        >
                            <div className='w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm'>
                                <Megaphone size={16} />
                            </div>
                            <span className='text-[9px] font-black text-slate-600 dark:text-slate-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 text-center leading-tight transition-colors z-10'>DUYURU<br/>YAP</span>
                        </motion.button>
                    </div>

                    {/* Decorative Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                </div>

                {/* 3. DÖKÜMAN ARŞİVİ (Enhanced Footer Button) */}
                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('documents')}
                    className='shrink-0 h-20 rounded-2xl bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#1e293b] border-2 border-slate-200 dark:border-indigo-500/30 hover:border-indigo-300 dark:hover:border-indigo-400 w-full relative overflow-hidden group shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/40 flex items-center justify-between px-5 transition-all duration-300'
                >
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    
                    {/* Animated Pulse Ring */}
                    <div className="absolute right-[-20%] top-[-50%] w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:animate-pulse"></div>
                    
                    <div className='flex items-center gap-4 z-10'>
                        <div className='w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-inner ring-1 ring-indigo-500/30'>
                            <FolderOpen size={24} />
                        </div>
                        <div className='flex flex-col items-start'>
                            <span className='text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors'>DÖKÜMAN ARŞİVİ</span>
                            <span className='text-[10px] text-slate-500 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-400'>Tüm dosyalarınızı inceleyin</span>
                        </div>
                    </div>

                    <div className='z-10 bg-indigo-50 dark:bg-indigo-500/10 p-2.5 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400 group-hover:translate-x-1 duration-300 border border-indigo-200 dark:border-indigo-500/20'>
                        <ArrowRight size={18} />
                    </div>
                </motion.button>
            </div>

        </div>

        {/* 4. FOOTER: PACKAGES (Enhanced with Previous Stones & Visuals) */}
        <div className='shrink-0 pb-4 pt-2 px-2 mt-2 bg-transparent'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 items-center max-w-6xl mx-auto'>
                
                {/* 1. SILVER (Platinum/Industrial) - Sharp & Clean */}
                <motion.div 
                    animate={{ 
                         boxShadow: ["0 0 5px rgba(255,255,255,0.05)", "0 0 15px rgba(255,255,255,0.1)", "0 0 5px rgba(255,255,255,0.05)"] 
                    }}
                    transition={{ 
                         boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
                    }}
                    className='relative rounded-xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 border border-gray-400/50 dark:border-gray-600 flex flex-col items-center justify-center p-3 group cursor-pointer overflow-hidden shadow-lg h-[110px] transition-all duration-300'
                >
                     {/* Sharp Metallic Highlight */}
                     <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shine transition-transform duration-700 ease-in-out"></div>
                     
                     <div className='absolute -top-12 -right-12 w-24 h-24 bg-gray-400/20 dark:bg-gray-500/10 rounded-full blur-xl'></div>
                     
                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <Shield size={16} className='text-gray-700 dark:text-gray-300 drop-shadow-sm' fill='currentColor' />
                        <span className='text-lg font-black text-gray-700 dark:text-gray-200 uppercase tracking-[0.2em] drop-shadow-sm'>SILVER</span>
                     </div>
                     <div className='text-xl font-black text-gray-800 dark:text-white mb-0.5 z-10 tracking-tighter'>100 TL</div>
                     <div className='text-[8px] text-gray-600 dark:text-gray-400 font-bold uppercase mb-2 z-10 tracking-widest bg-gray-300/50 dark:bg-gray-700/50 px-3 py-0.5 rounded-sm'>TEMEL LİMİT</div>
                     <button 
                        onClick={() => {
                            // Gerçek ödeme simülasyonu - Burada normalde ödeme sayfasına yönlendirilir
                            window.open('https://link-to-payment-gateway.com/buy/silver', '_blank');
                        }}
                        className='w-full max-w-[100px] py-1 rounded bg-gray-800 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-white text-[9px] font-bold text-white dark:text-gray-900 shadow-md transition-all z-10 active:scale-95 uppercase tracking-wide'
                     >
                        SATIN AL
                     </button>
                </motion.div>

                {/* 2. GOLD (Center - Radiating) */}
                <motion.div 
                    initial={{ scale: 1.02 }}
                    animate={{ 
                         boxShadow: ["0 0 15px rgba(245,158,11,0.1)", "0 0 30px rgba(245,158,11,0.3)", "0 0 15px rgba(245,158,11,0.1)"] 
                    }}
                    transition={{ 
                         boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                    }}
                    className='relative z-20 rounded-xl border border-yellow-500/50 dark:border-yellow-400/50 bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-900/40 dark:to-orange-950/40 flex flex-col items-center justify-center p-3 shadow-xl h-[125px] overflow-visible backdrop-blur-md'
                >
                     {/* "ÖNERİLEN" Badge */}
                     <div className='absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-[8px] font-black px-3 py-0.5 rounded shadow-lg shadow-amber-500/40 z-30 whitespace-nowrap tracking-widest uppercase ring-1 ring-white/30'>
                        ÖNERİLEN
                     </div>

                     <div className='absolute -top-5 flex gap-1 z-10 pointer-events-none opacity-80'>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                            <Star size={10} className="text-yellow-400 fill-id-400 drop-shadow-md" />
                        </motion.div>
                         <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                            <Star size={14} className="text-amber-500 fill-amber-500 drop-shadow-lg -mt-1 mx-1" />
                        </motion.div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}>
                            <Star size={10} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
                        </motion.div>
                     </div>
                     
                     <div className='flex items-center gap-2 mb-0.5 mt-1 relative z-10'>
                        <Crown size={20} className='text-amber-600 dark:text-yellow-400 drop-shadow-md' fill='currentColor' />
                        <span className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-orange-700 dark:from-yellow-300 dark:to-amber-500 uppercase tracking-[0.2em] drop-shadow-sm'>GOLD</span>
                     </div>
                     <div className='text-3xl font-black text-slate-800 dark:text-white mb-0.5 z-10 drop-shadow-sm tracking-tighter'>175 TL</div>
                     <div className='text-[8px] text-amber-900 dark:text-amber-100 font-black uppercase mb-2 z-10 tracking-widest bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-800/50 to-transparent px-4 py-0.5 rounded-full'>2 KAT AVANTAJ</div>
                     <button 
                         onClick={() => {
                            // Gerçek ödeme simülasyonu - Burada normalde ödeme sayfasına yönlendirilir
                            window.open('https://link-to-payment-gateway.com/buy/gold', '_blank');
                        }}
                        className='w-full max-w-[120px] py-1.5 rounded bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[10px] font-black text-white shadow-lg shadow-amber-500/30 transform active:scale-95 transition-all z-10 uppercase tracking-wider'
                     >
                        HEMEN AL
                     </button>
                </motion.div>

                {/* 3. DIAMOND (Infinite/Prestige) - Magnificent & Neon */}
                <motion.div 
                    animate={{ 
                         boxShadow: ["0 0 10px rgba(6,182,212,0.1)", "0 0 25px rgba(6,182,212,0.3)", "0 0 10px rgba(6,182,212,0.1)"] 
                    }}
                    transition={{ 
                         boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } 
                    }}
                    className='relative rounded-xl bg-[#0f172a] border border-cyan-500/30 flex flex-col items-center justify-center p-3 group cursor-pointer overflow-hidden shadow-xl h-[110px] transition-all duration-300'
                >
                     {/* Background Animation */}
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a] animate-pulse-slow"></div>
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-float"></div>
                     
                     {/* Neon Borders */}
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse"></div>
                     <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse"></div>

                     {/* Prismatic Flashes */}
                     <div className="absolute -left-[100%] top-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine"></div>

                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <Gem size={16} className='text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-[spin_10s_linear_infinite]' fill='currentColor' />
                        <span className='text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] animate-pulse'>DIAMOND</span>
                     </div>
                     <div className='text-xl font-black text-white mb-0.5 z-10 tracking-tighter drop-shadow-md text-shadow-glow'>250 TL</div>
                     <div className='text-[8px] text-cyan-200 font-bold uppercase mb-2 z-10 tracking-widest bg-cyan-900/30 px-3 py-0.5 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'>SINIRSIZ LİMİT</div>
                      <button 
                        onClick={() => {
                            // Gerçek ödeme simülasyonu - Burada normalde ödeme sayfasına yönlendirilir
                            window.open('https://link-to-payment-gateway.com/buy/premium', '_blank');
                        }}
                        className='w-full max-w-[100px] py-1 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[9px] font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all z-10 active:scale-95 uppercase tracking-wide'
                     >
                        SATIN AL
                     </button>
                </motion.div>

            </div>
        </div>

      </div>
    </div>
  );
};
