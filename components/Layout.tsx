import React from 'react';
import { FileText, Settings, User, LogOut, Menu, X, LayoutDashboard, Lock, FolderOpen, PlusSquare } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Don't show layout on auth page
  if (!user) {
    return <>{children}</>;
  }

  const menuItems = user 
    ? user.role === 'ADMIN'
      ? [
          { label: t?.nav?.dashboard || 'Ana Sayfa', view: 'dashboard', icon: LayoutDashboard },
          { label: 'Aboneler', view: 'users', icon: User },
          { label: 'Şablonlar', view: 'templates', icon: FileText },
          { label: t?.nav?.settings || 'Ayarlar', view: 'settings', icon: Settings },
        ]
      : [
          { label: t?.nav?.dashboard || 'Ana Sayfa', view: 'dashboard', icon: LayoutDashboard },
          { label: t?.nav?.myDocuments || 'Dokümanlarım', view: 'my-documents', icon: FolderOpen },
          { label: t?.nav?.newDocument || 'Yeni Oluştur', view: 'templates', icon: PlusSquare },
          { label: t?.nav?.account || 'Hesabım', view: 'profile', icon: User },
          { label: t?.nav?.settings || 'Ayarlar', view: 'settings', icon: Settings },
        ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">Kırbaş Doküman</span>
          </div>

          {/* Desktop Menu */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
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
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2 transition"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">{t?.common?.logout || 'Çıkış'}</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
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
