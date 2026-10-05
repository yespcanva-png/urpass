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
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  AlertCircle,
  Ticket,
} from "lucide-react-native";
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
        navigation?.navigate("OrgSelection");
      } else {
        setErrorMsg("That verification code is incorrect or expired.");
      }
    } catch {
      setErrorMsg("That verification code is incorrect or expired.");
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
      "Use your registered email or contact your organisation administrator for assistance."
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
          {/* Top Row: Back + URPASS */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack?.() || navigation?.navigate("SignIn")}
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

          {/* Main Card */}
          <View style={styles.card}>
            {/* Header Group */}
            <View style={styles.cardHeader}>
              <View style={styles.shieldBadge}>
                <ShieldCheck size={14} color="#6D28D9" />
                <Text style={styles.shieldText}>TWO-STEP VERIFICATION</Text>
              </View>
              <Text style={styles.cardTitle}>Verify your identity</Text>
              <Text style={styles.cardSubtitle}>
                Enter the verification code sent to{"\n"}
                <Text style={styles.targetEmail}>{targetEmail}</Text>
              </Text>
            </View>

            {/* Error Banner */}
            {!!errorMsg && (
              <View style={styles.errorBanner}>
                <AlertCircle size={15} color="#EF4444" style={{ marginTop: 1 }} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* 6-Digit OTP Input */}
            <View style={styles.otpRow}>
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
                {enableBiometrics && <Check size={12} color="#FFFFFF" />}
              </View>
              <View style={styles.biometricTextBox}>
                <Text style={styles.biometricTitle}>Remember this device</Text>
                <Text style={styles.biometricSubtitle}>
                  Enable rapid station biometric unlock
                </Text>
              </View>
            </TouchableOpacity>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[styles.submitButton, (isVerifying || isLoading) && styles.submitButtonDisabled]}
              onPress={handleVerify}
              disabled={isVerifying || isLoading}
              activeOpacity={0.88}
            >
              {isVerifying || isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Verify &amp; Continue</Text>
              )}
            </TouchableOpacity>

            {/* Resend & Alternative Action Links */}
            <View style={styles.actionsFooter}>
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
                <Text style={styles.altMethodText}>Use another verification method</Text>
              </TouchableOpacity>
            </View>

            {/* Security Guarantee Note */}
            <View style={styles.securityNoteRow}>
              <ShieldCheck size={13} color="#94A3B8" />
              <Text style={styles.securityNoteText}>
                Your account is protected with two-step verification.
              </Text>
            </View>
          </View>

          {/* Hardware ID Footer */}
          <Text style={styles.hardwareIdText}>Station ID: {deviceId}</Text>
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
    marginBottom: 20,
  },
  shieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(109,40,217,0.06)",
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  shieldText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6D28D9",
    letterSpacing: 0.8,
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
    marginTop: 6,
    lineHeight: 20,
  },
  targetEmail: {
    color: "#0F172A",
    fontWeight: "600",
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

  /* OTP Cells */
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 18,
  },
  otpCell: {
    flex: 1,
    height: 50,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  otpCellFilled: {
    borderColor: "#6D28D9",
    backgroundColor: "#FFFFFF",
  },
  otpCellFocused: {
    borderColor: "#6D28D9",
    backgroundColor: "#FFFFFF",
  },

  /* Biometrics */
  biometricRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  biometricTextBox: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  biometricSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },

  /* Submit Button */
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6D28D9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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

  /* Actions */
  actionsFooter: {
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },
  resendBtn: {
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6D28D9",
  },
  resendTextDisabled: {
    color: "#94A3B8",
  },
  altMethodBtn: {
    paddingVertical: 4,
  },
  altMethodText: {
    fontSize: 12,
    color: "#64748B",
    textDecorationLine: "underline",
  },

  /* Security note */
  securityNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 6,
  },
  securityNoteText: {
    fontSize: 11,
    color: "#94A3B8",
  },

  /* Footer */
  hardwareIdText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 24,
    textAlign: "center",
  },
});
