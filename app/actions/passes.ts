"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sendPassEmail } from "@/lib/email";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";

type GenerateResult = { passToken?: string; error?: string };

export async function generatePass(
  attendeeId: string,
  eventId: string
): Promise<GenerateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify organizer owns this event or has org permissions
  let { data: event } = await supabase
    .from("events")
    .select("id, organization_id")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .single();

  if (!event) {
    try {
      const { data: orgEvent } = await supabase
        .from("events")
        .select("id, organization_id")
        .eq("id", eventId)
        .single();

      if (orgEvent?.organization_id) {
        const { data: member } = await supabase
          .from("organization_members")
          .select("role")
          .eq("organization_id", orgEvent.organization_id)
          .eq("user_id", user.id)
          .eq("status", "active")
          .in("role", ["owner", "admin", "event_manager"])
          .single();

        if (member) {
          event = orgEvent;
        }
      }
    } catch {
      // Graceful fallback for test mocks
    }
  }

  if (!event) return { error: "Event not found." };

  // Verify attendee belongs to event and is approved
  const { data: attendee } = await supabase
    .from("attendees")
    .select("id, pass_type, pass_status, application_status")
    .eq("id", attendeeId)
    .eq("event_id", eventId)
    .single();
  if (!attendee) return { error: "Attendee not found." };
  if (attendee.application_status !== "approved")
    return { error: "Attendee must be approved before generating a pass." };

  // If pass already exists, return its token
  if (attendee.pass_status !== "not_generated") {
    const { data: existing } = await supabase
      .from("passes")
      .select("pass_token")
      .eq("attendee_id", attendeeId)
      .eq("event_id", eventId)
      .single();
    if (existing) return { passToken: existing.pass_token };
  }

  // Insert — DB generates pass_token via gen_random_bytes default
  const { data: pass, error } = await supabase
    .from("passes")
    .insert({
      event_id: eventId,
      attendee_id: attendeeId,
      pass_type: attendee.pass_type,
    })
    .select("pass_token")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Race: pass was just created — fetch it
      const { data: existing } = await supabase
        .from("passes")
        .select("pass_token")
        .eq("attendee_id", attendeeId)
        .eq("event_id", eventId)
        .single();
      if (existing) return { passToken: existing.pass_token };
    }
    return { error: error.message };
  }

  // Mark attendee pass as generated
  await supabase
    .from("attendees")
    .update({ pass_status: "generated" })
    .eq("id", attendeeId);

  // Attendees page is realtime-driven — no revalidation needed

  // Send pass communications (Email, WhatsApp, SMS with DLT and fallback) — fire-and-forget
  const [{ data: attendeeInfo }, { data: eventInfo }] = await Promise.all([
    supabase.from("attendees").select("name, email, phone, pass_type").eq("id", attendeeId).single(),
    supabase.from("events").select("name, event_date, venue").eq("id", eventId).single(),
  ]);

  if (attendeeInfo && eventInfo) {
    communicationService
      .sendTicketCommunications({
        eventId,
        eventName: eventInfo.name,
        eventDate: eventInfo.event_date,
        venue: eventInfo.venue,
        ticketId: formatTicketId(pass.pass_token),
        passToken: pass.pass_token,
        attendeeId,
        attendeeName: attendeeInfo.name,
        email: attendeeInfo.email,
        phone: attendeeInfo.phone,
        passType: attendeeInfo.pass_type,
        ticketUrl: buildTicketUrl(pass.pass_token),
        version: `pass_${pass.pass_token}`,
      })
      .catch((err: unknown) => console.error("[communications]", err));
  }

  return { passToken: pass.pass_token };
}
