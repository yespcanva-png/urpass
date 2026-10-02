import { NextResponse } from "next/server";
import {
  getSponsorshipTiersDb,
  saveSponsorshipTierDb,
  deleteSponsorshipTierDb,
  getEventSponsorsDb,
  saveEventSponsorDb,
  deleteEventSponsorDb,
  updateSponsorDeliverableDb,
} from "@/lib/exhibitor-sponsor/sponsor-service";
import { logOpsAuditDb } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const [tiers, sponsors] = await Promise.all([
      getSponsorshipTiersDb(eventId),
      getEventSponsorsDb(eventId),
    ]);
    return NextResponse.json({ success: true, tiers, sponsors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load sponsors" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const {
      action,
      sponsor,
      sponsorId,
      tier,
      tierId,
      deliverableKey,
      deliverableStatus,
      staffName,
    } = body;

    if (action === "save_sponsor" && sponsor) {
      const saved = await saveEventSponsorDb({ ...sponsor, eventId });
      await logOpsAuditDb(
        eventId,
        "payment_status_change",
        "payment",
        saved.id,
        { action: "save_sponsor", name: saved.name, tierId: saved.tierId },
        staffName || "Sponsor Manager"
      );
      return NextResponse.json({ success: true, sponsor: saved });
    }

    if (action === "delete_sponsor" && sponsorId) {
      await deleteEventSponsorDb(eventId, sponsorId);
      return NextResponse.json({ success: true });
    }

    if (action === "save_tier" && tier) {
      const saved = await saveSponsorshipTierDb({ ...tier, eventId });
      return NextResponse.json({ success: true, tier: saved });
    }

    if (action === "delete_tier" && tierId) {
      await deleteSponsorshipTierDb(eventId, tierId);
      return NextResponse.json({ success: true });
    }

    if (action === "update_deliverable" && sponsorId && deliverableKey) {
      const ok = await updateSponsorDeliverableDb(eventId, sponsorId, deliverableKey, Boolean(deliverableStatus));
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Sponsor operation failed" },
      { status: 500 }
    );
  }
}
