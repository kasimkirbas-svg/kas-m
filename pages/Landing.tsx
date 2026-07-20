import React, { useEffect, useState } from 'react';
import { Shield, FileText, Zap, ChevronRight, Activity, Cpu, Hexagon, ShieldAlert, Target, Search, ChevronDown, CheckCircle2, Factory, HardHat, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
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
      className={`border ${isOpen ? 'border-yellow-500/50 shadow-[0_12px_30px_rgba(202,138,4,0.12)] dark:shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-yellow-50 dark:bg-yellow-500/5' : 'border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/30 hover:border-yellow-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/50'} rounded-lg mb-4 overflow-hidden transition-all duration-300`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 md:p-6 flex items-center justify-between focus:outline-none"
      >
        <h4 className={`text-sm md:text-base font-bold pr-8 transition-colors ${isOpen ? 'text-yellow-400' : 'text-slate-800 dark:text-slate-200'}`}>{question}</h4>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 transform ${isOpen ? 'rotate-180 text-yellow-400' : 'text-slate-600 dark:text-slate-400'}`} />
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
            <div className="p-4 md:p-6 pt-0 text-slate-600 dark:text-slate-400 font-light leading-relaxed border-t border-slate-200 dark:border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFaq, setSearchFaq] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="light-landing min-h-screen bg-[#eef1f5] dark:bg-[#0A0A0A] text-slate-700 dark:text-slate-300 font-sans selection:bg-[#FFD700]/30 selection:text-white overflow-x-hidden relative">
      
      {/* Global background video */}
      <div className="fixed inset-0 z-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.8]">
          <source src="/19024-298313254_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0c0f12]/55"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f12]/15 via-[#0c0f12]/65 to-[#0c0f12]"></div>
      </div>

      {/* Sci-Fi Background Layer */}
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

      {/* Island Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 transition-all duration-500 py-3 sm:py-4 bg-transparent flex items-center justify-between px-3 sm:px-6"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group z-10" 
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative rounded-full overflow-hidden dark:mix-blend-lighten shadow-inner">
               <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
               <img src="/logo.jpeg" alt="İSG Zeyron Logo" className="w-[140%] h-auto object-contain dark:mix-blend-screen drop-shadow-[0_4px_10px_rgba(15,23,42,0.15)] dark:drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] relative z-10" />
            </div>
            <div className="flex flex-col -ml-1">
              <span className="text-sm sm:text-xl font-black tracking-[0.1em] sm:tracking-[0.15em] text-slate-900 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">İSG ZEYRON</span>
              <span className="text-[9px] text-yellow-500/80 font-bold tracking-[0.3em] uppercase leading-none mt-1">Teknoloji</span>
            </div>
          </motion.div>

          <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden lg:block border border-slate-300/80 dark:border-white/10 bg-white/80 dark:bg-[#050510]/50 backdrop-blur-md rounded-full px-6 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.10)] dark:shadow-lg">
            <nav className="flex justify-center space-x-6 items-center">
              {navItems.map((item, idx) => (
                <motion.a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  onClick={(e) => scrollToSection(item.id, e)} 
                  className="relative text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white uppercase tracking-[0.25em] transition-all group py-2 px-4 rounded-full hover:bg-slate-100/70 dark:hover:bg-white/5"
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(234,179,8,1)]"></span>
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6 z-10">
            <button onClick={onRegisterClick} className="hidden md:block text-xs font-black text-slate-900 dark:text-white hover:text-yellow-500 transition-colors tracking-widest uppercase">
              KAYIT OL
            </button>
            <div className="hidden md:block w-px h-6 bg-white/20"></div>
            <button onClick={onLoginClick} className="hidden md:block text-xs font-black text-yellow-600 dark:text-yellow-500 hover:text-slate-900 dark:hover:text-white transition-colors tracking-widest uppercase">
              GİRİŞ YAP
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        
        <div className="max-w-6xl mx-auto w-full relative z-20 mt-10">
             
             <div className="relative z-10 px-0 sm:px-8 py-14 sm:py-20 lg:py-32 lg:px-24 text-center">
                 <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1.05]"
                 >
                    <span className="text-slate-900 dark:text-white">İş Sağlığı ve Güvenliği</span> <br/>
                    <span className="text-[#c58a00] dark:text-[#FFD700] drop-shadow-[0_8px_18px_rgba(197,138,0,0.16)] dark:drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                      Dijital Mimarisi
                    </span>
                 </motion.h1>
                 
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base sm:text-lg md:text-2xl text-slate-700 dark:text-slate-300 mb-10 sm:mb-14 max-w-3xl mx-auto font-light leading-relaxed"
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
                      className="relative w-full sm:w-auto px-10 py-5 bg-[#e9b700] dark:bg-[#FFD700] text-black font-black uppercase text-sm tracking-[0.2em] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group shadow-[0_12px_28px_rgba(197,138,0,0.18)] dark:shadow-[0_0_20px_rgba(255,215,0,0.3)] border border-[#d19b00] dark:border-[#FFD700]/50 rounded-xl"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                      SİSTEME KAYIT OL <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={onLoginClick}
                      className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-black/50 backdrop-blur-md text-amber-300 dark:text-[#FFD700] font-bold uppercase text-sm tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-black/80 border border-slate-900 dark:border-[#FFD700]/30 transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_12px_28px_rgba(15,23,42,0.18)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                      <Target className="w-5 h-5 text-[#FFD700]" /> SİSTEME GİRİŞ YAP
                    </button>
                 </motion.div>
             </div>
        </div>
      </section>

      {/* Elegant Sectors Section */}
      <section className="relative z-20 pb-20 sm:pb-32 px-4 sm:px-6 pt-20 sm:pt-32">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Kapsamlı <span className="text-yellow-500">Sektör</span> Çözümleri</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light text-lg">Her endüstrinin dinamiğine uygun güvenli altyapı protokolleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 
                { icon: <Factory className="w-8 h-8 text-[#FFD700]"/>, title: "İmalat Tesisleri", desc: "Ağır sanayi ve imalathaneler için sıfır toleranslı makine güvenlik formları, LOTO operasyonları.", category: "Endüstri 4.0", video: "fabrika.mp4" },
                { icon: <Zap className="w-8 h-8 text-cyan-300"/>, title: "Enerji Santralleri", desc: "Yüksek gerilim işlemleri, RES/GES risk rejimleri ve trafo bakım talimatnameleri.", category: "Kritik Tesis", video: "enerji.mp4" },
                { icon: <HardHat className="w-8 h-8 text-amber-300"/>, title: "İnşaat Protokolleri", desc: "Yüksekte çalışma onayı, iskele kontrolleri, iş makinesi günlük fişleri, genel durum formları.", category: "Ağır Risk", video: "209883_medium.mp4" },
                { icon: <Activity className="w-8 h-8 text-sky-300"/>, title: "Havacılık Tesisleri", desc: "Apron risk değerlendirmeleri, jet yakıtı depolama denetimleri ve hangarlardaki rejimleri.", category: "Kritik Operasyon", video: "40353-425442466_medium.mp4" }
              ].map((item, i) => (
               <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: i*0.1, duration: 0.6 }} className="group relative rounded-3xl overflow-hidden p-8 border border-slate-300 dark:border-white/10 hover:border-yellow-500/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-[380px]">
                    <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-700">
                      <source src={`/${item.video}`} type="video/mp4" />
                    </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/95 via-[#050510]/70 to-transparent group-hover:via-[#050510]/50 transition-all duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 w-16 h-16 rounded-2xl bg-white/80 dark:bg-black/60 border border-slate-300 dark:border-white/10 flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 backdrop-blur-md transition-all duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)]">{item.icon}</div>
                    <span className="px-3 py-1 bg-black/50 border border-slate-300 dark:border-white/10 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black tracking-widest uppercase rounded w-max mb-6 group-hover:border-yellow-500/30 transition-colors">{item.category}</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-lg group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-light leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors mt-auto mb-4 drop-shadow-md">{item.desc}</p>
                  </div>
               </motion.div>
              ))}
          </div>
        </div>
      </section>

            {/* Superior About Section */}
      <section id="hakkimizda" className="py-20 sm:py-32 relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 text-center relative">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none"></div>
             
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <ShieldAlert className="w-3 h-3" /> Neden İSG Zeyron?
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                  Sıfır Hata, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]">Tam Hakimiyet</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
                  Basit bir belge deposu değil; iş süreçlerini baştan sona optimize eden otonom bir <strong className="text-slate-900 dark:text-white font-medium">SaaS İş İstasyonudur.</strong>
                </p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent group">
                  <div className="bg-white/75 dark:bg-[#050510]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 h-full flex flex-col items-start text-left border border-slate-200 dark:border-white/5 group-hover:border-yellow-500/30 transition-all duration-500 overflow-hidden relative shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:shadow-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full group-hover:bg-yellow-500/10 transition-colors"></div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-500 shadow-lg">
                      <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Otonom Belgelendirme</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Uygulamalarda zamanın büyük bir bölümü belge hazırlamakla geçer. Dijital altyapımız ile bu yükü sıfıra indirerek asıl odak noktanız olan <span className="text-yellow-500 font-medium">"Güvenliğe"</span> odaklanmanızı sağlıyoruz.</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-[1px] rounded-3xl bg-gradient-to-b from-yellow-500/20 to-transparent group">
                  <div className="bg-white/75 dark:bg-[#050510]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 h-full flex flex-col items-start text-left border border-slate-200 dark:border-white/5 group-hover:border-yellow-500/30 transition-all duration-500 overflow-hidden relative shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:shadow-[0_0_30px_rgba(234,179,8,0.05)] text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full group-hover:bg-yellow-500/20 transition-colors"></div>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Cpu className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Akıllı SaaS İstasyonu</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Ekiplerinizi, sahadaki riskleri ve mevzuat süreçlerini tek bir platformda birleştirin. Süreçlerinizi hızlandırırken maliyet ve zamandan tasarruf edin.</p>
                  </div>
                </motion.div>
             </div>
        </div>
      </section>
{/* Cyber FAQ Section */}
      <section id="sss" className="py-20 sm:py-32 relative z-10 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
               <h2 className="text-sm font-bold text-yellow-500 tracking-[0.4em] uppercase mb-4">Sıkça Sorulan Sorular</h2>
               <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10">Merak Ettiklerinizi Hemen Yanıtlayın</p>
               <div className="relative w-full group mb-16 max-w-2xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/5 to-yellow-500/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <input 
                    type="text" 
                    placeholder="Soru arayın... (Örn: Güvenlik, Excel)" 
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                    className="relative w-full bg-white/85 dark:bg-[#0A0D14]/80 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-full px-8 py-5 pl-14 text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-yellow-500 transition-all shadow-[inset_0_1px_2px_rgba(15,23,42,0.05),0_12px_35px_rgba(15,23,42,0.06)] dark:shadow-inner font-medium text-lg"
                  />
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-500 w-6 h-6" />
               </div>

               <div className="space-y-4 text-left">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => (
                      <FAQItem key={idx} idx={idx} question={faq.q} answer={faq.a} />
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-slate-200 dark:border-white/5 border-dashed">
                      <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">Bu sorguya eşleşen veri protokolü bulunamadı.</p>
                    </motion.div>
                  )}
               </div>
             </motion.div>
        </div>
      </section>

{/* Footer */}
      <footer className="bg-transparent py-16 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-20 mb-8 opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center rounded-full overflow-hidden mix-blend-lighten">
            <img src="/logo.jpeg" alt="İSG Zeyron Footer Logo" className="w-[120%] h-auto object-contain grayscale hover:grayscale-0 mix-blend-screen transition-all duration-500" />
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6 justify-center w-full max-w-lg">
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">Gizlilik</span>
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">Şartlar</span>
             <span className="text-xs font-bold text-slate-500 hover:text-yellow-500 cursor-pointer uppercase tracking-widest transition-colors">İletişim</span>
          </div>
          <div className="flex gap-6 mb-10 justify-center w-full max-w-lg">
             <a href="#" className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-yellow-500 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-300">
               <Instagram className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-yellow-500 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-300">
               <Linkedin className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-yellow-500 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-300">
               <Facebook className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-yellow-500 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-300">
               <Twitter className="w-4 h-4" />
             </a>
          </div>
          <p className="text-slate-600 text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="text-slate-600 dark:text-slate-400">İSG Zeyron Teknoloji.</span> Tüm hakları gizlilik kalkanı altındadır.
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;