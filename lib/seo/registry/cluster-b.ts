import { MarketingPageConfig } from "../types";

export const CLUSTER_B_PAGES: MarketingPageConfig[] = [
  // 13. /pongal-event-registration
  {
    slug: "pongal-event-registration",
    canonicalUrl: "https://urpass.space/pongal-event-registration",
    title: "Pongal Event Registration & QR Passes | UrPass",
    description: "Manage Pongal celebrations with online registration, digital invitations and QR check-in for communities and organizations.",
    h1: "Pongal Event Registration for Communities and Organizations",
    badge: "Pongal Celebrations & Cultural Feasts",
    cluster: "institutional",
    audience: "Tamil community associations, cultural clubs, resident welfare associations, and traditional festival committees.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Streamline community registrations, traditional feast allocations, cultural competitions, and organized family QR entry.",
      openingAnswer: "UrPass helps community organizers celebrate Pongal without manual list management and token confusion. Publish a cultural registration portal to coordinate traditional Pongal cooking contests, kolam competitions, and community feasts, issuing digital QR passes that volunteer coordinators can verify in seconds.",
    },
    workflow: {
      title: "Community Pongal Registration & Arrival",
      steps: [
        {
          step: 1,
          title: "Publish Cultural Event Portal",
          desc: "Collect participant registrations for traditional games, cultural dance performances, and family feast RSVPs.",
        },
        {
          step: 2,
          title: "Send Branded Family Passes",
          desc: "Members receive digital passes featuring Pongal festive designs directly on WhatsApp and email.",
        },
        {
          step: 3,
          title: "Welcoming Venue Entry",
          desc: "Volunteers scan passes on their smartphones at the community hall or grounds entrance in sub-0.3 seconds.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Cultural Activity Registrations",
        desc: "Allow families to register for specific competitions like Uri Adithal, Rangoli/Kolam, and traditional music alongside general feast entry.",
        bullets: ["Multi-activity form options", "Participant category tagging", "Age-group classification"],
      },
      {
        icon: "shield",
        title: "Community Feast Capacity Control",
        desc: "Prevent catering shortages during the traditional Samathuvapuram Pongal feast with strict seating batch management.",
        bullets: ["Lunch batch allocations (Batch 1, Batch 2)", "Household member caps", "Automated waitlists"],
      },
      {
        icon: "mobile",
        title: "WhatsApp Pass Delivery",
        desc: "Deliver passes straight to community members' WhatsApp accounts for easy presentation at the entrance.",
        bullets: ["No lost paper coupons", "Works on any smartphone", "Instant volunteer camera scan"],
      },
    ],
    practicalScenario: {
      title: "Regional Association Pongal Gathering with 1,200 Members",
      problem: "A community festival in Chennai suffered from long lunch queues when unregistered walk-ins exhausted food intended for registered families.",
      solution: "The committee implemented UrPass online registration with timed lunch batches and digital QR passes.",
      outcome: "All 1,200 registered members entered smoothly across their assigned lunch batches. Food waste was eliminated and queues stayed under 3 minutes.",
    },
    serviceComparison: {
      headline: "Community Self-Service vs. Remote Managed Festival Setup",
      selfServicePoints: [
        "Youth volunteers can launch registration forms in 10 minutes",
        "Free tier for up to 100 members; low-cost Starter for larger gatherings",
        "Volunteers scan passes using their personal phone cameras",
        "Export participant rosters to Excel anytime",
      ],
      managedServicePoints: [
        "UrPass team remotely configures multi-activity registration forms",
        "Festive Pongal pass design with your association logo and greetings",
        "Orientation session for gate coordinators via Google Meet",
        "Remote technical standby during morning festival arrivals",
      ],
      recommendedFor: "Resident associations can easily use self-service; large district cultural festivals benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can members register for cultural competitions and the feast on the same form?",
        a: "Yes. Custom form fields let participants select competition categories (Kolam, singing, folk dance) and indicate total family lunch counts in a single submission.",
      },
      {
        q: "What if community elders do not use smartphones?",
        a: "Family members can register on their behalf and print out the QR pass. Gate volunteers can also look up any member by name or phone number on the scanner.",
      },
      {
        q: "Can we collect voluntary contributions or festival donations?",
        a: "Yes. You can link your association's Razorpay account to accept optional voluntary festival donations with 0% platform commission from UrPass.",
      },
      {
        q: "How does the system prevent food coupon sharing?",
        a: "Each digital pass is marked redeemed in the database upon the first scan. Re-scanning the same pass immediately displays a red duplicate alert.",
      },
      {
        q: "Do volunteer coordinators need any technical training?",
        a: "Zero training is needed. Volunteers simply open a secure web link on their smartphone browser and point the camera at attendee passes.",
      },
    ],
    relatedSlugs: ["pongal-celebration-qr-passes", "corporate-pongal-event-management", "college-pongal-event-registration", "sankranti-event-ticketing"],
  },

  // 14. /pongal-celebration-qr-passes
  {
    slug: "pongal-celebration-qr-passes",
    canonicalUrl: "https://urpass.space/pongal-celebration-qr-passes",
    title: "Pongal Celebration QR Invitations | UrPass",
    description: "Create QR-based digital passes for Pongal celebrations, track guests and simplify event entry with UrPass.",
    h1: "Digital QR Passes for Pongal Celebrations",
    badge: "Festive Invitations & Access Passes",
    cluster: "institutional",
    audience: "Social organizations, cultural event hosts, and private festival convenors.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Deliver beautifully branded digital Pongal passes, track RSVPs in real time, and welcome guests with rapid smartphone entry.",
      openingAnswer: "UrPass replaces paper invitation cards and handwritten guest logs with elegant digital Pongal invitations. Guests receive personalized festive passes with traditional artwork on their smartphones, while hosts enjoy real-time arrival tracking and effortless door verification.",
    },
    workflow: {
      title: "Festive Invitation to Door Check-in",
      steps: [
        {
          step: 1,
          title: "Design Digital Pongal Pass",
          desc: "Incorporate traditional festive banners, event schedules, venue maps, and traditional attire recommendations.",
        },
        {
          step: 2,
          title: "Distribute Invite Links",
          desc: "Share your private invite link across family and community WhatsApp groups. Monitor confirmations on your dashboard.",
        },
        {
          step: 3,
          title: "Warm Door Verification",
          desc: "Greeters scan digital passes with standard phone cameras in sub-0.3s, extending a warm traditional welcome without delays.",
        },
      ],
    },
    features: [
      {
        icon: "sparkles",
        title: "Traditional Festival Theme Branding",
        desc: "Customize digital passes with harvest festival motifs, organization crests, and personalized attendee greetings.",
        bullets: ["Harvest-themed color palettes", "Personalized attendee name display", "Apple Wallet integration"],
      },
      {
        icon: "shield",
        title: "Guest List Integrity",
        desc: "Ensure private celebrations remain intimate by preventing unauthorized link sharing with cryptographic single-use QR passes.",
        bullets: ["Unique encrypted tokens", "Duplicate screenshot rejection", "Instant guest directory search"],
      },
      {
        icon: "mobile",
        title: "Zero App Download for Guests",
        desc: "Guests open their responsive digital pass in any web browser or view it directly in WhatsApp without installing any new apps.",
        bullets: ["Lightweight responsive web pass", "Low data bandwidth usage", "Instant opening speed"],
      },
    ],
    practicalScenario: {
      title: "Community Club Traditional Harvest Evening",
      problem: "A cultural club in Coimbatore struggled with printed invitation cards that guests frequently left at home, causing confusion at the club gates.",
      solution: "The club issued UrPass digital passes directly to members' WhatsApp numbers with personalized family seat numbers.",
      outcome: "Check-in took under 2 seconds per member. Members praised the convenience of having their passes safely stored in their phone wallet.",
    },
    serviceComparison: {
      headline: "Host Self-Service vs. Remote Managed Cultural Setup",
      selfServicePoints: [
        "Create invitation pages and manage RSVPs directly online",
        "Free plan available for intimate gatherings up to 100 guests",
        "Scan passes using your personal smartphone camera",
        "Real-time attendance view on your mobile dashboard",
      ],
      managedServicePoints: [
        "UrPass team configures the invitation portal and custom pass artwork",
        "Bulk guest list import from Excel/CSV spreadsheets",
        "Guidance on scanner link distribution to entrance greeters",
        "Live remote assistance during event setup",
      ],
      recommendedFor: "Private hosts can easily manage self-service; club committees often appreciate Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can members add family guests to their digital pass?",
        a: "Yes. Passes can be configured to represent a single attendee or a family group (e.g. 'Family Pass - 4 Guests') with partial check-in support.",
      },
      {
        q: "What if a member's phone battery runs out?",
        a: "Greeters can find any guest in seconds by searching their name or phone number on the scanner directory and verifying their entry manually.",
      },
      {
        q: "Can we send an automated reminder on the morning of Pongal?",
        a: "Yes. You can broadcast event day reminders and parking instructions to all confirmed attendees via email and WhatsApp.",
      },
      {
        q: "Can we restrict invitations to paid club members only?",
        a: "Yes. You can upload an approved membership list or enable manual approval mode before issuing digital passes.",
      },
      {
        q: "Is there any limit to the number of door greeters?",
        a: "No. You can share gate scanner PIN links with as many volunteer greeters as needed to cover multiple entrance doors.",
      },
    ],
    relatedSlugs: ["pongal-event-registration", "corporate-pongal-event-management", "college-pongal-event-registration", "qr-event-check-in-software"],
  },

  // 15. /corporate-pongal-event-management
  {
    slug: "corporate-pongal-event-management",
    canonicalUrl: "https://urpass.space/corporate-pongal-event-management",
    title: "Corporate Pongal Celebration Registration | UrPass",
    description: "Organize office Pongal celebrations with employee RSVPs, family invitations and QR attendance using UrPass.",
    h1: "Corporate Pongal Event Management Made Easier",
    badge: "Workplace Festivals & Employee Engagement",
    cluster: "institutional",
    audience: "Corporate HR teams, employee engagement committees, facilities managers, and workplace culture leads.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Manage office traditional day RSVPs, ethnic dress contests, potluck coordination, and smooth cafeteria or auditorium check-in.",
      openingAnswer: "UrPass helps enterprise HR teams celebrate Pongal across campus offices. Collect employee confirmations with company email domain validation, track participation in traditional wear competitions, manage sweet Pongal distribution counts, and eliminate catering overspending with exact attendee verification.",
    },
    workflow: {
      title: "Office Pongal Registration to Campus Check-in",
      steps: [
        {
          step: 1,
          title: "Launch Employee RSVP Portal",
          desc: "Restrict registration to company email addresses and capture employee branch, floor, and traditional contest entries.",
        },
        {
          step: 2,
          title: "Distribute Digital Passes",
          desc: "Employees receive corporate-branded digital passes with event timing, traditional dress themes, and meal coupon details.",
        },
        {
          step: 3,
          title: "Cafeteria & Auditorium Ingress",
          desc: "HR team scans passes in 0.3s. Track branch-wise turnout and meal distribution counts in real time on the HR dashboard.",
        },
      ],
    },
    features: [
      {
        icon: "lock",
        title: "Company Domain Gating",
        desc: "Ensure only active employees register by requiring corporate email domain verification (@company.com).",
        bullets: ["Restricted domain registration", "Employee ID capture", "Multi-branch office support"],
      },
      {
        icon: "users",
        title: "Contest & Cultural Activity RSVPs",
        desc: "Allow staff to sign up for ethnic wear competitions, Rangoli contests, and department performances on a single form.",
        bullets: ["Contest participant rosters", "Department-wise tracking", "Automated entry confirmations"],
      },
      {
        icon: "chart",
        title: "Catering Headcount Accuracy",
        desc: "Provide exact verified attendee counts to corporate cafeteria vendors, avoiding costly over-ordering of festive lunch thalis.",
        bullets: ["Real-time meal coupon redemption", "No-show tracking for budget audits", "Instant Excel export for HR finance"],
      },
    ],
    practicalScenario: {
      title: "Tech Park Campus with 2,200 Employees Celebrating Pongal",
      problem: "An IT enterprise in Bangalore overpaid ₹1.4 lakhs in wasted festive meals during previous celebrations due to unverified email RSVPs.",
      solution: "HR implemented UrPass with digital QR meal vouchers, requiring employees to scan upon collecting their festive sweet boxes and lunch.",
      outcome: "Exact meal count was tracked at 1,780. Catering waste was eliminated, saving over ₹1.4 lakhs with transparent audit data.",
    },
    serviceComparison: {
      headline: "Internal HR Team vs. Remote Managed Office Setup",
      selfServicePoints: [
        "HR lead configures the registration portal in under 15 minutes",
        "Upload employee master list via CSV to pre-approve guest counts",
        "HR volunteers scan passes with their work phones",
        "Export comprehensive attendance and contest logs to Excel",
      ],
      managedServicePoints: [
        "UrPass team configures multi-branch registration portals and domain rules",
        "Festive digital pass design featuring corporate branding and festival artwork",
        "Pre-event walkthrough with campus facilities and HR leads",
        "Remote technical standby during peak cafeteria hours",
      ],
      recommendedFor: "Single-office teams can run self-service; multi-city corporate campuses benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can employees register for specific festival activities like Kolam competitions?",
        a: "Yes. Custom form fields allow employees to select which contests they wish to enter (traditional attire, pot decoration, Kolam) alongside meal RSVPs.",
      },
      {
        q: "Can we support multiple office campuses (e.g. Bangalore, Chennai, Hyderabad)?",
        a: "Yes. You can manage separate event locations or branch tags under a single centralized organizer account.",
      },
      {
        q: "How does the system prevent employees taking duplicate festive sweets?",
        a: "Once a pass is scanned at the distribution counter, it is marked redeemed. Any second attempt immediately flashes a red duplicate notification.",
      },
      {
        q: "Is employee data kept strictly confidential?",
        a: "Yes. UrPass enforces database row-level security and HTTPS encryption. Data is never shared or monetized, and can be purged post-event.",
      },
      {
        q: "What if an employee does not have their phone at the cafeteria?",
        a: "HR staff can search for the employee by their Employee ID or name on the scanner screen and check them in manually.",
      },
    ],
    relatedSlugs: ["pongal-event-registration", "college-pongal-event-registration", "corporate-annual-day-management", "event-registration-software-india"],
  },

  // 16. /college-pongal-event-registration
  {
    slug: "college-pongal-event-registration",
    canonicalUrl: "https://urpass.space/college-pongal-event-registration",
    title: "College Pongal Event Registration | UrPass",
    description: "Simplify college Pongal registrations, student participation, custom forms and QR attendance with UrPass.",
    h1: "College Pongal Celebration Registration Platform",
    badge: "Colleges, Universities & Student Councils",
    cluster: "institutional",
    audience: "College cultural secretaries, student union coordinators, faculty advisors, and department heads.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Organize campus cultural fests, student traditional competitions, department attendance, and safe gate admissions with digital QR passes.",
      openingAnswer: "UrPass eliminates paper token chaos and unverified campus entry for college Pongal celebrations. Student committees can set up department-wise registrations, manage competition entries (Uri Adithal, Silambam, traditional folk arts), issue verified digital student passes, and scan thousands of students in minutes at campus gates.",
    },
    workflow: {
      title: "Student Registration to Campus Gate Entry",
      steps: [
        {
          step: 1,
          title: "Publish College Registration Portal",
          desc: "Collect student roll numbers, department names, year of study, and competition participation selections.",
        },
        {
          step: 2,
          title: "Deliver Digital Student Passes",
          desc: "Students receive colorful festival passes via email and WhatsApp with their student details and event schedule.",
        },
        {
          step: 3,
          title: "Campus Gate Rapid Verification",
          desc: "Student volunteers scan passes in 0.3s. Prevent outside trespassers and ensure a safe, celebratory campus atmosphere.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Department & Roll Number Verification",
        desc: "Capture verified student roll numbers, branches (ECE, Mech, CSE), and academic years with automated duplication checks.",
        bullets: ["Roll number uniqueness validation", "Inter-department competition rosters", "Student union admin access"],
      },
      {
        icon: "shield",
        title: "Campus Safety & Gate Trespasser Prevention",
        desc: "Ensure only bonafide enrolled students enter the campus celebration by issuing non-transferable cryptographic QR passes.",
        bullets: ["Prevent pass sharing and screenshot reuse", "Fast gate check-in to prevent road blockages", "Audit-ready attendance records for faculty"],
      },
      {
        icon: "zap",
        title: "Zero-Budget Student Pricing",
        desc: "Affordable flat plans starting at ₹499/month with 0% fees, avoiding high commercial event ticketing costs.",
        bullets: ["Student council-friendly flat fees", "Free tier for up to 100 students", "Unlimited scanning devices"],
      },
    ],
    practicalScenario: {
      title: "Engineering College Campus with 3,000 Students Celebrating Pongal",
      problem: "A college campus in Madurai faced security risks when students from outside colleges gatecrashed the festival, overwhelming faculty coordinators.",
      solution: "The student union deployed UrPass, requiring valid student roll numbers and issuing unique QR passes to enrolled students only.",
      outcome: "Four student volunteers scanned all 3,000 students across 2 campus gates in 25 minutes. Zero gatecrashing occurred.",
    },
    serviceComparison: {
      headline: "Student Committee Self-Service vs. Remote Managed College Setup",
      selfServicePoints: [
        "Student coordinators set up forms and competitions in 10 minutes",
        "Share scanner links with student volunteers via simple PINs",
        "Download department-wise participant lists to Excel",
        "Budget-friendly flat software pricing with 0% commissions",
      ],
      managedServicePoints: [
        "UrPass team remotely configures multi-department forms and rules",
        "Custom festival pass design with college logo and traditional artwork",
        "Pre-event rehearsal with student union leads and faculty advisors",
        "Remote technical standby during morning campus gate rush",
      ],
      recommendedFor: "Student unions love the independence and savings of self-service; large universities often request Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can students register for traditional games like Uri Adithal and Tug of War?",
        a: "Yes. The registration form can include checkboxes or dropdowns for individual and team competition events.",
      },
      {
        q: "How does the system stop students from forwarding their pass to friends outside college?",
        a: "Each pass has a unique cryptographic token. Once scanned at the gate, it is instantly redeemed. A second scan immediately alerts security.",
      },
      {
        q: "Can faculty advisors access attendance reports for attendance credits?",
        a: "Yes. Faculty can export timestamped attendance spreadsheets sorted by department and roll number with one click.",
      },
      {
        q: "What equipment do student volunteers need at the gate?",
        a: "Only their personal smartphones. Opening the scanner link in Chrome or Safari turns any phone into a high-speed barcode reader.",
      },
      {
        q: "Can we use UrPass for other college events like cultural fests and symposiums?",
        a: "Yes! A single UrPass monthly subscription allows you to create and host multiple events throughout the academic year.",
      },
    ],
    relatedSlugs: ["pongal-event-registration", "college-cultural-fest-registration", "college-symposium-registration", "qr-event-check-in-software"],
  },

  // 17. /sankranti-event-ticketing
  {
    slug: "sankranti-event-ticketing",
    canonicalUrl: "https://urpass.space/sankranti-event-ticketing",
    title: "Sankranti Event Ticketing & Registration | UrPass",
    description: "Organize Sankranti events with digital registrations, ticket categories, QR passes and event attendance tracking.",
    h1: "Sankranti Event Ticketing and Digital Registration",
    badge: "Makar Sankranti Celebrations & Kite Festivals",
    cluster: "institutional",
    audience: "Kite festival promoters, Telugu and cultural associations, resort event managers, and community celebration committees.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Sell tickets online for kite festivals, community feasts, and traditional celebrations with 0% platform commission and sub-second QR entry.",
      openingAnswer: "UrPass brings modern ticketing and crowd control to Makar Sankranti festivals. Sell family passes, kite-flying packages, and cultural celebration tickets with direct UPI payments, while equipping volunteers with smartphone scanners to admit thousands of visitors without gate bottlenecks.",
    },
    workflow: {
      title: "Sankranti Ticket Sales to Ground Entry",
      steps: [
        {
          step: 1,
          title: "Publish Festive Ticket Page",
          desc: "Create General Entry, Family Kite Kits, VIP Gazebo seating, and Cultural Show packages with inventory limits.",
        },
        {
          step: 2,
          title: "Direct UPI & Card Checkout",
          desc: "Visitors pay seamlessly via Google Pay, PhonePe, Paytm, and cards with 0% platform commission taken by UrPass.",
        },
        {
          step: 3,
          title: "Multi-Gate Rapid Scanning",
          desc: "Gate staff scan digital passes on phone cameras in sub-0.3s, keeping ground entrances clear and preventing ticket fraud.",
        },
      ],
    },
    features: [
      {
        icon: "card",
        title: "Kite Festival Package Bundles",
        desc: "Bundle entry tickets with kite-flying kits, sweets boxes, and seating gazebos into clear, attractive packages.",
        bullets: ["Family and group entry bundles", "Kite kit redemption voucher display", "Early-bird pricing tiers"],
      },
      {
        icon: "zap",
        title: "0% Commission Direct Settlement",
        desc: "Connect your Razorpay account to receive ticket revenues directly into your bank on rolling T+2 days with zero aggregator hold.",
        bullets: ["Direct organizer merchant payout", "Accept all UPI apps & credit cards", "Immediate cash flow for festival vendors"],
      },
      {
        icon: "shield",
        title: "Anti-Fraud Ground Ingress",
        desc: "Prevent duplicate ticket usage and screenshot sharing across open-ground festival entrances with atomic row-level database locking.",
        bullets: ["Sub-0.3s camera scan on standard phones", "Instant duplicate alert", "Gate-wise attendance tracking"],
      },
    ],
    practicalScenario: {
      title: "Open-Ground Makar Sankranti Kite Festival with 4,500 Attendees",
      problem: "A Hyderabad cultural committee suffered from massive entrance lines when volunteers tried to tear paper ticket stubs under windy conditions.",
      solution: "The committee used UrPass digital ticketing, enabling visitors to buy tickets on their phones and scan QR codes directly from their screens.",
      outcome: "Lines cleared in minutes. Four volunteer phone scanners processed 4,500 attendees smoothly, and ticket revenue settled directly into the committee's account.",
    },
    serviceComparison: {
      headline: "Promoter Self-Service vs. Remote Managed Festival Setup",
      selfServicePoints: [
        "Set up ticket tiers and start selling online in 10 minutes",
        "Connect your existing Razorpay gateway account",
        "Deploy gate volunteers using simple security PINs",
        "Keep 100% of ticket sales revenue",
      ],
      managedServicePoints: [
        "UrPass team configures ticket inventory, kite bundles, and payment webhooks",
        "Custom festive pass design with festival branding and sponsor logos",
        "Pre-event gate staff orientation via video call",
        "Remote technical monitoring during peak festival arrival hours",
      ],
      recommendedFor: "Local community festivals love self-service; large commercial kite festivals benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can visitors buy tickets on their phones while standing in the queue?",
        a: "Yes! Visitors scan a poster QR code at the entrance, complete a 20-second UPI payment, and receive their scannable pass instantly.",
      },
      {
        q: "How do family passes work at the festival gate?",
        a: "A Family Pass generates a single QR code validating the specified number of entries, supporting partial check-in if family members arrive separately.",
      },
      {
        q: "What fees does UrPass charge on festival ticket sales?",
        a: "UrPass charges 0% platform commission on ticket sales. You only pay your standard Razorpay gateway fee (~2%) and a flat monthly subscription.",
      },
      {
        q: "What if phone internet connectivity is weak on open festival grounds?",
        a: "UrPass passes are designed to display clearly once loaded. The scanner uses ultra-compact payloads (<100KB) to ensure rapid verification even on weak connections.",
      },
      {
        q: "Can security personnel see our total sales and financial data?",
        a: "No. Gate scanners only display attendee name, ticket tier, and validity. Financial dashboards are strictly restricted to organizers.",
      },
    ],
    relatedSlugs: ["pongal-event-registration", "christmas-carnival-ticketing", "event-ticketing-software-india", "qr-event-check-in-software"],
  },

  // 18. /lohri-event-registration
  {
    slug: "lohri-event-registration",
    canonicalUrl: "https://urpass.space/lohri-event-registration",
    title: "Lohri Event Registration & Digital Invitations | UrPass",
    description: "Create digital registrations and QR invitations for Lohri celebrations, community gatherings and cultural events.",
    h1: "Manage Lohri Celebrations with Online Registration",
    badge: "Lohri Celebrations & Bonfire Gatherings",
    cluster: "institutional",
    audience: "Punjabi cultural associations, residential societies, club committees, and private festival organizers.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Coordinate community bonfire gatherings, traditional Gidda and Bhangra performances, dinner RSVPs, and smooth digital guest check-in.",
      openingAnswer: "UrPass makes organizing Lohri bonfire celebrations straightforward and dignified. Replace chaotic WhatsApp message threads with a festive RSVP portal. Manage family dinner headcounts, capture performance signups, issue digital QR invitations, and welcome guests with rapid smartphone entry.",
    },
    workflow: {
      title: "Lohri RSVP to Bonfire Welcome",
      steps: [
        {
          step: 1,
          title: "Launch Festive Lohri Portal",
          desc: "Collect RSVPs with options for family headcounts, traditional sweets distribution, and cultural performance signups.",
        },
        {
          step: 2,
          title: "Deliver Digital QR Invitations",
          desc: "Confirmed guests receive vibrant festive passes with venue directions and bonfire timings via WhatsApp and email.",
        },
        {
          step: 3,
          title: "Warm Door Verification",
          desc: "Volunteers scan passes on their smartphones in sub-0.3s, extending a warm traditional welcome while keeping unwanted walk-ins out.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Family & Community Headcounts",
        desc: "Capture exact household attendance numbers to ensure accurate catering for traditional Makki di Roti, Sarson da Saag, and Rewri sweets.",
        bullets: ["Household guest limits", "Catering headcount accuracy", "Automated waitlists when hall is full"],
      },
      {
        icon: "sparkles",
        title: "Festive Bonfire Pass Design",
        desc: "Customize digital passes with warm bonfire artwork, traditional Punjabi greetings, and event itinerary details.",
        bullets: ["Bonfire festive theme colors", "Apple Wallet pass integration", "Web pass accessible without app download"],
      },
      {
        icon: "shield",
        title: "Private Guest List Verification",
        desc: "Prevent unauthorized link sharing with single-use cryptographic passes that cannot be reused or duplicated.",
        bullets: ["Dynamic anti-screenshot tokens", "Instant duplicate alert", "Quick name search lookup"],
      },
    ],
    practicalScenario: {
      title: "Community Club Lohri Bonfire with 850 Attendees",
      problem: "A cultural association in Delhi experienced catering shortfalls when uninvited guests overwhelmed the buffet at previous Lohri celebrations.",
      solution: "The committee used UrPass to collect member RSVPs, issuing digital passes with a 4-guest cap per member family.",
      outcome: "Check-in took under 2 seconds per family. The event stayed exactly within capacity, and dinner catering matched attendance flawlessly.",
    },
    serviceComparison: {
      headline: "Community Self-Service vs. Remote Managed Cultural Setup",
      selfServicePoints: [
        "Set up your community Lohri portal in under 15 minutes",
        "Free tier available for up to 100 guests; low-cost Starter for larger gatherings",
        "Use volunteer smartphones to scan passes at the entrance",
        "Export guest lists to Excel with one click",
      ],
      managedServicePoints: [
        "UrPass team configures the registration forms and family headcount rules",
        "Custom festive pass design with your association logo and bonfire motif",
        "Volunteer orientation on smartphone scanning via video call",
        "Remote setup support leading up to festival night",
      ],
      recommendedFor: "Local community clubs can easily run self-service; large regional societies benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can members register for cultural dance performances (Bhangra / Gidda)?",
        a: "Yes. Custom form fields can include performance signup options for children, youth, and adult groups.",
      },
      {
        q: "What if elderly guests do not use smartphones or WhatsApp?",
        a: "Family members can print out their QR passes. Gate volunteers can also look up any guest by name or phone number on the scanner.",
      },
      {
        q: "Can we collect voluntary contributions or dinner fees?",
        a: "Yes. You can link your association's Razorpay account to accept dinner fees or voluntary contributions with 0% platform fee from UrPass.",
      },
      {
        q: "How does the scanner alert volunteers to an invalid pass?",
        a: "The scanner screen immediately flashes bright red and emits a distinct alert tone if a pass has already been used or is invalid.",
      },
      {
        q: "Do we need any special equipment to scan passes at the entrance?",
        a: "No. Any standard smartphone (iPhone or Android) with a camera can scan passes directly in Chrome or Safari. No app download is needed.",
      },
    ],
    relatedSlugs: ["sankranti-event-ticketing", "pongal-event-registration", "christmas-event-registration", "qr-event-check-in-software"],
  },

  // 19. /republic-day-event-registration
  {
    slug: "republic-day-event-registration",
    canonicalUrl: "https://urpass.space/republic-day-event-registration",
    title: "Republic Day Event Registration Software | UrPass",
    description: "Manage Republic Day program registrations, guest lists, invitation passes and QR check-in using UrPass.",
    h1: "Republic Day Event Registration and Attendance Management",
    badge: "National Celebrations & Institutional Ceremonies",
    cluster: "institutional",
    audience: "Educational institutions, government contractors, corporate offices, and community cultural societies.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Coordinate institutional flag-hoisting ceremonies, cultural programs, invited guest lists, and dignified digital pass verification.",
      openingAnswer: "UrPass provides institutions with an organized, dignified digital platform for Republic Day ceremonies. Manage invited dignitaries, student participants, faculty, and family guests with tiered invitation categories, secure digital QR passes, and sub-second gate check-ins that maintain solemn decorum.",
    },
    workflow: {
      title: "Ceremony Registration to Dignified Entry",
      steps: [
        {
          step: 1,
          title: "Configure Ceremony Categories",
          desc: "Create registration categories for Chief Guests, Faculty, Student Performers, Alumni, and General Visitors.",
        },
        {
          step: 2,
          title: "Distribute Patriotic Digital Passes",
          desc: "Attendees receive clean, patriotic-themed digital passes with reporting times, gate numbers, and seating enclosure details.",
        },
        {
          step: 3,
          title: "Orderly Gate Verification",
          desc: "Gate attendants scan passes on smartphones in sub-0.3s, directing attendees smoothly to their assigned seating enclosures.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Enclosure & Seating Zone Allocations",
        desc: "Assign attendees to specific seating enclosures (e.g. Enclosure A - Dignitaries, Enclosure B - Faculty, Enclosure C - Students).",
        bullets: ["Enclosure designation on digital pass", "Tiered arrival reporting times", "Seating capacity cap enforcement"],
      },
      {
        icon: "shield",
        title: "Orderly Gate Flow Management",
        desc: "Prevent entrance crowding before the flag hoisting with high-speed smartphone camera scanning that processes guests in 0.3s.",
        bullets: ["Fast sub-0.3s camera verification", "Duplicate pass prevention", "Searchable guest roster for manual lookup"],
      },
      {
        icon: "chart",
        title: "Institutional Attendance Auditing",
        desc: "Generate complete electronic attendance records with precise arrival timestamps for institutional compliance and security logs.",
        bullets: ["Timestamped arrival logs", "Department/Class breakdown", "Instant export to Excel/CSV"],
      },
    ],
    practicalScenario: {
      title: "University Campus Republic Day Flag Hoisting with 2,500 Guests",
      problem: "A central university faced severe entrance bottlenecks as security guards manually checked paper invitation cards at the main campus gates.",
      solution: "The university deployed UrPass, emailing digital QR passes to students, faculty, and alumni with specified gate and enclosure numbers.",
      outcome: "Check-in time dropped to 1.4 seconds per guest. All 2,500 attendees were seated 20 minutes before the national anthem with zero confusion.",
    },
    serviceComparison: {
      headline: "Institutional Self-Service vs. Remote Managed Ceremony Setup",
      selfServicePoints: [
        "Administrative staff can set up ceremony tiers in 15 minutes",
        "Upload dignitary and faculty guest lists via CSV spreadsheet",
        "Staff scan passes using standard smartphones at campus gates",
        "Download complete attendance logs for institutional records",
      ],
      managedServicePoints: [
        "UrPass team remotely configures seating enclosures and category rules",
        "Patriotic pass design incorporating institutional crest and ceremony schedule",
        "Pre-event rehearsal with administrative and security coordinators",
        "Remote technical standby leading up to the morning flag-hoisting",
      ],
      recommendedFor: "Schools and local clubs can easily operate self-service; large universities and public institutions benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can passes show specific seating enclosures and gate numbers?",
        a: "Yes. Passes clearly display the attendee's category, designated entry gate, and seating enclosure (e.g. 'Gate 2 — Enclosure B').",
      },
      {
        q: "Can we pre-load a list of invited dignitaries and VIPs?",
        a: "Yes. You can upload an Excel/CSV spreadsheet of VIPs, faculty, and alumni to automatically issue branded invitations via email.",
      },
      {
        q: "Does UrPass provide physical security screening or ID verification?",
        a: "No. UrPass provides electronic registration, attendance tracking, and ticket verification software only. Physical security screening is handled by venue security personnel.",
      },
      {
        q: "What if a guest forgets to bring their smartphone?",
        a: "Gate attendants can instantly search the guest's name or institution ID on the scanner screen and verify their entry manually.",
      },
      {
        q: "Is attendee data safe and compliant with privacy standards?",
        a: "Yes. UrPass enforces database row-level security and HTTPS encryption. Data is never shared or monetized, and can be deleted post-ceremony.",
      },
    ],
    relatedSlugs: ["republic-day-visitor-management", "school-annual-day-registration", "corporate-annual-day-management", "qr-event-check-in-software"],
  },

  // 20. /republic-day-visitor-management
  {
    slug: "republic-day-visitor-management",
    canonicalUrl: "https://urpass.space/republic-day-visitor-management",
    title: "Republic Day Visitor Registration & QR Entry | UrPass",
    description: "Organize visitor registrations and digital QR passes for Republic Day functions using UrPass guest management tools.",
    h1: "Manage Republic Day Visitors and Guest Entry",
    badge: "Visitor Coordination & Access Passes",
    cluster: "institutional",
    audience: "Campus administrators, public ground coordinators, corporate park managers, and ceremony event committees.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Track visitor headcounts, coordinate guest arrival times, and verify digital admission passes with high-speed smartphone scanning.",
      openingAnswer: "UrPass provides an efficient digital registration and visitor management workflow for Republic Day public functions. Manage visitor registrations in advance, issue digital QR passes with allocated arrival windows, and verify guest arrivals at entry gates in under 0.3 seconds to prevent entrance crowding.",
    },
    workflow: {
      title: "Visitor Registration to Gate Admission",
      steps: [
        {
          step: 1,
          title: "Collect Advance Visitor Registrations",
          desc: "Visitors register online with full name, contact information, vehicle details, and preferred arrival window.",
        },
        {
          step: 2,
          title: "Issue Verified Digital QR Passes",
          desc: "Approved visitors receive digital admission passes detailing entry gate locations and venue guidelines.",
        },
        {
          step: 3,
          title: "Fast-Track Gate Check-in",
          desc: "Gate staff scan QR passes on smartphone browsers in 0.3s, maintaining steady entry flow and logging verified admissions.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Timed Arrival Windows",
        desc: "Stagger visitor ingress across 15-minute time slots to prevent gate crowding ahead of ceremonial proceedings.",
        bullets: ["Time-slotted visitor allocations", "Venue capacity threshold monitoring", "Real-time occupancy tracking"],
      },
      {
        icon: "shield",
        title: "Single-Redemption Verification",
        desc: "Ensure passes cannot be transferred or shared using single-redemption cryptographic verification.",
        bullets: ["Sub-0.3s camera scan on standard phones", "Instant duplicate alert", "Operator check-in audit logs"],
      },
      {
        icon: "chart",
        title: "Electronic Visitor Logs",
        desc: "Replace messy paper visitor logbooks with searchable, timestamped electronic entry logs accessible to authorized coordinators.",
        bullets: ["Searchable visitor directory", "Timestamped ingress history", "Instant Excel/CSV export"],
      },
    ],
    practicalScenario: {
      title: "Civic Ground Republic Day Function with 3,000 Visitors",
      problem: "A city celebration struggled with paper visitor slips, creating 45-minute queues that delayed the start of cultural performances.",
      solution: "Organizers implemented UrPass advance online registration with digital passes and 4 smartphone scanning stations at public gates.",
      outcome: "Check-in time averaged 1.2 seconds per visitor. All 3,000 visitors entered the grounds in 35 minutes with complete electronic records.",
    },
    serviceComparison: {
      headline: "Internal Operations vs. Remote Managed Setup",
      selfServicePoints: [
        "Set up visitor registration forms in 15 minutes",
        "Staff scan passes using personal or company smartphones",
        "Monitor live visitor arrivals on the organizer dashboard",
        "Export visitor records to Excel anytime",
      ],
      managedServicePoints: [
        "UrPass team configures visitor capacity schedules and gate rules",
        "Branded digital pass design with venue instructions and maps",
        "Gate attendant orientation via video conference",
        "Live remote technical assistance during the event",
      ],
      recommendedFor: "Standard corporate campuses can run self-service; large civic functions benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Does UrPass perform statutory identity checks or security screening?",
        a: "No. UrPass is an event ticketing and attendance management tool. Physical security screening, bag checks, and statutory ID verifications are performed by venue security personnel.",
      },
      {
        q: "Can we restrict the number of visitors per registration?",
        a: "Yes. You can limit each submission to a maximum number of guests (e.g. up to 2 visitors per submission) to maintain capacity limits.",
      },
      {
        q: "Can gate staff scan passes without an active internet connection?",
        a: "UrPass uses lightweight server validation requiring a standard mobile data connection (4G/3G) to prevent duplicate pass usage in real time.",
      },
      {
        q: "What if a visitor cannot open their pass on their phone?",
        a: "Gate attendants can search the visitor by name or phone number on the scanner screen and confirm their entry manually.",
      },
      {
        q: "Can we export visitor attendance logs for venue management?",
        a: "Yes. Authorized organizers can export full timestamped visitor attendance records to Excel/CSV with one click.",
      },
    ],
    relatedSlugs: ["republic-day-event-registration", "school-annual-day-registration", "corporate-annual-day-management", "qr-event-check-in-software"],
  },

  // 21. /school-annual-day-registration
  {
    slug: "school-annual-day-registration",
    canonicalUrl: "https://urpass.space/school-annual-day-registration",
    title: "School Annual Day Registration & QR Passes | UrPass",
    description: "Manage school annual day guest registrations, parent invitations, family passes and attendance reporting with UrPass.",
    h1: "School Annual Day Registration and Parent Invitations",
    badge: "Schools, Academies & Annual Celebrations",
    cluster: "institutional",
    audience: "School principals, administrative heads, PTA coordinators, and annual day event committees.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Coordinate parent invitations, student performer allocations, auditorium seat capacities, and dignified QR check-in.",
      openingAnswer: "UrPass provides schools and educational academies with a dignified, organized way to manage Annual Day celebrations. Allocate 2 parent seats per student, prevent auditorium overcrowding, issue school-branded digital passes via WhatsApp and email, and admit parents in sub-second speeds at the auditorium doors.",
    },
    workflow: {
      title: "Parent Registration to Auditorium Seating",
      steps: [
        {
          step: 1,
          title: "Configure Parent Pass Allotment",
          desc: "Upload student roster via CSV or link registration to student admission numbers with a strict 2-ticket limit per family.",
        },
        {
          step: 2,
          title: "Deliver School-Branded Passes",
          desc: "Parents receive digital invitations on WhatsApp and email featuring school crest, auditorium seat tier, and program timings.",
        },
        {
          step: 3,
          title: "Polite Auditorium Usher Check-in",
          desc: "Teacher ushers scan passes on smartphones in 0.3s. Direct parents swiftly to their designated seating sections.",
        },
      ],
    },
    features: [
      {
        icon: "shield",
        title: "Child Data Protection & Parental Consent",
        desc: "Designed with strict student privacy. Only parent contact details are captured, with full parental consent compliance.",
        bullets: ["No public student directory exposure", "Strict database row-level security", "Parental consent compliance"],
      },
      {
        icon: "users",
        title: "Per-Student Seat Quota Enforcement",
        desc: "Ensure fair auditorium seating by allocating a precise seat limit (e.g. 2 passes) per student admission number.",
        bullets: ["Admission number validation", "Automated duplicate request rejection", "Fair seating distribution"],
      },
      {
        icon: "mobile",
        title: "WhatsApp Pass Delivery for Parents",
        desc: "Send digital admission tickets directly to parents' WhatsApp accounts for instant retrieval at the auditorium entrance.",
        bullets: ["No lost paper passes", "Apple Wallet support", "Instant usher camera verification"],
      },
    ],
    practicalScenario: {
      title: "Private K-12 School Annual Day with 1,800 Parents",
      problem: "A school faced chaos when uninvited relatives overcrowded the 1,500-seat auditorium, forcing elderly grandparents to stand.",
      solution: "The school deployed UrPass, allocating 2 passes per student admission number and scanning passes at the auditorium doors.",
      outcome: "Auditorium seating matched capacity perfectly at 1,480 parents. Teacher ushers seated all guests within 20 minutes with zero disputes.",
    },
    serviceComparison: {
      headline: "School Administration vs. Remote Managed Setup",
      selfServicePoints: [
        "School IT admin can upload student lists and publish passes in 20 minutes",
        "Teacher ushers use standard smartphones to scan parent passes",
        "Low-cost flat software subscription with zero per-ticket fees",
        "Download attendance records directly to school Excel templates",
      ],
      managedServicePoints: [
        "UrPass team configures admission number quotas and auditorium seating zones",
        "Prestigious pass design with school crest, colors, and principal's greeting",
        "Teacher usher orientation session via video conference",
        "Remote technical standby during the annual day program",
      ],
      recommendedFor: "Independent schools can easily run self-service; large multi-branch school networks prefer Remote Managed Setup.",
    },
    faqs: [
      {
        q: "How does the system ensure each family gets only 2 passes?",
        a: "Parents enter their child's unique Student Admission Number during registration. The system enforces a strict 2-pass quota per admission number.",
      },
      {
        q: "Is student personal data protected and secure?",
        a: "Yes. UrPass enforces database row-level encryption and strict privacy protocols. Student information is never exposed publicly or shared with third parties.",
      },
      {
        q: "What if grandparents or relatives arrive separately?",
        a: "UrPass supports partial check-in. If a family has 2 passes, one parent can enter first, and the second pass remains valid for the second parent arriving later.",
      },
      {
        q: "What if a parent does not have a smartphone?",
        a: "Parents can bring a printed copy of the QR pass. Teacher ushers can also look up the parent by student admission number on the scanner.",
      },
      {
        q: "Do teacher ushers need to install any app on their phones?",
        a: "No. Ushers simply open a secure web link on Safari or Chrome, enter a 4-digit PIN, and scan passes using their phone camera.",
      },
    ],
    relatedSlugs: ["corporate-annual-day-management", "republic-day-event-registration", "college-cultural-fest-registration", "qr-event-check-in-software"],
  },

  // 22. /corporate-annual-day-management
  {
    slug: "corporate-annual-day-management",
    canonicalUrl: "https://urpass.space/corporate-annual-day-management",
    title: "Corporate Annual Day Event Management | UrPass",
    description: "Simplify corporate annual day registrations, employee invitations, guest check-in and attendance reports with UrPass.",
    h1: "Corporate Annual Day Registration and Guest Management",
    badge: "Enterprise Milestones & Annual Celebrations",
    cluster: "institutional",
    audience: "Corporate HR directors, internal communications managers, executive event leads, and workplace experience heads.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Coordinate employee invitations, family plus-ones, awards gala seating, and swift ballroom admissions for your company annual day.",
      openingAnswer: "UrPass brings enterprise precision to corporate Annual Day celebrations. Collect employee RSVPs with corporate email validation, manage family plus-one quotas, survey dietary preferences, issue branded digital wallet passes, and execute fast ballroom admissions that reflect your company's executive standards.",
    },
    workflow: {
      title: "Employee RSVP to Annual Gala Admission",
      steps: [
        {
          step: 1,
          title: "Launch Corporate Annual Day Portal",
          desc: "Restrict registration to company email domains (@company.com) and define plus-one and family guest allowances.",
        },
        {
          step: 2,
          title: "Distribute Executive Passes",
          desc: "Employees receive corporate-branded digital passes with table assignments, dress codes, and event timing via work email.",
        },
        {
          step: 3,
          title: "Executive Ballroom Entrance",
          desc: "HR team scans incoming staff and families in 0.3s. Monitor live team attendance by department on the real-time analytics dashboard.",
        },
      ],
    },
    features: [
      {
        icon: "lock",
        title: "Enterprise SSO & Domain Validation",
        desc: "Restrict registration to corporate single sign-on or authorized company email domains with zero external exposure.",
        bullets: ["Restricted domain registration", "Employee ID capture", "Complete corporate data privacy"],
      },
      {
        icon: "users",
        title: "Family Plus-One Allocations",
        desc: "Configure exact plus-one allowances per employee tier with custom dietary selection (vegetarian, non-vegetarian, vegan, Jain).",
        bullets: ["Tiered guest allowances", "Dietary and allergy tracking", "Consolidated family check-in"],
      },
      {
        icon: "chart",
        title: "Department Turnout Analytics",
        desc: "Track headcount velocity in real time. Export comprehensive post-event attendance spreadsheets by department for HR reconciliation.",
        bullets: ["Department and cost-center breakdowns", "No-show tracking for catering audits", "Instant Excel/CSV export"],
      },
    ],
    practicalScenario: {
      title: "Annual Day for 2,000 Employees and Spouses at a Convention Center",
      problem: "An IT enterprise faced 45-minute hotel entrance queues as security manually checked employee badges against a printed spreadsheet binder.",
      solution: "HR deployed UrPass, enabling staff to RSVP with their work email and receive digital QR passes stored in their smartphone wallet.",
      outcome: "Check-in time averaged 1.2 seconds per employee. All 2,000 guests entered the ballroom smoothly within 25 minutes.",
    },
    serviceComparison: {
      headline: "Internal HR Team vs. Remote Managed Setup",
      selfServicePoints: [
        "HR lead sets up the portal and forms in 15 minutes",
        "Upload master employee list via CSV to pre-approve guest counts",
        "Security or reception staff scan passes with company smartphones",
        "Flat subscription with complete data privacy and export controls",
      ],
      managedServicePoints: [
        "UrPass team configures the registration system, domain restrictions, and forms",
        "Custom pass design incorporating company branding and theme colors",
        "Pre-event dry run with HR and venue reception leads",
        "Active remote technical monitoring during the event entrance rush",
      ],
      recommendedFor: "Single-office corporate teams can run self-service; multi-city corporate galas benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can we restrict registration exclusively to employees with our company email?",
        a: "Yes. You can mandate email domain validation (e.g. only addresses ending in @yourcompany.com) so external parties cannot submit registrations.",
      },
      {
        q: "Can we assign table numbers or zone seating on the digital pass?",
        a: "Yes. Custom fields can display assigned table numbers or dining zones directly on the attendee's digital pass for quick seating orientation.",
      },
      {
        q: "What if an employee forgets their phone?",
        a: "Reception staff can look up the employee instantly by their Employee ID, name, or work email on the scanner screen.",
      },
      {
        q: "Is employee data protected and kept private?",
        a: "Yes. UrPass enforces strict database row-level security and HTTPS encryption. Data is never shared or sold, and can be purged upon request.",
      },
      {
        q: "Can we use UrPass for multi-city hybrid annual day events?",
        a: "Yes. You can manage separate event locations under a single centralized organizer account.",
      },
    ],
    relatedSlugs: ["corporate-year-end-event-management", "school-annual-day-registration", "event-registration-software-india", "remote-managed-event-services"],
  },
];
