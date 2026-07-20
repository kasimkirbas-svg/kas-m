import React from 'react';
import { User, SubscriptionPlan, UserRole } from '../types';
import { Button } from '../components/Button';
import { User as UserIcon, Mail, Building, ReceiptText, ShieldCheck, Phone, BriefcaseBusiness, MapPin } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const isUnlimited = user.remainingDownloads === 'UNLIMITED';
  const totalLimit = user.plan === SubscriptionPlan.MONTHLY ? 30 : 1000;
  const used = isUnlimited ? 0 : 30 - (user.remainingDownloads as number);
  const percentage = isUnlimited ? 100 : Math.round((used / totalLimit) * 100);
  const planLabel = user.plan === SubscriptionPlan.YEARLY ? 'Yıllık Kurumsal Plan' : user.plan === SubscriptionPlan.MONTHLY ? 'Aylık Profesyonel Plan' : 'Ücretsiz Plan';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Profil ve Üyelik</h2>
        <p className="text-slate-400">Hesap durumunuzu ve abonelik detaylarınızı inceleyin.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#18252d]/95 p-6 rounded-xl border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.2)] text-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-[#22343e] border border-cyan-300/10 rounded-full mx-auto mb-4 flex items-center justify-center text-cyan-200/70">
              <UserIcon size={40} />
            </div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{user.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-300/15">
              {user.role === UserRole.ADMIN ? 'Yönetici' : 'Aktif Abone'}
            </div>
            
            <div className="mt-6 text-left space-y-3">
              <div className="flex items-center text-sm text-slate-300">
                <Building size={16} className="mr-3 text-cyan-300/70" />
                {user.companyName || 'Firma bilgisi girilmedi'}
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Mail size={16} className="mr-3 text-cyan-300/70" />
                {user.email}
              </div>
              {user.phone && <div className="flex items-center text-sm text-slate-300"><Phone size={16} className="mr-3 text-cyan-300/70" />{user.phone}</div>}
              {user.profession && <div className="flex items-center text-sm text-slate-300"><BriefcaseBusiness size={16} className="mr-3 text-cyan-300/70" />{user.profession}</div>}
              {user.taxNumber && <div className="flex items-center text-sm text-slate-300"><ShieldCheck size={16} className="mr-3 text-cyan-300/70" />Vergi No: {user.taxNumber}</div>}
              {user.address && <div className="flex items-start text-sm text-slate-300"><MapPin size={16} className="mr-3 mt-0.5 text-cyan-300/70 shrink-0" /><span>{user.address}</span></div>}
            </div>
          </div>
        </div>

        {/* Subscription & Billing */}
        <div className="md:col-span-2 space-y-6">
          {/* Subscription Status */}
          <div className="bg-[#18252d]/95 p-6 rounded-xl border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-cyan-300/10 text-cyan-300 rounded-lg mr-3 border border-cyan-300/10">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mevcut Abonelik</h3>
                  <p className="text-sm text-slate-400">{planLabel}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Planı Değiştir</Button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Doküman Kotası</span>
                <span className="text-white font-bold">
                  {isUnlimited ? 'Sınırsız' : `${user.remainingDownloads} Adet Kaldı`}
                </span>
              </div>
              {isUnlimited ? (
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              ) : (
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500" style={{ width: `${100 - percentage}%` }}></div>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2">Yenilenme tarihi, doğrulanmış bir ödeme sonrasında oluşturulur.</p>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-[#18252d]/95 rounded-xl border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.2)] overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white">Fatura Geçmişi</h3>
              <Button variant="secondary" size="sm" className="bg-white/5 text-slate-300 hover:bg-white/10">Tümünü Gör</Button>
            </div>
            <div className="px-6 py-10 text-center"><ReceiptText className="mx-auto text-slate-500" size={30} /><p className="mt-3 text-sm font-semibold text-slate-300">Henüz doğrulanmış fatura yok</p><p className="mt-1 text-xs text-slate-500">Ödeme altyapısı etkinleştirildiğinde faturalar burada listelenecek.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};