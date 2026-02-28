import React from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame
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
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal', icon: Building2 },
    { id: 'mine', title: 'MADEN', image: 'https://images.unsplash.com/photo-1518558900645-12154743c683?auto=format&fit=crop&q=80&w=400', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden', icon: Construction },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat', icon: Construction },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji', icon: Zap },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya', icon: Beaker },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf', icon: Store }
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
      <div className="flex-none bg-slate-900 border-b-2 border-slate-800 py-4 shadow-lg z-10 w-full px-4 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-sm"></div>
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-center tracking-widest bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-transparent uppercase drop-shadow-sm px-2">
          YILLIK DOKÜMANLAR & İŞ TAKİP PANELİ
        </h1>
        
        {/* Mobile: Scrollable sectors list text / Desktop: Centered */}
        <div className="mt-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex md:justify-center items-center gap-3 md:gap-4 text-xs md:text-sm font-bold tracking-widest text-amber-500/90 uppercase opacity-90 whitespace-nowrap px-4 min-w-max mx-auto">
            <span>Fabrika</span>
            <span className="text-slate-600">•</span>
            <span>Şirket</span>
            <span className="text-slate-600">•</span>
            <span>Maden</span>
            <span className="text-slate-600">•</span>
            <span>İnşaat</span>
            <span className="text-slate-600">•</span>
            <span>Enerji</span>
            <span className="text-slate-600">•</span>
            <span>Kimya</span>
            <span className="text-slate-600">•</span>
            <span>Küçük İşletme</span>
            </div>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-4 gap-4 flex flex-col w-full max-w-[1920px] mx-auto">
        
        {/* 2. SECTORS ROW - Grid for Mobile/Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
           {sectors.map((sector) => (
            <div 
                key={sector.id}
                onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-900 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col h-32 md:h-40 lg:h-48`}
            >
                {/* Image Section */}
                <div className="relative flex-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent z-20`}></div>
                    <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-all duration-500 z-10"></div>
                    <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-100 filter grayscale group-hover:grayscale-0" />
                    
                    {/* Floating Label */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-fit text-center">
                        <span className="bg-slate-950/80 px-2 py-1 text-xs md:text-sm font-black text-slate-100 rounded backdrop-blur-sm border border-white/10 uppercase tracking-wider shadow-xl block whitespace-nowrap group-hover:text-amber-400 transition-colors">
                        {sector.title}
                        </span>
                    </div>
                </div>
                
                {/* Footer Label */}
                <div className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                    <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span className="truncate tracking-wide">İş Analizi</span>
                </div>
            </div>
            ))}
        </div>

        {/* 3. MIDDLE SECTION - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* LEFT: Documents List */}
            <div className={`lg:col-span-9 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm shadow-xl flex flex-col overflow-hidden h-full min-h-[500px]`}>
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-800 rounded border border-slate-700">
                            <FileText className="w-5 h-5 text-slate-300" />
                        </div>
                        <h2 className="font-black text-slate-200 text-base md:text-lg tracking-wider uppercase">DOKÜMAN LİSTESİ</h2>
                    </div>
                    <span className="hidden md:block text-[10px] md:text-xs text-amber-500 font-bold tracking-widest bg-slate-950 px-2 py-1 rounded border border-slate-800">AYLIK VE SINIRSIZ</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-3">
                    <div className="flex flex-col gap-2">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group rounded-lg border border-slate-800 hover:border-slate-600 gap-3 sm:gap-0"
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className={`p-2 rounded md:rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform shadow-md shrink-0 ${doc.color}`}>
                                    <doc.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm md:text-base font-bold text-slate-400 group-hover:text-amber-50 transition-colors tracking-tight uppercase">{doc.name}</span>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pl-11 sm:pl-0">
                                <span className="sm:hidden text-xs text-slate-500 font-bold uppercase">Limit:</span>
                                <span className={`text-[10px] md:text-xs font-black tracking-wider px-2 py-1 rounded bg-slate-950 ${doc.limit.includes('SINIRSIZ') ? 'text-amber-500 border border-amber-900/30' : 'text-slate-500 border border-slate-800'}`}>
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
                    onClick={() => onNavigate('templates', { category: 'Sertifika' })}
                    className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 hover:from-blue-800 hover:to-slate-800 transition-all border border-blue-800/50 shadow-lg min-h-[100px]"
                >
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wide animate-pulse">YENİ</span>
                    </div>
                    <div className="relative h-full flex items-center px-4 py-4 gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                            <Award className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] text-blue-300 font-bold opacity-80 uppercase tracking-widest mb-0.5">PROFESYONEL</div>
                            <div className="text-lg md:text-xl font-black text-white leading-none tracking-tight">SERTİFİKA<br/>OLUŞTUR</div>
                        </div>
                    </div>
                </button>

                {/* Side Menu List */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="w-full flex flex-col">
                    {rightSideMenu.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => onNavigate('templates')}
                            className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-800 cursor-pointer transition-all border-b border-slate-800/50 last:border-0 group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors"></div>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-tight">{item.label}</span>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Heavy Industrial Actions Panel */}
                <div className="bg-slate-900 border-2 border-slate-800 p-1 rounded-xl shadow-lg relative overflow-hidden">
                     {/* "Plate" effect */}
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                     
                     <div className="bg-slate-950/80 h-full w-full p-3 flex flex-col gap-3 rounded-lg relative z-10">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-1">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">HIZLI İŞLEMLER</span>
                            <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
                        </div>
                        
                        <div className="space-y-2">
                            <button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white p-3 rounded border-l-4 border-amber-500 flex items-center gap-3 shadow-md transition-all group">
                                <History className="w-4 h-4 text-amber-400" />
                                <span className="font-bold text-xs md:text-sm tracking-wide">TUTANAK TUT</span>
                            </button>
                            <button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white p-3 rounded border-l-4 border-emerald-500 flex items-center gap-3 shadow-md transition-all group">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                <span className="font-bold text-xs md:text-sm tracking-wide">GÜNLÜK RAPOR TUT</span>
                            </button>
                             <button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white p-3 rounded border-l-4 border-purple-500 flex items-center gap-3 shadow-md transition-all group">
                                <FileText className="w-4 h-4 text-purple-400" />
                                <span className="font-bold text-xs md:text-sm tracking-wide">DOKÜMAN ARŞİVİ</span>
                            </button>
                             <button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white p-3 rounded border-l-4 border-red-500 flex items-center gap-3 shadow-md transition-all group">
                                <Download className="w-4 h-4 text-red-400" />
                                <span className="font-bold text-xs md:text-sm tracking-wide">PDF İNDİR / YAZDIR</span>
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* 4. FOOTER / PRICING - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 mb-8">
            
             {/* STANDARD */}
             <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 relative flex items-center justify-between group hover:border-slate-600 transition-colors shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2.5 rounded text-slate-400 group-hover:text-white transition-colors">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-slate-300 tracking-tight leading-none group-hover:text-white uppercase">STANDART</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Standart Paket</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-xl font-black text-white tracking-tighter">100 TL</div>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black px-4 py-1.5 rounded transition-all uppercase tracking-wide">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* GOLD - Highlighted */}
            <div className="bg-gradient-to-br from-amber-950/40 to-black rounded-xl border border-amber-600/50 p-4 relative flex items-center justify-between group hover:border-amber-500 transition-colors shadow-lg shadow-amber-900/10">
                <div className="absolute -top-2.5 left-4 z-20">
                    <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">ÖNERİLEN</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-amber-900/30 p-2.5 rounded border border-amber-600/30 text-amber-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-amber-500 tracking-tight leading-none">GOLD</div>
                        <div className="text-[10px] text-amber-400/60 font-bold mt-1 uppercase">2 Kat Limit</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-xl font-black text-amber-400 tracking-tighter">175 TL</div>
                    <button className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded transition-all uppercase tracking-wide shadow-lg shadow-amber-900/20">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="bg-slate-900 rounded-xl border border-indigo-900/50 p-4 relative flex items-center justify-between group hover:border-indigo-500/50 transition-colors shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/20 p-2.5 rounded border border-indigo-500/20 text-indigo-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-indigo-400 tracking-tight leading-none">PREMİUM</div>
                        <div className="text-[10px] text-indigo-400/60 font-bold mt-1 uppercase">3 Kat Limit</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                     <div className="flex items-end gap-2">
                        <span className="text-xs line-through text-slate-600 font-bold mb-0.5">400</span>
                        <span className="text-xl font-black text-white tracking-tighter">250 TL</span>
                    </div>
                    <button className="bg-indigo-700 hover:bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded transition-all uppercase tracking-wide">
                        SATIN AL
                    </button>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
