import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Bhubaneswar — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Bhubaneswar and Odisha. Built for KIIT fests, IIT Bhubaneswar, SOA University symposiums, and Janata Maidan trade conclaves. Free to start.",
  keywords: [
    "event registration Bhubaneswar",
    "QR check in Bhubaneswar",
    "KIIT fest event passes",
    "IIT Bhubaneswar Alma Fiesta",
    "SOA University event ticketing",
    "Janata Maidan expo passes",
    "Rabindra Mandap events",
    "event management software Odisha",
    "Razorpay event ticketing Bhubaneswar",
  ],
  alternates: { canonical: "https://urpass.space/in/bhubaneswar" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Bhubaneswar | URPASS",
    description:
      "Bhubaneswar's premier event registration and digital QR pass platform for university fests, IT conclaves, and state trade expos.",
    url: "https://urpass.space/in/bhubaneswar",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-OR",
    "geo.placename": "Bhubaneswar, Odisha, India",
    "geo.position": "20.2961;85.8245",
    ICBM: "20.2961, 85.8245",
  },
};

export default function BhubaneswarPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · BHUBANESWAR & ODISHA",
        h1: "Event Registration & QR Check-In for Bhubaneswar Events",
        canonicalUrl: "https://urpass.space/in/bhubaneswar",
        geo: {
          region: "IN-OR",
          placename: "Bhubaneswar, Odisha, India",
          position: "20.2961;85.8245",
          latitude: 20.2961,
          longitude: 85.8245,
        },
        description:
          "Trusted across Bhubaneswar and Eastern India for premier collegiate fests, technology summits, medical congresses, and trade expos. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Bhubaneswar event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier University Fests",
            desc: "Custom registration and branded digital passes for KIIT Fest, IIT Bhubaneswar Alma Fiesta, SOA University, and Utkal University symposiums.",
          },
          {
            icon: Building2,
            title: "Trade & Exhibition Hubs",
            desc: "Designed for massive delegate entry and multi-hall tracking at Janata Maidan, Rabindra Mandap, and Infocity IT auditoriums.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure seamless entry queues even during high-density rush hours or spotty mobile network zones around Patia and Chandrasekharpur.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect registration and workshop ticket revenue via Razorpay UPI (PhonePe, GPay, Paytm) with direct bank settlement and zero commissions.",
          },
          {
            icon: Users,
            title: "Multi-Gate Staff & Volunteer Check-In",
            desc: "Equip student volunteers with secure PIN access links to validate entries across arena gates, auditoriums, and dining zones in real time.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Cryptographically verifiable dynamic QR passes that instantly reject screenshots, duplicate forwarding, and unauthorized re-entry.",
          },
        ],
        callout: {
          badge: "BHUBANESWAR VENUES",
          title: "From KIIT & SOA Campuses to Janata Maidan & Infocity.",
          description:
            "Known as the Smart City of Eastern India, Bhubaneswar hosts premier educational mega-campuses, expanding IT technology parks, and international sports conclaves. URPASS ensures frictionless crowd control.",
          bullets: [
            "Mega collegiate cultural & tech festivals at KIIT University campus & stadium",
            "Janata Maidan national industrial expos and Make in Odisha conclaves",
            "IIT Bhubaneswar Alma Fiesta & Wissenaire national technical symposiums",
            "IT meetups and founder hackathons across Infocity & Chandaka SEZ",
          ],
        },
        useCases: [
          "KIIT Fest national university cultural and celebrity concerts",
          "IIT Bhubaneswar Alma Fiesta & Wissenaire technical festivals",
          "SOA University academic symposiums and medical conferences",
          "Janata Maidan industrial expos, handicrafts fairs, and summits",
          "AIIMS Bhubaneswar medical research congresses & workshops",
          "Infocity IT and software developer hackathons and meetups",
          "Rabindra Mandap theatrical performances and Odissi cultural events",
          "Utkal University youth festivals and collegiate competitions",
        ],
        faqs: [
          {
            q: "Can URPASS handle massive university fests like KIIT Fest or Alma Fiesta?",
            a: "Yes. URPASS is architected to handle tens of thousands of concurrent registrations, offering custom forms (roll number, department, college ID) and instant WhatsApp/Email ticket delivery.",
          },
          {
            q: "Does the scanner app work when cellular networks are congested?",
            a: "Yes. URPASS offline scan mode pre-caches attendee lists so security staff and student volunteers can validate passes in under 0.3 seconds without internet.",
          },
          {
            q: "How are ticket payments settled for paid events in Bhubaneswar?",
            a: "URPASS integrates directly with Razorpay. Payments via UPI, cards, and net banking go straight into your bank account with 0% platform commission.",
          },
          {
            q: "Can we track department-wise and club attendance?",
            a: "With URPASS Campus integration, academic coordinators can view real-time attendance and registration analytics broken down by department, student club, and year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Kolkata",
            href: "/in/kolkata",
            category: "Location",
          },
          {
            title: "Event Registration Visakhapatnam",
            href: "/in/visakhapatnam",
            category: "Location",
          },
          {
            title: "Event Registration Hyderabad",
            href: "/in/hyderabad",
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
