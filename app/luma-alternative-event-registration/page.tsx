import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Luma Alternative for Events | UrPass",
  description: "Comparing Luma alternatives? Explore UrPass for customizable registration, paid tickets, unique QR passes and entrance scanning.",
  keywords: ["luma alternative event registration","luma alternative","lu.ma alternative","events like luma with qr check in","luma vs urpass","event registration platforms like luma"],
  alternates: {
    canonical: "https://urpass.space/luma-alternative-event-registration",
  },
  openGraph: {
    title: "Luma Alternative for Events | UrPass",
    description: "Comparing Luma alternatives? Explore UrPass for customizable registration, paid tickets, unique QR passes and entrance scanning.",
    url: "https://urpass.space/luma-alternative-event-registration",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luma Alternative for Events | UrPass",
    description: "Comparing Luma alternatives? Explore UrPass for customizable registration, paid tickets, unique QR passes and entrance scanning.",
  },
};

export default function LumaAlternativeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "LUMA ALTERNATIVE",
        h1: "Looking for a Luma Alternative for Event Registration?",
        canonicalUrl: "https://urpass.space/luma-alternative-event-registration",
        description: "Comparing Luma alternatives? Explore UrPass for customizable registration, paid tickets, unique QR passes and entrance scanning.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=luma-alternative-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Switch from Luma to Full Gate Access Control",
        ctaDescription: "Get the aesthetic simplicity of modern event pages combined with enterprise QR scanning, Razorpay UPI payments, and 0% ticket commission.",
        directAnswer: {
        "title": "Why Look for a Luma Alternative?",
        "summary": "While Luma (lu.ma) is popular for social meetups, many organizers look for alternatives when they require direct regional payment gateways (like Razorpay for Indian UPI), native multi-gate QR entrance scanners with anti-duplicate locking, custom form questions, and 0% platform ticket commissions.",
        "keyPoints": [
                "Direct Razorpay UPI integration for Indian payments (Luma relies on Stripe with limited local payment methods)",
                "Enterprise-grade sub-0.3s smartphone camera scanner with atomic duplicate blocking across gates",
                "Deep custom registration form builder supporting custom questions and file uploads",
                "0% platform commission on tickets with predictable flat subscription pricing"
        ]
},
        whatIs: {
        "title": "Luma vs UrPass: Understanding the Core Differences",
        "definition": "Luma is a design-forward calendar and community RSVP tool built primarily for informal tech meetups and social gatherings. UrPass is a complete event management, ticketing, and gate access platform built for organizers running conferences, college festivals, corporate summits, and workshops who need operational rigor.",
        "details": [
                "Luma focuses on social discovery, community calendars, and Silicon Valley tech meetups",
                "UrPass focuses on gate throughput, multi-gate security, attendee verification, and local payments",
                "UrPass supports native Indian UPI (Google Pay, PhonePe, Paytm) via direct Razorpay",
                "UrPass Ticket Studio offers 12 customizable badge layouts with Apple Wallet and PDF badges"
        ]
},
        keyFactsTable: {
        "title": "Feature Comparison: Luma vs UrPass",
        "subtitle": "Detailed breakdown of event registration, payments, and gate operations.",
        "headers": [
                "Capability",
                "Luma (lu.ma)",
                "UrPass Platform"
        ],
        "rows": [
                {
                        "col1": "Indian Payment Support",
                        "col2": "Limited; relies primarily on Stripe international card processing",
                        "col3": "Native Razorpay integration supporting all UPI apps, cards & net banking"
                },
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "Takes a percentage fee on paid tickets (up to 5% + Stripe fees)",
                        "col3": "0% ticket commission; flat subscription from ₹29 intro offer / £15/mo"
                },
                {
                        "col1": "Multi-Gate Fraud Protection",
                        "col2": "Basic mobile check-in app without cross-gate atomic row locking",
                        "col3": "Sub-150ms atomic row locks prevent duplicate screenshot sharing"
                },
                {
                        "col1": "Pass Customization",
                        "col2": "Standardized minimal ticket display with limited branding",
                        "col3": "12 visual badge templates with Ticket Studio, custom colors & sponsor logos"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "GATE CONTROL",
                "title": "From Casual RSVP to High-Throughput Venue Security",
                "paragraphs": [
                        "Luma was built around calendar invites and informal community meetups where a single host checks people in at a co-working space door. When organizers scale up to 500, 1,000, or 5,000 attendees across multiple venue entrances, Luma's check-in mechanisms struggle with queue congestion and screenshot sharing.",
                        "UrPass is engineered specifically for venue crowd flow. Door volunteers scan attendee digital passes in under 300 milliseconds using web browsers on personal smartphones. Atomic database locking ensures that if an attendee shares a screenshot of their pass, only the first arrival is admitted while all subsequent attempts trigger instant amber warnings."
                ],
                "bullets": [
                        "Sub-0.3s camera scan clears 1,000 attendees in 15 minutes",
                        "Atomic row locking catches cross-gate screenshot fraud instantly",
                        "Deploy dozens of volunteer scanners with delegated roles",
                        "Audible green and amber audio chimes verify admission in loud venue environments"
                ],
                "takeaway": "UrPass provides professional venue access control that casual RSVP apps cannot match."
        },
        {
                "badge": "PAYMENTS & MARGINS",
                "title": "Keep 100% of Your Revenue with Native Regional Gateways",
                "paragraphs": [
                        "Luma's payment infrastructure is optimized for international Stripe credit card transactions. For organizers in India, where over 80% of consumer transactions occur via UPI apps (GPay, PhonePe, Paytm), Stripe creates payment failures, high card decline rates, and international conversion fees.",
                        "UrPass integrates directly with your verified Razorpay merchant gateway (in India) and Stripe (in the UK/US). You receive 100% of ticket proceeds directly into your business bank account with 0% platform ticket commission."
                ],
                "bullets": [
                        "One-tap UPI intent flow on mobile devices with sub-5s checkout",
                        "No platform commission on ticket sales; retain 100% of gross revenue",
                        "Direct settlement to your bank account on standard T+2 cycles",
                        "Automated GST and VAT tax invoices generated for corporate attendees"
                ],
                "takeaway": "Direct gateway integration protects your margins and provides frictionless local checkout."
        }
],
        featuresTitle: "Key Comparison Advantages",
        featuresSubtitle: "Honest architectural comparisons built for discerning organizers.",
        features: [
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket price. No percentage deductions or hidden aggregator cuts.",
          },
          {
            icon: Zap,
            title: "Native UPI & Razorpay",
            desc: "Accept Google Pay, PhonePe, Paytm, and Indian net banking with direct bank settlements.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Browser Scanner",
            desc: "Volunteers scan attendee passes in milliseconds on smartphone browsers with zero app installation.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate",
            desc: "Database-level row locks prevent ticket screenshot sharing across multiple entrance doors.",
          },
          {
            icon: QrCode,
            title: "Visual Ticket Studio",
            desc: "Design branded passes across 12 templates with custom colors, sponsor logos, and Apple Wallet.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Ingress Telemetry",
            desc: "Monitor arrival flow, peak door traffic, and door counts live on your organizer dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Configure event details, ticket tiers, capacity caps, and custom registration fields."
        },
        {
                "n": "02",
                "title": "Connect Payment Gateway",
                "desc": "Link Razorpay or Stripe to receive ticket revenues directly into your bank account."
        },
        {
                "n": "03",
                "title": "Publish Branded Page",
                "desc": "Share your high-converting, ad-free registration page with your prospective audience."
        },
        {
                "n": "04",
                "title": "Automated Pass Dispatch",
                "desc": "Attendees receive secure digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan Attendees at Doors",
                "desc": "Door staff scan passes with smartphone cameras in <0.3s for rapid venue entry."
        }
],
        whoShouldUse: {
        "title": "Who Switches from Luma to UrPass?",
        "subtitle": "Organizers who need professional ticketing, local payments, and real-time gate security.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Summits & Tech Conferences",
                        "desc": "Collect delegate fees, generate digital badges, and streamline multi-track check-ins."
                },
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Student Clubs",
                        "desc": "Process thousands of student entries with UPI payments and volunteer smartphone scanning."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Paid Creator Masterclasses",
                        "desc": "Sell limited seats with 0% platform ticket commission and automated calendar invites."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Professional Meetup Groups",
                        "desc": "Upgrade from casual RSVPs to fraud-proof gate scanning with verified attendee rosters."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Scanning Compares to Luma",
        "subtitle": "Enterprise-grade validation engineered for zero entrance queues.",
        "description": "Unlike Luma's basic check-in app, UrPass turns any smartphone browser into a laser-fast entry scanner. Volunteers point their camera at the attendee's digital pass, validating admission in under 0.3 seconds with atomic duplicate blocking across all venue doors.",
        "points": [
                "Volunteers scan on personal phones with zero app downloads.",
                "Audible audio chimes verify admission in loud venue environments.",
                "Atomic database row locking prevents pass reuse across multiple doors.",
                "Quick manual search allows backup check-in if an attendee phone is dead."
        ]
},
        faqs: [
        {
                "q": "Why do organizers choose UrPass over Luma?",
                "a": "Organizers choose UrPass when they need native Indian UPI payments via Razorpay, 0% platform ticket commissions, customizable digital pass badges, and enterprise multi-gate QR scanning that prevents ticket screenshot sharing."
        },
        {
                "q": "Does UrPass charge a percentage commission like Luma does on paid tickets?",
                "a": "No. UrPass charges 0% platform ticket commission. You pay only our transparent monthly subscription (starting from ₹29/mo intro offer / £15/mo in UK) and standard payment processing fees directly to Razorpay or Stripe."
        },
        {
                "q": "Can attendees still add passes to Apple Wallet with UrPass?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support, allowing attendees to save their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        },
        {
                "q": "Can I migrate my existing attendee lists from Luma to UrPass?",
                "a": "Yes. You can export your attendee CSV from Luma and import it directly into UrPass using our bulk attendee import tool, generating unique QR passes for all registered guests in minutes."
        },
        {
                "q": "Does UrPass require volunteers to download an app to scan tickets?",
                "a": "No. UrPass scanner runs directly in modern mobile web browsers like Safari and Chrome. Volunteers scan a coordinator authorization code to start scanning immediately."
        }
],
      }}
    />
  );
}
