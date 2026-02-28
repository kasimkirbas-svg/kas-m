import React from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame,
  FileCheck, ChevronDown, ChevronUp
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
  const [isDocListExpanded, setIsDocListExpanded] = React.useState(false);

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
    <div className="h-[calc(100vh-64px)] w-full bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 overflow-hidden">
      
      {/* 1. COMPACT HEADER SECTION */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 py-3 shadow-lg z-20 w-full px-4 relative overflow-hidden shrink-0">
        <h1 className="text-xl md:text-2xl font-black text-center tracking-[0.2em] bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase drop-shadow-sm relative z-10 truncate">
          YILLIK DOKÜMANLAR <span className="text-amber-500">&</span> İŞ TAKİP
        </h1>
      </div>

      <div className="flex-1 p-2 md:p-3 gap-3 flex flex-col w-full max-w-[1920px] mx-auto z-10 overflow-hidden">
        
        {/* 2. SECTORS STRIP - Horizontal Scroll */}
        <div className="flex-none h-24 md:h-32 w-full overflow-x-auto custom-scrollbar pb-1">
            <div className="flex gap-2 h-full px-1 min-w-max">
            {sectors.map((sector) => (
                <div 
                    key={sector.id}
                    onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 w-28 md:w-48 h-full flex flex-col shrink-0 hover:w-36 md:hover:w-56 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]`}
                >
                    <div className="absolute inset-0 w-full h-full">
                         <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent z-20`}></div>
                         <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply"></div>
                         <img src={sector.image} alt={sector.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex flex-col items-center justify-end h-1/2">
                         <span className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 rounded bg-black/40 border border-white/10 backdrop-blur-sm uppercase tracking-wider group-hover:text-amber-400 group-hover:border-amber-500/50 transition-colors">
                            {sector.title}
                        </span>
                    </div>
                </div>
            ))}
            </div>
        </div>

        {/* 3. MAIN DASHBOARD GRID */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
            
            {/* LEFT: Documents List */}
            <div className={`lg:col-span-4 bg-slate-900/50 border border-slate-800/60 rounded-xl backdrop-blur-sm shadow-xl flex flex-col overflow-hidden h-full relative ring-1 ring-white/5`}>
                <div className="bg-slate-950/90 p-2.5 border-b border-slate-800 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <h2 className="font-bold text-slate-200 text-xs tracking-widest uppercase">DOKÜMANLAR</h2>
                    </div>
                     <span className="text-[9px] text-amber-500/70 font-bold border border-amber-500/20 px-2 py-0.5 rounded bg-amber-500/5">LİMİTLİ</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-black/20">
                    <div className="flex flex-col gap-1.5">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex items-center p-2 hover:bg-slate-800/60 cursor-pointer transition-colors group rounded-md border border-slate-800/40 hover:border-amber-500/30 gap-2.5"
                        >
                            <div className={`p-1.5 rounded bg-slate-900/80 border border-slate-700/50 shrink-0 ${doc.color}`}>
                                <doc.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-slate-300 group-hover:text-amber-50 truncate leading-tight">{doc.name}</span>
                                <div className="flex items-center justify-between mt-0.5">
                                    <div className="h-0.5 w-8 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-500 w-1/2 group-hover:bg-amber-500 transition-colors"></div>
                                    </div>
                                    <span className="text-[8px] text-slate-500 font-medium uppercase">{doc.limit.replace(' ADET / AY', '')}</span>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CENTER: Actions & Quick Tools */}
            <div className="lg:col-span-4 flex flex-col gap-2 h-full overflow-y-auto custom-scrollbar">
                {/* Create Certificate */}
                <button 
                    onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })}
                    className="flex-none h-20 relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-500/30 hover:border-blue-400 shadow-lg flex items-center px-3 gap-3 transition-all"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Award className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-400/30 relative z-10 group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left relative z-10">
                        <div className="text-[9px] text-blue-300 font-bold uppercase tracking-wider leading-none mb-1">HIZLI İŞLEM</div>
                        <div className="text-base font-black text-white leading-none">SERTİFİKA OLUŞTUR</div>
                    </div>
                </button>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-4 gap-2 flex-none h-20">
                    <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="bg-slate-900/80 hover:bg-amber-950/20 rounded-lg border border-slate-800 hover:border-amber-500/40 flex flex-col items-center justify-center gap-1 transition-all group p-1">
                        <History className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-bold text-slate-400 group-hover:text-amber-500 uppercase">Tutanak</span>
                    </button>
                    <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="bg-slate-900/80 hover:bg-emerald-950/20 rounded-lg border border-slate-800 hover:border-emerald-500/40 flex flex-col items-center justify-center gap-1 transition-all group p-1">
                        <Clock className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-bold text-slate-400 group-hover:text-emerald-500 uppercase">Rapor</span>
                    </button>
                    <button onClick={() => onNavigate('templates')} className="bg-slate-900/80 hover:bg-purple-950/20 rounded-lg border border-slate-800 hover:border-purple-500/40 flex flex-col items-center justify-center gap-1 transition-all group p-1">
                        <FileText className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-bold text-slate-400 group-hover:text-purple-500 uppercase">Arşiv</span>
                    </button>
                    <button onClick={() => onNavigate('templates')} className="bg-slate-900/80 hover:bg-rose-950/20 rounded-lg border border-slate-800 hover:border-rose-500/40 flex flex-col items-center justify-center gap-1 transition-all group p-1">
                        <Download className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-bold text-slate-400 group-hover:text-rose-500 uppercase">İndir</span>
                    </button>
                </div>

                {/* Industrial Panel - Compact */}
                <div className="flex-1 bg-black/40 border border-slate-800 rounded-xl p-2 relative overflow-hidden flex flex-col gap-1">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                     <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 pl-1">İşlevsel Menü</div>
                     
                     <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                        {rightSideMenu.map((item, i) => (
                            <button key={i} onClick={() => onNavigate('templates', { category: item.label.split(' ')[1] || item.label })} className="flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group bg-slate-900/30">
                                <div className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-amber-500 scale-75 group-hover:scale-100 transition-all"></div>
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 uppercase">{item.label}</span>
                                <ChevronDown className="w-3 h-3 text-slate-700 ml-auto -rotate-90 group-hover:text-amber-500/50" />
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            {/* RIGHT: Pricing / Plans - ALWAYS VISIBLE */}
            <div className="lg:col-span-4 bg-slate-900/20 border border-slate-800/30 rounded-xl p-2 flex flex-col gap-2 h-full overflow-y-auto custom-scrollbar">
                 <div className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase text-center py-1">Abonelik Paketleri</div>
                 
                 {/* STANDARD - Compact */}
                 <div className="flex-none bg-slate-900 rounded-lg border border-slate-800 p-2.5 flex items-center justify-between group hover:border-slate-600 transition-all shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-800 rounded text-slate-400">
                             <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-black text-xs text-slate-200">STANDART</div>
                            <div className="text-[9px] text-slate-500 font-bold">100 TL / AY</div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('subscription')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] font-bold px-2.5 py-1.5 rounded uppercase transition-colors">Seç</button>
                 </div>

                {/* GOLD - Highlighted */}
                 <div className="flex-none bg-gradient-to-br from-amber-950/30 to-black rounded-lg border border-amber-600/50 p-3 flex items-center justify-between group hover:border-amber-500 transition-all shadow-lg shadow-amber-900/10 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-amber-500 w-16 h-16 blur-2xl opacity-10"></div>
                    <div className="flex items-center gap-2.5 relative z-10">
                        <div className="bg-amber-500/10 p-2 rounded text-amber-500 border border-amber-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-black text-sm text-amber-500 leading-none">GOLD</div>
                            <div className="text-[9px] text-amber-400/70 font-bold mt-0.5">ÖNERİLEN • 175 TL</div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('subscription')} className="relative z-10 bg-amber-600 hover:bg-amber-500 text-black text-[10px] font-black px-3 py-2 rounded shadow-lg shadow-amber-900/20 transition-all uppercase hover:scale-105">SATIN AL</button>
                 </div>

                 {/* PREMIUM - Compact */}
                 <div className="flex-none bg-slate-900 rounded-lg border border-indigo-500/30 p-2.5 flex items-center justify-between group hover:border-indigo-500 transition-all shadow-sm">
                    <div className="flex items-center gap-2.5">
                         <div className="p-1.5 bg-indigo-900/20 rounded text-indigo-400 border border-indigo-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-black text-xs text-indigo-400">PREMİUM</div>
                            <div className="text-[9px] text-indigo-400/60 font-bold">250 TL / AY</div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('subscription')} className="bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 text-[9px] font-bold px-2.5 py-1.5 rounded uppercase transition-colors border border-indigo-500/30">Seç</button>
                 </div>
                 
                 {/* Extra Info Box */}
                 <div className="mt-auto bg-slate-950/50 rounded-lg border border-slate-800/50 p-2 text-center">
                    <span className="text-[8px] text-slate-500 leading-tight block">
                        Tüm paketlerde 7/24 destek ve düzenli güncelleme garantisi bulunmaktadır.
                    </span>
                 </div>
            </div>

        </div>

      </div>

    </div>
  );
};
