import React, { useEffect, useRef, useState } from "react";
import type { User } from "../types";
import { isAdminRole } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  HeadphonesIcon,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import {
  createSupportTicket,
  getMySupportTickets,
  type SupportTicketRecord,
} from "../services/supabaseService";

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { view: "dashboard", label: "Ana Panel", icon: Menu },
  { view: "billing", label: "Üyelik Merkezi", icon: Crown },
  { view: "profile", label: "Profil ve Üyelik", icon: UserIcon },
  { view: "settings", label: "Ayarlar", icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  currentView,
  onNavigate,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [supportState, setSupportState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>(
    [],
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user)
    return <div className="min-h-screen bg-transparent">{children}</div>;

  const navigate = (view: string) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  const submitSupport = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSupportState("sending");
      await createSupportTicket(supportForm.subject, supportForm.message);
      setSupportTickets(await getMySupportTickets());
      setSupportState("sent");
      setSupportForm({ subject: "", message: "" });
    } catch {
      setSupportState("error");
    }
  };

  const openSupport = () => {
    setSupportOpen(true);
    setSupportState("idle");
    void getMySupportTickets()
      .then(setSupportTickets)
      .catch(() => setSupportTickets([]));
  };

  return (
    <div className="beginner-workspace min-h-screen overflow-x-hidden bg-[#f4f7f5] text-[#17231d] font-sans selection:bg-[#b9dbca] relative">
      <header className="fixed inset-x-0 top-0 z-50 h-16 px-3 sm:h-[72px] sm:px-8 flex items-center justify-between border-b border-[#d9e2dd] bg-white/95 backdrop-blur-xl pointer-events-none">
        <button
          onClick={() => navigate("dashboard")}
          className="pointer-events-auto flex items-center gap-3 group"
          aria-label="Ana sayfa"
        >
          <img
            src="/logo-transparent.png"
            alt="İSG Zeyron"
            className="w-24 sm:w-32 h-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          />
        </button>

        <div
          ref={menuRef}
          className="pointer-events-auto relative flex items-center gap-2 sm:gap-3"
        >
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-xs font-bold text-[#17231d]">
              {user.name.split(" ")[0]}
            </span>
            <span className="text-[9px] font-black tracking-widest text-amber-300">
              {user.accountType === "osgb" ? "OSGB" : "BİREYSEL"}
            </span>
          </div>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#eef4f0] border border-[#d4dfd9] text-[#176647] shadow-sm hover:border-[#78a993] hover:bg-white transition-colors"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="absolute right-0 top-14 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-white border border-[#d9e2dd] shadow-[0_24px_60px_rgba(36,61,49,0.16)]"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
                <nav className="p-2" aria-label="Kullanıcı menüsü">
                  {[
                    ...menuItems,
                    ...(isAdminRole(user.role)
                      ? [
                          {
                            view: "admin",
                            label: "Sistem Yönetimi",
                            icon: ShieldCheck,
                          },
                        ]
                      : []),
                  ].map((item) => (
                    <button
                      key={item.view}
                      onClick={() => navigate(item.view)}
                      className={`w-full min-h-11 px-3 rounded-lg flex items-center gap-3 text-sm font-semibold transition-colors ${currentView === item.view ? "bg-amber-400/15 text-amber-300" : "text-slate-300 hover:bg-white/5"}`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <button
                  onClick={onLogout}
                  className="w-full min-h-12 px-5 border-t border-white/10 flex items-center gap-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Çıkış Yap
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="relative z-10 min-h-screen pt-16 sm:pt-[72px]">
        {children}
      </main>

      <button
        onClick={openSupport}
        className="fixed z-40 bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-auto sm:h-12 sm:px-5 rounded-full bg-[#111b22]/95 border border-amber-400/40 text-amber-300 shadow-xl backdrop-blur-xl flex items-center justify-center gap-2 text-sm font-bold"
      >
        <HeadphonesIcon size={18} />
        <span className="hidden sm:inline">7/24 Canlı Destek</span>
      </button>
      <AnimatePresence>
        {supportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm sm:items-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSupportOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-lg rounded-xl border border-white/10 bg-[#111b22] p-5 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Canlı Destek
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Talebiniz destek ekibinin kuyruğuna anında iletilir.
                  </p>
                </div>
                <button
                  onClick={() => setSupportOpen(false)}
                  title="Kapat"
                  className="h-10 w-10 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="mx-auto" size={20} />
                </button>
              </div>
              {supportTickets.length > 0 && (
                <div className="mt-5 max-h-52 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Son talepleriniz</h3>
                  {supportTickets.map((ticket) => (
                    <article key={ticket.id} className="rounded-lg border border-white/10 bg-[#18252d] p-3">
                      <div className="flex items-center justify-between gap-3"><strong className="truncate text-sm text-white">{ticket.subject}</strong><span className={`shrink-0 text-[10px] font-bold ${ticket.status === 'resolved' ? 'text-emerald-300' : 'text-amber-300'}`}>{ticket.status === 'resolved' ? 'Çözüldü' : ticket.status === 'in_progress' ? 'İşlemde' : 'Açık'}</span></div>
                      {ticket.adminResponse && <p className="mt-2 border-l-2 border-emerald-400 pl-3 text-xs leading-5 text-slate-300"><span className="block font-bold text-emerald-300">Destek yanıtı</span>{ticket.adminResponse}</p>}
                    </article>
                  ))}
                </div>
              )}
              {supportState === "sent" ? (
                <div className="mt-6 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-300">
                  Talebiniz alındı. Destek personeli en kısa sürede
                  yanıtlayacak.
                </div>
              ) : (
                <form onSubmit={submitSupport} className="mt-6 space-y-4">
                  <input
                    required
                    minLength={3}
                    value={supportForm.subject}
                    onChange={(event) =>
                      setSupportForm((current) => ({
                        ...current,
                        subject: event.target.value,
                      }))
                    }
                    placeholder="Konu"
                    className="min-h-12 w-full rounded-lg border border-white/10 bg-[#18252d] px-4 text-white outline-none focus:border-amber-400"
                  />
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={supportForm.message}
                    onChange={(event) =>
                      setSupportForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Size nasıl yardımcı olabiliriz?"
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#18252d] p-4 text-white outline-none focus:border-amber-400"
                  />
                  {supportState === "error" && (
                    <p className="text-sm text-red-300">
                      Talep gönderilemedi. Lütfen tekrar deneyin.
                    </p>
                  )}
                  <button
                    disabled={supportState === "sending"}
                    className="min-h-12 w-full rounded-lg bg-amber-300 font-black text-[#111820] disabled:opacity-50"
                  >
                    {supportState === "sending"
                      ? "Gönderiliyor..."
                      : "Destek Talebi Gönder"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
