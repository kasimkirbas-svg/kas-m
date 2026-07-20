import React, { useState } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Save, Bell, Lock, User as UserIcon } from 'lucide-react';
import { changeSupabasePassword, isSupabaseConfigured, updateSupabaseProfile } from '../services/supabaseService';

interface SettingsProps {
  user: User;
  onSave?: (changes: Partial<User>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onSave }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: user.name, companyName: user.companyName || '', phone: user.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('isg_notification_preferences') || '{"invoice":true,"quota":true,"templates":false}'); }
    catch { return { invoice: true, quota: true, templates: false }; }
  });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    if (activeTab === 'general') {
      try {
        await updateSupabaseProfile(profile);
        onSave?.(profile);
      } catch (saveError: any) {
        setError(saveError.message || 'Profil bilgileri kaydedilemedi.'); setLoading(false); return;
      }
    } else if (activeTab === 'notifications') {
      localStorage.setItem('isg_notification_preferences', JSON.stringify(notifications));
    } else {
      if (!/^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d).{8,}$/.test(passwords.next)) {
        setError('Yeni şifre en az 8 karakter, büyük/küçük harf ve rakam içermelidir.'); setLoading(false); return;
      }
      if (passwords.next !== passwords.confirm) { setError('Yeni şifreler eşleşmiyor.'); setLoading(false); return; }
      if (isSupabaseConfigured) {
        try {
          await changeSupabasePassword(user.email, passwords.current, passwords.next);
          setPasswords({ current: '', next: '', confirm: '' });
        } catch (passwordError: any) {
          setError(passwordError.message || 'Şifre güncellenemedi.'); setLoading(false); return;
        }
      } else {
      const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
      const accounts = JSON.parse(localStorage.getItem('isg_accounts') || '[]');
      const index = accounts.findIndex((account: any) => account.user.email.toLowerCase() === user.email.toLowerCase());
      if (index < 0 || accounts[index].passwordHash !== await hash(passwords.current)) { setError('Mevcut şifreniz doğrulanamadı.'); setLoading(false); return; }
      accounts[index].passwordHash = await hash(passwords.next);
      localStorage.setItem('isg_accounts', JSON.stringify(accounts));
      setPasswords({ current: '', next: '', confirm: '' });
      }
    }
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="theme-settings max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hesap Ayarları</h2>
        <p className="text-slate-500 dark:text-slate-400">Kişisel bilgilerinizi ve tercihlerinizi yönetin.</p>
        {saved && <p className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Değişiklikler hesabınıza kaydedildi.</p>}
        {error && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'general' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <UserIcon size={18} className="mr-3" />
            Genel Bilgiler
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'security' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Lock size={18} className="mr-3" />
            Güvenlik & Şifre
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notifications' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Bell size={18} className="mr-3" />
            Bildirimler
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-white/90 dark:bg-[#171b20]/92 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Profil Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                  <input type="text" value={profile.name} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                  <input type="email" defaultValue={user.email} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" disabled />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Firma Ünvanı</label>
                  <input type="text" value={profile.companyName} onChange={event => setProfile(current => ({ ...current, companyName: event.target.value }))} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                  <input type="tel" value={profile.phone} onChange={event => setProfile(current => ({ ...current, phone: event.target.value }))} placeholder="+90 5XX XXX XX XX" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
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
                  <input type="password" id='curr-password' value={passwords.current} onChange={event => setPasswords(current => ({ ...current, current: event.target.value }))} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                  <input type="password" id='new-password' value={passwords.next} onChange={event => setPasswords(current => ({ ...current, next: event.target.value }))} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                  <input type="password" id='confirm-password' value={passwords.confirm} onChange={event => setPasswords(current => ({ ...current, confirm: event.target.value }))} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Bildirim Tercihleri</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">Aylık Fatura Bildirimi</p>
                    <p className="text-sm text-slate-500">Faturalarınız kesildiğinde e-posta alırsınız.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.invoice} onChange={event => setNotifications((current: any) => ({ ...current, invoice: event.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">Kota Uyarıları</p>
                    <p className="text-sm text-slate-500">İndirme kotanız %80'e ulaştığında haber verin.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.quota} onChange={event => setNotifications((current: any) => ({ ...current, quota: event.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">Yeni Şablonlar</p>
                    <p className="text-sm text-slate-500">Yeni doküman şablonları eklendiğinde bildirim al.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.templates} onChange={event => setNotifications((current: any) => ({ ...current, templates: event.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Button onClick={handleSave} isLoading={loading} size="lg" className="w-full sm:w-auto">
              <Save size={18} className="mr-2" />
              Değişiklikleri Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};