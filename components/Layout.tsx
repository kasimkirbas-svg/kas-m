import React, { useState } from 'react';
import { 
  FileText, Settings, User as UserIcon, LogOut, Menu, X, 
  LayoutDashboard, FolderOpen, PlusSquare, ChevronDown,
  Bell, Sun, Moon, Globe, MessageSquare, Shield, CreditCard, Users, ArrowLeft
} from 'lucide-react';

interface LayoutProps {
  user: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  language?: 'tr' | 'en' | 'ar';
  onLanguageChange?: (lang: 'tr' | 'en' | 'ar') => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  documentsCount?: number;
  t?: any;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  user, currentView, onNavigate, onLogout, 
  language = 'tr', onLanguageChange, 
  theme = 'light', onThemeChange,
  onGoBack, canGoBack,
  documentsCount = 0,
  t, children 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const _t = (key: string, fallback: string) => {
    if (!t) return fallback;
    const parts = key.split('.');
    let val = t;
    for (const part of parts) {
      if (val === undefined || val === null) break;
      val = val[part];
    }
    return val || fallback;
  };

  const menuItems = user.role === 'ADMIN'
      ? [
          { label: _t('nav.admin', 'Yönetici Paneli'), view: 'admin', icon: Shield },
          { label: _t('nav.users', 'Kullanıcı Yönetimi'), view: 'users', icon: Users },
          { label: _t('nav.templates', 'Şablon Yönetimi'), view: 'admin-templates', icon: FileText },
          { label: _t('nav.dashboard', 'Ana Sayfaya Dön'), view: 'dashboard', icon: LayoutDashboard },
        ]
      : [
          // All top menu items removed as requested. 
          // Navigation will be handled via the Dashboard interface.
        ];

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Hoşgeldiniz', message: 'Kırbaş Panel\'e hoşgeldiniz.', time: 'Şimdi' },
    { id: 2, title: 'Sistem', message: 'Koyu mod varsayılan olarak aktif.', time: '1 saat önce' },
  ];

  /* 
     SPECIAL DASHBOARD HANDLING:
     If the user wants a truly immersive dashboard, we might render differently.
     But current request is "don't go to old interface", so we use the SAME Layout wrapper for everything.
  */

  return (
    <div className={`flex flex-col font-sans bg-slate-200 dark:bg-[#0f1115] text-slate-900 dark:text-slate-200 selection:bg-amber-500/30 min-h-screen transition-colors duration-300 relative overflow-x-hidden`}>
      
      {/* GLOBAL BACKGROUND EFFECTS (Optimized for Performance) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#050510]">
          
          {/* 1. Base Gradient & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] z-10 opacity-70"></div>
          <div className="absolute inset-0 bg-grid-premium opacity-[0.4] z-0"></div>

          {/* 2. Floating Blobs (Reduced opacity/blur on mobile, removed heavy CSS animations) */}
          <div className="absolute top-[-20%] left-[-10%] w-[400px] md:w-[900px] h-[400px] md:h-[900px] rounded-full bg-[#3b82f6]/10 md:bg-[#3b82f6]/15 blur-[80px] md:blur-[150px] mix-blend-screen will-change-transform"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-[#f59e0b]/10 md:bg-[#f59e0b]/15 blur-[80px] md:blur-[150px] mix-blend-screen will-change-transform"></div>
          
          {/* 3. Spotlight */}
           <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[140px] pointer-events-none will-change-transform"></div>

          {/* 4. Accents (Hidden on mobile to save GPU) */}
           <div className="hidden md:block absolute top-1/3 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px]"></div>
           <div className="hidden md:block absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px]"></div>
      </div>

      {/* INDUSTRIAL TOP NAVIGATION BAR - Improved Visibility */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-transparent shrink-0 pointer-events-auto">
        
        {/* Left: Branding */}
        <div className="flex flex-col items-end gap-2 relative z-[100]">
            <div 
                className="flex items-center gap-3 cursor-pointer group select-none pointer-events-auto"
                onClick={() => onNavigate('dashboard')}
            >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-400/20">
                    K
                </div>
                {/* Text visible on tablet+ */}
                <div className="hidden md:flex flex-col drop-shadow-md">
                    <span className="font-bold text-lg leading-none text-slate-800 dark:text-slate-100 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">KIRBAŞ</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase">Panel Yönetimi</span>
                </div>
            </div>
            
            {/* Geri Dön Tuşu (Logonun altında sağa dayalı) */}
            {onGoBack && canGoBack && currentView !== 'dashboard' && currentView !== 'auth' && (
                <button 
                    onClick={onGoBack} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-lg transition-all shadow-md cursor-pointer pointer-events-auto z-[100] active:scale-95"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Geri Dön</span>
                </button>
            )}
        </div>

        <div className="flex items-center gap-4">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
                {menuItems.map(item => {
                    const isActive = currentView === item.view;
                    return (
                        <button
                            key={item.view}
                            onClick={() => onNavigate(item.view)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative group overflow-hidden
                                ${isActive 
                                    ? 'bg-slate-200 dark:bg-slate-800 text-amber-600 dark:text-amber-500 shadow-inner shadow-black/5 dark:shadow-black/20' 
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                }
                            `}
                        >
                            <item.icon size={18} className={`transition-transform duration-300 ${isActive ? 'text-amber-600 dark:text-amber-500 scale-110' : 'text-slate-500 group-hover:scale-110'}`} />
                            <span className="relative z-10">{item.label}</span>
                            {isActive && <div className="absolute inset-0 bg-amber-500/5 rounded-lg"></div>}
                        </button>
                    );
                })}
            </nav>
        </div>

        {/* Right: Actions (Language and Theme toggles removed) */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            
            {/* Notifications */}
            <div className="relative">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-600/20 hover:to-amber-700/20 text-amber-600 dark:text-amber-500 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group relative"
                >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 font-bold backdrop-blur-sm group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition-colors">
                        <Bell size={18} className="origin-top group-hover:animate-wiggle" />
                    </div>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></span>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-900"></span>
                </button>

                {notificationsOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Bildirimler</h3>
                            <button className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-bold">Temizle</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm shadow-amber-500/10">
                                            <MessageSquare size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{notif.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 font-mono">{notif.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </>
                )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all shadow-lg shadow-amber-500/40 hover:shadow-amber-600/60 hover:-translate-y-0.5 group animate-pulse-slow"
                >
                   <div className="hidden md:block text-sm font-bold text-white transition-colors drop-shadow-sm">
                       Menü
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                        <Menu size={18} />
                   </div>
                </button>

                {profileMenuOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in zoom-in-95 duration-200 transform origin-top-right">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 md:hidden bg-slate-50 dark:bg-slate-950/30">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        </div>
                        <div className="p-2 space-y-1">
                            <button onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                                <UserIcon size={16} className="group-hover:text-amber-500 transition-colors" /> {_t('nav.profile', 'Profil Bilgilerim')}
                            </button>
                            <button onClick={() => { onNavigate('settings'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                                <Settings size={16} className="group-hover:text-indigo-500 transition-colors" /> {_t('nav.settings', 'Genel Ayarlar')}
                            </button>
                            {user.role !== 'ADMIN' && (
                                <button onClick={() => { onNavigate('subscription'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                                    <CreditCard size={16} className="group-hover:text-emerald-500 transition-colors" /> {_t('nav.subscription', 'Abonelik Paketleri')}
                                </button>
                            )}
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2"></div>
                            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                <LogOut size={16} /> {_t('common.logout', 'Oturumu Kapat')}
                            </button>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 w-full relative z-10 ${currentView === 'dashboard' ? 'p-0 overflow-x-hidden' : 'overflow-x-hidden p-4 md:p-6 lg:p-8 pt-24 md:pt-28'}`}>
        <div key={currentView} className={`${currentView === 'dashboard' ? 'w-full h-full' : 'max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-fade-in-up pb-20 md:pb-0'}`}>
             {children}
        </div>
      </main>

       {/* Mobile Menu Overlay */}
       {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col pt-16 animate-in slide-in-from-left duration-200">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          
          <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 text-slate-600 dark:text-slate-400 hover:text-white bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700"
          >
              <X size={24} />
          </button>

          <nav className="relative z-10 px-6 py-8 space-y-3 overflow-y-auto w-4/5 max-w-sm h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl">
             <div className="mb-8 px-2">
                 <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 border border-amber-400/20">
                        K
                    </div>
                    <div>
                        <div className="font-bold text-lg leading-none text-slate-800 dark:text-slate-100 tracking-wide">KIRBAŞ PANEL</div>
                        <div className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Mobil Menü</div>
                    </div>
                 </div>

                 {menuItems.length > 0 && (
                     <>
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Navigasyon</h2>
                        {menuItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => {
                            onNavigate(item.view);
                            setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all border. mb-2 ${
                            currentView === item.view
                                ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20'
                                : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border-transparent'
                            }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                        ))}
                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-6 mx-2"></div>
                     </>
                 )}
             </div>
             
             <div className="px-2 space-y-3">
                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Hesap</h2>
                 <button onClick={() => { onNavigate('settings'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
                    <Settings size={20} /> {_t('nav.settings', 'Ayarlar')}
                 </button>
                 <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
                    <UserIcon size={20} /> {_t('nav.profile', 'Profilim')}
                 </button>
                 {user.role !== 'ADMIN' && (
                     <button onClick={() => { onNavigate('subscription'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
                        <CreditCard size={20} /> {_t('nav.subscription', 'Paketlerim')}
                     </button>
                 )}
                 <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent mt-4">
                    <LogOut size={20} /> {_t('common.logout', 'Çıkış Yap')}
                 </button>
             </div>
          </nav>
        </div>
      )}

    </div>
  );
};
