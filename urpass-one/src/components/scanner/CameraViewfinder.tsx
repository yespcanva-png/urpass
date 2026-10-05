import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { COLORS } from "../../constants/colors";

interface CameraViewfinderProps {
  isTorchOn?: boolean;
  onToggleTorch?: () => void;
  children?: React.ReactNode;
}

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.72;

export function CameraViewfinder({
  isTorchOn = false,
  onToggleTorch,
  children,
}: CameraViewfinderProps) {
  return (
    <View style={styles.container}>
      {/* Background Simulating Camera Stream */}
      <View style={styles.cameraBackground}>
        {/* Target Reticle Frame */}
        <View style={styles.reticle}>
          {/* Top-Left Corner */}
          <View style={[styles.corner, styles.cornerTL]} />
          {/* Top-Right Corner */}
          <View style={[styles.corner, styles.cornerTR]} />
          {/* Bottom-Left Corner */}
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Bottom-Right Corner */}
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Laser Scanning Bar */}
          <View style={styles.scanLaser} />
        </View>

        <Text style={styles.instructionText}>
          Point camera at attendee QR pass or ticket
        </Text>

        {onToggleTorch && (
          <TouchableOpacity
            onPress={onToggleTorch}
            style={[styles.torchButton, isTorchOn && styles.torchButtonActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.torchText}>
              {isTorchOn ? "⚡ Torch ON" : "💡 Torch OFF"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  cameraBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050507",
  },
  reticle: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: COLORS.brand,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLaser: {
    width: FRAME_SIZE - 20,
    height: 2,
    backgroundColor: COLORS.brand,
    opacity: 0.8,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  instructionText: {
    marginTop: 24,
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  torchButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  torchButtonActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  torchText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
