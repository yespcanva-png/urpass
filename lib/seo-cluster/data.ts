export interface ClusterSection {
  title: string;
  description: string;
  points?: string[];
}

export interface ClusterFaq {
  q: string;
  a: string;
}

export interface ComparisonRow {
  criteria: string;
  spreadsheet: string;
  urpass: string;
}

export interface ClusterPageConfig {
  slug: string;
  isPillar: boolean;
  pillarCategory: "agenda" | "sessions" | "speakers" | "checkin" | "conference";
  primaryKeyword: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  openingCopy: string;
  geoAnswers: {
    question: string;
    answer: string;
  }[];
  features: ClusterSection[];
  comparison: ComparisonRow[];
  faqs: ClusterFaq[];
  relatedSlugs: string[];
}

export const PILLAR_SLUGS = [
  "event-agenda-builder",
  "event-session-management",
  "speaker-management-software",
  "session-qr-check-in",
  "conference-management-software",
] as const;

export const CLUSTER_PAGES: Record<string, ClusterPageConfig> = {
  // ─── 1. PILLAR 1: Event Agenda Builder ──────────────────────────────────────────
  "event-agenda-builder": {
    slug: "event-agenda-builder",
    isPillar: true,
    pillarCategory: "agenda",
    primaryKeyword: "event agenda builder",
    title: "Event Agenda Builder for Conferences & Events | UrPass",
    metaDescription:
      "Create multi-track event agendas, schedule sessions, assign rooms and speakers, and publish your conference schedule with UrPass. Free to start.",
    badge: "STAGE 1 PILLAR • AGENDA ENGINE",
    h1: "Build and Manage Your Entire Event Agenda",
    openingCopy:
      "UrPass Event Agenda Builder helps organisers create structured conference schedules with tracks, rooms, sessions and speakers from one workspace. Build single-day or multi-day agendas, manage parallel sessions and publish schedule changes directly to attendees.",
    geoAnswers: [
      {
        question: "What is event agenda software?",
        answer:
          "Event agenda software helps organisers create, organise and publish event schedules containing sessions, tracks, speakers, rooms and timings. It can also help attendees browse sessions and build personal agendas.",
      },
      {
        question: "What can UrPass Event Agenda Builder do?",
        answer:
          "UrPass lets organisers create multi-day agendas, organise sessions into tracks, assign speakers and rooms, manage capacity and publish schedules to attendees with instant real-time sync.",
      },
    ],
    features: [
      {
        title: "Build Multi-Track Agendas",
        description:
          "Run complex multi-track symposiums and summits without overlapping chaos. Organize sessions by topic, audience tier, technical level, or hall.",
        points: [
          "Color-coded visual tracks for Main Stage, Dev Track, Workshops, and VIP Keynotes",
          "Parallel timeline grid showing concurrent room bookings across hours",
          "One-click track filtering for attendees on mobile and desktop",
        ],
      },
      {
        title: "Manage Sessions and Timings",
        description:
          "Schedule presentations, panel debates, interactive Q&A rounds, and networking coffee breaks with sub-minute precision.",
        points: [
          "Drag-and-drop session scheduling across multiple conference dates",
          "Timezone-aware timestamps with automatic attendee local time conversion",
          "Buffer time management between sessions to avoid foyer crowd congestion",
        ],
      },
      {
        title: "Assign Rooms and Halls",
        description:
          "Map every session to physical auditoriums, breakout suites, and exhibition halls with strict room capacity limits.",
        points: [
          "Define maximum room capacity to prevent auditorium fire code violations",
          "Automatic room double-booking prevention across all parallel tracks",
          "Hall location tags and venue directions embedded into attendee passes",
        ],
      },
      {
        title: "Add Speakers & Bios",
        description:
          "Attach confirmed keynote speakers, panelists, and workshop trainers directly to individual agenda items.",
        points: [
          "Rich speaker headshots, company affiliations, and social credentials",
          "Support for multiple speakers and moderators on single panel sessions",
          "Direct links from agenda items to dedicated speaker detail pages",
        ],
      },
      {
        title: "Prevent Scheduling Conflicts",
        description:
          "UrPass automatically detects and flags scheduling collisions before you publish your schedule to attendees.",
        points: [
          "Instant alert if a speaker is assigned to two overlapping sessions",
          "Validation warning if a hall's seat limit is lower than registered attendees",
          "Track-level audit warnings to keep conference days balanced",
        ],
      },
      {
        title: "Publish Your Live Agenda",
        description:
          "Push schedule updates instantly to your public conference website, digital ticket passes, and mobile web app.",
        points: [
          "Clean responsive website widget compatible with any custom domain",
          "Instant synchronization when speakers change or room allocations shift",
          "Zero need to reprint paper pamphlets or re-upload static PDF schedules",
        ],
      },
    ],
    comparison: [
      {
        criteria: "Schedule Updates",
        spreadsheet: "Manual cell edits; out of date the minute changes occur",
        urpass: "Centralized live agenda with instant attendee mobile sync",
      },
      {
        criteria: "Speaker Conflict Detection",
        spreadsheet: "Requires manual cross-checking across multiple sheets",
        urpass: "Automatic collision warnings for speakers and room bookings",
      },
      {
        criteria: "Attendee Schedule Personalization",
        spreadsheet: "Static PDF or table; no personal bookmarks or reminders",
        urpass: "Interactive bookmarking and personal agenda creation",
      },
      {
        criteria: "Gate & Session Attendance",
        spreadsheet: "Disconnected paper rosters or manual clicker tallies",
        urpass: "Directly linked to unified attendee QR pass validation",
      },
    ],
    faqs: [
      {
        q: "What is an event agenda builder?",
        a: "An event agenda builder is software that allows conference organizers to design, structure, and publish event schedules including sessions, parallel tracks, speakers, and room assignments.",
      },
      {
        q: "Can I create multiple conference tracks?",
        a: "Yes. UrPass supports unlimited parallel tracks (e.g. Developer, Design, Executive, Workshops) with distinct color coding and hall associations.",
      },
      {
        q: "Can I assign different halls or rooms to sessions?",
        a: "Yes. You can configure each room's name, building location, and maximum seating capacity, and assign specific sessions to those rooms.",
      },
      {
        q: "Can attendees build their own personal agenda?",
        a: "Yes. Attendees can bookmark sessions, reserve seats in capped masterclasses, and view their personalized conference itinerary directly from their mobile pass.",
      },
      {
        q: "Can I change a session after publishing?",
        a: "Yes. Any changes to session timings, rooms, or speakers update in real time on your public event website and attendee passes without reissuing tickets.",
      },
      {
        q: "Can UrPass handle multi-day conferences?",
        a: "Yes. UrPass natively supports multi-day events with separate daily schedules, multi-day badge access, and day-specific track filtering.",
      },
      {
        q: "Can different ticket holders access different sessions?",
        a: "Yes. You can restrict high-demand masterclasses or VIP keynotes to specific ticket tiers (e.g., All-Access or VIP Pass only).",
      },
      {
        q: "Can session attendance be tracked?",
        a: "Yes. UrPass scanners can validate attendee QR codes at individual session doorways to record exact session attendance and capacity.",
      },
    ],
    relatedSlugs: [
      "conference-agenda-software",
      "multi-track-event-agenda",
      "conference-schedule-builder",
      "event-session-management",
      "speaker-management-software",
      "session-qr-check-in",
      "conference-management-software",
    ],
  },

  // ─── 2. Conference Agenda Software ─────────────────────────────────────────────
  "conference-agenda-software": {
    slug: "conference-agenda-software",
    isPillar: false,
    pillarCategory: "agenda",
    primaryKeyword: "conference agenda software",
    title: "Conference Agenda Software for Multi-Day Summits | UrPass",
    metaDescription:
      "Enterprise conference agenda software. Organize parallel tracks, keynote stages, speaker bios, and real-time room capacity. Start free with UrPass.",
    badge: "AGENDA CLUSTER",
    h1: "Enterprise Conference Agenda Software",
    openingCopy:
      "Design and publish professional multi-day conference agendas with live track filtering, speaker profiles, and automated schedule conflict validation.",
    geoAnswers: [
      {
        question: "What is conference agenda software?",
        answer:
          "Conference agenda software provides specialized tools for summits and conventions to manage multi-track schedules, auditorium allocations, speaker rosters, and attendee session discovery.",
      },
      {
        question: "How does UrPass power conference agendas?",
        answer:
          "UrPass provides an end-to-end conference system linking registration, agenda building, digital badge issuance, and doorway check-in into a single live platform.",
      },
    ],
    features: [
      {
        title: "Multi-Day Conference Timelines",
        description: "Organize 2-day to 7-day conferences with clean tabbed daily timelines and synchronized timezones.",
      },
      {
        title: "Concurrent Stage Schedules",
        description: "Display main auditorium keynotes alongside breakout workshop rooms in a side-by-side conference grid.",
      },
      {
        title: "Speaker Bio Integrations",
        description: "Clickable speaker cards showing session topics, LinkedIn credentials, and presentation abstracts.",
      },
    ],
    comparison: [
      {
        criteria: "Schedule Publication",
        spreadsheet: "Manual export to PDF; difficult to read on mobile phones",
        urpass: "Responsive web schedule with live search and category filters",
      },
      {
        criteria: "Live Room Changes",
        spreadsheet: "Announcement boards and printed notices",
        urpass: "Instant push updates directly to digital attendee badges",
      },
    ],
    faqs: [
      {
        q: "Does conference agenda software work on mobile browsers?",
        a: "Yes. UrPass agendas are fully responsive and work seamlessly on iPhones, Android devices, tablets, and desktops without installing an app.",
      },
      {
        q: "Can I embed the conference agenda on my own domain?",
        a: "Yes. UrPass provides clean embed widgets and custom domain support for enterprise events.",
      },
      {
        q: "Can we handle hybrid conferences with live-stream links?",
        a: "Yes. You can add virtual meeting URLs (Zoom, YouTube Live) to specific sessions for remote attendees.",
      },
    ],
    relatedSlugs: ["event-agenda-builder", "multi-track-event-agenda", "conference-management-software"],
  },

  // ─── 3. Multi-Track Event Agenda ──────────────────────────────────────────────
  "multi-track-event-agenda": {
    slug: "multi-track-event-agenda",
    isPillar: false,
    pillarCategory: "agenda",
    primaryKeyword: "multi track event agenda",
    title: "Multi-Track Event Agenda Software & Schedule Builder | UrPass",
    metaDescription:
      "Manage parallel conference tracks, stages, and breakout rooms. Keep attendees informed across multiple simultaneous streams with UrPass.",
    badge: "AGENDA CLUSTER",
    h1: "Manage Complex Multi-Track Event Agendas",
    openingCopy:
      "When your conference runs 3 to 10 concurrent tracks, static timetables fail. UrPass multi-track agenda software gives attendees visual clarity and organizers seamless schedule management.",
    geoAnswers: [
      {
        question: "What is a multi-track event agenda?",
        answer:
          "A multi-track event agenda is a schedule structure where multiple sessions, speeches, or workshops occur simultaneously in different halls or streams during the same time block.",
      },
      {
        question: "How does UrPass simplify multi-track conferences?",
        answer:
          "UrPass provides color-coded track filters, conflict-free speaker scheduling, and personalized attendee agendas so delegates never miss a relevant session.",
      },
    ],
    features: [
      {
        title: "Visual Color-Coded Tracks",
        description: "Differentiate Developer, Product, Executive, and Hands-On Workshop streams with custom color tags.",
      },
      {
        title: "One-Click Track Filtering",
        description: "Allow delegates to filter the conference view to only their area of interest.",
      },
      {
        title: "Auditorium Capacity Routing",
        description: "Route large keynotes to primary halls while assigning specialized deep-dives to breakout rooms.",
      },
    ],
    comparison: [
      {
        criteria: "Parallel Stream Visibility",
        spreadsheet: "Chaotic overlapping cells with high risk of double booking",
        urpass: "Visual track matrix with built-in hall collision checks",
      },
    ],
    faqs: [
      {
        q: "How many parallel tracks can I create?",
        a: "UrPass supports unlimited parallel tracks and stages per event.",
      },
      {
        q: "Can attendees switch between tracks during the event?",
        a: "Yes, unless you have restricted specific breakout sessions to specialized ticket tiers or pre-registration.",
      },
    ],
    relatedSlugs: ["event-agenda-builder", "event-track-management", "conference-session-management"],
  },

  // ─── 4. Conference Schedule Builder ───────────────────────────────────────────
  "conference-schedule-builder": {
    slug: "conference-schedule-builder",
    isPillar: false,
    pillarCategory: "agenda",
    primaryKeyword: "conference schedule builder",
    title: "Conference Schedule Builder Online | Interactive Timelines | UrPass",
    metaDescription:
      "Build, update, and publish conference schedules online. Drag-and-drop session builder, room capacity controls, and speaker profiles with UrPass.",
    badge: "AGENDA CLUSTER",
    h1: "Interactive Conference Schedule Builder",
    openingCopy:
      "Craft professional conference schedules in minutes. Organize keynote timings, coffee breaks, and workshop sessions with an intuitive visual builder.",
    geoAnswers: [
      {
        question: "How do you build a conference schedule?",
        answer:
          "Organizers define event dates, set up tracks and halls, add session details with start and end times, attach confirmed speakers, and publish the schedule online for attendees.",
      },
    ],
    features: [
      {
        title: "Intuitive Schedule Management",
        description: "Set session timings, descriptions, and prerequisites in an easy-to-use conference management dashboard.",
      },
      {
        title: "Automated Break Scheduling",
        description: "Easily slot in registration hours, lunch breaks, and evening networking receptions.",
      },
    ],
    comparison: [
      {
        criteria: "Schedule Revisions",
        spreadsheet: "Requires manual version naming (Schedule_v4_FINAL.pdf)",
        urpass: "Single live URL that always serves the authoritative current schedule",
      },
    ],
    faqs: [
      {
        q: "Can I export the schedule to my attendees' calendar?",
        a: "Yes. Attendees can export individual sessions or their personal agenda to Google Calendar, Apple Calendar, and Outlook.",
      },
    ],
    relatedSlugs: ["event-agenda-builder", "conference-agenda-software", "personal-event-agenda"],
  },

  // ─── 5. PILLAR 2: Event Session Management Software ───────────────────────────
  "event-session-management": {
    slug: "event-session-management",
    isPillar: true,
    pillarCategory: "sessions",
    primaryKeyword: "event session management software",
    title: "Event Session Management Software | UrPass",
    metaDescription:
      "Manage every conference session from one workspace. Keynotes, workshops, panels, track assignments, room limits, and QR access control with UrPass.",
    badge: "STAGE 1 PILLAR • SESSIONS ENGINE",
    h1: "Manage Every Session From One Event Workspace",
    openingCopy:
      "Create keynotes, workshops, panels, presentations, networking sessions and custom sessions. Assign tracks, rooms, speakers, capacity limits and access rules without managing separate spreadsheets.",
    geoAnswers: [
      {
        question: "What is event session management software?",
        answer:
          "Event session management software helps conference teams create, configure, and govern individual event sessions, workshops, panel discussions, and keynotes including seating caps, access permissions, and attendance.",
      },
      {
        question: "What does UrPass Session Management cover?",
        answer:
          "UrPass manages the full session lifecycle: definition, room assignments, speaker links, ticket-tier restrictions, seat reservations, and doorway QR check-in scanning.",
      },
    ],
    features: [
      {
        title: "Comprehensive Session Types",
        description: "Support any conference format with purpose-built settings for each session style.",
        points: [
          "Keynotes: High-capacity auditorium addresses with VIP priority seating",
          "Workshops: Interactive labs with strict seat limits and pre-requisite instructions",
          "Panel Discussions: Multi-speaker debriefs with moderator identification",
          "Networking Sessions: Informal breakout hours with room capacity tracking",
        ],
      },
      {
        title: "Track, Room & Speaker Linking",
        description: "Maintain flawless relational integrity across all conference assets.",
        points: [
          "Assign sessions to specific tracks to keep themed delegates organized",
          "Lock sessions to physical halls and automatically monitor room capacity",
          "Attach multiple speakers and panelists with linked bios",
        ],
      },
      {
        title: "Ticket-Class Access Rules",
        description: "Protect exclusive masterclasses and executive tracks with automated pass permissions.",
        points: [
          "Restrict executive roundtables to VIP and Enterprise pass holders",
          "Allow general attendees to register for standard breakout tracks only",
          "Instant gate scanner rejection if an unentitled ticket holder tries to enter",
        ],
      },
      {
        title: "Live Doorway QR Check-In",
        description: "Transform any smartphone into an entrance scanner at session doorways.",
        points: [
          "Attendees use their main UrPass QR code &mdash; no secondary wristbands or paper tickets",
          "Fast sub-second scan verifies ticket eligibility and records session attendance",
          "Prevent overcrowded rooms by automatically stopping check-ins once seat limit is reached",
        ],
      },
    ],
    comparison: [
      {
        criteria: "Session Capacity Enforcement",
        spreadsheet: "Manual headcount at doorway; difficult to enforce",
        urpass: "Automated scan cutoff when room seat limit is reached",
      },
      {
        criteria: "Ticket-Tier Gating",
        spreadsheet: "Bouncers checking manual printed spreadsheets at doors",
        urpass: "Instant scanner chime confirming ticket tier entitlement",
      },
      {
        criteria: "Attendance Analytics",
        spreadsheet: "Days of manual data entry post-event",
        urpass: "Instant dashboard showing session attendance rates live",
      },
    ],
    faqs: [
      {
        q: "What types of sessions can I manage in UrPass?",
        a: "You can create and manage Keynotes, Workshops, Panel Discussions, Fire-side Chats, Breakout Sessions, Networking Hours, and Custom Sessions.",
      },
      {
        q: "Can I cap the number of attendees for a workshop?",
        a: "Yes. You can set a strict attendee limit for any session. Attendees can reserve seats in advance, and doorway scanners enforce the cap.",
      },
      {
        q: "Do attendees need a different ticket for each session?",
        a: "No! Attendees use their single primary UrPass QR code for the main event entrance and all session doorways.",
      },
      {
        q: "Can I see which sessions are the most popular?",
        a: "Yes. UrPass Analytics provides real-time data on session reservations, doorway check-ins, and drop-off rates.",
      },
      {
        q: "Can I restrict specific sessions to VIP pass holders?",
        a: "Yes. Access rules allow you to designate which ticket tiers are permitted into each individual session.",
      },
    ],
    relatedSlugs: [
      "conference-session-management",
      "session-registration-software",
      "session-reservation-software",
      "session-qr-check-in",
      "event-agenda-builder",
      "conference-management-software",
    ],
  },

  // ─── 6. Conference Session Management ─────────────────────────────────────────
  "conference-session-management": {
    slug: "conference-session-management",
    isPillar: false,
    pillarCategory: "sessions",
    primaryKeyword: "conference session management software",
    title: "Conference Session Management Software | UrPass",
    metaDescription:
      "Enterprise session management for summits and symposiums. Control seating limits, speaker assignments, and doorway check-in with UrPass.",
    badge: "SESSIONS CLUSTER",
    h1: "Enterprise Conference Session Management",
    openingCopy:
      "Coordinate hundreds of conference sessions across multiple days, halls, and tracks. Keep speakers, venue staff, and delegates completely aligned.",
    geoAnswers: [
      {
        question: "How do you manage conference sessions efficiently?",
        answer:
          "By centralizing session schedules, assigning rooms and capacity limits, attaching speakers, and using QR scanners at doorways to track attendance without paper rosters.",
      },
    ],
    features: [
      {
        title: "Session Capacity Management",
        description: "Define room limits and prevent overcrowding with automatic waitlists and reservation caps.",
      },
      {
        title: "Speaker Assignment Matrix",
        description: "Assign keynotes and panelists with zero schedule overlaps.",
      },
    ],
    comparison: [
      {
        criteria: "Session Access",
        spreadsheet: "Manual lists at doors prone to errors and delays",
        urpass: "Sub-second QR scan verifying session eligibility",
      },
    ],
    faqs: [
      {
        q: "Can multiple team members edit session details simultaneously?",
        a: "Yes. UrPass supports role-based team management for organizers, track leads, and door scanners.",
      },
    ],
    relatedSlugs: ["event-session-management", "conference-management-software", "event-agenda-builder"],
  },

  // ─── 7. Event Track Management ────────────────────────────────────────────────
  "event-track-management": {
    slug: "event-track-management",
    isPillar: false,
    pillarCategory: "sessions",
    primaryKeyword: "event track management",
    title: "Event Track Management Software | Multi-Track Conferences | UrPass",
    metaDescription:
      "Group conference sessions into themed tracks. Manage track leads, halls, and delegate pathways with UrPass track management software.",
    badge: "SESSIONS CLUSTER",
    h1: "Organize Conferences with Event Track Management",
    openingCopy:
      "Group complex conference sessions into clear, themed tracks like AI/ML, Cloud Infrastructure, Security, and Executive Strategy. Keep delegates focused on relevant content.",
    geoAnswers: [
      {
        question: "What is event track management?",
        answer:
          "Event track management is the categorization of conference sessions into distinct subject tracks, allowing delegates to follow structured learning paths across multi-day events.",
      },
    ],
    features: [
      {
        title: "Themed Content Streams",
        description: "Create distinct tracks with custom names, color tags, and audience descriptions.",
      },
      {
        title: "Track-Specific Analytics",
        description: "Compare engagement and attendance rates across different conference tracks.",
      },
    ],
    comparison: [
      {
        criteria: "Track Organization",
        spreadsheet: "Disjointed spreadsheets requiring constant re-formatting",
        urpass: "Dedicated track filters and automated attendee schedules",
      },
    ],
    faqs: [
      {
        q: "Can sessions belong to multiple tracks?",
        a: "Yes. A joint keynote can be tagged across multiple tracks so all interested delegates see it on their schedules.",
      },
    ],
    relatedSlugs: ["multi-track-event-agenda", "event-session-management", "event-agenda-builder"],
  },

  // ─── 8. Event Room Management ─────────────────────────────────────────────────
  "event-room-management": {
    slug: "event-room-management",
    isPillar: false,
    pillarCategory: "sessions",
    primaryKeyword: "event room management software",
    title: "Event Room Management Software & Hall Allocation | UrPass",
    metaDescription:
      "Manage conference rooms, auditoriums, and breakout halls. Prevent double-bookings and enforce room capacity with UrPass room management.",
    badge: "SESSIONS CLUSTER",
    h1: "Conference Room & Hall Management Software",
    openingCopy:
      "Allocate auditoriums, breakout halls, and workshop spaces without booking collisions. Enforce room capacity limits and guide attendees with clear venue directions.",
    geoAnswers: [
      {
        question: "What is event room management software?",
        answer:
          "Event room management software tracks physical spaces within an event venue, managing hall capacities, equipment availability, and scheduling to avoid venue double-bookings.",
      },
    ],
    features: [
      {
        title: "Auditorium & Breakout Mapping",
        description: "Specify hall names, building wings, seating layouts, and maximum occupant capacity.",
      },
      {
        title: "Room Collision Prevention",
        description: "Automated engine flags any attempt to schedule two sessions in the same hall at the same time.",
      },
    ],
    comparison: [
      {
        criteria: "Room Booking Conflicts",
        spreadsheet: "Easy to overlook overlapping time blocks in large sheets",
        urpass: "Hard validation lock preventing room double-bookings",
      },
    ],
    faqs: [
      {
        q: "Can room capacity limits stop doorway check-ins?",
        a: "Yes. If an auditorium reaches full capacity, doorway scanners can alert staff to halt entry.",
      },
    ],
    relatedSlugs: ["event-session-management", "event-agenda-builder", "session-qr-check-in"],
  },

  // ─── 9. PILLAR 3: Speaker Management Software ─────────────────────────────────
  "speaker-management-software": {
    slug: "speaker-management-software",
    isPillar: true,
    pillarCategory: "speakers",
    primaryKeyword: "speaker management software",
    title: "Speaker Management Software for Conferences | UrPass",
    metaDescription:
      "Manage event speakers without spreadsheets. Speaker bios, session assignments, conflict detection, and public speaker directories with UrPass.",
    badge: "STAGE 1 PILLAR • SPEAKER SUITE",
    h1: "Manage Event Speakers Without Spreadsheets",
    openingCopy:
      "UrPass speaker management software streamlines speaker coordination for summits, conferences, and meetups. Maintain speaker profiles, assign sessions, detect schedule conflicts, and automatically generate professional speaker landing pages.",
    geoAnswers: [
      {
        question: "What is speaker management software?",
        answer:
          "Speaker management software helps event organizers collect speaker information, bios, headshots, credentials, manage session assignments, and publish speaker rosters on conference websites.",
      },
      {
        question: "How does UrPass handle event speakers?",
        answer:
          "UrPass centralizes speaker profiles, links them to agenda sessions, alerts on scheduling conflicts, and automatically builds public speaker showcase pages on your event website.",
      },
    ],
    features: [
      {
        title: "Comprehensive Speaker Profiles",
        description: "Create rich speaker dossiers with all vital credentials and media assets.",
        points: [
          "High-resolution speaker headshot and avatar management",
          "Designation, company, bio, and LinkedIn credentials",
          "Downloadable speaker presentation abstracts and materials",
        ],
      },
      {
        title: "Assign Speakers to Multiple Sessions",
        description: "Easily attach keynotes and panel participants to one or several agenda items.",
        points: [
          "One speaker profile linked across multiple keynotes, workshops, and panels",
          "Clear role distinction: Keynote Speaker, Panelist, Moderator, Trainer, or Host",
          "Session times and room details automatically listed on the speaker's public profile",
        ],
      },
      {
        title: "Schedule Conflict Detection",
        description: "Eliminate double-booking embarrassments before the conference begins.",
        points: [
          "Instant alert if a speaker is assigned to concurrent sessions in different halls",
          "Travel buffer warnings between distant conference halls and buildings",
          "Overview calendar showing each speaker's commitments across all event days",
        ],
      },
      {
        title: "Public Speaker Directory Website",
        description: "Showcase world-class speakers directly on your public event website.",
        points: [
          "Stunning corporate speaker directory grid matching your brand colors",
          "Dedicated speaker detail pages with bio, social links, and session schedule",
          "SEO-optimized schema markup helping speaker pages rank in search engines",
        ],
      },
    ],
    comparison: [
      {
        criteria: "Speaker Bio Management",
        spreadsheet: "Scattered Word docs, email attachments, and Dropbox folders",
        urpass: "Centralized speaker profiles updated live on public websites",
      },
      {
        criteria: "Double-Booking Prevention",
        spreadsheet: "Manual eyeball checks; easy to double-book a keynote",
        urpass: "Automated schedule conflict engine flagging overlaps instantly",
      },
      {
        criteria: "Website Publishing",
        spreadsheet: "Web developer must manually code speaker cards in HTML",
        urpass: "1-click publishing to branded conference website",
      },
    ],
    faqs: [
      {
        q: "Can a speaker be assigned to more than one session?",
        a: "Yes. A speaker can deliver an opening keynote, participate in an afternoon panel, and lead a workshop without duplicating their profile.",
      },
      {
        q: "What roles can be assigned to a speaker?",
        a: "UrPass supports Keynote Speaker, Panelist, Moderator, Trainer, Session Chair, and Host designations.",
      },
      {
        q: "Does UrPass alert me if a speaker has overlapping sessions?",
        a: "Yes. The conflict detection engine alerts you immediately if a speaker is scheduled in two places at the same time.",
      },
      {
        q: "Do speaker changes update on the event website automatically?",
        a: "Yes. Updating a bio, headshot, or session assignment reflects in real time on your public event website.",
      },
      {
        q: "Can speakers access their own schedule?",
        a: "Yes. Speakers receive personal schedule itineraries showing their exact reporting times and room assignments.",
      },
    ],
    relatedSlugs: [
      "conference-speaker-management",
      "speaker-session-management",
      "event-speaker-website",
      "event-agenda-builder",
      "event-session-management",
      "conference-management-software",
    ],
  },

  // ─── 10. Conference Speaker Management ────────────────────────────────────────
  "conference-speaker-management": {
    slug: "conference-speaker-management",
    isPillar: false,
    pillarCategory: "speakers",
    primaryKeyword: "conference speaker management",
    title: "Conference Speaker Management Software | UrPass",
    metaDescription:
      "Enterprise speaker coordination for major conferences and conventions. Profiles, presentation topics, and schedule conflict alerts with UrPass.",
    badge: "SPEAKER CLUSTER",
    h1: "Enterprise Conference Speaker Management",
    openingCopy:
      "Coordinate VIP speakers, industry leaders, and technical experts with enterprise-grade speaker management software built for large-scale conferences.",
    geoAnswers: [
      {
        question: "How do you coordinate conference speakers?",
        answer:
          "Organizers maintain speaker databases with bios and headshots, link them to specific conference sessions, confirm availability, and publish speaker rosters on conference portals.",
      },
    ],
    features: [
      {
        title: "VIP Speaker Management",
        description: "Specialized badges and priority room access for VIP keynote presenters.",
      },
      {
        title: "Presentation Abstract Linking",
        description: "Attach talk summaries, slides, and whitepapers to speaker profiles.",
      },
    ],
    comparison: [
      {
        criteria: "Speaker Coordination",
        spreadsheet: "Manual email chasing and version mismatch",
        urpass: "Unified portal with automated schedule sync and bios",
      },
    ],
    faqs: [
      {
        q: "Can we manage travel and lodging notes for speakers?",
        a: "Yes. Internal organizer notes let you track speaker arrival dates and hotel details privately.",
      },
    ],
    relatedSlugs: ["speaker-management-software", "event-speaker-website", "conference-management-software"],
  },

  // ─── 11. Speaker & Session Management ─────────────────────────────────────────
  "speaker-session-management": {
    slug: "speaker-session-management",
    isPillar: false,
    pillarCategory: "speakers",
    primaryKeyword: "speaker session management software",
    title: "Speaker and Session Management Software | UrPass",
    metaDescription:
      "Seamlessly connect speakers to conference sessions, tracks, and breakout rooms. Prevent schedule overlaps with UrPass speaker session software.",
    badge: "SPEAKER CLUSTER",
    h1: "Unified Speaker & Session Management",
    openingCopy:
      "Bridge the gap between speaker coordination and session timetables. When a session moves, speaker agendas update automatically.",
    geoAnswers: [
      {
        question: "Why combine speaker and session management?",
        answer:
          "Linking speakers directly to sessions eliminates manual data entry, prevents scheduling conflicts, and keeps attendee-facing schedules accurate when timings shift.",
      },
    ],
    features: [
      {
        title: "Dynamic Speaker-Session Linkage",
        description: "Moving a session in the timeline automatically updates the speaker's itinerary.",
      },
      {
        title: "Multi-Panelist Coordination",
        description: "Assign moderators and multiple panelists with clear on-stage order.",
      },
    ],
    comparison: [
      {
        criteria: "Schedule Rescheduling",
        spreadsheet: "Requires updating 3 different tabs manually",
        urpass: "One change updates sessions, speaker bios, and attendee passes",
      },
    ],
    faqs: [
      {
        q: "What happens if a session time changes?",
        a: "The speaker's itinerary, the public agenda, and attendee calendars update immediately.",
      },
    ],
    relatedSlugs: ["speaker-management-software", "event-session-management", "event-agenda-builder"],
  },

  // ─── 12. Session Registration Software ────────────────────────────────────────
  "session-registration-software": {
    slug: "session-registration-software",
    isPillar: false,
    pillarCategory: "sessions",
    primaryKeyword: "session registration software",
    title: "Session Registration Software for Conferences | UrPass",
    metaDescription:
      "Enable attendees to pre-register for individual conference sessions, masterclasses, and workshops with UrPass session registration software.",
    badge: "SESSIONS CLUSTER",
    h1: "Conference Session Registration Software",
    openingCopy:
      "Give attendees the power to choose their own conference journey. Enable seat pre-registration for specialized masterclasses and restricted workshops.",
    geoAnswers: [
      {
        question: "What is session registration software?",
        answer:
          "Session registration software lets event attendees register for specific conference workshops, breakout tracks, or lunch sessions in addition to general event entry.",
      },
    ],
    features: [
      {
        title: "Seat Pre-Registration",
        description: "Allow attendees to secure spots in limited-capacity technical labs.",
      },
      {
        title: "Automated Waitlists",
        description: "When a workshop is full, excess delegates join a waitlist and receive auto-promotions on cancellations.",
      },
    ],
    comparison: [
      {
        criteria: "Workshop Booking",
        spreadsheet: "Google Forms sheets with manual seat counting and duplicate entries",
        urpass: "Automated real-time inventory management with instant confirmations",
      },
    ],
    faqs: [
      {
        q: "Can attendees reserve sessions after buying an event ticket?",
        a: "Yes. Attendees can log into their pass portal anytime to select their sessions.",
      },
    ],
    relatedSlugs: ["event-session-management", "session-reservation-software", "session-qr-check-in"],
  },

  // ─── 13. Session Reservation Software ────────────────────────────────────────
  "session-reservation-software": {
    slug: "session-reservation-software",
    isPillar: false,
    pillarCategory: "sessions",
    primaryKeyword: "conference session reservation",
    title: "Conference Session Reservation Software | UrPass",
    metaDescription:
      "Allow delegates to reserve seats in workshops and keynotes. Prevent overcrowded conference halls with UrPass session reservations.",
    badge: "SESSIONS CLUSTER",
    h1: "Smart Conference Session Reservations",
    openingCopy:
      "Control auditorium crowds and workshop seating. Let delegates reserve seats in advance so you can gauge popularity and optimize hall allocations.",
    geoAnswers: [
      {
        question: "How do session reservations work for events?",
        answer:
          "Registered attendees browse the event agenda and click to reserve a seat in capped workshops. Doorway scanners verify reservation status at the room entrance.",
      },
    ],
    features: [
      {
        title: "Real-Time Seating Inventory",
        description: "Display live remaining seats for high-demand masterclasses.",
      },
      {
        title: "Ticket-Tier Priority Booking",
        description: "Give VIP ticket holders 24-hour early booking access to exclusive sessions.",
      },
    ],
    comparison: [
      {
        criteria: "Seating Control",
        spreadsheet: "First-come first-served chaos at hall doorways",
        urpass: "Orderly pre-reserved seating with QR validation at entrance",
      },
    ],
    faqs: [
      {
        q: "Can an attendee cancel their reservation?",
        a: "Yes. Cancelling releases the seat to waitlisted delegates immediately.",
      },
    ],
    relatedSlugs: ["session-registration-software", "event-session-management", "session-qr-check-in"],
  },

  // ─── 14. Personal Event Agenda ────────────────────────────────────────────────
  "personal-event-agenda": {
    slug: "personal-event-agenda",
    isPillar: false,
    pillarCategory: "agenda",
    primaryKeyword: "personal event agenda software",
    title: "Personal Event Agenda & Schedule Bookmarks | UrPass",
    metaDescription:
      "Let conference delegates build their own custom event schedule. Bookmark favorite sessions, receive reminders, and sync to calendars.",
    badge: "AGENDA CLUSTER",
    h1: "Empower Delegates with Personal Event Agendas",
    openingCopy:
      "Nobody attends every session at a 100-session conference. UrPass allows delegates to curate their personal itinerary, view room locations, and stay on schedule.",
    geoAnswers: [
      {
        question: "What is a personal event agenda?",
        answer:
          "A personal event agenda is a customized schedule tailored by an individual attendee containing only the specific sessions, workshops, and speeches they plan to attend.",
      },
    ],
    features: [
      {
        title: "1-Click Session Bookmarking",
        description: "Delegates tap star or bookmark icons to add sessions to 'My Agenda'.",
      },
      {
        title: "Calendar Synchronization",
        description: "Sync personalized agendas to Apple Calendar, Google Calendar, and Outlook.",
      },
    ],
    comparison: [
      {
        criteria: "Attendee Experience",
        spreadsheet: "Delegates highlighting printed paper booklets with markers",
        urpass: "Interactive digital itinerary embedded right inside their mobile pass",
      },
    ],
    faqs: [
      {
        q: "Do delegates need to create a separate account?",
        a: "No. Their personal agenda is tied directly to their UrPass ticket pass link.",
      },
    ],
    relatedSlugs: ["event-agenda-builder", "conference-agenda-app", "session-reservation-software"],
  },

  // ─── 15. Conference Agenda App ────────────────────────────────────────────────
  "conference-agenda-app": {
    slug: "conference-agenda-app",
    isPillar: false,
    pillarCategory: "agenda",
    primaryKeyword: "conference agenda app",
    title: "Conference Agenda App | No-Download Web App | UrPass",
    metaDescription:
      "Interactive mobile conference agenda web app. No app store downloads required. Instant schedule browsing, speaker bios, and pass access with UrPass.",
    badge: "AGENDA CLUSTER",
    h1: "Zero-Download Conference Agenda Mobile App",
    openingCopy:
      "Don't force attendees to download an 80MB app store application they will delete after two days. UrPass delivers a lightning-fast progressive web app agenda that works instantly from any QR scan.",
    geoAnswers: [
      {
        question: "Why use a web-based conference agenda app?",
        answer:
          "Web-based agenda apps eliminate app store download barriers, work across all devices, load instantly from QR codes, and update in real time without app store review delays.",
      },
    ],
    features: [
      {
        title: "Instant 0.2s Load Time",
        description: "Engineered with modern Next.js for blazing fast performance on mobile data.",
      },
      {
        title: "Offline Schedule Cache",
        description: "Schedules remain fully readable even if convention center WiFi drops completely.",
      },
    ],
    comparison: [
      {
        criteria: "Attendee Adoption",
        spreadsheet: "Paper pamphlets littering the floor",
        urpass: "100% attendee accessibility with zero app store friction",
      },
    ],
    faqs: [
      {
        q: "Does this require iOS App Store or Google Play approval?",
        a: "No! It is a modern web app that opens instantly when delegates tap their ticket link or scan a venue QR code.",
      },
    ],
    relatedSlugs: ["event-agenda-builder", "personal-event-agenda", "conference-management-software"],
  },

  // ─── 16. PILLAR 4: Session QR Check-In ────────────────────────────────────────
  "session-qr-check-in": {
    slug: "session-qr-check-in",
    isPillar: true,
    pillarCategory: "checkin",
    primaryKeyword: "session QR check in",
    title: "QR Session Check-In Software for Events & Workshops | UrPass",
    metaDescription:
      "One QR pass for every event session. Validate attendee entry at main gates and individual workshop doorways in <0.3s with UrPass session check-in.",
    badge: "STAGE 1 PILLAR • CHECK-IN ENGINE",
    h1: "One QR Pass for Every Event Session",
    openingCopy:
      "Attendees don't need separate QR codes for every workshop or conference session. Their existing UrPass pass can be validated at the main entrance, individual sessions, and controlled event areas.",
    geoAnswers: [
      {
        question: "How does session QR check-in work?",
        answer:
          "Attendees register once and receive a single cryptographically signed UrPass QR code. At session doorways, staff scan the same QR with any smartphone to instantly verify ticket eligibility, enforce room capacity, and record attendance.",
      },
      {
        question: "What workflow does UrPass Session Check-In follow?",
        answer:
          "Attendee registers → Receives UrPass QR → Enters main event gate → Reserves session → Same QR scanned at doorway → Access verified → Attendance recorded.",
      },
    ],
    features: [
      {
        title: "Single Universal QR Pass",
        description: "Eliminate the confusion of multiple tickets, wristbands, and paper badges.",
        points: [
          "One master QR pass functions across main gates, breakout halls, and dinner banquets",
          "Encrypted barcode payload prevents duplicate passes and fraudulent entry",
          "Instant offline verification ensures door scanning never stops if venue WiFi fails",
        ],
      },
      {
        title: "Doorway Scanner on Any Phone",
        description: "Turn staff smartphones into high-speed door scanners without rental hardware.",
        points: [
          "Works directly in mobile browsers with sub-300ms camera autofocus",
          "Audible confirmation chimes (Green chime for valid, Red buzzer for unentitled)",
          "Real-time headcount counter showing remaining available seats in the hall",
        ],
      },
      {
        title: "Automated Ticket-Tier Gating",
        description: "Instantly enforce access privileges without manual roster checking.",
        points: [
          "Restricted session? Scanner confirms if attendee has an All-Access or VIP ticket",
          "Workshop full? Scanner halts entry once room limit is reached",
          "Session reserved? Scanner verifies attendee's seat reservation status instantly",
        ],
      },
      {
        title: "Real-Time Room Attendance Telemetry",
        description: "Live dashboard telemetry showing exact headcounts per auditorium.",
        points: [
          "Track peak arrival times and room utilization percentages",
          "Export attendance logs with exact scan timestamps for Continuing Education compliance",
          "Detect no-shows to release reserved seats to standby attendees",
        ],
      },
    ],
    comparison: [
      {
        criteria: "Pass Multiplicity",
        spreadsheet: "Multiple tickets, paper printouts, and separate badge stickers",
        urpass: "One unified QR pass for main entrance and all sessions",
      },
      {
        criteria: "Scan Verification Speed",
        spreadsheet: "Manual check-off on paper sheets taking 10-15 seconds per person",
        urpass: "<0.3s camera scan with audible confirmation",
      },
      {
        criteria: "Offline Operation",
        spreadsheet: "Paper rosters don't sync; cloud-only apps break when WiFi fails",
        urpass: "Local IndexedDB offline cache reconciles automatically when reconnected",
      },
    ],
    faqs: [
      {
        q: "Do attendees need a new QR code for every session?",
        a: "No! Attendees use their single primary UrPass QR code for the main entrance and all internal sessions.",
      },
      {
        q: "What equipment is required at session doors?",
        a: "Just any standard smartphone or tablet with a camera. No proprietary hardware, barcode guns, or cables required.",
      },
      {
        q: "Can scanning work offline if the convention hall has no WiFi?",
        a: "Yes. UrPass door scanners cache session rosters locally. Passes scan instantly offline and sync back when connection restores.",
      },
      {
        q: "What happens if an unentitled ticket holder tries to enter?",
        a: "The scanner screen flashes red with a distinct warning chime, showing 'Not authorized for this session'.",
      },
      {
        q: "Can we track Continuing Professional Education (CPE/CEU) attendance?",
        a: "Yes. Every scan records an immutable timestamp and attendee ID, allowing you to export certified attendance logs.",
      },
    ],
    relatedSlugs: [
      "conference-session-check-in",
      "workshop-qr-check-in",
      "session-attendance-tracking",
      "event-attendance-tracking",
      "event-session-management",
      "conference-management-software",
    ],
  },

  // ─── 17. Conference Session Check-In ──────────────────────────────────────────
  "conference-session-check-in": {
    slug: "conference-session-check-in",
    isPillar: false,
    pillarCategory: "checkin",
    primaryKeyword: "conference session check in software",
    title: "Conference Session Check-In Software | Doorway Scanning | UrPass",
    metaDescription:
      "Speed up conference session check-ins. Scan delegate badges at hall doorways, monitor auditorium capacity, and prevent seat poaching with UrPass.",
    badge: "CHECK-IN CLUSTER",
    h1: "High-Speed Conference Session Check-In",
    openingCopy:
      "Avoid hallway gridlock. UrPass conference session check-in software validates delegate badges in under 0.3 seconds at auditorium doors.",
    geoAnswers: [
      {
        question: "How do you manage conference session door queues?",
        answer:
          "By deploying mobile phone scanners at each hall entrance, validating delegate QR badges in under 0.3 seconds, and automatically halting entry when room capacity is reached.",
      },
    ],
    features: [
      {
        title: "Sub-Second Doorway Validation",
        description: "Scan up to 40 delegates per minute per door operator.",
      },
      {
        title: "Auditorium Capacity Alerts",
        description: "Live visual bar showing room filling up in real time.",
      },
    ],
    comparison: [
      {
        criteria: "Door Queue Speed",
        spreadsheet: "Long foyer queues blocking hallways and delaying keynotes",
        urpass: "Sub-second camera scans keep attendee lines flowing smoothly",
      },
    ],
    faqs: [
      {
        q: "Can volunteers operate the doorway scanner?",
        a: "Yes. Staff scanner links allow volunteers to scan with zero access to financial or organizer settings.",
      },
    ],
    relatedSlugs: ["session-qr-check-in", "workshop-qr-check-in", "conference-management-software"],
  },

  // ─── 18. Workshop QR Check-In ─────────────────────────────────────────────────
  "workshop-qr-check-in": {
    slug: "workshop-qr-check-in",
    isPillar: false,
    pillarCategory: "checkin",
    primaryKeyword: "workshop QR check in",
    title: "Workshop QR Check-In Software | Hands-on Labs | UrPass",
    metaDescription:
      "Enforce seat limits and verify workshop registrations with QR check-in. Zero specialized hardware needed &mdash; scan with any phone on UrPass.",
    badge: "CHECK-IN CLUSTER",
    h1: "Workshop & Lab QR Check-In Software",
    openingCopy:
      "Hands-on computer labs and training workshops have strict seat caps. UrPass workshop QR check-in guarantees only registered participants enter.",
    geoAnswers: [
      {
        question: "How do you check attendees into workshops?",
        answer:
          "Workshop coordinators scan attendees' UrPass QR codes at the classroom door. The scanner verifies pre-registration and enforces maximum seat limits.",
      },
    ],
    features: [
      {
        title: "Strict Seating Enforcement",
        description: "Prevent non-paying attendees from taking reserved lab workstations.",
      },
      {
        title: "Certificate Verification Data",
        description: "Certify that attendees actually attended the mandatory workshop hours.",
      },
    ],
    comparison: [
      {
        criteria: "Lab Seat Security",
        spreadsheet: "People slipping in unannounced; paying delegates left without seats",
        urpass: "Digital doorway gating guarantees seats only for verified registrations",
      },
    ],
    faqs: [
      {
        q: "Can I issue certificates of completion based on workshop attendance?",
        a: "Yes. Export the verified attendee list directly to issue digital certificates.",
      },
    ],
    relatedSlugs: ["session-qr-check-in", "session-registration-software", "event-session-management"],
  },

  // ─── 19. Event Attendance Tracking ───────────────────────────────────────────
  "event-attendance-tracking": {
    slug: "event-attendance-tracking",
    isPillar: false,
    pillarCategory: "checkin",
    primaryKeyword: "event attendance tracking software",
    title: "Event Attendance Tracking Software | Real-Time Telemetry | UrPass",
    metaDescription:
      "Track event attendance in real time with QR check-in scanning. See who has arrived, check-in rates, and live attendance stats from your dashboard.",
    badge: "CHECK-IN CLUSTER",
    h1: "Real-Time Event Attendance Tracking Software",
    openingCopy:
      "Know exactly who has arrived at your event and when. UrPass updates your check-in dashboard live as attendees scan in &mdash; no manual counting, no spreadsheets.",
    geoAnswers: [
      {
        question: "What is event attendance tracking software?",
        answer:
          "Event attendance tracking software monitors and records attendee arrivals, check-in timestamps, and overall turnout rates using digital barcodes or QR codes.",
      },
    ],
    features: [
      {
        title: "Live Check-In Feed",
        description: "Watch arrivals in real time with attendee names, ticket tiers, and exact timestamps.",
      },
      {
        title: "CSV Export & Reporting",
        description: "Export full attendee rosters with arrival logs for post-event analysis.",
      },
    ],
    comparison: [
      {
        criteria: "Data Availability",
        spreadsheet: "Paper sheets that must be collected and typed up by hand",
        urpass: "Instant real-time cloud telemetry accessible from any device",
      },
    ],
    faqs: [
      {
        q: "Can attendance be tracked across multiple venue gates?",
        a: "Yes. Unlimited scanner operators can scan simultaneously across all entrance points.",
      },
    ],
    relatedSlugs: ["session-attendance-tracking", "session-qr-check-in", "conference-management-software"],
  },

  // ─── 20. Session Attendance Tracking ─────────────────────────────────────────
  "session-attendance-tracking": {
    slug: "session-attendance-tracking",
    isPillar: false,
    pillarCategory: "checkin",
    primaryKeyword: "session attendance tracking",
    title: "Session Attendance Tracking Software for Conferences | UrPass",
    metaDescription:
      "Track attendance per conference session and workshop. Measure speaker popularity, room occupancy, and compliance hours with UrPass.",
    badge: "CHECK-IN CLUSTER",
    h1: "Per-Session Attendance Tracking for Conferences",
    openingCopy:
      "Don't just measure who arrived at the conference entrance. Understand which specific keynotes, panels, and workshops drew the biggest crowds.",
    geoAnswers: [
      {
        question: "Why track per-session attendance?",
        answer:
          "Tracking individual session attendance reveals speaker engagement, proves CEU/CPE compliance, prevents room overcrowding, and guides future conference planning.",
      },
    ],
    features: [
      {
        title: "Auditorium Occupancy Analytics",
        description: "Measure exact attendance percentages against room capacity.",
      },
      {
        title: "Compliance & Continuing Education",
        description: "Export audited time-stamped attendance logs for legal and certification bodies.",
      },
    ],
    comparison: [
      {
        criteria: "Session Popularity Insight",
        spreadsheet: "Guesswork based on how crowded the room looked",
        urpass: "Exact digital scan counts and percentage attendance rates",
      },
    ],
    faqs: [
      {
        q: "Can session attendance data be exported immediately?",
        a: "Yes. Organizers can download attendance CSVs right after a session concludes.",
      },
    ],
    relatedSlugs: ["event-attendance-tracking", "session-qr-check-in", "event-session-management"],
  },

  // ─── 21. Event Website Builder ────────────────────────────────────────────────
  "event-website-builder": {
    slug: "event-website-builder",
    isPillar: false,
    pillarCategory: "conference",
    primaryKeyword: "event website builder",
    title: "Event Website Builder | Agenda, Speakers & Registration | UrPass",
    metaDescription:
      "Build high-converting event landing pages with agendas, speaker profiles, ticket purchasing, and FAQ sections. 1-click publishing with UrPass.",
    badge: "CONFERENCE CLUSTER",
    h1: "Corporate Event Website Builder",
    openingCopy:
      "Publish stunning, responsive conference websites in minutes. Include interactive agendas, speaker directories, ticket tiers, and venue information without writing code.",
    geoAnswers: [
      {
        question: "What is an event website builder?",
        answer:
          "An event website builder creates public landing pages for events featuring registration forms, ticket purchasing, speaker lists, schedules, and venue directions.",
      },
    ],
    features: [
      {
        title: "All-in-One Conference Portal",
        description: "Combines registration checkout, interactive agendas, speaker directories, and FAQs.",
      },
      {
        title: "Mobile-First SaaS Aesthetic",
        description: "Designed with modern enterprise SaaS styling (Zoho Backstage / Stripe Sessions look).",
      },
    ],
    comparison: [
      {
        criteria: "Maintenance Overhead",
        spreadsheet: "WordPress site requiring plugins, custom CSS, and manual data sync",
        urpass: "Native integration: agenda and ticket changes reflect automatically",
      },
    ],
    faqs: [
      {
        q: "Can I connect a custom domain?",
        a: "Yes. Pro and Enterprise plans allow custom domain mapping for event websites.",
      },
    ],
    relatedSlugs: ["conference-website-builder", "event-speaker-website", "conference-management-software"],
  },

  // ─── 22. Conference Website Builder ───────────────────────────────────────────
  "conference-website-builder": {
    slug: "conference-website-builder",
    isPillar: false,
    pillarCategory: "conference",
    primaryKeyword: "conference website builder",
    title: "Conference Website Builder | Multi-Day Summit Websites | UrPass",
    metaDescription:
      "Create professional conference websites with multi-track agendas, keynote speaker bios, sponsor tiers, and ticket checkout on UrPass.",
    badge: "CONFERENCE CLUSTER",
    h1: "Professional Conference Website Builder",
    openingCopy:
      "Give your summit the prestige it deserves. UrPass builds clean, corporate conference websites that showcase tracks, speakers, sponsors, and registration tiers.",
    geoAnswers: [
      {
        question: "How do you build a conference website quickly?",
        answer:
          "With UrPass, organizers configure conference details, add tracks and speakers, set ticket prices, and publish an automated corporate website with zero web design skills required.",
      },
    ],
    features: [
      {
        title: "Sponsor & Partner Showcase",
        description: "Display Title, Platinum, Gold, and Media partner logos with clickable links.",
      },
      {
        title: "Embedded Ticket Checkout",
        description: "Seamless ticket purchase flow supporting UPI, credit cards, and corporate invoicing.",
      },
    ],
    comparison: [
      {
        criteria: "Website Setup Speed",
        spreadsheet: "Weeks of back-and-forth with web development agencies",
        urpass: "Live in under 15 minutes with automated schedule synchronization",
      },
    ],
    faqs: [
      {
        q: "Is SEO metadata included?",
        a: "Yes. Schema markup, OpenGraph social cards, and sitemap generation are built in.",
      },
    ],
    relatedSlugs: ["event-website-builder", "event-speaker-website", "conference-management-software"],
  },

  // ─── 23. Event Speaker Website ────────────────────────────────────────────────
  "event-speaker-website": {
    slug: "event-speaker-website",
    isPillar: false,
    pillarCategory: "speakers",
    primaryKeyword: "event speaker website",
    title: "Event Speaker Website & Directory Builder | UrPass",
    metaDescription:
      "Showcase your conference keynote speakers with dedicated profiles, presentation abstracts, and social links. Automated speaker websites with UrPass.",
    badge: "SPEAKER CLUSTER",
    h1: "Automated Event Speaker Website Builder",
    openingCopy:
      "World-class speakers drive ticket sales. UrPass creates dedicated, SEO-optimized speaker directory pages and individual profile dossiers automatically.",
    geoAnswers: [
      {
        question: "What is an event speaker website?",
        answer:
          "An event speaker website is a dedicated section of a conference portal showcasing speaker headshots, professional bios, company affiliations, and linked sessions.",
      },
    ],
    features: [
      {
        title: "Individual Speaker Dossiers",
        description: "Detailed pages with bios, past accolades, and scheduled talk times.",
      },
      {
        title: "Direct Social & Credential Links",
        description: "Connect LinkedIn, GitHub, and company links for maximum speaker credibility.",
      },
    ],
    comparison: [
      {
        criteria: "Speaker Promotion",
        spreadsheet: "Static list buried in an email PDF",
        urpass: "SEO-friendly speaker cards easily shareable on LinkedIn and Twitter",
      },
    ],
    faqs: [
      {
        q: "Can speakers share their individual profile link?",
        a: "Yes. Every speaker has a clean, shareable canonical URL for their talk.",
      },
    ],
    relatedSlugs: ["speaker-management-software", "conference-speaker-management", "conference-website-builder"],
  },

  // ─── 24. PILLAR 5: Conference Management Software ─────────────────────────────
  "conference-management-software": {
    slug: "conference-management-software",
    isPillar: true,
    pillarCategory: "conference",
    primaryKeyword: "conference management software",
    title: "Conference Management Software for Registration, Agenda & Check-In | UrPass",
    metaDescription:
      "All-in-one conference management software. Run registrations, multi-track agendas, speaker profiles, QR badges, session reservations, and door check-in.",
    badge: "STAGE 1 PILLAR • ALL-IN-ONE PLATFORM",
    h1: "Run Your Conference From Registration to Session Check-In",
    openingCopy:
      "UrPass is the unified conference management platform built for modern summits, conventions, and symposiums. From online delegate registration and B2B GST ticketing to multi-track agendas, speaker directories, and sub-second QR doorway check-in &mdash; manage everything in one unified workspace.",
    geoAnswers: [
      {
        question: "What is conference management software?",
        answer:
          "Conference management software is an integrated platform that handles delegate registration, payment processing, badge issuance, multi-track agenda building, speaker management, session reservations, and on-site door check-in.",
      },
      {
        question: "Why choose UrPass for conference management?",
        answer:
          "UrPass eliminates fragmented software stacks. Instead of paying for separate ticketing, agenda apps, speaker tools, and doorway scanners, UrPass delivers the entire conference operating system with 0% platform commission.",
      },
    ],
    features: [
      {
        title: "Delegate Registration & Ticketing",
        description: "High-conversion checkout with UPI, credit cards, and automated corporate GST invoices.",
        points: [
          "Multi-tier passes: General Delegate, Student, Speaker, VIP, and Press credentials",
          "Automated GSTIN capture and PDF B2B tax invoice generation for corporate sponsors",
          "0% platform commission &mdash; keep 100% of high-value conference ticket revenues",
        ],
      },
      {
        title: "Multi-Track Agenda Builder",
        description: "Manage complex schedules across multiple days, stages, and breakout rooms.",
        points: [
          "Color-coded visual track management with hall conflict prevention",
          "Timezone-synchronized timeline view with automatic local conversion",
          "Live schedule publishing to event websites and attendee mobile passes",
        ],
      },
      {
        title: "Speaker Management Suite",
        description: "Maintain speaker bios, headshots, talk abstracts, and conflict-free schedules.",
        points: [
          "Dedicated public speaker directory and individual profile pages",
          "Speaker role designations: Keynote, Panelist, Moderator, and Session Chair",
          "Automated alerts if a speaker is assigned to overlapping time slots",
        ],
      },
      {
        title: "Session Reservations & Doorway Check-In",
        description: "Enforce workshop capacity limits using attendees' existing QR passes.",
        points: [
          "Attendees use one universal QR badge for main gate and internal session entry",
          "Sub-300ms camera scanner on any phone &mdash; no hardware rental fees",
          "Offline check-in mode guarantees non-stop scanning even during venue WiFi outages",
        ],
      },
      {
        title: "Branded Conference Website",
        description: "Publish a corporate SaaS-grade conference landing page in under 15 minutes.",
        points: [
          "Includes interactive agenda, speaker directory, sponsor tiers, and venue guide",
          "Custom domain mapping and enterprise SEO schema markup built-in",
          "Mobile-first responsive design matching Stripe Sessions and Zoho Backstage quality",
        ],
      },
      {
        title: "Real-Time Executive Analytics",
        description: "Monitor registration revenue, arrival velocity, and session popularities.",
        points: [
          "Live gate telemetry showing checked-in delegates vs expected arrivals",
          "Per-session occupancy rates and continuing education attendance logs",
          "Full CSV export for post-event CRM sync and sponsor reporting",
        ],
      },
    ],
    comparison: [
      {
        criteria: "Platform Commission",
        spreadsheet: "Ticketing aggregators taking 5% to 8% cut of conference gross",
        urpass: "0% commission on tickets (keep 100% of delegate revenues)",
      },
      {
        criteria: "Software Fragmentation",
        spreadsheet: "Separate tools for ticketing, agenda, check-in, and speaker bios",
        urpass: "All-in-one unified workspace from registration to doorway scan",
      },
      {
        criteria: "Check-In Reliability",
        spreadsheet: "Cloud-only scanners freezing when convention WiFi gets congested",
        urpass: "Sub-second camera scan with full offline IndexedDB sync",
      },
      {
        criteria: "Corporate Tax Invoicing",
        spreadsheet: "Manual PDF invoices created in Word/Excel upon delegate request",
        urpass: "Automated GSTIN capture and compliant PDF invoice generation",
      },
    ],
    faqs: [
      {
        q: "What makes UrPass different from traditional conference software?",
        a: "UrPass eliminates the 5-8% percentage commission fees taken by ticketing aggregators, combines ticketing with agenda and speaker tools, and enables doorway scanning with any smartphone instead of expensive hardware rentals.",
      },
      {
        q: "Can UrPass handle a conference with 5,000+ delegates?",
        a: "Yes. UrPass is architected for high-throughput enterprise scale, supporting multi-gate concurrent scanning, offline reconciliation, and high-concurrency ticket checkouts.",
      },
      {
        q: "How does the commercial pricing work?",
        a: "UrPass offers transparent flat subscription pricing with zero commission on ticket sales, saving large conferences lakhs of rupees.",
      },
      {
        q: "Can we issue different badge designs for attendees, speakers, and VIPs?",
        a: "Yes. The Ticket Studio supports distinct visual badge designs, background colors, and role titles for each ticket tier.",
      },
      {
        q: "Does UrPass provide B2B GST tax invoices for Indian corporate attendees?",
        a: "Yes. Attendees can enter their company name and GSTIN during checkout to receive compliant PDF tax invoices automatically.",
      },
    ],
    relatedSlugs: [
      "event-agenda-builder",
      "event-session-management",
      "speaker-management-software",
      "session-qr-check-in",
      "conference-registration-session-management",
      "conference-agenda-software",
      "conference-website-builder",
    ],
  },

  // ─── 25. Conference Registration & Session Management ─────────────────────────
  "conference-registration-session-management": {
    slug: "conference-registration-session-management",
    isPillar: false,
    pillarCategory: "conference",
    primaryKeyword: "conference registration and session management",
    title: "Conference Registration & Session Management Platform | UrPass",
    metaDescription:
      "End-to-end conference registration and session management software. Sell tickets, book workshop seats, and validate doorway QR passes with UrPass.",
    badge: "CONFERENCE CLUSTER",
    h1: "Unified Conference Registration & Session Management",
    openingCopy:
      "Connect delegate ticket sales directly to workshop seat reservations. Prevent oversold sessions and provide delegates with a seamless registration experience.",
    geoAnswers: [
      {
        question: "How do registration and session management connect?",
        answer:
          "When a delegate registers, their ticket tier defines which sessions they can access. They select or reserve sessions, and their single QR pass validates entrance at both main gates and session doorways.",
      },
    ],
    features: [
      {
        title: "Ticket-Linked Session Reservations",
        description: "Automatically grant workshop seat reservation rights upon ticket purchase.",
      },
      {
        title: "Unified Financial & Capacity Reporting",
        description: "Track ticket revenue side-by-side with session attendance and hall fill rates.",
      },
    ],
    comparison: [
      {
        criteria: "Attendee Registration Journey",
        spreadsheet: "Registering on Eventbrite, then filling out a separate Google Form for workshops",
        urpass: "Single continuous journey: buy ticket, pick sessions, receive one universal QR pass",
      },
    ],
    faqs: [
      {
        q: "Can an attendee upgrade their ticket tier to access VIP sessions?",
        a: "Yes. Organizers can upgrade attendee passes or allow delegates to pay the difference.",
      },
    ],
    relatedSlugs: ["conference-management-software", "event-session-management", "session-qr-check-in"],
  },
};
