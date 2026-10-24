"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, ShieldCheck, RefreshCw } from "lucide-react";
import { cancelSubscription, reactivateSubscription } from "@/app/actions/billing";

interface CancelButtonProps {
  cancellationState?: string | null;
  cancellationError?: string | null;
  paidThroughDate?: string | null;
  isCancelledAtEnd?: boolean;
}

export default function CancelButton({
  cancellationState = "none",
  cancellationError,
  paidThroughDate,
  isCancelledAtEnd = false,
}: CancelButtonProps) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const isScheduled =
    cancellationState === "cancellation_scheduled" ||
    (isCancelledAtEnd && cancellationState !== "cancellation_failed");
  const isFailed = cancellationState === "cancellation_failed";

  async function handleCancel() {
    setError("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const result = await cancelSubscription();
        if (result?.error) {
          setError(result.error);
        } else {
          setConfirm(false);
          setSuccessMessage(result?.message || "Auto-renewal cancelled. Paid-through access remains active.");
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to cancel subscription");
      }
    });
  }

  async function handleReactivate() {
    setError("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const result = await reactivateSubscription();
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccessMessage(result?.message || "Subscription auto-renewal reactivated.");
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reactivate subscription");
      }
    });
  }

  // 1. If cancellation is already scheduled for period end: show Reactivate button and explanation
  if (isScheduled) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReactivate}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors disabled:opacity-50 shadow-xs"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isPending ? "Reactivating..." : "Reactivate Auto-Renewal"}</span>
          </button>
        </div>
        {successMessage && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. If provider cancellation previously failed: show error and retry button
  if (isFailed) {
    return (
      <div className="flex flex-col items-end gap-2 bg-rose-50 border border-rose-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-start gap-1.5 text-right max-w-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-rose-800 font-medium leading-tight">
            Razorpay cancellation failed: {cancellationError || "Provider error"}. Please retry or contact support.
          </p>
        </div>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 shadow-xs"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{isPending ? "Retrying..." : "Retry Cancellation"}</span>
        </button>
      </div>
    );
  }

  // 3. Normal state: initial Cancel Button
  if (!confirm) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={() => {
            setConfirm(true);
            setError("");
          }}
          className="text-xs font-medium text-neutral-500 hover:text-rose-600 transition-colors px-2 py-1 rounded-md hover:bg-rose-50/60"
        >
          Cancel subscription
        </button>
        {error && (
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // 4. Confirmation dialog
  return (
    <div className="flex flex-col gap-2 items-end bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 shadow-xs">
      <p className="text-[11px] text-neutral-600 font-medium max-w-xs text-right leading-relaxed">
        Cancel auto-renewal? Razorpay recurring debits will stop immediately. Your paid access stays active until{" "}
        <strong className="text-neutral-900">{paidThroughDate || "the end of your billing cycle"}</strong>.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setConfirm(false);
            setError("");
          }}
          disabled={isPending}
          className="px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-xl bg-white transition-colors disabled:opacity-50"
        >
          Keep plan
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 shadow-xs"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{isPending ? "Cancelling with Gateway..." : "Confirm cancel"}</span>
        </button>
      </div>
      {error && (
        <div className="inline-flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
