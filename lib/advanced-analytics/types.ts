export interface EventAnalyticsSummary {
  eventId: string;
  totalTickets: number;
  ticketsSold: number;
  ticketsClaimed: number;
  ticketsUnassigned: number;
  ticketsRevoked: number;
  totalAttendees: number;
  netAttendeesInside: number;
  totalCheckIns: number;
  totalExits: number;
  totalReEntries: number;
  attendanceRate: number; // percentage (net checked in / total tickets sold)
}

export interface GateHourlyScan {
  hour: string; // e.g., '14:00'
  entries: number;
  exits: number;
}

export interface GateAnalytics {
  gateId: string;
  gateName: string;
  zoneId?: string | null;
  zoneName?: string | null;
  totalEntries: number;
  totalExits: number;
  totalReEntries: number;
  totalDenied: number;
  scansByHour: GateHourlyScan[];
}

export interface SessionAnalytics {
  sessionId: string;
  sessionName: string;
  capacity?: number | null;
  totalRegistered: number;
  totalAttended: number;
  fillRatePercentage: number;
  avgDurationMinutes?: number | null;
}

export interface DemographicCount {
  label: string;
  count: number;
  percentage: number;
}

export interface DemographicBreakdown {
  category: string;
  counts: DemographicCount[];
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  entries: number;
  exits: number;
  netInside: number;
}

export interface AnalyticsFilter {
  ticketTypeId?: string;
  gateId?: string;
  sessionId?: string;
  startDate?: string;
  endDate?: string;
}

export interface FullEventAnalyticsReport {
  summary: EventAnalyticsSummary;
  gateBreakdown: GateAnalytics[];
  sessionBreakdown: SessionAnalytics[];
  demographics: {
    byTicketTier: DemographicBreakdown;
    byCollege: DemographicBreakdown;
    byDepartment: DemographicBreakdown;
  };
  timeSeries: TimeSeriesDataPoint[];
  generatedAt: string;
}
