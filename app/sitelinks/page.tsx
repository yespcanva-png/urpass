import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitelinks — URPASS",
  description: "All pages on URPASS — event registration, QR check-in, digital passes, and more.",
  alternates: { canonical: "https://urpass.space/sitelinks" },
};

const sections = [
  {
    title: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Docs", href: "/docs" },
      { label: "Contact", href: "/contact" },
      { label: "Feedback", href: "/feedback" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Event Registration Software", href: "/event-registration-software" },
      { label: "QR Event Check-In", href: "/qr-event-check-in" },
      { label: "Digital Event Pass", href: "/digital-event-pass" },
      { label: "Event Attendance Tracking", href: "/event-attendance-tracking" },
      { label: "Attendee Management", href: "/attendee-management" },
      { label: "QR Event Registration", href: "/qr-event-registration" },
      { label: "Event Entry Management", href: "/event-entry-management" },
      { label: "Event QR Code Generator", href: "/event-qr-code-generator" },
      { label: "QR Ticketing System", href: "/qr-ticketing-system" },
      { label: "Event Guest Management", href: "/event-guest-management" },
      { label: "Event Access Control", href: "/event-access-control" },
      { label: "Free Event Registration", href: "/free-event-registration" },
      { label: "Event Ticketing Platform", href: "/event-ticketing-platform" },
      { label: "Event Ticketing Software", href: "/event-ticketing-software" },
      { label: "Online Event Ticketing", href: "/online-event-ticketing" },
      { label: "QR Event Tickets", href: "/qr-event-tickets" },
      { label: "Event Ticket Booking System", href: "/event-ticket-booking-system" },
      { label: "Free Event Ticketing", href: "/free-event-ticketing" },
    ],
  },
  {
    title: "Event Types",
    links: [
      { label: "College Events", href: "/college-events" },
      { label: "College Fests", href: "/college-fests" },
      { label: "Hackathons", href: "/hackathons" },
      { label: "Workshops", href: "/workshops" },
      { label: "Conferences", href: "/conferences" },
      { label: "Seminars", href: "/seminars" },
      { label: "Corporate Events", href: "/corporate-events" },
      { label: "Tech Events", href: "/tech-events" },
      { label: "Community Events", href: "/community-events" },
      { label: "Campus Events", href: "/campus-events" },
    ],
  },
  {
    title: "By Location",
    links: [
      { label: "Events in India", href: "/in" },
      { label: "Chennai", href: "/in/chennai" },
      { label: "Bangalore", href: "/in/bangalore" },
      { label: "Hyderabad", href: "/in/hyderabad" },
      { label: "Mumbai", href: "/in/mumbai" },
      { label: "Delhi", href: "/in/delhi" },
      { label: "Pune", href: "/in/pune" },
      { label: "Coimbatore", href: "/in/coimbatore" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "What is QR Event Check-In?", href: "/guides/what-is-qr-event-check-in" },
      { label: "How to Create a QR Event Pass", href: "/guides/how-to-create-qr-event-pass" },
      { label: "Prevent Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry" },
      { label: "College Event Registration System", href: "/guides/college-event-registration-system" },
      { label: "Event Check-In Without an App", href: "/guides/event-check-in-without-app" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "Eventbrite Alternative", href: "/compare/eventbrite-alternative" },
      { label: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative" },
    ],
  },
];

export default function SitelinksPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-5 py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-900 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
          Navigation
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Sitelinks
        </h1>
        <p className="text-sm text-neutral-500 mb-12">
          Every page on URPASS, organized by category.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white border border-neutral-100 rounded-2xl p-6"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-700 hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors"
          >
            Create your event →
          </Link>
        </div>

      </div>
    </div>
  );
}
