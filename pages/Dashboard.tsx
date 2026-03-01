import React, { useRef } from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, Award, 
  Download, History, Clock, FileInput, Activity, ClipboardList,
  Construction, Factory, Building2, Zap, Beaker, Store, Flame,
  FileCheck, ChevronDown, Calendar, Users, Stethoscope, Briefcase, Hammer,
  Search, ArrowRight, Star
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
  const [hoveredSector, setHoveredSector] = React.useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const sectors = [
    { id: 'factory', title: 'FABRİKA', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', color: 'border-blue-500', gradient: 'from-blue-600', searchQuery: 'Üretim', icon: Factory },
    { id: 'company', title: 'ŞİRKET', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', color: 'border-slate-500', gradient: 'from-slate-600', searchQuery: 'Kurumsal', icon: Building2 },
    { id: 'mine', title: 'MADEN', image: 'https://images.unsplash.com/photo-1516937941344-00b4ec0c9038?auto=format&fit=crop&q=80&w=800', color: 'border-orange-700', gradient: 'from-orange-700', searchQuery: 'Maden', icon: Construction },
    { id: 'construction', title: 'İNŞAAT', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800', color: 'border-yellow-600', gradient: 'from-yellow-600', searchQuery: 'İnşaat', icon: Construction },
    { id: 'energy', title: 'ENERJİ', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', color: 'border-amber-500', gradient: 'from-amber-500', searchQuery: 'Enerji', icon: Zap },
    { id: 'chemistry', title: 'KİMYA', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800', color: 'border-emerald-600', gradient: 'from-emerald-600', searchQuery: 'Kimya', icon: Beaker },
    { id: 'small_business', title: 'KÜÇÜK İŞLETME', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800', color: 'border-pink-500', gradient: 'from-pink-500', searchQuery: 'Esnaf', icon: Store }
  ];

  const Lightning = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  const Helmet = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12h20"/><path d="M7 21a2 2 0 0 0 2-2v-4.5"/><path d="M15 21a2 2 0 0 0 2-2v-4.5"/><path d="M12 2v4"/><path d="M12 2A9.97 9.97 0 0 0 2 12"/><path d="M22 12a9.97 9.97 0 0 0-10-10"/></svg>
  );

  const defaultRightSideMenu = [
    { label: 'İş Eğitimleri', icon: FileCheck },
    { label: 'İş Belgeleri', icon: FileText },
    { label: 'İş Formları', icon: ClipboardList },
    { label: 'İş Evrakları', icon: FileInput },
    { label: 'İş Sertifikaları', icon: Award },
  ];

  const sectorMenus: Record<string, typeof defaultRightSideMenu> = {
    factory: [
      { label: 'Makine Bakım', icon: Construction },
      { label: 'Üretim Raporu', icon: ClipboardList },
      { label: 'Vardiya Listesi', icon: Clock },
      { label: 'Kalite Kontrol', icon: CheckCircle2 },
      { label: 'İSG Talimatları', icon: Shield },
    ],
    company: [
      { label: 'Personel Listesi', icon: Users },
      { label: 'Maaş Bordrosu', icon: FileText },
      { label: 'İzin Formları', icon: Calendar },
      { label: 'SGK Girişleri', icon: FileInput },
      { label: 'Duyurular', icon: AlertTriangle },
    ],
    mine: [
        { label: 'Patlatma Raporu', icon: Flame },
        { label: 'Gaz Ölçüm', icon: Activity },
        { label: 'Ocak Planı', icon: FileText },
        { label: 'Ekipman Takip', icon: Construction },
        { label: 'Acil Durum', icon: AlertTriangle },
    ],
    construction: [
        { label: 'Şantiye Defteri', icon: ClipboardList },
        { label: 'Hakediş Raporu', icon: FileText },
        { label: 'İş Güvenliği', icon: Helmet },
        { label: 'Malzeme Takip', icon: Store },
        { label: 'Proje Planı', icon: Calendar },
    ],
    energy: [
        { label: 'Trafo Bakım', icon: Zap },
        { label: 'Sayaç Okuma', icon: Activity },
        { label: 'Kesinti Raporu', icon: AlertTriangle },
        { label: 'Hat Kontrol', icon: Construction },
        { label: 'Enerji Analizi', icon: FileText },
    ],
    chemistry: [
        { label: 'MSDS Formları', icon: FileText },
        { label: 'Laboratuvar', icon: Beaker },
        { label: 'Atık Yönetimi', icon: AlertTriangle },
        { label: 'Stok Takip', icon: ClipboardList },
        { label: 'Kalite Analiz', icon: Activity },
    ],
    small_business: [
        { label: 'Cari Hesap', icon: FileText },
        { label: 'Stok Durumu', icon: Store },
        { label: 'Fatura Kes', icon: FileInput },
        { label: 'Personel', icon: Users },
        { label: 'Vergi Takip', icon: Calendar },
    ]
  };

  // Safe access to sector menu or default
  const currentRightSideMenu = hoveredSector && sectorMenus[hoveredSector] 
    ? sectorMenus[hoveredSector] 
    : defaultRightSideMenu;

  const documentList = [
    { icon: FileCheck, name: 'Risk Analiz Raporu', limit: '10 ADET / AY', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    { icon: AlertTriangle, name: 'Patlayıcıdan Korunma Dök.', limit: '10 ADET / AY', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30' },
    { icon: Flame, name: 'Yangından Korunma Dök.', limit: '10 ADET / AY', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    { icon: Helmet, name: 'Yüksekte Çalışma Dök.', limit: '10 ADET / AY', color: 'text-blue-300', bg: 'bg-blue-800/20', border: 'border-blue-400/30' },
    { icon: Lightning, name: 'Elektrik İşlerinde Dök.', limit: '200 ADET / AY', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    { icon: FileText, name: 'İşe Başlama Eğitim Dök.', limit: '200 ADET / AY', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    { icon: Award, name: 'Sertifika Oluşturma', limit: '100 SINIRSIZ', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
    { icon: FileInput, name: 'Personel Sağlık Formu', limit: '100 SINIRSIZ', color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-500/30' },
    { icon: Activity, name: 'Matrix Puanlama Risk Analizi', limit: '100 SINIRSIZ', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/30' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Sektörünü Seç
                    </h1>
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        BETA v2.0
                    </div>
                </div>
                <p className="text-slate-400 text-lg max-w-xl">
                    İşletmeniz için özel hazırlanmış belge ve formlara ulaşmak için sektörünüzü seçin.
                </p>
            </div>

            <div className="flex gap-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    <button 
                         onClick={() => onNavigate('documents')}
                         className="relative bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300"
                    >
                        <Search className="w-5 h-5 text-blue-400" />
                        <span>Hızlı Arama</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8 mb-20">
            {/* Left: Sectors Slider */}
            <div className="col-span-12 lg:col-span-9">
                <div className="relative group/slider">
                    {/* Navigation Buttons */}
                    <button 
                        onClick={scrollLeft}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 border border-white/10 rounded-full text-white backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-blue-500 hover:border-blue-500"
                    >
                        <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                    <button 
                        onClick={scrollRight}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 border border-white/10 rounded-full text-white backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-blue-500 hover:border-blue-500"
                    >
                        <ChevronDown className="w-6 h-6 -rotate-90" />
                    </button>

                    {/* Scroll Container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-8 pt-4 px-2 snap-x hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {sectors.map((sector) => {
                            const Icon = sector.icon;
                            return (
                                <div
                                    key={sector.id}
                                    className="relative flex-shrink-0 w-[280px] h-[400px] group snap-center cursor-pointer"
                                    onMouseEnter={() => setHoveredSector(sector.id)}
                                    onMouseLeave={() => setHoveredSector(null)}
                                    onClick={() => onNavigate('documents', { category: sector.id })}
                                >
                                    {/* Card Content */}
                                    <div className={`absolute inset-0 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                                        hoveredSector === sector.id ? sector.color : 'border-white/5'
                                    }`}>
                                        {/* Image Background */}
                                        <div className="absolute inset-0">
                                            <img 
                                                src={sector.image} 
                                                alt={sector.title}
                                                className={`w-full h-full object-cover transition-transform duration-700 ${
                                                    hoveredSector === sector.id ? 'scale-110' : 'scale-100'
                                                }`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                            <div className={`mb-auto w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all duration-300 ${
                                                hoveredSector === sector.id ? 'bg-white/20 scale-110' : ''
                                            }`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-1">{sector.title}</h3>
                                                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${sector.gradient} transition-all duration-500 ${
                                                        hoveredSector === sector.id ? 'w-full' : 'w-12'
                                                    }`} />
                                                </div>
                                                
                                                <div className={`grid grid-cols-2 gap-2 transition-all duration-500 ${
                                                    hoveredSector === sector.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                                }`}>
                                                    <div className="bg-black/40 backdrop-blur-sm p-2 rounded text-xs text-slate-300 border border-white/5">
                                                        Risk Analizleri
                                                    </div>
                                                    <div className="bg-black/40 backdrop-blur-sm p-2 rounded text-xs text-slate-300 border border-white/5">
                                                        Talimatlar
                                                    </div>
                                                </div>

                                                <button className={`w-full py-3 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 transition-all duration-500 ${
                                                    hoveredSector === sector.id ? 'opacity-100' : 'opacity-0 translate-y-4'
                                                }`}>
                                                    İncele <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: Quick Stats/Menu */}
            <div className="col-span-12 lg:col-span-3">
                <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                    
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Hızlı Erişim
                    </h3>

                    <div className="space-y-3 flex-1">
                        {currentRightSideMenu.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 group-hover:text-white font-medium">
                                        {item.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-center cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                            <h4 className="font-bold text-white">PRO Üyelik</h4>
                            <p className="text-blue-100 text-xs mt-1">Tüm belgelere sınırsız erişim</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Documents Grid */}
        <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    Popüler Belgeler
                </h2>
                <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                    Tümünü Gör
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentList.map((doc, idx) => {
                    const Icon = doc.icon;
                    return (
                        <div key={idx} className="group relative bg-[#0f1115] border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer overflow-hidden">
                             <div className={`absolute top-0 right-0 w-24 h-24 ${doc.bg} rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110 opacity-50`} />
                             
                             <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${doc.bg} border ${doc.border} flex items-center justify-center mb-4`}>
                                    <Icon className={`w-6 h-6 ${doc.color}`} />
                                </div>
                                
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{doc.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${doc.border} ${doc.bg} ${doc.color} font-medium`}>
                                        {doc.limit}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-slate-500 text-sm mt-4 pt-4 border-t border-white/5">
                                    <span className="flex items-center gap-1.5">
                                        <History className="w-3.5 h-3.5" />
                                        Son: 2 saat önce
                                    </span>
                                    <span className="text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                                        Oluştur <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                             </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Paket Seçenekleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Standard Plan */}
                <div className="relative group p-8 rounded-3xl bg-[#0f1115] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Standart</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">0</span>
                            <span className="text-xl text-slate-400">₺/ay</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                <span>Aylık 5 Belge Oluşturma</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                <span>Temel Şablonlar</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10">
                            Mevcut Plan
                        </button>
                    </div>
                </div>

                {/* Gold Plan */}
                <div className="relative group p-8 rounded-3xl bg-[#0f1115] border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 transform scale-105 shadow-2xl shadow-yellow-500/10">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" />
                        EN POPÜLER
                    </div>
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all" />
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-yellow-500 mb-2">Gold</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">499</span>
                            <span className="text-xl text-slate-400">₺/ay</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-white">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                <span>Sınırsız Belge Oluşturma</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                <span>Tüm Sektör Paketleri</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                <span>Öncelikli Destek</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold hover:shadow-lg hover:shadow-yellow-500/25 transition-all">
                            Hemen Yükselt
                        </button>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="relative group p-8 rounded-3xl bg-[#0f1115] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all" />
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">999</span>
                            <span className="text-xl text-slate-400">₺/ay</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                <span>Kurumsal Özelleştirme</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                <span>API Erişimi</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                <span>7/24 Özel Danışman</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 hover:border-purple-500/50">
                            İletişime Geç
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
