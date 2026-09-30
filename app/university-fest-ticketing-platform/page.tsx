import type { Metadata } from "next";
import { Users, Ticket, QrCode, ShieldCheck, Smartphone, Zap, BarChart3, Building2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Fest Ticketing Platform & Campus Passes | URPASS",
  description:
    "Complete event registration, digital passes, and QR check-in platform for university fests, college cultural events, and student unions. Instant UPI checkout and multi-gate scanning.",
  keywords: [
    "university fest ticketing platform",
    "college fest passes",
    "campus event registration",
    "student union ticketing software",
    "inter college fest passes",
    "college cultural fest check in",
  ],
  alternates: { canonical: "https://urpass.space/university-fest-ticketing-platform" },
  openGraph: {
    title: "University Fest Ticketing Platform & Campus Passes | URPASS",
    description: "Event registration, digital passes, and QR check-in platform for university fests and campus fests.",
    url: "https://urpass.space/university-fest-ticketing-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS & FEST INFRASTRUCTURE",
        h1: "University Fest Ticketing Platform & Campus Pass System",
        canonicalUrl: "https://urpass.space/university-fest-ticketing-platform",
        description:
          "Manage registrations, issue digital student passes, accept instant UPI payments, and coordinate multi-gate venue check-ins across college cultural fests and university summits.",
        ctaLabel: "Host University Fest Free",
        directAnswer: {
          title: "Why Choose URPASS for University & College Fests?",
          summary:
            "URPASS is purpose-built for campus events, student unions, and inter-college cultural fests. It allows organizers to capture roll numbers, verify student IDs, accept instant mobile UPI payments (GPay, PhonePe, Paytm), issue single-use digital QR passes, and deploy 10+ student volunteers at gates with standard smartphone cameras to check in attendees in under 0.3 seconds.",
          keyPoints: [
            "Capture college names, student roll numbers, and department branches with custom forms",
            "Instant UPI QR checkout with zero per-ticket commission fees keeping fest budgets intact",
            "Sub-0.3s gate check-in on volunteer phone cameras with loud audio chimes and haptics",
            "Atomic anti-duplicate protection prevents pass sharing between students at campus gates",
          ],
        },
        keyFactsTable: {
          title: "University Fest Operational Parameters",
          subtitle: "Specifications designed for high-density campus auditorium and ground events.",
          headers: ["Campus Requirement", "URPASS Specification", "Traditional Paper / Generic Forms"],
          rows: [
            { col1: "Student ID & Roll Number Capture", col2: "Custom required fields on registration form", col3: "Messy spreadsheets with typos & duplicates" },
            { col1: "Payment Method", col2: "Instant UPI QR (PhonePe, GPay, Paytm) in 5s", col3: "Cash collections or clunky bank transfers" },
            { col1: "Gate Verification Latency", col2: "< 0.3 seconds per student on volunteer phones", col3: "20–45s searching paper lists, causing riots" },
            { col1: "Simultaneous Entrance Lanes", col2: "Deploy 5 to 20 student volunteers across gates", col3: "Single bottleneck desk with alphabet folders" },
            { col1: "Anti-Pass Sharing Guard", col2: "Single-use cryptographic UUID tokens", col3: "Static PDF tickets forwarded across WhatsApp" },
          ],
        },
        features: [
          { icon: Users, title: "Custom Student Registration", desc: "Collect roll numbers, college names, department years, and emergency contacts with customized dynamic registration forms." },
          { icon: Ticket, title: "Branded Fest Digital Passes", desc: "Design high-energy passes featuring your fest emblem, sponsors, ticket category (Pro-night, Day pass, Workshop), and QR code." },
          { icon: QrCode, title: "Sub-0.3s Volunteer Gate Scanner", desc: "Student volunteers open a secure PIN link in Safari or Chrome to scan attendees instantaneously with loud audio chimes." },
          { icon: ShieldCheck, title: "Pass Sharing Prevention", desc: "Cryptographic locks block forwarded screenshots from being reused at separate campus entrance gates." },
          { icon: Smartphone, title: "0% Commission UPI Payments", desc: "Students pay directly via PhonePe, Google Pay, or Paytm with funds flowing directly into the student council or college account." },
          { icon: BarChart3, title: "Live Gate Headcount Velocity", desc: "Faculty coordinators and fest heads monitor live auditorium capacity and gate turnout from any laptop or phone." },
        ],
        steps: [
          { n: "01", title: "Create Fest Event", desc: "Set fest date, campus venue, pass tiers (Pro-night, Tech events, General admission), and forms." },
          { n: "02", title: "Launch Campus Link", desc: "Share registration link on college WhatsApp groups, Instagram bios, and campus posters." },
          { n: "03", title: "Instant Pass Generation", desc: "Students receive digital QR passes immediately upon UPI payment or registration approval." },
          { n: "04", title: "Deploy Volunteer Scanners", desc: "Give gate volunteers a 6-digit scanner PIN to turn their phones into fast gate scanners." },
          { n: "05", title: "Clear Crowds Safely", desc: "Admit thousands of students in minutes without entrance chaos or unauthorized pass sharing." },
        ],
        callout: {
          badge: "CAMPUS SCALE",
          title: "Eliminate gate overcrowding and paper lists at major college fests.",
          description: "From 500-person departmental symposiums to 10,000-attendee university celebrity nights, URPASS ensures rapid, secure student admission without renting expensive equipment.",
          bullets: [
            "Check in hundreds of students per minute across North, South, and VIP gates",
            "Zero equipment rental fees — works on existing volunteer smartphones",
            "Permanent Free Tier for small student clubs and departmental meetups",
            "Full attendance audit trails with exportable CSV rosters for college administration",
          ],
        },
        faqs: [
          { q: "Can we collect student roll numbers and college ID cards during registration?", a: "Yes. You can add required custom fields for college name, student roll number, branch, and semester on the registration form." },
          { q: "How do volunteers scan passes at the entrance gate?", a: "Volunteers do not need to download an app. You provide them a secure PIN-protected web scanner link that opens their smartphone camera in Safari or Chrome to scan passes in under 0.3s." },
          { q: "Can we sell paid tickets for celebrity nights and cultural fests?", a: "Yes. Connect your college or student council Razorpay account to collect UPI payments directly with 0% platform commission." },
          { q: "Does URPASS work if campus cellular network drops during the fest?", a: "Yes. URPASS caches attendee manifests in the volunteer's browser so scanning continues seamlessly offline, automatically syncing when connection resumes." },
        ],
        relatedLinks: [
          { title: "College Fest Management Software", href: "/college-fest-management-software", category: "Use Case" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "College Event Registration System Guide", href: "/guides/college-event-registration-system", category: "Guide" },
          { title: "Campus Events Platform", href: "/campus-events", category: "Use Case" },
        ],
      }}
    />
  );
}
