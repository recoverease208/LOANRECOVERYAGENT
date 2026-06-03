import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CreditCard, LockKeyhole, MessageSquareText, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: Bot, title: "AI recovery assistant", body: "Generate contextual reminders, risk notes, call summaries, and next-best actions." },
  { icon: MessageSquareText, title: "Omnichannel automation", body: "Coordinate SMS, WhatsApp, email, and voice workflows with full communication logs." },
  { icon: CreditCard, title: "Secure EMI collections", body: "Razorpay payment links, webhook verification, proof uploads, and receipt-ready records." },
  { icon: Workflow, title: "Escalation workflows", body: "Auto-assign agents, track stages, retry failed jobs, and preserve audit trails." }
];

export function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(180deg,#F8FBFD_0%,#FFFFFF_100%)]" />
        <div className="page-shell relative grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="info" className="mb-5">AI-powered loan recovery automation</Badge>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
              Settlie AI
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-secondary">
              Automate EMI reminders, borrower conversations, payment collection, escalations, and analytics for banks,
              NBFCs, fintech lenders, microfinance institutions, and recovery agencies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/demo">
                  Request enterprise demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/app">View live workspace</Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-secondary">
              {["RLS secured", "Webhook verified", "Audit logged"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-mint" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="rounded-[2rem] border border-border bg-white p-4 shadow-soft"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="rounded-[1.5rem] bg-navy p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/65">Recovery control tower</p>
                  <p className="text-2xl font-bold">INR 2.84Cr recovered</p>
                </div>
                <div className="rounded-xl bg-mint px-3 py-2 text-sm font-bold text-navy">+18.2%</div>
              </div>
              <div className="mt-8 grid gap-3">
                {[
                  ["AI WhatsApp follow-up", "Delivered", "Aarav Mehta"],
                  ["Razorpay webhook", "Verified", "Nisha Rao"],
                  ["Escalation threshold", "Assigned", "Imran Khan"]
                ].map(([title, status, person]) => (
                  <div key={title} className="rounded-xl border border-white/10 bg-white/8 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-white/60">{person}</p>
                      </div>
                      <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint">{status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-white p-4 text-navy">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-1 h-5 w-5 text-mint" />
                  <p className="text-sm leading-6 text-secondary">
                    Service-role keys stay inside Edge Functions. Borrower files use signed URLs, validated access, and RLS-backed records.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="page-shell grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent>
                <feature.icon className="h-7 w-7 text-mint" />
                <h2 className="mt-5 text-lg font-bold text-navy">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-secondary">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
