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

const getApiUrl = () => {
    // Mobil veya aynı ağdaki cihazlar için yerel IP adresi
    // Buradaki localhost'u kendi yerel IP'niz ile değiştirin
    // Örnek: 'http://192.168.1.11:3001'
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `http://${window.location.hostname}:3001`;
    }
    return 'http://localhost:3001';
};

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, t, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    confirmPassword: ''
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
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save Token
        localStorage.setItem('authToken', data.token);

        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        setError(data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
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
    }`${getApiUrl()}/api/auth/register`

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
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
          <div className="flex gap-4 mb-6 border-b border-slate-200">
            <button
              onClick={() => {
                setIsLogin(true);
                setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '' });
                setError('');
              }}
              className={`pb-3 font-semibold transition ${
                isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t?.auth?.login || 'Giriş Yap'}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setFormData({ email: '', password: '', name: '', companyName: '', confirmPassword: '' });
                setError('');
              }}
              className={`pb-3 font-semibold transition ${
                !isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t?.auth?.signup || 'Kaydol'}
            </button>
          </div>

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
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            {!isLogin && (
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

            {/* Email Field */}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Şifre * {!isLogin && '(En az 6 karakter)'}
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

            {/* Confirm Password Field (SignUp Only) */}
            {!isLogin && (
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isLogin ? 'Giriş yapılıyor...' : 'Kayıt oluşturuluyor...'}
                </span>
              ) : (
                isLogin ? t?.auth?.login || 'Giriş Yap' : t?.auth?.signup || 'Kaydol'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center mt-6">
            {t?.common?.welcome || 'Devam ederek'} <a href="#" className="text-blue-600 hover:underline">şartlar ve koşulları</a> kabul etmiş olursunuz.
            <br />
            <a href="#" className="text-blue-600 hover:underline">{t?.settings?.privacy || 'Gizlilik Politikası'}</a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-6">
          {isLogin ? t?.auth?.noAccount || "Hesabınız yok mu? " : t?.auth?.haveAccount || "Zaten hesabınız var mı? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? t?.auth?.createAccount || 'Kaydol' : t?.auth?.signInInstead || 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
};
