import fs from "fs";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const url = env["NEXT_PUBLIC_SUPABASE_URL"] || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = env["SUPABASE_SERVICE_ROLE_KEY"] || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

async function setup() {
  const userId = "87cfb6f8-1d43-4baa-9b8b-8b4c0fb7a19a";
  const userEmail = "srinithinoffl@gmail.com";

  console.log(`Setting up sample event for organizer: ${userEmail} (${userId})`);

  // 1. Ensure Profile
  const { error: profileErr } = await supabase.from("profiles").upsert({
    id: userId,
    user_id: userId,
    email: userEmail,
    full_name: "Srinithin",
    company_name: "Company 5th Anniversary Team",
    created_at: new Date().toISOString(),
  });
  if (profileErr) console.warn("Profile warning:", profileErr.message);

  // 2. Event Lookup or Insertion
  let { data: existingEvent } = await supabase
    .from("events")
    .select("id, name, apply_slug")
    .eq("organizer_id", userId)
    .eq("name", "Company 5th Anniversary Celebration")
    .maybeSingle();

  let eventId = existingEvent?.id;
  const applySlug = existingEvent?.apply_slug || "company-5th-anniversary-celebration";

  const eventPayload = {
    organizer_id: userId,
    name: "Company 5th Anniversary Celebration",
    description: "Corporate anniversary celebration — Free entry with maximum venue capacity of 300 guests. Digital single and group passes with live attendance tracking.",
    event_date: "2026-11-24",
    start_time: "18:00",
    end_time: "22:00",
    venue: "Grand Ballroom, The Leela Palace, Bengaluru",
    attendee_limit: 300,
    status: "active",
    is_paid_event: false,
    ticket_price: 0,
    application_enabled: true,
    apply_slug: applySlug,
    auto_approve: true,
    whatsapp_enabled: true,
    email_enabled: true,
    custom_pass_design: {
      primaryColor: "#7C3AED",
      accentColor: "#6D28D9",
      template: "corporate",
      _featureFlags: {
        features: {
          group_entry: true,
          offline_scanning: true,
          advanced_analytics: true,
          bulk_ticket_booking: true,
          ticket_distribution: true,
        },
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      _groupEntryConfig: {
        partial_entry: true,
        entry_quantity_selection: "gate_staff",
        group_entry_mode: "count_only",
        max_group_size: "100",
        re_entry: "disabled",
        session_attendance: "identified_required",
        entry_corrections: "supervisor_only",
        offline_group_entry: true,
        gate_restrictions: "all",
      },
      _moduleConfigs: {
        group_entry: {
          partial_entry: true,
          entry_quantity_selection: "gate_staff",
          group_entry_mode: "count_only",
          max_group_size: "100",
          re_entry: "disabled",
          offline_group_entry: true,
          gate_restrictions: "all",
        },
        offline_scanning: {
          auto_sync_on_reconnect: true,
          conflict_rule: "earliest_server",
        },
        advanced_analytics: {
          telemetry_interval_sec: "15",
          include_demographics: true,
        },
      },
    },
  };

  if (!eventId) {
    const { data: newEvent, error: evErr } = await supabase
      .from("events")
      .insert(eventPayload)
      .select("id, name, apply_slug")
      .single();

    if (evErr) {
      console.error("Error creating event:", evErr);
      return;
    }
    eventId = newEvent.id;
    console.log("Event created successfully:", newEvent);
  } else {
    await supabase.from("events").update(eventPayload).eq("id", eventId);
    console.log("Event configuration updated:", eventId);
  }

  // 3. Ticket Types (Pass Categories)
  const ticketTiers = [
    {
      event_id: eventId,
      name: "Individual pass",
      description: "Admit once; reject later scans.",
      category: "general",
      price: 0,
      capacity: 100,
      is_group_pass: false,
      included_guests: 1,
      min_guests: 1,
      max_guests: 1,
      status: "on_sale",
      position: 1,
    },
    {
      event_id: eventId,
      name: "Group pass – small",
      description: "Recipient + 1 guest. Allow up to 2 successful entries.",
      category: "general",
      price: 0,
      capacity: 30,
      is_group_pass: true,
      included_guests: 2,
      min_guests: 2,
      max_guests: 2,
      status: "on_sale",
      position: 2,
    },
    {
      event_id: eventId,
      name: "Group pass – medium",
      description: "Family / small group. Allow up to 5 successful entries.",
      category: "general",
      price: 0,
      capacity: 20,
      is_group_pass: true,
      included_guests: 5,
      min_guests: 5,
      max_guests: 5,
      status: "on_sale",
      position: 3,
    },
    {
      event_id: eventId,
      name: "Group pass – large",
      description: "Larger family / group. Allow up to 10 successful entries.",
      category: "vip",
      price: 0,
      capacity: 10,
      is_group_pass: true,
      included_guests: 10,
      min_guests: 10,
      max_guests: 10,
      status: "on_sale",
      position: 4,
    },
  ];

  await supabase.from("ticket_types").delete().eq("event_id", eventId);
  const { data: createdTiers, error: tierErr } = await supabase
    .from("ticket_types")
    .insert(ticketTiers)
    .select("id, name, is_group_pass, included_guests");

  if (tierErr) {
    console.error("Error creating ticket types:", tierErr);
    return;
  }
  console.log("4 Pass tiers configured:", createdTiers.map((t) => `${t.name} (Entitlement: ${t.included_guests})`));

  const tierMap: Record<string, { id: string; included_guests: number }> = {};
  createdTiers.forEach((t) => {
    tierMap[t.name] = t;
  });

  // 4. Sample Guest Roster & Issued Digital Passes (From Section 3 of Document)
  const sampleGuests = [
    {
      name: "Guest A",
      phone: "+919876543201",
      email: "guest.a@example.com",
      tierName: "Individual pass",
      limit: 1,
    },
    {
      name: "Guest B",
      phone: "+919876543202",
      email: "guest.b@example.com",
      tierName: "Group pass – medium",
      limit: 5,
    },
    {
      name: "Guest C",
      phone: "+919876543203",
      email: "guest.c@example.com",
      tierName: "Group pass – large",
      limit: 10,
    },
    {
      name: "Guest D",
      phone: "+919876543204",
      email: "guest.d@example.com",
      tierName: "Group pass – small",
      limit: 2,
    },
  ];

  // Clean old sample passes if re-running
  await supabase.from("passes").delete().eq("event_id", eventId);
  await supabase.from("attendees").delete().eq("event_id", eventId);

  const guestSummary: Array<{
    name: string;
    phone: string;
    passType: string;
    entryLimit: number;
    passToken: string;
    ticketUrl: string;
    ticketId: string;
  }> = [];

  for (const g of sampleGuests) {
    const tier = tierMap[g.tierName];
    const { data: att, error: attErr } = await supabase
      .from("attendees")
      .insert({
        event_id: eventId,
        name: g.name,
        phone: g.phone,
        email: g.email,
        pass_type: g.tierName,
        ticket_type_id: tier?.id,
        application_status: "approved",
        pass_status: "generated",
        custom_responses: {
          group_attendee_count: g.limit,
          is_single_group_qr: g.limit > 1,
        },
      })
      .select("id")
      .single();

    if (attErr || !att) {
      console.error("Attendee insert error:", g.name, attErr);
      continue;
    }

    const passToken = "tok_" + crypto.randomBytes(8).toString("hex");
    const isGroup = g.limit > 1;
    const ticketId = `URP-${passToken.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;

    const { data: pass, error: passErr } = await supabase
      .from("passes")
      .insert({
        event_id: eventId,
        attendee_id: att.id,
        ticket_type_id: tier?.id,
        pass_type: g.tierName,
        pass_token: passToken,
        status: "active",
        total_guests: g.limit,
        checked_in_guests: 0,
        is_group_pass: isGroup,
        is_group_master: isGroup,
        group_booking_reference: isGroup ? "GRP-" + passToken.substring(4, 10).toUpperCase() : null,
      })
      .select("id, pass_token")
      .single();

    if (passErr || !pass) {
      console.error("Pass insert error:", g.name, passErr);
    } else {
      const ticketUrl = `https://urpass.space/pass/${passToken}`;
      guestSummary.push({
        name: g.name,
        phone: g.phone,
        passType: g.tierName,
        entryLimit: g.limit,
        passToken: pass.pass_token,
        ticketUrl,
        ticketId,
      });
      console.log(`✅ ${g.name}: ${g.tierName} (${g.limit} entries) -> Pass URL: ${ticketUrl}`);
    }
  }

  console.log("\n=======================================================");
  console.log("🎉 ANNIVERSARY EVENT CONFIGURATION COMPLETE!");
  console.log(`Event ID: ${eventId}`);
  console.log(`Event Name: Company 5th Anniversary Celebration`);
  console.log(`Organizer: ${userEmail}`);
  console.log(`Capacity Limit: 300 guests`);
  console.log(`Public Page: https://urpass.space/event/${applySlug}`);
  console.log(`Organizer Settings: https://urpass.space/event/${eventId}/settings`);
  console.log(`Gate Scanner URL: https://urpass.space/scan/${eventId}`);
  console.log(`Live Dashboard URL: https://urpass.space/event/${eventId}/dashboard`);
  console.log(`Communications URL: https://urpass.space/event/${eventId}/communications`);
  console.log("=======================================================\n");
}

setup().catch((e) => console.error("Setup execution error:", e));
