import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export type SmsEventType = 'otp' | 'support_reply' | 'payment';

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^00/, '');
  const national = digits.startsWith('90') ? digits.slice(2) : digits.replace(/^0/, '');
  if (!/^5\d{9}$/.test(national)) throw new Error('Geçerli bir Türkiye cep telefonu numarası bulunamadı.');
  return `90${national}`;
};

export const sendSms = async (input: { serviceClient: ReturnType<typeof createClient>; userId?: string; phone: string; message: string; eventType: SmsEventType }) => {
  const phone = normalizePhone(input.phone);
  const provider = (Deno.env.get('SMS_PROVIDER') || '').toLowerCase();
  const { data: delivery, error: deliveryError } = await input.serviceClient.from('sms_deliveries').insert({
    user_id: input.userId || null,
    phone,
    event_type: input.eventType,
    provider: provider || 'unconfigured',
    status: 'pending',
  }).select('id').single();
  if (deliveryError) throw deliveryError;

  try {
    let providerReference = '';
    if (provider === 'netgsm') {
      const username = Deno.env.get('NETGSM_USERCODE');
      const password = Deno.env.get('NETGSM_PASSWORD');
      const header = Deno.env.get('NETGSM_HEADER');
      if (!username || !password || !header) throw new Error('Netgsm bilgileri eksik.');
      const response = await fetch('https://api.netgsm.com.tr/sms/send/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usercode: username, password, msgheader: header, messages: [{ msg: input.message, no: phone }] }),
      });
      const responseText = await response.text();
      if (!response.ok || !/^00\s/.test(responseText)) throw new Error(`Netgsm gönderimi başarısız: ${responseText.slice(0, 120)}`);
      providerReference = responseText.trim().split(/\s+/)[1] || '';
    } else if (provider === 'webhook') {
      const url = Deno.env.get('SMS_WEBHOOK_URL');
      const token = Deno.env.get('SMS_WEBHOOK_TOKEN');
      if (!url || !token) throw new Error('SMS webhook bilgileri eksik.');
      const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ to: `+${phone}`, message: input.message, eventType: input.eventType }) });
      if (!response.ok) throw new Error(`SMS webhook ${response.status} koduyla yanıt verdi.`);
      providerReference = String((await response.json().catch(() => ({}))).id || '');
    } else {
      throw new Error('SMS sağlayıcısı henüz yapılandırılmadı.');
    }
    await input.serviceClient.from('sms_deliveries').update({ status: 'sent', provider_reference: providerReference, sent_at: new Date().toISOString() }).eq('id', delivery.id);
    return { deliveryId: delivery.id, providerReference };
  } catch (error) {
    await input.serviceClient.from('sms_deliveries').update({ status: 'failed', error: 'SMS sağlayıcısı isteği başarısız oldu.' }).eq('id', delivery.id);
    throw error;
  }
};
