import { NextRequest, NextResponse } from "next/server";
import { POST as syncHandler } from "@/app/api/scan/sync/route";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = await req.json().catch(() => ({}));
  const forwardedReq = new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ ...body, eventId }),
  });
  return syncHandler(forwardedReq);
}
