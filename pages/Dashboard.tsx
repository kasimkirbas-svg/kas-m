import React from 'react';
import { 
  Factory, Building2, HardHat, Zap, Store, 
  FileText, Shield, AlertTriangle, FileCheck, Award, 
  Download, Star, CheckCircle2, History, Clock, FileInput, Activity, ClipboardList
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
    {
      id: 'factory',
      title: 'FABRİKA',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
      color: 'border-blue-500',
      gradient: 'from-blue-600',
      searchQuery: 'Üretim'
    },
    {
      id: 'company',
      title: 'ŞİRKET',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      color: 'border-slate-500',
      gradient: 'from-slate-600',
      searchQuery: 'Kurumsal'
    },
    {
      id: 'mine',
      title: 'MADEN',
      image: 'https://images.unsplash.com/photo-1518558900645-12154743c683?auto=format&fit=crop&q=80&w=400', 
      color: 'border-orange-700',
      gradient: 'from-orange-700',
      searchQuery: 'Maden'
    },
    {
      id: 'construction',
      title: 'İNŞAAT',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
      color: 'border-yellow-600',
      gradient: 'from-yellow-600',
      searchQuery: 'İnşaat'
    },
    {
      id: 'energy',
      title: 'ENERJİ',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400',
      color: 'border-amber-500',
      gradient: 'from-amber-500',
      searchQuery: 'Enerji'
    },
    {
      id: 'chemistry',
      title: 'KİMYA',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400',
      color: 'border-emerald-600',
      gradient: 'from-emerald-600',
      searchQuery: 'Kimya'
    },
    {
      id: 'small_business',
      title: 'KÜÇÜK İŞLETME',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400',
      color: 'border-pink-500',
      gradient: 'from-pink-500',
      searchQuery: 'Esnaf'
    }
  ];

  const documentList = [
    { icon: FileCheck, name: 'Risk Analiz Raporu', limit: '10 ADET / AY', color: 'text-blue-500' },
    { icon: AlertTriangle, name: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', color: 'text-orange-500' },
    { icon: Shield, name: 'Yangından Korunma Dök.', limit: '10 ADET / AY', color: 'text-red-500' },
    { icon: HardHat, name: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', color: 'text-blue-400' },
    { icon: Zap, name: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', color: 'text-yellow-500' },
    { icon: FileText, name: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', color: 'text-green-500' },
    { icon: Award, name: 'Sertifika Oluşturma', limit: '100 SINIRSIZ', color: 'text-purple-500' },
    { icon: FileInput, name: 'Personel Sağlık Formu', limit: '100 SINIRSIZ', color: 'text-rose-500' },
    { icon: Activity, name: 'Matrix Puanlama Risk Analizi', limit: '100 SINIRSIZ', color: 'text-cyan-500' },
  ];

  const rightSideMenu = [
    { label: 'İş Eğitimleri', icon: FileCheck },
    { label: 'İş Belgeleri', icon: FileText },
    { label: 'İş Ercrumlar', icon: ClipboardList },
    { label: 'İş Evrakları', icon: FileInput },
    { label: 'İş Sertifikaları', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-2 md:p-4 font-sans max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col items-center mb-6 pt-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
          YILLIK DOKÜMANLAR & İŞ TAKİP PANELİ
        </h1>
        <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs md:text-sm text-amber-500 font-bold tracking-wide uppercase">
          <span>Fabrika</span> • <span>Şirket</span> • <span>Maden</span> • <span>İnşaat</span> • <span>Enerji</span> • <span>Kimya</span> • <span>Küçük İşletme</span>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-4"></div>
      </div>

      {/* SECTOR CARDS ROW */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-7 gap-2 mb-4">
        {sectors.map((sector) => (
          <div 
            key={sector.id}
            onClick={() => onNavigate('templates', { category: sector.searchQuery })}
            className={`group relative cursor-pointer overflow-hidden rounded border bg-slate-800 hover:border-amber-500 transition-all duration-300 ${sector.color}`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent`}></div>
            <div className="h-20 lg:h-24 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all z-10"></div>
              <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-1 left-0 right-0 text-center z-20">
                <span className="bg-black/70 px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded backdrop-blur-sm border border-white/10 uppercase tracking-wider text-white shadow-lg">
                  {sector.title}
                </span>
              </div>
            </div>
            
            <div className="p-1.5 bg-slate-800 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors border-t border-slate-700">
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              <span className="truncate">İş Analizi Dokümanı</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        
        {/* DOCUMENTS LIST - LEFT SIDE */}
        <div className="lg:col-span-9 bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="bg-slate-800 border-b border-slate-600 p-3 px-4 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900/50">
            <h2 className="font-bold text-slate-200 flex items-center gap-2 text-sm md:text-base">
              <FileText className="w-5 h-5 text-slate-400" />
              DOKÜMANLAR
            </h2>
            <span className="text-xs text-slate-500 font-bold tracking-wider">ADET / AY</span>
          </div>
          
          <div className="divide-y divide-slate-700/50">
            {documentList.map((doc, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                className="flex justify-between items-center p-2.5 px-4 hover:bg-slate-700/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform shadow-sm ${doc.color}`}>
                    <doc.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{doc.name}</span>
                </div>
                
                <span className={`text-xs font-bold ${doc.limit.includes('SINIRSIZ') ? 'text-amber-400' : 'text-slate-400'}`}>
                  {doc.limit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR ACTIONS */}
        <div className="lg:col-span-3 space-y-3 flex flex-col">
          
          {/* Create Certificate Button */}
          <button 
            onClick={() => onNavigate('templates', { category: 'Sertifika' })}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/40 p-0.5"
          >
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-amber-400 text-blue-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">YENİ</span>
            </div>
            <div className="flex items-center p-3 gap-3 h-full">
              <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
                <Award className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <div className="text-left flex flex-col justify-center">
                <div className="text-[10px] text-blue-100 font-bold opacity-80 uppercase tracking-wide">PROFESYONEL</div>
                <div className="text-base font-black text-white leading-tight">SERTİFİKA<br/>OLUŞTUR</div>
              </div>
              <img src="https://images.unsplash.com/photo-1635350644146-8c460d3d5178?auto=format&fit=crop&q=80&w=100" className="absolute right-0 bottom-0 w-16 opacity-30 mix-blend-overlay rotate-12 translate-y-2 translate-x-2" />
            </div>
          </button>

          {/* Side Menu List */}
          <div className="bg-slate-100 rounded-lg p-1 space-y-px shadow-inner overflow-hidden border border-slate-200">
            {rightSideMenu.map((item, i) => (
              <button 
                key={i} 
                onClick={() => onNavigate('templates')}
                className="w-full text-left flex items-center gap-2 p-2 hover:bg-white cursor-pointer rounded transition-colors bg-slate-50 border-b border-slate-200/50 last:border-0"
              >
                 <item.icon className="w-3.5 h-3.5 text-slate-600" />
                 <span className="text-xs font-bold text-slate-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg p-3 relative overflow-hidden shadow-lg shadow-amber-900/30">
             <div className="absolute top-0 right-0 p-1">
                <span className="text-[9px] font-black text-amber-900 bg-amber-200/50 px-2 rounded-full border border-amber-600/20 backdrop-blur-sm">HIZLI İŞLEMLER</span>
             </div>
             <div className="mt-5 space-y-2">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2 rounded flex items-center gap-2 shadow-md transition-colors border border-slate-600 group">
                    <History className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-xs">TUTANAK TUT</span>
                </button>
                <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white p-2 rounded flex items-center gap-2 shadow-md transition-colors border border-emerald-500/50 group">
                    <Clock className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-xs">GÜNLÜK RAPOR TUT</span>
                </button>
             </div>
          </div>

          {/* Bottom Side Buttons */}
          <div className="grid grid-rows-2 gap-2 grow">
            <button className="w-full bg-indigo-900 hover:bg-indigo-800 text-white p-2 rounded-lg flex items-center gap-3 border border-indigo-700/50 shadow-lg group">
              <div className="bg-indigo-800 p-2 rounded group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5 text-indigo-200" />
              </div>
              <div className="text-left leading-none">
                  <div className="text-[10px] text-indigo-300 font-bold mb-0.5">DOKÜMAN</div>
                  <div className="text-sm font-black">ARŞİVİ</div>
              </div>
            </button>

            <button className="w-full bg-rose-900 hover:bg-rose-800 text-white p-2 rounded-lg flex items-center gap-3 border border-rose-700/50 shadow-lg group">
              <div className="bg-rose-800 p-2 rounded group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-rose-200" />
              </div>
              <div className="text-left leading-none">
                  <div className="text-[10px] text-rose-300 font-bold mb-0.5">PDF İNDİR</div>
                  <div className="text-sm font-black">/ YAZDIR</div>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* PRICING PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        
        {/* STANDART */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-t border-slate-600 p-3 relative flex items-center justify-between group hover:shadow-2xl hover:shadow-blue-900/20 transition-all">
          <div className="flex items-center gap-3">
             <div className="bg-slate-700 p-2.5 rounded-full border border-slate-500 shadow-inner">
                <Shield className="w-6 h-6 text-slate-300" />
             </div>
             <div>
                <div className="font-black text-base text-slate-200 tracking-tight">STANDART</div>
                <div className="text-[10px] text-slate-400 font-medium">Standart Doküman Limiti</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-xl font-black text-white tracking-tighter">100 TL</div>
             <button className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded border border-slate-500 transition-all shadow-md uppercase">
                SATIN AL
             </button>
          </div>
        </div>

        {/* GOLD */}
        <div className="bg-gradient-to-b from-amber-900/60 to-black rounded-xl border border-amber-500/60 p-3 pt-5 relative flex items-center justify-between group hover:shadow-2xl hover:shadow-amber-600/20 transition-all transform scale-105 z-10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg">
             <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-0.5 rounded border border-amber-300 tracking-wider shadow-sm uppercase">ÖNERİLEN</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-full border border-amber-300 shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6 text-amber-900" />
             </div>
             <div>
                <div className="font-black text-base text-amber-400 tracking-tight">GOLD</div>
                <div className="text-[10px] text-amber-200/80 font-medium">2 Kat Doküman Limiti</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-xl font-black text-amber-400 tracking-tighter">175 TL</div>
             <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded border border-amber-400/50 transition-all shadow-lg uppercase">
                SATIN AL
             </button>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="bg-gradient-to-b from-purple-900/60 to-black rounded-xl border-t border-purple-500/60 p-3 relative flex items-center justify-between group hover:shadow-2xl hover:shadow-purple-600/20 transition-all">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-full border border-purple-400 shadow-lg shadow-purple-500/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <div className="font-black text-base text-purple-300 tracking-tight">PREMİUM</div>
                <div className="text-[10px] text-purple-200/80 font-medium">3 Kat Doküman Limiti</div>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end gap-1.5 opacity-90">
                 <span className="text-xs line-through text-slate-500 decoration-slate-400">250 TL</span>
                 <span className="text-xl font-black text-white tracking-tighter">250 TL</span>
             </div>
             <button className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded border border-purple-400/50 transition-all shadow-lg uppercase">
                SATIN AL
             </button>
          </div>
           <div className="absolute -bottom-2 -left-2 z-20 transform -rotate-2">
             <span className="bg-amber-400 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-amber-300 uppercase block">
                EN ÇOK TERCİH EDİLEN
             </span>
          </div>
        </div>

      </div>

    </div>
  );
};
