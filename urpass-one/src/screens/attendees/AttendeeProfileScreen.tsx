import React, { useState, useEffect } from "react";
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
import { OfflineDb } from "../../services/offlineDb";
import { ValidationService } from "../../services/validationService";
import { Header } from "../../components/common/Header";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { TicketPassCard } from "../../components/pass/TicketPassCard";
import type { Attendee, ScanAuditLog } from "../../types";

interface AttendeeProfileScreenProps {
  route?: any;
  navigation?: any;
}

export function AttendeeProfileScreen({ route, navigation }: AttendeeProfileScreenProps) {
  const attendeeId = route?.params?.attendeeId || "att-vip-001";
  const { selectedEvent, assignedGate } = useEvent();
  const { user, deviceId } = useAuth();

  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pass" | "details">("pass");

  useEffect(() => {
    async function loadProfile() {
      if (!selectedEvent) return;
      const att = await OfflineDb.getAttendeeById(attendeeId, selectedEvent.id);
      if (att) {
        setAttendee(att);
      } else {
        // Fallback default attendee profile
        const fallbackAtt: Attendee = {
          id: attendeeId,
          eventId: selectedEvent.id,
          name: "Dr. Arvind Ramesh",
          email: "arvind.ramesh@techcorp.io",
          phone: "+91 98401 23456",
          passType: "vip",
          ticketName: "VIP All-Access Pass",
          ticketNumber: "TK-VIP-9941",
          registrationId: "REG-2026-9042",
          passToken: "UP_VIP_001_VALID",
          applicationStatus: "approved",
          presenceStatus: "inside",
          checkinCount: 2,
          checkoutCount: 1,
          lastCheckinAt: new Date(Date.now() - 3600000).toISOString(),
          lastGateName: "Gate B – VIP & Keynote Speakers",
          company: "Apex Neural Labs",
          assignedZones: ["VIP Lounge", "Keynote Stage", "Expo Pavilion", "General Main"],
        };
        setAttendee(fallbackAtt);
      }

      // Load scan history for this attendee
      const logs = await OfflineDb.getAuditLogs(selectedEvent.id);
      const filtered = logs.filter((l) => l.attendeeId === attendeeId || l.qrPayload === attendee?.passToken);
      setScanHistory(filtered);
    }

    loadProfile();
  }, [attendeeId, selectedEvent, attendee?.passToken]);

  async function handleTogglePresence() {
    if (!attendee || !selectedEvent || !assignedGate) return;

    setIsLoading(true);
    try {
      const nextDirection = attendee.presenceStatus === "inside" ? "out" : "in";
      const result = await ValidationService.validateScan(attendee.passToken || attendee.id, {
        eventId: selectedEvent.id,
        gate: assignedGate,
        direction: nextDirection,
        deviceId,
        deviceName: deviceId,
        userId: user?.id || "staff",
        userName: user?.name || "Staff",
      });

      if (result.allowed && result.attendee) {
        setAttendee(result.attendee);
        Alert.alert(
          "Status Updated",
          `${attendee.name} is now ${nextDirection === "in" ? "INSIDE" : "OUTSIDE"} the venue.`
        );
      } else {
        Alert.alert("Action Denied", result.rejectionReason || result.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetPass() {
    Alert.alert(
      "Reset Pass State",
      "Are you sure you want to clear scan count and reset attendee presence?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (attendee && selectedEvent) {
              const updated: Attendee = {
                ...attendee,
                presenceStatus: "outside",
                checkinCount: 0,
                checkoutCount: 0,
                lastCheckinAt: undefined,
              };
              await OfflineDb.saveAttendee(updated);
              setAttendee(updated);
              Alert.alert("Pass Reset", "Attendee state has been refreshed.");
            }
          },
        },
      ]
    );
  }

  if (!attendee) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header title="Attendee Profile" showEventSwitcher={false} />
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Loading attendee record...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isInside = attendee.presenceStatus === "inside";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Attendee Operations Record"
        subtitle={attendee.name}
        showEventSwitcher={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tab View Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "pass" && styles.tabBtnActive]}
            onPress={() => setActiveTab("pass")}
          >
            <Text style={[styles.tabText, activeTab === "pass" && styles.tabTextActive]}>
              Digital Pass
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "details" && styles.tabBtnActive]}
            onPress={() => setActiveTab("details")}
          >
            <Text style={[styles.tabText, activeTab === "details" && styles.tabTextActive]}>
              Telemetry & History
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "pass" ? (
          <View style={styles.passTabContainer}>
            {/* Signature Digital Pass Ticket from urpass.space */}
            <TicketPassCard
              attendee={attendee}
              eventName={selectedEvent?.name || "Event 2026"}
              venue={selectedEvent?.venue || "Main Hall"}
              style={styles.ticketCardWrapper}
            />

            {/* Presence Status Quick Indicator */}
            <View style={styles.presenceBanner}>
              <Text style={styles.presenceLabel}>CURRENT PRESENCE:</Text>
              <Badge
                label={isInside ? "CURRENTLY INSIDE VENUE" : "CURRENTLY OUTSIDE VENUE"}
                variant={isInside ? "green" : "neutral"}
                size="md"
              />
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            {/* Profile Card Header */}
            <Card style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{attendee.name.charAt(0)}</Text>
                </View>

                <View style={styles.nameGroup}>
                  <Text style={styles.nameText}>{attendee.name}</Text>
                  <Text style={styles.emailText}>{attendee.email}</Text>
                  {attendee.phone && <Text style={styles.phoneText}>📞 {attendee.phone}</Text>}
                  {attendee.company && <Text style={styles.companyText}>🏢 {attendee.company}</Text>}
                </View>
              </View>

              {/* Status Badges Row */}
              <View style={styles.badgesRow}>
                <Badge label={attendee.passType.toUpperCase()} variant="brand" />
                <Badge
                  label={isInside ? "INSIDE" : "OUTSIDE"}
                  variant={isInside ? "green" : "neutral"}
                />
                <Badge label={attendee.applicationStatus} variant="neutral" />
              </View>
            </Card>

            {/* Operational Stats Grid */}
            <Card style={styles.statsCard}>
              <Text style={styles.sectionHeading}>PRESENCE & ACCESS COUNTERS</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCell}>
                  <Text style={styles.statNumber}>{attendee.checkinCount}</Text>
                  <Text style={styles.statLabel}>Check-ins</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statNumber}>{attendee.checkoutCount}</Text>
                  <Text style={styles.statLabel}>Check-outs</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statNumber}>{attendee.lastGateName ? "Yes" : "None"}</Text>
                  <Text style={styles.statLabel}>Gate Logged</Text>
                </View>
              </View>

              {attendee.lastCheckinAt && (
                <Text style={styles.lastScanTimeText}>
                  Last Scan: {new Date(attendee.lastCheckinAt).toLocaleTimeString()} at {attendee.lastGateName || "Main Gate"}
                </Text>
              )}
            </Card>

            {/* Allowed Access Zones */}
            <Card style={styles.zonesCard}>
              <Text style={styles.sectionHeading}>AUTHORIZED ZONES & ACCESS RULES</Text>
              <View style={styles.zonesPills}>
                {(attendee.assignedZones || ["Main Entrance", "General Area"]).map((zone) => (
                  <Badge key={zone} label={zone} variant="blue" />
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* Primary Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            title={isInside ? "Perform Manual Check-Out 🚪" : "Perform Manual Check-In ⚡"}
            variant={isInside ? "secondary" : "success"}
            onPress={handleTogglePresence}
            loading={isLoading}
            size="lg"
            style={styles.actionBtn}
          />

          <Button
            title="Reset Pass / Clear Scan State"
            variant="ghost"
            onPress={handleResetPass}
            style={styles.actionBtn}
          />
        </View>

        {/* Scan Audit History Timeline */}
        <Text style={styles.historyHeading}>SCAN AUDIT TRAIL</Text>
        {scanHistory.length > 0 ? (
          <View style={styles.historyList}>
            {scanHistory.map((h) => (
              <View key={h.id} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyAction}>
                    {h.direction === "in" ? "↓ Entry Check-In" : "↑ Exit Check-Out"}
                  </Text>
                  <Text style={styles.historyTime}>
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
                <Text style={styles.historyGate}>{h.gateName} • Scanner: {h.userName}</Text>
                {h.isOverride && (
                  <Badge label="Supervisor Override" variant="amber" size="sm" style={styles.historyBadge} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noHistoryText}>No scan transactions recorded for this pass yet.</Text>
        )}
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
  loadingBox: {
    padding: 30,
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.brand,
    fontWeight: "700",
  },
  passTabContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  ticketCardWrapper: {
    width: "100%",
    maxWidth: 340,
  },
  presenceBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  presenceLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  profileCard: {
    padding: 18,
    marginBottom: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
  },
  profileTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  avatarBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.brand,
  },
  nameGroup: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  emailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  companyText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  statsCard: {
    padding: 16,
    marginBottom: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    padding: 12,
  },
  statCell: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  lastScanTimeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  zonesCard: {
    padding: 16,
    marginBottom: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
  },
  zonesPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  actionsBox: {
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    width: "100%",
  },
  historyHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  historyTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  historyGate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  historyBadge: {
    marginTop: 6,
  },
  noHistoryText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
});
