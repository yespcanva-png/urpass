import { NextResponse } from "next/server";
import { getScimSchemas } from "@/lib/sso/scim";

export async function GET() {
  const schemas = getScimSchemas();
  return NextResponse.json(schemas, {
    headers: { "Content-Type": "application/scim+json" }
  });
}
