export type CampusRole =
  | "INSTITUTION_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "CLUB_ADMIN"
  | "ORGANIZER"
  | "SCANNER";

export type CampusClubCategory =
  | "department_club"
  | "cell"
  | "committee"
  | "student_chapter"
  | "society";

export type CampusApprovalStatus =
  | "not_required"
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "changes_requested";

export type InstitutionStatus = "active" | "pending" | "suspended";

export interface Institution {
  id: string;
  organization_id?: string | null;
  name: string;
  institution_code: string;
  logo_url: string | null;
  website: string | null;
  email_domain: string | null;
  address: string | null;
  current_academic_year: string;
  primary_admin_id: string;
  subscription_tier: string;
  require_event_approval: boolean;
  status: InstitutionStatus;
  created_at: string;
  updated_at: string;
  departments_count?: number;
  clubs_count?: number;
  events_count?: number;
  students_count?: number;
}

export interface CampusDepartment {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  color: string;
  head_of_department_id: string | null;
  created_at: string;
  updated_at: string;
  clubs_count?: number;
  events_count?: number;
  students_count?: number;
  organizers_count?: number;
}

export interface CampusClub {
  id: string;
  institution_id: string;
  department_id: string | null; // null if institution-level unit (e.g. Placement Cell)
  name: string;
  slug: string;
  category: CampusClubCategory;
  description: string | null;
  color: string;
  faculty_advisor_id: string | null;
  lead_student_id: string | null;
  created_at: string;
  updated_at: string;
  events_count?: number;
  department?: CampusDepartment | null;
}

export interface CampusMember {
  id: string;
  institution_id: string;
  user_id: string | null;
  department_id: string | null;
  club_id: string | null;
  role: CampusRole;
  invited_email: string;
  status: "active" | "pending";
  invite_token?: string | null;
  created_at: string;
  updated_at: string;
  department?: CampusDepartment | null;
  club?: CampusClub | null;
  user_profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  } | null;
}

export interface CampusStudent {
  id: string;
  institution_id: string;
  student_id: string | null;
  roll_number: string;
  name: string;
  email: string;
  phone: string | null;
  department_id: string | null;
  year: number | null;
  section: string | null;
  created_at: string;
  updated_at: string;
  department?: CampusDepartment | null;
  participation?: StudentParticipationSummary;
}

export interface StudentParticipationSummary {
  events_registered: number;
  events_attended: number;
  events_missed: number;
  last_attendance: string | null;
  last_event_name: string | null;
  attendance_rate: number;
}

export interface StudentParticipationEvent {
  event_id: string;
  event_name: string;
  event_date: string;
  venue: string;
  status: string;
  registered_at: string;
  checked_in_at: string | null;
  attended: boolean;
  department_name?: string | null;
  club_name?: string | null;
}

export interface CampusOverviewKPIs {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalAttendees: number;
  attendanceRate: number;
  activeDepartments: number;
  activeClubs: number;
}

export interface CampusDepartmentStats {
  id: string;
  name: string;
  code: string;
  color: string;
  eventsCount: number;
  registrationsCount: number;
  checkedInCount: number;
  attendanceRate: number;
  clubsCount: number;
}

export interface CampusAnalyticsFilter {
  academicYear?: string;
  departmentId?: string;
  clubId?: string;
  eventId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CampusContext {
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  role: CampusRole;
  departmentId?: string | null;
  clubId?: string | null;
}
