import type { Metadata } from "next";
import { getAnalyticsData } from "@/app/actions/analytics";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const data = await getAnalyticsData(eventId);
  return {
    title: data.eventName ? `${data.eventName} — Analytics` : "Event Analytics",
    description: `Live gate velocity and attendance tracking for ${data.eventName || "event"}.`,
    robots: { index: false, follow: false },
  };
}

export default async function EventAnalyticsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const data = await getAnalyticsData(eventId);

  return <AnalyticsDashboard initialData={data} isScopedToEvent={true} />;
}
