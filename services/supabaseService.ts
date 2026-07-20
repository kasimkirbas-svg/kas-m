import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';
import { SubscriptionPlan, UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

const toAppUser = (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): User => {
  const metadata = authUser.user_metadata || {};
  return {
    id: authUser.id,
    name: String(metadata.name || metadata.fullName || authUser.email?.split('@')[0] || 'Kullanıcı'),
    email: authUser.email || '',
    phone: metadata.phone ? String(metadata.phone) : undefined,
    role: UserRole.SUBSCRIBER,
    plan: SubscriptionPlan.FREE,
    remainingDownloads: 0,
    accountType: metadata.accountType === 'osgb' ? 'osgb' : 'individual',
    profession: metadata.profession ? String(metadata.profession) : undefined,
    companyName: metadata.companyName ? String(metadata.companyName) : undefined,
    taxNumber: metadata.taxNumber ? String(metadata.taxNumber) : undefined,
    taxOffice: metadata.taxOffice ? String(metadata.taxOffice) : undefined,
    address: metadata.address ? String(metadata.address) : undefined,
  };
};

export const getCurrentSupabaseUser = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return toAppUser(data.user);
};

export const registerWithSupabase = async (email: string, password: string, user: User) => {
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        name: user.name,
        phone: user.phone,
        accountType: user.accountType,
        profession: user.profession,
        companyName: user.companyName,
        taxNumber: user.taxNumber,
        taxOffice: user.taxOffice,
        address: user.address,
      },
    },
  });
  if (error) throw error;
  return data.user ? toAppUser(data.user) : user;
};

export const loginWithSupabase = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return toAppUser(data.user);
};

export const requestPasswordReset = async (email: string) => {
  if (!supabase) throw new Error('Şifre sıfırlama için Supabase yapılandırması gereklidir.');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?reset-password=1`,
  });
  if (error) throw error;
};

export const signOutSupabase = async () => {
  if (supabase) await supabase.auth.signOut();
};

const requireUserId = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id || null;
};

export const updateSupabaseProfile = async (changes: Partial<User>) => {
  if (!supabase) return;
  const userId = await requireUserId();
  if (!userId) throw new Error('Oturum bulunamadı.');
  const profile = {
    name: changes.name,
    phone: changes.phone,
    company_name: changes.companyName,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('profiles').update(profile).eq('id', userId);
  if (error) throw error;
  const { error: authError } = await supabase.auth.updateUser({ data: changes });
  if (authError) throw authError;
};

export const updateSupabasePassword = async (password: string) => {
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};

export const changeSupabasePassword = async (email: string, currentPassword: string, nextPassword: string) => {
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (loginError) throw new Error('Mevcut şifreniz doğrulanamadı.');
  await updateSupabasePassword(nextPassword);
};

export const saveSupabaseDraft = async (templateId: string, formData: Record<string, any>) => {
  if (!supabase) return;
  const userId = await requireUserId();
  if (!userId) return;
  const { error } = await supabase.from('document_drafts').upsert(
    { user_id: userId, template_id: templateId, form_data: formData, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,template_id' },
  );
  if (error) throw error;
};

export const getSupabaseDraft = async (templateId: string) => {
  if (!supabase) return null;
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('document_drafts').select('form_data').eq('user_id', userId).eq('template_id', templateId).maybeSingle();
  if (error) throw error;
  return data?.form_data as Record<string, any> | null;
};

export const deleteSupabaseDraft = async (templateId: string) => {
  if (!supabase) return;
  const userId = await requireUserId();
  if (!userId) return;
  const { error } = await supabase.from('document_drafts').delete().eq('user_id', userId).eq('template_id', templateId);
  if (error) throw error;
};

export interface SupabaseHistoryEntry {
  id: string;
  templateId: string;
  title: string;
  category: string;
  createdAt: string;
  fileName: string;
  formData?: Record<string, any>;
}

export const saveSupabaseHistory = async (entry: SupabaseHistoryEntry) => {
  if (!supabase) return;
  const userId = await requireUserId();
  if (!userId) return;
  const { error } = await supabase.from('document_history').insert({
    id: entry.id, user_id: userId, template_id: entry.templateId, title: entry.title,
    category: entry.category, file_name: entry.fileName, form_data: entry.formData || {}, created_at: entry.createdAt,
  });
  if (error) throw error;
};

export const getSupabaseHistory = async (): Promise<SupabaseHistoryEntry[] | null> => {
  if (!supabase) return null;
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('document_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data.map(item => ({ id: item.id, templateId: item.template_id, title: item.title, category: item.category, createdAt: item.created_at, fileName: item.file_name, formData: item.form_data }));
};

export const deleteSupabaseHistory = async (id?: string) => {
  if (!supabase) return;
  const userId = await requireUserId();
  if (!userId) return;
  let query = supabase.from('document_history').delete().eq('user_id', userId);
  if (id) query = query.eq('id', id);
  const { error } = await query;
  if (error) throw error;
};
