import type { Metadata } from "next";
import { Laptop, Layers, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Registration Bangalore | UrPass",
  description: "Manage hackathon applications, participant details, approvals and event-day QR check-in for Bangalore hackathons.",
  keywords: ["bangalore hackathon registration system","hackathon registration software bangalore","bengaluru developer hackathon check in","hackathon team registration software bangalore","qr code pass for hackathon bangalore"],
  alternates: {
    canonical: "https://urpass.space/bangalore-hackathon-registration-system",
  },
  openGraph: {
    title: "Hackathon Registration Bangalore | UrPass",
    description: "Manage hackathon applications, participant details, approvals and event-day QR check-in for Bangalore hackathons.",
    url: "https://urpass.space/bangalore-hackathon-registration-system",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Registration Bangalore | UrPass",
    description: "Manage hackathon applications, participant details, approvals and event-day QR check-in for Bangalore hackathons.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreHackathonRegistrationSystemPage() {
  return (
    <SEOPage
      config={{
        badge: "BANGALORE HACKATHONS",
        h1: "Hackathon Registration and Attendance System in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-hackathon-registration-system",
        description: "Manage hackathon applications, participant details, approvals and event-day QR check-in for Bangalore hackathons.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-hackathon-registration-system",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Your Next 24-48 Hour Bangalore Hackathon",
        ctaDescription: "Review developer applications, manage team registrations, issue encrypted hacker badges, and track on-site meal checkpoints.",
        directAnswer: {
        "title": "What is the Best Hackathon Registration System in Bangalore?",
        "summary": "UrPass is a dedicated hackathon registration and attendance system engineered for Bangalore developer hackathons. It collects participant applications, captures GitHub and portfolio links, approves hacker teams, issues encrypted digital QR passes, and tracks on-site check-in, midnight meals, and swag distribution across 24-48 hour builds.",
        "keyPoints": [
                "Developer application forms capturing GitHub, LinkedIn, tech stack, and portfolio links",
                "Application screening and one-click batch approval workflows for hacker teams",
                "Encrypted digital QR hacker passes delivered via WhatsApp and transactional email",
                "Sub-0.3 second smartphone camera scanning for door entry, meal tracking, and swag distribution"
        ]
},
        whatIs: {
        "title": "Why Bangalore Hackathon Organizers Choose UrPass",
        "definition": "Bangalore hosts more developer hackathons than any other city in India. Managing 500+ hackers across a 36-hour weekend requires specialized software that handles team applications, multiple meal checkpoints, and strict venue access control.",
        "details": [
                "Eliminates messy Google Sheets and manual discord/email coordination",
                "Provides multi-checkpoint scanning on a single attendee QR badge (Entry, Dinner, Midnight Snack, Breakfast)",
                "Prevents duplicate admissions and meal pass sharing with database-level atomic locking",
                "Empowers student and developer volunteers to scan passes on personal smartphones"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Google Forms & Paper Tokens for Bangalore Hackathons",
        "subtitle": "Why hackathon organizing committees switch to UrPass for on-site operations.",
        "headers": [
                "Operational Requirement",
                "Google Forms + Paper Tokens",
                "UrPass Hackathon System"
        ],
        "rows": [
                {
                        "col1": "Application Review",
                        "col2": "Clunky spreadsheet rows with unformatted developer links",
                        "col3": "Structured applicant review dashboard with one-click approvals"
                },
                {
                        "col1": "Gate Check-In Speed",
                        "col2": "Slow manual name lookups causing 1-hour queues in lobby",
                        "col3": "Sub-0.3s smartphone camera scanning clearing 500 hackers in 10 min"
                },
                {
                        "col1": "Meal & Swag Tracking",
                        "col2": "Paper meal tokens or messy pen tick-sheets that get lost",
                        "col3": "Single hacker QR pass reusable across meals with atomic locks"
                },
                {
                        "col1": "Team Management",
                        "col2": "Fragmented entries where team members register separately",
                        "col3": "Unified team registration grouping hackers under one team identity"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SELECTION & REVIEW",
                "title": "Developer Profile Screening and One-Click Team Approvals",
                "paragraphs": [
                        "Popular Bangalore hackathons frequently receive 3x to 5x more applications than venue space allows. Organizing teams need a streamlined review interface to evaluate candidate technical experience, review GitHub repositories, and verify diversity targets before issuing admission passes.",
                        "UrPass provides an intuitive applicant review dashboard. Organizers can filter applicants by track (Web3, AI, Fintech, Mobile), review project links, assign evaluation scores, and approve individual hackers or entire teams with one click. Approved hackers automatically receive their digital pass and Discord/Slack onboarding instructions."
                ],
                "bullets": [
                        "Collect GitHub profiles, portfolio links, and technical skill tags during signup",
                        "One-click batch approval with automated acceptance and waitlist emails",
                        "Team grouping ensures all members of an approved team receive passes together",
                        "Custom screening questions for dietary requirements, t-shirt size, and travel grant needs"
                ],
                "takeaway": "Streamlined applicant screening saves organizers days of spreadsheet triage."
        },
        {
                "badge": "MEAL CHECKPOINTS",
                "title": "Multi-Checkpoint Tracking: Entrance, Meals, and Swag Distribution",
                "paragraphs": [
                        "A hackathon is not a single check-in event. Across 24 to 48 hours, organizers must manage initial venue entrance, multiple meal servings (lunch, dinner, midnight energy drinks, breakfast), and hardware kit distribution. Uncontrolled meal lines lead to food shortages and budget overruns.",
                        "UrPass allows organizers to configure multi-checkpoint scanning on a single attendee QR badge. Volunteers assign their smartphone scanner to 'Dinner' or 'Hardware Kit'. When a hacker scans their pass, the system logs the meal and prevents that pass from being scanned again for that specific meal session."
                ],
                "bullets": [
                        "Multi-session checkpoint tracking: Venue Entry, Lunch, Dinner, Midnight Snack, Swag",
                        "Atomic row locking prevents hackers from claiming multiple meals on one pass",
                        "Volunteers use their personal smartphones with zero hardware rentals",
                        "Real-time food count telemetry prevents catering waste and shortages"
                ],
                "takeaway": "Single-badge multi-session scanning keeps meal and swag distributions organized and fair."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Laptop,
            title: "Developer Profile Collection",
            desc: "Capture GitHub links, LinkedIn profiles, tech stacks, and team affiliations seamlessly.",
          },
          {
            icon: Users,
            title: "Team Application Management",
            desc: "Group hackers into project teams and approve entire groups in a single click.",
          },
          {
            icon: QrCode,
            title: "Encrypted Hacker QR Passes",
            desc: "Issue scannable mobile passes delivered via WhatsApp and transactional email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan attendees at registration and venue doors in milliseconds with volunteer phones.",
          },
          {
            icon: Layers,
            title: "Meal & Swag Checkpoints",
            desc: "Track meals, snacks, hardware loans, and swag distribution on a single QR badge.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Locking",
            desc: "Prevent pass sharing across doors and meal lines with atomic database locks.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Hackathon Portal",
                "desc": "Configure application fields, developer tracks, team options, and dietary questions."
        },
        {
                "n": "02",
                "title": "Review Applications",
                "desc": "Screen applicant developer profiles and approve shortlisted hackers in batch."
        },
        {
                "n": "03",
                "title": "Issue Hacker Badges",
                "desc": "Shortlisted hackers receive encrypted digital QR passes via email and WhatsApp."
        },
        {
                "n": "04",
                "title": "Scan at Kickoff",
                "desc": "Volunteers scan hacker passes at the venue entrance in <0.3s for rapid entry."
        },
        {
                "n": "05",
                "title": "Track Meals & Sessions",
                "desc": "Use the same QR pass to verify lunch, dinner, midnight snacks, and swag collection."
        }
],
        whoShouldUse: {
        "title": "Who Relies on UrPass for Bangalore Hackathons?",
        "subtitle": "Student tech clubs, developer communities, and enterprise hackathon teams.",
        "personas": [
                {
                        "badge": "CAMPUS",
                        "title": "College & University Hackathons",
                        "desc": "Manage 500+ student hackers, verify college IDs, and coordinate 36-hour meal and lab access."
                },
                {
                        "badge": "DEVELOPER",
                        "title": "Open-Source & Web3 Hackathons",
                        "desc": "Review developer GitHub portfolios, approve multi-disciplinary teams, and issue digital badges."
                },
                {
                        "badge": "ENTERPRISE",
                        "title": "Corporate Innovation Challenges",
                        "desc": "Run internal employee hackathons with domain-restricted registration and executive judging."
                },
                {
                        "badge": "INCUBATOR",
                        "title": "Startup Weekend & Pitch Marathons",
                        "desc": "Register founder teams, track mentor sessions, and streamline demo day audience check-in."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Hacker Check-In Operates on Event Day",
        "subtitle": "Rapid entrance and meal validation designed for high-energy hackathons.",
        "description": "Hackers present their digital pass on their phone or WhatsApp chat. Volunteer organizers point their smartphone camera at the pass. UrPass validates the cryptographic token in under 300 milliseconds, displays the hacker's name, team name, and t-shirt size, and marks them admitted.",
        "points": [
                "Scanners run directly in mobile Safari and Chrome with zero app downloads.",
                "Audible chimes and haptic vibrations verify entry in noisy hackathon halls.",
                "Same QR pass works for Venue Entry, Dinner, Midnight Snacks, and Breakfast.",
                "Manual search by hacker name or email allows instant lookup if a phone battery dies."
        ]
},
        faqs: [
        {
                "q": "Can hackers register as a team or do they register individually?",
                "a": "UrPass supports both individual applications and team registrations. Team leads can create a team name and invite their teammates to register, allowing organizers to review and approve the team as a unit."
        },
        {
                "q": "Can we use the same QR pass to distribute meals and swag across 24-48 hours in Bangalore?",
                "a": "Yes. UrPass supports multi-checkpoint scanning. You can configure checkpoints for Ingress, Dinner, Midnight Snack, Breakfast, and Swag. When a hacker is scanned at the food counter, the pass is recorded for that meal, preventing double claims."
        },
        {
                "q": "Do volunteer organizers need to download an app to scan passes?",
                "a": "No. Volunteers simply open a secure scanner link on their smartphone browser (Safari or Chrome) and start scanning immediately with their phone cameras."
        },
        {
                "q": "Can we collect GitHub links and resume uploads during registration?",
                "a": "Yes. You can add custom questions to your registration form including text fields for GitHub and LinkedIn URLs, dropdowns for technical skills, and file upload fields for resumes."
        },
        {
                "q": "What prevents hackers from sharing their ticket screenshot with non-registered friends?",
                "a": "UrPass uses database-level atomic row locks. Once a pass is scanned at the venue entrance, it is marked as checked in. Any subsequent scan attempt displays an amber duplicate warning showing the exact time of the original scan."
        }
],
      }}
    />
  );
}
