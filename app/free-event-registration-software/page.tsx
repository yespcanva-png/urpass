import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  ArrowRight,
  Sparkles,
  Download,
  BarChart3,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FAQItemSection from "@/components/landing/FAQItemSection";
import InteractiveFreeSoftwareHero from "@/components/landing/InteractiveFreeSoftwareHero";

export const metadata: Metadata = {
  title: "Free Event Registration Software with QR Check-In | URPASS",
  description:
    "Create event registrations, generate digital QR passes and scan attendees at the entrance with URPASS. Free to start. No credit card required.",
  keywords: [
    "free event registration software",
    "free event check in app",
    "free qr code tickets",
    "free event ticketing platform",
    "event registration software free",
    "google forms alternative for events",
    "free college event registration software",
    "free hackathon registration platform",
  ],
  alternates: {
    canonical: "https://urpass.space/free-event-registration-software",
  },
  openGraph: {
    title: "Free Event Registration Software with QR Check-In | URPASS",
    description:
      "Create event registrations, generate digital QR passes and scan attendees at the entrance with URPASS. Free to start. No credit card required.",
    url: "https://urpass.space/free-event-registration-software",
    siteName: "URPASS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Event Registration Software with QR Check-In | URPASS",
    description:
      "Create event registrations, generate digital QR passes and scan attendees at the entrance with URPASS. Free to start. No credit card required.",
  },
};

const faqs = [
  {
    q: "Is URPASS truly free to use?",
    a: "Yes! URPASS provides a permanent free plan designed for community organisers, college clubs, and independent workshops. You can create your event, collect registrations, generate encrypted digital QR passes, and scan attendees at the venue entrance at ₹0 forever with no credit card required.",
  },
  {
    q: "How does the free QR pass generation work?",
    a: "When an attendee registers on your event page, URPASS automatically generates a cryptographically signed digital QR pass with their name, ticket tier, and unique hash. The pass is instantly viewable on mobile web, downloadable as an image, and can be saved directly to Apple Wallet or Google Wallet.",
  },
  {
    q: "Do I need to download a mobile app to scan tickets at the door?",
    a: "No! URPASS features an in-browser scanner that runs directly in Safari, Chrome, or Firefox on any smartphone or tablet. Simply sign in to your organiser account, tap 'Open Scanner', grant camera permission, and scan QR badges in under 0.28 seconds.",
  },
  {
    q: "How is URPASS better than Google Forms for events?",
    a: "Google Forms only collects raw spreadsheet entries—it cannot issue tamper-proof tickets, cannot prevent duplicate forwarding of confirmation emails, and requires volunteers to manually search names in a spreadsheet at the door. URPASS issues individual digital QR passes and provides real-time gate scanning that flags duplicate or invalid entries in 0.28s.",
  },
  {
    q: "What are the exact limits of the Free Tier?",
    a: "The permanent Free tier includes 1 active event at a time and up to 50 attendee registrations per event (or up to 100 registrations per month across events) with full digital pass generation and unlimited gate scanning. If your event needs higher capacity, you can upgrade to Pro or Business anytime.",
  },
  {
    q: "Can I collect custom registration questions?",
    a: "Yes. Even on the free tier, you can customize your registration form to collect attendee phone numbers, college or organization names, student IDs, dietary preferences, or custom text answers.",
  },
  {
    q: "Can I export my attendee registrations to Excel or CSV?",
    a: "Yes! At any time before, during, or after your event, you can download your complete registration and check-in roster as a CSV spreadsheet with timestamps and entry gate records.",
  },
  {
    q: "Does the scanner detect duplicate check-ins?",
    a: "Yes. Once a ticket is scanned at any entry gate, the system marks it as 'Checked In'. If someone attempts to enter using a forwarded screenshot or duplicate printout, the scanner instantly turns red with an audible alert indicating 'Ticket Already Used'.",
  },
  {
    q: "Can I sell paid tickets later if I start with the free tier?",
    a: "Absolutely. You can start on the free tier for your zero-cost events. Whenever you are ready to sell paid tickets, you can connect Razorpay (for India UPI/cards) or Stripe (for global cards) and collect ticket payments directly into your bank account.",
  },
];

export default function FreeEventRegistrationSoftwarePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "URPASS Free Event Registration Software",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: "https://urpass.space/free-event-registration-software",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Permanently free tier with 50 attendee passes, registration form, and phone QR scanning",
    },
    publisher: {
      "@type": "Organization",
      name: "URPASS",
      url: "https://urpass.space",
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <Navbar />

      <main className="pt-24 sm:pt-32">
        {/* Interactive Hero with Real-Time Simulator */}
        <InteractiveFreeSoftwareHero />

        {/* Section 1: Everything You Need in a Free Event Platform */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Full Feature Toolkit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-4">
              Everything You Need in a Free Event Platform
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              Unlike generic form builders or restrictive freemium trials, URPASS provides an end-to-end event management engine at ₹0.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: "Custom Registration Forms",
                desc: "Publish clean, mobile-responsive registration pages. Add custom fields, student ID inputs, phone numbers, and dropdowns.",
              },
              {
                icon: QrCode,
                title: "Instant Digital QR Passes",
                desc: "Every registrant gets a personalized, mobile-ready digital pass complete with attendee name, ticket tier, and anti-fraud QR code.",
              },
              {
                icon: Smartphone,
                title: "In-Browser Phone Scanner",
                desc: "Zero app downloads required. Turn any iPhone or Android camera into an ultra-fast gate scanner operating in under 0.28 seconds.",
              },
              {
                icon: ShieldCheck,
                title: "Duplicate Pass Prevention",
                desc: "Prevent ticket sharing and screenshot fraud. Each QR pass can only be checked in once, with instant duplicate entry warnings.",
              },
              {
                icon: BarChart3,
                title: "Live Attendance Dashboard",
                desc: "Watch real-time check-in counts as attendees arrive. Monitor arrival velocity and door capacity from any device.",
              },
              {
                icon: Download,
                title: "One-Click CSV / Excel Export",
                desc: "Export your complete attendee roster, custom question responses, and check-in timestamps anytime with full data ownership.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 text-neutral-800">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Why URPASS Instead of Google Forms? */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-neutral-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Stop Managing Events With Spreadsheets
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-4">
                Why URPASS Instead of Google Forms?
              </h2>
              <p className="text-base sm:text-lg text-neutral-600">
                Google Forms collects emails into a static sheet. URPASS issues secure entry credentials and verifies attendees at the door in 0.28 seconds.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-12 bg-neutral-900 text-white py-4 px-6 text-xs sm:text-sm font-bold tracking-wide">
                <div className="col-span-5 sm:col-span-6">Capability / Workflow</div>
                <div className="col-span-3 sm:col-span-3 text-center text-neutral-400">Google Forms</div>
                <div className="col-span-4 sm:col-span-3 text-center text-emerald-400 font-extrabold">URPASS Free</div>
              </div>

              {[
                {
                  cap: "Online Registration Form",
                  gf: "Basic generic form",
                  ur: "Clean branded event page",
                  urPass: true,
                },
                {
                  cap: "Individual Digital Pass Issuance",
                  gf: "None (Raw confirmation text)",
                  ur: "Unique mobile QR ticket pass",
                  urPass: true,
                },
                {
                  cap: "Entrance Gate Scanning",
                  gf: "None (Manual sheet searching)",
                  ur: "0.28s In-browser phone scan",
                  urPass: true,
                },
                {
                  cap: "Duplicate Entry & Fraud Blocking",
                  gf: "Zero protection (Screenshots work)",
                  ur: "Instant duplicate alert & lock",
                  urPass: true,
                },
                {
                  cap: "Real-Time Gate Attendance",
                  gf: "Manual spreadsheet counting",
                  ur: "Live live-updating dashboard",
                  urPass: true,
                },
                {
                  cap: "Multi-Volunteer Scanning",
                  gf: "Risk of overwriting rows",
                  ur: "Multi-gate real-time sync",
                  urPass: true,
                },
                {
                  cap: "Setup Time & Ease",
                  gf: "3 minutes",
                  ur: "2 minutes · ₹0 to start",
                  urPass: true,
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 py-3.5 px-6 items-center text-xs sm:text-sm border-t border-neutral-100 ${
                    idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                  }`}
                >
                  <div className="col-span-5 sm:col-span-6 font-semibold text-neutral-800">
                    {row.cap}
                  </div>
                  <div className="col-span-3 sm:col-span-3 text-center text-neutral-500 flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:inline" />
                    <span className="truncate">{row.gf}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-center font-bold text-neutral-900 bg-emerald-50/50 py-1 rounded-lg flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{row.ur}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Built for Every Event Type */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              Use Cases
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-4">
              Built for Every Free Event Type
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              Thousands of attendees enter smoothly with URPASS across diverse sectors and community formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "College Fests & Hackathons",
                tag: "Student Clubs & Tech Fests",
                desc: "Track team entries, prevent non-registered attendees from entering campuses, and scan 500+ participants smoothly without paper rosters.",
              },
              {
                title: "Tech Meetups & Workshops",
                tag: "Developer Communities",
                desc: "Deliver sleek digital passes straight to attendees' phones. Ensure confirmed RSVP holders get priority door access.",
              },
              {
                title: "Seminars & Guest Lectures",
                tag: "Academic & Professional",
                desc: "Record precise arrival timestamps for certification and attendance reporting without delaying speaker sessions.",
              },
              {
                title: "Cultural & Community Meets",
                tag: "Non-Profit & Clubs",
                desc: "Manage capacity caps, register families and volunteers, and welcome guests with a friendly 1-second entrance check-in.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors"
              >
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    {card.tag}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-3 mb-2">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800">
                  <span>Free tier ready</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Transparent Limits on the Free Tier */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white rounded-3xl max-w-5xl mx-auto my-12 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3.5 py-1.5 rounded-full inline-block mb-4">
              100% TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Transparent Limits on the Free Tier
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
              No hidden surprise charges. No trial that expires after 7 days. Here is exactly what is included at ₹0 forever:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
              {[
                { title: "1 Active Event at a time", note: "Host sequentially with unlimited past archives" },
                { title: "Up to 50 Attendees per event", note: "Ideal for club workshops, meetups & masterclasses" },
                { title: "Full QR Pass Issuance Included", note: "Personalized digital passes with anti-fraud encryption" },
                { title: "Unlimited Phone Camera Scanning", note: "Sub-second camera scanner runs on any mobile browser" },
                { title: "Duplicate Entry Detection", note: "Blocks screenshot reuse and second-gate re-entry" },
                { title: "Complete Attendee Data Ownership", note: "Export attendee CSV rosters whenever you want" },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left text-xs text-neutral-400">
                <span className="font-semibold text-white">Need higher capacity?</span> Upgrade to Pro (₹999/mo) or Business (₹2,499/mo) anytime with a single click.
              </div>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shrink-0 text-sm"
              >
                <span>Claim Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: 6-Step Quickstart */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              Quickstart Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-4">
              6-Step Event Check-In Workflow
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              From zero to scanning attendees at the entrance in less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create Account in 30 Seconds",
                desc: "Sign up with your email. No credit card or billing details required to access the free tier.",
              },
              {
                step: "02",
                title: "Configure Event Details",
                desc: "Set event name, schedule, venue location, capacity limit, and customize your registration questions.",
              },
              {
                step: "03",
                title: "Publish & Share Link",
                desc: "Get an instant branded registration link. Share it via WhatsApp, Instagram, LinkedIn, or email.",
              },
              {
                step: "04",
                title: "Instant Digital Passes Issued",
                desc: "Attendees register and receive encrypted QR passes instantly on mobile web or email confirmation.",
              },
              {
                step: "05",
                title: "Open Phone Scanner at Door",
                desc: "Open your organiser dashboard on any phone. Tap scanner to activate your camera in any browser.",
              },
              {
                step: "06",
                title: "Scan in Under 1 Second",
                desc: "Point camera at attendee badges. Pass validates with a green confirmation chime and prevents duplicate entry.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-6 relative overflow-hidden shadow-xs"
              >
                <span className="text-4xl font-extrabold text-neutral-100 absolute top-4 right-4 select-none font-mono">
                  {s.step}
                </span>
                <span className="text-xs font-bold font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  STEP {s.step}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Frequently Asked Questions */}
        <FAQItemSection faqs={faqs} />

        {/* Bottom High-Converting CTA Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready in 2 Minutes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
              Create Your Event Free Today
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Join organizers across colleges, workshops, tech communities, and conferences running zero-delay entrance check-ins.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-neutral-950 font-bold text-base px-8 py-4 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <span>Create My Event Free</span>
                <ArrowRight className="w-4 h-4 text-neutral-700" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 text-neutral-300 font-semibold text-sm px-6 py-4 rounded-xl border border-neutral-800 hover:bg-neutral-850 hover:text-white transition-colors"
              >
                <span>View All Plans</span>
              </Link>
            </div>

            <p className="mt-4 text-xs font-semibold text-neutral-500 tracking-wide">
              ₹0 to start · No credit card · QR passes included
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
