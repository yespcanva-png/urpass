import type { Metadata } from "next";
import {
  MapPin,
  QrCode,
  Users,
  ScanLine,
  Ticket,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  Building2,
  Send,
  Sliders,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software in India — UPI, 0% Fee & QR Passes | UrPass",
  description:
    "India's event registration platform. Instant UPI payments (GPay, PhonePe), direct Razorpay integration, 0% ticket fees, digital QR passes, WhatsApp delivery, and GST invoices.",
  keywords: [
    "event registration software in india",
    "event registration platform india",
    "online event registration india",
    "college fest registration software india",
    "upi event registration",
    "razorpay event ticketing",
    "conference registration platform india",
    "free event registration software india",
  ],
  alternates: {
    canonical: "https://urpass.space/in/event-registration-software",
  },
  openGraph: {
    title: "Event Registration Software in India — UPI, 0% Fee & QR Passes | UrPass",
    description:
      "Modernize event registrations across India with custom forms, instant UPI payments, automated WhatsApp QR passes, and sub-0.3s gate check-in.",
    url: "https://urpass.space/in/event-registration-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration Software in India | UrPass",
    description:
      "India-first event registration with instant UPI checkout, zero ticket commission, and mobile phone QR scanning.",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventRegistrationSoftwareIndiaPage() {
  return (
    <SEOPage
      config={{
        badge: "INDIA REGIONAL // EVENT REGISTRATION",
        h1: "Event Registration Software Built for Indian Event Organizers",
        canonicalUrl: "https://urpass.space/in/event-registration-software",
        description:
          "Accept attendee registrations across India with instant UPI checkout, zero ticket commissions, automated WhatsApp QR passes, and sub-0.3-second mobile phone check-in.",
        ctaLabel: "Start Free in India",
        ctaHref: "/signup",
        secondaryCtaLabel: "View INR Pricing",
        secondaryCtaHref: "/pricing",

        // Local Geo Configuration
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
          title: "What Makes UrPass the Best Event Registration Software in India?",
          summary:
            "UrPass is tailored specifically for the Indian event ecosystem, addressing the unique challenges faced by college fest committees, tech conference producers, and corporate planners. It replaces chaotic Google Forms and manual UPI screenshot verification with native Razorpay integration (supporting Google Pay, PhonePe, Paytm, and BHIM), 0% ticket commissions, automated WhatsApp QR pass dispatch, B2B GST tax invoice generation, and lightning-fast smartphone camera check-in at the entrance.",
          keyPoints: [
            "Direct UPI & Razorpay payments with 0% platform commission (keep 100% of ticket sales)",
            "Predictable flat INR pricing starting at ₹499/month, with a ₹0 free tier for up to 50 attendees",
            "Instant pass delivery via WhatsApp and transactional email with Apple Wallet sync",
            "Automatic GST invoice generation and tax-compliant transaction ledgers for Indian B2B clients",
            "Sub-0.3s camera check-in on volunteers' personal smartphones with atomic duplicate locking",
          ],
        },

        whatIs: {
          title: "The Reality of Event Management in India",
          definition:
            "Indian event organizers face unique operational hurdles: attendees expect instant UPI checkouts, international platforms charge high currency-conversion fees, college fests attract massive crowds that overwhelm entrance gates, and attendees routinely share ticket screenshots with friends. UrPass was designed from the ground up to solve these exact local pain points.",
          details: [
            "Stops the manual nightmare of verifying UPI transaction IDs and payment screenshots manually",
            "Eliminates expensive international credit card gateway deductions and delayed payouts",
            "Prevents crowd stampedes and gate breaches at college fests with sub-second QR validation",
          ],
        },

        // India Highlights
        indiaHighlights: {
          title: "Engineered for India's Digital Payment & Mobile Infrastructure",
          subtitle: "Zero friction for Indian attendees, maximum control for Indian organizers.",
          items: [
            {
              title: "Instant UPI & QR Payments",
              description:
                "Support Google Pay, PhonePe, Paytm, BHIM, and all UPI apps. Attendees pay in two taps without entering 16-digit card numbers.",
              badge: "UPI First",
            },
            {
              title: "0% Commission & Direct Payouts",
              description:
                "Connect your own Razorpay merchant account. All revenues route directly to your Indian bank account on your standard T+2 settlement schedule.",
              badge: "0% Fee",
            },
            {
              title: "Automated GST Tax Invoicing",
              description:
                "Collect company GSTIN numbers and generate compliant tax invoices automatically for corporate delegates and sponsors.",
              badge: "GST Ready",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Deliver digital QR passes directly to Indian attendees' WhatsApp with location pins, schedule reminders, and entry instructions.",
              badge: "WhatsApp",
            },
          ],
        },

        keyFactsTable: {
          title: "UrPass India vs. Google Forms + Manual UPI vs. BookMyShow / Townscript",
          subtitle: "How modern India-focused event software compares to legacy workflows.",
          headers: ["Feature / Metric", "UrPass Platform", "Google Forms + Manual UPI", "BookMyShow / Townscript"],
          rows: [
            {
              col1: "Platform Ticketing Fee",
              col2: "0% per ticket (Flat ₹499/mo plan)",
              col3: "0% (but hours of manual labor)",
              col4: "5%–10% per ticket + buyer fees",
            },
            {
              col1: "Payment Verification",
              col2: "Instant automated webhook reconciliation",
              col3: "Manual matching of UTR/UPI screenshots",
              col4: "Automated with high fee deductions",
            },
            {
              col1: "Credential Issuance",
              col2: "Instant WhatsApp & Apple Wallet QR pass",
              col3: "None (must email or WhatsApp manually)",
              col4: "App ticket or PDF receipt",
            },
            {
              col1: "Gate Check-In Speed",
              col2: "Sub-0.28s mobile phone camera scan",
              col3: "Manual pen ticks on paper sheets",
              col4: "App scanner or rented hardware",
            },
            {
              col1: "Duplicate Screenshot Prevention",
              col2: "Atomic cloud lock with instant alarm",
              col3: "Zero protection against screenshot sharing",
              col4: "Supported via organizer app",
            },
          ],
        },

        featuresTitle: "Complete Event Registration Suite for India",
        featuresSubtitle: "Everything Indian event coordinators require to run seamless operations.",
        features: [
          {
            icon: CreditCard,
            title: "Direct Razorpay Integration",
            desc: "Accept UPI, credit cards, debit cards, and Netbanking. Payouts arrive directly in your Indian bank account.",
          },
          {
            icon: Send,
            title: "WhatsApp Ticket Dispatch",
            desc: "Send scannable QR passes straight to attendees' WhatsApp accounts, achieving 98%+ delivery and open rates.",
          },
          {
            icon: Building2,
            title: "B2B GST Invoicing",
            desc: "Generate professional, GST-compliant tax invoices for corporate sponsors and registered delegates automatically.",
          },
          {
            icon: QrCode,
            title: "Sub-0.3s Phone Camera Scanning",
            desc: "Gate staff scan QR passes using Safari or Chrome on their smartphones. No rented barcode scanners needed.",
          },
          {
            icon: ShieldCheck,
            title: "Screenshot Fraud Protection",
            desc: "Single-use cryptographic tokens lock instantly upon first scan, blocking forwarded screenshots at college gates.",
          },
          {
            icon: Users,
            title: "Approval Screening Queues",
            desc: "Review college student IDs or corporate applications before approving registration and issuing passes.",
          },
        ],

        howItWorksTitle: "How Event Registration in India Works with UrPass",
        howItWorksSubtitle: "Four simple stages tailored to Indian event logistics.",
        steps: [
          { n: "01", title: "Create INR Event", desc: "Set event details, custom registration questions, and configure free or paid INR ticket tiers." },
          { n: "02", title: "Share Registration Link", desc: "Distribute your event URL via WhatsApp groups, Instagram, college notice boards, and LinkedIn." },
          { n: "03", title: "Instant UPI Pass Dispatch", desc: "Attendees pay via UPI and immediately receive their digital QR pass on WhatsApp and email." },
          { n: "04", title: "Scan at the Entrance", desc: "Volunteers scan guest QR passes on standard smartphones, validating admissions in under 0.3 seconds." },
        ],

        deepDiveSections: [
          {
            badge: "COLLEGE FEST OPERATIONS",
            title: "How Indian Engineering Colleges Eliminated Gate Stampedes with Phone QR Scanning",
            paragraphs: [
              "Annual college cultural and tech fests in India (such as Mood Indigo, Saarang, and Rendezvous) often attract 5,000 to 20,000 students. Traditional entry methods—like paper gate lists or generic wristbands—inevitably cause massive crowd crushes at the campus gates.",
              "With UrPass, college fest committees deploy 10 to 15 student volunteers equipped with their own smartphones. As students arrive, volunteers scan their digital WhatsApp QR passes in under 300 milliseconds. Over 1,000 students are admitted every 15 minutes across multiple campus gates with zero line congestion, zero fake passes, and zero equipment rental costs.",
            ],
            bullets: [
              "Works reliably even during mobile network congestion via smart offline scanner caching",
              "Instant verification of student roll numbers and college affiliations",
              "Audio alerts and visual green indicators keep entrance lines moving continuously",
            ],
            takeaway: "Sub-second camera scanning keeps college campuses safe and crowd-controlled.",
          },
        ],

        whoShouldUse: {
          title: "Serving Indian Organizers Across Sectors",
          subtitle: "Trusted from major metropolitan hubs to tier-2 campus cities.",
          personas: [
            {
              title: "College & University Fest Teams",
              desc: "Manage cultural fests, tech symposiums, sports meets, and celebrity concerts across IITs, NITs, and universities.",
              badge: "Academia",
            },
            {
              title: "Tech Conferences & Startup Summits",
              desc: "Host developer hackathons, AI summits, and venture pitch events in Bengaluru, Hyderabad, and Delhi NCR.",
              badge: "Tech & Startups",
            },
            {
              title: "Corporate HR & Annual Gatherings",
              desc: "Coordinate employee family days, leadership offsites, and internal town halls with verified attendance.",
              badge: "Corporate",
            },
            {
              title: "Independent Workshop Trainers",
              desc: "Run paid photography, coding, and culinary workshops with instant UPI payments and 0% ticketing commission.",
              badge: "Workshops",
            },
          ],
        },

        faqs: [
          {
            q: "Can attendees pay using Google Pay or PhonePe?",
            a: "Yes. Through our direct Razorpay integration, attendees can complete payment using any UPI app including Google Pay, PhonePe, Paytm, CRED, and BHIM.",
          },
          {
            q: "Does UrPass deduct a commission from Indian ticket sales?",
            a: "No. UrPass charges 0% platform commission on ticket sales. You only pay standard Razorpay processing fees and your flat UrPass monthly subscription (or ₹0 on the free tier).",
          },
          {
            q: "Can we generate GST-compliant invoices for registered attendees?",
            a: "Yes. Attendees can enter their company name and GSTIN number during checkout, and UrPass generates an automated GST-compliant tax invoice.",
          },
          {
            q: "Do college student volunteers need special barcode scanners to check in attendees?",
            a: "No. Volunteers simply open a private scanner link on their personal Android or iOS smartphones in Safari or Chrome and start scanning passes immediately.",
          },
        ],

        relatedLinks: [
          { title: "Event Ticketing Software in India", href: "/in/event-ticketing-software", category: "Location" },
          { title: "Best Event Registration Software", href: "/solutions/event-registration-software", category: "Product" },
          { title: "Events in Bengaluru", href: "/in/bangalore", category: "Location" },
          { title: "Events in Chennai", href: "/in/chennai", category: "Location" },
          { title: "Events in Mumbai", href: "/in/mumbai", category: "Location" },
          { title: "Events in Delhi NCR", href: "/in/delhi", category: "Location" },
        ],
      }}
    />
  );
}
