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
