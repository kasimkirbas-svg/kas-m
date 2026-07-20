import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import { DocumentEditor } from './pages/DocumentEditor';
import { Layout } from './components/Layout';
import { Profile } from './pages/Profile';
import { Settings as SettingsPage } from './pages/Settings';
import { Billing } from './pages/Billing';
import { DocumentHistory } from './pages/DocumentHistory';
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
          onBack={() => setCurrentView('dashboard')} 
          onSave={() => setCurrentView('dashboard')} 
        />
      );
    }

    if (user && ['dashboard', 'profile', 'settings', 'billing', 'history'].includes(currentView)) {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          
           {/* Global single-theme workspace background */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-[#10161c]"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_4%,rgba(229,184,44,0.11),transparent_30%),radial-gradient(circle_at_8%_32%,rgba(70,150,170,0.13),transparent_34%)]"></div>
             <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#22313b]/35 to-transparent"></div>
          </div>

           <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 sm:pt-7 relative z-10 transition-all duration-700 fade-in">
            
            {currentView === 'profile' && <Profile user={user} />}
            {currentView === 'settings' && <SettingsPage user={user} onSave={(changes) => setUser(current => current ? { ...current, ...changes } : current)} />}
            {currentView === 'history' && <DocumentHistory />}
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

                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border-2 border-dashed border-[#FFD700]/30 rounded-full"
                      ></motion.div>
                      <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-full overflow-hidden bg-black shadow-[0_0_30px_rgba(255,215,0,0.4)] relative z-10 border border-[#FFD700]/50">
                        <img src="/logo.jpeg" alt="Logo" className="w-[120%] h-auto object-contain" />
                      </div>
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
            <div className="mb-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:items-end">
              <div>
                <p className="mb-2 text-xs font-semibold text-amber-300">Çalışma alanınız</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#f8fafc]">Merhaba, {user.name.split(' ')[0]}</h1>
                <p className="mt-2 max-w-xl text-sm sm:text-base text-[#aebbc5]">Sektörünü seç, ihtiyacın olan dokümanı bul ve dakikalar içinde düzenlemeye başla.</p>
              </div>
            <div className="relative z-10 flex border border-white/10 shadow-[0_14px_36px_rgba(0,0,0,0.18)] rounded-lg focus-within:border-amber-400/70 transition-colors bg-[#1a232b]/90 items-center justify-between w-full overflow-hidden backdrop-blur-xl">
              <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
                <Search className="w-5 h-5 text-yellow-600 dark:text-yellow-300 ml-4 shrink-0" />
                <input type="search" placeholder="Doküman veya sektör ara" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full min-w-0 bg-transparent border-none px-2 sm:px-3 py-4 text-white placeholder-[#82909b] focus:outline-none font-medium text-sm"/>
                {searchQuery && <button onClick={() => setSearchQuery('')} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Aramayı temizle"><Hexagon className="w-5 h-5" /></button>}
                <button type="button" className="self-stretch px-5 sm:px-7 bg-yellow-400 text-[#17180f] font-bold text-sm hover:bg-yellow-300 transition-colors">Ara</button>
              </div>
            </div>
            </div>

            {/* Sub System Engine (Categories) First */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="mb-11 w-full"
            >
              <div className="flex items-end justify-between gap-3 mb-4 relative z-10">
                <div><h2 className="text-lg font-bold text-[#f8fafc]">Sektörler</h2><p className="text-sm text-[#93a2ad]">İçeriği çalışma alanına göre filtreleyin</p></div>
                {selectedCategory && <button onClick={() => setSelectedCategory(null)} className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 hover:underline">Filtreyi kaldır</button>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`col-span-1 h-24 rounded-lg transition-all duration-300 relative group overflow-hidden bg-[#22271f] text-left ${
                    selectedCategory === null 
                      ? 'border border-yellow-400 ring-2 ring-yellow-400/15 shadow-md' 
                      : 'border border-slate-200/80 dark:border-white/10 hover:border-yellow-400/60 hover:shadow-md'
                  }`}
                >
                  <div className="absolute inset-0 bg-slate-100 dark:bg-[#0A0A0A]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
                    <div className={`absolute inset-0 ${selectedCategory === null ? 'bg-gradient-to-r from-[#26301f]/95 to-[#7b6917]/70' : 'bg-[#20251e]/70'}`}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center gap-4 z-10 px-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/40 border border-white/10"><ShieldAlert size={20} className={selectedCategory === null ? "text-[#FFD700]" : "text-white"} /></span>
                    <span><strong className={`block text-sm font-bold ${selectedCategory === null ? "text-[#FFD700]" : "text-white"}`}>Tüm sektörler</strong><small className="mt-1 block text-[11px] text-white/60">{MOCK_TEMPLATES.length} doküman</small></span>
                  </div>
                </button>
                
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`col-span-1 h-24 rounded-lg transition-all duration-300 relative group overflow-hidden bg-[#22271f] text-left ${
                      selectedCategory === category 
                        ? 'border border-yellow-400 ring-2 ring-yellow-400/15 shadow-md' 
                        : 'border border-slate-200/80 dark:border-white/10 hover:border-yellow-400/60 hover:shadow-md'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#232821]">
                       <img src={getCategoryImage(category)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-70 transition-all duration-500 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategory === category ? 'from-[#394027]/95 to-[#806e1d]/55' : 'from-[#171b16]/90 to-[#171b16]/35'}`}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center gap-4 z-10 px-5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40 ${selectedCategory === category ? "text-[#FFD700]" : "text-white"}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className="min-w-0"><strong className={`block truncate text-sm font-bold ${selectedCategory === category ? "text-[#FFD700]" : "text-white"} group-hover:text-[#FFD700]`}>{category}</strong><small className="mt-1 block text-[11px] text-white/60">{MOCK_TEMPLATES.filter(item => item.category === category).length} doküman</small></span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 relative z-10">
                <AnimatePresence>
                  {filteredTemplates.map((template, idx) => (
                    <motion.div 
                      key={template.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="bg-[#1a232b]/95 border border-white/10 hover:border-amber-400/50 p-4 relative group overflow-hidden transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:bg-[#202b34] hover:shadow-[0_18px_40px_rgba(0,0,0,0.24)] flex min-h-[176px] rounded-lg backdrop-blur-md"
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
                        <h4 className="text-[#f1f5f9] font-semibold mb-2 leading-snug group-hover:text-white transition-all line-clamp-2 text-sm">
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