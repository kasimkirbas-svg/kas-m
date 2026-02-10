import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  t?: any;
  language?: string;
}

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

    // Simulate API call
    setTimeout(() => {
      // localStorage'dan kaydedilmiş kullanıcıları kontrol et
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = savedUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (user) {
        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onLoginSuccess(user);
        }, 1000);
      } else {
        setError('E-posta veya şifre hatalı.');
      }
      setIsLoading(false);
    }, 1000);
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

    // Simulate API call
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Aynı email ile zaten kayıtlı kullanıcı var mı?
      if (savedUsers.some((u: any) => u.email === formData.email)) {
        setError('Bu e-posta adresi zaten kullanılıyor.');
        setIsLoading(false);
        return;
      }

      // Yeni kullanıcı oluştur
      const newUser = {
        id: 'user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        role: 'SUBSCRIBER',
        plan: 'FREE',
        remainingDownloads: 3, // Ücretsiz deneme
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      };

      savedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(savedUsers));

      setSuccess('Hesap başarıyla oluşturuldu! Giriş yapıyorsunuz...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1500);
      setIsLoading(false);
    }, 1000);
  };

  const handleDemo = () => {
    // Demo kullanıcısı oluştur
    const demoUser = {
      id: 'demo-' + Date.now(),
      name: 'Ahmet Yılmaz',
      email: 'demo@example.com',
      companyName: 'Demo Şirketi A.Ş.',
      role: 'SUBSCRIBER',
      plan: 'YEARLY',
      remainingDownloads: 'UNLIMITED',
      subscriptionStartDate: new Date().toISOString(),
      isActive: true
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
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
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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

            {/* Demo Button */}
            {isLogin && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-600">ya da</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemo}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                >
                  {t?.auth?.demoTest || 'Demo ile Dene'}
                </button>
              </>
            )}
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
