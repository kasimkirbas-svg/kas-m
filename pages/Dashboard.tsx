import React from 'react';
import { 
  Factory, Building2, Store, Zap, Beaker, HardHat, 
  FileText, Shield, AlertTriangle, Flame, Activity, 
  CheckCircle2, Clock, History, Award, ChevronRight,
  Plus, ClipboardList, Archive, MousePointer2, Hammer
} from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';
import { PLANS } from '../constants';

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
        searchQuery: 'Üretim', 
        icon: Factory,
        items: ['Üretim Takip', 'Makine Bakım', 'Vardiya Listesi', 'Kalite Kontrol', 'Stok Sayım'] 
    },
    { 
        id: 'company', 
        title: 'ŞİRKET', 
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'Kurumsal', 
        icon: Building2,
        items: ['Personel Özlük', 'İzin Formları', 'Toplantı Tutanak', 'Zimmet Formu', 'Masraf Formu']
    },
    { 
        id: 'mine', 
        title: 'MADEN İŞLEMLERİ', 
        image: 'https://images.unsplash.com/photo-1516937941344-00b4ec0c9038?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'Maden', 
        icon: Hammer,
        items: ['Patlatma Raporu', 'Gaz Ölçüm', 'Ocak Planı', 'Ekipman Takip', 'Acil Durum']
    },
    { 
        id: 'construction', 
        title: 'İNŞAAT', 
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'İnşaat', 
        icon: HardHat,
        items: ['Şantiye Defteri', 'Hakediş Raporu', 'İş Güvenliği', 'Malzeme Takip', 'Proje Planı']
    },
    { 
        id: 'energy', 
        title: 'ENERJİ', 
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'Enerji', 
        icon: Zap,
        items: ['Trafo Bakım', 'Sayaç Okuma', 'Kesinti Raporu', 'Hat Kontrol', 'Enerji Analizi']
    },
    { 
        id: 'chemistry', 
        title: 'KİMYA', 
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'Kimya', 
        icon: Beaker,
        items: ['MSDS Formları', 'Laboratuvar', 'Atık Yönetimi', 'Stok Takip', 'Kalite Analiz']
    },
    { 
        id: 'small_business', 
        title: 'KÜÇÜK İŞLETME', 
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400', 
        searchQuery: 'Esnaf', 
        icon: Store,
        items: ['Cari Hesap', 'Stok Durumu', 'Fatura Kes', 'Personel', 'Vergi Takip']
    }
  ];

  const documents = [
    { name: 'Risk Analiz Raporu', icon: FileText, color: 'text-blue-400', limit: 10, used: 2 },
    { name: 'Patlayıcıdan Korunma Dök.', icon: AlertTriangle, color: 'text-orange-400', limit: 10, used: 4 },
    { name: 'Yangından Korunma Dök.', icon: Flame, color: 'text-red-400', limit: 10, used: 1 },
    { name: 'Yüksekte Çalışma Dök.', icon: HardHat, color: 'text-blue-300', limit: 10, used: 0 },
    { name: 'Elektrik İşlerinde Dök.', icon: Zap, color: 'text-yellow-400', limit: 200, used: 15 },
    { name: 'İşe Başlama Eğitim Dök.', icon: CheckCircle2, color: 'text-green-400', limit: 200, used: 45 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6 font-sans">
      
      {/* HEADER */}
      <div className="text-center mb-8 pt-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-wider text-white mb-2 uppercase" 
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
          YILLIK DOKÜMANLAR <span className="text-yellow-500">&</span> İŞ TAKİP PANELİ
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-bold text-yellow-500/80 tracking-widest uppercase">
          <span>FABRİKA</span>
          <span>•</span>
          <span>ŞİRKET</span>
          <span>•</span>
          <span>MADEN</span>
          <span>•</span>
          <span>İNŞAAT</span>
          <span>•</span>
          <span>ENERJİ</span>
          <span>•</span>
          <span>KİMYA</span>
          <span>•</span>
          <span>KÜÇÜK İŞLETME</span>
        </div>
        <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mt-4"></div>
      </div>

      {/* SECTORS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {sectors.map((sector) => (
          <div 
            key={sector.id}
            onClick={() => onNavigate('templates', { category: sector.searchQuery })}
            className={`group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-yellow-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] ${
               sector.id === 'mine' ? 'border-yellow-500 ring-1 ring-yellow-500/20' : ''
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img src={sector.image} alt={sector.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              
              {/* Icon & Title (Slide up on hover) */}
              <div className="flex flex-col items-center justify-center transition-all duration-500 group-hover:-translate-y-6 group-hover:scale-90">
                 <div className="mb-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                    <sector.icon size={24} />
                 </div>
                 <span className="text-xs md:text-sm font-black tracking-widest uppercase drop-shadow-lg">{sector.title}</span>
              </div>

              {/* Scrollable List (Visible on hover) */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 flex flex-col">
                  <div className="w-8 h-1 bg-yellow-500/50 mx-auto mb-2 rounded-full"></div>
                  <div className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500/50 scrollbar-track-white/5 pr-1 space-y-2 text-left bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/5">
                     {sector.items.map((item, idx) => (
                        <div key={idx} className="text-[10px] text-slate-200 font-bold tracking-wide truncate pl-2 border-l-2 border-yellow-500/30 hover:border-yellow-500 hover:text-white hover:bg-white/10 transition-all py-1">
                           {item}
                        </div>
                     ))}
                  </div>
              </div>

            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* DOCUMENT LIST (Left Column) */}
        <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    DOKÜMANLAR LİSTESİ
                </h3>
                <div className="text-[10px] font-mono text-slate-500 flex gap-4">
                    <span>LİMİT DURUMU</span>
                    <span>|</span>
                    <span>ADET / AY</span>
                </div>
            </div>

            <div className="bg-[#161922] rounded-xl border border-white/5 divide-y divide-white/5">
                {documents.map((doc, idx) => (
                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                        <div className={`p-2 rounded-lg bg-white/5 ${doc.color}`}>
                            <doc.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{doc.name}</h4>
                        </div>
                        
                        {/* Progress Bar Container */}
                        <div className="flex-[2] hidden md:block px-4">
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${doc.color.replace('text-', 'bg-')}`} 
                                    style={{ width: `${(doc.used / doc.limit) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-xs font-mono text-slate-400 whitespace-nowrap min-w-[100px] text-right">
                            <span className="text-white">{doc.limit}</span> ADET / AY
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* QUICK ACTIONS (Right Column) */}
        <div className="lg:col-span-1">
            <div className="flex items-center justify-center mb-4 relative">
                <div className="h-px bg-white/10 w-full absolute top-1/2"></div>
                <span className="bg-[#0f1115] px-2 text-[10px] font-bold text-yellow-500 uppercase tracking-widest relative z-10">
                    HIZLI İŞLEMLER
                </span>
            </div>

            <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all group text-left flex items-center gap-4"
                >
                    <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                        <Award size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] text-blue-400 font-bold mb-0.5 opacity-70">YENİ ÖZELLİK</div>
                        <div className="font-black text-sm tracking-wide">SERTİFİKA OLUŞTUR</div>
                    </div>
                </button>

                <button 
                  onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-900/40 to-orange-800/20 border border-orange-500/30 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all group text-left flex items-center gap-4"
                >
                    <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                        <History size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] text-orange-400 font-bold mb-0.5 opacity-70">YENİ KAYIT</div>
                        <div className="font-black text-sm tracking-wide">TUTANAK TUT</div>
                    </div>
                </button>

                <button 
                   onClick={() => onNavigate('templates', { search: 'Rapor' })}
                   className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group text-left flex items-center gap-4"
                >
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] text-emerald-400 font-bold mb-0.5 opacity-70">GÜNLÜK</div>
                        <div className="font-black text-sm tracking-wide">RAPOR TUT</div>
                    </div>
                </button>
 
                <button 
                   onClick={() => onNavigate('mydocuments')}
                   className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all group text-left flex items-center gap-4"
                >
                    <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                        <Archive size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] text-purple-400 font-bold mb-0.5 opacity-70">ARŞİV</div>
                        <div className="font-black text-sm tracking-wide">DOKÜMANLAR</div>
                    </div>
                </button>
            </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {/* STANDART */}
         <div className="bg-gradient-to-b from-[#1a2030] to-[#0f1115] rounded-xl p-5 border border-blue-900/50 flex items-center justify-between group hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Shield size={24} />
               </div>
               <div>
                  <h3 className="font-black text-white text-lg tracking-wide">STANDART</h3>
                  <p className="text-[10px] text-blue-300 font-medium uppercase">Standart Doküman Limiti</p>
               </div>
            </div>
            <div className="text-right">
               <div className="text-xl font-black text-white">100 TL</div>
               <button className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest transition-colors mt-1">
                  SATIN AL
               </button>
            </div>
         </div>

         {/* GOLD */}
         <div className="relative bg-gradient-to-b from-[#2a1e0d] to-[#0f1115] rounded-xl p-5 border border-yellow-600/50 flex items-center justify-between group hover:border-yellow-500 transition-colors shadow-lg shadow-yellow-900/10 scale-[1.02]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
               ÖNERİLEN
            </div>
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <Award size={24} />
               </div>
               <div>
                  <h3 className="font-black text-yellow-500 text-lg tracking-wide">GOLD</h3>
                  <p className="text-[10px] text-yellow-300/80 font-medium uppercase">2 Kat Doküman Limiti</p>
               </div>
            </div>
            <div className="text-right">
               <div className="text-2xl font-black text-yellow-500">175 TL</div>
               <button className="px-4 py-1.5 rounded bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest transition-colors mt-1">
                  SATIN AL
               </button>
            </div>
         </div>

         {/* PREMIUM */}
         <div className="bg-gradient-to-b from-[#251a30] to-[#0f1115] rounded-xl p-5 border border-purple-900/50 flex items-center justify-between group hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                  <h3 className="font-black text-white text-lg tracking-wide">PREMIUM</h3>
                  <p className="text-[10px] text-purple-300 font-medium uppercase">3 Kat Doküman Limiti</p>
               </div>
            </div>
            <div className="text-right relative">
                <div className="text-[10px] line-through text-slate-500 absolute -top-3 right-0">350 TL</div>
               <div className="text-xl font-black text-white">250 TL</div>
               <button className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest transition-colors mt-1">
                  SATIN AL
               </button>
            </div>
         </div>
      </div>
    
    </div>
  );
};
