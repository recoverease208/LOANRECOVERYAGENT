import { useMemo, useState } from "react";
import { Download, MessageSquareText, ReceiptText, ShieldAlert, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";

export function ReportsPage() {
  const { data } = useDashboard();
  const [statusMessage, setStatusMessage] = useState("");

  const metrics = useMemo(() => {
    const payments = data?.payments ?? [];
    const loans = data?.loans ?? [];
    const communications = data?.communications ?? [];

    const paidAmount = payments
      .filter((payment) => payment.payment_status === "paid")
      .reduce((total, payment) => total + payment.payment_amount, 0);

    const overdueLoans = loans.filter((loan) => loan.loan_status === "overdue").length;
    const deliveredCommunications = communications.filter((item) => item.communication_status === "delivered").length;
    const aiCommunications = communications.filter((item) => item.ai_generated).length;

    return [
      { icon: ReceiptText, label: "Recovered amount", value: formatCurrency(paidAmount) },
      { icon: ShieldAlert, label: "Overdue loans", value: String(overdueLoans) },
      { icon: MessageSquareText, label: "Delivered comms", value: String(deliveredCommunications) },
      { icon: TrendingUp, label: "AI-led comms", value: String(aiCommunications) }
    ];
  }, [data]);

  function downloadCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Recovered amount", metrics[0]?.value ?? "-"],
      ["Overdue loans", metrics[1]?.value ?? "-"],
      ["Delivered communications", metrics[2]?.value ?? "-"],
      ["AI-led communications", metrics[3]?.value ?? "-"]
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "settlie-ai-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage("CSV report generated and downloaded.");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Reports & Analytics</CardTitle>
          <Button onClick={downloadCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {statusMessage && <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center gap-2 text-secondary">
                  <Icon className="h-4 w-4 text-mint" />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                <p className="mt-3 text-3xl font-extrabold text-navy">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recovery trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.recoveryTrend ?? []}>
                  <CartesianGrid stroke="#E7EEF5" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="recovered" stroke="#00C9A7" fill="#00C9A7" fillOpacity={0.16} />
                  <Area type="monotone" dataKey="overdue" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.12} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {(data?.communications ?? []).slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-bold text-navy">{item.communication_type}</p>
                <p className="mt-2 text-sm leading-6 text-secondary">{item.message_content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan risk breakdown</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <tr>
                <TH>Borrower</TH>
                <TH>EMI</TH>
                <TH>Overdue</TH>
                <TH>Status</TH>
              </tr>
            </THead>
            <tbody>
              {(data?.loans ?? []).map((loan) => (
                <tr key={loan.id}>
                  <TD className="font-semibold text-navy">{loan.borrower?.borrower_name ?? loan.borrower_id}</TD>
                  <TD>{formatCurrency(loan.emi_amount)}</TD>
                  <TD>{loan.overdue_days} days</TD>
                  <TD>{loan.loan_status}</TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
