import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DocumentEditor } from './pages/DocumentEditor';
import { Auth } from './pages/Auth';
import { MOCK_TEMPLATES, PLANS, APP_NAME } from './constants';
import { User, DocumentTemplate } from './types';
import { Check, Lock, Shield, FileText } from 'lucide-react';
import { Button } from './components/Button';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('landing'); 
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  const renderContent = () => {
    if (currentView === 'auth') {
      return (
        <Auth 
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentView('landing')}
        />
      );
    }

    if (!user && currentView === 'landing') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <header className="bg-slate-900 text-white py-6 px-4 md:px-12 flex justify-between items-center sticky top-0 z-50">
             <div className="font-bold text-xl tracking-wider flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <FileText size={18} />
               </div>
               {APP_NAME}
             </div>
             <div className="space-x-4">
               <button onClick={() => setCurrentView('auth')} className="text-slate-300 hover:text-white font-medium transition-colors">Giriş Yap</button>
               <Button onClick={() => setCurrentView('auth')} variant="primary">Kayıt Ol</Button>
             </div>
          </header>

          <section className="bg-slate-900 text-white py-24 px-6 text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-3xl z-0 pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Profesyonel Dokümanlarınızı <br/> <span className="text-blue-400">Dakikalar İçinde</span> Oluşturun
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                Acil durum planları, denetim raporları ve sertifikalar. 
                Bulut tabanlı panelinizden yönetin, fotoğraflı PDF çıktıları alın.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setCurrentView('auth')} size="lg" className="px-8 shadow-blue-500/50 shadow-lg">
                  Hemen Başla
                </Button>
              </div>
            </div>
          </section>

          <section className="py-24 px-6 max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-16 tracking-tight">Abonelik Paketleri</h2>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 px-4 md:px-0">
              {PLANS.map(plan => (
                <div key={plan.id} className={`bg-white p-10 rounded-3xl shadow-xl transition-transform hover:-translate-y-1 ${plan.popular ? 'border-2 border-blue-500 ring-4 ring-blue-50 relative' : 'border border-slate-100'}`}>
                  {plan.popular && <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block absolute -top-4 left-1/2 -translate-x-1/2 shadow-sm">EN ÇOK TERCİH EDİLEN</span>}
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-slate-900">
                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-2 text-lg font-medium text-slate-500">{plan.period}</span>
                  </div>
                  <ul className="mt-8 space-y-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex">
                        <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                        <span className="ml-4 text-slate-600 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => setCurrentView('auth')} className="w-full mt-10 py-4 text-lg font-semibold" variant={plan.popular ? 'primary' : 'outline'}>
                    Seç ve Başla
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (user && currentView === 'editor' && selectedTemplate) {
      return (
        <DocumentEditor 
          template={selectedTemplate} 
          onBack={() => setCurrentView('templates')} 
          onSave={() => {
            alert('Doküman sisteminize başarıyla kaydedildi.');
            setCurrentView('dashboard');
          }} 
        />
      );
    }

    if (user && currentView === 'templates') {
      return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Doküman Şablonları</h2>
               <p className="text-slate-500 mt-2 text-lg">İhtiyacınız olan dokümanı seçin ve oluşturmaya başlayın.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_TEMPLATES.map(template => (
              <div key={template.id} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col group cursor-pointer" onClick={() => { setSelectedTemplate(template); setCurrentView('editor'); }}>
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                     <Shield size={28} />
                   </div>
                   {template.isPremium && <Lock className="text-amber-500" size={18} />}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{template.title}</h3>
                <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{template.description}</p>
                <div className="mt-auto">
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg mb-6 inline-block">
                    {template.category}
                  </span>
                  <Button className="w-full py-3" variant="primary">
                    Oluşturmaya Başla
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (user && currentView === 'dashboard') {
      return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 animate-in fade-in duration-300">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hoşgeldin, {user.name}</h1>
            <p className="text-slate-500 mt-2 text-lg">Platforma başarıyla giriş yaptınız. Bugün ne oluşturmak istersiniz?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
             <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20"><Shield size={100} /></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-blue-100 mb-2">Kalan İndirme Hakkı</h3>
                  <div className="text-5xl font-bold tracking-tight">
                    {user.remainingDownloads === 'UNLIMITED' || (typeof user.remainingDownloads === 'number' && user.remainingDownloads > 90) ? '∞' : user.remainingDownloads}
                  </div>
                  <div className="mt-6 inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-lg text-sm font-medium">
                    {user.plan} Plan
                  </div>
                </div>
             </div>
             
             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center cursor-pointer" onClick={() => setCurrentView('templates')}>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Yeni Belge</h3>
                <p className="text-slate-500 text-sm mb-6">Şablon kütüphanesinden belge seçin</p>
                <Button size="lg" className="w-full">
                  Doküman Oluştur
                </Button>
             </div>
             
             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                  <Check size={20} className="text-green-500" />
                  Son İşlemleriniz
                </h3>
                <div className="flex-1 flex items-center justify-center text-center px-4">
                  <div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock size={20} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">Henüz hiçbir doküman işlem geçmişiniz bulunmuyor.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (currentView === 'auth') {
    return <>{renderContent()}</>;
  }

  return (
    <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;