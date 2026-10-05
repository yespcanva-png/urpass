import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  EventSummary,
  Gate,
  GateMode,
  GateStatus,
  OrganizationSummary,
} from "../types";
import { StorageService } from "../services/storage";
import { OfflineDb } from "../services/offlineDb";
import { SyncService } from "../services/syncService";
import { SupabaseOpsService } from "../services/supabaseService";
import { CONFIG } from "../constants/config";

interface EventContextType {
  organizations: OrganizationSummary[];
  selectedOrg: OrganizationSummary | null;
  events: EventSummary[];
  selectedEvent: EventSummary | null;
  gates: Gate[];
  assignedGate: Gate | null;
  isLoading: boolean;
  selectOrganization: (orgId: string) => void;
  selectEvent: (eventId: string) => Promise<void>;
  assignGate: (gateId: string) => Promise<void>;
  toggleGateStatus: (gateId: string, status: GateStatus) => Promise<void>;
  updateGateMode: (gateId: string, mode: GateMode) => Promise<void>;
  refreshEventData: () => Promise<void>;
}

const DEFAULT_ORGS: OrganizationSummary[] = [
  {
    id: "org-yesp",
    name: "Yesp Corporation",
    slug: "yesp-corp",
    role: "org_admin",
    eventsCount: 4,
    status: "active",
  },
  {
    id: "org-velaans",
    name: "Velaans Events",
    slug: "velaans-events",
    role: "event_manager",
    eventsCount: 2,
    status: "active",
  },
  {
    id: "org-techsummit",
    name: "Tech Summit Global",
    slug: "tech-summit-global",
    role: "gate_manager",
    eventsCount: 3,
    status: "active",
  },
  {
    id: "org-educonnect",
    name: "EduConnect",
    slug: "educonnect",
    role: "gate_staff",
    eventsCount: 1,
    status: "active",
  },
  {
    id: "org-globalexpo",
    name: "Global Expo",
    slug: "global-expo",
    role: "gate_manager",
    eventsCount: 2,
    status: "active",
  },
];

const DEFAULT_EVENTS: EventSummary[] = [
  {
    id: "evt-tech-summit-2026",
    organizationId: "org-yesp",
    name: "Tech Summit 2026",
    eventDate: "12 Oct 2026",
    startTime: "09:00 AM",
    venue: "Chennai Trade Centre",
    status: "active",
    attendeeLimit: 5000,
    totalRegistrations: 4820,
    approvedCount: 4820,
    checkedInCount: 4103,
    currentlyInsideCount: 3985,
    checkedOutCount: 118,
    activeGatesCount: 4,
    currency: "INR",
  },
  {
    id: "evt-ai-conclave-2026",
    organizationId: "org-yesp",
    name: "Global AI & Cloud Conclave",
    eventDate: "28 Nov 2026",
    startTime: "10:00 AM",
    venue: "Grand Ballroom, ITC Grand Chola",
    status: "draft",
    attendeeLimit: 3000,
    totalRegistrations: 2450,
    approvedCount: 2400,
    checkedInCount: 0,
    currentlyInsideCount: 0,
    checkedOutCount: 0,
    activeGatesCount: 2,
    currency: "INR",
  },
  {
    id: "evt-developer-day-2025",
    organizationId: "org-yesp",
    name: "Developer Day 2025",
    eventDate: "15 Jan 2025",
    startTime: "09:30 AM",
    venue: "Convention Hall 2",
    status: "completed",
    attendeeLimit: 2500,
    totalRegistrations: 2500,
    approvedCount: 2500,
    checkedInCount: 2380,
    currentlyInsideCount: 0,
    checkedOutCount: 2380,
    activeGatesCount: 0,
    currency: "INR",
  },
  {
    id: "evt-campus-fest-2026",
    organizationId: "org-velaans",
    name: "Inter-College Cultural & Music Fest",
    eventDate: "20 Oct 2026",
    startTime: "05:00 PM",
    venue: "Open Air Stadium Concourse",
    status: "active",
    attendeeLimit: 8000,
    totalRegistrations: 7420,
    approvedCount: 7100,
    checkedInCount: 4890,
    currentlyInsideCount: 4520,
    checkedOutCount: 370,
    activeGatesCount: 6,
    currency: "INR",
  },
  {
    id: "evt-global-expo-2026",
    organizationId: "org-globalexpo",
    name: "Global Trade & Tech Expo",
    eventDate: "05 Nov 2026",
    startTime: "09:00 AM",
    venue: "World Trade Exhibition Center",
    status: "active",
    attendeeLimit: 12000,
    totalRegistrations: 9800,
    approvedCount: 9500,
    checkedInCount: 6200,
    currentlyInsideCount: 5800,
    checkedOutCount: 400,
    activeGatesCount: 8,
    currency: "INR",
  },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>(DEFAULT_ORGS);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(DEFAULT_ORGS[0]);
  const [events, setEvents] = useState<EventSummary[]>(DEFAULT_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(DEFAULT_EVENTS[0]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [assignedGate, setAssignedGate] = useState<Gate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load organizations & live events from Supabase
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const liveOrgs = await SupabaseOpsService.fetchOrganizations();
      if (liveOrgs.length > 0) {
        setOrganizations(liveOrgs);
      }

      const savedOrgId = await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID);
      const activeOrg = liveOrgs.find((o) => o.id === savedOrgId) || liveOrgs[0] || DEFAULT_ORGS[0];
      setSelectedOrg(activeOrg);

      const liveEvents = await SupabaseOpsService.fetchEvents(activeOrg?.id);
      if (liveEvents.length > 0) {
        setEvents(liveEvents);
      }

      const savedEventId = await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID);
      const activeEvent = liveEvents.find((e) => e.id === savedEventId) || liveEvents[0] || DEFAULT_EVENTS[0];
      setSelectedEvent(activeEvent);

      if (activeEvent) {
        const liveGates = await SupabaseOpsService.fetchGates(activeEvent.id);
        setGates(liveGates);

        const savedGateId = await StorageService.getItem(CONFIG.STORAGE_KEYS.ASSIGNED_GATE_ID);
        const activeGate = liveGates.find((g) => g.id === savedGateId) || liveGates[0] || null;
        setAssignedGate(activeGate);

        // Pre-download local manifest for lightning-fast sub-0.3s scans
        await SyncService.downloadEventManifest(activeEvent.id);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Set up Supabase Realtime check-in updates
  useEffect(() => {
    if (!selectedEvent) return;

    try {
      const supabase = SupabaseOpsService.getClient();
      const channel = supabase
        .channel(`event-checkins-${selectedEvent.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "check_ins",
            filter: `event_id=eq.${selectedEvent.id}`,
          },
          (payload) => {
            // Live broadcast of newly scanned ticket
            const newScan = payload.new as any;
            if (newScan) {
              setSelectedEvent((prev) => {
                if (!prev) return null;
                const isEntry = newScan.direction === "in";
                return {
                  ...prev,
                  checkedInCount: isEntry ? prev.checkedInCount + 1 : prev.checkedInCount,
                  currentlyInsideCount: isEntry
                    ? prev.currentlyInsideCount + 1
                    : Math.max(0, prev.currentlyInsideCount - 1),
                  checkedOutCount: !isEntry ? prev.checkedOutCount + 1 : prev.checkedOutCount,
                };
              });

              setGates((prev) =>
                prev.map((g) =>
                  g.id === newScan.gate_id
                    ? { ...g, scansCount: g.scansCount + 1 }
                    : g
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime subscription fallback
    }
  }, [selectedEvent?.id]);

  function selectOrganization(orgId: string) {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      setSelectedOrg(org);
      StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID, org.id);
      SupabaseOpsService.fetchEvents(org.id).then((evts) => {
        if (evts.length > 0) {
          setEvents(evts);
          selectEvent(evts[0].id);
        }
      });
    }
  }

  async function selectEvent(eventId: string) {
    setIsLoading(true);
    try {
      const evt = events.find((e) => e.id === eventId);
      if (evt) {
        setSelectedEvent(evt);
        await StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID, evt.id);

        const liveGates = await SupabaseOpsService.fetchGates(evt.id);
        setGates(liveGates);
        setAssignedGate(liveGates[0] || null);

        // Pre-download manifest for offline resilience
        await SyncService.downloadEventManifest(evt.id);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function assignGate(gateId: string) {
    const g = gates.find((gate) => gate.id === gateId);
    if (g) {
      setAssignedGate(g);
      await StorageService.setItem(CONFIG.STORAGE_KEYS.ASSIGNED_GATE_ID, g.id);
    }
  }

  async function toggleGateStatus(gateId: string, status: GateStatus) {
    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, status } : g))
    );
    if (assignedGate?.id === gateId) {
      setAssignedGate((prev) => (prev ? { ...prev, status } : null));
    }
  }

  async function updateGateMode(gateId: string, mode: GateMode) {
    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, mode } : g))
    );
    if (assignedGate?.id === gateId) {
      setAssignedGate((prev) => (prev ? { ...prev, mode } : null));
    }
  }

  async function refreshEventData() {
    if (!selectedEvent) return;
    setIsLoading(true);
    try {
      const liveGates = await SupabaseOpsService.fetchGates(selectedEvent.id);
      setGates(liveGates);
      await SyncService.downloadEventManifest(selectedEvent.id);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <EventContext.Provider
      value={{
        organizations,
        selectedOrg,
        events,
        selectedEvent,
        gates,
        assignedGate,
        isLoading,
        selectOrganization,
        selectEvent,
        assignGate,
        toggleGateStatus,
        updateGateMode,
        refreshEventData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}
