import React from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame,
  FileCheck
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
    { id: 'factory', title: 'FABRİKA', image: 'https://images.unsplash.com/photo-1565514020176-dbf2277cc2c2?auto=format&fit=crop&q=80&w=400', color: 'border-blue-500', gradient: 'from-blue-600', searchQuery: 'Üretim', icon: Factory },
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal', icon: Building2 },
    { id: 'mine', title: 'MADEN', image: 'https://plus.unsplash.com/premium_photo-1661962360528-766785532520?auto=format&fit=crop&q=80&w=400', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden', icon: Construction },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat', icon: Construction },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=400', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji', icon: Zap },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya', icon: Beaker },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556740758-90de690fc122?auto=format&fit=crop&q=80&w=400', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf', icon: Store }
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 pb-20 md:pb-0">
      
      {/* 1. HEADER SECTION */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 py-6 shadow-2xl z-20 w-full px-4 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent blur-md"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent)] pointer-events-none"></div>
        
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-center tracking-[0.2em] bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] px-2 relative z-10">
          YILLIK DOKÜMANLAR <span className="text-amber-500">&</span> İŞ TAKİP PANELİ
        </h1>
        
        {/* Mobile: Scrollable sectors list text / Desktop: Centered */}
        <div className="mt-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex md:justify-center items-center gap-6 md:gap-8 text-xs md:text-sm font-black tracking-widest text-slate-500 uppercase whitespace-nowrap px-4 min-w-max mx-auto">
            <span>Fabrika</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>Şirket</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>Maden</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>İnşaat</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>Enerji</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>Kimya</span>
            <span className="text-amber-500/50 text-lg">•</span>
            <span>Küçük İşletme</span>
            </div>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-6 gap-6 flex flex-col w-full max-w-[1920px] mx-auto z-10">
        
        {/* 2. SECTORS ROW - Grid for Mobile/Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
           {sectors.map((sector) => (
            <div 
                key={sector.id}
                onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-500 flex flex-col h-32 md:h-48 lg:h-56 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/50`}
            >
                {/* Image Section */}
                <div className="relative flex-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent z-20 group-hover:h-full group-hover:opacity-20 transition-all duration-500`}></div>
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-all duration-500 z-10 mix-blend-multiply"></div>
                    
                    {/* ENHANCED VISUALS - FULL COLOR & MAGNIFICENCE */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60"></div>
                    
                    <img 
                        src={sector.image} 
                        alt={sector.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100 group-hover:scale-110 brightness-75 group-hover:brightness-110 saturate-150" 
                    />
                    
                    {/* Floating Label - Enhanced Style */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full text-center px-1">
                        <span className="inline-block bg-black/60 text-white px-3 py-2 text-xs md:text-sm font-black rounded border-y border-amber-500/50 uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm group-hover:text-amber-400 group-hover:border-amber-400 group-hover:bg-black/80 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                        {sector.title}
                        </span>
                    </div>
                </div>
                
                {/* Footer Label */}
                <div className="h-9 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-900 transition-colors z-20 relative">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="truncate tracking-widest uppercase">İş Analizi</span>
                </div>
            </div>
            ))}
        </div>

        {/* 3. MIDDLE SECTION - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* LEFT: Documents List - MAGNIFICENT UPDATE */}
            <div className={`lg:col-span-9 bg-gradient-to-br from-slate-900 via-slate-900 to-black border border-slate-800/60 rounded-xl backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden h-full min-h-[500px] relative ring-1 ring-white/5`}>
                {/* Metallic shine effect */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                
                <div className="bg-slate-950/80 p-5 border-b border-slate-800/80 flex justify-between items-center shadow-lg z-10 backdrop-blur-md sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
                            <FileText className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-100 text-xl tracking-widest uppercase drop-shadow-md">DOKÜMAN LİSTESİ</h2>
                            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Profesyonel İş Belgeleri</p>
                        </div>
                    </div>
                    <span className="hidden md:block text-[10px] md:text-xs text-amber-500 font-black tracking-widest bg-black/40 px-4 py-2 rounded-lg border border-amber-900/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]">AYLIK VE SINIRSIZ ERİŞİM</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5 bg-black/20">
                    <div className="flex flex-col gap-3">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-slate-800/60 cursor-pointer transition-all duration-300 group rounded-xl border border-slate-800/40 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] gap-4 sm:gap-0 relative overflow-hidden backdrop-blur-sm"
                        >
                            {/* Hover Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/0 group-hover:bg-amber-500 transition-all duration-300"></div>
                            
                            <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
                                <div className={`p-3 rounded-lg bg-slate-950/80 border border-slate-700/50 group-hover:border-amber-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shrink-0 ${doc.color}`}>
                                    <doc.icon className="w-5 h-5 drop-shadow-[0_0_5px_currentColor]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm md:text-base font-bold text-slate-300 group-hover:text-amber-50 transition-colors tracking-tight uppercase drop-shadow-sm">{doc.name}</span>
                                    <div className="h-0.5 w-0 group-hover:w-full bg-amber-500/50 transition-all duration-500 mt-1 max-w-[100px]"></div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pl-16 sm:pl-0 relative z-10 mt-2 sm:mt-0">
                                <span className="sm:hidden text-[10px] text-slate-500 font-bold uppercase tracking-wider">LİMİT DURUMU:</span>
                                <span className={`text-[10px] md:text-xs font-black tracking-wider px-3 py-1.5 rounded bg-black/40 shadow-inner border transition-all duration-300 ${doc.limit.includes('SINIRSIZ') ? 'text-amber-500 border-amber-900/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-500 border-slate-800 group-hover:text-slate-300 group-hover:border-slate-700'}`}>
                                {doc.limit}
                                </span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Actions Panel - Stack on Mobile */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                
                {/* Create Certificate Button */}
                <button 
                    onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })}
                    className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 hover:from-blue-800 hover:to-slate-900 transition-all duration-500 border border-blue-500/30 hover:border-blue-400 shadow-xl shadow-blue-900/20 min-h-[110px]"
                >
                     {/* Shine effect */}
                     <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>
                    
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-amber-500/20 tracking-wide animate-pulse">YENİ</span>
                    </div>
                    <div className="relative h-full flex items-center px-5 py-4 gap-4">
                        <div className="bg-blue-500/20 p-3.5 rounded-xl border border-blue-400/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Award className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] text-blue-300 font-bold opacity-80 uppercase tracking-widest mb-1 group-hover:text-blue-200">PROFESYONEL</div>
                            <div className="text-xl font-black text-white leading-none tracking-tight group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">SERTİFİKA<br/>OLUŞTUR</div>
                        </div>
                    </div>
                </button>

                {/* Side Menu List */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl backdrop-blur-sm">
                    <div className="w-full flex flex-col">
                    {rightSideMenu.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => onNavigate('templates', { category: item.label.split(' ')[1] || item.label })} 
                            className="w-full text-left flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/80 cursor-pointer transition-all border-b border-slate-800/50 last:border-0 group relative overflow-hidden"
                        >
                            <div className="absolute left-0 w-1 h-full bg-amber-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                            
                            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-amber-500 group-hover:scale-125 transition-all shadow-[0_0_5px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-100 uppercase tracking-tight transition-colors">{item.label}</span>
                            <item.icon className="w-4 h-4 ml-auto text-slate-600 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300" />
                        </button>
                    ))}
                    </div>
                </div>

                {/* Heavy Industrial Actions Panel - MAGNIFICENT */}
                <div className="bg-gradient-to-br from-slate-950 to-black border-2 border-slate-800/80 p-1.5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                     {/* "Plate" effect */}
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
                     <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/5 via-transparent to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md"></div>
                     
                     <div className="bg-black/40 h-full w-full p-4 flex flex-col gap-4 rounded-lg relative z-10 backdrop-blur-sm">
                        <div className="flex justify-between items-center border-b border-slate-800/50 pb-3 mb-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-amber-500 transition-colors drop-shadow-sm">HIZLI İŞLEMLER</span>
                            <div className="relative">
                                <Activity className="w-4 h-4 text-amber-500 animate-pulse relative z-10" />
                                <div className="absolute inset-0 bg-amber-500 blur-sm animate-pulse opacity-50"></div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-950/30 hover:to-slate-900 text-slate-300 p-3.5 rounded-lg border border-slate-800 hover:border-amber-500/40 flex items-center gap-4 shadow-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300 group/btn relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                                <History className="w-5 h-5 text-amber-500 group-hover/btn:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                <span className="font-extrabold text-xs md:text-sm tracking-widest uppercase group-hover/btn:text-white transition-colors">TUTANAK TUT</span>
                            </button>
                            
                            <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-950/30 hover:to-slate-900 text-slate-300 p-3.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 flex items-center gap-4 shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 group/btn relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                <Clock className="w-5 h-5 text-emerald-500 group-hover/btn:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                <span className="font-extrabold text-xs md:text-sm tracking-widest uppercase group-hover/btn:text-white transition-colors">GÜNLÜK RAPOR TUT</span>
                            </button>
                            
                             <button onClick={() => onNavigate('templates')} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-950/30 hover:to-slate-900 text-slate-300 p-3.5 rounded-lg border border-slate-800 hover:border-purple-500/40 flex items-center gap-4 shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all duration-300 group/btn relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                                <FileText className="w-5 h-5 text-purple-500 group-hover/btn:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                                <span className="font-extrabold text-xs md:text-sm tracking-widest uppercase group-hover/btn:text-white transition-colors">DOKÜMAN ARŞİVİ</span>
                            </button>
                            
                             <button onClick={() => onNavigate('templates')} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-rose-950/30 hover:to-slate-900 text-slate-300 p-3.5 rounded-lg border border-slate-800 hover:border-rose-500/40 flex items-center gap-4 shadow-lg hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all duration-300 group/btn relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                                <Download className="w-5 h-5 text-rose-500 group-hover/btn:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
                                <span className="font-extrabold text-xs md:text-sm tracking-widest uppercase group-hover/btn:text-white transition-colors">PDF İNDİR / YAZDIR</span>
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* 4. FOOTER / PRICING - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 mb-10">
            
             {/* STANDARD */}
             <div className="bg-slate-900 rounded-xl border border-slate-700/50 p-6 relative flex items-center justify-between group hover:border-slate-500 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-lg text-slate-300 group-hover:text-white transition-colors shadow-inner border border-slate-600/30">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="font-black text-2xl text-slate-200 tracking-tighter leading-none group-hover:text-white uppercase drop-shadow-sm">STANDART</div>
                        <div className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Standart Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                    <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md">100 TL</div>
                    <button 
                        onClick={() => onNavigate('subscription')}
                        className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-black px-6 py-2.5 rounded shadow-lg transition-all uppercase tracking-widest hover:scale-105 active:scale-95"
                    >
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* GOLD - Highlighted */}
            <div className="bg-gradient-to-br from-slate-900 via-amber-950/20 to-black rounded-xl border border-amber-600 p-6 relative flex items-center justify-between group hover:border-amber-400 transition-all duration-300 shadow-2xl shadow-amber-900/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transform md:-translate-y-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest border border-amber-400/50">EN ÇOK TERCİH EDİLEN</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-gradient-to-br from-amber-900/40 to-black p-3 rounded-lg border border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="font-black text-2xl text-amber-500 tracking-tighter leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">GOLD</div>
                        <div className="text-xs text-amber-400/80 font-bold mt-1 uppercase tracking-widest">2 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3 relative z-10">
                    <div className="text-3xl font-black text-amber-400 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">175 TL</div>
                    <button 
                         onClick={() => onNavigate('subscription')}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-black px-6 py-2.5 rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all uppercase tracking-widest hover:scale-105 active:scale-95"
                    >
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="bg-slate-900 rounded-xl border border-indigo-500/30 p-6 relative flex items-center justify-between group hover:border-indigo-500 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]">
                 <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                 
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-black p-3 rounded-lg border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="font-black text-2xl text-indigo-400 tracking-tighter leading-none drop-shadow-sm">PREMİUM</div>
                        <div className="text-xs text-indigo-400/80 font-bold mt-1 uppercase tracking-widest">3 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1 relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm line-through text-slate-600 font-bold decoration-2">400</span>
                        <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md">250 TL</div>
                    </div>
                    <button 
                        onClick={() => onNavigate('subscription')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-2.5 rounded shadow-lg shadow-indigo-900/20 transition-all uppercase tracking-widest hover:scale-105 active:scale-95"
                    >
                        SATIN AL
                    </button>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
