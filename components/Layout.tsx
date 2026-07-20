import React, { useEffect, useRef, useState } from 'react';
import type { User } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, FileClock, HeadphonesIcon, LogOut, Menu, Settings, User as UserIcon, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { view: 'dashboard', label: 'Ana Panel', icon: Menu },
  { view: 'history', label: 'Doküman Geçmişi', icon: FileClock },
  { view: 'billing', label: 'Üyelik Merkezi', icon: Crown },
  { view: 'profile', label: 'Profil ve Üyelik', icon: UserIcon },
  { view: 'settings', label: 'Ayarlar', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return <div className="min-h-screen bg-transparent">{children}</div>;

  const navigate = (view: string) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <div className="light-app-shell min-h-screen overflow-x-hidden bg-[#16222a] text-[#f7f7f5] font-sans selection:bg-[#e5b82c]/30 relative">
      <header className="absolute inset-x-0 top-0 z-50 h-[72px] px-4 sm:px-8 flex items-center justify-between pointer-events-none">
        <button onClick={() => navigate('dashboard')} className="pointer-events-auto flex items-center gap-3 group" aria-label="Ana sayfa">
          <span className="w-10 h-10 rounded-full overflow-hidden border border-yellow-500/30 shadow-sm"><img src="/logo.jpeg" alt="İSG Zeyron" className="w-full h-full object-cover" /></span>
          <span className="hidden sm:block text-sm font-bold tracking-[0.12em]">İSG ZEYRON</span>
        </button>

        <div ref={menuRef} className="pointer-events-auto relative flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-xs font-bold text-white">{user.name.split(' ')[0]}</span>
            <span className="text-[9px] font-black tracking-widest text-amber-300">{user.accountType === 'osgb' ? 'OSGB' : 'BİREYSEL'}</span>
          </div>
          <button onClick={() => setMenuOpen(open => !open)} className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#18252d]/95 border border-white/10 text-amber-300 backdrop-blur-xl shadow-sm hover:border-amber-400/60 hover:bg-[#22343e] transition-colors" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} className="absolute right-0 top-14 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-[#111b22]/98 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="p-4 border-b border-white/10">
                <p className="font-bold text-white truncate">{user.name}</p><p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <nav className="p-2" aria-label="Kullanıcı menüsü">
                {menuItems.map(item => <button key={item.view} onClick={() => navigate(item.view)} className={`w-full min-h-11 px-3 rounded-lg flex items-center gap-3 text-sm font-semibold transition-colors ${currentView === item.view ? 'bg-amber-400/15 text-amber-300' : 'text-slate-300 hover:bg-white/5'}`}><item.icon size={18} />{item.label}</button>)}
              </nav>
              <button onClick={onLogout} className="w-full min-h-12 px-5 border-t border-white/10 flex items-center gap-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"><LogOut size={18} />Çıkış Yap</button>
            </motion.div>}
          </AnimatePresence>
        </div>
      </header>

      <main className="relative z-10 min-h-screen pt-[72px]">{children}</main>

      <button onClick={() => alert('Canlı destek talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.')} className="fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-auto sm:px-5 rounded-full bg-[#111b22]/95 border border-amber-400/40 text-amber-300 shadow-xl backdrop-blur-xl flex items-center justify-center gap-2 text-sm font-bold"><HeadphonesIcon size={19} /><span className="hidden sm:inline">7/24 Canlı Destek</span></button>
    </div>
  );
};
