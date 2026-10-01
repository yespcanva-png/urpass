import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const featureKey = body.featureKey || "whats_new_conference_dismissed";

    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      [featureKey]: true,
      whats_new_last_dismissed_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase.auth.updateUser({
      data: updatedMetadata,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
