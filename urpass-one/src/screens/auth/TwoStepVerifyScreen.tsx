import React, { useState, useRef, useEffect } from "react";
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
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ShieldCheck,
  Shield,
  Ticket,
} from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";

interface TwoStepVerifyScreenProps {
  route?: any;
  navigation?: any;
}

export function TwoStepVerifyScreen({ route, navigation }: TwoStepVerifyScreenProps) {
  const targetEmail = route?.params?.email || "ops@urpass.space";
  const { loginWithOtp, verifyOtp, deviceId, isLoading } = useAuth();
  const { organizations, events } = useEvent();

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [errorMsg, setErrorMsg] = useState("");
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  function handleDigitChange(text: string, index: number) {
    setErrorMsg("");

    // Handle full paste
    if (text.length > 1) {
      const pasted = text.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newDigits = [...otpDigits];
      pasted.forEach((char, idx) => {
        if (idx < 6) newDigits[idx] = char;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const cleanChar = text.replace(/[^0-9]/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    setErrorMsg("");
    const otpCode = otpDigits.join("");

    if (otpCode.length < 6) {
      setErrorMsg("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      const success = await verifyOtp(targetEmail, otpCode);

      if (success) {
        // Smart Enterprise Auth Routing
        // 1. If multiple organizations, navigate to OrgSelection (Screen 4)
        if (organizations && organizations.length > 1) {
          navigation?.navigate("OrgSelection");
        } else {
          // 2. If single organization but multiple events, navigate to EventSelection (Screen 5)
          if (events && events.length > 1) {
            navigation?.navigate("EventSelection");
          } else {
            // 3. Single active event -> Direct entry to dashboard
            navigation?.navigate("OperationsHome");
          }
        }
      } else {
        if (otpCode === "000000") {
          setErrorMsg("This code has expired. Request a new one.");
        } else {
          setErrorMsg("That verification code is incorrect.");
        }
      }
    } catch {
      setErrorMsg("That verification code is incorrect.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendCode() {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    const res = await loginWithOtp(targetEmail);
    if (res.success) {
      setResendCooldown(30);
      Alert.alert("Code sent", `A fresh verification code was sent to ${targetEmail}.`);
    } else {
      setErrorMsg(res.error || "Could not send a new verification code.");
    }
  }

  function handleAlternativeMethod() {
    Alert.alert(
      "Alternative Verification",
      "Use the production email code sent to your account, or contact your organisation administrator if you need another verified sign-in method."
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
          {/* Header Row */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={14} color={COLORS.textSecondary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logoBadge}>
              <View style={styles.ticketIconBox}>
                <Ticket size={15} color={COLORS.brand} />
              </View>
              <Text style={styles.logoWordmark}>URPASS</Text>
            </View>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Header Group */}
            <View style={styles.headerGroup}>
              <View style={styles.shieldBadge}>
                <ShieldCheck size={13} color={COLORS.brand} />
                <Text style={styles.shieldText}>2-STEP VERIFICATION</Text>
              </View>
              <Text style={styles.headerTitle}>Verify your identity</Text>
              <Text style={styles.headerSubtext}>
                Enter the verification code sent to your registered email or mobile number.
              </Text>
              <Text style={styles.targetEmailText}>{targetEmail}</Text>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <AlertTriangle size={16} color={COLORS.red} style={styles.errorIcon} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* 6-Digit OTP Cells */}
            <View style={styles.otpContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpCell,
                    digit ? styles.otpCellFilled : null,
                    inputRefs.current[index]?.isFocused() ? styles.otpCellFocused : null,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleDigitChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Biometric Toggle Option */}
            <TouchableOpacity
              style={styles.biometricRow}
              onPress={() => setEnableBiometrics((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, enableBiometrics && styles.checkboxActive]}>
                {enableBiometrics && <Check size={13} color={COLORS.white} />}
              </View>
              <View style={styles.biometricTextBox}>
                <Text style={styles.biometricTitle}>Remember this device</Text>
                <Text style={styles.biometricSubtitle}>
                  Enable Face ID / Fingerprint unlock for rapid station access
                </Text>
              </View>
            </TouchableOpacity>

            {/* Primary Action CTA */}
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
              disabled={isVerifying || isLoading}
              activeOpacity={0.88}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifying || isLoading ? "Verifying..." : "Verify & Continue"}
              </Text>
            </TouchableOpacity>

            {/* Resend & Alternative Actions */}
            <View style={styles.secondaryActionsContainer}>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendCooldown > 0}
                style={styles.resendBtn}
              >
                <Text
                  style={[
                    styles.resendText,
                    resendCooldown > 0 && styles.resendTextDisabled,
                  ]}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAlternativeMethod}
                style={styles.altMethodBtn}
              >
                <Text style={styles.altMethodText}>
                  Use another verification method
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Guarantee Note */}
            <View style={styles.securityNoteRow}>
              <Shield size={14} color={COLORS.textMuted} />
              <Text style={styles.securityNoteText}>
                Your account is protected with two-step verification.
              </Text>
            </View>

            {/* Device Telemetry Identifier */}
            <View style={styles.deviceRow}>
              <Text style={styles.deviceText}>Hardware Station ID: {deviceId}</Text>
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
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWordmark: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  mainCard: {
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
  shieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  shieldText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.brand,
    letterSpacing: 0.8,
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
    lineHeight: 18,
  },
  targetEmailText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brand,
    marginTop: 6,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
  },
  otpCell: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  otpCellFilled: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.white,
  },
  otpCellFocused: {
    borderColor: COLORS.brandAccent,
    backgroundColor: COLORS.white,
  },
  biometricRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorderStrong,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  biometricTextBox: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  biometricSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  verifyButton: {
    height: 50,
    backgroundColor: COLORS.brand,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
  },
  secondaryActionsContainer: {
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },
  resendBtn: {
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },
  resendTextDisabled: {
    color: COLORS.textMuted,
  },
  altMethodBtn: {
    paddingVertical: 4,
  },
  altMethodText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textDecorationLine: "underline",
  },
  securityNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorderSubtle,
    gap: 6,
  },
  securityNoteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  deviceRow: {
    marginTop: 10,
    alignItems: "center",
  },
  deviceText: {
    fontSize: 10,
    color: COLORS.textLightMuted,
    fontWeight: "600",
  },
});
