import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { communicationService } from "@/lib/communications";
import { DeliveryStatus } from "@/lib/communications/types";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Cloud API Webhook Endpoint (Production Hardened)
 *
 * GET: Handles the Meta Webhook Verification Challenge during setup.
 *      Strictly requires WHATSAPP_WEBHOOK_VERIFY_TOKEN without hardcoded fallbacks.
 * POST: Handles real-time message delivery receipts (sent, delivered, read, failed)
 *       and incoming messages. Enforces HMAC-SHA256 signature verification in production.
 */

// In-memory LRU deduplication cache for rapid burst duplicate webhook deliveries
const processedEventsCache = new Map<string, number>();
const DEDUP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function isDuplicateWebhookEvent(eventId: string): boolean {
  const now = Date.now();
  // Clean expired keys if cache grows large
  if (processedEventsCache.size > 2000) {
    for (const [key, timestamp] of processedEventsCache.entries()) {
      if (now - timestamp > DEDUP_TTL_MS) {
        processedEventsCache.delete(key);
      }
    }
  }

  if (processedEventsCache.has(eventId)) {
    return true;
  }
  processedEventsCache.set(eventId, now);
  return false;
}

/**
 * Constant-time string equality to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const expectedToken =
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
      process.env.WHATSAPP_VERIFY_TOKEN;

    if (!expectedToken) {
      console.error("[WhatsApp Webhook GET] Server configuration error: WHATSAPP_WEBHOOK_VERIFY_TOKEN is missing.");
      return new Response("Server configuration error: Verification token unconfigured", { status: 500 });
    }

    if (mode !== "subscribe") {
      console.warn(`[WhatsApp Webhook GET] Invalid hub.mode received: "${mode}"`);
      return new Response("Forbidden: Invalid hub.mode", { status: 403 });
    }

    if (!token || !timingSafeEqual(token, expectedToken)) {
      console.warn("[WhatsApp Webhook GET] Verification failed. Token mismatch.");
      return new Response("Forbidden: Verification token mismatch", { status: 403 });
    }

    console.log("[WhatsApp Webhook GET] Meta challenge verification successful");
    return new Response(challenge || "", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: unknown) {
    console.error("[WhatsApp Webhook GET] Exception:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    // ── 1. Enforce HMAC-SHA256 Signature Verification ──
    if (isProduction && !appSecret) {
      console.error("[WhatsApp Webhook POST] Critical: WHATSAPP_APP_SECRET is required in production");
      return NextResponse.json(
        { error: "Webhook authentication is not configured on this server" },
        { status: 500 }
      );
    }

    if (appSecret) {
      const signature = req.headers.get("x-hub-signature-256") || "";
      if (!signature || !signature.startsWith("sha256=")) {
        console.warn("[WhatsApp Webhook POST] Missing or invalid x-hub-signature-256 header");
        return NextResponse.json(
          { error: "Missing or invalid signature header" },
          { status: 401 }
        );
      }

      const expectedSignature =
        "sha256=" +
        crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

      if (!timingSafeEqual(signature, expectedSignature)) {
        console.error("[WhatsApp Webhook POST] Signature verification failed");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    // ── 2. Payload Structure Validation ──
    let payload: Record<string, any>;
    try {
      payload = JSON.parse(rawBody || "{}");
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    if (payload.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const entries = Array.isArray(payload.entry) ? payload.entry : [];

    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : [];

      for (const change of changes) {
        const value = change?.value;
        if (!value || value.messaging_product !== "whatsapp") continue;

        // ── 3. Process Delivery Receipts with Event Deduplication ──
        if (Array.isArray(value.statuses)) {
          for (const st of value.statuses) {
            const providerMessageId = String(st.id || "");
            const rawStatus = String(st.status || "").toLowerCase();
            const timestamp = st.timestamp
              ? new Date(Number(st.timestamp) * 1000).toISOString()
              : new Date().toISOString();

            // Deduplicate status updates: don't process identical wamid + status repeatedly
            const eventDedupKey = `status:${providerMessageId}:${rawStatus}`;
            if (isDuplicateWebhookEvent(eventDedupKey)) {
              continue;
            }

            let normalizedStatus: DeliveryStatus = "SENT";
            if (rawStatus === "delivered") {
              normalizedStatus = "DELIVERED";
            } else if (rawStatus === "read") {
              normalizedStatus = "READ";
            } else if (rawStatus === "failed") {
              normalizedStatus = "FAILED";
            } else if (rawStatus === "sent") {
              normalizedStatus = "SENT";
            }

            let failureReason: string | undefined;
            if (Array.isArray(st.errors) && st.errors.length > 0) {
              const err = st.errors[0];
              failureReason =
                err.details ||
                err.message ||
                err.title ||
                `Meta error code ${err.code}`;
            }

            // Update database with monotonic state reconciliation
            await communicationService.updateDeliveryFromWebhook("whatsapp_cloud", {
              providerMessageId,
              status: normalizedStatus,
              failureReason,
              deliveredAt: normalizedStatus === "DELIVERED" ? timestamp : undefined,
              readAt: normalizedStatus === "READ" ? timestamp : undefined,
            });
          }
        }

        // ── 4. Process Incoming Messages with Deduplication ──
        if (Array.isArray(value.messages)) {
          for (const msg of value.messages) {
            const msgId = String(msg.id || "");
            const eventDedupKey = `msg:${msgId}`;
            if (isDuplicateWebhookEvent(eventDedupKey)) {
              continue;
            }

            const sender = String(msg.from || "");
            const msgType = String(msg.type || "");
            const textBody = msg.text?.body || "";

            console.log(
              `[WhatsApp Webhook] Inbound message from +${sender} (type: ${msgType}): ${textBody}`
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("[WhatsApp Webhook POST] Handler error:", err);
    // Respond with 200 to acknowledge payload receipt and prevent Meta from dropping webhook
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
