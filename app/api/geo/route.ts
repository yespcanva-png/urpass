import { NextRequest, NextResponse } from "next/server";
import { detectCountryFromHeaders } from "@/lib/country-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const country = detectCountryFromHeaders(req.headers);
  const cityHeader =
    req.headers.get("x-vercel-ip-city") ||
    req.headers.get("x-real-ip-city") ||
    req.headers.get("cf-ipcity") ||
    null;
  const isUk = country === "GB";
  return NextResponse.json({
    country,
    city: cityHeader ? decodeURIComponent(cityHeader) : null,
    currency: isUk ? "GBP" : "INR",
    currencySymbol: isUk ? "£" : "₹",
    isUk,
    isIndia: country === "IN",
  });
}
