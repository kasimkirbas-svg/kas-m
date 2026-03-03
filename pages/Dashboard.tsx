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

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onTemplateSelect, templates }) => {
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

        {/* MAIN UNIFIED INTERFACE WRAPPER (Glass Effect) */}
        <div className='flex-1 flex flex-col min-h-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden'>
            
            {/* 2. Sectors Row (Now acts as the Header/Tabs for the Interface) */}
            <div className='shrink-0 h-auto md:h-32 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-800/50 relative z-20 border-b border-slate-200/50 dark:border-white/5' onMouseLeave={() => setHoveredSectorId(null)}>
                 <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
                 <div className='flex overflow-x-auto snap-x md:grid md:grid-cols-7 gap-1 h-32 md:h-full px-2 py-2 md:px-4 md:py-3 scrollbar-hide'>
                    {SECTORS.map((sector, index) => {
                        const isSelected = selectedSectorIds.includes(sector.id);
                        const isHovered = hoveredSectorId === sector.id;
                        const isActive = isSelected || isHovered;

                        return (
                            <motion.div 
                                key={sector.id}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onMouseEnter={() => setHoveredSectorId(sector.id)}
                                onClick={() => toggleSector(sector.id)}
                                className={`
                                relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-center overflow-hidden group shrink-0 w-[120px] md:w-auto snap-center
                                transition-all duration-300
                                ${isActive 
                                    ? 'bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 transform scale-[1.02]' 
                                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/50'}
                                `}
                            >   
                                {/* New Simple Clean Look for Tabs */}
                                <div className={`
                                    p-2 rounded-lg transition-all duration-300 mb-2
                                    ${isActive ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'}
                                `}>
                                    <sector.icon size={22} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                                    {sector.name}
                                </span>
                                
                                {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 w-1/2 h-1 bg-amber-500 rounded-t-full" />}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* 3. Main Content Grid (Unified Body) */}
            <div className='flex-1 md:min-h-0 grid grid-cols-1 lg:grid-cols-4 md:overflow-hidden'>
                
                {/* LEFT: Document List (Transparent Integration) */}
                <div className='lg:col-span-3 flex flex-col h-[600px] md:h-full relative z-10'>
                    
                    {/* Toolbar */}
                    <div className='p-4 pl-6 flex items-center justify-between shrink-0 gap-4'>
                        <div className='flex items-center gap-4 flex-1 min-w-0'>
                             <h2 className='text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2'>
                                <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                                {currentSector ? currentSector.name : 'TÜM SEKTÖRLER'}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                {currentSector ? currentSector.docs.length : ALL_DOCS.length} Doküman
                            </span>
                        </div>

                        <div className='flex items-center gap-2 shrink-0 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700'>
                             {/* Search Input */}
                             <div className='flex items-center px-3 gap-2 w-64'>
                                <Search size={16} className="text-slate-400"/>
                                <input 
                                    type="text"
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Hızlı arama..."
                                    className='bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full'
                                />
                                {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-red-500"><X size={12}/></button>}
                             </div>
                             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                             <button className='p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors'>
                                <ArrowUpDown size={16} />
                             </button>
                        </div>
                    </div>

                    {/* List Body */}
                    <div className='flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 relative'>
                         <AnimatePresence mode='wait'>
                            <motion.div 
                                key={currentSector ? currentSector.id : 'all'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                            >
                                {displayDocs.map((item, idx) => (
                                    <div 
                                        key={`${item.sector.id}-${idx}`}
                                        onClick={() => handleDocumentClick(item.doc, item.sector.id)}
                                        className='group flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 hover:bg-white hover:scale-[1.02] hover:shadow-lg hover:border-amber-400/50 transition-all duration-200 cursor-pointer relative overflow-hidden'
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors`}>
                                            <FileText size={18} className='text-slate-500 dark:text-slate-400 group-hover:text-white' />
                                        </div>
                                        
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-xs font-black text-slate-800 dark:text-slate-300 truncate group-hover:text-amber-700 dark:group-hover:text-white transition-colors'>{item.doc}</h3>
                                            <div className='flex items-center gap-2 mt-0.5'>
                                                <span className='text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase'>{item.sector.name}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                             <ArrowRight size={14} className="text-amber-500" />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: Sidebar (Integrated) */}
                <div className='lg:col-span-1 bg-slate-50/50 dark:bg-slate-800/20 border-l border-slate-200 dark:border-white/5 p-4 flex flex-col gap-4 overflow-hidden relative'>
                    
                    {/* Header for Sidebar */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <Zap size={16} className="text-amber-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Hızlı İşlemler</span>
                    </div>

                    {/* 1. SERTİFİKA OLUŞTUR */}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                        className='group shrink-0 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden shadow-lg flex items-center px-4 justify-between'
                    >
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                         <div className='relative z-10 text-left'>
                             <span className='bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm'>YENİ</span>
                             <div className='text-lg font-black text-white leading-none mt-1'>SERTİFİKA<br/>OLUŞTUR</div>
                         </div>
                         <Award className="text-white/80 w-10 h-10 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                    </motion.button>

                    {/* 2. GRID BUTTONS */}
                    <div className='grid grid-cols-2 gap-2'>
                        {[
                            { icon: FileText, label: 'TUTANAK', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: ClipboardList, label: 'RAPOR', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { icon: UserPlus, label: 'PERSONEL', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Megaphone, label: 'DUYURU', color: 'text-rose-600', bg: 'bg-rose-50' },
                        ].map((btn, i) => (
                             <button key={i} className='h-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md group'>
                                 <div className={`w-8 h-8 rounded-full ${btn.bg} dark:bg-slate-700 flex items-center justify-center ${btn.color} dark:text-slate-300 group-hover:scale-110 transition-transform`}>
                                     <btn.icon size={16} />
                                 </div>
                                 <span className='text-[9px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'>{btn.label}</span>
                             </button>
                        ))}
                    </div>

                    {/* 3. ARCHIVE BUTTON */}
                    <button onClick={() => onNavigate('documents')} className='mt-auto h-16 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-between px-5 font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors group'>
                         <span className="text-sm">Tüm Arşiv</span>
                         <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>

        {/* 4. FOOTER: PACKAGES (Enhanced with Precious Stones & Visuals) */}
        <div className='shrink-0 pb-6 pt-2 px-2'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center max-w-5xl mx-auto'>
                
                {/* 1. SILVER (Was Standart) */}
                <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='relative rounded-2xl bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center p-4 group cursor-pointer overflow-hidden shadow-sm hover:shadow-lg dark:shadow-slate-900/50 h-[100px] md:h-[110px] transition-all duration-300'
                >
                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-5 dark:opacity-20 mix-blend-overlay'></div>
                     <div className='absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-slate-700/30 rounded-full blur-2xl group-hover:bg-white/60 dark:group-hover:bg-slate-600/30 transition-colors duration-500'></div>
                     
                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <Shield size={18} className='text-slate-700 dark:text-slate-400 drop-shadow-sm transition-transform group-hover:rotate-12 duration-300' fill='currentColor' />
                        <span className='text-base font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 via-slate-900 to-black dark:from-slate-200 dark:via-slate-400 dark:to-slate-200 uppercase tracking-widest drop-shadow-sm'>SILVER</span>
                     </div>
                     <div className='text-xl font-black text-slate-900 dark:text-slate-200 mb-0.5 z-10 tracking-tight drop-shadow-sm'>100 TL</div>
                     <div className='text-[9px] text-slate-700 dark:text-slate-500 font-bold uppercase mb-2 z-10 tracking-wider'>TEMEL LİMİT</div>
                     <button className='w-24 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-900 dark:text-slate-300 shadow-sm hover:shadow-md transition-all z-10'>
                        SATIN AL
                     </button>
                </motion.div>

                {/* 2. GOLD (Center - Highlights & "Recommended" Badge) */}
                <motion.div 
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.15 }}
                    animate={{ 
                        boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 40px rgba(245,158,11,0.4)", "0 0 20px rgba(245,158,11,0.2)"] 
                    }}
                    transition={{ 
                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                    }}
                    className='relative z-20 rounded-2xl border border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-gradient-to-b dark:from-amber-900/80 dark:via-yellow-900/60 dark:to-amber-950 flex flex-col items-center justify-center p-4 shadow-lg h-[120px] md:h-[130px] overflow-visible'
                >
                     {/* "ÖNERİLEN" Badge - Floating above */}
                     <div className='absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg dark:shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse z-30 whitespace-nowrap border border-white/20 dark:border-yellow-200'>
                        🌟 ÖNERİLEN 🌟
                     </div>

                     <div className='absolute -top-3 flex gap-1 z-10'>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                            <Star size={14} className="text-amber-500 dark:text-yellow-300 fill-amber-500 dark:fill-yellow-300 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                        </motion.div>
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
                            <Star size={18} className="text-orange-500 dark:text-amber-400 fill-orange-500 dark:fill-amber-400 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] -mt-2" />
                        </motion.div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                            <Star size={14} className="text-amber-500 dark:text-yellow-300 fill-amber-500 dark:fill-yellow-300 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                        </motion.div>
                     </div>

                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)] opacity-5 dark:opacity-20 mix-blend-overlay'></div>
                     
                     <div className='flex items-center gap-2 mb-1 mt-2 relative z-10'>
                        <Crown size={22} className='text-amber-600 dark:text-amber-300 drop-shadow-sm' fill='currentColor' />
                        <span className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-600 via-orange-600 to-amber-700 dark:from-yellow-200 dark:via-yellow-400 dark:to-amber-500 uppercase tracking-widest drop-shadow-sm'>GOLD</span>
                     </div>
                     <div className='text-3xl font-black text-slate-800 dark:text-white mb-0.5 z-10 drop-shadow-sm tracking-tighter'>175 TL</div>
                     <div className='text-[10px] text-amber-700 dark:text-amber-200 font-bold uppercase mb-2 z-10 tracking-wide'>2 KAT AVANTAJ</div>
                     <button className='w-32 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border border-amber-400/50 text-xs font-black text-white shadow-sm hover:shadow-md dark:shadow-[0_5px_15px_rgba(245,158,11,0.4)] transform active:scale-95 transition-all z-10'>
                        SATIN AL
                     </button>
                </motion.div>

                {/* 3. DIAMOND (Was Premium/Pro) */}
                <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='relative rounded-2xl bg-gradient-to-b from-cyan-50 via-cyan-50 to-blue-50 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950 border border-cyan-200 dark:border-cyan-700/50 flex flex-col items-center justify-center p-4 group cursor-pointer overflow-hidden shadow-sm hover:shadow-lg dark:shadow-cyan-900/40 h-[100px] md:h-[110px] transition-all duration-300'
                >
                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-5 dark:opacity-20 mix-blend-overlay'></div>
                     <div className='absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-2xl group-hover:bg-cyan-300/30 dark:group-hover:bg-cyan-500/30 transition-colors duration-500'></div>

                     <div className='flex items-center gap-2 mb-1 z-10'>
                        <Gem size={18} className='text-cyan-600 dark:text-cyan-400 drop-shadow-sm transition-transform group-hover:rotate-[360deg] duration-700 ease-in-out' fill='currentColor' />
                        <span className='text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-200 dark:via-blue-300 dark:to-indigo-200 uppercase tracking-widest drop-shadow-sm'>DIAMOND</span>
                     </div>
                     <div className='text-xl font-black text-cyan-900 dark:text-cyan-100 mb-0.5 z-10 tracking-tight drop-shadow-sm'>250 TL</div>
                     <div className='text-[9px] text-cyan-800 dark:text-cyan-200/80 font-bold uppercase mb-2 z-10 tracking-wider'>SINIRSIZ LİMİT</div>
                      <button className='w-24 py-1 rounded bg-cyan-200 hover:bg-cyan-300 dark:bg-cyan-800 dark:hover:bg-cyan-700 border border-cyan-300 dark:border-cyan-600/50 text-[10px] font-bold text-cyan-900 dark:text-cyan-100 shadow-sm hover:shadow-md transition-all z-10'>
                        SATIN AL
                     </button>
                </motion.div>

            </div>
        </div>

      </div>
    </div>
  );
};
