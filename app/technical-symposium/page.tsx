import type { Metadata } from "next";
import { CheckCircle2, Monitor, Trophy, ClipboardList, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Technical Symposium Registration Software with QR Gate Pass",
  description: "Run your technical symposium without spreadsheets, printed attendee lists or manual entry verification. URPASS lets colleges collect registrations, issue digital QR passes and check students in using any phone.",
  keywords: [
    "technical symposium registration software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/technical-symposium" },
  openGraph: {
    title: "Technical Symposium Registration Software with QR Gate Pass | URPASS",
    description: "Run your technical symposium without spreadsheets, printed attendee lists or manual entry verification. URPASS lets colleges collect registrations, issue digital QR passes and check students in using any phone.",
    url: "https://urpass.space/technical-symposium",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TECHNICAL SYMPOSIUMS",
        h1: "Technical Symposium Registration & Paper Presentation Software",
        canonicalUrl: "https://urpass.space/technical-symposium",
        description: "Run your technical symposium without spreadsheets, printed attendee lists or manual entry verification. URPASS lets colleges collect registrations, issue digital QR passes and check students in using any phone.",
        ctaLabel: "Manage symposium free",
        features: [
          { icon: Monitor, title: "Paper Presentation Signups", desc: "Collect research paper titles, abstract uploads, author names, and college affiliations on your custom form." },
          { icon: Trophy, title: "Contest Track Quotas", desc: "Set capacity caps for Coding, Web Design, Robotics, Paper Presentation, and Non-Technical events." },
          { icon: ClipboardList, title: "Automated QR Passes", desc: "Approved student delegates receive digital QR passes on their phones immediately upon acceptance." },
          { icon: ScanLine, title: "Multi-Lab Check-In", desc: "Deploy volunteer scanners at main campus gates, auditoriums, and individual computer labs simultaneously." },
          { icon: Users, title: "Live Headcount Monitoring", desc: "Watch live attendance tallies by college and department on your organizer command center." },
          { icon: BarChart3, title: "Certificate-Ready CSV Export", desc: "Download verified attendance lists with student names, college details, and timestamps for certificates." },
        ],
        steps: [
          { n: "01", title: "Create Symposium", desc: "Set symposium title, department, contest tracks, and lab capacities." },
          { n: "02", title: "Collect Abstract Signups", desc: "Participants submit student roll numbers, college names, and papers." },
          { n: "03", title: "Approve Registrants", desc: "Accept qualified participants to trigger automated QR pass issuance." },
          { n: "04", title: "Scan at Campus Doors", desc: "Student volunteers scan passes in under 0.3s at the entrance gate." },
          { n: "05", title: "Issue Certificates", desc: "Export verified attendee records to populate digital certificates." },
        ],
        callout: {
          badge: "DEPARTMENT PRECISION",
          title: "Run your technical symposium with zero paper confusion.",
          description: "Managing paper presentation tracks, workshops, and coding rounds across different campus labs requires seamless door coordination. URPASS brings registration and gate scanning into one system.",
          bullets: [
            "Custom forms collecting paper titles and college credentials",
            "Instant duplicate entry lockout across all symposium tracks",
            "Volunteer phone scanners deployed in seconds via browser links",
            "Exportable verified attendee lists for participation certificates",
          ],
        },
        useCases: [
          "National Level Technical Symposiums",
          "IEEE Student Branch Conferences",
          "Computer Science Codefests",
          "Mechanical & Civil Design Expos",
          "Electronics Circuit Challenges",
          "Paper Presentation Contests",
        ],
        faqs: [
          { q: "Can we collect registrations from external colleges across the state?", a: "Yes. The registration link is public and shareable, allowing students from any university to register easily." },
          { q: "Can we track attendance at both the main gate and individual presentation halls?", a: "Yes. You can use separate scanning phones at the main gate and outside individual lab rooms." },
          { q: "Can we collect registration fees via UPI?", a: "Yes. Native Razorpay integration allows you to accept registration fees via UPI (GPay, PhonePe, Paytm) and cards." },
          { q: "Is URPASS free for department technical symposiums?", a: "Yes. Symposiums with up to 100 participants can use our permanent free plan at ₹0 forever." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
