export interface CustomTicketIdConfig {
  enabled: boolean;
  prefix: string; // e.g. "TECH26-", "VIP-", "EUPH-"
  suffix?: string; // e.g. "-PASS", "-2026"
  digitPadding: number; // e.g. 3 (001), 4 (0001), 5 (00001), 6 (000001)
  startNumber: number; // e.g. 1 or 1001
  currentSequence?: number; // highest sequence number generated so far
  continuationOffset?: number; // continuation offset (e.g. 500 when resuming after 500 offline tickets)
  includeTierCode?: boolean; // include ticket tier / category code e.g. VIP, GEN, STU
  tierCodeMap?: Record<string, string>; // mapping from category/tier id to code
  pattern?: string; // custom pattern e.g. "{PREFIX}{TIER}-{SEQ}{SUFFIX}"
}

export interface ContinuationStats {
  enabled: boolean;
  prefix: string;
  startNumber: number;
  digitPadding: number;
  continuationOffset: number;
  totalGenerated: number;
  nextSequenceNumber: number;
  nextTicketIdPreview: string;
  sampleBatch: string[];
}

export interface ParsedTicketId {
  raw: string;
  prefix: string;
  seq: number;
  tierCode?: string;
  suffix?: string;
  isValid: boolean;
}
