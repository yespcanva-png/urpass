export default function OrganizationsLoading() {
  return (
    <div className="max-w-5xl mx-auto page-in space-y-6">
      {/* ── Enterprise Header Skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-64 bg-neutral-200/80 rounded-xl animate-pulse" />
            <div className="h-5 w-24 bg-purple-100/70 rounded-full animate-pulse" />
          </div>
          <div className="h-4 w-80 max-w-full bg-neutral-200/60 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-purple-600 animate-spin"
            role="status"
            aria-label="Loading organizations"
          />
          <div className="h-10 w-36 bg-neutral-200/80 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* ── Multi-Tenant Callout Banner Skeleton ── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-lg">
          <div className="h-5 w-48 bg-neutral-200/80 rounded-lg animate-pulse" />
          <div className="h-3.5 w-full bg-neutral-200/60 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-neutral-200/70 rounded-xl animate-pulse shrink-0" />
      </div>

      {/* ── Section Title Skeleton ── */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-36 bg-neutral-200/70 rounded animate-pulse" />
        <div className="h-4 w-20 bg-neutral-200/50 rounded animate-pulse" />
      </div>

      {/* ── Org Cards Grid Skeleton ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-4"
          >
            {/* Top row: emblem, title, badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-200/80 animate-pulse shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4.5 w-36 bg-neutral-200/80 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-neutral-200/60 rounded font-mono animate-pulse" />
                </div>
              </div>
              <div className="h-5 w-16 bg-neutral-200/70 rounded-full animate-pulse shrink-0" />
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
              {[0, 1, 2].map((m) => (
                <div key={m} className="bg-neutral-50 rounded-xl p-2.5 space-y-1">
                  <div className="h-2.5 w-12 bg-neutral-200/60 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-neutral-200/80 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 w-28 bg-neutral-200/50 rounded animate-pulse" />
              <div className="h-8 w-24 bg-neutral-200/80 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
