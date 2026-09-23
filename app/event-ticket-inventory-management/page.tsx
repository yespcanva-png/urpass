import type { Metadata } from "next";
import { Layers, ShieldAlert, BarChart3, Clock, CheckCircle2, Ticket, Lock, ArrowRight, RefreshCw } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Inventory Management Software | URPASS",
  description: "Manage event ticket inventory in real time. Prevent overselling, configure multi-tier quotas, handle seat reservation holds, and automate sold-out alerts.",
  keywords: [
    "event ticket inventory management",
    "ticket inventory management software",
    "event capacity and ticket inventory",
    "manage ticket tiers",
    "real time ticket inventory",
    "prevent ticket overselling",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-inventory-management" },
  openGraph: {
    title: "Event Ticket Inventory Management Software | URPASS",
    description: "Manage event ticket inventory in real time. Prevent overselling and automate tier quotas.",
    url: "https://urpass.space/event-ticket-inventory-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INVENTORY CONTROL",
        h1: "Manage Event Ticket Inventory in Real Time",
        canonicalUrl: "https://urpass.space/event-ticket-inventory-management",
        description:
          "Event ticket inventory management controls seat quotas, ticket tier allocations, real-time availability, and reserved inventory holds across all ticket types. URPASS prevents overselling with atomic inventory locks during checkout, automatically closing sold-out categories and routing excess demand to waitlists.",
        ctaLabel: "Manage Ticket Inventory",
        features: [
          { icon: Layers, title: "Multi-Tier Quota Allocation", desc: "Define precise inventory caps for Early Bird, General Admission, VIP, Student, and Sponsor ticket categories." },
          { icon: Lock, title: "Atomic Checkout Reservation", desc: "Temporarily locks ticket inventory during active checkout sessions, eliminating double-bookings during traffic spikes." },
          { icon: Clock, title: "Time-Triggered Ticket Releases", desc: "Schedule ticket tiers to launch or expire automatically based on date, time, or preceding tier exhaustion." },
          { icon: ShieldAlert, title: "Oversell Protection", desc: "Strict database-level constraints ensure your total sold passes never exceed your physical venue capacity." },
          { icon: RefreshCw, title: "Automated Waitlist Overflow", desc: "When a category sells out, the registration form instantly transitions to waitlist collection mode." },
          { icon: BarChart3, title: "Live Inventory Dashboard", desc: "Monitor remaining tickets, sales velocity, and inventory breakdown by category across all gates in real time." },
        ],
        steps: [
          { n: "01", title: "Set Overall Capacity", desc: "Specify total physical venue or room capacity to set your hard safety ceiling." },
          { n: "02", title: "Segment Ticket Tiers", desc: "Create ticket types (e.g. Early Bird: 200, Regular: 500, VIP: 50) with custom prices and limits." },
          { n: "03", title: "Real-Time Atomic Locks", desc: "When an attendee enters checkout, URPASS holds the inventory slot for 10 minutes." },
          { n: "04", title: "Auto-Close Sold Out Tiers", desc: "Categories that hit capacity automatically close and display a 'Sold Out' status in real time." },
          { n: "05", title: "Release Unused Slots", desc: "Cancelled registrations or unapproved applications release inventory back into the pool instantly." },
        ],
        callout: {
          badge: "SOLVE CAPACITY HEADACHES",
          title: "Never tell an attendee at the door that their ticket was oversold.",
          description: "Manual registration spreadsheets and disjointed ticketing plugins frequently experience concurrency errors during ticket drop spikes. URPASS uses atomic database locks so two attendees can never purchase the final remaining ticket at the same second.",
          bullets: [
            "Atomic transaction locks eliminate race conditions during high-demand ticket drops",
            "Automatic tier progression: Early Bird automatically switches to Phase 2 upon sellout",
            "Real-time countdown indicators motivate attendees to complete checkout quickly",
            "Exportable inventory audit trails for sponsors, venue managers, and fire marshals",
          ],
        },
        deepDiveSections: [
          {
            badge: "CONCURRENCY CONTROL",
            title: "How does real-time ticket inventory management prevent overselling?",
            paragraphs: [
              "When an event launches a flash sale, hundreds of attendees may attempt to purchase tickets within the exact same second. In systems that use delayed database updates or Google Forms, multiple users successfully submit orders for the same remaining seat, leading to awkward cancellations and venue over-crowding.",
              "URPASS utilizes transactional database row locks. When an attendee selects a ticket, the system temporarily claims that ticket slot with an expiration timer. If the user completes payment within the window, the ticket is marked sold. If they abandon checkout, the slot is immediately returned to available inventory.",
            ],
            takeaway: "Transactional inventory holds prevent ticket overselling without requiring manual intervention from the event organizer.",
          },
          {
            badge: "TIER STRATEGY",
            title: "How can organizers structure tiered ticket inventory for maximum revenue?",
            paragraphs: [
              "Smart organizers release tickets in structured phases: an initial Early Bird allocation at a discount to build early buzz, followed by Regular Admission, and finally a Last-Minute or VIP tier. URPASS allows organizers to schedule automatic phase transitions: as soon as Phase 1 reaches 100% capacity, Phase 2 activates automatically.",
              "You can also hide or reveal specific tiers based on access codes, allowing you to manage private corporate allotments or speaker guest passes without exposing them to the general public.",
            ],
            takeaway: "Automated tier triggers maximize revenue and momentum while keeping ticket inventory strictly under control.",
          },
        ],
        faqs: [
          {
            q: "What happens if someone abandons checkout after reserving a ticket?",
            a: "If the attendee closes the window or fails to complete payment within 10 minutes, the reserved inventory lock releases automatically back to the public pool.",
          },
          {
            q: "Can I manually adjust ticket quotas while registrations are open?",
            a: "Yes. Organizers can increase or decrease category quotas at any time directly from the event dashboard without interrupting live registrations.",
          },
          {
            q: "Can I set an aggregate capacity limit across all ticket categories?",
            a: "Yes. You can configure a master venue limit so that the sum of all individual tiers cannot exceed your venue's maximum fire code capacity.",
          },
        ],
        relatedLinks: [
          { title: "Event Capacity Management", href: "/event-capacity-management", category: "Product" },
          { title: "Event Waitlist Management", href: "/event-waitlist-management", category: "Product" },
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
          { title: "Event Registration with Payment", href: "/event-registration-with-payment", category: "Product" },
        ],
      }}
    />
  );
}
