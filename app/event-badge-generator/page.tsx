import type { Metadata } from "next";
import { CheckCircle2, Palette, QrCode, FileText, Smartphone, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Badge Generator & Digital Pass Creator",
  description: "Generate professional event badges with high-contrast QR codes, attendee names, and organization branding. Works digitally on mobile and print-ready formats.",
  keywords: [
    "event badge generator",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-badge-generator" },
  openGraph: {
    title: "Event Badge Generator & Digital Pass Creator | URPASS",
    description: "Generate professional event badges with high-contrast QR codes, attendee names, and organization branding. Works digitally on mobile and print-ready formats.",
    url: "https://urpass.space/event-badge-generator",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT BADGE GENERATOR",
        h1: "Event Badge Generator for Digital & Printable Passes",
        canonicalUrl: "https://urpass.space/event-badge-generator",
        description: "Generate professional event badges with high-contrast QR codes, attendee names, and organization branding. Works digitally on mobile and print-ready formats.",
        ctaLabel: "Generate badges free",
        features: [
          { icon: Palette, title: "Dynamic Badge Creation", desc: "Automatically populate attendee full name, affiliation, role, and custom QR code on every badge." },
          { icon: QrCode, title: "Digital & Printable Outputs", desc: "Attendees view badges on their mobile phone or print high-resolution PDF passes for lanyard sleeves." },
          { icon: FileText, title: "Aesthetic Design Presets", desc: "Select between Minimal, Modern, and Dark presets crafted for legibility and visual appeal." },
          { icon: Smartphone, title: "Cryptographic QR Codes", desc: "High-contrast, generous padding QR codes ensure instant 0.3s camera recognition under any lighting." },
          { icon: ScanLine, title: "Batch Badge Generation", desc: "Approve or import hundreds of attendees and generate individual badges in one automated process." },
          { icon: ShieldCheck, title: "Gate Verification Integration", desc: "Every generated badge connects seamlessly to the URPASS mobile browser scanner for rapid entry check-in." },
        ],
        steps: [
          { n: "01", title: "Choose Style", desc: "Select a minimalist or modern badge template tailored for your event." },
          { n: "02", title: "Apply Branding", desc: "Upload your company or sponsor logo and select your brand accent color." },
          { n: "03", title: "Select Fields", desc: "Choose whether to display attendee name, company/college, and ticket tier." },
          { n: "04", title: "Generate & Send", desc: "Badges are generated and delivered as responsive web links." },
          { n: "05", title: "Scan at Venue", desc: "Scan phone screens or printed lanyard badges at door check-in." },
        ],
        callout: {
          badge: "ZERO DESIGN HASSLE",
          title: "Professional event badges generated in seconds.",
          description: "Skip complex design software and mail merges. URPASS automatically generates clean, standardized digital and printable badges for every registered attendee.",
          bullets: [
            "No graphic design experience required",
            "Instant responsive mobile view with Apple Wallet support",
            "High-contrast QR codes optimized for fast scanning",
            "Single-use security to eliminate badge sharing",
          ],
        },
        useCases: [
          "Technology Conferences",
          "Academic Symposiums",
          "Industry Expos",
          "Corporate Seminars",
          "Hackathon Badge Tables",
          "Alumni Networking Meets",
        ],
        faqs: [
          { q: "Can attendees print their badge at home?", a: "Yes. Attendees can view their badge online or print the formatted pass to insert into a standard lanyard badge holder." },
          { q: "Can we add sponsor logos to the badge?", a: "Yes. The custom badge studio allows organizers to upload primary organization and sponsor logos." },
          { q: "Does the badge update if the attendee details change?", a: "Yes. Because the digital badge is web-based, any edits made by the organizer update the live pass instantly." },
          { q: "Is badge generation free?", a: "Yes. You can generate badges for up to 100 attendees per month on our permanent free tier." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
