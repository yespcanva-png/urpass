import type { Metadata } from "next";
import { Banknote, BarChart3, Briefcase, Lock, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Networking Event Registration Software | URPASS",
  description: "Networking event registration software with digital QR passes, professional profile capture, sub-second phone check-in, and real-time attendance tracking.",
  keywords: ["networking event registration", "business networking event software", "mixer event ticketing", "networking check-in app", "professional mixer registration", "b2b networking pass generator"],
  alternates: {
    canonical: "https://urpass.space/networking-event-registration",
  },
  openGraph: {
    title: "Networking Event Registration Software | URPASS",
    description: "Networking event registration software with digital QR passes, professional profile capture, sub-second phone check-in, and real-time attendance tracking.",
    url: "https://urpass.space/networking-event-registration",
    locale: "en_US",
    type: "website",
  },
};

export default function NetworkingEventRegistrationPage() {
  return (
    <SEOPage
      config={{
  "badge": "BUSINESS & NETWORKING",
  "h1": "Networking Event Registration Software",
  "canonicalUrl": "https://urpass.space/networking-event-registration",
  "description": "Networking event registration software with digital QR passes, professional profile capture, sub-second phone check-in, and real-time attendance tracking.",
  "ctaLabel": "Create Networking Event Free →",
  "ctaTitle": "Power Seamless Business Networking Mixers",
  "ctaDescription": "Capture professional details, issue digital QR passes, and check attendees in in <0.3s to kick off conversations without foyer delays.",
  "directAnswer": {
    "title": "What is Networking Event Registration Software?",
    "summary": "URPASS is networking event registration and check-in software built for business mixers, industry roundtables, speed networking sessions, and alumni meetups. It captures professional job titles, companies, and LinkedIn profiles, delivers digital QR passes, and admits attendees in under 0.3 seconds on volunteer smartphones.",
    "keyPoints": [
      "Professional profile capture: job title, company name, industry, and LinkedIn URL",
      "Instant digital QR badge delivery via email, web link, or mobile pass",
      "Sub-second (<0.3s) camera check-in on host smartphones with zero app downloads",
      "100% free for free business mixers with full access to QR generation and check-in"
    ]
  },
  "whatIs": {
    "title": "What is Networking Event Registration Software?",
    "definition": "Networking event registration software is an event platform tailored for professional business mixers, executive roundtables, and speed networking gatherings. It manages guest registrations, intake questions, digital credential issuance, and rapid entrance validation at venues, hotels, and member clubs.",
    "details": [
      "Captures attendee professional information to facilitate business matching",
      "Eliminates paper sign-in sheets and awkward foyer registration bottlenecks",
      "Operates hardware-free on existing smartphones with zero app downloads",
      "Provides verified arrival counts so event hosts can start networking sessions on time"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Networking Events",
  "howItWorksSubtitle": "From online registration to smooth mixer check-in.",
  "steps": [
    {
      "n": "01",
      "title": "Configure networking mixer",
      "desc": "Set date, venue, guest capacity, and professional intake questions."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your event URL on LinkedIn, industry newsletters, and WhatsApp groups."
    },
    {
      "n": "03",
      "title": "Professionals register",
      "desc": "Attendees submit their job title, company, and networking objectives."
    },
    {
      "n": "04",
      "title": "Deliver digital passes",
      "desc": "Guests receive personalized mobile QR passes with their name and professional title."
    },
    {
      "n": "05",
      "title": "Scan at the reception",
      "desc": "Hosts scan passes in <0.3s with smartphone cameras for rapid entry."
    },
    {
      "n": "06",
      "title": "Live attendance tracking",
      "desc": "Monitor check-in velocity and know who is in the room in real time."
    }
  ],
  "featuresTitle": "Features for High-Impact Professional Mixers",
  "featuresSubtitle": "Professional profile capture, capacity caps, and sub-second phone scanning.",
  "features": [
    {
      icon: Briefcase,
      "title": "Professional Profile Capture",
      "desc": "Collect job titles, company names, industry sectors, and LinkedIn profile URLs during registration."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Reception Scanning",
      "desc": "Admit 40+ professionals per minute from your own phone camera. Keep reception areas free of queues."
    },
    {
      icon: Users,
      "title": "Accurate Venue Capacity Caps",
      "desc": "Prevent overcrowding in hotel lounges and private clubs with automated capacity limits and waitlists."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "100% free for free community mixers. Retain 100% of ticket sales for premium networking dinners."
    },
    {
      icon: Lock,
      "title": "Duplicate Pass Protection",
      "desc": "Ensure only verified, registered professionals enter. Passes cannot be transferred or shared."
    },
    {
      icon: BarChart3,
      "title": "Live Arrival Dashboard",
      "desc": "See exactly who has arrived in real time to make targeted introductions between key attendees."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Networking Event Software?",
    "subtitle": "From industry trade associations to private member clubs.",
    "personas": [
      {
        "badge": "ASSOCIATIONS",
        "title": "Chambers of Commerce & Trade Boards",
        "desc": "Regional business breakfasts, bilateral trade mixers, and commercial networking receptions."
      },
      {
        "badge": "EXECUTIVE",
        "title": "Industry Executive Roundtables",
        "desc": "C-suite private dinners, leadership forums, and invite-only executive gatherings."
      },
      {
        "badge": "CLUBS",
        "title": "Private Member Clubs & Hubs",
        "desc": "Soho House, tech club, and alumni club networking nights and social mixers."
      },
      {
        "badge": "COMMUNITY",
        "title": "Freelancer & Creator Collectives",
        "desc": "Freelancer co-working meetups, creative portfolio reviews, and startup founder coffee meets."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Networking QR Check-In Works",
    "subtitle": "Professional greeting at the venue door.",
    "description": "Guests present their mobile QR pass upon arriving at the venue. The host or reception volunteer scans the code in under 0.3 seconds using a phone or tablet. The scanner chimes softly, confirms their name and company (e.g. 'Sarah Jenkins - Tech Ventures'), allowing hosts to greet them personally and introduce them to colleagues immediately.",
    "points": [
      "Zero equipment costs: runs directly on the host's personal smartphone.",
      "Instant verification displays attendee name and company affiliation.",
      "Fast manual search option if an attendee's phone battery runs out.",
      "Real-time headcount updates on the host's dashboard."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Manual Networking Sign-Ins",
    "subtitle": "How URPASS streamlines business mixer check-in.",
    "headers": [
      "Mixer Logistics",
      "Paper Sign-In Sheets / Peel-off Badges",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Entrance Speed",
        "col2": "Guests queuing 10 minutes to write their details on paper",
        "col3": "<0.3s camera scan on host's phone; instant entry"
      },
      {
        "col1": "Profile Accuracy",
        "col2": "Illegible handwritten names and messy ink smudges",
        "col3": "Digital verified attendee details with LinkedIn profile"
      },
      {
        "col1": "Attendee List Security",
        "col2": "Paper sheets left on tables exposed to competitor eyes",
        "col3": "Encrypted digital records accessible only to organizers"
      },
      {
        "col1": "Software Fees",
        "col2": "Legacy ticketing platforms take 6% to 10% cuts",
        "col3": "0% commission; keep 100% of event revenue"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is networking event registration software?",
      "a": "It is an event registration platform designed for professional business mixers and networking events to manage registrations, capture job titles, and scan guests at the door."
    },
    {
      "q": "Can I collect company names and job titles during registration?",
      "a": "Yes. Custom registration fields let you capture company names, job titles, industry sectors, and LinkedIn profile URLs."
    },
    {
      "q": "Is URPASS free for free networking events?",
      "a": "Yes! URPASS is completely free for free networking meetups, with full QR pass issuance and mobile camera scanning."
    },
    {
      "q": "Can I see who has arrived in real time to make introductions?",
      "a": "Yes. The live organizer dashboard updates instantly as guests are scanned, allowing hosts to track arrivals in real time."
    },
    {
      "q": "Do attendees need to print out their tickets?",
      "a": "No. Attendees simply display their digital QR pass on their phone screen for sub-second scanning."
    },
    {
      "q": "Does URPASS support instant badge printing at the venue?",
      "a": "Yes. Check-in events trigger instant webhook notifications that can integrate with on-site label printers to generate printed name tags upon QR scan."
    },
    {
      "q": "Can organizers send follow-up announcements to verified attendees?",
      "a": "Yes. Organizers can filter the attendee list by \"Checked In\" status and send follow-up emails, resource links, and feedback surveys exclusively to attendees who showed up."
    }
  ],
  "relatedLinks": [
    {
      "title": "Meetup Registration & QR Check-In Platform",
      "href": "/meetup-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Startup Event Registration & QR Check-In",
      "href": "/startup-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Corporate Event Registration & Attendee Check-In",
      "href": "/corporate-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Free Event Ticketing & QR Check-In Software",
      "href": "/free-event-ticketing-software",
      "category": "Product"
    }
  ]
}}
    />
  );
}
