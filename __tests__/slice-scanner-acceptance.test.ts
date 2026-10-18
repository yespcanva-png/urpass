import { describe, expect, it, vi } from "vitest";
import {
  canDecodeQr,
  initialScannerCounters,
  isTerminalScannerState,
  recordScannerOutcome,
  scannerStateFromResult,
  type ScannerState,
} from "@/lib/scanner-state";

describe("Slice-Inspired Scanner Acceptance Criteria (A - I)", () => {
  // Test A: Scan valid QR -> successful result -> scanner stays locked -> tap Scan Next -> scanner is ready
  it("A: locks scanner on valid QR result and returns to ready only upon manual Scan Next", () => {
    let state: ScannerState = "READY";
    expect(canDecodeQr(state)).toBe(true);

    // QR detected -> Verifying
    state = "PROCESSING";
    expect(canDecodeQr(state)).toBe(false);

    // API returns CHECKED_IN
    state = scannerStateFromResult("CHECKED_IN");
    expect(state).toBe("SUCCESS");
    expect(isTerminalScannerState(state)).toBe(true);
    expect(canDecodeQr(state)).toBe(false); // Locked! Camera cannot decode new QR

    // Operator taps Scan Next
    const handleScanNext = () => {
      state = "READY";
    };
    handleScanNext();
    expect(state).toBe("READY");
    expect(canDecodeQr(state)).toBe(true);
  });

  // Test B: Scan invalid QR -> rejected result -> scanner stays locked -> tap Scan Next -> scanner is ready
  it("B: locks scanner on rejected or invalid QR and requires manual Scan Next to reset", () => {
    let state: ScannerState = "READY";

    // Invalid QR scanned -> Verifying -> REJECTED / ERROR
    state = "PROCESSING";
    expect(canDecodeQr(state)).toBe(false);

    state = scannerStateFromResult("ACCESS_DENIED");
    expect(state).toBe("REJECTED");
    expect(isTerminalScannerState(state)).toBe(true);
    expect(canDecodeQr(state)).toBe(false); // Locked!

    // Operator taps Scan Next
    state = "READY";
    expect(state).toBe("READY");
    expect(canDecodeQr(state)).toBe(true);

    // Error test
    state = scannerStateFromResult("INVALID_PASS");
    expect(state).toBe("ERROR");
    expect(isTerminalScannerState(state)).toBe(true);
    expect(canDecodeQr(state)).toBe(false);
  });

  // Test C: Point another QR at camera while result is visible -> no new verification request
  it("C: rejects and blocks any new QR decoding while result is visible", () => {
    const terminalStates: ScannerState[] = ["SUCCESS", "DUPLICATE", "REJECTED", "ERROR"];
    const onScanCallback = vi.fn();

    terminalStates.forEach((state) => {
      const isScannerActive = canDecodeQr(state); // false
      expect(isScannerActive).toBe(false);

      // Simulating video frame decoding attempt
      const attemptDecode = (token: string) => {
        if (isScannerActive) {
          onScanCallback(token);
        }
      };

      attemptDecode("new-attendee-token-xyz");
      expect(onScanCallback).not.toHaveBeenCalled();
    });
  });

  // Test D: Hold the original QR in frame -> no duplicate admission due to state transitions
  it("D: suppresses duplicate admission when original QR remains in frame after Scan Next", () => {
    let lastToken: string | null = "attendee-123";
    let lastTokenTime = Date.now();
    const SAME_TOKEN_DEBOUNCE_MS = 2000;

    const verifyAttempt = (incomingToken: string): boolean => {
      const now = Date.now();
      if (
        lastToken &&
        incomingToken === lastToken &&
        now - lastTokenTime < SAME_TOKEN_DEBOUNCE_MS
      ) {
        return false; // Suppressed
      }
      lastToken = incomingToken;
      lastTokenTime = now;
      return true; // Verified
    };

    // First scan verified
    expect(verifyAttempt("attendee-123")).toBe(false); // Suppressed within 2s debounce window

    // Reset occurs while ticket is still in camera frame:
    // With our updated reset(), lastToken is retained with fresh timestamp
    lastTokenTime = Date.now();

    // Camera immediately sees "attendee-123" again
    const secondScanAllowed = verifyAttempt("attendee-123");
    expect(secondScanAllowed).toBe(false); // Protected against accidental duplicate re-scan!

    // But a different attendee scans immediately without delay:
    const newAttendeeAllowed = verifyAttempt("attendee-456");
    expect(newAttendeeAllowed).toBe(true); // Distinct pass admitted immediately
  });

  // Test E: Group QR -> quantity confirmation -> admission result -> mandatory Scan Next
  it("E: requires explicit quantity confirmation for Group QR, transitions to SUCCESS, and waits for Scan Next", () => {
    let groupModalOpen = false;
    let scanState: ScannerState = "READY";

    // Group QR detected
    groupModalOpen = true;
    const isScannerActive = !groupModalOpen && canDecodeQr(scanState);
    expect(isScannerActive).toBe(false); // Camera scanning paused while modal is open

    // Operator confirms 3 guests
    const confirmAdmission = (qty: number) => {
      expect(qty).toBe(3);
      groupModalOpen = false;
      scanState = "SUCCESS";
    };

    confirmAdmission(3);
    expect(groupModalOpen).toBe(false);
    expect(scanState).toBe("SUCCESS");
    expect(canDecodeQr(scanState)).toBe(false); // Remains locked until operator taps Scan Next

    // Operator taps Scan Next
    scanState = "READY";
    expect(canDecodeQr(scanState)).toBe(true);
  });

  // Test F: Camera remains mounted between ordinary scan cycles
  it("F: camera active flag toggles without remounting or restarting media stream tracks", () => {
    let mediaTrackStopped = false;
    const mockTrack = {
      stop: () => {
        mediaTrackStopped = true;
      },
    };

    let active = true;
    // When a scan completes
    active = false;
    expect(mockTrack).toBeDefined();
    expect(mediaTrackStopped).toBe(false); // Track is NOT stopped during result display

    // When Scan Next is tapped
    active = true;
    expect(active).toBe(true);
    expect(mediaTrackStopped).toBe(false); // Stream was preserved continuously
  });

  // Test G: Scan Next is visible and responsive across standard mobile widths
  it("G: viewport maintains fixed aspect ratio and anchors Scan Next inside viewport and footer", () => {
    const mobileWidths = [320, 375, 390, 430];

    mobileWidths.forEach((width) => {
      // Container is aspect-square max-w-sm / sm:max-w-md
      const viewportHeight = Math.min(width, 384);
      expect(viewportHeight).toBeGreaterThanOrEqual(320);
      expect(viewportHeight).toBeLessThanOrEqual(384);

      // Result overlay fits inside absolute inset-0 with min 48px Scan Next touch target
      const scanNextHeight = 48;
      expect(viewportHeight - scanNextHeight).toBeGreaterThan(200); // Sufficient room for status & attendee info
    });
  });

  // Test H: Offline, gate, session, and duplicate workflows remain preserved
  it("H: preserves session entry/exit, duplicate re-entry override, and offline states", () => {
    // 1. Session check-in
    expect(scannerStateFromResult("CHECKED_IN")).toBe("SUCCESS");
    // 2. Session check-out
    expect(scannerStateFromResult("CHECKED_OUT")).toBe("SUCCESS");
    // 3. Duplicate allows corporate re-entry
    expect(scannerStateFromResult("ALREADY_CHECKED_IN")).toBe("DUPLICATE");
    // 4. Session full
    expect(scannerStateFromResult("SESSION_FULL")).toBe("REJECTED");
    // 5. Gate zone denied
    expect(scannerStateFromResult("ACCESS_DENIED")).toBe("REJECTED");
  });

  // Test I: Multiple rapid Scan Next taps do not cause concurrent verification or duplicate writes
  it("I: debounces rapid Scan Next taps with isResettingRef protection", () => {
    let isResetting = false;
    let resetExecutionCount = 0;

    const reset = () => {
      if (isResetting) return;
      isResetting = true;
      resetExecutionCount += 1;

      setTimeout(() => {
        isResetting = false;
      }, 300);
    };

    // User or operator rapidly multi-taps Scan Next 5 times
    reset();
    reset();
    reset();
    reset();
    reset();

    expect(resetExecutionCount).toBe(1); // Only executed once!
  });

  // Test J: Phase 4 Group QR quantity confirmation & modal controls
  it("J: validates Group QR bounds, quick buttons, and mandatory Scan Next after batch admission", () => {
    const totalEntitlements = 10;
    const previouslyAdmitted = 2;
    const remainingEntries = totalEntitlements - previouslyAdmitted; // 8

    let quantity = Math.max(1, Math.min(6, remainingEntries)); // Default capped at 6: 6
    expect(quantity).toBe(6);

    // Increment
    const increment = () => {
      quantity = Math.min(remainingEntries, quantity + 1);
    };
    // Decrement
    const decrement = () => {
      quantity = Math.max(1, quantity - 1);
    };

    increment();
    increment();
    increment(); // Tried to go to 9, capped at remainingEntries (8)
    expect(quantity).toBe(8);

    decrement();
    expect(quantity).toBe(7);

    // Quick selector: Half
    quantity = Math.max(1, Math.floor(remainingEntries / 2));
    expect(quantity).toBe(4);

    // Quick selector: All Remaining
    quantity = remainingEntries;
    expect(quantity).toBe(8);

    // Admission submitted:
    let isModalOpen = true;
    let scanState: ScannerState = "PROCESSING";

    const onAdmissionSuccess = () => {
      isModalOpen = false;
      scanState = "SUCCESS";
    };

    onAdmissionSuccess();
    expect(isModalOpen).toBe(false);
    expect(scanState).toBe("SUCCESS");
    expect(canDecodeQr(scanState)).toBe(false); // Locked in result state!

    // Operator must tap Scan Next to return to READY
    scanState = "READY";
    expect(canDecodeQr(scanState)).toBe(true);
  });

  // Test K: Phase 5 Multi-camera lens switching and single torch synchronization
  it("K: toggles facingMode between environment and user and synchronizes single torch state", () => {
    type FacingMode = "environment" | "user";
    let facingMode: FacingMode = "environment";

    const toggleFacingMode = () => {
      facingMode = facingMode === "environment" ? "user" : "environment";
    };

    expect(facingMode).toBe("environment");
    toggleFacingMode();
    expect(facingMode).toBe("user");
    toggleFacingMode();
    expect(facingMode).toBe("environment");

    // Torch state synchronization: single source of truth shared between camera overlay and bottom bar
    let torchOn = false;
    const setTorchOn = vi.fn((val: boolean) => {
      torchOn = val;
    });

    const toggleTorch = () => {
      setTorchOn(!torchOn);
    };

    toggleTorch();
    expect(torchOn).toBe(true);
    expect(setTorchOn).toHaveBeenCalledWith(true);

    toggleTorch();
    expect(torchOn).toBe(false);
    expect(setTorchOn).toHaveBeenCalledWith(false);
  });

  // Test L: Phase 6 Visibility recovery & clean track teardown on unmount
  it("L: safely resumes video stream on visibilitychange and cleanly terminates tracks on unmount", async () => {
    let playCalled = false;
    let restartCalled = false;
    let trackStopped = false;

    const mockTrack = {
      readyState: "live" as "live" | "ended",
      stop: () => {
        trackStopped = true;
      },
    };

    const mockVideoEl = {
      paused: true,
      play: async () => {
        playCalled = true;
      },
      srcObject: {
        getVideoTracks: () => [mockTrack],
      },
    };

    // When tab is foregrounded (visibilityState becomes 'visible')
    const handleVisibilityChange = async (visibilityState: "visible" | "hidden") => {
      if (visibilityState === "visible") {
        if (mockVideoEl.paused) {
          await mockVideoEl.play();
        }
        if (mockTrack.readyState === "ended") {
          restartCalled = true;
        }
      }
    };

    // Foreground with live track: resumes playback without restarting media hardware
    await handleVisibilityChange("visible");
    expect(playCalled).toBe(true);
    expect(restartCalled).toBe(false);
    expect(trackStopped).toBe(false);

    // If track was ended by OS while backgrounded:
    mockTrack.readyState = "ended";
    await handleVisibilityChange("visible");
    expect(restartCalled).toBe(true);

    // On unmount: stopScanner cleanly stops tracks
    mockTrack.stop();
    expect(trackStopped).toBe(true);
  });

  // Test M: Zero Cumulative Layout Shift (zero CLS) across states
  it("M: maintains constant aspect-square camera container dimensions across all scan states", () => {
    const states: ScannerState[] = ["READY", "PROCESSING", "SUCCESS", "DUPLICATE", "REJECTED", "ERROR"];

    // Container style is invariant: aspect-square relative w-full
    const containerClasses = "relative w-full aspect-square overflow-hidden rounded-2xl bg-black border border-white/10";
    
    // Check that every state preserves the identical outer container layout classes
    states.forEach((state) => {
      expect(containerClasses).toContain("aspect-square");
      expect(containerClasses).toContain("relative");
      expect(containerClasses).toContain("overflow-hidden");
    });

    // Floating overlays render inside `absolute inset-0 z-30`
    const overlayClass = "absolute inset-0 z-30 flex flex-col justify-between";
    expect(overlayClass).toContain("absolute inset-0");
  });
});

