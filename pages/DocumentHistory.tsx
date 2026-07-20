import React, { useMemo, useState } from 'react';
import { FileClock, FileText, Search, Trash2 } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  templateId: string;
  title: string;
  category: string;
  createdAt: string;
  fileName: string;
}

const readHistory = (): HistoryEntry[] => {
  try { return JSON.parse(localStorage.getItem('isg_document_history') || '[]'); } catch { return []; }
};

export const DocumentHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => history.filter(item => `${item.title} ${item.category}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))), [history, query]);
  const remove = (id: string) => { const next = history.filter(item => item.id !== id); setHistory(next); localStorage.setItem('isg_document_history', JSON.stringify(next)); };
  const clear = () => { if (confirm('Tüm doküman geçmişi silinsin mi?')) { setHistory([]); localStorage.removeItem('isg_document_history'); } };

  return <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7"><div><div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-xs font-black tracking-widest uppercase"><FileClock size={16} /> Doküman Merkezi</div><h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">Doküman Geçmişi</h1><p className="mt-2 text-slate-600 dark:text-slate-400">İndirdiğiniz belgeleri ve oluşturulma tarihlerini görüntüleyin.</p></div>{history.length > 0 && <button onClick={clear} className="min-h-11 px-4 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2 text-sm font-bold"><Trash2 size={17} /> Geçmişi Temizle</button>}</div>
    <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={19} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Geçmişte ara..." className="w-full min-h-14 pl-12 pr-4 rounded-xl bg-white/85 dark:bg-[#101010]/85 border border-slate-300 dark:border-white/10 text-slate-950 dark:text-white outline-none focus:border-yellow-500" /></div>
    {filtered.length ? <div className="space-y-3">{filtered.map(item => <article key={item.id} className="p-4 sm:p-5 rounded-xl bg-white/80 dark:bg-[#101010]/85 border border-slate-200 dark:border-white/10 flex items-center gap-4"><div className="w-11 h-11 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0"><FileText size={21} /></div><div className="min-w-0 flex-1"><h2 className="font-bold text-slate-950 dark:text-white truncate">{item.title}</h2><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.category} · {new Date(item.createdAt).toLocaleString('tr-TR')}</p></div><button onClick={() => remove(item.id)} title="Kaydı sil" className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10"><Trash2 size={17} /></button></article>)}</div> : <div className="min-h-64 rounded-xl border border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-center p-6"><FileClock size={44} className="text-slate-300 dark:text-slate-700" /><h2 className="mt-4 font-bold text-slate-800 dark:text-white">Henüz doküman geçmişi yok</h2><p className="mt-2 text-sm text-slate-500">Düzenleyiciden indirdiğiniz belgeler burada listelenecek.</p></div>}
  </section>;
};
