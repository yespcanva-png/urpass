import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, Lock, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form Builder with QR Passes | URPASS",
  description: "Custom event registration form builder with automated QR passes, payment collection, conditional fields, and sub-second phone check-in. 0% ticket fees.",
  keywords: ["event registration form builder", "custom event form maker", "registration form with qr code", "online event registration form", "event intake form builder", "custom fields event registration"],
  alternates: {
    canonical: "https://urpass.space/event-registration-form-builder",
  },
  openGraph: {
    title: "Event Registration Form Builder with QR Passes | URPASS",
    description: "Custom event registration form builder with automated QR passes, payment collection, conditional fields, and sub-second phone check-in. 0% ticket fees.",
    url: "https://urpass.space/event-registration-form-builder",
    locale: "en_US",
    type: "website",
  },
};

export default function EventRegistrationFormBuilderPage() {
  return (
    <SEOPage
      config={{
  "badge": "FORM BUILDER & QR PASSES",
  "h1": "Event Registration Form Builder with QR Passes",
  "canonicalUrl": "https://urpass.space/event-registration-form-builder",
  "description": "Custom event registration form builder with automated QR passes, payment collection, conditional fields, and sub-second phone check-in. 0% ticket fees.",
  "ctaLabel": "Build Registration Form Free →",
  "ctaTitle": "Create Custom Registration Forms Connected to QR Passes",
  "ctaDescription": "Build branded registration forms with custom fields, collect payments directly with 0% ticketing commission, and issue scannable QR passes automatically.",
  "directAnswer": {
    "title": "What is an Event Registration Form Builder?",
    "summary": "An event registration form builder is a software tool that allows organizers to create custom intake forms for collecting attendee details, processing payments, and configuring ticket options. URPASS connects form submissions directly to automated digital QR pass generation, eliminating manual data entry and enabling sub-0.3s smartphone door check-in.",
    "keyPoints": [
      "Custom fields: text, dropdowns, radio buttons, file uploads, and Student IDs",
      "Instant automated digital QR pass delivery upon form submission or payment",
      "Direct payment collection via Stripe or Razorpay with 0% ticketing commission",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads"
    ]
  },
  "whatIs": {
    "title": "What is an Event Registration Form Builder?",
    "definition": "An event registration form builder is a drag-and-drop or configurable tool that generates online signup pages for events. Unlike generic survey forms, an event form builder connects registrant data directly to event inventory, capacity capping, payment gateways, and entrance check-in credentials.",
    "details": [
      "Collects essential attendee data including dietary requirements, job titles, and affiliations",
      "Caps capacity automatically to prevent venue overcrowding and overbooking",
      "Generates personalized digital QR tickets immediately upon submission",
      "Eliminates disconnected Google Sheets and manual confirmation mail merges"
    ]
  },
  "howItWorksTitle": "How the Form Builder Operates",
  "howItWorksSubtitle": "From form design to door check-in in six simple steps.",
  "steps": [
    {
      "n": "01",
      "title": "Build your custom form",
      "desc": "Add custom questions, dropdowns, file uploads, and ticket categories in minutes."
    },
    {
      "n": "02",
      "title": "Connect direct payments",
      "desc": "Link your Stripe or Razorpay account to accept paid registrations directly."
    },
    {
      "n": "03",
      "title": "Publish branded link",
      "desc": "Share your fast-loading registration link across email, social media, or your website."
    },
    {
      "n": "04",
      "title": "Attendees submit details",
      "desc": "Guests register with zero friction or forced account signups."
    },
    {
      "n": "05",
      "title": "Automated QR pass issuance",
      "desc": "The platform generates a unique, mobile-responsive QR pass delivered straight to their inbox."
    },
    {
      "n": "06",
      "title": "Scan at the entrance",
      "desc": "Door volunteers scan the QR pass with phone cameras in <0.3s for green entry."
    }
  ],
  "featuresTitle": "Form Capabilities Built for Event Organizers",
  "featuresSubtitle": "Custom fields, payment integration, and automated QR passes.",
  "features": [
    {
      icon: FileText,
      "title": "Flexible Custom Fields",
      "desc": "Add text inputs, dropdown menus, radio selectors, file uploads, and checkbox agreements easily."
    },
    {
      icon: QrCode,
      "title": "Automated QR Pass Delivery",
      "desc": "Every confirmed form submission automatically receives a unique encrypted digital QR pass via email."
    },
    {
      icon: Banknote,
      "title": "Direct Payment Integration",
      "desc": "Accept payments via Cards, UPI, or Netbanking with 0% platform commission on ticket sales."
    },
    {
      icon: Lock,
      "title": "Automated Capacity Capping",
      "desc": "Set maximum registrant limits. Registration halts automatically once capacity is reached to prevent overbooking."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Door Scanning",
      "desc": "Scan attendees at the door in under 0.3 seconds using any volunteer smartphone browser."
    },
    {
      icon: BarChart3,
      "title": "Exportable Attendee Data",
      "desc": "Download all custom field responses and check-in timestamps to CSV in one click at any time."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs a Registration Form Builder?",
    "subtitle": "Built for event teams who need custom attendee data.",
    "personas": [
      {
        "badge": "CONFERENCES",
        "title": "Conference & Summit Organizers",
        "desc": "Collect company names, job titles, dietary restrictions, and workshop track preferences."
      },
      {
        "badge": "COLLEGES",
        "title": "Universities & Student Clubs",
        "desc": "Mandate Student IDs, roll numbers, department branches, and emergency contacts."
      },
      {
        "badge": "WORKSHOPS",
        "title": "Workshop Instructors & Trainers",
        "desc": "Capture participant experience levels, software prerequisites, and equipment needs."
      },
      {
        "badge": "CORPORATE",
        "title": "Corporate Event Planners",
        "desc": "Collect employee department codes, NDA agreements, and hotel shuttle requirements."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Form Submissions Connect to Gate Entry",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Attendees display their mobile QR pass on their phone screen. Volunteer staff open the scanner URL in Safari or Chrome on their smartphones. Pointing the camera at the pass validates the ticket in under 0.3 seconds with an audible green chime, verifying their registration without needing a paper roster.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS Form Builder vs Google Forms",
    "subtitle": "Why dedicated event form builders outperform generic survey tools.",
    "headers": [
      "Form Capability",
      "Google Forms",
      "URPASS Event Form Builder"
    ],
    "rows": [
      {
        "col1": "Pass Generation",
        "col2": "Requires fragile Sheet add-ons or manual mail merge",
        "col3": "Automated unique encrypted digital QR pass"
      },
      {
        "col1": "Payment Collection",
        "col2": "No native payment gateway; manual bank slips",
        "col3": "Direct payment checkout via Stripe or Razorpay"
      },
      {
        "col1": "Entrance Check-In",
        "col2": "Printing paper sheets and ticking with pens",
        "col3": "Sub-second (<0.3s) camera scan on volunteer phone"
      },
      {
        "col1": "Duplicate Protection",
        "col2": "Zero detection; forwarded emails get admitted twice",
        "col3": "Atomic locking immediately flags duplicate scans"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is an event registration form builder?",
      "a": "It is an online tool that allows organizers to create customized registration forms to collect attendee details, accept payments, and issue digital QR passes for event entry."
    },
    {
      "q": "Can I add custom questions like dietary needs or Student IDs?",
      "a": "Yes! You can add unlimited custom fields including text inputs, dropdowns, checkboxes, and file uploads to capture exactly what you need."
    },
    {
      "q": "Does submitting the form automatically generate a QR code for the attendee?",
      "a": "Yes. As soon as an attendee completes registration or payment, URPASS automatically generates a unique digital QR pass and delivers it to their email."
    },
    {
      "q": "Can I collect payments directly through my registration form?",
      "a": "Yes. You can connect your Stripe or Razorpay account to collect ticket payments directly with 0% platform commission."
    },
    {
      "q": "Is the form builder free for free events?",
      "a": "Yes! URPASS is completely free for free events with full access to custom form fields, automated QR pass issuance, and mobile camera scanning."
    },
    {
      "q": "Can I add conditional logic or dropdown fields to the registration form?",
      "a": "Yes. Add text fields, dropdown selectors, checkboxes, file uploads, and conditional questions tailored to your event requirements."
    },
    {
      "q": "Can I embed the registration form on my own WordPress or Webflow website?",
      "a": "Yes. You can embed the registration widget via a lightweight iframe snippet or link directly to your custom-branded event URL."
    }
  ],
  "relatedLinks": [
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Google Forms Alternative for Event Registration",
      "href": "/google-forms-event-registration-alternative",
      "category": "Comparison"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    },
    {
      "title": "Online Event Ticket Generator with QR Code",
      "href": "/online-ticket-generator-for-events",
      "category": "Product"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    }
  ]
}}
    />
  );
}
