import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { assertUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { client, user } = await assertUser(req);
  const { loanId, amount } = await req.json();
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!loanId || !amount) return jsonResponse({ message: "loanId and amount are required" }, 400);
  if (!keyId || !keySecret) return jsonResponse({ message: "Razorpay credentials missing" }, 500);

  const receipt = `loan_${loanId}_${Date.now()}`.slice(0, 40);
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt,
      notes: { loanId }
    })
  });

  const order = await response.json();
  if (!response.ok) return jsonResponse({ message: order.error?.description ?? "Razorpay order failed" }, 400);

  const { error } = await client.from("payments").insert({
    loan_id: loanId,
    payment_amount: amount,
    payment_method: "razorpay",
    payment_status: "created",
    razorpay_order_id: order.id
  });
  if (error) return jsonResponse({ message: error.message }, 500);

  await client.from("audit_logs").insert({
    user_id: user.id,
    action_type: "razorpay_order_created",
    metadata: { loanId, amount, orderId: order.id }
  });

  return jsonResponse({ orderId: order.id, amount, currency: "INR", keyId });
});
