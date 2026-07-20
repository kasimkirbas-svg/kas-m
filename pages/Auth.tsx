import React, { useState } from "react";
import { ArrowLeft, Building2, LogIn, MapPin, Shield, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import type { User as AppUser } from "../types";
import { SubscriptionPlan, UserRole } from "../types";

type AccountType = "individual" | "osgb";
type Profession = "İSG Uzmanı" | "İSG Teknikeri" | "İşveren";

interface AuthProps {
  initialMode?: "login" | "register";
  onAuthSuccess?: (user: AppUser) => void;
  onBack?: () => void;
}

interface RegisteredAccount {
  user: AppUser;
  passwordHash: string;
}

const inputClass = "block w-full px-4 py-3 border border-slate-300 dark:border-white/10 rounded-xl bg-slate-100 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium";
const labelClass = "text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1";
const normalizePhone = (value: string) => value.replace(/\D/g, "").replace(/^90/, "").replace(/^0/, "").slice(0, 10);
const formatPhone = (value: string) => {
  const digits = normalizePhone(value);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(" ");
};
const hashPassword = async (password: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
};
const getAccounts = (): RegisteredAccount[] => {
  try { return JSON.parse(localStorage.getItem("isg_accounts") || "[]"); } catch { return []; }
};

export default function Auth({ initialMode = "login", onAuthSuccess, onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "", confirmPassword: "", profession: "İSG Uzmanı" as Profession,
    companyName: "", taxNumber: "", taxOffice: "", address: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const update = (field: keyof typeof form, value: string) => {
    const nextValue = field === "phone" ? formatPhone(value) : field === "taxNumber" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm(current => ({ ...current, [field]: nextValue }));
    setErrors(current => ({ ...current, [field]: "" }));
    setMessage(null);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) nextErrors.email = "Geçerli bir e-posta adresi girin.";
    if (!/^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d).{8,}$/.test(form.password)) nextErrors.password = "En az 8 karakter, büyük/küçük harf ve rakam kullanın.";
    if (!isLogin) {
      if (form.fullName.trim().split(/\s+/).length < 2 || form.fullName.trim().length < 5) nextErrors.fullName = "Ad ve soyadınızı eksiksiz girin.";
      if (!/^5\d{9}$/.test(normalizePhone(form.phone))) nextErrors.phone = "5XX XXX XX XX biçiminde geçerli telefon girin.";
      if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Şifreler birbiriyle eşleşmiyor.";
      if (!consent) nextErrors.consent = "Kayıt için veri işleme onayını vermelisiniz.";
      if (accountType === "osgb") {
        if (form.companyName.trim().length < 3) nextErrors.companyName = "Firma ünvanını eksiksiz girin.";
        if (!/^\d{10}$/.test(form.taxNumber)) nextErrors.taxNumber = "Vergi numarası 10 haneli olmalıdır.";
        if (form.taxOffice.trim().length < 3) nextErrors.taxOffice = "Vergi dairesini girin.";
        if (form.address.trim().length < 15) nextErrors.address = "Fatura için açık adresi en az 15 karakter girin.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage(null);
    const email = form.email.trim().toLowerCase();
    const accounts = getAccounts();
    const passwordHash = await hashPassword(form.password);
    if (isLogin) {
      const account = accounts.find(item => item.user.email.toLowerCase() === email && item.passwordHash === passwordHash);
      if (!account) {
        setLoading(false);
        setMessage({ type: "error", text: "E-posta veya şifre hatalı. Önce kayıt oluşturduğunuzdan emin olun." });
        return;
      }
      setMessage({ type: "success", text: "Bilgiler doğrulandı, yönlendiriliyorsunuz..." });
      setTimeout(() => onAuthSuccess?.(account.user), 500);
      return;
    }
    if (accounts.some(item => item.user.email.toLowerCase() === email)) {
      setLoading(false);
      setErrors({ email: "Bu e-posta adresiyle daha önce hesap oluşturulmuş." });
      return;
    }
    const user: AppUser = {
      id: crypto.randomUUID(), name: form.fullName.trim(), email, phone: `+90 ${form.phone}`,
      role: UserRole.SUBSCRIBER, plan: SubscriptionPlan.FREE, remainingDownloads: 0, accountType,
      ...(accountType === "individual" ? { profession: form.profession } : {
        companyName: form.companyName.trim(), taxNumber: form.taxNumber,
        taxOffice: form.taxOffice.trim(), address: form.address.trim()
      })
    };
    localStorage.setItem("isg_accounts", JSON.stringify([...accounts, { user, passwordHash }]));
    setMessage({ type: "success", text: "Hesabınız oluşturuldu. Bilgilerinizle giriş yapabilirsiniz." });
    setLoading(false);
    setTimeout(() => { setIsLogin(true); setForm(current => ({ ...current, password: "", confirmPassword: "" })); }, 700);
  };

  const field = (name: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <div className="space-y-1.5">
      <label htmlFor={name} className={labelClass}>{label}</label>
      <input id={name} required value={form[name]} onChange={event => update(name, event.target.value)} type={type} placeholder={placeholder} autoComplete={name === "password" ? (isLogin ? "current-password" : "new-password") : undefined} className={`${inputClass} ${errors[name] ? "border-red-500 dark:border-red-500" : ""}`} />
      {errors[name] && <p className="text-xs text-red-600 dark:text-red-400 ml-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="light-auth min-h-screen bg-[#eef1f5] dark:bg-[#0A0A0A] text-slate-900 dark:text-white font-sans relative overflow-x-hidden selection:bg-yellow-500/30">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-30 mix-blend-multiply dark:mix-blend-normal"><source src="/13232-246463976_medium.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-[#eef1f5]/60 dark:bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#eef1f5]/75 to-[#eef1f5] dark:via-[#0a0a0a]/50 dark:to-[#0a0a0a]" />
      </div>
      <header className="relative z-20 p-5 sm:p-7 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 backdrop-blur-md"><ArrowLeft size={18} /><span className="hidden sm:inline text-sm font-medium">Ana Sayfaya Dön</span></button>
        <div className="font-black tracking-[0.18em]">İSG <span className="text-yellow-500">ZEYRON</span></div>
      </header>
      <main className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-5 pb-12 pt-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/85 dark:bg-[#0d1017]/95 backdrop-blur-2xl border border-white dark:border-white/10 p-4 sm:p-9 rounded-2xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] dark:shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-7"><h1 className="text-3xl font-black text-slate-950 dark:text-white">{isLogin ? "Sisteme Giriş" : "Hesap Oluştur"}</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{isLogin ? "Kayıtlı hesabınızla güvenli şekilde devam edin." : "Faturalama ve kullanıcı yönetimi için bilgilerinizi eksiksiz girin."}</p></div>
          {!isLogin && <div className="grid grid-cols-2 gap-2 p-1.5 mb-7 bg-slate-100 dark:bg-black/30 rounded-xl" role="tablist" aria-label="Kayıt türü">{(["individual", "osgb"] as AccountType[]).map(type => <button key={type} type="button" onClick={() => { setAccountType(type); setErrors({}); }} className={`py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${accountType === type ? "bg-white dark:bg-yellow-500 text-slate-900 dark:text-black shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>{type === "individual" ? <User size={18} /> : <Building2 size={18} />}{type === "individual" ? "Bireysel" : "OSGB"}</button>)}</div>}
          {message && <div className={`mb-5 p-4 rounded-xl text-sm flex gap-3 border ${message.type === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"}`}><Shield className="w-5 h-5 shrink-0" />{message.text}</div>}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {!isLogin && <div className="grid sm:grid-cols-2 gap-5">{field("fullName", accountType === "osgb" ? "Abone Kişinin Adı Soyadı" : "Ad Soyad", "Adınız Soyadınız")}{field("phone", "Telefon", "5XX XXX XX XX", "tel")}</div>}
            {!isLogin && accountType === "osgb" && <div className="grid sm:grid-cols-2 gap-5 p-5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5"><div className="sm:col-span-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white"><Building2 size={18} className="text-yellow-500" />Firma ve fatura bilgileri</div>{field("companyName", "Firma Ünvanı", "Örnek OSGB A.Ş.")}{field("taxNumber", "Vergi No", "10 haneli vergi numarası")}{field("taxOffice", "Vergi Dairesi", "Vergi dairesi")}<div className="sm:col-span-2 space-y-1.5"><label htmlFor="address" className={labelClass}>Açık Adres</label><div className="relative"><MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" /><textarea id="address" required value={form.address} onChange={event => update("address", event.target.value)} rows={3} placeholder="Mahalle, cadde, bina no, ilçe ve il" className={`${inputClass} pl-12 resize-none ${errors.address ? "border-red-500" : ""}`} /></div>{errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}</div></div>}
            {!isLogin && accountType === "individual" && <div className="space-y-1.5"><label htmlFor="profession" className={labelClass}>Meslek</label><select id="profession" value={form.profession} onChange={event => update("profession", event.target.value)} className={inputClass}>{["İSG Uzmanı", "İSG Teknikeri", "İşveren"].map(item => <option key={item}>{item}</option>)}</select></div>}
            <div className="grid sm:grid-cols-2 gap-5">{field("email", "E-posta", "isim@sirket.com", "email")}{field("password", "Şifre", "En az 8 karakter", "password")}{!isLogin && field("confirmPassword", "Şifre Tekrar", "Şifrenizi tekrar girin", "password")}</div>
            {!isLogin && <div><label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 cursor-pointer"><input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setErrors(current => ({ ...current, consent: "" })); }} className="mt-1 accent-yellow-500" /><span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">Üyelik ve faturalama işlemleri için verdiğim bilgilerin işlenmesini ve hesap güvenliği amacıyla saklanmasını onaylıyorum.</span></label>{errors.consent && <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1">{errors.consent}</p>}</div>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold rounded-xl py-4 flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-[0_10px_25px_rgba(202,138,4,0.2)] disabled:opacity-50">{loading ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : isLogin ? <><LogIn size={20} />Sisteme Giriş Yap</> : <><UserPlus size={20} />{accountType === "osgb" ? "OSGB Hesabı Oluştur" : "Bireysel Hesap Oluştur"}</>}</button>
          </form>
          <div className="mt-7 pt-6 border-t border-slate-200 dark:border-white/10 text-center"><button type="button" onClick={() => { setIsLogin(!isLogin); setErrors({}); setMessage(null); }} className="text-sm text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400">{isLogin ? "Hesabınız yok mu? Kayıt oluşturun" : "Zaten üye misiniz? Giriş yapın"}</button></div>
        </motion.div>
      </main>
    </div>
  );
}
