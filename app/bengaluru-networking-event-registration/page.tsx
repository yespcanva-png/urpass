import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Networking Event Registration Bengaluru | UrPass",
  description: "Organize professional networking events in Bengaluru with RSVP forms, guest lists, digital passes and check-in records.",
  keywords: ["bengaluru networking event registration","networking event software bangalore","professional mixer registration bengaluru","business networking rsvp bangalore","networking event qr check in karnataka"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-networking-event-registration",
  },
  openGraph: {
    title: "Networking Event Registration Bengaluru | UrPass",
    description: "Organize professional networking events in Bengaluru with RSVP forms, guest lists, digital passes and check-in records.",
    url: "https://urpass.space/bengaluru-networking-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Networking Event Registration Bengaluru | UrPass",
    description: "Organize professional networking events in Bengaluru with RSVP forms, guest lists, digital passes and check-in records.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruNetworkingEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "NETWORKING EVENTS BENGALURU",
        h1: "Networking Event Registration Software in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-networking-event-registration",
        description: "Organize professional networking events in Bengaluru with RSVP forms, guest lists, digital passes and check-in records.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-networking-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Host Seamless Professional Networking Events in Bengaluru",
        ctaDescription: "Manage guest RSVPs, deliver mobile digital passes, and check in professionals at the door in under 0.3 seconds with 0% ticket fees.",
        directAnswer: {
        "title": "What is the Best Networking Event Registration Software in Bengaluru?",
        "summary": "UrPass is dedicated networking event registration software for Bengaluru organizers. It streamlines professional mixers, alumni gatherings, and founder meetups with customizable RSVP forms, guest list approvals, automated digital QR passes, and sub-0.3-second smartphone check-in with 0% platform ticket commissions.",
        "keyPoints": [
                "Branded registration pages for professional mixers, alumni gatherings, and founder mixers",
                "Free RSVP registration and paid ticketing support with 0% platform ticket commission",
                "Encrypted digital QR passes delivered via WhatsApp, Apple Wallet, and email",
                "Sub-0.3s smartphone camera check-in for smooth, queue-free venue entry"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Networking Hosts Choose UrPass",
        "definition": "Professional networking events in Indiranagar, Koramangala, and Central Bangalore depend on creating a warm, frictionless first impression. UrPass eliminates awkward clipboard paper rosters and replaces them with sleek mobile passes and rapid phone scanning.",
        "details": [
                "Replaces paper sign-in sheets with automated smartphone QR camera verification",
                "Displays attendee company and role on the scanner screen to assist hosts with introductions",
                "Enforces venue capacity limits to prevent overcrowding at intimate lounges and rooftop venues",
                "Exports verified attendee contact lists for post-event community newsletters and follow-ups"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Paper Guest Rosters for Bengaluru Networking Mixers",
        "subtitle": "Why professional networking hosts switch to UrPass.",
        "headers": [
                "Operational Factor",
                "Paper Clipboard Rosters",
                "UrPass Networking Platform"
        ],
        "rows": [
                {
                        "col1": "Guest Arrival Speed",
                        "col2": "30-60 seconds searching alphabetical paper sheets",
                        "col3": "Under 0.3s camera scan on volunteer smartphones"
                },
                {
                        "col1": "Guest Credential Display",
                        "col2": "Staff must squint at handwritten name badges",
                        "col3": "Instant visual badge showing attendee name, title & company"
                },
                {
                        "col1": "Capacity Limits",
                        "col2": "No live count; room overcrowding risks safety violations",
                        "col3": "Automated real-time inventory caps that lock sold-out tiers"
                },
                {
                        "col1": "Post-Event Analytics",
                        "col2": "Hours spent manually transcribing handwritten emails",
                        "col3": "One-click export of verified attendance records to CSV"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "GUEST EXPERIENCE",
                "title": "Sleek Digital Passes Elevate Your Networking Brand",
                "paragraphs": [
                        "When professionals attend an executive mixer or alumni gathering in Bangalore, the check-in process sets the tone for the entire evening. Forcing guests to queue up while staff search paper rosters creates a frustrating first impression.",
                        "UrPass provides digital passes that live natively in Apple Wallet or mobile web browsers. As guests arrive at the venue, staff point their smartphone camera at the pass. UrPass validates admission in under 0.3 seconds, displays the guest's company and role, and allows hosts to welcome them warmly by name."
                ],
                "bullets": [
                        "Zero app downloads required for guests or volunteer door staff",
                        "Audible chime or silent haptic vibration for refined lounge environments",
                        "Pass displays attendee name, job title, company, and VIP tier",
                        "Manual search by attendee name or email if a phone battery is uncharged"
                ],
                "takeaway": "Sub-second camera scanning creates a polished, welcoming first impression."
        },
        {
                "badge": "COMMUNITY GROWTH",
                "title": "Clean Attendance Ledgers for Community Follow-Ups",
                "paragraphs": [
                        "The true value of a networking mixer lies in the connections made and the community momentum generated post-event. When organizers use paper sign-in sheets, deciphering messy handwriting takes days and leads to lost contacts.",
                        "UrPass automatically records every attendee check-in with exact timestamps. Organizers can export a clean, verified CSV containing attendee names, company affiliations, and contact details with a single click, ready for your community newsletter or CRM."
                ],
                "bullets": [
                        "One-click export of verified attendee contact records to CSV",
                        "Identify no-show rates and arrival spikes to optimize future event timings",
                        "Integrates with your community email newsletters and follow-up campaigns",
                        "100% attendee data ownership with zero third-party marketing"
                ],
                "takeaway": "Automated attendance data helps you grow your professional community effortlessly."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Users,
            title: "Custom RSVP Forms",
            desc: "Collect job titles, company affiliations, and industry sectors during registration.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Host free community mixers or paid networking dinners with 0% platform ticket fees.",
          },
          {
            icon: QrCode,
            title: "Digital QR Passes",
            desc: "Issue scannable mobile passes delivered via WhatsApp, Apple Wallet, and email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan and check in guests at the door in milliseconds using standard smartphone cameras.",
          },
          {
            icon: ShieldCheck,
            title: "Venue Capacity Caps",
            desc: "Prevent overcrowding at rooftop lounges with automated real-time seat inventory limits.",
          },
          {
            icon: BarChart3,
            title: "Verified Attendee Exports",
            desc: "Download verified attendee records with exact check-in timestamps to CSV in one click.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Mixer Page",
                "desc": "Configure event details, networking format, venue, and capacity limits."
        },
        {
                "n": "02",
                "title": "Publish Registration Form",
                "desc": "Share your branded registration link across LinkedIn, WhatsApp, and email."
        },
        {
                "n": "03",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes with calendar integration."
        },
        {
                "n": "04",
                "title": "Scan at the Door",
                "desc": "Door staff scan passes with smartphone cameras in <0.3s for rapid green entry."
        },
        {
                "n": "05",
                "title": "Export Contact List",
                "desc": "Download verified attendee records to CSV for post-event community follow-ups."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Networking Events in Bengaluru?",
        "subtitle": "Alumni associations, professional guilds, and community organizers.",
        "personas": [
                {
                        "badge": "ALUMNI",
                        "title": "College & B-School Alumni Meets",
                        "desc": "Register alumni across graduating batches and issue digital reunion credentials."
                },
                {
                        "badge": "INDUSTRY",
                        "title": "Product, Design & Tech Mixers",
                        "desc": "Host informal evening mixers for software engineers, product managers, and designers."
                },
                {
                        "badge": "WOMEN IN TECH",
                        "title": "Diversity & Leadership Networks",
                        "desc": "Manage curated community meetups with application screening and digital passes."
                },
                {
                        "badge": "BUSINESS",
                        "title": "Chambers of Commerce & Trade Mixers",
                        "desc": "Register international trade delegations and local business executives seamlessly."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Guest Check-In Works at Networking Venues",
        "subtitle": "Instant entrance validation that starts your mixer on time.",
        "description": "When guests arrive at the venue, they present their digital pass on their smartphone screen or WhatsApp chat. Reception staff point their mobile camera at the pass. UrPass validates registration in under 0.3 seconds, displays the guest's name, company, and title, and marks them admitted.",
        "points": [
                "Zero equipment rentals; staff scan passes using personal smartphones.",
                "Audible green chime or silent haptic vibration confirms admission.",
                "Atomic database locking prevents duplicate pass reuse across doors.",
                "Quick manual search allows backup check-in if an attendee phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "Can I collect company names and job titles during registration?",
                "a": "Yes. UrPass allows you to add custom questions to your registration form, including text fields for company name, job title, and LinkedIn profile URLs."
        },
        {
                "q": "Can I host both free and paid networking events?",
                "a": "Yes. UrPass supports free RSVP registrations as well as paid ticket tiers (e.g. ticket including food and drinks) with 0% platform ticket commissions."
        },
        {
                "q": "Can attendees save their networking pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        },
        {
                "q": "How do reception staff scan attendees at the door?",
                "a": "Reception staff simply open your event scanner URL on their smartphone browser (Safari or Chrome). Pointing the camera at the attendee's digital pass validates the ticket in under 0.3 seconds."
        },
        {
                "q": "Can I export verified attendee contact details after the event?",
                "a": "Yes. You can export a complete CSV file at any time containing attendee names, email addresses, company names, job titles, and exact check-in timestamps."
        }
],
      }}
    />
  );
}
