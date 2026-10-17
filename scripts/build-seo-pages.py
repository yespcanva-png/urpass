import os
import json

PAGES_DATA = [
    # Batch A
    {
        "slug": "corporate-visitor-registration-software",
        "title": "Corporate Visitor Registration Software | UrPass",
        "h1": "Simplify Corporate Event Visitor Registration",
        "description": "Invite corporate guests, approve registrations and issue QR entry passes. Use UrPass to monitor arrivals and manage corporate event check-in.",
        "badge": "ENTERPRISE VISITOR ACCESS",
        "ctaLabel": "Create Corporate Event Free",
        "directAnswer": {
            "title": "How Does Corporate Visitor Registration Work on UrPass?",
            "summary": "UrPass streamlines enterprise visitor management for corporate summits, shareholder meetings, and executive roundtables. Guests register through custom branded forms, complete visitor confidentiality agreements, and receive instant digital QR passes on their smartphones. Gate and lobby receptionists scan passes in <0.3s with live dashboard telemetry.",
            "keyPoints": [
                "Custom branded registration with company email verification and NDA acknowledgment",
                "Instant smartphone QR pass dispatch via WhatsApp and email with zero paper badges",
                "Sub-second (<0.3s) camera check-in on lobby tablets or receptionist smartphones",
                "Live arrival notifications and real-time attendance telemetry for executive hosts"
            ]
        },
        "keyFactsTable": {
            "title": "UrPass vs Traditional Front Desk Guest Logging",
            "subtitle": "Comparison of corporate visitor registration workflows.",
            "headers": ["Visitor Management Capability", "UrPass Digital Pass System", "Paper Sign-in Books & Legacy Desks"],
            "rows": [
                {"col1": "Check-In Speed", "col2": "<0.3s instant QR camera verification", "col3": "2 to 4 minutes per visitor manual form"},
                {"col1": "Data Privacy & Security", "col2": "Encrypted digital records with audit logs", "col3": "Exposed paper registers visible to other guests"},
                {"col1": "Executive Arrival Alerts", "col2": "Instant WhatsApp and webhook notification", "col3": "Manual phone calls to host assistants"},
                {"col1": "Hardware Requirements", "col2": "Any smartphone, iPad, or lobby tablet", "col3": "Dedicated badge printers and sign-in kiosks"},
                {"col1": "Platform Fees", "col2": "Flat subscription / 0% ticket commission", "col3": "Costly per-terminal annual licenses"}
            ]
        },
        "features": [
            {"icon": "Building2", "title": "Executive Guest Registration", "desc": "Capture attendee company name, job designation, dietary preferences, and executive assistant contacts."},
            {"icon": "ShieldCheck", "title": "Confidentiality & NDA Signing", "desc": "Require corporate visitors to acknowledge visitor agreements and digital NDAs before pass release."},
            {"icon": "QrCode", "title": "Cryptographic QR Badges", "desc": "Generate high-contrast, non-duplicable digital entry tokens delivered directly to mobile wallets."},
            {"icon": "Smartphone", "title": "Receptionist Phone Scanning", "desc": "Front desk staff scan visitor passes using standard company smartphones or reception iPads."},
            {"icon": "Users", "title": "Host Arrival Alerts", "desc": "Notify meeting organizers automatically the instant their VIP clients or board members arrive."},
            {"icon": "FileSpreadsheet", "title": "Compliance Audit Logs", "desc": "Export timestamped visitor registers in CSV/Excel for building compliance and ISO audits."}
        ],
        "steps": [
            {"n": "01", "title": "Setup Event Form", "desc": "Configure your corporate summit name, venue, guest capacity, and visitor NDA requirements."},
            {"n": "02", "title": "Send Invites", "desc": "Import VIP guest lists or share private registration links restricted to your domain."},
            {"n": "03", "title": "Issue Digital Passes", "desc": "Approved visitors receive encrypted digital QR passes on WhatsApp and email."},
            {"n": "04", "title": "Scan at Reception", "desc": "Door security or reception staff verify guest passes in under 300ms using camera scans."},
            {"n": "05", "title": "Monitor Live Flow", "desc": "Track real-time arrival counts and department guest tallies from your live dashboard."}
        ],
        "callout": {
            "badge": "ENTERPRISE SECURITY",
            "title": "Replace insecure paper visitor books with tamper-proof digital access.",
            "description": "Enterprise security teams cannot afford handwritten paper logs where sensitive client names are exposed. UrPass encrypts every registration and provides sub-second verification.",
            "bullets": [
                "Strict privacy compliance protecting executive and client identity",
                "Instant verification preventing unauthorized building or boardroom access",
                "Zero expensive proprietary kiosk hardware to purchase or maintain",
                "Instant CSV export for facility safety and compliance audits"
            ]
        },
        "faqs": [
            {"q": "Can we require guests to sign an NDA before getting their pass?", "a": "Yes. UrPass allows custom consent fields and terms agreements. Passes are only released once the guest completes required acknowledgments."},
            {"q": "Does reception need dedicated barcode scanners?", "a": "No. Receptionists or security guards can scan guest QR passes on any smartphone, iPad, or computer webcam with zero software installation."},
            {"q": "Can corporate hosts receive notifications when their guests arrive?", "a": "Yes. UrPass provides automated webhooks and real-time dashboard updates so event coordinators know precisely when VIPs arrive at the venue."},
            {"q": "Is visitor data kept private and secure?", "a": "Absolutely. Data is encrypted in transit and at rest with row-level security, ensuring full compliance with corporate enterprise privacy requirements."}
        ],
        "relatedLinks": [
            {"title": "VIP Invitation Check-In", "href": "/vip-invitation-check-in-software", "category": "Product"},
            {"title": "Employee Event Registration", "href": "/employee-event-registration-software", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"}
        ]
    },
    {
        "slug": "trade-show-exhibitor-registration",
        "title": "Trade Show Exhibitor Registration | UrPass",
        "h1": "Manage Trade Show Exhibitors and Digital Passes",
        "description": "Register exhibitors, booth staff and VIP attendees with custom badge data and instant QR check-in at trade show entry points.",
        "badge": "TRADE SHOW & EXPO OPERATIONS",
        "ctaLabel": "Start Exhibitor Registration",
        "directAnswer": {
            "title": "How Does Trade Show Exhibitor Registration Work on UrPass?",
            "summary": "UrPass provides an end-to-end exhibitor management system for trade expos and commercial trade fairs. Event organizers allocate booth staff quotas, collect exhibitor badge credentials, and issue multi-day digital QR passes. Booth staff scan in at loading bays and exhibit hall turnstiles with sub-second camera verification.",
            "keyPoints": [
                "Allocated exhibitor booth passes with customizable staff quotas per booth tier",
                "Multi-day pass validity with setup-day early access permissions",
                "Instant QR badge delivery via WhatsApp and email for exhibitor teams",
                "Real-time exhibitor check-in analytics and booth occupancy telemetry"
            ]
        },
        "keyFactsTable": {
            "title": "Trade Show Exhibitor Management Comparison",
            "subtitle": "How UrPass accelerates trade show booth operations.",
            "headers": ["Exhibitor Feature", "UrPass Digital Platform", "Manual Badging & Plastic Ribbons"],
            "rows": [
                {"col1": "Badge Turnaround Time", "col2": "Instant digital pass release via smartphone", "col3": "Hours standing in line at on-site badge printers"},
                {"col1": "Booth Quota Allocation", "col2": "Automated booth-based registration quotas", "col3": "Messy Excel emails with exhibitor coordinators"},
                {"col1": "Setup Day Access Control", "col2": "Custom access rules for contractor / staff hours", "col3": "Paper wristbands and manual gate guards"},
                {"col1": "Badge Reprint Costs", "col2": "$0 / £0 (always available on mobile)", "col3": "$15 to $30 penalty fees per lost badge"},
                {"col1": "Multi-Hall Gate Sync", "col2": "Sub-150ms cloud sync across all exhibit halls", "col3": "Disconnected gate counters and slow paper logs"}
            ]
        },
        "features": [
            {"icon": "Briefcase", "title": "Booth Quota Management", "desc": "Assign custom staff badge allowances depending on exhibitor booth square footage or sponsorship tier."},
            {"icon": "Clock", "title": "Setup & Teardown Access", "desc": "Differentiate build-up contractor badges from official show floor exhibitor passes automatically."},
            {"icon": "QrCode", "title": "Digital Exhibitor Badges", "desc": "Branded mobile passes with company name, booth number, staff role, and scannable QR code."},
            {"icon": "ScanLine", "title": "Multi-Door Exhibition Scanning", "desc": "Fast camera scanning at main expo entrances, loading bay doors, and VIP exhibitor lounges."},
            {"icon": "Users", "title": "Self-Serve Team Roster", "desc": "Lead exhibitors can invite their own booth team members without burdening the event organizer."},
            {"icon": "BarChart3", "title": "Exhibitor Presence Telemetry", "desc": "Track which booths are checked in and staffed during official show hours in real time."}
        ],
        "steps": [
            {"n": "01", "title": "Define Booth Categories", "desc": "Set booth sizes (e.g. 9sqm, 18sqm, Anchor Pavilion) and assign default staff pass quotas."},
            {"n": "02", "title": "Invite Exhibitor Leads", "desc": "Send exhibitor registration portals to participating company coordinators."},
            {"n": "03", "title": "Exhibitors Register Team", "desc": "Exhibitor leads input booth staff names, designations, and contact numbers."},
            {"n": "04", "title": "Automated Pass Dispatch", "desc": "Staff receive personalized digital QR passes on WhatsApp and mobile email."},
            {"n": "05", "title": "Sub-Second Gate Scan", "desc": "Expo hall security verify booth badges in <0.3s on mobile devices without badge queues."}
        ],
        "callout": {
            "badge": "ZERO QUEUE POLICY",
            "title": "Eliminate 2-hour morning queues at trade show exhibitor registration desks.",
            "description": "On day one of major trade expos, booth staff arrive simultaneously with thousands of delegates. UrPass eliminates badge printing queues with instant digital phone check-in.",
            "bullets": [
                "Exhibitors arrive directly at their booths with pre-verified mobile QR badges",
                "No expensive badge printing contractors or malfunctioning thermal printers",
                "Instant pass replacements if a staff member loses their phone",
                "Full visibility over booth occupancy across multi-hall exhibition centers"
            ]
        },
        "faqs": [
            {"q": "Can exhibitors register additional booth staff beyond their quota?", "a": "Yes. Organizers can allow exhibitors to purchase supplementary staff passes at configured rates with zero platform fees."},
            {"q": "How does the system handle setup days before the expo opens?", "a": "UrPass allows organizers to set custom access dates and hours, granting setup access to contractors while locking out general delegates."},
            {"q": "Can exhibitors scan visitor badges for lead retrieval?", "a": "Yes! UrPass supports attendee badge scanning capabilities for fast booth lead capture and instant digital contact sharing."},
            {"q": "Does UrPass work across multiple exhibition halls and gates?", "a": "Yes. UrPass synchronizes scans in real-time (<150ms) across unlimited entry doors, loading bays, and VIP lounge turnstiles."}
        ],
        "relatedLinks": [
            {"title": "Industrial Exhibition Visitor Management", "href": "/industrial-exhibition-visitor-management", "category": "Product"},
            {"title": "Conference Badge Scanning Software", "href": "/conference-badge-scanning-software", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"}
        ]
    },
    {
        "slug": "industrial-exhibition-visitor-management",
        "title": "Industrial Exhibition Visitor Management | UrPass",
        "h1": "Register and Check In Industrial Exhibition Visitors",
        "description": "Streamline visitor pre-registration, gate check-in, and badging for industrial expos, machinery trade fairs and manufacturing summits.",
        "badge": "HEAVY INDUSTRY & TRADE EXPOS",
        "ctaLabel": "Setup Industrial Expo Entry",
        "directAnswer": {
            "title": "How Does Industrial Exhibition Visitor Management Work on UrPass?",
            "summary": "UrPass enables heavy machinery trade fairs, manufacturing summits, and industrial expos to pre-register trade buyers, verify company credentials, and process high volumes of visitors through turnstiles and gates. Organizers capture GSTIN/VAT numbers, enforce safety compliance, and scan visitor QR codes in <0.3s.",
            "keyPoints": [
                "Pre-registration screening capturing business vertical, GSTIN, and purchasing authority",
                "Instant digital QR badge issuance with offline-capable camera verification",
                "Multi-hall gate access control managing high-density trade buyer footfall",
                "Safety guidelines and industrial PPE acknowledgment capture before entry"
            ]
        },
        "keyFactsTable": {
            "title": "Industrial Expo Gate Operations Comparison",
            "subtitle": "Processing high-density trade buyer traffic efficiently.",
            "headers": ["Industrial Expo Need", "UrPass Digital Entry", "Traditional Onsite Badging Desks"],
            "rows": [
                {"col1": "Peak Gate Throughput", "col2": "1,200+ attendees per hour per smartphone lane", "col3": "120 attendees per hour per registration counter"},
                {"col1": "Trade Buyer Screening", "col2": "Mandatory business card / GSTIN verification", "col3": "Unchecked public entry diluting B2B visitor quality"},
                {"col1": "Safety Briefing Delivery", "col2": "Digital acknowledgment on pass confirmation", "col3": "Paper flyers that get discarded at the door"},
                {"col1": "Multi-Hall Tracking", "col2": "Sub-150ms cloud sync across machinery halls", "col3": "No real-time visibility into hall occupancy"},
                {"col1": "Offline Gate Resilience", "col2": "Local browser token caching if expo WiFi fails", "col3": "Total gate freeze if server connection drops"}
            ]
        },
        "features": [
            {"icon": "Factory", "title": "B2B Trade Buyer Qualification", "desc": "Capture industry sector, purchasing power, company GSTIN, and job title to ensure high visitor quality."},
            {"icon": "ShieldCheck", "title": "Safety & PPE Compliance", "desc": "Require industrial visitors to accept plant safety protocols and PPE requirements before entry."},
            {"icon": "QrCode", "title": "Sub-0.3s Gate Verification", "desc": "Turn any mobile device into a high-speed scanner capable of clearing hundreds of visitors per minute."},
            {"icon": "Layers", "title": "Machinery Hall Access Control", "desc": "Route visitors to specific halls or conference zones based on their registered ticket badge category."},
            {"icon": "Radio", "title": "Offline Scanning Failover", "desc": "Scanner continues validating passes even when dense expo hall WiFi drops or stalls."},
            {"icon": "BarChart3", "title": "Live Footfall Telemetry", "desc": "View hourly arrival curves and total live visitors inside the exhibition center at any time."}
        ],
        "steps": [
            {"n": "01", "title": "Publish Trade Portal", "desc": "Launch an industrial registration portal capturing business credentials and visitor profiles."},
            {"n": "02", "title": "Automated Pass Release", "desc": "Qualified trade visitors instantly receive verified digital QR passes via WhatsApp and email."},
            {"n": "03", "title": "Equip Gate Teams", "desc": "Gate staff open scanner URLs on their smartphones or rugged Android scanning terminals."},
            {"n": "04", "title": "Scan at Expo Gates", "desc": "Scan visitor QR codes in sub-0.3 seconds with instant green screen approval feedback."},
            {"n": "05", "title": "Review Trade Analytics", "desc": "Export complete B2B visitor logs with job roles, company verticals, and arrival timestamps."}
        ],
        "callout": {
            "badge": "HIGH FOOTFALL PERFORMANCE",
            "title": "Built to handle 20,000+ trade visitors across industrial exhibition complexes.",
            "description": "Industrial expos cannot tolerate gate logjams that frustrate international buyers and corporate delegates. UrPass delivers reliable sub-second check-in with offline fallback.",
            "bullets": [
                "Process high-volume morning rushes without physical badge printing delays",
                "Capture clean B2B buyer profiles with verified contact details",
                "Zero equipment rental costs — works on any standard smartphone camera",
                "Full compliance with venue safety capacities and fire codes"
            ]
        },
        "faqs": [
            {"q": "Can we collect company GSTIN or VAT numbers during registration?", "a": "Yes. UrPass allows custom fields including GSTIN, company registration numbers, and industry sector classifications."},
            {"q": "What happens if expo hall WiFi becomes congested or disconnects?", "a": "UrPass scanner features client-side caching that continues validating encrypted ticket tokens even when internet connectivity drops temporarily."},
            {"q": "Can we prevent public consumers from registering for a trade-only expo?", "a": "Yes. You can enable the Approval Workflow mode to screen applicant company domains and credentials before issuing entry passes."},
            {"q": "Can passes be scanned multiple times across a 3-day exhibition?", "a": "Yes. You can configure multi-day pass permissions allowing one check-in per day or re-entry across all show dates."}
        ],
        "relatedLinks": [
            {"title": "Trade Show Exhibitor Registration", "href": "/trade-show-exhibitor-registration", "category": "Product"},
            {"title": "Factory Visitor Event Registration", "href": "/factory-visitor-event-registration", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"}
        ]
    },
    {
        "slug": "dealer-meet-registration-software",
        "title": "Dealer Meet Registration Software | UrPass",
        "h1": "Organize Dealer Meets with Online Registration",
        "description": "Distribute personalized digital passes to distributor networks and dealers with RSVP tracking, multi-session check-in and live counts.",
        "badge": "DISTRIBUTOR & DEALER CONVENTIONS",
        "ctaLabel": "Organize Dealer Meet",
        "directAnswer": {
            "title": "How Does UrPass Simplify Dealer Meet Registration?",
            "summary": "UrPass allows corporate brands and automotive/FMCG manufacturers to import dealer directories, dispatch personalized WhatsApp invites, track RSVP confirmations, and manage multi-session access across keynotes, product demonstrations, and gala award dinners using a single QR pass.",
            "keyPoints": [
                "Bulk CSV import of authorized dealers, distributors, and franchise partners",
                "Personalized WhatsApp and SMS digital pass distribution with direct QR access",
                "Multi-session scanning tracking attendance at strategy sessions, lunches, and awards",
                "Real-time attendance dashboard showing regional dealer arrival status"
            ]
        },
        "keyFactsTable": {
            "title": "Dealer Meet Management: UrPass vs Manual Lists",
            "subtitle": "Efficiency benchmarks for national dealer conventions.",
            "headers": ["Convention Need", "UrPass Dealer System", "Manual Guest Registers & Printed Folders"],
            "rows": [
                {"col1": "Invite Delivery Method", "col2": "Direct WhatsApp & Email with personal QR pass", "col3": "Couriers and manual phone calls with uncertain RSVPs"},
                {"col1": "Banquet & Award Check-In", "col2": "<0.3s phone scan at ballroom entrance", "col3": "Paper search through alphabetical dealer binder lists"},
                {"col1": "Gala Gift / Kit Handout", "col2": "Scan QR pass to mark kit claimed (zero double claims)", "col3": "Ticking off paper rosters prone to duplicate gift claims"},
                {"col1": "Regional Head Telemetry", "col2": "Live dashboard by territory / sales region", "col3": "Zero visibility until manual count hours later"},
                {"col1": "Spouse / Plus-One Support", "col2": "Configurable group quotas linked to one dealer pass", "col3": "Confusion at front desk over unlisted guest entry"}
            ]
        },
        "features": [
            {"icon": "Users", "title": "Distributor Network Import", "desc": "Import thousands of authorized dealers with territory codes, dealership names, and phone numbers in seconds."},
            {"icon": "Send", "title": "WhatsApp Pass Dispatch", "desc": "Send branded event invitations and dynamic QR passes directly to dealer WhatsApp numbers."},
            {"icon": "Calendar", "title": "Multi-Session Access", "desc": "Track dealer attendance across daytime business presentations, executive roundtables, and evening galas."},
            {"icon": "BadgeCheck", "title": "Gift & Welcome Kit Validation", "desc": "Scan dealer passes to track gift kit distribution, ensuring each dealership receives exactly one allotment."},
            {"icon": "BarChart3", "title": "Zone & Region Analytics", "desc": "Monitor check-in velocity filtered by North, South, East, and West sales zones in real time."},
            {"icon": "QrCode", "title": "Group Quota Tickets", "desc": "Issue passes allowing the dealer plus their spouse or general manager to scan in together or separately."}
        ],
        "steps": [
            {"n": "01", "title": "Upload Dealer Directory", "desc": "Upload your dealer master list with dealership names, contact numbers, and region codes."},
            {"n": "02", "title": "Dispatch WhatsApp Passes", "desc": "Send personalized event passes with venue directions and dynamic QR access codes."},
            {"n": "03", "title": "Track RSVP Confirmations", "desc": "View confirmed, pending, and declined RSVPs in real time on your organizer screen."},
            {"n": "04", "title": "Scan at Convention Hall", "desc": "Door staff scan passes on arrival for sub-second badge verification and welcome."},
            {"n": "05", "title": "Manage Sessions & Kits", "desc": "Re-scan passes at lunch, strategy breakout rooms, and the gala dinner door."}
        ],
        "callout": {
            "badge": "ZERO EMBARRASSMENT",
            "title": "Welcome your top revenue partners with the VIP experience they deserve.",
            "description": "Dealers who generate millions in revenue should never wait in a crowded lobby while staff flip through printed Excel sheets. Give your partners a seamless, prestigious digital check-in.",
            "bullets": [
                "Deliver prestigious digital passes directly to their personal WhatsApp",
                "Instant check-in in under 0.3 seconds with personalized screen greeting",
                "Prevent duplicate claims on expensive gift kits and merchandise",
                "Real-time visibility for executive management on regional dealer presence"
            ]
        },
        "faqs": [
            {"q": "Can we send event passes directly via WhatsApp in bulk?", "a": "Yes! UrPass features built-in WhatsApp Cloud API integration to send personalized digital passes and QR codes directly to dealer phone numbers."},
            {"q": "Can a dealer bring their spouse or partner on the same pass?", "a": "Yes. UrPass supports group quotas where a single pass can admit 2, 3, or more people, decrementing entries as they enter."},
            {"q": "Can we track who attended the strategy session vs who only came for dinner?", "a": "Yes. UrPass supports session-wise attendance tracking so you can scan passes at individual conference rooms and evening banquets."},
            {"q": "Can we export dealer attendance records by sales territory?", "a": "Yes. All attendance records retain custom metadata (such as dealer code, territory, and tier) and can be exported with a single click."}
        ],
        "relatedLinks": [
            {"title": "WhatsApp Event Tickets", "href": "/whatsapp-event-tickets", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"},
            {"title": "Session-Wise Attendance Tracking", "href": "/session-wise-attendance-tracking", "category": "Product"},
            {"title": "Bulk Attendee CSV Import", "href": "/event-attendee-csv-import", "category": "Product"}
        ]
    },
    {
        "slug": "employee-event-registration-software",
        "title": "Employee Event Registration Software | UrPass",
        "h1": "Make Employee Event Registration Easier",
        "description": "Manage town halls, annual day celebrations, offsites and internal corporate gatherings with employee email verification and fast QR check-in.",
        "badge": "INTERNAL WORKPLACE EXPERIENCES",
        "ctaLabel": "Set Up Employee Event",
        "directAnswer": {
            "title": "How Does UrPass Streamline Employee Event Registration?",
            "summary": "UrPass simplifies company gatherings, annual days, retreats, and all-hands town halls. Employees register with company email validation, claim plus-one passes for family members, and receive digital QR passes. Gate staff scan 500+ employees in minutes without line congestion or paper badges.",
            "keyPoints": [
                "Domain-restricted registration ensuring only verified employees (@company.com) register",
                "Integrated plus-one and family quota handling for corporate annual celebrations",
                "Sub-300ms mobile camera scanning preventing security gate congestion",
                "Departmental check-in telemetry and live company-wide attendance tracking"
            ]
        },
        "keyFactsTable": {
            "title": "UrPass vs Internal Google Forms & Intranet Spreadsheets",
            "subtitle": "Efficiency and gate control for internal corporate events.",
            "headers": ["Event Capability", "UrPass Corporate System", "Google Forms & Printed Lists"],
            "rows": [
                {"col1": "Entrance Processing Speed", "col2": "<0.3s instant camera pass validation", "col3": "25 to 40 seconds searching names on paper rosters"},
                {"col1": "Plus-One / Family Allotment", "col2": "Automated group limit linked to single QR pass", "col3": "Uncontrolled plus-one additions causing catering shortages"},
                {"col1": "Duplicate Entry Prevention", "col2": "Instant atomic lock; pass cannot be shared", "col3": "No duplicate protection; anyone can state a colleague's ID"},
                {"col1": "Catering & Dietary Data", "col2": "Real-time live count of meal preferences", "col3": "Static Google Sheet with outdated headcounts"},
                {"col1": "Security Gate Deployment", "col2": "Security staff scan via standard mobile browser", "col3": "Expensive badge printing terminals or manual sign-offs"}
            ]
        },
        "features": [
            {"icon": "Building2", "title": "Corporate Domain Verification", "desc": "Restrict registration to authorized work emails (e.g. name@acme.corp) to prevent outside signups."},
            {"icon": "Users", "title": "Family & Plus-One Allotments", "desc": "Allocate controlled 1, 2, or 4-person family quotas for company annual days and family picnics."},
            {"icon": "QrCode", "title": "Mobile Wallet QR Passes", "desc": "Deliver secure digital passes to employee inboxes and smartphones with custom corporate branding."},
            {"icon": "ScanLine", "title": "Lightning Gate Scanning", "desc": "Process hundreds of arriving staff members per minute through campus turnstiles and security booths."},
            {"icon": "Layers", "title": "Departmental Telemetry", "desc": "Monitor check-in ratios by department (Engineering, Sales, HR, Finance) in real time."},
            {"icon": "ShieldCheck", "title": "Tamper-Proof Employee Pass", "desc": "Cryptographic tokens prevent employees from forwarding passes to non-eligible acquaintances."}
        ],
        "steps": [
            {"n": "01", "title": "Define Corporate Event", "desc": "Set date, venue, total employee capacity, and authorized corporate email domains."},
            {"n": "02", "title": "Employees Register", "desc": "Staff input their employee ID, select dietary requirements, and indicate family attendance."},
            {"n": "03", "title": "Pass Generation", "desc": "UrPass generates an encrypted QR ticket with employee credentials and entry limits."},
            {"n": "04", "title": "Security Check-In", "desc": "Volunteers or security guards scan employee passes on their phones in under 0.3s."},
            {"n": "05", "title": "Live Headcount Telemetry", "desc": "HR and facilities teams view real-time headcount to coordinate catering and seating."}
        ],
        "callout": {
            "badge": "CAMPUS & RESORT READY",
            "title": "Eliminate morning security gridlocks at your company annual day.",
            "description": "When 1,000 employees and their families arrive at an offsite resort or convention center, manual sign-in tables cause chaotic lines. UrPass provides frictionless gate flow.",
            "bullets": [
                "Process massive arrival waves smoothly with multiple volunteer smartphones",
                "Accurate headcount data for caterers, bus transport, and safety officers",
                "Ensure only active employees and registered family members gain admission",
                "Zero waste: eliminate thousands of plastic lanyard badges and paper tickets"
            ]
        },
        "faqs": [
            {"q": "Can we restrict registrations to our company email domain?", "a": "Yes. UrPass can enforce email domain validation (e.g., only @company.com) so external parties cannot access the registration form."},
            {"q": "How does the system handle employee family members arriving together?", "a": "You can configure a group entry limit (e.g., admitting up to 4 family members). The single QR code tracks used vs remaining family admissions seamlessly."},
            {"q": "Can staff scan passes without downloading an app?", "a": "Yes. The UrPass scanner runs directly in any modern mobile web browser (Chrome, Safari) with zero app installation needed."},
            {"q": "Can we capture dietary preferences for event catering?", "a": "Yes. Custom form fields capture vegetarian, vegan, and allergy notes with real-time aggregated totals for caterers."}
        ],
        "relatedLinks": [
            {"title": "Corporate Visitor Registration", "href": "/corporate-visitor-registration-software", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"}
        ]
    },
    {
        "slug": "product-launch-guest-registration",
        "title": "Product Launch Guest Registration | UrPass",
        "h1": "Manage Product Launch Invitations and Guest Entry",
        "description": "Send branded digital invitations, register press and VIP guests, and control launch event access with instant mobile QR scans.",
        "badge": "MEDIA & PRODUCT REVEALS",
        "ctaLabel": "Create Product Launch",
        "directAnswer": {
            "title": "How Does UrPass Manage Product Launch Guest Registration?",
            "summary": "UrPass powers exclusive product launch events, press reveals, and brand unveilings. Organizers distribute sleek, branded digital invitations, collect press accreditation details, enforce non-disclosure embargo agreements, and greet journalists and influencers with instant sub-second VIP check-in.",
            "keyPoints": [
                "Bespoke branded digital invitations matching your product aesthetic",
                "Press accreditation and media tier categorization (Press, Keynote VIP, Influencer)",
                "Digital embargo and non-disclosure agreement acknowledgment prior to pass release",
                "Instant host notifications when tier-one media and key journalists scan in"
            ]
        },
        "keyFactsTable": {
            "title": "Product Launch Operations: UrPass vs Generic Ticketing",
            "subtitle": "Brand experience and security benchmarks for press unveilings.",
            "headers": ["Launch Event Requirement", "UrPass Launch System", "Generic Ticketing Aggregators"],
            "rows": [
                {"col1": "Brand Experience", "col2": "100% white-label custom design with zero ads", "col3": "Aggregator branding promoting competing events"},
                {"col1": "Embargo / NDA Enforcement", "col2": "Mandatory digital sign-off before QR generation", "col3": "Manual paper NDAs signed in a crowded queue"},
                {"col1": "VIP & Press Alerting", "col2": "Instant WhatsApp / webhook alerts to PR leads", "col3": "No host notification; PR team unaware of arrivals"},
                {"col1": "Gate Check-In Speed", "col2": "<0.3s camera scan keeping red carpet flowing", "col3": "Slow barcode scans or manual name lookups"},
                {"col1": "Ticket Scalping / Sharing", "col2": "Cryptographic tokens strictly invalidating duplicate scans", "col3": "Shared screenshots leading to uninvited guests"}
            ]
        },
        "features": [
            {"icon": "Sparkles", "title": "Bespoke Invitation Aesthetics", "desc": "Design sleek digital passes with your product launch typography, color palette, and hero imagery."},
            {"icon": "ShieldCheck", "title": "Media Embargo Agreements", "desc": "Ensure tech reviewers and journalists digitally accept product embargo terms before receiving their ticket."},
            {"icon": "Users", "title": "Media Tier Segmentation", "desc": "Categorize attendees into Main Keynote, Hands-on Demo Area, and VIP Press Room access tiers."},
            {"icon": "Smartphone", "title": "Red Carpet Mobile Scanning", "desc": "Check in guests on the red carpet with iPhones or iPads in <0.3s for flawless first impressions."},
            {"icon": "Send", "title": "PR Team Arrival Alerts", "desc": "Notify your PR executives the moment key publication editors arrive at the entrance."},
            {"icon": "BarChart3", "title": "Live Press Room Telemetry", "desc": "Track attendance ratios between invited press outlets and actual checked-in media representatives."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Launch Experience", "desc": "Upload launch branding, venue details, guest capacity caps, and media accreditation fields."},
            {"n": "02", "title": "Send Exclusive Invites", "desc": "Dispatch personalized digital invitations to journalists, creators, and executive partners."},
            {"n": "03", "title": "Embargo Sign-Off", "desc": "Guests confirm RSVP and accept media embargo terms directly on their smartphone."},
            {"n": "04", "title": "Instant VIP Pass Dispatch", "desc": "Passes arrive instantly on WhatsApp and email, ready to be added to Apple Wallet or mobile browser."},
            {"n": "05", "title": "Red Carpet Check-In", "desc": "Hosts scan guest passes in under 300ms, ushering key guests directly into the launch theater."}
        ],
        "callout": {
            "badge": "PRESTIGE & CONFIDENTIALITY",
            "title": "A high-profile launch cannot afford entry friction or security leaks.",
            "description": "Tech journalists and media personalities judge the entire product experience by how smoothly the launch event is run. UrPass delivers a flawless, prestigious check-in experience.",
            "bullets": [
                "Zero third-party branding keeping the focus entirely on your new product",
                "Ensure uninvited guests and competitors cannot gatecrash private unveilings",
                "Real-time alerts allow PR directors to personally greet key editors",
                "Sub-second check-in ensures the red carpet and foyer remain uncluttered"
            ]
        },
        "faqs": [
            {"q": "Can we customize the pass design to match our product reveal branding?", "a": "Yes! UrPass includes a built-in Ticket Studio allowing custom brand colors, logos, background banners, and typography."},
            {"q": "How does the system prevent uninvited guests from using someone else's pass?", "a": "Passes contain unique cryptographic tokens. The moment a pass is scanned, it is atomically invalidated. Any duplicate scan attempt is flagged with the exact previous scan timestamp."},
            {"q": "Can we designate different access levels for general attendees vs hands-on press?", "a": "Yes. UrPass supports multi-tier ticket categories so staff scanners clearly indicate whether a guest has access to private hands-on demonstration rooms."},
            {"q": "Can our PR agency receive notifications when journalists arrive?", "a": "Yes. Real-time webhooks and live dashboard updates instantly alert PR teams when accredited journalists check in."}
        ],
        "relatedLinks": [
            {"title": "VIP Invitation Check-In", "href": "/vip-invitation-check-in-software", "category": "Product"},
            {"title": "Event Ticket Types Management", "href": "/event-ticket-types-management", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"}
        ]
    },
    {
        "slug": "vip-invitation-check-in-software",
        "title": "VIP Invitation and QR Check-In Software | UrPass",
        "h1": "Manage VIP Guest Invitations and Priority Check-In",
        "description": "Deliver exclusive digital VIP passes with priority lane check-in, instant organizer notifications, and real-time VIP attendance tracking.",
        "badge": "WHITE-GLOVE VIP OPERATIONS",
        "ctaLabel": "Create VIP Invitation Flow",
        "directAnswer": {
            "title": "How Does VIP Invitation and Check-In Work on UrPass?",
            "summary": "UrPass provides white-glove invitation and gate management for celebrities, corporate executives, dignitaries, and sponsors. Guests receive personalized, encrypted VIP passes with dedicated priority lane routing. When a VIP scans in, event directors and executive hosts receive instant arrival alerts to greet them personally.",
            "keyPoints": [
                "Encrypted, non-transferable VIP passes delivered via WhatsApp and email",
                "Dedicated priority fast-track lane scanning with custom on-screen dignitary greetings",
                "Instant SMS/WhatsApp/Webhook notifications to event coordinators upon VIP scan",
                "Private executive lounge and restricted backstage access control"
            ]
        },
        "keyFactsTable": {
            "title": "VIP Operations Comparison",
            "subtitle": "Elevating the high-stakes guest experience.",
            "headers": ["VIP Management Capability", "UrPass White-Glove System", "Paper Guest Lists & Manual Ushers"],
            "rows": [
                {"col1": "Arrival Alert to Host", "col2": "Instant automated alert the second pass is scanned", "col3": "Radio calls or delayed whispers between ushers"},
                {"col1": "Entrance Processing Time", "col2": "<0.3s frictionless phone scan", "col3": "Awkward 60-second searches on alphabetical paper lists"},
                {"col1": "Pass Transfer / Screenshot Theft", "col2": "Atomic token invalidation prevents pass sharing", "col3": "Name dropping allows unauthorized gatecrashers"},
                {"col1": "Restricted Zone Access", "col2": "Scanner validates VIP vs Green Room vs Stage Access", "col3": "Multiple color wristbands causing guest annoyance"},
                {"col1": "Privacy Protection", "col2": "Dignitary phone and details shielded from gate volunteers", "col3": "Private phone numbers printed on open clipboard rosters"}
            ]
        },
        "features": [
            {"icon": "BadgeCheck", "title": "Dedicated Priority Lanes", "desc": "Route high-profile attendees through private entrance lanes with zero wait time."},
            {"icon": "Sparkles", "title": "Custom Dignitary Greetings", "desc": "Scanner display flashes a personalized welcome screen with the guest's honorific title and seating."},
            {"icon": "Send", "title": "Instant Host Notifications", "desc": "Send real-time alerts to concierge teams and executive hosts the exact second a VIP arrives."},
            {"icon": "Lock", "title": "Backstage & Lounge Validation", "desc": "Re-scan VIP passes at green rooms, executive hospitality suites, and reserved seating areas."},
            {"icon": "ShieldCheck", "title": "Anti-Duplication Security", "desc": "Single-use cryptographic pass tokens ensure VIP passes cannot be forwarded or duplicated."},
            {"icon": "BarChart3", "title": "VIP Roster Telemetry", "desc": "Live executive dashboard showing which keynote speakers, sponsors, and dignitaries have arrived."}
        ],
        "steps": [
            {"n": "01", "title": "Import VIP List", "desc": "Upload VIP attendee records with titles (Dr., Minister, CEO, Ambassador) and special notes."},
            {"n": "02", "title": "Dispatch Bespoke Passes", "desc": "Deliver personalized digital passes via WhatsApp or custom high-touch email."},
            {"n": "03", "title": "Designate VIP Gates", "desc": "Assign specific smartphone scanners to priority lanes and executive entrances."},
            {"n": "04", "title": "Sub-Second VIP Entry", "desc": "Concierge scans pass in <0.3s; scanner displays greeting and designated table number."},
            {"n": "05", "title": "Host Welcomes Guest", "desc": "Executive director receives arrival notification and steps forward to welcome the dignitary."}
        ],
        "callout": {
            "badge": "WHITE-GLOVE CONCIERGE",
            "title": "Never keep a keynote speaker, sponsor, or celebrity waiting at your door.",
            "description": "Making a prominent sponsor or celebrity wait while an usher searches through a messy paper list is an event organizer's worst nightmare. UrPass ensures instant, dignified admission.",
            "bullets": [
                "Zero-friction arrival flow honoring high-status attendees",
                "Instant alerts ensure hospitality leads are in position before the guest walks in",
                "Shield VIP contact details from temporary event staff",
                "Accurate live attendance for security detail and executive protocols"
            ]
        },
        "faqs": [
            {"q": "Can the scanner show table numbers or reserved seating upon scanning?", "a": "Yes! UrPass can display custom attendee attributes—including table number, escort name, and dietary preferences—on the scanner screen."},
            {"q": "Can we prevent VIP passes from being shared or transferred?", "a": "Yes. Each pass is cryptographically signed and single-use. Once scanned, any duplicate attempt is immediately rejected with red alert feedback."},
            {"q": "Can our event director get an automated WhatsApp message when a specific VIP arrives?", "a": "Yes. Real-time webhooks and notification integrations allow instant automated alerts to designated staff upon specific VIP check-ins."},
            {"q": "Can VIP passes be used to access both the main hall and the VIP lounge?", "a": "Yes. UrPass supports multi-zone access control so one pass grants entry to the main venue and restricted hospitality lounges."}
        ],
        "relatedLinks": [
            {"title": "Product Launch Guest Registration", "href": "/product-launch-guest-registration", "category": "Product"},
            {"title": "Event Registration Approval Workflow", "href": "/event-registration-approval-workflow", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Conference Badge Scanning Software", "href": "/conference-badge-scanning-software", "category": "Product"}
        ]
    },
    {
        "slug": "business-networking-event-registration",
        "title": "Networking Event Registration Software | UrPass",
        "h1": "Register and Welcome Business Networking Guests",
        "description": "Simplify registration, badge generation, and attendee check-in for business meetups, breakfast roundtables and networking mixers.",
        "badge": "BUSINESS MIXERS & ROUNDTABLES",
        "ctaLabel": "Create Networking Event",
        "directAnswer": {
            "title": "How Does UrPass Handle Business Networking Event Registration?",
            "summary": "UrPass makes organizing business networking breakfasts, chamber of commerce mixers, and executive roundtables seamless. Attendees register quickly, capture job titles and LinkedIn profiles, receive digital passes, and check in in <0.3s so guests spend their time networking rather than waiting in lines.",
            "keyPoints": [
                "Fast, mobile-friendly registration collecting company, designation, and LinkedIn profile",
                "Automated digital passes and instant printable attendee name badges",
                "Sub-300ms phone camera scanning at the venue door to eliminate check-in bottlenecks",
                "Exportable attendee directory for post-event delegate follow-ups"
            ]
        },
        "keyFactsTable": {
            "title": "Networking Event Management Comparison",
            "subtitle": "Facilitating high-value B2B connections without administrative friction.",
            "headers": ["Networking Operational Need", "UrPass Digital System", "Manual Paper Rosters & Name Tags"],
            "rows": [
                {"col1": "Lobby Arrival Flow", "col2": "<0.3s phone scan directly into networking floor", "col3": "10-minute wait while host searches through pre-printed tags"},
                {"col1": "Walk-In Registrations", "col2": "Instant self-serve QR registration on mobile in 45s", "col3": "Manual handwriting on blank tags slowing everyone down"},
                {"col1": "Attendee Contact Capture", "col2": "Structured LinkedIn, company, and email records", "col3": "Illegible handwritten business cards or sign-in sheets"},
                {"col1": "Post-Event Networking List", "col2": "One-click export of verified attendees for follow-up", "col3": "Days spent transcribing paper sign-in sheets into Excel"},
                {"col1": "Platform Ticketing Fee", "col2": "0% per-ticket platform commission", "col3": "5% to 8% aggregator tax on paid breakfast tickets"}
            ]
        },
        "features": [
            {"icon": "Briefcase", "title": "B2B Profile Collection", "desc": "Capture company name, industry vertical, LinkedIn profile URL, and job title during registration."},
            {"icon": "QrCode", "title": "Instant Mobile Pass", "desc": "Registrants receive clean digital passes on WhatsApp and email, ready for quick entrance."},
            {"icon": "ScanLine", "title": "Sub-0.3s Door Check-In", "desc": "Scan passes on any smartphone or tablet to welcome delegates without hallway congestion."},
            {"icon": "Users", "title": "Live Attendee Headcount", "desc": "Track attendance percentage and observe when key industry sponsors and speakers arrive."},
            {"icon": "CreditCard", "title": "Paid Networking Tickets", "desc": "Collect breakfast and luncheon seat fees via instant UPI and cards with 0% platform commission."},
            {"icon": "FileSpreadsheet", "title": "Post-Event Follow-Up Export", "desc": "Export verified attendee records with full profile metadata for seamless follow-up communications."}
        ],
        "steps": [
            {"n": "01", "title": "Create Networking Page", "desc": "Set date, breakfast venue, attendee seat limit, and ticket pricing (or free RSVP)."},
            {"n": "02", "title": "Share Registration Link", "desc": "Distribute your registration link across LinkedIn, email newsletters, and WhatsApp groups."},
            {"n": "03", "title": "Collect Professional Profiles", "desc": "Attendees register their job titles, company names, and contact credentials in under a minute."},
            {"n": "04", "title": "Rapid Door Check-In", "desc": "Host scans passes with their phone at the entrance; guests step immediately into conversations."},
            {"n": "05", "title": "Share Follow-Up Roster", "desc": "Export checked-in attendees to send post-event connection notes and presentation decks."}
        ],
        "callout": {
            "badge": "FRICTIONLESS CONNECTIONS",
            "title": "Attendees come to build relationships, not wait in hotel hallway lines.",
            "description": "Nothing dampens enthusiasm at a breakfast mixer like waiting 15 minutes at a cramped registration table. UrPass ensures guests walk through the door and straight into conversations.",
            "bullets": [
                "Under 0.3s check-in ensures smooth flow into the networking room",
                "Capture accurate, verified company titles and LinkedIn profiles",
                "Collect ticket fees directly into your bank account with 0% platform cuts",
                "Instant post-event data export for community building and follow-ups"
            ]
        },
        "faqs": [
            {"q": "Can attendees register on their phone if they show up at the door as walk-ins?", "a": "Yes! You can display a QR code at the entrance. Walk-ins scan it, register and pay in 45 seconds, and receive an instant scannable pass."},
            {"q": "Can we charge for breakfast or lunch tickets?", "a": "Yes. UrPass connects directly with Razorpay or Stripe to accept UPI, credit cards, and debit cards with 0% platform commission."},
            {"q": "Can we share the attendee list with participants after the event?", "a": "Yes. Organizers can export attendee names, companies, and LinkedIn profiles to share networking rosters with consent."},
            {"q": "Does the organizer need to buy ticket scanning hardware?", "a": "No. Any volunteer or committee member can open the scanner link on their smartphone camera with zero downloads."}
        ],
        "relatedLinks": [
            {"title": "Event Registration with Payment Gateway", "href": "/event-registration-with-payment-gateway", "category": "Product"},
            {"title": "Zero Commission Event Ticketing", "href": "/zero-commission-event-ticketing", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"},
            {"title": "Corporate Visitor Registration", "href": "/corporate-visitor-registration-software", "category": "Product"}
        ]
    },
    {
        "slug": "association-meeting-registration",
        "title": "Association Meeting Registration Software | UrPass",
        "h1": "Simplify Association Annual Meeting Registrations",
        "description": "Handle annual general meetings, chapter conventions and member assemblies with member verification, digital passes and quorum tracking.",
        "badge": "GOVERNANCE & MEMBER CONVENTIONS",
        "ctaLabel": "Set Up Association Meeting",
        "directAnswer": {
            "title": "How Does UrPass Manage Association Meeting Registration?",
            "summary": "UrPass provides secure registration and attendance tracking for trade associations, professional bodies (medical, legal, accounting), and society AGMs. Organizers verify member registration numbers, manage proxy voter credentials, issue digital QR passes, and track live quorum counts required for constitutional votes.",
            "keyPoints": [
                "Member ID and chapter validation during registration to ensure voting eligibility",
                "Proxy delegate assignment and voting quorum tracking in real time",
                "Instant digital QR passes delivered via WhatsApp and email",
                "Legally verifiable attendance logs for constitutional AGM compliance"
            ]
        },
        "keyFactsTable": {
            "title": "Association AGM Operations Comparison",
            "subtitle": "Ensuring constitutional quorum and voting compliance.",
            "headers": ["AGM Governance Requirement", "UrPass Association System", "Paper Sign-in Books & Roster Lists"],
            "rows": [
                {"col1": "Quorum Calculation", "col2": "Instant live tally on dashboard; know when quorum is met", "col3": "Hours spent manually counting signatures while meeting stalls"},
                {"col1": "Member Eligibility Check", "col2": "Pre-verified membership numbers; blocks non-members", "col3": "Disputed voting eligibility on the assembly floor"},
                {"col1": "Proxy Voter Management", "col2": "Proxy delegates linked directly to voting tokens", "col3": "Lost paper proxy forms causing governance disputes"},
                {"col1": "Check-In Speed", "col2": "<0.3s scan per member at auditorium entrance", "col3": "Massive queues delaying start of official proceedings"},
                {"col1": "Statutory Audit Records", "col2": "Cryptographic timestamped attendance ledger", "col3": "Vulnerable handwritten sign-in sheets subject to challenge"}
            ]
        },
        "features": [
            {"icon": "Users", "title": "Member Number Verification", "desc": "Validate membership credentials against your member directory before issuing attendance passes."},
            {"icon": "BarChart3", "title": "Live Quorum Telemetry", "desc": "Monitor active in-room member counts in real time to confirm official quorum for statutory motions."},
            {"icon": "ShieldCheck", "title": "Proxy Voter Handling", "desc": "Track accredited proxy voters representing absent members with verifiable digital authorization tokens."},
            {"icon": "QrCode", "title": "Tamper-Proof Voting Passes", "desc": "Cryptographically signed QR tokens prevent non-members or disqualified individuals from entering."},
            {"icon": "ScanLine", "title": "Multi-Door Auditorium Scanning", "desc": "Scan hundreds of delegates per minute across all main auditorium and balcony entrances."},
            {"icon": "FileText", "title": "Constitutional Audit Logs", "desc": "Generate legally defensible attendance registers with exact check-in timestamps for AGM minutes."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Annual Meeting", "desc": "Set AGM date, constitutionally required quorum threshold, and member ticket categories."},
            {"n": "02", "title": "Upload Member Master List", "desc": "Import member IDs, full names, voting chapters, and contact phone numbers."},
            {"n": "03", "title": "Dispatch Digital Passes", "desc": "Members receive their verified AGM attendance pass with embedded QR code via WhatsApp & email."},
            {"n": "04", "title": "Scan at Convention Hall", "desc": "Door marshals scan passes in under 300ms, immediately logging the member into the quorum count."},
            {"n": "05", "title": "Certify Quorum & Proceedings", "desc": "Meeting chairs view real-time quorum confirmation on the dashboard and commence voting."}
        ],
        "callout": {
            "badge": "STATUTORY COMPLIANCE",
            "title": "Never delay an AGM because staff are struggling to manually verify quorum.",
            "description": "Annual general meetings often begin late because volunteers must manually count signatures to certify quorum. UrPass gives the meeting secretary a live, legally compliant count on screen.",
            "bullets": [
                "Real-time quorum certification displayed live to the meeting chair",
                "Eliminate disputes regarding member eligibility and proxy authorizations",
                "Ensure only active, dues-paying members receive voting admission",
                "Generate complete digital audit trails for regulatory compliance"
            ]
        },
        "faqs": [
            {"q": "Can the software prevent non-members from registering for the AGM?", "a": "Yes. You can import your authorized member list and mandate membership number validation, or enable approval mode to verify every registration."},
            {"q": "How does UrPass help certify that quorum has been achieved?", "a": "The organizer dashboard displays live check-ins against your constitutional quorum threshold, updating in real time as members enter the hall."},
            {"q": "Can proxy delegates be tracked separately from primary voting members?", "a": "Yes. Custom delegate fields designate whether an attendee is attending as a primary member or accredited proxy holder."},
            {"q": "Can we export the official attendance list for our AGM minutes?", "a": "Yes. One-click export generates an audit-ready spreadsheet with member names, registration IDs, and check-in timestamps."}
        ],
        "relatedLinks": [
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Bulk Attendee CSV Import", "href": "/event-attendee-csv-import", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Event Registration Approval Workflow", "href": "/event-registration-approval-workflow", "category": "Product"}
        ]
    },
    {
        "slug": "factory-visitor-event-registration",
        "title": "Factory Visitor Event Registration | UrPass",
        "h1": "Manage Factory Event Guests with Digital QR Passes",
        "description": "Coordinate vendor days, open houses, plant visits and factory tour check-ins with secure digital registration and access validation.",
        "badge": "PLANT VISITS & VENDOR SUMMITS",
        "ctaLabel": "Create Plant Event",
        "directAnswer": {
            "title": "How Does Factory Visitor Event Registration Work with UrPass?",
            "summary": "UrPass manages visitor registration and security gate access for manufacturing plants, automotive assembly factories, and industrial vendor days. Visitors pre-register, review safety protocols and PPE requirements, and receive digital QR entry passes. Security teams at outer perimeter gates scan passes in <0.3s.",
            "keyPoints": [
                "Mandatory industrial safety briefing and PPE gear acknowledgment before pass issuance",
                "Perimeter security gate verification using standard smartphones or rugged Android scanners",
                "Time-gated visitor access restricting entry to designated tour windows and plant zones",
                "Emergency muster point roll call capability with real-time in-plant headcount"
            ]
        },
        "keyFactsTable": {
            "title": "Factory Visitor Security Comparison",
            "subtitle": "EHS safety compliance and plant perimeter security.",
            "headers": ["Industrial Safety Factor", "UrPass Plant Pass System", "Gatehouse Paper Visitor Logs"],
            "rows": [
                {"col1": "Safety Briefing Acknowledgment", "col2": "Digital signature required prior to QR pass release", "col3": "Hasty verbal briefing at gatehouse with zero proof"},
                {"col1": "Emergency Evacuation Muster", "col2": "Live on-site visitor headcount accessible on mobile", "col3": "Paper logbook trapped inside gatehouse during fire"},
                {"col1": "Perimeter Gate Throughput", "col2": "<0.3s camera scan keeping gate traffic clear", "col3": "Vehicles queued on highway waiting for manual check-in"},
                {"col1": "Restricted Zone Access", "col2": "Scanner validates specific assembly line permissions", "col3": "Generic paper badges with no zone verification"},
                {"col1": "EHS Safety Compliance Audit", "col2": "Instant digital audit log with exact entry timestamps", "col3": "Illegible, incomplete physical sign-in books"}
            ]
        },
        "features": [
            {"icon": "Factory", "title": "Plant Perimeter Gate Scanning", "desc": "Security personnel scan visitor passes at outer gates and security checkpoints in under 0.3 seconds."},
            {"icon": "ShieldCheck", "title": "Safety & PPE Acknowledgments", "desc": "Require visitors to review mandatory safety rules (steel-toe footwear, hi-vis vests) before receiving passes."},
            {"icon": "Clock", "title": "Time-Gated Shift Access", "desc": "Restrict pass validity to specific tour slots, vendor meeting windows, or morning/afternoon shifts."},
            {"icon": "Layers", "title": "Zone & Line Access Control", "desc": "Control which visitors have clearance for shop floor tours versus administrative office boardrooms."},
            {"icon": "Users", "title": "Emergency Muster Headcount", "desc": "Access live lists of all on-site visitors instantly on security smartphones during emergency drills."},
            {"icon": "QrCode", "title": "WhatsApp QR Dispatch", "desc": "Send digital passes with GPS gate coordinates and parking instructions directly to visitor WhatsApp."}
        ],
        "steps": [
            {"n": "01", "title": "Set Up Plant Event", "desc": "Configure vendor day, plant opening, or client tour with safety requirements and visitor quotas."},
            {"n": "02", "title": "Visitors Pre-Register", "desc": "Guests submit vehicle numbers, ID details, and accept mandatory EHS plant safety rules."},
            {"n": "03", "title": "Deliver Digital Passes", "desc": "Approved guests receive encrypted digital QR passes on WhatsApp with gate entry instructions."},
            {"n": "04", "title": "Security Gate Scan", "desc": "Security guards scan visitor passes through car windows or at turnstiles in under 0.3s."},
            {"n": "05", "title": "Maintain Safety Telemetry", "desc": "Monitor active in-plant headcount to ensure full compliance with factory fire safety caps."}
        ],
        "callout": {
            "badge": "EHS SAFETY & COMPLIANCE",
            "title": "Know exactly who is inside your manufacturing facility at all times.",
            "description": "Industrial manufacturing plants carry strict environmental, health, and safety (EHS) obligations. UrPass ensures every visitor has acknowledged safety rules and gives safety teams live headcount.",
            "bullets": [
                "Instant emergency muster roll call accessible from any safety officer's phone",
                "Prevent unauthorized access to dangerous machinery or restricted production lines",
                "Eliminate long truck and car queues at security entry gates",
                "Full digital audit trails for ISO 45001 and workplace safety inspections"
            ]
        },
        "faqs": [
            {"q": "Can we mandate that visitors accept safety rules before receiving an entry pass?", "a": "Yes. UrPass allows you to embed plant safety protocols, footwear rules, and NDAs that must be accepted before a pass is released."},
            {"q": "Can security guards scan passes outdoors without specialized equipment?", "a": "Yes. Security teams can use any standard smartphone camera or rugged Android device to scan passes in all lighting conditions."},
            {"q": "How does the system support emergency evacuation and muster accounting?", "a": "The real-time dashboard shows exact counts and names of all currently checked-in visitors, accessible immediately on mobile during drills or alarms."},
            {"q": "Can we collect vehicle registration numbers during visitor signup?", "a": "Yes. Custom form fields capture driver license numbers, vehicle registration plates, and company names."}
        ],
        "relatedLinks": [
            {"title": "Industrial Exhibition Visitor Management", "href": "/industrial-exhibition-visitor-management", "category": "Product"},
            {"title": "Event Entry and Exit Tracking", "href": "/event-entry-exit-tracking", "category": "Product"},
            {"title": "Corporate Visitor Registration", "href": "/corporate-visitor-registration-software", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"}
        ]
    },

    # Batch B
    {
        "slug": "event-registration-with-payment-gateway",
        "title": "Event Registration with Payment Gateway | UrPass",
        "h1": "Accept Online Event Registrations and Payments",
        "description": "Collect registration fees seamlessly with integrated Razorpay, UPI, credit cards and net banking with zero platform ticket commissions.",
        "badge": "INTEGRATED DIRECT PAYMENTS",
        "ctaLabel": "Accept Ticket Payments",
        "directAnswer": {
            "title": "How Does Event Registration with Payment Gateway Work on UrPass?",
            "summary": "UrPass connects directly with payment gateways like Razorpay and Stripe so organizers can collect ticket fees via UPI, credit cards, debit cards, and Net Banking. Unlike ticketing aggregators that charge 5% to 10% commission, UrPass charges 0% per-ticket platform fees with direct T+2 bank deposits.",
            "keyPoints": [
                "Native payment gateway integration supporting UPI, Cards, Net Banking, and Wallets",
                "0% per-ticket platform fees — keep 100% of your gross ticket sales revenue",
                "Automated GST-compliant tax invoices generated and emailed upon payment",
                "Immediate ticket dispatch with cryptographically signed digital QR passes"
            ]
        },
        "keyFactsTable": {
            "title": "Payment Gateway Integration Comparison",
            "subtitle": "How UrPass direct gateway processing beats ticketing aggregators.",
            "headers": ["Financial & Processing Factor", "UrPass Direct Gateway Integration", "Traditional Ticketing Aggregators"],
            "rows": [
                {"col1": "Platform Commission", "col2": "0% commission on all ticket transactions", "col3": "5% to 8% cut on every single ticket sold"},
                {"col1": "Payout Settlement Speed", "col2": "Direct T+2 settlement to your bank account", "col3": "Held by platform until 7–14 days post-event"},
                {"col1": "Payment Method Coverage", "col2": "UPI (GPay/PhonePe/Paytm), Cards, Net Banking", "col3": "Often limited or high-friction redirects"},
                {"col1": "Attendee Data Ownership", "col2": "100% organizer ownership with zero third-party ads", "col3": "Aggregator markets competing events to your attendees"},
                {"col1": "GST Tax Invoicing", "col2": "Automated B2B GST tax invoices with your GSTIN", "col3": "Complex reconciliation or missing buyer tax invoices"}
            ]
        },
        "features": [
            {"icon": "CreditCard", "title": "Direct Gateway Connection", "desc": "Connect your own verified Razorpay or Stripe account in minutes to receive ticket funds directly."},
            {"icon": "Zap", "title": "Instant UPI App-Switch", "desc": "Indian attendees pay in 5 seconds via Google Pay, PhonePe, and Paytm with zero checkout friction."},
            {"icon": "ShieldCheck", "title": "0% Platform Commissions", "desc": "Keep every single rupee or pound of ticket sales. You only pay standard bank interchange fees."},
            {"icon": "FileText", "title": "Automated GST Invoices", "desc": "Automatically issue compliant tax invoices with your organization GSTIN, SAC codes, and buyer details."},
            {"icon": "QrCode", "title": "Automated Pass Dispatch", "desc": "The millisecond payment is confirmed by the gateway, a cryptographically signed QR ticket is dispatched."},
            {"icon": "BarChart3", "title": "Real-Time Sales Telemetry", "desc": "Monitor live revenue, conversion funnels, and ticket tier velocity from your organizer console."}
        ],
        "steps": [
            {"n": "01", "title": "Create Paid Event", "desc": "Set ticket tiers, prices in INR/GBP/USD, and capacity limits on your event dashboard."},
            {"n": "02", "title": "Connect Gateway", "desc": "Link your Razorpay or Stripe API keys in your organizer settings with one click."},
            {"n": "03", "title": "Share Ticket Page", "desc": "Publish a clean, conversion-focused ticket checkout page that loads in under 1 second."},
            {"n": "04", "title": "Attendees Pay Online", "desc": "Buyers pay instantly via UPI, credit/debit cards, or net banking with bank-grade security."},
            {"n": "05", "title": "Funds Settle Directly", "desc": "Ticket revenue lands directly in your merchant bank account on standard T+2 cycles."}
        ],
        "callout": {
            "badge": "MAXIMIZE TICKET REVENUE",
            "title": "Stop giving away 8% of your event revenue to ticketing middlemen.",
            "description": "On an event generating ₹10,00,000 / £10,000 in ticket sales, traditional ticketing platforms siphon off up to ₹80,000 / £800 in arbitrary platform commission. UrPass charges 0% commission.",
            "bullets": [
                "Retain 100% of your hard-earned event ticket earnings",
                "Direct settlement maintains healthy event cash flow for deposits and vendors",
                "Full ownership of your buyer email addresses and customer data",
                "Automated GST tax compliance eliminating manual accounting headaches"
            ]
        },
        "faqs": [
            {"q": "Which payment gateways does UrPass integrate with?", "a": "UrPass integrates directly with Razorpay (ideal for India, supporting UPI, Net Banking, and Cards) and Stripe (for global cards and payments)."},
            {"q": "Does UrPass charge any percentage on ticket sales?", "a": "No. UrPass charges 0% platform commission on all plans. You only pay the direct payment gateway processing fee (e.g., standard ~2% gateway fee)."},
            {"q": "When do ticket funds get deposited into my bank account?", "a": "Because you connect your own gateway account, funds settle directly on your standard gateway payout schedule (typically T+2 business days)."},
            {"q": "Can attendees get automatic GST tax invoices for business expenses?", "a": "Yes! UrPass automatically generates and emails compliant GST invoices containing your organization GSTIN and attendee billing details."}
        ],
        "relatedLinks": [
            {"title": "UPI Event Ticketing Software", "href": "/upi-event-ticketing-software", "category": "Product"},
            {"title": "Zero Commission Event Ticketing", "href": "/zero-commission-event-ticketing", "category": "Product"},
            {"title": "Event Ticket Sales Reporting", "href": "/event-ticket-sales-reporting", "category": "Product"},
            {"title": "Paid Workshop Registration Software", "href": "/paid-workshop-registration-software", "category": "Product"}
        ]
    },
    {
        "slug": "paid-workshop-registration-software",
        "title": "Paid Workshop Registration Software | UrPass",
        "h1": "Sell Workshop Seats and Manage Attendees",
        "description": "Sell tickets for professional workshops, bootcamps and masterclasses with integrated payments, automated receipts and digital QR entry.",
        "badge": "WORKSHOPS & MASTERCLASSES",
        "ctaLabel": "Sell Workshop Seats",
        "directAnswer": {
            "title": "How Does Paid Workshop Registration Work on UrPass?",
            "summary": "UrPass provides an all-in-one registration and ticketing solution for corporate trainers, design masterclasses, and coding bootcamps. Organizers set strict seat caps, sell Early Bird and General Admission tickets, collect payments via UPI and cards with 0% platform fees, and verify attendees at the workshop door in <0.3s.",
            "keyPoints": [
                "Strict seat capacity management preventing overbooking of interactive workshops",
                "Tiered pricing (Early Bird, Standard, Group) with automated price expiration dates",
                "0% per-seat platform fees to maximize instructor and training agency revenue",
                "Automated workshop syllabus delivery and calendar invites upon registration"
            ]
        },
        "keyFactsTable": {
            "title": "Workshop Registration: UrPass vs Generic Forms",
            "subtitle": "Optimizing seat sales and attendance for intensive training events.",
            "headers": ["Workshop Feature", "UrPass Workshop Platform", "Google Forms + Manual Payment Checks"],
            "rows": [
                {"col1": "Payment & Seat Confirmation", "col2": "Instant automated seat lock upon successful payment", "col3": "Manual UPI screenshot verification taking hours"},
                {"col1": "Strict Seat Capacity Capping", "col2": "Automated 'Sold Out' trigger at exact seat limit", "col3": "Forms stay open causing embarrassing overbooking"},
                {"col1": "Check-In Speed at Door", "col2": "<0.3s camera scan on instructor's phone", "col3": "Manual paper sign-in delaying workshop start"},
                {"col1": "Platform Ticket Fees", "col2": "0% commission; keep 100% of seat revenue", "col3": "Aggregators take 5% to 10% per attendee"},
                {"col1": "Automated Tax Receipts", "col2": "Instant GST invoice sent to corporate delegates", "col3": "Manual PDF invoice generation after the workshop"}
            ]
        },
        "features": [
            {"icon": "Users", "title": "Strict Seat Capacity Limits", "desc": "Cap registrations at exact classroom limits (e.g., 30 or 50 seats); checkout closes automatically when full."},
            {"icon": "CreditCard", "title": "Zero Commission Seat Sales", "desc": "Sell workshop seats via UPI and credit cards without sacrificing 5%–10% of revenue to aggregators."},
            {"icon": "Layers", "title": "Early Bird & Student Tiers", "desc": "Configure discounted Early Bird deadlines and student pricing with automatic price adjustments."},
            {"icon": "QrCode", "title": "Instant QR Ticket & Calendar", "desc": "Attendees receive digital tickets with venue directions and add-to-calendar invites immediately."},
            {"icon": "ScanLine", "title": "Sub-0.3s Classroom Check-In", "desc": "Scan attendees at the classroom door using any phone camera to start your workshop on schedule."},
            {"icon": "FileText", "title": "Automated B2B Tax Receipts", "desc": "Deliver compliant GST invoices so corporate attendees can claim company training reimbursements."}
        ],
        "steps": [
            {"n": "01", "title": "Create Workshop", "desc": "Set workshop topic, venue or studio location, seat cap (e.g. 25 attendees), and ticket pricing."},
            {"n": "02", "title": "Configure Ticket Tiers", "desc": "Add Early Bird discount tiers with automated expiration dates and standard seat tiers."},
            {"n": "03", "title": "Share Landing Link", "desc": "Promote your dedicated, high-converting workshop link on LinkedIn, Twitter, and email."},
            {"n": "04", "title": "Collect Instant Payments", "desc": "Attendees pay securely via UPI or cards; seat count decrements automatically in real time."},
            {"n": "05", "title": "Scan at the Door", "desc": "Scan student QR passes with your smartphone camera to begin training without delays."}
        ],
        "callout": {
            "badge": "TRAINER-FIRST TICKETING",
            "title": "Never lose hours manually verifying UPI payment screenshots on WhatsApp.",
            "description": "Independent trainers and agencies waste countless hours checking bank statements to confirm attendees who sent payment screenshots. UrPass automates payment, receipting, and pass dispatch.",
            "bullets": [
                "Automated instant booking confirmation and pass dispatch",
                "Zero risk of classroom overbooking with real-time seat lock",
                "Keep 100% of your training earnings with 0% platform cuts",
                "Deliver professional B2B invoices for company expense claims"
            ]
        },
        "faqs": [
            {"q": "Can I set an exact limit of 25 attendees for my workshop?", "a": "Yes. UrPass enforces strict capacity caps. The moment the 25th seat is booked, the registration page automatically shows 'Sold Out'."},
            {"q": "Can I offer an Early Bird discount that expires on a specific date?", "a": "Yes. You can configure multiple ticket tiers with individual pricing, quotas, and automatic sale start/end dates."},
            {"q": "Do I need special equipment to check people in at the workshop?", "a": "No. You can open the UrPass scanner URL on your smartphone, grant camera access, and scan tickets in under 0.3 seconds."},
            {"q": "Can attendees claim corporate training reimbursement with GST?", "a": "Yes. Attendees can enter their company name and GSTIN during checkout to receive an automated compliant tax invoice."}
        ],
        "relatedLinks": [
            {"title": "Event Registration with Payment Gateway", "href": "/event-registration-with-payment-gateway", "category": "Product"},
            {"title": "Zero Commission Event Ticketing", "href": "/zero-commission-event-ticketing", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Event Ticket Types Management", "href": "/event-ticket-types-management", "category": "Product"}
        ]
    },
    {
        "slug": "multi-day-event-ticketing-software",
        "title": "Multi-Day Event Ticketing Software | UrPass",
        "h1": "Manage Tickets for Multi-Day Events",
        "description": "Issue multi-day passes, track individual day check-ins, and prevent pass misuse across multi-day conferences and festivals.",
        "badge": "MULTI-DAY CONVENTIONS & FESTIVALS",
        "ctaLabel": "Create Multi-Day Event",
        "directAnswer": {
            "title": "How Does Multi-Day Event Ticketing Work on UrPass?",
            "summary": "UrPass manages multi-day conferences, weekend summits, and three-day festivals with intelligent pass lifecycle rules. Organizers can issue All-Access multi-day passes or individual Day 1, Day 2, and Day 3 passes. Gate scanners enforce daily admission rules, prevent pass pass-backs, and track attendance per calendar day.",
            "keyPoints": [
                "Flexible pass configurations: Full Multi-Day Passes vs Single-Day Passes",
                "Automated daily scan reset allowing one valid entry per calendar date",
                "Anti-passback protection preventing badge sharing during active event hours",
                "Day-by-day attendance telemetry and drop-off rate analytics"
            ]
        },
        "keyFactsTable": {
            "title": "Multi-Day Event Operations Comparison",
            "subtitle": "Handling re-entry and multi-day pass validation efficiently.",
            "headers": ["Multi-Day Capability", "UrPass Multi-Day System", "Traditional Paper Badges & Wristbands"],
            "rows": [
                {"col1": "Daily Admission Control", "col2": "Digital token automatically validates per calendar day", "col3": "Multiple wristband colors prone to fraud and tangling"},
                {"col1": "Pass-Back Fraud Prevention", "col2": "Instant atomic scan lock stops pass sharing", "col3": "Attendees pass wristbands through gates to friends"},
                {"col1": "Single-Day vs Full-Pass Sales", "col2": "Configured ticket tiers with independent pricing", "col3": "Manual checks prone to admitting Day 1 ticket on Day 2"},
                {"col1": "Daily Attendance Tracking", "col2": "Live breakdown of Day 1 vs Day 2 vs Day 3 attendance", "col3": "Zero visibility into multi-day retention or attrition"},
                {"col1": "Lost Pass Replacement", "col2": "Instant zero-cost digital pass resend on WhatsApp", "col3": "Costly replacement fees and long customer service lines"}
            ]
        },
        "features": [
            {"icon": "Calendar", "title": "Multi-Day Ticket Architecture", "desc": "Issue single QR codes that remain valid across 2, 3, or 5 consecutive event days with automated daily resets."},
            {"icon": "Lock", "title": "Anti-Passback Verification", "desc": "Prevent attendees from passing their digital ticket to an unregistered friend outside the gates."},
            {"icon": "Layers", "title": "Single-Day vs Season Passes", "desc": "Sell Day 1 Only, Day 2 Only, or All-Days Weekend Passes from a single unified ticketing portal."},
            {"icon": "QrCode", "title": "Single Persistent QR Pass", "desc": "Attendees use the same convenient digital pass throughout the entire event duration."},
            {"icon": "ScanLine", "title": "Sub-0.3s Day Verification", "desc": "Gate scanners instantly indicate whether a pass is valid for the current active event date."},
            {"icon": "BarChart3", "title": "Multi-Day Retention Telemetry", "desc": "Track attendee retention and identify drop-off rates between opening and closing event days."}
        ],
        "steps": [
            {"n": "01", "title": "Define Event Dates", "desc": "Set your multi-day event calendar range (e.g. Friday through Sunday) on your event setup screen."},
            {"n": "02", "title": "Create Daily & Full Passes", "desc": "Configure 3-Day All Access passes alongside individual Friday, Saturday, and Sunday passes."},
            {"n": "03", "title": "Publish Ticket Portal", "desc": "Attendees select their preferred days and purchase passes with 0% platform commission."},
            {"n": "04", "title": "Scan at the Entrance", "desc": "Scanners verify ticket validity for today's date in <0.3s, rejecting expired or wrong-day tickets."},
            {"n": "05", "title": "Review Day-by-Day Stats", "desc": "Analyze unique daily visitor counts and multi-day delegate engagement across your dashboard."}
        ],
        "callout": {
            "badge": "MULTI-DAY INTEGRITY",
            "title": "Stop ticket pass-backs and multi-day badge counterfeiting.",
            "description": "Multi-day events lose substantial revenue when attendees hand wristbands or screenshots to friends on subsequent days. UrPass enforces cryptographic daily verification.",
            "bullets": [
                "Single digital pass valid across multiple days with zero wristband waste",
                "Scanners automatically detect and reject tickets not valid for today's date",
                "Instant replacement on mobile if an attendee misplaces their phone",
                "Track true multi-day retention and delegate engagement metrics"
            ]
        },
        "faqs": [
            {"q": "Can one QR code be used for all 3 days of a conference?", "a": "Yes! An All-Access multi-day ticket uses a single persistent QR code that automatically permits one check-in per calendar day."},
            {"q": "Can I sell both full multi-day passes and single-day passes?", "a": "Yes. You can create different ticket tiers (e.g. '3-Day All-Access Pass', 'Friday Only', 'Saturday Only') with custom prices and limits."},
            {"q": "What happens if someone tries to use a Day 1 ticket on Day 2?", "a": "The scanner immediately flashes red with an error indicating 'Ticket Not Valid for Today's Date'."},
            {"q": "Can we track how many Day 1 attendees returned on Day 2?", "a": "Yes. The real-time analytics dashboard provides full day-by-day retention comparisons and unique daily attendance figures."}
        ],
        "relatedLinks": [
            {"title": "Conference Ticketing Software", "href": "/conference-ticketing-platform", "category": "Product"},
            {"title": "Event Ticket Types Management", "href": "/event-ticket-types-management", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"},
            {"title": "Session-Wise Attendance Tracking", "href": "/session-wise-attendance-tracking", "category": "Product"}
        ]
    },
    {
        "slug": "event-ticket-sales-reporting",
        "title": "Event Ticket Sales Reporting Software | UrPass",
        "h1": "Track Your Event Registrations and Ticket Revenue",
        "description": "Real-time sales analytics, payment reconciliation, attendee breakdowns and exportable financial reports for event organizers.",
        "badge": "FINANCIAL & REVENUE ANALYTICS",
        "ctaLabel": "View Reporting Tools",
        "directAnswer": {
            "title": "What Event Ticket Sales Reporting Capabilities Does UrPass Provide?",
            "summary": "UrPass provides real-time financial reporting and registration analytics for event organizers, agencies, and finance teams. Track Gross Merchandise Value (GMV), ticket tier sales velocity, promo code attribution, payment gateway reconciliation, and export comprehensive CSV/Excel reports for accounting.",
            "keyPoints": [
                "Real-time revenue telemetry showing live gross ticket sales and net earnings",
                "Ticket tier performance tracking (Early Bird vs VIP vs General Admission)",
                "Discount code attribution measuring marketing channel ROI",
                "One-click CSV/Excel export for financial audits and GST reconciliation"
            ]
        },
        "keyFactsTable": {
            "title": "Sales Reporting: UrPass vs Legacy Ticketing Platforms",
            "subtitle": "Financial clarity and data ownership for event directors.",
            "headers": ["Reporting Metric", "UrPass Real-Time Reporting", "Legacy Ticketing Portals"],
            "rows": [
                {"col1": "Revenue Telemetry Latency", "col2": "Instant live updates upon every transaction", "col3": "24 to 48-hour batch reporting delays"},
                {"col1": "Platform Commission Deductions", "col2": "0% platform commission — 100% revenue retention", "col3": "Hidden line-item deductions taking 5%–10%"},
                {"col1": "Tax & GST Breakdowns", "col2": "Clear itemized tax reporting with organizer GSTIN", "col3": "Opaque aggregate payouts difficult to reconcile"},
                {"col1": "Attendee Attribute Export", "col2": "Complete export of custom registration form fields", "col3": "Restricted data exports keeping attendee data locked"},
                {"col1": "AI Agent Query Support", "col2": "Natural language queries via MCP server tools", "col3": "Static PDF downloads with zero programmable access"}
            ]
        },
        "features": [
            {"icon": "BarChart3", "title": "Live Revenue Dashboard", "desc": "Watch ticket sales, gross merchandise value (GMV), and transaction counts update in real time."},
            {"icon": "Layers", "title": "Tier Velocity Analytics", "desc": "Identify which ticket categories are selling fastest to adjust inventory quotas dynamically."},
            {"icon": "Zap", "title": "Promo Code Attribution", "desc": "Measure conversion rates, discount volumes, and ROI across influencer and sponsor coupon codes."},
            {"icon": "FileSpreadsheet", "title": "One-Click Accounting Exports", "desc": "Download complete financial ledgers in CSV and Excel formatted for quick accounting import."},
            {"icon": "CreditCard", "title": "Gateway Reconciliation", "desc": "Match payment gateway transaction IDs against attendee ticket tokens for audit compliance."},
            {"icon": "Users", "title": "Attendee Demographics", "desc": "Analyze registration trends across job titles, organization types, and geographic locations."}
        ],
        "steps": [
            {"n": "01", "title": "Publish Ticket Page", "desc": "Set your ticket tiers, pricing, and optional promotional discount codes."},
            {"n": "02", "title": "Monitor Live Sales", "desc": "View instant sales updates on your dashboard as registrations occur."},
            {"n": "03", "title": "Track Marketing ROI", "desc": "Analyze promo code usage to see which marketing channels drive the highest revenue."},
            {"n": "04", "title": "Reconcile Gateways", "desc": "Verify direct bank payouts against order IDs with zero platform commission deductions."},
            {"n": "05", "title": "Export Financial Reports", "desc": "Generate complete tax and accounting reports in CSV format with a single click."}
        ],
        "callout": {
            "badge": "FINANCIAL TRANSPARENCY",
            "title": "Complete financial visibility with zero hidden platform deductions.",
            "description": "Event organizers often struggle to reconcile confusing statements from ticketing aggregators that combine processing cuts, service fees, and delayed payouts. UrPass offers 100% transparency.",
            "bullets": [
                "Zero platform cuts — keep 100% of your ticket price",
                "Reconcile orders directly against your connected payment gateway",
                "Automated GST invoice logs for seamless tax compliance",
                "Export complete attendee demographic data without platform restrictions"
            ]
        },
        "faqs": [
            {"q": "Can I see which promo code generated the most ticket sales?", "a": "Yes. UrPass tracks promo code usage with detailed breakdowns showing discount totals, redemption counts, and gross sales per code."},
            {"q": "How quickly do sales appear on the dashboard after an attendee pays?", "a": "Instantly. As soon as the payment gateway confirms the transaction, the revenue, ticket count, and attendee record update in real time."},
            {"q": "Can I export data for our company's accounting software?", "a": "Yes. You can export complete transaction ledgers in CSV or Excel containing order IDs, gateway reference codes, timestamps, and amounts."},
            {"q": "Can AI tools like Claude query my sales reports automatically?", "a": "Yes! UrPass includes native Model Context Protocol (MCP) server endpoints so AI agents can generate sales summaries via natural language."}
        ],
        "relatedLinks": [
            {"title": "Event Registration with Payment Gateway", "href": "/event-registration-with-payment-gateway", "category": "Product"},
            {"title": "Zero Commission Event Ticketing", "href": "/zero-commission-event-ticketing", "category": "Product"},
            {"title": "Event Ticket Types Management", "href": "/event-ticket-types-management", "category": "Product"},
            {"title": "Bulk Attendee CSV Import", "href": "/event-attendee-csv-import", "category": "Product"}
        ]
    },
    {
        "slug": "event-ticket-types-management",
        "title": "Multiple Event Ticket Types Software | UrPass",
        "h1": "Create General, VIP and Custom Ticket Categories",
        "description": "Configure tiered ticket types (Early Bird, VIP, Student, Group) with individual pricing, capacity limits and access permissions.",
        "badge": "TIERED ADMISSION ARCHITECTURE",
        "ctaLabel": "Create Ticket Tiers",
        "directAnswer": {
            "title": "How Does UrPass Manage Multiple Event Ticket Types?",
            "summary": "UrPass enables event directors to create unlimited ticket categories with independent pricing, capacity caps, sale schedules, and gate access permissions. Configure Early Bird discounts, VIP passes, Student tickets requiring ID verification, and Group Passes from a single unified event dashboard.",
            "keyPoints": [
                "Unlimited custom ticket categories (Early Bird, General Admission, VIP, Student, Sponsor)",
                "Independent capacity quotas preventing overselling in exclusive ticket tiers",
                "Automated scheduled sales windows with auto-opening and closing dates",
                "Tier-specific door access rules enforced instantly by gate smartphone scanners"
            ]
        },
        "keyFactsTable": {
            "title": "Ticket Tier Management Comparison",
            "subtitle": "Granular ticket control and door access enforcement.",
            "headers": ["Tier Management Capability", "UrPass Ticket Architecture", "Basic Ticketing Forms"],
            "rows": [
                {"col1": "Tier Quota Enforcement", "col2": "Strict individual capacity caps per ticket category", "col3": "Global cap only; impossible to limit VIP vs General seats"},
                {"col1": "Gate Scanner Feedback", "col2": "Clear color-coded tier badge display on scanner screen", "col3": "Generic validation; door staff cannot distinguish ticket tier"},
                {"col1": "Time-Scheduled Tiers", "col2": "Early bird tiers auto-expire; standard tiers auto-open", "col3": "Manual price changes required at midnight"},
                {"col1": "Group & Multi-Person Tiers", "col2": "Native group ticket quotas admitting 2, 5, or 10 guests", "col3": "Must purchase multiple individual tickets separately"},
                {"col1": "Platform Fees on Tiers", "col2": "0% commission across all free and paid categories", "col3": "Aggregators take higher percentage cuts on VIP tiers"}
            ]
        },
        "features": [
            {"icon": "Layers", "title": "Unlimited Ticket Tiers", "desc": "Create as many ticket categories as your event requires without arbitrary platform limitations."},
            {"icon": "Clock", "title": "Automated Early Bird Deadlines", "desc": "Schedule Early Bird tiers to close automatically at midnight on your selected date, activating standard pricing."},
            {"icon": "BadgeCheck", "title": "VIP & Backstage Permissions", "desc": "Gate scanners clearly display 'VIP', 'Speaker', or 'General' badges for instant door clearance."},
            {"icon": "Users", "title": "Student & Concession Passes", "desc": "Offer discounted student passes with mandatory college ID upload or student roll number capture."},
            {"icon": "Lock", "title": "Hidden & Private Tiers", "desc": "Create hidden sponsor or speaker tiers that only unlock with a specific private link or access code."},
            {"icon": "QrCode", "title": "Bespoke Pass Designs", "desc": "Assign custom visual pass layouts and badge colors for VIP vs General Admission attendees."}
        ],
        "steps": [
            {"n": "01", "title": "Add Ticket Categories", "desc": "Click 'Add Ticket Tier' to create General Admission, VIP Pass, Early Bird, or Student Pass."},
            {"n": "02", "title": "Set Prices & Quotas", "desc": "Assign individual prices, currency, and strict capacity caps (e.g. 50 VIP, 250 General)."},
            {"n": "03", "title": "Configure Sale Windows", "desc": "Set opening and closing dates for promotional tiers like Early Bird or Flash Sales."},
            {"n": "04", "title": "Publish Checkout Page", "desc": "Attendees view a clear comparison of tier benefits and select their desired ticket."},
            {"n": "05", "title": "Door Scanners Verify Tiers", "desc": "Gate staff see instant color-coded tier confirmation when scanning passes in <0.3s."}
        ],
        "callout": {
            "badge": "TIERED REVENUE STRATEGY",
            "title": "Maximize event profitability with structured tier pricing.",
            "description": "Conferences and festivals generate up to 40% more revenue by offering structured Early Bird, VIP, and Group ticket tiers. UrPass gives you full control over ticket rules and quotas.",
            "bullets": [
                "Drive early cash flow with urgency-driven Early Bird pricing deadlines",
                "Monetize premium experiences with high-value VIP and Backstage tiers",
                "Ensure gate marshals instantly identify VIP vs General Admission passes",
                "Keep 100% of your earnings with 0% platform commission on all tiers"
            ]
        },
        "faqs": [
            {"q": "Can I set a separate quota for VIP tickets without affecting General Admission?", "a": "Yes. Each ticket tier has its own independent capacity cap. When VIP sells out, General Admission remains available."},
            {"q": "Can Early Bird tickets automatically switch to regular pricing when a deadline passes?", "a": "Yes. You can configure automated start and end timestamps so pricing transitions automatically without manual intervention."},
            {"q": "Can I create secret or hidden ticket tiers for sponsors and speakers?", "a": "Yes. You can generate private ticket links or require specific promo codes to reveal hidden VIP or sponsor tiers."},
            {"q": "How does gate staff know which tier an attendee purchased?", "a": "The smartphone scanner screen flashes the exact ticket tier name in bold, color-coded text immediately upon scanning."}
        ],
        "relatedLinks": [
            {"title": "Bulk Event Ticket Booking", "href": "/bulk-event-ticket-booking", "category": "Product"},
            {"title": "Paid Workshop Registration Software", "href": "/paid-workshop-registration-software", "category": "Product"},
            {"title": "Conference Ticketing Software", "href": "/conference-ticketing-platform", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"}
        ]
    },
    {
        "slug": "bulk-event-ticket-booking",
        "title": "Bulk Event Ticket Booking Software | UrPass",
        "h1": "Simplify Group and Bulk Event Ticket Purchases",
        "description": "Allow corporate teams, institutions and groups to purchase multiple tickets in one order with automated individual QR pass dispatch.",
        "badge": "CORPORATE & GROUP ORDERS",
        "ctaLabel": "Enable Bulk Ticketing",
        "directAnswer": {
            "title": "How Does Bulk Event Ticket Booking Work on UrPass?",
            "summary": "UrPass simplifies bulk ticket purchasing for corporate delegations, academic groups, and community organizations. Companies can purchase 5, 10, or 50 tickets in a single transaction with consolidated GST invoicing. The corporate buyer can immediately assign individual attendee names or forward unique QR passes to colleagues.",
            "keyPoints": [
                "Single-checkout bulk purchases for corporate teams and academic groups",
                "Consolidated B2B tax invoice with company GSTIN and billing address",
                "Post-purchase team allocation portal allowing buyers to assign tickets anytime",
                "Unique cryptographically signed QR passes delivered individually to each team member"
            ]
        },
        "keyFactsTable": {
            "title": "Bulk Ticketing: UrPass vs Consumer Ticketing Portals",
            "subtitle": "Streamlining group bookings for corporate delegations.",
            "headers": ["Group Booking Feature", "UrPass Bulk Booking System", "Consumer Ticketing Apps"],
            "rows": [
                {"col1": "Team Checkout Experience", "col2": "1-click order of 10+ tickets on single invoice", "col3": "Must repeat purchase process multiple times"},
                {"col1": "Corporate Invoicing (GST/VAT)", "col2": "Automated single consolidated tax invoice", "col3": "Multiple fragmented receipts without corporate GSTIN"},
                {"col1": "Team Member Name Assignment", "col2": "Buyer can assign colleague details post-purchase", "col3": "Must know all names and details at checkout checkout"},
                {"col1": "Individual Pass Distribution", "col2": "Unique QR passes emailed/WhatsApped to each guest", "col3": "Single buyer receives a batch PDF requiring printing"},
                {"col1": "Platform Surcharges", "col2": "0% platform commission on group bookings", "col3": "Hefty per-ticket booking fees multiplied across all seats"}
            ]
        },
        "features": [
            {"icon": "Users", "title": "Single Order Group Checkout", "desc": "Corporate managers buy 5 to 100 tickets in one transaction with a corporate card or bank transfer."},
            {"icon": "FileText", "title": "Consolidated B2B Tax Invoice", "desc": "Generate a unified GST/VAT invoice containing corporate entity details, GSTIN, and tax breakdown."},
            {"icon": "Send", "title": "Post-Purchase Delegate Roster", "desc": "Allow the company coordinator to input colleague names and email addresses whenever their team is finalized."},
            {"icon": "QrCode", "title": "Unique Passes per Delegate", "desc": "Each team member receives their own unique digital QR code preventing entry confusion at the gates."},
            {"icon": "Zap", "title": "Volume Discount Pricing", "desc": "Configure automatic bulk discounts (e.g., 15% off when purchasing 5 or more tickets)."},
            {"icon": "ScanLine", "title": "Independent Gate Arrival", "desc": "Team members can arrive separately at different gates or times with their individual digital passes."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Bulk Tiers", "desc": "Set ticket pricing and configure optional group quantity discounts (e.g. 5+ tickets)."},
            {"n": "02", "title": "Buyer Purchases in Bulk", "desc": "Corporate coordinator selects ticket count and completes single checkout with company GSTIN."},
            {"n": "03", "title": "Instant Tax Invoice", "desc": "UrPass issues a consolidated B2B tax invoice directly to the company accounts department."},
            {"n": "04", "title": "Assign Colleague Details", "desc": "Buyer enters attendee names and emails into their self-service team management link."},
            {"n": "05", "title": "Individual Passes Dispatched", "desc": "Every employee receives their personal digital QR pass ready for sub-0.3s gate check-in."}
        ],
        "callout": {
            "badge": "ENTERPRISE GROUP BOOKING",
            "title": "Make it effortless for companies to send delegations to your event.",
            "description": "Corporate group bookings represent high-margin ticket revenue. When a booking system forces coordinators to buy tickets one-by-one or withholds proper GST invoices, companies abandon the purchase.",
            "bullets": [
                "Frictionless single checkout for corporate teams and university delegations",
                "Automated GST-compliant invoices ready for corporate expense approval",
                "Delegates arrive independently without having to queue together at the gate",
                "Zero percentage platform fees on your high-value group ticket orders"
            ]
        },
        "faqs": [
            {"q": "Does the corporate buyer need to enter all attendee names during checkout?", "a": "No. The buyer can complete payment first to secure seats, and then assign individual team member names and emails later through a self-serve portal."},
            {"q": "Can colleagues arrive at different times and gates?", "a": "Yes! Each attendee receives their own unique digital QR pass, allowing them to arrive separately at any gate."},
            {"q": "Can we configure automatic discounts for group bookings (e.g. 10% off for 5+ seats)?", "a": "Yes. UrPass supports volume-based discount rules that automatically apply when the cart meets specified ticket thresholds."},
            {"q": "Is a single consolidated GST tax invoice provided?", "a": "Yes. A complete corporate tax invoice with organizer and buyer GSTIN details is automatically emailed upon payment."}
        ],
        "relatedLinks": [
            {"title": "Event Ticket Types Management", "href": "/event-ticket-types-management", "category": "Product"},
            {"title": "Zero Commission Event Ticketing", "href": "/zero-commission-event-ticketing", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"},
            {"title": "Conference Ticketing Software", "href": "/conference-ticketing-platform", "category": "Product"}
        ]
    },

    # Batch C
    {
        "slug": "conference-badge-scanning-software",
        "title": "Conference QR Badge Scanning Software | UrPass",
        "h1": "Scan Conference QR Passes and Track Live Attendance",
        "description": "Transform any smartphone into a fast conference badge scanner with real-time attendee verification and session access validation.",
        "badge": "LANYARD & BADGE SCANNING",
        "ctaLabel": "Start Scanning Badges",
        "directAnswer": {
            "title": "How Does Conference QR Badge Scanning Work on UrPass?",
            "summary": "UrPass transforms standard smartphones into professional conference badge scanners. Gate marshals and session room door hosts scan printed lanyard badges or mobile QR passes using their phone camera in <0.3s. Scanners verify delegate credentials, validate track access, prevent duplicate entry, and sync attendance live to the cloud.",
            "keyPoints": [
                "Sub-300ms camera scanning for printed lanyard badges and mobile smartphone passes",
                "Zero hardware rental costs — operates directly on volunteer iOS and Android phones",
                "Color-coded tier indicators (VIP, Delegate, Speaker, Sponsor, Press)",
                "Session-level badge validation tracking attendance at keynotes and breakout workshops"
            ]
        },
        "keyFactsTable": {
            "title": "Conference Badge Scanning Comparison",
            "subtitle": "Smartphone scanning vs traditional laser hardware rentals.",
            "headers": ["Badge Scanning Factor", "UrPass Mobile Camera Scanner", "Hardware Laser Scanners & Handhelds"],
            "rows": [
                {"col1": "Hardware Rental Cost", "col2": "$0 / £0 — volunteers use their own smartphones", "col3": "$150 to $300 rental fee per handheld terminal"},
                {"col1": "Scan Speed", "col2": "<0.3s sub-second instant camera recognition", "col3": "1 to 2 seconds aiming optical laser beam"},
                {"col1": "App Installation", "col2": "0 downloads — runs directly in standard mobile browser", "col3": "Complex proprietary APK setup and configuration"},
                {"col1": "Screen Verification Feedback", "col2": "Large green/red screen with attendee name & tier", "col3": "Tiny monochrome text display on bulky scanner"},
                {"col1": "Real-Time Cloud Sync", "col2": "Sub-150ms instant sync across all venue doors", "col3": "Batch dock syncing with delayed attendance records"}
            ]
        },
        "features": [
            {"icon": "ScanLine", "title": "Sub-0.3s Badge Recognition", "desc": "Hardware-accelerated camera engine scans printed lanyard badges and smartphone screens instantly."},
            {"icon": "Smartphone", "title": "Zero App Downloads", "desc": "Volunteers open a secure web scanner URL on Safari or Chrome with zero app store installations."},
            {"icon": "BadgeCheck", "title": "Color-Coded Tier Displays", "desc": "Screen flashes emerald green for valid delegates, gold for VIPs, and bright red for duplicate attempts."},
            {"icon": "ShieldCheck", "title": "Duplicate Badge Rejection", "desc": "Instantly flags duplicated or re-scanned badges showing the exact timestamp and gate of first use."},
            {"icon": "Layers", "title": "Breakout Session Mode", "desc": "Switch scanner modes to track attendance at specific keynote halls, masterclasses, or sponsor lunches."},
            {"icon": "Radio", "title": "Offline Scanning Resilience", "desc": "Client-side cryptographic validation allows scanning to continue if convention center WiFi drops."}
        ],
        "steps": [
            {"n": "01", "title": "Generate Delegate Badges", "desc": "Design digital or printable conference badges featuring high-contrast scannable QR tokens."},
            {"n": "02", "title": "Share Scanner Link", "desc": "Send secure scanner URLs to door volunteers and ushers via WhatsApp or QR code."},
            {"n": "03", "title": "Scan at Venue Doors", "desc": "Volunteers point their smartphone cameras at delegate lanyards as they enter."},
            {"n": "04", "title": "Instant Audio & Visual Feedback", "desc": "Haptic vibration and visual green confirmation verify delegate credentials in <0.3s."},
            {"n": "05", "title": "Monitor Live Flow", "desc": "Watch conference arrival curves, session popularity, and total checked-in counts in real time."}
        ],
        "callout": {
            "badge": "ZERO HARDWARE OVERHEAD",
            "title": "Save thousands in handheld scanner rentals at your next conference.",
            "description": "Traditional badge scanner rental companies charge hundreds of dollars per terminal plus expensive shipping and setup fees. UrPass delivers faster, superior scanning on standard mobile phones.",
            "bullets": [
                "Deploy 20+ scanning lanes across all conference doors at zero hardware cost",
                "Volunteers are trained and scanning in under 60 seconds with zero learning curve",
                "Prevents badge sharing with atomic cloud duplicate detection",
                "Full session-level attendance telemetry for CME/CEU certified conferences"
            ]
        },
        "faqs": [
            {"q": "Can the scanner read printed lanyard badges or only phone screens?", "a": "Both! The scanner reads both printed paper/plastic lanyard badges and digital phone screens with equal sub-second speed."},
            {"q": "Do volunteers need to install an app from the App Store or Google Play?", "a": "No. The scanner runs directly inside modern mobile browsers (Safari, Chrome) via secure WebRTC camera technology."},
            {"q": "What happens if someone shares their badge with a colleague?", "a": "The moment a badge is scanned, its token is recorded in the database. Any subsequent scan triggers an immediate red warning with the initial scan time."},
            {"q": "Can we track which breakout sessions an attendee visited?", "a": "Yes. Door staff can select the specific track or room name in the scanner interface to record session-level attendance."}
        ],
        "relatedLinks": [
            {"title": "Session-Wise Attendance Tracking", "href": "/session-wise-attendance-tracking", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"}
        ]
    },
    {
        "slug": "event-capacity-management-software",
        "title": "Event Capacity Management Software | UrPass",
        "h1": "Control Event Capacity and Prevent Overbooking",
        "description": "Enforce strict venue capacity limits with real-time ticket counters, automated waitlists, and instant scan-in gate controls.",
        "badge": "CAPACITY & OCCUPANCY ENFORCEMENT",
        "ctaLabel": "Control Event Capacity",
        "directAnswer": {
            "title": "How Does UrPass Enforce Event Capacity Management?",
            "summary": "UrPass guarantees strict event capacity limits across web registration, CSV imports, and gate entry operations. For events with strict capacity caps (such as a 300-guest maximum limit), the platform automatically shuts down registration the moment the limit is reached and alerts gate staff to prevent unauthorized overbooking.",
            "keyPoints": [
                "Strict global capacity limits (e.g. hard 300-guest cap) locking registration automatically",
                "Real-time atomic inventory counters preventing race conditions and duplicate allocations",
                "Live gate admission telemetry tracking checked-in guests against statutory venue limits",
                "Automated waitlist management to capture excess demand without exceeding capacity"
            ]
        },
        "keyFactsTable": {
            "title": "Capacity Enforcement: UrPass vs Generic Registration Tools",
            "subtitle": "Statutory fire safety and venue occupancy guarantees.",
            "headers": ["Capacity Control Feature", "UrPass Capacity Engine", "Generic Forms (Google Forms / Typeform)"],
            "rows": [
                {"col1": "Atomic Concurrency Protection", "col2": "Zero overbooking; atomic row locks prevent exceeding limits", "col3": "Simultaneous submissions breach limits causing overbooking"},
                {"col1": "Automatic Sold-Out Locking", "col2": "Instantaneous form shutdown the exact millisecond cap is met", "col3": "Requires manual monitoring to close forms after the fact"},
                {"col1": "Gate Check-In Limit Enforcement", "col2": "Scanners display live total checked-in vs venue capacity", "col3": "Gate staff unaware of current in-venue headcount"},
                {"col1": "Group Ticket Quota Deduction", "col2": "Group tickets decrement exact quota from global capacity", "col3": "Counts group as 1 submission, causing massive crowd overflow"},
                {"col1": "Automated Waitlist Activation", "col2": "Seamless waitlist opens automatically when tickets sell out", "col3": "Users simply see an error with lost lead contact data"}
            ]
        },
        "features": [
            {"icon": "Maximize2", "title": "Strict Global Capacity Caps", "desc": "Set your venue maximum (e.g. exactly 300 attendees); registrations close automatically when reached."},
            {"icon": "Lock", "title": "Atomic Race-Condition Protection", "desc": "Database transactions prevent multiple simultaneous shoppers from oversubscribing final tickets."},
            {"icon": "BarChart3", "title": "Live Occupancy Telemetry", "desc": "Observe live check-in counts against total capacity on organizer screens and gate scanner devices."},
            {"icon": "Users", "title": "Smart Group Quota Accounting", "desc": "When issuing group passes (e.g., 5 entries), the system decrements 5 spots from total capacity."},
            {"icon": "ShieldCheck", "title": "Statutory Fire Safety Compliance", "desc": "Generate verified proof of occupancy for venue managers, local fire marshals, and municipal licensing."},
            {"icon": "DoorOpen", "title": "Gate Overcrowding Alerts", "desc": "Receive real-time alerts when check-ins reach 90%, 95%, and 100% of permitted room capacity."}
        ],
        "steps": [
            {"n": "01", "title": "Set Venue Capacity Cap", "desc": "Input your maximum allowable attendee count (e.g., 300 guests) in event settings."},
            {"n": "02", "title": "Atomic Seat Booking", "desc": "Attendees register or buy tickets; atomic counters decrement capacity in real time."},
            {"n": "03", "title": "Instant Sold-Out Lock", "desc": "The moment the 300th ticket is claimed, registration locks and waitlist opens."},
            {"n": "04", "title": "Gate Check-In Tracking", "desc": "Door staff scan passes; dashboard displays live checked-in percentage."},
            {"n": "05", "title": "Venue Compliance Report", "desc": "Download certified timestamped attendance logs demonstrating compliance with venue safety limits."}
        ],
        "callout": {
            "badge": "STRICT OCCUPANCY CONTROL",
            "title": "Never risk venue shut-downs or fire code violations due to overbooking.",
            "description": "Venue managers and municipal fire marshals will shut down an event immediately if physical capacity is breached. UrPass guarantees your registration and gate counts never exceed statutory limits.",
            "bullets": [
                "Guaranteed protection against overbooking with atomic database counters",
                "Ideal for private corporate celebrations, NGO galas, and licensed venues",
                "Real-time occupancy tracking visible to security and venue management",
                "Automated waitlist captures interested guests for subsequent sessions"
            ]
        },
        "faqs": [
            {"q": "Can I enforce a strict limit of exactly 300 guests for our event?", "a": "Yes. UrPass enforces strict global capacity limits. The moment 300 successful passes are issued, the system locks further registrations automatically."},
            {"q": "How does the system account for group passes?", "a": "If you issue a group pass for 5 guests, UrPass decrements 5 from your remaining global capacity, ensuring total admissions never exceed the limit."},
            {"q": "What happens if two people register for the final ticket at the exact same millisecond?", "a": "UrPass uses atomic database transactions with row-level locks. The first transaction succeeds and the second is safely informed that the event is sold out."},
            {"q": "Can gate staff see how many total guests have entered so far?", "a": "Yes! The mobile scanner interface and live organizer dashboard display the real-time checked-in count alongside the maximum venue capacity."}
        ],
        "relatedLinks": [
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"},
            {"title": "Event Entry and Exit Tracking", "href": "/event-entry-exit-tracking", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"}
        ]
    },
    {
        "slug": "session-wise-attendance-tracking",
        "title": "Session-Wise Attendance Tracking | UrPass",
        "h1": "Track Every Conference Session with a Single QR Pass",
        "description": "Scan attendee QR passes at breakout rooms, keynote stages and workshops to record precise session attendance and track engagement.",
        "badge": "MULTI-TRACK CONFERENCE OPERATIONS",
        "ctaLabel": "Track Sessions Free",
        "directAnswer": {
            "title": "How Does Session-Wise Attendance Tracking Work on UrPass?",
            "summary": "UrPass enables conference organizers to track attendance across multiple breakout rooms, keynote stages, and workshop tracks using a single persistent QR pass per attendee. Door marshals select the active session in their mobile browser scanner, recording timestamped attendance per track for CEU/CME credits, room popularity, and sponsor reporting.",
            "keyPoints": [
                "Single QR pass valid across all conference tracks and breakout sessions",
                "Door hosts switch session scanner modes with 1 click on standard mobile phones",
                "Timestamped session entry logs for professional accreditation and CEU/CME certificates",
                "Real-time breakout room capacity monitoring preventing overcrowded workshop rooms"
            ]
        },
        "keyFactsTable": {
            "title": "Session Tracking Comparison",
            "subtitle": "Single-pass multi-track scanning vs separate session tickets.",
            "headers": ["Session Tracking Capability", "UrPass Unified Session System", "Manual Paper Rosters / Separate Tickets"],
            "rows": [
                {"col1": "Attendee Convenience", "col2": "1 single QR pass scanned across all breakout rooms", "col3": "Multiple printed tickets or wristbands per session"},
                {"col1": "Accreditation & CEU Audit", "col2": "Exact digital entry timestamp for every session attended", "col3": "Illegible paper signature sheets prone to audit rejection"},
                {"col1": "Room Capacity Control", "col2": "Scanners warn door hosts when workshop room reaches capacity", "col3": "Overcrowded rooms with attendees sitting on floors"},
                {"col1": "Door Scanner Setup", "col2": "Volunteer selects room from dropdown in mobile browser", "col3": "Expensive fixed barcode scanners bolted to doorframes"},
                {"col1": "Session Popularity Analytics", "col2": "Live chart comparing attendance across all parallel tracks", "col3": "Days spent manually tabulating paper sheets post-event"}
            ]
        },
        "features": [
            {"icon": "Layers", "title": "Single Pass Multi-Track", "desc": "Attendees use their main conference QR badge across unlimited parallel breakout sessions."},
            {"icon": "DoorOpen", "title": "Room Capacity Monitoring", "desc": "Enforce maximum seating limits per breakout room to prevent dangerous fire code overcrowding."},
            {"icon": "BadgeCheck", "title": "Continuing Education (CEU/CME)", "desc": "Generate verifiable attendance records for accredited medical, legal, and engineering certifications."},
            {"icon": "Smartphone", "title": "1-Click Scanner Room Switching", "desc": "Door volunteers switch between 'Keynote A', 'Track 2', and 'Workshop B' in seconds."},
            {"icon": "BarChart3", "title": "Popularity & Drop-Off Analytics", "desc": "Compare attendance counts across all tracks to see which speakers and topics resonated most."},
            {"icon": "FileSpreadsheet", "title": "Session Export for Sponsors", "desc": "Export verified session attendee lists to demonstrate value to workshop room sponsors."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Conference Tracks", "desc": "Add your agenda tracks, room names, and seating capacities in the event schedule builder."},
            {"n": "02", "title": "Issue Unified Passes", "desc": "Attendees receive a single digital QR badge valid for the entire conference."},
            {"n": "03", "title": "Assign Room Door Marshals", "desc": "Volunteers open the scanner URL and select their designated room from the dropdown."},
            {"n": "04", "title": "Scan at Breakout Doors", "desc": "Marshals scan badges as attendees enter each session in under 300ms."},
            {"n": "05", "title": "Certify Attendance", "desc": "Export timestamped session attendance logs for continuing education credits and sponsors."}
        ],
        "callout": {
            "badge": "ACCREDITATION READY",
            "title": "Deliver verifiable, audit-proof attendance for accredited educational conferences.",
            "description": "Medical congresses, legal symposiums, and engineering conventions require precise proof of session attendance for professional credits. UrPass delivers tamper-proof digital tracking.",
            "bullets": [
                "Legally defensible digital timestamps proving attendance at specific tracks",
                "Eliminate paper signature clipboards that circulate clumsily during lectures",
                "Prevent attendees from crowding into rooms exceeding safety capacities",
                "Provide workshop sponsors with precise data on who attended their sponsored session"
            ]
        },
        "faqs": [
            {"q": "Does an attendee need a different QR code for each session?", "a": "No! Attendees use their single primary conference pass. When scanned at a session door, UrPass automatically logs attendance for that specific room."},
            {"q": "Can we prevent attendees from entering a session if the room is full?", "a": "Yes. You can assign room capacity limits. The scanner alerts door marshals when the room's maximum seating capacity has been reached."},
            {"q": "Can we export which delegates attended a specific sponsor's workshop?", "a": "Yes. You can export verified attendance rosters for each individual session with attendee names, job titles, and companies."},
            {"q": "Can volunteers switch rooms on their scanner easily?", "a": "Yes. A simple dropdown at the top of the scanner screen lets volunteers switch between rooms or sessions in one tap."}
        ],
        "relatedLinks": [
            {"title": "Conference Badge Scanning Software", "href": "/conference-badge-scanning-software", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Event Entry and Exit Tracking", "href": "/event-entry-exit-tracking", "category": "Product"}
        ]
    },
    {
        "slug": "group-qr-ticket-check-in",
        "title": "Group QR Ticket Check-In Software | UrPass",
        "h1": "Admit Group Ticket Holders with One QR Code",
        "description": "Support group passes where multiple guests arrive together or separately using a single shared QR code with remaining scan tracking.",
        "badge": "GROUP ENTITLEMENTS & SHARED PASSES",
        "ctaLabel": "Create Group Passes",
        "directAnswer": {
            "title": "How Does Group QR Ticket Check-In Work on UrPass?",
            "summary": "UrPass supports flexible group tickets where multiple guests are admitted using a single shared QR code. Organizers assign custom scan quotas (e.g. 2, 5, or 10 entries per code). Group members can arrive together or at different times; each scan consumes one entry, displays the remaining quota to gate staff, and denies further entry once the limit is reached.",
            "keyPoints": [
                "Single shared QR pass supporting custom scan quotas (e.g. 2, 5, 10 entries)",
                "Support for split arrivals: group members can scan in together or at different times",
                "Clear on-screen remaining scan countdown displayed to gate staff upon each scan",
                "Automatic admission denial and 'Maximum Limit Reached' alert once the quota is exhausted"
            ]
        },
        "keyFactsTable": {
            "title": "Group Ticketing Comparison",
            "subtitle": "How UrPass manages shared group passes and partial arrivals.",
            "headers": ["Group Check-In Capability", "UrPass Group Entitlement Engine", "Traditional Single-Scan Tickets"],
            "rows": [
                {"col1": "Split Arrival Support", "col2": "Guests can arrive separately with the same shared QR", "col3": "Entire group must wait outside and arrive together"},
                {"col1": "Remaining Quota Feedback", "col2": "Displays 'Entry 1 of 5 (4 Remaining)' on scanner screen", "col3": "No remaining counter; binary valid or invalid only"},
                {"col1": "Max Limit Enforcement", "col2": "Blocks entry immediately once scan limit is reached", "col3": "Prone to admitting excess guests or locking out valid ones"},
                {"col1": "Pass Forwarding", "col2": "Original recipient can forward WhatsApp pass to family", "col3": "Requires re-issuing new individual tickets with customer service"},
                {"col1": "Total Capacity Accounting", "col2": "Each group scan decrements global venue capacity", "col3": "Group counted as 1 entry, breaking statutory venue limits"}
            ]
        },
        "features": [
            {"icon": "Users", "title": "Custom Group Scan Limits", "desc": "Assign individual entry quotas (e.g. 2 entries for couples, 5 for families, 10 for corporate teams)."},
            {"icon": "Clock", "title": "Flexible Staggered Arrivals", "desc": "Group members can arrive at different times and entrance gates without having to coordinate arrival."},
            {"icon": "BadgeCheck", "title": "Remaining Quota Counter", "desc": "Scanner display clearly shows used entries, remaining admissions, and original recipient name."},
            {"icon": "ShieldCheck", "title": "Strict Quota Cutoff", "desc": "When the final entry is used, subsequent scan attempts trigger a bold 'Maximum Limit Reached' warning."},
            {"icon": "Send", "title": "WhatsApp Pass Forwarding", "desc": "The primary recipient can forward their WhatsApp pass to family members with zero technical friction."},
            {"icon": "BarChart3", "title": "Live Group Telemetry", "desc": "Track how many groups have checked in partially versus those who have exhausted their full entitlement."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Group Quotas", "desc": "Set maximum scan allowances (e.g., 2, 5, or 10 entries) when creating tickets or importing guests."},
            {"n": "02", "title": "Dispatch Group Pass", "desc": "The primary guest receives a single high-contrast QR pass on WhatsApp or email."},
            {"n": "03", "title": "First Guest Arrives", "desc": "First group member scans the pass; scanner admits them and shows remaining guest spots."},
            {"n": "04", "title": "Later Guests Scan", "desc": "Remaining friends or family arrive later and scan the same pass; counter decrements."},
            {"n": "05", "title": "Quota Exhaustion", "desc": "Once the configured quota is reached, any further scan attempt is denied with clear audio feedback."}
        ],
        "callout": {
            "badge": "FRICTIONLESS FAMILIES",
            "title": "Never force families or corporate colleagues to wait outside in the rain.",
            "description": "Traditional ticketing systems force groups to stand outside until every member arrives so they can enter together. UrPass allows guests to arrive at their own pace using a single shared pass.",
            "bullets": [
                "Family members and colleagues can enter independently without waiting outside",
                "Gate marshals see exact remaining spots on their smartphone screen",
                "Prevents gatecrashers by strictly blocking entry once the quota is exhausted",
                "Integrates seamlessly with total venue capacity tracking"
            ]
        },
        "faqs": [
            {"q": "Can people in the same group arrive at different times?", "a": "Yes! Group members can arrive hours apart. Each scan admits one person, decrements the remaining count, and admits subsequent members until the quota is exhausted."},
            {"q": "What does the scanner show when the maximum limit is reached?", "a": "The scanner flashes a bright red screen with an error tone stating 'Maximum Limit Reached — 0 Entries Remaining'."},
            {"q": "Can the original recipient forward the pass to their friends via WhatsApp?", "a": "Yes. The recipient can easily forward the WhatsApp message or pass link to their group members."},
            {"q": "Does a group pass of 5 count as 5 people against our 300 capacity limit?", "a": "Yes. UrPass decrements 5 admissions from your global event capacity, ensuring the venue never exceeds statutory limits."}
        ],
        "relatedLinks": [
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "WhatsApp Event Tickets", "href": "/whatsapp-event-tickets", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"},
            {"title": "Bulk Attendee CSV Import", "href": "/event-attendee-csv-import", "category": "Product"}
        ]
    },
    {
        "slug": "event-entry-exit-tracking",
        "title": "Event Entry and Exit Tracking Software | UrPass",
        "h1": "Monitor Event Entry, Exit and Live Headcount",
        "description": "Track both check-ins and check-outs at gates to maintain accurate live occupancy counts and adhere to venue safety regulations.",
        "badge": "BI-DIRECTIONAL OCCUPANCY MONITORING",
        "ctaLabel": "Track Entry & Exit",
        "directAnswer": {
            "title": "How Does Event Entry and Exit Tracking Work on UrPass?",
            "summary": "UrPass provides bi-directional entry and exit tracking for festivals, exhibition centers, and secure facilities. Gate marshals can toggle mobile scanners between 'Entry Mode' and 'Exit Mode'. Scanning attendees exiting the venue decrements live occupancy, enabling accurate real-time headcount telemetry for fire safety compliance and managed re-entry.",
            "keyPoints": [
                "Bi-directional scanning: 1-click toggle between Entry and Exit modes on mobile scanners",
                "Accurate net in-venue headcount telemetry updating in sub-150ms",
                "Managed re-entry support preventing pass pass-back fraud",
                "Compliance with statutory venue fire safety licenses and emergency crowd limits"
            ]
        },
        "keyFactsTable": {
            "title": "Entry/Exit Tracking Comparison",
            "subtitle": "Live net occupancy vs one-way gross check-in tracking.",
            "headers": ["Occupancy Factor", "UrPass Bi-Directional Tracking", "Traditional One-Way Check-In"],
            "rows": [
                {"col1": "Real-Time Net Occupancy", "col2": "Calculates exact currently present headcounts (Ins minus Outs)", "col3": "Cumulative check-in total only; zero knowledge of exits"},
                {"col1": "Fire Code Compliance", "col2": "Certifiable live proof that venue remains under statutory cap", "col3": "Unable to prove current occupancy during safety audits"},
                {"col1": "Re-Entry Verification", "col2": "Pass only re-admits if previously scanned out", "col3": "Requires messy ink hand-stamps easily washed off"},
                {"col1": "Peak Crowd Telemetry", "col2": "Accurate graph of peak concurrent crowd density", "col3": "Distorted charts counting departed guests as present"},
                {"col1": "Turnstile & Gate Hardware", "col2": "Runs on standard volunteer smartphones or tablets", "col3": "Expensive fixed optical turnstile equipment"}
            ]
        },
        "features": [
            {"icon": "LogIn", "title": "1-Tap Mode Switching", "desc": "Door staff tap a button on their scanner screen to toggle instantly between Check-In and Check-Out modes."},
            {"icon": "LogOut", "title": "Net Occupancy Telemetry", "desc": "Dashboard calculates exact live in-venue headcounts (Total Checked-In minus Total Checked-Out)."},
            {"icon": "ShieldCheck", "title": "Managed Re-Entry Control", "desc": "Allow attendees to leave for lunch or fresh air and scan back in without opening pass-sharing vulnerabilities."},
            {"icon": "Maximize2", "title": "Peak Density Monitoring", "desc": "Identify true peak concurrent attendance hours to optimize security staffing and bar service."},
            {"icon": "DoorOpen", "title": "Multi-Gate Net Sync", "desc": "Attendees can enter through Gate A and exit through Gate D with sub-150ms cloud synchronization."},
            {"icon": "BarChart3", "title": "Emergency Evacuation Tally", "desc": "Provides safety personnel with an instant count of exactly how many guests remain on-site."}
        ],
        "steps": [
            {"n": "01", "title": "Configure Entry/Exit", "desc": "Enable bi-directional tracking in event settings and set maximum statutory venue capacity."},
            {"n": "02", "title": "Assign Gate Roles", "desc": "Designate entrance lanes as 'Check-In' and exit doors as 'Check-Out' on volunteer phones."},
            {"n": "03", "title": "Scan Guests In", "desc": "Guests scan in at the main doors; the live on-site occupancy counter increments."},
            {"n": "04", "title": "Scan Guests Out", "desc": "Guests scan their pass at exit turnstiles; the live occupancy counter decrements."},
            {"n": "05", "title": "Monitor True Headcount", "desc": "Review live concurrency graphs ensuring the venue remains safe and compliant at all times."}
        ],
        "callout": {
            "badge": "STATUTORY SAFETY ASSURANCE",
            "title": "Prove true crowd compliance to local authorities and venue owners.",
            "description": "Licensed venues cannot afford to guess how many people are inside during a multi-stage festival or evening event. UrPass delivers exact, verifiable net occupancy data.",
            "bullets": [
                "Real-time net occupancy counts visible to security and fire marshals",
                "Allow seamless pass re-entry without messy wristbands or hand stamps",
                "Synchronized across multiple entry gates and exit turnstiles",
                "Detailed historical crowd flow curves for future event planning"
            ]
        },
        "faqs": [
            {"q": "Can attendees exit through a different gate than the one they entered?", "a": "Yes! All gates synchronize through the UrPass cloud in under 150ms. An attendee can enter at Gate 1 and exit at Gate 4 seamlessly."},
            {"q": "How does re-entry work with this system?", "a": "When an attendee is scanned at the exit, their pass status updates to 'Offsite'. When they return, the entry scanner admits them without error."},
            {"q": "Does the system work without internet access?", "a": "The scanner includes offline caching to process entries and exits locally, synchronizing data when connectivity is restored."},
            {"q": "Can venue security see the net headcount on their own phones?", "a": "Yes. Organizers can provide security leads with a secure real-time dashboard link displaying live occupancy figures."}
        ],
        "relatedLinks": [
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"}
        ]
    },
    {
        "slug": "smartphone-qr-ticket-scanner",
        "title": "Smartphone QR Ticket Scanner | UrPass",
        "h1": "Scan Event Tickets with Any Compatible Smartphone",
        "description": "No expensive handheld scanners required. Use any iPhone or Android camera to scan and validate attendee QR passes in under 0.3s.",
        "badge": "BROWSER-BASED SCANNING ENGINE",
        "ctaLabel": "Test Smartphone Scanner",
        "directAnswer": {
            "title": "How Does the UrPass Smartphone QR Ticket Scanner Work?",
            "summary": "UrPass operates entirely inside standard mobile web browsers (Safari, Chrome) using hardware-accelerated WebRTC camera feeds. Event volunteers and gate staff simply tap a secure scanner link, grant camera permission, and scan digital or printed QR passes in under 0.3 seconds with zero App Store or Play Store downloads.",
            "keyPoints": [
                "Sub-300ms verification speed rivaling dedicated industrial laser hardware",
                "Zero app installation required — runs in any modern iOS or Android web browser",
                "Large color-coded validation screens with haptic vibration and audio feedback",
                "Offline scanning fallback validating passes even when venue cell reception fails"
            ]
        },
        "keyFactsTable": {
            "title": "Smartphone Scanner vs Dedicated Hardware Rentals",
            "subtitle": "Operational speed and cost efficiency comparison.",
            "headers": ["Scanner Capability", "UrPass Mobile Browser Scanner", "Industrial Laser Handheld Rentals"],
            "rows": [
                {"col1": "Equipment Rental Cost", "col2": "$0 / ₹0 — staff use their existing smartphones", "col3": "$150 to $250 rental fee per unit plus shipping"},
                {"col1": "Setup & Training Time", "col2": "Under 60 seconds (open URL and point camera)", "col3": "Complex 30-minute training and software pairing"},
                {"col1": "Hardware Failure Risk", "col2": "If a phone battery dies, switch to another phone in 10s", "col3": "Dead terminal shuts down entry lane completely"},
                {"col1": "Scan Verification Speed", "col2": "<0.3s instant camera detection", "col3": "1 to 2 seconds aiming laser reticle"},
                {"col1": "Screen Feedback Clarity", "col2": "High-contrast full-screen emerald/crimson flash", "col3": "Small monochromatic display on bulky plastic brick"}
            ]
        },
        "features": [
            {"icon": "Smartphone", "title": "Zero App Downloads", "desc": "Volunteers open a simple link in Chrome or Safari; no account creation or app store downloads required."},
            {"icon": "ScanLine", "title": "Sub-0.3s Instant Camera Engine", "desc": "Optimized WebRTC and WebAssembly barcode processing reads passes from distances up to 1 meter."},
            {"icon": "BadgeCheck", "title": "Full-Screen Visual Feedback", "desc": "Screen flashes bright green for valid entries and deep crimson for duplicate or invalid passes."},
            {"icon": "Radio", "title": "Offline Scanning Resilience", "desc": "Client-side cryptographic validation allows scanning to continue when venue WiFi drops."},
            {"icon": "ShieldCheck", "title": "Atomic Duplicate Protection", "desc": "Sub-150ms cloud sync prevents the same QR code from being scanned twice across different gates."},
            {"icon": "Zap", "title": "Flashlight / Torch Toggle", "desc": "Built-in torch button illuminates passes in dimly lit auditoriums, concert halls, or night festivals."}
        ],
        "steps": [
            {"n": "01", "title": "Generate Scanner Link", "desc": "Click 'Launch Scanner' on your event dashboard to generate a secure scanning URL."},
            {"n": "02", "title": "Share with Staff", "desc": "Send the link to volunteer WhatsApp groups or display a coordinator QR code to open it."},
            {"n": "03", "title": "Grant Camera Access", "desc": "Staff tap 'Allow Camera' on their phone browser (Safari or Chrome)."},
            {"n": "04", "title": "Point and Scan", "desc": "Point the camera at attendee phones or printed passes; verification happens in <0.3s."},
            {"n": "05", "title": "Watch Queues Disappear", "desc": "Clear lines at a rate of 1,200+ attendees per hour per smartphone scanning lane."}
        ],
        "callout": {
            "badge": "ZERO RENTAL HEADACHES",
            "title": "Never spend event budget renting obsolete laser hardware again.",
            "description": "Event organizers waste thousands of dollars renting bulky laser scanners that are prone to battery failures, complex pairing steps, and slow aiming. Modern smartphone cameras are significantly faster.",
            "bullets": [
                "Zero equipment rental, shipping, insurance, or damage deposit fees",
                "Deploy as many scanning lanes as needed by inviting additional volunteers",
                "Works seamlessly on both Apple iPhones and Android devices",
                "Instant audio beep and haptic buzz confirms valid passes without looking"
            ]
        },
        "faqs": [
            {"q": "Do volunteers need to install an app from the App Store or Google Play?", "a": "No! UrPass operates directly in standard mobile web browsers (Safari, Chrome). Volunteers simply open a link and start scanning."},
            {"q": "Does the scanner work in low-light environments?", "a": "Yes. The scanner includes an on-screen flashlight toggle that activates the smartphone torch for night events or dark club venues."},
            {"q": "Can the scanner read passes displayed on dim phone screens?", "a": "Yes. The advanced computer vision engine automatically adjusts exposure to read QR codes from dim screens, cracked glass, or printed paper."},
            {"q": "What happens if a volunteer's phone loses internet access?", "a": "UrPass caches validation keys locally in the browser so passes continue to be validated securely even if venue connectivity drops temporarily."}
        ],
        "relatedLinks": [
            {"title": "Conference Badge Scanning Software", "href": "/conference-badge-scanning-software", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"},
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"}
        ]
    },
    {
        "slug": "duplicate-qr-ticket-detection",
        "title": "Duplicate QR Ticket Detection | UrPass",
        "h1": "Prevent Duplicate Event Entries with QR Verification",
        "description": "Block screenshot sharing, duplicate pass use, and ticket fraud with instant single-use QR invalidation and multi-device sync.",
        "badge": "FRAUD & DUPLICATION PREVENTION",
        "ctaLabel": "Prevent Duplicate Scans",
        "directAnswer": {
            "title": "How Does Duplicate QR Ticket Detection Work on UrPass?",
            "summary": "UrPass eliminates ticket fraud, pass sharing, and duplicate entries using atomic database validation and cryptographic tokens. The exact millisecond a QR pass is scanned, its token is locked and invalidated. Any subsequent scan attempt—even seconds later at a different gate—triggers a loud audible error and displays the initial scan timestamp.",
            "keyPoints": [
                "Single-use cryptographic tokens ensuring each pass admits exactly one person",
                "Atomic row-level database locks preventing race-condition multi-gate scans",
                "Instant visual and audio alert displaying exact initial scan time and gate name",
                "Complete protection against screenshot forwarding, photocopying, and pass scalping"
            ]
        },
        "keyFactsTable": {
            "title": "Fraud Prevention: UrPass vs Generic QR Codes",
            "subtitle": "Stopping ticket pass-backs and screenshot sharing.",
            "headers": ["Security Factor", "UrPass Duplicate Detection Engine", "Static QR Codes & Google Sheets"],
            "rows": [
                {"col1": "Duplicate Detection Speed", "col2": "Instant atomic invalidation (<150ms)", "col3": "Lagged batch syncs allowing multi-person entry"},
                {"col1": "Concurrent Multi-Gate Attack", "col2": "Database row lock blocks simultaneous scans at different doors", "col3": "Both gates admit the same screenshot simultaneously"},
                {"col1": "Duplicate Audit Information", "col2": "Displays exact initial scan timestamp, gate, and scanner ID", "col3": "Generic error with zero diagnostic context"},
                {"col1": "Offline Attack Protection", "col2": "Client-side signed token timestamps with reconciliation", "col3": "Offline lists easily tricked by duplicated codes"},
                {"col1": "Staff Dispute Resolution", "col2": "Definitive proof on screen resolves gate arguments quickly", "col3": "Embarrassing arguments between security and attendees"}
            ]
        },
        "features": [
            {"icon": "ShieldCheck", "title": "Atomic Database Validation", "desc": "Uses ACID database transactions with row-level locks so a ticket can never be checked in twice."},
            {"icon": "AlertTriangle", "title": "Bold Visual Crimson Alert", "desc": "Scanner screen turns bright red with a high-pitched error tone when a duplicate pass is detected."},
            {"icon": "Clock", "title": "Timestamped Audit Trail", "desc": "Screen displays the exact time (down to the second) and gate location where the pass was first scanned."},
            {"icon": "Radio", "title": "Sub-150ms Multi-Gate Sync", "desc": "If a guest tries to scan a pass at Gate 1 and their friend scans a copy at Gate 2, the second is blocked instantly."},
            {"icon": "Lock", "title": "Cryptographically Signed UUIDs", "desc": "Unguessable, high-entropy tokens prevent counterfeit QR codes from being synthesized by scalpers."},
            {"icon": "FileSpreadsheet", "title": "Fraud Attempt Reporting", "desc": "View logs of all rejected duplicate attempts to identify ticket scalping operations or pass-sharing rings."}
        ],
        "steps": [
            {"n": "01", "title": "Generate Secure Pass", "desc": "UrPass generates an encrypted, single-use QR pass linked to a unique cryptographic database record."},
            {"n": "02", "title": "First Legitimate Scan", "desc": "Attendee arrives at gate; scanner verifies token, admits guest, and atomically marks pass as used."},
            {"n": "03", "title": "Fraudulent Copy Presented", "desc": "Someone else attempts to use a screenshot or forwarded copy of the same QR code at any gate."},
            {"n": "04", "title": "Instant Duplicate Rejection", "desc": "Scanner flashes bright crimson and sounds an audible alarm: 'Already Scanned at Gate 1 at 18:42:15'."},
            {"n": "05", "title": "Dispute Resolved in Seconds", "desc": "Door security shows the timestamp to the attendee, eliminating confrontation and fraud."}
        ],
        "callout": {
            "badge": "ZERO TOLERANCE FOR FRAUD",
            "title": "Stop ticket scalpers and screenshot sharing from stealing your revenue.",
            "description": "At popular college fests, concerts, and tech conferences, attendees frequently screenshot their QR pass and WhatsApp it to multiple friends. UrPass completely shuts down this loophole.",
            "bullets": [
                "Atomic database locks make it physically impossible to scan a ticket twice",
                "Door security sees exact initial scan details to shut down gate arguments",
                "Protects event revenue and ensures venue capacity limits are never breached",
                "Works seamlessly across 20+ simultaneous smartphone gate scanners"
            ]
        },
        "faqs": [
            {"q": "What happens if an attendee screenshots their QR code and sends it to 3 friends?", "a": "The first friend to scan the QR code will be admitted. When the other friends attempt to scan, the screen immediately flashes red, showing 'Already Scanned' and denying entry."},
            {"q": "What information does the scanner show when a duplicate is scanned?", "a": "The scanner displays the attendee name, ticket tier, and the exact timestamp and gate where the pass was first checked in."},
            {"q": "What if two people scan the same pass at two different gates at the exact same second?", "a": "UrPass uses atomic database transactions with row-level locks. Only one transaction can commit; the other is rejected instantly."},
            {"q": "Can attendees scan out and scan back in later?", "a": "Yes, if bi-directional tracking is enabled. The pass will only permit re-entry if it was legitimately scanned out through an exit lane."}
        ],
        "relatedLinks": [
            {"title": "Multi-Gate QR Check-In", "href": "/multi-gate-event-check-in", "category": "Product"},
            {"title": "Smartphone QR Ticket Scanner", "href": "/smartphone-qr-ticket-scanner", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"}
        ]
    },
    {
        "slug": "event-attendee-csv-import",
        "title": "Bulk Event Attendee CSV Import | UrPass",
        "h1": "Import Event Attendees and Generate QR Passes",
        "description": "Upload guest lists via CSV, map attendee attributes, and automatically issue personalized digital QR passes via email and WhatsApp.",
        "badge": "BULK IMPORT & AUTOMATED ISSUANCE",
        "ctaLabel": "Import Attendee CSV",
        "directAnswer": {
            "title": "How Does Bulk Event Attendee CSV Import Work on UrPass?",
            "summary": "UrPass enables organizers to upload spreadsheets (.csv or .xlsx) with thousands of guest records in seconds. The importer automatically detects columns for Name, Email, Phone, Company, Ticket Tier, and Entry Limits, validates data integrity, generates unique QR codes, and dispatches passes via WhatsApp or email.",
            "keyPoints": [
                "One-click CSV & Excel spreadsheet upload with intelligent column mapping",
                "Custom attribute support including company, job title, table number, and entry quotas",
                "Automated data validation detecting missing emails and duplicate phone numbers",
                "Instant mass dispatch of personalized digital QR passes via WhatsApp and email"
            ]
        },
        "keyFactsTable": {
            "title": "CSV Import: UrPass vs Manual Entry",
            "subtitle": "Processing large guest rosters and member directories.",
            "headers": ["Import & Issuance Feature", "UrPass Bulk CSV Importer", "Manual Data Entry & Mail Merges"],
            "rows": [
                {"col1": "Processing Time (1,000 Guests)", "col2": "<15 seconds to import and generate passes", "col3": "3 to 5 hours of manual data entry and spreadsheet formatting"},
                {"col1": "Automated WhatsApp Delivery", "col2": "Direct batch dispatch with individual QR passes", "col3": "Third-party mail-merge plugins prone to spam filters"},
                {"col1": "Duplicate Record Cleaning", "col2": "Auto-detection of duplicate emails and phone numbers", "col3": "Duplicate invites sent to the same attendee multiple times"},
                {"col1": "Group Limit Configuration", "col2": "Map entry quotas (e.g. 1, 2, 5 scans) directly from CSV", "col3": "Impossible; all attendees treated as single entries"},
                {"col1": "Custom Attribute Mapping", "col2": "Flexible mapping for VIP notes, seating, and dietary info", "col3": "Rigid fixed schema rejecting non-standard columns"}
            ]
        },
        "features": [
            {"icon": "FileSpreadsheet", "title": "Intelligent Column Auto-Mapping", "desc": "Importer recognizes headers like 'Full Name', 'Mobile Number', 'Email Address', and 'Pass Limit'."},
            {"icon": "ShieldCheck", "title": "Data Hygiene & Validation", "desc": "Flags invalid email formats, missing country codes, and duplicate records before importing."},
            {"icon": "QrCode", "title": "Bulk QR Token Generation", "desc": "Generates unique, cryptographically secure digital passes for every imported row instantly."},
            {"icon": "Send", "title": "One-Click WhatsApp Dispatch", "desc": "Send personalized digital passes directly to attendees' WhatsApp in bulk with high deliverability."},
            {"icon": "Users", "title": "Group Quota Mapping", "desc": "Set individual entry allowances (e.g., admitting 1, 2, or 5 guests) directly via a CSV column."},
            {"icon": "BarChart3", "title": "Import Status Auditing", "desc": "View real-time progress bars and download error logs for any failed or invalid rows."}
        ],
        "steps": [
            {"n": "01", "title": "Prepare Spreadsheet", "desc": "Create a CSV or Excel file with columns for Name, Email, Phone, and optional Entry Quota."},
            {"n": "02", "title": "Upload to UrPass", "desc": "Drag and drop your spreadsheet into the UrPass attendee import modal."},
            {"n": "03", "title": "Confirm Column Mapping", "desc": "Review detected columns and map custom fields (e.g. VIP status, company title)."},
            {"n": "04", "title": "Generate QR Passes", "desc": "UrPass validates records and generates secure QR passes for every guest in seconds."},
            {"n": "05", "title": "Batch WhatsApp Dispatch", "desc": "Send personalized invitations and passes to all recipients with a single click."}
        ],
        "callout": {
            "badge": "MASS IMPORT EFFICIENCY",
            "title": "Import 1,000+ guest records and issue passes in under 3 minutes.",
            "description": "Whether you are hosting an NGO anniversary gala, an association AGM, or an internal corporate town hall, manually typing guest names is a recipe for errors. UrPass automates everything from CSV to phone.",
            "bullets": [
                "Zero manual copy-pasting or complex mail-merge plugins required",
                "Automatically issue personalized digital passes directly to WhatsApp and email",
                "Map custom fields like VIP status, table seating, and group entry limits",
                "Live delivery status tracking ensures no guest is left without an entry pass"
            ]
        },
        "faqs": [
            {"q": "What spreadsheet formats are supported for import?", "a": "UrPass supports standard .csv files as well as Microsoft Excel (.xlsx) files."},
            {"q": "Can I import custom entry limits for each person (e.g. 1 for singles, 5 for families)?", "a": "Yes! You can include an 'Entry Limit' or 'Max Scans' column in your spreadsheet, and UrPass will assign that exact quota to each recipient's QR pass."},
            {"q": "Can we send passes to imported attendees via WhatsApp in bulk?", "a": "Yes! UrPass integrates directly with the WhatsApp Cloud API to deliver personalized digital passes with QR codes in bulk."},
            {"q": "What happens if my CSV contains duplicate phone numbers or invalid emails?", "a": "The importer validates all data before committing, flags any duplicates or format errors, and lets you resolve them with one click."}
        ],
        "relatedLinks": [
            {"title": "WhatsApp Event Tickets", "href": "/whatsapp-event-tickets", "category": "Product"},
            {"title": "Group QR Ticket Check-In", "href": "/group-qr-ticket-check-in", "category": "Product"},
            {"title": "Event Capacity Management", "href": "/event-capacity-management-software", "category": "Product"},
            {"title": "Duplicate QR Ticket Detection", "href": "/duplicate-qr-ticket-detection", "category": "Product"}
        ]
    }
]

ICON_MAP = {
    "Building2": "Building2",
    "ShieldCheck": "ShieldCheck",
    "QrCode": "QrCode",
    "Smartphone": "Smartphone",
    "Users": "Users",
    "FileSpreadsheet": "FileSpreadsheet",
    "Briefcase": "Briefcase",
    "Clock": "Clock",
    "ScanLine": "ScanLine",
    "BarChart3": "BarChart3",
    "Factory": "Factory",
    "Layers": "Layers",
    "Radio": "Radio",
    "Send": "Send",
    "BadgeCheck": "BadgeCheck",
    "Sparkles": "Sparkles",
    "CreditCard": "CreditCard",
    "FileText": "FileText",
    "Maximize2": "Maximize2",
    "DoorOpen": "DoorOpen",
    "LogIn": "LogIn",
    "LogOut": "LogOut",
    "AlertTriangle": "AlertTriangle",
    "Lock": "Lock",
    "Zap": "Zap",
    "Calendar": "Calendar"
}

def generate_page_ts(page):
    slug = page["slug"]
    icons_used = set()
    for feat in page["features"]:
        icons_used.add(feat["icon"])
    
    # Sort icons for stable output
    sorted_icons = sorted(list(icons_used))
    icons_import = ", ".join(sorted_icons)

    features_json = []
    for f in page["features"]:
        features_json.append(f'          {{ icon: {f["icon"]}, title: "{f["title"]}", desc: "{f["desc"]}" }}')
    features_block = ",\n".join(features_json)

    steps_json = []
    for s in page["steps"]:
        steps_json.append(f'          {{ n: "{s["n"]}", title: "{s["title"]}", desc: "{s["desc"]}" }}')
    steps_block = ",\n".join(steps_json)

    faqs_json = []
    for f in page["faqs"]:
        q_escaped = f["q"].replace('"', '\\"')
        a_escaped = f["a"].replace('"', '\\"')
        faqs_json.append(f'          {{ q: "{q_escaped}", a: "{a_escaped}" }}')
    faqs_block = ",\n".join(faqs_json)

    related_json = []
    for r in page["relatedLinks"]:
        related_json.append(f'          {{ title: "{r["title"]}", href: "{r["href"]}", category: "{r["category"]}" }}')
    related_block = ",\n".join(related_json)

    direct_ans_points = json.dumps(page["directAnswer"]["keyPoints"])
    facts_headers = json.dumps(page["keyFactsTable"]["headers"])
    facts_rows = json.dumps(page["keyFactsTable"]["rows"], indent=12)
    callout_bullets = json.dumps(page["callout"]["bullets"])

    content = f'''import type {{ Metadata }} from "next";
import {{ {icons_import} }} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {{
  title: "{page["title"]}",
  description: "{page["description"]}",
  keywords: [
    "{slug.replace('-', ' ')}",
    "{page["h1"].lower()}",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: {{ canonical: "https://urpass.space/{slug}" }},
  openGraph: {{
    title: "{page["title"]}",
    description: "{page["description"]}",
    url: "https://urpass.space/{slug}",
    locale: "en_US",
    type: "website",
  }},
  other: {{
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  }},
}};

export default function Page() {{
  return (
    <SEOPage
      config={{{{
        badge: "{page["badge"]}",
        h1: "{page["h1"]}",
        canonicalUrl: "https://urpass.space/{slug}",
        description: "{page["description"]}",
        ctaLabel: "{page["ctaLabel"]}",
        directAnswer: {{
          title: "{page["directAnswer"]["title"]}",
          summary: "{page["directAnswer"]["summary"]}",
          keyPoints: {direct_ans_points},
        }},
        keyFactsTable: {{
          title: "{page["keyFactsTable"]["title"]}",
          subtitle: "{page["keyFactsTable"]["subtitle"]}",
          headers: {facts_headers},
          rows: {facts_rows},
        }},
        features: [
{features_block}
        ],
        steps: [
{steps_block}
        ],
        callout: {{
          badge: "{page["callout"]["badge"]}",
          title: "{page["callout"]["title"]}",
          description: "{page["callout"]["description"]}",
          bullets: {callout_bullets},
        }},
        faqs: [
{faqs_block}
        ],
        relatedLinks: [
{related_block}
        ],
      }}}}
    />
  );
}}
'''
    return content

# Run generation
created = 0
for page in PAGES_DATA:
    dir_path = os.path.join("app", page["slug"])
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "page.tsx")
    code = generate_page_ts(page)
    with open(file_path, "w") as f:
        f.write(code)
    created += 1
    print(f"Created: {file_path}")

print(f"\nSuccessfully generated {created} new landing pages.")
