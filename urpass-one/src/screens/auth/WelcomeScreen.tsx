import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ShieldCheck, Wifi, Zap } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

interface WelcomeScreenProps {
  navigation?: any;
}

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Top Section — UrPass Logo & Wordmark */}
        <View style={styles.topSection}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.brandLogoImage}
            resizeMode="contain"
          />
        </View>

        {/* Hero Copy Section */}
        <View style={styles.heroSection}>
          <Text style={styles.appTitle}>UrPass One</Text>

          <Text style={styles.supportingHeadline}>
            One app. Every gate. Every pass. One source of truth.
          </Text>

          <Text style={styles.supportingCopy}>
            Manage event access, gate operations and attendee check-ins securely from one place.
          </Text>

          {/* Enterprise Capabilities Preview Cards */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Zap size={17} color={COLORS.brand} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Sub-Second QR Validation</Text>
                <Text style={styles.featureSubtitle}>Instant gate check-in & direction tracking</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <ShieldCheck size={17} color={COLORS.brand} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Duplicate Re-Use Protection</Text>
                <Text style={styles.featureSubtitle}>Real-time atomic pass verification</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Wifi size={17} color={COLORS.brand} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Offline Resilient Ops</Text>
                <Text style={styles.featureSubtitle}>Continuous gate entry when network drops</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom CTA & Footer Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation?.navigate("SignIn")}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.poweredByRow}>
            <Text style={styles.poweredByText}>Powered by UrPass</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "flex-start",
    paddingTop: 8,
  },
  brandLogoImage: {
    width: 130,
    height: 48,
  },
  heroSection: {
    paddingVertical: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  supportingHeadline: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27272A",
    lineHeight: 22,
    marginBottom: 10,
  },
  supportingCopy: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 24,
  },
  featuresContainer: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  featureSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  bottomSection: {
    paddingTop: 16,
    gap: 14,
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: COLORS.brand,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  poweredByRow: {
    alignItems: "center",
  },
  poweredByText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textLightMuted,
    letterSpacing: 0.5,
  },
});
