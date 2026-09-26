import { NextRequest, NextResponse } from "next/server";
import { communicationService } from "@/lib/communications";
import { DeliveryStatus } from "@/lib/communications/types";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  try {
    let payload: Record<string, unknown> = {};

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json().catch(() => ({}));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        formData.forEach((val, key) => {
          payload[key] = val;
        });
      }
    } else {
      payload = await req.json().catch(() => ({}));
    }

    // Extract provider message ID across various provider formats
    const providerMessageId = (
      payload.message_id ||
      payload.messageId ||
      payload.MessageSid ||
      payload.sid ||
      payload.id ||
      payload.request_id
    )?.toString();

    if (!providerMessageId) {
      return NextResponse.json({ error: "Missing provider message identifier" }, { status: 400 });
    }

    // Extract and normalize status
    const rawStatus = (
      payload.status ||
      payload.MessageStatus ||
      payload.delivery_status ||
      payload.event ||
      ""
    )
      .toString()
      .toLowerCase();

    let status: DeliveryStatus = "SENT";
    if (rawStatus.includes("deliver")) {
      status = "DELIVERED";
    } else if (
      rawStatus.includes("fail") ||
      rawStatus.includes("reject") ||
      rawStatus.includes("undeliver") ||
      rawStatus.includes("error")
    ) {
      status = "FAILED";
    } else if (rawStatus.includes("send") || rawStatus.includes("sent")) {
      status = "SENT";
    } else if (rawStatus.includes("queue")) {
      status = "QUEUED";
    }

    const failureReason = (
      payload.error ||
      payload.error_message ||
      payload.ErrorMessage ||
      payload.reason ||
      payload.failure_reason
    )?.toString();

    const deliveredAt = (
      payload.delivered_at ||
      payload.timestamp ||
      payload.date_sent
    )?.toString();

    const cost = typeof payload.cost === "number" ? payload.cost : undefined;

    const updated = await communicationService.updateDeliveryFromWebhook(provider, {
      providerMessageId,
      status,
      failureReason,
      deliveredAt,
      cost,
    });

    return NextResponse.json({ received: true, updated, status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  // Support HTTP GET delivery receipts from Indian DLT SMS gateways (e.g. DLR callback)
  const { provider } = await params;
  const searchParams = req.nextUrl.searchParams;

  const providerMessageId =
    searchParams.get("msg_id") ||
    searchParams.get("messageId") ||
    searchParams.get("sid") ||
    searchParams.get("id");

  const rawStatus = (searchParams.get("status") || "").toLowerCase();

  if (!providerMessageId) {
    return NextResponse.json({ error: "Missing message id parameter" }, { status: 400 });
  }

  let status: DeliveryStatus = "SENT";
  if (rawStatus.includes("deliv")) status = "DELIVERED";
  else if (rawStatus.includes("fail") || rawStatus.includes("rej")) status = "FAILED";

  await communicationService.updateDeliveryFromWebhook(provider, {
    providerMessageId,
    status,
    failureReason: searchParams.get("reason") || undefined,
  });

  return NextResponse.json({ received: true, status });
}
