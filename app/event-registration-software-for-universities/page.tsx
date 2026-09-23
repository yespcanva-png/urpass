import type { Metadata } from "next";
import { GraduationCap, ShieldCheck, QrCode, Users, Layers, ArrowRight, CheckCircle2, Building, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Event Registration & QR Check-In | URPASS",
  description: "University event registration software for college fests, academic symposiums, hackathons, and campus guest check-in. Fast mobile QR scanning and UPI ticketing.",
  keywords: [
    "university event registration software",
    "college fest registration software",
    "campus event ticketing system",
    "university QR check in software",
    "college symposium registration",
    "student fest pass generator",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-for-universities" },
  openGraph: {
    title: "University Event Registration & QR Check-In | URPASS",
    description: "University event registration software for college fests, academic symposiums, and campus guest check-in.",
    url: "https://urpass.space/event-registration-software-for-universities",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "HIGHER EDUCATION & CAMPUS",
        h1: "Event Registration Software for Universities",
        canonicalUrl: "https://urpass.space/event-registration-software-for-universities",
        description:
          "University event registration software simplifies campus festivals, technical symposiums, hackathons, alumni reunions, and guest speaker security. URPASS provides automated student credential validation, zero-commission UPI ticketing, and sub-0.3s mobile QR scanning that keeps campus gates orderly and prevents unauthorized outside entry.",
        ctaLabel: "Start Campus Registration",
        features: [
          { icon: GraduationCap, title: "Student ID & Roll Number Validation", desc: "Collect and verify student registration numbers, departmental branches, college ID cards, and university email domains." },
          { icon: QrCode, title: "Sub-Second Gate Crowd Control", desc: "Admit 1,000+ students per hour across campus security gates with zero line stalling or paper sign-in logjams." },
          { icon: ShieldCheck, title: "Campus Security & Anti-Fraud", desc: "Tamper-proof dynamic QR codes prevent screenshot forwarding, keeping unauthorized non-students out of college premises." },
          { icon: Smartphone, title: "Native UPI Ticketing for Students", desc: "Allow students to pay nominal delegate fees seamlessly using Google Pay, PhonePe, and Paytm with automated receipts." },
          { icon: Layers, title: "Multi-Club Department Workspaces", desc: "Empower individual student clubs (Coding Club, Cultural Committee, Sports Council) to run events under one university account." },
          { icon: Users, title: "Hackathon Application Vetting", desc: "Review student project abstracts, GitHub repositories, and team members before issuing confirmed entrance passes." },
        ],
        steps: [
          { n: "01", title: "Set Up Fest or Symposium", desc: "Create your college event with student, external delegate, and faculty ticket tiers." },
          { n: "02", title: "Share Across Campus", desc: "Distribute your fast registration URL via WhatsApp groups, college portals, and Instagram." },
          { n: "03", title: "Automated Pass Dispatch", desc: "Students instantly receive their digital passes with college branding and personalized QR codes." },
          { n: "04", title: "Scan at Campus Gates", desc: "Student volunteers and campus security scan passes on their phones in under 0.3 seconds." },
          { n: "05", title: "Deliver Dean/HOD Reports", desc: "Export complete attendance rosters and department participation records for institutional records." },
        ],
        callout: {
          badge: "CAMPUS GATE SAFETY",
          title: "Stop gate crashes and chaotic registration desks.",
          description: "College fests that rely on physical paper passes or unverified Google Forms suffer from fake printed passes, forwarded screenshots, and chaotic entrance gates. URPASS gives university faculty and student heads absolute security and crowd control.",
          bullets: [
            "Encrypted QR tokens ensure passes cannot be duplicated or shared via WhatsApp",
            "Scanner displays student photo or college ID for visual verification at the gate",
            "Real-time attendance numbers prove fest scale to deans, principals, and sponsors",
            "Free Tier forever allows student clubs to run smaller workshops at zero cost",
          ],
        },
        deepDiveSections: [
          {
            badge: "CAMPUS SECURITY",
            title: "How does URPASS prevent unauthorized entry at college festivals?",
            paragraphs: [
              "During high-profile college cultural fests (with celebrity concerts or inter-college competitions), crowd control is the administration's primary safety concern. Static PDF tickets or printed wristbands are routinely traded or forged.",
              "URPASS generates dynamic cryptographic QR passes tied to verified student email addresses. When scanned, the system validates the token in under 300ms and registers the check-in. If a screenshot is presented at another gate, the screen immediately flashes red, identifying the duplicate attempt.",
            ],
            takeaway: "Cryptographic single-use passes maintain total campus gate integrity during high-attendance fests.",
          },
          {
            badge: "STUDENT CONVENIENCE",
            title: "Why do students prefer URPASS over legacy university registration portals?",
            paragraphs: [
              "Clunky university ERPs and outdated forms force students to navigate non-responsive desktop interfaces, creating high abandonment rates. URPASS delivers a sleek, modern mobile interface that loads in milliseconds, supports 1-tap UPI payment, and saves passes directly to Apple and Google Wallet.",
            ],
            takeaway: "Frictionless mobile experiences increase student participation and inter-college delegate attendance.",
          },
        ],
        faqs: [
          {
            q: "Can student clubs run events for free on URPASS?",
            a: "Yes. URPASS offers a Free Tier with 100 registrations per month and 2 events per month with full QR scanning at ₹0.",
          },
          {
            q: "Can we restrict registration to only students from our college domain?",
            a: "Yes. You can enforce email domain restrictions (e.g. '@college.edu.in') to block outside registrations.",
          },
          {
            q: "Can student coordinators scan tickets without accessing admin financial data?",
            a: "Yes. Organizers can provide student volunteers with temporary scanner-only links that do not reveal attendee contact details or ticket revenue.",
          },
        ],
        relatedLinks: [
          { title: "College Events & Fests", href: "/college-events", category: "Use Case" },
          { title: "Hackathon Registration & Entry", href: "/hackathons", category: "Use Case" },
          { title: "Technical Symposium Check-In", href: "/technical-symposium", category: "Use Case" },
          { title: "UPI Event Ticketing", href: "/upi-event-ticketing", category: "Product" },
        ],
      }}
    />
  );
}
