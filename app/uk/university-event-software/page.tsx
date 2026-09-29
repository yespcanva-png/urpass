import type { Metadata } from "next";
import {
  GraduationCap,
  Building2,
  Users,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Event Management Software UK | URPASS",
  description:
    "UK university event management and ticketing software. Built for student unions, academic faculties, and student societies. Collect Student IDs, run freshers' fairs and conferences, and scan QR passes in <0.3s.",
  keywords: [
    "university event management software uk",
    "uk university ticketing platform",
    "student society event software",
    "students union event management",
    "campus event registration uk",
    "freshers fair event ticketing",
    "university conference check-in uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/university-event-software",
    languages: {
      "en-GB": "https://urpass.space/uk/university-event-software",
      "x-default": "https://urpass.space/university-event-software",
    },
  },
  openGraph: {
    title: "University Event Management Software UK | URPASS",
    description:
      "Empower UK university faculties, student unions, and campus societies with high-speed QR check-in, student ID capture, and 0% ticket commission.",
    url: "https://urpass.space/uk/university-event-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkUniversityEventSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/university-event-software",
        badge: "UK HIGHER EDUCATION · CAMPUS EVENT OS",
        h1: "University Event Management & Ticketing Software for UK Campuses",
        description:
          "From large-scale freshers' fairs and society balls to departmental research symposiums and careers expos, URPASS provides UK universities, students' unions, and societies with sub-second QR check-in, Student ID collection, and zero platform commission.",
        ctaLabel: "Start Campus Free Trial",

        directAnswer: {
          title: "How does URPASS support UK universities and higher education events?",
          summary:
            "URPASS is purpose-built for the UK higher education ecosystem, addressing the specific operational workflows of students' unions, academic departments, and student societies. It allows organizers to capture institutional Student IDs and course details during registration, run multi-door gate scanning via smartphones without rented hardware, maintain continuity across annual committee handovers, and protect student data under strict UK GDPR standards.",
          keyPoints: [
            "Mandatory Student ID, department, and society membership capture",
            "Sub-second (<0.3s) camera scanning on student committee personal phones",
            "0% ticket commission keeps valuable funds inside society and union accounts",
            "Full UK GDPR compliance and institutional data protection alignment",
          ],
        },

        keyFactsTable: {
          title: "UK University Event Platform Evaluation",
          subtitle: "Comparison of URPASS against commercial ticketing marketplaces for British campus operations.",
          headers: ["Criterion", "URPASS Campus OS", "Commercial Marketplaces (Eventbrite / FIXR)"],
          rows: [
            {
              col1: "Platform Commission",
              col2: "0% Commission (Flat GBP tiers; Free tier £0 for smaller events)",
              col3: "6% to 10% per ticket, draining society budgets",
            },
            {
              col1: "Gate Hardware",
              col2: "Personal smartphones of student volunteers (Safari / Chrome)",
              col3: "App downloads required or costly laser terminal rentals",
            },
            {
              col1: "Student ID Validation",
              col2: "Custom mandatory fields with regex validation for university formats",
              col3: "Limited generic custom fields with no format enforcement",
            },
            {
              col1: "Annual Committee Handover",
              col2: "Role-based workspace access easily transferred between executive teams",
              col3: "Personal account lock-in causing lost history upon graduation",
            },
            {
              col1: "Student Data Privacy",
              col2: "Zero marketing to students; strictly compliant with UK GDPR & DPA 2018",
              col3: "Student emails targeted with ads for nightlife and competitor events",
            },
          ],
        },

        features: [
          {
            icon: GraduationCap,
            title: "Student ID Verification",
            desc: "Collect and validate university email domains (.ac.uk) and institutional Student ID numbers to prevent non-student registrations.",
          },
          {
            icon: Building2,
            title: "Students' Union Ready",
            desc: "Engineered to support union-wide societies, sports clubs, academic councils, and central entertainment venues.",
          },
          {
            icon: ScanLine,
            title: "Rapid Queue Clearance",
            desc: "Check in 60+ students per minute per door scanner, clearing campus entrance queues even in rainy UK weather.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Attendees receive mobile-optimized digital QR tickets directly via email, compatible with any smartphone screen.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Student personal data is encrypted, strictly compartmentalized, and never sold or shared with commercial marketers.",
          },
          {
            icon: Zap,
            title: "Committee Handover Friendly",
            desc: "Smoothly transfer event control to incoming society executives at the end of each academic year without losing records.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Configure University Fields",
            desc: "Set up registration requirements such as Student ID, academic department, and society membership status.",
          },
          {
            n: "02",
            title: "Share Society Link",
            desc: "Circulate the registration URL across WhatsApp group chats, Instagram link trees, and departmental emails.",
          },
          {
            n: "03",
            title: "Approve or Auto-Issue",
            desc: "Automatically deliver passes to verified student emails or review external guest applications manually.",
          },
          {
            n: "04",
            title: "Scan at the Campus Venue",
            desc: "Student committee volunteers open the camera scanner in their phone browsers and check in guests in <0.3s.",
          },
          {
            n: "05",
            title: "Export Union Reports",
            desc: "Download full attendance logs and statistical summaries for university health & safety and union grant submissions.",
          },
        ],

        deepDiveSections: [
          {
            badge: "CAMPUS ENGAGEMENT",
            title: "Modernising Event Admission Across the UK University Sector",
            paragraphs: [
              "Across institutions like Manchester, Edinburgh, UCL, Cambridge, and Leeds, student unions and academic departments organize thousands of events annually. Yet many continue to rely on slow paper sign-in sheets or commercial ticketing apps that skim substantial booking fees from student pockets.",
              "Documented student event systems, such as the QR-based entry protocols utilized by Manchester Students' Union, demonstrate that students expect fast, mobile-first admission. URPASS brings this modern standard to every UK society and faculty, without the need for bespoke software development or expensive hardware.",
            ],
            bullets: [
              "Zero barrier to entry with our 30-day full free trial",
              "Works across campus halls, lecture theatres, union bars, and sports grounds",
              "Prevents ticket reselling and black-market pass trading at society balls",
              "Enables clear headcount compliance for university safety marshals",
            ],
            takeaway: "Deliver an effortless, digital-first event experience for your university community.",
          },
        ],

        useCases: [
          "Freshers' Fairs & Welcome Week Events",
          "Student Union Society Balls & Dinners",
          "Academic Department Conferences & Symposiums",
          "University Open Days & Campus Tours",
          "Student Hackathons & Coding Competitions",
          "Guest Speaker Lectures & Debates",
        ],

        relatedLinks: [
          {
            title: "Student Union Event Ticketing",
            href: "/uk/student-union-event-ticketing",
            category: "Use Case",
          },
          {
            title: "College Event Registration UK",
            href: "/uk/college-event-registration",
            category: "Use Case",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can we restrict event tickets exclusively to university students?",
            a: "Yes. You can require attendees to sign up with a valid institutional email address (e.g., @manchester.ac.uk, @ox.ac.uk, @ucl.ac.uk) or enter a valid Student ID number before receiving a ticket.",
          },
          {
            q: "How does URPASS help with committee handovers?",
            a: "Incoming society presidents and treasurers can be granted administrative access to the society workspace, ensuring continuity of past event records, attendee templates, and branding without relying on personal accounts.",
          },
          {
            q: "Is there a free tier for small student society events?",
            a: "Yes. URPASS offers a Free Forever plan supporting up to 100 registrations per month. For larger campus conferences or society balls, our paid tiers start at just £15/month with zero ticket commissions.",
          },
        ],

        ctaTitle: "Bring modern event technology to your campus",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. No credit card required. Up and running for your university in minutes.",
      }}
    />
  );
}
