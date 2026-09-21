"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { ChevronDown, Search, ArrowRight, HelpCircle } from "lucide-react";

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Registration
  {
    category: "Registration & Forms",
    q: "How do attendees register for an event on URPASS?",
    a: "Attendees register through a single shareable link generated for your event. They complete your custom form in any browser without needing to download an app or create an account.",
  },
  {
    category: "Registration & Forms",
    q: "Can I customize the event registration form fields?",
    a: "Yes. You can collect standard details like full name, email, and phone number, plus custom fields such as student ID, college name, department, dietary preferences, or portfolio links.",
  },
  {
    category: "Registration & Forms",
    q: "Can I set a maximum attendee registration limit or cap?",
    a: "Yes. You can configure a strict capacity limit. Once the attendee cap is reached, the public registration link automatically closes or switches to waitlist mode.",
  },
  {
    category: "Registration & Forms",
    q: "Can I automatically approve attendee registrations?",
    a: "Yes. You can choose between automatic approval (instant digital QR pass issuance upon form submission) or manual review where organizers approve or reject each applicant individually.",
  },
  {
    category: "Registration & Forms",
    q: "How does URPASS compare to Google Forms for event registration?",
    a: "Google Forms only stores entries in a spreadsheet. URPASS manages the entire lifecycle: customized registration forms, instant unique QR passes, single-use entrance scanning, duplicate lockout, and real-time attendance analytics.",
  },
  {
    category: "Registration & Forms",
    q: "Can attendees register on mobile devices?",
    a: "Yes. All URPASS registration forms are fully responsive, lightweight, and optimized for iOS, Android, and desktop browsers.",
  },

  // 2. Tickets & Digital Passes
  {
    category: "Tickets & Digital Passes",
    q: "Can attendees use URPASS without downloading an app?",
    a: "Yes. Attendees can receive and use their digital QR pass without installing any mobile app. The pass opens directly in mobile Safari, Chrome, or any standard web browser.",
  },
  {
    category: "Tickets & Digital Passes",
    q: "How do attendees receive their digital QR event pass?",
    a: "Once approved or paid, attendees receive a direct secure link to their digital pass via confirmation screen, email, or instant messaging. They can bookmark the page or take a screenshot.",
  },
  {
    category: "Tickets & Digital Passes",
    q: "Can attendees save their QR pass to Apple Wallet or Google Wallet?",
    a: "Yes. Digital passes can be saved directly to Apple Wallet on iOS or saved as a mobile web shortcut / image file for quick offline presentation at entrance gates.",
  },
  {
    category: "Tickets & Digital Passes",
    q: "Can I customize the look and design of the event pass?",
    a: "Yes. With the Custom Pass Designer on paid plans, organizers can upload custom logos, set brand hex colors, choose from Minimal, Modern, or Dark themes, and select visible badge pills.",
  },
  {
    category: "Tickets & Digital Passes",
    q: "Can passes be printed on physical paper or badges?",
    a: "Yes. Passes include high-contrast QR codes with standard formatting, making them fully scannable when printed on lanyards, conference badges, or paper tickets.",
  },
  {
    category: "Tickets & Digital Passes",
    q: "Can I offer different ticket tiers like VIP, Student, and General?",
    a: "Yes. Organizers can configure multiple ticket categories, each with its own pricing, seat quota, and dedicated badge pill printed on the pass.",
  },

  // 3. QR Check-In & Gate Scanning
  {
    category: "QR Check-In & Scanning",
    q: "What hardware is required for event check-in?",
    a: "Zero dedicated hardware is required. Any smartphone, tablet, or laptop with a built-in camera and web browser functions as an entry scanner.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "How fast is the entry check-in scanner?",
    a: "Passes scan in under 0.3 seconds directly inside the browser. Staff point their device camera at the attendee's phone or badge for instant green/red entry validation.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "Can multiple volunteers scan tickets at different entrances simultaneously?",
    a: "Yes. Organizers can share PIN-protected scanner links with gate staff. Multiple devices scan simultaneously with instant cloud synchronization across all entrances.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "Do gate volunteers need organizer account credentials to scan?",
    a: "No. Organizers can provide a restricted scanner URL or access PIN so volunteers can scan badges without accessing sensitive attendee data, analytics, or billing settings.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "What happens if venue internet is slow or unstable?",
    a: "The scanner employs local browser caching and optimized network payloads to ensure responsive verification even in crowded auditoriums or outdoor fields with low bandwidth.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "Can staff check in guests manually if their phone battery died?",
    a: "Yes. Gate staff can search attendees by name, email, or registration ID directly inside the check-in interface and perform a manual check-in.",
  },
  {
    category: "QR Check-In & Scanning",
    q: "Does the scanner provide audio and visual confirmation?",
    a: "Yes. Successful check-ins display a vibrant green banner with attendee details and a pleasant chime. Duplicate or invalid passes display an immediate red warning alert.",
  },

  // 4. Payments, Pricing & Free Trial
  {
    category: "Payments & Pricing",
    q: "Can I use URPASS completely free?",
    a: "Yes. The permanent Free Tier allows you to host 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required.",
  },
  {
    category: "Payments & Pricing",
    q: "How does the 30-day free trial on paid plans work?",
    a: "You can test Starter (₹499/mo), Pro (₹999/mo), or Business (₹2,499/mo) completely free for 30 days with no credit card or AutoPay mandate required. You get instant access to all features, and your account simply reverts to the Free plan after 30 days unless you choose to upgrade.",
  },
  {
    category: "Payments & Pricing",
    q: "Does URPASS charge per-ticket commission fees?",
    a: "No. Unlike legacy ticketing platforms that charge 3% to 10% per ticket, URPASS charges zero per-ticket platform commissions. You keep 100% of your ticket sales minus standard payment gateway fees.",
  },
  {
    category: "Payments & Pricing",
    q: "What payment methods are supported for paid ticketing in India?",
    a: "Through native Razorpay integration, attendees can pay via UPI (Google Pay, PhonePe, Paytm), Net Banking, credit cards, debit cards, and corporate cards.",
  },
  {
    category: "Payments & Pricing",
    q: "Are prices inclusive of GST?",
    a: "Subscription plans are priced in INR exclusive of standard GST. Detailed GST tax invoices are automatically generated and available in your billing dashboard.",
  },
  {
    category: "Payments & Pricing",
    q: "Can I upgrade or downgrade my plan between months?",
    a: "Yes. You can switch plans or cancel auto-renewal at any time directly inside your organization billing settings.",
  },

  // 5. Attendee Management & Communication
  {
    category: "Attendee Management",
    q: "Can I export attendee data and check-in logs?",
    a: "Yes. Organizers can export full attendee lists, custom form responses, and timestamped check-in records to CSV or Excel at any time.",
  },
  {
    category: "Attendee Management",
    q: "Can I bulk approve or reject registrations?",
    a: "Yes. The dashboard provides batch selection so organizers can approve hundreds of participants with a single click.",
  },
  {
    category: "Attendee Management",
    q: "Can I collect post-event feedback and ratings?",
    a: "Yes. URPASS includes an automated post-event survey tool that invites checked-in attendees to rate sessions, submit reviews, and give feedback.",
  },
  {
    category: "Attendee Management",
    q: "Can I search and filter attendees by status?",
    a: "Yes. Filter attendees by Checked In, Pending Approval, Rejected, or Ticket Tier in real time with instant text search.",
  },
  {
    category: "Attendee Management",
    q: "Can I add team members and co-organizers to my account?",
    a: "Yes. Depending on your plan (Starter: 2 seats, Pro: 5 seats, Business: 15 seats), you can invite colleagues to collaborate on event management.",
  },

  // 6. Security, Privacy & Duplicate Prevention
  {
    category: "Security & Fraud Prevention",
    q: "Can an attendee pass be scanned more than once?",
    a: "No. Each QR pass contains a cryptographically unique single-use token. Once scanned, the system marks it used. A second scan immediately triggers a red 'Already Checked In' warning with the original scan timestamp.",
  },
  {
    category: "Security & Fraud Prevention",
    q: "Can attendees screenshot and share their QR pass with friends?",
    a: "They can take screenshots, but the pass can only be validated once at the gate. The first person to present the QR code gains entrance; any subsequent attempts will fail.",
  },
  {
    category: "Security & Fraud Prevention",
    q: "Is attendee data sold or shared with third-party advertisers?",
    a: "No. URPASS does not monetize or resell organizer or attendee data. Your attendee database belongs strictly to your organization.",
  },
  {
    category: "Security & Fraud Prevention",
    q: "How does URPASS prevent unauthorized scanner access?",
    a: "Scanner interfaces are secured by individual event access tokens or PIN credentials set by the event organizer.",
  },
  {
    category: "Security & Fraud Prevention",
    q: "Is URPASS hosted on secure cloud infrastructure?",
    a: "Yes. URPASS utilizes enterprise-grade cloud hosting with automated SSL encryption, real-time database replication, and continuous monitoring.",
  },
];

const CATEGORIES = [
  "All",
  "Registration & Forms",
  "Tickets & Digital Passes",
  "QR Check-In & Scanning",
  "Payments & Pricing",
  "Attendee Management",
  "Security & Fraud Prevention",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  function toggleFaq(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
      { "@type": "ListItem", position: 2, name: "Frequently Asked Questions", item: "https://urpass.space/faq" },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              <HelpCircle className="w-3.5 h-3.5 text-brand" />
              KNOWLEDGE BASE &amp; FREQUENTLY ASKED QUESTIONS
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
              Event Registration &amp; QR Check-In FAQ
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
              Find direct, straightforward answers about registration forms, digital QR passes, mobile gate scanning, payments, and security.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., 'app needed', 'scanner', 'UPI')..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-xs"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-5 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-base font-semibold text-neutral-700 mb-2">No matching questions found.</p>
                <p className="text-xs text-neutral-500 mb-6">Try searching with a different keyword or view all categories.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs font-semibold text-brand underline"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl mx-auto">
                {filteredFaqs.map((faq, i) => {
                  const isOpen = openIndexes.includes(i);
                  return (
                    <div
                      key={faq.q}
                      className="border border-neutral-200 rounded-2xl overflow-hidden transition-all bg-white"
                    >
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block mb-1">
                            {faq.category}
                          </span>
                          <h2 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug">
                            {faq.q}
                          </h2>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 transition-transform ${
                            isOpen ? "rotate-180 bg-brand-50 text-brand" : "text-neutral-500"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/30">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Support CTA Callout */}
            <div className="mt-20 p-8 rounded-3xl bg-neutral-900 text-white max-w-3xl mx-auto text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Have a question not listed here?</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6 max-w-md mx-auto">
                Our support team helps event organizers configure forms, passes, and multi-gate scanning.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 font-semibold text-xs hover:bg-neutral-100 transition-colors"
                >
                  Contact Support
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-xs hover:bg-white/10 transition-colors"
                >
                  Start First Event Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
