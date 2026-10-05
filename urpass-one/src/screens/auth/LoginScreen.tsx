import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import type { UserRole } from "../../types";

const ROLE_PRESETS: { role: UserRole; label: string; email: string; desc: string }[] = [
  {
    role: "event_manager",
    label: "Event Manager",
    email: "manager@urpass.space",
    desc: "Full ops, gates, overrides, staff & analytics",
  },
  {
    role: "gate_manager",
    label: "Gate Manager",
    email: "gatemgr@urpass.space",
    desc: "Gate config, attendee lookup & overrides",
  },
  {
    role: "gate_staff",
    label: "Gate Staff / Scanner",
    email: "scanner@urpass.space",
    desc: "High-speed QR scanning & check-in",
  },
  {
    role: "super_admin",
    label: "Super Admin",
    email: "admin@urpass.space",
    desc: "Full platform permissions & all events",
  },
  {
    role: "view_only_ops",
    label: "View-Only Ops",
    email: "viewer@urpass.space",
    desc: "Live gate telemetry & headcount observer",
  },
];

interface LoginScreenProps {
  navigation?: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, verifyOtp, deviceId, isLoading } = useAuth();

  const [email, setEmail] = useState("manager@urpass.space");
  const [selectedRole, setSelectedRole] = useState<UserRole>("event_manager");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSendOtp() {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    setErrorMsg("");
    setStep("otp");
    setOtp("123456"); // Pre-fill default test OTP for field testing
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) {
      setErrorMsg("Please enter the 6-digit verification code");
      return;
    }
    setErrorMsg("");
    const success = await verifyOtp(email, otp);
    if (success) {
      navigation?.navigate("OrgEventSelect");
    } else {
      setErrorMsg("Invalid OTP code. Please try again.");
    }
  }

  async function handleQuickRoleLogin(rolePreset: typeof ROLE_PRESETS[0]) {
    setEmail(rolePreset.email);
    setSelectedRole(rolePreset.role);
    setErrorMsg("");
    const success = await login(rolePreset.email, rolePreset.role);
    if (success) {
      navigation?.navigate("OrgEventSelect");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>⚡</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>UrPass One</Text>
              <Text style={styles.brandSubtitle}>Mobile Event Operations</Text>
            </View>
          </View>
          <Badge label={`DEV: ${deviceId}`} variant="neutral" size="sm" />
        </View>

        {/* Login Form Box */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>
            {step === "credentials" ? "Sign In" : "Two-Step Verification"}
          </Text>
          <Text style={styles.cardSubtext}>
            {step === "credentials"
              ? "Enter your staff email to access live event gates"
              : `Enter the 6-digit code sent to ${email}`}
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {step === "credentials" ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Staff Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@organization.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <Button
                title="Continue with OTP"
                onPress={handleSendOtp}
                loading={isLoading}
                variant="brand"
                size="lg"
                style={styles.actionBtn}
              />
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>6-Digit Verification Code</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="123456"
                  placeholderTextColor={COLORS.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <Button
                title="Verify & Enter Workspace"
                onPress={handleVerifyOtp}
                loading={isLoading}
                size="lg"
                variant="success"
                style={styles.actionBtn}
              />

              <TouchableOpacity
                onPress={() => setStep("credentials")}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>← Change Email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Quick Role Switcher */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetHeading}>QUICK FIELD PROFILES</Text>
          <Text style={styles.presetSubheading}>
            Select a role preset for immediate evaluation without OTP:
          </Text>

          <View style={styles.presetGrid}>
            {ROLE_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.role}
                style={[
                  styles.presetCard,
                  selectedRole === preset.role && styles.presetCardActive,
                ]}
                onPress={() => handleQuickRoleLogin(preset)}
                activeOpacity={0.8}
              >
                <View style={styles.presetTop}>
                  <Text style={styles.presetLabel}>{preset.label}</Text>
                  <Badge
                    label={preset.role.replace("_", " ")}
                    variant={preset.role === "event_manager" ? "brand" : preset.role === "gate_staff" ? "green" : "neutral"}
                    size="sm"
                  />
                </View>
                <Text style={styles.presetDesc}>{preset.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorderSubtle,
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  cardSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  errorBox: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.redBorder,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 8,
    textAlign: "center",
  },
  actionBtn: {
    marginTop: 6,
  },
  backBtn: {
    alignSelf: "center",
    marginTop: 12,
    padding: 6,
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  presetsSection: {
    marginTop: 4,
  },
  presetHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  presetSubheading: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  presetGrid: {
    gap: 8,
  },
  presetCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorderSubtle,
    borderRadius: 14,
    padding: 14,
  },
  presetCardActive: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.surfaceLight,
  },
  presetTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  presetDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
});
