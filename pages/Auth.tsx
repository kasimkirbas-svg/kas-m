import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Building2, Eye, EyeOff, 
  ArrowRight, Check, AlertCircle, Loader2, Sparkles, Hexagon
} from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

// --- Ultra Premium Input (Glassmorphism + Neon Glow) ---
const FloatingInput = ({ label, icon: Icon, type = "text", ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative group mt-5">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-500'}`}>
        <Icon size={18} strokeWidth={isFocused ? 2.5 : 2} />
      </div>
      <input
        {...props}
        type={type}
        className={`w-full bg-[#030610]/40 border backdrop-blur-sm rounded-xl pl-12 pr-10 py-4 text-white placeholder-transparent outline-none transition-all duration-300 
          ${isFocused 
            ? 'border-amber-500/50 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2),inset_0_0_10px_rgba(245,158,11,0.05)] ring-1 ring-amber-500/20' 
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
      <label className={`absolute left-11 transition-all duration-300 pointer-events-none font-medium z-10
        ${(isFocused || hasValue || props.value) 
          ? '-top-2.5 text-[10px] uppercase tracking-wider bg-slate-900/90 border border-slate-800 px-2 rounded-md text-amber-500 shadow-lg' 
          : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
        }
      `}>
        {label}
      </label>
      
      {/* Input Bottom Glow Bar */}
      <div className={`absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [animate, setAnimate] = useState(false);

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
    if (!formData.email || !formData.password) {
        showToast('error', 'Lütfen tüm alanları doldurun.');
        return;
    }
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch(e) { throw new Error('Sunucu hatası.'); }
        
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Giriş başarılı! Sistemi başlatılıyor...');
            setTimeout(() => onLoginSuccess(data.user), 1500);
        } else {
            throw new Error(data.message || 'Giriş başarısız.');
        }
    } catch (err: any) {
        showToast('error', err.message || 'Sunucu hatası.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        showToast('error', 'Şifreler eşleşmiyor.');
        return;
    }
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ 
                name: formData.name, email: formData.email, 
                password: formData.password, companyName: formData.companyName
            })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Hesap oluşturuldu! Hoş geldiniz.');
            setTimeout(() => onLoginSuccess(data.user), 1500);
        } else {
            throw new Error(data.message || 'Kayıt başarısız.');
        }
    } catch (err: any) {
        showToast('error', err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-white">
      
      {/* 1. COSMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
          {/* Base Grid */}
          <div className="absolute inset-0 bg-grid-premium opacity-[0.15]"></div>
          
          {/* Animated Gradients */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* 2. MAIN CARD CONTAINER */}
      <div className={`relative z-10 w-full max-w-[1000px] min-h-[600px] glass-card-premium corner-brackets p-0 flex flex-col md:flex-row overflow-hidden transition-all duration-1000 ease-out transform group
          ${animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
      `}>
          
          {/* SCANNER LINE EFFECT */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-20">
             <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent animate-scan shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
          </div>

         {/* 3. LEFT SIDE (Brand & Art) */}
         <div className="w-full md:w-5/12 relative overflow-hidden bg-[#050812] border-r border-amber-500/10 flex flex-col justify-between p-10">
             
             {/* Tech Grid Overlay */}
             <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050812]/90"></div>
             
             {/* Neon Halo */}
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"></div>

             {/* Brand Logo */}
             <div className={`relative z-10 flex items-center gap-3 transition-all duration-700 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                 <div className="w-12 h-12 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center border border-amber-400/30 shadow-lg">
                        <Hexagon size={24} className="text-white fill-amber-600/50" />
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold tracking-[0.2em] text-sm text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">KIRBAŞ</span>
                    <span className="text-[10px] text-slate-500 tracking-wide font-mono">SECURE ACCESS</span>
                 </div>
             </div>
             
             {/* Hero Text */}
             <div className={`relative z-10 space-y-6 my-auto max-w-[280px] transition-all duration-700 delay-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wider mb-2">
                    <Sparkles size={10} />
                    <span>NEXT GEN PANEL</span>
                 </div>
                 <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-xl">
                     {view === 'login' ? (
                        <>Yönetimin <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Zirvesi</span></>
                     ) : (
                        <>Geleceği <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">İnşa Et</span></>
                     )}
                 </h1>
                 <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-amber-500/40 pl-4">
                     Tam kontrol. Sıfır gecikme. Sadece profesyoneller için tasarlandı.
                 </p>
             </div>

             {/* Footer Status */}
             <div className={`relative z-10 flex items-center justify-between text-[10px] text-slate-500 font-mono transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]"></div>
                     SERVER: ONLINE
                 </div>
                 <div>V3.5.0 STABLE</div>
             </div>
         </div>

         {/* 4. RIGHT SIDE (Form Area) */}
         <div className="w-full md:w-7/12 p-8 md:p-14 relative bg-[#080c14]/80 flex flex-col justify-center">
             
             {/* Glowing Border Line between columns (Mobile: horizontal, Desktop: vertical) */}
             <div className="absolute left-0 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden md:block"></div>

             <div className="max-w-md mx-auto w-full space-y-8 relative z-10">
                 
                 {/* Styled Tabs */}
                 <div className="bg-[#0f1522] p-1.5 rounded-xl border border-white/5 w-full flex relative shadow-inner overflow-hidden">
                     <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-800/80 rounded-[10px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${view === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}>
                        {/* Glow effect on active tab */}
                        <div className="absolute inset-0 bg-amber-500/10 rounded-[10px] shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>
                     </div>
                     
                     <button 
                        onClick={() => setView('login')}
                        className={`flex-1 relative z-10 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'login' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-400'}`}>
                        Giriş Yap
                     </button>
                     <button 
                        onClick={() => setView('signup')}
                        className={`flex-1 relative z-10 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'signup' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-400'}`}>
                        Kayıt Ol
                     </button>
                 </div>

                 {/* Dynamic Form Container */}
                 <div className="relative min-h-[340px]">
                     {view === 'login' && (
                         <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out fill-mode-forwards">
                             <FloatingInput 
                                label="E-Posta Adresi" 
                                icon={Mail} 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                             />
                             
                             <div className="relative">
                                 <FloatingInput 
                                    label="Gizli Şifre" 
                                    icon={Lock} 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                 />
                                 <button 
                                     type="button" 
                                     onClick={() => setShowPassword(!showPassword)}
                                     className="absolute right-4 top-[40px] text-slate-500 hover:text-amber-500 transition-colors z-20">
                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                             </div>

                             <div className="flex justify-between items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-4 h-4 rounded border border-slate-700 bg-slate-800/50 flex items-center justify-center transition-colors group-hover:border-amber-500/50">
                                        <Check size={10} className="text-amber-500 opacity-0 group-[.checked]:opacity-100" />
                                    </div>
                                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Beni Hatırla</span>
                                </label>

                                <button type="button" onClick={() => showToast('success', 'Bağlantı e-postanıza gönderildi.')} className="text-xs text-amber-500 hover:text-amber-400 transition-colors hover:underline decoration-amber-500/30 underline-offset-4">
                                   Şifremi Unuttum?
                                </button>
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full mt-6 group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_-5px_rgba(245,158,11,0.4)] border-t border-white/10 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-[0_8px_30px_-5px_rgba(245,158,11,0.6)] active:scale-[0.98]">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out]"></div>
                                {isLoading ? <Loader2 className="animate-spin mx-auto text-white/90" /> : (
                                    <span className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                                        Giriş Yap <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                             </button>
                         </form>
                     )}

                     {view === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                             <div className="grid grid-cols-2 gap-4">
                                <FloatingInput label="İsim" icon={User} name="name" value={formData.name} onChange={handleInputChange} />
                                <FloatingInput label="Kurum" icon={Building2} name="companyName" value={formData.companyName} onChange={handleInputChange} />
                             </div>
                             <FloatingInput label="E-Posta" icon={Mail} name="email" value={formData.email} onChange={handleInputChange} />
                             
                             <div className="grid grid-cols-2 gap-4">
                                <FloatingInput label="Şifre" icon={Lock} type="password" name="password" value={formData.password} onChange={handleInputChange} />
                                <FloatingInput label="Tekrar" icon={Lock} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full mt-6 group relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700 hover:from-amber-600 hover:to-orange-600 text-slate-300 hover:text-white border border-slate-700 hover:border-amber-500/30 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg">
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'SİSTEME KAYDOL'}
                             </button>
                        </form>
                     )}
                 </div>

                 {/* Toast */}
                 {toast && (
                    <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-bold tracking-wide animate-in slide-in-from-bottom-5 fade-in duration-300 whitespace-nowrap z-50 backdrop-blur-md border ${
                        toast.type === 'success' 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]' 
                            : 'bg-red-950/80 text-red-400 border-red-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]'
                    }`}>
                        {toast.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        {toast.message}
                    </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};
