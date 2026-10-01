"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Permanently dismisses a feature announcement in the database (auth.users metadata).
 * Guarantees persistence across reloads, page navigation, and devices.
 */
export async function dismissWhatsNewAnnouncement(
  featureKey: string = "whats_new_conference_dismissed"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      [featureKey]: true,
      whats_new_last_dismissed_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase.auth.updateUser({
      data: updatedMetadata,
    });

    if (updateError) {
      console.error("Failed to dismiss announcement in database:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error updating announcement dismissal in DB:", err);
    return { success: false, error: err.message };
  }
}
