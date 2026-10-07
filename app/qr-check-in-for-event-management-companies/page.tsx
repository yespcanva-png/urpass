import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Check-In System for Event Management Companies | UrPass",
  description: "Equip your on-site event crew with sub-second smartphone QR scanning. Zero hardware rental, real-time gate synchronization, and instant PIN logins.",
  keywords: [
    "QR check in event management company",
    "QR check in event management company online",
    "QR check in event management company platform",
    "QR check in event management company check in",
    "QR check in event management company qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/qr-check-in-for-event-management-companies",
  },
  openGraph: {
    title: "QR Check-In System for Event Management Companies | UrPass",
    description: "Equip your on-site event crew with sub-second smartphone QR scanning. Zero hardware rental, real-time gate synchronization, and instant PIN logins.",
    url: "https://urpass.space/qr-check-in-for-event-management-companies",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CREW & FIELD OPS EDITION",
        h1: "Fast QR Check-In System for Event Management Companies & Field Crews",
        canonicalUrl: "https://urpass.space/qr-check-in-for-event-management-companies",
        description: "Equip your on-site event crew with sub-second smartphone QR scanning. Zero hardware rental, real-time gate synchronization, and instant PIN logins.",
        ctaLabel: "Deploy Crew Scanners Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "See Crew Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best QR check-in system for event management companies?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For event management companies, UrPass turns any crew member's phone into a 0.28-second optical scanner with zero app downloads, real-time cross-door sync, and instant volunteer PIN access.",
          keyPoints: ["Turn 20+ crew smartphones into high-velocity scanners in under 30 seconds using PIN links","Sub-0.3s optical camera scanning clears 40+ attendees per minute per crew member","Atomic database locking stops screenshotted pass reuse across separate venue doors","Real-time ops dashboard lets crew leads monitor gate flow and relieve bottlenecks"],
        },
        whatIs: {
          title: "What is a QR Check-In System for Event Companies?",
          definition: "A QR check-in system for event management companies is an agile, browser-based access control solution that allows field teams to verify thousands of attendee digital passes using standard mobile phone cameras without renting specialized hardware.",
          details: ["Eliminates thousands in hardware rental, shipping, and laser terminal configuration costs","Enables crew members to begin scanning immediately without creating personal accounts","Provides clear visual (green/red) and audio feedback for rapid, mistake-free door entry","Maintains real-time attendance synchronization across all entrance turnstiles"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: ScanLine,
            title: "Zero App Download Scanners",
            desc: "Crew members scan tickets directly in Safari or Chrome on their own mobile devices.",
          },
          {
            icon: Lock,
            title: "PIN-Code Scanner Auth",
            desc: "Authorize field staff instantly with a 6-digit PIN—no usernames, passwords, or logins required.",
          },
          {
            icon: Zap,
            title: "0.28s Optical Engine",
            desc: "High-speed camera decoder reads QR codes instantly on phone screens or printed badges.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Detection",
            desc: "Re-scanning any pass sounds an immediate red alert with the exact timestamp of first entry.",
          },
          {
            icon: CheckCircle2,
            title: "Tier & Door Filtering",
            desc: "Set individual phones to scan specific gates (e.g. VIP Concourse, General North Door).",
          },
          {
            icon: BarChart3,
            title: "Live Field Telemetry",
            desc: "Crew leads can track scanning velocity per device, total door headcount, and unverified guests.",
          },
        ],
        deepDiveSections: [
          {
            badge: "FIELD CREW EFFICIENCY",
            title: "Why Field Ops Teams are Ditching Dedicated Laser Terminals",
            paragraphs: ["Traditional event check-in required event management companies to rent bulky handheld laser barcode terminals, transport heavy charging cases, and spend hours configuring local Wi-Fi bridges. If a rented scanner failed on-site, the team was left stranded with no backup.","UrPass revolutionizes field operations by running on standard smartphones. If an unexpected rush hits Gate 2, the crew lead simply texts a 6-digit PIN scanner link to two extra volunteers. In under 20 seconds, two new scanning stations are live, doubling entrance throughput without spending a dime on equipment."],
            bullets: ["Instant scalability—add new scanners in 20 seconds during unexpected gate rushes","Zero hardware rental costs, shipping delays, or battery charging dock hassles","Sub-150ms real-time database sync ensures absolute pass security across all doors","Works smoothly on standard 4G/5G cellular data without complex on-site Wi-Fi"],
            takeaway: "UrPass gives event management companies unmatched operational agility and massive cost savings on every production.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Field Check-In Requirement","Rented Handheld Terminals","UrPass Mobile Crew Scanner"],
          rows: [{"col1":"Hardware Cost per Event","col2":"$300–$1,000+ in rental fees","col3":"$0 (crew's existing smartphones)"},{"col1":"Staff Setup & Training Time","col2":"30–60 minutes per device","col3":"Under 30 seconds (browser PIN login)"},{"col1":"Emergency Scanner Addition","col2":"Impossible if spare hardware runs out","col3":"Instant (send link to any staff phone)"},{"col1":"Scan Latency","col2":"1.0–2.5 seconds per scan","col3":"0.28 seconds optical camera scan"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Event Production Companies","desc":"Equip door security and volunteer teams at awards nights, galas, and concerts.","badge":"PRODUCTION"},{"title":"Trade Show Crew Leads","desc":"Deploy dozens of scanners across exhibition hall turnstiles and badge pickup desks.","badge":"EXHIBITIONS"},{"title":"Sports Event Operations","desc":"Verify athlete check-ins, spectator tickets, and hospitality suite badges.","badge":"SPORTS"},{"title":"Festival Ground Staff","desc":"Manage multi-door perimeter entry and VIP camping access points.","badge":"FESTIVALS"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
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
                    "q": "Do our crew members need to download an app from the App Store?",
                    "a": "No. UrPass runs entirely in standard mobile browsers (Safari, Chrome, etc.). Crew members simply click a link and start scanning with their device camera."
          },
          {
                    "q": "How do we give temporary staff access to scan without sharing passwords?",
                    "a": "Organizers can generate secure volunteer scanner PIN links. Crew members enter a simple PIN code to activate scanner mode without gaining access to financial or admin settings."
          },
          {
                    "q": "How fast is the smartphone camera scanner?",
                    "a": "UrPass's optical engine decodes QR codes in 0.28 seconds, allowing staff to process 35 to 45 attendees per minute."
          },
          {
                    "q": "What happens if a crew member scans an invalid or duplicate pass?",
                    "a": "The phone screen flashes red and sounds an immediate error tone, displaying whether the ticket is invalid or already checked in at another gate."
          },
          {
                    "q": "Can crew leads monitor how many attendees each staff member has scanned?",
                    "a": "Yes. The live ops dashboard displays scan counts and activity timestamps per scanner device."
          },
          {
                    "q": "Does the scanner work in low-light environments like concerts?",
                    "a": "Yes. Digital QR passes on attendee phone screens emit their own light, and UrPass's optical engine works exceptionally well in dim venue lighting."
          },
          {
                    "q": "Can we restrict certain crew phones to VIP-only doors?",
                    "a": "Yes. You can assign gate rules to specific scanner links so staff at VIP doors only validate VIP credentials."
          }
],
        ctaTitle: "Fast QR Check-In System for Event Management Companies & Field Crews",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
