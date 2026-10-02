import assert from "node:assert";

console.log("=================================================");
console.log("   URPASS FINAL FUNCTIONAL END-TO-END VERIFICATION");
console.log("=================================================");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runTest() {
  const eventId = `test-e2e-${Date.now()}`;
  console.log(`\n[INIT] Target Event ID: ${eventId}`);

  // Test 1: Stage 3 Booths API & In-Memory Store
  console.log("\n[TEST 1] Testing Trade Show Booth Management...");
  const { getEventBooths, saveEventBooth, deleteEventBooth } = await import("../lib/exhibitor-sponsor/booth-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/booth-service.ts");
  });

  const boothA = saveEventBooth({
    eventId,
    boothNumber: "E2E-A101",
    sizeSqft: 200,
    hallName: "Grand Expo Pavilion",
    status: "available",
  });
  assert(boothA.id, "Booth ID should be generated");
  assert.strictEqual(boothA.boothNumber, "E2E-A101");
  console.log(`  ✓ Booth created: ${boothA.boothNumber} (${boothA.sizeSqft} sq.ft) in ${boothA.hallName}`);

  // Test 2: Sponsorship Tiers & Deliverables Matrix
  console.log("\n[TEST 2] Testing Sponsorship Tiers & Deliverables Fulfillment...");
  const {
    getSponsorshipTiers,
    saveSponsorshipTier,
    getEventSponsors,
    saveEventSponsor,
    updateSponsorDeliverable,
  } = await import("../lib/exhibitor-sponsor/sponsor-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/sponsor-service.ts");
  });

  const defaultTiers = getSponsorshipTiers(eventId);
  assert(defaultTiers.length >= 4, "Should seed at least 4 default sponsorship tiers");
  console.log(`  ✓ Default Tiers initialized: ${defaultTiers.map(t => t.name).join(", ")}`);

  const sponsor = saveEventSponsor({
    eventId,
    name: "Enterprise Global Systems",
    tierName: "Platinum Title Partner",
    websiteUrl: "https://egs-enterprise.com",
    contactName: "Marcus Vance",
    contactEmail: "marcus@egs-enterprise.com",
    visibilitySettings: {
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: true,
      email: true,
      badge: true,
      app: true,
    },
  });
  assert(sponsor.id, "Sponsor should have ID");
  assert.strictEqual(sponsor.deliverablesStatus.logoReceived, false);

  // Update Deliverable
  const deliverableUpdated = updateSponsorDeliverable(eventId, sponsor.id, "logoReceived", true);
  assert(deliverableUpdated, "Deliverable update should succeed");
  const refreshedSponsor = getEventSponsors(eventId).find(s => s.id === sponsor.id);
  assert.strictEqual(refreshedSponsor.deliverablesStatus.logoReceived, true, "Logo deliverable should now be verified");
  console.log(`  ✓ Sponsor registered: ${sponsor.name} with deliverables tracking verified`);

  // Test 3: Exhibitor Management & Magic Portal Access
  console.log("\n[TEST 3] Testing Exhibitor Onboarding & Portal Authentication...");
  const {
    getEventExhibitors,
    saveEventExhibitor,
    getExhibitorByToken,
    saveExhibitorStaff,
    getExhibitorStaff,
    toggleBoothCheckIn,
  } = await import("../lib/exhibitor-sponsor/exhibitor-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/exhibitor-service.ts");
  });

  const exhibitor = saveEventExhibitor({
    eventId,
    name: "Elena Rostova",
    companyName: "Quantum Data Technologies",
    contactEmail: "elena@quantumdata.tech",
    category: "Cloud & Analytics",
    productsServices: ["Quantum Engine", "Predictive Analytics"],
    boothId: boothA.id,
    boothNumber: boothA.boothNumber,
    status: "active",
    boothCheckedIn: false,
  });
  assert(exhibitor.portalToken.startsWith("exh_"), "Magic portal token must have exh_ prefix");
  console.log(`  ✓ Exhibitor created: ${exhibitor.companyName}`);
  console.log(`  ✓ Magic Portal Token generated: ${exhibitor.portalToken}`);

  // Test Token Lookup
  const tokenLookup = getExhibitorByToken(exhibitor.portalToken);
  assert(tokenLookup, "Exhibitor must be retrievable via magic portal token");
  assert.strictEqual(tokenLookup.id, exhibitor.id);
  console.log(`  ✓ Magic portal token authentication verified`);

  // Add Booth Staff
  const staff = saveExhibitorStaff({
    exhibitorId: exhibitor.id,
    eventId,
    name: "Sarah Chen",
    email: "sarah@quantumdata.tech",
    role: "booth_manager",
    canCaptureLeads: true,
  });
  const staffRoster = getExhibitorStaff(exhibitor.id);
  assert.strictEqual(staffRoster.length, 1);
  assert.strictEqual(staffRoster[0].name, "Sarah Chen");
  console.log(`  ✓ Booth staff member assigned: ${staff.name} (${staff.role})`);

  // Booth Check-in
  toggleBoothCheckIn(eventId, exhibitor.id, true);
  const updatedExh = getEventExhibitors(eventId).find(e => e.id === exhibitor.id);
  assert.strictEqual(updatedExh.boothCheckedIn, true, "Booth should be checked in onsite");
  console.log(`  ✓ Booth onsite check-in marked active`);

  // Test 4: Lead Retrieval & Qualification
  console.log("\n[TEST 4] Testing Lead Capture, Intent Qualification & CSV Export...");
  const {
    captureLeadFromQr,
    getExhibitorLeads,
    updateLeadQualification,
    exportLeadsToCsv,
  } = await import("../lib/exhibitor-sponsor/lead-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/lead-service.ts");
  });

  const lead1 = captureLeadFromQr({
    eventId,
    exhibitorId: exhibitor.id,
    tokenOrAttendeeId: "att_vip_998",
    staffName: staff.name,
    qualificationRating: "hot",
    notes: "Requires enterprise SLA and dedicated cloud deployment.",
    interestedProducts: ["Quantum Engine"],
    tags: ["enterprise", "decision_maker"],
  });
  assert(lead1.id, "Lead ID should be created");
  assert.strictEqual(lead1.qualificationRating, "hot");
  console.log(`  ✓ Lead captured via QR: ${lead1.attendeeName} rated ${lead1.qualificationRating.toUpperCase()}`);

  // Update lead rating
  updateLeadQualification(lead1.id, {
    qualificationRating: "warm",
    followUpStatus: "contacted",
  });
  const leads = getExhibitorLeads(eventId, exhibitor.id);
  assert.strictEqual(leads[0].qualificationRating, "warm");
  assert.strictEqual(leads[0].followUpStatus, "contacted");
  console.log(`  ✓ Lead qualification state transition verified`);

  // CSV Export Generation
  const csvContent = exportLeadsToCsv(leads);
  assert(csvContent.includes("Lead ID,Attendee Name,Email,Company,Phone"), "CSV must include valid headers");
  assert(csvContent.includes("WARM"), "CSV must contain lead rating");
  console.log(`  ✓ RFC-4180 CSV export generated (${csvContent.split("\n").length} lines)`);

  // Test 5: B2B Matchmaking Meetings
  console.log("\n[TEST 5] Testing B2B Buyer-Exhibitor Meetings...");
  const {
    requestB2BMeeting,
    getExhibitorMeetings,
    updateMeetingStatus,
    bookmarkExhibitor,
  } = await import("../lib/exhibitor-sponsor/meeting-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/meeting-service.ts");
  });

  const meeting = requestB2BMeeting({
    eventId,
    exhibitorId: exhibitor.id,
    requesterName: "Dr. Arthur Pendelton",
    requesterEmail: "arthur@apextech.org",
    requesterCompany: "Apex Tech Labs",
    proposedTime: "2026-11-20T14:30:00Z",
    durationMinutes: 30,
    location: `Booth ${exhibitor.boothNumber}`,
    meetingNotes: "Exploring potential joint venture for high-compute infrastructure.",
  });
  assert.strictEqual(meeting.status, "pending");
  console.log(`  ✓ Meeting requested by ${meeting.requesterName} (status: ${meeting.status})`);

  // Accept meeting
  updateMeetingStatus(meeting.id, "accepted");
  const exhibitorMeetings = getExhibitorMeetings(eventId, exhibitor.id);
  assert.strictEqual(exhibitorMeetings[0].status, "accepted");
  console.log(`  ✓ Meeting confirmed & accepted at ${meeting.location}`);

  // Test 6: Commercial Telemetry & KPI Analytics
  console.log("\n[TEST 6] Testing Stage 3 Commercial Telemetry Engine...");
  const { computeStage3Stats, computeExhibitorLeadAnalytics } = await import("../lib/exhibitor-sponsor/analytics-service.js").catch(async () => {
    return await import("../lib/exhibitor-sponsor/analytics-service.ts");
  });

  const stats = computeStage3Stats(
    [exhibitor],
    [sponsor],
    [boothA],
    leads,
    exhibitorMeetings
  );
  assert.strictEqual(stats.totalExhibitors, 1);
  assert.strictEqual(stats.activeExhibitors, 1);
  assert.strictEqual(stats.totalSponsors, 1);
  assert.strictEqual(stats.totalBooths, 1);
  assert.strictEqual(stats.totalLeadsCaptured, 1);
  assert.strictEqual(stats.confirmedMeetingsCount, 1);
  console.log(`  ✓ Telemetry verified: 100% metrics integrity across all 5 commercial domains`);

  // Test 7: Stage 2 Physical Ops Compatibility Check
  console.log("\n[TEST 7] Verifying Stage 2 Physical Ops Compatibility...");
  const { evaluateZoneAccess, recordZoneScan, saveEventZone } = await import("../lib/physical-ops/zone-service.js").catch(async () => {
    return await import("../lib/physical-ops/zone-service.ts");
  });

  const zone = saveEventZone({
    eventId,
    name: "VIP Buyer Lounge",
    zoneType: "vip_area",
    capacity: 50,
  });
  const accessCheck = evaluateZoneAccess({
    attendee: { id: "att-vip", badgeType: "vip" },
    zoneId: zone.id,
    direction: "in",
    currentZone: zone,
  });
  assert.strictEqual(accessCheck.allowed, true);
  console.log(`  ✓ Physical access rule validation confirmed for ${zone.name}`);

  console.log("\n=================================================");
  console.log("   ALL FUNCTIONAL TESTS PASSED WITH 100% SUCCESS  ");
  console.log("=================================================");
}

runTest().catch((err) => {
  console.error("\n❌ FUNCTIONAL TEST FAILED:", err);
  process.exit(1);
});
