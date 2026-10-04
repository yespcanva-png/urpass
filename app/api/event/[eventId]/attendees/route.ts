import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check event authorization
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const isOrganizer = event.organizer_id === user.id;
  let hasOrgAccess = false;
  if (!isOrganizer && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "finance", "gate_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const url = new URL(req.url);
  const limitParam = parseInt(url.searchParams.get("limit") || "50", 10);
  const limit = Math.min(Math.max(isNaN(limitParam) ? 50 : limitParam, 1), 200);
  const status = url.searchParams.get("status") || "all";
  const search = url.searchParams.get("search")?.trim().toLowerCase() || "";
  const cursorParam = url.searchParams.get("cursor");

  let cursorData: { created_at: string; id: string } | null = null;
  if (cursorParam) {
    try {
      const decoded = Buffer.from(cursorParam, "base64").toString("utf-8");
      cursorData = JSON.parse(decoded);
    } catch {
      cursorData = null;
    }
  }

  // Build query
  let query = supabase
    .from("attendees")
    .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, created_at")
    .eq("event_id", eventId);

  if (status && status !== "all") {
    query = query.eq("application_status", status);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).order("id", { ascending: false });

  if (cursorData?.created_at && cursorData?.id) {
    query = query.or(
      `created_at.lt.${cursorData.created_at},and(created_at.eq.${cursorData.created_at},id.lt.${cursorData.id})`
    );
  }

  query = query.limit(limit + 1);

  const { data: rows, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = rows || [];
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;

  let nextCursor: string | null = null;
  if (hasMore && pageItems.length > 0) {
    const lastItem = pageItems[pageItems.length - 1];
    nextCursor = Buffer.from(
      JSON.stringify({ created_at: lastItem.created_at, id: lastItem.id })
    ).toString("base64");
  }

  // Also fetch pass tokens for returned items
  const attendeeIds = pageItems.map((a) => a.id);
  let passTokens: Record<string, string> = {};
  if (attendeeIds.length > 0) {
    const { data: passes } = await supabase
      .from("passes")
      .select("attendee_id, pass_token")
      .in("attendee_id", attendeeIds);

    if (passes) {
      passTokens = Object.fromEntries(passes.map((p) => [p.attendee_id, p.pass_token]));
    }
  }

  return NextResponse.json({
    items: pageItems,
    passTokens,
    nextCursor,
    hasMore,
    limit,
  });
}
