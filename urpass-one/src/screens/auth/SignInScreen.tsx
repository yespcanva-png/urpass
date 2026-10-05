import React, { useState } from "react";
import {
  View,
  Text,
  Image,
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
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

interface SignInScreenProps {
  navigation?: any;
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const { loginWithPassword, loginWithOtp, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setErrorMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Please enter your account password (at least 6 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Attempt credentials authentication
      const res = await loginWithPassword(trimmedEmail, password);

      if (res.success) {
        navigation?.navigate("OperationsHome");
      } else {
        // Formulate clear enterprise error
        if (res.error?.toLowerCase().includes("network") || res.error?.toLowerCase().includes("fetch")) {
          setErrorMsg("Internet connection is required to authenticate this device.");
        } else if (res.error?.toLowerCase().includes("suspended") || res.error?.toLowerCase().includes("disabled")) {
          setErrorMsg("Your account access has been suspended. Contact your organisation administrator.");
        } else {
          setErrorMsg("We couldn't sign you in. Check your credentials and try again.");
        }
      }
    } catch {
      setErrorMsg("We couldn't sign you in. Check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEmailCodeSignIn() {
    setErrorMsg("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Enter your work email first, then request a one-time code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithOtp(trimmedEmail);
      if (res.success) {
        navigation?.navigate("TwoStepVerify", { email: trimmedEmail });
      } else {
        setErrorMsg(res.error || "Could not send a verification code. Try again.");
      }
    } catch {
      setErrorMsg("Could not send a verification code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContactAdmin() {
    Alert.alert(
      "Access & Permissions",
      "UrPass One is an operations management application for verified event personnel. Contact your event organizer or organization administrator to receive an invitation."
    );
  }

  function handleForgotPassword() {
    Alert.alert(
      "Reset Password",
      "To reset your password, please check your email for a secure reset link or visit https://urpass.space/forgot-password."
    );
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
          {/* Header Row with Logo & Back */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={14} color={COLORS.textSecondary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Image
              source={require("../../../assets/icon.png")}
              style={styles.topLogoImage}
              resizeMode="contain"
            />
          </View>

          {/* Main Sign In Form Card */}
          <View style={styles.formCard}>
            {/* Header Title */}
            <View style={styles.headerGroup}>
              <Text style={styles.headerTitle}>Welcome back</Text>
              <Text style={styles.headerSubtext}>
                Sign in to continue to UrPass One.
              </Text>
            </View>

            {/* Error Notification Banner */}
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <AlertTriangle size={16} color={COLORS.red} style={styles.errorIcon} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Input: Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Mail size={17} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@organisation.com"
                  placeholderTextColor={COLORS.textLightMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Input: Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <LockKeyhole size={17} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textLightMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.showHideToggle}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={COLORS.textSecondary} />
                  ) : (
                    <Eye size={18} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action CTA */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={isSubmitting || isLoading}
              activeOpacity={0.88}
            >
              <Text style={styles.signInButtonText}>
                {isSubmitting || isLoading ? "Signing in..." : "Sign in"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Secondary CTA: Email OTP */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEmailCodeSignIn}
              disabled={isSubmitting || isLoading}
              activeOpacity={0.85}
            >
              <KeyRound size={17} color={COLORS.brand} />
              <Text style={styles.secondaryButtonText}>Email me a one-time code</Text>
            </TouchableOpacity>

            {/* Bottom Support Text */}
            <View style={styles.bottomHelperRow}>
              <Text style={styles.helperQuestion}>Don't have access? </Text>
              <TouchableOpacity onPress={handleContactAdmin}>
                <Text style={styles.helperAction}>Contact your organisation administrator</Text>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  topLogoImage: {
    width: 96,
    height: 34,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  headerGroup: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.redLight,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    marginTop: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.red,
    fontWeight: "600",
    lineHeight: 17,
  },
  inputGroup: {
    marginBottom: 16,
    gap: 6,
  },
  passwordLabelRow: {
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
  forgotPasswordText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brand,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: "100%",
  },
  showHideToggle: {
    paddingHorizontal: 6,
    minWidth: 30,
    alignItems: "flex-end",
  },
  signInButton: {
    height: 50,
    backgroundColor: COLORS.brand,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.surfaceBorder,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textLightMuted,
    letterSpacing: 1,
  },
  secondaryButton: {
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  googleIconText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#4285F4",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  ssoButton: {
    height: 44,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  ssoIcon: {
    fontSize: 14,
  },
  ssoButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },
  bottomHelperRow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
    gap: 3,
  },
  helperQuestion: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  helperAction: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brand,
    textAlign: "center",
  },
});
