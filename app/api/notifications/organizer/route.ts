import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { InAppNotification } from "@/app/actions/in-app-notifications";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "15", 10), 1), 50);

    const { data: notifications, error: notifErr } = await supabase
      .from("organizer_notifications")
      .select("id, user_id, event_id, title, message, type, link, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (notifErr) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const { count: unreadCount } = await supabase
      .from("organizer_notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    return NextResponse.json({
      notifications: (notifications ?? []) as InAppNotification[],
      unreadCount: unreadCount ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}
