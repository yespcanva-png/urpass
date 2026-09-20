import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendEventReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function adminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  // Check authorization via secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = adminClient();

  // Find events happening tomorrow (within 20 to 28 hours from now)
  const now = new Date();
  const tomorrowDateStr = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: events, error: evError } = await supabase
    .from("events")
    .select("id, name, event_date, start_time, venue, event_type, meeting_url, status")
    .eq("status", "active")
    .gte("event_date", tomorrowDateStr)
    .lte("event_date", tomorrowDateStr);

  if (evError) {
    return NextResponse.json({ error: evError.message }, { status: 500 });
  }

  let totalEventsProcessed = 0;
  let totalEmailsSent = 0;

  for (const event of events ?? []) {
    // Check if reminder was already sent for this event
    const { data: existing } = await supabase
      .from("event_communications")
      .select("id")
      .eq("event_id", event.id)
      .eq("type", "reminder_24h")
      .maybeSingle();

    if (existing) continue; // Already sent, skip

    // Fetch approved attendees
    const { data: attendees } = await supabase
      .from("attendees")
      .select("id, name, email, passes(pass_token)")
      .eq("event_id", event.id)
      .eq("application_status", "approved");

    if (!attendees || attendees.length === 0) continue;

    let eventSentCount = 0;
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
        eventSentCount++;
        totalEmailsSent++;
      } catch (err) {
        console.error(`[cron/reminders] Error sending to ${att.email}:`, err);
      }
    }

    if (eventSentCount > 0) {
      await supabase.from("event_communications").insert({
        event_id: event.id,
        type: "reminder_24h",
        subject: `Reminder: ${event.name} is coming up soon!`,
        recipient_count: eventSentCount,
      });
      totalEventsProcessed++;
    }
  }

  return NextResponse.json({
    success: true,
    processedEvents: totalEventsProcessed,
    totalSent: totalEmailsSent,
    timestamp: new Date().toISOString(),
  });
}
