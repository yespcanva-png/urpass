import type { Metadata } from "next";
import { Palette, Sparkles, QrCode, ShieldCheck, Ticket, Layers, ArrowRight, CheckCircle2, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Custom Branded Event Tickets & QR Passes | URPASS",
  description: "Create branded digital event tickets with custom brand colors, logos, sponsor banners, and Apple/Google Wallet integration. Stand out with premium passes.",
  keywords: [
    "branded event tickets",
    "custom branded event tickets",
    "white label event passes",
    "custom QR tickets",
    "digital ticket branding",
    "custom event pass design",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/branded-event-tickets" },
  openGraph: {
    title: "Custom Branded Event Tickets & QR Passes | URPASS",
    description: "Create branded digital event tickets with custom brand colors, logos, and sponsor banners.",
    url: "https://urpass.space/branded-event-tickets",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TICKET BRANDING",
        h1: "Create Branded Digital Tickets for Events",
        canonicalUrl: "https://urpass.space/branded-event-tickets",
        description:
          "Branded event tickets showcase your company logo, custom brand color palette, sponsor emblems, and typography directly on attendee passes and confirmation emails. URPASS empowers organizers to design professional digital passes with real-time visual previews, Apple/Google Wallet support, and sub-0.3s entrance scanning.",
        ctaLabel: "Design Branded Tickets",
        features: [
          { icon: Palette, title: "Custom Color Schemes & Themes", desc: "Select primary and secondary brand colors, gradients, and dark/light contrast modes tailored to your event identity." },
          { icon: Sparkles, title: "Logo & Sponsor Placement", desc: "Showcase organizer logos, headline sponsors, and institutional crests prominently on both digital and printable passes." },
          { icon: Smartphone, title: "Mobile Wallet Compatibility", desc: "Attendees can save their high-resolution pass directly to Apple Wallet and Google Wallet with lockscreen notifications." },
          { icon: QrCode, title: "Dynamic High-Density QR Codes", desc: "Cryptographic, tamper-proof QR codes update dynamically to eliminate screenshot replication and fraudulent entry." },
          { icon: Layers, title: "Tier-Specific Pass Badging", desc: "Design distinct visual looks for VIP, Speaker, General Admission, and Volunteer passes for instant gate recognition." },
          { icon: ShieldCheck, title: "White-Label Experience", desc: "Remove vendor branding and present a clean, direct brand experience from registration to physical entry." },
        ],
        steps: [
          { n: "01", title: "Upload Brand Assets", desc: "Add your high-resolution event logo, sponsor graphics, and primary brand hex codes." },
          { n: "02", title: "Customize Pass Canvas", desc: "Adjust ticket gradients, font styles, footer notes, and entrance guidelines in the live designer." },
          { n: "03", title: "Configure Tier Variations", desc: "Assign custom accent colors and badge tags for VIPs, Delegates, Students, and Staff." },
          { n: "04", title: "Automate Email Delivery", desc: "Branded confirmation emails deliver the personalized digital pass with 1-click calendar sync." },
          { n: "05", title: "Instant Gate Check-in", desc: "Gate staff scan the pass on mobile; screen flashes green with attendee name and ticket tier." },
        ],
        callout: {
          badge: "PROFESSIONAL IDENTITY",
          title: "Your event deserves better than generic, black-and-white receipts.",
          description: "Generic ticketing portals paste their own massive logos across your tickets while burying your event brand in fine print. URPASS puts your brand front and center, ensuring your attendees experience your prestige from the instant they receive their ticket.",
          bullets: [
            "Full brand control: your colors, your logos, and your sponsor mentions",
            "Delight attendees with premium Apple & Google Wallet mobile passes",
            "Clear visual tier indicators make VIP gate routing effortless for staff",
            "Print-ready PDF layout available for attendees who prefer physical badges",
          ],
        },
        deepDiveSections: [
          {
            badge: "BRAND EXPERIENCE",
            title: "Why does branded event ticket design matter for conferences and summits?",
            paragraphs: [
              "A ticket is often the first tangible touchpoint an attendee interacts with after registering. When an attendee opens a beautifully branded digital pass on their phone, it builds anticipation and sets high expectations for the physical event.",
              "For sponsors, prime placement on thousands of attendee digital passes provides verified visual impressions with every entrance scan and screenshot share on social media.",
            ],
            takeaway: "Branded tickets reinforce event credibility and provide measurable exposure for commercial sponsors.",
          },
          {
            badge: "OPERATIONAL BENEFITS",
            title: "How do custom ticket designs accelerate physical gate entry?",
            paragraphs: [
              "When security staff and volunteers are managing thousands of attendees at a venue entrance, deciphering small text on a phone screen slows lines down significantly.",
              "By assigning distinct visual themes (such as gold borders for VIPs, purple for General Admission, and blue for Speakers), gate staff can immediately identify attendee status at a glance before the QR code is even scanned.",
            ],
            takeaway: "Visual pass differentiation reduces gate hesitation and accelerates line throughput during morning arrival rushes.",
          },
        ],
        faqs: [
          {
            q: "Can I remove the 'Powered by URPASS' watermark from tickets?",
            a: "Yes. Pro and Business plans include white-label capabilities that remove vendor branding from passes and emails.",
          },
          {
            q: "Do branded tickets work on Apple Wallet and Android devices?",
            a: "Yes. URPASS generates standards-compliant passes that save seamlessly to Apple Wallet and Android wallet applications.",
          },
          {
            q: "Can attendees print out their branded passes on paper?",
            a: "Yes. Every pass features a clean, high-resolution A4 printable layout optimized for desktop and badge printers.",
          },
        ],
        relatedLinks: [
          { title: "Online Event Ticket Designer", href: "/event-ticket-designer", category: "Product" },
          { title: "Custom Pass Design", href: "/custom-pass-design", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
          { title: "Corporate Event Registration", href: "/corporate-events", category: "Use Case" },
        ],
      }}
    />
  );
}
