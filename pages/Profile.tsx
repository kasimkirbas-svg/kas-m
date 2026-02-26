import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Calendar, CreditCard, Download, Edit2, Check, X, Lock, FileText, AlertCircle, Trash2, LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import { Invoice, SubscriptionPlan } from '../types';
import { fetchApi } from '../src/utils/api';

interface ProfileProps {
  user?: any;
  t?: any;
  onNavigate?: (view: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user: initialUser, t, onNavigate }) => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
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

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDeleteConfirm && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showDeleteConfirm, deleteCountdown]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetchApi('/api/auth/invoices');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    if (showInvoices) {
      fetchInvoices();
    }
  }, [showInvoices, user?.id]);

  useEffect(() => {
    if (initialUser) {
        setUser(initialUser);
        setFormData({
            name: initialUser.name || '',
            email: initialUser.email || '',
            companyName: initialUser.companyName || ''
        });
    }
  }, [initialUser]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
          setNotification({ type: 'success', message: t?.profile?.savedSuccessfully || 'Profil bilgileri güncellendi.' });
          setIsEditing(false);
          
          setUser(prev => ({ ...prev, ...formData }));
          
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          localStorage.setItem('currentUser', JSON.stringify({ ...storedUser, ...formData }));
      } else {
          setNotification({ type: 'error', message: data.message || 'Güncelleme başarısız.' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: 'Sunucu hatası oluştu.' });
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ type: 'error', message: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
        setNotification({ type: 'error', message: 'Şifre en az 6 karakter olmalıdır.' });
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
            setNotification({ type: 'success', message: 'Şifre başarıyla değiştirildi.' });
            setShowPasswordChange(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setNotification({ type: 'error', message: data.message || 'Şifre değiştirilemedi.' });
        }
    } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Sunucu bağlantı hatası.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-2">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl text-white z-50 flex items-center gap-3 animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 border border-slate-800">
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg mx-auto md:mx-0">
             {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10 self-center">
          <h1 className="text-3xl font-black text-white mb-1">{user?.name}</h1>
          <p className="text-slate-400 font-medium mb-4">{user?.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             {user?.companyName && (
                  <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-2">
                      <Building2 size={14} className="text-indigo-400" /> {user.companyName}
                  </span>
              )}
             <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-2 uppercase tracking-wider ${
                 user?.plan === 'PRO' || user?.plan === 'YEARLY' 
                   ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                   : 'bg-slate-800 text-slate-400 border-slate-700'
             }`}>
                {user?.plan === 'FREE' ? 'ÜCRETSİZ PLAN' : 'PREMIUM ÜYE'}
             </span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setShowPasswordChange(false);
            setShowInvoices(false);
          }}
          className="relative z-10 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2 group self-center"
        >
          <Edit2 size={18} className="group-hover:rotate-12 transition-transform" />
          {isEditing ? (t?.common?.cancel || 'İptal') : (t?.common?.edit || 'Düzenle')}
        </button>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Information & Settings */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Main Content Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
            
            {/* View Switching Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-8 space-x-1 pb-4 overflow-x-auto custom-scrollbar">
                <button 
                    onClick={() => { setShowPasswordChange(false); setShowInvoices(false); }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${!showPasswordChange && !showInvoices ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    {t?.profile?.accountInformation || 'Hesap Bilgileri'}
                </button>
                 <button 
                    onClick={() => { setShowPasswordChange(true); setShowInvoices(false); setIsEditing(false); }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${showPasswordChange ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    {t?.profile?.changePassword || 'Şifre Değiştir'}
                </button>
                <button 
                    onClick={() => { setShowInvoices(true); setShowPasswordChange(false); setIsEditing(false); }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${showInvoices ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    {t?.profile?.invoices || 'Faturalar'}
                </button>
            </div>

            {/* Content Based on State */}
            {showPasswordChange ? (
                // Password Change Form
                <div className="space-y-6 max-w-lg animate-fade-in">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                             <Lock size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Şifre Güncelleme</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mevcut Şifre</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Yeni Şifre</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                     <div className="pt-4">
                        <button
                            onClick={handleSavePassword}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Şifreyi Güncelle
                        </button>
                    </div>
                </div>
            ) : showInvoices ? (
                // Invoices List
                <div className="space-y-6 animate-fade-in">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                             <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ödeme Geçmişi</h2>
                    </div>

                    {invoices.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Tarih</th>
                                        <th className="px-6 py-4">Fatura No</th>
                                        <th className="px-6 py-4">Tutar</th>
                                        <th className="px-6 py-4">Durum</th>
                                        <th className="px-6 py-4 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invoices.map(invoice => (
                                        <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                                                {new Date(invoice.date).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-mono">{invoice.invoiceNumber}</td>
                                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-bold">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(invoice.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Ödendi
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 justify-end ml-auto bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors">
                                                    <Download size={14} /> İndir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3 text-slate-400">
                                <FileText size={32} />
                            </div>
                            <p className="font-bold text-slate-600 dark:text-slate-400">Henüz fatura bulunmuyor</p>
                        </div>
                    )}
                </div>
            ) : isEditing ? (
              // Edit Profile Form
              <form className="space-y-6 animate-fade-in max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <User size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bilgileri Düzenle</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t?.profile?.fullName || 'Ad Soyad'}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t?.profile?.email || 'E-posta'}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                    />
                    </div>
                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t?.profile?.companyName || 'Şirket Adı'} <span className="text-xs text-slate-400 font-normal ml-1">(İsteğe Bağlı)</span></label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                    />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Check size={18} />
                    {t?.profile?.saveProfile || 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                  >
                    <X size={18} />
                    {t?.common?.cancel || 'İptal'}
                  </button>
                </div>
              </form>
            ) : (
              // View Profile Information
              <div className="space-y-6 animate-fade-in max-w-2xl">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <User size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Genel Bilgiler</h2>
                </div>

                <div className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t?.profile?.fullName || 'Ad Soyad'}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</p>
                </div>
                
                {!showDeleteConfirm ? (
                        <button 
                            onClick={() => {
                                setShowDeleteConfirm(true);
                                setDeleteCountdown(3);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full md:w-auto justify-center md:justify-start"
                        >
                            <Trash2 size={16} />
                            {t?.profile?.deleteAccount || 'Hesabımı Sil'}
                        </button>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                             <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Hesabınızı silmek üzeresiniz!
                             </h4>
                             <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                             </p>
                             <div className="flex gap-3">
                                 <button
                                    onClick={async () => {
                                        setIsDeleting(true);
                                        try {
                                            const res = await fetchApi('/api/auth/delete-account', { 
                                                method: 'DELETE',
                                                headers: { 
                                                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                                }
                                            });
                                            if (!res.ok) {
                                                const errorData = await res.json();
                                                throw new Error(errorData.message || 'Silme işlemi başarısız.');
                                            }

                                            const data = await res.json();
                                        
                                            if(data.success) {
                                                localStorage.removeItem('authToken');
                                                localStorage.removeItem('currentUser');
                                                localStorage.clear();
                                                window.location.href = '/auth?mode=login';
                                            } else {
                                                setNotification({ type: 'error', message: data.message || 'Hata oluştu.' });
                                                setShowDeleteConfirm(false);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            setNotification({ type: 'error', message: 'Bir hata oluştu.' });
                                            setShowDeleteConfirm(false);
                                        } finally {
                                            setIsDeleting(false);
                                        }
                                    }}
                                    disabled={deleteCountdown > 0 || isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                 >
                                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {deleteCountdown > 0 ? `Bekleyiniz (${deleteCountdown})` : 'Evet, Hesabımı Sil'}
                                 </button>
                                 <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                 >
                                    İptal
                                 </button>
                             </div>
                        </div>
                    )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription & Usage Information */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-slate-800">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
             
            <h3 className="font-black text-white mb-6 flex items-center gap-3 relative z-10 text-xl">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                 <CreditCard size={18} className="text-white" />
              </span>
              {t?.profile?.subscription || 'Abonelik'}
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">{t?.profile?.plan || 'MEVCUT PAKET'}</p>
                <div className="flex flex-col gap-2">
                     <p className="text-2xl font-black text-white">
                        {user?.plan === 'YEARLY' ? (t?.profile?.yearlyPro || 'Yıllık Pro') : user?.plan === 'MONTHLY' ? (t?.profile?.monthlyStandard || 'Aylık Standart') : 'Ücretsiz Plan'}
                    </p>
                    <span className={`self-start px-3 py-1 rounded-lg text-xs font-bold border ${user?.plan !== 'FREE' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                        {user?.plan}
                    </span>
                </div>
              </div>

               <div className="flex justify-between items-center px-2">
                 <p className="font-bold text-slate-400">{t?.profile?.status || 'Durum'}</p>
                 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                  user?.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {user?.isActive ? (t?.profile?.active || 'Aktif') : 'Pasif'}
                </span>
              </div>
              
              {user?.subscriptionEndDate && (
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2 justify-center bg-slate-800/50 py-2 rounded-lg">
                      <Calendar size={14}/> 
                      Yenileme: {new Date(user.subscriptionEndDate).toLocaleDateString()}
                  </div>
              )}
            </div>

            {onNavigate && user?.role !== 'ADMIN' && (
                <button 
                  onClick={() => onNavigate('subscription')}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2"
                >
                  {user?.plan === 'FREE' ? 'Premium\'a Yükselt' : 'Planı Yönet'}
                </button>
            )}
          </div>

          {/* Usage Stats Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">{t?.profile?.usageStatistics || 'Hakkım'}</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-500">{t?.profile?.downloads || 'İndirme Limiti'}</span>
                  <span className="font-black text-slate-900 dark:text-white text-lg">
                    {user?.remainingDownloads === 'UNLIMITED' ? (t?.profile?.unlimited || 'Sınırsız') : user?.remainingDownloads}
                  </span>
                </div>
                {user?.remainingDownloads !== 'UNLIMITED' && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                          (user?.remainingDownloads || 0) < 5 ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (user?.remainingDownloads / 10) * 100)}%` }} 
                    ></div>
                  </div>
                )}
                {user?.remainingDownloads !== 'UNLIMITED' && (
                  <p className="text-xs text-slate-400 mt-2 font-medium">Daha fazla indirme hakkı için paketinizi yükseltin.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
