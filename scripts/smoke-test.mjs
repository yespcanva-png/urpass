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

const BASE_URL = "http://localhost:3000";
const TEST_EVENT_ID = "36c60bed-20d4-4bdc-a0e4-c974848b5f33";
const TICKET_TYPE_ID = "9e4595df-9332-44f2-8df4-3a80b9c843e8";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runSmokeTest() {
  console.log("=== STARTING SMOKE TEST ===");
  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(`TEST_EVENT_ID: ${TEST_EVENT_ID}`);

  // Test 1: Register an attendee
  console.log("\n[Step 1] Attempting attendee registration...");
  const regEmail = `stress-smoke-${Date.now()}@test.urpass.space`;
  const regRes = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: TEST_EVENT_ID,
      ticketTypeId: TICKET_TYPE_ID,
      name: "Smoke Test User",
      email: regEmail,
      phone: "+919876543210",
      pass_type: "participant",
    }),
  });

  const regStatus = regRes.status;
  const regData = await regRes.json();
  console.log(`Registration response [${regStatus}]:`, regData);

  if (regStatus !== 201 || !regData.success || !regData.passToken) {
    throw new Error(`Smoke Test Registration failed: ${JSON.stringify(regData)}`);
  }

  const passToken = regData.passToken;
  console.log(`✓ Registration succeeded. Pass Token: ${passToken}`);

  // Test 2: Initial QR scan
  console.log("\n[Step 2] Attempting first QR admission scan...");
  const scanRes1 = await fetch(`${BASE_URL}/api/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({
      eventId: TEST_EVENT_ID,
      passToken,
      checkInMethod: "qr",
    }),
  });

  const scanStatus1 = scanRes1.status;
  const scanData1 = await scanRes1.json();
  console.log(`Scan 1 response [${scanStatus1}]:`, scanData1);

  if (scanStatus1 !== 200 || scanData1.status !== "CHECKED_IN") {
    throw new Error(`Smoke Test First Scan failed: ${JSON.stringify(scanData1)}`);
  }
  console.log("✓ Initial scan succeeded with status CHECKED_IN.");

  // Test 3: Duplicate QR scan
  console.log("\n[Step 3] Attempting duplicate QR scan (must reject)...");
  const scanRes2 = await fetch(`${BASE_URL}/api/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({
      eventId: TEST_EVENT_ID,
      passToken,
      checkInMethod: "qr",
    }),
  });

  const scanStatus2 = scanRes2.status;
  const scanData2 = await scanRes2.json();
  console.log(`Scan 2 response [${scanStatus2}]:`, scanData2);

  if (scanStatus2 !== 200 || scanData2.status !== "ALREADY_CHECKED_IN") {
    throw new Error(`Smoke Test Duplicate Scan failed (did not reject as ALREADY_CHECKED_IN): ${JSON.stringify(scanData2)}`);
  }
  console.log("✓ Duplicate scan correctly rejected with status ALREADY_CHECKED_IN.");

  console.log("\n=== ALL SMOKE TESTS PASSED SUCCESSFULLY! ===");
}

runSmokeTest().catch((err) => {
  console.error("\n❌ SMOKE TEST CRITICAL FAILURE:", err);
  process.exit(1);
});
