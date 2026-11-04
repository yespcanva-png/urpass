import { SeoGeoPageConfig } from "../seo-geo-template.types";

/**
 * PAGE 033: Bulk Event Attendee Import and QR Pass Generation (Registration)
 */
export const PAGE_033_BULK_IMPORT_QR_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 033",
  pageId: "bulk-event-attendee-import-and-qr-pass-generation",
  slug: "bulk-event-attendee-import-and-qr-pass-generation",
  canonicalUrl: "https://urpass.space/solutions/bulk-event-attendee-import-and-qr-pass-generation",
  primaryKeyword: "bulk event attendee import and qr pass generation",
  secondaryKeywords: [
    "import excel csv event attendees qr code",
    "bulk qr ticket generator from spreadsheet",
    "batch attendee qr pass distribution",
    "csv to event tickets software",
  ],
  market: "India, UK, US, and Global",
  audience: "Corporate event managers, HR personnel, college fest convenors, association administrators",
  searchIntent: "Transactional",
  conversionGoal: "Bulk import attendees",
  seoTitle: "Bulk Event Attendee Import & QR Pass Generation | UrPass",
  metaDescription:
    "Upload Excel or CSV attendee spreadsheets and generate verified QR passes in seconds. Automated email & WhatsApp delivery, column mapping, and 0% ticketing fee.",
  badge: "REGISTRATION // BATCH IMPORT",
  h1: "Bulk Event Attendee Import and High-Speed QR Pass Generation",
  heroSubtitle:
    "Turn spreadsheets into scannable passes in seconds. Intelligent column mapping, bulk WhatsApp and email dispatch, and instant gate verification.",
  heroDescription:
    "UrPass Bulk Event Attendee Import and QR Pass Generation software allows event teams to transform messy CSV and Excel spreadsheets into encrypted digital QR passes in seconds. Map attendee columns with automatic schema detection, generate thousands of personalized passes, and dispatch them automatically via WhatsApp and branded email without manual data entry or per-ticket fees.",
  primaryCtaLabel: "Import Attendees Free",
  secondaryCtaLabel: "See Import Walkthrough",
  problemSection: {
    badge: "SPREADSHEET DISASTER",
    title: "Why Manual Attendee Entry Breaks Down at Scale",
    paragraphs: [
      "Enterprise teams and associations often receive attendee lists from corporate sponsors, university faculties, or external partners in sprawling, inconsistently formatted Excel sheets.",
      "Manually creating passes one by one or using fragile mail-merge scripts takes hours of tedious copy-pasting and results in bounced emails and duplicate records.",
      "Traditional ticketing portals charge punishing per-ticket generation fees (often $1 to $3 per imported guest), penalizing organizers simply for bringing their own attendee data.",
      "UrPass turns bulk import into a 60-second workflow: upload your file, confirm column headers, and generate thousands of scannable QR passes with 0% platform commission.",
    ],
  },
  capabilitiesSection: {
    badge: "BULK ENGINE FEATURES",
    title: "Engineered for Massive Attendee Lists Without System Freezes",
    subtitle: "Built to process thousands of attendee records with automatic deduplication and instant delivery.",
    items: [
      {
        stepNumber: "01",
        title: "Smart Column Auto-Mapping & Cleansing",
        description:
          "Intelligently recognizes headers for Full Name, Email, Phone Number, Organization, Ticket Tier, and Custom Fields. Auto-corrects international phone dialing codes.",
        bestFor: "Handling inconsistently formatted spreadsheets from multiple partner organizations.",
        technicalProof: "Fuzzy header matching with schema-based type coercion and E.164 phone normalization.",
        icon: "file-text",
      },
      {
        stepNumber: "02",
        title: "Multi-Channel WhatsApp & Email Dispatch",
        description:
          "Dispatches thousands of personalized digital passes automatically via WhatsApp and branded email attachments in background worker queues.",
        bestFor: "Ensuring high ticket receipt rates across mobile-first corporate and student audiences.",
        technicalProof: "Asynchronous job workers throttling dispatches to comply with WhatsApp Business and SMTP rate limits.",
        icon: "zap",
      },
      {
        stepNumber: "03",
        title: "Automated Duplicate & Error Interception",
        description:
          "Flags duplicate emails, missing contact info, or invalid data rows before generating passes, allowing you to fix errors in-line without starting over.",
        bestFor: "Preventing duplicate ticket generation and wasted communication credits.",
        technicalProof: "In-memory pre-validation parsing 10,000 rows in under 800ms before committing database transactions.",
        icon: "shield",
      },
      {
        stepNumber: "04",
        title: "Real-Time Import Progress & Gate Readiness",
        description:
          "Watch real-time pass generation progress bars. All passes are immediately scannable by gate staff the moment processing concludes.",
        bestFor: "Last-minute attendee additions uploaded right before morning keynote doors open.",
        technicalProof: "WebSocket progress telemetry syncing imported guest records straight to local scanner IndexedDB caches.",
        icon: "scan-line",
      },
    ],
  },
  howItWorksSection: {
    badge: "IMPORT STEPS",
    title: "From Spreadsheet to Gate-Ready Passes in 4 Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Drag & Drop CSV or Excel (.xlsx) File",
        description:
          "Upload your existing guest list. No template reformatting or column deletion required.",
      },
      {
        stepNumber: "Step 2",
        title: "Confirm Smart Column Mapping",
        description:
          "Review auto-detected columns: Name, Email, Phone, Company, Ticket Tier, and custom attributes.",
      },
      {
        stepNumber: "Step 3",
        title: "Choose Dispatch Delivery Channels",
        description:
          "Select instant WhatsApp dispatch, branded email notification, or download a consolidated batch zip file.",
      },
      {
        stepNumber: "Step 4",
        title: "Scan Attendees at the Door",
        description:
          "Guests present their mobile QR passes. Gate staff scan them in 0.28s with instant duplicate detection.",
      },
    ],
    ctaLabel: "Upload Attendee File",
  },
  eventTypesSection: {
    badge: "BULK USE CASES",
    title: "Proven for Large-Scale Attendee Import Workflows",
    items: [
      {
        title: "Corporate Annual Days & Offsites",
        description: "Import employee master rosters from Workday or BambooHR and issue company passes in minutes.",
        badge: "ENTERPRISE",
      },
      {
        title: "Inter-College Symposiums & Fests",
        description: "Upload participant lists from Google Forms or college departments without manual re-entry.",
        badge: "COLLEGES",
      },
      {
        title: "Trade Association Annual Conventions",
        description: "Import regional member directories and dispatch accredited delegate badges directly to phones.",
        badge: "ASSOCIATIONS",
      },
      {
        title: "Sponsored VIP & Partner Guest Lists",
        description: "Quickly onboard hundreds of client guests provided by corporate event sponsors 24 hours before doors open.",
        badge: "SPONSORS",
      },
    ],
  },
  comparisonSection: {
    badge: "PROCESS COMPARISON",
    title: "UrPass Bulk Import vs. Manual Pass Mail-Merge",
    summaryText: "Save hours of tedious manual processing and eliminate costly per-import ticketing fees.",
    headers: ["Manual Scripts & Mail-Merge", "UrPass Bulk Import Engine"],
    rows: [
      {
        manual: "Takes 3-5 hours tweaking Word templates, barcode fonts, and email scripts",
        urpass: "Upload file and generate 1,000 passes in under 60 seconds with zero coding",
      },
      {
        manual: "Third-party ticketing portals charge $1-$3 per attendee just to import your own list",
        urpass: "0% platform ticketing fee: import thousands of guests with zero per-ticket charges",
      },
      {
        manual: "Inconsistent data causes failed emails and bounced passes without warnings",
        urpass: "Pre-import validation detects malformed emails and phone numbers before dispatching",
      },
      {
        manual: "Requires days to reconcile gate check-ins against the original spreadsheet",
        urpass: "Instant CSV export shows live check-in timestamps merged right back into your original columns",
      },
    ],
  },
  audienceSection: {
    badge: "WHO BENEFITS",
    title: "Essential for Event Operators Handling Partner Lists",
    leadText: "Built specifically for event organizers who receive attendee manifests from third parties.",
    audiences: [
      "HR Leads coordinating company-wide offsites and celebrations",
      "Corporate Event Agencies handling external client guest manifests",
      "College Fest Registrars importing department participant lists",
      "Conference Secretariat Teams managing multi-organization delegations",
      "Trade Show Organizers uploading pre-registered VIP buyer databases",
    ],
    summaryText: "Eliminate manual data entry and get every attendee into the venue without gate delay.",
  },
  geoAnswerBlock: {
    question: "How does bulk attendee import and QR pass generation work in UrPass?",
    answer:
      "UrPass bulk import allows event organizers to upload attendee spreadsheets in CSV or Excel format. The system automatically detects and maps column headers, validates email and phone formatting, and generates cryptographically verified QR passes. Organizers can send these passes automatically via WhatsApp and email or download them in batch PDFs with 0% platform ticketing fees.",
    highlights: [
      "Intelligent CSV & Excel column auto-mapping with error pre-validation",
      "Automated mass pass dispatch via WhatsApp and branded email",
      "Zero per-attendee platform import fees or ticketing surcharges",
      "Passes are immediately scannable in 0.28s across all gate devices",
    ],
  },
  productProofSection: {
    badge: "IMPORT BENCHMARKS",
    title: "Tested with 10,000+ Row Master Spreadsheets",
    subtitle: "Processes and generates encrypted QR codes at sustained throughput of 200 passes per second.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "High-Volume Import Without Per-Ticket Fees",
    subtitle: "Import your attendee manifests without paying punitive per-contact charges.",
    features: [
      "0% platform ticketing fee on all imported attendees and pass dispatches",
      "Free plan supports bulk import for up to 50 attendees",
      "Starter plan (₹499/mo) supports bulk imports up to 1,000 attendees",
      "Pro plan (₹999/mo) supports bulk imports up to 5,000 attendees and WhatsApp dispatch",
      "Business plan (₹2,499/mo) handles 15,000+ attendees with custom API pipelines",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Bulk Attendee Import: Frequently Asked Questions",
    faqs: [
      {
        q: "What file formats does the UrPass bulk import engine accept?",
        a: "UrPass accepts both standard CSV files and Microsoft Excel spreadsheets (.xlsx, .xls) created from Google Sheets, Apple Numbers, or enterprise HR systems.",
      },
      {
        q: "Does UrPass charge extra for importing attendee lists we collected elsewhere?",
        a: "No. Unlike other platforms that charge $1 to $2 per imported contact, UrPass includes bulk imports in your standard subscription with 0% platform ticketing fees.",
      },
      {
        q: "Can we include custom fields like 'Dietary Preference' or 'VIP Table Number' in the import?",
        a: "Yes. Any column in your spreadsheet can be mapped to custom attendee attributes and displayed directly on the attendee's digital pass or gate scanner screen.",
      },
      {
        q: "How fast are passes sent to attendees after uploading?",
        a: "Pass generation begins immediately. A list of 1,000 attendees typically generates and dispatches via email in under 2 minutes.",
      },
      {
        q: "What happens if our spreadsheet contains duplicate email addresses?",
        a: "UrPass identifies duplicates during the pre-import preview screen and lets you choose whether to skip duplicates, overwrite previous entries, or import them as distinct tickets.",
      },
    ],
  },
  closingCtaSection: {
    badge: "START IMPORTING",
    title: "Upload Your Attendee Spreadsheet in Seconds",
    description: "Generate verified digital QR passes for your entire guest list. Free to start.",
    primaryCtaLabel: "Import Attendees Free",
    secondaryCtaLabel: "View Pricing Plans",
  },
};

/**
 * PAGE 034: Invite-Only Event Registration and Approval Software (Registration)
 */
export const PAGE_034_INVITE_ONLY_APPROVAL_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 034",
  pageId: "invite-only-event-registration-and-approval-software",
  slug: "invite-only-event-registration-and-approval-software",
  canonicalUrl: "https://urpass.space/solutions/invite-only-event-registration-and-approval-software",
  primaryKeyword: "invite-only event registration and approval software",
  secondaryKeywords: [
    "private event guest list approval",
    "curated guest list software",
    "event rsvp approval workflow",
    "exclusive event invitation vetting",
  ],
  market: "India, UK, US, and Global",
  audience: "Executive summit convenors, investor salon hosts, high-level policy directors, private club coordinators",
  searchIntent: "Commercial",
  conversionGoal: "Set up approval workflow",
  seoTitle: "Invite-Only Event Registration & Approval Software | UrPass",
  metaDescription:
    "Curate guest lists with manual approval workflows. Review applicant profiles, accept or reject with 1 click, and issue encrypted QR passes only to verified guests.",
  badge: "REGISTRATION // APPROVAL WORKFLOWS",
  h1: "Invite-Only Event Registration and Approval Software for Curated Audiences",
  heroSubtitle:
    "Keep exclusive gatherings private. Screen applications, review LinkedIn or corporate credentials, and issue QR passes only upon explicit organizer approval.",
  heroDescription:
    "UrPass Invite-Only Event Registration and Approval Software gives organizers total authority over who enters the room. Create private application forms, review attendee credentials in a centralized vetting queue, approve or reject applicants with 1 click, and automatically issue tamper-proof QR tickets exclusively to confirmed, verified guests.",
  primaryCtaLabel: "Create Private Event Free",
  secondaryCtaLabel: "See Approval Queue Demo",
  problemSection: {
    badge: "THE UNVETTED CROWD PROBLEM",
    title: "Why Open Event Registration Dilutes Exclusive Gatherings",
    paragraphs: [
      "High-level investor summits, executive masterminds, and closed-door roundtable discussions require strict attendee curation to maintain high room quality and networking relevance.",
      "Open registration links quickly get leaked on public social media, allowing spammers, unqualified vendors, and unaccredited visitors to sign up.",
      "Managing registration vetting through Google Forms and email threads forces organizers to manually cross-reference applicant profiles, send manual acceptance emails, and manually generate passes.",
      "UrPass integrates registration intake with an administrative approval queue: candidates submit applications, review teams vet credentials, and accepted guests receive their passes automatically.",
    ],
  },
  capabilitiesSection: {
    badge: "CURATION SUITE",
    title: "Enterprise Tools for Private & Curated Guest Lists",
    subtitle: "Built to preserve confidentiality, enforce audience standards, and streamline vetting.",
    items: [
      {
        stepNumber: "01",
        title: "Two-Stage 'Apply to Attend' Registration Pages",
        description:
          "Replace standard 'Buy Ticket' buttons with 'Request an Invitation' or 'Apply for Access'. Collect corporate email, LinkedIn profile, job title, and portfolio links.",
        bestFor: "Venture capital investor summits, high-profile tech salons, and exclusive executive roundtables.",
        technicalProof: "Custom intake pipeline isolating pending applicants in unconfirmed state until review.",
        icon: "file-text",
      },
      {
        stepNumber: "02",
        title: "Centralized Administrative Review Queue",
        description:
          "Review applicant profiles in a clean dashboard table. Bulk approve or decline candidates with 1 click or add internal team vetting notes.",
        bestFor: "Multi-member selection committees and executive review panels.",
        technicalProof: "State machine managing `PENDING_REVIEW`, `APPROVED`, and `DECLINED` lifecycle transitions.",
        icon: "users",
      },
      {
        stepNumber: "03",
        title: "Automated Acceptance Pass Issuance",
        description:
          "When an applicant is approved, UrPass instantly issues their personalized QR pass via WhatsApp and email, or triggers a private payment checkout link.",
        bestFor: "Curated paid events requiring payment collection only after profile approval.",
        technicalProof: "Event-driven webhook firing transactional pass generation upon approval status update.",
        icon: "zap",
      },
      {
        stepNumber: "04",
        title: "Secret / Unlisted Private Access Links",
        description:
          "Ensure public search engines and bots cannot crawl your private registration page. Enforce password protection or invite token restrictions.",
        bestFor: "Embargoed corporate briefings, celebrity dinners, and confidential policy discussions.",
        technicalProof: "Strict `noindex, nofollow` headers with optional HMAC-authenticated invitation tokens.",
        icon: "shield",
      },
    ],
  },
  howItWorksSection: {
    badge: "CURATION WORKFLOW",
    title: "How the Approval Workflow Operates in 4 Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Attendee Submits Application",
        description:
          "Candidate visits your private event page and submits their credentials (LinkedIn, Company, Bio).",
      },
      {
        stepNumber: "Step 2",
        title: "Application Lands in Review Queue",
        description:
          "Your team reviews pending submissions in the organizer dashboard and verifies qualifications.",
      },
      {
        stepNumber: "Step 3",
        title: "1-Click Approval or Polite Decline",
        description:
          "Approve candidates individually or in bulk. Custom automated emails notify applicants of their status.",
      },
      {
        stepNumber: "Step 4",
        title: "Approved Guests Receive QR Passes",
        description:
          "Approved guests receive their verified QR pass. Gate scanners recognize only officially approved tickets.",
      },
    ],
    ctaLabel: "Set Up Approval Queue",
  },
  eventTypesSection: {
    badge: "CURATED FORMATS",
    title: "Essential for Exclusive and High-Stakes Gatherings",
    items: [
      {
        title: "VC & Founder Investor Salons",
        description: "Ensure only accredited angel investors and verified institutional founders gain entry.",
        badge: "VENTURE CAPITAL",
      },
      {
        title: "Executive Roundtables & Dinners",
        description: "C-suite peer gatherings strictly vetted by revenue thresholds and corporate seniority.",
        badge: "C-SUITE",
      },
      {
        title: "Private Product Previews & Media Embargos",
        description: "Screen press and industry analysts prior to disclosing confidential product details.",
        badge: "PR & MEDIA",
      },
      {
        title: "Private Members Clubs & Societies",
        description: "Restricted member gatherings requiring active membership verification before pass release.",
        badge: "MEMBERSHIPS",
      },
    ],
  },
  comparisonSection: {
    badge: "WORKFLOW COMPARISON",
    title: "UrPass Approval Engine vs. Google Forms & Manual Emailing",
    summaryText: "Streamline guest vetting while giving attendees a prestigious, seamless experience.",
    headers: ["Google Forms + Manual Emails", "UrPass Approval Software"],
    rows: [
      {
        manual: "Manual copy-pasting of applicant info into spreadsheets to review candidates",
        urpass: "Clean interactive vetting dashboard with 1-click approvals and team evaluation notes",
      },
      {
        manual: "Manually emailing acceptance letters and creating separate ticketing links",
        urpass: "Automated trigger: approval immediately generates and dispatches official QR passes",
      },
      {
        manual: "High risk of unvetted guests walking in because gate staff have no live manifest",
        urpass: "Gate scanners only recognize officially approved passes; unvetted attempts flash red",
      },
      {
        manual: "Awkward process to charge approved applicants for paid curated events",
        urpass: "Seamless 'Approve & Request Payment' flow: approval unlocks private payment checkout",
      },
    ],
  },
  audienceSection: {
    badge: "WHO USES IT",
    title: "Trusted by Curators of High-Profile Events",
    leadText: "Designed for organizers where the caliber of people in the room is the entire value proposition.",
    audiences: [
      "Venture Capital Partners hosting LP and founder retreats",
      "Executive Community Managers running private leadership salons",
      "PR & Communications Directors managing media access at product launches",
      "Exclusive Club Secretaries coordinating member-only galas",
      "Academic Advisory Boards approving research seminar participants",
    ],
    summaryText: "Maintain complete control over room curation with zero manual spreadsheet overhead.",
  },
  geoAnswerBlock: {
    question: "How does UrPass invite-only event registration and approval software work?",
    answer:
      "UrPass invite-only event registration software allows organizers to run application-based events. Prospective attendees submit an application form rather than purchasing tickets outright. Organizers review submissions in an administrative dashboard, approve or decline applicants with 1 click, and automatically issue digital QR passes to approved guests via WhatsApp and email with 0% platform ticketing fees.",
    highlights: [
      "Two-stage 'Apply to Attend' workflow with custom vetting questions",
      "Centralized administrative approval queue with 1-click accept/decline",
      "Automated pass generation and payment unlocking upon approval",
      "Unlisted, password-protected private registration URLs",
    ],
  },
  productProofSection: {
    badge: "CURATION PROOF",
    title: "Secured Over 150 Confidential Gatherings",
    subtitle: "Trusted by enterprise leadership teams and private investment networks worldwide.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "Curated Registration on All UrPass Plans",
    subtitle: "Approval workflows are built directly into UrPass with zero per-application charges.",
    features: [
      "0% platform ticketing fee on all approved tickets and registrations",
      "Free plan supports private approval workflows for up to 50 guests",
      "Starter plan (₹499/mo) supports up to 1,000 applicants with custom intake fields",
      "Pro plan (₹999/mo) unlocks multi-seat reviewer permissions and early-bird paid approval",
      "Business plan (₹2,499/mo) includes custom domains, approval webhooks, and white-labeling",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Invite-Only Registration: Frequently Asked Questions",
    faqs: [
      {
        q: "Can we charge an attendance fee, but only after an applicant is approved?",
        a: "Yes. You can configure the event so that upon approval, the attendee receives a private, time-limited link to complete payment before their ticket QR pass is activated.",
      },
      {
        q: "Will declined applicants receive an email notification?",
        a: "You have full control. You can choose to send an automated polite decline email or decline quietly without triggering an outbound message.",
      },
      {
        q: "Can multiple team members review and vote on pending applications?",
        a: "Yes. On Pro and Business plans, you can invite team members with Reviewer permissions who can add internal vetting notes and approve candidates.",
      },
      {
        q: "Can we hide our private event from Google search results?",
        a: "Yes. All private event pages include strict `noindex, nofollow` headers and can be secured with access passwords or unique invite tokens.",
      },
      {
        q: "Can approved attendees forward their invitation pass to a colleague?",
        a: "No. The issued QR pass is cryptographically tied to the approved attendee's name and email, and UrPass anti-passback controls prevent multiple people from using the same pass.",
      },
    ],
  },
  closingCtaSection: {
    badge: "CURATE YOUR GUESTS",
    title: "Host an Exclusive Invite-Only Event",
    description: "Screen attendees, maintain high room caliber, and issue verified passes. Free to start.",
    primaryCtaLabel: "Create Private Event Free",
    secondaryCtaLabel: "Explore Features",
  },
};

/**
 * PAGE 035: Event Registration Forms with Custom Questions (Registration)
 */
export const PAGE_035_CUSTOM_QUESTIONS_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 035",
  pageId: "event-registration-forms-with-custom-questions",
  slug: "event-registration-forms-with-custom-questions",
  canonicalUrl: "https://urpass.space/solutions/event-registration-forms-with-custom-questions",
  primaryKeyword: "event registration forms with custom questions",
  secondaryKeywords: [
    "custom event registration form builder",
    "collect attendee custom fields",
    "conditional logic event forms",
    "event intake form with custom questions",
  ],
  market: "India, UK, US, and Global",
  audience: "Corporate event planners, workshop organizers, conference convenors, hackathon directors",
  searchIntent: "Transactional",
  conversionGoal: "Build custom form",
  seoTitle: "Event Registration Forms with Custom Questions | UrPass",
  metaDescription:
    "Build high-converting event registration forms with custom questions. Dropdowns, dietary preferences, company details, conditional fields, and instant QR ticketing.",
  badge: "REGISTRATION // FORM BUILDER",
  h1: "Event Registration Forms with Custom Questions and Seamless QR Issuance",
  heroSubtitle:
    "Collect the exact information your event needs. Dropdown menus, file uploads, dietary choices, and company details mapped straight to attendee passes.",
  heroDescription:
    "UrPass Event Registration Forms with Custom Questions empowers event organizers to create flexible, branded registration forms without rigid field limitations. Add text inputs, dropdown selectors, checkboxes, file uploads, and conditional questions, with all responses organized in a central dashboard and scannable at venue gates with 0% platform fees.",
  primaryCtaLabel: "Build Registration Form Free",
  secondaryCtaLabel: "See Custom Form Demo",
  problemSection: {
    badge: "RIGID FORM BOTTLENECKS",
    title: "Why Generic Event Registration Forms Fall Short",
    paragraphs: [
      "Standard ticketing platforms restrict organizers to basic Name and Email fields, forcing teams to circulate clumsy secondary Google Forms to collect critical logistics data.",
      "Managing attendee information across two disconnected systems leads to mismatched data, missing dietary preferences, and confusion over t-shirt sizes or workshop selections.",
      "Separating registration from ticketing means gate staff have no access to custom answers (like VIP table assignments or workshop track choices) when attendees arrive.",
      "UrPass integrates comprehensive custom intake forms directly into the registration and checkout process, embedding essential attendee answers directly into gate scanner screens.",
    ],
  },
  capabilitiesSection: {
    badge: "FORM BUILDER SUITE",
    title: "Everything You Need to Collect Precision Attendee Data",
    subtitle: "Built to capture complex corporate, academic, and workshop registration requirements.",
    items: [
      {
        stepNumber: "01",
        title: "Versatile Field Types & Validation",
        description:
          "Insert short text, long paragraphs, dropdown menus, multi-select checkboxes, phone numbers with country codes, and file uploads (resumes or IDs).",
        bestFor: "Hackathons, academic symposiums, corporate workshops, and medical conferences.",
        technicalProof: "Schema-validated JSON form fields with client and server-side regex validation.",
        icon: "sliders",
      },
      {
        stepNumber: "02",
        title: "Ticket-Specific Custom Questions",
        description:
          "Show questions only for specific ticket tiers: ask Student Delegates for their College ID, while asking Corporate Sponsors for their billing GSTIN.",
        bestFor: "Multi-tier events with differing intake requirements across attendee categories.",
        technicalProof: "Conditional field rendering evaluated dynamically against selected ticket tier IDs.",
        icon: "file-text",
      },
      {
        stepNumber: "03",
        title: "Gate Scanner Metadata Visibility",
        description:
          "Choose which custom answers appear on gate scanner screens when a pass is scanned (e.g. 'T-Shirt: XL' or 'Lunch: Vegan').",
        bestFor: "Merchandise distribution desks, banquet catering lines, and breakout session access.",
        technicalProof: "Selective field projection delivering designated custom keys to mobile scanner payloads.",
        icon: "scan-line",
      },
      {
        stepNumber: "04",
        title: "1-Click Full CSV / Excel Export",
        description:
          "Export complete attendee responses into cleanly formatted CSV or Excel files with dedicated columns for every single custom question.",
        bestFor: "Sharing catering requirements with venue banquet managers or sponsors.",
        technicalProof: "Flattened tabular serialization ensuring zero nested JSON artifacts in spreadsheet outputs.",
        icon: "zap",
      },
    ],
  },
  howItWorksSection: {
    badge: "FORM SETUP",
    title: "Create Your Custom Registration Form in 4 Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Open Form Builder in Dashboard",
        description:
          "Navigate to your event settings and select 'Registration Form Customization'.",
      },
      {
        stepNumber: "Step 2",
        title: "Add Custom Questions & Select Field Types",
        description:
          "Drag and drop fields: Job Title, Dietary Preference, T-Shirt Size, Workshop Track, or File Upload.",
      },
      {
        stepNumber: "Step 3",
        title: "Set Required Fields & Tier Conditions",
        description:
          "Mark fields as required or optional, and assign specific questions to specific ticket tiers.",
      },
      {
        stepNumber: "Step 4",
        title: "Publish Form & Collect Responses",
        description:
          "Attendees fill out the form during registration. Responses are instantly saved and linked to their QR pass.",
      },
    ],
    ctaLabel: "Build Custom Form",
  },
  eventTypesSection: {
    badge: "APPLICATIONS",
    title: "Tailored for Data-Intensive Event Operations",
    items: [
      {
        title: "Tech Hackathons & Competitions",
        description: "Collect GitHub profiles, dietary requirements, t-shirt sizes, and emergency contact details.",
        badge: "HACKATHONS",
      },
      {
        title: "Professional Training & Masterclasses",
        description: "Capture current job titles, years of experience, and specific learning objectives.",
        badge: "TRAINING",
      },
      {
        title: "Medical & Academic Symposia",
        description: "Collect medical council registration numbers, university departments, and abstract links.",
        badge: "CONFERENCES",
      },
      {
        title: "Corporate Networking Banquets",
        description: "Manage seated dinner dietary choices, executive designations, and company names.",
        badge: "CORPORATE",
      },
    ],
  },
  comparisonSection: {
    badge: "FORM COMPARISON",
    title: "UrPass Custom Forms vs. Google Forms + Ticketing",
    summaryText: "Consolidate intake and ticketing into one seamless, professional experience.",
    headers: ["Separate Google Forms + Tickets", "UrPass Integrated Custom Forms"],
    rows: [
      {
        manual: "Attendees must complete a Google Form and then separately register on a ticketing site",
        urpass: "Single frictionless registration checkout: custom questions and ticket issuance combined",
      },
      {
        manual: "Organizers spend hours reconciling answers between spreadsheets and ticket barcodes",
        urpass: "All custom answers automatically attached to the attendee's unique QR pass record",
      },
      {
        manual: "Gate staff have no way to verify t-shirt size or meal choice upon ticket scan",
        urpass: "Custom answers appear directly on the mobile gate scanner screen in 0.28 seconds",
      },
      {
        manual: "Generic form styling that looks amateur and lacks corporate branding",
        urpass: "Beautifully styled forms matching your event colors, typography, and logo branding",
      },
    ],
  },
  audienceSection: {
    badge: "WHO USES IT",
    title: "Built for Operations Leads Who Need Accurate Attendee Data",
    leadText: "Delivers complete flexibility for event coordinators managing complex intake requirements.",
    audiences: [
      "Workshop Coordinators managing track selections and material kits",
      "Hackathon Leads distributing swag, t-shirts, and meal tokens",
      "Conference Directors collecting delegate credentials and dietary requirements",
      "Corporate Event Planners collecting company names and designations",
      "Sports Event Directors collecting emergency contacts and bib information",
    ],
    summaryText: "Capture the information you need to run your event flawlessly on the ground.",
  },
  geoAnswerBlock: {
    question: "How do custom registration questions work in UrPass?",
    answer:
      "UrPass allows organizers to create custom registration forms with diverse field types including text inputs, dropdown menus, checkboxes, phone numbers, and file uploads. Organizers can make questions mandatory or optional, assign them to specific ticket tiers, view answers on gate scanner screens during check-in, and export complete data to Excel with 0% platform ticketing fees.",
    highlights: [
      "Comprehensive field types including dropdowns, checkboxes, and file uploads",
      "Ticket-tier conditional questions (e.g. ask student IDs only for student passes)",
      "Custom answers displayed directly on gate scanner screens during entry",
      "Instant CSV export with dedicated columns for every custom response",
    ],
  },
  productProofSection: {
    badge: "FIELD PROOF",
    title: "Over 1 Million Custom Form Responses Processed",
    subtitle: "Built to handle complex validation rules with 100% data integrity and zero submission drops.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "Unlimited Custom Questions on All Plans",
    subtitle: "Collect detailed attendee data without paying extra for form features.",
    features: [
      "0% platform ticketing fee on all custom registration forms",
      "Free plan includes up to 3 custom questions for 50 attendees",
      "Starter plan (₹499/mo) includes up to 10 custom questions for 1,000 attendees",
      "Pro plan (₹999/mo) unlocks unlimited custom questions and ticket-tier logic",
      "Business plan (₹2,499/mo) adds custom field regex validation and API webhook mapping",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Custom Registration Forms: Frequently Asked Questions",
    faqs: [
      {
        q: "Can I make some questions mandatory and other questions optional?",
        a: "Yes. Every custom question includes a toggle to mark it as required or optional.",
      },
      {
        q: "Can gate staff see custom answers when they scan an attendee's QR ticket?",
        a: "Yes. In your dashboard, you can select which custom fields (such as 'Meal Choice' or 'T-Shirt Size') should appear on the mobile gate scanner screen upon scan.",
      },
      {
        q: "Can I collect file attachments such as resumes or student ID photos?",
        a: "Yes. UrPass supports file upload fields allowing attendees to upload PDFs, PNGs, and JPEGs securely during registration.",
      },
      {
        q: "Can different ticket tiers have completely different questions?",
        a: "Yes. You can assign custom questions to specific ticket tiers so attendees only see fields relevant to their selected ticket.",
      },
      {
        q: "How can I export the answers for my catering or logistics team?",
        a: "You can download a full CSV or Excel export from your attendee dashboard with one click. Every custom question will have its own dedicated column.",
      },
    ],
  },
  closingCtaSection: {
    badge: "CUSTOM FORMS",
    title: "Build Your Custom Event Registration Form",
    description: "Start collecting the attendee data you actually need. Free to start, zero coding required.",
    primaryCtaLabel: "Build Registration Form Free",
    secondaryCtaLabel: "Explore All Features",
  },
};

/**
 * PAGE 036: Event Ticket Sales with Early Bird and VIP Pricing (Payments)
 * [TOP 5 BUSINESS DRIVER #36]
 */
export const PAGE_036_EARLY_BIRD_VIP_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 036",
  pageId: "event-ticket-sales-with-early-bird-and-vip-pricing",
  slug: "event-ticket-sales-with-early-bird-and-vip-pricing",
  canonicalUrl: "https://urpass.space/solutions/event-ticket-sales-with-early-bird-and-vip-pricing",
  primaryKeyword: "event ticket sales with early bird and vip pricing",
  secondaryKeywords: [
    "early bird ticket pricing software",
    "tiered event ticketing platform",
    "vip event ticket sales",
    "time-limited event ticket tiers",
  ],
  market: "India, UK, US, and Global",
  audience: "Conference producers, festival promoters, workshop instructors, event entrepreneurs",
  searchIntent: "Transactional",
  conversionGoal: "Launch tiered ticketing",
  seoTitle: "Event Ticket Sales with Early Bird & VIP Pricing | UrPass",
  metaDescription:
    "Maximize event revenue with automated early bird countdowns, tiered pricing, and VIP ticket perks. Instant Razorpay & Stripe payouts with 0% platform fee.",
  badge: "PAYMENTS // TIERED TICKETING",
  h1: "Event Ticket Sales with Early Bird Countdowns and VIP Tiered Pricing",
  heroSubtitle:
    "Drive early momentum and maximize ticket revenue. Automated countdown timers, tiered ticket caps, VIP perks, and direct bank deposits with 0% platform commission.",
  heroDescription:
    "UrPass Event Ticket Sales with Early Bird and VIP Pricing provides event organizers with advanced revenue-optimization tools. Configure automated early-bird price jumps based on time or inventory caps, offer high-margin VIP passes with exclusive perks, and receive ticket revenues directly into your bank account via Razorpay or Stripe with 0% platform fee.",
  primaryCtaLabel: "Launch Tiered Ticketing Free",
  secondaryCtaLabel: "Calculate Ticketing Savings",
  problemSection: {
    badge: "LOST TICKET REVENUE",
    title: "Why Flat-Price Ticketing Leaves Thousands on the Table",
    paragraphs: [
      "Offering a single, flat-priced ticket creates zero urgency for early buyers, leaving organizers sweating cash flow until the final 48 hours before the event.",
      "Generic ticketing portals deduct aggressive 5% to 10% platform commissions plus payment fees from every sold ticket, draining your marketing budget.",
      "Manually creating new ticket tiers, remembering to deactivate early-bird discounts at midnight, and adjusting sold-out quotas across platforms leads to pricing mistakes and angry customers.",
      "UrPass automates tiered ticketing: early bird tiers expire automatically when quotas fill or deadlines pass, shifting buyers smoothly into standard and VIP tiers with 0% platform commission.",
    ],
  },
  capabilitiesSection: {
    badge: "PRICING ENGINE FEATURES",
    title: "Dynamic Revenue Optimization for Modern Organizers",
    subtitle: "Built to drive urgency, reward early supporters, and monetize premium attendee experiences.",
    items: [
      {
        stepNumber: "01",
        title: "Automated Early Bird Expiration Rules",
        description:
          "Set early-bird tiers to expire automatically on a specific calendar date/time OR immediately when an inventory cap (e.g. first 100 tickets) is reached.",
        bestFor: "Driving early ticket sales momentum and securing event operating cash flow.",
        technicalProof: "Atomic decrement triggers auto-transitioning ticket tier availability upon quota completion.",
        icon: "zap",
      },
      {
        stepNumber: "02",
        title: "High-Margin VIP Tier Customization",
        description:
          "Create exclusive VIP, Founder, or Patron tiers with dedicated pass artwork, exclusive zone gate access, and custom perks shown on the pass.",
        bestFor: "Conferences, multi-day festivals, and high-end workshops commanding $500+ ticket prices.",
        technicalProof: "Tier-specific pass styling and zone permission assignment linked directly to ticket SKUs.",
        icon: "shield",
      },
      {
        stepNumber: "03",
        title: "0% Platform Commission Ticketing",
        description:
          "Unlike Eventbrite which charges up to 10% per ticket, UrPass charges 0% platform commission. 100% of your ticket revenue goes straight to your account.",
        bestFor: "Saving thousands of dollars on paid events selling 100 to 5,000+ tickets.",
        technicalProof: "Direct merchant settlement via Razorpay (India) and Stripe (Global) with zero intermediary platform escrow.",
        icon: "file-text",
      },
      {
        stepNumber: "04",
        title: "Real-Time Tier Velocity Analytics",
        description:
          "Monitor ticket sales velocity across Super Early Bird, Early Bird, General, and VIP tiers with conversion rates and live gross revenue tracking.",
        bestFor: "Adjusting marketing spend and social ad campaigns based on real-time tier demand.",
        technicalProof: "Aggregated sales telemetry refreshed in real time with hourly conversion tracking.",
        icon: "scan-line",
      },
    ],
  },
  howItWorksSection: {
    badge: "SETUP WORKFLOW",
    title: "Launch Tiered Event Ticketing in 4 Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Create Ticket Tiers & Set Prices",
        description:
          "Add tiers: 'Early Bird (₹999)', 'Standard (₹1,499)', and 'VIP All-Access (₹2,999)'.",
      },
      {
        stepNumber: "Step 2",
        title: "Set Auto-Expiration Triggers",
        description:
          "Define early bird limits: e.g. 'Expires on Oct 15 at 11:59 PM or after first 50 tickets sold'.",
      },
      {
        stepNumber: "Step 3",
        title: "Connect Payment Gateway",
        description:
          "Link your Razorpay or Stripe account in 1 click for direct, immediate payouts to your bank.",
      },
      {
        stepNumber: "Step 4",
        title: "Watch Tickets Sell with Zero Fees",
        description:
          "Attendees purchase via UPI, credit/debit cards, or netbanking. UrPass takes 0% platform fee.",
      },
    ],
    ctaLabel: "Launch Tiered Ticketing",
  },
  eventTypesSection: {
    badge: "PROVEN USE CASES",
    title: "Maximizing Revenue Across Premier Event Formats",
    items: [
      {
        title: "Technology & Industry Conferences",
        description: "Super Early Bird for alumni, standard delegate passes, and VIP executive passes with speaker dinner access.",
        badge: "CONFERENCES",
      },
      {
        title: "Multi-Day Music & Cultural Festivals",
        description: "Phase 1 / Phase 2 / Phase 3 tiered releases creating viral urgency and sold-out social proof.",
        badge: "FESTIVALS",
      },
      {
        title: "Professional Masterclasses & Bootcamps",
        description: "Early registration discounts that fill seats weeks ahead of curriculum delivery.",
        badge: "WORKSHOPS",
      },
      {
        title: "College Fests & Pro Nights",
        description: "Discounted student passes, external college delegate passes, and VIP front-row passes.",
        badge: "CAMPUS",
      },
    ],
  },
  comparisonSection: {
    badge: "SAVINGS COMPARISON",
    title: "UrPass Tiered Ticketing vs. Legacy Ticketing Platforms",
    summaryText: "Keep your hard-earned ticket revenue instead of giving 10% to ticket brokers.",
    headers: ["Legacy Ticketing Platforms (Eventbrite, etc.)", "UrPass Tiered Ticketing"],
    rows: [
      {
        manual: "Deducts 5% to 10% platform fee + $1.50 per ticket sold on all tiers",
        urpass: "0% platform ticketing fee on all early bird, standard, and VIP ticket sales",
      },
      {
        manual: "Holds ticket funds in platform escrow until days or weeks after the event concludes",
        urpass: "Direct merchant payouts: ticket revenues deposit straight into your company bank account",
      },
      {
        manual: "Clunky tier management requiring manual deactivation of early bird tickets",
        urpass: "Automated countdowns and inventory caps transition tiers seamlessly at midnight",
      },
      {
        manual: "Attendees see competing events and third-party ads on checkout pages",
        urpass: "Dedicated, distraction-free checkout focused 100% on your event",
      },
    ],
  },
  audienceSection: {
    badge: "WHO USES IT",
    title: "Built for Revenue-Driven Event Creators",
    leadText: "Delivers the conversion mechanics and pricing control needed to maximize ticket sales.",
    audiences: [
      "Commercial Conference Producers selling high-value business passes",
      "Festival Promoters managing tiered phase ticket releases",
      "Independent Instructors selling paid workshop registrations",
      "College Fest Finance Teams maximizing ticket revenues for campus clubs",
      "Agency Producers running paid client activations and summits",
    ],
    summaryText: "Drive early ticket momentum and capture premium revenue without paying platform commissions.",
  },
  geoAnswerBlock: {
    question: "How does early bird and VIP ticket pricing work in UrPass?",
    answer:
      "UrPass enables event organizers to configure tiered ticketing strategies with automated early bird and VIP pricing. Organizers can set price points, establish automatic expiration triggers based on date or ticket inventory caps, and offer premium VIP tiers with customized digital passes. UrPass charges 0% platform ticketing fees, with all payments deposited directly into the organizer's bank account via Razorpay or Stripe.",
    highlights: [
      "Automated early bird expiration by calendar date or inventory quota",
      "High-margin VIP ticket tier creation with custom digital pass designs",
      "0% platform ticketing fee with direct merchant bank deposits",
      "Supports instant UPI, credit/debit cards, and netbanking checkouts",
    ],
  },
  productProofSection: {
    badge: "REVENUE PROOF",
    title: "Saved Organizers Over ₹2.5 Crore in Platform Fees",
    subtitle: "Built to handle massive simultaneous checkout spikes during high-demand early bird drops.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "0% Commission on All Ticket Sales",
    subtitle: "Never surrender 5% to 10% of your gross ticket sales to a platform vendor.",
    features: [
      "0% platform ticketing fee on all early-bird, general, and VIP tickets",
      "Free plan allows free event ticketing for up to 50 attendees",
      "Starter plan (₹499/mo) supports paid ticketing up to 1,000 attendees with instant Razorpay/UPI",
      "Pro plan (₹999/mo) unlocks advanced tiered ticketing, early bird timers, and 5,000 attendees",
      "Business plan (₹2,499/mo) adds custom checkout domains, webhook triggers, and 15,000 attendees",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Early Bird & VIP Ticketing: Frequently Asked Questions",
    faqs: [
      {
        q: "What payment gateways can I use to collect ticket funds?",
        a: "UrPass integrates directly with Razorpay in India (supporting UPI, Google Pay, PhonePe, Paytm, cards, and netbanking) and Stripe globally (supporting international credit and debit cards).",
      },
      {
        q: "Does UrPass hold our ticket sales money until after the event?",
        a: "No. All ticket sales funds are processed directly through your own connected Razorpay or Stripe account and deposited straight into your bank account according to your standard gateway payout schedule.",
      },
      {
        q: "What happens when an early bird quota sells out?",
        a: "The early bird tier is automatically marked 'Sold Out', and buyers are immediately guided to purchase the next available tier without any manual intervention required from your team.",
      },
      {
        q: "Can I show a live countdown timer for early bird tickets?",
        a: "Yes. You can enable an animated countdown timer on your registration page showing days, hours, and minutes remaining until early bird pricing ends.",
      },
      {
        q: "Can I set purchase limits (e.g. maximum 4 VIP tickets per buyer)?",
        a: "Yes. You can configure minimum and maximum ticket purchase limits per transaction for each tier to prevent bulk scalping.",
      },
    ],
  },
  closingCtaSection: {
    badge: "START SELLING",
    title: "Launch Tiered Event Ticketing with 0% Fees",
    description: "Start selling early-bird and VIP tickets today. Keep 100% of your ticket revenue.",
    primaryCtaLabel: "Launch Tiered Ticketing Free",
    secondaryCtaLabel: "Explore Pricing Plans",
  },
};

/**
 * PAGE 037: Event Ticket Discount Code Management Software (Payments)
 */
export const PAGE_037_DISCOUNT_CODES_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 037",
  pageId: "event-ticket-discount-code-management-software",
  slug: "event-ticket-discount-code-management-software",
  canonicalUrl: "https://urpass.space/solutions/event-ticket-discount-code-management-software",
  primaryKeyword: "event ticket discount code management software",
  secondaryKeywords: [
    "promo code event ticketing software",
    "event promo code generator",
    "coupon management for event tickets",
    "affiliate tracking promo codes event",
  ],
  market: "India, UK, US, and Global",
  audience: "Event marketing leads, festival promoters, association partnerships leads, workshop growth teams",
  searchIntent: "Commercial",
  conversionGoal: "Create promo codes",
  seoTitle: "Event Ticket Discount Code Management Software | UrPass",
  metaDescription:
    "Create and track promo codes for event tickets. Percentage and flat discounts, usage caps, tier restrictions, and partner affiliate tracking with 0% fees.",
  badge: "PAYMENTS // PROMO CODES",
  h1: "Event Ticket Discount Code Management Software for Strategic Partnerships",
  heroSubtitle:
    "Generate promo codes in bulk. Percentage or flat discounts, usage limits, tier restrictions, and partner affiliate tracking with 0% platform ticketing fees.",
  heroDescription:
    "UrPass Event Ticket Discount Code Management Software enables event marketers and partnership leads to create, distribute, and track promotional codes with surgical precision. Configure flat or percentage discounts, restrict codes to specific ticket tiers or expiry dates, generate bulk codes for corporate partners, and track promotional ROI in real time.",
  primaryCtaLabel: "Create Promo Codes Free",
  secondaryCtaLabel: "See Promo Code Demo",
  problemSection: {
    badge: "PROMO CODE CHAOS",
    title: "Why Messy Discount Codes Waste Event Marketing Budgets",
    paragraphs: [
      "Circulating generic promo codes without usage limits often backfires when codes leak to public coupon aggregation sites, cannibalizing full-price ticket sales.",
      "Traditional event portals make it difficult to restrict discount codes to specific ticket tiers, allowing attendees to improperly apply 50% student discounts to VIP passes.",
      "Event marketers struggle to track which media partner, student ambassador, or sponsor actually drove ticket sales because promo code analytics are buried or nonexistent.",
      "UrPass provides complete coupon governance: set exact redemption limits, restrict codes to specific email domains or ticket tiers, and view real-time partner affiliate analytics.",
    ],
  },
  capabilitiesSection: {
    badge: "COUPON ENGINE FEATURES",
    title: "Precision Promotional Governance for Event Marketers",
    subtitle: "Built to support marketing collaborations, sponsor allocations, and early-bird campaigns.",
    items: [
      {
        stepNumber: "01",
        title: "Percentage & Flat Amount Discounts",
        description:
          "Configure flexible discount models: e.g. 20% off total order, ₹500 flat discount, or 100% complimentary pass codes for speakers and sponsors.",
        bestFor: "Flash sales, sponsor coupon allotments, and influencer marketing campaigns.",
        technicalProof: "Atomic math evaluation guaranteeing round-down precision with minimum transaction bounds.",
        icon: "sliders",
      },
      {
        stepNumber: "02",
        title: "Granular Usage Limits & Expiration Dates",
        description:
          "Set maximum total redemptions (e.g. 'first 50 people only'), per-user limits, and automated calendar expiration down to the exact minute.",
        bestFor: "Preventing leaked codes from being overused on community forums.",
        technicalProof: "Database row locking during checkout to prevent concurrent race-condition over-redemptions.",
        icon: "shield",
      },
      {
        stepNumber: "03",
        title: "Tier-Specific & Category Restrictions",
        description:
          "Lock promo codes to specific ticket categories: ensure code 'STUDENT30' applies only to Student tickets and cannot discount VIP passes.",
        bestFor: "Protecting high-margin ticket inventory from unauthorized promotional discounts.",
        technicalProof: "Array-matching validation evaluating promo applicability against line-item ticket IDs.",
        icon: "file-text",
      },
      {
        stepNumber: "04",
        title: "Partner & Affiliate Conversion Attribution",
        description:
          "Track gross revenue and ticket volume driven by individual partner codes (e.g. 'PARTNER_TECHCORP' vs. 'COMMUNITY_BANGALORE').",
        bestFor: "Calculating partner commission payouts and assessing co-marketing effectiveness.",
        technicalProof: "Attribution logging attaching promo code campaign tags to completed checkout orders.",
        icon: "zap",
      },
    ],
  },
  howItWorksSection: {
    badge: "PROMO WORKFLOW",
    title: "Deploy Promo Codes in 4 Simple Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Create Promo Code in Dashboard",
        description:
          "Enter your custom code string (e.g. 'SUMMER25' or 'SPONSORVIP') and choose discount type.",
      },
      {
        stepNumber: "Step 2",
        title: "Set Rules & Restrictions",
        description:
          "Define total usage limit, expiration date, and which ticket tiers the discount applies to.",
      },
      {
        stepNumber: "Step 3",
        title: "Share Code or Embed in Direct Links",
        description:
          "Share the code directly or use 1-click auto-apply URL links that pre-fill the discount at checkout.",
      },
      {
        stepNumber: "Step 4",
        title: "Monitor Redemptions Live",
        description:
          "Watch redemption counts, revenue generated, and partner performance metrics in real time.",
      },
    ],
    ctaLabel: "Generate First Promo Code",
  },
  eventTypesSection: {
    badge: "CAMPAIGNS",
    title: "Proven Across Diverse Marketing Scenarios",
    items: [
      {
        title: "Sponsor & Media Partner Allotments",
        description: "Give each corporate sponsor a unique complimentary or 20% discount code for their internal staff.",
        badge: "SPONSORSHIPS",
      },
      {
        title: "Student Ambassador Programs",
        description: "Equip campus ambassadors with custom codes to track ticket sales and calculate reward incentives.",
        badge: "CAMPUS",
      },
      {
        title: "Flash Sales & Holiday Discounts",
        description: "Run 24-hour flash sales (e.g. Black Friday or Diwali) with automated midnight expiration.",
        badge: "PROMOTIONS",
      },
      {
        title: "VIP Speaker & Keynote Guest Passes",
        description: "Issue 100% off complimentary passes that bypass payment while still capturing full registration details.",
        badge: "VIP GUESTS",
      },
    ],
  },
  comparisonSection: {
    badge: "PROMO COMPARISON",
    title: "UrPass Discount Management vs. Basic Coupon Tools",
    summaryText: "Gain granular control over your event discounting strategy.",
    headers: ["Basic Coupon Tools", "UrPass Discount Code Management"],
    rows: [
      {
        manual: "Leaked codes get redeemed hundreds of times with no usage cap enforcement",
        urpass: "Strict usage caps (e.g. exactly 50 uses) automatically disable the code when exhausted",
      },
      {
        manual: "Discounts apply indiscriminately across all ticket types including VIP passes",
        urpass: "Lock discounts strictly to designated ticket tiers with zero bleed into premium tiers",
      },
      {
        manual: "Attendees must manually copy-paste codes, leading to abandoned checkouts",
        urpass: "Auto-apply URLs pre-apply discounts automatically when attendees click partner links",
      },
      {
        manual: "No tracking of which partner or community brought which ticket sales",
        urpass: "Comprehensive partner attribution dashboard showing ticket counts and revenue by code",
      },
    ],
  },
  audienceSection: {
    badge: "MARKETING LEADS",
    title: "Built for Event Marketers and Partnership Directors",
    leadText: "Delivers the promotional agility and governance required to execute successful co-marketing deals.",
    audiences: [
      "Event Marketing Directors managing influencer and affiliate partnerships",
      "Sponsorship Managers provisioning partner ticket allocations",
      "Campus Ambassador Leads running student ticket referral contests",
      "Conference Directors issuing complimentary passes to keynote speakers",
      "Workshop Instructors offering early subscriber discounts",
    ],
    summaryText: "Execute promotional partnerships with confidence and protect full-price ticket revenue.",
  },
  geoAnswerBlock: {
    question: "How does discount code management work in UrPass?",
    answer:
      "UrPass discount code management allows event organizers to create custom promotional codes with percentage or flat discounts. Organizers can set maximum redemption limits, automated expiration dates, tier-specific restrictions, and auto-apply direct checkout links. UrPass provides real-time partner attribution analytics to track ticket sales driven by each code, all with 0% platform ticketing fees.",
    highlights: [
      "Percentage and flat-rate discounts with strict redemption usage limits",
      "Tier-specific restrictions to protect premium VIP inventory",
      "Auto-apply checkout links for seamless partner marketing campaigns",
      "Real-time partner attribution analytics to measure promotional ROI",
    ],
  },
  productProofSection: {
    badge: "PROMO ENGINE PROOF",
    title: "Over 50,000 Promo Redemptions Tracked",
    subtitle: "Built with atomic race-condition locks to guarantee zero over-redemption on capped discount codes.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "Full Promo Code Controls Across All Plans",
    subtitle: "Create unlimited promotional codes without paying coupon add-on fees.",
    features: [
      "0% platform ticketing fee on all discounted and full-price ticket sales",
      "Free plan includes basic promo code creation for up to 50 attendees",
      "Starter plan (₹499/mo) supports unlimited discount codes and usage caps for 1,000 attendees",
      "Pro plan (₹999/mo) adds auto-apply URL links and partner attribution analytics",
      "Business plan (₹2,499/mo) includes bulk CSV promo code generation and API hooks",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Discount Code Management: Frequently Asked Questions",
    faqs: [
      {
        q: "Can I create 100% off complimentary passes for speakers and sponsors?",
        a: "Yes. Setting a discount of 100% allows recipients to complete registration and receive official QR passes without being prompted for credit card or payment details.",
      },
      {
        q: "Can I share a link that automatically applies the discount for buyers?",
        a: "Yes. UrPass generates auto-apply URLs (e.g. `urpass.space/e/summit?code=PARTNER20`) that automatically apply the discount code when the attendee opens the page.",
      },
      {
        q: "Can I generate 500 unique single-use promo codes in bulk?",
        a: "Yes. On Pro and Business plans, you can generate hundreds of unique single-use voucher codes in bulk and export them to a CSV file to share with corporate partners.",
      },
      {
        q: "Can I restrict a discount code so only one specific company can use it?",
        a: "Yes. You can restrict discount codes to specific email domains (e.g. `@google.com` or `@university.edu`), preventing unauthorized public use.",
      },
      {
        q: "Does UrPass charge fees on the full price or the discounted price?",
        a: "UrPass charges 0% platform ticketing fee regardless. Payment gateway fees (Razorpay or Stripe) apply only to the actual discounted amount collected from the buyer.",
      },
    ],
  },
  closingCtaSection: {
    badge: "LAUNCH PROMOS",
    title: "Power Your Event Partnerships with Smart Promo Codes",
    description: "Create discount codes with usage caps and partner tracking today. Free to start.",
    primaryCtaLabel: "Create Promo Codes Free",
    secondaryCtaLabel: "Explore Payments",
  },
};

/**
 * PAGE 038: Event Registration Software with GST Invoice Support (Payments)
 */
export const PAGE_038_GST_INVOICE_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 038",
  pageId: "event-registration-software-with-gst-invoice-support",
  slug: "event-registration-software-with-gst-invoice-support",
  canonicalUrl: "https://urpass.space/solutions/event-registration-software-with-gst-invoice-support",
  primaryKeyword: "event registration software with gst invoice support",
  secondaryKeywords: [
    "gst compliant event ticketing india",
    "b2b event tax invoice generator",
    "gstin collection event registration",
    "sac code 998313 event invoicing",
  ],
  market: "India Focus, with Global applicability",
  audience: "Corporate conference organizers, Indian event management companies, trade associations, B2B summit convenors",
  searchIntent: "Transactional",
  conversionGoal: "Generate GST invoices",
  seoTitle: "Event Registration Software with GST Invoice Support | UrPass",
  metaDescription:
    "Automate 18% GST tax invoices for Indian event ticket sales. GSTIN validation, SAC Code 998313, legal business billing, and instant PDF invoice downloads.",
  badge: "PAYMENTS // GST COMPLIANCE",
  h1: "Event Registration Software with Automated GST Tax Invoices and Input Tax Credit",
  heroSubtitle:
    "Stop manually writing tax invoices. Automated GSTIN collection, 18% GST calculation, SAC Code 998313 compliance, and instant downloadable PDF tax invoices.",
  heroDescription:
    "UrPass Event Registration Software with GST Invoice Support is built specifically for Indian corporate events, conferences, and exhibitions. Automatically collect verified company GSTINs during registration, calculate CGST/SGST or IGST based on state codes, issue compliant B2B tax invoices with SAC Code 998313, and provide attendees with downloadable PDF invoices for seamless Input Tax Credit (ITC) claiming.",
  primaryCtaLabel: "Enable GST Invoicing Free",
  secondaryCtaLabel: "See GST Invoice Sample",
  problemSection: {
    badge: "B2B COMPLIANCE HEADACHE",
    title: "Why Manual GST Invoicing Derails Indian B2B Event Finance",
    paragraphs: [
      "Corporate delegates and sponsoring companies demand valid GST tax invoices with their company's GSTIN and state code to claim 18% Input Tax Credit on event registrations.",
      "Generic global ticketing platforms (like Eventbrite) fail to support Indian GST requirements, issuing generic dollar receipts that Indian finance and accounting departments reject.",
      "Event organizers spend days after every conference manually creating hundreds of Word or Tally tax invoices, calculating intra-state vs. inter-state GST, and emailing them individually.",
      "UrPass automates Indian event tax compliance: collect GSTINs at checkout, validate legal company entities, calculate 18% GST automatically, and dispatch compliant tax invoices instantly.",
    ],
  },
  capabilitiesSection: {
    badge: "GST SUITE CAPABILITIES",
    title: "End-to-End Indian Tax Invoicing Built for Event Organizers",
    subtitle: "Built strictly in accordance with Indian Goods and Services Tax guidelines.",
    items: [
      {
        stepNumber: "01",
        title: "Automated GSTIN Collection & Checksum Validation",
        description:
          "Corporate buyers check 'I need a GST invoice' and enter their 15-character GSTIN. UrPass validates state codes and entity checksums in real time.",
        bestFor: "Preventing typos and rejected ITC claims from corporate delegate companies.",
        technicalProof: "Regex and Luhn-mod-36 checksum verification evaluating 15-digit GSTIN formats.",
        icon: "shield",
      },
      {
        stepNumber: "02",
        title: "Intra-State (CGST+SGST) vs. Inter-State (IGST) Split",
        description:
          "Automatically compares the organizer's registered state code with the buyer's GSTIN state code to correctly split taxes into CGST (9%) + SGST (9%) or IGST (18%).",
        bestFor: "Flawless GSTR-1 monthly filing without accounting manual reconciliation.",
        technicalProof: "State code extraction comparing prefix digits to determine supply destination rules.",
        icon: "file-text",
      },
      {
        stepNumber: "03",
        title: "Compliant PDF Tax Invoices with SAC Code 998313",
        description:
          "Generates professional, serial-numbered PDF tax invoices bearing your company name, GSTIN, SAC Code 998313 (Event Management Services), and digital signature.",
        bestFor: "Meeting statutory requirements under Section 31 of the CGST Act.",
        technicalProof: "Serverless PDF rendering with immutable invoice numbering sequences and QR code verification.",
        icon: "scan-line",
      },
      {
        stepNumber: "04",
        title: "Comprehensive GSTR-1 Ready Sales Export",
        description:
          "Download a complete monthly or per-event Excel report pre-formatted for direct import into Tally, Zoho Books, or ClearTax for GSTR-1 return filing.",
        bestFor: "Saving your chartered accountant hours during monthly return preparation.",
        technicalProof: "Pre-structured CSV export matching the GSTN portal B2B and B2C invoice schema.",
        icon: "zap",
      },
    ],
  },
  howItWorksSection: {
    badge: "INVOICE FLOW",
    title: "How Automated GST Invoicing Works in 4 Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Add Your Business GST Details",
        description:
          "Enter your registered company legal name, GSTIN, registered address, and state in event settings.",
      },
      {
        stepNumber: "Step 2",
        title: "Buyer Enters GSTIN at Checkout",
        description:
          "Corporate buyer enters their GSTIN and registered company name during ticket registration.",
      },
      {
        stepNumber: "Step 3",
        title: "Automatic Tax Calculation & Invoice Generation",
        description:
          "UrPass calculates the exact CGST/SGST/IGST breakdown and attaches a PDF tax invoice to the ticket email.",
      },
      {
        stepNumber: "Step 4",
        title: "Download GSTR-1 Report for Filing",
        description:
          "Export your sales manifest pre-formatted for your accountant, Tally, or ClearTax.",
      },
    ],
    ctaLabel: "Enable GST Invoicing",
  },
  eventTypesSection: {
    badge: "B2B EVENTS",
    title: "Essential for Indian Corporate & Business Gatherings",
    items: [
      {
        title: "National B2B Conferences & Summits",
        description: "Where 80%+ of delegate tickets are paid by corporate employer bank accounts requiring ITC.",
        badge: "CONFERENCES",
      },
      {
        title: "Trade Exhibitions & Industrial Expos",
        description: "Exhibitor stall bookings and visitor trade passes requiring formal tax invoices.",
        badge: "EXPOS",
      },
      {
        title: "Executive Training & Certification Courses",
        description: "Professional learning programs funded by corporate training and development budgets.",
        badge: "TRAINING",
      },
      {
        title: "Medical & Engineering Association Conferences",
        description: "Official delegate fees requiring tax compliance for hospital and institution reimbursements.",
        badge: "ASSOCIATIONS",
      },
    ],
  },
  comparisonSection: {
    badge: "COMPLIANCE COMPARISON",
    title: "UrPass GST Invoicing vs. Generic International Ticketing",
    summaryText: "Eliminate post-event invoice chasing with native Indian tax compliance.",
    headers: ["Generic Global Ticketing (Eventbrite, etc.)", "UrPass GST Invoice Engine"],
    rows: [
      {
        manual: "Issues generic USD/GBP receipts without GSTIN, state code, or SAC classification",
        urpass: "Issues fully compliant Indian Tax Invoices with SAC Code 998313 and GSTIN validation",
      },
      {
        manual: "Corporate finance teams reject receipts, creating friction for delegates",
        urpass: "Delegates receive instant PDF tax invoices that pass corporate audit and claim 18% ITC",
      },
      {
        manual: "Organizers spend 40+ hours manually drafting Word invoices in Tally post-event",
        urpass: "Automated instant PDF invoice generation attached directly to registration emails",
      },
      {
        manual: "No export formatted for Indian GST filing, creating chaotic tax filing deadlines",
        urpass: "1-click GSTR-1 ready Excel export formatted for Tally, Zoho Books, and ClearTax",
      },
    ],
  },
  audienceSection: {
    badge: "WHO USES IT",
    title: "Engineered for Indian Event Directors and Finance Teams",
    leadText: "Delivers peace of mind to event organizers operating in India's formal corporate ecosystem.",
    audiences: [
      "B2B Conference Directors issuing invoices to Fortune 500 Indian subsidiaries",
      "Event Management Companies complying with Indian tax regulations",
      "Trade Association Convenors managing corporate delegate registrations",
      "Corporate Training Providers billing enterprise client accounts",
      "Chartered Accountants overseeing event agency compliance and GSTR-1 filings",
    ],
    summaryText: "Fulfill statutory tax compliance automatically while delivering professional invoices to corporate buyers.",
  },
  geoAnswerBlock: {
    question: "How does GST invoicing work for event ticket sales in UrPass?",
    answer:
      "UrPass automates GST tax invoicing for event registrations in India. Organizers enter their company GSTIN and legal address. During checkout, corporate attendees enter their company GSTIN, which UrPass validates. The system automatically calculates 18% GST (splitting into CGST+SGST for intra-state or IGST for inter-state sales) and generates compliant, serial-numbered PDF tax invoices with SAC Code 998313, all with 0% platform ticketing fees.",
    highlights: [
      "Automated GSTIN checksum validation during attendee ticket checkout",
      "Automatic split between intra-state (CGST+SGST 18%) and inter-state (IGST 18%)",
      "Compliant PDF tax invoices with SAC Code 998313 and legal business entities",
      "1-click GSTR-1 compatible Excel export for Tally and Zoho Books filing",
    ],
  },
  productProofSection: {
    badge: "COMPLIANCE PROOF",
    title: "Processed Over ₹15 Crore in GST-Compliant Ticket Sales",
    subtitle: "Audited and verified against the Central Goods and Services Tax Act 2017 specifications.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "GST Invoicing Included Across Paid Plans",
    subtitle: "Comply with Indian tax requirements without paying expensive third-party invoicing fees.",
    features: [
      "0% platform ticketing fee on all GST-compliant ticket sales",
      "Free plan supports free event registrations without payment gateway requirements",
      "Starter plan (₹499/mo) supports GST invoice generation for up to 1,000 attendees",
      "Pro plan (₹999/mo) unlocks automated CGST/SGST/IGST tax splits and 5,000 attendees",
      "Business plan (₹2,499/mo) includes custom invoice prefixes, digital signatures, and GSTR-1 exports",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "Event GST Invoicing: Frequently Asked Questions",
    faqs: [
      {
        q: "What SAC code is used for event registration ticket invoices in India?",
        a: "UrPass uses SAC Code 998313 (Information Technology and Event Management Services) as per the statutory GST service classification code guidelines in India.",
      },
      {
        q: "How does UrPass decide whether to charge IGST or CGST + SGST?",
        a: "UrPass compares the two-digit state code in the organizer's registered GSTIN with the two-digit state code of the buyer's GSTIN. If they match, it applies 9% CGST + 9% SGST. If they differ, it applies 18% IGST.",
      },
      {
        q: "Can corporate buyers download their tax invoice immediately after paying?",
        a: "Yes. The official tax invoice PDF is attached directly to their confirmation email and is also accessible via their digital pass management page.",
      },
      {
        q: "What if an individual buyer does not have a GSTIN?",
        a: "If the attendee registers as an individual (B2C), the system treats it as an unregistered sale, includes GST in the consumer receipt as required by law, and assigns it to B2C sales in your tax reports.",
      },
      {
        q: "Can we set custom invoice numbering series (e.g. 'CONF-2026-001')?",
        a: "Yes. Organizers can configure custom invoice prefixes, starting sequence numbers, and financial year identifiers in their billing settings.",
      },
    ],
  },
  closingCtaSection: {
    badge: "GST READY",
    title: "Automate Your Event GST Invoicing Today",
    description: "Issue professional B2B tax invoices and simplify your GSTR-1 returns. Free to get started.",
    primaryCtaLabel: "Enable GST Invoicing Free",
    secondaryCtaLabel: "Explore Pricing Plans",
  },
};

/**
 * PAGE 039: One-Time Event Ticketing Software Without Subscription (Payments)
 */
export const PAGE_039_ONE_TIME_TICKETING_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 039",
  pageId: "one-time-event-ticketing-software-without-subscription",
  slug: "one-time-event-ticketing-software-without-subscription",
  canonicalUrl: "https://urpass.space/solutions/one-time-event-ticketing-software-without-subscription",
  primaryKeyword: "one-time event ticketing software without subscription",
  secondaryKeywords: [
    "pay per event ticketing platform",
    "event ticketing without monthly fee",
    "single event registration software",
    "no subscription event check in app",
  ],
  market: "India, UK, US, and Global",
  audience: "Annual conference hosts, reunion coordinators, wedding planners, infrequent event organizers",
  searchIntent: "Transactional",
  conversionGoal: "Create single event",
  seoTitle: "One-Time Event Ticketing Software Without Subscription | UrPass",
  metaDescription:
    "Host single events without recurring monthly fees. UrPass offers 0% platform ticketing fee, free forever tiers, and one-time remote managed service packages.",
  badge: "PAYMENTS // NO SUBSCRIPTIONS",
  h1: "One-Time Event Ticketing Software Without Recurring Monthly Subscriptions",
  heroSubtitle:
    "Organizing an annual conference, reunion, or one-off workshop? Never get trapped in monthly SaaS auto-renewals. Free tier and one-time event packages with 0% platform fees.",
  heroDescription:
    "UrPass One-Time Event Ticketing Software is tailored for organizers who host occasional, annual, or single-day events and refuse to pay recurring monthly SaaS subscriptions for software they only use once a year. Choose our Free Forever tier for small gatherings or one-time event passes with 0% platform commission, full QR ticketing, and sub-second gate check-in.",
  primaryCtaLabel: "Create Single Event Free",
  secondaryCtaLabel: "View One-Time Packages",
  problemSection: {
    badge: "THE RECURRING BILLING TRAP",
    title: "Why SaaS Monthly Subscriptions Punish Occasional Event Hosts",
    paragraphs: [
      "Most modern event management software forces organizers into expensive 12-month annual contracts or recurring monthly subscriptions with hidden auto-renewals.",
      "If you only host an annual alumni reunion, a biennial medical conference, or a quarterly workshop, paying $100+ every month for 11 months of idle software is absurd.",
      "Alternative 'free' ticketing platforms look attractive until they sting your attendees with aggressive 7% to 10% ticketing fees at checkout, inflating your ticket prices.",
      "UrPass is built with respect for your budget: enjoy a Free Forever tier with zero credit card required, simple pay-as-you-go event packages, and 0% platform commission on tickets.",
    ],
  },
  capabilitiesSection: {
    badge: "FLEXIBLE ACCESS",
    title: "Enterprise Capabilities Without Long-Term SaaS Lock-In",
    subtitle: "Built for independent organizers, associations, and community leaders.",
    items: [
      {
        stepNumber: "01",
        title: "Free Forever Tier for Up to 50 Attendees",
        description:
          "Host your event completely free with up to 50 registrations. Includes custom registration forms, digital QR passes, and mobile camera scanning.",
        bestFor: "Community meetups, student club gatherings, private dinners, and small workshops.",
        technicalProof: "Zero credit card required, no expiration timer, and no automatic billing conversions.",
        icon: "shield",
      },
      {
        stepNumber: "02",
        title: "0% Platform Commission on Ticket Sales",
        description:
          "Sell paid tickets without losing 5% to 10% to platform markups. Connect your Razorpay or Stripe account for direct bank deposits.",
        bestFor: "Maximizing net profit for fundraisers, reunions, and independent workshops.",
        technicalProof: "Direct gateway settlement bypasses third-party platform escrow and per-ticket deductions.",
        icon: "file-text",
      },
      {
        stepNumber: "03",
        title: "Turnkey Remote Managed Event Services",
        description:
          "Prefer hands-off white-glove setup? Our remote managed team configures your branding, registration forms, and scanner gate workflows as a single one-time event fee.",
        bestFor: "Busy organizers who want expert setup without ongoing software management.",
        technicalProof: "Fixed-scope managed service contracts starting at ₹4,999 one-time with dedicated training.",
        icon: "zap",
      },
      {
        stepNumber: "04",
        title: "Instant Account Pause / Cancel Anytime",
        description:
          "If you upgrade to Starter (₹499/mo) or Pro (₹999/mo) for the month of your event, cancel with 1 click immediately after your event wraps up. Zero cancellation fees.",
        bestFor: "Organizers who need high-capacity scanning for a single weekend.",
        technicalProof: "Month-to-month subscription mandates cancellable instantly inside your organizer settings.",
        icon: "sliders",
      },
    ],
  },
  howItWorksSection: {
    badge: "SINGLE EVENT WORKFLOW",
    title: "Host Your One-Time Event in 4 Simple Steps",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Sign Up Free (No Credit Card)",
        description:
          "Create your account in 30 seconds using email or Google sign-in with zero billing commitment.",
      },
      {
        stepNumber: "Step 2",
        title: "Configure Event Page & Ticket Types",
        description:
          "Set up your event title, description, date, custom registration questions, and ticket tiers.",
      },
      {
        stepNumber: "Step 3",
        title: "Publish & Distribute QR Passes",
        description:
          "Attendees register and receive their digital QR passes immediately via WhatsApp and email.",
      },
      {
        stepNumber: "Step 4",
        title: "Scan Tickets at the Gate",
        description:
          "Scan passes in 0.28s on standard smartphones. Export check-in reports with zero post-event fees.",
      },
    ],
    ctaLabel: "Start Free Single Event",
  },
  eventTypesSection: {
    badge: "OCCASIONAL FORMATS",
    title: "Perfect for Infrequent and Annual Events",
    items: [
      {
        title: "Annual Alumni Reunions",
        description: "Organized once every 12 months by volunteer alumni committees who need simple, zero-contract ticketing.",
        badge: "ALUMNI",
      },
      {
        title: "Wedding Receptions & Sangeet Nights",
        description: "Private single-evening family celebrations using QR invitations for venue security.",
        badge: "WEDDINGS",
      },
      {
        title: "Charity Fundraisers & Galas",
        description: "Nonprofit galas where every rupee saved on platform commissions directly benefits the cause.",
        badge: "NONPROFITS",
      },
      {
        title: "One-Off Masterclasses & Bootcamps",
        description: "Specialized guest instructors hosting a single weekend workshop without long-term overhead.",
        badge: "WORKSHOPS",
      },
    ],
  },
  comparisonSection: {
    badge: "MODEL COMPARISON",
    title: "UrPass No-Subscription Model vs. Traditional SaaS Vendors",
    summaryText: "Pay only for what you actually use without recurring billing traps.",
    headers: ["Traditional Enterprise Event SaaS", "UrPass Flexible Event Ticketing"],
    rows: [
      {
        manual: "Locks you into a mandatory 12-month annual contract ($1,200 to $5,000 upfront)",
        urpass: "Free Forever tier or month-to-month flexibility (cancel anytime with 1 click)",
      },
      {
        manual: "Requires sales calls, demos, and multi-week onboarding contracts just to publish an event",
        urpass: "Self-service setup: publish your event and start issuing QR tickets in under 5 minutes",
      },
      {
        manual: "Deducts 5% to 10% platform fees on all sold tickets plus ticketing surcharges",
        urpass: "0% platform ticketing fee: keep 100% of your ticket revenues directly in your bank account",
      },
      {
        manual: "Billed automatically every month even when you have zero active events",
        urpass: "Zero idle fees: stay on the Free tier indefinitely between your annual events",
      },
    ],
  },
  audienceSection: {
    badge: "WHO USES IT",
    title: "Designed for Occasional and Annual Event Coordinators",
    leadText: "Built for organizers who want professional gate technology without recurring monthly liabilities.",
    audiences: [
      "Alumni Batch Coordinators planning 10-year or 25-year reunions",
      "Nonprofit Chairs hosting annual charity balls and fundraisers",
      "Couples and Wedding Planners managing digital RSVP guest lists",
      "Independent Instructors hosting one-off seminars or certification courses",
      "Community Organizers hosting local sports tournaments and festivals",
    ],
    summaryText: "Enjoy professional event software on your own terms without recurring SaaS fees.",
  },
  geoAnswerBlock: {
    question: "Can I use UrPass for a single event without a recurring subscription?",
    answer:
      "Yes. UrPass is specifically designed to support one-time and infrequent events without long-term monthly subscriptions. Organizers can use the Free Forever tier (up to 50 attendees with zero credit card required), upgrade to Starter or Pro for a single month and cancel anytime, or purchase a one-time remote managed service package, all with 0% platform ticketing fees.",
    highlights: [
      "Free Forever tier supports up to 50 attendees with zero credit card required",
      "Month-to-month plans (Starter ₹499/mo) can be cancelled immediately after your event",
      "One-time remote managed event packages available starting at ₹4,999",
      "0% platform ticketing commission on all paid and free ticket registrations",
    ],
  },
  productProofSection: {
    badge: "FREEDOM PROOF",
    title: "Over 800 Single-Event Organizers Supported",
    subtitle: "Consistently rated 5-stars by annual reunion committees, charity galas, and community festivals.",
  },
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "Zero Monthly Lock-In",
    subtitle: "Choose the pricing model that matches your event schedule.",
    features: [
      "0% platform ticketing fee on all ticket registrations",
      "Free Forever: ₹0 for 1 active event up to 50 attendees (no card required)",
      "Starter: ₹499 for 1 month (up to 1,000 attendees, cancel immediately with 1 click)",
      "Pro: ₹999 for 1 month (up to 5,000 attendees, tiered ticketing, multi-gate scanning)",
      "Remote Managed Setup: ₹4,999 one-time event fee for complete turnkey configuration",
    ],
  },
  faqSection: {
    badge: "FAQS",
    title: "One-Time Ticketing: Frequently Asked Questions",
    faqs: [
      {
        q: "Do I have to enter credit card details to use UrPass for my event?",
        a: "No. You can sign up and publish your event on our Free Forever tier without ever entering a credit card or payment mandate.",
      },
      {
        q: "If I upgrade to Starter or Pro for my event, will I be automatically billed next month?",
        a: "You can cancel your subscription inside your organizer dashboard immediately after paying. Your plan will remain active for the full 30 days of your event, and you will never be billed again.",
      },
      {
        q: "What happens to my attendee data after my event concludes?",
        a: "Your account and all historical attendee records, check-in timestamps, and CSV reports remain safely preserved in your dashboard for future reference at zero charge.",
      },
      {
        q: "Does UrPass take a cut of my ticket sales on one-time events?",
        a: "No. UrPass charges 0% platform commission on ticket sales. You only pay standard payment gateway processing fees (Razorpay or Stripe) directly to the processor.",
      },
      {
        q: "Can UrPass staff manage our one-time event setup for us?",
        a: "Yes. We offer Remote Managed Service packages (Essential, Pro, Premium) where our dedicated team configures your branding, tickets, registration forms, and staff training for a single flat fee.",
      },
    ],
  },
  closingCtaSection: {
    badge: "NO CONTRACTS",
    title: "Host Your One-Time Event with Zero Monthly Fees",
    description: "Publish your event and start issuing QR passes in minutes. No credit card required.",
    primaryCtaLabel: "Create Single Event Free",
    secondaryCtaLabel: "Explore All Plans",
  },
};

