import type { Metadata } from "next";
import { Banknote, BarChart3, Lock, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Meetup Registration & QR Check-In Platform | URPASS",
  description: "Free meetup registration software with digital QR passes, fast door check-in, zero ticketing commission, and no monthly attendee paywalls.",
  keywords: ["meetup registration software", "meetup ticketing platform", "community event check-in", "tech meetup registration", "meetup alternative without fees", "local community event software"],
  alternates: {
    canonical: "https://urpass.space/meetup-registration-software",
  },
  openGraph: {
    title: "Meetup Registration & QR Check-In Platform | URPASS",
    description: "Free meetup registration software with digital QR passes, fast door check-in, zero ticketing commission, and no monthly attendee paywalls.",
    url: "https://urpass.space/meetup-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function MeetupRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "COMMUNITY & MEETUPS",
  "h1": "Meetup Registration & QR Check-In Platform",
  "canonicalUrl": "https://urpass.space/meetup-registration-software",
  "description": "Free meetup registration software with digital QR passes, fast door check-in, zero ticketing commission, and no monthly attendee paywalls.",
  "ctaLabel": "Create Your Meetup Free →",
  "ctaTitle": "Host Community Meetups Without Platform Fees",
  "ctaDescription": "Create registration pages in 3 minutes, issue digital QR passes, and check members in with volunteer smartphones. 100% free for free meetups.",
  "directAnswer": {
    "title": "What is Meetup Registration Software?",
    "summary": "URPASS is meetup registration and check-in software built for community organizers, tech user groups, and local social clubs. It provides clean registration forms, instant digital QR passes, fast volunteer phone scanning, and real-time attendance tracking without the high subscription fees, attendee paywalls, or ads of legacy meetup networks.",
    "keyPoints": [
      "100% free for free community gatherings and user group meetups",
      "Zero platform commission on paid workshop or networking tickets",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "Full ownership of member email lists with zero third-party promotions"
    ]
  },
  "whatIs": {
    "title": "What is Meetup Registration Software?",
    "definition": "Meetup registration software is a community event management platform designed to organize recurring or one-off group gatherings. It handles RSVP management, guest capacity limits, digital pass delivery, and quick entrance check-in at coworking spaces, cafes, and community halls.",
    "details": [
      "Allows community leaders to own their attendee data without paywalled messaging",
      "Replaces messy comment threads and manual guest lists with clean digital QR passes",
      "Operates directly in mobile browsers so members never have to install an event app",
      "Provides accurate arrival numbers to manage catering orders and room capacity"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Community Meetups",
  "howItWorksSubtitle": "From meetup announcement to door check-in.",
  "steps": [
    {
      "n": "01",
      "title": "Create your meetup",
      "desc": "Set date, venue, guest capacity limit, and custom intake questions."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your event URL on Slack, Discord, LinkedIn, or community newsletters."
    },
    {
      "n": "03",
      "title": "Members RSVP",
      "desc": "Attendees register in seconds without forced account creation."
    },
    {
      "n": "04",
      "title": "Issue digital passes",
      "desc": "Members receive mobile QR passes instantly via email or web link."
    },
    {
      "n": "05",
      "title": "Scan at the door",
      "desc": "Hosts or volunteers scan passes in <0.3s with smartphone cameras."
    },
    {
      "n": "06",
      "title": "Track attendance & no-shows",
      "desc": "Monitor check-in velocity and analyze no-show rates to plan future meets."
    }
  ],
  "featuresTitle": "Features Built for Community Organizers",
  "featuresSubtitle": "Zero fees, member data ownership, and sub-second phone scanning.",
  "features": [
    {
      icon: Users,
      "title": "Full Member Data Ownership",
      "desc": "Export your community member list at any time. No paywalled communication or hidden contact details."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Door Scanning",
      "desc": "Check members in rapidly from your own phone camera so you can mingle instead of managing the door."
    },
    {
      icon: Banknote,
      "title": "100% Free for Free Meetups",
      "desc": "Run free community meetups without paying monthly organizer subscription fees."
    },
    {
      icon: Lock,
      "title": "Accurate Capacity Caps",
      "desc": "Prevent room overcrowding in coworking spaces with automated waitlists and capacity limits."
    },
    {
      icon: ShieldCheck,
      "title": "No Third-Party Ads",
      "desc": "Provide your members with a clean, branded registration page free of third-party advertisements."
    },
    {
      icon: BarChart3,
      "title": "No-Show Rate Analytics",
      "desc": "Track attendance ratios to understand true community engagement and optimize venue sizing."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Meetup Registration Software?",
    "subtitle": "From open-source tech groups to hobby clubs.",
    "personas": [
      {
        "badge": "TECH GROUPS",
        "title": "Developer & Tech User Groups",
        "desc": "React, Python, AI, and DevOps meetups meeting monthly in tech office spaces."
      },
      {
        "badge": "CREATIVE",
        "title": "Designers & Creative Collectives",
        "desc": "UX design mixers, photography critique meetups, and creative freelancer roundtables."
      },
      {
        "badge": "BUSINESS",
        "title": "Startup & Founder Mixers",
        "desc": "Early-stage founder breakfasts, investor pitch nights, and co-founder matching events."
      },
      {
        "badge": "SOCIAL",
        "title": "Book Clubs & Hobby Communities",
        "desc": "Local book discussions, language exchanges, and board game evenings with capped seating."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Meetup QR Check-In Works",
    "subtitle": "Frictionless greeting at the venue entrance.",
    "description": "Members show their mobile QR pass on their phone screen. The organizer or co-host points their smartphone camera at the pass using mobile Safari or Chrome. In under 0.3 seconds, the scanner displays the member's name and marks them attended with an audible green chime, allowing hosts to welcome guests personally without a paper clipboard.",
    "points": [
      "Zero equipment costs: runs directly on the organizer's personal smartphone.",
      "Instant confirmation prevents unregistered drop-ins from exceeding room limits.",
      "Fast manual search option if a member's phone battery runs out.",
      "Real-time headcount updates on the host's dashboard."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Legacy Meetup Platforms",
    "subtitle": "How URPASS frees community organizers from high platform fees.",
    "headers": [
      "Platform Feature",
      "Legacy Meetup Networks",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Organizer Cost",
        "col2": "£150 to £250/year mandatory subscription",
        "col3": "100% free for free community meetups"
      },
      {
        "col1": "Member Data Ownership",
        "col2": "Platform restricts direct email export",
        "col3": "Full ownership; export member CSVs in one click"
      },
      {
        "col1": "Entrance Check-In",
        "col2": "Manual sign-in sheets or clunky app check-in",
        "col3": "<0.3s camera scan on any phone browser"
      },
      {
        "col1": "Attendee Experience",
        "col2": "Forced account signups and third-party ads",
        "col3": "Clean, instant registration with zero spam"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is meetup registration software?",
      "a": "It is an event registration platform designed for community groups and meetups to manage member RSVPs, issue digital passes, and check attendees in at the door."
    },
    {
      "q": "Is URPASS free for community meetups?",
      "a": "Yes! URPASS is completely free for free meetups with unlimited registrations and full mobile QR scanning capabilities."
    },
    {
      "q": "Can I export my members' email addresses?",
      "a": "Yes. Unlike legacy meetup platforms, URPASS allows you to export your attendee records and email addresses to CSV at any time."
    },
    {
      "q": "Do members need to create an account or download an app?",
      "a": "No. Members register through a clean web link and receive their QR pass directly in their email or mobile browser."
    },
    {
      "q": "Can I cap the capacity of my meetup venue?",
      "a": "Yes. You can set exact capacity limits to ensure your meetup does not exceed the capacity of your coworking or cafe space."
    },
    {
      "q": "How does URPASS reduce no-shows at free community meetups?",
      "a": "URPASS sends automated confirmation emails with digital QR passes, calendar invite files (.ics), and timely reminders, keeping RSVP commitment high compared to generic web forms."
    },
    {
      "q": "Can co-organizers scan tickets at the meetup entrance?",
      "a": "Yes. You can invite team members or venue hosts as check-in scanners with a single role-based link or passcode without sharing administrative account credentials."
    }
  ],
  "relatedLinks": [
    {
      "title": "Networking Event Registration Software",
      "href": "/networking-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Workshop Registration & Digital Ticketing Software",
      "href": "/workshop-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Startup Event Registration & QR Check-In",
      "href": "/startup-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Free Event Ticketing & QR Check-In Software",
      "href": "/free-event-ticketing-software",
      "category": "Product"
    },
    {
      "title": "Event Check-In App with QR Scanner",
      "href": "/event-check-in-app",
      "category": "Product"
    }
  ]
}}
    />
  );
}
