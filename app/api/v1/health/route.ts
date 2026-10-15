import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "UrPass Event Infrastructure API",
    version: "v1",
    timestamp: new Date().toISOString(),
    endpoints: {
      passes: "/api/v1/passes/issue",
      verify: "/api/v1/passes/verify",
      events: "/api/v1/events",
      mcp: "/api/mcp",
    },
    documentation: "https://urpass.space/developers",
  });
}
