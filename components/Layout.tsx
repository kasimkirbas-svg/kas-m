import React, { useState } from 'react';
import { 
  FileText, Settings, User as UserIcon, LogOut, Menu, X, 
  LayoutDashboard, FolderOpen, PlusSquare, ChevronDown,
  Bell, Sun, Moon, Globe, MessageSquare, Shield, CreditCard, Users
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
  documentsCount?: number;
  t?: any;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  user, currentView, onNavigate, onLogout, 
  language = 'tr', onLanguageChange, 
  theme = 'light', onThemeChange,
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
    <div className={`flex flex-col font-sans bg-slate-950 text-slate-200 selection:bg-amber-500/30 min-h-screen`}>
      
      {/* INDUSTRIAL TOP NAVIGATION BAR */}
      <header className="h-14 md:h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 flex items-center justify-between px-4 shadow-2xl shadow-black/20 shrink-0">
        
        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-4">
            {/* Mobile Toggle */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div 
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={() => onNavigate('dashboard')}
            >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    K
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="font-bold text-lg leading-none text-slate-100 tracking-wide group-hover:text-amber-500 transition-colors">KIRBAŞ</span>
                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Panel Yönetimi</span>
                </div>
            </div>
            
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
                                    ? 'bg-slate-800 text-amber-500 shadow-inner shadow-black/20' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }
                            `}
                        >
                            <item.icon size={18} className={`transition-transform duration-300 ${isActive ? 'text-amber-500 scale-110' : 'text-slate-500 group-hover:scale-110'}`} />
                            <span className="relative z-10">{item.label}</span>
                            {isActive && <div className="absolute inset-0 bg-amber-500/5 rounded-lg"></div>}
                        </button>
                    );
                })}
            </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
            
            {/* Quick Actions (Settings shortcut) - REMOVED */}


            {/* Notifications */}
            <div className="relative">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg transition-all relative group"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></span>
                </button>

                {notificationsOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-200 text-sm">Bildirimler</h3>
                            <button className="text-xs text-amber-500 hover:text-amber-400 font-bold">Temizle</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 shrink-0 border border-slate-700 shadow-sm shadow-amber-500/10">
                                            <MessageSquare size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 group-hover:text-amber-500 transition-colors">{notif.title}</p>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                                            <p className="text-[10px] text-slate-600 mt-2 font-mono">{notif.time}</p>
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
                    className="flex items-center gap-3 pl-2 py-1 hover:bg-slate-800 rounded-xl transition-colors text-left group"
                >
                   <div className="text-right hidden md:block leading-tight">
                       <div className="text-sm font-bold text-slate-200 group-hover:text-amber-500 transition-colors">{user.name}</div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{user.role === 'ADMIN' ? 'YÖNETİCİ' : 'KULLANICI'}</div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shadow-sm group-hover:border-amber-500/50 transition-colors text-sm">
                        {user.name.charAt(0).toUpperCase()}
                   </div>
                   <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                </button>

                {profileMenuOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 z-50 overflow-hidden animate-in zoom-in-95 duration-200 transform origin-top-right">
                        <div className="p-4 border-b border-slate-800 md:hidden bg-slate-950/30">
                            <div className="text-sm font-bold text-slate-200">{user.name}</div>
                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        </div>
                        <div className="p-2 space-y-1">
                            <button onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group">
                                <UserIcon size={16} className="group-hover:text-amber-500 transition-colors" /> {_t('nav.profile', 'Profil Bilgilerim')}
                            </button>
                            <button onClick={() => { onNavigate('settings'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group">
                                <Settings size={16} className="group-hover:text-indigo-500 transition-colors" /> {_t('nav.settings', 'Genel Ayarlar')}
                            </button>
                            {user.role !== 'ADMIN' && (
                                <button onClick={() => { onNavigate('subscription'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group">
                                    <CreditCard size={16} className="group-hover:text-emerald-500 transition-colors" /> {_t('nav.subscription', 'Abonelik Paketleri')}
                                </button>
                            )}
                            <div className="h-px bg-slate-800 my-1 mx-2"></div>
                            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
      <main className={`flex-1 w-full relative ${currentView === 'dashboard' ? 'p-0 overflow-x-hidden' : 'overflow-x-hidden p-4 md:p-6 lg:p-8'}`}>
        <div className={`${currentView === 'dashboard' ? 'w-full h-full' : 'max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-0'}`}>
             {children}
        </div>
      </main>

       {/* Mobile Menu Overlay */}
       {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col pt-16">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          
          <nav className="relative z-10 px-6 py-8 space-y-3 overflow-y-auto">
             <div className="mb-6 px-2">
                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Navigasyon</h2>
                 {menuItems.map(item => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onNavigate(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all border border-transparent mb-2 ${
                      currentView === item.view
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border-slate-800'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
             </div>

             <div className="h-px bg-slate-800 my-6 mx-2"></div>
             
             <div className="px-2 space-y-3">
                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Hesap</h2>
                 <button onClick={() => { onNavigate('settings'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all bg-slate-900 border border-slate-800">
                    <Settings size={20} /> {_t('nav.settings', 'Ayarlar')}
                 </button>
                 <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all bg-slate-900 border border-slate-800">
                    <UserIcon size={20} /> {_t('nav.profile', 'Profilim')}
                 </button>
                 <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-red-500 hover:bg-red-900/10 transition-all border border-transparent mt-4">
                    <LogOut size={20} /> {_t('common.logout', 'Çıkış Yap')}
                 </button>
             </div>
          </nav>
        </div>
      )}

    </div>
  );
};
