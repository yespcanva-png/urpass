"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface InAppNotification {
  id: string;
  user_id: string;
  event_id: string | null;
  title: string;
  message: string;
  type: "registration" | "milestone" | "checkin" | "payment" | "feedback" | "system";
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export async function getOrganizerNotifications(limit = 20): Promise<{
  notifications: InAppNotification[];
  unreadCount: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { notifications: [], unreadCount: 0 };

  const { data: notifications } = await supabase
    .from("organizer_notifications")
    .select("id, user_id, event_id, title, message, type, link, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  const { count: unreadCount } = await supabase
    .from("organizer_notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  return {
    notifications: (notifications ?? []) as InAppNotification[],
    unreadCount: unreadCount ?? 0,
  };
}

export async function markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  await supabase
    .from("organizer_notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  await supabase
    .from("organizer_notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createOrganizerNotification({
  userId,
  eventId,
  title,
  message,
  type = "system",
  link,
}: {
  userId: string;
  eventId?: string | null;
  title: string;
  message: string;
  type?: "registration" | "milestone" | "checkin" | "payment" | "feedback" | "system";
  link?: string | null;
}): Promise<void> {
  const supabase = await createClient();
  await supabase.from("organizer_notifications").insert({
    user_id: userId,
    event_id: eventId ?? null,
    title,
    message,
    type,
    link: link ?? null,
    is_read: false,
  });
}
