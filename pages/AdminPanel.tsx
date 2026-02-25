import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Shield, TrendingUp, Search, MoreHorizontal, Plus, Trash2, Edit2, Download, Activity, X, Check, CheckCircle, AlertCircle, Mail, Send, Loader2, Server, Globe, Cpu, Database, PlayCircle, CreditCard, Save, List } from 'lucide-react';
import { User, UserRole, SubscriptionPlan, DocumentTemplate } from '../types';
import { PLANS as DEFAULT_PLANS, MOCK_TEMPLATES as DEFAULT_TEMPLATES } from '../constants';

interface AdminPanelProps {
  user?: any;
  t?: any;
  currentView?: string;
}

import { fetchApi } from '../src/utils/api';

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, t, currentView }) => {
  // Map global currentView to internal tab
  const getInitialTab = () => {
    switch(currentView) {
      case 'users': return 'subscribers';
      case 'admin-templates': return 'templates'; // Explicit admin templates
      case 'templates': return 'templates';
      case 'admin-packages': return 'packages'; // Explicit admin packages
      case 'packages': return 'packages';
      case 'admin': return 'overview';
      case 'dashboard': return 'overview';
      default: return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Email Notification State
  const [emailSending, setEmailSending] = useState<{ [key: string]: boolean }>({});
  const [emailNotification, setEmailNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Server Monitoring State
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [serverLogs, setServerLogs] = useState<any[]>([]);
  const [isServerOnline, setIsServerOnline] = useState(false);

  // Poll server data
  useEffect(() => {
     const fetchServerData = async () => {
        try {
            const statusRes = await fetchApi('/api/status');
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setServerStatus(statusData);
                setIsServerOnline(true);
            } else {
                setIsServerOnline(false);
            }
            
            const logsRes = await fetchApi('/api/logs');
            if (logsRes.ok) {
                 const logsData = await logsRes.json();
                 setServerLogs(logsData);
            }
        } catch (err) {
            setIsServerOnline(false);
        }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 2500); // 2.5s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (emailNotification) {
      const timer = setTimeout(() => setEmailNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [emailNotification]);

  const handleSendWelcomeEmail = async (targetUser: User) => {
    // Start loading for specific user
    setEmailSending(prev => ({ ...prev, [targetUser.id]: true }));

    try {
        const response = await fetchApi('/api/send-welcome-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipientEmail: targetUser.email,
                recipientName: targetUser.name,
                companyName: targetUser.companyName,
                plan: targetUser.plan
            })
        });

        const data = await response.json();

        if (data.success) {
             setEmailNotification({
                type: 'success',
                message: `Mail başarıyla gönderildi: ${targetUser.email}`
            });
        } else {
             // Fallback to mailto if server is down or returns error
             console.error("Backend error, falling back:", data.message);
             setEmailNotification({
                type: 'error',
                message: `Sunucu hatası: ${data.message || 'Mail gönderilemedi'}.`
            });
        }
    } catch (error) {
        // Backend çalışmıyorsa kullanıcıya bilgi ver
        setEmailNotification({
            type: 'error',
            message: 'Backend sunucusu çalışmıyor (localhost:3001). Node sunucusunu başlattınız mı?'
        });
    } finally {
        setEmailSending(prev => ({ ...prev, [targetUser.id]: false }));
    }
  };

  // Sync tab when currentView changes externally
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [currentView]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalDocs: 0, 
    revenue: 0,
    activeTemplates: 0 
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadData = async () => {
    // Templates
    try {
        const res = await fetchApi('/api/templates');
        if (res.ok) {
            const data = await res.json();
            setTemplates(data || DEFAULT_TEMPLATES);
        } else {
            console.error('Failed to fetch templates');
            setTemplates(DEFAULT_TEMPLATES);
        }
    } catch (e) {
        console.error(e);
        setTemplates(DEFAULT_TEMPLATES);
    }

    // Plans (Still LocalStorage for now)
    const storedPlans = localStorage.getItem('subscriptionPlans');
    if (storedPlans) {
      setSubscriptionPlans(JSON.parse(storedPlans));
    } else {
      // Default initialization
      setSubscriptionPlans(DEFAULT_PLANS);
      localStorage.setItem('subscriptionPlans', JSON.stringify(DEFAULT_PLANS));
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetchApi('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
        
        const activeCount = users.filter((u: any) => u.isActive).length;
        const revenue = users.reduce((acc: number, curr: any) => {
          if (curr.plan === 'YEARLY') return acc + 4999;
          if (curr.plan === 'MONTHLY') return acc + 499;
          return acc;
        }, 0);

        setStats(prev => ({ ...prev, activeUsers: activeCount, revenue }));
      }
    } catch (error) { console.error("Failed to load users", error); }
  };

  useEffect(() => {
    loadData();
    loadUsers();
  }, []);


  // --- BAN SYSTEM ---
  const [banModal, setBanModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({ 
    isOpen: false, userId: '', userName: '' 
  });
  const [banForm, setBanForm] = useState({ reason: '', duration: 'permanent' });

  const handleBanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banModal.userId) return;
    
    try {
        const payload = {
            banReason: banForm.reason,
            durationMinutes: banForm.duration === 'permanent' ? null : parseInt(banForm.duration)
        };
        
        const res = await fetchApi(`/api/users/${banModal.userId}/ban`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Yasaklama başarısız.');
        } 
        
        loadUsers();
        setBanModal({ isOpen: false, userId: '', userName: '' });
        setBanForm({ reason: '', duration: 'permanent' });
    } catch(err) {
        alert(err instanceof Error ? err.message : 'İşlem başarısız.');
    }
  };

  const handleUnbanUser = async (user: User) => {
      if(window.confirm(`${user.name} kullanıcısının yasağını kaldırmak istiyor musunuz?`)) {
        try {
            const res = await fetchApi(`/api/users/${user.id}/unban`, { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'İşlem başarısız');
            }
            loadUsers();
        } catch(e) { 
            console.error(e);
            alert(e instanceof Error ? e.message : 'İşlem başarısız.'); 
        }
      }
  };


  // --- TEMPLATE HANDLERS ---
  const handleEditTemplate = (tpl: DocumentTemplate) => {
    setEditingTemplate(tpl);
    setIsTemplateModalOpen(true);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: Date.now().toString(),
      title: '',
      category: 'ISG',
      description: '',
      isPremium: false,
      fields: []
    });
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = async (id: string) => {
     if(window.confirm(t?.admin?.confirmDelete || 'Bu şablonu silmek istediğinize emin misiniz?')) {
        try {
            const res = await fetchApi(`/api/templates/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id));
            } else {
                alert('Silme işlemi başarısız.');
            }
        } catch (e) {
            console.error(e);
            alert('Silme işlemi başarısız.');
        }
     }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate.id) return;

    try {
        const exists = templates.find(t => t.id === editingTemplate.id);
        if (exists) {
            // Update
            const res = await fetchApi(`/api/templates/${editingTemplate.id}`, {
                method: 'PUT',
                body: JSON.stringify(editingTemplate)
            });
            if (res.ok) {
                const updated = await res.json();
                setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
                setIsTemplateModalOpen(false);
            }
        } else {
            // Create
            const res = await fetchApi('/api/templates', {
                method: 'POST',
                body: JSON.stringify(editingTemplate)
            });
             if (res.ok) {
                const newTpl = await res.json();
                setTemplates(prev => [...prev, newTpl]);
                setIsTemplateModalOpen(false);
            }
        }
    } catch (e) {
        console.error('Template save error:', e);
        alert('Kaydetme başarısız: ' + e);
    }
  };

  // --- PLAN HANDLERS ---
  const handleEditPlan = (plan: any) => {
    setEditingPlan({ ...plan });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    const updated = subscriptionPlans.map(p => p.id === editingPlan.id ? editingPlan : p);
    setSubscriptionPlans(updated);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updated));
    setIsPlanModalOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetchApi(`/api/users/${userId}`, { method: 'DELETE' });
        if (!res.ok) {
           const json = await res.json();
           throw new Error(json.message || 'Silme işlemi başarısız');
        }
        
        // Refresh list
        loadUsers();
      } catch(e) {
        console.error(e);
        alert(e instanceof Error ? e.message : 'Silme işlemi başarısız');
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
        // Send only editable fields to backend
        const payload = {
            name: editingUser.name,
            email: editingUser.email,
            companyName: editingUser.companyName,
            plan: editingUser.plan,
            role: editingUser.role,
            isActive: editingUser.isActive
        };

        const res = await fetchApi(`/api/users/${editingUser.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Güncelleme başarısız');
        }
        
        loadUsers(); // Refresh
        setIsModalOpen(false);
        setEditingUser(null);
        // alert(t?.common?.success || 'Kullanıcı güncellendi');
    } catch(e) {
        console.error(e);
        alert(e instanceof Error ? e.message : 'Güncelleme başarısız');
    }
  };

  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Modal State for Templates & Plans
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DocumentTemplate>>({});
  
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t?.admin?.title || 'Yönetici Paneli'}</h1>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isServerOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isServerOnline ? (t?.admin?.backendActive || 'Backend Sistemleri Aktif') : (t?.admin?.backendOffline || 'Backend Bağlantısı Yok')}
          </p>
        </div>
        <div className="flex gap-2">
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
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.activeUsers}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.activeSubscribers || 'Aktif Abone'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
               <FileText size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalDocs}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.totalDocuments || 'Üretilen Doküman'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
               <DollarSign size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">₺{stats.revenue.toLocaleString()}</h3>
          <p className="text-sm text-slate-600">{t?.admin?.revenue || 'Tahmini Ciro'}</p>
        </div>

        {/* Server Status Mini Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
               <Server size={20} />
            </div>
            <span className={`text-xs font-bold flex items-center ${isServerOnline ? 'text-green-500' : 'text-red-500'}`}>
               {isServerOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{serverStatus ? `${serverStatus.uptime}s` : '--'}</h3>
           <div className="flex justify-between items-end mt-1">
               <p className="text-sm text-slate-600">{t?.admin?.systemUptime || 'Sistem Uptime'}</p>
               <span className="text-xs text-slate-400">{serverStatus ? serverStatus.platform : ''}</span>
           </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto pb-1">
        {['overview', 'subscribers', 'templates', 'packages', 'logs'].map(tab => (
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
            {tab === 'packages' && (t?.admin?.packagesAndPrice || 'Paketler & Fiyat')}
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

          {/* Real System Status Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={20} />
              Sistem Durumu (Canlı)
            </h3>
            
            {isServerOnline && serverStatus ? (
              <div className="space-y-6 flex-1">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Bellek Kullanımı</span>
                        <span className="font-bold text-slate-800">{serverStatus.memoryUsage}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs text-right text-slate-400 mt-1">Total: {serverStatus.totalMemory}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="flex items-center gap-2 text-slate-500 mb-2">
                             <Globe size={16} />
                             <span className="text-xs font-medium">Platform</span>
                         </div>
                         <p className="text-sm font-bold text-slate-800 capitalize">{serverStatus.platform}</p>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="flex items-center gap-2 text-slate-500 mb-2">
                             <Cpu size={16} />
                             <span className="text-xs font-medium">CPU Load</span>
                         </div>
                         <p className="text-sm font-bold text-slate-800">{serverStatus.cpuLoad ? serverStatus.cpuLoad[0].toFixed(2) : '0.00'}%</p>
                     </div>
                 </div>

                 {/* Last Real Logs in Widget */}
                 <div className="flex-1 mt-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Son Loglar</h4>
                     <div className="space-y-2">
                        {serverLogs.slice(0, 3).map((log, idx) => (
                            <div key={idx} className="text-xs flex gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                    log.type === 'error' ? 'bg-red-500' : 
                                    log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                }`}></span>
                                <span className="text-slate-600 truncate flex-1">{log.action}: {log.details || ''}</span>
                            </div>
                        ))}
                        {serverLogs.length === 0 && <p className="text-xs text-slate-400 italic">Henüz log (kayıt) yok.</p>}
                     </div>
                 </div>
              </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle size={32} className="text-red-400 mb-2" />
                    <p className="text-slate-900 font-medium">Sunucu Bağlantısı Yok</p>
                    <p className="text-sm text-slate-500 mt-1">Backend servisinin çalıştığından emin olun.</p>
                </div>
            )}
          </div>
        </div>
      )}

      {/* Subscribers Tab (Active Management) */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div>
                <h3 className="text-lg font-bold text-slate-900">{t?.admin?.allSubscribers || 'Tüm Aboneler'}</h3>
                <div className="text-sm text-slate-500">
                    Toplam: <b>{allUsers.length}</b> Kayıtlı Kullanıcı
                </div>
             </div>
             <button 
                onClick={loadUsers} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium transition"
             >
                <div className="w-4 h-4 animate-spin-slow" style={{ animationDuration: '3s' }}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-1.343 3-3s-1.343-3-3-3m0 6c-1.657 0-3-1.343-3-3s1.343-3 3-3m-9 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3m0-6c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3"/></svg>
                </div>
                Listeyi Yenile
             </button>
          </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                      {u.isBanned ? (
                           <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-red-800 text-white animate-pulse">
                             YASAKLI 🚫
                           </span>
                      ) : (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        {u.role === UserRole.ADMIN ? <b className="text-purple-600">Yönetici</b> : 'Kullanıcı'}
                        {u.isBanned && <div className="text-[10px] text-red-500 max-w-[120px] truncate" title={u.banReason}>{u.banReason}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        {u.role !== UserRole.ADMIN && (
                            <button
                                onClick={() => {
                                    if(u.isBanned) {
                                      handleUnbanUser(u);
                                    } else {
                                      setBanModal({ isOpen: true, userId: u.id, userName: u.name });
                                    }
                                }}
                                className={`p-1.5 hover:bg-slate-100 rounded transition ${u.isBanned ? 'text-green-600 ring-2 ring-green-100 bg-green-50' : 'text-amber-600'}`}
                                title={u.isBanned ? "Yasağı Kaldır" : "Yasakla (Ban)"}
                            >
                                <Shield size={16} fill={u.isBanned ? "currentColor" : "none"}/>
                            </button>
                        )}
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
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">{t?.admin?.documentTemplates || 'Doküman Şablonları'}</h3>
            <button 
                onClick={handleCreateTemplate}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                <Plus size={16} /> {t?.admin?.newTemplateButton || 'Yeni Şablon'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">{t?.admin?.templateName || 'Şablon Adı'}</th>
                  <th className="px-6 py-3">{t?.admin?.category || 'Kategori'}</th>
                  <th className="px-6 py-3">{t?.admin?.type || 'Tür'}</th>
                  <th className="px-6 py-3 text-right">{t?.admin?.action || 'İşlem'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.length > 0 ? (
                  templates.map((template, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {t?.templates?.[`t${template.id}_title`] || template.title}
                        {template.isPremium && <span className="ml-2 inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded border border-amber-200">PRO</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{template.category}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {template.isPremium ? (t?.admin?.premium || 'Premium') : (t?.admin?.standard || 'Standart')}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                             <button onClick={() => handleEditTemplate(template)} className="p-1.5 hover:bg-slate-100 rounded text-blue-600">
                                 <Edit2 size={16} />
                             </button>
                             <button onClick={() => handleDeleteTemplate(template.id)} className="p-1.5 hover:bg-slate-100 rounded text-red-600">
                                 <Trash2 size={16} />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Aktif şablon bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{plan.price} <span className="text-sm text-slate-500 font-normal">{plan.period}</span></p>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <CreditCard size={20} />
                            </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            {plan.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={14} className="text-green-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => handleEditPlan(plan)}
                            className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-2"
                        >
                            <Edit2 size={16} /> Paket Düzenle
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Logs / System Monitoring COMPLETE TAB */}
      {activeTab === 'logs' && (
         <div className="space-y-6">
             {/* Big Status Cards */}
             {isServerOnline ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Memory</p>
                            <h3 className="text-xl font-bold text-slate-900">{serverStatus?.memoryUsage}</h3>
                            <p className="text-xs text-slate-400">of {serverStatus?.totalMemory}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-600 rounded-full">
                            <PlayCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Uptime</p>
                            <h3 className="text-xl font-bold text-slate-900">{serverStatus?.uptime}s</h3>
                            <p className="text-xs text-slate-400">Running smoothly</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">CPU Load</p>
                            <h3 className="text-xl font-bold text-slate-900">{serverStatus?.cpuLoad ? serverStatus.cpuLoad[0].toFixed(2) : '0'}%</h3>
                            <p className="text-xs text-slate-400">1 min avg</p>
                        </div>
                    </div>
                </div>
             ) : (
                 <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800">
                     <AlertCircle size={48} className="mx-auto mb-4" />
                     <h3 className="text-xl font-bold">Sunucu Offline</h3>
                     <p>Verilere erişilemiyor. Lütfen backend servisini başlatın.</p>
                 </div>
             )}

             {/* Logs Table */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Server size={18} />
                        Canlı Sunucu Kayıtları (Live Logs)
                    </h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
                            <tr>
                                <th className="px-6 py-2">Zaman</th>
                                <th className="px-6 py-2">Tür</th>
                                <th className="px-6 py-2">Olay</th>
                                <th className="px-6 py-2">Detay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {serverLogs.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-2 text-slate-500 text-xs">
                                        {new Date(log.time).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            log.type === 'error' ? 'bg-red-100 text-red-700' :
                                            log.type === 'success' ? 'bg-green-100 text-green-700' :
                                            log.type === 'warning' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 font-medium text-slate-700">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-2 text-slate-500 truncate max-w-xs" title={log.details}>
                                        {log.details || '-'}
                                    </td>
                                </tr>
                            ))}
                            {serverLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Log kaydı bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
         </div>
      )}

      {/* Placeholder for invoices only now */}
      {activeTab === 'invoices' && (
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
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta (Kullanıcı Adı)</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
      
      {/* TEMPLATE EDIT/CREATE MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="text-blue-600" />
                        {editingTemplate.id ? 'Şablon Düzenle' : 'Yeni Şablon'}
                    </h3>
                    <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition"><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveTemplate} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Şablon Adı</label>
                        <input type="text" required value={editingTemplate.title || ''} onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Örn: İş Sözleşmesi" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                        <select value={editingTemplate.category || 'contract'} onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="contract">Sözleşme</option>
                            <option value="petition">Dilekçe</option>
                            <option value="official">Resmi Evrak</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                        <textarea value={editingTemplate.description || ''} onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Şablon hakkında kısa bilgi..." />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isPremium" checked={editingTemplate.isPremium || false} onChange={e => setEditingTemplate({...editingTemplate, isPremium: e.target.checked})} className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                        <label htmlFor="isPremium" className="text-sm font-medium text-slate-700">Premium (Ücretli) Şablon</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition">İptal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* PLAN EDIT MODAL */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-600" />
                        Paket Düzenle: {editingPlan.name}
                    </h3>
                    <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition"><X size={20} /></button>
                </div>
                <form onSubmit={handleSavePlan} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fiyat Gösterimi</label>
                        <input type="text" value={editingPlan.price || ''} onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Örn: 499 ₺" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Özellikler (Her satıra bir özellik)</label>
                        <textarea 
                            value={editingPlan.features ? editingPlan.features.join('\n') : ''} 
                            onChange={e => setEditingPlan({...editingPlan, features: e.target.value.split('\n')})} 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                            rows={6}
                            placeholder="Sınırsız Şablon&#10;7/24 Destek"
                        />
                         <p className="text-xs text-slate-500 mt-1">Her yeni özelliği yeni bir satıra yazın.</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="button" onClick={() => setIsPlanModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition">İptal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {/* Ban User Modal */}
      {banModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transform transition-all scale-100">
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Kullanıcıyı Yasakla</h3>
                        <p className="text-sm text-red-600 font-medium">@{banModal.userName}</p>
                    </div>
                    <button 
                        onClick={() => setBanModal({isOpen: false, userId: '', userName: ''})}
                        className="ml-auto text-slate-400 hover:text-slate-600 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleBanSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Yasaklama Sebebi</label>
                        <textarea 
                            required
                            placeholder="Örn: Hizmet şartları ihlali..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none text-slate-700 placeholder-slate-400"
                            rows={3}
                            value={banForm.reason}
                            onChange={e => setBanForm({...banForm, reason: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Süre</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { val: '60', label: '1 Saat' },
                                { val: '1440', label: '1 Gün' },
                                { val: '10080', label: '1 Hafta' },
                                { val: '43200', label: '1 Ay' },
                                { val: 'permanent', label: 'Süresiz' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setBanForm({...banForm, duration: opt.val})}
                                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                                        banForm.duration === opt.val 
                                        ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setBanModal({isOpen: false, userId: '', userName: ''})}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition"
                        >
                            İptal
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-lg shadow-red-200 transition active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Shield size={18} />
                            Yasakla
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
