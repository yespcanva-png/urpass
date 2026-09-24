import type { Metadata } from "next";
import {
  Wrench,
  Users,
  QrCode,
  ScanLine,
  Clock,
  ShieldCheck,
  CreditCard,
  Sliders,
  CheckCircle2,
  FileCheck,
  Laptop,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Platform for Workshops & Masterclasses — URPASS",
  description:
    "Specialized ticketing platform for workshops and masterclasses. Atomic seat capacity locks, screening questions, instant UPI payments, 0% commission, and digital QR passes.",
  keywords: [
    "event ticketing platform for workshops",
    "workshop registration software",
    "masterclass ticketing system",
    "bootcamp registration platform",
    "workshop seat capacity management",
    "hands on training ticketing",
    "upi workshop ticketing india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-platform-for-workshops" },
  openGraph: {
    title: "Event Ticketing Platform for Workshops & Masterclasses | URPASS",
    description:
      "Sell workshop tickets with strict seat limits, screening workflows, 0% commission, and instant digital QR passes.",
    url: "https://urpass.space/event-ticketing-platform-for-workshops",
    locale: "en_IN",
    type: "website",
  },
};

export default function WorkshopTicketingPlatformPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-platform-for-workshops",
        badge: "HANDS-ON MASTERCLASSES & WORKSHOPS",
        h1: "Event Ticketing Platform for Workshops & Training Masterclasses",
        description:
          "Enforce strict seating capacity limits, screen applicants with technical prerequisite questions, collect ticket fees via UPI with 0% commission, and check in participants seamlessly via mobile QR passes.",
        ctaLabel: "Start workshop ticketing",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is an Event Ticketing Platform for Workshops?",
          summary:
            "An event ticketing platform for workshops is an online registration and ticketing system designed for limited-seat, interactive sessions such as technical masterclasses, design bootcamps, and executive coaching seminars. URPASS solves workshop operational challenges through atomic capacity reservation locks that prevent overbooking, customized prerequisite screening forms, 0% commission UPI ticket sales via Razorpay, and instant digital QR passes that instructors or assistants scan at the door in <0.3s.",
          keyPoints: [
            "Atomic capacity reservation: 10-minute hold window prevents workstation overbooking",
            "Screening questions: evaluate attendee experience, prerequisites, or laptop OS",
            "0% commission on ticket fees with instant UPI checkout (PhonePe, GPay, Paytm)",
            "Instant pass delivery via WhatsApp and email with sub-second door check-in",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Workshop Ticketing & Seating Capacity Specifications",
          subtitle: "How URPASS prevents seat overbooking and simplifies attendee screening for interactive workshops.",
          headers: ["Workshop Requirement", "URPASS Workshop Platform", "Generic Forms / Ticketing Tools"],
          rows: [
            {
              col1: "Strict Capacity Enforcement",
              col2: "Atomic DB locks with 10-minute temporary seat reservation hold",
              col3: "Optimistic concurrency leading to seat overbooking",
            },
            {
              col1: "Applicant Screening Questions",
              col2: "Custom forms collecting GitHub links, design portfolios, or skill levels",
              col3: "Limited form fields or disconnected third-party survey tools",
            },
            {
              col1: "Payment & Commission",
              col2: "0% Commission (Direct Razorpay merchant bank settlement)",
              col3: "5% to 8% platform deduction on high-ticket masterclasses",
            },
            {
              col1: "Approval Workflow",
              col2: "Review applicants first, then send 1-click payment invitations",
              col3: "Open to anyone or complex manual email correspondence",
            },
            {
              col1: "Pass Delivery",
              col2: "Digital QR pass delivered via mobile web link and WhatsApp",
              col3: "Plain text email receipts easily misplaced by attendees",
            },
            {
              col1: "Door Check-In Hardware",
              col2: "Any smartphone browser (no app download or account login)",
              col3: "Manual paper printouts with high check-in delays",
            },
            {
              col1: "Automated GST Receipts",
              col2: "Compliant B2B tax invoices with SAC codes for corporate reimbursements",
              col3: "Manual invoice creation required for each participant",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Clock,
            title: "Atomic Capacity Locks",
            desc: "Prevent overbooking workshop workstations. When an attendee starts checkout, their seat is reserved for 10 minutes atomically.",
          },
          {
            icon: Sliders,
            title: "Prerequisite Screening",
            desc: "Ask attendees about their background, coding language familiarity, laptop operating system, or portfolio links before admitting them.",
          },
          {
            icon: CreditCard,
            title: "0% Commission UPI Ticketing",
            desc: "Accept payments via PhonePe, Google Pay, Paytm, and cards with 0% platform deductions. Funds deposit directly into your bank (T+2).",
          },
          {
            icon: QrCode,
            title: "Digital Workstation Passes",
            desc: "Each registered participant receives a unique digital QR pass with their assigned seat tier, workstation requirements, and venue timing.",
          },
          {
            icon: ScanLine,
            title: "Fast Classroom Check-In",
            desc: "Instructors or teaching assistants scan attendee passes using their personal phone browsers in under 0.3 seconds with audio confirmation.",
          },
          {
            icon: FileCheck,
            title: "Corporate Reimbursement Invoices",
            desc: "Capture corporate attendee GSTIN numbers and automatically issue compliant tax invoices so attendees can claim employer reimbursements.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Engineered for Limited-Seat Hands-On Sessions",
          description:
            "Whether you are running a 30-seat Python lab or a 100-person leadership seminar, URPASS ensures zero overbooking and flawless door entry.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Built for Indian Workshop Hosts & Tech Educators",
          subtitle: "Fast UPI mobile checkout, WhatsApp pass distribution, and transparent INR subscription pricing.",
          items: [
            {
              title: "Sub-5-Second UPI Checkout",
              description:
                "Participants pay directly through PhonePe, Google Pay, or Paytm, minimizing drop-offs during registration.",
              badge: "UPI 2.0",
            },
            {
              title: "Employer Tax Invoices",
              description:
                "Provide compliant GST tax invoices for working professionals claiming corporate learning & development budgets.",
              badge: "GSTIN",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Deliver mobile QR passes directly via WhatsApp in India, ensuring attendees have quick access when walking into class.",
              badge: "WhatsApp",
            },
            {
              title: "T+2 Direct Bank Payouts",
              description:
                "Keep cash flow steady to pay workshop venue booking deposits and lab equipment rentals ahead of time.",
              badge: "Cashflow",
            },
            {
              title: "Early Bird & Tier Quotas",
              description:
                "Set strict capacity caps for Early Bird (e.g., first 10 seats) and General tiers that sell out automatically.",
              badge: "Quotas",
            },
            {
              title: "₹0 Free Community Tier",
              description:
                "Host free community workshops up to 100 registrations per month at ₹0 forever with full QR passes included.",
              badge: "Free Tier",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "SEATING PRECISION",
            title: "Why Overbooking is Lethal for Interactive Workshops",
            paragraphs: [
              "Unlike large keynote conferences where an extra 10 people can simply sit in the back row, interactive workshops operate under rigid physical constraints. If a computer lab has 25 workstations, selling 27 tickets creates an embarrassing operational disaster where two paying attendees have nowhere to sit or plug in their laptops.",
              "Traditional registration forms allow simultaneous submissions during peak traffic surges, resulting in multiple participants completing checkout at the same instant. URPASS utilizes database-level atomic reservation locks. The second an attendee begins payment, a 10-minute lock holds that exact seat. If the attendee finishes payment, the seat is confirmed; if they close the tab, the seat releases back into inventory instantly.",
            ],
            bullets: [
              "Atomic database row locks eliminate seat race conditions completely",
              "10-minute hold window gives applicants time to enter UPI pins without losing their slot",
              "Automatic 'Sold Out' status prevents any further checkout attempts",
              "Optional automated waitlist alerts next-in-line participants upon cancellations",
            ],
            takeaway:
              "Strict capacity controls protect instructor credibility, ensure an optimal student-to-mentor ratio, and avoid venue overcrowding.",
          },
          {
            badge: "COMMISSION DISRUPTION",
            title: "Why Educators Keep 100% of Their Masterclass Earnings",
            paragraphs: [
              "Independent workshop creators and bootcamps often charge premium prices—ranging from ₹1,500 to ₹15,000 per seat. When using commission-based ticketing websites that deduct 6% to 8% plus buyer fees, an instructor teaching a 40-seat masterclass at ₹5,000 per seat loses ₹12,000 to ₹16,000 to the ticketing platform.",
              "URPASS operates on a software subscription model starting at ₹499/mo. Organizers link their own Razorpay gateway, collect fees directly via UPI and cards, and pay 0% platform commission on ticket volume. You retain 100% of your earnings minus standard payment gateway fees (~2%), saving substantial revenue on every cohort.",
            ],
            bullets: [
              "0% ticketing commission across all workshops and bootcamps",
              "Attendees pay exact face value with zero added convenience fees",
              "Automated GST invoice generation saves hours of manual accounting",
              "Direct merchant bank settlements ensure healthy cash flow for instructors",
            ],
            takeaway:
              "Flat-fee software pricing ensures that educators and workshop trainers keep the maximum possible return on their intellectual property and teaching efforts.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Legacy Workshop Registration Tools",
          subtitle: "Compare seat capacity locks, screening workflows, commission fees, and door check-in.",
          competitorName: "Generic Event Tools (Eventbrite / Google Forms)",
          sourceCitations: [
            "Official competitor commercial schedules",
            "URPASS benchmark metrics & capacity reservation specifications",
          ],
          rows: [
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Fixed monthly software fee)",
              competitor: "4.5% to 8% commission per seat sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Capacity Reservation Hold",
              urpass: "Atomic 10-minute lock prevents overbooking",
              competitor: "No locks; easily overbooks limited lab seats",
              urpassAdvantage: true,
            },
            {
              criteria: "Screening & Approval Flow",
              urpass: "Screen candidates first, then issue 1-click payment links",
              competitor: "All-or-nothing open booking without screening",
              urpassAdvantage: true,
            },
            {
              criteria: "Door QR Check-In Speed",
              urpass: "< 0.3s camera scan on instructor or TA smartphone",
              competitor: "Manual paper list checking with a pen",
              urpassAdvantage: true,
            },
            {
              criteria: "B2B GST Tax Invoicing",
              urpass: "Automated GSTIN capture and compliant PDF tax receipts",
              competitor: "Manual invoice creation required for reimbursements",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Forever Tier",
              urpass: "2 events/mo, up to 100 registrations/mo completely free",
              competitor: "Strict attendee limits or paid software required",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "Hands-On Coding & AI Bootcamps",
          "UI/UX Design Masterclasses & Portfolio Reviews",
          "Executive Leadership & Management Seminars",
          "Financial Modeling & Investing Bootcamps",
          "Photography & Filmmaking Hands-On Workshops",
          "Culinary & Artisanal Craft Workshops",
          "Robotics & IoT Hardware Masterclasses",
          "Corporate Team Upskilling Workshops",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software India",
            href: "/event-ticketing-software-india",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "QR Ticket Scanner (Phone App)",
            href: "/qr-ticket-scanner",
            category: "Product",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Free Event Registration",
            href: "/free-event-registration",
            category: "Product",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: Prevent Duplicate Event Entry",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "How does URPASS prevent overbooking for limited-seat workshops?",
            a: "URPASS utilizes database-level atomic capacity locks. When a participant begins checkout or registration, their seat is reserved for 10 minutes. If the participant completes payment, the seat is permanently locked; if they abandon the session, the seat automatically becomes available again, guaranteeing zero overbooking.",
          },
          {
            q: "Can I screen participants before approving their ticket purchase?",
            a: "Yes. You can enable 'Require Approval' in your event settings. Attendees submit their application answers (e.g., experience level, portfolio link, laptop specifications). You can review responses and approve qualified candidates with one click, which sends them an invitation link to complete payment.",
          },
          {
            q: "Do I have to pay per-ticket commissions on expensive workshop tickets?",
            a: "No! URPASS charges zero commission on ticket volume. You pay only our flat monthly subscription (starting at ₹499/mo) and standard payment gateway fees from Razorpay (~2%). You keep 100% of your course fees.",
          },
          {
            q: "Can participants claim corporate reimbursement with a GST invoice?",
            a: "Yes. Participants can input their employer's company name and GSTIN during checkout. URPASS generates a compliant B2B tax invoice featuring your SAC code and tax breakdown, allowing working professionals to easily claim learning & development reimbursements.",
          },
          {
            q: "How do instructors scan passes at the workshop door?",
            a: "Instructors or teaching assistants simply open a secure PIN scanner link in Safari or Chrome on their smartphones. Scanning an attendee's QR pass takes under 0.3 seconds with distinct confirmation audio and vibration cues.",
          },
          {
            q: "Is there a free tier for free community workshops?",
            a: "Yes. URPASS offers a Free tier supporting up to 2 events per month with up to 100 registrations per month at ₹0 forever, with no credit card required.",
          },
        ],

        ctaTitle: "Host your workshop with URPASS today",
        ctaDescription:
          "Zero commission · Atomic seat locks · Sub-second phone check-in · Built for educators",
      }}
    />
  );
}
