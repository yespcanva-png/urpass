import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with Capacity Limit & Real-Time Headcount Caps | UrPass",
  description: "Set strict attendee capacity limits and prevent overselling. UrPass automatically closes registration and manages waitlists when venue limits are reached.",
  keywords: [
    "event registration capacity limit",
    "event registration capacity limit online",
    "event registration capacity limit platform",
    "event registration capacity limit check in",
    "event registration capacity limit qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-with-capacity-limit",
  },
  openGraph: {
    title: "Event Registration with Capacity Limit & Real-Time Headcount Caps | UrPass",
    description: "Set strict attendee capacity limits and prevent overselling. UrPass automatically closes registration and manages waitlists when venue limits are reached.",
    url: "https://urpass.space/event-registration-with-capacity-limit",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CAPACITY & INVENTORY CONTROL",
        h1: "Event Registration with Strict Capacity Limits & Automated Sold-Out Controls",
        canonicalUrl: "https://urpass.space/event-registration-with-capacity-limit",
        description: "Set strict attendee capacity limits and prevent overselling. UrPass automatically closes registration and manages waitlists when venue limits are reached.",
        ctaLabel: "Set Capacity Limits Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Capacity Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How do I set a strict capacity limit on event registration?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. With UrPass, organisers set an exact headcount cap. The system decrements available spots in real time during checkout and automatically closes registration or activates a waitlist the second the limit is reached.",
          keyPoints: ["Set global event capacity limits or tier-specific seat caps (e.g. VIP 50, Regular 200)","Real-time ticket inventory decrementing stops overselling during registration rushes","Automatic 'Sold Out' status switch with option to collect waitlist registrations","Live door check-in telemetry tracks real-time venue occupancy against fire safety limits"],
        },
        whatIs: {
          title: "What is Event Registration with Capacity Limit?",
          definition: "Event registration with capacity limit is an automated inventory management system that strictly caps the number of tickets issued, ensuring venues never exceed legal fire-code occupancy or catering limits.",
          details: ["Eliminates embarrassing overselling situations and venue overcrowding","Automatically updates public registration page status from 'Register' to 'Sold Out'","Allows independent caps across multiple ticket tiers, workshops, and breakout rooms","Provides live venue occupancy tracking during the event"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Users,
            title: "Strict Headcount Caps",
            desc: "Set precise numerical limits on total event capacity and individual ticket categories.",
          },
          {
            icon: Lock,
            title: "Real-Time Inventory Locks",
            desc: "Prevents race conditions during ticket rushes so you never issue more tickets than available.",
          },
          {
            icon: Zap,
            title: "Automated Sold-Out State",
            desc: "Registration form dynamically switches to sold out the moment the last ticket is claimed.",
          },
          {
            icon: CheckCircle2,
            title: "Multi-Tier Category Limits",
            desc: "Allocate separate limits for Workshop A (30 seats), Workshop B (40 seats), and Main Hall (300 seats).",
          },
          {
            icon: ShieldCheck,
            title: "Real-Time Venue Headcount",
            desc: "Monitor live inside-the-room headcount as guests are scanned in and out.",
          },
          {
            icon: BarChart3,
            title: "Instant Capacity Adjustments",
            desc: "Increase or decrease capacity limits on the fly from your organizer dashboard.",
          },
        ],
        deepDiveSections: [
          {
            badge: "FIRE SAFETY & OCCUPANCY",
            title: "Why Free Form Tools Fail at Capacity Management",
            paragraphs: ["When event organizers use Google Forms or Typeform for events with limited seats, these tools do not possess real-time transactional locking. If 50 people submit a form simultaneously for the final 5 available seats, all 50 submissions succeed, resulting in severe overselling and venue compliance violations.","UrPass utilizes transactional database inventory decrementing. When an attendee begins checkout, a temporary reservation lock holds the seat. If the transaction succeeds, the inventory decrements permanently; if abandoned, the seat returns to the pool. When capacity hits zero, subsequent visitors instantly see a clean 'Sold Out' banner."],
            bullets: ["Transactional inventory management eliminates overselling completely","Supports independent capacity limits for sub-sessions and keynote tracks","Live door check-in monitors current inside-venue occupancy against legal limits","Enables instant ticket releases if reserved spots are cancelled"],
            takeaway: "UrPass ensures flawless venue compliance, eliminating overselling risks and delivering smooth capacity management.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Capacity Control Feature","Google Forms / Basic Forms","UrPass Capacity Engine"],
          rows: [{"col1":"Real-Time Inventory Lock","col2":"None (oversells during traffic surges)","col3":"Transactional real-time seat lock"},{"col1":"Automated 'Sold Out' Closure","col2":"Requires manual form disabling","col3":"100% automated instant closure"},{"col1":"Tier / Workshop-Specific Limits","col2":"Impossible without complex scripts","col3":"Native support for multi-tier seat caps"},{"col1":"Live Venue Occupancy Tracking","col2":"Zero occupancy visibility","col3":"Real-time in-venue headcount telemetry"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Hands-on Tech Workshops","desc":"Cap attendance strictly to available lab seats and computer workstations.","badge":"WORKSHOPS"},{"title":"Private Dining & Galas","desc":"Ensure guest numbers strictly match table seating and catering agreements.","badge":"GALAS"},{"title":"Fire-Regulated Auditoriums","desc":"Maintain strict compliance with municipal venue occupancy limits.","badge":"VENUES"},{"title":"Fitness Classes & Retreats","desc":"Cap session sizes to maintain personal instruction quality.","badge":"FITNESS"}],
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
                    "q": "How does UrPass prevent overselling when capacity is reached?",
                    "a": "UrPass uses transactional database inventory locks. When the final available ticket is claimed, the registration page automatically transitions to 'Sold Out' in real time, preventing further submissions."
          },
          {
                    "q": "Can I set different capacity limits for different ticket tiers?",
                    "a": "Yes. You can assign independent capacity limits to General Admission, VIP passes, Speaker badges, and specific workshop sessions."
          },
          {
                    "q": "Can I increase the capacity limit later if the venue expands?",
                    "a": "Yes. You can increase or decrease the ticket limit at any time from your organizer dashboard, and registration will automatically re-open if spots become available."
          },
          {
                    "q": "What happens when an attendee cancels their ticket?",
                    "a": "When you cancel or delete an attendee registration in the dashboard, their spot is immediately returned to the available inventory pool."
          },
          {
                    "q": "Can I track how many people are currently inside the venue?",
                    "a": "Yes. The live ops dashboard displays total scanned-in attendees in real time, helping you monitor actual inside-the-room occupancy."
          },
          {
                    "q": "Do attendees receive a message when an event sells out?",
                    "a": "Yes. Visitors to the registration page see an attractive, clear 'Registration Closed / Sold Out' notice."
          },
          {
                    "q": "Is capacity limit management available on free plans?",
                    "a": "Yes. All UrPass plans include full capacity limit configuration and automated sold-out controls."
          }
],
        ctaTitle: "Event Registration with Strict Capacity Limits & Automated Sold-Out Controls",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
