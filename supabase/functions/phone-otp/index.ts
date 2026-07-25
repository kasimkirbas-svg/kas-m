import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendSms } from '../_shared/sms.ts';

const corsHeaders = { 'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') || 'http://localhost:4173', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const hashCode = async (challengeId: string, code: string) => {
  const secret = Deno.env.get('OTP_HASH_SECRET');
  if (!secret || secret.length < 32) throw new Error('OTP güvenlik anahtarı en az 32 karakter olmalıdır.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${challengeId}:${code}`));
  return Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const serviceClient = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
  try {
    const body = await request.json();
    if (body.action === 'request') {
      const authorization = request.headers.get('Authorization');
      if (!authorization) throw new Error('Oturum bulunamadı.');
      const authClient = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '', { global: { headers: { Authorization: authorization } } });
      const { data: authData, error: authError } = await authClient.auth.getUser();
      if (authError || !authData.user) throw new Error('Geçersiz oturum.');
      const { data: profile, error: profileError } = await serviceClient.from('profiles').select('phone').eq('id', authData.user.id).single();
      if (profileError || !profile?.phone) throw new Error('Hesabınızda cep telefonu bulunamadı.');
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await serviceClient.from('sms_challenges').select('id', { count: 'exact', head: true }).eq('user_id', authData.user.id).gte('created_at', since);
      if ((count || 0) >= 3) throw new Error('Saatlik SMS doğrulama sınırına ulaştınız.');
      const challengeId = crypto.randomUUID();
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
      const codeHash = await hashCode(challengeId, code);
      const purpose = body.purpose === 'login' ? 'login' : body.purpose === 'phone_change' ? 'phone_change' : 'registration';
      const { error: insertError } = await serviceClient.from('sms_challenges').insert({ id: challengeId, user_id: authData.user.id, phone: profile.phone, purpose, code_hash: codeHash, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() });
      if (insertError) throw insertError;
      try {
        await sendSms({ serviceClient, userId: authData.user.id, phone: profile.phone, eventType: 'otp', message: `ISG Zeyron dogrulama kodunuz: ${code}. Kod 5 dakika gecerlidir.` });
      } catch (error) {
        await serviceClient.from('sms_challenges').delete().eq('id', challengeId);
        throw error;
      }
      return json({ challengeId, expiresIn: 300 });
    }
    if (body.action === 'verify') {
      if (!body.challengeId || !/^\d{6}$/.test(String(body.code || ''))) throw new Error('6 haneli doğrulama kodunu girin.');
      const { data: challenge, error } = await serviceClient.from('sms_challenges').select('*').eq('id', body.challengeId).single();
      if (error || !challenge) throw new Error('Doğrulama isteği bulunamadı.');
      if (challenge.verified_at) throw new Error('Bu doğrulama kodu daha önce kullanıldı.');
      if (new Date(challenge.expires_at).getTime() < Date.now()) throw new Error('Doğrulama kodunun süresi doldu.');
      if (challenge.attempts >= challenge.max_attempts) throw new Error('Doğrulama deneme sınırı aşıldı.');
      const candidate = await hashCode(challenge.id, String(body.code));
      if (candidate !== challenge.code_hash) {
        await serviceClient.from('sms_challenges').update({ attempts: challenge.attempts + 1 }).eq('id', challenge.id);
        throw new Error('Doğrulama kodu hatalı.');
      }
      const now = new Date().toISOString();
      await serviceClient.from('sms_challenges').update({ verified_at: now }).eq('id', challenge.id);
      await serviceClient.from('profiles').update({ phone_verified_at: now }).eq('id', challenge.user_id);
      const { data: authUser, error: authUserError } = await serviceClient.auth.admin.getUserById(challenge.user_id);
      if (authUserError || !authUser.user?.email) throw new Error('Doğrulanan hesap bulunamadı.');
      const { data: link, error: linkError } = await serviceClient.auth.admin.generateLink({ type: 'magiclink', email: authUser.user.email });
      if (linkError || !link.properties?.hashed_token) throw new Error('Güvenli oturum bağlantısı oluşturulamadı.');
      return json({ verified: true, purpose: challenge.purpose, tokenHash: link.properties.hashed_token });
    }
    throw new Error('Geçersiz OTP işlemi.');
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }, 400);
  }
});
