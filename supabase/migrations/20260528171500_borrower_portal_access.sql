alter table public.borrowers
add column if not exists user_id uuid unique references public.users(id) on delete set null;

create index if not exists borrowers_user_id_idx on public.borrowers(user_id);

create or replace function public.is_staff_role()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() in ('super_admin', 'recovery_manager', 'recovery_agent')
$$;

create or replace function public.current_borrower_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.borrowers where user_id = auth.uid() limit 1
$$;

drop policy if exists "Users read own company" on public.users;
drop policy if exists "Admins manage company users" on public.users;
drop policy if exists "Company read" on public.companies;
drop policy if exists "Company scoped borrower access" on public.borrowers;
drop policy if exists "Company scoped loan access" on public.loans;
drop policy if exists "Company scoped payment access" on public.payments;
drop policy if exists "Company scoped reminder access" on public.reminders;
drop policy if exists "Company scoped communication access" on public.communications;
drop policy if exists "Company scoped escalation access" on public.escalations;
drop policy if exists "Company scoped settlement access" on public.settlements;
drop policy if exists "Audit read for admins" on public.audit_logs;
drop policy if exists "Settings admin read" on public.settings;
drop policy if exists "Settings admin manage" on public.settings;
drop policy if exists "Workflow admin read" on public.workflow_runs;

drop policy if exists "Users read own profile" on public.users;
drop policy if exists "Users update own profile" on public.users;
drop policy if exists "Users manage company users" on public.users;
drop policy if exists "Borrowers read own borrower row" on public.borrowers;
drop policy if exists "Borrowers manage company borrowers" on public.borrowers;
drop policy if exists "Borrowers read own loans" on public.loans;
drop policy if exists "Borrowers read own payments" on public.payments;
drop policy if exists "Borrowers read own reminders" on public.reminders;
drop policy if exists "Borrowers read own communications" on public.communications;
drop policy if exists "Borrowers read own escalations" on public.escalations;
drop policy if exists "Borrowers read own settlements" on public.settlements;

create policy "Staff read company users"
on public.users
for select
using (public.is_staff_role() and company_id = public.current_company_id());

create policy "Users read own profile"
on public.users
for select
using (id = auth.uid());

create policy "Users update own profile"
on public.users
for update
using (id = auth.uid())
with check (
  id = auth.uid()
  and company_id = public.current_company_id()
  and role = public.current_user_role()
);

create policy "Super admins manage company users"
on public.users
for all
using (public.current_user_role() in ('super_admin', 'recovery_manager') and company_id = public.current_company_id())
with check (public.current_user_role() in ('super_admin', 'recovery_manager') and company_id = public.current_company_id());

create policy "Staff read company record"
on public.companies
for select
using (public.is_staff_role() and id = public.current_company_id());

create policy "Super admins manage company record"
on public.companies
for all
using (public.current_user_role() = 'super_admin' and id = public.current_company_id())
with check (public.current_user_role() = 'super_admin' and id = public.current_company_id());

create policy "Staff read company borrowers"
on public.borrowers
for select
using (public.is_staff_role() and company_id = public.current_company_id());

create policy "Borrowers read own borrower row"
on public.borrowers
for select
using (id = public.current_borrower_id() or user_id = auth.uid());

create policy "Staff manage company borrowers"
on public.borrowers
for all
using (public.is_staff_role() and company_id = public.current_company_id())
with check (public.is_staff_role() and company_id = public.current_company_id());

create policy "Staff read company loans"
on public.loans
for select
using (
  public.is_staff_role()
  and exists (
    select 1
    from public.borrowers b
    where b.id = borrower_id
      and b.company_id = public.current_company_id()
  )
);

create policy "Borrowers read own loans"
on public.loans
for select
using (
  exists (
    select 1
    from public.borrowers b
    where b.id = borrower_id
      and (b.id = public.current_borrower_id() or b.user_id = auth.uid())
  )
);

create policy "Staff manage company loans"
on public.loans
for all
using (
  public.is_staff_role()
  and exists (
    select 1
    from public.borrowers b
    where b.id = borrower_id
      and b.company_id = public.current_company_id()
  )
)
with check (
  public.is_staff_role()
  and exists (
    select 1
    from public.borrowers b
    where b.id = borrower_id
      and b.company_id = public.current_company_id()
  )
);

create policy "Staff read company payments"
on public.payments
for select
using (
  public.is_staff_role()
  and exists (
    select 1
    from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id
      and b.company_id = public.current_company_id()
  )
);

create policy "Borrowers read own payments"
on public.payments
for select
using (
  exists (
    select 1
    from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id
      and (b.id = public.current_borrower_id() or b.user_id = auth.uid())
  )
);

create policy "Staff manage company payments"
on public.payments
for all
using (
  public.is_staff_role()
  and exists (
    select 1
    from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id
      and b.company_id = public.current_company_id()
  )
)
with check (
  public.is_staff_role()
  and exists (
    select 1
    from public.loans l
    join public.borrowers b on b.id = l.borrower_id
    where l.id = loan_id
      and b.company_id = public.current_company_id()
  )
);

create policy "Staff read company reminders"
on public.reminders
for select
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Borrowers read own reminders"
on public.reminders
for select
using (exists (select 1 from public.borrowers b where b.id = borrower_id and (b.id = public.current_borrower_id() or b.user_id = auth.uid())));

create policy "Staff manage company reminders"
on public.reminders
for all
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Staff read company communications"
on public.communications
for select
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Borrowers read own communications"
on public.communications
for select
using (exists (select 1 from public.borrowers b where b.id = borrower_id and (b.id = public.current_borrower_id() or b.user_id = auth.uid())));

create policy "Staff manage company communications"
on public.communications
for all
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Staff read company escalations"
on public.escalations
for select
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Borrowers read own escalations"
on public.escalations
for select
using (exists (select 1 from public.borrowers b where b.id = borrower_id and (b.id = public.current_borrower_id() or b.user_id = auth.uid())));

create policy "Staff manage company escalations"
on public.escalations
for all
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Staff read company settlements"
on public.settlements
for select
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Borrowers read own settlements"
on public.settlements
for select
using (exists (select 1 from public.borrowers b where b.id = borrower_id and (b.id = public.current_borrower_id() or b.user_id = auth.uid())));

create policy "Staff manage company settlements"
on public.settlements
for all
using (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()))
with check (public.is_staff_role() and exists (select 1 from public.borrowers b where b.id = borrower_id and b.company_id = public.current_company_id()));

create policy "Own notifications"
on public.notifications
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Staff read audit logs"
on public.audit_logs
for select
using (public.is_staff_role());

create policy "Staff read settings"
on public.settings
for select
using (public.is_staff_role() and company_id = public.current_company_id());

create policy "Super admins manage settings"
on public.settings
for all
using (public.current_user_role() = 'super_admin' and company_id = public.current_company_id())
with check (public.current_user_role() = 'super_admin' and company_id = public.current_company_id());

create policy "Staff read workflow runs"
on public.workflow_runs
for select
using (public.is_staff_role() and company_id = public.current_company_id());

create policy "Staff manage workflow runs"
on public.workflow_runs
for all
using (public.is_staff_role() and company_id = public.current_company_id())
with check (public.is_staff_role() and company_id = public.current_company_id());
