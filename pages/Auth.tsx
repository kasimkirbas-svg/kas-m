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
    <div className="min-h-screen bg-[#0E1117] font-sans selection:bg-yellow-500/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0E1117]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
           <div className="flex flex-col items-center justify-center transform hover:scale-105 transition-transform cursor-pointer">
             <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] mix-blend-screen" />
           </div>
           
           <div className="hidden md:flex items-center gap-10">
             <button onClick={() => scrollToSection('vision')} className="text-[13px] text-slate-300 hover:text-yellow-400 font-bold uppercase tracking-[0.2em] transition-colors">Vizyonumuz</button>
             <button onClick={() => scrollToSection('faq')} className="text-[13px] text-slate-300 hover:text-yellow-400 font-bold uppercase tracking-[0.2em] transition-colors">S.S.S</button>
           </div>
           
           <div className="flex items-center gap-6">
             <button onClick={() => { setMode('register'); scrollToSection('auth_section'); }} className="text-xs text-slate-300 hover:text-white font-bold tracking-widest uppercase transition-colors hidden sm:block">Kayıt Ol</button>
             <button onClick={() => { setMode('login'); scrollToSection('auth_section'); }} className="px-8 py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-[13px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105">
               Sisteme Gir
             </button>
           </div>
        </div>
      </nav>

      {/* Hero / Landing Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Glows */}
        <div className="absolute w-[1000px] h-[1000px] bg-yellow-600/15 rounded-full mix-blend-screen filter blur-[120px] opacity-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        {/* Big Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none">
          <h1 className="text-[18vw] font-black text-white whitespace-nowrap tracking-[0.05em] text-center">
            ZEYRON
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 py-20">
           {/* Marketing Text Left */}
           <div className="flex-1 flex flex-col justify-center items-start text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-400 text-xs font-black tracking-[0.2em] uppercase mb-8">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,1)]"></span> 2026 EKRAN GÜNCELLEMESİ AKTİF
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
                Türkiye'nin <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-500 drop-shadow-sm">En Gelişmiş İSG</span> <br/>Yönetim Platformu.
              </h1>
              
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-medium">
                {LANDING_CONTENT.hero.subtitle} Güvenlik, Hız ve %100 Yasal Uyumluluk ile işlemlerinizi dijitalleştiriyoruz.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                 <button onClick={() => scrollToSection('auth_section')} className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_40px_rgba(250,204,21,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                   HEMEN BAŞLA <ArrowRight size={22} className="animate-bounce-x"/>
                 </button>
                 <button onClick={() => scrollToSection('vision')} className="w-full sm:w-auto px-10 py-5 bg-[#171A23] hover:bg-[#1E2330] text-white border border-white/10 hover:border-yellow-500/50 font-bold uppercase tracking-[0.2em] rounded-2xl transition-all">
                   SİSTEMİ İNCELE
                 </button>
              </div>
           </div>

           {/* Hero App Preview / Auth Block Right */}
           <div id="auth_section" className="w-full lg:w-[500px] shrink-0 transform hover:scale-[1.02] transition-transform duration-500">
              <div className="bg-gradient-to-b from-[#151923] to-[#0D1017] border border-white/10 p-10 sm:p-12 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"></div>
                
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-white tracking-widest uppercase">
                    {mode === 'login' ? 'GİRİŞ YAP' : mode === 'register' ? 'YENİ KAYIT' : 'ŞİFRE SIFIRLA'}
                  </h2>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">
                    <Lock size={12} /> SSL Secure
                  </div>
                </div>
                
                {message && (
                    <div className={`p-5 rounded-2xl mb-8 flex items-start gap-4 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'register' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-14 bg-[#0A0C10] border border-white/10 text-white placeholder-slate-600 rounded-2xl py-4.5 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm transition-all shadow-inner" placeholder="Ad Soyad" />
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" /></div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-14 bg-[#0A0C10] border border-white/10 text-white placeholder-slate-600 rounded-2xl py-4.5 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm transition-all shadow-inner" placeholder="Kurumsal E-Posta Adresi" />
                  </div>

                  {mode !== 'forgot_password' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" /></div>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-14 bg-[#0A0C10] border border-white/10 text-white placeholder-slate-600 rounded-2xl py-4.5 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm transition-all shadow-inner tracking-widest" placeholder="••••••••" />
                    </div>
                  )}

                  <button type="submit" className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-black text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] mt-4">
                    {mode === 'login' ? 'PLATFORMA GİRİŞ' : mode === 'register' ? 'ÜYELİK OLUŞTUR' : 'BAĞLANTI GÖNDER'}
                  </button>

                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-6 border-t border-white/10">
                    <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-white uppercase tracking-wider transition-colors">
                      {mode === 'login' ? 'YENİ HESAP AÇ' : 'GİRİŞ EKRANI'}
                    </button>
                    {mode === 'login' && (
                      <button type="button" onClick={() => setMode('forgot_password')} className="hover:text-yellow-400 uppercase tracking-wider transition-colors">ŞİFREMİ UNUTTUM</button>
                    )}
                  </div>
                </form>
              </div>
           </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-slate-500 opacity-50">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Aşağı Kaydır</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Vision & Info Section */}
      <section id="vision" className="py-32 bg-[#0A0C10] relative">
         <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24 relative">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-widest uppercase inline-block border-b-2 border-yellow-500 pb-4">{LANDING_CONTENT.vision.title}</h2>
              <p className="text-slate-400 max-w-4xl mx-auto text-xl leading-relaxed">{LANDING_CONTENT.vision.description}</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: 'Dinamik Şablonlar', desc: 'Binlerce varyans ve etiket alt yapısıyla tek kaynaktan yüzlerce belgeyi saniyeler içinde eksiksiz edinin.', icon: <CheckCircle size={40} className="text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"/> },
                { title: 'Sıfır İnsan Hatası', desc: 'Otomatik doldurulan senkronize alanlar sayesinde kopyala-yapıştır hatalarına ve eski veri unutulmalarına son verin.', icon: <CheckCircle size={40} className="text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"/> },
                { title: 'Ultra Güvenli Sunucular', desc: 'Bulut altyapısında dosyalarınız modern kriptografi mimarisi ile korunur, yetkisiz 3. parti erişime kapalıdır.', icon: <CheckCircle size={40} className="text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"/> }
              ].map((item, i) => (
                <div key={i} className="bg-[#12151C] border border-white/5 p-10 rounded-[2.5rem] hover:border-yellow-500/50 hover:bg-[#161a23] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                   {item.icon}
                   <h3 className="text-2xl font-black text-white mb-4 tracking-wide">{item.title}</h3>
                   <p className="text-slate-400 text-[15px] leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-[#0E1117] border-y border-white/5 relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full filter blur-[150px] pointer-events-none"></div>
         
         <div className="max-w-4xl mx-auto px-6 relative z-10">
           <h2 className="text-4xl font-black text-center text-white mb-20 uppercase tracking-[0.1em]">
             Sıkça Sorulan <span className="text-yellow-500">Sorular</span>
           </h2>
           <div className="space-y-6">
             {LANDING_CONTENT.faq.map((q, i) => (
               <div key={i} className="bg-[#151923] border border-white/5 hover:border-yellow-500/30 rounded-[2rem] p-8 md:p-10 transition-all duration-300 shadow-lg">
                 <h3 className="text-xl font-black text-white mb-4 flex items-start gap-4 leading-snug">
                   <span className="text-yellow-500 flex-shrink-0 text-3xl leading-none">S:</span> {q.q}
                 </h3>
                 <p className="text-slate-400 text-lg leading-relaxed pl-12 font-medium">
                   <span className="text-slate-600 font-black mr-2 text-xl">C:</span> {q.a}
                 </p>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#07090E] text-center">
         <div className="flex justify-center items-center gap-6 mb-10">
           <img src="/logo.jpeg" alt="İSG Zeyron Footer Logo" className="h-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
         </div>
         <div className="flex justify-center gap-8 mb-10">
           <a href="#" className="text-slate-600 hover:text-yellow-500 transition-colors transform hover:scale-110"><Instagram size={28} /></a>
           <a href="#" className="text-slate-600 hover:text-yellow-500 transition-colors transform hover:scale-110"><Linkedin size={28} /></a>
           <a href="#" className="text-slate-600 hover:text-yellow-500 transition-colors transform hover:scale-110"><Twitter size={28} /></a>
         </div>
         <p className="text-slate-600 text-[11px] tracking-[0.3em] uppercase font-black">© 2026 İSG ZEYRON. TÜM HAKLARI SAKLIDIR.</p>
      </footer>
    </div>
  );
};
