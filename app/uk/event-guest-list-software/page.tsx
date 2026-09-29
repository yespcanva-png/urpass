import type { Metadata } from "next";
import {
  Users,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  ScanLine,
  Sparkles,
  Smartphone,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Guest List Software UK — VIP & Private Events | URPASS",
  description:
    "UK event guest list software for VIP receptions, private clubs, PR launches, and exclusive member parties. Manage plus-ones, discreet door lookups, QR entry, and UK GDPR privacy.",
  keywords: [
    "event guest list software uk",
    "vip guest list app uk",
    "private event check-in software uk",
    "pr event guest list manager",
    "guest list door check-in uk",
    "exclusive party guest list software",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-guest-list-software",
    languages: {
      "en-GB": "https://urpass.space/uk/event-guest-list-software",
      "x-default": "https://urpass.space/event-guest-management",
    },
  },
  openGraph: {
    title: "Event Guest List Software UK — VIP & Private Events | URPASS",
    description:
      "Manage high-profile guest lists, plus-ones, and private VIP check-ins across the UK with complete discretion and sub-second entry validation.",
    url: "https://urpass.space/uk/event-guest-list-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventGuestListSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-guest-list-software",
        badge: "UK PRIVATE EVENTS · VIP GUEST LIST CONTROL",
        h1: "Event Guest List Software for UK Private Events & VIPs",
        description:
          "Coordinate exclusive PR launches, private dining clubs, film premieres, and high-profile receptions. Manage bespoke invitations, track plus-ones, and admit guests with discreet, rapid smartphone lookups or digital QR passes.",
        ctaLabel: "Set Up Your Guest List Free",

        directAnswer: {
          title: "How does URPASS manage VIP and private event guest lists in the UK?",
          summary:
            "URPASS is designed for UK private events, member clubs, and luxury brands that require discretion, precision, and frictionless guest entry. Organizers can import or curate private guest rosters, approve plus-ones, send personalized invitations with private digital passes, and manage door arrivals via discreet name searches or sub-second camera scanning—all without exposing attendee contact data to door hosts or violating UK GDPR standards.",
          keyPoints: [
            "Curate invite-only guest lists with customized plus-one allocations",
            "Discreet smartphone door check-in via rapid search or private QR pass",
            "Door host mode hides sensitive VIP phone numbers and financial details",
            "Full UK GDPR compliance protecting high-profile attendee privacy",
          ],
        },

        features: [
          {
            icon: Users,
            title: "Private Guest Lists",
            desc: "Upload guest rosters from CSV or add names manually. Assign custom tags such as VIP, Press, Celebrity, Brand Ambassador, or Sponsor.",
          },
          {
            icon: Lock,
            title: "Plus-One Management",
            desc: "Allow invited guests to RSVP with a named plus-one while enforcing strict total capacity limits for intimate venues.",
          },
          {
            icon: Search,
            title: "Discreet Door Lookup",
            desc: "Hosts can search guests instantly by first or last name on their smartphones, checking them in with an elegant, silent tap.",
          },
          {
            icon: ScanLine,
            title: "Optional VIP QR Scanning",
            desc: "For larger receptions, guests can present their mobile digital pass for lightning-fast <0.3s camera check-in at the velvet rope.",
          },
          {
            icon: ShieldCheck,
            title: "Host Privacy Mode",
            desc: "Restricted door access ensures that temporary door staff see only guest names and dietary notes—never personal contact numbers or emails.",
          },
          {
            icon: Sparkles,
            title: "Real-Time Capacity Headcount",
            desc: "Track live occupancy inside the venue to satisfy venue license terms and maintain an exclusive, uncrowded atmosphere.",
          },
        ],

        useCases: [
          "Luxury Brand & Fashion PR Launches",
          "Private Member Club Socials & Dinners",
          "Film Premieres & Media Screenings",
          "Executive VIP Dinners & Investor Salons",
          "Art Gallery Openings & Private Views",
          "Exclusive Celebrity Afterparties",
        ],

        relatedLinks: [
          {
            title: "Attendee Management Software UK",
            href: "/uk/attendee-management-software",
            category: "Product",
          },
          {
            title: "Digital Event Passes UK",
            href: "/uk/digital-event-passes",
            category: "Product",
          },
          {
            title: "Event Check-In Software UK",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Edinburgh Event Registration & Check-In",
            href: "/uk/edinburgh",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can door hosts check in guests without scanning a QR code?",
            a: "Yes. Door staff can use the real-time search bar in the scanner interface to find the guest's name and tap 'Check In'. QR scanning is completely optional.",
          },
          {
            q: "How does URPASS ensure discretion for VIP guests?",
            a: "Door staff log in using a restricted PIN that displays only attendee names, ticket tier (e.g. VIP Table 1), and dietary requirements. Contact information, email addresses, and phone numbers remain hidden.",
          },
          {
            q: "Can I manage plus-one names and dietary requirements?",
            a: "Yes. Organisers can require primary guests to provide the full name and dietary preferences of their plus-one during the RSVP process.",
          },
        ],

        ctaTitle: "Manage your private guest list with discretion",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Elegant guest management, plus-one controls, and complete UK GDPR privacy.",
      }}
    />
  );
}
