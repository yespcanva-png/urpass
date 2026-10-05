import React, { createContext, useContext, useState, useEffect } from "react";
import { Linking, Platform } from "react-native";
import type { UserProfile, UserRole } from "../types";
import { StorageService } from "../services/storage";
import { SupabaseOpsService } from "../services/supabaseService";
import { CONFIG } from "../constants/config";

interface AuthContextType {
  user: UserProfile | null;
  authToken: string | null;
  deviceId: string;
  isLoading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  updateRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>("OP-DEVICE-01");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        let storedDeviceId = await StorageService.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
        if (!storedDeviceId) {
          storedDeviceId = `OP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          await StorageService.setItem(CONFIG.STORAGE_KEYS.DEVICE_ID, storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        const token = await StorageService.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const profile = await StorageService.getJSON<UserProfile | null>(
          CONFIG.STORAGE_KEYS.USER_PROFILE,
          null
        );

        if (token && profile) {
          setAuthToken(token);
          setUser(profile);
        } else {
          setAuthToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAuth();

    // Deep Link Listener for OAuth Callbacks (Google, SSO)
    const handleDeepLink = async (event: { url: string }) => {
      if (!event.url) return;
      try {
        const url = event.url;
        if (url.includes("access_token=") || url.includes("code=")) {
          const supabase = SupabaseOpsService.getClient();
          let accessToken: string | null = null;
          let refreshToken: string | null = null;

          const hashPart = url.split("#")[1] || "";
          const queryPart = url.split("?")[1] || "";
          const params = new URLSearchParams(hashPart || queryPart);

          accessToken = params.get("access_token");
          refreshToken = params.get("refresh_token");

          if (accessToken) {
            const { data } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
            if (data?.user && data.session) {
              const profile = await SupabaseOpsService.buildUserProfileFromSupabase(data.user);
              await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.session.access_token);
              await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, profile);
              setAuthToken(data.session.access_token);
              setUser(profile);
            }
          } else if (params.get("code")) {
            const googleCode = params.get("code")!;
            const googleRes = await SupabaseOpsService.exchangeGoogleCode(googleCode);
            if (googleRes.user && googleRes.accessToken) {
              await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, googleRes.accessToken);
              await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, googleRes.user);
              setAuthToken(googleRes.accessToken);
              setUser(googleRes.user);
            } else {
              const { data } = await supabase.auth.exchangeCodeForSession(googleCode);
              if (data?.user && data.session) {
                const profile = await SupabaseOpsService.buildUserProfileFromSupabase(data.user);
                await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.session.access_token);
                await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, profile);
                setAuthToken(data.session.access_token);
                setUser(profile);
              }
            }
          }
        }
      } catch (err) {
        console.warn("[AuthContext] OAuth callback parse error:", err);
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      sub.remove();
    };
  }, []);

  async function loginWithPassword(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    setIsLoading(true);
    try {
      const result = await SupabaseOpsService.signInWithPassword(email, password);
      if (result.user && result.accessToken) {
        await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, result.accessToken);
        await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, result.user);
        setAuthToken(result.accessToken);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Authentication failed" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error during login" };
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }> {
    setIsLoading(true);
    try {
      const res = await SupabaseOpsService.signUp(fullName, email, password);
      if (res.needsEmailConfirmation) {
        return { success: true, needsEmailConfirmation: true };
      }
      if (res.user && res.accessToken) {
        await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, res.accessToken);
        await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, res.user);
        setAuthToken(res.accessToken);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error during registration" };
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    setIsLoading(true);
    try {
      const res = await SupabaseOpsService.signInWithGoogle();
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.url) {
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.location.href = res.url;
        } else {
          await Linking.openURL(res.url);
        }
        return { success: true };
      }
      return { success: false, error: "Failed to initiate Google authentication." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Google sign in error." };
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithOtp(email: string): Promise<{ success: boolean; error?: string }> {
    setIsLoading(true);
    try {
      const res = await SupabaseOpsService.signInWithOtp(email);
      if (res.success) {
        return { success: true };
      }
      return { success: false, error: res.error || "Failed to send code" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Error sending code" };
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(email: string, otp: string): Promise<boolean> {
    setIsLoading(true);
    try {
      // 1. Try real Supabase OTP verification
      const res = await SupabaseOpsService.verifyOtp(email, otp);
      if (res.user && res.accessToken) {
        await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, res.accessToken);
        await StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, res.user);
        setAuthToken(res.accessToken);
        setUser(res.user);
        return true;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await SupabaseOpsService.signOut();
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.USER_PROFILE);
    setUser(null);
    setAuthToken(null);
  }

  async function logoutAllDevices() {
    await logout();
  }

  function updateRole(newRole: UserRole) {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      StorageService.setJSON(CONFIG.STORAGE_KEYS.USER_PROFILE, updated);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        deviceId,
        isLoading,
        loginWithPassword,
        signUp,
        loginWithGoogle,
        loginWithOtp,
        verifyOtp,
        logout,
        logoutAllDevices,
        updateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
