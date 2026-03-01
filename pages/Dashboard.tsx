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
  Store
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
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    color: 'bg-rose-600', 
    docs: ['Üretim Takip', 'Kalite Kontrol', 'Vardiya Listesi', 'Bakım Formu']
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
    color: 'bg-blue-600', 
    docs: ['Gelir Gider', 'Personel Listesi', 'Toplantı Tutanağı', 'Fatura Kayıt']
  },
  { 
    id: 'mine', 
    name: 'MADEN İŞLEMLERİ', 
    icon: Hammer, 
    image: 'https://images.unsplash.com/photo-1516937941344-00b4ec0c9038?auto=format&fit=crop&q=80&w=400',
    color: 'bg-amber-500', 
    docs: ['Patlatma Raporu', 'Gaz Ölçüm', 'Vardiya Çizelgesi', 'Risk Analizi']
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
    color: 'bg-orange-600', 
    docs: ['Şantiye Günlüğü', 'Hakediş Raporu', 'İş Güvenliği', 'Malzeme Talep']
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400',
    color: 'bg-yellow-600', 
    docs: ['Sayaç Okuma', 'Arıza Kayıt', 'Trafo Bakım', 'Enerji Tüketim']
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400',
    color: 'bg-emerald-600', 
    docs: ['Laboratuvar', 'MSDS Formu', 'Atık Takip', 'Numune Kayıt']
  },
  { 
    id: 'small_business', 
    name: 'KÜÇÜK İŞLETME', 
    icon: Store, 
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400',
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
    <div className="min-h-screen bg-[#0f1115] text-white p-6 font-sans">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-8 pt-4">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wider uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          YILLIK DOKÜMANLAR <span className="text-yellow-500">&</span> İŞ TAKİP PANELİ
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs font-bold text-yellow-500/80 uppercase tracking-[0.2em] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-px bg-yellow-500/20 -z-10"></div>
          {SECTORS.map((s, i) => (
            <React.Fragment key={s.id}>
              <span className="bg-[#0f1115] px-2">{s.name}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sectors Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {SECTORS.map((sector) => (
          <div 
            key={sector.id}
            onMouseEnter={() => setActiveSector(sector.id)}
            onMouseLeave={() => setActiveSector(null)}
            className={`
              relative h-32 rounded-xl border border-white/10 shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
              ${activeSector === sector.id ? 'ring-1 ring-yellow-500/50 shadow-yellow-500/20' : 'hover:border-white/30'}
            `}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
               <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-all duration-300" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            
            {/* Left Border Accent */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${sector.color}`}></div>

            {/* Default State Content */}
            <div className={`
              absolute inset-0 flex flex-col items-center justify-center p-2 transition-all duration-300
              ${activeSector === sector.id ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
            `}>
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 mb-2 shadow-lg">
                <sector.icon size={20} className="text-white" />
              </div>
              <span className="font-black text-white text-[11px] md:text-xs uppercase tracking-wider text-center drop-shadow-md">
                 {sector.name}
              </span>
            </div>

            {/* Hover State Content - "Sektör Detay Yeri" */}
            <div className={`
              absolute inset-0 bg-[#0f1115]/95 backdrop-blur-md flex flex-col justify-center transition-all duration-300 p-4
              ${activeSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
              <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b border-white/10">
                <sector.icon size={16} className="text-yellow-500" />
                <span className="text-[11px] font-black text-white uppercase tracking-wider">{sector.name}</span>
              </div>
              
              <ul className="space-y-2">
                {sector.docs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 group/item cursor-pointer">
                    <ChevronRight size={12} className="text-yellow-500 opacity-0 group-hover/item:opacity-100 transition-all -ml-3 group-hover/item:ml-0" />
                    <span className="text-[10px] text-slate-400 group-hover/item:text-white font-bold uppercase tracking-tight transition-colors">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Left Column: Documents List */}
        <div className="lg:col-span-3">
             <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    DOKÜMANLAR LİSTESİ
                </h3>
                <div className="text-[10px] font-mono text-slate-500 flex gap-4">
                    <span>LİMİT DURUMU</span>
                    <span>|</span>
                    <span>ADET / AY</span>
                </div>
            </div>

            <div className="bg-[#161922] rounded-xl border border-white/10 divide-y divide-white/5 shadow-2xl">
              {RECENT_DOCS.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                  <div className={`p-2 rounded-lg bg-white/5 ${doc.color} border border-white/5`}>
                    <doc.icon size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors tracking-wide">
                        {doc.title}
                      </h4>
                  </div>
                  
                  <div className="flex-[2] hidden md:block px-4">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                              className={`h-full rounded-full ${doc.color.replace('text-', 'bg-')}`} 
                              style={{ width: `${(doc.used / doc.total) * 100}%` }}
                          ></div>
                      </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 whitespace-nowrap min-w-[100px] text-right">
                      <span className="text-white font-bold">{doc.total}</span> ADET / AY
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-1 space-y-3">
             <div className="flex items-center justify-center mb-2 relative">
                <div className="h-px bg-white/10 w-full absolute top-1/2"></div>
                <span className="bg-[#0f1115] px-2 text-[10px] font-bold text-yellow-500 uppercase tracking-widest relative z-10">
                    HIZLI İŞLEMLER
                </span>
            </div>

            <button 
                onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                className="w-full p-8 rounded-xl bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-500/50 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all group text-left flex items-center gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-50">
                <Star size={80} className="text-blue-500/10 -rotate-12 translate-x-4 -translate-y-4" />
              </div>
              
              <div className="relative p-4 bg-blue-500/20 rounded-xl text-blue-400 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 animate-pulse">
                <Award size={32} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[10px] text-blue-400 font-black bg-blue-950/50 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">YENİ ÖZELLİK</div>
                </div>
                <div className="font-black text-white text-xl tracking-wide drop-shadow-md group-hover:text-blue-200 transition-colors">SERTİFİKA OLUŞTUR</div>
                <div className="text-[10px] text-blue-300/60 font-medium mt-1">Personel yetkinlik belgeleri</div>
              </div>
            </button>

            <button 
                onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-900/40 to-orange-800/20 border border-orange-500/30 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all group text-left flex items-center gap-4"
            >
              <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                <ClipboardList size={24} />
              </div>
              <div>
                <div className="text-[9px] text-orange-400 font-bold mb-0.5 opacity-80 uppercase">YENİ KAYIT</div>
                <div className="font-black text-white text-sm tracking-wide">TUTANAK TUT</div>
              </div>
            </button>

             <button 
                onClick={() => onNavigate('templates', { search: 'Rapor' })}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all group text-left flex items-center gap-4"
            >
              <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-[9px] text-emerald-400 font-bold mb-0.5 opacity-80 uppercase">GÜNLÜK</div>
                <div className="font-black text-white text-sm tracking-wide">RAPOR TUT</div>
              </div>
            </button>

             <button 
                onClick={() => onNavigate('mydocuments')}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all group text-left flex items-center gap-4"
            >
              <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                <Archive size={24} />
              </div>
              <div>
                <div className="text-[9px] text-purple-400 font-bold mb-0.5 opacity-80 uppercase">ARŞİV</div>
                <div className="font-black text-white text-sm tracking-wide">DOKÜMANLAR</div>
              </div>
            </button>
        </div>
      </div>

       {/* Footer / Pricing Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Standard Plan */}
            <div className="bg-gradient-to-r from-[#1a2030] to-[#161922] rounded-xl p-4 border border-blue-900/50 flex items-center justify-between group hover:border-blue-500 transition-all shadow-lg">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                          <Shield size={24} />
                     </div>
                     <div>
                        <h3 className="font-black text-white text-lg tracking-wide uppercase">STANDART</h3>
                        <p className="text-[10px] text-blue-300 font-medium tracking-wider">STANDART DOKÜMAN LİMİTİ</p>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-white mb-1">100 TL</div>
                    <button className="px-4 py-1.5 rounded bg-slate-700 hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* Gold Plan */}
            <div className="relative bg-gradient-to-r from-[#382808] to-[#1e1a12] rounded-xl p-4 border border-yellow-600 flex items-center justify-between group hover:border-yellow-400 transition-all shadow-lg scale-105 z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                   ÖNERİLEN
                </div>
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20">
                          <Shield size={24} />
                     </div>
                     <div>
                        <h3 className="font-black text-yellow-500 text-lg tracking-wide uppercase">GOLD</h3>
                        <p className="text-[10px] text-yellow-200/70 font-medium tracking-wider">2 KAT DOKÜMAN LİMİTİ</p>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-yellow-500 mb-1">175 TL</div>
                    <button className="px-4 py-1.5 rounded bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest transition-all">
                        SATIN AL
                    </button>
                </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-r from-[#29173a] to-[#161922] rounded-xl p-4 border border-purple-900/50 flex items-center justify-between group hover:border-purple-500 transition-all shadow-lg">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                          <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h3 className="font-black text-white text-lg tracking-wide uppercase">PREMIUM</h3>
                        <p className="text-[10px] text-purple-300 font-medium tracking-wider">3 KAT DOKÜMAN LİMİTİ</p>
                     </div>
                </div>
                <div className="text-right relative">
                    <div className="text-[10px] line-through text-slate-500 absolute -top-3 right-0">350 TL</div>
                    <div className="text-xl font-black text-white mb-1">250 TL</div>
                    <button className="px-4 py-1.5 rounded bg-purple-800 hover:bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                        SATIN AL
                    </button>
                </div>
            </div>
       </div>
    </div>
  );
};
