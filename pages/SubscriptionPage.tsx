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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
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
    setSelectedPackage(null);
    setShowPaymentModal(true);
    setError('');
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setSelectedPlan(null);
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
        } else if (selectedPackage) {
            // Buy Extra Package
            const token = localStorage.getItem('token');
            const response = await fetch('/api/buy-rights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ packageId: selectedPackage })
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message || 'Paket başarıyla tanımlandı!');
                setShowPaymentModal(false);
                // Force Reload to update user context
                window.location.reload(); 
            } else {
                throw new Error(result.message || 'Satın alma başarısız oldu.');
            }
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
  
  const getPackageDetails = (pkgId: string) => {
      switch(pkgId) {
          case '10_pack': return { name: '10 Ek PDF Hakkı', price: '₺150', period: 'Tek Seferlik' };
          case '50_pack': return { name: '50 Ek PDF Hakkı', price: '₺600', period: 'Tek Seferlik' };
          default: return null;
      }
  };

  const selectedPlanDetails = selectedPlan ? getPlanDetails(selectedPlan) : (selectedPackage ? getPackageDetails(selectedPackage) : null);


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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
           {PLANS.map((plan, index) => {
             const isCurrentPlan = user.plan === plan.id;
             
             // Dynamic styles based on plan.color
             let cardStyle = "";
             let badgeStyle = "";
             let buttonStyle = "";
             let iconColor = "";
             
             if (plan.color === 'slate') {
                 cardStyle = "bg-slate-900 border border-slate-700 shadow-xl";
                 badgeStyle = "bg-slate-700 text-white";
                 buttonStyle = "bg-slate-700 hover:bg-slate-600 text-white";
                 iconColor = "text-slate-400";
             } else if (plan.color === 'amber') {
                 cardStyle = "bg-gradient-to-b from-slate-900 via-amber-950/20 to-black border border-amber-600 shadow-2xl shadow-amber-900/20 transform md:-translate-y-4 z-10";
                 badgeStyle = "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/40";
                 buttonStyle = "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black shadow-lg shadow-amber-900/30";
                 iconColor = "text-amber-500";
             } else if (plan.color === 'indigo') {
                 cardStyle = "bg-slate-900 border border-indigo-500/50 shadow-xl shadow-indigo-900/10";
                 badgeStyle = "bg-indigo-600 text-white";
                 buttonStyle = "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20";
                 iconColor = "text-indigo-400";
             }

             return (
               <div 
                 key={plan.id}
                 className={`group relative rounded-2xl p-8 transition-all duration-500 animate-fade-in-up flex flex-col ${cardStyle}`}
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 {plan.popular && (
                   <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 ${badgeStyle}`}>
                     <Star size={12} fill="currentColor" /> {t?.subscription?.popular || 'EN ÇOK TERCİH EDİLEN'}
                   </div>
                 )}
                 
                 {plan.color === 'amber' && <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>}

                 <div className="mb-6 relative z-10 text-center">
                    <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${plan.color === 'amber' ? 'text-amber-500 drop-shadow-sm' : (plan.color === 'indigo' ? 'text-indigo-400' : 'text-slate-200')}`}>{plan.name}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Özel İşletme ve Kurumlar İçin</p>
                 </div>

                 <div className="mb-8 flex items-baseline justify-center gap-1 relative z-10">
                   <span className={`text-5xl font-black tracking-tighter ${plan.color === 'amber' ? 'text-amber-400 text-shadow-sm' : 'text-white'}`}>{plan.price.split(' ')[0]}</span>
                   <span className="font-bold text-slate-500 text-lg">TL</span>
                 </div>
                 
                 <div className={`h-px w-full mb-8 ${plan.color === 'amber' ? 'bg-gradient-to-r from-transparent via-amber-800 to-transparent' : 'bg-slate-800'}`}></div>
                 
                 <ul className="flex-1 space-y-4 mb-8 relative z-10">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-300">
                            <div className={`p-1 rounded-full mt-0.5 ${plan.color === 'amber' ? 'bg-amber-900/50 text-amber-500' : (plan.color === 'indigo' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-slate-800 text-slate-500')}`}>
                                <Check size={12} strokeWidth={4} />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                 </ul>
                 
                 <div className="relative z-10 mt-auto">
                    <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isCurrentPlan}
                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 ${buttonStyle} ${isCurrentPlan ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'}`}
                    >
                        {isCurrentPlan ? (t?.subscription?.current || 'MEVCUT PLAN') : (t?.subscription?.select || 'SATIN AL')}
                    </button>
                    <div className="text-center mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Güvenli Ödeme SSL 256-Bit
                    </div>
                 </div>

               </div>
             );
           })}
        </div>



        

        {/* Extra Packages */}
        <div className="mt-20 mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <h2 className="text-2xl font-black text-center text-slate-900 dark:text-white tracking-tight uppercase">
                    Ek İndirme Paketleri
                </h2>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* 10 Pack */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center relative overflow-hidden group hover:border-indigo-500 transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                    <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                        <Star size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">10 PDF Hakkı</h3>
                    <p className="text-sm text-slate-500 mb-4">Aylık abonelik olmadan ekstra indirme hakkı.</p>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">₺150 <span className="text-sm font-medium text-slate-400">/ tek seferlik</span></div>
                    <button 
                        onClick={() => handleSelectPackage('pack_10')}
                        className="w-full py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-xl font-bold transition-colors"
                    >
                        Hemen Al
                    </button>
                </div>

                {/* 50 Pack */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500 transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                    <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">50 PDF Hakkı</h3>
                    <p className="text-sm text-slate-500 mb-4">Yoğun kullanım için avantajlı paket.</p>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">₺600 <span className="text-sm font-medium text-slate-400">/ tek seferlik</span></div>
                    <button 
                        onClick={() => handleSelectPackage('pack_50')}
                        className="w-full py-3 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-xl font-bold transition-colors"
                    >
                        Hemen Al
                    </button>
                </div>
            </div>
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
