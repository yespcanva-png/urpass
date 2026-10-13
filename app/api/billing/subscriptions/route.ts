import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    { error: "Free trials are no longer available. Please activate a paid subscription." },
    { status: 410 }
  );
}
