import React from "react";
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
      <StatusBar barStyle="dark-content" />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top User Session Header */}
        <View style={styles.topSessionHeader}>
          <View>
            <Text style={styles.welcomeText}>ACTIVE STAFF SESSION</Text>
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
              <Text style={styles.sectionTitle}>Organization</Text>
              <Text style={styles.sectionSubtitle}>Select organizer tenant workspace</Text>
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
              <Text style={styles.sectionTitle}>Live Event</Text>
              <Text style={styles.sectionSubtitle}>Choose the active event for gate check-in</Text>
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
                      label={evt.status.toUpperCase()}
                      variant={evt.status === "active" ? "green" : "neutral"}
                      size="sm"
                    />
                  </View>

                  <Text style={styles.eventVenue}>
                    {evt.venue || "Convention Center"} • {evt.eventDate}
                  </Text>

                  <View style={styles.kpiRow}>
                    <View style={styles.kpiItem}>
                      <Text style={styles.kpiValue}>{evt.checkedInCount}</Text>
                      <Text style={styles.kpiLabel}>Checked In</Text>
                    </View>
                    <View style={styles.kpiItem}>
                      <Text style={styles.kpiValue}>{evt.currentlyInsideCount}</Text>
                      <Text style={styles.kpiLabel}>Inside</Text>
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
                <Text style={styles.sectionTitle}>Station Gate Assignment</Text>
                <Text style={styles.sectionSubtitle}>Assign this scanner device to an entry point</Text>
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
                    <View style={styles.gateTop}>
                      <Text style={styles.gateName}>{gate.name}</Text>
                      <Badge
                        label={gate.status.toUpperCase()}
                        variant={gate.status === "open" ? "green" : "red"}
                        size="sm"
                      />
                    </View>
                    <Text style={styles.gateZone}>Zone: {gate.zoneName || "Main Entrance"}</Text>
                    <View style={styles.gateMetaRow}>
                      <Text style={styles.gateMeta}>Mode: {gate.mode.toUpperCase()}</Text>
                      <Text style={styles.gateMeta}>Live Scans: {gate.scansCount}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Launch Gate Console Button */}
        <Button
          title="Launch Event Operations"
          onPress={handleConfirmAndEnter}
          disabled={!selectedEvent}
          loading={isLoading}
          variant="brand"
          size="lg"
          style={styles.confirmBtn}
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
    padding: 18,
    paddingBottom: 40,
  },
  topSessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  welcomeText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  userRoleText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brand,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  sectionNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.brand,
    backgroundColor: COLORS.brandLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  list: {
    gap: 10,
  },
  orgCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 14,
  },
  orgCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
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
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  orgMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  selectArrow: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },
  eventCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 14,
  },
  eventCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
  },
  eventTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eventName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  eventVenue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 8,
  },
  kpiItem: {
    flex: 1,
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  kpiLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
  gateCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 14,
  },
  gateCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
  },
  gateTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  gateName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  gateZone: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  gateMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gateMeta: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  confirmBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
});
