import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { enqueueEventCancellationBroadcast, processCommunicationQueueBatch } from "./communication-queue";

function adminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export interface CancellationNotificationResult {
  totalEligible: number;
  sent: number;
  skipped: number;
  failed: number;
  errors?: string[];
}

/**
 * Dispatches event cancellation notices using the durable communication_queue.
 * Prevents serverless timeouts on large events by enqueuing records first, then processing
 * the immediate batch with exponential backoff and idempotency.
 */
export async function notifyAttendeesEventCancelled(
  eventId: string,
  cancellationReason?: string
): Promise<CancellationNotificationResult> {
  const admin = adminClient();

  // 1. Fetch event metadata
  const { data: event, error: eventErr } = await admin
    .from("events")
    .select("id, name, event_date, venue, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (eventErr || !event) {
    return { totalEligible: 0, sent: 0, skipped: 0, failed: 0, errors: ["Event not found"] };
  }

  // 2. Enqueue all cancellation emails into durable database queue
  const enqueueRes = await enqueueEventCancellationBroadcast(eventId, cancellationReason);

  // 3. Process the initial batch (up to 50 recipients) immediately
  const processRes = await processCommunicationQueueBatch(50);

  // 4. Return summary
  return {
    totalEligible: enqueueRes.totalEnqueued + enqueueRes.skipped,
    sent: processRes.succeeded,
    skipped: enqueueRes.skipped,
    failed: processRes.failed,
    errors: enqueueRes.errors,
  };
}

export const dispatchEventCancellationNotifications = notifyAttendeesEventCancelled;
