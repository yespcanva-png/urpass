import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { OfflineBanner } from "../../components/common/OfflineBanner";

interface OrgEventSelectScreenProps {
  navigation?: any;
}

export function OrgEventSelectScreen({ navigation }: OrgEventSelectScreenProps) {
  const { user, logout } = useAuth();
  const {
    organizations,
    selectedOrg,
    events,
    selectedEvent,
    gates,
    assignedGate,
    selectOrganization,
    selectEvent,
    assignGate,
    isLoading,
  } = useEvent();

  const [activeStep, setActiveStep] = useState<"org" | "event" | "gate">("event");

  const filteredEvents = events.filter(
    (e) => !e.organizationId || e.organizationId === selectedOrg?.id
  );

  async function handleConfirmAndEnter() {
    if (!selectedEvent) return;
    if (navigation?.navigate) {
      navigation.navigate("MainTabs");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top User Session Header */}
        <View style={styles.topSessionHeader}>
          <View>
            <Text style={styles.welcomeText}>Signed in as</Text>
            <Text style={styles.userName}>{user?.name || "Operations Staff"}</Text>
            <Text style={styles.userRoleText}>{user?.role?.replace("_", " ").toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Step 1: Select Organization */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>01</Text>
            <View>
              <Text style={styles.sectionTitle}>Select Organization</Text>
              <Text style={styles.sectionSubtitle}>Choose which organizer workspace to access</Text>
            </View>
          </View>

          <View style={styles.list}>
            {organizations.map((org) => {
              const isSelected = selectedOrg?.id === org.id;
              return (
                <TouchableOpacity
                  key={org.id}
                  style={[styles.orgCard, isSelected && styles.orgCardSelected]}
                  onPress={() => selectOrganization(org.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.orgRow}>
                    <View style={styles.orgInfo}>
                      <Text style={styles.orgName}>{org.name}</Text>
                      <Text style={styles.orgMeta}>{org.eventsCount} Active Events</Text>
                    </View>
                    {isSelected ? (
                      <Badge label="Selected" variant="brand" size="sm" />
                    ) : (
                      <Text style={styles.selectArrow}>Select →</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Select Event */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>02</Text>
            <View>
              <Text style={styles.sectionTitle}>Select Live Event</Text>
              <Text style={styles.sectionSubtitle}>Choose the active event for check-in & gate control</Text>
            </View>
          </View>

          <View style={styles.list}>
            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              const checkinPercent = Math.round(
                (evt.checkedInCount / Math.max(1, evt.approvedCount)) * 100
              );
              return (
                <TouchableOpacity
                  key={evt.id}
                  style={[styles.eventCard, isSelected && styles.eventCardSelected]}
                  onPress={() => selectEvent(evt.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.eventTop}>
                    <Text style={styles.eventName}>{evt.name}</Text>
                    <Badge
                      label={evt.status}
                      variant={evt.status === "active" ? "green" : "neutral"}
                      size="sm"
                    />
                  </View>

                  <Text style={styles.eventVenue}>
                    📍 {evt.venue || "Main Convention Center"} • {evt.eventDate}
                  </Text>

                  <View style={styles.kpiRow}>
                    <View style={styles.kpiItem}>
                      <Text style={styles.kpiValue}>{evt.checkedInCount}</Text>
                      <Text style={styles.kpiLabel}>Checked In</Text>
                    </View>
                    <View style={styles.kpiItem}>
                      <Text style={styles.kpiValue}>{evt.currentlyInsideCount}</Text>
                      <Text style={styles.kpiLabel}>Currently Inside</Text>
                    </View>
                    <View style={styles.kpiItem}>
                      <Text style={styles.kpiValue}>{checkinPercent}%</Text>
                      <Text style={styles.kpiLabel}>Turnout</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 3: Assign Gate */}
        {selectedEvent && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>03</Text>
              <View>
                <Text style={styles.sectionTitle}>Assigned Gate / Scanner Post</Text>
                <Text style={styles.sectionSubtitle}>Assign this hardware device to a specific gate</Text>
              </View>
            </View>

            <View style={styles.list}>
              {gates.map((gate) => {
                const isSelected = assignedGate?.id === gate.id;
                return (
                  <TouchableOpacity
                    key={gate.id}
                    style={[styles.gateCard, isSelected && styles.gateCardSelected]}
                    onPress={() => assignGate(gate.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.gateRow}>
                      <View>
                        <Text style={styles.gateName}>{gate.name}</Text>
                        <Text style={styles.gateMode}>
                          Mode: {gate.mode.toUpperCase()} • {gate.activeScannersCount} Scanners Active
                        </Text>
                      </View>
                      <Badge
                        label={isSelected ? "Assigned" : gate.status}
                        variant={isSelected ? "green" : "neutral"}
                        size="sm"
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Enter Workspace CTA */}
        <Button
          title={selectedEvent ? `Enter ${selectedEvent.name}` : "Select an Event"}
          onPress={handleConfirmAndEnter}
          disabled={!selectedEvent}
          loading={isLoading}
          size="lg"
          style={styles.enterBtn}
        />
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
  topSessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  userRoleText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.brand,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.brand,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  list: {
    gap: 8,
  },
  orgCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 14,
  },
  orgCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.surfaceLight,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  orgMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectArrow: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 14,
  },
  eventCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.surfaceLight,
  },
  eventTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  eventName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  eventVenue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    padding: 10,
  },
  kpiItem: {
    flex: 1,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  kpiLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 1,
  },
  gateCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 12,
  },
  gateCardSelected: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.surfaceLight,
  },
  gateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gateName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  gateMode: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  enterBtn: {
    marginTop: 10,
  },
});
