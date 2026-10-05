import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";
import type { ScanValidationResult } from "../../types";

interface ScanFeedbackBannerProps {
  result: ScanValidationResult | null;
  onOverridePress?: () => void;
  onViewProfilePress?: () => void;
  canOverride?: boolean;
}

export function ScanFeedbackBanner({
  result,
  onOverridePress,
  onViewProfilePress,
  canOverride = false,
}: ScanFeedbackBannerProps) {
  if (!result) return null;

  const getBackgroundColor = () => {
    switch (result.color) {
      case "green":
        return COLORS.green;
      case "red":
        return COLORS.red;
      case "amber":
        return COLORS.amber;
      default:
        return COLORS.surface;
    }
  };

  const isLightText = result.color === "green" || result.color === "red";
  const textColor = isLightText ? COLORS.white : COLORS.textDark;

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.topRow}>
        <View style={styles.statusBox}>
          <Text style={[styles.statusTitle, { color: textColor }]}>
            {result.message}
          </Text>
          {result.attendee && (
            <Text style={[styles.attendeeName, { color: textColor }]}>
              {result.attendee.name} • {result.attendee.passType.toUpperCase()}
            </Text>
          )}
        </View>

        {result.attendee && onViewProfilePress && (
          <TouchableOpacity
            onPress={onViewProfilePress}
            style={[
              styles.profileButton,
              { backgroundColor: isLightText ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" },
            ]}
          >
            <Text style={[styles.profileButtonText, { color: textColor }]}>Details</Text>
          </TouchableOpacity>
        )}
      </View>

      {result.rejectionReason && (
        <Text style={[styles.reasonText, { color: textColor }]}>
          {result.rejectionReason}
        </Text>
      )}

      {result.previousScan && (
        <View style={[styles.previousScanBox, { backgroundColor: isLightText ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)" }]}>
          <Text style={[styles.previousScanText, { color: textColor }]}>
            Previous: {result.previousScan.action} at {result.previousScan.gateName} (
            {new Date(result.previousScan.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            )
          </Text>
        </View>
      )}

      {/* Manual Override Action for Denied Scans */}
      {!result.allowed && canOverride && onOverridePress && (
        <TouchableOpacity
          onPress={onOverridePress}
          style={styles.overrideButton}
          activeOpacity={0.8}
        >
          <Text style={styles.overrideButtonText}>Manager Override</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  statusBox: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  attendeeName: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    opacity: 0.95,
  },
  profileButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  profileButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },
  reasonText: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.9,
  },
  previousScanBox: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  previousScanText: {
    fontSize: 11,
    fontWeight: "600",
  },
  overrideButton: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  overrideButtonText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: "800",
  },
});
