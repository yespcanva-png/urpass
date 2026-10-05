import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { useOffline } from "../../context/OfflineContext";

export function OfflineBanner() {
  const { isOnline, isSyncing, pendingQueueCount, syncNow } = useOffline();

  if (isOnline && pendingQueueCount === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: !isOnline ? COLORS.amber : COLORS.blue,
        },
      ]}
    >
      <View style={styles.textRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: !isOnline ? COLORS.textDark : COLORS.white },
          ]}
        />
        <Text style={styles.message}>
          {!isOnline
            ? `Offline Mode (${pendingQueueCount} scans cached)`
            : isSyncing
            ? "Syncing scans to database..."
            : `${pendingQueueCount} offline scans pending sync`}
        </Text>
      </View>

      {isOnline && pendingQueueCount > 0 && !isSyncing && (
        <TouchableOpacity
          onPress={() => syncNow()}
          style={styles.syncButton}
          activeOpacity={0.8}
        >
          <Text style={styles.syncButtonText}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  message: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  syncButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  syncButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
});
