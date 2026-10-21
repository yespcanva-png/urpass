import { NextRequest, NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import {
  getAllJobsForOps,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from "@/lib/careers/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobs = await getAllJobsForOps();
    return NextResponse.json({ success: true, jobs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch jobs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.department || !body.summary || !body.description) {
      return NextResponse.json(
        { error: "Title, department, summary, and description are required." },
        { status: 400 }
      );
    }

    const job = await createJobPosting({
      title: body.title,
      slug: body.slug,
      department: body.department,
      location: body.location || "Bengaluru, India",
      workplaceType: body.workplaceType || "hybrid",
      employmentType: body.employmentType || "full-time",
      experienceLevel: body.experienceLevel || "mid",
      summary: body.summary,
      description: body.description,
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      niceToHave: Array.isArray(body.niceToHave) ? body.niceToHave : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      status: body.status || "draft",
    });

    return NextResponse.json({ success: true, job });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create job posting";
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
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const updated = await updateJobPosting(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authenticated = await isOpsAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const deleted = await deleteJobPosting(id);
    return NextResponse.json({ success: deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
