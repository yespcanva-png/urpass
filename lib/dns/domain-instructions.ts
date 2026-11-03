export const PRIMARY_CNAME_TARGET = "cname.urpass.in";
export const SECONDARY_CNAME_TARGET = "cname.urpass.space";
export const ACCEPTED_CNAME_TARGETS = [
  "cname.urpass.in",
  "cname.urpass.space",
  "urpass.space",
  "urpass.in",
  "cname.vercel-dns.com",
];

export const ACCEPTED_APEX_IPS = [
  "76.76.21.21", // Vercel Anycast IP
  "76.76.21.22",
  "76.76.21.61",
  "76.76.21.98",
  "76.76.21.142",
  "76.76.21.164",
  "76.76.21.241",
];

// Multi-part country code second-level domains
const TWO_PART_TLDS = new Set([
  "co.uk",
  "org.uk",
  "me.uk",
  "ac.uk",
  "gov.uk",
  "co.in",
  "org.in",
  "net.in",
  "ac.in",
  "edu.in",
  "res.in",
  "gov.in",
  "com.au",
  "net.au",
  "org.au",
  "edu.au",
  "co.nz",
  "org.nz",
  "co.jp",
  "ne.jp",
  "com.sg",
  "edu.sg",
  "com.br",
  "com.mx",
  "co.za",
]);

export interface DnsRecordInstruction {
  type: "CNAME" | "A" | "ALIAS" | "TXT";
  name: string;
  value: string;
  ttl: string;
  recommended: boolean;
  notes?: string;
}

export interface DnsDiagnosticResult {
  verified: boolean;
  domain: string;
  isApex: boolean;
  subdomainPart: string;
  apexDomain: string;
  status: "verified" | "pending" | "misconfigured" | "error";
  expectedCnameTarget: string;
  detectedCnames: string[];
  detectedIps: string[];
  detectedTxt: string[];
  nameservers: string[];
  resolversQueried: string[];
  isProxiedByCloudflare: boolean;
  message: string;
  detailedReason?: string;
  suggestedFix?: string;
  dnsInstructions: DnsRecordInstruction[];
  checkedAt: string;
}

/**
 * Parses domain into host/subdomain part and apex domain.
 * Examples:
 *   "events.acmecorp.com" -> { isApex: false, subdomainPart: "events", apexDomain: "acmecorp.com" }
 *   "acmecorp.com" -> { isApex: true, subdomainPart: "@", apexDomain: "acmecorp.com" }
 *   "summit.london.co.uk" -> { isApex: false, subdomainPart: "summit.london", apexDomain: "co.uk" (or proper apex) }
 */
export function parseDomainParts(rawDomain: string): {
  cleanDomain: string;
  isApex: boolean;
  subdomainPart: string;
  apexDomain: string;
} {
  const cleanDomain = rawDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");

  const parts = cleanDomain.split(".");
  if (parts.length <= 1) {
    return {
      cleanDomain,
      isApex: true,
      subdomainPart: "@",
      apexDomain: cleanDomain,
    };
  }

  // Check two-part TLDs (e.g. example.co.uk)
  const lastTwo = parts.slice(-2).join(".");
  if (TWO_PART_TLDS.has(lastTwo)) {
    if (parts.length === 3) {
      // e.g. acme.co.uk -> apex
      return {
        cleanDomain,
        isApex: true,
        subdomainPart: "@",
        apexDomain: cleanDomain,
      };
    } else if (parts.length > 3) {
      // e.g. events.acme.co.uk -> subdomain 'events', apex 'acme.co.uk'
      const apex = parts.slice(-3).join(".");
      const sub = parts.slice(0, -3).join(".");
      return {
        cleanDomain,
        isApex: false,
        subdomainPart: sub,
        apexDomain: apex,
      };
    }
  }

  // Standard TLD (e.g. events.acme.com or acme.com)
  if (parts.length === 2) {
    return {
      cleanDomain,
      isApex: true,
      subdomainPart: "@",
      apexDomain: cleanDomain,
    };
  }

  const apex = parts.slice(-2).join(".");
  const sub = parts.slice(0, -2).join(".");
  return {
    cleanDomain,
    isApex: false,
    subdomainPart: sub,
    apexDomain: apex,
  };
}

/**
 * Builds copyable DNS instructions for a domain
 */
export function getDnsInstructionsForDomain(domain: string): DnsRecordInstruction[] {
  const { isApex, subdomainPart } = parseDomainParts(domain);

  if (isApex) {
    return [
      {
        type: "A",
        name: "@",
        value: ACCEPTED_APEX_IPS[0],
        ttl: "Auto / 300s",
        recommended: true,
        notes: "For Root/Apex domains (e.g. acme.com), add an A record pointing to URPASS Edge Anycast IP.",
      },
      {
        type: "ALIAS",
        name: "@",
        value: PRIMARY_CNAME_TARGET,
        ttl: "Auto / 300s",
        recommended: false,
        notes: "If your DNS provider supports CNAME Flattening / ANAME / ALIAS at apex (Cloudflare, DNSimple, Route 53 ALIAS).",
      },
    ];
  }

  return [
    {
      type: "CNAME",
      name: subdomainPart,
      value: PRIMARY_CNAME_TARGET,
      ttl: "Auto / 300s",
      recommended: true,
      notes: `Points '${domain}' to URPASS global edge router with automated TLS certification.`,
    },
    {
      type: "CNAME",
      name: subdomainPart,
      value: SECONDARY_CNAME_TARGET,
      ttl: "Auto / 300s",
      recommended: false,
      notes: "Alternate secondary CNAME target if needed for specific regional configurations.",
    },
  ];
}
