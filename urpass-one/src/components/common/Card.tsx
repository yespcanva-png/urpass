import React from "react";
import { View, StyleSheet, type ViewStyle, type StyleProp, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "surface" | "bordered" | "highlight";
}

export function Card({ children, style, onPress, variant = "surface" }: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "bordered":
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.surfaceBorder,
        };
      case "highlight":
        return {
          backgroundColor: COLORS.surfaceLight,
          borderWidth: 1,
          borderColor: COLORS.brand,
        };
      default:
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.surfaceBorderSubtle,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.baseCard, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.baseCard, getVariantStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: 16,
    padding: 16,
  },
});
