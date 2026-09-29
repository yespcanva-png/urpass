import type { Metadata } from "next";
import {
  Globe,
  QrCode,
  ShieldCheck,
  CreditCard,
  ScanLine,
  BarChart3,
  Lock,
  Building2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software UK | URPASS",
  description:
    "Event registration & QR check-in software UK: manage British conferences, university fests, and workshops with digital QR passes and GBP (£) payouts.",
  alternates: { canonical: "https://urpass.space/event-registration-software-uk" },
  openGraph: {
    title: "Event Registration & QR Check-In Software UK | URPASS",
    description:
      "Event registration & QR check-in software UK: manage British conferences, university fests, and workshops with digital QR passes and GBP (£) payouts.",
    url: "https://urpass.space/event-registration-software-uk",
  },
};

export default function EventRegistrationSoftwareUkPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-software-uk",
        badge: "UNITED KINGDOM EVENT OPERATIONS",
        h1: "Event Registration & QR Check-In Software UK",
        description:
          "The modern event registration and QR check-in software for the United Kingdom. Manage British conferences, university societies, summits, and workshops with digital QR passes, GBP (£) checkout, UK GDPR compliance, and 0% commission options.",
        ctaLabel: "Start free event registration UK",
        directAnswer: {
          title: "What is event registration software UK?",
          summary:
            "Event registration software UK provides British event organizers with online registration forms, digital QR ticket issuance, GBP (£) payment collection, and rapid smartphone entrance check-in compliant with UK GDPR and data privacy standards.",
          keyPoints: [
            "Registration → Digital QR Pass → Payment → Check-In → Attendance workflow",
            "Native British Pounds (GBP £) checkout with Apple Pay, Google Pay, and cards",
            "Full UK GDPR and Data Protection Act 2018 compliance with total data ownership",
            "Zero commission ticketing plans save British organizers £1,000s compared to Eventbrite UK",
          ],
        },
        steps: [
          {
            n: "01",
            title: "Create Event in GBP",
            desc: "Set ticket prices in British Pounds (£), configure early-bird tiers, and set venue capacity limits.",
          },
          {
            n: "02",
            title: "Build GDPR Form",
            desc: "Collect attendee details, job titles, university affiliations, and consent opt-ins with custom fields.",
          },
          {
            n: "03",
            title: "Share UK Event Page",
            desc: "Publish your customized event link across London, Manchester, Edinburgh, and UK social channels.",
          },
          {
            n: "04",
            title: "1-Click Apple Pay",
            desc: "Attendees purchase tickets in seconds using Apple Pay, Google Pay, or debit/credit cards.",
          },
          {
            n: "05",
            title: "Issue Digital Passes",
            desc: "Attendees receive clean, branded digital QR passes directly on their mobile phones and Apple Wallet.",
          },
          {
            n: "06",
            title: "Scan at UK Venues",
            desc: "Door staff scan passes using smartphone cameras in < 0.5s with instant duplicate ticket detection.",
          },
        ],
        features: [
          {
            icon: CreditCard,
            title: "GBP (£) & Apple Pay Checkout",
            desc: "Seamless payment checkout in British Pounds supporting Apple Pay, Google Pay, Visa, Mastercard, and Amex.",
          },
          {
            icon: Lock,
            title: "UK GDPR Compliant",
            desc: "Full compliance with the UK Data Protection Act 2018. Attendee data is stored securely and never sold to third parties.",
          },
          {
            icon: QrCode,
            title: "Digital QR Event Passes",
            desc: "Issue modern mobile passes that work offline on attendee phones without requiring heavy app downloads.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Check-In",
            desc: "Turn staff and volunteer smartphones into industrial-grade QR scanners in seconds using a secure link.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Pass Sharing Security",
            desc: "Real-time cloud synchronization stops forwarded screenshots and duplicate ticket use at all venue entrances.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance & Roster Exports",
            desc: "Monitor live door velocity, track no-show percentages, and download clean CSV reports for event stakeholders.",
          },
        ],
        competitorComparison: {
          title: "URPASS UK vs Eventbrite UK",
          subtitle:
            "How British event organizers cut ticketing costs and protect attendee data privacy.",
          competitorName: "Eventbrite UK",
          rows: [
            {
              criteria: "Platform Commission Cut",
              urpass: "0% commission options on flat subscription plans",
              competitor: "6.95% + £0.59 per ticket plus organizer listing fees",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Booking Surcharges",
              urpass: "£0 surprise markups charged to your ticket buyers",
              competitor: "Heavy service fees added to the buyer at checkout",
              urpassAdvantage: true,
            },
            {
              criteria: "UK GDPR & Privacy Control",
              urpass: "100% private to you — we never advertise competing events to your attendees",
              competitor: "Retains buyer data to recommend other events across their marketplace",
              urpassAdvantage: true,
            },
            {
              criteria: "Door Scanner Equipment",
              urpass: "Any smartphone camera with instant volunteer scanner links",
              competitor: "Proprietary app required with login barriers for temporary staff",
              urpassAdvantage: true,
            },
            {
              criteria: "University & Student Societies",
              urpass: "Free forever tier supporting up to 100 registrations per month at £0",
              competitor: "Charges fees on every paid ticket regardless of non-profit or student status",
              urpassAdvantage: true,
            },
            {
              criteria: "Custom Pass Design",
              urpass: "Custom logos, primary brand colors, and shaped mobile passes",
              competitor: "Generic standard Eventbrite PDF layout with prominent competitor logos",
              urpassAdvantage: true,
            },
          ],
        },
        callout: {
          badge: "UK OPERATIONAL SCALE",
          title: "From university societies in Oxford to tech summits in London.",
          description:
            "British event organizers in London, Manchester, Birmingham, Edinburgh, and Bristol trust URPASS for streamlined registrations, rapid phone-based door check-in, and zero predatory aggregator commissions.",
          bullets: [
            "Support for UK university societies, student unions, and academic departments",
            "VAT compliant invoicing and corporate billing receipts",
            "Offline-resilient scanning handles heritage venues and thick stone building signal drops",
            "Clean web experience with zero intrusive marketplace pop-ups or spam",
          ],
        },
        useCases: [
          "London Tech Summits & Meetups",
          "University Societies & Student Balls",
          "Academic Conferences & Symposiums",
          "Corporate Workshops & Masterclasses",
          "Charity Galas & Fundraisers",
          "Live Music & Comedy Performances",
          "Trade Shows & Industry Expos",
          "Sports Tournaments & Club Matches",
        ],
        deepDiveSections: [
          {
            badge: "GDPR COMPLIANCE",
            title: "Data Sovereignty and UK Privacy Compliance for Event Planners",
            paragraphs: [
              "Following Brexit, UK event organizers must comply strictly with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. Relying on global ticketing aggregators that pool attendee emails into promotional ad networks creates substantial compliance risks and alienates professional delegates.",
              "URPASS treats you as the sole Data Controller of your attendee information. Your attendee lists are encrypted, isolated, and completely private. You can honor Right to Erasure requests with a single click and export clean data rosters without third-party tracking pixels.",
            ],
            bullets: [
              "Strict consent capture with custom opt-in checkboxes on registration forms",
              "Zero marketing to your attendees: your guest list is never cross-promoted",
              "Instant data deletion and export capabilities compliant with UK Information Commissioner's Office (ICO) standards",
            ],
            takeaway:
              "Run professional British events with absolute data privacy and regulatory confidence.",
          },
        ],
        faqs: [
          {
            q: "Can I sell event tickets in British Pounds (GBP £)?",
            a: "Yes. URPASS natively supports British Pounds (GBP £) alongside EUR and USD, allowing attendees to pay via Apple Pay, Google Pay, and all major UK credit and debit cards.",
          },
          {
            q: "Is URPASS compliant with UK GDPR regulations?",
            a: "Yes. URPASS complies fully with the UK Data Protection Act 2018 and UK GDPR. Attendee data is stored securely, never sold or cross-promoted to third parties, and organizers maintain full control over attendee records.",
          },
          {
            q: "How does URPASS compare to Eventbrite UK for pricing?",
            a: "Eventbrite UK charges up to 6.95% + £0.59 per ticket plus organizer plan fees. URPASS offers zero-commission ticketing plans where you pay 0% platform commission on ticket sales, saving hundreds to thousands of pounds on every event.",
          },
          {
            q: "Can UK university societies and student unions use URPASS for free?",
            a: "Yes! URPASS provides a free tier supporting up to 100 registrations/month at £0 forever, making it ideal for UK university student societies, academic clubs, and non-profit community events.",
          },
          {
            q: "Do door staff need special barcode scanners at the venue?",
            a: "No. Staff and volunteers scan attendee digital QR passes directly using the camera on any standard iPhone or Android smartphone via a secure web link, with no hardware rentals required.",
          },
          {
            q: "Does the scanner work in older UK venues with poor mobile phone reception?",
            a: "Yes. URPASS features local client caching and offline check-in capability, allowing scanners to validate attendee passes smoothly even in basements or historic UK venues with zero cellular reception.",
          },
          {
            q: "Can I issue UK VAT invoices to corporate attendees?",
            a: "Yes. You can collect attendee company names and UK VAT registration numbers to generate automated, compliant tax invoice receipts for corporate delegates.",
          },
        ],
        relatedLinks: [
          { title: "Events in the UK Hub", href: "/uk", category: "Location" },
          { title: "Zero Commission Ticketing UK", href: "/zero-commission-event-ticketing-uk", category: "Product" },
          { title: "London Event Ticketing", href: "/uk/london", category: "Location" },
          { title: "Manchester Event Ticketing", href: "/uk/manchester", category: "Location" },
          { title: "QR Event Check-In Software", href: "/qr-event-check-in", category: "Product" },
          { title: "Eventbrite Alternative UK", href: "/compare/eventbrite-alternative-uk", category: "Comparison" },
        ],
        ctaTitle: "Launch your UK event registration with URPASS",
        ctaDescription:
          "GBP (£) checkout, UK GDPR compliance, sub-second smartphone check-in, and 0% commission cuts. Free to start.",
      }}
    />
  );
}
