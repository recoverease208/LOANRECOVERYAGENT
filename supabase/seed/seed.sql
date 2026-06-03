insert into public.companies (id, company_name, company_email)
values ('00000000-0000-0000-0000-000000000001', 'Settlie Demo Finance', 'ops@settlie-demo.local')
on conflict do nothing;

insert into public.settings (company_id, ai_settings, payment_settings, notification_settings, security_settings)
values (
  '00000000-0000-0000-0000-000000000001',
  '{"primary":"openai","fallback":"gemini","defaultTone":"empathetic"}',
  '{"provider":"razorpay","mode":"sandbox","webhookValidation":true}',
  '{"sms":"twilio","email":"resend","whatsapp":"business_api"}',
  '{"sessionTimeoutMinutes":45,"signedUrlTtlSeconds":300,"otpSensitiveActions":true}'
)
on conflict (company_id) do nothing;
