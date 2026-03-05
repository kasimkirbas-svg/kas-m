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
  ChevronDown,
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
  Box,
  Crown,
  Gem,
  Instagram,
  Facebook,
  Linkedin,
  Youtube
} from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';
import { PLANS } from '../constants';

const XLogo = ({ size = 14, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

import { PaymentPage } from './PaymentPage';

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
  
  // Payment State
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{ plan: 'SILVER' | 'GOLD' | 'DIAMOND', price: string } | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [isDocsExpanded, setIsDocsExpanded] = useState(false); // Controls "Show All" toggle

  if (selectedPlanForPayment) {
    return (
      <PaymentPage 
        plan={selectedPlanForPayment.plan} 
        price={selectedPlanForPayment.price} 
        period={billingCycle}
        onBack={() => setSelectedPlanForPayment(null)}
        onSuccess={() => {
            alert('Ödeme başarıyla alındı! (Demo)');
            setSelectedPlanForPayment(null);
        }}
      />
    );
  }

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
            isPremium: false, // Changed from isPro to match interface
            fields: [
                { key: 'details', label: 'Detaylar', type: 'textarea', required: true, placeholder: 'Lütfen detayları giriniz...' },
                { key: 'date', label: 'Tarih', type: 'date', required: true }
            ],
            content: '', 
        };
        onTemplateSelect(newTemplate);
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-col bg-transparent relative text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30 transition-colors duration-300'>
      
      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full gap-5'>
        
        {/* 1. Header: LOGO ONLY (Left) & CENTER TITLE */}
        <header className='shrink-0 flex items-center justify-between py-2'>
            
            {/* Left: LOGO REMOVED */}
            <div className='w-1/4'></div>

            {/* Center: Title (High Contrast) */}
            <div className='flex-1 flex flex-col items-center justify-center text-center relative z-20'>
                 <div className="relative">
                    {/* Ambient Glow behind Title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-500/5 blur-[30px] md:blur-[50px] rounded-full pointer-events-none will-change-transform"></div>

                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight relative z-10 select-none drop-shadow-lg leading-tight text-white'>
                         YILLIK DOKÜMANLAR
                    </h1>
                 </div>

                 <div className="text-amber-500/80 text-lg md:text-xl font-bold my-1 md:my-[-5px] z-20 relative">&</div>

                 <div className="relative mt-0 overflow-hidden px-4 md:px-8 py-2">
                     <span className='relative z-10 text-[10px] md:text-sm font-black tracking-[0.5em] md:tracking-[1em] uppercase text-amber-400 drop-shadow-sm whitespace-nowrap animate-pulse'>
                            İŞ TAKİP PANELİ
                     </span>
                 </div>
            </div>
            
            <div className='w-1/4'></div>
        </header>

        {/* 2. Sectors Row: Responsive Grid (Wraps automatically) */}
        <div className='shrink-0 h-auto z-20 relative px-0 md:px-4 py-4 md:py-6' onMouseLeave={() => setHoveredSectorId(null)}>
            <div className='flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 w-full px-4 md:px-2 py-4 md:py-6 scrollbar-hide' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {SECTORS.map((sector, index) => {
                    const isSelected = selectedSectorIds.includes(sector.id);
                    const isHovered = hoveredSectorId === sector.id;
                    const isActive = isSelected || isHovered;

                    return (
                        <motion.div 
                            key={sector.id}
                            animate={{ 
                                scale: isHovered ? 1.05 : 1,
                                y: isHovered ? -5 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            onMouseEnter={() => setHoveredSectorId(sector.id)}
                            onClick={() => toggleSector(sector.id)}
                            className={`
                            shrink-0 snap-center relative rounded-xl cursor-pointer select-none h-32 md:h-40 flex flex-col items-center justify-center overflow-hidden
                            w-[140px] md:w-full
                            border transition-colors duration-300
                            ${isActive 
                                ? 'border-amber-500 dark:border-white shadow-2xl dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-2 ring-amber-200 dark:ring-white/20' 
                                : 'border-slate-300 dark:border-white/10 shadow-md bg-white dark:bg-slate-800/40 hover:border-slate-400'}
                            `}
                        >   
                            {/* Background Image */}
                            <div 
                                className='absolute inset-0 bg-cover bg-center transition-transform duration-500'
                                style={{ 
                                    backgroundImage: `url(${sector.image})`,
                                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-slate-900/10 dark:bg-slate-900/20' : 'bg-slate-100/50 dark:bg-slate-900/60'}`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-t ${sector.color} mix-blend-overlay opacity-40 transition-opacity ${isActive ? 'opacity-80' : 'opacity-60'}`}></div>
                                <div className='absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent opacity-90'></div>
                            </div>
                            
                            {/* Content */}
                            <div className='relative z-10 p-2 w-full flex flex-col items-center'>
                                <div 
                                    className={`
                                    mb-1 p-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300
                                    ${isActive ? 'bg-amber-500 text-slate-900 shadow-amber-500/50 scale-110' : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-slate-200'}
                                    `}
                                >
                                    <sector.icon size={20} className="drop-shadow-sm" />
                                </div>
                                <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest text-center transition-colors duration-300 drop-shadow-sm leading-tight ${isActive ? 'text-slate-900 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {sector.name}
                                </span>
                            </div>
                            
                            {/* Selected Checkmark */}
                            {isSelected && (
                                <div className='absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg z-30 animate-in zoom-in duration-200'>
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                            )}

                        </motion.div>
                )})}
            </div>
        </div>

        {/* 3. Main Content: Split Grid */}
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 pb-2 items-start'>
            
            {/* LEFT/CENTER: Dynamic Document List (Takes 3 cols on large screens) */}
            <div className='lg:col-span-3 flex flex-col bg-white dark:bg-[#0f172a]/90 backdrop-blur-md rounded-2xl border border-slate-300 dark:border-indigo-500/30 relative overflow-hidden shadow-xl transition-all duration-300 z-10'>
                {/* Vivid Background Pattern for Documents */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/20 to-purple-50/50 dark:from-blue-900/20 dark:via-[#0f172a] dark:to-purple-900/20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[60px] md:blur-[100px] pointer-events-none will-change-transform"></div>
                <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
                
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


                {/* List Body - Compact Default with Toggle */}
                <div className={`
                    relative bg-white dark:bg-transparent rounded-2xl p-4
                    ${(!user?.plan || user.plan === 'FREE' || user.plan === 'MONTHLY' && false) ? '' : 'shadow-inner dark:shadow-none'}
                `}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
                        {/* Show only first 12 items if not expanded */}
                        {displayDocs.slice(0, isDocsExpanded ? undefined : 12).map((item, idx) => (
                            <div 
                                key={`${item.sector.id}-${idx}`}
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
                                </div>
                            ))}
                        </div>

                    {/* Show All Toggle Button */}
                    {!isDocsExpanded && displayDocs.length > 12 && (
                        <div className="flex justify-center mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button 
                                onClick={() => setIsDocsExpanded(true)}
                                className="group flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
                            >   
                                <span>Tümünü Göster ({displayDocs.length - 12} Daha Fazla)</span>
                                <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    )}
                    
                    {/* Show Less Toggle Button */}
                    {isDocsExpanded && displayDocs.length > 12 && (
                         <div className="flex justify-center mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button 
                                onClick={() => setIsDocsExpanded(false)}
                                className="group flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
                            >   
                                <ChevronDown size={16} className="rotate-180 group-hover:-translate-y-1 transition-transform" />
                                <span>Daha Az Göster</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Quick Actions & Archive (Sidebar) - Updated Layout */}
            <div className='lg:col-span-1 flex flex-col gap-3'>
                
                {/* 1. SERTİFİKA OLUŞTUR (Blue Button) - Main Action */}
                <motion.button 
                    whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        window.scrollTo({ top: document.getElementById('search-section')?.offsetTop, behavior: 'smooth' });
                        setSearchQuery('Sertifika');
                    }}
                    className='group shrink-0 h-24 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 border border-blue-400/50 relative overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center px-5 justify-between'
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                    <div className='absolute right-[-10%] top-[-50%] w-32 md:w-48 h-32 md:h-48 bg-white/10 md:bg-white/20 rounded-full blur-[40px] group-hover:bg-white/30 transition-colors duration-700 md:animate-pulse-slow will-change-transform'></div>
                    
                    {/* Shiny Line Effect */}
                    <motion.div 
                        className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" 
                        animate={{ left: ['-100%', '200%'] }} 
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} 
                    />

                    <div className='flex flex-col items-start z-10 gap-1'>
                        <span className='bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-amber-500/20 animate-pulse'>YENİ</span>
                        <span className='text-xl font-black text-white leading-none tracking-tight drop-shadow-md text-left'>SERTİFİKA<br/>OLUŞTUR</span>
                        <span className='text-[10px] text-indigo-100 font-medium tracking-wide'>Profesyonel şablonlar ile</span>
                    </div>
                    <div className='w-16 h-16 relative z-10 drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                         <Award className="text-amber-300 w-full h-full filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" strokeWidth={1.5} />
                    </div>
                </motion.button>

                {/* 2. HIZLI İŞLEMLER (Grid 2x2) - Optimized Layout - FIXED */}
                <div className='shrink-0 bg-slate-100 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col relative'>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 dark:from-amber-900/20 dark:via-[#0f172a] dark:to-rose-900/10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.05] dark:opacity-[0.1] pointer-events-none mix-blend-overlay"></div>
                    
                    {/* Header - Compact */}
                    <div className='bg-gradient-to-r from-amber-600 to-orange-700 py-2.5 px-3 flex items-center justify-between shrink-0 shadow-md relative overflow-hidden'>
                        <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-10"></div>
                        <div className='flex items-center gap-2 relative z-10'>
                            <Zap size={14} className="text-white animate-pulse" fill="currentColor" />
                            <span className='text-white font-black text-xs tracking-[0.15em] uppercase text-shadow-sm'>HIZLI İŞLEMLER</span>
                        </div>
                    </div>

                    <div className='p-3 grid grid-cols-2 gap-3 relative bg-slate-50/50 dark:bg-[#0f172a]'>
                         {/* Button 1: Tutanak */}
                        <motion.button 
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.scrollTo({ top: document.getElementById('search-section')?.offsetTop, behavior: 'smooth' });
                                setSearchQuery('Tutanak');
                            }}
                            className='relative h-[4.5rem] rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-indigo-500/10 group flex items-center px-3 gap-3 overflow-hidden transition-all duration-200'
                        >   
                            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent group-hover:w-full transition-all duration-300"></div>
                            <div className='w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-sm'>
                                <FileText size={20} />
                            </div>
                            <div className='flex flex-col items-start z-10'>
                                <span className='text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 leading-none mb-1'>Hemen</span>
                                <span className='text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 leading-none'>TUTANAK</span>
                            </div>
                        </motion.button>

                        {/* Button 2: Günlük Rapor */}
                        <motion.button 
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.scrollTo({ top: document.getElementById('search-section')?.offsetTop, behavior: 'smooth' });
                                setSearchQuery('Günlük Rapor');
                            }}
                            className='relative h-[4.5rem] rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-emerald-500/10 group flex items-center px-3 gap-3 overflow-hidden transition-all duration-200'
                        >
                            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-emerald-50/50 dark:from-emerald-900/10 to-transparent group-hover:w-full transition-all duration-300"></div>
                            <div className='w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-sm'>
                                <ClipboardList size={20} />
                            </div>
                            <div className='flex flex-col items-start z-10'>
                                <span className='text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 leading-none mb-1'>Günlük</span>
                                <span className='text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 leading-none'>RAPOR</span>
                            </div>
                        </motion.button>

                        {/* Button 3: İzin Formu */}
                        <motion.button 
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.scrollTo({ top: document.getElementById('search-section')?.offsetTop, behavior: 'smooth' });
                                setSearchQuery('İzin');
                            }}
                            className='relative h-[4.5rem] rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-blue-500/10 group flex items-center px-3 gap-3 overflow-hidden transition-all duration-200'
                        >
                            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-900/10 to-transparent group-hover:w-full transition-all duration-300"></div>
                            <div className='w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-sm'>
                                <UserPlus size={20} />
                            </div>
                            <div className='flex flex-col items-start z-10'>
                                <span className='text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 leading-none mb-1'>Personel</span>
                                <span className='text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 leading-none'>İZİN FORMU</span>
                            </div>
                        </motion.button>

                        {/* Button 4: Zimmet/Teslim */}
                        <motion.button 
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.scrollTo({ top: document.getElementById('search-section')?.offsetTop, behavior: 'smooth' });
                                setSearchQuery('Zimmet');
                            }}
                            className='relative h-[4.5rem] rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm hover:shadow-violet-500/10 group flex items-center px-3 gap-3 overflow-hidden transition-all duration-200'
                        >
                            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-violet-50/50 dark:from-violet-900/10 to-transparent group-hover:w-full transition-all duration-300"></div>
                            <div className='w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-sm'>
                                <Box size={20} />
                            </div>
                            <div className='flex flex-col items-start z-10'>
                                <span className='text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 leading-none mb-1'>Demirbaş</span>
                                <span className='text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-300 leading-none'>ZİMMETLE</span>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* 3. DÖKÜMAN ARŞİVİ (Enhanced Footer Button) */}
                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('my-documents')}
                    className='shrink-0 h-[4.5rem] rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-900/40 hover:from-indigo-100 dark:hover:from-indigo-900/60 dark:hover:to-purple-800/60 border border-indigo-200 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 w-full relative overflow-hidden group shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/40 flex items-center justify-between px-5 transition-all duration-300 z-20 ring-1 ring-transparent hover:ring-indigo-200 dark:hover:ring-indigo-900/30'
                >
                    <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)] opacity-[0.03] dark:opacity-10 mix-blend-overlay pointer-events-none'></div>
                    <div className='absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none'></div>
                    
                    {/* Animated Pulse Ring */}
                    <div className="absolute right-[-20%] top-[-50%] w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:animate-pulse"></div>
                    
                    <div className='flex items-center gap-4 z-10'>
                        <div className='w-12 h-12 rounded-xl bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm ring-1 ring-indigo-500/20'>
                            <FolderOpen size={24} />
                        </div>
                        <div className='flex flex-col items-start'>
                            <span className='text-sm font-black text-indigo-950 dark:text-white tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-200 transition-colors'>DÖKÜMAN ARŞİVİ</span>
                            <span className='text-[10px] text-indigo-700/70 dark:text-indigo-200/70 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-300'>Tüm dosyalarınızı inceleyin</span>
                        </div>
                    </div>

                    <div className='z-10 bg-white/50 dark:bg-indigo-500/20 backdrop-blur-sm p-2.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-500 dark:text-indigo-400 group-hover:translate-x-1 duration-300 border border-indigo-200 dark:border-indigo-500/30 shadow-sm'>
                        <ArrowRight size={18} />
                    </div>
                </motion.button>
            </div>

        </div>

        {/* 4. FOOTER: PACKAGES (Integrated into Design) */}
        {(!user?.plan || user.plan === 'FREE' || ((user.plan === 'MONTHLY' || user.plan === 'SILVER') && false)) && (
        <div className='shrink-0 pb-8 pt-4 px-1 mt-4'>
            
            <div className='relative max-w-6xl mx-auto rounded-3xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-md p-6 md:p-8 overflow-hidden shadow-xl'>
                
                {/* Background Ambient Glow */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 via-amber-500/5 to-transparent blur-[60px] md:blur-[100px] pointer-events-none will-change-transform'></div>

                {/* Section Header */}
                <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-10'>
                    <div className='text-center md:text-left'>
                        <h3 className='text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3'>
                            <Crown className="text-amber-500" fill="currentColor" size={28} />
                            PREMIUM <span className='text-slate-400 font-light'>AYRICALIKLARI</span>
                        </h3>
                        <p className='text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-md'>
                            Sınırsız doküman erişimi ve gelişmiş özellikler için planınızı yükseltin.
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className='bg-white dark:bg-slate-900 p-1.5 rounded-full flex relative shadow-lg shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 w-fit mx-auto'>
                        <div 
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-indigo-600 rounded-full shadow-md transition-transform duration-300 ease-out ${billingCycle === 'MONTHLY' ? 'translate-x-0' : 'translate-x-[calc(100%+6px)]'}`}
                        />
                        <button 
                            onClick={() => setBillingCycle('MONTHLY')}
                            className={`relative z-10 w-28 py-2 text-xs font-black rounded-full transition-colors tracking-wide ${billingCycle === 'MONTHLY' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            AYLIK
                        </button>
                        <button 
                            onClick={() => setBillingCycle('YEARLY')}
                            className={`relative z-10 w-28 py-2 text-xs font-black rounded-full transition-colors tracking-wide ${billingCycle === 'YEARLY' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            YILLIK
                            <span className="absolute -top-3 -right-2 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-lg shadow-rose-500/30">
                                %20 İNDİRİM
                            </span>
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10'>
                

                {/* 1. SILVER (Modern & Elegant) */}
                <motion.div 
                    whileHover={{ translateY: -5, scale: 1.02 }}
                    className='relative h-[130px] rounded-xl bg-gradient-to-br from-slate-200 via-white to-slate-400 dark:from-slate-700 dark:via-slate-600 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-500 shadow-xl flex flex-col items-center justify-center p-4 group overflow-hidden cursor-pointer'
                >
                     {/* Modern Accents */}
                     <div className='absolute inset-0 bg-white/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0'></div>
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full z-0"></div>
                     
                     {/* Dynamic Animated Shine for Silver Effect */}
                     <motion.div 
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent skew-x-[30deg] z-0 pointer-events-none"
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                     />

                     {/* Silver Texture */}
                     <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/aluminum.png)] opacity-30 mix-blend-overlay z-0 pointer-events-none"></div>

                     <div className='flex items-center gap-2 mb-2 z-10'>
                        <Shield size={18} className='text-slate-500 dark:text-slate-300 drop-shadow-sm group-hover:text-slate-800 dark:group-hover:text-white transition-colors animate-pulse' />
                        <span className='text-lg font-black text-slate-700 dark:text-white uppercase tracking-widest group-hover:text-slate-900 transition-colors drop-shadow-sm'>SILVER</span>
                     </div>
                     <div className='text-3xl font-black text-slate-900 dark:text-white mb-1 z-10 drop-shadow-sm'>
                        {billingCycle === 'MONTHLY' ? '100 TL' : '1000 TL'}
                     </div>
                     <div className='text-[9px] font-bold uppercase bg-slate-300/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 px-3 py-0.5 mb-3 rounded-full z-10 border border-slate-400/50 shadow-inner backdrop-blur-sm'>TEMEL LİMİT</div>
                     
                     <button 
                        onClick={() => setSelectedPlanForPayment({ plan: 'SILVER', price: billingCycle === 'MONTHLY' ? '100 TL' : '1000 TL' })}
                        className='w-full max-w-[100px] py-1 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white text-[10px] font-bold uppercase tracking-wide transition-colors z-10 rounded-lg shadow-lg border border-slate-300/50'
                     >
                        SATIN AL
                     </button>
                </motion.div>

                {/* 2. GOLD (Radiant/Center) */}
                <motion.div 
                    whileHover={{ translateY: -10, scale: 1.05 }}
                    className='relative h-[150px] rounded-xl bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-2 border-amber-400/50 dark:border-amber-500/30 flex flex-col items-center justify-center p-4 shadow-2xl shadow-amber-500/10 z-10'
                >
                     <div className="absolute -top-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1 z-20">
                         <Star size={10} fill="currentColor" className="animate-spin-slow" />
                         EN ÇOK TERCİH EDİLEN
                         <Star size={10} fill="currentColor" className="animate-spin-slow" />
                     </div>
                     
                     {/* Amber Particles */}
                     <div className="absolute inset-0 overflow-hidden rounded-xl">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute bg-amber-400 rounded-full blur-[2px] opacity-40"
                            style={{ width: Math.random() * 6 + 'px', height: Math.random() * 6 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }}
                            animate={{ y: [0, -50], opacity: [0, 1, 0] }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                          />
                        ))}
                     </div>

                     <div className='flex items-center gap-2 mb-1 mt-2 z-10'>
                        <Crown size={24} className='text-amber-600 dark:text-amber-400 drop-shadow-sm' />
                        <span className='text-2xl font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest'>GOLD</span>
                     </div>
                     <div className='text-4xl font-black text-amber-900 dark:text-white mb-1 z-10 drop-shadow-sm'>
                        {billingCycle === 'MONTHLY' ? '175 TL' : '1750 TL'}
                     </div>
                     <div className='text-[9px] font-bold uppercase text-amber-800 dark:text-amber-200 bg-amber-200/50 dark:bg-amber-800/30 px-3 py-0.5 rounded-full mb-3 z-10'>2 KAT AVANTAJ</div>
                     
                     <button 
                         onClick={() => setSelectedPlanForPayment({ plan: 'GOLD', price: billingCycle === 'MONTHLY' ? '175 TL' : '1750 TL' })}
                         className='w-full max-w-[120px] py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded shadow-lg shadow-amber-500/30 transition-all transform active:scale-95'
                     >
                        HEMEN AL
                     </button>
                </motion.div>

                {/* 3. DIAMOND (Royal/Prestige) */}
                <motion.div 
                    whileHover={{ translateY: -12, scale: 1.05 }}
                    className='relative h-[160px] rounded-xl bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] border border-indigo-500/50 hover:border-indigo-400 shadow-2xl shadow-indigo-900/50 flex flex-col items-center justify-center p-4 overflow-hidden group'
                >
                    {/* Royal Background */}
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                     <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                     <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

                     {/* Floating Gems */}
                     <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                           <motion.div
                             key={i}
                             initial={{ opacity: 0, scale: 0, rotate: 0 }}
                             animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: 360, y: -40 }}
                             transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                             className="absolute text-cyan-500/30"
                             style={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%` }}
                           >
                              <Gem size={Math.random() * 10 + 8} />
                           </motion.div>
                        ))}
                     </div>

                     <div className='flex items-center gap-2 mb-1 mt-4 z-10'>
                        <Gem size={24} className='text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' />
                        <span className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 uppercase tracking-widest'>DIAMOND</span>
                     </div>
                     
                     <div className='text-4xl font-black text-white mb-2 z-10 drop-shadow-md'>
                        {billingCycle === 'MONTHLY' ? '250 TL' : '2500 TL'}
                     </div>
                     
                     <div className='text-[9px] text-indigo-200 font-bold uppercase mb-3 z-10 tracking-[0.2em] flex items-center gap-2'>
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
                        SINIRSIZ ERİŞİM
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
                     </div>
                     
                      <button 
                         onClick={() => setSelectedPlanForPayment({ plan: 'DIAMOND', price: billingCycle === 'MONTHLY' ? '250 TL' : '2500 TL' })}
                         className='w-full max-w-[140px] py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[10px] font-bold shadow-lg shadow-indigo-500/50 transition-all z-10 active:scale-95 uppercase tracking-wide border border-indigo-400/30'
                     >
                        SATIN AL
                     </button>
                </motion.div>


            </div>
        </div>
      </div>
     )}

      {/* Social Media Footer Dashboard */}
      <div className="mt-8 pb-8 pt-4 border-t border-slate-200 dark:border-slate-800/50 flex flex-col items-center gap-4 text-center">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">Platformu Takip Edin</div>
          <div className="flex justify-center gap-4">
            {[ 
               { icon: Instagram, href: "https://instagram.com" },
               { icon: Facebook, href: "https://facebook.com" },
               { icon: XLogo, href: "https://x.com" },
               { icon: Linkedin, href: "https://linkedin.com" },
               { icon: Youtube, href: "https://youtube.com" },
               { icon: ({size, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.482-1.46-1.656-1.759-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, href: "https://wa.me/905555555555" }
            ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white dark:hover:border-amber-400 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:-translate-y-1">
                    <social.icon size={16} />
                </a>
            ))}
          </div>
          <div className="text-xs text-slate-400 opacity-60 font-mono mt-2">© {new Date().getFullYear()} Kırbaş Platform. Tüm Hakları Saklıdır.</div>
      </div>

      </div>
    </div>
  );
};
