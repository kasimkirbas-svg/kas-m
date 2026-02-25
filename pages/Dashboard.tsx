import React, { useState } from 'react';
import { Factory, Building2, Hotel, HardHat, Store, FilePlus, FileText, ClipboardList, PenTool, TrendingUp, User as UserIcon, Settings, Calendar, ArrowRight, Download, Eye, Plus, ChevronRight, Zap, Target, Briefcase, Sparkles, PieChart, Activity } from 'lucide-react';
import { User, DocumentTemplate, GeneratedDocument } from '../types';

interface DashboardProps {
  user: User;
  t: any;
  onNavigate: (view: string) => void;
  onTemplateSelect: (template: DocumentTemplate | null) => void;
  templates: DocumentTemplate[];
  recentDocuments?: GeneratedDocument[];
  savedDocuments?: GeneratedDocument[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, t, onNavigate, onTemplateSelect, templates, recentDocuments = [], savedDocuments = [] }) => {
  const companyName = user.companyName || 'Şirket Adı Yok';
  const remainingCredits = user.remainingDownloads === 'UNLIMITED' ? 1000 : user.remainingDownloads;
  const isUnlimited = user.remainingDownloads === 'UNLIMITED';

  // Calculate usage percentage for progress bar
  const totalLimit = isUnlimited ? 1000 : (user.plan === 'FREE' ? 5 : 50); // Warning: approximate
  const usagePercent = isUnlimited ? 5 : Math.min(100, (savedDocuments.length / totalLimit) * 100);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Modern Cards for Quick Access
  const features = [
    {
      id: 'create',
      title: 'Yeni Doküman',
      desc: 'Şablonlardan oluştur',
      icon: Plus,
      className: 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white',
      iconColor: 'text-white',
      action: () => onNavigate('templates'),
      isMain: true
    },
    {
      id: 'my-docs',
      title: 'Dokümanlarım',
      desc: `${savedDocuments?.length || 0} kayıtlı belge`,
      icon: FileText,
      className: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-xl transition-all',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      action: () => onNavigate('my-documents'),
      isMain: false
    },
    {
      id: 'profile',
      title: 'Profilim',
      desc: 'Hesap ayarları',
      icon: UserIcon,
      className: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:shadow-xl transition-all',
      iconColor: 'text-orange-600 dark:text-orange-400',
      action: () => onNavigate('profile'),
      isMain: false
    },
    {
      id: 'plan',
      title: 'Paketler',
      desc: isUnlimited ? 'Pro Plan Aktif' : `${remainingCredits} kredi kaldı`,
      icon: Zap,
      className: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30 text-white',
      iconColor: 'text-white',
      action: () => onNavigate('subscription'),
      isMain: true
    }
  ];

  const categories = [
    {
      id: 'construction',
      title: 'İnşaat',
      desc: 'Şantiye ve denetim',
      icon: HardHat,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      border: 'border-orange-200',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'corporate',
      title: 'Kurumsal',
      desc: 'Ofis ve yönetim',
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'production',
      title: 'Üretim',
      desc: 'Fabrika ve imalat',
      icon: Factory,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'service',
      title: 'Hizmet',
      desc: 'Otel ve restoran',
      icon: Hotel,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10 dark:from-indigo-900/10" />
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50 backdrop-blur-sm dark:border-slate-700 isolate group">
          {/* Architectural Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/30 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 group-hover:bg-rose-500/30 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-4 border border-indigo-100 dark:border-indigo-800">
                    <Sparkles size={14} />
                    <span>v2.4 Dashboard</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                    Hoş geldin, <br/>
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">{user.name}</span>
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{companyName}</span> dijital dönüşüm platformuna erişiminiz aktif. 
                    Bugün hangi operasyonu yönetmek istersiniz?
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                      <button 
                        onClick={() => onNavigate('templates')}
                        className="px-6 py-3.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Plus size={20} />
                        Hemen Oluştur
                      </button>
                      <button 
                        onClick={() => onNavigate('my-documents')}
                        className="px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                      >
                        <FileText size={20} />
                        Taslaklarım
                      </button>
                  </div>
              </div>
              
              {/* Stats Card in Hero */}
              <div className="w-full lg:w-auto min-w-[300px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-slate-700 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity size={18} className="text-emerald-500" />
                      Plan Durumu
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
                      AKTİF
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-500 dark:text-slate-400">Kullanılan Hak</span>
                        <span className="text-slate-900 dark:text-white">{savedDocuments.length} / {isUnlimited ? '∞' : totalLimit}</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${usagePercent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold">Oluşturulan</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{savedDocuments.length}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold">Kalan</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{isUnlimited ? '∞' : remainingCredits}</p>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
              <button
                  key={f.id}
                  onClick={f.action}
                  className={`text-left relative overflow-hidden p-6 rounded-[2rem] flex flex-col justify-between h-44 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group ${
                      f.isMain 
                      ? `${f.className}`
                      : `${f.className}`
                  }`}
              >
                  <div className={`p-3.5 rounded-2xl w-fit mb-3 transition-colors ${
                      f.isMain ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-100 dark:bg-slate-700/50 ' + f.iconColor
                  }`}>
                      <f.icon size={26} className={f.isMain ? 'text-white' : ''} />
                  </div>
                  <div>
                      <h3 className={`font-bold text-lg mb-1 ${f.isMain ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                          {f.title}
                      </h3>
                      <p className={`text-sm font-medium opacity-80 ${f.isMain ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {f.desc}
                      </p>
                  </div>
                  
                  {/* Hover Icon */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight size={24} className={f.isMain ? 'text-white/80' : 'text-slate-400'} />
                  </div>
                  
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SECTORS / CATEGORIES */}
          <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                        <Briefcase className="text-indigo-500" />
                        Sektörel Çözümler
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">İş alanınıza özel hazırlanmış profesyonel şablonlar</p>
                  </div>
                  <button onClick={() => onNavigate('templates')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-colors">
                      Tümünü İncele
                  </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onMouseEnter={() => setHoveredCard(cat.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => onNavigate('templates')}
                        className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group text-left h-36 bg-white dark:bg-slate-800 ${cat.border} hover:shadow-xl dark:border-slate-700 flex items-center gap-6`}
                      >
                          <div className={`p-5 rounded-2xl ${cat.bg} ${cat.color} shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                              <cat.icon size={32} />
                          </div>
                          
                          <div className="relative z-10">
                              <span className="block text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{cat.title}</span>
                              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{cat.desc}</span>
                          </div>

                          {/* Hover Gradient Background */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                          
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                             <ChevronRight size={24} className="text-slate-300 dark:text-slate-600" />
                          </div>
                      </button>
                  ))}
              </div>

              {/* POPULAR TEMPLATES ROW */}
              <div className="pt-6">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-rose-500" />
                    En Çok Kullanılanlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {/* Show a few templates */}
                    {templates.slice(0, 3).map((tpl, i) => (
                        <div 
                          key={tpl.id}
                          onClick={() => onTemplateSelect(tpl)}
                          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText size={64} className="text-indigo-600" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit mb-3">
                                    <FileText size={20} />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mb-1">{tpl.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{tpl.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          </div>

          {/* RECENT ACTIVITY SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="text-slate-500" />
                        Son İşlemler
                    </h3>
                    <button onClick={() => onNavigate('my-documents')} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        Tümü
                    </button>
                </div>
                
                {recentDocuments && recentDocuments.length > 0 ? (
                    <div className="space-y-4">
                        {recentDocuments.slice(0, 5).map((doc, idx) => {
                            const tpl = templates.find(t => t.id === doc.templateId);
                            return (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 transition-transform hover:scale-[1.02] group cursor-pointer" onClick={() => onNavigate('my-documents')}>
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden">
                                        {tpl?.backgroundImage ? (
                                            <img src={tpl.backgroundImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <FileText size={20} />
                                        )}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1 flex flex-col justify-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                        {tpl ? tpl.title : 'Bilinmeyen Belge'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        {new Date(doc.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-indigo-600">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                ) : (
                    <div className="text-center py-12 px-4 flex flex-col items-center justify-center h-64">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <ClipboardList size={32} />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6 text-center">Henüz yakın zamanda bir işlem yapmadınız.</p>
                        <button 
                            onClick={() => onNavigate('templates')}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition w-full shadow-sm"
                        >
                            İlk Belgeyi Oluştur
                        </button>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};
