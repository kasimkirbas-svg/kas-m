import React, { useState } from 'react';
import { User, Mail, Building2, Calendar, CreditCard, Download, Edit2, Check, X } from 'lucide-react';

interface ProfileProps {
  user?: any;
  t?: any;
}

export const Profile: React.FC<ProfileProps> = ({ user, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user ? {
    name: user.name,
    email: user.email,
    companyName: user.companyName
  } : {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulate save
    alert(t?.profile?.savedSuccessfully || 'Profil bilgileriniz kaydedildi.');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white flex items-center gap-4">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-blue-100">{user?.email}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Edit2 size={18} />
          {isEditing ? t?.common?.cancel || 'İptal' : t?.common?.edit || 'Düzenle'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Profile Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} />
              {t?.profile?.accountInformation || 'Hesap Bilgileri'}
            </h2>

            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.fullName || 'Ad Soyad'}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.email || 'E-posta'}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.companyName || 'Şirket Adı'}</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Check size={18} />
                    {t?.profile?.saveProfile || 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium flex items-center justify-center gap-2 transition"
                  >
                    <X size={18} />
                    {t?.common?.cancel || 'İptal'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div
                  className="pb-4 border-b border-slate-100">
                  <p className="text-sm text-slate-600 mb-1">{t?.profile?.fullName || 'Ad Soyad'}</p>
                  <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
                </div>
                <div className="pb-4 border-b border-slate-100">
                  <p className="text-sm text-slate-600 mb-1">{t?.profile?.email || 'E-posta'}</p>
                  <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">{t?.profile?.companyName || 'Şirket Adı'}</p>
                  <p className="text-lg font-semibold text-slate-900">{user?.companyName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription Information */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-purple-600" />
              {t?.profile?.subscription || 'Abonelik'}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 uppercase font-semibold">{t?.profile?.plan || 'Paket'}</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {user?.plan === 'YEARLY' ? (t?.profile?.yearlyPro || 'Yıllık Pro') : (t?.profile?.monthlyStandard || 'Aylık Standart')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase font-semibold">{t?.profile?.status || 'Durum'}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {t?.profile?.active || '✓ Aktif'}
                </span>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition">
                {t?.profile?.upgrade || 'Yükselt'}
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">{t?.profile?.usageStatistics || 'Kullanım'}</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-slate-600">{t?.profile?.downloads || 'İndirme Hakkı'}</p>
                  <p className="font-semibold text-slate-900">
                    {user?.remainingDownloads === 'UNLIMITED' ? 'Sınırsız' : user?.remainingDownloads}
                  </p>
                </div>
                {user?.remainingDownloads !== 'UNLIMITED' && (
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(user?.remainingDownloads / 30) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium transition flex items-center justify-center gap-2">
              <Download size={18} />
              Faturalar
            </button>
            <button className="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium transition">
              Şifre Değiştir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
