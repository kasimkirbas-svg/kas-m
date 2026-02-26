import React, { useState } from 'react';
import { Check, Shield, CreditCard, Lock, Calendar, AlertCircle, X, ChevronLeft, Star } from 'lucide-react';
import { PLANS } from '../constants';
import { SubscriptionPlan, User } from '../types';

interface SubscriptionPageProps {
  user: User;
  t: any;
  onUpgrade: (plan: SubscriptionPlan) => Promise<void>;
  onBack: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, t, onUpgrade, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Simple formatting
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
      formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
      }
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
  };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Basic Validation
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Geçersiz kart numarası');
      setIsProcessing(false);
      return;
    }
    if (paymentData.cvc.length !== 3) {
      setError('Geçersiz CVC kodu');
      setIsProcessing(false);
      return;
    }

    try {
        if (selectedPlan) {
            // Actual API call via App.tsx logic
            await onUpgrade(selectedPlan);
            setShowPaymentModal(false);
        }
    } catch (err: any) {
        console.error('Payment Error:', err);
        setError('Ödeme ve Aktivasyon sırasında bir sorun oluştu: ' + (err.message || 'Bilinmeyen Hata'));
    } finally {
        setIsProcessing(false);
    }
  };

  const getPlanDetails = (planId: SubscriptionPlan) => {
    return PLANS.find(p => p.id === planId);
  };

  const selectedPlanDetails = selectedPlan ? getPlanDetails(selectedPlan) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-900/20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
             >
               <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-bold">{t?.common?.back || 'Geri'}</span>
             </button>
             <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t?.subscription?.title || 'Abonelik Paketleri'}</h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
             {t?.subscription?.subtitle || 'İşiniz için en iyi planı seçin'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
             Tüm paketlerde <span className="text-indigo-600 dark:text-indigo-400 font-bold">14 gün para iade garantisi</span>. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
           {PLANS.map((plan, index) => {
             const isCurrentPlan = user.plan === plan.id;
             return (
               <div 
                 key={plan.id}
                 className={`group relative rounded-3xl p-8 transition-all duration-300 animate-fade-in-up hover:-translate-y-2
                    ${plan.popular 
                        ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/20 z-10 scale-105' 
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-800'
                    }
                 `}
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 {plan.popular && (
                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                     <Star size={12} fill="currentColor" /> EN POPÜLER
                   </div>
                 )}

                 <div className="mb-6">
                    <h3 className={`text-xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                    <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Küçük işletmeler ve profesyoneller için ideal</p>
                 </div>

                 <div className="mb-8 flex items-baseline gap-1">
                   <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.price}</span>
                   <span className={`font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                 </div>
                 
                 <div className={`h-px w-full mb-8 ${plan.popular ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-700'}`}></div>

                 <ul className="space-y-4 mb-8">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-start gap-3">
                       <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${plan.popular ? 'bg-indigo-500' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                         <Check size={14} className={plan.popular ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} strokeWidth={3} />
                       </div>
                       <p className={`text-sm font-bold ${plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{feature}</p>
                     </li>
                   ))}
                 </ul>

                 <button
                    onClick={() => handleSelectPlan(plan.id as SubscriptionPlan)}
                    disabled={isCurrentPlan}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-center transition-all duration-300
                      ${isCurrentPlan 
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : plan.popular 
                            ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg shadow-white/10 active:scale-95' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95'
                      }`}
                 >
                   {isCurrentPlan ? (t?.subscription?.currentPlan || 'Mevcut Plan') : (t?.subscription?.selectPlan || 'Hemen Başla')}
                 </button>
                 
               </div>
             );
           })}
        </div>
        
        <div className="mt-20 text-center animate-fade-in">
           <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Shield size={20} />
             </div>
             <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white text-sm">Güvenli Ödeme</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t?.subscription?.securePayment || '256-bit SSL şifreleme ile korunmaktadır.'}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowPaymentModal(false)}></div>
           
           {/* Modal */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
              
              {/* Header */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock size={20} className="text-emerald-500" />
                    {t?.subscription?.paymentDetails || 'Ödeme Bilgileri'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 dark:text-slate-400 font-medium">Kart bilgilerinizi giriniz</p>
                 </div>
                 <button 
                   onClick={() => setShowPaymentModal(false)}
                   className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                 >
                   <X size={16} />
                 </button>
              </div>

              <div className="p-8">
                 {/* Summary Card */}
                 <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden group">
                    <div className="relative z-10">
                       <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Seçilen Paket</p>
                       <p className="font-black text-slate-900 dark:text-white text-lg">{selectedPlanDetails.name}</p>
                    </div>
                    <div className="text-right relative z-10">
                       <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Tutar</p>
                       <p className="font-black text-indigo-600 dark:text-indigo-400 text-xl">{selectedPlanDetails.price}</p>
                    </div>
                    {/* Decor */}
                    <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                 </div>

                 <form onSubmit={handlePaymentSubmit} className="space-y-5">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                             {t?.subscription?.cardHolder || 'Kart Sahibi'}
                          </label>
                          <div className="relative group">
                            <input 
                              type="text"
                              name="cardName"
                              placeholder="AD SOYAD"
                              required
                              value={paymentData.cardName}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all uppercase font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                            <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                               <UserIcon />
                            </div>
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                             {t?.subscription?.cardNumber || 'Kart Numarası'}
                          </label>
                          <div className="relative group">
                             <input 
                               type="text"
                               name="cardNumber"
                               placeholder="0000 0000 0000 0000"
                               maxLength={19}
                               required
                               value={paymentData.cardNumber}
                               onChange={handleInputChange}
                               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                             />
                             <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <CreditCard size={20} />
                             </div>
                             <div className="absolute right-4 top-3.5">
                                <div className="flex gap-1 opacity-50">
                                   <div className="w-8 h-5 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                   <div className="w-8 h-5 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-5">
                          <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {t?.subscription?.expiryDate || 'SKT'}
                             </label>
                             <div className="relative group">
                                <input 
                                  type="text"
                                  name="expiry"
                                  placeholder="AA/YY"
                                  maxLength={5}
                                  required
                                  value={paymentData.expiry}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                   <Calendar size={20} />
                                </div>
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {t?.subscription?.cvv || 'CVC'}
                             </label>
                             <div className="relative group">
                                <input 
                                  type="text"
                                  name="cvc"
                                  placeholder="123"
                                  maxLength={3}
                                  required
                                  value={paymentData.cvc}
                                  onChange={handleInputChange}
                                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                   <Lock size={20} />
                                </div>
                             </div>
                          </div>
                       </div>

                    {error && (
                       <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                          <AlertCircle size={20} />
                          {error}
                       </div>
                    )}

                    <button 
                       type="submit"
                       disabled={isProcessing}
                       className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3"
                    >
                       {isProcessing ? (
                          <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             {t?.subscription?.processing || 'İşlem Sürüyor...'}
                          </>
                       ) : (
                          <>
                             <CreditCard size={20} />
                             {t?.subscription?.payNow || 'Ödemeyi Tamamla'}
                          </>
                       )}
                    </button>
                 </form>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center justify-center gap-2 tracking-wide">
                    <Lock size={10} />
                    Güvenli Ödeme Altyapısı
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Create a simple icon component locally to avoid import issues if User icon is missing in lucide-react imports above
const UserIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
   </svg>
);
