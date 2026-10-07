import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with Approval Workflow & Vetted Passes | UrPass",
  description: "Screen and vet attendee registrations before issuing digital QR passes. Manage private summits, VIP invites, and executive roundtables with UrPass.",
  keywords: [
    "event registration approval workflow",
    "event registration approval workflow online",
    "event registration approval workflow platform",
    "event registration approval workflow check in",
    "event registration approval workflow qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-with-approval-workflow",
  },
  openGraph: {
    title: "Event Registration with Approval Workflow & Vetted Passes | UrPass",
    description: "Screen and vet attendee registrations before issuing digital QR passes. Manage private summits, VIP invites, and executive roundtables with UrPass.",
    url: "https://urpass.space/event-registration-with-approval-workflow",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "VETTED REGISTRATION & VIP ACCESS",
        h1: "Event Registration with Built-in Approval Workflow & Vetted Passes",
        canonicalUrl: "https://urpass.space/event-registration-with-approval-workflow",
        description: "Screen and vet attendee registrations before issuing digital QR passes. Manage private summits, VIP invites, and executive roundtables with UrPass.",
        ctaLabel: "Set Up Approval Workflow Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Approval Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How do I set up an event registration page with an approval workflow?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. With UrPass's approval workflow, attendees submit an application form, organisers review profiles in an admin console, and approve or decline applicants with one click—automatically triggering digital QR pass delivery only to confirmed guests.",
          keyPoints: ["Custom application forms capturing company name, job title, LinkedIn URL, and intent","One-click individual or bulk approval and decline actions from the organiser dashboard","Automated branded confirmation emails with digital QR passes sent instantly upon approval","Declined or waitlisted applicants receive polite automated notifications without passes"],
        },
        whatIs: {
          title: "What is an Event Registration Approval Workflow?",
          definition: "An event registration approval workflow is a gated admission process where applicants must be reviewed and approved by event organizers before receiving an official ticket or QR admission pass.",
          details: ["Ensures high audience caliber at executive roundtables, investor summits, and VIP galas","Filters out unqualified applicants, competitors, and spam registrations","Eliminates manual emailing by automatically dispatching passes upon approval","Maintains strict capacity limits for exclusive private venues"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Users,
            title: "Custom Screening Questions",
            desc: "Collect LinkedIn profiles, company revenue, job titles, and motivation statements.",
          },
          {
            icon: CheckCircle2,
            title: "One-Click Admin Approval",
            desc: "Review candidate profiles and approve or reject applications individually or in bulk.",
          },
          {
            icon: ScanLine,
            title: "Automated QR Pass Dispatch",
            desc: "Approved guests automatically receive branded digital passes with calendar invites.",
          },
          {
            icon: Zap,
            title: "Custom Email Notification Templates",
            desc: "Customize approval congratulations and polite decline emails with event branding.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Application Pipeline",
            desc: "Track pending applications, approved delegates, and rejected counts in a clean Kanban-style view.",
          },
          {
            icon: ShieldCheck,
            title: "Door Ingress Verification",
            desc: "Volunteer scanners instantly verify approved VIP passes at the door with sub-0.3s speed.",
          },
        ],
        deepDiveSections: [
          {
            badge: "VETTED GUEST PROTOCOL",
            title: "How UrPass Simplifies Invitation-Only & Curated Events",
            paragraphs: ["Curated executive summits, investor pitch days, and private industry roundtables cannot use open public registration. When organizers use generic forms or Google Sheets, they spend dozens of hours reviewing rows, writing custom acceptance emails, and manually attaching PDF tickets.","UrPass automates the entire screening lifecycle. Organizers publish a branded application page. Submissions populate a streamlined admin inbox. With a single click on 'Approve', UrPass automatically generates a unique cryptographic QR pass and emails it to the delegate with calendar links and arrival details."],
            bullets: ["Eliminates hours of manual email drafting and PDF ticket generation","Separates pending candidates from approved delegates with clear visual tags","Protects private event locations by only sharing venue details upon approval","Delivers complete peace of mind with 100% verified, curated guest lists"],
            takeaway: "UrPass gives event hosts the power to curate world-class guest lists with zero administrative friction.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Approval Workflow Capability","Manual Google Sheets + Gmail","UrPass Approval Engine"],
          rows: [{"col1":"Applicant Review Process","col2":"Manual row-by-row spreadsheet checking","col3":"One-click approval console with candidate summary"},{"col1":"Pass Generation upon Approval","col2":"Manual PDF creation and email attachment","col3":"100% automated instant QR pass dispatch"},{"col1":"Application Tracking","col2":"Messy color-coded spreadsheet cells","col3":"Real-time pipeline (Pending, Approved, Declined)"},{"col1":"Door Check-In Integration","col2":"Paper list checking at entrance","col3":"Instant 0.28s mobile camera QR check-in"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Executive Roundtables & CXO Summits","desc":"Curate C-suite guest lists and ensure strict seniority criteria.","badge":"EXECUTIVE"},{"title":"Investor & Founder Pitch Days","desc":"Screen startup founders and accredited investors before granting entry.","badge":"VENTURE"},{"title":"Private VIP Brand Galas","desc":"Manage influencer and celebrity guest lists with personalized approvals.","badge":"VIP BRAND"},{"title":"Academic Colloquiums & Workshops","desc":"Vet research delegates and scholars applying for limited workshop seats.","badge":"ACADEMIC"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "How does an event registration approval workflow work?",
                    "a": "Applicants fill out your registration form with custom screening questions. Their status stays 'Pending' until you review their profile in the dashboard and click 'Approve'. Once approved, UrPass automatically sends them their digital QR pass."
          },
          {
                    "q": "Do unapproved applicants receive an event ticket?",
                    "a": "No. Unapproved or pending applicants only receive an acknowledgement email. The actual QR entry pass is generated and delivered only when an organiser explicitly approves the registration."
          },
          {
                    "q": "Can I approve applicants in bulk?",
                    "a": "Yes. UrPass allows organisers to select multiple applicants and approve or decline them simultaneously in one click."
          },
          {
                    "q": "Can I customize the acceptance and rejection email messages?",
                    "a": "Yes. You can customize the subject lines, email body text, venue instructions, and branding for both approval and decline notifications."
          },
          {
                    "q": "Can I collect custom vetting questions like LinkedIn profile and company size?",
                    "a": "Yes. You can add custom text fields, dropdowns, URL inputs, file uploads, and radio buttons to your application form."
          },
          {
                    "q": "What happens if an approved attendee forwards their pass to an unapproved friend?",
                    "a": "Each QR pass is single-use and assigned specifically to the approved attendee's name. When scanned at the door, the attendee's name and details appear on screen for verification."
          },
          {
                    "q": "Is the approval workflow available on free UrPass plans?",
                    "a": "Yes, UrPass provides approval workflows on all tiers, allowing community and professional hosts alike to vet their guest lists."
          }
],
        ctaTitle: "Event Registration with Built-in Approval Workflow & Vetted Passes",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
