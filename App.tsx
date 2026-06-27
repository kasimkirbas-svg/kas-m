import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { DocumentEditor } from './pages/DocumentEditor';
import { APP_NAME } from './constants';
import { User, DocumentTemplate } from './types';
import { 
  Building2, Factory, Pickaxe, HardHat, Zap, FlaskConical, Briefcase, 
  Search, ArrowDownAz, FileText, ClipboardList, PackageSearch, Trash2, 
  FileBox, UserCheck, CheckSquare, Award, FileClock, FolderOpen, ArrowRight,
  ShieldAlert, UserPlus, FileArchive, Settings
} from 'lucide-react';

// Template & document lists imported from constants (they can be simulated data and we removed local hardcoded parts)
import { MOCK_TEMPLATES } from './constants';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('auth'); 

  // To simulate going into document editor
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
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
        <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
          <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 animate-in fade-in duration-500">
            {/* Header Title (Centered in the layout historically) */}
            <div className="text-center mb-10 mt-6 relative">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 uppercase tracking-widest drop-shadow-md">
                YILLIK DOKÜMANLAR
              </h1>
              <p className="text-sm font-bold text-orange-500 tracking-[0.2em] mt-1 hidden md:block">İ Ş &nbsp;&nbsp; T A K İ P &nbsp;&nbsp; P A N E L İ</p>
              <div className="absolute top-0 right-0 md:hidden text-orange-500 opacity-80 text-xl font-bold">&amp;</div>
            </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
             {/* You may want to map your actual sectors here or implement logic */}
             <p className="text-white text-sm col-span-full text-center">Sektör kartları (Veritabanından Gelecek)</p>
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
                     <p className="text-slate-500 text-xs">Sistemde kayıtlı toplam 70 adet doküman listeleniyor.</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-slate-400 hover:text-white bg-[#1A1F2B] rounded-lg border border-[#2A3143] hover:border-orange-500/30 transition-colors">
                    <Search size={18} />
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-white bg-[#1A1F2B] rounded-lg border border-[#2A3143] hover:border-orange-500/30 transition-colors">
                    <ArrowDownAz size={18} />
                  </button>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                 <p className="text-white text-sm col-span-full">Dokümanlar (Veritabanından Gelecek)</p>
              </div>

              {/* View More Button Centered at Bottom */}
              <div className="mt-auto flex justify-center pb-2">
                <button className="px-6 py-3 bg-[#1A1F2B] hover:bg-[#202736] border border-[#2A3143] hover:border-orange-500/30 text-slate-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all flex flex-col items-center gap-1 group">
                  TÜMÜNÜ GÖSTER (58 DAHA FAZLA)
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

              {/* Archive Data Placeholder ID */}
              <div id="archive-panel" className="bg-[#151921] border border-[#2A3143] rounded-3xl overflow-hidden shadow-xl p-6 mt-4">
                 <h3 className="text-white text-sm font-bold tracking-widest uppercase border-b border-[#2A3143] pb-3 mb-4">DOKÜMAN ARŞİVİ (VERİLER)</h3>
                 <p className="text-slate-400 text-xs">Arşivdeki dosyalar backend servisine bağlandığında burada listelenecektir.</p>
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