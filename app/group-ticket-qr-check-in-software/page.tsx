import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Group QR Ticket Check-In Software | UrPass",
  description: "Manage group event tickets with a shared QR and track admitted and remaining guests. Explore flexible group check-in workflows in UrPass.",
  keywords: ["group ticket qr check in software","group ticket check in partial entry","group qr code ticket scanner","shared qr ticket check in","family ticket check in software","event group pass management"],
  alternates: {
    canonical: "https://urpass.space/group-ticket-qr-check-in-software",
  },
  openGraph: {
    title: "Group QR Ticket Check-In Software | UrPass",
    description: "Manage group event tickets with a shared QR and track admitted and remaining guests. Explore flexible group check-in workflows in UrPass.",
    url: "https://urpass.space/group-ticket-qr-check-in-software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Group QR Ticket Check-In Software | UrPass",
    description: "Manage group event tickets with a shared QR and track admitted and remaining guests. Explore flexible group check-in workflows in UrPass.",
  },
};

export default function GroupTicketQrCheckInSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "GROUP TICKET CHECK-IN",
        h1: "Group Ticket QR Check-In with Partial Entry Tracking",
        canonicalUrl: "https://urpass.space/group-ticket-qr-check-in-software",
        description: "Manage group event tickets with a shared QR and track admitted and remaining guests. Explore flexible group check-in workflows in UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=group-ticket-qr-check-in-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Manage Group Bookings and Staggered Arrivals with Ease",
        ctaDescription: "Allow group members to arrive together or separately. Track admitted and remaining guests live with sub-second phone scanning.",
        directAnswer: {
        "title": "What is Group Ticket QR Check-In with Partial Entry Tracking?",
        "summary": "Group ticket QR check-in software simplifies group bookings (corporate tables, family passes, student delegations) by allowing multiple guests to be admitted under a single booking. Scanners display total allocated passes and admitted guests in real time, recording partial entries when group members arrive separately and blocking excess entries.",
        "keyPoints": [
                "Single booking with multiple allocated passes or individual personalized passes",
                "Partial entry tracking: admit 3 guests now and the remaining 2 guests later on the same booking",
                "Live counter displays total bought, currently admitted, and remaining passes on the scanner screen",
                "Sub-0.3s smartphone camera scanning on volunteer phones with zero hardware rentals"
        ]
},
        whatIs: {
        "title": "Why Traditional Event Scanners Struggle with Group Tickets",
        "definition": "Traditional ticketing platforms treat every QR code as a binary 'all-or-nothing' switch: scanning a 5-person group ticket either admits all 5 people at once or marks the entire ticket used. When family members or corporate colleagues arrive in separate cars, door staff are forced to maintain manual paper margin notes, causing entry errors and duplicate admissions.",
        "details": [
                "UrPass provides two flexible group workflows: Individual Group Passes or Shared Group Pass with Counter",
                "Scanners display a dynamic guest counter: 'Admitted 2 of 5 — 3 remaining'",
                "Volunteers can adjust the headcount being admitted with single-tap plus/minus buttons",
                "Prevents groups from admitting more people than the total passes purchased"
        ]
},
        keyFactsTable: {
        "title": "Standard All-or-Nothing Scanners vs UrPass Partial Group Check-In",
        "subtitle": "How UrPass handles staggered group arrivals at venue entrance doors.",
        "headers": [
                "Operational Scenario",
                "Standard Single-Use Scanners",
                "UrPass Partial Entry Engine"
        ],
        "rows": [
                {
                        "col1": "Staggered Arrivals",
                        "col2": "Entire group ticket is marked 'used' when first member arrives",
                        "col3": "Partial entry supported; remaining count updates live in cloud"
                },
                {
                        "col1": "Excess Admission Risk",
                        "col2": "Door staff rely on memory or paper notes; high fraud risk",
                        "col3": "Automated cap blocks scans once all allocated passes are used"
                },
                {
                        "col1": "Door Staff Controls",
                        "col2": "None; must validate passes individually or refuse staggered guests",
                        "col3": "Single-tap guest counter on scanner: 'Admit 1', 'Admit 2', etc."
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Requires individual booking transactions for each colleague",
                        "col3": "Single corporate invoice with table/delegate headcount allocation"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "PARTIAL ENTRY WORKFLOW",
                "title": "How Staggered Group Arrivals Function at Venue Doors",
                "paragraphs": [
                        "Imagine a company books a 10-person table at an annual industry gala. Two executives arrive at 6:30 PM, five more arrive at 7:00 PM, and the remaining three arrive at 7:30 PM. With standard ticketing software, the first two executives consume the QR code, leaving the remaining eight guests stranded at the door.",
                        "UrPass solves staggered arrivals elegantly. When the first executives present the group pass, the scanner displays: 'Group: Acme Corp (10 Passes) — 0 Admitted'. The door volunteer taps '+2' and confirms. The pass now reflects '2 Admitted, 8 Remaining'. When subsequent colleagues arrive at any entrance, scanners display the updated remaining headcount."
                ],
                "bullets": [
                        "Real-time decrementing guest counter across all venue entrance doors",
                        "Single-tap increment buttons allow door staff to admit 1 to N guests instantly",
                        "Audit trail records the exact timestamp and entrance gate for each partial check-in",
                        "Automated lockout when the remaining guest counter reaches zero"
                ],
                "takeaway": "Partial entry tracking eliminates guest frustration and registration desk logjams."
        },
        {
                "badge": "DEPLOYMENT OPTIONS",
                "title": "Choose Between Individual Sub-Passes or a Unified Group Pass",
                "paragraphs": [
                        "Different events call for different group ticketing structures. A high-security conference may require individual names and photo IDs on every delegate pass, whereas a music festival or corporate picnic may prefer a single master QR code for the entire party.",
                        "UrPass supports both deployment modes. Option 1 issues individualized digital QR passes to each member of the group, sent to their individual WhatsApp or email. Option 2 generates a unified group pass with a live decrementing guest counter managed under the group lead's contact."
                ],
                "bullets": [
                        "Mode 1: Individual passes issued to each group member with distinct QR codes",
                        "Mode 2: Master group pass with live remaining attendee counter",
                        "Corporate table allocation with custom table numbers displayed on passes",
                        "Export complete group check-in rosters showing who arrived at which gate"
                ],
                "takeaway": "Flexible group ticketing adapts to the exact security and logistical needs of your event."
        }
],
        featuresTitle: "Core Capabilities",
        featuresSubtitle: "Engineered to solve your exact operational event challenges.",
        features: [
          {
            icon: Users,
            title: "Partial Group Check-In",
            desc: "Admit group members together or separately with real-time remaining guest counters.",
          },
          {
            icon: ScanLine,
            title: "Single-Tap Headcount Control",
            desc: "Door staff easily tap to admit 1, 2, or more guests from a group booking in milliseconds.",
          },
          {
            icon: ShieldCheck,
            title: "Excess Entry Lockout",
            desc: "Prevent unauthorized admissions once the group's total allocated tickets are exhausted.",
          },
          {
            icon: QrCode,
            title: "Master or Individual Passes",
            desc: "Choose between a unified group pass or separate digital QR passes for each guest.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Sell high-value group packages and corporate tables with 0% platform ticket fees.",
          },
          {
            icon: BarChart3,
            title: "Live Group Telemetry",
            desc: "Track which groups have partially or fully arrived from your central organizer dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Configure Group Tier",
                "desc": "Create group ticket packages (e.g., Table of 10, Family Pass of 4) in UrPass."
        },
        {
                "n": "02",
                "title": "Buyer Books Group",
                "desc": "The group lead completes checkout and receives the master pass or individual tickets."
        },
        {
                "n": "03",
                "title": "First Members Arrive",
                "desc": "Door staff scan the pass, see the allocated count, and tap to admit the arriving guests."
        },
        {
                "n": "04",
                "title": "Remaining Members Arrive",
                "desc": "Subsequent guests present the same pass; the scanner displays updated remaining slots."
        },
        {
                "n": "05",
                "title": "Automatic Cap Enforcement",
                "desc": "Once all slots are consumed, the scanner alerts door staff that the group is fully admitted."
        }
],
        whoShouldUse: {
        "title": "Who Needs Group Ticket QR Check-In?",
        "subtitle": "Organizers hosting events with table bookings, delegations, and family packages.",
        "personas": [
                {
                        "badge": "GALAS",
                        "title": "Charity Galas & Award Banquets",
                        "desc": "Manage corporate table bookings where sponsor guests arrive in separate vehicles."
                },
                {
                        "badge": "CAMPUS",
                        "title": "College Delegations & Teams",
                        "desc": "Admit visiting college symposium contingents and sports teams with partial entry tracking."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Festivals & Concerts",
                        "desc": "Sell bundle passes (Squad Pass of 4) and allow friends to enter at different times."
                },
                {
                        "badge": "CORPORATE",
                        "title": "Corporate Outings & Summits",
                        "desc": "Issue department group passes and monitor employee attendance without paper registers."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Group Check-In Operates on the Scanner Screen",
        "subtitle": "Effortless, intuitive controls designed for fast entrance flow.",
        "description": "When a guest presents a group pass, the scanner screen displays the group lead's name, total passes purchased, and current admitted count (e.g. '3 of 5 admitted'). The volunteer taps '+1' or '+2' based on how many people are entering, validates admission with an audible chime, and decrements the remaining balance live in the cloud.",
        "points": [
                "Volunteers scan on personal smartphones with zero app downloads.",
                "Cloud sync decrements remaining guest counts across all entrance doors instantly.",
                "Audible green chime verifies admission; red alert indicates group is fully checked in.",
                "Door staff can look up groups by booking lead name or email address."
        ]
},
        faqs: [
        {
                "q": "What happens when group members arrive at different times?",
                "a": "UrPass supports partial entry tracking. When the first members arrive, door staff scan the group QR pass and tap to admit the number of people present. The remaining slots update immediately in the cloud, allowing remaining guests to scan the same pass later at any gate."
        },
        {
                "q": "Can I issue separate individual passes to each member of a group?",
                "a": "Yes. During checkout or registration, the buyer can enter individual attendee names and emails. UrPass will generate individual digital QR passes for each attendee, or provide a single master pass if names are not yet known."
        },
        {
                "q": "What prevents a group from admitting more people than they paid for?",
                "a": "UrPass tracks admissions against the group's maximum purchased capacity in real time. Once all allocated passes have been redeemed, any further scan attempt displays an alert indicating that the group booking is already fully admitted."
        },
        {
                "q": "Can group members enter through different gates?",
                "a": "Yes. Because UrPass synchronizes check-in data across all venue doors in real time, partial group admissions update globally across all active volunteer scanners within milliseconds."
        },
        {
                "q": "Does UrPass charge extra for group ticket management?",
                "a": "No. Group ticketing and partial entry tracking are included across all UrPass plans at no extra charge, with 0% platform ticket commissions on paid group sales."
        }
],
      }}
    />
  );
}
