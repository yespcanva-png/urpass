import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  attachHardwareScannerListener,
  extractPassToken,
} from "@/lib/hardware-scanner";

describe("hardware-scanner", () => {
  describe("extractPassToken", () => {
    it("extracts token from full urpass pass URL", () => {
      expect(extractPassToken("https://urpass.space/pass/tok_enterprise_12345")).toBe(
        "tok_enterprise_12345"
      );
    });

    it("extracts token from full URL with trailing slash or query params", () => {
      expect(
        extractPassToken("https://app.urpass.space/pass/tok_enterprise_67890?gate=north")
      ).toBe("tok_enterprise_67890");
    });

    it("returns raw token if not a URL", () => {
      expect(extractPassToken("tok_direct_pass_999")).toBe("tok_direct_pass_999");
    });
  });

  describe("attachHardwareScannerListener", () => {
    let onScanMock: any;
    let cleanup: () => void;

    beforeEach(() => {
      onScanMock = vi.fn();
      cleanup = attachHardwareScannerListener({ onScan: onScanMock });
    });

    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
    });

    function simulateScan(text: string) {
      for (const char of text) {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: char, bubbles: true })
        );
      }
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );
    }

    it("triggers onScan when characters and Enter are fired", () => {
      simulateScan("tok_vip_pass_888");
      expect(onScanMock).toHaveBeenCalledWith("tok_vip_pass_888");
    });

    it("extracts token when hardware scanner outputs full pass URL", () => {
      simulateScan("https://urpass.space/pass/tok_honeywell_777");
      expect(onScanMock).toHaveBeenCalledWith("tok_honeywell_777");
    });

    it("ignores barcodes that are shorter than minBarcodeLength", () => {
      simulateScan("abc");
      expect(onScanMock).not.toHaveBeenCalled();
    });
  });
});
