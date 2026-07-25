alter table public.support_tickets
  add column if not exists response_email_status text not null default 'not_sent',
  add column if not exists response_email_sent_at timestamptz,
  add column if not exists response_email_error text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'support_tickets_response_email_status_check'
  ) then
    alter table public.support_tickets
      add constraint support_tickets_response_email_status_check
      check (response_email_status in ('not_sent', 'pending', 'sent', 'failed'));
  end if;
end $$;
