import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Pune | URPASS",
  description: "URPASS event registration and QR check-in for Pune. For tech events, college workshops, startup meetups, and corporate events in Pune and Pimpri-Chinchwad. Free to start.",
  alternates: { canonical: "https://urpass.space/in/pune" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Pune | URPASS",
    description: "Pune event registration and QR pass platform for tech events, colleges, and corporates.",
    url: "https://urpass.space/in/pune",
  },
};

export default function PunePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · PUNE",
        h1: "Event Registration & QR Check-In for Pune Events",
        description: "Used by Pune's colleges, tech community, and corporate event teams. Online registration, digital QR passes, and phone-based check-in for any Pune event.",
        ctaLabel: "Start your Pune event",
        features: [
          { icon: GraduationCap, title: "Pune college events", desc: "For COEP, VIT Pune, Symbiosis, MIT, and other Pune colleges running workshops, fests, and symposiums." },
          { icon: MapPin, title: "Built for Pune", desc: "INR pricing, Razorpay, and support for Pune's diverse event scene from Hinjewadi to Kothrud." },
          { icon: Ticket, title: "Free and paid events", desc: "Run free events or collect fees via Razorpay for paid workshops and conferences." },
          { icon: QrCode, title: "Digital QR passes", desc: "Unique digital QR passes for every attendee — no printing required." },
          { icon: ScanLine, title: "Venue QR check-in", desc: "Scan passes at any Pune venue using any smartphone." },
          { icon: Users, title: "Attendee management", desc: "View and manage registrations and check-ins from your organiser dashboard." },
        ],
        callout: {
          badge: "PUNE EVENTS",
          title: "From Hinjewadi to COEP — Pune events covered.",
          description: "Pune has a vibrant mix of college events, startup meetups, and IT park conferences. URPASS handles the registration and entry for all of them.",
          bullets: [
            "College fests and workshops in Pune",
            "Tech meetups in Hinjewadi and Baner",
            "Corporate events in Magarpatta",
            "Startup events and hackathons",
          ],
        },
        useCases: [
          "COEP events", "VIT Pune workshops", "Symbiosis events", "Hinjewadi tech meetups",
          "Baner startup events", "Pune hackathons", "Magarpatta corporate events", "Kothrud community events",
        ],
        faqs: [
          { q: "Is URPASS used in Pune?", a: "Yes. URPASS is used by event organisers across Pune for college events, tech meetups, and corporate conferences." },
          { q: "Can Pune college students register for events?", a: "Yes. URPASS registration links are public. Students from any Pune college can register." },
          { q: "Is there a free plan for Pune events?", a: "Yes. Free plan with 1 event and 50 attendees — no credit card required." },
          { q: "Does URPASS work for Hinjewadi IT park events?", a: "Yes. Corporate events in Hinjewadi and other Pune IT parks can be managed professionally on URPASS Pro." },
          { q: "What payment methods are available for Pune events?", a: "Razorpay supports UPI, HDFC/ICICI/SBI cards, net banking, and wallets used commonly in Pune." },
          { q: "Can I use URPASS for a large Pune conference?", a: "Yes. Pro plan supports up to 2,000 attendees per event." },
        ],
        ctaTitle: "Run your Pune event with URPASS",
        ctaDescription: "Colleges to corporates · Free to start · QR passes",
      }}
    />
  );
}
