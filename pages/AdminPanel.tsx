import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Shield, TrendingUp, Search, MoreHorizontal, Plus, Trash2, Edit2, Download, Activity, X, Check, CheckCircle, AlertCircle, Mail, Send, Loader2 } from 'lucide-react';
import { User, UserRole, SubscriptionPlan } from '../types';

interface AdminPanelProps {
  user?: any;
  t?: any;
  currentView?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, t, currentView }) => {
  // Map global currentView to internal tab
  const getInitialTab = () => {
    switch(currentView) {
      case 'users': return 'subscribers';
      case 'templates': return 'templates';
      case 'dashboard': return 'overview';
      default: return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Email Notification State
  const [emailSending, setEmailSending] = useState<{ [key: string]: boolean }>({});
  const [emailNotification, setEmailNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (emailNotification) {
      const timer = setTimeout(() => setEmailNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [emailNotification]);

  const handleSendWelcomeEmail = (targetUser: User) => {
    // Start loading for specific user
    setEmailSending(prev => ({ ...prev, [targetUser.id]: true }));

    // Simulate Network Delay (1.5s)
    setTimeout(() => {
        // Success
        setEmailSending(prev => ({ ...prev, [targetUser.id]: false }));
        setEmailNotification({
            type: 'success',
            message: `Hoş geldin maili gönderildi: ${targetUser.email}`
        });

        // Add to recent logs (in local state only for this session/component as logs aren't fully persisted yet)
        console.log(`Email sent to ${targetUser.email} at ${new Date().toLocaleTimeString()}`);
    }, 1500);
  };

  const handleLoadDemoData = () => {
    const demoUsers: User[] = [
      {
        id: 'demo-1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@insaat.com',
        role: UserRole.SUBSCRIBER,
        plan: SubscriptionPlan.MONTHLY,
        remainingDownloads: 25,
        companyName: 'Yılmaz İnşaat Ltd.',
        isActive: true,
        subscriptionStartDate: new Date().toISOString(),
        password: '123'
      },
      {
        id: 'demo-2',
        name: 'Ayşe Demir',
        email: 'ayse@mimarlik.com',
        role: UserRole.SUBSCRIBER,
        plan: SubscriptionPlan.YEARLY,
        remainingDownloads: 'UNLIMITED',
        companyName: 'Demir Mimarlık',
        isActive: true,
        subscriptionStartDate: new Date().toISOString(),
        password: '123'
      },
      {
         id: 'demo-3',
         name: 'Mehmet Kara',
         email: 'mehmet@lojistik.com',
         role: UserRole.SUBSCRIBER,
         plan: SubscriptionPlan.FREE,
         remainingDownloads: 3,
         companyName: 'Kara Lojistik',
         isActive: false,
         subscriptionStartDate: new Date().toISOString(),
         password: '123'
      },
      {
         id: 'demo-4',
         name: 'Zeynep Çelik',
         email: 'zeynep@teknoloji.com',
         role: UserRole.SUBSCRIBER,
         plan: SubscriptionPlan.MONTHLY,
         remainingDownloads: 20,
         companyName: 'Çelik Teknoloji A.Ş.',
         isActive: true,
         subscriptionStartDate: new Date().toISOString(),
         password: '123'
      }
    ];
    
    // Filter duplicates
    const currentEmails = allUsers.map(u => u.email);
    const toAdd = demoUsers.filter(u => !currentEmails.includes(u.email));
    
    if (toAdd.length === 0) {
        setEmailNotification({ type: 'error', message: 'Demo verileri zaten yüklü.' });
        return;
    }

    const updatedUsers = [...allUsers, ...toAdd];
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // Recalc statistics
    const activeCount = updatedUsers.filter(u => u.isActive).length;
    // Recalc revenue
    const revenue = updatedUsers.reduce((acc, curr) => {
        if (curr.plan === SubscriptionPlan.YEARLY) return acc + 4999;
        if (curr.plan === SubscriptionPlan.MONTHLY) return acc + 499;
        return acc;
    }, 0);

    setStats(prev => ({ 
        ...prev, 
        activeUsers: activeCount,
        revenue: revenue
    }));

     setEmailNotification({ type: 'success', message: `${toAdd.length} demo kullanıcısı başarıyla eklendi.` });
  };

  // Sync tab when currentView changes externally
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [currentView]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalDocs: 8503, // Mock data for now
    revenue: 0,
    activeTemplates: 35 // Mock
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const storedUsers = localStorage.getItem('allUsers');
      if (storedUsers) {
        const users: User[] = JSON.parse(storedUsers);
        setAllUsers(users);
        
        // Calculate stats
        const activeCount = users.filter(u => u.isActive).length;
        // Simple revenue approximation (mock calculation)
        const revenue = users.reduce((acc, curr) => {
          if (curr.plan === SubscriptionPlan.YEARLY) return acc + 4999;
          if (curr.plan === SubscriptionPlan.MONTHLY) return acc + 499;
          return acc;
        }, 0);

        setStats(prev => ({
          ...prev,
          activeUsers: activeCount,
          revenue: revenue
        }));
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(t?.common?.confirmDelete || 'Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      const updatedUsers = allUsers.filter(u => u.id !== userId);
      setAllUsers(updatedUsers);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      
      // Also update 'users' key for legacy compatibility if needed
      if (localStorage.getItem('users')) {
         localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = allUsers.map(u => u.id === editingUser.id ? editingUser : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setEditingUser(null);
    alert(t?.common?.success || 'Kullanıcı güncellendi');
  };

  // Mock data for other sections
  const recentLogs = [
    { action: 'Yeni üyelik: Demir Lojistik', time: '5 dk önce', type: 'success', icon: Users },
    { action: 'Fatura kesildi: #INV-2024001', time: '12 dk önce', type: 'success', icon: FileText },
    { action: 'Şablon güncellendi: Risk Analizi', time: '1 saat önce', type: 'info', icon: Shield },
    { action: 'Ödeme başarısız: Kaya Mimarlık', time: '3 saat önce', type: 'warning', icon: TrendingUp },
  ];

  const templates = [
    { id: 1, name: 'Acil Durum Planı', category: 'ISG', downloads: 450, status: 'Aktif' },
    { id: 2, name: 'Denetim Raporu', category: 'Denetim', downloads: 332, status: 'Aktif' },
    { id: 3, name: 'Risk Analizi', category: 'ISG', downloads: 289, status: 'Aktif' },
  ];

  const invoices = [
    { number: 'INV-202601001', date: '01.02.2026', customer: 'Mehmet Demir', amount: '4999 TL', status: 'Ödendi' },
    { number: 'INV-202601002', date: '02.02.2026', customer: 'Ayşe Kaya', amount: '499 TL', status: 'Beklemede' },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t?.admin?.title || 'Yönetici Paneli'}</h1>
          <p className="text-slate-600 mt-1">{t?.admin?.statistics || 'Sistem genel durum özeti ve yönetimi'}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleLoadDemoData}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition flex items-center gap-2"
                title="Sistemi test etmek için örnek kullanıcılar ekler"
            >
                <Plus size={18} />
                Demo Veri
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2" onClick={() => setActiveTab('subscribers')}>
                <Users size={18} />
                {t?.admin?.subscribers || 'Aboneleri Yönet'}
            </button>
        </div>
      </div>

       {/* Email Notification Toast */}
      {emailNotification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
          emailNotification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {emailNotification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          {emailNotification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
              <TrendingUp size={12} className="mr-1" /> Available
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.activeUsers}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.activeSubscribers || 'Aktif Abone'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
               <FileText size={20} />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
               +8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalDocs}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.totalDocuments || 'Üretilen Doküman'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
               <DollarSign size={20} />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
               +24%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">₺{stats.revenue.toLocaleString()}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.revenue || 'Tahmini Ciro'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
               <Shield size={20} />
            </div>
            <span className="text-gray-500 text-xs font-bold flex items-center">
               Fixed
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.activeTemplates}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.totalTemplates || 'Aktif Şablonlar'}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto pb-1">
        {['overview', 'subscribers', 'templates', 'invoices', 'logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && (t?.admin?.overview || 'Genel Bakış')}
            {tab === 'subscribers' && (t?.admin?.subscribers || 'Aboneler')}
            {tab === 'templates' && (t?.admin?.templates || 'Şablonlar')}
            {tab === 'invoices' && (t?.admin?.invoices || 'Faturalar')}
            {tab === 'logs' && (t?.admin?.logs || 'Sistem Kayıtları')}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">{t?.admin?.recentMembers || 'Son Üyelikler'}</h3>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder={t?.admin?.search || 'Ara...'}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">{t?.admin?.user || 'Kullanıcı'}</th>
                    <th className="px-6 py-3">{t?.admin?.plan || 'Paket'}</th>
                    <th className="px-6 py-3">{t?.admin?.status || 'Durum'}</th>
                    <th className="px-6 py-3 text-right">{t?.admin?.action || 'İşlem'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.slice(0, 5).map((u, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.companyName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {u.plan === SubscriptionPlan.YEARLY ? 'Yıllık Pro' : u.plan === SubscriptionPlan.MONTHLY ? 'Aylık' : 'Ücretsiz'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.isActive
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isActive ? (t?.common?.active || 'Aktif') : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                            <button 
                                onClick={() => handleSendWelcomeEmail(u)}
                                disabled={emailSending[u.id]}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                                    emailSending[u.id] 
                                    ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                                title="Hoş Geldin Maili Gönder"
                            >
                               {emailSending[u.id] ? <Loader2 size={12} className="animate-spin"/> : <Send size={12} />}
                               {emailSending[u.id] ? '...' : 'Mail'}
                            </button>
                            <button onClick={() => handleEditUser(u)} className="text-blue-600 hover:text-blue-900 font-medium text-xs">
                              {t?.common?.edit || 'Düzenle'}
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        Kayıtlı kullanıcı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={20} />
              {t?.admin?.systemActivities || 'Sistem Hareketleri'}
            </h3>
            <div className="space-y-4">
              {recentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    log.type === 'success' ? 'bg-green-100' :
                    log.type === 'warning' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <log.icon size={16} className={
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Tab (Active Management) */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">{t?.admin?.allSubscribers || 'Tüm Aboneler'}</h3>
            <div className="text-sm text-slate-500">
              Toplam: <b>{allUsers.length}</b> Abone
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">{t?.admin?.subscribers || 'Aboneler'}</th>
                  <th className="px-6 py-3">{t?.dashboard?.package || 'Plan'}</th>
                  <th className="px-6 py-3">{t?.common?.confirm || 'Durum'}</th>
                  <th className="px-6 py-3">{t?.nav?.admin || 'Rol'}</th>
                  <th className="px-6 py-3">{t?.common?.edit || 'İşlem'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                      <div className="text-xs text-slate-400">{u.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       {u.plan === SubscriptionPlan.YEARLY ? 'Yıllık Pro' : u.plan === SubscriptionPlan.MONTHLY ? 'Aylık' : 'Ücretsiz'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        {u.role === UserRole.ADMIN ? <b className="text-purple-600">Yönetici</b> : 'Kullanıcı'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button 
                            onClick={() => handleSendWelcomeEmail(u)}
                            disabled={emailSending[u.id]}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition ${
                                emailSending[u.id] 
                                ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                            title="Hoş Geldin Maili Gönder"
                        >
                           {emailSending[u.id] ? <Loader2 size={14} className="animate-spin"/> : <Send size={14} />}
                           {emailSending[u.id] ? '...' : (t?.admin?.sendMail || 'Mail At')}
                        </button>
                        <button 
                            onClick={() => handleEditUser(u)}
                            className="p-1.5 hover:bg-slate-100 rounded transition" 
                            title={t?.common?.edit || "Düzenle"}>
                          <Edit2 size={16} className="text-slate-600" />
                        </button>
                        <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 hover:bg-slate-100 rounded transition text-red-600" 
                            title={t?.common?.delete || "Sil"}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab (Mock for now, but lists nice data) */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">{t?.admin?.documentTemplates || 'Doküman Şablonları'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">{t?.admin?.templateName || 'Şablon Adı'}</th>
                  <th className="px-6 py-3">{t?.admin?.category || 'Kategori'}</th>
                  <th className="px-6 py-3">{t?.admin?.downloads || 'İndirmeler'}</th>
                  <th className="px-6 py-3">{t?.admin?.status || 'Durum'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((template, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{template.name}</td>
                    <td className="px-6 py-4 text-slate-600">{template.category}</td>
                    <td className="px-6 py-4 text-slate-600">{template.downloads}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {template.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Other Tabs (Placeholder) */}
      {(activeTab === 'invoices' || activeTab === 'logs') && (
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
             <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
             <h3 className="text-lg font-medium text-slate-900 mb-2">Henüz Veri Yok</h3>
             <p>Bu modül şu an simülasyon aşamasındadır.</p>
         </div>
      )}

      {/* EDIT USER MODAL */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Edit2 size={18} className="text-blue-600" />
                Kullanıcı Düzenle
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Şirket Adı</label>
                <input 
                  type="text" 
                  value={editingUser.companyName || ''}
                  onChange={e => setEditingUser({...editingUser, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                   <select
                      value={editingUser.plan}
                      onChange={e => setEditingUser({...editingUser, plan: e.target.value as SubscriptionPlan})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                   >
                     <option value={SubscriptionPlan.FREE}>Ücretsiz</option>
                     <option value={SubscriptionPlan.MONTHLY}>Aylık Paket</option>
                     <option value={SubscriptionPlan.YEARLY}>Yıllık Pro</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                   <select
                      value={editingUser.role}
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                   >
                     <option value={UserRole.SUBSCRIBER}>Kullanıcı</option>
                     <option value={UserRole.ADMIN}>Yönetici</option>
                   </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={editingUser.isActive}
                  onChange={e => setEditingUser({...editingUser, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                   Kullanıcı Aktif
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition"
                >
                  {t?.common?.cancel || 'İptal'}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow"
                >
                  {t?.common?.save || 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
