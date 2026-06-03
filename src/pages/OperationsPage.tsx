import { useMemo, useState } from "react";
import { BellRing, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";

export function OperationsPage({ title }: { title: string }) {
  const { data } = useDashboard();
  const [statusMessage, setStatusMessage] = useState("");

  function handleCreateAutomation() {
    if (title === "EMI Tracking") {
      const loan = data?.loans?.find((item) => item.loan_status === "overdue") ?? data?.loans?.[0];
      setStatusMessage(
        loan ? `Reminder workflow drafted for ${loan.borrower?.borrower_name ?? loan.borrower_id}.` : "Reminder workflow drafted."
      );
      return;
    }

    const borrower = data?.borrowers?.find((item) => item.borrower_status === "in_escalation") ?? data?.borrowers?.[0];
    setStatusMessage(borrower ? `Escalation workflow drafted for ${borrower.borrower_name}.` : "Escalation workflow drafted.");
  }

  function handleAuditTrail() {
    setStatusMessage(`Opening audit trail for ${title.toLowerCase()} events.`);
  }

  const panelItems = useMemo(() => {
    if (title === "EMI Tracking") {
      return (data?.loans ?? []).map((loan) => ({
        primary: loan.borrower?.borrower_name ?? loan.borrower_id,
        secondary: `${loan.overdue_days} overdue days`,
        status: loan.loan_status,
        detail: `${formatCurrency(loan.emi_amount)} due on ${loan.next_payment_date}`,
        icon: Clock
      }));
    }

    return (data?.borrowers ?? [])
      .filter((borrower) => borrower.borrower_status === "in_escalation" || borrower.risk_level === "high")
      .map((borrower) => {
        const loan = data?.loans?.find((item) => item.borrower_id === borrower.id);
        return {
          primary: borrower.borrower_name,
          secondary: borrower.address,
          status: borrower.risk_level,
          detail: loan ? `${loan.overdue_days} overdue days | ${formatCurrency(loan.emi_amount)}` : "Awaiting assignment",
          icon: ShieldAlert
        };
      });
  }, [data, title]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button onClick={handleCreateAutomation}>
            <BellRing className="h-4 w-4" />
            Create automation
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {statusMessage && <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
          {panelItems.map(({ primary, secondary, status, detail, icon: Icon }) => (
            <div key={primary} className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-navy">{primary}</p>
                  <p className="text-sm text-secondary">{secondary}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted">{detail}</p>
                </div>
              </div>
              <StatusPill value={status} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-mint" />
            <div>
              <p className="font-bold text-navy">Realtime-ready operations</p>
              <p className="text-sm text-secondary">
                Supabase Realtime channels can stream payment, reminder, and escalation status updates into this view.
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleAuditTrail}>
            Open audit trail
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
