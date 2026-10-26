"use client";

import { useEffect } from "react";
import { trackExploreJourneyAction } from "@/app/actions/explore-attribution";

export default function ExploreJourneyTracker({ eventId, stage }: { eventId: string; stage: "detail_view" | "ticket_selection" | "registration_start" }) {
  useEffect(() => { void trackExploreJourneyAction(eventId, stage); }, [eventId, stage]);
  return null;
}
