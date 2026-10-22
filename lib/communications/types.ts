export type DeliveryChannel = "EMAIL" | "WHATSAPP" | "SMS";

export type DeliveryStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export interface SMSMessage {
  to: string; // E.164 normalized phone e.g. +919876543210
  body: string;
  templateName?: string;
  templateVariables?: Record<string, string>;
  dltEntityId?: string;
  dltTemplateId?: string;
  senderId?: string;
  metadata?: Record<string, unknown>;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  status: DeliveryStatus;
  error?: string;
  errorCode?: string;
  cost?: number;
  currency?: string;
  provider: string;
}

export interface SMSStatus {
  messageId: string;
  status: DeliveryStatus;
  deliveredAt?: string;
  failedAt?: string;
  failureReason?: string;
}

export interface SMSProvider {
  name: string;
  send(message: SMSMessage): Promise<SMSResult>;
  getStatus?(messageId: string): Promise<SMSStatus>;
}

export interface TicketDeliveryPayload {
  eventId: string;
  eventName: string;
  eventDate?: string | null;
  eventTime?: string | null;
  venue?: string | null;
  ticketId: string; // e.g. URP-84721
  passToken: string; // Hex string for URL: /pass/[passToken]
  attendeeId: string;
  attendeeName: string;
  email: string;
  phone?: string | null;
  passType?: string | null;
  ticketUrl?: string;
  version?: string | null;
  customMessage?: string;
  templateName?: string;
  templateLanguage?: string;
  mediaUrl?: string;
  whatsappConsent?: boolean;
  isSessionReply?: boolean;
}

export type WhatsAppIntegrationModel = "none" | "self_service" | "managed";

export type WhatsAppSetupStatus =
  | "disabled"
  | "not_configured"
  | "setup_in_progress"
  | "pending_verification"
  | "pending_payment"
  | "pending_admin_activation"
  | "active"
  | "suspended"
  | "failed";

export interface AutomationRuleItem {
  email: boolean;
  whatsapp: boolean;
}

export interface NotificationAutomationRules {
  registration_confirmed: AutomationRuleItem;
  registration_approved: AutomationRuleItem;
  registration_rejected: AutomationRuleItem;
  ticket_issued: AutomationRuleItem;
  qr_pass_generated: AutomationRuleItem;
  event_reminder: AutomationRuleItem;
  event_updated: AutomationRuleItem;
  event_cancelled: AutomationRuleItem;
}

export interface OrganizationCommunicationSettings {
  organization_id: string;
  enable_communication: boolean;
  default_channel: "email" | "whatsapp";
  email_communication: boolean;
  whatsapp_communication: boolean;
  whatsapp_integration_model: WhatsAppIntegrationModel;
  whatsapp_setup_status: WhatsAppSetupStatus;
  automation_rules: NotificationAutomationRules;
  created_at?: string;
  updated_at?: string;
}

export interface WhatsAppSelfServiceConfig {
  organization_id: string;
  waba_id?: string | null;
  phone_number_id?: string | null;
  app_id?: string | null;
  is_configured: boolean;
  display_phone_number?: string | null;
  verified_name?: string | null;
  connection_status: "pending" | "connected" | "disconnected" | "failed";
  last_verified_at?: string | null;
  access_token_preview?: string | null;
}

export interface WhatsAppManagedServiceRequest {
  id: string;
  organization_id: string;
  requested_by: string;
  status:
    | "pending_review"
    | "quote_provided"
    | "pending_payment"
    | "paid"
    | "pending_admin_activation"
    | "active"
    | "suspended"
    | "cancelled";
  estimated_monthly_volume: string;
  use_case: string;
  contact_email: string;
  contact_phone: string;
  quoted_amount?: number | null;
  currency: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
  activated_at?: string | null;
  admin_notes?: string | null;
  created_at: string;
}

export interface WhatsAppTemplateRecord {
  id: string;
  organization_id?: string | null;
  name: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  language: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAUSED";
  header_type?: string | null;
  body_text: string;
  footer_text?: string | null;
  buttons: Array<{ type: string; text: string; url?: string }>;
  variable_mappings?: Record<string, string>;
  is_system: boolean;
  created_at?: string;
}

export interface WhatsAppNotificationToggles {
  template_name?: string;
  template_language?: string;
  registration_received?: boolean;
  ticket_delivery?: boolean;
  payment_confirmation?: boolean;
  event_reminders?: boolean;
  event_cancellation?: boolean;
}

export interface EventCommunicationSettings {
  communication_enabled?: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  sms_fallback_enabled: boolean;
  whatsapp_model?: WhatsAppIntegrationModel;
  whatsapp_settings?: WhatsAppNotificationToggles;
  automation_rules?: NotificationAutomationRules;
  sms_sender_id?: string | null;
  sms_dlt_entity_id?: string | null;
  sms_dlt_template_id?: string | null;
  sms_provider?: string | null;
}

export interface CommunicationDeliveryRecord {
  id: string;
  event_id: string;
  ticket_id: string | null;
  attendee_id: string | null;
  channel: DeliveryChannel;
  destination: string;
  template_name: string;
  provider: string;
  provider_message_id: string | null;
  status: DeliveryStatus;
  attempt_count: number;
  failure_code: string | null;
  failure_reason: string | null;
  last_attempt_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
  provider_cost: number;
  currency: string;
  idempotency_key: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OperationalSMSPayload {
  eventId: string;
  eventName: string;
  attendeeId: string;
  phone: string;
  ticketId?: string;
  message: string;
  dltTemplateId?: string;
}
