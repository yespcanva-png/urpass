import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "@/components/landing/SocialIcons";

export const metadata: Metadata = {
  title: "Sitelinks & Directory",
  description: "Complete directory of all pages on URPASS — custom pass designer, QR check-in, real-time analytics, college fests, city hubs, comparisons, and official channels.",
  alternates: { canonical: "https://urpass.space/sitelinks" },
  openGraph: {
    title: "Sitelinks & Directory — URPASS",
    description: "Explore all pages on URPASS by category — product features, use case solutions, city hubs, educational guides, and comparisons.",
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
  badge?: string;
  links: { label: string; href: string; isExternal?: boolean; badge?: string }[];
}[] = [
  {
    title: "Platform & Company",
    badge: "Core",
    links: [
      { label: "Home", href: "/" },
      { label: "About URPASS & Yesp", href: "/about", badge: "New" },
      { label: "Platform FAQ & Answers", href: "/faq", badge: "35+ FAQs" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Guides & Tutorials Hub", href: "/guides" },
      { label: "Software Comparisons Hub", href: "/compare" },
      { label: "Documentation & API", href: "/docs" },
      { label: "Contact Support", href: "/contact" },
      { label: "Feedback & Requests", href: "/feedback" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sign Up Free", href: "/signup", badge: "Free" },
      { label: "Organizer Login", href: "/login" },
    ],
  },
  {
    title: "1. Product & Feature Cluster",
    badge: "Product",
    links: [
      { label: "Custom Pass Designer", href: "/custom-pass-design", badge: "Popular" },
      { label: "Mobile QR Code Scanner", href: "/qr-code-scanner", badge: "Fast" },
      { label: "Real-Time Event Analytics", href: "/event-analytics", badge: "Live" },
      { label: "Event Registration Software", href: "/event-registration-software" },
      { label: "QR Event Check-In", href: "/qr-event-check-in" },
      { label: "Digital Event Pass Maker", href: "/digital-event-pass" },
      { label: "Event Management Software", href: "/event-management-software" },
      { label: "Event Check-In Software", href: "/event-check-in-software" },
      { label: "Event Registration Platform", href: "/event-registration-platform" },
      { label: "Online Registration System", href: "/online-event-registration-system" },
      { label: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", badge: "New" },
      { label: "Event Pass Management", href: "/event-pass-management-system" },
      { label: "Event Badge Generator", href: "/event-badge-generator" },
      { label: "Event Ticket Generator", href: "/event-ticket-generator" },
      { label: "Event Registration Form", href: "/event-registration-form" },
      { label: "Event RSVP Software", href: "/event-rsvp-software" },
      { label: "Event Guest List Software", href: "/event-guest-list-software" },
      { label: "Event Entry System", href: "/event-entry-system" },
      { label: "Event Check-In App (Browser)", href: "/event-check-in-app" },
      { label: "QR Code Attendance System", href: "/qr-code-attendance-system" },
      { label: "Event Attendance Tracking", href: "/event-attendance-tracking" },
      { label: "Attendee Management", href: "/attendee-management" },
      { label: "QR Event Tickets", href: "/qr-event-tickets" },
      { label: "Free Event Registration", href: "/free-event-registration" },
      { label: "Design Your Ticket", href: "/design-your-ticket" },
    ],
  },
  {
    title: "2. Use Cases & Solutions",
    badge: "Use Case",
    links: [
      { label: "College Events", href: "/college-events" },
      { label: "College Fests & Culturals", href: "/college-fests", badge: "Top" },
      { label: "Hackathons & Buildathons", href: "/hackathons", badge: "Top" },
      { label: "Technical Symposium", href: "/technical-symposium", badge: "New" },
      { label: "Cultural Fest Management", href: "/cultural-fest", badge: "New" },
      { label: "Campus & Orientation Events", href: "/campus-events" },
      { label: "University Events", href: "/university-events", badge: "New" },
      { label: "School Events & Annual Days", href: "/school-events", badge: "New" },
      { label: "Tech Conferences & Summits", href: "/conferences" },
      { label: "Business Conferences", href: "/business-conferences", badge: "New" },
      { label: "Developer Meetups", href: "/developer-meetups", badge: "New" },
      { label: "Workshops & Masterclasses", href: "/workshops" },
      { label: "Academic Seminars", href: "/seminars" },
      { label: "Corporate Events & Townhalls", href: "/corporate-events" },
      { label: "Startup Pitches & Demo Days", href: "/startup-events", badge: "New" },
      { label: "Networking Mixers", href: "/networking-events", badge: "New" },
      { label: "Trade Shows & Expos", href: "/trade-shows", badge: "New" },
      { label: "Exhibitions & Galleries", href: "/exhibitions", badge: "New" },
      { label: "Sports Events & Tournaments", href: "/sports-events", badge: "New" },
      { label: "Award Ceremonies & Galas", href: "/award-ceremonies", badge: "New" },
      { label: "Alumni Meets & Reunions", href: "/alumni-events", badge: "New" },
      { label: "Training & Certification", href: "/training-events", badge: "New" },
      { label: "Community Meetups", href: "/community-events" },
    ],
  },
  {
    title: "3. Locations in India",
    badge: "Location",
    links: [
      { label: "Events Software India (Hub)", href: "/in", badge: "Hub" },
      { label: "Bangalore Event Software", href: "/event-registration-software-bangalore", badge: "Tech" },
      { label: "Bangalore City Guide", href: "/in/bangalore" },
      { label: "Chennai Event Software", href: "/event-registration-software-chennai", badge: "Colleges" },
      { label: "Chennai City Guide", href: "/in/chennai" },
      { label: "Hyderabad Event Software", href: "/event-registration-software-hyderabad", badge: "HITEC" },
      { label: "Hyderabad City Guide", href: "/in/hyderabad" },
      { label: "Mumbai Event Software", href: "/event-registration-software-mumbai", badge: "Expos" },
      { label: "Mumbai City Guide", href: "/in/mumbai" },
      { label: "Delhi NCR Event Software", href: "/event-registration-software-delhi", badge: "Summits" },
      { label: "Delhi NCR City Guide", href: "/in/delhi" },
      { label: "Pune Event Software", href: "/event-registration-software-pune", badge: "IT" },
      { label: "Pune City Guide", href: "/in/pune" },
      { label: "Coimbatore Event Software", href: "/event-registration-software-coimbatore", badge: "Institutions" },
      { label: "Coimbatore City Guide", href: "/in/coimbatore" },
      { label: "Kochi Event Software", href: "/event-registration-software-kochi", badge: "Startups" },
      { label: "Kochi City Guide", href: "/in/kochi" },
      { label: "Kolkata City Guide", href: "/in/kolkata" },
      { label: "Ahmedabad City Guide", href: "/in/ahmedabad" },
    ],
  },
  {
    title: "4. Educational Guides & Knowledge",
    badge: "Guides & GEO",
    links: [
      { label: "All Guides & Knowledge Hub", href: "/guides", badge: "Hub" },
      { label: "How QR Check-In Works", href: "/guides/how-does-qr-event-check-in-work" },
      { label: "How to Check In 1,000+ Attendees Fast", href: "/guides/how-to-check-in-1000-attendees-quickly", badge: "Speed" },
      { label: "Manage Multiple Event Entrances", href: "/guides/how-to-manage-multiple-event-entrances" },
      { label: "Generate QR Codes for Attendees", href: "/guides/how-to-create-qr-codes-for-event-attendees" },
      { label: "Create Digital Event Passes", href: "/guides/how-to-create-digital-event-passes" },
      { label: "Track Attendance in Real Time", href: "/guides/how-to-track-event-attendance-in-real-time" },
      { label: "College Event Registration Guide", href: "/guides/how-to-manage-college-event-registrations" },
      { label: "College Fest Form Best Practices", href: "/guides/how-to-create-college-fest-registration-form" },
      { label: "How to Send QR Tickets via Email", href: "/guides/how-to-send-qr-tickets-to-attendees" },
      { label: "What Fields to Collect in Forms", href: "/guides/what-information-should-event-registration-form-collect" },
      { label: "QR Tickets vs Paper Tickets", href: "/guides/qr-ticket-vs-paper-ticket" },
      { label: "Event Registration vs Google Forms", href: "/guides/event-registration-software-vs-google-forms" },
      { label: "Can Google Forms Generate QR Passes?", href: "/guides/can-google-forms-generate-event-qr-passes" },
      { label: "Run Registration Without Eventbrite", href: "/guides/how-to-run-event-registration-without-eventbrite" },
      { label: "Create Free Event Tickets Online", href: "/guides/how-to-create-free-event-tickets-online" },
      { label: "Organize Registration for Hackathons", href: "/guides/how-to-organize-registration-for-a-hackathon" },
      { label: "Manage Conference Attendees", href: "/guides/how-to-manage-conference-attendees" },
      { label: "Best Way to Check Attendees In", href: "/guides/best-way-to-check-attendees-into-an-event" },
      { label: "Prevent Duplicate Entry Guide", href: "/guides/prevent-duplicate-event-entry" },
      { label: "Event Check-In Without an App", href: "/guides/event-check-in-without-app" },
    ],
  },
  {
    title: "5. Comparisons & Alternatives",
    badge: "Comparisons",
    links: [
      { label: "Compare All Platforms", href: "/compare", badge: "Overview" },
      { label: "Eventbrite Alternative India", href: "/compare/eventbrite-alternative-india", badge: "Zero Fee" },
      { label: "Zoho Backstage Alternative India", href: "/compare/zoho-backstage-alternative-india" },
      { label: "Google Forms vs URPASS", href: "/compare/google-forms-vs-urpass", badge: "QR Entry" },
      { label: "Google Forms Registration Alternative", href: "/compare/google-forms-event-registration-alternative" },
      { label: "Townscript Alternative", href: "/compare/townscript-alternative" },
      { label: "AllEvents Alternative", href: "/compare/allevents-alternative" },
      { label: "Eventbrite Alternative (Global)", href: "/compare/eventbrite-alternative" },
      { label: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative" },
    ],
  },
  {
    title: "6. AI & Model Context Protocol (MCP)",
    badge: "AI Agents",
    links: [
      { label: "MCP Event Management Platform", href: "/mcp-event-management", badge: "MCP" },
      { label: "MCP Server for Events", href: "/mcp-server-for-events", badge: "Core" },
      { label: "AI Agent Event Registration", href: "/ai-agent-event-registration" },
      { label: "AI-Powered Event Check-In", href: "/ai-event-check-in", badge: "Speed" },
      { label: "Claude Desktop Event Ops", href: "/claude-desktop-event-management", badge: "Claude" },
      { label: "Cursor MCP Event Ticketing", href: "/cursor-mcp-event-ticketing", badge: "Cursor" },
      { label: "MCP QR Code Pass Scanner", href: "/mcp-qr-code-scanner" },
      { label: "AI Attendee Management", href: "/ai-attendee-management" },
      { label: "AI Event Analytics & Velocity", href: "/ai-event-analytics", badge: "Live" },
      { label: "MCP Hackathon Management", href: "/mcp-hackathon-management", badge: "Dev" },
      { label: "AI Conference Management", href: "/ai-conference-management" },
      { label: "Autonomous Event Check-In", href: "/autonomous-event-check-in", badge: "Kiosk" },
      { label: "MCP Event API & JSON-RPC", href: "/mcp-event-api", badge: "API" },
      { label: "AI Event Ticketing Bot", href: "/ai-event-ticketing-bot" },
      { label: "MCP Event Ops Bangalore", href: "/mcp-event-management-bangalore", badge: "BLR" },
      { label: "MCP Event Ops Hyderabad", href: "/mcp-event-management-hyderabad", badge: "HYD" },
      { label: "MCP Event Ops Chennai", href: "/mcp-event-management-chennai", badge: "MAA" },
      { label: "MCP Event Ops Pune", href: "/mcp-event-management-pune", badge: "PNQ" },
      { label: "MCP Event Ops Delhi NCR", href: "/mcp-event-management-delhi", badge: "DEL" },
      { label: "MCP Event Ops Mumbai", href: "/mcp-event-management-mumbai", badge: "BOM" },
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
          URPASS Architecture &amp; Directory
        </h1>
        <p className="text-sm text-neutral-500 mb-10 max-w-2xl leading-relaxed">
          Explore URPASS across our five foundational clusters: core platform features, specialized event use cases, Indian tech hubs, in-depth educational guides, and objective software comparisons.
        </p>

        {/* Official Channels Banner Card */}
        <div className="mb-10 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-neutral-900 text-base">Official Channels &amp; Community</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-50 text-brand px-2 py-0.5 rounded-full">
                Community
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Follow our latest product updates, video walk-throughs, feature releases, and event management tips.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
                  <p className="text-xs font-bold tracking-widest uppercase text-neutral-900">
                    {section.title}
                  </p>
                  {section.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
                      {section.badge}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.href} className="flex items-center justify-between group py-0.5">
                      {link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-600 hover:text-brand transition-colors font-medium"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs text-neutral-600 hover:text-brand transition-colors font-medium"
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 group-hover:bg-brand-50 group-hover:text-brand transition-colors ml-2 shrink-0">
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
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors shadow-sm"
          >
            Create your first event free →
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
