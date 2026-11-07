import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { getFromEmail, isEmailProviderConfigured, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
type Db = ReturnType<typeof adminClient>;
type EventRow = { id: string; name: string; status: string };
type Journey = "setup_24h" | "draft_recovery" | "workflow_3d" | "published_share" | "reactivation_14d";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

async function recipientFor(db: Db, userId: string): Promise<string | null> {
  const { data: auth, error: authError } = await db.auth.admin.getUserById(userId);
  if (authError || auth.user?.user_metadata?.lifecycle_reminders_opt_in !== true) return null;
  const { data: preference, error } = await db.from("email_preferences")
    .select("email, lifecycle_reminders").eq("user_id", userId).maybeSingle();
  if (error) return null;
  if (preference && !preference.lifecycle_reminders) return null;
  return auth.user.email || null;
}

async function eventsFor(db: Db, userId: string): Promise<EventRow[] | null> {
  const { data, error } = await db.from("events")
    .select("id, name, status").eq("organizer_id", userId).order("created_at", { ascending: true });
  return error ? null : (data || []) as EventRow[];
}

function eligible(journey: Journey, events: EventRow[], draftId?: string) {
  if (journey === "draft_recovery") return events.length === 1 && events[0].id === draftId && events[0].status === "draft";
  if (journey === "published_share") return events.some((event) => event.id === draftId && event.status === "active");
  return events.length === 0;
}

function message(journey: Journey, event?: EventRow) {
  const preferences = '<p style="font-size:12px;color:#666">Manage these messages in <a href="https://urpass.space/dashboard/settings/email">email preferences</a>.</p>';
  if (journey === "draft_recovery" && event) return {
    subject: `Finish setting up ${event.name.replace(/[\r\n]/g, " ").slice(0, 100)}`,
    html: `<p>Your event draft, <strong>${escapeHtml(event.name)}</strong>, is ready to finish. Add the remaining details and publish when you are ready.</p><p><a href="https://urpass.space/event/${encodeURIComponent(event.id)}/settings">Resume your event</a></p>${preferences}`,
  };
  if (journey === "workflow_3d") return {
    subject: "See how UrPass registration and QR entry work",
    html: `<p>Create an event, share its registration link, then scan each attendee's QR pass at the gate. You can start with a free RSVP event.</p><p><a href="https://urpass.space/create-event">Create your first event</a></p>${preferences}`,
  };
  if (journey === "published_share" && event) return {
    subject: `${event.name.replace(/[\r\n]/g, " ").slice(0, 100)} is live — share your registration link`,
    html: `<p><strong>${escapeHtml(event.name)}</strong> is live. Share your registration page and invite your first attendees.</p><p><a href="https://urpass.space/apply/${encodeURIComponent(event.id)}">Open registration</a></p>${preferences}`,
  };
  if (journey === "reactivation_14d") return {
    subject: "Your UrPass event can start whenever you are ready",
    html: `<p>Still planning an event? Create your first free RSVP event, share its link, and issue QR passes when attendees register.</p><p><a href="https://urpass.space/create-event">Create an event</a></p>${preferences}`,
  };
  return {
    subject: "Need a hand setting up your first UrPass event?",
    html: `<p>Ready to publish your first event? Add your event details, preview registration, and share your link.</p><p><a href="https://urpass.space/create-event">Continue creating your event</a></p>${preferences}`,
  };
}

async function sendOnce(db: Db, userId: string, journey: Journey, event?: EventRow): Promise<boolean> {
  const email = await recipientFor(db, userId);
  if (!email) return false;
  const messageKey = event ? `${journey}:${event.id}` : journey;
  const { error: claimError } = await db.from("sales_lifecycle_dispatches")
    .insert({ user_id: userId, message_key: messageKey });
  if (claimError) return false;
  let providerAccepted = false;
  try {
    const latestEvents = await eventsFor(db, userId);
    const latestEmail = await recipientFor(db, userId);
    if (!latestEvents || !eligible(journey, latestEvents, event?.id) || latestEmail !== email) {
      await db.from("sales_lifecycle_dispatches").delete().eq("user_id", userId).eq("message_key", messageKey);
      return false;
    }
    const content = message(journey, event);
    const result = await sendEmail({ from: getFromEmail(), to: email, subject: content.subject, html: content.html });
    if (!result) throw new Error("Email provider did not confirm dispatch");
    providerAccepted = true;
    const { error: updateError } = await db.from("sales_lifecycle_dispatches")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("user_id", userId).eq("message_key", messageKey);
    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error("[sales-lifecycle] send failed", { journey, userId, error });
    // Keep a provider-confirmed claim: retrying could duplicate the email.
    if (!providerAccepted) await db.from("sales_lifecycle_dispatches").delete().eq("user_id", userId).eq("message_key", messageKey);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.SALES_LIFECYCLE_EMAIL_ENABLED !== "true" || !isEmailProviderConfigured()) {
    return NextResponse.json({ enabled: false, sent: 0 });
  }
  const db = adminClient();
  const now = Date.now();
  let sent = 0;
  let scanned = 0;
  const windows: { journey: Journey; minimumHours: number; maximumHours: number }[] = [
    { journey: "setup_24h", minimumHours: 24, maximumHours: 72 },
    { journey: "workflow_3d", minimumHours: 72, maximumHours: 120 },
    { journey: "reactivation_14d", minimumHours: 336, maximumHours: 384 },
  ];
  for (const window of windows) {
    const { data: signups, error } = await db.from("conversion_events")
      .select("user_id").eq("event_name", "signup_completed")
      .gte("created_at", new Date(now - window.maximumHours * 60 * 60 * 1000).toISOString())
      .lte("created_at", new Date(now - window.minimumHours * 60 * 60 * 1000).toISOString())
      .not("user_id", "is", null).order("created_at", { ascending: false }).limit(100);
    if (error) return NextResponse.json({ error: "Could not read signups" }, { status: 503 });
    for (const signup of signups || []) {
      const userId = signup.user_id as string;
      scanned++;
      const events = await eventsFor(db, userId);
      if (!events) continue;
      if (events.length === 0) {
        if (await sendOnce(db, userId, window.journey)) sent++;
      } else if (window.journey === "setup_24h" && events.length === 1 && events[0].status === "draft") {
        if (await sendOnce(db, userId, "draft_recovery", events[0])) sent++;
      }
    }
  }
  const { data: published, error: publishError } = await db.from("conversion_events")
    .select("user_id, metadata").eq("event_name", "first_event_published")
    .gte("created_at", new Date(now - 72 * 60 * 60 * 1000).toISOString())
    .lte("created_at", new Date(now - 60 * 60 * 1000).toISOString())
    .not("user_id", "is", null).order("created_at", { ascending: false }).limit(100);
  if (publishError) return NextResponse.json({ error: "Could not read published events" }, { status: 503 });
  for (const item of published || []) {
    scanned++;
    const userId = item.user_id as string;
    const eventId = (item.metadata as Record<string, unknown> | null)?.event_id;
    if (typeof eventId !== "string") continue;
    const events = await eventsFor(db, userId);
    const event = events?.find((row) => row.id === eventId && row.status === "active");
    if (event && await sendOnce(db, userId, "published_share", event)) sent++;
  }
  return NextResponse.json({ enabled: true, scanned, sent });
}
