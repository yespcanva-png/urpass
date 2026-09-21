import type { Metadata } from "next";
import { CheckCircle2, School, ShieldCheck, Users, ScanLine, ClipboardList, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "School Event Registration & Parent Gate Pass System",
  description: "Manage school annual days, sports meets, and parent-teacher gatherings. Collect RSVPs, issue digital QR entry passes to parents, and ensure campus security at entrance gates.",
  keywords: [
    "school event registration software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/school-events" },
  openGraph: {
    title: "School Event Registration & Parent Gate Pass System | URPASS",
    description: "Manage school annual days, sports meets, and parent-teacher gatherings. Collect RSVPs, issue digital QR entry passes to parents, and ensure campus security at entrance gates.",
    url: "https://urpass.space/school-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "SCHOOL EVENTS",
        h1: "School Event Registration & Parent Entry Management",
        canonicalUrl: "https://urpass.space/school-events",
        description: "Manage school annual days, sports meets, and parent-teacher gatherings. Collect RSVPs, issue digital QR entry passes to parents, and ensure campus security at entrance gates.",
        ctaLabel: "Manage school events free",
        features: [
          { icon: School, title: "Parent Verification", desc: "Issue digital QR visitor passes to parents and guardians linked to their student's roll number and grade." },
          { icon: ShieldCheck, title: "Campus Gate Security", desc: "Security guards scan QR passes at the main gate using mobile phone cameras, blocking unauthorized visitors." },
          { icon: Users, title: "Capacity & Seating Control", desc: "Set auditorium seat limits per family to prevent overcrowding and ensure safe, compliant school gatherings." },
          { icon: ScanLine, title: "Zero App Download for Parents", desc: "Parents receive a web pass link via SMS or WhatsApp that opens directly in their phone browser." },
          { icon: ClipboardList, title: "Timestamped Entry Logs", desc: "Keep complete digital audit trails of which parents and visitors entered campus and at what exact time." },
          { icon: Clock, title: "Easy Volunteer Check-In", desc: "Staff and student volunteers scan passes quickly to keep school entrance lines moving smoothly." },
        ],
        steps: [
          { n: "01", title: "Create School Event", desc: "Set event name, date, auditorium hall, and maximum parent seat capacity." },
          { n: "02", title: "Collect Parent RSVPs", desc: "Parents enter student name, grade, section, and attendee count via public link." },
          { n: "03", title: "Auto-Deliver Passes", desc: "Verified parents receive a mobile digital QR gate pass instantly." },
          { n: "04", title: "Scan at Campus Gate", desc: "Security guards scan passes in under 0.3s at school entrance gates." },
          { n: "05", title: "Review Visitor Log", desc: "Export complete attendance and security logs for school records." },
        ],
        callout: {
          badge: "CAMPUS SAFETY",
          title: "Keep your school campus safe during large events.",
          description: "Open campus events invite security vulnerabilities. URPASS replaces easily forged paper invitations with verified digital passes tied to student records.",
          bullets: [
            "Fraud-proof digital QR passes linked to student details",
            "Fast gate scanning with zero paper clipboard delays",
            "Complete visitor log for school administration safety audits",
            "Permanent free tier for up to 100 registrations per month",
          ],
        },
        useCases: [
          "Annual Day Celebrations",
          "Sports Day Meets",
          "Parent-Teacher Conferences",
          "Science Exhibitions",
          "Graduation Days",
          "School Founder's Celebrations",
        ],
        faqs: [
          { q: "Can parents share their pass with non-family members?", a: "Each pass is single-use. Once scanned at the school gate, it is locked in the system, preventing unauthorized pass sharing." },
          { q: "Do security guards need special barcode scanners?", a: "No. Security guards or teachers can scan passes using the camera on any smartphone web browser." },
          { q: "Can we restrict the number of passes per student?", a: "Yes. You can specify maximum guest limits per registration form." },
          { q: "Is URPASS suitable for primary and high school events?", a: "Yes. The simple interface requires no accounts or app installations, making it accessible for parents of all tech backgrounds." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
