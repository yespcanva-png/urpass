import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Visakhapatnam — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Visakhapatnam and Andhra Pradesh. Built for GITAM, Andhra University fests, Fintech Valley Vizag summits, and Novotel Varun Beach conventions. Free to start.",
  keywords: [
    "event registration Visakhapatnam",
    "QR check in Visakhapatnam",
    "Vizag college fest passes",
    "GITAM event ticketing",
    "Andhra University symposium passes",
    "Fintech Valley Vizag event ticketing",
    "Novotel Varun Beach convention check-in",
    "event management software Andhra Pradesh",
    "Razorpay event ticketing Vizag",
  ],
  alternates: { canonical: "https://urpass.space/in/visakhapatnam" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Visakhapatnam | URPASS",
    description:
      "Visakhapatnam's premier event registration and digital QR pass platform for collegiate fests, IT conclaves, and beachside conventions.",
    url: "https://urpass.space/in/visakhapatnam",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-AP",
    "geo.placename": "Visakhapatnam, Andhra Pradesh, India",
    "geo.position": "17.6868;83.2185",
    ICBM: "17.6868, 83.2185",
  },
};

export default function VisakhapatnamPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · VISAKHAPATNAM & AP",
        h1: "Event Registration & QR Check-In for Visakhapatnam Events",
        canonicalUrl: "https://urpass.space/in/visakhapatnam",
        geo: {
          region: "IN-AP",
          placename: "Visakhapatnam, Andhra Pradesh, India",
          position: "17.6868;83.2185",
          latitude: 17.6868,
          longitude: 83.2185,
        },
        description:
          "Trusted across Visakhapatnam and Andhra Pradesh for coastal tech summits, premier collegiate symposiums, maritime expos, and industrial conclaves. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Vizag event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier University Fests",
            desc: "Customized registration and branded digital passes for GITAM University, Andhra University (AU), IIM Visakhapatnam, and IIPE technical symposiums.",
          },
          {
            icon: Building2,
            title: "Fintech & Beachside Conclaves",
            desc: "Designed for Rushikonda IT SEZ summits, Fintech Valley Vizag conferences, and waterfront expos at Novotel Varun Beach and Radisson Blu.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Guarantee smooth attendee flow across college gates and auditorium entrances even with weak coastal network reception.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect ticket and registration fees via Razorpay UPI, RuPay, and cards directly into your bank account with zero ticket commissions.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Deploy student coordinators and event volunteers with secure PIN access links to validate entries across multiple university gates simultaneously.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Dynamic QR codes prevent duplicate entry, pass screenshot sharing, and unauthorized attendee re-entry across all venue checkpoints.",
          },
        ],
        callout: {
          badge: "VIZAG VENUES",
          title: "From GITAM Rushikonda to AU Convocation Hall & Novotel Varun Beach.",
          description:
            "As Andhra Pradesh's executive and industrial capital, Visakhapatnam blends thriving academic institutions with burgeoning IT corridors and maritime trade summits. URPASS guarantees seamless attendee management.",
          bullets: [
            "Conclaves and delegate summits at Novotel Varun Beach & Radisson Blu Resort",
            "Collegiate technical and cultural fests across GITAM Deemed University Rushikonda campus",
            "Academic symposiums and convocations at Andhra University (AU) Convocation Hall",
            "Tech meetups and hackathons across Rushikonda IT SEZ & Millennium Tower",
          ],
        },
        useCases: [
          "GITAM University Gusac Carnival & technical symposiums",
          "Andhra University engineering fests & departmental seminars",
          "IIM Visakhapatnam management conclaves and leadership summits",
          "Fintech Valley Vizag startup hackathons and investor demo days",
          "Maritime & industrial expos at Visakhapatnam Port Trust Golden Jubilee grounds",
          "Conferences and business seminars at Novotel Varun Beach",
          "Cultural festivals and exhibitions at VMRDA Children's Arena",
          "Professional medical and scientific conferences across King George Hospital (KGH) institutions",
        ],
        faqs: [
          {
            q: "Can URPASS handle large university fests like GITAM or AU?",
            a: "Yes. URPASS handles tens of thousands of simultaneous registrations, provides customized registration fields (roll number, department, year), and dispatches instant QR passes via Email and WhatsApp.",
          },
          {
            q: "Does the scanner require specialized hardware or mobile apps?",
            a: "No. Student volunteers and gate security simply open a secure web link on any iOS or Android phone browser to scan passes in under 0.3 seconds.",
          },
          {
            q: "How does payment settlement work for paid events in Vizag?",
            a: "Connect your Razorpay account to receive ticket revenues directly into your bank account via UPI, cards, and net banking with zero platform cuts.",
          },
          {
            q: "Can we track department and club participation across campus?",
            a: "Yes. With URPASS Campus, administrators can view live registration and attendance analytics categorized by university department, student club, and academic year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Hyderabad",
            href: "/in/hyderabad",
            category: "Location",
          },
          {
            title: "Event Registration Chennai",
            href: "/in/chennai",
            category: "Location",
          },
          {
            title: "Event Registration Bangalore",
            href: "/in/bangalore",
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
