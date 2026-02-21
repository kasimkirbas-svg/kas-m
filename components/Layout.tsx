import React, { useState } from 'react';
import { 
  FileText, Settings, User as UserIcon, LogOut, Menu, X, 
  LayoutDashboard, FolderOpen, PlusSquare, ChevronLeft, ChevronRight,
  Shield, CreditCard, Bell, Search
} from 'lucide-react';

interface LayoutProps {
  user: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  language?: 'tr' | 'en' | 'ar';
  t?: any;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, language = 'tr', t, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const menuItems = user.role === 'ADMIN'
      ? [
          { label: 'Gösterge Paneli', view: 'admin', icon: LayoutDashboard },
          { label: 'Kullanıcı Yönetimi', view: 'users', icon: UserIcon },
          { label: 'Şablonlar', view: 'admin-templates', icon: FileText },
          { label: 'Paket Ayarları', view: 'admin-packages', icon: CreditCard },
          { label: 'Sistem Ayarları', view: 'settings', icon: Settings },
        ]
      : [
          { label: 'Ana Sayfa', view: 'dashboard', icon: LayoutDashboard },
          { label: 'Belgelerim', view: 'my-documents', icon: FolderOpen },
          { label: 'Yeni Oluştur', view: 'templates', icon: PlusSquare },
          { label: 'Profilim', view: 'profile', icon: UserIcon },
          { label: 'Ayarlar', view: 'settings', icon: Settings },
        ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} 
        hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 fixed h-full z-30`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[32px] h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              K
            </div>
            <span className={`font-bold text-lg text-slate-800 dark:text-slate-100 whitespace-nowrap transition-opacity duration-300 ${!sidebarOpen && 'opacity-0 w-0'}`}>
              Kırbaş Panel
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                )}
                <item.icon size={20} className={`shrink-0 ${isActive && 'text-indigo-600 dark:text-indigo-400'}`} />
                <span className={`whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'opacity-0 w-0 hidden'}`}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                     {item.label}
                   </div>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            <span className={`${!sidebarOpen && 'hidden'}`}>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        {/* Top Header */}
        <header className="h-16 px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between">
            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-slate-600">
                <Menu size={24} />
              </button>
              <span className="font-bold text-lg text-slate-800 dark:text-white">Kırbaş Panel</span>
            </div>

            {/* Universal Search (Visual only for now) */}
            <div className="hidden md:flex items-center max-w-md w-full bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-1.5 border border-transparent focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
               <Search size={18} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Belge veya şablon ara..." 
                 className="bg-transparent border-none focus:outline-none text-sm w-full ml-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
               />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

               <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                   <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}</div>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                   <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-indigo-600">
                     {user.name.charAt(0).toUpperCase()}
                   </div>
                 </div>
               </div>
            </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-fade-in">
             {children}
          </div>
        </main>
      </div>

       {/* Mobile Menu Overlay */}
       {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-slate-900 p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
               <span className="font-bold text-xl text-slate-900 dark:text-white">Menü</span>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500">
                 <X size={24} />
               </button>
            </div>
            <div className="space-y-2">
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
             <div className="my-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button    
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
                  >
                  <LogOut size={20} />
                  Çıkış Yap
                </button>
             </div>
            </div>
          </nav>
        </div>
      )}

    </div>
  );
};
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-slate-200 bg-slate-50 p-4 space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    currentView === item.view
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
          <p>© 2026 Kırbaş Doküman. Tüm hakları saklıdır. | NDA Koruması Altında</p>
        </div>
      </footer>
    </div>
  );
};
