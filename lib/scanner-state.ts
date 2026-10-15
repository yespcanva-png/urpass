export type ScannerState =
  | "READY"
  | "PROCESSING"
  | "SUCCESS"
  | "DUPLICATE"
  | "REJECTED"
  | "ERROR";

export type ScanOutcome = Exclude<ScannerState, "READY" | "PROCESSING">;

export interface ScannerSessionCounters {
  scanned: number;
  successful: number;
  rejected: number;
}

export const initialScannerCounters: ScannerSessionCounters = {
  scanned: 0,
  successful: 0,
  rejected: 0,
};

export function canDecodeQr(state: ScannerState) {
  return state === "READY";
}

export function isTerminalScannerState(state: ScannerState) {
  return state === "SUCCESS" || state === "DUPLICATE" || state === "REJECTED" || state === "ERROR";
}

export function scannerStateFromResult(status: string | undefined, ok = false): ScanOutcome {
  if (status === "CHECKED_IN" || status === "CHECKED_OUT" || ok) return "SUCCESS";
  if (status === "ALREADY_CHECKED_IN" || status === "EXHAUSTED") return "DUPLICATE";
  if (
    status === "ACCESS_DENIED" ||
    status === "ACCESS_NOT_ALLOWED" ||
    status === "SESSION_ACCESS_DENIED" ||
    status === "SESSION_FULL" ||
    status === "RESERVATION_REQUIRED" ||
    status === "SCANNER_UNAUTHORIZED" ||
    status === "EVENT_CAPACITY_REACHED"
  ) {
    return "REJECTED";
  }
  return "ERROR";
}

export function recordScannerOutcome(
  counters: ScannerSessionCounters,
  state: ScanOutcome,
  successfulUnits = 1
): ScannerSessionCounters {
  return {
    scanned: counters.scanned + 1,
    successful: counters.successful + (state === "SUCCESS" ? Math.max(1, successfulUnits) : 0),
    rejected: counters.rejected + (state === "SUCCESS" ? 0 : 1),
  };
}

