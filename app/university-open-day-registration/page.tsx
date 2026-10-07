import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Open Day Registration Software & Campus QR Check-In UK | UrPass",
  description: "Streamline university open day registrations, campus tours, departmental talks, and prospective student QR check-in across UK campus venues with UrPass.",
  keywords: [
    "university open day registration software",
    "university open day registration software online",
    "university open day registration software platform",
    "university open day registration software check in",
    "university open day registration software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/university-open-day-registration",
  },
  openGraph: {
    title: "University Open Day Registration Software & Campus QR Check-In UK | UrPass",
    description: "Streamline university open day registrations, campus tours, departmental talks, and prospective student QR check-in across UK campus venues with UrPass.",
    url: "https://urpass.space/university-open-day-registration",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "UK HIGHER ED & OPEN DAYS",
        h1: "University Open Day Registration Software & Campus QR Check-In UK",
        canonicalUrl: "https://urpass.space/university-open-day-registration",
        description: "Streamline university open day registrations, campus tours, departmental talks, and prospective student QR check-in across UK campus venues with UrPass.",
        ctaLabel: "Create Open Day Registration",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore UK Higher Ed Features",
        secondaryCtaHref: "/pricing?country=GB",
        directAnswer: {
          title: "What is the best university open day registration software in the UK?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For UK university open days, UrPass manages prospective student bookings, departmental session capacities, automated digital QR passes, and multi-venue smartphone check-in with full UK GDPR compliance.",
          keyPoints: ["Manage subject-specific taster sessions, campus tours, and prospective student numbers","Instant automated digital QR pass delivery with campus maps and arrival instructions","Student ambassadors scan tickets at building entrances using standard smartphones","Full UK GDPR compliance and real-time attendance telemetry for admissions analytics"],
        },
        whatIs: {
          title: "What is University Open Day Registration Software?",
          definition: "University open day registration software is a campus recruitment platform that allows higher education institutions to coordinate prospective student registrations, book departmental subject talks, and track attendee arrivals across campus buildings.",
          details: ["Prevents overcrowding in popular lecture theatres and departmental lab sessions","Replaces slow reception desks with rapid 0.28s student ambassador smartphone scanning","Provides admissions teams with verified attendance records to optimize offer conversion","Ensures strict compliance with UK data protection and privacy standards"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Course & Departmental Slot Booking",
            desc: "Allow prospective students to select subject talks, campus tours, and accommodation viewings.",
          },
          {
            icon: ScanLine,
            title: "Instant QR Passes for Students & Guests",
            desc: "Automate digital pass delivery for applicants and accompanying parents/guardians.",
          },
          {
            icon: Zap,
            title: "Student Ambassador Mobile Scanners",
            desc: "Equip student guides with smartphone scanners via simple PIN links without logins.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & Privacy Compliance",
            desc: "Enterprise-grade data encryption and privacy controls adhering to UK data standards.",
          },
          {
            icon: CheckCircle2,
            title: "Multi-Building Check-In Tracking",
            desc: "Track student arrivals at main reception, engineering labs, and business school auditoriums.",
          },
          {
            icon: BarChart3,
            title: "Admissions Recruitment Analytics",
            desc: "Analyze real-time attendance turnout, subject popularity, and conversion velocity.",
          },
        ],
        deepDiveSections: [
          {
            badge: "UK ADMISSIONS EXCELLENCE",
            title: "Enhancing the Prospective Student Experience on UK Campus Open Days",
            paragraphs: ["University open days represent the most critical touchpoint for converting prospective applicants into enrolled students. When thousands of students and parents arrive at campus hubs, long registration queues create a poor first impression and cause visitors to miss morning welcome lectures.","UrPass streamlines open day operations. Prospective students receive a digital QR pass upon booking. Student ambassadors stationed at campus gates, train station shuttles, and building entrances scan passes in 0.28 seconds using standard mobile phones. Admissions teams monitor live subject turnout and export verified attendee data for post-event recruitment campaigns."],
            bullets: ["Sub-0.3 second check-in ensures smooth flow across campus concourses and buildings","Student ambassadors require zero training—open browser link and start scanning","Real-time attendance tracking per department identifies high-interest academic courses","Seamless export to university admissions CRM systems (e.g. Slate, Salesforce Education)"],
            takeaway: "UrPass delivers a modern, frictionless open day experience that reflects university excellence.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Open Day Workflow Metric","Legacy Manual / Paper Reception","UrPass Higher Ed Platform"],
          rows: [{"col1":"Arrival Check-In Time","col2":"45–60s per student (name lookup)","col3":"0.28s ultra-fast smartphone QR scan"},{"col1":"Ambassador Scanner Deployment","col2":"Expensive rented barcode guns","col3":"Zero cost (ambassadors' own phones)"},{"col1":"Multi-Building Tracking","col2":"Disconnected paper clipboards","col3":"Real-time unified campus-wide cloud sync"},{"col1":"UK GDPR Compliance","col2":"Vulnerable paper lists","col3":"Encrypted, audit-logged digital records"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"University Admissions & Recruitment","desc":"Manage undergraduate and postgraduate open days, applicant visit days, and campus tours.","badge":"ADMISSIONS"},{"title":"Academic Faculties & Schools","desc":"Track attendance at medicine, law, and engineering subject taster workshops.","badge":"FACULTIES"},{"title":"Student Accommodation Teams","desc":"Coordinate viewing slots and check-in times for university halls of residence.","badge":"HOUSING"},{"title":"Higher Education Outreach","desc":"Track school group visits and widening participation outreach programs.","badge":"OUTREACH"}],
        },
        relatedLinks: [
        {
                "title": "UK Event Hub & GBP Pricing",
                "href": "/uk",
                "category": "Location"
        },
        {
                "title": "London Event QR Check-In",
                "href": "/uk/london/event-qr-check-in",
                "category": "Location"
        },
        {
                "title": "Zero Commission Ticketing UK",
                "href": "/zero-commission-event-ticketing-uk",
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
                    "q": "How does UrPass help UK universities manage open day registrations?",
                    "a": "UrPass provides a mobile-friendly registration page, manages capacities for subject talks, delivers digital QR passes to prospective students and parents, and enables student ambassadors to scan passes rapidly using mobile phones."
          },
          {
                    "q": "Can student ambassadors scan passes on their own smartphones?",
                    "a": "Yes. Ambassadors open a secure PIN link in their mobile browser and can start scanning immediately without downloading an app or accessing administrative data."
          },
          {
                    "q": "Can we track attendance across multiple campus buildings?",
                    "a": "Yes. You can assign different scanning stations to specific locations (e.g. Main Concourse, Science Building, Arts Complex) to monitor student movement across campus."
          },
          {
                    "q": "Is UrPass compliant with UK GDPR regulations?",
                    "a": "Yes. UrPass enforces strict data encryption in transit and at rest, supporting UK university privacy and data governance policies."
          },
          {
                    "q": "Can we export attendance data to our university CRM?",
                    "a": "Yes. You can export complete attendance records—including student names, courses of interest, and exact arrival timestamps—as CSV or Excel files."
          },
          {
                    "q": "Can prospective students bring parents and guests on a single booking?",
                    "a": "Yes. You can configure group registration fields to capture parent/guest numbers and issue unified passes."
          },
          {
                    "q": "What is the pricing for UK universities?",
                    "a": "UrPass offers transparent GBP (£) pricing with a permanent free plan for community events and affordable unlimited plans for institution-wide use."
          }
],
        ctaTitle: "University Open Day Registration Software & Campus QR Check-In UK",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
        geo: {
          region: "United Kingdom",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB"
        },
      }}
    />
  );
}
