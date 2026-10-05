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
import { Search, FlaskConical, ClipboardList } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useScanner } from "../../context/ScannerContext";
import { useEvent } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { CameraViewfinder } from "../../components/scanner/CameraViewfinder";
import { ScanFeedbackBanner } from "../../components/scanner/ScanFeedbackBanner";
import { ManualOverrideModal } from "./ManualOverrideModal";
import { Badge } from "../../components/common/Badge";

const TEST_QR_PAYLOADS = [
  { label: "Valid VIP Pass", payload: "UP_VIP_001_VALID", desc: "Arjun Mehta (VIP)" },
  { label: "Valid Delegate", payload: "UP_DEL_002_VALID", desc: "Neha Gupta (Delegate)" },
  { label: "Duplicate Pass (Already Inside)", payload: "UP_DUP_003_ALREADY_IN", desc: "Trigger duplicate alert" },
  { label: "Cancelled Ticket", payload: "UP_CANCELLED_004", desc: "Revoked pass" },
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
  } = useScanner();

  const { assignedGate } = useEvent();
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
      <StatusBar barStyle="dark-content" />

      {/* Top Scanner Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {/* Gate Badge */}
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
              IN
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
              OUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Viewfinder Reticle */}
      <View style={styles.viewfinderContainer}>
        <CameraViewfinder
          isTorchOn={isTorchOn}
          onToggleTorch={toggleTorch}
          onBarcodeScanned={(code) => processQRCode(code)}
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

      {/* Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomActionBtn}
          onPress={() => navigation?.navigate("AttendeeSearch")}
          activeOpacity={0.8}
        >
          <Search size={18} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Lookup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomActionBtn, showSimPanel && styles.bottomActionBtnActive]}
          onPress={() => setShowSimPanel((prev) => !prev)}
          activeOpacity={0.8}
        >
          <FlaskConical size={18} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Test QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomActionBtn}
          onPress={() => navigation?.navigate("ScanAuditLog")}
          activeOpacity={0.8}
        >
          <ClipboardList size={18} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Audit</Text>
        </TouchableOpacity>
      </View>

      {/* Test QR Simulation Panel */}
      {showSimPanel && (
        <View style={styles.simPanel}>
          <View style={styles.simPanelHeader}>
            <Text style={styles.simPanelTitle}>FIELD PASS SIMULATOR (TAP TO SCAN)</Text>
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
                <Text style={styles.simCardPayload} numberOfLines={1}>
                  {test.payload}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Supervisor Override Modal */}
      <ManualOverrideModal />
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
    zIndex: 10,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
  },
  backBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  gateBadgeContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  gateBadgeLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  gateBadgeName: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  directionToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    padding: 2,
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
    position: "relative",
  },
  bannerWrapper: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bottomActionBtn: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bottomActionBtnActive: {
    backgroundColor: COLORS.brandLight,
  },
  bottomActionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  bottomActionText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  simPanel: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    padding: 12,
  },
  simPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  simPanelTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  simPanelClose: {
    fontSize: 14,
    color: COLORS.textMuted,
    paddingHorizontal: 6,
  },
  simScroll: {
    flexDirection: "row",
  },
  simCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    width: 140,
  },
  simCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  simCardDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  simCardPayload: {
    fontSize: 8,
    fontFamily: "monospace",
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
