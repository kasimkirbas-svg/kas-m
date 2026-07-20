import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import { Layout } from './components/Layout';
import type { User, DocumentTemplate } from './types';
import { 
  Search, Shield, FileText, Download, Briefcase, Factory, HardHat, 
  Car, Building2, Trees, Activity, Building, Zap, MapPin, SearchCode,
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings, Crown, ChevronRight, CheckCircle2,
  Hexagon, Flame, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_TEMPLATES } from './constants';
import { getDocumentTitle } from './services/documentFieldService';
import { reportError } from './services/monitoringService';

const Auth = React.lazy(() => import('./pages/Auth'));
const DocumentEditor = React.lazy(() => import('./pages/DocumentEditor').then(module => ({ default: module.DocumentEditor })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const SettingsPage = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Billing = React.lazy(() => import('./pages/Billing').then(module => ({ default: module.Billing })));
const DocumentHistory = React.lazy(() => import('./pages/DocumentHistory').then(module => ({ default: module.DocumentHistory })));

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any) {
    void reportError(error);
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

const archiveTemplates = MOCK_TEMPLATES || [];
const uniqueCategories = Array.from(new Set(archiveTemplates.map(t => t.category)));
const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('isg_user');
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [showSplash, setShowSplash] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState(() => {
    const view = localStorage.getItem('isg_view');
    return view && view !== "undefined" ? view : 'landing';
  }); 

  useEffect(() => {
    if (user) localStorage.setItem('isg_user', JSON.stringify(user));
    else localStorage.removeItem('isg_user');
  }, [user]);

  useEffect(() => {
    void import('./services/supabaseService').then(async ({ isSupabaseConfigured, getCurrentSupabaseUser }) => {
      if (!isSupabaseConfigured) return;
      const sessionUser = await getCurrentSupabaseUser();
      if (sessionUser) setUser(sessionUser);
    });
  }, []);

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
  const [editorInitialData, setEditorInitialData] = useState<Record<string, any> | undefined>();

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

  const getCategoryImage = (categoryName: string) => {
    const lower = categoryName.toLocaleLowerCase('tr');
    const base = 'https://images.unsplash.com/';
    if (lower.includes('enerji')) return `${base}photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('fabrika') || lower.includes('imalat')) return `${base}photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('gıda')) return `${base}photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('hava')) return `${base}photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('liman') || lower.includes('lojistik')) return `${base}photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('maden')) return `${base}photo-1578319439584-104c94d37305?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('metal')) return `${base}photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=72`;
    if (lower.includes('tarım') || lower.includes('orman')) return `${base}photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=72`;
    return `${base}photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=72`;
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 5000);
  };

  const handleLogout = () => {
    void import('./services/supabaseService').then(({ signOutSupabase }) => signOutSupabase());
    setUser(null);
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  const filteredTemplates = React.useMemo(() => archiveTemplates.filter(t => {
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [selectedCategory, searchQuery]);

  const renderContent = () => {
    if (currentView === 'landing') {
      return (
        <Landing 
          onLoginClick={() => { setAuthMode('login'); setCurrentView('auth'); }} 
          onRegisterClick={() => { setAuthMode('register'); setCurrentView('auth'); }} 
        />
      );
    }

    if (currentView === 'auth') {
      return (
        <Auth 
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentView('landing')}
        />
      );
    }

    if (currentView === 'editor' && selectedTemplate) {
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          initialData={editorInitialData}
          onBack={() => setCurrentView('dashboard')} 
          onSave={() => { setEditorInitialData(undefined); setCurrentView('dashboard'); }} 
        />
      );
    }

    if (user && ['dashboard', 'profile', 'settings', 'billing', 'history'].includes(currentView)) {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          
           {/* Global single-theme workspace background */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-[#16222a]"></div>
             <div className="workspace-ambient absolute inset-0 overflow-hidden"></div>
             <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_0.7px,transparent_0.7px)] bg-[size:18px_18px] opacity-40"></div>
             <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#36505d]/30 to-transparent"></div>
          </div>

           <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 sm:pt-7 relative z-10 transition-all duration-700 fade-in">
            
            {currentView === 'profile' && <Profile user={user} />}
            {currentView === 'settings' && <SettingsPage user={user} onSave={(changes) => setUser(current => current ? { ...current, ...changes } : current)} />}
            {currentView === 'history' && <DocumentHistory onEdit={(entry) => {
              const template = archiveTemplates.find(item => item.id === entry.templateId);
              if (!template || !entry.formData) return;
              setSelectedTemplate(template);
              setEditorInitialData(entry.formData);
              setCurrentView('editor');
            }} />}
            {currentView === 'billing' && <Billing user={user} onSelectPlan={(plan) => setUser(current => current ? { ...current, plan, remainingDownloads: plan === 'YEARLY' ? 'UNLIMITED' : 30 } : current)} />}

            <AnimatePresence>
              {currentView === 'dashboard' && showSplash && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.5 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl">
                  
                  {/* Animasyonlu arka plan parçacıkları */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute w-[500px] h-[500px] bg-[#FFD700] rounded-full blur-[100px] pointer-events-none"
                  ></motion.div>

                  <motion.div 
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.6 }}
                    className="relative flex flex-col items-center gap-6 sm:gap-8 w-[calc(100%-2rem)] max-w-xl p-6 sm:p-10 lg:p-16 bg-[#0A0A0A]/90 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden"
                  >
                    {/* Tarayıcı çizgisi */}
                    <motion.div 
                      initial={{ left: "-100%" }}
                      animate={{ left: "200%" }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                    ></motion.div>

                    <div className="relative w-52 sm:w-72">
                      <motion.div animate={{ opacity: [0.18, 0.42, 0.18], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-4 rounded-full bg-amber-300/20 blur-2xl" />
                      <img src="/logo-transparent.png" alt="İSG Zeyron" className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_24px_rgba(255,215,0,0.35)]" />
                    </div>

                    <div className="text-center space-y-3 relative z-10">
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFD700] to-white uppercase tracking-[0.12em] sm:tracking-[0.4em] drop-shadow-lg"
                      >
                        HOŞGELDiNiZ
                      </motion.h2>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="inline-block"
                      >
                        <p className="text-[#FFD700] font-bold uppercase tracking-widest text-lg px-6 py-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full shadow-inner">
                          {user?.name}
                        </p>
                      </motion.div>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-slate-400 text-xs tracking-widest mt-4 uppercase"
                      >
                        Sistem Hazırlanıyor...
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentView === 'dashboard' && (
              <>
            <section className="mb-8 overflow-hidden rounded-2xl border border-white/15 bg-[#22313b]/82 shadow-[0_24px_70px_rgba(4,10,14,0.18)] backdrop-blur-xl">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="absolute inset-y-0 right-0 hidden w-px bg-white/10 lg:block" />
                  <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300"><span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" /> Çalışma alanı aktif</div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Merhaba, {user.name.split(' ')[0]}</h1>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-[#aebbc5]">Sahadaki işinizi seçin, uygun dokümanı bulun ve düzenlemeye doğrudan başlayın.</p>
                  <div className="relative z-10 mt-7 flex min-h-14 items-center overflow-hidden rounded-xl border border-white/15 bg-[#17242c]/80 shadow-inner focus-within:border-amber-400/70">
                    <Search className="ml-4 h-5 w-5 shrink-0 text-amber-300" />
                    <input type="search" placeholder="Doküman adı veya sektör ara" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full min-w-0 bg-transparent px-4 py-4 text-sm font-medium text-white placeholder-[#71818d] focus:outline-none"/>
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="p-3 text-[#71818d] hover:text-white" aria-label="Aramayı temizle"><Hexagon className="h-4 w-4" /></button>}
                    <button type="button" className="self-stretch bg-amber-300 px-6 text-sm font-black text-[#111820] transition-colors hover:bg-amber-200">Ara</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/10 bg-[#19272f]/65 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
                  <div className="flex items-center gap-3 p-4 sm:p-5 lg:px-8"><FolderOpen className="hidden h-5 w-5 text-cyan-300 sm:block" /><div><strong className="block text-xl font-black text-white">{MOCK_TEMPLATES.length}</strong><span className="text-[10px] text-[#8fa0ac] sm:text-xs">Hazır şablon</span></div></div>
                  <div className="flex items-center gap-3 p-4 sm:p-5 lg:px-8"><Briefcase className="hidden h-5 w-5 text-amber-300 sm:block" /><div><strong className="block text-xl font-black text-white">{uniqueCategories.length}</strong><span className="text-[10px] text-[#8fa0ac] sm:text-xs">Uzmanlık alanı</span></div></div>
                  <div className="flex items-center gap-3 p-4 sm:p-5 lg:px-8"><CheckCircle2 className="hidden h-5 w-5 text-emerald-300 sm:block" /><div><strong className="block text-xl font-black text-white">%100</strong><span className="text-[10px] text-[#8fa0ac] sm:text-xs">Düzenlenebilir</span></div></div>
                </div>
              </div>
            </section>

            {/* Sub System Engine (Categories) First */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="mb-9 w-full"
            >
              <div className="flex items-end justify-between gap-3 mb-4 relative z-10">
                <div><h2 className="text-lg font-bold text-[#f8fafc]">Sektörler</h2><p className="text-sm text-[#93a2ad]">İçeriği çalışma alanına göre filtreleyin</p></div>
                {selectedCategory && <button onClick={() => setSelectedCategory(null)} className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 hover:underline">Filtreyi kaldır</button>}
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`h-[106px] min-w-0 rounded-xl transition-all duration-300 relative group overflow-hidden bg-[#263640] text-left sm:h-[94px] ${
                    selectedCategory === null 
                      ? 'border border-yellow-400 ring-2 ring-yellow-400/15 shadow-md' 
                      : 'border border-slate-200/80 dark:border-white/10 hover:border-yellow-400/60 hover:shadow-md'
                  }`}
                >
                  <div className="absolute inset-0 bg-[#10171d]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
                    <div className={`absolute inset-0 ${selectedCategory === null ? 'bg-gradient-to-r from-[#5c5015]/95 to-[#8d7618]/65' : 'bg-[#111a21]/76'}`}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center gap-4 z-10 px-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/40 border border-white/10"><ShieldAlert size={20} className={selectedCategory === null ? "text-[#FFD700]" : "text-white"} /></span>
                    <span><strong className={`block text-xs font-bold leading-tight sm:text-sm ${selectedCategory === null ? "text-[#FFD700]" : "text-white"}`}>Tüm sektörler</strong><small className="mt-1 block text-[11px] text-white/60">{MOCK_TEMPLATES.length} doküman</small></span>
                  </div>
                </button>
                
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`h-[106px] min-w-0 rounded-xl transition-all duration-300 relative group overflow-hidden bg-[#263640] text-left sm:h-[94px] ${
                      selectedCategory === category 
                        ? 'border border-yellow-400 ring-2 ring-yellow-400/15 shadow-md' 
                        : 'border border-slate-200/80 dark:border-white/10 hover:border-yellow-400/60 hover:shadow-md'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#263640]">
                       <img src={getCategoryImage(category)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-70 transition-all duration-500 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategory === category ? 'from-[#625616]/95 to-[#8a721b]/50' : 'from-[#10171d]/95 to-[#10171d]/32'}`}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center gap-4 z-10 px-5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40 ${selectedCategory === category ? "text-[#FFD700]" : "text-white"}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className="min-w-0"><strong className={`line-clamp-3 text-[11px] font-bold leading-tight sm:line-clamp-2 sm:text-sm ${selectedCategory === category ? "text-[#FFD700]" : "text-white"} group-hover:text-[#FFD700]`}>{category}</strong><small className="mt-1 block text-[11px] text-white/60">{MOCK_TEMPLATES.filter(item => item.category === category).length} doküman</small></span>
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
               className="w-full relative overflow-hidden"
            >
              <div className="flex items-end justify-between gap-3 mb-4 relative z-10">
                <div><h2 className="text-lg font-bold text-[#f8fafc]">Doküman arşivi</h2><p className="text-sm text-[#93a2ad]">{filteredTemplates.length} düzenlenebilir şablon</p></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 relative z-10">
                <AnimatePresence>
                  {filteredTemplates.map((template, idx) => (
                    <motion.div 
                      key={template.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="bg-[#22313a]/88 border border-white/12 hover:border-amber-400/50 p-5 relative group overflow-hidden transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:bg-[#2a3b45] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.2)] flex min-h-[158px] rounded-xl backdrop-blur-md before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gradient-to-b before:from-amber-300 before:to-cyan-400 before:opacity-0 hover:before:opacity-100"
                    >
                      {/* Background Detail */}
                      <div className="flex w-full flex-col relative z-10">
                        <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="w-9 h-9 shrink-0 bg-[#10171d] border border-white/10 rounded-md flex items-center justify-center group-hover:bg-amber-400/10 group-hover:border-amber-400/40 transition-all duration-500">
                          <FileText className="text-[#9cabb6] group-hover:text-amber-300 w-4 h-4" strokeWidth={1.5} />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-[#9db6c8] bg-[#10171d] px-2 py-1 rounded border border-white/10">
                            {(template.format || "PDF").toUpperCase()}
                        </span>
                      </div>

                      <div className="relative z-10 flex-1">
                        <h4 className="text-[#f1f5f9] font-bold mb-2 leading-snug group-hover:text-white transition-all line-clamp-2 text-[15px]">
                          {getDocumentTitle(template.id, template.title)}
                        </h4>
                        <div className="flex items-center gap-2 mt-auto">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/50 group-hover:bg-[#FFD700] group-hover:shadow-[0_0_8px_#FFD700] transition-all"></div>
                           <p className="text-[#9aa9b4] text-[10px] font-medium truncate group-hover:text-[#c9d3da] transition-colors">{template.category}</p>
                        </div>
                      </div>

                      <div className="relative z-10 pt-3 mt-3 border-t border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#91a3b0] font-medium flex items-center gap-2">
                            <Target size={12} /> {template.fields.length} düzenlenebilir alan
                          </span>
                          
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setEditorInitialData(undefined);
                              setCurrentView('editor');
                            }}
                            className="flex items-center gap-1.5 rounded-md bg-yellow-400/10 px-3 py-2 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                            title="Dokümanı düzenle"
                          >
                            Düzenle <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredTemplates.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-[#030406] border border-slate-200 dark:border-white/5 border-dashed rounded-xl">
                    <Target className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide">Bu algoritmaya uygun protokol bulunamadı.</p>
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] overflow-hidden selection:bg-yellow-500/30">
        <React.Suspense fallback={<div className="min-h-screen bg-[#16222a] text-slate-300 flex items-center justify-center"><div className="flex items-center gap-3 text-sm font-semibold"><span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-300" /> Çalışma alanı hazırlanıyor</div></div>}>
          {renderContent()}
        </React.Suspense>
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