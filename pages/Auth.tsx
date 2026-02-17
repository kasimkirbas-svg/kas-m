import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

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
      return `Merhaba ${data.name},\n\nKırbaş Doküman platformuna hoş geldiniz! Hesabınız başarıyla oluşturulmuştur.\n\nE-posta: ${data.email}\nŞirket: ${data.companyName}\n\nUygulamaya giriş yaparak belgelerinizi oluşturmaya başlayabilirsiniz.\n\nİyi çalışmalar!\nKırbaş Doküman Ekibi`;
    case 'admin-alert':
      return `Yeni bir kullanıcı Kırbaş Doküman\'a kaydolmuştur.\n\nAdı: ${data.name}\nE-posta: ${data.email}\nŞirket: ${data.companyName}\nKayıt Tarihi: ${new Date().toLocaleString('tr-TR')}\n\nYönetim panelinden daha fazla bilgi alabilirsiniz.`;
    case 'user-alert':
      return `Merhaba,\n\n${data.name} (${data.companyName}) adlı yeni bir kullanıcı Kırbaş Doküman\'a katıldı!\n\nEkibiniz büyümeye devam ediyor.`;
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
  };

  // Basit email validasyonu
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
    if (!formData.email || !formData.password || !formData.name || !formData.companyName) {
      setError('Tüm alanlar zorunludur.');
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            K
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Kırbaş Doküman</h1>
          <p className="text-slate-600 mt-2">{t?.dashboard?.greetings || 'Profesyonel Dokümanlarınız Dakikalar İçinde'}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Tabs */}
          {(authView === 'login' || authView === 'signup') && (
            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button
                onClick={() => {
                    setAuthView('login');
                    setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' });
                    setError('');
                }}
                className={`pb-3 font-semibold transition ${
                    authView === 'login'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                >
                {t?.auth?.login || 'Giriş Yap'}
                </button>
                <button
                onClick={() => {
                    setAuthView('signup');
                    setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '', resetCode: '' });
                    setError('');
                }}
                className={`pb-3 font-semibold transition ${
                    authView === 'signup'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                >
                {t?.auth?.signup || 'Kaydol'}
                </button>
            </div>
          )}

          {authView === 'forgot-password' && (
              <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">Şifremi Unuttum</h3>
                  <p className="text-sm text-slate-500">E-posta adresinize sıfırlama kodu göndereceğiz.</p>
              </div>
          )}

           {authView === 'reset-password' && (
              <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">Şifre Sıfırlama</h3>
                  <p className="text-sm text-slate-500">Gelen kodu ve yeni şifrenizi girin.</p>
              </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={
              authView === 'login' ? handleLogin : 
              authView === 'signup' ? handleSignUp : 
              authView === 'forgot-password' ? handleForgotPassword :
              handleResetPassword
            } className="space-y-4">
            
            {authView === 'signup' && (
              <>
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ad Soyad *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Adınız ve soyadınız"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Şirket Adı *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Şirketinizin adı"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field - Used in all views except reset password logic if cached, but let's keep it visible or read-only if needed. Actually Reset Password needs email too usually. */}
            {(authView !== 'reset-password' || !formData.email) && (
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-posta *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ornek@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                  disabled={isLoading || (authView === 'reset-password')}
                />
              </div>
            </div>
            )}

            {/* Reset Code Field */}
            {authView === 'reset-password' && (
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Doğrulama Kodu *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="resetCode"
                      value={formData.resetCode}
                      onChange={handleInputChange}
                      placeholder="6 haneli kod"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
            )}

            {/* Password Field - Login, Signup, Reset Password */}
            {authView !== 'forgot-password' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {authView === 'reset-password' ? 'Yeni Şifre *' : 'Şifre *'} {authView === 'signup' && '(En az 6 karakter)'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            )}

            {/* Confirm Password Field (SignUp Only) */}
            {authView === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Şifre Onayla *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-base sm:text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            {/* Forgot Password Link (Login Only) */}
            {authView === 'login' && (
                 <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setAuthView('forgot-password')}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {loginAttempts >= 3 ? <strong>Şifrenizi mi unuttunuz?</strong> : 'Şifremi Unuttum'}
                    </button>
                </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  İşlem yapılıyor...
                </span>
              ) : (
                authView === 'login' ? (t?.auth?.login || 'Giriş Yap') :
                authView === 'signup' ? (t?.auth?.signup || 'Kaydol') :
                authView === 'forgot-password' ? 'Kod Gönder' : 
                'Şifreyi Sıfırla'
              )}
            </button>
            
            {/* Back to Login (Forgot/Reset Password) */}
             {(authView === 'forgot-password' || authView === 'reset-password') && (
                 <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="w-full mt-3 px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition"
                 >
                     Giriş Yap'a Dön
                 </button>
             )}
          </form>

          {/* Terms */}
          {(authView === 'login' || authView === 'signup') && (
            <p className="text-xs text-slate-500 text-center mt-6">
                {t?.common?.welcome || 'Devam ederek'} <a href="#" className="text-blue-600 hover:underline">şartlar ve koşulları</a> kabul etmiş olursunuz.
                <br />
                <a href="#" className="text-blue-600 hover:underline">{t?.settings?.privacy || 'Gizlilik Politikası'}</a>
            </p>
          )}
        </div>

        {/* Footer */}
        {(authView === 'login' || authView === 'signup') && (
            <p className="text-center text-slate-600 text-sm mt-6">
            {authView === 'login' ? t?.auth?.noAccount || "Hesabınız yok mu? " : t?.auth?.haveAccount || "Zaten hesabınız var mı? "}
            <button
                onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')}
                className="text-blue-600 font-semibold hover:underline"
            >
                {authView === 'login' ? t?.auth?.createAccount || 'Kaydol' : t?.auth?.signInInstead || 'Giriş Yap'}
            </button>
            </p>
        )}
      </div>
    </div>
  );
};
