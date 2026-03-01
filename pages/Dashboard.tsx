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
    image: '/sectors/factory.jpg',
    color: 'bg-rose-600', 
    docs: [
      'Üretim Takip Formu', 'Günlük Kalite Raporu', 'Makine Bakım Kartı', 'Vardiya Teslim Tutanağı',
      'Hammadde Giriş Formu', 'Sevkiyat Kontrol Listesi', 'Personel İzin Formu', 'İş Kazası Tutanağı',
      'Atık Takip Çizelgesi', 'Stok Sayım Raporu'
    ]
  },
  { 
    id: 'company', 
    name: 'ŞİRKET', 
    icon: Building2, 
    image: '/sectors/company.jpg',
    color: 'bg-blue-600', 
    docs: [
      'Personel Özlük Dosyası', 'Yıllık İzin Planı', 'Satın Alma Talep Formu', 'Masraf Bildirim Formu',
      'Toplantı Gündem Tutanağı', 'Ziyaretçi Kayıt Formu', 'Demirbaş Zimmet Formu', 'Performans Değerlendirme',
      'Eğitim Katılım Formu', 'Görevlendirme Yazısı'
    ]
  },
  { 
    id: 'mine', 
    name: 'MADEN', 
    icon: Pickaxe, 
    image: '/sectors/mine.jpg',
    color: 'bg-amber-500', 
    docs: [
      'Günlük Ocak Raporu', 'Patlatma Tutanağı', 'Gaz Ölçüm Kayıtları', 'Havalandırma Raporu',
      'Tahkimat Kontrol Formu', 'Kişisel Koruyucu Zimmet', 'Acil Durum Tatbikatı', 'Vardiya Mühendis Raporu',
      'Dinamit Depo Kayıt', 'Nakliye Sefer Fişi'
    ]
  },
  { 
    id: 'construction', 
    name: 'İNŞAAT', 
    icon: HardHat, 
    image: '/sectors/construction.jpg',
    color: 'bg-orange-600', 
    docs: [
      'Şantiye Günlük Defteri', 'İş İskelesi Kontrol', 'Beton Döküm Tutanağı', 'Hakediş İcmal Tablosu',
      'Taşeron Sözleşme Eki', 'Malzeme Talep Fişi', 'Elektrik Tesisat Kontrol', 'Vinç Periyodik Kontrol',
      'İSG Kurul Tutanağı', 'Kazı İzni Formu'
    ]
  },
  { 
    id: 'energy', 
    name: 'ENERJİ', 
    icon: Zap, 
    image: '/sectors/energy.jpg',
    color: 'bg-yellow-600', 
    docs: [
      'Trafo Bakım Formu', 'Sayaç Okuma Listesi', 'Kesinti Bildirim Formu', 'İletim Hattı Kontrol',
      'Termal Kamera Raporu', 'Topraklama Ölçüm Raporu', 'Jeneratör Test Formu', 'Panel Temizlik Kaydı',
      'Yüksek Gerilim İzni', 'Arıza Müdahale Raporu'
    ]
  },
  { 
    id: 'chemistry', 
    name: 'KİMYA', 
    icon: Beaker, 
    image: '/sectors/chemistry.jpg',
    color: 'bg-emerald-600', 
    docs: [
      'Laboratuvar Analiz Raporu', 'Kimyasal Stok Takip', 'MSDS Kontrol Formu', 'Atık Bertaraf Kaydı',
      'Kalibrasyon Takip Formu', 'Soğutma Suyu Analizi', 'Reaktör Temizlik Formu', 'Numune Etiketleme',
      'Biyolojik Risk Analizi', 'Dökülme Müdahale Planı'
    ]
  },
  { 
    id: 'small_business', 
    name: 'KÜÇÜK İŞLETME', 
    icon: Wallet, 
    image: '/sectors/small_business.jpg',
    color: 'bg-purple-600', 
    docs: [
      'Günlük Kasa Raporu', 'Veresiye Defteri', 'Müşteri Sipariş Formu', 'Fiyat Teklif Şablonu',
      'Stok Sayım Listesi', 'Personel Maaş Pusulası', 'Gider Pusulası', 'Tahsilat Makbuzu',
      'İade Tutanağı', 'Garanti Belgesi Takip'
    ]
  }
];

const RECENT_DOCS = [
  { id: 1, title: 'Risk Analiz Raporu', icon: FileText, color: 'text-blue-400', count: 10, total: 10, used: 2 },
  { id: 2, title: 'Patlatma Tutanağı', icon: AlertTriangle, color: 'text-orange-400', count: 15, total: 20, used: 8 },
  { id: 3, title: 'Yangın Tatbikat Raporu', icon: Activity, color: 'text-red-400', count: 10, total: 12, used: 3 },
  { id: 4, title: 'İş İskelesi Kontrol Formu', icon: HardHat, color: 'text-blue-300', count: 25, total: 50, used: 12 },
  { id: 5, title: 'Trafo Bakım Çizelgesi', icon: Zap, color: 'text-yellow-400', count: 5, total: 5, used: 1 },
  { id: 6, title: 'Kimyasal Stok Listesi', icon: Beaker, color: 'text-emerald-400', count: 30, total: 30, used: 28 },
  { id: 7, title: 'Günlük Kasa Raporu', icon: Wallet, color: 'text-purple-400', count: 30, total: 30, used: 15 },
  { id: 8, title: 'İşe Başlama Eğitim Dök.', icon: CheckCircle2, color: 'text-green-400', count: 200, total: 200, used: 45 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans overflow-x-hidden flex flex-col relative w-full pt-14 md:pt-16 pb-8">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Content Container - Flex Column to fill height */}
      <div className="flex-1 flex flex-col px-4 md:px-8 w-full max-w-[1920px] mx-auto z-10 h-full">
        
        {/* Header - Compact */}
        <div className="text-center mb-6 shrink-0 -mt-4">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-tight flex flex-col md:flex-row items-center justify-center gap-2">
            <span>YILLIK DOKÜMANLAR</span> <span className="text-yellow-500 mx-2 hidden md:inline">&</span> <span className="md:hidden text-yellow-500">&</span> <span>İŞ TAKİP PANELİ</span>
            </h1>
        </div>

        {/* Sectors Row - Compact & Important */}
        <div className="shrink-0 mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
                {SECTORS.map((sector, index) => (
                <div 
                    key={sector.id}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl border border-white/10 shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group select-none h-32 md:h-40
                    ${index === SECTORS.length - 1 ? 'col-span-2 lg:col-span-1' : ''}
                    ${activeSector === sector.id ? 'ring-1 ring-yellow-500/50 -translate-y-1 z-10 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'hover:border-white/30 hover:-translate-y-1'}
                    `}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/50 to-transparent"></div>
                    </div>
                    
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${sector.color} shadow-[0_0_10px_currentColor]`}></div>

                    {/* Content */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 ${activeSector === sector.id ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                        <div className={`mb-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 ${sector.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                            <sector.icon size={24} className="text-white" />
                        </div>
                        <span className="font-black text-white text-[10px] md:text-xs uppercase tracking-wider text-center drop-shadow-md px-1 group-hover:text-yellow-400 transition-colors">
                            {sector.name}
                        </span>
                    </div>

                    {/* Hover List (Overlay) */}
                    <div className={`
                    absolute inset-0 bg-[#0f1115]/95 backdrop-blur-xl flex flex-col justify-center p-4 border-l-2 ${sector.color} transition-all duration-300
                    ${activeSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                    `}>
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                            <sector.icon size={14} className="text-yellow-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{sector.name}</span>
                        </div>
                        <ul className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                            {sector.docs.map((doc, idx) => (
                            <li 
                                key={idx} 
                                onClick={(e) => { e.stopPropagation(); onNavigate('templates', { search: doc }); }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded group/item" 
                            >
                                <div className="w-1 h-1 rounded-full bg-yellow-500 group-hover/item:scale-150 transition-transform shrink-0"></div>
                                <span className="text-[10px] text-slate-300 group-hover/item:text-white font-bold uppercase truncate">{doc}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* Content Area - Filling remaining height */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            
            {/* Left: Documents List (Scrollable) */}
            <div className="lg:col-span-3 flex flex-col bg-[#161922]/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                            <FileText size={18} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">REFERANS DOKÜMANLAR</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Sık kullanılan belge şablonları</p>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">EN ÇOK KULLANILANLAR</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {RECENT_DOCS.map((doc, idx) => (
                        <div key={doc.id} className="p-3 flex items-center gap-4 hover:bg-white/[0.03] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                            <div className={`p-2.5 rounded-lg bg-white/5 ${doc.color} shadow-lg shadow-black/20`}>
                                <doc.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white truncate mb-1">{doc.title}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-32 bg-[#0f1115] rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${doc.color.replace('text-', 'bg-')}`} style={{ width: `${(doc.used / doc.total) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">{Math.round((doc.used / doc.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-slate-400">{doc.total} ADET</div>
                                <div className="text-[9px] text-slate-600 uppercase">AYLIK LİMİT</div>
                            </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
                            </div>
                        </div>
                    ))}
                     {/* Duplicate for visual fullness if needed or just real data */}
                     {RECENT_DOCS.map((doc, idx) => (
                        <div key={'dup-'+doc.id} className="p-3 flex items-center gap-4 hover:bg-white/[0.03] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                            <div className={`p-2.5 rounded-lg bg-white/5 ${doc.color} shadow-lg shadow-black/20`}>
                                <doc.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white truncate mb-1">{doc.title}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-32 bg-[#0f1115] rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${doc.color.replace('text-', 'bg-')}`} style={{ width: `${(doc.used / doc.total) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">{Math.round((doc.used / doc.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-slate-400">{doc.total} ADET</div>
                                <div className="text-[9px] text-slate-600 uppercase">AYLIK LİMİT</div>
                            </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Quick Actions (Stacked to fit) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                 {/* Certificate Banner */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className="h-40 relative rounded-2xl overflow-hidden group border border-blue-500/20 bg-gradient-to-br from-blue-900/40 via-blue-950/20 to-black/40 p-5 transition-all hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                 >
                     <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Award size={80} className="text-blue-400 -rotate-12" />
                     </div>
                     <div className="relative z-10 text-left h-full flex flex-col justify-between">
                         <div>
                             <div className="inline-block px-2 py-1 rounded bg-blue-500 text-white text-[10px] font-black uppercase mb-2 shadow-lg shadow-blue-500/40">YENİ</div>
                             <h3 className="text-xl font-black text-white italic tracking-tight">SERTİFİKA</h3>
                             <p className="text-xs text-blue-200 font-medium">Personel yetkinlik belgesi oluştur</p>
                         </div>
                         
                         <div className="flex items-center gap-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                             <span>Oluştur</span>
                             <ChevronRight size={12} />
                         </div>
                     </div>
                 </button>

                 <div className="h-px bg-white/5 w-full my-1"></div>

                 {/* Action Buttons */}
                 <div className="flex-1 flex flex-col gap-3">
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                        className="flex-1 p-4 rounded-xl bg-[#1a1608] border border-orange-500/20 hover:border-orange-500/50 flex items-center gap-4 group transition-all"
                    >
                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                            <ClipboardList size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">HIZLI İŞLEM</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white">TUTANAK TUT</div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Rapor' })}
                        className="flex-1 p-4 rounded-xl bg-[#0f1d18] border border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-4 group transition-all"
                    >
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <Activity size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">GÜNLÜK</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white">RAPOR OLUŞTUR</div>
                        </div>
                    </button>
                    
                     <button 
                        onClick={() => onNavigate('my-documents')}
                        className="flex-1 p-4 rounded-xl bg-[#1a1025] border border-purple-500/20 hover:border-purple-500/50 flex items-center gap-4 group transition-all relative overflow-hidden"
                    >
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 group-hover:scale-110 transition-transform relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            <Archive size={20} />
                        </div>
                        <div className="text-left relative z-10">
                             <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">ARŞİV</div>
                             <div className="text-sm font-black text-slate-200 group-hover:text-white">DOKÜMANLARIM</div>
                        </div>
                         {/* Shine effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                 </div>
            </div>
        </div>

        {/* Footer: Pricing - Cards Restored */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Standard */}
             <div className="bg-[#161922] border border-white/10 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col items-center justify-between group transition-all relative overflow-hidden h-40 hover:-translate-y-1 hover:shadow-xl">
                 <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex flex-col items-center gap-2 relative z-10 pt-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Shield size={24} />
                      </div>
                      <div className="text-center">
                          <div className="text-lg font-black text-white">STANDART</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">BAŞLANGIÇ</div>
                      </div>
                 </div>
                 <div className="text-center relative z-10 w-full">
                      <div className="text-2xl font-black text-white mb-2">100 ₺</div>
                      <button className="w-full py-2 bg-white/10 hover:bg-blue-600 rounded-lg text-[10px] font-bold text-white transition-colors uppercase tracking-widest">SATIN AL</button>
                 </div>
             </div>

             {/* Gold */}
             <div className="bg-gradient-to-tl from-[#1a1608] to-black border border-yellow-500/30 hover:border-yellow-400 rounded-2xl p-4 flex flex-col items-center justify-between group transition-all relative overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.1)] h-40 scale-105 z-10 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                 <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-500 text-black text-[9px] font-black uppercase rounded-bl-xl z-20">ÖNERİLEN</div>
                 <div className="flex flex-col items-center gap-2 relative z-10 pt-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                        <Star size={24} className="fill-yellow-500/20" />
                      </div>
                      <div className="text-center">
                          <div className="text-xl font-black text-yellow-500">GOLD</div>
                          <div className="text-[10px] text-yellow-500/60 font-bold uppercase tracking-widest">2 KAT LİMİT</div>
                      </div>
                 </div>
                 <div className="text-center relative z-10 w-full">
                      <div className="text-3xl font-black text-yellow-500 mb-2">175 ₺</div>
                      <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-[10px] font-black shadow-lg shadow-yellow-500/20 transition-colors uppercase tracking-widest">SATIN AL</button>
                 </div>
             </div>

             {/* Premium */}
             <div className="bg-[#1a1025] border border-purple-500/20 hover:border-purple-500/50 rounded-2xl p-4 flex flex-col items-center justify-between group transition-all relative overflow-hidden h-40 hover:-translate-y-1 hover:shadow-xl">
                 <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex flex-col items-center gap-2 relative z-10 pt-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="text-center">
                          <div className="text-lg font-black text-white">PREMIUM</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SINIRSIZ</div>
                      </div>
                 </div>
                 <div className="text-center relative z-10 w-full">
                      <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-xs line-through text-slate-600">350 ₺</span>
                          <span className="text-2xl font-black text-white">250 ₺</span>
                      </div>
                      <button className="w-full py-2 bg-purple-500/20 hover:bg-purple-600 rounded-lg text-[10px] font-bold text-purple-200 hover:text-white border border-purple-500/30 transition-colors uppercase tracking-widest">SATIN AL</button>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};
