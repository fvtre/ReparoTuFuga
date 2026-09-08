create type public.lead_status as enum ('new', 'contacted', 'scheduled', 'quoted', 'won', 'lost');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  service_type text not null,
  urgency text not null,
  description text not null,
  status public.lead_status not null default 'new',
  source text,
  medium text,
  campaign text,
  term text,
  content text,
  gclid text,
  landing_page text,
  referrer text,
  quoted_amount numeric(14,2) check (quoted_amount is null or quoted_amount >= 0),
  final_amount numeric(14,2) check (final_amount is null or final_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  activity_type text not null check (activity_type in ('created', 'status_changed', 'note_added', 'amount_updated')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads(created_at desc);
create index leads_status_idx on public.leads(status);
create index leads_gclid_idx on public.leads(gclid) where gclid is not null;
create index lead_activity_lead_id_idx on public.lead_activity(lead_id, created_at desc);

create function public.rtf_set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.rtf_set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_activity enable row level security;
revoke all on table public.leads, public.lead_activity from anon, authenticated;
grant select, update on table public.leads to authenticated;
grant select, insert on table public.lead_activity to authenticated;

create policy "Admins read leads" on public.leads for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('admin', 'owner'));
create policy "Admins update leads" on public.leads for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('admin', 'owner'))
with check ((select auth.jwt()->'app_metadata'->>'role') in ('admin', 'owner'));
create policy "Admins read activity" on public.lead_activity for select to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') in ('admin', 'owner'));
create policy "Admins add activity" on public.lead_activity for insert to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') in ('admin', 'owner') and actor_id = (select auth.uid()));

-- Public submissions are inserted exclusively by the server with SUPABASE_SECRET_KEY.
-- No anon INSERT grant or policy exists, so personal data cannot be read or written directly.
