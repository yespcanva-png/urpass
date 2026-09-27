import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Patna — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Patna and Bihar. Built for Gyan Bhawan, Bapu Sabhagar conventions, and college fests (IIT Patna, NIT Patna, AIIMS Patna). Free to start.",
  keywords: [
    "event registration Patna",
    "QR check in Patna",
    "Patna college fest passes",
    "IIT Patna Anwesha ticketing",
    "NIT Patna Corona passes",
    "Gyan Bhawan convention passes",
    "Bapu Sabhagar event check-in",
    "event management software Bihar",
    "Razorpay event ticketing Patna",
  ],
  alternates: { canonical: "https://urpass.space/in/patna" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Patna | URPASS",
    description:
      "Patna's premier event registration and digital QR pass platform for premier college fests, state summits, and convention hall conclaves.",
    url: "https://urpass.space/in/patna",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Patna, Bihar, India",
    "geo.position": "25.5941;85.1376",
    ICBM: "25.5941, 85.1376",
  },
};

export default function PatnaPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · PATNA & BIHAR",
        h1: "Event Registration & QR Check-In for Patna Events",
        canonicalUrl: "https://urpass.space/in/patna",
        geo: {
          region: "IN-BR",
          placename: "Patna, Bihar, India",
          position: "25.5941;85.1376",
          latitude: 25.5941,
          longitude: 85.1376,
        },
        description:
          "Trusted across Patna and Bihar for national academic conferences, premier institute fests, government summits, and industrial expos. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Patna event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier Institute Fests",
            desc: "Customized registration and branded digital passes for IIT Patna (Anwesha & Celeste), NIT Patna, AIIMS Patna, and Patna University symposiums.",
          },
          {
            icon: Building2,
            title: "State Convention Complexes",
            desc: "Engineered for 5,000+ seat auditoriums at Bapu Sabhagar, Gyan Bhawan, and SK Memorial Hall around Gandhi Maidan.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure instant gate entry even in crowded convention halls or low-connectivity zones across Bihta and Bailey Road.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect delegate and registration fees via Razorpay UPI (PhonePe, GPay, Paytm) directly into your bank account with zero ticket commissions.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Deploy student coordinators and staff with secure browser PIN links to validate entries across multiple auditorium gates concurrently.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Cryptographically verified dynamic QR codes that immediately reject screenshots, forwarded passes, and duplicate entries.",
          },
        ],
        callout: {
          badge: "PATNA VENUES",
          title: "From Gyan Bhawan & Bapu Sabhagar to IIT Patna Bihta.",
          description:
            "As eastern India's historical heart and a fast-developing hub for startups, higher education, and state governance, Patna hosts mega youth festivals and premier industrial summits. URPASS ensures zero gate congestion.",
          bullets: [
            "Conclaves and trade expos at Samrat Ashok Convention Kendra (Gyan Bhawan & Bapu Sabhagar)",
            "IIT Patna Anwesha cultural fest & Celeste technical symposium at Bihta campus",
            "NIT Patna technical fests, hackathons, and departmental symposiums",
            "Medical conferences and academic seminars at AIIMS Patna",
          ],
        },
        useCases: [
          "IIT Patna Anwesha & Celeste national collegiate festivals",
          "NIT Patna engineering symposiums & hackathons",
          "Gyan Bhawan trade exhibitions and national education summits",
          "Bapu Sabhagar state conclaves, seminars, and book fairs",
          "AIIMS Patna medical conferences and research symposiums",
          "Bihar Industries Association (BIA) & B-HUB startup demo days",
          "SK Memorial Hall cultural and theatrical events",
          "Patliputra Sports Complex tournaments and competitions",
        ],
        faqs: [
          {
            q: "Can URPASS handle mega college fests at IIT Patna or NIT Patna?",
            a: "Yes. URPASS supports custom registration forms, team and solo passes, student ID roll-number verification, and instant WhatsApp/Email ticket delivery with QR passes.",
          },
          {
            q: "Does the scanner app require high-speed internet at the venue?",
            a: "No. URPASS offline scan mode pre-caches your attendee list so volunteers can validate entries under 0.3 seconds even when connectivity drops completely.",
          },
          {
            q: "How are payments deposited for paid events in Patna?",
            a: "URPASS integrates directly with Razorpay. Payments via UPI, cards, and net banking settle straight into your bank account with 0% platform commission.",
          },
          {
            q: "Can we track department and club attendance across campus?",
            a: "With URPASS Campus integration, academic coordinators can view real-time attendance and registration analytics broken down by department, student club, and year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Lucknow",
            href: "/in/lucknow",
            category: "Location",
          },
          {
            title: "Event Registration Kolkata",
            href: "/in/kolkata",
            category: "Location",
          },
          {
            title: "Event Registration Bhubaneswar",
            href: "/in/bhubaneswar",
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
