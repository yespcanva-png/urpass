import type { CustomTicketIdConfig, ContinuationStats, ParsedTicketId } from "@/types/custom-ticket-id";

export const DEFAULT_TIER_CODES: Record<string, string> = {
  general: "GEN",
  vip: "VIP",
  student: "STU",
  early_bird: "EB",
  workshop: "WS",
  staff: "STF",
  speaker: "SPK",
  custom: "CST",
  participant: "GEN",
  organizer: "ORG",
};

export const DEFAULT_TICKET_ID_CONFIG: CustomTicketIdConfig = {
  enabled: false,
  prefix: "URP-",
  suffix: "",
  digitPadding: 4,
  startNumber: 1,
  continuationOffset: 0,
  includeTierCode: false,
  tierCodeMap: DEFAULT_TIER_CODES,
};

/**
 * Normalizes prefix ensuring safe alphanumeric + hyphen/underscore formatting.
 */
export function sanitizePrefix(prefix?: string): string {
  if (!prefix) return "URP-";
  const cleaned = prefix.trim().toUpperCase().replace(/[^A-Z0-9_\-\/]/g, "");
  return cleaned || "URP-";
}

/**
 * Formats a sequence number into a customized ticket identifier.
 * Example outputs:
 *   - "TECH26-0001"
 *   - "CONF-VIP-0042"
 *   - "EUPHORIA-1050"
 */
export function formatCustomTicketId(
  config?: Partial<CustomTicketIdConfig> | null,
  seqNumber = 1,
  context?: { tierCode?: string; passType?: string }
): string {
  const merged: CustomTicketIdConfig = {
    ...DEFAULT_TICKET_ID_CONFIG,
    ...(config || {}),
  };

  const padding = Math.max(1, Math.min(10, merged.digitPadding || 4));
  const seqStr = String(Math.max(0, seqNumber)).padStart(padding, "0");
  const rawPrefix = sanitizePrefix(merged.prefix);
  const suffix = (merged.suffix || "").trim().toUpperCase();

  let tierCode = "";
  if (merged.includeTierCode) {
    if (context?.tierCode) {
      tierCode = context.tierCode.trim().toUpperCase();
    } else if (context?.passType) {
      const normalizedKey = context.passType.toLowerCase().replace(/[^a-z0-9_]/g, "");
      tierCode =
        merged.tierCodeMap?.[normalizedKey] ||
        DEFAULT_TIER_CODES[normalizedKey] ||
        normalizedKey.slice(0, 3).toUpperCase();
    }
  }

  // Handle custom pattern e.g. "{PREFIX}{TIER}-{SEQ}{SUFFIX}"
  if (merged.pattern && merged.pattern.includes("{SEQ}")) {
    return merged.pattern
      .replace("{PREFIX}", rawPrefix)
      .replace("{TIER}", tierCode ? (rawPrefix.endsWith("-") || rawPrefix.endsWith("_") ? `${tierCode}-` : `-${tierCode}-`) : "")
      .replace("{SEQ}", seqStr)
      .replace("{SUFFIX}", suffix);
  }

  // Standard formatting logic
  const sep = rawPrefix.endsWith("-") || rawPrefix.endsWith("_") || rawPrefix.endsWith("/") ? "" : "-";
  
  if (tierCode) {
    return `${rawPrefix}${sep}${tierCode}-${seqStr}${suffix}`;
  }

  return `${rawPrefix}${sep}${seqStr}${suffix}`;
}

/**
 * Parses a custom ticket ID into constituent components (prefix, sequence number, tierCode).
 */
export function parseCustomTicketId(ticketId: string): ParsedTicketId {
  if (!ticketId || typeof ticketId !== "string") {
    return { raw: "", prefix: "", seq: 0, isValid: false };
  }

  const raw = ticketId.trim().toUpperCase();

  // Pattern 1: Multi-segment with tier e.g. "CONF-VIP-0042" or "CONF-VIP-0042-PASS"
  const multiMatch = raw.match(/^([A-Z0-9_\/]+?)[-_]([A-Z]{2,5})[-_](\d+)(?:[-_]([A-Z0-9]+))?$/);
  if (multiMatch) {
    const prefix = multiMatch[1];
    const tierCode = multiMatch[2];
    const seq = parseInt(multiMatch[3], 10);
    const suffix = multiMatch[4];
    return {
      raw,
      prefix,
      seq: isNaN(seq) ? 0 : seq,
      tierCode,
      suffix,
      isValid: !isNaN(seq) && seq > 0,
    };
  }

  // Pattern 2: Standard single-prefix e.g. "TECH26-0042" or "TECH26-0042-PASS" or "URP-0001"
  const standardMatch = raw.match(/^([A-Z0-9_\/]+?)[-_](\d+)(?:[-_]([A-Z0-9]+))?$/);
  if (standardMatch) {
    const prefix = standardMatch[1];
    const seq = parseInt(standardMatch[2], 10);
    const suffix = standardMatch[3];
    return {
      raw,
      prefix,
      seq: isNaN(seq) ? 0 : seq,
      suffix,
      isValid: !isNaN(seq) && seq > 0,
    };
  }

  // Fallback: Trailing digits
  const digitMatch = raw.match(/^(.*?)[-_]?(\d+)$/);
  if (digitMatch) {
    const prefix = digitMatch[1] || "";
    const seq = parseInt(digitMatch[2], 10);
    return {
      raw,
      prefix: prefix.replace(/[-_]$/, ""),
      seq: isNaN(seq) ? 0 : seq,
      isValid: !isNaN(seq) && seq > 0,
    };
  }

  return { raw, prefix: raw, seq: 0, isValid: false };
}

/**
 * Validates whether a given ticket ID conforms to the configured custom format.
 */
export function validateCustomTicketId(
  ticketId: string,
  config?: Partial<CustomTicketIdConfig> | null
): boolean {
  if (!ticketId) return false;
  const parsed = parseCustomTicketId(ticketId);
  if (!parsed.isValid) return false;

  if (config?.prefix) {
    const expectedPrefix = sanitizePrefix(config.prefix).replace(/[-_]$/, "");
    const actualPrefix = parsed.prefix.replace(/[-_]$/, "");
    if (actualPrefix !== expectedPrefix) return false;
  }

  return true;
}

/**
 * Generates an array of sequential ticket IDs for a batch or continuation series.
 */
export function generateContinuationBatch(
  config: Partial<CustomTicketIdConfig>,
  startSeq: number,
  count: number,
  context?: { tierCode?: string; passType?: string }
): string[] {
  const batch: string[] = [];
  const total = Math.max(1, Math.min(1000, count));
  for (let i = 0; i < total; i++) {
    batch.push(formatCustomTicketId(config, startSeq + i, context));
  }
  return batch;
}

/**
 * Resolves the next sequential ticket ID for an event by inspecting existing attendees
 * and applying startNumber and continuationOffset.
 */
export async function resolveNextTicketSequence(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  eventId: string,
  customConfig?: Partial<CustomTicketIdConfig> | null,
  context?: { tierCode?: string; passType?: string }
): Promise<{ nextSequence: number; customTicketId: string }> {
  const config: CustomTicketIdConfig = {
    ...DEFAULT_TICKET_ID_CONFIG,
    ...(customConfig || {}),
  };

  const start = Math.max(1, config.startNumber || 1);
  const offset = Math.max(0, config.continuationOffset || 0);

  // 1. Query total approved attendees / passes for this event
  let count = 0;
  try {
    const { count: attendeeCount } = await supabase
      .from("attendees")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .in("application_status", ["approved", "pending"]);

    count = Number(attendeeCount || 0);
  } catch {
    count = 0;
  }

  // 2. Next sequence calculation
  const nextSequence = start + offset + count;
  const customTicketId = formatCustomTicketId(config, nextSequence, context);

  return { nextSequence, customTicketId };
}
