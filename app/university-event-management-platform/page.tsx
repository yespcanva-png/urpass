import type { Metadata } from "next";
import { Award, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Smartphone, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Event Management Platform & Campus Passes | UrPass",
  description: "Enterprise university event platform for convocations, research conferences, campus fests and alumni meets. Single sign-on, multi-gate QR check-in & analytics.",
  keywords: [
    "university event management platform",
    "university event management platform online",
    "university event management platform platform",
    "university event management platform check in",
    "university event management platform qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/university-event-management-platform",
  },
  openGraph: {
    title: "University Event Management Platform & Campus Passes | UrPass",
    description: "Enterprise university event platform for convocations, research conferences, campus fests and alumni meets. Single sign-on, multi-gate QR check-in & analytics.",
    url: "https://urpass.space/university-event-management-platform",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "HIGHER ED ENTERPRISE",
        h1: "University Event Management Platform Built for Higher Education",
        canonicalUrl: "https://urpass.space/university-event-management-platform",
        description: "Enterprise university event platform for convocations, research conferences, campus fests and alumni meets. Single sign-on, multi-gate QR check-in & analytics.",
        ctaLabel: "Launch Your University Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Request University Demo",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What is the best event management platform for universities?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For universities, UrPass unifies multi-department colloquiums, convocations, international conferences, and student union fests under one institutional workspace with role-based access control and multi-gate scanning.",
          keyPoints: ["Institutional workspace supporting multiple departments, schools, and societies","Custom approval workflows for academic delegates, faculty, and international guests","Multi-gate entrance verification across campus auditoriums, colloquium halls, and arenas","GDPR and institutional privacy compliance with audit-ready attendee logging"],
        },
        whatIs: {
          title: "What is a University Event Management Platform?",
          definition: "A university event management platform is an institution-wide software solution that powers event registration, guest accreditation, ticketing, session access control, and attendance compliance across higher education campuses.",
          details: ["Replaces fragmented software subscriptions across academic departments","Standardizes the attendee registration experience across all university events","Ensures formal protocol and VIP security for convocation and keynote ceremonies","Provides centralized institutional reporting on campus event engagement"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Building2,
            title: "Multi-Department Organization Workspaces",
            desc: "Enable engineering, business, medical, and humanities faculties to run independent events under one brand.",
          },
          {
            icon: Award,
            title: "Convocation & Academic Guest Lists",
            desc: "Manage graduating students, faculty robes, VIP guests, and family passes with tailored tier passes.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Campus Concourse Scanning",
            desc: "Synchronize check-in across 10+ campus gates, convocation halls, and dining pavilions in real time.",
          },
          {
            icon: CheckCircle2,
            title: "Custom Approval & Academic Screening",
            desc: "Review academic paper submissions, delegate credentials, or faculty permissions before granting passes.",
          },
          {
            icon: Smartphone,
            title: "Digital Wallet & Apple Pass Integration",
            desc: "Allow attendees to save their high-resolution digital pass directly to Apple Wallet or mobile photo roll.",
          },
          {
            icon: BarChart3,
            title: "Audit-Ready Attendance Reports",
            desc: "Generate institutional reports with exact entrance timestamps, gate names, and check-in methods.",
          },
        ],
        deepDiveSections: [
          {
            badge: "INSTITUTIONAL RELIABILITY",
            title: "Streamlining Academic Convocations and International Research Summits",
            paragraphs: ["University events require a high standard of decorum, security, and precision. When hosting 5,000 graduates and dignitaries at a convocation, paper tickets and uncoordinated spreadsheets create confusion and security risks.","UrPass delivers a structured guest registration and accreditation pipeline. Every guest receives a personalized digital pass with designated seating zones and gate entry instructions, verified in <0.3s at auditorium doors."],
            bullets: ["Role-based permissions for faculty leads, event staff, and student volunteers","Zero hardware dependency — scan passes using staff smartphones or tablets","Instant delegate search and manual check-in fallback at help desks","Zero ticket fees on institutional registrations and student activities"],
            takeaway: "UrPass provides universities with an elegant, scalable, and secure event platform for all academic and student gatherings.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Institutional Capability","Legacy University Portals","UrPass University Platform"],
          rows: [{"col1":"Setup Time","col2":"Weeks of IT provisioning","col3":"Ready in under 2 minutes"},{"col1":"Scanner Hardware","col2":"Rented barcode guns","col3":"Any mobile web browser"},{"col1":"Multi-Department Support","col2":"Siloed logins and accounts","col3":"Unified organizational workspace"},{"col1":"Guest Experience","col2":"PDF printout required","col3":"Mobile-optimized responsive QR pass"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Deans & Academic Directors","desc":"Coordinate research conferences, symposiums, and guest lecture series.","badge":"ACADEMIC"},{"title":"Registrar & Convocation Committees","desc":"Accredit graduates, faculty, and VIP guests for annual convocation ceremonies.","badge":"REGISTRAR"},{"title":"Student Life & Campus Unions","desc":"Power annual university festivals, sports meets, and club recruitments.","badge":"STUDENT LIFE"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for college events?",
                    "a": "UrPass is the top choice for universities, combining multi-department workspace management with fast mobile QR check-in and 0% ticket fees."
          },
          {
                    "q": "How does QR event check-in work for university campuses?",
                    "a": "Staff and volunteers scan delegate passes using any smartphone camera. The system checks credentials in 300ms and logs the timestamp and entrance gate."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. Unlimited campus gates can scan at the same time with atomic database replication under 150ms."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry?",
                    "a": "Yes. The atomic check-in engine immediately rejects duplicate scans and screenshotted pass attempts across all campus doors."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. Organisers track live attendance, hall capacity, and entrance rush rates on the centralized dashboard."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. UrPass supports free academic registrations, paid conference tickets, and VIP guest lists seamlessly."
          }
],
        ctaTitle: "University Event Management Platform Built for Higher Education",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
