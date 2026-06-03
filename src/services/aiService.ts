import axios from "axios";
import { supabase } from "@/integrations/supabase";

export interface RecoveryPrompt {
  borrowerId: string;
  tone: "empathetic" | "firm" | "settlement";
  channel: "sms" | "whatsapp" | "email" | "voice";
  context: string;
}

export async function generateRecoveryMessage(payload: RecoveryPrompt) {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke("ai-assistant", { body: payload });
    if (error) throw error;
    return data as { message: string; risk: string; nextBestAction: string };
  }

  await axios.get("/").catch(() => undefined);
  return {
    message:
      "Hi, this is a respectful reminder about your pending EMI. You can use the secure payment link or reply to discuss a partial payment plan today.",
    risk: payload.tone === "firm" ? "high" : "medium",
    nextBestAction: "Send WhatsApp payment link and schedule a same-day voice follow-up."
  };
}
