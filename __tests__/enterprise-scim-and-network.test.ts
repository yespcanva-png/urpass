import { describe, it, expect, vi } from "vitest";

// ── Mock Next.js & Supabase ───────────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import {
  validateCidr,
  isIpAllowed,
  isIpv4InCidr,
  extractClientIp,
} from "@/lib/sso/ip-allowlist";
import {
  getScimServiceProviderConfig,
  getScimSchemas,
  formatScimUser,
  hashScimToken,
  generateScimToken,
  SCIM_SCHEMAS,
} from "@/lib/sso/scim";
import { securityPoliciesSchema, domainSchema } from "@/lib/validations/sso";

describe("IP & CIDR Network Allowlist Engine", () => {
  describe("validateCidr", () => {
    it("accepts valid IPv4 single addresses", () => {
      expect(validateCidr("192.168.1.1").valid).toBe(true);
      expect(validateCidr("10.0.0.1").valid).toBe(true);
      expect(validateCidr("172.16.0.100").valid).toBe(true);
    });

    it("accepts valid IPv4 CIDR blocks", () => {
      expect(validateCidr("192.168.1.0/24").valid).toBe(true);
      expect(validateCidr("10.0.0.0/8").valid).toBe(true);
      expect(validateCidr("172.16.0.0/16").valid).toBe(true);
      expect(validateCidr("10.20.30.40/32").valid).toBe(true);
      expect(validateCidr("0.0.0.0/0").valid).toBe(true);
    });

    it("accepts valid IPv6 addresses and CIDRs", () => {
      expect(validateCidr("2001:db8::1").valid).toBe(true);
      expect(validateCidr("2001:db8::/32").valid).toBe(true);
      expect(validateCidr("::1").valid).toBe(true);
    });

    it("rejects invalid IP addresses and malformed CIDRs", () => {
      expect(validateCidr("not-an-ip").valid).toBe(false);
      expect(validateCidr("999.999.999.999").valid).toBe(false);
      expect(validateCidr("192.168.1.1/33").valid).toBe(false); // prefix > 32
      expect(validateCidr("192.168.1.1/-1").valid).toBe(false);
      expect(validateCidr("192.168.1.1/abc").valid).toBe(false);
      expect(validateCidr("").valid).toBe(false);
    });
  });

  describe("isIpv4InCidr", () => {
    it("correctly identifies IPs within a subnet", () => {
      expect(isIpv4InCidr("192.168.1.45", "192.168.1.0/24")).toBe(true);
      expect(isIpv4InCidr("192.168.1.1", "192.168.1.0/24")).toBe(true);
      expect(isIpv4InCidr("192.168.1.254", "192.168.1.0/24")).toBe(true);
    });

    it("correctly rejects IPs outside a subnet", () => {
      expect(isIpv4InCidr("192.168.2.1", "192.168.1.0/24")).toBe(false);
      expect(isIpv4InCidr("10.0.0.1", "192.168.1.0/24")).toBe(false);
    });

    it("handles /32 exact match", () => {
      expect(isIpv4InCidr("10.5.5.5", "10.5.5.5/32")).toBe(true);
      expect(isIpv4InCidr("10.5.5.6", "10.5.5.5/32")).toBe(false);
    });

    it("handles /0 all-inclusive match", () => {
      expect(isIpv4InCidr("1.2.3.4", "0.0.0.0/0")).toBe(true);
      expect(isIpv4InCidr("203.0.113.195", "0.0.0.0/0")).toBe(true);
    });
  });

  describe("isIpAllowed", () => {
    it("allows all IPs if allowlist is empty", () => {
      expect(isIpAllowed("1.2.3.4", [])).toBe(true);
      expect(isIpAllowed("192.168.1.1", [])).toBe(true);
    });

    it("allows IP if present as single IP without mask", () => {
      const allowed = ["203.0.113.50", "198.51.100.1"];
      expect(isIpAllowed("203.0.113.50", allowed)).toBe(true);
      expect(isIpAllowed("203.0.113.51", allowed)).toBe(false);
    });

    it("allows IP if it falls into one of several CIDR ranges", () => {
      const allowed = [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "203.0.113.50/32",
      ];
      expect(isIpAllowed("10.250.1.20", allowed)).toBe(true);
      expect(isIpAllowed("172.20.10.5", allowed)).toBe(true);
      expect(isIpAllowed("192.168.100.4", allowed)).toBe(true);
      expect(isIpAllowed("203.0.113.50", allowed)).toBe(true);
      expect(isIpAllowed("203.0.113.51", allowed)).toBe(false);
      expect(isIpAllowed("8.8.8.8", allowed)).toBe(false);
    });

    it("ignores whitespace and blank lines", () => {
      const allowed = ["  10.0.0.0/8  ", "", "  ", "192.168.1.1"];
      expect(isIpAllowed("10.1.2.3", allowed)).toBe(true);
      expect(isIpAllowed("192.168.1.1", allowed)).toBe(true);
      expect(isIpAllowed("192.168.1.2", allowed)).toBe(false);
    });
  });

  describe("extractClientIp", () => {
    it("extracts from x-forwarded-for (first IP in proxy chain)", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "203.0.113.195, 10.0.0.1, 172.16.0.1");
      expect(extractClientIp(headers)).toBe("203.0.113.195");
    });

    it("extracts from cf-connecting-ip (Cloudflare)", () => {
      const headers = new Headers();
      headers.set("cf-connecting-ip", "198.51.100.77");
      expect(extractClientIp(headers)).toBe("198.51.100.77");
    });

    it("prefers x-forwarded-for over cf-connecting-ip", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "203.0.113.195");
      headers.set("cf-connecting-ip", "198.51.100.77");
      expect(extractClientIp(headers)).toBe("203.0.113.195");
    });

    it("falls back to 127.0.0.1 if no IP headers present", () => {
      const headers = new Headers();
      expect(extractClientIp(headers)).toBe("127.0.0.1");
    });
  });
});

describe("SCIM 2.0 Directory Service Engine (RFC 7643 / RFC 7644)", () => {
  const baseUrl = "https://app.urpass.in/api/scim/v2/org-123";

  it("generates and verifies secure SCIM directory tokens", () => {
    const { rawToken, tokenHash, tokenHint } = generateScimToken();
    expect(rawToken).toMatch(/^scim_live_[a-f0-9]{64}$/);
    expect(tokenHash).toBe(hashScimToken(rawToken));
    expect(tokenHint).toMatch(/^scim_\.\.\.[a-f0-9]{4}$/);
  });

  it("provides RFC 7643 compliant ServiceProviderConfig", () => {
    const config = getScimServiceProviderConfig(baseUrl);
    expect(config.schemas).toContain(SCIM_SCHEMAS.SERVICE_PROVIDER_CONFIG);
    expect(config.patch.supported).toBe(true);
    expect(config.bulk.supported).toBe(false);
    expect(config.filter.supported).toBe(true);
    expect(config.changePassword.supported).toBe(false);
    expect(config.sort.supported).toBe(false);
    expect(config.etag.supported).toBe(false);
    expect(config.authenticationSchemes).toHaveLength(1);
    expect(config.authenticationSchemes[0].type).toBe("oauthbearertoken");
  });

  it("provides RFC 7643 Schemas listing User and ServiceProviderConfig", () => {
    const schemas = getScimSchemas();
    expect(schemas.schemas).toContain(SCIM_SCHEMAS.LIST_RESPONSE);
    expect(schemas.totalResults).toBe(2);
    expect(schemas.Resources).toHaveLength(2);
    expect(schemas.Resources[0].id).toBe(SCIM_SCHEMAS.USER);
    expect(schemas.Resources[1].id).toBe(SCIM_SCHEMAS.SERVICE_PROVIDER_CONFIG);
  });

  it("formats user object to RFC 7643 SCIM User schema", () => {
    const scimUser = formatScimUser(
      {
        id: "mem-abc",
        user_id: "usr-456",
        status: "active",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-15T00:00:00Z",
      },
      {
        full_name: "Jane Doe",
        email: "jane.doe@enterprise.com",
      },
      baseUrl
    );

    expect(scimUser.schemas).toContain(SCIM_SCHEMAS.USER);
    expect(scimUser.id).toBe("mem-abc");
    expect(scimUser.externalId).toBe("usr-456");
    expect(scimUser.userName).toBe("jane.doe@enterprise.com");
    expect(scimUser.name?.formatted).toBe("Jane Doe");
    expect(scimUser.name?.givenName).toBe("Jane");
    expect(scimUser.name?.familyName).toBe("Doe");
    expect(scimUser.active).toBe(true);
    expect(scimUser.emails[0].value).toBe("jane.doe@enterprise.com");
    expect(scimUser.emails[0].primary).toBe(true);
    expect(scimUser.meta.resourceType).toBe("User");
    expect(scimUser.meta.location).toBe(`${baseUrl}/Users/mem-abc`);
  });

  it("marks user as inactive if organization member status is suspended", () => {
    const scimUser = formatScimUser(
      {
        id: "mem-suspended",
        user_id: "usr-789",
        status: "suspended",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-02-01T00:00:00Z",
      },
      {
        full_name: "Former Employee",
        email: "former.employee@enterprise.com",
      },
      baseUrl
    );

    expect(scimUser.active).toBe(false);
  });
});

describe("Enterprise Security Policies Validation", () => {
  it("validates valid security policies schema", () => {
    const valid = {
      enforce_sso: true,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 60,
      enforce_2fa: true,
      allowed_domains: ["acme.com", "partner.io"],
      allowed_cidrs: ["192.168.1.0/24", "10.0.0.0/8"],
      enforce_ip_allowlist: true,
      anonymize_pii_days: 90,
    };

    const res = securityPoliciesSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("allows anonymize_pii_days to be null or undefined", () => {
    const valid = {
      enforce_sso: false,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 1440,
      enforce_2fa: false,
      allowed_domains: [],
      allowed_cidrs: [],
      enforce_ip_allowlist: false,
      anonymize_pii_days: null,
    };

    const res = securityPoliciesSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects invalid session timeout values", () => {
    const invalid = {
      enforce_sso: false,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 5, // minimum is 15 minutes
      enforce_2fa: false,
      allowed_domains: [],
      allowed_cidrs: [],
      enforce_ip_allowlist: false,
    };

    const res = securityPoliciesSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("Custom Domains Validation", () => {
  it("accepts valid custom domain names", () => {
    expect(domainSchema.safeParse({ domain: "events.company.com" }).success).toBe(true);
    expect(domainSchema.safeParse({ domain: "tickets.university.edu" }).success).toBe(true);
    expect(domainSchema.safeParse({ domain: "my-summit.brand.co.uk" }).success).toBe(true);
  });

  it("rejects invalid domain names", () => {
    expect(domainSchema.safeParse({ domain: "not a domain" }).success).toBe(false);
    expect(domainSchema.safeParse({ domain: "https://company.com" }).success).toBe(false);
    expect(domainSchema.safeParse({ domain: "events/subpath" }).success).toBe(false);
  });
});
