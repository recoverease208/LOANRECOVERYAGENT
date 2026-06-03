import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { assertUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { client, user } = await assertUser(req);
  const { bucket, path, expiresIn = 300 } = await req.json();

  if (!bucket || !path) return jsonResponse({ message: "bucket and path are required" }, 400);

  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, Math.min(Number(expiresIn), 900));
  if (error) return jsonResponse({ message: error.message }, 400);

  await client.from("audit_logs").insert({
    user_id: user.id,
    action_type: "signed_file_url_generated",
    metadata: { bucket, path }
  });

  return jsonResponse({ signedUrl: data.signedUrl });
});
