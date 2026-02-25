import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle, Shield, ArrowRight, Zap, Globe, Key } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  t?: any;
  language?: string;
}

import { fetchApi } from '../src/utils/api';

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
      
      // Try to parse JSON, but handle non-JSON responses (like Vercel error pages)
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse error:', jsonError);
        // If we can't parse JSON, use status text
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      console.log('Response data:', data);

      if (response.ok && data.success) {
        // Save Token
        localStorage.setItem('authToken', data.token);
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
             // Auto switch to forgot password if too many attempts or explicitly lockout
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
      // Check if it's a specific error message we threw above
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

    // Şifre gücü kontrolü (Devre dışı bırakıldı - çok katı olmasın)
    // if (getStrength(formData.password) === 'Zayıf') {
    //    setError('Lütfen daha güçlü bir şifre belirleyin (En az 8 karakter, harf ve rakam).');
    //    return;
    // }

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

      // Parse JSON safely
      let data;
      try {
           data = await response.json();
      } catch (e) {
           console.error('Registration JSON error:', e);
           throw new Error('Sunucu geçerli bir yanıt döndürmedi.');
      }
      
      console.log('Register response:', data);

      if (data.success) {
        // Send email notifications (Client side visual only)
        sendEmailNotification('signup-confirmation', data.user.email, data.user);
        
        // Save Token
        localStorage.setItem('authToken', data.token);

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
            // Check for developer mode code (when email is not configured)
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
    <div className="min-h-screen w-full flex bg-[#0B1120] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* LEFT SIDE - BRANDING & VISUALS */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-12 overflow-hidden bg-[#0f172a]">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#0f172a] to-[#0f172a] opacity-80"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Logo Area */}
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-bold text-xl">K</span>
                 </div>
                 <span className="text-xl font-bold tracking-tight text-white">Kırbaş Doküman</span>
               </div>
               <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-transparent rounded-full mt-4"></div>
            </div>

            {/* Middle Hero Text */}
            <div className="space-y-6 max-w-md">
               <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                  Belge Yönetiminde <br/>
                  <span className="text-white">Yeni Standart.</span>
               </h1>
               <p className="text-lg text-slate-400 font-light leading-relaxed">
                  Kurumsal belgelerinizi oluşturun, yönetin ve arşivleyin. Güvenli bulut altyapısı ile iş akışınızı hızlandırın.
               </p>
               
               <div className="flex flex-wrap gap-3 mt-4">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2 text-sm text-indigo-100">
                     <Zap size={16} className="text-yellow-400" />
                     <span>Hızlı Kurulum</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2 text-sm text-indigo-100">
                     <Shield size={16} className="text-green-400" />
                     <span>Uçtan Uca Şifreleme</span>
                  </div>
               </div>
            </div>

            {/* Bottom Testimonial/Stats */}
            <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                   <div className="relative z-10 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0">
                         A
                      </div>
                      <div>
                         <div className="flex text-yellow-500 mb-1">
                            {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                         </div>
                         <p className="text-slate-300 text-sm leading-relaxed mb-3">
                            "Kırbaş Doküman ile tüm sözleşme süreçlerimizi dijitalleştirdik. Artık belgelerimiz hem güvende hem de anında erişilebilir."
                         </p>
                         <p className="text-xs font-semibold text-white">Ahmet Yılmaz <span className="text-slate-500 font-normal ml-1">— Yılmaz Hukuk Bürosu</span></p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
                   <span>© 2026 Kırbaş Ltd.</span>
                   <a href="#" className="hover:text-indigo-400 transition-colors">Gizlilik</a>
                   <a href="#" className="hover:text-indigo-400 transition-colors">Şartlar</a>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 w-full bg-slate-50 dark:bg-[#0B1120] relative flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
         {/* Mobile Visual Background (Subtle) */}
         <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
             <div className="absolute -top-24 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
         </div>

         <div className="w-full max-w-[420px] mx-auto relative z-10">
            
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-indigo-600/30">K</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kırbaş Doküman</h2>
            </div>

            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {authView === 'login' ? 'Tekrar Hoşgeldiniz' : 
                   authView === 'signup' ? 'Hesap Oluşturun' : 
                   authView === 'forgot-password' ? 'Şifre Sıfırlama' : 'Yeni Şifre'}
               </h2>
               <p className="mt-3 text-slate-500 dark:text-slate-400 text-base">
                  {authView === 'login' ? 'Hesabınıza giriş yaparak panelinize erişin.' : 
                   authView === 'signup' ? 'Saniyeler içinde hesabınızı oluşturun.' : 
                   'E-posta adresinizi doğrulayarak şifrenizi yenileyin.'}
               </p>
            </div>

             {/* Tab Switcher */}
             {(authView === 'login' || authView === 'signup') && (
                <div className="grid grid-cols-2 p-1.5 mb-8 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative">
                    {/* Animated visual indicator could trigger complexity, using pure CSS classes for now */}
                    <button
                        onClick={() => {
                            setAuthView('login');
                            setFormData(prev => ({ ...prev, email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' }));
                            setError('');
                        }}
                        className={`relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            authView === 'login' 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => {
                            setAuthView('signup');
                            setFormData(prev => ({ ...prev, email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' }));
                            setError('');
                        }}
                         className={`relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            authView === 'signup' 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Kayıt Ol
                    </button>
                </div>
             )}

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex gap-3 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-red-600 dark:text-red-300 font-medium">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl flex gap-3 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-green-600 dark:text-green-300 font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={
                authView === 'login' ? handleLogin : 
                authView === 'signup' ? handleSignUp : 
                authView === 'forgot-password' ? handleForgotPassword :
                handleResetPassword
            } className="space-y-5">
                
                {authView === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ad Soyad</label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            placeholder="Adınız Soyadınız"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Şirket Adı <span className="text-xs text-slate-400 font-light ml-1">(Opsiyonel)</span></label>
                        <div className="relative group">
                            <Building2 className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            placeholder="Şirketiniz"
                            />
                        </div>
                    </div>
                </div>
                )}

                {(authView !== 'reset-password' || !formData.email) && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E-posta Adresi</label>
                     <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder="ornek@sirket.com"
                        disabled={authView === 'reset-password'}
                        />
                    </div>
                </div>
                )}

                {authView === 'reset-password' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Doğrulama Kodu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                            type="text"
                            name="resetCode"
                            value={formData.resetCode}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all tracking-[0.5em] text-center font-mono text-lg"
                            placeholder="123456"
                            maxLength={6}
                            />
                        </div>
                    </div>
                )}

                {authView !== 'forgot-password' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                     <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Şifre</label>
                        {authView === 'login' && (
                            <button type="button" onClick={() => setAuthView('forgot-password')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors">
                                Şifremi Unuttum?
                            </button>
                        )}
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-12 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder="••••••••"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {authView === 'signup' && formData.password && (
                      <div className="mt-3">
                         <div className="flex gap-1.5 h-1.5 mb-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Zayıf' || strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Zayıf' ? 'bg-red-500' : strength === 'Orta' ? 'bg-yellow-500' : 'bg-green-500') : 'opacity-0'}`}></div>
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Orta' ? 'bg-yellow-500' : 'bg-green-500') : 'opacity-0'}`}></div>
                            <div className={`flex-1 transition-all duration-500 ${strength === 'Güçlü' ? 'bg-green-500' : 'opacity-0'}`}></div>
                         </div>
                         <p className={`text-right text-xs font-medium ${strength === 'Zayıf' ? 'text-red-500' : strength === 'Orta' ? 'text-yellow-600' : 'text-green-600'}`}>
                           {strength} Şifre
                         </p>
                      </div>
                    )}
                </div>
                )}
                
                {authView === 'signup' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Şifre Tekrar</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="••••••••"
                                />
                            </div>
                         </div>
                         
                         <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0">
                                <CheckCircle size={14} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                <strong>30 Gün Ücretsiz Deneme:</strong> Kayıt olduğunuzda hiçbir kredi kartı bilgisi gerekmez. Memnun kalırsanız devam edersiniz.
                            </p>
                         </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group mt-2"
                >
                    {isLoading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>İşleniyor...</span>
                        </>
                    ) : (
                        <>
                            {authView === 'login' ? (t?.auth?.login || 'Giriş Yap') :
                            authView === 'signup' ? (t?.auth?.signup || 'Hemen Başla') :
                            authView === 'forgot-password' ? 'Sıfırlama Kodu Gönder' : 
                            'Şifreyi Güncelle'}
                            
                            {!isLoading && (authView === 'login' || authView === 'signup') && (
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            )}
                        </>
                    )}
                </button>

                 {(authView === 'forgot-password' || authView === 'reset-password') && (
                     <button
                        type="button"
                        onClick={() => setAuthView('login')}
                        className="w-full py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors text-sm"
                     >
                         Giriş Sayfasına Dön
                     </button>
                 )}
            </form>
         </div>

         {/* Mobile Footer */}
         <div className="lg:hidden mt-12 text-center">
            <p className="text-xs text-slate-400">© 2026 Kırbaş Doküman</p>
         </div>

      </div>
    </div>
  );
};