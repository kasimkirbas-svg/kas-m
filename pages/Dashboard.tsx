import React, { useState } from 'react';
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
  ChevronUp
} from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';

interface DashboardProps {
  user: User;
  t: any;
  onNavigate: (view: string, params?: { category?: string, search?: string }) => void;
  onTemplateSelect: (template: DocumentTemplate | null) => void;
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
    color: 'text-rose-500',
    border: 'border-rose-500',
    docs: ['Üretim Takip Formu', 'Günlük Kalite Raporu', 'Makine Bakım Kartı', 'Vardiya Teslim Tutanağı']
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'text-blue-500',
    border: 'border-blue-500',
    docs: ['Personel Özlük Dosyası', 'Yıllık İzin Planı', 'Satın Alma Talep Formu', 'Masraf Bildirim Formu']
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'text-amber-500',
    border: 'border-amber-500', 
    docs: ['Günlük Ocak Raporu', 'Patlatma Tutanağı', 'Gaz Ölçüm Kayıtları', 'Havalandırma Raporu']
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'text-orange-500',
    border: 'border-orange-500',
    docs: ['Şantiye Günlük Defteri', 'İş İskelesi Kontrol', 'Beton Döküm Tutanağı', 'Hakediş İcmal Tablosu']
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'text-yellow-500',
    border: 'border-yellow-500',
    docs: ['Trafo Bakım Formu', 'Sayaç Okuma Listesi', 'Kesinti Bildirim Formu', 'İletim Hattı Kontrol']
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'text-emerald-500',
    border: 'border-emerald-500',
    docs: ['Laboratuvar Analiz Raporu', 'Kimyasal Stok Takip', 'MSDS Kontrol Formu', 'Atık Bertaraf Kaydı']
  },
  { 
    id: 'small_business', 
    name: 'KOBİ', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'text-purple-500',
    border: 'border-purple-500',
    docs: ['Günlük Kasa Raporu', 'Veresiye Defteri', 'Müşteri Sipariş Formu', 'Fiyat Teklif Şablonu']
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [isDocsExpanded, setIsDocsExpanded] = useState(false);

  return (
    <div className='h-screen w-screen overflow-hidden flex flex-col bg-[#0f172a] relative text-slate-200 font-sans selection:bg-amber-500/30'>
      
      {/* Background Ambience - Deep Space Feel */}
      <div className='absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/20 via-slate-900/50 to-[#0f172a] pointer-events-none z-0'></div>
      <div className='absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow'></div>
      <div className='absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none z-0'></div>
      <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.03] mix-blend-overlay pointer-events-none z-0'></div>

      {/* Main Container */}
      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full relative gap-5'>
        
        {/* 1. Header Area: CENTERED & LUXURY */}
        <header className='shrink-0 flex items-center justify-between py-2 relative'>
            
            {/* Left: User Welcome (Subtle) */}
            <div className='flex items-center gap-3 w-1/4'>
                 <div className='w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center shadow-lg'>
                    <div className='text-xs font-bold text-amber-500'>{user?.name?.charAt(0) || 'U'}</div>
                 </div>
                 <div className='hidden md:block'>
                    <div className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>HOŞGELDİNİZ</div>
                    <div className='text-sm font-bold text-slate-200'>{user?.name || 'Kullanıcı'}</div>
                 </div>
            </div>

            {/* CENTER: GRAND TITLE */}
            <div className='flex-1 flex flex-col items-center justify-center text-center'>
                 <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-3xl md:text-4xl font-black tracking-tight flex flex-col items-center relative'
                 >
                    <span className='bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-text-shimmer bg-[200%_auto]'>
                        YILLIK DOKÜMANLAR
                    </span>
                    <span className='text-[10px] md:text-xs text-slate-400 font-bold tracking-[0.4em] uppercase mt-1 opacity-70'>
                        PREMIUM İŞ TAKİP PANELİ
                    </span>
                 </motion.h1>
            </div>
            
            {/* Right: Empty for balance (status removed) */}
            <div className='w-1/4 flex justify-end'>
                {/* Optional: Add a subtle clock or date here later if needed */}
            </div>
        </header>

        {/* 2. Sectors Row: IMAGES RETURNED & GLOSSY */}
        <div className='shrink-0 h-32 md:h-36 perspective-1000'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 h-full'>
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-end overflow-hidden group
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    border border-white/5 bg-slate-800/50 shadow-lg hover:shadow-amber-500/20 transition-all duration-300
                    `}
                >   
                    {/* Background Image */}
                    <div 
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100'
                        style={{ backgroundImage: `url(${sector.image})` }}
                    />
                    
                    {/* Gradient Overlay for Readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity'></div>
                    
                    {/* Content */}
                    <div className='relative z-10 p-3 w-full flex flex-col items-center'>
                        <div className={`
                            mb-1 p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors duration-300
                            ${activeSector === sector.id ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}
                        `}>
                            <sector.icon size={18} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest text-center ${activeSector === sector.id ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'}`}>
                            {sector.name}
                        </span>
                    </div>

                    {/* Quick Access Menu (Overlay) */}
                    <AnimatePresence>
                        {activeSector === sector.id && (
                             <motion.div 
                                initial={{ opacity: 0, translateY: 10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0 }}
                                className='absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-20 flex flex-col p-3 border-t-2 border-amber-500'
                             >
                                <div className='text-[8px] text-amber-500 font-bold mb-2 uppercase tracking-widest'>HIZLI ERİŞİM</div>
                                <ul className='space-y-1.5 overflow-y-auto custom-scrollbar'>
                                    {sector.docs.slice(0, 3).map((doc, idx) => (
                                    <li 
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); onNavigate('templates', { search: doc }); }}
                                        className='flex items-center gap-2 text-[9px] text-slate-300 hover:text-amber-200 cursor-pointer'
                                    >
                                        <div className='w-1 h-1 rounded-full bg-amber-500'></div>
                                        <span className='truncate'>{doc}</span>
                                    </li>
                                    ))}
                                </ul>
                             </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                ))}
            </div>
        </div>

        {/* 3. Main Content: Split Grid */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-5 overflow-hidden'>
            
            {/* Left Column: Documents List (Restrained & Expandable) */}
            <div className='lg:col-span-3 flex flex-col gap-4 overflow-hidden'>
                
                {/* Metallic Panel Container */}
                <div className='panel-metallic flex flex-col relative overflow-hidden transition-all duration-500' style={{ maxHeight: isDocsExpanded ? '100%' : '350px' }}>
                    
                    {/* Header */}
                    <div className='px-5 py-3 bg-[#151518] border-b border-white/5 flex items-center justify-between shrink-0 shadow-lg relative z-20'>
                        <div className='flex items-center gap-3'>
                            <div className='w-1 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]'></div>
                            <span className='text-slate-200 font-bold text-sm tracking-widest uppercase text-emboss'>DOKÜMAN LİSTESİ</span>
                        </div>
                        <div className='flex items-center gap-4 text-[10px] font-bold text-slate-500 tracking-widest uppercase'>
                            <span>DURUM</span>
                            <span>ADET / LİMİT</span>
                        </div>
                    </div>
                    
                    {/* List Content */}
                    <div className='flex-1 overflow-y-auto custom-scrollbar bg-[#0f1115]/40 p-1 pb-12'>
                        {[
                            { title: 'Risk Analiz Raporu', limit: '10 ADET / AY', icon: AlertTriangle, color: 'text-rose-500' },
                            { title: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', icon: Zap, color: 'text-amber-500' },
                            { title: 'Yangından Korunma Dök.', limit: '10 ADET / AY', icon:  AlertTriangle, color: 'text-orange-500' },
                            { title: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', icon: HardHat, color: 'text-blue-400' },
                            { title: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', icon: Zap, color: 'text-yellow-500' },
                            { title: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', icon: FileCheck, color: 'text-emerald-500' },
                            { title: 'Sertifika Oluşturma', limit: 'SINIRSIZ', icon: Award, color: 'text-amber-400' },
                            { title: 'Personel Sağlık Formu', limit: 'SINIRSIZ', icon: Activity, color: 'text-rose-400' },
                            { title: 'Matrix Puanlama Risk Analizi', limit: 'SINIRSIZ', icon: ClipboardList, color: 'text-slate-400' },
                            { title: 'Acil Durum Eylem Planı', limit: '5 ADET / AY', icon: AlertTriangle, color: 'text-orange-500' },
                            { title: 'Topraklama Ölçüm Raporu', limit: '20 ADET / AY', icon: Zap, color: 'text-yellow-600' },
                            { title: 'Kaza Kök Neden Analizi', limit: 'SINIRSIZ', icon: AlertTriangle, color: 'text-red-500' },
                            { title: 'İş İzni Formu', limit: '50 ADET / AY', icon: FileCheck, color: 'text-emerald-400' },
                            { title: 'Ziyaretçi Kayıt Formu', limit: 'SINIRSIZ', icon: ClipboardList, color: 'text-slate-400' },
                        ].map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => onNavigate('templates', { search: item.title })}
                                className='row-metallic my-0.5 rounded-sm hover:translate-x-1 transition-transform cursor-pointer'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='p-1.5 w-9 h-9 flex items-center justify-center bg-[#1a1a1d] rounded border border-white/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] group-hover:border-amber-500/30 transition-colors'>
                                        <item.icon size={18} className={`${item.color} drop-shadow-md`} />
                                    </div>
                                    <span className='text-xs font-bold text-slate-300 uppercase tracking-tight group-hover:text-amber-100 transition-colors text-emboss'>{item.title}</span>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='w-2 h-2 rounded-full bg-emerald-500/50 shadow-inner'></div>
                                    <span className={`text-[10px] font-black tracking-widest ${item.limit === 'SINIRSIZ' ? 'text-amber-500 text-gold-glow' : 'text-slate-500'}`}>
                                        {item.limit}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fade Out & Expand Button (If Collapsed) */}
                    {!isDocsExpanded && (
                        <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0f1115] to-transparent pointer-events-none z-10 flex items-end justify-center pb-4'>
                             <button 
                                onClick={() => setIsDocsExpanded(true)}
                                className='pointer-events-auto bg-slate-800/80 backdrop-blur border border-white/10 text-xs font-bold text-slate-300 px-6 py-2 rounded-full hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all flex items-center gap-2 shadow-lg'
                             >
                                <span>TÜMÜNÜ GÖR / GENİŞLET</span>
                                <ChevronDown size={14} />
                             </button>
                        </div>
                    )}
                    
                    {/* Collagen Button (If Expanded) */}
                    {isDocsExpanded && (
                        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20'>
                             <button 
                                onClick={() => setIsDocsExpanded(false)}
                                className='bg-slate-800/80 backdrop-blur border border-white/10 text-xs font-bold text-slate-300 px-6 py-2 rounded-full hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all flex items-center gap-2 shadow-lg'
                             >
                                <span>LİSTEYİ DARALT</span>
                                <ChevronUp size={14} />
                             </button>
                        </div>
                    )}
                </div>

                {/* --- PRICING AREA (MOVED UP FOR VISIBILITY) --- */}
                {/* Now taking the remaining vertical space prominently */}
                <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[200px]'>
                    
                    {/* SILVER */}
                    <motion.div whileHover={{ y: -5 }} className='relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 flex flex-col justify-between overflow-hidden group hover:border-cyan-500/30 shadow-lg'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none'></div>
                        <div className='relative z-10'>
                             <div className='flex items-center gap-3 mb-4'>
                                <div className='w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600 shadow-inner group-hover:bg-cyan-900/30 group-hover:text-cyan-400 transition-colors'>
                                    <Shield size={24} className='text-slate-400 group-hover:text-cyan-400' />
                                </div>
                                <div>
                                    <div className='text-xs font-bold text-slate-500 uppercase tracking-widest'>BAŞLANGIÇ</div>
                                    <h3 className='text-lg font-black text-slate-200'>GÜMÜŞ PAKET</h3>
                                </div>
                             </div>
                             <div className='text-3xl font-black text-slate-200 mb-1'>100 ₺</div>
                             <div className='text-xs text-slate-500 font-medium'>Aylık makul limitler</div>
                        </div>
                        <button className='w-full mt-4 bg-slate-700 hover:bg-cyan-600 hover:text-white text-slate-300 font-bold py-3 rounded-lg transition-all shadow-lg border border-slate-600 hover:border-cyan-500'>
                            PAKETİ SEÇ
                        </button>
                    </motion.div>

                    {/* GOLD - HERO */}
                    <motion.div 
                        whileHover={{ scale: 1.02 }} 
                        className='relative rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 p-[1px] shadow-[0_0_40px_rgba(245,158,11,0.3)] z-10'
                    >
                        {/* Animated Glow Border */}
                        <div className='absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 opacity-50 blur-sm animate-pulse'></div>
                        
                        <div className='relative h-full bg-gradient-to-br from-[#1c1917] to-[#292524] rounded-2xl p-6 flex flex-col justify-between overflow-hidden'>
                             <div className='absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.05] animate-spin-slow pointer-events-none'></div>
                             <div className='absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black text-[10px] font-black px-4 py-1 rounded-bl-xl shadow-lg uppercase tracking-widest'>
                                EN ÇOK TERCİH EDİLEN
                             </div>

                             <div className='relative z-10 mt-2'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'>
                                        <Star size={28} className='text-amber-100 fill-amber-100' />
                                    </div>
                                    <div>
                                        <div className='text-xs font-bold text-amber-500 uppercase tracking-widest'>PROFESYONEL</div>
                                        <h3 className='text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-100'>ALTIN PAKET</h3>
                                    </div>
                                </div>
                                <div className='flex items-baseline gap-2 mb-2'>
                                    <div className='text-4xl font-black text-amber-500 text-shadow-glow'>175 ₺</div>
                                    <span className='text-sm text-amber-500/50 font-bold line-through'>250 ₺</span>
                                </div>
                                <div className='text-xs text-amber-200/70 font-medium'>Sınırsız doküman erişimi</div>
                             </div>
                             
                             <button className='relative group w-full mt-5 overflow-hidden rounded-lg font-bold py-4 text-sm transition-all shadow-[0_4px_14px_0_rgba(217,119,6,0.5)]'>
                                <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 group-hover:from-amber-400 group-hover:to-orange-500 transition-colors'></div>
                                <div className='absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 bg-white opacity-10 rounded-full transform rotate-45 translate-x-12 -translate-y-20 skew-x-12'></div>
                                <span className='relative text-black uppercase tracking-widest'>HEMEN SATIN AL</span>
                             </button>
                        </div>
                    </motion.div>

                    {/* PLATINUM */}
                    <motion.div whileHover={{ y: -5 }} className='relative rounded-2xl bg-gradient-to-br from-slate-900 to-[#1e1b4b] border border-indigo-900/50 p-6 flex flex-col justify-between overflow-hidden group hover:border-indigo-500/50 shadow-lg'>
                        <div className='absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none'></div>
                        <div className='relative z-10'>
                             <div className='flex items-center gap-3 mb-4'>
                                <div className='w-12 h-12 rounded-xl bg-indigo-900/50 flex items-center justify-center border border-indigo-500 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors'>
                                    <Zap size={24} className='text-indigo-400 group-hover:text-indigo-100' />
                                </div>
                                <div>
                                    <div className='text-xs font-bold text-indigo-400 uppercase tracking-widest'>KURUMSAL</div>
                                    <h3 className='text-lg font-black text-indigo-100'>PLATİN PAKET</h3>
                                </div>
                             </div>
                             <div className='text-3xl font-black text-indigo-200 mb-1'>250 ₺</div>
                             <div className='text-xs text-indigo-300/60 font-medium'>VIP destek & öncelikli sıra</div>
                        </div>
                        <button className='w-full mt-4 bg-[#312e81] hover:bg-indigo-600 text-indigo-200 hover:text-white font-bold py-3 rounded-lg transition-all shadow-lg border border-indigo-800 hover:border-indigo-400'>
                            PAKETİ SEÇ
                        </button>
                    </motion.div>

                </div>
            </div>

            {/* Right Column: Actions & Tools */}
            <div className='lg:col-span-1 flex flex-col gap-4 h-full overflow-hidden'>
                 
                 {/* 1. Wax Seal Certificate Button */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className='btn-wax-seal group h-48 shrink-0 rounded-xl flex items-center justify-center relative overflow-hidden ring-4 ring-amber-900/20'
                 > 
                     {/* Paper Texture Overlay */}
                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/aged-paper.png)] opacity-40 mix-blend-overlay z-0'></div>
                     <div className='absolute inset-0 bg-gradient-to-b from-[#451a03] via-[#78350f] to-[#451a03] z-0'></div>
                     <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0'></div>
                     
                     <div className='relative z-10 flex flex-col items-center gap-3'>
                        {/* The Wax Seal */}
                        <div className='w-20 h-20 rounded-full bg-gradient-to-br from-[#b45309] to-[#78350f] shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center border-4 border-[#78350f] group-hover:scale-110 transition-transform duration-500 relative'>
                            <div className='absolute inset-0 rounded-full border border-white/20'></div>
                            <Award size={40} className='text-amber-100 drop-shadow-md' />
                        </div>
                        <div className='text-center'>
                            <h3 className='text-xl font-black text-amber-100 text-emboss tracking-wide drop-shadow-lg'>SERTİFİKA</h3>
                            <div className='text-[10px] text-amber-200 font-bold tracking-[0.2em] uppercase opacity-70 mt-1'>OLUŞTURUCU</div>
                        </div>
                     </div>
                     
                     {/* Shine */}
                     <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-1000'></div>
                 </button>

                 {/* 2. Marble Action Buttons */}
                 <div className='flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar'>
                    <div className='flex items-center gap-2 mb-1 px-1'>
                         <div className='h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
                         <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>HIZLI İŞLEMLER</span>
                         <div className='h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
                    </div>

                    {[
                        { title: 'TUTANAK İŞLEMLERİ', icon: ClipboardList, color: 'text-amber-500' },
                        { title: 'GÜNLÜK RAPOR', icon: FileCheck, color: 'text-emerald-500' },
                        { title: 'ARŞİV & GEÇMİŞ', icon: Archive, color: 'text-purple-500' },
                        { title: 'PERSONEL LİSTESİ', icon: Wallet, color: 'text-blue-500' }
                    ].map((btn, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => onNavigate('templates')}
                            className='relative bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-slate-700/50 w-full p-4 rounded-xl flex items-center justify-between group hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='p-2 rounded-lg bg-black/40 border border-white/5 shadow-inner group-hover:bg-amber-500/10 transition-colors'>
                                    <btn.icon size={20} className={btn.color} />
                                </div>
                                <span className='text-xs font-bold text-slate-300 group-hover:text-white tracking-wide'>{btn.title}</span>
                            </div>
                            <ChevronRight size={16} className='text-slate-600 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300' />
                        </button>
                    ))}
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
