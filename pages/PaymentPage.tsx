// pages/PaymentPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, CheckCircle2, Lock, Calendar, User, Zap, Star, Gem, FileText, Building2, MapPin, Hash, Phone } from 'lucide-react';
import { fetchApi } from '../src/utils/api';
import { SubscriptionPlan, BillingInfo, User as UserType, Invoice } from '../types';

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

  const [billingData, setBillingData] = useState<BillingInfo>({
    type: 'INDIVIDUAL',
    name: '',
    taxId: '',
    taxOffice: '',
    address: '',
    city: '',
    country: 'Türkiye',
    phone: ''
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

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setBillingData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // --- LOGIC: Update User & Create Invoice ---
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user: UserType = JSON.parse(storedUser);
            
            // 1. Update User Plan (Local)
            // ... (keep local update for immediate UI feedback)
            user.plan = plan as SubscriptionPlan;
            user.subscriptionStartDate = new Date().toISOString();
            user.billingInfo = billingData;
            if (plan === 'SILVER') user.remainingDownloads = 10;
            if (plan === 'GOLD') user.remainingDownloads = 30;
            if (plan === 'DIAMOND') user.remainingDownloads = 'UNLIMITED';
            localStorage.setItem('currentUser', JSON.stringify(user));

            // 2. Create Invoice Ojbect
            const newInvoice: Invoice = {
                id: 'INV-' + Math.floor(Math.random() * 1000000),
                userId: user.id || 'unknown',
                invoiceNumber: 'TR' + new Date().getFullYear() + Math.floor(Math.random() * 10000),
                date: new Date().toISOString(),
                amount: parseInt(price.replace(/\D/g, '')),
                planType: plan as SubscriptionPlan,
                status: 'PAID',
                period: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
                billingDetails: billingData
            };

            // 3. SERVER CALL: Upgrade User & Send Invoice Email
            // Note: We send the invoice data because we want the server to email THIS invoice immediately
            // In a real app, server would generate the invoice ID.
            fetchApi('/api/users/upgrade-and-invoice', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user.id,
                    plan: plan,
                    invoiceData: newInvoice,
                    billingInfo: billingData
                })
            }).catch(console.error); // Fire and forget to not block UI success
            
            // Save Invoice to LocalStorage (as fallback for Profile)
            const existingInvoices = JSON.parse(localStorage.getItem('localInvoices') || '[]');
            localStorage.setItem('localInvoices', JSON.stringify([newInvoice, ...existingInvoices]));
            
            // Trigger storage event for Dashboard update
            window.dispatchEvent(new Event('storage'));
        }
    } catch (err) {
        console.error("Payment processing error", err);
    }

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
              
              {/* --- 1. BILLING INFO SECTION --- */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-6">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                      <FileText size={14} className="text-cyan-400" />
                      Fatura Bilgileri
                  </h4>

                  {/* Type Toggle */}
                  <div className="flex gap-4 mb-4">
                      <label 
                        className={`flex-1 py-2 px-4 rounded-lg border cursor-pointer transition-all text-center text-xs font-bold uppercase
                          ${billingData.type === 'INDIVIDUAL' 
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}
                        `}
                      >
                          <input 
                            type="radio" 
                            name="type" 
                            value="INDIVIDUAL" 
                            checked={billingData.type === 'INDIVIDUAL'} 
                            onChange={() => setBillingData(prev => ({ ...prev, type: 'INDIVIDUAL' }))}
                            className="hidden" 
                          />
                          Bireysel
                      </label>
                      <label 
                        className={`flex-1 py-2 px-4 rounded-lg border cursor-pointer transition-all text-center text-xs font-bold uppercase
                          ${billingData.type === 'CORPORATE' 
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}
                        `}
                      >
                          <input 
                            type="radio" 
                            name="type" 
                            value="CORPORATE" 
                            checked={billingData.type === 'CORPORATE'} 
                            onChange={() => setBillingData(prev => ({ ...prev, type: 'CORPORATE' }))}
                            className="hidden" 
                          />
                          Kurumsal
                      </label>
                  </div>

                  {/* Dynamic Fields */}
                  <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">{billingData.type === 'INDIVIDUAL' ? 'Ad Soyad' : 'Şirket Ünvanı'}</label>
                            <div className="relative">
                                {billingData.type === 'CORPORATE' ? <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /> : <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={billingData.name}
                                    onChange={handleBillingChange}
                                    placeholder={billingData.type === 'INDIVIDUAL' ? 'Ad Soyad' : 'Firma tam adı'}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">{billingData.type === 'INDIVIDUAL' ? 'TC Kimlik No' : 'Vergi No'}</label>
                            <div className="relative">
                                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="text" 
                                    name="taxId"
                                    required
                                    value={billingData.taxId}
                                    onChange={handleBillingChange}
                                    placeholder={billingData.type === 'INDIVIDUAL' ? '11 Haneli TCKN' : '10 Haneli Vergi No'}
                                    maxLength={11}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                          </div>
                      </div>

                      {billingData.type === 'CORPORATE' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">Vergi Dairesi</label>
                            <input 
                                type="text" 
                                name="taxOffice"
                                required
                                value={billingData.taxOffice}
                                onChange={handleBillingChange}
                                placeholder="Vergi Dairesi"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">Fatura Adresi</label>
                        <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                            <textarea 
                                name="address"
                                required
                                value={billingData.address}
                                onChange={handleBillingChange}
                                placeholder="Tam adres..."
                                rows={2}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                            />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">Şehir</label>
                            <input 
                                type="text" 
                                name="city"
                                required
                                value={billingData.city}
                                onChange={handleBillingChange}
                                placeholder="İstanbul"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 pl-1">Telefon (Opsiyonel)</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={billingData.phone}
                                    onChange={handleBillingChange}
                                    placeholder="05XX XXX XX XX"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* --- 2. PAYMENT INFO SECTION --- */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CreditCard size={14} className="text-amber-400" />
                    Kart Bilgileri
                </h4>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Kart üzerindeki İsim</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Kart üzerindeki isim"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Kart Numarası</label>
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
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Son Kullanma</label>
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
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">CVC / CVV</label>
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
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 mt-6 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                  ${isProcessing ? 'bg-slate-700 cursor-not-allowed text-slate-400' : `bg-gradient-to-r ${planInfo.color} hover:shadow-${planInfo.color.split('-')[1]}/50 text-white`}
                `}
              >
                {isProcessing ? 'İşleniyor...' : (
                  <>
                    <Lock size={16} /> {price} Öde ve Tamamla
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
