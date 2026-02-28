import React, { useState } from 'react';
import { 
  FileText, Settings, User as UserIcon, LogOut, Menu, X, 
  LayoutDashboard, FolderOpen, PlusSquare, ChevronLeft, ChevronRight,
  Shield, CreditCard, Bell, Search, Sun, Moon, Globe,
  HelpCircle, AlertCircle, MessageSquare
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  // Helper for translations
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
          { label: _t('nav.admin', 'Yönetici'), view: 'admin', icon: LayoutDashboard },
          { label: _t('nav.users', 'Kullanıcılar'), view: 'users', icon: UserIcon },
          { label: _t('nav.templates', 'Şablonlar'), view: 'admin-templates', icon: FileText },
          { label: _t('nav.packages', 'Paketler'), view: 'admin-packages', icon: CreditCard },
          { label: _t('nav.settings', 'Ayarlar'), view: 'settings', icon: Settings },
        ]
      : [
          { label: _t('nav.dashboard', 'Ana Sayfa'), view: 'dashboard', icon: LayoutDashboard },
          { label: `${_t('nav.documents', 'Belgelerim')} (${documentsCount})`, view: 'my-documents', icon: FolderOpen },
          { label: _t('nav.create', 'Yeni Oluştur'), view: 'templates', icon: PlusSquare },
          { label: _t('nav.profile', 'Profilim'), view: 'profile', icon: UserIcon },
          { label: _t('nav.settings', 'Ayarlar'), view: 'settings', icon: Settings },
        ];

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Hoşgeldiniz', message: 'Kırbaş Panel\'e hoşgeldiniz.', time: 'Şimdi' },
    { id: 2, title: 'Yeni Özellik', message: 'Koyu mod artık kullanılabilir.', time: '1 saat önce' },
  ];

  // DASHBOARD SPECIAL LAYOUT: Full Screen, No Sidebar/Header
  if (currentView === 'dashboard') {
     return (
        <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${theme === 'dark' ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
            <main className="w-full h-full min-h-screen relative p-0 overflow-hidden">
                {children}
            </main>
        </div>
     );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${theme === 'dark' ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar - Desktop & Mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'} 
        flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[40px] h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
              K
            </div>
            <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 whitespace-nowrap transition-opacity duration-300 ${!sidebarOpen && 'md:opacity-0 md:w-0'}`}>
              Kırbaş Panel
            </span>
          </div>
          
          {/* Desktop Toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all hover:scale-105"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {/* Mobile Close */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  if(window.innerWidth < 768) setSidebarOpen(false); // Close on mobile
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 translate-x-1' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <item.icon size={22} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'md:opacity-0 md:w-0 md:hidden'}`}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state (Desktop only) */}
                {!sidebarOpen && (
                   <div className="hidden md:block absolute left-full ml-6 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700/50 translate-x-2 group-hover:translate-x-0">
                     {item.label}
                   </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Usage Stats (Visible only when open) */}
        {(sidebarOpen) && user.role !== 'ADMIN' && (
          <div className="px-5 py-6 mt-auto">
            <div className={`bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-900/20 dark:to-slate-900/40 rounded-2xl p-5 border border-slate-200/10 dark:border-indigo-500/20 shadow-xl relative overflow-hidden group transition-all duration-300 ${!sidebarOpen && 'md:hidden'}`}>
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
               
               <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{_t('common.rights','Kalan Hak')}</span>
                  <span className="text-sm font-black text-white bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}
                  </span>
               </div>
               
               {user.remainingDownloads !== 'UNLIMITED' && (
               <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${Math.min(100, (Number(user.remainingDownloads) / 10) * 100)}%` }} 
                  />
               </div>
               )}
               
               <button onClick={() => onNavigate('subscription')} className="w-full mt-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/5">
                 Paket Yükselt
               </button>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 dark:border-slate-800/50">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className={`font-medium ${!sidebarOpen && 'hidden'}`}>{_t('common.logout', 'Çıkış Yap')}</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP for Mobile Sidebar */}
      {sidebarOpen && (
         <div 
           className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
           onClick={() => setSidebarOpen(false)}
         ></div>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full md:pl-0 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        
        {/* Top Header */}
        <header className="h-20 px-6 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-30 flex items-center justify-between transition-colors duration-300">
            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 -ml-2 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Spacer for Desktop (Since Search was here) */}
            <div className="hidden md:block flex-1"></div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-4 ml-auto">
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all active:scale-95"
                >
                  <Globe size={20} />
                </button>

                
                {langMenuOpen && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1 overflow-hidden animate-fade-in">
                    {[
                      { code: 'tr', label: 'Türkçe' },
                      { code: 'en', label: 'English' },
                      { code: 'ar', label: 'العربية' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange?.(lang.code as any);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between
                          ${language === lang.code ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-300'}
                        `}
                      >
                        {lang.label}
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                      </button>
                    ))}
                  </div>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-yellow-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              {/* Notifications */}
              <div className="relative">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                </button>
                {notificationsOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                            <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Bildirimler</h3>
                                <span className="text-xs text-indigo-500 cursor-pointer font-medium hover:underline">Tümünü Okundu İşaretle</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="p-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer last:border-0 relative group">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <MessageSquare size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1.5">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
              </div>

               <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                   <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">{user.name}</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}</div>
                 </div>
                 <button 
                    onClick={() => onNavigate('profile')}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform"
                 >
                   <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase">
                     {user.name.charAt(0)}
                   </div>
                 </button>
               </div>
            </div>
        </header>

        {/* Dynamic Content */}
        <main className={`flex-1 overflow-x-hidden w-full relative ${currentView === 'dashboard' ? 'p-0' : 'p-4 md:p-6 lg:p-8'}`}>
          <div className={`${currentView === 'dashboard' ? 'w-full' : 'max-w-7xl mx-auto space-y-6 md:space-y-8'} animate-fade-in pb-20 md:pb-0`}>
             {children}
          </div>
        </main>
      </div>

       {/* Mobile Menu Overlay */}
       {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 p-6 shadow-2xl animate-fade-in flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <span className="font-bold text-xl text-slate-900 dark:text-white">Menü</span>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400">
                 <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentView === item.view
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            </div>

            {/* Mobile Footer Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              
              {/* Mobile Right Usage */}
              {user.role !== 'ADMIN' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Kalan Haklar</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}</span>
                    </div>
                    {user.remainingDownloads !== 'UNLIMITED' && (
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (Number(user.remainingDownloads) / 10) * 100)}%` }}></div>
                    </div>
                    )}
                </div>
              )}

              <button    
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                  <LogOut size={20} />
                  {_t('common.logout', 'Çıkış Yap')}
              </button>
            </div>
          </nav>
        </div>
      )}

    </div>
  );
};
