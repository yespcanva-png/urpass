import React from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";

export type BadgeVariant =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "neutral"
  | "brand";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  style?: ViewStyle;
}

export function Badge({ label, variant = "neutral", size = "md", style }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "green":
        return { bg: COLORS.greenLight, text: COLORS.green, border: COLORS.greenBorder };
      case "red":
        return { bg: COLORS.redLight, text: COLORS.red, border: COLORS.redBorder };
      case "amber":
        return { bg: COLORS.amberLight, text: COLORS.amber, border: COLORS.amberBorder };
      case "blue":
        return { bg: COLORS.blueLight, text: COLORS.blue, border: COLORS.blue };
      case "brand":
        return { bg: COLORS.brandLight, text: COLORS.brandDark, border: COLORS.brand };
      default:
        return { bg: COLORS.surfaceLight, text: COLORS.textSecondary, border: COLORS.surfaceBorder };
    }
  };

  const colors = getColors();
  const isSm = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 8,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSm ? 10 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
