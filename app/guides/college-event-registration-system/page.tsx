import type { Metadata } from "next";
import { GraduationCap, Link2, ClipboardList, CheckSquare, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Set Up a College Event Registration System | URPASS",
  description: "Step-by-step guide to setting up a digital college event registration system with QR passes and check-in. Replace Google Forms and manual lists in minutes.",
  alternates: { canonical: "https://urpass.space/guides/college-event-registration-system" },
  openGraph: {
    title: "How to Set Up a College Event Registration System | URPASS",
    description: "Replace Google Forms and Excel with a proper college event registration and QR check-in system.",
    url: "https://urpass.space/guides/college-event-registration-system",
  },
};

export default function CollegeEventRegistrationSystemPage() {
  return (
    <SEOPage
      config={{
        badge: "HOW-TO GUIDE",
        h1: "How to Set Up a College Event Registration System",
        description: "Most college events still use Google Forms, Excel sheets, and manual check-in. Here is how to set up a proper digital registration system with QR passes — in under 10 minutes.",
        ctaLabel: "Set up your college system",
        steps: [
          { n: "01", title: "Create event", desc: "Sign up free and create your college event — name, date, venue, capacity, and registration details." },
          { n: "02", title: "Add fields", desc: "Add registration fields: student name, roll number, department, year, college, and phone." },
          { n: "03", title: "Share link", desc: "Share the registration link via WhatsApp groups, Instagram story, college portal, or email." },
          { n: "04", title: "Approve students", desc: "Review registrations and approve students. Enable auto-approval for open events." },
          { n: "05", title: "Scan at gate", desc: "On event day, use any phone to scan student QR passes at the college gate or event hall entrance." },
        ],
        features: [
          { icon: GraduationCap, title: "Why Google Forms isn't enough", desc: "Google Forms collects data but doesn't issue passes, prevent duplicate entries, or give you a live check-in dashboard. URPASS does all three." },
          { icon: Link2, title: "One shareable link", desc: "Share a single registration link. No form exports, no manual processing — everything is in your URPASS dashboard." },
          { icon: ClipboardList, title: "Custom college fields", desc: "Collect roll number, department, year, branch, and any other information your college event requires." },
          { icon: CheckSquare, title: "Approve with one click", desc: "Review applications and approve them individually or in bulk. QR passes are issued automatically." },
          { icon: QrCode, title: "Digital QR student pass", desc: "Every approved student gets a digital QR pass on their phone. No printing, no physical ID cards." },
          { icon: ScanLine, title: "QR check-in at the gate", desc: "Any college volunteer can scan QR passes on their own phone — no training or dedicated hardware needed." },
        ],
        callout: {
          badge: "REPLACES GOOGLE FORMS",
          title: "Everything Google Forms can't do.",
          description: "Google Forms collects registrations. URPASS collects registrations AND issues QR passes AND checks students in at the gate AND shows you live attendance.",
          bullets: [
            "Google Forms = data collection only",
            "URPASS = registration + QR pass + check-in",
            "Live attendance dashboard included",
            "Free for events up to 50 students",
          ],
        },
        useCases: [
          "Technical symposiums", "Cultural fests", "Workshops", "Hackathons",
          "Guest lectures", "Sports events", "Department events", "Inter-college events",
        ],
        faqs: [
          { q: "Why should I replace Google Forms for college event registration?", a: "Google Forms collects data but doesn't generate passes, prevent duplicate entries, or provide real-time check-in tracking. URPASS does all of this automatically once a student registers." },
          { q: "How many students can register for free?", a: "Up to 50 students per event on the free plan. For larger college events, paid plans start at ₹299/month with 500 students per event." },
          { q: "Can volunteers use URPASS to check students in?", a: "Yes. Volunteers open the URPASS scanner in any phone browser and start scanning immediately. No training or account required for scanning." },
          { q: "Can I collect department and year from students?", a: "Yes. Add custom fields for department, year, roll number, college name, or any other student detail." },
          { q: "What if students don't have internet access at the venue?", a: "Students can screenshot their QR pass before coming. The QR works from a screenshot." },
          { q: "Can I use the same URPASS account for multiple college events?", a: "Yes. The Starter plan supports 5 active events, and the Pro plan supports unlimited events." },
        ],
        ctaTitle: "Replace Google Forms with a real registration system",
        ctaDescription: "QR passes · Live check-in · Free for small events · 10-minute setup",
      }}
    />
  );
}
