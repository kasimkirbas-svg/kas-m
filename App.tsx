import React, { useState } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('landing'); 
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

    if (user && currentView === 'dashboard') {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          <div className="w-full max-w-[1500px] mx-auto p-4 md:p-8 relative z-10">
            
            {/* Sub-Sci-Fi Effect under Content */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.03)_0%,rgba(0,0,0,0)_100%)] pointer-events-none -z-10"></div>
            
            {/* Holographic Header Area */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 p-8 rounded-3xl bg-[#030406] border border-white/5 relative overflow-hidden"
            >
               {/* Sci-Fi Decorative Grid inside Header */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
               <div className="absolute -right-20 -top-20 opacity-10">
                  <div className="w-[300px] h-[300px] border border-yellow-500 rounded-full animate-[spin_40s_linear_infinite]"></div>
                  <div className="w-[280px] h-[280px] absolute top-[10px] left-[10px] border border-yellow-500/50 rounded-full border-dashed animate-[spin_30s_linear_reverse_infinite]"></div>
               </div>

               <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4 rounded-sm">
                      <Flame className="w-3 h-3 text-yellow-500 animate-pulse" /> SİSTEM PANELİ_V2.0
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                      HOŞGELDİNİZ, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">{user.name.toUpperCase()}</span>
                    </h2>
                    <p className="text-slate-400 font-light max-w-2xl text-sm leading-relaxed border-l-2 border-yellow-500/30 pl-4">
                      Sistem aktif ve 2.4M veri bit/s ile senkronize çalışıyor. Merkezi arşive, İSG tutanaklarına ve dinamik şablonlara aşağıdan hızlıca filtre uygulayarak erişebilirsiniz. Parametreleriniz güvenle korunmaktadır.
                    </p>
                  </div>
                  
                  {/* Cyber Search Bar */}
                  <div className="w-full lg:w-[450px]">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative flex items-center bg-[#07090E] border border-white/10 p-2">
                        <Search className="w-5 h-5 text-yellow-500 ml-4 shrink-0 transition-transform group-focus-within:scale-110" />
                        <input 
                          type="text" 
                          placeholder="Doküman Protokolü Arayın..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-0 font-medium tracking-wide text-sm"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="pr-4 text-xs font-bold text-slate-500 hover:text-yellow-500 tracking-wider uppercase transition-colors"
                          >
                            İPTAL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>

            {/* Dashboard Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
               {/* Stat Card 1 */}
               <div className="p-6 bg-[#030406] border border-white/5 relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-[#05060A] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-yellow-500/30 transition-all">
                       <FileArchive className="text-yellow-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                     </div>
                     <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Toplam Protokol</span>
                  </div>
                  <div className="text-4xl font-black text-white group-hover:text-yellow-400 transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">1.248</div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
               </div>
               
               {/* Stat Card 2 */}
               <div className="p-6 bg-[#030406] border border-white/5 relative overflow-hidden group hover:border-red-500/50 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-[#05060A] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-red-500/30 transition-all">
                       <ShieldAlert className="text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                     </div>
                     <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Aktif Risk Alanı</span>
                  </div>
                  <div className="text-4xl font-black text-white group-hover:text-red-400 transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{uniqueCategories.length}</div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
               </div>

               {/* Stat Card 3 */}
               <div className="p-6 bg-gradient-to-br from-yellow-600 to-yellow-900 border border-yellow-500/30 relative overflow-hidden group shadow-[0_0_20px_rgba(234,179,8,0.15)] flex flex-col justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <Hexagon className="w-40 h-40 text-black" strokeWidth={1}/>
                  </div>
                  <div className="relative z-10">
                    <p className="text-black/80 font-black text-xs tracking-[0.2em] uppercase mb-2">Lisans Sektörü</p>
                    <div className="flex items-center gap-3">
                       <Crown className="w-7 h-7 text-black drop-shadow-md" />
                       <span className="text-xl md:text-2xl font-black text-black tracking-tighter drop-shadow-sm">{user.role}</span>
                    </div>
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
                <Hexagon className="w-4 h-4 text-yellow-500" />
                <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase">Sektörel Bağlantılar</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x relative z-10 -mx-4 px-4 md:mx-0 md:px-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`snap-start shrink-0 px-6 py-4 border transition-all duration-300 relative group overflow-hidden ${
                    selectedCategory === null 
                      ? 'bg-yellow-500 text-black font-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                      : 'bg-[#030406] border-white/10 text-slate-400 hover:text-white hover:border-yellow-500/50'
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
                        ? 'bg-yellow-500/10 text-yellow-400 font-bold border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                        : 'bg-[#030406] border-white/10 text-slate-400 hover:text-white hover:border-yellow-500/30 hover:bg-white/5'
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
                <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase">Veritabanı Sonuçları ({filteredTemplates.length})</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
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
                      className="bg-[#030406] border border-white/5 hover:border-yellow-500/40 p-6 relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-[280px]"
                    >
                      {/* Abstract Card Grid */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 bg-[#0A0D14] border border-white/10 flex items-center justify-center group-hover:border-yellow-500/50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                          <FileText className="text-yellow-500/80 group-hover:text-yellow-400 w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 bg-white/5 px-3 py-1 border border-white/5">
                          {template.format.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 relative z-10 flex-1">
                        <h4 className="text-slate-200 font-bold mb-2 leading-snug group-hover:text-white transition-colors line-clamp-2">
                          {template.title}
                        </h4>
                        <div className="flex items-center gap-2">
                           <ShieldAlert className="w-3 h-3 text-yellow-500/50" />
                           <p className="text-yellow-500/50 text-[10px] font-bold tracking-wider uppercase truncate">{template.category}</p>
                        </div>
                      </div>

                      <div className="relative z-10 border-t border-white/10 pt-4 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-mono tracking-widest">{template.fields.length} VERİ</span>
                          
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setCurrentView('editor');
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-2 border border-yellow-500/50 text-yellow-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(234,179,8,0.2)] transform translate-x-4 group-hover:translate-x-0"
                          >
                            BAŞLAT <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Scanning Line on Card Hover */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400 shadow-[0_0_10px_#eab308] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] z-20 pointer-events-none"></div>
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

          </div>
        </Layout>
      );
    }

    return null;
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