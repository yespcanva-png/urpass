export type TrackVisibility = "public" | "hidden" | "draft";

export interface EventTrack {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  colour: string;
  sort_order: number;
  visibility: TrackVisibility;
  created_at: string;
  updated_at: string;
}

export interface EventRoom {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  floor: string | null;
  location: string | null;
  capacity: number;
  checkin_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type SessionType =
  | "keynote"
  | "presentation"
  | "panel"
  | "workshop"
  | "networking"
  | "break"
  | "lunch"
  | "registration"
  | "entertainment"
  | "custom";

export type SessionVisibility = "public" | "private" | "invite_only";
export type SessionStatus = "draft" | "published" | "cancelled" | "completed";

export interface SessionResource {
  name: string;
  url: string;
  type?: "pdf" | "slides" | "link" | "doc";
}

export interface EventSession {
  id: string;
  event_id: string;
  track_id: string | null;
  room_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  session_type: SessionType;
  session_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS or HH:MM
  end_time: string;   // HH:MM:SS or HH:MM
  capacity: number | null;
  allow_waitlist: boolean;
  registration_required: boolean;
  checkin_enabled: boolean;
  require_checkout: boolean;
  visibility: SessionVisibility;
  status: SessionStatus;
  cover_image: string | null;
  tags: string[];
  external_streaming_url: string | null;
  meeting_url: string | null;
  resources: SessionResource[];
  eligible_ticket_type_ids?: string[];
  created_at: string;
  updated_at: string;

  // Joined relations
  track?: EventTrack | null;
  room?: EventRoom | null;
  speakers?: SessionSpeakerJoined[];
  reservation_count?: number;
  checked_in_count?: number;
}

export type SpeakerVisibility = "public" | "hidden" | "draft";

export interface EventSpeaker {
  id: string;
  event_id: string;
  name: string;
  photo: string | null;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  topics: string[];
  display_order: number;
  visibility: SpeakerVisibility;
  created_at: string;
  updated_at: string;
  sessions?: Array<{
    session_id: string;
    role: SpeakerRole;
    session?: EventSession;
  }>;
}

export type SpeakerRole =
  | "speaker"
  | "moderator"
  | "panelist"
  | "host"
  | "mc"
  | "trainer"
  | "guest";

export interface SessionSpeaker {
  id: string;
  session_id: string;
  speaker_id: string;
  role: SpeakerRole;
  sort_order: number;
  created_at: string;
}

export interface SessionSpeakerJoined extends SessionSpeaker {
  speaker?: EventSpeaker;
}

export type ReservationStatus =
  | "reserved"
  | "cancelled"
  | "waitlisted"
  | "attended"
  | "no_show";

export interface SessionReservation {
  id: string;
  session_id: string;
  attendee_id: string;
  registration_id: string | null;
  status: ReservationStatus;
  reserved_at: string;
  cancelled_at: string | null;
  attendee?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    pass_type?: string;
  };
  session?: EventSession;
}

export interface AttendeeAgenda {
  id: string;
  event_id: string;
  attendee_id: string;
  session_id: string;
  created_at: string;
  session?: EventSession;
}

export interface SessionCheckIn {
  id: string;
  event_id: string;
  session_id: string;
  attendee_id: string;
  registration_id: string | null;
  pass_id: string | null;
  scanner_user_id: string | null;
  device_id: string | null;
  checkin_time: string;
  checkout_time: string | null;
  checkin_source: "qr" | "manual" | "rfid" | "api";
  sync_status: "synced" | "pending" | "conflict";
  created_at: string;
  attendee?: {
    id: string;
    name: string;
    email: string;
    pass_type?: string;
  };
}

export interface WebsiteSectionConfig {
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
}

export interface WebsiteSectionsMap {
  hero: WebsiteSectionConfig;
  about: WebsiteSectionConfig;
  agenda: WebsiteSectionConfig;
  speakers: WebsiteSectionConfig;
  venue: WebsiteSectionConfig;
  sponsors: WebsiteSectionConfig;
  faq: WebsiteSectionConfig;
  tickets: WebsiteSectionConfig;
  contact: WebsiteSectionConfig;
  [key: string]: WebsiteSectionConfig;
}

export interface EventWebsite {
  id: string;
  event_id: string;
  slug: string;
  custom_domain: string | null;
  theme: string;
  primary_colour: string;
  secondary_colour: string;
  hero_image: string | null;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  sections_config: WebsiteSectionsMap;
  social_links: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  cta_text: string;
  footer_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleConflict {
  type: "room" | "speaker" | "attendee";
  message: string;
  conflictingSessionId: string;
  conflictingSessionTitle: string;
  conflictingTime: string;
  targetName?: string; // Room name, speaker name, etc.
}

export interface ConferenceAnalytics {
  totalSessions: number;
  totalSpeakers: number;
  totalRooms: number;
  totalTracks: number;
  totalReservations: number;
  totalCheckIns: number;
  averageSessionAttendance: number;
  noShowRate: number;
  mostPopularSession: {
    id: string;
    title: string;
    reservations: number;
    checkIns: number;
  } | null;
  leastAttendedSession: {
    id: string;
    title: string;
    reservations: number;
    checkIns: number;
  } | null;
  roomUtilisation: Array<{
    roomId: string;
    roomName: string;
    capacity: number;
    sessionsCount: number;
    averageOccupancyPercent: number;
  }>;
  averageDwellMinutes?: number;
  tierBreakdown?: Array<{
    ticketType: string;
    checkInCount: number;
    percentage: number;
  }>;
  peakEntryTimes: Array<{
    timeSlot: string;
    count: number;
  }>;
}
