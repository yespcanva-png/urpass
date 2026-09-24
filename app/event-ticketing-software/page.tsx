import type { Metadata } from "next";
import {
  Ticket,
  QrCode,
  ScanLine,
  CreditCard,
  BarChart3,
  Zap,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Users,
  Layers,
  Palette,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software with QR Check-In & UPI Payments",
  description:
    "Modern event ticketing software with zero per-ticket commission, instant UPI checkout, visual ticket designer, and sub-second QR gate check-in on any smartphone browser.",
  keywords: [
    "event ticketing software",
    "digital event ticketing",
    "online ticketing software",
    "QR event check-in software",
    "event ticket booking system",
    "event ticketing software india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-software" },
  openGraph: {
    title: "Event Ticketing Software with QR Check-In & UPI Payments | URPASS",
    description:
      "Sell tickets with zero commission, design passes in Ticket Studio, and check in 1,000+ attendees with phone cameras.",
    url: "https://urpass.space/event-ticketing-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-software",
        badge: "MODERN EVENT TICKETING SOFTWARE",
        h1: "Event Ticketing Software with Sub-Second QR Gate Check-In",
        description:
          "Launch branded registration pages, sell tickets with 0% platform fee, customize passes in Ticket Studio, and validate attendees at venue gates in under 0.3 seconds using any phone browser.",
        ctaLabel: "Start ticketing free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is Event Ticketing Software?",
          summary:
            "Event ticketing software is a digital platform that automates event registration, ticket sales, attendee payment processing, digital pass issuance, and venue door check-ins. URPASS simplifies this entire lifecycle by eliminating ticket printing, mandatory app installs, and per-ticket commission fees—enabling organizers to launch custom ticket workflows in 5 minutes and check in attendees at speed using any phone browser.",
          keyPoints: [
            "0% ticket sales commission — flat, predictable monthly pricing",
            "Sub-second gate check-in (<0.3s) with audio and vibration feedback",
            "Native Razorpay integration supporting instant UPI, cards, and net banking",
            "Visual Ticket Studio with 12 editable templates across Digital, Print, and Badge formats",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Technical Specifications & Core Capabilities",
          subtitle: "How URPASS compares to legacy ticketing tools across speed, fees, and gate hardware requirements.",
          headers: ["Feature / Capability", "URPASS Specification", "Industry Standard"],
          rows: [
            {
              col1: "Platform Commission on Tickets",
              col2: "0% (Keep 100% of ticket sales revenue)",
              col3: "3.5% to 8% per ticket sold",
            },
            {
              col1: "Gate Check-In Speed",
              col2: "< 0.3 seconds per QR scan",
              col3: "2.5 to 5 seconds per ticket",
            },
            {
              col1: "Gate Scanner Hardware",
              col2: "Any iOS or Android smartphone browser (No app download)",
              col3: "Dedicated laser scanners or native app store downloads",
            },
            {
              col1: "Payment Methods (India)",
              col2: "Instant UPI QR, Google Pay, PhonePe, Cards, Net Banking",
              col3: "Credit cards primarily, complex UPI redirects",
            },
            {
              col1: "Capacity Reservation",
              col2: "Atomic DB locks with 10-minute hold window",
              col3: "Optimistic updates causing ticket overbooking",
            },
            {
              col1: "Offline Gate Resilience",
              col2: "Full offline check-in queue with auto conflict sync",
              col3: "Requires continuous live WiFi/cellular connection",
            },
            {
              col1: "Ticket Customization",
              col2: "Ticket Studio (Visual WYSIWYG, 12 templates, dynamic tokens)",
              col3: "Fixed black-and-white PDF ticket vouchers",
            },
            {
              col1: "Attendee Invoicing",
              col2: "Automated GST-compliant invoices with HSN/SAC codes",
              col3: "Manual invoice generation or missing GST details",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Ticket,
            title: "Multi-Tier Ticket Setup",
            desc: "Create Early Bird, General, VIP, Student, and Group passes with independent pricing, quotas, and release schedules.",
          },
          {
            icon: CreditCard,
            title: "Zero Ticket Commission",
            desc: "Collect ticket revenue directly through your linked Razorpay account. No 5-8% platform deduction taken from your ticket sales.",
          },
          {
            icon: Palette,
            title: "Visual Ticket Studio",
            desc: "Choose from 12 pre-designed templates or build from scratch. Add event logos, attendee tokens, and custom brand colors.",
          },
          {
            icon: ScanLine,
            title: "Browser-Based Door Scanner",
            desc: "Gate volunteers open a secure PIN link on their phones. Sub-second scanning with green chimes and haptic feedback.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Check-In & Anti-Fraud",
            desc: "Database-level atomic operations block duplicate ticket entry across all venue gates instantly, eliminating ticket sharing.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Monitor check-in curves, gate velocity, attendance percentages, and attendee rosters in real time from your dashboard.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Built for Real-World Event Operations",
          description:
            "From visual pass design to high-pressure gate check-in queues, URPASS provides the tools modern organizers need to run flawless events.",
          type: "ticket-studio",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Tailored for the Indian Event Ecosystem",
          subtitle: "Frictionless UPI checkout, direct bank settlements, and full GST invoicing compliance.",
          items: [
            {
              title: "Instant UPI & QR Payments",
              description:
                "Attendees can pay in 5 seconds using PhonePe, Google Pay, Paytm, or BHIM. Minimizes cart abandonment on mobile.",
              badge: "UPI 2.0",
            },
            {
              title: "Direct T+2 Bank Settlements",
              description:
                "Ticket sales settle directly into your Indian bank account per standard gateway timelines, rather than being held until after the event.",
              badge: "Cashflow",
            },
            {
              title: "Automated GST Tax Invoices",
              description:
                "Collect GSTIN numbers from corporate attendees and automatically generate compliant tax invoices with proper HSN/SAC codes.",
              badge: "Compliance",
            },
            {
              title: "WhatsApp & SMS Pass Delivery",
              description:
                "Deliver mobile entry passes directly to attendee phones via WhatsApp and email, eliminating lost tickets and PDF printing.",
              badge: "Delivery",
            },
            {
              title: "Transparent INR Pricing",
              description:
                "Flat, affordable monthly plans in Indian Rupees with 0% platform ticket commissions. Free forever tier for 2 events/month.",
              badge: "Affordable",
            },
            {
              title: "Multi-City Event Hubs",
              description:
                "Trusted by event organizers across Bengaluru, Chennai, Mumbai, Delhi NCR, Hyderabad, Pune, Coimbatore, and Kochi.",
              badge: "Pan-India",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "OVERCOMING GATE DELAYS",
            title: "Why Traditional Ticketing Systems Fail at the Gate",
            paragraphs: [
              "Most event organizers dread the first 45 minutes of their event. Attendees crowd outside the venue entrance while gate staff struggle with printed paper spreadsheets or slow mobile apps that require multiple taps to search a name. If two attendees show up with photocopied tickets, paper lists cannot prevent duplicate entry.",
              "URPASS solves this through browser-based camera scanning paired with database-level atomic operations. The scanner decodes encrypted QR tokens in under 0.3 seconds, flashes a bold green verification screen, sounds a confirmation chime, and triggers an 80ms haptic vibration—allowing volunteers to check in attendees without even taking their eyes off the queue.",
            ],
            bullets: [
              "Sub-second camera scanning eliminates entrance bottlenecks",
              "Audio and haptic cues enable rapid continuous throughput",
              "Hardware-free setup: volunteers use their personal phones",
              "Offline SQLite queue safeguards scanning during network dropouts",
            ],
            takeaway:
              "Fast gate validation is the first impression attendees get of your event. Eliminating paper guestlists and dedicated hardware scanners cuts check-in times by over 80%.",
          },
          {
            badge: "PRICING INTEGRITY",
            title: "The Hidden Trap of Per-Ticket Commissions",
            paragraphs: [
              "Legacy ticketing platforms advertise 'free to list,' but hide their revenue model behind 3% to 8% platform commissions plus mandatory 'buyer convenience fees.' For a conference or festival generating ₹10,00,000 in ticket sales, traditional ticketing platforms can deduct upwards of ₹60,000 to ₹90,000 in ticketing fees alone.",
              "URPASS uses a flat, predictable subscription model. Whether you sell 50 tickets or 2,500 tickets, URPASS takes 0% commission on your ticket sales. Your only transaction cost is the standard, transparent gateway fee from Razorpay (typically ~2% for cards and UPI).",
            ],
            bullets: [
              "Keep 100% of your ticket price with zero platform cuts",
              "No surprise 'convenience fees' added to attendees' carts",
              "Predictable monthly operational budgeting",
              "Permanent free tier available for events under 100 attendees",
            ],
            takeaway:
              "Switching from commission-based ticketing to URPASS saves professional organizers tens of thousands of rupees per event.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Legacy Event Ticketing Platforms",
          subtitle: "Compare ticketing commissions, entrance scanning speeds, and pass customization.",
          competitorName: "Traditional Platforms (Eventbrite / Townscript)",
          sourceCitations: [
            "Official competitor pricing pages (Eventbrite India & Townscript standard commercial terms)",
            "URPASS live plan specifications (lib/plan.ts)",
          ],
          rows: [
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Keep 100% of ticket price)",
              competitor: "3.7% to 5% + fixed fee per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Buyer Convenience Surcharge",
              urpass: "₹0 (Zero platform surcharge added)",
              competitor: "2% to 4% added to attendee checkout",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Deployment",
              urpass: "Zero install — opens in phone browser via PIN link",
              competitor: "Mandatory app store download & staff account login",
              urpassAdvantage: true,
            },
            {
              criteria: "Pass Design & Branding",
              urpass: "Ticket Studio (12 customizable templates, dynamic tokens)",
              competitor: "Generic black-and-white ticket receipt",
              urpassAdvantage: true,
            },
            {
              criteria: "Door Validation Speed",
              urpass: "< 0.3s with sound and haptic confirmation",
              competitor: "2 to 4 seconds per ticket scan",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Forever Tier",
              urpass: "2 events/mo, up to 100 registrations/mo free",
              competitor: "Limited free tickets or paid subscription mandatory",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences & Keynotes",
          "24-Hour Hackathons",
          "Hands-On Masterclasses & Workshops",
          "Music Concerts & Cultural Fests",
          "Founder Meetups & Demo Days",
          "Corporate Product Summits",
          "Exhibitions & Trade Expos",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software in India",
            href: "/in",
            category: "Location",
          },
          {
            title: "QR Ticketing System & Gate Scanner",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Online Event Registration System",
            href: "/online-event-registration-system",
            category: "Product",
          },
          {
            title: "Event Check-In App & Phone Scanner",
            href: "/event-check-in-app",
            category: "Product",
          },
          {
            title: "Compare: Zoho Backstage Alternative India",
            href: "/compare/zoho-backstage-alternative-india",
            category: "Comparison",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: How to Create QR Event Passes",
            href: "/guides/how-to-create-qr-event-pass",
            category: "Guide",
          },
          {
            title: "Guide: Prevent Duplicate Event Entry",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "What makes URPASS different from Eventbrite or Townscript?",
            a: "URPASS charges zero commission on ticket sales (flat monthly subscription starting at ₹499/mo with a permanent free tier), features a visual drag-and-drop Ticket Studio for designing passes, and enables gate check-in directly through mobile browsers in under 0.3 seconds without requiring volunteers to download an app.",
          },
          {
            q: "How do ticket payments and settlements work?",
            a: "URPASS integrates directly with Razorpay. When an attendee pays via UPI, debit/credit cards, or net banking, 100% of the funds settle directly into your registered Indian bank account according to standard gateway settlement schedules (typically T+2 business days).",
          },
          {
            q: "Can I try URPASS event ticketing for free?",
            a: "Yes. Our Free tier includes 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required. All paid plans also include a 30-day free trial.",
          },
          {
            q: "Do door volunteers need to install an app or create an account?",
            a: "No. Organizers generate a secure, PIN-protected scanner link from their dashboard. Volunteers simply open this link in Safari or Chrome on their smartphones to immediately begin scanning passes.",
          },
          {
            q: "How does URPASS prevent attendees from sharing duplicate QR codes?",
            a: "Every scan triggers an atomic database operation. When a pass is scanned, it is marked as checked_in instantly across all gates. If someone attempts to enter with a duplicate or screenshot of an already-scanned pass, the scanner immediately sounds a low double warning tone, flashes an amber alert, and triggers an error vibration.",
          },
          {
            q: "Can I design different tickets for General and VIP tiers?",
            a: "Yes. In URPASS Ticket Studio, you can assign different ticket styles, colors, and badge labels to individual ticket tiers, making visual identification fast and intuitive for gate security.",
          },
        ],

        ctaTitle: "Upgrade your event ticketing today",
        ctaDescription:
          "Zero ticket commission · Visual pass studio · Sub-second phone check-in · Built for India",
      }}
    />
  );
}
