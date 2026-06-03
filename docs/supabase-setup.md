# Supabase Setup for Settlie AI

This project is designed to run as a Supabase-backed SaaS workspace with one company at launch.

## What Goes Into Supabase

Use the following files from this repo:

- `supabase/migrations/20260528170000_initial_schema.sql`
- `supabase/migrations/20260528171000_storage_buckets.sql`
- `supabase/migrations/20260528171500_borrower_portal_access.sql`
- `supabase/seed/seed.sql`
- `supabase/functions/_shared/auth.ts`
- `supabase/functions/_shared/cors.ts`
- `supabase/functions/ai-assistant/index.ts`
- `supabase/functions/borrower-otp/index.ts`
- `supabase/functions/create-razorpay-order/index.ts`
- `supabase/functions/razorpay-webhook/index.ts`
- `supabase/functions/signed-file-url/index.ts`

These are the pieces that belong in Supabase:

- SQL migrations and RLS policies
- Storage bucket provisioning
- Edge Functions
- Secret environment variables

## Required Supabase Steps

1. Create a new Supabase project.
2. Enable email/password auth for staff users.
3. Enable phone OTP auth for borrowers if you want mobile login.
4. Set the auth `Site URL` to your frontend URL.
5. Add redirect URLs for:
   - `http://127.0.0.1:5173`
   - your Vercel production URL
   - `/reset-password`
   - `/borrower-login`
6. Apply the migrations in order.
7. Seed the demo company and default settings.
8. Add the Edge Function secrets.
9. Deploy the Edge Functions.
10. Create a storage path convention where every file begins with the company id:
    - `c-1/kyc/...`
    - `c-1/payment-proofs/...`
    - `c-1/company-assets/...`
11. For each borrower portal account, create a `public.users` row with `role = 'borrower'` and link the matching `public.borrowers.user_id` to that auth user id.

## Edge Function Secrets

Set these in the Supabase dashboard or with the CLI:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `SUPABASE_DB_PASSWORD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GEMINI_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `WHATSAPP_ACCESS_TOKEN`
- `RESEND_API_KEY`
- `CLOUDINARY_URL`
- `BORROWER_PORTAL_URL`
- `SENTRY_DSN`

## Recommended Buckets

The migration provisions these private buckets:

- `company-assets`
- `kyc-documents`
- `payment-proofs`

## Recommended CLI Flow

```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
supabase secrets set --env-file supabase/.env
supabase functions deploy ai-assistant
supabase functions deploy borrower-otp
supabase functions deploy create-razorpay-order
supabase functions deploy razorpay-webhook
supabase functions deploy signed-file-url
```

## Notes

- Keep the service-role key out of the frontend.
- Store borrower and payment files with the company id as the first path segment.
- Use the `signed-file-url` Edge Function for any browser download that must stay private.
- Use `razorpay-webhook` as the payment confirmation endpoint in Razorpay.
