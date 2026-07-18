import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { DocumentEditor } from './pages/DocumentEditor';
import { APP_NAME } from './constants';
import { User, DocumentTemplate } from './types';
import { 
  Building2, Factory, Pickaxe, HardHat, Zap, FlaskConical, Briefcase, 
  Search, ArrowDownAz, FileText, ClipboardList, PackageSearch, Trash2, 
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings, Crown, ChevronRight, CheckCircle2
} from 'lucide-react';

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
    if (lower.includes('fabrika')) return <Factory size={26} strokeWidth={1.5} />;
    if (lower.includes('gıda')) return <PackageSearch size={26} strokeWidth={1.5} />;
    if (lower.includes('inşaat') || lower.includes('tersane')) return <HardHat size={26} strokeWidth={1.5} />;
    if (lower.includes('kimya')) return <FlaskConical size={26} strokeWidth={1.5} />;
    if (lower.includes('maden')) return <Pickaxe size={26} strokeWidth={1.5} />;
    if (lower.includes('enerji')) return <Zap size={26} strokeWidth={1.5} />;
    if (lower.includes('metal')) return <Building2 size={26} strokeWidth={1.5} />;
    if (lower.includes('kurumsal')) return <Briefcase size={26} strokeWidth={1.5} />;
    return <FileBox size={26} strokeWidth={1.5} />;
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
        <Landing onStart={() => setCurrentView('auth')} />
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

    if (!user && currentView === 'dashboard') {
       setCurrentView('auth');
       return null;
    }

    if (currentView === 'editor' && selectedTemplate) {
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          onBack={() => setCurrentView('dashboard')} 
          onSave={() => {
            setCurrentView('dashboard');
          }} 
        />
      );
    }

    if (user && currentView === 'dashboard') {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          <div className="w-full max-w-[1500px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            
            {/* Main Dashboard Hero Section */}
            <div className="relative rounded-[2rem] overflow-hidden mb-8 border border-white/5 bg-[#13161F] flex flex-col md:flex-row shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              {/* Abstract Background Elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="p-8 md:p-12 relative z-10 flex-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-6 w-max">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span> HOŞ GELDİN, {user.name.split(' ')[0]}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Yönetim <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Platformu</span>
                </h1>
                <p className="text-slate-400 max-w-xl text-sm leading-relaxed mb-8">
                  Tüm iş sağlığı ve güvenliği şablonlarınıza, dökümanlarınıza ve operasyonel verilerinize tek bir ekrandan anında erişin.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-lg group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#1A1D27] border border-white/5 text-slate-200 placeholder-slate-500 rounded-xl outline-none focus:border-orange-500/50 focus:bg-[#1D212E] transition-all text-sm shadow-inner"
                    placeholder="Şablon, belge veya kategori ara... (örn: Hijyen)"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* Stats / Quick Info Panel right side of Hero */}
              <div className="w-full md:w-[350px] bg-[#0A0C10]/50 backdrop-blur-xl border-l border-white/5 p-8 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                     <FileText size={20} />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Toplam Şablon</p>
                     <p className="text-2xl font-black text-white">{safeTemplates.length}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                     <ShieldAlert size={20} />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Aktif Sektör</p>
                     <p className="text-2xl font-black text-white">{uniqueCategories.length}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Categories Carousel */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">Sektörel Kategoriler</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`snap-start shrink-0 px-6 py-4 rounded-xl border flex items-center gap-3 transition-all ${
                    selectedCategory === null 
                      ? 'bg-orange-500 text-slate-900 font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'bg-[#151921] border-[#2A3143] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <FileBox size={18} />
                  <span className="whitespace-nowrap text-xs uppercase tracking-wider">TÜMÜ</span>
                </button>
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`snap-start shrink-0 px-6 py-4 rounded-xl border flex items-center gap-3 transition-all ${
                      selectedCategory === category 
                        ? 'bg-orange-500 text-slate-900 font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                        : 'bg-[#151921] border-[#2A3143] text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span className="whitespace-nowrap text-xs uppercase tracking-wider">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-[#13161F]">
                   <Search size={48} className="text-slate-600 mb-4" />
                   <p className="text-slate-400 text-sm">Aradığınız kriterlere uygun şablon bulunamadı.</p>
                </div>
              ) : (
                filteredTemplates.map(template => (
                  <div 
                    key={template.id} 
                    className="group relative bg-[#151921] border border-[#2A3143] hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10_30px_rgba(249,115,22,0.1)] hover:-translate-y-1 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1A1F2B] border border-white/5 flex items-center justify-center text-slate-400">
                        <FileText size={18} />
                      </div>
                      <span className="px-2.5 py-1 bg-[#1A1F2B] border border-[#2A3143] rounded text-slate-500 text-[9px] uppercase font-bold tracking-widest max-w-[120px] truncate">
                        {template.category}
                      </span>
                    </div>
                    
                    <h3 className="text-slate-200 font-bold text-sm leading-snug mb-2 line-clamp-2 min-h-[40px] group-hover:text-orange-400 transition-colors">
                      {template.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs line-clamp-2 mb-6 flex-1">
                      Bu doküman {template.fields?.length || 0} adet dinamik veri alanı içermektedir. Yönetmelik standartlarına uygundur.
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center text-[10px] uppercase tracking-wider font-bold text-slate-600">
                        <CheckCircle2 size={12} className="mr-1 text-emerald-500" /> Güncel
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCurrentView('editor');
                        }}
                        className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-slate-900"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Layout>
      );
    }

    return null;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#07090E]">
        {renderContent()}
      </div>
    </ErrorBoundary>
  );
};

export default App;
