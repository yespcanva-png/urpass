import { redirect } from "next/navigation";

export default async function ApplyPassPage({
  params,
}: {
  params: Promise<{ eventId: string; passToken: string }>;
}) {
  const { passToken } = await params;
  redirect(`/pass/${passToken}`);
}
