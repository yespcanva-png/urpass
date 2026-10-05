import type { Metadata } from "next";
import { BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Event Management Software & QR Check-In | UrPass",
  description: "Manage college registrations, digital QR passes, attendee approvals and real-time multi-gate check-in with UrPass. Launch your next college event in minutes.",
  keywords: [
    "college event management software",
    "college event management software online",
    "college event management software platform",
    "college event management software check in",
    "college event management software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/college-event-management-software",
  },
  openGraph: {
    title: "College Event Management Software & QR Check-In | UrPass",
    description: "Manage college registrations, digital QR passes, attendee approvals and real-time multi-gate check-in with UrPass. Launch your next college event in minutes.",
    url: "https://urpass.space/college-event-management-software",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS & COLLEGE EDITION",
        h1: "Event Management Software Built for Colleges",
        canonicalUrl: "https://urpass.space/college-event-management-software",
        description: "Manage college registrations, digital QR passes, attendee approvals and real-time multi-gate check-in with UrPass. Launch your next college event in minutes.",
        ctaLabel: "Launch Your College Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Book an UrPass Demo",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What is the best event management software for colleges?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For colleges, UrPass replaces messy spreadsheets and paper desks with instant digital QR passes, multi-gate mobile scanning, faculty approval workflows, and 0% ticket commission on campus events.",
          keyPoints: ["Custom registration forms with student ID, department, and college name capture","Instant branded QR pass delivery via email and WhatsApp upon approval","Atomic duplicate blocking across 10+ campus gates simultaneously in <150ms","Volunteer scanner PIN login without downloading external mobile apps"],
        },
        whatIs: {
          title: "What is College Event Management Software?",
          definition: "College event management software is a unified campus operations platform designed for universities, student unions, and faculty departments. It coordinates attendee registration, automated pass generation, multi-tier ticket sales, and concourse entrance scanning across campus venues.",
          details: ["Eliminates crowded entrance bottlenecks at symposiums and annual fests","Provides faculty advisors and student heads with real-time attendance telemetry","Prevents pass sharing via screenshots through dynamic atomic validation","Exports clean, verified attendance logs for academic certification"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Building2,
            title: "Student ID & Department Capture",
            desc: "Collect roll numbers, branch, semester, and institution proofs directly in custom registration forms.",
          },
          {
            icon: ScanLine,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass delivery directly to attendee email and WhatsApp with personalized branding.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Campus Concourse Scanning",
            desc: "Deploy 20+ volunteers across auditorium doors, campus gates, and workshop labs simultaneously.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of student registration fees with direct Razorpay UPI or Stripe card settlement.",
          },
          {
            icon: CheckCircle2,
            title: "Faculty Approval Workflows",
            desc: "Review internal vs. external delegate applications before automatically releasing digital entrance passes.",
          },
          {
            icon: BarChart3,
            title: "Live Turnout & Velocity Analytics",
            desc: "Track peak crowd rush hours, entrance throughput, and no-show statistics in real time.",
          },
        ],
        deepDiveSections: [
          {
            badge: "CAMPUS SCALE WORKFLOW",
            title: "How UrPass Solves High-Volume College Fest & Symposium Operations",
            paragraphs: ["Organizing a college fest or national symposium involves managing thousands of students arriving in short 30-minute arrival waves. Traditional Google Forms and paper lists collapse under this pressure, creating 45-minute queues and untracked gate entries.","UrPass modernizes the entire lifecycle: coordinators publish a high-converting mobile registration page, approve applicants individually or in bulk, and volunteers scan digital passes on their own smartphones with zero hardware rental costs."],
            bullets: ["Sub-0.3 second QR scanning in any mobile browser (Safari / Chrome)","Atomic database row locking to block screenshotted pass reuse across doors","Multi-event pass bundling for hackathons, workshops, and culturals","Instant certificate-ready attendee CSV exports"],
            takeaway: "UrPass gives campus event organizers enterprise-grade speed and reliability without complex training or expensive turnstile equipment.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Campus Operational Metric","Legacy Google Forms / Paper","UrPass Platform"],
          rows: [{"col1":"Pass Delivery Speed","col2":"Manual email attachments or no pass","col3":"Instant automated WhatsApp & Email QR"},{"col1":"Gate Check-In Velocity","col2":"60-90s per student (manual search)","col3":"Sub-0.3s camera scan (45+ students/min/gate)"},{"col1":"Pass Reuse Prevention","col2":"Zero duplicate detection","col3":"Atomic <150ms lock across all campus doors"},{"col1":"Ticketing Platform Fee","col2":"3-8% per ticket on legacy portals","col3":"0% ticket commission on UrPass"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Student Council & Fest Coordinators","desc":"Manage culturals, tech symposiums, and pro-nights with seamless ticket sales.","badge":"FEST HEADS"},{"title":"Faculty Advisors & HoDs","desc":"Maintain verified attendance logs and academic audit trails for campus workshops.","badge":"FACULTY"},{"title":"Campus Gate Security & Volunteers","desc":"Scan thousands of incoming students swiftly using mobile phone cameras.","badge":"OPS CREW"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for college events?",
                    "a": "UrPass is specifically engineered for college fests and symposiums. It offers custom student registration forms, instant QR pass delivery, volunteer scanner access, and atomic duplicate protection across multiple campus gates."
          },
          {
                    "q": "How does QR event check-in work for college fests?",
                    "a": "Attendees show their unique digital QR pass on their phone screen. Student volunteers open the UrPass scanner on their own mobile browser and point the camera. The pass verifies in under 0.3 seconds and logs the check-in immediately."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. UrPass supports unlimited concurrent scanning gates. State updates synchronize across all devices in under 150 milliseconds, ensuring that once a pass is scanned at Gate 1, it cannot be reused at Gate 3."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry and screenshot sharing?",
                    "a": "Yes. UrPass enforces atomic database row-level locking. If an attendee attempts to share a screenshot of their pass with a friend at another entrance, the system immediately sounds a red duplicate alert."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. The UrPass live telemetry dashboard displays real-time attendance counts, arrival velocity curves, gate-by-gate distribution, and remaining not-arrived attendees."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. UrPass supports free registrations, tiered paid tickets, and approval-only passes with integrated payment gateways and zero platform commission."
          }
],
        ctaTitle: "Event Management Software Built for Colleges",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
