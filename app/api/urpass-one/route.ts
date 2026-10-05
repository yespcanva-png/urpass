import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, apikey",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/urpass-one
 *
 * UrPass One Backend Service Gateway
 * Returns operational endpoints, schema capabilities, and service health for mobile stations.
 */
export async function GET() {
  return NextResponse.json(
    {
      app: "UrPass One",
      service: "UrPass Event Operations API",
      version: "1.0.0",
      status: "operational",
      timestamp: new Date().toISOString(),
      endpoints: {
        manifest: "/api/scan/manifest?eventId={eventId}",
        sync: "/api/scan/sync",
        ssoLookup: "/api/auth/sso/lookup?email={email}",
        staffDevices: "/api/event/{eventId}/ops/staff-devices",
        zones: "/api/event/{eventId}/ops/zones",
        scan: "/api/event/{eventId}/ops/scan",
        telemetry: "/api/ops/telemetry",
      },
      capabilities: {
        offlineManifestVersion: 1,
        subSecondQrValidation: true,
        duplicateReuseProtection: true,
        multiGateDirectionTracking: true,
        enterpriseSsoSamlOidc: true,
      },
    },
    { headers: corsHeaders }
  );
}
