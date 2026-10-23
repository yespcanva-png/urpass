import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Whova Alternative for Check-In | UrPass",
  description: "Compare Whova and UrPass for event registration, QR passes, delegate management and on-site check-in. Find the right event workflow.",
  keywords: ["whova alternative qr check in","whova alternative","whova check in alternative","event registration like whova","whova vs urpass","affordable conference check in software"],
  alternates: {
    canonical: "https://urpass.space/whova-alternative-qr-check-in",
  },
  openGraph: {
    title: "Whova Alternative for Check-In | UrPass",
    description: "Compare Whova and UrPass for event registration, QR passes, delegate management and on-site check-in. Find the right event workflow.",
    url: "https://urpass.space/whova-alternative-qr-check-in",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whova Alternative for Check-In | UrPass",
    description: "Compare Whova and UrPass for event registration, QR passes, delegate management and on-site check-in. Find the right event workflow.",
  },
};

export default function WhovaAlternativeQrCheckInPage() {
  return (
    <SEOPage
      config={{
        badge: "WHOVA ALTERNATIVE",
        h1: "Whova Alternative for QR Registration and Check-In",
        canonicalUrl: "https://urpass.space/whova-alternative-qr-check-in",
        description: "Compare Whova and UrPass for event registration, QR passes, delegate management and on-site check-in. Find the right event workflow.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=whova-alternative-qr-check-in",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Event Check-In Without Forcing Attendees to Download Apps",
        ctaDescription: "Get high-speed registration, digital QR badges, Apple Wallet integration, and sub-0.3s phone scanning with 0% ticket commissions.",
        directAnswer: {
        "title": "Why Seek a Whova Alternative for QR Check-In?",
        "summary": "Whova is primarily an attendee networking and conference community mobile app that obligates attendees to download heavy native apps before accessing tickets. When organizers simply need fast, reliable registration, automated digital pass distribution, and sub-second multi-gate QR check-in, Whova introduces app store friction and high annual subscription costs. UrPass operates 100% in mobile browsers for sub-0.3-second door entry.",
        "keyPoints": [
                "100% web-first experience: attendees access passes without downloading heavy 100MB+ mobile apps",
                "Sub-0.3s camera check-in on volunteer smartphones vs slow manual app lookups",
                "0% platform commission on ticket sales with direct Razorpay and Stripe bank payouts",
                "Transparent monthly subscription pricing vs Whova's quote-based annual pricing"
        ]
},
        whatIs: {
        "title": "Whova vs UrPass: Understanding the Difference in Focus",
        "definition": "Whova is built around attendee engagement, digital business card exchanges, in-app messaging, and community message boards. UrPass is built for organizers who prioritize smooth entrance logistics, rapid gate check-in, automated credential delivery, and zero ticket commission.",
        "details": [
                "Whova forces attendees to download an app from Google Play or the App Store to retrieve passes",
                "UrPass delivers passes directly via WhatsApp, email, and native Apple Wallet with zero downloads",
                "Whova requires custom pricing quotes and sales negotiations for every event",
                "UrPass offers instant self-service activation starting with our plans from ₹499/mo / £15/mo in UK"
        ]
},
        keyFactsTable: {
        "title": "Workflow Comparison: Whova vs UrPass",
        "subtitle": "How attendee onboarding and gate operations compare between platforms.",
        "headers": [
                "Operational Factor",
                "Whova Event App",
                "UrPass Platform"
        ],
        "rows": [
                {
                        "col1": "Attendee App Obligation",
                        "col2": "Mandatory app download (~120MB) to access passes and tickets",
                        "col3": "Zero app downloads; responsive mobile web pass + Apple Wallet"
                },
                {
                        "col1": "Entrance Gate Scan Speed",
                        "col2": "0.8s - 2.0s per attendee depending on in-app barcode rendering",
                        "col3": "Under 0.3s per attendee using WebAssembly-accelerated video feeds"
                },
                {
                        "col1": "Pricing Transparency",
                        "col2": "Quote-based sales calls; often £1,500 - £6,000+ per event",
                        "col3": "Transparent flat monthly plans starting with plans from ₹499/mo / £15/mo"
                },
                {
                        "col1": "Platform Commission",
                        "col2": "Percentage cuts on paid registrations plus platform fees",
                        "col3": "0% platform ticket fee; keep 100% of your ticket revenue"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ATTENDEE FRICTION",
                "title": "Eliminate App Store Friction at the Entrance Gate",
                "paragraphs": [
                        "The biggest source of entrance line congestion at conferences using app-centric platforms is the app download barrier. Attendees arrive at the venue having ignored pre-event emails, only to find they must connect to overloaded venue Wi-Fi, download a 120MB mobile app, create an account, and verify an email before seeing their ticket.",
                        "UrPass eliminates this friction entirely. When an attendee registers, their digital pass is delivered straight to their WhatsApp chat, email, or Apple Wallet. At the entrance, they tap once to display their pass. Door volunteers scan it in under 0.3 seconds, clearing lobby lines effortlessly."
                ],
                "bullets": [
                        "Zero app downloads required for attendees or volunteer gate staff",
                        "One-tap pass access via WhatsApp, Apple Wallet, or mobile web browser",
                        "Passes load instantly even under spotty venue cellular connectivity",
                        "Cuts average attendee check-in time from 60 seconds down to 3 seconds"
                ],
                "takeaway": "Web-first passes eliminate app store friction and keep entrance queues moving."
        },
        {
                "badge": "PRICING & CONTROL",
                "title": "Transparent Flat Pricing with 0% Platform Commission",
                "paragraphs": [
                        "Whova operates on a traditional enterprise quote-based sales model: organizers must schedule a demo, negotiate with sales reps, and commit to multi-thousand-dollar fees per event. On top of software fees, ticketing commissions erode delegate pass revenues.",
                        "UrPass provides complete pricing transparency. Our plans are public, flat, and affordable, with 0% platform commission on ticket sales. Connect your own Stripe or Razorpay account to receive 100% of delegate revenues directly into your bank on standard merchant settlement schedules."
                ],
                "bullets": [
                        "0% platform ticket commission: keep every penny of delegate revenue",
                        "Direct settlement to your bank account via Stripe or Razorpay",
                        "Public, flat monthly subscriptions with zero hidden add-on fees",
                        "Full attendee data ownership with zero third-party marketing"
                ],
                "takeaway": "Transparent flat subscriptions protect your event budget and profit margins."
        }
],
        featuresTitle: "Key Comparison Advantages",
        featuresSubtitle: "Honest architectural comparisons built for discerning organizers.",
        features: [
          {
            icon: Smartphone,
            title: "No App Installation",
            desc: "Attendees access their passes via mobile browser, WhatsApp, or Apple Wallet with zero app downloads.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan passes at the door in milliseconds using volunteer smartphone cameras.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your delegate revenue. Connect Razorpay or Stripe directly.",
          },
          {
            icon: QrCode,
            title: "Branded Digital Badges",
            desc: "Issue professional mobile passes customized with delegate names, company logos, and role badges.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate",
            desc: "Prevent pass sharing across doors with real-time database-level row locking.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Track real-time door counts, arrival velocity, and session attendance on an organizer dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Conference Page",
                "desc": "Configure delegate registration fields, ticket tiers, and corporate tax invoice settings."
        },
        {
                "n": "02",
                "title": "Connect Payment Gateway",
                "desc": "Link Stripe or Razorpay to receive 100% of delegate revenues directly into your bank."
        },
        {
                "n": "03",
                "title": "Publish Registration Form",
                "desc": "Share your high-converting, mobile-responsive page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive digital QR credentials via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with smartphone cameras in <0.3s for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Replaces Whova with UrPass?",
        "subtitle": "Organizers who want fast check-in and transparent pricing without heavy mobile apps.",
        "personas": [
                {
                        "badge": "B2B CONFERENCES",
                        "title": "Industry Summits & Conventions",
                        "desc": "Manage executive delegate ticketing, tax invoices, and multi-track session scanning."
                },
                {
                        "badge": "ACADEMIA",
                        "title": "Colloquiums & Research Symposia",
                        "desc": "Register academic delegates, verify credentials, and issue verified attendance certificates."
                },
                {
                        "badge": "ASSOCIATIONS",
                        "title": "Professional Member Gatherings",
                        "desc": "Host regional conferences without forcing members to download proprietary social apps."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Corporate Training Bootcamps",
                        "desc": "Verify enrolled participants at seminar doors in seconds using volunteer phones."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Scanning Works Without Native Apps",
        "subtitle": "Instant browser-based verification that clears lobby queues.",
        "description": "Attendees present their digital QR pass on their phone screen or Apple Wallet. Registration desk staff point their smartphone camera at the code. UrPass decodes the cryptographic token in under 300 milliseconds, displays the delegate's name and tier (VIP, Speaker, Delegate), and marks them admitted.",
        "points": [
                "Eliminates slow manual searching through paper rosters or in-app member lists.",
                "Works smoothly on staff smartphones with zero equipment rentals.",
                "Atomic database locking prevents duplicate pass reuse across multiple doors.",
                "Quick manual search allows backup check-in if an attendee phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "Why do organizers choose UrPass instead of Whova for check-in?",
                "a": "Organizers choose UrPass when they want a fast, web-first check-in workflow that does not force attendees to download a 100MB+ mobile app from the App Store. UrPass delivers passes via WhatsApp, email, and Apple Wallet and scans in under 0.3 seconds."
        },
        {
                "q": "Does UrPass charge a percentage fee on delegate ticket sales?",
                "a": "No. UrPass charges 0% platform ticket commission. You keep 100% of your ticket price minus standard merchant payment gateway fees (via Stripe or Razorpay) and your flat monthly subscription."
        },
        {
                "q": "Can attendees save their conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it directly from their iPhone lockscreen."
        },
        {
                "q": "Do volunteer scanners need to be trained or download an app?",
                "a": "No. Volunteer scanners do not need to download an app. They scan a setup QR code with their phone camera to open the scanner in Safari or Chrome and start scanning immediately."
        },
        {
                "q": "Can I track attendance across different breakout sessions?",
                "a": "Yes. UrPass supports multi-session check-in. You can assign scanners to specific breakout rooms to record session attendance for accredited continuing education (CPD) reporting."
        }
],
      }}
    />
  );
}
