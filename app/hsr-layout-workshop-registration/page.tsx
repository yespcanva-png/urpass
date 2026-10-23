import type { Metadata } from "next";
import { BookOpen, CreditCard, FileSpreadsheet, QrCode, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "HSR Layout Workshop Registration | UrPass",
  description: "Manage HSR Layout workshops with online registration, seat capacity controls, Razorpay payments and digital entry tickets.",
  keywords: ["workshop registration hsr layout","hsr layout masterclass ticketing","bangalore workshop booking software","coding bootcamp registration hsr","hsr layout training check-in"],
  alternates: {
    canonical: "https://urpass.space/hsr-layout-workshop-registration",
  },
  openGraph: {
    title: "HSR Layout Workshop Registration | UrPass",
    description: "Manage HSR Layout workshops with online registration, seat capacity controls, Razorpay payments and digital entry tickets.",
    url: "https://urpass.space/hsr-layout-workshop-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSR Layout Workshop Registration | UrPass",
    description: "Manage HSR Layout workshops with online registration, seat capacity controls, Razorpay payments and digital entry tickets.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function HsrLayoutWorkshopRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "HSR LAYOUT WORKSHOP TICKETING",
        h1: "Workshop Registration and QR Entry in HSR Layout",
        canonicalUrl: "https://urpass.space/hsr-layout-workshop-registration",
        description: "Workshop and masterclass registration software for HSR Layout, Bangalore. Instant UPI booking, dynamic attendee forms, QR ticket delivery, and live check-in.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=hsr-layout-workshop-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Your HSR Layout Workshop",
        ctaDescription: "Host high-converting masterclasses, bootcamps, and creative workshops in HSR Layout with direct UPI booking and 0% ticket fees.",
        directAnswer: {
        "title": "What is Workshop Registration Software for HSR Layout?",
        "summary": "Workshop registration software for HSR Layout streamlines participant registration, seat capacity limits, and door check-in for masterclasses, coding bootcamps, and creative training across HSR Layout sectors 1 through 7. UrPass offers instant UPI checkout via Razorpay, 0% platform commission, dynamic intake forms, and fast mobile QR scanning.",
        "keyPoints": [
                "Tailored for training studios, tech bootcamps, and co-working classrooms across HSR Layout",
                "Strict seat inventory limits prevent classroom overbooking automatically",
                "Direct UPI and card settlement via Razorpay with 0% platform ticket commissions",
                "Digital QR pass delivery on WhatsApp and Apple Wallet with sub-0.3s door check-in"
        ]
},
        whatIs: {
        "title": "Why Workshop Trainers in HSR Layout Choose UrPass",
        "definition": "HSR Layout is home to Bangalore's densest concentration of creator studios, design academies, and tech training bootcamps. UrPass provides trainers with a dedicated booking platform that eliminates high aggregator fees.",
        "details": [
                "0% ticket commission—keep all participant course fees with flat, transparent software pricing",
                "Capture essential student intake details: current skill level, GitHub/portfolio, and GST invoicing",
                "Automated seat capping closes registration or triggers waitlists once classroom capacity is reached",
                "Sub-0.3s door scanning verifies registered students on mobile cameras without paper sign-in sheets"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Course Aggregators in HSR Layout",
        "subtitle": "Why workshop facilitators in HSR Layout switch to UrPass.",
        "headers": [
                "Workshop Feature",
                "Aggregator Platforms",
                "UrPass Workshop Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "8% to 15% deducted from student tuition",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Seat Capacity Limits",
                        "col2": "Prone to overselling or complex setups",
                        "col3": "Automated real-time inventory limits per batch"
                },
                {
                        "col1": "Classroom Check-In",
                        "col2": "Manual paper sign-in sheets causing door queues",
                        "col3": "Sub-0.3s phone camera QR validation"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Payouts delayed 14 to 30 days after class ends",
                        "col3": "Direct settlement into your Razorpay account"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SEAT MANAGEMENT",
                "title": "Automated Seat Capping and Multi-Batch Scheduling",
                "paragraphs": [
                        "Workshops and intensive bootcamps in HSR Layout have strict physical classroom limits. Overselling seats creates overcrowding and compromises the student learning experience.",
                        "UrPass allows instructors to configure precise ticket tier inventory limits for early bird seats, regular spots, and VIP mentor slots. Once capacity is reached, registration closes automatically in real time."
                ],
                "bullets": [
                        "Real-time countdown of remaining seats creates healthy conversion urgency",
                        "Automated registration cut-off prevents accidental overbooking",
                        "Configure multiple batch schedules (e.g., Saturday Morning vs Sunday Afternoon)",
                        "Automated calendar invitations (.ics) attached to confirmation emails"
                ],
                "takeaway": "Strict seat caps protect your classroom experience and create natural registration urgency."
        },
        {
                "badge": "STUDENT INTAKE",
                "title": "Custom Trainee Questionnaires and Invoicing Details",
                "paragraphs": [
                        "Instructors need to understand their participants' prior experience before class starts, while corporate-sponsored students need formal GST tax invoices for company reimbursement.",
                        "UrPass makes it easy to add custom form fields to your checkout flow. Ask students about their programming background, software tools installed, dietary restrictions, and corporate GSTIN numbers."
                ],
                "bullets": [
                        "Custom text fields, drop-down options, and checkbox questionnaires",
                        "Automated GST invoice generation delivered directly to participant inboxes",
                        "One-click CSV exports of student answers for pre-workshop preparation",
                        "Instant WhatsApp delivery of workshop digital pass with Google Maps pin"
                ],
                "takeaway": "Comprehensive intake questions help instructors prepare tailored curriculum."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: BookOpen,
            title: "Workshop Tiering",
            desc: "Configure Early Bird, General Admission, and VIP 1-on-1 Mentorship passes easily.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Fee via Razorpay",
            desc: "Receive student course fees directly via UPI and cards with 0% platform deductions.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Badges",
            desc: "Deliver personalized QR tickets directly to student WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in students at classroom doors with standard phone cameras in seconds.",
          },
          {
            icon: Sliders,
            title: "Capacity & Intake Logic",
            desc: "Set strict seat limits and capture student experience levels, GitHub URLs, and GSTIN.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Roster Export",
            desc: "Export verified student rosters with attendance timestamps and form responses to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Workshop Page",
                "desc": "Define masterclass curriculum, seat caps, ticket tiers, and student prerequisite questions."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect course fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Promote your responsive workshop booking page across LinkedIn, Twitter, and Instagram."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Enrolled participants receive personalized digital QR passes via WhatsApp and email."
        },
        {
                "n": "05",
                "title": "Scan at Classroom Door",
                "desc": "Validate passes in <0.3s with smartphone cameras to maintain accurate attendance records."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Workshops in HSR Layout?",
        "subtitle": "Educators and training academies across HSR Layout sectors 1–7.",
        "personas": [
                {
                        "badge": "BOOTCAMPS",
                        "title": "Coding & AI Bootcamps",
                        "desc": "Host weekend developer sprints, AI model fine-tuning bootcamps, and system design masterclasses."
                },
                {
                        "badge": "DESIGNERS",
                        "title": "UI/UX & Product Studios",
                        "desc": "Run intensive design workshops, design sprint masterclasses, and portfolio reviews."
                },
                {
                        "badge": "BUSINESS",
                        "title": "Growth & Marketing Academies",
                        "desc": "Teach performance marketing, B2B sales masterclasses, and financial modeling seminars."
                },
                {
                        "badge": "CREATIVES",
                        "title": "Photography & Creative Arts",
                        "desc": "Host studio photography workshops, pottery masterclasses, and creative arts bootcamps."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Student Check-In Works at HSR Layout Studios",
        "subtitle": "Frictionless classroom entry that logs attendance in real time.",
        "description": "Students display their digital pass on their smartphone screen or Apple Wallet. The instructor or studio manager points their mobile camera at the pass. UrPass validates the registration in under 300 milliseconds, displays the student's name, and marks them present.",
        "points": [
                "Eliminates messy paper sign-in sheets and manual roster ticking.",
                "Displays real-time validation with participant name, tier, and session batch.",
                "Prevents unverified guests from dropping into limited-capacity masterclasses.",
                "Allows instant manual search by student email or phone number for quick backup entry."
        ]
},
        faqs: [
        {
                "q": "Can I set maximum seat limits for an HSR workshop?",
                "a": "Yes. UrPass allows you to define exact seat caps for your workshop batches. Once sold out, registration automatically closes or redirects to a waitlist."
        },
        {
                "q": "How do students receive their workshop entry passes in HSR?",
                "a": "As soon as payment clears via Razorpay UPI, UrPass dispatches a digital QR pass with venue directions to the attendee’s WhatsApp and email."
        },
        {
                "q": "Are there hidden ticketing fees taken from my course revenue?",
                "a": "No. UrPass charges 0% commission on ticket sales. You only pay a flat monthly software subscription (plans from ₹499/month) plus standard payment gateway fees."
        },
        {
                "q": "Can I export student registration rosters to Excel or CSV?",
                "a": "Yes. You can export complete attendee rosters with custom responses, payment references, and check-in statuses with a single click at any time."
        },
        {
                "q": "Can attendees save their workshop pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
