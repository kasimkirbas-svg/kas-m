import React from 'react';

interface LayoutProps {
  user: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900">Kırbaş</div>
          {user && (
            <div className="flex gap-4 items-center">
              <span className="text-sm text-slate-600">{user.name}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                Çıkış
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
