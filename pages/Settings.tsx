import React, { useState, useEffect } from 'react';
import { Globe, Bell, Moon, Sun, Monitor, Save } from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user?: User;
  t: any;
  language?: 'tr' | 'en' | 'ar';
  onLanguageChange?: (lang: 'tr' | 'en' | 'ar') => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  t, 
  language = 'tr', 
  onLanguageChange,
  theme = 'dark', 
  onThemeChange 
}) => {
  const [notifications, setNotifications] = useState(true);

  // Load notification preference
  useEffect(() => {
    const savedNotif = localStorage.getItem('notifications');
    if (savedNotif !== null) {
      setNotifications(savedNotif === 'true');
    }
  }, []);

  const handleSave = () => {
    // Persist local settings
    localStorage.setItem('notifications', String(notifications));
    
    // Show success message
    alert(t?.settings?.settingsSaved || 'Ayarlarınız başarıyla kaydedildi.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 tracking-wide uppercase drop-shadow-sm">
                {t?.settings?.title || 'AYARLAR'}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
                {t?.settings?.privacy || 'Uygulama tercihlerinizi buradan yönetebilirsiniz.'}
            </p>
        </header>

        {/* Language Settings */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/40 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-800 rounded-lg text-amber-500 shadow-inner shadow-black/50">
                    <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                    {t?.settings?.language || 'Dil Seçenekleri'}
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                    onClick={() => onLanguageChange && onLanguageChange('tr')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${language === 'tr' ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl filter drop-shadow-md">🇹🇷</span>
                        <div className="text-left">
                            <div className={`font-black text-lg ${language === 'tr' ? 'text-amber-500' : 'text-slate-300'}`}>TÜRKÇE</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Varsayılan</div>
                        </div>
                    </div>
                    {language === 'tr' && <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
                </button>

                <button 
                    onClick={() => onLanguageChange && onLanguageChange('en')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${language === 'en' ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl filter drop-shadow-md">🇺🇸</span>
                        <div className="text-left">
                            <div className={`font-black text-lg ${language === 'en' ? 'text-amber-500' : 'text-slate-300'}`}>ENGLISH</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">English (US)</div>
                        </div>
                    </div>
                     {language === 'en' && <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
                </button>

                <button 
                    onClick={() => onLanguageChange && onLanguageChange('ar')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${language === 'ar' ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl filter drop-shadow-md">🇸🇦</span>
                        <div className="text-left">
                            <div className={`font-black text-lg ${language === 'ar' ? 'text-amber-500' : 'text-slate-300'}`}>ARABIC</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">العربية</div>
                        </div>
                    </div>
                     {language === 'ar' && <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
                </button>
            </div>
        </section>

        {/* Theme Settings */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/40 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-800 rounded-lg text-blue-500 shadow-inner shadow-black/50">
                    <Monitor className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                    {t?.settings?.appearance || 'Görünüm'}
                </h2>
            </div>
            
             <div className="flex flex-wrap gap-4">
                <button 
                    onClick={() => onThemeChange && onThemeChange('dark')}
                    className={`flex-1 min-w-[140px] p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                    <div className={`p-3 rounded-full bg-slate-900 ${theme === 'dark' ? 'text-blue-500 shadow-blue-500/20' : 'text-slate-500'}`}>
                        <Moon className={`w-6 h-6`} />
                    </div>
                    <span className={`font-black text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-slate-400'}`}>
                        {t?.settings?.dark || 'Koyu Mod'}
                    </span>
                </button>
                 <button 
                    onClick={() => onThemeChange && onThemeChange('light')}
                    className={`flex-1 min-w-[140px] p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${theme === 'light' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                    <div className={`p-3 rounded-full bg-white ${theme === 'light' ? 'text-blue-500 shadow-blue-500/20' : 'text-slate-400 bg-slate-800'}`}>
                         <Sun className={`w-6 h-6`} />
                    </div>
                    <span className={`font-black text-sm uppercase tracking-wider ${theme === 'light' ? 'text-blue-400' : 'text-slate-400'}`}>
                        {t?.settings?.light || 'Açık Mod'}
                    </span>
                </button>
            </div>
        </section>

        {/* Notifications */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg shadow-black/40 hover:border-slate-700 transition-colors">
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg text-rose-500 shadow-inner shadow-black/50">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                            {t?.settings?.notifications || 'Bildirimler'}
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">
                            {t?.settings?.systemDesc || 'Önemli güncellemelerden haberdar ol'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-14 h-8 rounded-full transition-colors relative shadow-inner shadow-black/50 ${notifications ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
        </section>

        <div className="pt-6 flex justify-end">
             <button 
                onClick={handleSave}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-3 active:scale-95 transition-all uppercase tracking-wide text-lg"
             >
                <Save className="w-6 h-6" />
                {t?.settings?.saveChanges || 'AYARLARI KAYDET'}
             </button>
        </div>

      </div>
    </div>
  );
};
