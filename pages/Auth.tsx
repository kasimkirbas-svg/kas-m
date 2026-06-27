import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, CheckCircle, ShieldCheck, ArrowRight, Instagram, Facebook, Twitter, Linkedin, MessageCircle, Hexagon } from 'lucide-react';
import { APP_NAME } from '../constants';
import { UserRole, SubscriptionPlan } from '../types';

type AuthMode = 'login' | 'register' | 'forgot_password';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '', rememberMe: false });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (mode === 'forgot_password') {
      if (!formData.email) {
        setMessage({ type: 'error', text: 'Lütfen e-posta adresinizi giriniz.' });
        return;
      }
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Şifre sıfırlama bağlantısı gönderildi.' });
      }, 500);
      return;
    }

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: 'E-posta ve şifrenizi giriniz.' });
        return;
      }
      onAuthSuccess({
        id: Date.now().toString(),
        name: formData.email.split('@')[0] || 'Kullanıcı',
        email: formData.email,
        role: UserRole.SUBSCRIBER,
        plan: SubscriptionPlan.YEARLY,
        remainingDownloads: 'UNLIMITED',
        companyName: formData.companyName || 'Bireysel'
      });
    } else {
      if (!formData.email || !formData.password || !formData.name) {
        setMessage({ type: 'error', text: 'Tüm zorunlu alanları doldurunuz.' });
        return;
      }
      onAuthSuccess({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: UserRole.GUEST,
        plan: SubscriptionPlan.FREE,
        remainingDownloads: 3,
        companyName: formData.companyName
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0B10] flex flex-col justify-center items-center font-sans overflow-hidden selection:bg-orange-500/30 selection:text-white px-4">
      
      {/* Immersive Dark Background with Watermark and Central Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Soft glowing orb directly behind the card */}
        <div className="w-[500px] h-[500px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute w-[800px] h-[800px] bg-amber-600/5 rounded-full mix-blend-screen filter blur-[150px] opacity-40"></div>
        
        {/* Giant Watermark Text Centered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
          <h1 className="text-[12vw] font-black text-white whitespace-nowrap tracking-widest text-center mt-[-10vh]">
            KIRBAŞ<br />
            <span className="text-[6vw] tracking-[0.5em] text-orange-500">PLATFORM</span>
          </h1>
        </div>
      </div>

      {/* The Auth Card Component */}
      <div className="relative z-10 w-full max-w-[420px] mb-8">
        
        <div className="bg-[#12141D] border border-white/5 p-10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] shadow-orange-900/10">
          
          <div className="flex flex-col items-center mb-10">
            {/* The Icon */}
            <div className="w-[72px] h-[72px] bg-gradient-to-b from-orange-400 to-orange-600 rounded-[20px] flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] cursor-pointer" onClick={onBack}>
              <Hexagon size={36} fill="white" stroke="white" strokeWidth={1} />
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase mb-3">
              {mode === 'login' ? 'PLATFORM GİRİŞİ' : mode === 'register' ? 'HESAP OLUŞTUR' : 'ŞİFRE KURTARMA'}
            </h2>
            
            {/* Pill */}
            <div className="px-4 py-1 rounded-full border border-orange-500/30 text-orange-400 text-[10px] font-bold tracking-widest uppercase bg-orange-500/5">
              Güvenli Bağlantı
            </div>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="font-medium text-sm leading-relaxed">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                  </div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-12 bg-[#1A1D27] border border-white/5 text-slate-200 placeholder-slate-500 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1f2230] transition-all text-sm" placeholder="Ad Soyad" />
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-12 bg-[#1A1D27] border border-white/5 text-slate-200 placeholder-slate-500 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1f2230] transition-all text-sm" placeholder="E-Posta Adresi" />
            </div>

            {mode !== 'forgot_password' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-12 bg-[#1A1D27] border border-white/5 text-slate-200 placeholder-slate-500 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1f2230] transition-all text-sm tracking-widest" placeholder="Şifre" />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between pt-1 pb-2">
                <div className="flex items-center">
                  <input id="remember-me" name="rememberMe" type="checkbox" onChange={handleChange} checked={formData.rememberMe} className="h-4 w-4 rounded border-slate-700 bg-[#1A1D27] text-orange-500 focus:ring-orange-500 focus:ring-offset-[#12141D]" />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                    Beni Hatırla
                  </label>
                </div>
                <button type="button" onClick={() => setMode('forgot_password')} className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Şifremi Unuttum?
                </button>
              </div>
            )}

            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-[#1E2536] hover:bg-[#252c40] border border-white/5 text-slate-200 font-bold py-4 px-4 rounded-xl shadow-lg transition-all duration-300 mt-2 hover:border-orange-500/30">
              {mode === 'login' && 'GİRİŞ YAP'}
              {mode === 'register' && 'KAYIT OL'}
              {mode === 'forgot_password' && 'BAĞLANTI GÖNDER'}
              <ArrowRight size={18} />
            </button>
            
            <div className="text-center pt-8">
              {mode === 'login' && (
                <span className="text-xs text-slate-500">Henüz bir hesabınız yok mu? <button type="button" onClick={() => setMode('register')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Hesap Oluşturun</button></span>
              )}
              {mode === 'register' && (
                <span className="text-xs text-slate-500">Zaten bir hesabınız var mı? <button type="button" onClick={() => setMode('login')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Giriş Yapın</button></span>
              )}
              {mode === 'forgot_password' && (
                <span className="text-xs text-slate-500">Giriş yapmaya hazır mısınız? <button type="button" onClick={() => setMode('login')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Giriş Yapın</button></span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer Social Text */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">Bizi Takip Edin</p>
        <div className="flex items-center gap-3">
          <a href="#" className="w-10 h-10 rounded-full bg-[#12141D] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all">
            <Instagram size={16} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-[#12141D] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all">
            <Facebook size={16} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-[#12141D] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all">
            <Twitter size={16} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-[#12141D] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all">
            <Linkedin size={16} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-[#12141D] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all">
            <MessageCircle size={16} />
          </a>
        </div>
      </div>

    </div>
  );
};