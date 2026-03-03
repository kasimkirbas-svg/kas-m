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
  ChevronUp,
  Search
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
    color: 'text-rose-600',
    docCount: 12
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'text-blue-600',
    docCount: 8
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'text-amber-600',
    docCount: 15
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'text-orange-600',
    docCount: 20
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'text-yellow-600',
    docCount: 10
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'text-emerald-600',
    docCount: 14
  },
  { 
    id: 'small_business', 
    name: 'KOBİ', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'text-purple-600',
    docCount: 6
  }
];

const PACKAGES = [
  {
    id: 'silver',
    name: 'GÜMÜŞ',
    price: '100 ₺',
    icon: Shield,
    color: 'bg-slate-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-300',
    features: ['10 Belge/Ay', 'Temel Destek', 'PDF İndirme']
  },
  {
    id: 'gold',
    name: 'ALTIN',
    price: '175 ₺',
    icon: Star,
    color: 'bg-gradient-to-br from-amber-100 to-orange-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-400',
    features: ['Sınırsız Belge', '7/24 Destek', 'Word & PDF', 'Özel Şablonlar'],
    recommended: true
  },
  {
    id: 'platinum',
    name: 'PLATİN',
    price: '250 ₺',
    icon: Zap,
    color: 'bg-slate-100',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-300',
    features: ['Her Şey Dahil', 'Öncelikli Sıra', 'API Erişimi']
  }
];

const DOCUMENTS = [
    { title: 'Risk Analiz Raporu', limit: '10 ADET / AY', icon: AlertTriangle, color: 'text-rose-500' },
    { title: 'Patlayıcıdan Korunma', limit: '10 ADET / AY', icon: Zap, color: 'text-amber-500' },
    { title: 'Yangından Korunma', limit: '10 ADET / AY', icon:  AlertTriangle, color: 'text-orange-500' },
    { title: 'Yüksekte Çalışma', limit: '10 ADET / AY', icon: HardHat, color: 'text-blue-500' },
    { title: 'Elektrik İşleri', limit: '200 ADET / AY', icon: Zap, color: 'text-yellow-500' },
    { title: 'İşe Başlama Eğitimi', limit: '200 ADET / AY', icon: FileCheck, color: 'text-emerald-500' },
    { title: 'Sertifika Oluşturma', limit: 'SINIRSIZ', icon: Award, color: 'text-amber-600' },
    { title: 'Personel Sağlık Formu', limit: 'SINIRSIZ', icon: Activity, color: 'text-rose-400' },
    { title: 'Matrix Risk Analizi', limit: 'SINIRSIZ', icon: ClipboardList, color: 'text-slate-500' },
    { title: 'Acil Durum Planı', limit: '5 ADET / AY', icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Topraklama Ölçümü', limit: '20 ADET / AY', icon: Zap, color: 'text-yellow-700' },
    { title: 'Kaza Analizi', limit: 'SINIRSIZ', icon: AlertTriangle, color: 'text-red-500' }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [showAllDocs, setShowAllDocs] = useState(false);

  return (
    <div className='h-screen w-screen overflow-hidden flex flex-col bg-[#f0f4f8] relative text-slate-800 font-sans selection:bg-orange-200'>
      
      {/* Background Ambience */}
      <div className='absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[120px] pointer-events-none'></div>

      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full relative gap-6'>
        
        {/* 1. Header: Centered & Clean */}
        <header className='shrink-0 relative flex items-center justify-center py-2'>
            {/* Left: User Info (Absolute) */}
            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center'>
                    <User className='text-slate-600' size={20} />
                </div>
                <div className='hidden md:block text-left'>
                    <div className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Hoşgeldiniz</div>
                    <div className='text-sm font-bold text-slate-800'>{user?.name || 'Misafir'}</div>
                </div>
            </div>

            {/* Center: Title */}
            <div className='flex flex-col items-center z-10'>
                 <div className='flex items-center gap-2 mb-1'>
                    <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
                    <span className='text-[10px] font-black tracking-[0.4em] text-orange-600 uppercase'>PREMIUM PANEL</span>
                    <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
                 </div>
                 <h1 className='text-3xl md:text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm flex items-center gap-3'>
                    YILLIK DOKÜMANLAR
                 </h1>
            </div>

            {/* Right: Search (Absolute) */}
            <div className='absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex'>
               <div className='relative group'>
                  <input 
                    type="text" 
                    placeholder="Doküman ara..." 
                    className='pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 transition-all group-hover:w-72'
                  />
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
               </div>
            </div>
        </header>

        {/* 2. Sectors: Vibrant Cards with Images */}
        <div className='shrink-0 h-32 md:h-36 perspective-1000'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 h-full'>
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => onNavigate('templates', { category: sector.id })}
                    className={`
                    relative rounded-2xl cursor-pointer select-none h-full flex flex-col items-center justify-center overflow-hidden shadow-lg transition-all duration-300 bg-white
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    hover:shadow-2xl hover:shadow-orange-500/20 group
                    `}
                >   
                    {/* Background Image with Overlay */}
                    <div 
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                        style={{ backgroundImage: `url(${sector.image})` }}
                    />
                    <div className={`absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors`}></div>
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent'></div>
                    
                    {/* Content */}
                    <div className='relative z-10 flex flex-col items-center mt-auto mb-4 w-full px-2'>
                        <div className={`p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors duration-300`}>
                            <sector.icon size={20} className='text-white' />
                        </div>
                        <span className='text-xs font-black text-white uppercase tracking-widest drop-shadow-md text-center'>{sector.name}</span>
                        
                        {/* Hover Details overlay */}
                        <div className={`
                            absolute bottom-full left-0 right-0 p-3 bg-white/95 backdrop-blur-xl rounded-t-xl text-center transform transition-all duration-300 shadow-xl
                            ${activeSector === sector.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
                        `}>
                             <div className={`text-xs font-bold ${sector.color} mb-1`}>{sector.docCount} Doküman</div>
                             <div className='h-0.5 w-8 bg-slate-200 mx-auto rounded-full'></div>
                        </div>
                    </div>
                </motion.div>
                ))}
            </div>
        </div>

        {/* 3. Main Content: Split Vertical Layout */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6'>
            
            {/* LEFT COLUMN: Pricing Packages (Dominant Visual) */}
            <div className='lg:col-span-7 flex flex-col gap-4 order-2 lg:order-1 h-full'>
                 <div className='flex items-center justify-between mb-2 shrink-0'>
                    <h2 className='text-lg font-bold text-slate-700 flex items-center gap-2'>
                        <Star className='text-orange-500 fill-orange-500' size={20} />
                        <span>PAKET SEÇENEKLERİ</span>
                    </h2>
                    <span className='text-xs font-semibold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100'>En İyi Fiyat Garantisi</span>
                 </div>
                 
                 <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch'>
                    {PACKAGES.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            whileHover={{ y: -8 }}
                            className={`
                                relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg
                                ${pkg.recommended 
                                    ? 'bg-gradient-to-br from-[#2a2a2e] to-[#1a1a1d] text-white shadow-xl scale-105 z-10 ring-4 ring-orange-500/20' 
                                    : 'bg-white text-slate-600 hover:shadow-xl border border-slate-100'}
                            `}
                        >
                            {pkg.recommended && (
                                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-pulse'>
                                    ÖNERİLEN
                                </div>
                            )}

                            <div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner ${pkg.recommended ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-100 text-slate-400'}`}>
                                    <pkg.icon />
                                </div>
                                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${pkg.recommended ? 'text-orange-100' : 'text-slate-400'}`}>{pkg.name}</h3>
                                <div className='flex items-baseline gap-1 mb-8'>
                                    <span className={`text-5xl font-black tracking-tight ${pkg.recommended ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>{pkg.price}</span>
                                    <span className={`text-xs font-bold ${pkg.recommended ? 'text-slate-400' : 'text-slate-400'}`}>/ YIL</span>
                                </div>
                                <ul className='space-y-4'>
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className='flex items-center gap-3 text-sm font-medium opacity-90'>
                                            <div className={`w-1.5 h-1.5 rounded-full ${pkg.recommended ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className={`
                                w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-colors mt-8
                                ${pkg.recommended 
                                    ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/30' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}
                            `}>
                                SEÇ
                            </button>
                        </motion.div>
                    ))}
                 </div>
            </div>

            {/* RIGHT COLUMN: Document List & Quick Actions */}
            <div className='lg:col-span-5 flex flex-col gap-4 h-full order-1 lg:order-2'>
                
                {/* Document List Card */}
                <div className={`
                    bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative z-20 flex-1
                    ${showAllDocs ? 'absolute inset-4 lg:inset-auto lg:fixed lg:right-6 lg:top-24 lg:bottom-6 lg:w-[400px] z-50 shadow-2xl ring-1000 ring-black/20' : ''}
                `}>
                    <div className='p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0'>
                         <h3 className='font-bold text-slate-700 flex items-center gap-2'>
                            <ClipboardList className='text-orange-500' size={18} />
                            HIZLI ERİŞİM
                         </h3>
                         <button 
                            onClick={() => setShowAllDocs(!showAllDocs)}
                            className='text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 hover:bg-indigo-100'
                        >
                            {showAllDocs ? 'LİSTEYİ KÜÇÜLT' : 'TÜMÜNÜ GÖR'}
                            {showAllDocs ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                        </button>
                    </div>

                    <div className='flex-1 overflow-y-auto custom-scrollbar p-2'>
                        {/* If not showing all, show only first 6 items */}
                        {(showAllDocs ? DOCUMENTS : DOCUMENTS.slice(0, 7)).map((item, i) => (
                            <div 
                                key={i}
                                onClick={() => onNavigate('templates', { search: item.title })}
                                className='group flex items-center justify-between p-3 mb-1 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors border border-transparent hover:border-indigo-100'
                            >
                                <div className='flex items-center gap-3'>
                                    <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all`}>
                                        <item.icon size={16} className={item.color} />
                                    </div>
                                    <div>
                                        <div className='text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors'>{item.title}</div>
                                        {showAllDocs && <div className='text-[9px] font-bold text-slate-400 mt-0.5'>{item.limit}</div>}
                                    </div>
                                </div>
                                {!showAllDocs && (
                                    <ChevronRight size={14} className='text-slate-300 group-hover:text-indigo-500' />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Access Footer Button inside the List Card when collapsed */}
                    <div className='p-3 border-t border-slate-100 bg-slate-50/30 shrink-0'>
                        <button 
                             onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                             className='w-full py-3 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-300 hover:shadow-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group'
                        >
                            <Award className='text-orange-400 group-hover:rotate-12 transition-transform' size={18} />
                            <span className='font-bold text-sm tracking-wide'>SERTİFİKA OLUŞTUR</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>

      </div>
      
      {/* Overlay Backdrop for expanded menu */}
      {showAllDocs && (
        <div 
            className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40' 
            onClick={() => setShowAllDocs(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
