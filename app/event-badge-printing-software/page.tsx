import type { Metadata } from "next";
import { Ticket, Printer, Smartphone, ShieldCheck, QrCode, Sparkles, Layers, Download } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Badge Printing & Digital Pass Software | URPASS",
  description:
    "Design and generate professional conference badges, printable PDF event passes, and digital QR tickets. Built-in Ticket Studio with vertical lanyard and digital formats.",
  keywords: [
    "event badge printing software",
    "conference badge printing",
    "printable event tickets",
    "lanyard badge generator",
    "digital event badges",
    "ticket studio URPASS",
  ],
  alternates: { canonical: "https://urpass.space/event-badge-printing-software" },
  openGraph: {
    title: "Event Badge Printing & Digital Pass Software | URPASS",
    description: "Design and generate conference badges, printable passes, and digital QR tickets.",
    url: "https://urpass.space/event-badge-printing-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TICKET STUDIO & BADGING",
        h1: "Event Badge Printing & Digital Pass Design Software",
        canonicalUrl: "https://urpass.space/event-badge-printing-software",
        description:
          "Design bespoke digital passes, printable event tickets, and vertical conference lanyard badges with dynamic attendee names, custom branding, and high-contrast QR codes.",
        ctaLabel: "Design Your Badges Free",
        directAnswer: {
          title: "How Does URPASS Generate and Print Event Badges?",
          summary:
            "URPASS includes a built-in Ticket Studio that allows organizers to create professional event passes across three production formats: Mobile Digital Pass (380x680), Printable Ticket (780x340), and Vertical Conference Lanyard Badge (440x640). Passes dynamically inject attendee names, ticket tiers, and cryptographically verified QR codes ready for immediate print export or instant mobile delivery.",
          keyPoints: [
            "Three standardized pass formats: Digital Mobile, Printable PDF, and Vertical Lanyard Badge",
            "Dynamic attendee data injection: name, company/college, ticket tier, and single-use QR token",
            "Zero design software needed: style brand colors, logo emblems, and pass labels directly in-browser",
            "High-contrast QR barcodes optimized for under 0.3-second scanning under direct sunlight or dim auditoriums",
          ],
        },
        keyFactsTable: {
          title: "Badge Design & Print Specifications",
          subtitle: "Standardized dimensions, print layouts, and digital pass compatibility.",
          headers: ["Format / Feature", "Specification Details", "Typical Use Case"],
          rows: [
            { col1: "Vertical Lanyard Badge", col2: "440 x 640 px (standard conference clip)", col3: "Multi-day tech conferences, summits, and symposiums" },
            { col1: "Printable Horizontal Ticket", col2: "780 x 340 px (high-res A4 printable)", col3: "Workshops, seminars, and physical paper desk check-in" },
            { col1: "Mobile Digital Pass", col2: "380 x 680 px (responsive smartphone view)", col3: "College fests, hackathons, and paperless mobile entry" },
            { col1: "QR Barcode Encoding", col2: "High-contrast ECC Level M with UUID token", col3: "Sub-0.3s gate camera scanning without focus lag" },
            { col1: "Export Options", col2: "Instant PDF, high-res PNG image, and direct URL", col3: "Bulk pre-printing or automated email pass dispatch" },
          ],
        },
        features: [
          { icon: Printer, title: "Lanyard & Conference Badge Layouts", desc: "Generate vertical badges formatted for standard clear lanyard sleeves with high-visibility attendee names and company affiliations." },
          { icon: Smartphone, title: "Paperless Mobile Passes", desc: "Attendees open responsive passes directly in mobile Safari or Chrome with zero app downloads or account logins required." },
          { icon: QrCode, title: "High-Contrast QR Codes", desc: "Decodable in under 0.3s by smartphone cameras, even on cracked phone screens or under challenging lighting." },
          { icon: ShieldCheck, title: "Cryptographic Single-Use Tokens", desc: "Each badge embeds a unique UUID token that registers as invalid if duplicated or shared via screenshot." },
          { icon: Sparkles, title: "Brand Identity Customization", desc: "Customize badge primary colors, accent tones, organizer logos, and custom registration fields in Ticket Studio." },
          { icon: Download, title: "Bulk PDF & Image Export", desc: "Download high-resolution badges ready for venue badge printers or send direct pass links via email and WhatsApp." },
        ],
        steps: [
          { n: "01", title: "Select Badge Layout", desc: "Choose Vertical Lanyard Badge, Printable Ticket, or Mobile Digital Pass in Ticket Studio." },
          { n: "02", title: "Apply Event Branding", desc: "Set your brand palette, upload event logos, and customize pass header labels." },
          { n: "03", title: "Preview Live Roster", desc: "Inspect how attendee names, ticket tiers, and QR tokens render in real-time." },
          { n: "04", title: "Export or Dispatch", desc: "Download print-ready badges for on-site distribution or email passes automatically upon registration." },
          { n: "05", title: "Scan at Venue Entrances", desc: "Volunteers scan badges with smartphone cameras in <0.3s, tracking arrival timestamps in real-time." },
        ],
        callout: {
          badge: "ZERO PAPER WASTE",
          title: "Eliminate expensive badge printing hardware and disposable waste.",
          description: "URPASS gives organizers the flexibility of instant mobile passes for paperless events, alongside high-resolution badge exports for traditional corporate lanyard conferences.",
          bullets: [
            "Seamless switch between paperless digital passes and printed lanyard badges",
            "Automatic single-use cryptographic token assigned to every attendee",
            "No expensive proprietary badge printers or software licenses required",
            "Full attendance analytics logged automatically as badges are scanned at gates",
          ],
        },
        faqs: [
          { q: "Can I print badges before the event begins?", a: "Yes. Organizers can export all approved attendee badges as print-ready high-resolution files for pre-event lanyard assembly or print them individually on demand." },
          { q: "What dimensions are supported for printed conference badges?", a: "Ticket Studio natively outputs vertical lanyard conference badges (440x640 px) and horizontal printable tickets (780x340 px), both formatted for standard paper and card stocks." },
          { q: "Do attendees need to print their badges to enter?", a: "No. URPASS passes are fully digital by default. Attendees can simply present the QR pass on their smartphone screen, which scans in under 0.3s." },
          { q: "How does URPASS prevent people from copying or reprinting badges?", a: "Each badge contains a cryptographically unique token. Once scanned at an entrance gate, the token is permanently locked in the database, preventing any duplicate copies from gaining admission." },
        ],
        relatedLinks: [
          { title: "Pass & Ticket Studio", href: "/design-your-ticket", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "How to Create Digital Passes", href: "/guides/how-to-create-digital-event-passes", category: "Guide" },
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
