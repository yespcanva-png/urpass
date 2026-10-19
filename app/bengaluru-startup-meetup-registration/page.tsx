import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Startup Meetup Registration Bengaluru | UrPass",
  description: "Run Bengaluru startup meetups with online RSVP registration, attendee approval, QR passes and simple entrance scanning.",
  keywords: ["bengaluru startup meetup registration","startup event registration bangalore","founder meetup rsvp bengaluru","demo day ticketing bangalore","pitch event check in software"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-startup-meetup-registration",
  },
  openGraph: {
    title: "Startup Meetup Registration Bengaluru | UrPass",
    description: "Run Bengaluru startup meetups with online RSVP registration, attendee approval, QR passes and simple entrance scanning.",
    url: "https://urpass.space/bengaluru-startup-meetup-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Meetup Registration Bengaluru | UrPass",
    description: "Run Bengaluru startup meetups with online RSVP registration, attendee approval, QR passes and simple entrance scanning.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruStartupMeetupRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "STARTUP MEETUPS BENGALURU",
        h1: "Startup Meetup Registration Platform in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-startup-meetup-registration",
        description: "Run Bengaluru startup meetups with online RSVP registration, attendee approval, QR passes and simple entrance scanning.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-startup-meetup-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Host Curated Startup Meetups and Founder Mixers",
        ctaDescription: "Collect RSVPs, screen attendee profiles, issue mobile QR passes, and verify guests at the door in under 0.3 seconds.",
        directAnswer: {
        "title": "What is the Best Startup Meetup Registration Platform for Bengaluru?",
        "summary": "UrPass is a lightweight, high-speed startup meetup registration platform for Bengaluru. It enables community organizers to publish branded RSVP pages, approve or waitlist applicants, collect ticket fees via Razorpay with 0% platform commission, and check in founders and investors at co-working spaces in under 0.3 seconds.",
        "keyPoints": [
                "Curated application and approval workflows to screen founders, builders, and investors",
                "Free RSVP registration and paid ticketing support with 0% platform ticket commission",
                "Instant digital QR passes delivered via WhatsApp, Apple Wallet, and email",
                "Sub-0.3s smartphone camera check-in for smooth co-working and rooftop venue entry"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Startup Communities Choose UrPass",
        "definition": "From Koramangala co-working hubs to Indiranagar founder cafes and HSR Layout incubators, Bengaluru's startup community thrives on high-density networking. UrPass makes organizing community meetups effortless, professional, and fraud-proof.",
        "details": [
                "Replaces unvetted Google Forms with curated approval workflows",
                "Prevents uninvited walk-ins and overcrowding at limited-capacity venues",
                "Sends dynamic passes straight to attendee WhatsApp chats with venue directions",
                "Exports clean founder and investor contact lists for post-meetup follow-ups"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Generic RSVP Forms for Bengaluru Startup Meetups",
        "subtitle": "Why founder community leads switch to UrPass for curated gatherings.",
        "headers": [
                "Community Need",
                "Generic RSVP Forms (Google Forms / Luma)",
                "UrPass Startup Meetup Platform"
        ],
        "rows": [
                {
                        "col1": "Applicant Screening",
                        "col2": "Clunky spreadsheet rows without automated approval triggers",
                        "col3": "One-click approval dashboard with automated pass dispatch"
                },
                {
                        "col1": "Local Payment Support",
                        "col2": "Limited; relies on international Stripe card checkout",
                        "col3": "Native Razorpay integration supporting all UPI apps (GPay, PhonePe)"
                },
                {
                        "col1": "Venue Door Check-In",
                        "col2": "Manual paper list ticking or slow app searches",
                        "col3": "Sub-0.3s camera check-in directly in mobile phone browsers"
                },
                {
                        "col1": "Capacity Locking",
                        "col2": "Forms stay open when full, causing room overcrowding",
                        "col3": "Strict real-time seat caps that close registration automatically"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CURATION & SCREENING",
                "title": "Curate Attendee Profiles with One-Click Approvals",
                "paragraphs": [
                        "Founder dinners, angel investor pitch sessions, and product teardowns often have limited seating and strict audience criteria. Allowing random unverified RSVPs leads to mismatched crowds and wasted networking time.",
                        "UrPass allows organizers to enable application review workflows. Prospective attendees submit their startup name, funding stage, and LinkedIn profile. Community leads review profiles on an organizer dashboard and approve or waitlist candidates with a single tap, triggering automatic pass dispatch."
                ],
                "bullets": [
                        "Capture startup name, stage (Bootstrapped, Seed, Series A), and LinkedIn profile",
                        "One-click batch approval with automated acceptance emails and WhatsApp passes",
                        "Automated waitlist collection when venue capacity is reached",
                        "Custom questions for investor focus areas or founder pitch topics"
                ],
                "takeaway": "Curated application workflows ensure high-signal networking for startup gatherings."
        },
        {
                "badge": "VENUE ENTRY",
                "title": "Frictionless Check-In at Co-Working Spaces and Cafes",
                "paragraphs": [
                        "Startup meetups hosted at co-working spaces or private cafes in Koramangala or HSR Layout often lack dedicated reception staff. Community hosts need a check-in solution that works instantly on their personal phones without complex setup.",
                        "With UrPass, community hosts simply open their scanner URL on their mobile browser. Pointing the camera at the attendee's WhatsApp pass validates identity in under 0.3 seconds with an audible green chime, keeping lobby entry flowing smoothly."
                ],
                "bullets": [
                        "Zero app downloads; hosts scan passes on their personal phones",
                        "Sub-0.3s scan speed prevents entrance bottlenecks at cafe doors",
                        "Atomic row locking prevents ticket screenshot sharing among friends",
                        "Real-time headcount telemetry ensures venue fire safety compliance"
                ],
                "takeaway": "Fast smartphone scanning creates a polished first impression for your community brand."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Users,
            title: "Curated Approval Workflows",
            desc: "Screen founder and investor applications before issuing event entrance credentials.",
          },
          {
            icon: CreditCard,
            title: "Paid & Free RSVP Support",
            desc: "Host free community meetups or paid pitch nights with 0% platform ticket commissions.",
          },
          {
            icon: QrCode,
            title: "Encrypted Digital Passes",
            desc: "Issue scannable mobile passes delivered directly via WhatsApp and transactional email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan attendees at the door in milliseconds using standard smartphone browsers.",
          },
          {
            icon: ShieldCheck,
            title: "Strict Venue Capacity Caps",
            desc: "Prevent overcrowding at co-working spaces with automated inventory locking.",
          },
          {
            icon: BarChart3,
            title: "Post-Event Lead Export",
            desc: "Download verified attendee lists to CSV for community newsletters and follow-ups.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Meetup Page",
                "desc": "Configure event details, date, venue, capacity limits, and screening questions."
        },
        {
                "n": "02",
                "title": "Review Applications",
                "desc": "Screen founder and builder applications and approve selected attendees in batch."
        },
        {
                "n": "03",
                "title": "Issue Digital Passes",
                "desc": "Approved guests receive encrypted digital QR passes via WhatsApp and email."
        },
        {
                "n": "04",
                "title": "Scan at the Entrance",
                "desc": "Scan attendee passes in <0.3s using your phone camera as guests arrive."
        },
        {
                "n": "05",
                "title": "Follow Up with Attendees",
                "desc": "Export verified attendee contact lists for post-event community updates."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Startup Meetups in Bengaluru?",
        "subtitle": "Venture funds, angel networks, incubators, and founder communities.",
        "personas": [
                {
                        "badge": "FOUNDERS",
                        "title": "Founder Dinners & Peer Mixers",
                        "desc": "Host intimate curated dinners for seed and growth-stage startup founders."
                },
                {
                        "badge": "PITCH NIGHTS",
                        "title": "Demo Days & Pitch Competitions",
                        "desc": "Register investor judges, startup presenters, and audience members with QR passes."
                },
                {
                        "badge": "INCUBATORS",
                        "title": "Co-Working & Accelerator Events",
                        "desc": "Manage weekly community workshops and guest speaker sessions seamlessly."
                },
                {
                        "badge": "WEB3 & AI",
                        "title": "AI & Tech Community Meetups",
                        "desc": "Organize weekend builder hack-nights and technical deep-dives with zero ticket commission."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Guest Check-In Works at Co-Working Venues",
        "subtitle": "Instant entrance validation that starts your meetup on time.",
        "description": "Attendees present their digital QR pass on their smartphone screen or WhatsApp chat. Community hosts point their phone camera at the pass. UrPass validates registration in under 0.3 seconds, displays the guest's name and startup affiliation, and marks them admitted.",
        "points": [
                "Zero equipment rentals; hosts scan passes using personal smartphones.",
                "Audible green chime confirms valid admission in lively cafe environments.",
                "Atomic database locking prevents duplicate pass reuse across doors.",
                "Quick manual search allows backup check-in if an attendee phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "Can I review and approve registrations before issuing tickets?",
                "a": "Yes. UrPass supports application approval workflows. Attendees submit their registration details, and passes are generated only after you approve them in your organizer dashboard."
        },
        {
                "q": "Can attendees pay for meetup tickets via UPI in Bangalore?",
                "a": "Yes. You can connect your Razorpay account to accept instant UPI payments (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking with 0% platform ticket commissions."
        },
        {
                "q": "How are tickets delivered to attendees?",
                "a": "Tickets are dispatched automatically upon registration or approval via email and WhatsApp (if enabled), providing attendees with easy access to their credentials."
        },
        {
                "q": "What happens when all meetup seats are full?",
                "a": "Once your configured capacity limit is reached, UrPass automatically locks that tier, displays a 'Sold Out' status, and prevents any further registrations, avoiding venue overcrowding."
        },
        {
                "q": "How much does UrPass cost for community meetups?",
                "a": "UrPass offers an introductory plan starting at ₹29/month for your first 2 months with 0% platform ticket commission. Single event pay-as-you-go passes are also available starting from ₹299."
        }
],
      }}
    />
  );
}
