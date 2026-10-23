import type { Metadata } from "next";
import { BookOpen, Calendar, CreditCard, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Workshop Ticket Booking Software | UrPass",
  description: "Sell workshop seats through Razorpay, set participant capacity, generate digital tickets and check in attendees with UrPass.",
  keywords: ["workshop ticket booking software","workshop booking payments qr ticketing","sell workshop seats razorpay","workshop ticketing platform","training seminar ticket booking","creator workshop registration"],
  alternates: {
    canonical: "https://urpass.space/workshop-ticket-booking-software",
  },
  openGraph: {
    title: "Workshop Ticket Booking Software | UrPass",
    description: "Sell workshop seats through Razorpay, set participant capacity, generate digital tickets and check in attendees with UrPass.",
    url: "https://urpass.space/workshop-ticket-booking-software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshop Ticket Booking Software | UrPass",
    description: "Sell workshop seats through Razorpay, set participant capacity, generate digital tickets and check in attendees with UrPass.",
  },
};

export default function WorkshopTicketBookingSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "WORKSHOPS & MASTERCLASSES",
        h1: "Workshop Booking, Payments and QR Ticketing",
        canonicalUrl: "https://urpass.space/workshop-ticket-booking-software",
        description: "Sell workshop seats through Razorpay, set participant capacity, generate digital tickets and check in attendees with UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=workshop-ticket-booking-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Sell Out Your Next Workshop with 0% Platform Commission",
        ctaDescription: "Accept UPI and card payments directly into your bank, enforce hard participant seat limits, and verify attendees in <0.3s.",
        directAnswer: {
        "title": "What is Workshop Ticket Booking Software?",
        "summary": "Workshop ticket booking software enables educators, creators, and professional trainers to sell workshop seats online, accept direct payments via Razorpay or Stripe, enforce strict participant capacity limits, generate automated digital QR tickets, and check in participants at the door in under 0.3 seconds.",
        "keyPoints": [
                "Direct payment gateway integration (Razorpay / Stripe) with 0% platform ticket commission",
                "Strict real-time capacity and seat caps that prevent overbooking intimate workshops",
                "Encrypted digital QR tickets delivered to participant WhatsApp chats and email inboxes",
                "Sub-0.3 second smartphone camera scanning for seamless classroom door verification"
        ]
},
        whatIs: {
        "title": "How UrPass Helps Instructors and Creators Run Profitable Workshops",
        "definition": "UrPass eliminates high ticketing aggregator commission cuts and disjointed registration forms. Independent trainers, boutique agencies, and corporate educators can launch high-converting workshop pages, accept instant payments, and automate participant credentialing effortlessly.",
        "details": [
                "Keeps 100% of workshop ticket revenue minus standard payment processor fees",
                "Enforces hard capacity limits so workshops never exceed classroom seating limits",
                "Includes automated calendar (.ics) invites and preparation materials in confirmation emails",
                "Provides rapid smartphone camera check-in to verify paid participants at the seminar door"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Commercial Ticketing Aggregators for Workshops",
        "subtitle": "Why independent workshop educators and trainers keep more profit with UrPass.",
        "headers": [
                "Operational Factor",
                "Ticketing Aggregators (5% to 10% Fee)",
                "UrPass Workshop Platform"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 10% deducted from every workshop ticket",
                        "col3": "0% ticket fee; flat subscription starting from ₹499/mo"
                },
                {
                        "col1": "Payout Schedule",
                        "col2": "Payouts held until 7-14 days after workshop finishes",
                        "col3": "Direct settlement to your bank via Razorpay/Stripe (T+2)"
                },
                {
                        "col1": "Checkout Page Ads",
                        "col2": "Promotes rival workshops and competitor courses",
                        "col3": "100% white-label page focused exclusively on your workshop"
                },
                {
                        "col1": "Door Check-In",
                        "col2": "Manual paper printouts or clumsy desktop searches",
                        "col3": "Sub-0.3s smartphone camera scanner on your personal phone"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SEAT MANAGEMENT",
                "title": "Strict Real-Time Seat Caps Prevent Overcrowded Classrooms",
                "paragraphs": [
                        "Hands-on workshops, coding bootcamps, and culinary masterclasses have strict physical constraints: a classroom with 25 desks cannot accommodate 30 participants without degrading the learning experience. Standard forms that lack inventory locking frequently cause embarrassing overbooking.",
                        "UrPass enforces database-level inventory locks. When an attendee initiates checkout, their seat is temporarily reserved. Once the cap is reached, the registration tier locks automatically and displays a 'Sold Out' status, ensuring you never exceed room capacity."
                ],
                "bullets": [
                        "Real-time seat countdown displays remaining tickets to drive booking urgency",
                        "Automatic tier locking the moment maximum participant capacity is reached",
                        "Early-bird pricing tiers with scheduled automated price increases",
                        "Optional waitlist collection for sold-out workshops to gauge future demand"
                ],
                "takeaway": "Automated inventory caps protect your classroom environment and eliminate overbooking."
        },
        {
                "badge": "COMMUNICATION & MATERIALS",
                "title": "Automated Prerequisite Delivery and WhatsApp Reminders",
                "paragraphs": [
                        "Educational workshops often require attendees to prepare in advance: downloading software, reading case studies, or bringing specific laptop hardware. When organizers rely on manual emails, participants arrive unprepared, delaying instruction.",
                        "UrPass automates participant onboarding. Immediately upon payment, attendees receive a confirmation email and WhatsApp message containing their digital pass, calendar invite, venue coordinates, and links to prerequisite course files."
                ],
                "bullets": [
                        "Automated calendar invites (.ics) sync session times directly to participant calendars",
                        "Attach prerequisite reading links and software installation instructions",
                        "WhatsApp ticket delivery achieves 98% open rates and reduces morning no-shows",
                        "Automated pre-workshop reminder messages sent 24 hours prior to the session"
                ],
                "takeaway": "Automated onboarding ensures participants arrive prepared and on time."
        }
],
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
        features: [
          {
            icon: BookOpen,
            title: "Strict Seat Capacity Caps",
            desc: "Prevent overbooking with automated inventory locking that closes sold-out tiers.",
          },
          {
            icon: CreditCard,
            title: "Direct Razorpay & UPI",
            desc: "Accept UPI, cards, and net banking with direct bank payouts and 0% ticket fees.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Tickets",
            desc: "Issue scannable digital passes delivered via WhatsApp, Apple Wallet, and email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Check-In",
            desc: "Verify enrolled participants at the classroom door using any smartphone camera.",
          },
          {
            icon: Calendar,
            title: "Calendar Integration",
            desc: "Automated .ics calendar invites sync workshop dates directly to attendee calendars.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Locking",
            desc: "Prevent ticket forwarding and pass reuse with database-level atomic row locks.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Workshop Page",
                "desc": "Define workshop title, date, venue, syllabus, and participant capacity limits."
        },
        {
                "n": "02",
                "title": "Connect Payment Gateway",
                "desc": "Link Razorpay or Stripe to receive 100% of ticket sales directly into your bank."
        },
        {
                "n": "03",
                "title": "Share Booking Link",
                "desc": "Publish your high-converting, ad-free booking page across social media and newsletter."
        },
        {
                "n": "04",
                "title": "Participants Buy Tickets",
                "desc": "Attendees complete checkout via UPI or cards and receive instant digital passes."
        },
        {
                "n": "05",
                "title": "Scan at the Door",
                "desc": "Verify participants at the seminar door in <0.3s using your smartphone camera."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Workshop Ticket Booking?",
        "subtitle": "Educators, boutique training firms, and independent creator instructors.",
        "personas": [
                {
                        "badge": "CREATORS",
                        "title": "Creator Masterclasses",
                        "desc": "Sell weekend photography, design, and content creation workshops directly to your audience."
                },
                {
                        "badge": "TECH",
                        "title": "Coding Bootcamps & AI Workshops",
                        "desc": "Collect developer registrations, enforce laptop requirements, and verify enrolled students."
                },
                {
                        "badge": "BUSINESS",
                        "title": "Corporate Management Seminars",
                        "desc": "Sell executive leadership seats with corporate GST tax invoices and calendar invites."
                },
                {
                        "badge": "WELLNESS",
                        "title": "Fitness & Yoga Immersions",
                        "desc": "Cap studio capacity, collect payments with zero platform fees, and scan attendees at the door."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Operates at the Workshop Door",
        "subtitle": "Instant attendee verification that starts your workshop on schedule.",
        "description": "When participants arrive at the classroom or studio, they present their digital pass on their smartphone screen or WhatsApp chat. Instructors or door staff point their mobile camera at the pass. UrPass validates payment and enrollment in under 0.3 seconds, signaling green entry.",
        "points": [
                "No searching through paper student rosters or cross-referencing bank statements.",
                "Works smoothly on any smartphone browser with zero app installation.",
                "Quick search by student name or email allows manual check-in if needed.",
                "Download attendance records to issue completion certificates after class."
        ]
},
        faqs: [
        {
                "q": "What payment methods can workshop participants use to buy tickets?",
                "a": "In India, participants can pay using all UPI apps (Google Pay, PhonePe, Paytm, Cred), debit/credit cards, and net banking via direct Razorpay integration. Internationally, participants pay via credit card, Apple Pay, and Google Pay through Stripe."
        },
        {
                "q": "Does UrPass take a cut of my workshop ticket sales?",
                "a": "No. UrPass charges 0% platform ticket commission. You keep 100% of your ticket price minus standard gateway interchange fees and your flat UrPass monthly subscription."
        },
        {
                "q": "What happens when all workshop seats are sold out?",
                "a": "Once your configured capacity limit is reached, UrPass automatically locks that tier, displays a 'Sold Out' badge on the booking form, and prevents any further ticket sales, avoiding overbooking."
        },
        {
                "q": "Can I send preparation materials or meeting links with the ticket?",
                "a": "Yes. You can customize the automated ticket confirmation email to include download links for prerequisite files, venue maps, parking directions, or video conference links."
        },
        {
                "q": "How do I scan participants when they arrive at the workshop venue?",
                "a": "You simply open your event scanner URL on your smartphone browser (Safari or Chrome). Point your camera at the participant's digital pass to verify their ticket in under 0.3 seconds."
        }
],
      }}
    />
  );
}
