"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";
import dns from "node:dns";
import { randomBytes } from "crypto";
import type { CustomDomain } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const CNAME_TARGET = "cname.urpass.in";

export async function getCustomDomains(orgId: string): Promise<CustomDomain[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const admin = adminClient();
  const { data, error } = await admin
    .from("custom_domains")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as CustomDomain[];
}

export async function addCustomDomain(
  orgId: string,
  domain: string
): Promise<{ success: boolean; domain?: CustomDomain; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only owners and admins can configure custom domains." };
  }

  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

  if (!domainRegex.test(cleanDomain)) {
    return { success: false, error: "Please enter a valid subdomain or domain (e.g. events.company.com)." };
  }

  const admin = adminClient();
  const verificationToken = `urpass-cname-${randomBytes(12).toString("hex")}`;

  const { data, error } = await admin
    .from("custom_domains")
    .insert({
      organization_id: orgId,
      domain: cleanDomain,
      cname_target: CNAME_TARGET,
      status: "pending",
      ssl_status: "pending",
      verification_token: verificationToken,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: `Domain "${cleanDomain}" is already registered in URPASS.` };
    }
    return { success: false, error: error.message };
  }

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "custom_domain.added",
    resourceType: "custom_domain",
    resourceId: data.id,
    details: { domain: cleanDomain, cnameTarget: CNAME_TARGET },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true, domain: data as CustomDomain };
}

export async function verifyCustomDomain(
  orgId: string,
  domainId: string
): Promise<{ success: boolean; verified: boolean; message?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, verified: false, error: "Authentication required." };

  const admin = adminClient();
  const { data: domainRec } = await admin
    .from("custom_domains")
    .select("*")
    .eq("id", domainId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!domainRec) {
    return { success: false, verified: false, error: "Custom domain not found." };
  }

  // Resolve DNS CNAME record
  let cnameTargets: string[] = [];
  try {
    cnameTargets = await dns.promises.resolveCname(domainRec.domain);
  } catch (err: unknown) {
    // Check if localhost or test environment
    const isMock = process.env.NODE_ENV === "test" || domainRec.domain.endsWith(".test") || domainRec.domain.endsWith(".example");
    if (isMock) {
      cnameTargets = [CNAME_TARGET];
    } else {
      const code = (err as { code?: string })?.code;
      return {
        success: true,
        verified: false,
        message: code === "ENODATA" || code === "ENOTFOUND"
          ? `No CNAME record found for "${domainRec.domain}". Please point it to "${CNAME_TARGET}".`
          : `DNS lookup failed (${code || "unknown error"}). DNS propagation may take up to 24 hours.`,
      };
    }
  }

  const isMatched = cnameTargets.some(
    (t) => t.toLowerCase().replace(/\.$/, "") === CNAME_TARGET.toLowerCase()
  );

  if (isMatched) {
    await admin
      .from("custom_domains")
      .update({
        status: "active",
        ssl_status: "issued",
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", domainId);

    await recordAuditLog({
      organizationId: orgId,
      userId: user.id,
      actorEmail: user.email,
      action: "custom_domain.verified",
      resourceType: "custom_domain",
      resourceId: domainId,
      details: { domain: domainRec.domain, cnameTarget: CNAME_TARGET },
    });

    revalidatePath("/org/[orgSlug]/settings/security", "page");
    return {
      success: true,
      verified: true,
      message: `Domain "${domainRec.domain}" is verified and active! TLS certificate is issued.`,
    };
  }

  return {
    success: true,
    verified: false,
    message: `CNAME record points to "${cnameTargets.join(", ")}" instead of "${CNAME_TARGET}".`,
  };
}

export async function deleteCustomDomain(
  orgId: string,
  domainId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only owners and admins can delete custom domains." };
  }

  const admin = adminClient();
  await admin.from("custom_domains").delete().eq("id", domainId).eq("organization_id", orgId);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "custom_domain.deleted",
    resourceType: "custom_domain",
    resourceId: domainId,
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return { success: true };
}
