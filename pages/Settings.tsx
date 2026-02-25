import React, { useState, useEffect } from 'react';
import { Bell, Lock, Eye, Globe, Shield, Trash2, CheckCircle, AlertCircle, Save, X, Moon, Sun, Monitor, AlertTriangle } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-2">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <CheckCircle size={20} />
          <p className="font-bold">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <AlertCircle size={20} />
          <p className="font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Navigation/Summary (Optional, but good for layout) or just direct content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Display & Language Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Monitor size={20} />
                    </div>
                    Görünüm ve Dil
                </h2>

                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Uygulama Teması</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'light', label: 'Açık', icon: <Sun size={18} /> },
                                { id: 'dark', label: 'Koyu', icon: <Moon size={18} /> },
                                // { id: 'system', label: 'Sistem', icon: <Monitor size={18} /> }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => onThemeChange(option.id as 'light' | 'dark')}
                                    className={`flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 transition-all font-bold ${
                                        theme === option.id 
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                                    }`}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Uygulama Dili</label>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value as 'tr' | 'en' | 'ar')}
                                className="w-full appearance-none px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 dark:text-white cursor-pointer"
                            >
                                <option value="tr">Türkçe (Turkish)</option>
                                <option value="en">English (İngilizce)</option>
                                <option value="ar">العربية (Arabic)</option>
                            </select>
                            <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Bell size={20} />
                    </div>
                    Bildirim Tercihleri
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
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                           <div className="pr-4">
                                <p className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={() => handleNotificationChange(item.key)}
                                />
                                <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Shield size={20} />
                    </div>
                    {t?.settings?.privacy || 'Gizlilik & Güvenlik'}
                </h2>

                <div className="space-y-4 mb-8">
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
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                           <div className="pr-4">
                                <p className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.label}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={privacy[item.key as keyof typeof privacy]}
                                    onChange={() => handlePrivacyChange(item.key)}
                                />
                                <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600 shadow-inner"></div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Password Change Button */}
                {!showPasswordForm ? (
                    <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Lock size={20} className="text-slate-400" />
                        Şifre Değiştir
                    </button>
                ) : (
                    <div className="border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-800/50 animate-fade-in">
                        <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                             <Lock size={20} className="text-indigo-600 dark:text-indigo-400" /> Şifre Güncelleme
                        </h3>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mevcut Şifre</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Şifre Onayla</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition disabled:opacity-50"
                                >
                                    Güncelle
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            
            {/* Danger Zone */}
            <div className="rounded-3xl border-2 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-8">
                <h2 className="text-xl font-black text-red-900 dark:text-red-400 mb-4 flex items-center gap-3">
                    <AlertTriangle size={24} />
                    Tehlikeli Alan
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300/80 max-w-md">
                        Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir ve bu işlem geri alınamaz.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="px-6 py-3 bg-white dark:bg-slate-900 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Trash2 size={18} />
                        Hesabı Sil
                    </button>
                </div>
            </div>

        </div>

        {/* Right Column - Summary / Save Actions */}
        <div className="lg:col-span-1 space-y-6">
             <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 shadow-2xl border border-slate-800 sticky top-24">
                <h3 className="font-black text-white text-lg mb-4">Değişiklik Özeti</h3>
                
                {!hasChanges ? (
                     <div className="text-slate-400 text-sm font-medium py-6 text-center border-2 border-dashed border-slate-700 rounded-xl">
                        Henüz değişiklik yapılmadı.
                     </div>
                ) : (
                    <div className="space-y-4 mb-6 animate-fade-in">
                        <div className="flex items-center gap-3 text-indigo-400">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold">Kaydedilmemiş değişiklikler var</span>
                        </div>
                        <p className="text-xs text-slate-500">
                             Yapılan değişikliklerin geçerli olması için kaydetmeyi unutmayın.
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                     <button
                        onClick={handleSaveSettings}
                        disabled={!hasChanges || isLoading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Kaydediliyor...</span>
                        </>
                        ) : (
                        <>
                            <Save size={18} />
                            Değişiklikleri Kaydet
                        </>
                        )}
                    </button>

                    {hasChanges && (
                        <button
                            onClick={() => {
                                setHasChanges(false);
                                setNotifications(JSON.parse(localStorage.getItem('notifications') || JSON.stringify(notifications)));
                                setPrivacy(JSON.parse(localStorage.getItem('privacy') || JSON.stringify(privacy)));
                            }}
                            className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            <X size={18} />
                            Değişiklikleri Geri Al
                        </button>
                    )}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};