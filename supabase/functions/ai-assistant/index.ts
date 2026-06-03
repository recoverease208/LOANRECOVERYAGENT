import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { assertUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ message: "Method not allowed" }, 405);

  const { client, user } = await assertUser(req);
  const payload = await req.json();
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  const prompt = `Create a compliant ${payload.channel} recovery message. Tone: ${payload.tone}. Context: ${payload.context}`;

  let message = "";
  if (openAiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openAiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: "You write concise, lawful, respectful loan recovery communications. Do not threaten or shame borrowers." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });
    const data = await response.json();
    message = data.choices?.[0]?.message?.content ?? "";
  }

  if (!message && geminiKey) {
    const geminiModel = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash-lite";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    message = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  if (!message) message = "Please use the secure payment link to clear your pending EMI or reply to discuss a suitable repayment option.";

  await client.from("audit_logs").insert({
    user_id: user.id,
    action_type: "ai_recovery_message_generated",
    metadata: { borrowerId: payload.borrowerId, channel: payload.channel, tone: payload.tone }
  });

  return jsonResponse({
    message,
    risk: payload.context?.toLowerCase().includes("overdue") ? "medium" : "low",
    nextBestAction: "Send approved reminder, log communication, and schedule follow-up based on response."
  });
});
