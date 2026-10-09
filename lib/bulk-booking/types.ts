export interface BulkBookingSettings {
  enabled: boolean;
  minQuantity: number;
  maxQuantityPerOrder: number;
  maxQuantityPerCustomer: number;
  eligibleTicketTypeIds: string[] | null;
  allowMixedTickets: boolean;
  assignAttendeesLater: boolean;
  reservationTtlSeconds: number;
}

export interface BulkOrderItemInput {
  ticketTypeId: string;
  ticketTypeName: string;
  pricePaise: number;
  quantity: number;
  attendees?: Array<{
    name?: string;
    email?: string;
    phone?: string;
    age?: number;
  }>;
}

export interface BulkBookingRequest {
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  items: BulkOrderItemInput[];
  couponCode?: string;
  discountPaise?: number;
}

export interface BulkOrderPricing {
  items: Array<{
    ticketTypeId: string;
    ticketTypeName: string;
    pricePaise: number;
    quantity: number;
    subtotalPaise: number;
  }>;
  totalQuantity: number;
  subtotalPaise: number;
  discountPaise: number;
  totalAmountPaise: number;
  currency: string;
}

export interface BulkReservationResult {
  success: boolean;
  reservationId?: string;
  expiresAt?: string;
  totalQuantity?: number;
  error?: string;
  message?: string;
  remainingCapacity?: number;
  tierRemaining?: Record<string, number>;
}

export interface IssuedTicketRecord {
  attendeeId: string;
  passId: string;
  passToken: string;
  ticketTypeId: string;
  ticketTypeName: string;
  name: string;
  email: string;
  phone?: string;
  status: "generated" | "checked_in" | "revoked" | "refunded";
  lifecycleState: "active" | "checked_in" | "revoked" | "refunded";
  isUnassigned?: boolean;
}

export interface SettledBulkOrderResult {
  success: boolean;
  isExisting?: boolean;
  orderId: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  totalQuantity: number;
  totalAmountPaise: number;
  paymentId?: string;
  status: "paid" | "failed" | "refunded" | "partially_refunded";
  tickets: IssuedTicketRecord[];
  error?: string;
}

export interface RefundResult {
  success: boolean;
  orderId: string;
  isFullRefund: boolean;
  refundedCount: number;
  remainingActiveCount: number;
  refundedTicketIds: string[];
  refundedAmountPaise: number;
  error?: string;
}
