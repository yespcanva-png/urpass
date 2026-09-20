import type { Metadata } from "next";
import { GraduationCap, QrCode, Users, ScanLine, ClipboardList, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Event Registration & QR Check-In | URPASS",
  description: "Run college events with online registration, digital QR passes, and fast attendee check-in. Trusted by college organisers across India. Free plan available.",
  alternates: { canonical: "https://urpass.space/college-events" },
  openGraph: {
    title: "College Event Registration & QR Check-In | URPASS",
    description: "The simplest way to manage college event registrations and check-in.",
    url: "https://urpass.space/college-events",
  },
};

export default function CollegeEventsPage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE EVENTS",
        h1: "Event Registration & QR Check-In for Colleges",
        description: "Replace Google Forms and manual entry lists with a proper college event system. Share a registration link, issue digital passes, and scan QR codes at the door.",
        ctaLabel: "Start your college event",
        features: [
          { icon: GraduationCap, title: "Made for college organisers", desc: "Designed for the scale and pace of college events — quick setup, easy for first-time organisers." },
          { icon: ClipboardList, title: "Custom registration form", desc: "Collect student name, roll number, department, year, and any custom fields your event requires." },
          { icon: Zap, title: "Auto-approval option", desc: "Enable auto-approval for open events. Attendees get their QR pass the moment they register." },
          { icon: QrCode, title: "Instant digital passes", desc: "Approved students get a QR pass they can show on their phone. No printing, no ID cards." },
          { icon: ScanLine, title: "QR scanning at entry", desc: "Scan student passes with any phone at the college gate or event entrance." },
          { icon: Users, title: "Attendee management", desc: "Manage your full attendee list, approve applications, and track check-ins from your dashboard." },
        ],
        callout: {
          badge: "BUILT FOR COLLEGES",
          title: "From WhatsApp links to proper registration.",
          description: "Most college events still rely on Google Forms, Excel sheets, and manual entry. URPASS gives you a proper registration and check-in system — free for your first event.",
          bullets: [
            "Replace Google Forms + Excel",
            "Share one link for registration",
            "QR passes instead of ID checks",
            "See who showed up in real time",
          ],
        },
        useCases: [
          "Tech workshops", "Hackathons", "Symposiums", "Cultural fests",
          "Guest lectures", "Seminars", "Inter-college events", "Department events",
        ],
        faqs: [
          { q: "Is URPASS free for college events?", a: "Yes. The free plan supports one event with up to 50 attendees. For larger college events, paid plans start at ₹299/month." },
          { q: "Can I collect department or year from students?", a: "Yes. You can add custom registration fields for any information you need — department, year, roll number, or college name." },
          { q: "How do students receive their pass?", a: "After registration is approved, students get a link to their digital QR pass. They show it on their phone at the event entrance." },
          { q: "Can one coordinator manage the full event?", a: "Yes. One person can set up the event, manage registrations, and run QR check-in from the same account." },
          { q: "What if students don't have mobile data at the event?", a: "Students can screenshot their pass or save it offline. The QR is printed on the pass image." },
          { q: "Can I use URPASS for inter-college events?", a: "Yes. The registration form is public — students from any college can register via the shared link." },
        ],
        ctaTitle: "Run your college event the modern way",
        ctaDescription: "Free plan · QR passes · Any phone as scanner · 5-minute setup",
      }}
    />
  );
}
