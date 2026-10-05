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
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";

interface LoginScreenProps {
  navigation?: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { loginWithPassword, signUp, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name");
        return;
      }

      const res = await signUp(fullName.trim(), email.trim(), password);
      if (res.needsEmailConfirmation) {
        setSuccessMsg("Account created! Please check your email to confirm your account.");
      } else if (res.success) {
        navigation?.navigate("OrgEventSelect");
      } else {
        setErrorMsg(res.error || "Failed to create account. Please try again.");
      }
    } else {
      // Login Mode
      const res = await loginWithPassword(email.trim(), password);
      if (res.success) {
        navigation?.navigate("OrgEventSelect");
      } else {
        setErrorMsg(res.error || "Invalid email or password. Please try again.");
      }
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
          {/* Top Brand Header matching urpass.space */}
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
            {/* Mode Switcher Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabBtn, authMode === "login" && styles.tabBtnActive]}
                onPress={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    authMode === "login" && styles.tabBtnTextActive,
                  ]}
                >
                  Sign in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, authMode === "signup" && styles.tabBtnActive]}
                onPress={() => {
                  setAuthMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    authMode === "signup" && styles.tabBtnTextActive,
                  ]}
                >
                  Create account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Card Header */}
            <View style={styles.cardHeaderGroup}>
              <Text style={styles.welcomeTitle}>
                {authMode === "login" ? "Welcome back" : "Create your account"}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {authMode === "login"
                  ? "Sign in to your organizer account"
                  : "Start creating events, issuing digital passes & checking attendees in"}
              </Text>
            </View>

            {/* Feedback Alerts */}
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            {successMsg ? (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>✓ {successMsg}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.formFields}>
              {authMode === "signup" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="John Doe"
                      placeholderTextColor={COLORS.textLightMuted}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@example.com"
                    placeholderTextColor={COLORS.textLightMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  {authMode === "login" && (
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Password Reset",
                          "Please visit https://urpass.space/forgot-password to reset your password."
                        )
                      }
                    >
                      <Text style={styles.forgotLink}>Forgot password?</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      authMode === "signup"
                        ? "At least 6 characters"
                        : "••••••••"
                    }
                    placeholderTextColor={COLORS.textLightMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Submit Action */}
              <Button
                title={authMode === "login" ? "Sign in" : "Create Account"}
                onPress={handleSubmit}
                loading={isLoading}
                variant="brand"
                size="lg"
                style={styles.submitBtn}
              />
            </View>

            {/* Bottom Toggle Prompt */}
            <View style={styles.bottomToggleRow}>
              <Text style={styles.bottomToggleText}>
                {authMode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <Text style={styles.bottomToggleLink}>
                  {authMode === "login" ? "Create one" : "Sign in"}
                </Text>
              </TouchableOpacity>
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
    paddingTop: 24,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketIcon: {
    fontSize: 16,
  },
  wordmarkText: {
    fontSize: 18,
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
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.brand,
    fontWeight: "800",
  },
  cardHeaderGroup: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.redBorder,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: "600",
    lineHeight: 16,
  },
  successBanner: {
    backgroundColor: COLORS.greenLight,
    borderColor: COLORS.greenBorder,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "600",
    lineHeight: 16,
  },
  formFields: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  forgotLink: {
    fontSize: 11,
    color: COLORS.brand,
    fontWeight: "700",
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
    paddingVertical: 13,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    marginTop: 8,
  },
  bottomToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
  },
  bottomToggleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomToggleLink: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brand,
  },
});
