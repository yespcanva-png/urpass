import type { Metadata } from "next";
import {
  Globe,
  Share2,
  Smartphone,
  CreditCard,
  QrCode,
  ScanLine,
  Zap,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Ticketing Without a Website — Hosted Checkout & Digital Passes",
  description:
    "Sell event tickets online without building a website. Get a branded, mobile-responsive checkout link, accept instant UPI & card payments, and issue digital QR passes in minutes.",
  keywords: [
    "online event ticketing without a website",
    "sell event tickets online",
    "hosted event checkout page",
    "online ticketing link",
    "no code event ticketing",
    "instant event registration page",
    "digital ticket sales link",
  ],
  alternates: { canonical: "https://urpass.space/online-event-ticketing" },
  openGraph: {
    title: "Online Event Ticketing Without a Website | URPASS",
    description:
      "No website needed. Share a hosted ticket checkout link, accept UPI payments with 0% commission, and issue digital QR passes instantly.",
    url: "https://urpass.space/online-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function OnlineEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/online-event-ticketing",
        badge: "NO WEBSITE REQUIRED",
        h1: "Sell Event Tickets Online Without Building a Website",
        description:
          "Launch a hosted, mobile-optimized event ticket page in under 3 minutes. Share your unique link across WhatsApp, Instagram, or LinkedIn, accept instant UPI payments, and scan passes at the door with any phone.",
        ctaLabel: "Create ticket link free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "How to Sell Event Tickets Online Without a Website?",
          summary:
            "Selling event tickets online without a website is achieved by using a hosted event checkout platform that automatically generates a standalone, mobile-responsive event page. URPASS eliminates the need for WordPress plugins, domain hosting, or complex web design: organizers simply input their event schedule, configure ticket tiers, and share a hosted registration link that processes instant UPI payments and issues digital QR passes automatically.",
          keyPoints: [
            "Instant shareable checkout URL — no domain, hosting, or web coding needed",
            "Optimized for mobile sharing across WhatsApp, Instagram Bio, and LinkedIn",
            "Accept instant UPI (PhonePe, GPay, Paytm) and cards via Razorpay with 0% commission",
            "Door check-in operates via phone camera browser scanner in under 0.3 seconds",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Hosted Ticket Links vs. Custom Event Websites",
          subtitle: "Why hosted checkout links launch faster, convert higher on mobile, and save hosting expenses.",
          headers: ["Capability", "URPASS Hosted Ticket Link", "Custom Website (WordPress / Webflow)"],
          rows: [
            {
              col1: "Setup Time & Complexity",
              col2: "Under 3 minutes (zero coding or web design)",
              col3: "2 to 7 days (domain setup, SSL, hosting, and plugins)",
            },
            {
              col1: "Monthly Hosting & Plugin Costs",
              col2: "₹0 (Free tier available; flat monthly plans from ₹499)",
              col3: "₹1,500–₹5,000/mo in hosting, themes, and commerce plugins",
            },
            {
              col1: "Mobile WhatsApp/Instagram Bio Optimization",
              col2: "Sub-second mobile loading with direct 1-tap UPI app switch",
              col3: "Heavy page weights, slow load times, and broken mobile viewports",
            },
            {
              col1: "Ticket Pass Issuance",
              col2: "Automated digital QR pass generated instantly on screen & WhatsApp",
              col3: "Requires manual webhook scripting or third-party email add-ons",
            },
            {
              col1: "Entrance Gate Scanning",
              col2: "Built-in smartphone camera scanner (<0.3s validation)",
              col3: "Must export CSV and use separate third-party scanning app",
            },
            {
              col1: "Platform Commission on Sales",
              col2: "0% Commission (Direct Razorpay merchant settlement)",
              col3: "2% to 5% commerce plugin fees or gateway surcharges",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Globe,
            title: "Hosted Event Landing Page",
            desc: "Every event receives a clean, fast-loading public URL with event schedule, venue map, speaker bios, and ticket selection.",
          },
          {
            icon: Share2,
            title: "Social & WhatsApp Ready",
            desc: "Add your event link to your Instagram bio, WhatsApp status, LinkedIn posts, or email newsletter for instant social checkout.",
          },
          {
            icon: Smartphone,
            title: "Instant UPI Checkout",
            desc: "Mobile buyers complete purchases in under 5 seconds using PhonePe, Google Pay, or Paytm without typing card numbers.",
          },
          {
            icon: QrCode,
            title: "Automated Digital QR Passes",
            desc: "Attendees receive their branded digital pass immediately upon payment with zero PDF downloads or printing required.",
          },
          {
            icon: ScanLine,
            title: "Hardware-Free Phone Scanner",
            desc: "Volunteers open a secure PIN link in Safari or Chrome to scan attendee passes in under 0.3 seconds with audio confirmation.",
          },
          {
            icon: CreditCard,
            title: "0% Commission Software Model",
            desc: "Keep 100% of your ticket revenue. Organizers pay a predictable flat subscription with zero per-ticket deductions.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Your Event Online in 3 Minutes",
          description:
            "Skip the hassle of building a website. Create an event on URPASS and share your branded checkout link with the world.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Built for Indian Creators & Independent Hosts",
          subtitle: "Optimized for social media marketing, UPI payments, and Indian banking rails.",
          items: [
            {
              title: "Instagram Bio & WhatsApp Sharing",
              description:
                "Most Indian events sell tickets directly via social channels. Our pages load in <800ms on mobile data networks.",
              badge: "Social First",
            },
            {
              title: "Sub-5-Second UPI Checkout",
              description:
                "Support PhonePe, Google Pay, Paytm, and BHIM with one-tap mobile app switching and dynamic desktop QR codes.",
              badge: "UPI 2.0",
            },
            {
              title: "T+2 Direct Bank Deposits",
              description:
                "Ticket sales deposit directly into your Indian bank account on standard T+2 cycles, keeping event cash flow healthy.",
              badge: "Cashflow",
            },
            {
              title: "Automated GST Tax Invoices",
              description:
                "Capture corporate attendee GSTIN numbers and automatically issue compliant tax invoices with proper HSN/SAC codes.",
              badge: "Compliance",
            },
            {
              title: "Zero Web Hosting Fees",
              description:
                "Eliminate expensive web hosting, SSL certificates, and domain registration costs for one-off and recurring events.",
              badge: "Cost Savings",
            },
            {
              title: "₹0 Free Community Tier",
              description:
                "Host free community events up to 100 registrations per month at ₹0 forever with full QR passes included.",
              badge: "Free Tier",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "SPEED TO MARKET",
            title: "Why You Don't Need a Website to Sell Out Your Event",
            paragraphs: [
              "Many event organizers delay launching ticket sales by weeks because they believe they must first build a dedicated website, purchase a custom domain, and set up an e-commerce plugin. By the time the website is configured, valuable promotion time has been lost.",
              "In reality, modern event attendees discover events on social media (Instagram, LinkedIn, WhatsApp groups, Twitter) and make impulse purchasing decisions on their mobile phones. What converts attendees is not a bloated 10-page website, but a blazing-fast, mobile-optimized checkout page that clearly displays event dates, ticket tiers, and an instant UPI payment button.",
              "URPASS gives you this complete checkout flow in under 3 minutes. You fill out a simple form with your event details and ticket tiers, and URPASS generates a production-ready, SSL-secured public page that handles payments, issues digital QR passes, and tracks check-in analytics.",
            ],
            bullets: [
              "Launch ticket sales in minutes instead of spending weeks building a website",
              "Sub-second page load times maximize mobile social media conversion",
              "SSL security and responsive mobile layouts included out of the box",
              "Automated digital QR pass delivery saves hours of manual emailing",
            ],
            takeaway:
              "Hosted ticket checkout pages remove technical friction, letting organizers focus 100% of their energy on marketing and selling tickets.",
          },
          {
            badge: "ATTENDEE RETENTION",
            title: "Protecting Your Event Brand from Aggregator Noise",
            paragraphs: [
              "When you list an event on traditional public ticketing aggregators, your event page is surrounded by banner advertisements for competing concerts, festivals, and workshops. If an attendee decides not to buy right away, the aggregator retargets them with ads for competitor events.",
              "A dedicated hosted link on URPASS is 100% focused on your event. There are no competitor recommendations, no third-party advertisements, and no distractions. You maintain full ownership of your attendee email and phone numbers, allowing you to build a loyal community for future editions.",
            ],
            bullets: [
              "Zero competitor advertisements or distractors on your ticket page",
              "100% private attendee database with instant CSV data export",
              "Customizable brand colors, event logos, and banner graphics",
              "Direct attendee communication via automated email and WhatsApp alerts",
            ],
            takeaway:
              "Using a dedicated hosted checkout link keeps the focus entirely on your event and protects your attendee database from competitor retargeting.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Hosted Link vs. Traditional Ticketing Portals",
          subtitle: "Compare mobile conversion, competitor ads, ticket commissions, and pass delivery.",
          competitorName: "Public Aggregators (Eventbrite / Townscript)",
          sourceCitations: [
            "Official competitor commercial schedules",
            "URPASS benchmark metrics & hosted page specifications",
          ],
          rows: [
            {
              criteria: "Competitor Advertisements on Page",
              urpass: "Zero (100% dedicated to your event)",
              competitor: "Page cluttered with competing event ads",
              urpassAdvantage: true,
            },
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Fixed monthly software fee)",
              competitor: "4.0% to 7.9% deducted per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Mobile Checkout Speed (UPI)",
              urpass: "Under 5 seconds with native UPI app switch",
              competitor: "45–90s with multi-step card/VPA forms",
              urpassAdvantage: true,
            },
            {
              criteria: "Bank Settlement Timing",
              urpass: "Direct T+2 business day settlement via Razorpay",
              competitor: "Held until 7–14 days post-event",
              urpassAdvantage: true,
            },
            {
              criteria: "Door QR Check-In Speed",
              urpass: "< 0.3s camera scan on any volunteer phone",
              competitor: "3.5 to 5.0 seconds per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Privacy",
              urpass: "100% private organizer database",
              competitor: "Attendee data used for platform marketing",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "Creator & Influencer Meetups",
          "Independent Workshops & Masterclasses",
          "College Club Symposiums & Fests",
          "Founder Networking & Investor Mixers",
          "Pop-Up Dining & Culinary Experiences",
          "Fitness Bootcamps & Yoga Retreats",
          "Comedy Nights & Live Music Sessions",
          "Community Hackathons & Game Jams",
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
            title: "Event Ticket Booking System",
            href: "/event-ticket-booking-system",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Ticketing Software India",
            href: "/in",
            category: "Location",
          },
          {
            title: "Free Event Registration",
            href: "/free-event-registration",
            category: "Product",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: How to Send QR Tickets to Attendees",
            href: "/guides/how-to-send-qr-tickets-to-attendees",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Do I need to own a domain or have web design experience?",
            a: "No! URPASS generates a secure, hosted public event page for your event. You don't need a domain name, web hosting, or any coding knowledge. Just enter your event details, set ticket prices, and share your link.",
          },
          {
            q: "Where can I share my event ticket link?",
            a: "You can share your link anywhere: in your Instagram bio, WhatsApp group chats, LinkedIn updates, Twitter threads, or email newsletters. The page is mobile-responsive and loads in under a second.",
          },
          {
            q: "How do attendees pay for tickets on their phones?",
            a: "Attendees on mobile devices can complete payment in under 5 seconds using PhonePe, Google Pay, Paytm, or cards via Razorpay. Desktop users can scan a dynamic UPI QR code on their screens.",
          },
          {
            q: "How do attendees receive their tickets?",
            a: "Immediately upon payment confirmation, the attendee's personalized digital QR pass is displayed on screen and sent via email and WhatsApp. Attendees simply show this pass at the door for scanning.",
          },
          {
            q: "How do I scan tickets at the event entrance without special equipment?",
            a: "Open the URPASS scanner in Safari or Chrome on your smartphone. Scanning takes under 0.3 seconds with distinct confirmation audio and vibration cues. Multiple staff members can scan simultaneously using a secure PIN link.",
          },
          {
            q: "Is there a free plan if I am hosting a free event?",
            a: "Yes! The URPASS Free tier supports up to 2 events per month and 100 registrations per month at ₹0 forever with full QR passes and gate scanning included.",
          },
        ],

        ctaTitle: "Sell event tickets online in minutes",
        ctaDescription:
          "Hosted checkout link · 0% ticket commission · Instant UPI payments · Sub-second phone check-in",
      }}
    />
  );
}
