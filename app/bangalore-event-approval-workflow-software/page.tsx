import type { Metadata } from "next";
import { CheckCircle2, CreditCard, FileSpreadsheet, QrCode, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Approval Workflow Bangalore | UrPass",
  description: "Review attendee applications, approve registrations and issue QR passes for Bangalore events through an organized approval workflow.",
  keywords: ["event registration approval workflow bangalore","curated event ticketing bengaluru","attendee vetting software bangalore","application based event registration","private event guest approval"],
  alternates: {
    canonical: "https://urpass.space/bangalore-event-approval-workflow-software",
  },
  openGraph: {
    title: "Event Approval Workflow Bangalore | UrPass",
    description: "Review attendee applications, approve registrations and issue QR passes for Bangalore events through an organized approval workflow.",
    url: "https://urpass.space/bangalore-event-approval-workflow-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Approval Workflow Bangalore | UrPass",
    description: "Review attendee applications, approve registrations and issue QR passes for Bangalore events through an organized approval workflow.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreEventApprovalWorkflowSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "REGISTRATION APPROVAL WORKFLOWS",
        h1: "Event Registration Approval Workflows for Bangalore Organizers",
        canonicalUrl: "https://urpass.space/bangalore-event-approval-workflow-software",
        description: "Review attendee applications, approve registrations and issue QR passes for Bangalore events through an organized approval workflow.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-event-approval-workflow-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Curate High-Signal Bangalore Events",
        ctaDescription: "Review applicant profiles, approve qualified delegates with one click, and automatically dispatch encrypted QR passes via WhatsApp and email.",
        directAnswer: {
        "title": "What is Event Registration Approval Workflow Software in Bangalore?",
        "summary": "Event registration approval workflow software in Bangalore allows hosts of hackathons, investor demo days, and executive conclaves to screen applicants before issuing entry passes. UrPass provides custom vetting forms, centralized applicant review queues, one-click approvals, and automated WhatsApp QR pass generation with 0% ticket fees.",
        "keyPoints": [
                "Curated event intake forms with custom questions for LinkedIn, portfolio, and company details",
                "Centralized review dashboard with bulk approve, reject, or waitlist actions",
                "Automated WhatsApp and email notifications dispatch digital QR passes upon approval",
                "Sub-0.3s smartphone camera scanning validates only verified, approved attendees at the door"
        ]
},
        whatIs: {
        "title": "Why Bangalore Community Curators Choose UrPass",
        "definition": "Bangalore's competitive startup and developer ecosystem values high-signal gatherings. Open registration forms often lead to unqualified crowds that dilute the networking value of founder mixers, hackathons, and investor demo days.",
        "details": [
                "Replace unorganized Google Sheets vetting with a streamlined, branded applicant pipeline",
                "Screen applicants by startup stage, technical experience, GitHub repos, and LinkedIn profiles",
                "Approved applicants receive dynamic QR passes instantly; rejected applicants receive polite notices",
                "Option to charge approved applicants only after vetting clears with direct Razorpay integration"
        ]
},
        keyFactsTable: {
        "title": "UrPass Approval Workflows vs Manual Google Forms",
        "subtitle": "Why curated event organizers in Bangalore switch to UrPass.",
        "headers": [
                "Workflow Dimension",
                "Google Forms + Manual Emails",
                "UrPass Approval Engine"
        ],
        "rows": [
                {
                        "col1": "Applicant Review",
                        "col2": "Scattered spreadsheets reviewed manually by multiple staff",
                        "col3": "Centralized dashboard with one-click approve/reject actions"
                },
                {
                        "col1": "Pass Issuance",
                        "col2": "Manual mail merge creating PDF attachments prone to spam",
                        "col3": "Instant automated WhatsApp & Apple Wallet pass dispatch"
                },
                {
                        "col1": "Payment on Approval",
                        "col2": "Chasing approved applicants with bank transfer links",
                        "col3": "Automated payment checkout link sent upon approval"
                },
                {
                        "col1": "Door Check-In",
                        "col2": "Manual name check against spreadsheet at the entrance",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SCREENING PIPELINE",
                "title": "Bespoke Applicant Screening for Hackathons and Pitch Nights",
                "paragraphs": [
                        "Organizers of Bangalore hackathons and investor pitch events receive hundreds of applications for a limited number of spots. Sorting through applications manually in spreadsheets leads to administrative burnout.",
                        "UrPass provides custom intake questionnaires. Collect applicant GitHub links, startup deck URLs, team size, and funding stages. Review applications in a unified dashboard and filter applicants by custom parameters."
                ],
                "bullets": [
                        "Custom text fields, dropdowns, and file upload links for applicant vetting",
                        "One-click batch approvals allow organizers to admit 50 applicants at once",
                        "Automated acceptance emails with calendar invites and venue directions",
                        "Export complete applicant answers to CSV for committee evaluations"
                ],
                "takeaway": "Streamlined applicant screening saves dozens of organizer hours per event."
        },
        {
                "badge": "AUTOMATED ISSUANCE",
                "title": "Automated WhatsApp Pass Generation Upon Organizer Approval",
                "paragraphs": [
                        "Once an applicant is approved, keeping them engaged and ensuring they have their entrance credentials ready is critical for smooth venue operations.",
                        "UrPass automatically triggers a personalized WhatsApp message and email containing the attendee's dynamic QR pass the moment you click 'Approve'. Attendees arrive at the venue with their pass already in hand."
                ],
                "bullets": [
                        "Instant WhatsApp delivery with custom congratulatory message and QR code",
                        "Apple Wallet (.pkpass) integration allows one-tap lockscreen access",
                        "Optional payment collection: require payment before pass unlocks",
                        "Real-time duplicate detection at the door prevents approved tickets from being shared"
                ],
                "takeaway": "Instant automated pass delivery ensures attendees arrive prepared."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Sliders,
            title: "Custom Intake Forms",
            desc: "Collect LinkedIn handles, GitHub profiles, startup stages, and portfolio links.",
          },
          {
            icon: CheckCircle2,
            title: "One-Click Approvals",
            desc: "Approve, waitlist, or reject applicants individually or in bulk from your dashboard.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in approved guests instantly using phone cameras on mobile browsers.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect registration fees from approved applicants directly with zero platform cuts.",
          },
          {
            icon: FileSpreadsheet,
            title: "Complete Roster Exports",
            desc: "Export verified attendee lists with full application responses to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Approval Event",
                "desc": "Define event details, screening questionnaire, capacity limits, and approval rules."
        },
        {
                "n": "02",
                "title": "Collect Applications",
                "desc": "Share your responsive application page across developer networks and social channels."
        },
        {
                "n": "03",
                "title": "Review in Dashboard",
                "desc": "Review candidate profiles and click 'Approve' on qualified attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Approved guests automatically receive encrypted QR passes via WhatsApp and email."
        },
        {
                "n": "05",
                "title": "Scan at Door",
                "desc": "Venue staff validate passes in <0.3s with smartphone cameras for rapid entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Approval Workflows in Bangalore?",
        "subtitle": "Curators hosting selective gatherings across Karnataka's tech hub.",
        "personas": [
                {
                        "badge": "HACKATHONS",
                        "title": "Developer Hackathons",
                        "desc": "Screen student and engineer applications to select top technical teams."
                },
                {
                        "badge": "DEMO DAYS",
                        "title": "Startup Pitch Nights",
                        "desc": "Vet founder applications and investor credentials for closed-door pitch events."
                },
                {
                        "badge": "EXECUTIVE",
                        "title": "CXO & Leadership Dinners",
                        "desc": "Curate executive attendance by company size, title, and industry vertical."
                },
                {
                        "badge": "MASTERCLASSES",
                        "title": "Selective Bootcamps",
                        "desc": "Review candidate prerequisites before admitting students into advanced classes."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Functions for Curated Events",
        "subtitle": "Fast, dignified entrance management for verified attendees.",
        "description": "Approved attendees present their digital pass on their smartphone screen or Apple Wallet. The door host points their mobile camera at the pass. UrPass verifies that the applicant was approved in under 300 milliseconds, displays their name, and marks them checked in immediately.",
        "points": [
                "Eliminates slow manual searching through printed applicant rosters.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents unapproved or rejected applicants from gaining entrance.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does the approval workflow work on UrPass?",
                "a": "When approval mode is enabled on a ticket tier, prospective attendees submit an application. Organizers review submissions in their dashboard. Upon clicking approve, UrPass automatically issues their QR pass."
        },
        {
                "q": "Can I collect payment only after an attendee is approved?",
                "a": "Yes. You can configure an approval-then-payment flow. Approved applicants receive a private checkout link to complete payment before their QR ticket is generated."
        },
        {
                "q": "Can I approve applicants in bulk?",
                "a": "Yes. The organizer dashboard allows you to select multiple applicants and approve or waitlist them with a single click."
        },
        {
                "q": "What do rejected or waitlisted applicants see?",
                "a": "You can customize automated email notifications for waitlisted or declined candidates, ensuring professional communication with every applicant."
        },
        {
                "q": "What pricing applies to approval-based events?",
                "a": "UrPass offers a transparent subscription starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
