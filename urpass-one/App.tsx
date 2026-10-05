import React from "react";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import { registerRootComponent } from "expo";
import { COLORS } from "./src/constants/colors";
import { AuthProvider } from "./src/context/AuthContext";
import { EventProvider } from "./src/context/EventContext";
import { OfflineProvider } from "./src/context/OfflineContext";
import { AlertProvider } from "./src/context/AlertContext";
import { ScannerProvider } from "./src/context/ScannerContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <AuthProvider>
        <EventProvider>
          <OfflineProvider>
            <AlertProvider>
              <ScannerProvider>
                <AppNavigator />
              </ScannerProvider>
            </AlertProvider>
          </OfflineProvider>
        </EventProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },
});

registerRootComponent(App);
