"use client";

import { useState } from "react";
import { UserCheck, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { claimPlaceholderPassAction } from "@/app/actions/personalize-pass";

interface PersonalizePassModalProps {
  passToken: string;
  eventName: string;
}

export default function PersonalizePassModal({ passToken, eventName }: PersonalizePassModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please enter your name and email.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await claimPlaceholderPassAction({
        passToken,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.message || "Failed to personalize ticket.");
      } else {
        setCompleted(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mb-6 no-print">
      <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 dark:bg-amber-950/40 p-4 shadow-sm text-left">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
              Personalize Your Entry Pass
            </h4>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
              This ticket was shared from a bulk booking. Enter your details to put your name on this pass and receive an instant copy via email &amp; WhatsApp.
            </p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-amber-900 dark:bg-amber-100 hover:bg-amber-800 dark:hover:bg-white text-white dark:text-amber-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim &amp; Personalize Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#111317] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400">
                {eventName}
              </span>
            </div>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Personalize Your Entry Ticket
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Your name and contact details will appear directly on your digital ticket and Apple Wallet card.
            </p>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {completed ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  🎉 Ticket Personalized Successfully!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Reloading your pass now…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyansh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. attendee@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Phone (WhatsApp QR Pass)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5" />
                    )}
                    <span>Update &amp; Re-generate Pass</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
