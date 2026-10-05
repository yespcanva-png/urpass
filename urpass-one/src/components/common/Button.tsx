import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { COLORS } from "../../constants/colors";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost" | "amber";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case "primary":
        return {
          button: { backgroundColor: COLORS.white },
          text: { color: COLORS.textDark, fontWeight: "700" },
        };
      case "secondary":
        return {
          button: { backgroundColor: COLORS.surfaceLight, borderWidth: 1, borderColor: COLORS.surfaceBorder },
          text: { color: COLORS.textPrimary, fontWeight: "600" },
        };
      case "danger":
        return {
          button: { backgroundColor: COLORS.red },
          text: { color: COLORS.white, fontWeight: "700" },
        };
      case "success":
        return {
          button: { backgroundColor: COLORS.green },
          text: { color: COLORS.white, fontWeight: "700" },
        };
      case "amber":
        return {
          button: { backgroundColor: COLORS.amber },
          text: { color: COLORS.textDark, fontWeight: "700" },
        };
      case "ghost":
        return {
          button: { backgroundColor: "transparent" },
          text: { color: COLORS.textSecondary, fontWeight: "600" },
        };
      default:
        return {
          button: { backgroundColor: COLORS.white },
          text: { color: COLORS.textDark, fontWeight: "700" },
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case "sm":
        return {
          button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
          text: { fontSize: 12 },
        };
      case "lg":
        return {
          button: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14 },
          text: { fontSize: 16 },
        };
      default:
        return {
          button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
          text: { fontSize: 14 },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        vStyles.button,
        sStyles.button,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? COLORS.textDark : COLORS.white}
        />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text style={[styles.baseText, vStyles.text, sStyles.text, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  baseText: {
    letterSpacing: -0.2,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
