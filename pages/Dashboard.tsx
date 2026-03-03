import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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


export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, recentDocuments = [] }) => {
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
        <div className="shrink-0 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {SECTORS.map((sector, index) => (
                <div 
                    key={sector.id}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl border border-white/10 shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group select-none h-32 md:h-40
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    ${activeSector === sector.id ? 'ring-2 ring-yellow-500/50 -translate-y-2 shadow-[0_0_25px_rgba(234,179,8,0.3)]' : 'hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:-translate-y-1'}
                    `}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/40 to-transparent"></div>
                    </div>
                    
                    {/* Active highlight border bottom */}
                    {activeSector === sector.id && (
                        <motion.div 
                            layoutId="activeSectorBorder"
                            className={`absolute bottom-0 left-0 right-0 h-1 ${sector.color} shadow-[0_0_10px_currentColor]`}
                        />
                    )}

                    {/* Content */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 ${activeSector === sector.id ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                        <div className={`mb-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 ${sector.color} bg-opacity-10 group-hover:scale-110 transition-transform shadow-lg`}>
                            <sector.icon size={28} className="text-white drop-shadow-md" />
                        </div>
                        <span className="font-black text-white text-[11px] md:text-xs uppercase tracking-widest text-center drop-shadow-md px-1 group-hover:text-yellow-400 transition-colors">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Left: Documents List (Scrollable) */}
            <div className="lg:col-span-3 flex flex-col bg-[#161922]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden h-[500px] shadow-2xl shadow-black/20">
                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                            <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight font-inter">DÖKÜMANLARIM</h3>
                            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Son belge hareketleri</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {recentDocuments.length > 0 && (
                            <>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] text-green-500 font-bold font-mono tracking-wider">CANLI</span>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {recentDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                            <FileText size={40} className="text-slate-700" />
                            <p className="text-sm font-medium">Henüz belge oluşturulmadı</p>
                        </div>
                    ) : (
                    <AnimatePresence>
                    {recentDocuments.map((doc, idx) => (
                        <motion.div 
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 flex items-center gap-4 hover:bg-white/[0.03] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-white/5 relative overflow-hidden"
                            onClick={() => onNavigate('my-documents')}
                        >
                            <div className={`p-2.5 rounded-lg bg-white/5 text-blue-400 shadow-lg shadow-black/20 relative group-hover:scale-110 transition-transform duration-300`}>
                                <FileText size={20} />
                            </div>
                            
                            <div className="flex-1 min-w-0 font-inter">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-white truncate tracking-tight">{doc.templateId}</h4>
                                    {doc.status === 'DRAFT' && (
                                         <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/10 font-bold uppercase tracking-wide">
                                            TASLAK
                                         </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                    <span className={`px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                                        doc.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        doc.status === 'DOWNLOADED' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            doc.status === 'COMPLETED' ? 'bg-emerald-500' : 
                                            doc.status === 'DOWNLOADED' ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}></div>
                                        {doc.status === 'COMPLETED' ? 'Tamamlandı' : doc.status === 'DOWNLOADED' ? 'İndirildi' : 'Taslak'}
                                    </span>
                                    <span className="text-slate-700">•</span>
                                    <span className="font-mono text-slate-400">{new Date(doc.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <button className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/5 active:scale-95">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Right: Quick Actions (Stacked to fit) */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                 {/* Certificate Banner */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className="h-44 relative rounded-2xl overflow-hidden group border border-blue-500/20 bg-gradient-to-br from-blue-900/40 via-blue-950/20 to-black/40 p-5 transition-all hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col justify-between"
                 >
                     <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Award size={90} className="text-blue-400 -rotate-12 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                     </div>
                     
                     <div className="relative z-10 w-full text-left">
                        <div className="p-2.5 w-fit rounded-xl bg-blue-500/20 backdrop-blur-md border border-blue-500/10 mb-3 shadow-lg">
                            <Award className="text-blue-400" size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight mb-1 drop-shadow-md">SERTİFİKA OLUŞTUR</h3>
                        <p className="text-xs text-blue-200/70 font-medium">Profesyonel başarı sertifikaları</p>
                     </div>

                     <div className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                         <div className="h-8 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                             <span>Oluştur</span>
                             <ChevronRight size={14} />
                         </div>
                     </div>
                 </button>

                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full my-2"></div>

                 {/* Action Buttons */}
                 <div className="flex-1 flex flex-col gap-4">
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                        className="flex-1 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-orange-500/10 hover:border-orange-500/40 hover:bg-orange-500/[0.05] flex flex-col items-center justify-center gap-3 group transition-all shadow-lg hover:shadow-orange-500/10"
                    >
                        <div className="p-3.5 bg-orange-500/10 rounded-xl text-orange-500 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20">
                            <ClipboardList size={26} />
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-orange-500/70 transition-colors">HIZLI İŞLEM</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight">TUTANAK TUT</div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Rapor' })}
                        className="flex-1 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/[0.05] flex flex-col items-center justify-center gap-3 group transition-all shadow-lg hover:shadow-emerald-500/10"
                    >
                        <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20">
                            <Activity size={26} />
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-emerald-500/70 transition-colors">GÜNLÜK</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight">RAPOR OLUŞTUR</div>
                        </div>
                    </button>
                    
                     <button 
                        onClick={() => onNavigate('my-documents')}
                        className="flex-1 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-purple-500/10 hover:border-purple-500/40 hover:bg-purple-500/[0.05] flex flex-col items-center justify-center gap-3 group transition-all relative overflow-hidden shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="p-3.5 bg-purple-500/10 rounded-xl text-purple-500 group-hover:scale-110 transition-transform relative z-10 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20">
                            <Archive size={26} />
                        </div>
                        <div className="text-center relative z-10">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-500/70 transition-colors">ARŞİV</div>
                             <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight">DOKÜMANLARIM</div>
                        </div>
                         {/* Shine effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"></div>
                    </button>
                 </div>
            </div>
        </div>

        {/* Marketing Pricing Section */}
        <div className="mt-8 mb-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ABONELİK PAKETLERİ</h2>
                    <p className="text-sm text-slate-400">İhtiyacınıza uygun paketi seçin, hemen kazanmaya başlayın</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Shield size={14} className="text-green-500" />
                    <span>GÜVENLİ ÖDEME</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>ANINDA AKTİVASYON</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
             {/* Standard Plan */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="relative group bg-[#161922] border border-white/10 rounded-2xl p-0.5 overflow-hidden flex flex-col"
             >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="relative bg-[#0f1115]/90 backdrop-blur-xl rounded-[14px] h-full p-6 flex flex-col">
                     <div className="mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Shield className="text-blue-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">BAŞLANGIÇ</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Yeni başlayan işletmeler için temel doküman erişimi.</p>
                     </div>
                     
                     <div className="my-6 space-y-3">
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                             <span>Aylık <span className="text-white font-bold">100</span> Belge Limiti</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                             <span>Temel Şablonlar</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                             <span>PDF Çıktı Alma</span>
                         </div>
                     </div>

                     <div className="mt-auto pt-6 border-t border-white/5">
                         <div className="flex items-end gap-1 mb-4">
                             <span className="text-3xl font-black text-white">100 ₺</span>
                             <span className="text-xs text-slate-500 font-bold mb-1.5">/ AY</span>
                         </div>
                         <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                             HEMEN BAŞLA
                         </button>
                     </div>
                 </div>
             </motion.div>

             {/* PRO Plan - Highlighted */}
             <motion.div 
                whileHover={{ y: -8 }}
                className="relative group rounded-2xl p-0.5 overflow-hidden flex flex-col shadow-[0_0_40px_rgba(234,179,8,0.15)] z-10"
             >
                 {/* Animated Border Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 animate-gradient-xy"></div>
                 
                 <div className="relative bg-[#0f1115] rounded-[14px] h-full p-1 flex flex-col">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent"></div>
                    
                    <div className="bg-[#12141a] rounded-[12px] h-full p-5 flex flex-col relative overflow-hidden">
                        <div className="absolute top-3 right-3">
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-orange-500/20">
                                EN POPÜLER
                            </span>
                        </div>

                        <div className="mb-4 mt-2">
                             <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 border border-yellow-500/20">
                                 <Star className="text-yellow-500 fill-yellow-500" size={28} />
                             </div>
                             <h3 className="text-2xl font-black text-white mb-1">PROFESYONEL</h3>
                             <p className="text-xs text-slate-400 font-medium leading-relaxed">Büyüyen işletmeler için gelişmiş özellikler.</p>
                        </div>
                        
                        <div className="my-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="p-0.5 rounded-full bg-yellow-500/20 text-yellow-500"><CheckCircle2 size={14} /></div>
                                <span>Aylık <span className="text-white font-bold">500</span> Belge Limiti</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="p-0.5 rounded-full bg-yellow-500/20 text-yellow-500"><CheckCircle2 size={14} /></div>
                                <span>Tüm Sektörel Şablonlar</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="p-0.5 rounded-full bg-yellow-500/20 text-yellow-500"><CheckCircle2 size={14} /></div>
                                <span>Öncelikli Destek</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="p-0.5 rounded-full bg-yellow-500/20 text-yellow-500"><CheckCircle2 size={14} /></div>
                                <span>Şirket Logosu Ekleme</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 relative">
                             <div className="flex items-end gap-1 mb-4">
                                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">175 ₺</span>
                                 <span className="text-xs text-slate-500 font-bold mb-1.5">/ AY</span>
                             </div>
                             <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black text-sm transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                                 AVANTAJLI PAKETİ SEÇ
                             </button>
                        </div>
                    </div>
                 </div>
             </motion.div>

             {/* Premium / Enterprise */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="relative group bg-[#161922] border border-white/10 rounded-2xl p-0.5 overflow-hidden flex flex-col"
             >
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="relative bg-[#0f1115]/90 backdrop-blur-xl rounded-[14px] h-full p-6 flex flex-col">
                     <div className="mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="text-purple-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">PREMIUM</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Büyük ölçekli operasyonlar ve sınırsız erişim.</p>
                     </div>
                     
                     <div className="my-6 space-y-3">
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                             <span className="text-white font-bold shadow-purple-500/50 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">SINIRSIZ Belge</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                             <span>Bütün Özellikler</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                             <span>7/24 Canlı Destek</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-300">
                             <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                             <span>Özel Entegrasyonlar</span>
                         </div>
                     </div>

                     <div className="mt-auto pt-6 border-t border-white/5">
                         <div className="flex items-end gap-2 mb-4">
                             <span className="text-xs line-through text-slate-600 mb-1.5">350 ₺</span>
                             <span className="text-3xl font-black text-white">250 ₺</span>
                             <span className="text-xs text-slate-500 font-bold mb-1.5">/ AY</span>
                         </div>
                         <button className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                             PREMIUM GEÇİŞ
                         </button>
                     </div>
                 </div>
             </motion.div>
            </div>
        </div>

      </div>
    </div>
  );
};
