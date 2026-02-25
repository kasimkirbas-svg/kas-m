import React, { useState, useEffect } from 'react';
import { Users, FileText, Building2, DollarSign, Shield, TrendingUp, Search, MoreHorizontal, Plus, Trash2, Edit2, Download, Activity, X, Check, CheckCircle, AlertCircle, Mail, Send, Loader2, Server, Globe, Cpu, Database, PlayCircle, CreditCard, Save, List } from 'lucide-react';
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
      fields: [],
      content: '<div class="print-page">\n  <h1>{{companyName}}</h1>\n  <p>Tarih: {{date}}</p>\n</div>'
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
    <div className="space-y-8 relative font-sans text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
            {t?.admin?.title || 'Yönetici Paneli'}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
             <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${isServerOnline ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isServerOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
             </span>
             <span>•</span>
             <span>v2.4.0 Stable</span>
          </div>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setActiveTab('subscribers')}
                className="px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-xl font-semibold transition-all flex items-center gap-2 group"
            >
                <Users size={18} className="group-hover:scale-110 transition-transform" />
                <span>{t?.admin?.subscribers || 'Aboneleri Yönet'}</span>
            </button>
            <button 
                onClick={() => window.open('http://localhost:3001/api/status', '_blank')}
                className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
            >
                <Activity size={18} />
                <span className="hidden sm:inline">Monitor</span>
            </button>
        </div>
      </div>

       {/* Enhanced Notification Toast */}
      {emailNotification && (
        <div className={`fixed top-6 right-6 p-4 pr-10 rounded-2xl shadow-2xl glass-panel border z-[100] flex items-start gap-4 animate-in slide-in-from-right-4 duration-300 ${
          emailNotification.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100' : 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100'
        }`}>
          <div className={`p-2 rounded-full shrink-0 ${emailNotification.type === 'success' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
            {emailNotification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          </div>
          <div>
             <h4 className="font-bold text-sm tracking-wide">{emailNotification.type === 'success' ? 'BAŞARILI' : 'HATA'}</h4>
             <p className="text-sm opacity-90">{emailNotification.message}</p>
          </div>
          <button onClick={() => setEmailNotification(null)} className="absolute top-4 right-4 text-current opacity-50 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { 
              title: t?.admin?.activeSubscribers || 'Aktif Abone', 
              value: stats.activeUsers, 
              icon: Users, 
              color: 'blue',
              trend: '+12% bu hafta'
            },
            { 
              title: t?.admin?.totalDocuments || 'Üretilen Doküman', 
              value: stats.totalDocs, 
              icon: FileText, 
              color: 'purple',
              trend: '43 bugün'
            },
            { 
              title: t?.admin?.revenue || 'Tahmini Ciro', 
              value: `₺${stats.revenue.toLocaleString()}`, 
              icon: DollarSign, 
              color: 'green',
              trend: 'Hedefin %85\'i'
            },
            {
               title: 'Sistem Uptime',
               value: serverStatus ? `${Math.floor(serverStatus.uptime / 3600)}h ${(serverStatus.uptime % 3600 / 60).toFixed(0)}m` : '--',
               icon: Server,
               color: isServerOnline ? 'indigo' : 'red',
               trend: serverStatus?.platform || 'Unknown'
            }
        ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                   <stat.icon size={80} />
                </div>
                
                <div className="relative z-10">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-400`}>
                      <stat.icon size={24} />
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</h3>
                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                   
                   <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2 text-xs font-semibold">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-green-600 dark:text-green-400">{stat.trend}</span>
                   </div>
                </div>
             </div>
        ))}
      </div>

      {/* Modern Tabs */}
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex flex-wrap gap-1 shadow-sm overflow-x-auto max-w-full">
        {['overview', 'subscribers', 'templates', 'packages', 'logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/10'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab === 'overview' && <Activity size={16} />}
            {tab === 'subscribers' && <Users size={16} />}
            {tab === 'templates' && <FileText size={16} />}
            {tab === 'packages' && <CreditCard size={16} />}
            {tab === 'logs' && <List size={16} />}
            
            <span className="whitespace-nowrap">
                {tab === 'overview' && (t?.admin?.overview || 'Genel Bakış')}
                {tab === 'subscribers' && (t?.admin?.subscribers || 'Aboneler')}
                {tab === 'templates' && (t?.admin?.templates || 'Şablonlar')}
                {tab === 'packages' && (t?.admin?.packagesAndPrice || 'Paketler')}
                {tab === 'logs' && (t?.admin?.logs || 'Loglar')}
            </span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Users Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Users size={18} />
                 </div>
                 <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t?.admin?.recentMembers || 'Son Üyelikler'}</h3>
              </div>
              
              <div className="relativehidden md:block">
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder={t?.admin?.search || 'Kullanıcı Ara...'}
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all w-64 placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-200"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">{t?.admin?.user || 'Kullanıcı'}</th>
                    <th className="px-6 py-4 font-semibold">{t?.admin?.plan || 'Paket'}</th>
                    <th className="px-6 py-4 font-semibold">{t?.admin?.status || 'Durum'}</th>
                    <th className="px-6 py-4 text-right font-semibold">{t?.admin?.action || 'İşlem'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {allUsers.slice(0, 5).map((u, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-200">{u.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Building2 size={10} />
                                    {u.companyName || 'Bireysel'}
                                </div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                             u.plan === SubscriptionPlan.YEARLY 
                             ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/50' 
                             : u.plan === SubscriptionPlan.MONTHLY 
                             ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50' 
                             : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                           {u.plan === SubscriptionPlan.YEARLY ? 'Pro Yıllık' : u.plan === SubscriptionPlan.MONTHLY ? 'Pro Aylık' : 'Ücretsiz'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                            <span className={`text-sm font-medium ${u.isActive ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {u.isActive ? (t?.common?.active || 'Aktif') : 'Pasif'}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleSendWelcomeEmail(u)}
                                disabled={emailSending[u.id]}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
                                    emailSending[u.id] 
                                    ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed dark:bg-indigo-900/20 dark:text-indigo-500' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                }`}
                                title="Hoş Geldin Maili Gönder"
                            >
                               {emailSending[u.id] ? <Loader2 size={12} className="animate-spin"/> : <Send size={12} />}
                               {emailSending[u.id] ? '' : 'Mail'}
                            </button>
                            <button onClick={() => handleEditUser(u)} className="p-1.5 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors">
                              <Edit2 size={16} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                            <Users size={24} className="text-slate-400" />
                        </div>
                        <p>Henüz kayıtlı kullanıcı bulunamadı.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real System Status Widget */}
          <div className="bg-[#0f172a] text-slate-300 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full relative group">
             {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                        <Activity size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Sistem Durumu</h3>
                        <p className="text-xs text-slate-500 font-mono">live_monitor_v1.0</p>
                    </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${isServerOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            
            {isServerOnline && serverStatus ? (
              <div className="p-6 space-y-8 flex-1 relative z-10">
                 {/* Memory Gauge */}
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400 font-medium">Bellek Kullanımı</span>
                        <span className="font-mono text-white ml-auto">{serverStatus.memoryUsage}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '42%' }}></div>
                    </div>
                    <p className="text-[10px] text-right text-slate-500 mt-1.5 font-mono">Total: {serverStatus.totalMemory}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                         <div className="flex items-center gap-2 text-indigo-400 mb-2">
                             <Globe size={16} />
                             <span className="text-xs font-bold uppercase tracking-wider">Platform</span>
                         </div>
                         <p className="text-sm font-bold text-white capitalizing font-mono">{serverStatus.platform}</p>
                     </div>
                     <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                         <div className="flex items-center gap-2 text-pink-400 mb-2">
                             <Cpu size={16} />
                             <span className="text-xs font-bold uppercase tracking-wider">CPU Load</span>
                         </div>
                         <p className="text-sm font-bold text-white font-mono">{serverStatus.cpuLoad ? serverStatus.cpuLoad[0].toFixed(2) : '0.00'}%</p>
                     </div>
                 </div>

                 {/* Terminal Logs */}
                 <div className="flex-1 mt-2">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <List size={10} />
                        Console Logs
                     </h4>
                     <div className="font-mono text-xs space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {serverLogs.slice(0, 4).map((log, idx) => (
                            <div key={idx} className="flex gap-3 text-slate-400 hover:text-slate-200 transition-colors py-0.5">
                                <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
                                    log.type === 'error' ? 'bg-red-500 shadow-red-500/50' : 
                                    log.type === 'success' ? 'bg-green-500 shadow-green-500/50' : 'bg-blue-500 shadow-blue-500/50'
                                } shadow-sm`}></span>
                                <span className="truncate flex-1 opacity-80">
                                   <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                   {log.action}: {log.details || ''}
                                </span>
                            </div>
                        ))}
                        {serverLogs.length === 0 && <p className="text-xs text-slate-600 italic">Reading stream...</p>}
                     </div>
                 </div>
              </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <p className="text-white font-bold text-lg">Bağlantı Kesildi</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Backend servisine erişilemiyor. Lütfen sunucuyu kontrol edin.</p>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                        {editingTemplate.id ? 'Şablon Tasarla' : 'Yeni Şablon Oluştur'}
                    </h3>
                    <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSaveTemplate} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row">
                    {/* LEFT: Metadata & Fields */}
                    <div className="w-full md:w-1/3 p-6 space-y-5 border-r border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Şablon Adı</label>
                            <input type="text" required value={editingTemplate.title || ''} onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="Örn: İş Sözleşmesi" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
                            <select value={editingTemplate.category || 'contract'} onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white">
                                <option value="contract">Sözleşme</option>
                                <option value="petition">Dilekçe</option>
                                <option value="official">Resmi Evrak</option>
                                <option value="other">Diğer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Açıklama</label>
                            <textarea value={editingTemplate.description || ''} onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" rows={3} placeholder="Şablon hakkında kısa bilgi..." />
                        </div>

                        {/* Field Manager */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Değişken Alanlar</label>
                                <button type="button" onClick={() => {
                                    const newField = { key: `field_${Date.now()}`, label: 'Yeni Alan', type: 'text' as const };
                                    setEditingTemplate({...editingTemplate, fields: [...editingTemplate.fields, newField]});
                                }} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 transition">+ Ekle</button>
                             </div>
                             <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                {editingTemplate.fields.map((field, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                                        <div className="flex-1 min-w-0">
                                            <input 
                                              type="text" 
                                              value={field.label} 
                                              onChange={(e) => {
                                                  const newFields = [...editingTemplate.fields];
                                                  newFields[idx].label = e.target.value;
                                                  setEditingTemplate({...editingTemplate, fields: newFields});
                                              }}
                                              className="text-xs font-bold bg-transparent outline-none w-full text-slate-700 dark:text-slate-200"
                                              placeholder="Etiket"
                                            />
                                            <div className="text-[10px] text-slate-400 font-mono truncate">{`{{${field.key}}}`}</div>
                                        </div>
                                        <select 
                                            value={field.type}
                                            onChange={(e) => {
                                                const newFields = [...editingTemplate.fields];
                                                newFields[idx].type = e.target.value as any;
                                                setEditingTemplate({...editingTemplate, fields: newFields});
                                            }}
                                            className="text-[10px] bg-slate-100 dark:bg-slate-700 rounded px-1 py-1 border-none outline-none dark:text-slate-300 w-16"
                                        >
                                            <option value="text">Yazı</option>
                                            <option value="textarea">Uzun</option>
                                            <option value="date">Tarih</option>
                                            <option value="number">Sayı</option>
                                        </select>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                 const newFields = editingTemplate.fields.filter((_, i) => i !== idx);
                                                 setEditingTemplate({...editingTemplate, fields: newFields});
                                            }}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {editingTemplate.fields.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Henüz değişken eklenmedi.</p>}
                             </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <input type="checkbox" id="isPremium" checked={editingTemplate.isPremium || false} onChange={e => setEditingTemplate({...editingTemplate, isPremium: e.target.checked})} className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                            <label htmlFor="isPremium" className="text-sm font-medium text-slate-700 dark:text-slate-300">Premium (Ücretli)</label>
                        </div>
                    </div>

                    {/* RIGHT: HTML Editor */}
                    <div className="w-full md:w-2/3 p-6 flex flex-col bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Şablon İçeriği (HTML)
                                <span className="ml-2 text-xs font-normal text-slate-500 italic">Değişkenleri {'{{degisken}}'} formatında kullanın.</span>
                            </label>
                            <div className="flex gap-1">
                                {['{{companyName}}', '{{date}}', '{{preparedBy}}'].concat(editingTemplate.fields.map(f => `{{${f.key}}}`)).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setEditingTemplate(prev => ({...prev, content: (prev.content || '') + tag }))}
                                        className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 transition-colors cursor-copy"
                                        title="Tıkla ve Ekle"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative rounded-xl border border-slate-300 dark:border-slate-600 overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-900">
                            <textarea
                                value={editingTemplate.content || ''}
                                onChange={e => setEditingTemplate({...editingTemplate, content: e.target.value})}
                                className="w-full h-full p-4 font-mono text-sm bg-transparent outline-none resize-none text-slate-800 dark:text-slate-300"
                                placeholder="<div class='print-page'>
  <h1>{{companyName}}</h1>
  <p>Lütfen içerik giriniz...</p>
</div>"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium rounded-lg transition">İptal</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all transform active:scale-95">Değişiklikleri Kaydet</button>
                        </div>
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
