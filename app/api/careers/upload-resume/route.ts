import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Enforce PDF format
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF documents (.pdf) are accepted for resume upload." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file size exceeds the 5MB limit. Please upload a smaller PDF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .toLowerCase();
    const fileName = `resumes/${Date.now()}_${safeName}`;

    const admin = createAdminClient(
      getSupabaseUrl(),
      process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"
    );

    const bucketName = "resumes";

    // Ensure bucket exists
    try {
      await admin.storage.createBucket(bucketName, { public: true });
    } catch {
      // Bucket may already exist
    }

    const { error: uploadError } = await admin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      // Storage fallback: safe base64 representation if storage engine is unreachable
      console.warn("[resume-upload] Supabase storage warning, using fallback:", uploadError.message);
      const dataUri = `data:application/pdf;base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        filename: file.name,
        size: file.size,
        fallback: true,
      });
    }

    const { data: publicData } = admin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
