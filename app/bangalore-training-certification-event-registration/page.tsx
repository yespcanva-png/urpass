import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, GraduationCap, QrCode, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Training Event Registration Bangalore | UrPass",
  description: "Organize professional training events in Bangalore with participant enrollment, registration limits and QR attendance records.",
  keywords: ["professional training registration bangalore","certification event attendance tracking bengaluru","corporate training registration software","bangalore workshop enrollment platform","training attendance qr scanning"],
  alternates: {
    canonical: "https://urpass.space/bangalore-training-certification-event-registration",
  },
  openGraph: {
    title: "Training Event Registration Bangalore | UrPass",
    description: "Organize professional training events in Bangalore with participant enrollment, registration limits and QR attendance records.",
    url: "https://urpass.space/bangalore-training-certification-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Training Event Registration Bangalore | UrPass",
    description: "Organize professional training events in Bangalore with participant enrollment, registration limits and QR attendance records.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreTrainingCertificationEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "PROFESSIONAL TRAINING & CERTIFICATION",
        h1: "Professional Training Registration and Attendance Tracking",
        canonicalUrl: "https://urpass.space/bangalore-training-certification-event-registration",
        description: "Organize professional training events in Bangalore with participant enrollment, registration limits and QR attendance records.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-training-certification-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Professional Training & Certifications",
        ctaDescription: "Enroll participants, enforce classroom seat limits, collect tuition fees with 0% commission via Razorpay, and verify attendance for certification.",
        directAnswer: {
        "title": "What is Professional Training Registration Software for Bangalore?",
        "summary": "Professional training registration and attendance software in Bangalore manages course enrollments, participant intake prerequisites, seat capacity caps, and verifiable digital attendance tracking for corporate training academies, cloud certification bootcamps, and executive seminars. UrPass provides automated GST invoicing, WhatsApp passes, and 0% ticket fees.",
        "keyPoints": [
                "Enforce strict classroom seat limits to maintain optimal trainer-to-student ratios",
                "Capture student intake details: current job title, company name, and prerequisite skills",
                "Direct UPI and card collection via Razorpay with 0% platform ticket commission",
                "Digital QR pass attendance validation with exact timestamps for certification audits"
        ]
},
        whatIs: {
        "title": "Why Bangalore Training Academies Choose UrPass",
        "definition": "Bangalore's software professionals, project managers, and enterprise teams constantly upskill through technical certifications (AWS, Azure, Scrum, PMP, Financial Modeling). Traditional booking aggregators extract 8% to 15% commissions from course tuition.",
        "details": [
                "0% ticket commission: keep 100% of your student tuition with flat, predictable software pricing",
                "Automated corporate GST tax invoices delivered directly to enterprise participants for reimbursement",
                "Digital QR attendance verification replaces paper sign-in sheets and logs exact arrival times",
                "One-click CSV exports of student rosters with contact info and attendance timestamps"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Course Aggregators for Training Seminars",
        "subtitle": "Why professional training academies in Bangalore switch to UrPass.",
        "headers": [
                "Enrollment Dimension",
                "Course Booking Aggregators",
                "UrPass Training Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "8% to 15% deducted from course tuition",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Attendance Verification",
                        "col2": "Manual paper sign-in sheets prone to proxy signing",
                        "col3": "Sub-0.3s phone camera QR attendance validation"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking days of admin work",
                        "col3": "Automated GST tax receipts generated instantly"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Payouts delayed 14 to 30 days after class",
                        "col3": "Direct settlement into your Razorpay account"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CERTIFICATION AUDIT",
                "title": "Verifiable Attendance Records for Professional Certification",
                "paragraphs": [
                        "Professional certification seminars and corporate training workshops in Bangalore require accurate attendance records to issue completion certificates and comply with accredited international educational standards.",
                        "UrPass provides tamper-proof digital attendance logging. Instructors scan each student's digital QR pass on mobile cameras at the classroom door. The system records an exact timestamp, eliminating proxy attendance."
                ],
                "bullets": [
                        "Scan passes in under 300 milliseconds on standard smartphone cameras",
                        "Eliminate manual paper attendance sheets and administrative data entry",
                        "Automated attendance status sync across multi-session weekend workshops",
                        "Export verified digital attendance logs to CSV with one click"
                ],
                "takeaway": "Digital QR scanning ensures verifiable classroom attendance and eliminates proxy signing."
        },
        {
                "badge": "0% COMMISSION",
                "title": "Keep 100% of Tuition Fees with Direct UPI Settlement",
                "paragraphs": [
                        "Educational academies and independent trainers in Bangalore frequently lose 8% to 15% of course fees when using third-party ticketing and booking aggregators.",
                        "UrPass charges 0% commission on course fees. Link your verified Razorpay account, and payments from Google Pay, PhonePe, Paytm, and net banking settle straight into your academy's bank account."
                ],
                "bullets": [
                        "Retain 100% of student enrollment revenue on every workshop batch",
                        "Automated GST invoice generation matching corporate expense requirements",
                        "Support student payment options: UPI, debit cards, credit cards, and net banking",
                        "Transparent software pricing starting from ₹499/month"
                ],
                "takeaway": "Direct payment routing maximizes academy revenue and streamlines tax invoicing."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: GraduationCap,
            title: "Training Tiering",
            desc: "Configure Early Bird, Corporate Sponsored, and Student tiers with custom rules.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Receive course fees directly into your account with zero platform percentage deductions.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized QR tickets directly to student WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Attendance Scan",
            desc: "Scan and log student attendance instantly using volunteer phone cameras on mobile browsers.",
          },
          {
            icon: Sliders,
            title: "Custom Trainee Fields",
            desc: "Capture qualification background, company name, GSTIN numbers, and prerequisites.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Attendance Logs",
            desc: "Export verified student attendance records with exact timestamps to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Training Page",
                "desc": "Define workshop curriculum, batch dates, seat caps, and student prerequisite questions."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect course tuition directly via UPI."
        },
        {
                "n": "03",
                "title": "Promote Enrollment Portal",
                "desc": "Share your high-converting registration link with students and professional networks."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Enrolled participants receive personalized digital QR passes via WhatsApp and email."
        },
        {
                "n": "05",
                "title": "Scan at Classroom Door",
                "desc": "Instructors validate passes in <0.3s with smartphone cameras to log verified attendance."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Professional Training in Bangalore?",
        "subtitle": "Educators and training academies across Karnataka's knowledge capital.",
        "personas": [
                {
                        "badge": "ACADEMIES",
                        "title": "Professional Certification Centers",
                        "desc": "Host financial modeling workshops, project management courses, and legal seminars."
                },
                {
                        "badge": "TECH EDUCATORS",
                        "title": "Cloud & AI Bootcamps",
                        "desc": "Run weekend programming bootcamps, AWS certification courses, and Python masterclasses."
                },
                {
                        "badge": "CORPORATE HR",
                        "title": "Internal Corporate Training",
                        "desc": "Track employee participation across mandatory compliance and leadership training."
                },
                {
                        "badge": "AGILE & SCRUM",
                        "title": "Agile & Scrum Coaches",
                        "desc": "Manage Scrum Master certification cohorts with strict classroom seat limits."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Student Check-In Works at Classroom Doors",
        "subtitle": "Fast, accurate attendance tracking that eliminates paper sign-in sheets.",
        "description": "Students display their digital pass on their smartphone screen or Apple Wallet. The instructor or front-desk coordinator points their mobile camera at the pass. UrPass verifies enrollment in under 300 milliseconds, displays the student's name, and logs their attendance timestamp.",
        "points": [
                "Eliminates messy paper sign-in sheets and manual roster ticking.",
                "Displays real-time validation with participant name, tier, and session batch.",
                "Prevents unverified guests from dropping into limited-capacity masterclasses.",
                "Allows instant manual search by student email or phone number for quick backup entry."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help professional training academies in Bangalore?",
                "a": "UrPass simplifies course enrolment by providing professional registration pages with custom qualification questionnaires, instant UPI payments, and automated QR pass generation for seamless classroom entry."
        },
        {
                "q": "Can we collect GST invoices for registered trainees?",
                "a": "Yes. UrPass form fields allow you to collect company names and GST numbers, generating automated receipts for corporate and business participants."
        },
        {
                "q": "How is attendance tracked during multi-day workshops?",
                "a": "Trainers or front desk staff scan each trainee’s QR code with a smartphone camera at the start of each session, logging real-time digital attendance records."
        },
        {
                "q": "Is there a limit on how many students can register?",
                "a": "No. UrPass supports both small masterclasses and large 500+ seat academic conventions without per-ticket commission fees."
        },
        {
                "q": "Can attendees save their training pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
