import type { Metadata } from "next";
import { CheckCircle2, GraduationCap, Building2, Users, ScanLine, ShieldCheck, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Event Registration & Campus Access Control",
  description: "Run university convocations, academic conferences, inter-collegiate tournaments, and campus festivals with digital QR passes, multi-gate sync, and department attendance tracking.",
  keywords: [
    "university event registration system",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/university-events" },
  openGraph: {
    title: "University Event Registration & Campus Access Control | URPASS",
    description: "Run university convocations, academic conferences, inter-collegiate tournaments, and campus festivals with digital QR passes, multi-gate sync, and department attendance tracking.",
    url: "https://urpass.space/university-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "UNIVERSITY & COLLEGES",
        h1: "University Event Registration & Campus Access Software",
        canonicalUrl: "https://urpass.space/university-events",
        description: "Run university convocations, academic conferences, inter-collegiate tournaments, and campus festivals with digital QR passes, multi-gate sync, and department attendance tracking.",
        ctaLabel: "Manage university events free",
        features: [
          { icon: GraduationCap, title: "Campus-Scale Throughput", desc: "Handle thousands of students, faculty, and external delegates across sprawling campus gates without bottlenecks." },
          { icon: Building2, title: "Department & Faculty Tracking", desc: "Sort and filter attendees by department, university registration number, or academic faculty." },
          { icon: Users, title: "Multi-Gate Cloud Sync", desc: "Coordinate security and scanning across Main Gate, Auditorium, and Sports Complex doors simultaneously." },
          { icon: ScanLine, title: "Faculty & VIP Credentials", desc: "Configure distinct badge tiers for Chief Guests, Faculty, Delegates, and Students with visual badges." },
          { icon: ShieldCheck, title: "Instant Student Verification", desc: "Verify student identities and prevent outsider intrusion during closed campus events." },
          { icon: BarChart3, title: "Accreditation & NAAC Logs", desc: "Export timestamped attendance records required for institutional accreditation and government audits." },
        ],
        steps: [
          { n: "01", title: "Setup University Event", desc: "Configure event details, academic departments, and hall capacities." },
          { n: "02", title: "Collect Registrations", desc: "Distribute registration link through university portals and student groups." },
          { n: "03", title: "Issue Student Passes", desc: "Automate digital QR pass issuance for approved students and delegates." },
          { n: "04", title: "Scan at Campus Gates", desc: "Volunteers and security staff scan passes across all campus entrances." },
          { n: "05", title: "Export Audit Logs", desc: "Generate department-wise attendance reports for university records." },
        ],
        callout: {
          badge: "INSTITUTIONAL SCALE",
          title: "Enterprise reliability for higher education institutions.",
          description: "Universities require robust attendance documentation and tight gate security. URPASS modernizes university campus events with verifiable, timestamped digital credentials.",
          bullets: [
            "Multi-gate synchronization across sprawling university venues",
            "Instant duplicate entry lockout across all campus checkpoints",
            "Exportable attendance reports sorted by department and college",
            "Zero per-ticket fees — transparent, predictable pricing",
          ],
        },
        useCases: [
          "University Convocations",
          "National Research Conferences",
          "Inter-University Fests",
          "Chancellor Addresses",
          "Placement Drives & Fairs",
          "Alumni Reunion Weekends",
        ],
        faqs: [
          { q: "Can we track attendance for students from multiple affiliated colleges?", a: "Yes. You can collect the student's affiliated college name on the form and filter attendance by college." },
          { q: "Can security personnel scan passes on multiple campus gates?", a: "Yes. You can deploy unlimited scanning devices across all entrance gates with real-time central synchronization." },
          { q: "Can we export verified attendance for university accreditation?", a: "Yes. The CSV export includes student names, roll numbers, departments, and exact entry timestamps." },
          { q: "Is URPASS free for departmental seminars?", a: "Yes. Smaller seminars with under 100 participants can use our permanent free plan at ₹0 forever." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
