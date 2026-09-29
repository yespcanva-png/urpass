import type { Metadata } from "next";
import {
  Briefcase,
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
  title: "Conference Registration Software with QR Check-In | URPASS",
  description:
    "Enterprise-grade conference registration software. Multi-tier ticketing, branded digital passes, sub-0.3s gate check-in, and real-time attendance analytics.",
  keywords: [
    "conference registration software",
    "conference ticketing platform",
    "conference check in app",
    "event registration software for conferences",
    "conference badge qr code system",
    "corporate summit registration software",
  ],
  alternates: {
    canonical: "https://urpass.space/conference-registration-software",
  },
  openGraph: {
    title: "Conference Registration Software with QR Check-In | URPASS",
    description:
      "Modern conference registration and check-in software. Multi-tier passes, in-browser smartphone scanning, and zero ticketing commission.",
    url: "https://urpass.space/conference-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function ConferenceRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/conference-registration-software",
        badge: "CONFERENCES & SUMMITS",
        h1: "Conference Registration Software With QR Check-In",
        description:
          "The modern registration and entrance management solution for business conferences, academic symposiums, and industry summits. Deliver branded digital passes, verify delegate credentials in 0.28 seconds, and track arrival metrics in real time.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How URPASS Streamlines Conference Registration",
          summary:
            "Conferences require smooth delegate onboarding, multi-tier pass categories (VIP, Speaker, General Delegate), and fast entrance verification to avoid embarrassing morning lobby lines. URPASS eliminates traditional badge printing bottlenecks with mobile-ready digital QR passes delivered directly to attendees' phones, coupled with in-browser camera scanning that checks in delegates in under 0.28 seconds.",
          keyPoints: [
            "Tiered Registration: Set up VIP, Speaker, Media, and Delegate passes with distinct permissions",
            "Rapid Lobby Entry: 0.28s in-browser smartphone camera scanning eliminates registration queues",
            "Audience Ownership: You retain 100% of attendee contact information with instant CSV exports",
            "Transparent Pricing: Permanent free tier for up to 50 delegates, with flat subscription upgrades",
          ],
        },
        productProof: {
          badge: "DELEGATE ACCESS CONTROL",
          title: "Sub-Second In-Browser Scanner",
          description:
            "Registration staff scan attendee badges in Safari or Chrome. Instant visual confirmation of delegate tier and session access.",
          type: "scanner",
        },
        features: [
          {
            icon: Briefcase,
            title: "Multi-Tier Delegate Passes",
            desc: "Configure Speaker, VIP, Sponsor, and General Attendee tiers with individual seat caps and access permissions.",
          },
          {
            icon: QrCode,
            title: "Digital Conference Passes",
            desc: "Personalized badges featuring delegate name, organization, job title, and encrypted QR token with Apple Wallet support.",
          },
          {
            icon: ScanLine,
            title: "0.28s Entrance Scanning",
            desc: "Lobby reception staff scan badges directly on standard smartphones with instant validation chimes.",
          },
          {
            icon: ShieldCheck,
            title: "Credential Anti-Fraud",
            desc: "Prevent badge sharing and unauthorized access with instant cloud verification and duplicate pass lockout.",
          },
          {
            icon: Users,
            title: "Custom Delegate Fields",
            desc: "Collect company name, designation, dietary requirements, and invoice GSTIN information during registration.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Track real-time arrival velocity, session room headcounts, and overall event show-up rates.",
          },
        ],
        steps: [
          { n: "01", title: "Set Tiers", desc: "Configure delegate categories, early bird pricing, and registration questions." },
          { n: "02", title: "Launch Registration", desc: "Embed registration links on your conference website and email campaigns." },
          { n: "03", title: "Deliver Badges", desc: "Delegates receive verified digital passes instantly on mobile web or email." },
          { n: "04", title: "Check In at Lobby", desc: "Staff scan delegate badges in under 0.28s with zero lobby bottlenecks." },
        ],
        callout: {
          badge: "SUMMIT READY",
          title: "Deliver a premium, professional check-in experience",
          description:
            "First impressions matter. Impress your delegates, keynote speakers, and corporate sponsors with effortless digital entry.",
          bullets: [
            "Permanent free plan available for small conferences & seminars",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Instant multi-door cloud sync across venue entry gates",
            "One-click CSV exports with verified delegate arrival timestamps",
          ],
        },
        useCases: [
          "Annual industry summits & executive conventions",
          "Academic symposiums & scientific research conferences",
          "Tech developer conferences & product launch events",
          "Healthcare, medical & pharmaceutical congresses",
          "Investor demo days & venture summits",
        ],
        faqs: [
          {
            q: "Can I manage multi-tier passes (VIP, Speaker, Delegate)?",
            a: "Yes! You can configure distinct ticket tiers with specific quantities, pricing, custom registration fields, and gate permissions.",
          },
          {
            q: "Do delegates need to print physical badges?",
            a: "No! Delegates can present their digital QR pass on their smartphone screen or save it directly to Apple Wallet or Google Wallet. If you also want to print physical badges, URPASS passes can be printed on standard badge paper.",
          },
          {
            q: "Can lobby staff scan badges without downloading an app?",
            a: "Yes. Organizers share a secure scanner URL with lobby volunteers. Opening the link in Safari or Chrome activates the camera to validate passes in under 0.28 seconds.",
          },
          {
            q: "Does URPASS support GST invoicing and tax collection?",
            a: "Yes. For paid conferences, you can collect organization GSTIN numbers and business details directly during checkout via Razorpay or Stripe.",
          },
        ],
        ctaTitle: "Elevate your conference check-in today",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
