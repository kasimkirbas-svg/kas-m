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
  Hexagon, Flame, Target
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
  const [showSplash, setShowSplash] = useState(false);
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
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-slate-300 dark:border-white/10 rounded-xl bg-lightbox dark:bg-darkbox/50 backdrop-blur-md">
                 <UserCheck className="w-16 h-16 text-[#FFD700] mb-4" />
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Kullanıcı Arşivi</h2>
                 <p className="text-slate-600 dark:text-slate-400 mt-2">Bu modül kısa süre içerisinde aktif edilecektir.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}
            
            {currentView === 'settings' && (
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-slate-300 dark:border-white/10 rounded-xl bg-lightbox dark:bg-darkbox/50 backdrop-blur-md">
                 <Settings className="w-16 h-16 text-[#FFD700] mb-4 animate-spin-slow" />
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Sistem Ayarları</h2>
                 <p className="text-slate-600 dark:text-slate-400 mt-2">Bu modül kısa süre içerisinde aktif edilecektir.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}

            {currentView === 'billing' && (
               <div className="w-full h-[60vh] flex flex-col items-center justify-center border border-slate-300 dark:border-white/10 rounded-xl bg-lightbox dark:bg-darkbox/50 backdrop-blur-md">
                 <Crown className="w-16 h-16 text-[#FFD700] mb-4" />
                 <h2 className="text-3xl font-black text-[#FFD700] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Sistem Premium</h2>
                 <p className="text-slate-600 dark:text-slate-400 mt-2">Lisans Yenileme ve Yükseltme modülü aktif ediliyor.</p>
                 <button onClick={() => setCurrentView('dashboard')} className="mt-8 px-6 py-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase text-xs tracking-widest transition-colors">
                    Sisteme Dön
                 </button>
               </div>
            )}

            <AnimatePresence>
              {currentView === 'dashboard' && showSplash && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.05 }} 
                  transition={{ duration: 0.5 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-lightbox/80 dark:bg-darkbox/80 backdrop-blur-xl">
                  <div className="flex flex-col items-center gap-6 p-12 bg-white dark:bg-[#0A0A0A] border border-slate-300 dark:border-white/10 rounded-2xl shadow-2xl">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden bg-[#111111] shadow-[0_0_20px_rgba(255,215,0,0.3)] animate-pulse">
                      <img src="/logo.jpeg" alt="Logo" className="w-[120%] h-auto object-contain" />
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest">HOŞGELDİNİZ</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{user?.name}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentView === 'dashboard' && (
              <>
            {/* Header Layout Engine - Search Only */}
            <div className="mb-8 relative z-10 flex border border-slate-300 dark:border-white/10 p-2 shadow-inner rounded focus-within:border-[#FFD700]/50 transition-colors bg-lightbox dark:bg-darkbox/40 items-center justify-between">
              <div className="flex items-center gap-4 w-full">
                <Search className="w-5 h-5 text-[#FFD700] ml-3 shrink-0" />
                <input type="text" placeholder="ARŞİVDE ARAYIN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none font-bold tracking-wide text-xs"/>
                {searchQuery && (<button onClick={() => setSearchQuery('')} className="pr-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Hexagon className="w-4 h-4" /></button>)}
              </div>
            </div>

            {/* Sub System Engine (Categories) First */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Hexagon className="w-4 h-4 text-[#FFD700]" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Sektörel Bağlantılar</h3>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x relative z-10 -mx-4 px-4 md:mx-0 md:px-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`snap-start shrink-0 w-[200px] h-[120px] rounded-xl transition-all duration-500 relative group overflow-hidden ${
                    selectedCategory === null 
                      ? 'border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-100' 
                      : 'border border-slate-200 dark:border-white/5 hover:border-[#FFD700]/50 scale-95 hover:scale-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-slate-100 dark:bg-[#0A0A0A]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity mix-blend-luminosity"></div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${selectedCategory === null ? 'from-[#FFD700]/40 to-black/80' : 'from-black to-black/50'}`}></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                    <ShieldAlert size={28} className={selectedCategory === null ? "text-black drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-[#FFD700]"} />
                    <span className={`text-xs uppercase tracking-[0.2em] font-black ${selectedCategory === null ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"} group-hover:text-slate-900 dark:text-white`}>TÜMÜ</span>
                  </div>
                </button>
                
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`snap-start shrink-0 w-[200px] h-[120px] rounded-xl transition-all duration-500 relative group overflow-hidden ${
                      selectedCategory === category 
                        ? 'border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-100' 
                        : 'border border-slate-200 dark:border-white/5 hover:border-[#FFD700]/50 scale-95 hover:scale-100'
                    }`}
                  >
                    <div className="absolute inset-0 bg-slate-100 dark:bg-[#0A0A0A]">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity mix-blend-luminosity"></div>
                      <div className={`absolute inset-0 bg-gradient-to-t ${selectedCategory === category ? 'from-[#FFD700]/40 to-black/80' : 'from-black to-black/50'}`}></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
                      <div className={selectedCategory === category ? "text-black drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-[#FFD700]"}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className={`text-[10px] leading-tight uppercase tracking-[0.2em] font-bold ${selectedCategory === category ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"} group-hover:text-slate-900 dark:text-white`}>{category}</span>
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
               className="bg-slate-100 dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,1)] animate-pulse"></div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Arşiv Sonuçları ({filteredTemplates.length})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                <AnimatePresence>
                  {filteredTemplates.map((template, idx) => (
                    <motion.div 
                      key={template.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-slate-200 dark:border-white/5 hover:border-[#FFD700]/30 p-6 relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col h-[280px] rounded-lg"
                    >
                      {/* Background Detail */}
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
                         <Hexagon className="w-32 h-32 text-slate-900 dark:text-white" strokeWidth={0.5} />
                      </div>
                      
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#FFD700]/50 transition-colors duration-500"></div>

                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-black/50 border border-slate-200 dark:border-white/5 rounded flex items-center justify-center group-hover:bg-[#FFD700]/5 group-hover:border-[#FFD700]/30 transition-all duration-500">
                          <FileText className="text-slate-600 dark:text-slate-400 group-hover:text-[#FFD700] w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-900 dark:text-white/50 bg-black px-3 py-1.5 rounded border border-slate-200 dark:border-white/5 shadow-inner">
                            {(template.format || "PDF").toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 relative z-10 flex-1">
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-3 leading-snug group-hover:text-slate-900 dark:text-white transition-all line-clamp-2 text-sm tracking-wide">
                          {template.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-auto">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/50 group-hover:bg-[#FFD700] group-hover:shadow-[0_0_8px_#FFD700] transition-all"></div>
                           <p className="text-slate-500 text-[9px] font-bold tracking-[0.2em] uppercase truncate group-hover:text-slate-700 dark:text-slate-300 transition-colors">{template.category}</p>
                        </div>
                      </div>

                      <div className="relative z-10 pt-4 mt-auto border-t border-slate-200 dark:border-white/5 border-dashed">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-bold tracking-[0.1em] uppercase flex items-center gap-2">
                            <Target size={12} /> {template.fields.length} VERİ ALANI
                          </span>
                          
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setCurrentView('editor');
                            }}
                            className="bg-transparent border border-[#FFD700] text-[#FFD700] p-2 rounded-full hover:bg-[#FFD700] hover:text-black transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                            title="Protokolü Başlat"
                          >
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredTemplates.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-[#030406] border border-slate-200 dark:border-white/5 border-dashed rounded-xl">
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