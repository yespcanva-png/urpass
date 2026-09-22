import type { Metadata } from "next";
import { Calendar, Ticket, ScanLine, Users, BarChart3, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Management Software for Modern Events | URPASS",
  description: "Manage registrations, attendees, digital passes, QR check-in and attendance from one simple event management platform.",
  keywords: [
    "event management software",
    "event management platform",
    "event software",
    "QR event check-in",
    "digital event pass",
    "attendee management system",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-management-software" },
  openGraph: {
    title: "Event Management Software for Modern Events | URPASS",
    description: "Manage registrations, attendees, digital passes, QR check-in and attendance from one simple event management platform.",
    url: "https://urpass.space/event-management-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT MANAGEMENT SOFTWARE",
        h1: "Event Management Software That Keeps Everything Simple",
        canonicalUrl: "https://urpass.space/event-management-software",
        description: "URPASS brings registration, attendee management, digital passes, QR check-in and attendance tracking together so organizers can run events without juggling multiple tools.",
        ctaLabel: "Create Your Event",
        features: [
          { icon: Calendar, title: "Unified Event Lifecycle", desc: "Manage everything from public registration page launch to live entrance check-in and post-event survey analytics in one clean command center." },
          { icon: Ticket, title: "Custom Registration Forms", desc: "Collect custom attendee data, college roll numbers, dietary choices, or department affiliations without third-party form builders." },
          { icon: ScanLine, title: "Digital QR Credentials", desc: "Automatically distribute fraud-proof digital passes with dynamic QR codes upon registration submission or manual organizer approval." },
          { icon: Users, title: "Sub-Second Gate Check-In", desc: "Scan attendee passes in under 0.3s using any mobile browser without renting expensive barcode hardware or installing dedicated apps." },
          { icon: BarChart3, title: "Live Roster Synchronization", desc: "Filter, search, approve, or export attendee data with instant real-time synchronization across all team members and gates." },
          { icon: ShieldCheck, title: "Duplicate Entry Prevention", desc: "Cryptographic QR tokens prevent ticket pass sharing, screenshot reuse, and multi-gate duplication with instantaneous alerts." },
        ],
        steps: [
          { n: "01", title: "Set Up Event", desc: "Configure your schedule, venue details, ticket capacities, and registration questionnaire." },
          { n: "02", title: "Share Public Link", desc: "Publish and share your responsive event link across social channels, messaging apps, and email." },
          { n: "03", title: "Manage Approvals", desc: "Approve registrations individually or automate approvals with immediate digital pass dispatch." },
          { n: "04", title: "Scan at the Gate", desc: "Volunteers and coordinators scan QR passes directly in mobile Safari or Chrome in under 0.3 seconds." },
          { n: "05", title: "Analyze & Export", desc: "Access live attendance curves, gate velocity metrics, and full CSV exports for post-event reporting." },
        ],
        callout: {
          badge: "ZERO OPERATIONAL FRAGMENTATION",
          title: "Stop stitching together spreadsheets, form builders, and rented scanners.",
          description: "Organizers often waste dozens of hours connecting Google Forms to mail merge scripts, exporting spreadsheets, and printing paper rosters that break down at the venue door. URPASS solves operational drag by uniting registration, ticketing, pass issuance, and entrance scanning into a single cloud engine.",
          bullets: [
            "Zero per-ticket platform commission fees — keep 100% of your earnings",
            "Native Indian payments via Razorpay (UPI, Google Pay, PhonePe, Cards, Net Banking)",
            "Instant multi-counter synchronization across unlimited staff devices",
            "Real-time fraud defense with single-use cryptographic QR validation",
          ],
        },
        deepDiveSections: [
          {
            badge: "THE OPERATIONAL CHALLENGE",
            title: "Why Modern Organizers Need Unified Event Software",
            paragraphs: [
              "Event operations in colleges, tech conferences, and corporate meetups traditionally suffer from extreme software fragmentation. Organizers collect registrations on one tool, process payments on another, send confirmation emails through a third, and attempt to verify attendees using printed paper sheets or rented barcode hardware.",
              "This fragmented architecture causes long entry lines, accidental duplicate check-ins, security vulnerabilities from forwarded screenshots, and hours of tedious manual data reconciliation after the event concludes.",
              "URPASS replaces this fragile toolchain with a cohesive, browser-first platform. From the moment an attendee registers to the second they scan their QR code at your entrance gate, every action is logged, secured, and synchronized in real time."
            ],
            bullets: [
              "Eliminates manual CSV exports and email mail merge errors",
              "Prevents counterfeit credentials and unauthorized admissions",
              "Provides accurate real-time attendance figures for sponsors and safety compliance",
              "Works across desktop, iOS, and Android without app store downloads"
            ],
            takeaway: "By replacing 4-5 disconnected tools with URPASS, event teams reduce gate check-in times by over 70% and completely eliminate manual attendee reconciliation."
          },
          {
            badge: "HIGH-VELOCITY SCANNING",
            title: "Sub-Second Gate Verification Engineered for Large Crowds",
            paragraphs: [
              "When hundreds or thousands of attendees arrive simultaneously, gate entry speed is the single most critical factor in attendee satisfaction. Traditional check-in apps frequently stall due to heavy asset loads, camera focus delays, or slow round-trip server queries.",
              "URPASS's browser-based scanner is engineered for maximum throughput. Operating in standard web browsers with sub-0.3 second camera recognition, staff members can verify incoming passes at a rate of 25 to 30 attendees per minute per scanner line.",
              "Because data syncs instantaneously across all active scanner terminals, an attendee checked in at Gate A cannot hand their digital pass or screenshot to a friend at Gate B; duplicate entry attempts trigger an immediate high-contrast visual alert."
            ],
            bullets: [
              "Sub-0.3 second camera decode speed on standard smartphone hardware",
              "Visual and audible pass verification cues for rapid throughput",
              "Multi-counter load balancing across unlimited volunteer smartphones",
              "Works smoothly even on fluctuating 4G and venue Wi-Fi networks"
            ],
            takeaway: "Gate staff can manage high-density check-in surges with standard volunteer smartphones, saving thousands on barcode rental equipment."
          }
        ],
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences",
          "Hackathons & Buildathons",
          "Corporate Summits",
          "Hands-on Workshops",
          "Department Seminars",
          "Community Meetups",
          "Annual Campus Festivals",
        ],
        relatedLinks: [
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "Online Event Registration", href: "/online-event-registration", category: "Product" },
          { title: "How Does QR Event Check-In Work?", href: "/guides/how-does-qr-event-check-in-work", category: "Guide" },
          { title: "Eventbrite Alternative for India", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Event Software Bangalore", href: "/in/bangalore", category: "Location" },
        ],
        faqs: [
          { q: "What is event management software?", a: "Event management software is an all-in-one digital solution that helps organizers handle event scheduling, registration collection, ticket sales, digital credential issuance, venue check-in, and post-event reporting from a centralized dashboard." },
          { q: "How does URPASS compare to legacy event management systems?", a: "Legacy event platforms often charge 3% to 10% per ticket, demand specialized handheld scanner rentals, and impose complex administrative setups. URPASS provides transparent flat monthly pricing, charges zero platform commission on tickets, and runs directly inside mobile web browsers without any app downloads." },
          { q: "Can my volunteers scan passes without installing an app?", a: "Yes. URPASS features a mobile web camera scanner. Staff and volunteers simply navigate to your event's scanner URL in Safari or Chrome, allow camera access, and immediately start scanning QR passes." },
          { q: "Does URPASS support both free and paid events?", a: "Yes. You can run free events with attendee approvals or sell paid tickets using native Razorpay integration supporting UPI, credit cards, debit cards, and net banking across India." },
          { q: "How are duplicate passes and screenshot sharing prevented?", a: "Each URPASS digital ticket contains a unique cryptographic token. When scanned at the entrance, the pass is instantly marked as 'Checked In' across all gates. Any subsequent scan attempt displays an immediate red warning with the original check-in timestamp and device details." },
          { q: "Can multiple team members manage registrations simultaneously?", a: "Yes. URPASS supports role-based team management, allowing co-organizers, volunteers, and gate staff to coordinate approvals and gate check-in simultaneously with instant cloud synchronization." },
        ],
        ctaTitle: "Streamline your next event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · No credit card required to start",
      }}
    />
  );
}
