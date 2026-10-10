"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type MemberFormConfig,
  type SerialNumberConfig,
  type MemberFormSubmission,
  type MemberFormValidationResult,
  type MemberFormField,
  getMemberFormConfig,
  getSerialNumberConfig,
  getFormFieldsForTicket,
  validateMemberFormSubmission,
  bindMemberDataToAttendee,
} from "@/lib/member-forms";
import { updateEventFeatureFlag } from "@/app/actions/event-features";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type MemberFormsEventRow = {
  id: string;
  organizer_id: string;
  organization_id?: string | null;
  custom_pass_design?: Record<string, unknown> | null;
};

async function getActiveOrgRole(
  db: ReturnType<typeof adminClient>,
  organizationId: string | null | undefined,
  userId: string
) {
  if (!organizationId) return null;
  const { data: member } = await db
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return member?.role ?? null;
}

async function canManageEventForms(
  db: ReturnType<typeof adminClient>,
  event: MemberFormsEventRow,
  userId: string
) {
  if (event.organizer_id === userId) return true;
  const role = await getActiveOrgRole(db, event.organization_id, userId);
  return ["owner", "admin", "event_manager"].includes(role ?? "");
}

/**
 * Retrieves the active member form schema and serial number rules for an event and ticket tier.
 */
export async function getEventMemberFormSchemaAction(
  eventId: string,
  ticketTypeId?: string
): Promise<{
  success: boolean;
  formEnabled: boolean;
  serialEnabled: boolean;
  fields: MemberFormField[];
  serialConfig?: SerialNumberConfig;
  error?: string;
}> {
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, custom_pass_design, custom_fields")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      formEnabled: false,
      serialEnabled: false,
      fields: [],
      error: "EVENT_NOT_FOUND",
    };
  }

  const formConfig = getMemberFormConfig(event);
  const serialConfig = getSerialNumberConfig(event);
  const fields = getFormFieldsForTicket(event, ticketTypeId);

  return {
    success: true,
    formEnabled: formConfig.enabled,
    serialEnabled: serialConfig.enabled,
    fields,
    serialConfig: serialConfig.enabled ? serialConfig : undefined,
  };
}

/**
 * Validates and binds a member registration form submission and serial number.
 */
export async function validateAndSubmitMemberFormAction({
  eventId,
  attendeeId,
  ticketTypeId,
  submission,
}: {
  eventId: string;
  attendeeId?: string;
  ticketTypeId?: string;
  submission: MemberFormSubmission;
}): Promise<MemberFormValidationResult & { attendeeId?: string }> {
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design, custom_fields")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      valid: false,
      message: "Event not found.",
      errors: { event: "Event not found." },
    };
  }

  // Fetch existing serial numbers across scope (event or organization)
  const serialConfig = getSerialNumberConfig(event);
  let existingSerials: Array<{ serial_number?: string; attendeeId?: string; id?: string }> = [];

  if (serialConfig.enabled) {
    let query = db.from("attendees").select("id, serial_number");
    if (serialConfig.scope === "organization" && event.organization_id) {
      // Query attendees across all events in the organization
      const { data: orgEvents } = await db
        .from("events")
        .select("id")
        .eq("organization_id", event.organization_id);
      const eventIds = orgEvents ? orgEvents.map((e) => e.id) : [eventId];
      query = query.in("event_id", eventIds);
    } else {
      query = query.eq("event_id", eventId);
    }

    const { data: attendeesData } = await query;
    if (attendeesData) {
      existingSerials = attendeesData
        .filter((a) => a.serial_number)
        .map((a) => ({ serial_number: a.serial_number, attendeeId: a.id, id: a.id }));
    }
  }

  let submissionForValidation = submission;
  if (serialConfig.enabled && serialConfig.type === "auto_generated") {
    const scope = serialConfig.scope || "event";
    const scopeId =
      scope === "organization"
        ? event.organization_id || eventId
        : scope === "global"
        ? "global"
        : eventId;

    try {
      const { data: generatedSerial, error: serialError } = await db.rpc(
        "get_next_atomic_serial_sequence",
        {
          p_scope: scope,
          p_scope_id: scopeId,
          p_prefix: serialConfig.prefix || "URP-REG-",
          p_padding: serialConfig.digitPadding || 6,
          p_start_number: (serialConfig.startNumber || 1) + (serialConfig.continuationOffset || 0),
          p_suffix: serialConfig.suffix || "",
        }
      );

      if (!serialError && generatedSerial) {
        submissionForValidation = {
          ...submission,
          serialNumber: String(generatedSerial),
        };
      }
    } catch {
      // Local test environments may not have the RPC; pure validation has a deterministic fallback.
    }
  }

  const validation = validateMemberFormSubmission({
    event,
    submission: submissionForValidation,
    ticketTypeId,
    existingSerials,
    currentAttendeeId: attendeeId,
  });

  if (!validation.valid) {
    return validation;
  }

  // If attendeeId is provided, update existing attendee record
  if (attendeeId) {
    const { data: existingAttendee } = await db
      .from("attendees")
      .select("*")
      .eq("id", attendeeId)
      .maybeSingle();

    if (existingAttendee) {
      const boundData = bindMemberDataToAttendee(
        existingAttendee,
        submissionForValidation,
        validation.serialNumber
      );

        await db
        .from("attendees")
        .update({
          name: boundData.name,
          email: boundData.email,
          phone: boundData.phone,
          serial_number: boundData.serial_number,
          custom_responses: boundData.custom_responses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", attendeeId);

      // Persist detailed submission record for organizer audit and review
      try {
        await db.from("attendee_member_submissions").upsert(
          {
            event_id: eventId,
            attendee_id: attendeeId,
            ticket_type_id: ticketTypeId || null,
            name: boundData.name,
            email: boundData.email,
            phone: boundData.phone || null,
            college_org: submissionForValidation.college_org || null,
            department: submissionForValidation.department || null,
            course: submissionForValidation.course || null,
            year_or_designation: submissionForValidation.year_or_designation || null,
            roll_or_employee_id: submissionForValidation.roll_or_employee_id || null,
            serial_number: validation.serialNumber || null,
            custom_responses: submissionForValidation.customResponses || {},
            declarations: submissionForValidation.declarations || {},
            document_url: submissionForValidation.documentUrl || null,
            status: "submitted",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "event_id,attendee_id" }
        );
      } catch {
        // Safe fallback if migration 090 is still running
      }
    }
  }

  return {
    ...validation,
    attendeeId,
  };
}

/**
 * Updates member form settings for an event (organizer activation).
 */
export async function updateEventMemberFormConfigAction({
  eventId,
  config,
}: {
  eventId: string;
  config: Partial<MemberFormConfig>;
}): Promise<{ success: boolean; config?: MemberFormConfig; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return { success: false, error: "Event not found." };
  }

  if (!(await canManageEventForms(db, event as MemberFormsEventRow, user.id))) {
    return { success: false, error: "Unauthorized to update event form configuration." };
  }

  let updatedFeatureConfig = null;
  if (typeof config.enabled === "boolean") {
    const flagResult = await updateEventFeatureFlag(eventId, "member_registration_forms", config.enabled);
    if (flagResult.error) {
      return { success: false, error: flagResult.error };
    }
    updatedFeatureConfig = flagResult.config ?? null;
  }

  const existingDesign =
    event.custom_pass_design && typeof event.custom_pass_design === "object"
      ? event.custom_pass_design
      : {};

  const currentConfig = getMemberFormConfig(event);
  const updatedConfig: MemberFormConfig = {
    ...currentConfig,
    ...config,
  };

  const updatedDesign = {
    ...existingDesign,
    ...(updatedFeatureConfig ? { _featureFlags: updatedFeatureConfig } : {}),
    _memberFormConfig: updatedConfig,
  };

  const { error } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/event/${eventId}/settings`);
  return { success: true, config: updatedConfig };
}

/**
 * Updates serial number validation settings for an event (organizer activation).
 */
export async function updateEventSerialNumberConfigAction({
  eventId,
  config,
}: {
  eventId: string;
  config: Partial<SerialNumberConfig>;
}): Promise<{ success: boolean; config?: SerialNumberConfig; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return { success: false, error: "Event not found." };
  }

  if (!(await canManageEventForms(db, event as MemberFormsEventRow, user.id))) {
    return { success: false, error: "Unauthorized to update event serial configuration." };
  }

  let updatedFeatureConfig = null;
  if (typeof config.enabled === "boolean") {
    const flagResult = await updateEventFeatureFlag(eventId, "serial_number_validation", config.enabled);
    if (flagResult.error) {
      return { success: false, error: flagResult.error };
    }
    updatedFeatureConfig = flagResult.config ?? null;
  }

  const existingDesign =
    event.custom_pass_design && typeof event.custom_pass_design === "object"
      ? event.custom_pass_design
      : {};

  const currentConfig = getSerialNumberConfig(event);
  const updatedConfig: SerialNumberConfig = {
    ...currentConfig,
    ...config,
  };

  const updatedDesign = {
    ...existingDesign,
    ...(updatedFeatureConfig ? { _featureFlags: updatedFeatureConfig } : {}),
    _serialNumberConfig: updatedConfig,
  };

  const { error } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/event/${eventId}/settings`);
  return { success: true, config: updatedConfig };
}
