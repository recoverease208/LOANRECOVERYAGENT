import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowUpRight, Bot, CreditCard, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";

const automationHealth = [
  { icon: Bot, label: "AI messages generated", value: "1,248" },
  { icon: CreditCard, label: "Webhook confirmations", value: "386" },
  { icon: Users, label: "Agent tasks assigned", value: "91" },
  { icon: Activity, label: "Failed jobs retried", value: "12" }
];

export function DashboardPage() {
  const { data } = useDashboard();

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.kpiMetrics ?? []).map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-secondary">{metric.label}</p>
                <ArrowUpRight className="h-4 w-4 text-mint" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-navy dark:text-white">{metric.value}</p>
              <p className="mt-2 text-sm font-semibold text-success">{metric.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recovery and overdue trend</CardTitle>
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
            <CardTitle>Automation health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {automationHealth.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-surface p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-mint" />
                  <span className="text-sm font-semibold text-secondary">{label}</span>
                </div>
                <span className="text-lg font-extrabold text-navy">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority overdue loans</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <tr>
                <TH>Borrower</TH>
                <TH>EMI</TH>
                <TH>Overdue</TH>
                <TH>Status</TH>
                <TH>Risk</TH>
              </tr>
            </THead>
            <tbody>
              {(data?.loans ?? []).map((loan) => (
                <tr key={loan.id}>
                  <TD className="font-semibold text-navy">{loan.borrower?.borrower_name ?? loan.borrower_id}</TD>
                  <TD>{formatCurrency(loan.emi_amount)}</TD>
                  <TD>{loan.overdue_days} days</TD>
                  <TD><StatusPill value={loan.loan_status} /></TD>
                  <TD><StatusPill value={loan.borrower?.risk_level ?? "medium"} /></TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
