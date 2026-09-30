import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  ArrowRight,
  ScanLine,
  CreditCard,
  Ticket,
  ShieldAlert,
  Laptop,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Help & Support Center | Knowledge Base & Contact",
  description:
    "Get help with URPASS: step-by-step guides for event creation, QR code pass generation, entrance gate scanning, Razorpay payment setups, and direct customer support.",
  keywords: [
    "URPASS support",
    "URPASS help center",
    "URPASS contact",
    "how to use URPASS",
    "URPASS QR scanner help",
    "URPASS ticket troubleshooting",
  ],
  alternates: { canonical: "https://urpass.space/support" },
  openGraph: {
    title: "URPASS Help & Support Center | Knowledge Base & Contact",
    description:
      "Find quick answers, setup guides, and reach our dedicated event specialist support team.",
    url: "https://urpass.space/support",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "URPASS Help Center & Support",
      },
    ],
  },
};

const supportCategories = [
  {
    icon: Ticket,
    title: "Creating Events & Forms",
    description: "Learn how to build custom registration forms, set attendance limits, and configure approval workflows.",
    link: "/guides/how-to-create-qr-event-pass",
  },
  {
    icon: ScanLine,
    title: "Entrance QR Check-in",
    description: "Everything about setting up door staff, scanning QR codes with mobile cameras, and offline sync.",
    link: "/how-qr-ticket-validation-works",
  },
  {
    icon: CreditCard,
    title: "Ticketing & Payments",
    description: "Connecting Razorpay, collecting UPI or card payments, setting zero-commission payouts, and GST invoices.",
    link: "/razorpay-event-ticketing",
  },
  {
    icon: Laptop,
    title: "MCP & AI Integrations",
    description: "Configuring the Model Context Protocol server in Claude Desktop or Cursor for AI-assisted event workflows.",
    link: "/mcp-event-management",
  },
  {
    icon: BookOpen,
    title: "Platform Guides & Tutorials",
    description: "Explore in-depth tutorials on running hackathons, university fests, and multi-entrance conferences.",
    link: "/guides",
  },
  {
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    description: "Browse 35+ answers covering free tier limits, attendee privacy, custom pass design, and refunds.",
    link: "/faq",
  },
];

export default function SupportPage() {
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
        name: "Support & Help Center",
        item: "https://urpass.space/support",
      },
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
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              URPASS HELP &amp; SUPPORT
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              How can we help you?
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Explore step-by-step guides, troubleshoot entrance scanning, or speak directly with our event operations team.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                Contact Organizer Support
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Check System Status
              </Link>
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
                Help by Category
              </h2>
              <p className="text-sm text-neutral-600">
                Quick answers and setup instructions for your event workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <AnimateIn key={cat.title} delay={idx * 50} from="up">
                    <Link
                      href={cat.link}
                      className="p-6 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between h-full group"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-4 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-neutral-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-200/60 flex items-center text-xs font-semibold text-neutral-800 group-hover:text-emerald-600">
                        <span>Read articles</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Direct Email Support Banner */}
        <section className="py-16 px-5 sm:px-8 bg-neutral-50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-emerald-600 block mb-1">
                Direct Contact
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Need on-ground help for an upcoming event?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-lg">
                Our support team helps organizers with custom badge templates, gate load balancing, and high-volume attendee imports.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:urpass.space@yespstudio.com"
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white text-neutral-800 px-5 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                Submit Ticket
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
