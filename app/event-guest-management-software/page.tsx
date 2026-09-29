import type { Metadata } from "next";
import {
  Users,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Guest Management Software with QR Check-In | URPASS",
  description:
    "Manage event guest lists, VIP invitations, RSVPs, and entrance scanning with URPASS. Deliver digital QR passes and eliminate door lines in 0.28s.",
  keywords: [
    "event guest management software",
    "guest list check in app",
    "event rsvp and guest management",
    "vip guest list software",
    "event guest tracking software",
    "free guest management software",
  ],
  alternates: {
    canonical: "https://urpass.space/event-guest-management-software",
  },
  openGraph: {
    title: "Event Guest Management Software with QR Check-In | URPASS",
    description:
      "All-in-one guest list management and fast entrance check-in. Deliver personalized digital QR passes and eliminate gate lines.",
    url: "https://urpass.space/event-guest-management-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventGuestManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-guest-management-software",
        badge: "GUEST & RSVP OPERATIONS",
        h1: "Event Guest Management Software With QR Check-In",
        description:
          "The modern guest list management and door reception solution for private receptions, corporate galas, and invitation-only gatherings. Manage VIP categories, issue encrypted digital passes, and welcome guests with 0.28s entrance check-in.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How URPASS Modernizes Guest List Management",
          summary:
            "Managing paper guest lists or looking up names on clipboards creates awkward delays and leaves private events vulnerable to uninvited gate-crashers. URPASS modernizes guest management by providing invite-only RSVP forms, personalized digital QR credentials delivered directly to guest smartphones, and in-browser camera scanning that confirms guest names and VIP tiers in under 0.28 seconds.",
          keyPoints: [
            "Seamless Guest Onboarding: Share private RSVP links or approve guest requests in one click",
            "Rapid Door Reception: Check in guests in under 0.28 seconds without searching clipboards or sheets",
            "VIP Category Management: Distinguish VIP, Speaker, and General guests with distinct badge highlights",
            "Permanent Free Tier: ₹0 forever for community and club gatherings with up to 50 guests",
          ],
        },
        productProof: {
          badge: "VIP RECEPTION",
          title: "Sub-Second In-Browser Scanner",
          description:
            "Door hosts scan guest passes on any phone browser. Instant confirmation of guest name, plus-one status, and VIP tier.",
          type: "scanner",
        },
        features: [
          {
            icon: Users,
            title: "VIP & Plus-One Management",
            desc: "Easily categorize VIPs, speakers, media, and general guests. Manage allowed plus-ones directly on their credentials.",
          },
          {
            icon: QrCode,
            title: "Encrypted Digital Guest Passes",
            desc: "Deliver elegant mobile passes with guest name, category, and Apple/Google Wallet integration.",
          },
          {
            icon: ScanLine,
            title: "0.28s Door Check-In",
            desc: "Reception hosts scan passes on personal smartphones with zero app downloads or bulky barcode scanners.",
          },
          {
            icon: ShieldCheck,
            title: "Strict Guestlist Security",
            desc: "Prevent unauthorized entry and shared invitations with instant cloud verification and duplicate pass lockout.",
          },
          {
            icon: Smartphone,
            title: "Private RSVP Forms",
            desc: "Create password-protected or unlisted RSVP links tailored specifically for private guest networks.",
          },
          {
            icon: BarChart3,
            title: "Live Door Arrival Logs",
            desc: "Monitor VIP arrivals in real time, see who has arrived, and export complete guest rosters with arrival timestamps.",
          },
        ],
        steps: [
          { n: "01", title: "Build Guestlist", desc: "Set up guest categories, allowed quotas, and private RSVP links in 2 minutes." },
          { n: "02", title: "Send Invites", desc: "Share invitation links via WhatsApp, email, or private messaging channels." },
          { n: "03", title: "Deliver Passes", desc: "Confirmed guests receive personalized digital passes with mobile wallet support." },
          { n: "04", title: "Welcome at Door", desc: "Reception staff scan badges in under 0.28s to welcome guests smoothly." },
        ],
        callout: {
          badge: "ELEGANT RECEPTION",
          title: "Give your guests the effortless welcome they deserve",
          description:
            "Replace awkward paper clipboard searches with seamless, contactless smartphone scanning.",
          bullets: [
            "Permanent free plan available with full guest tracking",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Multi-gate cloud synchronization across all reception doors",
            "One-click CSV exports with verified guest arrival timestamps",
          ],
        },
        useCases: [
          "Private corporate galas & executive dinners",
          "Product launches & VIP networking receptions",
          "Alumni gatherings & exclusive club events",
          "Art gallery openings & charity fundraisers",
          "Community award nights & anniversary banquets",
        ],
        faqs: [
          {
            q: "Can I manage private, invitation-only guest lists?",
            a: "Yes! You can configure your event to require organizer approval for all registrations, ensuring only approved guests receive digital entry passes.",
          },
          {
            q: "Can I use URPASS for a free event or private party?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 guests per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "Do reception hosts need special scanning hardware?",
            a: "No! Hosts simply open a private scanner link in Safari or Chrome on their personal smartphones. The camera scans passes in under 0.28 seconds with zero app installations.",
          },
          {
            q: "Can I see which VIP guests have arrived in real time?",
            a: "Yes. Your organizer dashboard updates live as guests check in at the entrance, so your hospitality team knows exactly when key VIPs have entered the venue.",
          },
        ],
        ctaTitle: "Manage your guest list with elegance",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
