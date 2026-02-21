import React, { useState, useEffect } from 'react';
import { Bell, Lock, Eye, Globe, Shield, Trash2, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface SettingsProps {
  user?: any;
  theme: 'light' | 'dark';
  language: 'tr' | 'en' | 'ar';
  t: any;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLanguageChange: (language: 'tr' | 'en' | 'ar') => void;
  onUpdateProfile?: (updates: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, theme, language, t, onThemeChange, onLanguageChange, onUpdateProfile }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    marketing: false,
    weekly_report: true
  });

  const [privacy, setPrivacy] = useState({
    profile_public: false,
    show_in_directory: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // LocalStorage'dan ayarları yükle
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedPrivacy = localStorage.getItem('privacy');

    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
  }, []);

  const handleNotificationChange = (key: string) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    };
    setNotifications(updated);
    setHasChanges(true);
  };

  const handlePrivacyChange = (key: string) => {
    const updated = {
      ...privacy,
      [key]: !privacy[key as keyof typeof privacy]
    };
    setPrivacy(updated);
    setHasChanges(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('privacy', JSON.stringify(privacy));

    setTimeout(() => {
      setSuccessMessage('Ayarlarınız başarıyla kaydedildi.');
      setHasChanges(false);
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Tüm alanları doldurunuz.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('Yeni şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Gerçek uygulamada backend'e istek göndermeli
      setSuccessMessage('Şifreniz başarıyla güncellendi.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };


// Moved import to top of file
// import { fetchApi } from '../src/utils/api';

  const handleDeleteAccount = async () => {
    if (window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      if (window.confirm('Lütfen onayladığınızı tekrar belirtin.')) {
        setIsLoading(true);

        try {
          const response = await fetchApi('/api/auth/delete-account', {
              method: 'DELETE',
          });

          if (response.ok) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = '/';
          } else {
             const data = await response.json();
             alert(data.message || 'Hata oluştu.');
             setIsLoading(false);
          }
        } catch (error) {
             console.error(error);
             alert('Sunucu hatası.');
             setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Notifications Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Bell size={24} />
          Bildirim Ayarları
        </h2>

        <div className="space-y-4">
          {[
            {
              key: 'email',
              label: t?.settings?.emailNotifications || 'E-posta Bildirimleri',
              description: t?.settings?.emailDesc || 'İşlemler ve güncellemeler için e-posta alın'
            },
            {
              key: 'system',
              label: t?.settings?.systemNotifications || 'Sistem Bildirimleri',
              description: t?.settings?.systemDesc || 'Panelde anlık bildirimler alın'
            },
            {
              key: 'weekly_report',
              label: t?.settings?.weeklyReport || 'Haftalık Rapor',
              description: t?.settings?.weeklyDesc || 'Her cuma haftalık özet raporu alın'
            },
            {
              key: 'marketing',
              label: t?.settings?.marketing || 'Pazarlama E-postaları',
              description: t?.settings?.marketingDesc || 'Yeni özellikler ve özel teklifler hakkında bilgi alın'
            }
          ].map(item => (
            <label key={item.key} className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={() => handleNotificationChange(item.key)}
                className="w-4 h-4 mt-1 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="ml-4">
                <p className="font-medium text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={24} />
          {t?.settings?.privacy || 'Gizlilik & Güvenlik'}
        </h2>

        <div className="space-y-4 mb-6">
          {[
            {
              key: 'profile_public',
              label: t?.settings?.profilePublic || 'Profilimi Herkese Açık Yap',
              description: t?.settings?.profileDesc || 'Profiliniz sistem dizininde görünmesine izin verin'
            },
            {
              key: 'show_in_directory',
              label: t?.settings?.showDirectory || 'Dizinde Göster',
              description: t?.settings?.directoryDesc || 'Başka kullanıcılar sizi bulabilsin'
            }
          ].map(item => (
            <label key={item.key} className="flex items-start p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={privacy[item.key as keyof typeof privacy]}
                onChange={() => handlePrivacyChange(item.key)}
                className="w-4 h-4 mt-1 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="ml-4">
                <p className="font-medium text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Password Change Button */}
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            Şifre Değiştir
          </button>
        ) : (
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-4">Şifre Değiştir</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Şifre Onayla
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Eye size={24} />
          Görünüm
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">Tema</label>
            <div className="flex gap-3">
              {['light', 'dark'].map((themeOption) => (
                <label key={themeOption} className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition" style={{
                  borderColor: theme === themeOption ? '#2563eb' : '#cbd5e1',
                  backgroundColor: theme === themeOption ? '#eff6ff' : 'transparent'
                }}>
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={theme === themeOption}
                    onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark')}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium capitalize">
                    {themeOption === 'light' ? 'Açık' : 'Koyu'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">Dil</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as 'tr' | 'en' | 'ar')}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          Tehlikeli Alan
        </h2>

        <p className="text-sm text-red-700 mb-4">
          Aşağıdaki işlemler geri alınamaz. Lütfen dikkatli olun.
        </p>

        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition flex items-center gap-2 disabled:opacity-50"
        >
          <Trash2 size={18} />
          Hesabı Sil
        </button>
      </div>

      {/* Save Changes Buttons */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex gap-3 justify-end rounded-lg shadow-lg">
          <button
            onClick={() => {
              setHasChanges(false);
              setNotifications(JSON.parse(localStorage.getItem('notifications') || JSON.stringify(notifications)));
              setPrivacy(JSON.parse(localStorage.getItem('privacy') || JSON.stringify(privacy)));
            }}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition flex items-center gap-2"
            disabled={isLoading}
          >
            <X size={18} />
            İptal Et
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={18} />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      )}

      {!hasChanges && !showPasswordForm && (
        <div className="text-center py-4 text-slate-500 text-sm">
          Değişiklikleri yapmak için ayarları değiştirin.
        </div>
      )}
    </div>
  );
};
