import type { Metadata } from "next";
import { BadgeCheck, BarChart3, Clock, Send, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Group QR Ticket Check-In Software | UrPass",
  description: "Support group passes where multiple guests arrive together or separately using a single shared QR code with remaining scan tracking.",
  keywords: [
    "group qr ticket check in",
    "admit group ticket holders with one qr code",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/group-qr-ticket-check-in" },
  openGraph: {
    title: "Group QR Ticket Check-In Software | UrPass",
    description: "Support group passes where multiple guests arrive together or separately using a single shared QR code with remaining scan tracking.",
    url: "https://urpass.space/group-qr-ticket-check-in",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "GROUP ENTITLEMENTS & SHARED PASSES",
        h1: "Admit Group Ticket Holders with One QR Code",
        canonicalUrl: "https://urpass.space/group-qr-ticket-check-in",
        description: "Support group passes where multiple guests arrive together or separately using a single shared QR code with remaining scan tracking.",
        ctaLabel: "Create Group Passes",
        directAnswer: {
          title: "How Does Group QR Ticket Check-In Work on UrPass?",
          summary: "UrPass supports flexible group tickets where multiple guests are admitted using a single shared QR code. Organizers assign custom scan quotas (e.g. 2, 5, or 10 entries per code). Group members can arrive together or at different times; each scan consumes one entry, displays the remaining quota to gate staff, and denies further entry once the limit is reached.",
          keyPoints: ["Single shared QR pass supporting custom scan quotas (e.g. 2, 5, 10 entries)", "Support for split arrivals: group members can scan in together or at different times", "Clear on-screen remaining scan countdown displayed to gate staff upon each scan", "Automatic admission denial and 'Maximum Limit Reached' alert once the quota is exhausted"],
        },
        keyFactsTable: {
          title: "Group Ticketing Comparison",
          subtitle: "How UrPass manages shared group passes and partial arrivals.",
          headers: ["Group Check-In Capability", "UrPass Group Entitlement Engine", "Traditional Single-Scan Tickets"],
          rows: [
            {
                        "col1": "Split Arrival Support",
                        "col2": "Guests can arrive separately with the same shared QR",
                        "col3": "Entire group must wait outside and arrive together"
            },
            {
                        "col1": "Remaining Quota Feedback",
                        "col2": "Displays 'Entry 1 of 5 (4 Remaining)' on scanner screen",
                        "col3": "No remaining counter; binary valid or invalid only"
            },
            {
                        "col1": "Max Limit Enforcement",
                        "col2": "Blocks entry immediately once scan limit is reached",
                        "col3": "Prone to admitting excess guests or locking out valid ones"
            },
            {
                        "col1": "Pass Forwarding",
                        "col2": "Original recipient can forward WhatsApp pass to family",
                        "col3": "Requires re-issuing new individual tickets with customer service"
            },
            {
                        "col1": "Total Capacity Accounting",
                        "col2": "Each group scan decrements global venue capacity",
                        "col3": "Group counted as 1 entry, breaking statutory venue limits"
            }
],
        },
        features: [
          { icon: Users, title: "Custom Group Scan Limits", desc: "Assign individual entry quotas (e.g. 2 entries for couples, 5 for families, 10 for corporate teams)." },
          { icon: Clock, title: "Flexible Staggered Arrivals", desc: "Group members can arrive at different times and entrance gates without having to coordinate arrival." },
          { icon: BadgeCheck, title: "Remaining Quota Counter", desc: "Scanner display clearly shows used entries, remaining admissions, and original recipient name." },
          { icon: ShieldCheck, title: "Strict Quota Cutoff", desc: "When the final entry is used, subsequent scan attempts trigger a bold 'Maximum Limit Reached' warning." },
          { icon: Send, title: "WhatsApp Pass Forwarding", desc: "The primary recipient can forward their WhatsApp pass to family members with zero technical friction." },
          { icon: BarChart3, title: "Live Group Telemetry", desc: "Track how many groups have checked in partially versus those who have exhausted their full entitlement." }
        ],
        steps: [
          { n: "01", title: "Configure Group Quotas", desc: "Set maximum scan allowances (e.g., 2, 5, or 10 entries) when creating tickets or importing guests." },
          { n: "02", title: "Dispatch Group Pass", desc: "The primary guest receives a single high-contrast QR pass on WhatsApp or email." },
          { n: "03", title: "First Guest Arrives", desc: "First group member scans the pass; scanner admits them and shows remaining guest spots." },
          { n: "04", title: "Later Guests Scan", desc: "Remaining friends or family arrive later and scan the same pass; counter decrements." },
          { n: "05", title: "Quota Exhaustion", desc: "Once the configured quota is reached, any further scan attempt is denied with clear audio feedback." }
        ],
        callout: {
          badge: "FRICTIONLESS FAMILIES",
          title: "Never force families or corporate colleagues to wait outside in the rain.",
          description: "Traditional ticketing systems force groups to stand outside until every member arrives so they can enter together. UrPass allows guests to arrive at their own pace using a single shared pass.",
          bullets: ["Family members and colleagues can enter independently without waiting outside", "Gate marshals see exact remaining spots on their smartphone screen", "Prevents gatecrashers by strictly blocking entry once the quota is exhausted", "Integrates seamlessly with total venue capacity tracking"],
        },
        faqs: [
          { q: "Can people in the same group arrive at different times?", a: "Yes! Group members can arrive hours apart. Each scan admits one person, decrements the remaining count, and admits subsequent members until the quota is exhausted." },
          { q: "What does the scanner show when the maximum limit is reached?", a: "The scanner flashes a bright red screen with an error tone stating 'Maximum Limit Reached — 0 Entries Remaining'." },
          { q: "Can the original recipient forward the pass to their friends via WhatsApp?", a: "Yes. The recipient can easily forward the WhatsApp message or pass link to their group members." },
          { q: "Does a group pass of 5 count as 5 people against our 300 capacity limit?", a: "Yes. UrPass decrements 5 admissions from your global event capacity, ensuring the venue never exceeds statutory limits." }
        ],
        relatedLinks: [
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "WhatsApp Event Tickets", href: "/whatsapp-event-tickets", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" },
          { title: "Bulk Attendee CSV Import", href: "/event-attendee-csv-import", category: "Product" }
        ],
      }}
    />
  );
}
