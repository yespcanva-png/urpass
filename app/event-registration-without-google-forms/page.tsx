import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Without Google Forms | Automated QR Passes & Scanning | UrPass",
  description: "Upgrade from Google Forms to professional event registration. Get automated digital QR passes, sub-second door check-in, capacity caps, and zero manual work.",
  keywords: [
    "event registration without Google Forms",
    "event registration without Google Forms online",
    "event registration without Google Forms platform",
    "event registration without Google Forms check in",
    "event registration without Google Forms qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-without-google-forms",
  },
  openGraph: {
    title: "Event Registration Without Google Forms | Automated QR Passes & Scanning | UrPass",
    description: "Upgrade from Google Forms to professional event registration. Get automated digital QR passes, sub-second door check-in, capacity caps, and zero manual work.",
    url: "https://urpass.space/event-registration-without-google-forms",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "GOOGLE FORMS UPGRADE",
        h1: "Replace Google Forms for Event Registration with Automated QR Passes",
        canonicalUrl: "https://urpass.space/event-registration-without-google-forms",
        description: "Upgrade from Google Forms to professional event registration. Get automated digital QR passes, sub-second door check-in, capacity caps, and zero manual work.",
        ctaLabel: "Upgrade from Google Forms Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare with Google Forms",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "Why should I use UrPass instead of Google Forms for event registration?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. While Google Forms only collects text into a spreadsheet, UrPass automatically issues branded digital QR passes, enforces strict capacity limits, provides a 0.28-second mobile scanner, and eliminates manual entrance queues entirely.",
          keyPoints: ["Automated digital QR pass delivery vs. manual email confirmations in Google Forms","0.28s mobile camera door scanning vs. searching printed spreadsheet rows on event day","Automatic capacity caps and 'Sold Out' enforcement vs. accidental overselling","Real-time duplicate scan detection vs. zero protection against forwarded emails"],
        },
        whatIs: {
          title: "Why is Google Forms Insufficient for Event Registration?",
          definition: "Google Forms is a general-purpose survey tool that lacks event-specific capabilities such as automated ticket generation, transactional capacity locking, door check-in scanners, and duplicate entry prevention.",
          details: ["Forces organizers to spend hours manually emailing confirmation tickets or mail merges","Causes severe door bottlenecks as staff search attendee names one by one on paper lists","Oversells venue capacity because Google Forms cannot lock inventory during traffic surges","Leaves events vulnerable to ticket sharing and unverified walk-in attendees"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: ScanLine,
            title: "Automated QR Pass Dispatch",
            desc: "UrPass generates and emails branded digital QR passes automatically upon form completion.",
          },
          {
            icon: Zap,
            title: "Sub-0.3s Mobile Camera Check-In",
            desc: "Scan attendee passes in 0.28s using your phone camera instead of searching paper sheets.",
          },
          {
            icon: Lock,
            title: "Strict Capacity Limits",
            desc: "Registration closes automatically when capacity is reached, preventing accidental overselling.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Detection",
            desc: "Re-scanning any pass sounds an immediate red alert to catch screenshot sharing.",
          },
          {
            icon: CheckCircle2,
            title: "Approval Workflow Engine",
            desc: "Review and approve applicants before releasing admission passes for private events.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Telemetry & Reports",
            desc: "Monitor live door check-in velocity, total attendance, and absentee lists in real time.",
          },
        ],
        deepDiveSections: [
          {
            badge: "PRODUCTIVITY COMPARISON",
            title: "How Switching from Google Forms to UrPass Saves 20+ Hours per Event",
            paragraphs: ["Event organisers using Google Forms spend countless hours setting up third-party mail merge add-ons, designing manual PDF tickets, sending emails one by one, and printing out 20-page paper spreadsheets for entrance desks. On event day, finding names on paper lists takes 45 seconds per person, causing long lobby queues.","UrPass replaces this broken workflow with an all-in-one platform. You publish a beautiful mobile registration page in 2 minutes. When attendees sign up, UrPass handles pass generation, email delivery, and Apple/Google Wallet integration automatically. At the door, volunteers scan QR codes in 0.28 seconds, admitting hundreds of attendees in minutes."],
            bullets: ["Saves 10 to 20 hours of manual spreadsheet work and ticket mail merging per event","Reduces door check-in time from 45 seconds per person to under 3 seconds total","Eliminates overselling with transactional real-time inventory locking","Permanent free plan available—providing professional power with zero cost"],
            takeaway: "UrPass turns amateur, spreadsheet-based event registration into a seamless, automated, and professional operation.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Event Feature","Google Forms","UrPass Event Platform"],
          rows: [{"col1":"Pass / Ticket Delivery","col2":"None (requires manual mail merge add-ons)","col3":"100% automated instant digital QR pass"},{"col1":"Entrance Check-In","col2":"Searching paper sheets or Excel (45s/person)","col3":"0.28s mobile camera QR scanning"},{"col1":"Capacity Limits & Auto-Close","col2":"Manual closure (causes overselling)","col3":"Real-time transactional auto-close"},{"col1":"Duplicate Entry Prevention","col2":"None (attendees share emails freely)","col3":"Atomic sub-150ms duplicate rejection"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Meetup & Community Organisers","desc":"Upgrade from Google Forms to professional registration and fast door check-in.","badge":"COMMUNITY"},{"title":"Workshop & Seminar Hosts","desc":"Enforce strict seating limits and eliminate manual email confirmations.","badge":"WORKSHOPS"},{"title":"College & Student Clubs","desc":"Replace messy spreadsheets with fast mobile QR scanning at campus auditorium doors.","badge":"STUDENT CLUBS"},{"title":"Corporate Training Leaders","desc":"Track verified employee attendance with structured exportable records.","badge":"CORPORATE"}],
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
                    "q": "Why is UrPass better than Google Forms for event registration?",
                    "a": "UrPass is purpose-built for events. It automatically sends digital QR passes, enforces real-time capacity caps, provides a 0.28s mobile camera scanner, stops duplicate ticket sharing, and delivers live attendance telemetry."
          },
          {
                    "q": "Do I need to pay to replace Google Forms with UrPass?",
                    "a": "No. UrPass offers a permanent free tier with no credit card required, allowing you to host free community events with professional QR check-in at zero cost."
          },
          {
                    "q": "Can I collect custom questions like in Google Forms?",
                    "a": "Yes. UrPass has a flexible form builder supporting text fields, dropdowns, radio buttons, checkboxes, and required field rules."
          },
          {
                    "q": "How do attendees receive their tickets?",
                    "a": "Upon completing registration, attendees immediately receive a branded digital QR pass via email and WhatsApp, which they can also add to Apple or Google Wallet."
          },
          {
                    "q": "How do I scan tickets at the door?",
                    "a": "You and your team simply open the UrPass scanner link on your mobile phone browsers and point the camera at attendee QR codes for instant verification."
          },
          {
                    "q": "Can UrPass prevent attendees from forwarding their registration email to friends?",
                    "a": "Yes. Every UrPass QR code is single-use and tracked in real time. Once scanned at the door, any attempt to use the same pass again triggers an immediate red duplicate alert."
          },
          {
                    "q": "Can I export all attendee responses to Excel or Google Sheets?",
                    "a": "Yes. You can export your complete attendee list, including all custom field responses and check-in timestamps, as a CSV or Excel file with one click."
          }
],
        ctaTitle: "Replace Google Forms for Event Registration with Automated QR Passes",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
