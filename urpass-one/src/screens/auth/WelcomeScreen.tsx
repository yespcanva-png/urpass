import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Zap, ShieldCheck, Wifi, Ticket, ArrowRight } from "lucide-react-native";

interface WelcomeScreenProps {
  navigation?: any;
}

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section — Brand Wordmark */}
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Ticket size={16} color="#6D28D9" />
            <Text style={styles.brandWordmark}>URPASS</Text>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.appTag}>
              <Text style={styles.appTagText}>MOBILE OPERATIONS</Text>
            </View>
          </View>

          <Text style={styles.appTitle}>UrPass One</Text>

          <Text style={styles.supportingHeadline}>
            One app. Every gate. Every pass. One source of truth.
          </Text>

          <Text style={styles.supportingCopy}>
            Manage event access, gate operations and attendee check-ins securely from one place.
          </Text>

          {/* Capabilities Highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Zap size={16} color="#6D28D9" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Sub-Second QR Validation</Text>
                <Text style={styles.featureSubtitle}>Instant gate check-in &amp; direction tracking</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <ShieldCheck size={16} color="#6D28D9" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Duplicate Re-Use Protection</Text>
                <Text style={styles.featureSubtitle}>Real-time atomic pass verification</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Wifi size={16} color="#6D28D9" />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Offline Resilient Ops</Text>
                <Text style={styles.featureSubtitle}>Continuous gate entry when network drops</Text>
              </View>
            </View>
          </View>

          {/* Action CTAs: Sign In & Sign Up */}
          <View style={styles.ctaGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation?.navigate("SignIn")}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation?.navigate("Signup")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.poweredByText}>Powered by UrPass</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    maxWidth: 440,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandWordmark: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#0F172A",
    textTransform: "uppercase",
  },

  /* Card */
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#F1F1F4",
    padding: 24,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  badgeRow: {
    marginBottom: 12,
  },
  appTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(109,40,217,0.08)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.15)",
  },
  appTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6D28D9",
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  supportingHeadline: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 21,
    marginBottom: 8,
  },
  supportingCopy: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
    marginBottom: 20,
  },

  /* Features */
  featuresContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  featureSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },

  /* CTA Group */
  ctaGroup: {
    gap: 10,
    width: "100%",
  },
  primaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6D28D9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  /* Footer */
  poweredByText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 24,
    textAlign: "center",
  },
});
