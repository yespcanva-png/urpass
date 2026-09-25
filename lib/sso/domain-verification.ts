import dns from "node:dns";
import crypto from "node:crypto";

export function generateVerificationToken(): string {
  const random = crypto.randomBytes(16).toString("hex");
  return `urpass-domain-verification=${random}`;
}

/**
 * Checks DNS TXT records for the specified domain to find the verification token
 */
export async function checkDnsTxtRecord(
  domain: string,
  expectedToken: string
): Promise<{
  verified: boolean;
  recordsFound: string[];
  error?: string;
}> {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");

  try {
    const records = await dns.promises.resolveTxt(cleanDomain);
    const flattened = records.map((entry) => entry.join(""));

    const matched = flattened.some((rec) => {
      return (
        rec.includes(expectedToken) ||
        rec.trim() === expectedToken.trim() ||
        rec.replace(/\s+/g, "") === expectedToken.replace(/\s+/g, "")
      );
    });

    if (matched) {
      return {
        verified: true,
        recordsFound: flattened,
      };
    }

    return {
      verified: false,
      recordsFound: flattened,
      error: `TXT record containing '${expectedToken}' not found on ${cleanDomain}. Found ${flattened.length} other TXT records.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Common error: ENOTFOUND, ENODATA, NXDOMAIN
    return {
      verified: false,
      recordsFound: [],
      error: `DNS lookup failed: ${errorMsg}. Please ensure the domain exists and TXT records have propagated.`,
    };
  }
}
