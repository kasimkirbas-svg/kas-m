alter table public.profiles
  add column if not exists phone_verified_at timestamptz,
  add column if not exists sms_2fa_enabled boolean not null default false;

create table if not exists public.sms_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone text not null,
  purpose text not null check (purpose in ('registration', 'login', 'phone_change')),
  code_hash text not null,
  attempts smallint not null default 0,
  max_attempts smallint not null default 5,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sms_deliveries (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  phone text not null,
  event_type text not null check (event_type in ('otp', 'support_reply', 'payment')),
  provider text not null,
  provider_reference text,
  status text not null check (status in ('pending', 'sent', 'failed')),
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists sms_challenges_user_created_idx on public.sms_challenges (user_id, created_at desc);
create index if not exists sms_deliveries_user_created_idx on public.sms_deliveries (user_id, created_at desc);

alter table public.sms_challenges enable row level security;
alter table public.sms_deliveries enable row level security;