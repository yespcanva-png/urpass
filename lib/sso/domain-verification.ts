import crypto from "node:crypto";
import { checkTxtVerificationRealtime } from "@/lib/dns/realtime-dns";

export function generateVerificationToken(): string {
  const random = crypto.randomBytes(16).toString("hex");
  return `urpass-domain-verification=${random}`;
}

/**
 * Checks DNS TXT records for the specified domain in real-time
 * using multi-resolver DoH (Cloudflare + Google + Node DNS)
 */
export async function checkDnsTxtRecord(
  domain: string,
  expectedToken: string
): Promise<{
  verified: boolean;
  recordsFound: string[];
  error?: string;
  resolversQueried?: string[];
}> {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");

  // Check Node system DNS (allows test mocks with vi.spyOn)
  let nodeRecords: string[] = [];
  let nodeError: string | null = null;
  try {
    const dns = await import("node:dns");
    const raw = await dns.promises.resolveTxt(cleanDomain);
    nodeRecords = raw.map((entry) => entry.join(""));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    nodeError = msg;
  }

  // Check if matched via node DNS
  const matchedNode = nodeRecords.some((rec) =>
    rec.includes(expectedToken) || rec.trim() === expectedToken.trim()
  );

  if (matchedNode) {
    return {
      verified: true,
      recordsFound: nodeRecords,
      resolversQueried: ["Authoritative Node DNS"],
    };
  }

  // If running in test environment and node failed or didn't match
  if (process.env.NODE_ENV === "test") {
    if (nodeError) {
      return {
        verified: false,
        recordsFound: [],
        error: `DNS lookup failed: ${nodeError}. Please ensure the domain exists and TXT records have propagated.`,
      };
    }
    return {
      verified: false,
      recordsFound: nodeRecords,
      error: `TXT record containing '${expectedToken}' not found on ${cleanDomain}. Found ${nodeRecords.length} other TXT records.`,
    };
  }

  // In production, query multi-resolver DoH in real-time
  const dohResult = await checkTxtVerificationRealtime(cleanDomain, expectedToken);
  return {
    verified: dohResult.verified,
    recordsFound: Array.from(new Set([...nodeRecords, ...dohResult.recordsFound])),
    error: dohResult.error,
    resolversQueried: dohResult.resolversQueried,
  };
}
