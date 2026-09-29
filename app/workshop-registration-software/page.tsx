import type { Metadata } from "next";
import {
  Wrench,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Workshop Registration Software with QR Passes | URPASS",
  description:
    "Online workshop registration software with instant QR passes and phone check-in. Manage attendee capacity, waitlists, and payments with zero commission.",
  keywords: [
    "workshop registration software",
    "workshop booking system",
    "workshop ticketing platform",
    "seminar and workshop registration",
    "qr code workshop check in",
    "free workshop registration",
  ],
  alternates: {
    canonical: "https://urpass.space/workshop-registration-software",
  },
  openGraph: {
    title: "Workshop Registration Software with QR Passes | URPASS",
    description:
      "All-in-one registration and check-in software for workshops and masterclasses. Secure QR tickets, phone camera check-in, and 0% commission.",
    url: "https://urpass.space/workshop-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function WorkshopRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/workshop-registration-software",
        badge: "WORKSHOPS & MASTERCLASSES",
        h1: "Workshop Registration Software With QR Passes",
        description:
          "The modern registration and attendee check-in platform for interactive workshops, masterclasses, and hands-on bootcamps. Collect custom participant questions, issue encrypted digital passes, and scan attendees at the door in 0.28 seconds.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How URPASS Simplifies Workshop Registrations",
          summary:
            "Workshops have fixed seating capacities and require strict attendance tracking for material distribution and certifications. Traditional spreadsheets often lead to overbooking, manual payment confirmation delays, and time-consuming door verification. URPASS automates seat caps, collects custom skill prerequisites, delivers instant mobile QR passes, and lets instructors scan attendees in under 0.28 seconds directly in any mobile browser.",
          keyPoints: [
            "Strict Capacity Control: Automatically caps registrations when venue or lab seats fill up",
            "Door Validation: 0.28s in-browser smartphone camera scanning with zero app downloads",
            "Payment Flexibility: Accept UPI, credit cards, or offer free registration tiers with 0% platform commission",
            "Permanent Free Tier: ₹0 forever for community workshops with up to 50 attendees",
          ],
        },
        productProof: {
          badge: "FAST LAB ENTRY",
          title: "In-Browser Smartphone Check-In",
          description:
            "Instructors and lab assistants scan participant passes in Safari or Chrome. Instant confirmation of workshop seat and registration status.",
          type: "scanner",
        },
        features: [
          {
            icon: Wrench,
            title: "Seat Capacity Caps",
            desc: "Prevent overbooking with automated registration cutoffs when your workshop seats reach maximum capacity.",
          },
          {
            icon: QrCode,
            title: "Automated QR Passes",
            desc: "Every registered participant receives an encrypted mobile pass featuring their name, tier, and Apple/Google Wallet integration.",
          },
          {
            icon: ScanLine,
            title: "0.28s Door Scanning",
            desc: "Instructors scan badges at lab or classroom doors using any smartphone browser with zero app installation.",
          },
          {
            icon: ShieldCheck,
            title: "Duplicate Entry Lockout",
            desc: "Ensure only registered, paid attendees enter your workshop with instant duplicate ticket warnings.",
          },
          {
            icon: Zap,
            title: "Direct UPI & Card Payments",
            desc: "Collect workshop fees via Google Pay, PhonePe, Paytm, or cards with direct payouts and 0% platform commission.",
          },
          {
            icon: BarChart3,
            title: "Verified Attendance Logs",
            desc: "Export verified attendee arrival records with timestamps to easily issue workshop completion certificates.",
          },
        ],
        steps: [
          { n: "01", title: "Set Up Workshop", desc: "Define workshop schedule, seat limits, and prerequisites in 2 minutes." },
          { n: "02", title: "Share Link", desc: "Promote your registration link across LinkedIn, WhatsApp, and email lists." },
          { n: "03", title: "Deliver Passes", desc: "Attendees get digital QR passes with instant mobile wallet integration." },
          { n: "04", title: "Scan at Door", desc: "Scan attendee badges at the door in under 0.28 seconds with zero queues." },
        ],
        callout: {
          badge: "INSTRUCTOR READY",
          title: "Spend time teaching, not managing spreadsheet rows",
          description:
            "From technical coding bootcamps to creative design masterclasses, URPASS takes the friction out of participant management.",
          bullets: [
            "Permanent free plan available for free community workshops",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Audible confirmation chime and haptic buzz upon validation",
            "One-click CSV exports with verified arrival timestamps",
          ],
        },
        useCases: [
          "Hands-on coding bootcamps & software tutorials",
          "Design, UI/UX & creative masterclasses",
          "Business strategy & leadership workshops",
          "College laboratory & technical sessions",
          "Culinary, photography & hobby workshops",
        ],
        faqs: [
          {
            q: "Can I limit the number of attendees in my workshop?",
            a: "Yes! You can specify an exact seat limit. Once that number of registrations is reached, the registration form automatically marks the event as sold out or waitlisted.",
          },
          {
            q: "Can I host a free workshop at zero cost?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "Do attendees need to print anything?",
            a: "No! Attendees can show their digital QR pass on their smartphone screen or save it to Apple Wallet or Google Wallet for easy access.",
          },
          {
            q: "How does attendance tracking help with issuing certificates?",
            a: "URPASS logs the exact timestamp when each attendee's QR badge is scanned at the door. You can export this verified roster to CSV and issue certificates only to confirmed attendees.",
          },
        ],
        ctaTitle: "Set up your workshop registration in 2 minutes",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
