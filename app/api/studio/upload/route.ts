import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { validateAndSanitizeUpload } from "@/lib/uploads/secure-upload";
import crypto from "crypto";

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

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "No form data provided" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Secure verification: MIME, magic bytes, size limits & SVG sanitization
    const validation = await validateAndSanitizeUpload(rawBuffer, file.type);
    if (!validation.valid || !validation.sanitizedBuffer || !validation.mimeType) {
      return NextResponse.json(
        { error: validation.error || "File validation failed" },
        { status: 400 }
      );
    }

    const mimeType = validation.mimeType;
    const extension = validation.extension || "png";
    const buffer = validation.sanitizedBuffer;

    const fileName = `${user.id}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;

    const admin = createAdminClient(
      getSupabaseUrl(),
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy"
    );

    const bucketName = "ticket-assets";

    // Ensure bucket exists
    try {
      await admin.storage.createBucket(bucketName, { public: true });
    } catch {
      // Bucket may already exist
    }

    const { error: uploadError } = await admin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      // If Supabase storage is not provisioned or in mock environment, fallback to data URL or error
      console.warn("Storage upload warning, fallback:", uploadError.message);
      return NextResponse.json({
        success: true,
        url: `data:${mimeType};base64,${buffer.toString("base64")}`,
        fallback: true,
      });
    }

    const { data: publicData } = admin.storage.from(bucketName).getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
