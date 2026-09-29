export default function BillingLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 page-in animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-neutral-200/70 rounded-md" />
          <div className="h-8 w-64 bg-neutral-200/80 rounded-xl" />
          <div className="h-4 w-80 bg-neutral-200/50 rounded-md" />
        </div>
        <div className="h-9 w-36 bg-neutral-200/60 rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="h-10 bg-neutral-200/60 rounded-xl w-72" />

      {/* Subscription Card Skeleton */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
        <div className="h-4 w-36 bg-neutral-200/60 rounded-md" />
        <div className="h-7 w-48 bg-neutral-200/80 rounded-xl" />
        <div className="h-4 w-96 bg-neutral-200/50 rounded-md" />
      </div>

      {/* Quotas Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="h-8 w-8 rounded-xl bg-neutral-200/70" />
          <div className="h-6 w-20 bg-neutral-200/80 rounded-md" />
          <div className="h-2 w-full bg-neutral-100 rounded-full" />
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="h-8 w-8 rounded-xl bg-neutral-200/70" />
          <div className="h-6 w-20 bg-neutral-200/80 rounded-md" />
          <div className="h-2 w-full bg-neutral-100 rounded-full" />
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="h-8 w-8 rounded-xl bg-neutral-200/70" />
          <div className="h-6 w-20 bg-neutral-200/80 rounded-md" />
          <div className="h-2 w-full bg-neutral-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
