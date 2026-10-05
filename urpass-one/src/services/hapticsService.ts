import type { ScanFeedbackColor } from "../types";

export const HapticsService = {
  triggerFeedback(color: ScanFeedbackColor) {
    // 1. Web / React Native vibration fallback
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        if (color === "green") {
          navigator.vibrate(60); // short crisp pulse
        } else if (color === "red") {
          navigator.vibrate([100, 50, 100, 50, 150]); // distinct alarm pattern
        } else if (color === "amber") {
          navigator.vibrate([80, 80, 80]); // double pulse
        }
      } catch {
        // ignore
      }
    }

    // 2. Optional Audio Synthesizer Beep for immediate auditory cue
    if (typeof window !== "undefined" && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (color === "green") {
          // High upbeat pleasant chime (1200Hz -> 1800Hz)
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (color === "red") {
          // Low buzzing dissonant error tone (220Hz)
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(180, now + 0.12);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.28);
        } else if (color === "amber") {
          // Mid-range warning double-chirp
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        }
      } catch {
        // AudioContext autoplay restrictions or mock environment
      }
    }
  },
};
