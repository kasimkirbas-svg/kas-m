create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  account_type text not null default 'individual' check (account_type in ('individual', 'osgb')),
  profession text,
  company_name text,
  tax_number text,
  tax_office text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  form_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, template_id)
);

create table if not exists public.document_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  title text not null,
  category text not null,
  file_name text not null,
  form_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'FREE' check (plan in ('FREE', 'MONTHLY', 'YEARLY')),
  status text not null default 'inactive',
  provider_reference text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.document_drafts enable row level security;
alter table public.document_history enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "drafts_manage_own" on public.document_drafts;
drop policy if exists "history_manage_own" on public.document_history;
drop policy if exists "subscriptions_select_own" on public.subscriptions;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "drafts_manage_own" on public.document_drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "history_manage_own" on public.document_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone, account_type, profession, company_name, tax_number, tax_office, address)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'accountType', 'individual'),
    new.raw_user_meta_data->>'profession',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'taxNumber',
    new.raw_user_meta_data->>'taxOffice',
    new.raw_user_meta_data->>'address'
  );
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
