import type { Metadata } from "next";
import {
  Ticket,
  Users,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Sliders,
  BarChart3,
  QrCode,
  Zap,
  Lock,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Management Software — Inventory, Passes & Attendees | UrPass",
  description:
    "Manage event tickets, attendee records, quota allocations, and admission passes from one dashboard. Instant pass re-issuance, name reassignments, and real-time status tracking.",
  keywords: [
    "event ticket management software",
    "attendee management system",
    "ticket inventory management for events",
    "event ticket sales tracking",
    "manage event passes and tickets",
    "event ticket reissuance software",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/event-ticket-management",
  },
  openGraph: {
    title: "Event Ticket Management Software — Inventory, Passes & Attendees | UrPass",
    description:
      "Centralized ticket inventory and attendee management. Reassign passes, manage capacity across tiers, handle refunds, and monitor check-in statuses live.",
    url: "https://urpass.space/solutions/event-ticket-management",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Ticket Management Software | UrPass",
    description:
      "Full administrative control over ticket allocations, attendee rosters, and pass statuses.",
  },
};

export default function EventTicketManagementSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // TICKET MANAGEMENT",
        h1: "Event Ticket Management Software for Complete Administrative Control",
        canonicalUrl: "https://urpass.space/solutions/event-ticket-management",
        description:
          "Oversee ticket inventory, attendee rosters, pass reassignments, and admissions from a single powerful dashboard. Eliminate data silos and handle attendee requests in seconds.",
        ctaLabel: "Manage Tickets Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Features",
        secondaryCtaHref: "/features",

        // GEO Direct Answer
        directAnswer: {
          title: "What is Event Ticket Management Software?",
          summary:
            "Event ticket management software provides event directors with centralized administrative control over attendee lists, ticket categories, inventory quotas, and credential statuses. UrPass enables organizers to track sold vs. remaining capacity across multiple tiers, reassign tickets to new guest names, revoke lost credentials, resend QR passes via WhatsApp/email in one click, and monitor real-time check-in progress from a single secure console.",
          keyPoints: [
            "Real-time ticket inventory oversight across VIP, General, Early Bird, and Sponsor quotas",
            "1-click pass re-issuance and WhatsApp resend for attendees who lost original confirmation emails",
            "Frictionless attendee reassignment and name updates without requiring ticket cancellation",
            "Granular attendee filtering: filter by ticket tier, payment status, approval state, and gate check-in",
            "Instant pass revocation that invalidates compromised QR codes immediately at all entrance doors",
          ],
        },

        whatIs: {
          title: "The Problem with Fragmented Ticket Spreadsheets",
          definition:
            "When event organizers manage tickets across disconnected tools—such as separate ticketing portals, manual Excel spreadsheets, email client inboxes, and check-in apps—errors inevitably multiply. Attendee substitutions get lost, cancelled passes remain scannable, and VIP allocations become disordered.",
          details: [
            "Centralizes all attendee transactions, approvals, passes, and entrance logs into one source of truth",
            "Empowers your support team to answer attendee inquiries and resend passes in under 10 seconds",
            "Maintains airtight access control by synchronizing cancellations directly with entrance gate scanners",
          ],
        },

        keyFactsTable: {
          title: "UrPass Ticket Management vs. Traditional Spreadsheet Tracking",
          subtitle: "Comparison of administrative speed, data integrity, and attendee support.",
          headers: ["Management Task", "UrPass Ticket Management", "Manual Excel / Sheets Tracking", "Legacy Ticketing Portals"],
          rows: [
            {
              col1: "Pass Resend to Attendee",
              col2: "1 click via WhatsApp or Email (<5s)",
              col3: "Manual email drafting + attachment (3 mins)",
              col4: "Requires attendee to log into portal",
            },
            {
              col1: "Attendee Name Reassignment",
              col2: "Instant dashboard update (<10s)",
              col3: "Manual row editing (risk of formula errors)",
              col4: "Requires buyer support ticket",
            },
            {
              col1: "Gate Synchronization",
              col2: "Instant real-time sync with scanners",
              col3: "None (must re-print paper sheets)",
              col4: "Periodic manual app refresh",
            },
            {
              col1: "Comped / VIP Pass Allocation",
              col2: "Direct administrative generation with 0 fees",
              col3: "Manual tracking in separate columns",
              col4: "Often charged ticket service fees",
            },
            {
              col1: "Audit Logging",
              col2: "Complete timestamped history of edits & scans",
              col3: "None (version history only)",
              col4: "Limited transaction log",
            },
          ],
        },

        featuresTitle: "Enterprise Control Over Every Attendee and Ticket",
        featuresSubtitle: "Equipped with the administrative tools modern event coordinators rely on.",
        features: [
          {
            icon: Search,
            title: "Instant Attendee Lookup",
            desc: "Find any attendee in under a second using name, email, phone number, ticket ID, or corporate organization.",
          },
          {
            icon: RefreshCw,
            title: "1-Click WhatsApp & Email Resend",
            desc: "Attendee claims they never got their pass? Resend their personalized digital pass to WhatsApp or email with one click.",
          },
          {
            icon: Sliders,
            title: "Dynamic Quota Reallocation",
            desc: "Shift capacity between tiers on the fly (e.g. increase VIP allotment by 25 seats by decreasing General Admission allotment).",
          },
          {
            icon: Users,
            title: "Seamless Attendee Reassignment",
            desc: "A corporate delegate cannot attend? Update the pass to their colleague's name and details instantly without cancelling the payment.",
          },
          {
            icon: Lock,
            title: "Instant Pass Revocation",
            desc: "Cancel or revoke any ticket immediately. The moment a revoked pass hits an entrance scanner, it triggers an instant red rejection.",
          },
          {
            icon: BarChart3,
            title: "Multi-Tier Inventory Analytics",
            desc: "Track real-time sell-through percentages, revenue by category, and check-in rates across every individual ticket type.",
          },
        ],

        howItWorksTitle: "How to Manage Tickets Throughout Your Event Lifecycle",
        howItWorksSubtitle: "Four straightforward stages of ticket operations.",
        steps: [
          { n: "01", title: "Set Ticket Inventory", desc: "Configure ticket tiers, prices, and quantities from your organizer control panel." },
          { n: "02", title: "Monitor Incoming Sales", desc: "Watch registrations and payments appear in real time on your live attendee table." },
          { n: "03", title: "Handle Modifications", desc: "Process attendee name changes, ticket upgrades, comped passes, and pass resends with ease." },
          { n: "04", title: "Review Check-In State", desc: "Monitor door arrivals and export completed attendee manifests with millisecond timestamps." },
        ],

        deepDiveSections: [
          {
            badge: "SUPPORT EFFICIENCY",
            title: "Solving the 'I Can't Find My Ticket' Problem on Event Morning",
            paragraphs: [
              "On the morning of an event, the help desk is typically bombarded with frantic attendees who accidentally deleted their confirmation email or had it routed to their spam folder.",
              "With UrPass, solving this takes less than 10 seconds. The support volunteer types the attendee's name or phone number into the search bar, clicks 'Send to WhatsApp', and the attendee’s phone buzzes with their digital pass before they even finish explaining the issue. The line keeps moving, and attendee frustration is eliminated entirely.",
            ],
            bullets: [
              "Rapid search across thousands of attendee records with instant type-ahead filtering",
              "Multi-channel resends guarantee that attendees always have access to their credentials",
              "Help desk staff can manually check guests in directly from the dashboard if their battery dies",
            ],
            takeaway: "Rapid support turnaround protects your event entrance from support desk bottlenecks.",
          },
        ],

        whoShouldUse: {
          title: "Built for Operations Leads & Ticketing Coordinators",
          subtitle: "Essential for teams managing complex attendee rosters.",
          personas: [
            {
              title: "Conference Operations Managers",
              desc: "Manage speaker passes, sponsor delegate allocations, and VIP guest accommodations.",
              badge: "Conferences",
            },
            {
              title: "College Fest General Secretaries",
              desc: "Oversee campus club allocations, inter-college student passes, and volunteer access badges.",
              badge: "Academia",
            },
            {
              title: "Exhibition & Trade Show Producers",
              desc: "Coordinate exhibitor booth badges, buyer passes, and press accreditations across multi-day events.",
              badge: "Expos",
            },
            {
              title: "Corporate Event Planners",
              desc: "Handle internal executive attendance, employee department quotas, and vendor access control.",
              badge: "Corporate",
            },
          ],
        },

        faqs: [
          {
            q: "Can I issue complimentary (free) passes to sponsors or VIPs?",
            a: "Yes. Organizers can manually add attendees and issue complimentary passes directly from the dashboard without processing payment.",
          },
          {
            q: "What happens if an attendee loses their phone?",
            a: "Gate staff can locate the attendee on the scanner or help desk console by searching their name or email and check them in manually.",
          },
          {
            q: "Can I bulk export attendee records into Excel or CSV?",
            a: "Yes. You can export your complete attendee database, including custom form answers and check-in timestamps, with a single click at any time.",
          },
          {
            q: "Can I assign different permission levels to my event staff?",
            a: "Yes. UrPass allows you to grant volunteer scanner links (check-in only) or full administrative dashboard access to trusted team members.",
          },
        ],

        relatedLinks: [
          { title: "Online Event Ticket Booking System", href: "/solutions/event-ticket-booking-system", category: "Product" },
          { title: "Event Registration and Check-In Platform", href: "/solutions/registration-and-check-in", category: "Product" },
          { title: "What Features Should Event Ticketing Software Have?", href: "/guides/event-ticketing-software-features", category: "Guide" },
          { title: "UrPass Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
