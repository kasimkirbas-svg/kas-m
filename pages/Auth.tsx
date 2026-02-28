import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle, Shield, ArrowRight, Zap, Globe, Key, Factory, HardHat, Construction } from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  t?: any;
  language?: string;
}

// Email notification utility
const sendEmailNotification = (type: 'signup-confirmation' | 'admin-alert' | 'user-alert', recipient: string, data: any) => {
  const notification = {
    id: 'email-' + Date.now(),
    type,
    recipient,
    subject: getEmailSubject(type, data),
    body: getEmailBody(type, data),
    timestamp: new Date().toISOString(),
    status: 'sent'
  };

  const existingNotifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
  existingNotifications.push(notification);
  localStorage.setItem('emailNotifications', JSON.stringify(existingNotifications));

  console.log(`📧 Email sent to ${recipient}:`, notification);
};

const getEmailSubject = (type: string, data: any) => {
  switch (type) {
    case 'signup-confirmation':
      return 'Kırbaş Doküman - Hesabınız Başarıyla Oluşturuldu';
    case 'admin-alert':
      return `Yeni Kullanıcı Kaydı: ${data.name} (${data.email})`;
    case 'user-alert':
      return 'Yeni Kullanıcı Kırbaş Doküman\'a Katıldı';
    default:
      return 'Bildirim';
  }
};

const getEmailBody = (type: string, data: any) => {
  switch (type) {
    case 'signup-confirmation':
      const companyPart = data.companyName ? `\nŞirket: ${data.companyName}` : '';
      return `Merhaba ${data.name},\n\nKırbaş Doküman platformuna hoş geldiniz! Hesabınız başarıyla oluşturulmuştur.\n\nE-posta: ${data.email}${companyPart}\n\nUygulamaya giriş yaparak belgelerinizi oluşturmaya başlayabilirsiniz.\n\nİyi çalışmalar!\nKırbaş Doküman Ekibi`;
    case 'admin-alert':
      const companyPartAdmin = data.companyName ? `\nŞirket: ${data.companyName}` : '';
      return `Yeni bir kullanıcı Kırbaş Doküman\'a kaydolmuştur.\n\nAdı: ${data.name}\nE-posta: ${data.email}${companyPartAdmin}\nKayıt Tarihi: ${new Date().toLocaleString('tr-TR')}\n\nYönetim panelinden daha fazla bilgi alabilirsiniz.`;
    case 'user-alert':
      return `Merhaba,\n\n${data.name} ${data.companyName ? `(${data.companyName}) ` : ''}adlı yeni bir kullanıcı Kırbaş Doküman\'a katıldı!\n\nEkibiniz büyümeye devam ediyor.`;
    default:
      return '';
  }
};

const getStrength = (password: string) => {
  let score = 0;
  if (password.length > 5) score++;
  if (password.length > 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (password.length === 0) return '';
  if (score < 2) return 'Zayıf';
  if (score < 4) return 'Orta';
  return 'Güçlü';
};

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, t, language }) => {
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [strength, setStrength] = useState(''); // Password strength state

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    confirmPassword: '',
    resetCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');

    if (name === 'password') {
      const s = getStrength(value);
      setStrength(s);
    }
  };


  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasyon
    if (!formData.email || !formData.password) {
      setError('E-posta ve şifre zorunludur.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      // API call to backend
      console.log('Attempting login with:', '/api/auth/login');
      const response = await fetchApi('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse error:', jsonError);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      console.log('Response data:', data);

      if (response.ok && data.success) {
        // Save Token
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        setLoginAttempts(0); // Reset attempts on success

        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        // Check for 429 Too Many Requests
        if (response.status === 429) {
             setLoginAttempts(prev => prev + 1);
             setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin veya şifrenizi sıfırlayın.');
             setTimeout(() => setAuthView('forgot-password'), 2000); 
             return;
        }

        // Connection Error Handling
        let errorMessage = 'Giriş başarısız.';
        if (response.status === 500) {
            errorMessage = data?.message || 'Sunucu hatası (500). Beklenmeyen bir durum oluştu.';
        } else if (response.status === 404) {
            errorMessage = 'Sunucu bulunamadı (404). API adresi yanlış olabilir.';
        } else if (data && data.message) {
            errorMessage = data.message;
        }
        
        setError(errorMessage);
        if (data?.message?.includes('verify') || data?.message?.includes('lock')) {
            setTimeout(() => setAuthView('forgot-password'), 2000);
        } else {
             setLoginAttempts(prev => {
                const newAttempts = prev + 1;
                if (newAttempts >= 3) {
                     setError('Çok fazla başarısız deneme. Şifrenizi mi unuttunuz?');
                }
                return newAttempts;
             });
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message && err.message.startsWith('Server returned')) {
         setError(`Sunucu Hatası: ${err.message}`);
      } else {
         setError('Sunucu bağlantı hatası. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
      }
    } finally {
        setIsLoading(false);
    }
  };

    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup triggered"); // Debug
    setError('');
    setSuccess('');

    // Validasyon
    if (!formData.email || !formData.password || !formData.name) {
      setError('E-posta, şifre ve ad soyad alanları zorunludur.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending register request...');
      const response = await fetchApi('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName
        }),
      });

      let data;
      try {
           data = await response.json();
      } catch (e) {
           console.error('Registration JSON error:', e);
           throw new Error('Sunucu geçerli bir yanıt döndürmedi.');
      }
      
      console.log('Register response:', data);

      if (data.success) {
        sendEmailNotification('signup-confirmation', data.user.email, data.user);
        
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        setSuccess('Hesap başarıyla oluşturuldu! Giriş yapılıyor...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1500);
      } else {
        setError(data.message || 'Kayıt başarısız.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email) {
        setError('Lütfen e-posta adresinizi girin.');
        return;
    }

    setIsLoading(true);

    try {
        const response = await fetchApi('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
        });
        const data = await response.json();

        if (data.success) {
            if (data.debugCode) {
                 alert(`[TEST MODU]\nE-posta sunucusu yapılandırılmadığı için kodunuz burada gösterilmektedir:\n\nSıfırlama Kodunuz: ${data.debugCode}`);
                 setSuccess('Sıfırlama kodu ekranda gösterildi (Test Modu).');
            } else {
                 setSuccess('Sıfırlama kodu e-posta adresinize gönderildi.');
            }
            setTimeout(() => setAuthView('reset-password'), 1500);
        } else {
            setError(data.message || 'İşlem başarısız.');
        }
    } catch (err) {
        setError('Sunucu bağlantı hatası.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.resetCode || !formData.password) {
        setError('Kod ve yeni şifre gereklidir.');
        return;
    }

    setIsLoading(true);

    try {
        const response = await fetchApi('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                code: formData.resetCode,
                newPassword: formData.password
            })
        });
        const data = await response.json();

        if (data.success) {
            setSuccess('Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.');
            setTimeout(() => {
                setAuthView('login');
                setFormData(prev => ({ ...prev, password: '', resetCode: '' }));
            }, 2000);
        } else {
            setError(data.message || 'Sıfırlama başarısız.');
        }
    } catch (err) {
        setError('Sunucu bağlantı hatası.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-amber-500/30">
      
      {/* LEFT SIDE - INDUSTRIAL BRANDING */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-16 overflow-hidden bg-slate-900">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img 
              src="https://images.unsplash.com/photo-1565514020176-db5b5501fb33?auto=format&fit=crop&q=80&w=2000" 
              alt="Background" 
              className="w-full h-full object-cover opacity-40 grayscale mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/60 z-10"></div>
           {/* Scanlines Effect */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-20"></div>
        </div>

        {/* Brand Content */}
        <div className="relative z-30 h-full flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-400/50">
                    <Factory className="text-slate-950 w-7 h-7" />
                 </div>
                 <span className="text-2xl font-black tracking-[0.2em] text-white uppercase">Kırbaş Panel</span>
               </div>
               <div className="h-1 w-32 bg-gradient-to-r from-amber-500 to-transparent rounded-full opacity-80"></div>
            </div>

            <div className="space-y-8 max-w-2xl">
               <h1 className="text-6xl font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-sm uppercase tracking-tight">
                  <span className="block mb-2 text-amber-500">Endüstriyel</span>
                  Döküman Yönetimi
               </h1>
               <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl pl-1 border-l-4 border-amber-500/50">
                  Fabrikalar, madenler ve büyük ölçekli işletmeler için geliştirilmiş profesyonel iş takip ve belgelendirme sistemi.
               </p>
               
               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="px-5 py-4 rounded-xl bg-slate-950/50 border border-slate-700/50 backdrop-blur-md flex items-center gap-3 shadow-lg">
                     <div className="p-2 bg-blue-500/20 rounded-lg">
                         <Zap className="text-blue-400 w-5 h-5" />
                     </div>
                     <div>
                         <div className="text-white font-bold text-sm uppercase tracking-wider">Hızlı İşlem</div>
                         <div className="text-slate-500 text-xs">Saniyeler içinde belge üretimi</div>
                     </div>
                  </div>
                  <div className="px-5 py-4 rounded-xl bg-slate-950/50 border border-slate-700/50 backdrop-blur-md flex items-center gap-3 shadow-lg">
                     <div className="p-2 bg-emerald-500/20 rounded-lg">
                         <Shield className="text-emerald-400 w-5 h-5" />
                     </div>
                     <div>
                         <div className="text-white font-bold text-sm uppercase tracking-wider">Tam Güvenlik</div>
                         <div className="text-slate-500 text-xs">Uçtan uca şifreli altyapı</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 font-mono uppercase tracking-widest">
               <span>© 2026 Kırbaş Corporation</span>
               <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
               <span>V 3.2.0 Stable</span>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className="flex-1 w-full bg-slate-950 relative flex items-center justify-center p-4 sm:p-6 lg:border-l border-slate-800">
         
         {/* Mobile Background Image (Subtle) */}
         <div className="absolute inset-0 lg:hidden overflow-hidden z-0">
            <img 
               src="https://images.unsplash.com/photo-1565514020176-db5b5501fb33?auto=format&fit=crop&q=80&w=1000" 
               alt="Mobile Background" 
               className="w-full h-full object-cover opacity-10 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900/90"></div>
         </div>

         {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

         <div className="w-full max-w-[400px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Form Header - Mobile Optimized */}
            <div className="mb-8 lg:mb-10 text-center relative z-20">
                <div className="lg:hidden w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-amber-500/20 ring-1 ring-amber-500/50">
                     <Factory className="text-slate-900 w-8 h-8 drop-shadow-sm transform group-hover:scale-110 transition-transform" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-[0.2em] uppercase mb-2 drop-shadow-md">
                  {authView === 'login' ? 'Giriş Paneli' : 
                   authView === 'signup' ? 'Kayıt Ol' : 
                   authView === 'forgot-password' ? 'Şifre Yenile' : 'Yeni Şifre'}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                
                <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-widest lg:hidden">
                    Endüstriyel Belge Yönetim Sistemi
                </p>
            </div>

             {/* Tab Switcher */}
             {(authView === 'login' || authView === 'signup') && (
                <div className="grid grid-cols-2 p-1 mb-8 bg-slate-900 border border-slate-800 rounded-xl relative">
                    <button
                        onClick={() => {
                            setAuthView('login');
                            setFormData(prev => ({ ...prev, email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' }));
                            setError('');
                        }}
                        className={`transition-all duration-300 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg ${
                            authView === 'login' 
                            ? 'bg-slate-800 text-white shadow-md border border-slate-700' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                        }`}
                    >
                        Giriş
                    </button>
                    <button
                        onClick={() => {
                            setAuthView('signup');
                            setFormData(prev => ({ ...prev, email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' }));
                            setError('');
                        }}
                         className={`transition-all duration-300 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg ${
                            authView === 'signup' 
                            ? 'bg-slate-800 text-white shadow-md border border-slate-700' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                        }`}
                    >
                        Kayıt
                    </button>
                </div>
             )}

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-red-300 font-bold tracking-wide">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-emerald-300 font-bold tracking-wide">{success}</p>
                </div>
            )}

            <form onSubmit={
                authView === 'login' ? handleLogin : 
                authView === 'signup' ? handleSignUp : 
                authView === 'forgot-password' ? handleForgotPassword :
                handleResetPassword
            } className="space-y-5">
                
                {authView === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">AD SOYAD</label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 text-sm font-bold text-slate-200"
                            placeholder="Adınız Soyadınız"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">ŞİRKET ADI</label>
                        <div className="relative group">
                            <Building2 className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 text-sm font-bold text-slate-200"
                            placeholder="Opsiyonel"
                            />
                        </div>
                    </div>
                </div>
                )}

                {(authView !== 'reset-password' || !formData.email) && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4 duration-500 delay-75">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-POSTA ADRESİ</label>
                     <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 text-sm font-bold text-slate-200"
                        placeholder="ornek@sirket.com"
                        disabled={authView === 'reset-password'}
                        />
                    </div>
                </div>
                )}

                {authView === 'reset-password' && (
                     <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">DOĞRULAMA KODU</label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="resetCode"
                            value={formData.resetCode}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all tracking-[0.5em] text-center font-mono text-lg text-amber-500 font-bold"
                            placeholder="123456"
                            maxLength={6}
                            />
                        </div>
                    </div>
                )}

                {authView !== 'forgot-password' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">ŞİFRE</label>
                        {authView === 'login' && (
                            <button type="button" onClick={() => setAuthView('forgot-password')} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 hover:underline transition-colors uppercase tracking-wide">
                                ŞİFREMİ UNUTTUM?
                            </button>
                        )}
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 text-sm font-bold text-slate-200"
                        placeholder="••••••••"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-slate-600 hover:text-slate-300 transition-colors"
                        >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {authView === 'signup' && formData.password && (
                      <div className="mt-2">
                         <div className="flex gap-1 h-1 mb-1 overflow-hidden bg-slate-800 rounded-full">
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Zayıf' || strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Zayıf' ? 'bg-red-500' : strength === 'Orta' ? 'bg-amber-500' : 'bg-emerald-500') : 'opacity-0'}`}></div>
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Orta' ? 'bg-amber-500' : 'bg-emerald-500') : 'opacity-0'}`}></div>
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Güçlü' ? 'bg-emerald-500' : 'opacity-0'}`}></div>
                         </div>
                      </div>
                    )}
                </div>
                )}
                
                {authView === 'signup' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">ŞİFRE TEKRAR</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 text-sm font-bold text-slate-200"
                                placeholder="••••••••"
                                />
                            </div>
                         </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-900/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border border-blue-500/30 group mt-4 text-sm"
                >
                    {isLoading ? (
                        <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>YÜKLENİYOR...</span>
                        </>
                    ) : (
                        <>
                            {authView === 'login' ? 'GİRİŞ YAP' :
                            authView === 'signup' ? 'KAYIT OL' :
                            authView === 'forgot-password' ? 'KOD GÖNDER' : 
                            'GÜNCELLE'}
                            
                            {!isLoading && (authView === 'login' || authView === 'signup') && (
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                            )}
                        </>
                    )}
                </button>

                 {(authView === 'forgot-password' || authView === 'reset-password') && (
                     <button
                        type="button"
                        onClick={() => setAuthView('login')}
                        className="w-full py-2 text-slate-500 hover:text-white font-bold transition-colors text-[10px] uppercase tracking-widest"
                     >
                         GİRİŞ SAYFASINA DÖN
                     </button>
                 )}
            </form>
         </div>

         {/* Mobile Footer */}
         <div className="lg:hidden absolute bottom-4 text-center w-full left-0 flex flex-col gap-1 z-10">
             <div className="flex items-center justify-center gap-2 mb-1">
                 <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Güvenli Bağlantı</span>
                 <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
             </div>
            <p className="text-[10px] text-slate-600 font-black tracking-widest">© 2026 KIRBAŞ PANEL</p>
         </div>

      </div>
    </div>
  );
};
