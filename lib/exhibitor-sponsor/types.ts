export type SponsorshipTierName = "Platinum" | "Gold" | "Silver" | "Bronze" | "Custom";

export interface SponsorshipTier {
  id: string;
  eventId: string;
  name: string;
  price: number;
  currency: string;
  maxSponsors: number;
  benefits: string[];
  logoPlacementRules: {
    homepage: boolean;
    eventWebsite: boolean;
    agenda: boolean;
    session: boolean;
    email: boolean;
    badge: boolean;
    app: boolean;
  };
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorDeliverablesStatus {
  logoReceived: boolean;
  bannerReceived: boolean;
  boothConfirmed: boolean;
  emailInclusion: boolean;
  stageBranding: boolean;
  socialMention: boolean;
}

export interface EventSponsor {
  id: string;
  eventId: string;
  tierId?: string;
  tierName?: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  visibilitySettings: {
    homepage: boolean;
    eventWebsite: boolean;
    agenda: boolean;
    session: boolean;
    email: boolean;
    badge: boolean;
    app: boolean;
  };
  deliverablesStatus: SponsorDeliverablesStatus;
  pageViews: number;
  bannerClicks: number;
  boothVisits: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type BoothStatus = "available" | "assigned" | "reserved" | "occupied" | "closed";

export interface EventBooth {
  id: string;
  eventId: string;
  boothNumber: string;
  sizeSqft: number;
  hallName: string;
  zoneId?: string;
  status: BoothStatus;
  notes?: string;
  assignedExhibitorId?: string;
  assignedExhibitorName?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type ExhibitorStatus = "active" | "pending" | "waitlist" | "cancelled";

export interface EventExhibitor {
  id: string;
  eventId: string;
  boothId?: string;
  boothNumber?: string;
  name: string;
  companyName: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  category: string;
  productsServices: string[];
  portalToken: string;
  status: ExhibitorStatus;
  boothCheckedIn: boolean;
  boothCheckedInAt?: string | null;
  staffCount?: number;
  leadsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ExhibitorStaffRole = "booth_manager" | "booth_staff" | "sales_rep" | "technical_specialist";

export interface ExhibitorStaff {
  id: string;
  exhibitorId: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  role: ExhibitorStaffRole;
  pinCode?: string;
  canCaptureLeads: boolean;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
}

export type LeadQualification = "hot" | "warm" | "cold";
export type LeadFollowUpStatus = "pending" | "contacted" | "meeting_scheduled" | "closed_won" | "unqualified";

export interface ExhibitorLead {
  id: string;
  eventId: string;
  exhibitorId: string;
  staffId?: string;
  staffName?: string;
  attendeeId?: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  attendeeCompany?: string;
  attendeeDesignation?: string;
  ticketName?: string;
  qualificationRating: LeadQualification;
  notes?: string;
  interestedProducts: string[];
  tags: string[];
  followUpStatus: LeadFollowUpStatus;
  followUpRequired: boolean;
  consentConfirmed: boolean;
  customFields: Record<string, string>;
  capturedAt: string;
}

export type MeetingStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";

export interface ExhibitorB2BMeeting {
  id: string;
  eventId: string;
  exhibitorId: string;
  attendeeId?: string;
  requesterName: string;
  requesterEmail: string;
  requesterCompany?: string;
  status: MeetingStatus;
  proposedTime: string;
  durationMinutes: number;
  location: string;
  meetingNotes?: string;
  createdAt: string;
}

export interface AttendeeExhibitorBookmark {
  id: string;
  eventId: string;
  exhibitorId: string;
  attendeeId: string;
  notes?: string;
  callbackRequested: boolean;
  businessCardShared: boolean;
  createdAt: string;
}

export interface Stage3DashboardStats {
  totalExhibitors: number;
  activeExhibitors: number;
  totalSponsors: number;
  totalBooths: number;
  assignedBooths: number;
  totalLeadsCaptured: number;
  hotLeadsCount: number;
  totalMeetingsRequested: number;
  confirmedMeetingsCount: number;
  sponsorImpressions: number;
}
