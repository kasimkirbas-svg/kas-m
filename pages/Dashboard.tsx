import React from 'react';
import { Factory, Building2, Hotel, HardHat, Store, FilePlus, FileText, ClipboardList } from 'lucide-react';
import { User, DocumentTemplate } from '../types';

interface DashboardProps {
  user: User;
  t: any;
  onNavigate: (view: string) => void;
  onTemplateSelect: (template: DocumentTemplate | null) => void;
  templates: DocumentTemplate[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, t, onNavigate, onTemplateSelect, templates }) => {
  
  const categories = [
    {
      id: 'factory',
      title: 'FABRİKA',
      icon: Factory,
      bgColor: 'bg-slate-800',
      borderColor: 'border-red-500',
      iconBg: 'bg-red-500',
      items: ['İş Eğitimleri', 'İş Takipleri', 'Uyarılar', 'İş Kazaları', 'İş Sağlığı', 'İş Yeri Hekimi']
    },
    {
      id: 'office',
      title: 'OFİS / ŞİRKET',
      icon: Building2,
      bgColor: 'bg-slate-800',
      borderColor: 'border-emerald-500',
      iconBg: 'bg-emerald-500', 
      items: ['İş Eğitimleri', 'İş Takipleri', 'Personel', 'İzinler', 'Zimmetler', 'Sertifikalar']
    },
    {
      id: 'hotel',
      title: 'OTEL',
      icon: Hotel,
      bgColor: 'bg-slate-800',
      borderColor: 'border-amber-500',
      iconBg: 'bg-amber-500',
      items: ['İş Eğitimleri', 'İş Takipleri', 'Mutfak', 'Kat Hizmetleri', 'Teknik', 'Sertifikalar']
    },
    {
      id: 'construction',
      title: 'İNŞAAT',
      icon: HardHat,
      bgColor: 'bg-slate-800',
      borderColor: 'border-violet-600',
      iconBg: 'bg-violet-600',
      items: ['İş Eğitimleri', 'İş Takipleri', 'Saha', 'Taşeron', 'Güvenlik', 'Ekipman']
    },
    {
      id: 'small_business',
      title: 'KÜÇÜK İŞLETME',
      icon: Store,
      bgColor: 'bg-slate-800',
      borderColor: 'border-pink-500',
      iconBg: 'bg-pink-500',
      items: ['İş Eğitimleri', 'İş Takipleri', 'Muhasebe', 'Stok', 'Satış', 'Müşteri']
    }
  ];

  const quickActions = [
    {
      id: 'create_certificate',
      title: 'SERTİFİKA OLUŞTUR',
      icon: FilePlus,
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      action: () => onNavigate('templates')
    },
    {
      id: 'keep_minutes',
      title: 'TUTANAK TUT',
      icon: FileText,
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      action: () => onNavigate('templates')
    },
    {
      id: 'daily_report',
      title: 'GÜNLÜK RAPOR TUT',
      icon: ClipboardList,
      bg: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      action: () => onNavigate('templates')
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          YILLIK DOKÜMAN YÖNETİM PANELİ
        </h1>
        <div className="h-1.5 w-32 bg-indigo-600 mx-auto rounded-full shadow-lg shadow-indigo-500/30"></div>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">
          Sektörel İş Analizi ve Doküman Takip Sistemi
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => onNavigate('templates')}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl border-t-[6px] ${cat.borderColor} bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
          >
            <div className="p-6 flex flex-col items-center h-full">
                
                {/* Icon Circle */}
                <div className={`w-20 h-20 rounded-full ${cat.iconBg} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/10`}>
                  <cat.icon size={32} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-slate-800 dark:text-white font-bold text-center mb-6 text-sm tracking-wider uppercase">{cat.title}</h3>

                {/* Items List */}
                <div className="w-full space-y-3 mb-8 flex-1">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group/item">
                       <div className={`w-5 h-5 rounded flex items-center justify-center border ${cat.borderColor} bg-slate-50 dark:bg-slate-900`}>
                          <div className={`w-2.5 h-2.5 rounded-sm ${cat.iconBg} opacity-30 group-hover/item:opacity-100 transition-opacity`}></div>
                       </div>
                       <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200 transition-colors uppercase truncate">
                         {item}
                       </span>
                    </div>
                  ))}
                </div>
                
                {/* Action Button */}
                <button className={`w-full py-2 rounded-lg ${cat.iconBg} text-white text-xs font-bold uppercase tracking-wider opacity-90 hover:opacity-100 transition-opacity shadow-lg`}>
                   Görüntüle
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-16 bg-slate-100 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-center text-slate-500 dark:text-slate-400 font-bold mb-8 uppercase tracking-[0.2em] text-sm">HIZLI İŞLEMLER</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
           {quickActions.map((action) => (
             <button
               key={action.id}
               onClick={action.action}
               className={`${action.bg} ${action.hover} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 group`}
             >
                <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors shadow-inner">
                   <action.icon size={24} className="text-white" />
                </div>
                <span className="font-bold tracking-wide text-sm md:text-base">{action.title}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
