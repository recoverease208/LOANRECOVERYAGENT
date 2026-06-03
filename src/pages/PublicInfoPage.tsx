import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const copy = {
  about: ["Built for regulated recovery teams", "Settlie AI combines borrower empathy, automation control, payment security, and auditable operations in one SaaS-ready workspace."],
  features: ["Complete recovery operating system", "Dashboards, borrower records, AI messaging, reminders, Razorpay payments, escalation queues, realtime alerts, and analytics are wired into one workflow."],
  solutions: ["For lenders and recovery agencies", "Banks, NBFCs, microfinance teams, fintech companies, and field agencies can standardize repayment outreach without losing oversight."],
  pricing: ["Enterprise pricing that scales with volume", "Start with one company workspace and expand automation, communication, and AI usage as your portfolio grows."],
  contact: ["Talk to Settlie AI", "Reach the team for deployment planning, compliance review, sandbox setup, and workflow migration."],
  demo: ["Request a product demo", "See borrower journeys, AI follow-ups, webhook-secured payments, and live recovery dashboards in a guided session."]
} satisfies Record<string, [string, string]>;

export function PublicInfoPage({ kind }: { kind: keyof typeof copy }) {
  const [title, body] = copy[kind];
  const isForm = ["contact", "demo", "pricing"].includes(kind);

  return (
    <main className="bg-white">
      <section className="page-shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase text-mint">Settlie AI</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight text-navy">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-secondary">{body}</p>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link to="/demo">Request demo</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/app">Open workspace</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent>
            {isForm ? (
              <form className="grid gap-4">
                <Input placeholder="Work email" type="email" />
                <Input placeholder="Company name" />
                <Input placeholder="Phone number" />
                <textarea className="min-h-32 rounded-xl border border-border p-4 outline-none focus:border-mint" placeholder="Recovery volume, channels, and deployment goals" />
                <Button type="button">
                  <CalendarCheck className="h-4 w-4" />
                  Schedule secure demo
                </Button>
              </form>
            ) : (
              <div className="grid gap-4">
                {[
                  "Supabase Auth, RLS, Realtime, Storage, and Edge Functions",
                  "n8n scheduled and webhook automation with retry logging",
                  "OpenAI primary AI with Gemini fallback architecture",
                  "Razorpay, Twilio, WhatsApp Business, Resend, Cloudinary, and Sentry integration points"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-surface p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-mint" />
                    <p className="text-sm leading-6 text-secondary">{item}</p>
                  </div>
                ))}
              </div>
            )}
            {kind === "contact" && (
              <div className="mt-6 grid gap-3 text-sm text-secondary">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-mint" /> sales@settlie.ai</p>
                <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-mint" /> +91 90000 00000</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
