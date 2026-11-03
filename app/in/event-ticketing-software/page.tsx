import type { Metadata } from "next";
import {
  Ticket,
  CreditCard,
  QrCode,
  DollarSign,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  Users,
  Building2,
  Send,
  BarChart3,
  MapPin,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software in India — 0% Commission & UPI Payouts | UrPass",
  description:
    "Sell event tickets across India with 0% platform fees. Instant UPI checkout (GPay, PhonePe), direct Razorpay settlement, WhatsApp QR pass delivery, and fast mobile camera check-in.",
  keywords: [
    "event ticketing software in india",
    "event ticketing platform india",
    "sell event tickets online india",
    "zero commission event ticketing india",
    "bookmyshow alternative for organizers",
    "townscript alternative",
    "upi event ticketing platform",
    "college fest ticketing software india",
  ],
  alternates: {
    canonical: "https://urpass.space/in/event-ticketing-software",
  },
  openGraph: {
    title: "Event Ticketing Software in India — 0% Commission & UPI Payouts | UrPass",
    description:
      "Sell tickets online and keep 100% of your earnings. Direct Razorpay settlement, instant UPI checkout, WhatsApp QR ticket delivery, and fast mobile check-in.",
    url: "https://urpass.space/in/event-ticketing-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Ticketing Software in India | UrPass",
    description:
      "Zero commission event ticketing for Indian organizers. Instant UPI payouts and WhatsApp QR tickets.",
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
        badge: "INDIA REGIONAL // EVENT TICKETING",
        h1: "Event Ticketing Software in India with 0% Platform Commission",
        canonicalUrl: "https://urpass.space/in/event-ticketing-software",
        description:
          "Sell event tickets online across India without giving away 5% to 10% in platform fees. Connect your Razorpay account for direct UPI payouts, automated WhatsApp QR tickets, and sub-0.3s gate check-in.",
        ctaLabel: "Sell Tickets Free in India",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare Fee Savings",
        secondaryCtaHref: "/ticket-fee-calculator",

        geo: {
          region: "IN",
          placename: "India",
          position: "20.5937;78.9629",
          latitude: 20.5937,
          longitude: 78.9629,
          country: "India",
          countryCode: "IN",
        },

        // GEO Direct Answer
        directAnswer: {
          title: "How Does 0% Commission Event Ticketing Work in India?",
          summary:
            "Event ticketing software in India enables organizers to sell tickets, accept UPI transactions, and validate attendees at venue doors. While traditional Indian ticketing marketplaces like BookMyShow and Townscript deduct 5% to 10% per ticket and hold payouts in escrow until post-event, UrPass operates on a 0% ticketing commission model. All ticket revenues settle directly into your own Razorpay merchant account on a standard T+2 business day schedule, allowing organizers to keep 100% of their box office revenue.",
          keyPoints: [
            "0% platform ticketing fee: retain 100% of your ticket sales revenue without percentage cuts",
            "Direct Razorpay payouts: funds deposit into your Indian bank account on standard merchant schedules",
            "Instant UPI checkout: attendees pay effortlessly using Google Pay, PhonePe, Paytm, or CRED",
            "WhatsApp ticket delivery: QR code passes arrive directly on WhatsApp with 98%+ read rates",
            "Sub-0.3s camera check-in: gate staff scan tickets on standard smartphones with atomic fraud locking",
          ],
        },

        whatIs: {
          title: "Direct Ticketing vs. Marketplace Portals in India",
          definition:
            "Marketplace portals like BookMyShow or Insider position themselves as discovery platforms, but charge high per-ticket convenience fees to buyers and 5%–10% commissions to organizers, all while holding funds in escrow and showing competitors' events next to yours. UrPass offers independent organizers a direct white-label ticketing solution with zero commission overhead.",
          details: [
            "Protects cash flow by releasing funds immediately to pay venue advances and artist deposits",
            "Guarantees that your attendee contact details remain your exclusive property",
            "Provides buyers with a clean checkout experience free from exorbitant convenience fees",
          ],
        },

        indiaHighlights: {
          title: "Engineered Specifically for the Indian Ticketing Market",
          subtitle: "Designed around local payment preferences and cash flow realities.",
          items: [
            {
              title: "Instant UPI & QR Checkout",
              description:
                "Over 85% of Indian online ticket buyers prefer UPI. UrPass provides a rapid 2-tap UPI checkout that converts visitors into confirmed ticket holders in seconds.",
              badge: "UPI First",
            },
            {
              title: "Direct Bank Settlements",
              description:
                "Payments route straight through your own Razorpay account. No waiting weeks for an intermediary platform to approve your payout.",
              badge: "Direct Payouts",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Attendees receive their official QR pass directly in WhatsApp, complete with Google Maps venue navigation and entry instructions.",
              badge: "WhatsApp",
            },
            {
              title: "GST Tax Invoices for B2B",
              description:
                "Automatically generate GST invoices with legal company GSTIN details for corporate registrations and sponsored passes.",
              badge: "GST Compliant",
            },
          ],
        },

        keyFactsTable: {
          title: "UrPass India vs. BookMyShow vs. Townscript",
          subtitle: "Clear financial comparison for an event selling 1,000 tickets at ₹1,000 each (₹10,00,000 Gross).",
          headers: ["Financial / Operational Metric", "UrPass Platform", "BookMyShow", "Townscript"],
          rows: [
            {
              col1: "Platform Commission Fee",
              col2: "0% (Flat SaaS subscription starting ₹499/mo)",
              col3: "6%–10% (₹60,000 – ₹1,00,000 lost)",
              col4: "4%–6% (₹40,000 – ₹60,000 lost)",
            },
            {
              col1: "Payout Release Schedule",
              col2: "T+2 direct bank deposit via Razorpay",
              col3: "Escrow held until 7–15 days after event",
              col4: "Weekly or post-event escrow",
            },
            {
              col1: "Gate Scanner Requirements",
              col2: "Free phone camera web scanner (<0.3s)",
              col3: "Rented handheld hardware or app",
              col4: "Mobile organizer app",
            },
            {
              col1: "Attendee Data Privacy",
              col2: "100% organizer owned (full export)",
              col3: "Marketed to with competing events",
              col4: "Shared with portal marketplace",
            },
            {
              col1: "Pass Delivery Channels",
              col2: "WhatsApp, Email, and Apple Wallet",
              col3: "BookMyShow App / SMS link",
              col4: "Email PDF / Townscript App",
            },
          ],
        },

        featuresTitle: "The Complete Indian Event Ticketing Suite",
        featuresSubtitle: "Everything needed to maximize ticket sales and streamline venue entry.",
        features: [
          {
            icon: DollarSign,
            title: "Zero Ticketing Commission",
            desc: "Never surrender 5% to 10% of your box office revenue. Pay a modest flat SaaS subscription and keep every rupee you earn.",
          },
          {
            icon: CreditCard,
            title: "Direct UPI & Razorpay Settlement",
            desc: "Collect payments via Google Pay, PhonePe, Paytm, CRED, RuPay, and Netbanking with immediate T+2 bank deposits.",
          },
          {
            icon: Send,
            title: "Automated WhatsApp Delivery",
            desc: "Passes deliver directly to attendees' WhatsApp messages, ensuring that passes are never lost in crowded email spam folders.",
          },
          {
            icon: QrCode,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan passes at venue doors using any smartphone camera in under 300 milliseconds. Keep lines moving rapidly.",
          },
          {
            icon: ShieldCheck,
            title: "Screenshot Fraud Protection",
            desc: "Dynamic cryptographic tokens lock automatically on first scan, preventing guests from sharing passes with friends.",
          },
          {
            icon: BarChart3,
            title: "Live Box Office Analytics",
            desc: "Track real-time gross revenue, sales velocity across tiers, remaining seats, and arrival numbers from your dashboard.",
          },
        ],

        howItWorksTitle: "How to Start Selling Event Tickets in India",
        howItWorksSubtitle: "Four straightforward stages to launch your ticketing page.",
        steps: [
          { n: "01", title: "Set Ticket Tiers", desc: "Define pricing in INR (₹), ticket quantities, early bird discounts, and sale deadlines." },
          { n: "02", title: "Link Razorpay Account", desc: "Connect your Razorpay merchant key in seconds for direct bank deposits." },
          { n: "03", title: "Share Ticket Link", desc: "Promote your dedicated ticketing page across WhatsApp, Instagram, LinkedIn, and ads." },
          { n: "04", title: "Scan at the Door", desc: "Staff scan digital passes using mobile phone cameras, admitting guests in under 0.3 seconds." },
        ],

        deepDiveSections: [
          {
            badge: "CASH FLOW ADVANTAGE",
            title: "Why Direct Razorpay Payouts Beat Escrow Ticketing Portals",
            paragraphs: [
              "Organizing an event in India requires heavy upfront expenditures: venue advances (often 50%), sound and light rentals, marketing costs, and artist guarantees. Legacy ticketing platforms that hold funds in escrow until after the event force organizers to take expensive short-term loans or fund events out of pocket.",
              "With UrPass, ticket payments settle directly into your corporate bank account via Razorpay on a daily rolling schedule. You use your ticket sales revenue to pay event vendors as tickets are sold, maintaining healthy working capital and zero debt.",
            ],
            bullets: [
              "Immediate working capital to settle upfront production and venue advances",
              "Zero risk of ticketing company bankruptcy or prolonged escrow payout freezes",
              "Complete financial transparency with direct merchant settlement statements",
            ],
            takeaway: "Direct ticketing protects your cash flow and puts you in complete control of your event funds.",
          },
        ],

        whoShouldUse: {
          title: "Empowering Event Organizers Across India",
          subtitle: "Trusted for events of every size and format.",
          personas: [
            {
              title: "College Fest Organizing Committees",
              desc: "Sell pro-night tickets, battle of the bands passes, and delegate cards with instant UPI checkout.",
              badge: "Academia",
            },
            {
              title: "Conferences & Tech Summits",
              desc: "Sell delegate passes, VIP networking dinner access, and workshop tickets with automatic GST invoices.",
              badge: "Tech & B2B",
            },
            {
              title: "Independent Workshop Instructors",
              desc: "Sell seats for masterclasses, culinary workshops, and coding bootcamps with 0% commission deductions.",
              badge: "Workshops",
            },
            {
              title: "Music Concerts & Cultural Shows",
              desc: "Distribute Early Bird and Phase 1 tickets via WhatsApp with fraud-proof cryptographic QR codes.",
              badge: "Concerts",
            },
          ],
        },

        faqs: [
          {
            q: "How does UrPass compare to BookMyShow or Townscript?",
            a: "BookMyShow and Townscript take 5% to 10% commission per ticket sold and hold your money in escrow until after the event. UrPass charges 0% commission, uses a flat monthly plan (starting at ₹499/mo), and routes payments directly to your Razorpay account with daily settlements.",
          },
          {
            q: "Can attendees pay using UPI apps like PhonePe and Google Pay?",
            a: "Yes. All major Indian UPI payment apps—including Google Pay, PhonePe, Paytm, CRED, and BHIM—are natively supported at checkout.",
          },
          {
            q: "Can I sell both free and paid tickets for the same event?",
            a: "Yes. You can configure free tiers (e.g. General Student Admission) and paid tiers (e.g. VIP Front Row Access, Workshop Addon) within the same event.",
          },
          {
            q: "How are tickets delivered to Indian attendees?",
            a: "Attendees receive their ticket immediately on screen, via email, and directly on WhatsApp with a scannable cryptographic QR code.",
          },
        ],

        relatedLinks: [
          { title: "Event Registration Software in India", href: "/in/event-registration-software", category: "Location" },
          { title: "Online Event Ticket Booking System", href: "/solutions/event-ticket-booking-system", category: "Product" },
          { title: "UrPass vs. BookMyShow Comparison", href: "/compare/urpass-vs-bookmyshow", category: "Comparison" },
          { title: "UrPass vs. Townscript Comparison", href: "/compare/urpass-vs-townscript", category: "Comparison" },
          { title: "Ticket Fee Savings Calculator", href: "/ticket-fee-calculator", category: "Guide" },
        ],
      }}
    />
  );
}
