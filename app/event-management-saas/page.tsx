import type { Metadata } from "next";
import { BarChart3, Cloud, Lock, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Cloud Event Management SaaS | UrPass",
  description:
    "Give organizers one cloud workspace for registrations, ticketing, pass creation and attendance visibility.",
  keywords: [
    "event management SaaS",
    "cloud event management software",
    "event registration SaaS",
    "cloud event ticketing",
    "event check-in SaaS",
  ],
  alternates: { canonical: "https://urpass.space/event-management-saas" },
  openGraph: {
    title: "Cloud Event Management SaaS | UrPass",
    description:
      "Give organizers one cloud workspace for registrations, ticketing, pass creation and attendance visibility.",
    url: "https://urpass.space/event-management-saas",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventManagementSaasPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT MANAGEMENT SAAS",
        h1: "Cloud Event Management Software for Growing Teams",
        canonicalUrl: "https://urpass.space/event-management-saas",
        description:
          "UrPass is a cloud event management SaaS for organizers who need registration pages, ticketing, digital passes, QR check-in and attendance visibility in one workspace.",
        ctaLabel: "Get Started →",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Plans",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is event management SaaS?",
          summary:
            "Event management SaaS is cloud software that helps teams run events without installing local systems or stitching together separate tools. UrPass gives organizers browser-based registration, ticketing, digital QR passes, attendee management, entry scanning and reporting so teams can operate from anywhere.",
          keyPoints: [
            "Cloud workspace for organizer teams",
            "Hosted registration and ticketing pages",
            "Digital QR pass creation and validation",
            "Live attendance reporting across devices",
          ],
        },
        features: [
          { icon: Cloud, title: "Cloud Workspace", desc: "Manage registrations, attendees and check-in from a browser-based organizer dashboard." },
          { icon: Users, title: "Team Operations", desc: "Coordinate organizers, desk staff and scanners around one source of truth." },
          { icon: QrCode, title: "Pass Creation", desc: "Generate digital attendee credentials that work on mobile devices." },
          { icon: ScanLine, title: "Web-Based Scanning", desc: "Run check-in through mobile browsers without special scanner hardware." },
          { icon: Lock, title: "Controlled Access", desc: "Use secure pass validation to reduce duplicate entry and credential misuse." },
          { icon: BarChart3, title: "Attendance Visibility", desc: "Track arrivals and operational activity as the event happens." },
        ],
        steps: [
          { n: "01", title: "Create workspace", desc: "Set up your event and registration requirements in UrPass." },
          { n: "02", title: "Launch registration", desc: "Publish a hosted event page for attendees." },
          { n: "03", title: "Issue credentials", desc: "Create passes for approved or paid attendees." },
          { n: "04", title: "Operate on site", desc: "Give staff access to scan passes at the venue." },
          { n: "05", title: "Analyze results", desc: "Review registrations, check-ins and exports after the event." },
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Management Platform", href: "/event-management-platform", category: "Product" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Event Security Compliance", href: "/event-security-compliance", category: "Product" },
        ],
        faqs: [
          { q: "Is UrPass cloud-based?", a: "Yes. UrPass is a browser-based event platform for registration, attendee management, pass creation and check-in operations." },
          { q: "Do attendees or scanners need installed software?", a: "Attendees can open digital passes on the web, and scanning is designed to work through mobile browsers." },
          { q: "Can SaaS teams manage multiple event workflows?", a: "UrPass supports organizer workflows for registrations, tickets, passes and event entry from one dashboard." },
          { q: "Can I start without a custom setup project?", a: "Yes. Organizers can create an event and start from the self-serve workflow." },
        ],
        ctaTitle: "Use cloud software for event registration and entry",
        ctaDescription: "Give your team a connected event operations workspace.",
      }}
    />
  );
}
