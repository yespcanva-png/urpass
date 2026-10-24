import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendEmail, isEmailProviderConfigured, getFromEmail } from "@/lib/email";
import { communicationService } from "./index";

function adminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export interface QueueEnqueueResult {
  totalEnqueued: number;
  skipped: number;
  errors?: string[];
}

export interface QueueBatchProcessResult {
  processed: number;
  succeeded: number;
  failed: number;
  retryScheduled: number;
}

export interface QueueSummary {
  eventId: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

/**
 * Enqueues cancellation broadcast notifications into durable communication_queue
 */
export async function enqueueEventCancellationBroadcast(
  eventId: string,
  cancellationReason?: string
): Promise<QueueEnqueueResult> {
  const admin = adminClient();

  const { data: event, error: eventErr } = await admin
    .from("events")
    .select("id, name, event_date, venue, organizer_id")
    .eq("id", eventId)
    .single();

  if (eventErr || !event) {
    return { totalEnqueued: 0, skipped: 0, errors: ["Event not found"] };
  }

  const { data: attendees, error: attErr } = await admin
    .from("attendees")
    .select("id, name, email")
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if (attErr || !attendees || attendees.length === 0) {
    return { totalEnqueued: 0, skipped: 0 };
  }

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Scheduled Date";

  const reasonHtml = cancellationReason?.trim()
    ? `<div style="margin: 16px 0; padding: 14px 16px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; color: #991b1b; font-size: 14px; line-height: 1.5;"><strong>Organizer Note:</strong> ${cancellationReason.trim()}</div>`
    : "";

  let enqueued = 0;
  let skipped = 0;
  const errors: string[] = [];

  const queueItems = [];

  for (const attendee of attendees) {
    if (!attendee.email || !attendee.email.includes("@")) {
      skipped++;
      continue;
    }

    const idempotencyKey = `cancellation_${eventId}_${attendee.id}_email`;

    const emailSubject = `Important Notice: ${event.name} has been cancelled`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 24px; color: #171717; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .badge { display: inline-block; padding: 6px 12px; background-color: #fee2e2; color: #991b1b; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 8px; }
          .event-meta { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6; }
          .footer { margin-top: 32px; font-size: 12px; color: #737373; text-align: center; border-top: 1px solid #f5f5f5; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">Event Cancelled</div>
          <h1 class="title">${event.name}</h1>
          <p>Hi ${attendee.name},</p>
          <p>We are writing to inform you that <strong>${event.name}</strong> has been cancelled by the event organizer.</p>
          ${reasonHtml}
          <div class="event-meta">
            <div><strong>Original Date:</strong> ${formattedDate}</div>
            <div><strong>Venue:</strong> ${event.venue}</div>
          </div>
          <p>Any passes generated for this event have been voided and will no longer be valid for gate entry. If you purchased a ticket, refund processing details will follow under the organizer's event policy.</p>
          <p>We apologize for any inconvenience caused.</p>
          <div class="footer">Sent securely via UrPass Event Operations</div>
        </div>
      </body>
      </html>
    `;

    queueItems.push({
      event_id: eventId,
      recipient: attendee.email.toLowerCase().trim(),
      recipient_name: attendee.name,
      channel: "email",
      purpose: "event_cancellation",
      payload: {
        subject: emailSubject,
        html: emailHtml,
        eventName: event.name,
        attendeeId: attendee.id,
      },
      idempotency_key: idempotencyKey,
      status: "pending",
      attempts: 0,
      max_attempts: 5,
      next_attempt_at: new Date().toISOString(),
    });
  }

  // Insert in chunks of 50 to avoid payload bloat
  const chunkSize = 50;
  for (let i = 0; i < queueItems.length; i += chunkSize) {
    const chunk = queueItems.slice(i, i + chunkSize);
    const { error: insertErr } = await admin
      .from("communication_queue")
      .upsert(chunk, { onConflict: "idempotency_key", ignoreDuplicates: true });

    if (insertErr) {
      errors.push(insertErr.message);
    } else {
      enqueued += chunk.length;
    }
  }

  return { totalEnqueued: enqueued, skipped, errors: errors.length > 0 ? errors : undefined };
}

/**
 * Processes a batch of pending items from communication_queue with concurrency safety and backoff
 */
export async function processCommunicationQueueBatch(
  batchLimit: number = 25
): Promise<QueueBatchProcessResult> {
  const admin = adminClient();
  const now = new Date().toISOString();

  // 1. Fetch pending items eligible for execution
  const { data: items, error: fetchErr } = await admin
    .from("communication_queue")
    .select("*")
    .in("status", ["pending", "processing"])
    .lte("next_attempt_at", now)
    .order("next_attempt_at", { ascending: true })
    .limit(batchLimit);

  if (fetchErr || !items || items.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, retryScheduled: 0 };
  }

  let succeeded = 0;
  let failed = 0;
  let retryScheduled = 0;

  for (const item of items) {
    // Lock row by setting status = 'processing', last_attempt_at = now
    await admin
      .from("communication_queue")
      .update({
        status: "processing",
        last_attempt_at: now,
        attempts: (item.attempts || 0) + 1,
        updated_at: now,
      })
      .eq("id", item.id);

    try {
      if (item.channel === "email") {
        if (!isEmailProviderConfigured()) {
          // If running in development without mail provider, simulate delivery
          console.log(`[communication_queue] Mock email sent to ${item.recipient}`);
        } else {
          await sendEmail({
            to: item.recipient,
            subject: item.payload?.subject || "UrPass Notification",
            html: item.payload?.html || "",
          });
        }

        // Mark as completed
        await admin
          .from("communication_queue")
          .update({
            status: "completed",
            error_message: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        // Record in communication_deliveries for historical lookup
        try {
          await admin
            .from("communication_deliveries")
            .upsert({
              event_id: item.event_id,
              recipient: item.recipient,
              purpose: item.purpose,
              channel: "email",
              status: "delivered",
              delivered_at: new Date().toISOString(),
            }, { onConflict: "event_id,recipient,purpose", ignoreDuplicates: true });
        } catch {
          // Non-blocking history record
        }

        succeeded++;
      } else {
        // Unsupported channel or missing config
        throw new Error(`Unsupported channel: ${item.channel}`);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unknown transmission error";
      const currentAttempts = (item.attempts || 0) + 1;
      const maxAttempts = item.max_attempts || 5;

      if (currentAttempts >= maxAttempts) {
        // Permanent failure
        await admin
          .from("communication_queue")
          .update({
            status: "failed",
            error_message: errMsg,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
        failed++;
      } else {
        // Exponential backoff: 2^attempt * 15 seconds
        const backoffSeconds = Math.pow(2, currentAttempts) * 15;
        const nextAttempt = new Date(Date.now() + backoffSeconds * 1000).toISOString();

        await admin
          .from("communication_queue")
          .update({
            status: "pending",
            error_message: errMsg,
            next_attempt_at: nextAttempt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
        retryScheduled++;
      }
    }
  }

  return {
    processed: items.length,
    succeeded,
    failed,
    retryScheduled,
  };
}

/**
 * Retrieves aggregate queue delivery metrics for an event
 */
export async function getEventQueueSummary(eventId: string): Promise<QueueSummary> {
  const admin = adminClient();

  const { data: counts } = await admin
    .from("communication_queue")
    .select("status")
    .eq("event_id", eventId);

  const summary: QueueSummary = {
    eventId,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    total: counts?.length || 0,
  };

  for (const row of counts || []) {
    if (row.status === "pending") summary.pending++;
    else if (row.status === "processing") summary.processing++;
    else if (row.status === "completed") summary.completed++;
    else if (row.status === "failed") summary.failed++;
  }

  return summary;
}
