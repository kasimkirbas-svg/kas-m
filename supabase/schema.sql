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
  email text,
  role text not null default 'SUBSCRIBER' check (role in ('SUBSCRIBER', 'SUPPORT_ADMIN', 'CONTENT_ADMIN', 'OWNER')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists role text not null default 'SUBSCRIBER';
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'OWNER' where role = 'ADMIN';
alter table public.profiles add constraint profiles_role_check check (role in ('SUBSCRIBER', 'SUPPORT_ADMIN', 'CONTENT_ADMIN', 'OWNER'));

create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null default '',
  file_path text not null unique,
  fields jsonb not null default '[]'::jsonb,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
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

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  priority text not null default 'normal' check (priority in ('normal', 'high', 'urgent')),
  assigned_to uuid references auth.users(id) on delete set null,
  admin_response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists document_drafts_user_updated_idx on public.document_drafts (user_id, updated_at desc);
create index if not exists document_history_user_created_idx on public.document_history (user_id, created_at desc);
create index if not exists templates_active_category_idx on public.document_templates (is_active, category);
create index if not exists audit_logs_created_idx on public.admin_audit_logs (created_at desc);
create index if not exists support_tickets_status_created_idx on public.support_tickets (status, created_at desc);

create or replace function public.has_admin_role(allowed_roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = any(allowed_roles) and status = 'active');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_admin_role(array['SUPPORT_ADMIN', 'CONTENT_ADMIN', 'OWNER']);
$$;

alter table public.profiles enable row level security;
alter table public.document_drafts enable row level security;
alter table public.document_history enable row level security;
alter table public.subscriptions enable row level security;
alter table public.document_templates enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.support_tickets enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "drafts_manage_own" on public.document_drafts;
drop policy if exists "history_manage_own" on public.document_history;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
drop policy if exists "profiles_admin_select" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
drop policy if exists "subscriptions_admin_manage" on public.subscriptions;
drop policy if exists "templates_public_read" on public.document_templates;
drop policy if exists "templates_admin_manage" on public.document_templates;
drop policy if exists "audit_admin_read" on public.admin_audit_logs;
drop policy if exists "audit_admin_insert" on public.admin_audit_logs;
drop policy if exists "template_files_public_read" on storage.objects;
drop policy if exists "template_files_admin_insert" on storage.objects;
drop policy if exists "template_files_admin_update" on storage.objects;
drop policy if exists "template_files_admin_delete" on storage.objects;
drop policy if exists "support_create_own" on public.support_tickets;
drop policy if exists "support_read_own" on public.support_tickets;
drop policy if exists "support_staff_read" on public.support_tickets;
drop policy if exists "support_staff_update" on public.support_tickets;
drop policy if exists "drafts_owner_read" on public.document_drafts;
drop policy if exists "history_owner_read" on public.document_history;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "drafts_manage_own" on public.document_drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "history_manage_own" on public.document_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "drafts_owner_read" on public.document_drafts for select using (public.has_admin_role(array['OWNER']));
create policy "history_owner_read" on public.document_history for select using (public.has_admin_role(array['OWNER']));
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "profiles_admin_select" on public.profiles for select using (public.has_admin_role(array['OWNER']));
create policy "profiles_admin_update" on public.profiles for update using (public.has_admin_role(array['OWNER'])) with check (public.has_admin_role(array['OWNER']));
create policy "subscriptions_admin_manage" on public.subscriptions for all using (public.has_admin_role(array['OWNER'])) with check (public.has_admin_role(array['OWNER']));
create policy "templates_public_read" on public.document_templates for select using (is_active or public.is_admin());
create policy "templates_admin_manage" on public.document_templates for all using (public.has_admin_role(array['CONTENT_ADMIN', 'OWNER'])) with check (public.has_admin_role(array['CONTENT_ADMIN', 'OWNER']));
create policy "audit_admin_read" on public.admin_audit_logs for select using (public.has_admin_role(array['OWNER']));
create policy "audit_admin_insert" on public.admin_audit_logs for insert with check (public.is_admin() and admin_id = auth.uid());
create policy "support_create_own" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "support_read_own" on public.support_tickets for select using (auth.uid() = user_id);
create policy "support_staff_read" on public.support_tickets for select using (public.has_admin_role(array['SUPPORT_ADMIN', 'OWNER']));
create policy "support_staff_update" on public.support_tickets for update using (public.has_admin_role(array['SUPPORT_ADMIN', 'OWNER'])) with check (public.has_admin_role(array['SUPPORT_ADMIN', 'OWNER']));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('document-templates', 'document-templates', true, 26214400, array['application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "template_files_public_read" on storage.objects for select using (bucket_id = 'document-templates');
create policy "template_files_admin_insert" on storage.objects for insert with check (bucket_id = 'document-templates' and public.has_admin_role(array['CONTENT_ADMIN', 'OWNER']));
create policy "template_files_admin_update" on storage.objects for update using (bucket_id = 'document-templates' and public.has_admin_role(array['CONTENT_ADMIN', 'OWNER']));
create policy "template_files_admin_delete" on storage.objects for delete using (bucket_id = 'document-templates' and public.has_admin_role(array['CONTENT_ADMIN', 'OWNER']));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone, account_type, profession, company_name, tax_number, tax_office, address, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'accountType', 'individual'),
    new.raw_user_meta_data->>'profession',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'taxNumber',
    new.raw_user_meta_data->>'taxOffice',
    new.raw_user_meta_data->>'address',
    new.email
  );
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
