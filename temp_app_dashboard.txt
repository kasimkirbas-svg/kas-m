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
            
            {/* Bento Grid Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 shadow-inner">
                       <FileText className="text-yellow-500 w-6 h-6" />
                     </div>
                     <span className="text-slate-400 font-medium">Toplam Doküman</span>
                  </div>
                  <div className="text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">1.248</div>
               </div>
               
               <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-all">
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 shadow-inner">
                       <Award className="text-red-500 w-6 h-6" />
                     </div>
                     <span className="text-slate-400 font-medium">Sertifika & Eğitimler</span>
                  </div>
                  <div className="text-4xl font-black text-white group-hover:text-red-400 transition-colors">342</div>
               </div>
               
               <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border border-yellow-200">
                       <CheckCircle2 className="text-black w-6 h-6" />
                     </div>
                     <span className="text-slate-400 font-medium">Bugün Üretilen</span>
                  </div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">14</div>
               </div>
            </div>

            {/* Main Dashboard Hero Section */}
            <div className="relative rounded-[2rem] overflow-hidden mb-8 border border-white/5 bg-zinc-900 flex flex-col md:flex-row shadow-2xl">
              {/* Abstract Background Elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full mix-blend-screen filter blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="p-8 md:p-12 relative z-10 flex-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold tracking-widest uppercase mb-6 w-max shadow-inner shadow-yellow-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> HOŞ GELDİN, {user.name.split(' ')[0]}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-md">Kontrol Merkezi</span>
                </h1>
                <p className="text-slate-400 max-w-xl text-sm leading-relaxed mb-8">
                  Tüm iş sağlığı ve güvenliği şablonlarınıza, dökümanlarınıza ve operasyonel verilerinize tek bir ekrandan anında erişin.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-lg group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#1A1D27] border border-white/5 text-slate-200 placeholder-slate-500 rounded-xl outline-none focus:border-yellow-500/50 focus:bg-[#1D212E] transition-all text-sm shadow-inner"
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
              <div className="w-full md:w-[350px] bg-zinc-950/50 backdrop-blur-xl border-l border-white/5 p-8 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                     <FileText size={20} />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Toplam Şablon</p>
                     <p className="text-2xl font-black text-white">{safeTemplates.length}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
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
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                      : 'bg-zinc-900 border-white/10 text-slate-400 hover:text-white hover:border-yellow-500/50'
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
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                        : 'bg-zinc-900 border-white/10 text-slate-400 hover:text-white hover:border-yellow-500/50'
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
                    className="group relative bg-zinc-900 border border-white/10 hover:border-yellow-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_10_40px_rgba(234,179,8,0.15)] hover:-translate-y-2 flex flex-col overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-6 relative">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-yellow-400 shadow-inner group-hover:scale-110 transition-all">
                        {getCategoryIcon(template.category)}
                      </div>
                      <span className="px-3 py-1.5 bg-zinc-950 border border-white/10 rounded-lg text-yellow-500/70 text-[9px] uppercase font-bold tracking-widest max-w-[150px] truncate shadow-inner">
                        {template.category}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-bold text-base leading-snug mb-3 line-clamp-2 min-h-[48px] group-hover:text-yellow-400 transition-colors relative">
                      {template.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs line-clamp-3 overflow-hidden mb-6 flex-1 font-light relative">
                      {template.fields?.length ? `${template.fields.length} adet akıllı değişken (Magic Variable) hazır. ` : ''}Saniyeler içinde otomatik doldurun ve anında DOCX / PDF olarak indirin. Mevzuata %100 uyumludur.
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center relative">
                      <div className="flex items-center text-[10px] uppercase tracking-wider font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                        <CheckCircle2 size={14} className="mr-1.5 text-emerald-500 shadow-emerald-500/50" /> Şablon Güncel
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCurrentView('editor');
                        }}
                        className="px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:scale-105"
                      >
                        Oluştur
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
