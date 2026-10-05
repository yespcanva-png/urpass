import { describe, it, expect, beforeEach } from "vitest";
import {
  getEventBooths,
  saveEventBooth,
  deleteEventBooth,
} from "@/lib/exhibitor-sponsor/booth-service";
import {
  getSponsorshipTiers,
  saveSponsorshipTier,
  seedDefaultSponsorshipTiers,
  getEventSponsors,
  saveEventSponsor,
  updateSponsorDeliverable,
} from "@/lib/exhibitor-sponsor/sponsor-service";
import {
  getEventExhibitors,
  saveEventExhibitor,
  getExhibitorByToken,
  getExhibitorStaff,
  saveExhibitorStaff,
  toggleBoothCheckIn,
} from "@/lib/exhibitor-sponsor/exhibitor-service";
import {
  getExhibitorLeads,
  captureLeadFromQr,
  updateLeadQualification,
  exportLeadsToCsv,
} from "@/lib/exhibitor-sponsor/lead-service";
import {
  getExhibitorMeetings,
  requestB2BMeeting,
  updateMeetingStatus,
  bookmarkExhibitor,
} from "@/lib/exhibitor-sponsor/meeting-service";
import {
  computeStage3Stats,
  computeExhibitorLeadAnalytics,
} from "@/lib/exhibitor-sponsor/analytics-service";

describe("Stage 3: Exhibitor + Sponsor + Lead Retrieval Suite", () => {
  const eventId = "evt-test-commercial-101";

  beforeEach(() => {
    // Reset global in-memory stores for clean isolated tests
    globalThis.__urpass_booths = { [eventId]: [] };
    globalThis.__urpass_sponsorship_tiers = {};
    globalThis.__urpass_event_sponsors = { [eventId]: [] };
    globalThis.__urpass_exhibitors = { [eventId]: [] };
    globalThis.__urpass_exhibitor_staff = {};
    globalThis.__urpass_exhibitor_leads = {};
    globalThis.__urpass_b2b_meetings = {};
    globalThis.__urpass_exhibitor_bookmarks = {};
  });

  describe("Sprint 1 & 4: Exhibitor Management & Magic Portal Access", () => {
    it("creates an exhibitor profile with auto-generated secure magic portal token", () => {
      const exhibitor = saveEventExhibitor({
        eventId,
        name: "Dev Lead POC",
        companyName: "Acme Cloud AI",
        contactEmail: "lead@acme.ai",
        category: "Artificial Intelligence",
        productsServices: ["Cloud LLM", "Agent API"],
        status: "active",
        boothCheckedIn: false,
      });

      expect(exhibitor.id).toBeDefined();
      expect(exhibitor.companyName).toBe("Acme Cloud AI");
      expect(exhibitor.portalToken).toBeDefined();
      expect(exhibitor.portalToken.startsWith("exh_")).toBe(true);

      // Verify portal lookup by token
      const found = getExhibitorByToken(exhibitor.portalToken);
      expect(found).toBeDefined();
      expect(found?.id).toBe(exhibitor.id);
    });

    it("registers exhibitor booth staff and supports booth check-in toggle", () => {
      const exhibitor = saveEventExhibitor({
        eventId,
        name: "Director",
        companyName: "Vortex Hardware",
        contactEmail: "director@vortex.io",
        category: "Hardware",
        status: "active",
        boothCheckedIn: false,
      });

      const staff = saveExhibitorStaff({
        exhibitorId: exhibitor.id,
        eventId,
        name: "Alice Engineer",
        email: "alice@vortex.io",
        role: "technical_specialist",
        canCaptureLeads: true,
        isCheckedIn: true,
      });

      const staffList = getExhibitorStaff(exhibitor.id);
      expect(staffList.length).toBe(1);
      expect(staffList[0].name).toBe("Alice Engineer");
      expect(staffList[0].canCaptureLeads).toBe(true);

      // Toggle booth check-in
      const checkedIn = toggleBoothCheckIn(eventId, exhibitor.id, true);
      expect(checkedIn).toBe(true);

      const updatedExh = getEventExhibitors(eventId).find((e) => e.id === exhibitor.id);
      expect(updatedExh?.boothCheckedIn).toBe(true);
      expect(updatedExh?.boothCheckedInAt).toBeDefined();
    });
  });

  describe("Sprint 2 & 10: Sponsorship Tiers & Deliverables Fulfillment", () => {
    it("seeds default tier packages and handles custom tier creation", () => {
      const defaultTiers = seedDefaultSponsorshipTiers(eventId);
      expect(defaultTiers.length).toBe(4);
      expect(defaultTiers.map((t) => t.name)).toContain("Platinum Title Partner");

      // Custom Tier
      const customTier = saveSponsorshipTier({
        eventId,
        name: "Lanyard & Badge Sponsor",
        price: 75000,
        currency: "INR",
        maxSponsors: 1,
        benefits: ["Exclusive lanyard branding", "Logo on all passes"],
        logoPlacementRules: {
          homepage: false,
          eventWebsite: true,
          agenda: false,
          session: false,
          email: true,
          badge: true,
          app: true,
        },
      });

      expect(customTier.id).toBeDefined();
      expect(getSponsorshipTiers(eventId).length).toBe(5);
    });

    it("tracks sponsor profiles and checklist deliverable status transitions", () => {
      const sponsor = saveEventSponsor({
        eventId,
        name: "TechGiant Global",
        tierName: "Platinum",
        websiteUrl: "https://techgiant.com",
        contactName: "Sarah VP",
        contactEmail: "sarah@techgiant.com",
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

      expect(sponsor.id).toBeDefined();
      expect(sponsor.deliverablesStatus.logoReceived).toBe(false);

      // Update logo deliverable received
      const updated = updateSponsorDeliverable(eventId, sponsor.id, "logoReceived", true);
      expect(updated).toBe(true);

      const refreshed = getEventSponsors(eventId).find((s) => s.id === sponsor.id);
      expect(refreshed?.deliverablesStatus.logoReceived).toBe(true);
      expect(refreshed?.deliverablesStatus.bannerReceived).toBe(false);
    });
  });

  describe("Sprint 3: Trade Show Booth Floor Management", () => {
    it("creates booths, assigns exhibitors, and tracks occupancy stats", () => {
      const booth1 = saveEventBooth({
        eventId,
        boothNumber: "A-101",
        sizeSqft: 100,
        hallName: "Hall 1 - Main Expo",
        status: "available",
      });

      const booth2 = saveEventBooth({
        eventId,
        boothNumber: "PL-01",
        sizeSqft: 400,
        hallName: "Hall 1 - Main Expo",
        status: "assigned",
        assignedExhibitorId: "exh_acme",
        assignedExhibitorName: "Acme Corp",
      });

      const allBooths = getEventBooths(eventId);
      expect(allBooths.length).toBe(2);
      expect(allBooths.find((b) => b.boothNumber === "PL-01")?.status).toBe("assigned");

      deleteEventBooth(eventId, booth1.id);
      expect(getEventBooths(eventId).length).toBe(1);
    });
  });

  describe("Sprint 5 & 6: Lead Capture, Qualification & RFC-4180 CSV Export", () => {
    it("captures lead with rating, notes, interested products, and allows rating updates", () => {
      const lead = captureLeadFromQr({
        eventId,
        exhibitorId: "exh_123",
        tokenOrAttendeeId: "att_delegate_789",
        staffName: "Alice Rep",
        qualificationRating: "hot",
        notes: "Budget approved for enterprise rollout in Q4",
        interestedProducts: ["Custom API", "Analytics"],
        tags: ["decision_maker", "enterprise"],
      });

      expect(lead.id).toBeDefined();
      expect(lead.qualificationRating).toBe("hot");
      expect(lead.interestedProducts).toContain("Custom API");
      expect(lead.consentConfirmed).toBe(true);

      // Update rating to warm
      const updated = updateLeadQualification(lead.id, {
        qualificationRating: "warm",
        followUpStatus: "contacted",
      });
      expect(updated).toBe(true);

      const leads = getExhibitorLeads(eventId, "exh_123");
      expect(leads.length).toBe(1);
      expect(leads[0].qualificationRating).toBe("warm");
      expect(leads[0].followUpStatus).toBe("contacted");
    });

    it("generates valid RFC-4180 compliant CSV format with properly escaped headers and values", () => {
      const lead1 = captureLeadFromQr({
        eventId,
        exhibitorId: "exh_123",
        tokenOrAttendeeId: "att_001",
        qualificationRating: "hot",
        notes: 'Needs "fast" integration, urgent follow-up',
        interestedProducts: ["Cloud", "Security"],
      });

      const csv = exportLeadsToCsv([lead1]);
      expect(csv).toContain("Lead ID,Attendee Name,Email,Company,Phone");
      // Checks RFC-4180 quotes escaping
      expect(csv).toContain('"Needs ""fast"" integration, urgent follow-up"');
      expect(csv).toContain("HOT");
    });
  });

  describe("Sprint 7 & 8: B2B Matchmaking & Attendee Bookmarks", () => {
    it("schedules buyer-exhibitor meeting and handles status transitions", () => {
      const meeting = requestB2BMeeting({
        eventId,
        exhibitorId: "exh_intel",
        requesterName: "David Buyer",
        requesterEmail: "david@corp.com",
        requesterCompany: "Corp International",
        proposedTime: "2026-11-15T14:00:00.000Z",
        durationMinutes: 30,
        location: "Booth #B-12",
        meetingNotes: "Procurement discussion for 500 edge units",
      });

      expect(meeting.id).toBeDefined();
      expect(meeting.status).toBe("pending");

      const accepted = updateMeetingStatus(meeting.id, "accepted");
      expect(accepted).toBe(true);

      const meetings = getExhibitorMeetings(eventId, "exh_intel");
      expect(meetings.length).toBe(1);
      expect(meetings[0].status).toBe("accepted");
    });

    it("records attendee bookmarks and callback requests", () => {
      const bookmark = bookmarkExhibitor(eventId, "exh_intel", "att_david", true, true);
      expect(bookmark.id).toBeDefined();
      expect(bookmark.callbackRequested).toBe(true);
      expect(bookmark.businessCardShared).toBe(true);
    });
  });

  describe("Sprint 9 & 10: Real-Time Commercial Dashboard Telemetry", () => {
    it("computes accurate Stage 3 KPIs and exhibitor lead velocity metrics", () => {
      const exh = saveEventExhibitor({
        eventId,
        name: "Founder",
        companyName: "Aether AI",
        contactEmail: "founder@aether.ai",
        category: "AI",
        status: "active",
        boothCheckedIn: true,
      });

      const booth = saveEventBooth({
        eventId,
        boothNumber: "B-201",
        sizeSqft: 200,
        hallName: "Hall 2",
        status: "assigned",
        assignedExhibitorId: exh.id,
      });

      const sponsor = saveEventSponsor({
        eventId,
        name: "Aether AI Sponsor",
        visibilitySettings: { homepage: true, eventWebsite: true, agenda: true, session: true, email: true, badge: true, app: true },
      });

      const lead1 = captureLeadFromQr({
        eventId,
        exhibitorId: exh.id,
        tokenOrAttendeeId: "att_1",
        qualificationRating: "hot",
      });

      const lead2 = captureLeadFromQr({
        eventId,
        exhibitorId: exh.id,
        tokenOrAttendeeId: "att_2",
        qualificationRating: "cold",
      });

      const meeting = requestB2BMeeting({
        eventId,
        exhibitorId: exh.id,
        requesterName: "Partner",
        requesterEmail: "p@p.com",
        proposedTime: "2026-11-15T10:00:00Z",
      });
      updateMeetingStatus(meeting.id, "accepted");

      const stats = computeStage3Stats(
        [exh],
        [sponsor],
        [booth],
        [lead1, lead2],
        [meeting]
      );

      expect(stats.totalExhibitors).toBe(1);
      expect(stats.activeExhibitors).toBe(1);
      expect(stats.totalSponsors).toBe(1);
      expect(stats.totalBooths).toBe(1);
      expect(stats.assignedBooths).toBe(1);
      expect(stats.totalLeadsCaptured).toBe(2);
      expect(stats.hotLeadsCount).toBe(1);
      expect(stats.totalMeetingsRequested).toBe(1);
      expect(stats.confirmedMeetingsCount).toBe(1);

      // Exhibitor lead analytics
      const exhAnalytics = computeExhibitorLeadAnalytics([lead1, lead2]);
      expect(exhAnalytics.totalLeads).toBe(2);
      expect(exhAnalytics.ratingBreakdown.hot).toBe(1);
      expect(exhAnalytics.ratingBreakdown.cold).toBe(1);
    });
  });
});
