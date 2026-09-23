/**
 * Scanner Sound + Haptic Feedback for Gate Check-in
 *
 * Implements P0 #3 specifications:
 * - High-speed gate validation without screen staring
 * - Web Audio API synthesized tones (0ms latency, zero MP3 downloads, fully offline)
 * - Exact haptic vibration patterns matching gate results
 */

export type FeedbackType =
  | "CHECKED_IN"
  | "ALREADY_CHECKED_IN"
  | "INVALID_PASS"
  | "NOT_APPROVED"
  | "WRONG_EVENT"
  | "NETWORK_ERROR"
  // Backwards-compatible aliases
  | "success"
  | "duplicate"
  | "access_denied"
  | "error";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Initializes and unlocks the browser Web Audio context on user interaction
 * (e.g. tapping "Start Scanning" or anywhere on the page).
 */
export function unlockAudioContext(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    // Play a silent buffer to prime audio engine on iOS Safari
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Ignore audio unlock exceptions
  }
}

/**
 * Triggers acoustic tone and tactile vibration matching the exact scan result.
 */
export function playScannerFeedback(
  type: FeedbackType,
  options: { sound?: boolean; haptics?: boolean } = {}
) {
  const { sound = true, haptics = true } = options;

  if (sound) {
    playTone(type);
  }

  if (haptics && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      switch (type) {
        case "CHECKED_IN":
        case "success":
          // Short 80ms tactile pulse
          navigator.vibrate(80);
          break;

        case "ALREADY_CHECKED_IN":
        case "duplicate":
          // Distinct [150, 80, 150] duplicate warning
          navigator.vibrate([150, 80, 150]);
          break;

        case "INVALID_PASS":
        case "NOT_APPROVED":
        case "WRONG_EVENT":
        case "access_denied":
        case "error":
          // 250ms stop/investigate buzz
          navigator.vibrate(250);
          break;

        case "NETWORK_ERROR":
          // [100, 50, 100] network glitch pulse
          navigator.vibrate([100, 50, 100]);
          break;
      }
    } catch {
      // Ignore vibration errors if restricted by device policy
    }
  }
}

function playTone(type: FeedbackType) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === "CHECKED_IN" || type === "success") {
      // ── Short High Chime (880Hz -> 1320Hz / A5 -> E6) ──
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now); // A5

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1318.5, now + 0.05); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.05);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.18);
    } else if (type === "ALREADY_CHECKED_IN" || type === "duplicate") {
      // ── Double Low Tone (280Hz pulses) ──
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(280, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.setValueAtTime(0.001, now + 0.09);
      gain.gain.setValueAtTime(0.22, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } else if (
      type === "INVALID_PASS" ||
      type === "NOT_APPROVED" ||
      type === "WRONG_EVENT" ||
      type === "access_denied"
    ) {
      // ── Low Buzz (160Hz Sawtooth, 250ms) ──
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // ── Network Error Tone (Alternating 380Hz -> 220Hz) ──
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.setValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio playback exceptions if audio context is blocked
  }
}
