import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Database, Eye, CheckCircle, Smartphone, Lock, Rocket, Sparkles, Building2, HardHat, Factory, Briefcase } from "lucide-react";

export default function Landing({ onStart }: { onStart: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navItems = ["Hakkımızda", "Özellikler", "SSS", "İletişim"];

  const features = [
    {
      title: "Tamamen Web Tabanlı",
      desc: "Herhangi bir indirme gerektirmez. Windows, macOS ve mobil cihazlardan anında erişim.",
      icon: <Smartphone className="w-6 h-6 text-yellow-500" />,
      colSpan: "md:col-span-2 lg:col-span-1"
    },
    {
      title: "Kendi Notlarınızı Ekleyin",
      desc: "Sadece standart şablonlar değil, kendi tespit ve değerlendirmelerinizi risk analizlerine entegre edin.",
      icon: <Database className="w-6 h-6 text-yellow-500" />,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      title: "KVKK Uyumlu Altyapı",
      desc: "Verileriniz güvende. Dokümanlar oluşturulur, indirilir ve cihazınızda kalır.",
      icon: <Lock className="w-6 h-6 text-yellow-500" />,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      title: "Mevzuata %100 Uygun",
      desc: "Değişen İSG mevzuatlarına anında entegre edilen dinamik sistem.",
      icon: <CheckCircle className="w-6 h-6 text-yellow-500" />,
      colSpan: "md:col-span-2 lg:col-span-1"
    }
  ];

  const targetAudience = [
    { title: "A, B, C Sınıfı İSG Uzmanları", icon: <HardHat className="w-8 h-8 text-slate-300" /> },
    { title: "İSG Teknikerleri", icon: <Factory className="w-8 h-8 text-slate-300" /> },
    { title: "OSGB Firmaları", icon: <Building2 className="w-8 h-8 text-slate-300" /> },
    { title: "İşverenler", icon: <Briefcase className="w-8 h-8 text-slate-300" /> },
  ];

  const faqs = [
    { q: "İSG Zeyron nedir?", a: "İSG profesyonelleri ve işletmeler için dijital İSG süreç ve doküman yönetim platformudur." },
    { q: "Program kurulumu gerekiyor mu?", a: "Hayır, İSG Zeyron tamamen web/bulut tabanlıdır." },
    { q: "Verilerim güvende mi?", a: "Evet, verileriniz saklanmaz, işlemler tarayıcı ve geçici bağlantılar üzerinden güvenle tamamlanır." },
    { q: "Abonelik sistemi nasıl çalışır?", a: "Şu anda ücretsiz deneme sürümümüz bulunmuyor; tek doküman oluşturma ile sistemimizi test edebilirsiniz." },
    { q: "Deneme sürümü sunuyor musunuz?", a: "Deneme sürümü yerine tek belge başına hizmetimizle doğrudan sürece başlayabilirsiniz." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden selection:bg-yellow-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-zinc-950/80 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Yer Tutucu Logo */}
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
               <img src="/Adsız tasarım-Photoroom.jpg" alt="Logo" className="w-full h-full object-cover opacity-50" onError={(e) => {
                 (e.target as HTMLElement).style.display = "none"
               }}/>
               <span className="text-yellow-500 font-bold absolute text-xs">İSG</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">İSG <span className="text-yellow-500">Zeyron</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-yellow-400 transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onStart} className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Giriş Yap
            </button>
            <button onClick={onStart} className="text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all flex items-center gap-2">
              Hemen Başla
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-52 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen text-center">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 mb-8 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <Sparkles className="w-4 h-4" />
            Bulut Tabanlı Yeni Nesil İSG Platformu 🚀
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
            İş Sağlığı ve Güvenliği Süreçlerinizi <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] font-extrabold pr-2">Dijitalleştirin.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-light leading-relaxed">
            İSG profesyonelleri, OSGB&apos;ler ve işletmeler için akıllı yönetim platformu. Doküman hazırlama ve arşivleme süreçlerinizi tek bir sistemde toplayın, evrak yükünüzü hafifletin.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
            <button onClick={onStart} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-extrabold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all active:scale-95">
              Tek Doküman Oluşturarak Dene
            </button>
            <button onClick={() => document.getElementById("özellikler")?.scrollIntoView({ behavior: "smooth" })} className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all">
              Özellikleri Keşfet
            </button>
          </div>
        </motion.div>
      </section>

      {/* Neden İSG Zeyron - Bento Grid */}
      <section id="özellikler" className="py-24 px-6 relative border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Neden İSG Zeyron?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Sıradan yazılımların ötesinde, size hız ve güven katan üstün yetenekler.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5 }}
                className={`group p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-yellow-500/30 backdrop-blur-xl transition-all shadow-xl relative overflow-hidden ${feature.colSpan}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 border border-white/5 group-hover:border-yellow-500/30 group-hover:scale-110 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hedef Kitle */}
      <section className="py-24 px-6 bg-zinc-900/30 border-y border-white/5 relative">
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">Kimler İçin Tasarlandı?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {targetAudience.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl bg-zinc-950/80 border border-white/5 flex flex-col items-center justify-center text-center gap-4 hover:bg-zinc-900 transition-colors hover:border-yellow-500/20"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:border-yellow-500/50 shadow-inner">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-slate-300">{item.title}</span>
                  </motion.div>
                ))}
             </div>
         </div>
      </section>

      {/* SSS Accordion */}
      <section id="sss" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Sıkça Sorulan Sorular</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="font-medium text-lg text-slate-200">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-yellow-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/10 text-slate-500 text-sm bg-zinc-950">
        <p>© {new Date().getFullYear()} İSG Zeyron. Tüm hakları saklıdır.</p>
        <p className="mt-2 text-xs opacity-50">Güvenlik | Gizlilik | Şartlar</p>
      </footer>
    </div>
  );
}
