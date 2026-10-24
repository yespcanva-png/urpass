import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventNewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const params = new URLSearchParams();

  for (const [key, val] of Object.entries(resolved)) {
    if (typeof val === "string") {
      params.set(key, val);
    } else if (Array.isArray(val)) {
      val.forEach((item) => params.append(key, item));
    }
  }

  const query = params.toString();
  redirect(query ? `/create-event?${query}` : "/create-event");
}
