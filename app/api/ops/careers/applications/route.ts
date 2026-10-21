import { NextRequest, NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import {
  getApplicationsForOps,
  updateApplicationStatusAndNotes,
} from "@/lib/careers/service";
import type { ApplicationStatus } from "@/lib/careers/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const applications = await getApplicationsForOps({ jobId, status, search });
    return NextResponse.json({ success: true, applications });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch applications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const updated = await updateApplicationStatusAndNotes(body.id, {
      status: body.status as ApplicationStatus | undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
