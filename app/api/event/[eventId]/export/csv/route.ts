import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";

export const dynamic = "force-dynamic";

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check event access
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_fields")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const isOrganizer = event.organizer_id === user.id;
  let hasOrgAccess = false;
  if (!isOrganizer && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "finance", "gate_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Check plan export capability
  const plan = await getUserPlan(supabase, event.organizer_id || user.id);
  if (!plan.canExport) {
    return NextResponse.json(
      { error: "Data export is available on the Pro plan. Upgrade to use this feature." },
      { status: 403 }
    );
  }

  const customFields = (event.custom_fields ?? []) as { id: string; label: string }[];
  const customHeaders = customFields.map((f) => f.label);
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Pass Type",
    "Application Status",
    "Pass Status",
    "Registered At",
    ...customHeaders,
  ];

  const headerLine = headers.map(escapeCsvCell).join(",") + "\n";
  const encoder = new TextEncoder();

  // Create streaming response to prevent Vercel memory exhaustion with 10k attendees
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(headerLine));

      let lastCreatedAt: string | null = null;
      let lastId: string | null = null;
      const batchSize = 300;
      let hasMore = true;

      try {
        while (hasMore) {
          let query = supabase
            .from("attendees")
            .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, created_at")
            .eq("event_id", eventId)
            .order("created_at", { ascending: false })
            .order("id", { ascending: false })
            .limit(batchSize);

          if (lastCreatedAt && lastId) {
            query = query.or(
              `created_at.lt.${lastCreatedAt},and(created_at.eq.${lastCreatedAt},id.lt.${lastId})`
            );
          }

          const { data: rows, error } = await query;
          if (error || !rows || rows.length === 0) {
            hasMore = false;
            break;
          }

          let chunk = "";
          for (const a of rows) {
            const customVals = customFields.map((f) => {
              const val = (a as unknown as { custom_responses?: Record<string, unknown> }).custom_responses?.[f.id];
              if (val === true) return "Yes";
              if (val === false) return "No";
              return val ?? "";
            });

            const rowCells = [
              a.name,
              a.email,
              a.phone ?? "",
              a.pass_type,
              a.application_status,
              a.pass_status,
              a.created_at ? new Date(a.created_at).toISOString().slice(0, 10) : "",
              ...customVals,
            ];

            chunk += rowCells.map(escapeCsvCell).join(",") + "\n";
          }

          controller.enqueue(encoder.encode(chunk));

          if (rows.length < batchSize) {
            hasMore = false;
          } else {
            const lastRow = rows[rows.length - 1];
            lastCreatedAt = lastRow.created_at;
            lastId = lastRow.id;
          }
        }
      } catch (err) {
        console.error("[csv-stream] Error streaming CSV:", err);
      } finally {
        controller.close();
      }
    },
  });

  const sanitizedFilename = (event.name || "attendees")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .slice(0, 40);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${sanitizedFilename}-attendees.csv"`,
      "Cache-Control": "no-cache, no-store",
      "Transfer-Encoding": "chunked",
    },
  });
}
