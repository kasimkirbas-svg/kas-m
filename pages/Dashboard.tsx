import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Award
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
    color: 'bg-rose-600', 
    docs: ['Üretim Takip Formu', 'Günlük Kalite Raporu', 'Makine Bakım Kartı', 'Vardiya Teslim Tutanağı']
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'bg-blue-600', 
    docs: ['Personel Özlük Dosyası', 'Yıllık İzin Planı', 'Satın Alma Talep Formu', 'Masraf Bildirim Formu']
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'bg-amber-500', 
    docs: ['Günlük Ocak Raporu', 'Patlatma Tutanağı', 'Gaz Ölçüm Kayıtları', 'Havalandırma Raporu']
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'bg-orange-600', 
    docs: ['Şantiye Günlük Defteri', 'İş İskelesi Kontrol', 'Beton Döküm Tutanağı', 'Hakediş İcmal Tablosu']
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'bg-yellow-600', 
    docs: ['Trafo Bakım Formu', 'Sayaç Okuma Listesi', 'Kesinti Bildirim Formu', 'İletim Hattı Kontrol']
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'bg-emerald-600', 
    docs: ['Laboratuvar Analiz Raporu', 'Kimyasal Stok Takip', 'MSDS Kontrol Formu', 'Atık Bertaraf Kaydı']
  },
  { 
    id: 'small_business', 
    name: 'KÜÇÜK İŞLETME', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'bg-purple-600', 
    docs: ['Günlük Kasa Raporu', 'Veresiye Defteri', 'Müşteri Sipariş Formu', 'Fiyat Teklif Şablonu']
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  return (
    <div className='layout-wrapper'>
      
      {/* Ambient Light / Glow Effects */}
      <div className='absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0'></div>
      <div className='absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse'></div>

      {/* Main Container - Full Screen Flex Column */}
      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full relative overflow-hidden gap-4'>
        
        {/* 1. Header - Ultra Compact */}
        <div className='shrink-0 flex items-center justify-between'>
            <h1 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 tracking-wider uppercase drop-shadow-md flex items-center gap-2'>
              <span className='text-gold-gradient'>YILLIK</span> İŞ TAKİP PANELİ
            </h1>
            <div className='flex items-center gap-2 text-xs font-medium text-slate-400'>
               <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
               <span>Sistem Aktif</span>
            </div>
        </div>

        {/* 2. Sectors Row - Fixed Height */}
        <div className='shrink-0 h-32 md:h-36 perspective-1000'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 h-full'>
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 50 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer group select-none h-full shadow-lg
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    ${activeSector === sector.id 
                        ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] z-20 scale-105' 
                        : 'border-white/5 hover:border-white/20 opacity-80 hover:opacity-100'}
                    `}
                >
                    {/* Background Image */}
                    <div className='absolute inset-0 z-0'>
                        <img src={sector.image} alt={sector.name} className='w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500' />
                        <div className='absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/70 to-transparent'></div>
                        <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-br ${sector.color} mix-blend-overlay ${activeSector === sector.id ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}></div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 rotate-12 z-10 pointer-events-none'></div>

                    {/* Content */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center p-2 z-20'>
                        <div className={`mb-2 p-2.5 rounded-full bg-gradient-to-br from-[#2a2a2e] to-[#000] border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <sector.icon size={20} className='text-amber-100/90' />
                        </div>
                        <span className='font-black text-slate-200 text-[10px] md:text-[11px] uppercase tracking-widest text-center group-hover:text-amber-400 transition-colors'>
                            {sector.name}
                        </span>
                    </div>

                    {/* Hover List (Overlay) */}
                    <div className={`
                    absolute inset-0 bg-[#0f1115]/95 backdrop-blur-md flex flex-col justify-center p-3 border-l-2 ${sector.color} transition-all duration-300
                    ${activeSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                    `}>
                        <ul className='space-y-1 overflow-y-auto custom-scrollbar pr-1 max-h-full'>
                            {sector.docs.slice(0, 4).map((doc, idx) => (
                            <li 
                                key={idx} 
                                onClick={(e) => { e.stopPropagation(); onNavigate('templates', { search: doc }); }}
                                className='flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded group/item' 
                            >
                                <div className='w-1 h-1 rounded-full bg-amber-500 group-hover/item:scale-150 transition-transform shrink-0'></div>
                                <span className='text-[9px] text-slate-400 group-hover/item:text-slate-200 font-bold uppercase truncate'>{doc}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
                ))}
            </div>
        </div>

        {/* 3. Main Content Area - Auto Fill Height (Flex-1) */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden'>
            
            {/* Left: Documents List Panel */}
            <div className='lg:col-span-3 panel-premium flex flex-col h-full animate-fade-in-up delay-100'>
                 {/* Panel Header */}
                <div className='panel-header'>
                    <div className='flex items-center gap-2'>
                        <div className='w-1 h-4 bg-amber-500 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.5)]'></div>
                        <span className='text-slate-200 font-bold text-xs tracking-widest uppercase'>DÖKÜMANLAR</span>
                    </div>
                    <span className='text-slate-500 font-bold text-[10px] tracking-widest uppercase'>ADET / AY</span>
                </div>
                
                {/* Scrollable List */}
                <div className='flex-1 overflow-y-auto custom-scrollbar bg-[#0f1115]/30'>
                    {[
                        { title: 'Risk Analiz Raporu', limit: '10 ADET / AY', icon: AlertTriangle, color: 'text-blue-500' },
                        { title: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', icon: Zap, color: 'text-amber-500' },
                        { title: 'Yangından Korunma Dök.', limit: '10 ADET / AY', icon:  AlertTriangle, color: 'text-red-500' },
                        { title: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', icon: HardHat, color: 'text-blue-400' },
                        { title: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', icon: Zap, color: 'text-yellow-500' },
                        { title: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', icon: FileCheck, color: 'text-emerald-500' },
                        { title: 'Sertifika Oluşturma', limit: 'SINIRSIZ', icon: Award, color: 'text-amber-400' },
                        { title: 'Personel Sağlık Formu', limit: 'SINIRSIZ', icon: Activity, color: 'text-rose-500' },
                        { title: 'Matrix Puanlama Risk Analizi', limit: 'SINIRSIZ', icon: ClipboardList, color: 'text-slate-400' },
                        { title: 'Acil Durum Eylem Planı', limit: '5 ADET / AY', icon: AlertTriangle, color: 'text-orange-500' },
                        { title: 'Topraklama Ölçüm Raporu', limit: '20 ADET / AY', icon: Zap, color: 'text-yellow-600' }
                    ].map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => onNavigate('templates', { search: item.title })}
                            className='row-premium'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='p-1.5 w-8 h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 shadow-inner group-hover:border-white/20 transition-colors'>
                                    <item.icon size={16} className={`${item.color} drop-shadow-md`} />
                                </div>
                                <span className='text-xs font-bold text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors'>{item.title}</span>
                            </div>
                            <div>
                                <span className={`text-[10px] font-bold tracking-widest ${item.limit === 'SINIRSIZ' ? 'text-amber-500 drop-shadow-sm' : 'text-slate-600'}`}>
                                    {item.limit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Quick Actions Panel */}
            <div className='lg:col-span-1 flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar animate-fade-in-up delay-200'>
                 
                 {/* 1. Certificate Button (Premium Gold) */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className='relative h-32 shrink-0 rounded-xl overflow-hidden group border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.25)] active:scale-95 transition-all'
                 > 
                     {/* Dynamic Background */}
                     <div className='absolute inset-0 bg-gradient-to-br from-[#1a1a1d] via-[#2a2a30] to-[#1a1a1d] z-0'></div>
                     <div className='absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent'></div>
                     
                     {/* Shine Effect */}
                     <div className='btn-shine-effect'></div>

                     <div className='absolute top-2 right-2 bg-amber-500/90 text-[#0f1115] text-[9px] font-black px-2 py-0.5 rounded shadow z-20 animate-pulse'>POPÜLER</div>

                     <div className='relative z-10 flex flex-col justify-center h-full p-4 items-center text-center'>
                         <div className='mb-2 p-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full border border-amber-300/50 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform'>
                             <Award size={24} className='text-[#0f1115]' />
                         </div>
                         <h3 className='text-lg font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 leading-tight tracking-wide group-hover:text-white transition-colors'>SERTİFİKA<br/>OLUŞTUR</h3>
                     </div>
                 </button>

                 {/* 2. Secondary Actions */}
                 <div className='flex flex-col gap-2 flex-1'>
                    {[
                        { title: 'TUTANAK TUT', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                        { title: 'GÜNLÜK RAPOR', icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                        { title: 'ARŞİV', icon: Archive, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
                    ].map((action, idx) => (
                        <button 
                            key={idx}
                            onClick={() => onNavigate('templates')}
                            className='w-full p-2.5 rounded-lg bg-[#1c1c20]/60 border border-white/5 hover:bg-white/5 hover:border-white/10 group transition-all flex items-center gap-3 active:scale-95'
                        >
                            <div className={`p-1.5 rounded-md ${action.bg} ${action.border} border group-hover:scale-110 transition-transform`}>
                                <action.icon size={16} className={action.color} />
                            </div>
                            <span className='text-xs font-bold text-slate-300 group-hover:text-white tracking-wide'>{action.title}</span>
                            <ChevronRight className='ml-auto text-slate-600 group-hover:text-slate-400' size={14} />
                        </button>
                    ))}
                    
                    {/* PDF Download Button (Bottom of Actions) */}
                    <button className='mt-auto w-full p-2.5 rounded-lg bg-red-900/20 border border-red-500/20 hover:bg-red-900/40 group transition-all flex items-center justify-center gap-2 active:scale-95'>
                         <Download size={16} className='text-red-400 group-hover:text-red-300' />
                         <span className='text-xs font-black text-red-500 group-hover:text-red-400 tracking-wide'>PDF İNDİR</span>
                    </button>
                 </div>
            </div>
        </div>

        {/* 4. Pricing / Status - Compact Footer */}
        <div className='shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 h-24 md:h-28 overflow-hidden animate-fade-in-up delay-300'>
            {/* Standard */}
            <div className='panel-premium p-3 flex items-center justify-between group hover:border-slate-400/30 transition-colors'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-[#2a2a30] flex items-center justify-center shadow-inner'>
                        <Shield className='text-slate-400' size={18} />
                    </div>
                    <div>
                        <h3 className='text-sm font-black text-slate-300'>GÜMÜŞ</h3>
                        <div className='text-xs text-slate-500 font-bold'>Başlangıç</div>
                    </div>
                </div>
                <div className='text-right'>
                    <div className='text-lg font-black text-slate-200'>100 ₺</div>
                    <button className='text-[9px] font-black text-slate-400 border border-slate-600 px-2 py-0.5 rounded hover:text-white hover:border-white transition-colors'>SEÇ</button>
                </div>
            </div>

            {/* Gold (Highlighted) */}
            <div className='panel-premium p-3 flex items-center justify-between border-amber-500/30 bg-gradient-to-r from-amber-900/10 to-transparent group hover:border-amber-500/50 transition-colors relative overflow-hidden'>
                <div className='absolute top-0 right-0 bg-amber-500 text-[8px] text-black font-black px-1.5 py-0.5 rounded-bl'>ÖNERİLEN</div>
                <div className='flex items-center gap-3 relative z-10'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]'>
                        <Star className='text-black fill-black/20' size={18} />
                    </div>
                    <div>
                        <h3 className='text-sm font-black text-amber-100'>ALTIN</h3>
                        <div className='text-xs text-amber-500/80 font-bold uppercase'>Profesyonel</div>
                    </div>
                </div>
                <div className='text-right relative z-10'>
                    <div className='text-lg font-black text-amber-100 text-glow-gold'>175 ₺</div>
                    <button className='text-[9px] font-black text-amber-950 bg-amber-500 px-3 py-1 rounded shadow hover:scale-105 transition-transform'>ABONE OL</button>
                </div>
            </div>

             {/* Platinum */}
             <div className='panel-premium p-3 flex items-center justify-between group hover:border-blue-400/30 transition-colors'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-[#2a2a30] flex items-center justify-center shadow-inner'>
                        <Zap className='text-blue-400' size={18} />
                    </div>
                    <div>
                        <h3 className='text-sm font-black text-slate-200'>PLATİN</h3>
                        <div className='text-xs text-blue-400 font-bold'>Sınırsız</div>
                    </div>
                </div>
                <div className='text-right'>
                     <div className='flex items-center justify-end gap-1'>
                        <span className='text-[10px] line-through text-slate-600'>350</span>
                        <span className='text-lg font-black text-blue-100'>250 ₺</span>
                     </div>
                    <button className='text-[9px] font-black text-slate-400 border border-slate-600 px-2 py-0.5 rounded hover:text-white hover:border-white transition-colors'>SEÇ</button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
