import React, { useState } from 'react';
import { 
  Factory, 
  Building2, 
  Pickaxe, 
  HardHat, 
  Zap, 
  Truck, 
  Briefcase, 
  FileText, 
  Plus, 
  Archive, 
  FileCheck, 
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Lock,
  Search,
  Download,
  Star,
  Award,
  Shield,
  Activity,
  ClipboardList,
  Hammer,
  Beaker,
  ShoppingBag
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

const SECTORS = [
  { 
    id: 'factory', 
    name: 'FABRİKA', 
    icon: Factory, 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    color: 'bg-rose-600', 
    docs: ['Üretim Takip', 'Kalite Kontrol', 'Vardiya Listesi', 'Bakım Formu']
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    color: 'bg-blue-600', 
    docs: ['Gelir Gider', 'Personel Listesi', 'Toplantı Tutanağı', 'Fatura Kayıt']
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Hammer, 
    image: 'https://images.unsplash.com/photo-1518558997970-4ddc236affd2?auto=format&fit=crop&q=80&w=600',
    color: 'bg-amber-500', 
    docs: ['Patlatma Raporu', 'Gaz Ölçüm', 'Vardiya Çizelgesi', 'Risk Analizi']
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
    color: 'bg-orange-600', 
    docs: ['Şantiye Günlüğü', 'Hakediş Raporu', 'İş Güvenliği', 'Malzeme Talep']
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
    color: 'bg-yellow-600', 
    docs: ['Sayaç Okuma', 'Arıza Kayıt', 'Trafo Bakım', 'Enerji Tüketim']
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    color: 'bg-emerald-600', 
    docs: ['Laboratuvar', 'MSDS Formu', 'Atık Takip', 'Numune Kayıt']
  },
  { 
    id: 'small_business', 
    name: 'KÜÇÜK İŞLETME', 
    icon: ShoppingBag, 
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600',
    color: 'bg-purple-600', 
    docs: ['Cari Hesap', 'Müşteri Kayıt', 'Satış Fişi', 'Stok Takip']
  }
];

const RECENT_DOCS = [
  { id: 1, title: 'Risk Analiz Raporu', icon: FileText, color: 'text-blue-400', count: 10, total: 10, used: 2 },
  { id: 2, title: 'Patlayıcıdan Korunma Dök.', icon: AlertTriangle, color: 'text-orange-400', count: 10, total: 10, used: 4 },
  { id: 3, title: 'Yangından Korunma Dök.', icon: Activity, color: 'text-red-400', count: 10, total: 10, used: 1 },
  { id: 4, title: 'Yüksekte Çalışma Dök.', icon: HardHat, color: 'text-blue-300', count: 10, total: 10, used: 0 },
  { id: 5, title: 'Elektrik İşlerinde Dök.', icon: Zap, color: 'text-yellow-400', count: 200, total: 200, used: 15 },
  { id: 6, title: 'İşe Başlama Eğitim Dök.', icon: CheckCircle2, color: 'text-green-400', count: 200, total: 200, used: 45 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-6 font-sans overflow-x-hidden pb-32">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-8 pt-4 md:pt-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-wider uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] animate-slide-up leading-tight">
          YILLIK DOKÜMANLAR <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse">&</span> İŞ TAKİP PANELİ
        </h1>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-[10px] md:text-[11px] lg:text-xs font-bold text-yellow-500/80 uppercase tracking-[0.2em] md:tracking-[0.3em] relative mt-4 md:mt-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent -z-10 hidden md:block"></div>
          {SECTORS.map((s, i) => (
            <React.Fragment key={s.id}>
              <span className="bg-[#0f1115] px-2 md:px-3 py-1 rounded-full border border-white/5 hover:border-yellow-500/30 transition-colors cursor-default whitespace-nowrap">{s.name}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sectors Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {SECTORS.map((sector) => (
          <div 
            key={sector.id}
            onMouseEnter={() => setActiveSector(sector.id)}
            onMouseLeave={() => setActiveSector(null)}
            onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
            className={`
              relative h-40 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group select-none
              ${activeSector === sector.id ? 'ring-2 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] -translate-y-2 scale-105 z-10' : 'hover:border-white/30 hover:shadow-lg hover:-translate-y-1'}
            `}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
               <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/60 to-transparent"></div>
            </div>
            
            {/* Left Border Accent */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${sector.color} shadow-[0_0_10px_currentColor]`}></div>

            {/* Default State Content */}
            <div className={`
              absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500
              ${activeSector === sector.id ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 grid place-content-center'}
            `}>
              <div className={`p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 mb-3 shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10 ${sector.color} bg-opacity-10`}>
                <sector.icon size={24} className="text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
              </div>
              <span className="font-black text-white text-[10px] md:text-xs uppercase tracking-widest text-center drop-shadow-lg group-hover:text-yellow-400 transition-colors">
                 {sector.name}
              </span>
            </div>

            {/* Hover State Content - "Sektör Detay Yeri" */}
            <div className={`
              absolute inset-0 bg-[#0f1115]/90 backdrop-blur-xl flex flex-col justify-center transition-all duration-500 p-4 border-l-4 ${sector.color}
              ${activeSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
            `}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                <sector.icon size={14} className="text-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{sector.name}</span>
              </div>
              
              <ul className="space-y-1.5">
                {sector.docs.map((doc, idx) => (
                  <li 
                    key={idx} 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('templates', { search: doc });
                    }}
                    className="flex items-center gap-2 group/item cursor-pointer hover:bg-white/5 p-1 rounded transition-colors" 
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-1 h-1 rounded-full bg-yellow-500 group-hover/item:scale-150 transition-transform"></div>
                    <span className="text-[9px] text-slate-300 group-hover/item:text-white font-bold uppercase tracking-tight transition-colors line-clamp-1">
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Left Column: Documents List */}
        <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      <FileText size={20} className="text-blue-500" />
                   </div>
                   <div>
                       <h3 className="text-sm font-black text-white uppercase tracking-wider">
                           REFERANS DOKÜMANLAR
                       </h3>
                       <p className="text-[10px] text-slate-400 font-medium">Sık kullanılan belge şablonları ve kullanım oranları</p>
                   </div>
                </div>
            </div>

            <div className="bg-[#161922]/80 backdrop-blur-xl rounded-2xl border border-white/10 divide-y divide-white/5 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {RECENT_DOCS.map((doc, idx) => (
                <div key={doc.id} className="p-4 flex items-center gap-5 hover:bg-white/[0.03] transition-colors group/item relative cursor-pointer">
                  {/* Left Border Highlight on Hover */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${doc.color.replace('text-', 'bg-')} scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300`}></div>
                  
                  <div className={`p-3 rounded-xl bg-white/5 group-hover/item:bg-white/10 ${doc.color} border border-white/5 shadow-lg group-hover/item:shadow-[0_0_15px_currentColor] transition-all duration-300`}>
                    <doc.icon size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors tracking-wide mb-1">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                         <span className="bg-white/5 px-1.5 rounded text-slate-400 font-mono">ID: #{1000 + doc.id}</span>
                         <span>•</span>
                         <span>Son güncelleme: Bugün</span>
                      </div>
                  </div>
                  
                  <div className="flex-[2] hidden lg:block px-6">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          <span>Kullanım Oranı</span>
                          <span className={doc.color}>{Math.round((doc.used / doc.total) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#0f1115] rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div 
                              className={`h-full rounded-full ${doc.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] relative overflow-hidden`} 
                              style={{ width: `${(doc.used / doc.total) * 100}%` }}
                          >
                               <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                          </div>
                      </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 whitespace-nowrap min-w-[120px] text-right bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="text-white font-black text-sm">{doc.total}</span> <span className="text-[10px] opacity-60">BELGE/AY</span>
                  </div>
                  
                  <div className="opacity-0 group-hover/item:opacity-100 transition-opacity absolute right-2 text-slate-600">
                       <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-1 space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
             <div className="flex items-center justify-center mb-4 relative py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full absolute top-1/2"></div>
                <span className="bg-[#0f1115] px-3 text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] relative z-10 shadow-[0_0_20px_#0f1115]">
                    HIZLI İŞLEMLER
                </span>
            </div>

            <button 
                onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                className="w-full p-5 md:p-6 h-auto md:h-40 rounded-2xl bg-gradient-to-br from-blue-900/40 via-blue-950/30 to-[#0f1115] border border-blue-500/20 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 group text-left flex flex-row md:flex-col items-center md:items-start justify-between relative overflow-hidden ring-1 ring-inset ring-white/5 gap-4"
            >
              <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity duration-500 hidden md:block">
                <Star size={100} className="text-blue-500/10 -rotate-12 translate-x-8 -translate-y-8" />
              </div>
              
              <div className="flex justify-between items-start relative z-10 w-full md:w-auto">
                  <div className="flex items-center gap-3 md:block">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
                        <Award size={24} className="md:w-7 md:h-7" />
                      </div>
                      <div className="md:hidden">
                        <div className="font-black text-white text-lg tracking-tight group-hover:text-blue-200 transition-colors drop-shadow-md">SERTİFİKA</div>
                        <div className="text-[10px] text-blue-300/60 font-medium">Personel yetkinlik belgesi</div>
                      </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-300 uppercase tracking-widest animate-pulse self-center md:self-start">YENİ</div>
              </div>
              
              <div className="relative z-10 hidden md:block">
                <div className="font-black text-white text-xl tracking-tight group-hover:text-blue-200 transition-colors drop-shadow-md">SERTİFİKA</div>
                <div className="text-[10px] text-blue-300/60 font-medium leading-relaxed max-w-[80%]">Personel yetkinlik ve başarı belgeleri oluştur</div>
              </div>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                    onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                    className="p-4 h-auto md:h-32 rounded-2xl bg-gradient-to-br from-orange-900/30 via-orange-950/20 to-[#0f1115] border border-orange-500/20 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 group flex items-center md:flex-col justify-between gap-4"
                >
                  <div className="self-start p-2.5 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
                    <ClipboardList size={22} />
                  </div>
                  <div className="text-right md:text-left flex-1 md:flex-none">
                    <div className="text-[9px] text-orange-500 font-bold mb-0.5 opacity-80 uppercase tracking-wider">KAYIT</div>
                    <div className="font-black text-white text-sm tracking-wide">TUTANAK</div>
                  </div>
                </button>

                 <button 
                    onClick={() => onNavigate('templates', { search: 'Rapor' })}
                    className="p-4 h-auto md:h-32 rounded-2xl bg-gradient-to-br from-emerald-900/30 via-emerald-950/20 to-[#0f1115] border border-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group flex items-center md:flex-col justify-between gap-4"
                >
                  <div className="self-start p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Activity size={22} />
                  </div>
                  <div className="text-right md:text-left flex-1 md:flex-none">
                    <div className="text-[9px] text-emerald-500 font-bold mb-0.5 opacity-80 uppercase tracking-wider">GÜNLÜK</div>
                    <div className="font-black text-white text-sm tracking-wide">RAPOR</div>
                  </div>
                </button>
            </div>


             <button 
                onClick={() => onNavigate('my-documents')}
                className="w-full p-6 bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:bg-purple-900/30 transition-all duration-300 group text-left flex items-center justify-between rounded-2xl relative overflow-hidden ring-1 ring-inset ring-white/5"
            >
              <div className="flex items-center gap-5 relative z-10">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <Archive size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400 font-bold mb-0.5 opacity-80 uppercase tracking-widest">ARŞİV</div>
                    <div className="font-black text-white text-lg tracking-tight group-hover:text-purple-200 transition-colors">DOKÜMANLARIM</div>
                  </div>
              </div>
              
              <div className="hidden group-hover:block animate-fade-in relative z-10">
                  <ChevronRight className="text-purple-400" />
              </div>

              {/* Background Decor */}
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                   <FileText size={100} />
              </div>
            </button>
        </div>
      </div>

       {/* Footer / Pricing Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up pb-12 mt-8 md:mt-12" style={{ animationDelay: '0.5s' }}>
            
            {/* Standard Plan */}
            <div className="bg-[#161922] rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4 group hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 mb-2">
                    <Shield size={32} />
                </div>
                
                <div className="relative z-10 w-full">
                    <h3 className="font-black text-white text-xl tracking-wide uppercase group-hover:text-blue-200 transition-colors">STANDART</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 mb-4">BAŞLANGIÇ PAKETİ</p>
                    
                    <div className="w-full h-px bg-white/5 mb-4"></div>
                    
                    <div className="text-3xl font-black text-white mb-4 tracking-tight">100 ₺</div>
                    <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-blue-500 hover:shadow-lg">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* Gold Plan */}
            <div className="relative bg-[#1a1608] rounded-2xl p-6 border border-yellow-500/30 flex flex-col items-center text-center gap-4 group hover:border-yellow-400 transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:shadow-[0_0_50px_rgba(234,179,8,0.2)] md:scale-110 z-10 overflow-hidden ring-1 ring-yellow-500/20 md:ring-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-yellow-500/30">
                   EN POPÜLER
                </div>

                <div className="p-4 bg-yellow-500/20 text-yellow-500 rounded-2xl border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] mb-2 mt-4">
                     <Star size={32} className="fill-yellow-500/20" />
                </div>

                <div className="relative z-10 w-full">
                    <h3 className="font-black text-yellow-500 text-2xl tracking-wide uppercase drop-shadow-sm">GOLD</h3>
                    <p className="text-[10px] text-yellow-200/60 font-bold tracking-widest mt-1 mb-4">2 KAT LİMİT</p>
                    
                    <div className="w-full h-px bg-yellow-500/20 mb-4"></div>

                    <div className="text-4xl font-black text-yellow-500 mb-4 tracking-tight drop-shadow-sm">175 ₺</div>
                    <button className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:-translate-y-0.5 transform">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#1a1025] rounded-2xl p-6 border border-purple-500/20 flex flex-col items-center text-center gap-4 group hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-300 mb-2">
                     <CheckCircle2 size={32} />
                </div>

                <div className="relative z-10 w-full">
                    <h3 className="font-black text-white text-xl tracking-wide uppercase group-hover:text-purple-200 transition-colors">PREMIUM</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 mb-4">SINIRSIZ ERİŞİM</p>
                    
                    <div className="w-full h-px bg-white/5 mb-4"></div>

                    <div className="relative inline-block mb-4">
                        <div className="text-[10px] line-through text-slate-600 absolute -top-4 right-0 font-mono">350 ₺</div>
                        <div className="text-3xl font-black text-white tracking-tight">250 ₺</div>
                    </div>
                    
                    <button className="w-full py-3 rounded-xl bg-purple-900/50 hover:bg-purple-600 text-purple-200 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        SATIN AL
                    </button>
                </div>
            </div>
       </div>
    </div>
  );
};
