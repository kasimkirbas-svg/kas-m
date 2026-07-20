import React, { useState } from 'react';
import { Check, Crown, LockKeyhole, Sparkles } from 'lucide-react';
import type { SubscriptionPlan, User } from '../types';

interface BillingProps {
  user: User;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const plans = [
  { id: 'MONTHLY' as SubscriptionPlan, name: 'Aylık Profesyonel', price: '499', period: '/ ay', description: 'Bireysel uzmanlar ve küçük ekipler için.', features: ['30 doküman indirme', 'Tüm standart şablonlar', 'Doküman geçmişi', 'E-posta desteği'] },
  { id: 'YEARLY' as SubscriptionPlan, name: 'Yıllık Kurumsal', price: '4.999', period: '/ yıl', description: 'OSGB ve yoğun doküman kullanan ekipler için.', features: ['Sınırsız doküman', 'Tüm sektör şablonları', 'Öncelikli destek', 'Firma ve kullanıcı yönetimi'], featured: true },
];

export const Billing: React.FC<BillingProps> = ({ user, onSelectPlan }) => {
  const [selected, setSelected] = useState<SubscriptionPlan>(user.plan);
  void onSelectPlan;

  return <section className="workspace-page max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
    <div className="max-w-2xl mb-9"><div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-xs font-black tracking-widest uppercase"><Crown size={16} /> Üyelik Merkezi</div><h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">İhtiyacınıza uygun planı inceleyin</h1><p className="mt-3 text-slate-600 dark:text-slate-400">Ödeme altyapısı hazırlık aşamasındadır. Tahsilat doğrulaması tamamlanmadan hiçbir plan veya kota etkinleştirilmez.</p></div>
    <div className="grid md:grid-cols-2 gap-5">
      {plans.map(plan => <button key={plan.id} onClick={() => setSelected(plan.id)} className={`relative text-left p-6 sm:p-8 rounded-xl border transition-all backdrop-blur-sm ${selected === plan.id ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-400/10' : 'border-white/10 bg-[#18252d]/95 hover:border-amber-400/50'}`}>
        {plan.featured && <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-black uppercase">Önerilen</span>}
        <Sparkles className="text-yellow-500 mb-5" /><h2 className="text-xl font-black text-slate-950 dark:text-white">{plan.name}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p><p className="mt-6 text-4xl font-black text-slate-950 dark:text-white">{plan.price} TL <span className="text-sm font-medium text-slate-500">{plan.period}</span></p>
        <ul className="mt-6 space-y-3">{plan.features.map(feature => <li key={feature} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"><Check size={17} className="text-yellow-500 shrink-0" />{feature}</li>)}</ul>
      </button>)}
    </div>
    <button disabled className="mt-6 w-full sm:w-auto min-h-12 px-8 rounded-xl border border-white/10 bg-white/5 text-slate-400 font-bold cursor-not-allowed flex items-center justify-center gap-2"><LockKeyhole size={17} /> Güvenli ödeme yakında</button>
  </section>;
};
