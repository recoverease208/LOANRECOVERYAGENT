import { useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";

export function CommunicationsPage() {
  const { data } = useDashboard();
  const [statusMessage, setStatusMessage] = useState("");

  function handleQueueReminder() {
    const target = data?.borrowers?.[0];
    setStatusMessage(target ? `Queued a reminder draft for ${target.borrower_name}.` : "Queued reminder draft.");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Communication Center</CardTitle>
        <Button onClick={handleQueueReminder}>
          <Send className="h-4 w-4" />
          Queue reminder
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {statusMessage && <div className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
        <Table>
          <THead><tr><TH>Channel</TH><TH>Type</TH><TH>AI</TH><TH>Message</TH><TH>Status</TH></tr></THead>
          <tbody>
            {(data?.communications ?? []).map((item) => (
              <tr key={item.id}>
                <TD><span className="inline-flex items-center gap-2 font-semibold text-navy"><MessageSquareText className="h-4 w-4 text-mint" />{item.communication_channel}</span></TD>
                <TD>{item.communication_type}</TD>
                <TD>{item.ai_generated ? "Yes" : "No"}</TD>
                <TD className="max-w-xl">{item.message_content}</TD>
                <TD><StatusPill value={item.communication_status} /></TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
