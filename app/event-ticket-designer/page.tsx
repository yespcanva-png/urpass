import type { Metadata } from "next";
import { Sliders, Palette, Sparkles, QrCode, Ticket, Eye, ArrowRight, CheckCircle2, Layers } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Ticket Designer | URPASS",
  description: "Design custom digital event tickets and QR passes with a visual real-time editor. Choose themes, customize colors, upload logos, and preview on mobile.",
  keywords: [
    "online event ticket designer",
    "event ticket designer",
    "design event passes",
    "digital ticket maker",
    "custom event pass creator",
    "event ticket design online",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-designer" },
  openGraph: {
    title: "Online Event Ticket Designer | URPASS",
    description: "Design custom digital event tickets and QR passes with a visual real-time editor.",
    url: "https://urpass.space/event-ticket-designer",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "VISUAL TICKET DESIGNER",
        h1: "Design Professional Digital Event Tickets",
        canonicalUrl: "https://urpass.space/event-ticket-designer",
        description:
          "An online event ticket designer gives organizers the creative tools to build stunning digital event passes with real-time visual canvas editing, custom brand palettes, dynamic attendee merge fields, and tamper-proof QR codes. URPASS requires zero graphic design background to generate sleek, mobile-ready event passes.",
        ctaLabel: "Launch Ticket Designer",
        features: [
          { icon: Eye, title: "Real-Time Visual Canvas", desc: "See your ticket update instantly as you change colors, logos, fonts, and tier badges in the WYSIWYG editor." },
          { icon: Palette, title: "Pre-Built Designer Themes", desc: "Select from curated modern aesthetics including Dark Minimalist, Cyberpunk, Neo-Corporate, and Vibrant Festival." },
          { icon: Sliders, title: "Dynamic Attendee Merge Tags", desc: "Automatically insert attendee name, ticket tier, order ID, seat number, and QR code onto every pass." },
          { icon: Sparkles, title: "Custom Branding Elements", desc: "Upload high-res logos, customize secondary accents, and add custom footer notes or entrance instructions." },
          { icon: Layers, title: "Multi-Tier Design Variations", desc: "Customize distinct color ways and layout nuances for General Admission, VIP, Speaker, and Press passes." },
          { icon: QrCode, title: "Cryptographic QR Integration", desc: "Every design embeds a high-contrast, sub-second readable QR code verified by volunteer phone scanners." },
        ],
        steps: [
          { n: "01", title: "Open Visual Canvas", desc: "Select an existing event or create a new pass design from your organizer dashboard." },
          { n: "02", title: "Pick a Color Theme", desc: "Choose your primary brand hue, background dark/light mode, and accent gradient styling." },
          { n: "03", title: "Add Custom Graphics", desc: "Upload your organization logo and partner sponsor badges with instant positioning." },
          { n: "04", title: "Preview Live on Mobile", desc: "Toggle between desktop ticket cutout, mobile pass view, and A4 print layout in real time." },
          { n: "05", title: "Publish & Auto-Generate", desc: "Save your design; URPASS automatically generates unique customized passes for every registrant." },
        ],
        callout: {
          badge: "ZERO GRAPHIC SKILLS NEEDED",
          title: "Build agency-grade passes without Photoshop or Canva.",
          description: "Designing tickets in external design tools means hours spent manually typesetting attendee names or running mail merges that break on mobile screens. URPASS's ticket designer programmatically renders pixel-perfect, responsive passes for every single attendee.",
          bullets: [
            "Responsive layout adapts automatically to iPhone, Android, and printable PDF",
            "High-contrast QR placement guarantees instant optical reads in bright daylight or dark clubs",
            "Automatic attendee data merge with zero manual editing required",
            "Save design presets to reuse across all your upcoming event series",
          ],
        },
        deepDiveSections: [
          {
            badge: "DESIGN MECHANICS",
            title: "How does the URPASS online ticket designer work?",
            paragraphs: [
              "The URPASS ticket designer combines an intuitive visual interface with dynamic server-side rendering. When an organizer changes a color slider or uploads an emblem, the canvas re-renders the pass immediately.",
              "Behind the scenes, the design is stored as a lightweight CSS and vector configuration. When an attendee completes registration, the engine injects the attendee's name, ticket tier, and encrypted QR token into the template, rendering both an interactive web pass and a crisp vector PDF for printing.",
            ],
            takeaway: "Template-based dynamic generation ensures high visual fidelity across thousands of unique attendee passes.",
          },
          {
            badge: "GATE READABILITY",
            title: "Why is QR contrast critical when designing event tickets?",
            paragraphs: [
              "Many custom ticket designs fail on event day because organizers place dark QR codes on dark backgrounds or overly busy patterns, causing phone camera sensors to struggle to lock focus.",
              "URPASS's ticket designer automatically enforces optical QR quiet zones and high-contrast bounding boxes, ensuring that even dimly lit entrance gates or glare from outdoor sunlight will not slow down check-in queues.",
            ],
            takeaway: "Intelligent optical boundaries guarantee your passes scan in under 0.3 seconds regardless of lighting conditions.",
          },
        ],
        faqs: [
          {
            q: "Can I design different passes for different ticket categories within the same event?",
            a: "Yes. You can assign unique colors, badge headers, and entrance instructions to each individual ticket tier.",
          },
          {
            q: "Do I need to download design software like Canva or Figma?",
            a: "No. The ticket designer runs 100% inside your browser on the URPASS organizer dashboard.",
          },
          {
            q: "Can attendees save their designed pass to Apple Wallet?",
            a: "Yes. All custom designs translate cleanly into Apple Wallet and Google Wallet compatible pass bundles.",
          },
        ],
        relatedLinks: [
          { title: "Custom Branded Event Tickets", href: "/branded-event-tickets", category: "Product" },
          { title: "Design Your Ticket Online", href: "/design-your-ticket", category: "Product" },
          { title: "Event Badge Generator", href: "/event-badge-generator", category: "Product" },
          { title: "Event Registration Form Builder", href: "/event-registration-form-builder", category: "Product" },
        ],
      }}
    />
  );
}
