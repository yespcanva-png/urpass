import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Compass,
  Sparkles,
  Calendar,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import {
  getExploreSeoPage,
  buildExploreCollectionSummary,
  MIN_EXPLORE_COLLECTION_EVENTS,
  type ExploreSeoPageConfig,
} from "@/lib/explore/seo-pages";
import { fetchEventsForSeoPage } from "@/lib/explore/service";
import EventCard from "@/components/explore/EventCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getExploreSeoPage(slug);

  if (!page) {
    return {
      title: "Page Not Found — UrPass Explore",
      robots: { index: false, follow: false },
    };
  }

  // Keep thin collections out of search until there is useful live inventory.
  let matchingEvents = [] as Awaited<ReturnType<typeof fetchEventsForSeoPage>>["matchingEvents"];
  try {
    ({ matchingEvents } = await fetchEventsForSeoPage(page));
  } catch {
    matchingEvents = [];
  }
  const isIndexableCollection = matchingEvents.length >= MIN_EXPLORE_COLLECTION_EVENTS;
  const description = buildExploreCollectionSummary(page, matchingEvents);

  const robots = isIndexableCollection
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: true,
      };

  const canonicalUrl = `https://urpass.space/explore/${page.slug}`;

  return {
    title: page.seoTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      title: page.seoTitle,
      description,
      url: canonicalUrl,
      siteName: "UrPass Explore",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description,
    },
  };
}

export default async function ExploreSeoCollectionPage({ params }: Props) {
  const { slug } = await params;
  const page = getExploreSeoPage(slug);

  if (!page) {
    notFound();
  }

  const { matchingEvents, fallbackEvents, totalMatches } = await fetchEventsForSeoPage(page);
  const summary = buildExploreCollectionSummary(page, matchingEvents);
  const highlights = matchingEvents.slice(0, 4).map((event) => ({
    title: event.name,
    desc: `${event.eventDate} · ${event.venue} · ${event.city}`,
    tag: event.categoryLabel,
  }));
  const faqs = [
    {
      q: `How do I book an event from ${page.h1}?`,
      a: "Open an event above, check its date, venue, ticket options, and organizer policies, then complete the existing UrPass registration and payment steps if required.",
    },
    {
      q: "Are the tickets and dates on this page current?",
      a: "This page shows approved upcoming Explore listings. Event details and availability can change, so confirm them on the event page before booking.",
    },
  ];

  // Structured Data Schemas for SEO & GEO Answer Engines
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://urpass.space",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Explore",
        item: "https://urpass.space/explore",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.h1,
        item: `https://urpass.space/explore/${page.slug}`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1,
    description: summary,
    itemListElement: matchingEvents.map((evt, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: evt.name,
      url: `https://urpass.space/explore/event/${encodeURIComponent(evt.slug)}`,
    })),
  };

  // Resolve related page configs
  const relatedPages = page.relatedSlugs
    .map((s) => getExploreSeoPage(s))
    .filter((p): p is ExploreSeoPageConfig => Boolean(p));

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 selection:bg-violet-600 selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      {matchingEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }}
        />
      )}

      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
            <span className="text-neutral-300 hidden sm:inline">|</span>
            <Link
              href="/"
              className="font-extrabold tracking-tight text-base sm:text-lg text-neutral-950 hidden sm:flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-violet-600" />
              <span>URPASS</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/explore"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>All Cities & Categories</span>
            </Link>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-3.5 py-1.5 rounded-lg transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>Post Your Event</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Breadcrumbs ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <Link href="/explore" className="hover:text-neutral-900 transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="font-semibold text-neutral-900 truncate">
            {page.h1}
          </span>
        </nav>
      </div>

      {/* ── Hero Section with GEO Direct Answer ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-violet-500/10 via-purple-500/5 to-transparent pointer-events-none rounded-tr-3xl" />

          <div className="relative z-10 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-800 border border-violet-200/70 mb-4 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-violet-600" />
              <span>{page.badgeText}</span>
              <span className="text-violet-400">·</span>
              <span className="text-[11px] font-medium text-violet-600 uppercase tracking-wide">
                Approved Listings
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 leading-[1.15]">
              {page.h1}
            </h1>

            {/* Content Synopsis */}
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl">
              {summary}
            </p>

            {/* GEO Direct Answer Box (For AI Search Engines & Attendees) */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>Quick Summary</span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    From Current Listings
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                  {totalMatches > 0
                    ? `There ${totalMatches === 1 ? "is" : "are"} ${totalMatches} approved upcoming ${totalMatches === 1 ? "event" : "events"} matching this collection. Select an event for its organizer-provided details and booking options.`
                    : "No approved upcoming events match this collection right now. Browse the wider Explore marketplace for other events."}
                </p>
              </div>
            </div>

            {/* Quick Navigation Filter Pills */}
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide mr-1">
                Jump to:
              </span>
              <a
                href="#live-events"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
              >
                Upcoming Events ({totalMatches})
              </a>
              <a
                href="#highlights"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
              >
                Event Details
              </a>
              <a
                href="#faqs"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
              >
                Booking Help
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Event Listings Section ─────────────────────────────────── */}
      <section id="live-events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Upcoming Experiences
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-200/80 text-neutral-800">
                {totalMatches} {totalMatches === 1 ? "Event" : "Events"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Review each organizer&apos;s event page for current ticket options, policies, and availability.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/explore"
              className="text-xs font-semibold text-violet-700 hover:text-violet-900 inline-flex items-center gap-1"
            >
              <span>Explore All Cities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Event Grid */}
        {matchingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingEvents.map((evt, idx) => (
              <EventCard key={evt.id} event={evt} index={idx} />
            ))}
          </div>
        ) : (
          /* Transparent Empty State with Alternative Guidance */
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950">
              No scheduled events matching this exact search right now
            </h3>
            <p className="mt-2 text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              This collection currently has no approved upcoming matches. Browse the wider Explore marketplace for other events.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Browse All Live Events
              </Link>
              <Link
                href="/create-event"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors"
              >
                Host an Event on UrPass
              </Link>
            </div>

            {/* Trending Live Experiences Across India */}
            {fallbackEvents.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-violet-600" />
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    More Upcoming Events on Explore
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fallbackEvents.map((evt, idx) => (
                    <EventCard key={evt.id} event={evt} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Local Highlights / What's Included ─────────────────────────── */}
      <section id="highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
              Current Listings
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mt-1">
              Event Details from Approved Listings
            </h2>
          </div>

          {highlights.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/70 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-neutral-950">
                    {h.title}
                  </h3>
                  {h.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600">
                      {h.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div> : <p className="text-sm text-neutral-600">Details will appear when an approved upcoming event matches this collection.</p>}
        </div>
      </section>

      {/* ── GEO AI-Optimized FAQ Section ──────────────────────────────── */}
      <section id="faqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mt-1">
              Answers & Booking Information
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Review the organizer&apos;s event page before making a booking.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer open:bg-white open:shadow-xs transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 group-open:text-violet-700">
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform shrink-0">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pl-6 border-t border-neutral-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contextual Internal Linking Grid ───────────────────────────── */}
      {relatedPages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-100/80 border border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
              Explore More Experiences
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {relatedPages.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/explore/${rp.slug}`}
                  className="p-3 rounded-xl bg-white border border-neutral-200/80 hover:border-violet-300 hover:shadow-xs transition-all group flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                    {rp.h1.replace("Discover Events in ", "").replace("Discover Upcoming ", "")}
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-2 font-medium flex items-center gap-1">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Organizer Bottom Callout ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              For Event Organizers
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
              Hosting an event in India?
            </h3>
            <p className="text-xs sm:text-sm text-violet-100 mt-1 leading-relaxed">
              Apply to list an eligible public event on UrPass Explore. Approved listings link to the existing UrPass registration and QR pass flow.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/create-event"
              className="px-5 py-3 rounded-xl bg-white text-violet-950 font-bold text-xs hover:bg-violet-50 transition-colors shadow-md active:scale-95"
            >
              Post on UrPass Explore
            </Link>
          </div>
        </div>
      </section>

      {/* ── Simple Explore Footer ─────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">URPASS Explore</span>
            <span>·</span>
            <span>By YESP Corporation</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="hover:text-neutral-900 transition-colors">
              Directory
            </Link>
            <Link href="/pricing" className="hover:text-neutral-900 transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
