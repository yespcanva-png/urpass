import type { Metadata } from "next";
import { BarChart3, DoorOpen, LogIn, LogOut, Maximize2, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry and Exit Tracking Software | UrPass",
  description: "Track both check-ins and check-outs at gates to maintain accurate live occupancy counts and adhere to venue safety regulations.",
  keywords: [
    "event entry exit tracking",
    "monitor event entry, exit and live headcount",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-entry-exit-tracking" },
  openGraph: {
    title: "Event Entry and Exit Tracking Software | UrPass",
    description: "Track both check-ins and check-outs at gates to maintain accurate live occupancy counts and adhere to venue safety regulations.",
    url: "https://urpass.space/event-entry-exit-tracking",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "BI-DIRECTIONAL OCCUPANCY MONITORING",
        h1: "Monitor Event Entry, Exit and Live Headcount",
        canonicalUrl: "https://urpass.space/event-entry-exit-tracking",
        description: "Track both check-ins and check-outs at gates to maintain accurate live occupancy counts and adhere to venue safety regulations.",
        ctaLabel: "Track Entry & Exit",
        directAnswer: {
          title: "How Does Event Entry and Exit Tracking Work on UrPass?",
          summary: "UrPass provides bi-directional entry and exit tracking for festivals, exhibition centers, and secure facilities. Gate marshals can toggle mobile scanners between 'Entry Mode' and 'Exit Mode'. Scanning attendees exiting the venue decrements live occupancy, enabling accurate real-time headcount telemetry for fire safety compliance and managed re-entry.",
          keyPoints: ["Bi-directional scanning: 1-click toggle between Entry and Exit modes on mobile scanners", "Accurate net in-venue headcount telemetry updating in sub-150ms", "Managed re-entry support preventing pass pass-back fraud", "Compliance with statutory venue fire safety licenses and emergency crowd limits"],
        },
        keyFactsTable: {
          title: "Entry/Exit Tracking Comparison",
          subtitle: "Live net occupancy vs one-way gross check-in tracking.",
          headers: ["Occupancy Factor", "UrPass Bi-Directional Tracking", "Traditional One-Way Check-In"],
          rows: [
            {
                        "col1": "Real-Time Net Occupancy",
                        "col2": "Calculates exact currently present headcounts (Ins minus Outs)",
                        "col3": "Cumulative check-in total only; zero knowledge of exits"
            },
            {
                        "col1": "Fire Code Compliance",
                        "col2": "Certifiable live proof that venue remains under statutory cap",
                        "col3": "Unable to prove current occupancy during safety audits"
            },
            {
                        "col1": "Re-Entry Verification",
                        "col2": "Pass only re-admits if previously scanned out",
                        "col3": "Requires messy ink hand-stamps easily washed off"
            },
            {
                        "col1": "Peak Crowd Telemetry",
                        "col2": "Accurate graph of peak concurrent crowd density",
                        "col3": "Distorted charts counting departed guests as present"
            },
            {
                        "col1": "Turnstile & Gate Hardware",
                        "col2": "Runs on standard volunteer smartphones or tablets",
                        "col3": "Expensive fixed optical turnstile equipment"
            }
],
        },
        features: [
          { icon: LogIn, title: "1-Tap Mode Switching", desc: "Door staff tap a button on their scanner screen to toggle instantly between Check-In and Check-Out modes." },
          { icon: LogOut, title: "Net Occupancy Telemetry", desc: "Dashboard calculates exact live in-venue headcounts (Total Checked-In minus Total Checked-Out)." },
          { icon: ShieldCheck, title: "Managed Re-Entry Control", desc: "Allow attendees to leave for lunch or fresh air and scan back in without opening pass-sharing vulnerabilities." },
          { icon: Maximize2, title: "Peak Density Monitoring", desc: "Identify true peak concurrent attendance hours to optimize security staffing and bar service." },
          { icon: DoorOpen, title: "Multi-Gate Net Sync", desc: "Attendees can enter through Gate A and exit through Gate D with sub-150ms cloud synchronization." },
          { icon: BarChart3, title: "Emergency Evacuation Tally", desc: "Provides safety personnel with an instant count of exactly how many guests remain on-site." }
        ],
        steps: [
          { n: "01", title: "Configure Entry/Exit", desc: "Enable bi-directional tracking in event settings and set maximum statutory venue capacity." },
          { n: "02", title: "Assign Gate Roles", desc: "Designate entrance lanes as 'Check-In' and exit doors as 'Check-Out' on volunteer phones." },
          { n: "03", title: "Scan Guests In", desc: "Guests scan in at the main doors; the live on-site occupancy counter increments." },
          { n: "04", title: "Scan Guests Out", desc: "Guests scan their pass at exit turnstiles; the live occupancy counter decrements." },
          { n: "05", title: "Monitor True Headcount", desc: "Review live concurrency graphs ensuring the venue remains safe and compliant at all times." }
        ],
        callout: {
          badge: "STATUTORY SAFETY ASSURANCE",
          title: "Prove true crowd compliance to local authorities and venue owners.",
          description: "Licensed venues cannot afford to guess how many people are inside during a multi-stage festival or evening event. UrPass delivers exact, verifiable net occupancy data.",
          bullets: ["Real-time net occupancy counts visible to security and fire marshals", "Allow seamless pass re-entry without messy wristbands or hand stamps", "Synchronized across multiple entry gates and exit turnstiles", "Detailed historical crowd flow curves for future event planning"],
        },
        faqs: [
          { q: "Can attendees exit through a different gate than the one they entered?", a: "Yes! All gates synchronize through the UrPass cloud in under 150ms. An attendee can enter at Gate 1 and exit at Gate 4 seamlessly." },
          { q: "How does re-entry work with this system?", a: "When an attendee is scanned at the exit, their pass status updates to 'Offsite'. When they return, the entry scanner admits them without error." },
          { q: "Does the system work without internet access?", a: "The scanner includes offline caching to process entries and exits locally, synchronizing data when connectivity is restored." },
          { q: "Can venue security see the net headcount on their own phones?", a: "Yes. Organizers can provide security leads with a secure real-time dashboard link displaying live occupancy figures." }
        ],
        relatedLinks: [
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" },
          { title: "Smartphone QR Ticket Scanner", href: "/smartphone-qr-ticket-scanner", category: "Product" }
        ],
      }}
    />
  );
}
