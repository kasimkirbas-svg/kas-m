import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DocumentEditor } from './pages/DocumentEditor';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { MOCK_TEMPLATES, PLANS, APP_NAME } from './constants';
import { User, DocumentTemplate, SubscriptionPlan, UserRole } from './types';
import { Check, Lock, Shield, FileText, Star, Users, DollarSign, TrendingUp, Search, MoreHorizontal } from 'lucide-react';
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

    // 4. Dashboard (Home)
    if (user && currentView === 'dashboard') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Hoşgeldin, {user.name}</h1>
            <p className="text-slate-500">Bugün ne oluşturmak istersiniz?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                <h3 className="font-medium opacity-90">Kalan İndirme Hakkı</h3>
                <div className="text-4xl font-bold mt-2">{user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}</div>
                <p className="text-sm opacity-75 mt-4">Paketiniz: {user.plan === SubscriptionPlan.YEARLY ? 'Yıllık Pro' : 'Standart'}</p>
             </div>
             <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                <Button onClick={() => setCurrentView('templates')} size="lg">
                  + Yeni Doküman Oluştur
                </Button>
             </div>
             <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Son İşlemler</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">Acil Durum Planı</span>
                    <span className="text-slate-400">2 saat önce</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">Risk Analizi</span>
                    <span className="text-slate-400">Dün</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">Abonelik Yenileme</span>
                    <span className="text-green-600 font-medium">Başarılı</span>
                  </li>
                </ul>
             </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Popüler Şablonlar</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {MOCK_TEMPLATES.slice(0, 3).map(template => (
                  <div key={template.id} onClick={() => {setSelectedTemplate(template); setCurrentView('editor');}} className="cursor-pointer bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-400 transition-colors flex items-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4">
                      <Star size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{template.title}</h4>
                      <p className="text-xs text-slate-500">{template.category}</p>
                    </div>
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
    
    // 7. Admin Panel (Improved)
    if (user?.role === UserRole.ADMIN && currentView === 'admin') {
      return (
        <div className="max-w-7xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
             <div>
               <h1 className="text-2xl font-bold text-slate-800">Yönetici Paneli</h1>
               <p className="text-slate-500">Sistem genel durum özeti ve yönetimi.</p>
             </div>
             <Button>Rapor İndir</Button>
           </div>

           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                 <span className="text-green-500 text-xs font-bold flex items-center"><TrendingUp size={12} className="mr-1" /> +12%</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800">1,240</h3>
               <p className="text-sm text-slate-500">Aktif Abone</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FileText size={20} /></div>
                 <span className="text-green-500 text-xs font-bold flex items-center"><TrendingUp size={12} className="mr-1" /> +8%</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800">8,503</h3>
               <p className="text-sm text-slate-500">Üretilen Doküman</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                 <span className="text-green-500 text-xs font-bold flex items-center"><TrendingUp size={12} className="mr-1" /> +24%</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800">₺142.5K</h3>
               <p className="text-sm text-slate-500">Aylık Ciro</p>
             </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Shield size={20} /></div>
                 <span className="text-slate-500 text-xs font-bold">Sabit</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800">10</h3>
               <p className="text-sm text-slate-500">Aktif Şablon</p>
             </div>
           </div>

           {/* Content Grid */}
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Recent Users Table */}
             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Son Üyelikler</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="Ara..." className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                      <tr>
                          <th className="px-6 py-3">Kullanıcı / Firma</th>
                          <th className="px-6 py-3">Paket</th>
                          <th className="px-6 py-3">Durum</th>
                          <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-white hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">Mehmet Demir</div>
                            <div className="text-xs text-slate-400">Demir Lojistik A.Ş.</div>
                          </td>
                          <td className="px-6 py-4">Yıllık Pro</td>
                          <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Aktif</span></td>
                          <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600"><MoreHorizontal size={18} /></button></td>
                      </tr>
                      <tr className="bg-white hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">Ayşe Kaya</div>
                            <div className="text-xs text-slate-400">Kaya Mimarlık</div>
                          </td>
                          <td className="px-6 py-4">Aylık</td>
                          <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Gecikmiş</span></td>
                          <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600"><MoreHorizontal size={18} /></button></td>
                      </tr>
                       <tr className="bg-white hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">Caner Erkin</div>
                            <div className="text-xs text-slate-400">Freelance</div>
                          </td>
                          <td className="px-6 py-4">Deneme</td>
                          <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Yeni</span></td>
                          <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600"><MoreHorizontal size={18} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>

             {/* Recent Activity / System Logs */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4">Sistem Hareketleri</h3>
               <div className="space-y-4">
                 {[
                   { text: "Yeni üyelik: Demir Lojistik", time: "5 dk önce", color: "bg-blue-500" },
                   { text: "Fatura kesildi: #INV-2024001", time: "12 dk önce", color: "bg-green-500" },
                   { text: "Şablon güncellendi: Risk Analizi", time: "1 saat önce", color: "bg-purple-500" },
                   { text: "Ödeme başarısız: Kaya Mimarlık", time: "3 saat önce", color: "bg-red-500" },
                   { text: "Yeni destek talebi #492", time: "5 saat önce", color: "bg-orange-500" },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-3">
                     <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 opacity-75 ring-2 ring-white ring-offset-1 ring-offset-slate-100 ${log.color}" style={{ backgroundColor: log.color.replace('bg-', '') }}></div> 
                     {/* Note: Tailwind color classes need full compilation sometimes, style fallback helps */}
                     <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${log.color}`}></div>
                     <div>
                       <p className="text-sm text-slate-800 font-medium">{log.text}</p>
                       <p className="text-xs text-slate-400">{log.time}</p>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-6 text-sm text-blue-600 font-medium hover:underline">Tüm Kayıtları Gör</button>
             </div>
           </div>
        </div>
      )
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
