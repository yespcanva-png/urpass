import type { Metadata } from "next";
import { Bell, Crown, FileSpreadsheet, QrCode, ShieldAlert, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "VIP Guest Check-In Software Bengaluru | UrPass",
  description: "Manage VIP guest lists, personalized digital passes and priority entry workflows for Bengaluru conferences and private events.",
  keywords: ["vip guest check in bengaluru","priority event entry bangalore","executive check in software bengaluru","vip badge scanning bangalore","fast track event entry"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-vip-guest-check-in-software",
  },
  openGraph: {
    title: "VIP Guest Check-In Software Bengaluru | UrPass",
    description: "Manage VIP guest lists, personalized digital passes and priority entry workflows for Bengaluru conferences and private events.",
    url: "https://urpass.space/bengaluru-vip-guest-check-in-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIP Guest Check-In Software Bengaluru | UrPass",
    description: "Manage VIP guest lists, personalized digital passes and priority entry workflows for Bengaluru conferences and private events.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruVipGuestCheckInSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "VIP FAST-TRACK CHECK-IN",
        h1: "VIP Guest Registration and Priority Check-In in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-vip-guest-check-in-software",
        description: "Manage VIP guest lists, personalized digital passes and priority entry workflows for Bengaluru conferences and private events.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-vip-guest-check-in-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Elevate Your VIP Guest Experience",
        ctaDescription: "Welcome dignitaries, keynote speakers, and executive delegates with fast-track digital passes, priority scanning lanes, and arrival notifications.",
        directAnswer: {
        "title": "What is VIP Guest Check-In Software for Bengaluru?",
        "summary": "VIP guest check-in software in Bengaluru manages executive credentials, dedicated fast-track entrance lanes, and personalized digital badges for conferences, award galas, and corporate summits. UrPass provides sub-0.3s mobile camera scanning, instant organizer arrival alerts, and Apple Wallet passes with 0% ticket fees.",
        "keyPoints": [
                "Dedicated VIP pass tier with customized visual badges and lounge access rules",
                "Sub-0.3s fast-track door scanning on mobile phone cameras—no hardware rentals",
                "Instant arrival notifications alert organizers when key executives or speakers enter",
                "Apple Wallet passes with lockscreen geofence notifications for seamless arrival"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Directors Trust UrPass for VIPs",
        "definition": "At major tech summits and industry conclaves in Bengaluru, senior executives, investors, and government dignitaries require a dignified, red-carpet arrival experience without queues.",
        "details": [
                "Visual tier distinction on mobile scanner screens: VIP, Speaker, Sponsor, and Executive",
                "Custom branded Apple Wallet passes that pop up on lockscreens as guests reach the venue",
                "Encrypted QR tokens prevent credential sharing or unauthorized entrance into private lounges",
                "Exportable real-time arrival logs showing exact timestamps when VIPs entered the auditorium"
        ]
},
        keyFactsTable: {
        "title": "UrPass VIP Check-In vs Standard Registration Desks",
        "subtitle": "Why Bengaluru event producers choose UrPass for executive arrival.",
        "headers": [
                "Arrival Experience",
                "Traditional General Registration",
                "UrPass VIP Fast-Track"
        ],
        "rows": [
                {
                        "col1": "Queue Time",
                        "col2": "5 to 15 minutes waiting in general attendee lines",
                        "col3": "Under 10 seconds via dedicated fast-track lane"
                },
                {
                        "col1": "Pass Delivery",
                        "col2": "Plastic lanyard badges printed at the counter",
                        "col3": "Pre-issued digital Apple Wallet & WhatsApp pass"
                },
                {
                        "col1": "Organizer Alerts",
                        "col2": "Organizers have no idea when keynotes arrive",
                        "col3": "Real-time arrival telemetry on organizer dashboard"
                },
                {
                        "col1": "Lounge Access Control",
                        "col2": "Manual visual checking prone to awkward gatekeeping",
                        "col3": "Instant sub-0.3s camera scan confirms lounge privileges"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "FAST-TRACK INGRESS",
                "title": "Dedicated VIP Ingress Lanes with Sub-0.3s Validation",
                "paragraphs": [
                        "High-profile attendees at Bengaluru conferences expect to bypass lobby congestion. Stationing staff at dedicated VIP fast-track doors ensures executive guests enter smoothly.",
                        "UrPass allows event managers to configure distinct scanning stations for VIP doors. Using standard smartphones or iPads, door hosts scan digital badges in under 300ms, displaying the guest's title and company instantly."
                ],
                "bullets": [
                        "Deploy fast-track lanes at main entrances, green rooms, and executive dining halls",
                        "High-contrast visual confirmation (Gold/Green VIP badge banner on scanner screen)",
                        "Prevents unauthorized entry with real-time atomic database verification",
                        "Offline mode ensures VIP scanning never halts due to basement Wi-Fi dropouts"
                ],
                "takeaway": "Dedicated fast-track lanes ensure dignitaries enter within seconds."
        },
        {
                "badge": "MOBILE WALLET",
                "title": "Native Apple Wallet Credentials with Lockscreen Availability",
                "paragraphs": [
                        "Executives dislike fumbling through email threads or downloading third-party event apps to show an entrance ticket.",
                        "UrPass generates native Apple Wallet (.pkpass) credentials. VIPs add their pass with one tap from their confirmation email. When they arrive at the venue, their pass automatically appears on their iPhone lockscreen."
                ],
                "bullets": [
                        "One-tap Apple Wallet integration with custom event artwork and branding",
                        "Lockscreen accessibility eliminates app downloads and inbox searching",
                        "Dynamic updates allow organizers to push auditorium seat or room changes",
                        "WhatsApp delivery backup ensures non-iOS users have their QR pass instantly accessible"
                ],
                "takeaway": "Lockscreen passes provide the most frictionless executive check-in experience."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Crown,
            title: "VIP Tier Configuration",
            desc: "Create bespoke VIP, Keynote Speaker, Sponsor, and Board Member badge tiers.",
          },
          {
            icon: Zap,
            title: "Fast-Track Mobile Scanning",
            desc: "Validate executive passes in <0.3s using smartphone cameras on mobile browsers.",
          },
          {
            icon: QrCode,
            title: "Apple Wallet & WhatsApp",
            desc: "Deliver personalized VIP credentials directly to Apple Wallet and WhatsApp chats.",
          },
          {
            icon: Bell,
            title: "Real-Time Ingress Telemetry",
            desc: "Track VIP arrival pacing and hall check-ins live on an executive dashboard.",
          },
          {
            icon: ShieldAlert,
            title: "Private Lounge Control",
            desc: "Scan passes at VIP lounge doors to restrict access to authorized badge tiers.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Ingress Exports",
            desc: "Download verified VIP arrival logs with exact timestamps for concierge reporting.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create VIP Tiers",
                "desc": "Define executive pass categories, private lounge permissions, and custom titles."
        },
        {
                "n": "02",
                "title": "Issue Personalized Passes",
                "desc": "Dispatch custom-branded Apple Wallet and WhatsApp passes to VIP guests."
        },
        {
                "n": "03",
                "title": "Set Up Priority Lane",
                "desc": "Designate a dedicated fast-track entrance station with smartphone camera scanning."
        },
        {
                "n": "04",
                "title": "Scan in <0.3 Seconds",
                "desc": "Welcome executives with instant camera validation and clear on-screen confirmation."
        },
        {
                "n": "05",
                "title": "Monitor Arrivals Live",
                "desc": "Executive teams see real-time updates as keynote speakers and VIPs check in."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for VIP Check-In in Bengaluru?",
        "subtitle": "Event leads hosting high-stakes gatherings across Karnataka's capital.",
        "personas": [
                {
                        "badge": "TECH CONFERENCES",
                        "title": "Developer & AI Conclaves",
                        "desc": "Manage fast-track entry for international keynote speakers and executive sponsors."
                },
                {
                        "badge": "BUSINESS SUMMITS",
                        "title": "CXO & Industry Roundtables",
                        "desc": "Provide frictionless arrival for managing directors, board members, and government leaders."
                },
                {
                        "badge": "AWARDS & GALAS",
                        "title": "Annual Corporate Awards",
                        "desc": "Scan VIP nominees, jury members, and celebrity guests at red-carpet entrances."
                },
                {
                        "badge": "VENTURE FORUMS",
                        "title": "Venture Capital Summits",
                        "desc": "Coordinate LP and GP check-in for private investor conclaves and closed-door dinners."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Priority Ingress Functions at Bengaluru Venues",
        "subtitle": "Dignified, lightning-fast arrival that eliminates executive waiting.",
        "description": "VIP guests display their digital pass on their smartphone screen or Apple Wallet. The fast-track host points their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the guest's name, designation, and VIP tier, and logs the check-in immediately.",
        "points": [
                "Eliminates slow manual searching through printed VIP binders.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help manage VIP guests at Bengaluru events?",
                "a": "UrPass provides dedicated VIP badge tiers, instant delivery via Apple Wallet and WhatsApp, sub-0.3s smartphone camera scanning at priority doors, and real-time arrival telemetry."
        },
        {
                "q": "Can VIP passes be added to Apple Wallet?",
                "a": "Yes. UrPass passes feature native Apple Wallet (.pkpass) support. Guests add their pass with one tap and access it directly from their iPhone lockscreen upon arriving at the venue."
        },
        {
                "q": "Can we restrict VIP lounge or dining hall access using the same pass?",
                "a": "Yes. Gate staff stationed outside VIP lounges or private dining halls can scan the same pass to verify whether that attendee's tier includes lounge access privileges."
        },
        {
                "q": "What hardware is required for the VIP entrance lane?",
                "a": "Zero specialized hardware. Any smartphone or tablet with a camera running Safari or Chrome acts as an enterprise scanner via a secure web link."
        },
        {
                "q": "Can we track when keynote speakers have arrived at the venue?",
                "a": "Yes. The real-time organizer dashboard updates instantly upon check-in, allowing backstage coordinators to see the exact arrival timestamp of speakers and VIPs."
        }
],
      }}
    />
  );
}
