import React, { useState, useEffect, useRef } from 'react';
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
  const baseStyle = "relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-400/20",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400/20",
    secondary: "bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
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
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fake Data Loader
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API Calls
        setTimeout(() => {
          // Mock Users
          setUsers([
             { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@firma.com', role: 'SUBSCRIBER', plan: 'GOLD', remainingDownloads: 45, isActive: true, companyName: 'Yılmaz İnşaat' } as any,
             { id: '2', name: 'Mehmet Demir', email: 'mehmet@tech.com', role: 'ADMIN', plan: 'PREMIUM', remainingDownloads: 'UNLIMITED', isActive: true, companyName: 'Demir Tech' } as any,
             { id: '3', name: 'Ayşe Kaya', email: 'ayse@mimarlik.com', role: 'SUBSCRIBER', plan: 'STANDART', remainingDownloads: 0, isActive: false, companyName: 'Kaya Mimarlık' } as any,
          ]);
          
          // Mock Logs
          setLogs(Array.from({ length: 15 }).map((_, i) => ({
            id: i.toString(),
            timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
            status: Math.random() > 0.9 ? 500 : 200,
            method: ['GET', 'POST', 'PATCH'][Math.floor(Math.random() * 3)],
            path: ['/api/auth/login', '/api/users', '/api/generate-pdf'][Math.floor(Math.random() * 3)],
            latency: `${Math.floor(Math.random() * 200 + 20)}ms`
          })));

          setLoading(false);
        }, 1000);
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Aylık Gelir (MRR)', value: '₺84,250', trend: '+12.5%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Aktif Kullanıcı', value: '1,248', trend: '+5.2%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Üretilen Doküman', value: '45.2K', trend: '+28%', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Bekleyen Kuyruk', value: '12', trend: '-2', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}>
              <stat.icon size={64} />
            </div>
            <div className="relative z-10">
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
          <div className="z-10 text-center">
            <Activity size={48} className="mx-auto text-amber-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white">Gerçek Zamanlı Trafik Analizi</h3>
            <p className="text-slate-400">Son 24 saatlik API istekleri ve sunucu yükü.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-amber-500" /> Kullanıcı Yönetimi
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya ID ara..." 
              className="bg-[#1e293b] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 w-72"
            />
          </div>
          <GlowButton>Filtrele</GlowButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left border-collapse">
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
            {users.map(u => (
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
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 hover:text-white" title="Kullanıcı Olarak Gör"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-amber-400 hover:text-white" title="Düzenle"><Edit3 size={16} /></button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-rose-400 hover:text-white" title="Engelle"><Lock size={16} /></button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <GlassCard key={i} className="p-6 relative group hover:border-amber-500/30 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold bg-${plan.color}-500/10 text-${plan.color}-500 border border-${plan.color}-500/20`}>
                 {plan.name.charAt(0)}
               </div>
               <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit3 size={16}/></button>
               </div>
             </div>
             
             <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
             <div className="text-sm text-slate-400 mb-6">{plan.limit} İndirme Hakkı</div>
             
             <div className="flex items-baseline gap-1 mb-6">
               <span className="text-3xl font-bold text-amber-400">{plan.price}</span>
               <span className="text-sm text-slate-500">/ay</span>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-800/50">
               {plan.features?.slice(0, 3).map((f: string, j: number) => (
                 <div key={j} className="flex items-center gap-2 text-xs text-slate-300">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                   {f}
                 </div>
               ))}
             </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const SystemView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 h-[calc(100vh-140px)]">
      {/* Logs Terminal */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
         <GlassCard className="flex-1 flex flex-col overflow-hidden border-slate-800">
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
                   <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">LIVE</span>
               </div>
            </div>
            <div className="flex-1 bg-[#0B0F19] p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1">
               {logs.map((log) => (
                 <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded transition-colors group">
                    <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                    <span className={`${log.status === 200 ? 'text-emerald-500' : 'text-red-500'} font-bold w-8`}>{log.status}</span>
                    <span className="text-purple-400 w-12">{log.method}</span>
                    <span className="text-slate-300 flex-1">{log.path}</span>
                    <span className="text-slate-600 text-right w-16 group-hover:text-amber-500 transition-colors">{log.latency}</span>
                 </div>
               ))}
               <div className="animate-pulse text-amber-500">_</div>
            </div>
         </GlassCard>
      </div>

      {/* Control Panel */}
      <div className="space-y-6">
         <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Shield className="text-amber-500" size={20} /> Güvenlik Duvarı
            </h3>
            <div className="space-y-4">
              <div>
                 <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 block">IP Ban (Blacklist)</label>
                 <div className="flex gap-2">
                    <input type="text" placeholder="192.168.1.1" className="bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-red-500" />
                    <button className="bg-red-500/10 border border-red-500/30 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Lock size={18} /></button>
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-800">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Bakım Modu</span>
                    <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer opacity-50">
                       <div className="w-5 h-5 bg-slate-400 rounded-full absolute left-0 top-0 border-2 border-[#1e293b]"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-500">Aktif edildiğinde sadece adminler giriş yapabilir. Tüm kullanıcı oturumları sonlandırılır.</p>
              </div>
            </div>
         </GlassCard>

         <GlassCard className="p-6">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Server className="text-blue-500" size={20} /> Sunucu Kaynakları
            </h3>
            <div className="space-y-4">
               {[
                 { label: 'CPU Kullanımı', val: '42%', color: 'blue' },
                 { label: 'RAM (16GB)', val: '8.4GB', color: 'purple' },
                 { label: 'SSD (Database)', val: '24%', color: 'emerald' },
               ].map((item, i) => (
                  <div key={i}>
                     <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-bold">{item.val}</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-${item.color}-500 w-[${parseInt(item.val)}%] rounded-full`} style={{ width: item.val }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#060910] text-slate-200 overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Sidebar Navigation */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-[#0B0F19] border-r border-[#1F2937] flex flex-col transition-all duration-300 relative z-20`}>
         <div className="h-20 flex items-center justify-center border-b border-[#1F2937]">
            {isSidebarCollapsed ? (
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">K</div>
            ) : (
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white">K</div>
                  <span className="font-bold text-white tracking-tight text-lg">KIRBAŞ <span className="text-amber-500">ADMIN</span></span>
               </div>
            )}
         </div>

         <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Kullanıcılar', icon: Users },
              { id: 'packages', label: 'Paketler & Fiyat', icon: ShoppingBag },
              { id: 'templates', label: 'Doküman Merkezi', icon: FileText },
              { id: 'system', label: 'DevOps & Loglar', icon: Server },
            ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                   activeTab === item.id 
                     ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                     : 'text-slate-400 hover:text-slate-200 hover:bg-[#151b2b]'
                 }`}
               >
                 <item.icon size={22} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
                 {!isSidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                 )}
                 {activeTab === item.id && !isSidebarCollapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]" />
                 )}
               </button>
            ))}
         </nav>

         <div className="p-4 border-t border-[#1F2937]">
             <button onClick={onLogout} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors`}>
                <LogOut size={20} />
                {!isSidebarCollapsed && <span className="font-medium">Çıkış Yap</span>}
             </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#060910] relative">
         {/* Top Header */}
         <header className="h-20 bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#1F2937] flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-colors">
                  <Menu size={20} />
               </button>
               <h2 className="text-xl font-bold text-white capitalize">{
                  activeTab === 'dashboard' ? 'Sistem Özeti' : 
                  activeTab === 'users' ? 'Kullanıcı Listesi' :
                  activeTab === 'packages' ? 'Abonelik Konfigurasyonu' : 
                  activeTab === 'system' ? 'Sunucu Terminali' : 'Doküman Şablonları'
               }</h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#151b2b] rounded-full border border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-emerald-400">SYS:ONLINE</span>
                </div>
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-slate-400 hover:text-white transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B0F19]"></span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold hover:border-amber-500/50 transition-colors cursor-pointer">
                    A
                </div>
            </div>
         </header>

         {/* Scrollable Content */}
         <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            {loading ? (
               <div className="flex items-center justify-center h-full flex-col gap-4">
                  <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                  <span className="text-amber-500 font-mono text-sm animate-pulse">SYSTEM_INITIALIZING...</span>
               </div>
            ) : (
               <>
                 {activeTab === 'dashboard' && <DashboardView />}
                 {activeTab === 'users' && <UsersView />}
                 {activeTab === 'packages' && <PackagesView />}
                 {activeTab === 'system' && <SystemView />}
                 {activeTab === 'templates' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                       <FileText size={64} className="opacity-20" />
                       <p>Şablon Yönetimi Modülü Yapım Aşamasında...</p>
                    </div>
                 )}
               </>
            )}
         </div>
      </main>

    </div>
  );
};

export default AdminPanel;
