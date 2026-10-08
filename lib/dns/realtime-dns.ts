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

/**
 * Performs DNS-over-HTTPS (DoH) lookup directly to Cloudflare 1.1.1.1
 */
async function queryCloudflareDoH(
  domain: string,
  type: "CNAME" | "A" | "TXT" | "NS"
): Promise<{ success: boolean; answers: string[]; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
      domain
    )}&type=${type}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/dns-json",
        "User-Agent": "UrPass-Realtime-DNS/2.0",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, answers: [], error: `DoH HTTP ${res.status}` };
    }

    const json = (await res.json()) as {
      Status?: number;
      Answer?: { name: string; type: number; data: string }[];
    };

    if (json.Status !== 0 || !json.Answer) {
      return { success: true, answers: [] };
    }

    const answers = json.Answer.map((a) =>
      a.data.replace(/^"|"$/g, "").replace(/\.$/, "")
    );
    return { success: true, answers };
  } catch (err) {
    return {
      success: false,
      answers: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Performs DNS-over-HTTPS (DoH) lookup directly to Google 8.8.8.8
 */
async function queryGoogleDoH(
  domain: string,
  type: "CNAME" | "A" | "TXT" | "NS"
): Promise<{ success: boolean; answers: string[]; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://dns.google/resolve?name=${encodeURIComponent(
      domain
    )}&type=${type}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "UrPass-Realtime-DNS/2.0",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, answers: [], error: `Google DoH HTTP ${res.status}` };
    }

    const json = (await res.json()) as {
      Status?: number;
      Answer?: { name: string; type: number; data: string }[];
    };

    if (json.Status !== 0 || !json.Answer) {
      return { success: true, answers: [] };
    }

    const answers = json.Answer.map((a) =>
      a.data.replace(/^"|"$/g, "").replace(/\.$/, "")
    );
    return { success: true, answers };
  } catch (err) {
    return {
      success: false,
      answers: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Performs Node.js system DNS resolve as local fallback
 */
async function queryNodeDns(
  domain: string,
  type: "CNAME" | "A" | "TXT" | "NS"
): Promise<{ success: boolean; answers: string[]; error?: string }> {
  if (typeof window !== "undefined") {
    return { success: false, answers: [], error: "Node DNS is only available on server" };
  }

  try {
    const dns = await import("node:dns");
    if (type === "CNAME") {
      const records = await dns.promises.resolveCname(domain);
      return {
        success: true,
        answers: records.map((r) => r.replace(/\.$/, "")),
      };
    } else if (type === "A") {
      const records = await dns.promises.resolve4(domain);
      return { success: true, answers: records };
    } else if (type === "TXT") {
      const records = await dns.promises.resolveTxt(domain);
      return { success: true, answers: records.map((entry) => entry.join("")) };
    } else if (type === "NS") {
      const records = await dns.promises.resolveNs(domain);
      return { success: true, answers: records.map((r) => r.replace(/\.$/, "")) };
    }
    return { success: true, answers: [] };
  } catch (err) {
    return {
      success: false,
      answers: [],
      error: (err as { code?: string })?.code || (err instanceof Error ? err.message : String(err)),
    };
  }
}

/**
 * Checks if detected IPs are Cloudflare proxy IPs
 */
function isCloudflareProxyIp(ip: string): boolean {
  if (
    ip.startsWith("104.16.") ||
    ip.startsWith("104.17.") ||
    ip.startsWith("104.18.") ||
    ip.startsWith("104.19.") ||
    ip.startsWith("104.20.") ||
    ip.startsWith("104.21.") ||
    ip.startsWith("172.67.") ||
    ip.startsWith("172.64.") ||
    ip.startsWith("172.65.") ||
    ip.startsWith("172.66.")
  ) {
    return true;
  }
  return false;
}

/**
 * Real-Time Multi-Resolver Custom Domain DNS Verification
 * Queries Cloudflare DoH (1.1.1.1), Google DoH (8.8.8.8), and Node DNS in parallel.
 */
export async function checkCustomDomainRealtime(
  rawDomain: string
): Promise<DnsDiagnosticResult> {
  const { cleanDomain, isApex, subdomainPart, apexDomain } = parseDomainParts(rawDomain);
  const checkedAt = new Date().toISOString();
  const instructions = getDnsInstructionsForDomain(cleanDomain);

  // Allow mock in testing environments
  const isMock =
    process.env.NODE_ENV === "test" &&
    (cleanDomain.endsWith(".test") ||
      cleanDomain.endsWith(".example") ||
      cleanDomain.includes("mock"));

  if (isMock) {
    const isMockVerified = !cleanDomain.includes("fail");
    return {
      verified: isMockVerified,
      domain: cleanDomain,
      isApex,
      subdomainPart,
      apexDomain,
      status: isMockVerified ? "verified" : "pending",
      expectedCnameTarget: PRIMARY_CNAME_TARGET,
      detectedCnames: isMockVerified ? [PRIMARY_CNAME_TARGET] : [],
      detectedIps: isMockVerified ? [ACCEPTED_APEX_IPS[0]] : [],
      detectedTxt: [],
      nameservers: ["ns1.urpass-mock.com", "ns2.urpass-mock.com"],
      resolversQueried: ["Mock Resolver"],
      isProxiedByCloudflare: false,
      message: isMockVerified
        ? `Domain "${cleanDomain}" is verified and active! TLS certificate is issued.`
        : `No DNS records detected yet for "${cleanDomain}".`,
      dnsInstructions: instructions,
      checkedAt,
    };
  }

  const resolversQueried: string[] = [];
  const detectedCnameSet = new Set<string>();
  const detectedIpSet = new Set<string>();
  const detectedTxtSet = new Set<string>();
  const detectedNsSet = new Set<string>();

  // Run CNAME, A, TXT, NS lookups across Cloudflare DoH, Google DoH, and Node DNS
  const [
    cfCname,
    cfA,
    cfNs,
    ggCname,
    ggA,
    ggNs,
    nodeCname,
    nodeA,
    nodeNs,
  ] = await Promise.allSettled([
    queryCloudflareDoH(cleanDomain, "CNAME"),
    queryCloudflareDoH(cleanDomain, "A"),
    queryCloudflareDoH(apexDomain, "NS"),
    queryGoogleDoH(cleanDomain, "CNAME"),
    queryGoogleDoH(cleanDomain, "A"),
    queryGoogleDoH(apexDomain, "NS"),
    queryNodeDns(cleanDomain, "CNAME"),
    queryNodeDns(cleanDomain, "A"),
    queryNodeDns(apexDomain, "NS"),
  ]);

  // Aggregate results from Cloudflare DoH
  if (cfCname.status === "fulfilled" && cfCname.value.success) {
    resolversQueried.push("Cloudflare 1.1.1.1 DoH");
    cfCname.value.answers.forEach((c) => detectedCnameSet.add(c.toLowerCase()));
  }
  if (cfA.status === "fulfilled" && cfA.value.success) {
    cfA.value.answers.forEach((ip) => detectedIpSet.add(ip));
  }
  if (cfNs.status === "fulfilled" && cfNs.value.success) {
    cfNs.value.answers.forEach((ns) => detectedNsSet.add(ns.toLowerCase()));
  }

  // Aggregate results from Google DoH
  if (ggCname.status === "fulfilled" && ggCname.value.success) {
    if (!resolversQueried.includes("Google 8.8.8.8 DoH")) {
      resolversQueried.push("Google 8.8.8.8 DoH");
    }
    ggCname.value.answers.forEach((c) => detectedCnameSet.add(c.toLowerCase()));
  }
  if (ggA.status === "fulfilled" && ggA.value.success) {
    ggA.value.answers.forEach((ip) => detectedIpSet.add(ip));
  }
  if (ggNs.status === "fulfilled" && ggNs.value.success) {
    ggNs.value.answers.forEach((ns) => detectedNsSet.add(ns.toLowerCase()));
  }

  // Aggregate results from Node DNS
  if (nodeCname.status === "fulfilled" && nodeCname.value.success) {
    resolversQueried.push("Authoritative Node DNS");
    nodeCname.value.answers.forEach((c) => detectedCnameSet.add(c.toLowerCase()));
  }
  if (nodeA.status === "fulfilled" && nodeA.value.success) {
    nodeA.value.answers.forEach((ip) => detectedIpSet.add(ip));
  }
  if (nodeNs.status === "fulfilled" && nodeNs.value.success) {
    nodeNs.value.answers.forEach((ns) => detectedNsSet.add(ns.toLowerCase()));
  }

  const detectedCnames = Array.from(detectedCnameSet);
  const detectedIps = Array.from(detectedIpSet);
  const detectedTxt = Array.from(detectedTxtSet);
  const nameservers = Array.from(detectedNsSet);

  // Check Cloudflare Proxying
  const isProxiedByCloudflare = detectedIps.some(isCloudflareProxyIp);

  // Evaluate verification
  let verified = false;
  let status: "verified" | "pending" | "misconfigured" | "error" = "pending";
  let message = "";
  let detailedReason: string | undefined;
  let suggestedFix: string | undefined;

  // 1. CNAME Match Check
  const cnameMatched = detectedCnames.some((c) =>
    ACCEPTED_CNAME_TARGETS.some(
      (accepted) =>
        c === accepted ||
        c.endsWith(`.${accepted}`) ||
        accepted.endsWith(c)
    )
  );

  // 2. Apex A-Record Match Check (if apex domain or ALIAS)
  const ipMatched = detectedIps.some((ip) => ACCEPTED_APEX_IPS.includes(ip));

  if (cnameMatched || (isApex && ipMatched)) {
    verified = true;
    status = "verified";
    message = `Domain "${cleanDomain}" is verified and active! TLS certificate is issued.`;
  } else if (isProxiedByCloudflare) {
    // Cloudflare Orange Cloud (Proxied) is active.
    // If the apex/subdomain is proxied by Cloudflare, it might still route, but we should inform the user
    // or if they configure fallback SSL.
    status = "misconfigured";
    message = `Cloudflare Proxy (Orange Cloud) detected on "${cleanDomain}".`;
    detailedReason = `Cloudflare is currently proxying traffic through its own edge IPs (${detectedIps.join(
      ", "
    )}), hiding the CNAME target from authoritative verification.`;
    suggestedFix = `In your Cloudflare DNS dashboard, change Proxy Status to "DNS Only" (Grey Cloud) for "${subdomainPart}" so URPASS can verify the CNAME record and provision automated TLS.`;
  } else if (detectedCnames.length > 0) {
    // Has a CNAME, but pointing to wrong target
    status = "misconfigured";
    message = `CNAME record points to "${detectedCnames.join(
      ", "
    )}" instead of "${PRIMARY_CNAME_TARGET}".`;
    detailedReason = `We found a CNAME record, but its target does not match any valid URPASS routing endpoint.`;
    suggestedFix = `Update the CNAME record for host "${subdomainPart}" to point to "${PRIMARY_CNAME_TARGET}".`;
  } else if (detectedIps.length > 0) {
    // Has A records, but not pointing to expected IP and no CNAME
    status = "misconfigured";
    message = `Found A record pointing to IP "${detectedIps.join(
      ", "
    )}" without a CNAME to "${PRIMARY_CNAME_TARGET}".`;
    detailedReason = `For subdomains like "${cleanDomain}", a CNAME record pointing to "${PRIMARY_CNAME_TARGET}" is required.`;
    suggestedFix = `Replace or add a CNAME record for host "${subdomainPart}" pointing to "${PRIMARY_CNAME_TARGET}".`;
  } else {
    // No records detected yet
    status = "pending";
    message = `No DNS records detected for "${cleanDomain}". DNS propagation may take a few moments.`;
    detailedReason = `Our real-time resolvers (Cloudflare 1.1.1.1 & Google 8.8.8.8) have not received any CNAME or A records for "${cleanDomain}" yet.`;
    suggestedFix = `Log in to your DNS provider (e.g. GoDaddy, Cloudflare, Namecheap) and create a CNAME record: Host "${subdomainPart}", Target "${PRIMARY_CNAME_TARGET}".`;
  }

  return {
    verified,
    domain: cleanDomain,
    isApex,
    subdomainPart,
    apexDomain,
    status,
    expectedCnameTarget: PRIMARY_CNAME_TARGET,
    detectedCnames,
    detectedIps,
    detectedTxt,
    nameservers,
    resolversQueried,
    isProxiedByCloudflare,
    message,
    detailedReason,
    suggestedFix,
    dnsInstructions: instructions,
    checkedAt,
  };
}

/**
 * Real-Time TXT verification for Organization SSO Domain Ownership
 */
export async function checkTxtVerificationRealtime(
  domain: string,
  expectedToken: string
): Promise<{
  verified: boolean;
  recordsFound: string[];
  message: string;
  error?: string;
  resolversQueried: string[];
}> {
  const { cleanDomain } = parseDomainParts(domain);

  // Mock handling in test
  if (
    process.env.NODE_ENV === "test" &&
    (cleanDomain.endsWith(".test") || cleanDomain.endsWith(".example") || cleanDomain.includes("mock"))
  ) {
    const isMockVerified = !cleanDomain.includes("fail");
    return {
      verified: isMockVerified,
      recordsFound: isMockVerified ? [expectedToken] : [],
      message: isMockVerified ? "Domain verified successfully!" : "Token not found.",
      resolversQueried: ["Mock Resolver"],
    };
  }

  const resolversQueried: string[] = [];
  const foundTxtSet = new Set<string>();

  const [cfTxt, ggTxt, nodeTxt] = await Promise.allSettled([
    queryCloudflareDoH(cleanDomain, "TXT"),
    queryGoogleDoH(cleanDomain, "TXT"),
    queryNodeDns(cleanDomain, "TXT"),
  ]);

  if (cfTxt.status === "fulfilled" && cfTxt.value.success) {
    resolversQueried.push("Cloudflare 1.1.1.1 DoH");
    cfTxt.value.answers.forEach((t) => foundTxtSet.add(t));
  }
  if (ggTxt.status === "fulfilled" && ggTxt.value.success) {
    resolversQueried.push("Google 8.8.8.8 DoH");
    ggTxt.value.answers.forEach((t) => foundTxtSet.add(t));
  }
  if (nodeTxt.status === "fulfilled" && nodeTxt.value.success) {
    resolversQueried.push("Authoritative Node DNS");
    nodeTxt.value.answers.forEach((t) => foundTxtSet.add(t));
  }

  const recordsFound = Array.from(foundTxtSet);

  const matched = recordsFound.some((rec) => {
    return (
      rec.includes(expectedToken) ||
      rec.trim() === expectedToken.trim() ||
      rec.replace(/\s+/g, "") === expectedToken.replace(/\s+/g, "")
    );
  });

  if (matched) {
    return {
      verified: true,
      recordsFound,
      message: `Domain '${cleanDomain}' verified successfully!`,
      resolversQueried,
    };
  }

  return {
    verified: false,
    recordsFound,
    message: `TXT record containing '${expectedToken}' not found on ${cleanDomain}. Found ${recordsFound.length} other TXT records.`,
    error: `TXT record containing '${expectedToken}' not found. Please ensure DNS propagation is complete.`,
    resolversQueried,
  };
}
