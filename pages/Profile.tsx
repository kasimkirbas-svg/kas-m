import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Calendar, CreditCard, Download, Edit2, Check, X, Lock, FileText, AlertCircle } from 'lucide-react';
import { Invoice, SubscriptionPlan } from '../types';

interface ProfileProps {
  user?: any;
  t?: any;
  onNavigate?: (view: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, t, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [formData, setFormData] = useState(user ? {
    name: user.name,
    email: user.email,
    companyName: user.companyName
  } : {});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock Invoices - In a real app, fetch from API
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      userId: user?.id || '1',
      invoiceNumber: 'INV001',
      date: new Date().toISOString(),
      amount: user?.plan === 'YEARLY' ? 1200 : 150,
      planType: user?.plan || SubscriptionPlan.FREE,
      status: 'PAID',
      period: 'Şubat 2026'
    }
  ]);

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

  const handleSaveProfile = () => {
    try {
      // Get all users
      const allUsersStr = localStorage.getItem('allUsers');
      let allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
      
      // Update current user in array
      const updatedUsers = allUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...formData } : u
      );
      
      // Update localStorage
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify({ ...user, ...formData }));
      
      // Trigger update in parent if possible, or just notify
      setNotification({ type: 'success', message: t?.profile?.savedSuccessfully || 'Profil bilgileri güncellendi.' });
      setIsEditing(false);
      
      // Force reload to reflect changes (simple way) or rely on parent re-render if props update
      window.location.reload(); 
    } catch (error) {
      setNotification({ type: 'error', message: 'Bir hata oluştu.' });
    }
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ type: 'error', message: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    if (user.password && passwordData.currentPassword !== user.password) {
      setNotification({ type: 'error', message: 'Mevcut şifre yanlış.' });
      return;
    }

    try {
        const allUsersStr = localStorage.getItem('allUsers');
        let allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
        
        const updatedUsers = allUsers.map((u: any) => 
          u.id === user.id ? { ...u, password: passwordData.newPassword } : u
        );
        
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        
        // Update current user in localStorage too to keep session valid
        const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({ ...currentUserData, password: passwordData.newPassword }));

        setNotification({ type: 'success', message: 'Şifre başarıyla değiştirildi.' });
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
        setNotification({ type: 'error', message: 'Şifre değiştirilemedi.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white flex items-center gap-4 shadow-lg">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-blue-100">{user?.email}</p>
          {user?.companyName && (
              <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                  <Building2 size={14} /> {user.companyName}
              </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setShowPasswordChange(false);
            setShowInvoices(false);
          }}
          className="ml-auto px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Edit2 size={18} />
          {isEditing ? (t?.common?.cancel || 'İptal') : (t?.common?.edit || 'Düzenle')}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Profile Information & Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main Content Area */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            
            {/* View Switching Header */}
            <div className="flex border-b border-slate-200 mb-6 space-x-4">
                <button 
                    onClick={() => { setShowPasswordChange(false); setShowInvoices(false); }}
                    className={`pb-2 px-1 font-medium transition ${!showPasswordChange && !showInvoices ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.accountInformation || 'Hesap Bilgileri'}
                </button>
                 <button 
                    onClick={() => { setShowPasswordChange(true); setShowInvoices(false); setIsEditing(false); }}
                    className={`pb-2 px-1 font-medium transition ${showPasswordChange ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.changePassword || 'Şifre Değiştir'}
                </button>
                <button 
                    onClick={() => { setShowInvoices(true); setShowPasswordChange(false); setIsEditing(false); }}
                    className={`pb-2 px-1 font-medium transition ${showInvoices ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.invoices || 'Faturalar'}
                </button>
            </div>

            {/* Content Based on State */}
            {showPasswordChange ? (
                // Password Change Form
                <div className="space-y-4 max-w-md animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-slate-400"/> Şifre Güncelleme
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifre</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                     <div className="pt-4">
                        <button
                            onClick={handleSavePassword}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition w-full md:w-auto"
                        >
                            Şifreyi Güncelle
                        </button>
                    </div>
                </div>
            ) : showInvoices ? (
                // Invoices List
                <div className="space-y-4 animate-fadeIn">
                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-slate-400"/> Ödeme Geçmişi
                    </h2>
                    {invoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Tarih</th>
                                        <th className="px-4 py-3">Fatura No</th>
                                        <th className="px-4 py-3">Tutar</th>
                                        <th className="px-4 py-3">Durum</th>
                                        <th className="px-4 py-3 rounded-r-lg text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoices.map(invoice => (
                                        <tr key={invoice.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-900">
                                                {new Date(invoice.date).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 font-mono">{invoice.invoiceNumber}</td>
                                            <td className="px-4 py-3 text-slate-900 font-medium">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(invoice.amount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Ödendi
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1 justify-end ml-auto">
                                                    <Download size={14} /> İndir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            Henüz fatura bulunmuyor.
                        </div>
                    )}
                </div>
            ) : isEditing ? (
              // Edit Profile Form
              <form className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User size={20} className="text-slate-400"/> Bilgileri Düzenle
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.fullName || 'Ad Soyad'}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.email || 'E-posta'}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t?.profile?.companyName || 'Şirket Adı'}</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Check size={18} />
                    {t?.profile?.saveProfile || 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium flex items-center justify-center gap-2 transition"
                  >
                    <X size={18} />
                    {t?.common?.cancel || 'İptal'}
                  </button>
                </div>
              </form>
            ) : (
              // View Profile Information
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <User size={20} className="text-slate-400"/> Genel Bilgiler
                </h2>
                <div
                  className="pb-4 border-b border-slate-100 flex justify-between items-center group hover:bg-slate-50 p-2 rounded transition">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{t?.profile?.fullName || 'Ad Soyad'}</p>
                    <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
                   </div>
                </div>
                <div className="pb-4 border-b border-slate-100 flex justify-between items-center group hover:bg-slate-50 p-2 rounded transition">
                   <div>
                    <p className="text-sm text-slate-500 mb-1">{t?.profile?.email || 'E-posta'}</p>
                    <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
                  </div>
                </div>
                <div className="p-2 group hover:bg-slate-50 rounded transition">
                  <p className="text-sm text-slate-500 mb-1">{t?.profile?.companyName || 'Şirket Adı'}</p>
                  <p className="text-lg font-semibold text-slate-900">{user?.companyName || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription & Usage Information */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 relative overflow-hidden">
             {/* Decorative blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-2xl"></div>
             
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
              <CreditCard size={20} className="text-purple-600" />
              {t?.profile?.subscription || 'Abonelik'}
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-purple-100">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{t?.profile?.plan || 'Mevcut Paket'}</p>
                <div className="flex items-center justify-between">
                     <p className="text-lg font-bold text-slate-900">
                    {user?.plan === 'YEARLY' ? (t?.profile?.yearlyPro || 'Yıllık Pro') : user?.plan === 'MONTHLY' ? (t?.profile?.monthlyStandard || 'Aylık Standart') : 'Ücretsiz Plan'}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${user?.plan !== 'FREE' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user?.plan}
                    </span>
                </div>
              </div>

               <div className="flex justify-between items-center">
                 <p className="text-sm text-slate-600">{t?.profile?.status || 'Durum'}</p>
                 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user?.isActive ? <Check size={14}/> : <X size={14}/>}
                  {user?.isActive ? (t?.profile?.active || 'Aktif') : 'Pasif'}
                </span>
              </div>
              
              {user?.subscriptionEndDate && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={12}/> 
                      Yenileme: {new Date(user.subscriptionEndDate).toLocaleDateString()}
                  </div>
              )}
            </div>

            {onNavigate && user?.role !== 'ADMIN' && (
                <button 
                  onClick={() => onNavigate('subscription')}
                  className="w-full mt-6 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {user?.plan === 'FREE' ? 'Premium\'a Geç' : 'Planı Yönet'}
                </button>
            )}
          </div>

          {/* Usage Stats Widget */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">{t?.profile?.usageStatistics || 'Hakkım'}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-slate-600">{t?.profile?.downloads || 'İndirme Limiti'}</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {user?.remainingDownloads === 'UNLIMITED' ? (t?.profile?.unlimited || 'Sınırsız') : user?.remainingDownloads}
                  </p>
                </div>
                {user?.remainingDownloads !== 'UNLIMITED' && (
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                          (user?.remainingDownloads || 0) < 5 ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (user?.remainingDownloads / 10) * 100)}%` }} // Assuming 10 is default free limit for visuals
                    ></div>
                  </div>
                )}
                {user?.remainingDownloads !== 'UNLIMITED' && (
                  <p className="text-xs text-slate-400 mt-2">Daha fazla indirme hakkı için paketinizi yükseltin.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
