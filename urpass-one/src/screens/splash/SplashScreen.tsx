import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { COLORS } from "../../constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish?: () => void;
  isLoading?: boolean;
}

export function SplashScreen({ onFinish, isLoading = true }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // 1. Smooth elegant entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Subtle delay before showing loader (800ms) so instant app launch feels immediate
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 800);

    return () => clearTimeout(loaderTimer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background Decorative Element: Top-Left Subtle Oversized Ticket Outline Shape */}
      <View style={[styles.cornerTicketDecor, styles.topLeftTicket]} pointerEvents="none">
        <View style={styles.ticketCornerOutline}>
          <View style={styles.ticketNotchLeft} />
          <View style={styles.ticketNotchRight} />
        </View>
      </View>

      {/* Background Decorative Element: Bottom-Right Subtle Oversized Ticket Outline Shape */}
      <View style={[styles.cornerTicketDecor, styles.bottomRightTicket]} pointerEvents="none">
        <View style={styles.ticketCornerOutline}>
          <View style={styles.ticketNotchLeft} />
          <View style={styles.ticketNotchRight} />
        </View>
      </View>

      {/* Central Content (Ratio 9:19.5 Optimized) */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Top Spacer for upper-middle balance */}
        <View style={styles.topSpacer} />

        {/* UrPass Brand Logo & Wordmark */}
        <View style={styles.logoSection}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Tagline Section */}
        <View style={styles.taglineSection}>
          <Text style={styles.taglinePrimary}>One app. Every gate. Every pass.</Text>
          <Text style={styles.taglineSecondary}>One source of truth.</Text>
        </View>

        {/* Loading Indicator Area (Appears gracefully after ~800ms) */}
        <View style={styles.loadingArea}>
          {showLoader && isLoading && (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="small" color={COLORS.brand} />
            </View>
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  centerContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  topSpacer: {
    flex: 1.2,
  },
  bottomSpacer: {
    flex: 1.4,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  taglineSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 16,
  },
  taglinePrimary: {
    fontSize: 16,
    fontWeight: "400",
    color: "#475569",
    textAlign: "center",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  taglineSecondary: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6D28D9",
    textAlign: "center",
    letterSpacing: -0.2,
    lineHeight: 24,
    marginTop: 2,
  },
  loadingArea: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  loaderWrapper: {
    padding: 8,
    borderRadius: 20,
  },

  /* Background Subtle Ticket Outline Elements (5–8% opacity) */
  cornerTicketDecor: {
    position: "absolute",
    width: 220,
    height: 220,
    opacity: 0.07,
  },
  topLeftTicket: {
    top: -60,
    left: -60,
    transform: [{ rotate: "-18deg" }],
  },
  bottomRightTicket: {
    bottom: -60,
    right: -60,
    transform: [{ rotate: "22deg" }],
  },
  ticketCornerOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#7C3AED",
    borderRadius: 24,
    backgroundColor: "#FAF5FF",
    position: "relative",
    justifyContent: "center",
  },
  ticketNotchLeft: {
    position: "absolute",
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
  ticketNotchRight: {
    position: "absolute",
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
});
