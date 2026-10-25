import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Ticket } from "lucide-react";
import { cleanPassToken, getHardenedPublicPass } from "@/lib/passes/public-pass";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Booking confirmed — UrPass Explore", robots: { index: false, follow: false } };

export default async function ExploreBookingSuccessPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const token = cleanPassToken(bookingId);
  const publicPass = token ? await getHardenedPublicPass(token) : null;
  if (!publicPass || publicPass.attendee.application_status !== "approved" || !["generated", "checked_in"].includes(publicPass.pass.status)) notFound();

  const { event, pass } = publicPass;
  const date = new Date(`${event.event_date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 via-white to-white px-5 py-12 text-neutral-950">
      <div className="w-full max-w-lg rounded-[30px] border border-neutral-200 bg-white p-7 text-center shadow-[0_28px_70px_-45px_rgba(53,30,94,0.5)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-9 w-9" /></div>
        <span className="mt-6 block text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700">UrPass Explore</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">You&apos;re going!</h1>
        <p className="mt-3 text-sm text-neutral-600">Your registration is confirmed. Your QR ticket is ready.</p>
        <div className="mt-7 rounded-2xl bg-neutral-50 p-5 text-left">
          <div className="flex items-start gap-3"><Ticket className="mt-1 h-5 w-5 shrink-0 text-violet-700" /><div><p className="font-extrabold">{event.name}</p><p className="mt-1 text-sm text-neutral-500">{date} · {event.venue}</p></div></div>
          <div className="mt-5 border-t border-neutral-200 pt-4"><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Booking reference</p><p className="mt-1 font-mono text-sm font-bold tracking-wider text-neutral-800">{pass.pass_token.slice(0, 8).toUpperCase()}</p></div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href={`/pass/${encodeURIComponent(pass.pass_token)}`} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800">View QR ticket <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/explore/my-tickets" className="flex min-h-12 items-center justify-center rounded-full border border-violet-200 px-5 text-sm font-bold text-violet-700 hover:bg-violet-50">View My Tickets</Link>
        </div>
        <Link href="/explore" className="mt-7 inline-block text-sm font-semibold text-neutral-500 hover:text-violet-700">Explore more events</Link>
      </div>
    </main>
  );
}
