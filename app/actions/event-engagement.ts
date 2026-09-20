"use server";

import { createClient } from "@/lib/supabase/server";
import {
  sendEventReminderEmail,
  sendPostEventThankYouEmail,
} from "@/lib/email";
import { createOrganizerNotification } from "./in-app-notifications";
import { revalidatePath } from "next/cache";

export interface CommunicationLog {
  id: string;
  event_id: string;
  type: string;
  subject: string;
  recipient_count: number;
  sent_at: string;
}

async function verifyEventOrganizer(supabase: Awaited<ReturnType<typeof createClient>>, eventId: string, userId: string) {
  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, start_time, venue, event_type, meeting_url, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) return null;
  if (event.organizer_id === userId) return event;

  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .single();
    if (member) return event;
  }

  return null;
}

export async function broadcastEventReminders(eventId: string): Promise<{
  success?: boolean;
  count?: number;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const event = await verifyEventOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found or insufficient permissions" };

  // Fetch all approved attendees with their pass tokens
  const { data: attendees, error: attError } = await supabase
    .from("attendees")
    .select("id, name, email, passes(pass_token)")
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if (attError || !attendees || attendees.length === 0) {
    return { error: "No approved attendees found to send reminders to." };
  }

  let sentCount = 0;
  const isOnline = event.event_type === "online" || event.event_type === "hybrid";

  for (const att of attendees) {
    const passList = att.passes as Array<{ pass_token: string }> | null;
    const passToken = passList && passList.length > 0 ? passList[0].pass_token : null;
    if (!passToken || !att.email) continue;

    try {
      await sendEventReminderEmail({
        to: att.email,
        attendeeName: att.name,
        eventName: event.name,
        eventDate: event.event_date,
        startTime: event.start_time,
        venue: event.venue,
        passToken,
        isOnline,
      });
      sentCount++;
    } catch (err) {
      console.error(`Failed to send reminder to ${att.email}:`, err);
    }
  }

  // Record communication log
  await supabase.from("event_communications").insert({
    event_id: eventId,
    type: "reminder_24h",
    subject: `Reminder: ${event.name} is coming up soon!`,
    recipient_count: sentCount,
    sent_by: user.id,
  });

  // Notify organizer
  await createOrganizerNotification({
    userId: user.id,
    eventId,
    title: "Event Reminders Sent",
    message: `Successfully dispatched reminder emails to ${sentCount} attendees for "${event.name}".`,
    type: "milestone",
    link: `/event/${eventId}`,
  });

  revalidatePath(`/event/${eventId}`);
  return { success: true, count: sentCount };
}

export async function broadcastPostEventThankYou(eventId: string): Promise<{
  success?: boolean;
  count?: number;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const event = await verifyEventOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found or insufficient permissions" };

  // Prioritize attendees who checked in; if none checked in, send to all approved
  const { data: checkedInAttendees } = await supabase
    .from("attendees")
    .select("id, name, email")
    .eq("event_id", eventId)
    .eq("pass_status", "checked_in");

  let targetAttendees = checkedInAttendees ?? [];
  if (targetAttendees.length === 0) {
    const { data: allApproved } = await supabase
      .from("attendees")
      .select("id, name, email")
      .eq("event_id", eventId)
      .eq("application_status", "approved");
    targetAttendees = allApproved ?? [];
  }

  if (targetAttendees.length === 0) {
    return { error: "No attendees found to send thank you emails to." };
  }

  let sentCount = 0;
  for (const att of targetAttendees) {
    if (!att.email) continue;
    try {
      await sendPostEventThankYouEmail({
        to: att.email,
        attendeeName: att.name,
        eventName: event.name,
        eventId,
      });
      sentCount++;
    } catch (err) {
      console.error(`Failed to send thank you to ${att.email}:`, err);
    }
  }

  // Record communication log
  await supabase.from("event_communications").insert({
    event_id: eventId,
    type: "thank_you_post_event",
    subject: `Thank you for attending ${event.name}!`,
    recipient_count: sentCount,
    sent_by: user.id,
  });

  // Notify organizer
  await createOrganizerNotification({
    userId: user.id,
    eventId,
    title: "Thank-You Emails Sent",
    message: `Thank you & feedback emails were sent to ${sentCount} attendees for "${event.name}".`,
    type: "milestone",
    link: `/event/${eventId}`,
  });

  revalidatePath(`/event/${eventId}`);
  return { success: true, count: sentCount };
}

export async function getEventCommunications(eventId: string): Promise<CommunicationLog[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_communications")
    .select("id, event_id, type, subject, recipient_count, sent_at")
    .eq("event_id", eventId)
    .order("sent_at", { ascending: false });

  return (data ?? []) as CommunicationLog[];
}
