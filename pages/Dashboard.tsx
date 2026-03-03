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
  Award,
  FileText,
  BadgeCheck
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
    name: 'KÜÇÜK İŞLETME', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'text-purple-500',
    border: 'border-purple-500',
    docs: ['Günlük Kasa Raporu', 'Veresiye Defteri', 'Müşteri Sipariş Formu', 'Fiyat Teklif Şablonu']
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  return (
    <div className='h-screen w-screen overflow-hidden flex flex-col bg-titanium-brushed relative text-slate-200 font-sans'>
      
      {/* Ambient Lighting Layers */}
      <div className='absolute top-0 left-0 w-full h-[600px] bg-ambient-glow pointer-events-none z-0 mix-blend-soft-light opacity-60'></div>
      <div className='absolute -top-[20%] right-[10%] w-[800px] h-[800px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse'></div>
      <div className='absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0'></div>

      {/* Main Container */}
      <div className='flex-1 flex flex-col p-4 md:p-6 w-full max-w-[1920px] mx-auto z-10 h-full relative gap-5'>
        
        {/* 1. Header Area: Corporate & Clean */}
        <header className='shrink-0 flex items-center justify-between py-1 border-b border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent'>
            <div className='flex items-center gap-3'>
                 <div className='w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-400/30'>
                    <Shield size={24} className='text-[#0f1115]' />
                 </div>
                 <h1 className='text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 drop-shadow-sm flex flex-col leading-none'>
                    <span className='text-[10px] text-amber-500 font-black tracking-[0.3em] uppercase mb-0.5'>PREMIUM PANEL</span>
                    <span>YILLIK DOKÜMANLAR</span>
                 </h1>
            </div>
            
            <div className='hidden md:flex items-center gap-4'>
               <div className='px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse'></div>
                  <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>SİSTEM AKTİF</span>
               </div>
               <div className='text-right'>
                  <div className='text-xs text-slate-500 font-bold'>HOŞGELDİNİZ</div>
                  <div className='text-sm font-bold text-slate-300'>{user?.name || 'Kullanıcı'}</div>
               </div>
            </div>
        </header>

        {/* 2. Sectors Row: Jewel Effect Cards */}
        <div className='shrink-0 h-28 md:h-32 perspective-1000'>
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
                    relative rounded-xl cursor-pointer select-none h-full flex flex-col items-center justify-center
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    ${activeSector === sector.id ? 'card-jewel' : 'card-jewel-inactive'}
                    `}
                >   
                    {/* Inner texture and Shine */}
                    <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-10 mix-blend-overlay pointer-events-none'></div>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none'></div>
                    
                    {/* Icon Container */}
                    <div className={`mb-2 p-2.5 rounded-lg transition-transform duration-300 ${activeSector === sector.id ? 'scale-110 bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-[#2a2a2e] border border-white/10'}`}>
                        <sector.icon size={20} className={activeSector === sector.id ? 'text-[#0f1115]' : sector.color} />
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-widest text-center transition-colors ${activeSector === sector.id ? 'text-amber-100 text-gold-glow' : 'text-slate-400'}`}>
                        {sector.name}
                    </span>

                    {/* Active Sector Dropdown Preview (Overlay) */}
                    <div className={`
                    absolute inset-0 bg-[#0f1115]/95 backdrop-blur-xl flex flex-col justify-center p-3 border-l-2 border-amber-500 transition-all duration-300 z-30
                    ${activeSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                    `}>
                        <div className='text-[8px] text-amber-500 font-bold mb-1 uppercase tracking-widest'>HIZLI ERİŞİM</div>
                        <ul className='space-y-1 overflow-y-auto custom-scrollbar pr-1 max-h-full'>
                            {sector.docs.slice(0, 3).map((doc, idx) => (
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

        {/* 3. Main Content: Split Grid */}
        <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-5 overflow-hidden'>
            
            {/* Left Column: Documents List (Metallic) */}
            <div className='lg:col-span-3 panel-metallic animate-fade-in-up delay-100'>
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
                <div className='flex-1 overflow-y-auto custom-scrollbar bg-[#0f1115]/40 p-1'>
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
                        { title: 'Kaza Kök Neden Analizi', limit: 'SINIRSIZ', icon: AlertTriangle, color: 'text-red-500' }
                    ].map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => onNavigate('templates', { search: item.title })}
                            className='row-metallic my-0.5 rounded-sm'
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
            </div>

            {/* Right Column: Actions & Tools */}
            <div className='lg:col-span-1 flex flex-col gap-4 h-full overflow-hidden animate-fade-in-up delay-200'>
                 
                 {/* 1. Wax Seal Certificate Button */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className='btn-wax-seal group h-40 shrink-0 rounded-xl flex items-center justify-center relative'
                 > 
                     {/* Paper Texture Overlay */}
                     <div className='absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/aged-paper.png)] opacity-30 mix-blend-overlay z-0'></div>
                     <div className='absolute inset-0 bg-gradient-to-b from-amber-700/20 to-transparent z-0'></div>
                     
                     <div className='relative z-10 flex flex-col items-center gap-2'>
                        {/* The Wax Seal */}
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-[#78350f] shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center border-2 border-[#92400e] group-hover:scale-110 transition-transform duration-500'>
                            <Award size={32} className='text-amber-100 drop-shadow-md' />
                        </div>
                        <div className='text-center mt-1'>
                            <h3 className='text-lg font-black text-amber-100 text-emboss tracking-wide'>SERTİFİKA</h3>
                            <div className='text-[10px] text-amber-200 font-bold tracking-widest uppercase opacity-80'>OLUŞTURUCU</div>
                        </div>
                     </div>
                     
                     {/* Shine */}
                     <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-1000'></div>
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
                            className='btn-marble w-full p-4 rounded-lg flex items-center justify-between group'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='p-1.5 rounded bg-black/40 border border-white/5 shadow-inner group-hover:bg-white/10 transition-colors'>
                                    <btn.icon size={18} className={btn.color} />
                                </div>
                                <span className='text-xs font-bold text-slate-300 group-hover:text-white tracking-wide text-emboss'>{btn.title}</span>
                            </div>
                            <ChevronRight size={14} className='text-slate-600 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300' />
                        </button>
                    ))}
                 </div>
            </div>
        </div>

        {/* 4. Footer: Armor Plate Pricing */}
        <div className='shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 h-24 pb-1 animate-fade-in-up delay-300'>
            
            {/* Standard */}
            <div className='armor-plate-silver rounded-xl p-3 flex items-center justify-between relative group hover:brightness-110 transition-all cursor-pointer'>
                <div className='flex items-center gap-3 relative z-10'>
                     <div className='w-10 h-10 rounded-full bg-slate-700/50 border border-slate-500 flex items-center justify-center shadow-lg'>
                        <Shield size={20} className='text-slate-300' />
                     </div>
                     <div>
                        <div className='text-xs font-bold text-slate-400 uppercase tracking-wider'>GÜMÜŞ PAKET</div>
                        <div className='text-2xl font-black text-slate-200 tracking-tight'>100 ₺</div>
                     </div>
                </div>
            </div>

            {/* Gold (Premium Highlight) */}
            <div className='armor-plate-gold rounded-xl p-3 flex items-center justify-between relative group hover:-translate-y-1 transition-all cursor-pointer overflow-hidden'>
                {/* Shine Sweep */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent skew-x-12 animate-shine-sweep z-0 pointer-events-none'></div>
                
                <div className='absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-bl shadow-lg z-20 animate-pulse'>ÖNERİLEN</div>

                <div className='flex items-center gap-3 relative z-10'>
                     <div className='w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 border-2 border-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)]'>
                        <Star size={24} className='text-[#2a1205] drop-shadow-md' fill='currentColor' />
                     </div>
                     <div>
                        <div className='text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5'>ALTIN PAKET</div>
                        <div className='text-3xl font-black text-amber-100 tracking-tight text-gold-glow'>175 ₺</div>
                     </div>
                </div>
                <button className='relative z-10 bg-black/40 border border-amber-500/50 text-amber-400 text-[10px] font-black px-3 py-1.5 rounded hover:bg-amber-500 hover:text-black transition-colors'>
                    SATIN AL
                </button>
            </div>

            {/* Platinum */}
             <div className='relative rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-3 flex items-center justify-between group hover:border-blue-500/50 transition-all cursor-pointer shadow-lg'>
                <div className='flex items-center gap-3 relative z-10'>
                     <div className='w-10 h-10 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center shadow-lg'>
                        <Zap size={20} className='text-blue-400' />
                     </div>
                     <div>
                        <div className='text-xs font-bold text-blue-400 uppercase tracking-wider'>PLATİN</div>
                        <div className='flex items-baseline gap-2'>
                            <span className='text-sm line-through text-slate-500 font-bold'>350</span>
                            <span className='text-2xl font-black text-blue-100 tracking-tight'>250 ₺</span>
                        </div>
                     </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
