import type { Metadata } from "next";
import { Handshake, Calendar, Clock, MapPin, Users, Bookmark, CheckCircle2, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "B2B Event Matchmaking Software & 1-on-1 Meeting Scheduler | URPASS",
  description:
    "Empower conference delegates, buyers, and exhibitors to schedule structured 1-on-1 B2B meetings. Manage time slots, booth locations, and personalized meeting agendas.",
  keywords: [
    "b2b event matchmaking software",
    "1-on-1 meeting scheduler for events",
    "buyer seller meet software",
    "trade show networking software",
    "conference meeting booking platform",
    "speed networking event software",
    "business matchmaking tool",
    "b2b networking platform",
  ],
  alternates: { canonical: "https://urpass.space/b2b-event-matchmaking-software" },
  openGraph: {
    title: "B2B Event Matchmaking Software & 1-on-1 Meeting Scheduler | URPASS",
    description:
      "Drive real commercial outcomes with curated 1-on-1 meeting matchmaking. Automated time slot allocation, booth table assignments, and personalized delegate agendas.",
    url: "https://urpass.space/b2b-event-matchmaking-software",
    siteName: "URPASS by Yesp Corporation",
    type: "website",
  },
};

export default function B2BEventMatchmakingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/b2b-event-matchmaking-software",
        badge: "B2B NETWORKING & 1-ON-1 SCHEDULING",
        h1: "B2B Event Matchmaking Software & 1-on-1 Meeting Scheduler",
        description:
          "Transform casual expo hall wandering into high-value commercial transactions. Enable delegates, buyers, and exhibitors to discover relevant peers, propose 1-on-1 meetings, and meet at designated booth locations or networking tables.",
        ctaLabel: "Launch B2B Matchmaking Free",
        directAnswer: {
          title: "How does B2B event matchmaking work with URPASS?",
          summary:
            "URPASS empowers conference delegates, corporate buyers, and exhibitors to initiate and confirm structured 1-on-1 business meetings. Participants browse verified attendee and exhibitor directories filtered by industry, company, and product capabilities. They propose meeting requests with customized agendas across predefined event time slots. Once accepted, URPASS automatically reserves a meeting location—such as an exhibitor booth or numbered networking lounge table—and synchronizes the appointment directly into both participants' digital event calendars.",
          keyPoints: [
            "Curated directory search with industry, title, and product categorization filters",
            "Frictionless request-and-accept meeting workflow with custom notes and objectives",
            "Automatic location routing to assigned exhibitor booths or numbered networking lounge tables",
            "Intelligent conflict prevention blocking double-booking across session schedules and prior meetings",
            "Personalized mobile calendar views with real-time status updates (Pending, Confirmed, Completed)",
          ],
        },
        keyFactsTable: {
          title: "URPASS Integrated B2B Matchmaking vs Disconnected Meeting Booking Apps",
          subtitle: "Why summits and trade shows prefer unified registration and meeting scheduling.",
          headers: ["Capability", "URPASS Integrated Matchmaking", "External Disconnected Scheduling Apps"],
          rows: [
            { col1: "Delegate Login Experience", col2: "Single unified event pass; zero secondary logins or app downloads", col3: "Requires downloading separate third-party apps with distinct credentials" },
            { col1: "Booth & Table Routing", col2: "Directly routes meetings to exhibitor booths or assigned lounge tables", col3: "Leaves location coordination to messy manual chat messages" },
            { col1: "Session Schedule Integration", col2: "Blocks meetings during keynote speeches and registered breakout sessions", col3: "Schedules meetings on top of primary conference program tracks" },
            { col1: "Lead Retrieval Handshake", col2: "Completed meetings automatically save as verified qualified leads", col3: "Isolated data silos requiring tedious manual CSV re-entry" },
            { col1: "Cost & Licensing", col2: "Included in URPASS ecosystem with transparent free tier starting point", col3: "Hefty per-seat add-on fees ($2,000–$8,000 extra per event)" },
            { col1: "Privacy & Visibility Control", col2: "Delegates toggle meeting availability and specify accepted buyer profiles", col3: "Spammy public contact lists exposing attendees to unsolicited solicitations" },
          ],
        },
        features: [
          {
            icon: Handshake,
            title: "Smart Peer & Exhibitor Discovery",
            desc: "Attendees easily discover potential partners, suppliers, and prospective clients using powerful company, industry, and role filters.",
          },
          {
            icon: Calendar,
            title: "Curated 1-on-1 Meeting Scheduling",
            desc: "Send structured meeting proposals specifying conversation goals, desired duration, and mutually available program time slots.",
          },
          {
            icon: MapPin,
            title: "Automated Booth & Table Allocation",
            desc: "URPASS automatically assigns accepted meetings to the host's exhibitor booth number or dedicated networking lounge tables.",
          },
          {
            icon: Clock,
            title: "Time-Slot Conflict Prevention",
            desc: "Built-in scheduling intelligence prevents double-bookings with existing confirmed meetings or keynote agenda sessions.",
          },
          {
            icon: Bookmark,
            title: "Delegate Bookmarking & Saved Lists",
            desc: "Participants can star favorite exhibitors and bookmark key delegates to plan their daily summit networking in advance.",
          },
          {
            icon: Users,
            title: "Personalized Digital Agenda Sync",
            desc: "Confirmed meetings automatically sync into the delegate's personal mobile event schedule with reminder notifications.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Browse Directory & Shortlist Peers",
            desc: "Explore the attendee and exhibitor directory, filter by product domain or job title, and save contacts to your networking list.",
          },
          {
            n: "02",
            title: "Send 1-on-1 Meeting Request",
            desc: "Select an open time slot, add a brief note detailing your meeting objective, and submit the proposal with one click.",
          },
          {
            n: "03",
            title: "Meet at Designated Location",
            desc: "When confirmed, both delegates receive immediate updates and meet at the specified booth or networking lounge table.",
          },
        ],
        useCases: [
          "Buyer-Seller Trade Summits & Sourcing Expos",
          "Venture Capital & Investor-Startup Pitch Days",
          "Corporate Partner Ecosystem Assemblies",
          "Biopharma & Medical Partnering Congresses",
          "Tech Conference Executive VIP Lounges",
          "Higher Education Research & Industry Matchmaking",
        ],
        faqs: [
          {
            q: "Can delegates choose when they are available for meetings?",
            a: "Yes. Attendees and exhibitors can customize their availability settings, toggle off specific hours, and block out keynote speaking sessions to ensure they are only booked during preferred networking windows.",
          },
          {
            q: "How are meeting locations designated?",
            a: "When a meeting involves an exhibitor, the system automatically routes the meeting to that exhibitor's assigned booth number. For delegate-to-delegate meetings, organizers can configure numbered networking lounge tables for automatic routing.",
          },
          {
            q: "What prevents participants from receiving spam meeting requests?",
            a: "URPASS enforces request limits and requires proposers to specify meeting intent. Attendees can accept, decline, or suggest alternative time slots, keeping control in the hands of the recipient.",
          },
          {
            q: "Do attendees need to download a separate mobile app?",
            a: "No. URPASS B2B Matchmaking is built into the responsive web application and digital pass interface, allowing attendees to request and confirm meetings directly from mobile Safari, Chrome, or any desktop browser.",
          },
          {
            q: "Can organizers review meeting analytics?",
            a: "Yes. Organizers access a live dashboard displaying total meeting requests, confirmation rates, peak networking hours, and most-requested exhibiting organizations.",
          },
          {
            q: "Is B2B matchmaking included in the free plan?",
            a: "Yes. URPASS includes 1-on-1 meeting scheduling in its Free Forever tier (2 events/month, up to 50 attendees per event), allowing organizers of small roundtables and investor demo days to run matchmaking at zero cost.",
          },
        ],
        relatedLinks: [
          { title: "Exhibitor Management Software", href: "/exhibitor-management-software", category: "Product" },
          { title: "Event Lead Retrieval Software", href: "/event-lead-retrieval-software", category: "Product" },
          { title: "Event Sponsorship Management", href: "/event-sponsorship-management-software", category: "Product" },
          { title: "Conference Management Software", href: "/conference-management-software", category: "Product" },
          { title: "Event Agenda Builder", href: "/event-agenda-builder", category: "Product" },
        ],
        ctaTitle: "Ignite meaningful B2B connections at your event",
        ctaDescription: "Curated 1-on-1 scheduling · Automated booth routing · Zero app downloads",
      }}
    />
  );
}
