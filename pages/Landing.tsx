import React, { useEffect, useState, useMemo } from 'react';
import { Shield, FileText, Zap, ChevronRight, Activity, Cpu, Hexagon, ShieldAlert, Target, Search, ChevronDown, CheckCircle2, Factory, HardHat } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { motion, AnimatePresence } from 'framer-motion';

interface LandingProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const FAQItem = ({ question, answer, idx }: { question: string, answer: string, idx: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className={`border ${isOpen ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-yellow-500/5' : 'border-white/10 bg-zinc-900/30 hover:border-yellow-500/30 hover:bg-zinc-800/50'} rounded-lg mb-4 overflow-hidden transition-all duration-300`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 md:p-6 flex items-center justify-between focus:outline-none"
      >
        <h4 className={`text-sm md:text-base font-bold pr-8 transition-colors ${isOpen ? 'text-yellow-400' : 'text-slate-200'}`}>{question}</h4>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 transform ${isOpen ? 'rotate-180 text-yellow-400' : 'text-slate-400'}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 text-slate-400 font-light leading-relaxed border-t border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onRegisterClick }) => {
  const [init, setInit] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFaq, setSearchFaq] = useState('');

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: "#eab308" },
      links: { color: "#eab308", distance: 150, enable: true, opacity: 0.1, width: 1 },
      move: { direction: "none" as const, enable: true, outModes: { default: "bounce" as const }, random: false, speed: 0.6, straight: false },
      number: { density: { enable: true, area: 1000 }, value: 40 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: false,
  }), []);

  const navItems = [
    { label: "HAKKIMIZDA", id: "hakkimizda" },
    { label: "AVANTAJLAR", id: "avantajlar" },
    { label: "S.S.S", id: "sss" }
  ];

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const faqs = [
    { q: "1. İSG Zeyron nedir?", a: "İSG Zeyron; İş Sağlığı ve Güvenliği uzmanları, İSG teknikerleri, OSGB'ler ve işverenler için geliştirilen web tabanlı (SaaS) bir İSG doküman ve süreç yönetim platformudur." },
    { q: "2. İSG Zeyron'u kimler kullanabilir?", a: "A, B ve C sınıfı İş Güvenliği Uzmanları, İSG Teknikerleri, OSGB'ler, az tehlikeli sınıfta kendi İSG hizmetini yürüten işverenler ve İSG süreçlerini dijital ortamda yönetmek isteyen tüm işletmeler kullanabilir." },
    { q: "3. Program kurulumu gerekiyor mu?", a: "Hayır. İSG Zeyron tamamen web tabanlıdır. Herhangi bir program indirmenize veya kurmanıza gerek yoktur." },
    { q: "4. Hangi cihazlardan kullanabilirim?", a: "Bilgisayar, dizüstü bilgisayar, tablet ve internet tarayıcısı bulunan akıllı telefonlardan güvenle kullanılabilir." },
    { q: "8. Dokümanlar sistemde kayıt altına alınıyor mu?", a: "Hayır. Hazırlanan belgeler sistemde kalıcı saklanmaz kullanıcı kendi cihazına indirir." },
    { q: "9. Verilerim güvende mi?", a: "Evet. Hizmetlerimiz KVKK hükümleri doğrultusunda yürütülmektedir, teknik/idari güvenlik tamdır." },
    { q: "10. Excel veya Word bilgisi gerekiyor mu?", a: "Hayır. Arayüzümüz eğitim/bilgi gerektirmeyecek kadar basittir." },
    { q: "28. Kendi notlarımı ekleyebilir miyim?", a: "Evet, sadece standart şablonlardan ibaret değildir, özel saptamalarınızı ekleyebilirsiniz." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase()));

  const advantages = [
    { icon: <Shield className="w-6 h-6 text-[#FFD700]" />, title: "Mevzuata Uygunluk", desc: "Tüm form ve planlar güncel A Sınıfı İSG mevzuatına göre oluşturulur." },
    { icon: <Cpu className="w-6 h-6 text-[#FFD700]" />, title: "Dijital Altyapı", desc: "Kağıt yığınlarını unutun. Sistem veriyi saniyeler içinde dokümana çevirir." },
    { icon: <Zap className="w-6 h-6 text-[#FFD700]" />, title: "Pratik Kullanım", desc: "Excel veya Word bilgisi gerekmeden tek panelden otomasyon." }
  ];

  const targetUsers = [
    "A, B ve C sınıfı İş Güvenliği Uzmanları",
    "İş Sağlığı ve Güvenliği Teknikerleri",
    "Ortak Sağlık Güvenlik Birimleri (OSGB)",
    "Az tehlikeli sınıfta kendi hizmetini yürüten İşverenler",
    "Süreçleri dijitalleştirmek isteyen tüm işletmeler"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans selection:bg-[#FFD700]/30 selection:text-white overflow-x-hidden relative">
      
      {/* Dynamic Video Background Architecture */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-25"
        >
          <source src="/159052-818026310_medium.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      {/* Sci-Fi Background Layer */}
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

      {init && <Particles id="tsparticles" options={particlesOptions} className="fixed inset-0 z-0 pointer-events-none" />}

      {/* Island Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl z-50 transition-all duration-500 rounded-full border border-white/10 bg-[#050510]/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 py-3"
      >
        <div className="flex items-center justify-between w-full">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="w-12 h-12 flex items-center justify-center relative rounded-full overflow-hidden mix-blend-lighten shadow-inner">
               <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
               <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="w-[140%] h-auto object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] relative z-10" />
            </div>
            <div className="flex flex-col -ml-1">
              <span className="text-xl font-black tracking-[0.15em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">İSG ZEYRON</span>
              <span className="text-[9px] text-yellow-500/80 font-bold tracking-[0.3em] uppercase leading-none mt-1">Teknoloji</span>
            </div>
          </motion.div>

          <nav className="hidden lg:flex flex-1 justify-center space-x-10">
            {navItems.map((item, idx) => (
              <motion.a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => scrollToSection(item.id, e)} 
                className="relative text-[11px] font-black text-slate-300 hover:text-yellow-400 uppercase tracking-[0.15em] transition-colors group py-2"
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></span>
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button onClick={onRegisterClick} className="hidden md:block text-xs font-black text-white hover:text-yellow-500 transition-colors tracking-widest uppercase">
              KAYIT OL
            </button>
            <div className="hidden md:block w-px h-6 bg-white/20"></div>
            <button onClick={onLoginClick} className="hidden md:block text-xs font-black text-yellow-500 hover:text-white transition-colors tracking-widest uppercase">
              GİRİŞ YAP
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section floating Island */}
      <section className="relative pt-40 pb-32 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        <div className="max-w-6xl mx-auto w-full relative z-20 rounded-[3rem] overflow-hidden bg-[#0A0D14]/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] mt-10">
             <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity">
                <source src="/159052-818026310_medium.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60"></div>
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.1)_0%,rgba(0,0,0,0)_80%)]"></div>

             <div className="relative z-10 px-8 py-20 lg:py-32 lg:px-24 text-center">
                 <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.05]"
                 >
                    <span className="text-white">İş Sağlığı ve Güvenliği</span> <br/>
                    <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                      Dijital Mimarisi
                    </span>
                 </motion.h1>
                 
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto font-light leading-relaxed"
                 >
                    Gerçek zamanlı form yönetimi, mevzuata tam uyumlu otonom belgeler ve 
                    kapsamlı OSGB altyapısı ile operasyonlarınızı ışık hızında yönetin.
                 </motion.p>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                 >
                    <button 
                      onClick={onRegisterClick}
                      className="relative w-full sm:w-auto px-10 py-5 bg-[#FFD700] text-black font-black uppercase text-sm tracking-[0.2em] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group shadow-[0_0_20px_rgba(255,215,0,0.3)] border border-[#FFD700]/50 rounded-xl"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                      SİSTEME KAYIT OL <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={onLoginClick}
                      className="w-full sm:w-auto px-10 py-5 bg-black/50 backdrop-blur-md text-[#FFD700] font-bold uppercase text-sm tracking-[0.2em] hover:bg-black/80 border border-[#FFD700]/30 transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                      <Target className="w-5 h-5 text-[#FFD700]" /> SİSTEME GİRİŞ YAP
                    </button>
                 </motion.div>
             </div>
        </div>
      </section>

      {/* Elegant Sectors Grid */}
      <section className="relative z-20 overflow-hidden pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[ 
              { icon: <Factory className="w-8 h-8 text-[#FFD700]"/>, title: "İmalat Tesisleri", desc: "Ağır sanayi ve imalathaneler için sıfır toleranslı makine güvenlik formları, LOTO operasyonları.", video: "/fabrika.mp4", category: "Endüstri 4.0", color: "#FFD700" },
              { icon: <Zap className="w-8 h-8 text-blue-400"/>, title: "Enerji Santralleri", desc: "Yüksek gerilim işlemleri, RES/GES risk rejimleri ve trafo bakım talimatnameleri.", video: "/enerji.mp4", category: "Kritik Tesis", color: "blue-500" },
              { icon: <HardHat className="w-8 h-8 text-orange-500"/>, title: "İnşaat Protokolleri", desc: "Yüksekte çalışma onayı, iskele kontrolleri, iş makinesi günlük fişleri, genel durum formları.", video: "/67467-522170635_medium.mp4", category: "Ağır Risk", color: "orange-500" },
              { icon: <Activity className="w-8 h-8 text-pink-500"/>, title: "Havacılık Tesisleri", desc: "Apron risk değerlendirmeleri, jet yakıtı depolama denetimleri ve hangarlardaki rejimleri.", video: "/40353-425442466_medium.mp4", category: "Kritik Operasyon", color: "pink-500" }
            ].map((item, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: i*0.1, duration: 0.6 }} className="group relative h-[380px] bg-[#111111] rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-500/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex-1">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"><source src={item.video} type="video/mp4" /></video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <div className="mb-auto mt-4 w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-2xl">{item.icon}</div>
                    <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded w-max mb-4 backdrop-blur-md">{item.category}</span>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-300 text-sm font-light leading-relaxed max-w-xs opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                </div>
             </motion.div>
            ))}
        </div>
      </section>

            {/* Target Audience / About Grid */}
      <section id="hakkimizda" className="py-24 relative z-10 mx-auto px-6 max-w-7xl">
        <div className="relative rounded-[3rem] overflow-hidden bg-[#0A0D14] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] min-h-[500px] flex items-center">
             <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
                <source src="/159052-818026310_medium.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent"></div>
             
             <div className="relative z-10 p-12 lg:p-20 grid lg:grid-cols-2 gap-16 items-center w-full">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-8 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)]">Hakkımızda</div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">İSG Operasyonlarında <br/><span className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">Tam Hakimiyet</span></h2>
                  <div className="space-y-6 text-slate-300 font-light text-lg">
                    <p>Uygulamalarda zamanın büyük bir bölümü belge hazırlamakla geçer. İSG Zeyron bu yükü dijital ortama taşıyarak, dikkatinizi asıl noktanıza, "Güvenliğe" vermenizi sağlar.</p>
                    <div className="flex items-start gap-4 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                      <ShieldAlert className="w-8 h-8 text-yellow-500 shrink-0 mt-1" />
                      <p className="text-sm font-medium text-slate-200 italic">Sadece bir belge deposu değil; iş süreçlerini optimize eden aktif, otomatize bir SaaS çalışma istasyonudur.</p>
                    </div>
                  </div>
                </motion.div>
             </div>
        </div>
      </section>
{/* Cyber FAQ Section */}
      <section id="sss" className="py-32 relative z-10 bg-[#020305] border-t border-white/5">
        <div className="fixed left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.03)_0%,rgba(0,0,0,0)_100%)] pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative"
             >
               <h2 className="text-sm font-bold text-yellow-500 tracking-[0.4em] uppercase mb-4">Kapsamlı Soru Ağı</h2>
               <p className="text-4xl md:text-5xl font-black text-white mb-10">Merak Ettiklerinizi Hemen Yanıtlayın</p>
               <div className="relative w-full group mb-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/5 to-yellow-500/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <input 
                    type="text" 
                    placeholder="Soru arayın... (Örn: Güvenlik, Excel)" 
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                    className="relative w-full bg-[#0A0D14] border border-white/20 rounded-full px-8 py-5 pl-14 text-white placeholder-slate-500 outline-none focus:border-yellow-500 transition-all shadow-inner font-medium text-lg"
                  />
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-500 w-6 h-6" />
               </div>

               <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[350px]">
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
                    <source src="/292294_medium.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020305] via-transparent to-transparent"></div>
               </div>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-4"
             >
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => (
                    <FAQItem key={idx} idx={idx} question={faq.q} answer={faq.a} />
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                    <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                    <p className="text-slate-400 font-medium text-lg">Bu sorguya eşleşen veri protokolü bulunamadı.</p>
                  </motion.div>
                )}
             </motion.div>
          </div>
        </div>
      </section>

{/* Footer */}
      <footer className="border-t border-white/5 bg-[#030406] py-16 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-20 mb-8 opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center rounded-full overflow-hidden mix-blend-lighten">
            <img src="/logo.jpeg" alt="İSG Zeyron Footer Logo" className="w-[120%] h-auto object-contain grayscale hover:grayscale-0 mix-blend-screen transition-all duration-500" />
          </div>
          <div className="flex gap-8 mb-10 border-b border-white/5 pb-10 justify-center w-full max-w-lg">
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">Gizlilik</span>
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">Şartlar</span>
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">İletişim</span>
          </div>
          <p className="text-slate-600 text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="text-slate-400">İSG Zeyron Teknoloji.</span> Tüm hakları gizlilik kalkanı altındadır.
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;