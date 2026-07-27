import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import { Layout } from './components/Layout';
import type { User, DocumentTemplate } from './types';
import { isAdminRole } from './types';
import { 
  Search, Shield, FileText, Download, Briefcase, Factory, HardHat, 
  Car, Building2, Trees, Activity, Building, Zap, MapPin, SearchCode,
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings, Crown, ChevronRight, CheckCircle2,
  Flame, Target, Compass, Eye, PenLine, ClipboardCheck, AlertTriangle, GraduationCap,
  ChevronDown, Globe2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GENERATED_TEMPLATES } from './generatedTemplates';
import { getDocumentTitle } from './services/documentFieldService';
import { reportError } from './services/monitoringService';
import { getOriginalDocumentUrl } from './services/originalDocumentService';

const Auth = React.lazy(() => import('./pages/Auth'));
const DocumentEditor = React.lazy(() => import('./pages/DocumentEditor').then(module => ({ default: module.DocumentEditor })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const SettingsPage = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Billing = React.lazy(() => import('./pages/Billing').then(module => ({ default: module.Billing })));
const Admin = React.lazy(() => import('./pages/Admin'));

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

const staticTemplates = GENERATED_TEMPLATES;
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

  useEffect(() => {
    const handlePopState = () => {
      if (currentView === 'editor') {
        setSelectedTemplate(null);
        setCurrentView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  // Route Protection - Prevent protected views rendering without authorization
  useEffect(() => {
    if (['dashboard', 'profile', 'settings', 'billing', 'admin'].includes(currentView) && !user) {
      setCurrentView('landing');
    } else if (currentView === 'admin' && user && !isAdminRole(user.role)) {
      setCurrentView('dashboard');
    }
  }, [currentView, user]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteTemplates, setRemoteTemplates] = useState<DocumentTemplate[]>([]);
  const archiveTemplates = React.useMemo(() => {
    const remoteIds = new Set(remoteTemplates.map(template => template.id));
    return [...remoteTemplates, ...staticTemplates.filter(template => !remoteIds.has(template.id))]
      .map(template => ({ ...template, originalUrl: getOriginalDocumentUrl(template.id) }));
  }, [remoteTemplates]);
  const uniqueCategories = React.useMemo(() => Array.from(new Set(archiveTemplates.map(template => template.category))), [archiveTemplates]);

  useEffect(() => {
    if (!categoryMenuOpen) return;
    const closeCategoryMenu = (event: PointerEvent) => {
      if (!categoryMenuRef.current?.contains(event.target as Node)) setCategoryMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeCategoryMenu);
    return () => document.removeEventListener('pointerdown', closeCategoryMenu);
  }, [categoryMenuOpen]);

  useEffect(() => {
    if (!user) return;
    void import('./services/supabaseService').then(({ getPublishedTemplates }) => getPublishedTemplates())
      .then(setRemoteTemplates)
      .catch(error => void reportError(error));
  }, [user, currentView]);

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

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
    if (lower.includes('tüm sektörler')) return '/world-poster.jpg';
    if (lower.includes('gıda')) return '/gida-poster.jpg';
    if (lower.includes('standart')) return '/standart-poster.jpg';
    if (lower.includes('enerji')) return `${base}photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=84`;
    if (lower.includes('kimya')) return '/kimya-poster.jpg';
    if (lower.includes('fabrika') || lower.includes('imalat')) return '/fabrika-poster.jpg';
    if (lower.includes('hava')) return '/hava-poster.jpg';
    if (lower.includes('inşaat') || lower.includes('tersane')) return '/insaat-poster.jpg';
    if (lower.includes('lojistik')) return '/lojistik-poster.jpg';
    if (lower.includes('liman')) return `${base}photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=84`;
    if (lower.includes('maden')) return '/maden-poster.jpg';
    if (lower.includes('metal')) return `${base}photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=84`;
    if (lower.includes('otel') || lower.includes('bina') || lower.includes('hastane')) return '/otel-poster.jpg';
    if (lower.includes('şirket') || lower.includes('ofis')) return '/sirketler-poster.jpg';
    if (lower.includes('tarım') || lower.includes('orman')) return '/tarim-poster.jpg';
    return `${base}photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=84`;
  };

  const getCategoryVideo = (categoryName: string) => {
    const lower = categoryName.toLocaleLowerCase('tr');
    if (lower.includes('tüm sektörler')) return '/19024-298313254_medium.mp4';
    if (lower.includes('enerji')) return '/enerji.mp4';
    if (lower.includes('gıda')) return '/gida.mp4';
    if (lower.includes('standart')) return '/standart.mp4';
    if (lower.includes('kimya')) return '/kimya.mp4';
    if (lower.includes('fabrika') || lower.includes('imalat')) return '/fabrika.mp4';
    if (lower.includes('hava')) return '/hava.mp4';
    if (lower.includes('inşaat') || lower.includes('tersane')) return '/insaat.mp4';
    if (lower.includes('liman')) return '/liman.mp4';
    if (lower.includes('lojistik')) return '/lojistik.mp4';
    if (lower.includes('maden')) return '/maden.mp4';
    if (lower.includes('metal') || lower.includes('döküm')) return '/277105_medium.mp4';
    if (lower.includes('otel') || lower.includes('bina') || lower.includes('hastane')) return '/otel.mp4';
    if (lower.includes('şirket') || lower.includes('ofis')) return '/sirketler.mp4';
    if (lower.includes('tarım') || lower.includes('hayvancılık') || lower.includes('orman')) return '/tarim.mp4';
    return null;
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(isAdminRole(loggedInUser.role) ? 'admin' : 'dashboard');
    setShowSplash(false);
  };

  const handleLogout = () => {
    void import('./services/supabaseService').then(({ signOutSupabase }) => signOutSupabase());
    setUser(null);
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  const filteredTemplates = React.useMemo(() => archiveTemplates.filter(t => {
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
    const taskKeywords: Record<string, string[]> = {
      risk: ['risk', 'pkd', 'patlama'],
      emergency: ['acil', 'yangın', 'kaza', 'ramak'],
      training: ['eğitim', 'tutanak', 'atama', 'talimat'],
      control: ['kontrol', 'takip', 'çizelge', 'form']
    };
    const searchableTitle = `${t.title} ${t.description}`.toLocaleLowerCase('tr');
    const matchesTask = selectedTask ? taskKeywords[selectedTask].some(keyword => searchableTitle.includes(keyword)) : true;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTask && matchesSearch;
  }), [archiveTemplates, selectedCategory, selectedTask, searchQuery]);

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
      const leaveEditor = () => {
        if (window.history.state?.isgView === 'editor') window.history.back();
        else {
          setSelectedTemplate(null);
          setCurrentView('dashboard');
        }
      };
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          onBack={leaveEditor}
          onSave={leaveEditor}
        />
      );
    }

    if (user && ['dashboard', 'profile', 'settings', 'billing', 'admin'].includes(currentView)) {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          
           {/* Global single-theme workspace background */}
           <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-[#16222a]"></div>
             {currentView === 'dashboard' && <>
               <AnimatePresence mode="wait">
                 {getCategoryVideo(selectedCategory || 'tüm sektörler') &&
                 <motion.video key={`workspace-${selectedCategory || 'all-sectors'}`} autoPlay loop muted playsInline preload="auto" poster={getCategoryImage(selectedCategory || 'tüm sektörler')} aria-hidden="true" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 0.84, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65 }} className="absolute inset-0 h-full w-full object-cover">
                   <source src={getCategoryVideo(selectedCategory || 'tüm sektörler')!} type="video/mp4" />
                 </motion.video>
                 }
               </AnimatePresence>
               <div className="absolute inset-0 bg-[#071218]/15 sm:bg-[#071218]/25"></div>
               <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,24,0.04),rgba(7,18,24,0.24)_50%,rgba(7,18,24,0.04))] sm:bg-[linear-gradient(90deg,rgba(7,18,24,0.08),rgba(7,18,24,0.38)_50%,rgba(7,18,24,0.08))]"></div>
             </>}
             {currentView !== 'dashboard' && <><div className="workspace-ambient absolute inset-0 overflow-hidden"></div><div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_0.7px,transparent_0.7px)] bg-[size:18px_18px] opacity-40"></div><div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#36505d]/30 to-transparent"></div></>}
          </div>

            <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 pb-24 sm:pb-12 pt-3 sm:pt-7 relative z-10 transition-all duration-700 fade-in">
            
            {currentView === 'profile' && <Profile user={user} />}
            {currentView === 'settings' && <SettingsPage user={user} onSave={(changes) => setUser(current => current ? { ...current, ...changes } : current)} />}
            {currentView === 'billing' && <Billing user={user} onSelectPlan={(plan) => setUser(current => current ? { ...current, plan, remainingDownloads: plan === 'YEARLY' ? 'UNLIMITED' : 30 } : current)} />}
            {currentView === 'admin' && isAdminRole(user.role) && <Admin />}

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
                    className="relative flex flex-col items-center gap-6 sm:gap-8 w-[calc(100%-2rem)] max-w-xl p-6 sm:p-10 lg:p-16 bg-[#172a33]/95 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden"
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
              <div className="premium-document-list mx-auto min-w-0 max-w-5xl rounded-lg border border-white/10 bg-[#1b2a33]/90 shadow-[0_22px_55px_rgba(0,0,0,0.14)]">
                <header className="relative z-20 rounded-t-lg border-b border-white/10 p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {selectedCategory ? <motion.img key={selectedCategory} src={getCategoryImage(selectedCategory)} alt="" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 0.68, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0 h-full w-full rounded-t-lg object-cover object-center" /> : <motion.div key="all-sectors-ambient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-hidden rounded-t-lg bg-[#10242d]"><div className="absolute -inset-10 scale-110 bg-[conic-gradient(from_115deg_at_50%_50%,#10242d,#31515c,#182f39,#6d5a28,#10242d)] opacity-70 blur-2xl" /></motion.div>}
                  </AnimatePresence>
                  <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-[#10222b]/95 via-[#10222b]/78 to-[#10222b]/20" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300"><span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/25 text-cyan-200">{selectedCategory ? getCategoryIcon(selectedCategory) : <FolderOpen size={17} />}</span>{selectedCategory || 'Tüm sektörler'}</div>
                    <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                      <div><h1 className="text-2xl font-black text-white">Hazırlamak istediğiniz belgeyi seçin</h1><p className="mt-1 text-sm text-slate-300">İş türünü veya sektörü seçin; belgeyi doldurmaya hemen başlayın.</p></div>
                      {(selectedTask || selectedCategory || showAllCategories || searchQuery) && <button onClick={() => { setSelectedTask(null); setSelectedCategory(null); setShowAllCategories(false); setSearchQuery(''); }} className="min-h-10 shrink-0 text-left text-xs font-semibold text-amber-300 hover:text-white sm:text-right">Filtreleri temizle</button>}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {[
                      { id: 'risk', icon: AlertTriangle, title: 'Risk değerlendirme' },
                      { id: 'emergency', icon: ShieldAlert, title: 'Acil durum' },
                      { id: 'training', icon: GraduationCap, title: 'Eğitim ve görevlendirme' },
                      { id: 'control', icon: ClipboardCheck, title: 'Saha kontrolü' }
                    ].map(task => (
                      <button key={task.id} onClick={() => setSelectedTask(current => current === task.id ? null : task.id)} aria-pressed={selectedTask === task.id} className={`flex min-h-12 items-center gap-2 rounded-md border px-3 text-left text-xs font-bold transition-colors sm:text-sm ${selectedTask === task.id ? 'border-amber-300 bg-amber-300 text-[#111b22]' : 'border-white/10 bg-[#101a20] text-slate-300 hover:border-white/20 hover:text-white'}`}>
                        <task.icon size={17} className="shrink-0" /><span className="min-w-0 flex-1">{task.title}</span>{selectedTask === task.id && <CheckCircle2 size={15} className="shrink-0" />}
                      </button>
                    ))}
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.55fr)]">
                      <label className="premium-search flex min-h-12 items-center rounded-md border border-white/10 bg-[#101a20]/95 focus-within:border-amber-400/60"><Search className="ml-3 h-4 w-4 shrink-0 text-amber-300" /><input type="search" aria-label="Belge ara" placeholder="Belge adıyla ara" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-white placeholder-slate-600 outline-none" /></label>
                      <div ref={categoryMenuRef} className="relative">
                        <button type="button" onClick={() => setCategoryMenuOpen(open => !open)} aria-haspopup="listbox" aria-expanded={categoryMenuOpen} className="flex min-h-12 w-full items-center rounded-lg border border-white/10 bg-[#18252d]/80 px-3 text-left text-sm text-white shadow-sm backdrop-blur-xl transition-colors hover:border-amber-400/60 hover:bg-[#22343e]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70">
                          <span className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/20 text-amber-300">{selectedCategory ? getCategoryIcon(selectedCategory) : <Globe2 size={17} />}</span>
                          <span className="min-w-0 flex-1 truncate font-semibold">{selectedCategory || 'Tüm sektörler'}</span>
                          <ChevronDown size={17} className={`ml-2 shrink-0 text-amber-300 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {categoryMenuOpen && <motion.div role="listbox" aria-label="Sektör seç" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} className="absolute right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 w-full min-w-64 overflow-y-auto rounded-lg border border-white/10 bg-[#111b22]/98 p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                            {[null, ...uniqueCategories].map(category => {
                              const active = selectedCategory === category;
                              return <button key={category || 'all'} type="button" role="option" aria-selected={active} onClick={() => { setSelectedCategory(category); setShowAllCategories(category === null); setCategoryMenuOpen(false); }} className={`flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors ${active ? 'bg-amber-300 text-[#111b22]' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center">{category ? getCategoryIcon(category) : <Globe2 size={17} />}</span><span className="min-w-0 flex-1">{category || 'Tüm sektörler'}</span>{active && <CheckCircle2 size={16} className="shrink-0" />}
                              </button>;
                            })}
                          </motion.div>}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="relative z-10 overflow-hidden rounded-b-lg">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6"><div><h2 className="text-base font-black text-white">Belgeler</h2><p className="mt-0.5 text-[11px] text-slate-500">{selectedCategory || (showAllCategories ? 'Tüm sektörler' : 'Seçim bekleniyor')}</p></div>{(selectedCategory || selectedTask || showAllCategories || searchQuery) && <span className="rounded bg-white/5 px-2.5 py-1.5 text-xs font-bold text-slate-300">{filteredTemplates.length} belge</span>}</div>

                  {selectedCategory || selectedTask || showAllCategories || searchQuery ? <div className="divide-y divide-white/[0.07]">
                    <AnimatePresence initial={false}>
                      {filteredTemplates.map(template => (
                        <motion.article key={template.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="premium-document-row group grid gap-3 px-4 py-4 transition-colors hover:bg-white/[0.035] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                          <span className="premium-file-icon flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101a20] text-cyan-300"><FileText size={18} /></span>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold leading-5 text-white sm:text-[15px]">{getDocumentTitle(template.id, template.title)}</h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400"><span>{template.category}</span><span>{template.fields.length} alan</span><span>{(template.format || 'DOCX').toUpperCase()}</span></div>
                          </div>
                          <button onClick={() => { setSelectedTemplate(template); window.history.pushState({ isgView: 'editor' }, ''); setCurrentView('editor'); }} className="premium-fill-button flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-bold text-[#111b22] transition-colors hover:bg-amber-200 sm:justify-self-end">Doldur <ArrowRight size={15} /></button>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                    {filteredTemplates.length === 0 && <div className="px-6 py-20 text-center"><SearchCode className="mx-auto h-10 w-10 text-slate-600"/><h3 className="mt-4 font-bold text-white">Belge bulunamadı</h3><button onClick={() => { setSelectedTask(null); setSelectedCategory(null); setShowAllCategories(true); setSearchQuery(''); }} className="mt-3 text-xs font-semibold text-amber-300 hover:underline">Tüm belgeleri göster</button></div>}
                  </div> : <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center sm:min-h-72">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#18252d]/80 text-amber-300 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl"><Globe2 size={27} /></span>
                    <h2 className="mt-5 text-xl font-black text-white">Çalışma alanınızı seçin</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Sektörünüzü veya yapmak istediğiniz işi seçtiğinizde yalnızca ilgili belgeler burada görünecek.</p>
                    <button type="button" onClick={() => setCategoryMenuOpen(true)} className="mt-6 flex min-h-11 items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-300 px-5 text-sm font-bold text-[#111b22] shadow-[0_10px_24px_rgba(229,184,44,0.16)] transition-colors hover:bg-amber-200"><Briefcase size={17} /> Sektör seçin <ChevronRight size={16} /></button>
                  </div>}
                </main>
              </div>
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#16222a] overflow-hidden selection:bg-yellow-500/30">
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