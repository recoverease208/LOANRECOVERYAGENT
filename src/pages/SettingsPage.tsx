import { useState } from "react";
import { KeyRound, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const settingsGroups = [
  { icon: ShieldCheck, title: "AI settings", body: "OpenAI primary model, Gemini fallback, safety tone, and audit capture." },
  { icon: KeyRound, title: "Payment settings", body: "Razorpay mode, webhook secret, receipt templates, and refund readiness." },
  { icon: MessageCircle, title: "Notification settings", body: "Twilio, WhatsApp Business, Resend, retry policy, and quiet hours." },
  { icon: Lock, title: "Security settings", body: "RLS permissions, session timeout, OTP actions, signed URL expiry, and device tracking." }
];

export function SettingsPage() {
  const [statusMessage, setStatusMessage] = useState("");

  function handleReviewConfiguration() {
    setStatusMessage("Configuration review is ready to connect to the Supabase settings table.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {settingsGroups.map(({ icon: Icon, title, body }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center gap-3">
            <Icon className="h-5 w-5 text-mint" />
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm leading-6 text-secondary">{body}</p>
            <Input value="Configured via environment and Supabase settings table" readOnly />
            <Button variant="secondary" onClick={handleReviewConfiguration}>Review configuration</Button>
          </CardContent>
        </Card>
      ))}
      {statusMessage && (
        <div className="xl:col-span-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
