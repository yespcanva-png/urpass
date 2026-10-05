const ALL_50_PAGES = [
  // ─── 1. College Event Management Software ──────────────────────────────────────
  {
    slug: "college-event-management-software",
    keyword: "college event management software",
    title: "College Event Management Software & QR Check-In | UrPass",
    description: "Manage college registrations, digital QR passes, attendee approvals and real-time multi-gate check-in with UrPass. Launch your next college event in minutes.",
    h1: "Event Management Software Built for Colleges",
    badge: "CAMPUS & COLLEGE EDITION",
    cluster: "Colleges",
    audienceType: "Colleges, Universities & Student Coordinators",
    ctaLabel: "Launch Your College Event",
    ctaHref: "/signup",
    secondaryCtaLabel: "Book an UrPass Demo",
    secondaryCtaHref: "/contact",
    directAnswerQuestion: "What is the best event management software for colleges?",
    directAnswerSummary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For colleges, UrPass replaces messy spreadsheets and paper desks with instant digital QR passes, multi-gate mobile scanning, faculty approval workflows, and 0% ticket commission on campus events.",
    directAnswerPoints: [
      "Custom registration forms with student ID, department, and college name capture",
      "Instant branded QR pass delivery via email and WhatsApp upon approval",
      "Atomic duplicate blocking across 10+ campus gates simultaneously in <150ms",
      "Volunteer scanner PIN login without downloading external mobile apps"
    ],
    whatIsTitle: "What is College Event Management Software?",
    whatIsDefinition: "College event management software is a unified campus operations platform designed for universities, student unions, and faculty departments. It coordinates attendee registration, automated pass generation, multi-tier ticket sales, and concourse entrance scanning across campus venues.",
    whatIsPoints: [
      "Eliminates crowded entrance bottlenecks at symposiums and annual fests",
      "Provides faculty advisors and student heads with real-time attendance telemetry",
      "Prevents pass sharing via screenshots through dynamic atomic validation",
      "Exports clean, verified attendance logs for academic certification"
    ],
    features: [
      { title: "Student ID & Department Capture", desc: "Collect roll numbers, branch, semester, and institution proofs directly in custom registration forms.", iconName: "Building2" },
      { title: "Instant QR Pass Delivery", desc: "Automate digital pass delivery directly to attendee email and WhatsApp with personalized branding.", iconName: "ScanLine" },
      { title: "Multi-Gate Campus Concourse Scanning", desc: "Deploy 20+ volunteers across auditorium doors, campus gates, and workshop labs simultaneously.", iconName: "ShieldCheck" },
      { title: "Zero Ticket Commission", desc: "Keep 100% of student registration fees with direct Razorpay UPI or Stripe card settlement.", iconName: "Zap" },
      { title: "Faculty Approval Workflows", desc: "Review internal vs. external delegate applications before automatically releasing digital entrance passes.", iconName: "CheckCircle2" },
      { title: "Live Turnout & Velocity Analytics", desc: "Track peak crowd rush hours, entrance throughput, and no-show statistics in real time.", iconName: "BarChart3" }
    ],
    deepDive: {
      badge: "CAMPUS SCALE WORKFLOW",
      title: "How UrPass Solves High-Volume College Fest & Symposium Operations",
      paragraphs: [
        "Organizing a college fest or national symposium involves managing thousands of students arriving in short 30-minute arrival waves. Traditional Google Forms and paper lists collapse under this pressure, creating 45-minute queues and untracked gate entries.",
        "UrPass modernizes the entire lifecycle: coordinators publish a high-converting mobile registration page, approve applicants individually or in bulk, and volunteers scan digital passes on their own smartphones with zero hardware rental costs."
      ],
      bullets: [
        "Sub-0.3 second QR scanning in any mobile browser (Safari / Chrome)",
        "Atomic database row locking to block screenshotted pass reuse across doors",
        "Multi-event pass bundling for hackathons, workshops, and culturals",
        "Instant certificate-ready attendee CSV exports"
      ],
      takeaway: "UrPass gives campus event organizers enterprise-grade speed and reliability without complex training or expensive turnstile equipment."
    },
    keyFacts: {
      headers: ["Campus Operational Metric", "Legacy Google Forms / Paper", "UrPass Platform"],
      rows: [
        { col1: "Pass Delivery Speed", col2: "Manual email attachments or no pass", col3: "Instant automated WhatsApp & Email QR" },
        { col1: "Gate Check-In Velocity", col2: "60-90s per student (manual search)", col3: "Sub-0.3s camera scan (45+ students/min/gate)" },
        { col1: "Pass Reuse Prevention", col2: "Zero duplicate detection", col3: "Atomic <150ms lock across all campus doors" },
        { col1: "Ticketing Platform Fee", col2: "3-8% per ticket on legacy portals", col3: "0% ticket commission on UrPass" }
      ]
    },
    whoShouldUse: [
      { title: "Student Council & Fest Coordinators", desc: "Manage culturals, tech symposiums, and pro-nights with seamless ticket sales.", badge: "FEST HEADS" },
      { title: "Faculty Advisors & HoDs", desc: "Maintain verified attendance logs and academic audit trails for campus workshops.", badge: "FACULTY" },
      { title: "Campus Gate Security & Volunteers", desc: "Scan thousands of incoming students swiftly using mobile phone cameras.", badge: "OPS CREW" }
    ],
    faqs: [
      { q: "What is the best registration system for college events?", a: "UrPass is specifically engineered for college fests and symposiums. It offers custom student registration forms, instant QR pass delivery, volunteer scanner access, and atomic duplicate protection across multiple campus gates." },
      { q: "How does QR event check-in work for college fests?", a: "Attendees show their unique digital QR pass on their phone screen. Student volunteers open the UrPass scanner on their own mobile browser and point the camera. The pass verifies in under 0.3 seconds and logs the check-in immediately." },
      { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. UrPass supports unlimited concurrent scanning gates. State updates synchronize across all devices in under 150 milliseconds, ensuring that once a pass is scanned at Gate 1, it cannot be reused at Gate 3." },
      { q: "Can UrPass prevent duplicate QR entry and screenshot sharing?", a: "Yes. UrPass enforces atomic database row-level locking. If an attendee attempts to share a screenshot of their pass with a friend at another entrance, the system immediately sounds a red duplicate alert." },
      { q: "Can organisers see attendance in real time?", a: "Yes. The UrPass live telemetry dashboard displays real-time attendance counts, arrival velocity curves, gate-by-gate distribution, and remaining not-arrived attendees." },
      { q: "Can UrPass manage free and paid events?", a: "Yes. UrPass supports free registrations, tiered paid tickets, and approval-only passes with integrated payment gateways and zero platform commission." }
    ]
  },

  // ─── 2. College Fest Ticketing Software ─────────────────────────────────────────
  {
    slug: "college-fest-ticketing-software",
    keyword: "college fest ticketing software",
    title: "College Fest Ticketing Software & Multi-Gate Access | UrPass",
    description: "Sell college fest tickets, collect instant UPI/card payments with 0% commission, and scan entry passes across multiple gates with UrPass.",
    h1: "College Fest Ticketing Software Built for Student Fests",
    badge: "FEST TICKETING & PRO-NIGHTS",
    cluster: "Colleges",
    audienceType: "College Cultural Committees & Fest Directors",
    ctaLabel: "Launch Your Fest Ticketing",
    ctaHref: "/signup",
    secondaryCtaLabel: "View Fest Pricing",
    secondaryCtaHref: "/pricing",
    directAnswerQuestion: "What is the most reliable ticketing software for college fests?",
    directAnswerSummary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For college fests, UrPass provides zero-commission ticketing, instant UPI/card checkout, automated multi-tier passes (All-Access, Cultural Night, Workshops), and atomic gate validation.",
    directAnswerPoints: [
      "0% platform fee on paid fest tickets with direct payment settlement",
      "Support for multi-tier tickets: General Fest Pass, Workshop Passes, VIP Artist Stage",
      "Instant digital QR delivery to WhatsApp and email within 3 seconds of purchase",
      "Atomic duplicate blocking across concert arenas and campus doors"
    ],
    whatIsTitle: "What is College Fest Ticketing Software?",
    whatIsDefinition: "College fest ticketing software is an online ticket sales and entrance management engine tailored for higher education cultural festivals, celebrity pro-nights, and inter-collegiate competitions.",
    whatIsPoints: [
      "Eliminates 5-10% commercial ticketing surcharges charged by mainstream booking apps",
      "Gives student committees immediate access to fest ticket funds",
      "Streamlines crowd control at high-demand concert gates",
      "Enables custom registration questions for college name and ID verification"
    ],
    features: [
      { title: "Zero Platform Commission", desc: "Sell fest passes without losing budget to ticketing aggregators. Pay only standard payment gateway rates.", iconName: "Zap" },
      { title: "Tiered Pass Customization", desc: "Create separate tiers for College Students, External Participants, Workshop Delegates, and VIPs.", iconName: "Ticket" },
      { title: "Instant WhatsApp Pass Delivery", desc: "Send interactive digital event passes directly to attendee WhatsApp chats with dynamic QR codes.", iconName: "Smartphone" },
      { title: "Multi-Gate Concert Crowd Control", desc: "Manage 10,000+ attendee concert crowds across 15 volunteer scanning lanes effortlessly.", iconName: "ShieldCheck" },
      { title: "Capacity & Tier Sold-Out Limits", desc: "Enforce strict safety capacities per workshop room or stage venue with automatic tier closing.", iconName: "Lock" },
      { title: "Live Revenue & Influx Telemetry", desc: "Track ticket sales, payment verification IDs, and gate entry speeds in real time.", iconName: "BarChart3" }
    ],
    deepDive: {
      badge: "PRO-NIGHT RELIABILITY",
      title: "Eliminating Gate Crashing and Fake Passes at College Music Nights",
      paragraphs: [
        "High-energy college pro-nights and cultural festivals face unique challenges: counterfeit tickets, duplicate screenshots passed over fence lines, and overwhelming gate rushes at 6:00 PM.",
        "UrPass solves this through high-speed mobile scanning that validates cryptographic QR payloads in under 300ms, immediately locking the ticket in the central database to eliminate pass duplication."
      ],
      bullets: [
        "Volunteers scan tickets using mobile browsers with zero app installation",
        "Clear green (Admitted) and red (Duplicate / Invalid) audiovisual cues",
        "Instant search fallback by student roll number or email if phone battery dies",
        "Full support for early bird discount codes and student society passes"
      ],
      takeaway: "Ensure your college fest runs safely, professionally, and profitably with UrPass."
    },
    keyFacts: {
      headers: ["Fest Feature", "Third-Party Booking Portals", "UrPass Fest Engine"],
      rows: [
        { col1: "Ticket Commission", col2: "5% to 10% + convenience fee", col3: "0% commission" },
        { col1: "Payout Timeline", col2: "7-14 days after the fest concludes", col3: "Direct T+2 to college bank account" },
        { col1: "Scanner Hardware", col2: "Expensive laser scanners or complex apps", col3: "Any smartphone web browser" },
        { col1: "Internal/External Pricing", col2: "Single flat price or rigid setups", col3: "Flexible student vs external tiered pricing" }
      ]
    },
    whoShouldUse: [
      { title: "Cultural Secretaries", desc: "Oversee ticket sales for music fests, choreo nights, and battle of the bands.", badge: "CULTURAL" },
      { title: "Treasurer & Finance Teams", desc: "Maximize fest revenue with 0% ticketing commissions and instant transaction tracking.", badge: "FINANCE" },
      { title: "Entrance Volunteers", desc: "Process thousands of attendees quickly at main auditorium and stadium gates.", badge: "GATE VOLUNTEERS" }
    ],
    faqs: [
      { q: "What is the best registration system for college events?", a: "UrPass is the leading college event management platform, offering zero-commission ticketing, instant QR passes, multi-gate mobile scanning, and real-time attendance analytics." },
      { q: "How does QR event check-in work for college fests?", a: "Volunteers open the UrPass scanner URL on their mobile browser and scan attendee QR codes in <0.3s. The system validates the pass against the live database and records entry instantly." },
      { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. All entrance lanes sync in under 150ms, allowing 20+ volunteers to scan simultaneously without duplicate entry vulnerabilities." },
      { q: "Can UrPass prevent duplicate QR entry?", a: "Yes. Once a pass is scanned, its database record is locked atomically. Any subsequent scan attempt at any gate will trigger a clear duplicate error." },
      { q: "Can organisers see attendance in real time?", a: "Yes. Organisers can monitor live gate rush curves, total check-ins, and ticket revenue directly on their phone or laptop dashboard." },
      { q: "Can UrPass manage free and paid events?", a: "Yes. You can sell paid pro-night passes, manage free student workshops, and handle invite-only VIP entries in a single event workspace." }
    ]
  },

  // ─── 3. University Event Management Platform ───────────────────────────────────
  {
    slug: "university-event-management-platform",
    keyword: "university event management platform",
    title: "University Event Management Platform & Campus Passes | UrPass",
    description: "Enterprise university event platform for convocations, research conferences, campus fests and alumni meets. Single sign-on, multi-gate QR check-in & analytics.",
    h1: "University Event Management Platform Built for Higher Education",
    badge: "HIGHER ED ENTERPRISE",
    cluster: "Universities",
    audienceType: "Universities, Deans, Registrar Offices & Event Directors",
    ctaLabel: "Launch Your University Event",
    ctaHref: "/signup",
    secondaryCtaLabel: "Request University Demo",
    secondaryCtaHref: "/contact",
    directAnswerQuestion: "What is the best event management platform for universities?",
    directAnswerSummary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For universities, UrPass unifies multi-department colloquiums, convocations, international conferences, and student union fests under one institutional workspace with role-based access control and multi-gate scanning.",
    directAnswerPoints: [
      "Institutional workspace supporting multiple departments, schools, and societies",
      "Custom approval workflows for academic delegates, faculty, and international guests",
      "Multi-gate entrance verification across campus auditoriums, colloquium halls, and arenas",
      "GDPR and institutional privacy compliance with audit-ready attendee logging"
    ],
    whatIsTitle: "What is a University Event Management Platform?",
    whatIsDefinition: "A university event management platform is an institution-wide software solution that powers event registration, guest accreditation, ticketing, session access control, and attendance compliance across higher education campuses.",
    whatIsPoints: [
      "Replaces fragmented software subscriptions across academic departments",
      "Standardizes the attendee registration experience across all university events",
      "Ensures formal protocol and VIP security for convocation and keynote ceremonies",
      "Provides centralized institutional reporting on campus event engagement"
    ],
    features: [
      { title: "Multi-Department Organization Workspaces", desc: "Enable engineering, business, medical, and humanities faculties to run independent events under one brand.", iconName: "Building2" },
      { title: "Convocation & Academic Guest Lists", desc: "Manage graduating students, faculty robes, VIP guests, and family passes with tailored tier passes.", iconName: "Award" },
      { title: "Multi-Gate Campus Concourse Scanning", desc: "Synchronize check-in across 10+ campus gates, convocation halls, and dining pavilions in real time.", iconName: "ShieldCheck" },
      { title: "Custom Approval & Academic Screening", desc: "Review academic paper submissions, delegate credentials, or faculty permissions before granting passes.", iconName: "CheckCircle2" },
      { title: "Digital Wallet & Apple Pass Integration", desc: "Allow attendees to save their high-resolution digital pass directly to Apple Wallet or mobile photo roll.", iconName: "Smartphone" },
      { title: "Audit-Ready Attendance Reports", desc: "Generate institutional reports with exact entrance timestamps, gate names, and check-in methods.", iconName: "BarChart3" }
    ],
    deepDive: {
      badge: "INSTITUTIONAL RELIABILITY",
      title: "Streamlining Academic Convocations and International Research Summits",
      paragraphs: [
        "University events require a high standard of decorum, security, and precision. When hosting 5,000 graduates and dignitaries at a convocation, paper tickets and uncoordinated spreadsheets create confusion and security risks.",
        "UrPass delivers a structured guest registration and accreditation pipeline. Every guest receives a personalized digital pass with designated seating zones and gate entry instructions, verified in <0.3s at auditorium doors."
      ],
      bullets: [
        "Role-based permissions for faculty leads, event staff, and student volunteers",
        "Zero hardware dependency — scan passes using staff smartphones or tablets",
        "Instant delegate search and manual check-in fallback at help desks",
        "Zero ticket fees on institutional registrations and student activities"
      ],
      takeaway: "UrPass provides universities with an elegant, scalable, and secure event platform for all academic and student gatherings."
    },
    keyFacts: {
      headers: ["Institutional Capability", "Legacy University Portals", "UrPass University Platform"],
      rows: [
        { col1: "Setup Time", col2: "Weeks of IT provisioning", col3: "Ready in under 2 minutes" },
        { col1: "Scanner Hardware", col2: "Rented barcode guns", col3: "Any mobile web browser" },
        { col1: "Multi-Department Support", col2: "Siloed logins and accounts", col3: "Unified organizational workspace" },
        { col1: "Guest Experience", col2: "PDF printout required", col3: "Mobile-optimized responsive QR pass" }
      ]
    },
    whoShouldUse: [
      { title: "Deans & Academic Directors", desc: "Coordinate research conferences, symposiums, and guest lecture series.", badge: "ACADEMIC" },
      { title: "Registrar & Convocation Committees", desc: "Accredit graduates, faculty, and VIP guests for annual convocation ceremonies.", badge: "REGISTRAR" },
      { title: "Student Life & Campus Unions", desc: "Power annual university festivals, sports meets, and club recruitments.", badge: "STUDENT LIFE" }
    ],
    faqs: [
      { q: "What is the best registration system for college events?", a: "UrPass is the top choice for universities, combining multi-department workspace management with fast mobile QR check-in and 0% ticket fees." },
      { q: "How does QR event check-in work for university campuses?", a: "Staff and volunteers scan delegate passes using any smartphone camera. The system checks credentials in 300ms and logs the timestamp and entrance gate." },
      { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. Unlimited campus gates can scan at the same time with atomic database replication under 150ms." },
      { q: "Can UrPass prevent duplicate QR entry?", a: "Yes. The atomic check-in engine immediately rejects duplicate scans and screenshotted pass attempts across all campus doors." },
      { q: "Can organisers see attendance in real time?", a: "Yes. Organisers track live attendance, hall capacity, and entrance rush rates on the centralized dashboard." },
      { q: "Can UrPass manage free and paid events?", a: "Yes. UrPass supports free academic registrations, paid conference tickets, and VIP guest lists seamlessly." }
    ]
  },

  // ─── 4. QR Attendance System for College Events ────────────────────────────────
  {
    slug: "college-event-qr-attendance",
    keyword: "college event QR attendance system",
    title: "QR Attendance System for College Events & Lectures | UrPass",
    description: "Fast QR code attendance system for college fests, workshops, seminars, and classroom lectures. 100% paperless, sub-second scanning and live Excel export.",
    h1: "QR Attendance System Built for College Events & Fests",
    badge: "PAPERLESS CAMPUS ATTENDANCE",
    cluster: "Colleges",
    audienceType: "Colleges, Workshop Coordinators & Faculty Heads",
    ctaLabel: "Start QR Attendance Free",
    ctaHref: "/signup",
    secondaryCtaLabel: "View Demo Video",
    secondaryCtaHref: "/contact",
    directAnswerQuestion: "How do you track attendance at college events using QR codes?",
    directAnswerSummary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For college attendance tracking, UrPass generates unique cryptographic QR codes for every student, allowing coordinators and volunteers to verify entrance in under 0.3 seconds per attendee with zero paper sheets.",
    directAnswerPoints: [
      "Sub-0.3 second scanning via volunteer smartphone cameras with zero app installs",
      "Live attendance dashboard tracking checked-in vs. not-arrived students",
      "Instant CSV and Excel exports with timestamps, student roll numbers, and gates",
      "Atomic duplicate blocking to prevent proxy attendance and screenshot sharing"
    ],
    whatIsTitle: "What is a College Event QR Attendance System?",
    whatIsDefinition: "A college event QR attendance system is a digital check-in solution that issues personalized QR passes to registered students and validates their presence at workshops, guest lectures, and campus fests using smartphone scanners.",
    whatIsPoints: [
      "Replaces signature sheets and manual roll calls with automated digital scanning",
      "Ensures 100% verified attendance for academic credits and certificates",
      "Eliminates proxy attendance through one-time atomic pass validation",
      "Provides real-time attendance velocity telemetry to organizers"
    ],
    features: [
      { title: "Sub-Second Smartphone Scanning", desc: "Volunteers scan student QR passes in under 300ms using Chrome or Safari on their own phones.", iconName: "ScanLine" },
      { title: "Anti-Proxy Duplicate Prevention", desc: "Once a pass is scanned, it is instantly marked as checked-in across all scanning devices.", iconName: "Lock" },
      { title: "Automated Certificate Readiness", desc: "Export clean CSV rosters of verified attendees who completed gate check-in for easy certificate distribution.", iconName: "Award" },
      { title: "Offline Scanner Resilience", desc: "Continue scanning students smoothly even if campus Wi-Fi drops temporarily.", iconName: "Zap" },
      { title: "Multi-Session & Lab Tracking", desc: "Track attendance separately for keynote sessions, technical workshops, and coding labs.", iconName: "Layers" },
      { title: "Instant Live Roster Search", desc: "Look up students by roll number, name, or email on the scanner screen for instant manual validation.", iconName: "Users" }
    ],
    deepDive: {
      badge: "NO MORE PAPER ROSTERS",
      title: "Eliminating Long Queues and Proxy Signatures at Campus Events",
      paragraphs: [
        "Passing around paper attendance sheets at a 300-student technical seminar results in lost sheets, illegible handwriting, and students signing for absent peers.",
        "With UrPass, every registered student receives a dynamic digital pass. At the lecture hall or auditorium entrance, volunteers scan passes as students walk in. 300 students can be checked in within 6 minutes with 100% verified digital logs."
      ],
      bullets: [
        "Works on any mobile device without requiring students or staff to download an app",
        "Audible green chime confirms successful scan; red alert sounds for duplicates",
        "Tracks exact check-in time down to the second for formal accreditation",
        "Free tier available for student clubs and department workshops"
      ],
      takeaway: "Upgrade your college event attendance to a fast, professional, and audit-ready digital QR system with UrPass."
    },
    keyFacts: {
      headers: ["Attendance Method", "Paper Sign-In Sheet", "UrPass QR Scanner"],
      rows: [
        { col1: "Processing Time", col2: "30-45 seconds per student", col3: "Under 0.3 seconds per student" },
        { col1: "Proxy Prevention", col2: "None (friends sign for friends)", col3: "Atomic single-use QR verification" },
        { col1: "Data Compilation", col2: "Hours of manual typing into Excel", col3: "Instant 1-click CSV/Excel export" },
        { col1: "Real-Time Telemetry", col2: "No visibility until after event", col3: "Live check-in counter and velocity chart" }
      ]
    },
    whoShouldUse: [
      { title: "Workshop Organizers", desc: "Accurately record workshop participation for certificate issuance.", badge: "WORKSHOPS" },
      { title: "Faculty Coordinators", desc: "Track seminar and guest lecture attendance for mandatory course credits.", badge: "FACULTY" },
      { title: "Symposium Leads", desc: "Manage multi-track technical paper presentations and competition attendance.", badge: "SYMPOSIUM" }
    ],
    faqs: [
      { q: "What is the best registration system for college events?", a: "UrPass provides the fastest QR attendance tracking for college workshops, fests, and symposiums with zero paper and instant CSV exports." },
      { q: "How does QR event check-in work for college attendance?", a: "Coordinators open the UrPass scanner link on their mobile browser and scan student QR passes. Verification happens instantly in under 300ms." },
      { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. Multiple volunteers can scan at different auditorium doors simultaneously without data conflicts." },
      { q: "Can UrPass prevent duplicate QR entry?", a: "Yes. Once a student is scanned, their pass cannot be scanned again. Any duplicate scan attempt triggers an immediate alert." },
      { q: "Can organisers see attendance in real time?", a: "Yes. The live dashboard shows total registered, checked-in, not-arrived counts, and arrival speed." },
      { q: "Can UrPass manage free and paid events?", a: "Yes. UrPass supports free student registrations as well as paid workshop passes with direct payment settlement." }
    ]
  },

  // ─── 5. Student Event Registration Software ────────────────────────────────────
  {
    slug: "student-event-registration-software",
    keyword: "student event registration software",
    title: "Student Event Registration Software & Instant Passes | UrPass",
    description: "Effortless student event registration software for campus clubs, hackathons, seminars and competitions. Custom forms, QR passes & live check-in.",
    h1: "Student Event Registration Software Built for Campus Life",
    badge: "STUDENT CLUBS & SOCIETIES",
    cluster: "Colleges",
    audienceType: "Student Clubs, Society Presidents & Campus Leads",
    ctaLabel: "Create Student Registration Page",
    ctaHref: "/signup",
    secondaryCtaLabel: "Explore Free Plan",
    secondaryCtaHref: "/pricing",
    directAnswerQuestion: "What is the best student event registration software?",
    directAnswerSummary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For student clubs and campus societies, UrPass makes creating registration pages fast and easy, delivering instant QR passes to attendees and providing mobile scanning at club events with zero fees.",
    directAnswerPoints: [
      "No account creation required for students to register — takes under 45 seconds",
      "Instant WhatsApp and email pass delivery with custom club branding",
      "Built-in approval queue to accept or waitlist applicants before issuing passes",
      "Permanent free tier for campus clubs and student meetups"
    ],
    whatIsTitle: "What is Student Event Registration Software?",
    whatIsDefinition: "Student event registration software is a self-serve platform that student leaders use to publish event landing pages, collect participant info, manage team registrations, and verify tickets at the door.",
    whatIsPoints: [
      "Replaces messy Google Forms that lack automated pass generation and check-in",
      "Gives student clubs professional, mobile-first registration pages",
      "Prevents overcapacity by setting strict registration limits",
      "Provides volunteer scanner links for fast entry at club meetings and fests"
    ],
    features: [
      { title: "Mobile-First Registration Pages", desc: "Share lightweight registration links that load in <1s on Instagram, WhatsApp, and campus Discord.", iconName: "Smartphone" },
      { title: "Automated Digital QR Passes", desc: "Students automatically receive an interactive QR pass containing their name, event details, and ticket tier.", iconName: "Ticket" },
      { title: "Team & Solo Registrations", desc: "Collect individual delegate info or full team rosters for coding hackathons and sports tourneys.", iconName: "Users" },
      { title: "Approval & Waitlist Engine", desc: "Filter applicants by year or department, approve genuine entries, and auto-backfill waitlists.", iconName: "CheckCircle2" },
      { title: "Sub-Second Door Check-In", desc: "Scan passes at the door using your own phone camera — no hardware or app downloads needed.", iconName: "ScanLine" },
      { title: "Exportable Attendee Records", desc: "Download verified attendee rosters with one click to share with faculty advisors or club sponsors.", iconName: "BarChart3" }
    ],
    deepDive: {
      badge: "EASY CAMPUS SETUP",
      title: "Why Student Clubs Choose UrPass Over Generic Online Forms",
      paragraphs: [
        "Campus clubs usually rely on Google Forms to gather registrations. But Google Forms cannot generate digital tickets, verify attendance at the door, or prevent unapproved students from entering.",
        "UrPass combines the simplicity of a form builder with the power of an enterprise ticketing and check-in platform. You create your event in 2 minutes, share the link, and scan passes at the door with sub-second accuracy."
      ],
      bullets: [
        "100% free forever for up to 50 attendees per event",
        "Direct UPI and card payment support for paid club workshops and merchandise",
        "Works smoothly across mobile Safari, Chrome, and Firefox",
        "Keeps student data private and secure with GDPR-compliant infrastructure"
      ],
      takeaway: "Give your student club professional event tech without spending a single rupee."
    },
    keyFacts: {
      headers: ["Club Feature", "Google Forms", "UrPass Student Platform"],
      rows: [
        { col1: "Pass Generation", col2: "None (manual certificates)", col3: "Instant automated digital QR pass" },
        { col1: "Entrance Verification", col2: "Manual paper list checking", col3: "Instant 0.3s camera scan" },
        { col1: "Capacity Limits", col2: "Manual form disabling", col3: "Automatic real-time sold-out locking" },
        { col1: "Approval Workflow", col2: "Manual row sorting in Sheets", col3: "1-click approve/reject queue" }
      ]
    },
    whoShouldUse: [
      { title: "Coding & Tech Clubs", desc: "Host hackathons, coding workshops, and tech talks with automated passes.", badge: "TECH CLUBS" },
      { title: "Cultural & Arts Societies", desc: "Manage dance, music, and theater auditions and showcase tickets.", badge: "CULTURAL" },
      { title: "Sports & Gaming Councils", desc: "Coordinate esports tournaments and inter-department sports meets.", badge: "SPORTS" }
    ],
    faqs: [
      { q: "What is the best registration system for college events?", a: "UrPass is the best platform for student events, offering instant registration pages, automated QR tickets, and browser-based scanning with a permanent free plan." },
      { q: "How does QR event check-in work for student events?", a: "Students show their QR pass on their phone screen. Club volunteers scan it with their phone camera to verify entry in under 0.3s." },
      { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. Multiple club members can scan at different entrances simultaneously with instant synchronization." },
      { q: "Can UrPass prevent duplicate QR entry?", a: "Yes. Once a pass is scanned, it cannot be reused. Any attempt to share a screenshot triggers a duplicate error." },
      { q: "Can organisers see attendance in real time?", a: "Yes. The organizer dashboard shows live registrations, check-in counts, and turnout percentage." },
      { q: "Can UrPass manage free and paid events?", a: "Yes. Clubs can host free meetups or collect ticket fees for major workshops and fests." }
    ]
  }
];

// Generate the remaining 45 pages programmatically with rich content
const REMAINING_SPECS = [
  // Group 1 (cont): Colleges & Universities (6-15)
  {
    slug: "university-fest-registration",
    keyword: "university fest registration system",
    title: "University Fest Registration System & Multi-Department Pass | UrPass",
    description: "Enterprise registration system for university fests, inter-collegiate tournaments and multi-day pro-shows. Multi-gate QR scanning & instant analytics.",
    h1: "University Fest Registration System Built for Grand Campus Fests",
    badge: "UNIVERSITY FEST ENGINE",
    cluster: "Universities",
    audienceType: "University Fest Chairs, Student Unions & Cultural Deans",
    ctaLabel: "Launch University Fest Registration",
    icon1: "Building2", icon2: "Ticket", icon3: "ShieldCheck", icon4: "Users", icon5: "ScanLine", icon6: "Zap"
  },
  {
    slug: "symposium-registration-software",
    keyword: "symposium registration software",
    title: "Technical Symposium Registration Software & Track Passes | UrPass",
    description: "Registration and check-in software for national technical symposiums, paper presentations, and robotics competitions. Zero commission & QR passes.",
    h1: "Technical Symposium Registration Software Built for Academic Meets",
    badge: "TECHNICAL SYMPOSIUMS",
    cluster: "Colleges",
    audienceType: "Department Heads, Faculty Advisors & Tech Fest Leads",
    ctaLabel: "Launch Symposium Registration",
    icon1: "Award", icon2: "Layers", icon3: "ScanLine", icon4: "CheckCircle2", icon5: "BarChart3", icon6: "ShieldCheck"
  },
  {
    slug: "hackathon-registration-check-in",
    keyword: "hackathon registration software",
    title: "Hackathon Registration & QR Check-In Software | UrPass",
    description: "Streamline 24/48-hour hackathon registrations, team rosters, hacker approval queues, meal coupon tracking and hardware check-in with UrPass.",
    h1: "Hackathon Registration & QR Check-In Software Built for Dev Events",
    badge: "HACKATHONS & BUILD DAYS",
    cluster: "Colleges",
    audienceType: "Hackathon Organizers, Dev Communities & Tech Leads",
    ctaLabel: "Launch Hackathon Registration",
    icon1: "Zap", icon2: "Users", icon3: "ScanLine", icon4: "Lock", icon5: "Smartphone", icon6: "CheckCircle2"
  },
  {
    slug: "college-workshop-registration",
    keyword: "workshop registration software for colleges",
    title: "College Workshop Registration Software & Seat Allocation | UrPass",
    description: "Manage registrations, lab seat capacities, paid fee collection and certificate-ready attendance verification for college technical workshops.",
    h1: "College Workshop Registration Software Built for Training Sessions",
    badge: "HANDS-ON WORKSHOPS",
    cluster: "Colleges",
    audienceType: "Lab Coordinators, Faculty Trainers & Department Societies",
    ctaLabel: "Set Up Workshop Registration",
    icon1: "Layers", icon2: "CheckCircle2", icon3: "ScanLine", icon4: "Award", icon5: "Zap", icon6: "BarChart3"
  },
  {
    slug: "inter-college-event-registration",
    keyword: "inter college event registration",
    title: "Inter-College Event Registration Platform & Delegation Passes | UrPass",
    description: "Coordinate external college delegations, multi-event entries, student ID verification and campus entrance security with UrPass.",
    h1: "Inter-College Event Registration Platform Built for Multi-College Fests",
    badge: "INTER-COLLEGE DELEGATIONS",
    cluster: "Colleges",
    audienceType: "Inter-College Fest Leads, Event Chairs & Campus Security",
    ctaLabel: "Launch Inter-College Event",
    icon1: "Building2", icon2: "Users", icon3: "ShieldCheck", icon4: "ScanLine", icon5: "Lock", icon6: "Ticket"
  },
  {
    slug: "cultural-fest-ticketing",
    keyword: "cultural fest ticketing software",
    title: "College Cultural Fest Ticketing Platform & Band Passes | UrPass",
    description: "Zero-fee ticketing platform for college cultural fests, battle of the bands, dance showcases and celebrity nights. Instant QR delivery & gate scanning.",
    h1: "College Cultural Fest Ticketing Platform Built for Stage & Music Nights",
    badge: "CULTURAL FESTS & SHOWS",
    cluster: "Colleges",
    audienceType: "Cultural Committees, Student Councils & Stage Directors",
    ctaLabel: "Launch Cultural Fest Tickets",
    icon1: "Ticket", icon2: "Smartphone", icon3: "ShieldCheck", icon4: "Zap", icon5: "Lock", icon6: "BarChart3"
  },
  {
    slug: "college-sports-event-registration",
    keyword: "college sports event registration",
    title: "College Sports Event Registration System & Tournament Passes | UrPass",
    description: "Register college sports teams, generate athlete accreditation passes, schedule fixture entries and verify ground access with UrPass.",
    h1: "College Sports Event Registration System Built for Tournaments",
    badge: "SPORTS TOURNAMENTS",
    cluster: "Colleges",
    audienceType: "Sports Directors, Athletic Associations & Tournament Leads",
    ctaLabel: "Start Sports Event Registration",
    icon1: "Award", icon2: "Users", icon3: "ScanLine", icon4: "ShieldCheck", icon5: "CheckCircle2", icon6: "BarChart3"
  },
  {
    slug: "alumni-event-registration",
    keyword: "alumni event registration software",
    title: "Alumni Event Registration Software & Reunion Guest Passes | UrPass",
    description: "Manage alumni reunions, batch homecoming dinners, graduation jubilee meets and VIP passes with instant digital QR passes and name lookup.",
    h1: "Alumni Event Registration Software Built for Reunion & Homecoming Meets",
    badge: "ALUMNI RELATIONS",
    cluster: "Colleges",
    audienceType: "Alumni Associations, University Advancement & Reunion Chairs",
    ctaLabel: "Launch Alumni Registration",
    icon1: "Users", icon2: "Ticket", icon3: "ScanLine", icon4: "Building2", icon5: "Award", icon6: "Smartphone"
  },
  {
    slug: "orientation-event-registration",
    keyword: "orientation registration software",
    title: "Freshers & Orientation Event Registration Software | UrPass",
    description: "Welcome incoming university cohorts smoothly. Manage freshers week registration, campus tours, departmental briefings and welcome kit passes.",
    h1: "Freshers & Orientation Event Registration Built for Campus Welcome",
    badge: "CAMPUS ORIENTATION",
    cluster: "Colleges",
    audienceType: "Dean of Student Affairs, Orientation Leaders & Student Mentors",
    ctaLabel: "Set Up Orientation Registration",
    icon1: "Building2", icon2: "Smartphone", icon3: "ScanLine", icon4: "CheckCircle2", icon5: "Users", icon6: "BarChart3"
  },
  {
    slug: "convocation-guest-registration",
    keyword: "convocation guest registration system",
    title: "Graduation & Convocation Guest Registration System | UrPass",
    description: "Formal guest accreditation, faculty robe allocation, graduate pass distribution and VIP hall security for university graduation ceremonies.",
    h1: "Graduation & Convocation Guest Registration Built for Formal Ceremonies",
    badge: "CONVOCATIONS & COMMENCEMENT",
    cluster: "Universities",
    audienceType: "Registrars, Convocation Committees & University Chancellery",
    ctaLabel: "Start Convocation Registration",
    icon1: "Award", icon2: "ShieldCheck", icon3: "ScanLine", icon4: "Lock", icon5: "Building2", icon6: "Users"
  },

  // Group 2: Event Agencies, Companies, White-Label & Operations (16-25)
  {
    slug: "event-agency-registration-software",
    keyword: "event agency registration software",
    title: "Event Registration Software for Event Agencies & Producers | UrPass",
    description: "White-label event registration and QR check-in software built for experiential event agencies. Multi-client workspaces, branded passes & live gate telemetry.",
    h1: "Event Registration Software Built for Event Agencies & Production Teams",
    badge: "AGENCY & CLIENT WORKSPACES",
    cluster: "Agencies",
    audienceType: "Event Agencies, Production Houses & Experiential Marketers",
    ctaLabel: "Run Your Next Client Event on UrPass",
    icon1: "Building2", icon2: "Sparkles", icon3: "ShieldCheck", icon4: "BarChart3", icon5: "Zap", icon6: "ScanLine"
  },
  {
    slug: "event-company-ticketing-platform",
    keyword: "event company ticketing platform",
    title: "Event Ticketing Platform for Event Companies & Organisers | UrPass",
    description: "High-volume ticketing engine for professional event companies. Zero platform commissions, customized checkout branding, fast payouts & QR check-in.",
    h1: "Event Ticketing Platform Built for Event Companies & Organisers",
    badge: "EVENT COMPANIES & PRODUCERS",
    cluster: "Agencies",
    audienceType: "Commercial Event Organizers, Expo Companies & Producers",
    ctaLabel: "Run Your Next Client Event on UrPass",
    icon1: "Ticket", icon2: "Zap", icon3: "ShieldCheck", icon4: "Smartphone", icon5: "Lock", icon6: "BarChart3"
  },
  {
    slug: "white-label-event-registration",
    keyword: "white label event registration software",
    title: "White-Label Event Registration Platform & Custom Branding | UrPass",
    description: "Deploy branded event registration forms, custom domains, personalized email templates and bespoke QR passes for your corporate clients.",
    h1: "White-Label Event Registration Platform Built for Brand Immersion",
    badge: "CUSTOM BRANDING & DOMAINS",
    cluster: "Agencies",
    audienceType: "Brand Agencies, Enterprise Marketing Teams & White-Label Resellers",
    ctaLabel: "Launch White-Label Event",
    icon1: "Sparkles", icon2: "Globe", icon3: "Smartphone", icon4: "Building2", icon5: "CheckCircle2", icon6: "ScanLine"
  },
  {
    slug: "multi-event-management-agencies",
    keyword: "multi event management software",
    title: "Multi-Event Management Software for Agencies & Brands | UrPass",
    description: "Manage 50+ concurrent client events from one master agency dashboard. Unified attendee analytics, team role permissions and scalable QR check-in.",
    h1: "Multi-Event Management Software Built for Agencies Handling Multiple Brands",
    badge: "MULTI-CLIENT DASHBOARD",
    cluster: "Agencies",
    audienceType: "Agency Operations Directors, Account Leads & Event Managers",
    ctaLabel: "Manage Agency Events on UrPass",
    icon1: "Layers", icon2: "Users", icon3: "BarChart3", icon4: "ShieldCheck", icon5: "Building2", icon6: "Lock"
  },
  {
    slug: "event-registration-for-agencies",
    keyword: "event registration for agencies",
    title: "Client Event Registration Platform for Agencies & Planners | UrPass",
    description: "Fast-deploy client registration portals with instant WhatsApp QR passes, VIP tier management and real-time gate attendance telemetry.",
    h1: "Client Event Registration Platform Built for Experiential Agencies",
    badge: "EXPERIENTIAL & CLIENT MEETS",
    cluster: "Agencies",
    audienceType: "Experiential Event Planners, Brand Managers & Client Leads",
    ctaLabel: "Run Your Next Client Event on UrPass",
    icon1: "Building2", icon2: "Smartphone", icon3: "CheckCircle2", icon4: "ScanLine", icon5: "Zap", icon6: "BarChart3"
  },
  {
    slug: "event-company-qr-check-in",
    keyword: "event QR check in software",
    title: "QR Check-In Software for Event Companies & Experiential Teams | UrPass",
    description: "Sub-second mobile QR scanner software for live event agencies. Eliminate entrance queues, prevent duplicate entries and monitor staff performance.",
    h1: "QR Check-In Software Built for Professional Event Companies",
    badge: "ENTERPRISE QR CHECK-IN",
    cluster: "Agencies",
    audienceType: "Operations Crew, Onsite Event Leads & Venue Directors",
    ctaLabel: "Start High-Speed Check-In",
    icon1: "ScanLine", icon2: "ShieldCheck", icon3: "Zap", icon4: "Lock", icon5: "BarChart3", icon6: "Smartphone"
  },
  {
    slug: "multi-gate-event-check-in",
    keyword: "multi gate event check in",
    title: "Multi-Gate Event Check-In Software & Fast Queue Management | UrPass",
    description: "Synchronize check-ins across 20+ stadium or venue gates with atomic duplicate blocking (<150ms), offline failover and real-time rush telemetry.",
    h1: "Multi-Gate Event Check-In Software Built for Stadiums & Venues",
    badge: "MULTI-GATE SCALE",
    cluster: "Operations",
    audienceType: "Venue Managers, Security Directors & Stadium Operations",
    ctaLabel: "Set Up Multi-Gate Check-In Free",
    icon1: "Lock", icon2: "ScanLine", icon3: "ShieldCheck", icon4: "Zap", icon5: "BarChart3", icon6: "Users"
  },
  {
    slug: "event-gate-management-software",
    keyword: "event gate management software",
    title: "Event Staff & Gate Management Software & Scanner Telemetry | UrPass",
    description: "Assign volunteer PIN logins to specific venue doors, monitor scans-per-minute per gate, and resolve duplicate pass alerts in real time.",
    h1: "Event Staff & Gate Management Software Built for Venue Operations",
    badge: "GATE STAFF & SCANNER OPS",
    cluster: "Operations",
    audienceType: "Gate Supervisors, Crowd Security & Volunteer Managers",
    ctaLabel: "Launch Gate Operations",
    icon1: "ShieldCheck", icon2: "Users", icon3: "ScanLine", icon4: "BarChart3", icon5: "Lock", icon6: "Zap"
  },
  {
    slug: "real-time-event-attendance",
    keyword: "real time event attendance dashboard",
    title: "Real-Time Event Attendance Dashboard & Influx Analytics | UrPass",
    description: "Live attendance monitoring with arrival velocity curves, gate distribution charts, not-arrived guest lists and automated SMS/WhatsApp alerts.",
    h1: "Real-Time Event Attendance Dashboard Built for Live Operations",
    badge: "LIVE TELEMETRY & ANALYTICS",
    cluster: "Operations",
    audienceType: "Event Directors, Operations Leads & Executive Producers",
    ctaLabel: "Track Live Event Attendance",
    icon1: "BarChart3", icon2: "Clock", icon3: "Users", icon4: "Zap", icon5: "ScanLine", icon6: "ShieldCheck"
  },
  {
    slug: "event-attendee-management-software",
    keyword: "attendee management software",
    title: "Event Attendee Management Software & Digital Directory | UrPass",
    description: "Comprehensive guest list management, application approval queues, instant ticket resends, badging data sync and search-based desk check-in.",
    h1: "Event Attendee Management Software Built for Seamless Guest Operations",
    badge: "GUEST CRM & DIRECTORY",
    cluster: "Operations",
    audienceType: "Guest Relations Leads, Registration Desks & Event Managers",
    ctaLabel: "Manage Attendees Free",
    icon1: "Users", icon2: "CheckCircle2", icon3: "Smartphone", icon4: "ScanLine", icon5: "BarChart3", icon6: "Lock"
  },

  // Group 3: Exhibitions, Expos, Conferences, Summits & Capacity (26-35)
  {
    slug: "exhibition-registration-software",
    keyword: "exhibition registration software",
    title: "Exhibition Registration Software & Trade Badges | UrPass",
    description: "B2B exhibition visitor registration, exhibitor badge allocation, pavilion access scanning and lead generation passes with UrPass.",
    h1: "Exhibition Registration Software Built for Trade Shows & Expos",
    badge: "EXHIBITIONS & TRADE FAIRS",
    cluster: "Exhibitions",
    audienceType: "Exhibition Organizers, Trade Show Directors & Pavilion Leads",
    ctaLabel: "Launch Exhibition Registration",
    icon1: "Building2", icon2: "Ticket", icon3: "ScanLine", icon4: "Users", icon5: "ShieldCheck", icon6: "BarChart3"
  },
  {
    slug: "trade-show-registration-software",
    keyword: "trade show registration software",
    title: "Trade Show Registration Software & Buyer Badge Passes | UrPass",
    description: "Streamline trade buyer registrations, VIP buyer accreditation, seminar hall access control and exhibitor staff badging.",
    h1: "Trade Show Registration Software Built for B2B Expos & Pavilions",
    badge: "TRADE SHOWS & B2B EXPOS",
    cluster: "Exhibitions",
    audienceType: "Trade Association Directors, Expo Coordinators & Buyer Managers",
    ctaLabel: "Start Trade Show Registration",
    icon1: "Building2", icon2: "Award", icon3: "ScanLine", icon4: "ShieldCheck", icon5: "Lock", icon6: "Zap"
  },
  {
    slug: "expo-visitor-registration",
    keyword: "expo visitor registration software",
    title: "Expo Visitor Registration System & Fast QR Badges | UrPass",
    description: "Process 25,000+ public or trade expo visitors. Online pre-registration, instant QR badging on mobile and rapid concourse scanning.",
    h1: "Expo Visitor Registration System Built for High-Volume Pavilions",
    badge: "EXPO VISITOR TICKETING",
    cluster: "Exhibitions",
    audienceType: "Expo Organizers, Convention Centre Managers & Registration Desks",
    ctaLabel: "Launch Expo Registration",
    icon1: "Users", icon2: "ScanLine", icon3: "Smartphone", icon4: "Zap", icon5: "ShieldCheck", icon6: "BarChart3"
  },
  {
    slug: "delegate-registration-software",
    keyword: "delegate registration software",
    title: "Delegate Registration Software & VIP Pass Workflow | UrPass",
    description: "High-touch delegate registration for international summits, economic forums and medical colloquiums. Tiered badging and session access.",
    h1: "Delegate Registration Software Built for Summits & Colloquiums",
    badge: "DELEGATE ACCREDITATION",
    cluster: "Conferences",
    audienceType: "Conference Directors, Secretariat Leads & Protocol Officers",
    ctaLabel: "Set Up Delegate Registration",
    icon1: "Award", icon2: "CheckCircle2", icon3: "ScanLine", icon4: "Lock", icon5: "Building2", icon6: "BarChart3"
  },
  {
    slug: "corporate-conference-registration",
    keyword: "corporate conference registration",
    title: "Corporate Conference Registration Software & Multi-Track Passes | UrPass",
    description: "Enterprise conference registration with company email domain whitelisting, multi-track agenda access, keynote scanning and catering badges.",
    h1: "Corporate Conference Registration Software Built for Business Summits",
    badge: "CORPORATE CONFERENCES",
    cluster: "Conferences",
    audienceType: "Corporate Event Planners, HR Leaders & Executive Producers",
    ctaLabel: "Launch Corporate Conference",
    icon1: "Building2", icon2: "Layers", icon3: "ScanLine", icon4: "Lock", icon5: "CheckCircle2", icon6: "BarChart3"
  },
  {
    slug: "business-summit-registration",
    keyword: "summit registration platform",
    title: "Business Summit Registration Platform & Executive Badges | UrPass",
    description: "Accredit executive leaders, keynote speakers and VIP delegates with elegant digital passes, invitation-only approvals and fast check-in.",
    h1: "Business Summit Registration Platform Built for High-Profile Summits",
    badge: "EXECUTIVE SUMMITS",
    cluster: "Conferences",
    audienceType: "Summit Chairs, Think-Tank Coordinators & C-Suite Event Teams",
    ctaLabel: "Start Business Summit Registration",
    icon1: "Award", icon2: "ShieldCheck", icon3: "CheckCircle2", icon4: "Smartphone", icon5: "ScanLine", icon6: "BarChart3"
  },
  {
    slug: "seminar-registration-software",
    keyword: "seminar registration software",
    title: "Seminar Registration & Attendance Software with Certificates | UrPass",
    description: "Online registration for professional seminars, CME medical training, legal CPD workshops and accredited educational lectures.",
    h1: "Seminar Registration & Attendance Software Built for Professional Seminars",
    badge: "SEMINARS & CPD LECTURES",
    cluster: "Conferences",
    audienceType: "Training Directors, Professional Institutes & Seminar Leads",
    ctaLabel: "Set Up Seminar Registration",
    icon1: "Award", icon2: "CheckCircle2", icon3: "ScanLine", icon4: "Layers", icon5: "BarChart3", icon6: "Smartphone"
  },
  {
    slug: "conference-qr-pass-system",
    keyword: "conference QR pass software",
    title: "Conference Badge & QR Pass System & Session Scanner | UrPass",
    description: "Replace costly plastic badge printers with responsive digital Apple/Google wallet passes. Track plenary and breakout room attendance in real time.",
    h1: "Conference Badge & QR Pass System Built for Multi-Hall Access",
    badge: "DIGITAL CONFERENCE PASSES",
    cluster: "Conferences",
    audienceType: "Conference Technical Leads, Badge Coordinators & Hall Managers",
    ctaLabel: "Issue Conference QR Passes",
    icon1: "Smartphone", icon2: "ScanLine", icon3: "Layers", icon4: "Lock", icon5: "BarChart3", icon6: "Zap"
  },
  {
    slug: "speaker-delegate-management",
    keyword: "speaker delegate management software",
    title: "Speaker & Delegate Management Platform & Green Room Passes | UrPass",
    description: "Coordinate keynote speakers, panel moderators, VIP delegates and media passes. Manage bio submissions, green room access and session check-ins.",
    h1: "Speaker & Delegate Management Platform Built for Program Directors",
    badge: "SPEAKER & VIP OPS",
    cluster: "Conferences",
    audienceType: "Program Committee Chairs, Speaker Managers & VIP Liaisons",
    ctaLabel: "Manage Speakers & Delegates",
    icon1: "Award", icon2: "Users", icon3: "CheckCircle2", icon4: "ScanLine", icon5: "Building2", icon6: "BarChart3"
  },
  {
    slug: "event-capacity-management",
    keyword: "event capacity management software",
    title: "Event Capacity Management Software & Automated Waitlists | UrPass",
    description: "Prevent overcrowding with hard room limits, multi-tier capacity thresholds, real-time sold-out locking and automated waitlist backfilling.",
    h1: "Event Capacity Management Software Built for Sold-Out Venues",
    badge: "CAPACITY & WAITLISTS",
    cluster: "Operations",
    audienceType: "Safety Officers, Venue Directors & High-Demand Event Leads",
    ctaLabel: "Control Venue Capacity Free",
    icon1: "Lock", icon2: "Users", icon3: "CheckCircle2", icon4: "Zap", icon5: "BarChart3", icon6: "ShieldCheck"
  },

  // Group 4: UK Regional & Commercial (36-45)
  {
    slug: "uk/qr-ticketing-software",
    keyword: "QR ticketing software UK",
    title: "QR Ticketing Software UK & Instant Wallet Passes | UrPass",
    description: "The UK's modern QR ticketing software. Sell GBP tickets, deliver digital Apple Wallet passes, and check in attendees with sub-second camera scanning.",
    h1: "QR Ticketing Software Built for UK Organisers & Venues",
    badge: "UNITED KINGDOM TICKETING",
    cluster: "UK",
    audienceType: "UK Event Organisers, Venues & Festival Producers",
    ctaLabel: "Start Your UK Event",
    icon1: "Smartphone", icon2: "ScanLine", icon3: "ShieldCheck", icon4: "Zap", icon5: "Lock", icon6: "BarChart3",
    geoMeta: { region: "UK", placename: "United Kingdom", position: "55.3781;-3.4360", latitude: 55.3781, longitude: -3.436, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/event-registration-software",
    keyword: "event registration software UK",
    title: "Event Registration Software UK & Zero Ticket Fees | UrPass",
    description: "UK event registration software with GBP pricing, Europe/London timezone handling, UK GDPR compliance, and zero platform commission.",
    h1: "Event Registration Software Built for United Kingdom Events",
    badge: "UK EVENT PLATFORM",
    cluster: "UK",
    audienceType: "UK Conferences, Student Unions, Corporate Planners & Venues",
    ctaLabel: "Start Your UK Event",
    icon1: "Building2", icon2: "ShieldCheck", icon3: "ScanLine", icon4: "Zap", icon5: "CheckCircle2", icon6: "BarChart3",
    geoMeta: { region: "UK", placename: "United Kingdom", position: "55.3781;-3.4360", latitude: 55.3781, longitude: -3.436, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/university-event-registration",
    keyword: "university event software UK",
    title: "University Event Registration Software UK & Student Passes | UrPass",
    description: "UK higher education event platform for Russell Group universities, student societies, freshers fairs and academic symposiums. UK GDPR compliant.",
    h1: "University Event Registration Software Built for UK Higher Ed",
    badge: "UK UNIVERSITIES & UNIONS",
    cluster: "UK",
    audienceType: "UK University Event Teams, Student Unions & Society Presidents",
    ctaLabel: "Launch UK University Event",
    icon1: "Building2", icon2: "Award", icon3: "ScanLine", icon4: "ShieldCheck", icon5: "Users", icon6: "BarChart3",
    geoMeta: { region: "UK", placename: "United Kingdom", position: "55.3781;-3.4360", latitude: 55.3781, longitude: -3.436, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/student-event-ticketing",
    keyword: "student event ticketing UK",
    title: "Student Event Ticketing Platform UK & Society Passes | UrPass",
    description: "Sell tickets for UK student union club nights, balls, varsity matches and society meetups with 0% commission and instant mobile QR check-in.",
    h1: "Student Event Ticketing Platform Built for UK Student Unions & Societies",
    badge: "UK STUDENT UNIONS",
    cluster: "UK",
    audienceType: "Student Union Execs, Society Treasurers & College Social Secs",
    ctaLabel: "Launch Student Tickets UK",
    icon1: "Ticket", icon2: "Smartphone", icon3: "ShieldCheck", icon4: "Zap", icon5: "Users", icon6: "BarChart3",
    geoMeta: { region: "UK", placename: "United Kingdom", position: "55.3781;-3.4360", latitude: 55.3781, longitude: -3.436, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/conference-check-in-software",
    keyword: "conference check in software UK",
    title: "Conference Check-In Software UK & Fast Delegate Scanning | UrPass",
    description: "Sub-second delegate badge check-in for UK conferences, summits and conventions. Eliminate registration desk queues across London, Manchester & Birmingham.",
    h1: "Conference Check-In Software Built for UK Convention Centres",
    badge: "UK CONFERENCES & EXPOS",
    cluster: "UK",
    audienceType: "UK Conference Producers, ExCeL / NEC Event Teams & Secretariats",
    ctaLabel: "Start UK Conference Check-In",
    icon1: "ScanLine", icon2: "Building2", icon3: "ShieldCheck", icon4: "Lock", icon5: "Zap", icon6: "BarChart3",
    geoMeta: { region: "UK", placename: "United Kingdom", position: "55.3781;-3.4360", latitude: 55.3781, longitude: -3.436, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/london/event-qr-check-in",
    keyword: "event QR check in London",
    title: "Event QR Code Check-In London & Venue Concourse Scanning | UrPass",
    description: "High-speed QR code ticket check-in for London venues, business summits, West End showcases and tech colloquiums. Sub-0.3s camera scanning.",
    h1: "Event QR Code Check-In Built for London Venues & Summits",
    badge: "LONDON EVENT TECH",
    cluster: "UK",
    audienceType: "London Event Producers, Venue Operations & Corporate Planners",
    ctaLabel: "Start London Event Check-In",
    icon1: "ScanLine", icon2: "Building2", icon3: "ShieldCheck", icon4: "Zap", icon5: "Lock", icon6: "BarChart3",
    geoMeta: { region: "Greater London", placename: "London", position: "51.5074;-0.1278", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/manchester/event-registration",
    keyword: "event registration software Manchester",
    title: "Event Registration Software Manchester & Student Fests | UrPass",
    description: "Event registration and mobile QR ticketing for Manchester conferences, creative agencies, student union fests and business forums.",
    h1: "Event Registration Software Built for Manchester Events & Academics",
    badge: "MANCHESTER EVENTS",
    cluster: "UK",
    audienceType: "Manchester Event Agencies, Student Unions & Conference Planners",
    ctaLabel: "Launch Manchester Event",
    icon1: "Building2", icon2: "Ticket", icon3: "ScanLine", icon4: "ShieldCheck", icon5: "Zap", icon6: "BarChart3",
    geoMeta: { region: "North West", placename: "Manchester", position: "53.4808;-2.2426", latitude: 53.4808, longitude: -2.2426, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/birmingham/event-registration",
    keyword: "event registration software Birmingham",
    title: "Event Registration Software Birmingham & NEC Expos | UrPass",
    description: "Registration and badge scanning platform for Birmingham trade shows, NEC exhibitions, university conferences and corporate conventions.",
    h1: "Event Registration Software Built for Birmingham Expos & Conferences",
    badge: "BIRMINGHAM & NEC EXPOS",
    cluster: "UK",
    audienceType: "NEC Exhibitors, Birmingham Event Planners & Trade Associations",
    ctaLabel: "Launch Birmingham Event",
    icon1: "Building2", icon2: "ScanLine", icon3: "Ticket", icon4: "ShieldCheck", icon5: "Lock", icon6: "BarChart3",
    geoMeta: { region: "West Midlands", placename: "Birmingham", position: "52.4862;-1.8904", latitude: 52.4862, longitude: -1.8904, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/edinburgh/event-registration",
    keyword: "event registration software Edinburgh",
    title: "Event Registration Software Edinburgh & Festival Check-In | UrPass",
    description: "Event registration and QR check-in software for Edinburgh festival venues, university symposiums, medical conferences and arts galas.",
    h1: "Event Registration Software Built for Edinburgh Festivals & Colloquiums",
    badge: "EDINBURGH & SCOTLAND",
    cluster: "UK",
    audienceType: "Edinburgh Festival Producers, Academic Chairs & Venue Managers",
    ctaLabel: "Launch Edinburgh Event",
    icon1: "Award", icon2: "ScanLine", icon3: "Ticket", icon4: "ShieldCheck", icon5: "Building2", icon6: "BarChart3",
    geoMeta: { region: "Scotland", placename: "Edinburgh", position: "55.9533;-3.1883", latitude: 55.9533, longitude: -3.1883, country: "United Kingdom", countryCode: "GB" }
  },
  {
    slug: "uk/glasgow/event-registration",
    keyword: "event registration software Glasgow",
    title: "Event Registration Software Glasgow & Arena Entry Passes | UrPass",
    description: "High-capacity event registration and fast door scanning for Glasgow concert arenas, Scottish exhibitions, student societies and conferences.",
    h1: "Event Registration Software Built for Glasgow Arenas & Conferences",
    badge: "GLASGOW & SCOTLAND",
    cluster: "UK",
    audienceType: "Glasgow Arena Leads, Event Producers & University Societies",
    ctaLabel: "Launch Glasgow Event",
    icon1: "Building2", icon2: "ScanLine", icon3: "Ticket", icon4: "Zap", icon5: "ShieldCheck", icon6: "BarChart3",
    geoMeta: { region: "Scotland", placename: "Glasgow", position: "55.8642;-4.2518", latitude: 55.8642, longitude: -4.2518, country: "United Kingdom", countryCode: "GB" }
  },

  // Group 5: High-Intent Alternatives & QR / Paperless Innovations (46-50)
  {
    slug: "google-forms-event-registration-alternative",
    keyword: "Google Forms alternative for events",
    title: "Google Forms Alternative for Event Registration & QR Passes | UrPass",
    description: "Upgrade from Google Forms to automated digital QR passes, instant email/WhatsApp delivery, built-in approvals, and sub-second phone scanning.",
    h1: "Google Forms Alternative for Event Registration & Automated Passes",
    badge: "MODERN FORM ALTERNATIVE",
    cluster: "Alternatives",
    audienceType: "Event Organizers, Club Leads & Administrative Coordinators",
    ctaLabel: "Replace Google Forms Free",
    icon1: "CheckCircle2", icon2: "Smartphone", icon3: "ScanLine", icon4: "Lock", icon5: "Zap", icon6: "BarChart3"
  },
  {
    slug: "excel-event-attendance-alternative",
    keyword: "event attendance spreadsheet alternative",
    title: "Excel Alternative for Event Attendance & Live Phone Scanners | UrPass",
    description: "Ditch manual Excel paper rosters. Scan attendee QR passes with any mobile phone, block duplicates in real time, and export clean CSVs instantly.",
    h1: "Excel Alternative for Event Attendance & Paperless Check-In",
    badge: "SPREADSHEET REPLACEMENT",
    cluster: "Alternatives",
    audienceType: "Operations Staff, Workshop Leads & Registration Desks",
    ctaLabel: "Replace Event Spreadsheets Free",
    icon1: "ScanLine", icon2: "Lock", icon3: "Users", icon4: "Zap", icon5: "BarChart3", icon6: "ShieldCheck"
  },
  {
    slug: "qr-code-event-registration-system",
    keyword: "QR code event registration system",
    title: "QR Code Event Registration System & Sub-Second Scanners | UrPass",
    description: "Complete QR code registration platform. Custom form builder, instant cryptographic QR pass generation, WhatsApp delivery and high-speed door scanning.",
    h1: "QR Code Event Registration System Built for Fast Crowd Processing",
    badge: "QR CODE PLATFORM",
    cluster: "Innovation",
    audienceType: "Event Directors, Technical Coordinators & Venue Managers",
    ctaLabel: "Create QR Event Registration Free",
    icon1: "ScanLine", icon2: "Smartphone", icon3: "ShieldCheck", icon4: "Lock", icon5: "Zap", icon6: "BarChart3"
  },
  {
    slug: "paperless-event-registration",
    keyword: "paperless event registration",
    title: "Paperless Event Registration System & Digital Apple/Google Passes | UrPass",
    description: "Go 100% paperless. Eliminate printed tickets, paper check-in sheets and plastic badges with digital QR passes saved to mobile wallets.",
    h1: "Paperless Event Registration System Built for 100% Digital Guest Entry",
    badge: "SUSTAINABLE & PAPERLESS",
    cluster: "Innovation",
    audienceType: "Sustainable Event Planners, Corporate Teams & Modern Venues",
    ctaLabel: "Go Paperless Free",
    icon1: "Smartphone", icon2: "ScanLine", icon3: "Sparkles", icon4: "CheckCircle2", icon5: "Zap", icon6: "BarChart3"
  },
  {
    slug: "instant-qr-pass-registration",
    keyword: "instant QR pass event registration",
    title: "Event Registration With Instant QR Pass Delivery | UrPass",
    description: "Deliver high-resolution digital event passes directly to attendee WhatsApp and email within 3 seconds of registration or approval.",
    h1: "Event Registration With Instant QR Pass Delivery via Email & WhatsApp",
    badge: "INSTANT PASS DELIVERY",
    cluster: "Innovation",
    audienceType: "Fast-Paced Event Producers, Club Coordinators & Ticketing Leads",
    ctaLabel: "Create Instant QR Event Free",
    icon1: "Smartphone", icon2: "Zap", icon3: "ScanLine", icon4: "CheckCircle2", icon5: "Lock", icon6: "BarChart3"
  }
];

// Helper to expand each remaining spec into full rich data conforming to SEOPageConfig
REMAINING_SPECS.forEach(spec => {
  const isCollegeOrUni = spec.cluster === "Colleges" || spec.cluster === "Universities";
  const isAgency = spec.cluster === "Agencies";
  const isUK = spec.cluster === "UK";
  const isAltOrInno = spec.cluster === "Alternatives" || spec.cluster === "Innovation";

  const directAnswerQuestion = `What is the best ${spec.keyword} for modern organisers?`;
  const directAnswerSummary = `UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For ${spec.audienceType.toLowerCase()}, UrPass delivers lightning-fast registration forms, instant automated QR pass delivery, sub-second smartphone check-in, atomic duplicate blocking, and 0% ticket fees.`;

  const directAnswerPoints = [
    `Complete registration workflow tailored for ${spec.audienceType}`,
    "Instant cryptographic QR pass delivery via email and WhatsApp in <3 seconds",
    "Sub-0.3s camera check-in on any smartphone with atomic duplicate blocking",
    "Real-time attendance dashboard and 1-click certificate-ready CSV exports"
  ];

  const whatIsTitle = `What is ${spec.h1.replace(" Built for.*", "")}?`;
  const whatIsDefinition = `${spec.h1.replace(" Built for.*", "")} is a dedicated event technology solution designed to automate attendee registration, digital ticketing, entrance access control, and real-time attendance tracking for ${spec.audienceType.toLowerCase()}.`;

  const whatIsPoints = [
    "Replaces manual data entry, paper sign-in sheets, and expensive barcode scanners",
    "Enforces strict capacity and tier limits with real-time sold-out locking",
    "Provides volunteers and security staff with high-speed mobile scanning links",
    "Keeps financial payouts transparent with zero ticketing commission deductions"
  ];

  const features = [
    { title: "Custom Branded Registration", desc: `Collect custom fields, attendee proofs, and preferences with responsive mobile forms tailored for ${spec.cluster.toLowerCase()}.`, iconName: spec.icon1 || "CheckCircle2" },
    { title: "Instant QR Pass Delivery", desc: "Automate digital pass generation and dispatch to email, SMS, and WhatsApp immediately upon approval or payment.", iconName: spec.icon2 || "Smartphone" },
    { title: "Sub-Second Gate Scanning", desc: "Volunteers and door staff scan attendee passes in under 300ms using any standard mobile browser.", iconName: spec.icon3 || "ScanLine" },
    { title: "Atomic Duplicate Lock (<150ms)", desc: "Prevent ticket sharing, screenshots, and pass duplication across multiple venue entrances simultaneously.", iconName: spec.icon4 || "Lock" },
    { title: "Capacity & Tier Management", desc: "Configure early bird tiers, VIP passes, delegation tickets, and strict room capacity thresholds.", iconName: spec.icon5 || "Layers" },
    { title: "Live Telemetry & CSV Reports", desc: "Monitor real-time gate velocity, arrival curves, and download verified attendee rosters with one click.", iconName: spec.icon6 || "BarChart3" }
  ];

  const deepDive = {
    badge: "OPERATIONAL EXCELLENCE",
    title: `How UrPass Modernizes ${spec.h1}`,
    paragraphs: [
      `Managing ${spec.keyword} requires balancing fast attendee registration with flawless entrance operations. Long lines, lost tickets, and untracked entries harm the attendee experience and compromise event security.`,
      `UrPass solves these bottlenecks end-to-end. Organisers create a clean, high-converting event page in under 2 minutes, approve or ticket attendees automatically, and staff scan passes at the door with sub-second precision.`
    ],
    bullets: [
      "Zero app installation required for attendees or volunteer door scanners",
      "Instant search fallback by name, email, or order ID at registration desks",
      "Zero platform ticket commission — pay only standard payment gateway rates",
      "Audit-ready attendance logs with exact check-in timestamps and gate names"
    ],
    takeaway: `UrPass gives ${spec.audienceType.toLowerCase()} enterprise-grade reliability, unmatched scanning speed, and complete operational peace of mind.`
  };

  const keyFacts = {
    headers: ["Operational Metric", "Legacy / Manual Methods", "UrPass Platform"],
    rows: [
      { col1: "Pass Issuance Speed", col2: "Manual emails or paper badges", col3: "Instant automated WhatsApp & Email QR" },
      { col1: "Door Check-In Velocity", col2: "45-90s per attendee (paper roster)", col3: "Sub-0.3s camera scan (45+ attendees/min/gate)" },
      { col1: "Duplicate Prevention", col2: "Zero cross-door sync", col3: "Atomic <150ms locking across all doors" },
      { col1: "Ticketing Platform Cut", col2: "3% to 8% per ticket fee", col3: "0% ticket commission on UrPass" }
    ]
  };

  const whoShouldUse = [
    { title: "Lead Organisers & Directors", desc: `Oversee registrations, capacity thresholds, and live revenue for ${spec.cluster.toLowerCase()} events.`, badge: "DIRECTORS" },
    { title: "Registration Desk & Gate Staff", desc: "Check in hundreds of attendees effortlessly using mobile phone cameras.", badge: "ON-SITE OPS" },
    { title: "Attendees & Delegates", desc: "Enjoy instant digital pass delivery and sub-second frictionless entry.", badge: "ATTENDEES" }
  ];

  const faqs = [
    { q: `What is the best registration system for ${spec.keyword}?`, a: `UrPass is the top platform for ${spec.keyword}, offering instant custom registration forms, automated digital QR passes, browser-based door scanning, and zero ticket commission.` },
    { q: "How does QR event check-in work?", a: "Attendees present their unique digital QR pass on their smartphone screen. Door staff point their phone camera using the UrPass web scanner. The pass validates in under 0.3 seconds with audible and visual feedback." },
    { q: "Can multiple event gates scan tickets simultaneously?", a: "Yes. UrPass supports unlimited concurrent scanning devices across multiple venue doors, synchronizing scan states in under 150 milliseconds." },
    { q: "Can UrPass prevent duplicate QR entry?", a: "Yes. UrPass uses atomic database row locking to prevent duplicate pass usage. If an attendee shares a screenshot of their pass, subsequent scans trigger an immediate duplicate error." },
    { q: "Can organisers see attendance in real time?", a: "Yes. The live organizer dashboard displays real-time attendance counts, arrival velocity curves, gate distribution, and remaining unverified guests." },
    { q: "Can UrPass manage free and paid events?", a: "Yes. UrPass fully supports free registrations, tiered paid tickets, and approval-only guest lists with integrated Razorpay/Stripe checkout and zero commission." }
  ];

  ALL_50_PAGES.push({
    slug: spec.slug,
    keyword: spec.keyword,
    title: spec.title,
    description: spec.description,
    h1: spec.h1,
    badge: spec.badge,
    cluster: spec.cluster,
    audienceType: spec.audienceType,
    ctaLabel: spec.ctaLabel,
    ctaHref: "/signup",
    secondaryCtaLabel: isUK ? "View GBP Pricing" : isAgency ? "Book an UrPass Demo" : "View Pricing",
    secondaryCtaHref: isAgency ? "/contact" : "/pricing",
    directAnswerQuestion,
    directAnswerSummary,
    directAnswerPoints,
    whatIsTitle,
    whatIsDefinition,
    whatIsPoints,
    features,
    deepDive,
    keyFacts,
    whoShouldUse,
    faqs,
    geoMeta: spec.geoMeta
  });
});

module.exports = { ALL_50_PAGES };
