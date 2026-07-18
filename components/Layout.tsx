import React from 'react';
import { User } from '../types';
import { Bell, Menu, Crown, Instagram, Twitter, Linkedin, HeadphonesIcon } from 'lucide-react';
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
          className="flex items-center gap-3 cursor-pointer group bg-transparent"
          onClick={() => onNavigate('dashboard')}
        >
          <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="h-14 w-auto object-contain mix-blend-screen mix-blend-lighten filter brightness-110 group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" />
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-widest">{APP_NAME}</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest leading-none">PANEL YÖNETİMİ</span>
          </div>
        </div>

        {/* Center decorative - from the image there is a small '&' icon / decoration in center top? */}
        {/* User requested to remove this independent & sign floating around top. So removing it from header. */}

          {/* User / Actions Right */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
                className="text-slate-400 hover:text-yellow-400 transition-colors pointer-events-auto"
              title="Bildirimler"
              aria-label="Bildirimler"
            >
              <Bell size={20} />
            </button>
            
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate('profile')}
              title="Profile / Ayarlara Git"
              aria-label="Profil ve Ayarlar"
            >
              <div className="flex flex-col items-end">
                <span className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{user.role === 'GUEST' ? 'KULLANICI' : 'PREMIUM'}</span>
              </div>
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-slate-300 font-bold border border-white/5 group-hover:border-yellow-500/50 transition-colors">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={onLogout}
              className="text-slate-500 hover:text-red-500 transition-colors pointer-events-auto ml-2 border border-white/5 bg-white/5 rounded-lg p-2"
              title="Çıkış Yap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
      <main className="flex-1 w-full bg-zinc-950 overflow-hidden relative flex flex-col">
        {/* Subtle nice background, removed mazgal grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Content container */}
        <div className="relative z-10 w-full flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-20">
          {children}
        </div>
      </main>

      {/* Floating 7/24 Destek Button */}
      <button 
        onClick={() => {
          const w = window.open('', '_blank', 'width=400,height=500');
          if (w) w.document.write('<html><body style="font-family:sans-serif;padding:20px;text-align:center;"><h2>Canlı Destek</h2><p>Müşteri hizmetleri yetkilimiz birazdan size katılacak...</p></body></html>');
        }}
        className="fixed bottom-20 right-8 bg-orange-500 hover:bg-orange-400 text-white px-5 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform flex items-center gap-2 z-50 text-sm cursor-pointer border border-transparent">
        <HeadphonesIcon size={20} />
        7/24 Canlı Destek
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0A0C10] animate-pulse"></span>
      </button>
      
      {/* Footer Text Fixed to Layout */}
      <footer className="w-full bg-[#07090E] border-t border-white/5 py-3 z-40 fixed bottom-0 left-0 text-slate-500">
        <div className="max-w-[1400px] mx-auto px-8 flex justify-center items-center flex-col gap-2">
          
          <div className="flex gap-4 mb-1">
             <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:text-white transition-colors">
               <Instagram size={14} />
             </a>
             <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:text-white transition-colors">
               <Twitter size={14} />
             </a>
             <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:text-white transition-colors">
               <Linkedin size={14} />
             </a>
          </div>

          <div className="text-[10px] uppercase tracking-widest font-semibold text-center">
            © 2026 KIRBAŞ PLATFORM. TÜM HAKLARI SAKLIDIR.
          </div>

        </div>
      </footer>
    </div>
  );
};