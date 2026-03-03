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
  Wallet,
  Crown,
  Settings
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
    <div className="min-h-screen bg-[#1a1a1d] text-slate-200 font-sans overflow-x-hidden flex flex-col relative w-full pt-14 md:pt-16 pb-8 bg-titanium-brushed">
      
      {/* Ambient Light / Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-ambient-glow pointer-events-none z-0 mix-blend-soft-light"></div>
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse"></div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-4 md:px-8 w-full max-w-[1920px] mx-auto z-10 h-full relative">
        
        {/* Header - Compact */}
        <div className="text-center mb-10 mt-2 shrink-0 relative z-20">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-600 tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-center gap-3">
            <span className="text-emboss-heavy">YILLIK DOKÜMANLAR</span> 
            <span className="text-yellow-500 mx-2 hidden md:inline animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">&</span> 
            <span className="md:hidden text-yellow-500">&</span> 
            <span className="text-emboss-heavy">İŞ TAKİP PANELİ</span>
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
                        ? 'border-jewel-active z-20 scale-105' 
                        : 'border-yellow-900/40 hover:border-yellow-600/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-90 hover:opacity-100'}
                    `}
                    style={{
                        background: activeSector === sector.id 
                            ? 'linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 100%)' 
                            : 'linear-gradient(135deg, #1c1c1f 0%, #0d0d0f 100%)',
                        boxShadow: activeSector === sector.id ? '0 0 40px rgba(234, 179, 8, 0.2), inset 0 0 20px rgba(234, 179, 8, 0.05)' : ''
                    }}
                >
                    {/* Background Image with Noise/Texture */}
                    <div className="absolute inset-0 z-0">
                        <img src={sector.image} alt={sector.name} className={`w-full h-full object-cover transition-all duration-700 ${activeSector === sector.id ? 'opacity-40 grayscale-0' : 'opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60'}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent"></div>
                        <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-br ${sector.color} to-transparent mix-blend-overlay ${activeSector === sector.id ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}></div>
                    </div>
                    
                    {/* Metallic Shine Effect on Hover (Shine Sweep) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 rotate-12 z-10 pointer-events-none"></div>

                    {/* Content */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 z-20 ${activeSector === sector.id ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                        <div className={`mb-3 p-3.5 rounded-full bg-gradient-to-br from-[#2a2a2e] to-[#000] border border-yellow-500/20 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300`}>
                            <sector.icon size={28} className="text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" />
                        </div>
                        <span className="font-black text-amber-50 text-[11px] md:text-xs uppercase tracking-widest text-center text-emboss-heavy px-1 group-hover:text-yellow-400 transition-colors">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            
            {/* Left: Documents List (Carbon & Gold Detail) */}
            <div className="lg:col-span-3 flex flex-col bg-[#111] rounded-3xl border border-white/10 overflow-hidden h-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative z-10 bg-fiber-carbon">
                 {/* Top Metallic Bar */}
                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#1c1c1f] to-[#121215] shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-700/10 border border-amber-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)] ring-1 ring-amber-500/10">
                            <FileText size={22} className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 uppercase tracking-widest font-sans drop-shadow-sm text-gold-glow">DÖKÜMANLAR</h3>
                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest opacity-80">Doküman Listesi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {recentDocuments.length > 0 && (
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-emerald-500/30 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#22c55e]"></span>
                                </span>
                                <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-wider text-glow drop-shadow-md">CANLI AKIŞ</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {/* Inner Shadow for Depth */}
                    <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>

                    {recentDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 opacity-50">
                            <div className="p-6 rounded-full bg-white/5 shadow-inner border border-white/5">
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
                            className="group relative border-b border-white/[0.05] transition-colors cursor-pointer hover:bg-white/[0.02]"
                            onClick={() => onNavigate('my-documents')}
                        >
                            {/* Detailed Row Background */}
                             <div className={`absolute inset-0 ${idx % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}></div>

                            <div className="px-6 py-4 flex items-center gap-6 relative z-10">
                                {/* Icon Badge - Detailed Enamel Pin Style */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#2a2a30] to-[#121215] border border-white/10 shadow-[0_4px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300 relative overflow-hidden`}>
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                    <FileText size={20} className="text-slate-400 group-hover:text-amber-400 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,1)]" />
                                </div>
                                
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white truncate tracking-tight transition-colors drop-shadow-sm">{doc.templateId}</h4>
                                        <span className="font-mono text-[10px] text-amber-600/80 group-hover:text-amber-500 transition-colors bg-amber-900/10 px-1.5 py-0.5 rounded border border-amber-900/20">#{doc.id.substring(0,6)}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] font-medium">
                                        {/* Status Badge - Pin Style */}
                                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border shadow-sm ${
                                            doc.status === 'COMPLETED' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 
                                            doc.status === 'DOWNLOADED' ? 'bg-blue-950/40 border-blue-500/30 text-blue-400' : 
                                            'bg-amber-950/40 border-amber-500/30 text-amber-400'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ring-1 ring-black/50 ${
                                                doc.status === 'COMPLETED' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 
                                                doc.status === 'DOWNLOADED' ? 'bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]' : 
                                                'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                                            }`}></div>
                                            <span className="uppercase tracking-wider text-[9px] font-black text-shadow-sm">
                                                {doc.status === 'COMPLETED' ? 'TAMAMLANDI' : doc.status === 'DOWNLOADED' ? 'İNDİRİLDİ' : 'TASLAK'}
                                            </span>
                                        </div>
                                        <span className="text-slate-700">|</span>
                                        <span className="font-bold text-slate-500 group-hover:text-slate-400 transition-colors">{new Date(doc.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>

                                {/* Count / Limits Highlight */}
                                <div className="hidden md:flex flex-col items-end justify-center min-w-[80px]">
                                     <span className="text-xs font-black text-amber-500/90 text-gold-glow tracking-widest group-hover:text-amber-400 transition-colors">1 ADET</span>
                                     <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mt-0.5"></div>
                                </div>

                                <div className="text-right pl-2">
                                     <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#222] border border-white/5 text-slate-500 hover:bg-amber-600 hover:text-black hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 opacity-60 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 btn-marble">
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

            {/* Right Panel: Quick Actions (Image Replication) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                 
                 {/* 1. Certificate Banner (Blue Card) */}
                 <button 
                    onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                    className="relative h-40 rounded-xl overflow-hidden group border border-blue-500/30 shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-transform"
                 > 
                     {/* Blue Gradient Background */}
                     <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900 z-0"></div>
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay z-0"></div>
                     
                     <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded shadow z-20 animate-pulse">YENİ</div>

                     <div className="relative z-10 flex flex-col justify-center h-full p-4 items-center text-center">
                         <div className="mb-2 p-2 bg-blue-500/50 rounded-full border border-blue-300/30 shadow-lg">
                             <Award size={32} className="text-white drop-shadow-md" />
                         </div>
                         <h3 className="text-xl font-black text-white leading-tight drop-shadow-md text-emboss">SERTİFİKA<br/>OLUŞTUR</h3>
                         <div className="absolute bottom-2 right-2 opacity-50">
                             <img src="https://www.transparenttextures.com/patterns/always-grey.png" className="w-16 h-16 object-contain mix-blend-overlay opacity-30" alt="" />
                         </div>
                     </div>
                     
                     {/* Decorative Scroll/Certificate graphic could go here if available */}
                     <div className="absolute -bottom-4 -right-4 text-blue-950 opacity-40 transform -rotate-12">
                         <FileText size={80} fill="currentColor" />
                     </div>
                 </button>

                 {/* 2. Quick Actions Header */}
                 <div className="relative flex items-center justify-center my-1">
                     <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-white/10"></div>
                     </div>
                     <div className="relative z-10 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 px-6 py-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-400">
                         <span className="text-black text-xs font-black tracking-widest uppercase drop-shadow-sm">HIZLI İŞLEMLER</span>
                     </div>
                 </div>

                 {/* 3. Stacked Action Buttons */}
                 <div className="flex flex-col gap-3">
                    {/* Tutanak Tut */}
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                        className="w-full p-3 rounded-xl bg-[#202025] border-l-4 border-l-yellow-600 border-y border-r border-white/5 hover:bg-[#2a2a30] group transition-all flex items-center gap-4 shadow-lg active:scale-95"
                    >
                        <div className="p-2 bg-yellow-900/20 rounded-lg border border-yellow-600/30 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                            <ClipboardList size={20} className="text-yellow-600 group-hover:text-black transition-colors" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-black text-slate-200 group-hover:text-white tracking-wide">TUTANAK TUT</span>
                        </div>
                        <ChevronRight className="ml-auto text-stone-600 group-hover:text-white transition-colors" size={16} />
                    </button>
                    
                    {/* Günlük Rapor Tut */}
                    <button 
                        onClick={() => onNavigate('templates', { search: 'Rapor' })}
                        className="w-full p-3 rounded-xl bg-[#202025] border-l-4 border-l-emerald-600 border-y border-r border-white/5 hover:bg-[#2a2a30] group transition-all flex items-center gap-4 shadow-lg active:scale-95"
                    >
                         <div className="p-2 bg-emerald-900/20 rounded-lg border border-emerald-600/30 group-hover:bg-emerald-600 group-hover:text-black transition-colors">
                            <FileCheck size={20} className="text-emerald-500 group-hover:text-black transition-colors" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-black text-slate-200 group-hover:text-white tracking-wide">GÜNLÜK RAPOR TUT</span>
                        </div>
                        <ChevronRight className="ml-auto text-stone-600 group-hover:text-white transition-colors" size={16} />
                    </button>
                    
                    {/* Doküman Arşivi */}
                     <button 
                        onClick={() => onNavigate('my-documents')}
                        className="w-full p-3 rounded-xl bg-[#202025] border-l-4 border-l-purple-600 border-y border-r border-white/5 hover:bg-[#2a2a30] group transition-all flex items-center gap-4 shadow-lg active:scale-95"
                    >
                         <div className="p-2 bg-purple-900/20 rounded-lg border border-purple-600/30 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Archive size={20} className="text-purple-500 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col items-start">
                             <span className="text-sm font-black text-slate-200 group-hover:text-white tracking-wide">DOKÜMAN ARŞİVİ</span>
                        </div>
                        <ChevronRight className="ml-auto text-stone-600 group-hover:text-white transition-colors" size={16} />
                    </button>

                    {/* PDF İndir / Yazdır (Red Button) */}
                    <button className="w-full mt-2 p-3 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-red-900 border border-red-700 hover:brightness-110 group transition-all flex items-center justify-center gap-3 shadow-[0_5px_15px_rgba(220,38,38,0.4)] active:scale-95">
                         <Download size={20} className="text-white drop-shadow-sm" />
                         <span className="text-sm font-black text-white tracking-wide drop-shadow-md">PDF İNDİR / YAZDIR</span>
                    </button>
                 </div>
            </div>
        </div>

        {/* Armor Plate Pricing Section - Horizontal & Compact */}
        <div className="mt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Standard Plan - Silver Armor Plate */}
                <motion.div 
                    whileHover={{ y: -4 }}
                    className="relative rounded-xl p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-gradient-to-b from-slate-400 to-slate-700 active:scale-95 transition-transform"
                >   
                    {/* Metallic Shine on Edge */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/50 z-20"></div>

                    <div className="relative h-full bg-[#1c1c22] rounded-[11px] p-4 flex items-center justify-between group overflow-hidden armor-plate-silver">
                        {/* Brushed Metal Texture */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-300/10 via-transparent to-black/40 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                            {/* Embossed Icon Well */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-slate-300 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.4)]">
                                <Shield className="text-slate-700 drop-shadow-sm" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-base font-black text-slate-200 tracking-wider drop-shadow-md text-emboss">GÜMÜŞ</h3>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Başlangıç Paketi</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 relative z-10">
                             <div className="text-2xl font-black text-slate-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">100 ₺</div>
                             <button className="px-5 py-1.5 rounded-full bg-gradient-to-b from-white to-slate-200 text-slate-800 font-black text-[10px] shadow-[0_2px_5px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,1)] border border-white hover:scale-105 transition-transform">
                                SEÇ
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Gold Plan - Gold Armor Plate (Highlighted) */}
                 <motion.div 
                    whileHover={{ y: -4 }}
                    className="relative rounded-xl p-[1px] shadow-[0_15px_40px_rgba(234,179,8,0.2)] bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-800 z-10 active:scale-95 transition-transform"
                >   
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-yellow-600 text-[10px] text-white font-black px-3 py-1 rounded-full shadow-lg z-40 border border-yellow-400/50 tracking-wider">EN POPÜLER</div>

                    <div className="relative h-full bg-[#2a1c0a] rounded-[11px] p-4 flex items-center justify-between group overflow-hidden armor-plate-gold">
                        {/* Gold Texture */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-black/50 pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            {/* Gold Embossed Icon Well */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-200 to-amber-500 border-2 border-yellow-300 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.4)]">
                                <Star className="text-amber-900 drop-shadow-sm" size={20} />
                            </div>
                             <div className="flex flex-col">
                                <h3 className="text-base font-black text-amber-100 tracking-wider drop-shadow-md text-emboss">ALTIN</h3>
                                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Profesyonel</div>
                            </div>
                        </div>

                         <div className="flex flex-col items-end gap-1 relative z-10">
                             <div className="text-2xl font-black text-amber-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-gold-glow">175 ₺</div>
                             <button className="px-5 py-1.5 rounded-full bg-gradient-to-b from-yellow-50 to-amber-100 text-amber-900 font-black text-[10px] shadow-[0_0_15px_rgba(251,191,36,0.6),inset_0_1px_0_rgba(255,255,255,1)] border border-white hover:scale-105 transition-transform">
                                ABONE OL
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Platinum Plan - Dark Steel Armor */}
                 <motion.div 
                    whileHover={{ y: -4 }}
                    className="relative rounded-xl p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-gradient-to-b from-slate-600 to-slate-900 active:scale-95 transition-transform"
                >   
                    <div className="relative h-full bg-[#0f172a] rounded-[11px] p-4 flex items-center justify-between group overflow-hidden">
                        {/* Carbon Texture */}
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-black/60 pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            {/* Blue Steel Icon Well */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-600 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.5),0_2px_5px_rgba(0,0,0,0.5)]">
                                <Zap className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" size={20} />
                            </div>
                             <div className="flex flex-col">
                                <h3 className="text-base font-black text-white tracking-wider drop-shadow-md text-emboss">PLATİN</h3>
                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Sınırsız</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 relative z-10">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] line-through text-slate-500 font-bold mb-0.5">350 ₺</span>
                                <span className="text-2xl font-black text-blue-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">250 ₺</span>
                            </div>
                             <button className="px-5 py-1.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 font-black text-[10px] shadow-[0_2px_5px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] border border-slate-300 hover:scale-105 transition-transform">
                                GEÇİŞ YAP
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
