import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import {
  type TicketDesignConfig,
  sanitizeTicketDesign,
} from "@/lib/pass-design";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { eventId, design } = body as {
      eventId?: string | null;
      design?: TicketDesignConfig;
    };

    if (!design || typeof design !== "object") {
      return NextResponse.json({ error: "Design configuration is required" }, { status: 400 });
    }

    const userPlan = await getUserPlan(supabase, user.id);
    const userCanDesign = userPlan.canUse("custom_pass_design");

    if (!userCanDesign && !eventId) {
      return NextResponse.json(
        { error: "Custom Ticket Design is exclusive to Pro and higher tier plans." },
        { status: 403 }
      );
    }

    const sanitized = sanitizeTicketDesign({
      ...design,
      isPublished: design.isPublished !== false,
      updatedAt: new Date().toISOString(),
    });

    if (eventId) {
      // Verify event ownership or org role
      const { data: event, error: eventErr } = await supabase
        .from("events")
        .select("id, organizer_id, organization_id")
        .eq("id", eventId)
        .single();

      if (eventErr || !event) {
        return NextResponse.json({ error: "Event not found or access denied." }, { status: 404 });
      }

      if (!userCanDesign && event.organizer_id) {
        const orgPlan = await getUserPlan(supabase, event.organizer_id);
        if (!orgPlan.canUse("custom_pass_design")) {
          return NextResponse.json(
            { error: "Custom Ticket Design is exclusive to Pro and higher tier plans." },
            { status: 403 }
          );
        }
      }

      if (event.organizer_id !== user.id) {
        let hasAccess = false;
        if (event.organization_id) {
          const { data: orgMember } = await supabase
            .from("organization_members")
            .select("role")
            .eq("organization_id", event.organization_id)
            .eq("user_id", user.id)
            .eq("status", "active")
            .in("role", ["owner", "admin", "event_manager"])
            .maybeSingle();
          hasAccess = !!orgMember;
        }

        if (!hasAccess) {
          return NextResponse.json(
            { error: "You do not have permission to edit this event." },
            { status: 403 }
          );
        }
      }

      const { error: updateErr } = await supabase
        .from("events")
        .update({
          custom_pass_design: sanitized,
        })
        .eq("id", eventId);

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      revalidatePath(`/event/${eventId}/pass-design`);
      revalidatePath(`/event/${eventId}`);
      revalidatePath(`/studio/${eventId}`);
      revalidatePath("/pass/[passId]", "page");
    } else {
      // Save to organizer profile
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          custom_pass_design: sanitized,
          brand_color: sanitized.primaryColor,
        })
        .eq("user_id", user.id);

      if (profileErr) {
        return NextResponse.json({ error: profileErr.message }, { status: 500 });
      }

      revalidatePath("/dashboard/ticket-design");
      revalidatePath("/dashboard/branding");
      revalidatePath("/pass/[passId]", "page");
    }

    return NextResponse.json({ success: true, config: sanitized });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save design" },
      { status: 500 }
    );
  }
}
