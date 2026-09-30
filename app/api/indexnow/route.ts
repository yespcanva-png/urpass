import { NextResponse } from "next/server";
import {
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  CORE_INDEXNOW_URLS,
  submitToIndexNow,
} from "@/lib/seo/indexnow";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "active",
    protocol: "IndexNow",
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    configuredUrlsCount: CORE_INDEXNOW_URLS.length,
    description: "Submit a POST request with optional { urls?: string[] } to push URLs to search engines.",
  });
}

export async function POST(req: Request) {
  try {
    let urlsToSubmit = CORE_INDEXNOW_URLS;

    try {
      const body = await req.json();
      if (body && Array.isArray(body.urls) && body.urls.length > 0) {
        urlsToSubmit = body.urls;
      }
    } catch {
      // If no JSON body, default to CORE_INDEXNOW_URLS
    }

    const result = await submitToIndexNow(urlsToSubmit);

    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit to IndexNow",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
