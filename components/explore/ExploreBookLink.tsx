"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { trackExploreJourneyAction } from "@/app/actions/explore-attribution";

export default function ExploreBookLink({ eventId, href, className, children }: {
  eventId: string; href: string; className: string; children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <a href={href} className={className} aria-disabled={pending} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    startTransition(async () => {
      try { await trackExploreJourneyAction(eventId, "detail_view"); } finally { router.push(href); }
    });
  }}>{children}</a>;
}
