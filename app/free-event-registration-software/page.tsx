import type { Metadata } from "next";
import {
  Sparkles,
  QrCode,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Registration Software with Digital QR Passes | UrPass",
  description:
    "Genuinely free event registration software for organizers, colleges, meetups, and conferences. 100 registrations/month, custom forms, instant QR tickets, and browser scanning. No credit card required.",
  keywords: [
    "free event registration software",
    "free event ticketing platform",
    "create event registration form free",
    "free digital event pass generator",
    "free qr code check-in software",
    "google forms alternative for events",
    "free event ticketing india",
  ],
  alternates: {
    canonical: "https://urpass.space/free-event-registration-software",
  },
  openGraph: {
    title: "Free Event Registration Software with Digital QR Passes | UrPass",
    description:
      "Host events with free registration forms, digital QR passes, and instant smartphone check-in. Free Forever plan with no credit card required.",
    url: "https://urpass.space/free-event-registration-software",
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

export default function FreeEventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "100% FREE FOREVER",
        h1: "Free Event Registration Software with Digital QR Passes",
        canonicalUrl: "https://urpass.space/free-event-registration-software",
        description:
          "Launch branded registration forms, issue personalized digital QR passes, and verify attendees at the gate with sub-second camera scanning — completely free with zero credit card required.",
        ctaLabel: "Start Free Forever →",
        ctaHref: "/signup",
        secondaryCtaLabel: "See All Plans",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "Is There Genuinely Free Event Registration Software?",
          summary:
            "Yes. UrPass provides a Free Forever plan specifically designed for student fests, tech meetups, corporate workshops, and local community events. Organizers can create 1 active event at a time, collect up to 100 registrations per month, customize application form fields, issue digital QR entry passes, and scan attendees using standard smartphone cameras without paying platform fees or entering credit card details.",
          keyPoints: [
            "Free Forever: ₹0/month with 1 active event and 100 registrations per month",
            "Instant QR Pass: Automated digital entry passes generated immediately upon registration",
            "Smartphone Scanner: Verify entry in under 0.3 seconds on any mobile browser without app downloads",
            "0% Commission: Keep 100% of your ticket revenue if you connect your own payment gateway",
          ],
        },
        whatIs: {
          title: "Why Free Event Software Beats Google Forms & Manual Spreadsheets",
          definition:
            "While Google Forms is commonly used for registrations, it cannot generate secure QR entry tickets, enforce seat limits, or prevent duplicate gate entry. UrPass replaces manual spreadsheet attendance tracking with automated ticket issuance and live gate validation.",
          details: [
            "Eliminate duplicate entry: Each attendee receives a cryptographically verified single-use QR pass",
            "Real-time attendance dashboard: Track exact arrival velocity and turnout rates during check-in",
            "Zero gate queues: Volunteers scan tickets in 300ms using camera browsers — no scanner hardware to rent",
            "Self-service attendee portal: Attendees can retrieve or view their passes on their phone at any time",
          ],
        },
        keyFactsTable: {
          title: "UrPass Free Plan vs Paid Tiers Matrix",
          subtitle: "Upgrade only when your event scale or team size demands it.",
          headers: ["Plan Tier", "Monthly Price", "Capacity & Key Features"],
          rows: [
            {
              col1: "Free Forever",
              col2: "₹0 / Free",
              col3: "1 active event · 100 registrations/mo · 1 organizer seat · Full QR check-in scanner",
            },
            {
              col1: "Starter",
              col2: "₹499/mo + GST",
              col3: "3 active events · 500 registrations/mo · 2 organizer seats · Standard analytics",
            },
            {
              col1: "Pro",
              col2: "₹999/mo + GST",
              col3: "10 active events · 2,500 registrations/mo · 5 seats · Ticket Studio & session tracking",
            },
            {
              col1: "Business",
              col2: "₹2,499/mo + GST",
              col3: "Unlimited events · 10,000 registrations/mo · 15 seats · API, webhooks & SLA support",
            },
          ],
        },
        featuresTitle: "Everything You Get on the Free Forever Plan",
        featuresSubtitle: "Core event technology without artificial paywalls or expiration timers.",
        features: [
          {
            icon: QrCode,
            title: "Automated QR Passes",
            desc: "Attendees receive clean, branded digital QR tickets immediately upon submitting the registration form.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Browser Scanner",
            desc: "Turn any iPhone or Android phone into an entrance gate scanner with instant audio/visual confirmation.",
          },
          {
            icon: Users,
            title: "100 Attendees / Month",
            desc: "Generous free attendee quota renewed every month — perfect for university clubs, seminars, and meetups.",
          },
          {
            icon: FileSpreadsheet,
            title: "Custom Form Builder",
            desc: "Collect college IDs, dietary preferences, company names, or t-shirt sizes with flexible custom fields.",
          },
          {
            icon: ShieldCheck,
            title: "Duplicate Entry Prevention",
            desc: "Passes cannot be forwarded or reused; the gate scanner flags re-scanned passes as 'Already Checked In'.",
          },
          {
            icon: Zap,
            title: "Instant One-Click Setup",
            desc: "Create and publish your event page in under 60 seconds with no complex setup or approval delays.",
          },
        ],
        faqs: [
          {
            q: "Is the Free plan really free forever or a 30-day trial?",
            a: "It is genuinely Free Forever. You do not need to enter a credit card, and the plan does not expire after 30 days. You can run 1 active event at a time and accept up to 100 registrations each month indefinitely.",
          },
          {
            q: "What happens if my event receives more than 100 registrations?",
            a: "When you approach 100 registrations, you will receive an alert on your attendee dashboard. You can upgrade to Starter (500 registrations/mo for ₹499) or Pro (2,500 registrations/mo for ₹999) with 1 click to accept more attendees without disrupting registration.",
          },
          {
            q: "Can I run paid events on the Free plan?",
            a: "Yes. You can connect your verified Razorpay merchant gateway to sell paid tickets. UrPass charges 0% platform commission on ticket revenue; you only pay standard Razorpay processing fees.",
          },
          {
            q: "Do attendees or gate staff need to download a mobile app?",
            a: "No. UrPass operates entirely on modern web standards. Attendees view passes in their mobile browser or add them to Apple/Google Wallet. Gate volunteers scan QR passes using their phone camera directly in the browser.",
          },
          {
            q: "Can I host more than 1 event concurrently on the Free plan?",
            a: "The Free plan supports 1 active event at a time. Once your event date finishes and you mark it completed, you can immediately duplicate or create your next event for free.",
          },
        ],
        relatedLinks: [
          { title: "Pricing & Plans", href: "/pricing", category: "Product" },
          { title: "Free QR Ticket Generator", href: "/free-qr-ticket-generator", category: "Product" },
          { title: "Event Registration Software India", href: "/event-registration-software-india", category: "Use Case" },
          { title: "QR Check-in Software", href: "/qr-code-event-check-in-software", category: "Product" },
          { title: "Ticket Fee Calculator", href: "/ticket-fee-calculator", category: "Product" },
        ],
        ctaTitle: "Create Your First Event for Free",
        ctaDescription: "No credit card required · Free Forever · 100 registrations/mo · Instant QR tickets",
      }}
    />
  );
}
