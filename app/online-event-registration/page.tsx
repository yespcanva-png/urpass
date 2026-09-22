import type { Metadata } from "next";
import { Globe, ClipboardCheck, QrCode, CreditCard, Users, ShieldCheck, Zap, ArrowRight, Share2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Registration System | URPASS",
  description: "Accept registrations online, collect attendee details, manage approvals and generate digital event passes with URPASS.",
  keywords: [
    "online event registration",
    "online event signup",
    "event registration online",
    "digital event registration",
    "web event signup",
    "online attendee registration",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/online-event-registration" },
  openGraph: {
    title: "Online Event Registration System | URPASS",
    description: "Accept registrations online, collect attendee details, manage approvals and generate digital event passes with URPASS.",
    url: "https://urpass.space/online-event-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ONLINE REGISTRATION SYSTEM",
        h1: "Take Your Event Registration Online",
        canonicalUrl: "https://urpass.space/online-event-registration",
        description: "Give attendees a simple way to register while URPASS keeps registrations, approvals and event access organized.",
        ctaLabel: "Create Registration Page",
        features: [
          { icon: Globe, title: "Branded Web Registration Pages", desc: "Launch responsive, high-converting event landing pages with your banner, description, schedule, and custom fields." },
          { icon: ClipboardCheck, title: "Tailored Registration Forms", desc: "Collect essential attendee data — student IDs, dietary preferences, t-shirt sizes, or team names — with flexible questions." },
          { icon: QrCode, title: "Instant QR Pass Generation", desc: "Registrants immediately receive digital passes with encrypted QR codes accessible in any mobile browser." },
          { icon: CreditCard, title: "Seamless Payment Processing", desc: "Integrate native Razorpay payments to collect ticket fees via UPI (PhonePe, Google Pay), cards, and net banking." },
          { icon: Users, title: "Self-Service or Curated Approvals", desc: "Auto-approve open community signups or manually review applicants for selective workshops and hackathons." },
          { icon: ShieldCheck, title: "Real-Time Capacity Guard", desc: "Set strict seat limits per ticket type with automatic sold-out statuses and waitlists to prevent venue overbooking." },
        ],
        steps: [
          { n: "01", title: "Create Registration Form", desc: "Add your event schedule, venue address, ticket categories, and custom fields." },
          { n: "02", title: "Publish & Share Link", desc: "Distribute your registration link across social channels, WhatsApp groups, and email." },
          { n: "03", title: "Attendees Register Online", desc: "Participants fill out the mobile-optimized form in under 60 seconds with no logins." },
          { n: "04", title: "Automated Digital Passes", desc: "Approved guests receive direct access to their high-resolution digital QR passes." },
          { n: "05", title: "Scan at Door", desc: "Volunteers scan QR passes at the entrance in under 0.3 seconds using any smartphone." },
        ],
        callout: {
          badge: "STREAMLINED WEB ACCESS",
          title: "A professional online registration presence in under 5 minutes.",
          description: "Generic form builders force attendees into clunky experiences that fail to deliver entrance credentials. URPASS bridges the gap between web signup and venue entrance by automatically generating verified digital credentials the moment an attendee registers.",
          bullets: [
            "Frictionless online signups without requiring attendee account creation",
            "Zero per-ticket platform commission fees — keep 100% of your ticket revenue",
            "Instant pass generation and delivery with Apple Wallet and PDF download support",
            "Centralized database syncing registrations to entrance gate scanners live",
          ],
        },
        deepDiveSections: [
          {
            badge: "BEYOND GENERIC FORMS",
            title: "Moving from Google Forms to Dedicated Online Event Registration",
            paragraphs: [
              "When event organizers start out, Google Forms or Typeform seem like easy solutions. However, generic form tools only solve the data collection step. They cannot enforce ticket capacities, process payments securely, prevent duplicate submissions, or issue verifiable entrance passes.",
              "Organizers who rely on generic forms end up spending dozens of hours exporting spreadsheets, writing mail-merge scripts to email QR codes, and printing paper attendee lists that slow down entry on event day.",
              "URPASS gives organizers a purpose-built online registration system. Every registration is linked directly to a unique digital credential, capacity counter, and gate verification scanner, creating a seamless pipeline from online signup to physical admission."
            ],
            bullets: [
              "Automates the manual work of emailing tickets and passes to registrants",
              "Prevents registration overselling with real-time seat inventory tracking",
              "Integrates native Indian payments via UPI, Google Pay, PhonePe, and cards",
              "Enables live entrance verification without printing paper lists"
            ],
            takeaway: "Replacing generic forms with URPASS eliminates hours of spreadsheet busywork and delivers a modern, professional experience to attendees."
          },
          {
            badge: "ATTENDEE SATISFACTION",
            title: "Instant Digital Pass Delivery That Attendees Love",
            paragraphs: [
              "Nothing creates more anxiety for event attendees than registering online and wondering if their registration went through or how they will enter the venue. Sending static PDF attachments often leads to lost emails and chaotic searches at the check-in desk.",
              "URPASS delivers instant confirmation with a direct link to a responsive digital event pass. Attendees can bookmark the link, save the pass to Apple Wallet, or save the high-contrast QR code to their device photos.",
              "On event day, attendees simply present the screen to entrance staff. There is no app to download, no password to reset, and no delay at the door."
            ],
            bullets: [
              "Instant confirmation screen with direct pass access",
              "Add to Apple Wallet support for one-tap lock screen access",
              "High-contrast QR code optimized for quick scanning in sunlight or dim lighting",
              "Displays venue map, schedule, and personalized attendee credentials"
            ],
            takeaway: "Friction-free pass delivery ensures attendees arrive at your event prepared, relaxed, and ready for rapid gate admission."
          }
        ],
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences & Summits",
          "Hands-On Workshops & Bootcamps",
          "Developer Meetups & Hackathons",
          "Webinars & Virtual Conferences",
          "Corporate Seminars & Training",
          "Community Gatherings & Sports Tournaments",
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Event Registration Form Builder", href: "/event-registration-form-builder", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "Can Google Forms Generate Event QR Passes?", href: "/guides/can-google-forms-generate-event-qr-passes", category: "Guide" },
          { title: "Event Registration Delhi", href: "/in/delhi", category: "Location" },
        ],
        faqs: [
          { q: "What is an online event registration system?", a: "An online event registration system is web-based software that allows organizers to publish an event registration page, collect attendee information, accept ticket payments, and issue digital admission credentials online." },
          { q: "How do attendees register for an event on URPASS?", a: "Attendees click your event registration link, fill out your customized form fields, complete payment (if ticketed), and instantly receive their unique digital QR pass without needing to create an account or download an app." },
          { q: "Can I collect payments for online registrations in India?", a: "Yes. URPASS natively integrates with Razorpay, allowing Indian organizers to collect ticket registration fees directly via UPI (Google Pay, PhonePe, Paytm), debit/credit cards, and net banking with zero platform commission." },
          { q: "Can I limit the number of attendees who can register online?", a: "Yes. You can set strict attendee capacity limits per event or ticket tier. Once capacity is reached, the registration form automatically closes or shifts into waitlist mode." },
          { q: "Can I customize the questions asked during registration?", a: "Yes. You can add custom questions, dropdown selectors, checkboxes, and text fields to gather attendee college names, employee IDs, dietary choices, or workshop track preferences." },
          { q: "How do I check in attendees who registered online?", a: "Every online registration generates a unique digital QR pass. At the venue entrance, staff simply open the URPASS mobile scanner link in Safari or Chrome and scan attendee QR codes in under 0.3 seconds." },
        ],
        ctaTitle: "Take your event registration online today",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
