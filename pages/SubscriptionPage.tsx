import React, { useState } from 'react';
import { Check, Shield, CreditCard, Lock, Calendar, AlertCircle } from 'lucide-react';
import { PLANS, APP_NAME } from '../constants';
import { SubscriptionPlan, User } from '../types';

interface SubscriptionPageProps {
  user: User;
  t: any;
  onUpgrade: (plan: SubscriptionPlan) => void;
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

  const handlePaymentSubmit = (e: React.FormEvent) => {
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

    // Simulate Payment API
    setTimeout(() => {
        setIsProcessing(false);
        if (selectedPlan) {
            onUpgrade(selectedPlan);
            setShowPaymentModal(false);
        }
    }, 2000);
  };

  const getPlanDetails = (planId: SubscriptionPlan) => {
    return PLANS.find(p => p.id === planId);
  };

  const selectedPlanDetails = selectedPlan ? getPlanDetails(selectedPlan) : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
                onClick={onBack}
                className="text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center gap-1"
             >
               ← {t?.common?.back || 'Geri'}
             </button>
             <div className="h-6 w-px bg-slate-200"></div>
             <h1 className="text-xl font-bold text-slate-800">{t?.subscription?.title || 'Abonelik Paketleri'}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{t?.subscription?.subtitle || 'İşiniz için en iyi planı seçin'}</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
             Tüm paketlerde 14 gün para iade garantisi. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {PLANS.map((plan) => {
             const isCurrentPlan = user.plan === plan.id;
             return (
               <div 
                 key={plan.id}
                 className={`relative rounded-2xl p-8 bg-white border-2 shadow-sm transition-all hover:shadow-lg ${
                    plan.popular ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'
                 }`}
               >
                 {plan.popular && (
                   <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                     EN POPÜLER
                   </div>
                 )}

                 <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                 <div className="mt-4 flex items-baseline">
                   <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                   <span className="ml-1 text-slate-500">{plan.period}</span>
                 </div>
                 <p className="mt-2 text-sm text-slate-500">
                    {plan.id === SubscriptionPlan.YEARLY ? 'Yıllık faturalandırılır' : 'Aylık faturalandırılır'}
                 </p>

                 <ul className="mt-6 space-y-4">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-start">
                       <div className="flex-shrink-0">
                         <Check className="h-5 w-5 text-green-500" />
                       </div>
                       <p className="ml-3 text-sm text-slate-600">{feature}</p>
                     </li>
                   ))}
                 </ul>

                 <button
                    onClick={() => handleSelectPlan(plan.id as SubscriptionPlan)}
                    disabled={isCurrentPlan}
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-bold text-center transition-colors ${
                      isCurrentPlan 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : plan.popular 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                            : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                 >
                   {isCurrentPlan ? (t?.subscription?.currentPlan || 'Mevcut Plan') : (t?.subscription?.selectPlan || 'Seç')}
                 </button>
               </div>
             );
           })}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
             <Shield size={16} />
             {t?.subscription?.securePayment || 'Güvenli ödeme altyapısı ile korunmaktadır.'}
           </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                   <Lock size={18} className="text-green-600" />
                   {t?.subscription?.paymentDetails || 'Ödeme Bilgileri'}
                 </h3>
                 <button 
                   onClick={() => setShowPaymentModal(false)}
                   className="text-slate-400 hover:text-slate-600"
                 >
                   ✕
                 </button>
              </div>

              <div className="p-6">
                 <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                       <p className="text-sm text-slate-500">Seçilen Paket</p>
                       <p className="font-bold text-slate-900">{selectedPlanDetails.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm text-slate-500">Tutar</p>
                       <p className="font-bold text-blue-600">{selectedPlanDetails.price}</p>
                    </div>
                 </div>

                 <form onSubmit={handlePaymentSubmit}>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                             {t?.subscription?.cardHolder || 'Kart Sahibi'}
                          </label>
                          <div className="relative">
                            <input 
                              type="text"
                              name="cardName"
                              placeholder="Ad Soyad"
                              required
                              value={paymentData.cardName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                            />
                            <div className="absolute left-3 top-2.5 text-slate-400">
                               <UserIcon />
                            </div>
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                             {t?.subscription?.cardNumber || 'Kart Numarası'}
                          </label>
                          <div className="relative">
                             <input 
                               type="text"
                               name="cardNumber"
                               placeholder="0000 0000 0000 0000"
                               maxLength={19}
                               required
                               value={paymentData.cardNumber}
                               onChange={handleInputChange}
                               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                             />
                             <div className="absolute left-3 top-2.5 text-slate-400">
                                <CreditCard size={18} />
                             </div>
                             <div className="absolute right-3 top-2.5">
                                {/* Card Brand Icon placeholder */}
                                <div className="flex gap-1">
                                   <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t?.subscription?.expiryDate || 'Son Kullanma'}
                             </label>
                             <div className="relative">
                                <input 
                                  type="text"
                                  name="expiry"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  required
                                  value={paymentData.expiry}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                />
                                <div className="absolute left-3 top-2.5 text-slate-400">
                                   <Calendar size={18} />
                                </div>
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t?.subscription?.cvv || 'CVC/CVV'}
                             </label>
                             <div className="relative">
                                <input 
                                  type="text"
                                  name="cvc"
                                  placeholder="123"
                                  maxLength={3}
                                  required
                                  value={paymentData.cvc}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                />
                                <div className="absolute left-3 top-2.5 text-slate-400">
                                   <Lock size={18} />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {error && (
                       <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                          <AlertCircle size={16} />
                          {error}
                       </div>
                    )}

                    <button 
                       type="submit"
                       disabled={isProcessing}
                       className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                       {isProcessing ? (
                          <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             {t?.subscription?.processing || 'İşleniyor...'}
                          </>
                       ) : (
                          <>
                             {t?.subscription?.payNow || 'Ödeme Yap'}
                          </>
                       )}
                    </button>
                 </form>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
                 <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                    <Lock size={12} />
                    Ödemeniz 256-bit SSL şifreleme ile güvendedir. Kredi kartı bilgileriniz saklanmaz.
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
   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
   </svg>
);
