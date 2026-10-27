import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserConnectedApps, revokeUserConnections } from "@/lib/mcp/oauth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        connected: false,
        authenticated: false,
      });
    }

    const apps = getUserConnectedApps(user.id);
    const claudeApp = apps.find((a) => a.clientId === "claude" || a.clientId === "claude-custom") || apps[0];

    if (!claudeApp) {
      return NextResponse.json({
        connected: false,
        authenticated: true,
      });
    }

    return NextResponse.json({
      connected: true,
      authenticated: true,
      clientId: claudeApp.clientId,
      organizationId: claudeApp.organizationId || null,
      scopes: claudeApp.scopes,
      createdAt: new Date(claudeApp.createdAt).toISOString(),
      lastUsedAt: claudeApp.lastUsedAt ? new Date(claudeApp.lastUsedAt).toISOString() : null,
      expiresAt: new Date(claudeApp.expiresAt).toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ connected: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const revokedCount = revokeUserConnections(user.id);

    return NextResponse.json({
      success: true,
      connected: false,
      revokedCount,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return DELETE(req);
}
