import type { Metadata } from "next";
import { UserCheck, ShieldCheck, MailCheck, Filter, Users, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Approval System | URPASS",
  description: "Screen and approve attendees before issuing event passes. Ideal for hackathons, private executive roundtables, invite-only summits, and college conferences.",
  keywords: [
    "event registration approval system",
    "attendee approval software",
    "curated event registration",
    "manual approval event tickets",
    "screen event attendees",
    "invite only event management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-approval-system" },
  openGraph: {
    title: "Event Registration Approval System | URPASS",
    description: "Screen and approve attendees before issuing event passes.",
    url: "https://urpass.space/event-registration-approval-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDEE VETTING",
        h1: "Approve Attendees Before Issuing Event Passes",
        canonicalUrl: "https://urpass.space/event-registration-approval-system",
        description:
          "An event registration approval system allows organizers to screen, curate, and review attendee applications before granting entry passes or collecting ticket fees. URPASS provides 1-click single and batch approvals, custom vetting fields, automated approval/waitlist notification emails, and instantaneous digital QR ticket issuance for approved participants.",
        ctaLabel: "Set Up Approval Workflow",
        features: [
          { icon: UserCheck, title: "1-Click Batch Approvals", desc: "Review attendee applications in a clean review queue and approve, reject, or waitlist candidates individually or in bulk." },
          { icon: Filter, title: "Custom Screening Questions", desc: "Collect GitHub profiles, LinkedIn URLs, portfolio links, company size, or college IDs to vet attendees thoroughly." },
          { icon: MailCheck, title: "Automated Decision Emails", desc: "Approved attendees automatically receive their branded QR pass; rejected or waitlisted applicants receive polite updates." },
          { icon: ShieldCheck, title: "Gated Access Control", desc: "Only approved applicants receive valid QR entry tokens. Unapproved applications cannot scan at entry gates." },
          { icon: Clock, title: "Conditional Payment on Approval", desc: "Screen candidates first for high-demand workshops, and send payment links only after their application is accepted." },
          { icon: Users, title: "Collaborative Team Review", desc: "Allow committee members and organizers to review submissions and add internal notes without exposing admin controls." },
        ],
        steps: [
          { n: "01", title: "Enable Approval Mode", desc: "Toggle 'Require Approval' on your event settings or on specific ticket categories." },
          { n: "02", title: "Attendees Apply", desc: "Candidates submit applications answering your specific background and qualification questions." },
          { n: "03", title: "Review Application Queue", desc: "Organizers filter and evaluate applicants on the live dashboard review board." },
          { n: "04", title: "1-Click Decision", desc: "Approve, waitlist, or decline candidates with automated email trigger updates." },
          { n: "05", title: "Automatic Pass Dispatch", desc: "Approved candidates receive their cryptographic pass ready for gate entry scanning." },
        ],
        callout: {
          badge: "CURATED EXPERIENCES",
          title: "Maintain high audience quality for conferences and hackathons.",
          description: "Not every event should be first-come, first-served. When hosting investor mixers, tech hackathons, closed-door masterclasses, or corporate roundtables, attendee curation directly drives event success. URPASS makes attendee vetting effortless.",
          bullets: [
            "Stop manually copying application data to spreadsheets for committee review",
            "Eliminate duplicate passes and unauthorized transfers with cryptographic tokens",
            "Automatic rejection and waitlist communication saves days of manual email drafting",
            "Instant attendance tracking on event day with volunteer mobile scanning",
          ],
        },
        deepDiveSections: [
          {
            badge: "USE CASES",
            title: "When should an event use an attendee approval workflow?",
            paragraphs: [
              "Approval workflows are essential for competitive hackathons (where teams must be vetted by project proposal), investor and founder demo days, private executive dinners, recruitment summits, and corporate partner conferences.",
              "Rather than allowing open registrations that quickly fill with unqualified signups, organizers can maintain high signal-to-noise ratios. Attendees know their application was genuinely reviewed, increasing attendance rates and engagement on event day.",
            ],
            takeaway: "Gating ticket issuance behind human or criteria-based approval elevates event prestige and attendee quality.",
          },
          {
            badge: "WORKFLOW COMPARISON",
            title: "How does URPASS streamline approval emails and pass delivery?",
            paragraphs: [
              "In legacy setups, organizers collect applications via forms, review them in spreadsheets, and manually copy-paste approval emails with attached PDF tickets. This manual process takes hours, leads to lost attachments, and creates gate verification errors.",
              "With URPASS, clicking 'Approve' triggers an automated transactional email containing the attendee's personalized digital pass with unique encrypted QR code. The pass is automatically enrolled in the active scanner registry, allowing gate volunteers to verify the attendee in under 0.3 seconds on arrival.",
            ],
            takeaway: "One-click approval eliminates hours of manual data entry while maintaining rigorous gate security.",
          },
        ],
        faqs: [
          {
            q: "Can I require approval for some ticket types but keep others instant?",
            a: "Yes. You can require application approval for VIP or Speaker passes while keeping General Admission instant, or vice versa.",
          },
          {
            q: "Can attendees edit their application after submission?",
            a: "Organizers can allow attendees to update their information or re-review pending applications prior to final decision.",
          },
          {
            q: "What notification do rejected applicants receive?",
            a: "You can customize the rejection email template with a courteous notification, or route overflow applicants to an active waitlist.",
          },
        ],
        relatedLinks: [
          { title: "Event Waitlist Management", href: "/event-waitlist-management", category: "Product" },
          { title: "Event Registration Form Builder", href: "/event-registration-form-builder", category: "Product" },
          { title: "Hackathons Check-In", href: "/hackathons", category: "Use Case" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
        ],
      }}
    />
  );
}
