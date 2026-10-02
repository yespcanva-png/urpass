import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EMAIL_TEMPLATES_CATALOG, EmailTemplateSlug } from "@/lib/email-engine/templates";
import { communicationEngine } from "@/lib/email-engine/service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { templateSlug, toEmail, data } = body as {
      templateSlug?: EmailTemplateSlug;
      toEmail?: string;
      data?: Record<string, unknown>;
    };

    if (!templateSlug || !EMAIL_TEMPLATES_CATALOG[templateSlug]) {
      return NextResponse.json(
        { error: `Unknown template slug: ${templateSlug}` },
        { status: 400 }
      );
    }

    const recipient = (toEmail && toEmail.includes("@")) ? toEmail : user.email;
    if (!recipient) {
      return NextResponse.json(
        { error: "Valid recipient email address is required" },
        { status: 400 }
      );
    }

    const templateMeta = EMAIL_TEMPLATES_CATALOG[templateSlug];
    const mergedData = {
      ...templateMeta.sampleData,
      ...(data || {}),
      name: (data?.name as string) || user.user_metadata?.full_name?.split(" ")[0] || "Organizer",
    };

    const rendered = templateMeta.render(mergedData);

    const result = await communicationEngine.dispatchEmail({
      to: recipient,
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
      templateSlug,
      userId: user.id,
      metadata: { isTest: true, originalRecipient: recipient },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to dispatch test email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      simulated: result.simulated ?? false,
      messageId: result.messageId,
      recipient,
      subject: rendered.subject,
    });
  } catch (err: unknown) {
    console.error("Test email API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
