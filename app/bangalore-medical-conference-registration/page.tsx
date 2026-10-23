import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, Layers, QrCode, ScanLine, Stethoscope } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Medical Conference Registration Bangalore | UrPass",
  description: "Simplify delegate registration for Bangalore medical conferences with customized forms, QR passes and attendance management.",
  keywords: ["medical conference registration bangalore","cme credit attendance software bengaluru","doctor conference ticketing bangalore","healthcare symposium registration","medical delegate badge scanning"],
  alternates: {
    canonical: "https://urpass.space/bangalore-medical-conference-registration",
  },
  openGraph: {
    title: "Medical Conference Registration Bangalore | UrPass",
    description: "Simplify delegate registration for Bangalore medical conferences with customized forms, QR passes and attendance management.",
    url: "https://urpass.space/bangalore-medical-conference-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Conference Registration Bangalore | UrPass",
    description: "Simplify delegate registration for Bangalore medical conferences with customized forms, QR passes and attendance management.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreMedicalConferenceRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "MEDICAL CONFERENCES & CME",
        h1: "Medical Conference Delegate Registration in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-medical-conference-registration",
        description: "Simplify delegate registration for Bangalore medical conferences with customized forms, QR passes and attendance management.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-medical-conference-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Bangalore Medical Conferences & CMEs",
        ctaDescription: "Register doctors and healthcare delegates, capture Medical Council registration numbers, collect fees via Razorpay with 0% commission, and track CME hours.",
        directAnswer: {
        "title": "What is Medical Conference Registration Software for Bangalore?",
        "summary": "Medical conference registration software in Bangalore manages delegate onboarding, medical council registration number verification, Continuing Medical Education (CME) credit attendance tracking, and badge check-in for healthcare symposiums. UrPass provides automated GST invoicing, multi-track session scanning, and 0% ticket commission.",
        "keyPoints": [
                "Capture doctor credentials: Medical Council registration number, specialty, and hospital",
                "CME credit attendance tracking: timestamped room check-in logs session attendance",
                "Direct Razorpay UPI and card settlement with 0% platform ticket commission",
                "Automated GST invoice generation with hospital/clinic tax details for reimbursement"
        ]
},
        whatIs: {
        "title": "Why Bangalore Medical Associations Choose UrPass",
        "definition": "Bangalore is a premier healthcare destination, hosting national medical congresses across cardiology, oncology, orthopedics, and clinical research. Organizers require strict delegate verification and accurate attendance tracking for CME accreditation.",
        "details": [
                "Eliminate 5% to 8% platform commissions on high-value doctor and consultant delegate fees",
                "Automated GST tax invoice generation matching hospital corporate reimbursement rules",
                "Multi-session scanning tracks doctor attendance at specific CME-accredited scientific tracks",
                "Instant delivery of digital QR credentials straight to attendee WhatsApp numbers and Apple Wallet"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Medical Association Portals",
        "subtitle": "Why healthcare event committees in Bangalore switch to UrPass.",
        "headers": [
                "Conference Feature",
                "Traditional Medical Portals",
                "UrPass Medical Conference Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on delegate fees",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "CME Attendance Tracking",
                        "col2": "Manual paper sign-in sheets prone to proxy signing",
                        "col3": "Sub-0.3s camera QR scan with exact timestamps"
                },
                {
                        "col1": "Doctor Intake Fields",
                        "col2": "Rigid forms missing Medical Council fields",
                        "col3": "Custom fields for State Medical Council No. & Hospital"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking weeks of committee effort",
                        "col3": "Automated GST invoices generated upon payment"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CME ACCREDITATION",
                "title": "Verifiable CME Credit Attendance Logging via Mobile Scanners",
                "paragraphs": [
                        "State Medical Councils and accredited healthcare bodies require proof of physical attendance at scientific sessions before awarding Continuing Medical Education (CME) credit hours to attending physicians.",
                        "UrPass provides tamper-proof digital attendance logging. Station student volunteers outside scientific halls to scan doctor QR badges as they enter each accredited track. The system records an exact timestamp, eliminating proxy attendance."
                ],
                "bullets": [
                        "Scan passes in under 300 milliseconds on standard smartphone cameras",
                        "Eliminate manual paper attendance sheets and administrative data entry",
                        "Automated attendance status sync across multi-session weekend conferences",
                        "Export verified digital attendance logs to CSV with one click for council submission"
                ],
                "takeaway": "Digital QR scanning ensures verifiable CME session attendance."
        },
        {
                "badge": "DOCTOR INTAKE",
                "title": "Medical Council Details and Hospital GST Tax Invoicing",
                "paragraphs": [
                        "Physicians and medical consultants attending Bangalore medical conferences need formal corporate tax invoices with hospital or clinic GSTIN numbers for financial clearance and institutional sponsorship.",
                        "UrPass automatically prompts attendees for State Medical Council registration numbers, clinical specialties, hospital affiliations, and GSTIN numbers during checkout. Ticket funds settle straight into your verified Razorpay merchant account."
                ],
                "bullets": [
                        "Retain 100% of delegate revenues without 5% to 8% aggregator commission cuts",
                        "Automated GST invoice generation with custom corporate tax breakdown",
                        "Support corporate credit cards, net banking, and instant UPI transfers",
                        "Automated bulk invoice export for finance and audit reconciliations"
                ],
                "takeaway": "Zero commission and instant GST receipts make healthcare conference billing effortless."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Stethoscope,
            title: "Doctor Credential Intake",
            desc: "Capture State Medical Council numbers, clinical specialties, and hospital affiliations.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect delegate conference fees directly into your account with zero platform cuts.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized digital badges directly to doctor WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in delegates at auditorium doors using phone cameras on mobile browsers.",
          },
          {
            icon: Layers,
            title: "CME Session Tracking",
            desc: "Track doctor attendance across scientific tracks and workshops for CME credit hours.",
          },
          {
            icon: FileSpreadsheet,
            title: "Council-Ready CSV Exports",
            desc: "Export verified attendance logs with Medical Council numbers and scan timestamps to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Medical Conference",
                "desc": "Define scientific tracks, delegate tiers, early bird pricing, and Medical Council intake fields."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your responsive registration page with medical associations and hospital networks."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Delegates receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Hall Entrances",
                "desc": "Hall staff scan passes in <0.3s with smartphone cameras to log verified CME attendance."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Medical Conferences in Bangalore?",
        "subtitle": "Medical associations and healthcare conference committees across Bengaluru.",
        "personas": [
                {
                        "badge": "ASSOCIATIONS",
                        "title": "Medical Specialty Societies",
                        "desc": "Host annual state and national conferences for cardiology, surgery, and oncology."
                },
                {
                        "badge": "HOSPITALS",
                        "title": "Tertiary Care Hospitals",
                        "desc": "Coordinate clinical symposiums, surgical workshops, and healthcare town halls."
                },
                {
                        "badge": "RESEARCH",
                        "title": "Clinical Research Institutes",
                        "desc": "Register delegates and track session attendance for clinical trial symposiums."
                },
                {
                        "badge": "DENTAL & PHARMA",
                        "title": "Dental & Pharmaceutical Bodies",
                        "desc": "Manage continuing professional development workshops with paperless QR badging."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How CME Check-In Operates at Scientific Halls",
        "subtitle": "Fast, accurate attendance tracking that eliminates paper sign-in sheets.",
        "description": "Doctors display their digital pass on their smartphone screen or Apple Wallet. Hall staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the doctor's name, Medical Council number, and tier, and logs their attendance timestamp immediately.",
        "points": [
                "Eliminates messy paper sign-in sheets and manual roster ticking.",
                "Displays real-time validation with participant name, tier, and session track.",
                "Prevents unverified guests from dropping into limited-capacity workshops.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help track Continuing Medical Education (CME) credits?",
                "a": "UrPass supports multi-session scanning. Stationing staff with smartphone cameras outside scientific halls allows you to log exact entry timestamps for attending physicians, creating verified attendance records for medical council audits."
        },
        {
                "q": "Can we capture State Medical Council registration numbers during checkout?",
                "a": "Yes. You can add required custom form fields for Medical Council registration numbers, clinical specialties, and hospital names."
        },
        {
                "q": "Can we issue automated GST invoices for hospital sponsorships?",
                "a": "Yes. Delegates can enter their hospital or clinic GSTIN during checkout, and an itemized corporate tax invoice is automatically generated and attached to their confirmation email."
        },
        {
                "q": "Do doctors need to download an application to display their pass?",
                "a": "No. Doctors receive their digital QR badge via WhatsApp and email, with one-tap Apple Wallet (.pkpass) support for instant lockscreen access."
        },
        {
                "q": "What pricing applies to medical conferences on UrPass?",
                "a": "UrPass offers transparent flat software subscriptions starting from ₹499/month, with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
