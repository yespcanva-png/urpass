"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { domainSchema } from "@/lib/validations/sso";
import {
  generateVerificationToken,
  checkDnsTxtRecord,
} from "@/lib/sso/domain-verification";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";
import type { VerifiedDomain } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getVerifiedDomains(orgId: string): Promise<VerifiedDomain[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("verified_domains")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as VerifiedDomain[];
}

export async function addDomain(
  orgId: string,
  rawDomain: string
): Promise<{ success: boolean; domain?: VerifiedDomain; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  // Check admin/owner
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only organization owners and admins can manage verified domains." };
  }

  const clean = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const parsed = domainSchema.safeParse({ domain: clean });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const admin = adminClient();

  // Check if domain already exists
  const { data: existing } = await admin
    .from("verified_domains")
    .select("id, organization_id")
    .eq("domain", clean)
    .maybeSingle();

  if (existing) {
    if (existing.organization_id === orgId) {
      return { success: false, error: "This domain is already added to your organization." };
    }
    return { success: false, error: "This domain is already claimed by another organization." };
  }

  const token = generateVerificationToken();

  const { data: inserted, error: insertErr } = await admin
    .from("verified_domains")
    .insert({
      organization_id: orgId,
      domain: clean,
      verification_method: "dns_txt",
      verification_token: token,
      status: "pending",
    })
    .select("*")
    .single();

  if (insertErr || !inserted) {
    return { success: false, error: insertErr?.message || "Failed to add domain." };
  }

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "domain.added",
    resourceType: "domain",
    resourceId: inserted.id,
    details: { domain: clean, token },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true, domain: inserted as VerifiedDomain };
}

export async function verifyDomain(
  orgId: string,
  domainId: string
): Promise<{
  success: boolean;
  message?: string;
  recordsFound?: string[];
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const admin = adminClient();
  const { data: domainRec } = await admin
    .from("verified_domains")
    .select("*")
    .eq("id", domainId)
    .eq("organization_id", orgId)
    .single();

  if (!domainRec) {
    return { success: false, error: "Domain not found." };
  }

  // Check DNS TXT record
  const check = await checkDnsTxtRecord(domainRec.domain, domainRec.verification_token);

  if (check.verified) {
    await admin
      .from("verified_domains")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", domainId);

    // Automatically add verified domain to SSO connection domains list if present
    const { data: sso } = await admin
      .from("enterprise_sso_connections")
      .select("id, domains")
      .eq("organization_id", orgId)
      .maybeSingle();

    if (sso) {
      const currentDomains: string[] = sso.domains || [];
      if (!currentDomains.includes(domainRec.domain)) {
        await admin
          .from("enterprise_sso_connections")
          .update({ domains: [...currentDomains, domainRec.domain] })
          .eq("id", sso.id);
      }
    }

    await recordAuditLog({
      organizationId: orgId,
      userId: user.id,
      actorEmail: user.email,
      action: "domain.verified",
      resourceType: "domain",
      resourceId: domainId,
      details: { domain: domainRec.domain },
    });

    revalidatePath("/org/[orgSlug]/settings/security", "page");
    return {
      success: true,
      message: `Domain '${domainRec.domain}' verified successfully!`,
      recordsFound: check.recordsFound,
    };
  } else {
    await admin
      .from("verified_domains")
      .update({
        status: "failed",
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", domainId);

    await recordAuditLog({
      organizationId: orgId,
      userId: user.id,
      actorEmail: user.email,
      action: "domain.verification_failed",
      resourceType: "domain",
      resourceId: domainId,
      details: { domain: domainRec.domain, error: check.error },
    });

    return {
      success: false,
      error: check.error || "TXT record verification failed.",
      recordsFound: check.recordsFound,
    };
  }
}

export async function deleteDomain(
  orgId: string,
  domainId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const admin = adminClient();
  const { data: domainRec } = await admin
    .from("verified_domains")
    .select("domain")
    .eq("id", domainId)
    .eq("organization_id", orgId)
    .single();

  if (!domainRec) return { success: false, error: "Domain not found." };

  // If SSO connection was enforcing this domain, remove it
  const { data: sso } = await admin
    .from("enterprise_sso_connections")
    .select("id, domains, enforce_sso")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (sso) {
    const updatedDomains = (sso.domains || []).filter((d: string) => d !== domainRec.domain);
    // If no domains left, disable enforce_sso
    const newEnforce = updatedDomains.length === 0 ? false : sso.enforce_sso;
    await admin
      .from("enterprise_sso_connections")
      .update({ domains: updatedDomains, enforce_sso: newEnforce })
      .eq("id", sso.id);
  }

  await admin.from("verified_domains").delete().eq("id", domainId);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "domain.removed",
    resourceType: "domain",
    resourceId: domainId,
    details: { domain: domainRec.domain },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true };
}
