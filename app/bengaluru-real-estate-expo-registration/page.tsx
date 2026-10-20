import type { Metadata } from "next";
import { Building, CreditCard, FileSpreadsheet, MessageSquare, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Real Estate Expo Registration Bengaluru | UrPass",
  description: "Register visitors for Bengaluru property exhibitions, manage attendee information and validate digital entry passes using UrPass.",
  keywords: ["real estate expo registration bengaluru","bengaluru property show visitor passes","property expo badge scanning bangalore","real estate exhibition ticketing","builder buyer meet registration"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-real-estate-expo-registration",
  },
  openGraph: {
    title: "Real Estate Expo Registration Bengaluru | UrPass",
    description: "Register visitors for Bengaluru property exhibitions, manage attendee information and validate digital entry passes using UrPass.",
    url: "https://urpass.space/bengaluru-real-estate-expo-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Expo Registration Bengaluru | UrPass",
    description: "Register visitors for Bengaluru property exhibitions, manage attendee information and validate digital entry passes using UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruRealEstateExpoRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "REAL ESTATE & PROPERTY EXPOS",
        h1: "Real Estate Expo Visitor Registration in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-real-estate-expo-registration",
        description: "Register visitors for Bengaluru property exhibitions, manage attendee information and validate digital entry passes using UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-real-estate-expo-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Bengaluru Real Estate Expos",
        ctaDescription: "Pre-register home buyers, capture investment budgets and preferred localities, issue WhatsApp QR badges, and verify visitors in <0.3s at expo gates.",
        directAnswer: {
        "title": "What is Real Estate Expo Visitor Registration for Bengaluru?",
        "summary": "Real estate expo visitor registration in Bengaluru captures qualified home buyer registrations, investment budgets, preferred micro-markets (e.g. Whitefield, North Bangalore, Sarjapur), and manages gate check-in for property exhibitions. UrPass provides instant WhatsApp QR passes and sub-0.3s mobile camera scanning with 0% ticket fees.",
        "keyPoints": [
                "Capture buyer intent: property budget, configuration (2/3 BHK, Villa), and preferred locality",
                "Deliver digital QR passes directly to attendee WhatsApp inboxes with venue Google Maps pins",
                "Sub-0.3s smartphone camera scanning validates visitor badges without equipment rental costs",
                "Instant CSV export with qualified buyer contact details for participating builders and developers"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Property Expo Producers Choose UrPass",
        "definition": "Bengaluru's thriving real estate market hosts massive property expos and home buyer conclaves at KTPO, Palace Grounds, and luxury hotels. Capturing high-intent buyer details while moving thousands of families through gates requires fast registration.",
        "details": [
                "Eliminate slow paper registration desks: home buyers pre-register online and walk straight through gates",
                "Pre-qualify buyers with custom questions covering purchase timeline, budget, and bank pre-approval",
                "Deliver personalized digital badges directly to WhatsApp with one-tap Apple Wallet integration",
                "Export verified visitor contact lists to developer CRM systems for immediate sales follow-up"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Paper Registration Desks at Property Shows",
        "subtitle": "Why Bengaluru property exhibition organizers switch to UrPass.",
        "headers": [
                "Exhibition Feature",
                "Paper Registration Desks",
                "UrPass Digital Property Engine"
        ],
        "rows": [
                {
                        "col1": "Entrance Queue Time",
                        "col2": "5 to 15 minutes filling paper slips at crowded counters",
                        "col3": "Sub-0.3s camera scan on visitor's digital QR badge"
                },
                {
                        "col1": "Buyer Lead Capture",
                        "col2": "Illegible handwritten contact info and fake phone numbers",
                        "col3": "Verified mobile numbers and structured budget data"
                },
                {
                        "col1": "Pass Delivery",
                        "col2": "Plastic badges and printed slips thrown away on exit",
                        "col3": "Instant WhatsApp & Apple Wallet digital passes"
                },
                {
                        "col1": "Developer Reporting",
                        "col2": "Days spent typing paper slips into Excel spreadsheets",
                        "col3": "Instant CSV export ready for developer CRM systems"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "BUYER PROFILING",
                "title": "Pre-Qualify Home Buyers with Custom Investment Questionnaires",
                "paragraphs": [
                        "Participating real estate developers in Bengaluru invest heavily in expo booths to meet high-intent buyers. Gathering accurate buyer preferences before they enter the pavilion maximizes exhibitor ROI.",
                        "UrPass allows organizers to configure custom property intake questions. Capture buyer budget ranges (e.g., ₹75L – ₹1.5 Cr, ₹1.5 Cr – ₹3 Cr, Luxury ₹3 Cr+), preferred micro-markets (North Bangalore, Whitefield, Sarjapur), and unit type (2 BHK, 3 BHK, Plot, Villa)."
                ],
                "bullets": [
                        "Capture property configuration, budget band, and purchase timeline during registration",
                        "One-click batch export allows developers to filter leads by budget and preferred locality",
                        "Automated confirmation notices dispatched straight to attendee WhatsApp numbers",
                        "Export complete buyer rosters to CSV for builder CRM distribution"
                ],
                "takeaway": "Structured buyer intake questions deliver qualified leads to participating developers."
        },
        {
                "badge": "GATE VELOCITY",
                "title": "Sub-0.3s Mobile Camera Check-In at Expo Pavilions",
                "paragraphs": [
                        "Property expos held over weekends at Palace Grounds or KTPO attract thousands of families during peak afternoon hours. Sluggish registration counters create frustrating queues that deter prospective buyers.",
                        "UrPass allows gate staff to scan digital QR badges directly on standard smartphone cameras in under 300 milliseconds. Visitors walk straight into exhibition pavilions with zero waiting."
                ],
                "bullets": [
                        "No app installation required for gate volunteers or arriving families",
                        "Passes include Google Maps venue links, show timings, and parking directions",
                        "Prevents duplicate entry attempts automatically with cryptographic token locks",
                        "Manual search by visitor name or phone number provides instant backup check-in"
                ],
                "takeaway": "Sub-0.3s camera check-in moves heavy weekend family footfall into pavilions instantly."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Building,
            title: "Property Buyer Intake",
            desc: "Capture budget band, property configuration (2/3 BHK, Villa), and preferred micro-markets.",
          },
          {
            icon: MessageSquare,
            title: "WhatsApp Pass Delivery",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats with venue Google Maps pins.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan and check in visitors at venue gates using phone cameras with zero hardware rentals.",
          },
          {
            icon: Users,
            title: "Family Entry Passes",
            desc: "Allow primary buyers to register family members under a single unified entrance pass.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect paid investor summit or seminar fees directly with zero platform deductions.",
          },
          {
            icon: FileSpreadsheet,
            title: "Developer-Ready CSV Exports",
            desc: "Export verified buyer lists with budgets and arrival timestamps to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Property Show",
                "desc": "Define expo dates, participating builders, property categories, and buyer intake fields."
        },
        {
                "n": "02",
                "title": "Promote Registration Link",
                "desc": "Promote your responsive event booking page across Google Ads, Meta, and print media."
        },
        {
                "n": "03",
                "title": "Issue Digital Passes",
                "desc": "Buyers receive personalized digital QR passes via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "04",
                "title": "Scan at Venue Gates",
                "desc": "Gate staff scan passes in <0.3s with smartphone cameras for rapid entry."
        },
        {
                "n": "05",
                "title": "Export Qualified Leads",
                "desc": "Download verified buyer contact records with budgets and timestamps for developers."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Real Estate Expos in Bengaluru?",
        "subtitle": "Exhibition producers and real estate marketing agencies across Karnataka.",
        "personas": [
                {
                        "badge": "DEVELOPERS",
                        "title": "Real Estate Developers",
                        "desc": "Host exclusive annual property showcases and mega home buyer launch conclaves."
                },
                {
                        "badge": "EXPO PRODUCERS",
                        "title": "Exhibition Management Firms",
                        "desc": "Produce multi-builder property expos at KTPO, BIEC, and Palace Grounds."
                },
                {
                        "badge": "LUXURY CONCLAVES",
                        "title": "Luxury Real Estate Galas",
                        "desc": "Curate high-net-worth investor roundtables and luxury villa showcase dinners."
                },
                {
                        "badge": "COMMERCIAL",
                        "title": "Commercial & Tech Park Summits",
                        "desc": "Coordinate office space leasing summits and institutional investor conclaves."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Visitor Check-In Operates at Expo Gates",
        "subtitle": "Frictionless, rapid arrival that moves families into exhibition halls.",
        "description": "Visitors display their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the visitor's name and family guest count, and marks them admitted immediately.",
        "points": [
                "Eliminates slow manual registration forms at crowded entrance desks.",
                "Displays real-time pass validity with visitor name, budget, and guest count.",
                "Prevents uninvited drop-ins and duplicate entries automatically.",
                "Supports manual name and phone number lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help manage real estate expos in Bengaluru?",
                "a": "UrPass streamlines visitor pre-registration, captures buyer budget and locality preferences, delivers digital QR passes directly to WhatsApp, and validates visitors in <0.3s at venue gates."
        },
        {
                "q": "Can we collect property preferences and budget bands during registration?",
                "a": "Yes. Custom registration form questions let you capture budget range, unit configuration (2/3 BHK, Villa), purchase timeline, and preferred Bangalore micro-markets."
        },
        {
                "q": "Can home buyers register their family members under one pass?",
                "a": "Yes. Primary buyers can select family entry passes, allowing spouses and children to enter together under a single digital pass."
        },
        {
                "q": "How do participating developers access buyer leads after the expo?",
                "a": "Organizers can export verified attendee records to CSV, filtered by budget band and preferred locality, ready for developer CRM distribution."
        },
        {
                "q": "What pricing applies to real estate exhibitions on UrPass?",
                "a": "UrPass offers transparent flat software subscriptions starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with zero per-visitor ticketing fees."
        }
],
      }}
    />
  );
}
