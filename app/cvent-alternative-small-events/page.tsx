import type { Metadata } from "next";
import { BarChart3, CheckCircle2, CreditCard, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Cvent Alternative for Small Events | UrPass",
  description: "Need a simpler event registration workflow? Compare Cvent and UrPass for registration, attendee tracking, pricing and event check-in.",
  keywords: ["cvent alternative small events","simpler cvent alternative","cvent alternative for mid sized events","cvent pricing alternative","affordable event management software like cvent","cvent alternative"],
  alternates: {
    canonical: "https://urpass.space/cvent-alternative-small-events",
  },
  openGraph: {
    title: "Cvent Alternative for Small Events | UrPass",
    description: "Need a simpler event registration workflow? Compare Cvent and UrPass for registration, attendee tracking, pricing and event check-in.",
    url: "https://urpass.space/cvent-alternative-small-events",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvent Alternative for Small Events | UrPass",
    description: "Need a simpler event registration workflow? Compare Cvent and UrPass for registration, attendee tracking, pricing and event check-in.",
  },
};

export default function CventAlternativeSmallEventsPage() {
  return (
    <SEOPage
      config={{
        badge: "CVENT ALTERNATIVE",
        h1: "A Simpler Cvent Alternative for Small Events",
        canonicalUrl: "https://urpass.space/cvent-alternative-small-events",
        description: "Need a simpler event registration workflow? Compare Cvent and UrPass for registration, attendee tracking, pricing and event check-in.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=cvent-alternative-small-events",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Replace Enterprise Complexity with Fast, Transparent Event Software",
        ctaDescription: "Skip 12-month lock-in contracts, mandatory sales demos, and five-figure enterprise fees. Launch your event in under 5 minutes.",
        directAnswer: {
        "title": "Why Seek a Cvent Alternative for Small to Mid-Sized Events?",
        "summary": "Cvent is engineered for massive enterprise corporations with dedicated procurement teams and six-figure budgets. For small to mid-sized events, Cvent's annual lock-in contracts, complex multi-month onboarding, mandatory sales demos, and per-registration fees create unnecessary expense and operational friction. UrPass offers transparent self-serve pricing, instant 5-minute setup, and browser-based phone check-in.",
        "keyPoints": [
                "Transparent flat subscription pricing starting from ₹29 intro offer / £15/mo vs Cvent multi-thousand-dollar contracts",
                "Instant self-serve event creation in under 5 minutes without mandatory sales demos",
                "Sub-0.3s smartphone camera check-in with zero expensive hardware terminal rentals",
                "0% platform commission on ticket sales with direct bank deposits via Stripe and Razorpay"
        ]
},
        whatIs: {
        "title": "Cvent vs UrPass: Understanding the Scale and Focus",
        "definition": "Cvent is a legacy enterprise event management software suite with hundreds of complex modules (RFP sourcing, hotel room block management, complex enterprise procurement). UrPass focuses squarely on what small, mid-sized, and fast-moving event teams actually need: high-converting registration, automated pass generation, instant payments, and rapid door check-in.",
        "details": [
                "Cvent requires mandatory annual contracts, sales quotes, and multi-week training sessions",
                "UrPass is 100% self-serve: sign up, build your event, and start selling tickets immediately",
                "Cvent charges platform fees per registration plus add-on costs for check-in apps",
                "UrPass includes unlimited smartphone check-in scanners and 0% ticket commission"
        ]
},
        keyFactsTable: {
        "title": "Cost & Complexity Comparison: Cvent vs UrPass",
        "subtitle": "Why small and mid-sized event producers prefer agile, self-service software.",
        "headers": [
                "Operational Factor",
                "Cvent Enterprise Platform",
                "UrPass Platform"
        ],
        "rows": [
                {
                        "col1": "Pricing & Contracts",
                        "col2": "Mandatory annual contracts costing £3,000 - £20,000+ ($5k - $30k+)",
                        "col3": "Flat monthly plans starting with ₹29 intro offer / £15/mo; cancel anytime"
                },
                {
                        "col1": "Onboarding Time",
                        "col2": "2 to 6 weeks with dedicated implementation consultants",
                        "col3": "5 minutes self-service; publish your registration page today"
                },
                {
                        "col1": "Check-In Equipment",
                        "col2": "Proprietary OnArrival scanner rentals and dedicated thermal printers",
                        "col3": "Sub-0.3s browser camera scanner using staff smartphones"
                },
                {
                        "col1": "Platform Commission",
                        "col2": "Registration processing cuts and add-on module charges",
                        "col3": "0% platform ticket fee; keep 100% of your ticket revenue"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "BUDGET & CONTRACTS",
                "title": "No Multi-Year Lock-In: Transparent, Predictable Flat SaaS",
                "paragraphs": [
                        "Event planners frequently cite Cvent's sales process as their biggest frustration: you cannot see pricing on their website, you must sit through multi-stage sales demonstrations, and you are pressured into signing 12-month or multi-year contracts regardless of how many events you actually produce.",
                        "UrPass provides radical pricing transparency. Our plans are listed publicly, starting with our introductory offer of ₹29/month for your first 2 months in India (£15/month in the UK). You pay flat, predictable subscription pricing with 0% platform ticket commissions and complete freedom to cancel whenever you choose."
                ],
                "bullets": [
                        "Zero annual lock-in contracts or surprise auto-renewals",
                        "Public, transparent pricing with no hidden implementation fees",
                        "Pay-as-you-go single-event options starting at ₹299 (UK: £5)",
                        "100% self-service sign up without gatekeeping sales reps"
                ],
                "takeaway": "Predictable SaaS pricing saves event producers thousands compared to legacy enterprise contracts."
        },
        {
                "badge": "USABILITY & SPEED",
                "title": "Launch in Minutes Instead of Weeks of Consultant Training",
                "paragraphs": [
                        "Cvent's interface is notoriously cumbersome, burdened by two decades of legacy code and enterprise feature bloat. Setting up a simple registration form often requires navigating dozen-level submenu hierarchies and consulting training manuals.",
                        "UrPass is designed with clean, modern product design. Our streamlined event builder guides you through event creation, ticket tier setup, and pass customization in minutes. Door volunteers require zero training—they simply scan an organizer QR code to activate their phone scanner and begin validating attendees immediately."
                ],
                "bullets": [
                        "Modern, intuitive interface with zero bloated enterprise complexity",
                        "Publish branded registration forms and ticket tiers in under 5 minutes",
                        "Door volunteers start scanning in 10 seconds without training sessions",
                        "Lightweight mobile web passes eliminate heavy attendee app downloads"
                ],
                "takeaway": "Agile, modern event software lets you focus on your event instead of learning complex software."
        }
],
        featuresTitle: "Key Comparison Advantages",
        featuresSubtitle: "Honest architectural comparisons built for discerning organizers.",
        features: [
          {
            icon: CheckCircle2,
            title: "100% Self-Service",
            desc: "Sign up and publish your event registration in under 5 minutes with no sales demos.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your gross ticket revenue. Connect Razorpay or Stripe directly.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Phone Scanning",
            desc: "Turn volunteer smartphones into high-speed entrance scanners with zero rental hardware.",
          },
          {
            icon: QrCode,
            title: "Branded Digital Passes",
            desc: "Issue scannable digital passes customized with your brand colors and Apple Wallet support.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Blocking",
            desc: "Prevent pass sharing across doors with database-level row locks.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Track real-time door counts, arrival velocity, and export attendance records anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Sign Up Self-Service",
                "desc": "Create your UrPass account in seconds without waiting for a sales representative."
        },
        {
                "n": "02",
                "title": "Configure Event",
                "desc": "Set up registration questions, ticket tiers, and capacity limits in under 5 minutes."
        },
        {
                "n": "03",
                "title": "Connect Direct Gateway",
                "desc": "Link Razorpay or Stripe to receive ticket funds directly into your verified bank account."
        },
        {
                "n": "04",
                "title": "Publish & Share",
                "desc": "Share your high-converting registration page across email, social media, and WhatsApp."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan attendee passes in <0.3s with smartphone cameras on event day."
        }
],
        whoShouldUse: {
        "title": "Who Replaces Cvent with UrPass?",
        "subtitle": "Event producers who want power and speed without six-figure enterprise contracts.",
        "personas": [
                {
                        "badge": "MID-MARKET",
                        "title": "B2B Conferences & Summits",
                        "desc": "Host 200 to 2,000 delegate conferences with executive badges, invoicing, and session check-in."
                },
                {
                        "badge": "TRAINING",
                        "title": "Corporate Training & Seminars",
                        "desc": "Manage multi-city corporate workshops and track mandatory employee attendance."
                },
                {
                        "badge": "ACADEMIA",
                        "title": "University & College Events",
                        "desc": "Run departmental symposiums and alumni reunions with student volunteer phone scanners."
                },
                {
                        "badge": "ASSOCIATIONS",
                        "title": "Professional Associations",
                        "desc": "Host regional member gatherings and annual banquets with zero annual software lock-in."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Smartphone Check-In Replaces Cvent OnArrival",
        "subtitle": "Sub-second validation without proprietary hardware terminals.",
        "description": "While Cvent OnArrival typically involves rented iPads, expensive plastic badge printers, and specialized docks, UrPass turns everyday personal smartphones into laser-fast scanners. Staff open the scanner URL in Safari or Chrome, point the camera at attendee passes, and validate entry in under 0.3 seconds.",
        "points": [
                "Zero equipment rental shipping costs or battery charging logistics.",
                "Audible green chime confirms valid admission in crowded venue halls.",
                "Atomic database locking blocks forwarded screenshots across multiple doors.",
                "Instant backup search by attendee name or email if a phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "Why is UrPass a better fit than Cvent for small and mid-sized events?",
                "a": "UrPass eliminates Cvent's mandatory sales calls, multi-thousand-dollar annual contracts, and complex weeks-long onboarding. With UrPass, you can sign up self-service, publish an event in 5 minutes, pay transparent monthly pricing, and check in attendees using standard smartphones."
        },
        {
                "q": "Does UrPass charge per-registration fees like Cvent?",
                "a": "No. UrPass charges 0% platform ticket commissions. You pay only our flat software subscription and standard payment gateway processing fees directly to Stripe or Razorpay."
        },
        {
                "q": "Can I use UrPass for multi-day conferences with breakout sessions?",
                "a": "Yes. UrPass supports multi-gate and session-level attendance tracking. You can station staff with phone scanners outside individual breakout halls to record session-specific attendance."
        },
        {
                "q": "Do I need to rent dedicated barcode scanners or iPads?",
                "a": "No. UrPass scanner operates entirely within standard mobile web browsers (Safari and Chrome) on staff and volunteer smartphones, eliminating all hardware rental and shipping costs."
        },
        {
                "q": "Can I cancel my UrPass subscription after my event concludes?",
                "a": "Yes. Unlike Cvent which locks you into annual contracts, UrPass plans are billed monthly and can be canceled anytime from your account settings without penalties."
        }
],
      }}
    />
  );
}
