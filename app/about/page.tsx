import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { CheckCircle2, Building, ShieldCheck, Zap, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About URPASS — Event Registration & QR Check-In Platform",
  description: "URPASS is an event registration and QR check-in platform built by Yesp Corporation to make event entry simpler for colleges, conferences, and modern organizers.",
  alternates: { canonical: "https://urpass.space/about" },
  openGraph: {
    title: "About URPASS — Event Registration & QR Check-In Platform",
    description: "URPASS brings the complete registration-to-entry workflow into one simple system. Built by Yesp Corporation.",
    url: "https://urpass.space/about",
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://urpass.space",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About URPASS",
        item: "https://urpass.space/about",
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "URPASS",
    url: "https://urpass.space",
    logo: "https://urpass.space/icon.png",
    description: "Event registration and QR check-in platform built to make event entry simpler.",
    parentOrganization: {
      "@type": "Organization",
      name: "Yesp Corporation",
      url: "https://urpass.space/about",
      description: "Building simple digital products for businesses and organizations.",
    },
    knowsAbout: [
      "Event Registration Software",
      "QR Code Check-In",
      "Digital Event Passes",
      "Attendee Management",
      "Event Ticketing India",
    ],
  };

  const workflowSteps = [
    { n: "01", title: "Create the event", desc: "Set up registration forms, ticket tiers, and capacity in minutes." },
    { n: "02", title: "Share the link", desc: "Distribute your public registration link across channels." },
    { n: "03", title: "Manage attendees", desc: "Review, approve, or auto-admit applicants with clear status." },
    { n: "04", title: "Issue digital passes", desc: "Automatically send unique, encrypted QR passes to approved guests." },
    { n: "05", title: "Scan QR codes", desc: "Use any phone or tablet browser as an instant entrance scanner." },
    { n: "06", title: "Track attendance", desc: "Monitor live check-in rates and gate analytics on your dashboard." },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              ABOUT URPASS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              About URPASS
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-6">
              URPASS is an event registration and QR check-in platform built to make event entry simpler.
            </p>

            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-3xl mx-auto">
              Organizers can create event registration forms, manage attendees, issue digital QR passes, design event tickets, scan attendees at the entrance and track attendance from one platform.
            </p>
          </div>
        </section>

        {/* Why URPASS Exists */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-6">
                  Why URPASS Exists
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                  <p>
                    Event organizers often manage registrations through forms, spreadsheets, messages and printed attendee lists. The final mile of the event — checking people in at the entrance — often devolves into long queues, paper lists, and confusion.
                  </p>
                  <p className="font-semibold text-neutral-900">
                    URPASS brings the complete registration-to-entry workflow into one simple system:
                  </p>
                </div>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {workflowSteps.map((step, i) => (
                <AnimateIn key={step.title} delay={i * 60} from="up">
                  <div className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-brand-200 hover:shadow-xs transition-all h-full">
                    <span className="text-xs font-mono font-bold text-brand block mb-2">{step.n}</span>
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">{step.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Modern Events */}
        <section className="py-24 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-300 block mb-2">Audience &amp; Scale</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                Built for Modern Events
              </h2>
              <div className="space-y-4 text-white/80 text-base sm:text-lg leading-relaxed mb-10">
                <p>
                  URPASS is designed for college fests, hackathons, workshops, conferences, corporate events, seminars, community meetups and other organized events.
                </p>
                <p>
                  Attendees don&apos;t need complicated software or dedicated app installations to enter an event. Organizers can manage registration and check-in digitally while staff can verify passes using supported phones and tablets directly in their browser.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  "College Culturals & Fests",
                  "24h Hackathons",
                  "Tech Conferences",
                  "Hands-on Workshops",
                  "Corporate Summits",
                  "Academic Seminars",
                  "Developer Meetups",
                  "Campus Orientations",
                ].map((item) => (
                  <div key={item} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/90 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Built by Yesp Corporation */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="p-8 sm:p-12 rounded-3xl border border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">Company</span>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                      Built by Yesp Corporation
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-neutral-600 text-base leading-relaxed mb-8">
                  <p>
                    URPASS is a product of <strong>Yesp Corporation</strong>, focused on building simple digital products for businesses and organizations.
                  </p>
                  <p>
                    We believe essential business workflows like ticketing and gate verification shouldn&apos;t require bloated enterprise contracts, proprietary scanner hardware, or 10% platform cuts.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Our Core Commitment</p>
                  <p className="text-lg sm:text-xl font-bold text-neutral-900">
                    Make event registration and entry faster, simpler and easier to manage.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Start your first event free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-white transition-colors"
                  >
                    Get in touch with team
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
