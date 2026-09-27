import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Bhopal — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Bhopal and Central India. Built for Kushabhau Thakre Convention Centre, Ravindra Bhavan summits, and college fests (MANIT, AIIMS Bhopal, IISER, RGPV). Free to start.",
  keywords: [
    "event registration Bhopal",
    "QR check in Bhopal",
    "Bhopal college fest passes",
    "MANIT Bhopal event ticketing",
    "IISER Bhopal conferences",
    "Kushabhau Thakre convention passes",
    "Minto Hall event management",
    "event management software Bhopal",
    "Razorpay event ticketing Bhopal",
  ],
  alternates: { canonical: "https://urpass.space/in/bhopal" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Bhopal | URPASS",
    description:
      "Bhopal's premier event registration and digital QR pass platform for college fests, Kushabhau Thakre conventions, and academic symposiums.",
    url: "https://urpass.space/in/bhopal",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Bhopal, Madhya Pradesh, India",
    "geo.position": "23.2599;77.4126",
    ICBM: "23.2599, 77.4126",
  },
};

export default function BhopalPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · BHOPAL & MP",
        h1: "Event Registration & QR Check-In for Bhopal Events",
        canonicalUrl: "https://urpass.space/in/bhopal",
        geo: {
          region: "IN-MP",
          placename: "Bhopal, Madhya Pradesh, India",
          position: "23.2599;77.4126",
          latitude: 23.2599,
          longitude: 77.4126,
        },
        description:
          "Trusted across Bhopal and Madhya Pradesh for national academic conferences, premier institute fests, government summits, and cultural gatherings. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Bhopal event",
        features: [
          {
            icon: GraduationCap,
            title: "National Institute Fests",
            desc: "Customized registration flows and branded digital badges for MANIT Bhopal, AIIMS Bhopal, IISER Bhopal, and RGPV technical and cultural fests.",
          },
          {
            icon: Building2,
            title: "Convention & Summit Venues",
            desc: "Optimized for large-scale multi-hall access at Kushabhau Thakre Convention Centre (Minto Hall), Ravindra Bhavan, and RCVP Noronha Academy.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure seamless entry queues even during high-density rush hours or spotty mobile network zones around Kolar and Shamla Hills.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect registration and workshop fees via Razorpay UPI, credit cards, or net banking directly into your account with zero platform commission.",
          },
          {
            icon: Users,
            title: "Multi-Gate Staff Check-In",
            desc: "Deploy volunteer scanners across auditorium entrances, workshop rooms, and dining zones with granular role permissions and live attendance sync.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Fraud Prevention",
            desc: "Cryptographically verifiable dynamic QR passes that instantly reject screenshots, duplicate forwarding, and unauthorized re-entry.",
          },
        ],
        callout: {
          badge: "BHOPAL VENUES",
          title: "From Kushabhau Thakre Convention Centre to MANIT Auditoriums.",
          description:
            "As Madhya Pradesh's administrative and educational hub, Bhopal hosts national state summits, premier collegiate festivals, and medical research symposiums. URPASS guarantees zero-delay gate check-ins.",
          bullets: [
            "State summits and exhibitions at Kushabhau Thakre Convention Centre (Minto Hall)",
            "Conferences and cultural conclaves at Ravindra Bhavan",
            "MANIT Bhopal national tech symposiums, hackathons, and cultural fests",
            "Medical conferences and academic CME workshops at AIIMS Bhopal",
          ],
        },
        useCases: [
          "MANIT Bhopal national technical symposiums & cultural fests",
          "AIIMS Bhopal medical conferences & healthcare symposiums",
          "IISER Bhopal research congresses and student science summits",
          "Kushabhau Thakre Convention Centre government & trade summits",
          "Ravindra Bhavan theatre festivals, seminars, and art conclaves",
          "RGPV engineering departmental conclaves and hackathons",
          "BHEL Exhibition Grounds industrial expos and trade fairs",
          "Barkatullah University academic convocations & workshops",
        ],
        faqs: [
          {
            q: "Can URPASS handle college tech fests at MANIT Bhopal or RGPV?",
            a: "Yes. URPASS supports custom registration forms, team and individual ticketing, student ID roll-number collection, and instant WhatsApp/Email ticket delivery with QR passes.",
          },
          {
            q: "Does the scanner app work offline at remote or basement auditorium halls?",
            a: "Yes. URPASS offline scan mode pre-caches your attendee list so security staff and student volunteers can validate entries under 0.3 seconds even with zero cellular coverage.",
          },
          {
            q: "How are payments settled for paid tickets in Bhopal?",
            a: "URPASS integrates directly with Razorpay. Payments via UPI (PhonePe, Google Pay, Paytm) and cards are deposited straight into your bank account with 0% platform commission.",
          },
          {
            q: "Can we track department-wise student attendance?",
            a: "With URPASS Campus integration, academic coordinators can easily filter and export real-time attendance and registration analytics categorized by department, semester, and club.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Indore",
            href: "/in/indore",
            category: "Location",
          },
          {
            title: "Event Registration Lucknow",
            href: "/in/lucknow",
            category: "Location",
          },
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
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
      }}
    />
  );
}
