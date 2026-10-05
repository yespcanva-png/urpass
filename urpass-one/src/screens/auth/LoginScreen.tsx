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
import Svg, { Path } from "react-native-svg";
import {
  ArrowLeft,
  Ticket,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { SupabaseOpsService } from "../../services/supabaseService";

interface LoginScreenProps {
  navigation?: any;
}

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
        fill="#4285F4"
      />
      <Path
        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
        fill="#34A853"
      />
      <Path
        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
        fill="#FBBC05"
      />
      <Path
        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { loginWithPassword, loginWithGoogle, loginWithOtp } = useAuth();

  const [authMode, setAuthMode] = useState<"standard" | "sso">("standard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [isEmergencyOwnerLogin, setIsEmergencyOwnerLogin] = useState(false);

  async function handlePasswordSubmit() {
    setServerError("");
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setServerError("Enter a valid email");
      return;
    }

    if (!password || password.length < 6) {
      setServerError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithPassword(trimmedEmail, password);
      if (res.success) {
        navigation?.navigate("OrgSelection");
      } else {
        setServerError(res.error || "We couldn't sign you in. Check your credentials and try again.");
      }
    } catch {
      setServerError("We couldn't sign you in. Check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setServerError("");
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setServerError(res.error || "Google sign-in could not be completed.");
      }
    } catch {
      setServerError("Google sign-in could not be completed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSsoSubmit() {
    setServerError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setServerError("Enter your corporate or school email address");
      return;
    }

    setSsoLoading(true);
    try {
      const ssoRes = await SupabaseOpsService.lookupSSO(trimmedEmail);
      if (ssoRes.ssoAvailable && ssoRes.loginUrl) {
        Alert.alert(
          "Enterprise SSO",
          `Redirecting to ${ssoRes.orgName || "Enterprise"} Identity Provider (${ssoRes.protocol || "SAML 2.0"}).`,
          [
            {
              text: "Authenticate",
              onPress: async () => {
                await loginWithOtp(trimmedEmail);
                navigation?.navigate("OrgSelection");
              },
            },
          ]
        );
      } else {
        // Direct IdP routing
        await loginWithOtp(trimmedEmail);
        navigation?.navigate("OrgSelection");
      }
    } catch (err: any) {
      setServerError(err?.message || "Failed to initiate Enterprise SSO.");
    } finally {
      setSsoLoading(false);
    }
  }

  function handleForgotPassword() {
    Alert.alert(
      "Reset Password",
      "To reset your password, visit https://urpass.space/forgot-password or check your registered email for a recovery link."
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
          {/* Top row: Back link + URPASS Wordmark (matching web apply-in-1) */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack?.() || navigation?.navigate("Welcome")}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft size={14} color="#94A3B8" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Ticket size={16} color="#6D28D9" />
              <Text style={styles.brandWordmark}>URPASS</Text>
            </View>

            <View style={styles.headerRightSpacer} />
          </View>

          {/* Main Card — 100% Dittox to https://urpass.space/login */}
          <View style={styles.card}>
            {/* Header section */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {authMode === "sso" ? "Enterprise SSO" : "Welcome back"}
              </Text>
              <Text style={styles.cardSubtitle}>
                {authMode === "sso"
                  ? "Sign in using your organization's SAML 2.0 or OIDC Identity Provider"
                  : "Sign in to your organizer account"}
              </Text>
            </View>

            {authMode === "standard" ? (
              <>
                {/* Google OAuth Button */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleLogin}
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
                  <Building2 size={14} color="#6D28D9" />
                  <Text style={styles.ssoSwitchButtonText}>Continue with Enterprise SSO</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or email password</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Emergency Owner Bypass Indicator */}
                {isEmergencyOwnerLogin && (
                  <View style={styles.emergencyBanner}>
                    <KeyRound size={16} color="#D97706" style={{ marginTop: 2 }} />
                    <Text style={styles.emergencyBannerText}>
                      <Text style={{ fontWeight: "700" }}>Emergency Owner Login active.</Text> Bypasses
                      organization SSO enforcement in case of IdP misconfiguration or expired certificates.
                    </Text>
                  </View>
                )}

                {/* Email Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color="#CBD5E1" style={styles.inputLeftIcon} />
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
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.fieldLabel}>PASSWORD</Text>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Lock size={16} color="#CBD5E1" style={styles.inputLeftIcon} />
                    <TextInput
                      style={[styles.textInput, { paddingRight: 46 }]}
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
                      {showPassword ? (
                        <EyeOff size={16} color="#6D28D9" />
                      ) : (
                        <Eye size={16} color="#6D28D9" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Banner */}
                {!!serverError && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={15} color="#EF4444" style={{ marginTop: 1 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.errorText}>{serverError}</Text>
                      {!isEmergencyOwnerLogin && (
                        <TouchableOpacity
                          onPress={() => setIsEmergencyOwnerLogin(true)}
                          style={{ marginTop: 4 }}
                        >
                          <Text style={styles.emergencyLink}>Organization Owner? Use Emergency Login</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                {/* Sign in Button */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handlePasswordSubmit}
                  disabled={isSubmitting || googleLoading}
                  activeOpacity={0.88}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Sign in</Text>
                  )}
                </TouchableOpacity>

                {/* Bottom Signup Switch */}
                <View style={styles.bottomSwitchRow}>
                  <Text style={styles.bottomSwitchText}>Don&apos;t have an account? </Text>
                  <TouchableOpacity onPress={() => navigation?.navigate("Signup")}>
                    <Text style={styles.bottomSwitchLink}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Enterprise SSO Mode */
              <View style={styles.ssoContainer}>
                <View style={styles.ssoInfoBox}>
                  <View style={styles.ssoShieldBadge}>
                    <ShieldCheck size={16} color="#6D28D9" />
                  </View>
                  <Text style={styles.ssoInfoText}>
                    Enter your work or university email to be securely routed to your organization&apos;s identity provider.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>CORPORATE / STUDENT EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color="#CBD5E1" style={styles.inputLeftIcon} />
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
                    <AlertCircle size={15} color="#EF4444" style={{ marginTop: 1 }} />
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
                    <Text style={styles.submitButtonText}>Continue with SSO</Text>
                  )}
                </TouchableOpacity>

                {/* IdP Badges */}
                <View style={styles.idpBadgesRow}>
                  <Text style={styles.idpLabel}>Supports:</Text>
                  <View style={styles.idpChip}><Text style={styles.idpChipText}>Okta</Text></View>
                  <View style={styles.idpChip}><Text style={styles.idpChipText}>Entra ID</Text></View>
                  <View style={styles.idpChip}><Text style={styles.idpChipText}>Google Workspace</Text></View>
                  <View style={styles.idpChip}><Text style={styles.idpChipText}>SAML 2.0</Text></View>
                  <View style={styles.idpChip}><Text style={styles.idpChipText}>OIDC</Text></View>
                </View>

                <TouchableOpacity
                  style={styles.backToStandardBtn}
                  onPress={() => {
                    setServerError("");
                    setAuthMode("standard");
                  }}
                >
                  <Text style={styles.backToStandardText}>← Back to standard login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bottom Enterprise Compliance note */}
          <Text style={styles.bottomComplianceText}>
            Enterprise SSO · SAML 2.0 &amp; OpenID Connect compliant
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const SignInScreen = LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  keyboardView: {
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 440,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
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
  headerRightSpacer: {
    width: 48,
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
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 20,
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
  googleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  ssoSwitchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 38,
    backgroundColor: "rgba(109,40,217,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.20)",
    marginBottom: 18,
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
    fontSize: 12,
    fontWeight: "500",
    color: "#CBD5E1",
  },

  /* Emergency Banner */
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  emergencyBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    lineHeight: 17,
  },

  /* Form Fields */
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  forgotPasswordLink: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6D28D9",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputLeftIcon: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  textInput: {
    width: "100%",
    height: 48,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingLeft: 40,
    paddingRight: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  passwordToggle: {
    position: "absolute",
    right: 14,
    padding: 4,
  },

  /* Error Banner */
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    lineHeight: 16,
  },
  emergencyLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
    textDecorationLine: "underline",
  },

  /* Submit Button */
  submitButton: {
    width: "100%",
    height: 50,
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
    opacity: 0.60,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Bottom Switch */
  bottomSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  bottomSwitchText: {
    fontSize: 14,
    color: "#64748B",
  },
  bottomSwitchLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    textDecorationLine: "underline",
  },

  /* SSO Sub-view */
  ssoContainer: {
    gap: 16,
  },
  ssoInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 2,
  },
  ssoShieldBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  ssoInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
  },
  idpBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 4,
  },
  idpLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  idpChip: {
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  idpChipText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#475569",
  },
  backToStandardBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  backToStandardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },

  /* Bottom note */
  bottomComplianceText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 24,
    textAlign: "center",
  },
});
