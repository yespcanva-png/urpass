import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { OfflineBanner } from "./OfflineBanner";
import { Badge } from "./Badge";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showEventSwitcher?: boolean;
  onEventPress?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showEventSwitcher = true,
  onEventPress,
  rightAction,
}: HeaderProps) {
  const { user } = useAuth();
  const { selectedEvent, assignedGate } = useEvent();

  return (
    <View style={styles.wrapper}>
      <OfflineBanner />

      <View style={styles.header}>
        {showEventSwitcher && selectedEvent ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onEventPress}
            style={styles.eventBox}
          >
            <View style={styles.brandRow}>
              <Text style={styles.brandBadge}>URPASS</Text>
              <Text style={styles.eventOrg}>{user?.orgName || "Organization"}</Text>
            </View>
            <View style={styles.eventNameRow}>
              <Text style={styles.eventName} numberOfLines={1}>
                {selectedEvent.name}
              </Text>
              <Text style={styles.chevron}>▾</Text>
            </View>
            {assignedGate && (
              <View style={styles.gateRow}>
                <Badge
                  label={assignedGate.name}
                  variant={assignedGate.status === "open" ? "green" : "red"}
                  size="sm"
                />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.titleBox}>
            <View style={styles.brandRow}>
              <Text style={styles.brandBadge}>URPASS</Text>
            </View>
            {title && <Text style={styles.mainTitle}>{title}</Text>}
            {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
          </View>
        )}

        {rightAction && <View style={styles.rightActionBox}>{rightAction}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.brandAccent,
    letterSpacing: 1.5,
  },
  eventBox: {
    flex: 1,
    paddingRight: 12,
  },
  eventOrg: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  eventNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  chevron: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  gateRow: {
    marginTop: 5,
  },
  titleBox: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginTop: 1,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightActionBox: {
    marginLeft: 8,
  },
});
