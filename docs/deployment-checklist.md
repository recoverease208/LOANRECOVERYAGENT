# Settlie AI Deployment Checklist

Use this checklist to finish the project without exposing secrets in chat or in git.

## 1) Where Each Env File Lives

- Frontend env file: [`.env.local`](../.env.local)
- Supabase local secrets file: [`supabase/.env`](../supabase/.env)
- n8n local secrets file: [`n8n/.env`](../n8n/.env)
- Production frontend template: [`.env.production.example`](../.env.production.example)
- Supabase CLI template: [`supabase/.env.example`](../supabase/.env.example)
- n8n template: [`n8n/.env.example`](../n8n/.env.example)

## 2) Frontend Setup

- Copy [`.env.example`](../.env.example) to [`.env.local`](../.env.local).
- Fill only `VITE_*` variables in `.env.local`.
- Do not put service-role keys, Twilio secrets, Razorpay secrets, or OpenAI secrets in the frontend file.
- Deploy the frontend to Vercel.
- Set the same `VITE_*` values in Vercel project environment variables.

Frontend variables you will usually set:

- `VITE_APP_NAME`
- `VITE_APP_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_N8N_WEBHOOK_BASE_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_ENABLE_DEMO_DATA`

## 3) Supabase Setup

- Create a new Supabase project.
- Apply these SQL files in order:
  - [`supabase/migrations/20260528170000_initial_schema.sql`](../supabase/migrations/20260528170000_initial_schema.sql)
  - [`supabase/migrations/20260528171000_storage_buckets.sql`](../supabase/migrations/20260528171000_storage_buckets.sql)
  - [`supabase/migrations/20260528171500_borrower_portal_access.sql`](../supabase/migrations/20260528171500_borrower_portal_access.sql)
- Run the seed file:
  - [`supabase/seed/seed.sql`](../supabase/seed/seed.sql)
- Set Supabase Auth URLs:
  - `http://127.0.0.1:5173`
  - your Vercel production URL
  - `/reset-password`
  - `/borrower-login`
- Enable email/password auth for staff.
- Enable phone OTP auth for borrowers.
- Create the private storage buckets:
  - `company-assets`
  - `kyc-documents`
  - `payment-proofs`
- Deploy the Edge Functions:
  - `ai-assistant`
  - `borrower-otp`
  - `create-razorpay-order`
  - `razorpay-webhook`
  - `signed-file-url`
- Set Supabase secrets from [`supabase/.env`](../supabase/.env) or the Supabase dashboard.

Supabase secrets you will usually set:

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
- `GEMINI_MODEL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `WHATSAPP_ACCESS_TOKEN`
- `RESEND_API_KEY`
- `CLOUDINARY_URL`
- `BORROWER_PORTAL_URL`
- `SENTRY_DSN`

## 4) Twilio Setup

- Create a Twilio account.
- Buy or configure the phone number you will use for SMS and voice.
- Decide whether you are using:
  - SMS only
  - voice calls
  - WhatsApp Business
- Put the Twilio values into [`supabase/.env`](../supabase/.env) for Supabase Edge Functions and also into [`n8n/.env`](../n8n/.env) if n8n will send messages directly.
- If you send SMS/voice from n8n, connect Twilio credentials to n8n credentials or env variables.
- If you send them from Supabase Edge Functions, keep the Twilio secrets only in Supabase secrets.

Twilio variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `WHATSAPP_ACCESS_TOKEN`

## 5) Razorpay Setup

- Create a Razorpay account.
- Generate sandbox/test keys first.
- Add the Razorpay key ID to the frontend env as `VITE_RAZORPAY_KEY_ID`.
- Add the Razorpay secret and webhook secret only to backend secrets:
  - [`supabase/.env`](../supabase/.env)
  - [`n8n/.env`](../n8n/.env) if n8n workflows call Razorpay
- Configure the webhook to point to the Supabase Edge Function:
  - `razorpay-webhook`
- Verify the webhook signature in the Edge Function.
- Use sandbox mode in dev/staging and live mode in production.

Razorpay variables:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

## 6) n8n Setup

- Choose n8n Cloud or self-hosted Docker.
- If self-hosted, start it from the `n8n` folder.
- Copy [`n8n/.env.example`](../n8n/.env.example) to [`n8n/.env`](../n8n/.env).
- Add the webhook base URL, Supabase Functions URL, and secrets n8n needs.
- Import the workflows from `n8n/workflows`.
- Configure n8n credentials for:
  - Supabase
  - Twilio
  - Razorpay
  - OpenAI
  - Gemini
  - Resend
- Turn on retries and failure logging in workflows.

## 7) AI Setup

- Add `OPENAI_API_KEY` to Supabase secrets.
- Add `GEMINI_API_KEY` as the fallback key if you want Gemini backup.
- Set `GEMINI_MODEL=gemini-2.5-flash-lite` if you want the cheapest current stable Gemini model that still does the job.
- Keep model choice in `OPENAI_MODEL` only if you are using OpenAI.
- Make sure only Edge Functions and n8n call the AI APIs, not the browser.

## 8) Email, Files, Monitoring

- Add `RESEND_API_KEY` for email delivery.
- Add `CLOUDINARY_URL` only if you use Cloudinary for media handling.
- Add `SENTRY_DSN` for frontend and backend observability.
- Keep borrower documents private in Supabase Storage.
- Use the `signed-file-url` Edge Function for secure file access.

## 9) Validation Before Launch

- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run test`
- Run `npm run build`
- Confirm there are no secrets in git tracked files.
- Confirm `.env.local`, `supabase/.env`, and `n8n/.env` are ignored by git.
- Confirm the frontend works with demo mode off and Supabase connected.
