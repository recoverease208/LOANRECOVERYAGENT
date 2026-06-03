import { useState } from "react";
import { Bot, BrainCircuit, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateRecoveryMessage } from "@/services/aiService";

export function AiAssistantPage() {
  const [context, setContext] = useState("Borrower is 13 days overdue, previously paid on time, requested partial payment option.");
  const [result, setResult] = useState({
    message: "Generate a borrower-safe message to preview AI communication.",
    risk: "medium",
    nextBestAction: "Awaiting prompt"
  });
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      setResult(await generateRecoveryMessage({ borrowerId: "b-101", tone: "empathetic", channel: "whatsapp", context }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <CardHeader>
          <CardTitle>AI Recovery Assistant</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="text-sm font-semibold text-secondary" htmlFor="context">Borrower context</label>
          <textarea
            id="context"
            className="min-h-40 rounded-xl border border-border p-4 outline-none focus:border-mint"
            value={context}
            onChange={(event) => setContext(event.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input value="WhatsApp" readOnly />
            <Input value="Empathetic tone" readOnly />
          </div>
          <Button onClick={() => void generate()} disabled={loading}>
            <BrainCircuit className="h-4 w-4" />
            {loading ? "Generating..." : "Generate follow-up"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Bot className="h-5 w-5 text-mint" />
          <CardTitle>AI output and next action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-surface p-5">
            <p className="text-sm font-bold uppercase text-mint">Borrower message</p>
            <p className="mt-3 leading-7 text-secondary">{result.message}</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-muted">Risk assessment</p>
              <p className="mt-2 text-2xl font-extrabold text-navy">{result.risk}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-muted">Next best action</p>
              <p className="mt-2 text-sm leading-6 text-secondary">{result.nextBestAction}</p>
            </div>
          </div>
          <Button className="mt-5" variant="navy">
            <SendHorizontal className="h-4 w-4" />
            Send through workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
