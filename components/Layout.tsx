import React, { useState } from 'react';
import type { User } from '../types';
import { Bell, Menu, Crown, Instagram, Twitter, Linkedin, HeadphonesIcon, LogOut, ChevronDown, CheckCircle2, User as UserIcon, Moon, Sun } from 'lucide-react';
import { APP_NAME } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  if (!user) {
    return <div className="min-h-screen bg-transparent">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#FFD700]/30 selection:text-white relative">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between h-20 px-8 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 relative z-50">
        
        {/* Empty left space for symmetry */}
        <div className="flex-1"></div>

        {/* Logo / Brand Center Sci-Fi Theme */}
        <div 
          className="flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden bg-[#111111] shadow-[0_0_15px_rgba(255,215,0,0.2)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-shadow border border-[#FFD700]/10">
               <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="w-[120%] h-auto object-contain" />
             </div>
             <span className="font-black text-white text-xl tracking-[0.3em] uppercase drop-shadow-md">İSG ZEYRON</span>
          </div>
        </div>

        {/* User / Actions Right */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <button 
            className="text-slate-400 hover:text-[#FFD700] transition-colors relative"
            title="Bildirimler"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A]"></span>
          </button>
          
          <div className="relative">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex flex-col items-end">
                <span className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-[#FFD700] font-bold tracking-widest uppercase">{user.role === 'GUEST' ? 'KULLANICI' : 'PREMIUM'}</span>
              </div>
              <div className="w-10 h-10 bg-[#111111] rounded-full flex items-center justify-center text-white font-bold border border-white/10 group-hover:border-[#FFD700]/50 transition-colors">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-56 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] flex flex-col"
                >
                  <button onClick={() => { onNavigate('profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5">
                    <UserIcon size={16} /> Profilim
                  </button>
                  <button onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-[#FFD700] transition-colors flex items-center gap-2 border-b border-white/5">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Tema Değiştir
                  </button>
                  <button onClick={() => { onNavigate('settings'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5">
                    <Menu size={16} /> Ayarlar
                  </button>
                  <button onClick={() => { onNavigate('billing'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors flex items-center gap-2 border-b border-white/5 font-bold">
                    <Crown size={16} /> Üyeliği Yükselt
                  </button>
                  <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-2">
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full flex-1">
          {children}
        </div>

        {/* Footer inline, not fixed */}
        <footer className="w-full bg-[#0A0A0A] border-t border-white/5 py-8 mt-10">
          <div className="max-w-[1400px] mx-auto px-8 flex justify-center items-center flex-col gap-4">
            <div className="flex gap-4 mb-2">
               <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center cursor-pointer hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors">
                 <Instagram size={16} />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center cursor-pointer hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors">
                 <Twitter size={16} />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center cursor-pointer hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors">
                 <Linkedin size={16} />
               </a>
            </div>
            <div className="text-xs uppercase tracking-widest font-semibold text-center text-slate-500">
              © 2026 İSG ZEYRON PLATFORMU. TÜM HAKLARI SAKLIDIR.
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Buttons: Help */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <button 
          onClick={() => {
            const w = window.open('', '_blank', 'width=400,height=500');
            if (w) w.document.write('<html><body style="font-family:sans-serif;padding:20px;text-align:center;background:#0A0A0A;color:white;"><h2>Canlı Destek</h2><p style="color:#FFD700">Müşteri hizmetleri yetkilimiz birazdan size katılacak...</p></body></html>');
          }}
          className="bg-[#111111] hover:bg-[#1a1a1a] text-[#FFD700] px-5 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-1 transition-all border border-[#FFD700]/30 flex items-center gap-2 text-sm cursor-pointer shadow-lg">
          <HeadphonesIcon size={20} />
          7/24 Canlı Destek
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111111] animate-pulse"></span>
        </button>
      </div>

    </div>
  );
};