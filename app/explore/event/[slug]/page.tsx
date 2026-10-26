import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Ticket, UserRound } from "lucide-react";
import { getExploreEventDetail } from "@/lib/explore/event-detail";
import ExploreJourneyTracker from "@/components/explore/ExploreJourneyTracker";
import ExploreBookLink from "@/components/explore/ExploreBookLink";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getExploreEventDetail(slug);
  if (!event) return { title: "Event not found — UrPass Explore", robots: { index: false, follow: false } };
  const description = event.description?.slice(0, 160) || `Book tickets for ${event.name} on UrPass Explore.`;
  return {
    title: `${event.name} — UrPass Explore`, description,
    alternates: { canonical: `https://urpass.space/explore/event/${event.slug}` },
    openGraph: { title: event.name, description, images: event.banner ? [event.banner] : [] },
  };
}

function dateLabel(date: string, time: string) {
  return {
    date: new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time: new Date(`2020-01-01T${time}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default async function ExploreEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getExploreEventDetail(slug);
  if (!event) notFound();

  const { date, time } = dateLabel(event.date, event.startTime);
  const price = event.startingPricePaise === 0 ? "Free" : `₹${(event.startingPricePaise / 100).toLocaleString("en-IN")}`;
  const bookingUrl = `/explore/event/${encodeURIComponent(event.slug)}/book`;
  const bookable = event.registrationOpen && (event.ticketTypes.length === 0 || event.ticketTypes.some((ticket) => ticket.available));
  const actionLabel = event.approvalRequired ? "Request to Attend" : "Get Tickets";
  const structuredData = {
    "@context": "https://schema.org", "@type": "Event",
    name: event.name, description: event.description || undefined,
    startDate: `${event.date}T${event.startTime}`,
    ...(event.endTime ? { endDate: `${event.date}T${event.endTime}` } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.city === "Online" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    image: event.banner ? [event.banner] : undefined,
    location: event.city === "Online"
      ? { "@type": "VirtualLocation", url: `https://urpass.space/explore/event/${event.slug}` }
      : { "@type": "Place", name: event.venue, address: event.address || `${event.city || ""}, ${event.city === "London" ? "United Kingdom" : "India"}` },
    organizer: { "@type": "Organization", name: event.organizer },
    url: `https://urpass.space/explore/event/${event.slug}`,
    offers: bookable ? { "@type": "Offer", url: `https://urpass.space${bookingUrl}`,
      price: (event.startingPricePaise / 100).toFixed(2), priceCurrency: event.currency,
      availability: "https://schema.org/InStock" } : undefined,
  };

  return (
    <main className="min-h-screen bg-white pb-28 text-neutral-950 sm:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <ExploreJourneyTracker eventId={event.id} stage="detail_view" />
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-violet-700"><ArrowLeft className="h-4 w-4" /> Explore</Link>
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700"><Ticket className="h-5 w-5 -rotate-12" /> UrPass Explore</Link>
          <Link href="/explore/profile" aria-label="My Profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-700 hover:bg-violet-100"><UserRound className="h-5 w-5" /></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-9">
        <div className="relative aspect-[16/9] max-h-[500px] overflow-hidden rounded-[24px] bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-500 sm:rounded-[32px]">
          {event.banner ? <Image src={event.banner} alt={event.name} fill unoptimized priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" /> : <Ticket className="absolute bottom-10 left-10 h-16 w-16 text-white/60" />}
        </div>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-xs font-bold text-violet-700"><span className="rounded-full bg-violet-50 px-3 py-1.5">{event.category}</span><span className="rounded-full bg-neutral-100 px-3 py-1.5">Public event</span></div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">{event.name}</h1>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-violet-700" /><div><p className="font-bold">{date}</p><p className="mt-1 text-sm text-neutral-500">{time} onwards</p></div></div>
              <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-violet-700" /><div><p className="font-bold">{event.venue}</p>{event.address && <p className="mt-1 text-sm text-neutral-500">{event.address}</p>}<a href={`https://maps.google.com/?q=${encodeURIComponent(event.address || event.venue)}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-violet-700 hover:underline">Venue details and directions</a></div></div>
            </div>
            <div className="mt-8 border-y border-neutral-200 py-5 text-sm text-neutral-500">Organized by <span className="font-bold text-neutral-900">{event.organizer}</span></div>

            {event.description && <section className="mt-9"><h2 className="text-2xl font-extrabold tracking-tight">About this event</h2><p className="mt-4 whitespace-pre-wrap text-base leading-7 text-neutral-600">{event.description}</p></section>}

            <div className="mt-10 space-y-3 border-t border-neutral-200 pt-8">
              {event.sessions.length > 0 && <details className="rounded-2xl border border-neutral-200 px-5 py-4"><summary className="cursor-pointer font-bold">Event schedule</summary><ul className="mt-4 space-y-3 text-sm text-neutral-600">{event.sessions.map((session) => <li key={session.id} className="flex flex-wrap justify-between gap-2"><span>{session.title}</span><span className="font-semibold">{session.date} · {session.startTime.slice(0, 5)}–{session.endTime.slice(0, 5)}</span></li>)}</ul></details>}
              {event.ticketTypes.some((ticket) => ticket.description) && <details className="rounded-2xl border border-neutral-200 px-5 py-4"><summary className="cursor-pointer font-bold">Ticket inclusions</summary><ul className="mt-4 space-y-3 text-sm text-neutral-600">{event.ticketTypes.filter((ticket) => ticket.description).map((ticket) => <li key={ticket.id}><strong className="text-neutral-900">{ticket.name}:</strong> {ticket.description}</li>)}</ul></details>}
              <details className="rounded-2xl border border-neutral-200 px-5 py-4"><summary className="cursor-pointer font-bold">Directions</summary><p className="mt-4 text-sm text-neutral-600">{event.address || event.venue}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(event.address || event.venue)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-violet-700">Open in Maps ↗</a></details>
            </div>
          </div>

          <aside className="sticky top-6 hidden rounded-[26px] border border-neutral-200 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(53,30,94,0.4)] lg:block">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">{event.approvalRequired ? "Registration" : "Tickets from"}</p>
            <p className="mt-2 text-3xl font-extrabold">{event.approvalRequired ? "Approval required" : price}</p>
            {event.approvalRequired && <p className="mt-2 text-sm text-neutral-500">The organizer will review your request before issuing a pass.{event.startingPricePaise > 0 ? " Payment is collected when you submit; declined requests are refunded." : ""}</p>}
            {bookable ? <ExploreBookLink eventId={event.id} href={bookingUrl} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800">{actionLabel}<ArrowRight className="h-4 w-4" /></ExploreBookLink> : <p className="mt-6 rounded-xl bg-neutral-100 p-3 text-sm font-semibold text-neutral-600">Registration is currently unavailable.</p>}
            <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><Clock3 className="h-4 w-4" /> Secure booking through UrPass</p>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-neutral-200 bg-white/95 px-5 py-3 backdrop-blur-lg lg:hidden">
        <div><p className="text-[11px] font-semibold text-neutral-500">{event.approvalRequired ? "Registration" : "Tickets from"}</p><p className="text-lg font-extrabold">{event.approvalRequired ? "Request" : price}</p></div>
        {bookable ? <ExploreBookLink eventId={event.id} href={bookingUrl} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-bold text-white">{actionLabel}<ArrowRight className="h-4 w-4" /></ExploreBookLink> : <span className="text-sm font-semibold text-neutral-500">Unavailable</span>}
      </div>
    </main>
  );
}
