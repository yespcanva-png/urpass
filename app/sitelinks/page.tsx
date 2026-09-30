import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "@/components/landing/SocialIcons";

export const metadata: Metadata = {
  title: "Sitelinks & Directory — All Pages on URPASS",
  description:
    "Complete directory of all pages on URPASS — event registration software, QR check-in scanner, free ticketing, university events, UK hubs, India hubs, software comparisons, and guides.",
  alternates: { canonical: "https://urpass.space/sitelinks" },
  openGraph: {
    title: "Sitelinks & Directory — URPASS",
    description:
      "Explore all pages on URPASS by category — commercial registration software, QR check-in, UK solutions, comparisons, city hubs, and guides.",
    url: "https://urpass.space/sitelinks",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

const sections: {
  title: string;
  badge?: string;
  links: { label: string; href: string; isExternal?: boolean; badge?: string }[];
}[] = [
  {
    title: "Platform & Company",
    badge: "Core",
    links: [
      { label: "Home", href: "/" },
      { label: "Features Suite", href: "/features", badge: "Core" },
      { label: "Brand & Media Kit", href: "/brand", badge: "Assets" },
      { label: "Product Architecture", href: "/product", badge: "OS" },
      { label: "About URPASS & Yesp", href: "/about", badge: "Story" },
      { label: "Security & Compliance", href: "/security", badge: "Trust" },
      { label: "Help & Support Center", href: "/support", badge: "24/7" },
      { label: "System Status & Health", href: "/status", badge: "99.99%" },
      { label: "Company News & Press", href: "/press", badge: "News" },
      { label: "Platform FAQ & Answers", href: "/faq", badge: "35+ FAQs" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Founder Lifetime Deal (₹19,999)", href: "/founder-lifetime-deal", badge: "Limited 20" },
      { label: "Guides & Tutorials Hub", href: "/guides" },
      { label: "Software Comparisons Hub", href: "/compare" },
      { label: "Global Platform Hub", href: "/global" },
      { label: "Yesp URPASS Platform", href: "/yesp-urpass" },
      { label: "Documentation & API", href: "/docs" },
      { label: "Contact Support", href: "/contact" },
      { label: "Feedback & Requests", href: "/feedback" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sign Up Free", href: "/signup", badge: "Free" },
      { label: "Organizer Login", href: "/login" },
      { label: "Forgot Password", href: "/forgot-password" },
      { label: "Ops Command Center", href: "/ops", badge: "Live Ops" },
    ],
  },
  {
    title: "1. Commercial & High-Intent Products",
    badge: "Priority",
    links: [
      { label: "Free Event Registration Software", href: "/free-event-registration-software", badge: "Hot" },
      { label: "QR Code Event Registration", href: "/qr-code-event-registration", badge: "Hot" },
      { label: "QR Code Check-In System", href: "/qr-code-check-in-system", badge: "0.28s" },
      { label: "Free Event Ticketing Software", href: "/free-event-ticketing-software", badge: "₹0" },
      { label: "Event Registration Form with QR Code", href: "/event-registration-form-with-qr-code", badge: "Forms" },
      { label: "Best QR Check-In Software (2026)", href: "/best-qr-check-in-software", badge: "Benchmark" },
      { label: "How to Create QR Tickets for an Event", href: "/how-to-create-qr-tickets-for-an-event", badge: "Guide" },
      { label: "Event Registration Software", href: "/event-registration-software" },
      { label: "Event Check-In Software", href: "/event-check-in-software" },
      { label: "QR Event Check-In", href: "/qr-event-check-in" },
      { label: "Event Ticketing Software India", href: "/event-ticketing-software-india", badge: "UPI" },
      { label: "Best Event Registration Software India", href: "/best-event-registration-software-india" },
      { label: "Digital Event Pass", href: "/digital-event-pass" },
      { label: "Event QR Code Generator", href: "/event-qr-code-generator" },
      { label: "Event Entry Management System", href: "/event-entry-management-system" },
      { label: "Multiple Gate Event Check-In", href: "/multiple-gate-event-check-in", badge: "Multi-Door" },
      { label: "Event Check-In for 5,000+ Attendees", href: "/event-check-in-for-5000-attendees", badge: "Scale" },
      { label: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", badge: "0% Cut" },
      { label: "Zero Commission Ticketing India", href: "/zero-commission-event-ticketing-india" },
      { label: "Zero Commission Ticketing UK", href: "/zero-commission-event-ticketing-uk" },
      { label: "Enterprise SSO Event Ticketing", href: "/enterprise-sso-event-ticketing", badge: "SAML" },
      { label: "SCIM Event User Provisioning", href: "/scim-event-user-provisioning", badge: "SCIM" },
      { label: "Custom Domain Event Ticketing", href: "/custom-domain-event-ticketing" },
      { label: "Event Security & Compliance", href: "/event-security-compliance", badge: "GDPR" },
      { label: "White-Label Event Platform", href: "/white-label-event-platform" },
    ],
  },
  {
    title: "2. Core Features & Gate Technology",
    badge: "Product",
    links: [
      { label: "Custom Pass Designer", href: "/custom-pass-design", badge: "Popular" },
      { label: "Design Your Ticket", href: "/design-your-ticket" },
      { label: "Event Ticket Designer", href: "/event-ticket-designer" },
      { label: "Mobile QR Code Scanner", href: "/qr-code-scanner", badge: "Fast" },
      { label: "Event Ticket Scanner", href: "/event-ticket-scanner", badge: "Hardware+Phone" },
      { label: "Offline QR Check-In", href: "/offline-qr-event-check-in", badge: "Zero-Wi-Fi" },
      { label: "Real-Time Event Analytics", href: "/event-analytics", badge: "Live" },
      { label: "WhatsApp Event Tickets", href: "/whatsapp-event-tickets", badge: "98% Open" },
      { label: "Event Management Software", href: "/event-management-software" },
      { label: "Event Registration Platform", href: "/event-registration-platform" },
      { label: "Online Event Registration", href: "/online-event-registration" },
      { label: "Online Registration System", href: "/online-event-registration-system" },
      { label: "Event Registration Form Builder", href: "/event-registration-form-builder" },
      { label: "Bulk Event Registration", href: "/bulk-event-registration" },
      { label: "Delegate Registration Software", href: "/delegate-registration-software" },
      { label: "Event Registration with UPI", href: "/event-registration-with-upi", badge: "0% Fee" },
      { label: "Event Registration with UPI Payment", href: "/event-registration-with-upi-payment" },
      { label: "Event Registration with Payment", href: "/event-registration-with-payment" },
      { label: "Razorpay Event Ticketing", href: "/razorpay-event-ticketing" },
      { label: "Razorpay Event Registration", href: "/razorpay-event-registration" },
      { label: "UPI Event Ticketing", href: "/upi-event-ticketing" },
      { label: "Event Ticket Payment Gateway", href: "/event-ticket-payment-gateway" },
      { label: "Online Event Ticketing", href: "/online-event-ticketing" },
      { label: "Event Pass Management", href: "/event-pass-management-system" },
      { label: "Event Badge Generator", href: "/event-badge-generator" },
      { label: "Event Ticket Generator", href: "/event-ticket-generator" },
      { label: "Event RSVP Software", href: "/event-rsvp-software" },
      { label: "Event Guest List Software", href: "/event-guest-list-software" },
      { label: "Event Entry System", href: "/event-entry-system" },
      { label: "Event Check-In App (Browser)", href: "/event-check-in-app" },
      { label: "Event Check-In Dashboard", href: "/event-check-in-dashboard" },
      { label: "QR Code Attendance System", href: "/qr-code-attendance-system" },
      { label: "QR Attendance System for Events", href: "/qr-code-attendance-system-for-events" },
      { label: "Event Attendance Tracking", href: "/event-attendance-tracking" },
      { label: "Event Attendance Software", href: "/event-attendance-software" },
      { label: "Event Attendance Tracking Software", href: "/event-attendance-tracking-software" },
      { label: "Attendee Management", href: "/attendee-management" },
      { label: "QR Event Tickets", href: "/qr-event-tickets" },
      { label: "QR Ticketing System", href: "/qr-ticketing-system" },
      { label: "QR Ticket Scanner", href: "/qr-ticket-scanner" },
      { label: "Mobile QR Ticket Scanner", href: "/mobile-qr-ticket-scanner" },
      { label: "Attendee Check-In System", href: "/attendee-check-in-system" },
      { label: "Event Technology Platform", href: "/event-technology-platform" },
      { label: "Digital Event Ticketing Platform", href: "/digital-event-ticketing-platform" },
      { label: "QR Event Management System", href: "/qr-event-management-system" },
      { label: "Event Access Control Software", href: "/event-access-control-software" },
      { label: "Event Access Control", href: "/event-access-control" },
      { label: "Event Entry Management", href: "/event-entry-management" },
      { label: "Event Guest Management", href: "/event-guest-management" },
      { label: "Free Event Registration", href: "/free-event-registration" },
      { label: "Free Event Ticketing", href: "/free-event-ticketing" },
      { label: "Event Capacity Management", href: "/event-capacity-management" },
      { label: "Event Waitlist Management", href: "/event-waitlist-management" },
      { label: "Event Ticket Inventory Management", href: "/event-ticket-inventory-management" },
      { label: "Event Team Management", href: "/event-team-management" },
      { label: "Multi-Event Management", href: "/multi-event-management" },
      { label: "Multi-Location Event Management", href: "/multi-location-event-management" },
      { label: "Event Webhooks & Integrations", href: "/event-webhooks" },
      { label: "Event Registration API", href: "/event-registration-api" },
      { label: "Event Registration Analytics", href: "/event-registration-analytics" },
      { label: "Event Registration Approval System", href: "/event-registration-approval-system" },
      { label: "Event No-Show Tracking", href: "/event-no-show-tracking" },
      { label: "Event Data Migration", href: "/event-data-migration" },
    ],
  },
  {
    title: "3. Use Cases & Event Formats",
    badge: "Use Case",
    links: [
      { label: "College Event Registration Software", href: "/college-event-registration-software", badge: "Campus" },
      { label: "College Fest Management Software", href: "/college-fest-management-software", badge: "Fests" },
      { label: "Hackathon Registration Platform", href: "/hackathon-registration-platform", badge: "Hackers" },
      { label: "Conference Registration Software", href: "/conference-registration-software", badge: "Summits" },
      { label: "Workshop Registration Software", href: "/workshop-registration-software", badge: "Hands-on" },
      { label: "Seminar Registration Software", href: "/seminar-registration-software", badge: "Auditoriums" },
      { label: "Event Guest Management Software", href: "/event-guest-management-software", badge: "VIP" },
      { label: "College Events Hub", href: "/college-events" },
      { label: "College Fests & Culturals", href: "/college-fests", badge: "Top" },
      { label: "College Fest Registration Software", href: "/college-fest-registration-software" },
      { label: "Tech Fest Registration Software", href: "/tech-fest-registration-software" },
      { label: "Event Software for Colleges", href: "/event-registration-software-for-colleges" },
      { label: "Ticketing Platform for College Events", href: "/event-ticketing-platform-for-college-events" },
      { label: "Event Software for Universities", href: "/event-registration-software-for-universities" },
      { label: "Event Software for Agencies", href: "/event-registration-software-for-agencies" },
      { label: "Event Software for Corporates", href: "/event-registration-software-for-corporates" },
      { label: "Hackathons & Buildathons", href: "/hackathons", badge: "Top" },
      { label: "Technical Symposium", href: "/technical-symposium" },
      { label: "Cultural Fest Management", href: "/cultural-fest" },
      { label: "Campus & Orientation Events", href: "/campus-events" },
      { label: "University Events", href: "/university-events" },
      { label: "School Events & Annual Days", href: "/school-events" },
      { label: "Tech Conferences & Summits", href: "/conferences" },
      { label: "Ticketing for Conferences", href: "/event-ticketing-platform-for-conferences" },
      { label: "Business Conferences", href: "/business-conferences" },
      { label: "Developer Meetups", href: "/developer-meetups" },
      { label: "Workshops & Masterclasses", href: "/workshops" },
      { label: "Ticketing for Workshops", href: "/event-ticketing-platform-for-workshops" },
      { label: "Academic Seminars", href: "/seminars" },
      { label: "Corporate Events & Townhalls", href: "/corporate-events" },
      { label: "Startup Pitches & Demo Days", href: "/startup-events" },
      { label: "Networking Mixers", href: "/networking-events" },
      { label: "Trade Shows & Expos", href: "/trade-shows" },
      { label: "Exhibitions & Galleries", href: "/exhibitions" },
      { label: "Sports Events & Tournaments", href: "/sports-events" },
      { label: "Award Ceremonies & Galas", href: "/award-ceremonies" },
      { label: "Alumni Meets & Reunions", href: "/alumni-events" },
      { label: "Training & Certification", href: "/training-events" },
      { label: "Community Meetups", href: "/community-events" },
    ],
  },
  {
    title: "4. United Kingdom Topical Cluster",
    badge: "UK Hub",
    links: [
      { label: "UK Event Software Hub", href: "/uk", badge: "Parent Hub" },
      { label: "UK Event Ticketing Software", href: "/uk/event-ticketing-software", badge: "P0" },
      { label: "UK Event Registration Software", href: "/uk/event-registration-software", badge: "P0" },
      { label: "QR Code Event Check-In UK", href: "/uk/qr-code-event-check-in", badge: "P0" },
      { label: "UK Event Check-In Software", href: "/uk/event-check-in-software", badge: "P0" },
      { label: "Eventbrite Alternative UK", href: "/uk/eventbrite-alternative", badge: "P0" },
      { label: "QR Ticketing System UK", href: "/uk/qr-ticketing-system", badge: "P0" },
      { label: "QR Code Event Registration UK", href: "/uk/qr-code-event-registration" },
      { label: "QR Check-In UK", href: "/uk/qr-check-in" },
      { label: "University Event Software UK", href: "/uk/university-event-software", badge: "Higher Ed" },
      { label: "University Event Management UK", href: "/uk/university-event-management-software" },
      { label: "Student Union Event Ticketing", href: "/uk/student-union-event-ticketing", badge: "SU" },
      { label: "College Event Registration UK", href: "/uk/college-event-registration" },
      { label: "Conference Registration Software UK", href: "/uk/conference-registration-software" },
      { label: "Workshop Registration Software UK", href: "/uk/workshop-registration-software" },
      { label: "Free Event Registration UK", href: "/uk/free-event-registration", badge: "£0" },
      { label: "Attendee Management Software UK", href: "/uk/attendee-management-software" },
      { label: "Digital Event Passes UK", href: "/uk/digital-event-passes" },
      { label: "Digital Event Pass UK (Wallet)", href: "/uk/digital-event-pass" },
      { label: "Event Guest List Software UK", href: "/uk/event-guest-list-software" },
      { label: "Hackathon Registration Platform UK", href: "/uk/hackathon-registration-platform", badge: "Dev" },
      { label: "Event Attendance Tracking UK", href: "/uk/event-attendance-tracking", badge: "CPD" },
      { label: "University Society Ticketing UK", href: "/university-society-event-ticketing" },
      { label: "Event Registration Software London", href: "/uk/london", badge: "Capital" },
      { label: "Event Registration Software Manchester", href: "/uk/manchester", badge: "North West" },
      { label: "Event Registration Software Birmingham", href: "/uk/birmingham", badge: "Midlands" },
      { label: "Event Registration Software Edinburgh", href: "/uk/edinburgh", badge: "Scotland" },
      { label: "Event Registration Software Glasgow", href: "/uk/glasgow", badge: "Scotland" },
      { label: "Event Registration Software Leeds", href: "/uk/leeds", badge: "Yorkshire" },
      { label: "Event Registration Software Bristol", href: "/uk/bristol", badge: "South West" },
      { label: "Event Registration Software Liverpool", href: "/uk/liverpool", badge: "North West" },
      { label: "Event Registration Software Cambridge", href: "/uk/cambridge", badge: "Oxbridge" },
      { label: "Event Registration Software Cardiff", href: "/uk/cardiff", badge: "Wales" },
      { label: "Event Registration Software Belfast", href: "/uk/belfast", badge: "NI" },
    ],
  },
  {
    title: "5. Locations in India",
    badge: "India Hub",
    links: [
      { label: "Events Software India (National Hub)", href: "/in", badge: "Hub" },
      { label: "Bangalore Event Software", href: "/event-registration-software-bangalore", badge: "Tech" },
      { label: "Bangalore City Guide", href: "/in/bangalore" },
      { label: "Chennai Event Software", href: "/event-registration-software-chennai", badge: "Colleges" },
      { label: "Chennai City Guide", href: "/in/chennai" },
      { label: "Hyderabad Event Software", href: "/event-registration-software-hyderabad", badge: "HITEC" },
      { label: "Hyderabad City Guide", href: "/in/hyderabad" },
      { label: "Mumbai Event Software", href: "/event-registration-software-mumbai", badge: "Expos" },
      { label: "Mumbai City Guide", href: "/in/mumbai" },
      { label: "Delhi NCR Event Software", href: "/event-registration-software-delhi", badge: "Summits" },
      { label: "Delhi NCR City Guide", href: "/in/delhi" },
      { label: "Pune Event Software", href: "/event-registration-software-pune", badge: "IT" },
      { label: "Pune City Guide", href: "/in/pune" },
      { label: "Coimbatore Event Software", href: "/event-registration-software-coimbatore", badge: "Institutions" },
      { label: "Coimbatore City Guide", href: "/in/coimbatore" },
      { label: "Kochi Event Software", href: "/event-registration-software-kochi", badge: "Startups" },
      { label: "Kochi City Guide", href: "/in/kochi" },
      { label: "Gurgaon Event Software", href: "/event-registration-software-gurgaon" },
      { label: "Gurgaon City Guide", href: "/in/gurgaon" },
      { label: "Noida Event Software", href: "/event-registration-software-noida" },
      { label: "Noida City Guide", href: "/in/noida" },
      { label: "Kolkata City Guide", href: "/in/kolkata" },
      { label: "Ahmedabad City Guide", href: "/in/ahmedabad" },
      { label: "Chandigarh City Guide", href: "/in/chandigarh" },
      { label: "Jaipur City Guide", href: "/in/jaipur" },
      { label: "Goa City Guide", href: "/in/goa" },
      { label: "Bhopal City Guide", href: "/in/bhopal" },
      { label: "Indore City Guide", href: "/in/indore" },
      { label: "Lucknow City Guide", href: "/in/lucknow" },
      { label: "Patna City Guide", href: "/in/patna" },
      { label: "Bhubaneswar City Guide", href: "/in/bhubaneswar" },
      { label: "Visakhapatnam City Guide", href: "/in/visakhapatnam" },
      { label: "Nagpur City Guide", href: "/in/nagpur" },
      { label: "Surat City Guide", href: "/in/surat" },
      { label: "Vadodara City Guide", href: "/in/vadodara" },
      { label: "Trivandrum City Guide", href: "/in/trivandrum" },
      { label: "Vellore & VIT Guide", href: "/in/vellore", badge: "VIT" },
      { label: "Madurai City Guide", href: "/in/madurai" },
      { label: "Trichy & NIT Guide", href: "/in/trichy" },
      { label: "Salem City Guide", href: "/in/salem" },
      { label: "Erode City Guide", href: "/in/erode" },
      { label: "Tiruppur City Guide", href: "/in/tiruppur" },
    ],
  },
  {
    title: "6. Competitor Comparisons & Alternatives",
    badge: "Comparisons",
    links: [
      { label: "All Comparisons Hub", href: "/compare", badge: "Overview" },
      { label: "URPASS vs Eventbrite (2026)", href: "/compare/urpass-vs-eventbrite", badge: "Head-to-Head" },
      { label: "URPASS vs Zoho Backstage", href: "/compare/urpass-vs-zoho-backstage", badge: "Head-to-Head" },
      { label: "URPASS vs BookMyShow", href: "/compare/urpass-vs-bookmyshow", badge: "Head-to-Head" },
      { label: "URPASS vs Google Forms", href: "/compare/urpass-vs-google-forms", badge: "Head-to-Head" },
      { label: "Best Eventbrite Alternatives (2026)", href: "/compare/eventbrite-alternatives", badge: "Best List" },
      { label: "Best Zoho Backstage Alternatives", href: "/compare/zoho-backstage-alternatives", badge: "Best List" },
      { label: "Eventbrite Alternative India", href: "/compare/eventbrite-alternative-india", badge: "Zero Fee" },
      { label: "Eventbrite Alternative UK", href: "/compare/eventbrite-alternative-uk", badge: "UK" },
      { label: "Eventbrite Alternative (Global)", href: "/compare/eventbrite-alternative" },
      { label: "Zoho Backstage Alternative India", href: "/compare/zoho-backstage-alternative-india" },
      { label: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative" },
      { label: "Google Forms vs URPASS", href: "/compare/google-forms-vs-urpass" },
      { label: "Google Forms Registration Alternative", href: "/compare/google-forms-event-registration-alternative" },
      { label: "Google Forms Alternative for Events", href: "/google-forms-alternative-for-events" },
      { label: "Townscript Alternative", href: "/compare/townscript-alternative" },
      { label: "AllEvents Alternative", href: "/compare/allevents-alternative" },
    ],
  },
  {
    title: "7. Educational Guides & Tutorials",
    badge: "Guides & GEO",
    links: [
      { label: "All Guides & Knowledge Hub", href: "/guides", badge: "Hub" },
      { label: "How to Create QR Tickets for an Event", href: "/how-to-create-qr-tickets-for-an-event", badge: "New" },
      { label: "How QR Ticket Validation Works", href: "/how-qr-ticket-validation-works" },
      { label: "How QR Check-In Works", href: "/guides/how-does-qr-event-check-in-work" },
      { label: "How to Check In 1,000+ Attendees Fast", href: "/guides/how-to-check-in-1000-attendees-quickly", badge: "Speed" },
      { label: "Manage Multiple Event Entrances", href: "/guides/how-to-manage-multiple-event-entrances" },
      { label: "Generate QR Codes for Attendees", href: "/guides/how-to-create-qr-codes-for-event-attendees" },
      { label: "Create Digital Event Passes", href: "/guides/how-to-create-digital-event-passes" },
      { label: "Track Attendance in Real Time", href: "/guides/how-to-track-event-attendance-in-real-time" },
      { label: "College Event Registration Guide", href: "/guides/how-to-manage-college-event-registrations" },
      { label: "College Fest Form Best Practices", href: "/guides/how-to-create-college-fest-registration-form" },
      { label: "How to Send QR Tickets via Email", href: "/guides/how-to-send-qr-tickets-to-attendees" },
      { label: "What Fields to Collect in Forms", href: "/guides/what-information-should-event-registration-form-collect" },
      { label: "QR Tickets vs Paper Tickets", href: "/guides/qr-ticket-vs-paper-ticket" },
      { label: "Event Registration vs Google Forms", href: "/guides/event-registration-software-vs-google-forms" },
      { label: "Can Google Forms Generate QR Passes?", href: "/guides/can-google-forms-generate-event-qr-passes" },
      { label: "Run Registration Without Eventbrite", href: "/guides/how-to-run-event-registration-without-eventbrite" },
      { label: "Create Free Event Tickets Online", href: "/guides/how-to-create-free-event-tickets-online" },
      { label: "Organize Registration for Hackathons", href: "/guides/how-to-organize-registration-for-a-hackathon" },
      { label: "Manage Conference Attendees", href: "/guides/how-to-manage-conference-attendees" },
      { label: "Best Way to Check Attendees In", href: "/guides/best-way-to-check-attendees-into-an-event" },
      { label: "Prevent Duplicate Entry Guide", href: "/guides/prevent-duplicate-event-entry" },
      { label: "Event Check-In Without an App", href: "/guides/event-check-in-without-app" },
      { label: "What is QR Event Check-In?", href: "/guides/what-is-qr-event-check-in" },
      { label: "How to Create a QR Event Pass", href: "/guides/how-to-create-qr-event-pass" },
      { label: "College Event Registration System", href: "/guides/college-event-registration-system" },
    ],
  },
  {
    title: "8. AI & Model Context Protocol (MCP)",
    badge: "AI Agents",
    links: [
      { label: "MCP Event Management Platform", href: "/mcp-event-management", badge: "MCP" },
      { label: "MCP Server for Events", href: "/mcp-server-for-events", badge: "Core" },
      { label: "AI Agent Event Registration", href: "/ai-agent-event-registration" },
      { label: "AI-Powered Event Check-In", href: "/ai-event-check-in", badge: "Speed" },
      { label: "Claude Desktop Event Ops", href: "/claude-desktop-event-management", badge: "Claude" },
      { label: "Cursor MCP Event Ticketing", href: "/cursor-mcp-event-ticketing", badge: "Cursor" },
      { label: "MCP QR Code Pass Scanner", href: "/mcp-qr-code-scanner" },
      { label: "AI Attendee Management", href: "/ai-attendee-management" },
      { label: "AI Event Analytics & Velocity", href: "/ai-event-analytics", badge: "Live" },
      { label: "MCP Hackathon Management", href: "/mcp-hackathon-management", badge: "Dev" },
      { label: "AI Conference Management", href: "/ai-conference-management" },
      { label: "Autonomous Event Check-In", href: "/autonomous-event-check-in", badge: "Kiosk" },
      { label: "MCP Event API & JSON-RPC", href: "/mcp-event-api", badge: "API" },
      { label: "AI Event Ticketing Bot", href: "/ai-event-ticketing-bot" },
      { label: "MCP Event Ops Bangalore", href: "/mcp-event-management-bangalore", badge: "BLR" },
      { label: "MCP Event Ops Hyderabad", href: "/mcp-event-management-hyderabad", badge: "HYD" },
      { label: "MCP Event Ops Chennai", href: "/mcp-event-management-chennai", badge: "MAA" },
      { label: "MCP Event Ops Pune", href: "/mcp-event-management-pune", badge: "PNQ" },
      { label: "MCP Event Ops Delhi NCR", href: "/mcp-event-management-delhi", badge: "DEL" },
      { label: "MCP Event Ops Mumbai", href: "/mcp-event-management-mumbai", badge: "BOM" },
    ],
  },
];

export default function SitelinksPage() {
  const totalLinks = sections.reduce((acc, sec) => acc + sec.links.length, 0);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-5 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Social Icons Header Badge */}
          <div className="flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 transition-colors text-xs font-semibold"
              aria-label="URPASS on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@urpass.space</span>
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-xs font-semibold"
              aria-label="URPASS on YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
          </div>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-neutral-200/80 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span>INDEX & DIRECTORY</span>
            <span>·</span>
            <span>{totalLinks} Curated Routes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            URPASS Sitelinks & Directory
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Browse all public routes across URPASS — high-intent event registration software, sub-second QR check-in, the UK topical cluster, Indian city hubs, comparisons, and guides.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                    {section.title}
                  </h2>
                  {section.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {section.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-neutral-400 font-mono">
                  {section.links.length} pages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2.5">
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors text-xs font-medium text-neutral-700 hover:text-neutral-950"
                  >
                    <span className="truncate group-hover:underline underline-offset-2">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
