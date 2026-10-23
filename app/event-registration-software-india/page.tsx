import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software India | UrPass",
  description: "Manage event registrations, approvals, digital QR passes and check-ins with UrPass. Built for conferences, colleges and event organizers in India.",
  keywords: ["event registration software india","event registration software for indian organizers","event ticketing platform india","upi event registration","qr code event check in india","college symposium registration india","conference registration india"],
  alternates: {
    canonical: "https://urpass.space/event-registration-software-india",
  },
  openGraph: {
    title: "Event Registration Software India | UrPass",
    description: "Manage event registrations, approvals, digital QR passes and check-ins with UrPass. Built for conferences, colleges and event organizers in India.",
    url: "https://urpass.space/event-registration-software-india",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration Software India | UrPass",
    description: "Manage event registrations, approvals, digital QR passes and check-ins with UrPass. Built for conferences, colleges and event organizers in India.",
  },
};

export default function EventRegistrationSoftwareIndiaPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT REGISTRATION INDIA",
        h1: "Event Registration Software for Indian Organizers",
        canonicalUrl: "https://urpass.space/event-registration-software-india",
        description: "Manage event registrations, approvals, digital QR passes and check-ins with UrPass. Built for conferences, colleges and event organizers in India.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=event-registration-software-india",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Modernize Your Event Registration in India",
        ctaDescription: "Launch branded registration forms, accept UPI payments via Razorpay, and verify attendees at the gate in <0.3s. Introductory offer at ₹499/mo.",
        directAnswer: {
        "title": "What is Event Registration Software for India?",
        "summary": "Event registration software for Indian organizers enables event teams to publish custom registration forms, accept direct UPI and card payments via Razorpay, automatically generate digital QR passes, and verify attendees at venue gates in under 0.3 seconds using standard smartphone browsers without requiring dedicated scanner apps.",
        "keyPoints": [
                "Direct Razorpay integration supporting UPI (GPay, PhonePe, Paytm), cards, and net banking",
                "0% platform commission on ticket sales with instant settlement to your own bank account",
                "Instant digital QR pass generation delivered via WhatsApp, Apple Wallet, and email",
                "Sub-0.3 second camera check-in on volunteer smartphones with multi-gate duplicate prevention"
        ]
},
        whatIs: {
        "title": "How UrPass Simplifies Event Management for Indian Organizers",
        "definition": "UrPass is an all-in-one event management platform engineered specifically for Indian conferences, college fests, corporate symposiums, and workshops. It replaces disjointed Google Forms and manual UPI screenshot verification with an automated, end-to-end ticketing and gate entry workflow.",
        "details": [
                "Replaces unverified Google Forms and manual spreadsheet cross-referencing",
                "Eliminates manual verification of UPI transaction screenshots and UTR numbers",
                "Provides branded registration pages with custom questions and approval workflows",
                "Includes real-time entry scanning across unlimited campus or venue entrance gates"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Traditional Event Ticketing Aggregators in India",
        "subtitle": "Why event organizers across India choose UrPass over high-commission platforms.",
        "headers": [
                "Operational Metric",
                "Traditional Indian Ticketing Aggregators",
                "UrPass Platform"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 10% taken from every ticket sale",
                        "col3": "0% commission; flat introductory subscription at ₹499/mo"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Funds held for 7-15 days after event completion",
                        "col3": "Direct settlement to organizer bank via your own Razorpay"
                },
                {
                        "col1": "Attendee Entry Speed",
                        "col2": "Slow manual name lookups or expensive rented barcode hardware",
                        "col3": "Sub-0.3s browser camera scan on volunteer smartphones"
                },
                {
                        "col1": "Ticket Distribution",
                        "col2": "Basic email attachments with frequent spam delivery",
                        "col3": "Instant WhatsApp delivery, Apple Wallet, and responsive web pass"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "PAYMENTS & REVENUE",
                "title": "Native Razorpay Integration: Zero Delays, Zero Ticket Commissions",
                "paragraphs": [
                        "Ticketing aggregators in India routinely deduct 5% to 8% in platform fees and hold ticket revenue until days or weeks after the event concludes. For student committees and event agencies, this creates severe cash flow crises when vendors and caterers require upfront advances.",
                        "UrPass flips this model completely. Organizers connect their verified Razorpay merchant account in 60 seconds. When an attendee buys a ticket via Google Pay, PhonePe, Paytm, or credit card, 100% of the funds flow directly into the organizer's merchant account on standard T+2 rolling settlements. UrPass takes 0% platform commission."
                ],
                "bullets": [
                        "Accept all UPI apps (Google Pay, PhonePe, Paytm, BHIM, Cred) with sub-5s checkout",
                        "Credit cards, debit cards, net banking, and corporate cards supported natively",
                        "Automated GST invoice generation with custom organizer tax details",
                        "Eliminate manual UTR screenshot reviews and fake transaction fraud"
                ],
                "takeaway": "Direct payment gateway integration protects your margins and gives you immediate access to your ticket funds."
        },
        {
                "badge": "GATE ACCESS CONTROL",
                "title": "Sub-Second Smartphone QR Scanning for Indian Venues",
                "paragraphs": [
                        "College symposiums and metro business summits often face massive morning entrance rushes. When registration desks rely on paper rosters or slow desktop spreadsheets, queues spill outside venues and delay program schedules.",
                        "UrPass equips your door team with a web-based smartphone camera scanner that validates passes in less than 300 milliseconds. Volunteers simply scan an organizer QR code to activate the scanner in Safari or Chrome. With atomic database row locking, any ticket presented at Gate 1 is instantly invalidated across Gate 2 and Gate 3, blocking duplicate screenshot sharing."
                ],
                "bullets": [
                        "No mobile app downloads required for door volunteers or attendees",
                        "Sub-0.3 second validation clears 1,000 attendees in under 15 minutes",
                        "Atomic row locking prevents screenshot sharing across multiple entrance gates",
                        "Real-time attendance telemetry tracks arrival rates and gate congestion live"
                ],
                "takeaway": "High-speed browser camera scanning eliminates queue congestion without expensive equipment rentals."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: CreditCard,
            title: "Instant UPI & Razorpay",
            desc: "Collect ticket payments directly into your bank via Google Pay, PhonePe, Paytm, cards, and net banking.",
          },
          {
            icon: QrCode,
            title: "Branded Digital QR Passes",
            desc: "Automatically issue encrypted, high-contrast digital tickets customized with your event branding.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Turn volunteer smartphones into high-speed entrance scanners with zero mobile app downloads.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Blocking",
            desc: "Prevent ticket screenshot sharing across multiple gates with database-level row locking.",
          },
          {
            icon: Users,
            title: "Custom Form Builder",
            desc: "Collect attendee details, department tracks, food preferences, and file uploads seamlessly.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Monitor check-in percentages, arrival flow, and gate activity in real time on an organizer dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Define registration questions, ticket tiers, and capacity limits in under 3 minutes."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant gateway to receive 100% of ticket sales directly."
        },
        {
                "n": "03",
                "title": "Publish Registration Page",
                "desc": "Share your high-converting, mobile-responsive event page with attendees."
        },
        {
                "n": "04",
                "title": "Automatic Pass Issuance",
                "desc": "Attendees receive instant digital QR passes via WhatsApp, Apple Wallet, and email."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door volunteers scan attendee QR passes using any phone camera for instant green verification."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass Across India?",
        "subtitle": "Built for event teams who need reliable ticketing and rapid gate operations.",
        "personas": [
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Technical Symposiums",
                        "desc": "Manage thousands of student registrations across technical tracks, paper presentations, and cultural nights."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Summits & Tech Conferences",
                        "desc": "Collect delegate fees, generate digital badges, and streamline multi-track check-ins in Bengaluru, Mumbai, and Delhi."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Training Workshops & Masterclasses",
                        "desc": "Sell limited seats with instant UPI checkout and verify enrolled participants at the door in seconds."
                },
                {
                        "badge": "HACKATHONS",
                        "title": "24-48 Hour Hackathons",
                        "desc": "Review developer applications, approve hacker teams, and track on-site meal and session check-ins."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Smartphone Check-In Operates at Indian Venues",
        "subtitle": "Lightning-fast verification that keeps event entry moving smoothly.",
        "description": "When an attendee registers or purchases a ticket, UrPass immediately generates a cryptographically signed digital pass. At the venue, door volunteers open the UrPass scanner URL on their smartphone browser. Pointing the camera at the attendee's phone validates the pass in <0.3s with an audible chime and green screen confirmation.",
        "points": [
                "Works smoothly under bright outdoor sunlight and low-light auditorium environments.",
                "Volunteers never need access to your master organizer account or financial balances.",
                "Instant fallback search by name, email, or registration ID if a phone battery is dead.",
                "Real-time sync prevents attendees from sharing ticket screenshots across multiple entry points."
        ]
},
        faqs: [
        {
                "q": "How does UrPass compare to Google Forms for Indian event registration?",
                "a": "Google Forms only collects form data into a spreadsheet. It cannot accept automated UPI payments, prevent fake transaction IDs, generate digital QR tickets, or validate entries at the door. UrPass provides the complete workflow from branded form to instant Razorpay payment, automatic QR pass delivery, and sub-0.3s phone scanning."
        },
        {
                "q": "What payment methods are supported for Indian attendees?",
                "a": "Through direct Razorpay integration, attendees can pay using all major UPI apps including Google Pay, PhonePe, Paytm, BHIM, and Cred, as well as Indian debit cards, credit cards, and net banking with instant payment confirmation."
        },
        {
                "q": "Does UrPass charge a percentage commission on Indian ticket sales?",
                "a": "No. UrPass charges 0% platform ticket commission. Organizers keep 100% of their ticket price and pay only standard gateway interchange fees directly to Razorpay. Subscriptions start with an transparent plans starting from ₹499/month."
        },
        {
                "q": "Can college symposium organizers manage free and paid events simultaneously?",
                "a": "Yes. UrPass supports free RSVP registrations, approval-based applications, and multi-tier paid tickets within the same event, allowing college teams to manage department fests effortlessly."
        },
        {
                "q": "How do volunteers scan tickets on the event day?",
                "a": "Volunteers do not need to download any app from Google Play or the App Store. The organizer generates a secure scanner link or QR code. Volunteers scan it with their phone camera to launch the scanner in Safari or Chrome and start scanning immediately."
        }
],
      }}
    />
  );
}
