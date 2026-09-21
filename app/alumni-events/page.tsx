import type { Metadata } from "next";
import { CheckCircle2, GraduationCap, Users, Calendar, QrCode, ScanLine, Heart } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Alumni Meet Registration & Digital Reunion Pass Software",
  description: "Organize college and university alumni reunions, homecoming galas, and batch meets. Collect graduation years, issue branded digital passes, and streamline gate check-in.",
  keywords: [
    "alumni meet registration software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/alumni-events" },
  openGraph: {
    title: "Alumni Meet Registration & Digital Reunion Pass Software | URPASS",
    description: "Organize college and university alumni reunions, homecoming galas, and batch meets. Collect graduation years, issue branded digital passes, and streamline gate check-in.",
    url: "https://urpass.space/alumni-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ALUMNI REUNIONS",
        h1: "Alumni Meet Registration & Reunion Check-In Software",
        canonicalUrl: "https://urpass.space/alumni-events",
        description: "Organize college and university alumni reunions, homecoming galas, and batch meets. Collect graduation years, issue branded digital passes, and streamline gate check-in.",
        ctaLabel: "Manage alumni meet free",
        features: [
          { icon: GraduationCap, title: "Batch & Year Tracking", desc: "Collect graduation year, degree, department, current company, and city on your registration form." },
          { icon: Users, title: "Commemorative Digital Passes", desc: "Issue branded reunion passes displaying the alumnus's name, graduation batch, and campus logo." },
          { icon: Calendar, title: "Family & Plus-One Support", desc: "Gather spouse and children attendance numbers with automated total headcount calculation." },
          { icon: QrCode, title: "Sub-Second Campus Check-In", desc: "Volunteers scan alumni passes at campus gates in under 0.3s, eliminating entrance roll-call delays." },
          { icon: ScanLine, title: "Batch Attendance Analytics", desc: "Analyze attendance turnout by graduation year and department live on your organizer dashboard." },
          { icon: Heart, title: "Exportable Alumni Directory", desc: "Export updated contact details, current companies, and emails to refresh your institution's database." },
        ],
        steps: [
          { n: "01", title: "Create Alumni Event", desc: "Set reunion date, campus venue, and batch celebration details." },
          { n: "02", title: "Collect Alumni Data", desc: "Alumni submit current job, city, and batch year via public link." },
          { n: "03", title: "Deliver Reunion Passes", desc: "Alumni receive commemorative digital passes with unique QR codes." },
          { n: "04", title: "Welcome at Campus Gate", desc: "Student volunteers scan passes in under 0.3s at the entrance." },
          { n: "05", title: "Update Database", desc: "Download verified attendance logs and updated alumni contact info." },
        ],
        callout: {
          badge: "CAMPUS WELCOME",
          title: "Welcome alumni back with modern, effortless entry.",
          description: "Don't greet accomplished alumni with messy paper sign-in sheets and long queues. URPASS gives your institution a modern, professional reunion registration and check-in workflow.",
          bullets: [
            "Custom registration forms capturing updated alumni data",
            "Commemorative digital passes with graduation batch tags",
            "Instant gate scanning with zero app downloads required",
            "Export updated alumni records directly to Excel or CSV",
          ],
        },
        useCases: [
          "Annual Homecoming Weekends",
          "Silver & Golden Jubilee Meets",
          "Batch Reunion Dinners",
          "Alumni Sports Matches",
          "Distinguished Alumni Awards",
          "Campus Department Mixers",
        ],
        faqs: [
          { q: "Can we collect updated contact information for our alumni database?", a: "Yes. Form fields allow you to collect current company, job title, city, and phone numbers to refresh your records." },
          { q: "Can alumni bring their family members?", a: "Yes. You can add form questions for spouse/children counts and issue passes accordingly." },
          { q: "Can we sell tickets for the alumni dinner?", a: "Yes. Collect reunion banquet fees via Razorpay (UPI, cards, net banking) with zero per-ticket platform cuts." },
          { q: "Can student volunteers scan alumni passes on their phones?", a: "Yes. Volunteers open the scanner URL in their mobile browser and scan passes with zero app installations." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
