import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { useOffline } from "../../context/OfflineContext";
import { useAlerts } from "../../context/AlertContext";
import { Header } from "../../components/common/Header";
import { MetricCard } from "../../components/common/MetricCard";
import { Badge } from "../../components/common/Badge";
import { Card } from "../../components/common/Card";

interface EventOperationsHomeScreenProps {
  navigation?: any;
}

export function EventOperationsHomeScreen({ navigation }: EventOperationsHomeScreenProps) {
  const { user } = useAuth();
  const { selectedEvent, gates, assignedGate, refreshEventData, isLoading } = useEvent();
  const { isOnline, pendingQueueCount, syncNow, isSyncing, lastSyncAt } = useOffline();
  const { alerts, dismissAlert } = useAlerts();

  const venueCapacity = selectedEvent?.attendeeLimit || 5000;
  const insideCount = selectedEvent?.currentlyInsideCount || 0;
  const capacityPercent = Math.min(100, Math.round((insideCount / venueCapacity) * 100));

  const totalCheckedIn = selectedEvent?.checkedInCount || 0;
  const approvedCount = selectedEvent?.approvedCount || 0;
  const checkinRate = approvedCount > 0 ? Math.round((totalCheckedIn / approvedCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        onEventPress={() => navigation?.navigate("OrgEventSelect")}
        rightAction={
          <TouchableOpacity
            style={styles.syncIconButton}
            onPress={() => syncNow()}
            disabled={isSyncing}
          >
            <Text style={styles.syncIconText}>
              {isSyncing ? "⏳ Syncing" : isOnline ? "🟢 Live" : "🔴 Offline"}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshEventData}
            tintColor={COLORS.brand}
          />
        }
      >
        {/* Operational Alerts Banner */}
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {alerts.slice(0, 2).map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  alert.severity === "critical"
                    ? styles.alertCritical
                    : styles.alertWarning,
                ]}
              >
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>⚠️ {alert.title}</Text>
                  <TouchableOpacity onPress={() => dismissAlert(alert.id)}>
                    <Text style={styles.alertDismiss}>Dismiss ✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Venue Capacity Protection Bar */}
        <Card style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <View>
              <Text style={styles.capacityLabel}>LIVE VENUE CAPACITY</Text>
              <Text style={styles.capacityCount}>
                {insideCount.toLocaleString()} / {venueCapacity.toLocaleString()}{" "}
                <Text style={styles.capacityUnit}>Inside</Text>
              </Text>
            </View>
            <Badge
              label={`${capacityPercent}% Loaded`}
              variant={
                capacityPercent >= 90
                  ? "red"
                  : capacityPercent >= 80
                  ? "amber"
                  : "green"
              }
            />
          </View>

          <View style={styles.capacityBarTrack}>
            <View
              style={[
                styles.capacityBarFill,
                {
                  width: `${capacityPercent}%`,
                  backgroundColor:
                    capacityPercent >= 90
                      ? COLORS.red
                      : capacityPercent >= 80
                      ? COLORS.amber
                      : COLORS.green,
                },
              ]}
            />
          </View>

          <View style={styles.capacityFooter}>
            <Text style={styles.capacitySub}>
              Remaining headroom: {(venueCapacity - insideCount).toLocaleString()} spots
            </Text>
            <Text style={styles.capacitySub}>
              {selectedEvent?.checkedOutCount || 0} checked out
            </Text>
          </View>
        </Card>

        {/* Metric KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            <MetricCard
              label="Checked In"
              value={totalCheckedIn.toLocaleString()}
              subtitle={`${checkinRate}% of approved`}
              accentColor={COLORS.green}
            />
            <MetricCard
              label="Currently Inside"
              value={insideCount.toLocaleString()}
              subtitle={`${capacityPercent}% venue load`}
              accentColor={COLORS.brand}
            />
          </View>

          <View style={styles.kpiRow}>
            <MetricCard
              label="Approved"
              value={approvedCount.toLocaleString()}
              subtitle={`${selectedEvent?.totalRegistrations || 0} registered`}
              accentColor={COLORS.textPrimary}
            />
            <MetricCard
              label="Sync Queue"
              value={pendingQueueCount}
              subtitle={lastSyncAt ? `Synced ${lastSyncAt}` : "All Synced"}
              accentColor={pendingQueueCount > 0 ? COLORS.amber : COLORS.textSecondary}
            />
          </View>
        </View>

        {/* Primary Action Button — Open Scanner */}
        <TouchableOpacity
          style={styles.primaryScanBtn}
          onPress={() => navigation?.navigate("QRScanner")}
          activeOpacity={0.88}
        >
          <View style={styles.scanBtnLeft}>
            <View style={styles.scanIconBadge}>
              <Text style={styles.scanBtnIcon}>📷</Text>
            </View>
            <View>
              <Text style={styles.scanBtnTitle}>Launch High-Speed Scanner</Text>
              <Text style={styles.scanBtnSub}>
                Active Gate: {assignedGate?.name || "Main Entrance"}
              </Text>
            </View>
          </View>
          <Text style={styles.scanBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* Quick Operations Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation?.navigate("AttendeeSearch")}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionTitle}>Attendee Lookup</Text>
            <Text style={styles.actionDesc}>Manual Check-in & Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation?.navigate("LiveGateDashboard")}
          >
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionTitle}>Gate Dashboard</Text>
            <Text style={styles.actionDesc}>Live telemetry & throughput</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation?.navigate("ScanAuditLog")}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionTitle}>Audit Log</Text>
            <Text style={styles.actionDesc}>Security logs & overrides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation?.navigate("GateStaffManagement")}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Staff & Crew</Text>
            <Text style={styles.actionDesc}>Scanner devices & PINs</Text>
          </TouchableOpacity>
        </View>

        {/* Active Gates Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE GATES TELEMETRY</Text>
          <TouchableOpacity onPress={() => navigation?.navigate("LiveGateDashboard")}>
            <Text style={styles.sectionLink}>View All Gates →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gatesList}>
          {gates.map((gate) => {
            const isCurrentAssigned = assignedGate?.id === gate.id;
            return (
              <Card key={gate.id} style={styles.gateSummaryCard}>
                <View style={styles.gateCardTop}>
                  <View style={styles.gateNameGroup}>
                    <Text style={styles.gateTitle}>{gate.name}</Text>
                    <Text style={styles.gateZone}>Zone: {gate.zoneName || "General Area"}</Text>
                  </View>
                  <Badge
                    label={gate.status.toUpperCase()}
                    variant={gate.status === "open" ? "green" : "red"}
                    size="sm"
                  />
                </View>

                <View style={styles.gateCardMeta}>
                  <View style={styles.gateStat}>
                    <Text style={styles.gateStatVal}>{gate.scansCount.toLocaleString()}</Text>
                    <Text style={styles.gateStatLbl}>Scans Processed</Text>
                  </View>
                  <View style={styles.gateStat}>
                    <Text style={styles.gateStatVal}>{gate.activeScannersCount}</Text>
                    <Text style={styles.gateStatLbl}>Scanners Online</Text>
                  </View>
                  <View style={styles.gateStat}>
                    <Text style={styles.gateStatVal}>{gate.mode.toUpperCase()}</Text>
                    <Text style={styles.gateStatLbl}>Mode</Text>
                  </View>
                </View>

                {isCurrentAssigned && (
                  <View style={styles.currentAssignedBadge}>
                    <Text style={styles.currentAssignedText}>
                      ✓ This device is scanning at this gate
                    </Text>
                  </View>
                )}
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
  syncIconButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  syncIconText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  alertsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  alertCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertWarning: {
    backgroundColor: COLORS.amberLight,
    borderColor: COLORS.amberBorder,
  },
  alertCritical: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.redBorder,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  alertDismiss: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  alertMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  capacityCard: {
    marginBottom: 16,
    padding: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  capacityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  capacityLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  capacityCount: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  capacityUnit: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  capacityBarTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  capacityBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  capacityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  capacitySub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  kpiGrid: {
    gap: 10,
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryScanBtn: {
    backgroundColor: COLORS.brand,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  scanBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  scanIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanBtnIcon: {
    fontSize: 20,
  },
  scanBtnTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  scanBtnSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  scanBtnArrow: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "900",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  quickActionItem: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  actionDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },
  gatesList: {
    gap: 10,
  },
  gateSummaryCard: {
    padding: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  gateCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  gateNameGroup: {
    flex: 1,
  },
  gateTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  gateZone: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gateCardMeta: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  gateStat: {
    flex: 1,
  },
  gateStatVal: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  gateStatLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
  currentAssignedBadge: {
    marginTop: 8,
    backgroundColor: COLORS.greenLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  currentAssignedText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "700",
  },
});
