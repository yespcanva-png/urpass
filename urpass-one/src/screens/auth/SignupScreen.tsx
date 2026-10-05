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
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

interface SignupScreenProps {
  navigation?: any;
}

function GoogleIcon() {
  return (
    <View style={styles.googleIconBox}>
      <Text style={styles.googleIconText}>G</Text>
    </View>
  );
}

export function SignupScreen({ navigation }: SignupScreenProps) {
  const { signUp, loginWithOtp, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState<"standard" | "sso">("standard");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSignupSubmit() {
    setServerError("");
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setServerError("Name must be at least 2 characters.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setServerError("Enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setServerError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp(trimmedName, trimmedEmail, password);
      if (res.needsEmailConfirmation) {
        setSubmittedEmail(trimmedEmail);
        setNeedsEmailConfirmation(true);
      } else if (res.success) {
        navigation?.navigate("OrgSelection");
      } else {
        setServerError(res.error || "Registration failed. Please try again.");
      }
    } catch {
      setServerError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignup() {
    setServerError("");
    setGoogleLoading(true);
    try {
      Alert.alert(
        "Google Workspace",
        "Sign up with your Google account",
        [
          { text: "Cancel", style: "cancel", onPress: () => setGoogleLoading(false) },
          {
            text: "Continue",
            onPress: async () => {
              const demoEmail = "organizer.lead@urpass.space";
              const ok = await loginWithOtp(demoEmail);
              setGoogleLoading(false);
              if (ok) {
                navigation?.navigate("OrgSelection");
              }
            },
          },
        ]
      );
    } catch {
      setGoogleLoading(false);
    }
  }

  async function handleSsoSubmit() {
    setServerError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setServerError("Enter your corporate or school email.");
      return;
    }

    setSsoLoading(true);
    setTimeout(() => {
      setSsoLoading(false);
      Alert.alert(
        "Enterprise SSO Registration",
        `Routing @${trimmedEmail.split("@")[1]} to corporate SAML 2.0 / OIDC Identity Provider for auto-provisioning.`,
        [
          {
            text: "Continue to IdP",
            onPress: async () => {
              await loginWithOtp(trimmedEmail);
              navigation?.navigate("OrgSelection");
            },
          },
        ]
      );
    }, 600);
  }

  // Email Confirmation State Screen
  if (needsEmailConfirmation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />
        <View style={styles.confirmContainer}>
          <View style={styles.card}>
            <View style={styles.confirmIconBadge}>
              <Text style={styles.confirmEmoji}>✉️</Text>
            </View>

            <Text style={styles.confirmTitle}>Check your email</Text>
            <Text style={styles.confirmSubtitle}>
              We sent a verification link to{" "}
              <Text style={styles.confirmEmailHighlight}>{submittedEmail}</Text>. Click the link in the
              email to activate your account.
            </Text>

            <View style={styles.confirmHelpBox}>
              <Text style={styles.confirmHelpHeader}>Didn't see the email?</Text>
              <Text style={styles.confirmHelpItem}>• Check your spam or promotions folder</Text>
              <Text style={styles.confirmHelpItem}>• Make sure {submittedEmail} was typed correctly</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation?.navigate("Login")}
              activeOpacity={0.88}
            >
              <Text style={styles.submitButtonText}>Go to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToStandardBtn}
              onPress={() => setNeedsEmailConfirmation(false)}
            >
              <Text style={styles.backToStandardText}>Use a different email address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top row: Back link + URPASS Wordmark */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack?.() || navigation?.navigate("Login")}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <View style={styles.ticketIconBadge}>
                <Text style={styles.ticketEmoji}>🎟️</Text>
              </View>
              <Text style={styles.brandWordmark}>URPASS</Text>
            </View>

            <View style={styles.headerRightSpacer} />
          </View>

          {/* Main Card — 100% Identical to https://urpass.space/signup */}
          <View style={styles.card}>
            {/* Header section */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {authMode === "sso" ? "Enterprise SSO" : "Create your account"}
              </Text>
              <Text style={styles.cardSubtitle}>
                {authMode === "sso"
                  ? "Join your organization via SAML 2.0 or OIDC Single Sign-On"
                  : "Start on the free plan — no credit card required"}
              </Text>
            </View>

            {authMode === "standard" ? (
              <>
                {/* Google OAuth Button */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignup}
                  disabled={googleLoading || isSubmitting}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator size="small" color="#64748B" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <Text style={styles.googleButtonText}>
                    {googleLoading ? "Signing in…" : "Continue with Google"}
                  </Text>
                </TouchableOpacity>

                {/* Enterprise SSO Switch Button */}
                <TouchableOpacity
                  style={styles.ssoSwitchButton}
                  onPress={() => {
                    setServerError("");
                    setAuthMode("sso");
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ssoBuildingIcon}>🏢</Text>
                  <Text style={styles.ssoSwitchButtonText}>Continue with Enterprise SSO</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or create with email</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Full Name Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>FULL NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLeftIcon}>👤</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Srinithin S"
                      placeholderTextColor="#94A3B8"
                      value={fullName}
                      onChangeText={(t) => {
                        setFullName(t);
                        setServerError("");
                      }}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLeftIcon}>✉️</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="you@example.com"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        setServerError("");
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLeftIcon}>🔒</Text>
                    <TextInput
                      style={[styles.textInput, { paddingRight: 40 }]}
                      placeholder="••••••••"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={(t) => {
                        setPassword(t);
                        setServerError("");
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.passwordToggleText}>
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Banner */}
                {!!serverError && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{serverError}</Text>
                  </View>
                )}

                {/* Create account Button */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSignupSubmit}
                  disabled={isSubmitting || googleLoading}
                  activeOpacity={0.88}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Create account</Text>
                  )}
                </TouchableOpacity>

                {/* Terms Notice */}
                <Text style={styles.termsText}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>

                {/* Bottom Login Switch */}
                <View style={styles.bottomSwitchRow}>
                  <Text style={styles.bottomSwitchText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation?.navigate("Login")}>
                    <Text style={styles.bottomSwitchLink}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Enterprise SSO Mode */
              <View style={styles.ssoContainer}>
                <View style={styles.ssoInfoBox}>
                  <View style={styles.ssoShieldBadge}>
                    <Text style={styles.ssoShieldIcon}>🛡️</Text>
                  </View>
                  <Text style={styles.ssoInfoText}>
                    Enter your corporate or school email to join via SAML 2.0 / OIDC Single Sign-On.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>CORPORATE / STUDENT EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLeftIcon}>✉️</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="name@company.com"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        setServerError("");
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {!!serverError && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{serverError}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.submitButton, ssoLoading && styles.submitButtonDisabled]}
                  onPress={handleSsoSubmit}
                  disabled={ssoLoading}
                  activeOpacity={0.88}
                >
                  {ssoLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Continue with SSO →</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backToStandardBtn}
                  onPress={() => {
                    setServerError("");
                    setAuthMode("standard");
                  }}
                >
                  <Text style={styles.backToStandardText}>← Back to standard signup</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  confirmContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 440,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketIconBadge: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketEmoji: {
    fontSize: 15,
  },
  brandWordmark: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#0F172A",
    textTransform: "uppercase",
  },
  headerRightSpacer: {
    width: 44,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },

  /* Buttons */
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  googleIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  ssoSwitchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    height: 40,
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    marginBottom: 16,
  },
  ssoBuildingIcon: {
    fontSize: 13,
  },
  ssoSwitchButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* Divider */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  /* Form Fields */
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputLeftIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
    fontSize: 14,
    opacity: 0.6,
  },
  textInput: {
    width: "100%",
    height: 46,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingLeft: 38,
    paddingRight: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* Error Banner */
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorIcon: {
    fontSize: 13,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#DC2626",
    lineHeight: 16,
  },

  /* Submit Button */
  submitButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#6D28D9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
  },

  /* Bottom Switch */
  bottomSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  bottomSwitchText: {
    fontSize: 13,
    color: "#64748B",
  },
  bottomSwitchLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6D28D9",
  },

  /* SSO Sub-view */
  ssoContainer: {
    gap: 14,
  },
  ssoInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 6,
  },
  ssoShieldBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  ssoShieldIcon: {
    fontSize: 13,
  },
  ssoInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
  },
  backToStandardBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  backToStandardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },

  /* Confirm email */
  confirmIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  confirmEmoji: {
    fontSize: 26,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  confirmEmailHighlight: {
    fontWeight: "700",
    color: "#0F172A",
  },
  confirmHelpBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  confirmHelpHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  confirmHelpItem: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
});
