import type { Metadata } from "next";
import { Calendar, Ticket, ScanLine, Users, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Management Software for Modern Events | UrPass",
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
    title: "Event Management Software for Modern Events | UrPass",
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
        secondaryCtaLabel: "Explore Remote Managed Setup",
        secondaryCtaHref: "/managed-event-setup",
        features: [
          { icon: Calendar, title: "Unified Event Lifecycle", desc: "Manage everything from public registration page launch to live entrance check-in and post-event survey analytics in one clean command center." },
          { icon: Ticket, title: "Custom Registration Forms", desc: "Collect custom attendee data, college roll numbers, dietary choices, or department affiliations without third-party form builders." },
          { icon: ScanLine, title: "Digital QR Credentials", desc: "Issue unique digital passes after registration approval or successful payment." },
          { icon: Users, title: "Phone-Based Gate Check-In", desc: "Scan attendee passes using a supported mobile browser without dedicated barcode hardware." },
          { icon: BarChart3, title: "Attendee Roster", desc: "Filter, search, approve, or export attendee data from the event dashboard." },
          { icon: ShieldCheck, title: "Duplicate Entry Detection", desc: "A pass is marked as used after check-in, so subsequent scan attempts can be flagged at the gate." },
        ],
        steps: [
          { n: "01", title: "Set Up Event", desc: "Configure your schedule, venue details, ticket capacities, and registration questionnaire." },
          { n: "02", title: "Share Public Link", desc: "Publish and share your responsive event link across social channels, messaging apps, and email." },
          { n: "03", title: "Manage Approvals", desc: "Approve registrations individually or automate approvals with immediate digital pass dispatch." },
          { n: "04", title: "Scan at the Gate", desc: "Authorized staff scan QR passes in a supported mobile browser." },
          { n: "05", title: "Analyze & Export", desc: "Access live attendance curves, gate velocity metrics, and full CSV exports for post-event reporting." },
        ],
        callout: {
          badge: "ZERO OPERATIONAL FRAGMENTATION",
          title: "Stop stitching together spreadsheets, form builders, and rented scanners.",
          description: "Organizers often waste dozens of hours connecting Google Forms to mail merge scripts, exporting spreadsheets, and printing paper rosters that break down at the venue door. URPASS solves operational drag by uniting registration, ticketing, pass issuance, and entrance scanning into a single cloud engine.",
          bullets: [
            "No UrPass platform commission on tickets; payment gateway fees may apply",
            "Native Indian payments via Razorpay (UPI, Google Pay, PhonePe, Cards, Net Banking)",
            "Coordinated check-in across authorized staff devices",
            "Duplicate scan detection for issued QR passes",
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
            takeaway: "A connected registration and check-in workflow reduces manual handoffs and gives organizers a clearer attendee record."
          },
          {
            badge: "HIGH-VELOCITY SCANNING",
            title: "Sub-Second Gate Verification Engineered for Large Crowds",
            paragraphs: [
              "When hundreds or thousands of attendees arrive simultaneously, gate entry speed is the single most critical factor in attendee satisfaction. Traditional check-in apps frequently stall due to heavy asset loads, camera focus delays, or slow round-trip server queries.",
              "UrPass staff can scan passes from a supported mobile browser. Actual scanning speed depends on the device, camera, lighting, network, and gate workflow.",
              "When a pass has already been checked in, a later scan displays a duplicate-entry warning. Staff should still verify the attendee where identity checks are required."
            ],
            bullets: [
              "Camera-based scanning on supported smartphones",
              "Visual and audible pass verification cues for rapid throughput",
              "Multiple authorized scanner devices",
              "Works smoothly even on fluctuating 4G and venue Wi-Fi networks"
            ],
            takeaway: "Gate staff can use supported smartphones and review the event's check-in record from the dashboard."
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
          { title: "Remote Managed Event Setup", href: "/managed-event-setup", category: "Product" },
          { title: "Event Software Bangalore", href: "/in/bangalore", category: "Location" },
        ],
        faqs: [
          { q: "What is event management software?", a: "Event management software is an all-in-one digital solution that helps organizers handle event scheduling, registration collection, ticket sales, digital credential issuance, venue check-in, and post-event reporting from a centralized dashboard." },
          { q: "How does UrPass price event management?", a: "UrPass has a Free Forever plan and paid subscription options. UrPass does not add a platform commission to ticket sales; payment gateway fees and applicable taxes may still apply. See the current pricing page for plan limits." },
          { q: "Can my volunteers scan passes without installing an app?", a: "Yes. URPASS features a mobile web camera scanner. Staff and volunteers simply navigate to your event's scanner URL in Safari or Chrome, allow camera access, and immediately start scanning QR passes." },
          { q: "Does URPASS support both free and paid events?", a: "Yes. You can run free events with attendee approvals or sell paid tickets using native Razorpay integration supporting UPI, credit cards, debit cards, and net banking across India." },
          { q: "How are duplicate passes detected?", a: "Each digital pass has a unique token. After a successful check-in, subsequent scans can be flagged as duplicates. Organizers may add identity checks where they need to prevent use of a shared screenshot before its first scan." },
          { q: "Can multiple team members manage registrations simultaneously?", a: "Yes. URPASS supports role-based team management, allowing co-organizers, volunteers, and gate staff to coordinate approvals and gate check-in simultaneously with instant cloud synchronization." },
        ],
        ctaTitle: "Streamline your next event with URPASS",
        ctaDescription: "Free Forever available · Paid plans and limits on the pricing page",
      }}
    />
  );
}
