import { describe, it, expect, vi, beforeEach } from "vitest";

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
  generateSpEntityId,
  generateAcsUrl,
  generateSpMetadataXml,
  createSamlAuthnRequest,
  validateSamlCertificate,
  validateSamlResponse,
} from "@/lib/sso/saml";
import {
  buildOidcAuthorizationUrl,
  parseJwtPayload,
} from "@/lib/sso/oidc";
import {
  generateVerificationToken,
  checkDnsTxtRecord,
} from "@/lib/sso/domain-verification";
import {
  ssoConnectionSchema,
  domainSchema,
  securityPoliciesSchema,
} from "@/lib/validations/sso";
import dns from "node:dns";

// ── 1. SAML Protocol Tests ────────────────────────────────────────────────────

describe("SAML 2.0 Engine", () => {
  const orgId = "org-test-uuid-123";

  it("generates correct SP Entity ID and ACS URL", () => {
    const spEntityId = generateSpEntityId(orgId);
    const acsUrl = generateAcsUrl(orgId);

    expect(spEntityId).toContain(`/api/auth/sso/saml/metadata/${orgId}`);
    expect(acsUrl).toContain(`/api/auth/sso/saml/acs/${orgId}`);
  });

  it("generates standard SAML 2.0 SP Metadata XML", () => {
    const xml = generateSpMetadataXml(orgId, "Acme Corp");
    expect(xml).toContain("<md:EntityDescriptor");
    expect(xml).toContain("urn:oasis:names:tc:SAML:2.0:metadata");
    expect(xml).toContain("AssertionConsumerService");
    expect(xml).toContain("Acme Corp");
    expect(xml).toContain(generateAcsUrl(orgId));
  });

  it("creates SAML AuthnRequest with deflated base64 redirect URL", () => {
    const spEntityId = generateSpEntityId(orgId);
    const acsUrl = generateAcsUrl(orgId);
    const idpSsoUrl = "https://idp.example.com/sso/saml";

    const request = createSamlAuthnRequest({
      spEntityId,
      acsUrl,
      idpSsoUrl,
      relayState: "custom-state-value",
    });

    expect(request.id).toMatch(/^_urpass_/);
    expect(request.xml).toContain("<samlp:AuthnRequest");
    expect(request.xml).toContain(spEntityId);
    expect(request.redirectUrl).toContain("https://idp.example.com/sso/saml");
    expect(request.redirectUrl).toContain("SAMLRequest=");
    expect(request.redirectUrl).toContain("RelayState=custom-state-value");
  });

  it("validates X.509 certificates correctly", () => {
    const emptyResult = validateSamlCertificate("");
    expect(emptyResult.valid).toBe(false);

    const invalidResult = validateSamlCertificate("not-a-certificate");
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain("Invalid X.509");
  });

  it("parses valid SAML Response and extracts claims", () => {
    const sampleSamlXml = `
      <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Version="2.0">
        <samlp:Status>
          <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
        </samlp:Status>
        <saml:Assertion Version="2.0">
          <saml:Issuer>https://idp.company.com</saml:Issuer>
          <saml:Subject>
            <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">alice@company.com</saml:NameID>
          </saml:Subject>
          <saml:AttributeStatement>
            <saml:Attribute Name="email">
              <saml:AttributeValue>alice@company.com</saml:AttributeValue>
            </saml:Attribute>
            <saml:Attribute Name="name">
              <saml:AttributeValue>Alice Smith</saml:AttributeValue>
            </saml:Attribute>
            <saml:Attribute Name="role">
              <saml:AttributeValue>admin</saml:AttributeValue>
            </saml:Attribute>
          </saml:AttributeStatement>
        </saml:Assertion>
      </samlp:Response>
    `;

    const res = validateSamlResponse(sampleSamlXml);
    expect(res.valid).toBe(true);
    expect(res.email).toBe("alice@company.com");
    expect(res.name).toBe("Alice Smith");
    expect(res.role).toBe("admin");
    expect(res.idpEntityId).toBe("https://idp.company.com");
  });

  it("handles base64 encoded SAML responses", () => {
    const sampleXml = `
      <Response xmlns="urn:oasis:names:tc:SAML:2.0:protocol">
        <StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
        <Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion">
          <NameID>bob@enterprise.org</NameID>
        </Assertion>
      </Response>
    `;
    const base64 = Buffer.from(sampleXml).toString("base64");
    const res = validateSamlResponse(base64);
    expect(res.valid).toBe(true);
    expect(res.email).toBe("bob@enterprise.org");
  });

  it("detects and rejects IdP error statuses", () => {
    const errorXml = `
      <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
        <samlp:Status>
          <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Responder"/>
          <samlp:StatusMessage>User account locked</samlp:StatusMessage>
        </samlp:Status>
      </samlp:Response>
    `;
    const res = validateSamlResponse(errorXml);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("User account locked");
  });
});

// ── 2. OIDC Protocol Tests ────────────────────────────────────────────────────

describe("OIDC Engine", () => {
  it("builds standard OIDC authorization URL", () => {
    const authUrl = buildOidcAuthorizationUrl({
      authorizationEndpoint: "https://login.microsoftonline.com/tenant/oauth2/v2.0/authorize",
      clientId: "my-client-id",
      redirectUri: "https://urpass.space/api/auth/sso/oidc/callback",
      state: "state-token-123",
      nonce: "nonce-token-456",
      scopes: ["openid", "email", "profile"],
    });

    const parsed = new URL(authUrl);
    expect(parsed.origin).toBe("https://login.microsoftonline.com");
    expect(parsed.searchParams.get("client_id")).toBe("my-client-id");
    expect(parsed.searchParams.get("redirect_uri")).toBe("https://urpass.space/api/auth/sso/oidc/callback");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("scope")).toBe("openid email profile");
    expect(parsed.searchParams.get("state")).toBe("state-token-123");
    expect(parsed.searchParams.get("nonce")).toBe("nonce-token-456");
  });

  it("decodes JWT payload correctly without verification library", () => {
    const payload = {
      sub: "1234567890",
      email: "carol@corporate.com",
      name: "Carol Danvers",
      email_verified: true,
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const dummyJwt = `header.${encodedPayload}.signature`;

    const decoded = parseJwtPayload(dummyJwt);
    expect(decoded?.email).toBe("carol@corporate.com");
    expect(decoded?.name).toBe("Carol Danvers");
    expect(decoded?.sub).toBe("1234567890");
  });
});

// ── 3. Domain Verification Engine Tests ───────────────────────────────────────

describe("Domain Verification Engine", () => {
  it("generates unique verification tokens", () => {
    const token1 = generateVerificationToken();
    const token2 = generateVerificationToken();

    expect(token1).toMatch(/^urpass-domain-verification=[0-9a-f]{32}$/);
    expect(token2).toMatch(/^urpass-domain-verification=[0-9a-f]{32}$/);
    expect(token1).not.toBe(token2);
  });

  it("verifies TXT record when token matches", async () => {
    const expectedToken = "urpass-domain-verification=1234567890abcdef";
    vi.spyOn(dns.promises, "resolveTxt").mockResolvedValueOnce([
      ["v=spf1 include:_spf.google.com ~all"],
      [expectedToken],
    ]);

    const result = await checkDnsTxtRecord("acme.com", expectedToken);
    expect(result.verified).toBe(true);
    expect(result.recordsFound.length).toBe(2);
  });

  it("reports failure when TXT record does not match token", async () => {
    const expectedToken = "urpass-domain-verification=correct-token";
    vi.spyOn(dns.promises, "resolveTxt").mockResolvedValueOnce([
      ["urpass-domain-verification=different-token"],
    ]);

    const result = await checkDnsTxtRecord("acme.com", expectedToken);
    expect(result.verified).toBe(false);
    expect(result.error).toContain("TXT record containing");
  });

  it("handles DNS resolution errors gracefully", async () => {
    vi.spyOn(dns.promises, "resolveTxt").mockRejectedValueOnce(new Error("ENOTFOUND"));

    const result = await checkDnsTxtRecord("nonexistent.example", "token");
    expect(result.verified).toBe(false);
    expect(result.error).toContain("DNS lookup failed");
  });
});

// ── 4. Validation Schemas Tests ───────────────────────────────────────────────

describe("Validation Schemas", () => {
  it("validates domain schema correctly", () => {
    expect(domainSchema.safeParse({ domain: "company.com" }).success).toBe(true);
    expect(domainSchema.safeParse({ domain: "events.university.edu" }).success).toBe(true);
    expect(domainSchema.safeParse({ domain: "sub.domain.co.in" }).success).toBe(true);

    expect(domainSchema.safeParse({ domain: "invalid domain" }).success).toBe(false);
    expect(domainSchema.safeParse({ domain: "http://company.com" }).success).toBe(false);
    expect(domainSchema.safeParse({ domain: "" }).success).toBe(false);
  });

  it("validates SSO connection schema", () => {
    const validSaml = {
      name: "Okta SAML",
      protocol: "SAML" as const,
      status: "active" as const,
      domains: ["company.com"],
      enforce_sso: true,
      jit_provisioning: true,
      default_role: "member" as const,
      idp_sso_url: "https://idp.company.com/sso",
      idp_entity_id: "https://idp.company.com",
    };
    expect(ssoConnectionSchema.safeParse(validSaml).success).toBe(true);

    const invalid = {
      name: "",
      protocol: "INVALID",
    };
    expect(ssoConnectionSchema.safeParse(invalid).success).toBe(false);
  });

  it("validates security policies schema", () => {
    const validPolicy = {
      enforce_sso: true,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 1440,
      enforce_2fa: false,
      allowed_domains: ["company.com"],
    };
    expect(securityPoliciesSchema.safeParse(validPolicy).success).toBe(true);

    const invalidTimeout = {
      enforce_sso: false,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 5, // minimum is 15 minutes
      enforce_2fa: false,
      allowed_domains: [],
    };
    expect(securityPoliciesSchema.safeParse(invalidTimeout).success).toBe(false);
  });
});

// ── 5. Server Actions & Login Lookup Tests ────────────────────────────────────

describe("SSO Actions & Login Lookup", () => {
  beforeEach(() => vi.clearAllMocks());

  function makeMockAdmin(overrides: Record<string, unknown> = {}) {
    const mock = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      auth: {
        admin: {
          createUser: vi.fn(),
          updateUserById: vi.fn(),
          generateLink: vi.fn(),
        },
      },
      ...overrides,
    };
    return mock;
  }

  it("resolves active SSO and returns login redirect URL for verified domain", async () => {
    const admin = makeMockAdmin();
    // 1st maybeSingle: verified_domains
    // 2nd maybeSingle: organizations
    // 3rd maybeSingle: enterprise_sso_connections
    // 4th maybeSingle: organization_settings
    let callIdx = 0;
    admin.maybeSingle.mockImplementation(async () => {
      callIdx++;
      if (callIdx === 1) {
        return { data: { organization_id: "org-1", domain: "company.com" }, error: null };
      }
      if (callIdx === 2) {
        return { data: { id: "org-1", slug: "acme-corp", name: "Acme Corp" }, error: null };
      }
      if (callIdx === 3) {
        return {
          data: {
            id: "sso-1",
            organization_id: "org-1",
            protocol: "SAML",
            status: "active",
            enforce_sso: true,
          },
          error: null,
        };
      }
      if (callIdx === 4) {
        return {
          data: {
            enforce_sso: true,
            allow_emergency_owner_login: true,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    });

    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const { lookupSSOByEmail } = await import("@/app/actions/sso");
    const lookup = await lookupSSOByEmail("employee@company.com");

    expect(lookup.ssoAvailable).toBe(true);
    expect(lookup.enforced).toBe(true);
    expect(lookup.protocol).toBe("SAML");
    expect(lookup.orgSlug).toBe("acme-corp");
    expect(lookup.loginUrl).toContain("/api/auth/sso/saml/login?orgId=org-1");
    expect(lookup.allowEmergencyLogin).toBe(true);
  });

  it("returns ssoAvailable: false when domain is not verified", async () => {
    const admin = makeMockAdmin();
    admin.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const { lookupSSOByEmail } = await import("@/app/actions/sso");
    const lookup = await lookupSSOByEmail("user@unknown.com");

    expect(lookup.ssoAvailable).toBe(false);
    expect(lookup.enforced).toBe(false);
  });
});
