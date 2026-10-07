import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Prevent Event Ticket Sharing & Screenshot Fraud with Single-Use QR | UrPass",
  description: "Stop screenshot ticket sharing, pass duplication, and unauthorized entry. UrPass enforces atomic single-use QR validation and instant duplicate alarms.",
  keywords: [
    "prevent ticket sharing events",
    "prevent ticket sharing events online",
    "prevent ticket sharing events platform",
    "prevent ticket sharing events check in",
    "prevent ticket sharing events qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/prevent-event-ticket-sharing",
  },
  openGraph: {
    title: "Prevent Event Ticket Sharing & Screenshot Fraud with Single-Use QR | UrPass",
    description: "Stop screenshot ticket sharing, pass duplication, and unauthorized entry. UrPass enforces atomic single-use QR validation and instant duplicate alarms.",
    url: "https://urpass.space/prevent-event-ticket-sharing",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ANTI-FRAUD & PASS INTEGRITY",
        h1: "Prevent Event Ticket Sharing & Screenshot Fraud with Single-Use QR Passes",
        canonicalUrl: "https://urpass.space/prevent-event-ticket-sharing",
        description: "Stop screenshot ticket sharing, pass duplication, and unauthorized entry. UrPass enforces atomic single-use QR validation and instant duplicate alarms.",
        ctaLabel: "Protect Your Event Revenue",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Security Tech",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How do I prevent attendees from sharing ticket screenshots at events?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. To prevent ticket sharing, UrPass issues single-use cryptographic QR passes with atomic real-time database locking. The instant a ticket is scanned at the door, any screenshot shared with another person triggers an immediate red duplicate alert.",
          keyPoints: ["Cryptographically signed, unique single-use QR passes per attendee","Sub-150ms atomic state lock marks passes as used instantly across all doors","Loud audio and visual duplicate warnings display exact timestamp and gate of first scan","Attendee name and ID displayed on scanner screen for quick identity verification"],
        },
        whatIs: {
          title: "What is Event Ticket Sharing Fraud?",
          definition: "Ticket sharing fraud occurs when a registered attendee takes a screenshot of their digital ticket QR code and messages it to friends, allowing multiple people to attempt entry on a single paid pass.",
          details: ["Causes severe revenue loss and oversold venue capacity risks","Occurs when entry systems lack real-time synchronization or use static printed lists","Stopped completely by atomic database locking and instant door alerts","Protects VIP passes, backstage badges, and paid festival wristband exchanges"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Lock,
            title: "Single-Use Cryptographic QR",
            desc: "Each QR code is uniquely salted and verified against secure cloud tokens.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Lock",
            desc: "Pass status updates in <150ms. Re-scanning anywhere sounds an immediate duplicate alarm.",
          },
          {
            icon: AlertTriangle,
            title: "First-Scan Telemetry Alert",
            desc: "Scanner displays: 'ALREADY CHECKED IN at Gate 1 (10:14 AM)' to catch fraud instantly.",
          },
          {
            icon: Users,
            title: "Attendee ID Verification",
            desc: "Scanner screen displays the attendee's name, email, and custom fields for quick identity checks.",
          },
          {
            icon: Zap,
            title: "Offline Fraud Protection",
            desc: "Smart caching safeguards ensure duplicate detection even during brief network dips.",
          },
          {
            icon: BarChart3,
            title: "Security Incident Logging",
            desc: "Logs all duplicate scan attempts with device ID, door location, and exact timestamp.",
          },
        ],
        deepDiveSections: [
          {
            badge: "SECURITY PROTOCOL",
            title: "How UrPass Defeats Digital Screenshot Pass Sharing",
            paragraphs: ["In modern events, screenshot pass sharing is the #1 source of gate fraud. An attendee buys one ticket, takes a screenshot, and texts it to three friends. If the event uses paper lists or slow offline scanners, all four individuals can enter through different doors before staff notice.","UrPass solves this at the database level with atomic row locks. When a QR pass is scanned, the server atomically changes its state from 'valid' to 'checked-in'. If another person presents the same screenshot at another gate 30 seconds later, the scanner screen flashes bright red, plays a harsh error tone, and displays the exact time and door where the legitimate pass was already used."],
            bullets: ["Sub-150ms cross-gate invalidation closes the window for duplicate entry attempts","Visual red warning prevents door staff from accidentally admitting duplicate guests","Displays original attendee name and registration timestamp for security verification","Completely eliminates the financial losses associated with ticket screenshot sharing"],
            takeaway: "UrPass gives event organisers 100% confidence that every person inside the venue holds a legitimate, unique ticket.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Anti-Fraud Capability","Legacy Paper / Static Lists","UrPass Anti-Fraud System"],
          rows: [{"col1":"Screenshot Sharing Detection","col2":"Zero (multiple people enter easily)","col3":"Instant sub-150ms duplicate rejection"},{"col1":"Duplicate Alert Feedback","col2":"None","col3":"Bright red screen + loud warning audio chime"},{"col1":"Audit Trail Information","col2":"None (lost in paper sheets)","col3":"Full timestamp, gate location & scanner ID logged"},{"col1":"Attendee Identity Check","col2":"Manual ID comparison","col3":"Instant on-screen name & photo/ID matching"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Paid Concerts & Festivals","desc":"Stop attendees from sharing paid tickets and protect box office revenue.","badge":"CONCERTS"},{"title":"Exclusive VIP Summits","desc":"Ensure only approved, vetted VIP executives gain access to private sessions.","badge":"VIP SUMMITS"},{"title":"College Pro-Nights","desc":"Prevent students from circulating ticket screenshots to non-registered guests.","badge":"COLLEGE"},{"title":"Paid Workshop & Training Hosts","desc":"Guarantee that only registered, paying delegates occupy limited seats.","badge":"TRAININGS"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "How do people cheat tickets using screenshots?",
                    "a": "An attendee purchases one valid ticket, takes a screenshot of the QR code, and sends the image via WhatsApp or Telegram to friends, who then try to enter at different doors."
          },
          {
                    "q": "How does UrPass prevent ticket sharing?",
                    "a": "UrPass marks a ticket as 'used' in our real-time database the instant it is scanned. When the second person presents the screenshot, the scanner immediately rejects it with a bright red duplicate alert."
          },
          {
                    "q": "What does the scanner show when a duplicate ticket is scanned?",
                    "a": "The scanner screen flashes red, sounds an alert tone, and displays 'ALREADY CHECKED IN' along with the exact time and gate where the original scan occurred."
          },
          {
                    "q": "Can staff verify the attendee's name when scanning?",
                    "a": "Yes. The scanner displays the ticket holder's full name, email, ticket tier, and custom details so staff can cross-check government or student IDs if needed."
          },
          {
                    "q": "Does anti-ticket sharing work across multiple entrance gates?",
                    "a": "Yes. All scanning devices synchronize in under 150ms across cellular and Wi-Fi networks, ensuring duplicate attempts are caught regardless of which gate is used."
          },
          {
                    "q": "Can an organiser manually override or reset a checked-in ticket?",
                    "a": "Yes. Event admins with supervisor privileges can review attendee records and reset check-in status from the admin console if a mistake occurred."
          },
          {
                    "q": "Are UrPass QR codes secure against counterfeiting?",
                    "a": "Yes. UrPass QR codes are generated with cryptographic token verification, making them impossible to guess, fabricate, or reverse-engineer."
          }
],
        ctaTitle: "Prevent Event Ticket Sharing & Screenshot Fraud with Single-Use QR Passes",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
