import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/database";

export const supabase = hasSupabaseConfig
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;
