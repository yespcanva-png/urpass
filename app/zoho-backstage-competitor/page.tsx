import { generateNext25Metadata, Next25SeoPage } from "@/lib/seo/next-25-pages";

const slug = "zoho-backstage-competitor";

export const metadata = generateNext25Metadata(slug);

export default function Page() {
  return <Next25SeoPage slug={slug} />;
}
