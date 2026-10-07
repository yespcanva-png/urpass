import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In Without Hardware Rentals | Turn Smartphones into Scanners | UrPass",
  description: "Eliminate expensive laser scanner rentals. Turn standard iPhones and Android phones into high-velocity 0.28s optical event scanners with UrPass.",
  keywords: [
    "event check in without hardware",
    "event check in without hardware online",
    "event check in without hardware platform",
    "event check in without hardware check in",
    "event check in without hardware qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-check-in-without-expensive-hardware",
  },
  openGraph: {
    title: "Event Check-In Without Hardware Rentals | Turn Smartphones into Scanners | UrPass",
    description: "Eliminate expensive laser scanner rentals. Turn standard iPhones and Android phones into high-velocity 0.28s optical event scanners with UrPass.",
    url: "https://urpass.space/event-check-in-without-expensive-hardware",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ZERO-HARDWARE CHECK-IN",
        h1: "Event Check-In Without Expensive Hardware Rentals or Dedicated Scanners",
        canonicalUrl: "https://urpass.space/event-check-in-without-expensive-hardware",
        description: "Eliminate expensive laser scanner rentals. Turn standard iPhones and Android phones into high-velocity 0.28s optical event scanners with UrPass.",
        ctaLabel: "Scan with Any Phone Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare Hardware Costs",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How can I check in event attendees without renting expensive barcode scanners?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. With UrPass, you don't need to rent dedicated laser terminals or Zebra scanners. Any iPhone or Android smartphone acts as a high-speed optical scanner (0.28s scan speed) directly in the mobile browser using a secure volunteer PIN.",
          keyPoints: ["Zero equipment rentals—saves $300 to $1,500+ per event in hardware and shipping fees","Sub-second (0.28s) optical camera scanning out-performs legacy handheld laser guns","Authorize volunteer staff in 15 seconds using secure PIN links without app downloads","Atomic real-time cloud synchronization eliminates duplicate passes across all devices"],
        },
        whatIs: {
          title: "What is Zero-Hardware Event Check-In?",
          definition: "Zero-hardware event check-in is a software-first approach that uses the high-resolution optical cameras of standard smartphones to verify attendee digital passes, completely replacing bulky rented barcode terminals.",
          details: ["Eliminates hardware rental deposits, courier shipping delays, and battery dock logistics","Empowers organizers to scale from 2 to 20 scanners instantly during unexpected gate rushes","Delivers superior optical scanning on cracked, dim, or glare-heavy phone screens","Operates on standard cellular 4G/5G data or venue Wi-Fi networks"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: ScanLine,
            title: "Browser-Based Optical Engine",
            desc: "High-performance camera algorithm decodes QR passes instantly without app installations.",
          },
          {
            icon: Zap,
            title: "Zero Hardware Costs",
            desc: "Equip your entire event staff using their existing iOS or Android smartphones for $0.",
          },
          {
            icon: Lock,
            title: "PIN-Based Volunteer Access",
            desc: "Send volunteers a 6-digit PIN link to start scanning immediately without passwords or logins.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Detection",
            desc: "Passes scanned on any phone are immediately invalidated across all other phones in <150ms.",
          },
          {
            icon: CheckCircle2,
            title: "Audio & Visual Confirmation",
            desc: "Full-screen green flashes and audible chimes let staff verify entry without looking away.",
          },
          {
            icon: BarChart3,
            title: "Instant Ingress Scalability",
            desc: "Add extra scanners in 15 seconds if a sudden queue forms at an entrance door.",
          },
        ],
        deepDiveSections: [
          {
            badge: "HARDWARE ELIMINATION ROI",
            title: "Why Event Producers are Retiring Dedicated Laser Barcode Handhelds",
            paragraphs: ["For decades, event producers rented dedicated handheld laser barcode scanners (such as Zebra, Honeywell, or custom terminals) at costs of $150 to $300 per unit per weekend. These devices require charging cradles, proprietary docking stations, complex Wi-Fi bridges, and hours of staff training.","Modern smartphone cameras and machine-vision algorithms have rendered dedicated hardware obsolete. UrPass's optical engine decodes QR codes in 0.28 seconds—faster and more reliably than laser scanners on smartphone screens. Organizers save thousands of dollars while gaining the flexibility to turn any staff member into a scanner instantly."],
            bullets: ["Saves $500–$2,500+ per event in scanner rentals, insurance, and freight shipping","Zero setup time—staff open a URL on their phone, enter a PIN, and start scanning","Better recognition on smartphone screens compared to reflective laser scanners","Real-time cloud synchronization provides instant duplicate detection across all phones"],
            takeaway: "UrPass delivers superior check-in performance at zero hardware cost using the smartphones your team already owns.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Check-In Dimension","Rented Dedicated Hardware Terminals","UrPass Mobile Camera Check-In"],
          rows: [{"col1":"Equipment Rental Cost","col2":"$150–$300 per device + shipping","col3":"$0 (uses existing staff smartphones)"},{"col1":"Staff Setup Time","col2":"30–45 mins configuring hardware & bridges","col3":"Under 15 seconds (open URL + enter PIN)"},{"col1":"Scan Speed on Phone Screens","col2":"1.2–2.5 seconds (laser reflections)","col3":"0.28s ultra-fast optical camera decode"},{"col1":"Emergency Backup Plan","col2":"None if rented hardware fails","col3":"Instant (open link on any spare phone)"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Festivals & Concert Producers","desc":"Equip 20+ gate security and volunteer staff with zero equipment rental costs.","badge":"FESTIVALS"},{"title":"Conference & Summit Organisers","desc":"Set up multi-lane badge check-in in under 2 minutes at venue doors.","badge":"CONFERENCES"},{"title":"College & Student Fests","desc":"Deploy dozens of student coordinators across campus gates using their own phones.","badge":"COLLEGE"},{"title":"Charity & Non-Profit Galas","desc":"Maximize charitable funds by eliminating unnecessary hardware rental fees.","badge":"NON-PROFIT"}],
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
                    "q": "Do we need to rent barcode scanners to check in attendees with UrPass?",
                    "a": "No. UrPass runs entirely on standard iOS and Android smartphones through mobile web browsers, eliminating the need for dedicated hardware rentals."
          },
          {
                    "q": "How fast does a smartphone camera scan compared to a laser gun?",
                    "a": "UrPass's optical engine decodes QR codes in 0.28 seconds, which is significantly faster and more reliable than laser scanners when scanning smartphone screens."
          },
          {
                    "q": "Do volunteers need to install an app from the App Store or Play Store?",
                    "a": "No. Volunteers simply open a secure web link in Safari or Chrome, enter a PIN, and can start scanning immediately."
          },
          {
                    "q": "What happens if a volunteer's phone runs out of battery?",
                    "a": "You can simply send the scanner PIN link to any other staff member's phone, and they can pick up scanning in under 15 seconds."
          },
          {
                    "q": "Does smartphone scanning work in low-light conditions like concerts?",
                    "a": "Yes. Digital QR passes on attendee phone screens provide their own illumination, allowing phone cameras to scan effortlessly in dark environments."
          },
          {
                    "q": "How does UrPass prevent pass reuse when multiple phones are scanning?",
                    "a": "All phones synchronize in real time with our cloud database in <150ms. If a pass is scanned on Phone A, Phone B will immediately reject it with a red duplicate alarm."
          },
          {
                    "q": "Is there an extra charge for using multiple scanning phones?",
                    "a": "No. UrPass allows unlimited volunteer scanners and devices on all plans."
          }
],
        ctaTitle: "Event Check-In Without Expensive Hardware Rentals or Dedicated Scanners",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
