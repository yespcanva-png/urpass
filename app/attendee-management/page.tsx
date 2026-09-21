import type { Metadata } from "next";
import { Users, CheckSquare, X, Search, Download, ClipboardList } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendee Management Software",
  description: "Manage your event attendees from registration to check-in. Review applications, approve or reject attendees, issue passes, and track entry — all from one dashboard.",
  alternates: { canonical: "https://urpass.space/attendee-management" },
  openGraph: {
    title: "Event Attendee Management Software | URPASS",
    description: "Handle every attendee from application to entry in one place.",
    url: "https://urpass.space/attendee-management",
  },
};

export default function AttendeeManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDEE MANAGEMENT",
        h1: "Manage Your Event Attendees in One Place",
        description: "From the first application to the final check-in, URPASS gives you full control over every attendee. Review applications, issue passes, and track entry from one clean dashboard.",
        ctaLabel: "Manage attendees free",
        features: [
          { icon: ClipboardList, title: "Application review", desc: "See every registration as it comes in. Review attendee details before approving or rejecting." },
          { icon: CheckSquare, title: "One-click approval", desc: "Approve individual attendees or bulk-approve your entire list. Passes generate automatically on approval." },
          { icon: X, title: "Rejection management", desc: "Reject applications when needed. Rejected attendees are clearly separated from your approved list." },
          { icon: Search, title: "Search and filter", desc: "Search attendees by name or email. Filter by status — pending, approved, rejected, or checked in." },
          { icon: Users, title: "Pass type assignment", desc: "Assign pass types (Participant, VIP, Speaker, Organizer) to each attendee when approving." },
          { icon: Download, title: "Export attendee data", desc: "Export your full attendee list with all details and statuses to CSV at any time." },
        ],
        callout: {
          badge: "FULL CONTROL",
          title: "Every attendee, every status, one view.",
          description: "URPASS gives you a complete attendee list with names, emails, pass types, application status, and check-in status. Find, filter, and act on any attendee in seconds.",
          bullets: [
            "Pending, approved, rejected, checked-in",
            "Bulk approve or reject",
            "Search by name or email",
            "Full data export on paid plans",
          ],
        },
        useCases: [
          "College events", "Corporate events", "Conferences", "Workshops",
          "Hackathons", "Seminars", "Fests", "Community meetups",
        ],
        faqs: [
          { q: "What does attendee management mean in URPASS?", a: "Attendee management in URPASS covers the full lifecycle: collecting applications, reviewing and approving them, issuing digital passes, and tracking check-ins. All from one dashboard." },
          { q: "Can I manually add attendees without a registration form?", a: "Yes. You can manually add attendees directly from the attendee management page, bypassing the public registration form." },
          { q: "How many attendees can I manage?", a: "The free plan supports up to 50 attendees per event. Starter supports 500/event and Pro supports 2,000/event." },
          { q: "Can I export my attendee list?", a: "Yes. Starter and Pro plans allow CSV export of your full attendee list with all details and statuses." },
          { q: "Can multiple organisers manage the same event?", a: "Yes. Pro plan supports organisations with multiple team members who can all manage attendees and check-ins for shared events." },
          { q: "What happens to my attendee data after the event?", a: "Your attendee data is stored securely and accessible from your dashboard. You can export it at any time." },
        ],
        ctaTitle: "Put your attendee list under control",
        ctaDescription: "Full lifecycle management · Digital passes · QR check-in · Free to start",
      }}
    />
  );
}
