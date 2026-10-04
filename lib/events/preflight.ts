import { createClient } from "@/lib/supabase/server";

export interface PreflightItem {
  id:
    | "dates"
    | "ticket_setup"
    | "capacity"
    | "payment_gateway"
    | "venue_or_meeting_url"
    | "pass_design"
    | "communication_setup";
  title: string;
  passed: boolean;
  severity: "error" | "warning";
  message: string;
}

export interface EventPreflightResult {
  ready: boolean;
  errors: PreflightItem[];
  warnings: PreflightItem[];
  items: PreflightItem[];
}

export async function validateEventPreflightReadiness(
  eventId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customClient?: any
): Promise<EventPreflightResult> {
  const supabase = customClient || (await createClient());

  // 1. Fetch Event Details
  const { data: event } = await supabase
    .from("events")
    .select(`
      id,
      name,
      description,
      event_date,
      start_time,
      end_time,
      venue,
      event_type,
      meeting_url,
      attendee_limit,
      application_enabled,
      organizer_id,
      organization_id,
      event_pass_id,
      custom_pass_design,
      status
    `)
    .eq("id", eventId)
    .single();

  if (!event) {
    return {
      ready: false,
      errors: [
        {
          id: "dates",
          title: "Event Not Found",
          passed: false,
          severity: "error",
          message: "The requested event record does not exist in the database.",
        },
      ],
      warnings: [],
      items: [],
    };
  }

  // 2. Fetch Ticket Types
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("id, name, price, capacity, status")
    .eq("event_id", eventId);

  // 3. Fetch Payment Settings (if applicable)
  const [{ data: userPaymentSettings }, { data: orgPaymentSettings }] = await Promise.all([
    supabase
      .from("payment_settings")
      .select("razorpay_key_id, razorpay_key_secret, is_active")
      .eq("user_id", event.organizer_id)
      .maybeSingle(),
    event.organization_id
      ? supabase
          .from("org_payment_settings")
          .select("razorpay_key_id, razorpay_key_secret, is_active")
          .eq("organization_id", event.organization_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const items: PreflightItem[] = [];

  // =========================================================================
  // CHECK 1: DATES & TIMING
  // =========================================================================
  let datesPassed = true;
  let datesMessage = "Event date and operational hours are properly configured.";

  if (!event.event_date) {
    datesPassed = false;
    datesMessage = "Event date is missing. Set a valid scheduled date.";
  } else {
    const eventDay = new Date(event.event_date);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (eventDay < yesterday) {
      datesPassed = false;
      datesMessage = `Event date (${event.event_date}) is in the past. Update to a future date before publishing.`;
    }
  }

  if (datesPassed && event.start_time && event.end_time) {
    if (event.start_time > event.end_time) {
      datesPassed = false;
      datesMessage = `Start time (${event.start_time}) cannot be later than end time (${event.end_time}).`;
    }
  }

  items.push({
    id: "dates",
    title: "Event Schedule & Dates",
    passed: datesPassed,
    severity: "error",
    message: datesMessage,
  });

  // =========================================================================
  // CHECK 2: TICKET SETUP
  // =========================================================================
  const activeTiers = (ticketTypes || []).filter(
    (t: any) => t.status === "active" || t.status === "on_sale" || !t.status
  );
  const hasTickets = activeTiers.length > 0 || event.application_enabled;
  let ticketMessage = "Ticket tiers or attendee application form configured.";

  if (!hasTickets) {
    ticketMessage = "No active ticket tiers found and direct applications are disabled. Add at least one ticket tier.";
  }

  items.push({
    id: "ticket_setup",
    title: "Ticket Setup & Registration Flow",
    passed: hasTickets,
    severity: "error",
    message: ticketMessage,
  });

  // =========================================================================
  // CHECK 3: CAPACITY LIMITS
  // =========================================================================
  const totalTierCapacity = activeTiers.reduce((sum: number, t: any) => sum + (t.capacity || 0), 0);
  const effectiveCapacity = (event.attendee_limit || 0) > 0 ? event.attendee_limit : totalTierCapacity;
  const capacityPassed = effectiveCapacity > 0;
  const capacityMessage = capacityPassed
    ? `Total event capacity is set to ${effectiveCapacity} attendees.`
    : "Event attendee capacity is 0. Set a positive attendee limit or ticket tier capacity.";

  items.push({
    id: "capacity",
    title: "Attendee Capacity Limits",
    passed: capacityPassed,
    severity: "error",
    message: capacityMessage,
  });

  // =========================================================================
  // CHECK 4: PAYMENT GATEWAY (IF PAID TICKETS EXIST)
  // =========================================================================
  const hasPaidTickets = (ticketTypes || []).some((t: any) => (t.price || 0) > 0);
  let gatewayPassed = true;
  let gatewaySeverity: "error" | "warning" = "warning";
  let gatewayMessage = "Free event: payment gateway not required.";

  if (hasPaidTickets) {
    const hasActiveOrgGateway = Boolean(orgPaymentSettings?.razorpay_key_id && orgPaymentSettings?.is_active);
    const hasActiveUserGateway = Boolean(userPaymentSettings?.razorpay_key_id && userPaymentSettings?.is_active);
    const hasManagedPlatform = Boolean(process.env.RAZORPAY_KEY_ID);

    if (hasActiveOrgGateway || hasActiveUserGateway || hasManagedPlatform) {
      gatewayPassed = true;
      gatewayMessage = hasActiveOrgGateway
        ? "Organization Razorpay payment gateway connected and active."
        : hasActiveUserGateway
        ? "Organizer Razorpay payment gateway connected and active."
        : "UrPass Managed Payments gateway ready for ticket collection.";
    } else {
      gatewayPassed = false;
      gatewaySeverity = "error";
      gatewayMessage =
        "Paid ticket tiers exist, but no payment gateway (Razorpay or Managed Payments) is configured. Connect a payment gateway in settings before publishing.";
    }
  }

  items.push({
    id: "payment_gateway",
    title: "Payment Gateway Connection",
    passed: gatewayPassed,
    severity: gatewaySeverity,
    message: gatewayMessage,
  });

  // =========================================================================
  // CHECK 5: VENUE / MEETING URL
  // =========================================================================
  const eventType = event.event_type || "physical";
  let venuePassed = true;
  let venueMessage = "Physical venue location verified.";

  if (eventType === "physical") {
    if (!event.venue || event.venue.trim().length < 2) {
      venuePassed = false;
      venueMessage = "Physical event requires a venue location or address.";
    }
  } else if (eventType === "online") {
    if (!event.meeting_url || !event.meeting_url.startsWith("http")) {
      venuePassed = false;
      venueMessage = "Online event requires a valid broadcast or meeting URL (Zoom, Google Meet, Teams, etc.).";
    } else {
      venueMessage = "Online event meeting URL verified.";
    }
  } else if (eventType === "hybrid") {
    if (!event.venue || !event.meeting_url) {
      venuePassed = false;
      venueMessage = "Hybrid event requires both a physical venue address and an online broadcast URL.";
    } else {
      venueMessage = "Hybrid event physical venue and online link verified.";
    }
  }

  items.push({
    id: "venue_or_meeting_url",
    title: "Venue & Access Location",
    passed: venuePassed,
    severity: "error",
    message: venueMessage,
  });

  // =========================================================================
  // CHECK 6: PASS DESIGN & BRANDING
  // =========================================================================
  const passDesignPassed = Boolean(event.event_pass_id || event.custom_pass_design || true);
  const passDesignMessage = event.custom_pass_design
    ? "Custom branded pass template configured."
    : "Standard high-contrast QR pass template active.";

  items.push({
    id: "pass_design",
    title: "Digital Pass Design",
    passed: passDesignPassed,
    severity: "warning",
    message: passDesignMessage,
  });

  // =========================================================================
  // CHECK 7: COMMUNICATION & NOTIFICATIONS
  // =========================================================================
  const commPassed = Boolean(event.organizer_id);
  const commMessage = "Attendee confirmation notifications ready.";

  items.push({
    id: "communication_setup",
    title: "Attendee Delivery & Communications",
    passed: commPassed,
    severity: "warning",
    message: commMessage,
  });

  // Compile Result
  const errors = items.filter((i) => !i.passed && i.severity === "error");
  const warnings = items.filter((i) => !i.passed && i.severity === "warning");
  const ready = errors.length === 0;

  return {
    ready,
    errors,
    warnings,
    items,
  };
}
