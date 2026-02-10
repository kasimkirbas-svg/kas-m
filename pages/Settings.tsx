import React, { useState } from 'react';
import { Bell, Lock, Eye, Globe, Shield, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsProps {
  user?: any;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
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

  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'tr'
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              label: 'E-posta Bildirimleri',
              description: 'İşlemler ve güncellemeler için e-posta alın'
            },
            {
              key: 'system',
              label: 'Sistem Bildirimleri',
              description: 'Panelde anlık bildirimler alın'
            },
            {
              key: 'weekly_report',
              label: 'Haftalık Rapor',
              description: 'Her cuma haftalık özet raporu alın'
            },
            {
              key: 'marketing',
              label: 'Pazarlama E-postaları',
              description: 'Yeni özelliker ve özel teklifler hakkında bilgi alın'
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
          Gizlilik & Güvenlik
        </h2>

        <div className="space-y-4">
          {[
            {
              key: 'profile_public',
              label: 'Profilimi Herkese Açık Yap',
              description: 'Profiliniz sistem dizininde görünmesine izin verin'
            },
            {
              key: 'show_in_directory',
              label: 'Dizinde Göster',
              description: 'Başka kullanıcılar sizi bulabilsin'
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

          <button className="w-full mt-4 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition flex items-center justify-center gap-2">
            <Lock size={18} />
            Şifre Değiştir
          </button>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Eye size={24} />
          Görünüm
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">Tema</label>
            <div className="flex gap-3">
              {['light', 'dark', 'auto'].map(theme => (
                <label key={theme} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={settings.theme === theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700 capitalize">{theme === 'auto' ? 'Otomatik' : theme === 'light' ? 'Açık' : 'Koyu'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">Dil</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
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

        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition flex items-center gap-2">
          <Trash2 size={18} />
          Hesabı Sil
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2">
          <CheckCircle size={18} />
          Değişiklikleri Kaydet
        </button>
        <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition">
          İptal
        </button>
      </div>
    </div>
  );
};
