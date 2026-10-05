import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Zap, ZapOff, Camera, ShieldAlert } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

interface CameraViewfinderProps {
  isTorchOn?: boolean;
  onToggleTorch?: () => void;
  onBarcodeScanned?: (data: string) => void;
  children?: React.ReactNode;
}

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.72;

export function CameraViewfinder({
  isTorchOn = false,
  onToggleTorch,
  onBarcodeScanned,
  children,
}: CameraViewfinderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [lastScannedTime, setLastScannedTime] = useState(0);

  const isPermissionGranted = Boolean(permission?.granted);

  function handleBarcodeScanResult({ data }: { data: string }) {
    if (!data) return;
    const now = Date.now();
    // Throttle duplicate reads within 1200ms
    if (now - lastScannedTime > 1200) {
      setLastScannedTime(now);
      if (onBarcodeScanned) {
        onBarcodeScanned(data);
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Real Camera View or Permission Prompt */}
      {isPermissionGranted ? (
        <View style={StyleSheet.absoluteFill}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={isTorchOn}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "code128",
                "code39",
                "upc_a",
                "upc_e",
                "pdf417",
                "aztec",
                "datamatrix",
              ],
            }}
            onBarcodeScanned={handleBarcodeScanResult}
          />
        </View>
      ) : (
        <View style={styles.permissionFallback}>
          <View style={styles.permissionIconBadge}>
            <Camera size={28} color="#6D28D9" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtitle}>
            UrPass One uses your device camera to scan and validate attendee QR passes in real time.
          </Text>
          <TouchableOpacity
            style={styles.grantPermissionBtn}
            onPress={() => requestPermission()}
            activeOpacity={0.85}
          >
            <Text style={styles.grantPermissionText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Viewfinder Overlays & Reticle */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {/* Semi-transparent Darkened Viewfinder Corners & Target Reticle */}
        <View style={styles.reticleContainer} pointerEvents="none">
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.scanLaser} />
          </View>

          <Text style={styles.instructionText}>
            Align attendee QR pass within the frame
          </Text>
        </View>

        {/* Torch Toggle */}
        {onToggleTorch && isPermissionGranted && (
          <TouchableOpacity
            onPress={onToggleTorch}
            style={[styles.torchButton, isTorchOn && styles.torchButtonActive]}
            activeOpacity={0.8}
          >
            {isTorchOn ? (
              <Zap size={14} color="#FFFFFF" />
            ) : (
              <ZapOff size={14} color="#94A3B8" />
            )}
            <Text style={[styles.torchText, isTorchOn && styles.torchTextActive]}>
              {isTorchOn ? "Torch ON" : "Torch OFF"}
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
    backgroundColor: "#000000",
    justifyContent: "space-between",
  },
  permissionFallback: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  permissionIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FAF5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  permissionSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  grantPermissionBtn: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  grantPermissionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Overlays */
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  reticleContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    width: 28,
    height: 28,
    borderColor: "#6D28D9",
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scanLaser: {
    width: FRAME_SIZE - 24,
    height: 2,
    backgroundColor: "#6D28D9",
    opacity: 0.85,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  instructionText: {
    marginTop: 20,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  torchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  torchButtonActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#8B5CF6",
  },
  torchText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  torchTextActive: {
    color: "#FFFFFF",
  },
});
