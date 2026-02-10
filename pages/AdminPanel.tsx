import React, { useState } from 'react';
import { Users, FileText, DollarSign, Shield, TrendingUp, Search, MoreHorizontal, Plus, Trash2, Edit2, Download, Activity } from 'lucide-react';

interface AdminPanelProps {
  user?: any;
  t?: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, t }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      label: t?.admin?.activeSubscribers || 'Aktif Abone',
      value: '1,240',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: t?.admin?.totalDocuments || 'Üretilen Doküman',
      value: '8,503',
      change: '+8%',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: t?.admin?.revenue || 'Aylık Ciro',
      value: '₺142.5K',
      change: '+24%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: t?.admin?.totalTemplates || 'Aktif Şablonlar',
      value: '35',
      change: 'Sabit',
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  const subscribers = [
    { name: 'Mehmet Demir', company: 'Demir Lojistik A.Ş.', plan: 'Yıllık Pro', status: 'Aktif', joinDate: '15.01.2026' },
    { name: 'Ayşe Kaya', company: 'Kaya Mimarlık', plan: 'Aylık', status: 'Gecikmiş', joinDate: '20.12.2025' },
    { name: 'Caner Erkin', company: 'Freelance', plan: 'Deneme', status: 'Yeni', joinDate: '08.02.2026' },
    { name: 'Fatih Şimşek', company: 'Şimşek Elektrik', plan: 'Yıllık Pro', status: 'Aktif', joinDate: '10.11.2025' },
  ];

  const recentLogs = [
    { action: 'Yeni üyelik: Demir Lojistik', time: '5 dk önce', type: 'success', icon: Users },
    { action: 'Fatura kesildi: #INV-2024001', time: '12 dk önce', type: 'success', icon: FileText },
    { action: 'Şablon güncellendi: Risk Analizi', time: '1 saat önce', type: 'info', icon: Shield },
    { action: 'Ödeme başarısız: Kaya Mimarlık', time: '3 saat önce', type: 'warning', icon: TrendingUp },
  ];

  const templates = [
    { id: 1, name: 'Acil Durum Planı', category: 'ISG', downloads: 450, status: 'Aktif' },
    { id: 2, name: 'Denetim Raporu', category: 'Denetim', downloads: 332, status: 'Aktif' },
    { id: 3, name: 'Risk Analizi', category: 'ISG', downloads: 289, status: 'Aktif' },
    { id: 4, name: 'Eğitim Sertifikası', category: 'İK', downloads: 201, status: 'Aktif' },
  ];

  const invoices = [
    { number: 'INV-202601001', date: '01.02.2026', customer: 'Mehmet Demir', amount: '4999 TL', status: 'Ödendi' },
    { number: 'INV-202601002', date: '02.02.2026', customer: 'Ayşe Kaya', amount: '499 TL', status: 'Beklemede' },
    { number: 'INV-202601003', date: '05.02.2026', customer: 'Caner Erkin', amount: '0 TL', status: 'Deneme' },
    { number: 'INV-202601004', date: '07.02.2026', customer: 'Fatih Şimşek', amount: '4999 TL', status: 'Ödendi' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t?.admin?.title || 'Yönetici Paneli'}</h1>
          <p className="text-slate-600 mt-1">{t?.admin?.statistics || 'Sistem genel durum özeti ve yönetimi'}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2">
          <Download size={18} />
          {t?.common?.download || 'Rapor İndir'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${stat.bg} ${stat.color} rounded-lg`}>
                  <Icon size={20} />
                </div>
                <span className="text-green-500 text-xs font-bold flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        {['overview', 'subscribers', 'templates', 'invoices', 'logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab === 'overview' && 'Genel Bakış'}
            {tab === 'subscribers' && 'Aboneler'}
            {tab === 'templates' && 'Şablonlar'}
            {tab === 'invoices' && 'Faturalar'}
            {tab === 'logs' && 'Sistem Kayıtları'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Son Üyelikler</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Kullanıcı</th>
                    <th className="px-6 py-3">Paket</th>
                    <th className="px-6 py-3">Durum</th>
                    <th className="px-6 py-3">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.slice(0, 3).map((subscriber, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{subscriber.name}</div>
                        <div className="text-xs text-slate-500">{subscriber.company}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{subscriber.plan}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          subscriber.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                          subscriber.status === 'Gecikmiş' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-blue-600 transition">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={20} />
              Sistem Hareketleri
            </h3>
            <div className="space-y-4">
              {recentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    log.type === 'success' ? 'bg-green-100' :
                    log.type === 'warning' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <log.icon size={16} className={
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium transition">
              Tüm Kayıtları Gör →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Tüm Aboneler</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2">
              <Plus size={18} />
              Yeni Abone
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">{t?.admin?.subscribers || 'Aboneler'}</th>
                  <th className="px-6 py-3">{t?.dashboard?.package || 'Plan'}</th>
                  <th className="px-6 py-3">{t?.common?.confirm || 'Durum'}</th>
                  <th className="px-6 py-3">{t?.editor?.date || 'Katılım Tarihi'}</th>
                  <th className="px-6 py-3">{t?.common?.edit || 'İşlem'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((subscriber, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{subscriber.name}</div>
                      <div className="text-xs text-slate-500">{subscriber.company}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{subscriber.plan}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        subscriber.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                        subscriber.status === 'Gecikmiş' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{subscriber.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded transition" title="Düzenle">
                          <Edit2 size={16} className="text-slate-600" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded transition text-red-600" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Doküman Şablonları</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2">
              <Plus size={18} />
              Yeni Şablon
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Şablon Adı</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">İndirmeler</th>
                  <th className="px-6 py-3">Durum</th>
                  <th className="px-6 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((template, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{template.name}</td>
                    <td className="px-6 py-4 text-slate-600">{template.category}</td>
                    <td className="px-6 py-4 text-slate-600">{template.downloads}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded transition text-slate-600">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded transition text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">Faturalar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Fatura No</th>
                  <th className="px-6 py-3">Tarih</th>
                  <th className="px-6 py-3">Müşteri</th>
                  <th className="px-6 py-3">Tutar</th>
                  <th className="px-6 py-3">Durum</th>
                  <th className="px-6 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{invoice.number}</td>
                    <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-slate-600">{invoice.customer}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === 'Ödendi' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        İndir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">Sistem Kayıtları</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLogs.concat(recentLogs).map((log, idx) => (
              <div key={idx} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  log.type === 'success' ? 'bg-green-100' :
                  log.type === 'warning' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <log.icon size={16} className={
                    log.type === 'success' ? 'text-green-600' :
                    log.type === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  } />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">{log.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
