import React from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame,
  FileCheck, ChevronDown
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
  const sectors = [
    { id: 'factory', title: 'FABRİKA', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', color: 'border-blue-500', gradient: 'from-blue-600', searchQuery: 'Üretim', icon: Factory },
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal', icon: Building2 },
    { id: 'mine', title: 'MADEN', image: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?auto=format&fit=crop&q=80&w=400', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden', icon: Construction },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat', icon: Construction },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=400', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji', icon: Zap },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya', icon: Beaker },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=400', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf', icon: Store }
  ];

  const Lightning = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const Helmet = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

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

  const rightSideMenu = [
    { label: 'İş Eğitimleri', icon: FileCheck },
    { label: 'İş Belgeleri', icon: FileText },
    { label: 'İş Ercrumlar', icon: ClipboardList },
    { label: 'İş Evrakları', icon: FileInput },
    { label: 'İş Sertifikaları', icon: Award },
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#0f1115] text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 overflow-hidden relative">
      
      {/* Background Ambience & Atmospheric Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Base Gradients */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-transparent"></div>
          
          {/* Main Glow Orbs */}
          <div className="absolute top-[-200px] left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[4s]"></div>
          <div className="absolute top-[-200px] right-1/4 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[7s]"></div>
          
          {/* Carbon Fiber Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>

          {/* Floating Particles / Sparkles - "Arkada parıltılar" */}
          <div className="absolute top-20 left-[10%] w-1 h-1 bg-white rounded-full blur-[1px] animate-[ping_3s_ease-in-out_infinite]"></div>
          <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-amber-400 rounded-full blur-[1px] animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/3 left-[15%] w-1 h-1 bg-blue-400 rounded-full blur-[0.5px] animate-[bounce_5s_infinite]"></div>
          <div className="absolute top-1/2 right-[5%] w-2 h-2 bg-white/20 rounded-full blur-[2px] animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute top-[15%] left-[50%] w-0.5 h-0.5 bg-white rounded-full animate-[pulse_2s_infinite]"></div>

          {/* Glowing Side Bars - "Yanlarda parıldayan çubuklar" */}
          {/* Left Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <div className="absolute left-0 top-1/4 h-1/2 w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent blur-[2px] opacity-70"></div>
          
          {/* Right Bar */}
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/50 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
          <div className="absolute right-0 top-1/4 h-1/2 w-[2px] bg-gradient-to-b from-transparent via-amber-400 to-transparent blur-[2px] opacity-70"></div>
      </div>

      {/* 1. Header with Cinematic Glow */}
      <div className="flex-none bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 py-5 shadow-2xl z-20 w-full px-4 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
        
        <h1 className="text-2xl md:text-3xl font-black text-center tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-lg relative z-10 truncate font-mono">
          YILLIK DOKÜMANLAR <span className="text-amber-500 glow-text">&</span> İŞ TAKİP PANELİ
        </h1>
        <div className="flex justify-center gap-6 mt-2 relative z-10">
             <div className="text-[10px] md:text-[11px] text-amber-500/80 uppercase tracking-[0.3em] font-bold text-shadow-sm">Fabrika • Şirket • Maden • İnşaat • Enerji • Kimya • Küçük İşletme</div>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-5 gap-4 flex flex-col w-full max-w-[1920px] mx-auto z-10 overflow-hidden relative">
        
        {/* 2. Top Sectors Row - Taller & More Immersive */}
        <div className="flex-none h-44 w-full overflow-x-auto custom-scrollbar pb-4 pt-2">
            <div className="flex gap-4 h-full px-2 min-w-max">
            {sectors.map((sector) => (
                <div 
                    key={sector.id}
                    onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 transition-all duration-500 w-36 md:w-60 h-full flex flex-col shrink-0 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:border-amber-400/60 ring-1 ring-white/5 active:scale-95`}
                >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] z-30 pointer-events-none"></div>

                    <div className="absolute inset-0 w-full h-full">
                         <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${sector.gradient} to-transparent z-20 shadow-[0_0_10px_currentColor]`}></div>
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/95 z-10 group-hover:via-slate-950/10 transition-all duration-500"></div>
                         <img src={sector.image} alt={sector.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 filter saturate-[0.5] group-hover:saturate-100" />
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full p-0 z-20">
                         <div className="bg-slate-950/80 backdrop-blur-md text-slate-100 text-[11px] uppercase font-black px-3 py-2 w-full text-center border-b border-white/10 tracking-[0.2em] shadow-lg group-hover:text-amber-400 transition-colors">
                            {sector.title}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-3 z-20 flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md group-hover:border-amber-500/60 group-hover:text-amber-400 transition-all shadow-black/50 shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="truncate tracking-wide">İş Analizi</span>
                        </div>
                    </div>
                </div>
            ))}
             {/* Create Certificate Tile - Styled to match */}
             <div 
                onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-900/30 to-slate-900/90 w-36 md:w-40 h-full flex flex-col shrink-0 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] items-center justify-center p-2 ring-1 ring-blue-400/10 active:scale-95 transition-all duration-300"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

                <span className="absolute top-2 right-2 z-10 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">YENİ</span>
                
                <div className="relative z-10 text-center flex flex-col items-center gap-3">
                    <div className="bg-blue-500/10 p-3.5 rounded-full border border-blue-400/40 group-hover:border-blue-400/80 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <Award className="w-9 h-9 text-blue-400 group-hover:text-blue-200" />
                    </div>
                    <div className="text-blue-100 font-black text-xs leading-none uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">SERTİFİKA<br/><span className="text-blue-300 text-[10px]">OLUŞTUR</span></div>
                </div>
            </div>
            </div>
        </div>

        {/* 3. Middle Section: Documents & Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
            
            {/* Documents Table - 9/12 Columns */}
            <div className="lg:col-span-9 bg-slate-900/80 border border-slate-700/60 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden h-full backdrop-blur-md relative group">
                {/* Tech Accents - Corners */}
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-amber-500/50"></div>
                <div className="absolute top-0 left-0 w-[1px] h-8 bg-amber-500/50"></div>
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-amber-500/50"></div>
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-amber-500/50"></div>
                <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-amber-500/50"></div>
                <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-amber-500/50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-amber-500/50"></div>
                <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-amber-500/50"></div>
                
                {/* Tech Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                
                <div className="bg-slate-950/80 p-3 border-b border-slate-700/80 flex justify-between items-center shadow-lg z-10 shrink-0 relative">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
                    <div className="flex items-center gap-4 px-2">
                         <div className="bg-slate-900 p-2 rounded-lg border border-slate-600/50 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <FileText className="w-5 h-5 text-amber-500" />
                         </div>
                         <div className="flex flex-col">
                            <h2 className="font-black text-slate-100 text-sm tracking-[0.2em] uppercase drop-shadow-md">DOKÜMANLAR LİSTESİ</h2>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Resmi Evrak Durumu</span>
                         </div>
                    </div>
                     <div className="flex items-center gap-4 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">LİMİT DURUMU</span>
                        <span className="w-[1px] h-3 bg-slate-700"></span>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">AKTİF</span>
                        </div>
                     </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/20 p-0 relative">
                    <div className="flex flex-col gap-[2px]">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex items-center px-4 py-3 cursor-pointer transition-all duration-300 group/item hover:bg-slate-800/90 relative overflow-hidden bg-slate-900/30 border-b border-slate-800/50 hover:border-amber-500/20"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-800 group-hover/item:bg-amber-500 transition-all duration-300 group-hover/item:shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-5 flex-1 relative z-10">
                                <div className={`p-2 rounded-lg bg-slate-950 border border-slate-700/50 shadow-lg shrink-0 group-hover/item:scale-110 transition-transform duration-300 ${doc.color} group-hover/item:ring-1 ring-white/10`}>
                                    <doc.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors tracking-wide block">{doc.name}</span>
                                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase group-hover/item:text-slate-400">VER. 2.4.1</span>
                                </div>
                            </div>
                            
                            {/* Visual Bar for Limit */}
                            <div className="hidden md:flex flex-1 mx-8 items-center gap-3 opacity-40 group-hover/item:opacity-100 transition-all">
                                 <span className="text-[9px] font-mono text-slate-600 w-8 text-right">0%</span>
                                 <div className="h-1.5 flex-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                    <div className="h-full bg-gradient-to-r from-slate-700 to-slate-500 w-1/3 group-hover/item:from-amber-600 group-hover/item:to-amber-400 transition-all duration-500 relative">
                                        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50"></div>
                                    </div>
                                 </div>
                                 <span className="text-[9px] font-mono text-slate-600 w-8">33%</span>
                            </div>

                            <div className="text-right shrink-0 min-w-[100px] relative z-10">
                                <span className="text-xs font-black text-slate-500 group-hover/item:text-amber-500 transition-colors bg-black/20 px-2 py-1 rounded border border-transparent group-hover/item:border-amber-500/20">{doc.limit}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - 3/12 Columns */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                {/* Visual Menu List */}
                <div className="bg-slate-900/80 rounded-xl overflow-hidden flex flex-col shadow-lg border border-slate-700/60 backdrop-blur-md relative h-1/2">
                     <div className="absolute top-0 right-0 w-8 h-[1px] bg-slate-500/30"></div>
                     <div className="absolute top-0 right-0 w-[1px] h-8 bg-slate-500/30"></div>
                     <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-slate-500/30"></div>
                     <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-slate-500/30"></div>

                     <div className="py-2 px-3 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">HIZLI MENÜ</span>
                     </div>

                    {rightSideMenu.map((item, i) => (
                        <button key={i} onClick={() => onNavigate('templates', { category: item.label.split(' ')[1] || item.label })} className="flex items-center gap-4 px-4 py-3.5 bg-transparent hover:bg-slate-800/80 border-b border-slate-700/40 last:border-0 transition-all group text-left relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-800 group-hover:bg-amber-500 transition-all duration-300"></div>
                             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                             
                            <div className="p-1.5 rounded bg-slate-950 border border-slate-800 group-hover:border-amber-500/30 transition-colors shadow-sm">
                                <item.icon className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-amber-100 uppercase tracking-wider transition-colors">{item.label}</span>
                            <ChevronDown className="w-3 h-3 ml-auto text-slate-700 group-hover:text-amber-500/50 -rotate-90 group-hover:rotate-0 transition-transform" />
                        </button>
                    ))}
                </div>

                {/* Big Action Buttons - Enhanced */}
                <div className="flex flex-col gap-2 mt-auto h-1/2 justify-end">
                    <div className="flex items-center gap-2 justify-center mb-1 opacity-70">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                        <div className="text-amber-500/80 text-[9px] font-black uppercase tracking-[0.3em] text-shadow-sm">İŞLEM MERKEZİ</div>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent via-amber-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                        
                        <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-amber-950/30 hover:via-amber-900/20 hover:to-slate-900 p-3 rounded-lg border border-slate-700/60 hover:border-amber-500/40 shadow-lg group transition-all relative overflow-hidden group hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                             <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-600/0 group-hover:bg-amber-500 h-0 group-hover:h-full transition-all duration-500"></div>
                             <div className="bg-slate-950 p-2.5 rounded border border-slate-700 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-colors">
                                 <History className="w-5 h-5 text-amber-600 group-hover:text-amber-400 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase group-hover:text-amber-400/80 transition-colors">YENİ KAYIT</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white mt-0.5 tracking-wide">TUTANAK TUT</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-emerald-950/30 hover:via-emerald-900/20 hover:to-slate-900 p-3 rounded-lg border border-slate-700/60 hover:border-emerald-500/40 shadow-lg group transition-all relative overflow-hidden group hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-600/0 group-hover:bg-emerald-500 h-0 group-hover:h-full transition-all duration-500"></div>
                              <div className="bg-slate-950 p-2.5 rounded border border-slate-700 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors">
                                 <Clock className="w-5 h-5 text-emerald-600 group-hover:text-emerald-400 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase group-hover:text-emerald-400/80 transition-colors">GÜNLÜK</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white mt-0.5 tracking-wide">RAPOR TUT</div>
                             </div>
                        </button>

                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-purple-950/30 hover:via-purple-900/20 hover:to-slate-900 p-3 rounded-lg border border-slate-700/60 hover:border-purple-500/40 shadow-lg group transition-all relative overflow-hidden group hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                             <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-600/0 group-hover:bg-purple-500 h-0 group-hover:h-full transition-all duration-500"></div>
                             <div className="bg-slate-950 p-2.5 rounded border border-slate-700 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors">
                                 <FileText className="w-5 h-5 text-purple-600 group-hover:text-purple-400 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase group-hover:text-purple-400/80 transition-colors">ARŞİV</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white mt-0.5 tracking-wide">DOKÜMANLAR</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-rose-950/30 hover:via-rose-900/20 hover:to-slate-900 p-3 rounded-lg border border-slate-700/60 hover:border-rose-500/40 shadow-lg group transition-all relative overflow-hidden group hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-rose-600/0 group-hover:bg-rose-500 h-0 group-hover:h-full transition-all duration-500"></div>
                              <div className="bg-slate-950 p-2.5 rounded border border-slate-700 group-hover:border-rose-500/30 group-hover:bg-rose-500/10 transition-colors">
                                 <Download className="w-5 h-5 text-rose-600 group-hover:text-rose-400 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase group-hover:text-rose-400/80 transition-colors">ÇIKTI AL</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white mt-0.5 tracking-wide">PDF İNDİR/YAZDIR</div>
                             </div>
                        </button>

                    </div>
                </div>

            </div>

        </div>

        {/* 4. Bottom Pricing Row - Bigger & bolder */}
        <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-2">
            
            {/* STANDARD */}
            <div className="relative group overflow-hidden rounded-xl border border-slate-600 bg-gradient-to-b from-slate-800 to-slate-950 p-4 shadow-xl hover:border-slate-400 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="bg-slate-700/50 p-2.5 rounded-lg border border-slate-500/50">
                            <Shield className="w-6 h-6 text-slate-300" />
                        </div>
                        <div>
                            <div className="font-black text-lg text-slate-200 tracking-wide">STANDART</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Standart Doküman Limiti</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-white drop-shadow-md">100 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg border border-slate-500 uppercase tracking-widest transition-colors">SATIN AL</button>
                    </div>
                </div>
            </div>

             {/* GOLD - The Hero Card */}
            <div className="relative group overflow-hidden rounded-xl border-2 border-amber-500/70 bg-gradient-to-b from-amber-950/40 to-black p-4 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all cursor-pointer transform md:-translate-y-4 z-20">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-4 py-0.5 rounded-b shadow z-20 tracking-widest uppercase">Önerilen</div>
                 {/* Internal Glow */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-50"></div>
                 
                 <div className="flex items-center justify-between relative z-10 mt-1">
                     <div className="flex items-center gap-4">
                        <div className="bg-amber-500/20 p-2.5 rounded-lg border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Shield className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <div className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-wide drop-shadow-sm">GOLD</div>
                            <div className="text-[10px] text-amber-200/70 font-black uppercase tracking-wider">2 Kat Doküman Limiti</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                        <span className="text-3xl font-black text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">175 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-black px-6 py-1.5 rounded shadow-lg shadow-amber-900/20 border border-amber-400 uppercase tracking-widest transition-all hover:scale-105">SATIN AL</button>
                    </div>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="relative group overflow-hidden rounded-xl border border-purple-500/50 bg-gradient-to-b from-purple-950/40 to-slate-950 p-4 shadow-xl hover:border-purple-400/70 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="bg-purple-900/40 p-2.5 rounded-lg border border-purple-500/40">
                            <CheckCircle2 className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="font-black text-lg text-purple-300 tracking-wide">PREMİUM</div>
                            <div className="text-[10px] text-purple-200/50 font-black uppercase tracking-wider">3 Kat Doküman Limiti</div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                         <span className="text-xs text-slate-500 line-through decoration-red-500/50 font-bold">350 TL</span>
                        <span className="text-2xl font-black text-white drop-shadow-md">250 TL</span>
                        <button onClick={() => onNavigate('subscription')} className="mt-1 bg-purple-900/60 hover:bg-purple-800/60 text-purple-100 text-[10px] font-bold px-3 py-1 rounded shadow-lg border border-purple-500/30 uppercase tracking-widest transition-colors">SATIN AL</button>
                    </div>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
