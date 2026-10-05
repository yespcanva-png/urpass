import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useEvent } from "../../context/EventContext";
import { OfflineDb } from "../../services/offlineDb";
import { Header } from "../../components/common/Header";
import { Badge } from "../../components/common/Badge";
import type { ActivityFeedItem, ScanAuditLog } from "../../types";

export function ActivityFeedScreen({ navigation }: { navigation?: any }) {
  const { selectedEvent } = useEvent();
  const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>([]);
  const [filter, setFilter] = useState<"all" | "entries" | "violations" | "overrides">("all");

  useEffect(() => {
    async function loadLogs() {
      if (!selectedEvent) return;
      const logs = await OfflineDb.getAuditLogs(selectedEvent.id);

      const items: ActivityFeedItem[] = logs.map((log) => {
        let type: ActivityFeedItem["type"] = "check_in";
        let severity: ActivityFeedItem["severity"] = "normal";

        if (log.isOverride) {
          type = "override";
          severity = "warning";
        } else if (log.resultStatus === "already_checked_in") {
          type = "duplicate_rejected";
          severity = "warning";
        } else if (log.resultStatus === "valid_exit") {
          type = "check_out";
          severity = "normal";
        } else if (log.feedbackColor === "red") {
          type = "invalid_rejected";
          severity = "critical";
        } else {
          type = "check_in";
          severity = "success";
        }

        const date = new Date(log.timestamp);
        const timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        return {
          id: log.id,
          timestamp: log.timestamp,
          timeFormatted,
          type,
          title: log.attendeeName ? `${log.attendeeName} (${log.passType?.toUpperCase() || "PASS"})` : log.resultStatus.replace("_", " ").toUpperCase(),
          subtitle: log.isOverride
            ? `Override by ${log.overrideBy}: "${log.overrideReason || "Supervisor approval"}"`
            : log.resultStatus === "already_checked_in"
            ? "Duplicate pass scanned — Entry rejected"
            : log.feedbackColor === "red"
            ? `Denied: ${log.resultStatus.replace("_", " ")}`
            : `${log.direction === "in" ? "Checked In" : "Checked Out"} successfully`,
          gateName: log.gateName,
          severity,
        };
      });

      // Default mock events if no logs yet
      if (items.length === 0) {
        items.push(
          {
            id: "act-1",
            timestamp: new Date().toISOString(),
            timeFormatted: "10:42:15 AM",
            type: "check_in",
            title: "Priya Sharma (VIP)",
            subtitle: "Checked In successfully via UrPass QR",
            gateName: "Gate B – VIP & Keynote Speakers",
            severity: "success",
          },
          {
            id: "act-2",
            timestamp: new Date(Date.now() - 60000).toISOString(),
            timeFormatted: "10:41:02 AM",
            type: "duplicate_rejected",
            title: "Pass #TK-88219 (STUDENT)",
            subtitle: "Duplicate pass scanned — Already checked in at Gate A",
            gateName: "Gate A – Main Concourse",
            severity: "warning",
          },
          {
            id: "act-3",
            timestamp: new Date(Date.now() - 120000).toISOString(),
            timeFormatted: "10:39:45 AM",
            type: "override",
            title: "Rahul Varma (SPEAKER)",
            subtitle: "Override by Alex Gate Supervisor: 'ID Card Verified'",
            gateName: "Gate B – VIP & Keynote Speakers",
            severity: "warning",
          },
          {
            id: "act-4",
            timestamp: new Date(Date.now() - 180000).toISOString(),
            timeFormatted: "10:38:10 AM",
            type: "invalid_rejected",
            title: "Pass #TK-CANCELLED",
            subtitle: "Denied: cancelled_ticket — Pass revoked",
            gateName: "Gate C – Exhibition Pavilion",
            severity: "critical",
          }
        );
      }

      setFeedItems(items);
    }

    loadLogs();
  }, [selectedEvent]);

  const filteredFeed = feedItems.filter((item) => {
    if (filter === "entries") return item.type === "check_in" || item.type === "check_out";
    if (filter === "violations") return item.type === "duplicate_rejected" || item.type === "invalid_rejected";
    if (filter === "overrides") return item.type === "override";
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Live Activity Stream"
        subtitle="Real-time check-in stream & security audit"
        showEventSwitcher={false}
      />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {(["all", "entries", "violations", "overrides"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Live Stream List */}
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const getIcon = () => {
            switch (item.type) {
              case "check_in":
                return "✅";
              case "check_out":
                return "🚪";
              case "duplicate_rejected":
                return "⚠️";
              case "invalid_rejected":
                return "⛔";
              case "override":
                return "⚡";
              default:
                return "ℹ️";
            }
          };

          return (
            <View style={styles.feedCard}>
              <View style={styles.iconColumn}>
                <Text style={styles.actionIcon}>{getIcon()}</Text>
                <View style={styles.verticalLine} />
              </View>

              <View style={styles.contentColumn}>
                <View style={styles.feedHeaderRow}>
                  <Text style={styles.feedTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.feedTime}>{item.timeFormatted}</Text>
                </View>

                <Text style={styles.feedSubtitle}>{item.subtitle}</Text>

                <View style={styles.feedFooter}>
                  <Badge label={item.gateName} size="sm" variant="neutral" />
                  <Badge
                    label={item.type.replace("_", " ")}
                    size="sm"
                    variant={
                      item.severity === "success"
                        ? "green"
                        : item.severity === "warning"
                        ? "amber"
                        : "red"
                    }
                  />
                </View>
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
  filterBar: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
  },
  filterBtnActive: {
    backgroundColor: COLORS.brand,
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  filterBtnTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  feedCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  iconColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.surfaceBorderSubtle,
  },
  contentColumn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 12,
  },
  feedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  feedTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    flex: 1,
  },
  feedTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  feedSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  feedFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
