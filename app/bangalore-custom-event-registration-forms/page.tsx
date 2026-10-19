import type { Metadata } from "next";
import { CreditCard, FileText, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Forms Bangalore | UrPass",
  description: "Build customizable registration forms for Bangalore events with attendee questions, approval controls and digital pass issuance.",
  keywords: ["bangalore custom event registration forms","custom event registration forms for bangalore","event form builder bangalore","online registration form builder bengaluru","custom event form qr pass karnataka"],
  alternates: {
    canonical: "https://urpass.space/bangalore-custom-event-registration-forms",
  },
  openGraph: {
    title: "Event Registration Forms Bangalore | UrPass",
    description: "Build customizable registration forms for Bangalore events with attendee questions, approval controls and digital pass issuance.",
    url: "https://urpass.space/bangalore-custom-event-registration-forms",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration Forms Bangalore | UrPass",
    description: "Build customizable registration forms for Bangalore events with attendee questions, approval controls and digital pass issuance.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreCustomEventRegistrationFormsPage() {
  return (
    <SEOPage
      config={{
        badge: "CUSTOM REGISTRATION FORMS",
        h1: "Custom Event Registration Forms for Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-custom-event-registration-forms",
        description: "Build customizable registration forms for Bangalore events with attendee questions, approval controls and digital pass issuance.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-custom-event-registration-forms",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Build High-Converting Event Registration Forms in Minutes",
        ctaDescription: "Collect attendee details, configure custom questions, accept UPI/card payments via Razorpay, and automatically issue digital QR passes.",
        directAnswer: {
        "title": "What is the Best Custom Event Registration Form Builder for Bangalore?",
        "summary": "UrPass provides a specialized custom event registration form builder for Bangalore organizers. It allows event teams to configure custom questions, conditional logic, approval workflows, and paid ticket tiers while automatically generating encrypted digital QR passes and accepting direct UPI payments via Razorpay.",
        "keyPoints": [
                "Customizable form fields: text, multi-select, dropdowns, file uploads, and conditional logic",
                "Seamless integration with Razorpay for automated ticket payment collection with 0% ticket fees",
                "Instant issuance of branded digital QR passes delivered via WhatsApp and email",
                "Built-in capacity limits, early bird pricing schedules, and application review workflows"
        ]
},
        whatIs: {
        "title": "Why Bangalore Organizers Choose UrPass Over Generic Survey Forms",
        "definition": "While generic tools like Google Forms collect raw text into a spreadsheet, UrPass connects form submissions directly to live event operations: seat capacity management, UPI payment processing, fraud-proof digital ticket generation, and smartphone gate check-in.",
        "details": [
                "Automates digital QR pass generation immediately upon submission or payment",
                "Enforces strict seat and capacity caps to prevent overbooking",
                "Provides approval workflows to review and screen applicants before issuing passes",
                "Eliminates manual payment reconciliation by integrating direct payment gateways"
        ]
},
        keyFactsTable: {
        "title": "UrPass Form Builder vs Generic Forms (Google Forms / Typeform)",
        "subtitle": "Why purpose-built event registration software outperforms generic survey tools in Bangalore.",
        "headers": [
                "Capability",
                "Generic Form Tools (Google Forms / Typeform)",
                "UrPass Event Form Builder"
        ],
        "rows": [
                {
                        "col1": "QR Ticket Issuance",
                        "col2": "Requires complex third-party add-ons or Zapier zaps",
                        "col3": "Built-in automatic generation of encrypted digital QR passes"
                },
                {
                        "col1": "Payment Collection",
                        "col2": "Requires unverified screenshot uploads or expensive plugin tiers",
                        "col3": "Direct Razorpay UPI integration with 0% ticket fees"
                },
                {
                        "col1": "Gate Entrance Check-In",
                        "col2": "None; manual paper printout or spreadsheet lookup at door",
                        "col3": "Sub-0.3s smartphone camera scanner with duplicate blocking"
                },
                {
                        "col1": "Capacity Limits",
                        "col2": "Forms stay open when full, causing embarrassing overbooking",
                        "col3": "Automated real-time inventory caps that lock sold-out tiers"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "MOBILE-FIRST DESIGN",
                "title": "Mobile-First Design That Maximizes Attendee Completion",
                "paragraphs": [
                        "More than 75% of event registrations in Bangalore take place on mobile devices following social media, LinkedIn, or WhatsApp promotions. Traditional form builders often suffer from clunky multi-page layouts and slow loading times that drive potential attendees away.",
                        "UrPass forms are engineered for sub-second page loads and mobile-optimized touch controls. Custom fields, file uploads, and tier selectors adapt seamlessly to any screen size, ensuring a polished, professional attendee experience that maximizes conversion."
                ],
                "bullets": [
                        "Lightweight, clean white-label interface with custom brand colors and logos",
                        "Mobile-optimized input fields with native autofill and keypad support",
                        "Configurable custom questions tailored to your event (t-shirt size, dietary needs, company ID)",
                        "Zero intrusive platform advertising or competitor recommendations"
                ],
                "takeaway": "Clean, fast-loading mobile forms minimize registration friction and boost signups."
        },
        {
                "badge": "SCREENING CONTROLS",
                "title": "Approval Workflows and Capacity Controls for Curated Events",
                "paragraphs": [
                        "Not all Bangalore events are open to everyone. Developer hackathons, VIP investor dinners, leadership summits, and technical workshops often require an application screening process before granting admission.",
                        "UrPass features built-in application approval workflows. Organizers can review submitted applicant profiles, verify portfolio links or LinkedIn profiles, and approve candidates with a single click. Upon approval, UrPass automatically generates and dispatches the attendee's digital pass."
                ],
                "bullets": [
                        "Review and approve individual applications or batch-approve candidate groups",
                        "Automated acceptance and waitlist notification emails",
                        "Hard capacity caps that automatically close registration when maximum capacity is reached",
                        "Tiered registration windows with automated early-bird pricing schedules"
                ],
                "takeaway": "Automated approval workflows streamline selective attendee screening."
        }
],
        featuresTitle: "Core Ticketing & Entry Capabilities",
        featuresSubtitle: "Engineered for Bengaluru event organizers seeking speed and zero ticket commissions.",
        features: [
          {
            icon: FileText,
            title: "Custom Form Fields",
            desc: "Collect text, dropdowns, checkboxes, phone numbers, and file uploads easily.",
          },
          {
            icon: QrCode,
            title: "Automated QR Pass Delivery",
            desc: "Instantly generate and email digital QR passes upon successful registration.",
          },
          {
            icon: CreditCard,
            title: "Paid & Free Ticket Tiers",
            desc: "Set up free RSVP tiers, paid VIP passes, and early bird tickets with 0% platform fees.",
          },
          {
            icon: ShieldCheck,
            title: "Capacity & Inventory Caps",
            desc: "Prevent overbooking with real-time seat limits that close tiers automatically.",
          },
          {
            icon: Users,
            title: "Application Approval Workflow",
            desc: "Review and approve attendee applications before issuing entrance passes.",
          },
          {
            icon: ScanLine,
            title: "Integrated Gate Scanning",
            desc: "Scan submitted attendees at the door in <0.3s with smartphone camera scanners.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Form",
                "desc": "Add event details, date, venue, and configure custom attendee questions."
        },
        {
                "n": "02",
                "title": "Set Ticket Tiers",
                "desc": "Configure free or paid ticket tiers with capacity limits and pricing."
        },
        {
                "n": "03",
                "title": "Publish & Share",
                "desc": "Share your branded registration link across social media, WhatsApp, and email."
        },
        {
                "n": "04",
                "title": "Automated Ticket Dispatch",
                "desc": "Attendees receive instant digital QR passes upon submission or payment."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Volunteers scan attendee QR passes at the door for instant green verification."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass Form Builder in Bangalore?",
        "subtitle": "Built for event teams who need flexible forms connected directly to gate entry.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Conferences & Summits",
                        "desc": "Collect job titles, dietary restrictions, and company names while issuing professional badges."
                },
                {
                        "badge": "COLLEGES",
                        "title": "College Symposiums & Fests",
                        "desc": "Capture department names, student roll numbers, and paper presentation uploads."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Creator Masterclasses",
                        "desc": "Sell limited seats with instant UPI checkout and automated calendar invites."
                },
                {
                        "badge": "HACKATHONS",
                        "title": "Developer Hackathons",
                        "desc": "Screen applicant developer profiles and GitHub links before issuing team passes."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "From Form Submission to Door Check-In",
        "subtitle": "Complete operational harmony between registration and gate entry.",
        "description": "The moment an attendee submits your registration form, UrPass creates a verified database record and generates an encrypted digital QR pass. On the day of the event, door volunteers open the UrPass scanner URL on their smartphone browser and scan the attendee pass in under 0.3 seconds.",
        "points": [
                "Custom question answers (like VIP status or meal choice) appear on the scanner screen.",
                "Atomic duplicate blocking prevents pass sharing across multiple entrance gates.",
                "Scanners work directly in mobile browsers with zero app installation.",
                "Export complete registration data along with exact entry timestamps anytime."
        ]
},
        faqs: [
        {
                "q": "Can I collect custom questions like dietary preferences or company names?",
                "a": "Yes. The UrPass form builder allows you to create unlimited custom fields including short text, long text, dropdowns, radio buttons, checkboxes, and file uploads."
        },
        {
                "q": "Can I collect payments directly through the registration form in Bangalore?",
                "a": "Yes. You can connect your Razorpay account to accept instant UPI, cards, and net banking with 0% UrPass platform ticket commissions."
        },
        {
                "q": "How do attendees receive their tickets after submitting the form?",
                "a": "Attendees immediately receive a confirmation email containing their digital QR pass. If WhatsApp delivery is enabled, they also receive their pass link directly in their WhatsApp chat."
        },
        {
                "q": "Can I review and approve registrations before issuing tickets?",
                "a": "Yes. You can enable approval workflows on your event form. Attendees submit their application, and passes are generated only after you approve them in your organizer dashboard."
        },
        {
                "q": "What happens when ticket capacity is reached?",
                "a": "UrPass automatically closes registration for that tier when the allocated capacity limit is reached, preventing accidental overbooking."
        }
],
      }}
    />
  );
}
