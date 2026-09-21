import type { Metadata } from "next";
import { CheckCircle2, School, ClipboardList, QrCode, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Manage College Event Registrations Without Spreadsheets",
  description: "The most effective way to manage college event registrations is using a dedicated platform that collects student credentials (roll number, department, college name), sets strict seat limits per workshop or contest, automatically issues unique digital QR passes upon approval, and verifies entries at campus gates in under 0.3s.",
  keywords: [
    "how to manage college event registrations",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-manage-college-event-registrations" },
  openGraph: {
    title: "How to Manage College Event Registrations Without Spreadsheets | URPASS",
    description: "The most effective way to manage college event registrations is using a dedicated platform that collects student credentials (roll number, department, college name), sets strict seat limits per workshop or contest, automatically issues unique digital QR passes upon approval, and verifies entries at campus gates in under 0.3s.",
    url: "https://urpass.space/guides/how-to-manage-college-event-registrations",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS GUIDE",
        h1: "How to Manage College Event Registrations",
        canonicalUrl: "https://urpass.space/guides/how-to-manage-college-event-registrations",
        description: "The most effective way to manage college event registrations is using a dedicated platform that collects student credentials (roll number, department, college name), sets strict seat limits per workshop or contest, automatically issues unique digital QR passes upon approval, and verifies entries at campus gates in under 0.3s.",
        ctaLabel: "Manage college events free",
        features: [
          { icon: School, title: "Student Verification Fields", desc: "Collect student roll numbers, college names, year of study, and department affiliations directly on your form." },
          { icon: ClipboardList, title: "Seat Quotas & Caps", desc: "Prevent overcrowded auditoriums by setting exact registration limits per department or workshop." },
          { icon: QrCode, title: "Bulk Approval Queues", desc: "Review student applications and approve hundreds of participants with a single bulk-approval click." },
          { icon: ScanLine, title: "Unique Student QR Passes", desc: "Every approved student gets a digital pass on their phone with a single-use QR code that cannot be shared." },
          { icon: Users, title: "Rapid Gate Check-In", desc: "Student volunteers scan passes at campus gates using their own phones, eliminating manual roll-call lines." },
          { icon: BarChart3, title: "Department Attendance Logs", desc: "Export verified attendance records sorted by department or college for official academic credits." },
        ],
        steps: [
          { n: "01", title: "Create College Event", desc: "Set event name, department, venue auditorium, and capacity limit." },
          { n: "02", title: "Customize Form", desc: "Add student roll number, college name, and year of study fields." },
          { n: "03", title: "Share Campus Link", desc: "Distribute the registration link via college WhatsApp groups and portals." },
          { n: "04", title: "Approve Students", desc: "Approve applicants to trigger instant digital QR pass delivery." },
          { n: "05", title: "Scan at Campus Gates", desc: "Volunteers scan student passes at the entrance for fast, queue-free entry." },
        ],
        callout: {
          badge: "CAMPUS READY",
          title: "Built specifically for college fests and student councils.",
          description: "Managing college event registrations with Google Forms leads to unverified attendees, proxy sign-ins, and chaotic entrance queues. URPASS brings registration and door verification into one seamless system.",
          bullets: [
            "Eliminates proxy attendance and fraudulent pass sharing",
            "Instant multi-counter volunteer scanning on any phone",
            "Permanent free tier for up to 100 students per month",
            "Timestamped attendance logs ready for faculty approval",
          ],
        },
        useCases: [
          "Inter-College Cultural Fests",
          "Department Technical Symposiums",
          "24-Hour Hackathons",
          "College Sports Meets",
          "Fresher Orientations",
          "Placement Training Workshops",
        ],
        faqs: [
          { q: "Can we collect registrations from other colleges?", a: "Yes. The registration link is public and shareable, allowing students from any university to sign up and submit their institutional details." },
          { q: "How do we prevent students from sharing their QR code with friends?", a: "Each QR code is cryptographically single-use. Once scanned at the campus gate, it is locked; any duplicate scan attempt triggers a red alert." },
          { q: "Can student coordinators use their own phones as scanners?", a: "Yes. Organizers can share a PIN-protected scanner link so student volunteers can scan passes in their phone browsers with zero app installation." },
          { q: "Can we export attendance data for faculty or college administration?", a: "Yes. You can export the complete attendance sheet with student names, roll numbers, and entry timestamps to Excel." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
