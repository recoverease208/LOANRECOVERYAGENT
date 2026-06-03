import { supabase } from "@/integrations/supabase";

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    return { id: "demo-user", email };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInBorrowerWithOtp(phone: string) {
  return requestBorrowerOtp(phone);
}

export async function requestBorrowerOtp(phone: string) {
  if (!supabase) return { phone, demo: true };
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
  return data;
}

export async function verifyBorrowerOtp(phone: string, token: string) {
  if (!supabase) {
    if (token !== "123456") {
      throw new Error("Demo OTP is 123456");
    }
    return { phone, demo: true };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms"
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  if (!supabase) return { email, demo: true };
  const redirectTo = `${window.location.origin}/reset-password`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
  return { ...data, demo: false };
}

export async function updatePassword(password: string) {
  if (!supabase) return { demo: true };
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
