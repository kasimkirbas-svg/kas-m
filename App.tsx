import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DocumentEditor } from './pages/DocumentEditor';
import { DocumentsList } from './pages/DocumentsList';
import { AdminPanel } from './pages/AdminPanel';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Button } from './components/Button';
import { MOCK_TEMPLATES, PLANS, APP_NAME, ADMIN_USER } from './constants';
import { User, UserRole, SubscriptionPlan, DocumentTemplate, GeneratedDocument } from './types';
import { Check, Lock, Shield, Star, Users, FileText, DollarSign, TrendingUp, Search, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { getTranslation } from './i18n';

const App = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('auth');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
  const [t, setT] = useState(getTranslation('tr'));

  // Initialize application on mount (load users, theme, language)
  useEffect(() => {
    // Initialize admin user if no users exist
    const existingUsers = localStorage.getItem('allUsers');
    if (!existingUsers) {
      const initialUsers: User[] = [ADMIN_USER];
      localStorage.setItem('allUsers', JSON.stringify(initialUsers));
    }

    const savedUser = localStorage.getItem('currentUser');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' | 'ar' | null;

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentView('dashboard');
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
      setT(getTranslation(savedLanguage));
    }

    // Apply theme
    applyTheme(savedTheme || 'light');

    setIsLoading(false);
  }, []);

  const applyTheme = (themeType: 'light' | 'dark') => {
    const html = document.documentElement;
    if (themeType === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: 'tr' | 'en' | 'ar') => {
    setLanguage(newLanguage);
    setT(getTranslation(newLanguage));
    localStorage.setItem('language', newLanguage);
  };

  // Auth Handlers
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Belirle admin mi user mi
    if (userData.role === UserRole.ADMIN) {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
    setSelectedTemplate(null);
    localStorage.removeItem('currentUser');
  };

  // Navigation Logic
  const renderContent = () => {
    // Loading
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    // Auth Page
    if (!user) {
      return <Auth onLoginSuccess={handleLogin} t={t} language={language} />
    }

    // 1. Document Editor
    if (user && currentView === 'editor' && selectedTemplate) {
      return (
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentView('templates')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={18} />
            {t?.editor?.back || 'Şablonlara Dön'}
          </button>
          <DocumentEditor 
            template={selectedTemplate}
            userId={user.id}
            companyName={user.companyName}
            preparedBy={user.name}
            onClose={() => setCurrentView('templates')}
            onDocumentGenerated={(doc: GeneratedDocument) => {
              alert(`✓ ${selectedTemplate.title} ${t?.editor?.photoSuccess || 'dokümanı başarıyla oluşturuldu'}`);
              setCurrentView('dashboard');
            }}
            t={t}
          />
        </div>
      );
    }

    // 2. Template List (Documents)
    if (user && currentView === 'templates') {
      return (
        <div>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft size={18} />
            {t?.common?.back || 'Ana Sayfaya Dön'}
          </button>
          <DocumentsList 
            templates={MOCK_TEMPLATES}
            userIsPremium={user.plan === SubscriptionPlan.YEARLY}
            onSelectTemplate={(template) => {
              setSelectedTemplate(template);
              setCurrentView('editor');
            }}
            t={t}
          />
        </div>
      );
    }

    // 3. Dashboard (Home)
    if (user && currentView === 'dashboard') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">{t?.dashboard?.welcome || `Hoşgeldin, ${user.name}!`} 👋</h1>
            <p className="text-slate-500 text-lg mt-2">{t?.dashboard?.greetings || 'Bugün ne oluşturmak istersiniz?'}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                <div className="text-sm opacity-90 font-medium">{t?.dashboard?.remainingDownloads || 'Kalan İndirme Hakkı'}</div>
                <div className="text-4xl font-bold mt-2">{user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}</div>
                <p className="text-sm opacity-75 mt-4">
                  {t?.dashboard?.package || 'Paketiniz'}: <span className="font-semibold">{user.plan === SubscriptionPlan.YEARLY ? (t?.dashboard?.yearly || 'Yıllık Pro') : (t?.dashboard?.monthly || 'Aylık Standart')}</span>
                </p>
             </div>
             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-200 flex flex-col justify-center">
                <p className="opacity-90 font-medium mb-3">{t?.dashboard?.greetings || 'Yeni Doküman Oluşturmaya Başla'}</p>
                <Button 
                  onClick={() => setCurrentView('templates')} 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                >
                  + {t?.dashboard?.createDocument || 'Doküman Oluştur'}
                </Button>
             </div>
             <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">{t?.dashboard?.recentActivity || 'Son İşlemler'}</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Acil Durum Planı</span>
                    <span className="text-xs text-slate-400">2 saat önce</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Risk Analizi</span>
                    <span className="text-xs text-slate-400">Dün</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Abonelik Yenileme</span>
                    <span className="text-xs text-green-600 font-medium">✓ {t?.common?.success || 'Başarılı'}</span>
                  </li>
                </ul>
             </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{t?.dashboard?.quickAccess || 'Hızlı Erişim'}</h2>
              <button 
                onClick={() => setCurrentView('templates')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {t?.dashboard?.viewAll || 'Tümünü Gör'} →
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {MOCK_TEMPLATES.slice(0, 6).map(template => (
                  <div 
                    key={template.id} 
                    onClick={() => {
                      setSelectedTemplate(template);
                      if (!template.isPremium || user.plan === SubscriptionPlan.YEARLY) {
                        setCurrentView('editor');
                      } else {
                        alert('Bu premium şablon yalnızca Yıllık Pro paketine dahildir.');
                      }
                    }} 
                    className="cursor-pointer bg-white p-5 rounded-lg border border-slate-200 hover:shadow-md hover:border-blue-400 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition">
                        <FileText size={20} />
                      </div>
                      {template.isPremium && (
                        <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">{template.title}</h4>
                    <p className="text-xs text-slate-500 mb-3">{template.category}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                  </div>
               ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. Profile Page
    if (user && currentView === 'profile') {
      return <Profile user={user} t={t} />
    }

    // 5. Settings Page
    if (user && currentView === 'settings') {
      return (
        <Settings 
          user={user}
          theme={theme}
          language={language}
          t={t}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
        />
      );
    }
    
    // 6. Admin Panel (Handles all admin-related views)
    if (user?.role === UserRole.ADMIN && ['admin', 'dashboard', 'users', 'templates', 'settings'].includes(currentView)) {
      return <AdminPanel user={user} t={t} />
    }

    // Default Fallback
    return <div className="p-8 text-center text-slate-500">Sayfa yükleniyor... ({currentView})</div>;
  };

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
      language={language}
      t={t}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;