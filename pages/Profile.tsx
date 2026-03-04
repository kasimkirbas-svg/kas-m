import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building2, Calendar, CreditCard, Download, Edit2, 
  Check, X, Lock, FileText, AlertCircle, Trash2, LogOut, 
  AlertTriangle, Loader2, Shield, Crown, Zap, Activity, Clock,
  FileBadge, History, ChevronRight
} from 'lucide-react';
import { Invoice, GeneratedDocument, SubscriptionPlan } from '../types';
import { fetchApi } from '../src/utils/api';

import { generateInvoicePDF } from '../src/utils/pdfGenerator';

interface ProfileProps {
  user?: any;
  t?: any;
  onNavigate?: (view: string) => void;
}

interface TimelineItem {
  id: string;
  type: 'invoice' | 'document' | 'register' | 'plan_start' | 'update';
  title: string;
  date: string;
  description?: string;
  amount?: number;
}

export const Profile: React.FC<ProfileProps> = ({ user: initialUser, t, onNavigate }) => {
  // Real-Time Data State
  const [user, setUser] = useState(initialUser);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Data
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    companyName: initialUser?.companyName || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account Deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Real-Time Data Fetching ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
        const [userRes, invoicesRes, docsRes] = await Promise.all([
            fetchApi('/api/auth/me'),
            fetchApi('/api/auth/invoices'),
            fetchApi('/api/documents')
        ]);

        const userData = await userRes.json();
        const invoicesData = await invoicesRes.json();
        const docsData = await docsRes.json();

        if (userData.success && userData.user) {
            setUser(userData.user);
            // Update Form Data to Match Real User Data
            setFormData({
                name: userData.user.name || '',
                email: userData.user.email || '',
                companyName: userData.user.companyName || ''
            });

            // Update Local Storage for Session Persistence
            const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
            localStorage.setItem('currentUser', JSON.stringify({ ...stored, ...userData.user }));
        }

        let newInvoices: Invoice[] = [];
        if (invoicesData.success && Array.isArray(invoicesData.invoices)) {
            newInvoices = invoicesData.invoices;
        }
        
        // MERGE LOCAL INVOICES (From PaymentPage)
        const localInvoices = JSON.parse(localStorage.getItem('localInvoices') || '[]');
        if (Array.isArray(localInvoices)) {
            // Avoid duplicates if API returns same ID
            const apiIds = new Set(newInvoices.map(i => i.id));
            const uniqueLocal = localInvoices.filter(i => !apiIds.has(i.id));
            newInvoices = [...uniqueLocal, ...newInvoices];
        }

        // Sort by date desc
        newInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setInvoices(newInvoices);

        let newDocs: GeneratedDocument[] = [];
        // Note: Check if docsData is array directly or inside a property based on API
        if (Array.isArray(docsData)) {
            newDocs = docsData;
        } else if (docsData.documents && Array.isArray(docsData.documents)) {
             newDocs = docsData.documents;
        }
        setDocuments(newDocs);

        // --- Build Real Timeline ---
        const events: TimelineItem[] = [];

        // 1. Account Creation
        if (userData.user?.createdAt) {
            events.push({
                id: 'register',
                type: 'register',
                title: 'Hesap Oluşturuldu',
                date: userData.user.createdAt,
                description: 'Aramıza katıldınız.'
            });
        }

        // 2. Plan Start
        if (userData.user?.subscriptionStartDate) {
             events.push({
                id: 'plan_start',
                type: 'plan_start',
                title: 'Abonelik Başlangıcı',
                date: userData.user.subscriptionStartDate, // Use start date
                description: `${userData.user.plan === 'FREE' ? 'Ücretsiz' : userData.user.plan} plan aktif edildi.`
            });
        }

        // 3. Invoices
        newInvoices.forEach(inv => {
            events.push({
                id: `invoice-${inv.id}`,
                type: 'invoice',
                title: 'Fatura Oluşturuldu',
                date: inv.date,
                description: `#${inv.invoiceNumber} numaralı fatura`,
                amount: inv.amount
            });
        });

        // 4. Documents
        newDocs.forEach(doc => {
            events.push({
                id: `doc-${doc.id}`, // Ensure unique ID
                type: 'document',
                title: 'Doküman Oluşturuldu', // Generic title if generatedAt is used
                date: doc.createdAt || (doc as any).date || new Date().toISOString(),
                description: 'Yeni bir belge hazırlandı.'
            });
        });

        // Sort descending by date
        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTimeline(events); // Keep all events, filter in render

    } catch (err) {
        console.error('Failed to fetch profile data', err);
        setNotification({ type: 'error', message: 'Veriler güncellenemedi.' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []); // Run once on mount

  // Notification Timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Delete Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDeleteConfirm && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showDeleteConfirm, deleteCountdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetchApi('/api/auth/update-profile', {
          method: 'PUT',
          body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
          setNotification({ type: 'success', message: 'Profil başarıyla güncellendi' });
          setIsEditing(false);
          // Re-fetch to ensure sync
          fetchAllData();
      } else {
          setNotification({ type: 'error', message: data.message || 'Güncelleme hatası' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Sunucu hatası oluştu' });
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ type: 'error', message: 'Şifreler eşleşmiyor' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
        setNotification({ type: 'error', message: 'Şifre en az 6 karakter olmalı' });
        return;
    }

    try {
        const response = await fetchApi('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
        });
        const data = await response.json();

        if (data.success) {
            setNotification({ type: 'success', message: 'Şifre başarıyla değiştirildi' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setNotification({ type: 'error', message: data.message || 'Hata oluştu' });
        }
    } catch (err) {
        setNotification({ type: 'error', message: 'Bağlantı hatası' });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
        const res = await fetchApi('/api/auth/delete-account', { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (!res.ok) throw new Error('Silme işlemi başarısız');
        const data = await res.json();
    
        if(data.success) {
            localStorage.clear();
            window.location.href = '/auth?mode=login';
        } else {
            setNotification({ type: 'error', message: data.message || 'Hata oluştu' });
            setShowDeleteConfirm(false);
        }
    } catch (e) {
        setNotification({ type: 'error', message: 'Hata oluştu' });
        setShowDeleteConfirm(false);
    } finally {
        setIsDeleting(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-6 md:p-8 lg:p-12 pb-32">
        <AnimatePresence>
            {notification && (
                <motion.div 
                    initial={{ opacity: 0, y: -50, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-xl border border-white/10 ${
                        notification.type === 'success' 
                        ? 'bg-emerald-500/90 text-white shadow-emerald-500/20' 
                        : 'bg-red-500/90 text-white shadow-red-500/20'
                    }`}
                >
                    <div className="p-1 bg-white/20 rounded-full">
                        {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <span className="font-bold tracking-wide">{notification.message}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* 1. HERO SECTION (Real Data) */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent dark:from-slate-900/40 dark:to-transparent backdrop-blur-2xl border border-white/5 shadow-2xl p-8 md:p-12 mb-12 group">
                {/* Dynamic Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-1000" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                     <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-2xl shadow-indigo-500/30">
                            <div className="w-full h-full rounded-[1.3rem] bg-slate-900 flex items-center justify-center text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 select-none">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 border-4 border-slate-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${user?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}>
                            {user?.isActive ? <Check size={16} className="text-white stroke-[3]" /> : <X size={16} className="text-white stroke-[3]" />}
                        </div>
                     </div>

                     <div className="text-center md:text-left flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4">
                             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {user?.name || 'Yükleniyor...'}
                             </h1>
                             {user?.role && (
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md ${
                                    user.role === 'ADMIN'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                    : 'bg-slate-700/30 text-slate-300 border-slate-600/30'
                                }`}>
                                    {user.role === 'ADMIN' ? <Crown size={14} /> : <User size={14} />}
                                    {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                                </span>
                             )}
                        </div>
                        <p className="text-slate-400 text-lg font-medium flex items-center justify-center md:justify-start gap-2">
                            <Mail size={18} className="text-indigo-400" /> {user?.email}
                        </p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                             {user?.companyName && (
                                 <div className="px-4 py-2 bg-slate-800/50 rounded-xl text-sm font-bold text-slate-300 border border-slate-700/50 flex items-center gap-2">
                                     <Building2 size={16} className="text-indigo-400" /> 
                                     {user.companyName}
                                 </div>
                             )}
                             <div className="px-4 py-2 bg-slate-800/50 rounded-xl text-sm font-bold text-slate-300 border border-slate-700/50 flex items-center gap-2">
                                 <Calendar size={16} className="text-purple-400" /> 
                                 Katılım: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : '-'}
                             </div>
                        </div>
                     </div>

                     {/* Real Usage Stats */}
                     <div className="hidden lg:block relative group/stats">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover/stats:opacity-40 transition duration-500" />
                        <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl w-64">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kalan Hakkınız</span>
                                <Activity size={16} className="text-emerald-400" />
                            </div>
                            <div className="text-3xl font-black text-white mb-2">
                                {user?.remainingDownloads === 'UNLIMITED' ? '∞' : user?.remainingDownloads ?? '-'}
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-1000"
                                    style={{ width: user?.remainingDownloads === 'UNLIMITED' ? '100%' : `${Math.min(100, ((user?.remainingDownloads || 0) / 10) * 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Bu ayki kullanım: %{user?.remainingDownloads === 'UNLIMITED' ? '0' : Math.max(0, 100 - ((user?.remainingDownloads || 0) * 10)).toFixed(0)}</p>
                        </div>
                     </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Navigation/Tabs */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Tab Navigation */}
                    <motion.div variants={itemVariants} className="flex p-1 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md rounded-2xl border border-white/10 dark:border-white/5 shadow-sm relative overflow-x-auto">
                         {[
                            { id: 'profile', label: 'Hesap Bilgileri', icon: User },
                            { id: 'security', label: 'Güvenlik', icon: Lock },
                            { id: 'billing', label: 'Ödeme Geçmişi', icon: FileText }
                         ].map((tab) => (
                             <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as any); setIsEditing(false); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${
                                    activeTab === tab.id 
                                    ? 'text-white' 
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                             >
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-indigo-600/80 dark:bg-indigo-600/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <tab.icon size={16} />
                                    {tab.label}
                                </span>
                             </button>
                         ))}
                    </motion.div>

                    {/* Content Container */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/5 via-white/5 to-transparent dark:from-slate-900/30 dark:via-slate-900/10 dark:to-transparent backdrop-blur-2xl rounded-[2rem] border border-white/5 p-8 shadow-sm min-h-[400px] relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div 
                                    key="profile"  
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }} 
                                    className="space-y-8"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                Profil Detayları
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 mt-1">Kişisel bilgilerinizi anlık olarak buradan yönetebilirsiniz.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                                                isEditing 
                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                                                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                            }`}
                                        >
                                            {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                                            {isEditing ? 'İptal' : 'Düzenle'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">Ad Soyad</label>
                                            {isEditing ? (
                                                <input 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                />
                                            ) : (
                                                <div className="text-lg font-bold text-slate-900 dark:text-white py-2 border-b border-slate-100 dark:border-slate-800">
                                                    {user?.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">E-Posta</label>
                                            <div className="relative">
                                                {isEditing ? (
                                                    <input 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        type="email"
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                    />
                                                ) : (
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                        {user?.email}
                                                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                                                            <Check size={12} /> Doğrulanmış
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-4">
                                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">Şirket Bilgisi</label>
                                            {isEditing ? (
                                                <input 
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    placeholder="Şirket adı giriniz..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                />
                                            ) : (
                                                <div className="text-lg font-bold text-slate-900 dark:text-white py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                                    <Building2 size={20} className="text-slate-400" />
                                                    {user?.companyName || <span className="text-slate-400 italic font-normal">Belirtilmemiş</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end pt-4">
                                            <button 
                                                onClick={handleSaveProfile}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                                            >
                                                <Check size={18} /> Değişiklikleri Kaydet
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Danger Zone */}
                                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4">Tehlikeli Bölge</h3>
                                        {!showDeleteConfirm ? (
                                            <button 
                                                onClick={() => { setShowDeleteConfirm(true); setDeleteCountdown(3); }}
                                                className="w-full md:w-auto px-6 py-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold transition flex items-center gap-2"
                                            >
                                                <Trash2 size={18} /> Hesabımı Kalıcı Olarak Sil
                                            </button>
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }} 
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl h-fit">
                                                        <AlertTriangle className="text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">Emin misiniz?</h4>
                                                        <p className="text-red-600/80 dark:text-red-400/70 mt-1 mb-4 text-sm font-medium">
                                                            Hesabınızı silmek tüm belgelerinizi, fatura geçmişinizi ve kullanıcı verilerinizi kalıcı olarak yok edecektir. Bu işlem geri alınamaz.
                                                        </p>
                                                        <div className="flex gap-3">
                                                            <button 
                                                                onClick={handleDeleteAccount}
                                                                disabled={deleteCountdown > 0 || isDeleting}
                                                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                                            >
                                                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                                {deleteCountdown > 0 ? `Bekleyiniz (${deleteCountdown})` : 'Evet, Sil'}
                                                            </button>
                                                            <button 
                                                                onClick={() => setShowDeleteConfirm(false)}
                                                                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                                            >
                                                                Vazgeç
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div 
                                    key="security" 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }}
                                    className="max-w-xl mx-auto py-4"
                                >
                                     <div className="mb-8 text-center">
                                         <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                                             <Shield size={32} />
                                         </div>
                                         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Şifre Değişikliği</h2>
                                         <p className="text-slate-500 dark:text-slate-400 mt-1">Hesap güvenliğinizi sağlamak için güçlü bir şifre kullanın.</p>
                                     </div>

                                     <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Mevcut Şifre</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-500 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Yeni Şifre</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-500 outline-none transition-all"
                                                    placeholder="En az 6 karakter"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Yeni Şifre (Tekrar)</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-500 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleSavePassword}
                                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-lg"
                                        >
                                            Şifreyi Güncelle
                                        </button>
                                     </div>
                                </motion.div>
                            )}

                            {activeTab === 'billing' && (
                                <motion.div 
                                    key="billing" 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fatura & Ödeme Geçmişi</h2>
                                        <div className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <Loader2 size={40} className="animate-spin mb-4" />
                                            <p className="font-medium animate-pulse">Faturalar yükleniyor...</p>
                                        </div>
                                    ) : invoices.length > 0 ? (
                                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                                        <th className="p-4 pl-6">Tarih</th>
                                                        <th className="p-4">Fatura No</th>
                                                        <th className="p-4">Hizmet</th>
                                                        <th className="p-4">Tutar</th>
                                                        <th className="p-4">Durum</th>
                                                        <th className="p-4 text-right pr-6">İşlem</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                                    {invoices.map((invoice, idx) => (
                                                        <motion.tr 
                                                            key={invoice.id} 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                                                        >
                                                            <td className="p-4 pl-6 font-bold text-slate-700 dark:text-slate-300">
                                                                {new Date(invoice.date).toLocaleDateString('tr-TR')}
                                                            </td>
                                                            <td className="p-4 font-mono text-sm text-slate-500">#{invoice.invoiceNumber}</td>
                                                            <td className="p-4 text-sm font-medium">Premium Üyelik</td>
                                                            <td className="p-4 font-black text-slate-900 dark:text-white">
                                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(invoice.amount)}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ödendi
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right pr-6 flex justify-end gap-2">
                                                                <button
                                                                    onClick={async () => {
                                                                        // Real API Call to send email
                                                                        try {
                                                                            setNotification({ type: 'success', message: 'E-posta gönderiliyor...' });
                                                                            const res = await fetchApi('/api/invoices/send', {
                                                                                method: 'POST',
                                                                                body: JSON.stringify({ 
                                                                                    invoiceId: invoice.id,
                                                                                    email: user?.email,
                                                                                    invoiceData: invoice // Full data in case backend doesn't have it synced yet
                                                                                })
                                                                            });
                                                                            const data = await res.json();
                                                                            if (data.success) {
                                                                                alert(`Fatura #${invoice.invoiceNumber} başarıyla ${user?.email} adresine gönderildi.`);
                                                                            } else {
                                                                                alert('Gönderim başarısız: ' + data.message);
                                                                            }
                                                                        } catch (e) {
                                                                            alert('Sunucu hatası: E-posta gönderilemedi.');
                                                                        }
                                                                    }} 
                                                                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors group-hover:scale-110 active:scale-95"
                                                                    title="E-posta ile Gönder"
                                                                >
                                                                    <Mail size={18} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        // Generate Real PDF
                                                                        generateInvoicePDF(invoice);
                                                                    }}
                                                                    className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 hover:text-indigo-400 rounded-lg transition-colors group-hover:scale-110 active:scale-95 shadow-sm border border-indigo-500/20"
                                                                    title="PDF Olarak İndir"
                                                                >
                                                                    <Download size={18} />
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                                <FileText size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fatura Bulunamadı</h3>
                                            <p className="text-slate-500 text-sm mt-1">Henüz bir ödeme geçmişiniz bulunmuyor.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Right Column - Subscription Card & Real Timeline */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
                     <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/20 backdrop-blur-2xl rounded-[2.5rem] p-8 relative overflow-hidden text-white shadow-2xl border border-white/5 group">
                        {/* Golden/Premium Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-1000" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">Mevcut Plan</p>
                                    <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                        {user?.plan === 'DIAMOND' ? 'DIAMOND' : 
                                         user?.plan === 'GOLD' ? 'GOLD' : 
                                         user?.plan === 'SILVER' ? 'SILVER' : 
                                         user?.plan === 'YEARLY' ? 'Business Pro' : 
                                         user?.plan === 'MONTHLY' ? 'Aylık Standart' : 'Başlangıç Planı'}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <Crown className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" size={24} fill="currentColor" fillOpacity={0.3} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-bold text-slate-400">Durum</span>
                                        <span className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            Aktif
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-400">Yenileme</span>
                                        <span className="text-white font-mono font-medium">
                                            {user?.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'Süresiz'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                                        <span className="text-sm font-bold text-slate-400">Kalan Hak</span>
                                        <span className="text-amber-400 font-mono font-black text-lg drop-shadow-md">
                                            {user?.remainingDownloads === 'UNLIMITED' ? '∞ SINIRSIZ' : user?.remainingDownloads + ' ADET'}
                                        </span>
                                    </div>
                                </div>

                                {user?.role !== 'ADMIN' && (
                                    <button 
                                        onClick={() => onNavigate && onNavigate('subscription')}
                                        className="relative w-full py-4 text-center font-bold text-white rounded-2xl text-lg overflow-hidden group shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient" />
                                        <span className="relative flex items-center justify-center gap-2">
                                            {user?.plan === 'FREE' ? 'Premium\'a Geç' : 'Planı Yükselt'} <Zap size={18} fill="currentColor" />
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                     </div>

                     {/* REAL TIMELINE (Replaced Mock Data) */}
                     <div className="bg-gradient-to-br from-white/5 to-transparent dark:from-slate-900/30 dark:to-transparent backdrop-blur-2xl rounded-[2rem] p-6 border border-white/5 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
                             <History size={20} className="text-indigo-500" />
                             Son Aktiviteler
                        </h3>
                        
                        {loading ? (
                             <div className="flex justify-center p-8">
                                 <Loader2 className="animate-spin text-slate-400" />
                             </div>
                        ) : timeline.length > 0 ? (
                            <div className="relative pl-4 space-y-6 border-l-2 border-slate-200/20 dark:border-white/10">
                                {timeline.slice(0, showAllHistory ? undefined : 5).map((item, idx) => (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative group cursor-default"
                                    >
                                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-md ${
                                            item.type === 'invoice' ? 'bg-emerald-500' :
                                            item.type === 'document' ? 'bg-indigo-500' :
                                            'bg-slate-400'
                                        }`} />
                                        
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium mt-1">
                                                    {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {item.type === 'invoice' && item.amount && (
                                                <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded">
                                                    {item.amount}₺
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                                Henüz bir aktivite yok.
                            </div>
                        )}
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                            <button 
                                onClick={() => setShowAllHistory(!showAllHistory)}
                                className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
                            >
                                {showAllHistory ? 'Daha Az Göster' : 'Tüm Geçmişi Görüntüle'} <ChevronRight size={14} className={`transform transition-transform ${showAllHistory ? '-rotate-90' : 'rotate-0'}`} />
                            </button>
                        </div>
                     </div>
                </motion.div>
            </div>
        </motion.div>
    </div>
  );
};
