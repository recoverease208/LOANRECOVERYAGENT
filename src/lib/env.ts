const get = (key: string, fallback = "") => String(import.meta.env[key] ?? fallback);

export const env = {
  appName: get("VITE_APP_NAME", "Settlie AI"),
  appUrl: get("VITE_APP_URL", "http://127.0.0.1:5173"),
  supabaseUrl: get("VITE_SUPABASE_URL"),
  supabaseAnonKey: get("VITE_SUPABASE_ANON_KEY"),
  sentryDsn: get("VITE_SENTRY_DSN"),
  razorpayKeyId: get("VITE_RAZORPAY_KEY_ID"),
  n8nWebhookBaseUrl: get("VITE_N8N_WEBHOOK_BASE_URL"),
  cloudinaryCloudName: get("VITE_CLOUDINARY_CLOUD_NAME"),
  enableDemoData: get("VITE_ENABLE_DEMO_DATA", "true") === "true",
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
};

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
