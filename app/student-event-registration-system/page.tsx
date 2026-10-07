import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Event Registration & Campus QR Check-In System | UrPass",
  description: "Free registration, digital QR passes, student ID verification, and rapid door check-in for college clubs, fests, hackathons, and society events.",
  keywords: [
    "student event registration system",
    "student event registration system online",
    "student event registration system platform",
    "student event registration system check in",
    "student event registration system qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/student-event-registration-system",
  },
  openGraph: {
    title: "Student Event Registration & Campus QR Check-In System | UrPass",
    description: "Free registration, digital QR passes, student ID verification, and rapid door check-in for college clubs, fests, hackathons, and society events.",
    url: "https://urpass.space/student-event-registration-system",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "STUDENT & CAMPUS EDITION",
        h1: "Student Event Registration & Campus QR Check-In System",
        canonicalUrl: "https://urpass.space/student-event-registration-system",
        description: "Free registration, digital QR passes, student ID verification, and rapid door check-in for college clubs, fests, hackathons, and society events.",
        ctaLabel: "Create Student Event Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Student Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best event registration system for student events?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For student events, UrPass provides free registration forms, student roll number capture, instant digital QR pass dispatch, volunteer smartphone scanning, and zero commission on paid club tickets.",
          keyPoints: ["Generous permanent free plan for student clubs, campus societies, and academic events","Collect student roll numbers, university departments, and team member details","Instant digital QR pass delivery to student email and WhatsApp","Turn student volunteer phones into entrance scanners in under 30 seconds"],
        },
        whatIs: {
          title: "What is a Student Event Registration System?",
          definition: "A student event registration system is a campus-tailored platform designed for university clubs, student unions, and academic departments to organize registrations, distribute digital tickets, and verify student admission at venue doors.",
          details: ["Replaces messy Google Forms and paper check-in sheets at campus auditoriums","Prevents non-students and unauthorized guests from entering restricted campus events","Eliminates door bottlenecks during 1,000+ student cultural fest rushes","Provides verified attendance CSV logs for faculty advisors and university administration"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Student ID & Branch Capture",
            desc: "Collect roll number, year of study, department, and college name on custom forms.",
          },
          {
            icon: ScanLine,
            title: "Instant Mobile QR Passes",
            desc: "Deliver digital passes directly to student inboxes with personalized QR codes.",
          },
          {
            icon: Zap,
            title: "Student Volunteer Scanners",
            desc: "Authorize student coordinators to scan tickets on their phones with simple PIN codes.",
          },
          {
            icon: Lock,
            title: "Zero Commission Club Ticketing",
            desc: "Collect club membership or fest entry fees with direct UPI/Stripe payouts and 0% cut.",
          },
          {
            icon: CheckCircle2,
            title: "Faculty Approval Mode",
            desc: "Review student applications before releasing official admission passes.",
          },
          {
            icon: BarChart3,
            title: "Academic Attendance Logs",
            desc: "Export verified attendance lists with entry timestamps for academic attendance credit.",
          },
        ],
        deepDiveSections: [
          {
            badge: "CAMPUS SCALE & SPEED",
            title: "How UrPass Solves High-Volume Student Fest & Symposium Operations",
            paragraphs: ["Student coordinators organizing college symposiums, hackathons, or annual fests face a common nightmare: Google Forms collect thousands of responses, but on event morning, coordinators are stuck with printed paper sheets. Searching names on paper creates 45-minute queues, while students share screenshots of confirmation emails to sneak friends inside.","UrPass modernizes the entire campus workflow. Coordinators launch a mobile registration form in minutes. When students register, UrPass automatically issues a unique digital QR pass. At the auditorium doors, student volunteers scan passes on their phones in 0.28 seconds, admitting 40+ students per minute per door while atomic database locks eliminate screenshot sharing."],
            bullets: ["Sub-0.3s camera scanning clears 1,000+ students in under 20 minutes across campus doors","Atomic duplicate blocking stops pass sharing via WhatsApp screenshots","Volunteers scan using their own phones with zero app downloads or equipment rentals","Generates clean attendance spreadsheets ready for faculty and HoD submission"],
            takeaway: "UrPass empowers student leaders to organize professional, queue-free campus events with zero budget overhead.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Student Event Workflow","Google Forms + Paper Lists","UrPass Student Platform"],
          rows: [{"col1":"Pass Delivery","col2":"None (students show form confirmation email)","col3":"Automated branded digital QR pass"},{"col1":"Door Check-In Method","col2":"Manual paper list ticking (45s/student)","col3":"0.28s mobile optical camera scan"},{"col1":"Screenshot Fraud Prevention","col2":"Zero (multiple people show same email)","col3":"Atomic sub-150ms duplicate rejection"},{"col1":"Cost for Student Clubs","col2":"Free (but high manual labor)","col3":"Free permanent plan with full QR features"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"University Student Unions","desc":"Organize campus-wide freshers weeks, cultural nights, and election debates.","badge":"STUDENT UNION"},{"title":"Academic & Tech Clubs","desc":"Host coding hackathons, robotics symposiums, and guest lecture series.","badge":"TECH CLUBS"},{"title":"Sports & Cultural Societies","desc":"Manage inter-college tournaments, drama productions, and dance competitions.","badge":"CULTURALS"},{"title":"Departmental Coordinators","desc":"Track verified seminar attendance for academic credit and certificates.","badge":"ACADEMIA"}],
        },
        relatedLinks: [
        {
                "title": "Events in India Hub",
                "href": "/in",
                "category": "Location"
        },
        {
                "title": "College Event Management Software",
                "href": "/college-event-management-software",
                "category": "Use Case"
        },
        {
                "title": "Free QR Ticket Generator",
                "href": "/free-qr-ticket-generator",
                "category": "Product"
        },
        {
                "title": "Event Features Suite",
                "href": "/features",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "Is UrPass free for student clubs and university societies?",
                    "a": "Yes. UrPass offers a generous free tier specifically suited for student clubs, campus fests, and society events with no credit card required."
          },
          {
                    "q": "Can we collect student roll numbers and department details?",
                    "a": "Yes. You can add custom mandatory fields to collect student ID numbers, departments, academic years, and college affiliations."
          },
          {
                    "q": "How do student volunteers scan tickets at the entrance?",
                    "a": "Organizers generate a volunteer scanner PIN link. Student volunteers open the link on their mobile browser (Safari/Chrome), enter the PIN, and start scanning immediately."
          },
          {
                    "q": "Can students share ticket screenshots to sneak friends into campus fests?",
                    "a": "No. The instant a student's QR code is scanned, it is locked in real time. If another student presents a screenshot of that same pass, the scanner immediately sounds a red duplicate alert."
          },
          {
                    "q": "Can we sell paid tickets for pro-nights or merchandise?",
                    "a": "Yes. UrPass supports paid ticketing with 0% platform commission, connecting directly to Razorpay (UPI) or Stripe for instant club payouts."
          },
          {
                    "q": "Can we export attendance data to give to professors or HoDs?",
                    "a": "Yes. You can export verified attendance spreadsheets with full student details and exact door entry timestamps with one click."
          },
          {
                    "q": "Do attendees need to download an app to get their pass?",
                    "a": "No. Students receive their QR pass via email and WhatsApp, which they can open directly on their phone screen or add to Apple/Google Wallet."
          }
],
        ctaTitle: "Student Event Registration & Campus QR Check-In System",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
