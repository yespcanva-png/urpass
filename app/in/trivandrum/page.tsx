import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Trivandrum — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Thiruvananthapuram (Trivandrum) and Kerala. Built for Technopark IT conclaves, CET college fests, Tagore Theatre events, and Greenfield Stadium summits. Free to start.",
  keywords: [
    "event registration Trivandrum",
    "QR check in Trivandrum",
    "Technopark event ticketing",
    "CET Trivandrum Drishti passes",
    "Tagore Theatre event passes",
    "Nishagandhi festival tickets",
    "Greenfield Stadium events",
    "event management software Kerala",
    "Razorpay event ticketing Trivandrum",
  ],
  alternates: { canonical: "https://urpass.space/in/trivandrum" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Trivandrum | URPASS",
    description:
      "Trivandrum's premier event registration and digital QR pass platform for Technopark tech summits, college fests, and cultural festivals.",
    url: "https://urpass.space/in/trivandrum",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Thiruvananthapuram, Kerala, India",
    "geo.position": "8.5241;76.9366",
    ICBM: "8.5241, 76.9366",
  },
};

export default function TrivandrumPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · TRIVANDRUM & KERALA",
        h1: "Event Registration & QR Check-In for Trivandrum Events",
        canonicalUrl: "https://urpass.space/in/trivandrum",
        geo: {
          region: "IN-KL",
          placename: "Thiruvananthapuram, Kerala, India",
          position: "8.5241;76.9366",
          latitude: 8.5241,
          longitude: 76.9366,
        },
        description:
          "Trusted across Trivandrum and Kerala for Technopark software summits, premier engineering fests, international cultural celebrations, and space tech conclaves. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Trivandrum event",
        features: [
          {
            icon: Building2,
            title: "Technopark IT Conclaves",
            desc: "Designed for corporate conferences, developer hackathons, and founder meetups across Technopark Phase I, II, III, and Taurus Downtown.",
          },
          {
            icon: GraduationCap,
            title: "Premier Institute Fests",
            desc: "Custom registration and branded digital passes for College of Engineering Trivandrum (CET Drishti & Dhwani), IIST, and University of Kerala.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Guarantee zero gate delays across auditorium foyers, stadium gates, and heritage palace grounds with offline-resilient local scanning.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect delegate and workshop registration fees via Razorpay UPI (PhonePe, GPay, Paytm) directly to your account with zero platform commission.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Equip student volunteers and gate security with PIN-based browser scanner links to manage entry across multiple auditoriums simultaneously.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Fraud Security",
            desc: "Dynamic QR passes eliminate ticket scalping, pass screenshot forwarding, and unauthorized attendee re-entry across all venue zones.",
          },
        ],
        callout: {
          badge: "TRIVANDRUM VENUES",
          title: "From Technopark Campuses to Tagore Theatre & Kanakakkunnu.",
          description:
            "As Kerala's administrative capital and pioneer IT hub, Thiruvananthapuram hosts cutting-edge space technology symposiums, global startup summits, and premier classical arts festivals. URPASS ensures effortless visitor management.",
          bullets: [
            "Conclaves and tech summits across Technopark Club and amphitheaters",
            "Tagore Theatre cultural performances and state film festival events",
            "CET Drishti technical symposium and Dhwani national collegiate fest",
            "Nishagandhi open-air auditorium festivals at Kanakakkunnu Palace",
          ],
        },
        useCases: [
          "Technopark developer summits, tech expos, and hackathons",
          "CET Trivandrum Drishti & Dhwani collegiate festivals",
          "Tagore Theatre cultural festivals and film screenings",
          "Nishagandhi dance and music national celebrations",
          "Greenfield International Stadium sports events and mega expos",
          "IIST space science conferences and student rocketry symposiums",
          "Kerala Startup Mission (KSUM) investor demo days and conclaves",
          "Luxury hotel conventions across Kovalam and Uday Samudra",
        ],
        faqs: [
          {
            q: "Can URPASS handle Technopark IT corporate conferences and hackathons?",
            a: "Yes. URPASS offers customized registration fields, company domain restrictions, automated GST invoices, and instant QR badges delivered via WhatsApp and Email.",
          },
          {
            q: "Does the scanner app require specialized devices in Trivandrum?",
            a: "No. Student volunteers and gate security simply open a secure web link on any iOS or Android phone browser to scan passes in under 0.3 seconds.",
          },
          {
            q: "How does payment settlement work for paid events in Kerala?",
            a: "Connect your Razorpay account to receive ticket revenues directly into your bank account via UPI, cards, and net banking with zero platform cuts.",
          },
          {
            q: "Can we track department and club participation across campus?",
            a: "Yes. With URPASS Campus, administrators can view live registration and attendance analytics categorized by university department, student club, and academic year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Kochi",
            href: "/in/kochi",
            category: "Location",
          },
          {
            title: "Event Registration Bangalore",
            href: "/in/bangalore",
            category: "Location",
          },
          {
            title: "Event Registration Chennai",
            href: "/in/chennai",
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
