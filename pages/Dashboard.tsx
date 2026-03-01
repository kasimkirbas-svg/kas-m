import React from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame,
  FileCheck, ChevronDown, Calendar, Users, Stethoscope, Briefcase, Hammer
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

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, t, onNavigate 
}) => {
  const [hoveredSector, setHoveredSector] = React.useState<string | null>(null);

  const sectors = [
    { id: 'factory', title: 'FABRİKA', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', color: 'border-blue-500', gradient: 'from-blue-600', searchQuery: 'Üretim', icon: Factory },
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal', icon: Building2 },
    { id: 'mine', title: 'MADEN', image: 'https://images.unsplash.com/photo-1516937941344-00b4ec0c9038?auto=format&fit=crop&q=80&w=800', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden', icon: Construction },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat', icon: Construction },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji', icon: Zap },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya', icon: Beaker },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf', icon: Store }
  ];

  const Lightning = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const Helmet = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

  const defaultRightSideMenu = [
    { label: 'İş Eğitimleri', icon: FileCheck },
    { label: 'İş Belgeleri', icon: FileText },
    { label: 'İş Formları', icon: ClipboardList },
    { label: 'İş Evrakları', icon: FileInput },
    { label: 'İş Sertifikaları', icon: Award },
  ];

  const sectorMenus: Record<string, typeof defaultRightSideMenu> = {
    factory: [
      { label: 'Makine Bakım', icon: Construction },
      { label: 'Üretim Raporu', icon: ClipboardList },
      { label: 'Vardiya Listesi', icon: Clock },
      { label: 'Kalite Kontrol', icon: CheckCircle2 },
      { label: 'İSG Talimatları', icon: Shield },
    ],
    company: [
      { label: 'Personel Listesi', icon: Users },
      { label: 'Maaş Bordrosu', icon: FileText },
      { label: 'İzin Formları', icon: Calendar },
      { label: 'SGK Girişleri', icon: FileInput },
      { label: 'Duyurular', icon: AlertTriangle },
    ],
    mine: [
        { label: 'Patlatma Raporu', icon: Flame },
        { label: 'Gaz Ölçüm', icon: Activity },
        { label: 'Ocak Planı', icon: FileText },
        { label: 'Ekipman Takip', icon: Construction },
        { label: 'Acil Durum', icon: AlertTriangle },
    ],
    construction: [
        { label: 'Şantiye Defteri', icon: ClipboardList },
        { label: 'Hakediş Raporu', icon: FileText },
        { label: 'İş Güvenliği', icon: Helmet },
        { label: 'Malzeme Takip', icon: Store },
        { label: 'Proje Planı', icon: Calendar },
    ],
    energy: [
        { label: 'Trafo Bakım', icon: Zap },
        { label: 'Sayaç Okuma', icon: Activity },
        { label: 'Kesinti Raporu', icon: AlertTriangle },
        { label: 'Hat Kontrol', icon: Construction },
        { label: 'Enerji Analizi', icon: FileText },
    ],
    chemistry: [
        { label: 'MSDS Formları', icon: FileText },
        { label: 'Laboratuvar', icon: Beaker },
        { label: 'Atık Yönetimi', icon: AlertTriangle },
        { label: 'Stok Takip', icon: ClipboardList },
        { label: 'Kalite Analiz', icon: Activity },
    ],
    small_business: [
        { label: 'Cari Hesap', icon: FileText },
        { label: 'Stok Durumu', icon: Store },
        { label: 'Fatura Kes', icon: FileInput },
        { label: 'Personel', icon: Users },
        { label: 'Vergi Takip', icon: Calendar },
    ]
  };

  const currentRightSideMenu = defaultRightSideMenu;

  const documentList = [
    { icon: FileCheck, name: 'Risk Analiz Raporu', limit: '10 ADET / AY', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    { icon: AlertTriangle, name: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30' },
    { icon: Flame, name: 'Yangından Korunma Dök.', limit: '10 ADET / AY', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    { icon: Helmet, name: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', color: 'text-blue-300', bg: 'bg-blue-800/20', border: 'border-blue-400/30' },
    { icon: Lightning, name: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    { icon: FileText, name: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    { icon: Award, name: 'Sertifika Oluşturma', limit: '100 SINIRSIZ', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
    { icon: FileInput, name: 'Personel Sağlık Formu', limit: '100 SINIRSIZ', color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-500/30' },
    { icon: Activity, name: 'Matrix Puanlama Risk Analizi', limit: '100 SINIRSIZ', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/30' },
  ];

  return (
    <div className="h-full md:h-[calc(100vh-64px)] w-full bg-[#0f1115] text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 overflow-y-auto md:overflow-hidden relative custom-scrollbar">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute top-[-100px] right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* 1. Header with Industrial HUD Look */}
      <div className="flex-none pt-2 md:pt-8 pb-2 md:pb-4 px-2 md:px-4 z-20 w-full relative shrink-0">
        <div className="max-w-[1920px] mx-auto bg-slate-900/60 border border-slate-700/50 backdrop-blur-md relative rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Tech Decoration Lines - Hidden on Mobile */}
            <div className="hidden md:block absolute top-0 left-0 w-24 h-[1px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            <div className="hidden md:block absolute top-0 right-0 w-24 h-[1px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            <div className="hidden md:block absolute bottom-0 left-0 w-24 h-[1px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            <div className="hidden md:block absolute bottom-0 right-0 w-24 h-[1px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>

            <div className="flex flex-col items-center justify-center py-3 md:py-6 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                <h1 className="text-lg md:text-5xl font-black text-center tracking-[0.1em] md:tracking-[0.2em] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] relative z-10 font-sans uppercase px-2 leading-tight">
                  <span className="block text-amber-500 text-xs md:text-xl tracking-[0.3em] mb-1 md:mb-2 opacity-80">PANEL YÖNETİMİ</span>
                  YILLIK DOKÜMANLAR <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mx-2">&</span> 
                  <span className="block md:inline text-slate-300 md:text-white mt-1 md:mt-0">İŞ TAKİP SİSTEMİ</span>
                </h1>
                
                <div className="hidden md:flex items-center gap-6 mt-3 relative z-10 w-full justify-center opacity-80">
                    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    <div className="text-[10px] md:text-xs text-amber-500 font-mono font-bold uppercase tracking-[0.4em] text-shadow-sm flex gap-4">
                        <span>FABRİKA</span>
                        <span>ŞİRKET</span>
                        <span>MADEN</span>
                        <span>İNŞAAT</span>
                        <span>ENERJİ</span>
                        <span>KİMYA</span>
                        <span>ESNAF</span>
                    </div>
                    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 p-2 md:p-5 gap-3 md:gap-4 flex flex-col w-full max-w-[1920px] mx-auto z-10 md:overflow-hidden relative">
        
        {/* 2. Top Sectors Row - Highly Stylized Cards */}
        <div className="flex-none h-auto md:h-48 w-full pb-2 md:pb-4 pt-0 md:pt-2 px-0 md:px-2 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory scroll-pl-2">
            <div className="flex gap-3 md:gap-5 h-36 md:h-full w-max md:w-full px-2 md:px-0">
            {sectors.map((sector) => (
                <div 
                    key={sector.id}
                    onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                    onMouseEnter={() => setHoveredSector(sector.id)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`snap-center group relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl border border-slate-700/80 md:border-2 md:border-slate-700 bg-slate-900 transition-all duration-500 ease-out flex-col shrink-0 w-36 md:w-auto md:flex-1 md:hover:flex-[1.5] h-full flex hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] hover:border-amber-500/40 ring-1 ring-black/40 shadow-xl`}
                >
                    {/* Background Image - Full Color but Darkened */}
                    <div className="absolute inset-0">
                         <img src={sector.image} alt={sector.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.4] group-hover:blur-sm" />
                         <div className={`absolute inset-0 bg-gradient-to-t ${sector.gradient} to-transparent opacity-60 mix-blend-overlay group-hover:opacity-90 transition-opacity`}></div>
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 group-hover:via-black/60 group-hover:to-black"></div>
                    </div>
                    
                    {/* Top Status Indicators */}
                    <div className="absolute top-3 right-3 flex gap-1 z-20 group-hover:opacity-0 transition-opacity">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse"></div>
                    </div>

                    {/* Default Content - Fades Out on Hover */}
                    <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center z-20 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
                        <div className={`p-3 rounded-xl backdrop-blur-md mb-2 shadow-lg bg-white/10`}>
                            <sector.icon className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                        
                        <h3 className="text-white font-black text-sm md:text-lg tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center w-full pb-2 mb-2 transition-colors">
                            {sector.title}
                        </h3>
                    </div>

                    {/* Hover Content - Fades In */}
                    <div className="absolute inset-0 z-30 p-3 md:p-4 flex flex-col opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 mb-2 md:mb-3 border-b border-white/20 pb-2">
                             <sector.icon className="w-4 h-4 text-amber-500" />
                             <h3 className="text-white font-black text-xs md:text-sm tracking-wider uppercase">{sector.title} İŞLEMLERİ</h3>
                        </div>
                        <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                           {(sectorMenus[sector.id] || defaultRightSideMenu).map((item, idx) => (
                               <button 
                                   key={idx}
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       onNavigate('templates', { category: item.label.split(' ')[1] || item.label });
                                   }}
                                   className="flex items-center gap-2 p-1.5 md:p-2 rounded hover:bg-white/10 transition-colors text-left group/item"
                               >
                                   <div className="p-1 rounded bg-slate-800/50 group-hover/item:bg-amber-500/20 transition-colors">
                                       <item.icon className="w-3 h-3 text-slate-300 group-hover/item:text-amber-500" />
                                   </div>
                                   <span className="text-[10px] font-bold text-slate-300 group-hover/item:text-white uppercase tracking-tight">{item.label}</span>
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>

        {/* 3. Middle Section: Documents & Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 md:overflow-hidden h-auto md:h-full">
            
            {/* Documents Table - 9/12 Columns */}
            <div className="lg:col-span-9 bg-slate-900/60 border border-slate-700/50 rounded-lg shadow-2xl flex flex-col md:overflow-hidden h-[360px] md:h-full backdrop-blur-sm relative order-2 md:order-1">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
                
                <div className="bg-slate-900/90 p-3 md:p-2 border-b border-slate-700/80 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3 px-1 md:px-2">
                         <div className="bg-slate-800 p-1.5 rounded border border-slate-600/50">
                            <FileText className="w-4 h-4 text-slate-300" />
                         </div>
                        <h2 className="font-bold text-slate-200 text-xs md:text-sm tracking-widest uppercase text-shadow-sm">DOKÜMANLAR</h2>
                    </div>
                     <div className="flex items-center gap-4 bg-black/20 px-3 py-1 rounded border border-white/5">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse">CANLI SİSTEM</span>
                     </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/30 p-0 relative">
                    <div className="flex flex-col gap-[1px]">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex items-center px-4 py-3.5 md:py-3 cursor-pointer transition-all group hover:bg-slate-800/80 hover:pl-5 relative overflow-hidden bg-slate-900/40 active:bg-slate-800"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-amber-500 transition-colors"></div>
                            
                            <div className="flex items-center gap-3 md:gap-4 flex-1">
                                <div className={`p-1.5 md:p-1.5 rounded-lg md:rounded bg-slate-900 border border-slate-700 shadow-sm shrink-0 group-hover:scale-110 transition-transform ${doc.color}`}>
                                    <doc.icon className="w-4 h-4 md:w-4 md:h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors leading-tight">{doc.name}</span>
                                    <span className="text-[10px] text-slate-500 md:hidden mt-0.5">{doc.limit}</span>
                                </div>
                            </div>
                            
                            {/* Visual Bar for Limit */}
                            <div className="hidden md:flex flex-1 mx-4 items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                 <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-600 w-1/3 group-hover:bg-amber-500/50 transition-colors"></div>
                                 </div>
                            </div>

                            <div className="text-right shrink-0 min-w-[30px] md:min-w-[100px] flex items-center justify-end">
                                <span className="hidden md:inline text-xs font-black text-slate-500 group-hover:text-amber-500 transition-colors">{doc.limit}</span>
                                <ChevronDown className="w-4 h-4 text-slate-600 md:hidden -rotate-90 opacity-50" />
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - 3/12 Columns */}
            <div className="lg:col-span-3 flex flex-col gap-3 h-auto md:h-full overflow-hidden order-1 md:order-2">
                {/* Big Action Buttons - Enhanced */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center gap-2 justify-center mb-1">
                        <div className="h-[1px] w-8 bg-amber-500/50"></div>
                        <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest text-shadow-sm">HIZLI İŞLEMLER</div>
                        <div className="h-[1px] w-8 bg-amber-500/50"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 flex-1">

                        <button onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })} className="col-span-2 md:col-span-1 flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-blue-900/40 hover:to-slate-900 p-4 rounded-lg border border-slate-600 hover:border-blue-500/50 shadow-lg group transition-all relative overflow-hidden ring-1 ring-blue-500/20 h-full max-h-[140px]">
                             <div className="bg-slate-950 p-3 rounded text-blue-500 border border-slate-700 group-hover:border-blue-500/50 relative">
                                <div className="absolute inset-0 rounded border border-blue-400 opacity-50 animate-[ping_3s_infinite]"></div>
                                 <Award className="w-8 h-8 group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                             </div>
                             <div className="text-left leading-none flex-1">
                                <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-1">YENİ ÖZELLİK</div>
                                <div className="text-xl font-black text-white group-hover:text-blue-200 tracking-wide drop-shadow-md">SERTİFİKA OLUŞTUR</div>
                             </div>
                        </button>
                        
                        <div className="col-span-2 md:col-span-1 grid grid-cols-1 gap-2">
                        <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-amber-500/50 shadow-lg group transition-all relative overflow-hidden flex-1">
                             <div className="bg-slate-950 p-2 rounded text-amber-500 border border-slate-700 group-hover:border-amber-500/50">
                                 <History className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-amber-200/70">YENİ KAYIT</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">TUTANAK TUT</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-emerald-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-emerald-500/50 shadow-lg group transition-all flex-1">
                              <div className="bg-slate-950 p-2 rounded text-emerald-500 border border-slate-700 group-hover:border-emerald-500/50">
                                 <Clock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-emerald-200/70">GÜNLÜK</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">RAPOR TUT</div>
                             </div>
                        </button>

                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-purple-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-purple-500/50 shadow-lg group transition-all flex-1">
                             <div className="bg-slate-950 p-2 rounded text-purple-500 border border-slate-700 group-hover:border-purple-500/50">
                                 <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-purple-200/70">ARŞİV</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">DOKÜMANLAR</div>
                             </div>
                        </button>
                        </div>

                    </div>
                </div>

            </div>

            </div>

        </div>

        {/* 4. Bottom Pricing Row - Bigger & bolder */}
        <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pt-0 md:pt-2 pb-6 md:pb-2">
            
            {/* STANDARD */}
            <div className="relative group overflow-hidden rounded-xl border border-slate-600 bg-gradient-to-r md:bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-4 shadow-xl hover:border-slate-400 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex items-center justify-between relative z-10 w-full">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-slate-700/50 p-2 md:p-2.5 rounded-lg border border-slate-500/50">
                            <Shield className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                        </div>
                        <div>
                            <div className="font-black text-base md:text-lg text-slate-200 tracking-wide">STANDART</div>
                            <div className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-wider">Standart Limit</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                        <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">100 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-slate-700 hover:bg-slate-600 text-white text-[9px] md:text-[10px] font-bold px-3 py-1 rounded shadow-lg border border-slate-500 uppercase tracking-widest transition-colors">SATIN AL</button>
                    </div>
                </div>
            </div>

             {/* GOLD - The Hero Card */}
            <div className="relative group overflow-hidden rounded-xl border-2 border-amber-500/70 bg-gradient-to-r md:bg-gradient-to-b from-amber-950/40 via-amber-900/20 to-black p-4 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all cursor-pointer transform md:-translate-y-4 z-20 md:order-none -order-1">
                 <div className="absolute top-0 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto bg-amber-500 text-black text-[9px] md:text-[10px] font-black px-3 md:px-4 py-0.5 rounded-bl-lg md:rounded-b shadow z-20 tracking-widest uppercase">Önerilen</div>
                 {/* Internal Glow */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-50"></div>
                 
                 <div className="flex items-center justify-between relative z-10 mt-1 w-full">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-amber-500/20 p-2 md:p-2.5 rounded-lg border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Shield className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                        </div>
                        <div>
                            <div className="font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-wide drop-shadow-sm">GOLD</div>
                            <div className="text-[9px] md:text-[10px] text-amber-200/70 font-black uppercase tracking-wider">2 Kat Limit</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                        <span className="text-2xl md:text-3xl font-black text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">175 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-[10px] md:text-xs font-black px-4 md:px-6 py-1.5 rounded shadow-lg shadow-amber-900/20 border border-amber-400 uppercase tracking-widest transition-all hover:scale-105">SATIN AL</button>
                    </div>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="relative group overflow-hidden rounded-xl border border-purple-500/50 bg-gradient-to-r md:bg-gradient-to-b from-purple-950/40 via-purple-900/20 to-slate-950 p-4 shadow-xl hover:border-purple-400/70 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="flex items-center justify-between relative z-10 w-full">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-purple-900/40 p-2 md:p-2.5 rounded-lg border border-purple-500/40">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="font-black text-base md:text-lg text-purple-300 tracking-wide">PREMİUM</div>
                            <div className="text-[9px] md:text-[10px] text-purple-200/50 font-black uppercase tracking-wider">3 Kat Limit</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] md:text-xs text-slate-500 line-through decoration-red-500/50 font-bold">350 TL</span>
                        <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">250 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-purple-900/60 hover:bg-purple-800/60 text-purple-100 text-[9px] md:text-[10px] font-bold px-3 py-1 rounded shadow-lg border border-purple-500/30 uppercase tracking-widest transition-colors">SATIN AL</button>
                    </div>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
