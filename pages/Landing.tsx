import React, { useEffect, useState, useMemo } from 'react';
import { Shield, FileText, Zap, ChevronRight, Activity, Cpu, Hexagon, ShieldAlert, Target } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface LandingProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onRegisterClick }) => {
  const [init, setInit] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.5, color: "#eab308" }
        },
      },
    },
    particles: {
      color: {
        value: "#eab308",
      },
      links: {
        color: "#eab308",
        distance: 120,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "out" as const,
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40,
      },
      opacity: {
        value: 0.3,
        animation: { enable: true, speed: 1, minimumValue: 0.1 }
      },
      shape: {
        type: "triangle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: false,
  }), []);

  const navItems = ["Sistem_Mimarisi", "Modüller", "Protokoller"];

  const features = [
    {
      icon: <Activity className="w-8 h-8 text-yellow-500" />,
      title: "Dinamik HUD Modülü",
      description: "Gerçek zamanlı veri senkronizasyonu ile belgelerinizi ışık hızında güncelleyin."
    },
    {
      icon: <Cpu className="w-8 h-8 text-yellow-500" />,
      title: "Merkezi Veri Çekirdeği",
      description: "Tüm form ve dokümanlarınızı kriptografik şifreleme alt yapısıyla tek çekirdekte toplayın."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-yellow-500" />,
      title: "Otonom Risk Analizi",
      description: "Sistem hatalarını ve iş güvenliği risklerini algılayan akıllı algoritmalar."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-white">
      {/* Sci-Fi Background Overlay */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.03)_0%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="fixed inset-0 z-0 pointer-events-none"
        />
      )}

      {/* Cybernetic Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#020408]/90 backdrop-blur-md border-yellow-500/20 py-2 shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-12 h-12 flex items-center justify-center">
               {/* Glowing hex background instead of broken black box */}
               <div className="absolute inset-0 bg-yellow-500/20 rotate-45 transform blur-sm group-hover:bg-yellow-500/40 transition-all duration-500"></div>
               <Hexagon className="w-10 h-10 text-yellow-500 relative z-10 animate-pulse" />
               <Shield className="w-5 h-5 text-white absolute z-20" />
            </div>
            <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-yellow-600 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">SYS_ZEYRON</span>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-12">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] relative group overflow-hidden">
                {item}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-xs tracking-widest text-slate-300 font-bold uppercase hover:text-yellow-500 transition-colors"
            >
              [ BAĞLAN ]
            </button>
            <button 
              onClick={onRegisterClick}
              className="px-6 py-2 bg-transparent border border-yellow-500 text-yellow-500 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] relative overflow-hidden group"
            >
              <span className="absolute w-full h-full bg-yellow-500/20 left-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 skew-x-[-20deg]"></span>
              <span className="relative z-10 text-shadow-sm">SİSTEME_KAYIT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-500/30 bg-yellow-500/10 rounded-none mb-8">
              <Zap className="w-4 h-4 text-yellow-500 animate-bounce" />
              <span className="text-yellow-500 text-xs font-bold tracking-[0.3em] uppercase">V_2.0_Çekirdek_Aktif</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              <span className="block text-white mb-2">İŞ_GÜVENLİĞİ</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                KONTROL_ÜSSÜ
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed border-l-2 border-yellow-500/50 pl-4">
              Zeyron Otonom Belge Üreticisi, manuel operasyonları hiper hıza çıkarır. 
              Parametreleri girin, Word (.docx) algoritmalarımız saniyeler içinde binlerce 
              sayfalık kurumsal raporları sentezlesin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button 
                onClick={onRegisterClick}
                className="group relative px-8 py-4 bg-yellow-500 text-black font-black uppercase text-sm tracking-[0.2em] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="flex items-center gap-2 relative z-10">
                  SİSTEMİ_BAŞLAT <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-black"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-black"></div>
              </button>
              
              <button className="px-8 py-4 bg-zinc-900 border border-white/10 text-white font-bold uppercase text-sm tracking-[0.2em] hover:bg-white/5 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2 group">
                <Target className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 transition-colors" /> SIMÜLASYONU_GÖR
              </button>
            </div>
            
            <div className="mt-16 flex items-center justify-center lg:justify-start gap-8 opacity-60">
               <div className="text-xs font-bold tracking-widest text-slate-500 flex flex-col gap-1">
                 <span className="text-yellow-500 text-xl font-black">99.9%</span>
                 <span>SİSTEM UPTİME</span>
               </div>
               <div className="w-px h-8 bg-slate-800"></div>
               <div className="text-xs font-bold tracking-widest text-slate-500 flex flex-col gap-1">
                 <span className="text-yellow-500 text-xl font-black">2.4M+</span>
                 <span>İŞLENEN VERİ BİTİ</span>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
             {/* Sci-Fi Hologram Container */}
             <div className="relative w-full h-[600px] border border-yellow-500/20 bg-gradient-to-b from-yellow-500/5 to-transparent flex items-center justify-center group transform rotate-y-[-15deg] rotate-x-[5deg] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:rotate-0">
               
               {/* Grid Pattern inside container */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
               
               {/* Scanning Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/80 shadow-[0_0_15px_#eab308] animate-[scan_3s_ease-in-out_infinite]"></div>

               {/* Central Emblem replacing logo.jpeg */}
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-48 h-48 border-4 border-yellow-500/30 rounded-full flex items-center justify-center relative animate-[spin_10s_linear_infinite] shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                     <div className="absolute inset-[-10px] border border-yellow-500/50 rounded-full border-dashed animate-[spin_15s_linear_reverse_infinite]"></div>
                     <Hexagon className="w-24 h-24 text-yellow-500 absolute" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                     <Shield className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_#eab308]" />
                  </div>
                  
                  <div className="mt-12 text-center relative z-20 bg-[#020408]/80 backdrop-blur px-8 py-3 border-l-4 border-yellow-500">
                     <h2 className="text-3xl font-black tracking-[0.3em] text-white">İSG_ZEYRON</h2>
                     <p className="text-yellow-500 text-xs tracking-[0.5em] font-bold mt-1 uppercase">Güvenlik Algoritması</p>
                  </div>
               </div>

                {/* Corner Markers */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/50"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-yellow-500 tracking-[0.4em] uppercase mb-4">Sistem_Modülleri</h2>
            <p className="text-3xl md:text-5xl font-black text-white">HİPER BOŞLUK TEKNOLOJİSİ</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-zinc-900/50 p-10 border border-white/5 hover:border-yellow-500/50 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500/10 w-32 h-32 blur-3xl group-hover:bg-yellow-500/30 transition-all"></div>
                <div className="mb-6 relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-wider uppercase relative z-10">{feature.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed relative z-10">{feature.description}</p>
                <div className="absolute bottom-4 right-4 text-slate-800 font-mono text-xs opacity-50">#00{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sci-Fi Global CSS Overrides integrated */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
};

export default Landing;