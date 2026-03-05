import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, FileText, Server, 
  LogOut, Menu, X,
  Activity, DollarSign, Upload, Edit3, Trash2, Eye, 
  RefreshCw, Database, Lock, Unlock, CheckCircle,
  Terminal as TerminalIcon, Globe, Key, UserCheck, AlertTriangle, Plus
} from 'lucide-react';
import { User, SubscriptionPlan, UserRole } from '../types';
import { PLANS as DEFAULT_PLANS, SUBSCRIPTION_PLANS } from '../constants';
import { fetchApi } from '../src/utils/api';

// --- Types ---
interface AdminProps {
  user?: User;
  onLogout?: () => void;
}

interface SystemLog {
  id: string;
  timestamp: string;
  time?: string;
  type: 'INFO' | 'ERROR' | 'WARN' | 'SUCCESS' | 'info' | 'error' | 'warning' | 'success'; 
  message?: string;
  details?: string;
  action?: string;
  source: string;
}

// --- Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-card-premium relative overflow-hidden group/card ${className}`}>
    {/* Tech Corner Accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/20 rounded-tl-sm opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/20 rounded-tr-sm opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/20 rounded-bl-sm opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/20 rounded-br-sm opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
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
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[color] || colors.slate} flex items-center gap-1.5 w-fit`}>
      {color === 'emerald' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {children}
    </span>
  );
};

// --- Modals ---

const UserEditModal = ({ user, onClose, onSave, isSelf }: { user: User, onClose: () => void, onSave: (u: Partial<User>) => void, isSelf?: boolean }) => {
    const [formData, setFormData] = useState({...user});

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-lg p-6 animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit3 size={20} className="text-amber-500" />
                        {isSelf ? 'Profilimi Düzenle' : 'Kullanıcı Düzenle'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Ad Soyad</label>
                        <input 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">E-Posta</label>
                        <input 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none mt-1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Rol</label>
                            <select 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                                disabled={isSelf}
                                className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none mt-1 ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value={UserRole.ADMIN}>Yönetici</option>
                                <option value={UserRole.SUBSCRIBER}>Abone</option>
                                <option value={UserRole.GUEST}>Misafir</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Paket</label>
                            <select 
                                value={formData.plan} 
                                onChange={e => setFormData({...formData, plan: e.target.value as SubscriptionPlan})}
                                disabled={isSelf}
                                className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none mt-1 ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {SUBSCRIPTION_PLANS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Kalan Hak</label>
                            <input 
                                type="text"
                                value={formData.remainingDownloads === 'UNLIMITED' ? 'Sınırsız' : formData.remainingDownloads} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({
                                        ...formData, 
                                        remainingDownloads: val.toLowerCase() === 'sınırsız' || val.toLowerCase() === 'unlimited' ? 'UNLIMITED' : parseInt(val) || 0
                                    })
                                }}
                                disabled={isSelf}
                                className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none mt-1 ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Sayı veya 'Sınırsız'"
                            />
                        </div>
                         <div className="flex items-center gap-2 mt-6">
                            <input 
                                type="checkbox" 
                                checked={formData.isActive ?? true}
                                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                disabled={isSelf}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 disabled:opacity-50"
                            />
                            <label className="text-sm text-white">Hesap Aktif</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800">İptal</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg shadow-amber-900/20">Kaydet</button>
                </div>
            </GlassCard>
        </div>
    );
};

const PasswordResetModal = ({ userId, onClose, onSave }: { userId: string, onClose: () => void, onSave: (p: string) => void }) => {
    const [password, setPassword] = useState('');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-sm p-6 animate-in zoom-in duration-300 border-rose-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Key size={20} className="text-rose-500" />
                        Şifre Sıfırla
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                        <p className="text-xs text-rose-200">
                            Bu işlem kullanıcının mevcut şifresini kalıcı olarak değiştirecektir.
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Yeni Şifre</label>
                        <input 
                            type="text"
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-rose-500 outline-none mt-1 font-mono"
                            placeholder="Yeni şifreyi girin..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800">İptal</button>
                    <button 
                        onClick={() => onSave(password)} 
                        disabled={password.length < 6}
                        className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-rose-900/20"
                    >
                        Şifreyi Güncelle
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

const UserViewModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-0 overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-[#0B0F19] p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {(user.name || '?').charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{user.name}</h3>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-6 bg-[#0f172a]/50">
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><UserCheck size={14}/> Hesap Bilgileri</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-400">ID:</span> <span className="text-white font-mono text-xs">{user.id}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Rol:</span> <span className="text-amber-400 font-bold">{user.role}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Durum:</span> 
                                    {user.isActive ? <span className="text-emerald-400">Aktif</span> : <span className="text-rose-400">Pasif</span>}
                                </div>
                                <div className="flex justify-between"><span className="text-slate-400">Ban Durumu:</span> 
                                    {user.isBanned ? <span className="text-rose-500 font-bold">BANLI</span> : <span className="text-emerald-500">Temiz</span>}
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><ShoppingBag size={14}/> Abonelik Detayları</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-400">Paket:</span> <span className="text-indigo-400 font-bold">{user.plan}</span></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Kalan Hak:</span> 
                                    <span className="px-2 py-0.5 bg-slate-800 rounded text-white font-mono">
                                        {user.remainingDownloads === 'UNLIMITED' ? '∞' : user.remainingDownloads}
                                    </span>
                                </div>
                                <div className="flex justify-between"><span className="text-slate-400">Başlangıç:</span> <span className="text-slate-300">{user.subscriptionStartDate || '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Bitiş:</span> <span className="text-slate-300">{user.subscriptionEndDate || '-'}</span></div>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="p-4 bg-[#0B0F19] border-t border-slate-800 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                        Oluşturulma: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};


const NewUserModal = ({ onClose, onSave }: { onClose: () => void, onSave: (u: any) => void }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: UserRole.SUBSCRIBER,
        subscriptionType: 'FREE'
    });

    const isValid = formData.name && formData.email && formData.password.length >= 6;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-lg p-6 animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users size={20} className="text-emerald-500" />
                        Yeni Kullanıcı Oluştur
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Ad Soyad</label>
                        <input 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mt-1 transition-colors"
                            placeholder="Örn: Ahmet Yılmaz"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">E-Posta</label>
                        <input 
                            type="email"
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mt-1 transition-colors"
                            placeholder="ornek@sirket.com"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Şifre</label>
                        <input 
                            type="password"
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mt-1 transition-colors font-mono"
                            placeholder="******"
                        />
                         <p className="text-[10px] text-slate-500 mt-1">* En az 6 karakter olmalıdır.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Rol</label>
                            <select 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mt-1 appearance-none"
                            >
                                <option value={UserRole.ADMIN}>Yönetici</option>
                                <option value={UserRole.SUBSCRIBER}>Abone</option>
                                <option value={UserRole.GUEST}>Misafir</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Paket</label>
                            <select 
                                value={formData.subscriptionType} 
                                onChange={e => setFormData({...formData, subscriptionType: e.target.value as SubscriptionPlan})}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mt-1 appearance-none"
                            >
                                {SUBSCRIPTION_PLANS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">İptal</button>
                    <button 
                        onClick={() => onSave(formData)} 
                        disabled={!isValid}
                        className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-emerald-900/20 transition-all"
                    >
                        Oluştur
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

const BanUserModal = ({ user, onClose, onConfirm }: { user: User, onClose: () => void, onConfirm: (reason: string, duration: number) => void }) => {
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('60'); // Minutes default

    const durationOptions = [
        { label: '1 Saat', value: '60' },
        { label: '6 Saat', value: '360' },
        { label: '24 Saat (1 Gün)', value: '1440' },
        { label: '3 Gün', value: '4320' },
        { label: '1 Hafta', value: '10080' },
        { label: '1 Ay', value: '43200' },
        { label: 'Süresiz (Kalıcı)', value: '0' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-6 animate-in zoom-in duration-300 border-rose-500/30">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Lock size={20} className="text-rose-500" />
                        Kullanıcıyı Yasakla
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>

                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold shrink-0">
                        !
                    </div>
                    <div>
                        <div className="font-bold text-rose-200">Dikkat</div>
                        <p className="text-xs text-rose-300/70">
                            <strong>{user.name}</strong> ({user.email}) sisteme erişimini kaybedecek.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Yasaklama Sebebi</label>
                        <textarea 
                            value={reason} 
                            onChange={e => setReason(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none mt-1 transition-colors min-h-[80px] resize-none"
                            placeholder="Örn: Kötüye kullanım..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Süre</label>
                        <select 
                            value={duration} 
                            onChange={e => setDuration(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none mt-1 appearance-none"
                        >
                            {durationOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">İptal</button>
                    <button 
                        onClick={() => onConfirm(reason || 'Yönetici kararı', parseInt(duration))} 
                        className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2"
                    >
                        <Lock size={16} /> Yasakla
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

// --- Main Admin Component ---

export const AdminPanel: React.FC<AdminProps> = ({ user, onLogout }) => {
  // State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages' | 'templates' | 'system' | 'security'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [bannedIps, setBannedIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper: Logout Wrapper
  const handleAdminLogout = () => {
      if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
          onLogout && onLogout();
      }
  };

  // Modal States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  
  // New Modals
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banModalUser, setBanModalUser] = useState<User | null>(null);


  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Helper: Add Log
  const addLog = (message: string, type: SystemLog['type'] = 'INFO', source = 'AdminPanel') => {
    // Also push to displaying queue if fetched from server doesn't contain it immediately
    // Ideally we rely on server sync
  };

  const fetchLogs = async () => {
      try {
          const res = await fetchApi('/api/logs');
          if (res.ok) {
              const data = await res.json();
              if (data.logs) setSystemLogs(data.logs);
          }
      } catch (e) {}
  };

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Users
      const usersRes = await fetchApi('/api/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(Array.isArray(data) ? data : []);
      }

      // 2. Templates
      const tplRes = await fetchApi('/api/templates');
      if (tplRes.ok) {
        const data = await tplRes.json();
        setTemplates(Array.isArray(data) ? data : []);
      }
      
      // 3. Maintenance Status
      fetchApi('/api/maintenance').then(res => res.json()).then(d => setMaintenanceMode(d.maintenance));

      // 5. Banned IPs
      fetchApi('/api/admin/banned-ips')
        .then(res => res.json())
        .then(d => { if (d.success && d.bannedIps) setBannedIps(d.bannedIps); })
        .catch(() => {});

      // 4. Logs
      fetchLogs();

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
        // Ping server for liveness & logs
        fetchApi('/api/health').catch(() => {});
        fetchLogs();
    }, 5000); // Poll logs every 5s
    return () => clearInterval(interval);
  }, []); 

  const toggleMaintenance = async () => {
      const newState = !maintenanceMode;
      try {
          const res = await fetchApi('/api/maintenance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ enabled: newState })
          });
          if (res.ok) {
              setMaintenanceMode(newState);
              alert(`Bakım modu ${newState ? 'AKTİF' : 'DEVRE DIŞI'}`);
              fetchLogs();
          }
      } catch (e) {
          alert('İşlem başarısız.');
      }
  };

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

  const handleUpdateKey = async (updatedData: Partial<User>) => {
      if (!selectedUser) return;
      try {
          const res = await fetchApi(`/api/users/${selectedUser.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData)
          });
          
          if (res.ok) {
              const updatedUser = await res.json();
              addLog(`User updated: ${selectedUser.email}`, 'SUCCESS');
              loadData(); // Reload to refresh table
              setShowEditModal(false);
              setSelectedUser(null);
          } else {
              alert('Güncelleme başarısız');
          }
      } catch (e) { alert('Güncelleme hatası'); }
  };

  const handlePasswordReset = async (newPassword: string) => {
      if (!passwordModalUser) return;
      try {
          const res = await fetchApi(`/api/users/${passwordModalUser.id}/password`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: newPassword })
          });

          if (res.ok) {
              addLog(`Password reset for: ${passwordModalUser.email}`, 'WARN');
              alert('Şifre başarıyla güncellendi.');
              setShowPasswordModal(false);
              setPasswordModalUser(null);
          } else {
              alert('Şifre güncelleme başarısız.');
          }
      } catch (e) { alert('Hata oluştu.'); }
  };

  const handleCreateUser = async (userData: any) => {
      try {
          const res = await fetchApi('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData)
          });
          
          if (res.ok) {
              const data = await res.json();
              addLog(`New user created: ${userData.email}`, 'SUCCESS');
              setUsers([data.user, ...users]);
              setShowNewUserModal(false);
          } else {
              const err = await res.json();
              alert(err.message || 'Kullanıcı oluşturulamadı.');
          }
      } catch (e) {
          alert('Bir hata oluştu.');
      }
  };

  const handleBanIp = async (ip: string, reason: string) => {
      if(!ip) return false;
      try {
          const res = await fetchApi('/api/admin/banned-ips', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ip, reason })
          });
          
          const d = await res.json();
          if (res.ok && d.success) {
              addLog(`IP Banned: ${ip}`, 'WARN');
              // reload list
              fetchApi('/api/admin/banned-ips').then(r=>r.json()).then(d=>{ if(d.success) setBannedIps(d.bannedIps || [])});
              return true;
          } else {
              alert(d.message || 'Başarısız');
              return false;
          }
      } catch(e) { alert('Hata oluştu'); return false; }
  };

  const handleUnbanIp = async (ip: string) => {
      if(!confirm(`${ip} üzerindeki yasağı kaldırmak istediğinize emin misiniz?`)) return;
      try {
          const res = await fetchApi(`/api/admin/banned-ips/${encodeURIComponent(ip)}`, { method: 'DELETE' });
          if(res.ok) {
               addLog(`IP Unbanned: ${ip}`, 'SUCCESS');
               setBannedIps(prev => prev.filter(x => x.ip !== ip));
          } else {
               alert('Hata oluştu');
          }
      } catch(e) { alert('Hata oluştu'); }
  };

  const handleBanConfirm = async (reason: string, durationMinutes: number) => {
      if (!banModalUser) return;
      try {
          const res = await fetchApi(`/api/users/${banModalUser.id}/ban`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ banReason: reason, durationMinutes })
          });
          
          if (res.ok) {
              addLog(`User banned: ${banModalUser.email} (${reason})`, 'WARN');
              loadData();
              setShowBanModal(false);
              setBanModalUser(null);
          } else {
              alert('Yasaklama işlemi başarısız.');
          }
      } catch (e) {
          alert('Hata oluştu.');
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
                  {systemLogs.length === 0 ? <div className="text-center text-slate-600 my-10">Bağlantı bekleniyor...</div> : null}
                  {systemLogs.slice(0, 15).map((log, i) => (
                    <div key={log.id || i} className="text-xs flex gap-2 border-b border-slate-800/50 pb-2 mb-2 last:border-0 items-start">
                       <span className="text-slate-500 font-mono flex-shrink-0">[{new Date(log.timestamp || log.time || Date.now()).toLocaleTimeString()}]</span>
                       <span className={log.type === 'error' ? 'text-red-400 break-all' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300 break-all'}>
                         <span className="text-amber-500 font-bold mr-1">{(log.action || 'INFO')}:</span>
                         {log.message || log.details}
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
            <button onClick={() => setShowNewUserModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                <Users size={16} /> Yeni Kullanıcı
            </button>
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
                             <button onClick={() => { setSelectedUser(u); setShowViewModal(true); }} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded" title="Detay"><Eye size={16}/></button>
                             <button onClick={() => { setSelectedUser(u); setShowEditModal(true); }} className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded" title="Düzenle"><Edit3 size={16}/></button>
                             <button onClick={() => { setPasswordModalUser(u); setShowPasswordModal(true); }} className="p-1.5 text-purple-500 hover:bg-purple-500/10 rounded" title="Şifre Değiştir"><Key size={16}/></button>
                            {u.isBanned ? (
                                <button onClick={() => handleBanUser(u.id, true)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded" title="Banı Kaldır"><Unlock size={16}/></button>
                            ) : (
                                <button onClick={() => { setBanModalUser(u); setShowBanModal(true); }} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded" title="Yasakla"><Lock size={16}/></button>
                            )}
                            <button onClick={() => deleteUser(u.id)} className="p-1.5 text-slate-500 hover:bg-slate-700 hover:text-white rounded" title="Sil"><Trash2 size={16}/></button>
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
            <GlassCard className="p-6 flex-1 flex items-center gap-4 relative overflow-hidden group">
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Server size={24} />
               </div>
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Sistem Durumu</div>
                  <div className="text-lg font-bold text-white uppercase">{maintenanceMode ? 'Bakımda' : 'Yayında'}</div>
               </div>
               <button 
                onClick={toggleMaintenance}
                className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-xs font-bold transition-all ${maintenanceMode ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
               >
                 {maintenanceMode ? 'Çıkış Yap' : 'Bakım Modu'}
               </button>
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
                <div className="font-mono text-xs text-slate-400">admin@kirbas-terminal: ~ (Live Logs)</div>
             </div>
             <div className="flex-1 p-4 font-mono text-xs text-emerald-500 overflow-y-auto custom-scrollbar bg-black/90 selection:bg-emerald-500/30">
                <div className="mb-2 text-slate-500">Connecting to server stream... OK</div>
                {systemLogs.map((log, i) => (
                   <div key={log.id || i} className="mb-1 leading-relaxed border-b border-slate-800/30 pb-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-blue-500 select-none">[{new Date(log.timestamp || log.time || Date.now()).toLocaleTimeString()}]</span>{' '}
                      <span className="text-purple-400 mx-1 select-none">{(log.source || 'SYS').toUpperCase()}:</span>
                      <span className="text-yellow-500 font-bold mx-1">{(log.action || 'INFO').toUpperCase()}</span>
                      <span className={log.type === 'error' ? 'text-red-500 font-bold' : log.type === 'warning' ? 'text-amber-500' : 'text-slate-300'}>
                         {log.message || log.details}
                      </span>
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

  const SecurityView = () => (
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col p-1 animate-in fade-in duration-300">
         <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <Lock size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white">IP Güvenlik Duvarı</h2>
                  <p className="text-sm text-slate-400">Şüpheli ağ trafiğini engelleyin.</p>
               </div>
            </div>
            
            <button 
                onClick={() => {
                    const ip = prompt('Yasaklanacak IP Adresini Giriniz (IPv4/IPv6):');
                    if(!ip) return;
                    const reason = prompt('Yasaklama Sebebi:');
                    handleBanIp(ip, reason || 'Yönetici tarafından engellendi');
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-rose-900/20 transition-all hover:scale-105"
            >
                <Plus size={18} />
                <span>IP Engelle</span>
            </button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start">
                {bannedIps.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                            <CheckCircle className="text-emerald-500" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Güvenli Bölge</h3>
                        <p className="max-w-md text-center text-slate-400">Şu anda engellenmiş herhangi bir IP adresi bulunmuyor.</p>
                    </div>
                )}
                
                {bannedIps.map((entry: any, i) => (
                    <div key={i} className="group relative bg-[#0f172a] border border-rose-500/20 hover:border-rose-500/60 rounded-xl p-5 transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 font-mono text-sm text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                                <Globe size={14} />
                                {entry.ip}
                            </div>
                            <button 
                                onClick={() => handleUnbanIp(entry.ip)} 
                                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                title="Yasağı Kaldır"
                            >
                                <Unlock size={16} />
                            </button>
                        </div>
                        
                        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 min-h-[60px]">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sebep</div>
                            <div className="text-sm text-slate-300 line-clamp-2" title={entry.reason}>
                                {entry.reason || 'Belirtilmedi'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-auto pt-2 border-t border-slate-800/50">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span>{new Date(entry.bannedAt || Date.now()).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="font-mono opacity-50 font-bold">PERMA</div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
  );


  return (
    <div className="flex h-screen bg-[#02040a] text-white font-sans overflow-hidden fixed inset-0 z-[100]">
      
      {/* --- Cosmic Background Layer --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-premium opacity-[0.2]"></div>
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_100%)] opacity-50"></div>
      </div>
      
      {/* Sidebar - LEFT */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} h-full bg-[#0B0F19]/90 backdrop-blur-md border-r border-slate-800 transition-all duration-300 flex flex-col flex-shrink-0 z-50`}>
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
            <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
               <LogOut size={20} />
               {sidebarOpen && <span className="text-sm font-medium">Güvenli Çıkış</span>}
            </button>
         </div>
      </aside>

      {/* Main Content - RIGHT */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 box-border">
         
         {/* Top Header */}
         <header className="h-20 bg-[#0B0F19]/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 md:px-8 z-40 sticky top-0 shadow-sm transition-all">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-600">
                  <Menu size={20} />
               </button>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden xl:block animate-in fade-in slide-in-from-left-4">
                  {activeTab === 'dashboard' && 'Sistem Kontrol Paneli'}
                  {activeTab === 'users' && 'Kullanıcı Veritabanı'}
                  {activeTab === 'packages' && 'Fiyatlandırma Politikası'}
                  {activeTab === 'templates' && 'Doküman Kütüphanesi'}
                  {activeTab === 'system' && 'Sunucu Terminali'}
                  {activeTab === 'security' && 'Güvenlik Duvarı'}
               </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
               <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all hover:scale-105">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-500 tracking-wider ml-1 hidden sm:inline">ONLINE</span>
               </div>
               
               <div className="relative">
                   <button 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-800 hover:bg-slate-800/50 rounded-lg p-1 md:p-2 transition-colors cursor-pointer outline-none group"
                   >
                      <div className="text-right">
                         <div className="text-xs md:text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                            Menü
                         </div>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold shadow-lg shadow-black/50 group-hover:shadow-amber-900/20 transition-all">
                         <Menu size={20} />
                      </div>
                   </button>
                   
                   {/* Dropdown Menu */}
                   {isProfileMenuOpen && (
                       <>
                           <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                           <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                               <div className="p-4 border-b border-slate-700/50 bg-[#1e293b]/50">
                                   <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Hesap Bilgileri</div>
                                   <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                                   <div className="text-xs text-slate-400 truncate font-mono">{user?.email}</div>
                               </div>
                               <div className="p-2">
                                   <button 
                                       onClick={() => {
                                           if (user) {
                                               setSelectedUser(user);
                                               setShowEditModal(true);
                                               setIsProfileMenuOpen(false);
                                           }
                                       }}
                                       className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm flex items-center gap-3 transition-colors group"
                                   >
                                       <Users size={16} className="text-slate-500 group-hover:text-amber-500 transition-colors" /> 
                                       Profil Bilgilerini Düzenle
                                   </button>
                                   <div className="border-t border-slate-700/50 my-2 mx-1"></div>
                                   <button 
                                        onClick={handleAdminLogout}
                                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-500 text-sm flex items-center gap-3 transition-colors font-medium group"
                                   >
                                       <LogOut size={16} className="text-rose-500/70 group-hover:text-rose-500 transition-colors" /> 
                                       Güvenli Çıkış
                                   </button>
                               </div>
                           </div>
                       </>
                   )}
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
               {activeTab === 'security' && <SecurityView />}
            </div>
         </div>
      </main>

      {/* --- Modals Rendered at Top Level --- */}
      {showEditModal && selectedUser && (
        <UserEditModal 
            user={selectedUser} 
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdateKey}
            isSelf={user?.id === selectedUser.id}
        />
      )}
      
      {showNewUserModal && (
        <NewUserModal
            onClose={() => setShowNewUserModal(false)}
            onSave={handleCreateUser}
        />
      )}
      
      {showBanModal && banModalUser && (
        <BanUserModal
            user={banModalUser}
            onClose={() => setShowBanModal(false)}
            onConfirm={handleBanConfirm}
        />
      )}

      {showViewModal && selectedUser && (
          <UserViewModal 
             user={selectedUser} 
             onClose={() => setShowViewModal(false)}
          />
      )}
      {showPasswordModal && passwordModalUser && (
          <PasswordResetModal 
             userId={passwordModalUser.id} 
             onClose={() => setShowPasswordModal(false)}
             onSave={handlePasswordReset}
          />
      )}
    </div>
  );
};
