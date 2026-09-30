import type { Metadata } from "next";
import { Sparkles, Ticket, QrCode, Smartphone, Printer, ShieldCheck, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Custom Ticket Branding Software & Pass Designer | URPASS",
  description:
    "Design beautifully branded digital event passes, printable tickets, and conference badges. Custom colors, logos, dynamic attendee names, and high-contrast QR codes.",
  keywords: [
    "custom ticket branding software",
    "branded event tickets",
    "ticket studio software",
    "custom pass designer",
    "white label event tickets",
    "personalized event badges",
  ],
  alternates: { canonical: "https://urpass.space/custom-ticket-branding-software" },
  openGraph: {
    title: "Custom Ticket Branding Software & Pass Designer | URPASS",
    description: "Design beautifully branded digital event passes, printable tickets, and conference badges.",
    url: "https://urpass.space/custom-ticket-branding-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TICKET STUDIO & BRANDING",
        h1: "Custom Ticket Branding Software & Digital Pass Designer",
        canonicalUrl: "https://urpass.space/custom-ticket-branding-software",
        description:
          "Create pixel-perfect event tickets matching your exact brand guidelines. Style digital mobile passes, printable tickets, and conference lanyard badges with dynamic attendee data.",
        ctaLabel: "Start Designing Free",
        directAnswer: {
          title: "How Does URPASS Enable Custom Ticket Branding?",
          summary:
            "URPASS features an interactive Ticket Studio where organizers can style event tickets across multiple production formats without design skills. Organizers can customize primary brand colors, upload high-resolution emblems, configure pass header badges, and display dynamic attendee fields (names, company titles, ticket tiers) alongside high-contrast security QR codes.",
          keyPoints: [
            "Interactive in-browser Ticket Studio with real-time pass rendering across mobile and print views",
            "Custom brand color palettes, typography accents, and high-resolution organizer logo uploads",
            "Multi-format output: Mobile Digital Pass (380x680), Printable Ticket (780x340), Lanyard Badge (440x640)",
            "Dynamic attendee data injection: automatically formats attendee names, tiers, and single-use QR codes",
          ],
        },
        keyFactsTable: {
          title: "Ticket Studio Design Capabilities",
          subtitle: "Comparison of branding control on URPASS vs generic ticketing portals.",
          headers: ["Branding Feature", "URPASS Ticket Studio", "Legacy Generic Portals"],
          rows: [
            { col1: "Pass Design Canvas", col2: "Bespoke digital, printable, and lanyard badge formats", col3: "Rigid cookie-cutter template with third-party ads" },
            { col1: "Brand Color Control", col2: "Custom primary, secondary, and accent color pickers", col3: "Default brand colors locked behind enterprise tiers" },
            { col1: "Third-Party Aggregator Ads", col2: "Zero competitor ads or promotional clutter", col3: "Heavy competitor event recommendations on your tickets" },
            { col1: "Dynamic Attendee Data", col2: "Auto-rendered names, tiers, dates, and custom notes", col3: "Basic unformatted text layout" },
            { col1: "Export Formats", col2: "Mobile web URL, print-ready PDF, and high-res image", col3: "Basic email confirmation snippet only" },
          ],
        },
        features: [
          { icon: Sparkles, title: "Pixel-Perfect Brand Colors", desc: "Select custom hex color codes to align event passes with your corporate, university, or festival branding." },
          { icon: Ticket, title: "Three Standard Pass Formats", desc: "Design responsive Mobile Digital Passes (380x680), Printable Tickets (780x340), or Vertical Lanyard Badges (440x640)." },
          { icon: QrCode, title: "High-Contrast Optical QR", desc: "Crisp, scannable QR barcodes optimized for sub-0.3s gate check-in even under harsh sunlight or dim venue conditions." },
          { icon: ShieldCheck, title: "Cryptographic Single-Use Tokens", desc: "Every branded pass incorporates single-use UUID tokens that lock immediately upon entry to prevent pass sharing." },
          { icon: Smartphone, title: "No App Download for Guests", desc: "Attendees open clean, branded passes directly in their mobile browser with add-to-home-screen convenience." },
          { icon: Printer, title: "High-Resolution Print Export", desc: "Export high-resolution badges ready for venue printers or download individual badges as PDF files." },
        ],
        steps: [
          { n: "01", title: "Open Ticket Studio", desc: "Access the design tab from your event dashboard or create-event wizard." },
          { n: "02", title: "Upload Event Logo", desc: "Add your high-resolution event emblem or organization icon." },
          { n: "03", title: "Apply Brand Colors", desc: "Choose primary and accent colors to match your brand palette." },
          { n: "04", title: "Preview Live Roster", desc: "Inspect how real attendee names and ticket tiers render on the pass." },
          { n: "05", title: "Deploy to Attendees", desc: "Passes dispatch automatically via email the moment registrations or payments confirm." },
        ],
        callout: {
          badge: "BRAND OWNERSHIP",
          title: "Your event should showcase your brand — not a ticketing aggregator.",
          description: "When attendees register for your summit or festival, they shouldn't see competing event advertisements. URPASS gives you clean, professional pass branding that builds your brand equity.",
          bullets: [
            "Zero third-party advertisements or competitor event links on your passes",
            "Interactive Ticket Studio with live preview across digital and print sizes",
            "Automatic single-use cryptographic token assigned to every attendee",
            "Permanent Free Tier available for events up to 100 registrations",
          ],
        },
        faqs: [
          { q: "Can I add our sponsor logos to the ticket design?", a: "Yes. Ticket Studio allows you to upload logos and custom header imagery to feature prominent event sponsors and partners." },
          { q: "Can different ticket tiers have different colors?", a: "Yes. You can style distinct visual themes and badge labels for VIPs, Keynote Speakers, Press, Sponsors, and General Attendees." },
          { q: "Does the custom pass work on both iPhone and Android?", a: "Yes. Passes are fully responsive web applications that render beautifully in Safari, Chrome, Firefox, and Edge across all screen sizes." },
          { q: "Can attendees print their custom pass if they prefer paper?", a: "Yes. Attendees can download a high-resolution printable PDF version of their pass with a single click." },
        ],
        relatedLinks: [
          { title: "Pass & Ticket Studio", href: "/design-your-ticket", category: "Product" },
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "Custom Pass Design", href: "/custom-pass-design", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
        ],
      }}
    />
  );
}
