"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { cancelSubscription } from "@/app/actions/billing";

export default function CancelButton() {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCancel() {
    setError("");
    startTransition(async () => {
      try {
        const result = await cancelSubscription();
        if (result?.error) {
          setError(result.error);
        } else {
          setConfirm(false);
          router.refresh();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to cancel subscription"
        );
      }
    });
  }

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

  return (
    <div className="flex flex-col gap-2 items-end bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 shadow-xs">
      <p className="text-[11px] text-neutral-600 font-medium max-w-xs text-right">
        Cancel auto-renewal? Access stays active until the end of your billing cycle.
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
          {isPending ? "Cancelling..." : "Confirm cancel"}
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
