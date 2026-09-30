import type { Metadata } from "next";
import { Users, Search, ScanLine, Smartphone, ShieldCheck, Clock, BarChart3, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Guest List Check-In App & Digital Roster | URPASS",
  description:
    "Digital guest list check-in app with sub-0.3s QR scanning and instant name/email search fallback. Replace paper rosters with real-time arrival tracking.",
  keywords: [
    "event guest list check in",
    "vip guest check in app",
    "digital guest list software",
    "attendee roster search",
    "event door guest list",
    "paperless guest check in",
  ],
  alternates: { canonical: "https://urpass.space/event-guest-list-check-in" },
  openGraph: {
    title: "Event Guest List Check-In App & Digital Roster | URPASS",
    description: "Digital guest list check-in app with sub-0.3s QR scanning and instant search fallback.",
    url: "https://urpass.space/event-guest-list-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DIGITAL ROSTER & ENTRY",
        h1: "Event Guest List Check-In & Digital Attendee Roster",
        canonicalUrl: "https://urpass.space/event-guest-list-check-in",
        description:
          "Replace paper clipboards with a live digital guest list. Scan QR passes in under 0.3s or look up attendees instantly by name, email, or company.",
        ctaLabel: "Set Up Digital Guest List",
        directAnswer: {
          title: "How Does the URPASS Digital Guest List Check-In Work?",
          summary:
            "URPASS combines instant camera-based QR scanning with a live searchable guest roster inside any mobile browser. When guests arrive with their digital pass, staff scan it in under 0.3 seconds. If a guest forgot their phone or has a dead battery, door staff simply search by first name, last name, or email to check them in manually with an automatic timestamp.",
          keyPoints: [
            "Dual-mode check-in: sub-0.3s QR camera scanning plus instant name and email manual search",
            "Real-time synchronized headcount across multiple door staff devices without duplicate entries",
            "Zero app downloads: staff access the digital guest list via a secure PIN link in mobile browsers",
            "Complete attendance logs with exportable CSV rosters showing exact arrival timestamps",
          ],
        },
        keyFactsTable: {
          title: "Digital Guest List vs Paper Checklists",
          subtitle: "Comparison of event day entrance management methods.",
          headers: ["Operational Parameter", "URPASS Digital Guest List", "Printed Paper Sheets / Clipboards"],
          rows: [
            { col1: "Attendee Lookup Speed", col2: "Instant search or <0.3s QR camera scan", col3: "30–60s flipping through alphabetical sheets" },
            { col1: "Cross-Door Coordination", col2: "Live real-time cloud sync across all devices", col3: "Impossible; separate paper lists cause confusion" },
            { col1: "Duplicate Prevention", col2: "Atomic database locking alerts duplicate names", col3: "Names crossed off in pencil; easily missed" },
            { col1: "Attendance Reporting", col2: "Instant digital CSV export with exact timestamps", col3: "Hours of manual post-event data entry" },
            { col1: "VIP Guest Alerts", col2: "Instant visual tier tags (VIP, Speaker, Sponsor)", col3: "Highlighted markers often overlooked in dark lobbies" },
          ],
        },
        features: [
          { icon: Search, title: "Instant Live Search Fallback", desc: "Type 2 letters of an attendee's name or email to locate their record and check them in manually in seconds." },
          { icon: ScanLine, title: "Sub-0.3s QR Camera Scanning", desc: "Guests with passes are verified instantaneously with audible chimes, keeping door queues flowing smoothly." },
          { icon: ShieldCheck, title: "Anti-Duplicate Locking", desc: "Checked-in guests are flagged in real time across all staff devices, preventing unauthorized second entries." },
          { icon: Smartphone, title: "Runs in Mobile Safari & Chrome", desc: "Staff open the guest list link on their personal smartphones with zero app downloads or account logins." },
          { icon: Users, title: "VIP & Tier Badging", desc: "Quickly identify VIPs, speakers, media, and general attendees with color-coded badge tags on the roster." },
          { icon: BarChart3, title: "Live Headcount & Velocity", desc: "Watch total check-ins, percentage of arrivals, and remaining no-shows update live on your screen." },
        ],
        steps: [
          { n: "01", title: "Upload or Collect Guests", desc: "Import an existing attendee CSV or collect registrations via your URPASS event page." },
          { n: "02", title: "Generate Secure Scanner PIN", desc: "Create a 6-digit access PIN for door staff to access the guest list." },
          { n: "03", title: "Staff Open Web Link", desc: "Staff open the link in Safari or Chrome; guest list and camera scanner load instantly." },
          { n: "04", title: "Check In Guests", desc: "Scan digital QR passes or search by name/email for immediate verification." },
          { n: "05", title: "Export Attendance Logs", desc: "Download verified attendee lists with exact timestamps for post-event follow-up." },
        ],
        callout: {
          badge: "ELEGANT RECEPTION",
          title: "Deliver a polished, professional check-in experience for high-end events.",
          description: "Whether hosting an exclusive corporate dinner, gallery opening, or tech mixer, paper clipboards look amateur. URPASS gives your door team an elegant digital check-in interface on their phones or tablets.",
          bullets: [
            "Seamless fallback between QR camera scanning and manual name search",
            "Multi-device cloud synchronization prevents duplicate admissions across doors",
            "Works completely offline if local venue Wi-Fi drops unexpectedly",
            "Permanent Free Tier available for community events up to 100 guests",
          ],
        },
        faqs: [
          { q: "What happens if an attendee doesn't have their QR ticket?", a: "Door staff can simply switch to the search tab and type the attendee's name or email address to verify their registration and admit them with a single tap." },
          { q: "Can multiple staff members check in guests from the same list?", a: "Yes. Multiple staff can access the guest list concurrently on their own devices. When a guest is checked in on one phone, their status updates across all other screens in real time." },
          { q: "Can I import an existing guest list from Excel or CSV?", a: "Yes. Organizers can upload CSV guest lists with names, emails, and ticket tiers directly into URPASS." },
          { q: "Is the guest list secure?", a: "Yes. Door staff access the guest list using a secure PIN code that restricts access solely to check-in functionality without exposing administrative settings or financial details." },
        ],
        relatedLinks: [
          { title: "Event Guest List Software", href: "/event-guest-list-software", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "Attendee Management Software", href: "/attendee-management", category: "Product" },
        ],
      }}
    />
  );
}
