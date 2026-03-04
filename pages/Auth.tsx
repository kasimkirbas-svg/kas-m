import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Key, Mail, Lock, User, ArrowRight, Loader2, 
  ShieldCheck, Zap, Sparkles, Hexagon
} from 'lucide-react';
import { fetchApi } from '../src/utils/api';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  language?: 'tr' | 'en' | 'ar';
  t?: any;
}

// -- Components --

const InputGroup = ({ icon: Icon, ...props }: any) => (
  <div className="relative group">
     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors duration-300 pointer-events-none z-10">
        <Icon size={18} />
     </div>
     <input 
        {...props}
        className="w-full bg-[#050510] border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all duration-300 group-hover:border-slate-700 font-medium"
     />
     {/* Glowing Border Bottom */}
     <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-amber-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center opacity-70 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
  </div>
);

const SubmitButton = ({ children, isLoading }: any) => (
  <button 
    disabled={isLoading}
    className="w-full relative overflow-hidden bg-white text-slate-900 mt-2 py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed group z-10 hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98]"
  >
     {isLoading ? (
       <div className="flex justify-center items-center">
         <Loader2 className="animate-spin text-slate-900" size={20} />
       </div>
     ) : (
       <span className="relative z-10 flex items-center justify-center gap-3 mix-blend-difference text-white group-hover:text-amber-400 transition-colors duration-300">
         {children}
       </span>
     )}
     {/* Animated Sweep within button */}
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:transition-opacity duration-300 pointer-events-none transform -skew-x-[35deg] -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
     <div className="absolute inset-0 bg-slate-900 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
  </button>
);

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, language }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  
  // Mouse 3D Perspective Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = (e.clientX / innerWidth) - 0.5;
      const yPct = (e.clientY / innerHeight) - 0.5;
      x.set(xPct); 
      y.set(yPct);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Subtle rotation based on mouse position
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  
  // Shine layer moves opposite to mouse for reflection effect
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const shineOpacity = useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.1, 0]);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    confirmPassword: ''
  });

  // Toast Logic
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const performLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { showToast('error', 'Lütfen tüm alanları doldurun.'); return; }
    
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: formData.email, password: formData.password }) });
        const text = await res.text();
        let data; try { data = JSON.parse(text); } catch(e) { throw new Error('Sunucu hatası.'); }
        
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            
            // Success! Trigger The "Door Opening" Effect
            setDoorOpen(true);
            
            // Wait for animation before actually switching view
            setTimeout(() => {
                onLoginSuccess(data.user);
            }, 1800); // Wait for the "suck in" animation
        } else { 
            throw new Error(data.message || 'Giriş Başarısız.'); 
        }
    } catch (err: any) { 
        showToast('error', err.message || 'Sunucu Hatası.'); 
    } finally { 
        setIsLoading(false); 
    }
  };

  const performSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { showToast('error', 'Şifreler eşleşmiyor.'); return; }
    setIsLoading(true);
    try {
        const res = await fetchApi('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, companyName: formData.companyName }) });
        const data = await res.json();
        if (res.ok && data.success) {
            if (data.token) localStorage.setItem('authToken', data.token);
            showToast('success', 'Hesap Oluşturuldu! Yönlendiriliyorsunuz...');
            
            setDoorOpen(true);
            setTimeout(() => {
                onLoginSuccess(data.user);
            }, 1800);
        } else { throw new Error(data.message || 'Kayıt Başarısız.'); }
    } catch (err: any) { showToast('error', err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="relative w-full h-screen bg-[#020205] overflow-hidden flex items-center justify-center perspective-[1200px] selection:bg-amber-500/30 selection:text-white">
      
      {/* --- THE PLATFORM (Background Environment) --- */}
      <div className="absolute inset-0 pointer-events-none transform-style-3d overflow-hidden">
          
          {/* MASSIVE BRANDING TYPOGRAPHY IN BACKGROUND */}
          <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0 flex flex-col items-center justify-center">
             <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.03, scale: 1 }}
                transition={{ duration: 2 }}
                className="text-[15vw] font-black text-white leading-none tracking-[0.05em] uppercase"
             >
                KIRBAŞ
             </motion.h1>
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.05, y: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="text-[3vw] font-bold text-amber-500 tracking-[0.5em] uppercase mt-[-2vw]"
             >
                Global Platform
             </motion.h2>
          </div>

          {/* GLOBAL CONSISTENT BACKGROUND (Blobs) */}
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#1e1b4b]/40 blur-[150px] animate-pulse z-0 transform translate-z-[-200px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full bg-[#f59e0b]/20 blur-[150px] animate-pulse-slow z-0 transform translate-z-[-200px]"></div>
          
          {/* Animated Platform Grid */}
          <div className="absolute inset-0 bg-[#020308] -z-10 mix-blend-screen">
              {/* Radial gradient fading to dark */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#020205_80%)] z-10"></div>
              
              {/* Floor Grid - The "Platform" Base */}
              <div className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[80%] bg-[linear-gradient(transparent_0%,_rgba(245,158,11,0.15)_100%)] transform perspective-[1000px] rotate-x-[75deg] origin-top opacity-60">
                 <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
                 {/* Moving light sweep on the floor */}
                 <motion.div 
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-x-0 h-[200px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent"
                 />
              </div>

               {/* Ceiling Grid - The "Platform" Roof */}
               <div className="absolute top-[-20%] left-[-50%] right-[-50%] h-[80%] bg-[linear-gradient(to_top,transparent_0%,_rgba(30,27,75,0.4)_100%)] transform perspective-[1000px] -rotate-x-[75deg] origin-bottom opacity-40">
                 <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
              </div>
          </div>
          
          {/* Dramatic Spotlight from Top - The Light Source */}
          <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
          ></motion.div>
          
          {/* Accents floating in the "air" - High Tech Elements */}
           <motion.div animate={{ y: [0, -30, 0], rotate: [0, 90, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-48 h-48 border border-amber-500/10 rounded-full flex items-center justify-center pointer-events-none">
             <div className="w-32 h-32 border border-indigo-500/10 rounded-full border-dashed"></div>
           </motion.div>
           <motion.div animate={{ y: [0, 30, 0], rotate: [0, -90, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-purple-500/10 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
           </motion.div>
      </div>

      {/* --- THE PORTAL ANIMATION (Overlay when success) --- */}
      <AnimatePresence>
        {doorOpen && (
            <motion.div 
               initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
               animate={{ scale: 30, opacity: 1, borderRadius: "0%" }}
               transition={{ duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] }}
               className="fixed inset-0 z-[100] bg-white pointer-events-none flex items-center justify-center origin-center"
            >
               {/* Inner blinding light */}
               <div className="absolute inset-0 bg-white"></div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE DOOR (Main Card) --- */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: doorOpen ? 0 : 1, scale: doorOpen ? 5 : 1, y: 0, filter: doorOpen ? "brightness(2) blur(10px)" : "none" }}
        transition={{ duration: doorOpen ? 1.5 : 0.8, type: doorOpen ? "tween" : "spring", ease: "easeInOut" }}
        className="relative z-20 w-full max-w-[440px] px-6 group"
      >
          {/* Outer Glow (The Aura) */}
          <div className="absolute -inset-4 bg-gradient-to-t from-amber-500/40 via-indigo-500/40 to-amber-500/40 rounded-[40px] opacity-60 blur-3xl group-hover:opacity-80 transition-opacity duration-1000 animate-pulse pointer-events-none transform translate-z-[-50px]"></div>
          
          {/* The Platform Access Panel */}
          <div className="relative bg-[#05050a]/80 backdrop-blur-3xl border border-slate-800 rounded-[30px] p-[2px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transform-style-3d">
              
              {/* Animated Border Sweep */}
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(245,158,11,0.6)_360deg)] pointer-events-none z-0"
              />

              {/* Inner Card */}
              <div className="bg-[#0a0a12] rounded-[28px] p-8 md:p-10 relative overflow-hidden h-full z-10 backdrop-blur-2xl">
                  
                  {/* Subtle Noise Texture */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                  
                  {/* Header: Brand Icon */}
                  <div className="text-center mb-8 relative z-20">
                      <motion.div 
                         initial={{ y: -20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                         className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-5 relative group cursor-pointer transform transition-all hover:scale-110 hover:rotate-6 ring-2 ring-amber-300/50"
                      >
                         <div className="absolute inset-0 bg-amber-400 blur-xl opacity-60 rounded-2xl animate-pulse"></div>
                         <Hexagon size={40} className="text-white fill-white/30 relative z-10 drop-shadow-md" strokeWidth={2} />
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 tracking-tight"
                      >
                          {view === 'login' ? 'PLATFORM GİRİŞİ' : 'PLATFORMA KATILIN'}
                      </motion.h1>
                      <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 0.4 }}
                        className="text-amber-500 text-[10px] mt-2 font-black tracking-[0.3em] uppercase bg-amber-500/10 inline-block px-3 py-1 rounded-full border border-amber-500/20"
                      >
                          Güvenli Bağlantı
                      </motion.p>
                  </div>

                  {/* Form Container */}
                  <div className="relative z-20 min-h-[300px]">
                      <AnimatePresence mode="wait">
                          {view === 'login' ? (
                              <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={performLogin}
                                className="space-y-5"
                              >
                                  <InputGroup icon={Mail} type="email" name="email" placeholder="E-Posta Adresi" value={formData.email} onChange={handleInputChange} autoFocus />
                                  <InputGroup icon={Lock} type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleInputChange} />
                                  
                                  <div className="flex justify-between items-center px-1">
                                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                                          <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500/50" />
                                          Beni Hatırla
                                      </label>
                                      <button type="button" className="text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium">Şifremi Unuttum?</button>
                                  </div>

                                  <div className="pt-2">
                                    <SubmitButton isLoading={isLoading}>
                                        Giriş Yap <ArrowRight size={18} />
                                    </SubmitButton>
                                  </div>
                              </motion.form>
                          ) : (
                              <motion.form
                                key="signup-form"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={performSignup}
                                className="space-y-4"
                              >
                                  <InputGroup icon={User} type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} />
                                  <InputGroup icon={Sparkles} type="text" name="companyName" placeholder="Şirket Adı" value={formData.companyName} onChange={handleInputChange} />
                                  <InputGroup icon={Mail} type="email" name="email" placeholder="E-Posta" value={formData.email} onChange={handleInputChange} />
                                  <div className="grid grid-cols-2 gap-3">
                                    <InputGroup icon={Lock} type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleInputChange} />
                                    <InputGroup icon={ShieldCheck} type="password" name="confirmPassword" placeholder="Tekrar" value={formData.confirmPassword} onChange={handleInputChange} />
                                  </div>

                                  <div className="pt-2">
                                    <SubmitButton isLoading={isLoading}>
                                        Kayıt Ol <Zap size={18} />
                                    </SubmitButton>
                                  </div>
                              </motion.form>
                          )}
                      </AnimatePresence>
                  </div>

                  {/* Footer Toggle */}
                  <div className="mt-6 pt-6 border-t border-white/5 text-center relative z-20">
                      <p className="text-slate-500 text-xs font-medium">
                          {view === 'login' ? "Henüz bir hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
                          <button 
                             onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                             className="text-white hover:text-amber-400 font-bold transition-all ml-1 hover:underline decoration-amber-500 underline-offset-4"
                          >
                             {view === 'login' ? "Hesap Oluşturun" : "Giriş Yapın"}
                          </button>
                      </p>
                  </div>
              </div>
          </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md border z-[999]
              ${toast.type === 'error' 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-rose-900/20' 
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-emerald-900/20'
              }`}
          >
            {toast.type === 'error' ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

