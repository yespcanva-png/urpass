import AppShellSkeleton from "@/components/layouts/AppShellSkeleton";

export default function OrgLayoutLoading() {
  return (
    <AppShellSkeleton>
      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 bg-neutral-200/60 rounded animate-pulse" />
            <div className="h-3 w-3 bg-neutral-200/40 rounded animate-pulse" />
            <div className="h-3 w-28 bg-neutral-200/80 rounded animate-pulse" />
          </div>

          {/* Corporate Header Card Skeleton */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-200/80 animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-56 bg-neutral-200/80 rounded-xl animate-pulse" />
                  <div className="h-5 w-24 bg-purple-100 rounded-full animate-pulse" />
                </div>
                <div className="h-3.5 w-64 bg-neutral-200/50 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-purple-600 animate-spin"
                role="status"
                aria-label="Loading organization"
              />
              <div className="h-10 w-32 bg-neutral-200/70 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* SubNav Bar Skeleton */}
          <div className="h-12 bg-white border border-neutral-200/80 rounded-2xl p-1.5 flex items-center gap-2">
            {[90, 140, 120, 100, 110, 110].map((w, i) => (
              <div
                key={i}
                className="h-9 rounded-xl bg-neutral-100 animate-pulse shrink-0"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          {/* Metric Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-7 w-16 bg-neutral-200/80 rounded-lg animate-pulse" />
                <div className="h-3 w-24 bg-neutral-200/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
