"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sendPassEmail } from "@/lib/email";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import { resolveNextTicketSequence, formatCustomTicketId } from "@/lib/tickets/custom-id";

type GenerateResult = { passToken?: string; error?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyPassOrganizer(supabase: any, user: { id: string }, eventId: string) {
  let { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .single();

  if (event) return event;

  try {
    const { data: orgEvent } = await supabase
      .from("events")
      .select("id, name, event_date, venue, organizer_id, organization_id, custom_pass_design")
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

      if (member) return orgEvent;
    }
  } catch {
    // Graceful fallback for test mocks
  }

  return null;
}

export async function generatePass(
  attendeeId: string,
  eventId: string
): Promise<GenerateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyPassOrganizer(supabase, user, eventId);
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
    supabase.from("attendees").select("name, email, phone, pass_type, custom_responses").eq("id", attendeeId).single(),
    supabase.from("events").select("name, event_date, venue, custom_pass_design").eq("id", eventId).single(),
  ]);

  let resolvedTicketId = formatTicketId(pass.pass_token);
  const ticketIdConfig = (eventInfo?.custom_pass_design || event?.custom_pass_design)?.ticketIdConfig;
  if (ticketIdConfig?.enabled) {
    const existingCustomId = attendeeInfo?.custom_responses?.custom_ticket_id;
    if (existingCustomId) {
      resolvedTicketId = existingCustomId;
    } else {
      const { customTicketId } = await resolveNextTicketSequence(
        supabase,
        eventId,
        ticketIdConfig,
        { passType: attendee.pass_type }
      );
      resolvedTicketId = customTicketId;
      // Persist custom_ticket_id to attendee record
      try {
        await supabase
          .from("attendees")
          .update({
            custom_responses: {
              ...(attendeeInfo?.custom_responses || {}),
              custom_ticket_id: customTicketId,
            },
          })
          .eq("id", attendeeId);
      } catch {
        // Non-blocking
      }
    }
  }

  if (attendeeInfo && eventInfo) {
    communicationService
      .sendTicketCommunications({
        eventId,
        eventName: eventInfo.name,
        eventDate: eventInfo.event_date,
        venue: eventInfo.venue,
        ticketId: resolvedTicketId,
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

export async function bulkGeneratePasses(
  eventId: string
): Promise<{ success: boolean; generated: number; tokens?: Record<string, string>; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyPassOrganizer(supabase, user, eventId);
  if (!event) {
    return { success: false, generated: 0, error: "Event not found or unauthorized." };
  }

  const { data: attendees, error: fetchErr } = await supabase
    .from("attendees")
    .select("id, name, email, phone, pass_type, custom_responses")
    .eq("event_id", eventId)
    .eq("application_status", "approved")
    .eq("pass_status", "not_generated");

  if (fetchErr) {
    return { success: false, generated: 0, error: fetchErr.message };
  }

  if (!attendees || attendees.length === 0) {
    return { success: true, generated: 0, tokens: {} };
  }

  const ticketIdConfig = event.custom_pass_design?.ticketIdConfig;
  let currentSeq = (ticketIdConfig?.startNumber || 1) + (ticketIdConfig?.continuationOffset || 0);
  if (ticketIdConfig?.enabled) {
    const { nextSequence } = await resolveNextTicketSequence(supabase, eventId, ticketIdConfig);
    currentSeq = nextSequence;
  }

  let generated = 0;
  const tokens: Record<string, string> = {};

  for (const att of attendees) {
    const { data: pass, error: insertError } = await supabase
      .from("passes")
      .insert({
        event_id: eventId,
        attendee_id: att.id,
        pass_type: att.pass_type,
      })
      .select("pass_token")
      .single();

    let passToken = pass?.pass_token;
    if (insertError) {
      if (insertError.code === "23505") {
        const { data: existing } = await supabase
          .from("passes")
          .select("pass_token")
          .eq("attendee_id", att.id)
          .eq("event_id", eventId)
          .single();
        passToken = existing?.pass_token;
      } else {
        continue;
      }
    }

    if (passToken) {
      let resolvedTicketId = formatTicketId(passToken);
      if (ticketIdConfig?.enabled) {
        resolvedTicketId = formatCustomTicketId(ticketIdConfig, currentSeq++, { passType: att.pass_type });
        try {
          await supabase
            .from("attendees")
            .update({
              pass_status: "generated",
              custom_responses: {
                ...(att.custom_responses || {}),
                custom_ticket_id: resolvedTicketId,
              },
            })
            .eq("id", att.id);
        } catch {
          await supabase
            .from("attendees")
            .update({ pass_status: "generated" })
            .eq("id", att.id);
        }
      } else {
        await supabase
          .from("attendees")
          .update({ pass_status: "generated" })
          .eq("id", att.id);
      }

      tokens[att.id] = passToken;
      generated++;

      communicationService
        .sendTicketCommunications({
          eventId,
          eventName: event.name,
          eventDate: event.event_date,
          venue: event.venue,
          ticketId: resolvedTicketId,
          passToken,
          attendeeId: att.id,
          attendeeName: att.name,
          email: att.email,
          phone: att.phone,
          passType: att.pass_type,
          ticketUrl: buildTicketUrl(passToken),
          version: `bulk_${passToken}`,
        })
        .catch((err: unknown) => console.error("[bulkGeneratePasses communications]", err));
    }
  }

  return { success: true, generated, tokens };
}

export async function bulkBroadcastPasses(
  eventId: string,
  target: "all_approved" | "unclaimed" = "all_approved",
  channel: "EMAIL" | "WHATSAPP" = "EMAIL"
): Promise<{ success: boolean; sent: number; failed: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyPassOrganizer(supabase, user, eventId);
  if (!event) {
    return { success: false, sent: 0, failed: 0, error: "Event not found or unauthorized." };
  }

  const { data: passes, error: passesErr } = await supabase
    .from("passes")
    .select("id, pass_token, pass_type, attendee:attendees!attendee_id(id, name, email, phone, pass_status, application_status)")
    .eq("event_id", eventId);

  if (passesErr) {
    return { success: false, sent: 0, failed: 0, error: passesErr.message };
  }

  if (!passes || passes.length === 0) {
    return { success: true, sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const p of passes) {
    const attendee = Array.isArray(p.attendee) ? p.attendee[0] : p.attendee;
    if (!attendee || attendee.application_status !== "approved") continue;

    if (target === "unclaimed" && attendee.pass_status === "checked_in") {
      continue;
    }

    const payload = {
      eventId,
      eventName: event.name,
      eventDate: event.event_date,
      venue: event.venue,
      ticketId: formatTicketId(p.pass_token),
      passToken: p.pass_token,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      passType: p.pass_type,
      ticketUrl: buildTicketUrl(p.pass_token),
      version: `broadcast_${Date.now()}`,
    };

    try {
      if (channel === "EMAIL") {
        const res = await communicationService.sendTicketEmail(payload);
        if (res.success) sent++;
        else failed++;
      } else if (channel === "WHATSAPP") {
        if (!attendee.phone) {
          failed++;
          continue;
        }
        const res = await communicationService.sendTicketWhatsApp(payload);
        if (res.success) sent++;
        else failed++;
      }
    } catch {
      failed++;
    }
  }

  return { success: true, sent, failed };
}
