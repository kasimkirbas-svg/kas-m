import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Lock, LogIn, UserPlus, Fingerprint, Shield, Star, Rocket, Cpu, Eye, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import { initParticlesEngine } from '@tsparticles/react';

interface AuthProps {
  onLogin: () => void;
}

const FAQ_ITEMS = [
  { question: 'İSG Zeyron Nedir?', answer: 'İş sağlığı ve güvenliği profesyonelleri için geliştirilmiş yeni nesil bir doküman yönetim asistanıdır. Yapay zeka destekli altyapısıyla karmaşık süreçlerinizi optimize eder.' },
  { question: 'Sistem Hangi Dokümanları Destekler?', answer: 'Risk değerlendirme raporları, acil durum eylem planları, eğitim katılım tutanakları dahil olmak üzere tüm temel İSG dokümanlarını saniyeler içinde oluşturmanızı sağlar.' },
  { question: 'Verilerim Güvende Mi?', answer: 'Askeri düzeyde şifreleme ve KVKK uyumlu veri merkezlerimiz ile verileriniz %100 güvence altındadır.' },
  { question: 'Nasıl Başlayabilirim?', answer: 'Hemen ücretsiz bir hesap oluşturarak 14 günlük deneme sürenizi başlatabilir, İSG süreçlerinizi dijitalleştirmeye adım atabilirsiniz.' }
];

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: '#050510',
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#eab308', // Gold color match
      },
      links: {
        color: '#eab308',
        distance: 200,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: false,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 120,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin();
    } catch (err) {
      setMessage({ type: 'error', text: 'Sistem bağlantısı kurulamadı. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 relative overflow-hidden font-sans flex flex-col justify-between selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Dynamic Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Floating Orbs / Glow Effects */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none z-0"
      />

      {/* Background Video (Simulated overlay since we have particles, but we can add a subtle noise/grid) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-0 mix-blend-overlay pointer-events-none"></div>
      
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full flex justify-between items-center px-10 py-6 absolute top-0 left-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/20"
      >
        <div className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300">
            <Shield className="w-6 h-6 text-[#050510] z-10" />
            <div className="absolute inset-0 border border-yellow-200/30 rounded-2xl"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col"
          >
            <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 drop-shadow-sm uppercase">ISG Zeyron</span>
            <span className="text-[0.65rem] tracking-[0.2em] text-yellow-500/70 font-semibold uppercase">Premium İş Güvenliği Asistanı</span>
          </motion.div>
        </div>
        
        <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide">
          <a href="#vision" className="text-slate-400 hover:text-yellow-400 transition-colors uppercase text-xs">VİZYON</a>
          <a href="#features" className="text-slate-400 hover:text-yellow-400 transition-colors uppercase text-xs">ÖZELLİKLER</a>
          <a href="#faq" className="text-slate-400 hover:text-yellow-400 transition-colors uppercase text-xs">S.S.S.</a>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 pt-28 pb-10">
        
        {/* Left Column: Hero & Marketing */}
        <div className="flex-1 px-10 lg:px-20 flex flex-col justify-center py-10 overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)]">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-8 shadow-inner shadow-yellow-500/10 backdrop-blur-sm">
              <Rocket className="w-4 h-4" />
              <span>Geleceğin İSG Teknolojisi</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500 tracking-tight"
            >
              Doküman Yönetiminde <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">Uzay Çağına</span> Geçin.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-light">
              Yapay zeka ile güçlendirilmiş altyapı, fütüristik tasarım ve sıfır hata toleransı. 
              İş sağlığı ve güvenliği profesyonelleri için <span className="font-semibold text-yellow-500/90">nihai komuta merkezi.</span>
            </motion.p>

            {/* Vision Cards Grid */}
            <div id="vision" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 relative">
              {/* Card glow behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-yellow-500/5 via-transparent to-amber-500/5 blur-3xl rounded-full z-[-1] pointer-events-none"></div>
              
              <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="group p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-yellow-500/40 hover:bg-yellow-500/[0.05] transition-all duration-300 relative overflow-hidden backdrop-blur-xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Cpu className="w-8 h-8 text-yellow-500 mb-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold text-lg mb-2">Akıllı Otomasyon</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Binlerce veriyi saniyeler içinde analiz edip, şirketinize özel formları otomatik oluşturur.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="group p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-yellow-500/40 hover:bg-yellow-500/[0.05] transition-all duration-300 relative overflow-hidden backdrop-blur-xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Eye className="w-8 h-8 text-amber-500 mb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transform group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold text-lg mb-2">Canlı Önizleme</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Değişiklikleri iframe teknolojisiyle anında ve %100 doğrulukla tam ekranda görün.</p>
              </motion.div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="mt-10">
              <motion.h2 variants={itemVariants} className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-6 flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-400" /> Sıkça Sorulan Sorular
              </motion.h2>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    className="p-5 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors backdrop-blur-sm"
                  >
                    <h4 className="text-white font-medium text-sm mb-2 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      {item.question}
                    </h4>
                    <p className="text-sm text-slate-400 pl-4">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

        {/* Right Column: Auth Panel */}
        <div className="w-full lg:w-[550px] relative px-6 lg:px-12 flex items-center justify-center shrink-0 h-[calc(100vh-8rem)]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
            className="w-full relative"
          >
            {/* Panel Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-[2.5rem] blur-xl opacity-60"></div>
            
            <div className="relative bg-[#090912]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-black">
              
              <div className="mb-10 text-center">
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400/10 to-amber-600/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                >
                  <Fingerprint className="w-8 h-8 text-yellow-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Sisteme Giriş Yap</h2>
                <p className="text-slate-400 text-sm">Zeyron ISG Komuta Merkezine hoş geldiniz.</p>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 border text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{message.text}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">E-Posta Adresi</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-xl bg-white/[0.03] text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-white/[0.05] transition-all shadow-inner"
                      placeholder="isguzmani@firma.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Şifre</label>
                    {isLogin && (
                      <a href="#" className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors">Şifremi Unuttum</a>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-xl bg-white/[0.03] text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-white/[0.05] transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Doğrulama Kodu</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                      </div>
                      <input
                        required={!isLogin}
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-xl bg-white/[0.03] text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-white/[0.05] transition-all shadow-inner"
                        placeholder="Şirket Kodu"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-[#090912] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] mt-6 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Doğrulanıyor...
                      </>
                    ) : (
                      <>
                        {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        {isLogin ? 'Sisteme Giriş Yap' : 'Kayıt Ol'}
                      </>
                    )}
                  </span>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                </motion.button>
              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full"
                >
                  {isLogin ? (
                    <>Hesabınız yok mu? <span className="text-yellow-500 font-semibold hover:underline">Hemen Oluşturun</span></>
                  ) : (
                    <>Zaten üye misiniz? <span className="text-yellow-500 font-semibold hover:underline">Giriş Yapın</span></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
