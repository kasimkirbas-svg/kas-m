import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Building2, Eye, EyeOff, 
  ArrowRight, Check, AlertCircle, Loader2, Sparkles, Hexagon, Star, Crown, Zap, Shield
} from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  language?: 'tr' | 'en' | 'ar';
  t?: any;
}

// --- Ultra Premium Input (Glassmorphism + Neon Glow - Preserved & Enhanced) ---
const FloatingInput = ({ label, icon: Icon, type = "text", ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative group mt-6">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${isFocused ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] scale-110' : 'text-slate-500'}`}>
        <Icon size={20} strokeWidth={isFocused ? 2.5 : 2} />
      </div>
      <input
        {...props}
        type={type}
        className={`w-full bg-[#030610]/40 border backdrop-blur-xl rounded-2xl pl-12 pr-10 py-5 text-white placeholder-transparent outline-none transition-all duration-300 font-medium tracking-wide
          ${isFocused 
            ? 'border-amber-500/60 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15),inset_0_0_20px_rgba(245,158,11,0.05)] ring-1 ring-amber-500/30' 
            : 'border-slate-800/60 hover:border-slate-700 hover:bg-[#030610]/60'
          }
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        onChange={(e) => {
          if (props.onChange) props.onChange(e);
          setHasValue(e.target.value.length > 0);
        }}
      />
      <label className={`absolute left-11 transition-all duration-300 pointer-events-none font-bold z-20
        ${(isFocused || hasValue || props.value) 
          ? '-top-3 left-4 text-[10px] uppercase tracking-[0.2em] bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text drop-shadow-sm border border-amber-900/40 bg-[#02040a] px-2 rounded-full' 
          : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
        }
      `}>
        {label}
      </label>
      
      {/* Input Bottom Glow Bar - Active State Animation */}
      <div className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 ${isFocused ? 'opacity-100 w-[calc(100%-32px)]' : 'opacity-0 w-0 left-1/2'}`}></div>
    </div>
  );
};

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, language, t }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [animate, setAnimate] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setAnimate(true);
    
    // Mouse Move Effect Background
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 20 - 10,
            y: (e.clientY / window.innerHeight) * 20 - 10
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { showToast('error', 'Lütfen tüm alanları doldurun.'); return; }
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: formData.email, password: formData.password }) });
        const text = await res.text();
        let data; try { data = JSON.parse(text); } catch(e) { throw new Error('Sunucu hatası.'); }
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Giriş Onaylandı. Yönlendiriliyorsunuz...');
            setTimeout(() => onLoginSuccess(data.user), 1500);
        } else { throw new Error(data.message || 'Giriş Başarısız.'); }
    } catch (err: any) { showToast('error', err.message || 'Sunucu Hatası.'); } finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { showToast('error', 'Şifreler eşleşmiyor.'); return; }
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, companyName: formData.companyName }) });
        const data = await res.json();
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Hesap Oluşturuldu!');
            setTimeout(() => onLoginSuccess(data.user), 1500);
        } else { throw new Error(data.message || 'Kayıt Başarısız.'); }
    } catch (err: any) { showToast('error', err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center relative overflow-hidden font-sans selection:bg-amber-500/40 selection:text-white">
      
      {/* 1. CINEMATIC BACKGROUND (Dynamic) */}
      <div className="absolute inset-0 z-0 overflow-hidden transform scale-105" style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px) scale(1.05)` }}>
          {/* Deep Space Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black opacity-90"></div>
          
          {/* Animated Nebula Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-amber-600/10 rounded-full blur-[180px] animate-pulse-slow mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-900/20 rounded-full blur-[180px] animate-float mix-blend-screen"></div>
          
          {/* Subtle Grid - High Tech Feel */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full blur-[2px] animate-ping opacity-20"></div>
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full blur-[4px] animate-pulse opacity-20 delay-1000"></div>
          </div>
      </div>

      {/* 2. MAIN LAYOUT - Split Screen Grandeur */}
      <div className="relative z-10 w-full h-screen md:h-auto md:min-h-[750px] max-w-[1600px] flex flex-col md:flex-row overflow-hidden shadow-2xl md:rounded-[30px] border border-white/5 backdrop-blur-sm bg-black/40">
           
           {/* LEFT SIDE: The Experience (Marketing) */}
           <div className="hidden md:flex w-full md:w-1/2 relative flex-col justify-between p-12 lg:p-16 overflow-hidden group">
               {/* Background Image/Video Placeholder with Overlay */}
               <div className="absolute inset-0 bg-[#050508] z-0">
                    <div className="absolute inset-0 bg-grid-premium opacity-30 animate-scan"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
                    {/* Glowing Orb Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 to-purple-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
               </div>

               {/* Top Brand */}
               <div className={`relative z-10 flex items-center gap-4 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                   <div className="w-14 h-14 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                       <div className="absolute inset-0 bg-amber-500 blur-lg opacity-40 rounded-full"></div>
                       <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border border-amber-300/30">
                           <Hexagon size={28} className="text-white fill-white/20" strokeWidth={1.5} />
                       </div>
                   </div>
                   <div>
                       <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-['Cinzel']">KIRBAŞ</h2>
                       <p className="text-[10px] text-amber-500 font-mono tracking-[0.4em] uppercase">Enterprise Suite</p>
                   </div>
               </div>

               {/* Center Hero Message */}
               <div className={`relative z-10 space-y-8 max-w-lg transition-all duration-1000 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                   
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
                        <Crown size={14} className="text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">Endüstri Standartlarının Ötesinde</span>
                   </div>

                   <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[0.9]">
                       Geleceği <br />
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                           Yönetin.
                       </span>
                   </h1>
                   
                   <p className="text-lg text-slate-400 font-light leading-relaxed border-l-4 border-amber-500/50 pl-6">
                       Kırbaş Panel ile işletmenizin tüm süreçlerini tek bir merkezden, 
                       benzersiz bir hız ve güvenle kontrol altına alın.
                   </p>

                   {/* Features List */}
                   <div className="grid grid-cols-2 gap-4 pt-4">
                       {[
                           { icon: Zap, text: "Yıldırım Hızında İşlem" },
                           { icon: Shield, text: "Askeri Düzey Güvenlik" },
                           { icon: Star, text: "Premium Destek" },
                           { icon: Building2, text: "Sınırsız Ölçekleme" }
                       ].map((feat, i) => (
                           <div key={i} className="flex items-center gap-3 text-sm text-slate-400 group/item hover:text-white transition-colors">
                               <div className="p-2 rounded-lg bg-white/5 group-hover/item:bg-amber-500/20 group-hover/item:text-amber-400 transition-colors">
                                   <feat.icon size={16} />
                                </div>
                               {feat.text}
                           </div>
                       ))}
                   </div>
               </div>

               {/* Bottom Stats/Testimonial */}
               <div className={`relative z-10 flex items-center justify-between border-t border-white/10 pt-8 transition-all duration-1000 delay-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                   <div>
                       <div className="text-3xl font-bold text-white">500+</div>
                       <div className="text-xs text-slate-500 uppercase tracking-wider">Kurumsal Müşteri</div>
                   </div>
                   <div>
                       <div className="text-3xl font-bold text-white">99.9%</div>
                       <div className="text-xs text-slate-500 uppercase tracking-wider">Uptime Garantisi</div>
                   </div>
                   <div className="h-10 w-[1px] bg-white/10"></div>
                   <div className="text-right">
                       <div className="flex text-amber-500 mb-1 justify-end">
                           {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                       </div>
                       <div className="text-[10px] text-slate-400">"Sektörün en iyisi."</div>
                   </div>
               </div>
           </div>

           {/* RIGHT SIDE: The Gateway (Form) */}
           <div className="w-full md:w-1/2 relative bg-[#000000] flex items-center justify-center p-8 md:p-12 lg:p-20">
               
               {/* Decorative Background Elements for Form Side */}
               <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
               </div>

               <div className={`relative z-10 w-full max-w-md transition-all duration-700 delay-200 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                   
                   {/* Mobile Header (Only visible on small screens) */}
                   <div className="md:hidden text-center mb-10">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/40 mb-4">
                            <Hexagon size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
                        <p className="text-slate-500 text-sm">Devam etmek için giriş yapın.</p>
                   </div>

                   {/* Toggle Tabs - Premium Pill Style */}
                   <div className="flex p-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800 mb-10 relative">
                       <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-800 rounded-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-lg border border-slate-700 ${view === 'login' ? 'left-1.5' : 'left-[calc(50%+4px)]'}`}>
                           {/* Active Glow */}
                           <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full opacity-50"></div>
                       </div>
                       
                       <button onClick={() => setView('login')} className={`flex-1 relative z-10 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                           Giriş
                       </button>
                       <button onClick={() => setView('signup')} className={`flex-1 relative z-10 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'signup' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                           Kayıt Ol
                       </button>
                   </div>

                   {/* Form Content */}
                   <div className="relative min-h-[400px]">
                       
                       {/* LOGIN FORM */}
                       {view === 'login' && (
                           <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-forwards">
                               <div className="space-y-2">
                                   <p className="text-slate-400 text-sm mb-6">Hesabınıza erişmek için bilgilerinizi giriniz.</p>
                                   
                                   <FloatingInput 
                                      label="E-Posta Adresi" 
                                      icon={Mail} 
                                      name="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                   />
                                   
                                   <div className="relative">
                                       <FloatingInput 
                                          label="Şifre" 
                                          icon={Lock} 
                                          type={showPassword ? "text" : "password"}
                                          name="password"
                                          value={formData.password}
                                          onChange={handleInputChange}
                                       />
                                       <button 
                                           type="button" 
                                           onClick={() => setShowPassword(!showPassword)}
                                           className="absolute right-5 top-[50px] text-slate-500 hover:text-amber-500 transition-colors z-30">
                                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                       </button>
                                   </div>
                               </div>

                               <div className="flex justify-between items-center pt-2">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className="w-5 h-5 rounded border border-slate-700 bg-slate-900/50 flex items-center justify-center transition-all group-hover:border-amber-500 group-[.checked]:bg-amber-500 group-[.checked]:border-amber-500">
                                          <Check size={12} className="text-black opacity-0 group-[.checked]:opacity-100 font-bold" />
                                      </div>
                                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Beni Hatırla</span>
                                  </label>

                                  <button type="button" onClick={() => showToast('success', 'Sıfırlama bağlantısı gönderildi.')} className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-medium hover:underline underline-offset-4 decoration-amber-500/50">
                                     Şifremi Unuttum?
                                  </button>
                               </div>

                               <button 
                                  disabled={isLoading}
                                  className="w-full mt-8 group relative overflow-hidden bg-white text-black font-black text-lg py-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out]"></div>
                                  <span className="relative flex items-center justify-center gap-3">
                                      {isLoading ? <Loader2 className="animate-spin" /> : (
                                          <>PANEL'E GİRİŞ YAP <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} /></>
                                      )}
                                  </span>
                               </button>
                           </form>
                       )}

                       {/* SIGNUP FORM */}
                       {view === 'signup' && (
                          <form onSubmit={handleSignup} className="space-y-5 animate-in fade-in slide-in-from-left-8 duration-500">
                               <p className="text-slate-400 text-sm mb-6">Profesyonel dünyaya ilk adımınızı atın.</p>
                               <div className="grid grid-cols-2 gap-4">
                                  <FloatingInput label="İsim Soyisim" icon={User} name="name" value={formData.name} onChange={handleInputChange} />
                                  <FloatingInput label="Şirket Adı" icon={Building2} name="companyName" value={formData.companyName} onChange={handleInputChange} />
                               </div>
                               <FloatingInput label="E-Posta" icon={Mail} name="email" value={formData.email} onChange={handleInputChange} />
                               <div className="grid grid-cols-2 gap-4">
                                  <FloatingInput label="Şifre" icon={Lock} type="password" name="password" value={formData.password} onChange={handleInputChange} />
                                  <FloatingInput label="Tekrar" icon={Lock} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                               </div>

                               <button 
                                  disabled={isLoading}
                                  className="w-full mt-8 group relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-lg py-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95">
                                  <span className="relative flex items-center justify-center gap-3">
                                      {isLoading ? <Loader2 className="animate-spin" /> : 'KAYIT OL VE BAŞLA'}
                                  </span>
                               </button>
                          </form>
                       )}

                   </div>
               </div>
               
               {/* Footer Credits */}
               <div className="absolute bottom-8 text-center text-[10px] text-slate-700">
                   &copy; 2026 KIRBAŞ YAZILIM A.Ş. <span className="mx-2">•</span> <a href="#" className="hover:text-slate-500">GİZLİLİK</a> <span className="mx-2">•</span> <a href="#" className="hover:text-slate-500">ŞARTLAR</a>
               </div>
           </div>
      </div>
      
      {/* Toast Notification Container */}
      {toast && (
        <div className={`fixed bottom-10 inset-x-0 flex justify-center z-50 pointer-events-none`}>
            <div className={`
                flex items-center gap-4 py-4 px-8 rounded-2xl shadow-2xl backdrop-blur-xl border pointer-events-auto animate-in slide-in-from-bottom-10 duration-500
                ${toast.type === 'success' 
                    ? 'bg-black/80 border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]' 
                    : 'bg-black/80 border-rose-500/30 text-rose-400 shadow-[0_0_30px_-5px_rgba(243,20,50,0.2)]'
                }
            `}>
                <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-wide">{toast.type === 'success' ? 'BAŞARILI' : 'HATA'}</span>
                    <span className="text-xs opacity-80 font-medium">{toast.message}</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

