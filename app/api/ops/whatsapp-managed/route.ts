import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  updateOrganizationCommunicationSettings,
  getOrganizationCommunicationSettings,
  getManagedServiceRequests,
  resolveOrgId,
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
    let userEmail = "Unknown User";
    let userPhone = "+91";

    // Lookup user details
    if (userId) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name, phone")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.email) {
        userEmail = profile.email;
        if (profile.phone) userPhone = profile.phone;
      } else {
        const { data: authUser } = await admin.auth.admin.getUserById(userId);
        if (authUser?.user?.email) {
          userEmail = authUser.user.email;
          if (authUser.user.user_metadata?.phone) userPhone = authUser.user.user_metadata.phone;
        }
      }
    }

    // Resolve all organization IDs for this user
    const orgIdsToUpdate = new Set<string>();
    if (providedOrgId) orgIdsToUpdate.add(providedOrgId);
    if (userId) {
      orgIdsToUpdate.add(`personal_${userId}`);
      const resolved = await resolveOrgId(`personal_${userId}`);
      if (resolved && !resolved.startsWith("personal_")) {
        orgIdsToUpdate.add(resolved);
      }

      // 1. Check organization_members
      const { data: members } = await admin
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", userId);
      members?.forEach((m) => m.organization_id && orgIdsToUpdate.add(m.organization_id));

      // 2. Check organizations created_by
      const { data: createdOrgs } = await admin
        .from("organizations")
        .select("id")
        .eq("created_by", userId);
      createdOrgs?.forEach((o) => o.id && orgIdsToUpdate.add(o.id));

      // 3. Check events
      const { data: userEvents } = await admin
        .from("events")
        .select("organization_id")
        .eq("organizer_id", userId);
      userEvents?.forEach((e) => e.organization_id && orgIdsToUpdate.add(e.organization_id));
    }

    const nonPersonalOrgs = Array.from(orgIdsToUpdate).filter((id) => !id.startsWith("personal_"));
    const canonicalOrgId =
      nonPersonalOrgs[0] ||
      (providedOrgId && !providedOrgId.startsWith("personal_") ? providedOrgId : `personal_${userId}`);
    const now = new Date().toISOString();

    if (enabled) {
      // 1. Activate Managed WhatsApp in organization_communication_settings for all orgs
      for (const orgId of Array.from(orgIdsToUpdate)) {
        await updateOrganizationCommunicationSettings(orgId, {
          enable_communication: true,
          whatsapp_communication: true,
          whatsapp_integration_model: "managed",
          whatsapp_setup_status: "active",
          automation_rules: {
            registration_confirmed: { email: true, whatsapp: true },
            registration_approved: { email: true, whatsapp: true },
            registration_rejected: { email: true, whatsapp: false },
            ticket_issued: { email: true, whatsapp: true },
            qr_pass_generated: { email: true, whatsapp: true },
            event_reminder: { email: true, whatsapp: true },
            event_updated: { email: true, whatsapp: true },
            event_cancelled: { email: true, whatsapp: true },
          },
        });
      }

      // 2. Mark any service requests as active
      if (userId) {
        await admin
          .from("whatsapp_managed_service_requests")
          .update({
            status: "active",
            activated_at: now,
            updated_at: now,
            admin_notes: "UrPass Managed WhatsApp activated via Ops Command Center",
          })
          .eq("requested_by", userId);
      }

      if (nonPersonalOrgs.length > 0) {
        await admin
          .from("whatsapp_managed_service_requests")
          .update({
            status: "active",
            activated_at: now,
            updated_at: now,
            admin_notes: "UrPass Managed WhatsApp activated via Ops Command Center",
          })
          .in("organization_id", nonPersonalOrgs);
      }

      // If no request existed yet, insert an active record so user sees active status and ID
      if (canonicalOrgId && !canonicalOrgId.startsWith("personal_")) {
        const { data: existingReqs } = await admin
          .from("whatsapp_managed_service_requests")
          .select("id")
          .or(
            `requested_by.eq.${userId}${
              nonPersonalOrgs.length > 0 ? `,organization_id.in.(${nonPersonalOrgs.join(",")})` : ""
            }`
          )
          .limit(1);

        if (!existingReqs || existingReqs.length === 0) {
          await admin.from("whatsapp_managed_service_requests").insert({
            organization_id: canonicalOrgId,
            requested_by: userId,
            status: "active",
            estimated_monthly_volume: "10,000 passes/month",
            use_case: "Event passes & attendee notifications (Ops Activated)",
            contact_email: userEmail,
            contact_phone: userPhone,
            currency: "INR",
            activated_at: now,
            admin_notes: "Directly activated via Ops Dashboard",
          });
        }
      }

      // 3. Enable whatsapp_enabled on all events owned by organizer or organization
      if (userId) {
        await admin
          .from("events")
          .update({
            whatsapp_enabled: true,
            organization_id:
              canonicalOrgId && !canonicalOrgId.startsWith("personal_") ? canonicalOrgId : undefined,
            updated_at: now,
          })
          .eq("organizer_id", userId);
      }

      if (nonPersonalOrgs.length > 0) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: true, updated_at: now })
          .in("organization_id", nonPersonalOrgs);
      }

      // 4. Log live ops event
      recordLiveOpsEvent({
        level: "SUCCESS",
        category: "SYSTEM",
        message: `[OPS ACTION] UrPass Managed WhatsApp ACTIVATED for ${userEmail} (Org: ${canonicalOrgId})`,
        details: { userId, orgId: canonicalOrgId, enabled: true },
      });

      return NextResponse.json({
        success: true,
        message: `Managed WhatsApp activated for ${userEmail}`,
        orgId: canonicalOrgId,
        enabled: true,
      });
    } else {
      // Disable Managed WhatsApp
      for (const orgId of Array.from(orgIdsToUpdate)) {
        await updateOrganizationCommunicationSettings(orgId, {
          whatsapp_communication: false,
          whatsapp_setup_status: "not_configured",
          whatsapp_integration_model: "none",
        });
      }

      // Update events
      if (userId) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: false, updated_at: now })
          .eq("organizer_id", userId);
      }

      if (nonPersonalOrgs.length > 0) {
        await admin
          .from("events")
          .update({ whatsapp_enabled: false, updated_at: now })
          .in("organization_id", nonPersonalOrgs);
      }

      // Log live ops event
      recordLiveOpsEvent({
        level: "WARN",
        category: "SYSTEM",
        message: `[OPS ACTION] UrPass Managed WhatsApp DEACTIVATED for ${userEmail} (Org: ${canonicalOrgId})`,
        details: { userId, orgId: canonicalOrgId, enabled: false },
      });

      return NextResponse.json({
        success: true,
        message: `Managed WhatsApp disabled for ${userEmail}`,
        orgId: canonicalOrgId,
        enabled: false,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to process request";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
