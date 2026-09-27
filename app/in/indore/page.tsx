import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Indore — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Indore and Madhya Pradesh. Built for Brilliant Convention Centre summits, college fests (IIM Indore, IIT Indore, DAVV, SGSITS), and Super Corridor tech meetups. Free to start.",
  keywords: [
    "event registration Indore",
    "QR check in Indore",
    "Indore college fest passes",
    "IIM Indore event ticketing",
    "IIT Indore hackathons",
    "Brilliant Convention Centre event passes",
    "event management software Madhya Pradesh",
    "Razorpay event ticketing Indore",
  ],
  alternates: { canonical: "https://urpass.space/in/indore" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Indore | URPASS",
    description:
      "Indore's premier event registration and digital QR pass platform for college fests, Brilliant Convention Centre summits, and IT conferences.",
    url: "https://urpass.space/in/indore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Indore, Madhya Pradesh, India",
    "geo.position": "22.7196;75.8577",
    ICBM: "22.7196, 75.8577",
  },
};

export default function IndorePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · INDORE & MP",
        h1: "Event Registration & QR Check-In for Indore Events",
        canonicalUrl: "https://urpass.space/in/indore",
        geo: {
          region: "IN-MP",
          placename: "Indore, Madhya Pradesh, India",
          position: "22.7196;75.8577",
          latitude: 22.7196,
          longitude: 75.8577,
        },
        description:
          "Trusted across Indore and Central India for startup conferences, premier institute fests, industrial trade expos, and academic symposiums. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Indore event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier Institute Fests",
            desc: "Designed for IIM Indore, IIT Indore, DAVV, SGSITS, and Medi-Caps University youth festivals, symposiums, and hackathons.",
          },
          {
            icon: Building2,
            title: "Brilliant Convention Centre & Expos",
            desc: "Rapid entry gates and automated badge generation for business summits and manufacturing trade fairs in Vijay Nagar.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Commission",
            desc: "Sell delegate passes and concert tickets with zero per-ticket cuts. 100% of revenue settles directly into your linked bank account.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Attendees receive crisp mobile QR passes that load in browsers without app downloads, complete with Apple Wallet compatibility.",
          },
          {
            icon: ScanLine,
            title: "Fast Smartphone Scanning",
            desc: "Volunteer scan attendants scan QR passes in under 0.3s using any mobile camera with distinct audio chimes.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Multi-gate atomic synchronization blocks screenshot pass sharing and unauthorized re-entry across all entrances.",
          },
        ],
        callout: {
          badge: "INDORE VENUES",
          title: "From Brilliant Convention Centre to Super Corridor Auditoriums.",
          description:
            "Known as India's cleanest city and a burgeoning tech and education capital, Indore hosts national startup summits, business conclaves, and massive youth festivals. URPASS guarantees zero-delay gate flow.",
          bullets: [
            "Conventions and expos at Brilliant Convention Centre, Scheme 78, Vijay Nagar",
            "IIM Indore Iris & Atharv cultural festivals and management conclaves",
            "IIT Indore Fluxus technical symposiums, robotics cups, and hackathons",
            "Tech meetups and founder demo days across Crystal IT Park & Super Corridor",
          ],
        },
        useCases: [
          "IIM Indore management conclaves & cultural festivals",
          "IIT Indore Fluxus national tech symposium & hackathons",
          "Brilliant Convention Centre industrial expos and pharma summits",
          "Super Corridor & Crystal IT Park startup conferences",
          "DAVV & SGSITS engineering symposiums and youth fests",
          "Trade shows at Labh Mandapam & Abhay Prashal",
          "Corporate training bootcamps at Indore Marriott & Radisson Blu",
          "Food, music, and cultural fests across Indore",
        ],
        relatedLinks: [
          {
            title: "Event Registration Bhopal",
            href: "/in/bhopal",
            category: "Location",
          },
          {
            title: "Event Registration Ahmedabad",
            href: "/in/ahmedabad",
            category: "Location",
          },
          {
            title: "Event Registration Pune",
            href: "/in/pune",
            category: "Location",
          },
          {
            title: "Event Registration Mumbai",
            href: "/in/mumbai",
            category: "Location",
          },
          {
            title: "Event Registration India Hub",
            href: "/in",
            category: "Location",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
        ],
        faqs: [
          {
            q: "Is URPASS used for college fests in Indore?",
            a: "Yes. Event organizers at universities across Indore, including IIM Indore, IIT Indore, DAVV, and SGSITS, use URPASS for registration forms, QR passes, and gate validation.",
          },
          {
            q: "How does gate check-in work at Brilliant Convention Centre?",
            a: "Gate attendants open a secure scanner link on any smartphone browser. Passes are scanned in under 0.3 seconds with confirmation chimes and haptic buzzes, keeping queues moving rapidly.",
          },
          {
            q: "Can attendees pay via UPI for Indore events?",
            a: "Yes. URPASS integrates directly with Razorpay, supporting instant UPI payments (PhonePe, Google Pay, Paytm, BHIM), RuPay cards, and net banking with direct T+2 settlement.",
          },
          {
            q: "Does URPASS take any commission on ticket sales in Indore?",
            a: "No. URPASS charges 0% ticketing commission. Organizers pay a predictable flat software subscription starting at ₹499/mo, or use the ₹0 Free tier for smaller community events.",
          },
          {
            q: "Can we issue GST-compliant tax invoices for corporate delegates?",
            a: "Yes. You can capture business GSTIN details at checkout and automatically issue compliant invoices with SAC codes and organization tax information.",
          },
          {
            q: "Does URPASS work offline during network slowdowns at event venues?",
            a: "Yes. In-browser offline mode allows passes to be verified locally against a secure cache even when mobile cellular networks are congested.",
          },
        ],
        ctaTitle: "Start your Indore event on URPASS",
        ctaDescription:
          "Free tier available · Instant UPI payments · Sub-second QR check-in · Built for Indore & MP events",
      }}
    />
  );
}
