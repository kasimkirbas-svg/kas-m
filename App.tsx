import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { DocumentEditor } from './pages/DocumentEditor';
import { APP_NAME } from './constants';
import { User, DocumentTemplate } from './types';
import { 
  Building2, Factory, Pickaxe, HardHat, Zap, FlaskConical, Briefcase, 
  Search, ArrowDownAz, FileText, ClipboardList, PackageSearch, Trash2, 
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings, Crown
} from 'lucide-react';

// Template & document lists imported from constants (they can be simulated data and we removed local hardcoded parts)
import { MOCK_TEMPLATES } from './constants';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('auth'); 

  // To simulate going into document editor
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Initialize from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (storedUser && lastActivity) {
      if (Date.now() - parseInt(lastActivity, 10) > 3600000) { // 1 hour = 3600000 ms
        handleLogout(true);
      } else {
        setUser(JSON.parse(storedUser));
        setCurrentView('dashboard');
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    }
  }, []);

  // Track activity
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > 3600000) {
        handleLogout(true);
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(interval);
    };
  }, [user]);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  const handleLogout = (auto = false) => {
    setUser(null);
    setCurrentView('auth');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    if (auto) {
      alert('You have been logged out due to inactivity.');
    }
  };

  const renderContent = () => {
    if (currentView === 'auth') {
      return (
        <Auth 
          onAuthSuccess={handleAuthSuccess}
          onBack={() => {}}
        />
      );
    }

    if (currentView === 'editor' && selectedTemplate) {
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          onBack={() => setCurrentView('dashboard')} 
          onSave={() => {
            alert('Doküman sisteminize başarıyla kaydedildi.');
            setCurrentView('dashboard');
          }} 
        />
      );
    }

    if (user && currentView === 'dashboard') {
      return (
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={() => handleLogout()}>
          <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 animate-in fade-in duration-500">
            {/* Header Title (Centered in the layout historically) */}
            <div className="text-center mb-16 mt-4 relative flex flex-col items-center justify-center">
              <h1 className="text-2xl md:text-4xl font-black text-slate-100 uppercase tracking-widest drop-shadow-md">
                YILLIK DOKÜMANLAR
              </h1>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-orange-500 font-bold text-xl">&amp;</span>
              </div>
              <p className="text-sm font-bold text-orange-500/90 tracking-[0.3em] mt-2">İ Ş &nbsp; T A K İ P &nbsp; P A N E L İ</p>
            </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
             {/* Temporary disabled dummy buttons for visual representation */}
             <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-purple-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <Factory size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">FABRİKA</h3>
               </div>
             </div>
             
             <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-indigo-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <Building2 size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">KURUMSAL</h3>
               </div>
             </div>
             
              <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-orange-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <Pickaxe size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">MADEN</h3>
               </div>
             </div>
             
              <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-rose-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <HardHat size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">İNŞAAT</h3>
               </div>
             </div>
             
              <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 to-amber-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <Zap size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">ENERJİ</h3>
               </div>
             </div>
             
              <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-emerald-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <FlaskConical size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">KİMYA</h3>
               </div>
             </div>
             
              <div className="group relative h-28 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 opacity-70 cursor-not-allowed">
               <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 to-fuchsia-900/80 mix-blend-multiply opacity-80" />
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center p-3 text-white">
                 <div className="mb-2 opacity-80">
                   <Briefcase size={32} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-center drop-shadow-md">KOBİ</h3>
               </div>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Content: Document List */}
            <div className="flex-1 bg-[#151921] border border-[#2A3143] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2A3143]">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#1A1F2B] rounded-xl flex items-center justify-center border border-[#2A3143]">
                     <FileBox size={20} className="text-orange-500" />
                   </div>
                   <div>
                     <h2 className="text-white font-bold text-lg uppercase tracking-wider">TÜM SEKTÖRLER <span className="text-slate-500">DOKÜMANLARI</span></h2>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-500 rounded-lg border border-orange-500 transition-colors text-xs font-bold uppercase tracking-wider">
                    Yeni Ekle
                  </button>
                </div>
              </div>

              {/* Data Table Skeleton */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-[#64748b] text-[10px] uppercase tracking-wider border-b border-[#2A3143]">
                      <th className="pb-3 font-semibold">Dosya Adı</th>
                      <th className="pb-3 font-semibold">Sektör</th>
                      <th className="pb-3 font-semibold">Oluşturma Tarihi</th>
                      <th className="pb-3 font-semibold">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty State / Backend Integration Point */}
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center opacity-50">
                           <FolderOpen size={48} className="text-slate-500 mb-3" />
                           <p className="text-slate-400 text-sm">Henüz doküman bulunmamaktadır.</p>
                        </div>
                      </td>
                    </tr>
                    {/* Real rows will map here */}
                  </tbody>
                </table>
              </div>

              {/* View More Button Centered at Bottom */}
              <div className="mt-auto flex justify-center pb-2 pt-6">
                <button className="px-6 py-3 bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/30 text-slate-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all flex flex-col items-center gap-1 group">
                  TÜMÜNÜ GÖSTER
                  <div className="w-4 h-1 border-b-2 border-r-2 border-slate-500 group-hover:border-orange-500 rotate-45 transform translate-y-[-2px]"></div>
                </button>
              </div>
            </div>

            {/* Right Content: Sidebar Actions & Widgets */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4">
              
              {/* Special Box: Sertifika Oluştur */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-indigo-900/20 cursor-pointer hover:shadow-indigo-900/40 transition-all hover:-translate-y-1">
                 <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none transform translate-x-4 -translate-y-4">
                   <Award size={100} strokeWidth={1} />
                 </div>
                 <div className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">YENİ</div>
                 <h2 className="text-white text-xl font-black uppercase tracking-wider leading-tight mb-1">SERTİFİKA<br/>OLUŞTUR</h2>
                 <p className="text-indigo-100 text-xs font-medium">Profesyonel şablonlar ile</p>
                 <div className="absolute top-6 right-6 text-white drop-shadow-md">
                   <Award size={40} strokeWidth={1.5} />
                 </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-[#151921] border border-[#2A3143] rounded-3xl overflow-hidden shadow-xl">
                 <div className="bg-orange-600/90 py-3 px-5 flex items-center gap-2">
                   <Zap size={16} fill="currentColor" className="text-yellow-300" />
                   <h3 className="text-white text-sm font-bold tracking-widest uppercase drop-shadow-sm">HIZLI İŞLEMLER</h3>
                 </div>
                 
                 <div className="p-4 grid grid-cols-2 gap-3">
                   <button className="bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/40 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group cursor-not-allowed opacity-80"
                           title="Yakında eklenecektir">
                     <FileText size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                     <div className="text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Hemen</p>
                       <p className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-tight">TUTANAK</p>
                     </div>
                   </button>
                   <button className="bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/40 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group cursor-not-allowed opacity-80"
                           title="Yakında eklenecektir">
                     <ClipboardList size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                     <div className="text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Günlük</p>
                       <p className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-tight">RAPOR</p>
                     </div>
                   </button>
                   <button className="bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/40 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group cursor-not-allowed opacity-80"
                           title="Yakında eklenecektir">
                     <UserPlus size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                     <div className="text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Personel</p>
                       <p className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-tight">İZİN FORMU</p>
                     </div>
                   </button>
                   <button className="bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/40 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group cursor-not-allowed opacity-80"
                           title="Yakında eklenecektir">
                     <PackageSearch size={24} className="text-purple-400 group-hover:scale-110 transition-transform" />
                     <div className="text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Demirbaş</p>
                       <p className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-tight">ZİMMETLE</p>
                     </div>
                   </button>
                 </div>
              </div>

              {/* Archive Document Button */}
              <button 
                onClick={() => document.getElementById('archive-panel')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#151921] border border-[#2A3143] hover:border-purple-500/50 p-5 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-purple-400 transition-colors">
                    <FolderOpen size={28} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-sm font-bold tracking-widest uppercase">DOKÜMAN ARŞİVİ</h3>
                    <p className="text-slate-500 text-[10px]">Tüm dosyalarınızı inceleyin</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          </div>
          
          {/* Archive Data Placeholder ID */}
          <div id="archive-panel" className="bg-[#151921] border border-[#2A3143] rounded-3xl overflow-hidden shadow-xl p-6 mt-6">
             <h3 className="text-white text-sm font-bold tracking-widest uppercase border-b border-[#2A3143] pb-3 mb-4">DOKÜMAN ARŞİVİ</h3>
             <div className="flex flex-col items-center justify-center opacity-50 py-10">
                <FolderOpen size={48} className="text-slate-500 mb-3" />
                <p className="text-slate-400 text-sm">Gelen dosyalar ve arşiv veritabanı bağlandığında burada listelenecektir.</p>
             </div>
          </div>

          <div className="mt-14 mb-8">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-white font-black text-2xl uppercase tracking-wider flex items-center gap-3">
                <Crown className="text-orange-500" />
                PREMIUM AYRICALIKLARI
              </h2>
              <p className="text-slate-400 text-sm mt-2">Sınırsız doküman erişimi ve gelişmiş özellikler için planınızı yükseltin.</p>
            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-10">
              <div className="bg-[#151921] border border-[#2A3143] p-1.5 rounded-full flex relative">
                <button className="px-8 py-2.5 rounded-full text-slate-400 text-sm font-bold hover:text-white transition-colors relative z-10 w-32">AYLIK</button>
                <button className="px-8 py-2.5 bg-indigo-600 rounded-full text-white text-sm font-bold  transition-all relative z-10 w-32 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  YILLIK
                  <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">%20 İNDİRİM</span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
              
              {/* SILVER CARD */}
              <div className="bg-[#151921]/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center shadow-lg transition-transform hover:-translate-y-2">
                <div className="text-slate-400 mb-2 font-bold tracking-widest text-sm flex items-center justify-center gap-2">
                  <div className="w-8 h-[1px] bg-slate-400/30"></div>
                  SILVER
                  <div className="w-8 h-[1px] bg-slate-400/30"></div>
                </div>
                <div className="text-3xl font-black text-white mb-2">1000 TL</div>
                <div className="bg-slate-800 text-slate-300 text-[10px] uppercase font-bold py-1 px-3 rounded-full mb-8 tracking-wider">TEMEL LİMİT</div>
                
                <div className="flex-1 w-full space-y-4 mb-8">
                  {/* Dinamik veriyle dolacak liste iskeleti */}
                  <div className="h-4 bg-slate-800 rounded w-full skeleton-pulse m-auto"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6 m-auto"></div>
                  <div className="h-4 bg-slate-800 rounded w-4/6 m-auto"></div>
                </div>

                <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all shadow-md text-sm">
                  SATIN AL
                </button>
              </div>

              {/* GOLD CARD - Center/Popular */}
              <div className="bg-gradient-to-b from-orange-900/40 to-[#151921] border border-orange-500/50 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_30px_rgba(249,115,22,0.15)] relative scale-105 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest shadow-lg flex items-center gap-1 uppercase">
                  ★ EN ÇOK TERCİH EDİLEN ★
                </div>

                <div className="text-amber-500 mb-2 font-black tracking-widest text-lg flex items-center justify-center gap-2 mt-4 text-shadow-sm">
                  <Crown size={20} className="text-amber-500" />
                  GOLD
                </div>
                <div className="text-4xl font-black text-white mb-2 drop-shadow-md">1750 TL</div>
                <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] uppercase font-bold py-1 px-3 rounded-full mb-8 tracking-wider">2 KAT AVANTAJ</div>
                
                <div className="flex-1 w-full space-y-4 mb-8">
                  <div className="h-4 bg-orange-900/40 rounded w-full skeleton-pulse m-auto"></div>
                  <div className="h-4 bg-orange-900/40 rounded w-full m-auto"></div>
                  <div className="h-4 bg-orange-900/40 rounded w-5/6 m-auto"></div>
                </div>

                <button className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-900 font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] text-sm">
                  HEMEN AL
                </button>
              </div>

              {/* DIAMOND CARD */}
              <div className="bg-[#151921]/80 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-transform hover:-translate-y-2">
                <div className="text-indigo-400 mb-2 font-black tracking-widest text-lg flex items-center justify-center gap-2 text-shadow-sm">
                  <Pickaxe size={20} className="text-indigo-400" />
                  DIAMOND
                </div>
                <div className="text-3xl font-black text-white mb-2">2500 TL</div>
                <div className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] uppercase font-bold py-1 px-3 rounded-full mb-8 tracking-wider drop-shadow-sm flex items-center justify-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                   SINIRSIZ ERİŞİM
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                </div>
                
                <div className="flex-1 w-full space-y-4 mb-8">
                  <div className="h-4 bg-indigo-900/40 rounded w-full skeleton-pulse m-auto"></div>
                  <div className="h-4 bg-indigo-900/40 rounded w-full m-auto"></div>
                  <div className="h-4 bg-indigo-900/40 rounded w-4/6 m-auto"></div>
                </div>

                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] text-sm">
                  SATIN AL
                </button>
              </div>

            </div>
          </div>

          </div>
        </Layout>
      );
    }

    return null;
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default App;