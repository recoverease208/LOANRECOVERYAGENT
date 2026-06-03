import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

async function hmacSha256(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ message: "Method not allowed" }, 405);

  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) return jsonResponse({ message: "Webhook secret missing" }, 500);

  const rawBody = await req.text();
  const receivedSignature = req.headers.get("x-razorpay-signature") ?? "";
  const expectedSignature = await hmacSha256(secret, rawBody);
  if (receivedSignature !== expectedSignature) return jsonResponse({ message: "Invalid signature" }, 401);

  const event = JSON.parse(rawBody);
  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  const status = event.event === "payment.captured" ? "paid" : event.event === "payment.failed" ? "failed" : "pending";

  const client = getServiceClient();
  const idempotencyKey = `${event.event}:${paymentId ?? orderId}`;
  const { error: auditError } = await client.from("workflow_runs").upsert({
    workflow_name: "payment_confirmation",
    idempotency_key: idempotencyKey,
    status,
    external_run_id: paymentId,
    payload: event
  }, { onConflict: "idempotency_key" });
  if (auditError) return jsonResponse({ message: auditError.message }, 500);

  if (orderId) {
    const { error } = await client
      .from("payments")
      .update({
        payment_status: status,
        razorpay_payment_id: paymentId,
        paid_at: status === "paid" ? new Date().toISOString() : null,
        idempotency_key: idempotencyKey
      })
      .eq("razorpay_order_id", orderId);
    if (error) return jsonResponse({ message: error.message }, 500);
  }

  return jsonResponse({ received: true, idempotencyKey });
});
