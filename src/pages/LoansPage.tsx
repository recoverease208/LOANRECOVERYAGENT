import { CalendarClock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";

export function LoansPage() {
  const { data } = useDashboard();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Loan Management</CardTitle>
        <Button variant="secondary"><Filter className="h-4 w-4" />Filter portfolio</Button>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead><tr><TH>Borrower</TH><TH>Loan</TH><TH>EMI</TH><TH>Interest</TH><TH>Next Payment</TH><TH>Status</TH></tr></THead>
          <tbody>
            {(data?.loans ?? []).map((loan) => (
              <tr key={loan.id}>
                <TD className="font-semibold text-navy">{loan.borrower?.borrower_name ?? loan.borrower_id}</TD>
                <TD>{formatCurrency(loan.loan_amount)}</TD>
                <TD>{formatCurrency(loan.emi_amount)}</TD>
                <TD>{loan.interest_rate}%</TD>
                <TD><span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-mint" />{loan.next_payment_date}</span></TD>
                <TD><StatusPill value={loan.loan_status} /></TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
