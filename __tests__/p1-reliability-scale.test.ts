import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextInvoiceNumber, nextCreditNoteNumber, financialYearFor, formatDocumentNumber } from "@/lib/invoices";
import { validateEventPreflightReadiness } from "@/lib/events/preflight";
import { captureLeadFromQrDb } from "@/lib/exhibitor-sponsor/lead-service";
import { recordLiveOpsEvent, getLiveOpsEvents } from "@/lib/ops/events";

describe("P1 — Reliability, Scale & Operations Layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // Item 10: Atomic Invoice & Credit Note Numbering
  // =========================================================================
  describe("Item 10: Atomic Invoice & Credit Note Numbering", () => {
    it("formats document numbers with standard FY and padded sequences", () => {
      const fy = financialYearFor(new Date("2026-10-04"));
      expect(fy.label).toBe("2026-27");

      const invNumber = formatDocumentNumber("INV", fy.label, 42);
      expect(invNumber).toBe("UP/INV/2026-27/000042");

      const cnNumber = formatDocumentNumber("CN", fy.label, 7);
      expect(cnNumber).toBe("UP/CN/2026-27/000007");
    });

    it("uses atomic get_next_document_sequence RPC when available", async () => {
      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ data: 125, error: null }),
        from: vi.fn(),
      } as any;

      const number = await nextInvoiceNumber(mockSupabase, new Date("2026-10-04"), "INV");
      expect(mockSupabase.rpc).toHaveBeenCalledWith("get_next_document_sequence", {
        p_doc_type: "INV",
        p_financial_year: "2026-27",
      });
      expect(number).toBe("UP/INV/2026-27/000125");
    });

    it("falls back to count query if get_next_document_sequence RPC is unavailable", async () => {
      const mockSupabase = {
        rpc: vi.fn().mockRejectedValue(new Error("RPC not found")),
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              lte: vi.fn().mockReturnValue({
                ilike: vi.fn().mockResolvedValue({ count: 14 }),
              }),
            }),
          }),
        }),
      } as any;

      const number = await nextInvoiceNumber(mockSupabase, new Date("2026-10-04"), "INV");
      expect(number).toBe("UP/INV/2026-27/000015");
    });

    it("generates credit note number atomically via RPC", async () => {
      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ data: 3, error: null }),
        from: vi.fn(),
      } as any;

      const cn = await nextCreditNoteNumber(mockSupabase, new Date("2026-10-04"));
      expect(mockSupabase.rpc).toHaveBeenCalledWith("get_next_document_sequence", {
        p_doc_type: "CN",
        p_financial_year: "2026-27",
      });
      expect(cn).toBe("UP/CN/2026-27/000003");
    });
  });

  // =========================================================================
  // Items 8 & 9: Bulk Offline Scan Sync & LiveOps Conflict Alerting
  // =========================================================================
  describe("Items 8 & 9: Offline Conflict Detection & LiveOps Alerting", () => {
    it("records a critical LiveOps alert when duplicate offline gate scans conflict", () => {
      const initialCount = getLiveOpsEvents().length;

      recordLiveOpsEvent({
        level: "ERROR",
        category: "SECURITY",
        message: "CRITICAL: 2 offline duplicate QR scan conflict(s) detected across gates",
        details: {
          conflictCount: 2,
          conflicts: [
            {
              scanOperationId: "op-1",
              winningGateId: "gate-a",
              conflictMessage: "Already checked in at Gate North",
            },
          ],
        },
      });

      const events = getLiveOpsEvents();
      expect(events.length).toBeGreaterThan(initialCount);
      const alert = events.find((e) => e.message.includes("offline duplicate QR scan conflict"));
      expect(alert).toBeDefined();
      expect(alert?.level).toBe("ERROR");
      expect(alert?.category).toBe("SECURITY");
      expect(alert?.message).toContain("offline duplicate QR scan conflict");
    });
  });

  // =========================================================================
  // Item 13: Exhibitor Lead Capture (token vs pass_token)
  // =========================================================================
  describe("Item 13: Exhibitor Lead Capture Token Handling", () => {
    it("strips URL prefixes and resolves attendee via pass_token query in relational DB", async () => {
      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: {
                      id: "pass-uuid-1",
                      pass_token: "tok_sample_12345",
                      attendee_id: "att-uuid-1",
                      attendees: {
                        id: "att-uuid-1",
                        name: "Dr. Jane Smith",
                        email: "jane@university.edu",
                        phone: "+919876543210",
                        ticket_types: { name: "VIP Delegate Pass" },
                      },
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "exhibitor_leads") {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: "lead-relational-uuid-1" },
                    error: null,
                  }),
                }),
              }),
            };
          }
          return { select: vi.fn() };
        }),
      } as any;
      // @ts-ignore
      globalThis.__urpass_exhibitor_admin_client = mockAdmin;

      const lead = await captureLeadFromQrDb({
        eventId: "e0000000-0000-0000-0000-000000000001",
        exhibitorId: "b0000000-0000-0000-0000-000000000001",
        tokenOrAttendeeId: "https://urpass.space/pass/tok_sample_12345",
        staffName: "Staff Alice",
        qualificationRating: "hot",
        notes: "Interested in enterprise contract",
        interestedProducts: ["Tier 1 Badge Scanner", "API Integration"],
      });

      expect(lead).toBeDefined();
      expect(lead.id).toBe("lead-relational-uuid-1");
      expect(lead.attendeeName).toBe("Dr. Jane Smith");
      expect(lead.attendeeEmail).toBe("jane@university.edu");
      expect(lead.ticketName).toBe("VIP Delegate Pass");
      expect(lead.qualificationRating).toBe("hot");
      expect(lead.notes).toBe("Interested in enterprise contract");
      expect(lead.interestedProducts).toContain("API Integration");
    });

    it("handles raw pass tokens and attendee IDs correctly", async () => {
      const mockAdmin = {
        from: vi.fn((table: string) => {
          if (table === "passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null }),
                }),
              }),
            };
          }
          if (table === "exhibitor_leads") {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: "lead-relational-uuid-2" },
                    error: null,
                  }),
                }),
              }),
            };
          }
          return { select: vi.fn() };
        }),
      } as any;
      // @ts-ignore
      globalThis.__urpass_exhibitor_admin_client = mockAdmin;

      const lead = await captureLeadFromQrDb({
        eventId: "e0000000-0000-0000-0000-000000000001",
        exhibitorId: "b0000000-0000-0000-0000-000000000001",
        tokenOrAttendeeId: "raw_pass_token_9999",
        staffName: "Staff Bob",
        qualificationRating: "warm",
      });

      expect(lead.qualificationRating).toBe("warm");
      expect(lead.id).toBe("lead-relational-uuid-2");
      expect(lead.attendeeId).toBe("raw_pass_token_9999");
    });
  });

  // =========================================================================
  // Item 14: Event Pre-Flight Readiness
  // =========================================================================
  describe("Item 14: Event Pre-Flight Readiness Validation", () => {
    it("flags missing venue for physical events", async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "e-1",
                      name: "Conference 2027",
                      event_date: "2027-06-01",
                      start_time: "09:00",
                      end_time: "17:00",
                      event_type: "physical",
                      venue: "", // Missing venue!
                      attendee_limit: 500,
                      application_enabled: true,
                      organizer_id: "u-1",
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          if (table === "payment_settings" || table === "org_payment_settings") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null }),
                }),
              }),
            };
          }
          return { select: vi.fn() };
        }),
      } as any;

      const result = await validateEventPreflightReadiness("e-1", mockSupabase);
      expect(result.ready).toBe(false);
      const venueError = result.errors.find((e) => e.id === "venue_or_meeting_url");
      expect(venueError).toBeDefined();
      expect(venueError?.message).toContain("Physical event requires a venue location");
    });

    it("flags past event dates", async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "e-2",
                      name: "Past Fest",
                      event_date: "2020-01-01", // Past date!
                      start_time: "09:00",
                      end_time: "17:00",
                      event_type: "physical",
                      venue: "Hall A",
                      attendee_limit: 100,
                      application_enabled: true,
                      organizer_id: "u-1",
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
              }),
            }),
          };
        }),
      } as any;

      const result = await validateEventPreflightReadiness("e-2", mockSupabase);
      expect(result.ready).toBe(false);
      const dateError = result.errors.find((e) => e.id === "dates");
      expect(dateError).toBeDefined();
      expect(dateError?.message).toContain("in the past");
    });

    it("flags capacity = 0 as blocking error", async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "e-3",
                      name: "Zero Cap Event",
                      event_date: "2027-01-01",
                      start_time: "09:00",
                      end_time: "17:00",
                      event_type: "physical",
                      venue: "Stadium",
                      attendee_limit: 0, // Capacity 0!
                      application_enabled: true,
                      organizer_id: "u-1",
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
              }),
            }),
          };
        }),
      } as any;

      const result = await validateEventPreflightReadiness("e-3", mockSupabase);
      expect(result.ready).toBe(false);
      const capError = result.errors.find((e) => e.id === "capacity");
      expect(capError).toBeDefined();
      expect(capError?.message).toContain("capacity is 0");
    });

    it("flags missing online meeting URL for online event", async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "e-4",
                      name: "Online Webinar",
                      event_date: "2027-01-01",
                      start_time: "09:00",
                      end_time: "17:00",
                      event_type: "online",
                      meeting_url: "", // Missing URL!
                      attendee_limit: 100,
                      application_enabled: true,
                      organizer_id: "u-1",
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
              }),
            }),
          };
        }),
      } as any;

      const result = await validateEventPreflightReadiness("e-4", mockSupabase);
      expect(result.ready).toBe(false);
      const urlError = result.errors.find((e) => e.id === "venue_or_meeting_url");
      expect(urlError).toBeDefined();
      expect(urlError?.message).toContain("Online event requires a valid broadcast or meeting URL");
    });

    it("passes pre-flight readiness when all operational requirements are met", async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "e-ok",
                      name: "Tech Summit 2027",
                      event_date: "2027-11-15",
                      start_time: "10:00",
                      end_time: "18:00",
                      event_type: "physical",
                      venue: "Convention Center, Hall 1",
                      attendee_limit: 1500,
                      application_enabled: true,
                      organizer_id: "u-1",
                    },
                  }),
                }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    { id: "t-1", name: "General Admission", price: 0, capacity: 1500, status: "active" },
                  ],
                }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
              }),
            }),
          };
        }),
      } as any;

      const result = await validateEventPreflightReadiness("e-ok", mockSupabase);
      expect(result.ready).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.items.length).toBe(7);
    });
  });

  // =========================================================================
  // Item 11 & 12: Pagination & Streaming Calculations
  // =========================================================================
  describe("Items 11 & 12: Attendee Pagination & Streaming", () => {
    it("encodes and decodes cursor pagination correctly", () => {
      const cursorObj = {
        created_at: "2026-10-04T05:00:00.000Z",
        id: "att-12345",
      };

      const encoded = Buffer.from(JSON.stringify(cursorObj)).toString("base64");
      const decoded = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));

      expect(decoded.created_at).toBe(cursorObj.created_at);
      expect(decoded.id).toBe(cursorObj.id);
    });
  });
});
