import type { Metadata } from "next";
import { Palette, Sparkles, Smartphone, Image, Shield, QrCode } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Custom Event Pass Designer & Branded Ticket Maker | URPASS",
  description: "Design premium, minimalist digital event passes and printable PDF tickets. Curated templates, brand colors, custom logos, and secure QR codes. Keep it simple and on-brand.",
  keywords: [
    "custom event pass designer",
    "branded ticket maker",
    "event pass design online",
    "digital ticket generator",
    "printable event passes PDF",
    "minimalist event tickets",
    "QR code ticket design",
    "custom conference pass",
  ],
  alternates: { canonical: "https://urpass.space/custom-pass-design" },
  openGraph: {
    title: "Custom Event Pass Designer & Branded Ticket Maker | URPASS",
    description: "Create sleek, on-brand event passes in minutes. Choose minimal, modern, or dark templates, add your logo and colors, and preview live on mobile & PDF.",
    url: "https://urpass.space/custom-pass-design",
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

export default function CustomPassDesignPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS STUDIO · PASS DESIGNER",
        h1: "Design sleek, on-brand passes in minutes",
        canonicalUrl: "https://urpass.space/custom-pass-design",
        description: "Say goodbye to cluttered Canva templates. URPASS gives you a clean, SaaS-grade ticket designer with live mobile and PDF previews, custom brand accents, and tamper-proof QR codes.",
        ctaLabel: "Design your ticket free",
        features: [
          { icon: Palette, title: "Curated aesthetic templates", desc: "Choose between Minimal (crisp white), Modern (accent ribbon), and Dark (night mode) styles engineered specifically for events." },
          { icon: Sparkles, title: "Pure brand accent color", desc: "Apply your organization's exact hex color as a subtle, tasteful accent. No garish gradients or distracting clutter." },
          { icon: Image, title: "Drag-and-drop logo & cover", desc: "Upload your company or sponsor logos and optional background textures with automatic contrast-preserving backdrops." },
          { icon: Smartphone, title: "Live dual preview (Mobile + PDF)", desc: "See your pass instantly on mobile phone screens or toggle to the printable A4/Letter sheet with folding guidelines." },
          { icon: QrCode, title: "High-contrast QR code", desc: "Large, centered QR codes with generous white padding ensure rapid 0.3-second scanning under all venue lighting." },
          { icon: Shield, title: "Tamper-proof & verifiable", desc: "Every generated pass links cryptographically to your attendee record, instantly locking out duplicates." },
        ],
        steps: [
          { n: "01", title: "Select Template", desc: "Pick from Minimal, Modern, or Dark presets designed for legibility and prestige." },
          { n: "02", title: "Add Branding", desc: "Set your brand accent color and upload your organization or sponsor logo." },
          { n: "03", title: "Toggle Fields", desc: "Choose whether to display attendee name, ticket tier pill, venue address, and ticket ID." },
          { n: "04", title: "Send Test", desc: "Dispatch a live test email with your sample pass to check formatting across inboxes." },
          { n: "05", title: "Publish", desc: "Publish to all attendees in one click. Attendees get mobile passes and printable PDFs instantly." },
        ],
        callout: {
          badge: "ZERO CANVA COMPLEXITY",
          title: "Engineered for speed, consistency, and elegance.",
          description: "Forget spending hours resizing shapes and adjusting font sizes. URPASS ticket designer automates typographical balance, contrast ratios, and scanner readiness.",
          bullets: [
            "3 curated designer templates ready out of the box",
            "Automatic dark & light contrast preservation",
            "Mobile pass + Printable PDF cut-along sheet in one click",
            "Real-time live preview updates as you configure",
          ],
        },
        useCases: [
          "VIP Conference Badges", "Tech Summit Mobile Passes", "College Fest Entry Tickets", "Hackathon Attendee Passes",
          "Workshop Digital Badges", "Exclusive Gala Invitations", "Startup Demo Day Tickets", "Music Concert Digital Passes",
        ],
        faqs: [
          { q: "Can I customize the ticket with my company logo and brand color?", a: "Yes. Pro organizers can upload high-resolution logos, specify exact hex brand colors, and add custom background textures." },
          { q: "Can attendees print their tickets as a PDF?", a: "Yes. Every ticket pass has a dedicated printable PDF layout featuring cut-along dotted lines, event details, and entry guidelines." },
          { q: "Can I send a test email to verify how the ticket looks?", a: "Yes. The designer includes a 'Send Test' feature that dispatches a real sample ticket email directly to your inbox." },
          { q: "Does the custom pass design work with mobile entry scanning?", a: "Yes. Every custom pass includes a high-contrast, cryptographically signed QR code calibrated for sub-second scanner recognition." },
          { q: "Are custom ticket designs available on the free plan?", a: "Free organizers get access to our standard pass template. Pro organizers unlock the full Ticket Designer, custom templates, brand colors, and custom logos." },
        ],
        ctaTitle: "Create your signature event pass now",
        ctaDescription: "No credit card required · Live preview · Ready in under 3 minutes",
      }}
    />
  );
}
