import type { Metadata } from "next";
import { Briefcase, Building2, ShieldCheck, Users, Lock, QrCode, ArrowRight, CheckCircle2, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Registration Software | URPASS",
  description: "Corporate event registration software for employee town halls, partner conferences, executive summits, and company roadshows. Enterprise security and QR entry.",
  keywords: [
    "corporate event registration software",
    "corporate event management platform",
    "enterprise corporate ticketing",
    "internal event registration system",
    "executive summit check in software",
    "business conference registration",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-for-corporates" },
  openGraph: {
    title: "Corporate Event Registration Software | URPASS",
    description: "Corporate event registration software for employee town halls, partner conferences, and executive summits.",
    url: "https://urpass.space/event-registration-software-for-corporates",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE CORPORATE",
        h1: "Event Registration Software for Corporate Events",
        canonicalUrl: "https://urpass.space/event-registration-software-for-corporates",
        description:
          "Corporate event registration software manages internal employee town halls, partner conferences, executive leadership summits, and multi-location business roadshows with enterprise security and brand polish. URPASS combines corporate domain restrictions, white-label digital passes, automated calendar sync (.ics), and sub-0.3s QR entrance check-in that guarantees zero reception delays.",
        ctaLabel: "Plan Corporate Event",
        features: [
          { icon: Building2, title: "Company Email Verification", desc: "Restrict signups strictly to corporate employee domains (e.g. @company.com) to maintain internal program privacy." },
          { icon: ShieldCheck, title: "Executive-Grade Security", desc: "Encrypted QR passes and SOC-2 compliant architecture protect executive guest lists and internal company disclosures." },
          { icon: Lock, title: "White-Label Corporate Branding", desc: "Showcase your company logo, executive branding, and corporate colors with zero third-party platform watermarks." },
          { icon: QrCode, title: "Brisk Executive Reception", desc: "Check in VIPs and delegates in under 300ms using any smartphone or iPad, avoiding awkward foyer line delays." },
          { icon: Users, title: "Curated Approval Workflows", desc: "Screen registrations for exclusive executive sessions and issue confirmed passes only upon management sign-off." },
          { icon: BarChart3, title: "Real-Time Executive Attendance", desc: "Monitor live attendance by department, office location, or job tier to debrief leadership and HR partners." },
        ],
        steps: [
          { n: "01", title: "Configure Corporate Event", desc: "Set event parameters, executive agenda highlights, and department seating tiers in URPASS." },
          { n: "02", title: "Enforce Domain Rules", desc: "Specify allowed corporate email domains or upload pre-approved guest rosters." },
          { n: "03", title: "Distribute Digital Passes", desc: "Attendees receive crisp, branded passes with 1-click Outlook and Google Calendar sync." },
          { n: "04", title: "Sub-0.3s Reception Check-In", desc: "Front desk staff scan incoming executives and guests with zero awkward waiting." },
          { n: "05", title: "Generate HR & Compliance Logs", desc: "Export verified attendance records for mandatory compliance training or executive reporting." },
        ],
        callout: {
          badge: "PROFESSIONAL EXECUTIVE EXPERIENCE",
          title: "First impressions matter for your enterprise partners and leaders.",
          description: "Having your senior leadership or high-value business clients queue up in a hotel lobby while receptionists flip through paper binder sheets looks unprofessional. URPASS provides frictionless, sub-second digital reception that commands respect.",
          bullets: [
            "Seamless calendar invites (.ics) automatically book time on corporate Outlook and Google calendars",
            "Apple Wallet and Google Wallet integration puts passes directly on executive phone lockscreens",
            "Discrete VIP alerts notify hosts on their phone the moment key dignitaries check in",
            "GDPR and enterprise privacy compliant: zero third-party ads or data leakage",
          ],
        },
        deepDiveSections: [
          {
            badge: "INTERNAL TOWN HALLS",
            title: "How does URPASS streamline mandatory corporate training and internal town halls?",
            paragraphs: [
              "When enterprises host mandatory compliance training or internal town halls across multiple regional offices, tracking exact employee attendance is a legal and operational requirement.",
              "URPASS allows HR and operations leads to issue personalized digital passes to employees. When staff arrive, a quick scan logs their verified attendance with an immutable timestamp, replacing manual sign-in sheets that can be forged by colleagues.",
            ],
            takeaway: "Cryptographic check-in logs provide audit-ready employee compliance records for corporate HR teams.",
          },
          {
            badge: "VIP PROTOCOLS",
            title: "How do event hosts handle high-value guests and keynote speakers?",
            paragraphs: [
              "For executive summits and investor meetings, hosts need to know when board members or VIP speakers arrive so they can be escorted to green rooms without delay.",
              "URPASS allows assigning 'VIP' tags to specific ticket tiers. When a VIP pass is scanned at reception, the system can fire a webhook to alert event hosts via private notification, ensuring white-glove hospitality.",
            ],
            takeaway: "Automated arrival notifications enable immediate, white-glove VIP hospitality at high-stakes summits.",
          },
        ],
        faqs: [
          {
            q: "Can we restrict registrations strictly to our employees?",
            a: "Yes. You can enforce email domain restrictions (e.g. '@acme.com') so external users cannot register for confidential sessions.",
          },
          {
            q: "Does URPASS integrate with corporate single sign-on (SSO)?",
            a: "Yes. Enterprise accounts can integrate with Okta, Azure Active Directory, and Google Workspace SSO.",
          },
          {
            q: "Can reception staff check in guests using company iPads or mobile phones?",
            a: "Yes. The scanner runs directly inside the Safari or Chrome browser on any iPad, iPhone, or Android tablet without installing software.",
          },
        ],
        relatedLinks: [
          { title: "Corporate Events Registration", href: "/corporate-events", category: "Use Case" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Event Team Management", href: "/event-team-management", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
        ],
      }}
    />
  );
}
