import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

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

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("============================================================");
  console.log("DUPLICATE QR TORTURE TEST — 100 TICKETS × 10 GATES BARRAGE");
  console.log("Target: Exactly 100 admitted, 900 rejected as duplicate, 0 double admissions");
  console.log("============================================================");

  // 1. Create a dedicated event for this torture test to guarantee plenty of capacity
  const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  const organizerId = users.users[0].id;

  let { data: tortureEvent } = await admin
    .from("events")
    .select("id")
    .eq("name", "[TORTURE-TEST] Duplicate QR Event")
    .maybeSingle();

  if (!tortureEvent) {
    const { data: newEv } = await admin.from("events").insert({
      name: "[TORTURE-TEST] Duplicate QR Event",
      organizer_id: organizerId,
      attendee_limit: 1000,
      status: "active",
      application_enabled: true,
      auto_approve: true,
      event_date: "2026-12-31",
      start_time: "10:00:00",
      end_time: "20:00:00",
      apply_slug: "torture-qr-test",
      venue: "Torture Gate Arena",
      is_paid_event: false,
      ticket_price: 0,
    }).select("id").single();
    tortureEvent = newEv;
  }

  // Ensure default ticket type exists
  let { data: tt } = await admin
    .from("ticket_types")
    .select("id")
    .eq("event_id", tortureEvent.id)
    .maybeSingle();

  if (!tt) {
    const { data: newTt } = await admin.from("ticket_types").insert({
      event_id: tortureEvent.id,
      name: "Torture Tier",
      price: 0,
      capacity: 1000,
      status: "on_sale",
      sales_start: new Date(Date.now() - 3600000).toISOString(),
      sales_end: new Date(Date.now() + 86400000 * 30).toISOString(),
    }).select("id").single();
    tt = newTt;
  }

  // Clean old attendees
  const { data: oldAtt } = await admin.from("attendees").select("id").eq("event_id", tortureEvent.id);
  if (oldAtt?.length) {
    const ids = oldAtt.map(a => a.id);
    await admin.from("check_ins").delete().in("attendee_id", ids);
    await admin.from("passes").delete().in("attendee_id", ids);
    await admin.from("attendees").delete().eq("event_id", tortureEvent.id);
  }

  // 2. Generate 100 valid passes
  console.log("Generating 100 valid passes...");
  const passes = [];
  for (let i = 0; i < 100; i++) {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: tortureEvent.id,
        ticketTypeId: tt.id,
        name: `Torture Attendee ${i}`,
        email: `stress-torture-${Date.now()}-${i}@test.urpass.space`,
        phone: "+919876543210",
        pass_type: "participant",
      }),
    });
    const d = await res.json();
    if (d.passToken) {
      passes.push(d.passToken);
    }
  }

  console.log(`✓ Successfully generated ${passes.length} passes.`);
  if (passes.length !== 100) {
    throw new Error(`Failed to generate 100 passes, generated ${passes.length}`);
  }

  console.log("Launching simultaneous 10-gate scan barrage against each ticket...");
  let successfulAdmissions = 0;
  let duplicateRejected = 0;
  let doubleAdmissions = 0;
  let otherErrors = 0;

  for (let i = 0; i < passes.length; i++) {
    const token = passes[i];
    // 10 concurrent requests from 10 gates
    const scanPromises = Array.from({ length: 10 }, (_, gateIndex) => {
      const gateId = `gate-${gateIndex + 1}`;
      const scanOperationId = crypto.randomUUID();
      return fetch(`${BASE_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({
          eventId: tortureEvent.id,
          passToken: token,
          gateId,
          scanOperationId,
          checkInMethod: "qr",
        }),
      }).then(async (r) => ({
        status: r.status,
        body: await r.json().catch(() => ({})),
      }));
    });

    const responses = await Promise.all(scanPromises);
    let admittedForThisTicket = 0;

    for (const r of responses) {
      if (r.status === 200) {
        if (r.body.status === "CHECKED_IN") {
          admittedForThisTicket++;
          successfulAdmissions++;
        } else if (r.body.status === "ALREADY_CHECKED_IN") {
          duplicateRejected++;
        }
      } else {
        otherErrors++;
      }
    }

    if (admittedForThisTicket > 1) {
      doubleAdmissions += (admittedForThisTicket - 1);
      console.error(`🚨 CRITICAL FAILURE: Ticket ${token} admitted ${admittedForThisTicket} times!`);
    }
  }

  console.log("\n============================================================");
  console.log("DUPLICATE QR TORTURE TEST RESULTS");
  console.log("============================================================");
  console.log(`Tickets Tested: ${passes.length}`);
  console.log(`Total Scan Attempts: ${passes.length * 10}`);
  console.log(`Successful Admissions (status CHECKED_IN): ${successfulAdmissions}`);
  console.log(`Rejected as Duplicate (status ALREADY_CHECKED_IN): ${duplicateRejected}`);
  console.log(`Double Admissions (CRITICAL FAILURE count): ${doubleAdmissions}`);
  console.log(`Other Errors: ${otherErrors}`);

  const passed = successfulAdmissions === 100 && duplicateRejected === 900 && doubleAdmissions === 0;
  console.log(`VERDICT: ${passed ? "PASSED (100% PERFECT CONCURRENCY LOCKING)" : "FAILED"}`);

  // Write results file
  fs.writeFileSync(
    "duplicate-qr-torture-results.json",
    JSON.stringify(
      {
        passesTested: passes.length,
        totalScanAttempts: passes.length * 10,
        successfulAdmissions,
        duplicateRejected,
        doubleAdmissions,
        otherErrors,
        passed,
      },
      null,
      2
    )
  );

  // Clean up
  await admin.from("check_ins").delete().eq("event_id", tortureEvent.id);
  await admin.from("passes").delete().eq("event_id", tortureEvent.id);
  await admin.from("attendees").delete().eq("event_id", tortureEvent.id);
  await admin.from("ticket_types").delete().eq("event_id", tortureEvent.id);
  await admin.from("events").delete().eq("id", tortureEvent.id);
}

main().catch((err) => {
  console.error("Duplicate QR Torture Error:", err);
  process.exit(1);
});
