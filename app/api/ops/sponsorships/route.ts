import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import {
  getSponsorshipApplications,
  approveSponsorshipApplication,
  rejectSponsorshipApplication,
} from "@/lib/ops/sponsorship";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await getSponsorshipApplications();
  return NextResponse.json({ success: true, applications });
}

export async function POST(req: Request) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, applicationId, reason } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const res = await approveSponsorshipApplication(applicationId);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, application: res.application });
    }

    if (action === "reject") {
      const res = await rejectSponsorshipApplication(applicationId, reason);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, application: res.application });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported: approve, reject" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to process" },
      { status: 500 }
    );
  }
}
