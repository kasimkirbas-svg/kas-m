import React from 'react';
import { 
  FileText, Shield, AlertTriangle, FileCheck, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList, CheckCircle2
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
    { id: 'factory', title: 'FABRİKA', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', color: 'border-blue-500', gradient: 'from-blue-600', searchQuery: 'Üretim' },
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal' },
    { id: 'mine', title: 'MADEN', image: 'https://images.unsplash.com/photo-1518558900645-12154743c683?auto=format&fit=crop&q=80&w=400', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden' },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat' },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji' },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya' },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf' }
  ];

  const Zap = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const HardHat = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

  const documentList = [
    { icon: FileCheck, name: 'Risk Analiz Raporu', limit: '10 ADET / AY', color: 'text-blue-400' },
    { icon: AlertTriangle, name: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', color: 'text-orange-400' },
    { icon: Shield, name: 'Yangından Korunma Dök.', limit: '10 ADET / AY', color: 'text-red-400' },
    { icon: HardHat, name: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', color: 'text-blue-300' },
    { icon: Zap, name: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', color: 'text-yellow-400' },
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

  // Common styles to ensure unity
  const containerClass = "bg-slate-800/90 border border-slate-700/50 rounded-lg backdrop-blur-sm shadow-xl overflow-hidden";
  const headerClass = "bg-gradient-to-r from-slate-900 to-slate-800 p-2 border-b border-slate-700/50 flex justify-between items-center";

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-amber-500/30">
      
      {/* 1. HEADER SECTION (Compact) */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 py-2 shadow-lg z-10">
        <h1 className="text-xl md:text-2xl font-black text-center tracking-widest bg-gradient-to-r from-slate-100 via-slate-300 to-slate-100 bg-clip-text text-transparent uppercase font-display drop-shadow-sm">
          YILLIK DOKÜMANLAR & İŞ TAKİP PANELİ
        </h1>
        <div className="flex justify-center gap-3 mt-1 text-[10px] md:text-xs font-bold tracking-widest text-amber-500/90 uppercase opacity-80">
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

      <div className="flex-1 p-2 gap-2 flex flex-col min-h-0 overflow-hidden">
        
        {/* 2. SECTORS ROW (Fixed Height Ratio) */}
        <div className="flex-none h-[18%] grid grid-cols-7 gap-2 min-h-[100px]">
           {sectors.map((sector) => (
            <div 
                key={sector.id}
                onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border border-slate-700 bg-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col`}
            >
                {/* Image Section */}
                <div className="relative flex-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent z-20`}></div>
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-all duration-500 z-10"></div>
                    <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 filter contrast-125" />
                    
                    {/* Floating Label */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-fit">
                        <span className="bg-slate-950/80 px-2 py-0.5 text-[10px] sm:text-xs font-black text-slate-100 rounded backdrop-blur-md border border-white/10 uppercase tracking-widest shadow-lg whitespace-nowrap">
                        {sector.title}
                        </span>
                    </div>
                </div>
                
                {/* Footer Label */}
                <div className="h-7 bg-slate-900 border-t border-slate-700 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="truncate tracking-wide">İş Analizi Dokümanı</span>
                </div>
            </div>
            ))}
        </div>

        {/* 3. MIDDLE SECTION (Remaining Space) */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-2">
            
            {/* LEFT: Documents List */}
            <div className={`col-span-9 ${containerClass} flex flex-col`}>
                <div className={headerClass}>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-700 rounded-md">
                            <FileText className="w-4 h-4 text-slate-300" />
                        </div>
                        <h2 className="font-bold text-slate-200 text-sm tracking-wide">DOKÜMANLAR</h2>
                    </div>
                    <span className="text-[10px] text-slate-500 font-black tracking-widest bg-slate-900 px-2 py-1 rounded">ADET / AY</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    <div className="grid grid-cols-1 divide-y divide-slate-700/50">
                        {documentList.map((doc, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                            className="flex justify-between items-center p-2.5 hover:bg-slate-700/30 cursor-pointer transition-all duration-200 group rounded hover:border-l-2 hover:border-l-amber-500 border-l-2 border-l-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded bg-slate-900 border border-slate-700/50 group-hover:scale-105 transition-transform shadow-sm ${doc.color} shadow-black/50`}>
                                    <doc.icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-100 transition-colors tracking-tight">{doc.name}</span>
                            </div>
                            
                            <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-slate-900/50 ${doc.limit.includes('SINIRSIZ') ? 'text-amber-400 border border-amber-500/20' : 'text-slate-500 border border-slate-700'}`}>
                            {doc.limit}
                            </span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Actions Panel */}
            <div className="col-span-3 flex flex-col gap-2 min-h-0">
                
                {/* Create Certificate Button */}
                <button 
                    onClick={() => onNavigate('templates', { category: 'Sertifika' })}
                    className="flex-none h-[18%] relative group overflow-hidden rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 transition-all border border-blue-500/30 shadow-lg shadow-blue-900/40"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-amber-400 text-blue-950 text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-sm tracking-wide">YENİ</span>
                    </div>
                    <div className="relative h-full flex items-center px-4 gap-3">
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <div className="text-left flex flex-col justify-center">
                            <div className="text-[10px] text-blue-200 font-bold opacity-80 uppercase tracking-widest mb-0.5">PROFESYONEL</div>
                            <div className="text-lg font-black text-white leading-none tracking-tight drop-shadow-md">SERTİFİKA<br/>OLUŞTUR</div>
                        </div>
                    </div>
                    {/* Shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                </button>

                {/* Side Menu List */}
                <div className={`flex-1 ${containerClass} flex flex-col justify-center bg-slate-200 border-slate-300`}>
                    <div className="w-full flex-1 flex flex-col justify-center p-1">
                    {rightSideMenu.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => onNavigate('templates')}
                            className="flex-1 w-full text-left flex items-center gap-3 px-3 hover:bg-white cursor-pointer transition-colors border-b border-slate-300/50 last:border-0 group first:rounded-t last:rounded-b"
                        >
                            <item.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800">{item.label}</span>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Quick Actions (Yellow Box) */}
                <div className="flex-none bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-lg p-0.5 shadow-lg shadow-amber-900/20 relative overflow-hidden">
                     <div className="bg-slate-900/10 h-full w-full p-2 flex flex-col gap-2">
                        <div className="flex justify-end p-1">
                            <span className="text-[9px] font-black text-amber-950 bg-white/30 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm tracking-wide">HIZLI İŞLEMLER</span>
                        </div>
                        <div className="space-y-2 pb-1">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2 rounded flex items-center gap-3 shadow-md transition-all border border-slate-600 group hover:border-amber-400/50">
                                <History className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-xs tracking-wide">TUTANAK TUT</span>
                            </button>
                            <button className="w-full bg-emerald-800 hover:bg-emerald-700 text-white p-2 rounded flex items-center gap-3 shadow-md transition-all border border-emerald-600/50 group hover:border-emerald-400/50">
                                <Clock className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-xs tracking-wide">GÜNLÜK RAPOR TUT</span>
                            </button>
                        </div>
                     </div>
                </div>

                {/* Bottom Buttons Grid */}
                <div className="flex-none grid grid-cols-1 gap-2">
                    <button className="w-full bg-indigo-950 hover:bg-indigo-900 text-white p-2.5 rounded-lg flex items-center gap-3 border border-indigo-500/30 shadow-lg group transition-all">
                        <div className="bg-indigo-800 p-1.5 rounded items-center justify-center flex shadow-inner border border-indigo-700 group-hover:scale-110 transition-transform">
                            <FileCheck className="w-4 h-4 text-indigo-200" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-[9px] text-indigo-300 font-bold mb-0.5 tracking-wider">DOKÜMAN</div>
                            <div className="text-sm font-black tracking-tight">ARŞİVİ</div>
                        </div>
                    </button>

                    <button className="w-full bg-rose-950 hover:bg-rose-900 text-white p-2.5 rounded-lg flex items-center gap-3 border border-rose-500/30 shadow-lg group transition-all">
                        <div className="bg-rose-800 p-1.5 rounded items-center justify-center flex shadow-inner border border-rose-700 group-hover:scale-110 transition-transform">
                            <Download className="w-4 h-4 text-rose-200" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-[9px] text-rose-300 font-bold mb-0.5 tracking-wider">PDF İNDİR</div>
                            <div className="text-sm font-black tracking-tight">/ YAZDIR</div>
                        </div>
                    </button>
                </div>

            </div>
        </div>

        {/* 4. FOOTER / PRICING (Fixed Height) */}
        <div className="flex-none h-[14%] grid grid-cols-3 gap-3 min-h-[80px]">
            
             {/* STANDARD */}
             <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border-t border-slate-600 p-3 relative flex items-center justify-between group hover:border-slate-500 transition-colors shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-2.5 rounded-full border border-slate-500 shadow-inner group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-slate-200 tracking-tight leading-none group-hover:text-white">STANDART</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1">Standart Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-white tracking-tighter">100 TL</div>
                    <button className="mt-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] font-black px-4 py-1.5 rounded border border-slate-500 transition-all shadow-md uppercase tracking-wide">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* GOLD */}
            <div className="bg-gradient-to-b from-amber-950 to-black rounded-lg border border-amber-600/50 p-3 relative flex items-center justify-between group hover:border-amber-500 transition-colors shadow-2xl shadow-amber-900/10 overflow-visible z-10 scale-[1.02]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-0.5 rounded border border-amber-300 tracking-wider shadow-lg uppercase whitespace-nowrap">ÖNERİLEN</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-full border border-amber-300 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-amber-900" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-amber-400 tracking-tight leading-none">GOLD</div>
                        <div className="text-[10px] text-amber-200/60 font-bold mt-1">2 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-amber-400 tracking-tighter">175 TL</div>
                    <button className="mt-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[10px] font-black px-4 py-1.5 rounded border border-amber-400/50 transition-all shadow-md uppercase tracking-wide">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* PREMIUM */}
            <div className="bg-gradient-to-b from-purple-950 to-black rounded-lg border-t border-purple-600/50 p-3 relative flex items-center justify-between group hover:border-purple-500 transition-colors shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-full border border-purple-400 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="font-black text-lg text-purple-300 tracking-tight leading-none group-hover:text-purple-200">PREMİUM</div>
                        <div className="text-[10px] text-purple-200/60 font-bold mt-1">3 Kat Doküman Limiti</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-90">
                        <span className="text-xs line-through text-slate-600 decoration-slate-500 font-bold">250 TL</span>
                        <span className="text-xl font-black text-white tracking-tighter">250 TL</span>
                    </div>
                    <button className="mt-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded border border-purple-400/50 transition-all shadow-md uppercase tracking-wide">
                        SATIN AL
                    </button>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
