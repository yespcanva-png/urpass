import type { Metadata } from "next";
import {
  ClipboardList,
  Users,
  QrCode,
  BarChart3,
  Sliders,
  Clock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software — Forms, QR Passes & Approvals | UrPass",
  description:
    "Create event registration forms, manage attendee approvals and ticket availability, and issue digital QR passes for conferences, college fests, and workshops.",
  keywords: [
    "event registration software",
    "online event registration system",
    "event registration platform",
    "free event registration",
    "event registration form builder",
    "college event registration",
    "conference registration software",
    "google forms alternative for events",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software" },
  openGraph: {
    title: "Event Registration Software with Instant QR Passes | URPASS",
    description:
      "Create event registration pages, review attendee applications, manage capacity, and issue digital QR passes.",
    url: "https://urpass.space/event-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-software",
        badge: "MODERN EVENT REGISTRATION SOFTWARE",
        h1: "Event Registration Software with QR Passes and Approvals",
        description:
          "Create an event registration page, collect custom attendee answers, manage approvals and capacity, and issue digital QR passes from UrPass.",
        ctaLabel: "Start registrations free",
        secondaryCtaLabel: "Explore Remote Managed Setup",
        secondaryCtaHref: "/managed-event-setup",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is Event Registration Software?",
          summary:
            "Event registration software helps organizers collect attendee information, manage ticket choices and capacity, review applications, and issue entry passes. UrPass connects those steps to digital QR passes and a phone-based check-in workflow. Organizers can run free registrations or configure paid tickets where supported, then manage attendee records in the existing event dashboard.",
          keyPoints: [
            "Custom form builder collecting text, dropdown, file, and attendee demographics",
            "Capacity checks and reservation controls for limited ticket inventory",
            "Flexible approval workflows: instant auto-issuance or manual organizer screening",
            "Digital QR pass access by link and email; WhatsApp where enabled",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Registration Capabilities & Workflow Comparison",
          subtitle: "How dedicated event registration compares to generic forms like Google Forms or Typeform.",
          headers: ["Feature / Capability", "URPASS Event Registration", "Google Forms / Typeform"],
          rows: [
            {
              col1: "Pass & Ticket Issuance",
              col2: "Automated digital QR pass generated upon approval/payment",
              col3: "None (requires manual email mail-merge or third-party add-ons)",
            },
            {
              col1: "Capacity Limits & Overbooking",
              col2: "Capacity controls and reservation checks",
              col3: "No native capacity control; forms must be manually turned off",
            },
            {
              col1: "Entrance Gate Validation",
              col2: "Built-in phone camera scanner for gate check-in",
              col3: "Requires printing paper sheets and manual pen check-offs",
            },
            {
              col1: "Payment & Ticketing (India)",
              col2: "Integrated Razorpay checkout supporting instant UPI and cards",
              col3: "None; requires separate payment links and manual reconciliation",
            },
            {
              col1: "Attendee Approval Queues",
              col2: "Native Pending/Approved/Rejected dashboard with 1-click approvals",
              col3: "Row editing in Google Sheets; no automated attendee notification",
            },
            {
              col1: "Duplicate Submissions",
              col2: "Unique email/phone constraints block accidental multiple submissions",
              col3: "Frequent duplicate submissions cluttering event records",
            },
            {
              col1: "Attendee Invoicing",
              col2: "Payment and invoice records for supported paid flows",
              col3: "Manual invoice creation required",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: ClipboardList,
            title: "Custom Form Builder",
            desc: "Collect names, emails, phone numbers, college roll numbers, dietary choices, or portfolio links with custom validation.",
          },
          {
            icon: Sliders,
            title: "Flexible Approval Workflows",
            desc: "Choose between instant auto-issuance for open meetups, or manual organizer review for selective hackathons and summits.",
          },
          {
            icon: Clock,
            title: "Atomic Capacity Locks",
            desc: "Check ticket availability and reserve limited capacity through the existing booking flow.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Approved attendees receive a branded mobile QR pass immediately via direct link, eliminating PDF printing and lost tickets.",
          },
          {
            icon: Users,
            title: "Central Attendee CRM",
            desc: "Filter, search, tag, and export attendee rosters in CSV or Excel. Manage VIPs, speakers, and general delegates in one view.",
          },
          {
            icon: BarChart3,
            title: "Registration Velocity Analytics",
            desc: "Track daily signup spikes, conversion rates, traffic referral sources, and registration trends in real time.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REGISTRATION WORKFLOW",
          title: "Streamlined from Registration to Venue Gate",
          description:
            "Say goodbye to messy Google Sheets and manual pass emails. URPASS connects signup forms directly to gate check-in.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Engineered for Indian Organizers & Campus Fests",
          subtitle: "Built-in support for college student verification, UPI registration fees, and WhatsApp pass delivery.",
          items: [
            {
              title: "College Student Verification",
              description:
                "Collect college name, department, year of study, and roll number to easily verify inter-college participants.",
              badge: "Colleges",
            },
            {
              title: "UPI Registration Fees",
              description:
                "Collect workshop or fest entry fees seamlessly using PhonePe, Google Pay, or Paytm via Razorpay integration.",
              badge: "UPI 2.0",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Send digital QR entry passes directly to attendees' WhatsApp accounts for effortless gate retrieval.",
              badge: "WhatsApp",
            },
            {
              title: "GST Invoices for Corporates",
              description:
                "Capture company name and GSTIN to generate automated, compliant tax invoices for paid business delegates.",
              badge: "GSTIN",
            },
            {
              title: "Pan-India Multi-City Events",
              description:
                "Manage multi-city roadshows across Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, and Pune from one account.",
              badge: "National",
            },
            {
              title: "Transparent Flat Pricing",
              description:
                "Start with one active event and up to 100 registrations on the Free Forever plan, subject to current plan limits.",
              badge: "0% Fee",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "PROCESS AUTOMATION",
            title: "Why Generic Forms Break Down on Event Day",
            paragraphs: [
              "A general-purpose form can collect attendee responses, but event organizers also need to manage capacity, approvals, passes, and arrival records.",
              "Without a connected workflow, organizers may need to export responses, send separate pass emails, and prepare another list for gate staff.",
              "UrPass connects the registration form to attendee records, ticket availability, QR pass issuance, and a phone-based scanner so these steps can be managed in one place.",
            ],
            bullets: [
              "Automates pass generation without third-party mail-merge plugins",
              "Phone camera scanning can replace paper check-off lists",
              "Real-time attendance dashboard shows exact arrival percentages",
              "Keeps registration and check-in records together",
            ],
            takeaway:
              "A connected registration and check-in workflow reduces manual handoffs; results depend on the event and gate setup.",
          },
          {
            badge: "CAPACITY MANAGEMENT",
            title: "Preventing Overbooking with Atomic Capacity Reservations",
            paragraphs: [
              "When organizing high-demand workshops, hackathons, or VIP sessions with limited seats (e.g., 60 seats in a computer lab), multiple attendees often attempt to register at the exact same moment. Standard database forms register both users simultaneously, resulting in embarrassing overbooking.",
              "UrPass uses the existing ticket availability and reservation flow to check capacity during registration and checkout. Organizers can set limits for ticket tiers and review the resulting attendee records in the dashboard.",
            ],
            bullets: [
              "Capacity checks during registration and paid checkout",
              "Ticket inventory limits configured by the organizer",
              "Automatic waitlist queuing when maximum event capacity is reached",
              "Availability reflected in the booking flow",
            ],
            takeaway:
              "Precise capacity control ensures venue compliance, prevents embarrassing seat shortages, and creates genuine urgency for attendees.",
          },
        ],

        // Event-Specific Use Cases
        useCases: [
          "College Technical Symposiums",
          "Inter-College Hackathons",
          "Professional Conferences & Summits",
          "Hands-On Workshops & Bootcamps",
          "Corporate Townhalls & Product Launches",
          "Alumni Meets & Campus Reunions",
          "Founder Meetups & Networking Mixers",
          "Exhibitions & Trade Expos",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Online Event Registration System",
            href: "/online-event-registration-system",
            category: "Product",
          },
          {
            title: "College Event Registration System",
            href: "/college-events",
            category: "Use Case",
          },
          {
            title: "Free Event Registration Platform",
            href: "/event-registration-platform",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Gate Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Ticketing Software",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "WhatsApp Event Tickets & Delivery",
            href: "/whatsapp-event-tickets",
            category: "Product",
          },
          {
            title: "Event Registration with UPI",
            href: "/event-registration-with-upi",
            category: "Product",
          },
          {
            title: "Event Registration in India (UPI & INR)",
            href: "/in",
            category: "Location",
          },
          {
            title: "Compare: Google Forms vs URPASS",
            href: "/compare/google-forms-vs-urpass",
            category: "Comparison",
          },
          {
            title: "Guide: Event Registration vs Google Forms",
            href: "/guides/event-registration-software-vs-google-forms",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "What makes URPASS better than Google Forms for event registration?",
            a: "UrPass connects custom registration forms to capacity controls, attendee approvals, digital QR passes, and phone-based check-in. A general-purpose form may require additional tools for those event operations.",
          },
          {
            q: "Can I review and screen attendees before issuing an entry pass?",
            a: "Yes. URPASS supports both instant auto-approval (ideal for open webinars and free meetups) and manual approval queues (ideal for selective hackathons, masterclasses, and invite-only conferences). You can approve attendees individually or in bulk.",
          },
          {
            q: "How do attendees receive their registration passes?",
            a: "After approval or confirmed payment, attendees can open their digital pass. Email delivery is available by default; WhatsApp delivery depends on the organizer's settings and consent.",
          },
          {
            q: "Can I charge a registration fee using UPI or credit cards?",
            a: "Yes. By connecting your Razorpay account in settings, you can accept registration fees via UPI (PhonePe, Google Pay, Paytm), debit/credit cards, and net banking. Funds settle directly to your Indian bank account with 0% ticketing commission from URPASS.",
          },
          {
            q: "Is there a free plan for non-profit and community events?",
            a: "Yes. Free Forever has no payment or AutoPay requirement and includes one active event at a time with up to 100 registrations per event. See the pricing page for current limits and paid options.",
          },
          {
            q: "Can I collect custom questions like College Name or T-Shirt Size?",
            a: "Yes. URPASS allows you to configure custom form fields including text inputs, dropdown selects, numbers, and file uploads to capture all necessary attendee credentials.",
          },
        ],

        ctaTitle: "Create your event registration form in minutes",
        ctaDescription:
          "Free Forever available · Custom forms · Digital QR passes · Phone-based check-in",
      }}
    />
  );
}
