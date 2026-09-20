import type { Metadata } from "next";
import { getAnalyticsData } from "@/app/actions/analytics";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics & Insights",
  description: "Real-time event check-in velocity, rush hour curves, and attendee intelligence.",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event } = (await searchParams) ?? {};
  const data = await getAnalyticsData(event);

  return <AnalyticsDashboard initialData={data} />;
}
