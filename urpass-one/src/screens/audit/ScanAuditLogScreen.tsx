import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useEvent } from "../../context/EventContext";
import { OfflineDb } from "../../services/offlineDb";
import { Header } from "../../components/common/Header";
import { Badge } from "../../components/common/Badge";
import type { ScanAuditLog } from "../../types";

export function ScanAuditLogScreen({ navigation }: { navigation?: any }) {
  const { selectedEvent } = useEvent();
  const [logs, setLogs] = useState<ScanAuditLog[]>([]);
  const [filterResult, setFilterResult] = useState<"all" | "allowed" | "denied" | "override">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLogs() {
      if (!selectedEvent) return;
      const loaded = await OfflineDb.getAuditLogs(selectedEvent.id);
      setLogs(loaded);
    }
    loadLogs();
  }, [selectedEvent]);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesQuery =
        !q ||
        (log.attendeeName && log.attendeeName.toLowerCase().includes(q)) ||
        log.qrPayload.toLowerCase().includes(q) ||
        log.gateName.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q);

      const matchesResult =
        filterResult === "all" ||
        (filterResult === "allowed" && log.feedbackColor === "green" && !log.isOverride) ||
        (filterResult === "denied" && log.feedbackColor === "red") ||
        (filterResult === "override" && log.isOverride);

      return matchesQuery && matchesResult;
    });
  }, [logs, searchQuery, filterResult]);

  function handleExportLogs() {
    Alert.alert(
      "Export Security Audit Log",
      `Exported ${logs.length} scan records in CSV / JSON format for event security compliance.`
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Scan Audit Trail & Security Log"
        subtitle={`${filteredLogs.length} Scans Recorded`}
        showEventSwitcher={false}
        rightAction={
          <TouchableOpacity onPress={handleExportLogs} style={styles.exportBtn}>
            <Text style={styles.exportBtnText}>📥 Export</Text>
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by Attendee, Pass Token, Gate, or Staff..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Result Status Filter Pills */}
      <View style={styles.filterRow}>
        {(["all", "allowed", "denied", "override"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterPill,
              filterResult === status && styles.filterPillActive,
            ]}
            onPress={() => setFilterResult(status)}
          >
            <Text
              style={[
                styles.filterPillText,
                filterResult === status && styles.filterPillTextActive,
              ]}
            >
              {status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Audit Log FlatList */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Audit Records Found</Text>
            <Text style={styles.emptySub}>
              Scan attempts and manual overrides will appear here in real time.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isAllowed = item.feedbackColor === "green";
          const isOverride = item.isOverride;

          return (
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.logNameGroup}>
                  <Text style={styles.logTitle}>
                    {item.attendeeName || "Unregistered QR Pass"}
                  </Text>
                  <Text style={styles.logMeta}>
                    {item.gateName} • {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </Text>
                </View>

                <Badge
                  label={
                    isOverride
                      ? "OVERRIDE"
                      : isAllowed
                      ? item.direction === "in"
                        ? "ENTRY ALLOWED"
                        : "EXIT ALLOWED"
                      : item.resultStatus.toUpperCase()
                  }
                  variant={isOverride ? "amber" : isAllowed ? "green" : "red"}
                  size="sm"
                />
              </View>

              {/* Override Note / Rejection Reason */}
              {isOverride && (
                <View style={styles.overrideBox}>
                  <Text style={styles.overrideText}>
                    ⚡ Override by {item.overrideBy}: "{item.overrideReason || "Supervisor Approval"}"
                  </Text>
                </View>
              )}

              {/* Security Telemetry Footer */}
              <View style={styles.logFooter}>
                <Text style={styles.telemetryText}>
                  Staff: {item.userName} • Dev: {item.deviceId}
                </Text>
                <Text style={styles.tokenText}>{item.qrPayload}</Text>
              </View>
            </View>
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
  exportBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  exportBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  searchInput: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
  },
  filterPillActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  filterPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.white,
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
    textAlign: "center",
  },
  logCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 14,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  logNameGroup: {
    flex: 1,
    paddingRight: 8,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  logMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  overrideBox: {
    backgroundColor: COLORS.amberLight,
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  overrideText: {
    color: COLORS.amber,
    fontSize: 11,
    fontWeight: "600",
  },
  logFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  telemetryText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tokenText: {
    fontSize: 9,
    fontFamily: "monospace",
    color: COLORS.textMuted,
  },
});
