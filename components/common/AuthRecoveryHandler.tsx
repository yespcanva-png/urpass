"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * AuthRecoveryHandler detects Supabase Auth hash fragments on any page
 * (e.g. https://urpass.space/#access_token=...&type=recovery or #error=...)
 * and automatically redirects the user to /auth/reset-password.
 */
export default function AuthRecoveryHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    // If already on reset password page, let ResetPasswordClient handle it
    if (currentPath === "/auth/reset-password") return;

    // 1. Check URL Hash for recovery tokens or errors
    if (hash) {
      const isRecoveryHash =
        hash.includes("type=recovery") ||
        (hash.includes("access_token=") && (hash.includes("recovery") || hash.includes("type=invite")));

      const isAuthErrorHash =
        hash.includes("error=") &&
        (hash.includes("expired") || hash.includes("invalid") || hash.includes("access_denied"));

      if (isRecoveryHash || isAuthErrorHash) {
        window.location.replace(`/auth/reset-password${hash}`);
        return;
      }
    }

    // 2. Check Query Parameters for recovery token_hash or recovery type
    if (search) {
      const params = new URLSearchParams(search);
      const isRecoveryQuery =
        params.get("type") === "recovery" ||
        (params.has("token_hash") && params.get("type") === "recovery");

      if (isRecoveryQuery) {
        window.location.replace(`/auth/reset-password${search}${hash}`);
        return;
      }
    }

    // 3. Supabase Auth state listener for PASSWORD_RECOVERY event
    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          if (window.location.pathname !== "/auth/reset-password") {
            window.location.replace(`/auth/reset-password${window.location.hash || ""}`);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Non-blocking
    }
  }, []);

  return null;
}
