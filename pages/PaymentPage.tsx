// pages/PaymentPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, CheckCircle2, Lock, Calendar, User, Zap, Star, Gem } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PaymentPageProps {
  plan: 'SILVER' | 'GOLD' | 'DIAMOND';
  price: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ plan, price, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').slice(0, 5);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('success');
    setIsProcessing(false);
    
    // Redirect after success
    setTimeout(() => {
        onSuccess();
    }, 3000);
  };

  const getPlanDetails = () => {
    switch(plan) {
      case 'SILVER':
        return {
          color: 'from-slate-700 to-slate-900',
          icon: Shield,
          iconColor: 'text-slate-200',
          features: ['100 TL', 'Temel Limit', 'Standart Destek']
        };
      case 'GOLD':
        return {
          color: 'from-amber-600 to-orange-700',
          icon: Star,
          iconColor: 'text-amber-200',
          features: ['175 TL', '2 Kat Avantaj', 'Öncelikli Destek']
        };
      case 'DIAMOND':
        return {
          color: 'from-cyan-600 to-indigo-700',
          icon: Gem,
          iconColor: 'text-cyan-200',
          features: ['250 TL', 'Sınırsız Limit', 'VIP Destek']
        };
      default:
        return { color: 'bg-gray-500', icon: Shield, iconColor: '', features: [] };
    }
  };

  const planInfo = getPlanDetails();

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center border border-green-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/40 relative z-10"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Ödeme Başarılı!</h2>
          <p className="text-slate-400 mb-6 relative z-10">Paketiniz başarıyla hesabınıza tanımlandı. Yönlendiriliyorsunuz...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
      >
        {/* Left Side: Plan Summary */}
        <div className={`md:w-1/3 bg-gradient-to-br ${planInfo.color} p-8 relative overflow-hidden flex flex-col justify-between`}>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10">
             <button onClick={onBack} className="flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium">
               <ArrowLeft size={16} className="mr-1" /> Geri Dön
             </button>
             
             <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-6 shadow-lg">
                <planInfo.icon size={32} className={`text-white drop-shadow-md`} />
             </div>
             
             <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{plan} PAKET</h2>
             <div className="text-4xl font-bold text-white mb-6 flex items-baseline gap-1">
               {price} <span className="text-lg text-white/70 font-normal">/ ay</span>
             </div>
             
             <ul className="space-y-3">
               {planInfo.features.map((feature, i) => (
                 <li key={i} className="flex items-center text-white/90 text-sm font-medium">
                   <CheckCircle2 size={16} className="mr-3 text-white" /> {feature}
                 </li>
               ))}
             </ul>
           </div>
           
           <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span>Toplam Tutar</span>
                <span className="font-bold text-white text-lg">{price}</span>
              </div>
           </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="md:w-2/3 p-8 md:p-12 bg-slate-900/50">
           <h3 className="text-2xl font-bold text-white mb-1">Ödeme Bilgileri</h3>
           <p className="text-slate-400 text-sm mb-8">Güvenli ödeme altyapısı ile işleminizi tamamlayın.</p>
           
           <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Kart Üzerindeki İsim</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ad Soyad"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Kart Numarası</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <div className="w-8 h-5 bg-slate-600 rounded opacity-50"></div>
                    <div className="w-8 h-5 bg-slate-600 rounded opacity-50"></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="space-y-2 w-1/2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Son Kullanma</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        name="expiry"
                        required
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                      />
                    </div>
                 </div>
                 <div className="space-y-2 w-1/2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">CVC / CVV</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        name="cvc"
                        required
                        value={formData.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                      />
                    </div>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                  ${isProcessing ? 'bg-slate-700 cursor-not-allowed text-slate-400' : `bg-gradient-to-r ${planInfo.color} hover:shadow-${planInfo.color.split('-')[1]}/50 text-white`}
                `}
              >
                {isProcessing ? 'İşleniyor...' : (
                  <>
                    <Lock size={16} /> Güvenli Öde
                  </>
                )}
              </button>
              
              <div className="flex justify-center gap-4 text-slate-600 pt-4">
                 <Shield size={20} />
                 <Lock size={20} />
                 <CheckCircle2 size={20} />
              </div>

           </form>
        </div>
      </motion.div>
    </div>
  );
};
