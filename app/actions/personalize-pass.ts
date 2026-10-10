"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function claimPlaceholderPassAction({
  passToken,
  name,
  email,
  phone,
}: {
  passToken: string;
  name: string;
  email: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!passToken || !name?.trim() || !email?.trim()) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      message: "Attendee name and email are required to personalize this ticket.",
    };
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone?.trim() || null;

  const admin = adminClient();

  // 1. Fetch pass by passToken
  const { data: pass, error: passErr } = await admin
    .from("passes")
    .select("id, pass_token, attendee_id, event_id")
    .eq("pass_token", passToken)
    .single();

  if (passErr || !pass) {
    return {
      success: false,
      error: "PASS_NOT_FOUND",
      message: "Pass not found.",
    };
  }

  // 2. Fetch attendee record
  const { data: attendee, error: attErr } = await admin
    .from("attendees")
    .select("id, name, email, custom_responses")
    .eq("id", pass.attendee_id)
    .single();

  if (attErr || !attendee) {
    return {
      success: false,
      error: "ATTENDEE_NOT_FOUND",
      message: "Attendee record not found.",
    };
  }

  // 3. Update attendee record with recipient's actual identity
  const customResponses = (attendee.custom_responses as Record<string, unknown>) || {};
  const { error: updateErr } = await admin
    .from("attendees")
    .update({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      custom_responses: {
        ...customResponses,
        personalized_at: new Date().toISOString(),
      },
    })
    .eq("id", attendee.id);

  if (updateErr) {
    return {
      success: false,
      error: "UPDATE_FAILED",
      message: updateErr.message,
    };
  }

  // 4. Update parent attendee's group_members array if parent_attendee_id exists
  if (customResponses.parent_attendee_id) {
    try {
      const { data: parent } = await admin
        .from("attendees")
        .select("id, custom_responses")
        .eq("id", customResponses.parent_attendee_id)
        .single();

      if (parent && Array.isArray((parent.custom_responses as Record<string, unknown>)?.group_members)) {
        const parentResp = parent.custom_responses as Record<string, unknown>;
        const gMembers = [...(parentResp.group_members as Array<Record<string, unknown>>)];
        const idx = gMembers.findIndex((m) => m.passToken === passToken || m.attendeeId === attendee.id);

        if (idx !== -1) {
          gMembers[idx] = {
            ...gMembers[idx],
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
          };

          await admin
            .from("attendees")
            .update({
              custom_responses: {
                ...parentResp,
                group_members: gMembers,
              },
            })
            .eq("id", parent.id);
        }
      }
    } catch {
      // Non-blocking
    }
  }

  // 5. Fire ticket communication to recipient
  try {
    const { communicationService } = await import("@/lib/communications");
    const { data: event } = await admin
      .from("events")
      .select("name, event_date, venue")
      .eq("id", pass.event_id)
      .single();

    communicationService
      .sendTicketCommunications({
        eventId: pass.event_id,
        eventName: event?.name || "Event Pass",
        ticketId: `PASS-${passToken.slice(0, 6).toUpperCase()}`,
        passToken,
        attendeeId: attendee.id,
        attendeeName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        ticketUrl: `https://urpass.space/pass/${passToken}`,
        version: `personalize_${Date.now()}`,
      })
      .catch(() => {});
  } catch {
    // Non-blocking
  }

  revalidatePath(`/pass/${passToken}`);
  return { success: true, message: "Ticket personalized successfully." };
}
