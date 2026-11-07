import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { detectCountryFromHeaders } from "@/lib/country-config";
import LeadForm from "./LeadForm";

export const metadata: Metadata = { title: "Book an Event Platform Demo | UrPass", description: "See UrPass registration, QR passes and gate check-in for your organisation." };

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ market?: string }> }) {
  const requestedMarket = (await searchParams).market?.toUpperCase();
  const detectedMarket = detectCountryFromHeaders(await headers());
  const market: "GB" | "IN" = requestedMarket === "GB" || requestedMarket === "IN"
    ? requestedMarket
    : detectedMarket === "GB" ? "GB" : "IN";
  return <main className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-900"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm text-violet-700">← UrPass</Link><p className="mt-10 text-sm font-semibold uppercase tracking-wide text-violet-700">For teams and institutions</p><h1 className="mt-2 text-4xl font-bold">Plan your event with UrPass</h1><p className="mt-4 max-w-2xl text-neutral-600">Tell us about your event. We’ll show you registration, digital QR passes, and entry scanning for your team. {market === "GB" ? "UK billing is discussed during the demo." : "India plans start at ₹499 per month plus GST; a free plan is available for smaller events."}</p><div className="mt-8"><LeadForm market={market} /></div><p className="mt-6 text-sm text-neutral-600">Planning a smaller event? <Link href="/signup" className="font-semibold text-violet-700 underline">Create your free account</Link>.</p></div></main>;
}
