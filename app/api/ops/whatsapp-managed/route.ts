import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  updateOrganizationCommunicationSettings,
  getOrganizationCommunicationSettings,
  getManagedServiceRequests,
} from "@/lib/communications";
import { recordLiveOpsEvent } from "@/lib/ops/events";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * GET /api/ops/whatsapp-managed
 * Returns pending managed WhatsApp requests and active managed organizations.
 */
export async function GET() {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = adminClient();
  try {
    const [requestsRes, orgSettingsRes, orgsRes] = await Promise.all([
      admin
        .from("whatsapp_managed_service_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      admin
        .from("organization_communication_settings")
        .select("*")
        .eq("whatsapp_integration_model", "managed")
        .limit(500),
      admin
        .from("organizations")
        .select("id, name, slug, created_by")
        .limit(500),
    ]);

    const requests = requestsRes.data || [];
    const managedOrgSettings = orgSettingsRes.data || [];
    const orgs = orgsRes.data || [];

    return NextResponse.json({
      success: true,
      requests,
      managedOrgSettings,
      orgs,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to fetch data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ops/whatsapp-managed
 * Enables or disables UrPass Managed WhatsApp for a specific user / organization.
 * Body: { userId: string, orgId?: string, enabled: boolean }
 */
export async function POST(req: Request) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, orgId: providedOrgId, enabled } = await req.json();

    if (!userId && !providedOrgId) {
      return NextResponse.json(
        { success: false, error: "Either userId or orgId is required" },
        { status: 400 }
      );
    }

    const admin = adminClient();
    let targetOrgId = providedOrgId;
    let userEmail = "Unknown User";

    // Lookup user details
    if (userId) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.email) {
        userEmail = profile.email;
      } else {
        const { data: authUser } = await admin.auth.admin.getUserById(userId);
        if (authUser?.user?.email) {
          userEmail = authUser.user.email;
        }
      }

      // If orgId not provided, find user's organization
      if (!targetOrgId) {
        // 1. Check organization_members
        const { data: member } = await admin
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", userId)
          .maybeSingle();

        if (member?.organization_id) {
          targetOrgId = member.organization_id;
        } else {
          // 2. Check events
          const { data: evt } = await admin
            .from("events")
            .select("organization_id")
            .eq("organizer_id", userId)
            .not("organization_id", "is", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (evt?.organization_id) {
            targetOrgId = evt.organization_id;
          } else {
            // 3. Check organizations created_by
            const { data: org } = await admin
              .from("organizations")
              .select("id")
              .eq("created_by", userId)
              .maybeSingle();

            if (org?.id) {
              targetOrgId = org.id;
            } else {
              targetOrgId = `personal_${userId}`;
            }
          }
        }
      }
    }

    if (!targetOrgId) {
      targetOrgId = `personal_${userId}`;
    }

    const now = new Date().toISOString();

    if (enabled) {
      // 1. Activate Managed WhatsApp in organization_communication_settings
      await updateOrganizationCommunicationSettings(targetOrgId, {
        whatsapp_integration_model: "managed",
        whatsapp_setup_status: "active",
        whatsapp_communication: true,
      });

      // 2. Mark any service requests as active
      if (userId) {
        await admin
          .from("whatsapp_managed_service_requests")
          .update({
            status: "active",
            activated_at: now,
            updated_at: now,
          })
          .eq("requested_by", userId);
      }

      if (targetOrgId && !targetOrgId.startsWith("personal_")) {
        await admin
          .from("whatsapp_managed_service_requests")
          .update({
            status: "active",
            activated_at: now,
            updated_at: now,
          })
          .eq("organization_id", targetOrgId);
      }

      // 3. Enable whatsapp_enabled on all events owned by organizer or organization
      if (targetOrgId && !targetOrgId.startsWith("personal_")) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: true, updated_at: now })
          .eq("organization_id", targetOrgId);
      } else if (userId) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: true, updated_at: now })
          .eq("organizer_id", userId);
      }

      // 4. Log live ops event
      recordLiveOpsEvent({
        level: "SUCCESS",
        category: "SYSTEM",
        message: `[OPS ACTION] UrPass Managed WhatsApp ACTIVATED for ${userEmail} (Org: ${targetOrgId})`,
        details: { userId, orgId: targetOrgId, enabled: true },
      });

      return NextResponse.json({
        success: true,
        message: `Managed WhatsApp activated for ${userEmail}`,
        orgId: targetOrgId,
        enabled: true,
      });
    } else {
      // Disable Managed WhatsApp
      await updateOrganizationCommunicationSettings(targetOrgId, {
        whatsapp_communication: false,
        whatsapp_setup_status: "not_configured",
        whatsapp_integration_model: "none",
      });

      // Update events
      if (targetOrgId && !targetOrgId.startsWith("personal_")) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: false, updated_at: now })
          .eq("organization_id", targetOrgId);
      } else if (userId) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: false, updated_at: now })
          .eq("organizer_id", userId);
      }

      // Log live ops event
      recordLiveOpsEvent({
        level: "WARN",
        category: "SYSTEM",
        message: `[OPS ACTION] UrPass Managed WhatsApp DEACTIVATED for ${userEmail} (Org: ${targetOrgId})`,
        details: { userId, orgId: targetOrgId, enabled: false },
      });

      return NextResponse.json({
        success: true,
        message: `Managed WhatsApp disabled for ${userEmail}`,
        orgId: targetOrgId,
        enabled: false,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to process request";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
