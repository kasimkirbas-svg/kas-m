import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Ban, CheckCircle2, FileText, HeadphonesIcon, RefreshCw, Search, ShieldCheck, Upload, Users } from 'lucide-react';
import { SubscriptionPlan, UserRole } from '../types';
import { getAdminDashboardData, getSupportTickets, setAdminTemplateActive, updateAdminUser, updateSupportTicket, uploadAdminTemplate, type AdminAuditRecord, type AdminTemplateRecord, type AdminUserRecord, type SupportTicketRecord } from '../services/supabaseService';

type AdminData = { users: AdminUserRecord[]; templates: AdminTemplateRecord[]; auditLogs: AdminAuditRecord[]; draftCount: number; documentCount: number; role?: UserRole };
type AdminTab = 'users' | 'templates' | 'support' | 'audit';
const emptyData: AdminData = { users: [], templates: [], auditLogs: [], draftCount: 0, documentCount: 0 };

export default function Admin() {
  const [data, setData] = useState<AdminData>(emptyData);
  const [tab, setTab] = useState<AdminTab>('users');
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [upload, setUpload] = useState({ title: '', category: '', description: '', isPremium: false, fields: '[]', file: null as File | null });

  const load = async () => {
    try {
      setLoading(true);
      const nextData = await getAdminDashboardData();
      setData(nextData);
      if (nextData.role === UserRole.SUPPORT_ADMIN || nextData.role === UserRole.OWNER) setTickets(await getSupportTickets());
      if (nextData.role === UserRole.SUPPORT_ADMIN) setTab('support');
      if (nextData.role === UserRole.CONTENT_ADMIN) setTab('templates');
      setMessage(null);
    }
    catch (error: any) { setMessage({ type: 'error', text: error.message || 'Yönetim verileri alınamadı.' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const mutateUser = async (userId: string, changes: Parameters<typeof updateAdminUser>[1]) => {
    try { setBusy(userId); await updateAdminUser(userId, changes); await load(); setMessage({ type: 'success', text: 'Kullanıcı bilgileri güncellendi.' }); }
    catch (error: any) { setMessage({ type: 'error', text: error.message || 'Kullanıcı güncellenemedi.' }); }
    finally { setBusy(null); }
  };
  const submitTemplate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!upload.file) return setMessage({ type: 'error', text: 'Bir DOCX dosyası seçin.' });
    try {
      const fields = JSON.parse(upload.fields);
      if (!Array.isArray(fields)) throw new Error('Alan tanımları JSON dizisi olmalıdır.');
      setBusy('upload');
      await uploadAdminTemplate({ ...upload, file: upload.file, fields });
      setUpload({ title: '', category: '', description: '', isPremium: false, fields: '[]', file: null });
      await load(); setMessage({ type: 'success', text: 'Şablon yüklendi ve yayına alındı.' });
    } catch (error: any) { setMessage({ type: 'error', text: error.message || 'Şablon yüklenemedi.' }); }
    finally { setBusy(null); }
  };
  const toggleTemplate = async (template: AdminTemplateRecord) => {
    try { setBusy(template.id); await setAdminTemplateActive(template.id, !template.isActive); await load(); }
    catch (error: any) { setMessage({ type: 'error', text: error.message || 'Şablon durumu değiştirilemedi.' }); }
    finally { setBusy(null); }
  };
  const respondToTicket = async (ticket: SupportTicketRecord, status: SupportTicketRecord['status'], adminResponse = ticket.adminResponse || '') => {
    try { setBusy(ticket.id); await updateSupportTicket(ticket.id, { status, adminResponse }); setTickets(await getSupportTickets()); setMessage({ type: 'success', text: 'Destek talebi güncellendi.' }); }
    catch (error: any) { setMessage({ type: 'error', text: error.message || 'Destek talebi güncellenemedi.' }); }
    finally { setBusy(null); }
  };

  const normalized = query.toLocaleLowerCase('tr');
  const users = useMemo(() => data.users.filter(item => `${item.name} ${item.email}`.toLocaleLowerCase('tr').includes(normalized)), [data.users, normalized]);
  const templates = useMemo(() => data.templates.filter(item => `${item.title} ${item.category}`.toLocaleLowerCase('tr').includes(normalized)), [data.templates, normalized]);
  const tabs: Array<[AdminTab, string]> = data.role === UserRole.OWNER ? [['users', 'Kullanıcılar'], ['templates', 'Şablonlar'], ['support', 'Canlı destek'], ['audit', 'İşlem kayıtları']] : data.role === UserRole.CONTENT_ADMIN ? [['templates', 'Şablonlar']] : [['support', 'Canlı destek']];
  const inputClass = 'min-h-11 w-full rounded-lg border border-white/10 bg-[#101a21] px-3 text-sm text-white outline-none focus:border-amber-400';

  return <section className="mx-auto max-w-[1400px] px-4 py-7 sm:px-7 sm:py-10">
    <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-300"><ShieldCheck size={17} /> {data.role === UserRole.OWNER ? 'Patron yönetim merkezi' : data.role === UserRole.CONTENT_ADMIN ? 'Doküman yönetim merkezi' : 'Canlı destek merkezi'}</div><h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Sistem Yönetimi</h1><p className="mt-2 text-sm text-slate-400">Rolünüze tanımlı operasyonları yönetin.</p></div>
      <button onClick={() => void load()} disabled={loading} title="Verileri yenile" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#18252d] px-4 text-sm font-bold text-slate-200 hover:border-amber-400/50 disabled:opacity-50"><RefreshCw size={17} className={loading ? 'animate-spin' : ''} /> Yenile</button>
    </header>

    {message && <div className={`mt-5 rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-red-400/25 bg-red-400/10 text-red-300'}`}>{message.text}</div>}

    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[{ label: 'Toplam kullanıcı', value: data.users.length, icon: Users }, { label: 'Aktif şablon', value: data.templates.filter(item => item.isActive).length, icon: FileText }, { label: 'Açık taslak', value: data.draftCount, icon: Activity }, { label: 'Üretilen doküman', value: data.documentCount, icon: CheckCircle2 }].map(item => <div key={item.label} className="border-l-2 border-amber-300 bg-[#1c2a33]/80 p-5"><item.icon size={19} className="text-amber-300" /><strong className="mt-4 block text-3xl font-black text-white">{item.value}</strong><span className="mt-1 block text-xs text-slate-400">{item.label}</span></div>)}
    </div>

    <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-lg bg-[#101a21] p-1">{tabs.map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`min-h-10 px-4 text-sm font-bold ${tab === value ? 'rounded-md bg-amber-300 text-[#111820]' : 'text-slate-400'}`}>{label}</button>)}</div>
      {(tab === 'users' || tab === 'templates') && <label className="relative block w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ara..." className={`${inputClass} pl-10`} /></label>}
    </div>

    {loading ? <div className="flex min-h-72 items-center justify-center text-sm text-slate-400"><RefreshCw size={20} className="mr-3 animate-spin" /> Yönetim verileri yükleniyor</div> : tab === 'users' ? <div className="mt-5 overflow-x-auto border border-white/10">
      <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#101a21] text-xs uppercase text-slate-500"><tr><th className="p-4">Kullanıcı</th><th className="p-4">Hesap</th><th className="p-4">Rol</th><th className="p-4">Paket</th><th className="p-4">Durum</th></tr></thead><tbody className="divide-y divide-white/10">{users.map(item => <tr key={item.id} className="bg-[#18252d]/75"><td className="p-4"><strong className="block text-white">{item.name}</strong><span className="text-xs text-slate-400">{item.email}</span></td><td className="p-4 text-slate-300">{item.accountType === 'osgb' ? 'OSGB' : 'Bireysel'}</td><td className="p-4"><select disabled={busy === item.id} value={item.role} onChange={event => void mutateUser(item.id, { role: event.target.value as UserRole })} className={inputClass}><option value={UserRole.SUBSCRIBER}>Abone</option><option value={UserRole.SUPPORT_ADMIN}>Canlı Destek</option><option value={UserRole.CONTENT_ADMIN}>Doküman Yöneticisi</option><option value={UserRole.OWNER}>Patron</option></select></td><td className="p-4"><select disabled={busy === item.id} value={item.plan} onChange={event => void mutateUser(item.id, { plan: event.target.value as SubscriptionPlan })} className={inputClass}><option value={SubscriptionPlan.FREE}>Ücretsiz</option><option value={SubscriptionPlan.MONTHLY}>Aylık</option><option value={SubscriptionPlan.YEARLY}>Yıllık</option></select></td><td className="p-4"><button disabled={busy === item.id} onClick={() => void mutateUser(item.id, { status: item.status === 'active' ? 'suspended' : 'active' })} className={`flex min-h-10 items-center gap-2 px-3 font-bold ${item.status === 'active' ? 'text-emerald-300' : 'text-red-300'}`}>{item.status === 'active' ? <CheckCircle2 size={17} /> : <Ban size={17} />}{item.status === 'active' ? 'Aktif' : 'Askıda'}</button></td></tr>)}</tbody></table>
    </div> : tab === 'templates' ? <div className="mt-5 grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submitTemplate} className="space-y-4 border border-white/10 bg-[#18252d]/80 p-5"><div><h2 className="font-black text-white">Yeni DOCX Yayınla</h2><p className="mt-1 text-xs text-slate-400">Dosya Storage alanına yüklenir ve kataloğa eklenir.</p></div><input required placeholder="Doküman adı" value={upload.title} onChange={event => setUpload(current => ({ ...current, title: event.target.value }))} className={inputClass} /><input required placeholder="Kategori" value={upload.category} onChange={event => setUpload(current => ({ ...current, category: event.target.value }))} className={inputClass} /><textarea placeholder="Açıklama" value={upload.description} onChange={event => setUpload(current => ({ ...current, description: event.target.value }))} rows={3} className={`${inputClass} py-3`} /><div><label className="mb-2 block text-xs font-bold text-slate-400">Alan tanımları (JSON)</label><textarea value={upload.fields} onChange={event => setUpload(current => ({ ...current, fields: event.target.value }))} rows={5} className={`${inputClass} py-3 font-mono text-xs`} /></div><label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={upload.isPremium} onChange={event => setUpload(current => ({ ...current, isPremium: event.target.checked }))} className="accent-amber-300" /> Premium şablon</label><label className="flex min-h-24 cursor-pointer flex-col items-center justify-center border border-dashed border-white/20 bg-[#101a21] text-sm text-slate-400 hover:border-amber-400/60"><Upload size={21} className="mb-2 text-amber-300" />{upload.file?.name || 'DOCX dosyası seç'}<input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={event => setUpload(current => ({ ...current, file: event.target.files?.[0] || null }))} /></label><button disabled={busy === 'upload'} className="flex min-h-12 w-full items-center justify-center gap-2 bg-amber-300 font-black text-[#111820] disabled:opacity-50"><Upload size={18} />{busy === 'upload' ? 'Yükleniyor...' : 'Yükle ve Yayınla'}</button></form>
      <div className="space-y-3">{templates.map(item => <article key={item.id} className="flex items-center gap-4 border border-white/10 bg-[#18252d]/75 p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#101a21] text-amber-300"><FileText size={20} /></div><div className="min-w-0 flex-1"><h3 className="truncate font-bold text-white">{item.title}</h3><p className="mt-1 text-xs text-slate-400">{item.category} · {item.isPremium ? 'Premium' : 'Standart'}</p></div><button disabled={busy === item.id} onClick={() => void toggleTemplate(item)} className={`min-h-10 px-3 text-sm font-bold ${item.isActive ? 'text-emerald-300' : 'text-slate-400'}`}>{item.isActive ? 'Yayında' : 'Kapalı'}</button></article>)}</div>
    </div> : tab === 'support' ? <div className="mt-5 space-y-3">{tickets.length === 0 ? <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-white/15 text-slate-400"><HeadphonesIcon size={32} /><p className="mt-3 text-sm">Bekleyen destek talebi yok.</p></div> : tickets.map(ticket => <article key={ticket.id} className="border border-white/10 bg-[#18252d]/75 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${ticket.status === 'resolved' ? 'bg-emerald-400' : ticket.status === 'in_progress' ? 'bg-amber-300' : 'bg-red-400'}`} /><h3 className="font-bold text-white">{ticket.subject}</h3></div><p className="mt-2 text-sm leading-6 text-slate-300">{ticket.message}</p><p className="mt-2 text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleString('tr-TR')} · Kullanıcı: {ticket.userId}</p></div><select value={ticket.status} disabled={busy === ticket.id} onChange={event => void respondToTicket(ticket, event.target.value as SupportTicketRecord['status'])} className={`${inputClass} w-auto`}><option value="open">Açık</option><option value="in_progress">İşlemde</option><option value="resolved">Çözüldü</option></select></div><textarea defaultValue={ticket.adminResponse || ''} id={`response-${ticket.id}`} rows={3} placeholder="Destek yanıtı..." className={`${inputClass} mt-4 py-3`} /><button disabled={busy === ticket.id} onClick={() => { const response = (document.getElementById(`response-${ticket.id}`) as HTMLTextAreaElement)?.value || ''; void respondToTicket(ticket, 'resolved', response); }} className="mt-3 min-h-10 bg-amber-300 px-4 text-sm font-black text-[#111820]">Yanıtla ve Çöz</button></article>)}</div> : <div className="mt-5 divide-y divide-white/10 border border-white/10">{data.auditLogs.map(log => <article key={log.id} className="grid gap-2 bg-[#18252d]/75 p-4 sm:grid-cols-[180px_1fr_auto]"><span className="font-mono text-xs text-amber-300">{log.action}</span><span className="text-sm text-slate-300">{log.entityType}{log.entityId ? ` · ${log.entityId}` : ''}</span><time className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('tr-TR')}</time></article>)}</div>}
  </section>;
}