import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { BookOpen, ArrowRight, QrCode, ClipboardList, ShieldAlert, School, Layers, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides & Educational Knowledge Base — Event Registration & QR Check-In",
  description: "Step-by-step guides, comparisons, and best practices for event registration, digital passes, QR code gate check-in, and attendee management.",
  alternates: { canonical: "https://urpass.space/guides" },
  openGraph: {
    title: "Event Registration & QR Check-In Guides | URPASS",
    description: "Learn how to issue digital passes, eliminate gate lines, and run seamless check-ins for colleges, conferences, and fests.",
    url: "https://urpass.space/guides",
    locale: "en_IN",
    type: "website",
  },
};

const GUIDE_SECTIONS = [
  {
    category: "QR Check-In & Gate Operations",
    icon: QrCode,
    description: "How QR scanning works, eliminating entry queues, and managing multi-door venues.",
    guides: [
      {
        title: "What Is QR Event Check-In?",
        href: "/guides/what-is-qr-event-check-in",
        summary: "Understand how digital QR passes replace paper lists and authenticate guests in under 0.3s.",
      },
      {
        title: "How Does QR Event Check-In Work?",
        href: "/guides/how-does-qr-event-check-in-work",
        summary: "The technical and operational breakdown of tokenized QR scanning at modern event doors.",
      },
      {
        title: "How to Check in 1,000 Attendees Quickly",
        href: "/guides/how-to-check-in-1000-attendees-quickly",
        summary: "High-throughput entrance setup: lane organization, volunteer scanners, and cloud sync.",
      },
      {
        title: "How to Manage Multiple Event Entrances",
        href: "/guides/how-to-manage-multiple-event-entrances",
        summary: "Synchronize check-ins across multiple gates and doors without duplicate admissions.",
      },
      {
        title: "How to Prevent Duplicate Event Entry",
        href: "/guides/prevent-duplicate-event-entry",
        summary: "Lock out shared, forwarded, or photocopied tickets with single-use cryptographic tokens.",
      },
      {
        title: "Best Way to Check Attendees Into an Event",
        href: "/guides/best-way-to-check-attendees-into-an-event",
        summary: "Comparing barcode scanners, manual paper rosters, RFID wristbands, and mobile QR scanners.",
      },
      {
        title: "How to Run Event Check-In Without an App",
        href: "/guides/event-check-in-without-app",
        summary: "Use standard mobile browsers on staff phones with zero App Store or Play Store downloads.",
      },
    ],
  },
  {
    category: "Event Registration & Forms",
    icon: ClipboardList,
    description: "Designing forms, collecting attendee details, and managing approval queues.",
    guides: [
      {
        title: "What Information Should an Event Registration Form Collect?",
        href: "/guides/what-information-should-event-registration-form-collect",
        summary: "Essential attendee fields, custom questions, and avoiding form abandonment.",
      },
      {
        title: "How to Track Event Attendance in Real Time",
        href: "/guides/how-to-track-event-attendance-in-real-time",
        summary: "Live dashboard tracking: arrivals, check-in velocity, and department breakdowns.",
      },
      {
        title: "Event Registration Software vs Google Forms",
        href: "/guides/event-registration-software-vs-google-forms",
        summary: "Why spreadsheets fail at the event entrance and how dedicated systems solve the full flow.",
      },
      {
        title: "Can Google Forms Generate Event QR Passes?",
        href: "/guides/can-google-forms-generate-event-qr-passes",
        summary: "Evaluating Google Forms add-ons versus native single-use QR ticketing platforms.",
      },
      {
        title: "How to Run Event Registration Without Eventbrite",
        href: "/guides/how-to-run-event-registration-without-eventbrite",
        summary: "Avoid high commission fees with flat-rate subscriptions and native INR Razorpay support.",
      },
      {
        title: "How to Create Free Event Tickets Online",
        href: "/guides/how-to-create-free-event-tickets-online",
        summary: "Launch free community or meetup tickets with automated QR pass delivery at zero cost.",
      },
    ],
  },
  {
    category: "Pass Design & Ticket Generation",
    icon: Layers,
    description: "Branding digital tickets, generating QR tokens, and multi-channel delivery.",
    guides: [
      {
        title: "How to Create Digital Event Passes",
        href: "/guides/how-to-create-digital-event-passes",
        summary: "Configure brand colors, logos, attendee badge tiers, and responsive web passes.",
      },
      {
        title: "How to Create QR Codes for Event Attendees",
        href: "/guides/how-to-create-qr-codes-for-event-attendees",
        summary: "Automate unique QR code generation tied directly to registrant records.",
      },
      {
        title: "How to Send QR Tickets to Attendees",
        href: "/guides/how-to-send-qr-tickets-to-attendees",
        summary: "Best practices for pass delivery via confirmation screens, emails, and SMS links.",
      },
      {
        title: "QR Ticket vs Paper Ticket: The Modern Event Guide",
        href: "/guides/qr-ticket-vs-paper-ticket",
        summary: "Comparing security, environmental impact, operational speed, and cost efficiency.",
      },
    ],
  },
  {
    category: "Colleges, Hackathons & Conferences",
    icon: School,
    description: "Tailored workflows for campus culturals, technical fests, and multi-day summits.",
    guides: [
      {
        title: "How to Manage College Event Registrations",
        href: "/guides/how-to-manage-college-event-registrations",
        summary: "Student verification, inter-college participation, and department reporting.",
      },
      {
        title: "How to Create a College Fest Registration Form",
        href: "/guides/how-to-create-college-fest-registration-form",
        summary: "Structuring forms for cultural fests, team registrations, and individual workshops.",
      },
      {
        title: "How to Set Up a College Event Registration System",
        href: "/guides/college-event-registration-system",
        summary: "Full blueprint for universities and student councils managing campus-wide events.",
      },
      {
        title: "How to Organize Registration for a Hackathon",
        href: "/guides/how-to-organize-registration-for-a-hackathon",
        summary: "Managing team applications, tech tracks, mentor passes, and late-night re-entry.",
      },
      {
        title: "How to Manage Conference Attendees",
        href: "/guides/how-to-manage-conference-attendees",
        summary: "Handling VIPs, speaker badges, badge printing, and session attendance tracking.",
      },
    ],
  },
];

export default function GuidesHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://urpass.space/guides" },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <BookOpen className="w-3.5 h-3.5 text-brand" />
              EVENT ORGANIZER GUIDES &amp; BEST PRACTICES
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
              Event Registration &amp; QR Check-In Guides
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore in-depth tutorials and authoritative answers on issuing digital passes, preventing entrance fraud, and setting up high-speed QR check-ins.
            </p>
          </div>
        </section>

        {/* Guides Grid by Category */}
        <section className="py-20 px-5 sm:px-8 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            {GUIDE_SECTIONS.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-brand" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    {section.category}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mb-6 ml-12">
                  {section.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.guides.map((guide) => (
                    <Link
                      key={guide.title}
                      href={guide.href}
                      className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/40 hover:bg-white hover:border-brand-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-sm mb-2 group-hover:text-brand transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                          {guide.summary}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read guide <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
