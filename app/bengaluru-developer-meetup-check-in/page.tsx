import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, MessageSquare, ScanLine, ShieldCheck, Terminal } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Developer Meetup Check-In Bengaluru | UrPass",
  description: "Organize Bengaluru developer meetups with online registration, attendee approvals, digital passes and quick smartphone QR entry.",
  keywords: ["developer meetup registration bengaluru","bengaluru tech meetup check in","developer community qr passes bangalore","koramangala dev meetup tickets","open source meetup rsvp bengaluru"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-developer-meetup-check-in",
  },
  openGraph: {
    title: "Developer Meetup Check-In Bengaluru | UrPass",
    description: "Organize Bengaluru developer meetups with online registration, attendee approvals, digital passes and quick smartphone QR entry.",
    url: "https://urpass.space/bengaluru-developer-meetup-check-in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Meetup Check-In Bengaluru | UrPass",
    description: "Organize Bengaluru developer meetups with online registration, attendee approvals, digital passes and quick smartphone QR entry.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruDeveloperMeetupCheckInPage() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER MEETUP CHECK-IN",
        h1: "Developer Meetup Registration and QR Check-In in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-developer-meetup-check-in",
        description: "Organize Bengaluru developer meetups with online registration, attendee approvals, digital passes and quick smartphone QR entry.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-developer-meetup-check-in",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Bengaluru Developer Meetups",
        ctaDescription: "Set up RSVP pages with screening questions, deliver QR tickets to WhatsApp, and scan developers at the door in <0.3s with zero hardware rentals.",
        directAnswer: {
        "title": "What is Developer Meetup Registration & Check-In for Bengaluru?",
        "summary": "Developer meetup registration and check-in software in Bengaluru enables technical communities to manage RSVPs, screen applicant profiles (GitHub/tech stack), eliminate no-shows with WhatsApp passes, and verify developers at the door in sub-0.3s. UrPass replaces static spreadsheets with automated capacity management and 0% ticket fees.",
        "keyPoints": [
                "Screen developers with custom questions: GitHub profile, current role, and tech stack",
                "WhatsApp ticket delivery with venue Google Maps links increases show-up rates",
                "Sub-0.3s mobile camera scanning validates attendees at co-working cafe doors",
                "Strict capacity caps prevent venue overcrowding and automatically manage waitlists"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Dev Communities Host Meetups on UrPass",
        "definition": "Bangalore's developer ecosystem hosts hundreds of Rust, Python, Go, Cloud Native, and Web3 meetups monthly across Koramangala, Indiranagar, and HSR Layout. Free RSVP meetups traditionally suffer from 50% drop-off rates.",
        "details": [
                "Interactive WhatsApp tickets ensure developers arrive with their passes ready on their phones",
                "Vetting workflows allow community leads to review applications before issuing entrance passes",
                "Automated seat capping closes RSVPs when cafe or co-working venue capacities are reached",
                "Real-time attendance telemetry tracks verified arrival headcounts for sponsor reporting"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Meetup.com / Google Forms in Bengaluru",
        "subtitle": "Why Bangalore developer community leads switch to UrPass.",
        "headers": [
                "Community Feature",
                "Meetup.com / Google Forms",
                "UrPass Developer Engine"
        ],
        "rows": [
                {
                        "col1": "Attendance Rate",
                        "col2": "High no-show rate (40–60%) with forgotten RSVPs",
                        "col3": "High arrival rate via WhatsApp tickets & calendar sync"
                },
                {
                        "col1": "Developer Screening",
                        "col2": "Anyone can RSVP regardless of experience level",
                        "col3": "Custom intake fields for GitHub, tech stack, and role"
                },
                {
                        "col1": "Door Check-In",
                        "col2": "Manual paper sign-in sheets causing door queues",
                        "col3": "Sub-0.3s phone camera scan via mobile browsers"
                },
                {
                        "col1": "Attendee Data Privacy",
                        "col2": "Platform markets competitor events to your members",
                        "col3": "100% private developer directory, strictly yours"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "COMMUNITY CURATION",
                "title": "Developer Screening with GitHub and Tech Stack Fields",
                "paragraphs": [
                        "Specialized technical meetups (e.g. Kubernetes internals, zero-knowledge proofs, or kernel programming) require attendees with relevant foundational skills to maintain high-quality discussions.",
                        "UrPass allows community hosts to add bespoke technical screening questions. Collect GitHub handles, production frameworks used, and current company roles. Organizers can approve qualified engineers with one click."
                ],
                "bullets": [
                        "Custom text fields, dropdowns, and URL inputs for technical screening",
                        "One-click batch approval allows community leads to admit verified engineers quickly",
                        "Automated acceptance notices dispatched straight to attendee WhatsApp numbers",
                        "Export complete developer rosters to CSV for community member archives"
                ],
                "takeaway": "Developer screening ensures technical meetups maintain high signal."
        },
        {
                "badge": "GATE VELOCITY",
                "title": "Sub-0.3s Smartphone Camera Check-In at Co-Working Venues",
                "paragraphs": [
                        "Tech meetups held at co-working spaces and tech cafes in Koramangala or HSR Layout usually have narrow entryways. Clunky manual check-in lists cause entrance bottlenecks and delay meetup kickoffs.",
                        "With UrPass, community volunteers simply point their mobile camera at the developer's WhatsApp QR pass. The ticket validates in under 300 milliseconds, displaying the attendee's name and company."
                ],
                "bullets": [
                        "No app installation required for volunteers or arriving developers",
                        "Passes include Google Maps venue links, show timings, and Wi-Fi details",
                        "Prevents ticket sharing and unverified drop-ins with atomic token locking",
                        "Manual search by developer name or email provides instant backup check-in"
                ],
                "takeaway": "Sub-0.3s camera check-in moves developers through venue doors instantly."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Terminal,
            title: "Developer Screening Forms",
            desc: "Collect GitHub handles, engineering roles, and tech stack experience during RSVP.",
          },
          {
            icon: MessageSquare,
            title: "WhatsApp Ticket Delivery",
            desc: "Send dynamic QR passes and venue directions directly to attendee WhatsApp chats.",
          },
          {
            icon: ShieldCheck,
            title: "Approval & Waitlist Engine",
            desc: "Curate high-signal meetups with applicant approval queues and automated waitlists.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in developers instantly using phone cameras with zero app downloads.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect paid ticket fees for masterclasses directly with zero platform deductions.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Roster Export",
            desc: "Export verified attendee lists with full contact details and arrival timestamps.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Meetup Page",
                "desc": "Define technical topics, speaker details, venue seat caps, and screening questions."
        },
        {
                "n": "02",
                "title": "Share Registration Link",
                "desc": "Promote your responsive meetup booking page across Twitter, LinkedIn, and Slack."
        },
        {
                "n": "03",
                "title": "Review & Approve",
                "desc": "Review developer applications and approve qualified engineers with one click."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Developers receive dynamic QR tickets via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Door",
                "desc": "Venue staff validate passes in <0.3s with smartphone cameras to welcome attendees."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Developer Meetups in Bengaluru?",
        "subtitle": "Engineering leaders and open-source curators across Karnataka's IT hub.",
        "personas": [
                {
                        "badge": "OPEN SOURCE",
                        "title": "Language & Framework Clubs",
                        "desc": "Host Rust, Go, Python, and React meetups with verified technical screening."
                },
                {
                        "badge": "DEVOPS & CLOUD",
                        "title": "Infrastructure Communities",
                        "desc": "Run Kubernetes, Cloud Native, and SRE technical talks with instant QR entry."
                },
                {
                        "badge": "WEB3 & CRYPTO",
                        "title": "Decentralized Tech Groups",
                        "desc": "Manage token engineering and protocol research workshops with paperless badges."
                },
                {
                        "badge": "AI HACKERS",
                        "title": "Machine Learning Collectives",
                        "desc": "Organize weekend model fine-tuning hack days with automated seat capping."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Functions at Co-Working Venues",
        "subtitle": "Smooth, friendly entrance that preserves your community vibe.",
        "description": "Developers display their digital pass on their smartphone screen or Apple Wallet. The meetup host points their mobile camera at the pass. UrPass validates the registration in under 300 milliseconds, displays the developer's name, and marks them checked in immediately.",
        "points": [
                "Eliminates slow manual searching through printed spreadsheets at crowded cafe doors.",
                "Displays real-time pass validity with attendee name, GitHub handle, and tier.",
                "Prevents unverified guests from dropping into limited-capacity workshops.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why choose UrPass over Meetup.com for Bengaluru developer meetups?",
                "a": "UrPass gives you complete data ownership without marketing competing events to your members, delivers verifiable QR passes directly to WhatsApp, and includes sub-0.3s mobile camera scanning."
        },
        {
                "q": "How does UrPass reduce no-shows at free developer meetups?",
                "a": "UrPass sends verifiable QR passes via WhatsApp and email with calendar attachments (.ics) and Google Maps links, keeping your event top-of-mind and making venue entry effortless."
        },
        {
                "q": "Can I screen developers before issuing tickets?",
                "a": "Yes. You can require organizers to approve registrations before QR passes are dispatched, ensuring only qualified engineers attend advanced technical sessions."
        },
        {
                "q": "Do developers need to install an app to show their ticket?",
                "a": "No. Developers show the QR ticket sent to their WhatsApp or Apple Wallet. Venue volunteers scan passes directly through mobile web browsers."
        },
        {
                "q": "What pricing applies to developer community events?",
                "a": "UrPass offers a transparent software subscription starting from ₹499/month, with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
