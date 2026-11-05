import { formatEventDateTime } from "@/lib/markets/timezone";
import { formatPrice } from "@/lib/markets/currency";

export interface CorePassInfo {
  passToken: string;
  eventName: string;
  attendeeName: string;
  attendeeEmail: string;
  passType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  startsAtUtc?: string | null;
  venue: string;
  timezone: string;
  currency: string;
  priceMinor?: number;
  qrPayloadUrl: string;
}

/**
 * Standardizes event pass metadata for Apple Wallet, PDF badges, and email tickets.
 */
export function formatPassPayload(info: CorePassInfo) {
  const displayTime = info.startsAtUtc
    ? formatEventDateTime(info.startsAtUtc, info.timezone)
    : `${info.eventDate} ${info.startTime}`;

  const displayPrice = info.priceMinor !== undefined
    ? formatPrice(info.priceMinor, info.currency)
    : "Free";

  return {
    ...info,
    displayTime,
    displayPrice,
    formattedAttendee: `${info.attendeeName} (${info.attendeeEmail})`,
    badgeTitle: `${info.eventName} — ${info.passType.toUpperCase()}`,
  };
}
