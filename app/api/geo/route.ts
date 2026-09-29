import { NextRequest, NextResponse } from "next/server";
import { detectCountryFromHeaders } from "@/lib/country-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const country = detectCountryFromHeaders(req.headers);
  const isUk = country === "GB";
  return NextResponse.json({
    country,
    currency: isUk ? "GBP" : "INR",
    currencySymbol: isUk ? "£" : "₹",
    isUk,
    isIndia: country === "IN",
  });
}
