import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Platform,
} from "react-native";
import {
  QrCode,
  Users,
  DoorOpen,
  Activity,
  ArrowLeftRight,
  ChevronRight,
  Shield,
  Wifi,
  WifiOff,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  User,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { useOffline } from "../../context/OfflineContext";
import { useAlerts } from "../../context/AlertContext";

interface EventOperationsHomeScreenProps {
  navigation?: any;
}

export function EventOperationsHomeScreen({ navigation }: EventOperationsHomeScreenProps) {
  const { user } = useAuth();
  const {
    selectedOrg,
    selectedEvent,
    gates,
    assignedGate,
    refreshEventData,
    isLoading,
  } = useEvent();
  const { isOnline, pendingQueueCount, syncNow, isSyncing, lastSyncAt } = useOffline();
  const { alerts, dismissAlert } = useAlerts();

  // Dynamic Event Operational KPIs
  const totalRegistered = selectedEvent?.totalRegistrations || 4820;
  const totalCheckedIn = selectedEvent?.checkedInCount || 4103;
  const currentlyInside = selectedEvent?.currentlyInsideCount || 3985;
  const remaining = Math.max(0, totalRegistered - totalCheckedIn);

  const checkinPercent = Math.round((totalCheckedIn / Math.max(1, totalRegistered)) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      {/* Top Navigation & Status Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.eventSelector}
          onPress={() => navigation?.navigate("EventSelection")}
          activeOpacity={0.75}
        >
          <View style={styles.eventIconBadge}>
            <Calendar size={14} color="#6D28D9" />
          </View>
          <View style={styles.eventTextGroup}>
            <Text style={styles.topEventName} numberOfLines={1}>
              {selectedEvent?.name || "Tech Summit 2026"}
            </Text>
            <Text style={styles.topOrgName} numberOfLines={1}>
              {selectedOrg?.name || "UrPass One"} • Tap to switch
            </Text>
          </View>
          <ChevronRight size={14} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={[styles.syncPill, !isOnline && styles.syncPillOffline]}
            onPress={() => syncNow()}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            {isOnline ? (
              <>
                <View style={styles.liveDot} />
                <Text style={styles.syncPillText}>
                  {isSyncing ? "Syncing..." : "Live"}
                </Text>
              </>
            ) : (
              <>
                <WifiOff size={11} color="#DC2626" />
                <Text style={styles.syncPillTextOffline}>
                  {pendingQueueCount > 0 ? `${pendingQueueCount} queued` : "Offline"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileAvatarButton}
            onPress={() => navigation?.navigate("Profile")}
            activeOpacity={0.75}
          >
            <User size={16} color="#6D28D9" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshEventData}
            tintColor="#6D28D9"
          />
        }
      >
        {/* Operational Alerts Banner (if any) */}
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {alerts.slice(0, 1).map((alert) => (
              <View key={alert.id} style={styles.alertBanner}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertTitleRow}>
                    <AlertTriangle size={14} color="#92400E" />
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => dismissAlert(alert.id)}>
                    <Text style={styles.alertDismiss}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertBody}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Immediate 4 KPI Metrics Grid */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiRow}>
            {/* 1. Registered */}
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>REGISTERED</Text>
              <Text style={styles.kpiValue}>
                {totalRegistered.toLocaleString()}
              </Text>
              <View style={styles.kpiSubRow}>
                <Text style={styles.kpiSubText}>Total capacity 5,000</Text>
              </View>
            </View>

            {/* 2. Checked In */}
            <View style={[styles.kpiCard, styles.kpiCardCheckedIn]}>
              <View style={styles.kpiLabelRow}>
                <Text style={styles.kpiLabel}>CHECKED IN</Text>
                <View style={styles.kpiChipGreen}>
                  <Text style={styles.kpiChipGreenText}>{checkinPercent}%</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, styles.kpiValueCheckedIn]}>
                {totalCheckedIn.toLocaleString()}
              </Text>
              <View style={styles.kpiSubRow}>
                <Text style={styles.kpiSubText}>Arrived at venue</Text>
              </View>
            </View>
          </View>

          <View style={styles.kpiRow}>
            {/* 3. Inside */}
            <View style={[styles.kpiCard, styles.kpiCardInside]}>
              <View style={styles.kpiLabelRow}>
                <Text style={styles.kpiLabel}>INSIDE</Text>
                <View style={styles.kpiChipPurple}>
                  <Text style={styles.kpiChipPurpleText}>Active</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, styles.kpiValueInside]}>
                {currentlyInside.toLocaleString()}
              </Text>
              <View style={styles.kpiSubRow}>
                <Text style={styles.kpiSubText}>Currently in concourse</Text>
              </View>
            </View>

            {/* 4. Remaining */}
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>REMAINING</Text>
              <Text style={styles.kpiValue}>
                {remaining.toLocaleString()}
              </Text>
              <View style={styles.kpiSubRow}>
                <Text style={styles.kpiSubText}>Expected attendees</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Scan Pass Action */}
        <TouchableOpacity
          style={styles.primaryScanButton}
          onPress={() => navigation?.navigate("QRScanner")}
          activeOpacity={0.88}
        >
          <View style={styles.scanButtonLeft}>
            <View style={styles.scanIconBadge}>
              <QrCode size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.scanButtonTitle}>Scan Pass</Text>
              <Text style={styles.scanButtonSubtitle}>
                {assignedGate ? `Gate: ${assignedGate.name}` : "Launch high-speed QR scanner"}
              </Text>
            </View>
          </View>
          <View style={styles.scanArrowCircle}>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* Quick Operations Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>QUICK ACTIONS</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {/* 1. Scan Pass */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate("QRScanner")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, styles.actionIconPurple]}>
              <QrCode size={20} color="#6D28D9" />
            </View>
            <Text style={styles.actionCardTitle}>Scan Pass</Text>
            <Text style={styles.actionCardDesc}>QR & Barcode check-in</Text>
          </TouchableOpacity>

          {/* 2. Attendees */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate("AttendeeSearch")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, styles.actionIconBlue]}>
              <Users size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionCardTitle}>Attendees</Text>
            <Text style={styles.actionCardDesc}>Lookup & manual entry</Text>
          </TouchableOpacity>

          {/* 3. Gates */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate("LiveGateDashboard")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, styles.actionIconGreen]}>
              <DoorOpen size={20} color="#059669" />
            </View>
            <Text style={styles.actionCardTitle}>Gates</Text>
            <Text style={styles.actionCardDesc}>Live lane management</Text>
          </TouchableOpacity>

          {/* 4. Live Activity */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate("ActivityFeed")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, styles.actionIconAmber]}>
              <Activity size={20} color="#D97706" />
            </View>
            <Text style={styles.actionCardTitle}>Live Activity</Text>
            <Text style={styles.actionCardDesc}>Real-time scan feed</Text>
          </TouchableOpacity>
        </View>

        {/* Live Gates Telemetry Summary */}
        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionHeading}>GATES STATUS</Text>
          <TouchableOpacity onPress={() => navigation?.navigate("LiveGateDashboard")}>
            <Text style={styles.sectionLink}>View all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gatesListContainer}>
          {gates.length > 0 ? (
            gates.slice(0, 3).map((gate) => {
              const isAssigned = assignedGate?.id === gate.id;
              return (
                <View key={gate.id} style={styles.gateRowCard}>
                  <View style={styles.gateInfoCol}>
                    <View style={styles.gateNameRow}>
                      <Text style={styles.gateName}>{gate.name}</Text>
                      {isAssigned && (
                        <View style={styles.assignedBadge}>
                          <Text style={styles.assignedBadgeText}>Your Gate</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.gateZoneText}>
                      {gate.zoneName || "Main Concourse"} • {gate.mode.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.gateStatsCol}>
                    <Text style={styles.gateScanCount}>
                      {gate.scansCount.toLocaleString()} scans
                    </Text>
                    <View
                      style={[
                        styles.gateStatusDot,
                        gate.status === "open"
                          ? styles.gateStatusOpen
                          : styles.gateStatusClosed,
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.gateRowCard}>
              <View style={styles.gateInfoCol}>
                <Text style={styles.gateName}>Gate 1 – Main Concourse</Text>
                <Text style={styles.gateZoneText}>Entry Lane • 4 Scanners Active</Text>
              </View>
              <View style={styles.gateStatsCol}>
                <Text style={styles.gateScanCount}>2,840 scans</Text>
                <View style={[styles.gateStatusDot, styles.gateStatusOpen]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  eventSelector: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  eventIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  eventTextGroup: {
    flex: 1,
    paddingRight: 4,
  },
  topEventName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  topOrgName: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileAvatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  syncPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  syncPillOffline: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
  },
  syncPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  syncPillTextOffline: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },

  /* Alerts */
  alertsContainer: {
    marginBottom: 14,
  },
  alertBanner: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 12,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
  },
  alertDismiss: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45309",
  },
  alertBody: {
    fontSize: 12,
    color: "#78350F",
    lineHeight: 16,
  },

  /* KPI Grid */
  kpiContainer: {
    gap: 10,
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  kpiCardCheckedIn: {
    borderColor: "#E2E8F0",
  },
  kpiCardInside: {
    backgroundColor: "#FAF5FF",
    borderColor: "#EDE9FE",
  },
  kpiLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  kpiChipGreen: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  kpiChipGreenText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#059669",
  },
  kpiChipPurple: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  kpiChipPurpleText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#6D28D9",
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginTop: 6,
    marginBottom: 4,
  },
  kpiValueCheckedIn: {
    color: "#059669",
  },
  kpiValueInside: {
    color: "#6D28D9",
  },
  kpiSubRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  kpiSubText: {
    fontSize: 11,
    color: "#94A3B8",
  },

  /* Primary Scan Button */
  primaryScanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6D28D9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  scanButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  scanIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  scanButtonSubtitle: {
    fontSize: 12,
    color: "#DDD6FE",
    marginTop: 2,
  },
  scanArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Section Headings */
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeaderBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* Quick Actions Grid */
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionIconPurple: {
    backgroundColor: "#FAF5FF",
    borderColor: "#EDE9FE",
    borderWidth: 1,
  },
  actionIconBlue: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    borderWidth: 1,
  },
  actionIconGreen: {
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
    borderWidth: 1,
  },
  actionIconAmber: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FEF3C7",
    borderWidth: 1,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.1,
  },
  actionCardDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  /* Gates Telemetry List */
  gatesListContainer: {
    gap: 8,
  },
  gateRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  gateInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  gateNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gateName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  assignedBadge: {
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  assignedBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#6D28D9",
  },
  gateZoneText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  gateStatsCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gateScanCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  gateStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gateStatusOpen: {
    backgroundColor: "#059669",
  },
  gateStatusClosed: {
    backgroundColor: "#DC2626",
  },
});
