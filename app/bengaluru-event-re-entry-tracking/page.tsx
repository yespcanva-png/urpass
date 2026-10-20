import type { Metadata } from "next";
import { BarChart3, FileSpreadsheet, LogOut, Repeat, ScanLine, ShieldAlert } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Re-Entry Tracking Bengaluru | UrPass",
  description: "Explore entry, exit and re-entry tracking for Bengaluru events using QR-based attendee records and configurable check-in workflows.",
  keywords: ["event re-entry tracking bengaluru","event exit scanning bangalore","track attendee entry exit bengaluru","re-entry pass qr code bangalore","live in-venue headcount tracking"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-event-re-entry-tracking",
  },
  openGraph: {
    title: "Event Re-Entry Tracking Bengaluru | UrPass",
    description: "Explore entry, exit and re-entry tracking for Bengaluru events using QR-based attendee records and configurable check-in workflows.",
    url: "https://urpass.space/bengaluru-event-re-entry-tracking",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Re-Entry Tracking Bengaluru | UrPass",
    description: "Explore entry, exit and re-entry tracking for Bengaluru events using QR-based attendee records and configurable check-in workflows.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEventReEntryTrackingPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT RE-ENTRY & EXIT TRACKING",
        h1: "Track Event Entry, Exit and Re-Entry in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-event-re-entry-tracking",
        description: "Explore entry, exit and re-entry tracking for Bengaluru events using QR-based attendee records and configurable check-in workflows.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-event-re-entry-tracking",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Manage Event Ingress, Egress & Re-Entry",
        ctaDescription: "Control venue perimeter access with configurable entry, exit, and re-entry scanning. Monitor active in-venue headcounts and prevent pass pass-backs.",
        directAnswer: {
        "title": "How to Track Event Entry, Exit, and Re-Entry in Bengaluru?",
        "summary": "Tracking event entry, exit, and re-entry in Bengaluru requires configurable scan modes that log when attendees leave the venue perimeter (for lunch, smoking, or parking) and re-verify their credentials upon return. UrPass provides dual entry/exit scanning on mobile phones, live in-venue headcounts, and pass-back fraud prevention with 0% ticket fees.",
        "keyPoints": [
                "Configurable scanner modes: Entry Mode, Exit Scan Mode, and Re-Entry Verification",
                "Live in-venue occupancy tracking: monitor exact active headcounts inside the venue",
                "Prevents pass-backs: attendees cannot re-enter unless an authorized exit was logged",
                "Sub-0.3s smartphone camera scanning on standard iOS and Android mobile browsers"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Producers Need Re-Entry Controls",
        "definition": "At multi-hour conferences, trade exhibitions, and outdoor festivals in Bengaluru, attendees frequently step outside for lunch, phone calls, or parking. Traditional hand stamps are easily forged or washed off, while open re-entry invites ticket pass-backs.",
        "details": [
                "Replace physical ink hand stamps with tamper-proof digital QR re-entry validation",
                "Accurate live occupancy: know exactly how many people are currently inside the hall",
                "Block pass-backs: an attendee cannot hand their phone to an outsider while inside the venue",
                "Full audit trail: export timestamps for every attendee entry, exit, and re-entry"
        ]
},
        keyFactsTable: {
        "title": "UrPass Digital Re-Entry vs Ink Hand Stamps",
        "subtitle": "Why Bengaluru event security teams switch to UrPass digital re-entry.",
        "headers": [
                "Security Dimension",
                "Ink Hand Stamps & Paper Passes",
                "UrPass Digital Re-Entry Engine"
        ],
        "rows": [
                {
                        "col1": "Fraud Prevention",
                        "col2": "Vulnerable: stamps copied or transferred to friends",
                        "col3": "Tamper-proof: cryptographic token verified on exit & re-entry"
                },
                {
                        "col1": "In-Venue Headcount",
                        "col2": "Unknown; organizers have zero visibility into departures",
                        "col3": "Live in-venue active headcount updated in real time"
                },
                {
                        "col1": "Door Staff Speed",
                        "col2": "Messy stamping stations with ink smudging",
                        "col3": "Sub-0.3s camera scan on attendee's existing QR pass"
                },
                {
                        "col1": "Audit Logging",
                        "col2": "Zero record of who left and who returned",
                        "col3": "Immutable server timestamps for every entry and exit"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "PASS-BACK DEFENSE",
                "title": "Prevent Pass-Backs with Exit-and-Return Verification",
                "paragraphs": [
                        "A major security loophole at Bangalore events is ticket pass-backs: an attendee enters the venue, goes to the perimeter fence, and passes their digital ticket screenshot to an unregistered friend waiting outside.",
                        "UrPass eliminates this vulnerability through stateful re-entry logic. A ticket must be scanned out at an exit gate before it can be scanned back in at an entry gate. If an attempt is made to scan a ticket that is already recorded as inside the venue, the scanner instantly flags a pass-back violation."
                ],
                "bullets": [
                        "Stateful attendance lifecycle: Registered → Checked-In → Exited → Re-Admitted",
                        "Scanner alerts staff if a ticket attempts entry without prior logged exit",
                        "Color-coded visual alerts (Blue for exit logged, Green for valid re-entry)",
                        "Prevents perimeter pass-backs and unauthorized venue drop-ins"
                ],
                "takeaway": "Stateful entry-exit scanning completely prevents perimeter ticket pass-backs."
        },
        {
                "badge": "OCCUPANCY SAFETY",
                "title": "Live Active Occupancy Telemetry for Venue Fire Safety",
                "paragraphs": [
                        "Convention centers and banquet halls across Bangalore enforce strict active occupancy limits set by local municipal and fire safety authorities. Counting only total morning check-ins does not reflect how many delegates have left for the day.",
                        "UrPass provides dual entry and exit scanning. As delegates exit the venue, staff scan their pass in 'Exit Mode'. The central dashboard automatically decrements the active headcount, providing real-time compliance tracking."
                ],
                "bullets": [
                        "Real-time active in-venue headcount updated with every entrance and exit scan",
                        "Visual fire capacity gauge alerts organizers when approaching venue limits",
                        "Track delegate dwell time: measure how long attendees stay at your conference",
                        "Export complete ingress and egress audit logs to CSV for venue management"
                ],
                "takeaway": "Exit scanning provides true active in-venue headcounts for fire safety compliance."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Repeat,
            title: "Stateful Re-Entry Logic",
            desc: "Require an exit scan before re-entry to stop perimeter pass-backs and ticket sharing.",
          },
          {
            icon: LogOut,
            title: "Exit Scan Mode",
            desc: "Switch scanner to 'Exit Mode' with one tap to log departures and decrement headcounts.",
          },
          {
            icon: BarChart3,
            title: "Live Active Headcount",
            desc: "Monitor true real-time active in-venue capacity versus checked-out attendees.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and validate passes in <0.3s on standard smartphone cameras on mobile browsers.",
          },
          {
            icon: ShieldAlert,
            title: "Pass-Back Detection",
            desc: "Alerts security staff if a ticket attempts to enter without a recorded exit.",
          },
          {
            icon: FileSpreadsheet,
            title: "Dwell Time CSV Reports",
            desc: "Export attendance duration logs showing exact entry and exit timestamps per guest.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Enable Re-Entry Mode",
                "desc": "Toggle entry and exit tracking in your UrPass event settings."
        },
        {
                "n": "02",
                "title": "Scan Morning Entry",
                "desc": "Staff scan passes in 'Entry Mode' as delegates arrive for the keynote."
        },
        {
                "n": "03",
                "title": "Scan at Exit Gates",
                "desc": "Staff at exit doors scan passes in 'Exit Mode' when guests leave for lunch."
        },
        {
                "n": "04",
                "title": "Validate Re-Entry",
                "desc": "Returning guests scan in <0.3s; system verifies prior exit and re-admits."
        },
        {
                "n": "05",
                "title": "Review Occupancy Logs",
                "desc": "Download verified attendee dwell time and exit timestamps with one click."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Re-Entry Tracking in Bengaluru?",
        "subtitle": "Event directors and venue security leads across Karnataka.",
        "personas": [
                {
                        "badge": "FESTIVALS",
                        "title": "All-Day Music Festivals",
                        "desc": "Manage re-entry for attendees visiting food trucks and parking lots without hand stamps."
                },
                {
                        "badge": "EXPOS",
                        "title": "Industrial & Trade Expos",
                        "desc": "Track buyer ingress and egress across multi-building exhibition grounds at BIEC."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "Full-Day Tech Summits",
                        "desc": "Monitor active in-venue headcounts during lunch breaks and afternoon sessions."
                },
                {
                        "badge": "SPORTS",
                        "title": "Stadium & Sports Tournaments",
                        "desc": "Control spectator perimeter re-entry and prevent ticket sharing at arena gates."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Re-Entry Scanning Works at the Gate",
        "subtitle": "Seamless digital validation that replaces messy ink hand stamps.",
        "description": "When an attendee leaves the venue, gate staff scan their pass in 'Exit Mode', logging their departure. When the attendee returns, the entry scanner checks that an exit was recorded, admits them in under 300 milliseconds, and marks them active inside the venue once again.",
        "points": [
                "Eliminates messy ink stamps that wash off or smudge on clothing.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents unrecorded tickets from entering through re-entry lanes.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass handle event re-entry in Bengaluru?",
                "a": "UrPass allows organizers to deploy scanners in 'Exit Mode' at departure doors. When attendees leave, their pass is scanned out. When they return, the entrance scanner confirms their prior exit and re-admits them in <0.3s."
        },
        {
                "q": "Can attendees share their ticket with an outsider to get them in?",
                "a": "No. Because the ticket must be scanned out before it can be scanned in, an attendee inside the venue cannot pass their ticket to an outsider without tripping an immediate pass-back violation."
        },
        {
                "q": "Does exit scanning update the live headcount on the organizer dashboard?",
                "a": "Yes. Exit scanning automatically decrements the in-venue active headcount, giving organizers real-time visibility into how many people are currently inside the venue."
        },
        {
                "q": "Do gate staff need separate hardware for exit scanning?",
                "a": "No. Any volunteer smartphone can toggle between 'Entry Mode' and 'Exit Mode' with a single tap inside their mobile browser."
        },
        {
                "q": "What pricing applies to re-entry tracking on UrPass?",
                "a": "Re-entry and exit tracking are included on all UrPass plans, starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees."
        }
],
      }}
    />
  );
}
