import { NextRequest, NextResponse } from "next/server";
import { submitJobApplication } from "@/lib/careers/service";
import type { SubmitApplicationInput } from "@/lib/careers/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot anti-spam check: bots fill hidden "website_url_check" field
    if (body.website_url_check) {
      return NextResponse.json({ success: true, applicationId: "app-preview-bot" });
    }

    const {
      jobId,
      jobSlug,
      jobTitle,
      department,
      applicationType,
      fullName,
      email,
      phone,
      linkedinUrl,
      portfolioUrl,
      githubUrl,
      yearsOfExperience,
      coverNote,
      resumeUrl,
      resumeFilename,
    } = body as Partial<SubmitApplicationInput>;

    if (!fullName || !email || !coverNote) {
      return NextResponse.json(
        { error: "Please provide your full name, email address, and introductory message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await submitJobApplication(
      {
        jobId,
        jobSlug,
        jobTitle,
        department,
        applicationType: applicationType || "job_specific",
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
        linkedinUrl: linkedinUrl?.trim(),
        portfolioUrl: portfolioUrl?.trim(),
        githubUrl: githubUrl?.trim(),
        yearsOfExperience: yearsOfExperience?.trim(),
        coverNote: coverNote.trim(),
        resumeUrl: resumeUrl?.trim(),
        resumeFilename: resumeFilename?.trim(),
      },
      { ip, userAgent }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to submit application. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: result.applicationId,
      message: "Application submitted successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
