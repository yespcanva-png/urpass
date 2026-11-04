import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for privacy scrubbing.");
  return createClient(getSupabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface ErasureExecutionResult {
  success: boolean;
  recordsScrubbed: number;
  error?: string;
}

/**
 * Executes GDPR Art. 17 right-to-erasure on attendee and user PII.
 *
 * In accordance with UK GDPR Art. 17(3)(b) & statutory financial retention obligations (HMRC / GST),
 * financial transaction records, invoices, and accounting totals are preserved for the statutory
 * retention window, but personal identifiers (name, personal email, phone, custom responses)
 * are permanently redacted/anonymized.
 */
export async function executeDataErasure(params: {
  email: string;
  eventId?: string | null;
  referenceId?: string | null;
}): Promise<ErasureExecutionResult> {
  const admin = adminClient();
  const normalizedEmail = params.email.trim().toLowerCase();

  let recordsScrubbed = 0;

  try {
    // 1. Scrub Attendees table
    let attendeeQuery = admin
      .from("attendees")
      .select("id")
      .ilike("email", normalizedEmail);

    if (params.eventId) {
      attendeeQuery = attendeeQuery.eq("event_id", params.eventId);
    }

    const { data: attendeesToScrub, error: attendeeFetchErr } = await attendeeQuery;
    if (attendeeFetchErr) {
      return { success: false, recordsScrubbed: 0, error: attendeeFetchErr.message };
    }

    if (attendeesToScrub && attendeesToScrub.length > 0) {
      for (const att of attendeesToScrub) {
        const redactedEmail = `anonymized_${att.id.slice(0, 8)}@erased.urpass.space`;
        const { error: scrubErr } = await admin
          .from("attendees")
          .update({
            name: "Anonymized Attendee",
            email: redactedEmail,
            phone: null,
            custom_responses: { _gdpr_erased_at: new Date().toISOString() },
          })
          .eq("id", att.id);

        if (!scrubErr) {
          recordsScrubbed++;
        }
      }
    }

    // 2. Scrub Ticket Orders PII (preserve financial ledger & order id for statutory tax audit)
    let orderQuery = admin
      .from("ticket_orders")
      .select("id")
      .ilike("buyer_email", normalizedEmail);

    if (params.eventId) {
      orderQuery = orderQuery.eq("event_id", params.eventId);
    }

    const { data: ordersToScrub } = await orderQuery;
    if (ordersToScrub && ordersToScrub.length > 0) {
      for (const ord of ordersToScrub) {
        const { error: ordScrubErr } = await admin
          .from("ticket_orders")
          .update({
            buyer_name: "Anonymized Buyer",
            buyer_email: `anonymized_${ord.id.slice(0, 8)}@erased.urpass.space`,
            group_members: [],
          })
          .eq("id", ord.id);

        if (!ordScrubErr) {
          recordsScrubbed++;
        }
      }
    }

    // 3. Update privacy_erasure_requests record if reference provided
    if (params.referenceId) {
      await admin
        .from("privacy_erasure_requests")
        .update({
          status: "COMPLETED",
          records_scrubbed: recordsScrubbed,
          completed_at: new Date().toISOString(),
        })
        .eq("reference_id", params.referenceId);
    } else {
      await admin
        .from("privacy_erasure_requests")
        .update({
          status: "COMPLETED",
          records_scrubbed: recordsScrubbed,
          completed_at: new Date().toISOString(),
        })
        .ilike("email", normalizedEmail)
        .eq("status", "PENDING");
    }

    return {
      success: true,
      recordsScrubbed,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, recordsScrubbed, error: msg };
  }
}
