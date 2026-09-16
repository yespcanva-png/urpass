import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export type WebhookEventType =
  | "registration.created"
  | "payment.success"
  | "checkin.completed"
  | "pass.issued"
  | "registration.approved"
  | "registration.rejected";

export interface WebhookPayload {
  event_type: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export async function sendWebhooks(
  userId: string,
  eventType: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = adminClient();

  // Fetch active endpoints subscribed to this event type
  const { data: endpoints } = await supabase
    .from("webhook_endpoints")
    .select("id, url, secret")
    .eq("user_id", userId)
    .eq("is_active", true)
    .contains("subscribed_events", [eventType]);

  if (!endpoints || endpoints.length === 0) return;

  const payload: WebhookPayload = {
    event_type: eventType,
    timestamp: new Date().toISOString(),
    data,
  };

  const body = JSON.stringify(payload);

  // Fire to each endpoint — non-blocking, don't await
  for (const endpoint of endpoints) {
    const sig = createHmac("sha256", endpoint.secret).update(body).digest("hex");

    fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-UrPass-Signature": `sha256=${sig}`,
        "X-UrPass-Event": eventType,
      },
      body,
    })
      .then(async (res) => {
        const responseBody = await res.text().catch(() => "");
        await supabase.from("webhook_deliveries").insert({
          endpoint_id: endpoint.id,
          event_type: eventType,
          payload,
          response_status: res.status,
          response_body: responseBody.slice(0, 500),
          success: res.ok,
        });
      })
      .catch(async (err) => {
        await supabase.from("webhook_deliveries").insert({
          endpoint_id: endpoint.id,
          event_type: eventType,
          payload,
          response_status: null,
          response_body: String(err).slice(0, 500),
          success: false,
        });
      });
  }
}
