export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs">
      {/* Brand mark pulse */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 flex items-center justify-center shadow-lg shadow-neutral-900/10 animate-pulse">
            <span className="text-white font-extrabold text-sm tracking-wider">UP</span>
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-brand/20 animate-ping pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs font-bold tracking-widest text-neutral-900">URPASS</span>
          <span className="text-[10px] text-neutral-400 font-medium">by Yesp</span>
        </div>

        {/* Micro-indeterminate progress indicator */}
        <div className="w-28 h-1 bg-neutral-100 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-neutral-900 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
