import AppShellSkeleton from "@/components/layouts/AppShellSkeleton";

export default function EventLoading() {
  return (
    <AppShellSkeleton>
      {/* ── Page Header Skeleton ───────────────────────────── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="px-4 lg:px-8 pt-5 pb-0">
          {/* Back link */}
          <div className="h-3 w-20 rounded skeleton mb-4" />

          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="h-6 w-56 rounded-lg skeleton" />
              <div className="flex items-center gap-3 mt-1">
                <div className="h-3 w-28 rounded skeleton" />
                <div className="h-3 w-24 rounded skeleton" />
                <div className="h-3 w-32 rounded skeleton" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full skeleton shrink-0" />
          </div>

          {/* SubNav tabs */}
          <div className="flex gap-2 pb-2 overflow-hidden">
            {[60, 50, 75, 65, 55, 60, 60, 55].map((w, i) => (
              <div key={i} className="h-8 rounded-lg skeleton shrink-0" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Skeleton ──────────────────────────────── */}
      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Action bar skeleton */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-9 w-32 rounded-xl skeleton" />
              <div className="h-9 w-28 rounded-xl skeleton" />
              <div className="h-9 w-24 rounded-xl skeleton" />
            </div>
            <div className="h-4 w-16 rounded skeleton" />
          </div>

          {/* 3 Large Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-neutral-100/60">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 rounded skeleton" />
                  <div className="w-7 h-7 rounded-xl skeleton" />
                </div>
                <div className="h-8 w-14 rounded-lg skeleton" />
                <div className="h-3 w-28 rounded skeleton" />
              </div>
            ))}
          </div>

          {/* 3 Secondary Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3 border border-neutral-100/60">
                <div className="w-7 h-7 rounded-xl skeleton shrink-0" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-5 w-12 rounded skeleton" />
                  <div className="h-2.5 w-20 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart card skeleton */}
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-5 border border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl skeleton" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-44 rounded skeleton" />
                  <div className="h-3 w-60 rounded skeleton" />
                </div>
              </div>
              <div className="h-8 w-24 rounded-xl skeleton" />
            </div>
            <div className="h-36 w-full rounded-2xl bg-neutral-50 flex items-end gap-2 p-4">
              {[40, 60, 85, 100, 70, 45, 30].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-lg skeleton" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
