import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, Cpu, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Noida & Greater Noida — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Noida and Greater Noida. Built for India Expo Centre & Mart expos, Sector 62 tech conferences, and college fests. Free to start.",
  keywords: [
    "event registration Noida",
    "QR check in Greater Noida",
    "India Expo Centre event passes",
    "Noida tech conference software",
    "Amity University fest registration",
    "Sector 62 event management",
    "Razorpay event ticketing Noida",
  ],
  alternates: { canonical: "https://urpass.space/in/noida" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Noida | URPASS",
    description:
      "Noida's event registration, ticketing, and QR door pass system for trade expos, college fests, and IT conferences.",
    url: "https://urpass.space/in/noida",
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

export default function NoidaPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · NOIDA & GREATER NOIDA",
        h1: "Event Registration & QR Check-In for Noida Events",
        canonicalUrl: "https://urpass.space/in/noida",
        geo: {
          region: "IN-UP",
          placename: "Noida, Uttar Pradesh, India",
          position: "28.5355;77.3910",
          latitude: 28.5355,
          longitude: 77.3910,
        },
        description:
          "Trusted by Noida's IT companies, major trade expo organizers, and premier university campuses. Online attendee registration, digital QR passes, and instant phone door scanning.",
        ctaLabel: "Start your Noida event",
        features: [
          {
            icon: Building2,
            title: "India Expo Mart & Trade Expos",
            desc: "High-throughput pass verification designed to handle tens of thousands of visitors at Greater Noida expo halls.",
          },
          {
            icon: Cpu,
            title: "Sector 62 & 126 Tech Events",
            desc: "Custom pass workflows for software developers, IT corporate townhalls, and electronics conferences.",
          },
          {
            icon: Ticket,
            title: "0% Commission Ticketing",
            desc: "Sell workshop or conference passes in INR via Razorpay UPI with zero platform percentage cut.",
          },
          {
            icon: QrCode,
            title: "Digital Passes on WhatsApp & Web",
            desc: "Attendees receive interactive mobile passes that open instantly on any phone without app installation.",
          },
          {
            icon: ScanLine,
            title: "Multi-Gate QR Check-In",
            desc: "Coordinate entry across multiple expo hall doors and campus gates in real-time with anti-passback protection.",
          },
          {
            icon: Users,
            title: "College & Fest Management",
            desc: "Streamlined registration workflows for Amity, Shiv Nadar, Galgotias, and Bennett university events.",
          },
        ],
        callout: {
          badge: "NOIDA VENUES",
          title: "From India Expo Centre to Amity University Campus.",
          description:
            "Whether you are organizing a national trade exhibition at India Expo Centre & Mart or a multi-day cultural fest in Greater Noida, URPASS ensures fast check-ins with zero gate queues.",
          bullets: [
            "Trade expos at India Expo Centre & Mart, Greater Noida",
            "College fests at Amity University, Galgotias, and Shiv Nadar",
            "Tech conferences across Sector 62, 126, and Expressway tech parks",
            "Media and entertainment summits at Noida Film City",
          ],
        },
        useCases: [
          "India Expo Centre trade exhibitions",
          "College fests and technical symposiums",
          "Noida Film City media conferences",
          "Sector 62 IT meetups and hackathons",
          "Corporate workshops along Noida Expressway",
          "Medical and healthcare symposiums",
        ],
        relatedLinks: [
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Event Registration Gurgaon",
            href: "/in/gurgaon",
            category: "Location",
          },
          {
            title: "Event Ticketing Platform for College Events",
            href: "/event-ticketing-platform-for-college-events",
            category: "Product",
          },
          {
            title: "Multi-Gate Event Check-In",
            href: "/multi-gate-event-check-in",
            category: "Product",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
        ],
        faqs: [
          {
            q: "Can URPASS handle large exhibitions at India Expo Mart?",
            a: "Yes. URPASS supports multi-gate door scanning with sub-0.3s validation, allowing dozens of volunteers to scan thousands of expo attendees concurrently across hall entrances.",
          },
          {
            q: "Is there a free tier for college student clubs in Noida?",
            a: "Yes. The URPASS Free tier includes 2 events/month and up to 100 registrations/month at ₹0 forever, ideal for university club workshops and hackathons.",
          },
          {
            q: "How does URPASS prevent pass sharing and screenshot fraud?",
            a: "Passes utilize single-use dynamic QR codes. Once scanned at an entrance gate, any subsequent scan attempt is immediately flagged as 'Already Checked In' with exact timestamp and gate ID.",
          },
        ],
        ctaTitle: "Organize your Noida event with URPASS",
        ctaDescription: "Trade expos · College fests · Instant UPI payments · Free to start",
      }}
    />
  );
}
