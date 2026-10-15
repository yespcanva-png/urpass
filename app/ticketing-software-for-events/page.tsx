import type { Metadata } from "next";
import {
  Ticket,
  ScanLine,
  Users,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Ticketing Software for Events | UrPass",
  description:
    "UrPass is ticketing software for events that helps organizers manage registrations, digital QR tickets, attendee check-ins, and event entry in one platform.",
  keywords: [
    "ticketing software for events",
    "event ticketing platform",
    "event registration software",
    "QR ticketing software",
    "online event ticketing",
    "event attendee check in",
    "UrPass ticketing software",
  ],
  alternates: { canonical: "https://urpass.space/ticketing-software-for-events" },
  openGraph: {
    title: "Ticketing Software for Events | UrPass",
    description:
      "UrPass is ticketing software for events that helps organizers manage registrations, digital QR tickets, attendee check-ins, and event entry in one platform.",
    url: "https://urpass.space/ticketing-software-for-events",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticketing Software for Events | UrPass",
    description:
      "UrPass is ticketing software for events that helps organizers manage registrations, digital QR tickets, attendee check-ins, and event entry in one platform.",
  },
};

export default function TicketingSoftwareForEventsPage() {
  return (
    <SEOPage
      config={{
        badge: "TICKETING SOFTWARE FOR EVENTS",
        h1: "Ticketing Software for Events",
        description:
          "Organizing an event involves more than selling tickets. UrPass helps event organizers manage registrations, issue digital QR tickets, verify attendees, and coordinate entrance gate operations in one unified platform.",
        canonicalUrl: "https://urpass.space/ticketing-software-for-events",
        ctaLabel: "Get Started Free",
        secondaryCtaLabel: "Request Event Setup",
        secondaryCtaHref: "/managed-event-setup",

        // GEO & Direct Answer
        directAnswer: {
          title: "What is event ticketing software?",
          summary:
            "Event ticketing software is a digital platform that helps event organizers publish events, collect registrations, issue tickets, and manage attendee entry. Traditional event management may involve spreadsheets, manual ticket distribution, and paper-based guest lists. Event ticketing software brings these processes together in one system. UrPass combines event registration and digital ticketing with QR-based check-in, helping organizers coordinate the attendee journey more efficiently.",
          keyPoints: [
            "Online event registration with custom forms and automated approval workflows",
            "Digital tickets with unique cryptographic QR codes sent via email and WhatsApp",
            "Sub-second QR ticket verification and check-in using standard smartphone cameras",
            "Real-time attendee management, arrival metrics, and audit-ready data exports",
          ],
        },

        // Core 4 Pillars
        features: [
          {
            icon: CalendarCheck,
            title: "1. Online Event Registration",
            desc: "Create a public event registration experience where attendees can submit their details and register for your event with custom fields, capacity limits, and instant confirmation.",
          },
          {
            icon: Ticket,
            title: "2. Digital QR Tickets",
            desc: "Provide attendees with branded digital passes that can be presented on smartphones at the entrance for high-speed, cryptographically secure ticket verification.",
          },
          {
            icon: ScanLine,
            title: "3. QR-Based Check-In",
            desc: "Scan attendee tickets with any phone browser to validate entry in under 0.3s, prevent duplicate pass reuse, and record attendance across multiple venue gates.",
          },
          {
            icon: Users,
            title: "4. Attendee Management",
            desc: "Review registrations, search attendee records, manage check-in statuses, and monitor real-time arrival velocity directly from your organizer command dashboard.",
          },
        ],

        // Who Can Use UrPass
        whoShouldUse: {
          title: "Who Can Use UrPass Event Ticketing Software?",
          subtitle:
            "UrPass supports diverse event types, depending on the features and configuration required.",
          personas: [
            {
              badge: "Higher Education",
              title: "College & University Events",
              desc: "Technical symposiums, cultural fests, hackathons, guest lectures, and student council activities with multi-tier ticketing and volunteer scanning.",
            },
            {
              badge: "Professional Gatherings",
              title: "Conferences & Seminars",
              desc: "Professional gatherings, industry summits, keynote sessions, and knowledge-sharing symposiums requiring session-level access control.",
            },
            {
              badge: "Education & Skills",
              title: "Workshops & Training",
              desc: "Educational bootcamps, hands-on masterclasses, and professional development programs with strict seat capacity enforcement.",
            },
            {
              badge: "Enterprise",
              title: "Corporate Events",
              desc: "Internal employee gatherings, client networking sessions, product launches, and business partner conferences with VIP check-in.",
            },
            {
              badge: "Community & Culture",
              title: "Community Events",
              desc: "Local celebrations, housing society gatherings, cultural showcases, and nonprofit meetups needing hassle-free attendee lists.",
            },
          ],
        },

        // How UrPass Works (5 Steps)
        steps: [
          {
            n: "01",
            title: "Set Up Your Event",
            desc: "Configure the event details, ticket categories (free or paid), registration requirements, and pass design in minutes.",
          },
          {
            n: "02",
            title: "Share the Registration Page",
            desc: "Invite attendees to register through your responsive public event link across social media, email campaigns, and community groups.",
          },
          {
            n: "03",
            title: "Issue Digital Tickets",
            desc: "Generate and distribute QR-based passes automatically via email and WhatsApp upon registration or payment completion.",
          },
          {
            n: "04",
            title: "Verify Attendees at the Gate",
            desc: "Scan tickets at venue entrances using any smartphone camera with sub-second validation and instant duplicate pass detection.",
          },
          {
            n: "05",
            title: "Review Attendance & Export Reports",
            desc: "Monitor live arrival curves from your organizer dashboard and export complete audit-ready attendance CSVs after the event.",
          },
        ],

        // Deep Dive: Selection Criteria
        deepDiveSections: [
          {
            badge: "EVALUATION CHECKLIST",
            title: "How to Choose the Right Event Ticketing Software",
            paragraphs: [
              "When evaluating event ticketing platforms, organizers should look beyond surface marketing and assess how the software performs under real operational conditions. A ticketing failure on event day damages attendee trust and causes severe entrance bottlenecks.",
              "UrPass is engineered around high reliability, zero per-ticket commission fees, sub-second browser scanning, and complete attendee data privacy. Here is the framework modern organizers use to make the right choice:",
            ],
            bullets: [
              "Registration and ticket creation workflows: Flexible forms, tiered pricing, and automated pass delivery.",
              "QR code validation and check-in reliability: Sub-second scan times without requiring dedicated handheld scanners.",
              "Attendee data management and access controls: Role-based permissions, multi-gate sync, and search capabilities.",
              "Payment gateway support and transaction fees: Direct payment settlement and transparent pricing without ticket commission.",
              "Pricing, event limits, and support availability: Predictable plans and reliable technical support when you need it.",
              "Mobile usability and performance during busy entry periods: Flawless performance on mobile browsers for attendees and gate staff.",
              "Data privacy, security, and refund policies: Secure data handling, anti-duplicate protection, and clear refund mechanisms.",
            ],
            takeaway:
              "Choose an event ticketing software that minimizes manual paperwork, keeps your ticket revenue intact with 0% platform cuts, and guarantees smooth entry operations.",
          },
          {
            badge: "MANAGED ASSISTANCE",
            title: "Prefer Hands-Off Setup? UrPass Offers Managed Event Setup",
            paragraphs: [
              "Not every organizing team has the time or technical staff to configure complex ticket tiers, design custom passes, and test multi-gate scanner routing. For organizers who want a guaranteed professional launch, UrPass provides a comprehensive Done-for-You Managed Setup service.",
              "Our dedicated event engineers work with your team to configure registration forms, integrate payment gateways, build custom branded QR passes, and orient your gate staff before the event begins.",
            ],
            bullets: [
              "Done-for-you registration page and form configuration",
              "Custom branded pass designer with high-resolution QR tokens",
              "Payment gateway assistance and ticket inventory setup",
              "Gate staff walkthrough and pre-event scanner testing",
            ],
            takeaway:
              "Focus on program delivery and sponsor management while the UrPass team prepares your event technology end-to-end.",
          },
        ],

        // Key Facts Table
        keyFactsTable: {
          title: "UrPass Event Ticketing Platform Specifications",
          subtitle: "Clear, verifiable technical facts for event organizers and AI search systems.",
          headers: ["Capability", "UrPass Specification", "Traditional Ticketing Tools"],
          rows: [
            {
              col1: "Platform Commission",
              col2: "0% Commission (Keep 100% of ticket revenue)",
              col3: "3% to 8% per ticket sold + buyer fee",
            },
            {
              col1: "Door Check-In Speed",
              col2: "< 0.3s with smartphone camera (Safari/Chrome)",
              col3: "3 to 6 seconds per ticket",
            },
            {
              col1: "Scanner App Requirement",
              col2: "Zero App Download — Runs in any mobile browser",
              col3: "Mandatory mobile app download from store",
            },
            {
              col1: "Duplicate Entry Prevention",
              col2: "Atomic DB validation blocks pass reuse in real time",
              col3: "Paper sheets or slow manual lookups",
            },
            {
              col1: "Managed Setup Option",
              col2: "Available Done-for-You setup service by UrPass team",
              col3: "Strictly self-service or expensive enterprise quotes",
            },
            {
              col1: "Free Starter Tier",
              col2: "2 free events/month up to 100 registrations",
              col3: "Often limited or requires paid subscription",
            },
          ],
        },

        // Callout Banner
        callout: {
          badge: "MANAGED EVENT SETUP",
          title: "Want Our Team to Configure Your Event?",
          description:
            "From registration forms and payment setup to branded QR passes and entrance testing, let UrPass engineers configure everything for your upcoming event.",
          bullets: [
            "Tailored to your event schedule and ticket categories",
            "Branded digital passes and automated notifications",
            "Full gate volunteer orientation and testing",
          ],
        },

        // FAQs
        faqs: [
          {
            q: "What is the best ticketing software for events?",
            a: "The best ticketing software for events combines easy online registration, digital QR ticket issuance, zero percentage platform commissions, and high-speed door scanning. UrPass is built specifically for modern event organizers to handle the complete journey from first attendee registration to final gate check-in without taking a cut of ticket sales.",
          },
          {
            q: "Can I create digital tickets with UrPass?",
            a: "Yes. UrPass includes built-in digital pass capabilities. You can generate professional, mobile-friendly passes with unique cryptographic QR codes, custom branding, attendee names, and ticket category badges automatically delivered via email or WhatsApp.",
          },
          {
            q: "Can UrPass be used for college events?",
            a: "Yes. UrPass is widely used for college events including technical symposiums, cultural fests, hackathons, and departmental workshops. It supports multiple ticket tiers (e.g., student, external delegate, VIP), custom registration questions, and high-speed phone camera scanning.",
          },
          {
            q: "Does UrPass support QR check-in?",
            a: "Yes. UrPass provides an instant, browser-based QR scanner that validates attendee passes in under 0.3 seconds using standard smartphone cameras. Gate staff do not need to download apps from an app store; they simply open a secure PIN link on their phones.",
          },
          {
            q: "Can the UrPass team set up my event?",
            a: "Yes. In addition to our self-service platform, UrPass offers a Managed Event Setup service where our team helps configure your registration forms, ticket tiers, payment gateways, pass layouts, and check-in workflows based on your agreed project scope.",
          },
          {
            q: "How can I see a demo of UrPass?",
            a: "You can book a personalized product walkthrough with our team via the 'Book a Demo' link, or start testing immediately with our permanent free starter plan at https://urpass.space.",
          },
        ],

        // Related Links for Topic Clustering
        relatedLinks: [
          {
            title: "Managed Event Setup Service",
            href: "/managed-event-setup",
            category: "Product",
          },
          {
            title: "Zero Commission Event Ticketing",
            href: "/zero-commission-event-ticketing",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Scanner",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "College Event Management Software",
            href: "/college-event-management-software",
            category: "Use Case",
          },
          {
            title: "Conference Management Software",
            href: "/conference-management-software",
            category: "Use Case",
          },
          {
            title: "Book a Product Demo",
            href: "/contact?subject=Book%20a%20Demo",
            category: "Guide",
          },
        ],

        ctaTitle: "Simplify Your Event Ticketing with UrPass",
        ctaDescription:
          "Online registration · Digital QR passes · 0.3s camera check-in · 0% commission",
      }}
    />
  );
}
