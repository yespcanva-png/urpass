"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Ticket,
  Calendar,
  Building2,
  HelpCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { EvaluationResult, SmartOffer } from "@/lib/smart-offers/types";
import {
  getSmartOfferAction,
  trackSmartOfferInteractionAction,
} from "@/app/actions/smart-offers";

interface Props {
  initialResult?: EvaluationResult | null;
  triggerContext?: {
    currentPlanSlug?: string;
    totalEventsCount?: number;
    completedEventsCount?: number;
    estimatedAttendees?: number;
    pricingVisitsCount?: number;
    checkoutAbandoned?: boolean;
    usageRatio?: number;
    isOneTimeEventIntent?: boolean;
    isRecurringIntent?: boolean;
  };
  className?: string;
}

const INTENT_ICONS: Record<string, React.ElementType> = {
  exploring: Sparkles,
  first_event: Calendar,
  one_time_event: Ticket,
  paid_ticketing: Zap,
  large_event: Building2,
  price_sensitive: HelpCircle,
  returning_organizer: ShieldCheck,
};

export default function SmartOfferBanner({
  initialResult,
  triggerContext,
  className = "",
}: Props) {
  const [result, setResult] = useState<EvaluationResult | null>(initialResult ?? null);
  const [dismissed, setDismissed] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (initialResult) return;

    let isMounted = true;
    startTransition(async () => {
      try {
        const res = await getSmartOfferAction(triggerContext || {});
        if (isMounted && res) {
          setResult(res);
          if (res.decisionId && !res.isControlGroup) {
            trackSmartOfferInteractionAction(res.decisionId, "viewed").catch(() => {});
          }
        }
      } catch (err) {
        console.warn("[SmartOfferBanner] Failed to load offer:", err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [initialResult, triggerContext]);

  if (!result || dismissed || result.isControlGroup) {
    // If in the control group (10% holdout), suppress offer display to measure organic baseline lift
    return null;
  }

  const { offer, intent, reason, decisionId } = result;
  const Icon = INTENT_ICONS[intent] || Sparkles;

  const handleCtaClick = () => {
    if (decisionId) {
      trackSmartOfferInteractionAction(decisionId, "accepted").catch(() => {});
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (decisionId) {
      trackSmartOfferInteractionAction(decisionId, "dismissed").catch(() => {});
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-violet-200/90 bg-gradient-to-r from-violet-50/95 via-purple-50/80 to-white p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Icon & Offer Copy */}
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="p-2.5 rounded-xl bg-violet-600 text-white shrink-0 mt-0.5 shadow-xs">
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-800 bg-violet-100/90 border border-violet-200 px-2 py-0.5 rounded-md">
                <Sparkles className="w-2.5 h-2.5 text-violet-600" />
                {offer.badge}
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">
                Personalised Recommendation
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-neutral-950 leading-snug">
              {offer.headline}
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
              {offer.subtext}
            </p>

            {offer.helperNote && (
              <p className="text-[11px] font-medium text-violet-700/90 pt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span>{offer.helperNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end">
          {offer.secondaryCtaLabel && offer.secondaryCtaUrl && (
            <Link
              href={offer.secondaryCtaUrl}
              onClick={handleCtaClick}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white/80 hover:bg-white border border-neutral-200 transition-colors"
            >
              {offer.secondaryCtaLabel}
            </Link>
          )}

          <Link
            href={offer.primaryCtaUrl}
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>{offer.primaryCtaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss offer recommendation"
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
