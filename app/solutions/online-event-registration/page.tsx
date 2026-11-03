import type { Metadata } from "next";
import {
  Globe,
  ClipboardCheck,
  QrCode,
  CreditCard,
  Users,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Registration Platform — Seamless Attendee Signup | UrPass",
  description:
    "Accept online registrations with zero attendee friction. Mobile-optimized signup forms, instant QR pass generation, automated approvals, and real-time door sync.",
  keywords: [
    "online event registration platform",
    "online event signup system",
    "digital event registration software",
    "event registration online",
    "web event registration system",
    "online attendee registration platform",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/online-event-registration",
  },
  openGraph: {
    title: "Online Event Registration Platform — Seamless Attendee Signup | UrPass",
    description:
      "Modernize online attendee signups with mobile-optimized forms, zero-login registration, instant QR passes, and live entrance check-in.",
    url: "https://urpass.space/solutions/online-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Event Registration Platform | UrPass",
    description:
      "Frictionless online event signup for hackathons, conferences, webinars, and cultural fests.",
  },
};

export default function OnlineEventRegistrationSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // ONLINE REGISTRATION",
        h1: "Online Event Registration Platform Built for High-Conversion Signups",
        canonicalUrl: "https://urpass.space/solutions/online-event-registration",
        description:
          "Launch mobile-first online registration pages in minutes. Collect custom responses, process instant payments or approvals, and issue digital passes directly to attendees' phones.",
        ctaLabel: "Launch Your Online Registration",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore All Features",
        secondaryCtaHref: "/features",

        // GEO Direct Answer
        directAnswer: {
          title: "How Does an Online Event Registration Platform Work?",
          summary:
            "An online event registration platform provides a web-accessible registration portal where prospective attendees review event schedules, submit required information, make optional ticket payments, and receive verified digital entry passes. UrPass streamlines this flow into an under-45-second experience with no account registration required for attendees, while giving organizers centralized control over quotas, approvals, and day-of-event check-ins.",
          keyPoints: [
            "Zero account creation barrier: attendees register in seconds without passwords",
            "Multi-channel pass dispatch via automated email and WhatsApp alerts",
            "Dynamic ticket tier allocations with automatic countdown and sellout states",
            "Direct integration with Razorpay (UPI, cards) and Stripe with zero platform commission",
            "Instant synchronization with the organizer entrance check-in portal",
          ],
        },

        whatIs: {
          title: "What Sets Modern Online Event Registration Apart?",
          definition:
            "Modern online event registration platforms replace static questionnaires with interactive, conversion-optimized guest portals. Instead of dumping responses into disconnected spreadsheets, modern platforms validate submitted data in real time, apply capacity logic, trigger payment gateways, and output cryptographic QR credentials that are immediately recognizable at the venue gate.",
          details: [
            "Eliminates drop-off caused by mandatory account signups or lengthy checkout forms",
            "Ensures data privacy and compliance under GDPR and Indian DPDP guidelines",
            "Centralizes attendee communication from initial signup to post-event survey",
          ],
        },

        keyFactsTable: {
          title: "UrPass Online Registration vs. Traditional Registration Methods",
          subtitle: "How dedicated digital event registration outclasses manual and generic setups.",
          headers: ["Feature / Metric", "UrPass Platform", "Generic Web Forms", "Legacy Ticketing Hubs"],
          rows: [
            {
              col1: "Registration Completion Time",
              col2: "Under 45 seconds (mobile optimized)",
              col3: "2–4 minutes (often clunky on mobile)",
              col4: "3–6 minutes (requires account setup)",
            },
            {
              col1: "Credential Issuance",
              col2: "Instant dynamic QR pass with Apple Wallet sync",
              col3: "Confirmation email text only (no scannable code)",
              col4: "PDF attachment or proprietary app login",
            },
            {
              col1: "Ticketing Fee Overhead",
              col2: "0% platform commission on ticket sales",
              col3: "N/A (no built-in payment collection)",
              col4: "3%–7% platform fee + convenience charges",
            },
            {
              col1: "Capacity Management",
              col2: "Automated real-time inventory locking",
              col3: "Manual form disabling (risk of overbooking)",
              col4: "Automated with per-ticket fees",
            },
            {
              col1: "Attendee Contact Retargeting",
              col2: "100% private to organizer (zero competitor ads)",
              col3: "Private but unorganized",
              col4: "Marketplace retargets your attendees with rival events",
            },
          ],
        },

        featuresTitle: "Core Capabilities for High-Volume Online Signups",
        featuresSubtitle: "Everything you need to launch, scale, and manage online event attendance.",
        features: [
          {
            icon: Globe,
            title: "Mobile-First Registration Pages",
            desc: "Flawless rendering on smartphones, tablets, and laptops. Fast load times guarantee minimum drop-offs during peak registration rushes.",
          },
          {
            icon: Zap,
            title: "Zero-Login Checkout Flow",
            desc: "Attendees don't need to create accounts, remember passwords, or download apps to reserve passes or purchase tickets.",
          },
          {
            icon: CreditCard,
            title: "Direct Gateway Payouts",
            desc: "Accept payments via UPI, Google Pay, PhonePe, credit/debit cards, and Netbanking. Funds transfer straight into your merchant account.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Pass Delivery",
            desc: "Attendees receive their pass via responsive web link, email, and WhatsApp message, with native 1-click addition to Apple Wallet.",
          },
          {
            icon: Users,
            title: "Group & Bulk Registrations",
            desc: "Allow team leads, corporate HR, or student club heads to register multiple participants in a single transaction with unique named passes.",
          },
          {
            icon: ShieldCheck,
            title: "Vetting & Approval Controls",
            desc: "Set events to 'Approval Required' to screen applicants before issuing entry passes. Ideal for VIP meets, hackathons, and invite-only sessions.",
          },
        ],

        howItWorksTitle: "How Online Event Registration Works with UrPass",
        howItWorksSubtitle: "Four simple stages from page creation to verified arrival.",
        steps: [
          { n: "01", title: "Configure Event Page", desc: "Add banner images, dates, venue or virtual links, ticket types, and required questions." },
          { n: "02", title: "Distribute Public Link", desc: "Share your dedicated event URL via marketing campaigns, LinkedIn, WhatsApp groups, and QR posters." },
          { n: "03", title: "Automate Pass Dispatch", desc: "Approved registrants instantly receive their scannable digital QR pass with event instructions." },
          { n: "04", title: "Scan at the Entrance", desc: "Check guests in on arrival using any mobile phone camera, automatically updating attendance lists." },
        ],

        deepDiveSections: [
          {
            badge: "CONVERSION OPTIMIZATION",
            title: "Why Frictionless Registration Pages Generate 34% Higher Turnout",
            paragraphs: [
              "Every extra step in an online registration flow causes prospective attendees to abandon the process. Research indicates that forcing attendees to create accounts with passwords before registering results in over 30% drop-off.",
              "UrPass eliminates this friction entirely. Our streamlined checkout captures only necessary information, supports 1-click auto-fill, and completes registration in seconds. Furthermore, by immediately delivering passes to WhatsApp and Apple Wallet, attendees keep their credentials readily accessible on their home screen.",
            ],
            bullets: [
              "Friction-free guest checkout maximizes signup completion rates",
              "Immediate multi-channel delivery guarantees attendees find their pass on event day",
              "Integrated Google Maps location pins and calendar sync prevent attendee confusion",
            ],
            takeaway: "Eliminating sign-in barriers is the single most effective way to increase event registrations.",
          },
        ],

        whoShouldUse: {
          title: "Engineered for Every Online Registration Need",
          subtitle: "Trusted by event professionals across industries.",
          personas: [
            {
              title: "Tech Conferences & Summits",
              desc: "Sell multi-tier passes, sponsor tickets, and workshop add-ons with automated GST receipts.",
              badge: "Tech & B2B",
            },
            {
              title: "College Fests & Hackathons",
              desc: "Collect college IDs, project links, team rosters, and track inter-college participants.",
              badge: "Colleges",
            },
            {
              title: "Professional Workshops & Webinars",
              desc: "Limit class sizes, accept instant UPI payments, and distribute join credentials securely.",
              badge: "Education",
            },
            {
              title: "Community Meetups & Sports Runs",
              desc: "Manage RSVPs, waiver acknowledgments, and emergency contact details seamlessly.",
              badge: "Communities",
            },
          ],
        },

        faqs: [
          {
            q: "Can I embed the registration form on my own website?",
            a: "Yes. You can link directly to your custom-branded UrPass event page or embed the registration widget into your existing website, blog, or landing page.",
          },
          {
            q: "Does UrPass hold my registration ticket revenue?",
            a: "No. UrPass integrates directly with your own Razorpay or Stripe account. All ticket revenues are paid out directly to your bank account without intermediary escrow delays.",
          },
          {
            q: "What happens when an event reaches maximum capacity?",
            a: "UrPass automatically marks the registration tiers as 'Sold Out' or 'Capacity Reached' the exact second the quota is filled, completely preventing accidental overbooking.",
          },
          {
            q: "Can attendees update their information after registering?",
            a: "Organizers can edit attendee responses, change ticket categories, or reassign passes to different names directly from the administrative dashboard.",
          },
        ],

        relatedLinks: [
          { title: "Best Event Registration Software", href: "/solutions/event-registration-software", category: "Product" },
          { title: "QR Code Event Ticketing Software", href: "/solutions/qr-code-ticketing", category: "Product" },
          { title: "Event Registration Form Builder", href: "/solutions/event-registration-form-builder", category: "Product" },
          { title: "UrPass Pricing & Free Plan", href: "/pricing", category: "Guide" },
        ],
      }}
    />
  );
}
