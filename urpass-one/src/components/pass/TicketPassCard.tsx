import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import type { Attendee } from "../../types";

interface TicketPassCardProps {
  attendee?: Partial<Attendee> | null;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  style?: ViewStyle;
}

export function TicketPassCard({
  attendee,
  eventName = "Tech Workshop 2026",
  eventDate = "29 AUG 2026",
  venue = "CHENNAI",
  style,
}: TicketPassCardProps) {
  const isInside = attendee?.presenceStatus === "inside";
  const passTypeLabel = (attendee?.passType || "PARTICIPANT").toUpperCase();
  const attendeeName = attendee?.name || "Attendee Name";

  return (
    <View style={[styles.container, style]}>
      {/* Ticket Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.brandTitle}>URPASS</Text>
        <View
          style={[
            styles.statusPill,
            isInside ? styles.statusPillInside : styles.statusPillValid,
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              isInside ? styles.statusTextInside : styles.statusTextValid,
            ]}
          >
            {isInside ? "CHECKED IN" : "VALID PASS"}
          </Text>
        </View>
      </View>

      {/* Ticket Body Content */}
      <View style={styles.bodyContent}>
        <Text style={styles.labelMuted}>EVENT</Text>
        <Text style={styles.eventName} numberOfLines={1}>
          {eventName}
        </Text>

        {/* Notched Divider Row */}
        <View style={styles.notchDividerRow}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.notchRight} />
        </View>

        <Text style={styles.labelMuted}>ATTENDEE</Text>
        <Text style={styles.attendeeName} numberOfLines={1}>
          {attendeeName}
        </Text>

        {/* Category Pill */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{passTypeLabel}</Text>
        </View>

        {/* Mock QR Pattern View */}
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            {/* Top Left Finder */}
            <View style={[styles.qrFinder, styles.finderTL]}>
              <View style={styles.finderInner} />
            </View>
            {/* Top Right Finder */}
            <View style={[styles.qrFinder, styles.finderTR]}>
              <View style={styles.finderInner} />
            </View>
            {/* Bottom Left Finder */}
            <View style={[styles.qrFinder, styles.finderBL]}>
              <View style={styles.finderInner} />
            </View>

            {/* Matrix Decorative Dots */}
            <View style={styles.matrixGrid}>
              <View style={styles.matrixDot} />
              <View style={styles.matrixDot} />
              <View style={styles.matrixDot} />
              <View style={styles.matrixDot} />
              <View style={styles.matrixDot} />
            </View>
          </View>
          <Text style={styles.scanLabel}>SCAN TO VERIFY</Text>
        </View>

        {/* Ticket Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{eventDate}</Text>
          <Text style={styles.footerText}>{venue.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.ticketBorder,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  headerBar: {
    backgroundColor: COLORS.ticketHeaderBg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    color: "rgba(255, 255, 255, 0.9)",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillValid: {
    backgroundColor: "rgba(6, 78, 59, 0.6)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  statusPillInside: {
    backgroundColor: "rgba(30, 58, 138, 0.6)",
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  statusTextValid: {
    color: "#6EE7B7",
  },
  statusTextInside: {
    color: "#93C5FD",
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  labelMuted: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLORS.textDarkMuted,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  eventName: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  notchDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -20,
    marginBottom: 14,
  },
  notchLeft: {
    width: 14,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: COLORS.background,
    borderRightWidth: 1,
    borderRightColor: COLORS.ticketBorder,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderStyle: "dashed",
    marginHorizontal: 4,
  },
  notchRight: {
    width: 14,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: COLORS.background,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.ticketBorder,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  categoryPill: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#3F3F46",
    letterSpacing: 0.8,
  },
  qrContainer: {
    marginTop: 18,
    alignItems: "center",
  },
  qrBox: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  qrFinder: {
    position: "absolute",
    width: 26,
    height: 26,
    borderWidth: 3,
    borderColor: COLORS.textDark,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  finderInner: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.textDark,
    borderRadius: 2,
  },
  finderTL: {
    top: 6,
    left: 6,
  },
  finderTR: {
    top: 6,
    right: 6,
  },
  finderBL: {
    bottom: 6,
    left: 6,
  },
  matrixGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 32,
    height: 32,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  matrixDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.textDark,
    borderRadius: 1,
  },
  scanLabel: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.textDarkMuted,
    fontFamily: "monospace",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
  },
  footerText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textDarkMuted,
    letterSpacing: 0.5,
  },
});
