import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createWakeLockController } from "@/lib/wake-lock";

describe("createWakeLockController", () => {
  let mockSentinel: {
    released: boolean;
    release: ReturnType<typeof vi.fn>;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockSentinel = {
      released: false,
      release: vi.fn().mockImplementation(async () => {
        mockSentinel.released = true;
      }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(global.navigator, "wakeLock", {
      value: {
        request: vi.fn().mockResolvedValue(mockSentinel),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports support correctly when wakeLock is available", () => {
    const controller = createWakeLockController();
    expect(controller.isSupported()).toBe(true);
  });

  it("requests screen wake lock and notifies state changes", async () => {
    const stateCallback = vi.fn();
    const controller = createWakeLockController(stateCallback);

    const ok = await controller.request();
    expect(ok).toBe(true);
    expect(controller.isActive()).toBe(true);
    expect(navigator.wakeLock.request).toHaveBeenCalledWith("screen");
    expect(stateCallback).toHaveBeenCalledWith(true);
  });

  it("releases screen wake lock cleanly", async () => {
    const stateCallback = vi.fn();
    const controller = createWakeLockController(stateCallback);

    await controller.request();
    await controller.release();

    expect(mockSentinel.release).toHaveBeenCalled();
    expect(controller.isActive()).toBe(false);
    expect(stateCallback).toHaveBeenLastCalledWith(false);
  });

  it("gracefully falls back when navigator.wakeLock throws", async () => {
    (navigator.wakeLock.request as any).mockRejectedValueOnce(new Error("Permission denied"));
    const stateCallback = vi.fn();
    const controller = createWakeLockController(stateCallback);

    const ok = await controller.request();
    expect(ok).toBe(false);
    expect(controller.isActive()).toBe(false);
    expect(stateCallback).toHaveBeenCalledWith(false);
  });
});
