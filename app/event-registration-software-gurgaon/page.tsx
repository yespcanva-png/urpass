import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Gurgaon (Gurugram) — URPASS",
  description:
    "Organizing a corporate conference, summit, tech meetup, or town hall in Gurgaon? URPASS helps organizers manage registrations, issue digital QR passes, and check in attendees using any phone.",
  keywords: [
    "event registration software gurgaon",
    "event registration software gurugram",
    "QR event check-in Gurgaon",
    "corporate event ticketing DLF Cyber City",
    "event management platform Gurgaon",
    "Razorpay event ticketing Haryana",
    "URPASS Gurgaon",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-gurgaon" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Gurgaon | URPASS",
    description:
      "Enterprise event registration and QR check-in software for DLF Cyber City, Golf Course Road, and Gurgaon corporate summits.",
    url: "https://urpass.space/event-registration-software-gurgaon",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Gurugram, Haryana, India",
    "geo.position": "28.4595;77.0266",
    ICBM: "28.4595, 77.0266",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "GURUGRAM ENTERPRISE & CORPORATE EVENTS",
        h1: "Event Registration & QR Check-In Software in Gurgaon",
        canonicalUrl: "https://urpass.space/event-registration-software-gurgaon",
        geo: {
          region: "IN-HR",
          placename: "Gurugram, Haryana, India",
          position: "28.4595;77.0266",
          latitude: 28.4595,
          longitude: 77.0266,
        },
        description:
          "Organizing a corporate townhall, leadership summit, tech meetup, or industry conference in Gurgaon? URPASS helps enterprise organizers manage registrations, issue digital QR passes, and check in attendees using any phone with zero hardware rental.",
        ctaLabel: "Start your Gurgaon event free",
        features: [
          {
            icon: Building2,
            title: "Built for Cyber City Enterprises",
            desc: "Native INR pricing, automated GST invoices, and corporate Single Sign-On (SAML/OIDC) for high-security events in Gurgaon.",
          },
          {
            icon: Ticket,
            title: "UPI & Zero-Commission Ticketing",
            desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and corporate cards with zero per-ticket commission fees.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Approved registrants automatically receive a unique digital QR pass with Apple Wallet support — zero paper badge printing.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Scanning",
            desc: "Scan attendee passes at entrance gates using any smartphone camera without renting specialized scanners.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Velocity",
            desc: "Track real-time door arrival velocity and peak check-in periods with instant CSV/Excel export for internal audits.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Protection",
            desc: "Prevents attendee pass sharing and badge reuse, safeguarding sensitive corporate town halls from unauthorized access.",
          },
        ],
        callout: {
          badge: "GURGAON VENUES",
          title: "Trusted across Cyber City, Golf Course Road, and NCR.",
          description:
            "Engineered for high-density crowds across DLF CyberHub, Udyog Vihar, Ambience Island, and leading hotels like The Leela, Westin, and Grand Hyatt. URPASS eliminates entrance bottlenecks.",
          bullets: [
            "Corporate town halls and all-hands conferences",
            "SaaS, AI, and developer meetups across Sector 29 and CyberHub",
            "Executive roundtables and investor demo days",
            "Higher education conferences and alumni gatherings",
          ],
        },
        useCases: [
          "Cyber City corporate summits",
          "FinTech and Web3 conferences",
          "Management fests and business symposiums",
          "Investor demo days and startup launches",
          "Trade associations and industrial summits",
        ],
        relatedLinks: [
          {
            title: "Gurgaon City Event Hub",
            href: "/in/gurgaon",
            category: "Location",
          },
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Enterprise SSO Event Ticketing",
            href: "/enterprise-sso-event-ticketing",
            category: "Product",
          },
          {
            title: "Corporate Event Management",
            href: "/corporate-event-management",
            category: "Use Case",
          },
          {
            title: "Event Security & Compliance",
            href: "/event-security-compliance",
            category: "Product",
          },
        ],
        faqs: [
          {
            q: "How does 0% commission ticketing work for Gurgaon events?",
            a: "URPASS operates on a transparent software subscription model. You connect your own Razorpay account, and 100% of ticket revenues settle directly into your bank account with zero platform deduction.",
          },
          {
            q: "Can we issue automated GST invoices to corporate attendees in Gurgaon?",
            a: "Yes. Attendees can provide their organization GSTIN during checkout, and URPASS generates compliant GST tax invoices with SAC codes automatically.",
          },
          {
            q: "Does URPASS support Okta or Entra ID Single Sign-On?",
            a: "Yes. Our Enterprise tier includes SAML 2.0 and OpenID Connect (OIDC) federation with Okta, Microsoft Entra ID (Azure AD), and Google Workspace.",
          },
        ],
        ctaTitle: "Start your Gurgaon event on URPASS",
        ctaDescription: "Used across Cyber City & NCR · Free tier available · Instant UPI payments",
      }}
    />
  );
}
