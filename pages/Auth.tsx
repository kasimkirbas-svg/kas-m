import React, { useState, useEffect, useMemo } from "react";
import { Mail, Lock, LogIn, UserPlus, Fingerprint, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface AuthProps {
  onAuthSuccess?: (user: any) => void;
  onLogin?: () => void;
  onBack?: () => void;
}

export default function Auth({ onLogin, onAuthSuccess, onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#eab308" },
      links: { color: "#eab308", distance: 200, enable: true, opacity: 0.1, width: 1 },
      move: { direction: "none" as const, enable: true, outModes: { default: "bounce" as const }, random: false, speed: 0.4, straight: false },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: { value: 0.2 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: false,
  }), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: "success", text: isLogin ? "Başarıyla giriş yapıldı, yönlendiriliyorsunuz..." : "Hesap oluşturuldu, giriş yapabilirsiniz." });
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess({ id: "1", name: email.split("@")[0] || "Uzman", email, role: "PREMIUM" });
        }
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-yellow-500/30">
      {/* Background Particles */}
      {init && (
        <Particles id="tsparticles-auth" options={particlesOptions} className="fixed inset-0 z-0 pointer-events-none" />
      )}

       {/* Floating Background Effects */}
       <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
       <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-red-600/10 mix-blend-screen rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Header with Back button and Logo */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute w-full top-0 left-0 p-6 flex justify-between items-center z-50">
         {onBack && (
           <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-yellow-500/20 text-slate-300 hover:text-yellow-400 transition-all border border-white/10 hover:border-yellow-500/50 backdrop-blur-md">
             <ArrowLeft className="w-5 h-5" />
             <span className="text-sm font-medium">Ana Sayfaya Dön</span>
           </button>
         )}
         
         <div className="flex items-center gap-3">
             {/* Sci-Fi Hexagon Logo Container */}
             <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
               <div className="absolute inset-0 bg-yellow-500/20 rotate-45 transform blur-sm transition-all duration-300"></div>
               <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute z-20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
             </div>
             <span className="text-xl font-black tracking-[0.2em] text-white hidden sm:block">
               SYS_<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">ZEYRON</span>
             </span>
          </div>
      </motion.div>

      {/* Auth Card Content */}
      <div className="relative z-10 w-full max-w-md p-6 mt-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative bg-[#0d1017]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">{isLogin ? "Sisteme Giriş" : "Hesap Oluştur"}</h2>
            <p className="text-slate-400 text-sm">Bulut tabanlı İSG yönetim paneline erişin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                <Shield className="w-5 h-5 shrink-0" /> {message.text}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">E-Posta Adresiniz</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                </div>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-xl bg-black/40 text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium" placeholder="isim@sirket.com" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Şifreniz</label>
                {isLogin && <a href="#" className="text-xs text-yellow-500 hover:text-yellow-400 hover:underline">Şifremi Unuttum</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-xl bg-black/40 text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold rounded-xl py-4 mt-8 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? ( <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> ) : ( <>{isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}{isLogin ? "Sisteme Giriş Yap" : "Kayıt Ol"}</> )}
            </button>
          </form>

           <div className="mt-8 text-center border-t border-white/10 pt-6">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-400 hover:text-white transition-colors">
                {isLogin ? <>Hesabınız yok mu? <span className="text-yellow-500 font-semibold hover:underline">Hemen Oluşturun</span></> : <>Zaten üye misiniz? <span className="text-yellow-500 font-semibold hover:underline">Giriş Yapın</span></>}
              </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
