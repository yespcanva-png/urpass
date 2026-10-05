import React, { createContext, useContext, useState, useEffect } from "react";
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
    id: "org-101",
    name: "UrPass Global Events",
    slug: "urpass-global",
    role: "event_manager",
    eventsCount: 3,
  },
  {
    id: "org-102",
    name: "Campus Tech & Cultural Council",
    slug: "campus-council",
    role: "gate_manager",
    eventsCount: 2,
  },
];

const DEFAULT_EVENTS: EventSummary[] = [
  {
    id: "evt-tech-summit-2026",
    organizationId: "org-101",
    name: "National Tech & AI Summit 2026",
    eventDate: "2026-10-15",
    startTime: "09:00 AM",
    venue: "Main Convention Center, Hall A & B",
    status: "active",
    attendeeLimit: 5000,
    totalRegistrations: 4850,
    approvedCount: 4600,
    checkedInCount: 3240,
    currentlyInsideCount: 2980,
    checkedOutCount: 260,
    activeGatesCount: 4,
    currency: "INR",
  },
  {
    id: "evt-campus-fest-2026",
    organizationId: "org-102",
    name: "Inter-College Cultural & Music Fest",
    eventDate: "2026-10-20",
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
];

const DEFAULT_GATES: Record<string, Gate[]> = {
  "evt-tech-summit-2026": [
    {
      id: "gate-a-main",
      eventId: "evt-tech-summit-2026",
      name: "Gate A – Main Concourse",
      zoneName: "Main Entrance",
      mode: "entry",
      status: "open",
      capacity: 3500,
      activeScannersCount: 4,
      scansCount: 1640,
      allowedTicketTypes: [],
      allowedBadgeTypes: ["participant", "vip", "speaker", "delegate", "student"],
    },
    {
      id: "gate-b-vip",
      eventId: "evt-tech-summit-2026",
      name: "Gate B – VIP & Keynote Speakers",
      zoneName: "VIP Concourse",
      mode: "both",
      status: "open",
      capacity: 500,
      activeScannersCount: 2,
      scansCount: 420,
      allowedTicketTypes: [],
      allowedBadgeTypes: ["vip", "speaker", "sponsor"],
    },
    {
      id: "gate-c-expo",
      eventId: "evt-tech-summit-2026",
      name: "Gate C – Exhibition Pavilion",
      zoneName: "Expo Hall",
      mode: "both",
      status: "open",
      capacity: 1500,
      activeScannersCount: 2,
      scansCount: 890,
      allowedBadgeTypes: ["participant", "exhibitor", "vip", "staff"],
    },
    {
      id: "gate-d-staff",
      eventId: "evt-tech-summit-2026",
      name: "Gate D – Staff & Crew Loading",
      zoneName: "Backstage / Crew",
      mode: "both",
      status: "open",
      capacity: 200,
      activeScannersCount: 1,
      scansCount: 290,
      allowedBadgeTypes: ["staff", "exhibitor"],
    },
  ],
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [organizations] = useState<OrganizationSummary[]>(DEFAULT_ORGS);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(DEFAULT_ORGS[0]);
  const [events, setEvents] = useState<EventSummary[]>(DEFAULT_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(DEFAULT_EVENTS[0]);
  const [gates, setGates] = useState<Gate[]>(DEFAULT_GATES["evt-tech-summit-2026"]);
  const [assignedGate, setAssignedGate] = useState<Gate | null>(DEFAULT_GATES["evt-tech-summit-2026"][0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadSavedEventSelection() {
      const savedOrgId = await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID);
      const savedEventId = await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID);
      const savedGateId = await StorageService.getItem(CONFIG.STORAGE_KEYS.ASSIGNED_GATE_ID);

      if (savedOrgId) {
        const foundOrg = DEFAULT_ORGS.find((o) => o.id === savedOrgId);
        if (foundOrg) setSelectedOrg(foundOrg);
      }

      if (savedEventId) {
        const foundEvt = DEFAULT_EVENTS.find((e) => e.id === savedEventId);
        if (foundEvt) {
          setSelectedEvent(foundEvt);
          const evtGates = DEFAULT_GATES[foundEvt.id] || [];
          setGates(evtGates);

          if (savedGateId) {
            const foundGate = evtGates.find((g) => g.id === savedGateId);
            if (foundGate) setAssignedGate(foundGate);
          }
        }
      }
    }

    loadSavedEventSelection();
  }, []);

  function selectOrganization(orgId: string) {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      setSelectedOrg(org);
      StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID, org.id);
      const filteredEvents = events.filter((e) => !e.organizationId || e.organizationId === org.id);
      if (filteredEvents.length > 0) {
        selectEvent(filteredEvents[0].id);
      }
    }
  }

  async function selectEvent(eventId: string) {
    setIsLoading(true);
    try {
      const evt = events.find((e) => e.id === eventId);
      if (evt) {
        setSelectedEvent(evt);
        await StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID, evt.id);

        const evtGates = DEFAULT_GATES[evt.id] || [
          {
            id: `gate-${evt.id}-main`,
            eventId: evt.id,
            name: "Main Entrance",
            mode: "entry",
            status: "open",
            activeScannersCount: 2,
            scansCount: evt.checkedInCount,
          },
        ];
        setGates(evtGates);
        setAssignedGate(evtGates[0] || null);

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
