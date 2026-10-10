export type DistributionMode = "manual" | "claim_link" | "assign_later" | "bulk_csv";

export type TicketAssignmentState =
  | "UNASSIGNED"
  | "INVITED"
  | "CLAIMED"
  | "RETAINED"
  | "REVOKED"
  | "EXPIRED";

export interface DistributionSettings {
  enabled: boolean;
  assignmentDeadline?: string | null; // ISO timestamp
  requireFormValidation: boolean;
  allowReassignment: boolean;
  allowBuyerRevocation: boolean;
  autoClaimReminders: boolean;
  claimTokenTtlHours: number;
}

export interface TicketDistributionItem {
  ticketIndex: number;
  attendeeId: string;
  passId?: string;
  ticketTypeId: string;
  ticketTypeName: string;
  state: TicketAssignmentState;
  recipientName?: string | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  claimToken?: string | null;
  claimExpiresAt?: string | null;
  claimUrl?: string | null;
  claimedAt?: string | null;
  claimedByEmail?: string | null;
  assignedAt?: string | null;
  passToken?: string | null;
  customResponses?: Record<string, unknown>;
}

export interface DistributionHistoryEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: "INVITED" | "CLAIMED" | "REVOKED" | "REASSIGNED" | "RETAINED";
  ticketIndex: number;
  attendeeId: string;
  details?: Record<string, unknown>;
}

export interface OrderDistributionSummary {
  orderId: string;
  eventId: string;
  purchaserName: string;
  purchaserEmail: string;
  totalTickets: number;
  availableCount: number; // UNASSIGNED + EXPIRED
  assignedCount: number;  // INVITED + CLAIMED + RETAINED
  claimedCount: number;
  invitedCount: number;
  retainedCount: number;
  revokedCount: number;
  deadline?: string | null;
  isPastDeadline: boolean;
  tickets: TicketDistributionItem[];
  history: DistributionHistoryEntry[];
}

export interface AssignTicketInput {
  orderId: string;
  ticketIndex?: number;
  attendeeId?: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  mode?: DistributionMode;
  customResponses?: Record<string, unknown>;
}

export interface ClaimTicketInput {
  claimToken: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  customResponses?: Record<string, unknown>;
}

export interface ClaimTicketResult {
  success: boolean;
  ticket?: TicketDistributionItem;
  passToken?: string;
  updatedOrder?: Record<string, unknown>;
  error?: string;
  message?: string;
}
