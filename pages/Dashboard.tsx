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
    <div className="h-[calc(100vh-64px)] w-full bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 overflow-hidden">
      
      {/* 1. Header with Glow Effect */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 py-4 shadow-lg z-20 w-full px-4 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 blur-sm"></div>
        <h1 className="text-xl md:text-2xl font-black text-center tracking-[0.2em] text-slate-100 uppercase drop-shadow-md relative z-10 truncate font-mono">
          YILLIK DOKÜMANLAR <span className="text-amber-500">&</span> İŞ TAKİP PANELİ
        </h1>
        <div className="flex justify-center gap-4 mt-1">
             <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Fabrika • Şirket • Maden • İnşaat • Enerji • Kimya • Küçük İşletme</div>
        </div>
      </div>

      <div className="flex-1 p-4 gap-4 flex flex-col w-full max-w-[1920px] mx-auto z-10 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
        
        {/* 2. Top Sectors Row */}
        <div className="flex-none h-32 w-full overflow-x-auto custom-scrollbar pb-1">
            <div className="flex gap-2 h-full px-1 min-w-max">
            {sectors.map((sector) => (
                <div 
                    key={sector.id}
                    onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                    className={`group relative cursor-pointer overflow-hidden rounded-md border-2 border-slate-700 hover:border-amber-500/80 bg-slate-900 transition-all duration-300 w-36 md:w-48 h-full flex flex-col shrink-0 hover:scale-[1.02] shadow-xl`}
                >
                    <div className="absolute inset-0 w-full h-full">
                         <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent z-20`}></div>
                         <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
                         <img src={sector.image} alt={sector.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    </div>
                    <div className="absolute top-0 left-0 w-full p-2 z-20">
                         <div className="bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-black px-2 py-1 rounded inline-block uppercase tracking-wider border border-white/10 group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors">
                            {sector.title}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-2 z-20 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            İş Analizi Dokümanı
                        </div>
                    </div>
                </div>
            ))}
             {/* Create Certificate Tile */}
             <div 
                onClick={() => onNavigate('templates', { category: 'Sertifika', search: 'Sertifika' })}
                className="group relative cursor-pointer overflow-hidden rounded-md border-2 border-blue-600 bg-blue-900/30 w-32 md:w-40 h-full flex flex-col shrink-0 hover:scale-[1.02] shadow-xl items-center justify-center p-2"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-slate-900/80"></div>
                <span className="relative z-10 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded mb-2">YENİ</span>
                <div className="relative z-10 text-center">
                    <div className="text-white font-black text-sm leading-tight uppercase">SERTİFİKA<br/>OLUŞTUR</div>
                    <Award className="w-8 h-8 text-amber-500 mx-auto mt-2 drop-shadow-lg" />
                </div>
            </div>
            </div>
        </div>

        {/* 3. Middle Section: Documents & Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
            
            {/* Documents Table - 3/4 Width */}
            <div className="lg:col-span-3 bg-slate-900/80 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden h-full">
                <div className="bg-slate-950/90 p-3 border-b border-slate-700 flex justify-between items-center shadow-md z-10 shrink-0">
                    <h2 className="font-bold text-slate-300 text-sm tracking-widest uppercase flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        DOKÜMANLAR
                    </h2>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ADET / AY</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-800/50 p-1">
                    <div className="flex flex-col gap-0.5">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex items-center px-4 py-3 hover:bg-slate-700/50 cursor-pointer transition-colors group border-b border-slate-700/50 last:border-0 odd:bg-slate-800/30 even:bg-slate-900/30"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`p-1.5 rounded bg-slate-800 border border-slate-600 shadow-sm shrink-0 ${doc.color}`}>
                                    <doc.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-amber-500 transition-colors drop-shadow-sm">{doc.name}</span>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-amber-500/80 group-hover:text-amber-400">{doc.limit}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - 1/4 Width */}
            <div className="lg:col-span-1 flex flex-col gap-3 h-full overflow-hidden">
                {/* Quick Actions List */}
                <div className="bg-slate-200 rounded-lg overflow-hidden flex flex-col shadow-lg border border-slate-300">
                    {rightSideMenu.map((item, i) => (
                        <button key={i} onClick={() => onNavigate('templates', { category: item.label.split(' ')[1] || item.label })} className="flex items-center gap-3 px-4 py-3 bg-slate-100 hover:bg-white border-b border-slate-300 last:border-0 transition-all group text-left">
                            <item.icon className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                            <span className="text-xs font-black text-slate-700 group-hover:text-black uppercase tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Big Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="bg-[#e8c14d] text-slate-900 px-3 py-1 rounded-t-lg text-[10px] font-black uppercase text-center w-max mx-auto shadow-sm -mb-1 relative z-10">Hızlı İşlemler</div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-600 shadow-xl flex flex-col gap-2 backdrop-blur-sm">
                        
                        <button onClick={() => onNavigate('templates', { search: 'Tutanak' })} className="flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 p-3 rounded border border-slate-500 shadow-lg group transition-all">
                             <History className="w-5 h-5 text-amber-500 group-hover:scale-110" />
                             <div className="text-left leading-none">
                                <div className="text-[10px] text-slate-400 font-bold">YENİ KAYIT</div>
                                <div className="text-sm font-black text-white">TUTANAK TUT</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates', { search: 'Rapor' })} className="flex items-center gap-3 bg-gradient-to-r from-emerald-900 to-slate-800 hover:from-emerald-800 hover:to-slate-700 p-3 rounded border border-emerald-700/50 shadow-lg group transition-all">
                             <Clock className="w-5 h-5 text-emerald-500 group-hover:scale-110" />
                             <div className="text-left leading-none">
                                <div className="text-[10px] text-emerald-400/70 font-bold">GÜNLÜK</div>
                                <div className="text-sm font-black text-white">RAPOR TUT</div>
                             </div>
                        </button>

                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-purple-900 to-slate-800 hover:from-purple-800 hover:to-slate-700 p-3 rounded border border-purple-700/50 shadow-lg group transition-all">
                             <FileText className="w-5 h-5 text-purple-500 group-hover:scale-110" />
                             <div className="text-left leading-none">
                                <div className="text-[10px] text-purple-400/70 font-bold">ARŞİV</div>
                                <div className="text-sm font-black text-white">DOKÜMANLAR</div>
                             </div>
                        </button>
                        
                         <button onClick={() => onNavigate('templates')} className="flex items-center gap-3 bg-gradient-to-r from-rose-900 to-slate-800 hover:from-rose-800 hover:to-slate-700 p-3 rounded border border-rose-700/50 shadow-lg group transition-all">
                             <Download className="w-5 h-5 text-rose-500 group-hover:scale-110" />
                             <div className="text-left leading-none">
                                <div className="text-[10px] text-rose-400/70 font-bold">ÇIKTI AL</div>
                                <div className="text-sm font-black text-white">PDF İNDİR/YAZDIR</div>
                             </div>
                        </button>

                    </div>
                </div>

            </div>

        </div>

        {/* 4. Bottom Pricing Row */}
        <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* STANDARD */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-600 rounded-xl p-3 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-500"></div>
                <div className="flex items-center gap-3 relative z-10 w-full">
                     <div className="bg-slate-700 p-2 rounded-full border border-slate-500">
                        <Shield className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-black text-lg text-white tracking-wide">STANDART</span>
                            <span className="text-xl font-bold text-white">100 TL</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Standart Doküman Limiti</div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                <button onClick={() => onNavigate('subscription')} className="absolute bottom-2 right-2 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold px-4 py-1 rounded shadow border border-slate-500">SATIN AL</button>
            </div>

             {/* GOLD */}
            <div className="bg-gradient-to-b from-amber-900/80 to-black border-2 border-amber-500 rounded-xl p-3 flex items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.3)] relative overflow-hidden group transform md:-translate-y-2 z-10">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-b shadow-sm z-20">ÖNERİLEN</div>
                <div className="flex items-center gap-3 relative z-10 w-full mt-1">
                     <div className="bg-amber-500/20 p-2 rounded-full border border-amber-500">
                        <Shield className="w-7 h-7 text-amber-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-black text-xl text-amber-500 tracking-wide">GOLD</span>
                            <span className="text-2xl font-bold text-amber-500">175 TL</span>
                        </div>
                        <div className="text-[10px] text-amber-200/70 font-bold uppercase">2 Kat Doküman Limiti</div>
                    </div>
                </div>
                 <button onClick={() => onNavigate('subscription')} className="absolute bottom-3 right-1/2 translate-x-1/2 w-2/3 bg-amber-600 hover:bg-amber-500 text-black text-xs font-black px-4 py-1.5 rounded shadow-lg border border-amber-400">SATIN AL</button>
            </div>

            {/* PREMIUM */}
            <div className="bg-gradient-to-b from-purple-900/60 to-slate-900 border-2 border-purple-500 rounded-xl p-3 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                <div className="flex items-center gap-3 relative z-10 w-full">
                     <div className="bg-purple-900/40 p-2 rounded-full border border-purple-500">
                        <CheckCircle2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-black text-lg text-purple-400 tracking-wide">PREMİUM</span>
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-xs text-slate-400 line-through decoration-red-500">250 TL</span>
                                <span className="text-xl font-bold text-white">250 TL</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-purple-200/70 font-bold uppercase">3 Kat Doküman Limiti</div>
                    </div>
                </div>
                 <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                  <button onClick={() => onNavigate('subscription')} className="absolute bottom-2 right-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[10px] font-bold px-4 py-1 rounded shadow border border-purple-500/50">SATIN AL</button>
            </div>

        </div>

      </div>

    </div>
  );
};
