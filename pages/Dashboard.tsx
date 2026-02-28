import React from 'react';
import { 
  FileText, Shield, AlertTriangle, FileCheck, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList, CheckCircle2,
  Construction, Factory, Building2, Zap, Beaker, Store
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

  // Renamed to avoid conflicts, used as inline component if needed or lucide icon directly
  const Lightning = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const Helmet = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

  const documentList = [
    { icon: FileCheck, name: 'Risk Analiz Raporu', limit: '10 ADET / AY', color: 'text-blue-400' },
    { icon: AlertTriangle, name: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', color: 'text-orange-400' },
    { icon: Shield, name: 'Yangından Korunma Dök.', limit: '10 ADET / AY', color: 'text-red-400' },
    { icon: Helmet, name: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', color: 'text-blue-300' },
    { icon: Lightning, name: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', color: 'text-yellow-400' },
    { icon: FileText, name: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', color: 'text-green-400' },
    { icon: Award, name: 'Sertifika Oluşturma', limit: '100 SINIRSIZ', color: 'text-purple-400' },
    { icon: FileInput, name: 'Personel Sağlık Formu', limit: '100 SINIRSIZ', color: 'text-rose-400' },
    { icon: Activity, name: 'Matrix Puanlama Risk Analizi', limit: '100 SINIRSIZ', color: 'text-cyan-400' },
  ];

  const rightSideMenu = [
    { label: 'İş Eğitimleri', icon: FileCheck },
    { label: 'İş Belgeleri', icon: FileText },
    { label: 'İş Ercrumlar', icon: ClipboardList },
    { label: 'İş Evrakları', icon: FileInput },
    { label: 'İş Sertifikaları', icon: Award },
  ];

  // Common styles to ensure unity - Increased padding and border radius
  const containerClass = "bg-slate-800/90 border border-slate-700/50 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden";
  const headerClass = "bg-gradient-to-r from-slate-900 to-slate-800 p-3 border-b border-slate-700/50 flex justify-between items-center";

  return (
    <div className="h-[calc(100dvh-5rem)] w-full bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-amber-500/30">
      
      {/* 1. HEADER SECTION - Increased Sizes */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 py-3 shadow-lg z-10 w-full px-4">
        <h1 className="text-3xl md:text-4xl font-black text-center tracking-widest bg-gradient-to-r from-slate-100 via-slate-300 to-slate-100 bg-clip-text text-transparent uppercase font-display drop-shadow-sm">
          YILLIK DOKÜMANLAR & İŞ TAKİP PANELİ
        </h1>
        <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm md:text-base font-bold tracking-widest text-amber-500/90 uppercase opacity-90">
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

      <div className="flex-1 p-3 gap-3 flex flex-col min-h-0 overflow-hidden w-full max-w-[1920px] mx-auto">
        
        {/* 2. SECTORS ROW - Increased Height & Text */}
        <div className="flex-none h-[22%] grid grid-cols-7 gap-3 min-h-[140px]">
           {sectors.map((sector) => (
            <div 
                key={sector.id}
                onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 flex flex-col`}
            >
                {/* Image Section */}
                <div className="relative flex-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${sector.gradient} to-transparent z-20`}></div>
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-all duration-500 z-10"></div>
                    <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 filter contrast-125 saturate-150" />
                    
                    {/* Floating Label */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-fit">
                        <span className="bg-slate-950/90 px-3 py-1 text-sm md:text-base font-black text-slate-100 rounded-md backdrop-blur-md border border-white/10 uppercase tracking-widest shadow-xl whitespace-nowrap">
                        {sector.title}
                        </span>
                    </div>
                </div>
                
                {/* Footer Label - Larger */}
                <div className="h-9 bg-slate-900 border-t border-slate-700 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 group-hover:text-amber-400 group-hover:bg-slate-900 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate tracking-wide">İş Analizi Dokümanı</span>
                </div>
            </div>
            ))}
        </div>

        {/* 3. MIDDLE SECTION */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3">
            
            {/* LEFT: Documents List - Larger Text & Padding */}
            <div className={`col-span-9 ${containerClass} flex flex-col`}>
                <div className={headerClass}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg">
                            <FileText className="w-6 h-6 text-slate-300" />
                        </div>
                        <h2 className="font-bold text-slate-100 text-lg md:text-xl tracking-wide">DOKÜMANLAR</h2>
                    </div>
                    <span className="text-xs md:text-sm text-slate-400 font-black tracking-widest bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700">LİMİT / AY</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    <div className="grid grid-cols-1 gap-1">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex justify-between items-center p-4 hover:bg-slate-700/40 cursor-pointer transition-all duration-200 group rounded-lg border border-transparent hover:border-slate-600/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700/50 group-hover:scale-110 transition-transform shadow-md ${doc.color} shadow-black/40`}>
                                    <doc.icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <span className="text-base md:text-lg font-bold text-slate-300 group-hover:text-white transition-colors tracking-tight">{doc.name}</span>
                            </div>
                            
                            <span className={`text-xs md:text-sm font-black tracking-wider px-3 py-1 rounded-md bg-slate-900/60 ${doc.limit.includes('SINIRSIZ') ? 'text-amber-400 border border-amber-500/30' : 'text-slate-400 border border-slate-700'}`}>
                            {doc.limit}
                            </span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Actions Panel */}
            <div className="col-span-3 flex flex-col gap-3 min-h-0">
                
                {/* Create Certificate Button - Scaled Up */}
                <button 
                    onClick={() => onNavigate('templates', { category: 'Sertifika' })}
                    className="flex-none h-[22%] relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 transition-all border-2 border-blue-500/30 shadow-xl shadow-blue-900/40"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-amber-400 text-blue-950 text-xs font-black px-2 py-1 rounded shadow-sm tracking-wide">YENİ</span>
                    </div>
                    <div className="relative h-full flex items-center px-6 gap-4">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                            <Award className="w-10 h-10 text-white drop-shadow-xl" />
                        </div>
                        <div className="text-left flex flex-col justify-center">
                            <div className="text-xs text-blue-200 font-bold opacity-90 uppercase tracking-widest mb-1">PROFESYONEL</div>
                            <div className="text-2xl font-black text-white leading-none tracking-tight drop-shadow-lg">SERTİFİKA<br/>OLUŞTUR</div>
                        </div>
                    </div>
                </button>

                {/* Side Menu List - Scaled Up - Fixed Dark Theme */}
                <div className={`flex-1 ${containerClass} flex flex-col justify-center bg-slate-800/50 border-slate-700`}>
                    <div className="w-full flex-1 flex flex-col justify-center p-2 gap-1">
                    {rightSideMenu.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => onNavigate('templates')}
                            className="flex-1 w-full text-left flex items-center gap-4 px-4 hover:bg-slate-700/50 cursor-pointer transition-all rounded-lg hover:shadow-sm border border-transparent hover:border-slate-600/50 group"
                        >
                            <div className="p-1.5 rounded bg-slate-900 border border-slate-700/50 group-hover:scale-110 transition-transform shadow-sm">
                                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <span className="text-sm md:text-base font-bold text-slate-300 group-hover:text-white">{item.label}</span>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Quick Actions - Scaled Up */}
                <div className="flex-none bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl p-0.5 shadow-lg shadow-amber-900/20 relative overflow-hidden">
                     <div className="bg-slate-900/20 h-full w-full p-2 flex flex-col gap-2">
                        <div className="flex justify-end px-1">
                            <span className="text-[10px] md:text-xs font-black text-amber-950 bg-white/40 px-3 py-0.5 rounded-full border border-white/20 backdrop-blur-sm tracking-wide">HIZLI İŞLEMLER</span>
                        </div>
                        <div className="space-y-2 pb-1">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg flex items-center gap-4 shadow-md transition-all border-2 border-slate-600 group hover:border-amber-400">
                                <History className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">TUTANAK TUT</span>
                            </button>
                            <button className="w-full bg-emerald-800 hover:bg-emerald-700 text-white p-3 rounded-lg flex items-center gap-4 shadow-md transition-all border-2 border-emerald-600 group hover:border-emerald-400">
                                <Clock className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">GÜNLÜK RAPOR TUT</span>
                            </button>
                             <button className="w-full bg-purple-900 hover:bg-purple-800 text-white p-3 rounded-lg flex items-center gap-4 shadow-md transition-all border-2 border-purple-600 group hover:border-purple-400">
                                <FileText className="w-5 h-5 text-purple-300 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">DOKÜMAN ARŞİVİ</span>
                            </button>
                             <button className="w-full bg-red-900 hover:bg-red-800 text-white p-3 rounded-lg flex items-center gap-4 shadow-md transition-all border-2 border-red-600 group hover:border-red-400">
                                <Download className="w-5 h-5 text-red-300 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">PDF İNDİR / YAZDIR</span>
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* 4. FOOTER / PRICING - Fixed Height & Scaled Up */}
        <div className="flex-none h-[15%] grid grid-cols-3 gap-3 min-h-[110px]">
            
             {/* STANDARD */}
             <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-600 p-4 relative flex items-center justify-between group hover:border-slate-400 transition-colors shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-700 p-3 rounded-full border border-slate-500 shadow-inner group-hover:scale-110 transition-transform">
                        <Shield className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                        <div className="font-black text-xl md:text-2xl text-slate-200 tracking-tight leading-none group-hover:text-white">STANDART</div>
                        <div className="text-xs text-slate-400 font-bold mt-1">Standart Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">100 TL</div>
                    <button className="mt-2 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-black px-6 py-2 rounded-md border border-slate-400 transition-all shadow-md uppercase tracking-wide w-full">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* GOLD - Highlighted */}
            <div className="bg-gradient-to-b from-amber-950 to-black rounded-xl border-2 border-amber-600/60 p-4 relative flex items-center justify-between group hover:border-amber-500 transition-colors shadow-2xl shadow-amber-900/30 overflow-visible z-10 scale-[1.02] transform">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-amber-500 text-black text-xs font-black px-4 py-1 rounded-md border border-amber-300 tracking-wider shadow-lg uppercase whitespace-nowrap">ÖNERİLEN PAKET</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-full border border-amber-300 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-8 h-8 text-amber-900" />
                    </div>
                    <div>
                        <div className="font-black text-xl md:text-2xl text-amber-400 tracking-tight leading-none">GOLD</div>
                        <div className="text-xs text-amber-200/60 font-bold mt-1">2 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tighter">175 TL</div>
                    <button className="mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black px-6 py-2 rounded-md border border-amber-400/50 transition-all shadow-md uppercase tracking-wide w-full">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="bg-gradient-to-b from-purple-950 to-black rounded-xl border border-purple-600/50 p-4 relative flex items-center justify-between group hover:border-purple-500 transition-colors shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full border border-purple-400 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="font-black text-xl md:text-2xl text-purple-300 tracking-tight leading-none group-hover:text-purple-200">PREMİUM</div>
                        <div className="text-xs text-purple-200/60 font-bold mt-1">3 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center justify-end gap-3 opacity-90">
                        <span className="text-sm line-through text-slate-600 decoration-slate-500 font-bold">400 TL</span>
                        <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">250 TL</span>
                    </div>
                    <button className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-xs font-black px-6 py-2 rounded-md border border-purple-400/50 transition-all shadow-md uppercase tracking-wide w-full">
                        SATIN AL
                    </button>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
