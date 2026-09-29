import { NextRequest } from "next/server";
import { handleRazorpayWebhook, handleWebhookGet, handleWebhookHead } from "@/lib/razorpay-webhook";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleRazorpayWebhook(req);
}

export async function GET() {
  return handleWebhookGet();
}

export async function HEAD() {
  return handleWebhookHead();
}
