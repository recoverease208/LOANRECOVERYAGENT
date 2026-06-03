insert into storage.buckets (id, name, public)
values
  ('company-assets', 'company-assets', false),
  ('kyc-documents', 'kyc-documents', false),
  ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Company staff can upload private assets" on storage.objects;
drop policy if exists "Company staff can update private assets" on storage.objects;
drop policy if exists "Company staff can delete private assets" on storage.objects;

create policy "Company staff can upload private assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('company-assets', 'kyc-documents', 'payment-proofs')
  and public.current_user_role() in ('super_admin', 'recovery_manager', 'recovery_agent')
  and split_part(name, '/', 1) = public.current_company_id()::text
);

create policy "Company staff can update private assets"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('company-assets', 'kyc-documents', 'payment-proofs')
  and public.current_user_role() in ('super_admin', 'recovery_manager', 'recovery_agent')
  and split_part(name, '/', 1) = public.current_company_id()::text
)
with check (
  bucket_id in ('company-assets', 'kyc-documents', 'payment-proofs')
  and public.current_user_role() in ('super_admin', 'recovery_manager', 'recovery_agent')
  and split_part(name, '/', 1) = public.current_company_id()::text
);

create policy "Company staff can delete private assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('company-assets', 'kyc-documents', 'payment-proofs')
  and public.current_user_role() in ('super_admin', 'recovery_manager', 'recovery_agent')
  and split_part(name, '/', 1) = public.current_company_id()::text
);
