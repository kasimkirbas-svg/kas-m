import React from 'react';
import { Factory, Building2, Hotel, HardHat, Store, FilePlus, FileText, ClipboardList, PenTool, TrendingUp, User as UserIcon, Settings, Calendar, ArrowRight, Download, Eye, Plus, ChevronRight, Zap, Target, Briefcase } from 'lucide-react';
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
  const remainingCredits = user.remainingDownloads === 'UNLIMITED' ? 'Sınırsız' : user.remainingDownloads;

  // Modern Cards for Quick Access
  const features = [
    {
      id: 'create',
      title: 'Yeni Doküman',
      desc: 'Şablonlardan oluştur',
      icon: Plus,
      className: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30',
      action: () => onNavigate('templates'),
      isMain: true
    },
    {
      id: 'my-docs',
      title: 'Dokümanlarım',
      desc: `${savedDocuments?.length || 0} kayıtlı belge`,
      icon: FileText,
      className: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      action: () => onNavigate('my-documents'),
      isMain: false
    },
    {
      id: 'profile',
      title: 'Profilim',
      desc: 'Hesap ayarları',
      icon: UserIcon,
      className: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:shadow-lg',
      iconColor: 'text-orange-600 dark:text-orange-400',
      action: () => onNavigate('profile'),
      isMain: false
    },
    {
      id: 'plan',
      title: 'Paketler',
      desc: remainingCredits === 'UNLIMITED' ? 'Pro Plan Aktif' : `${remainingCredits} kredi kaldı`,
      icon: Zap,
      className: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30 text-white',
      action: () => onNavigate('subscription'),
      isMain: true
    }
  ];

  const categories = [
    {
      id: 'construction',
      title: 'İnşaat',
      icon: HardHat,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    {
      id: 'corporate',
      title: 'Kurumsal',
      icon: Building2,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      id: 'production',
      title: 'Üretim',
      icon: Factory,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      border: 'border-slate-200'
    },
    {
      id: 'service',
      title: 'Hizmet',
      icon: Hotel,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    Merhaba, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{user.name}</span> 👋
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                    {companyName} için doküman yönetimine hoş geldin. Bugün ne oluşturmak istersin?
                  </p>
              </div>
              
              <div className="flex gap-4">
                  <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kalan Haklar</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{remainingCredits}</p>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-700 h-10 self-center"></div>
                  <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Oluşturulan</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{savedDocuments.length}</p>
                  </div>
              </div>
          </div>

          {/* Search Bar - Fake for UI */}
          <div className="mt-8 relative max-w-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Target className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                  type="text" 
                  placeholder="Şablon ara... (Örn: İş Sözleşmesi, Fatura)" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
                  onClick={() => onNavigate('templates')}
              />
              <div className="absolute inset-y-2 right-2 flex items-center">
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      ⌘K
                  </button>
              </div>
          </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
              <button
                  key={f.id}
                  onClick={f.action}
                  className={`text-left relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between h-40 transition-all transform hover:-translate-y-1 hover:shadow-xl group ${
                      f.isMain 
                      ? `${f.className} text-white`
                      : `${f.className}`
                  }`}
              >
                  <div className={`p-3 rounded-xl w-fit mb-3 transition-colors ${
                      f.isMain ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700/50 ' + f.iconColor
                  }`}>
                      <f.icon size={24} className={f.isMain ? 'text-white' : ''} />
                  </div>
                  <div>
                      <h3 className={`font-bold text-lg mb-1 ${f.isMain ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                          {f.title}
                      </h3>
                      <p className={`text-sm font-medium ${f.isMain ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                          {f.desc}
                      </p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={20} className={f.isMain ? 'text-white' : 'text-slate-400'} />
                  </div>
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECTORS / CATEGORIES */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="text-indigo-500" />
                      Sektörel Şablonlar
                  </h2>
                  <button onClick={() => onNavigate('templates')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                      Tümünü Gör
                  </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => onNavigate('templates')}
                        className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 group text-left flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-800 ${cat.border} hover:shadow-lg dark:border-slate-700`}
                      >
                          <div className={`p-4 rounded-full ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                              <cat.icon size={28} />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{cat.title}</span>
                      </button>
                  ))}
              </div>

              {/* TRENDING TEMPLATES */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="text-emerald-500" />
                      Popüler Şablonlar
                  </h3>
                  <div className="space-y-3">
                     {/* Show a few templates, mock filtering */}
                      {templates.slice(0, 3).map((tpl, i) => (
                          <div 
                            key={tpl.id}
                            onClick={() => onTemplateSelect(tpl)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
                          >
                              <div className="font-mono text-xs font-bold text-slate-400 w-6">0{i+1}</div>
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                  <FileText size={20} />
                              </div>
                              <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tpl.title}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{tpl.category}</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronRight size={16} className="text-slate-400" />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* RECENT ACTIVITY SIDEBAR */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 h-fit">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="text-slate-500" />
                  Son Aktiviteler
              </h3>
              
              {recentDocuments && recentDocuments.length > 0 ? (
                  <div className="space-y-4">
                      {recentDocuments.map((doc, idx) => {
                          const tpl = templates.find(t => t.id === doc.templateId);
                          return (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-3">
                              <div className="shrink-0 pt-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 align-top"></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mb-1">
                                      {tpl ? tpl.title : 'Bilinmeyen Belge'}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                      {new Date(doc.createdAt).toLocaleDateString('tr-TR')} • {new Date(doc.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                  <div className="flex gap-2">
                                      <button 
                                          onClick={() => onNavigate('my-documents')} 
                                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded hover:bg-indigo-100 transition"
                                      >
                                          Görüntüle
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )})}
                      <button onClick={() => onNavigate('my-documents')} className="w-full py-3 text-center text-sm font-medium text-slate-500 hover:text-slate-800 transition border-t border-slate-200 mt-2">
                          Tüm geçmişi gör
                      </button>
                  </div>
              ) : (
                  <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                          <ClipboardList size={24} />
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Henüz bir doküman oluşturmadınız.</p>
                      <button 
                          onClick={() => onNavigate('templates')}
                          className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-xl hover:opacity-90 transition shadow-lg"
                      >
                          İlk Belgeni Oluştur
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
