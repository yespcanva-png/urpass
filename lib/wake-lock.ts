/**
 * Screen Wake Lock Manager
 *
 * Keeps screen awake during active event gate scanning.
 * Automatically re-acquires lock when returning from background/tab switches.
 */

export interface WakeLockController {
  request: () => Promise<boolean>;
  release: () => Promise<void>;
  isActive: () => boolean;
  isSupported: () => boolean;
}

export function createWakeLockController(
  onStateChange?: (active: boolean) => void
): WakeLockController {
  let sentinel: any = null;
  let requested = false;

  const isSupported = () => {
    return typeof navigator !== "undefined" && "wakeLock" in navigator;
  };

  const notify = (active: boolean) => {
    try {
      onStateChange?.(active);
    } catch {}
  };

  const handleRelease = () => {
    sentinel = null;
    notify(false);
  };

  const request = async (): Promise<boolean> => {
    requested = true;
    if (!isSupported()) {
      return false;
    }

    try {
      if (sentinel && !sentinel.released) {
        notify(true);
        return true;
      }

      // @ts-ignore
      sentinel = await navigator.wakeLock.request("screen");
      sentinel.addEventListener("release", handleRelease);
      notify(true);
      return true;
    } catch {
      sentinel = null;
      notify(false);
      return false;
    }
  };

  const release = async (): Promise<void> => {
    requested = false;
    if (sentinel) {
      try {
        await sentinel.release();
      } catch {}
      sentinel = null;
    }
    notify(false);
  };

  const handleVisibilityChange = async () => {
    if (typeof document === "undefined") return;
    if (document.visibilityState === "visible" && requested) {
      await request();
    }
  };

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }

  return {
    request,
    release,
    isActive: () => Boolean(sentinel && !sentinel.released),
    isSupported,
  };
}
