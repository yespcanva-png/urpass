import type { Metadata } from "next";
import { BarChart3, FileSpreadsheet, QrCode, ScanLine, Send, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "CSV to Event QR Tickets | UrPass",
  description: "Import event attendees from CSV, map contact details and create individual QR passes without entering each registration manually.",
  keywords: ["google sheets to qr event tickets","csv to event qr tickets","turn attendee spreadsheet into digital qr passes","convert excel to qr tickets","import google sheet event check in","bulk qr pass generator from spreadsheet"],
  alternates: {
    canonical: "https://urpass.space/google-sheets-to-qr-event-tickets",
  },
  openGraph: {
    title: "CSV to Event QR Tickets | UrPass",
    description: "Import event attendees from CSV, map contact details and create individual QR passes without entering each registration manually.",
    url: "https://urpass.space/google-sheets-to-qr-event-tickets",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to Event QR Tickets | UrPass",
    description: "Import event attendees from CSV, map contact details and create individual QR passes without entering each registration manually.",
  },
};

export default function GoogleSheetsToQrEventTicketsPage() {
  return (
    <SEOPage
      config={{
        badge: "SPREADSHEET TO QR PASSES",
        h1: "Turn an Attendee Spreadsheet into Digital QR Passes",
        canonicalUrl: "https://urpass.space/google-sheets-to-qr-event-tickets",
        description: "Import event attendees from CSV, map contact details and create individual QR passes without entering each registration manually.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=google-sheets-to-qr-event-tickets",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Convert Your Spreadsheet into Scannable Event Tickets in Minutes",
        ctaDescription: "Upload your Google Sheets, Excel, or CSV roster. UrPass generates encrypted digital QR passes and equips your door team with sub-second phone scanners.",
        directAnswer: {
        "title": "How Do You Turn a Spreadsheet into Digital QR Event Passes?",
        "summary": "Turning an attendee spreadsheet into digital QR event passes takes under five minutes with UrPass. Export your Google Sheet or Excel roster as a CSV, upload it to UrPass, map your attendee columns (Name, Email, Phone, Ticket Tier), and generate encrypted digital passes automatically. Deliver passes via WhatsApp and email, and scan attendees at the door in under 0.3 seconds.",
        "keyPoints": [
                "Import CSV or Excel rosters exported directly from Google Sheets, Microsoft Excel, or CRMs",
                "Visual column mapper matches names, emails, phone numbers, and custom badge credentials",
                "Automated batch generation of cryptographically unique digital QR tickets",
                "Sub-0.3s smartphone camera scanning on volunteer phones with zero hardware rentals"
        ]
},
        whatIs: {
        "title": "Why Generic Mail-Merge and Barcode Add-Ons Fall Short",
        "definition": "Many organizers attempt to turn spreadsheets into tickets using complex Google Sheets add-ons or Word mail-merge plugins. While these tools generate static barcode images, they fail completely on event day because they provide no entrance scanner, no multi-gate duplicate protection, and no live attendance telemetry.",
        "details": [
                "Generic QR plugins generate image files without a gate check-in scanning application",
                "Static QR codes can be easily photocopied, forwarded, or reused without detection",
                "UrPass combines bulk spreadsheet pass generation with a complete entrance scanning engine",
                "Includes automated ticket delivery via transactional email, WhatsApp, and Apple Wallet"
        ]
},
        keyFactsTable: {
        "title": "Google Sheets Add-Ons vs UrPass Spreadsheet-to-Ticket Engine",
        "subtitle": "Why live events require a complete pass generation and gate validation system.",
        "headers": [
                "Workflow Requirement",
                "Google Sheets Add-Ons / Mail Merge",
                "UrPass Import & Pass Engine"
        ],
        "rows": [
                {
                        "col1": "Gate Scanner Software",
                        "col2": "None; generates static image files without a validation scanner",
                        "col3": "Built-in smartphone camera scanner validating passes in <0.3s"
                },
                {
                        "col1": "Duplicate Entry Prevention",
                        "col2": "Zero fraud protection; forwarded screenshots are undetectable",
                        "col3": "Atomic database locking catches duplicate scans across all doors"
                },
                {
                        "col1": "Automated Pass Delivery",
                        "col2": "Requires complex third-party email tools with spam filter issues",
                        "col3": "Automated batch delivery via transactional email and WhatsApp"
                },
                {
                        "col1": "Live Attendance Tracking",
                        "col2": "Manual paper printout or static spreadsheet lookup at door",
                        "col3": "Real-time organizer dashboard with timestamped check-in logs"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "BATCH IMPORT",
                "title": "Seamless 3-Step CSV Import with Visual Header Mapping",
                "paragraphs": [
                        "Organizers frequently manage guest lists in Google Sheets: corporate sponsor delegations, VIP invitations, university class rosters, or offline ticket sales. Manually entering these names into an event platform takes days of mind-numbing data entry.",
                        "UrPass eliminates manual entry. Download your Google Sheet as a CSV file and drag it into UrPass. Our visual mapping tool automatically detects your column headers for First Name, Last Name, Email, Phone Number, and Ticket Category. Click 'Generate', and UrPass creates encrypted, scannable digital passes for your entire roster in seconds."
                ],
                "bullets": [
                        "Import CSV files containing hundreds or thousands of attendees in one batch",
                        "Visual column mapper matches contact details and custom badging fields",
                        "Automated email deduplication prevents duplicate pass creation for the same guest",
                        "Batch delivery tracking confirms message receipt and pass delivery status"
                ],
                "takeaway": "Transform hours of tedious data entry into a 5-minute automated import workflow."
        },
        {
                "badge": "DOOR OPERATIONS",
                "title": "From Spreadsheet Data to Sub-Second Gate Entrance Scanning",
                "paragraphs": [
                        "The ultimate test of any ticketing workflow is what happens at the venue entrance. If you use generic Google Sheets add-ons, your door staff are forced to manually cross-reference names on a paper register or search a spreadsheet on a laptop, causing 30-minute entrance queues.",
                        "UrPass provides an enterprise-grade mobile browser scanner. Volunteers open the scanner URL on their smartphone cameras, point at the attendee's digital pass or printed QR code, and validate admission in under 0.3 seconds. Scanned records sync live to the cloud, giving you instant attendance headcounts."
                ],
                "bullets": [
                        "Volunteers scan on personal smartphones with zero app downloads or accounts",
                        "Sub-0.3s camera scan speed clears 1,000 attendees in approximately 15 minutes",
                        "Atomic row locking catches duplicate passes and screenshot sharing across all gates",
                        "Export verified attendance logs back to CSV with exact entry timestamps anytime"
                ],
                "takeaway": "Connect your spreadsheet data directly to high-speed entrance access control."
        }
],
        featuresTitle: "Core Capabilities",
        featuresSubtitle: "Engineered to solve your exact operational event challenges.",
        features: [
          {
            icon: FileSpreadsheet,
            title: "Google Sheets & CSV Import",
            desc: "Upload attendee lists exported from Google Sheets, Microsoft Excel, or any CRM in seconds.",
          },
          {
            icon: QrCode,
            title: "Instant Batch Pass Generation",
            desc: "Convert spreadsheet rows into cryptographically secure digital QR passes automatically.",
          },
          {
            icon: Send,
            title: "Automated Ticket Dispatch",
            desc: "Deliver personalized passes directly to attendee inboxes and WhatsApp chats in one click.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan and check in attendees at venue doors in milliseconds using smartphone cameras.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Locking",
            desc: "Prevent pass sharing across doors with real-time database-level row locking.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Monitor admitted vs absent attendees live and export verified arrival ledgers to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Export Sheet to CSV",
                "desc": "Download your attendee roster from Google Sheets or Excel as a CSV file."
        },
        {
                "n": "02",
                "title": "Upload to UrPass",
                "desc": "Drag and drop the CSV file into your event attendee management dashboard."
        },
        {
                "n": "03",
                "title": "Confirm Column Mapping",
                "desc": "Match columns for attendee name, email, phone number, and ticket tier."
        },
        {
                "n": "04",
                "title": "Generate Passes & Dispatch",
                "desc": "UrPass creates encrypted digital passes and delivers them via email or WhatsApp."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with phone cameras in <0.3s for rapid green entry."
        }
],
        whoShouldUse: {
        "title": "Who Converts Spreadsheets to UrPass QR Tickets?",
        "subtitle": "Event teams managing pre-registered attendee lists and offline bookings.",
        "personas": [
                {
                        "badge": "UNIVERSITIES",
                        "title": "College & Student Fest Teams",
                        "desc": "Import departmental student rosters and generate entry badges for thousands of campus attendees."
                },
                {
                        "badge": "CORPORATE",
                        "title": "Enterprise HR & Workplace Teams",
                        "desc": "Import employee directories and deliver secure corporate meeting passes directly to staff."
                },
                {
                        "badge": "NON-PROFITS",
                        "title": "Charity Galas & Fundraisers",
                        "desc": "Import VIP donor guest lists and issue digital admission passes with zero technical complexity."
                },
                {
                        "badge": "EXPOS",
                        "title": "Trade Shows & Exhibitions",
                        "desc": "Batch-generate exhibitor, buyer, and trade visitor credentials before opening day."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Works for Spreadsheet-Imported Attendees",
        "subtitle": "Seamless validation from spreadsheet import to door entry.",
        "description": "Every pass generated from your spreadsheet import is immediately registered in your event access database. At the venue, door volunteers open the UrPass scanner URL on their smartphone cameras. Pointing the camera at the attendee's digital pass or printed QR code verifies identity and validates admission in under 0.3 seconds.",
        "points": [
                "Scanners work directly in smartphone browsers without installing native apps.",
                "Scanned passes are immediately locked to prevent duplicate entry across all gates.",
                "Door staff can look up attendees by name or email if they forgot their ticket.",
                "Real-time attendance logs can be exported back to CSV anytime."
        ]
},
        faqs: [
        {
                "q": "How do I export my Google Sheet to use in UrPass?",
                "a": "In Google Sheets, simply click File > Download > Comma Separated Values (.csv). Then log into UrPass, navigate to your event's Attendee Management tab, and upload the file."
        },
        {
                "q": "What columns do I need in my spreadsheet?",
                "a": "At minimum, you need columns for Attendee Name and Email Address. You can also include Phone Number (for WhatsApp delivery), Ticket Tier (e.g. VIP, Delegate), Company Name, Table Number, and custom notes."
        },
        {
                "q": "How are the generated QR passes delivered to attendees?",
                "a": "You can choose to dispatch passes automatically via transactional email, deliver them via WhatsApp (if enabled), or download the batch as digital pass links to distribute through your own communication channels."
        },
        {
                "q": "What prevents attendees from sharing their QR tickets with others?",
                "a": "UrPass uses cloud-native atomic database row locks. Once a pass is scanned at any venue entrance, it is marked admitted. Any subsequent scan attempt displays an amber duplicate alert showing the previous entry timestamp and gate name."
        },
        {
                "q": "Can door volunteers look up attendees manually if their phone battery dies?",
                "a": "Yes. The UrPass browser scanner includes a quick-search tool that allows volunteers to search by attendee name or email address and check them in manually with one tap."
        }
],
      }}
    />
  );
}
