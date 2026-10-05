import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { Badge } from "../../components/common/Badge";
import type { EventSummary } from "../../types";

interface EventSelectionScreenProps {
  navigation?: any;
}

export function EventSelectionScreen({ navigation }: EventSelectionScreenProps) {
  const { user } = useAuth();
  const { events, selectedOrg, selectedEvent, selectEvent, isLoading } = useEvent();

  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "past">("live");
  const [searchQuery, setSearchQuery] = useState("");

  const orgEvents = useMemo(() => {
    if (!selectedOrg) return events;
    return events.filter((e) => !e.organizationId || e.organizationId === selectedOrg.id);
  }, [events, selectedOrg]);

  // Direct skip if only 1 active event is assigned
  useEffect(() => {
    if (orgEvents && orgEvents.length === 1 && orgEvents[0].status === "active") {
      selectEvent(orgEvents[0].id);
      navigation?.navigate("OperationsHome");
    }
  }, [orgEvents]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orgEvents.filter((ev) => {
      // Search filter
      const matchesSearch =
        !q ||
        ev.name.toLowerCase().includes(q) ||
        (ev.venue && ev.venue.toLowerCase().includes(q));

      // Tab filter
      const isLive = ev.status === "active";
      const isPast = ev.status === "completed" || ev.status === "cancelled";
      const isUpcoming = ev.status === "draft" || (!isLive && !isPast);

      let matchesTab = true;
      if (activeTab === "live") matchesTab = isLive;
      if (activeTab === "upcoming") matchesTab = isUpcoming || (isLive && ev.checkedInCount === 0);
      if (activeTab === "past") matchesTab = isPast;

      return matchesSearch && matchesTab;
    });
  }, [orgEvents, searchQuery, activeTab]);

  function handleSelectEvent(eventItem: EventSummary) {
    selectEvent(eventItem.id);
    navigation?.navigate("OperationsHome");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navigation Row */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>← Change Org</Text>
        </TouchableOpacity>

        <View style={styles.orgTag}>
          <Text style={styles.orgTagText} numberOfLines={1}>
            {selectedOrg?.name || "Organisation"}
          </Text>
        </View>
      </View>

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Select event</Text>
        <Text style={styles.headerSubtitle}>
          Choose the event to start scanning passes and managing gates.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by name or venue..."
            placeholderTextColor={COLORS.textLightMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Filter Tabs (Upcoming, Live, Past) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "live" && styles.tabBtnActive]}
          onPress={() => setActiveTab("live")}
        >
          <Text style={[styles.tabText, activeTab === "live" && styles.tabTextActive]}>
            Live ({orgEvents.filter((e) => e.status === "active").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "upcoming" && styles.tabBtnActive]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.tabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "past" && styles.tabBtnActive]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, activeTab === "past" && styles.tabTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Event Cards FlatList */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No events in this view</Text>
            <Text style={styles.emptySubtitle}>
              There are no events matching your filter. Try switching between Live, Upcoming and Past.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedEvent?.id === item.id;
          const isLive = item.status === "active";
          const userRole = (user?.role || "Gate Manager").replace("_", " ").toUpperCase();

          return (
            <TouchableOpacity
              style={[styles.eventCard, isSelected && styles.eventCardSelected]}
              onPress={() => handleSelectEvent(item)}
              activeOpacity={0.85}
            >
              {/* Event Top Meta */}
              <View style={styles.eventTop}>
                <View style={styles.thumbnailBox}>
                  <Text style={styles.thumbnailText}>{item.name.charAt(0)}</Text>
                </View>

                <View style={styles.titleColumn}>
                  <Text style={styles.eventName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.eventDate}>📅 {item.eventDate}</Text>
                </View>

                <Badge
                  label={isLive ? "LIVE" : item.status.toUpperCase()}
                  variant={isLive ? "green" : item.status === "draft" ? "blue" : "neutral"}
                  size="sm"
                />
              </View>

              {/* Venue Row */}
              <Text style={styles.venueText} numberOfLines={1}>
                📍 {item.venue || "Convention Center"}
              </Text>

              {/* Footer Meta: Role & Gate Status */}
              <View style={styles.eventFooter}>
                <View style={styles.roleBox}>
                  <Text style={styles.roleLabel}>ASSIGNED ROLE</Text>
                  <Text style={styles.roleValue}>{userRole}</Text>
                </View>

                <View style={styles.liveStatBox}>
                  <Text style={styles.statLabel}>ATTENDEES INSIDE</Text>
                  <Text style={styles.statValue}>
                    {item.currentlyInsideCount} / {item.approvedCount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  orgTag: {
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 180,
  },
  orgTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.brand,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: "100%",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.brand,
    fontWeight: "800",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 17,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  eventCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
  },
  eventTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  thumbnailBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.brand,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 6,
  },
  eventName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  eventDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  venueText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roleBox: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  roleValue: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brand,
    marginTop: 1,
  },
  liveStatBox: {
    alignItems: "flex-end",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 1,
  },
});
