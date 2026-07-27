import React, { useEffect, useState } from 'react';
import { Shield, FileText, Zap, ChevronRight, Activity, Cpu, ShieldAlert, Target, Search, ChevronDown, CheckCircle2, Factory, HardHat, Facebook, Twitter, Instagram, Linkedin, Menu, X, Users, Download, MonitorSmartphone, Eye, HardDriveDownload, LogIn, UserPlus, Plane, Ship, Truck, Pickaxe, Building2, Briefcase, Trees, UtensilsCrossed, FlaskConical } from 'lucide-react';
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
      transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
      className={`border ${isOpen ? 'border-yellow-500/50 shadow-[0_12px_30px_rgba(202,138,4,0.12)] dark:shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-yellow-50 dark:bg-[#1c3038]' : 'border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#16272f]/90 hover:border-yellow-500/40 hover:bg-slate-50 dark:hover:bg-[#1b3039]'} rounded-lg mb-4 overflow-hidden transition-all duration-300`}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Platform", id: "hakkimizda" },
    { label: "Avantajlar", id: "avantajlar" },
    { label: "Kimler İçin", id: "kimler-icin" },
    { label: "S.S.S", id: "sss" }
  ];

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const faqs = [
    { q: "1. İSG Zeyron nedir?", a: "İSG Zeyron; İş Sağlığı ve Güvenliği uzmanları, İSG teknikerleri, OSGB'ler ve işverenler için geliştirilen web tabanlı (SaaS) bir İSG doküman ve süreç yönetim platformudur." },
    { q: "2. İSG Zeyron'u kimler kullanabilir?", a: "A, B ve C sınıfı İş Güvenliği Uzmanları, İSG Teknikerleri, OSGB'ler, az tehlikeli sınıfta kendi İSG hizmetini yürüten işverenler ve İSG süreçlerini dijital ortamda yönetmek isteyen tüm işletmeler kullanabilir." },
    { q: "3. Program kurulumu gerekiyor mu?", a: "Hayır. İSG Zeyron tamamen web tabanlıdır. Herhangi bir program indirmenize veya kurmanıza gerek yoktur." },
    { q: "4. Hangi cihazlardan kullanabilirim?", a: "Bilgisayar, dizüstü bilgisayar, tablet ve internet tarayıcısı bulunan akıllı telefonlardan güvenle kullanılabilir." },
    { q: "5. Mobil uygulaması var mı?", a: "İSG Zeyron tarayıcı üzerinden çalışan mobil uyumlu bir platformdur. Telefonunuzun 'Ana Ekrana Ekle' özelliğiyle uygulama benzeri şekilde kullanabilirsiniz." },
    { q: "6. Mac bilgisayarlarda çalışıyor mu?", a: "Evet. Windows, macOS ve Linux işletim sistemlerinde güncel internet tarayıcıları üzerinden kullanılabilir." },
    { q: "7. İnternet olmadan kullanılabilir mi?", a: "Dokümanı hazırlayıp oluşturmak için aktif internet bağlantısı gerekir. İndirdiğiniz Word dosyasını daha sonra cihazınızda çevrimdışı açabilirsiniz." },
    { q: "8. Dokümanlar sistemde kayıt altına alınıyor mu?", a: "Hayır. Doldurduğunuz bilgilerle oluşturulan Word dosyası doğrudan cihazınıza indirilir; dokümanınız ve form verileriniz kişisel bir arşiv olarak sistemde saklanmaz." },
    { q: "9. Verilerim güvende mi?", a: "Kullanıcı hesabınız doğrulamalı kimlik sistemiyle korunur. Doküman oluşturma bilgileri kişisel bir bulut arşivinde tutulmaz; oluşturduğunuz dosyanın saklanması sizin cihazınızda ve kontrolünüzdedir." },
    { q: "10. Excel veya Word bilgisi gerekiyor mu?", a: "Hayır. Kullanıcı dostu alanları doldurmanız yeterlidir; sistem verileri dokümana otomatik olarak işler." },
    { q: "11. Dokümanlar güncel mevzuata uygun mu?", a: "Şablonlar yürürlükteki mevzuat ve sektörel ihtiyaçlar esas alınarak hazırlanır; değişiklikler doğrultusunda içeriklerin güncellenmesi hedeflenir. Nihai mesleki kontrol kullanıcı sorumluluğundadır." },
    { q: "12. Oluşturduğum dokümanları düzenleyebilir miyim?", a: "Evet. Cihazınıza indirdiğiniz Word dokümanını iş yerinizin ihtiyaçlarına göre açabilir ve düzenleyebilirsiniz." },
    { q: "13. Abonelik sistemi nasıl çalışır?", a: "Paketler kullanım kotası ve sürelerine göre planlanmıştır. Ödeme altyapısı şu anda hazırlık aşamasındadır; doğrulanmış ödeme olmadan ücretli plan etkinleştirilmez." },
    { q: "14. Aboneliğimi istediğim zaman iptal edebilir miyim?", a: "Ödeme ve abonelik sistemi açıldığında iptal işlemleri yürürlükteki abonelik ve kullanım koşulları çerçevesinde sunulacaktır." },
    { q: "15. Güncellemeler için ek ücret ödeyecek miyim?", a: "Aktif abonelik kapsamında sunulan sistem ve şablon güncellemeleri için ayrıca ücret alınması planlanmamaktadır." },
    { q: "16. Teknik destek hizmeti sunuyor musunuz?", a: "Evet. Kullanıcılar destek taleplerini platformdaki destek kanalı üzerinden iletebilir." },
    { q: "17. Hesabımı farklı cihazlardan kullanabilir miyim?", a: "Evet. Doğrulanmış hesabınıza internet bağlantısı bulunan farklı cihazlardan güvenli şekilde giriş yapabilirsiniz." },
    { q: "18. Ödemeler güvenli mi?", a: "Ödeme özelliği henüz aktif değildir. Devreye alındığında tahsilatlar güvenli bir ödeme sağlayıcısı ve sunucu tarafı doğrulama üzerinden gerçekleştirilecektir." },
    { q: "19. İSG Zeyron'u kullanmak için teknik bilgi gerekir mi?", a: "Hayır. Platform, farklı teknik bilgi seviyelerindeki kullanıcıların rahatça kullanabileceği şekilde tasarlanmıştır." },
    { q: "20. Yeni özellikler eklenecek mi?", a: "Evet. Kullanıcı geri bildirimleri, mevzuat ve sektörel ihtiyaçlar doğrultusunda yeni modül ve özelliklerin düzenli olarak eklenmesi hedeflenmektedir." },
    { q: "21. Demo sürümü veya deneme erişimi sunuluyor mu?", a: "Ücretsiz deneme sürümü sunulmamaktadır. Tek doküman oluşturma seçeneği ödeme altyapısıyla birlikte duyurulacaktır." },
    { q: "22. Destek taleplerime ne kadar sürede dönüş yapılır?", a: "Talepler yoğunluk durumuna göre mümkün olan en kısa sürede değerlendirilir ve kullanıcıya geri dönüş sağlanır." },
    { q: "23. Hangi internet tarayıcıları desteklenir?", a: "Google Chrome, Microsoft Edge, Safari, Mozilla Firefox ve güncel Chromium tabanlı tarayıcılarla uyumludur." },
    { q: "24. Dokümanları PDF olarak indirebilir miyim?", a: "Platform şu anda düzenlenebilir Word (DOCX) çıktısı üretir. PDF gerekiyorsa indirdiğiniz dosyayı Word veya uyumlu bir uygulama üzerinden PDF olarak kaydedebilirsiniz." },
    { q: "25. İSG Zeyron sürekli geliştirilecek mi?", a: "Evet. Platformun sektördeki gelişmelere ve kullanıcı taleplerine göre sürekli güncellenmesi hedeflenmektedir." },
    { q: "26. Aylık kullanım haklarım sonraki aya devreder mi?", a: "Ücretli paketler açıldığında kullanılmayan aylık hakların sonraki döneme devretmemesi ve her abonelik döneminde yenilenmesi planlanmaktadır." },
    { q: "27. Deneme sürümü sunuyor musunuz?", a: "Hayır. Kötüye kullanımı önlemek amacıyla ücretsiz deneme planlanmamaktadır; düşük maliyetli tek doküman hizmeti ödeme sistemiyle birlikte sunulacaktır." },
    { q: "28. Kendi notlarımı ve değerlendirmelerimi ekleyebilir miyim?", a: "Evet. Özellikle risk değerlendirmesi ve teknik dokümanlarda kendi tespit, öneri ve özel notlarınızı ilgili alanlara ekleyerek iş yerine ve mesleki yaklaşımınıza göre özelleştirebilirsiniz." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase()));

  const advantages = [
    { icon: <Shield className="w-6 h-6" />, title: "Mevzuata Uygun Yönetim", desc: "İSG şablonlarını yürürlükteki mevzuat ve sektörel ihtiyaçlar doğrultusunda yönetin." },
    { icon: <FileText className="w-6 h-6" />, title: "Düzenlenebilir Belgeler", desc: "Hazır alanları doldurun, önizleyin ve düzenlenebilir Word çıktısı oluşturun." },
    { icon: <Activity className="w-6 h-6" />, title: "Risk ve Süreç Dokümanları", desc: "Risk değerlendirmesi, plan, tutanak, form ve raporları tek çalışma alanında hazırlayın." },
    { icon: <Cpu className="w-6 h-6" />, title: "Tek Panel", desc: "Şablonunuzu seçin, yönlendirilmiş alanları doldurun ve dokümanınızı oluşturun." },
    { icon: <Zap className="w-6 h-6" />, title: "Pratik Kullanım", desc: "Excel veya ileri Word bilgisi gerektirmeyen yönlendirilmiş alanlarla çalışın." },
    { icon: <Download className="w-6 h-6" />, title: "Doğrudan İndirme", desc: "Hazırladığınız dokümanı düzenlenebilir Word dosyası olarak anında cihazınıza indirin." },
    { icon: <HardDriveDownload className="w-6 h-6" />, title: "Cihazınızda Saklama", desc: "Oluşturduğunuz evrakları kendi klasör yapınızda, tamamen sizin kontrolünüzde saklayın." },
    { icon: <MonitorSmartphone className="w-6 h-6" />, title: "Tüm Ekranlara Uyum", desc: "Bilgisayar, tablet ve telefon tarayıcılarında responsive çalışma deneyimi kullanın." },
    { icon: <Eye className="w-6 h-6" />, title: "Sürekli Gelişim", desc: "Yeni şablonlar, mevzuat ihtiyaçları ve kullanıcı geri bildirimleriyle gelişen altyapıdan yararlanın." }
  ];

  const targetUsers = [
    "A, B ve C sınıfı İş Güvenliği Uzmanları",
    "İş Sağlığı ve Güvenliği Teknikerleri",
    "Ortak Sağlık Güvenlik Birimleri (OSGB)",
    "Az tehlikeli sınıfta kendi hizmetini yürüten İşverenler",
    "Süreçleri dijitalleştirmek isteyen tüm işletmeler"
  ];

  return (
    <div className="light-landing min-h-screen bg-[#eef1f5] dark:bg-[#16222a] text-slate-700 dark:text-slate-300 font-sans selection:bg-[#FFD700]/30 selection:text-white overflow-x-hidden relative">
      
      {/* Global background video */}
      <div className="fixed inset-0 z-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.8]">
          <source src="/19024-298313254_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#10232b]/55"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#142b34]/20 via-[#132730]/70 to-[#16222a]"></div>
      </div>

      {/* Sci-Fi Background Layer */}
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

      {/* Island Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 py-3 sm:py-4 flex items-center justify-between px-3 sm:px-6 ${scrolled ? 'bg-[#0c141a]/88 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.22)]' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer group z-10"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src="/logo-transparent.png" alt="İSG Zeyron Logo" className="w-28 sm:w-36 h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.28)]" />
          </motion.div>

          <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden lg:block border border-slate-300/80 dark:border-white/10 bg-white/80 dark:bg-[#17303a]/80 backdrop-blur-md rounded-full px-6 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.10)] dark:shadow-lg">
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
            <button type="button" onClick={() => setMobileMenuOpen(open => !open)} className="lg:hidden w-11 h-11 rounded-lg border border-white/15 bg-[#111b22]/90 text-amber-300 flex items-center justify-center" aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={21} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-[76px] inset-x-0 mx-1 rounded-xl border border-white/10 bg-[#111b22]/98 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:hidden">
              <nav className="grid gap-1" aria-label="Mobil ana menü">
                {navItems.map(item => <a key={item.id} href={`#${item.id}`} onClick={event => scrollToSection(item.id, event)} className="min-h-11 px-4 rounded-lg flex items-center justify-between text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-amber-300">{item.label}<ChevronRight size={16} /></a>)}
              </nav>
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-white/10">
                <button onClick={() => { setMobileMenuOpen(false); onRegisterClick(); }} className="min-h-11 rounded-lg bg-amber-400 text-[#101820] text-xs font-black uppercase">Kayıt Ol</button>
                <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="min-h-11 rounded-lg border border-white/10 bg-white/5 text-white text-xs font-black uppercase">Giriş Yap</button>
              </div>
            </motion.div>}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-40 pb-12 sm:pb-32 px-4 sm:px-6 min-h-[88svh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        
        <div className="max-w-6xl mx-auto w-full relative z-20 mt-2 sm:mt-10">
             
             <div className="relative z-10 px-0 sm:px-8 py-8 sm:py-20 lg:py-32 lg:px-24 text-center">
                 <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-5 sm:mb-8 leading-[1.08]"
                 >
                    <span className="text-slate-900 dark:text-white">İSG Zeyron Teknoloji</span> <br/>
                    <span className="text-[#c58a00] dark:text-[#FFD700] drop-shadow-[0_8px_18px_rgba(197,138,0,0.16)] dark:drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                      Akıllı Yönetim Platformu
                    </span>
                 </motion.h1>
                 
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-[15px] sm:text-lg md:text-2xl text-slate-700 dark:text-slate-300 mb-7 sm:mb-14 max-w-3xl mx-auto font-light leading-relaxed"
                 >
                    İş Sağlığı ve Güvenliği dokümanlarını hazırlamayı kolaylaştıran,
                    düzenlenebilir Word çıktısı sunan web tabanlı çalışma alanı.
                 </motion.p>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                 >
                    <button 
                      onClick={onRegisterClick}
                      className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-300 px-7 text-sm font-extrabold text-[#13242c] shadow-[0_10px_24px_rgba(234,179,8,0.18)] transition-colors hover:bg-amber-200 sm:w-auto"
                    >
                      <UserPlus className="h-4 w-4" /> Kayıt Ol
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button 
                      onClick={onLoginClick}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#19323c]/95 px-7 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(8,20,27,0.2)] transition-colors hover:border-amber-300/50 hover:bg-[#21414d] sm:w-auto"
                    >
                      <LogIn className="h-4 w-4 text-amber-300" /> Giriş Yap
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[ 
                { icon: <Zap />, title: "Enerji Santralleri", desc: "Yüksek gerilim, RES/GES/HES ve enerji işletme güvenliği dokümanları.", video: "enerji.mp4" },
                { icon: <Factory />, title: "Fabrikalar ve İmalathaneler", desc: "Makine güvenliği, LOTO, üretim sahası ve bakım süreçleri.", video: "fabrika.mp4", poster: "fabrika-poster.jpg" },
                { icon: <UtensilsCrossed />, title: "Gıda Fabrikaları", desc: "Hijyen, sanitasyon, soğuk zincir ve gıda üretim güvenliği.", video: "gida.mp4", poster: "gida-poster.jpg" },
                { icon: <Plane />, title: "Hava Limanları", desc: "Apron, hangar, yer hizmetleri ve havacılık operasyon güvenliği.", video: "hava.mp4", poster: "hava-poster.jpg" },
                { icon: <HardHat />, title: "İnşaat ve Tersaneler", desc: "Yüksekte çalışma, iskele, iş makineleri ve tersane operasyonları.", video: "insaat.mp4", poster: "insaat-poster.jpg" },
                { icon: <FlaskConical />, title: "Kimya Fabrikası", desc: "Kimyasal maruziyet, proses, depolama ve patlama güvenliği.", video: "kimya.mp4", poster: "kimya-poster.jpg" },
                { icon: <Ship />, title: "Liman İşletmeciliği", desc: "Rıhtım, yükleme, tahliye ve liman saha operasyonları.", video: "liman.mp4" },
                { icon: <Truck />, title: "Lojistik ve Taşımacılık", desc: "Yük bağlama, taşıma, güzergâh ve sevkiyat güvenliği.", video: "lojistik.mp4", poster: "lojistik-poster.jpg" },
                { icon: <Pickaxe />, title: "Maden İşletmeleri", desc: "Yer altı ve açık ocak çalışmalarına yönelik İSG dokümanları.", video: "maden.mp4", poster: "maden-poster.jpg" },
                { icon: <Activity />, title: "Metal ve Döküm", desc: "Sıcak metal, döküm, pres ve ağır üretim süreçleri.", video: "277105_medium.mp4" },
                { icon: <Building2 />, title: "Otel, Bina ve Hastaneler", desc: "Bina işletimi, sağlık tesisleri ve hizmet alanı güvenliği.", video: "otel.mp4", poster: "otel-poster.jpg" },
                { icon: <Briefcase />, title: "Şirketler ve Ofisler", desc: "Ofis, küçük işletme ve idari çalışma alanı dokümanları.", video: "sirketler.mp4", poster: "sirketler-poster.jpg" },
                { icon: <Trees />, title: "Tarım, Hayvancılık ve Ormancılık", desc: "Tarım makineleri, pestisit, hayvancılık ve orman işleri.", video: "tarim.mp4" },
                { icon: <FileText />, title: "Standart Dokümanlar", desc: "Tüm işyerlerinde kullanılan ortak İSG form ve kayıtları.", video: "standart.mp4", poster: "standart-poster.jpg" }
              ].map((item, i) => (
               <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: Math.min(i*0.04, 0.28), duration: 0.5 }} className="group relative flex h-[300px] flex-col overflow-hidden rounded-lg border border-slate-300 bg-[#132730] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-yellow-500/40 dark:border-white/10">
                  {item.video ? <video autoPlay loop muted playsInline preload="metadata" poster={item.poster ? `/${item.poster}` : undefined} className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 sm:opacity-80">
                      <source src={`/${item.video}`} type="video/mp4" />
                    </video> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(34,211,238,0.18),transparent_34%),linear-gradient(145deg,#18343f,#0d1b22)]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#132730]/85 via-[#132730]/35 to-transparent transition-all duration-500 group-hover:via-[#17313b]/40 sm:from-[#132730]/90 sm:via-[#132730]/55"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-[#1a3540]/90 text-amber-300 backdrop-blur-md [&>svg]:h-6 [&>svg]:w-6">{item.icon}</div>
                    <h3 className="text-xl font-black text-white mb-3 drop-shadow-lg group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                    <p className="mt-auto text-sm leading-relaxed text-slate-300 drop-shadow-md">{item.desc}</p>
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
                  <ShieldAlert className="w-3 h-3" /> Platform Hakkında
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                  İSG Süreçlerinde <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]">Dijital Çalışma Alanı</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
                  İSG profesyonelleri, OSGB'ler ve işletmeler için geliştirilen web tabanlı bir <strong className="text-slate-900 dark:text-white font-medium">doküman oluşturma platformudur.</strong>
                </p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent group">
                  <div className="bg-white/75 dark:bg-[#182b34]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 h-full flex flex-col items-start text-left border border-slate-200 dark:border-white/5 group-hover:border-yellow-500/30 transition-all duration-500 overflow-hidden relative shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:shadow-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full group-hover:bg-yellow-500/10 transition-colors"></div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-500 shadow-lg">
                      <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Dokümanınızı Hızla Oluşturun</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Uygun şablonu seçin, gerekli alanları doldurun ve düzenlenebilir Word belgesini cihazınıza indirin. Zamanınızı belge operasyonu yerine <span className="text-yellow-500 font-medium">iş sağlığı ve güvenliği faaliyetlerine</span> ayırın.</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-[1px] rounded-3xl bg-gradient-to-b from-yellow-500/20 to-transparent group">
                  <div className="bg-white/75 dark:bg-[#182b34]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 h-full flex flex-col items-start text-left border border-slate-200 dark:border-white/5 group-hover:border-yellow-500/30 transition-all duration-500 overflow-hidden relative shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:shadow-[0_0_30px_rgba(234,179,8,0.05)] text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full group-hover:bg-yellow-500/20 transition-colors"></div>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Cpu className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Her Yerden Güvenli Erişim</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Kurulum gerektirmeyen web altyapısıyla bilgisayar, tablet ve telefon tarayıcısından hesabınıza erişin. Mobil cihazlarda ana ekrana ekleyerek uygulama benzeri kullanım deneyimi elde edin.</p>
                  </div>
                </motion.div>
             </div>
        </div>
      </section>
      <section id="avantajlar" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 border-y border-white/5 bg-[#101a20]/45">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12"><p className="text-amber-400 text-xs font-black tracking-[0.28em] uppercase">Platformun Sağladığı Avantajlar</p><h2 className="mt-4 text-3xl sm:text-5xl font-black text-white">Daha az operasyon, daha fazla saha odağı</h2><p className="mt-4 text-slate-400 text-lg leading-relaxed">Günlük İSG doküman işlerini sadeleştiren, düzenli ve erişilebilir bir çalışma düzeni.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl overflow-hidden border border-white/10 bg-white/10">
            {advantages.map(item => <article key={item.title} className="min-h-52 p-6 sm:p-8 bg-[#16242c] hover:bg-[#1b2c35] transition-colors"><div className="w-11 h-11 rounded-lg bg-cyan-300/10 border border-cyan-300/10 text-cyan-300 flex items-center justify-center">{item.icon}</div><h3 className="mt-6 text-lg font-black text-white">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-400">{item.desc}</p></article>)}
          </div>
        </div>
      </section>

      <section id="kimler-icin" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
          <div><div className="w-12 h-12 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-300/15 flex items-center justify-center"><Users size={24} /></div><h2 className="mt-6 text-3xl sm:text-5xl font-black text-white">Kimler için uygundur?</h2><p className="mt-5 text-lg leading-relaxed text-slate-400">Platform; uzmanların, teknikerlerin, OSGB ekiplerinin ve kendi İSG hizmetini yürüten işverenlerin gerçek doküman ihtiyaçları dikkate alınarak tasarlanmıştır.</p></div>
          <div className="grid gap-3">{targetUsers.map(userType => <div key={userType} className="min-h-16 px-5 py-4 rounded-lg border border-white/10 bg-[#18252d]/90 flex items-center gap-4 text-slate-200"><CheckCircle2 className="text-amber-300 shrink-0" size={20} /><span className="font-semibold">{userType}</span></div>)}</div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-2 gap-5">
          <article className="p-7 sm:p-9 rounded-xl border border-white/10 bg-[#18252d]/90"><MonitorSmartphone className="text-cyan-300" size={26} /><h3 className="mt-5 text-xl font-black text-white">Teknoloji ve Erişim</h3><p className="mt-3 text-slate-400 leading-relaxed">Tamamen web tabanlıdır; program kurulumu gerektirmez. Güncel tarayıcı bulunan bilgisayar, tablet ve telefonlarda çalışır. Aktif internet bağlantısı gerektirir.</p></article>
          <article className="p-7 sm:p-9 rounded-xl border border-amber-300/15 bg-amber-300/5"><Target className="text-amber-300" size={26} /><h3 className="mt-5 text-xl font-black text-white">Vizyonumuz</h3><p className="mt-3 text-slate-400 leading-relaxed">İSG alanında dijital dönüşüme katkı sağlayan, kullanıcı deneyimini ön planda tutan, güvenilir ve sürekli gelişen kapsamlı bir çalışma platformu oluşturmak.</p></article>
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
                    className="relative w-full bg-white/85 dark:bg-[#18303a]/90 backdrop-blur-md border border-slate-300 dark:border-white/20 rounded-full px-8 py-5 pl-14 text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-yellow-500 transition-all shadow-[inset_0_1px_2px_rgba(15,23,42,0.05),0_12px_35px_rgba(15,23,42,0.06)] dark:shadow-inner font-medium text-lg"
                  />
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-500 w-6 h-6" />
               </div>

               <div className="space-y-4 text-left">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => (
                      <FAQItem key={faq.q} idx={idx} question={faq.q} answer={faq.a} />
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-[#182b34]/70 rounded-2xl border border-slate-200 dark:border-white/5 border-dashed">
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
          <div className="w-48 sm:w-56 mb-8 opacity-70 hover:opacity-100 transition-opacity flex justify-center items-center">
            <img src="/logo-transparent.png" alt="İSG Zeyron Footer Logo" className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
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