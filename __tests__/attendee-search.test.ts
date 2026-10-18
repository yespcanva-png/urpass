import { describe, it, expect } from "vitest";

describe("Attendee & Entries Search Filter Engine", () => {
  const sampleAttendees = [
    {
      id: "att-1",
      name: "Apex Corporate Delegation",
      email: "apex.delegation@example.com",
      phone: "9876543210",
      pass_type: "vip",
      application_status: "approved" as const,
      pass_status: "generated" as const,
      custom_responses: {
        ticket_type: "VIP Delegation",
        group_attendee_count: 5,
        is_single_group_qr: true,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "att-2",
      name: "TechCorp Engineering Team",
      email: "techcorp.team@example.com",
      phone: "9876543211",
      pass_type: "participant",
      application_status: "approved" as const,
      pass_status: "generated" as const,
      custom_responses: {
        ticket_type: "Corporate Group",
        group_attendee_count: 10,
        is_single_group_qr: true,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "att-3",
      name: "BioInnovate Research",
      email: "bio.research@example.com",
      phone: "9876543212",
      pass_type: "speaker",
      application_status: "approved" as const,
      pass_status: "checked_in" as const,
      custom_responses: {
        ticket_type: "Speaker Group",
        group_attendee_count: 3,
      },
      created_at: new Date().toISOString(),
    },
  ];

  const passTokens: Record<string, string> = {
    "att-1": "tok_apex_secret_123",
    "att-2": "tok_techcorp_master_456",
    "att-3": "tok_bio_speaker_789",
  };

  const groupPasses: Record<string, { totalGuests: number; checkedInGuests: number; isGroupMaster: boolean }> = {
    "att-1": { totalGuests: 5, checkedInGuests: 0, isGroupMaster: true },
    "att-2": { totalGuests: 10, checkedInGuests: 0, isGroupMaster: true },
    "att-3": { totalGuests: 3, checkedInGuests: 1, isGroupMaster: true },
  };

  function searchFilter(query: string) {
    if (!query) return sampleAttendees;
    const q = query.toLowerCase().trim();
    if (!q) return sampleAttendees;

    return sampleAttendees.filter((a) => {
      // 1. Direct fields: name, email, role/pass_type, status
      if (a.name?.toLowerCase().includes(q)) return true;
      if (a.email?.toLowerCase().includes(q)) return true;
      if (a.pass_type?.toLowerCase().includes(q)) return true;
      if (a.application_status?.toLowerCase().includes(q)) return true;
      if (a.pass_status?.toLowerCase().includes(q)) return true;

      // Phone: require at least 3 digits to match phone to prevent single-digit false positives on numbers
      if (a.phone) {
        const cleanPhone = a.phone.replace(/[^\d]/g, "");
        const cleanQ = q.replace(/[^\d]/g, "");
        if (cleanQ.length >= 3 && cleanPhone.includes(cleanQ)) return true;
      }

      // 2. Pass Token / QR credential reference (minimum 4 chars to avoid single-digit collision)
      const token = passTokens[a.id];
      if (token && q.length >= 4 && token.toLowerCase().includes(q)) return true;

      // 3. Single Group QR / Entries / Guests count
      const group = groupPasses[a.id];
      const cr = (a.custom_responses || {}) as Record<string, any>;
      const totalGuests = group?.totalGuests || Number(cr.group_attendee_count || cr.guest_count || cr.total_guests || cr.bulk_quantity || 0);
      if (totalGuests > 0) {
        if (q === String(totalGuests) || q === `${totalGuests} entries` || q === `${totalGuests} guests` || q === `${totalGuests} pax`) return true;
        if (`${totalGuests} entries`.includes(q) || `${totalGuests} guests`.includes(q)) return true;
        if (["group", "single qr", "master", "entries", "entry"].includes(q)) return true;
      }

      // 4. Custom responses (e.g. ticket_type, organization, delegation, company, notes)
      if (a.custom_responses && typeof a.custom_responses === "object") {
        for (const [key, val] of Object.entries(a.custom_responses)) {
          if (val !== null && val !== undefined && key !== "is_single_group_qr") {
            const strVal = String(val).toLowerCase();
            if (strVal === q || (q.length >= 2 && strVal.includes(q))) return true;
          }
        }
      }

      return false;
    });
  }

  it("searches entries by entry count (5 vs 10 entries)", () => {
    const results5 = searchFilter("5");
    expect(results5.map((r) => r.id)).toEqual(["att-1"]);

    const results10 = searchFilter("10 entries");
    expect(results10.map((r) => r.id)).toEqual(["att-2"]);

    const results3 = searchFilter("3 guests");
    expect(results3.map((r) => r.id)).toEqual(["att-3"]);
  });

  it("searches entries by name and email substring", () => {
    expect(searchFilter("apex").map((r) => r.id)).toEqual(["att-1"]);
    expect(searchFilter("techcorp.team").map((r) => r.id)).toEqual(["att-2"]);
    expect(searchFilter("bio").map((r) => r.id)).toEqual(["att-3"]);
  });

  it("searches entries by phone number", () => {
    expect(searchFilter("9876543210").map((r) => r.id)).toEqual(["att-1"]);
    expect(searchFilter("9876543211").map((r) => r.id)).toEqual(["att-2"]);
  });

  it("searches entries by pass token / credential reference", () => {
    expect(searchFilter("tok_apex_secret").map((r) => r.id)).toEqual(["att-1"]);
    expect(searchFilter("tok_techcorp").map((r) => r.id)).toEqual(["att-2"]);
  });

  it("searches entries by pass type / role", () => {
    expect(searchFilter("vip").map((r) => r.id)).toEqual(["att-1"]);
    expect(searchFilter("speaker").map((r) => r.id)).toEqual(["att-3"]);
  });

  it("searches entries by ticket type in custom responses", () => {
    expect(searchFilter("Corporate Group").map((r) => r.id)).toEqual(["att-2"]);
    expect(searchFilter("VIP Delegation").map((r) => r.id)).toEqual(["att-1"]);
  });

  it("returns all when search query is empty or whitespace", () => {
    expect(searchFilter("").length).toBe(3);
    expect(searchFilter("   ").length).toBe(3);
  });
});
