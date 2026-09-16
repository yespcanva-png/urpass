import type { Metadata } from "next";
import { ClipboardList, QrCode, Users, CheckSquare, BarChart3, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software for Modern Events | URPASS",
  description: "Simple online event registration software with instant digital passes and QR check-in. Create your event, collect registrations, and manage attendees from one dashboard. Free to start.",
  alternates: { canonical: "https://urpass.space/event-registration-software" },
  openGraph: {
    title: "Event Registration Software for Modern Events | URPASS",
    description: "Create events, register attendees, issue digital QR passes, and manage check-ins with URPASS.",
    url: "https://urpass.space/event-registration-software",
  },
};

export default function EventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT REGISTRATION SOFTWARE",
        h1: "Simple Online Event Registration Software",
        description: "Create an event, share a registration link, collect applications, and issue digital QR passes — all from one simple platform. No spreadsheets. No confusion.",
        ctaLabel: "Start registrations free",
        features: [
          { icon: ClipboardList, title: "Custom registration forms", desc: "Collect name, email, phone, and any custom fields you need. Control exactly what information attendees submit." },
          { icon: Zap, title: "Instant digital passes", desc: "Once approved, attendees receive a digital QR pass automatically. No printing, no manual distribution." },
          { icon: QrCode, title: "QR code check-in", desc: "Scan attendee passes at the entrance using any phone or tablet. No extra app required." },
          { icon: Users, title: "Attendee management", desc: "Review, approve, or reject applications from your dashboard. Bulk approve with one click." },
          { icon: CheckSquare, title: "Duplicate entry prevention", desc: "Each QR pass is unique and single-use. URPASS blocks duplicate scans automatically." },
          { icon: BarChart3, title: "Real-time check-in dashboard", desc: "See who has arrived, check-in rates, and attendance stats as your event runs." },
        ],
        callout: {
          badge: "QR CHECK-IN",
          title: "Registration to check-in in one platform.",
          description: "URPASS connects the registration flow to your check-in process. Approved attendees get a unique QR pass — your staff scans it at the door.",
          bullets: [
            "Works on any phone or tablet — no app",
            "Invalid passes flagged immediately",
            "Real-time attendance visibility",
            "Offline-capable scanning",
          ],
        },
        useCases: [
          "College events", "Workshops", "Hackathons", "Seminars",
          "Corporate events", "Community meetups", "Conferences", "Tech events",
        ],
        faqs: [
          { q: "What is event registration software?", a: "Event registration software lets organizers create an event, collect attendee applications or sign-ups, manage approvals, and issue passes or tickets. URPASS handles all of this plus QR check-in from a single dashboard." },
          { q: "Is URPASS free to use?", a: "Yes. The free plan supports 1 active event with up to 50 attendees. No credit card required. Paid plans start at ₹299/month." },
          { q: "Do attendees need to download an app?", a: "No. Attendees register through a public link and receive a digital pass that opens in any mobile browser. No app installation required." },
          { q: "Can I use this for paid events?", a: "Yes. Starter and Pro plans support paid event ticketing with Razorpay payment integration." },
          { q: "How long does it take to set up?", a: "You can create an event and publish a registration link in under 5 minutes." },
          { q: "Can I approve applications manually?", a: "Yes. By default, you review and approve each application. You can also enable auto-approval if you want instant passes." },
        ],
        ctaTitle: "Create your first event in minutes",
        ctaDescription: "Free plan available · Digital passes · QR check-in · No credit card required",
      }}
    />
  );
}
