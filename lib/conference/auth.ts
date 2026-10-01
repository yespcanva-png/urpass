import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export async function verifyEventOrganizerAccess(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401, user: null, event: null, supabase };
  }

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, event_date, start_time, end_time, venue, status")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return { error: "Event not found", status: 404, user, event: null, supabase };
  }

  if (event.organizer_id === user.id) {
    return { error: null, status: 200, user, event, supabase };
  }

  // Check organization membership
  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (member) {
      return { error: null, status: 200, user, event, supabase };
    }
  }

  return { error: "Forbidden: You do not have permission to manage this event", status: 403, user, event, supabase };
}

export function getConferenceAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createAdminClient(getSupabaseUrl(), serviceKey);
}
