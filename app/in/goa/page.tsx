import type { Metadata } from "next";
import { Sparkles, MapPin, QrCode, ScanLine, Ticket, Users, Sun, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Goa — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Goa. Built for tech founder retreats, AI & Web3 unconferences, BITS Pilani Goa fests, corporate offsites, and music festivals. Free to start.",
  keywords: [
    "event registration Goa",
    "QR check in Goa",
    "tech retreat event software Goa",
    "BITS Pilani Goa fest passes",
    "Goa startup offsite ticketing",
    "music festival pass system Goa",
    "Razorpay event ticketing Goa",
  ],
  alternates: { canonical: "https://urpass.space/in/goa" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Goa | URPASS",
    description:
      "Goa's premier event registration and digital QR pass platform for tech unconferences, founder retreats, and coastal summits.",
    url: "https://urpass.space/in/goa",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-GA",
    "geo.placename": "Panaji, Goa, India",
    "geo.position": "15.4909;73.8278",
    ICBM: "15.4909, 73.8278",
  },
};

export default function GoaPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · GOA TECH & RETREATS",
        h1: "Event Registration & QR Check-In for Goa Events",
        canonicalUrl: "https://urpass.space/in/goa",
        geo: {
          region: "IN-GA",
          placename: "Panaji, Goa, India",
          position: "15.4909;73.8278",
          latitude: 15.4909,
          longitude: 73.8278,
        },
        description:
          "The preferred event registration and QR ticketing platform for Goa's tech unconferences, startup founder retreats, coastal leadership summits, and music festivals. Instant digital passes and zero-hardware door scanning.",
        ctaLabel: "Start your Goa event",
        features: [
          {
            icon: Sun,
            title: "Tech Unconferences & Retreats",
            desc: "Tailored registration flows for developer retreats, Web3 hackathons, and invite-only founder gatherings across North & South Goa.",
          },
          {
            icon: Sparkles,
            title: "BITS Pilani Goa Fests",
            desc: "High-capacity pass issuance and rapid gate check-in for Waves, Quark, and college hackathons.",
          },
          {
            icon: Ticket,
            title: "0% Commission on Tickets",
            desc: "Sell VIP retreat passes or general festival tickets with direct Razorpay UPI integration and zero platform commission.",
          },
          {
            icon: QrCode,
            title: "Apple Wallet & Mobile Passes",
            desc: "Passes save directly to smartphone wallets, ensuring delegates can present their badge even on beaches with poor connectivity.",
          },
          {
            icon: ScanLine,
            title: "Instant Mobile Door Check-In",
            desc: "Organizers scan passes using any mobile browser with audio chimes and haptic feedback. Sub-0.3s verification.",
          },
          {
            icon: ShieldCheck,
            title: "Screenshot & Anti-Fraud Shield",
            desc: "Dynamic cryptographic tokens ensure passes cannot be duplicated or shared via screenshots.",
          },
        ],
        callout: {
          badge: "GOA EVENT SPACES",
          title: "From Panaji & Dona Paula to Mandrem & BITS Campus.",
          description:
            "Goa has emerged as India's favorite destination for tech unconferences, leadership summits, and cultural celebrations. URPASS keeps check-in queues effortless.",
          bullets: [
            "Tech retreats and unconferences in Morjim, Mandrem, and Assagao",
            "Executive conferences in Panaji, Dona Paula, and Bambolim",
            "Campus fests and national hackathons at BITS Pilani Goa Campus, Zuarinagar",
            "Music, wellness, and culinary festivals along the coastal belt",
          ],
        },
        useCases: [
          "Founder summits and VC investor retreats",
          "Web3, AI, and open-source unconferences",
          "BITS Pilani Goa cultural & technical festivals",
          "Corporate leadership retreats at coastal 5-star resorts",
          "Music, art, and wellness festivals",
          "Design symposiums and creative bootcamps",
        ],
        relatedLinks: [
          {
            title: "Event Registration Mumbai",
            href: "/in/mumbai",
            category: "Location",
          },
          {
            title: "Event Registration Bangalore",
            href: "/in/bangalore",
            category: "Location",
          },
          {
            title: "Startup Events Ticketing",
            href: "/startup-events",
            category: "Use Case",
          },
          {
            title: "Event Pass Management System",
            href: "/event-pass-management-system",
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
            q: "Can attendees access their passes if there is weak cellular connectivity?",
            a: "Yes. Attendees can save their digital pass directly into Apple Wallet (.pkpass) or take an offline cache in their mobile browser, making entry reliable even at outdoor beach venues.",
          },
          {
            q: "Can we sell paid tickets for a multi-day retreat?",
            a: "Yes. You can configure multi-day retreat tickets with different pricing tiers, early bird discounts, and custom application approval questions.",
          },
          {
            q: "How does payment settlement work for Goa events?",
            a: "Funds are processed via your own connected Razorpay account, supporting UPI, credit cards, and international cards with direct T+2 settlement to your bank.",
          },
        ],
        ctaTitle: "Plan your Goa retreat or summit on URPASS",
        ctaDescription: "Tech retreats · Festival passes · Instant UPI payments · Free to start",
      }}
    />
  );
}
