import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QRScanner from "@/components/scan/QRScanner";

const camera = vi.hoisted(() => ({
  decode: undefined as ((token: string) => void) | undefined,
  start: vi.fn(),
  stop: vi.fn().mockResolvedValue(undefined),
  clear: vi.fn(),
}));

vi.mock("html5-qrcode", () => ({
  Html5QrcodeSupportedFormats: { QR_CODE: 0 },
  Html5Qrcode: class {
    start = camera.start;
    stop = camera.stop;
    clear = camera.clear;
    getState() { return 2; }
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  camera.decode = undefined;
  camera.start.mockImplementation(async (_constraints, _config, decode) => {
    camera.decode = decode;
  });
});

afterEach(cleanup);

describe("camera scan callbacks", () => {
  it("uses the ready handler when the camera started while scanning was disabled", async () => {
    const initialHandler = vi.fn();
    const readyHandler = vi.fn();
    const { rerender } = render(<QRScanner active={false} onScan={initialHandler} />);
    await waitFor(() => expect(camera.decode).toBeDefined());

    act(() => camera.decode?.("disabled-pass"));
    expect(initialHandler).not.toHaveBeenCalled();

    rerender(<QRScanner active onScan={readyHandler} />);
    act(() => camera.decode?.("ready-pass"));

    expect(readyHandler).toHaveBeenCalledWith("ready-pass");
    expect(initialHandler).not.toHaveBeenCalled();
    expect(camera.start).toHaveBeenCalledTimes(1);
  });

  it("uses updated gate/session handlers and respects result locking without restarting", async () => {
    const firstGate = vi.fn();
    const secondGate = vi.fn();
    const { rerender } = render(<QRScanner active onScan={firstGate} />);
    await waitFor(() => expect(camera.decode).toBeDefined());
    act(() => camera.decode?.("first-pass"));

    rerender(<QRScanner active onScan={secondGate} />);
    act(() => camera.decode?.("second-pass"));
    rerender(<QRScanner active={false} onScan={secondGate} />);
    act(() => camera.decode?.("locked-pass"));
    rerender(<QRScanner active onScan={secondGate} />);
    act(() => camera.decode?.("next-pass"));

    expect(firstGate.mock.calls).toEqual([["first-pass"]]);
    expect(secondGate.mock.calls).toEqual([["second-pass"], ["next-pass"]]);
    expect(camera.start).toHaveBeenCalledTimes(1);
  });

  it("passes a 1-key cameraIdOrConfig object to html5-qrcode start", async () => {
    render(<QRScanner active onScan={vi.fn()} />);
    await waitFor(() => expect(camera.start).toHaveBeenCalled());
    const [cameraIdOrConfig] = camera.start.mock.calls[0];
    expect(typeof cameraIdOrConfig).toBe("object");
    expect(Object.keys(cameraIdOrConfig)).toEqual(["facingMode"]);
  });

  it("falls back gracefully when high-resolution camera constraints fail", async () => {
    let callCount = 0;
    camera.start.mockImplementation(async (_constraints, _config, decode) => {
      callCount++;
      if (callCount === 1) {
        throw new Error("OverconstrainedError: Constraints could not be satisfied");
      }
      camera.decode = decode;
    });

    render(<QRScanner active onScan={vi.fn()} />);
    await waitFor(() => expect(camera.start).toHaveBeenCalledTimes(2));
    const [fallbackIdOrConfig] = camera.start.mock.calls[1];
    expect(Object.keys(fallbackIdOrConfig)).toEqual(["facingMode"]);
  });
});
