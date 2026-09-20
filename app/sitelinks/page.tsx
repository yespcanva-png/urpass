import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "@/components/landing/SocialIcons";

export const metadata: Metadata = {
  title: "Sitelinks & Directory — URPASS",
  description: "Complete directory of all pages on URPASS — custom pass designer, QR check-in, real-time analytics, college fests, city hubs, and official channels.",
  alternates: { canonical: "https://urpass.space/sitelinks" },
  openGraph: {
    title: "Sitelinks & Directory — URPASS",
    description: "Explore all pages on URPASS by category — features, solutions, cities, and guides.",
    url: "https://urpass.space/sitelinks",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

const sections: {
  title: string;
  links: { label: string; href: string; isExternal?: boolean; badge?: string }[];
}[] = [
  {
    title: "Main Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Documentation & API", href: "/docs" },
      { label: "Contact Support", href: "/contact" },
      { label: "Feedback & Requests", href: "/feedback" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sign Up Free", href: "/signup", badge: "Free" },
      { label: "Organizer Login", href: "/login" },
    ],
  },
  {
    title: "Core Features",
    links: [
      { label: "Design Your Ticket", href: "/design-your-ticket", badge: "Featured" },
      { label: "Custom Pass Designer", href: "/custom-pass-design", badge: "New" },
      { label: "Mobile QR Code Scanner", href: "/qr-code-scanner", badge: "Fast" },
      { label: "Real-Time Event Analytics", href: "/event-analytics", badge: "Live" },
      { label: "Event Registration Software", href: "/event-registration-software" },
      { label: "QR Event Check-In", href: "/qr-event-check-in" },
      { label: "Digital Event Pass Maker", href: "/digital-event-pass" },
      { label: "Event Attendance Tracking", href: "/event-attendance-tracking" },
      { label: "Attendee Management", href: "/attendee-management" },
      { label: "Event QR Code Generator", href: "/event-qr-code-generator" },
      { label: "QR Ticketing System", href: "/qr-ticketing-system" },
      { label: "Event Access Control", href: "/event-access-control" },
      { label: "Free Event Registration", href: "/free-event-registration" },
      { label: "Event Ticketing Platform", href: "/event-ticketing-platform" },
      { label: "Event Ticketing Software", href: "/event-ticketing-software" },
      { label: "Online Event Ticketing", href: "/online-event-ticketing" },
      { label: "QR Event Tickets", href: "/qr-event-tickets" },
    ],
  },
  {
    title: "Event Solutions",
    links: [
      { label: "College Events", href: "/college-events" },
      { label: "College Fests & Culturals", href: "/college-fests" },
      { label: "Hackathons & Buildathons", href: "/hackathons" },
      { label: "Workshops & Masterclasses", href: "/workshops" },
      { label: "Tech Conferences", href: "/conferences" },
      { label: "Academic Seminars", href: "/seminars" },
      { label: "Corporate Summits", href: "/corporate-events" },
      { label: "Tech Community Events", href: "/tech-events" },
      { label: "Community Meetups", href: "/community-events" },
      { label: "Campus Events", href: "/campus-events" },
    ],
  },
  {
    title: "Locations in India",
    links: [
      { label: "Events in India (Hub)", href: "/in" },
      { label: "Bangalore (Tech & Startups)", href: "/in/bangalore" },
      { label: "Chennai (Colleges & Tech)", href: "/in/chennai" },
      { label: "Coimbatore (Academic Hub)", href: "/in/coimbatore" },
      { label: "Hyderabad (HITEC City)", href: "/in/hyderabad" },
      { label: "Mumbai (Corporate & Expos)", href: "/in/mumbai" },
      { label: "Delhi NCR (Summits & Meets)", href: "/in/delhi" },
      { label: "Pune (IT & Universities)", href: "/in/pune" },
      { label: "Kochi & Kerala (Startups & Fests)", href: "/in/kochi", badge: "New" },
      { label: "Kolkata (Culture & Tech)", href: "/in/kolkata", badge: "New" },
      { label: "Ahmedabad (Business & Summits)", href: "/in/ahmedabad", badge: "New" },
    ],
  },
  {
    title: "Knowledge & Guides",
    links: [
      { label: "What is QR Event Check-In?", href: "/guides/what-is-qr-event-check-in" },
      { label: "How to Create a QR Event Pass", href: "/guides/how-to-create-qr-event-pass" },
      { label: "Prevent Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry" },
      { label: "College Event Registration System", href: "/guides/college-event-registration-system" },
      { label: "Event Check-In Without an App", href: "/guides/event-check-in-without-app" },
    ],
  },
  {
    title: "Comparisons",
    links: [
      { label: "Eventbrite Alternative", href: "/compare/eventbrite-alternative" },
      { label: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative" },
    ],
  },
];

export default function SitelinksPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-5 py-12 w-full">

        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Social Icons Header Badge */}
          <div className="flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 transition-colors text-xs font-semibold"
              aria-label="URPASS on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@urpass.space</span>
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-xs font-semibold"
              aria-label="URPASS on YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
          </div>
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
          Directory &amp; Sitelinks
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
          URPASS Sitelinks
        </h1>
        <p className="text-sm text-neutral-500 mb-10 max-w-xl">
          Complete index of all public landing pages, features, city hubs, and guides on URPASS.
        </p>

        {/* Official Channels Banner Card */}
        <div className="mb-10 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-neutral-900 text-base">Official Social Channels</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-50 text-brand px-2 py-0.5 rounded-full">
                Community
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Follow our latest product updates, video walk-throughs, feature releases, and event tips.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>YouTube Channel</span>
            </a>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs hover:border-neutral-200 transition-all flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4 pb-2 border-b border-neutral-100">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.href} className="flex items-center justify-between group">
                      {link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-700 hover:text-brand transition-colors font-medium"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs text-neutral-700 hover:text-brand transition-colors font-medium"
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                          {link.badge}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 mb-6 text-center">
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors"
          >
            Create your first event free →
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
