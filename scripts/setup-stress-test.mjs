import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function loadEnv() {
  for (const envFile of [".env", ".env.local"]) {
    const fullPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function setup() {
  console.log("=== URPASS 5,000 ATTENDEE STRESS TEST SETUP ===");
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  // 1. Fetch an organizer user ID to own the event
  const { data: users, error: userErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (userErr || !users.users?.length) {
    console.error("Failed to fetch organizer user:", userErr);
    process.exit(1);
  }
  const organizerId = users.users[0].id;
  console.log(`Using organizer ID: ${organizerId} (${users.users[0].email})`);

  // 2. Find or create dedicated test event
  let { data: event } = await admin
    .from("events")
    .select("id, name, attendee_limit, status, application_enabled, auto_approve")
    .eq("name", "[STRESS-TEST] 5,000 Attendee Event")
    .maybeSingle();

  if (!event) {
    console.log("Creating dedicated [STRESS-TEST] 5,000 Attendee Event...");
    const { data: newEvent, error: createErr } = await admin
      .from("events")
      .insert({
        name: "[STRESS-TEST] 5,000 Attendee Event",
        organizer_id: organizerId,
        attendee_limit: 5000,
        status: "active",
        application_enabled: true,
        auto_approve: true,
        event_date: "2026-12-31",
        start_time: "10:00:00",
        end_time: "20:00:00",
        apply_slug: "stress-test-5000",
        venue: "Virtual Staging Arena",
        description: "Automated high-concurrency stress test event.",
        is_paid_event: false,
        ticket_price: 0,
      })
      .select("id, name, attendee_limit, status, application_enabled, auto_approve")
      .single();

    if (createErr || !newEvent) {
      console.error("Failed to create test event:", createErr);
      process.exit(1);
    }
    event = newEvent;
  } else {
    // Ensure capacity is strictly 5000 and status is active
    await admin
      .from("events")
      .update({
        attendee_limit: 5000,
        status: "active",
        application_enabled: true,
        auto_approve: true,
      })
      .eq("id", event.id);
  }

  console.log(`Verified Event ID: ${event.id}`);
  console.log(`Verified Event Name: ${event.name}`);
  console.log(`Verified Event Capacity: ${event.attendee_limit}`);

  // 3. Ensure General Admission ticket type exists with capacity 5000
  let { data: ticketType } = await admin
    .from("ticket_types")
    .select("id, name, capacity, price, status")
    .eq("event_id", event.id)
    .maybeSingle();

  if (!ticketType) {
    console.log("Creating default ticket type (General Admission)...");
    const { data: newTt, error: ttErr } = await admin
      .from("ticket_types")
      .insert({
        event_id: event.id,
        name: "General Admission",
        price: 0,
        capacity: 5000,
        status: "on_sale",
        sales_start: new Date(Date.now() - 3600000).toISOString(),
        sales_end: new Date(Date.now() + 86400000 * 30).toISOString(),
      })
      .select("id, name, capacity, price, status")
      .single();

    if (ttErr) {
      console.error("Failed to create ticket type:", ttErr);
      process.exit(1);
    }
    ticketType = newTt;
  } else {
    await admin
      .from("ticket_types")
      .update({
        capacity: 5000,
        status: "on_sale",
        price: 0,
        sales_start: new Date(Date.now() - 3600000).toISOString(),
        sales_end: new Date(Date.now() + 86400000 * 30).toISOString(),
      })
      .eq("id", ticketType.id);
  }

  console.log(`Verified Ticket Type ID: ${ticketType.id}`);

  // 4. Clean up any previous test attendees
  console.log("Cleaning up previous test attendees...");
  const { data: oldAttendees } = await admin
    .from("attendees")
    .select("id")
    .eq("event_id", event.id);

  if (oldAttendees && oldAttendees.length > 0) {
    const attendeeIds = oldAttendees.map((a) => a.id);
    await admin.from("check_ins").delete().in("attendee_id", attendeeIds);
    await admin.from("passes").delete().in("attendee_id", attendeeIds);
    await admin.from("attendees").delete().eq("event_id", event.id);
    console.log(`Cleaned up ${oldAttendees.length} previous test attendees.`);
  }

  // 5. Output config file for the stress test runner
  const config = {
    BASE_URL: "http://localhost:3000",
    TEST_EVENT_ID: event.id,
    TICKET_TYPE_ID: ticketType.id,
    CAPACITY: 5000,
    SERVICE_KEY: "***",
  };

  console.log("\nSetup Complete. Configuration:");
  console.log(JSON.stringify(config, null, 2));

  return config;
}

setup().catch((err) => {
  console.error("Setup error:", err);
  process.exit(1);
});
