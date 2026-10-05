import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
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
import { Badge } from "../../components/common/Badge";
import type { Attendee, PassType } from "../../types";

const PASS_FILTERS: (PassType | "all")[] = [
  "all",
  "vip",
  "speaker",
  "delegate",
  "student",
  "participant",
  "exhibitor",
  "staff",
];

export function AttendeeSearchScreen({ navigation }: { navigation?: any }) {
  const { selectedEvent, assignedGate } = useEvent();
  const { user, deviceId } = useAuth();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassType, setSelectedPassType] = useState<PassType | "all">("all");
  const [presenceFilter, setPresenceFilter] = useState<"all" | "inside" | "outside">("all");
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendees() {
      if (!selectedEvent) return;
      const list = await OfflineDb.getAttendees(selectedEvent.id);
      setAttendees(list);
    }
    loadAttendees();
  }, [selectedEvent]);

  const filteredAttendees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return attendees.filter((a) => {
      // Search query filter
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        (a.ticketNumber && a.ticketNumber.toLowerCase().includes(query)) ||
        (a.registrationId && a.registrationId.toLowerCase().includes(query)) ||
        (a.passToken && a.passToken.toLowerCase().includes(query));

      // Pass type filter
      const matchesPassType =
        selectedPassType === "all" || a.passType === selectedPassType;

      // Presence filter
      const matchesPresence =
        presenceFilter === "all" || a.presenceStatus === presenceFilter;

      return matchesQuery && matchesPassType && matchesPresence;
    });
  }, [attendees, searchQuery, selectedPassType, presenceFilter]);

  async function handleQuickCheckin(attendee: Attendee) {
    if (!selectedEvent || !assignedGate) {
      Alert.alert("Configuration Error", "Please assign an event and gate first.");
      return;
    }

    setIsActionLoading(attendee.id);
    try {
      const direction = attendee.presenceStatus === "inside" ? "out" : "in";
      const result = await ValidationService.validateScan(attendee.passToken || attendee.id, {
        eventId: selectedEvent.id,
        gate: assignedGate,
        direction,
        deviceId,
        deviceName: deviceId,
        userId: user?.id || "staff",
        userName: user?.name || "Staff",
      });

      if (result.allowed && result.attendee) {
        setAttendees((prev) =>
          prev.map((a) => (a.id === result.attendee!.id ? result.attendee! : a))
        );
        Alert.alert(
          "Success",
          `${attendee.name} has been ${direction === "in" ? "Checked In" : "Checked Out"}.`
        );
      } else {
        Alert.alert("Action Denied", result.rejectionReason || result.message);
      }
    } finally {
      setIsActionLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Attendee Search & Lookup"
        subtitle={`${filteredAttendees.length} of ${attendees.length} Attendees`}
        showEventSwitcher={false}
      />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name, Email, Ticket #, or Pass Token..."
          placeholderTextColor={COLORS.textLightMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

      {/* Filter Horizontal Scrolls */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {PASS_FILTERS.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedPassType === type && styles.filterChipActive,
              ]}
              onPress={() => setSelectedPassType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedPassType === type && styles.filterChipTextActive,
                ]}
              >
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.presenceToggleRow}>
          {(["all", "inside", "outside"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.presenceBtn,
                presenceFilter === p && styles.presenceBtnActive,
              ]}
              onPress={() => setPresenceFilter(p)}
            >
              <Text
                style={[
                  styles.presenceBtnText,
                  presenceFilter === p && styles.presenceBtnTextActive,
                ]}
              >
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Attendee FlatList */}
      <FlatList
        data={filteredAttendees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Attendees Found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search query or pass type filters.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isInside = item.presenceStatus === "inside";
          const isLoading = isActionLoading === item.id;

          return (
            <TouchableOpacity
              style={styles.attendeeCard}
              onPress={() =>
                navigation?.navigate("AttendeeProfile", { attendeeId: item.id })
              }
              activeOpacity={0.8}
            >
              <View style={styles.cardMain}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.attendeeName}>{item.name}</Text>
                </View>

                <Text style={styles.attendeeEmail}>{item.email}</Text>
                {item.company && <Text style={styles.companyText}>🏢 {item.company}</Text>}

                <Text style={styles.attendeeTicket}>
                  {item.ticketNumber || item.registrationId || "Pass"} • {item.ticketName}
                </Text>

                <View style={styles.tagsRow}>
                  <Badge label={item.passType.toUpperCase()} variant="brand" size="sm" />
                  <Badge
                    label={isInside ? "INSIDE" : "OUTSIDE"}
                    variant={isInside ? "green" : "neutral"}
                    size="sm"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.quickCheckinBtn,
                  isInside ? styles.btnCheckout : styles.btnCheckin,
                ]}
                onPress={() => handleQuickCheckin(item)}
                disabled={isLoading}
              >
                <Text style={styles.quickCheckinText}>
                  {isLoading ? "..." : isInside ? "Out 🚪" : "In ⚡"}
                </Text>
              </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  filtersWrapper: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  presenceToggleRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
  },
  presenceBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
  },
  presenceBtnActive: {
    backgroundColor: COLORS.brandLight,
    borderColor: COLORS.brand,
  },
  presenceBtnText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.4,
  },
  presenceBtnTextActive: {
    color: COLORS.brand,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  emptyBox: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  attendeeCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardMain: {
    flex: 1,
    paddingRight: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  attendeeEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  attendeeTicket: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  companyText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  quickCheckinBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCheckin: {
    backgroundColor: COLORS.green,
  },
  btnCheckout: {
    backgroundColor: COLORS.blue,
  },
  quickCheckinText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
});
