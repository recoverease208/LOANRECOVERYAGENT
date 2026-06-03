# Settlie AI Architecture

Settlie AI is a React SPA backed by Supabase and event-driven automation. The first release supports a single-company workspace while every table is company scoped for future SaaS tenancy.

## Runtime Flow

React frontend uses Supabase Auth, PostgreSQL, Realtime, Storage, and Edge Functions. Edge Functions protect secrets and perform sensitive operations such as Razorpay webhook verification, payment order creation, AI requests, OTP-sensitive operations, and signed file URLs. n8n runs scheduled and webhook-driven recovery workflows.

## Security Model

- Supabase Auth handles email/password staff access and OTP borrower access.
- RLS scopes company records through `current_company_id()`.
- Service-role key is only used inside Edge Functions and n8n secure credentials.
- Razorpay webhooks are validated with HMAC SHA-256 before payment updates.
- Sensitive file access uses Supabase Storage signed URLs with audit logs.
- Private buckets are provisioned for company assets, KYC documents, and payment proofs.
- Borrower portal access is scoped through linked `users` and `borrowers` rows.
- Role permissions are explicit: `super_admin`, `recovery_manager`, `recovery_agent`, `borrower`.
- Audit logs capture AI generation, signed URL generation, and payment actions.

## Services

- Payments: Razorpay SDK/API, sandbox in staging, webhook idempotency by payment event key.
- AI: OpenAI primary path, Gemini fallback, with compliant borrower-safe message instructions.
- Communication: Twilio SMS/Voice, WhatsApp Business API, and Resend email through n8n.
- Files: Supabase Storage for secure documents, Cloudinary-ready environment for media processing.
- Monitoring: Sentry frontend instrumentation and structured Edge Function responses.

## Deployment

- Frontend: Vercel.
- Backend: Supabase Cloud migrations and Edge Functions.
- Automation: n8n Cloud or `n8n/docker-compose.yml`.
- CI/CD: GitHub Actions validates typecheck, lint, test, build, and environment templates.
