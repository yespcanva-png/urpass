import type { Metadata } from "next";
import { Laptop, Layers, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Registration Platform | UrPass",
  description: "Collect hackathon applications, review participants, issue QR passes and manage event-day attendance with UrPass registration software.",
  keywords: ["hackathon registration platform","hackathon registration and participant management","hackathon check in software","developer hackathon registration","hackathon team registration software","hackathon qr check in"],
  alternates: {
    canonical: "https://urpass.space/hackathon-registration-platform",
  },
  openGraph: {
    title: "Hackathon Registration Platform | UrPass",
    description: "Collect hackathon applications, review participants, issue QR passes and manage event-day attendance with UrPass registration software.",
    url: "https://urpass.space/hackathon-registration-platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Registration Platform | UrPass",
    description: "Collect hackathon applications, review participants, issue QR passes and manage event-day attendance with UrPass registration software.",
  },
};

export default function HackathonRegistrationPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "HACKATHONS & DEVELOPER MEETS",
        h1: "Hackathon Registration and Participant Management",
        canonicalUrl: "https://urpass.space/hackathon-registration-platform",
        description: "Collect hackathon applications, review participants, issue QR passes and manage event-day attendance with UrPass registration software.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=hackathon-registration-platform",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Manage Hacker Applications and Gate Entry in One Place",
        ctaDescription: "Review developer profiles, manage team registrations, issue encrypted hacker badges, and track on-site meal check-ins.",
        directAnswer: {
        "title": "What is a Hackathon Registration Platform?",
        "summary": "A hackathon registration platform is dedicated software built to manage developer hackathons. Organizers collect participant applications, review GitHub links and developer profiles, approve shortlisted teams, issue scannable QR passes, and track on-site presence and meal distribution across 24-48 hour builds.",
        "keyPoints": [
                "Developer application forms capturing GitHub, LinkedIn, tech stack, and portfolio links",
                "Application screening and one-click batch approval workflows for hacker teams",
                "Encrypted digital QR hacker passes delivered via WhatsApp and transactional email",
                "Sub-0.3 second smartphone camera scanning for door entry, meal tracking, and swag distribution"
        ]
},
        whatIs: {
        "title": "How UrPass Powers 24 to 48 Hour Developer Hackathons",
        "definition": "UrPass provides hackathon organizers with complete operational control from initial application through hackathon kickoff, midnight meal distributions, and project judging. It replaces messy Google Forms with a secure, automated workflow tailored for developer communities.",
        "details": [
                "Manages both individual hacker applications and multi-member team registrations",
                "Screen and shortlist applicants with custom evaluation questions and status tags",
                "Tracks multi-checkpoint attendance: Venue Ingress, Dinner, Midnight Snack, and Breakfast",
                "Prevents duplicate admissions and meal pass sharing with database-level atomic locking"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Google Forms & Generic Hackathon Portals",
        "subtitle": "Why developer hackathon leads choose UrPass for on-site operations.",
        "headers": [
                "Operational Requirement",
                "Google Forms + Spreadsheets",
                "UrPass Hackathon Platform"
        ],
        "rows": [
                {
                        "col1": "Application Review",
                        "col2": "Clunky spreadsheet rows with unformatted developer links",
                        "col3": "Structured applicant review dashboard with one-click approvals"
                },
                {
                        "col1": "Gate Check-In Speed",
                        "col2": "Slow manual name lookups causing 1-hour queues in venue lobby",
                        "col3": "Sub-0.3s smartphone camera scanning clearing 500 hackers in 10 min"
                },
                {
                        "col1": "Meal & Swag Tracking",
                        "col2": "Paper meal tokens or messy pen tick-sheets that get lost or copied",
                        "col3": "Single hacker QR pass reusable across meals with atomic duplicate locks"
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
                        "Popular hackathons frequently receive 3x to 5x more applications than venue space allows. Organizing teams need a streamlined review interface to evaluate candidate technical experience, review GitHub repositories, and verify diversity targets before issuing admission passes.",
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
                "badge": "ON-SITE CHECKPOINTS",
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
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
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
        "title": "Who Relies on UrPass for Hackathon Operations?",
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
                "q": "Can we use the same QR pass to distribute meals and swag across 24-48 hours?",
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
