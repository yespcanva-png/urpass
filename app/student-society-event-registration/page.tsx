import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Society Event Registration & Free QR Ticketing UK | UrPass",
  description: "Empower UK university student societies with free event registration, instant digital QR passes, committee scanner access, and zero commission fees.",
  keywords: [
    "student society event registration",
    "student society event registration online",
    "student society event registration platform",
    "student society event registration check in",
    "student society event registration qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/student-society-event-registration",
  },
  openGraph: {
    title: "Student Society Event Registration & Free QR Ticketing UK | UrPass",
    description: "Empower UK university student societies with free event registration, instant digital QR passes, committee scanner access, and zero commission fees.",
    url: "https://urpass.space/student-society-event-registration",
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
        badge: "UK STUDENT SOCIETIES",
        h1: "Student Society Event Registration & Free QR Ticketing Platform UK",
        canonicalUrl: "https://urpass.space/student-society-event-registration",
        description: "Empower UK university student societies with free event registration, instant digital QR passes, committee scanner access, and zero commission fees.",
        ctaLabel: "Create Society Event Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View UK Society Features",
        secondaryCtaHref: "/pricing?country=GB",
        directAnswer: {
          title: "What is the best event registration platform for UK university student societies?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For UK student societies, UrPass provides free registration tools, university email verification, instant QR passes, committee smartphone scanning, and zero ticket commission on paid society socials.",
          keyPoints: ["Permanent free plan tailored for UK university societies, sports clubs, and academic groups","Custom registration forms capturing student ID, year of study, and dietary preferences","Instant automated digital QR pass delivery to student email and Apple/Google Wallet","Committee members scan passes at lecture rooms and social venues using phone cameras"],
        },
        whatIs: {
          title: "What is Student Society Event Registration Software?",
          definition: "Student society event registration software is an accessible platform designed for UK university student societies and clubs to organize free socials, guest lectures, workshops, and paid mixers without budget overhead.",
          details: ["Replaces messy Google Sheets and paper checklists at room doors","Provides verified attendee records required by Student Union funding and room booking rules","Allows committee members to scan passes on their phones without downloading apps","Eliminates ticket fees so 100% of society funds stay within the student club"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Free Permanent Society Tier",
            desc: "Host unlimited free society events and meetings with no credit card required.",
          },
          {
            icon: Users,
            title: "Student ID & Course Capture",
            desc: "Collect student IDs, degree courses, and dietary choices on custom registration forms.",
          },
          {
            icon: ScanLine,
            title: "Instant Mobile QR Passes",
            desc: "Students receive digital QR passes via email, ready to display on phone screens.",
          },
          {
            icon: Zap,
            title: "Committee Smartphone Scanners",
            desc: "Authorize society committee members to scan tickets using simple PIN links.",
          },
          {
            icon: Lock,
            title: "Zero Commission on Paid Socials",
            desc: "Keep 100% of ticket revenue for paid formals, balls, and dinners via Stripe.",
          },
          {
            icon: BarChart3,
            title: "SU Attendance Reporting",
            desc: "Export clean CSV attendance reports to prove meeting numbers for Student Union grant funding.",
          },
        ],
        deepDiveSections: [
          {
            badge: "UK SOCIETY EFFICIENCY",
            title: "How UrPass Supports UK University Societies and Student Unions",
            paragraphs: ["University societies run on tight student budgets and volunteer committee time. Using manual sign-in sheets wastes the first 15 minutes of every society meeting, while commercial ticketing platforms take a painful 8% commission on annual society ball tickets.","UrPass is the ideal solution for UK student societies. Committee members can spin up an event page in 2 minutes. Students register seamlessly and receive instant QR tickets. At the lecture hall or pub room entrance, committee members scan passes in 0.28 seconds on their phones. All funds from paid events settle directly into the society's account with 0% platform commission."],
            bullets: ["No complex training or setup required—built for busy student volunteers","0% ticket fees keep society funds intact for equipment, socials, and guest speakers","Fast 0.28s scanning prevents corridor crowding in university campus buildings","Official CSV logs simplify annual Student Union affiliation and grant reviews"],
            takeaway: "UrPass provides UK student societies with professional event technology at zero cost to their budgets.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Society Operational Need","Google Forms / Paper Sheet","UrPass UK Society Platform"],
          rows: [{"col1":"Pass Delivery","col2":"None (students show email confirmation)","col3":"Instant automated digital QR pass"},{"col1":"Door Check-In Method","col2":"Manual paper list search (45s/person)","col3":"0.28s optical camera scan on phone"},{"col1":"Paid Event Commission","col2":"5%–9% on commercial platforms","col3":"0% ticket commission"},{"col1":"SU Grant Attendance Proof","col2":"Scattered paper signatures","col3":"Clean verified digital CSV export"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Academic & Professional Societies","desc":"Law, medicine, engineering, and finance societies hosting guest speakers and career panels.","badge":"ACADEMIC"},{"title":"Cultural & International Societies","desc":"Cultural nights, international food festivals, and celebration galas.","badge":"CULTURAL"},{"title":"Special Interest & Hobby Clubs","desc":"Gaming, debate, drama, and film societies organizing regular weekly sessions.","badge":"HOBBY"},{"title":"Charity & Campaigning Groups","desc":"Student fundraising events, panel debates, and campus awareness campaigns.","badge":"CHARITY"}],
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
                    "q": "Is UrPass completely free for UK student societies?",
                    "a": "Yes. UrPass has a permanent free plan for student societies, clubs, and campus groups with zero hidden fees or credit card requirements."
          },
          {
                    "q": "How do society committee members scan tickets at room entrances?",
                    "a": "Committee members open a volunteer scanner PIN link in their mobile browser and use their phone camera to scan student QR passes in 0.28 seconds."
          },
          {
                    "q": "Can we collect student ID numbers and dietary requirements?",
                    "a": "Yes. You can add custom questions to your registration page to collect student ID numbers, dietary restrictions, and year of study."
          },
          {
                    "q": "Does UrPass charge commission if we sell tickets for our society ball?",
                    "a": "No. UrPass charges 0% commission on ticket sales. You only pay standard Stripe card processing fees, keeping maximum funds for your society."
          },
          {
                    "q": "Can we export attendee lists to submit to our Student Union?",
                    "a": "Yes. You can export complete attendance records with one click to verify turnout for SU funding and room bookings."
          },
          {
                    "q": "Do members need an app to show their ticket?",
                    "a": "No. Students can display their digital QR ticket directly from their email inbox, Apple Wallet, or Google Wallet."
          },
          {
                    "q": "Can we restrict events to university students only?",
                    "a": "Yes. You can require attendees to register with their official university email address (.ac.uk) or enable manual committee approval."
          }
],
        ctaTitle: "Student Society Event Registration & Free QR Ticketing Platform UK",
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
