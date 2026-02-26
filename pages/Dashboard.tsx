import React, { useState } from 'react';
import { Factory, Building2, Hotel, HardHat, Store, FilePlus, FileText, ClipboardList, PenTool, TrendingUp, User as UserIcon, Settings, Calendar, ArrowRight, Download, Eye, Plus, ChevronRight, Zap, Target, Briefcase, Sparkles, PieChart, Activity, CheckCircle2 } from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';

interface DashboardProps {
  user: User;
  t: any;
  onNavigate: (view: string, params?: { category?: string, search?: string }) => void;
  onTemplateSelect: (template: DocumentTemplate | null) => void;
  templates: DocumentTemplate[];
  recentDocuments?: GeneratedDocument[];
  savedDocuments?: GeneratedDocument[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, t, onNavigate, onTemplateSelect, templates, recentDocuments = [], savedDocuments = [] }) => {
  const companyName = user.companyName || 'Şirket Adı Yok';
  
  // Sector Columns Configuration
  const sectors = [
    {
      id: 'production',
      title: 'FABRİKA',
      subtitle: 'Üretim ve İmalat',
      icon: Factory,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', 
      color: 'bg-rose-600',
      items: ['İş Güvenliği', 'İş Takibi', 'Puantaj', 'İş Sırası', 'İş Emri'],
      searchQuery: 'Üretim'
    },
    {
      id: 'corporate',
      title: 'OFİS / ŞİRKET',
      subtitle: 'Kurumsal Çözümler',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
      color: 'bg-emerald-600',
      items: ['Toplantı Tutanak', 'İnsan Kaynakları', 'Zimmet Formu', 'İzin Formu', 'Masraf Formu'],
      searchQuery: 'Kurumsal'
    },
    {
      id: 'service',
      title: 'OTEL',
      subtitle: 'Turizm ve Hizmet',
      icon: Hotel,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400',
      color: 'bg-amber-500', 
      items: ['Oda Kontrol', 'Müşteri Kayıt', 'Gece Raporu', 'Housekeeping', 'Arıza Bildirim'],
      searchQuery: 'Otel'
    },
    {
      id: 'construction',
      title: 'İNŞAAT',
      subtitle: 'Şantiye Yönetimi',
      icon: HardHat,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400',
      color: 'bg-violet-600',
      items: ['Saha Kontrol', 'Hakediş', 'İş Makineleri', 'Taşeron Takip', 'Günlük Rapor'],
      searchQuery: 'İnşaat'
    },
    {
      id: 'smallres',
      title: 'KÜÇÜK İŞLETME',
      subtitle: 'Esnaf ve KOBİ',
      icon: Store,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400',
      color: 'bg-pink-600',
      items: ['Satış Takip', 'Stok Sayım', 'Cari Hesap', 'Teklif Hazırla', 'Tahsilat'],
      searchQuery: 'Esnaf'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative min-h-screen flex flex-col">
      
      {/* HEADER - Simplified */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              YILLIK DOKÜMAN YÖNETİM PANELİ
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
               Sektörel İş Analizi ve Doküman Takip Sistemi
            </p>
         </div>
      </div>

      {/* MAIN SECTOR COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
          {sectors.map((sector) => (
             <div 
               key={sector.id}
               onClick={() => onNavigate('templates', { category: sector.searchQuery })}
               className="group relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-2 hover:shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900"
             >
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                   <img 
                      src={sector.image} 
                      alt={sector.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors"></div>
                   <div className={`absolute top-0 left-0 w-full h-1 ${sector.color}`}></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col p-6 z-10 text-center">
                    
                    {/* Icon Circle */}
                    <div className={`mx-auto w-20 h-20 rounded-full ${sector.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                        <sector.icon size={32} className="text-white" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-wider mb-1">
                       {sector.title}
                    </h3>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                       {sector.subtitle}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-3 text-left pl-2">
                       {sector.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 group/item">
                             <div className={`w-2 h-2 rounded-full ${sector.color} group-hover/item:scale-150 transition-transform`}></div>
                             <span className="text-sm font-medium text-slate-200 group-hover/item:text-white transition-colors">{item}</span>
                          </div>
                       ))}
                    </div>

                    {/* Hover Action */}
                    <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                       <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                          İncele <ChevronRight size={16} />
                       </button>
                    </div>
                </div>
             </div>
          ))}
      </div>

      {/* BOTTOM QUICK ACTIONS (HIZLI İŞLEMLER) */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:24px_24px] opacity-20"></div>
          
          <h2 className="text-center text-xl font-bold text-white mb-8 tracking-widest uppercase relative z-10">
              HIZLI İŞLEMLER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <button 
                 onClick={() => onNavigate('templates', { search: 'Sertifika' })}
                 className="h-32 bg-rose-600 rounded-xl flex items-center justify-center gap-4 hover:bg-rose-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-900/50 group"
              >
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 font-black text-xl group-hover:rotate-12 transition-transform">
                    <Plus size={24} />
                 </div>
                 <span className="text-lg font-bold text-white tracking-wide">SERTİFİKA OLUŞTUR</span>
              </button>

              <button 
                 onClick={() => onNavigate('templates', { search: 'Tutanak' })}
                 className="h-32 bg-blue-600 rounded-xl flex items-center justify-center gap-4 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-900/50 group"
              >
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold group-hover:rotate-12 transition-transform">
                    <FileText size={24} />
                 </div>
                 <span className="text-lg font-bold text-white tracking-wide">TUTANAK TUT</span>
              </button>

              <button 
                 onClick={() => onNavigate('templates', { search: 'Rapor' })}
                 className="h-32 bg-emerald-600 rounded-xl flex items-center justify-center gap-4 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/50 group"
              >
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold group-hover:rotate-12 transition-transform">
                    <ClipboardList size={24} />
                 </div>
                 <span className="text-lg font-bold text-white tracking-wide">GÜNLÜK RAPOR</span>
              </button>
          </div>
      </div>
    </div>
  );
};
