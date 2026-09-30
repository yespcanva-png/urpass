import type { Metadata } from "next";
import { QrCode, Zap, Mail, ShieldCheck, Smartphone, Share2, Ticket, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Instant QR Ticket Generator for Events | URPASS",
  description:
    "Generate single-use QR event tickets in seconds. Instant automated email delivery, mobile web passes, and fraud-proof cryptographic entry tokens.",
  keywords: [
    "instant qr ticket generator",
    "generate qr passes for events",
    "digital ticket maker",
    "event qr code generator",
    "single use qr tickets",
    "automated qr pass generator",
  ],
  alternates: { canonical: "https://urpass.space/instant-qr-ticket-generator" },
  openGraph: {
    title: "Instant QR Ticket Generator for Events | URPASS",
    description: "Generate single-use QR event tickets in seconds with automated delivery.",
    url: "https://urpass.space/instant-qr-ticket-generator",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INSTANT QR PASS GENERATION",
        h1: "Instant QR Ticket Generator for Modern Events",
        canonicalUrl: "https://urpass.space/instant-qr-ticket-generator",
        description:
          "Create and issue tamper-proof digital QR tickets in seconds. Automated delivery via email, mobile web links, and WhatsApp with zero per-ticket commission fees.",
        ctaLabel: "Generate Free QR Passes",
        directAnswer: {
          title: "How Does the URPASS Instant QR Ticket Generator Work?",
          summary:
            "URPASS dynamically generates single-use digital event passes upon attendee registration or ticket purchase. Each pass embeds a cryptographically unique UUID token rendered as a high-contrast QR code. Passes are delivered instantaneously via email and direct mobile web URLs that open in any browser without requiring guest account creation or app downloads.",
          keyPoints: [
            "Instant automated generation upon registration or 1-click organizer approval",
            "Single-use cryptographic tokens prevent unauthorized ticket reuse or screenshot duplication",
            "Zero app downloads: passes load immediately in mobile Safari and Google Chrome",
            "Automated multi-channel delivery via Resend email, direct web links, and WhatsApp",
          ],
        },
        keyFactsTable: {
          title: "Instant QR Pass Specifications",
          subtitle: "Technical parameters of URPASS generated digital tickets.",
          headers: ["Feature / Parameter", "URPASS Specification", "Standard Static QR Codes"],
          rows: [
            { col1: "Token Uniqueness", col2: "Cryptographic UUID v4 mapped to database record", col3: "Static plain text or raw URL" },
            { col1: "Anti-Duplicate Locking", col2: "Atomic PostgreSQL status lock upon first scan", col3: "None; can be copied and scanned indefinitely" },
            { col1: "Delivery Latency", col2: "< 2 seconds via transactional email (Resend)", col3: "Manual export or third-party mailing tools" },
            { col1: "Mobile Browser Compatibility", col2: "100% universal across iOS, Android, Desktop", col3: "Often requires specialized pass reader apps" },
            { col1: "Ticket Tier Customization", col2: "Free, Paid, VIP, Speaker, Volunteer badges", col3: "Single generic QR code" },
          ],
        },
        features: [
          { icon: Zap, title: "Instant Dynamic Generation", desc: "Passes generate automatically the moment an attendee registers, buys a ticket, or receives organizer approval." },
          { icon: Mail, title: "Automated Email Pass Dispatch", desc: "Attendees receive their personalized digital pass and entry instructions directly in their inbox with zero manual effort." },
          { icon: ShieldCheck, title: "Cryptographic Anti-Duplicate Protection", desc: "Every QR code is backed by an atomic single-use database token that permanently flags subsequent entries as duplicates." },
          { icon: Smartphone, title: "Universal Mobile Pass View", desc: "Passes open beautifully in mobile Safari and Chrome with add-to-home-screen and wallet-friendly formats." },
          { icon: Ticket, title: "Multi-Tier Badging", desc: "Design distinct pass styles and colors for VIPs, general attendees, speakers, sponsors, and organizers in Ticket Studio." },
          { icon: Share2, title: "WhatsApp & Direct URL Sharing", desc: "Send direct pass links to attendees via WhatsApp, SMS, or private messaging for instant gate access." },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Set event name, date, venue, and pass tiers in under 2 minutes." },
          { n: "02", title: "Share Registration Link", desc: "Attendees sign up or buy tickets through your public mobile-optimized page." },
          { n: "03", title: "Automated Pass Creation", desc: "URPASS immediately generates unique cryptographically signed QR tickets." },
          { n: "04", title: "Instant Attendee Dispatch", desc: "Guests receive their passes via email and can open them directly in their phone browser." },
          { n: "05", title: "Sub-0.3s Gate Scan", desc: "Staff scan tickets at venue gates with smartphone cameras for rapid entry." },
        ],
        callout: {
          badge: "ZERO COMMISSION",
          title: "Generate unlimited QR tickets without paying 5% to 10% platform cuts.",
          description: "Unlike legacy ticketing aggregators that charge heavy percentage commissions per ticket issued, URPASS offers transparent flat software pricing and a ₹0 free tier for up to 100 registrations/month.",
          bullets: [
            "Keep 100% of your ticket earnings with zero per-ticket cuts",
            "Automatic instant email pass delivery powered by transactional infrastructure",
            "Tamper-proof single-use QR tokens prevent gate fraud and pass sharing",
            "Built-in scanner verifies passes in under 0.3s with audio and haptic feedback",
          ],
        },
        faqs: [
          { q: "Can I generate QR tickets for free events?", a: "Yes. URPASS includes a permanent Free Tier allowing you to host up to 2 events per month and issue up to 100 QR passes per month completely free." },
          { q: "Do attendees need an app to open their QR ticket?", a: "No. The QR pass opens instantly in any mobile browser (Safari, Chrome, Firefox) and can be saved as an image, added to home screen, or printed as a PDF." },
          { q: "How fast is ticket delivery after registration?", a: "Passes are generated dynamically in milliseconds and delivered via email within 2 to 5 seconds of registration or approval." },
          { q: "Can I customize the look of the QR ticket?", a: "Yes. URPASS Ticket Studio allows you to customize brand colors, logos, attendee fields, and badge formats (digital, printable, or lanyard)." },
        ],
        relatedLinks: [
          { title: "Pass & Ticket Studio", href: "/design-your-ticket", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "How to Create QR Passes", href: "/guides/how-to-create-qr-event-pass", category: "Guide" },
          { title: "Free Event Registration Software", href: "/free-event-registration-software", category: "Product" },
        ],
      }}
    />
  );
}
