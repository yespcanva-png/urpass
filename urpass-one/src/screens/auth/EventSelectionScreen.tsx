import React, { useState, useMemo } from "react";
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
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  MapPin,
  Search,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import type { EventSummary } from "../../types";

interface EventSelectionScreenProps {
  navigation?: any;
}

function formatRole(role?: string): string {
  if (!role) return "Gate Manager";
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    org_admin: "Organisation Admin",
    event_manager: "Event Administrator",
    gate_manager: "Gate Manager",
    gate_staff: "Event Staff",
    view_only_ops: "Viewer",
  };
  return (
    map[role.toLowerCase()] ||
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function EventSelectionScreen({ navigation }: EventSelectionScreenProps) {
  const { user } = useAuth();
  const { events, selectedOrg, selectEvent } = useEvent();

  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "past">("live");
  const [searchQuery, setSearchQuery] = useState("");

  const orgEvents = useMemo(() => {
    if (!selectedOrg) return events;
    const list = events.filter((e) => !e.organizationId || e.organizationId === selectedOrg.id);
    return list.length > 0 ? list : events;
  }, [events, selectedOrg]);

  const liveCount = useMemo(
    () => orgEvents.filter((e) => e.status === "active").length,
    [orgEvents]
  );
  const upcomingCount = useMemo(
    () => orgEvents.filter((e) => e.status === "draft" || e.status === "published").length,
    [orgEvents]
  );
  const pastCount = useMemo(
    () => orgEvents.filter((e) => e.status === "completed" || e.status === "cancelled").length,
    [orgEvents]
  );

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orgEvents.filter((ev) => {
      const matchesSearch =
        !q ||
        ev.name.toLowerCase().includes(q) ||
        (ev.venue && ev.venue.toLowerCase().includes(q)) ||
        ev.eventDate.toLowerCase().includes(q);

      const isLive = ev.status === "active";
      const isPast = ev.status === "completed" || ev.status === "cancelled";
      const isUpcoming = ev.status === "draft" || ev.status === "published" || (!isLive && !isPast);

      let matchesTab = true;
      if (activeTab === "live") matchesTab = isLive;
      if (activeTab === "upcoming") matchesTab = isUpcoming;
      if (activeTab === "past") matchesTab = isPast;

      return matchesSearch && matchesTab;
    });
  }, [orgEvents, searchQuery, activeTab]);

  function handleSelectEvent(eventItem: EventSummary) {
    selectEvent(eventItem.id);
    navigation?.navigate("OperationsHome");
  }

  function handleGoBack() {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate("OrgSelection");
    }
  }

  function renderStatusBadge(status: string) {
    const s = status.toLowerCase();
    if (s === "active") {
      return (
        <View style={styles.statusLiveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.statusLiveText}>LIVE</Text>
        </View>
      );
    }
    if (s === "completed" || s === "cancelled") {
      return (
        <View style={styles.statusPastBadge}>
          <Text style={styles.statusPastText}>PAST</Text>
        </View>
      );
    }
    return (
      <View style={styles.statusUpcomingBadge}>
        <Text style={styles.statusUpcomingText}>UPCOMING</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        {selectedOrg && (
          <View style={styles.orgPill}>
            <Text style={styles.orgPillText} numberOfLines={1}>
              {selectedOrg.name}
            </Text>
          </View>
        )}
      </View>

      {/* Title Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconCircleBadge}>
          <Calendar size={22} color="#6D28D9" strokeWidth={2.2} />
        </View>
        <Text style={styles.headerTitle}>Select event</Text>
        <Text style={styles.headerSubtitle}>
          Choose the event you want to operate.
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Category Tabs: Live, Upcoming, Past */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsTrack}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "live" && styles.tabButtonActive]}
            onPress={() => setActiveTab("live")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "live" && styles.tabButtonTextActive,
              ]}
            >
              Live {liveCount > 0 ? `(${liveCount})` : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "upcoming" && styles.tabButtonActive]}
            onPress={() => setActiveTab("upcoming")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "upcoming" && styles.tabButtonTextActive,
              ]}
            >
              Upcoming {upcomingCount > 0 ? `(${upcomingCount})` : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "past" && styles.tabButtonActive]}
            onPress={() => setActiveTab("past")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "past" && styles.tabButtonTextActive,
              ]}
            >
              Past {pastCount > 0 ? `(${pastCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBadge}>
              <CalendarDays size={24} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No events in this view</Text>
            <Text style={styles.emptySubtitle}>
              There are no {activeTab} events matching your search criteria.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const userRole = formatRole(selectedOrg?.role || user?.role);

          return (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() => handleSelectEvent(item)}
              activeOpacity={0.88}
            >
              {/* Event Card Header Row */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.eventTitleGroup}>
                  <Text style={styles.eventName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <CalendarDays size={13} color="#64748B" />
                    <Text style={styles.metaText}>{item.eventDate}</Text>
                  </View>
                </View>

                {renderStatusBadge(item.status)}
              </View>

              {/* Venue & Role Row */}
              <View style={styles.cardDetailRow}>
                <View style={styles.venueItem}>
                  <MapPin size={13} color="#64748B" />
                  <Text style={styles.venueText} numberOfLines={1}>
                    {item.venue || "Main Convention Center"}
                  </Text>
                </View>
              </View>

              {/* Card Footer: Role & Action Chevron */}
              <View style={styles.cardFooterRow}>
                <View style={styles.roleChip}>
                  <Shield size={11} color="#6D28D9" />
                  <Text style={styles.roleChipText}>{userRole}</Text>
                </View>

                <View style={styles.arrowRow}>
                  {item.status === "active" && (
                    <Text style={styles.attendeesCountText}>
                      {item.currentlyInsideCount.toLocaleString()} inside
                    </Text>
                  )}
                  <ChevronRight size={18} color="#94A3B8" />
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  orgPill: {
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: 200,
  },
  orgPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* Header Section */
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 18,
  },
  iconCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Search Bar */
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    height: "100%",
  },

  /* Segmented Tabs */
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tabsTrack: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  tabButtonTextActive: {
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* List */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6D28D9",
  },
  eventTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  eventName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: "#64748B",
  },

  /* Status Badges */
  statusLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
  },
  statusLiveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.3,
  },
  statusUpcomingBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusUpcomingText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.3,
  },
  statusPastBadge: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPastText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.3,
  },

  /* Venue Row */
  cardDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  venueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  venueText: {
    fontSize: 12,
    color: "#64748B",
  },

  /* Card Footer */
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6D28D9",
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  attendeesCountText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#059669",
  },

  /* Empty State */
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    marginTop: 12,
  },
  emptyIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
});
