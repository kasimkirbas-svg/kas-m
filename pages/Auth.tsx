import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Building, ArrowRight, ShieldCheck, CheckCircle, Crown } from 'lucide-react';
import { APP_NAME } from '../constants';
import { UserRole, SubscriptionPlan } from '../types';

type AuthMode = 'login' | 'register' | 'forgot_password';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Background slow float effect states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setMessage({ type: 'success', text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
      }, 500);
      return;
    }

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: 'Lütfen e-posta ve şifrenizi giriniz.' });
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
        setMessage({ type: 'error', text: 'Lütfen tüm zorunlu alanları doldurunuz.' });
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
    <div className="relative min-h-screen bg-[#07090E] flex flex-col justify-center items-center font-sans overflow-hidden selection:bg-amber-500/30 selection:text-white px-4">
      
      {/* Immersive Dark Premium Background with Subtle Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f16] via-[#07090E] to-black z-0" />
        
        {/* Soft Glowing Orbs moving slightly with cursor for 3D feel */}
        <div 
          className="absolute w-[800px] h-[800px] bg-amber-600/10 rounded-full mix-blend-screen filter blur-[150px] transition-transform duration-1000 ease-out"
          style={{ 
            top: '-20%', right: '-10%',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)` 
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-yellow-700/5 rounded-full mix-blend-screen filter blur-[120px] transition-transform duration-1000 ease-out"
          style={{ 
            bottom: '-20%', left: '-10%',
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` 
          }}
        />

        {/* Giant Watermark Text Centered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none">
          <h1 className="text-[15vw] font-black text-amber-500 whitespace-nowrap tracking-tighter mix-blend-plus-lighter">
            {APP_NAME.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Centered Auth Card Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Top Logo / Welcome Area */}
        <div className="flex flex-col items-center mb-8 cursor-pointer group" onClick={onBack}>
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-slate-950 font-bold shadow-xl shadow-amber-500/20 mb-6 group-hover:scale-105 transition-transform duration-300">
            <Crown size={32} strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm text-center">
            {mode === 'login' && 'Kurumsal Portal'}
            {mode === 'register' && 'Ayrıcalığa Katılın'}
            {mode === 'forgot_password' && 'Hesabınızı Kurtarın'}
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-medium text-center">
            {mode === 'login' && 'Sisteme giriş yaparak işlemlerinize devam edin'}
            {mode === 'register' && 'Hemen ücretsiz premium şablonlara erişin'}
            {mode === 'forgot_password' && 'Şifrenizi güvenli sıfırlama bağlantısıyla yenileyin'}
          </p>
        </div>

        {/* Glassmorphism Form Card */}
        <div className="bg-[#0f131a]/80 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          
          {message && (
            <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {message.type === 'success' ? <CheckCircle size={20} className="mt-0.5 flex-shrink-0" /> : <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" />}
              <p className="font-medium text-sm leading-relaxed">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            {mode === 'register' && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Ad Soyad</label>
                  <div className="relative rounded-2xl shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-12 bg-black/40 border border-slate-800 text-white placeholder-slate-600 rounded-2xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-black/60 transition-all font-medium" placeholder="Adınız Soyadınız" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Firma Adı <span className="opacity-50 lowercase tracking-normal font-medium">(Opsiyonel)</span></label>
                  <div className="relative rounded-2xl shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                    </div>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="block w-full pl-12 bg-black/40 border border-slate-800 text-white placeholder-slate-600 rounded-2xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-black/60 transition-all font-medium" placeholder="Kurumunuz" />
                  </div>
                </div>
              </div>
            )}

            <div className="animate-in fade-in zoom-in-95 duration-300">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">E-posta Adresi</label>
              <div className="relative rounded-2xl shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-12 bg-black/40 border border-slate-800 text-white placeholder-slate-600 rounded-2xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-black/60 transition-all font-medium" placeholder="kurumsal@sirket.com" />
              </div>
            </div>

            {mode !== 'forgot_password' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Şifre</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot_password')} className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                      Şifremi Unuttum
                    </button>
                  )}
                </div>
                <div className="relative rounded-2xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-12 bg-black/40 border border-slate-800 text-white placeholder-slate-600 rounded-2xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-black/60 transition-all font-medium tracking-widest" placeholder="••••••••" />
                </div>
              </div>
            )}

            <div className="pt-3 flex flex-col gap-5">
              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:to-amber-500 text-slate-950 font-extrabold py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 mt-2">
                {mode === 'login' && 'Sisteme Giriş Yap'}
                {mode === 'register' && 'Hesap Oluştur'}
                {mode === 'forgot_password' && 'Bağlantı Gönder'}
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
              
              <div className="text-center pt-2 text-sm text-slate-400">
                {mode === 'login' && (
                  <span>Hesabınız yok mu? <button type="button" onClick={() => setMode('register')} className="font-bold text-amber-500 hover:text-amber-400 transition-colors ml-1">Kayıt Ol</button></span>
                )}
                {mode === 'register' && (
                  <span>Zaten üye misiniz? <button type="button" onClick={() => setMode('login')} className="font-bold text-amber-500 hover:text-amber-400 transition-colors ml-1">Giriş Yap</button></span>
                )}
                {mode === 'forgot_password' && (
                  <span>Giriş yapmaya hazır mısınız? <button type="button" onClick={() => setMode('login')} className="font-bold text-amber-500 hover:text-amber-400 transition-colors ml-1">Dön Geri</button></span>
                )}
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer info text */}
        <div className="mt-10 text-center flex flex-col items-center gap-2 opacity-50">
           <ShieldCheck size={20} className="text-slate-500" />
           <p className="text-xs text-slate-500 font-semibold tracking-wide">UÇTAN UCA GÜVENLİ KURUMSAL ALTYAPI</p>
        </div>
      </div>
    </div>
  );
};