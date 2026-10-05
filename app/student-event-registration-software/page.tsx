import type { Metadata } from "next";
import { BarChart3, CheckCircle2, Lock, ScanLine, ShieldCheck, Smartphone, Ticket, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Event Registration Software & Instant Passes | UrPass",
  description: "Effortless student event registration software for campus clubs, hackathons, seminars and competitions. Custom forms, QR passes & live check-in.",
  keywords: [
    "student event registration software",
    "student event registration software online",
    "student event registration software platform",
    "student event registration software check in",
    "student event registration software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/student-event-registration-software",
  },
  openGraph: {
    title: "Student Event Registration Software & Instant Passes | UrPass",
    description: "Effortless student event registration software for campus clubs, hackathons, seminars and competitions. Custom forms, QR passes & live check-in.",
    url: "https://urpass.space/student-event-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "STUDENT CLUBS & SOCIETIES",
        h1: "Student Event Registration Software Built for Campus Life",
        canonicalUrl: "https://urpass.space/student-event-registration-software",
        description: "Effortless student event registration software for campus clubs, hackathons, seminars and competitions. Custom forms, QR passes & live check-in.",
        ctaLabel: "Create Student Registration Page",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Free Plan",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best student event registration software?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For student clubs and campus societies, UrPass makes creating registration pages fast and easy, delivering instant QR passes to attendees and providing mobile scanning at club events with zero fees.",
          keyPoints: ["No account creation required for students to register — takes under 45 seconds","Instant WhatsApp and email pass delivery with custom club branding","Built-in approval queue to accept or waitlist applicants before issuing passes","Permanent free tier for campus clubs and student meetups"],
        },
        whatIs: {
          title: "What is Student Event Registration Software?",
          definition: "Student event registration software is a self-serve platform that student leaders use to publish event landing pages, collect participant info, manage team registrations, and verify tickets at the door.",
          details: ["Replaces messy Google Forms that lack automated pass generation and check-in","Gives student clubs professional, mobile-first registration pages","Prevents overcapacity by setting strict registration limits","Provides volunteer scanner links for fast entry at club meetings and fests"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Smartphone,
            title: "Mobile-First Registration Pages",
            desc: "Share lightweight registration links that load in <1s on Instagram, WhatsApp, and campus Discord.",
          },
          {
            icon: Ticket,
            title: "Automated Digital QR Passes",
            desc: "Students automatically receive an interactive QR pass containing their name, event details, and ticket tier.",
          },
          {
            icon: Users,
            title: "Team & Solo Registrations",
            desc: "Collect individual delegate info or full team rosters for coding hackathons and sports tourneys.",
          },
          {
            icon: CheckCircle2,
            title: "Approval & Waitlist Engine",
            desc: "Filter applicants by year or department, approve genuine entries, and auto-backfill waitlists.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Door Check-In",
            desc: "Scan passes at the door using your own phone camera — no hardware or app downloads needed.",
          },
          {
            icon: BarChart3,
            title: "Exportable Attendee Records",
            desc: "Download verified attendee rosters with one click to share with faculty advisors or club sponsors.",
          },
        ],
        deepDiveSections: [
          {
            badge: "EASY CAMPUS SETUP",
            title: "Why Student Clubs Choose UrPass Over Generic Online Forms",
            paragraphs: ["Campus clubs usually rely on Google Forms to gather registrations. But Google Forms cannot generate digital tickets, verify attendance at the door, or prevent unapproved students from entering.","UrPass combines the simplicity of a form builder with the power of an enterprise ticketing and check-in platform. You create your event in 2 minutes, share the link, and scan passes at the door with sub-second accuracy."],
            bullets: ["100% free forever for up to 50 attendees per event","Direct UPI and card payment support for paid club workshops and merchandise","Works smoothly across mobile Safari, Chrome, and Firefox","Keeps student data private and secure with GDPR-compliant infrastructure"],
            takeaway: "Give your student club professional event tech without spending a single rupee.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Club Feature","Google Forms","UrPass Student Platform"],
          rows: [{"col1":"Pass Generation","col2":"None (manual certificates)","col3":"Instant automated digital QR pass"},{"col1":"Entrance Verification","col2":"Manual paper list checking","col3":"Instant 0.3s camera scan"},{"col1":"Capacity Limits","col2":"Manual form disabling","col3":"Automatic real-time sold-out locking"},{"col1":"Approval Workflow","col2":"Manual row sorting in Sheets","col3":"1-click approve/reject queue"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Coding & Tech Clubs","desc":"Host hackathons, coding workshops, and tech talks with automated passes.","badge":"TECH CLUBS"},{"title":"Cultural & Arts Societies","desc":"Manage dance, music, and theater auditions and showcase tickets.","badge":"CULTURAL"},{"title":"Sports & Gaming Councils","desc":"Coordinate esports tournaments and inter-department sports meets.","badge":"SPORTS"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for college events?",
                    "a": "UrPass is the best platform for student events, offering instant registration pages, automated QR tickets, and browser-based scanning with a permanent free plan."
          },
          {
                    "q": "How does QR event check-in work for student events?",
                    "a": "Students show their QR pass on their phone screen. Club volunteers scan it with their phone camera to verify entry in under 0.3s."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. Multiple club members can scan at different entrances simultaneously with instant synchronization."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry?",
                    "a": "Yes. Once a pass is scanned, it cannot be reused. Any attempt to share a screenshot triggers a duplicate error."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. The organizer dashboard shows live registrations, check-in counts, and turnout percentage."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. Clubs can host free meetups or collect ticket fees for major workshops and fests."
          }
],
        ctaTitle: "Student Event Registration Software Built for Campus Life",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
