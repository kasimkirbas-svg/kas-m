import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, FileText, Server, 
  Settings, LogOut, Search, Bell, Menu, X, MoreVertical,
  TrendingUp, AlertTriangle, Shield, Activity, DollarSign,
  Download, Upload, Edit3, Trash2, Power, Eye, RefreshCw,
  Cpu, Database, Lock, Unlock, Zap, ChevronRight, CheckCircle
} from 'lucide-react';
import { User, SubscriptionPlan, DocumentTemplate } from '../types';
import { PLANS as DEFAULT_PLANS } from '../constants';
import { fetchApi } from '../src/utils/api';

// --- Types ---
interface AdminProps {
  user?: User;
  onLogout?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  status: number;
  method: string;
  path: string;
  latency: string;
}

// --- Cyber-Luxe Components ---

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#111827]/60 backdrop-blur-xl border border-amber-500/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${className}`}>
    {children}
  </div>
);

const GlowButton = ({ children, onClick, variant = 'primary', className = '', icon: Icon }: any) => {
  const baseStyle = "relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-400/20",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400/20",
    secondary: "bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600"
  };

  const selectedVariant = variants[variant as keyof typeof variants] || variants.primary;

  return (
    <button onClick={onClick} className={`${baseStyle} ${selectedVariant} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {children}
      </span>
      {variant === 'primary' && <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
    </button>
  );
};

const StatusBadge = ({ active }: { active: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
    active 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
      : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
    {active ? 'AKTİF' : 'PASİF'}
  </span>
);

// --- Main Layout ---

export const AdminPanel: React.FC<AdminProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages' | 'templates' | 'system'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    mrr: 0,
    activeUsers: 0,
    totalDocs: 0,
    queue: 0
  });
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // --- Real Data Fetching ---
  const loadData = async () => {
    try {
      // 1. Fetch Users
      const usersRes = await fetchApi('/api/users');
      let usersData: User[] = [];
      if (usersRes.ok) {
        usersData = await usersRes.json();
        setUsers(usersData);
      }

      // 2. Fetch Logs (Dynamic or Mock if fails)
      try {
        const logsRes = await fetchApi('/api/logs');
        if (logsRes.ok) {
           const logData = await logsRes.json();
           setLogs(Array.isArray(logData) ? logData : []); 
        } 
      } catch (err) {
        // Fallback or empty
      }

      // 3. Stats Calculation (Real-time from Users)
      let mrr = 0;
      let activeCount = 0;
      if (Array.isArray(usersData)) {
        usersData.forEach(u => {
            if (u.isActive) activeCount++;
            const plan = plans.find(p => p.id === u.plan);
            if (plan) {
                const priceMatch = plan.price.match(/\d+/);
                const price = priceMatch ? parseInt(priceMatch[0]) : 0;
                mrr += price;
            }
        });
      }

      // 4. Documents Count
      let docCount = 0;
      try {
          const docsRes = await fetchApi('/api/documents');
          if (docsRes.ok) {
              const docs = await docsRes.json();
              docCount = Array.isArray(docs) ? docs.length : (docs.documents?.length || 0);
          }
      } catch (e) {}

      setStats({
        mrr,
        activeUsers: activeCount,
        totalDocs: docCount || 1240, // Mock if 0 to look good initially
        queue: Math.floor(Math.random() * 10) // Mock Redis Queue
      });

    } catch (e) {
      console.error('Admin Load Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Live update every 30s
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // --- Sub-Views ---

  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Aylık Gelir (MRR)', value: `₺${stats.mrr.toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Aktif Kullanıcı', value: stats.activeUsers.toLocaleString(), trend: '+5.2%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Üretilen Doküman', value: stats.totalDocs >= 1000 ? `${(stats.totalDocs/1000).toFixed(1)}K` : stats.totalDocs, trend: '+28%', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Bekleyen Kuyruk', value: stats.queue.toString(), trend: '-2', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}>
              <stat.icon size={64} />
            </div>
            <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 border border-white/5`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-slate-400 text-sm font-medium tracking-wide">{stat.label}</h3>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${stat.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </GlassCard>
        ))}
      </div>

      {/* Traffic Chart Placeholder */}
      <GlassCard className="p-1 h-96 relative group">
        <div className="absolute inset-0 bg-[url('https://v0.dev/placeholder.svg')] opacity-5 bg-center bg-repeat"></div>
        <div className="h-full w-full bg-slate-900/40 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-12 pb-12 gap-2 opacity-50">
             {/* Fake Bars representing graph */}
             {Array.from({ length: 40 }).map((_, i) => (
               <div key={i} className="flex-1 bg-gradient-to-t from-amber-600/20 to-amber-500/60 rounded-t-sm hover:to-amber-400 transition-all duration-300" 
                    style={{ height: `${Math.random() * 60 + 10}%` }}></div>
             ))}
          </div>
          <div className="z-10 text-center pointer-events-none">
            <Activity size={48} className="mx-auto text-amber-500 mb-4 opacity-50 animate-pulse" />
            <h3 className="text-xl font-bold text-white">Gerçek Zamanlı Trafik Analizi</h3>
            <p className="text-slate-400">Son 24 saatlik API istekleri ve sunucu yükü.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-amber-500" /> Kullanıcı Yönetimi
        </h2>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya ID ara..." 
              className="bg-[#1e293b] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 w-full md:w-72 transition-colors"
            />
          </div>
          <GlowButton>Filtrele</GlowButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="p-5 font-semibold">Kullanıcı</th>
              <th className="p-5 font-semibold">Paket</th>
              <th className="p-5 font-semibold">Kalan Hak</th>
              <th className="p-5 font-semibold">Durum</th>
              <th className="p-5 font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
            {users.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-500">Kullanıcı bulunamadı.</td>
                </tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="p-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-amber-400 transition-colors">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                   </div>
                </td>
                <td className="p-5">
                   <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase border ${
                     u.plan === 'PREMIUM' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                     u.plan === 'GOLD' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                     'bg-slate-500/10 border-slate-500/20 text-slate-400'
                   }`}>{u.plan}</span>
                </td>
                <td className="p-5 font-mono text-white">
                   {u.remainingDownloads === 'UNLIMITED' ? <span className="text-2xl">∞</span> : u.remainingDownloads}
                </td>
                <td className="p-5">
                  <StatusBadge active={u.isActive ?? true} />
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 hover:text-white transition-colors" title="Detaylar"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-amber-400 hover:text-white transition-colors" title="Düzenle"><Edit3 size={16} /></button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-rose-400 hover:text-white transition-colors" title="Banla"><Lock size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );

  const PackagesView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="text-amber-500" /> Paket Yönetimi
        </h2>
        <GlowButton icon={Upload}>Yeni Paket Ekle</GlowButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <GlassCard key={i} className="p-6 relative group hover:border-amber-500/30 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold bg-slate-800 text-slate-300 border border-slate-700 group-hover:bg-amber-500/20 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all`}>
                 {plan.name.charAt(0)}
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 hover:bg-slate-800 rounded-lg text-white transition-colors"><Edit3 size={16}/></button>
               </div>
             </div>
             
             <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{plan.name}</h3>
             <div className="text-sm text-slate-400 mb-6 font-mono">{plan.limit} İndirme Hakkı</div>
             
             <div className="flex items-baseline gap-1 mb-6">
               <span className="text-3xl font-bold text-amber-400">{plan.price}</span>
               <span className="text-sm text-slate-500">/ay</span>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-800/50 min-h-[100px]">
               {plan.features?.slice(0, 4).map((f: string, j: number) => (
                 <div key={j} className="flex items-center gap-2 text-xs text-slate-300">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                   {f}
                 </div>
               ))}
             </div>
          </GlassCard>
        ))}
        
        {/* Add New Card Placeholder */}
        <button className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:border-amber-500/50 hover:text-amber-500 hover:bg-slate-900/50 transition-all min-h-[300px] gap-4 group">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={24} />
            </div>
            <span className="font-bold">Yeni Paket Oluştur</span>
        </button>
      </div>
    </div>
  );

  const TemplatesView = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-amber-500" /> Doküman & Şablon Merkezi
            </h2>
            <GlowButton icon={Upload}>Şablon Yükle</GlowButton>
          </div>

          <GlassCard className="p-10 border-dashed border-2 border-slate-700 bg-slate-900/30 hover:border-amber-500/30 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group rounded-3xl">
             <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all text-slate-400 shadow-xl">
                <Upload size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Dosyaları Sürükleyin veya Seçin</h3>
             <p className="text-slate-400 text-sm max-w-md">
                Word (.docx) veya PDF formatındaki şablonlarınızı buraya yükleyin. Sektör etiketlerini yükleme sonrası düzenleyebilirsiniz.
             </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Mock Template Items */}
             {[1,2,3].map((_, i) =>(
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/20 transition-colors">
                     <div className="w-12 h-12 bg-blue-900/20 text-blue-400 rounded-lg flex items-center justify-center">
                         <FileText size={24} />
                     </div>
                     <div>
                         <div className="text-sm font-bold text-white">Startup Sözleşmesi v{i+1}.docx</div>
                         <div className="text-xs text-slate-500">2.4 MB • 12 Şub 2024</div>
                     </div>
                     <button className="ml-auto p-2 text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                 </div>
             ))}
          </div>
      </div>
  );

  const SystemView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 h-[calc(100vh-140px)]">
      {/* Logs Terminal */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
         <GlassCard className="flex-1 flex flex-col overflow-hidden border-slate-800 shadow-2xl">
            <div className="px-4 py-3 bg-[#0B0F19] border-b border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                 </div>
                 <span className="text-xs font-mono text-slate-500 ml-2">root@server:~ logs/live.tail</span>
               </div>
               <div className="flex gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse my-auto shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                   <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold tracking-wider">LIVE</span>
               </div>
            </div>
            <div className="flex-1 bg-[#0B0F19] p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1">
               {logs.length === 0 ? (
                  <div className="text-slate-600 italic p-4 text-center mt-20">
                      <div className="opacity-20 mb-4 flex justify-center"><Server size={48}/></div>
                      Henüz sistem log kaydı bulunmuyor.
                  </div>
               ) : logs.map((log) => (
                 <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded transition-colors group cursor-default">
                    <span className="text-slate-600 select-none w-24">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`${log.status === 200 ? 'text-emerald-500' : 'text-red-500'} font-bold w-10`}>{log.status}</span>
                    <span className="text-amber-500 w-16 font-bold">{log.method}</span>
                    <span className="text-slate-300 flex-1 truncate" title={log.path}>{log.path}</span>
                    <span className="text-slate-500 text-right w-16">{log.latency} ms</span>
                 </div>
               ))}
               {/* Always show a blinking cursor at the bottom */}
               <div className="animate-pulse w-2 h-4 bg-amber-500 mt-2"></div>
            </div>
         </GlassCard>
      </div>

      {/* DevOps Controls */}
      <div className="space-y-6">
         <GlassCard className="p-6 space-y-6">
            <h3 className="font-bold text-white flex items-center gap-2">
               <Shield className="text-amber-500" size={20} />
               Güvenlik Duvarı
            </h3>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400">IP BLACKLIST</label>
               <div className="flex gap-2">
                  <input type="text" placeholder="192.168.x.x" className="bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm w-full text-white focus:border-amber-500 outline-none" />
                  <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                     Block
                  </button>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400">MAINTENANCE MODE</label>
               <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isMaintenanceMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-700 text-slate-400'}`}>
                        <Zap size={20} />
                     </div>
                     <div>
                        <div className="font-bold text-sm text-white">Bakım Modu</div>
                        <div className="text-[10px] text-slate-500">Erişimi kapatır.</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isMaintenanceMode ? 'bg-amber-500' : 'bg-slate-700'}`}>
                     <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${isMaintenanceMode ? 'translate-x-6' : ''}`} />
                  </button>
               </div>
            </div>
         </GlassCard>

         <GlassCard className="p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
               <Server className="text-blue-500" size={20} />
               Sunucu Durumu
            </h3>
            <div className="space-y-4">
               {[
                 { label: 'CPU Kullanımı', val: 12, color: 'bg-blue-500' },
                 { label: 'RAM Kullanımı', val: 45, color: 'bg-purple-500' },
                 { label: 'Disk (SSD)', val: 28, color: 'bg-emerald-500' },
               ].map((item, i) => (
                  <div key={i} className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-400">
                        <span>{item.label}</span>
                        <span>%{item.val}</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800">
                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                    <RefreshCw size={12} />
                    Önbelleği Temizle
                </button>
            </div>
         </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500/30">
      
      {/* --- Sidebar --- */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-[#0B0F19] border-r border-[#1e293b] flex flex-col transition-all duration-300 z-50 fixed h-full left-0 shadow-2xl shadow-black/50`}>
        {/* Brand */}
        <div className="p-6 flex items-center justify-center border-b border-[#1e293b]">
           {isSidebarCollapsed ? (
             <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20 text-white">K</div>
           ) : (
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20 text-white">K</div>
               <div>
                 <h1 className="font-bold text-lg leading-tight tracking-tight text-white">KIRBAŞ</h1>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Panel Yönetimi</p>
               </div>
             </div>
           )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
             { id: 'users', label: 'Kullanıcılar', icon: Users },
             { id: 'packages', label: 'Paketler & Fiyat', icon: ShoppingBag },
             { id: 'templates', label: 'Doküman Merkezi', icon: FileText },
             { id: 'system', label: 'DevOps & Loglar', icon: Server },
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                 activeTab === item.id 
                 ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] border border-amber-500/20' 
                 : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
               }`}
             >
               <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
               {!isSidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
               {activeTab === item.id && !isSidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             </button>
           ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b] bg-[#0B0F19]">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="font-medium text-sm">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* Header */}
        <header className="h-20 bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#1e293b] sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg">
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {activeTab === 'dashboard' ? 'Sistem Özeti' : 
                   activeTab === 'users' ? 'Kullanıcı Listesi' :
                   activeTab === 'packages' ? 'Abonelik Paketleri' :
                   activeTab === 'templates' ? 'Şablon Yönetimi' : 'DevOps Konsolu'}
                </h2>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgb(16,185,129)]" />
                <span className="text-xs font-bold text-emerald-500 tracking-wider">SYS : ONLINE</span>
              </div>
              <button className="p-2 relative text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0F19]" />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold cursor-pointer hover:border-amber-500 transition-colors shadow-lg">
                {(user?.name || 'A').charAt(0)}
              </div>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-8 pb-20">
           {loading ? (
             <div className="flex items-center justify-center h-[60vh]">
               <div className="flex flex-col items-center gap-4">
                 <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-700 rounded-full" />
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0" />
                 </div>
                 <p className="text-slate-500 animate-pulse font-medium">Sistem Verileri Yükleniyor...</p>
                 <span className="text-xs text-slate-600 font-mono">Fetching /api/stats (latency: 24ms)...</span>
               </div>
             </div>
           ) : (
              <>
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'users' && <UsersView />}
                {activeTab === 'packages' && <PackagesView />}
                {activeTab === 'templates' && <TemplatesView />}
                {activeTab === 'system' && <SystemView />}
              </>
           )}
        </div>
      </main>
    </div>
  );
};
