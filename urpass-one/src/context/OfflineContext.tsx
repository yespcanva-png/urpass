import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { QueueService } from "../services/queueService";
import { SyncService, type SyncResult } from "../services/syncService";
import { useAuth } from "./AuthContext";
import { useEvent } from "./EventContext";
import { CONFIG } from "../constants/config";

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingQueueCount: number;
  lastSyncAt: string | null;
  syncNow: () => Promise<SyncResult>;
  toggleSimulatedOffline: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const { authToken } = useAuth();
  const { selectedEvent } = useEvent();

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const refreshPendingCount = useCallback(async () => {
    const count = await QueueService.getPendingCount(selectedEvent?.id);
    setPendingQueueCount(count);
  }, [selectedEvent?.id]);

  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 2000);
    return () => clearInterval(interval);
  }, [refreshPendingCount]);

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    if (!isOnline) {
      return {
        success: false,
        syncedScansCount: 0,
        remainingQueueCount: pendingQueueCount,
        error: "Device is offline. Connect to network to sync.",
      };
    }

    setIsSyncing(true);
    try {
      const res = await SyncService.flushOfflineQueue(authToken || undefined);
      if (selectedEvent) {
        await SyncService.downloadEventManifest(selectedEvent.id, authToken || undefined);
      }
      setLastSyncAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      await refreshPendingCount();
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, authToken, selectedEvent, pendingQueueCount, refreshPendingCount]);

  // Periodic Auto-Sync when online
  useEffect(() => {
    if (!isOnline) return;

    const syncInterval = setInterval(() => {
      if (pendingQueueCount > 0 && !isSyncing) {
        syncNow();
      }
    }, CONFIG.SYNC_INTERVAL_MS);

    return () => clearInterval(syncInterval);
  }, [isOnline, pendingQueueCount, isSyncing, syncNow]);

  function toggleSimulatedOffline() {
    setIsOnline((prev) => !prev);
  }

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingQueueCount,
        lastSyncAt,
        syncNow,
        toggleSimulatedOffline,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
}
