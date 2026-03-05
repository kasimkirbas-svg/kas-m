import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, CreditCard, Lock, Calendar, AlertCircle, X, ChevronLeft, Star, Crown, Zap, Rocket } from 'lucide-react';
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

  // Filter plans to show only specific premium ones
  const filteredPlans = PLANS.filter(plan => ['SILVER', 'GOLD', 'DIAMOND'].includes(plan.id));

  // Determine an icon and gradient for each plan for marketing purposes
  const getMarketingStyles = (planId: SubscriptionPlan) => {
      switch(planId) {
          case 'SILVER':
              return { icon: Zap, grad: 'from-slate-400 to-slate-500', shadow: 'shadow-slate-500/20' };
          case 'GOLD':
              return { icon: Crown, grad: 'from-amber-400 to-amber-600', shadow: 'shadow-amber-500/30' };
          case 'DIAMOND':
              return { icon: Rocket, grad: 'from-fuchsia-500 to-indigo-600', shadow: 'shadow-fuchsia-500/30' };
          default:
              return { icon: Star, grad: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' };
      }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 py-8 md:p-8 w-full text-slate-800 dark:text-slate-100">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto mb-16 relative z-10"
      >
        <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 px-6 py-2 rounded-full mb-6 backdrop-blur-md">
            <Star className="text-amber-500 w-5 h-5" />
            <span className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-sm">Premium Paketler</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400">
          İşinizi Hemen Zirveye Taşıyın
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Kırbaş Panel ile belgelerinizi profesyonelleştirin, zamandan tasarruf edin ve iş süreçlerinizi mükemmelleştirin. Size en uygun planı seçerek hemen başlayın.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10"
      >
        {filteredPlans.map((plan) => {
          const mkt = getMarketingStyles(plan.id);
          const Icon = mkt.icon;
          const isGold = plan.id === 'GOLD';
          const isCurrentPlan = user?.plan === plan.id;

          return (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -10 }}
              className={`relative flex flex-col p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
                isGold 
                  ? 'bg-gradient-to-b from-slate-900 hover:from-slate-800 to-slate-900 border-amber-500/50 shadow-2xl shadow-amber-500/20 z-10' 
                  : 'bg-white/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xl ' + mkt.shadow
              }`}
            >
              {isGold && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                   <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                       <Crown size={14} /> En Çok Tercih Edilen
                   </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${mkt.grad} shadow-lg text-white`}>
                    <Icon size={28} />
                </div>
                <h3 className={`text-2xl font-black mb-2 uppercase ${isGold ? 'text-white' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-4xl font-black tracking-tight ${isGold ? 'text-white' : ''}`}>
                    {plan.price === 0 ? 'Ücretsiz' : `₺${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className={`text-sm font-medium ${isGold ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>/ay</span>}
                </div>
                <p className={`text-sm ${isGold ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{plan.credits} Doküman Kredisi</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm font-medium ${isGold ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    <Check size={18} className={`shrink-0 mt-0.5 ${isGold ? 'text-amber-400' : 'text-emerald-500'}`} />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2
                  ${isCurrentPlan 
                    ? 'bg-emerald-500 text-white cursor-not-allowed cursor-default'
                    : isGold 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/30' 
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white'
                  }
                `}
              >
                {isCurrentPlan ? (
                  <><Check size={20} /> Mevcut Planınız</>
                ) : (
                  'Planı Seç'
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

        {/* Info Box */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center relative z-10"
        >
           <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-lg">
             <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Shield size={24} />
             </div>
             <div className="text-left">
                <p className="font-black text-slate-800 dark:text-white">Güvenli Ödeme Ağı</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Bütün ödemeleriniz 256-bit SSL şifreleme ile güvendedir.</p>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
      {showPaymentModal && selectedPlanDetails && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
           
           {/* Modal */}
           <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200/50 dark:border-slate-700/50"
           >
              
              {/* Header */}
              <div className="bg-slate-100/50 dark:bg-slate-800/30 px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock size={20} className="text-emerald-500" />
                    {t?.subscription?.paymentDetails || 'Ödeme Bilgileri'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 dark:text-slate-400 font-medium">Kart bilgilerinizi giriniz</p>
                 </div>
                 <button 
                   onClick={() => setShowPaymentModal(false)}
                   className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                 >
                   <X size={16} />
                 </button>
              </div>

              <div className="p-8">
                 {/* Summary Card */}
                 <div className="mb-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden group">
                    <div className="relative z-10">
                       <p className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Seçilen Paket</p>
                       <p className="font-black text-slate-900 dark:text-white text-xl">{selectedPlanDetails.name}</p>
                    </div>
                    <div className="text-right relative z-10">
                       <p className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Tutar</p>
                       <p className="font-black text-indigo-600 dark:text-indigo-400 text-2xl">{selectedPlanDetails.price === 0 ? '₺0' : `₺${selectedPlanDetails.price}`}</p>
                    </div>
                    {/* Decor */}
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
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
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all uppercase font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-base md:text-sm"
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
                               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-base md:text-sm"
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
                                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-base md:text-sm"
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
                                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-base md:text-sm"
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
              <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
                 <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center gap-2 tracking-wide">
                    <Lock size={10} />
                    Güvenli Ödeme Altyapısı
                 </p>
              </div>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
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
