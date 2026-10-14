import { describe, expect, it } from "vitest";
import {
  canDecodeQr,
  initialScannerCounters,
  isTerminalScannerState,
  recordScannerOutcome,
  scannerStateFromResult,
  type ScannerSessionCounters,
  type ScannerState,
} from "@/lib/scanner-state";

describe("continuous QR scanner state machine", () => {
  it("allows QR decoding only in READY state", () => {
    const states: ScannerState[] = ["READY", "PROCESSING", "SUCCESS", "DUPLICATE", "REJECTED", "ERROR"];

    expect(states.filter(canDecodeQr)).toEqual(["READY"]);
  });

  it("classifies authoritative API responses into scanner result states", () => {
    expect(scannerStateFromResult("CHECKED_IN")).toBe("SUCCESS");
    expect(scannerStateFromResult("CHECKED_OUT")).toBe("SUCCESS");
    expect(scannerStateFromResult("ALREADY_CHECKED_IN")).toBe("DUPLICATE");
    expect(scannerStateFromResult("EXHAUSTED")).toBe("DUPLICATE");
    expect(scannerStateFromResult("ACCESS_DENIED")).toBe("REJECTED");
    expect(scannerStateFromResult("SESSION_FULL")).toBe("REJECTED");
    expect(scannerStateFromResult("INVALID_PASS")).toBe("ERROR");
  });

  it("tracks 100 consecutive successful scans without resetting session counters", () => {
    let counters: ScannerSessionCounters = initialScannerCounters;

    for (let i = 0; i < 100; i += 1) {
      counters = recordScannerOutcome(counters, "SUCCESS");
    }

    expect(counters).toEqual({ scanned: 100, successful: 100, rejected: 0 });
  });

  it("counts duplicate, rejected, and network error outcomes as completed rejected attempts", () => {
    let counters = recordScannerOutcome(initialScannerCounters, "DUPLICATE");
    counters = recordScannerOutcome(counters, "REJECTED");
    counters = recordScannerOutcome(counters, "ERROR");

    expect(counters).toEqual({ scanned: 3, successful: 0, rejected: 3 });
  });

  it("counts group admissions as one scan attempt with multiple successful units", () => {
    const counters = recordScannerOutcome(initialScannerCounters, "SUCCESS", 4);

    expect(counters).toEqual({ scanned: 1, successful: 4, rejected: 0 });
  });

  it("identifies terminal states that require Scan Next before more decoding", () => {
    expect(isTerminalScannerState("READY")).toBe(false);
    expect(isTerminalScannerState("PROCESSING")).toBe(false);
    expect(isTerminalScannerState("SUCCESS")).toBe(true);
    expect(isTerminalScannerState("DUPLICATE")).toBe(true);
    expect(isTerminalScannerState("REJECTED")).toBe(true);
    expect(isTerminalScannerState("ERROR")).toBe(true);
  });
});

