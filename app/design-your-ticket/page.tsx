import type { Metadata } from "next";
import { Palette, Sparkles, Smartphone, Image, Sliders, Printer } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Design Your Ticket Online — Custom Event Pass & Ticket Maker",
  description: "Design your ticket online in minutes with URPASS. Minimalist, modern, and dark templates, custom hex colors, logo uploads, and instant mobile passes or printable PDFs. Free to start.",
  keywords: [
    "design your ticket",
    "design your ticket online",
    "ticket designer",
    "ticket designer online",
    "custom pass design",
    "event ticket maker",
    "event pass generator India",
    "printable event tickets PDF",
    "branded event passes",
    "digital ticket design software",
  ],
  alternates: { canonical: "https://urpass.space/design-your-ticket" },
  openGraph: {
    title: "Design Your Ticket Online — Custom Event Pass & Ticket Maker | URPASS",
    description: "Design your ticket with URPASS. Clean templates, custom brand colors, logo upload, and instant live preview on mobile and PDF.",
    url: "https://urpass.space/design-your-ticket",
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

export default function DesignYourTicketPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS STUDIO · TICKET DESIGNER",
        h1: "Design your ticket. Keep it simple and on brand.",
        canonicalUrl: "https://urpass.space/design-your-ticket",
        geo: {
          region: "IN",
          placename: "India",
          position: "20.5937;78.9629",
          latitude: 20.5937,
          longitude: 78.9629,
        },
        description: "Create the pass your attendees will receive in minutes. Choose from 3 curated designer templates, pick your exact brand accent color, upload your logo, and preview live on mobile and printable PDF.",
        ctaLabel: "Design your ticket now",
        features: [
          { icon: Palette, title: "3 Curated templates", desc: "Select between Minimal (high contrast white), Modern (accent color top ribbon), and Dark (night VIP aesthetic) styles designed for clarity." },
          { icon: Sparkles, title: "Custom brand accent", desc: "Enter your exact organization hex color or choose from presets. Your color is applied as a subtle, tasteful accent." },
          { icon: Image, title: "Logo & background upload", desc: "Drag and drop your company or event logo, with optional subtle background textures that preserve readability." },
          { icon: Sliders, title: "Control what is shown", desc: "Easily toggle Attendee Name, Ticket Type pill, Venue address, and Ticket ID. Event name and date/time are pulled automatically." },
          { icon: Smartphone, title: "Live dual preview (Mobile & PDF)", desc: "Preview your ticket as a vertical mobile pass or toggle to the printable A4/Letter cut-along sheet with folding guides." },
          { icon: Printer, title: "Print-ready PDF passes", desc: "Attendees can save to their smartphones or print high-resolution paper passes with cut-along lines for registration desks." },
        ],
        steps: [
          { n: "01", title: "Pick Template", desc: "Choose Minimal, Modern, or Dark layout optimized for readability and scanner recognition." },
          { n: "02", title: "Apply Brand Color", desc: "Set your signature brand color to tint QR badges and card accents." },
          { n: "03", title: "Upload Logo", desc: "Add your event or sponsor logo to display cleanly at the top of every pass." },
          { n: "04", title: "Toggle Fields", desc: "Select whether to display attendee name, ticket category, venue, and unique ticket ID." },
          { n: "05", title: "Save & Publish", desc: "Send a sample test pass to your email or publish instantly to all registered attendees." },
        ],
        callout: {
          badge: "DESIGNED FOR PERFECTION",
          title: "No graphic design skills required.",
          description: "Skip complex design tools with hundreds of overwhelming knobs. URPASS Ticket Designer gives you one clean card with everything you need and nothing you don't.",
          bullets: [
            "Real-time instant preview as you configure your ticket",
            "Automatic contrast enhancement ensures QR codes scan on first try",
            "Send test ticket emails with 1 click to preview in actual inboxes",
            "Works seamlessly on both mobile smartphones and printed event sheets",
          ],
        },
        useCases: [
          "Conference Attendee Badges", "College Fest Entry Passes", "Hackathon Identification",
          "Workshop Participation Tickets", "VIP Gala Access Passes", "Tech Meetup Digital Passes",
          "Exhibition Floor Passes", "Concert and Stage Tickets",
        ],
        faqs: [
          { q: "How do I design my ticket on URPASS?", a: "Go to Ticket Design in your dashboard or event settings, choose a template (Minimal, Modern, or Dark), set your brand color, upload your logo, and click Save & Publish." },
          { q: "Can I send a test ticket to my email before publishing?", a: "Yes. Click 'Send Test' in the top right of the designer, enter your email, and receive an authentic sample pass instantly." },
          { q: "Can attendees print their ticket on paper?", a: "Yes! The designer supports both Mobile and PDF formats. The printable PDF includes clear cut-along dashed guidelines and event info." },
          { q: "What templates are available?", a: "URPASS includes three handcrafted templates: Minimal (editorial Swiss typography), Modern (contemporary brand accent strip), and Dark (high-contrast dark mode)." },
          { q: "Is custom ticket design available for Indian events?", a: "Yes! Ticket Designer is available across India with full Razorpay ticketing, INR currency support, and instant QR check-in at entrance gates." },
        ],
        ctaTitle: "Start designing your ticket today",
        ctaDescription: "Free tier available · Live preview · No design skills needed",
      }}
    />
  );
}
