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
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute top-[-100px] right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* 1. Header with Industrial HUD Look */}
      <div className="flex-none pt-6 pb-2 px-4 z-20 w-full relative shrink-0">
        <div className="max-w-[1920px] mx-auto bg-slate-900/40 border-y border-slate-700/50 backdrop-blur-sm relative">
            {/* Decorative Side Markers */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            
            <div className="flex flex-col items-center justify-center py-4 relative overflow-hidden">
                {/* Background Tech Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)] bg-[length:20px_100%]"></div>
                
                <h1 className="text-3xl md:text-4xl font-black text-center tracking-[0.15em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative z-10 font-sans">
                  YILLIK DOKÜMANLAR <span className="text-amber-500 mx-2">&</span> İŞ TAKİP PANELİ
                </h1>
                
                <div className="flex items-center gap-4 mt-2 relative z-10">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-500"></div>
                    <div className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.4em]">Integrated Management System V.3.0</div>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-500"></div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-5 gap-4 flex flex-col w-full max-w-[1920px] mx-auto z-10 overflow-hidden relative">
        
        {/* 2. Top Sectors Row - More Vivid & Stylized */}
        <div className="flex-none h-44 w-full overflow-x-auto custom-scrollbar pb-3">
            <div className="flex gap-4 h-full px-2 min-w-max">
            {sectors.map((sector) => (
                <div 
                    key={sector.id}
                    onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border border-slate-600 bg-slate-900 transition-all duration-300 w-36 md:w-56 h-full flex flex-col shrink-0 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/5`}
                >
                    {/* Vivid Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${sector.gradient} to-slate-900 opacity-90 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100`}></div>
                    
                    {/* Background Image */}
                    <img src={sector.image} alt={sector.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700" />
                    
                    {/* Top Stripe */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"></div>

                    {/* Content Container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-2">
                        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full border border-white/20 mb-2 group-hover:scale-110 transition-transform shadow-lg">
                            <sector.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-black text-sm md:text-base tracking-[0.1em] uppercase drop-shadow-md text-center">{sector.title}</h3>
                        <div className="h-[2px] w-8 bg-amber-500 mt-2"></div>
                    </div>
                </div>
            ))}
             {/* Create Certificate Tile - Matching Style */}
             <div 
                onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-blue-400 bg-blue-900 w-36 md:w-48 h-full flex flex-col shrink-0 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                
                <div className="absolute top-0 right-0 p-2 z-20">
                     <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider animate-pulse">Yeni</span>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-2">
                    <div className="bg-blue-500/30 p-3 rounded-full border border-blue-300/50 mb-2 group-hover:bg-blue-400/50 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-black text-sm tracking-wider uppercase text-center drop-shadow-md">SERTİFİKA<br/>OLUŞTUR</h3>
                </div>
            </div>
            </div>
        </div>

        {/* 3. Middle Section: Documents & Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
            
            {/* Documents Table - 9/12 Columns */}
            <div className="lg:col-span-9 bg-slate-900/60 border border-slate-700/50 rounded-lg shadow-2xl flex flex-col overflow-hidden h-full backdrop-blur-sm relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
                
                <div className="bg-slate-900/90 p-2 border-b border-slate-700/80 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3 px-2">
                         <div className="bg-slate-800 p-1.5 rounded border border-slate-600/50">
                            <FileText className="w-4 h-4 text-slate-300" />
                         </div>
                        <h2 className="font-bold text-slate-200 text-sm tracking-widest uppercase text-shadow-sm">DOKÜMANLAR LİSTESİ</h2>
                    </div>
                     <div className="flex items-center gap-4 bg-black/20 px-3 py-1 rounded border border-white/5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LİMİT DURUMU</span>
                        <span className="w-[1px] h-3 bg-slate-700"></span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ADET / AY</span>
                     </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/30 p-0 relative">
                    <div className="flex flex-col gap-[1px]">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex items-center px-4 py-3 cursor-pointer transition-all group hover:bg-slate-800/80 hover:pl-5 relative overflow-hidden bg-slate-900/40"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-500 transition-colors"></div>
                            
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`p-1.5 rounded bg-slate-900 border border-slate-700 shadow-sm shrink-0 group-hover:scale-110 transition-transform ${doc.color}`}>
                                    <doc.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{doc.name}</span>
                            </div>
                            
                            {/* Visual Bar for Limit */}
                            <div className="hidden md:flex flex-1 mx-4 items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                 <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-600 w-1/3 group-hover:bg-amber-500/50 transition-colors"></div>
                                 </div>
                            </div>

                            <div className="text-right shrink-0 min-w-[100px]">
                                <span className="text-xs font-black text-slate-500 group-hover:text-amber-500 transition-colors">{doc.limit}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - 3/12 Columns */}
            <div className="lg:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
                {/* Visual Menu List */}
                <div className="bg-slate-900/80 rounded-lg overflow-hidden flex flex-col shadow-lg border border-slate-700/50 backdrop-blur-sm">
                    {rightSideMenu.map((item, i) => (
                        <button key={i} onClick={() => onNavigate('templates', { category: item.label.split(' ')[1] || item.label })} className="flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-slate-800 border-b border-slate-700/50 last:border-0 transition-all group text-left relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-700 group-hover:bg-amber-500 transition-colors"></div>
                            <item.icon className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-100 uppercase tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Big Action Buttons - Enhanced */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 justify-center mb-1">
                        <div className="h-[1px] w-8 bg-amber-500/50"></div>
                        <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest text-shadow-sm">HIZLI İŞLEMLER</div>
                        <div className="h-[1px] w-8 bg-amber-500/50"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                        
                        <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-amber-500/50 shadow-lg group transition-all relative overflow-hidden">
                             <div className="bg-slate-950 p-2 rounded text-amber-500 border border-slate-700 group-hover:border-amber-500/50">
                                 <History className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-amber-200/70">YENİ KAYIT</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">TUTANAK TUT</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-emerald-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-emerald-500/50 shadow-lg group transition-all">
                              <div className="bg-slate-950 p-2 rounded text-emerald-500 border border-slate-700 group-hover:border-emerald-500/50">
                                 <Clock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-emerald-200/70">GÜNLÜK</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">RAPOR TUT</div>
                             </div>
                        </button>

                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-purple-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-purple-500/50 shadow-lg group transition-all">
                             <div className="bg-slate-950 p-2 rounded text-purple-500 border border-slate-700 group-hover:border-purple-500/50">
                                 <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-purple-200/70">ARŞİV</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">DOKÜMANLAR</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-rose-900/40 hover:to-slate-900 p-3 rounded border border-slate-600 hover:border-rose-500/50 shadow-lg group transition-all">
                              <div className="bg-slate-950 p-2 rounded text-rose-500 border border-slate-700 group-hover:border-rose-500/50">
                                 <Download className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                             </div>
                             <div className="text-left leading-none">
                                <div className="text-[9px] text-slate-400 font-bold tracking-wider group-hover:text-rose-200/70">ÇIKTI AL</div>
                                <div className="text-sm font-black text-slate-200 group-hover:text-white">PDF İNDİR/YAZDIR</div>
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
