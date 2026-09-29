import type { Metadata } from "next";
import {
  HeartHandshake,
  QrCode,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Users,
  Smartphone,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Registration Software UK — 100% Free | URPASS",
  description:
    "Free event registration and QR check-in software for UK community meetups, charity events, and societies. 100% free forever for up to 100 registrations/month. No credit card required, UK GDPR compliant.",
  keywords: [
    "free event registration software uk",
    "free ticketing platform uk",
    "free event check-in software uk",
    "free community event ticketing uk",
    "charity event registration free uk",
    "free meetup ticket scanner uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/free-event-registration",
    languages: {
      "en-GB": "https://urpass.space/uk/free-event-registration",
      "x-default": "https://urpass.space/free-event-registration",
    },
  },
  openGraph: {
    title: "Free Event Registration Software UK — 100% Free | URPASS",
    description:
      "Host free events, community meetups, and charity gatherings across the UK with zero costs. Digital QR passes and sub-second phone scanning included.",
    url: "https://urpass.space/uk/free-event-registration",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkFreeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/free-event-registration",
        badge: "UK FREE COMMUNITY TIER · £0 FOREVER",
        h1: "Free Event Registration Software for UK Events & Meetups",
        description:
          "Organise community gatherings, charity fundraisers, book clubs, and local meetups without spending a penny. URPASS offers a genuine free tier with digital QR passes, mobile camera scanning, and zero hidden platform charges.",
        ctaLabel: "Get Started Free Forever",

        directAnswer: {
          title: "Is URPASS truly free for UK event organisers?",
          summary:
            "Yes. URPASS provides a genuine Free Forever plan specifically intended for UK community groups, non-profits, student societies, and free meetups. Organisers can collect up to 100 registrations per month across unlimited events, issue automated digital QR passes, and scan attendees using smartphone browsers with zero upfront fees, zero ticket commissions, and no credit card required to sign up.",
          keyPoints: [
            "Free forever for up to 100 registrations per month",
            "Zero platform commission and no hidden booking fees",
            "Automated digital QR pass delivery and sub-second smartphone scanning",
            "Strict UK GDPR compliance and full attendee privacy protection",
          ],
        },

        features: [
          {
            icon: HeartHandshake,
            title: "100% Free Forever",
            desc: "Ideal for local meetups, charities, and grassroots communities. Host events with up to 100 registrations per month completely free of charge.",
          },
          {
            icon: QrCode,
            title: "Automated QR Passes",
            desc: "Attendees receive clean, branded digital QR passes via email, ready to be presented on their phone screens at the door.",
          },
          {
            icon: ScanLine,
            title: "Smartphone Browser Scanner",
            desc: "Check in guests in under 0.3 seconds using any volunteer's mobile camera without downloading native apps from the App Store.",
          },
          {
            icon: Users,
            title: "Attendee Management",
            desc: "Search, filter, view status, and export your guest list to CSV for easy record-keeping and volunteer coordination.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Compliant",
            desc: "We respect your community's privacy. Guest data is never monetized, sold to advertisers, or used for unsolicited cross-marketing.",
          },
          {
            icon: Sparkles,
            title: "Instant Setup",
            desc: "Create your free account, set up your event details, and publish your registration page in less than three minutes.",
          },
        ],

        useCases: [
          "Local Community Groups & Book Clubs",
          "Charity Information Evenings & Fundraisers",
          "Open Source Developer Meetups",
          "University Student Society Socials",
          "Grassroots Sports Clubs & Park Runs",
          "Faith Community & Cultural Gatherings",
        ],

        relatedLinks: [
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Student Union Event Ticketing",
            href: "/uk/student-union-event-ticketing",
            category: "Use Case",
          },
          {
            title: "Edinburgh Event Registration & Check-In",
            href: "/uk/edinburgh",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Do I need to enter credit card details to use the free plan?",
            a: "No. You can sign up and start publishing free events immediately without providing credit card, debit card, or payment gateway details.",
          },
          {
            q: "What happens if my event needs more than 100 registrations?",
            a: "If your event exceeds 100 registrations in a month, you can easily upgrade to our Starter tier (£15/month for 500 registrations) or Pro tier (£35/month for 2,500 registrations), or take advantage of our 30-day free trial on any paid tier.",
          },
          {
            q: "Does URPASS place third-party ads on my registration page?",
            a: "No. Your event page remains clean and professional. We never display third-party advertisements or recommend competitor events to your attendees.",
          },
        ],

        ctaTitle: "Host your community event for free",
        ctaDescription:
          "Create your free account on URPASS today. Instant setup, zero cost, and lightning-fast QR check-in.",
      }}
    />
  );
}
