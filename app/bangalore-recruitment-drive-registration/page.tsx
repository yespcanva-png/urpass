import type { Metadata } from "next";
import { Briefcase, FileSpreadsheet, FileText, Layers, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Recruitment Drive Registration Bangalore | UrPass",
  description: "Register candidates for Bangalore recruitment events, collect required details and manage arrival check-ins using digital QR passes.",
  keywords: ["recruitment drive registration bangalore","hiring event qr check-in bengaluru","job fair registration software bangalore","candidate attendance tracking bengaluru","campus recruitment check in"],
  alternates: {
    canonical: "https://urpass.space/bangalore-recruitment-drive-registration",
  },
  openGraph: {
    title: "Recruitment Drive Registration Bangalore | UrPass",
    description: "Register candidates for Bangalore recruitment events, collect required details and manage arrival check-ins using digital QR passes.",
    url: "https://urpass.space/bangalore-recruitment-drive-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recruitment Drive Registration Bangalore | UrPass",
    description: "Register candidates for Bangalore recruitment events, collect required details and manage arrival check-ins using digital QR passes.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreRecruitmentDriveRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "RECRUITMENT DRIVES & HIRING",
        h1: "Recruitment Drive Registration and Candidate QR Check-In",
        canonicalUrl: "https://urpass.space/bangalore-recruitment-drive-registration",
        description: "Register candidates for Bangalore recruitment events, collect required details and manage arrival check-ins using digital QR passes.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-recruitment-drive-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Hiring Drives & Job Fairs",
        ctaDescription: "Register job seekers, collect resumes, issue slot-based digital QR passes, and eliminate registration desk queues at Bangalore hiring events.",
        directAnswer: {
        "title": "What is Recruitment Drive Registration Software for Bangalore?",
        "summary": "Recruitment drive registration software in Bangalore manages candidate registrations, resume intake, interview time-slot scheduling, and gate check-in for walk-in hiring drives, tech job fairs, and campus recruitment events. UrPass provides slot-based digital QR passes and sub-0.3s candidate verification with zero hardware rentals.",
        "keyPoints": [
                "Time-slot based registration staggers candidate arrival to prevent venue overcrowding",
                "Custom candidate intake forms capture resume links, experience, and tech stacks",
                "Sub-0.3s smartphone camera scanning logs candidate arrival times and interview stage",
                "Instant CSV export with candidate contact details and verified attendance timestamps"
        ]
},
        whatIs: {
        "title": "Why Bangalore Talent Teams Choose UrPass for Hiring Drives",
        "definition": "Major IT campuses, GCCs, and tech startups in Bangalore host high-volume walk-in recruitment drives that attract hundreds of engineering candidates. Managing arrivals with paper resumes and manual sign-in sheets creates chaos.",
        "details": [
                "Slot-based registration spreads candidate arrival across 9:00 AM, 11:00 AM, and 2:00 PM batches",
                "Digital QR badges on WhatsApp replace paper tokens and track candidate stage progression",
                "Interview stage tracking: scan candidates as they clear technical rounds and HR interviews",
                "100% data security ensures candidate personal information remains strictly confidential"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Paper Token Systems at Bangalore Hiring Drives",
        "subtitle": "Why enterprise talent acquisition teams upgrade to UrPass.",
        "headers": [
                "Operational Feature",
                "Paper Tokens & Physical Lists",
                "UrPass Digital Recruitment Engine"
        ],
        "rows": [
                {
                        "col1": "Candidate Arrival Flow",
                        "col2": "Uncontrolled crowds arriving all at once at 9 AM",
                        "col3": "Slot-based tiers stagger candidate footfall evenly"
                },
                {
                        "col1": "Morning Check-In Speed",
                        "col2": "1 to 2 minutes per candidate collecting paper forms",
                        "col3": "Sub-0.3s camera scan on candidate's digital QR pass"
                },
                {
                        "col1": "Interview Stage Tracking",
                        "col2": "Paper forms physically stamped or lost between rooms",
                        "col3": "Multi-session scanning tracks technical and HR rounds"
                },
                {
                        "col1": "Candidate Reporting",
                        "col2": "Days spent manually typing candidate data into ATS",
                        "col3": "Instant CSV export with resume links and arrival times"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SLOT SCHEDULING",
                "title": "Stagger Candidate Ingress with Time-Slot Based Ticketing",
                "paragraphs": [
                        "Recruitment drives across Whitefield and Electronic City often suffer from massive morning queues when 500+ candidates arrive simultaneously at 9 AM, overwhelming reception staff and security.",
                        "UrPass allows recruitment coordinators to configure slot-based registration tiers (e.g. Batch A: 9:00 AM – 10:30 AM, Batch B: 11:00 AM – 12:30 PM). Candidates select their preferred slot, smoothing foot traffic throughout the day."
                ],
                "bullets": [
                        "Configure maximum candidate caps per interview time slot",
                        "Digital pass clearly displays allocated arrival window and venue instructions",
                        "Scanners alert staff if a candidate arrives outside their designated slot window",
                        "Automated reminders sent via WhatsApp 2 hours prior to candidate slot time"
                ],
                "takeaway": "Time-slot ticketing eliminates morning entrance stampedes."
        },
        {
                "badge": "STAGE TRACKING",
                "title": "Multi-Round Interview Progression Tracking via Mobile Scanners",
                "paragraphs": [
                        "Tracking which candidates cleared the written test, who entered the technical interview, and who reached the final HR discussion is essential for large-scale hiring drives.",
                        "UrPass supports multi-stage scanning. Interview coordinators outside technical round rooms scan candidate QR passes with their smartphones, logging which candidates advanced to each stage in real time."
                ],
                "bullets": [
                        "Station smartphone scanners outside Written Test, Tech Round, and HR rooms",
                        "Real-time candidate pipeline telemetry visible on the central recruitment dashboard",
                        "Prevent disqualified candidates from wandering into subsequent interview rooms",
                        "Export complete candidate progression audit logs to CSV for HR archives"
                ],
                "takeaway": "Multi-stage QR scanning tracks candidate progress through interview rounds."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Briefcase,
            title: "Time-Slot Scheduling",
            desc: "Stagger candidate arrival with morning and afternoon interview time slots.",
          },
          {
            icon: FileText,
            title: "Resume & Intake Forms",
            desc: "Collect resume URLs, years of experience, current CTC, and tech stacks during sign-up.",
          },
          {
            icon: QrCode,
            title: "WhatsApp Digital Passes",
            desc: "Deliver personalized candidate passes and directions directly to WhatsApp inboxes.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in candidates at reception desks with standard smartphone cameras.",
          },
          {
            icon: Layers,
            title: "Multi-Stage Interview Tracking",
            desc: "Track candidate movement across written tests, technical rounds, and HR panels.",
          },
          {
            icon: FileSpreadsheet,
            title: "ATS-Ready CSV Exports",
            desc: "Export verified candidate attendance logs with contact details and timestamps.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Hiring Drive",
                "desc": "Define job roles, interview time slots, capacity limits, and candidate intake fields."
        },
        {
                "n": "02",
                "title": "Publish Application Portal",
                "desc": "Share your responsive registration link across LinkedIn, job portals, and colleges."
        },
        {
                "n": "03",
                "title": "Issue Slot Passes",
                "desc": "Candidates receive personalized digital QR passes with allocated time slots via WhatsApp."
        },
        {
                "n": "04",
                "title": "Scan at Reception",
                "desc": "Reception staff validate candidate passes in <0.3s to log arrival times."
        },
        {
                "n": "05",
                "title": "Track Round Progress",
                "desc": "Scan passes outside interview rooms to log candidate advancement in real time."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Recruitment Drives in Bangalore?",
        "subtitle": "Talent acquisition leaders and hiring managers across Karnataka's IT hub.",
        "personas": [
                {
                        "badge": "IT ENTERPRISES",
                        "title": "Tech Park IT Campuses",
                        "desc": "Manage high-volume walk-in recruitment drives at ITPL and Electronic City."
                },
                {
                        "badge": "STARTUPS",
                        "title": "High-Growth Scaleups",
                        "desc": "Coordinate weekend hiring hackathons and developer recruiting drives in Koramangala."
                },
                {
                        "badge": "CAMPUS",
                        "title": "College Placement Cells",
                        "desc": "Track student attendance and company interview rounds during placement weeks."
                },
                {
                        "badge": "STAFFING",
                        "title": "Recruitment Agencies",
                        "desc": "Host multi-employer job fairs and trade hiring expos with digital candidate badging."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Candidate Verification Operates at Reception",
        "subtitle": "Fast, organized arrival that clears campus reception lobbies.",
        "description": "Candidates display their digital pass on their smartphone screen or Apple Wallet. Reception staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the candidate's name, role, and allocated time slot, and logs their arrival timestamp immediately.",
        "points": [
                "Eliminates slow manual searching through printed candidate binders.",
                "Displays real-time pass validity with candidate name, applied role, and slot time.",
                "Prevents uninvited walk-ins from entering without prior registration.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help manage walk-in recruitment drives in Bangalore?",
                "a": "UrPass lets you set up slot-based candidate registration, collect resumes and experience details, dispatch digital QR passes via WhatsApp, and check in candidates in <0.3s using phone cameras."
        },
        {
                "q": "Can we restrict candidate arrival to specific time slots?",
                "a": "Yes. You can configure multiple time slots (e.g. 9 AM, 11 AM, 2 PM) with strict capacity caps. The candidate's digital pass displays their assigned slot, and scanners alert staff to off-slot arrivals."
        },
        {
                "q": "Can we track candidate progression through interview rounds?",
                "a": "Yes. UrPass supports multi-stage scanning. Stationing phone scanners outside technical and HR interview rooms allows you to track candidate progress in real time."
        },
        {
                "q": "Do candidates need to print their entry passes?",
                "a": "No. UrPass is 100% digital. Candidates show the QR pass sent to their WhatsApp, email, or Apple Wallet directly on their phone screen."
        },
        {
                "q": "What pricing applies to recruitment drives on UrPass?",
                "a": "UrPass offers transparent flat software subscriptions starting from ₹499/month, with zero per-candidate ticketing fees."
        }
],
      }}
    />
  );
}
