export default function OrgSlugLoading() {
  return (
    <div className="space-y-8 page-in">
      {/* ── Status Bar / Spinner Indicator ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full border-2 border-neutral-300 border-t-purple-600 animate-spin"
            role="status"
            aria-label="Loading organization data"
          />
          <span className="text-xs font-mono font-medium text-neutral-500">
            Syncing corporate telemetry & directory...
          </span>
        </div>
        <div className="h-6 w-28 bg-neutral-100 rounded-full animate-pulse" />
      </div>

      {/* ── 4 Executive KPI Cards Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 animate-pulse" />
              <div className="h-4 w-12 bg-neutral-100 rounded-full animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="h-7 w-16 bg-neutral-200/80 rounded-lg animate-pulse" />
              <div className="h-3 w-28 bg-neutral-200/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Operations Launchpad Skeleton ── */}
      <div className="space-y-3">
        <div className="h-4 w-40 bg-neutral-200/70 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-neutral-200/80 rounded animate-pulse" />
                <div className="h-3 w-48 bg-neutral-200/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Events Directory Table Skeleton ── */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="h-5 w-44 bg-neutral-200/80 rounded animate-pulse" />
            <div className="h-3 w-64 bg-neutral-200/50 rounded animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-neutral-100 rounded-xl animate-pulse" />
        </div>

        <div className="divide-y divide-neutral-100">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 w-48 bg-neutral-200/80 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-neutral-200/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-6 w-20 bg-neutral-100 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-neutral-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
