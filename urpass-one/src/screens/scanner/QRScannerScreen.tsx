import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useScanner } from "../../context/ScannerContext";
import { useEvent } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { CameraViewfinder } from "../../components/scanner/CameraViewfinder";
import { ScanFeedbackBanner } from "../../components/scanner/ScanFeedbackBanner";
import { ManualOverrideModal } from "./ManualOverrideModal";
import { Badge } from "../../components/common/Badge";
import type { ScanDirection } from "../../types";

const TEST_QR_PAYLOADS = [
  { label: "Valid VIP Pass", payload: "UP_VIP_001_VALID", desc: "Arjun Mehta (VIP)" },
  { label: "Valid Delegate", payload: "UP_DEL_002_VALID", desc: "Neha Gupta (Delegate)" },
  { label: "Duplicate Pass (Already Inside)", payload: "UP_DUP_003_ALREADY_IN", desc: "Trigger duplicate protection" },
  { label: "Cancelled Ticket", payload: "UP_CANCELLED_004", desc: "Revoked registration" },
  { label: "Wrong Gate Pass", payload: "UP_WRONG_GATE_005", desc: "Non-whitelisted zone" },
  { label: "Expired Pass", payload: "UP_EXPIRED_006", desc: "Out of validity period" },
];

export function QRScannerScreen({ navigation }: { navigation?: any }) {
  const {
    scanDirection,
    setScanDirection,
    lastScanResult,
    isTorchOn,
    toggleTorch,
    processQRCode,
    openOverrideModal,
    clearScanResult,
  } = useScanner();

  const { assignedGate, gates, assignGate, selectedEvent } = useEvent();
  const { user } = useAuth();
  const [showSimPanel, setShowSimPanel] = useState(false);

  const canOverride =
    user?.role === "super_admin" ||
    user?.role === "org_admin" ||
    user?.role === "event_manager" ||
    user?.role === "gate_manager";

  function handleScanTestPayload(payload: string) {
    processQRCode(payload);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Scanner Control Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {/* Gate Indicator */}
        <View style={styles.gateBadgeContainer}>
          <Text style={styles.gateBadgeLabel}>ACTIVE GATE</Text>
          <Text style={styles.gateBadgeName} numberOfLines={1}>
            {assignedGate?.name || "Main Gate"}
          </Text>
        </View>

        {/* Direction Switcher (IN / OUT) */}
        <View style={styles.directionToggle}>
          <TouchableOpacity
            style={[
              styles.directionBtn,
              scanDirection === "in" && styles.directionBtnActiveIn,
            ]}
            onPress={() => setScanDirection("in")}
          >
            <Text
              style={[
                styles.directionBtnText,
                scanDirection === "in" && styles.directionBtnTextActive,
              ]}
            >
              ENTRY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.directionBtn,
              scanDirection === "out" && styles.directionBtnActiveOut,
            ]}
            onPress={() => setScanDirection("out")}
          >
            <Text
              style={[
                styles.directionBtnText,
                scanDirection === "out" && styles.directionBtnTextActive,
              ]}
            >
              EXIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Viewfinder Reticle */}
      <View style={styles.viewfinderContainer}>
        <CameraViewfinder
          isTorchOn={isTorchOn}
          onToggleTorch={toggleTorch}
        >
          {/* Instant Scan Feedback Banner */}
          <View style={styles.bannerWrapper}>
            <ScanFeedbackBanner
              result={lastScanResult}
              canOverride={canOverride}
              onOverridePress={openOverrideModal}
              onViewProfilePress={() => {
                if (lastScanResult?.attendee) {
                  navigation?.navigate("AttendeeProfile", {
                    attendeeId: lastScanResult.attendee.id,
                  });
                }
              }}
            />
          </View>
        </CameraViewfinder>
      </View>

      {/* Quick Access Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomActionBtn}
          onPress={() => navigation?.navigate("AttendeeSearch")}
        >
          <Text style={styles.bottomActionIcon}>🔍</Text>
          <Text style={styles.bottomActionText}>Manual Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomActionBtn, showSimPanel && styles.bottomActionBtnActive]}
          onPress={() => setShowSimPanel((prev) => !prev)}
        >
          <Text style={styles.bottomActionIcon}>🧪</Text>
          <Text style={styles.bottomActionText}>Test QR Passes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomActionBtn}
          onPress={() => navigation?.navigate("ScanAuditLog")}
        >
          <Text style={styles.bottomActionIcon}>📋</Text>
          <Text style={styles.bottomActionText}>Audit Trail</Text>
        </TouchableOpacity>
      </View>

      {/* Test Simulation Panel */}
      {showSimPanel && (
        <View style={styles.simPanel}>
          <View style={styles.simPanelHeader}>
            <Text style={styles.simPanelTitle}>FIELD QR PASS SIMULATOR</Text>
            <TouchableOpacity onPress={() => setShowSimPanel(false)}>
              <Text style={styles.simPanelClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.simScroll}>
            {TEST_QR_PAYLOADS.map((test) => (
              <TouchableOpacity
                key={test.payload}
                style={styles.simCard}
                onPress={() => handleScanTestPayload(test.payload)}
              >
                <Text style={styles.simCardLabel}>{test.label}</Text>
                <Text style={styles.simCardDesc}>{test.desc}</Text>
                <Text style={styles.simCardToken}>{test.payload}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Manual Override Supervisor Modal */}
      <ManualOverrideModal navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  gateBadgeContainer: {
    alignItems: "center",
    maxWidth: 140,
  },
  gateBadgeLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  gateBadgeName: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  directionToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  directionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  directionBtnActiveIn: {
    backgroundColor: COLORS.green,
  },
  directionBtnActiveOut: {
    backgroundColor: COLORS.blue,
  },
  directionBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
  },
  directionBtnTextActive: {
    color: COLORS.white,
  },
  viewfinderContainer: {
    flex: 1,
  },
  bannerWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surfaceDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  bottomActionBtn: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bottomActionBtnActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  bottomActionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  bottomActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  simPanel: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    padding: 12,
  },
  simPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  simPanelTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  simPanelClose: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    paddingHorizontal: 6,
  },
  simScroll: {
    gap: 8,
  },
  simCard: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    minWidth: 160,
  },
  simCardLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  simCardDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  simCardToken: {
    fontSize: 9,
    color: COLORS.brand,
    fontFamily: "monospace",
    marginTop: 4,
  },
});
