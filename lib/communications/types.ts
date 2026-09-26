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
}

export interface EventCommunicationSettings {
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  sms_fallback_enabled: boolean;
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
