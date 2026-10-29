import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { HIGH_INTENT_30_BY_SLUG, type HighIntentPage as Page } from "@/lib/seo/high-intent-30";

const base = "https://urpass.space";

export default function HighIntentPage({ page }: { page: Page }) {
  const url = `${base}/solutions/${page.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, name: page.title, description: page.description, url, inLanguage: "en-IN" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Features", item: `${base}/features` },
        { "@type": "ListItem", position: 3, name: page.h1, item: url },
      ] },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 px-6 py-20 text-white md:py-28">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-violet-200"><Link href="/">Home</Link><span className="mx-2">/</span><Link href="/features">Features</Link><span className="mx-2">/</span><span>{page.eyebrow}</span></nav>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">{page.eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{page.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-violet-100">{page.answer}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/signup?source=solution&campaign=${encodeURIComponent(page.slug)}`} className="rounded-xl bg-white px-6 py-3 font-semibold text-violet-950 hover:bg-violet-100">Create your event</Link>
              <Link href="/pricing" className="rounded-xl border border-violet-300 px-6 py-3 font-semibold text-white hover:bg-white/10">See current plans</Link>
            </div>
            <p className="mt-5 text-sm text-violet-200">For {page.audience}.</p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)]">
          <div className="space-y-16">
            <section aria-labelledby="challenge"><p className="text-sm font-semibold uppercase tracking-widest text-violet-700">The challenge</p><h2 id="challenge" className="mt-2 text-3xl font-bold">Make every registration usable at the door</h2><p className="mt-4 text-lg leading-8 text-slate-700">{page.problem}</p>{page.localNote && <p className="mt-4 leading-7 text-slate-700">{page.localNote}</p>}</section>
            <section aria-labelledby="workflow"><p className="text-sm font-semibold uppercase tracking-widest text-violet-700">Workflow</p><h2 id="workflow" className="mt-2 text-3xl font-bold">From event page to attendance record</h2><ol className="mt-7 grid gap-4 md:grid-cols-3">{page.steps.map((step, i) => <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><span className="inline-flex size-9 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-800">{i + 1}</span><p className="mt-4 leading-7 text-slate-700">{step}</p></li>)}</ol></section>
            <section aria-labelledby="fit"><p className="text-sm font-semibold uppercase tracking-widest text-violet-700">Use cases</p><h2 id="fit" className="mt-2 text-3xl font-bold">When this setup fits</h2><ul className="mt-5 space-y-3">{page.fit.map((item) => <li key={item} className="rounded-xl border-l-4 border-violet-500 bg-violet-50 px-5 py-4 leading-7">{item}</li>)}</ul></section>
            <section aria-labelledby="prepare"><p className="text-sm font-semibold uppercase tracking-widest text-violet-700">Before launch</p><h2 id="prepare" className="mt-2 text-3xl font-bold">Organizer checklist</h2><ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-700">{page.checklist.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-6 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Scope:</strong> {page.limitation}</p></section>
            <section aria-labelledby="questions"><p className="text-sm font-semibold uppercase tracking-widest text-violet-700">Questions</p><h2 id="questions" className="mt-2 text-3xl font-bold">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">{page.faqs.map(({ q, a }) => <div key={q} className="py-5"><h3 className="font-semibold">{q}</h3><p className="mt-2 leading-7 text-slate-700">{a}</p></div>)}</div></section>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold">Ready to set up this event?</h2><p className="mt-3 leading-7 text-slate-700">Start with the event details you have. Configure registration and entry before publishing.</p><Link href={`/signup?source=solution&campaign=${encodeURIComponent(page.slug)}`} className="mt-5 inline-block rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800">Create your event</Link><p className="mt-4 text-sm text-slate-600">Review current pricing and plan limits on the <Link href="/pricing" className="underline">pricing page</Link>.</p></div>
            <div className="rounded-2xl border border-slate-200 p-6"><h2 className="text-lg font-bold">Related guides</h2><ul className="mt-4 space-y-3">{page.related.map((href) => { const slug = href.split("/").at(-1) || ""; const related = HIGH_INTENT_30_BY_SLUG.get(slug); return <li key={href}><Link href={href} className="font-medium text-violet-700 underline-offset-4 hover:underline">{related?.h1 ?? slug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ")}</Link></li>; })}</ul></div>
          </aside>
        </div>
        <section className="bg-slate-950 px-6 py-16 text-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-bold">Build the registration flow for your event</h2><p className="mt-3 text-slate-300">Set capacity, collect the right details and prepare QR entry from one organizer workspace.</p></div><Link href={`/signup?source=solution&campaign=${encodeURIComponent(page.slug)}`} className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950">Get started</Link></div></section>
      </main>
      <Footer />
    </div>
  );
}
