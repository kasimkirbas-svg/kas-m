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
        setMessage({ type: 'success', text: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.' });
      }, 1000);
      return;
    }

    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Lütfen e-posta ve şifrenizi giriniz.' });
      return;
    }

    // Mock Login / Register
    setTimeout(() => {
      onAuthSuccess({
        id: '1',
        name: formData.name || 'Test Kullanıcı',
        email: formData.email,
        companyName: formData.companyName || 'İSG Zeyron Kullanıcısı',
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.PRO,
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        documentsGenerated: 145,
        status: 'active'
      });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] flex flex-col justify-center items-center font-sans overflow-hidden selection:bg-orange-500/30 selection:text-white px-4">
      
      {/* Immersive Dark Background with Watermark and Central Glow */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
        {/* Soft glowing orb directly behind the card */}
        <div className="absolute w-[600px] h-[600px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[1000px] h-[1000px] bg-amber-600/5 rounded-full mix-blend-screen filter blur-[150px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Giant Watermark Text Centered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none">
          <h1 className="text-[15vw] font-black text-white whitespace-nowrap tracking-[0.1em] text-center">
            ZEYRON
          </h1>
        </div>

        {/* Diagonal Futuristic Lines */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo and Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center justify-center mb-6 relative group">
             <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <img src="/site logo.jpeg" alt="İSG Zeyron Logo" className="h-20 w-auto object-contain rounded-xl relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Sisteme Giriş Yapın</h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Verimlilik, Güvenlik ve Hızın Buluştuğu Nokta</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0D1017]/80 backdrop-blur-2xl border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
              {mode === 'login' ? 'GİRİŞ YAP' : mode === 'register' ? 'HESAP OLUŞTUR' : 'ŞİFRE KURTARMA'}
            </h2>
            
            {/* Context Pill */}
            <div className="px-4 py-1.5 rounded-full border border-orange-500/30 text-orange-400 text-[10px] font-bold tracking-widest uppercase bg-orange-500/10 flex items-center gap-2 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span> Güvenli
            </div>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="font-medium text-sm leading-relaxed">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                  </div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1A1D27] transition-all text-sm" placeholder="Ad Soyad" />
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1A1D27] transition-all text-sm" placeholder="E-Posta Adresi" />
            </div>

            {mode !== 'forgot_password' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 outline-none focus:border-orange-500/50 focus:bg-[#1A1D27] transition-all text-sm tracking-widest" placeholder="Şifre" />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input type="checkbox" id="remember_me" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 bg-[#13161F] border-white/10 rounded accent-orange-500 cursor-pointer" />
                  <label htmlFor="remember_me" className="ml-2 block text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                    Beni Hatırla
                  </label>
                </div>
                <button type="button" onClick={() => setMode('forgot_password')} className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Şifremi Unuttum
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold tracking-wide text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-[#0D1017] transition-all duration-300 mt-6"
            >
              {mode === 'login' ? 'GİRİŞ YAP' : mode === 'register' ? 'KAYIT OL' : 'SIFIRLAMA BAĞLANTISI GÖNDER'}
              <ArrowRight size={18} className="ml-2" />
            </button>
            
            <div className="text-center pt-8 border-t border-white/5">
              {mode === 'login' && (
                <span className="text-xs text-slate-500 font-medium">Henüz bir hesabınız yok mu? <button type="button" onClick={() => setMode('register')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Hesap Oluşturun</button></span>
              )}
              {mode === 'register' && (
                <span className="text-xs text-slate-500 font-medium">Zaten bir hesabınız var mı? <button type="button" onClick={() => setMode('login')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Giriş Yapın</button></span>
              )}
              {mode === 'forgot_password' && (
                <span className="text-xs text-slate-500 font-medium">Giriş yapmaya hazır mısınız? <button type="button" onClick={() => setMode('login')} className="font-bold text-slate-300 hover:text-white transition-colors ml-1">Giriş Yapın</button></span>
              )}
            </div>
          </form>
        </div>
        
      </div>

      {/* Footer Social Text */}
      <div className="relative z-10 text-center flex flex-col items-center mt-12">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4 font-bold">Bizi Yakından Tanıyın</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors transform hover:scale-110">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors transform hover:scale-110">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors transform hover:scale-110">
            <Twitter size={20} />
          </a>
          <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors transform hover:scale-110">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
