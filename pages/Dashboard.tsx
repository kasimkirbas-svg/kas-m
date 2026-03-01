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
  ShoppingBag,
  Store,
  Wallet
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
    icon: Pickaxe, 
    image: 'https://images.unsplash.com/photo-1516937941344-00b4ec0c9038?auto=format&fit=crop&q=80&w=600',
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
    icon: Wallet, 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=600',
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
    <div className="h-screen bg-[#0f1115] text-white font-sans overflow-hidden flex flex-col relative w-full pt-16 md:pt-20">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Content Container - Flex Column to fill height */}
      <div className="flex-1 flex flex-col px-4 md:px-6 w-full max-w-[1920px] mx-auto z-10 h-full pb-4">
        
        {/* Header - Compact */}
        <div className="text-center mb-4 shrink-0 -mt-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wider uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-tight flex items-center justify-center gap-2">
            <span>YILLIK DOKÜMANLAR</span> <span className="text-yellow-500 mx-2">&</span> <span>İŞ TAKİP PANELİ</span>
            </h1>
        </div>

        {/* Sectors Row - Compact & Important */}
        <div className="shrink-0 mb-4">
            <div className="grid grid-cols-7 gap-2 h-24 md:h-28">
                {SECTORS.map((sector, index) => (
                <div 
                    key={sector.id}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl border border-white/10 shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group select-none h-full
                    ${index === SECTORS.length - 1 ? 'col-span-1' : ''}
                    ${activeSector === sector.id ? 'ring-1 ring-yellow-500/50 -translate-y-1 z-10' : 'hover:border-white/30 hover:-translate-y-0.5'}
                    `}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/40 to-transparent"></div>
                    </div>
                    
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${sector.color} shadow-[0_0_10px_currentColor]`}></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                        <div className={`mb-auto mt-3 p-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 ${sector.color} bg-opacity-10`}>
                            <sector.icon size={18} className="text-white" />
                        </div>
                        <span className="font-black text-white text-[10px] uppercase tracking-wider text-center drop-shadow-md truncate w-full px-1">
                            {sector.name}
                        </span>
                    </div>

                    {/* Hover List (Overlay) */}
                    <div className={`
                    absolute inset-0 bg-[#0f1115]/95 backdrop-blur-xl flex flex-col justify-center p-3 border-l-2 ${sector.color} transition-opacity duration-300
                    ${activeSector === sector.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}>
                        <ul className="space-y-1">
                            {sector.docs.slice(0, 3).map((doc, idx) => (
                            <li 
                                key={idx} 
                                onClick={(e) => { e.stopPropagation(); onNavigate('templates', { search: doc }); }}
                                className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1 rounded" 
                            >
                                <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                                <span className="text-[9px] text-slate-300 hover:text-white font-bold uppercase truncate">{doc}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* Content Area - Filling remaining height */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0 mb-4">
            
            {/* Left: Documents List (Scrollable) */}
            <div className="lg:col-span-3 flex flex-col min-h-0 bg-[#161922]/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">REFERANS DOKÜMANLAR</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">EN ÇOK KULLANILANLAR</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {RECENT_DOCS.map((doc, idx) => (
                        <div key={doc.id} className="p-2 flex items-center gap-3 hover:bg-white/[0.03] rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                            <div className={`p-2 rounded-lg bg-white/5 ${doc.color}`}>
                                <doc.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{doc.title}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-24 bg-[#0f1115] rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${doc.color.replace('text-', 'bg-')}`} style={{ width: `${(doc.used / doc.total) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-mono">{Math.round((doc.used / doc.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400">{doc.total} ADET</div>
                                <div className="text-[8px] text-slate-600 uppercase">AYLIK LİMİT</div>
                            </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                <ChevronRight size={14} className="text-slate-600" />
                            </div>
                        </div>
                    ))}
                     {/* Duplicate for visual fullness if needed or just real data */}
                     {RECENT_DOCS.map((doc, idx) => (
                        <div key={'dup-'+doc.id} className="p-2 flex items-center gap-3 hover:bg-white/[0.03] rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                            <div className={`p-2 rounded-lg bg-white/5 ${doc.color}`}>
                                <doc.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{doc.title}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-24 bg-[#0f1115] rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${doc.color.replace('text-', 'bg-')}`} style={{ width: `${(doc.used / doc.total) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-mono">{Math.round((doc.used / doc.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400">{doc.total} ADET</div>
                                <div className="text-[8px] text-slate-600 uppercase">AYLIK LİMİT</div>
                            </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                <ChevronRight size={14} className="text-slate-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Quick Actions (Stacked to fit) */}
            <div className="lg:col-span-1 flex flex-col gap-3 h-full min-h-0">
                 {/* Certificate Banner */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className="flex-1 relative rounded-2xl overflow-hidden group border border-blue-500/20 bg-gradient-to-br from-blue-900/40 via-blue-950/20 to-black/40 p-4 transition-all hover:border-blue-500/40"
                 >
                     <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Award size={64} className="text-blue-400 -rotate-12" />
                     </div>
                     <div className="relative z-10 text-left">
                         <div className="inline-block px-1.5 py-0.5 rounded bg-blue-500 text-white text-[9px] font-black uppercase mb-1 shadow-lg shadow-blue-500/40">YENİ</div>
                         <h3 className="text-lg font-black text-white italic tracking-tight">SERTİFİKA</h3>
                         <p className="text-[10px] text-blue-200 font-medium">Personel yetkinlik belgesi oluştur</p>
                     </div>
                     <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                         <Plus size={14} className="text-white" />
                     </div>
                 </button>

                 <div className="h-px bg-white/5 w-full my-1"></div>

                 {/* Action Buttons */}
                 <div className="shrink-0 space-y-2">
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                        className="w-full p-3 rounded-xl bg-[#1a1608] border border-orange-500/20 hover:border-orange-500/50 flex items-center gap-3 group transition-all"
                    >
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:scale-110 transition-transform">
                            <ClipboardList size={18} />
                        </div>
                        <div className="text-left">
                            <div className="text-[8px] font-bold text-slate-500 uppercase">HIZLI İŞLEM</div>
                            <div className="text-xs font-black text-slate-200 group-hover:text-white">TUTANAK TUT</div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Rapor' })}
                        className="w-full p-3 rounded-xl bg-[#0f1d18] border border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-3 group transition-all"
                    >
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                            <Activity size={18} />
                        </div>
                        <div className="text-left">
                            <div className="text-[8px] font-bold text-slate-500 uppercase">GÜNLÜK</div>
                            <div className="text-xs font-black text-slate-200 group-hover:text-white">RAPOR OLUŞTUR</div>
                        </div>
                    </button>
                    
                     <button 
                        onClick={() => onNavigate('my-documents')}
                        className="w-full p-3 rounded-xl bg-[#1a1025] border border-purple-500/20 hover:border-purple-500/50 flex items-center gap-3 group transition-all relative overflow-hidden"
                    >
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 group-hover:scale-110 transition-transform relative z-10">
                            <Archive size={18} />
                        </div>
                        <div className="text-left relative z-10">
                             <div className="text-[8px] font-bold text-slate-500 uppercase">ARŞİV</div>
                             <div className="text-xs font-black text-slate-200 group-hover:text-white">DOKÜMANLARIM</div>
                        </div>
                         {/* Shine effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                 </div>
            </div>
        </div>

        {/* Footer: Pricing - Compact Fixed Height */}
        <div className="shrink-0 grid grid-cols-3 gap-4 h-20 md:h-24">
             {/* Standard */}
             <div className="bg-[#161922] border border-white/10 hover:border-blue-500/50 rounded-xl p-3 flex items-center justify-between group transition-all relative overflow-hidden">
                 <div className="flex items-center gap-3 relative z-10">
                      <Shield size={24} className="text-blue-500" />
                      <div>
                          <div className="text-sm font-black text-white">STANDART</div>
                          <div className="text-[9px] text-slate-400 font-bold">BAŞLANGIÇ</div>
                      </div>
                 </div>
                 <div className="text-right relative z-10">
                      <div className="text-lg font-black text-white">100 ₺</div>
                      <button className="px-3 py-1 bg-white/10 hover:bg-blue-600 rounded text-[9px] font-bold text-white transition-colors">SATIN AL</button>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>

             {/* Gold */}
             <div className="bg-gradient-to-tl from-[#1a1608] to-black border border-yellow-500/30 hover:border-yellow-400 rounded-xl p-3 flex items-center justify-between group transition-all relative overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                 <div className="absolute top-0 right-0 px-2 py-0.5 bg-yellow-500 text-black text-[8px] font-black uppercase rounded-bl-lg z-20">ÖNERİLEN</div>
                 <div className="flex items-center gap-3 relative z-10">
                      <Star size={24} className="text-yellow-500 fill-yellow-500/20" />
                      <div>
                          <div className="text-lg font-black text-yellow-500">GOLD</div>
                          <div className="text-[9px] text-yellow-500/60 font-bold">2 KAT LİMİT</div>
                      </div>
                 </div>
                 <div className="text-right relative z-10">
                      <div className="text-xl font-black text-yellow-500">175 ₺</div>
                      <button className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded text-[9px] font-black shadow-lg shadow-yellow-500/20 transition-colors">SATIN AL</button>
                 </div>
             </div>

             {/* Premium */}
             <div className="bg-[#1a1025] border border-purple-500/20 hover:border-purple-500/50 rounded-xl p-3 flex items-center justify-between group transition-all relative overflow-hidden">
                 <div className="flex items-center gap-3 relative z-10">
                      <CheckCircle2 size={24} className="text-purple-500" />
                      <div>
                          <div className="text-sm font-black text-white">PREMIUM</div>
                          <div className="text-[9px] text-slate-400 font-bold">SINIRSIZ</div>
                      </div>
                 </div>
                 <div className="text-right relative z-10">
                      <div className="flex flex-col items-end">
                          <span className="text-[9px] line-through text-slate-600">350 ₺</span>
                          <span className="text-lg font-black text-white leading-none">250 ₺</span>
                      </div>
                      <button className="mt-1 px-3 py-1 bg-purple-500/20 hover:bg-purple-600 rounded text-[9px] font-bold text-purple-200 hover:text-white border border-purple-500/30 transition-colors">SATIN AL</button>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
        </div>

      </div>
    </div>
  );
};
