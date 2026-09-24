import { redirect } from "next/navigation";

export default async function EventPassDesignPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  redirect(`/studio/${eventId}`);
}
