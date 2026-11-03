import { SeoGeoPageConfig } from "../seo-geo-template.types";
import { PAGE_001_CORPORATE_CONFIG } from "../page-001-corporate";

export const PAGE_002_CONFERENCE_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 002",
  pageId: "conference-registration-and-check-in-software",
  slug: "conference-registration-and-check-in-software",
  canonicalUrl: "https://urpass.space/solutions/conference-registration-and-check-in-software",
  primaryKeyword: "conference registration and check-in software",
  secondaryKeywords: [
    "conference ticketing platform",
    "delegate badge scanning software",
    "conference QR entry system",
    "multi-track conference check-in",
  ],
  market: "India, with global applicability",
  audience: "Conference directors, association convenors, academic chairs, event committees",
  searchIntent: "Commercial",
  conversionGoal: "Start event",
  seoTitle: "Conference Registration & Check-In Software | UrPass",
  metaDescription:
    "Professional conference registration and sub-second QR check-in software. Multi-tier delegate passes, instant UPI/card payments, and live session attendance.",
  badge: "SOLUTIONS // CONFERENCES & SUMMITS",
  h1: "Conference Registration and Check-In Software That Eliminates Gate Queues",
  heroSubtitle:
    "Register delegates smoothly. Issue digital QR credentials. Scan attendees in 0.28 seconds.",
  heroDescription:
    "From academic symposia and national medical conventions to commercial technology summits, UrPass unites multi-tier delegate registration, instant UPI and card fee collection, custom digital badges, and high-speed QR gate check-in into one effortless platform.",
  primaryCtaLabel: "Start Your Conference",
  secondaryCtaLabel: "See Check-In Demo",
  problemSection: {
    badge: "CONFERENCE MORNING RUSH",
    title: "Why Morning Conference Registration Queues Break Down",
    paragraphs: [
      "When 500 to 2,000 delegates arrive within a 45-minute window before the keynote, traditional registration desks collapse under the weight of paper manifests, badge printers, and manual searches.",
      "Delegates end up stuck in 20-minute lobby lines, keynote presentations are delayed, and organizers lose visibility over who has entered the main plenary versus breakout workshops.",
      "Hardware scanner rentals cost tens of thousands of rupees and require specialized operator training that student volunteers or venue staff struggle with.",
      "UrPass replaces cumbersome registration desks with sub-second smartphone camera scanning, multi-tier digital passes in Apple Wallet and WhatsApp, and real-time delegate attendance sync across all venue entrances.",
    ],
  },
  capabilitiesSection: {
    badge: "BUILT FOR DELEGATE FLOW",
    title: "Enterprise Capabilities for Complex Academic & Business Conferences",
    subtitle: "Built to handle parallel tracks, VIP delegates, sponsor staff, and continuing education audits.",
    items: [
      {
        stepNumber: "01",
        title: "Multi-Tier Delegate Registration Forms",
        description:
          "Configure distinct registration categories with tailored pricing and custom intake fields—such as Student Delegate, Presenter, General Delegate, and VIP Keynote Speaker.",
        bestFor: "Academic congresses, medical conventions, and multi-day summits.",
        icon: "file-text",
      },
      {
        stepNumber: "02",
        title: "Zero-Commission Ticket Fee Collection",
        description:
          "Collect registration fees directly into your organization's bank account via Razorpay or Stripe. Accept UPI, cards, and NetBanking with 0% UrPass platform ticketing commission.",
        bestFor: "Conferences aiming to protect conference margins from 5-10% aggregator fees.",
        icon: "zap",
      },
      {
        stepNumber: "03",
        title: "Digital Delegate Passes with Dynamic QR Codes",
        description:
          "Automatically deliver branded digital conference badges to delegates via email, WhatsApp, and Apple Wallet immediately upon registration confirmation.",
        bestFor: "Eliminating costly plastic lanyard printing and lost paper tickets.",
        icon: "qr-code",
      },
      {
        stepNumber: "04",
        title: "Sub-Second Smartphone QR Scanning",
        description:
          "Turn any iPhone or Android device into an industrial-grade badge scanner. Validate delegate passes in 0.28 seconds with clear audio feedback and offline local sync.",
        bestFor: "Morning auditorium foyers, exhibition hall doors, and dining hall entry.",
        icon: "scan-line",
      },
      {
        stepNumber: "05",
        title: "Live Delegate Manifest & Breakout Analytics",
        description:
          "Track delegate check-in velocity in real time. Know exactly how many delegates have arrived, track breakout session capacity, and export verified attendance rolls for CME/CPD credits.",
        bestFor: "Accredited symposiums, sponsor footfall proof, and caterer headcount counts.",
        icon: "bar-chart-3",
      },
    ],
  },
  howItWorksSection: {
    badge: "CONFERENCE WORKFLOW",
    title: "How UrPass Powers Your Conference From CFP to Closing Remarks",
    steps: [
      { stepNumber: "01", title: "Create Your Conference Page", description: "Set your dates, venue halls, delegate tiers, and early-bird deadlines in minutes." },
      { stepNumber: "02", title: "Collect Delegate Information", description: "Capture affiliations, dietary needs, paper presentation titles, and billing GST details." },
      { stepNumber: "03", title: "Automate Pass Dispatch", description: "Approved delegates receive encrypted QR badges directly in Apple Wallet, WhatsApp, and email." },
      { stepNumber: "04", title: "Scan at Plenary & Breakouts", description: "Gate staff scan passes at 0.28s per delegate using smartphones without rented hardware." },
      { stepNumber: "05", title: "Export Attendance Reports", description: "Download timestamped check-in logs for certification, sponsor reporting, and post-event analytics." },
    ],
    ctaLabel: "Launch Your Conference in UrPass",
  },
  eventTypesSection: {
    badge: "CONFERENCE VERTICALS",
    title: "Tailored for Every Conference Format",
    items: [
      { title: "Academic & Scientific Symposia", description: "Manage peer-reviewed presenter badges, student pricing tiers, and session-specific hall access." },
      { title: "Medical Conventions (CME)", description: "Track exact attendee classroom minutes and generate verified audit trails for medical council credits." },
      { title: "B2B Technology Congresses", description: "High-throughput executive check-in, sponsor pass allocations, and multi-gate trade floor entry." },
      { title: "Industry Association AGMs", description: "Verify voting member credentials and enforce strict one-member-one-vote meeting check-ins." },
    ],
  },
  comparisonSection: {
    badge: "THE URPASS DIFFERENCE",
    title: "How UrPass Outperforms Generic Forms and Ticketing Portals",
    summaryText: "Why leading academic and trade associations choose UrPass over Eventbrite, Google Forms, and manual check-in tables.",
    headers: ["Manual Forms & Ticket Aggregators", "UrPass Conference Platform"],
    rows: [
      { manual: "5% to 10% platform commission deducted from delegate fees", urpass: "0% platform ticketing fee — keep 100% of your delegate revenue" },
      { manual: "Long morning queues searching paper lists or printing badges", urpass: "Sub-0.3s smartphone camera scanning with instant audio verification" },
      { manual: "No offline capability — network crashes stall gate entry", urpass: "Full offline scanner caching with automatic cloud background reconciliation" },
      { manual: "Tickets trapped in email PDFs with no mobile wallet sync", urpass: "Native Apple Wallet passes and WhatsApp ticket delivery" },
      { manual: "Attendee contact data harvested by commercial aggregators", urpass: "100% organizer data ownership with full CSV exports" },
    ],
  },
  audienceSection: {
    badge: "WHO USES URPASS",
    title: "Built for Professional Conference Teams",
    audiences: [
      "Conference Organising Committees (COCs)",
      "University Research Departments & Dean Offices",
      "Medical & Healthcare Associations",
      "B2B Trade Associations & Chambers of Commerce",
      "Professional Conference Organisers (PCOs)",
    ],
    summaryText: "UrPass eliminates administrative fatigue so conference committees can focus on speaker curation and delegate experience.",
  },
  geoAnswerBlock: {
    question: "What software handles conference registration and attendance?",
    answer:
      "UrPass is comprehensive conference registration and check-in software that manages delegate sign-ups, payment processing, badge issuance, and on-site entrance verification. Designed for academic and corporate summits, it replaces rented badge scanners and paper guest lists with smartphone camera QR scanning, multi-tier ticketing, and zero platform commission.",
    highlights: ["0% platform ticket fee", "0.28s smartphone badge scan", "Apple Wallet & WhatsApp passes", "Offline entrance sync"],
  },
  productProofSection: {
    badge: "PROVEN AT THE GATE",
    title: "Real Interface Built for High-Throughput Delegate Entry",
    subtitle: "Explore the actual registration form builder, ticket studio, gate scanner, and live delegate dashboard.",
  },
  faqSection: {
    badge: "FREQUENT QUESTIONS",
    title: "Conference Registration & Check-In FAQs",
    faqs: [
      {
        q: "How does UrPass handle different delegate categories like students, presenters, and VIPs?",
        a: "UrPass allows you to create unlimited custom delegate tiers with distinct pricing, registration questions, and pass styling. Each tier receives a visually distinct digital badge with color coding so gate staff can immediately recognize VIPs or plenary-only guests.",
      },
      {
        q: "Can we scan delegate passes if the conference venue has poor Wi-Fi or cellular service?",
        a: "Yes. The UrPass gate scanner pre-caches delegate credentials on the scanning device. Gate staff can scan and validate passes continuously even when completely offline. As soon as connectivity resumes, all check-in timestamps synchronize seamlessly to the cloud.",
      },
      {
        q: "Does UrPass take a percentage cut of our conference ticket sales?",
        a: "No. UrPass charges 0% platform ticketing fees. You connect your own payment gateway (such as Razorpay or Stripe) and pay only standard gateway interchange (~2% in India). Your delegate registration funds settle directly into your organization's bank account.",
      },
      {
        q: "Can multiple volunteers scan delegate tickets at different conference entrance doors?",
        a: "Yes. UrPass supports multi-gate synchronization. You can deploy 10, 20, or more volunteer scanners across main auditorium doors, dining areas, and exhibition halls simultaneously. Duplicate check-in attempts are flagged immediately across all devices.",
      },
      {
        q: "Can we track attendance for continuing education or CME certification?",
        a: "Yes. UrPass records exact millisecond timestamps and scanning operator IDs for each delegate entry. After the conference, you can download a complete CSV audit log proving delegate attendance for certification boards.",
      },
    ],
  },
  closingCtaSection: {
    badge: "GET STARTED TODAY",
    title: "Ready to Eliminate Conference Registration Queues?",
    description: "Launch your conference in 5 minutes with our Free Forever plan or scale with Starter from ₹499/month.",
    primaryCtaLabel: "Start Your Conference",
    secondaryCtaLabel: "Explore All Features",
  },
  salesDemoSection: {
    badge: "CONFERENCE INQUIRY",
    title: "Speak with Our Conference Solutions Team",
    description: "Hosting a major national congress or multi-day convention? Share your event requirements for dedicated onboarding support.",
    submitCtaLabel: "Request Conference Walkthrough",
    disclaimer: "No spam. We respond within 4 business hours with honest capacity recommendations.",
    tagline: "Trusted by academic institutions, medical associations, and tech conferences worldwide.",
  },
};

export const PAGE_003_COLLEGE_FEST_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 003",
  pageId: "college-fest-registration-and-ticketing-software",
  slug: "college-fest-registration-and-ticketing-software",
  canonicalUrl: "https://urpass.space/solutions/college-fest-registration-and-ticketing-software",
  primaryKeyword: "college fest registration and ticketing software",
  secondaryKeywords: [
    "campus event ticketing software",
    "college symposium registration",
    "cultural fest QR pass system",
    "college event gate crowd control",
  ],
  market: "India, university and college campuses",
  audience: "Student council heads, cultural secretaries, fest convenors, faculty advisors",
  searchIntent: "Commercial",
  conversionGoal: "Start event",
  seoTitle: "College Fest Registration & Ticketing Software | UrPass",
  metaDescription:
    "Student-friendly college fest ticketing with instant UPI QR payments, anti-screenshot passes, and sub-second campus gate scanning. 0% ticket cut.",
  badge: "SOLUTIONS // CAMPUS & COLLEGE FESTS",
  h1: "College Fest Registration and Ticketing Software Built for High-Energy Campus Crowds",
  heroSubtitle:
    "Instant UPI ticket purchases. Anti-screenshot QR passes. Sub-second crowd check-in at campus gates.",
  heroDescription:
    "Built specifically for student committees organizing cultural fests, technical symposiums, and college pro-nights. UrPass eliminates unverified Google Forms and cash accounting with instant UPI payments, college ID verification, and lightning-fast smartphone QR scanning.",
  primaryCtaLabel: "Start College Fest",
  secondaryCtaLabel: "See Campus Demo",
  problemSection: {
    badge: "CAMPUS GATE CHAOS",
    title: "Why Google Forms and Paper Bands Fail at College Fests",
    paragraphs: [
      "Every fest organizer knows the nightmare of reconciling thousands of UPI screenshot payments sent across WhatsApp groups and Google Forms.",
      "At the campus gate, fake paper wristbands, forwarded ticket screenshots, and aggressive crowd surges overwhelm student volunteers armed with printed Excel sheets.",
      "Traditional commercial ticketing aggregators demand 8% to 12% cuts of precious student fest budgets and take weeks to release ticket funds after the fest concludes.",
      "UrPass gives student committees an automated, cheat-proof ticketing and gate verification system that runs directly on student smartphones with 0% platform ticket fees.",
    ],
  },
  capabilitiesSection: {
    badge: "FEST-TESTED FEATURES",
    title: "Engineered to Withstand 10,000+ Student Gate Arrivals",
    subtitle: "Everything student councils need to sell tickets, prevent pass forgery, and clear gate queues before the pro-night begins.",
    items: [
      {
        stepNumber: "01",
        title: "Instant UPI QR Checkout",
        description:
          "Students pay directly using Google Pay, PhonePe, Paytm, or BHIM. Ticket funds settle straight into your college or fest committee bank account with zero intermediary hold.",
        bestFor: "Eliminating manual screenshot verification and cash handling at student desks.",
        icon: "zap",
      },
      {
        stepNumber: "02",
        title: "Anti-Screenshot Dynamic QR Passes",
        description:
          "Encrypted digital passes with animated visual watermarks and dynamic countdown timers that prevent attendees from sharing static screenshots with unregistered friends.",
        bestFor: "Pro-nights, celebrity performances, and restricted campus auditorium events.",
        icon: "shield",
      },
      {
        stepNumber: "03",
        title: "College ID & Roll Number Validation",
        description:
          "Enforce mandatory college roll number collection and institutional email restrictions (.edu/.ac.in) to differentiate internal students from external college attendees.",
        bestFor: "Inter-college competitive symposiums and internal cultural competitions.",
        icon: "file-text",
      },
      {
        stepNumber: "04",
        title: "Sub-Second Volunteer Scanner App",
        description:
          "Turn any volunteer's smartphone camera into an ultra-fast ticket scanner. Validates passes in 0.28 seconds with loud sound alerts and high-contrast pass confirmation screens.",
        bestFor: "Handling 2,000 students arriving simultaneously at college main gates.",
        icon: "scan-line",
      },
      {
        stepNumber: "05",
        title: "Multi-Sub-Event Pass Bundling",
        description:
          "Issue all-access fest passes or individual tickets for hackathons, gaming tournaments, dance battles, and fashion shows under a single unified student registration.",
        bestFor: "3-day fests with 40+ parallel cultural, literary, and technical competitions.",
        icon: "sliders",
      },
    ],
  },
  howItWorksSection: {
    badge: "CAMPUS LAUNCH WORKFLOW",
    title: "How to Launch Your College Fest in 15 Minutes",
    steps: [
      { stepNumber: "01", title: "Set Up Your Fest Page", description: "Add fest branding, sponsors, event schedules, and ticket pricing tiers in our visual studio." },
      { stepNumber: "02", title: "Share on Instagram & WhatsApp", description: "Post your fest registration link on college social media handles and department groups." },
      { stepNumber: "03", title: "Students Pay via UPI", description: "Attendees pay in seconds and instantly receive branded digital passes on WhatsApp and email." },
      { stepNumber: "04", title: "Volunteers Scan at Gates", description: "Committee volunteers scan passes at entry gates using smartphones without complex training." },
      { stepNumber: "05", title: "Live Gate Analytics", description: "Monitor crowd counts, identify peak rush hours, and maintain complete campus safety compliance." },
    ],
    ctaLabel: "Set Up Your College Fest Now",
  },
  eventTypesSection: {
    badge: "FEST CATEGORIES",
    title: "Built for Every Campus Event",
    items: [
      { title: "Annual Cultural Fests & Pro-Nights", description: "High-security crowd control, celebrity concert gate verification, and anti-forgery passes." },
      { title: "Technical Symposiums & Hackathons", description: "Multi-event registration, coding contest team passes, and meal distribution tracking." },
      { title: "Inter-College Sports Tournaments", description: "Athlete credential badges, team manager rosters, and spectator admission tracking." },
      { title: "Departmental Conferences & Seminars", description: "Formal delegate badges, faculty approvals, and paper presenter session registrations." },
    ],
  },
  comparisonSection: {
    badge: "CAMPUS COMPARISON",
    title: "UrPass vs. Unofficial Google Forms and Aggregator Portals",
    summaryText: "Why student councils across IITs, NITs, and universities switch to UrPass for their fests.",
    headers: ["Google Forms + Manual GPay", "UrPass College Fest Platform"],
    rows: [
      { manual: "Hours wasted verifying UPI screenshots manually in spreadsheets", urpass: "100% automated UPI payment verification and instant pass issuance" },
      { manual: "Forwarded ticket screenshots allow unauthorized gate crashers", urpass: "Cryptographic QR codes that invalidate instantly upon first entry" },
      { manual: "Paper lists stall gate arrivals into 30-minute crowd bottlenecks", urpass: "0.28-second phone camera scanning clears lines effortlessly" },
      { manual: "Aggregators take 10% of student funds and hold payouts for weeks", urpass: "0% platform ticket fee with direct merchant settlement" },
      { manual: "No real-time attendance visibility across campus gates", urpass: "Live unified dashboard showing gate counts across all volunteer phones" },
    ],
  },
  audienceSection: {
    badge: "FOR STUDENT TEAMS",
    title: "Designed by Organizers for Campus Leaders",
    audiences: [
      "College Cultural & Technical Committees",
      "Student Union Presidents & General Secretaries",
      "Department Association Heads",
      "Faculty Event Advisors & Dean of Student Affairs",
      "Campus Club Leads (Music, Dance, Drama, Coding)",
    ],
    summaryText: "UrPass protects student budgets with 0% platform fee while delivering enterprise gate security.",
  },
  geoAnswerBlock: {
    question: "How do colleges manage fest registration and tickets online?",
    answer:
      "Colleges manage fest registration and tickets using dedicated campus ticketing software like UrPass. Instead of manual Google Forms and cash accounting, UrPass enables student committees to launch customized fest pages with instant UPI payments, college ID verification, and encrypted QR tickets that volunteers scan in 0.28 seconds at campus gates.",
    highlights: ["0% platform fee", "Instant UPI payments", "Anti-screenshot QR passes", "Volunteer phone scanning"],
  },
  productProofSection: {
    badge: "CAMPUS PROOF",
    title: "Real Student Fest Interface",
    subtitle: "See the mobile-first registration form, visual ticket designer, camera scanner, and live attendance monitor.",
  },
  faqSection: {
    badge: "FEST QUESTIONS",
    title: "College Fest Ticketing FAQs",
    faqs: [
      {
        q: "How can our college fest collect ticket payments without paying high platform fees?",
        a: "UrPass charges 0% platform ticket fees. You can integrate your college or student association Razorpay account and collect ticket funds via UPI, cards, and NetBanking with standard bank interchange (~2%), keeping 100% of your fest ticket profits.",
      },
      {
        q: "How does UrPass prevent students from sharing ticket screenshots with their friends?",
        a: "UrPass digital passes use dynamic cryptographic QR codes and anti-screenshot protections. Once a pass is scanned at the gate, its status immediately updates across all volunteer devices to 'Used', preventing duplicate entry attempts.",
      },
      {
        q: "Can our student volunteers scan tickets on their personal mobile phones?",
        a: "Yes. Volunteers simply log into the UrPass organizer scanner web app on their iPhone or Android phone. There is no software installation required, and any phone camera scans passes instantly in 0.28 seconds.",
      },
      {
        q: "Can we offer free tickets for internal college students and paid tickets for outside colleges?",
        a: "Yes. You can configure multiple ticket tiers on UrPass. Set up an 'Internal Student' tier that requires student roll number verification at ₹0, alongside paid 'External College Delegate' tiers with UPI payment checkout.",
      },
      {
        q: "What happens if campus internet fails during the peak evening pro-night rush?",
        a: "The UrPass scanner stores approved ticket lists locally on each volunteer device. Scanners continue validating legitimate passes and preventing duplicates even if Wi-Fi or 5G connection completely drops out.",
      },
    ],
  },
  closingCtaSection: {
    badge: "READY FOR FEST SEASON",
    title: "Upgrade Your College Fest Experience",
    description: "Start free with 100 registrations or scale with Starter (500 registrations) for ₹499/month.",
    primaryCtaLabel: "Start Fest Ticketing",
    secondaryCtaLabel: "View Student Pricing",
  },
  salesDemoSection: {
    badge: "CAMPUS PARTNERSHIP",
    title: "Speak With Our Campus Solutions Team",
    description: "Hosting a major university fest with over 5,000 attendees? Contact us for specialized multi-gate logistical guidance.",
    submitCtaLabel: "Request Campus Demo",
    disclaimer: "We support student committees across India with dedicated onboarding.",
    tagline: "Empowering university cultural festivals and engineering symposiums nationwide.",
  },
};

export const PAGE_004_AGENCIES_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 004",
  pageId: "event-registration-software-for-agencies",
  slug: "event-registration-software-for-agencies",
  canonicalUrl: "https://urpass.space/solutions/event-registration-software-for-agencies",
  primaryKeyword: "event registration software for agencies",
  secondaryKeywords: [
    "white-label event ticketing for agencies",
    "multi-client event management software",
    "experiential marketing registration tool",
    "event agency check-in software",
  ],
  market: "India, UK, and global marketing agencies",
  audience: "Event management companies, experiential marketing agencies, PR and brand activation firms",
  searchIntent: "Commercial",
  conversionGoal: "Book demo",
  seoTitle: "Event Registration Software for Agencies | UrPass",
  metaDescription:
    "White-label event registration and QR check-in software built for agencies. Manage multi-client events, brand custom passes, and deliver real-time gate analytics.",
  badge: "SOLUTIONS // AGENCIES & EVENT PRODUCERS",
  h1: "Event Registration Software Built for Fast-Paced Event Agencies",
  heroSubtitle:
    "Manage multi-client events. Deliver branded registration forms. Provide clients with real-time gate proof.",
  heroDescription:
    "Agencies manage events under tight client deadlines with zero tolerance for gate hiccups. UrPass equips agency teams with rapid event creation, custom client branding, multi-gate smartphone check-in, and instant post-event audit reports—all with 0% platform ticket fees.",
  primaryCtaLabel: "Book Agency Demo",
  secondaryCtaLabel: "Explore Agency Features",
  problemSection: {
    badge: "AGENCY COMPLEXITY",
    title: "Why Agencies Struggle With Consumer Ticketing Platforms",
    paragraphs: [
      "Event agencies frequently juggle four or five simultaneous client activations—each with unique branding guidelines, custom registration questions, and strict client NDA requirements.",
      "Traditional ticketing portals plaster their own third-party logos over client landing pages, harvest client attendee data for retargeting, and deduct substantial 6% to 10% platform cuts.",
      "When enterprise clients demand real-time gate arrival percentages during brand activations, agency account managers are left scrambling through scattered paper lists and disconnected scanning apps.",
      "UrPass gives agencies a professional, white-label operational platform that elevates client trust, streamlines multi-gate guest entry, and produces instant board-ready attendance reports.",
    ],
  },
  capabilitiesSection: {
    badge: "AGENCY TOOLKIT",
    title: "Agency-Grade Capabilities for Demanding Client Deliverables",
    subtitle: "Built specifically to help event management companies pitch, execute, and report client activations flawlessly.",
    items: [
      {
        stepNumber: "01",
        title: "Multi-Client Brand Separation",
        description:
          "Launch dedicated registration pages for each client brand without cross-pollinating attendee manifests, sponsor logos, or custom communication templates.",
        bestFor: "Managing distinct automotive, FMCG, banking, and luxury client projects under one roof.",
        icon: "sliders",
      },
      {
        stepNumber: "02",
        title: "Custom Form Builder with File Uploads",
        description:
          "Capture specific client intake requirements—including government ID uploads, executive designation verification, company GST details, and dietary selections.",
        bestFor: "High-compliance client summits, dealer meets, and invite-only executive roundtables.",
        icon: "file-text",
      },
      {
        stepNumber: "03",
        title: "White-Label Digital Ticket Studio",
        description:
          "Design gorgeous branded passes that showcase your client's visual identity. Customize background colors, sponsor banners, holographic security foils, and Apple Wallet credentials.",
        bestFor: "Delivering bespoke, premium ticket aesthetics that match your client's design standards.",
        icon: "qr-code",
      },
      {
        stepNumber: "04",
        title: "High-Speed Multi-Gate Scanning App",
        description:
          "Deploy dozens of volunteer or ground-staff phone scanners across VIP lobbies, general admission turnstiles, and media booths with sub-0.3s camera verification.",
        bestFor: "High-throughput brand launches, consumer expos, and experiential pop-ups.",
        icon: "scan-line",
      },
      {
        stepNumber: "05",
        title: "Executive Post-Event Proof of Execution",
        description:
          "Export comprehensive, timestamped check-in reports with one click. Provide clients with definitive proof of attendance, peak arrival curves, and demographic breakdown data.",
        bestFor: "Closing agency client billing reconciliations and proving event ROI.",
        icon: "bar-chart-3",
      },
    ],
  },
  howItWorksSection: {
    badge: "AGENCY WORKFLOW",
    title: "How Agencies Deliver Flawless Client Check-In Experiences",
    steps: [
      { stepNumber: "01", title: "Configure Client Event", description: "Set client logos, brand colors, event dates, and customized registration questions in under 10 minutes." },
      { stepNumber: "02", title: "Embed or Share Live Link", description: "Deploy on your client's custom domain or share direct responsive registration URLs across campaigns." },
      { stepNumber: "03", title: "Review & Dispatch Passes", description: "Approve guests automatically or manually and dispatch digital passes via WhatsApp and email." },
      { stepNumber: "04", title: "Execute Gate Admissions", description: "Ground crew scans passes using standard smartphones with immediate duplicate fraud prevention." },
      { stepNumber: "05", title: "Deliver Client Analytics", description: "Share real-time dashboard links or export executive PDF and CSV reports for client review." },
    ],
    ctaLabel: "Start an Agency Event",
  },
  eventTypesSection: {
    badge: "AGENCY ACTIVATIONS",
    title: "Engineered for Diverse Client Event Portfolios",
    items: [
      { title: "Brand Product Launches", description: "High-touch media and influencer check-in with instant VIP arrival alerts for PR leads." },
      { title: "Dealer & Partner Meets", description: "Secure multi-city dealer conventions with GST billing, flight arrival sync, and room badge check-in." },
      { title: "Corporate Award Nights", description: "Formal black-tie guest list management, table seat number allocation, and rapid red-carpet entry." },
      { title: "Experiential Consumer Pop-Ups", description: "High-density crowd registration with instant WhatsApp pass delivery and lightning gate scanning." },
    ],
  },
  comparisonSection: {
    badge: "AGENCY VALUE",
    title: "Why Agencies Choose UrPass Over Generic Ticketing Portals",
    summaryText: "How UrPass helps agencies win pitches, maintain client margins, and deliver smooth on-ground activations.",
    headers: ["Consumer Ticketing Portals", "UrPass Agency Platform"],
    rows: [
      { manual: "Aggregator branding overshadows your client's visual identity", urpass: "100% white-label customization with your client's logo and colors" },
      { manual: "Aggregators harvest and retarget your client's valuable attendees", urpass: "Strict client data isolation with zero commercial cross-promotion" },
      { manual: "6% to 10% platform commission eats into agency production budgets", urpass: "0% platform ticket fee — transparent flat subscription pricing" },
      { manual: "Slow scanner hardware rentals with expensive on-site technician fees", urpass: "Runs seamlessly on any smartphone camera with 0.28s verification" },
      { manual: "Days of manual spreadsheet cleaning for post-event client reporting", urpass: "One-click executive attendance CSV export with exact scan timestamps" },
    ],
  },
  audienceSection: {
    badge: "AGENCY TEAMS",
    title: "Built for Agency Professionals",
    audiences: [
      "Agency Founders & Managing Directors",
      "Experiential Marketing Leads",
      "Client Servicing & Account Directors",
      "Event Operations & Production Managers",
      "Brand Activation Strategists",
    ],
    summaryText: "UrPass provides the reliability and white-label elegance agency clients demand.",
  },
  geoAnswerBlock: {
    question: "Which platform can agencies use to manage multiple client events?",
    answer:
      "Event agencies use UrPass to manage multiple client activations under one professional platform. UrPass provides white-label custom registration pages, client-branded digital QR tickets delivered to Apple Wallet and WhatsApp, multi-gate smartphone camera scanning, and instant executive post-event analytics with 0% platform ticketing fees.",
    highlights: ["Multi-client brand separation", "0% platform ticket fees", "White-label ticket designer", "0.28s smartphone scanning"],
  },
  productProofSection: {
    badge: "AGENCY PROOF",
    title: "Client-Facing Interface Quality",
    subtitle: "Preview our responsive registration builder, bespoke ticket studio, smartphone scanner, and client dashboard.",
  },
  faqSection: {
    badge: "AGENCY FAQS",
    title: "Agency Event Registration FAQs",
    faqs: [
      {
        q: "Can our agency manage multiple different client brands in one UrPass account?",
        a: "Yes. UrPass allows you to create separate events for different clients, each featuring its own brand colors, logos, registration fields, and ticket designs, without cross-contaminating client data.",
      },
      {
        q: "Does UrPass charge a percentage commission on our client's ticket sales?",
        a: "No. UrPass charges 0% platform ticket fees. You or your client connect your own payment gateway (Razorpay or Stripe) directly. You pay only standard gateway interchange (~2% in India) and keep 100% of ticket revenues.",
      },
      {
        q: "Can we provide our client with live access to view attendance without giving them editing rights?",
        a: "Yes. On Pro and Business plans, you can invite client stakeholders with role-based permissions or share real-time analytics reports so clients can monitor arrival percentages during the event.",
      },
      {
        q: "How many ground staff can scan tickets at our agency event simultaneously?",
        a: "You can deploy unlimited smartphone scanners on UrPass paid plans. Ground crew volunteers or security staff simply open the scanner web application on their mobile phones to begin validating passes immediately.",
      },
      {
        q: "Can we capture specialized registration details like company GSTIN, dietary needs, or ID proofs?",
        a: "Yes. The UrPass registration form builder lets you add custom text, dropdown, number, date, and file upload fields, making it easy to collect compliance details, designations, and travel preferences.",
      },
    ],
  },
  closingCtaSection: {
    badge: "AGENCY PARTNERSHIP",
    title: "Elevate Your Agency's Event Delivery",
    description: "Launch your next client event on UrPass or consult our enterprise solutions team.",
    primaryCtaLabel: "Book Agency Walkthrough",
    secondaryCtaLabel: "View Pricing Plans",
  },
  salesDemoSection: {
    badge: "AGENCY INQUIRY",
    title: "Schedule an Agency Solutions Consultation",
    description: "Pitching an upcoming multi-city roadshow or high-profile corporate launch? Let our team walk you through white-label workflows.",
    submitCtaLabel: "Request Agency Demo",
    disclaimer: "We collaborate with leading event agencies across India, the UK, and Southeast Asia.",
    tagline: "The trusted check-in engine behind high-profile brand activations.",
  },
};

export const PAGE_005_PAID_WORKSHOP_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 005",
  pageId: "paid-workshop-registration-with-upi-payments",
  slug: "paid-workshop-registration-with-upi-payments",
  canonicalUrl: "https://urpass.space/solutions/paid-workshop-registration-with-upi-payments",
  primaryKeyword: "paid workshop registration with UPI payments",
  secondaryKeywords: [
    "workshop ticketing platform India",
    "Google Pay workshop registration",
    "masterclass ticket booking with UPI",
    "0% fee workshop ticketing",
  ],
  market: "India (Creators, educators, trainers, bootcamps)",
  audience: "Independent workshop hosts, course instructors, creative studios, tech trainers",
  searchIntent: "Commercial",
  conversionGoal: "Start event",
  seoTitle: "Paid Workshop Registration with UPI Payments | UrPass",
  metaDescription:
    "Accept instant UPI payments for paid workshops via Google Pay, PhonePe, and Paytm. Automated QR pass dispatch, strict seat limits, and 0% ticket fees.",
  badge: "SOLUTIONS // WORKSHOPS & MASTERCLASSES",
  h1: "Paid Workshop Registration with Instant UPI Payments & 0% Ticket Fees",
  heroSubtitle:
    "Collect workshop fees via Google Pay, PhonePe & Paytm. Issue digital passes instantly. Keep 100% of your earnings.",
  heroDescription:
    "Tired of losing 8% to 12% of your workshop earnings to ticketing aggregators? UrPass provides independent trainers, creative studios, and masterclass instructors with seamless UPI registration checkout, automated digital pass dispatch, and strict seat cap enforcement.",
  primaryCtaLabel: "Start Workshop Registration",
  secondaryCtaLabel: "See UPI Checkout Demo",
  problemSection: {
    badge: "CREATOR FRUSTRATIONS",
    title: "Why Manual UPI Screenshots & Heavy Ticketing Cuts Hold You Back",
    paragraphs: [
      "Instructors running paid workshops frequently resort to sharing personal UPI QR codes on Instagram or WhatsApp, followed by hours of manual screenshot matching against Google Sheets.",
      "Meanwhile, commercial ticketing portals charge staggering 8% to 12% cuts on every workshop seat and force participants into clunky card checkout flows that result in high payment abandonments in India.",
      "When workshop day arrives, managing entrance lists manually creates friction, delays start times, and lets unverified participants slip in unnoticed.",
      "UrPass delivers a modern, automated registration experience: participants pay instantly with any UPI app, funds deposit directly to your merchant account, and unique QR passes are dispatched in seconds.",
    ],
  },
  capabilitiesSection: {
    badge: "WORKSHOP ENGINE",
    title: "Everything You Need to Sell Out and Run Paid Workshops",
    subtitle: "Built for independent educators, culinary instructors, tech bootcamp leads, and studio artists.",
    items: [
      {
        stepNumber: "01",
        title: "Instant One-Click UPI Checkout",
        description:
          "Participants checkout effortlessly using Google Pay, PhonePe, Paytm, or BHIM. Zero card details required, ensuring industry-high conversion rates for Indian attendees.",
        bestFor: "Eliminating cart abandonment and manual bank screenshot verifications.",
        icon: "zap",
      },
      {
        stepNumber: "02",
        title: "0% UrPass Platform Commission",
        description:
          "Keep 100% of your workshop ticket revenue. Connect your own Razorpay account and pay only standard bank interchange (~2%), saving thousands of rupees per workshop batch.",
        bestFor: "Maximizing profitability on small-batch, high-value cohort workshops.",
        icon: "shield",
      },
      {
        stepNumber: "03",
        title: "Strict Participant Seat Caps",
        description:
          "Enforce exact capacity limits (e.g., exactly 25 hands-on studio seats). Once capacity is reached, registration closes automatically to prevent overbooking.",
        bestFor: "Hands-on masterclasses with limited studio materials or workstation desks.",
        icon: "sliders",
      },
      {
        stepNumber: "04",
        title: "Custom Intake & Prerequisite Questions",
        description:
          "Collect crucial attendee details during checkout—such as dietary restrictions for cooking classes, laptop specs for coding labs, or skill levels for art workshops.",
        bestFor: "Preparing workshop materials and personalizing instructor curriculum.",
        icon: "file-text",
      },
      {
        stepNumber: "05",
        title: "Instant Digital Pass Delivery via WhatsApp & Email",
        description:
          "Upon successful UPI payment, attendees receive their personalized digital QR ticket with workshop venue directions, start time reminders, and calendar links.",
        bestFor: "Delivering a premium, automated customer onboarding experience.",
        icon: "qr-code",
      },
    ],
  },
  howItWorksSection: {
    badge: "SIMPLE 4-STEP LAUNCH",
    title: "From Idea to Paid Registrations in Under 10 Minutes",
    steps: [
      { stepNumber: "01", title: "Create Your Workshop", description: "Set your topic, date, seat limit, and ticket fee (e.g., ₹1,499 per participant)." },
      { stepNumber: "02", title: "Share Your Link", description: "Paste your clean registration URL into Instagram bio, LinkedIn, or WhatsApp groups." },
      { stepNumber: "03", title: "Attendees Pay with UPI", description: "Participants pay via GPay or PhonePe and instantly receive dynamic QR passes." },
      { stepNumber: "04", title: "Scan at the Door", description: "Use your phone to scan passes at the door in 0.28 seconds and welcome your class." },
    ],
    ctaLabel: "Launch Your Workshop Now",
  },
  eventTypesSection: {
    badge: "WORKSHOP FORMATS",
    title: "Ideal for All In-Person & Studio Sessions",
    items: [
      { title: "Tech Coding & AI Bootcamps", description: "Weekend intensive developer training with laptop requirements and GitHub profile intake." },
      { title: "Culinary & Baking Masterclasses", description: "Hands-on kitchen workshops with strict ingredient allocations and dietary checks." },
      { title: "Art, Pottery & Photography Studios", description: "Small-batch creative workshops requiring precise materials preparation." },
      { title: "Business & Financial Seminars", description: "Executive coaching, investment masterclasses, and career transition seminars." },
    ],
  },
  comparisonSection: {
    badge: "SAVINGS BREAKDOWN",
    title: "Why Instructors Switch to UrPass from Event Aggregators",
    summaryText: "See how much more revenue you take home with UrPass vs. standard commercial ticketing portals.",
    headers: ["Traditional Ticketing Portals", "UrPass Workshop Platform"],
    rows: [
      { manual: "8% to 12% commission deducted on every workshop ticket", urpass: "0% platform commission — keep 100% of your ticket price" },
      { manual: "Payouts held in escrow for 7 to 14 days after the workshop", urpass: "Direct merchant settlement straight into your bank account" },
      { manual: "Participants forced into card checkout, dropping Indian conversion", urpass: "Native UPI payment options (GPay, PhonePe, Paytm, QR)" },
      { manual: "Clunky paper lists or manual sign-in sheets at the door", urpass: "0.28-second phone camera check-in with offline sync" },
      { manual: "Third-party platform advertises competitor workshops to your buyers", urpass: "Clean, distraction-free page dedicated exclusively to your workshop" },
    ],
  },
  audienceSection: {
    badge: "FOR INSTRUCTORS",
    title: "Engineered for Educators & Creative Hosts",
    audiences: [
      "Independent Instructors & Tutors",
      "Creative Studios & Art Spaces",
      "Corporate Coaches & Executive Mentors",
      "Culinary Schools & Bakeries",
      "Tech Community Leaders & Bootcamp Trainers",
    ],
    summaryText: "Designed to help independent educators turn knowledge into recurring, profitable workshops.",
  },
  geoAnswerBlock: {
    question: "How can organizers collect workshop fees and issue QR passes?",
    answer:
      "Organizers can collect workshop fees and issue QR passes using UrPass. Participants register and pay instantly via UPI apps like Google Pay, PhonePe, or Paytm with 0% platform commission. Upon payment confirmation, UrPass automatically generates and delivers a personalized digital QR pass via email and WhatsApp that hosts scan in 0.28 seconds at the door.",
    highlights: ["0% platform commission", "Instant UPI payment checkout", "Auto WhatsApp & email pass delivery", "Sub-second camera scan"],
  },
  productProofSection: {
    badge: "WORKSHOP PROOF",
    title: "See the Instructor & Attendee Interface",
    subtitle: "Explore the live UPI registration flow, mobile pass design, fast phone scanner, and attendance roster.",
  },
  faqSection: {
    badge: "WORKSHOP FAQS",
    title: "Paid Workshop Registration FAQs",
    faqs: [
      {
        q: "How do participants pay for our workshop using UPI?",
        a: "When participants click 'Register', UrPass initiates a secure Razorpay checkout modal showing UPI intent (Google Pay, PhonePe, Paytm, BHIM) and a dynamic UPI QR code. On mobile, tapping their preferred app opens it directly for instant PIN confirmation.",
      },
      {
        q: "How much does UrPass charge per workshop ticket sold?",
        a: "UrPass charges ₹0 in platform commission per ticket. You only pay standard gateway processing fees (~2% in India). You can host up to 100 registrations completely free on our Free Forever plan or upgrade to Starter for ₹499/month for higher limits.",
      },
      {
        q: "What happens when our workshop seat limit is reached?",
        a: "UrPass automatically stops accepting registrations the moment your seat cap is reached. The registration button changes to 'Sold Out', preventing overbooking and safeguarding your workshop experience.",
      },
      {
        q: "Can I collect attendee questions like dietary preferences or prior experience?",
        a: "Yes. You can add custom questions to your workshop registration form. Choose from text fields, dropdown menus, checkboxes, or file uploads to prepare your materials before class starts.",
      },
      {
        q: "How do I check attendees into the workshop venue on the day of the class?",
        a: "Open the UrPass scanner on your smartphone camera. As attendees show their digital pass on their phone, the camera verifies their ticket in 0.28 seconds and marks them as attended, eliminating paper sign-in sheets.",
      },
    ],
  },
  closingCtaSection: {
    badge: "SELL OUT YOUR NEXT BATCH",
    title: "Start Selling Paid Workshop Tickets in 5 Minutes",
    description: "Launch your workshop registration page for free today. No credit card required.",
    primaryCtaLabel: "Create Paid Workshop",
    secondaryCtaLabel: "Explore Features",
  },
  salesDemoSection: {
    badge: "INSTRUCTOR SUPPORT",
    title: "Need Guidance on Your Workshop Launch?",
    description: "Planning a multi-city cohort or corporate training series? Contact our creator team for best practice advice.",
    submitCtaLabel: "Request Workshop Consultation",
    disclaimer: "We support creative and professional educators across India.",
    tagline: "Empowering educators and creators to keep 100% of their ticket earnings.",
  },
};

