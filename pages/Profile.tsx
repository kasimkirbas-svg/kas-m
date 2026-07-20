import React from 'react';
import { User, SubscriptionPlan, UserRole } from '../types';
import { Button } from '../components/Button';
import { User as UserIcon, Mail, Building, CreditCard, Download, ShieldCheck, Phone, BriefcaseBusiness, MapPin } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const isUnlimited = user.remainingDownloads === 'UNLIMITED';
  const totalLimit = user.plan === SubscriptionPlan.MONTHLY ? 30 : 1000;
  const used = isUnlimited ? 0 : 30 - (user.remainingDownloads as number);
  const percentage = isUnlimited ? 100 : Math.round((used / totalLimit) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Profil ve Üyelik</h2>
        <p className="text-slate-500 dark:text-slate-400">Hesap durumunuzu ve abonelik detaylarınızı inceleyin.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/90 dark:bg-[#242821]/90 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm text-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <UserIcon size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400">
              {user.role === UserRole.ADMIN ? 'Yönetici' : 'Aktif Abone'}
            </div>
            
            <div className="mt-6 text-left space-y-3">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Building size={16} className="mr-3 text-slate-400" />
                {user.companyName || 'Firma bilgisi girilmedi'}
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Mail size={16} className="mr-3 text-slate-400" />
                {user.email}
              </div>
              {user.phone && <div className="flex items-center text-sm text-slate-600 dark:text-slate-300"><Phone size={16} className="mr-3 text-slate-400" />{user.phone}</div>}
              {user.profession && <div className="flex items-center text-sm text-slate-600 dark:text-slate-300"><BriefcaseBusiness size={16} className="mr-3 text-slate-400" />{user.profession}</div>}
              {user.taxNumber && <div className="flex items-center text-sm text-slate-600 dark:text-slate-300"><ShieldCheck size={16} className="mr-3 text-slate-400" />Vergi No: {user.taxNumber}</div>}
              {user.address && <div className="flex items-start text-sm text-slate-600 dark:text-slate-300"><MapPin size={16} className="mr-3 mt-0.5 text-slate-400 shrink-0" /><span>{user.address}</span></div>}
            </div>
          </div>
        </div>

        {/* Subscription & Billing */}
        <div className="md:col-span-2 space-y-6">
          {/* Subscription Status */}
          <div className="bg-white/90 dark:bg-[#242821]/90 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Mevcut Abonelik</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.plan === SubscriptionPlan.YEARLY ? 'Yıllık Pro Plan' : 'Aylık Standart Plan'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Planı Değiştir</Button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Doküman Kotası</span>
                <span className="text-slate-800 dark:text-white font-bold">
                  {isUnlimited ? 'Sınırsız' : `${user.remainingDownloads} Adet Kaldı`}
                </span>
              </div>
              {isUnlimited ? (
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              ) : (
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${100 - percentage}%` }}></div>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Yenilenme Tarihi: <span className="font-medium text-slate-600">14 Mayıs 2025</span>
              </p>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white/90 dark:bg-[#242821]/90 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white">Fatura Geçmişi</h3>
              <Button variant="secondary" size="sm" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10">Tümünü Gör</Button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {[
                { date: '14 Nis 2025', amount: '4.999 TL', status: 'Ödendi' },
                { date: '14 Mar 2025', amount: '499 TL', status: 'Ödendi' },
                { date: '14 Şub 2025', amount: '499 TL', status: 'Ödendi' },
              ].map((inv, i) => (
                <div key={i} className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-full text-slate-500 mr-4">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.amount}</p>
                      <p className="text-xs text-slate-500">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{inv.status}</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};