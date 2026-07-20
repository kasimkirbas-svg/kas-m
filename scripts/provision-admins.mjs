import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error('SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri gereklidir.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const accounts = [
  { email: process.env.OWNER_EMAIL || 'patron@isgzeyron.com', name: 'Sistem Patronu', role: 'OWNER' },
  { email: process.env.CONTENT_ADMIN_EMAIL || 'dokuman@isgzeyron.com', name: 'Doküman Yöneticisi', role: 'CONTENT_ADMIN' },
  { email: process.env.SUPPORT_ADMIN_EMAIL || 'destek@isgzeyron.com', name: 'Canlı Destek Personeli', role: 'SUPPORT_ADMIN' },
];

const credentials = [];
for (const account of accounts) {
  const password = `${randomBytes(12).toString('base64url')}Aa1!`;
  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: { name: account.name, accountType: 'individual' },
  });
  if (error) throw new Error(`${account.email}: ${error.message}`);
  const { error: profileError } = await supabase.from('profiles').update({ name: account.name, email: account.email, role: account.role, status: 'active' }).eq('id', data.user.id);
  if (profileError) throw new Error(`${account.email}: ${profileError.message}`);
  credentials.push({ role: account.role, email: account.email, password });
}

console.log('\nYönetici hesapları oluşturuldu. Şifreleri güvenli bir kasaya kaydedin ve ilk girişte değiştirin:\n');
console.table(credentials);