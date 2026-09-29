export default function RootLoading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center py-16">
      <div
        className="w-7 h-7 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
