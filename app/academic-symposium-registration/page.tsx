import type { Metadata } from "next";
import { BookOpen, Users, Ticket, ShieldCheck, BarChart3, Smartphone, Zap, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Academic Symposium Registration & Delegate Pass Platform | URPASS",
  description:
    "Registration, paper presenter screening, and digital delegate passes for academic symposiums, research conferences, and university seminars.",
  keywords: [
    "academic symposium registration",
    "research seminar ticketing",
    "delegate pass platform",
    "university conference registration",
    "paper presenter check in",
    "academic conference badges",
  ],
  alternates: { canonical: "https://urpass.space/academic-symposium-registration" },
  openGraph: {
    title: "Academic Symposium Registration & Delegate Pass Platform | URPASS",
    description: "Registration, presenter screening, and digital delegate passes for academic symposiums.",
    url: "https://urpass.space/academic-symposium-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ACADEMIC & RESEARCH STACK",
        h1: "Academic Symposium Registration & Delegate Pass Platform",
        canonicalUrl: "https://urpass.space/academic-symposium-registration",
        description:
          "Manage delegate registrations, screen paper presenter applications, issue professional lanyard badges, and track symposium session attendance in real time.",
        ctaLabel: "Host Symposium Free",
        directAnswer: {
          title: "How Does URPASS Streamline Academic Symposiums and Seminars?",
          summary:
            "URPASS is tailored for university research departments, medical summits, and academic symposiums. It enables organizers to capture institutional affiliations and research tracks, review presenter applications in an approval queue, generate professional vertical lanyard badges (440x640), and scan delegate passes in under 0.3 seconds at auditorium entrances to verify attendance records for certification.",
          keyPoints: [
            "Capture academic titles, university affiliations, department branches, and paper tracks",
            "Screening approval queues for paper presenters, keynote guests, and student delegates",
            "Professional vertical lanyard badge and printable PDF ticket formats generated in Ticket Studio",
            "Real-time session attendance logging providing audit-ready records for academic certification",
          ],
        },
        keyFactsTable: {
          title: "Academic Symposium Specifications",
          subtitle: "Operational parameters designed for university departments and research institutions.",
          headers: ["Requirement", "URPASS Academic Solution", "Traditional University Paper Logistics"],
          rows: [
            { col1: "Presenter & Delegate Screening", col2: "Built-in 1-click application approval queue", col3: "Scattered emails and manual spreadsheet tracking" },
            { col1: "Delegate Badging", col2: "Vertical lanyard badge layout (440x640 px) with QR", col3: "Handwritten paper inserts prone to misplacement" },
            { col1: "Session Attendance Verification", col2: "< 0.3s camera scan per hall door with timestamps", col3: "Paper sign-in sheets passed around auditoriums" },
            { col1: "Certificate Audit Records", col2: "Exportable CSV roster showing exact arrival times", col3: "Illegible signatures and disputed attendance" },
            { col1: "Registration Commission", col2: "0% platform commission on delegate fees", col3: "5% to 8% cut deducted by commercial ticketing sites" },
          ],
        },
        features: [
          { icon: BookOpen, title: "Paper & Track Screening", desc: "Collect paper submission IDs, research tracks, and university affiliations with custom registration fields and approval queues." },
          { icon: Ticket, title: "Academic Lanyard Badges", desc: "Design vertical badges in Ticket Studio displaying delegate names, academic titles, institution logos, and security QR codes." },
          { icon: Zap, title: "Sub-0.3s Hall Check-In", desc: "Student volunteers scan delegate passes in under 0.3 seconds at keynote hall doors without downloading specialized apps." },
          { icon: ShieldCheck, title: "Credential Sharing Prevention", desc: "Cryptographic pass tokens guarantee that certificates are only issued to delegates who physically verified their attendance." },
          { icon: Users, title: "Multi-Tier Delegate Passes", desc: "Configure distinct badge colors and permissions for Keynote Speakers, Session Chairs, Presenters, and Students." },
          { icon: BarChart3, title: "Attendance Certification Logs", desc: "Download verified attendance rosters with exact timestamps to generate conference participation certificates." },
        ],
        steps: [
          { n: "01", title: "Set Up Symposium", desc: "Define symposium tracks, session dates, auditorium halls, and delegate tiers." },
          { n: "02", title: "Collect Delegate Details", desc: "Delegates apply with institution names, academic designations, and research topics." },
          { n: "03", title: "Approve & Issue Passes", desc: "Review delegate applications and dispatch digital passes via automated email." },
          { n: "04", title: "Doors Open & Scanning", desc: "Volunteers scan delegate badges at auditorium doors in <0.3s using phone cameras." },
          { n: "05", title: "Generate Certificate Records", desc: "Export timestamped attendance reports to verify continuing education or paper presentation credits." },
        ],
        callout: {
          badge: "ACADEMIC INTEGRITY",
          title: "Verify delegate presence with timestamped, tamper-proof check-in logs.",
          description: "Accreditation boards and university grant bodies require rigorous proof of symposium attendance. URPASS replaces easily forged paper sign-in sheets with cryptographic digital check-in records.",
          bullets: [
            "Permanent Free Tier available for departmental seminars up to 100 delegates",
            "Zero equipment rentals — runs on standard volunteer and student smartphones",
            "Instant B2B GST tax invoices for delegates claiming university travel allowances",
            "Automated multi-track attendance tracking across separate breakout seminar rooms",
          ],
        },
        faqs: [
          { q: "Can we collect institutional affiliations and paper titles during registration?", a: "Yes. You can add custom required fields for university name, faculty department, academic title (Professor, Researcher, Student), and research paper title." },
          { q: "Can we print physical lanyard badges for our symposium delegates?", a: "Yes. Ticket Studio natively outputs print-ready vertical lanyard badges (440x640 px) with delegate names and institution logos." },
          { q: "How can we prove delegate attendance for certificate issuance?", a: "URPASS logs every scan with a millisecond timestamp and gate ID. You can export a CSV report after the conference showing exactly who attended which sessions." },
          { q: "Can university student volunteers scan badges without account logins?", a: "Yes. You can give volunteers a secure 6-digit scanner PIN that opens the camera scanner in mobile Safari or Chrome without exposing administrative tools." },
        ],
        relatedLinks: [
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
          { title: "University Event Management", href: "/university-events", category: "Use Case" },
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "Seminars Registration Software", href: "/seminar-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
