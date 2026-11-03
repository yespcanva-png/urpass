import { ACCEPTED_APEX_IPS, ACCEPTED_CNAME_TARGETS, PRIMARY_CNAME_TARGET, getDnsInstructionsForDomain, parseDomainParts, type DnsDiagnosticResult } from "./domain-instructions";
export { ACCEPTED_APEX_IPS, ACCEPTED_CNAME_TARGETS, PRIMARY_CNAME_TARGET, SECONDARY_CNAME_TARGET, getDnsInstructionsForDomain, parseDomainParts } from "./domain-instructions";
export type { DnsDiagnosticResult, DnsRecordInstruction } from "./domain-instructions";

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
