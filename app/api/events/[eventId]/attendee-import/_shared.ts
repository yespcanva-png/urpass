import { NextResponse } from "next/server";
import { createClient as createAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";

export function adminClient() {
  return createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY || "");
}

export async function requireImportAccess(eventId: string): Promise<{
  user: { id: string; email?: string | null };
  event: {
    id: string;
    name: string;
    attendee_limit: number;
    organizer_id: string;
    organization_id: string | null;
  };
  db: SupabaseClient;
} | NextResponse> {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: event } = await db
    .from("events")
    .select("id, name, attendee_limit, organizer_id, organization_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.organizer_id !== user.id) {
    if (!event.organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: member } = await db
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return { user, event, db: db as SupabaseClient };
}
