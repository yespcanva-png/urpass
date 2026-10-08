import { describe, it, expect, vi } from "vitest";
import {
  parseDomainParts,
  getDnsInstructionsForDomain,
  checkCustomDomainRealtime,
  checkTxtVerificationRealtime,
  PRIMARY_CNAME_TARGET,
  SECONDARY_CNAME_TARGET,
  ACCEPTED_APEX_IPS,
} from "@/lib/dns/realtime-dns";
import { checkDomainDnsLive } from "@/app/actions/custom-domains";

describe("Real-Time DNS Resolver & Domain Diagnostics", () => {
  describe("parseDomainParts", () => {
    it("parses standard subdomain correctly", () => {
      const parsed = parseDomainParts("events.acmecorp.com");
      expect(parsed.cleanDomain).toBe("events.acmecorp.com");
      expect(parsed.isApex).toBe(false);
      expect(parsed.subdomainPart).toBe("events");
      expect(parsed.apexDomain).toBe("acmecorp.com");
    });

    it("parses multi-level subdomain correctly", () => {
      const parsed = parseDomainParts("annual.summit.techcorp.io");
      expect(parsed.cleanDomain).toBe("annual.summit.techcorp.io");
      expect(parsed.isApex).toBe(false);
      expect(parsed.subdomainPart).toBe("annual.summit");
      expect(parsed.apexDomain).toBe("techcorp.io");
    });

    it("parses apex domain correctly", () => {
      const parsed = parseDomainParts("acmecorp.com");
      expect(parsed.cleanDomain).toBe("acmecorp.com");
      expect(parsed.isApex).toBe(true);
      expect(parsed.subdomainPart).toBe("@");
      expect(parsed.apexDomain).toBe("acmecorp.com");
    });

    it("parses two-part country code TLDs correctly (e.g. .co.uk)", () => {
      const apex = parseDomainParts("events.co.uk");
      expect(apex.isApex).toBe(true);
      expect(apex.subdomainPart).toBe("@");

      const sub = parseDomainParts("summit.events.co.uk");
      expect(sub.isApex).toBe(false);
      expect(sub.subdomainPart).toBe("summit");
      expect(sub.apexDomain).toBe("events.co.uk");
    });

    it("parses Indian academic and commercial domains (.co.in, .edu.in)", () => {
      const sub = parseDomainParts("fest.iitm.edu.in");
      expect(sub.isApex).toBe(false);
      expect(sub.subdomainPart).toBe("fest");
      expect(sub.apexDomain).toBe("iitm.edu.in");
    });

    it("sanitizes protocol, paths, and trailing dots", () => {
      const parsed = parseDomainParts("https://tickets.startup.org/events/123.");
      expect(parsed.cleanDomain).toBe("tickets.startup.org");
      expect(parsed.subdomainPart).toBe("tickets");
      expect(parsed.apexDomain).toBe("startup.org");
    });
  });

  describe("getDnsInstructionsForDomain", () => {
    it("generates CNAME records for subdomain", () => {
      const instructions = getDnsInstructionsForDomain("events.mycompany.com");
      expect(instructions.length).toBeGreaterThanOrEqual(1);

      const primary = instructions[0];
      expect(primary.type).toBe("CNAME");
      expect(primary.name).toBe("events");
      expect(primary.value).toBe(PRIMARY_CNAME_TARGET);
      expect(primary.recommended).toBe(true);
    });

    it("generates A and ALIAS records for apex domain", () => {
      const instructions = getDnsInstructionsForDomain("mycompany.com");
      const aRecord = instructions.find((i) => i.type === "A");
      const aliasRecord = instructions.find((i) => i.type === "ALIAS");

      expect(aRecord).toBeDefined();
      expect(aRecord?.name).toBe("@");
      expect(ACCEPTED_APEX_IPS).toContain(aRecord?.value);

      expect(aliasRecord).toBeDefined();
      expect(aliasRecord?.name).toBe("@");
      expect(aliasRecord?.value).toBe(PRIMARY_CNAME_TARGET);
    });
  });

  describe("checkCustomDomainRealtime", () => {
    it("verifies mock valid domain successfully", async () => {
      const res = await checkCustomDomainRealtime("events.mock.test");
      expect(res.verified).toBe(true);
      expect(res.status).toBe("verified");
      expect(res.detectedCnames).toContain(PRIMARY_CNAME_TARGET);
      expect(res.dnsInstructions.length).toBeGreaterThan(0);
      expect(res.message).toContain("verified and active");
    });

    it("returns pending status for mock failing domain", async () => {
      const res = await checkCustomDomainRealtime("events.fail.mock.test");
      expect(res.verified).toBe(false);
      expect(res.status).toBe("pending");
      expect(res.detectedCnames).toHaveLength(0);
    });
  });

  describe("checkTxtVerificationRealtime", () => {
    it("verifies mock TXT token successfully", async () => {
      const token = "urpass-domain-verification=12345678abcdef";
      const res = await checkTxtVerificationRealtime("mock.test", token);
      expect(res.verified).toBe(true);
      expect(res.recordsFound).toContain(token);
    });

    it("reports failure when token does not match on fail mock", async () => {
      const token = "urpass-domain-verification=secret-token";
      const res = await checkTxtVerificationRealtime("fail.mock.test", token);
      expect(res.verified).toBe(false);
    });
  });

  describe("checkDomainDnsLive Action", () => {
    it("returns error for empty domain", async () => {
      const res = await checkDomainDnsLive("");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Domain name is required.");
    });

    it("returns real-time diagnostics for valid domain string", async () => {
      const res = await checkDomainDnsLive("conference.mock.test");
      expect(res.success).toBe(true);
      expect(res.diagnostics).toBeDefined();
      expect(res.diagnostics?.domain).toBe("conference.mock.test");
      expect(res.diagnostics?.subdomainPart).toBe("conference");
    });
  });
});
