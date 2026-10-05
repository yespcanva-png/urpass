import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useEvent } from "../context/EventContext";

// Screens
import { LoginScreen } from "../screens/auth/LoginScreen";
import { OrgEventSelectScreen } from "../screens/auth/OrgEventSelectScreen";
import { EventOperationsHomeScreen } from "../screens/operations/EventOperationsHomeScreen";
import { LiveGateDashboardScreen } from "../screens/operations/LiveGateDashboardScreen";
import { GateManagementScreen } from "../screens/operations/GateManagementScreen";
import { ActivityFeedScreen } from "../screens/operations/ActivityFeedScreen";
import { DeviceManagementScreen } from "../screens/operations/DeviceManagementScreen";
import { QRScannerScreen } from "../screens/scanner/QRScannerScreen";
import { AttendeeSearchScreen } from "../screens/attendees/AttendeeSearchScreen";
import { AttendeeProfileScreen } from "../screens/attendees/AttendeeProfileScreen";
import { GateStaffManagementScreen } from "../screens/staff/GateStaffManagementScreen";
import { ScanAuditLogScreen } from "../screens/audit/ScanAuditLogScreen";

export type ScreenName =
  | "Login"
  | "OrgEventSelect"
  | "OperationsHome"
  | "QRScanner"
  | "LiveGateDashboard"
  | "GateManagement"
  | "ActivityFeed"
  | "DeviceManagement"
  | "AttendeeSearch"
  | "AttendeeProfile"
  | "GateStaffManagement"
  | "ScanAuditLog";

export function AppNavigator() {
  const { authToken } = useAuth();
  const { selectedEvent } = useEvent();

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(
    authToken ? (selectedEvent ? "OperationsHome" : "OrgEventSelect") : "Login"
  );
  const [screenParams, setScreenParams] = useState<any>({});
  const [navHistory, setNavHistory] = useState<ScreenName[]>([]);

  const navigation = {
    navigate: (screen: ScreenName, params?: any) => {
      setNavHistory((prev) => [...prev, currentScreen]);
      setScreenParams(params || {});
      if ((screen as any) === "MainTabs") {
        setCurrentScreen("OperationsHome");
      } else {
        setCurrentScreen(screen);
      }
    },
    goBack: () => {
      if (navHistory.length > 0) {
        const prev = navHistory[navHistory.length - 1];
        setNavHistory((hist) => hist.slice(0, hist.length - 1));
        setCurrentScreen(prev);
      } else {
        setCurrentScreen("OperationsHome");
      }
    },
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "Login":
        return <LoginScreen navigation={navigation} />;
      case "OrgEventSelect":
        return <OrgEventSelectScreen navigation={navigation} />;
      case "OperationsHome":
        return <EventOperationsHomeScreen navigation={navigation} />;
      case "QRScanner":
        return <QRScannerScreen navigation={navigation} />;
      case "LiveGateDashboard":
        return <LiveGateDashboardScreen navigation={navigation} />;
      case "GateManagement":
        return <GateManagementScreen navigation={navigation} />;
      case "ActivityFeed":
        return <ActivityFeedScreen navigation={navigation} />;
      case "DeviceManagement":
        return <DeviceManagementScreen navigation={navigation} />;
      case "AttendeeSearch":
        return <AttendeeSearchScreen navigation={navigation} />;
      case "AttendeeProfile":
        return <AttendeeProfileScreen navigation={navigation} route={{ params: screenParams }} />;
      case "GateStaffManagement":
        return <GateStaffManagementScreen navigation={navigation} />;
      case "ScanAuditLog":
        return <ScanAuditLogScreen navigation={navigation} />;
      default:
        return <EventOperationsHomeScreen navigation={navigation} />;
    }
  };

  const showBottomNav =
    currentScreen !== "Login" &&
    currentScreen !== "OrgEventSelect" &&
    currentScreen !== "QRScanner";

  return (
    <View style={styles.rootContainer}>
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {showBottomNav && (
        <SafeAreaView style={styles.bottomNavWrapper}>
          <View style={styles.bottomTabBar}>
            <TouchableOpacity
              style={[styles.tabItem, currentScreen === "OperationsHome" && styles.tabItemActive]}
              onPress={() => navigation.navigate("OperationsHome")}
            >
              <Text style={styles.tabIcon}>⚡</Text>
              <Text style={[styles.tabLabel, currentScreen === "OperationsHome" && styles.tabLabelActive]}>
                Ops
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentScreen === "AttendeeSearch" && styles.tabItemActive]}
              onPress={() => navigation.navigate("AttendeeSearch")}
            >
              <Text style={styles.tabIcon}>🔍</Text>
              <Text style={[styles.tabLabel, currentScreen === "AttendeeSearch" && styles.tabLabelActive]}>
                Attendees
              </Text>
            </TouchableOpacity>

            {/* Central High-Speed Scanner Button */}
            <TouchableOpacity
              style={styles.scannerCenterBtn}
              onPress={() => navigation.navigate("QRScanner")}
              activeOpacity={0.85}
            >
              <Text style={styles.scannerCenterIcon}>📷</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentScreen === "LiveGateDashboard" && styles.tabItemActive]}
              onPress={() => navigation.navigate("LiveGateDashboard")}
            >
              <Text style={styles.tabIcon}>🚪</Text>
              <Text style={[styles.tabLabel, currentScreen === "LiveGateDashboard" && styles.tabLabelActive]}>
                Gates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentScreen === "ActivityFeed" && styles.tabItemActive]}
              onPress={() => navigation.navigate("ActivityFeed")}
            >
              <Text style={styles.tabIcon}>📡</Text>
              <Text style={[styles.tabLabel, currentScreen === "ActivityFeed" && styles.tabLabelActive]}>
                Stream
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNavWrapper: {
    backgroundColor: COLORS.white,
  },
  bottomTabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 4,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: COLORS.brand,
    fontWeight: "800",
  },
  scannerCenterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  scannerCenterIcon: {
    fontSize: 22,
  },
});
