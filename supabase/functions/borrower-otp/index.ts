import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { phone } = await req.json();
  if (!phone) return jsonResponse({ message: "phone is required" }, 400);

  const client = getServiceClient();
  const { data, error } = await client.auth.admin.generateLink({
    type: "magiclink",
    phone,
    options: { redirectTo: Deno.env.get("BORROWER_PORTAL_URL") }
  });
  if (error) return jsonResponse({ message: error.message }, 400);

  return jsonResponse({ actionLink: data.properties?.action_link });
});
