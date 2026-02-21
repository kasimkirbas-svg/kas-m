import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

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

import { fetchApi } from '../src/utils/api';

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
      let score = 0;
      if (value.length > 5) score++;
      if (value.length > 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^a-zA-Z0-9]/.test(value)) score++;

      if (value.length === 0) setStrength('');
      else if (score < 2) setStrength('Zayıf');
      else if (score < 4) setStrength('Orta');
      else setStrength('Güçlü');
    }
  };

  const getStrength = (pass: string) => {
    if (pass.length < 6) return 'Zayıf';
    if (pass.length < 8) return 'Zayıf';
    if (/^[a-zA-Z]+$/.test(pass) || /^[0-9]+$/.test(pass)) return 'Orta';
    return 'Güçlü';
  }

  const strength = getStrength(formData.password);
  
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

    if (getStrength(formData.password) === 'Zayıf') {
       setError('Lütfen daha güçlü bir şifre belirleyin (En az 8 karakter, harf ve rakam).');
       return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);

    try {
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

      const data = await response.json();

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
    } catch (err) {
      console.error('Signup error:', err);
      setError('Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
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
            setSuccess('Sıfırlama kodu e-posta adresinize gönderildi.');
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
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-900 overflow-hidden">
      
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 dark:bg-indigo-900 items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-blue-400 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-12 max-w-2xl">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-8 shadow-2xl border border-white/20">
              K
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">Kırbaş Doküman</h1>
            <p className="text-indigo-100 text-xl leading-relaxed">
              İşletmeniz için profesyonel belgeler, raporlar ve formlar oluşturmanın en hızlı ve güvenli yolu.
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-6 text-left">
               <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <CheckCircle className="text-green-400 mb-2" size={24} />
                  <h3 className="text-white font-semibold">30+ Hazır Şablon</h3>
                  <p className="text-indigo-200 text-sm mt-1">İhtiyacınız olan tüm kurumsal formatlar.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <Shield className="text-blue-400 mb-2" size={24} />
                  <h3 className="text-white font-semibold">Güvenli Arşiv</h3>
                  <p className="text-indigo-200 text-sm mt-1">Belgeleriniz bulutta güvende.</p>
               </div>
            </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {authView === 'login' && 'Tekrar Hoşgeldiniz'}
              {authView === 'signup' && 'Hesap Oluşturun'}
              {authView === 'forgot-password' && 'Şifrenizi Sıfırlayın'}
              {authView === 'reset-password' && 'Yeni Şifre Belirleyin'}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
               {authView === 'login' && 'Hesabınıza giriş yaparak devam edin.'}
               {authView === 'signup' && '30 gün boyunca tüm özelliklere ücretsiz erişin.'}
               {authView === 'forgot-password' && 'E-posta adresinize bir kod göndereceğiz.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 p-0 sm:p-8 rounded-2xl sm:shadow-xl sm:border border-slate-200 dark:border-slate-700">
             
             {/* View Toggle (Tabs) */}
             {(authView === 'login' || authView === 'signup') && (
                <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl mb-8">
                    <button
                        onClick={() => {
                            setAuthView('login');
                            setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' });
                            setError('');
                        }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                            authView === 'login' 
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 shadow-none'
                        }`}
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => {
                            setAuthView('signup');
                            setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' });
                            setError('');
                        }}
                         className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                            authView === 'signup' 
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 shadow-none'
                        }`}
                    >
                        Kayıt Ol
                    </button>
                </div>
             )}

            {/* Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3 items-start">
                <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl flex gap-3 items-start">
                <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
                </div>
            )}

            <form onSubmit={
                authView === 'login' ? handleLogin : 
                authView === 'signup' ? handleSignUp : 
                authView === 'forgot-password' ? handleForgotPassword :
                handleResetPassword
            } className="space-y-5">
                
                {authView === 'signup' && (
                <>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Soyad</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Şirket Adı <span className="text-xs text-slate-400 font-normal">(İsteğe Bağlı)</span></label>
                        <div className="relative group">
                            <Building2 className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Acme Inc."
                            />
                        </div>
                    </div>
                </>
                )}

                {(authView !== 'reset-password' || !formData.email) && (
                <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-posta Adresi</label>
                     <div className="relative group">
                        <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="mail@sirket.com"
                        disabled={authView === 'reset-password'}
                        />
                    </div>
                </div>
                )}

                {authView === 'reset-password' && (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Doğrulama Kodu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                            type="text"
                            name="resetCode"
                            value={formData.resetCode}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all tracking-widest text-center font-mono"
                            placeholder="123456"
                            />
                        </div>
                    </div>
                )}

                {authView !== 'forgot-password' && (
                <div>
                     <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Şifre</label>
                        {authView === 'login' && (
                            <button type="button" onClick={() => setAuthView('forgot-password')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                                Şifremi Unuttum?
                            </button>
                        )}
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Password Strength Meter */}
                    {authView === 'signup' && formData.password && (
                      <div className="mt-2 text-xs">
                         <div className="flex gap-1 h-1 mb-1">
                            <div className={`flex-1 rounded-full transition-all duration-300 ${strength === 'Zayıf' || strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Zayıf' ? 'bg-red-500' : strength === 'Orta' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-slate-200'}`}></div>
                            <div className={`flex-1 rounded-full transition-all duration-300 ${strength === 'Orta' || strength === 'Güçlü' ? (strength === 'Orta' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-slate-200'}`}></div>
                            <div className={`flex-1 rounded-full transition-all duration-300 ${strength === 'Güçlü' ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                         </div>
                         <p className={`text-right font-medium ${strength === 'Zayıf' ? 'text-red-500' : strength === 'Orta' ? 'text-yellow-600' : 'text-green-600'}`}>
                           {strength} Şifre
                         </p>
                      </div>
                    )}
                </div>
                )}
                
                {authView === 'signup' && (
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Şifre Tekrar</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                                />
                            </div>
                         </div>
                         
                         <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                            <CheckCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                            <p>Tüm yeni üyelere özel <strong>30 Gün Ücretsiz</strong> sınırlı kullanım hakkı tanımlanacaktır. Süre sonunda ücretli pakete geçmeniz gerekir.</p>
                         </div>
                    </div>
                )}

                <button
                
                {authView === 'signup' && (
                    <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Şifre Tekrar</label>
                         <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                        İşleniyor...
                        </span>
                    ) : (
                        authView === 'login' ? (t?.auth?.login || 'Giriş Yap') :
                        authView === 'signup' ? (t?.auth?.signup || 'Hemen Başla') :
                        authView === 'forgot-password' ? 'Sıfırlama Kodu Gönder' : 
                        'Şifreyi Güncelle'
                    )}
                </button>

                 {(authView === 'forgot-password' || authView === 'reset-password') && (
                     <button
                        type="button"
                        onClick={() => setAuthView('login')}
                        className="w-full py-2 text-slate-600 hover:text-slate-900 font-medium"
                     >
                         Geri Dön
                     </button>
                 )}
            </form>
            
            <p className="text-center text-xs text-slate-500 mt-6">
                © 2026 Kırbaş Doküman Platformu. Tüm hakları saklıdır.
                <br />
                <a href="#" className="hover:text-indigo-600 hover:underline">Gizlilik</a> • <a href="#" className="hover:text-indigo-600 hover:underline">Kullanım Şartları</a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};