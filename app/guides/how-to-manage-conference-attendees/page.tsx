import type { Metadata } from "next";
import { CheckCircle2, Mic, Users, Ticket, Palette, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Manage Conference Attendees: Badges, Entry & Tracking",
  description: "Manage conference attendees by categorizing delegates into badge tiers (General, VIP, Speaker, Sponsor), pre-issuing digital QR credentials, deploying multi-counter check-in desks, and exporting timestamped attendance records for continuing education or sponsor reporting.",
  keywords: [
    "how to manage conference attendees",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-manage-conference-attendees" },
  openGraph: {
    title: "How to Manage Conference Attendees: Badges, Entry & Tracking | URPASS",
    description: "Manage conference attendees by categorizing delegates into badge tiers (General, VIP, Speaker, Sponsor), pre-issuing digital QR credentials, deploying multi-counter check-in desks, and exporting timestamped attendance records for continuing education or sponsor reporting.",
    url: "https://urpass.space/guides/how-to-manage-conference-attendees",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "CONFERENCE GUIDE",
        h1: "How to Manage Conference Attendees",
        canonicalUrl: "https://urpass.space/guides/how-to-manage-conference-attendees",
        description: "Manage conference attendees by categorizing delegates into badge tiers (General, VIP, Speaker, Sponsor), pre-issuing digital QR credentials, deploying multi-counter check-in desks, and exporting timestamped attendance records for continuing education or sponsor reporting.",
        ctaLabel: "Manage conference attendees free",
        features: [
          { icon: Mic, title: "Tiered Delegate Credentials", desc: "Create distinct pass tiers for Keynote Speakers, VIP Delegates, Sponsors, Press, and General Attendees." },
          { icon: Users, title: "Multi-Counter Check-In", desc: "Deploy multiple volunteer scanning desks at registration tables to eliminate morning keynote queues." },
          { icon: Ticket, title: "Digital & Printed Badges", desc: "Attendees present digital passes on their phones or print high-contrast badges for conference lanyard sleeves." },
          { icon: Palette, title: "Sub-Second Door Scanning", desc: "Volunteers scan delegate passes in under 0.3s using mobile browser cameras with zero hardware rentals." },
          { icon: ScanLine, title: "Real-Time Room Attendance", desc: "Track attendance across breakout rooms, workshops, and general sessions live on your dashboard." },
          { icon: BarChart3, title: "Comprehensive Audit Export", desc: "Download timestamped check-in logs for sponsor reports, Continuing Medical/Legal Education, or audits." },
        ],
        steps: [
          { n: "01", title: "Set Up Conference", desc: "Configure multi-track sessions, venue halls, and delegate capacity limits." },
          { n: "02", title: "Design Badges", desc: "Upload conference branding, sponsor logos, and set tier accent colors." },
          { n: "03", title: "Pre-Issue Passes", desc: "Delegates receive digital QR credentials via web and email beforehand." },
          { n: "04", title: "Fast Morning Check-In", desc: "Desk volunteers scan passes in under 0.3s as delegates arrive." },
          { n: "05", title: "Export Session Logs", desc: "Download verified attendee records for sponsor reporting and credits." },
        ],
        callout: {
          badge: "PROFESSIONAL POLISH",
          title: "Deliver a polished, prestigious delegate arrival experience.",
          description: "Long registration desk queues and disorganized badge boxes leave a poor impression on conference delegates and sponsors. URPASS gives your conference a modern, sub-second check-in flow.",
          bullets: [
            "Prominent tier badges for VIPs, speakers, and sponsors",
            "Sub-0.3 second QR scanning from phone screens or lanyards",
            "Zero dedicated barcode hardware rentals or paper lists",
            "Audit-ready attendance logs with exact entry timestamps",
          ],
        },
        useCases: [
          "Technology Conferences",
          "Medical & Healthcare Summits",
          "Academic Research Symposiums",
          "Executive Leadership Summits",
          "Industry Trade Conventions",
          "Developer DevDays",
        ],
        faqs: [
          { q: "Can we print conference badges for lanyard holders?", a: "Yes. URPASS passes are formatted for high-contrast mobile presentation and print-ready badge sleeves." },
          { q: "How many check-in desks can we operate simultaneously?", a: "Unlimited. All scanning desks synchronize in real time, preventing duplicate registrations across desks." },
          { q: "Can we track attendance for Continuing Education credits?", a: "Yes. Scans record the exact timestamp and entrance location, providing audit-proof documentation for accreditation." },
          { q: "Can we display sponsor logos on attendee digital passes?", a: "Yes. The custom pass designer allows you to upload primary organization and sponsor logos." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
