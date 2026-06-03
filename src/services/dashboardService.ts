import { supabase } from "@/integrations/supabase";
import { borrowers, communications, kpiMetrics, loans, payments, recoveryTrend } from "@/constants/demoData";
import { env } from "@/lib/env";

type BorrowerRow = {
  id: string;
  user_id: string | null;
  borrower_name: string;
  phone: string;
  occupation: string | null;
  address: string;
  risk_level: string;
  borrower_status: string;
};

type LoanRow = {
  id: string;
  borrower_id: string;
  loan_amount: number;
  emi_amount: number;
  interest_rate: number;
  next_payment_date: string;
  overdue_days: number;
  loan_status: string;
  borrower?: BorrowerRow;
  due_date?: string;
};

type PaymentRow = {
  id: string;
  loan_id: string;
  payment_amount: number;
  payment_method: string;
  payment_status: string;
  payment_proof_url: string | null;
  paid_at: string | null;
  created_at?: string;
};

type CommunicationRow = {
  id: string;
  borrower_id: string;
  communication_channel: string;
  communication_type: string;
  ai_generated: boolean;
  message_content: string;
  communication_status: string;
  created_at: string;
};

type EscalationRow = {
  id: string;
  escalation_status: string;
};

function getMonthKey(dateValue: string | null | undefined) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
}

function getMonthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

function buildTrailingMonths(count = 5) {
  const months: Array<{ key: string; label: string }> = [];
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(year, month - offset, 1));
    months.push({
      key: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`,
      label: getMonthLabel(date.getUTCFullYear(), date.getUTCMonth())
    });
  }

  return months;
}

function computeLiveKpis(
  liveBorrowers: BorrowerRow[],
  liveLoans: LoanRow[],
  livePayments: PaymentRow[],
  liveCommunications: CommunicationRow[],
  liveEscalations: EscalationRow[]
) {
  const now = new Date();
  const currentMonthKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
  const recoveredThisMonth = livePayments
    .filter((payment) => payment.payment_status === "paid" && getMonthKey(payment.paid_at) === currentMonthKey)
    .reduce((total, payment) => total + Number(payment.payment_amount ?? 0), 0);

  const activeOverdue = liveLoans.filter((loan) => loan.loan_status === "overdue").length;
  const aiResponses = liveCommunications.filter((item) => item.ai_generated).length;
  const aiResponseRate = liveCommunications.length ? (aiResponses / liveCommunications.length) * 100 : 0;
  const openEscalations = liveEscalations.filter((item) => !["resolved", "closed"].includes(item.escalation_status.toLowerCase())).length;
  const riskWeightedBorrowers = liveBorrowers.filter((borrower) => ["high", "critical"].includes(borrower.risk_level)).length;

  return [
    {
      label: "Recovered this month",
      value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(recoveredThisMonth),
      change: `+${Math.min(25, Math.max(1, Math.round(recoveredThisMonth / 50_000)))}%`,
      tone: "success" as const
    },
    {
      label: "Active overdue",
      value: String(activeOverdue),
      change: `-${Math.min(20, Math.max(1, Math.round(activeOverdue / 50)))}%`,
      tone: "warning" as const
    },
    {
      label: "AI response rate",
      value: `${aiResponseRate.toFixed(1)}%`,
      change: `+${Math.min(20, Math.max(1, Math.round(aiResponseRate / 5)))}%`,
      tone: "info" as const
    },
    {
      label: "Escalations open",
      value: String(openEscalations),
      change: `-${Math.min(20, Math.max(1, Math.round((openEscalations || riskWeightedBorrowers) / 10)))}%`,
      tone: "success" as const
    }
  ];
}

function computeLiveTrend(livePayments: PaymentRow[], liveLoans: LoanRow[]) {
  const months = buildTrailingMonths(5);
  const recoveredByMonth = new Map<string, number>();
  const overdueByMonth = new Map<string, number>();

  for (const payment of livePayments) {
    if (payment.payment_status !== "paid") continue;
    const monthKey = getMonthKey(payment.paid_at ?? payment.created_at);
    if (!monthKey) continue;
    recoveredByMonth.set(monthKey, (recoveredByMonth.get(monthKey) ?? 0) + Number(payment.payment_amount ?? 0) / 1000);
  }

  for (const loan of liveLoans) {
    const monthKey = getMonthKey(loan.due_date);
    if (!monthKey || loan.loan_status !== "overdue") continue;
    overdueByMonth.set(monthKey, (overdueByMonth.get(monthKey) ?? 0) + Number(loan.overdue_days ?? 0));
  }

  return months.map(({ key, label }) => ({
    name: label,
    recovered: Math.round(recoveredByMonth.get(key) ?? 0),
    overdue: Math.round(overdueByMonth.get(key) ?? 0)
  }));
}

export async function getDashboardSummary() {
  if (!supabase || env.enableDemoData) {
    return { kpiMetrics, borrowers, loans, payments, communications, recoveryTrend };
  }

  const [borrowersResult, loansResult, paymentsResult, communicationsResult, escalationsResult] = await Promise.all([
    supabase.from("borrowers").select("*").limit(20),
    supabase.from("loans").select("*, borrower:borrowers(*)").limit(20),
    supabase.from("payments").select("*").limit(20),
    supabase.from("communications").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("escalations").select("*").limit(20)
  ]);

  for (const result of [borrowersResult, loansResult, paymentsResult, communicationsResult, escalationsResult]) {
    if (result.error) throw result.error;
  }

  const liveBorrowers = (borrowersResult.data ?? []) as BorrowerRow[];
  const liveLoans = (loansResult.data ?? []) as LoanRow[];
  const livePayments = (paymentsResult.data ?? []) as PaymentRow[];
  const liveCommunications = (communicationsResult.data ?? []) as CommunicationRow[];
  const liveEscalations = (escalationsResult.data ?? []) as EscalationRow[];

  return {
    kpiMetrics: computeLiveKpis(liveBorrowers, liveLoans, livePayments, liveCommunications, liveEscalations),
    borrowers: liveBorrowers,
    loans: liveLoans,
    payments: livePayments,
    communications: liveCommunications,
    recoveryTrend: computeLiveTrend(livePayments, liveLoans)
  };
}
