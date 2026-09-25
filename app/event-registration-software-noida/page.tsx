import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Noida & Greater Noida — URPASS",
  description:
    "Organizing a college fest, trade expo, conference, or workshop in Noida or Greater Noida? URPASS helps organizers manage registrations, issue digital QR passes, and check in attendees using any phone.",
  keywords: [
    "event registration software noida",
    "event registration software greater noida",
    "QR event check-in Noida",
    "India Expo Centre pass software",
    "college fest ticketing Noida",
    "Razorpay event ticketing Noida",
    "URPASS Noida",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-noida" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Noida | URPASS",
    description:
      "Noida's modern event registration and QR check-in software for trade expos at India Expo Centre, IT conferences, and university festivals.",
    url: "https://urpass.space/event-registration-software-noida",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Noida, Uttar Pradesh, India",
    "geo.position": "28.5355;77.3910",
    ICBM: "28.5355, 77.3910",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "NOIDA EXPOS & UNIVERSITY FESTS",
        h1: "Event Registration & QR Check-In Software in Noida",
        canonicalUrl: "https://urpass.space/event-registration-software-noida",
        geo: {
          region: "IN-UP",
          placename: "Noida, Uttar Pradesh, India",
          position: "28.5355;77.3910",
          latitude: 28.5355,
          longitude: 77.3910,
        },
        description:
          "Organizing an exhibition at India Expo Centre & Mart, an engineering campus fest, or a corporate conference in Noida? URPASS helps organizers manage online registrations, issue digital QR passes, and check in attendees using any smartphone camera.",
        ctaLabel: "Start your Noida event free",
        features: [
          {
            icon: Building2,
            title: "India Expo Centre & Mart Ready",
            desc: "Designed to handle tens of thousands of trade expo attendees across multiple hall gates with sub-0.3s validation.",
          },
          {
            icon: Ticket,
            title: "UPI & 0% Platform Commission",
            desc: "Collect ticket fees via Google Pay, PhonePe, Paytm, net banking, and cards with direct bank deposit and zero commission.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Attendees receive unique mobile QR passes via email and WhatsApp that open in any browser with Apple Wallet export.",
          },
          {
            icon: ScanLine,
            title: "Multi-Gate Door Scanning",
            desc: "Coordinate entry across multiple entrance gates and exhibition halls simultaneously using volunteers' own phones.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Velocity",
            desc: "Monitor live check-in rates as delegates enter, with instant CSV exports for post-event sponsor reporting.",
          },
          {
            icon: ShieldCheck,
            title: "Screenshot Fraud Protection",
            desc: "Dynamic cryptographic tokens ensure passes cannot be duplicated or shared via screenshots.",
          },
        ],
        callout: {
          badge: "NOIDA VENUES",
          title: "Trusted across India Expo Mart, Sector 62, and university campuses.",
          description:
            "From national trade exhibitions in Greater Noida to college festivals at Amity, Galgotias, and Shiv Nadar to tech conferences along the Noida Expressway. URPASS eliminates queue bottlenecks.",
          bullets: [
            "National trade exhibitions at India Expo Centre & Mart",
            "University fests at Amity, Shiv Nadar, Galgotias, and Bennett",
            "IT meetups and corporate town halls in Sector 62 and Sector 126",
            "Broadcasting and digital summits at Noida Film City",
          ],
        },
        useCases: [
          "Trade exhibitions and consumer expos",
          "University cultural fests and hackathons",
          "IT conferences along Noida Expressway",
          "Broadcast and digital media symposiums",
          "Healthcare and scientific conventions",
        ],
        relatedLinks: [
          {
            title: "Noida City Event Hub",
            href: "/in/noida",
            category: "Location",
          },
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Multi-Gate Event Check-In",
            href: "/multi-gate-event-check-in",
            category: "Product",
          },
          {
            title: "College Events & Fest Ticketing",
            href: "/college-events",
            category: "Use Case",
          },
          {
            title: "Trade Shows & Expos Platform",
            href: "/trade-shows",
            category: "Use Case",
          },
        ],
        faqs: [
          {
            q: "Can volunteers scan passes without installing an app?",
            a: "Yes. Volunteers simply open a secure PIN scanner URL in Safari or Chrome on their mobile device to scan passes in under 0.3 seconds.",
          },
          {
            q: "Does URPASS support multi-day trade expo passes?",
            a: "Yes. You can issue multi-day passes with specific hall access permissions and VIP lounge privileges.",
          },
          {
            q: "Can college clubs in Noida use URPASS for free?",
            a: "Yes. The URPASS Free tier includes 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required.",
          },
        ],
        ctaTitle: "Start your Noida event on URPASS",
        ctaDescription: "Trade expos · College fests · Instant UPI payments · Free to start",
      }}
    />
  );
}
