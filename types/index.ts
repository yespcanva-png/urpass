export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  name: string;
  slug: "free" | "starter" | "pro";
  price_monthly: number;
  price_yearly: number;
  max_events: number;
  max_attendees: number;
  features: string[];
  is_active: boolean;
  created_at: string;
};

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "expired";

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  provider: string;
  provider_subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  plan?: Plan;
};

export type EventStatus = "draft" | "active" | "completed" | "cancelled";

export type Event = {
  id: string;
  organizer_id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  logo_url: string | null;
  banner_url: string | null;
  attendee_limit: number;
  status: EventStatus;
  application_enabled: boolean;
  is_paid_event: boolean;
  ticket_price: number;
  organization_id: string | null;
  workspace_id?: string | null;
  location_id?: string | null;
  workspace?: Workspace;
  location?: Location;
  created_at: string;
  updated_at: string;
};

export type TicketOrderStatus = "created" | "paid" | "failed";

export type TicketOrder = {
  id: string;
  event_id: string;
  attendee_id: string | null;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  buyer_email: string;
  buyer_name: string;
  status: TicketOrderStatus;
  created_at: string;
  updated_at: string;
};

export type ApiKey = {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus = "pending" | "approved" | "rejected";
export type PassStatus = "not_generated" | "generated" | "checked_in";

export type Attendee = {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  pass_type: string;
  application_status: ApplicationStatus;
  pass_status: PassStatus;
  created_at: string;
  updated_at: string;
};

export type Pass = {
  id: string;
  event_id: string;
  attendee_id: string;
  pass_type: string;
  pass_token: string;
  status: PassStatus;
  generated_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  attendee?: Attendee;
  event?: Event;
};

export type CheckIn = {
  id: string;
  pass_id: string;
  event_id: string;
  attendee_id: string;
  checked_in_at: string;
  checked_in_by: string;
  created_at: string;
};

export type OrgTier = "free" | "starter" | "pro" | "enterprise";
export type OrgRole = "owner" | "admin" | "event_manager" | "checkin_staff" | "viewer" | "member";
export type MemberStatus = "active" | "pending";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  brand_color: string;
  tier?: OrgTier;
  max_workspaces?: number;
  max_locations?: number;
  max_members?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationSettings = {
  id: string;
  organization_id: string;
  timezone: string;
  currency: string;
  date_format: string;
  time_format: "12h" | "24h";
  allowed_domains: string[];
  enforce_2fa: boolean;
  require_approval_for_passes: boolean;
  email_sender_name: string | null;
  support_email: string | null;
  custom_domain: string | null;
  brand_logo_url: string | null;
  brand_primary_color: string;
  brand_secondary_color: string;
  default_pass_template: string;
  features: {
    workspaces?: boolean;
    locations?: boolean;
    multiGate?: boolean;
    advancedAnalytics?: boolean;
    customPasses?: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type Workspace = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  is_default: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  memberCount?: number;
  eventCount?: number;
};

export type WorkspaceRole = "lead" | "member" | "viewer";

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  member_id: string;
  role: WorkspaceRole;
  created_at: string;
  member?: OrganizationMember;
};

export type VenueType = "physical" | "virtual" | "hybrid";

export type Location = {
  id: string;
  organization_id: string;
  workspace_id: string | null;
  name: string;
  venue_type: VenueType;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;
  capacity: number | null;
  timezone: string;
  virtual_url: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  workspace?: Workspace;
  eventCount?: number;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string | null;
  invited_email: string;
  role: OrgRole;
  status: MemberStatus;
  invite_token: string | null;
  invited_by: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: { full_name: string; avatar_url: string | null };
};

export type EventAssignment = {
  id: string;
  event_id: string;
  member_id: string;
  created_at: string;
};

export type DashboardStats = {
  totalEvents: number;
  activeEvents: number;
  totalPasses: number;
  totalCheckedIn: number;
};

export type EventStats = {
  totalApplications: number;
  approved: number;
  passesGenerated: number;
  checkedIn: number;
  pending: number;
  rejected: number;
};

// ── Enterprise SSO & Access Control Types ───────────────────────────────────────

export type SSOProtocol = "SAML" | "OIDC";
export type SSOConnectionStatus = "draft" | "active" | "inactive" | "testing";
export type DomainVerificationMethod = "dns_txt" | "meta_tag";
export type DomainVerificationStatus = "pending" | "verified" | "failed";
export type EnterpriseSessionStatus = "active" | "revoked" | "expired";

export interface EnterpriseSSOConnection {
  id: string;
  organization_id: string;
  protocol: SSOProtocol;
  name: string;
  status: SSOConnectionStatus;
  domains: string[];
  enforce_sso: boolean;
  jit_provisioning: boolean;
  default_role: OrgRole;

  // SAML Configuration
  sp_entity_id: string;
  acs_url: string;
  idp_entity_id: string | null;
  idp_sso_url: string | null;
  idp_certificate: string | null;

  // OIDC Configuration
  oidc_issuer: string | null;
  oidc_client_id: string | null;
  oidc_client_secret: string | null;
  oidc_authorization_endpoint: string | null;
  oidc_token_endpoint: string | null;
  oidc_userinfo_endpoint: string | null;

  // Testing & Metadata
  last_tested_at: string | null;
  last_tested_status: "success" | "failure" | null;
  last_tested_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerifiedDomain {
  id: string;
  organization_id: string;
  domain: string;
  verification_method: DomainVerificationMethod;
  verification_token: string;
  status: DomainVerificationStatus;
  verified_at: string | null;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnterpriseAuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface EnterpriseSession {
  id: string;
  organization_id: string;
  user_id: string;
  sso_connection_id: string | null;
  session_token_hash: string | null;
  idp_session_index: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device: string | null;
  status: EnterpriseSessionStatus;
  last_active_at: string;
  expires_at: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export interface SecurityPolicies {
  enforce_sso: boolean;
  allow_emergency_owner_login: boolean;
  session_idle_timeout_minutes: number;
  enforce_2fa: boolean;
  allowed_domains: string[];
  allowed_cidrs: string[];
  enforce_ip_allowlist: boolean;
  anonymize_pii_days?: number | null;
}

export type CustomDomainStatus = "pending" | "active" | "failed";
export type SslStatus = "pending" | "issued" | "failed";

export interface CustomDomain {
  id: string;
  organization_id: string;
  domain: string;
  cname_target: string;
  status: CustomDomainStatus;
  ssl_status: SslStatus;
  verification_token: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

