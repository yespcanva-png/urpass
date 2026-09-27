import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Nagpur — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Nagpur and Vidarbha. Built for VNIT, IIM Nagpur, Suresh Bhat Natyagruha conventions, MIHAN IT summits, and college fests. Free to start.",
  keywords: [
    "event registration Nagpur",
    "QR check in Nagpur",
    "Nagpur college fest passes",
    "VNIT Nagpur event ticketing",
    "IIM Nagpur conclaves",
    "Suresh Bhat Natyagruha event passes",
    "MIHAN IT meetups Nagpur",
    "event management software Vidarbha",
    "Razorpay event ticketing Nagpur",
  ],
  alternates: { canonical: "https://urpass.space/in/nagpur" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Nagpur | URPASS",
    description:
      "Nagpur's premier event registration and digital QR pass platform for premier college fests, MIHAN tech summits, and auditorium conventions.",
    url: "https://urpass.space/in/nagpur",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Nagpur, Maharashtra, India",
    "geo.position": "21.1458;79.0882",
    ICBM: "21.1458, 79.0882",
  },
};

export default function NagpurPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · NAGPUR & VIDARBHA",
        h1: "Event Registration & QR Check-In for Nagpur Events",
        canonicalUrl: "https://urpass.space/in/nagpur",
        geo: {
          region: "IN-MH",
          placename: "Nagpur, Maharashtra, India",
          position: "21.1458;79.0882",
          latitude: 21.1458,
          longitude: 79.0882,
        },
        description:
          "Trusted across Nagpur and Vidarbha for premier engineering symposiums, management conclaves, MIHAN IT conferences, and cultural celebrations. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Nagpur event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier Institute Fests",
            desc: "Custom registration and branded digital passes for VNIT Nagpur (Aarohi & Axis), IIM Nagpur, AIIMS Nagpur, and RTMNU technical symposiums.",
          },
          {
            icon: Building2,
            title: "Auditoriums & MIHAN Hubs",
            desc: "Designed for massive crowd flows at Suresh Bhat Natyagruha, Vasantrao Deshpande Hall, and MIHAN SEZ corporate summits.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure rapid queue processing at high-capacity venue gates without dependence on congested local cellular networks.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect ticket fees via Razorpay UPI (PhonePe, GPay, Paytm) and cards directly to your account with zero platform commission.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Grant staff and student coordinators secure PIN-authenticated scanner links to manage entry gates simultaneously with live sync.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Cryptographically verifiable dynamic QR passes block duplicate entries, screenshot sharing, and unauthorized pass handover.",
          },
        ],
        callout: {
          badge: "NAGPUR VENUES",
          title: "From Suresh Bhat Natyagruha to VNIT & MIHAN IT SEZ.",
          description:
            "Positioned at India's zero-mile geographical center, Nagpur is a booming junction for national logistics, aerospace, tech parks, and premier educational institutes. URPASS ensures hassle-free entry flow.",
          bullets: [
            "Conclaves and cultural shows at the 2,500-seat Suresh Bhat Natyagruha",
            "VNIT Nagpur Axis technical fest & Aarohi central India cultural festival",
            "IIM Nagpur management conclaves and leadership roundtable summits",
            "Corporate IT seminars and tech hackathons across MIHAN SEZ campus",
          ],
        },
        useCases: [
          "VNIT Nagpur Axis & Aarohi national collegiate festivals",
          "IIM Nagpur management conclaves & business competitions",
          "AIIMS Nagpur healthcare symposiums & medical seminars",
          "MIHAN SEZ aerospace and IT corporate conferences",
          "Suresh Bhat Natyagruha theatrical and cultural summits",
          "RTMNU university examinations, youth fests, and convocations",
          "Mankapur Indoor Stadium sporting tournaments & exhibitions",
          "Vidarbha Industries Association (VIA) industrial conclaves",
        ],
        faqs: [
          {
            q: "Can URPASS handle large college fests like VNIT Aarohi or Axis?",
            a: "Yes. URPASS handles tens of thousands of simultaneous registrations, provides customized registration fields (roll number, department, college), and dispatches instant QR passes via Email and WhatsApp.",
          },
          {
            q: "Does the scanner app require specialized devices in Nagpur?",
            a: "No. Student volunteers and gate security simply open a secure web link on any iOS or Android phone browser to scan passes in under 0.3 seconds.",
          },
          {
            q: "How does payment settlement work for paid events in Nagpur?",
            a: "Connect your Razorpay account to receive ticket revenues directly into your bank account via UPI, cards, and net banking with zero platform cuts.",
          },
          {
            q: "Can we track department and club participation across campus?",
            a: "Yes. With URPASS Campus, administrators can view live registration and attendance analytics categorized by university department, student club, and academic year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Pune",
            href: "/in/pune",
            category: "Location",
          },
          {
            title: "Event Registration Mumbai",
            href: "/in/mumbai",
            category: "Location",
          },
          {
            title: "Event Registration Bhopal",
            href: "/in/bhopal",
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
