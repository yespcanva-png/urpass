"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function EventDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[EventDashboardError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 border border-red-100 shadow-xs">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-neutral-900 mb-2">Event View Error</h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-sm">
        We encountered an issue loading this event view. Please try reloading the page or returning to your dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Go to dashboard</span>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-[11px] text-neutral-400 font-mono">
          Digest: {error.digest}
        </p>
      )}
    </div>
  );
}
