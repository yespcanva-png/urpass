import Link from "next/link";
import { unsubscribeExploreNewsletter } from "@/lib/explore/ads-service";
import { redirect } from "next/navigation";

export const metadata = { title: "Unsubscribe from Explore updates", robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string; done?: string }> }) {
  const { token, done } = await searchParams;
  async function unsubscribe() {
    "use server";
    if (token) await unsubscribeExploreNewsletter(token);
    redirect("/explore/unsubscribe?done=1");
  }
  return <main className="min-h-screen grid place-items-center bg-violet-50 p-6"><div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-neutral-900">Explore event updates</h1>{done ? <p className="mt-4 text-neutral-600">Your unsubscribe request has been processed.</p> : <><p className="mt-4 text-neutral-600">Stop receiving event updates for this address.</p><form action={unsubscribe}><button className="mt-6 rounded-xl bg-violet-700 px-5 py-2.5 font-semibold text-white">Unsubscribe</button></form></>}<Link href="/explore" className="mt-6 inline-block text-violet-700 underline">Back to Explore</Link></div></main>;
}
