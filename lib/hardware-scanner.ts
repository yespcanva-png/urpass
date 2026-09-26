/**
 * Hardware Barcode Scanner (HID Keyboard Wedge) Listener
 *
 * Captures rapid keystroke bursts emitted by handheld Bluetooth and USB
 * laser/2D barcode scanners (e.g. Zebra TC series, Honeywell, Inateck, Socket Mobile).
 */

export interface HardwareScannerOptions {
  onScan: (barcode: string) => void;
  minBarcodeLength?: number;
  maxKeyIntervalMs?: number;
}

export function extractPassToken(raw: string): string {
  const trimmed = (raw || "").trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const match = url.pathname.match(/\/pass\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch {}
  }
  return trimmed;
}

export function attachHardwareScannerListener(
  options: HardwareScannerOptions
): () => void {
  const {
    onScan,
    minBarcodeLength = 5,
    maxKeyIntervalMs = 70,
  } = options;

  let buffer = "";
  let lastTime = 0;
  let intervals: number[] = [];

  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore meta/ctrl/alt key combinations
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const now = Date.now();
    const target = event.target as HTMLElement | null;
    const isInput =
      target !== null &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        Boolean(target.getAttribute && target.getAttribute("contenteditable") === "true"));

    if (event.key === "Enter") {
      const scannedCandidate = buffer.trim();
      const avgInterval =
        intervals.length > 0
          ? intervals.reduce((a, b) => a + b, 0) / intervals.length
          : 0;

      // Hardware scanners typically burst characters at < 40ms interval
      const isRapidBurst = intervals.length >= 4 && avgInterval < maxKeyIntervalMs;
      const isNonInputScan = !isInput && scannedCandidate.length >= minBarcodeLength;

      if ((isNonInputScan || isRapidBurst) && scannedCandidate.length >= minBarcodeLength) {
        event.preventDefault();
        event.stopPropagation();
        const token = extractPassToken(scannedCandidate);
        buffer = "";
        intervals = [];
        onScan(token);
        return;
      }

      // Reset on ordinary Enter
      buffer = "";
      intervals = [];
      return;
    }

    // Only process single printable characters
    if (event.key && event.key.length === 1) {
      // If gap since last character is > 250ms, discard previous buffer as stale
      if (buffer.length > 0 && now - lastTime > 250) {
        buffer = event.key;
        intervals = [];
      } else {
        if (buffer.length > 0) {
          intervals.push(now - lastTime);
        }
        buffer += event.key;
      }
      lastTime = now;
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown, true);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", handleKeyDown, true);
    }
  };
}
