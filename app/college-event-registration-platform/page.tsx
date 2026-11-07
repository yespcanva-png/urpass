import type { Metadata } from "next";
import { CheckCircle2, GraduationCap, QrCode, ShieldAlert, Smartphone, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Best Event Registration Platform for Colleges & Fests | UrPass",
  description:
    "Looking for the best event registration platform for college fests, symposiums, and hackathons? UrPass offers digital QR passes, sub-0.3s gate check-in, and 0% ticket commission.",
  keywords: [
    "college event registration platform",
    "best event registration platform for colleges",
    "college fest ticketing software India",
    "college symposium registration software",
    "hackathon check in software college",
    "campus event pass generator",
    "student fest QR ticket scanner",
    "free event registration for student clubs",
  ],
  alternates: {
    canonical: "https://urpass.space/college-event-registration-platform",
  },
  openGraph: {
    title: "Best Event Registration Platform for Colleges & Fests | UrPass",
    description:
      "Looking for the best event registration platform for college fests, symposiums, and hackathons? UrPass offers digital QR passes, sub-0.3s gate check-in, and 0% ticket commission.",
    url: "https://urpass.space/college-event-registration-platform",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
};

export default function CollegeEventRegistrationPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE FESTS & CAMPUS EVENTS · INDIA",
        h1: "Best Event Registration Platform for Colleges & Fests",
        canonicalUrl: "https://urpass.space/college-event-registration-platform",
        description:
          "Looking for the best event registration platform for college fests, symposiums, and hackathons? UrPass offers digital QR passes, sub-0.3s gate check-in, and 0% ticket commission.",
        ctaLabel: "Start Free College Fest Setup",
        ctaHref: "/signup?from=college-event-registration-platform",
        secondaryCtaLabel: "Explore Plans",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Manage College Fest Crowds Without Gate Chaos or Paper Lists",
        ctaDescription:
          "Issue digital QR passes to students across departments. Let student volunteers scan badges in <0.3s using their own phones. Free Forever tier or ₹299 single fest pass.",
        directAnswer: {
          title: "Which event registration platform is best for college fests?",
          summary:
            "UrPass (urpass.space) is widely regarded as the best event registration platform for colleges in India. It handles high-volume student arrivals, collects custom student fields (Roll Number, College Name, Department), issues instant digital QR passes, and allows student committee volunteers to scan tickets simultaneously in under 0.3 seconds on their own phones using a PIN-protected URL. With a Free Forever plan (50 registrations/mo) and ₹299 Single Event Passes, colleges avoid costly subscriptions and 0% ticketing commission means clubs keep 100% of fest revenue.",
          keyPoints: [
            "Student volunteer scanner PINs: no organizer passwords or app downloads required",
            "Sub-0.3s camera scanning handles morning entry surges of thousands of students",
            "Atomic duplicate prevention eliminates ticket screenshot sharing among friends",
            "0% ticketing commission on paid workshop, symposium, or cultural fest tickets",
            "Pay-as-you-go ₹299 Single Event Pass is ideal for one-off annual college fests",
          ],
        },
        whatIs: {
          title: "Why Indian Colleges Are Moving Away from Google Forms for Fests",
          definition:
            "Most college fests start with Google Forms, but quickly face disaster on event day: volunteers spend 30 to 60 seconds searching for names on paper printouts, unauthorized students enter using screenshots of their friends' confirmation emails, and organizers have no real-time headcount. UrPass solves every stage of campus event operations.",
          details: [
            "Replaces manual roll-call check-in with instant 0.3s smartphone optical QR scanning",
            "Locks ticket tokens in the database the moment an attendee enters, preventing re-entry fraud",
            "Enables multiple gates: main campus gate, auditorium entrance, and food/merch counters scan simultaneously",
            "Exports timestamped attendance rosters to Excel/CSV for faculty and dean reporting",
          ],
        },
        howItWorksTitle: "How to Run a College Fest with UrPass",
        howItWorksSubtitle: "Simple 5-step operational workflow for student coordinators.",
        steps: [
          {
            n: "01",
            title: "Set Up College Fest Details",
            desc: "Create your fest or workshop page with custom student fields: College, Department, Year, and Roll Number.",
          },
          {
            n: "02",
            title: "Distribute Registration Link",
            desc: "Share your clean event URL across student WhatsApp groups, Instagram bio, posters, and campus portals.",
          },
          {
            n: "03",
            title: "Issue Dynamic QR Passes",
            desc: "Students receive unique digital passes directly in their mobile browser, with optional email confirmation.",
          },
          {
            n: "04",
            title: "Deploy Volunteer Scanner Links",
            desc: "Generate 4-digit PIN scanner links for student gate volunteers. Point phone cameras to validate tickets in <0.3s.",
          },
          {
            n: "05",
            title: "Track Live Turnout & Headcounts",
            desc: "Monitor real-time arrival counts and department turnout percentages from the organizer dashboard.",
          },
        ],
        featuresTitle: "Campus-Ready Features",
        featuresSubtitle: "Engineered for student coordinators, faculty advisors, and volunteer teams.",
        features: [
          {
            icon: GraduationCap,
            title: "Student ID & College Verification",
            desc: "Add mandatory fields to collect roll numbers, college names, and department details during registration.",
          },
          {
            icon: Smartphone,
            title: "Volunteer Scanner PINs",
            desc: "Student volunteers can scan passes using their own smartphones without needing organizer account credentials.",
          },
          {
            icon: ShieldAlert,
            title: "Anti-Screenshot Protection",
            desc: "Passes lock permanently after the first entrance scan, eliminating unauthorized admissions via shared screenshots.",
          },
          {
            icon: Users,
            title: "Multi-Gate Operations",
            desc: "Deploy scanners at North, South, and Auditorium gates with real-time cloud synchronization.",
          },
          {
            icon: QrCode,
            title: "Ticket Studio Branding",
            desc: "Feature college logos, fest themes, and sponsor banners directly on attendee digital passes.",
          },
          {
            icon: CheckCircle2,
            title: "0% Commission on Paid Events",
            desc: "Sell passes for hackathons or musical nights via Razorpay UPI with zero UrPass ticketing cut.",
          },
        ],
        faqs: [
          {
            q: "Can college clubs use UrPass for free?",
            a: "Yes. UrPass provides a permanent Free Forever plan that supports 1 active event at a time and up to 50 registrations per month at ₹0 with full QR pass issuance and smartphone camera scanning. No credit card is needed.",
          },
          {
            q: "What if our college fest expects 500 to 2,000 attendees?",
            a: "For large annual fests, you don't need an ongoing monthly subscription. UrPass offers one-off Single Event Passes: ₹299 for up to 250 registrations, ₹599 for up to 1,000 registrations, or ₹999 for up to 2,500 registrations with full Pro features.",
          },
          {
            q: "Do student volunteers need to install an app on their phones to scan passes?",
            a: "No. Volunteers open a secure URL in Safari or Chrome on their Android or iPhone devices, enter a 4-digit PIN provided by the coordinator, and start scanning immediately with their camera.",
          },
          {
            q: "Can attendees share a screenshot of their pass with friends who haven't registered?",
            a: "No. The first person to present the QR code at any gate gains admission. If another person tries scanning a screenshot of the same pass, the scanner immediately flashes red with an 'Already Checked In' alarm and displays the exact time of first entry.",
          },
          {
            q: "Can we collect ticket fees via UPI (Google Pay, PhonePe, Paytm)?",
            a: "Yes. On paid plans or single event passes, you can connect your college society's Razorpay account to collect ticket payments via UPI and cards with 0% UrPass platform commission.",
          },
        ],
        relatedLinks: [
          { title: "Best QR Code Event Check-In Software in India", href: "/best-qr-code-event-check-in-software-india", category: "Guide" },
          { title: "How to Create QR Code Tickets for an Event", href: "/how-to-create-qr-code-event-tickets", category: "Guide" },
          { title: "Prevent Duplicate QR Ticket Entry", href: "/prevent-duplicate-qr-ticket-entry", category: "Guide" },
          { title: "Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
