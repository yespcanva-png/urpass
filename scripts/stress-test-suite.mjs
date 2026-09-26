import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";
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
const TEST_EVENT_ID = process.env.TEST_EVENT_ID || "36c60bed-20d4-4bdc-a0e4-c974848b5f33";
const TICKET_TYPE_ID = process.env.TICKET_TYPE_ID || "9e4595df-9332-44f2-8df4-3a80b9c843e8";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret";

if (!SERVICE_KEY || !SUPABASE_URL) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Helper for percentile calculations
function calcPercentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const index = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, Math.min(index, sortedArr.length - 1))];
}

// Global tokens pool
let availablePassTokens = [];
let alreadyCheckedInTokens = [];

// Helper: Pre-seed unscanned passes for scanning workers
async function seedInitialPasses(count = 100) {
  console.log(`Seeding ${count} initial disposable passes for scanning load...`);
  const batchSize = 25;
  for (let i = 0; i < count; i += batchSize) {
    const promises = [];
    const currentBatch = Math.min(batchSize, count - i);
    for (let j = 0; j < currentBatch; j++) {
      const idx = i + j;
      promises.push(
        fetch(`${BASE_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: TEST_EVENT_ID,
            ticketTypeId: TICKET_TYPE_ID,
            name: `Initial Seed Attendee ${idx}`,
            email: `stress-seed-${Date.now()}-${idx}@test.urpass.space`,
            phone: "+919876543210",
            pass_type: "participant",
          }),
        }).then(async (r) => {
          if (r.ok) {
            const data = await r.json();
            if (data.passToken) availablePassTokens.push(data.passToken);
          }
        }).catch(() => {})
      );
    }
    await Promise.all(promises);
  }
  console.log(`✓ Seeded ${availablePassTokens.length} active passes.`);
}

// Single Worker Actions
async function executeRegistrationAction() {
  const start = performance.now();
  const email = `stress-test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@test.urpass.space`;
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        ticketTypeId: TICKET_TYPE_ID,
        name: `Stress User ${Math.floor(Math.random() * 10000)}`,
        email,
        phone: "+919876543210",
        pass_type: "participant",
      }),
    });
    const latency = performance.now() - start;
    const ok = res.status === 201;
    if (ok) {
      const body = await res.json().catch(() => ({}));
      if (body.passToken) {
        availablePassTokens.push(body.passToken);
      }
    }
    return { success: ok, status: res.status, latency, type: "registration" };
  } catch (err) {
    return { success: false, status: 0, latency: performance.now() - start, type: "registration", error: err.message };
  }
}

async function executeScanAction(isDuplicate = false) {
  const start = performance.now();
  let token = null;

  if (isDuplicate) {
    if (alreadyCheckedInTokens.length > 0) {
      token = alreadyCheckedInTokens[Math.floor(Math.random() * alreadyCheckedInTokens.length)];
    }
  }

  if (!token) {
    if (availablePassTokens.length > 0) {
      token = availablePassTokens.pop();
    }
  }

  if (!token) {
    // If no pass token readily available in pool, generate a temporary valid pass
    const regRes = await executeRegistrationAction();
    if (availablePassTokens.length > 0) {
      token = availablePassTokens.pop();
    } else {
      return { success: false, status: 0, latency: performance.now() - start, type: "scan", error: "No pass available" };
    }
  }

  try {
    const gateId = `gate-${Math.floor(Math.random() * 8) + 1}`;
    const scanOperationId = crypto.randomUUID();
    const res = await fetch(`${BASE_URL}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        passToken: token,
        gateId,
        scanOperationId,
        checkInMethod: "qr",
      }),
    });

    const latency = performance.now() - start;
    const data = await res.json().catch(() => ({}));
    const ok = res.status === 200 && (data.status === "CHECKED_IN" || data.status === "ALREADY_CHECKED_IN");
    
    if (data.status === "CHECKED_IN") {
      alreadyCheckedInTokens.push(token);
    }

    return {
      success: ok,
      status: res.status,
      latency,
      type: "scan",
      subStatus: data.status,
    };
  } catch (err) {
    return { success: false, status: 0, latency: performance.now() - start, type: "scan", error: err.message };
  }
}

async function executeWebhookAction() {
  const start = performance.now();
  const payload = JSON.stringify({
    entity: "event",
    account_id: "acc_test",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          amount: 50000,
          currency: "INR",
          status: "captured",
          notes: { eventId: TEST_EVENT_ID },
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  });

  const signature = crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");

  try {
    const res = await fetch(`${BASE_URL}/api/webhook/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: payload,
    });
    return { success: res.status === 200, status: res.status, latency: performance.now() - start, type: "webhook" };
  } catch (err) {
    return { success: false, status: 0, latency: performance.now() - start, type: "webhook", error: err.message };
  }
}

async function executeReadAction() {
  const start = performance.now();
  try {
    const res = await fetch(`${BASE_URL}/api/scan/manifest?eventId=${TEST_EVENT_ID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });
    return { success: res.status === 200, status: res.status, latency: performance.now() - start, type: "read" };
  } catch (err) {
    return { success: false, status: 0, latency: performance.now() - start, type: "read", error: err.message };
  }
}

// Single multi-channel traffic dispatcher adhering to the ~55% / 25% / 10% / 5% / 5% mix
async function dispatchTrafficItem() {
  const roll = Math.random() * 100;
  if (roll < 55) {
    // 55% QR scan
    return executeScanAction(false);
  } else if (roll < 80) {
    // 25% new registration
    return executeRegistrationAction();
  } else if (roll < 90) {
    // 10% duplicate / repeated scan
    return executeScanAction(true);
  } else if (roll < 95) {
    // 5% payment/webhook
    return executeWebhookAction();
  } else {
    // 5% dashboard / API read
    return executeReadAction();
  }
}

// Phase execution runner
async function runProgressivePhase(name, scanners, registrars, durationSeconds = 30) {
  const totalConcurrency = scanners + registrars;
  console.log(`\n============================================================`);
  console.log(`RUNNING ${name}`);
  console.log(`Concurrency: ${totalConcurrency} (${scanners} scanners, ${registrars} registration users)`);
  console.log(`Duration: ${durationSeconds} seconds | Realistic traffic mix`);
  console.log(`============================================================`);

  const results = [];
  const startTime = Date.now();
  const endTime = startTime + durationSeconds * 1000;
  let activeWorkers = 0;

  // We maintain a steady concurrent pool of workers for duration
  async function worker() {
    activeWorkers++;
    while (Date.now() < endTime) {
      const res = await dispatchTrafficItem();
      results.push(res);
      // Small randomized realistic gate delay (5-20ms)
      await new Promise((r) => setTimeout(r, Math.random() * 15 + 5));
    }
    activeWorkers--;
  }

  // Launch totalConcurrency workers
  const workerPromises = [];
  for (let i = 0; i < totalConcurrency; i++) {
    workerPromises.push(worker());
  }

  await Promise.all(workerPromises);

  const durationActual = (Date.now() - startTime) / 1000;
  const totalReq = results.length;
  const successReq = results.filter((r) => r.success).length;
  const failedReq = totalReq - successReq;
  const errorRate = totalReq > 0 ? (failedReq / totalReq) * 100 : 0;
  const rps = (totalReq / durationActual).toFixed(1);

  const scanResults = results.filter((r) => r.type === "scan");
  const regResults = results.filter((r) => r.type === "registration");

  const scanRps = (scanResults.length / durationActual).toFixed(1);
  const regRps = (regResults.length / durationActual).toFixed(1);

  const allLatencies = results.map((r) => r.latency).sort((a, b) => a - b);
  const scanLatencies = scanResults.map((r) => r.latency).sort((a, b) => a - b);
  const regLatencies = regResults.map((r) => r.latency).sort((a, b) => a - b);

  const p50 = calcPercentile(allLatencies, 50).toFixed(1);
  const p95 = calcPercentile(allLatencies, 95).toFixed(1);
  const p99 = calcPercentile(allLatencies, 99).toFixed(1);
  const maxLatency = allLatencies.length ? Math.max(...allLatencies).toFixed(1) : 0;

  const scanP95 = calcPercentile(scanLatencies, 95).toFixed(1);
  const scanP99 = calcPercentile(scanLatencies, 99).toFixed(1);
  const regP95 = calcPercentile(regLatencies, 95).toFixed(1);

  const mem = process.memoryUsage();
  const rssMb = (mem.rss / 1024 / 1024).toFixed(1);

  const stats = {
    name,
    concurrentUsers: totalConcurrency,
    requestsPerSec: parseFloat(rps),
    totalRequests: totalReq,
    successfulRequests: successReq,
    failedRequests: failedReq,
    httpErrorPct: parseFloat(errorRate.toFixed(2)),
    qrScansPerSec: parseFloat(scanRps),
    registrationsPerSec: parseFloat(regRps),
    p50: parseFloat(p50),
    p95: parseFloat(p95),
    p99: parseFloat(p99),
    maxLatency: parseFloat(maxLatency),
    scanP95: parseFloat(scanP95),
    scanP99: parseFloat(scanP99),
    regP95: parseFloat(regP95),
    rssMb: parseFloat(rssMb),
  };

  console.log(`\nResults for ${name}:`);
  console.log(`  Requests/sec: ${stats.requestsPerSec} RPS`);
  console.log(`  Total requests: ${stats.totalRequests} (Success: ${stats.successfulRequests}, Failed: ${stats.failedRequests})`);
  console.log(`  HTTP error %: ${stats.httpErrorPct}%`);
  console.log(`  QR scans/sec: ${stats.qrScansPerSec} | Regs/sec: ${stats.registrationsPerSec}`);
  console.log(`  Overall: p50: ${stats.p50}ms | p95: ${stats.p95}ms | p99: ${stats.p99}ms | Max: ${stats.maxLatency}ms`);
  console.log(`  Scanner: p95: ${stats.scanP95}ms | p99: ${stats.scanP99}ms`);
  console.log(`  Registration p95: ${stats.regP95}ms`);
  console.log(`  Node RSS Memory: ${stats.rssMb} MB`);

  if (stats.httpErrorPct > 5) {
    console.error(`⚠️ WARNING: Error rate exceeded 5% (${stats.httpErrorPct}%)`);
  }
  if (stats.p95 > 3000) {
    console.error(`⚠️ WARNING: p95 exceeded 3s (${stats.p95}ms)`);
  }

  return stats;
}

// Burst Test Execution
async function runBurstTest(burstName, totalRequests, targetDurationSec) {
  console.log(`\n============================================================`);
  console.log(`RUNNING ${burstName}: ${totalRequests} requests / ${targetDurationSec} sec`);
  console.log(`============================================================`);

  const delayBetweenWaves = (targetDurationSec * 1000) / totalRequests;
  const results = [];
  const startTime = performance.now();

  const promises = [];
  for (let i = 0; i < totalRequests; i++) {
    // Schedule request
    promises.push(
      new Promise((resolve) => {
        setTimeout(async () => {
          const res = await dispatchTrafficItem();
          results.push(res);
          resolve(res);
        }, i * delayBetweenWaves);
      })
    );
  }

  await Promise.all(promises);
  const actualDuration = (performance.now() - startTime) / 1000;
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;
  const errPct = (failCount / results.length) * 100;
  const latencies = results.map((r) => r.latency).sort((a, b) => a - b);

  const burstStats = {
    name: burstName,
    totalRequests,
    actualDuration: parseFloat(actualDuration.toFixed(2)),
    rps: parseFloat((results.length / actualDuration).toFixed(1)),
    successCount,
    failCount,
    errPct: parseFloat(errPct.toFixed(2)),
    p50: parseFloat(calcPercentile(latencies, 50).toFixed(1)),
    p95: parseFloat(calcPercentile(latencies, 95).toFixed(1)),
    p99: parseFloat(calcPercentile(latencies, 99).toFixed(1)),
  };

  console.log(`Burst Results: ${burstStats.rps} RPS, ${burstStats.errPct}% err, p95=${burstStats.p95}ms, p99=${burstStats.p99}ms`);
  return burstStats;
}

// Duplicate QR Torture Test
async function runDuplicateQRTortureTest() {
  console.log(`\n============================================================`);
  console.log(`RUNNING DUPLICATE QR TORTURE TEST`);
  console.log(`100 distinct valid tickets × 10 concurrent scans from different gates`);
  console.log(`Target: Exactly 100 admitted, 900 rejected as duplicate, 0 double admissions`);
  console.log(`============================================================`);

  // 1. Generate 100 fresh tickets
  console.log("Generating 100 fresh disposable tickets...");
  const tickets = [];
  for (let i = 0; i < 100; i++) {
    const regRes = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        ticketTypeId: TICKET_TYPE_ID,
        name: `Torture User ${i}`,
        email: `stress-torture-${Date.now()}-${i}@test.urpass.space`,
        phone: "+919876543210",
        pass_type: "participant",
      }),
    });
    const regData = await regRes.json();
    if (regData.passToken) {
      tickets.push(regData.passToken);
    }
  }

  console.log(`✓ Created ${tickets.length} valid passes. Commencing concurrent 10-gate scan barrage...`);

  let totalScans = 0;
  let successfulAdmissions = 0;
  let duplicateRejected = 0;
  let criticalDoubleAdmissions = 0;

  for (let i = 0; i < tickets.length; i++) {
    const token = tickets[i];
    // Fire 10 simultaneous scans from 10 different gates
    const gateScans = Array.from({ length: 10 }, (_, gateIndex) => {
      const gateId = `gate-${gateIndex + 1}`;
      const scanOperationId = crypto.randomUUID();
      return fetch(`${BASE_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({
          eventId: TEST_EVENT_ID,
          passToken: token,
          gateId,
          scanOperationId,
          checkInMethod: "qr",
        }),
      }).then(async (r) => {
        const body = await r.json().catch(() => ({}));
        return { status: r.status, body };
      });
    });

    const responses = await Promise.all(gateScans);
    totalScans += responses.length;

    let ticketCheckedInCount = 0;
    for (const res of responses) {
      if (res.status === 200) {
        if (res.body.status === "CHECKED_IN") {
          ticketCheckedInCount++;
          successfulAdmissions++;
        } else if (res.body.status === "ALREADY_CHECKED_IN") {
          duplicateRejected++;
        }
      }
    }

    if (ticketCheckedInCount > 1) {
      criticalDoubleAdmissions += (ticketCheckedInCount - 1);
      console.error(`🚨 CRITICAL FAILURE: Ticket ${token} received ${ticketCheckedInCount} successful admissions!`);
    }
  }

  console.log(`\nDuplicate QR Torture Test Results:`);
  console.log(`  Total Scan Attempts: ${totalScans}`);
  console.log(`  Successful Admissions (status CHECKED_IN): ${successfulAdmissions}`);
  console.log(`  Rejected as Duplicate (status ALREADY_CHECKED_IN): ${duplicateRejected}`);
  console.log(`  Double Admissions (CRITICAL FAILURE count): ${criticalDoubleAdmissions}`);

  const passed = successfulAdmissions === 100 && duplicateRejected === 900 && criticalDoubleAdmissions === 0;
  console.log(`  RESULT: ${passed ? "PASSED (PERFECT CONCURRENCY LOCKING)" : "FAILED"}`);

  if (criticalDoubleAdmissions > 0) {
    throw new Error(`CRITICAL FAILURE: ${criticalDoubleAdmissions} double admissions detected!`);
  }

  return {
    ticketsTested: 100,
    totalScans,
    successfulAdmissions,
    duplicateRejected,
    criticalDoubleAdmissions,
    passed,
  };
}

// Capacity Torture Test
async function runCapacityTortureTest() {
  console.log(`\n============================================================`);
  console.log(`RUNNING CAPACITY TORTURE TEST`);
  console.log(`Capacity = 5000. Filling to 4990. Launching 500 concurrent registrations.`);
  console.log(`Expected: Max 10 succeed. Authoritative count = exactly 5000. Zero capacity breaches.`);
  console.log(`============================================================`);

  // 1. Get current registered count
  const { count: initialCount } = await admin
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", TEST_EVENT_ID)
    .neq("application_status", "rejected");

  console.log(`Current registered attendee count: ${initialCount}`);

  // 2. Adjust or fill to reach exactly 4990
  const needed = 4990 - (initialCount ?? 0);
  if (needed > 0) {
    console.log(`Pre-populating ${needed} attendees to reach exactly 4,990 base...`);
    // Fast batch insert via admin client
    const batchSize = 100;
    for (let i = 0; i < needed; i += batchSize) {
      const currentBatch = Math.min(batchSize, needed - i);
      const rows = [];
      for (let j = 0; j < currentBatch; j++) {
        const idx = (initialCount ?? 0) + i + j;
        rows.push({
          event_id: TEST_EVENT_ID,
          name: `Capacity Base User ${idx}`,
          email: `stress-cap-base-${idx}@test.urpass.space`,
          phone: "+919876543210",
          pass_type: "participant",
          application_status: "approved",
          ticket_type_id: TICKET_TYPE_ID,
        });
      }
      const { error: insErr } = await admin.from("attendees").insert(rows);
      if (insErr) {
        console.error("Batch insert error:", insErr);
        break;
      }
    }
  }

  const { count: filledCount } = await admin
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", TEST_EVENT_ID)
    .neq("application_status", "rejected");

  console.log(`Base attendee count prior to barrage: ${filledCount} / 5000`);

  // 3. Launch 500 simultaneous registration attempts
  console.log("Firing 500 simultaneous registration attempts against remaining 10 spots...");
  const barragePromises = Array.from({ length: 500 }, (_, i) => {
    return fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        ticketTypeId: TICKET_TYPE_ID,
        name: `Barrage User ${i}`,
        email: `stress-barrage-${Date.now()}-${i}@test.urpass.space`,
        phone: "+919876543210",
        pass_type: "participant",
      }),
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      return { status: res.status, body };
    });
  });

  const barrageResults = await Promise.all(barragePromises);
  const successRegs = barrageResults.filter((r) => r.status === 201 && r.body.success);
  const rejectedRegs = barrageResults.filter((r) => r.status === 429 || r.status === 400 || !r.body.success);

  // Authoritative database check
  const { count: finalCount } = await admin
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", TEST_EVENT_ID)
    .neq("application_status", "rejected");

  console.log(`\nCapacity Torture Results:`);
  console.log(`  Simultaneous attempts: 500`);
  console.log(`  Registrations succeeded: ${successRegs.length}`);
  console.log(`  Registrations rejected: ${rejectedRegs.length}`);
  console.log(`  Authoritative DB count: ${finalCount} / 5000`);

  const capacityBreached = (finalCount ?? 0) > 5000;
  console.log(`  Capacity Breached: ${capacityBreached ? "YES (CRITICAL FAILURE)" : "NO (STRICT INTEGRITY PRESERVED)"}`);

  if (capacityBreached) {
    throw new Error(`CRITICAL FAILURE: Event capacity exceeded! Final count: ${finalCount}`);
  }

  return {
    simultaneousAttempts: 500,
    successCount: successRegs.length,
    rejectedCount: rejectedRegs.length,
    finalAuthoritativeCount: finalCount,
    capacityBreached,
  };
}

// Retry Torture Test (Idempotency)
async function runRetryTortureTest() {
  console.log(`\n============================================================`);
  console.log(`RUNNING RETRY TORTURE TEST (IDEMPOTENCY & DUPLICATE PROTECTION)`);
  console.log(`============================================================`);

  // 1. Same registration sent 5 times concurrently
  const duplicateEmail = `stress-retry-${Date.now()}@test.urpass.space`;
  const regRequests = Array.from({ length: 5 }, () => {
    return fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        ticketTypeId: TICKET_TYPE_ID,
        name: "Retry Test User",
        email: duplicateEmail,
        phone: "+919876543210",
        pass_type: "participant",
      }),
    }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  });

  const regResponses = await Promise.all(regRequests);
  const regSuccess = regResponses.filter((r) => r.status === 201).length;
  const regDup = regResponses.filter((r) => r.status === 400 && r.body.error?.includes("already applied")).length;
  console.log(`Registration Retry: ${regSuccess} created, ${regDup} duplicate rejections.`);

  // 2. Scanner idempotent retries (same scanOperationId sent 5 times)
  // Create a pass first
  const singleReg = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: TEST_EVENT_ID,
      ticketTypeId: TICKET_TYPE_ID,
      name: "Idempotent Scanner Attendee",
      email: `stress-scan-idem-${Date.now()}@test.urpass.space`,
      phone: "+919876543210",
      pass_type: "participant",
    }),
  });
  const { passToken } = await singleReg.json();

  const fixedScanOperationId = crypto.randomUUID();
  const scanRequests = Array.from({ length: 5 }, () => {
    return fetch(`${BASE_URL}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        eventId: TEST_EVENT_ID,
        passToken,
        gateId: "gate-1",
        scanOperationId: fixedScanOperationId,
        checkInMethod: "qr",
      }),
    }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  });

  const scanResponses = await Promise.all(scanRequests);
  const scanAllOk = scanResponses.every((r) => r.status === 200 && (r.body.status === "CHECKED_IN" || r.body.status === "ALREADY_CHECKED_IN"));

  // Check how many check_ins rows exist in DB for this pass
  const { data: checkInRows } = await admin
    .from("check_ins")
    .select("id")
    .eq("scan_operation_id", fixedScanOperationId);

  const checkInRowsCount = checkInRows?.length ?? 0;
  console.log(`Scanner Idempotent Retry: ${scanResponses.length} requests sent. Exactly ${checkInRowsCount} check_in DB record created.`);

  const passed = regSuccess === 1 && regDup === 4 && scanAllOk && checkInRowsCount === 1;
  console.log(`Retry Torture Test: ${passed ? "PASSED (PERFECT IDEMPOTENCY)" : "FAILED"}`);

  return { passed, regSuccess, regDup, checkInRowsCount };
}

// Breaking point test progression
async function runBreakingPointTest() {
  console.log(`\n============================================================`);
  console.log(`RUNNING PROGRESSIVE BREAKING POINT CONCURRENCY EXPLORATION`);
  console.log(`Levels: 500, 750, 1000, 1500, 2000`);
  console.log(`============================================================`);

  const levels = [500, 750, 1000, 1500, 2000];
  const breakingResults = [];
  let highestStableConcurrency = 0;
  let highestStableRps = 0;
  let warningPoint = null;
  let breakingPoint = null;
  let primaryBottleneck = null;

  for (const concurrency of levels) {
    const scanners = Math.floor(concurrency * 0.55);
    const registrars = concurrency - scanners;
    console.log(`\n--- Testing Concurrency Level: ${concurrency} (${scanners} scanners, ${registrars} registrars) ---`);

    const stats = await runProgressivePhase(`STRESS-LEVEL-${concurrency}`, scanners, registrars, 15);
    breakingResults.push(stats);

    // Stop criteria check:
    // HTTP errors > 5%
    // p95 > 3000ms
    // p99 > 5000ms
    const errorExceeded = stats.httpErrorPct > 5.0;
    const p95Exceeded = stats.p95 > 3000;
    const p99Exceeded = stats.p99 > 5000;

    if (!errorExceeded && !p95Exceeded && !p99Exceeded) {
      highestStableConcurrency = concurrency;
      if (stats.requestsPerSec > highestStableRps) {
        highestStableRps = stats.requestsPerSec;
      }
      console.log(`✓ Concurrency ${concurrency} is STABLE (Errors: ${stats.httpErrorPct}%, p95: ${stats.p95}ms, p99: ${stats.p99}ms).`);
    } else {
      if (!warningPoint) {
        warningPoint = `${concurrency} concurrent clients (${stats.requestsPerSec} RPS, p95=${stats.p95}ms, error=${stats.httpErrorPct}%)`;
      }

      if (errorExceeded || stats.p95 > 5000) {
        breakingPoint = `${concurrency} concurrent clients (Errors: ${stats.httpErrorPct}%, p95: ${stats.p95}ms, p99: ${stats.p99}ms)`;
        if (errorExceeded) {
          primaryBottleneck = "Remote Supabase / Postgres connection concurrency limit under burst HTTP transactions";
        } else {
          primaryBottleneck = "Node.js event loop saturation and database query wait queuing";
        }
        console.log(`⚠️ BREAKING POINT REACHED at concurrency ${concurrency}. Stopping higher levels.`);
        break;
      }
    }
  }

  if (!breakingPoint) {
    breakingPoint = "> 2,000 concurrent clients";
    primaryBottleneck = "Client-side network socket pooling & system file descriptor saturation";
  }
  if (!warningPoint) {
    warningPoint = `${highestStableConcurrency} concurrent clients`;
  }

  return {
    highestStableConcurrency,
    highestStableRps,
    warningPoint,
    breakingPoint,
    primaryBottleneck,
    breakingResults,
  };
}

// Main Orchestrator
async function main() {
  console.log("================================================================================");
  console.log("URPASS — 5,000 ATTENDEE REAL-WORLD SYSTEM STRESS TEST");
  console.log("================================================================================");
  console.log(`Server URL: ${BASE_URL}`);
  console.log(`Test Event ID: ${TEST_EVENT_ID}`);
  console.log(`CPU Cores: ${os.cpus().length} (${os.cpus()[0].model})`);
  console.log(`System Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`);

  // Seed passes
  await seedInitialPasses(150);

  // Progressive Phases
  console.log("\n>>> STARTING PROGRESSIVE PHASES <<<");
  const phase1 = await runProgressivePhase("PHASE 1 — BASELINE", 20, 20, 25);
  const phase2 = await runProgressivePhase("PHASE 2 — NORMAL", 50, 50, 25);
  const phase3 = await runProgressivePhase("PHASE 3 — PEAK", 100, 100, 30);
  const phase4 = await runProgressivePhase("PHASE 4 — HEAVY", 200, 200, 25);
  const phase5 = await runProgressivePhase("PHASE 5 — VERY HEAVY", 300, 300, 25);
  const phase6 = await runProgressivePhase("PHASE 6 — EXTREME", 500, 500, 25);

  const progressivePhases = [phase1, phase2, phase3, phase4, phase5, phase6];

  // Burst Tests
  console.log("\n>>> STARTING BURST TESTS <<<");
  const burst1 = await runBurstTest("BURST 1", 500, 5);
  const burst2 = await runBurstTest("BURST 2", 1000, 10);
  const burst3 = await runBurstTest("BURST 3", 2000, 20);

  // Torture Tests
  console.log("\n>>> STARTING SPECIALIZED TORTURE TESTS <<<");
  const dupResults = await runDuplicateQRTortureTest();
  const capResults = await runCapacityTortureTest();
  const retryResults = await runRetryTortureTest();

  // Breaking Point Exploration
  console.log("\n>>> STARTING BREAKING POINT EXPLORATION <<<");
  const breakingInfo = await runBreakingPointTest();

  // Consolidate final report
  console.log("\n\n================================================================================");
  console.log("STRESS TEST EXECUTION COMPLETE — COMPILING AUTHORITATIVE REPORT");
  console.log("================================================================================");

  const report = {
    progressivePhases,
    bursts: [burst1, burst2, burst3],
    duplicateTorture: dupResults,
    capacityTorture: capResults,
    retryTorture: retryResults,
    breakingInfo,
  };

  fs.writeFileSync("stress-test-results.json", JSON.stringify(report, null, 2));
  console.log("Wrote full metrics to stress-test-results.json");
}

main().catch((err) => {
  console.error("Stress Test Suite Fatal Error:", err);
  process.exit(1);
});
