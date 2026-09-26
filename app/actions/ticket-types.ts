"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ticketTypeSchema, type TicketTypeInput } from "@/lib/validations/ticket-type";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type TicketCategory =
  | "general"
  | "vip"
  | "student"
  | "early_bird"
  | "workshop"
  | "staff"
  | "speaker"
  | "custom";

type TicketStatus = "draft" | "on_sale" | "closed" | "sold_out";

export interface TicketTypeWithStats {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  category: TicketCategory;
  price: number; // paise
  capacity: number | null;
  sales_start: string | null;
  sales_end: string | null;
  max_per_person: number;
  status: "draft" | "on_sale" | "closed";
  position: number;
  created_at: string;
  updated_at: string;
  sold_count: number;
  effective_status: TicketStatus;
}

async function canManageTicketTypes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();
  if (!data) return false;
  if (data.organizer_id === userId) return true;
  if (!data.organization_id) return false;

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", data.organization_id)
    .eq("user_id", userId)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  return !!member;
}

export async function getEventTicketTypes(
  eventId: string
): Promise<TicketTypeWithStats[]> {
  const supabase = await createClient();

  const { data: types, error } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", eventId)
    .order("position", { ascending: true });

  if (error || !types) return [];

  // Count approved attendees per ticket_type_id for this event
  const { data: counts } = await supabase
    .from("attendees")
    .select("ticket_type_id")
    .eq("event_id", eventId)
    .eq("application_status", "approved")
    .not("ticket_type_id", "is", null);

  const soldMap: Record<string, number> = {};
  for (const row of counts ?? []) {
    if (row.ticket_type_id) {
      soldMap[row.ticket_type_id] = (soldMap[row.ticket_type_id] ?? 0) + 1;
    }
  }

  return types.map((tt) => {
    const sold_count = soldMap[tt.id] ?? 0;
    const effective_status: TicketStatus =
      tt.capacity != null && sold_count >= tt.capacity
        ? "sold_out"
        : tt.status;
    return { ...tt, sold_count, effective_status } as TicketTypeWithStats;
  });
}

export async function createTicketType(
  eventId: string,
  data: TicketTypeInput
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const canManage = await canManageTicketTypes(supabase, eventId, user.id);
  if (!canManage) return { error: "Event not found or you do not have access." };

  const parsed = ticketTypeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, description, category, price, capacity, sales_start, sales_end, max_per_person, status } =
    parsed.data;

  // Determine next position
  const { data: existing } = await supabase
    .from("ticket_types")
    .select("position")
    .eq("event_id", eventId)
    .order("position", { ascending: false })
    .limit(1);
  const position = existing && existing.length > 0 ? (existing[0].position ?? 0) + 1 : 0;

  const sanitizedSalesStart =
    sales_start && typeof sales_start === "string" && sales_start.trim() !== ""
      ? sales_start.trim()
      : null;
  const sanitizedSalesEnd =
    sales_end && typeof sales_end === "string" && sales_end.trim() !== ""
      ? sales_end.trim()
      : null;

  const insertData = {
    event_id: eventId,
    name,
    description: description ?? null,
    category,
    price: Math.round(price * 100), // rupees → paise
    capacity: capacity ?? null,
    sales_start: sanitizedSalesStart,
    sales_end: sanitizedSalesEnd,
    max_per_person,
    status,
    position,
  };

  let createdId: string | null = null;
  const { data: created, error } = await supabase
    .from("ticket_types")
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      const { data: adminCreated, error: adminError } = await admin
        .from("ticket_types")
        .insert(insertData)
        .select("id")
        .single();
      if (adminError) return { error: adminError.message };
      createdId = adminCreated?.id ?? null;
    } else {
      return { error: error.message };
    }
  } else {
    createdId = created?.id ?? null;
  }

  if (!createdId) return { error: "Failed to create ticket tier." };

  revalidatePath(`/event/${eventId}/tickets`);
  return { id: createdId };
}

export async function updateTicketType(
  ticketTypeId: string,
  data: TicketTypeInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the ticket type to get its event_id
  const { data: existing } = await supabase
    .from("ticket_types")
    .select("event_id")
    .eq("id", ticketTypeId)
    .single();
  if (!existing) return { error: "Ticket type not found." };

  const canManage = await canManageTicketTypes(supabase, existing.event_id, user.id);
  if (!canManage) return { error: "Not authorized." };

  const parsed = ticketTypeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, description, category, price, capacity, sales_start, sales_end, max_per_person, status } =
    parsed.data;

  const sanitizedSalesStart =
    sales_start && typeof sales_start === "string" && sales_start.trim() !== ""
      ? sales_start.trim()
      : null;
  const sanitizedSalesEnd =
    sales_end && typeof sales_end === "string" && sales_end.trim() !== ""
      ? sales_end.trim()
      : null;

  const updateData = {
    name,
    description: description ?? null,
    category,
    price: Math.round(price * 100), // rupees → paise
    capacity: capacity ?? null,
    sales_start: sanitizedSalesStart,
    sales_end: sanitizedSalesEnd,
    max_per_person,
    status,
  };

  const { error } = await supabase
    .from("ticket_types")
    .update(updateData)
    .eq("id", ticketTypeId);

  if (error) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      const { error: adminError } = await admin
        .from("ticket_types")
        .update(updateData)
        .eq("id", ticketTypeId);
      if (adminError) return { error: adminError.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath(`/event/${existing.event_id}/tickets`);
  return {};
}

export async function setTicketTypeStatus(
  ticketTypeId: string,
  status: "on_sale" | "draft" | "closed"
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("ticket_types")
    .select("event_id")
    .eq("id", ticketTypeId)
    .single();
  if (!existing) return { error: "Ticket type not found." };

  const canManage = await canManageTicketTypes(supabase, existing.event_id, user.id);
  if (!canManage) return { error: "Not authorized." };

  const { error } = await supabase
    .from("ticket_types")
    .update({ status })
    .eq("id", ticketTypeId);

  if (error) return { error: error.message };

  revalidatePath(`/event/${existing.event_id}/tickets`);
  revalidatePath(`/event/${existing.event_id}/settings`);
  return {};
}

export async function deleteTicketType(
  ticketTypeId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("ticket_types")
    .select("event_id")
    .eq("id", ticketTypeId)
    .single();
  if (!existing) return { error: "Ticket type not found." };

  const canManage = await canManageTicketTypes(supabase, existing.event_id, user.id);
  if (!canManage) return { error: "Not authorized." };

  const { error } = await supabase
    .from("ticket_types")
    .delete()
    .eq("id", ticketTypeId);

  if (error) return { error: error.message };

  revalidatePath(`/event/${existing.event_id}/tickets`);
  return {};
}

export async function createDefaultTicketType(
  eventId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const canManage = await canManageTicketTypes(supabase, eventId, user.id);
  if (!canManage) return { error: "Not authorized." };

  const { data: event } = await supabase
    .from("events")
    .select("attendee_limit, is_paid_event, ticket_price")
    .eq("id", eventId)
    .single();
  if (!event) return { error: "Event not found." };

  const defaultTicketData = {
    event_id: eventId,
    name: "General Admission",
    description: event.is_paid_event ? "Standard event ticket" : "Standard registration",
    category: "general" as const,
    price: event.is_paid_event ? Math.round(Number(event.ticket_price) * 100) : 0,
    capacity: event.attendee_limit,
    max_per_person: 1,
    status: "on_sale" as const,
    position: 0,
  };

  const { error } = await supabase.from("ticket_types").insert(defaultTicketData);

  if (error) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      const { error: adminError } = await admin.from("ticket_types").insert(defaultTicketData);
      if (adminError) return { error: adminError.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath(`/event/${eventId}/tickets`);
  revalidatePath(`/event/${eventId}/settings`);
  return {};
}
