import type { Metadata } from "next";
import { generateOctober23Metadata, October23SeoPage } from "@/lib/seo/october-23-batch";

const slug = "mumbai-exhibition-guest-management";

export const metadata: Metadata = generateOctober23Metadata(slug);

export default function Page() {
  return <October23SeoPage slug={slug} />;
}
