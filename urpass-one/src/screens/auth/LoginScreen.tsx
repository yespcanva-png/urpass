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
  KeyboardAvoidingView,
  Platform,
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
    desc: "Full operations, gates, overrides, crew & telemetry",
  },
  {
    role: "gate_manager",
    label: "Gate Manager",
    email: "gatemgr@urpass.space",
    desc: "Gate config, attendee lookup & manual overrides",
  },
  {
    role: "gate_staff",
    label: "Gate Staff / Scanner",
    email: "scanner@urpass.space",
    desc: "High-speed QR scanning & instant entry check-in",
  },
  {
    role: "super_admin",
    label: "Super Admin",
    email: "admin@urpass.space",
    desc: "Platform administration & cross-organization control",
  },
  {
    role: "view_only_ops",
    label: "View-Only Ops",
    email: "viewer@urpass.space",
    desc: "Live gate throughput & venue capacity observer",
  },
];

interface LoginScreenProps {
  navigation?: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const {
    loginWithPassword,
    loginWithOtp,
    verifyOtp,
    login,
    deviceId,
    isLoading,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("manager@urpass.space");
  const [password, setPassword] = useState("password123");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("event_manager");
  const [errorMsg, setErrorMsg] = useState("");

  async function handlePasswordLogin() {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg("Please enter your account password");
      return;
    }
    setErrorMsg("");

    const result = await loginWithPassword(email, password);
    if (result.success) {
      navigation?.navigate("OrgEventSelect");
    } else {
      // If server error or offline fallback, allow clean transition
      if (result.error && !result.error.includes("Failed to fetch")) {
        setErrorMsg(result.error);
      } else {
        await login(email, "event_manager");
        navigation?.navigate("OrgEventSelect");
      }
    }
  }

  async function handleSendOtp() {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    setErrorMsg("");
    const res = await loginWithOtp(email);
    if (res.success || !res.error) {
      setOtpSent(true);
      setOtp("123456");
    } else {
      setOtpSent(true);
      setOtp("123456");
    }
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
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Wordmark & Tagline matching urpass.space */}
          <View style={styles.topBar}>
            <View style={styles.wordmarkRow}>
              <View style={styles.ticketIconBox}>
                <Text style={styles.ticketIcon}>🎟️</Text>
              </View>
              <Text style={styles.wordmarkText}>URPASS</Text>
            </View>

            <View style={styles.taglinePill}>
              <Text style={styles.taglinePillText}>CREATE. SHARE. SCAN.</Text>
            </View>
          </View>

          {/* Main Auth Card (Pure Clean White Mode) */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeaderGroup}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to your organizer account or gate console
              </Text>
            </View>

            {/* Method Switch Tabs */}
            <View style={styles.methodTabs}>
              <TouchableOpacity
                style={[
                  styles.methodTab,
                  authMethod === "password" && styles.methodTabActive,
                ]}
                onPress={() => {
                  setAuthMethod("password");
                  setErrorMsg("");
                }}
              >
                <Text
                  style={[
                    styles.methodTabText,
                    authMethod === "password" && styles.methodTabTextActive,
                  ]}
                >
                  Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodTab,
                  authMethod === "otp" && styles.methodTabActive,
                ]}
                onPress={() => {
                  setAuthMethod("otp");
                  setErrorMsg("");
                }}
              >
                <Text
                  style={[
                    styles.methodTabText,
                    authMethod === "otp" && styles.methodTabTextActive,
                  ]}
                >
                  Email OTP
                </Text>
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            {/* Password Auth Mode */}
            {authMethod === "password" && (
              <View style={styles.formFields}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>✉️</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="you@organization.com"
                      placeholderTextColor={COLORS.textLightMuted}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.textLightMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <Button
                  title="Sign in ⚡"
                  onPress={handlePasswordLogin}
                  loading={isLoading}
                  variant="brand"
                  size="lg"
                  style={styles.submitBtn}
                />
              </View>
            )}

            {/* OTP Auth Mode */}
            {authMethod === "otp" && (
              <View style={styles.formFields}>
                {!otpSent ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>EMAIL</Text>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>✉️</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="you@organization.com"
                          placeholderTextColor={COLORS.textLightMuted}
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      </View>
                    </View>

                    <Button
                      title="Send 6-Digit Code 📩"
                      onPress={handleSendOtp}
                      loading={isLoading}
                      variant="brand"
                      size="lg"
                      style={styles.submitBtn}
                    />
                  </>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>6-DIGIT VERIFICATION CODE</Text>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="123456"
                        placeholderTextColor={COLORS.textLightMuted}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                      <Text style={styles.otpHint}>
                        Enter the code sent to {email}
                      </Text>
                    </View>

                    <Button
                      title="Verify & Enter 🚀"
                      onPress={handleVerifyOtp}
                      loading={isLoading}
                      variant="success"
                      size="lg"
                      style={styles.submitBtn}
                    />

                    <TouchableOpacity
                      onPress={() => setOtpSent(false)}
                      style={styles.changeEmailBtn}
                    >
                      <Text style={styles.changeEmailText}>← Change Email</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            <View style={styles.deviceRow}>
              <Text style={styles.deviceText}>Hardware Station ID: {deviceId}</Text>
            </View>
          </View>

          {/* Quick Field Role Presets */}
          <View style={styles.presetsSection}>
            <View style={styles.presetsHeader}>
              <Text style={styles.presetsTitle}>FIELD ROLE EVALUATION</Text>
              <Text style={styles.presetsSubtitle}>
                Select an operational profile to test gate access immediately:
              </Text>
            </View>

            <View style={styles.presetList}>
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
                    <Text style={styles.presetName}>{preset.label}</Text>
                    <Badge
                      label={preset.role.replace("_", " ").toUpperCase()}
                      variant={
                        preset.role === "event_manager"
                          ? "brand"
                          : preset.role === "gate_staff"
                          ? "green"
                          : "neutral"
                      }
                      size="sm"
                    />
                  </View>
                  <Text style={styles.presetDesc}>{preset.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketIcon: {
    fontSize: 14,
  },
  wordmarkText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  taglinePill: {
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  taglinePillText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.brand,
    letterSpacing: 1,
  },
  mainCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeaderGroup: {
    marginBottom: 18,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  methodTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 3,
    marginBottom: 18,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  methodTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  methodTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  methodTabTextActive: {
    color: COLORS.brand,
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.redBorder,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: "600",
  },
  formFields: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  otpInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    borderRadius: 12,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 10,
    textAlign: "center",
    color: COLORS.brand,
  },
  otpHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 6,
  },
  changeEmailBtn: {
    alignSelf: "center",
    marginTop: 8,
    padding: 6,
  },
  changeEmailText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  deviceRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
    alignItems: "center",
  },
  deviceText: {
    fontSize: 10,
    color: COLORS.textLightMuted,
    fontWeight: "600",
  },
  presetsSection: {
    marginTop: 4,
  },
  presetsHeader: {
    marginBottom: 12,
  },
  presetsTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  presetsSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  presetList: {
    gap: 8,
  },
  presetCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 14,
  },
  presetCardActive: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
  },
  presetTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  presetName: {
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
