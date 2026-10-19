import type { Metadata } from "next";
import { BarChart3, DoorOpen, FileText, Layers, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Session-Wise Attendance Software | UrPass",
  description: "Track participant attendance across workshops, conference sessions and multi-day programs using QR passes and session-level records.",
  keywords: ["session-wise event attendance tracking","track attendance across multiple event sessions","multi session event check in","breakout session attendance tracker","workshop session check in software","event session tracking qr"],
  alternates: {
    canonical: "https://urpass.space/session-wise-event-attendance-tracking",
  },
  openGraph: {
    title: "Session-Wise Attendance Software | UrPass",
    description: "Track participant attendance across workshops, conference sessions and multi-day programs using QR passes and session-level records.",
    url: "https://urpass.space/session-wise-event-attendance-tracking",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Session-Wise Attendance Software | UrPass",
    description: "Track participant attendance across workshops, conference sessions and multi-day programs using QR passes and session-level records.",
  },
};

export default function SessionWiseEventAttendanceTrackingPage() {
  return (
    <SEOPage
      config={{
        badge: "SESSION ATTENDANCE TRACKING",
        h1: "Track Attendance Across Multiple Event Sessions",
        canonicalUrl: "https://urpass.space/session-wise-event-attendance-tracking",
        description: "Track participant attendance across workshops, conference sessions and multi-day programs using QR passes and session-level records.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=session-wise-event-attendance-tracking",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Track Attendance Across Keynotes, Breakouts, and Workshops",
        ctaDescription: "Use a single attendee QR badge to record session-by-session presence. Generate audit-ready CPD accreditation logs and room occupancy reports.",
        directAnswer: {
        "title": "What is Session-Wise Event Attendance Tracking?",
        "summary": "Session-wise event attendance tracking enables organizers to monitor participant presence across multiple breakout tracks, conference rooms, workshops, and multi-day schedules using a single attendee QR badge. Smartphone scanners assigned to specific rooms tag entry timestamps, producing verified session-level attendance records.",
        "keyPoints": [
                "Single attendee QR badge scannable across unlimited keynote halls, breakout rooms, and workshops",
                "Scanners assigned to specific sessions or rooms with one tap on volunteer smartphones",
                "Real-time room occupancy telemetry to comply with auditorium fire safety limits",
                "Audit-ready session attendance exports for CPD/CPE professional accreditation"
        ]
},
        whatIs: {
        "title": "Why Multi-Track Events Need Session-Level Attendance Tracking",
        "definition": "At large conferences, symposiums, and corporate summits, general entrance gate scanning only tells you who walked through the front door. It cannot tell you which technical presentations drew the highest executive interest, which breakout rooms exceeded capacity, or whether delegates completed mandatory training hours.",
        "details": [
                "Eliminates paper sign-in sheets outside breakout seminar rooms",
                "Provides room occupancy monitoring to prevent violating venue safety codes",
                "Furnishes sponsors with verified attendee demographic and engagement data",
                "Automates issuance of session-specific certificates of completion"
        ]
},
        keyFactsTable: {
        "title": "General Gate Check-In vs Session-Wise Attendance Tracking",
        "subtitle": "Why multi-session telemetry is crucial for complex conference programs.",
        "headers": [
                "Analytical Dimension",
                "Single Gate Ingress Check-In",
                "UrPass Session-Wise Tracking"
        ],
        "rows": [
                {
                        "col1": "Attendance Granularity",
                        "col2": "Only records that attendee entered the venue building",
                        "col3": "Tracks exact timestamps for each breakout, workshop & keynote"
                },
                {
                        "col1": "Room Occupancy Monitoring",
                        "col2": "Blind; organizers cannot tell which hall is overcrowding",
                        "col3": "Live room headcount telemetry against safety capacity caps"
                },
                {
                        "col1": "CPD / Training Compliance",
                        "col2": "Cannot verify whether attendee attended mandatory hours",
                        "col3": "Audit-ready logs documenting arrival and duration in room"
                },
                {
                        "col1": "Badge Logistics",
                        "col2": "Requires separate paper tickets for different sessions",
                        "col3": "Single unified QR pass valid across the entire event program"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ROOM OCCUPANCY & SAFETY",
                "title": "Live Room Headcounts Prevent Dangerous Overcrowding",
                "paragraphs": [
                        "Popular breakout sessions often attract more delegates than room seating allows. When attendees pack the aisles and block exit doors, venue managers face severe fire safety violations and fines.",
                        "UrPass allows room monitors to track live capacity with smartphone scanners. As attendees enter the breakout room, the volunteer points their camera at their badge. The scanner screen displays the current room headcount (e.g. 'Room B: 85 of 100 Seats'). Once the safety capacity is reached, the scanner warns staff to direct overflow delegates to an alternate hall."
                ],
                "bullets": [
                        "Live room headcount counter displays current occupancy against room safety limits",
                        "Automated visual warning when room reaches maximum seating capacity",
                        "Prevent unauthorized attendees from entering restricted VIP workshops",
                        "Volunteers use personal smartphones with zero app downloads"
                ],
                "takeaway": "Live room telemetry ensures safety compliance and prevents overcrowded breakout halls."
        },
        {
                "badge": "ACCREDITATION & AUDIT",
                "title": "Audit-Ready Logs for Continuing Professional Education (CPD/CPE)",
                "paragraphs": [
                        "Medical colloquiums, legal seminars, and accounting summits are legally required to verify that delegates physically attended accredited training sessions before issuing continuing education certificates. Disputed attendance claims can result in accreditation revocation.",
                        "UrPass stamps every session scan with an immutable audit record: attendee identity, exact entry timestamp, room name, and scanning volunteer ID. Organizers can export session-specific CSV ledgers with a single click to satisfy accrediting boards and generate automated attendance certificates."
                ],
                "bullets": [
                        "Cryptographically verifiable check-in records for regulatory compliance",
                        "Export session-by-session attendee rosters formatted for accreditation boards",
                        "Automated post-session digital certificates emailed to verified participants",
                        "Identify session popularity and delegate drop-off patterns for future planning"
                ],
                "takeaway": "Tamper-proof session logs simplify regulatory accreditation and certificate issuance."
        }
],
        featuresTitle: "Core Capabilities",
        featuresSubtitle: "Engineered to solve your exact operational event challenges.",
        features: [
          {
            icon: Layers,
            title: "Single Badge, Unlimited Sessions",
            desc: "Attendees use one digital QR pass across keynote halls, breakout tracks, and workshops.",
          },
          {
            icon: DoorOpen,
            title: "Room Assignment with One Tap",
            desc: "Assign volunteer smartphone scanners to specific session rooms in under 10 seconds.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan and record session presence in milliseconds with standard smartphone browsers.",
          },
          {
            icon: BarChart3,
            title: "Live Room Occupancy",
            desc: "Monitor live headcounts per seminar hall to prevent exceeding fire safety limits.",
          },
          {
            icon: ShieldCheck,
            title: "Session Access Permissions",
            desc: "Restrict specific masterclasses or executive roundtables to authorized ticket tiers.",
          },
          {
            icon: FileText,
            title: "Audit-Ready CPD Exports",
            desc: "Download verified session attendance records with exact entry timestamps to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Event Program",
                "desc": "Define your schedule, breakout sessions, keynote halls, and room capacities."
        },
        {
                "n": "02",
                "title": "Issue Unified QR Passes",
                "desc": "Attendees receive their digital QR badge via WhatsApp, email, or Apple Wallet."
        },
        {
                "n": "03",
                "title": "Assign Room Scanners",
                "desc": "Staff scan an organizer setup code and select the room they are monitoring."
        },
        {
                "n": "04",
                "title": "Scan Attendees into Sessions",
                "desc": "Volunteers scan attendee badges as they enter the seminar room in <0.3s."
        },
        {
                "n": "05",
                "title": "Export Session Reports",
                "desc": "Download verified room-by-room attendance logs for sponsors and accreditation."
        }
],
        whoShouldUse: {
        "title": "Who Needs Session-Wise Attendance Tracking?",
        "subtitle": "Multi-track conferences, medical symposiums, and corporate training programs.",
        "personas": [
                {
                        "badge": "MEDICAL & LEGAL",
                        "title": "Accredited CPD/CPE Conferences",
                        "desc": "Verify mandatory training session hours and issue accredited certificates of completion."
                },
                {
                        "badge": "B2B CONFERENCES",
                        "title": "Multi-Track Industry Summits",
                        "desc": "Track which breakout sessions drew the highest delegate interest for sponsor ROI reporting."
                },
                {
                        "badge": "UNIVERSITIES",
                        "title": "Academic Colloquiums & Fests",
                        "desc": "Monitor student participation across paper presentation tracks and technical labs."
                },
                {
                        "badge": "CORPORATE",
                        "title": "Internal Training Offsites",
                        "desc": "Track employee completion of compliance workshops and mandatory training modules."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Session Scanning Operates at Breakout Doors",
        "subtitle": "Rapid verification that keeps session schedules running smoothly.",
        "description": "A room monitor opens the UrPass scanner on their smartphone browser and selects 'Room B: AI in Healthcare'. As delegates enter, the monitor points their phone camera at each delegate's QR pass. UrPass validates access, logs the session check-in timestamp in under 0.3 seconds, and updates the room headcount live.",
        "points": [
                "Volunteers scan on personal smartphones with zero app downloads or accounts.",
                "Audible green chime verifies authorized access for that specific session.",
                "Red alert notifies staff if a delegate has not purchased access to a premium masterclass.",
                "Live room occupancy telemetry updates on the organizer central dashboard."
        ]
},
        faqs: [
        {
                "q": "Do attendees need separate QR codes for each session?",
                "a": "No. Attendees use a single unified digital QR pass or badge for the entire conference. The smartphone scanner assigned to that room automatically tags the attendee's check-in to that specific session."
        },
        {
                "q": "How do volunteers assign their phone scanner to a specific room?",
                "a": "Volunteers scan a coordinator setup QR code to launch the scanner in Safari or Chrome. They are presented with a dropdown list of event sessions or rooms, select the room they are staffing, and begin scanning immediately."
        },
        {
                "q": "Can I restrict specific breakout sessions to VIP or workshop ticket holders?",
                "a": "Yes. You can assign session access rules. If an attendee with a General Admission ticket attempts to enter an exclusive Executive Roundtable, the scanner immediately alerts staff that the pass is unauthorized for that session."
        },
        {
                "q": "Can I export session-level attendance reports for accredited training (CPD/CPE)?",
                "a": "Yes. You can download complete CSV reports detailing attendee names, email addresses, exact entry timestamps, and session names to satisfy professional accreditation requirements."
        },
        {
                "q": "How many sessions or breakout rooms can I track simultaneously?",
                "a": "UrPass supports an unlimited number of concurrent breakout sessions, workshop halls, and multi-day schedules across all subscription plans."
        }
],
      }}
    />
  );
}
