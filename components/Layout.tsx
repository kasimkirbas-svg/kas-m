import React from 'react';
import { User } from '../types';
import { Bell, Menu, Crown } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate }) => {
  if (!user) {
    return <div className="min-h-screen bg-[#07090E]">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0C10] font-sans selection:bg-orange-500/30 selection:text-white pb-20">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between h-20 px-8 bg-[#0A0C10] border-b border-white/5 relative z-50">
        
        {/* Logo / Brand Left */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-widest">{APP_NAME.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest leading-none">PANEL YÖNETİMİ</span>
          </div>
        </div>

        {/* Center decorative - from the image there is a small '&' icon / decoration in center top? */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 font-bold opacity-80 select-none">
          &amp;
        </div>

        {/* User / Actions Right */}
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-orange-400 transition-colors">
            <Bell size={20} />
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('profile')}
          >
            <div className="flex flex-col items-end">
              <span className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{user.role === 'GUEST' ? 'KULLANICI' : 'PREMIUM'}</span>
            </div>
            <div className="w-10 h-10 bg-[#1A1D27] rounded-full flex items-center justify-center text-slate-300 font-bold border border-white/5 group-hover:border-orange-500/50 transition-colors">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <button className="flex items-center gap-2 bg-orange-600/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-500 hover:text-[#0A0C10] px-4 py-2 rounded-xl transition-all font-bold tracking-wide text-sm h-10">
            Menü
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#0A0C10] overflow-hidden relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        
        {/* Content container */}
        <div className="relative z-10 w-full h-full overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Floating 7/24 Destek Button */}
      <button className="fixed bottom-6 right-8 bg-orange-500 hover:bg-orange-400 text-[#0A0C10] px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all flex items-center gap-2 z-50 text-sm">
        <Crown size={18} />
        7/24 Canlı Destek
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0A0C10]"></span>
      </button>
      
      {/* Footer Text */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] text-slate-600 uppercase tracking-widest font-semibold z-40">
        © 2026 Kırbaş Platform. Tüm Hakları Saklıdır.
      </div>
    </div>
  );
};