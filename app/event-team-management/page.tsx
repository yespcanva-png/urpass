import type { Metadata } from "next";
import { Users2, ShieldCheck, KeyRound, Lock, UserPlus, CheckCircle2, ArrowRight, Smartphone, Eye } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Team Management Software | URPASS",
  description: "Manage event organizers, staff, and permissions with role-based access controls. Delegate volunteer scanning without exposing financial data or contact lists.",
  keywords: [
    "event team management software",
    "event staff permissions",
    "event role based access control",
    "volunteer check in management",
    "multi user event software",
    "event committee collaboration",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-team-management" },
  openGraph: {
    title: "Event Team Management Software | URPASS",
    description: "Manage event organizers, staff, and permissions with role-based access controls.",
    url: "https://urpass.space/event-team-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "STAFF & PERMISSIONS",
        h1: "Manage Event Organizers, Staff and Permissions",
        canonicalUrl: "https://urpass.space/event-team-management",
        description:
          "Event team management empowers event directors to configure role-based access permissions, invite collaborative organizers, delegate physical gate check-in tasks, and safeguard sensitive financial revenue metrics. URPASS offers multi-seat organization accounts, zero-login volunteer scanner links, and comprehensive activity logging for teams of any size.",
        ctaLabel: "Manage Team Access",
        features: [
          { icon: KeyRound, title: "Granular Role-Based Permissions", desc: "Assign discrete roles including Owner, Admin, Member, Event Coordinator, and Gate Scanner across your organization." },
          { icon: Smartphone, title: "Tokenized Volunteer Scanner Links", desc: "Equip temporary volunteers with secure check-in links that work in any mobile browser without requiring app installs or accounts." },
          { icon: Lock, title: "Financial & Revenue Privacy", desc: "Shield banking settlements, payout logs, and ticket sales revenue from general volunteers and non-admin staff." },
          { icon: UserPlus, title: "1-Click Team Member Invites", desc: "Invite committee members via email to collaborate on event creation, attendee approvals, and badge designs." },
          { icon: Eye, title: "Full Staff Audit Trails", desc: "Monitor scanner device activity in real time to see exactly which team member checked in which attendee at which entrance." },
          { icon: ShieldCheck, title: "Enterprise Workspaces", desc: "Organize teams into distinct departmental workspaces with shared branding, custom domains, and centralized billing." },
        ],
        steps: [
          { n: "01", title: "Create Organization Workspace", desc: "Set up your brand or department workspace and define default organization settings." },
          { n: "02", title: "Invite Core Organizers", desc: "Send email invites to managers and coordinators with assigned permission roles." },
          { n: "03", title: "Generate Scanner Tokens", desc: "Generate secure, restricted scanner links for student volunteers and door security staff." },
          { n: "04", title: "Monitor Live Gate Activity", desc: "Track staff performance, scan speeds, and gate traffic across all active mobile stations." },
          { n: "05", title: "Revoke Access Post-Event", desc: "Revoke temporary volunteer tokens or offboard staff with one click once the event ends." },
        ],
        callout: {
          badge: "SECURITY & PRIVACY",
          title: "Stop sharing one master password with 20 college volunteers.",
          description: "Sharing administrative login credentials across temporary event staff creates severe data leaks, accidental event deletions, and privacy violations. URPASS gives you clean delegation so staff only access what they need to execute their job.",
          bullets: [
            "Volunteers cannot view attendee contact details or export customer databases",
            "Sensitive ticket revenue, bank details, and payout logs stay completely private",
            "No app installation or password creation required for door volunteers",
            "Instant remote deactivation of lost or compromised volunteer devices",
          ],
        },
        deepDiveSections: [
          {
            badge: "VOLUNTEER DELEGATION",
            title: "How do volunteers scan tickets without creating accounts or downloading apps?",
            paragraphs: [
              "On event morning, coordinators rarely have time to help 15 student volunteers download an app, create accounts, and verify email addresses. With URPASS, the lead organizer generates a secure, tokenized scanner URL.",
              "Volunteers simply scan a master QR code or open the link in Safari or Chrome. Their camera activates immediately as an authenticated scanning terminal locked strictly to that event's gate check-in interface. They cannot view revenue numbers, alter ticket tiers, or export registrant data.",
            ],
            takeaway: "Tokenized scanner links get door staff operational in under 15 seconds with zero security compromise.",
          },
          {
            badge: "ENTERPRISE TEAMS",
            title: "How do multi-seat workspaces support large agencies and university committees?",
            paragraphs: [
              "Universities, enterprise corporations, and event agencies run dozens of parallel events across different teams and departments. URPASS workspaces allow marketing leads, finance managers, and student leaders to collaborate under a unified organization account.",
              "Admins can supervise all active events, audit team activity, and consolidate invoicing while granting individual event leads full creative control over their own specific events.",
            ],
            takeaway: "Centralized workspaces provide administrative oversight while preserving team agility.",
          },
        ],
        faqs: [
          {
            q: "How many organizer seats are included in URPASS plans?",
            a: "Starter includes 2 organizer seats, Pro includes 5 seats, and Business includes 15 seats with additional custom seat allocations available for Enterprise plans.",
          },
          {
            q: "Can volunteers access the scanner offline if WiFi is unavailable?",
            a: "Yes. Once the scanner URL is loaded, volunteers can scan passes using local device caching even if internet connectivity drops temporarily.",
          },
          {
            q: "Can I assign a team member to only one specific event rather than the whole organization?",
            a: "Yes. You can grant granular event-level permissions so coordinators only access their assigned event.",
          },
        ],
        relatedLinks: [
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Multi-Event Management", href: "/multi-event-management", category: "Product" },
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Event Organizer Dashboard", href: "/event-organizer-dashboard", category: "Product" },
        ],
      }}
    />
  );
}
