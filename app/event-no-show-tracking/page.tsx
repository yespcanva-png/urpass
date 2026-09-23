import type { Metadata } from "next";
import { UserX, Users, CheckCircle2, BarChart3, Clock, Mail, ShieldAlert, ArrowRight, RefreshCw } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event No-Show & Attendance Tracking | URPASS",
  description: "Track event attendance and no-shows in real time. Measure registered vs attended ratios, capture exact arrival timestamps, and reduce dropout rates.",
  keywords: [
    "event no show tracking",
    "track event no shows",
    "event attendance rate software",
    "registered vs attended events",
    "reduce event no shows",
    "event check in drop off tracking",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-no-show-tracking" },
  openGraph: {
    title: "Event No-Show & Attendance Tracking | URPASS",
    description: "Track event attendance and no-shows in real time.",
    url: "https://urpass.space/event-no-show-tracking",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDANCE RECONCILIATION",
        h1: "Track Event Attendance and No-Shows",
        canonicalUrl: "https://urpass.space/event-no-show-tracking",
        description:
          "Event no-show tracking analyzes the exact delta between registered participants and verified physical entrance admissions. URPASS calculates live attendance percentages, isolates absent signups from verified attendees, logs sub-second entrance timestamps, and enables segmented follow-up communication to reduce future dropout rates.",
        ctaLabel: "Track Event Attendance",
        features: [
          { icon: UserX, title: "Automated No-Show Segmentation", desc: "Instantly separate registrants who checked in from those who did not attend with zero manual cross-checking." },
          { icon: BarChart3, title: "Live Attendance Percentage", desc: "View real-time show-up ratios (e.g., 78% attended, 22% absent) updated continuously throughout the event day." },
          { icon: Clock, title: "Exact Check-In Timestamps", desc: "Audit logs document the exact minute and gate through which each attendee entered the venue." },
          { icon: Mail, title: "Targeted Post-Event Emailing", desc: "Send thank-you emails and certificates to attendees who came, while sending recordings or polite follow-ups to absentees." },
          { icon: RefreshCw, title: "Multi-Session Drop-off Tracking", desc: "Track attendance continuity across multi-day conferences or sequential breakout workshops." },
          { icon: ShieldAlert, title: "Historical Flake Rate Scoring", desc: "Identify repeat no-shows across recurring company or campus events to manage future seat allocations." },
        ],
        steps: [
          { n: "01", title: "Collect Registrations", desc: "Participants register and receive dynamic digital passes containing tamper-proof QR codes." },
          { n: "02", title: "Entrance Gate Scans", desc: "Door staff scan arriving attendees in under 0.3 seconds using any smartphone browser." },
          { n: "03", title: "Automatic Status Splitting", desc: "Every scan updates the attendee status from 'REGISTERED' to 'CHECKED_IN' in real time." },
          { n: "04", title: "Review Absentee Roster", desc: "Identify key missing delegates, VIPs, or team leaders directly on the live dashboard." },
          { n: "05", title: "Segmented Follow-Ups", desc: "Export separate lists or trigger automated emails tailored specifically to attendees vs no-shows." },
        ],
        callout: {
          badge: "STOP GUESSING ATTENDANCE",
          title: "Treat attended guests and absent signups with the right message.",
          description: "Sending a 'Thank you for coming today!' email to someone who had an emergency and couldn't attend makes your organization look disorganized. URPASS makes attendee reconciliation instantaneous and 100% accurate.",
          bullets: [
            "Send feedback surveys only to attendees who physically walked through the door",
            "Send session slides, recordings, and re-engagement notes to registered no-shows",
            "Plan catering, seating, and gift bags accurately using historical show-up rates",
            "Eliminate hours spent manually ticking names off printed paper sign-in sheets",
          ],
        },
        deepDiveSections: [
          {
            badge: "ROOT CAUSES",
            title: "Why do events experience high no-show rates and how can organizers fix it?",
            paragraphs: [
              "Free corporate meetups, tech workshops, and college seminars regularly experience no-show rates between 35% and 55%. The primary drivers are lack of financial commitment, zero calendar integration, and absent reminder cadences.",
              "URPASS reduces no-show rates by delivering dynamic mobile wallet passes with lockscreen reminders, calendar invite files (.ics), and automated pre-event confirmation emails. For critical events, organizers can also use nominal refundable deposit tickets or registration approval vetting to maximize commitment.",
            ],
            takeaway: "Automated calendar sync and multi-channel reminder cadences cut event no-show rates by up to half.",
          },
          {
            badge: "POST-EVENT VALUE",
            title: "How does segmented no-show tracking boost post-event marketing ROI?",
            paragraphs: [
              "Registrants who missed your event are not lost causes; they expressed high interest in your topic but faced a schedule conflict. Treating them as warm prospects by sending a dedicated 'Sorry we missed you! Here is the video recording' email generates significant goodwill and secondary leads.",
              "Meanwhile, your physically verified attendees can receive an immediate post-event NPS survey while their positive impressions are fresh, resulting in 3x higher response rates.",
            ],
            takeaway: "Differentiating follow-up messages based on verified attendance preserves brand reputation and boosts engagement.",
          },
        ],
        faqs: [
          {
            q: "Can I see which attendees haven't checked in yet while the event is ongoing?",
            a: "Yes. The live dashboard features a dedicated 'Not Checked In' tab where you can monitor remaining expected guests in real time.",
          },
          {
            q: "Can I export a list of only the attendees who did not show up?",
            a: "Yes. You can filter the attendee list by status 'Not Checked In' and export a dedicated CSV file in one click.",
          },
          {
            q: "Can URPASS automatically send different post-event emails to attendees vs no-shows?",
            a: "Yes. You can configure automated post-event workflows that send thank-you notes to attendees and replay links to absent registrants.",
          },
        ],
        relatedLinks: [
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
          { title: "Event Attendee CSV Export", href: "/event-attendee-data-export", category: "Product" },
          { title: "Event Organizer Dashboard", href: "/event-organizer-dashboard", category: "Product" },
        ],
      }}
    />
  );
}
