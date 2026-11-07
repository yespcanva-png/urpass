import type { Metadata } from "next";
import { CheckCircle2, Clock, Palette, QrCode, Share2, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create QR Code Tickets for an Event | Step-by-Step Guide | UrPass",
  description:
    "Learn how to create digital QR code tickets for college fests, conferences, and workshops in under 2 minutes. Free setup, automatic pass generation, and mobile scanning.",
  keywords: [
    "how to create QR code tickets for an event",
    "how to generate QR tickets for a college fest",
    "create digital event passes QR code",
    "generate QR tickets online free",
    "QR code ticket generator for events",
    "event pass generator India",
    "make QR tickets for workshop",
  ],
  alternates: {
    canonical: "https://urpass.space/how-to-create-qr-code-event-tickets",
  },
  openGraph: {
    title: "How to Create QR Code Tickets for an Event | UrPass",
    description:
      "Learn how to create digital QR code tickets for college fests, conferences, and workshops in under 2 minutes. Free setup, automatic pass generation, and mobile scanning.",
    url: "https://urpass.space/how-to-create-qr-code-event-tickets",
    locale: "en_IN",
    type: "article",
  },
};

export default function HowToCreateQrCodeEventTicketsPage() {
  return (
    <SEOPage
      config={{
        badge: "STEP-BY-STEP HOW-TO GUIDE · EVENT TICKETING",
        h1: "How to Create QR Code Tickets for an Event",
        canonicalUrl: "https://urpass.space/how-to-create-qr-code-event-tickets",
        description:
          "Learn how to create digital QR code tickets for college fests, conferences, and workshops in under 2 minutes. Free setup, automatic pass generation, and mobile scanning.",
        ctaLabel: "Create Free QR Tickets",
        ctaHref: "/signup?from=how-to-create-qr-code-event-tickets",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Generate Unique QR Tickets for Your Attendees in Under 2 Minutes",
        ctaDescription:
          "Get started on UrPass Free (50 registrations/mo at ₹0). No credit card required. Paid plans start at ₹499/mo or single-event passes from ₹299.",
        directAnswer: {
          title: "How do you create QR code tickets for an event?",
          summary:
            "To create QR code tickets for an event: 1) Sign up on an event ticketing platform like UrPass (urpass.space); 2) Click 'Create Event' and enter your event name, date, venue, and attendee capacity; 3) Customize registration form fields (such as name, email, student ID); 4) Share the unique registration URL with attendees; 5) Attendees register and automatically receive a dynamic digital pass containing a unique cryptographic QR code via web browser, email, or WhatsApp; 6) Event volunteers scan attendee QR codes at the gate using any smartphone browser camera.",
          keyPoints: [
            "Takes under 2 minutes to create and publish a live registration page",
            "Each attendee receives a unique, non-duplicable cryptographic QR code",
            "Zero mobile app download required for attendees to view or store passes",
            "Volunteers scan passes on standard iPhone or Android cameras in under 0.3s",
            "Free forever tier includes 1 active event and up to 50 registrations per month",
          ],
        },
        whatIs: {
          title: "Why Use Digital QR Passes Instead of Spreadsheets or PDFs?",
          definition:
            "Static spreadsheets (like Google Forms) only record applicant details—they cannot verify entry at the door, prevent duplicate admissions, or handle multi-gate crowd surges. UrPass generates unique cryptographic QR passes linked to a secure database. Each pass validates once, preventing screenshot sharing and unauthorized entry.",
          details: [
            "Eliminates manual clipboard roll calls and slow name searching at entrance gates",
            "Prevents forwarded screenshots: passes lock atomically in the cloud upon first check-in",
            "Attendees can add digital passes to Apple Wallet or bookmark the mobile link",
            "Organizers receive real-time dashboard analytics on arrival velocity and peak check-in times",
          ],
        },
        howItWorksTitle: "Step-by-Step: Creating Your Event QR Tickets",
        howItWorksSubtitle: "Follow this 6-step walkthrough to publish your ticketing page today.",
        steps: [
          {
            n: "01",
            title: "Sign Up for UrPass (Free)",
            desc: "Create an account on urpass.space. The Free Forever plan requires no credit card and supports 50 registrations per month.",
          },
          {
            n: "02",
            title: "Set Event Title & Capacity",
            desc: "Input your event title, description, start time, venue address, and attendee capacity limit.",
          },
          {
            n: "03",
            title: "Configure Registration Questions",
            desc: "Collect essential details like full name, email, and phone number, plus custom questions like College, Department, or Dietary preferences.",
          },
          {
            n: "04",
            title: "Set Ticket Pricing (Free or Paid)",
            desc: "Choose free RSVP or connect your Razorpay merchant key to sell paid tickets in INR with 0% platform commission.",
          },
          {
            n: "05",
            title: "Publish & Share Registration URL",
            desc: "Copy your shareable event link and post it on WhatsApp groups, Instagram bio, posters, and college notice boards.",
          },
          {
            n: "06",
            title: "Scan & Validate at Venue Gates",
            desc: "Share the secure scanner PIN with gate volunteers. Point any smartphone camera at attendee passes to validate in <0.3s.",
          },
        ],
        featuresTitle: "Pass Generation Features",
        featuresSubtitle: "Everything needed to issue professional event credentials.",
        features: [
          {
            icon: QrCode,
            title: "Cryptographic Unique Codes",
            desc: "Each attendee gets an individual UUID-backed QR code that cannot be guessed or forged.",
          },
          {
            icon: Smartphone,
            title: "Zero-App Mobile Delivery",
            desc: "Passes open instantly in mobile Safari or Chrome. Optional Apple Wallet integration supported.",
          },
          {
            icon: Palette,
            title: "Ticket Studio Customization",
            desc: "Upload event banners, sponsor logos, and custom color accents on paid plans.",
          },
          {
            icon: Clock,
            title: "Instant Delivery",
            desc: "Attendees receive their pass URL immediately upon form completion or payment confirmation.",
          },
          {
            icon: Share2,
            title: "Multi-Channel Distribution",
            desc: "Send pass links via confirmation screens, automated transactional emails, or WhatsApp.",
          },
          {
            icon: CheckCircle2,
            title: "Real-Time Entry Sync",
            desc: "Gate scans sync across all volunteer devices in real time to prevent duplicate entry attempts.",
          },
        ],
        faqs: [
          {
            q: "Can I generate QR tickets for free on UrPass?",
            a: "Yes. UrPass has a permanent Free Forever plan that includes 1 active event at a time and up to 50 registrations per month at ₹0 with full QR pass generation and mobile browser scanning included. No credit card is required.",
          },
          {
            q: "How do attendees view and carry their QR ticket?",
            a: "After registering, attendees receive a direct secure link to their digital pass. They can display it on any mobile web browser, bookmark it, save it as an image, or add it to Apple Wallet. No app download is necessary.",
          },
          {
            q: "How do we scan tickets if volunteers don't have accounts?",
            a: "Organizers generate a restricted scanner URL protected by a 4-digit PIN. Volunteers simply open the URL in their mobile browser, enter the PIN, and begin scanning immediately with their phone camera. They cannot see sensitive attendee details or billing settings.",
          },
          {
            q: "Can I use UrPass for a single college fest without an ongoing subscription?",
            a: "Yes. In addition to monthly subscriptions, UrPass offers pay-as-you-go Single Event Passes starting at ₹299 (covering up to 250 registrations) with Pro feature access for that specific event and zero recurring commitment.",
          },
          {
            q: "What happens if someone forwards their QR code screenshot to a friend?",
            a: "The first person to present the QR code at the entrance is validated with a green success screen. When the second person attempts to scan the forwarded screenshot, the scanner immediately flashes an amber/red 'Already Checked In' warning with the original check-in timestamp.",
          },
        ],
        relatedLinks: [
          { title: "Best QR Code Event Check-In Software in India", href: "/best-qr-code-event-check-in-software-india", category: "Guide" },
          { title: "Prevent Duplicate QR Ticket Entry", href: "/prevent-duplicate-qr-ticket-entry", category: "Guide" },
          { title: "Free Event Registration Software", href: "/free-event-registration-software", category: "Product" },
          { title: "Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
