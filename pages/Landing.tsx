import React, { useEffect, useState, useMemo } from 'react';
import { Shield, FileText, Zap, ChevronRight, Activity, Cpu, Hexagon, ShieldAlert, Target, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface LandingProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-lg mb-4 bg-zinc-900/30 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 md:p-6 flex items-center justify-between hover:bg-yellow-500/5 transition-colors focus:outline-none"
      >
        <h4 className="text-sm md:text-base font-bold text-slate-200 pr-8">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-yellow-500 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 md:p-6 pt-0 text-slate-400 font-light leading-relaxed border-t border-white/5">
          {answer}
        </div>
      </div>
    </div>
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
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "out" as const,
        },
        random: true,
        speed: 0.3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1200,
        },
        value: 30,
      },
      opacity: {
        value: 0.2,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
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
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const faqs = [
    { q: "1. İSG Zeyron nedir?", a: "İSG Zeyron; İş Sağlığı ve Güvenliği uzmanları, İSG teknikerleri, OSGB'ler ve işverenler için geliştirilen web tabanlı (SaaS) bir İSG doküman ve süreç yönetim platformudur." },
    { q: "2. İSG Zeyron'u kimler kullanabilir?", a: "A, B ve C sınıfı İş Güvenliği Uzmanları, İSG Teknikerleri, OSGB'ler, az tehlikeli sınıfta kendi İSG hizmetini yürüten işverenler ve İSG süreçlerini dijital ortamda yönetmek isteyen tüm işletmeler kullanabilir." },
    { q: "3. Program kurulumu gerekiyor mu?", a: "Hayır. İSG Zeyron tamamen web tabanlıdır. Herhangi bir program indirmenize veya kurmanıza gerek yoktur." },
    { q: "4. Hangi cihazlardan kullanabilirim?", a: "Bilgisayar, dizüstü bilgisayar, tablet ve internet tarayıcısı bulunan tüm akıllı telefonlardan güvenle kullanılabilir." },
    { q: "5. Mobil uygulaması var mı?", a: "Hayır. İSG Zeyron, tarayıcı üzerinden çalışan bir platformdur. İsterseniz telefonunuzun 'Ana Ekrana Ekle' özelliğiyle uygulama benzeri şekilde kullanabilirsiniz." },
    { q: "6. Mac bilgisayarlarda çalışıyor mu?", a: "Evet. Windows, macOS ve Linux işletim sistemlerinde güncel internet tarayıcıları üzerinden kullanılabilir." },
    { q: "7. İnternet olmadan kullanılabilir mi?", a: "Hayır. İSG Zeyron bulut tabanlı bir platform olduğu için aktif internet bağlantısı gerektirir." },
    { q: "8. Dokümanlar sistemde kayıt altına alınıyor mu?", a: "Hayır. İş yerlerine ait oluşturulan risk değerlendirmeleri, planlar, tutanaklar ve diğer İSG dokümanları sistemimizde kalıcı olarak saklanmaz. Hazırlanan belgeler kullanıcı tarafından kendi cihazına indirilir." },
    { q: "9. Verilerim güvende mi?", a: "Evet. İSG Zeyron, kullanıcı bilgilerinin korunmasına önem verir ve gerekli teknik ve idari güvenlik tedbirlerini uygular. Hizmetlerimiz KVKK hükümleri doğrultusunda yürütülmektedir." },
    { q: "10. Excel veya Word bilgisi gerekiyor mu?", a: "Hayır. Platform, teknik bilgi gerektirmeyecek şekilde tasarlanmıştır. Kullanıcı dostu arayüz sayesinde işlemler kolayca gerçekleştirilebilir." },
    { q: "11. Dokümanlar güncel mevzuata uygun mu?", a: "İSG Zeyron, yürürlükteki mevzuat esas alınarak geliştirilmektedir. Mevzuat değişiklikleri doğrultusunda sistem düzenli olarak güncellenir." },
    { q: "12. Oluşturduğum dokümanları düzenleyebilir miyim?", a: "İndirilen dokümanlar üzerinde dilediğiniz düzenlemeleri yapabilir ve iş yerinizin ihtiyaçlarına göre uyarlayabilirsiniz." },
    { q: "14. Aboneliğimi istediğim zaman iptal edebilir miyim?", a: "Evet. Aboneliğinizi, yürürlükteki abonelik ve kullanım koşullarımız çerçevesinde iptal edebilirsiniz." },
    { q: "15. Güncellemeler için ek ücret ödeyecek miyim?", a: "Hayır. Aktif aboneliğiniz süresince yayınlanan sistem güncellemelerinden ek ücret ödemeden yararlanabilirsiniz." },
    { q: "16. Teknik destek hizmeti sunuyor musunuz?", a: "Evet. Kullanıcılarımız, ihtiyaç duyduklarında teknik destek ekibimizle iletişime geçebilirler." },
    { q: "17. Hesabımı farklı cihazlardan kullanabilir miyim?", a: "Evet. Hesabınıza internet bağlantısı bulunan farklı cihazlardan güvenli şekilde giriş yapabilirsiniz." },
    { q: "20. Yeni özellikler eklenecek mi?", a: "Evet. İSG Zeyron sürekli geliştirilen bir platformdur. Kullanıcı geri bildirimleri ve sektörel ihtiyaçlar doğrultusunda yeni modüller ve özellikler düzenli olarak sisteme eklenmektedir." },
    { q: "24. Dokümanları PDF olarak indirebilir miyim?", a: "Evet. Oluşturduğunuz dokümanları indirerek kendi bilgisayarınızda veya mobil cihazınızda saklayabilir ve dilediğiniz zaman yazdırabilirsiniz." },
    { q: "26. Aylık kullanım haklarım bir sonraki aya devreder mi?", a: "Hayır. İSG Zeyron'da kullanım hakları satın aldığınız abonelik paketine göre aylık olarak tanımlanır. Kullanılmayan haklar bir sonraki aya devredilmez." },
    { q: "27. Deneme sürümü sunuyor musunuz?", a: "Hayır. Kötüye kullanımı önlemek amacıyla ücretsiz deneme sürümü sunmuyoruz. Bunun yerine tek doküman oluşturma hizmetiyle sistemi düşük maliyetle test edebilirsiniz." },
    { q: "28. Kendi notlarımı oluşturduğum dokümanlara ekleyebilir miyim?", a: "Evet. İSG Zeyron, uzmanların kendi tespitlerini, değerlendirmelerini ve özel notlarını ekleyebileceği alanlar sunar. Sadece standart şablonlardan ibaret değildir." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase()));

  const advantages = [
    "Mevzuata uygun doküman yönetimi",
    "Hazır ve düzenlenebilir belge altyapısı",
    "Dokümanların dijital ortamda oluşturulması",
    "Tutanak, form, plan ve raporların tek panelden yönetilmesi",
    "Kolay kullanılabilir, eğitim gerektirmeyen arayüz",
    "Excel veya Word bilgisi gerektirmeyen pratik kullanım",
    "Bulut tabanlı, her cihazdan güvenli erişim",
    "Düzenli arşivleme ve hızlı doküman yönetimi",
    "Sürekli geliştirilen sistem altyapısı"
  ];

  const targetUsers = [
    "A, B ve C sınıfı İş Güvenliği Uzmanları",
    "İş Sağlığı ve Güvenliği Teknikerleri",
    "Ortak Sağlık Güvenlik Birimleri (OSGB)",
    "Az tehlikeli sınıfta kendi hizmetini yürüten İşverenler",
    "Süreçleri dijitalleştirmek isteyen tüm işletmeler"
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-white">
      {/* Sci-Fi Background Overlay - Extremely lightweight, zero lag */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.02)_0%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>

      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="fixed inset-0 z-0 pointer-events-none"
        />
      )}

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#07090E]/90 backdrop-blur-md border-yellow-500/20 py-3 shadow-[0_0_30px_rgba(234,179,8,0.05)]' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-yellow-500/20 rotate-45 transform blur-sm group-hover:bg-yellow-500/40 transition-all duration-500"></div>
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
               <Shield className="w-4 h-4 text-white absolute z-20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-yellow-600 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">İSG ZEYRON</span>
              <span className="text-[10px] text-yellow-500/70 font-bold tracking-[0.2em] uppercase leading-none mt-1">Teknoloji</span>
            </div>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-12">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollToSection(item.id, e)} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-[0.1em] transition-colors">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-bold text-slate-300 hover:text-yellow-500 transition-colors"
            >
              GİRİŞ
            </button>
            <button 
              onClick={onRegisterClick}
              className="px-6 py-2 border border-yellow-500 text-yellow-500 text-sm font-bold uppercase hover:bg-yellow-500 hover:text-black transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)] rounded-md"
            >
              KAYIT OL
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-500/30 bg-yellow-500/5 rounded-full mb-8">
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-xs font-bold tracking-[0.1em] uppercase">SaaS Yönetim Platformu</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            İş Sağlığı ve Güvenliği Süreçlerini <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              Dijitalleştiren Akıllı Platform
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            İSG süreçlerinde en fazla zaman alan işlemleri tek bir sistem altında bir araya getirerek, 
            uzmanlara, OSGB'lere ve işverenlere hızlı, düzenli ve pratik bir çalışma ortamı sunar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onRegisterClick}
              className="px-8 py-4 bg-yellow-500 text-black font-black uppercase text-sm tracking-[0.1em] rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 transform duration-300 flex items-center justify-center gap-2"
            >
              SİSTEME KAYIT OL <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onLoginClick}
              className="px-8 py-4 bg-zinc-900 border border-white/20 text-white font-bold uppercase text-sm tracking-[0.1em] rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              GİRİŞ YAP
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="hakkimizda" className="py-24 relative z-10 bg-[#0A0D14] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Neden <span className="text-yellow-500">İSG Zeyron?</span></h2>
              <div className="space-y-6 text-slate-400 font-light leading-relaxed">
                <p>
                  İSG uygulamalarında zamanın büyük bir bölümü belge hazırlamak, düzenlemek ve kontrol etmekle geçmektedir. İSG Zeyron, bu süreçleri dijital ortama taşıyarak iş yükünü azaltmayı ve kullanıcıların asıl odak noktası olan iş sağlığı ve güvenliği faaliyetlerine daha fazla zaman ayırmasını hedefler.
                </p>
                <p>
                  Modern altyapısı sayesinde kullanıcılar internet bağlantısı olan her yerden sisteme güvenli şekilde erişebilir, ihtiyaç duydukları işlemleri tek panel üzerinden yönetebilir.
                </p>
                <p className="p-4 border-l-4 border-yellow-500 bg-yellow-500/5 text-slate-300 italic">
                  İSG Zeyron; yalnızca bir doküman sistemi değil, İSG profesyonellerinin iş süreçlerini kolaylaştıran kapsamlı bir dijital çalışma platformu olma hedefiyle geliştirilmektedir.
                </p>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 <Target className="w-6 h-6 text-yellow-500" />
                 Kimler İçin Uygundur?
               </h3>
               <ul className="space-y-4">
                 {targetUsers.map((user, idx) => (
                   <li key={idx} className="flex items-start gap-3">
                     <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                     <span className="text-slate-300 leading-snug">{user}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="avantajlar" className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-yellow-500 tracking-[0.2em] uppercase mb-4">Sistem Altyapısı</h2>
            <p className="text-3xl md:text-5xl font-black text-white">Platformun Sağladığı Avantajlar</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, idx) => (
              <div key={idx} className="bg-zinc-900/40 p-6 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-slate-300 font-medium">{adv}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="sss" className="py-24 relative z-10 bg-[#0A0D14] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-yellow-500 tracking-[0.2em] uppercase mb-4">Destek Merkezi</h2>
            <p className="text-3xl md:text-5xl font-black text-white mb-8">Sık Sorulan Sorular</p>
            
            <div className="relative max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Konu veya soru arayın..." 
                value={searchFaq}
                onChange={(e) => setSearchFaq(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-full px-6 py-4 pl-12 text-white outline-none focus:border-yellow-500/50 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500">
                Aramanıza uygun soru bulunamadı.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050608] py-12 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6 opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span className="text-lg font-black tracking-widest text-slate-300">İSG ZEYRON</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} İSG Zeyron Teknoloji. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;