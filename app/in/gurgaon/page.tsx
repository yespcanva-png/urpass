import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, ShieldCheck, CreditCard } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Gurgaon (Gurugram) — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Gurgaon (Gurugram). Built for Fortune 500 corporate townhalls, Cyber City tech meetups, leadership summits, and DLF conferences. Free to start.",
  keywords: [
    "event registration Gurgaon",
    "QR check in Gurugram",
    "Cyber City corporate event software",
    "Golf Course Road event ticketing",
    "Gurugram corporate pass management",
    "event management software Haryana",
    "Razorpay event ticketing Gurgaon",
  ],
  alternates: { canonical: "https://urpass.space/in/gurgaon" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Gurgaon | URPASS",
    description:
      "Gurugram's premier event registration and digital QR pass platform for corporate townhalls, Cyber City tech conferences, and executive summits.",
    url: "https://urpass.space/in/gurgaon",
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

export default function GurgaonPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · GURUGRAM (GURGAON)",
        h1: "Event Registration & QR Check-In for Gurgaon Events",
        canonicalUrl: "https://urpass.space/in/gurgaon",
        geo: {
          region: "IN-HR",
          placename: "Gurugram, Haryana, India",
          position: "28.4595;77.0266",
          latitude: 28.4595,
          longitude: 77.0266,
        },
        description:
          "Trusted by Gurgaon's corporate leaders, Cyber City tech companies, and event agencies. Digital QR passes, Razorpay instant UPI checkout, and sub-0.3s door check-in for corporate conferences and summits.",
        ctaLabel: "Start your Gurgaon event",
        features: [
          {
            icon: Building2,
            title: "Fortune 500 Corporate Townhalls",
            desc: "Engineered for high-security enterprise conferences in DLF Cyber City, CyberHub, and Golf Course Road.",
          },
          {
            icon: MapPin,
            title: "Gurugram & NCR Coverage",
            desc: "Native INR pricing with direct Razorpay UPI integration for events across Gurgaon, Manesar, and Sohna Road.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Commission",
            desc: "Keep 100% of ticket sales directly deposited into your company bank account.",
          },
          {
            icon: QrCode,
            title: "Dynamic Digital QR Passes",
            desc: "Automated wallet passes with single-use cryptographic tokens preventing badge sharing and screenshot fraud.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Phone Door Scanning",
            desc: "Volunteers and security staff scan passes at venue gates using any iPhone or Android camera. Zero hardware rental.",
          },
          {
            icon: ShieldCheck,
            title: "Enterprise SSO & IP Security",
            desc: "Support for Okta/Entra ID Single Sign-On and corporate VPN IP allowlisting for confidential town halls.",
          },
        ],
        callout: {
          badge: "GURUGRAM VENUES",
          title: "From Cyber City to The Leela & Ambience Island.",
          description:
            "Gurgaon is India's corporate capital, hosting high-stakes leadership summits, developer meetups, and investor demo days. URPASS eliminates check-in queues and duplicate entry fraud.",
          bullets: [
            "Corporate town halls across DLF Phase 1–5 and Udyog Vihar",
            "Tech meetups and hackathons in Sector 29 and Cyber City",
            "Conferences at The Leela Ambience, Westin, and Grand Hyatt Gurgaon",
            "Alumni reunions and management summits at MDI Gurgaon",
          ],
        },
        useCases: [
          "Cyber City corporate townhalls",
          "Fintech & SaaS summits on Golf Course Road",
          "MDI Gurgaon management fests",
          "Founder and VC demo days",
          "Product launches at Ambience Island",
          "Industry trade associations & exhibitions",
        ],
        relatedLinks: [
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Event Registration Noida",
            href: "/in/noida",
            category: "Location",
          },
          {
            title: "Enterprise SSO Event Ticketing",
            href: "/enterprise-sso-event-ticketing",
            category: "Product",
          },
          {
            title: "Event Security & Compliance",
            href: "/event-security-compliance",
            category: "Product",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
        ],
        faqs: [
          {
            q: "Is URPASS suitable for corporate events in Gurgaon?",
            a: "Yes. URPASS is designed specifically for enterprise and corporate events in Gurugram, offering SAML 2.0 / OIDC SSO, automated GST invoices, and IP allowlisting alongside sub-second door check-in.",
          },
          {
            q: "Can attendees pay with UPI?",
            a: "Yes. Our direct Razorpay integration supports instant UPI payments (Google Pay, PhonePe, Paytm, BHIM) as well as corporate credit cards and net banking with zero platform ticket commissions.",
          },
          {
            q: "Do security guards need to download an app to scan passes?",
            a: "No app download is required. Security and reception staff open a secure PIN scanner link in Safari or Chrome on their smartphone to scan QR passes in under 0.3 seconds.",
          },
          {
            q: "Can we issue automated GST invoices to corporate attendees?",
            a: "Yes. URPASS captures attendee company GSTIN details during registration and generates compliant GST tax invoices with SAC codes automatically.",
          },
        ],
        ctaTitle: "Host your next Gurgaon event on URPASS",
        ctaDescription: "Used across Cyber City & NCR · Free to start · Instant UPI · 0% commission",
      }}
    />
  );
}
