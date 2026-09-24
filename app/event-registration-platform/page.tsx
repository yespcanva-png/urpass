import type { Metadata } from "next";
import { ClipboardList, Ticket, ShieldCheck, Users, Zap, BarChart3, ArrowRight, UserCheck, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Platform for Easy Sign-Ups | URPASS",
  description: "Create registration pages, collect attendee information, manage approvals and issue digital passes with URPASS.",
  keywords: [
    "event registration platform",
    "event signup platform",
    "registration system",
    "attendee registration",
    "digital passes",
    "QR event registration",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software" },
  openGraph: {
    title: "Event Registration Platform for Easy Sign-Ups | URPASS",
    description: "Create registration pages, collect attendee information, manage approvals and issue digital passes with URPASS.",
    url: "https://urpass.space/event-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REGISTRATION PLATFORM",
        h1: "One Platform for Event Registration",
        canonicalUrl: "https://urpass.space/event-registration-software",
        description: "Build a smoother journey from attendee registration to event-day entry with a registration platform designed for modern events.",
        ctaLabel: "Start Accepting Registrations",
        features: [
          { icon: ClipboardList, title: "Custom Registration Fields", desc: "Collect any attendee detail — college roll numbers, dietary preferences, t-shirt sizes, or team names — with flexible form inputs." },
          { icon: Ticket, title: "Instant QR Pass Issuance", desc: "Approved registrants automatically receive dynamic digital passes containing high-contrast, tamper-proof QR codes." },
          { icon: ShieldCheck, title: "Flexible Approval Workflows", desc: "Choose instant self-service confirmations or manual organizer review for competitive hackathons, VIP summits, and workshops." },
          { icon: Users, title: "Capacity & Waitlist Control", desc: "Set strict registrant caps per ticket tier with automated waitlisting to prevent venue overcrowding and capacity violations." },
          { icon: Zap, title: "Razorpay Payment Integration", desc: "Collect attendee ticket fees via UPI (PhonePe, GPay, Paytm), credit/debit cards, and net banking with zero platform commission." },
          { icon: BarChart3, title: "Live Attendee Database", desc: "Search, filter, categorize, and export your entire attendee directory into CSV or Excel format in a single click." },
        ],
        steps: [
          { n: "01", title: "Build Your Form", desc: "Configure questions, set seat capacities, and upload your event branding." },
          { n: "02", title: "Share Public Link", desc: "Distribute your registration URL across email, WhatsApp, and social media." },
          { n: "03", title: "Review Registrations", desc: "Approve signups automatically or evaluate applications manually." },
          { n: "04", title: "Auto-Issue Passes", desc: "Registrants receive instant access to their responsive digital mobile passes." },
          { n: "05", title: "Scan at Entrance", desc: "Volunteers scan attendee QR passes at the entrance in under 0.3 seconds." },
        ],
        callout: {
          badge: "HIGHER CONVERSION",
          title: "Frictionless signups for attendees. Total control for organizers.",
          description: "Attendees abandon registration pages when forced to create accounts, remember passwords, or download bulky apps. URPASS keeps the signup process clean, responsive, and completed in under 60 seconds on any smartphone browser.",
          bullets: [
            "No attendee app download or account creation required to register",
            "Instant pass delivery via web link, SMS, or email confirmation",
            "Zero platform commission on paid tickets — keep 100% of sales",
            "Live organizer dashboard showing registration pace and conversion",
          ],
        },
        deepDiveSections: [
          {
            badge: "REGISTRATION EXPERIENCE",
            title: "Designing Registration Journeys That Convert",
            paragraphs: [
              "Every extra click or mandatory account signup on a registration page directly reduces conversion rates. Traditional ticketing engines force prospective attendees through password setups, verification captchas, and unwanted promotional newsletters before they can even reserve a seat.",
              "URPASS streamlines registration into a direct, mobile-first journey. Attendees click your event link, fill in your customized questions, and instantly receive their unique digital pass without logging into a third-party marketplace.",
              "For paid events, native Razorpay integration allows Indian participants to pay seamlessly via UPI apps like Google Pay and PhonePe, eliminating credit card drop-offs."
            ],
            bullets: [
              "Optimized for high-speed mobile completion in under 60 seconds",
              "Native UPI payments for highest checkout completion rates in India",
              "Clean custom branding without competitor event ads or suggestions",
              "Instant confirmation with direct pass access"
            ],
            takeaway: "By removing registration hurdles and third-party app requirements, organizers achieve up to 35% higher signup completion rates."
          },
          {
            badge: "ATTENDEE MANAGEMENT",
            title: "Approvals, Waitlists, and Automated Pass Delivery",
            paragraphs: [
              "Not every event operates on a first-come, first-served basis. Hackathons require project screening, VIP conferences require executive approval, and academic seminars require institution verification.",
              "URPASS gives organizers dual approval modes: instant automatic admission for public events, or a structured manual review pipeline where organizers can review registrant credentials, approve or reject applications in bulk, and trigger automated pass delivery.",
              "When maximum venue limits are reached, capacity gating prevents overbooking and maintains a timestamped waitlist queue ready for backfilling."
            ],
            bullets: [
              "Bulk approval and rejection actions with custom notification triggers",
              "Automated capacity thresholds preventing ticket overselling",
              "Direct digital pass generation with dynamic attendee credentials",
              "One-click CSV/Excel roster export for campus or sponsor compliance"
            ],
            takeaway: "Maintain complete gatekeeper control over event admission without running messy spreadsheet formulas or manually sending passes."
          }
        ],
        useCases: [
          "Technical Symposiums",
          "Hackathons & Buildathons",
          "College Fests & Culturals",
          "Developer Conferences",
          "Executive Masterclasses",
          "Community Meetups",
          "Webinars & Hybrid Summits",
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Online Event Registration", href: "/online-event-registration", category: "Product" },
          { title: "Event Registration Form Builder", href: "/event-registration-form-builder", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "College Event Registration Guide", href: "/guides/college-event-registration-system", category: "Guide" },
          { title: "Event Software Chennai", href: "/in/chennai", category: "Location" },
        ],
        faqs: [
          { q: "What is an event registration platform?", a: "An event registration platform is software that enables organizers to create public registration pages, collect participant data, process ticket payments, manage attendee rosters, and issue entrance passes from a single dashboard." },
          { q: "Can I customize the registration questions for my event?", a: "Yes. You can add text fields, multiple-choice questions, dropdown menus, and custom requirements to collect roll numbers, company names, dietary restrictions, or portfolio links." },
          { q: "Do attendees need to create an account to register?", a: "No. Attendees register through a direct public web link without needing to create an account or install any mobile apps." },
          { q: "How do attendees access their digital passes after registering?", a: "Upon registration completion or organizer approval, attendees receive a direct URL to their digital pass. The pass displays a high-resolution QR code, event schedule, and venue details." },
          { q: "Can I collect registration fees via UPI in India?", a: "Yes. URPASS integrates natively with Razorpay, allowing Indian attendees to pay using UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and net banking." },
          { q: "Can I export registrant data for sponsors or internal teams?", a: "Yes. You can export your full attendee roster including custom form answers and check-in timestamps to CSV or Excel at any point." },
        ],
        ctaTitle: "Start collecting registrations today",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
