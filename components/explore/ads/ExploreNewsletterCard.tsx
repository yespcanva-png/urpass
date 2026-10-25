"use client";

import { useState, useTransition } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { subscribeExploreNewsletterAction } from "@/app/actions/explore-ads";
import Link from "next/link";

interface ExploreNewsletterCardProps {
  currentCity?: string;
  className?: string;
}

export default function ExploreNewsletterCard({
  currentCity = "All Cities",
  className = "",
}: ExploreNewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNewSubscriber, setIsNewSubscriber] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMsg("Please agree to receive curated event digests.");
      return;
    }

    startTransition(async () => {
      const res = await subscribeExploreNewsletterAction({
        email: email.trim(),
        city: currentCity,
        consentGiven: true,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Subscription failed. Please try again.");
      } else {
        setIsSubscribed(true);
        setIsNewSubscriber(res.isNew ?? true);
        setUnsubscribeToken(res.unsubscribeToken || null);
      }
    });
  };

  return (
    <div
      className={`rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white p-5 sm:p-6 shadow-xs relative overflow-hidden ${className}`}
      role="region"
      aria-label="Event Updates Newsletter"
    >
      {/* Decorative accent background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900 leading-tight">
            Never Miss an Event
          </h3>
          <p className="text-[11px] text-neutral-500">
            {currentCity !== "All Cities" ? `Updates in ${currentCity}` : "Curated event updates"}
          </p>
        </div>
      </div>

      <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
        Sign up for curated concerts, conferences, and weekend events when updates are available.
      </p>

      {/* Confirmation State */}
      {isSubscribed ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100/90 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">
              {isNewSubscriber ? "You're on the list!" : "Preferences updated!"}
            </p>
            <p className="text-[11px] text-emerald-700/90 mt-0.5">
              Your preference for {currentCity} is saved for {email}.
            </p>
            {unsubscribeToken && <Link href={`/explore/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`} className="mt-2 inline-block underline">Unsubscribe</Link>}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isPending}
              required
              className="w-full pl-3.5 pr-20 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          <label className="flex items-start gap-2 text-[11px] text-neutral-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
            />
            <span>
              I agree to receive event digests. Zero spam, unsubscribe anytime.
            </span>
          </label>
        </form>
      )}
    </div>
  );
}
