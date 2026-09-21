import type { Metadata } from "next";
import { CheckCircle2, Palette, Ticket, QrCode, Smartphone, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create Digital Event Passes: Design & Issuance Guide",
  description: "To create digital event passes, configure your event details and branding (custom colors, logo, and pass tiers) in an event platform like URPASS, launch an online registration link, and approve participants. Approved guests receive a responsive mobile pass with their name, ticket tier, venue details, and a verified entry QR code.",
  keywords: [
    "how to create digital event passes",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-create-digital-event-passes" },
  openGraph: {
    title: "How to Create Digital Event Passes: Design & Issuance Guide | URPASS",
    description: "To create digital event passes, configure your event details and branding (custom colors, logo, and pass tiers) in an event platform like URPASS, launch an online registration link, and approve participants. Approved guests receive a responsive mobile pass with their name, ticket tier, venue details, and a verified entry QR code.",
    url: "https://urpass.space/guides/how-to-create-digital-event-passes",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "CREATION GUIDE",
        h1: "How to Create Digital Event Passes for Modern Events",
        canonicalUrl: "https://urpass.space/guides/how-to-create-digital-event-passes",
        description: "To create digital event passes, configure your event details and branding (custom colors, logo, and pass tiers) in an event platform like URPASS, launch an online registration link, and approve participants. Approved guests receive a responsive mobile pass with their name, ticket tier, venue details, and a verified entry QR code.",
        ctaLabel: "Design digital passes free",
        features: [
          { icon: Palette, title: "Branded Aesthetic Presets", desc: "Choose between Minimal, Modern, or Dark themes crafted specifically for smartphone legibility and prestige." },
          { icon: Ticket, title: "Custom Accent Colors", desc: "Apply your organization's exact brand hex color to create sleek, cohesive ticket designs." },
          { icon: QrCode, title: "Dynamic Attendee Data", desc: "Each pass automatically populates with the attendee's name, unique pass token, and assigned ticket tier." },
          { icon: Smartphone, title: "Mobile Browser Delivery", desc: "Passes render as lightweight, responsive web pages accessible via any smartphone browser with zero app installation." },
          { icon: ShieldCheck, title: "Apple Wallet Integration", desc: "iOS users can add their digital pass directly into Apple Wallet for convenient lock-screen presentation." },
          { icon: Users, title: "High-Speed Door Scanning", desc: "High-contrast QR codes scan in under 0.3s at event gates using standard phone cameras." },
        ],
        steps: [
          { n: "01", title: "Open Pass Studio", desc: "Navigate to Ticket Design in your URPASS organizer dashboard." },
          { n: "02", title: "Upload Logo & Color", desc: "Upload your organization logo and choose your brand accent color." },
          { n: "03", title: "Toggle Display Fields", desc: "Choose whether to show attendee name, ticket tier pill, and venue." },
          { n: "04", title: "Publish Registration", desc: "Share your event signup link to collect attendee registrations." },
          { n: "05", title: "Verify at the Door", desc: "Scan passes with your phone browser for instant valid/duplicate checks." },
        ],
        callout: {
          badge: "ZERO PRINTING",
          title: "Ditch paper tickets and plastic lanyard badges.",
          description: "Physical tickets get lost, cost thousands of rupees to print, and create massive litter. Digital passes live securely on your attendees' phones and update instantly if event details change.",
          bullets: [
            "100% paperless with zero printing and shipping costs",
            "Real-time pass invalidation if tickets are cancelled",
            "Instant duplicate detection at all entrance gates",
            "Native Apple Wallet and mobile web support",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Tech Summits",
          "Hackathons & Buildathons",
          "Academic Workshops",
          "VIP Networking Galas",
          "Corporate Conferences",
        ],
        faqs: [
          { q: "Can I customize the digital pass with my college or company logo?", a: "Yes. You can upload high-resolution logos and set custom brand colors directly in the URPASS pass designer." },
          { q: "Do attendees need an app to open their digital pass?", a: "No. The digital pass opens directly in mobile Safari, Chrome, or any standard web browser via a secure link." },
          { q: "Can attendees save their pass for offline viewing?", a: "Yes. Attendees can save the pass to Apple Wallet, add a bookmark shortcut to their home screen, or take a screenshot." },
          { q: "Can passes be used for different tiers like VIP or Student?", a: "Yes. You can configure multiple ticket classes, and the digital pass prominently displays the attendee's specific tier badge." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
