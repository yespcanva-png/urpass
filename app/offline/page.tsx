import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0A0612] text-white flex items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
          <WifiOff className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">You are offline</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          UrPass cannot load this page without a connection. Static app files may stay available, but private event data, QR credentials, payments, and live check-in records are never served from a shared offline cache.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href=""
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
