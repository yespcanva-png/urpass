import type { Metadata } from "next";
import {
  Sparkles,
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
  title: "College Fest Management Software with QR Check-In | URPASS",
  description:
    "Manage college fests, technical symposiums, and cultural festivals with URPASS. Multi-track registrations, digital QR passes, and sub-second gate check-in.",
  keywords: [
    "college fest management software",
    "cultural fest registration software",
    "college fest ticketing system",
    "tech fest management software",
    "campus festival qr pass system",
    "college fest entry management",
  ],
  alternates: {
    canonical: "https://urpass.space/college-fest-management-software",
  },
  openGraph: {
    title: "College Fest Management Software with QR Check-In | URPASS",
    description:
      "All-in-one software for college fests, cultural festivals, and technical symposiums. Fast registrations, secure QR passes, and 0.28s gate entry.",
    url: "https://urpass.space/college-fest-management-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function CollegeFestManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/college-fest-management-software",
        badge: "CAMPUS FESTIVALS",
        h1: "College Fest Management Software With QR Check-In",
        description:
          "The modern command center for college fests, cultural nights, and tech symposiums. Run multi-event registrations, deliver branded digital QR passes, and check in thousands of students smoothly across campus gates.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How URPASS Powers College Fest Operations",
          summary:
            "College fests involve thousands of attendees entering campus gates simultaneously. Paper lists and generic forms collapse under this pressure, leading to security breaches and gate delays. URPASS provides student coordinators with high-speed registration forms, automated digital QR passes, and in-browser camera scanning operating in under 0.28 seconds with multi-gate synchronization.",
          keyPoints: [
            "Gate Security: Prevents fake entry passes and gate-crashing using cryptographic QR validation",
            "Multi-Event Registration: Handle multiple competitions, workshops, and pro-nights on one platform",
            "Volunteer Scanner: Volunteers scan badges directly in mobile browsers with zero app installation",
            "Permanent Free Tier: ₹0 forever for student organizers with up to 50 attendees per event",
          ],
        },
        productProof: {
          badge: "HIGH CAPACITY GATE ENTRY",
          title: "Zero Delay Entry Scanning",
          description:
            "Deploy student volunteers across multiple campus gates with synchronized scanning in Chrome and Safari.",
          type: "scanner",
        },
        features: [
          {
            icon: Sparkles,
            title: "Multi-Event Fest Architecture",
            desc: "Host technical competitions, dance battles, hackathons, and cultural pro-nights under one clean fest portal.",
          },
          {
            icon: QrCode,
            title: "Encrypted QR Fest Passes",
            desc: "Deliver personalized passes with student credentials, allowed access zones, and Apple/Google Wallet support.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanning",
            desc: "Check in over 1,000 students per hour per gate with instantaneous 0.28s barcode validation.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Gatecrashing Protection",
            desc: "Prevent unauthorized entry and pass sharing with instant cloud verification and duplicate lockout.",
          },
          {
            icon: Zap,
            title: "Instant UPI Fee Collection",
            desc: "Collect registration fees for competitive events via PhonePe, Google Pay, and UPI with direct bank deposits.",
          },
          {
            icon: BarChart3,
            title: "Live Headcount Dashboard",
            desc: "Monitor campus gate flow, peak arrival hours, and total attendee counts in real-time.",
          },
        ],
        steps: [
          { n: "01", title: "Create Fest", desc: "Build registration pages with custom student questions in 2 minutes." },
          { n: "02", title: "Promote Across Campuses", desc: "Share registration links across student WhatsApp and social channels." },
          { n: "03", title: "Issue Digital Passes", desc: "Registered participants get verified QR badges on their phones." },
          { n: "04", title: "Scan at Campus Gates", desc: "Student volunteers scan passes at entry doors with zero lines." },
        ],
        callout: {
          badge: "BUILT FOR STUDENTS",
          title: "Empower your student committee with professional tools",
          description:
            "Save hundreds of hours of manual roster checking and coordinate your entire fest entry team seamlessly.",
          bullets: [
            "Permanent free tier available for student-led initiatives",
            "Works on any mobile device without installing third-party apps",
            "Multi-gate synchronization across all campus entrance doors",
            "Complete exportable attendance reports for faculty review",
          ],
        },
        useCases: [
          "Annual cultural fests & inter-college pro-nights",
          "National technical symposiums & project expos",
          "Inter-collegiate hackathons & coding leagues",
          "Literary, debate & fine-arts championships",
          "Collegiate sports meets & esports tournaments",
        ],
        faqs: [
          {
            q: "Can we manage a multi-event college fest on URPASS?",
            a: "Yes! You can set up individual registration tiers for distinct competitions, workshops, and general admission under your central fest dashboard.",
          },
          {
            q: "How does URPASS handle spot registrations at the fest gates?",
            a: "Attendees can simply scan a public QR code at the registration desk, fill out the mobile form on their phone in 30 seconds, and immediately receive their scannable pass.",
          },
          {
            q: "Can volunteers scan passes using their personal phones?",
            a: "Yes. Coordinators share a secure scanner link. Volunteers open it in Safari or Chrome, grant camera access, and scan badges in under 0.28 seconds with zero app downloads.",
          },
          {
            q: "Is URPASS free for student fest organizers?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full QR pass issuance and unlimited scanning.",
          },
        ],
        ctaTitle: "Elevate your college fest experience",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
