import React, { useState, useEffect } from 'react';
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
  ClipboardList,
  Archive,
  Download,
  Shield,
  Star,
  Activity,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  ArrowRight
} from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';

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

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onTemplateSelect, templates }) => {
  const [activeSectorId, setActiveSectorId] = useState<string>('factory'); // Default to factory
  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);

  // The simplified top-left requires just the logo
  // The document list should show 10 items for the selected sector
  // Clicking a document should open the editor
  
  const currentSectorId = hoveredSectorId || activeSectorId;
  const currentSector = SECTORS.find(s => s.id === currentSectorId) || SECTORS[0];

  const handleDocumentClick = (docName: string) => {
    // 1. Try to find a real template that matches this name
    const existingTemplate = templates.find(t => t.title.toLowerCase().includes(docName.toLowerCase()));

    if (existingTemplate) {
        onTemplateSelect(existingTemplate);
    } else {
        // 2. Determine category based on current sector
        let category = 'safety'; // default
        if (currentSector.id === 'factory') category = 'production';
        if (currentSector.id === 'company') category = 'hr';
        // ... simplistic mapping

        // 3. Create a temporary template object to pass to the editor
        // This simulates "Loading" this dynamic template
        const newTemplate: DocumentTemplate = {
            id: 'dynamic-' + Math.random().toString(36).substr(2, 9),
            title: docName,
            category: category,
            description: `${currentSector.name} sektörü için ${docName} şablonu.`,
            isPro: false,
            createdAt: new Date().toISOString(),
            content: [], // Start empty or with default fields
            tags: [currentSector.id, 'form']
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
                    <span className='text-xl font-black text-slate-100 tracking-tighter leading-none'>KAS-M</span>
                    <span className='text-[10px] bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-bold tracking-[0.2em]'>OSGB</span>
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
        <div className='shrink-0 h-36 md:h-40 perspective-1000'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 h-full'>
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => {
                        setHoveredSectorId(sector.id);
                        setActiveSectorId(sector.id);
                    }}
                    onMouseLeave={() => setHoveredSectorId(null)}
                    onClick={() => setActiveSectorId(sector.id)}
                    className={`
                    relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-end overflow-hidden group
                    border transition-all duration-500
                    ${activeSectorId === sector.id ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-white/5 shadow-lg bg-slate-800/40'}
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    `}
                >   
                    {/* Background Image */}
                    <div 
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                        style={{ backgroundImage: `url(${sector.image})` }}
                    >
                        <div className={`absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors duration-300 ${activeSectorId === sector.id ? 'bg-slate-900/30' : ''}`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-t ${sector.color} mix-blend-overlay opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                        <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90'></div>
                    </div>
                    
                    {/* Content */}
                    <div className='relative z-10 p-4 w-full flex flex-col items-center group-hover:-translate-y-1 transition-transform'>
                        <div className={`
                            mb-2 p-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg
                            ${activeSectorId === sector.id ? 'bg-amber-500 text-slate-900 scale-110 rotate-3' : 'bg-white/10 text-white group-hover:bg-white/20'}
                        `}>
                            <sector.icon size={20} className="drop-shadow-sm" />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest text-center transition-colors duration-300 ${activeSectorId === sector.id ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'}`}>
                            {sector.name}
                        </span>
                        
                        {/* Hover Indicator */}
                        <div className={`h-0.5 w-8 mt-2 rounded-full transition-all duration-300 ${activeSectorId === sector.id ? 'bg-amber-500 w-12' : 'bg-transparent group-hover:bg-white/50'}`}></div>
                    </div>
                </motion.div>
                ))}
            </div>
        </div>

        {/* 3. Main Content: Dynamic Document List + Info/Ads */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-5 overflow-hidden pb-2'>
            
            {/* LEFT: Dynamic Document List for Selected Sector */}
            <div className='lg:col-span-2 flex flex-col h-full bg-[#15171e]/80 backdrop-blur-sm rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl'>
                
                {/* Panel Header */}
                <div className='p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center '>
                            <currentSector.icon className={currentSector.accent} size={24} />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-white tracking-tight flex items-center gap-2'>
                                {currentSector.name} <span className='text-slate-500 font-normal'>DOKÜMANLARI</span>
                            </h2>
                            <p className='text-xs text-slate-400 font-medium mt-0.5 tracking-wide'>
                                Bu sektör için önerilen {currentSector.docs.length} adet doküman şablonu bulundu.
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button className='p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white'>
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* List Body */}
                <div className='flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2'>
                    <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentSector.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            {currentSector.docs.map((doc, idx) => (
                                <div 
                                    key={`${currentSector.id}-${idx}`}
                                    onClick={() => handleDocumentClick(doc)}
                                    className='group flex items-center gap-4 p-3 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/60 hover:border-amber-500/30 transition-all cursor-pointer relative overflow-hidden'
                                >
                                    <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent group-hover:via-amber-500 transition-colors'></div>
                                    
                                    <div className='w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                        <FileText size={18} className='text-slate-400 group-hover:text-amber-400 transition-colors' />
                                    </div>
                                    
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-sm font-bold text-slate-200 truncate group-hover:text-amber-100 transition-colors'>{doc}</h3>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <span className='text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded bg-slate-900/50 uppercase tracking-wider'>ŞABLON</span>
                                            <span className='text-[10px] text-emerald-500/80 font-medium flex items-center gap-1'>
                                                <Star size={8} fill='currentColor' /> POPÜLER
                                            </span>
                                        </div>
                                    </div>

                                    <div className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all'>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT: Quick Access / Subscription / Stats */}
            <div className='flex flex-col gap-4'>
                
                {/* Subscription Promo */}
                <div className='rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-lg shadow-orange-500/10 relative overflow-hidden group cursor-pointer'>
                    <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)] opacity-10 mix-blend-overlay'></div>
                    <div className='bg-[#0f1115] rounded-xl h-full p-5 relative z-10 flex flex-col items-center text-center overflow-hidden'>
                        <div className='absolute top-0 right-0 p-3 opacity-10'>
                            <Award size={100} />
                        </div>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow shadow-orange-500/40'>
                            <Star className='text-slate-900' fill='currentColor' size={24} />
                        </div>
                        <h3 className='text-lg font-black text-white italic tracking-tight uppercase'>PREMIUM'A GEÇİN</h3>
                        <p className='text-xs text-slate-400 mt-2 leading-relaxed'>
                            Sınırsız doküman oluşturma, yapay zeka desteği ve tüm sektörlere erişim hakkı kazanın.
                        </p>
                        <button className='mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-orange-500/20'>
                            PAKETLERİ İNCELE
                        </button>
                    </div>
                </div>

                {/* Recent Activity or Stats */}
                <div className='flex-1 rounded-2xl bg-slate-800/20 border border-white/5 p-5 relative overflow-hidden'>
                    <h3 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                        <Activity size={14} className='text-emerald-500' />
                        SİSTEM DURUMU
                    </h3>
                    
                    <div className='space-y-4'>
                        <div className='bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-white/5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500'>
                                    <Archive size={16} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-xs font-bold text-slate-300'>Toplam Şablon</span>
                                    <span className='text-[10px] text-slate-500'>Tüm Sektörler</span>
                                </div>
                            </div>
                            <span className='text-lg font-black text-white'>142</span>
                        </div>

                        <div className='bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-white/5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500'>
                                    <Download size={16} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-xs font-bold text-slate-300'>İndirilenler</span>
                                    <span className='text-[10px] text-slate-500'>Bu Ay</span>
                                </div>
                            </div>
                            <span className='text-lg font-black text-white'>1.2k</span>
                        </div>
                    </div>

                    <div className='mt-6 pt-4 border-t border-white/5'>
                         <p className='text-[10px] text-slate-500 text-center'>
                            Sistem v3.2.0 • Son Güncelleme: Bugün
                         </p>
                    </div>
                </div>

            </div>

        </div>

      </div>
    </div>
  );
};
