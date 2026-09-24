import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowed size of 5MB" },
        { status: 400 }
      );
    }

    const mimeType = file.type || "image/png";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Invalid image format. Supported formats: PNG, JPG, WebP, SVG" },
        { status: 400 }
      );
    }

    // Determine extension
    let extension = "png";
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") extension = "jpg";
    else if (mimeType === "image/webp") extension = "webp";
    else if (mimeType === "image/svg+xml") extension = "svg";

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

    const buffer = Buffer.from(await file.arrayBuffer());

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
