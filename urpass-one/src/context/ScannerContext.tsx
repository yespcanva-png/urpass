import React, { createContext, useContext, useState, useRef } from "react";
import type {
  ScanDirection,
  ScanValidationResult,
  ScanAuditLog,
  OfflineScanRecord,
} from "../types";
import { ValidationService } from "../services/validationService";
import { OfflineDb } from "../services/offlineDb";
import { QueueService } from "../services/queueService";
import { HapticsService } from "../services/hapticsService";
import { useAuth } from "./AuthContext";
import { useEvent } from "./EventContext";
import { CONFIG } from "../constants/config";

interface ScannerContextType {
  isScanning: boolean;
  scanDirection: ScanDirection;
  lastScanResult: ScanValidationResult | null;
  isTorchOn: boolean;
  isProcessing: boolean;
  isOverrideModalOpen: boolean;
  setScanDirection: (dir: ScanDirection) => void;
  toggleTorch: () => void;
  processQRCode: (qrPayload: string) => Promise<ScanValidationResult>;
  performManualOverride: (reason: string) => Promise<ScanValidationResult | null>;
  openOverrideModal: () => void;
  closeOverrideModal: () => void;
  clearScanResult: () => void;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export function ScannerProvider({ children }: { children: React.ReactNode }) {
  const { user, deviceId } = useAuth();
  const { selectedEvent, assignedGate } = useEvent();

  const [isScanning] = useState(true);
  const [scanDirection, setScanDirection] = useState<ScanDirection>("in");
  const [lastScanResult, setLastScanResult] = useState<ScanValidationResult | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScannedPayloadRef = useRef<string | null>(null);

  function clearScanResult() {
    setLastScanResult(null);
    lastScannedPayloadRef.current = null;
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }

  function toggleTorch() {
    setIsTorchOn((prev) => !prev);
  }

  function openOverrideModal() {
    setIsOverrideModalOpen(true);
  }

  function closeOverrideModal() {
    setIsOverrideModalOpen(false);
  }

  async function processQRCode(qrPayload: string): Promise<ScanValidationResult> {
    if (isProcessing || !selectedEvent || !assignedGate) {
      return {
        status: "invalid_qr",
        color: "red",
        allowed: false,
        message: "Scanner Not Ready — Select an event and gate first",
        attendee: null,
        direction: scanDirection,
        previousScan: null,
        canOverride: false,
        timestamp: new Date().toISOString(),
      };
    }

    // Debounce exact same payload within 1.5s
    if (lastScannedPayloadRef.current === qrPayload && lastScanResult) {
      return lastScanResult;
    }

    setIsProcessing(true);
    lastScannedPayloadRef.current = qrPayload;

    try {
      const result = await ValidationService.validateScan(qrPayload, {
        eventId: selectedEvent.id,
        gate: assignedGate,
        direction: scanDirection,
        deviceId,
        deviceName: deviceId,
        userId: user?.id || "anonymous",
        userName: user?.name || "Scanner Staff",
      });

      // Trigger instant haptics and audio feedback
      HapticsService.triggerFeedback(result.color);

      // Record offline sync queue entry if scan was allowed
      if (result.allowed && result.attendee) {
        const queueRecord: OfflineScanRecord = {
          id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          qrPayload,
          attendeeId: result.attendee.id,
          eventId: selectedEvent.id,
          gateId: assignedGate.id,
          gateName: assignedGate.name,
          direction: result.direction,
          timestamp: result.timestamp,
          deviceId,
          scannerUserId: user?.id || "staff",
          scannerUserName: user?.name || "Staff",
          synced: false,
        };
        await QueueService.enqueue(queueRecord);
      }

      // Record comprehensive scan audit log
      const auditLog: ScanAuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId: selectedEvent.id,
        gateId: assignedGate.id,
        gateName: assignedGate.name,
        deviceId,
        deviceName: deviceId,
        userId: user?.id || "staff",
        userName: user?.name || "Staff",
        userRole: user?.role || "gate_staff",
        qrPayload,
        attendeeId: result.attendee?.id,
        attendeeName: result.attendee?.name,
        passType: result.attendee?.passType,
        resultStatus: result.status,
        feedbackColor: result.color,
        direction: result.direction,
        timestamp: result.timestamp,
        isOffline: false,
        isOverride: false,
      };
      await OfflineDb.appendAuditLog(auditLog);

      setLastScanResult(result);

      // Auto-clear banner after duration
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setLastScanResult(null);
        lastScannedPayloadRef.current = null;
      }, CONFIG.AUTO_RESET_SCAN_RESULT_MS);

      return result;
    } finally {
      setIsProcessing(false);
    }
  }

  async function performManualOverride(reason: string): Promise<ScanValidationResult | null> {
    if (!lastScanResult?.attendee || !selectedEvent || !assignedGate) {
      return null;
    }

    const attendee = lastScanResult.attendee;
    const timestamp = new Date().toISOString();

    const overrideResult = await ValidationService.validateScan(attendee.passToken || attendee.id, {
      eventId: selectedEvent.id,
      gate: assignedGate,
      direction: scanDirection,
      override: true,
      overrideReason: reason,
      overrideBy: user?.name || "Manager Override",
      deviceId,
      deviceName: deviceId,
      userId: user?.id || "manager",
      userName: user?.name || "Manager",
    });

    HapticsService.triggerFeedback("green");

    // Record audit log with override flag
    const auditLog: ScanAuditLog = {
      id: `audit_ovr_${Date.now()}`,
      eventId: selectedEvent.id,
      gateId: assignedGate.id,
      gateName: assignedGate.name,
      deviceId,
      deviceName: deviceId,
      userId: user?.id || "manager",
      userName: user?.name || "Manager",
      userRole: user?.role || "event_manager",
      qrPayload: attendee.passToken || attendee.id,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      passType: attendee.passType,
      resultStatus: overrideResult.status,
      feedbackColor: "green",
      direction: overrideResult.direction,
      timestamp,
      isOffline: false,
      isOverride: true,
      overrideReason: reason,
      overrideBy: user?.name || "Manager",
    };
    await OfflineDb.appendAuditLog(auditLog);

    setLastScanResult(overrideResult);
    closeOverrideModal();
    return overrideResult;
  }

  return (
    <ScannerContext.Provider
      value={{
        isScanning,
        scanDirection,
        lastScanResult,
        isTorchOn,
        isProcessing,
        isOverrideModalOpen,
        setScanDirection,
        toggleTorch,
        processQRCode,
        performManualOverride,
        openOverrideModal,
        closeOverrideModal,
        clearScanResult,
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
}

export function useScanner() {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error("useScanner must be used within a ScannerProvider");
  }
  return context;
}
