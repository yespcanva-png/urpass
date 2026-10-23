import type { Metadata } from "next";
import { BarChart3, Cpu, CreditCard, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Electronic City Event Registration | UrPass",
  description: "Organize tech meetups and developer sessions in Electronic City with registration forms, digital passes and smartphone check-in.",
  keywords: ["tech event registration electronic city","electronic city bangalore tech ticketing","ecity developer conference passes","phase 1 tech meetup registration","phase 2 hackathon passes"],
  alternates: {
    canonical: "https://urpass.space/electronic-city-tech-event-registration",
  },
  openGraph: {
    title: "Electronic City Event Registration | UrPass",
    description: "Organize tech meetups and developer sessions in Electronic City with registration forms, digital passes and smartphone check-in.",
    url: "https://urpass.space/electronic-city-tech-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electronic City Event Registration | UrPass",
    description: "Organize tech meetups and developer sessions in Electronic City with registration forms, digital passes and smartphone check-in.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function ElectronicCityTechEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "ELECTRONIC CITY TECH TICKETING",
        h1: "Tech Event Registration Software for Electronic City",
        canonicalUrl: "https://urpass.space/electronic-city-tech-event-registration",
        description: "Tech event and conference registration for Electronic City Bangalore. Digital QR entry passes, team passes, live gate scanning, and direct payments.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=electronic-city-tech-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Your Electronic City Tech Event",
        ctaDescription: "Launch developer summits, technical hackathons, and engineering seminars in Electronic City with direct UPI payments and sub-second QR check-in.",
        directAnswer: {
        "title": "What is Tech Event Registration for Electronic City?",
        "summary": "Tech event registration in Electronic City streamlines ticketing, team registrations, and gate check-in for developer conferences, hackathons, and corporate seminars across Phase 1 and Phase 2 tech campuses. UrPass eliminates 5% to 8% platform commissions, settles payments directly via Razorpay UPI, and verifies digital QR passes in under 0.3s.",
        "keyPoints": [
                "Tailored for Electronic City Phase 1 and Phase 2 technology campuses and auditoriums",
                "Team bundle ticketing allows engineering leads to register multiple engineers at once",
                "Direct UPI and credit card settlement via Razorpay with 0% platform ticket commission",
                "Sub-0.3s smartphone camera scanning that works seamlessly across multiple campus gates"
        ]
},
        whatIs: {
        "title": "Why Electronic City Tech Organizers Run on UrPass",
        "definition": "As Bangalore's pioneering electronics and software hub, Electronic City hosts thousands of engineers attending technical conferences, open-source sprints, and industry expos. UrPass provides an agile ticketing engine built for technical teams.",
        "details": [
                "0% ticket commission—pay a flat monthly subscription instead of losing thousands to ticketing brokers",
                "Custom technical registration fields: GitHub profile, tech stack, and T-shirt sizes",
                "Instant WhatsApp and Apple Wallet pass delivery for fast morning auditorium entry",
                "Offline-resilient scanner that keeps validating passes even during campus Wi-Fi drops"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Platforms in Electronic City",
        "subtitle": "Compare UrPass with traditional ticketing platforms for E-City tech events.",
        "headers": [
                "Operational Feature",
                "Traditional Ticketing Platforms",
                "UrPass E-City Tech Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on every developer pass sold",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Team Ticketing",
                        "col2": "Requires individual signups for each engineer",
                        "col3": "Team packages with automated multi-pass dispatch"
                },
                {
                        "col1": "Morning Scan Latency",
                        "col2": "2 to 4 seconds per attendee with manual check-in",
                        "col3": "Sub-0.3s camera check-in via any smartphone"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Payouts delayed 7 to 14 days after the event",
                        "col3": "Direct settlement into your Razorpay account"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "TEAM REGISTRATION",
                "title": "Effortless Team and Group Passes for Engineering Squads",
                "paragraphs": [
                        "Technology events in Electronic City frequently welcome entire engineering squads attending from nearby software campuses. Traditional registration portals require individual form submissions for each engineer, causing high drop-off rates.",
                        "UrPass provides flexible team ticket packages. Engineering managers can purchase multi-seat bundles in a single UPI transaction, enter delegate emails, and each team member immediately receives their personalized digital QR pass."
                ],
                "bullets": [
                        "Group discounts and multi-seat tiers configured in seconds",
                        "Automated dispatch of personalized QR credentials to each team member",
                        "Custom intake questions for developer roles, tech stacks, and dietary preferences",
                        "Automated corporate GST tax invoices for seamless team expense claims"
                ],
                "takeaway": "Team ticketing simplifies group corporate signups and boosts developer attendance."
        },
        {
                "badge": "GATE SPEED",
                "title": "Sub-0.3s Smartphone Camera Check-In Across Campus Auditoriums",
                "paragraphs": [
                        "When morning conference registration opens at Electronic City auditoriums, long lines outside registration booths quickly frustrate attendees and delay keynote sessions.",
                        "UrPass turns any volunteer or security guard's smartphone into a lightning-fast QR scanner. Opening the scanner link in mobile Safari or Chrome enables camera scanning that verifies passes in under 300 milliseconds."
                ],
                "bullets": [
                        "No proprietary scanner rental fees or specialized barcode hardware required",
                        "Real-time duplicate ticket detection prevents pass sharing across campus wings",
                        "Offline ticket caching ensures continuous validation even with patchy basement network",
                        "Live headcount analytics track morning check-in velocity in real time"
                ],
                "takeaway": "Mobile camera scanning eliminates lobby queues and gets developers into keynotes faster."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Cpu,
            title: "Developer Tiering",
            desc: "Configure Student, General Developer, VIP Speaker, and Hackathon passes easily.",
          },
          {
            icon: CreditCard,
            title: "0% Commission with Razorpay",
            desc: "Connect your Razorpay account for direct UPI payments with zero platform ticket fees.",
          },
          {
            icon: QrCode,
            title: "Digital QR Passes",
            desc: "Send dynamic QR tickets instantly via WhatsApp, Apple Wallet, and email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Scanning",
            desc: "Scan and validate passes instantly on any standard iOS or Android phone browser.",
          },
          {
            icon: Users,
            title: "Team Ticket Bundles",
            desc: "Enable tech teams to register multiple engineers in a single frictionless checkout.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Metrics",
            desc: "Monitor gate check-in flow, peak arrival windows, and no-show stats live.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Tech Event Page",
                "desc": "Define keynote tracks, developer ticket tiers, group packages, and custom intake fields."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your responsive registration page with tech communities and campus networks."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Campus Doors",
                "desc": "Event staff scan passes in <0.3s with smartphone cameras for rapid auditorium entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Electronic City Tech Events?",
        "subtitle": "Event producers across South Bangalore's premier technology corridor.",
        "personas": [
                {
                        "badge": "DEVELOPERS",
                        "title": "Developer Conferences & Summits",
                        "desc": "Host technical summits on AI, Cloud, DevOps, and Full-Stack engineering."
                },
                {
                        "badge": "HACKATHONS",
                        "title": "College & Enterprise Hackathons",
                        "desc": "Manage team check-ins, mentor credentials, and 24-hour campus gate access."
                },
                {
                        "badge": "TECH MEETUPS",
                        "title": "Open-Source Meetups",
                        "desc": "Run evening tech talks and weekend developer workshops with instant QR entry."
                },
                {
                        "badge": "CAMPUS CONCLAVES",
                        "title": "Corporate Engineering Days",
                        "desc": "Coordinate internal tech expos, innovation fairs, and hack days across E-City campuses."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Works at Electronic City Venues",
        "subtitle": "Fast, seamless campus ingress powered by mobile camera scanning.",
        "description": "Delegates display their digital pass on their smartphone screen or Apple Wallet. Registration staff point their mobile camera at the QR code. UrPass verifies the ticket in under 300 milliseconds, displays the attendee's name and ticket tier, and logs the check-in immediately.",
        "points": [
                "Eliminates slow manual searching through printed alphabetical attendee lists.",
                "Displays real-time pass validity with attendee name, designation, and tier.",
                "Prevents duplicate entry attempts across multiple campus gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why is UrPass suitable for Electronic City tech conferences?",
                "a": "UrPass is engineered for tech-savvy audiences demanding instant registration, paperless WhatsApp QR ticketing, and rapid mobile gate scanning without cumbersome app downloads or hardware rentals."
        },
        {
                "q": "Can we issue group passes for engineering teams in Electronic City?",
                "a": "Yes. UrPass supports group and team ticketing tiers where team leads can register multiple engineers in a single transaction, automatically dispatching personalized QR badges to each delegate."
        },
        {
                "q": "Does UrPass take a percentage of our tech summit ticket sales?",
                "a": "No. UrPass charges 0% commission on ticket sales. You pay a transparent monthly subscription (plans from ₹499/mo) and connect your own Razorpay account."
        },
        {
                "q": "Can gate volunteers check in attendees if campus Wi-Fi fluctuates?",
                "a": "Yes. The UrPass web scanner features offline-resilient local caching that continues validating QR passes smoothly during intermittent network connectivity."
        },
        {
                "q": "Can delegates add their conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Delegates can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
