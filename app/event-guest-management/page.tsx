import type { Metadata } from "next";
import { Users, UserCheck, ClipboardList, Mail, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Guest Management Software",
  description: "Manage guests from registration to entry. Collect RSVPs, review guest lists, issue digital passes, and check in guests with QR scanning. Simple guest management for any event.",
  alternates: { canonical: "https://urpass.space/event-guest-management" },
  openGraph: {
    title: "Event Guest Management Software | URPASS",
    description: "Handle guest registration, approval, digital passes, and QR check-in from one platform.",
    url: "https://urpass.space/event-guest-management",
  },
};

export default function EventGuestManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT GUEST MANAGEMENT",
        h1: "Manage Guests from Registration to Entry",
        description: "Collect guest registrations, manage your approved guest list, issue digital QR passes, and scan guests at the entrance. All from one clean platform.",
        ctaLabel: "Manage your guests free",
        features: [
          { icon: ClipboardList, title: "Guest registration form", desc: "Collect guest details through a public registration link — name, email, affiliation, and more." },
          { icon: UserCheck, title: "Guest approval workflow", desc: "Review each registration and approve or decline guests. Issue passes with one click." },
          { icon: Users, title: "Guest list management", desc: "View, search, and filter your complete guest list by status, pass type, or check-in state." },
          { icon: Mail, title: "Instant pass delivery", desc: "Approved guests receive their digital QR pass via the registration confirmation page instantly." },
          { icon: ScanLine, title: "QR check-in at entry", desc: "Scan guest QR passes at the entrance using any phone. Real-time validation in under a second." },
          { icon: BarChart3, title: "Guest arrival dashboard", desc: "Monitor who has arrived, total guest count, and check-in progress from your live dashboard." },
        ],
        callout: {
          badge: "COMPLETE GUEST FLOW",
          title: "From RSVP to entry in one platform.",
          description: "URPASS manages your guest list end-to-end. Guests register, you review and approve, they get a QR pass, and you scan them in at the door.",
          bullets: [
            "Public or private registration",
            "One-click approval per guest",
            "Digital QR pass on approval",
            "Live guest check-in tracking",
          ],
        },
        useCases: [
          "Corporate events", "Conferences", "Gala dinners", "Product launches",
          "Workshops", "Community events", "Seminars", "College fests",
        ],
        faqs: [
          { q: "What is event guest management?", a: "Event guest management covers collecting RSVPs or registrations, maintaining a guest list, issuing access passes, and managing entry on the day. URPASS handles all of this digitally with QR passes and scanning." },
          { q: "Can I control who gets invited?", a: "Yes. You can keep the registration link private (shared only with invitees) and manually review each registration before approving." },
          { q: "How does a guest get their entry pass?", a: "Once you approve their registration, the guest receives a digital QR pass via a link. They show it on their phone at the entrance." },
          { q: "Can I add VIP guests separately?", a: "Yes. When approving guests, you can assign pass types such as VIP, Speaker, or Organizer in addition to the standard Participant type." },
          { q: "Can I manage a walk-in guest list?", a: "Yes. You can manually add attendees directly from the attendee management dashboard for walk-in guests." },
          { q: "How many guests can I manage for free?", a: "The free plan supports up to 50 guests per event. Paid plans support 500 or 2,000 guests per event." },
        ],
        ctaTitle: "Simplify your guest management",
        ctaDescription: "Registration to entry · Digital QR passes · Free to start",
      }}
    />
  );
}
