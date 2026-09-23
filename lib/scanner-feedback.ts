/**
 * Scanner Sound + Haptic Feedback for Gate Check-in
 *
 * Uses Web Audio API for synthetic crystal-clear audio tones:
 * - 0ms network latency (completely client-side)
 * - Zero static audio assets to download or 404
 * - Works offline in flight/airplane mode
 *
 * Uses Web Vibration API for tactile mobile confirmation
 */

export type FeedbackType =
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
 * Triggers acoustic and tactile feedback matching scanner check-in status.
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
        case "success":
          // Quick, crisp, positive confirmation
          navigator.vibrate([70]);
          break;
        case "duplicate":
          // Distinct double warning buzz
          navigator.vibrate([120, 80, 120]);
          break;
        case "access_denied":
        case "error":
          // Strong error buzz
          navigator.vibrate([250]);
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

    if (type === "success") {
      // Crisp 2-tone rising chime (587Hz -> 880Hz / D5 -> A5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.28);
    } else if (type === "duplicate") {
      // Double warning pulse (330Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.001, now + 0.09);
      gain.gain.setValueAtTime(0.2, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === "access_denied") {
      // Descending low alert tone (260Hz -> 140Hz sawtooth/triangle blend)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.26);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Error tone: harsh low buzz (180Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Ignore audio playback exceptions if audio context is blocked
  }
}
