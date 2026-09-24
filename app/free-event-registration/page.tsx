import type { Metadata } from "next";
import {
  Gift,
  ClipboardList,
  QrCode,
  ScanLine,
  BarChart3,
  Zap,
  CheckCircle2,
  Users,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Registration & QR Check-In Software — URPASS",
  description:
    "100% free event registration software. Host up to 2 events and 100 registrations per month at ₹0 forever. Digital QR passes, custom forms, and sub-second phone scanning included with no credit card required.",
  keywords: [
    "free event registration software",
    "free online event registration",
    "free qr code event pass generator",
    "free event check in app",
    "free event ticketing platform",
    "non profit event registration",
    "free college event registration",
  ],
  alternates: { canonical: "https://urpass.space/free-event-registration" },
  openGraph: {
    title: "Free Event Registration & QR Check-In Software | URPASS",
    description:
      "Run complete events at zero cost. Free custom registration forms, automated digital QR passes, and in-browser phone scanning. No credit card required.",
    url: "https://urpass.space/free-event-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function FreeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/free-event-registration",
        badge: "PERMANENTLY FREE TIER",
        h1: "Free Event Registration Software with Digital QR Passes",
        description:
          "Create branded registration forms, issue tamper-proof digital QR passes, and check in attendees at venue doors with any phone camera—100% free with no credit card required.",
        ctaLabel: "Create free event now",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "Is There Truly Free Event Registration Software?",
          summary:
            "Yes. URPASS offers a permanently free event registration plan designed for community organizers, student clubs, and small workshops. Unlike time-limited free trials or platforms that surprise you with per-attendee fees, the URPASS Free tier provides full access to custom registration forms, automated digital QR pass issuance, and in-browser smartphone gate check-ins for up to 2 events per month and 100 registrations per month at ₹0 forever.",
          keyPoints: [
            "Permanently free tier: 2 events/month and up to 100 registrations/month at ₹0 forever",
            "Zero credit card required to sign up, configure events, and launch registrations",
            "Automated digital QR passes generated and delivered to attendees immediately",
            "Full in-browser smartphone scanner (<0.3s) with audio chimes and haptic cues included",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Free Plan Capabilities vs. Industry 'Free Trials'",
          subtitle: "How the URPASS permanent free tier compares to competitor trial tricks and restrictive limits.",
          headers: ["Feature / Capability", "URPASS Permanent Free Tier", "Competitor 'Free' Tiers (Eventbrite / etc.)"],
          rows: [
            {
              col1: "Duration & Expiration",
              col2: "Free Forever (No trial expiration date)",
              col3: "14-day trial or forces paid subscription on next event",
            },
            {
              col1: "Credit Card Requirement",
              col2: "None (Zero payment info needed to create and publish)",
              col3: "Mandatory credit card required at registration",
            },
            {
              col1: "Included Registrations",
              col2: "Up to 100 registrations per month at ₹0",
              col3: "Limited to 25 free tickets before steep per-ticket charges",
            },
            {
              col1: "Digital QR Passes Included",
              col2: "Yes (Personalized mobile web QR passes with anti-fraud)",
              col3: "Basic unbranded PDF email receipts",
            },
            {
              col1: "Entrance Gate Scanner",
              col2: "In-browser phone camera scanner (<0.3s validation)",
              col3: "Requires downloading separate scanner app or manual paper lists",
            },
            {
              col1: "Custom Registration Fields",
              col2: "Full custom field support (text, dropdowns, college ID)",
              col3: "Restricted to basic Name and Email only",
            },
            {
              col1: "Upgrade Flexibility",
              col2: "Upgrade to Starter (₹499/mo) or Pro anytime with 30-day free trial",
              col3: "Aggressive recurring annual lock-ins",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Gift,
            title: "Permanently Free Tier",
            desc: "Not a 14-day trial. The Free plan is available indefinitely with 2 events per month and up to 100 registrations per month.",
          },
          {
            icon: ClipboardList,
            title: "Custom Registration Forms",
            desc: "Collect attendee names, emails, phone numbers, college roll numbers, and custom survey questions at zero cost.",
          },
          {
            icon: QrCode,
            title: "Automated Digital QR Passes",
            desc: "Every registered or approved attendee receives a unique digital pass immediately via mobile link, with zero PDF printing required.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Phone Gate Scanner",
            desc: "Volunteers open a secure PIN link in Safari or Chrome to scan attendee passes in under 0.3 seconds with audio confirmation.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Entry Protection",
            desc: "Atomic database verification blocks duplicate pass usage or screenshot sharing across entrance gates automatically.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Attendance Stats",
            desc: "Track live check-in rates, registration curves, and arrival percentages directly from your free organizer dashboard.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Full Operational Power at Zero Cost",
          description:
            "From student club symposiums to community open mic nights, URPASS free tier gives you professional event software without spending a single rupee.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Ideal for Indian Student Clubs & Community Hosts",
          subtitle: "Designed to support non-profit meetups, college departmental events, and creator gatherings.",
          items: [
            {
              title: "Zero Budget Campus Events",
              description:
                "College departmental clubs (IEEE, CSI, Rotaract) can manage events up to 100 students completely free.",
              badge: "Colleges",
            },
            {
              title: "No Credit Card Barrier",
              description:
                "Most Indian students do not own international credit cards. URPASS requires zero payment info to launch.",
              badge: "No Card Needed",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Deliver digital QR entry passes directly to attendees' WhatsApp accounts for effortless gate retrieval.",
              badge: "WhatsApp",
            },
            {
              title: "Rapid 5-Minute Setup",
              description:
                "Create an event, configure form questions, and publish your shareable registration link in under 5 minutes flat.",
              badge: "Instant Setup",
            },
            {
              title: "Hardware-Free Scanning",
              description:
                "Gate volunteers use their personal Android or iPhone browsers to scan passes with zero app installations.",
              badge: "Zero Install",
            },
            {
              title: "Transparent Upgrade Path",
              description:
                "When your event outgrows 100 attendees, upgrade affordably to Starter (₹499/mo) with a 30-day free trial.",
              badge: "Affordable",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "COMMUNITY FIRST",
            title: "Why Event Software Shouldn't Penalize Non-Profit & Free Events",
            paragraphs: [
              "Many event ticketing platforms claim to be 'free for free events,' but impose severe restrictions: they cap attendees at 25 people, plaster registration pages with distracting advertisements, or harvest attendee email addresses to market competing paid events.",
              "Other platforms force organizers to enter a credit card for a 14-day trial, automatically billing them hundreds of dollars if they forget to cancel. For student organizers, non-profit community leaders, and independent creators running free workshops, these practices create needless financial anxiety.",
              "URPASS believes every event deserves professional access control. Our Free plan provides the complete core flow—custom forms, atomic capacity holds, digital QR passes, and sub-second phone scanning—for 2 events per month and 100 registrations per month at ₹0 forever, with no credit card required.",
            ],
            bullets: [
              "No credit card required to sign up or publish events",
              "Zero third-party advertisements or competitor promotions",
              "100% private attendee database with instant CSV export",
              "Permanent access: use it every month without paying a single rupee",
            ],
            takeaway:
              "A truly free tier gives community organizers professional event technology without hidden fees, sneaky card charges, or data compromises.",
          },
          {
            badge: "ELEVATING GATE FLOW",
            title: "Replacing the Paper Guest List at Community Meetups",
            paragraphs: [
              "Even at small community meetups with 50 to 80 attendees, checking people in using a paper guest list or Google Sheet on a laptop is clumsy. Attendees queue up in a cramped doorway while a volunteer squints at a spreadsheet and asks each person to spell their name.",
              "With URPASS, every registrant receives a mobile QR pass. The meetup organizer opens the scanner URL in mobile Safari or Chrome. In under 0.3 seconds per attendee, the camera decodes the pass, sounds a cheerful confirmation chime, and vibrates to confirm arrival. What used to be an awkward entrance bottleneck becomes a slick, professional check-in experience.",
            ],
            bullets: [
              "In-browser optical scanner runs on any smartphone browser",
              "Validates passes in under 0.3s with instant audio and haptic feedback",
              "Eliminates printed paper waste and lost clipboard checklists",
              "Gives first-time attendees a modern, tech-forward first impression",
            ],
            takeaway:
              "Switching from paper guestlists to digital QR passes elevates the professional image of your meetup and eliminates doorway queues.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Free Tier vs. Competitor 'Free' Offerings",
          subtitle: "Compare attendee caps, credit card requirements, scanner access, and pass issuance.",
          competitorName: "Traditional Aggregators (Eventbrite Free / etc.)",
          sourceCitations: [
            "Official competitor pricing documentation",
            "URPASS live plan specifications (lib/plan.ts)",
          ],
          rows: [
            {
              criteria: "Credit Card Required to Sign Up",
              urpass: "None (Zero payment info required)",
              competitor: "Frequently required for trials",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Attendee Quota",
              urpass: "Up to 100 registrations per month free forever",
              competitor: "Capped at 25 tickets per event",
              urpassAdvantage: true,
            },
            {
              criteria: "Digital QR Pass Issuance",
              urpass: "Automated mobile web pass with dynamic QR",
              competitor: "Generic plain text receipt or basic PDF",
              urpassAdvantage: true,
            },
            {
              criteria: "In-Browser Phone Scanner",
              urpass: "Included free (<0.3s validation with audio/haptics)",
              competitor: "Separate app store download required",
              urpassAdvantage: true,
            },
            {
              criteria: "Platform Ads on Registration Page",
              urpass: "Zero ads (100% focused on your event)",
              competitor: "Heavily cluttered with competitor event ads",
              urpassAdvantage: true,
            },
            {
              criteria: "Trial Expiration",
              urpass: "Permanent ₹0 Free tier with no expiration",
              competitor: "14-day trial or sudden paywall prompts",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Departmental Symposiums & Club Meets",
          "Open Source & Developer Community Meetups",
          "Non-Profit Workshops & Charity Seminars",
          "Local Hackathons & Game Jams",
          "Book Clubs & Creative Writing Circles",
          "Fitness Bootcamps & Community Yoga Sessions",
          "Founder Coffee Mixers & Pitch Practice",
          "Alumni Chapter Reunions & Campus Mixers",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Registration Software (Master Pillar)",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Online Event Registration System",
            href: "/online-event-registration-system",
            category: "Product",
          },
          {
            title: "College Event Registration System",
            href: "/college-events",
            category: "Use Case",
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
            title: "Compare: Google Forms vs URPASS",
            href: "/compare/google-forms-vs-urpass",
            category: "Comparison",
          },
          {
            title: "Guide: Create Free Event Tickets Online",
            href: "/guides/how-to-create-free-event-tickets-online",
            category: "Guide",
          },
          {
            title: "Guide: Best Way to Check Attendees In",
            href: "/guides/best-way-to-check-attendees-into-an-event",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Is URPASS really free, or is it a trial?",
            a: "The URPASS Free tier is permanent, not a 14-day trial! You can host up to 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required.",
          },
          {
            q: "What features are included in the Free tier?",
            a: "The Free plan includes custom registration forms, automated digital QR pass generation, sub-second in-browser camera gate scanning, audio and haptic feedback, anti-duplicate entry protection, and real-time attendance analytics.",
          },
          {
            q: "Do I need to enter credit card details to sign up?",
            a: "No! You can create your account, configure your event, publish your registration page, and scan attendees at the door without ever entering credit card or payment information.",
          },
          {
            q: "What happens if my event needs more than 100 registrations?",
            a: "If your event grows beyond 100 attendees, you can easily upgrade to our Starter plan (₹499/mo for up to 500 registrations) or Pro plan (₹999/mo for up to 2,500 registrations). All paid plans include a 30-day free trial.",
          },
          {
            q: "Can I collect custom questions on the free registration form?",
            a: "Yes! You can add custom questions for College Name, Roll Number, Department, T-shirt size, dietary preferences, or portfolio links directly in your event form settings.",
          },
          {
            q: "Can volunteers scan passes without downloading an app?",
            a: "Yes! Volunteers simply open a secure PIN scanner link in Safari or Chrome on their smartphones. Camera scanning decodes QR passes in under 0.3 seconds with distinct confirmation audio chimes and haptic vibrations.",
          },
        ],

        ctaTitle: "Create your free event in 5 minutes",
        ctaDescription:
          "₹0 forever · No credit card required · Digital QR passes · Sub-second phone scanning",
      }}
    />
  );
}
