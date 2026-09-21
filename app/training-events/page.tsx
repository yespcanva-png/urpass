import type { Metadata } from "next";
import { CheckCircle2, GraduationCap, ClipboardList, ScanLine, Clock, Download, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Training Workshop Attendance Tracking & QR Certification Software",
  description: "Manage corporate training workshops, professional masterclasses, and certified courses. Issue digital passes, verify participant entry, and export audit-ready attendance sheets.",
  keywords: [
    "training workshop attendance tracking",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/training-events" },
  openGraph: {
    title: "Training Workshop Attendance Tracking & QR Certification Software | URPASS",
    description: "Manage corporate training workshops, professional masterclasses, and certified courses. Issue digital passes, verify participant entry, and export audit-ready attendance sheets.",
    url: "https://urpass.space/training-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TRAINING & MASTERCLASSES",
        h1: "Training Workshop Attendance Tracking & QR Pass Software",
        canonicalUrl: "https://urpass.space/training-events",
        description: "Manage corporate training workshops, professional masterclasses, and certified courses. Issue digital passes, verify participant entry, and export audit-ready attendance sheets.",
        ctaLabel: "Track training attendance free",
        features: [
          { icon: GraduationCap, title: "Participant Registration Forms", desc: "Collect employee ID, company, department, and training track preferences on customized forms." },
          { icon: ClipboardList, title: "Single-Use Digital Badges", desc: "Participants receive unique QR passes that verify identity and ensure only enrolled attendees enter." },
          { icon: ScanLine, title: "Timestamped Training Records", desc: "Every scan logs the exact second each participant entered for compliance, HR records, and certification." },
          { icon: Clock, title: "Sub-Second Door Verification", desc: "Instructors or coordinators scan passes in under 0.3s using any mobile phone or tablet browser." },
          { icon: Download, title: "Accreditation CSV Export", desc: "Download verified attendance logs ready to import into certificate generators or HR compliance portals." },
          { icon: ShieldCheck, title: "Integrated Feedback Surveys", desc: "Collect trainer ratings, course evaluations, and feedback automatically after the workshop ends." },
        ],
        steps: [
          { n: "01", title: "Setup Workshop", desc: "Enter course title, training room, dates, and maximum participant cap." },
          { n: "02", title: "Enroll Trainees", desc: "Participants sign up online or HR imports employee lists via CSV." },
          { n: "03", title: "Issue Training Passes", desc: "Trainees receive mobile digital passes with verified QR codes." },
          { n: "04", title: "Scan at Room Door", desc: "Coordinator scans passes to confirm attendance before training starts." },
          { n: "05", title: "Export for Certificates", desc: "Download timestamped attendance logs to issue completion certificates." },
        ],
        callout: {
          badge: "COMPLIANCE & HR",
          title: "Accurate training records without paper attendance sheets.",
          description: "Manual sign-in sheets get lost and leave compliance auditors questioning attendance legitimacy. URPASS creates tamper-proof, timestamped attendance records automatically.",
          bullets: [
            "Audit-proof timestamps for professional compliance",
            "One-click CSV export ready for certificate generation",
            "Single-use QR security eliminates proxy attendance",
            "Automated post-training course evaluation surveys",
          ],
        },
        useCases: [
          "Corporate Compliance Training",
          "Medical & Nursing Continuing Education",
          "Technical Coding Bootcamps",
          "Leadership Development Masterclasses",
          "Safety & First Aid Certifications",
          "Sales Enablement Bootcamps",
        ],
        faqs: [
          { q: "Can we use attendance logs to issue certificates of completion?", a: "Yes. The CSV export contains attendee names, emails, and exact check-in timestamps, ready for mail-merge certificate tools." },
          { q: "How do we prevent trainees from signing in for colleagues who aren't there?", a: "Each QR code is tied to an individual trainee and can only be scanned once at the entrance door." },
          { q: "Can we collect course fees for public workshops?", a: "Yes. Native Razorpay integration allows you to accept ticket payments via UPI and cards with zero per-ticket cuts." },
          { q: "Can trainers view real-time class attendance on their phone?", a: "Yes. Trainers can monitor live attendance and see who has arrived from their mobile dashboard." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
