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

  // Metalik, 3D arka plan ve ambient ışık
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-slate-200 font-sans overflow-x-hidden flex flex-col relative w-full pt-14 md:pt-16 pb-8 bg-metal-dark">
      
      {/* Ambient Light / Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse"></div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-4 md:px-8 w-full max-w-[1920px] mx-auto z-10 h-full relative">
        
        {/* Header - Compact */}
        <div className="text-center mb-10 mt-2 shrink-0 relative z-20">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] flex flex-col md:flex-row items-center justify-center gap-3">
            <span className="text-emboss">YILLIK DOKÜMANLAR</span> 
            <span className="text-yellow-500 mx-2 hidden md:inline animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">&</span> 
            <span className="md:hidden text-yellow-500">&</span> 
            <span className="text-emboss">İŞ TAKİP PANELİ</span>
            </h1>
        </div>

        {/* Sectors Row - Compact & Important */}
        <div className="shrink-0 mb-10 perspective-1000">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {SECTORS.map((sector, index) => (
                <motion.div 
                    key={sector.id}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 50 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setActiveSector(sector.id)}
                    onMouseLeave={() => setActiveSector(null)}
                    onClick={() => setActiveSector(activeSector === sector.id ? null : sector.id)}
                    className={`
                    relative rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer group select-none h-32 md:h-40 shadow-2xl
                    ${index === SECTORS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}
                    ${activeSector === sector.id 
                        ? 'border-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.4)] ring-1 ring-yellow-400/50 z-20' 
                        : 'border-white/10 hover:border-white/30 shadow-black/40'}
                    `}
                    style={{
                        background: 'linear-gradient(135deg, rgba(30,30,35,0.95), rgba(10,10,12,0.98))',
                        boxShadow: activeSector === sector.id ? '0 20px 50px -10px rgba(234, 179, 8, 0.3)' : ''
                    }}
                >
                    {/* Background Image with Noise/Texture */}
                    <div className="absolute inset-0 z-0">
                        <img src={sector.image} alt={sector.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-all duration-500 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/60 to-transparent"></div>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${sector.color} to-transparent mix-blend-overlay`}></div>
                    </div>
                    
                    {/* Metallic Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 pointer-events-none"></div>

                    {/* Content */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 z-20 ${activeSector === sector.id ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                        <div className={`mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                            <sector.icon size={28} className="text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </div>
                        <span className="font-black text-slate-200 text-[11px] md:text-xs uppercase tracking-widest text-center drop-shadow-[0_2px_2px_rgba(0,0,0,1)] px-1 group-hover:text-yellow-400 transition-colors">
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
                </motion.div>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Left: Documents List (Zebra Striped & Metallic) */}
            <div className="lg:col-span-3 flex flex-col bg-[#111115] rounded-3xl border border-white/5 overflow-hidden h-[550px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10">
                 {/* Top Metallic Bar */}
                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#1a1a20] to-[#121215] shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/10">
                            <FileText size={22} className="text-blue-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 uppercase tracking-widest font-sans drop-shadow-sm">DÖKÜMANLARIM</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-70">Canlı İşlem Akışı</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {recentDocuments.length > 0 && (
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-green-500/20 shadow-inner">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                                </span>
                                <span className="text-[10px] text-green-400 font-bold font-mono tracking-wider text-glow">CANLI AKIŞ</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1013] relative">
                    {/* Inner Shadow for Depth */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none"></div>

                    {recentDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 opacity-50">
                            <div className="p-6 rounded-full bg-white/5 shadow-inner">
                                <FileText size={48} className="text-slate-700" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">Henüz belge oluşturulmadı</p>
                        </div>
                    ) : (
                    <div className="flex flex-col w-full">
                    <AnimatePresence>
                    {recentDocuments.map((doc, idx) => (
                        <motion.div 
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="zebra-row group relative border-b border-white/[0.03] transition-colors cursor-pointer"
                            onClick={() => onNavigate('my-documents')}
                        >
                            <div className="px-6 py-4 flex items-center gap-5 relative z-10">
                                {/* Icon Badge */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#1e1e24] to-[#121215] border border-white/5 shadow-[0_2px_5px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:border-white/20 transition-all duration-300`}>
                                    <FileText size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-slate-300 group-hover:text-white truncate tracking-tight transition-colors">{doc.templateId}</h4>
                                        <span className="font-mono text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">#{doc.id.substring(0,6)}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] font-medium">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                                            doc.status === 'COMPLETED' ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-500' : 
                                            doc.status === 'DOWNLOADED' ? 'bg-blue-950/30 border-blue-500/20 text-blue-500' : 
                                            'bg-amber-950/30 border-amber-500/20 text-amber-500'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                doc.status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                                doc.status === 'DOWNLOADED' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                                                'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                            }`}></div>
                                            <span className="uppercase tracking-wide text-[9px] font-bold">
                                                {doc.status === 'COMPLETED' ? 'TAMAMLANDI' : doc.status === 'DOWNLOADED' ? 'İNDİRİLDİ' : 'TASLAK'}
                                            </span>
                                        </div>
                                        <span className="text-slate-600">|</span>
                                        <span className="font-bold text-slate-500 group-hover:text-slate-300 transition-colors">{new Date(doc.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>

                                <div className="text-right pl-4">
                                     <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                    </div>
                    )}
                </div>
            </div>

            {/* Right Panel: 3D Quick Actions */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full text-center">
                 
                 {/* 3D Certificate Banner */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className="h-44 relative rounded-2xl overflow-hidden group perspective-1000 transform transition-transform card-hover-3d border-metal active:scale-95"
                 >
                     <div className="absolute inset-0 bg-[#0f1015] z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-900/10 to-black z-0"></div>
                     {/* Shine Sweep Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine-sweep z-10 pointer-events-none"></div>

                     <div className="absolute top-2 right-2 z-30">
                         <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse">YENİ</span>
                     </div>

                     <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-60 transition-opacity z-10 duration-500">
                        <Award size={100} className="text-blue-500 -rotate-12 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                     </div>
                     
                     <div className="relative z-20 flex flex-col justify-between h-full p-5 text-left">
                         <div>
                            <div className="p-2.5 w-fit rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_5px_15px_rgba(37,99,235,0.4)] border border-blue-400/30 mb-3">
                                <Award className="text-white drop-shadow-md" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight mb-1 drop-shadow-md text-emboss">SERTİFİKA<br/>OLUŞTUR</h3>
                         </div>

                         <div className="flex items-center gap-2 group-hover:gap-4 transition-all">
                             <div className="h-8 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold flex items-center gap-2 shadow-[0_4px_10px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-blue-400/20 btn-pressable">
                                 <span className="text-shadow-sm">OLUŞTUR</span>
                                 <ChevronRight size={14} />
                             </div>
                         </div>
                     </div>
                 </button>

                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full my-1"></div>

                 {/* 3D Action Buttons */}
                 <div className="flex-1 flex flex-col gap-4">
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                        className="flex-1 p-4 rounded-xl bg-[#131318] border border-white/5 hover:border-orange-500/30 relative group transition-all btn-pressable overflow-hidden flex items-center gap-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="p-3 bg-gradient-to-br from-[#2a1b12] to-[#1a110d] rounded-xl border border-orange-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform z-10">
                            <ClipboardList size={22} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                        </div>
                        <div className="text-left relative z-10">
                            <div className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-0.5 group-hover:text-orange-500/70 transition-colors">HIZLI İŞLEM</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight drop-shadow-md">TUTANAK TUT</div>
                        </div>
                         <ChevronRight className="ml-auto text-white/20 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={16} />
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Rapor' })}
                        className="flex-1 p-4 rounded-xl bg-[#131318] border border-white/5 hover:border-emerald-500/30 relative group transition-all btn-pressable overflow-hidden flex items-center gap-4"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="p-3 bg-gradient-to-br from-[#0e231b] to-[#081510] rounded-xl border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform z-10">
                            <Activity size={22} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="text-left relative z-10">
                            <div className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-0.5 group-hover:text-emerald-500/70 transition-colors">GÜNLÜK</div>
                            <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight drop-shadow-md">RAPOR OLUŞTUR</div>
                        </div>
                        <ChevronRight className="ml-auto text-white/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={16} />
                    </button>
                    
                     <button 
                        onClick={() => onNavigate('my-documents')}
                        className="flex-1 p-4 rounded-xl bg-[#131318] border border-white/5 hover:border-purple-500/30 relative group transition-all btn-pressable overflow-hidden flex items-center gap-4"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="p-3 bg-gradient-to-br from-[#1e1029] to-[#120a1a] rounded-xl border border-purple-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform z-10">
                            <Archive size={22} className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        </div>
                        <div className="text-left relative z-10">
                             <div className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-0.5 group-hover:text-purple-500/70 transition-colors">ARŞİV</div>
                             <div className="text-sm font-black text-slate-200 group-hover:text-white tracking-tight drop-shadow-md">DOKÜMANLARIM</div>
                        </div>
                        <ChevronRight className="ml-auto text-white/20 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" size={16} />
                    </button>
                 </div>
            </div>
        </div>

        {/* Metal Pricing Section */}
        <div className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-md text-emboss">ABONELİK<span className="text-stone-500">_</span>PAKETLERİ</h2>
                    <p className="text-sm text-stone-400 font-bold tracking-tight">EN UYGUN PAKETLE BAŞLA</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-stone-500 bg-[#15151a] px-3 py-2 rounded border border-white/5 shadow-inner">
                    <Shield size={12} className="text-emerald-500" />
                    <span>GÜVENLİ ÖDEME</span>
                    <span className="w-1 h-1 rounded-full bg-stone-700"></span>
                    <span>ANINDA AKTİVASYON</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Standard Plan - Metal Plate */}
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="relative bg-[#18181b] rounded-xl p-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5"
                >   
                    {/* Metal Texture */}
                    <div className="absolute inset-0 bg-metal-pattern opacity-50 z-0 rounded-xl pointer-events-none"></div>
                    
                    {/* Bolts */}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-stone-700 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-stone-700 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-stone-700 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-stone-700 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>

                    <div className="relative h-full bg-[#1c1c22] rounded-lg border-2 border-[#2a2a30] p-6 flex flex-col items-center text-center z-10 hover:border-blue-500/30 transition-colors group">
                        <div className="w-16 h-16 rounded-full bg-[#15151a] border-2 border-[#25252b] flex items-center justify-center mb-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                             <Shield className="text-stone-500 group-hover:text-blue-500 transition-colors" size={28} />
                        </div>
                        <h3 className="text-xl font-black text-stone-300 mb-2 tracking-widest">BAŞLANGIÇ</h3>
                        <div className="h-px w-12 bg-stone-700 mb-4"></div>
                        <div className="text-3xl font-black text-white mb-6 drop-shadow-md">100 ₺ <span className="text-sm text-stone-500 font-bold">/AY</span></div>
                        
                        <div className="w-full space-y-3 mb-8 text-left pl-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-400">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                                <span>Aylık 100 Belge</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-400">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                                <span>Temel Şablonlar</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-400">
                                <div className="w-1.5 h-1.5 bg-stone-700 rounded-full"></div>
                                <span className="opacity-50">PDF Çıktı</span>
                            </div>
                        </div>

                        <button className="w-full mt-auto py-3 rounded bg-[#25252b] border-2 border-[#1a1a20] text-stone-400 font-black text-xs hover:text-white hover:border-blue-500/50 hover:bg-blue-600/10 transition-all shadow-md active:scale-95">
                            PAKETİ SEÇ
                        </button>
                    </div>
                </motion.div>

                {/* Pro Plan - Metal Plate */}
                 <motion.div 
                    whileHover={{ y: -8 }}
                    className="relative bg-[#18181b] rounded-xl p-1 shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5 z-10"
                >   
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-30 opacity-70"></div>

                    {/* Bolts */}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-stone-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-stone-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-stone-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-stone-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>

                    <div className="relative h-full bg-[#1f1f25] rounded-lg border-2 border-orange-500/20 p-6 flex flex-col items-center text-center z-10 group">
                        <div className="absolute top-2 right-2">
                            <span className="text-[9px] font-black bg-orange-500 text-black px-2 py-0.5 rounded shadow-[0_0_10px_rgba(249,115,22,0.5)]">POPÜLER</span>
                        </div>
                        
                        <div className="w-16 h-16 rounded-full bg-[#2a1b15] border-2 border-orange-500/30 flex items-center justify-center mb-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                             <Star className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]" size={28} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 tracking-widest drop-shadow-md">PROFESYONEL</h3>
                        <div className="h-px w-12 bg-orange-500 mb-4 shadow-[0_0_10px_orange]"></div>
                        <div className="text-3xl font-black text-orange-400 mb-6 drop-shadow-md">175 ₺ <span className="text-sm text-stone-500 font-bold">/AY</span></div>
                        
                        <div className="w-full space-y-3 mb-8 text-left pl-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                                <span>Aylık 500 Belge</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                                <span>Tüm Sektörel Şablonlar</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                                <span>Logo Ekleme</span>
                            </div>
                        </div>

                         <button className="w-full mt-auto py-3 rounded bg-gradient-to-br from-orange-600 to-orange-700 text-white font-black text-xs btn-3d transition-all hover:brightness-110 active:scale-95 shadow-[0_4px_10px_rgba(249,115,22,0.3)]">
                            SATIN AL
                        </button>
                    </div>
                </motion.div>

                {/* Premium Plan - Gold Neon Plate */}
                 <motion.div 
                    whileHover={{ y: -8 }}
                    className="relative bg-[#15151a] rounded-xl p-1 shadow-[0_0_30px_rgba(234,179,8,0.15)] z-10"
                >   
                    {/* Neon Gold Border Animation */}
                    <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 animate-gradient-xy opacity-70 blur-sm"></div>
                    <div className="absolute inset-0 bg-[#15151a] rounded-xl z-0"></div>

                    {/* Bolts */}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-yellow-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-yellow-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-yellow-600 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.8)] border border-black/50 z-20"></div>

                    <div className="relative h-full bg-[#18181c] rounded-lg border border-yellow-500/30 p-6 flex flex-col items-center text-center z-10 group">
                         <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none"></div>

                        <div className="w-16 h-16 rounded-full bg-[#292010] border-2 border-yellow-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                             <Zap className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-yellow-100 mb-2 tracking-widest drop-shadow-md text-emboss">PREMIUM</h3>
                         <div className="h-px w-12 bg-yellow-400 mb-4 shadow-[0_0_15px_yellow]"></div>
                        
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-xs line-through text-stone-600 font-bold mb-1.5">350 ₺</span>
                            <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">250 ₺</span>
                            <span className="text-xs text-yellow-600 font-bold mb-1.5">/AY</span>
                        </div>
                        
                        <div className="w-full space-y-3 mb-8 text-left pl-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-yellow-100">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(234,179,8,1)] animate-pulse"></div>
                                <span className="text-yellow-200">SINIRSIZ Belge</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                <span>Tüm Özellikler +</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                <span>7/24 Canlı Destek</span>
                            </div>
                        </div>

                         <button className="w-full mt-auto py-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-700 text-black font-black text-sm btn-3d transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                            PREMIUM'A GEÇ
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>

      </div>
    </div>
  );
};
