import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import { DocumentEditor } from './pages/DocumentEditor';
import { Layout } from './components/Layout';
import type { User, DocumentTemplate } from './types';
import { 
  Search, Shield, FileText, Download, Briefcase, Factory, HardHat, 
  Car, Building2, Trees, Activity, Building, Zap, MapPin, SearchCode,
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings, Crown, ChevronRight, CheckCircle2,
  Hexagon, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_TEMPLATES } from './constants';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', backgroundColor: '#fee' }}>
          <h1>Sistem Hatası (Lütfen Kasıma Bildirin):</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('isg_user');
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [currentView, setCurrentView] = useState(() => {
    const view = localStorage.getItem('isg_view');
    return view && view !== "undefined" ? view : 'landing';
  }); 

  useEffect(() => {
    if (user) localStorage.setItem('isg_user', JSON.stringify(user));
    else localStorage.removeItem('isg_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('isg_view', currentView);
  }, [currentView]);

  // Route Protection - Prevent dashboard rendering without user
  useEffect(() => {
    if (currentView === 'dashboard' && !user) {
      setCurrentView('landing');
    }
  }, [currentView, user]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const safeTemplates = MOCK_TEMPLATES || [];
  const uniqueCategories = Array.from(new Set(safeTemplates.map(t => t.category)));

  const getCategoryIcon = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('fabrika')) return <Factory size={24} strokeWidth={1.5} />;
    if (lower.includes('inşaat') || lower.includes('tersane')) return <HardHat size={24} strokeWidth={1.5} />;
    if (lower.includes('kimya') || lower.includes('maden') || lower.includes('metal')) return <Activity size={24} strokeWidth={1.5} />;
    if (lower.includes('lojistik') || lower.includes('liman')) return <Car size={24} strokeWidth={1.5} />;
    if (lower.includes('tarım') || lower.includes('orman')) return <Trees size={24} strokeWidth={1.5} />;
    if (lower.includes('otel') || lower.includes('hastane')) return <Building2 size={24} strokeWidth={1.5} />;
    if (lower.includes('şirket') || lower.includes('ofis')) return <Briefcase size={24} strokeWidth={1.5} />;
    return <FileBox size={24} strokeWidth={1.5} />;
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  const filteredTemplates = safeTemplates.filter(t => {
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContent = () => {
    if (currentView === 'landing') {
      return (
        <Landing 
          onLoginClick={() => setCurrentView('auth')} 
          onRegisterClick={() => setCurrentView('auth')} 
        />
      );
    }

    if (currentView === 'auth') {
      return (
        <Auth 
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentView('landing')}
        />
      );
    }

    if (currentView === 'editor' && selectedTemplate) {
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          onBack={() => setCurrentView('dashboard')} 
          onSave={() => setCurrentView('dashboard')} 
        />
      );
    }

    if (user && ['dashboard', 'profile', 'settings', 'billing'].includes(currentView)) {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          
          {/* Global Dashboard Video Architecture */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
             <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-15">
               <source src="/site23.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-black/85"></div>
          </div>

          <div className="w-full max-w-[1500px] mx-auto p-4 md:p-8 relative z-10 transition-all duration-700 fade-in">
            
            {/* INJECT PROFILE OR SETTINGS CONTENT IF THEY ARE SELECTED */}
            {currentView === 'profile' && (
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-white/10 rounded-xl bg-[#111111]/50 backdrop-blur-md">
                 <UserCheck className="w-16 h-16 text-[#FFD700] mb-4" />
                 <h2 className="text-3xl font-black text-white uppercase tracking-widest">Kullanıcı Arşivi</h2>
                 <p className="text-slate-400 mt-2">Bu modül kısa süre içerisinde aktif edilecektir.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}
            
            {currentView === 'settings' && (
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-white/10 rounded-xl bg-[#111111]/50 backdrop-blur-md">
                 <Settings className="w-16 h-16 text-[#FFD700] mb-4 animate-spin-slow" />
                 <h2 className="text-3xl font-black text-white uppercase tracking-widest">Sistem Ayarları</h2>
                 <p className="text-slate-400 mt-2">Bu modül kısa süre içerisinde aktif edilecektir.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}

            {currentView === 'billing' && (
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-white/10 rounded-xl bg-[#111111]/50 backdrop-blur-md">
                 <Crown className="w-16 h-16 text-[#FFD700] mb-4" />
                 <h2 className="text-3xl font-black text-[#FFD700] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Sistem Premium</h2>
                 <p className="text-slate-400 mt-2">Lisans Yenileme ve Yükseltme modülü aktif ediliyor.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}

            {currentView === 'dashboard' && (
              <>
            {/* Holographic Header Area */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 p-10 relative overflow-hidden bg-[#111111]/40 border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl group"
            >
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors duration-1000"></div>
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
               
               <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
                  <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-[1.05]">
                      HOŞGELDİNİZ, <br className="lg:hidden" />
                      <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">{(user?.name || "UZMAN").toUpperCase()}</span>
                    </h2>
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                       <span className="flex h-3 w-3 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
                       </span>
                       <p className="text-slate-400 font-light max-w-2xl text-lg leading-relaxed">
                         Sistem <strong className="text-white">veri hattı</strong> aktif ve senkronize çalışıyor. Merkezi bilgi arşivine doğrudan erişiminiz sağlandı.
                       </p>
                    </div>
                  </div>
                  
                  {/* Cyber Search Bar */}
                  <div className="w-full lg:w-[450px]">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-transparent rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 p-2 shadow-inner">
                        <Search className="w-5 h-5 text-[#FFD700] ml-4 shrink-0 transition-transform group-focus-within:scale-110" />
                        <input 
                          type="text" 
                          placeholder="DOKÜMAN PROTOKOLÜ ARAYIN..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-0 font-medium tracking-wide text-sm"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="pr-4 text-xs font-bold text-slate-500 hover:text-[#FFD700] tracking-wider uppercase transition-colors"
                          >
                            İPTAL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>

            {/* Main Control Hub Overlay & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12"
            >
              {/* Left Column: Quick Analytics */}
              <div className="flex flex-col gap-5 xl:col-span-1">
                 {/* Stat Card 1 */}
                 <div className="p-5 bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-[#FFD700]/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl group-hover:bg-[#FFD700]/20 transition-all duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <FileArchive className="text-[#FFD700] w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all" />
                          <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase group-hover:text-slate-300">Merkezi Protokol</span>
                       </div>
                       <div className="text-2xl font-black text-white group-hover:text-[#FFD700] transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">1.248</div>
                    </div>
                 </div>
                 
                 {/* Stat Card 2 */}
                 <div className="p-5 bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-red-500/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-between">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-700 pointer-events-none transform translate-x-1/2 translate-y-1/2"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <ShieldAlert className="text-red-500 w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all" />
                          <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase group-hover:text-slate-300">Aktif Risk Sınıfı</span>
                       </div>
                       <div className="text-2xl font-black text-white group-hover:text-red-400 transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">{uniqueCategories.length}</div>
                    </div>
                 </div>

                 {/* Stat Card 3 Premium */}
                 <div onClick={() => setCurrentView('billing')} className="cursor-pointer p-5 bg-[#FFD700]/10 border border-[#FFD700]/30 relative overflow-hidden group hover:bg-[#FFD700]/20 hover:border-[#FFD700] transition-all duration-500 flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl group-hover:bg-[#FFD700]/30 transition-all duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <Crown className="text-[#FFD700] w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all" />
                          <span className="text-[#FFD700] font-bold text-[10px] tracking-widest uppercase">Lisans Statüsü</span>
                       </div>
                       <div className="text-2xl font-black text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">{user.role}</div>
                    </div>
                 </div>
              </div>

              {/* Middle Column: Recent Activity Log */}
              <div className="bg-[#111111] border border-white/10 p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden xl:col-span-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <FileClock className="w-5 h-5 text-[#FFD700]" />
                    <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase drop-shadow-md">Son İşlemler</h3>
                  </div>
                  <button onClick={() => setCurrentView('profile')} className="px-3 py-1.5 border border-[#FFD700]/30 rounded text-[9px] uppercase tracking-widest font-black text-[#FFD700] hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-colors group flex items-center gap-2" title="Tüm Arşivi Aç">
                     <FolderOpen size={12} className="group-hover:text-black transition-colors" /> Arşive Git
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col gap-2 relative z-10 overflow-y-auto custom-scrollbar pr-2 h-[200px]">
                  <div className="flex justify-between items-center bg-[#0A0A0A] border border-white/5 p-3 hover:border-[#FFD700]/50 transition-all cursor-pointer group rounded shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded text-slate-400 group-hover:text-black group-hover:bg-[#FFD700] transition-colors shadow-inner">
                        <FileText size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-200 group-hover:text-white transition-colors tracking-wide">İskele Kontrol Formu</span>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></div>
                           <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Bugün, 14:30 • TASLAK</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:border-[#FFD700] group-hover:text-[#FFD700] transition-colors">
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#0A0A0A] border border-white/5 p-3 hover:border-green-500/50 transition-all cursor-pointer group rounded shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded text-slate-400 group-hover:text-black group-hover:bg-green-500 transition-colors shadow-inner">
                        <CheckSquare size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-200 group-hover:text-white transition-colors tracking-wide">Puantaj Tablosu - Eylül</span>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                           <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Dün, 09:15 • ONAYLANDI</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:border-green-500 group-hover:text-green-500 transition-colors">
                      <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#0A0A0A] border border-white/5 p-3 hover:border-[#FFD700]/50 transition-all cursor-pointer group rounded shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded text-slate-400 group-hover:text-black group-hover:bg-[#FFD700] transition-colors shadow-inner">
                        <FileText size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-200 group-hover:text-white transition-colors tracking-wide">Acil Durum Eylem Planı</span>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                           <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">22 Nis, 16:45 • İNDİRİLDİ</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:border-[#FFD700] group-hover:text-[#FFD700] transition-colors">
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Mission Control Actions */}
              <div className="bg-[#111111] border border-white/10 p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden xl:col-span-1">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
                  <Zap className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase drop-shadow-md">Hızlı İşlemler</h3>
                </div>
                
                <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 relative z-10">
                  <button onClick={() => {
                        const targetTemp = safeTemplates[0]; // Gets the first template randomly for "Hızlı şablon"
                        if(targetTemp) { setSelectedTemplate(targetTemp); setCurrentView('editor'); }
                      }} className="bg-[#0A0A0A] border border-white/5 rounded hover:border-[#FFD700]/50 hover:-translate-y-1 transition-all group flex flex-col items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                     <FileText size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#FFD700] group-hover:scale-110 transition-all drop-shadow-sm" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Form Oluştur</span>
                  </button>
                  <button onClick={() => setCurrentView('settings')} className="bg-[#0A0A0A] border border-white/5 rounded hover:border-[#FFD700]/50 hover:-translate-y-1 transition-all group flex flex-col items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                     <Settings size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#FFD700] group-hover:rotate-45 transition-all drop-shadow-sm" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Ayarlar</span>
                  </button>
                  <button onClick={() => setCurrentView('profile')} className="bg-[#0A0A0A] border border-white/5 rounded hover:border-[#FFD700]/50 hover:-translate-y-1 transition-all group flex flex-col items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                     <Building size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#FFD700] group-hover:scale-110 transition-all drop-shadow-sm" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Firma Profili</span>
                  </button>
                  <button onClick={() => setCurrentView('billing')} className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded hover:border-[#FFD700] hover:bg-[#FFD700] transition-all group flex flex-col items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-md group-hover:scale-150 transition-transform"></div>
                     <Crown size={20} className="text-[#FFD700] group-hover:text-black group-hover:scale-110 transition-all z-10" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD700] group-hover:text-black z-10">Premium Al</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sub System Engine (Categories) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Hexagon className="w-4 h-4 text-[#FFD700]" />
                <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Sektörel Bağlantılar</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4"></div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x relative z-10 -mx-4 px-4 md:mx-0 md:px-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`snap-start shrink-0 px-6 py-4 border transition-all duration-300 relative group overflow-hidden ${
                    selectedCategory === null 
                      ? 'bg-[#FFD700] text-black font-black border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:-translate-y-1' 
                      : 'bg-[#111111] border-white/10 text-slate-400 hover:text-white hover:border-[#FFD700]/50 hover:-translate-y-1 shadow-inner'
                  }`}
                >
                  <div className={`flex items-center gap-3 relative z-10 ${selectedCategory === null ? 'scale-105' : 'group-hover:scale-105'} transition-transform`}>
                    <ShieldAlert size={18} />
                    <span className="whitespace-nowrap text-xs uppercase tracking-widest font-bold">TÜM MODÜLLER</span>
                  </div>
                </button>
                
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`snap-start shrink-0 px-6 py-4 border transition-all duration-300 group overflow-hidden ${
                      selectedCategory === category 
                        ? 'bg-[#FFD700]/10 text-[#FFD700] font-bold border-[#FFD700] shadow-[inset_0_0_15px_rgba(255,215,0,0.2)] hover:-translate-y-1' 
                        : 'bg-[#111111] border-white/10 text-slate-400 hover:text-white hover:border-[#FFD700]/30 hover:bg-white/5 hover:-translate-y-1 shadow-inner'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(category)}
                      <span className="whitespace-nowrap text-xs uppercase tracking-widest">{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Document Database Render */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-[#FFD700] rounded-sm shadow-[0_0_10px_rgba(255,215,0,0.8)]"></div>
                <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Veritabanı Sonuçları ({filteredTemplates.length})</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredTemplates.map((template, idx) => (
                    <motion.div 
                      key={template.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="bg-[#111111] border border-white/10 hover:border-[#FFD700]/50 p-6 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex flex-col h-[280px]"
                    >
                      {/* Abstract Card Grid Overlay */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                      
                      {/* Hover Glow */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-3xl group-hover:bg-[#FFD700]/20 transition-all duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                      
                      {/* Bottom Glow Line */}
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 bg-[#0A0A0A] border border-white/5 flex items-center justify-center group-hover:border-[#FFD700]/50 group-hover:scale-110 transition-all duration-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                          <FileText className="text-[#FFD700]/80 group-hover:text-[#FFD700] w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 bg-[#0A0A0A] px-3 py-1 border border-white/5 shadow-inner">
                            {(template.format || "PDF").toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 relative z-10 flex-1 mt-2">
                        <h4 className="text-slate-200 font-bold mb-3 leading-snug group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all line-clamp-2">
                          {template.title}
                        </h4>
                        <div className="flex items-center gap-2">
                           <ShieldAlert className="w-3 h-3 text-[#FFD700]" />
                           <p className="text-[#FFD700]/70 text-[10px] font-bold tracking-wider uppercase truncate group-hover:text-[#FFD700] transition-colors">{template.category}</p>
                        </div>
                      </div>

                      <div className="relative z-10 pt-4 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-mono tracking-widest">{template.fields.length} VERİ</span>
                          
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setCurrentView('editor');
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-2 border border-[#FFD700]/50 text-[#FFD700] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#FFD700] hover:text-black shadow-[0_0_15px_rgba(255,215,0,0.2)] transform translate-x-4 group-hover:translate-x-0"
                          >
                            BAŞLAT <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Scanning Line on Card Hover */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FFD700] shadow-[0_0_10px_#FFD700] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] z-20 pointer-events-none"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredTemplates.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-[#030406] border border-white/5 border-dashed rounded-xl">
                    <Target className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                    <p className="text-slate-400 font-medium tracking-wide">Bu algoritmaya uygun protokol bulunamadı.</p>
                    <button onClick={() => setSearchQuery('')} className="mt-4 text-yellow-500 text-xs font-bold uppercase tracking-widest hover:underline">Aramayı Temizle</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
            </>
            )}

          </div>
        </Layout>
      );
    }

    // Ortada boş ekranda kalmaması adına güvenlik dönüşü / Yönlendirme (Eğer sayfa state uyuşmuyorsa)
    return (
      <Landing 
        onLoginClick={() => setCurrentView('auth')} 
        onRegisterClick={() => setCurrentView('auth')} 
      />
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#05060A] overflow-hidden selection:bg-yellow-500/30">
        {renderContent()}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}} />
      </div>
    </ErrorBoundary>
  );
};

export default App;