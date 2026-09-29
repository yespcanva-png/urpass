import type { Metadata } from "next";
import {
  ScanLine,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In Software UK — Fast Attendance & Door Scanning | URPASS",
  description:
    "UK event check-in software for frictionless entrance management. Scan QR passes in <0.3s on volunteer smartphones, sync multi-door entries in real time, and monitor live arrival analytics. UK GDPR compliant.",
  keywords: [
    "event check-in software uk",
    "uk event attendance software",
    "event gate management software uk",
    "guest check-in system uk",
    "conference check-in software uk",
    "qr event check-in uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-check-in-software",
    languages: {
      "en-GB": "https://urpass.space/uk/event-check-in-software",
      "x-default": "https://urpass.space/event-check-in-software",
    },
  },
  openGraph: {
    title: "Event Check-In Software UK — Fast Attendance & Door Scanning | URPASS",
    description:
      "Manage door arrivals and validate passes across UK venues. Sub-second browser scanning, live capacity tracking, and multi-door sync.",
    url: "https://urpass.space/uk/event-check-in-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventCheckInSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-check-in-software",
        badge: "UK DOOR OPERATIONS · REAL-TIME ATTENDANCE",
        h1: "Event Check-In Software for UK Organisers & Venues",
        description:
          "Take control of your venue entrances with sub-second QR pass scanning, multi-gate live synchronisation, real-time arrival velocity analytics, and offline failover on standard smartphone browsers.",
        ctaLabel: "Try Check-In Free",

        directAnswer: {
          title: "What makes URPASS the leading event check-in software in the UK?",
          summary:
            "URPASS is dedicated event check-in and gate management software engineered to eliminate entrance bottlenecks at UK conferences, exhibitions, and university campuses. It replaces slow paper registries and clunky hardware scanners with a sub-second browser scanner that volunteers can run on their personal smartphones. It provides multi-door sync, instant duplicate detection, offline caching, and real-time attendance dashboards.",
          keyPoints: [
            "Check-in speeds under 300 milliseconds per attendee",
            "Multi-door real-time synchronization with cloud conflict resolution",
            "Full offline caching engine for venues with weak or zero Wi-Fi",
            "Live attendance metrics, arrival curves, and instant CSV exports",
          ],
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanner",
            desc: "Validate digital QR passes with instant camera feedback directly in standard smartphone web browsers.",
          },
          {
            icon: Users,
            title: "Multi-Gate Co-ordination",
            desc: "Sync check-in statuses across unlimited entrance gates in real time to prevent duplicate entry attempts.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Velocity",
            desc: "Track real-time arrival graphs, entrance peak times, and percentage checked-in on your live organiser dashboard.",
          },
          {
            icon: Zap,
            title: "Offline Entrance Resilience",
            desc: "Maintain gate flow even if venue internet cuts out. Cached rosters validate passes locally and sync upon reconnection.",
          },
          {
            icon: ShieldCheck,
            title: "Secure Volunteer Station Mode",
            desc: "Equip temporary staff or student volunteers with restricted scanning interfaces secured by a 4-digit gate PIN.",
          },
          {
            icon: Clock,
            title: "Rapid Manual Lookup",
            desc: "Quick search by name, email, or Student ID allows door staff to admit attendees whose phone batteries have depleted.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Build Attendee Roster",
            desc: "Collect registrations through URPASS or import an existing attendee list via CSV.",
          },
          {
            n: "02",
            title: "Set Up Entrance Doors",
            desc: "Define your venue gates (e.g., Main Entrance, VIP Gate, North Door) and assign scanner PINs.",
          },
          {
            n: "03",
            title: "Deploy Volunteer Scanners",
            desc: "Door staff open the browser scanner link on their phones, enter the gate PIN, and begin scanning immediately.",
          },
          {
            n: "04",
            title: "Verify Tickets in <0.3s",
            desc: "Camera reads passes instantly with green confirmation for valid guests and red warning for duplicate attempts.",
          },
          {
            n: "05",
            title: "Track Live Dashboard",
            desc: "Watch real-time headcount numbers update live for venue health & safety compliance and post-event reporting.",
          },
        ],

        useCases: [
          "UK University Events & Society Balls",
          "Industry Trade Shows & Business Expos",
          "Academic Summits & Department Lectures",
          "Tech Conferences & Hackathons",
          "Exclusive VIP Networking Evenings",
          "Festivals & Outdoor Cultural Gatherings",
        ],

        relatedLinks: [
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Event Ticketing Software UK",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "How many doors can scan simultaneously?",
            a: "There is no limit. You can deploy 2, 10, or 50 scanner devices simultaneously across different entrance doors. All scans sync instantaneously over the cloud.",
          },
          {
            q: "Can door staff see confidential attendee information?",
            a: "No. The volunteer scanner station displays only the attendee's name, pass type, and check-in status. Administrative data and billing records remain restricted to account organisers.",
          },
          {
            q: "What if an attendee forgets their phone or their battery dies?",
            a: "Door staff can tap the 'Search' icon in the scanner interface to search by attendee name or email, view their ticket status, and check them in manually with one tap.",
          },
        ],

        ctaTitle: "Upgrade your venue gate operations",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Real-time synchronisation, sub-second scanning, and full offline resilience.",
      }}
    />
  );
}
