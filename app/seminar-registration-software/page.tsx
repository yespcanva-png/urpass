import type { Metadata } from "next";
import {
  BookOpen,
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
  title: "Seminar Registration Software with QR Check-In | URPASS",
  description:
    "Professional seminar registration software for academic lectures, corporate training, and industry seminars. Digital QR passes and instant door check-in in 0.28s.",
  keywords: [
    "seminar registration software",
    "seminar booking system",
    "seminar attendance tracking",
    "academic seminar registration",
    "corporate seminar ticketing",
    "free seminar registration",
  ],
  alternates: {
    canonical: "https://urpass.space/seminar-registration-software",
  },
  openGraph: {
    title: "Seminar Registration Software with QR Check-In | URPASS",
    description:
      "Modern registration and attendance tracking software for academic and corporate seminars. Digital QR passes, fast door check-in, and 0% commission.",
    url: "https://urpass.space/seminar-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function SeminarRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/seminar-registration-software",
        badge: "SEMINARS & LECTURES",
        h1: "Seminar Registration Software With QR Check-In",
        description:
          "The professional registration and attendance verification platform for academic seminars, corporate training sessions, and guest lectures. Collect attendee credentials, issue digital QR passes, and check in guests in under 0.28 seconds.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "Why Seminars Need Dedicated Registration Software",
          summary:
            "Seminars require precise auditorium capacity management, professional credential collection, and reliable attendance records for continuing education credits and certifications. Paper sign-in sheets slow down session starts and produce inaccurate records. URPASS modernizes seminars with instant digital QR passes, mobile in-browser camera scanning, and exportable timestamped attendance logs.",
          keyPoints: [
            "Auditorium Seating Caps: Automatically prevent auditorium overbooking with real-time seat tracking",
            "Rapid Hall Entry: Scan passes in under 0.28 seconds to start lectures on schedule without door delays",
            "Accreditation Records: Export verified attendance rosters with check-in timestamps for certification",
            "Permanent Free Tier: ₹0 forever for academic and non-profit seminars with up to 50 attendees",
          ],
        },
        productProof: {
          badge: "AUDITORIUM CHECK-IN",
          title: "Sub-Second In-Browser Scanner",
          description:
            "Auditorium ushers scan delegate passes on any smartphone browser. Instant green checkmark with audio confirmation chime.",
          type: "scanner",
        },
        features: [
          {
            icon: BookOpen,
            title: "Auditorium Seating Limits",
            desc: "Set exact hall capacity limits with automated waitlisting and sold-out notifications when seats are filled.",
          },
          {
            icon: QrCode,
            title: "Encrypted QR Seminar Passes",
            desc: "Deliver personalized mobile badges with attendee name, organization, and Apple/Google Wallet integration.",
          },
          {
            icon: ScanLine,
            title: "0.28s Door Scanning",
            desc: "Ushers scan passes at auditorium doors using any smartphone camera with zero app installations.",
          },
          {
            icon: ShieldCheck,
            title: "Credential Anti-Fraud",
            desc: "Prevent unauthorized entry and duplicate pass sharing with instant cloud verification and duplicate lockout.",
          },
          {
            icon: Users,
            title: "Custom Attendee Credentials",
            desc: "Collect organization affiliation, professional license numbers, or student IDs during registration.",
          },
          {
            icon: BarChart3,
            title: "Certified Attendance Logs",
            desc: "Download verified attendee rosters with arrival timestamps for accreditation, compliance, and certificate issuance.",
          },
        ],
        steps: [
          { n: "01", title: "Set Up Seminar", desc: "Define lecture topic, speaker bio, hall capacity, and questions in 2 minutes." },
          { n: "02", title: "Circulate Link", desc: "Share registration URLs via departmental emails, newsletters, and social." },
          { n: "03", title: "Deliver Badges", desc: "Attendees receive digital QR passes instantly on mobile web or email." },
          { n: "04", title: "Check In at Door", desc: "Ushers scan attendee badges in under 0.28s to start sessions promptly." },
        ],
        callout: {
          badge: "ACADEMIC & CORPORATE",
          title: "Start lectures on time without registration bottlenecks",
          description:
            "From medical symposiums to corporate compliance seminars, URPASS ensures professional, frictionless attendance management.",
          bullets: [
            "Permanent free plan available for educational seminars",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Audible confirmation chime and haptic buzz upon validation",
            "One-click CSV exports with verified arrival timestamps",
          ],
        },
        useCases: [
          "University guest lectures & departmental seminars",
          "Continuing professional education (CPE / CME) seminars",
          "Corporate compliance & workplace training sessions",
          "Financial planning & investment seminars",
          "Industry research briefings & executive roundtables",
        ],
        faqs: [
          {
            q: "Can I use URPASS for a free academic seminar?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "How does URPASS help with issuing attendance certificates?",
            a: "URPASS records the exact second each attendee's QR badge is scanned at the auditorium door. Organizers can export this verified roster to CSV and issue certificates strictly to validated attendees.",
          },
          {
            q: "Do ushers need to install a special app to scan passes?",
            a: "No! Organizers share a secure scanner link. Ushers open it in Chrome or Safari on their personal smartphones and begin scanning passes in under 0.28 seconds.",
          },
          {
            q: "Can I collect participant affiliations and designations?",
            a: "Yes. You can customize the registration form to collect organization names, job titles, professional license numbers, or student roll numbers.",
          },
        ],
        ctaTitle: "Streamline your seminar registration today",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
