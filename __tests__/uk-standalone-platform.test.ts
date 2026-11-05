import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { resolveDomainRoute, isUkHost } from "@/lib/routing/domain-router";
import { generateUkInvoicePdf } from "@/lib/invoices-uk";
import {
  generatePassToken,
  generateErasureReference,
  generateVerificationToken,
  isValidPassToken,
  sanitizeCsvCell,
  buildSanitizedCsv,
  formatPassPayload,
} from "@/lib/core";
import { MARKETS, isPaidMarketAvailable } from "@/lib/markets/config";
import { formatPrice, convertToSubunits, convertSubunitsToMajor } from "@/lib/markets/currency";
import { localEventTimeToUtc, eventUtcRange } from "@/lib/markets/timezone";

describe("UrPass UK — Standalone Sovereign Platform Suite", () => {
  describe("1. Domain & Multi-Zone Routing (uk.urpass.space & app.uk.urpass.space)", () => {
    it("routes root of uk.urpass.space to UK marketing homepage (/uk)", () => {
      const res = resolveDomainRoute("uk.urpass.space", "/");
      expect(res.isUkMarketing).toBe(true);
      expect(res.isUkApp).toBe(false);
      expect(res.rewritePath).toBe("/uk");
      expect(res.redirectUrl).toBeUndefined();
    });

    it("redirects dashboard attempts on marketing domain to app.uk.urpass.space", () => {
      const res = resolveDomainRoute("uk.urpass.space", "/dashboard");
      expect(res.isUkMarketing).toBe(true);
      expect(res.redirectUrl).toBe("https://app.uk.urpass.space/dashboard");
    });

    it("redirects root of app.uk.urpass.space to dashboard", () => {
      const res = resolveDomainRoute("app.uk.urpass.space", "/");
      expect(res.isUkApp).toBe(true);
      expect(res.isUkMarketing).toBe(false);
      expect(res.redirectUrl).toBe("https://app.uk.urpass.space/dashboard");
    });

    it("preserves apex domain urpass.space for Indian production without interference", () => {
      const res = resolveDomainRoute("urpass.space", "/event/evt-123");
      expect(res.isIndiaPlatform).toBe(true);
      expect(res.isUkMarketing).toBe(false);
      expect(res.isUkApp).toBe(false);
      expect(res.rewritePath).toBeUndefined();
      expect(res.redirectUrl).toBeUndefined();
    });

    it("correctly identifies UK hostnames", () => {
      expect(isUkHost("uk.urpass.space")).toBe(true);
      expect(isUkHost("app.uk.urpass.space")).toBe(true);
      expect(isUkHost("staging.uk.urpass.space")).toBe(true);
      expect(isUkHost("urpass.space")).toBe(false);
      expect(isUkHost("localhost:3000")).toBe(false);
    });
  });

  describe("2. Reusable Core: Cryptographic Tokens & Formatting", () => {
    it("generates 64-char high-entropy hex pass tokens", () => {
      const token = generatePassToken();
      expect(token).toHaveLength(64);
      expect(isValidPassToken(token)).toBe(true);
    });

    it("rejects malformed pass tokens", () => {
      expect(isValidPassToken("short-token")).toBe(false);
      expect(isValidPassToken("g".repeat(64))).toBe(false); // non-hex
      expect(isValidPassToken(null)).toBe(false);
    });

    it("generates formatted privacy erasure references", () => {
      const ref = generateErasureReference("UK-GDPR");
      expect(ref).toMatch(/^UK-GDPR-[A-F0-9]{8}$/);
    });

    it("generates email verification tokens", () => {
      const token = generateVerificationToken();
      expect(token).toHaveLength(48); // 24 bytes in hex
    });

    it("formats standard pass payload for Apple Wallet and email tickets", () => {
      const payload = formatPassPayload({
        passToken: "a".repeat(64),
        eventName: "London Tech Summit 2026",
        attendeeName: "Oliver Smith",
        attendeeEmail: "oliver@example.co.uk",
        passType: "delegate",
        eventDate: "2026-11-20",
        startTime: "09:30",
        endTime: "17:00",
        startsAtUtc: "2026-11-20T09:30:00.000Z",
        venue: "ExCeL London",
        timezone: "Europe/London",
        currency: "GBP",
        priceMinor: 0,
        qrPayloadUrl: "https://app.uk.urpass.space/pass/123",
      });

      expect(payload.displayPrice).toBe("Free");
      expect(payload.formattedAttendee).toBe("Oliver Smith (oliver@example.co.uk)");
      expect(payload.badgeTitle).toBe("London Tech Summit 2026 — DELEGATE");
    });
  });

  describe("3. Security: CSV Formula Injection Sanitization (CWE-1236)", () => {
    it("escapes dangerous formula triggers (=, +, -, @, tab, cr)", () => {
      expect(sanitizeCsvCell("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
      expect(sanitizeCsvCell("+cmd|' /C calc'!A0")).toBe("'+cmd|' /C calc'!A0");
      expect(sanitizeCsvCell("-10+20")).toBe("'-10+20");
      expect(sanitizeCsvCell("@malicious")).toBe("'@malicious");
      expect(sanitizeCsvCell("\tindented")).toBe("'\tindented");
    });

    it("leaves safe strings and numbers unescaped", () => {
      expect(sanitizeCsvCell("Jane Doe")).toBe("Jane Doe");
      expect(sanitizeCsvCell("jane.doe@cambridge.ac.uk")).toBe("jane.doe@cambridge.ac.uk");
      expect(sanitizeCsvCell(100)).toBe("100");
    });

    it("escapes quotes and wraps in quotes when comma or newline is present", () => {
      expect(sanitizeCsvCell('Acme, "Inc."')).toBe('"Acme, ""Inc."""');
    });

    it("builds clean sanitized CSV output from attendee rows", () => {
      const headers = [
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email Address" },
        { key: "notes", label: "Notes" },
      ] as const;

      const rows = [
        { name: "Alice", email: "alice@test.com", notes: "Regular" },
        { name: "Bob", email: "bob@test.com", notes: "=1+1" },
      ];

      const csv = buildSanitizedCsv(headers as any, rows);
      expect(csv).toContain("Full Name,Email Address,Notes");
      expect(csv).toContain("Alice,alice@test.com,Regular");
      expect(csv).toContain("Bob,bob@test.com,'=1+1");
    });
  });

  describe("4. UK Invoice & VAT Engine (HMRC-compliant)", () => {
    it("generates a valid free pass receipt PDF with zero VAT", async () => {
      const res = await generateUkInvoicePdf({
        invoiceNumber: "UK-REC-2026-0001",
        issueDate: "2026-11-05",
        customerName: "Dr. James Watson",
        customerEmail: "j.watson@ucl.ac.uk",
        customerOrgName: "University College London",
        lineItems: [
          {
            description: "Academic Symposium Free Delegate Pass",
            quantity: 1,
            unitPriceMinor: 0,
            vatRatePercent: 0,
          },
        ],
      });

      expect(res.subtotalMinor).toBe(0);
      expect(res.vatAmountMinor).toBe(0);
      expect(res.totalAmountMinor).toBe(0);
      expect(res.formattedTotal).toBe("Free");
      expect(res.pdfBytes).toBeInstanceOf(Uint8Array);
      expect(res.pdfBytes.length).toBeGreaterThan(1000); // Valid PDF binary
    });

    it("correctly calculates 20% UK VAT on paid line items", async () => {
      const res = await generateUkInvoicePdf({
        invoiceNumber: "UK-INV-2026-0042",
        issueDate: "2026-11-05",
        sellerName: "UrPass UK Ltd",
        sellerVatNumber: "GB 987 6543 21",
        customerName: "Emma Clark",
        customerEmail: "emma@brightonagency.co.uk",
        lineItems: [
          {
            description: "Pro Annual Event Subscription",
            quantity: 1,
            unitPriceMinor: 30000, // £300.00
            vatRatePercent: 20,
          },
        ],
      });

      expect(res.subtotalMinor).toBe(30000);
      expect(res.vatAmountMinor).toBe(6000); // 20% of £300 = £60.00
      expect(res.totalAmountMinor).toBe(36000); // £360.00
      expect(res.formattedTotal).toBe("£360.00");
    });
  });

  describe("5. Sovereign UK Database Migration & Schema Integrity", () => {
    it("verifies 001_uk_platform_baseline.sql exists and contains sovereign schema", () => {
      const migrationPath = path.join(process.cwd(), "supabase/migrations_uk/001_uk_platform_baseline.sql");
      expect(fs.existsSync(migrationPath)).toBe(true);

      const content = fs.readFileSync(migrationPath, "utf8");

      // Verify sovereign defaults
      expect(content).toContain("country_code text NOT NULL DEFAULT 'GB'");
      expect(content).toContain("currency text NOT NULL DEFAULT 'GBP'");
      expect(content).toContain("timezone text NOT NULL DEFAULT 'Europe/London'");
      expect(content).toContain("locale text NOT NULL DEFAULT 'en-GB'");

      // Verify core tables
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.organizations");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.events");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.ticket_types");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.attendees");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.passes");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.check_ins");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.privacy_erasure_requests");
      expect(content).toContain("CREATE TABLE IF NOT EXISTS public.lead_captures");

      // Verify atomic check-in RPCs
      expect(content).toContain("CREATE OR REPLACE FUNCTION public.atomic_check_in_pass");
      expect(content).toContain("CREATE OR REPLACE FUNCTION public.group_entry_checkin");

      // Verify strict service-role policy on privacy erasure
      expect(content).toContain("CREATE POLICY \"privacy_erasure_service_only\" ON public.privacy_erasure_requests");

      // Ensure NO Indian rupee/paise assumptions in UK baseline
      expect(content).not.toContain("amount_paise");
      expect(content).not.toContain("gross_amount_paise");
      expect(content).not.toContain("tax_paise");
    });

    it("verifies .env.uk.example exists and contains proper UK configuration", () => {
      const envPath = path.join(process.cwd(), ".env.uk.example");
      expect(fs.existsSync(envPath)).toBe(true);

      const content = fs.readFileSync(envPath, "utf8");
      expect(content).toContain("NEXT_PUBLIC_APP_URL=https://app.uk.urpass.space");
      expect(content).toContain("NEXT_PUBLIC_MARKETING_URL=https://uk.urpass.space");
      expect(content).toContain("NEXT_PUBLIC_DEFAULT_COUNTRY=GB");
      expect(content).toContain("NEXT_PUBLIC_DEFAULT_CURRENCY=GBP");
      expect(content).toContain("NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/London");
      expect(content).toContain("NEXT_PUBLIC_UK_PAID_TICKETING=false");
      expect(content).toContain("NEXT_PUBLIC_UK_ORGANIZER_MOR=false");
    });
  });

  describe("6. Financial Safety & Fail-Closed Guardrails", () => {
    it("confirms UK market config specifies GBP and disabled payments", () => {
      const gb = MARKETS.GB;
      expect(gb.currency).toBe("GBP");
      expect(gb.currencySymbol).toBe("£");
      expect(gb.defaultTimezone).toBe("Europe/London");
      expect(gb.paymentsEnabled).toBe(false);
      expect(gb.defaultGateway).toBe("pending");
      expect(isPaidMarketAvailable("GBP")).toBe(false);
    });

    it("confirms Indian market config remains fully enabled with INR", () => {
      const ind = MARKETS.IN;
      expect(ind.currency).toBe("INR");
      expect(ind.currencySymbol).toBe("₹");
      expect(ind.defaultTimezone).toBe("Asia/Kolkata");
      expect(ind.paymentsEnabled).toBe(true);
      expect(ind.defaultGateway).toBe("razorpay");
      expect(isPaidMarketAvailable("INR")).toBe(true);
    });
  });

  describe("7. Minor-Unit Decimal Arithmetic (Pence / Paise)", () => {
    it("converts major string amounts to minor pence accurately without floating point error", () => {
      expect(convertToSubunits("15.00")).toBe(1500);
      expect(convertToSubunits("39.99")).toBe(3999);
      expect(convertToSubunits("0.50")).toBe(50);
      expect(convertToSubunits("0")).toBe(0);
      expect(convertToSubunits("1299")).toBe(129900);
    });

    it("converts minor pence back to major units", () => {
      expect(convertSubunitsToMajor(1500)).toBe(15);
      expect(convertSubunitsToMajor(3999)).toBe(39.99);
      expect(convertSubunitsToMajor(0)).toBe(0);
    });

    it("formats UK price strings with proper currency symbols", () => {
      expect(formatPrice(0, "GBP")).toBe("Free");
      expect(formatPrice(1500, "GBP")).toBe("£15");
      expect(formatPrice(3999, "GBP")).toBe("£39.99");
    });
  });

  describe("8. UK Timezone (BST / GMT) & UTC Persistence", () => {
    it("converts British Summer Time (BST, UTC+1) event to correct UTC instant", () => {
      // 15 July 2026 is during BST (UTC+1)
      const utc = localEventTimeToUtc("2026-07-15", "14:00", "Europe/London");
      expect(utc).toBe("2026-07-15T13:00:00.000Z");
    });

    it("converts Greenwich Mean Time (GMT, UTC+0) event to correct UTC instant", () => {
      // 15 December 2026 is during GMT (UTC+0)
      const utc = localEventTimeToUtc("2026-12-15", "14:00", "Europe/London");
      expect(utc).toBe("2026-12-15T14:00:00.000Z");
    });

    it("computes event start and end UTC range properly", () => {
      const range = eventUtcRange({
        event_date: "2026-10-10",
        start_time: "10:00",
        end_time: "18:00",
        timezone: "Europe/London",
      });
      // October 10 is BST (UTC+1)
      expect(range.startsAtUtc).toBe("2026-10-10T09:00:00.000Z");
      expect(range.endsAtUtc).toBe("2026-10-10T17:00:00.000Z");
    });
  });
});
