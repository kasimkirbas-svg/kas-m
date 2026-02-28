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

  const Zap = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const HardHat = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

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
    <div className="min-h-screen bg-slate-900 text-white font-sans w-full overflow-x-hidden flex flex-col p-1 md:p-2">
      
      {/* HEADER */}
      <div className="flex flex-col items-center py-2 bg-slate-900 border-b border-slate-800/50 mb-2">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-center tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase px-4 truncate w-full">
          YILLIK DOKÜMANLAR & İŞ TAKİP PANELİ
        </h1>
        <div className="flex flex-wrap justify-center gap-2 mt-1 text-[9px] md:text-xs text-amber-500 font-bold tracking-wide uppercase px-2 opacity-90">
          <span>Fabrika</span> • <span>Şirket</span> • <span>Maden</span> • <span>İnşaat</span> • <span>Enerji</span> • <span>Kimya</span> • <span>Küçük İşletme</span>
        </div>
      </div>

      {/* SECTOR CARDS ROW - Full Scrollable on Mobile, Grid on Desktop */}
      <div className="w-full mb-2">
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-7 gap-1 md:gap-2 pb-2 md:pb-0 scrollbar-hide">
            {sectors.map((sector) => (
            <div 
                key={sector.id}
                onClick={() => onNavigate('templates', { category: sector.searchQuery })}
                className={`min-w-[120px] md:min-w-0 group relative cursor-pointer overflow-hidden rounded border bg-slate-800 hover:border-amber-500 transition-all duration-300 ${sector.color} flex-1`}
            >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sector.gradient} to-transparent`}></div>
                <div className="h-16 md:h-20 lg:h-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
                <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-1 left-0 right-0 text-center z-20">
                    <span className="bg-black/70 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded backdrop-blur-sm border border-white/10 uppercase tracking-wider text-white shadow-lg">
                    {sector.title}
                    </span>
                </div>
                </div>
                
                <div className="p-1 bg-slate-900 flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors border-t border-slate-700">
                <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />
                <span className="truncate">İş Analizi Dokümanı</span>
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-grow mb-2">
        
        {/* DOCUMENTS LIST - LEFT SIDE */}
        <div className="lg:col-span-9 bg-slate-800/80 rounded border border-slate-700 overflow-hidden shadow-2xl flex flex-col h-full">
          <div className="bg-slate-800 border-b border-slate-600 p-2 px-3 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900/50 flex-shrink-0">
            <h2 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-slate-400" />
              DOKÜMANLAR
            </h2>
            <span className="text-[10px] text-slate-500 font-bold tracking-wider">ADET / AY</span>
          </div>
          
          <div className="divide-y divide-slate-700/50 overflow-y-auto flex-grow h-full custom-scrollbar">
            {documentList.map((doc, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('templates', { search: doc.name.split(' ')[0] })}
                className="flex justify-between items-center p-2 px-3 hover:bg-slate-700/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform shadow-sm ${doc.color}`}>
                    <doc.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{doc.name}</span>
                </div>
                
                <span className={`text-[10px] font-bold ${doc.limit.includes('SINIRSIZ') ? 'text-amber-400' : 'text-slate-400'}`}>
                  {doc.limit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR ACTIONS */}
        <div className="lg:col-span-3 space-y-2 flex flex-col h-full">
          
          {/* Create Certificate Button */}
          <button 
            onClick={() => onNavigate('templates', { category: 'Sertifika' })}
            className="w-full relative group overflow-hidden rounded bg-gradient-to-br from-blue-600 to-blue-700 hover:to-blue-600 transition-all shadow-lg p-0 flex-shrink-0"
          >
            <div className="absolute top-1 right-1 z-10">
              <span className="bg-amber-400 text-blue-900 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">YENİ</span>
            </div>
            <div className="flex items-center p-2 gap-2">
              <div className="bg-white/20 p-2 rounded backdrop-blur-sm">
                <Award className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <div className="text-left flex flex-col justify-center">
                <div className="text-[9px] text-blue-100 font-bold opacity-80 uppercase tracking-wide">PROFESYONEL</div>
                <div className="text-sm font-black text-white leading-tight">SERTİFİKA<br/>OLUŞTUR</div>
              </div>
            </div>
          </button>

          {/* Side Menu List */}
          <div className="bg-slate-100 rounded p-0.5 space-y-px shadow-inner overflow-hidden border border-slate-200">
            {rightSideMenu.map((item, i) => (
              <button 
                key={i} 
                onClick={() => onNavigate('templates')}
                className="w-full text-left flex items-center gap-2 p-1.5 hover:bg-white cursor-pointer rounded transition-colors bg-slate-50 border-b border-slate-200/50 last:border-0"
              >
                 <item.icon className="w-3.5 h-3.5 text-slate-600" />
                 <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded p-2 relative overflow-hidden shadow-lg flex-grow flex flex-col justify-center">
             <div className="absolute top-0 right-0 p-1">
                <span className="text-[8px] font-black text-amber-900 bg-amber-200/50 px-1.5 rounded-full border border-amber-600/20 backdrop-blur-sm">HIZLI İŞLEMLER</span>
             </div>
             <div className="mt-3 space-y-1.5 w-full">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded flex items-center gap-2 shadow-md transition-colors border border-slate-600 group text-left">
                    <History className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="font-bold text-[10px] truncate">TUTANAK TUT</span>
                </button>
                <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white p-1.5 rounded flex items-center gap-2 shadow-md transition-colors border border-emerald-500/50 group text-left">
                    <Clock className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="font-bold text-[10px] truncate">GÜNLÜK RAPOR TUT</span>
                </button>
             </div>
          </div>

          {/* Bottom Grid for Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-2">
            <button className="w-full bg-indigo-900 hover:bg-indigo-800 text-white p-2 rounded flex items-center gap-2 border border-indigo-700/50 shadow-lg group">
              <div className="bg-indigo-800 p-1.5 rounded group-hover:scale-110 transition-transform">
                  <FileCheck className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="text-left leading-none">
                  <div className="text-[9px] text-indigo-300 font-bold mb-0.5">DOKÜMAN</div>
                  <div className="text-xs font-black">ARŞİVİ</div>
              </div>
            </button>

            <button className="w-full bg-rose-900 hover:bg-rose-800 text-white p-2 rounded flex items-center gap-2 border border-rose-700/50 shadow-lg group">
              <div className="bg-rose-800 p-1.5 rounded group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4 text-rose-200" />
              </div>
              <div className="text-left leading-none">
                  <div className="text-[9px] text-rose-300 font-bold mb-0.5">PDF İNDİR</div>
                  <div className="text-xs font-black">/ YAZDIR</div>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* PRICING PLANS - Full Width Integration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-2">
        
        {/* STANDART */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded border-t border-slate-600 p-2 md:p-3 relative flex items-center justify-between group">
          <div className="flex items-center gap-3">
             <div className="bg-slate-700 p-2 rounded-full border border-slate-500 shadow-inner">
                <Shield className="w-5 h-5 text-slate-300" />
             </div>
             <div>
                <div className="font-black text-sm text-slate-200 tracking-tight">STANDART</div>
                <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Standart Limit</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-lg font-black text-white tracking-tighter">100 TL</div>
             <button className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded border border-slate-500 transition-all shadow-md uppercase">
                SATIN AL
             </button>
          </div>
        </div>

        {/* GOLD */}
        <div className="bg-gradient-to-b from-amber-900/60 to-black rounded border border-amber-500/60 p-2 md:p-3 relative flex items-center justify-between group shadow-lg shadow-amber-900/20 z-10">
          <div className="absolute top-0 right-0 p-1">
             <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-bl border-l border-b border-amber-300 tracking-wider shadow-sm uppercase">ÖNERİLEN</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full border border-amber-300 shadow-lg shadow-amber-500/20">
                <Shield className="w-5 h-5 text-amber-900" />
             </div>
             <div>
                <div className="font-black text-sm text-amber-400 tracking-tight">GOLD</div>
                <div className="text-[10px] text-amber-200/80 font-medium whitespace-nowrap">2 Kat Limit</div>
             </div>
          </div>
          <div className="text-right mt-3 md:mt-0">
             <div className="text-lg font-black text-amber-400 tracking-tighter">175 TL</div>
             <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded border border-amber-400/50 transition-all shadow-lg uppercase">
                SATIN AL
             </button>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="bg-gradient-to-b from-purple-900/60 to-black rounded border-t border-purple-500/60 p-2 md:p-3 relative flex items-center justify-between group">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-full border border-purple-400 shadow-lg shadow-purple-500/20">
                <Shield className="w-5 h-5 text-white" />
             </div>
             <div>
                <div className="font-black text-sm text-purple-300 tracking-tight">PREMİUM</div>
                <div className="text-[10px] text-purple-200/80 font-medium whitespace-nowrap">3 Kat Limit</div>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end gap-1.5 opacity-90">
                 <span className="text-xs line-through text-slate-500 decoration-slate-400">250 TL</span>
                 <span className="text-lg font-black text-white tracking-tighter">250 TL</span>
             </div>
             <button className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded border border-purple-400/50 transition-all shadow-lg uppercase">
                SATIN AL
             </button>
          </div>
        </div>

      </div>

    </div>
  );
};
