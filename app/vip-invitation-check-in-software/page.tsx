import type { Metadata } from "next";
import { BadgeCheck, BarChart3, Lock, Send, ShieldCheck, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "VIP Invitation and QR Check-In Software | UrPass",
  description: "Deliver exclusive digital VIP passes with priority lane check-in, instant organizer notifications, and real-time VIP attendance tracking.",
  keywords: [
    "vip invitation check in software",
    "manage vip guest invitations and priority check-in",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/vip-invitation-check-in-software" },
  openGraph: {
    title: "VIP Invitation and QR Check-In Software | UrPass",
    description: "Deliver exclusive digital VIP passes with priority lane check-in, instant organizer notifications, and real-time VIP attendance tracking.",
    url: "https://urpass.space/vip-invitation-check-in-software",
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
        badge: "WHITE-GLOVE VIP OPERATIONS",
        h1: "Manage VIP Guest Invitations and Priority Check-In",
        canonicalUrl: "https://urpass.space/vip-invitation-check-in-software",
        description: "Deliver exclusive digital VIP passes with priority lane check-in, instant organizer notifications, and real-time VIP attendance tracking.",
        ctaLabel: "Create VIP Invitation Flow",
        directAnswer: {
          title: "How Does VIP Invitation and Check-In Work on UrPass?",
          summary: "UrPass provides white-glove invitation and gate management for celebrities, corporate executives, dignitaries, and sponsors. Guests receive personalized, encrypted VIP passes with dedicated priority lane routing. When a VIP scans in, event directors and executive hosts receive instant arrival alerts to greet them personally.",
          keyPoints: ["Encrypted, non-transferable VIP passes delivered via WhatsApp and email", "Dedicated priority fast-track lane scanning with custom on-screen dignitary greetings", "Instant SMS/WhatsApp/Webhook notifications to event coordinators upon VIP scan", "Private executive lounge and restricted backstage access control"],
        },
        keyFactsTable: {
          title: "VIP Operations Comparison",
          subtitle: "Elevating the high-stakes guest experience.",
          headers: ["VIP Management Capability", "UrPass White-Glove System", "Paper Guest Lists & Manual Ushers"],
          rows: [
            {
                        "col1": "Arrival Alert to Host",
                        "col2": "Instant automated alert the second pass is scanned",
                        "col3": "Radio calls or delayed whispers between ushers"
            },
            {
                        "col1": "Entrance Processing Time",
                        "col2": "<0.3s frictionless phone scan",
                        "col3": "Awkward 60-second searches on alphabetical paper lists"
            },
            {
                        "col1": "Pass Transfer / Screenshot Theft",
                        "col2": "Atomic token invalidation prevents pass sharing",
                        "col3": "Name dropping allows unauthorized gatecrashers"
            },
            {
                        "col1": "Restricted Zone Access",
                        "col2": "Scanner validates VIP vs Green Room vs Stage Access",
                        "col3": "Multiple color wristbands causing guest annoyance"
            },
            {
                        "col1": "Privacy Protection",
                        "col2": "Dignitary phone and details shielded from gate volunteers",
                        "col3": "Private phone numbers printed on open clipboard rosters"
            }
],
        },
        features: [
          { icon: BadgeCheck, title: "Dedicated Priority Lanes", desc: "Route high-profile attendees through private entrance lanes with zero wait time." },
          { icon: Sparkles, title: "Custom Dignitary Greetings", desc: "Scanner display flashes a personalized welcome screen with the guest's honorific title and seating." },
          { icon: Send, title: "Instant Host Notifications", desc: "Send real-time alerts to concierge teams and executive hosts the exact second a VIP arrives." },
          { icon: Lock, title: "Backstage & Lounge Validation", desc: "Re-scan VIP passes at green rooms, executive hospitality suites, and reserved seating areas." },
          { icon: ShieldCheck, title: "Anti-Duplication Security", desc: "Single-use cryptographic pass tokens ensure VIP passes cannot be forwarded or duplicated." },
          { icon: BarChart3, title: "VIP Roster Telemetry", desc: "Live executive dashboard showing which keynote speakers, sponsors, and dignitaries have arrived." }
        ],
        steps: [
          { n: "01", title: "Import VIP List", desc: "Upload VIP attendee records with titles (Dr., Minister, CEO, Ambassador) and special notes." },
          { n: "02", title: "Dispatch Bespoke Passes", desc: "Deliver personalized digital passes via WhatsApp or custom high-touch email." },
          { n: "03", title: "Designate VIP Gates", desc: "Assign specific smartphone scanners to priority lanes and executive entrances." },
          { n: "04", title: "Sub-Second VIP Entry", desc: "Concierge scans pass in <0.3s; scanner displays greeting and designated table number." },
          { n: "05", title: "Host Welcomes Guest", desc: "Executive director receives arrival notification and steps forward to welcome the dignitary." }
        ],
        callout: {
          badge: "WHITE-GLOVE CONCIERGE",
          title: "Never keep a keynote speaker, sponsor, or celebrity waiting at your door.",
          description: "Making a prominent sponsor or celebrity wait while an usher searches through a messy paper list is an event organizer's worst nightmare. UrPass ensures instant, dignified admission.",
          bullets: ["Zero-friction arrival flow honoring high-status attendees", "Instant alerts ensure hospitality leads are in position before the guest walks in", "Shield VIP contact details from temporary event staff", "Accurate live attendance for security detail and executive protocols"],
        },
        faqs: [
          { q: "Can the scanner show table numbers or reserved seating upon scanning?", a: "Yes! UrPass can display custom attendee attributes—including table number, escort name, and dietary preferences—on the scanner screen." },
          { q: "Can we prevent VIP passes from being shared or transferred?", a: "Yes. Each pass is cryptographically signed and single-use. Once scanned, any duplicate attempt is immediately rejected with red alert feedback." },
          { q: "Can our event director get an automated WhatsApp message when a specific VIP arrives?", a: "Yes. Real-time webhooks and notification integrations allow instant automated alerts to designated staff upon specific VIP check-ins." },
          { q: "Can VIP passes be used to access both the main hall and the VIP lounge?", a: "Yes. UrPass supports multi-zone access control so one pass grants entry to the main venue and restricted hospitality lounges." }
        ],
        relatedLinks: [
          { title: "Product Launch Guest Registration", href: "/product-launch-guest-registration", category: "Product" },
          { title: "Event Registration Approval Workflow", href: "/event-registration-approval-workflow", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Conference Badge Scanning Software", href: "/conference-badge-scanning-software", category: "Product" }
        ],
      }}
    />
  );
}
