import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Building2, Eye, EyeOff, 
  ArrowRight, Check, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

// --- Dynamic Strength Bar ---
const PasswordStrengthBar = ({ password }: { password: string }) => {
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };
  
  const score = getStrength(password);
  
  return (
    <div className="flex gap-1 h-1.5 mt-2 transition-all duration-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={`h-full flex-1 rounded-full transition-all duration-500 ${
            i <= score 
              ? score < 3 ? 'bg-red-500' : score < 4 ? 'bg-amber-400' : 'bg-emerald-500' 
              : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
};

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    confirmPassword: ''
  });

  // Clear toast after 3s
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

  // --- Logic Implementations ---

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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock Action
    setTimeout(() => {
        showToast('success', 'Sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setIsLoading(false);
        setTimeout(() => setView('login'), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- Animated Background Effects --- */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Main Card --- */}
      <div className="relative z-10 w-full max-w-[1000px] h-auto md:h-[600px] bg-[#1e293b]/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
         
         {/* Left Side: Visuals (Dynamic based on view) */}
         <div className={`w-full md:w-5/12 relative overflow-hidden transition-all duration-500 ease-in-out ${
             view === 'signup' ? 'bg-indigo-600' : 'bg-slate-900'
         }`}>
             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40"></div>
             
             {/* Abstract Shapes */}
             <div className="absolute inset-0 opacity-30">
                 <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/20 rounded-full"></div>
                 <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
             </div>

             <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
                 <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Sparkles size={16} />
                     </div>
                     <span className="font-bold tracking-wide text-sm">KIRBAŞ DOKÜMAN</span>
                 </div>
                 
                 <div className="space-y-4 my-auto">
                     <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                         {view === 'login' ? 'Tekrar Hoş Geldiniz.' : view === 'signup' ? 'Geleceğe Katılın.' : 'Hesap Kurtarma'}
                     </h1>
                     <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                         {view === 'login' 
                            ? 'Profesyonel doküman yönetiminin en hızlı ve güvenli yolu. Kaldığınız yerden devam edin.' 
                            : 'İş süreçlerinizi dijitalleştirin. Saniyeler içinde profesyonel belgeler üretin.'}
                     </p>
                 </div>

                 <div className="text-xs text-white/30 font-mono">
                     v2.5.0 Secure • System Online
                 </div>
             </div>
         </div>

         {/* Right Side: Form */}
         <div className="w-full md:w-7/12 p-8 md:p-12 bg-[#1e293b]/40 backdrop-blur-sm flex flex-col justify-center relative">
             <div className="max-w-sm mx-auto w-full space-y-8">
                 
                 {/* Header Tabs */}
                 <div className="flex items-center justify-center gap-1 bg-slate-900/50 p-1 rounded-xl w-fit mx-auto border border-slate-700/50">
                     <button 
                        onClick={() => setView('login')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            view === 'login' || view === 'forgot' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}>
                        Giriş
                     </button>
                     <button 
                        onClick={() => setView('signup')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            view === 'signup' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'
                        }`}>
                        Kayıt Ol
                     </button>
                 </div>

                 {/* Forms */}
                 <div className="relative min-h-[320px]">
                     {/* LOGIN FORM */}
                     {view === 'login' && (
                         <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">E-POSTA</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="ornek@sirket.com"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                             </div>
                             
                             <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-400">ŞİFRE</label>
                                    <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">Unuttum?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                {isLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Giriş Yap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                             </button>
                         </form>
                     )}

                     {/* SIGNUP FORM */}
                     {view === 'signup' && (
                         <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 ml-1">AD SOYAD</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 ml-1">ŞİRKET</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input 
                                            type="text" 
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 ml-1">E-POSTA</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>
                             </div>

                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 ml-1">ŞİFRE</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>
                                {formData.password && <PasswordStrengthBar password={formData.password} />}
                             </div>

                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 ml-1">ŞİFRE TEKRAR</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                {isLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Hesap Oluştur <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                             </button>
                         </form>
                     )}

                     {/* FORGOT PASSWORD FORM */}
                     {view === 'forgot' && (
                         <form onSubmit={handleForgot} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
                             <div className="text-center mb-6">
                                 <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                                     <Mail size={32} />
                                 </div>
                                 <h3 className="text-white font-bold text-lg">E-postanızı Girin</h3>
                                 <p className="text-slate-400 text-sm mt-2">
                                     Hesabınıza bağlı e-posta adresini girin, size şifre sıfırlama bağlantısı gönderelim.
                                 </p>
                             </div>

                             <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    placeholder="E-posta adresi"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white focus:border-blue-500 focus:outline-none"
                                />
                             </div>

                             <button 
                                disabled={isLoading}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-all">
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Sıfırlama Bağlantısı Gönder'}
                             </button>
                             
                             <button 
                                type="button"
                                onClick={() => setView('login')}
                                className="w-full text-sm text-slate-500 hover:text-white transition-colors">
                                Giriş Ekranına Dön
                             </button>
                         </form>
                     )}
                 </div>
             </div>

             {/* Footer Info */}
             <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-slate-600">
                 &copy; 2026 Kırbaş Doküman Sistemleri. Tüm hakları saklıdır.
             </div>
         </div>
      </div>

      {/* --- Toast Notification --- */}
      {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right-10 duration-300 ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
              {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{toast.message}</span>
          </div>
      )}
    </div>
  );
};
