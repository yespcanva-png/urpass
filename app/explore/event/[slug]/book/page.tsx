import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";
import ApplyPage from "@/app/apply/[eventId]/page";
import { getExploreEventDetail } from "@/lib/explore/event-detail";
import ExploreJourneyTracker from "@/components/explore/ExploreJourneyTracker";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Book tickets — UrPass Explore", robots: { index: false, follow: false } };

export default async function ExploreBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getExploreEventDetail(slug);
  if (!event || !event.registrationOpen) notFound();

  const date = new Date(`${event.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="min-h-screen bg-[#faf9fc]">
      <ExploreJourneyTracker eventId={event.id} stage="ticket_selection" />
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link href={`/explore/event/${encodeURIComponent(event.slug)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-violet-700"><ArrowLeft className="h-4 w-4" /> Event details</Link>
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700"><Ticket className="h-5 w-5 -rotate-12" /> Explore</Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 pt-10 sm:px-8">
        <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-violet-700">Booking · Step 1 of 3</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">{event.approvalRequired ? "Request to attend" : "Book your tickets"}</h1>
        <p className="mt-2 text-sm text-neutral-500">Select tickets, add attendee details, then review and confirm.</p>
        {event.approvalRequired && event.startingPricePaise > 0 && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">This event uses payment before organizer review. If your request is declined, UrPass starts a refund through the existing payment flow.</p>}
        <div className="mt-7 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-800 to-fuchsia-500">
            {event.banner && <Image src={event.banner} alt="" fill unoptimized sizes="96px" className="object-cover" />}
          </div>
          <div className="min-w-0"><p className="truncate font-extrabold text-neutral-950">{event.name}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500"><CalendarDays className="h-3.5 w-3.5" /> {date}</p><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-neutral-500"><MapPin className="h-3.5 w-3.5 shrink-0" /> {event.venue}</p></div>
        </div>
      </div>
      <ApplyPage params={Promise.resolve({ eventId: event.id })} exploreMode />
    </div>
  );
}
