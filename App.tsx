import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DocumentEditor } from './pages/DocumentEditor';
import { DocumentsList } from './pages/DocumentsList';
import { AdminPanel } from './pages/AdminPanel';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Button } from './components/Button';
import { MOCK_TEMPLATES, PLANS, APP_NAME } from './constants';
import { User, UserRole, SubscriptionPlan, DocumentTemplate, GeneratedDocument } from './types';
import { Check, Lock, Shield, Star, Users, FileText, DollarSign, TrendingUp, Search, MoreHorizontal, ArrowLeft } from 'lucide-react';

const App = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('landing'); // landing, dashboard, templates, editor, profile, admin, settings
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Auth Handlers (Simulated)
  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@firma.com',
      role: UserRole.SUBSCRIBER,
      plan: SubscriptionPlan.MONTHLY,
      remainingDownloads: 12,
      companyName: 'Yılmaz İnşaat Ltd.'
    });
    setCurrentView('dashboard');
  };

  const handleAdminLogin = () => {
    setUser({
      id: '99',
      name: 'System Admin',
      email: 'admin@kirbas.com',
      role: UserRole.ADMIN,
      plan: SubscriptionPlan.YEARLY,
      remainingDownloads: 'UNLIMITED',
      companyName: 'Kırbaş Yönetim A.Ş.'
    });
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  // Navigation Logic
  const renderContent = () => {
    // 1. Landing Page
    if (!user && currentView === 'landing') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Hero Section */}
          <header className="bg-slate-900 text-white py-6 px-4 md:px-12 flex justify-between items-center sticky top-0 z-50">
             <div className="font-bold text-xl tracking-wider">{APP_NAME}</div>
             <div className="space-x-4">
               <button onClick={handleLogin} className="text-slate-300 hover:text-white font-medium">Giriş Yap</button>
               <Button onClick={handleLogin} variant="primary">Ücretsiz Dene</Button>
             </div>
          </header>

          <section className="bg-slate-900 text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Profesyonel Dokümanlarınızı <br/> <span className="text-blue-500">Dakikalar İçinde</span> Oluşturun
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Acil durum planları, denetim raporları ve sertifikalar. 
              Bulut tabanlı panelinizden yönetin, fotoğraflı PDF çıktıları alın.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleLogin} size="lg">Hemen Başla</Button>
              <Button onClick={handleAdminLogin} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">Admin Demo</Button>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-20 px-6 max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Abonelik Paketleri</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {PLANS.map(plan => (
                <div key={plan.id} className={`bg-white p-8 rounded-2xl shadow-sm border ${plan.popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                  {plan.popular && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">EN ÇOK TERCİH EDİLEN</span>}
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-slate-900">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-slate-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex">
                        <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                        <span className="ml-3 text-slate-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleLogin} className="w-full mt-8" variant={plan.popular ? 'primary' : 'outline'}>
                    Seç ve Başla
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    // 2. Document Editor
    if (user && currentView === 'editor' && selectedTemplate) {
      return (
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentView('templates')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Şablonlara Dön
          </button>
          <DocumentEditor 
            template={selectedTemplate}
            userId={user.id}
            companyName={user.companyName}
            preparedBy={user.name}
            onClose={() => setCurrentView('templates')}
            onDocumentGenerated={(doc: GeneratedDocument) => {
              alert(`✓ Doküman başarıyla oluşturuldu: ${selectedTemplate.title}`);
              setCurrentView('dashboard');
            }}
          />
        </div>
      );
    }

    // 3. Template List (Documents)
    if (user && currentView === 'templates') {
      return (
        <div>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft size={18} />
            Ana Sayfaya Dön
          </button>
          <DocumentsList 
            templates={MOCK_TEMPLATES}
            userIsPremium={user.plan === SubscriptionPlan.YEARLY}
            onSelectTemplate={(template) => {
              setSelectedTemplate(template);
              setCurrentView('editor');
            }}
          />
        </div>
      );
    }

    // 4. Dashboard (Home)
    if (user && currentView === 'dashboard') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Hoşgeldin, {user.name}! 👋</h1>
            <p className="text-slate-500 text-lg mt-2">Bugün ne oluşturmak istersiniz?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                <div className="text-sm opacity-90 font-medium">Kalan İndirme Hakkı</div>
                <div className="text-4xl font-bold mt-2">{user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}</div>
                <p className="text-sm opacity-75 mt-4">
                  Paketiniz: <span className="font-semibold">{user.plan === SubscriptionPlan.YEARLY ? 'Yıllık Pro' : 'Aylık Standart'}</span>
                </p>
             </div>
             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-200 flex flex-col justify-center">
                <p className="opacity-90 font-medium mb-3">Yeni Doküman Oluşturmaya Başla</p>
                <Button 
                  onClick={() => setCurrentView('templates')} 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                >
                  + Doküman Oluştur
                </Button>
             </div>
             <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Son İşlemler</h3>
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
                    <span className="text-xs text-green-600 font-medium">✓ Başarılı</span>
                  </li>
                </ul>
             </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Hızlı Erişim</h2>
              <button 
                onClick={() => setCurrentView('templates')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Tümünü Gör →
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

    // 5. Profile Page
    if (user && currentView === 'profile') {
      return <Profile user={user} />;
    }

    // 6. Settings Page
    if (user && currentView === 'settings') {
      return <Settings user={user} />;
    }
    
    // 7. Admin Panel
    if (user?.role === UserRole.ADMIN && currentView === 'admin') {
      return <AdminPanel user={user} />;
    }

    // 8. Dashboard for Admin
    if (user?.role === UserRole.ADMIN && currentView === 'dashboard') {
      return <AdminPanel user={user} />;
    }

    // Default Fallback
    return <div className="p-8 text-center text-slate-500">Sayfa yükleniyor...</div>;
  };

  return (
    <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;