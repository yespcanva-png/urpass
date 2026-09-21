import type { Metadata } from "next";
import { Monitor, ClipboardList, Ticket, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Workshop Registration Software with QR Check-In",
  description: "Collect workshop registrations, issue digital QR passes, and check in participants with QR scanning. Supports free and paid workshops. Quick setup.",
  alternates: { canonical: "https://urpass.space/workshops" },
  openGraph: {
    title: "Workshop Registration Software with QR Check-In | URPASS",
    description: "Workshop registration to QR check-in in one platform. Free and paid workshops supported.",
    url: "https://urpass.space/workshops",
  },
};

export default function WorkshopsPage() {
  return (
    <SEOPage
      config={{
        badge: "WORKSHOPS",
        h1: "Workshop Registration & QR Check-In",
        description: "Share a registration link, collect participant sign-ups, issue digital QR passes, and scan attendees at your workshop door. Supports both free and paid workshops.",
        ctaLabel: "Create your workshop",
        features: [
          { icon: Monitor, title: "Workshop setup in minutes", desc: "Create your workshop, set capacity, and publish a registration link in under 5 minutes." },
          { icon: ClipboardList, title: "Custom registration form", desc: "Collect participant name, experience level, organisation, and any workshop-specific questions." },
          { icon: Ticket, title: "Free or paid registration", desc: "Accept free sign-ups or collect workshop fees via Razorpay integration." },
          { icon: QrCode, title: "Digital QR pass on approval", desc: "Approved participants get a unique QR pass instantly — no printing needed." },
          { icon: ScanLine, title: "Venue QR check-in", desc: "Scan participant passes at the workshop venue with any phone browser." },
          { icon: Users, title: "Participant management", desc: "See registrations as they come in, approve participants, and track check-ins live." },
        ],
        callout: {
          badge: "WORKSHOP FLOW",
          title: "Registration to workshop entry — done.",
          description: "Set your workshop capacity. Share the link. Review sign-ups. Approve participants. They get a QR pass. Scan at the door. That's the whole workflow.",
          bullets: [
            "Capacity-limited registration",
            "Approval-based or auto-approve",
            "QR pass on approval",
            "Scan at workshop venue",
          ],
        },
        useCases: [
          "Technical workshops", "Design workshops", "College workshops", "Corporate training",
          "Coding sessions", "Art workshops", "Career workshops", "Skill workshops",
        ],
        faqs: [
          { q: "Can I limit my workshop to a specific number of participants?", a: "Yes. You set the capacity when creating the event. Registration closes automatically when the limit is reached." },
          { q: "Can I charge a fee for my workshop?", a: "Yes. Paid workshops are supported on Starter and Pro plans via Razorpay. Participants pay when registering and receive their QR pass on payment." },
          { q: "How do I prevent duplicate registrations for my workshop?", a: "URPASS checks that each attendee can only register once per event. Each issued QR pass is also single-use at entry." },
          { q: "Can I add a prerequisite question to filter applicants?", a: "Yes. Add custom fields to your registration form — for example, 'Do you have prior experience with Python? (Yes/No)' — and review applications before approving." },
          { q: "Can I use URPASS for recurring workshops?", a: "You can create a new event for each workshop session. On paid plans, you can run multiple concurrent events." },
          { q: "What if a registered participant can't attend?", a: "You can manually update their status from the attendee management dashboard." },
        ],
        ctaTitle: "Launch your workshop registration today",
        ctaDescription: "Free and paid workshops · QR passes · Entry scanning · Quick setup",
      }}
    />
  );
}
