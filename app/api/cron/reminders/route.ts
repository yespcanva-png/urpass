import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendEventReminderEmail, sendTrialReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function adminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const TRIAL_PLAN_PRICES_PAISE: Record<string, number> = {
  starter: 49900,
  pro: 99900,
  business: 249900,
};

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

  // ── Process 30-Day Free Trial Reminders (7, 3, 1 day) ───────────
  let trialRemindersSent = 0;
  const { data: trialSubs } = await supabase
    .from("subscriptions")
    .select("id, user_id, trial_plan, trial_ends_at, is_trial, status, reminded_7_days, reminded_3_days, reminded_1_day, autopay_status, cancel_at_period_end, plan:plans(name, slug)")
    .eq("is_trial", true)
    .in("status", ["trialing", "active"])
    .not("trial_ends_at", "is", null);

  for (const sub of trialSubs ?? []) {
    if (!sub.trial_ends_at) continue;
    const endsAt = new Date(sub.trial_ends_at);
    const msRemaining = endsAt.getTime() - now.getTime();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    // If trial has expired and user cancelled AutoPay, mark expired
    if (msRemaining <= 0) {
      if (sub.cancel_at_period_end || sub.autopay_status === "cancelled") {
        await supabase
          .from("subscriptions")
          .update({ status: "expired", is_trial: false })
          .eq("id", sub.id);
      }
      continue;
    }

    // Determine if reminder is needed
    let reminderDaysToSend: number | null = null;
    let fieldToUpdate: "reminded_7_days" | "reminded_3_days" | "reminded_1_day" | null = null;

    if (daysRemaining <= 1 && !sub.reminded_1_day) {
      reminderDaysToSend = 1;
      fieldToUpdate = "reminded_1_day";
    } else if (daysRemaining <= 3 && !sub.reminded_3_days) {
      reminderDaysToSend = 3;
      fieldToUpdate = "reminded_3_days";
    } else if (daysRemaining <= 7 && !sub.reminded_7_days) {
      reminderDaysToSend = 7;
      fieldToUpdate = "reminded_7_days";
    }

    if (reminderDaysToSend !== null && fieldToUpdate !== null) {
      // Get user email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", sub.user_id)
        .maybeSingle();

      let targetEmail = profile?.email;
      let userName = profile?.full_name;

      if (!targetEmail) {
        const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id);
        targetEmail = authUser?.user?.email;
        userName = authUser?.user?.user_metadata?.full_name;
      }

      if (targetEmail) {
        const planSlug = sub.trial_plan || (sub.plan as unknown as { slug: string } | null)?.slug || "pro";
        const planName = (sub.plan as unknown as { name: string } | null)?.name || planSlug.toUpperCase();
        const pricePaise = TRIAL_PLAN_PRICES_PAISE[planSlug] ?? 99900;
        const formattedEndDate = endsAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        try {
          await sendTrialReminderEmail({
            to: targetEmail,
            userName,
            planName,
            daysRemaining: reminderDaysToSend,
            trialEndsAt: formattedEndDate,
            monthlyPricePaise: pricePaise,
          });

          await supabase
            .from("subscriptions")
            .update({ [fieldToUpdate]: true })
            .eq("id", sub.id);

          trialRemindersSent++;
        } catch (err) {
          console.error(`[cron/trial-reminders] Error sending reminder to ${targetEmail}:`, err);
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    processedEvents: totalEventsProcessed,
    totalSent: totalEmailsSent,
    trialRemindersSent,
    timestamp: new Date().toISOString(),
  });
}

