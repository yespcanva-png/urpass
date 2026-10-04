import type { Metadata } from "next";
import { Users, ShieldCheck, Ticket, QrCode, Calendar, Smartphone, Zap, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Club Event Management Software | URPASS",
  description:
    "Empower university student clubs and societies to manage registrations, issue digital QR passes, and check in attendees in 0.28s with zero commission.",
  keywords: [
    "student club event management software",
    "college club event registration",
    "university society ticketing platform",
    "student council event software",
    "campus club pass generator",
  ],
  alternates: { canonical: "https://urpass.space/student-club-event-management" },
  openGraph: {
    title: "Student Club Event Management Software | URPASS",
    description: "Empower university student clubs to run registrations, passes, and QR gate entry with 0% commission.",
    url: "https://urpass.space/student-club-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function StudentClubEventManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "STUDENT SOCIETIES & CLUBS",
        h1: "Student Club Event Management Software",
        canonicalUrl: "https://urpass.space/student-club-event-management",
        description:
          "Give elected club leads and faculty coordinators a modern toolkit to launch registrations, verify member IDs, issue custom QR passes, and check in 1,000+ students without gate delays.",
        ctaLabel: "Launch Free Club Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Campus Platform",
        secondaryCtaHref: "/campus-event-management-platform",
        directAnswer: {
          title: "How Do University Student Clubs Run Events on URPASS?",
          summary:
            "URPASS provides student clubs (coding clubs, cultural societies, robotics teams, sports councils) with a frictionless event portal. Club coordinators create branded registration forms with student roll-number capture, issue instant digital QR passes with custom club logos, and check in attendees at campus doors in under 0.28 seconds using mobile phone cameras.",
          keyPoints: [
            "Free for Student Clubs: ₹0 platform fee for free events and club orientations",
            "Student ID Verification: Collect roll numbers, departments, and college ID card uploads",
            "Volunteer Mobile Scanner: Student volunteers scan passes via mobile browser without app downloads",
            "Direct Payment Settlement: Connect club UPI or college gateway for paid fest workshops",
          ],
        },
        features: [
          { icon: Users, title: "Club Member & Volunteer Access", desc: "Add club executive members with event management roles and assign scanner PINs to freshman volunteers." },
          { icon: QrCode, title: "Custom Club Badges", desc: "Design event tickets in the Ticket Studio featuring club emblems, sponsor banners, and anti-screenshot security." },
          { icon: Smartphone, title: "0.28s Mobile Scanner", desc: "Scan passes at auditorium doors or club rooms in under 0.28s with audible confirmation and duplicate entry alerts." },
          { icon: Zap, title: "Instant UPI Ticketing", desc: "Sell passes for inter-college tournaments or guest masterclasses directly via Google Pay and PhonePe with 0% commission." },
          { icon: ShieldCheck, title: "Capacity & Waitlist Control", desc: "Enforce room limits for workshops with automatic waitlist queueing when club sessions fill up." },
          { icon: Calendar, title: "Attendance Roster Export", desc: "Download timestamped check-in records to provide official attendance slips and participation certificates." },
        ],
        faqs: [
          { q: "Is URPASS free for college student clubs?", a: "Yes! URPASS is permanently free for free student events and workshops up to 50 attendees, with affordable student club tiers for larger cultural events." },
          { q: "Can we collect student roll numbers and department names?", a: "Yes. Custom registration fields allow you to mandate student roll numbers, branches, years of study, and student ID photos." },
          { q: "Do volunteers need an account to scan passes?", a: "No. Student volunteers simply open a secure link on their phone browser, enter an event PIN, and scan passes instantly." },
        ],
        relatedLinks: [
          { title: "Campus Event Management Platform", href: "/campus-event-management-platform", category: "Product" },
          { title: "College Event Registration Software", href: "/college-event-registration-software", category: "Product" },
          { title: "Technical Fest Registration Software", href: "/tech-fest-registration-software", category: "Use Case" },
          { title: "Placement Drive Registration Software", href: "/placement-drive-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
