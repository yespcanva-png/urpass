import { NextResponse } from "next/server";
import { OPS_COOKIE_NAME } from "@/lib/ops/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Operational session terminated.",
  });

  response.cookies.set({
    name: OPS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
