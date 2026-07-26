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
  Flame, Target, Compass, Eye, PenLine, ClipboardCheck, AlertTriangle, GraduationCap
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
             <div className="workspace-ambient absolute inset-0 overflow-hidden"></div>
             <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_0.7px,transparent_0.7px)] bg-[size:18px_18px] opacity-40"></div>
             <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#36505d]/30 to-transparent"></div>
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
              <div className="premium-dashboard grid items-start gap-4 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-6">
                <aside className="premium-sidebar overflow-hidden rounded-xl border border-white/10 bg-[#18272f]/95 shadow-[0_22px_55px_rgba(0,0,0,0.2)] lg:sticky lg:top-24">
                  <div className="border-b border-white/10 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Yeni belge</p>
                    <h1 className="mt-2 text-xl font-black text-white">Ne hazırlıyorsunuz?</h1>
                    <div className="premium-search mt-4 flex min-h-12 items-center rounded-lg border border-white/10 bg-[#101a20] focus-within:border-amber-400/60">
                      <Search className="ml-3 h-4 w-4 shrink-0 text-amber-300" />
                      <input type="search" placeholder="Belge ara" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-white placeholder-slate-600 outline-none" />
                    </div>
                  </div>

                  <div className="p-3">
                    {[
                      { id: 'risk', icon: AlertTriangle, title: 'Risk değerlendirme' },
                      { id: 'emergency', icon: ShieldAlert, title: 'Acil durum' },
                      { id: 'training', icon: GraduationCap, title: 'Eğitim ve görevlendirme' },
                      { id: 'control', icon: ClipboardCheck, title: 'Saha kontrolü' }
                    ].map(task => (
                      <button key={task.id} onClick={() => setSelectedTask(current => current === task.id ? null : task.id)} aria-pressed={selectedTask === task.id} className={`premium-task mb-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition-colors ${selectedTask === task.id ? 'bg-amber-300 text-[#111b22]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                        <task.icon size={17} /><span className="flex-1">{task.title}</span>{selectedTask === task.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Seçili sektör</span><Briefcase size={14} className="text-cyan-300" /></div>
                    <strong className="mt-2 block truncate text-sm text-white">{selectedCategory || 'Tüm sektörler'}</strong>
                    {(selectedTask || selectedCategory || searchQuery) && <button onClick={() => { setSelectedTask(null); setSelectedCategory(null); setSearchQuery(''); }} className="mt-3 w-full text-center text-xs font-semibold text-amber-300 hover:underline">Filtreleri temizle</button>}
                  </div>
                </aside>

                <main className="premium-document-list min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#1b2a33]/78 shadow-[0_22px_55px_rgba(0,0,0,0.14)]">
                  <section className="sector-showcase border-b border-white/10" aria-labelledby="sector-title">
                    <div className="sector-hero relative min-h-[210px] overflow-hidden sm:min-h-[248px]">
                      <AnimatePresence mode="wait">
                        <motion.img key={selectedCategory || 'all'} src={getCategoryImage(selectedCategory || 'tüm sektörler')} alt="" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0 h-full w-full object-cover" />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0d171d] via-[#0d171d]/88 to-[#0d171d]/20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d171d] via-transparent to-black/15" />
                      <div className="relative z-10 flex min-h-[210px] max-w-xl flex-col justify-end p-5 sm:min-h-[248px] sm:p-7">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-black/35 text-amber-300 backdrop-blur-md">{selectedCategory ? getCategoryIcon(selectedCategory) : <FolderOpen size={22} />}</span>
                        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Çalışma alanı</p>
                        <h2 id="sector-title" className="mt-2 max-w-lg text-2xl font-black leading-tight text-white sm:text-3xl">{selectedCategory || 'Tüm sektörler'}</h2>
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-300"><span>{selectedCategory ? archiveTemplates.filter(item => item.category === selectedCategory).length : archiveTemplates.length} belge</span><span className="h-1 w-1 rounded-full bg-cyan-300"/><span>Düzenlemeye hazır</span></div>
                      </div>
                    </div>

                    <div className="sector-mosaic-wrap p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between"><strong className="text-xs text-white">Sektör değiştir</strong>{selectedCategory && <button onClick={() => setSelectedCategory(null)} className="text-[11px] font-semibold text-cyan-300 hover:text-white">Tümünü göster</button>}</div>
                      <div className="sector-mosaic grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                        {uniqueCategories.map(category => (
                          <button key={category} onClick={() => setSelectedCategory(category)} aria-pressed={selectedCategory === category} className={`sector-mosaic-card group relative min-h-[82px] overflow-hidden rounded-lg border text-left ${selectedCategory === category ? 'border-amber-300' : 'border-white/10'}`}>
                            <img src={getCategoryImage(category)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
                            <span className="absolute inset-0 bg-gradient-to-r from-[#101a20]/95 via-[#101a20]/72 to-black/10" />
                            <span className="relative z-10 flex min-h-[82px] items-center gap-2.5 p-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-black/35 ${selectedCategory === category ? 'border-amber-300/50 text-amber-300' : 'border-white/10 text-cyan-200'}`}>{getCategoryIcon(category)}</span><span className="min-w-0 overflow-hidden"><strong className="line-clamp-2 block [overflow-wrap:anywhere] text-[10px] leading-4 text-white sm:text-[11px]">{category}</strong><small className="mt-1 block text-[9px] text-slate-300">{archiveTemplates.filter(item => item.category === category).length} belge</small></span></span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                  <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">{selectedCategory || 'Tüm sektörler'}</p><h2 className="mt-1 text-xl font-black text-white">Belgeler</h2></div>
                    <span className="rounded-md bg-white/5 px-3 py-2 text-xs font-bold text-slate-300">{filteredTemplates.length} sonuç</span>
                  </header>

                  <div className="divide-y divide-white/[0.07]">
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
                    {filteredTemplates.length === 0 && <div className="px-6 py-20 text-center"><SearchCode className="mx-auto h-10 w-10 text-slate-600"/><h3 className="mt-4 font-bold text-white">Belge bulunamadı</h3><button onClick={() => { setSelectedTask(null); setSelectedCategory(null); setSearchQuery(''); }} className="mt-3 text-xs font-semibold text-amber-300 hover:underline">Tüm belgeleri göster</button></div>}
                  </div>
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