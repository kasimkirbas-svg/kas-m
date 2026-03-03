import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, FileText, ShoppingBag, Settings, Activity, 
  Search, Plus, Trash2, Edit2, Save, X, Check, 
  AlertTriangle, Server, Database, TrendingUp, 
  Shield, CreditCard, ChevronRight, LogOut, 
  Download, MoreVertical, RefreshCw, Lock, Unlock,
  Mail, MessageSquare
} from 'lucide-react';
import { User, UserRole, SubscriptionPlan, DocumentTemplate } from '../types';
import { PLANS as DEFAULT_PLANS, MOCK_TEMPLATES } from '../constants';
import { fetchApi } from '../src/utils/api';
import { VisualTemplateBuilder } from '../components/VisualTemplateBuilder';

// --- Types & Interfaces ---

interface AdminPanelProps {
  user?: User;
  onLogout?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

interface ServerStats {
  uptime: number;
  cpu: number;
  memory: number;
  activeConnections: number;
  status: 'online' | 'offline' | 'degraded';
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <Icon size={20} className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-medium text-sm">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-600 transition-all duration-300">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500 mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  </div>
);

// --- Main Admin Panel ---

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'documents' | 'packages' | 'system'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<ServerStats | null>(null);

  // Modals & Editing
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

  // Initial Load
  useEffect(() => {
    loadAllData();
    // Simulate server stats stream
    const interval = setInterval(updateMockStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Users
      const usersRes = await fetchApi('/api/users');
      if (usersRes.ok) setUsers(await usersRes.json());
      
      // 2. Templates
      const tplRes = await fetchApi('/api/templates');
      if (tplRes.ok) setTemplates(await tplRes.json());
      
      // 3. Plans (Check local storage first for overrides)
      const storedPlans = localStorage.getItem('subscriptionPlans');
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      } else {
        setPlans(DEFAULT_PLANS);
      }

      // 4. Mock Logs
      setLogs([
        { id: '1', timestamp: new Date().toISOString(), level: 'info', message: 'System started successfully', source: 'System' },
        { id: '2', timestamp: new Date(Date.now() - 100000).toISOString(), level: 'warn', message: 'High memory usage detected', source: 'Monitor' },
        { id: '3', timestamp: new Date(Date.now() - 500000).toISOString(), level: 'info', message: 'User database synced', source: 'DB' },
      ]);

    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMockStats = () => {
    setStats({
      uptime: Math.floor(performance.now() / 1000),
      cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
      memory: Math.floor(Math.random() * 40) + 20, // 20-60%
      activeConnections: Math.floor(Math.random() * 100) + 50,
      status: 'online'
    });
  };

  // --- Actions ---

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      const res = await fetchApi(`/api/users/${updatedUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedUser)
      });
      
      if (!res.ok) throw new Error('Update failed');
      setEditingUser(null);
    } catch (err) {
      alert('Kullanıcı güncellenemedi' + err);
      loadAllData(); // Revert
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      setUsers(prev => prev.filter(u => u.id !== userId));
      await fetchApi(`/api/users/${userId}`, { method: 'DELETE' });
    } catch (err) {
      loadAllData();
    }
  };

  const handleUpdatePlan = (updatedPlan: any) => {
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlans(newPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(newPlans));
    setEditingPlan(null);
    // Real-world: Should also update all users on this plan if required, 
    // or just new subscriptions. For now, it updates the "offering".
  };

  const handleTemplateSave = async (template: DocumentTemplate) => {
    // Logic to save template to backend
    try {
        const method = template.id && templates.find(t => t.id === template.id) ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `/api/templates/${template.id}` : '/api/templates';
        
        // Mock ID for new templates if needed
        const payload = method === 'POST' ? { ...template, id: `tpl-${Date.now()}` } : template;

        const res = await fetchApi(url, {
            method,
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            loadAllData();
            setIsTemplateBuilderOpen(false);
            setEditingTemplate(null);
        }
    } catch (error) {
        console.error(error);
        alert('Şablon kaydedilemedi.');
    }
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Toplam Kullanıcı" value={users.length} trend={12} color="blue" />
        <StatCard icon={CreditCard} label="Aktif Abonelik" value={users.filter(u => u.plan !== 'FREE').length} trend={8} color="indigo" />
        <StatCard icon={FileText} label="Toplam Şablon" value={templates.length} color="amber" />
        <StatCard icon={Server} label="Sunucu Durumu" value={stats?.status === 'online' ? '%100' : '%0'} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-500" />
            Canlı Sistem İzleme
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
               <div className="text-2xl font-bold text-emerald-400">{stats?.cpu}%</div>
               <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">CPU Kullanımı</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
               <div className="text-2xl font-bold text-blue-400">{stats?.memory}%</div>
               <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">RAM Kullanımı</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
               <div className="text-2xl font-bold text-amber-400">{stats?.activeConnections}</div>
               <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Anlık Bağlantı</div>
            </div>
          </div>
          <div className="h-48 bg-slate-900/50 rounded-xl border border-slate-800 relative overflow-hidden flex items-end px-2">
             {/* Fake Chart Bars */}
             {Array.from({ length: 20 }).map((_, i) => (
                 <div 
                    key={i} 
                    className="flex-1 bg-blue-500/20 mx-1 rounded-t transition-all duration-500 hover:bg-blue-500/40"
                    style={{ height: `${Math.random() * 80 + 10}%` }}
                 ></div>
             ))}
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 flex flex-col">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <AlertTriangle size={20} className="text-amber-500" />
             Son Aktiviteler & Hatalar
           </h3>
           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[300px]">
              {logs.map(log => (
                  <div key={log.id} className="text-sm p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.level === 'error' ? 'bg-red-500/20 text-red-500' : 
                              log.level === 'warn' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>{log.level}</span>
                          <span className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <span className="text-slate-300">{log.message}</span>
                      <span className="text-[10px] text-slate-600">{log.source}</span>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h2>
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Kullanıcı ara..." 
                        className="bg-[#1e293b] border border-slate-700 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 w-64"
                    />
                 </div>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
                     <Plus size={18} /> Yeni Kullanıcı
                 </button>
            </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900/50 text-slate-200 font-medium border-b border-slate-700">
                    <tr>
                        <th className="px-6 py-4">Kullanıcı / Şirket</th>
                        <th className="px-6 py-4">Paket Durumu</th>
                        <th className="px-6 py-4">İndirme Hakkı</th>
                        <th className="px-6 py-4">Rol / Yetki</th>
                        <th className="px-6 py-4">Durum</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-slate-600">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                        {u.companyName && <div className="text-[10px] text-blue-400 mt-0.5">{u.companyName}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                    u.plan === 'PREMIUM' || u.plan === 'YEARLY' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                    u.plan === 'GOLD' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                    {plans.find(p => p.id === u.plan)?.name || u.plan}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-full max-w-[80px] h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${u.remainingDownloads === 'UNLIMITED' ? 'bg-emerald-500 w-full' : 'bg-blue-500'}`}
                                            style={{ width: typeof u.remainingDownloads === 'number' ? `${Math.min(u.remainingDownloads, 100)}%` : '100%' }}
                                        />
                                    </div>
                                    <span className="text-white font-mono font-bold">
                                        {u.remainingDownloads === 'UNLIMITED' ? '∞' : u.remainingDownloads}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-white">{u.role}</span>
                            </td>
                            <td className="px-6 py-4">
                                {u.isBanned ? (
                                    <span className="flex items-center gap-1 text-red-400 text-xs font-bold px-2 py-1 bg-red-500/10 rounded">
                                        <Lock size={12} /> Yasaklı
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded">
                                        <Check size={12} /> Aktif
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingUser(u)}
                                        className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700" title="Düzenle">
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700" title="Sil">
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
  );

  const PackagesView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="text-indigo-400" /> 
            Paket ve Abonelik Ayarları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
                <div key={idx} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-${plan.color || 'slate'}-600`}>
                            {plan.name.charAt(0)}
                        </div>
                        <button 
                            onClick={() => setEditingPlan(plan)}
                            className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <Edit2 size={18} />
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <div className="text-2xl font-bold text-indigo-400 mb-4">{plan.price} <span className="text-sm text-slate-500 font-normal">{plan.period}</span></div>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                            <span className="text-slate-400">İndirme Hakkı</span>
                            <span className="text-white font-bold">{plan.limit === 'UNLIMITED' ? 'Sınırsız' : plan.limit}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                            <span className="text-slate-400">Özellik Sayısı</span>
                            <span className="text-white font-bold">{plan.features?.length || 0}</span>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        {plan.features?.slice(0, 3).map((f: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                <Check size={14} className="text-emerald-500 shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            
            <button className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 transition-all gap-3 min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                    <Plus size={32} />
                </div>
                <span className="font-medium">Yeni Paket Oluştur</span>
            </button>
        </div>
    </div>
  );

  const TemplatesView = () => (
      <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Döküman Şablonları</h2>
            <button 
                onClick={() => {
                    setEditingTemplate({ id: '', title: '', category: 'Genel', description: '', isPremium: false, fields: [] });
                    setIsTemplateBuilderOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
                <Plus size={18} /> Yeni Şablon
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(tpl => (
                  <div key={tpl.id} className="bg-[#1e293b] border border-slate-700 p-4 rounded-xl flex items-start gap-4 group hover:border-slate-500 transition-colors">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate">{tpl.title}</h4>
                          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block mb-1">{tpl.category}</span>
                          <p className="text-xs text-slate-400 line-clamp-2">{tpl.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                          <button 
                             onClick={() => {
                                 setEditingTemplate(tpl);
                                 setIsTemplateBuilderOpen(true);
                             }}
                             className="p-1.5 hover:bg-blue-600 hover:text-white rounded text-slate-500 transition-colors">
                             <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 hover:bg-red-600 hover:text-white rounded text-slate-500 transition-colors">
                             <Trash2 size={16} />
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const SystemView = () => (
      <div className="h-[600px] bg-black rounded-xl border border-slate-800 font-mono text-sm p-4 overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  SYSTEM.LOG
              </span>
              <div className="flex gap-2">
                  <button className="text-slate-500 hover:text-white"><Download size={16} /></button>
                  <button className="text-slate-500 hover:text-white"><RefreshCw size={16} /></button>
              </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded">
                      <span className="text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`uppercase font-bold shrink-0 w-16 ${
                          log.level === 'error' ? 'text-red-500' : 
                          log.level === 'warn' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>{log.level}</span>
                      <span className="text-slate-300">{log.message}</span>
                  </div>
              ))}
              <div className="animate-pulse text-green-500/50">_</div>
          </div>
      </div>
  );

  // --- Modals ---

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800/50 flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Shield className="text-white" size={20} />
             </div>
             <div>
                 <h1 className="font-bold text-white tracking-tight">Admin Paneli</h1>
                 <span className="text-xs text-slate-500 font-mono">v3.0.1 (Stable)</span>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={Activity} label="Genel Bakış" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Users} label="Kullanıcılar" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={FileText} label="Şablonlar" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
          <SidebarItem icon={ShoppingBag} label="Paketler & Fiyat" active={activeTab === 'packages'} onClick={() => setActiveTab('packages')} />
          <SidebarItem icon={Server} label="Sistem & Loglar" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
            <button onClick={onLogout} className="w-full flex items-center gap-2 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <LogOut size={18} />
                <span>Çıkış Yap</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
        
        {/* Header (Top Bar) */}
        <header className="h-16 border-b border-slate-800/50 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
             <div className="flex items-center gap-4">
                 <h2 className="text-lg font-bold text-white capitalize">{
                     activeTab === 'dashboard' ? 'Sistem Özeti' : 
                     activeTab === 'users' ? 'Kullanıcı Yönetimi' :
                     activeTab === 'documents' ? 'Döküman Arşivi' :
                     activeTab === 'packages' ? 'Paket Konfigürasyonu' : 'Sistem İzleme'
                 }</h2>
             </div>
             
             <div className="flex items-center gap-4">
                 <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 relative">
                     <Mail size={18} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                 </button>
                 <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                     <div className="text-right hidden md:block">
                         <div className="text-sm font-bold text-white">{user?.name || 'Sistem Admin'}</div>
                         <div className="text-xs text-emerald-400">Yetkili Erişim</div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-slate-800 shadow-lg flex items-center justify-center text-white font-bold">
                         A
                     </div>
                 </div>
             </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-8 relative">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'users' && <UsersView />}
           {activeTab === 'documents' && <TemplatesView />}
           {activeTab === 'packages' && <PackagesView />}
           {activeTab === 'system' && <SystemView />}
        </div>
      </main>

      {/* --- Edit User Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl animate-scale-in">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Kullanıcı Düzenle</h3>
                  <button onClick={() => setEditingUser(null)}><X className="text-slate-400 hover:text-white" /></button>
              </div>
              <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Ad Soyad</label>
                          <input 
                            type="text" 
                            value={editingUser.name} 
                            onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Şirket</label>
                          <input 
                            type="text" 
                            value={editingUser.companyName || ''} 
                            onChange={e => setEditingUser({...editingUser, companyName: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Abonelik Paketi</label>
                      <select 
                        value={editingUser.plan}
                        onChange={e => setEditingUser({...editingUser, plan: e.target.value as SubscriptionPlan})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none">
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.price})</option>
                            ))}
                      </select>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                          <span>İndirme Hakkı (Sayı veya "UNLIMITED")</span>
                          <span className="text-indigo-400 text-[10px] cursor-pointer" onClick={() => setEditingUser({...editingUser, remainingDownloads: 100})}>+100 Ekle</span>
                      </label>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editingUser.remainingDownloads === 'UNLIMITED' ? 'UNLIMITED' : editingUser.remainingDownloads} 
                            onChange={e => {
                                const val = e.target.value;
                                setEditingUser({
                                    ...editingUser, 
                                    remainingDownloads: val === 'UNLIMITED' ? 'UNLIMITED' : parseInt(val) || 0
                                });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none font-mono"
                          />
                          <button 
                            onClick={() => setEditingUser({...editingUser, remainingDownloads: 'UNLIMITED'})}
                            className={`px-3 rounded-lg border text-xs font-bold ${editingUser.remainingDownloads === 'UNLIMITED' ? 'bg-indigo-600 text-white border-indigo-500' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                            ∞
                          </button>
                      </div>
                      <p className="text-[10px] text-slate-500">* Burada yapacağınız değişiklik kullanıcıya anında yansır.</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50 mt-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                                type="checkbox" 
                                checked={editingUser.isBanned || false} 
                                onChange={e => setEditingUser({...editingUser, isBanned: e.target.checked})}
                                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-red-500 focus:ring-red-500"
                            />
                           <span className="text-sm font-medium text-red-400">Kullanıcıyı Yasakla</span>
                       </label>
                  </div>
              </div>
              <div className="p-6 border-t border-slate-700 bg-slate-800/30 flex justify-end gap-3 rounded-b-2xl">
                  <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">İptal</button>
                  <button onClick={() => handleUpdateUser(editingUser)} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95">Değişiklikleri Kaydet</button>
              </div>
           </div>
        </div>
      )}

      {/* --- Edit Plan Modal --- */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl animate-fade-in-up">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white">Paket Düzenle: {editingPlan.name}</h3>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Paket Adı</label>
                         <input 
                            value={editingPlan.name} 
                            onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                         />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fiyat</label>
                            <input 
                                value={editingPlan.price} 
                                onChange={e => setEditingPlan({...editingPlan, price: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">İndirme Limiti</label>
                            <input 
                                value={editingPlan.limit} 
                                onChange={e => setEditingPlan({...editingPlan, limit: e.target.value === 'UNLIMITED' ? 'UNLIMITED' : Number(e.target.value)})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                            />
                        </div>
                     </div>
                </div>
                <div className="p-6 border-t border-slate-700 bg-slate-800/30 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={() => setEditingPlan(null)} className="px-4 py-2 rounded-xl text-slate-400">İptal</button>
                    <button onClick={() => handleUpdatePlan(editingPlan)} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Kaydet</button>
                </div>
            </div>
        </div>
      )}

      {/* --- Template Builder Modal --- */}
      {isTemplateBuilderOpen && (
          <div className="fixed inset-0 z-[60] bg-black">
              {editingTemplate && (
                <VisualTemplateBuilder 
                   initialTemplate={editingTemplate}
                   onSave={handleTemplateSave}
                   onClose={() => {
                       setIsTemplateBuilderOpen(false);
                       setEditingTemplate(null);
                   }}
                />
              )}
          </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <RefreshCw className="animate-spin text-white" size={48} />
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
