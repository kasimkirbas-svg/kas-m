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
  PieChart
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
    color: 'from-yellow-400 to-amber-500',
    accent: 'text-yellow-300',
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

  // Logic: Show hovered sector docs, otherwise check activeSectorId? 
  // User requested: "mouse her hangi bir sektörde olmadığında tüm şablonlar gözüksün"
  // So NO persisted active state from click necessary, rely on hover.
  
  const currentSector = useMemo(() => {
      return SECTORS.find(s => s.id === hoveredSectorId);
  }, [hoveredSectorId]);

  const displayDocs = useMemo(() => {
      if (currentSector) {
          return currentSector.docs.map(doc => ({ doc, sector: currentSector }));
      }
      return ALL_DOCS; // Show all if no hover
  }, [currentSector]);

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
    <div className='h-screen w-screen overflow-hidden flex flex-col bg-[#0f172a] relative text-slate-200 font-sans selection:bg-amber-500/30'>
      
      {/* Background Ambience */}
      <div className='absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-[#0f172a] pointer-events-none z-0'></div>
      <div className='absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow'></div>
      <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.04] mix-blend-overlay pointer-events-none z-0'></div>

      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full gap-5'>
        
        {/* 1. Header: LOGO ONLY (Left) & CENTER TITLE */}
        <header className='shrink-0 flex items-center justify-between py-2'>
            
            {/* Left: LOGO ONLY */}
            <div className='w-1/4 flex items-center gap-3'>
                 <div className='w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 transform rotate-3 hover:rotate-0 transition-all duration-300 group cursor-pointer'>
                    <Shield className='text-slate-900 w-7 h-7 group-hover:scale-110 transition-transform' strokeWidth={2.5} />
                 </div>
                 <div className='flex flex-col'>
                    <span className='text-xl font-black text-slate-100 tracking-tighter leading-none'>KIRBAŞ</span>
                    <span className='text-[10px] bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-bold tracking-[0.2em]'>PANEL YÖNETİMİ</span>
                 </div>
            </div>

            {/* Center: Title */}
            <div className='flex-1 flex flex-col items-center justify-center text-center'>
                 <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-2xl md:text-4xl font-black tracking-tight relative'
                 >
                    <span className='bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm'>
                        DOKÜMAN YÖNETİM MERKEZİ
                    </span>
                 </motion.h1>
                 <span className='text-[10px] md:text-xs text-amber-500/80 font-bold tracking-[0.4em] uppercase mt-1'>
                        PREMIUM İŞ GÜVENLİĞİ PLATFORMU
                 </span>
            </div>
            
            {/* Right: Balance */}
            <div className='w-1/4'></div>
        </header>

        {/* 2. Sectors Row: Animated & Detailed */}
        <div className='shrink-0 h-36 md:h-40 perspective-1000' onMouseLeave={() => setHoveredSectorId(null)}>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 h-full'>
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredSectorId(sector.id)}
                    className={`
                    relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-end overflow-hidden group
                    border transition-all duration-500
                    ${hoveredSectorId === sector.id ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-white/5 shadow-lg bg-slate-800/40'}
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    `}
                >   
                    {/* Background Image */}
                    <div 
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                        style={{ backgroundImage: `url(${sector.image})` }}
                    >
                        <div className={`absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors duration-300 ${hoveredSectorId === sector.id ? 'bg-slate-900/30' : ''}`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-t ${sector.color} mix-blend-overlay opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                        <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90'></div>
                    </div>
                    
                    {/* Content */}
                    <div className='relative z-10 p-4 w-full flex flex-col items-center group-hover:-translate-y-1 transition-transform'>
                        <div className={`
                            mb-2 p-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg
                            ${hoveredSectorId === sector.id ? 'bg-amber-500 text-slate-900 scale-110 rotate-3' : 'bg-white/10 text-white group-hover:bg-white/20'}
                        `}>
                            <sector.icon size={20} className="drop-shadow-sm" />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest text-center transition-colors duration-300 ${hoveredSectorId === sector.id ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'}`}>
                            {sector.name}
                        </span>
                        
                        {/* Hover Indicator */}
                        <div className={`h-0.5 w-8 mt-2 rounded-full transition-all duration-300 ${hoveredSectorId === sector.id ? 'bg-amber-500 w-12' : 'bg-transparent group-hover:bg-white/50'}`}></div>
                    </div>
                </motion.div>
                ))}
            </div>
        </div>

        {/* 3. Main Content: Split Grid */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-5 overflow-hidden pb-2'>
            
            {/* LEFT/CENTER: Dynamic Document List (Takes 3 cols on large screens) */}
            <div className='lg:col-span-3 flex flex-col h-full bg-[#15171e]/80 backdrop-blur-sm rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl transition-all duration-300'>
                
                {/* Panel Header */}
                <div className='p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0'>
                    <div className='flex items-center gap-4'>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br border border-slate-700 flex items-center justify-center transition-colors duration-500 ${currentSector ? 'from-slate-800 to-slate-900' : 'from-amber-500/10 to-orange-500/10'}`}>
                            {currentSector ? (
                                <currentSector.icon className={currentSector.accent} size={24} />
                            ) : (
                                <Archive className="text-amber-500" size={24} />
                            )}
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-white tracking-tight flex items-center gap-2'>
                                {currentSector ? currentSector.name : 'TÜM SEKTÖRLER'} <span className='text-slate-500 font-normal'>DOKÜMANLARI</span>
                            </h2>
                            <p className='text-xs text-slate-400 font-medium mt-0.5 tracking-wide'>
                                {currentSector 
                                    ? `Bu sektör için önerilen ${currentSector.docs.length} adet doküman şablonu bulundu.`
                                    : `Sistemde kayıtlı toplam ${ALL_DOCS.length} adet doküman listeleniyor.`
                                }
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                         <button className='p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center gap-2 border border-white/5 bg-slate-900/50'>
                            <span className='text-xs font-bold hidden md:inline'>ARA</span>
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* List Body */}
                <div className='flex-1 overflow-y-auto custom-scrollbar p-3 relative'>
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
                                    className='group flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-amber-500/10'
                                >
                                    {/* Hover Highlight Gradient */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>

                                    {/* Accent Bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${currentSector ? 'from-transparent via-slate-500 to-transparent' : 'from-transparent via-amber-500/50 to-transparent group-hover:via-amber-500'} transition-colors`}></div>
                                    
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
                                        <FileText size={18} className='text-slate-500 group-hover:text-amber-400 transition-colors' />
                                    </div>
                                    
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-xs font-bold text-slate-300 truncate group-hover:text-white transition-colors'>{item.doc}</h3>
                                        <div className='flex items-center gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity'>
                                            <span className='text-[9px] text-slate-400 font-bold uppercase tracking-wider'>{item.sector.name}</span>
                                        </div>
                                    </div>

                                    {/* Action Icon */}
                                    <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-amber-500/50'>
                                        <ArrowRight size={14} />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT: Quick Actions & Archive (Sidebar) - Restored Old Style */}
            <div className='lg:col-span-1 flex flex-col gap-4 overflow-hidden'>
                
                {/* 1. HIZLI İŞLEMLER (Quick Actions) */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1'>HIZLI İŞLEMLER</h3>
                    
                    {/* Sertifika Button - Highlighted */}
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                        className='group w-full p-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 border border-orange-500/30 text-left relative overflow-hidden shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all'
                    >
                        <div className='absolute right-[-10px] top-[-10px] opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500'>
                            <Award size={64} className="text-white" />
                        </div>
                        <div className='relative z-10'>
                            <Award className="text-white mb-2" size={24} />
                            <div className='text-sm font-black text-white leading-tight'>SERTİFİKA<br/>OLUŞTUR</div>
                            <div className='text-[10px] text-orange-100 mt-1 opacity-80'>Personel eğitimi için</div>
                        </div>
                    </button>

                    {/* Other Actions Grid */}
                    <div className='grid grid-cols-2 gap-2'>
                        <button className='p-3 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 hover:border-amber-500/30 transition-all flex flex-col items-center gap-2 group'>
                            <Users size={20} className='text-blue-400 group-hover:scale-110 transition-transform' />
                            <span className='text-[9px] font-bold text-slate-300'>PERSONEL</span>
                        </button>
                        <button className='p-3 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 hover:border-amber-500/30 transition-all flex flex-col items-center gap-2 group'>
                            <Upload size={20} className='text-emerald-400 group-hover:scale-110 transition-transform' />
                            <span className='text-[9px] font-bold text-slate-300'>YÜKLE</span>
                        </button>
                        <button className='p-3 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 hover:border-amber-500/30 transition-all flex flex-col items-center gap-2 group'>
                            <Activity size={20} className='text-rose-400 group-hover:scale-110 transition-transform' />
                            <span className='text-[9px] font-bold text-slate-300'>KAZA KAYDI</span>
                        </button>
                        <button 
                            onClick={() => onNavigate('templates', { category: 'Risk' })}
                            className='p-3 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 hover:border-amber-500/30 transition-all flex flex-col items-center gap-2 group'
                        >
                            <AlertTriangle size={20} className='text-yellow-400 group-hover:scale-110 transition-transform' />
                            <span className='text-[9px] font-bold text-slate-300'>RİSK ANALİZİ</span>
                        </button>
                    </div>
                </div>

                {/* 2. DÖKÜMAN ARŞİVİ (Document Archive) */}
                <div className='flex-1 min-h-[200px] bg-slate-800/30 rounded-2xl border border-white/5 p-4 flex flex-col overflow-hidden relative'>
                    <h3 className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2'>
                        <FolderOpen size={12} className='text-blue-400' />
                        DÖKÜMAN ARŞİVİ
                    </h3>
                    
                    <div className='flex-1 overflow-y-auto custom-scrollbar space-y-2 relative z-10'>
                        {/* Mock Archive Items */}
                        {['2025 İş Planları', 'Ocak Ayı Raporları', 'Taşeron Sözleşmeleri', 'Arşiv 2024', 'Eski Prosedürler'].map((folder, i) => (
                            <div key={i} className='flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors'>
                                <div className='w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors'>
                                    <Archive size={14} />
                                </div>
                                <div className='flex-1'>
                                    <div className='text-xs font-bold text-slate-300 group-hover:text-white'>{folder}</div>
                                    <div className='text-[9px] text-slate-500'>{Math.floor(Math.random() * 20) + 5} dosya</div>
                                </div>
                                <ChevronRight size={12} className='text-slate-600 group-hover:translate-x-1 transition-transform' />
                            </div>
                        ))}
                         
                         {/* Divider */}
                         <div className='h-px bg-white/5 my-2'></div>

                         {/* Recent Files */}
                         <div className='text-[9px] text-slate-500 font-bold mb-2'>SON DÖKÜMANLAR</div>
                         {['Risk Analizi v2.pdf', 'Sertifika_AhmetK.pdf'].map((file, i) => (
                            <div key={`file-${i}`} className='flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer opacity-70 hover:opacity-100'>
                                <FileText size={12} className='text-slate-400' />
                                <span className='text-[10px] text-slate-300 truncate'>{file}</span>
                            </div>
                         ))}
                    </div>

                    {/* Gradient Fade at bottom */}
                    <div className='absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none'></div>
                </div>

            </div>

        </div>

        {/* 4. FOOTER: PACKAGES (Row Layout - Restored) */}
        <div className='shrink-0 h-[140px] md:h-[160px] pb-2'>
            <div className='h-full grid grid-cols-1 md:grid-cols-3 gap-4'>
                {PLANS.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`
                            relative h-full rounded-2xl border bg-[#15171e]/90 p-4 flex flex-col justify-between group overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300
                            ${plan.popular ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-white/5 hover:border-white/20'}
                        `}
                    >
                        {/* Glow Effect */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${plan.color}-500/10 rounded-full blur-3xl group-hover:bg-${plan.color}-500/20 transition-colors`}></div>
                        
                        <div className='relative z-10 flex justify-between items-start'>
                            <div>
                                <h4 className={`text-sm font-black uppercase tracking-wider text-${plan.color}-500`}>{plan.name}</h4>
                                <div className='flex items-baseline gap-1 mt-1'>
                                    <span className='text-2xl font-black text-white tracking-tighter'>{plan.price}</span>
                                    <span className='text-[10px] text-slate-500 font-bold'>{plan.period}</span>
                                </div>
                            </div>
                            <div className={`w-8 h-8 rounded-full bg-${plan.color}-500/10 flex items-center justify-center text-${plan.color}-500 border border-${plan.color}-500/20`}>
                                {plan.popular ? <Star size={14} fill="currentColor" /> : <CheckCircle2 size={16} />}
                            </div>
                        </div>

                        <div className='relative z-10 mt-2'>
                             <div className='flex gap-2 text-[10px] text-slate-400 font-medium'>
                                <span>• {plan.limit} Döküman</span>
                                <span>• {plan.features[0]}</span>
                             </div>
                             <div className={`mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-${plan.color}-500 w-1/3 group-hover:w-full transition-all duration-700`}></div>
                             </div>
                        </div>

                        {plan.popular && (
                            <div className='absolute bottom-0 right-0 bg-amber-500 text-slate-900 text-[9px] font-black px-3 py-1 rounded-tl-lg'>
                                EN ÇOK TERCİH EDİLEN
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
