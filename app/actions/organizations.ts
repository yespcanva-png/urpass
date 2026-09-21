"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { orgSchema, type OrgInput } from "@/lib/validations/organization";
import { getUserPlan } from "@/lib/plan";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type ActionResult = { error: string } | undefined;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function generateSlugCandidate(name: string, suffix?: number): string {
  const base = toSlug(name) || "org";
  return suffix ? `${base}-${suffix}` : base;
}

export async function createOrganization(data: OrgInput): Promise<ActionResult | { slug: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canCreateOrganizations) {
    return { error: "Organizations are available on Starter and Pro plans. Upgrade to create one." };
  }

  const parsed = orgSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Retry insert with incremented suffix on slug collision (RLS makes pre-checking unreliable)
  let org: { id: string; slug: string } | null = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = generateSlugCandidate(parsed.data.name, attempt > 0 ? attempt + 1 : undefined);
    const { data: inserted, error: orgError } = await supabase
      .from("organizations")
      .insert({ ...parsed.data, slug, created_by: user.id })
      .select("id, slug")
      .single();
    if (!orgError) { org = inserted; break; }
    if (orgError.code !== "23505") return { error: orgError.message };
  }
  if (!org) return { error: "Could not generate a unique slug. Try a different name." };

  // Creator becomes owner — use admin client to bypass RLS bootstrap problem
  // (user has no role yet so org_members_admin_insert policy would block them)
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", user.id)
    .single();

  const { error: memberError } = await adminClient()
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: user.id,
      invited_email: profile?.email ?? user.email ?? "",
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });

  if (memberError) return { error: memberError.message };

  revalidatePath("/dashboard/organizations");
  return { slug: org.slug };
}

export async function updateOrganization(orgId: string, data: OrgInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = orgSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("organizations")
    .update(parsed.data)
    .eq("id", orgId);

  if (error) return { error: error.message };

  revalidatePath(`/org`);
}

export async function deleteOrganization(orgId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/organizations");
  redirect("/dashboard/organizations");
}

export async function getOrganization(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!org) return null;

  const { data: member } = await supabase
    .from("organization_members")
    .select("role, status")
    .eq("organization_id", org.id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  return { org, userRole: member?.role ?? null };
}

export async function getUserOrganizations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("organization_members")
    .select("role, organization:organizations(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) {
    // Auto-provision if user has no org yet
    await ensureUserOrganization(user.id);
    const { data: refreshed } = await supabase
      .from("organization_members")
      .select("role, organization:organizations(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    return (refreshed ?? []).map((m) => ({
      org: m.organization as unknown as import("@/types").Organization,
      role: m.role as import("@/types").OrgRole,
    }));
  }

  return (data ?? []).map((m) => ({
    org: m.organization as unknown as import("@/types").Organization,
    role: m.role as import("@/types").OrgRole,
  }));
}

export async function ensureUserOrganization(userId: string): Promise<string | null> {
  const admin = adminClient();
  try {
    const { data: member } = await admin
      .from("organization_members")
      .select("organization_id, organization:organizations(slug)")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (member?.organization_id) {
      return (member.organization as unknown as { slug: string })?.slug ?? null;
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .maybeSingle();

    const name = profile?.full_name?.trim() || "My";
    const orgName = `${name}'s Organization`;
    const baseSlug = toSlug(name) || "org";
    let slug = baseSlug;
    let attempt = 1;
    while (true) {
      const { data: existing } = await admin.from("organizations").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${attempt++}`;
    }

    const { data: newOrg, error: orgErr } = await admin
      .from("organizations")
      .insert({
        name: orgName,
        slug,
        contact_email: profile?.email || null,
        created_by: userId,
        brand_color: "#6D28D9",
      })
      .select()
      .single();

    if (orgErr || !newOrg) return null;

    await admin.from("organization_members").insert({
      organization_id: newOrg.id,
      user_id: userId,
      invited_email: profile?.email || "",
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });

    return newOrg.slug;
  } catch {
    return null;
  }
}

