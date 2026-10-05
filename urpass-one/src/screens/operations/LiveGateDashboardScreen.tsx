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
import { useEvent } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/common/Header";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import type { GateMode, GateStatus } from "../../types";

interface LiveGateDashboardScreenProps {
  navigation?: any;
}

export function LiveGateDashboardScreen({ navigation }: LiveGateDashboardScreenProps) {
  const { gates, assignedGate, assignGate, toggleGateStatus, updateGateMode, selectedEvent } = useEvent();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "open" | "closed">("all");

  const isSupervisor =
    user?.role === "super_admin" ||
    user?.role === "org_admin" ||
    user?.role === "event_manager" ||
    user?.role === "gate_manager";

  const filteredGates = gates.filter((g) => {
    if (selectedFilter === "open") return g.status === "open";
    if (selectedFilter === "closed") return g.status === "closed";
    return true;
  });

  const totalScans = gates.reduce((acc, g) => acc + g.scansCount, 0);
  const totalActiveScanners = gates.reduce((acc, g) => acc + g.activeScannersCount, 0);

  function handleToggleStatus(gateId: string, currentStatus: GateStatus) {
    if (!isSupervisor) {
      Alert.alert("Permission Required", "Only Gate Managers and Event Admins can open/close gates.");
      return;
    }
    const newStatus: GateStatus = currentStatus === "open" ? "closed" : "open";
    toggleGateStatus(gateId, newStatus);
  }

  function handleModeChange(gateId: string, currentMode: GateMode) {
    if (!isSupervisor) {
      Alert.alert("Permission Required", "Only Gate Managers and Event Admins can change gate modes.");
      return;
    }
    const nextMode: GateMode =
      currentMode === "entry" ? "exit" : currentMode === "exit" ? "both" : "entry";
    updateGateMode(gateId, nextMode);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Live Gate Dashboard"
        subtitle={`${selectedEvent?.name || "Event"} Telemetry`}
        showEventSwitcher={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Global Gate Throughput Summary */}
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>EVENT-WIDE GATE PERFORMANCE</Text>
          <View style={styles.overviewStatsRow}>
            <View style={styles.overviewStat}>
              <Text style={styles.statNumber}>{totalScans.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Gate Scans</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.statNumber}>{totalActiveScanners}</Text>
              <Text style={styles.statLabel}>Active Scanners</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={[styles.statNumber, { color: COLORS.green }]}>
                {gates.filter((g) => g.status === "open").length} / {gates.length}
              </Text>
              <Text style={styles.statLabel}>Open Gates</Text>
            </View>
          </View>
        </Card>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(["all", "open", "closed"] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.toUpperCase()} ({filter === "all" ? gates.length : gates.filter((g) => g.status === filter).length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gates Live Telemetry Cards */}
        <View style={styles.gatesList}>
          {filteredGates.map((gate) => {
            const isCurrentAssigned = assignedGate?.id === gate.id;
            const approxRatePerMin = Math.round(gate.scansCount / 120);

            return (
              <Card key={gate.id} style={styles.gateCard}>
                <View style={styles.gateHeader}>
                  <View style={styles.gateTitleGroup}>
                    <Text style={styles.gateName}>{gate.name}</Text>
                    <Text style={styles.gateZone}>📍 Zone: {gate.zoneName || "General Area"}</Text>
                  </View>
                  <Badge
                    label={gate.status.toUpperCase()}
                    variant={gate.status === "open" ? "green" : "red"}
                  />
                </View>

                {/* Telemetry Metrics */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCell}>
                    <Text style={styles.metricVal}>{gate.scansCount.toLocaleString()}</Text>
                    <Text style={styles.metricLbl}>Total Scans</Text>
                  </View>
                  <View style={styles.metricCell}>
                    <Text style={styles.metricVal}>~{approxRatePerMin}/min</Text>
                    <Text style={styles.metricLbl}>Throughput</Text>
                  </View>
                  <View style={styles.metricCell}>
                    <Text style={styles.metricVal}>{gate.activeScannersCount} Active</Text>
                    <Text style={styles.metricLbl}>Scanners</Text>
                  </View>
                </View>

                {/* Allowed Categories / Access Whitelist */}
                {gate.allowedBadgeTypes && gate.allowedBadgeTypes.length > 0 && (
                  <View style={styles.badgeTypesRow}>
                    <Text style={styles.badgeTypesLabel}>Allowed Passes:</Text>
                    <View style={styles.badgePillsContainer}>
                      {gate.allowedBadgeTypes.map((type) => (
                        <Badge key={type} label={type} size="sm" variant="brand" />
                      ))}
                    </View>
                  </View>
                )}

                {/* Controls Bar */}
                <View style={styles.controlsBar}>
                  <TouchableOpacity
                    style={[
                      styles.controlBtn,
                      gate.status === "open" ? styles.btnDanger : styles.btnSuccess,
                    ]}
                    onPress={() => handleToggleStatus(gate.id, gate.status)}
                  >
                    <Text style={styles.controlBtnText}>
                      {gate.status === "open" ? "🔒 Close Gate" : "🔓 Open Gate"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlBtnSecondary}
                    onPress={() => handleModeChange(gate.id, gate.mode)}
                  >
                    <Text style={styles.controlBtnSecText}>
                      Mode: {gate.mode.toUpperCase()} 🔄
                    </Text>
                  </TouchableOpacity>

                  {!isCurrentAssigned ? (
                    <TouchableOpacity
                      style={styles.assignDeviceBtn}
                      onPress={() => assignGate(gate.id)}
                    >
                      <Text style={styles.assignDeviceText}>Assign Device</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.assignedIndicator}>
                      <Text style={styles.assignedIndicatorText}>Active Post</Text>
                    </View>
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
  overviewCard: {
    padding: 16,
    marginBottom: 16,
  },
  overviewLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  overviewStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewStat: {
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  gatesList: {
    gap: 12,
  },
  gateCard: {
    padding: 16,
  },
  gateHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  gateTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  gateName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  gateZone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  metricCell: {
    flex: 1,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  metricLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  badgeTypesRow: {
    marginTop: 12,
  },
  badgeTypesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  badgePillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  controlBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnDanger: {
    backgroundColor: COLORS.redLight,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
  },
  btnSuccess: {
    backgroundColor: COLORS.greenLight,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  controlBtnSecondary: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  controlBtnSecText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  assignDeviceBtn: {
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  assignDeviceText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  assignedIndicator: {
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: COLORS.greenLight,
  },
  assignedIndicatorText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.green,
  },
});
