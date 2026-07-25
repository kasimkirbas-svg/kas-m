import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendSms } from '../_shared/sms.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  );
  let ticketId: string | undefined;

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) throw new Error('Oturum bulunamadı.');

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) throw new Error('Geçersiz oturum.');

    const { data: admin } = await serviceClient.from('profiles').select('role,status').eq('id', authData.user.id).single();
    if (!admin || admin.status !== 'active' || !['SUPPORT_ADMIN', 'OWNER'].includes(admin.role)) throw new Error('Bu işlem için yetkiniz bulunmuyor.');

    ({ ticketId } = await request.json());
    if (!ticketId) throw new Error('Talep kimliği eksik.');

    const { data: ticket, error: ticketError } = await serviceClient
      .from('support_tickets')
      .select('id,user_id,subject,admin_response')
      .eq('id', ticketId)
      .single();
    if (ticketError || !ticket?.admin_response?.trim()) throw new Error('Gönderilecek destek yanıtı bulunamadı.');

    const { data: profile, error: profileError } = await serviceClient.from('profiles').select('email,name,phone').eq('id', ticket.user_id).single();
    if (profileError || !profile) throw new Error('Kullanıcı iletişim bilgileri bulunamadı.');

    const channelErrors: string[] = [];
    let delivered = false;
    if (Deno.env.get('SMS_NOTIFICATIONS_ENABLED') === 'true' && profile.phone) {
      try {
        await sendSms({ serviceClient, userId: ticket.user_id, phone: profile.phone, eventType: 'support_reply', message: 'ISG Zeyron destek talebiniz yanitlandi. Yaniti hesabinizdaki Canli Destek panelinden inceleyebilirsiniz.' });
        delivered = true;
      } catch (error) { channelErrors.push(error instanceof Error ? error.message : 'SMS gönderilemedi.'); }
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('SUPPORT_FROM_EMAIL');
    if (apiKey && from && profile.email) {
      try {
        const mailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to: [profile.email], subject: `Destek talebiniz yanıtlandı: ${ticket.subject}`, text: `Merhaba ${profile.name || ''},\n\n${ticket.admin_response}\n\nİSG Zeyron Destek` }),
        });
        if (!mailResponse.ok) throw new Error(`E-posta servisi ${mailResponse.status} koduyla yanıt verdi.`);
        delivered = true;
      } catch (error) { channelErrors.push(error instanceof Error ? error.message : 'E-posta gönderilemedi.'); }
    }
    if (!delivered) throw new Error(channelErrors.join(' | ') || 'Hiçbir bildirim kanalı yapılandırılmadı.');

    await serviceClient.from('support_tickets').update({ response_email_status: 'sent', response_email_sent_at: new Date().toISOString(), response_email_error: null }).eq('id', ticket.id);
    return new Response(JSON.stringify({ sent: true, warnings: channelErrors }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    if (ticketId) await serviceClient.from('support_tickets').update({ response_email_status: 'failed', response_email_error: error instanceof Error ? error.message : 'Bilinmeyen hata' }).eq('id', ticketId);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
