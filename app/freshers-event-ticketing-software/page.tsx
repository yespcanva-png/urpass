import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Freshers Event Ticketing & Student Union QR Entry Software UK | UrPass",
  description: "Sell Freshers Week passes, society club night tickets, and campus wristband access with 0% commission and ultra-fast smartphone door scanning.",
  keywords: [
    "freshers event ticketing software",
    "freshers event ticketing software online",
    "freshers event ticketing software platform",
    "freshers event ticketing software check in",
    "freshers event ticketing software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/freshers-event-ticketing-software",
  },
  openGraph: {
    title: "Freshers Event Ticketing & Student Union QR Entry Software UK | UrPass",
    description: "Sell Freshers Week passes, society club night tickets, and campus wristband access with 0% commission and ultra-fast smartphone door scanning.",
    url: "https://urpass.space/freshers-event-ticketing-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "UK FRESHERS & STUDENT UNIONS",
        h1: "Freshers Event Ticketing & Fast QR Door Entry Software UK",
        canonicalUrl: "https://urpass.space/freshers-event-ticketing-software",
        description: "Sell Freshers Week passes, society club night tickets, and campus wristband access with 0% commission and ultra-fast smartphone door scanning.",
        ctaLabel: "Launch Freshers Ticketing",
        ctaHref: "/signup",
        secondaryCtaLabel: "View UK Student Union Pricing",
        secondaryCtaHref: "/pricing?country=GB",
        directAnswer: {
          title: "What is the best ticketing software for UK Freshers Week events?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For UK Freshers Week events, UrPass delivers 0% commission ticket sales, multi-event pass bundles (Freshers Wristband, Club Nights, Society Fairs), and sub-0.3s smartphone door check-in to clear thousands of students quickly.",
          keyPoints: ["0% platform commission on paid Freshers Week passes and club night tickets","Instant pass delivery to student email and Apple/Google Wallet with unique QR codes","Atomic duplicate blocking stops screenshot pass sharing across nightclub doors","Student Union crew scan tickets on standard smartphones with zero equipment rentals"],
        },
        whatIs: {
          title: "What is Freshers Event Ticketing Software?",
          definition: "Freshers event ticketing software is a high-volume ticketing and access control solution tailored for UK Student Unions and university promoters to manage Freshers Week wristbands, club nights, and campus fairs.",
          details: ["Saves Student Unions thousands of pounds in ticket commission fees","Clears long nightclub and venue queues in minutes using 0.28-second optical scanning","Prevents fraudulent pass sharing through atomic real-time database locks","Supports multi-event pass bundles and tiered student society memberships"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Freshers Wristband Bundles",
            desc: "Sell all-access multi-night Freshers passes or individual event tickets with custom caps.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of student ticket revenue with direct Stripe card settlement into the SU account.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Nightclub Scanning",
            desc: "Scan digital QR passes on smartphone screens rapidly in dark venue entrances.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Screenshot Pass Protection",
            desc: "Atomic database locking rejects duplicate screenshotted tickets across doors instantly.",
          },
          {
            icon: Lock,
            title: "Volunteer & Security PIN Logins",
            desc: "Authorize bar and security staff as scanners in 10 seconds without sharing master accounts.",
          },
          {
            icon: BarChart3,
            title: "Live Capacity & Ingress Tracking",
            desc: "Monitor live student numbers inside the venue to comply with licensing and capacity laws.",
          },
        ],
        deepDiveSections: [
          {
            badge: "UK NIGHTLIFE INGRESS",
            title: "Managing High-Throughput Nightlife Doors During Freshers Week",
            paragraphs: ["Freshers Week is the busiest week of the academic year for UK Student Unions. With thousands of excited new students arriving at venue doors simultaneously, slow door scanning causes street queues, noise complaints, and licensing friction.","UrPass provides the speed needed for intense freshers night operations. Student Union staff scan digital passes using their own phone cameras. With UrPass's 0.28-second optical scan engine, 4 door staff easily process 140+ students per minute. Atomic database synchronization prevents students from sharing screenshots of their all-access passes with non-ticket holders."],
            bullets: ["4 smartphone scanners admit over 1,000 students in less than 10 minutes","Instant visual (green/red) and audio feedback keeps door flow moving smoothly","Saves Student Unions thousands in commercial ticketing percentage cuts","Real-time venue capacity telemetry ensures full compliance with UK venue licensing"],
            takeaway: "UrPass ensures UK Student Unions deliver safe, queue-free, and profitable Freshers Week celebrations.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Freshers Ticketing Metric","Legacy Commercial Portals","UrPass UK Freshers Platform"],
          rows: [{"col1":"Ticket Commission","col2":"5%–10% per ticket fee","col3":"0% ticket commission (keep 100%)"},{"col1":"Door Check-In Velocity","col2":"15–20 seconds per student","col3":"0.28s ultra-fast camera scan"},{"col1":"Screenshot Fraud Protection","col2":"Weak / slow sync","col3":"Sub-150ms atomic duplicate rejection"},{"col1":"Scanner Hardware Cost","col2":"£200–£500 scanner rentals","col3":"£0 (uses SU staff smartphones)"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"University Student Unions (SUs)","desc":"Manage all-access Freshers wristbands, welcome fairs, and official evening gigs.","badge":"STUDENT UNION"},{"title":"Campus Nightlife Promoters","desc":"Sell out student club nights, foam parties, and silent discos with instant payouts.","badge":"NIGHTLIFE"},{"title":"University Sports Clubs","desc":"Manage freshers trials, initiation socials, and welcome mixers.","badge":"SPORTS CLUBS"},{"title":"Academic Student Societies","desc":"Welcome new first-year students with free society fair sign-ups and meetups.","badge":"SOCIETIES"}],
        },
        relatedLinks: [
        {
                "title": "UK Event Hub & GBP Pricing",
                "href": "/uk",
                "category": "Location"
        },
        {
                "title": "London Event QR Check-In",
                "href": "/uk/london/event-qr-check-in",
                "category": "Location"
        },
        {
                "title": "Zero Commission Ticketing UK",
                "href": "/zero-commission-event-ticketing-uk",
                "category": "Product"
        },
        {
                "title": "Event Features Suite",
                "href": "/features",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "How does UrPass help UK Student Unions run Freshers Week?",
                    "a": "UrPass provides 0% commission ticketing, instant digital pass delivery to students, ultra-fast smartphone scanning for door staff, and real-time venue capacity tracking."
          },
          {
                    "q": "Does UrPass charge commission on Freshers ticket sales?",
                    "a": "No. UrPass charges 0% commission on ticket sales, saving Student Unions thousands of pounds compared to commercial ticketing companies."
          },
          {
                    "q": "How do door security and bar staff scan tickets?",
                    "a": "Staff open a volunteer scanner link on their mobile phones and enter a PIN code. They point their camera at the student's QR code for instant 0.28-second verification."
          },
          {
                    "q": "Can students share screenshots of their Freshers passes?",
                    "a": "No. The instant a pass is scanned at the entrance, it is marked as checked in. Any duplicate scan attempt triggers an immediate red error alert with the exact first-scan timestamp."
          },
          {
                    "q": "Can we sell multi-event Freshers Wristbands?",
                    "a": "Yes. You can configure multi-tier passes, bundles, and single-event tickets with custom capacity caps and pricing."
          },
          {
                    "q": "Does UrPass support UK GBP (£) pricing and payment gateways?",
                    "a": "Yes. UrPass connects directly to your Stripe account, accepting UK debit/credit cards, Apple Pay, and Google Pay with direct GBP settlements."
          },
          {
                    "q": "Can we track live venue numbers for licensing compliance?",
                    "a": "Yes. The live ops console displays total checked-in students and current venue occupancy in real time."
          }
],
        ctaTitle: "Freshers Event Ticketing & Fast QR Door Entry Software UK",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
        geo: {
          region: "United Kingdom",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB"
        },
      }}
    />
  );
}
