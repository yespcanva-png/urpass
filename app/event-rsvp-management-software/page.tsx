import type { Metadata } from "next";
import { CheckSquare, ClipboardList, Mail, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event RSVP Management Software | UrPass",
  description:
    "Replace scattered RSVP lists with organized applications, approval tracking and attendee passes. Explore UrPass.",
  keywords: [
    "event RSVP management software",
    "RSVP software for events",
    "guest list management",
    "event RSVP tracking",
    "digital guest passes",
  ],
  alternates: { canonical: "https://urpass.space/event-rsvp-management-software" },
  openGraph: {
    title: "Event RSVP Management Software | UrPass",
    description:
      "Replace scattered RSVP lists with organized applications, approval tracking and attendee passes. Explore UrPass.",
    url: "https://urpass.space/event-rsvp-management-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventRsvpManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "RSVP MANAGEMENT",
        h1: "Event RSVP Management Software for Organizers",
        canonicalUrl: "https://urpass.space/event-rsvp-management-software",
        description:
          "Use UrPass to collect RSVPs, review attendee applications, issue digital passes and manage event-day entry without scattered spreadsheets.",
        ctaLabel: "Manage RSVPs",
        ctaHref: "/signup",
        directAnswer: {
          title: "What is event RSVP management software?",
          summary:
            "Event RSVP management software helps organizers collect guest confirmations, capture attendee details, approve or reject applications and maintain an accurate guest list. UrPass extends RSVP management with digital QR passes and venue check-in, so RSVP status and actual attendance remain connected.",
          keyPoints: [
            "Collect attendee details through a hosted RSVP page",
            "Review and approve registrations when required",
            "Issue digital passes to confirmed guests",
            "Track confirmed guests versus real attendance",
          ],
        },
        features: [
          { icon: ClipboardList, title: "RSVP Forms", desc: "Collect names, contact details, preferences and custom responses from invited guests." },
          { icon: CheckSquare, title: "Approval Tracking", desc: "Review RSVPs before issuing passes for curated, limited-capacity or private events." },
          { icon: Mail, title: "Digital Confirmation", desc: "Give approved attendees a clear event confirmation and mobile-friendly pass." },
          { icon: QrCode, title: "Guest QR Passes", desc: "Use scannable credentials instead of printed lists for cleaner event entry." },
          { icon: ScanLine, title: "Door Verification", desc: "Scan confirmed guest passes and instantly flag duplicate or invalid credentials." },
          { icon: Users, title: "Guest List Visibility", desc: "Keep RSVP status, attendee information and check-in records organized in one place." },
        ],
        steps: [
          { n: "01", title: "Create RSVP page", desc: "Add event details and guest questions." },
          { n: "02", title: "Share invitation link", desc: "Send the RSVP link to your guest list or community." },
          { n: "03", title: "Review responses", desc: "Approve guests manually or accept them automatically." },
          { n: "04", title: "Issue passes", desc: "Give confirmed guests digital QR passes for entry." },
          { n: "05", title: "Track arrivals", desc: "Scan guests at the door and compare RSVPs with actual attendance." },
        ],
        relatedLinks: [
          { title: "Event RSVP Software", href: "/event-rsvp-software", category: "Product" },
          { title: "Event Guest List Software", href: "/event-guest-list-software", category: "Product" },
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
        ],
        faqs: [
          { q: "Can UrPass replace a spreadsheet RSVP list?", a: "Yes. UrPass keeps RSVP responses, attendee data, approval status and check-in status together." },
          { q: "Can I approve RSVPs before guests receive passes?", a: "Yes. Manual approval workflows can be used for private, curated or limited-capacity events." },
          { q: "Can RSVP guests be scanned at the venue?", a: "Yes. Approved guests can receive QR passes that staff scan at entry." },
          { q: "Can I export the final RSVP and attendance list?", a: "Yes. Attendee and check-in records can be exported for post-event use." },
        ],
        ctaTitle: "Manage RSVPs and entry from one system",
        ctaDescription: "Collect responses, approve guests and scan confirmed attendees at the venue.",
      }}
    />
  );
}
