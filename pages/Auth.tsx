import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Building2, Eye, EyeOff, 
  ArrowRight, Check, AlertCircle, Loader2 
} from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

// --- Floating Label Input (Premium Cyber-Luxe) ---
const FloatingInput = ({ label, icon: Icon, type = "text", ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative group mt-6">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300 ${isFocused ? 'text-amber-500' : ''}`}>
        <Icon size={20} />
      </div>
      <input
        {...props}
        type={type}
        className={`w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white outline-none transition-all duration-300 
          ${isFocused 
            ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/20' 
            : 'hover:border-slate-700'
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
      <label className={`absolute left-12 transition-all duration-300 pointer-events-none text-slate-500 font-medium
        ${(isFocused || hasValue || props.value) 
          ? '-top-2.5 text-xs bg-[#0f172a] px-2 text-amber-500' 
          : 'top-1/2 -translate-y-1/2 text-sm'
        }
      `}>
        {label}
      </label>
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

  // Trigger animations on mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Clear toast after 3.5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handlers
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
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Giriş başarılı! Yönlendiriliyorsunuz...');
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
                name: formData.name, 
                email: formData.email, 
                password: formData.password,
                companyName: formData.companyName
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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-white">
      
      {/* --- 1. Global Ambience --- */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#020617]"></div>
          {/* Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px]"></div>
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- 2. Main Glass Card --- */}
      <div className={`relative z-10 w-full max-w-[1100px] min-h-[600px] bg-[#111827]/40 backdrop-blur-xl border border-amber-500/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden transition-all duration-1000 ease-out transform ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}>
         
         {/* --- 3. Left Side (Visuals) --- */}
         <div className="w-full md:w-5/12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f172a] to-black border-r border-white/5">
             {/* Dynamic Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
             
             {/* Floating Particles/Glows */}
             <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-amber-600/20 rounded-full blur-[80px] animate-pulse"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-orange-600/10 rounded-full blur-[80px]"></div>

             <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
                 {/* Logo */}
                 <div className={`flex items-center gap-3 transition-all duration-700 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                     <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-400/20">K</div>
                     <span className="font-bold tracking-widest text-sm text-slate-300">KIRBAŞ PANEL</span>
                 </div>
                 
                 {/* Welcome Text */}
                 <div className={`space-y-6 my-auto transition-all duration-700 delay-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                         {view === 'login' ? (
                            <>
                                Tekrar <br />
                                <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">Hoş Geldiniz.</span>
                            </>
                         ) : (
                            <>
                                Geleceğe <br />
                                <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Katılın.</span>
                            </>
                         )}
                     </h1>
                     <p className="text-slate-400 text-sm leading-relaxed max-w-xs border-l-2 border-amber-500/30 pl-4">
                         {view === 'login' 
                            ? 'Profesyonel yönetim paneline güvenli giriş yapın. İş akışlarınızı optimize edin.' 
                            : 'Kurumsal yapıya geçiş yapın. Saniyeler içinde profesyonel erişim kazanın.'}
                     </p>
                 </div>

                 <div className={`flex items-center gap-2 text-[10px] text-slate-500 font-mono transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     SYSTEM STATUS: ONLINE
                 </div>
             </div>
         </div>

         {/* --- 4. Right Side (Form) --- */}
         <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
             <div className="max-w-md mx-auto w-full space-y-8">
                 
                 {/* Premium Toggle Switch */}
                 <div className="bg-[#0B0F19] p-1 rounded-xl border border-slate-800 w-full flex relative shadow-inner">
                     <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-800/80 rounded-lg transition-all duration-300 ease-in-out ${view === 'login' ? 'left-1' : 'left-[calc(50%+4px)]'}`}></div>
                     
                     <button 
                        onClick={() => setView('login')}
                        className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors duration-300 ${view === 'login' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-400'}`}>
                        Giriş Yap
                        {view === 'login' && <div className="absolute inset-0 bg-amber-500/5 rounded-lg border border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>}
                     </button>
                     <button 
                        onClick={() => setView('signup')}
                        className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors duration-300 ${view === 'signup' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-400'}`}>
                        Kayıt Ol
                        {view === 'signup' && <div className="absolute inset-0 bg-amber-500/5 rounded-lg border border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>}
                     </button>
                 </div>

                 {/* Forms Container */}
                 <div className="relative min-h-[320px]">
                     {view === 'login' && (
                         <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
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
                                     className="absolute right-4 top-[38px] text-slate-500 hover:text-amber-500 transition-colors z-10">
                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                             </div>

                             <div className="flex justify-end">
                                <button type="button" onClick={() => showToast('success', 'Sıfırlama bağlantısı gönderildi.')} className="text-xs text-amber-500/80 hover:text-amber-400 font-medium transition-colors">
                                   Şifremi Unuttum?
                                </button>
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] border border-amber-400/20 group transition-all duration-300 transform hover:scale-[1.01] hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out]"></div>
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
                                    <span className="flex items-center justify-center gap-2">
                                        Giriş Yap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                             </button>
                         </form>
                     )}

                     {view === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="grid grid-cols-2 gap-4">
                                <FloatingInput label="Ad Soyad" icon={User} name="name" value={formData.name} onChange={handleInputChange} />
                                <FloatingInput label="Şirket" icon={Building2} name="companyName" value={formData.companyName} onChange={handleInputChange} />
                             </div>
                             <FloatingInput label="E-Posta" icon={Mail} name="email" value={formData.email} onChange={handleInputChange} />
                             <div className="grid grid-cols-2 gap-4">
                                <FloatingInput label="Şifre" icon={Lock} type="password" name="password" value={formData.password} onChange={handleInputChange} />
                                <FloatingInput label="Şifre (Tekrar)" icon={Lock} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] border border-amber-400/20 transition-all duration-300 transform hover:scale-[1.01]">
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Hesap Oluştur'}
                             </button>
                        </form>
                     )}
                 </div>

                 {/* Toast Notification */}
                 {toast && (
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300 whitespace-nowrap z-50 ${
                        toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                        {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};
