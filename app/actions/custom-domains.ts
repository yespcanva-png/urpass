"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import type { CustomDomain } from "@/types";
import {
  checkCustomDomainRealtime,
  PRIMARY_CNAME_TARGET,
  parseDomainParts,
  type DnsDiagnosticResult,
} from "@/lib/dns/realtime-dns";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

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
): Promise<{
  success: boolean;
  domain?: CustomDomain;
  diagnostics?: DnsDiagnosticResult;
  error?: string;
}> {
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

  const { cleanDomain } = parseDomainParts(domain);
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

  if (!domainRegex.test(cleanDomain)) {
    return { success: false, error: "Please enter a valid subdomain or domain (e.g. events.company.com)." };
  }

  const admin = adminClient();
  const verificationToken = `urpass-cname-${randomBytes(12).toString("hex")}`;

  // Check live DNS status immediately to give real-time feedback
  const initialDnsCheck = await checkCustomDomainRealtime(cleanDomain);
  const initialStatus = initialDnsCheck.verified ? "active" : "pending";
  const initialSslStatus = initialDnsCheck.verified ? "issued" : "pending";

  const { data, error } = await admin
    .from("custom_domains")
    .insert({
      organization_id: orgId,
      domain: cleanDomain,
      cname_target: PRIMARY_CNAME_TARGET,
      status: initialStatus,
      ssl_status: initialSslStatus,
      verification_token: verificationToken,
      verified_at: initialDnsCheck.verified ? new Date().toISOString() : null,
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
    details: {
      domain: cleanDomain,
      cnameTarget: PRIMARY_CNAME_TARGET,
      initialVerified: initialDnsCheck.verified,
    },
  });

  revalidatePath("/org/[orgSlug]/settings/security", "page");
  return {
    success: true,
    domain: data as CustomDomain,
    diagnostics: initialDnsCheck,
  };
}

export async function verifyCustomDomain(
  orgId: string,
  domainId: string
): Promise<{
  success: boolean;
  verified: boolean;
  message?: string;
  diagnostics?: DnsDiagnosticResult;
  error?: string;
}> {
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

  // Perform Real-Time Multi-Resolver DNS Check (Cloudflare DoH + Google DoH + Node DNS)
  const dnsResult = await checkCustomDomainRealtime(domainRec.domain);

  if (dnsResult.verified) {
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
      details: {
        domain: domainRec.domain,
        cnameTarget: PRIMARY_CNAME_TARGET,
        resolvers: dnsResult.resolversQueried,
      },
    });

    revalidatePath("/org/[orgSlug]/settings/security", "page");
    return {
      success: true,
      verified: true,
      message: dnsResult.message,
      diagnostics: dnsResult,
    };
  }

  // Not yet verified - update updated_at timestamp
  await admin
    .from("custom_domains")
    .update({
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", domainId);

  return {
    success: true,
    verified: false,
    message: dnsResult.message,
    diagnostics: dnsResult,
  };
}

/**
 * Real-time on-the-fly DNS check for any domain before adding or while configuring
 */
export async function checkDomainDnsLive(
  domain: string
): Promise<{
  success: boolean;
  diagnostics?: DnsDiagnosticResult;
  error?: string;
}> {
  if (!domain || typeof domain !== "string" || !domain.trim()) {
    return { success: false, error: "Domain name is required." };
  }

  try {
    const diagnostics = await checkCustomDomainRealtime(domain);
    return { success: true, diagnostics };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to query real-time DNS.",
    };
  }
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
