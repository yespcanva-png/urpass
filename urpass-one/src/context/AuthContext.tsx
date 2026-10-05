import React, { createContext, useContext, useState, useEffect } from "react";
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
