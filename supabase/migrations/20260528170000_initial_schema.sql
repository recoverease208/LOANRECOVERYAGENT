create extension if not exists "pgcrypto";

create type public.user_role as enum ('super_admin', 'recovery_manager', 'recovery_agent', 'borrower');
create type public.risk_level as enum ('low', 'medium', 'high', 'critical');
create type public.loan_status as enum ('active', 'overdue', 'settled', 'closed', 'written_off');
create type public.payment_status as enum ('created', 'pending', 'paid', 'failed', 'refunded');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_email text not null unique,
  company_logo text,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role public.user_role not null,
  profile_image text,
  account_status text not null default 'active' check (account_status in ('active', 'invited', 'suspended')),
  last_login timestamptz,
  created_at timestamptz not null default now()
);

create table public.borrowers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  borrower_name text not null,
  email text,
  phone text not null,
  address text not null,
  occupation text,
  kyc_document_url text,
  risk_level public.risk_level not null default 'medium',
  borrower_status text not null default 'current' check (borrower_status in ('current', 'overdue', 'in_escalation', 'settled')),
  created_at timestamptz not null default now()
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  loan_amount numeric(14,2) not null check (loan_amount > 0),
  emi_amount numeric(14,2) not null check (emi_amount > 0),
  interest_rate numeric(5,2) not null check (interest_rate >= 0),
  due_date date not null,
  next_payment_date date not null,
  overdue_days integer not null default 0 check (overdue_days >= 0),
  loan_status public.loan_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans(id) on delete cascade,
  payment_amount numeric(14,2) not null check (payment_amount > 0),
  payment_method text not null,
  payment_status public.payment_status not null default 'created',
  razorpay_payment_id text unique,
  razorpay_order_id text,
  payment_proof_url text,
  idempotency_key text unique,
  paid_at timestamptz
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  reminder_type text not null,
  delivery_channel text not null check (delivery_channel in ('sms', 'whatsapp', 'email', 'voice')),
  reminder_status text not null default 'scheduled',
  scheduled_time timestamptz not null,
  sent_at timestamptz
);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  communication_channel text not null check (communication_channel in ('sms', 'whatsapp', 'email', 'voice')),
  communication_type text not null,
  ai_generated boolean not null default false,
  message_content text not null,
  communication_status text not null default 'queued',
  provider_message_id text,
  created_at timestamptz not null default now()
);

create table public.escalations (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  escalation_level integer not null check (escalation_level between 1 and 5),
  assigned_agent_id uuid references public.users(id) on delete set null,
  escalation_status text not null default 'open',
  escalation_reason text not null,
  created_at timestamptz not null default now()
);

create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  settlement_amount numeric(14,2) not null check (settlement_amount > 0),
  settlement_status text not null default 'pending',
  approved_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type text not null,
  read_status boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  action_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  ai_settings jsonb not null default '{}'::jsonb,
  payment_settings jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  security_settings jsonb not null default '{}'::jsonb
);

create table public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  workflow_name text not null,
  external_run_id text,
  idempotency_key text not null unique,
  status text not null default 'queued',
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_company_role_idx on public.users(company_id, role);
create index borrowers_company_status_idx on public.borrowers(company_id, borrower_status);
create index borrowers_company_risk_idx on public.borrowers(company_id, risk_level);
create index loans_borrower_status_idx on public.loans(borrower_id, loan_status);
create index loans_next_payment_idx on public.loans(next_payment_date, loan_status);
create index payments_loan_status_idx on public.payments(loan_id, payment_status);
create index reminders_schedule_idx on public.reminders(scheduled_time, reminder_status);
create index communications_borrower_created_idx on public.communications(borrower_id, created_at desc);
create index escalations_agent_status_idx on public.escalations(assigned_agent_id, escalation_status);
create index audit_logs_user_created_idx on public.audit_logs(user_id, created_at desc);

alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.borrowers enable row level security;
alter table public.loans enable row level security;
alter table public.payments enable row level security;
alter table public.reminders enable row level security;
alter table public.communications enable row level security;
alter table public.escalations enable row level security;
alter table public.settlements enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.settings enable row level security;
alter table public.workflow_runs enable row level security;

create or replace function public.current_company_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select company_id from public.users where id = auth.uid()
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create policy "Users read own company" on public.users
for select using (company_id = public.current_company_id());

create policy "Admins manage company users" on public.users
for all using (public.current_user_role() in ('super_admin', 'recovery_manager') and company_id = public.current_company_id())
with check (public.current_user_role() in ('super_admin', 'recovery_manager') and company_id = public.current_company_id());

create policy "Company read" on public.companies
for select using (id = public.current_company_id());

create policy "Company scoped borrower access" on public.borrowers
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped loan access" on public.loans
for all using (
  exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id())
)
with check (
  exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id())
);

create policy "Company scoped payment access" on public.payments
for all using (
  exists (
    select 1 from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id and b.company_id = public.current_company_id()
  )
)
with check (
  exists (
    select 1 from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id and b.company_id = public.current_company_id()
  )
);

create policy "Company scoped reminder access" on public.reminders
for all using (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Company scoped communication access" on public.communications
for all using (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Company scoped escalation access" on public.escalations
for all using (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Company scoped settlement access" on public.settlements
for all using (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Own notifications" on public.notifications
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Audit read for admins" on public.audit_logs
for select using (public.current_user_role() in ('super_admin', 'recovery_manager'));

create policy "Settings admin read" on public.settings
for select using (company_id = public.current_company_id());

create policy "Settings admin manage" on public.settings
for all using (public.current_user_role() = 'super_admin' and company_id = public.current_company_id())
with check (public.current_user_role() = 'super_admin' and company_id = public.current_company_id());

create policy "Workflow admin read" on public.workflow_runs
for select using (company_id = public.current_company_id() and public.current_user_role() in ('super_admin', 'recovery_manager'));
