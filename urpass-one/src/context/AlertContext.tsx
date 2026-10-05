import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { OperationalAlert, AlertSeverity } from "../types";
import { OfflineDb } from "../services/offlineDb";
import { useEvent } from "./EventContext";

interface AlertContextType {
  alerts: OperationalAlert[];
  unreadAlertsCount: number;
  dismissAlert: (alertId: string) => void;
  triggerAlert: (type: OperationalAlert["type"], severity: AlertSeverity, title: string, message: string) => Promise<void>;
  clearAllAlerts: () => void;
}

const DEFAULT_ALERTS: OperationalAlert[] = [
  {
    id: "alert-cap-90",
    eventId: "evt-tech-summit-2026",
    type: "capacity_warning",
    severity: "warning",
    title: "Venue Capacity at 90%",
    message: "Currently 2,980 of 3,500 maximum inside venue. Prepare for entry rebalancing.",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-dup-spike",
    eventId: "evt-tech-summit-2026",
    type: "duplicate_spike",
    severity: "warning",
    title: "Duplicate Scan Spike — Gate C",
    message: "4 duplicate pass attempts detected in the last 5 minutes at Exhibition Pavilion.",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    acknowledged: false,
  },
];

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { selectedEvent } = useEvent();
  const [alerts, setAlerts] = useState<OperationalAlert[]>(DEFAULT_ALERTS);

  const loadAlerts = useCallback(async () => {
    if (!selectedEvent) return;
    const local = await OfflineDb.getAlerts(selectedEvent.id);
    if (local.length > 0) {
      setAlerts(local);
    }
  }, [selectedEvent]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  async function triggerAlert(
    type: OperationalAlert["type"],
    severity: AlertSeverity,
    title: string,
    message: string
  ) {
    if (!selectedEvent) return;

    const newAlert: OperationalAlert = {
      id: `alt_${Date.now()}`,
      eventId: selectedEvent.id,
      type,
      severity,
      title,
      message,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    await OfflineDb.appendAlert(newAlert);
  }

  function dismissAlert(alertId: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }

  function clearAllAlerts() {
    setAlerts([]);
  }

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadAlertsCount,
        dismissAlert,
        triggerAlert,
        clearAllAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
}
