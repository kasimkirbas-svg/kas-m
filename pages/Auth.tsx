import React, { useState } from 'react';
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
    <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Left side / Form side */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10 bg-slate-950 border-r border-slate-800/50 shadow-2xl">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 cursor-pointer mb-12 group" onClick={onBack}>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <Crown size={24} />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {APP_NAME}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            {mode === 'login' && 'Premium Hesaba Giriş'}
            {mode === 'register' && 'Prestijli Bir Başlangıç'}
            {mode === 'forgot_password' && 'Şifrenizi Kurtarın'}
          </h2>
          
          <p className="mt-3 text-sm text-slate-400 mb-8">
            {mode === 'login' && (
              <>Hesabınız yok mu?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                  Ayrıcalıklı dünyaya katılın
                </button>
              </>
            )}
            {mode === 'register' && (
              <>Zaten premium üye misiniz?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                  Buradan giriş yapın
                </button>
              </>
            )}
            {mode === 'forgot_password' && (
              <>Şifrenizi hatırladınız mı?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                  Giriş sayfasına dön
                </button>
              </>
            )}
          </p>

          {message && (
            <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {message.type === 'success' ? <CheckCircle size={20} className="mt-0.5 flex-shrink-0" /> : <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" />}
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Ad Soyad</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-11 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all sm:text-sm" placeholder="Adınız Soyadınız" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Firma Adı (Opsiyonel)</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-500" />
                    </div>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="block w-full pl-11 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all sm:text-sm" placeholder="Firma / Marka Adı" />
                  </div>
                </div>
              </div>
            )}

            <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">E-posta Adresi</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-11 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all sm:text-sm" placeholder="ornek@sirket.com" />
              </div>
            </div>

            {mode !== 'forgot_password' && (
              <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">Şifre</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot_password')} className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                      Şifrenizi mi unuttunuz?
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-11 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-3.5 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all sm:text-sm" placeholder="••••••••" />
                </div>
              </div>
            )}

            <div className="pt-4 animate-in fade-in duration-300 slide-in-from-bottom-2">
              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5">
                {mode === 'login' && 'Güvenli Giriş Yap'}
                {mode === 'register' && 'Ayrıcalıklara Katıl'}
                {mode === 'forgot_password' && 'Bağlantı Gönder'}
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side / Premium Deep Visual */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-black overflow-hidden items-center justify-center">
        {/* Deep immersive background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-0" />
          
          {/* Gold glowing orbs */}
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-amber-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse transition-all duration-[3000ms]"></div>
          <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-yellow-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] animate-pulse transition-all duration-[3000ms] delay-1000"></div>
        </div>
        
        {/* Giant Watermark Text (Site Name in Background) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
          <h1 className="text-[20vw] font-black text-amber-500 whitespace-nowrap transform -rotate-12 tracking-tighter">
            {APP_NAME}
          </h1>
        </div>

        {/* Floating Glass Content */}
        <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
          <div className="mb-10 flex justify-center animate-in zoom-in duration-500">
            <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10">
              <ShieldCheck size={64} className="text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Kurumsal Sınıf<br />Doküman Yönetimi
          </h2>
          
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            Sektördeki en prestijli belge otomasyon ağı. Acil durum planları, denetim raporları ve evraklarınızı yüksek güvenlikli altyapımızla yönetin.
          </p>
          
          <div className="mt-14 space-y-6 text-slate-300 text-left w-full max-w-sm mx-auto p-8 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
            <div className="flex items-center gap-4 text-lg">
              <CheckCircle size={24} className="text-amber-500 drop-shadow-lg"/>
              <span className="tracking-wide">Tamamen şifrelenmiş altyapı</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <CheckCircle size={24} className="text-amber-500 drop-shadow-lg"/>
              <span className="tracking-wide">İleri seviye PDF Dışa Aktarımı</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <CheckCircle size={24} className="text-amber-500 drop-shadow-lg"/>
              <span className="tracking-wide">Yüzlerce profesyonel şablon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};