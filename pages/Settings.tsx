import React, { useState } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Save, Bell, Lock, User as UserIcon } from 'lucide-react';

interface SettingsProps {
  user: User;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Ayarlar başarıyla güncellendi.");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Hesap Ayarları</h2>
        <p className="text-slate-500">Kişisel bilgilerinizi ve tercihlerinizi yönetin.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserIcon size={18} className="mr-3" />
            Genel Bilgiler
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock size={18} className="mr-3" />
            Güvenlik & Şifre
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell size={18} className="mr-3" />
            Bildirimler
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Profil Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                  <input type="text" defaultValue={user.name} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                  <input type="email" defaultValue={user.email} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" disabled />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Firma Ünvanı</label>
                  <input type="text" defaultValue={user.companyName} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                  <input type="tel" placeholder="+90 5XX XXX XX XX" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Şifre Değiştir</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifre</label>
                  <input type="password" id='curr-password' className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                  <input type="password" id='new-password' className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                  <input type="password" id='confirm-password' className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Bildirim Tercihleri</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Aylık Fatura Bildirimi</p>
                    <p className="text-sm text-slate-500">Faturalarınız kesildiğinde e-posta alırsınız.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Kota Uyarıları</p>
                    <p className="text-sm text-slate-500">İndirme kotanız %80'e ulaştığında haber verin.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Yeni Şablonlar</p>
                    <p className="text-sm text-slate-500">Yeni doküman şablonları eklendiğinde bildirim al.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Button onClick={handleSave} isLoading={loading} size="lg">
              <Save size={18} className="mr-2" />
              Değişiklikleri Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};