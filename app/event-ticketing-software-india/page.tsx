import type { Metadata } from "next";
import {
  CreditCard,
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Receipt,
  Smartphone,
  Banknote,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software India — Instant UPI, 0% Commission & QR Check-In",
  description:
    "India's dedicated event ticketing software. Sell tickets with 0% platform commission, accept instant UPI & cards via Razorpay, generate GST tax invoices, and check in attendees in <0.3s on any phone browser.",
  keywords: [
    "event ticketing software india",
    "event ticketing platform india",
    "upi event ticketing",
    "zero commission event ticketing india",
    "razorpay event ticketing",
    "qr code event ticketing india",
    "college fest ticketing software",
    "conference ticketing software india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-software-india" },
  openGraph: {
    title: "Event Ticketing Software India | 0% Commission & UPI QR | URPASS",
    description:
      "Sell event tickets in India with zero platform cut. Instant UPI checkout, Razorpay direct bank settlement, GST invoices, and sub-second QR check-in.",
    url: "https://urpass.space/event-ticketing-software-india",
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

export default function EventTicketingSoftwareIndiaPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-software-india",
        badge: "INDIA-FIRST EVENT TICKETING",
        h1: "Event Ticketing Software in India with 0% Platform Commission",
        description:
          "Launch branded ticket pages, collect instant UPI and card payments directly via Razorpay, generate compliant GST invoices, and scan passes at the door in <0.3s using standard smartphone browsers.",
        ctaLabel: "Start ticketing in India",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is Event Ticketing Software in India?",
          summary:
            "Event ticketing software in India is a specialized platform that enables event organizers to sell tickets in Indian Rupees (INR), collect payments via UPI (PhonePe, Google Pay, Paytm) and credit/debit cards, issue automated GST-compliant tax invoices, and validate attendees at venue gates with digital QR passes. URPASS eliminates traditional 5–8% per-ticket platform commissions through transparent monthly software subscriptions starting at ₹499/mo with direct merchant bank settlements.",
          keyPoints: [
            "0% commission on ticket sales: retain 100% of your ticket price",
            "Instant UPI QR & app-switch payments with sub-5-second checkout",
            "Automated GST invoices with GSTIN capture and SAC code 998596",
            "Direct T+2 business day bank settlement through linked Razorpay",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Indian Ticketing Market Comparison & Technical Specs",
          subtitle: "How URPASS compares to legacy Indian ticketing aggregators across fees, settlements, and gate hardware.",
          headers: ["Evaluation Parameter", "URPASS India", "Legacy Aggregators (Townscript / Eventbrite India)"],
          rows: [
            {
              col1: "Platform Commission per Ticket",
              col2: "0% Commission (Fixed monthly plan starting at ₹499)",
              col3: "3.75% to 7.9% deducted per ticket sold",
            },
            {
              col1: "Buyer Convenience Surcharge",
              col2: "₹0 (Attendees pay only face value + GST)",
              col3: "2% to 4% added to the buyer's checkout cart",
            },
            {
              col1: "UPI Payment Experience",
              col2: "Native UPI QR, PhonePe, GPay, Paytm, and BHIM intent",
              col3: "Frequent redirection failures and high mobile drop-off",
            },
            {
              col1: "Merchant Payout Schedule",
              col2: "Direct T+2 settlement to your bank account",
              col3: "Held until 7–14 days after the event concludes",
            },
            {
              col1: "GST Tax Invoicing",
              col2: "Automated GSTIN collection & compliant B2B tax PDF receipts",
              col3: "Manual invoice requests or overseas receipt format",
            },
            {
              col1: "Gate Check-In Speed",
              col2: "< 0.3s per scan using phone browsers (Safari/Chrome)",
              col3: "3.5 to 5s per ticket; requires app store downloads",
            },
            {
              col1: "Pass Customization",
              col2: "Ticket Studio (12 customizable templates, dynamic tokens)",
              col3: "Fixed black-and-white standard voucher template",
            },
            {
              col1: "Free Forever Tier",
              col2: "2 events/mo, up to 100 registrations/mo completely free",
              col3: "Strict attendee limits or mandatory paid setup",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket revenue. Organizers pay a predictable flat software subscription with zero per-ticket deductions.",
          },
          {
            icon: Smartphone,
            title: "Instant UPI QR Checkout",
            desc: "Attendees pay in seconds using PhonePe, Google Pay, Paytm, Cred, or BHIM. Minimizes cart abandonment on mobile screens.",
          },
          {
            icon: Receipt,
            title: "Automated GST Tax Invoices",
            desc: "Capture corporate attendee GSTIN numbers at checkout and automatically issue compliant tax invoices with proper HSN/SAC codes.",
          },
          {
            icon: ScanLine,
            title: "In-Browser Phone Scanner",
            desc: "Equip gate volunteers with a secure PIN link that runs directly in mobile Safari or Chrome. Scans in under 0.3 seconds.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate Protection",
            desc: "Database-level row locks ensure shared screenshots or duplicate passes are blocked instantly with amber alerts and error audio.",
          },
          {
            icon: Banknote,
            title: "Direct T+2 Bank Settlements",
            desc: "Ticket proceeds settle directly into your Indian bank account on standard T+2 cycles, maintaining positive event cash flow.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "The All-in-One Ticketing Solution for Indian Organizers",
          description:
            "From college auditoriums in Chennai to tech conference summits in Bengaluru, URPASS handles ticket sales, invoicing, and door entry seamlessly.",
          type: "ticket-studio",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Engineered Specifically for the Indian Event Ecosystem",
          subtitle: "Frictionless UPI checkout, direct bank settlements, and full GST compliance.",
          items: [
            {
              title: "Instant UPI 2.0 Integration",
              description:
                "Mobile attendees can pay directly inside their preferred UPI apps without manually typing card numbers or CVVs.",
              badge: "UPI 2.0",
            },
            {
              title: "T+2 Direct Bank Deposits",
              description:
                "Ticket sales deposit directly into your Indian current or savings account according to Razorpay's standard schedule.",
              badge: "Cashflow",
            },
            {
              title: "Compliant GST Invoices",
              description:
                "Provide B2B conference attendees with downloadable PDF invoices featuring your GSTIN, client GSTIN, and reverse charge status.",
              badge: "Tax Ready",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Distribute mobile digital QR passes directly via WhatsApp in India, ensuring attendees never lose their tickets.",
              badge: "WhatsApp",
            },
            {
              title: "Multi-Gate College Fests",
              description:
                "Coordinate 10+ entrance gates at college fests and symposiums with real-time synchronized duplicate prevention.",
              badge: "Campus Ready",
            },
            {
              title: "Transparent INR Plans",
              description:
                "Pricing in Indian Rupees starting at ₹0 for free events, ₹499/mo for Starter, and ₹999/mo for Pro with zero commission fees.",
              badge: "INR Pricing",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "COMMISSION COMPARISON",
            title: "The True Cost of Commission-Based Ticketing Platforms in India",
            paragraphs: [
              "When organizers sell tickets through traditional ticketing portals in India, they often encounter hidden fees that erode their profit margins. While these platforms advertise 'free event setup,' they charge between 4% and 8% in platform commission on every ticket sold, plus an additional 2% to 4% 'convenience fee' charged directly to the ticket buyer.",
              "For example, an organizer selling 1,000 tickets at ₹1,000 each generates ₹10,00,000 in gross revenue. On a traditional platform charging a 6% commission and 2% buyer fee, the platform takes ₹60,000 to ₹80,000 from the event. Furthermore, payouts are typically withheld until after the event has completely concluded, creating severe cash flow strain when paying venue deposits and catering vendors.",
              "With URPASS, you connect your own Razorpay account. Whether you sell ₹1,00,000 or ₹50,00,000 in tickets, URPASS takes 0% commission. You only pay the transparent monthly subscription (e.g., ₹999/mo) and standard payment gateway interchange fees (~2% for cards and UPI). Your money settles directly into your bank account on a rolling T+2 schedule.",
            ],
            bullets: [
              "Save ₹50,000 to ₹1,50,000+ per event compared to commission aggregators",
              "Maintain positive cash flow with rolling T+2 bank deposits before event day",
              "Zero surprise convenience fees for attendees at checkout",
              "Maintain 100% direct ownership of attendee email and phone numbers",
            ],
            takeaway:
              "Switching from commission aggregators to URPASS gives organizers full financial transparency, faster payouts, and higher attendee trust.",
          },
          {
            badge: "GATE SPEED & MOBILE SCANNING",
            title: "Solving the Gate Congestion Problem at Indian Venues",
            paragraphs: [
              "Indian event venues—from university auditoriums to five-star hotel ballrooms—frequently suffer from entrance bottlenecks. When hundreds of attendees arrive simultaneously, gate staff using traditional paper guest lists or slow mobile apps take 15 to 30 seconds per attendee to check tickets, causing long queues in the lobby.",
              "URPASS transforms any volunteer's smartphone into a high-speed optical scanner. Using standard web technologies, the scanner operates directly inside Safari or Chrome without requiring volunteers to download an app or log into an account. Passes are decoded and verified against atomic database records in under 0.3 seconds. Distinct audio chimes (high confirmation tone) and haptic vibrations (80ms tap) allow volunteers to validate tickets continuously without staring at the screen.",
            ],
            bullets: [
              "Zero hardware rental costs: staff use their own iOS or Android phones",
              "Under 0.3-second scan time processes up to 30 attendees per minute per gate",
              "High chime audio cue cuts volunteer visual fatigue in crowded lobbies",
              "Offline IndexedDB queue keeps lines moving even if venue WiFi fails",
            ],
            takeaway:
              "Sub-second gate check-in eliminates lobby queues, protects venue fire safety limits, and delivers an exceptional attendee arrival experience.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Legacy Indian Event Ticketing Portals",
          subtitle: "Compare ticketing commissions, settlement timelines, pass customization, and gate hardware.",
          competitorName: "Traditional Portals (Townscript / Eventbrite India)",
          sourceCitations: [
            "Official competitor commercial schedules in India",
            "URPASS live plan specifications (lib/plan.ts)",
          ],
          rows: [
            {
              criteria: "Platform Commission on Sales",
              urpass: "0% Commission (Fixed monthly software fee)",
              competitor: "4.0% to 7.9% per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Buyer Convenience Surcharge",
              urpass: "₹0 (No added platform fee at checkout)",
              competitor: "2% to 4% added to attendee's cart",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout Settlement Schedule",
              urpass: "Direct T+2 bank settlement via linked Razorpay",
              competitor: "Held until 7–14 days post-event",
              urpassAdvantage: true,
            },
            {
              criteria: "GST Tax Invoicing",
              urpass: "Automated GSTIN capture & compliant B2B tax PDFs",
              competitor: "Manual invoice requests or missing GST details",
              urpassAdvantage: true,
            },
            {
              criteria: "Pass Visual Studio",
              urpass: "Ticket Studio (12 customizable templates, dynamic tokens)",
              competitor: "Standard black-and-white PDF ticket receipt",
              urpassAdvantage: true,
            },
            {
              criteria: "Entrance Gate Scanner",
              urpass: "In-browser camera scanner (<0.3s validation)",
              competitor: "Mandatory app download or expensive laser rentals",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Technology & Developer Conferences",
          "Inter-College Hackathons & Code Sprints",
          "Hands-On Masterclasses & Design Bootcamps",
          "Music Concerts & Stand-Up Comedy Shows",
          "Founder Meetups & Investor Demo Days",
          "Corporate Product Launches & Annual Meets",
          "Industry Trade Expos & Business Summits",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software (Master Pillar)",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Event Ticket Payment Gateway (Razorpay)",
            href: "/event-ticket-payment-gateway",
            category: "Guide",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Registration Software India",
            href: "/in",
            category: "Location",
          },
          {
            title: "College Event Ticketing Platform",
            href: "/event-ticketing-platform-for-college-events",
            category: "Use Case",
          },
          {
            title: "Conference Event Ticketing Platform",
            href: "/event-ticketing-platform-for-conferences",
            category: "Use Case",
          },
          {
            title: "Workshop Event Ticketing Platform",
            href: "/event-ticketing-platform-for-workshops",
            category: "Use Case",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "How does 0% commission event ticketing work in India?",
            a: "Instead of charging a percentage on every ticket you sell, URPASS operates on a flat, transparent monthly software subscription (from ₹499/mo). You link your own Razorpay account, and 100% of ticket sales revenue deposits directly into your Indian bank account on rolling T+2 business day schedules.",
          },
          {
            q: "Can attendees pay using UPI apps like PhonePe and Google Pay?",
            a: "Yes. Attendees on mobile devices can complete ticket purchases in under 5 seconds using PhonePe, Google Pay, Paytm, Cred, or BHIM. Desktop users can scan an instant dynamic UPI QR code on their screen.",
          },
          {
            q: "How does URPASS handle GST compliance and tax invoices?",
            a: "URPASS automatically captures corporate attendee GSTIN numbers during registration or checkout. The system generates compliant B2B tax invoices with your organization's GSTIN, proper HSN/SAC codes (e.g., SAC 998596), and tax breakups (CGST + SGST or IGST).",
          },
          {
            q: "Do gate staff need to download an app or register an account?",
            a: "No. The event organizer generates a secure PIN scanner link from their dashboard. Gate volunteers simply open this link in Safari or Chrome on their iOS or Android smartphones to begin scanning passes immediately.",
          },
          {
            q: "What happens if venue internet fails during gate check-in?",
            a: "URPASS features an offline check-in mode. Volunteer smartphones cache the attendee manifest locally in IndexedDB. Passes continue to be scanned and validated instantly, with all check-in records synchronizing automatically once internet connectivity returns.",
          },
          {
            q: "Is there a free plan for college clubs and small events in India?",
            a: "Yes. Our Free plan includes up to 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required. All paid plans include a 30-day free trial.",
          },
        ],

        ctaTitle: "Sell event tickets in India with zero commission",
        ctaDescription:
          "Instant UPI checkout · Razorpay direct settlement · Compliant GST invoices · Sub-second phone check-in",
      }}
    />
  );
}
