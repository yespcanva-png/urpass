import type { Metadata } from "next";
import {
  GraduationCap,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Event Registration Software with QR Check-In | URPASS",
  description:
    "Purpose-built college event registration software for campus fests, student clubs, hackathons, and symposiums. Verify student IDs and scan QR passes in 0.28s.",
  keywords: [
    "college event registration software",
    "college event management software",
    "college fest registration system",
    "campus event ticketing platform",
    "student event qr code check in",
    "college symposium registration",
  ],
  alternates: {
    canonical: "https://urpass.space/college-event-registration-software",
  },
  openGraph: {
    title: "College Event Registration Software with QR Check-In | URPASS",
    description:
      "Purpose-built event software for colleges and universities. Digital QR passes, student ID verification, and 0.28s gate scanning.",
    url: "https://urpass.space/college-event-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function CollegeEventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/college-event-registration-software",
        badge: "CAMPUS & HIGHER ED",
        h1: "College Event Registration Software With QR Check-In",
        description:
          "Run seamless registrations and entrance check-ins for college fests, technical symposiums, hackathons, and student club events. Collect student ID roll numbers, issue tamper-proof digital passes, and scan 500+ attendees per gate with zero lines.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "Why Colleges Need Dedicated Event Registration Software",
          summary:
            "Managing campus events using Google Forms and paper rosters results in massive gate congestion, gate-crashing, and unverified outside visitors entering campuses. URPASS solves this with automated student ID collection, cryptographically signed digital QR passes delivered straight to smartphones, and sub-0.28s in-browser camera scanning that alerts staff instantly if a student pass is reused or unapproved.",
          keyPoints: [
            "Campus Security: Cryptographic QR passes prevent gate-crashing and fake screenshot entry",
            "Student ID Verification: Collect roll numbers, college names, and ID card uploads automatically",
            "Volunteer Friendly: Student volunteers scan passes using any smartphone browser (<0.28s)",
            "Permanent Free Tier: ₹0 to start for student clubs with up to 50 attendees per event",
          ],
        },
        productProof: {
          badge: "CAMPUS GATE VERIFICATION",
          title: "Sub-Second Student Pass Scanning",
          description:
            "Student volunteers open the scanner link in Safari or Chrome. Validate student registrations with instant audio chimes and duplicate entry alerts.",
          type: "scanner",
        },
        features: [
          {
            icon: GraduationCap,
            title: "Student ID & Roll Number Capture",
            desc: "Collect college name, department, roll number, and student ID photos directly during registration.",
          },
          {
            icon: QrCode,
            title: "Digital QR Event Badges",
            desc: "Registrants receive personalized mobile badges with anti-fraud encryption and Apple/Google Wallet support.",
          },
          {
            icon: ScanLine,
            title: "0.28s Gate Check-In",
            desc: "Student volunteers scan passes on their personal phones with zero app store installations.",
          },
          {
            icon: ShieldCheck,
            title: "Campus Security & Anti-Fraud",
            desc: "Prevent forwarded screenshots and unauthorized campus entry with instant duplicate pass lockout.",
          },
          {
            icon: Zap,
            title: "UPI Ticket Payments",
            desc: "Collect inter-college fest registration fees seamlessly via Google Pay, PhonePe, and UPI with Razorpay.",
          },
          {
            icon: BarChart3,
            title: "Official Attendance Reports",
            desc: "Download verified attendee rosters with check-in timestamps for college management and certification.",
          },
        ],
        steps: [
          { n: "01", title: "Setup Fest", desc: "Define fest events, team size limits, and student ID requirements." },
          { n: "02", title: "Share on Campus", desc: "Circulate registration links via student WhatsApp groups and Instagram." },
          { n: "03", title: "Issue Passes", desc: "Approved participants receive digital QR credentials instantly." },
          { n: "04", title: "Scan at Campus Gates", desc: "Volunteers scan badges at campus entrances with zero delays." },
        ],
        callout: {
          badge: "COLLEGE READY",
          title: "Designed for student coordinators and faculty convenors",
          description:
            "Whether you are hosting a departmental seminar or a university-wide cultural fest with thousands of attendees, URPASS simplifies operations from registration to gate entry.",
          bullets: [
            "Permanent free plan available for student clubs and societies",
            "In-browser scanner runs on any Android or iPhone (<0.28s)",
            "Multi-gate synchronization across all campus entrance doors",
            "Export attendance records to Excel for certificate generation",
          ],
        },
        useCases: [
          "Annual cultural fests & technical symposiums",
          "Inter-college hackathons & coding competitions",
          "Departmental seminars, workshops & guest lectures",
          "Sports tournaments & collegiate athletic meets",
          "Alumni reunions & convocation ceremonies",
        ],
        faqs: [
          {
            q: "Can college clubs use URPASS for free?",
            a: "Yes! URPASS provides a permanent free plan with no credit card required, allowing student clubs to host up to 50 attendees per event with digital QR passes and unlimited scanning.",
          },
          {
            q: "How does URPASS prevent non-registered students from entering?",
            a: "Only students who register and receive a verified QR pass can check in. When volunteers scan the pass at campus gates, the scanner verifies the unique signature in 0.28 seconds and immediately rejects duplicate passes or forwarded screenshots.",
          },
          {
            q: "Can we collect registration fees via UPI for paid workshops?",
            a: "Yes. By connecting Razorpay, you can collect paid registrations in INR via Google Pay, PhonePe, Paytm, and cards directly into your club or college bank account.",
          },
          {
            q: "Can volunteers scan passes without downloading an app?",
            a: "Yes. Volunteers simply open a private scanner link in their mobile browser (Safari or Chrome), allowing camera access to scan badges in under 0.28 seconds.",
          },
        ],
        ctaTitle: "Streamline your college event registration",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
