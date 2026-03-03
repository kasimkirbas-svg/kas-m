import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, FileText, Server, 
  Settings, LogOut, Search, Bell, Menu, X, MoreVertical,
  Activity, DollarSign, Upload, Edit3, Trash2, Power, Eye, 
  RefreshCw, Database, Lock, Unlock, Zap, CheckCircle,
  Terminal as TerminalIcon, Globe
} from 'lucide-react';
import { User, SubscriptionPlan, DocumentTemplate } from '../types';
import { PLANS as DEFAULT_PLANS } from '../constants';
import { fetchApi } from '../src/utils/api';

// --- Types ---
interface AdminProps {
  user?: User;
  onLogout?: () => void;
}

interface SystemLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ERROR' | 'WARN' | 'SUCCESS';
  message: string;
  source: string;
}

// --- Components ---

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#0f172a]/70 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'emerald' }: { children: React.ReactNode, color?: string }) => {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[color] || colors.slate} flex items-center gap-1.5 w-fit`}>
      {color === 'emerald' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {children}
    </span>
  );
};

// --- Main Admin Component ---

export const AdminPanel: React.FC<AdminProps> = ({ user, onLogout }) => {
  // State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages' | 'templates' | 'system'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper: Add Log
  const addLog = (message: string, type: SystemLog['type'] = 'INFO', source = 'AdminPanel') => {
    setSystemLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      message,
      source
    }, ...prev].slice(0, 50));
  };

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    // addLog('Fetching system data...', 'INFO'); // Do not spam log on load
    
    try {
      // 1. Users
      const usersRes = await fetchApi('/api/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        addLog('Failed to load users', 'ERROR');
      }

      // 2. Templates
      const tplRes = await fetchApi('/api/templates');
      if (tplRes.ok) {
        const data = await tplRes.json();
        setTemplates(Array.isArray(data) ? data : []);
      }

      // 3. Health
      fetchApi('/api/health').then(res => {
          if (res.ok) addLog('System health check: OK', 'SUCCESS', 'SYS');
      }).catch(err => addLog(`System health check failed: ${err.message}`, 'ERROR', 'SYS'));

    } catch (err: any) {
      addLog(`System Error: ${err.message}`, 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
        // Ping server for liveness
        fetchApi('/api/health').catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []); 

  // Actions
  const handleBanUser = async (userId: string, isBanned: boolean) => {
    if (!confirm(isBanned ? 'Yasağı kaldırmak istiyor musunuz?' : 'Kullanıcıyı banlamak istediğinize emin misiniz?')) return;
    try {
      const endpoint = isBanned ? `/api/users/${userId}/unban` : `/api/users/${userId}/ban`;
      const res = await fetchApi(endpoint, { method: 'POST' });
      if (res.ok) {
        addLog(`User ${userId} ${isBanned ? 'unbanned' : 'banned'}`, 'WARN');
        loadData();
      } else {
          alert('İşlem başarısız');
      }
    } catch (e) { alert('İşlem başarısız'); }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı kalıcı olarak silmek istiyor musunuz?')) return;
    try {
        const res = await fetchApi(`/api/users/${userId}`, { method: 'DELETE' });
        if (res.ok) {
            setUsers(users.filter(u => u.id !== userId));
            addLog(`User deleted: ${userId}`, 'WARN');
        } else {
            alert('Silme işlemi başarısız.');
        }
    } catch (e) {
        alert('Silme işlemi başarısız.');
    }
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
           <div className="absolute right-0 top-0 p-4 opacity-5"><DollarSign size={64}/></div>
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Toplam Gelir (MRR)</h3>
           <div className="text-3xl font-bold text-white mt-2">₺{users.reduce((acc, u) => {
               if (u.plan === 'PREMIUM') return acc + 250;
               if (u.plan === 'GOLD') return acc + 175;
               if (u.plan === 'STANDART') return acc + 100;
               return acc; 
           }, 0).toLocaleString()}</div>
           <div className="mt-2"><Badge color="emerald">+12% Artış</Badge></div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
           <div className="absolute right-0 top-0 p-4 opacity-5"><Users size={64}/></div>
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Aktif Kullanıcı</h3>
           <div className="text-3xl font-bold text-white mt-2">{users.length}</div>
           <div className="text-xs text-slate-500 mt-1">Son 24 saatte +{(users.length % 5) + 1} yeni</div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
           <div className="absolute right-0 top-0 p-4 opacity-5"><FileText size={64}/></div>
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Şablon Sayısı</h3>
           <div className="text-3xl font-bold text-white mt-2">{templates.length}</div>
           <div className="h-1 w-full bg-slate-800 mt-3 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[70%]" />
           </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
           <div className="absolute right-0 top-0 p-4 opacity-5"><Activity size={64}/></div>
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sistem Yükü</h3>
           <div className="text-3xl font-bold text-emerald-400 mt-2">%12</div>
           <div className="text-xs text-slate-500 mt-1">CPU: Normal / RAM: 4GB</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <GlassCard className="p-6 h-96 flex flex-col">
               <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="text-amber-500" />
                  Canlı Trafik İzleme
               </h3>
               <div className="flex-1 flex items-end gap-1 border-b border-slate-700/50 pb-2">
                  {/* CSS-only Histogram Simulation */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-slate-800 hover:bg-amber-500 transition-colors rounded-t-sm"
                      style={{ height: `${Math.random() * 80 + 10}%` }}
                      title={`Request Load: ${Math.floor(Math.random() * 100)}%`}
                    />
                  ))}
               </div>
               <div className="flex justify-between text-xs text-slate-500 mt-4 font-mono">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:59</span>
               </div>
            </GlassCard>
         </div>

         <div>
            <GlassCard className="p-0 h-96 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-800 font-bold text-white flex justify-between items-center bg-slate-900/50">
                  <span>Son Aktiviteler</span>
                  <Badge color="blue">LOGS</Badge>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {systemLogs.length === 0 ? <div className="text-center text-slate-600 my-10">Kayıt yok.</div> : null}
                  {systemLogs.map(log => (
                    <div key={log.id} className="text-xs flex gap-2 border-b border-slate-800/50 pb-2 mb-2 last:border-0">
                       <span className="text-slate-500 font-mono">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                       <span className={log.type === 'ERROR' ? 'text-red-400' : log.type === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-300'}>
                         {log.message}
                       </span>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h2>
         <div className="flex gap-2">
            <button onClick={loadData} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Reload"><RefreshCw size={18} /></button>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20">Yeni Kullanıcı</button>
         </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400 min-w-[800px]">
            <thead className="bg-[#0f172a] uppercase font-semibold text-xs text-slate-500 sticky top-0">
                <tr>
                    <th className="p-4 border-b border-slate-800">Kullanıcı Adı</th>
                    <th className="p-4 border-b border-slate-800">E-Posta</th>
                    <th className="p-4 border-b border-slate-800">Plan</th>
                    <th className="p-4 border-b border-slate-800">Durum</th>
                    <th className="p-4 border-b border-slate-800 text-right">İşlem</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {users.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Kullanıcı bulunamadı.</td></tr>
                ) : users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-700 group-hover:border-amber-500/50 transition-colors">
                            {u.name?.charAt(0)}
                        </div>
                        {u.name}
                        </td>
                        <td className="p-4 font-mono text-xs">{u.email}</td>
                        <td className="p-4"><Badge color={u.plan === 'PREMIUM' ? 'amber' : u.plan === 'GOLD' ? 'blue' : 'slate'}>{u.plan || 'FREE'}</Badge></td>
                        <td className="p-4">
                        {u.isBanned ? (
                            <Badge color="rose">BANLI</Badge>
                        ) : (
                            <Badge color="emerald">AKTİF</Badge>
                        )}
                        </td>
                        <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            {u.isBanned ? (
                                <button onClick={() => handleBanUser(u.id, true)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded" title="Banı Kaldır"><Unlock size={16}/></button>
                            ) : (
                                <button onClick={() => handleBanUser(u.id, false)} className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded" title="Banla"><Lock size={16}/></button>
                            )}
                            <button onClick={() => deleteUser(u.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded"><Trash2 size={16}/></button>
                        </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </GlassCard>
    </div>
  );

  const PackagesView = () => (
     <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Paket & Abonelik Ayarları</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {plans.map((plan, i) => (
              <GlassCard key={i} className="p-8 border-t-4 border-t-amber-500 hover:bg-slate-800/40 transition-colors">
                 <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                 <div className="my-4 text-3xl font-bold text-amber-500">{plan.price}</div>
                 <ul className="space-y-3 mb-8 min-h-[120px]">
                    {plan.features.map((f: string, j: number) => (
                       <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                          <CheckCircle size={14} className="text-emerald-500" /> {f}
                       </li>
                    ))}
                 </ul>
                 <button className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors border border-slate-700">Düzenle</button>
              </GlassCard>
           ))}
        </div>
     </div>
  );
  
  const TemplatesView = () => (
     <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Şablon Merkezi</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20">
               <Upload size={18} /> Şablon Yükle
            </button>
        </div>
        
        <GlassCard className="p-8 border-dashed border-2 border-slate-700 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 transition-all cursor-pointer group rounded-xl">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:scale-110 transition-transform group-hover:text-white">
              <FileText size={32} />
           </div>
           <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Dosyaları Buraya Sürükleyin</h3>
           <p className="text-slate-500 text-sm mt-2 max-w-sm">
              Desteklenen formatlar: .docx, .pdf. Maksimum dosya boyutu 50MB. Sektörel şablonlar otomatik kategorilenir.
           </p>
        </GlassCard>

        {templates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t: any, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-600 transition-colors">
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-lg">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate" title={t.title}>{t.title}</div>
                        <div className="text-xs text-slate-500">{t.category} • {t.monthlyLimit} Limit</div>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-2 text-slate-500 hover:text-white rounded hover:bg-slate-800"><Edit3 size={16} /></button>
                        <button className="p-2 text-rose-500 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
            </div>
        )}
     </div>
  );
  
  const SystemView = () => (
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-300">
         <div className="flex flex-col md:flex-row gap-4">
            <GlassCard className="p-6 flex-1 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Server size={24} />
               </div>
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Sunucu Adı</div>
                  <div className="text-lg font-bold text-white">KIRBAS-MAIN-V1</div>
               </div>
            </GlassCard>
            <GlassCard className="p-6 flex-1 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <Globe size={24} />
               </div>
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Bölge</div>
                  <div className="text-lg font-bold text-white">TR-Istanbul (e-2)</div>
               </div>
            </GlassCard>
            <GlassCard className="p-6 flex-1 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Database size={24} />
               </div>
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Veritabanı</div>
                  <div className="text-lg font-bold text-white">PostgreSQL 15</div>
               </div>
            </GlassCard>
         </div>

         <GlassCard className="flex-1 overflow-hidden flex flex-col bg-[#0c0c0c] border border-slate-800 shadow-2xl">
             <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#1e1e1e]">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500" />
                   <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="font-mono text-xs text-slate-400">admin@kirbas-terminal: ~</div>
             </div>
             <div className="flex-1 p-4 font-mono text-xs text-emerald-500 overflow-y-auto custom-scrollbar bg-black/90 selection:bg-emerald-500/30">
                <div className="mb-2 text-slate-500">Last login: {new Date().toUTCString()} from 192.168.1.1</div>
                {systemLogs.map(log => (
                   <div key={log.id} className="mb-1 leading-relaxed">
                      <span className="text-blue-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>{' '}
                      <span className="text-slate-600 mx-1">{log.source}:</span>
                      <span className={log.type === 'ERROR' ? 'text-red-500 font-bold' : log.type === 'WARN' ? 'text-amber-500' : 'text-slate-300'}>{log.message}</span>
                   </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-green-500">➜</span>
                   <span className="text-cyan-500">~</span>
                   <span className="w-2 h-4 bg-slate-500 animate-pulse" />
                </div>
             </div>
         </GlassCard>
      </div>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden fixed inset-0 z-[100]">
      
      {/* Sidebar - LEFT */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} h-full bg-[#0B0F19] border-r border-slate-800 transition-all duration-300 flex flex-col flex-shrink-0 z-50`}>
         <div className="h-20 flex items-center justify-center border-b border-slate-800">
            {sidebarOpen ? (
               <div className="flex items-center gap-3 animate-in fade-in">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-900/30">K</div>
                  <span className="font-bold text-lg tracking-tight">KIRBAŞ PANEL</span>
               </div>
            ) : (
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-900/30">K</div>
            )}
         </div>

         <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {[
              { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
              { id: 'users', label: 'Kullanıcılar', icon: Users },
              { id: 'packages', label: 'Paket Yönetimi', icon: ShoppingBag },
              { id: 'templates', label: 'Şablonlar', icon: FileText },
              { id: 'system', label: 'DevOps & Logs', icon: TerminalIcon },
            ].map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-1 ${
                    activeTab === item.id 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-900/20 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                 }`}
               >
                  <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {activeTab === item.id && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />}
               </button>
            ))}
         </nav>

         <div className="p-4 border-t border-slate-800 bg-[#0B0F19]">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
               <LogOut size={20} />
               {sidebarOpen && <span className="text-sm font-medium">Güvenli Çıkış</span>}
            </button>
         </div>
      </aside>

      {/* Main Content - RIGHT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
         
         {/* Top Header */}
         <header className="h-20 bg-[#0B0F19]/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-40 sticky top-0 shadow-sm">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-600">
                  <Menu size={20} />
               </button>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden md:block">
                  {activeTab === 'dashboard' && 'Sistem Kontrol Paneli'}
                  {activeTab === 'users' && 'Kullanıcı Veritabanı'}
                  {activeTab === 'packages' && 'Fiyatlandırma Politikası'}
                  {activeTab === 'templates' && 'Doküman Kütüphanesi'}
                  {activeTab === 'system' && 'Sunucu Terminali'}
               </h1>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-500 tracking-wider ml-1">ONLINE</span>
               </div>
               
               <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                  <div className="text-right hidden md:block">
                     <div className="text-sm font-bold text-white">{user?.name || 'Administrator'}</div>
                     <div className="text-[10px] text-amber-500 font-bold tracking-wider">ROOT ACCESS</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold shadow-lg shadow-black/50">
                     {(user?.name || 'A').charAt(0)}
                  </div>
               </div>
            </div>
         </header>
         
         {/* Content Scroll Area */}
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            {/* Ambient Background Effects */}
            <div className="fixed top-1/2 left-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
            
            <div className="relative z-10 max-w-7xl mx-auto pb-20">
               {loading && (
                   <div className="absolute inset-0 bg-[#020617]/50 z-50 flex items-center justify-center backdrop-blur-sm rounded-2xl min-h-[400px]">
                       <div className="flex flex-col items-center gap-4">
                           <RefreshCw className="animate-spin text-amber-500" size={48} />
                           <span className="text-slate-400 font-mono text-sm animate-pulse">Establishing secure handshake...</span>
                       </div>
                   </div>
               )}

               {activeTab === 'dashboard' && <DashboardView />}
               {activeTab === 'users' && <UsersView />}
               {activeTab === 'packages' && <PackagesView />}
               {activeTab === 'templates' && <TemplatesView />}
               {activeTab === 'system' && <SystemView />}
            </div>
         </div>
      </main>
    </div>
  );
};
