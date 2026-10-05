import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  DoorOpen,
  Shield,
  Smartphone,
  Wifi,
  WifiOff,
  LogOut,
  ChevronRight,
  RefreshCw,
  HardDrive,
  Lock,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { useOffline } from "../../context/OfflineContext";

interface ProfileScreenProps {
  navigation?: any;
}

function formatRole(role?: string): string {
  if (!role) return "Event Staff";
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

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, deviceId, logout } = useAuth();
  const { selectedOrg, selectedEvent, assignedGate } = useEvent();
  const { isOnline, pendingQueueCount, syncNow, isSyncing, lastSyncAt } = useOffline();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function handleGoBack() {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate("OperationsHome");
    }
  }

  function confirmLogout() {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of UrPass One on this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              navigation?.navigate("SignIn");
            } catch (err: any) {
              Alert.alert("Sign Out Error", err?.message || "Failed to sign out.");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userRoleText = formatRole(user?.role);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Account & Operations</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Identity Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{userInitial}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Operations Staff"}</Text>
          <Text style={styles.userEmail}>{user?.email || "staff@urpass.space"}</Text>

          <View style={styles.roleBadgeContainer}>
            <Shield size={12} color="#6D28D9" />
            <Text style={styles.roleBadgeText}>{userRoleText}</Text>
          </View>
        </View>

        {/* Current Operational Context */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>CURRENT OPERATIONAL CONTEXT</Text>
        </View>

        <View style={styles.contextContainer}>
          {/* Organisation */}
          <TouchableOpacity
            style={styles.contextRow}
            onPress={() => navigation?.navigate("OrgSelection")}
            activeOpacity={0.75}
          >
            <View style={styles.contextIconBox}>
              <Building2 size={18} color="#6D28D9" />
            </View>
            <View style={styles.contextTextGroup}>
              <Text style={styles.contextLabel}>ORGANISATION</Text>
              <Text style={styles.contextValue}>
                {selectedOrg?.name || "Yesp Corporation"}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Event */}
          <TouchableOpacity
            style={styles.contextRow}
            onPress={() => navigation?.navigate("EventSelection")}
            activeOpacity={0.75}
          >
            <View style={styles.contextIconBox}>
              <Calendar size={18} color="#2563EB" />
            </View>
            <View style={styles.contextTextGroup}>
              <Text style={styles.contextLabel}>ACTIVE EVENT</Text>
              <Text style={styles.contextValue}>
                {selectedEvent?.name || "Tech Summit 2026"}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Gate */}
          <TouchableOpacity
            style={styles.contextRow}
            onPress={() => navigation?.navigate("LiveGateDashboard")}
            activeOpacity={0.75}
          >
            <View style={styles.contextIconBox}>
              <DoorOpen size={18} color="#059669" />
            </View>
            <View style={styles.contextTextGroup}>
              <Text style={styles.contextLabel}>ASSIGNED GATE</Text>
              <Text style={styles.contextValue}>
                {assignedGate?.name || "Gate 1 (Main Entrance)"}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Device & Sync Telemetry */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>DEVICE & SYNCHRONIZATION</Text>
        </View>

        <View style={styles.telemetryCard}>
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabelRow}>
              <Smartphone size={14} color="#64748B" />
              <Text style={styles.telemetryLabel}>Device Station ID</Text>
            </View>
            <Text style={styles.telemetryValue} numberOfLines={1}>
              {deviceId || "DEV-URPASS-ONE"}
            </Text>
          </View>

          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabelRow}>
              <HardDrive size={14} color="#64748B" />
              <Text style={styles.telemetryLabel}>App Version</Text>
            </View>
            <Text style={styles.telemetryValue}>v1.0.0 Production</Text>
          </View>

          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabelRow}>
              {isOnline ? (
                <Wifi size={14} color="#059669" />
              ) : (
                <WifiOff size={14} color="#DC2626" />
              )}
              <Text style={styles.telemetryLabel}>Network State</Text>
            </View>
            <Text
              style={[
                styles.telemetryValue,
                { color: isOnline ? "#059669" : "#DC2626" },
              ]}
            >
              {isOnline ? "Online (Live Realtime)" : "Offline Mode"}
            </Text>
          </View>

          <View style={[styles.telemetryRow, { borderBottomWidth: 0 }]}>
            <View style={styles.telemetryLabelRow}>
              <RefreshCw size={14} color="#6D28D9" />
              <Text style={styles.telemetryLabel}>Pending Offline Queue</Text>
            </View>
            <TouchableOpacity
              onPress={() => syncNow()}
              disabled={isSyncing}
              style={styles.syncButtonSmall}
            >
              <Text style={styles.syncButtonSmallText}>
                {isSyncing ? "Syncing..." : `${pendingQueueCount} items`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
          disabled={isLoggingOut}
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#DC2626" />
          <Text style={styles.logoutButtonText}>
            {isLoggingOut ? "Signing out..." : "Sign Out of UrPass One"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          UrPass One Security Engine • Sub-0.3s QR Authentication
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  topBarSpacer: {
    width: 36,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* Profile Hero Card */
  profileHeroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FAF5FF",
    borderWidth: 1.5,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#6D28D9",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },
  roleBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
    marginTop: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D28D9",
  },

  /* Section Headings */
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },

  /* Context List */
  contextContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    marginBottom: 20,
  },
  contextRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  contextIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contextTextGroup: {
    flex: 1,
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.6,
  },
  contextValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 2,
  },

  /* Telemetry Card */
  telemetryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  telemetryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  telemetryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  telemetryLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  syncButtonSmall: {
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  syncButtonSmallText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* Logout Button */
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 16,
  },
});
