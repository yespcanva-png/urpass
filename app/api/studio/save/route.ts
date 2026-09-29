import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import type { TicketDesignConfig } from "@/lib/pass-design";
import { sanitizeDesignForPlan, getStudioPlanLimits } from "@/lib/studio/limits";

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
    let effectivePlanSlug = userPlan.slug;

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

      if (event.organizer_id && event.organizer_id !== user.id) {
        const orgPlan = await getUserPlan(supabase, event.organizer_id);
        if (orgPlan.canUse("custom_pass_design")) {
          effectivePlanSlug = orgPlan.slug;
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
    }

    const sanitized = sanitizeDesignForPlan(
      {
        ...design,
        isPublished: design.isPublished !== false,
        updatedAt: new Date().toISOString(),
      },
      effectivePlanSlug
    );

    if (eventId) {
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
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (profileErr) {
        return NextResponse.json({ error: profileErr.message }, { status: 500 });
      }

      revalidatePath("/dashboard/ticket-design");
      revalidatePath("/dashboard/pass-design");
      revalidatePath("/studio");
    }

    return NextResponse.json({
      success: true,
      data: sanitized,
      config: sanitized,
      planTier: effectivePlanSlug,
      limits: getStudioPlanLimits(effectivePlanSlug),
    });
  } catch (err) {
    console.error("[studio/save] Error saving pass design:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
