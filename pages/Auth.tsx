import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Instagram, Facebook, Twitter, Linkedin, ChevronDown, CheckCircle } from 'lucide-react';
import { APP_NAME } from '../constants';
import { UserRole, SubscriptionPlan } from '../types';
import { LANDING_CONTENT } from '../landing_data';

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

    setTimeout(() => {
      onAuthSuccess({
        id: '1',
        name: formData.name || 'Zeyron Admin',
        email: formData.email,
        companyName: formData.companyName || 'İSG Kurumu',
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.PRO,
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        documentsGenerated: 145,
        status: 'active'
      });
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090E] font-sans selection:bg-orange-500/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07090E]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="h-10 w-auto object-contain rounded drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
             <span className="text-white font-black tracking-widest text-lg hidden sm:block">İSG ZEYRON</span>
           </div>
           
           <div className="hidden md:flex items-center gap-8">
             <button onClick={() => scrollToSection('vision')} className="text-sm text-slate-300 hover:text-orange-400 font-medium uppercase tracking-wider transition-colors">Vizyonumuz</button>
             <button onClick={() => scrollToSection('faq')} className="text-sm text-slate-300 hover:text-orange-400 font-medium uppercase tracking-wider transition-colors">S.S.S</button>
           </div>
           
           <div className="flex items-center gap-4">
             <button onClick={() => { setMode('register'); scrollToSection('auth_section'); }} className="text-sm text-slate-300 hover:text-white font-bold transition-colors hidden sm:block">Kayıt Ol</button>
             <button onClick={() => { setMode('login'); scrollToSection('auth_section'); }} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
               Platforma Gir
             </button>
           </div>
        </div>
      </nav>

      {/* Hero / Landing Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Glows */}
        <div className="absolute w-[800px] h-[800px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        {/* Big Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <h1 className="text-[15vw] font-black text-white whitespace-nowrap tracking-[0.1em] text-center">
            ZEYRON
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
           {/* Marketing Text Left */}
           <div className="flex-1 flex flex-col justify-center items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span> 2026 GÜNCELLEMESİ YAYINDA
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">İş Sağlığı ve Güvenliği</span> <br/>Yönetimini Yeniden Keşfet.
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                {LANDING_CONTENT.hero.subtitle} Mevzuata %100 uyumlu, yüksek entegrasyonlu altyapı ile kurumunuzu dijitalleştirin.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                 <button onClick={() => scrollToSection('auth_section')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                   SİSTEME GİRİŞ YAP <ArrowRight size={20} />
                 </button>
                 <button onClick={() => scrollToSection('vision')} className="w-full sm:w-auto px-8 py-4 bg-[#13161F] hover:bg-[#1A1D27] text-white border border-white/10 hover:border-white/20 font-bold uppercase tracking-widest rounded-xl transition-all">
                   DETAYLI İNCELE
                 </button>
              </div>
           </div>

           {/* Hero App Preview / Auth Block Right */}
           <div id="auth_section" className="w-full lg:w-[480px] shrink-0">
              <div className="bg-[#0D1017]/90 backdrop-blur-2xl border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                
                <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-8">
                  {mode === 'login' ? 'PORTALA GİRİŞ' : mode === 'register' ? 'YENİ HESAP' : 'ŞİFRE KURTARMA'}
                </h2>
                
                {message && (
                    <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'register' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-slate-500" /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 focus:border-orange-500/50 outline-none text-sm" placeholder="Ad Soyad" />
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500" /></div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 focus:border-orange-500/50 outline-none text-sm" placeholder="E-Posta Adresi" />
                  </div>

                  {mode !== 'forgot_password' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-12 bg-[#13161F] border border-white/5 text-slate-200 placeholder-slate-600 rounded-xl py-4 focus:border-orange-500/50 outline-none text-sm" placeholder="Şifre" />
                    </div>
                  )}

                  <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-colors mt-2">
                    {mode === 'login' ? 'GİRİŞ YAP' : mode === 'register' ? 'KAYIT OL' : 'SIFIRLA'}
                  </button>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-4">
                    <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-white transition-colors">
                      {mode === 'login' ? 'Hesap Oluştur' : 'Giriş Yap'}
                    </button>
                    {mode === 'login' && (
                      <button type="button" onClick={() => setMode('forgot_password')} className="hover:text-orange-400 transition-colors">Şifremi Unuttum</button>
                    )}
                  </div>
                </form>
              </div>
           </div>
        </div>
      </section>

      {/* Vision & Info Section */}
      <section id="vision" className="py-24 bg-[#0A0C10] border-t border-white/5 relative">
         <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-6 tracking-tight uppercase">{LANDING_CONTENT.vision.title}</h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">{LANDING_CONTENT.vision.description}</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Dinamik Şablonlar', desc: 'Binlerce varyans ve etiket alt yapısıyla tek kaynaktan yüzlerce belge.', icon: <CheckCircle size={32} className="text-orange-500"/> },
                { title: 'Sıfır İnsan Hatası', desc: 'Otomatik doldurulan alanlar sayesinde kopyala-yapıştır hatalarına son.', icon: <CheckCircle size={32} className="text-orange-500"/> },
                { title: 'Ultra Güvenlik', desc: 'Dosyalarınız modern kriptografi ile korunur, yetkisiz erişime kapalıdır.', icon: <CheckCircle size={32} className="text-orange-500"/> }
              ].map((item, i) => (
                <div key={i} className="bg-[#13161F] border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-colors">
                   <div className="mb-6">{item.icon}</div>
                   <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#07090E] border-t border-white/5">
         <div className="max-w-4xl mx-auto px-6">
           <h2 className="text-3xl font-black text-center text-white mb-12 uppercase tracking-widest">Sıkça Sorulan Sorular</h2>
           <div className="space-y-4">
             {LANDING_CONTENT.faq.map((q, i) => (
               <div key={i} className="bg-[#13161F] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all">
                 <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                   <span className="text-orange-500 flex-shrink-0">S:</span> {q.q}
                 </h3>
                 <p className="text-slate-400 text-sm leading-relaxed pl-6">
                   <span className="text-slate-600 font-bold mr-1">C:</span> {q.a}
                 </p>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0A0C10] border-t border-white/5 text-center">
         <div className="flex justify-center gap-6 mb-8">
           <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors"><Instagram size={24} /></a>
           <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors"><Linkedin size={24} /></a>
         </div>
         <p className="text-slate-600 text-xs tracking-widest uppercase font-bold">© 2026 İSG Zeyron. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};
