import type { Metadata } from "next";
import {
  GraduationCap,
  Users,
  QrCode,
  ScanLine,
  ShieldCheck,
  CreditCard,
  Ticket,
  Clock,
  Sparkles,
  Smartphone,
  Layers,
  BarChart3,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Platform for College Events & Fests — URPASS",
  description:
    "The preferred event ticketing platform for college fests, symposiums, and hackathons. Verify student roll numbers, deploy multi-gate phone scanners, accept UPI, and issue branded digital QR passes.",
  keywords: [
    "event ticketing platform for college events",
    "college fest ticketing software",
    "college symposium registration",
    "campus event ticketing system",
    "student event pass generator",
    "inter college fest registration",
    "college event qr code check in",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-platform-for-college-events" },
  openGraph: {
    title: "Event Ticketing Platform for College Events & Fests | URPASS",
    description:
      "Manage college symposiums, hackathons, and cultural fests. Student ID verification, multi-gate smartphone check-in, instant UPI, and digital QR passes.",
    url: "https://urpass.space/event-ticketing-platform-for-college-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function CollegeEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-platform-for-college-events",
        badge: "CAMPUS & FEST OPERATIONS",
        h1: "Event Ticketing Platform for College Events & Cultural Fests",
        description:
          "Streamline inter-college fest registrations, verify student IDs and department credentials, accept instant UPI payments, and validate thousands of students at campus gates in under 0.3 seconds on volunteer phones.",
        ctaLabel: "Set up college event free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is an Event Ticketing Platform for College Events?",
          summary:
            "An event ticketing platform for college events is a specialized registration and access management system built to handle high-volume campus gatherings like cultural fests, technical symposiums, and inter-college hackathons. URPASS simplifies campus event coordination by capturing student roll numbers, institution names, and department IDs, processing UPI ticket payments with zero commission, and enabling student volunteers to scan digital QR passes at campus gates in <0.3s without dedicated hardware.",
          keyPoints: [
            "Capture student roll numbers, college names, and ID proofs during registration",
            "Multi-gate campus deployment: coordinate Main Gate, North Gate, and Auditorium entry",
            "0% commission on fest tickets with instant UPI payment through Razorpay",
            "Hardware-free gate scanning: student volunteers use their own phone browsers",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "College Event Logistics & Gate Performance",
          subtitle: "Why URPASS is engineered to withstand high-volume college fest entry surges.",
          headers: ["Operational Requirement", "URPASS College Platform", "Google Forms + Paper Lists"],
          rows: [
            {
              col1: "Student ID & Roll No Verification",
              col2: "Mandatory custom fields with automated duplicate check",
              col3: "Manual spreadsheet review; rampant typo duplication",
            },
            {
              col1: "Gate Check-In Throughput",
              col2: "< 0.3s per student using phone camera browser scanner",
              col3: "15 to 45s per student manual name lookup on paper",
            },
            {
              col1: "Anti-Passback (Screenshot Sharing)",
              col2: "Atomic DB locks prevent duplicate pass entry across all gates",
              col3: "Zero prevention; passes shared across WhatsApp groups",
            },
            {
              col1: "Volunteer Staff Onboarding",
              col2: "30-second setup via secure PIN link; no app installs",
              col3: "Complex printed lists, clipboards, and high volunteer error",
            },
            {
              col1: "Inter-College Registration Fees",
              col2: "Native UPI QR & PhonePe/GPay checkout with 0% platform fee",
              col3: "Manual GPay screenshot verification via Google Forms",
            },
            {
              col1: "Pass Design & Branding",
              col2: "Ticket Studio (12 college fest templates, college logo, student tokens)",
              col3: "Generic plain text emails or third-party add-ons",
            },
            {
              col1: "Free Plan for College Clubs",
              col2: "₹0 forever for up to 2 events/mo & 100 registrations/mo",
              col3: "Paid software mandatory or unreliable ad-supported tools",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: GraduationCap,
            title: "Student Credential Verification",
            desc: "Collect college name, department, year of study, student roll number, and ID card photo verification seamlessly.",
          },
          {
            icon: QrCode,
            title: "Branded Digital QR Passes",
            desc: "Design vibrant fest passes in Ticket Studio. Include event logos, fest mascots, attendee names, and event schedules.",
          },
          {
            icon: ScanLine,
            title: "Multi-Gate Volunteer Scanning",
            desc: "Station volunteers across Main Gate, Sports Complex, and Auditorium. Staff scan directly in mobile Safari or Chrome.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate Security",
            desc: "Stops students from sharing ticket screenshots over WhatsApp. Repeated scans sound an error buzz and show original scan time.",
          },
          {
            icon: CreditCard,
            title: "0% Commission UPI Checkout",
            desc: "Collect workshop and fest registration fees via UPI (PhonePe, GPay, Paytm) directly into the college or club account.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Fest Analytics",
            desc: "Monitor crowd flow, department turnout, peak arrival hours, and gate velocities in real time from the student lead dashboard.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Engineered for 5,000+ Student Fest Surges",
          description:
            "From technical symposiums in Chennai and Coimbatore to mega-cultural fests in Pune and Bengaluru, URPASS keeps lines moving smoothly.",
          type: "scanner",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Built for Indian Universities & Engineering Colleges",
          subtitle: "Tailored to solve the common pain points faced by student coordinators and faculty advisors.",
          items: [
            {
              title: "End the GPay Screenshot Chaos",
              description:
                "Replace the dreaded 'upload transaction screenshot to Google Drive' method with automated, instant Razorpay UPI verification.",
              badge: "Automation",
            },
            {
              title: "Multi-Gate Campus Coordination",
              description:
                "Deploy 15+ student volunteers simultaneously across all college entry points with synchronized anti-duplicate protection.",
              badge: "Multi-Gate",
            },
            {
              title: "Offline Network Resilience",
              description:
                "Auditorium basements and campus grounds often suffer from overloaded cell towers. Offline mode ensures scanning never stalls.",
              badge: "Offline Ready",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Deliver digital QR passes directly to students' WhatsApp accounts, where they check messages most frequently.",
              badge: "WhatsApp",
            },
            {
              title: "Department Quotas & Tiers",
              description:
                "Set specific attendee quotas for CSE, Mech, EEE, and MBA departments or reserve slots for external college contingents.",
              badge: "Quotas",
            },
            {
              title: "Free Plan for Student Clubs",
              description:
                "IEEE, ACM, Rotaract, and student cultural clubs can host events up to 100 students completely free forever.",
              badge: "₹0 Free Tier",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "CAMPUS OPERATIONS",
            title: "How to Stop Gate Bottlenecks at College Cultural Fests",
            paragraphs: [
              "Every college fest organizer knows the nightmare of morning check-in: 3,000 students from 40 different colleges arrive between 9:00 AM and 10:00 AM. If student volunteers rely on printed alphabetical spreadsheets, finding each student's name, checking their ID card, and manually crossing off their roll number takes 30 to 45 seconds per person.",
              "This sluggish pace creates massive crowd bottlenecks at the campus gates, frustrating participants and creating security hazards. With URPASS, student volunteers open a PIN scanner URL on their own phones. When an attendee holds up their phone pass, the camera detects the QR code in under 0.3 seconds, sounds an audible green chime, and gives an 80ms haptic buzz. A gate staffed with 4 volunteers can process over 100 students per minute effortlessly.",
            ],
            bullets: [
              "Sub-second verification (<0.3s) slashes campus entrance wait times by 85%",
              "Hardware-free: volunteers use their personal iPhones or Android devices",
              "Audible confirmation tones overcome noisy campus entrance environments",
              "Real-time check-in stats let organizers redirect volunteers to congested gates",
            ],
            takeaway:
              "Deploying in-browser phone scanning eliminates chaotic campus queues and establishes a secure, professional standard for your college fest.",
          },
          {
            badge: "FINANCIAL RECONCILIATION",
            title: "Eliminating the Google Forms 'Payment Screenshot' Nightmare",
            paragraphs: [
              "Most student symposium organizers collect registration fees by asking participants to pay a student coordinator's personal UPI number and upload a transaction screenshot to Google Forms. Student treasurers then spend 20+ hours manually cross-referencing UPI Reference IDs against bank statements, often falling victim to photoshopped payment screenshots.",
              "URPASS automates payment reconciliation completely. When a participant registers for your fest or workshop, they pay via an integrated Razorpay checkout supporting PhonePe, Google Pay, and Paytm. The database confirms the payment via secure webhooks, automatically marks the registration as confirmed, and immediately issues a digital QR pass.",
            ],
            bullets: [
              "Zero manual payment cross-checking or fake screenshot verification",
              "Funds settle directly into your college or department bank account (T+2)",
              "0% platform commission on ticket volume keeps fest registration costs low",
              "Automated GST invoice generation for sponsored delegates and college billing",
            ],
            takeaway:
              "Automated payment reconciliation saves student coordinators days of tedious administrative work and protects fest accounts from fraudulent registrations.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Google Forms + Paper Lists for College Fests",
          subtitle: "Compare payment verification, gate speed, pass design, and anti-fraud security.",
          competitorName: "Google Forms + Paper Lists",
          sourceCitations: [
            "Campus event operational case studies",
            "URPASS benchmark metrics & scanner specifications",
          ],
          rows: [
            {
              criteria: "Payment Verification",
              urpass: "Automated webhook reconciliation via Razorpay UPI",
              competitor: "Manual inspection of uploaded GPay screenshots",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Check-In Speed",
              urpass: "< 0.3s camera scan on any volunteer phone",
              competitor: "25–45s per attendee manual paper lookup",
              urpassAdvantage: true,
            },
            {
              criteria: "Anti-Passback (Screenshot Fraud)",
              urpass: "Atomic database row-locks prevent pass sharing",
              competitor: "Zero security; screenshots can be used repeatedly",
              urpassAdvantage: true,
            },
            {
              criteria: "Pass Visual Design",
              urpass: "Ticket Studio with fest logos, badges, & dynamic tokens",
              competitor: "Plain text email or no pass at all",
              urpassAdvantage: true,
            },
            {
              criteria: "Multi-Gate Sync",
              urpass: "Real-time synchronization across all campus entrances",
              competitor: "Split paper sheets; cannot track cross-gate entry",
              urpassAdvantage: true,
            },
            {
              criteria: "Cost for College Clubs",
              urpass: "₹0 forever for 2 events/mo & 100 registrations/mo",
              competitor: "Free, but requires 30+ hours of manual labor",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "Annual College Cultural Fests (Cults)",
          "Department Technical Symposiums (Mech, CSE, EEE, etc.)",
          "24-Hour Inter-College Hackathons",
          "Robotics & Coding Competitions",
          "Inter-College Sports Tournaments",
          "Alumni Reunions & Campus Homecomings",
          "Entrepreneurship Summits & E-Cell Meets",
          "Department Farewell & Orientation Days",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software India",
            href: "/event-ticketing-software-india",
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
            title: "College Event Registration System",
            href: "/college-events",
            category: "Use Case",
          },
          {
            title: "Free Event Registration",
            href: "/free-event-registration",
            category: "Product",
          },
          {
            title: "Guide: College Fest Registration Form",
            href: "/guides/how-to-create-college-fest-registration-form",
            category: "Guide",
          },
          {
            title: "Guide: Check in 1,000 Attendees Quickly",
            href: "/guides/how-to-check-in-1000-attendees-quickly",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Can college clubs use URPASS for free?",
            a: "Yes! Student clubs (IEEE, CSI, Rotaract, cultural societies) can use the URPASS Free tier for up to 2 events per month with up to 100 registrations per month at ₹0 forever, with no credit card required. For larger fests, affordable monthly plans start at ₹499.",
          },
          {
            q: "How does URPASS stop students from sharing pass screenshots?",
            a: "When a student's QR pass is scanned at any campus gate, the system marks it as checked_in atomically in the database. If another student attempts to enter using a screenshot or forwarded image of the same pass, the scanner immediately triggers an amber warning, displays the original entry timestamp and gate name, and sounds a warning tone.",
          },
          {
            q: "Do student volunteers need to download an app on their phones?",
            a: "No. Student volunteers do not need to install anything from the App Store or Google Play. The organizer creates a secure PIN scanner link from the dashboard. Volunteers simply open this URL in Safari or Chrome to turn their smartphone into an instant optical QR scanner.",
          },
          {
            q: "Can we collect student roll numbers, college names, and ID photos?",
            a: "Yes. In the form builder, you can add required custom fields for College Name, Department, Year of Study, University Roll Number, and even file uploads for Student ID card verification.",
          },
          {
            q: "How are paid registrations handled for workshops and symposiums?",
            a: "You can connect your department or college Razorpay account. Participants pay via UPI (PhonePe, Google Pay, Paytm) or cards with 0% platform commission from URPASS. Funds settle directly into your linked bank account.",
          },
          {
            q: "Does the scanner work if campus Wi-Fi or cellular network drops?",
            a: "Yes. URPASS includes an offline scanner buffer. Volunteer phones cache registered attendee passes locally in IndexedDB. Passes continue to scan smoothly without internet, and sync back to the main database when connectivity resumes.",
          },
        ],

        ctaTitle: "Power your college fest with URPASS",
        ctaDescription:
          "Free tier for clubs · Sub-second phone check-in · UPI integration · Student ID verification",
      }}
    />
  );
}
