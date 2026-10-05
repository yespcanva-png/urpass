import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/common/Header";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import type { ScannerDeviceInfo } from "../../types";

const MOCK_DEVICES: ScannerDeviceInfo[] = [
  {
    deviceId: "OP-DEV-01",
    deviceName: "Gate A Primary (iPhone 15)",
    model: "iPhone 15 Pro",
    platform: "ios",
    appVersion: "1.0.0 (UrPass One)",
    batteryLevel: 94,
    isOnline: true,
    assignedGateId: "gate-a-main",
    assignedGateName: "Gate A – Main Concourse",
    assignedUserId: "usr-demo-ops",
    assignedUserName: "Alex Gate Supervisor",
    lastSyncAt: "Just now",
    lastActivityAt: "10:42 AM",
    isRevoked: false,
  },
  {
    deviceId: "OP-DEV-02",
    deviceName: "Gate A Scanner #2 (Pixel 8)",
    model: "Google Pixel 8",
    platform: "android",
    appVersion: "1.0.0 (UrPass One)",
    batteryLevel: 78,
    isOnline: true,
    assignedGateId: "gate-a-main",
    assignedGateName: "Gate A – Main Concourse",
    assignedUserName: "Kavita Staff",
    lastSyncAt: "1 min ago",
    lastActivityAt: "10:40 AM",
    isRevoked: false,
  },
  {
    deviceId: "OP-DEV-03",
    deviceName: "Gate B VIP Desk (iPad Air)",
    model: "iPad Air 5th Gen",
    platform: "ios",
    appVersion: "1.0.0 (UrPass One)",
    batteryLevel: 62,
    isOnline: true,
    assignedGateId: "gate-b-vip",
    assignedGateName: "Gate B – VIP & Keynote Speakers",
    assignedUserName: "Siddharth VIP Host",
    lastSyncAt: "30s ago",
    lastActivityAt: "10:41 AM",
    isRevoked: false,
  },
  {
    deviceId: "OP-DEV-04",
    deviceName: "Gate D Crew Scanner (Galaxy S23)",
    model: "Samsung Galaxy S23",
    platform: "android",
    appVersion: "1.0.0 (UrPass One)",
    batteryLevel: 19,
    isOnline: false,
    assignedGateId: "gate-d-staff",
    assignedGateName: "Gate D – Staff & Crew Loading",
    assignedUserName: "Ravi Crew Manager",
    lastSyncAt: "18 mins ago",
    lastActivityAt: "10:24 AM",
    isRevoked: false,
  },
];

export function DeviceManagementScreen({ navigation }: { navigation?: any }) {
  const { deviceId: currentDeviceId } = useAuth();
  const [devices, setDevices] = useState<ScannerDeviceInfo[]>(MOCK_DEVICES);

  function handleRevokeDevice(deviceId: string) {
    Alert.alert(
      "Revoke Scanner Device",
      `Are you sure you want to revoke access for ${deviceId}? This device will be immediately logged out and disabled from scanning.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke Device",
          style: "destructive",
          onPress: () => {
            setDevices((prev) =>
              prev.map((d) => (d.deviceId === deviceId ? { ...d, isRevoked: true } : d))
            );
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Scanner Hardware & Devices"
        subtitle="Manage active mobile scanner fleet & pairing"
        showEventSwitcher={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Device Fleet Status Bar */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>SCANNER HARDWARE FLEET</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNum}>{devices.filter((d) => d.isOnline).length}</Text>
              <Text style={styles.summaryLbl}>Online Now</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryNum}>{devices.length}</Text>
              <Text style={styles.summaryLbl}>Paired Devices</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryNum, { color: COLORS.green }]}>100%</Text>
              <Text style={styles.summaryLbl}>Sync Health</Text>
            </View>
          </View>
        </Card>

        {/* Devices List */}
        <View style={styles.devicesList}>
          {devices.map((dev) => {
            const isThisDevice = dev.deviceId === currentDeviceId;
            const isLowBattery = dev.batteryLevel !== undefined && dev.batteryLevel < 25;

            return (
              <Card key={dev.deviceId} style={styles.deviceCard}>
                <View style={styles.deviceCardTop}>
                  <View style={styles.deviceNameGroup}>
                    <Text style={styles.deviceName}>{dev.deviceName}</Text>
                    <Text style={styles.deviceModel}>
                      {dev.model} • {dev.platform.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.statusBadges}>
                    {isThisDevice && (
                      <Badge label="This Device" variant="brand" size="sm" />
                    )}
                    <Badge
                      label={dev.isRevoked ? "Revoked" : dev.isOnline ? "Online" : "Offline"}
                      variant={dev.isRevoked ? "red" : dev.isOnline ? "green" : "neutral"}
                      size="sm"
                    />
                  </View>
                </View>

                {/* Battery & Assignment Meta */}
                <View style={styles.metaRow}>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Assigned Gate</Text>
                    <Text style={styles.metaValue}>{dev.assignedGateName || "Unassigned"}</Text>
                  </View>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Active Staff</Text>
                    <Text style={styles.metaValue}>{dev.assignedUserName || "None"}</Text>
                  </View>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Battery</Text>
                    <Text
                      style={[
                        styles.metaValue,
                        isLowBattery && { color: COLORS.red, fontWeight: "900" },
                      ]}
                    >
                      {dev.batteryLevel !== undefined ? `${dev.batteryLevel}%` : "—"}
                    </Text>
                  </View>
                </View>

                {/* Device Actions */}
                <View style={styles.actionsRow}>
                  <Text style={styles.lastSyncText}>Last Active: {dev.lastActivityAt}</Text>
                  {!dev.isRevoked && !isThisDevice && (
                    <TouchableOpacity
                      onPress={() => handleRevokeDevice(dev.deviceId)}
                      style={styles.revokeBtn}
                    >
                      <Text style={styles.revokeText}>Revoke Access</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCol: {
    flex: 1,
  },
  summaryNum: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  summaryLbl: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  devicesList: {
    gap: 12,
  },
  deviceCard: {
    padding: 16,
  },
  deviceCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  deviceNameGroup: {
    flex: 1,
    paddingRight: 8,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  deviceModel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadges: {
    alignItems: "flex-end",
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  lastSyncText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  revokeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.redLight,
  },
  revokeText: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: "700",
  },
});
