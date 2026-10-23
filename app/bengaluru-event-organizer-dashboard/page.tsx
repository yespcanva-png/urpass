import type { Metadata } from "next";
import { BarChart3, CreditCard, FileSpreadsheet, LayoutDashboard, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Organizer Dashboard Bengaluru | UrPass",
  description: "Manage Bengaluru event registrations, approvals, digital passes and live attendance through a centralized organizer dashboard.",
  keywords: ["event organizer dashboard bengaluru","bengaluru event management dashboard","live attendance dashboard bangalore","event telemetry software bengaluru","event ticketing dashboard"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-event-organizer-dashboard",
  },
  openGraph: {
    title: "Event Organizer Dashboard Bengaluru | UrPass",
    description: "Manage Bengaluru event registrations, approvals, digital passes and live attendance through a centralized organizer dashboard.",
    url: "https://urpass.space/bengaluru-event-organizer-dashboard",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Organizer Dashboard Bengaluru | UrPass",
    description: "Manage Bengaluru event registrations, approvals, digital passes and live attendance through a centralized organizer dashboard.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEventOrganizerDashboardPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ORGANIZER DASHBOARD",
        h1: "Event Organizer Dashboard for Registrations and Attendance",
        canonicalUrl: "https://urpass.space/bengaluru-event-organizer-dashboard",
        description: "Manage Bengaluru event registrations, approvals, digital passes and live attendance through a centralized organizer dashboard.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-event-organizer-dashboard",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Manage Events from a Single Dashboard",
        ctaDescription: "Monitor real-time ticket sales, manage attendee approvals, coordinate gate scanners, and track live in-venue attendance on one unified portal.",
        directAnswer: {
        "title": "What is the UrPass Event Organizer Dashboard for Bengaluru?",
        "summary": "The UrPass event organizer dashboard in Bengaluru is a centralized mission control center for managing ticket sales, attendee registration approvals, WhatsApp pass dispatches, multi-gate scanning staff, and live attendance telemetry. It provides instant visibility into registration velocity, revenue settlement, and door throughput with 0% ticket fees.",
        "keyPoints": [
                "Consolidated control center for registrations, ticketing tiers, and approval queues",
                "Live attendance telemetry updates in real time as door volunteers scan passes",
                "Direct Razorpay revenue tracking with automated GST invoicing reconciliations",
                "Role-based team permissions: assign scanner links without exposing financial metrics"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Directors Rely on the UrPass Dashboard",
        "definition": "Managing a complex event in Bengaluru often means juggling separate tools for registration, email delivery, ticketing, and check-in. The UrPass dashboard unifies all event operations into a single fast, responsive interface.",
        "details": [
                "Real-time registration counters track ticket sales pacing and capacity thresholds",
                "Instant approval queue management: review, approve, or waitlist applicants in bulk",
                "Coordinate scanning teams across multiple entrance gates with live throughput metrics",
                "Download clean CSV exports of attendee records, survey answers, and scan timestamps anytime"
        ]
},
        keyFactsTable: {
        "title": "UrPass Dashboard vs Disconnected Event Tools",
        "subtitle": "Why event producers switch to UrPass unified mission control.",
        "headers": [
                "Dashboard Capability",
                "Disconnected Point Solutions",
                "UrPass Unified Dashboard"
        ],
        "rows": [
                {
                        "col1": "Data Synchronization",
                        "col2": "Data scattered across forms, payment gateways, and scanners",
                        "col3": "100% unified real-time cloud synchronization"
                },
                {
                        "col1": "Live Attendance Tracking",
                        "col2": "Requires calling gate staff on phone to get headcounts",
                        "col3": "Live progress bar and arrival velocity updated per scan"
                },
                {
                        "col1": "Team Permissions",
                        "col2": "Staff share one master login or have full financial access",
                        "col3": "Role-based scan links that isolate scanner staff from finances"
                },
                {
                        "col1": "Financial Overview",
                        "col2": "Aggregator holds funds; manual reconciliation needed",
                        "col3": "Direct Razorpay settlement tracking with 0% platform cuts"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "REAL-TIME TELEMETRY",
                "title": "Live Attendance Telemetry and Gate Ingress Analytics",
                "paragraphs": [
                        "On event morning, event directors need to know whether attendees are arriving on schedule, which gates have long queues, and when the main auditorium has reached seating capacity.",
                        "The UrPass dashboard displays live telemetry that refreshes with every volunteer scan. View total check-ins against confirmed registrations, monitor door-by-door scan rates, and dynamically redirect attendee flow."
                ],
                "bullets": [
                        "Live visual progress bar displays overall event attendance percentage",
                        "Breakout hall occupancy telemetry prevents auditorium overcrowding",
                        "Gate-by-gate scan velocity charts identify slow entrance points",
                        "One-click search allows dashboard admins to manually check in attendees"
                ],
                "takeaway": "Live attendance telemetry gives organizers complete control on event day."
        },
        {
                "badge": "TEAM ACCESS",
                "title": "Role-Based Team Permissions with Isolated Scanner Links",
                "paragraphs": [
                        "Event producers work with temporary volunteers, student coordinators, and venue security staff who need to validate tickets but should not have access to financial earnings or attendee personal contact lists.",
                        "UrPass provides secure, isolated scanning links. Coordinators can scan passes in sub-0.3s on mobile browsers without needing an organizer login, keeping sensitive revenue and customer data strictly protected."
                ],
                "bullets": [
                        "Generate unique scan links for volunteers with zero login credentials required",
                        "Restricted permissions prevent door staff from viewing financial or sales data",
                        "Revoke scanning access with a single click after event conclusion",
                        "Track scan counts by volunteer device to measure staff performance"
                ],
                "takeaway": "Isolated scanner links protect confidential data while empowering volunteers."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: LayoutDashboard,
            title: "Unified Control Center",
            desc: "Manage registrations, approvals, ticket categories, and passes from one interface.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Telemetry",
            desc: "Track live attendance, check-in velocity, and venue capacity percentages in real time.",
          },
          {
            icon: Users,
            title: "Role-Based Permissions",
            desc: "Deploy volunteer scanning links without exposing revenue or attendee databases.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Track ticket payments directly settling into your connected Razorpay merchant account.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant CSV Exports",
            desc: "Download complete attendee rosters with answers and exact scan timestamps anytime.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in attendees using smartphone cameras with zero hardware rentals.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Access Dashboard",
                "desc": "Log in to your UrPass organizer dashboard on any desktop, tablet, or smartphone."
        },
        {
                "n": "02",
                "title": "Configure Event Details",
                "desc": "Set up registration forms, ticket tiers, capacity limits, and approval workflows."
        },
        {
                "n": "03",
                "title": "Share Scanner Links",
                "desc": "Send secure browser scanning links to gate volunteers and security teams."
        },
        {
                "n": "04",
                "title": "Monitor Ingress Live",
                "desc": "Watch live attendance counts and door throughput update with every scan."
        },
        {
                "n": "05",
                "title": "Export Reports",
                "desc": "Download comprehensive attendance and financial CSV reports post-event."
        }
],
        whoShouldUse: {
        "title": "Who Uses the UrPass Organizer Dashboard in Bengaluru?",
        "subtitle": "Event producers and operations leads across Karnataka's event scene.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "Summit Directors",
                        "desc": "Manage enterprise conferences, keynote tracks, and sponsor attendee reporting."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Meetup Organizers",
                        "desc": "Review applicant approvals, monitor RSVPs, and track community check-ins."
                },
                {
                        "badge": "CAMPUS",
                        "title": "College Fest Convenors",
                        "desc": "Coordinate student volunteer scanning teams across multiple campus gates."
                },
                {
                        "badge": "EXPOS",
                        "title": "Exhibition Managers",
                        "desc": "Track visitor ingress velocity and hall occupancy across massive trade pavilions."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Live Telemetry Syncs with the Dashboard",
        "subtitle": "Instant cloud synchronization that powers real-time analytics.",
        "description": "When a gate volunteer points their smartphone camera at an attendee's digital pass, UrPass validates the credentials in under 300 milliseconds. The check-in event immediately syncs with your cloud database, updating your central dashboard's live attendance progress bar and arrival counts instantly.",
        "points": [
                "Sub-second cloud synchronization reflects check-ins across all dashboard screens.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Can I access the UrPass organizer dashboard on my mobile phone?",
                "a": "Yes. The UrPass dashboard is fully responsive and optimized for mobile browsers, iPads, and desktops, allowing you to manage your event from anywhere in the venue."
        },
        {
                "q": "Can multiple team members manage the event simultaneously?",
                "a": "Yes. You can assign role-based access for co-organizers, registration desk staff, and gate volunteers without sharing passwords."
        },
        {
                "q": "Does the dashboard show how much revenue has been collected?",
                "a": "Yes. The dashboard displays gross ticket sales, breakdown by ticket tier, and settlement references directly from your connected Razorpay merchant account."
        },
        {
                "q": "How fast do attendance numbers update on the dashboard?",
                "a": "In real time. As soon as a volunteer scans a QR pass at the entrance, your dashboard attendance metrics update in under a second."
        },
        {
                "q": "What pricing applies to the UrPass organizer dashboard?",
                "a": "Full dashboard access is included with all UrPass plans, starting from ₹499/month (then ₹999/month), with 0% platform ticket fees."
        }
],
      }}
    />
  );
}
