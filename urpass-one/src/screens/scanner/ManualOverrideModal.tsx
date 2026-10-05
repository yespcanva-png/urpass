import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useScanner } from "../../context/ScannerContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";

const OVERRIDE_REASONS = [
  "Supervisor Discretion",
  "Physical ID Card Verified",
  "VIP / Speaker Escort",
  "QR Glitch / Screen Reflection",
  "Re-Entry Authorized",
  "Emergency Access",
];

interface ManualOverrideModalProps {
  navigation?: any;
}

export function ManualOverrideModal({ navigation }: ManualOverrideModalProps) {
  const { isOverrideModalOpen, closeOverrideModal, lastScanResult, performManualOverride } =
    useScanner();
  const { user } = useAuth();

  const [selectedReason, setSelectedReason] = useState(OVERRIDE_REASONS[0]);
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOverrideModalOpen || !lastScanResult) return null;

  const attendee = lastScanResult.attendee;

  async function handleConfirmOverride() {
    setIsSubmitting(true);
    try {
      const fullReason = customNotes
        ? `${selectedReason}: ${customNotes}`
        : selectedReason;

      const result = await performManualOverride(fullReason);
      if (result && result.allowed) {
        Alert.alert("Override Approved", `Entry granted to ${attendee?.name || "Attendee"}. Audit log recorded.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      visible={isOverrideModalOpen}
      transparent
      animationType="slide"
      onRequestClose={closeOverrideModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>⚡ Supervisor Manual Override</Text>
              <Text style={styles.modalSub}>
                Authorized by: {user?.name || "Operations Manager"} ({user?.role || "Manager"})
              </Text>
            </View>
            <TouchableOpacity onPress={closeOverrideModal} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll}>
            {/* Attendee Info Card */}
            <View style={styles.attendeeCard}>
              <View style={styles.attendeeHeader}>
                <Text style={styles.attendeeName}>{attendee?.name || "Unidentified Pass"}</Text>
                {attendee && <Badge label={attendee.passType} variant="amber" size="sm" />}
              </View>
              <Text style={styles.attendeeMeta}>
                Ticket: {attendee?.ticketNumber || "N/A"} • ID: {attendee?.id || "N/A"}
              </Text>
              <View style={styles.rejectionBox}>
                <Text style={styles.rejectionLabel}>Scan Denied Reason:</Text>
                <Text style={styles.rejectionText}>
                  {lastScanResult.rejectionReason || lastScanResult.message}
                </Text>
              </View>
            </View>

            {/* Select Reason */}
            <Text style={styles.sectionLabel}>MANDATORY OVERRIDE JUSTIFICATION</Text>
            <View style={styles.reasonsList}>
              {OVERRIDE_REASONS.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                    onPress={() => setSelectedReason(r)}
                  >
                    <Text
                      style={[
                        styles.reasonOptionText,
                        isSelected && styles.reasonOptionTextSelected,
                      ]}
                    >
                      {isSelected ? "● " : "○ "}
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Notes */}
            <Text style={styles.sectionLabel}>ADDITIONAL NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Verified with College ID card & registration receipt"
              placeholderTextColor={COLORS.textMuted}
              value={customNotes}
              onChangeText={setCustomNotes}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.auditDisclaimer}>
              🔒 This override action is permanently recorded in the event security audit log
              with your staff credentials, timestamp, and device identifier.
            </Text>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={closeOverrideModal} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <Button
              title="Confirm & Allow Entry"
              onPress={handleConfirmOverride}
              loading={isSubmitting}
              variant="amber"
              style={styles.confirmBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.amber,
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: "700",
  },
  bodyScroll: {
    padding: 16,
  },
  attendeeCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 16,
  },
  attendeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  attendeeMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rejectionBox: {
    backgroundColor: COLORS.redLight,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
  },
  rejectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.red,
    textTransform: "uppercase",
  },
  rejectionText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  reasonsList: {
    gap: 6,
    marginBottom: 14,
  },
  reasonOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  reasonOptionSelected: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: COLORS.amber,
  },
  reasonOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  reasonOptionTextSelected: {
    color: COLORS.amber,
    fontWeight: "700",
  },
  notesInput: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    padding: 10,
    color: COLORS.textPrimary,
    fontSize: 12,
    marginBottom: 12,
  },
  auditDisclaimer: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
    backgroundColor: COLORS.surface,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: 13,
  },
  confirmBtn: {
    flex: 2,
  },
});
