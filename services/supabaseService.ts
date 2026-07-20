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

const hydrateAppUser = async (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Promise<User> => {
  const fallback = toAppUser(authUser);
  if (!supabase) return fallback;
  const [{ data: profile, error: profileError }, { data: subscription, error: subscriptionError }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
    supabase.from('subscriptions').select('plan,status').eq('user_id', authUser.id).maybeSingle(),
  ]);
  if (profileError) throw profileError;
  if (subscriptionError) throw subscriptionError;
  const plan = Object.values(SubscriptionPlan).includes(subscription?.plan as SubscriptionPlan)
    ? subscription.plan as SubscriptionPlan
    : SubscriptionPlan.FREE;
  return {
    ...fallback,
    name: profile?.name || fallback.name,
    phone: profile?.phone || fallback.phone,
    role: Object.values(UserRole).includes(profile?.role as UserRole) ? profile.role as UserRole : UserRole.SUBSCRIBER,
    plan,
    remainingDownloads: plan === SubscriptionPlan.YEARLY ? 'UNLIMITED' : plan === SubscriptionPlan.MONTHLY ? 30 : 0,
    accountType: profile?.account_type === 'osgb' ? 'osgb' : 'individual',
    profession: profile?.profession || fallback.profession,
    companyName: profile?.company_name || fallback.companyName,
    taxNumber: profile?.tax_number || fallback.taxNumber,
    taxOffice: profile?.tax_office || fallback.taxOffice,
    address: profile?.address || fallback.address,
  };
};

export const getCurrentSupabaseUser = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return hydrateAppUser(data.user);
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
  return hydrateAppUser(data.user);
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

export interface AdminUserRecord {
  id: string; name: string; email: string; role: UserRole; status: 'active' | 'suspended';
  accountType: 'individual' | 'osgb'; createdAt: string; plan: SubscriptionPlan; subscriptionStatus: string;
}

export interface AdminTemplateRecord {
  id: string; title: string; category: string; description: string; filePath: string;
  fileUrl: string; fields: unknown[]; isPremium: boolean; isActive: boolean; createdAt: string;
}

export interface AdminAuditRecord {
  id: number; action: string; entityType: string; entityId?: string; details: Record<string, unknown>; createdAt: string;
}

export interface SupportTicketRecord {
  id: string; userId: string; subject: string; message: string; status: 'open' | 'in_progress' | 'resolved';
  priority: 'normal' | 'high' | 'urgent'; assignedTo?: string; adminResponse?: string; createdAt: string; updatedAt: string;
}

export const getPublishedTemplates = async (): Promise<import('../types').DocumentTemplate[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('document_templates').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    isPremium: item.is_premium,
    fileUrl: supabase.storage.from('document-templates').getPublicUrl(item.file_path).data.publicUrl,
    fields: item.fields || [],
  }));
};

const requireAdmin = async (allowedRoles: UserRole[] = [UserRole.SUPPORT_ADMIN, UserRole.CONTENT_ADMIN, UserRole.OWNER]) => {
  if (!supabase) throw new Error('Admin işlemleri için Supabase yapılandırması gereklidir.');
  const userId = await requireUserId();
  if (!userId) throw new Error('Oturum bulunamadı.');
  const { data, error } = await supabase.from('profiles').select('role,status').eq('id', userId).single();
  if (error || !allowedRoles.includes(data?.role as UserRole) || data?.status !== 'active') throw new Error('Bu işlem için yetkiniz bulunmuyor.');
  return { userId, role: data.role as UserRole };
};

const writeAuditLog = async (adminId: string, action: string, entityType: string, entityId?: string, details: Record<string, unknown> = {}) => {
  if (!supabase) return;
  const { error } = await supabase.from('admin_audit_logs').insert({ admin_id: adminId, action, entity_type: entityType, entity_id: entityId, details });
  if (error) throw error;
};

export const getAdminDashboardData = async () => {
  const { role } = await requireAdmin();
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  const [profiles, subscriptions, templates, logs, drafts, history] = await Promise.all([
    role === UserRole.OWNER ? supabase.from('profiles').select('id,name,email,role,status,account_type,created_at').order('created_at', { ascending: false }).limit(500) : Promise.resolve({ data: [], error: null }),
    role === UserRole.OWNER ? supabase.from('subscriptions').select('user_id,plan,status') : Promise.resolve({ data: [], error: null }),
    role !== UserRole.SUPPORT_ADMIN ? supabase.from('document_templates').select('*').order('created_at', { ascending: false }).limit(500) : Promise.resolve({ data: [], error: null }),
    role === UserRole.OWNER ? supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(50) : Promise.resolve({ data: [], error: null }),
    role === UserRole.OWNER ? supabase.from('document_drafts').select('*', { count: 'exact', head: true }) : Promise.resolve({ count: 0, error: null }),
    role === UserRole.OWNER ? supabase.from('document_history').select('*', { count: 'exact', head: true }) : Promise.resolve({ count: 0, error: null }),
  ]);
  const failed = [profiles, subscriptions, templates, logs, drafts, history].find(result => result.error);
  if (failed?.error) throw failed.error;
  const subscriptionsByUser = new Map((subscriptions.data || []).map(item => [item.user_id, item]));
  const users: AdminUserRecord[] = (profiles.data || []).map(item => {
    const subscription = subscriptionsByUser.get(item.id);
    return { id: item.id, name: item.name, email: item.email || '', role: item.role, status: item.status, accountType: item.account_type, createdAt: item.created_at, plan: subscription?.plan || SubscriptionPlan.FREE, subscriptionStatus: subscription?.status || 'inactive' };
  });
  const templateRecords: AdminTemplateRecord[] = (templates.data || []).map(item => ({ id: item.id, title: item.title, category: item.category, description: item.description, filePath: item.file_path, fileUrl: supabase.storage.from('document-templates').getPublicUrl(item.file_path).data.publicUrl, fields: item.fields || [], isPremium: item.is_premium, isActive: item.is_active, createdAt: item.created_at }));
  const auditLogs: AdminAuditRecord[] = (logs.data || []).map(item => ({ id: item.id, action: item.action, entityType: item.entity_type, entityId: item.entity_id, details: item.details || {}, createdAt: item.created_at }));
  return { users, templates: templateRecords, auditLogs, draftCount: drafts.count || 0, documentCount: history.count || 0, role };
};

export const updateAdminUser = async (userId: string, changes: { role?: UserRole; status?: 'active' | 'suspended'; plan?: SubscriptionPlan }) => {
  const { userId: adminId } = await requireAdmin([UserRole.OWNER]);
  if (!supabase) return;
  if (userId === adminId && (changes.role !== UserRole.OWNER || changes.status === 'suspended')) throw new Error('Kendi patron erişiminizi kaldıramazsınız.');
  if (changes.role || changes.status) {
    const { error } = await supabase.from('profiles').update({ ...(changes.role && { role: changes.role }), ...(changes.status && { status: changes.status }), updated_at: new Date().toISOString() }).eq('id', userId);
    if (error) throw error;
  }
  if (changes.plan) {
    const { error } = await supabase.from('subscriptions').upsert({ user_id: userId, plan: changes.plan, status: changes.plan === SubscriptionPlan.FREE ? 'inactive' : 'active', updated_at: new Date().toISOString() });
    if (error) throw error;
  }
  await writeAuditLog(adminId, 'user.updated', 'user', userId, changes);
};

export const uploadAdminTemplate = async (input: { title: string; category: string; description: string; isPremium: boolean; fields: unknown[]; file: File }) => {
  const { userId: adminId } = await requireAdmin([UserRole.CONTENT_ADMIN, UserRole.OWNER]);
  if (!supabase) throw new Error('Supabase yapılandırılmadı.');
  if (!input.file.name.toLowerCase().endsWith('.docx')) throw new Error('Yalnızca .docx dosyaları yüklenebilir.');
  if (input.file.size > 25 * 1024 * 1024) throw new Error('Dosya boyutu 25 MB sınırını aşamaz.');
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${crypto.randomUUID()}/${safeName}`;
  const { error: uploadError } = await supabase.storage.from('document-templates').upload(filePath, input.file, { contentType: input.file.type, upsert: false });
  if (uploadError) throw uploadError;
  const { data, error } = await supabase.from('document_templates').insert({ title: input.title, category: input.category, description: input.description, file_path: filePath, fields: input.fields, is_premium: input.isPremium, created_by: adminId }).select('id').single();
  if (error) { await supabase.storage.from('document-templates').remove([filePath]); throw error; }
  await writeAuditLog(adminId, 'template.created', 'template', data.id, { title: input.title, category: input.category });
};

export const setAdminTemplateActive = async (templateId: string, isActive: boolean) => {
  const { userId: adminId } = await requireAdmin([UserRole.CONTENT_ADMIN, UserRole.OWNER]);
  if (!supabase) return;
  const { error } = await supabase.from('document_templates').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', templateId);
  if (error) throw error;
  await writeAuditLog(adminId, isActive ? 'template.activated' : 'template.deactivated', 'template', templateId);
};

export const createSupportTicket = async (subject: string, message: string) => {
  if (!supabase) throw new Error('Canlı destek için Supabase yapılandırması gereklidir.');
  const userId = await requireUserId();
  if (!userId) throw new Error('Destek talebi için giriş yapmalısınız.');
  const { error } = await supabase.from('support_tickets').insert({ user_id: userId, subject: subject.trim(), message: message.trim() });
  if (error) throw error;
};

export const getSupportTickets = async (): Promise<SupportTicketRecord[]> => {
  await requireAdmin([UserRole.SUPPORT_ADMIN, UserRole.OWNER]);
  if (!supabase) return [];
  const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  return data.map(item => ({ id: item.id, userId: item.user_id, subject: item.subject, message: item.message, status: item.status, priority: item.priority, assignedTo: item.assigned_to, adminResponse: item.admin_response, createdAt: item.created_at, updatedAt: item.updated_at }));
};

export const updateSupportTicket = async (ticketId: string, changes: { status?: SupportTicketRecord['status']; priority?: SupportTicketRecord['priority']; adminResponse?: string }) => {
  const { userId: adminId } = await requireAdmin([UserRole.SUPPORT_ADMIN, UserRole.OWNER]);
  if (!supabase) return;
  const { error } = await supabase.from('support_tickets').update({ status: changes.status, priority: changes.priority, admin_response: changes.adminResponse, assigned_to: adminId, updated_at: new Date().toISOString() }).eq('id', ticketId);
  if (error) throw error;
  await writeAuditLog(adminId, 'support.updated', 'support_ticket', ticketId, changes);
};
