import React from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import { Card } from "./Card";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  progressPercent?: number;
  style?: ViewStyle;
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = COLORS.white,
  progressPercent,
  style,
}: MetricCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {icon && <View style={styles.iconBox}>{icon}</View>}
      </View>

      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {progressPercent !== undefined && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor:
                  progressPercent >= 90
                    ? COLORS.red
                    : progressPercent >= 80
                    ? COLORS.amber
                    : COLORS.green,
              },
            ]}
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorderSubtle,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  iconBox: {
    opacity: 0.85,
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
