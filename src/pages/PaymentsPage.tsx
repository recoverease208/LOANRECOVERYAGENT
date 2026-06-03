import { useState } from "react";
import { CreditCard, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";
import { createPaymentIntent } from "@/services/paymentService";
import { formatCurrency } from "@/lib/utils";

export function PaymentsPage() {
  const { data } = useDashboard();
  const [statusMessage, setStatusMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateEmiLink() {
    setStatusMessage("");
    setIsCreating(true);
    try {
      const result = await createPaymentIntent("l-201", 28500);
      setStatusMessage(`Payment link created for ${result.orderId}.`);
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to create payment link.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleOpenReceipt(paymentId: string, proofUrl: string | null) {
    if (!proofUrl) {
      setStatusMessage(`No receipt file is available yet for ${paymentId}.`);
      return;
    }

    window.open(proofUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Tracking</CardTitle>
        <Button onClick={() => void handleCreateEmiLink()} disabled={isCreating}>
          <CreditCard className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create EMI link"}
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {statusMessage && <div className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
        <Table>
          <THead><tr><TH>Payment</TH><TH>Loan</TH><TH>Amount</TH><TH>Method</TH><TH>Status</TH><TH>Receipt</TH></tr></THead>
          <tbody>
            {(data?.payments ?? []).map((payment) => (
              <tr key={payment.id}>
                <TD className="font-semibold text-navy">{payment.id}</TD>
                <TD>{payment.loan_id}</TD>
                <TD>{formatCurrency(payment.payment_amount)}</TD>
                <TD>{payment.payment_method}</TD>
                <TD><StatusPill value={payment.payment_status} /></TD>
                <TD>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenReceipt(payment.id, payment.payment_proof_url)}
                  >
                    <ReceiptText className="h-4 w-4" />
                    Open
                  </Button>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
