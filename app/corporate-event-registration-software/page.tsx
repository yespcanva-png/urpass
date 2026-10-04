import type { Metadata } from "next";
import { BarChart3, FileText, Lock, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Registration & Attendee Check-In | URPASS",
  description: "Enterprise corporate event registration software for town halls, AGM meetings, partner summits, and client showcases. Branded passes and audit-ready attendance.",
  keywords: ["corporate event registration software", "enterprise event registration", "corporate town hall check-in", "agm event registration software", "corporate guest pass generator", "employee event check-in system"],
  alternates: {
    canonical: "https://urpass.space/corporate-event-registration-software",
  },
  openGraph: {
    title: "Corporate Event Registration & Attendee Check-In | URPASS",
    description: "Enterprise corporate event registration software for town halls, AGM meetings, partner summits, and client showcases. Branded passes and audit-ready attendance.",
    url: "https://urpass.space/corporate-event-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function CorporateEventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "ENTERPRISE & CORPORATE SUITE",
  "h1": "Corporate Event Registration & Attendee Check-In",
  "canonicalUrl": "https://urpass.space/corporate-event-registration-software",
  "description": "Enterprise corporate event registration software for town halls, AGM meetings, partner summits, and client showcases. Branded passes and audit-ready attendance.",
  "ctaLabel": "Set Up Corporate Event Free →",
  "ctaTitle": "Deliver Executive-Grade Corporate Event Access",
  "ctaDescription": "Create confidential registration forms, distribute branded digital passes, and verify guest arrivals with sub-second smartphone check-in.",
  "directAnswer": {
    "title": "What is Corporate Event Registration Software?",
    "summary": "URPASS is corporate event registration and check-in software built for enterprise town halls, annual shareholder meetings, partner summits, and internal offsites. It lets corporate event teams issue confidential digital QR passes, capture compliance details, control entrance security, and monitor real-time executive attendance with complete data privacy.",
    "keyPoints": [
      "Clean, white-label registration pages with zero third-party ads or competitor links",
      "Confidential guest lists with role-based access controls and encrypted QR passes",
      "Sub-second (<0.3s) camera check-in for smooth VIP arrivals without foyer delays",
      "Comprehensive audit logs with exact entry timestamps for governance compliance"
    ]
  },
  "whatIs": {
    "title": "What is Corporate Event Registration Software?",
    "definition": "Corporate event registration software is a secure event platform designed for enterprises, multinationals, and professional firms. It manages employee and external guest registration, NDA acknowledgments, dietary requirements, digital access credentials, and entrance security logging.",
    "details": [
      "Ensures employee and VIP guest lists remain confidential without public discovery",
      "Replaces printed badges and slow reception desks with instant digital mobile passes",
      "Tracks executive arrival status in real time to alert event hosts when keynotes arrive",
      "Generates verified attendance records for corporate governance, safety, and ESG reporting"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Corporate Events",
  "howItWorksSubtitle": "Professional workflow from invitation to executive arrival.",
  "steps": [
    {
      "n": "01",
      "title": "Configure corporate event",
      "desc": "Set private event parameters, company branding, and custom intake fields."
    },
    {
      "n": "02",
      "title": "Send private invitations",
      "desc": "Distribute private registration links via corporate email or internal intranet."
    },
    {
      "n": "03",
      "title": "Guests confirm attendance",
      "desc": "Employees and partners confirm attendance and dietary needs in seconds."
    },
    {
      "n": "04",
      "title": "Issue branded digital passes",
      "desc": "Guests receive personalized mobile passes with company branding and QR access."
    },
    {
      "n": "05",
      "title": "Scan at the reception",
      "desc": "Front desk staff scan passes using phones or tablets for instant check-in."
    },
    {
      "n": "06",
      "title": "Live governance reporting",
      "desc": "View real-time headcounts, arrival timestamps, and export attendance logs."
    }
  ],
  "featuresTitle": "Corporate Capabilities Built for Security & Governance",
  "featuresSubtitle": "Privacy, speed, and reliability for internal and client events.",
  "features": [
    {
      icon: ShieldCheck,
      "title": "Strict Data Privacy & Security",
      "desc": "Attendee records are protected with enterprise encryption. No public event directory and no data monetization."
    },
    {
      icon: ScanLine,
      "title": "Executive Arrival Speed",
      "desc": "Admit guests in <0.3 seconds. Eliminate awkward reception delays for board members, clients, and VIPs."
    },
    {
      icon: FileText,
      "title": "Custom Compliance Intake",
      "desc": "Capture employee IDs, department billing codes, NDAs, dietary restrictions, and hotel stay requirements."
    },
    {
      icon: Users,
      "title": "Role-Based Team Access",
      "desc": "Grant check-in scanner permissions to receptionists and door staff without exposing sensitive budget data."
    },
    {
      icon: Lock,
      "title": "Duplicate Entry Prevention",
      "desc": "Prevent credential sharing with atomic duplicate blocking across all auditorium and meeting room doors."
    },
    {
      icon: BarChart3,
      "title": "Audit-Ready Attendance Logs",
      "desc": "Generate verified PDF/CSV arrival logs with exact timestamps for fire safety and corporate compliance."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use Corporate Event Software?",
    "subtitle": "Built for internal communications, HR, and marketing teams.",
    "personas": [
      {
        "badge": "INTERNAL COMMS",
        "title": "Corporate Communications & HR",
        "desc": "Company-wide all-hands meetings, annual celebrations, town halls, and leadership offsites."
      },
      {
        "badge": "GOVERNANCE",
        "title": "Investor Relations & AGMs",
        "desc": "Annual General Meetings and investor roadshows requiring verified shareholder attendance verification."
      },
      {
        "badge": "B2B MARKETING",
        "title": "Customer Summits & Partner Days",
        "desc": "Client appreciation galas, product launch keynotes, and executive roundtables."
      },
      {
        "badge": "TRAINING",
        "title": "Learning & Development Teams",
        "desc": "Mandatory employee compliance seminars, management workshops, and onboarding summits."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Corporate QR Check-In Works",
    "subtitle": "Discreet, instant executive validation.",
    "description": "Reception staff or event concierges open the URPASS scanner interface on any mobile device or tablet. As guests arrive at the venue or auditorium foyer, their digital QR pass is scanned in <0.3 seconds. The scanner chimes softly, confirms their name and VIP designation, and instantly updates the internal host dashboard so executives know when key stakeholders have arrived.",
    "points": [
      "Discreet scanning: runs on tablets and smartphones without bulky hardware.",
      "Real-time arrival notification: dashboard flags VIP arrival instantly.",
      "Atomic row-locking prevents pass sharing between unauthorized attendees.",
      "Fast manual search option for dead-phone situations."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Manual Corporate Guest Lists",
    "subtitle": "How URPASS replaces printed reception binders and spreadsheets.",
    "headers": [
      "Operational Dimension",
      "Manual Reception Sheets / Spreadsheets",
      "URPASS Corporate Platform"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "10 to 20 seconds searching alphabetized sheets",
        "col3": "<0.3s instant phone camera scan"
      },
      {
        "col1": "Guest Privacy",
        "col2": "Printed binder visible to everyone at front desk",
        "col3": "Encrypted digital verification; private records"
      },
      {
        "col1": "VIP Arrival Alerts",
        "col2": "Host has to run to reception to see who arrived",
        "col3": "Live dashboard updates automatically in real time"
      },
      {
        "col1": "Audit Logging",
        "col2": "Handwritten pen ticks prone to loss or disputes",
        "col3": "Cryptographically verified timestamps in CSV/PDF"
      },
      {
        "col1": "Pass Credential Quality",
        "col2": "Generic paper badges with peeling stickers",
        "col3": "Sleek, mobile-responsive digital QR passes"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is corporate event registration software?",
      "a": "It is a secure event platform designed for enterprises to manage employee and external guest registration, distribute digital passes, and track attendance at corporate events."
    },
    {
      "q": "Can we keep our corporate event completely private?",
      "a": "Yes. URPASS events can be unlisted with private URLs, preventing discovery on search engines or public event directories."
    },
    {
      "q": "Can reception staff scan passes using an iPad or tablet?",
      "a": "Yes. The URPASS scanner operates seamlessly on any device with a camera, including iPads, Android tablets, and smartphones."
    },
    {
      "q": "Does URPASS display third-party advertisements to our employees?",
      "a": "No. URPASS provides a clean, professional attendee experience with zero third-party ads or competitor promotions."
    },
    {
      "q": "How does URPASS assist with venue fire safety compliance?",
      "a": "The dashboard displays real-time headcounts of checked-in guests versus registered attendees, providing instant headcount data during fire safety roll calls."
    },
    {
      "q": "Can we collect dietary restrictions and NDAs during registration?",
      "a": "Yes. Custom registration fields allow you to collect dietary preferences, NDA acknowledgments, department codes, and travel details."
    }
  ],
  "relatedLinks": [
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Employee Event Registration & QR Access",
      "href": "/employee-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Real-Time Event Attendance Tracking Software",
      "href": "/event-attendance-tracking-software",
      "category": "Product"
    },
    {
      "title": "Event Entry Management & QR Access Control",
      "href": "/event-entry-management-software",
      "category": "Product"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    }
  ]
}}
    />
  );
}
