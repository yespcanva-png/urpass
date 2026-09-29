export default function EventsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-xl skeleton" />
          <div className="h-3.5 w-60 rounded skeleton" />
        </div>
        <div className="h-10 w-32 rounded-xl skeleton" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2">
        {[64, 56, 56, 72].map((w, i) => (
          <div key={i} className="h-8 rounded-lg skeleton" style={{ width: w }} />
        ))}
      </div>

      {/* Event rows skeleton */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-neutral-100">
            <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-4 rounded w-52" />
              <div className="skeleton h-3 rounded w-36" />
            </div>
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton w-5 h-5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
