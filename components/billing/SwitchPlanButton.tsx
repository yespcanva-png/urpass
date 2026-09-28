"use client";

import { useState, useTransition } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { switchPlan } from "@/app/actions/billing";

interface Props {
  planSlug: string;
  planName: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SwitchPlanButton({
  planSlug,
  planName,
  className = "",
  style,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSwitch() {
    setError("");
    startTransition(async () => {
      try {
        const result = await switchPlan(planSlug);
        if (result?.error) {
          setError(result.error);
        } else {
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to switch plan");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        onClick={handleSwitch}
        disabled={isPending}
        className={`flex items-center justify-center gap-2 ${className}`}
        style={style}
      >
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {isPending ? "Switching…" : `Switch to ${planName}`}
      </button>
      {error && (
        <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
